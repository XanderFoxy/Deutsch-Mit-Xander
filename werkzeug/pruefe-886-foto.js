#!/usr/bin/env node
/* =====================================================================
   SONDE 886 — DAS FOTO AUF „ÜBER MICH“ DIREKT UND FRÜHER (S8, freigegeben Funk 311; Ladezeit-Entwurf)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   263): „sofort im Livestream wie bei HelloTalk" · (Funk 310/312): „das
   Maximum rausholen", „die maximal professionellste Lösung".
   Befund bis 886/S2: Das Foto kam von github.com/…?raw=true (fremder Server,
   Umleitung auf raw.githubusercontent.com, das ganze Originalfoto – 1 369 667
   Byte, 4632 × 6176 – für 76 × 76 Punkte) und hatte loading="lazy" (geholt
   erst nach dem ersten Layout).
   S8: eigene, gestempelte Kopien bilder/ueber-alex-<px>.webp (heute 145 für 1x
   und 290 für 2x/3x – die Mip-Stufen, aus denen Chrome das Original malte;
   srcset, werkzeug/foto-ueber.js). Der Wächter im Kopf (S2) nimmt lazy
   weg – nach dem Einsetzen eines gemerkten eigenen Fotos, damit nur das
   geholt wird, was man sieht. Ein gespeicherter Link auf das Original (die
   alte github-Adresse oder eine Adresse der Kopie) gilt als Original.
   Geprüft (Telefon 390 × 844, Datenbank nachgestellt wie in pruefe-885-ueber.js):
     Q  Bauweise: src/srcset zeigen auf die Kopien, Stempel = Inhalt, quadratisch
        und je Dichte mindestens 76 · Dichte Pixel (bis 3x), keine github-Adresse
        mehr, Wächter nimmt lazy weg, app.js (Kern) kennt das Original
     A  Erstbesuch je DPR 1/2/3, Datenbank-Foto = alte github-Adresse: genau eine
        Foto-Anfrage (die zur Dichte passende Kopie), keine an github, Anfrage vor dem ersten
        Bild (nicht lazy), am Ende die Kopie (srcset bleibt)
     B  Wiederkehr (Merker = github-Adresse): ebenso, kein Wechsel der Adresse
     C  Merker = eigenes Foto X: die Kopie wird gar nicht geholt, X vor dem
        ersten Bild angefragt, gezeigt wird X (srcset weg)
     D  Merker X, Datenbank inzwischen „zurück zum Original“ (""): am Ende
        src/srcset genau wie in index.html, gezeigt die Kopie
     E  Datenbank = Adresse der Kopie mit altem Stempel (so speichert das
        Formular nach S8): bleibt die Kopie, die alte Adresse wird nie geholt
     F  kaputter Merker: Foto trotzdem sofort, eine Anfrage
     V  (GEGEN + Original) Bildvergleich DPR 1/2/3: Stand GEGEN (Original von
        github, nachgestellt aus QUELLE) gegen diesen Stand, Ausschnitt um das
        Foto: Farbe ±1 je Kanal, geglättet (1 CSS-Pixel) ≥ 33 dB; roh genannt
     M  (MESSEN=n, GEGEN, QUELLE) Bytes des Fotos, „Foto geladen“ und „Foto
        gemalt“ (Element Timing) je ab Start und − erstes Bild, 4G + CPU 4×,
        github nachgestellt (2 neue Verbindungen à 3 Rundreisen + je 1 Anfrage,
        Umleitung, Übertragung mit 9 Mbit/s) – ein MODELL, kein echtes github;
        Routen schalten den HTTP-Speicher ab (zweites Öffnen = Verbindungen warm)
     P  keine Seitenfehler
   Das ORIGINAL liegt nicht im Repo (1,3 MB): für V und M QUELLE=<Pfad> angeben
   (XanderFoxy/Deutsch, Bilder2/9ob2nzt2.jpeg). Ohne QUELLE bricht die
   nachgestellte github-Anfrage ab (A–F prüfen ohnehin, dass keine kommt).
   Aufruf:   node werkzeug/pruefe-886-foto.js
   Gegenprobe (Stand vor S8):
     S=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/<sitzung>/scratchpad
     git archive <vorher> index.html app.js min | tar -x -C $S/gegen886/foto-vorher (Rest als Verweis)
     WURZEL=$S/gegen886/foto-vorher node werkzeug/pruefe-886-foto.js
   Bildvergleich/Messen: QUELLE=<Original> GEGEN=$S/gegen886/foto-vorher [MESSEN=10] node werkzeug/pruefe-886-foto.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { PNG } = require("/tmp/claude-0/node_modules/pngjs");
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib"), crypto = require("crypto");
const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : "";
const MESSEN = Math.max(0, Number(process.env.MESSEN || 0));
const NUR_V = Boolean(process.env.NUR_V);   // nur Bildvergleich (und Messen), zum Abstimmen von werkzeug/foto-ueber.js
const QUELLE = process.env.QUELLE ? path.resolve(process.env.QUELLE) : "";
const UMD_TEXT = fs.readFileSync(process.env.SUPABASE_UMD || "/tmp/dma-mess-supabase-js-2.117.3.umd.js", "utf8");
const ORIG_URL = "https://github.com/XanderFoxy/Deutsch/blob/main/Bilder2/9ob2nzt2.jpeg?raw=true";
const KOPIE = /\/bilder\/ueber-alex-(\d+)\.webp/;
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
const sha10 = (f) => crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 10);

/* Breite × Höhe aus dem WebP-Kopf (VP8X, VP8 verlustbehaftet, VP8L verlustfrei) */
function webpGroesse(f) {
  const b = fs.readFileSync(f);
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const art = b.toString("ascii", 12, 16);
  if (art === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (art === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (art === "VP8L") { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
  return null;
}

/* Das Foto in „Über mich“ aus index.html: src, srcset, ganze Zeile */
function fotoAusHtml(wurzel) {
  const html = fs.readFileSync(path.join(wurzel, "index.html"), "utf8");
  const sek = html.slice(html.indexOf('id="view-about"'), html.indexOf('id="view-learn"'));
  const img = (sek.match(/<img [^>]*>/) || [""])[0];
  const attr = (n) => { const m = img.match(new RegExp(" " + n + '="([^"]*)"')); return m ? m[1] : null; };
  return { html, sek, img, src: attr("src"), srcset: attr("srcset") };
}

/* Die Kandidaten aus srcset ([{ u, d, g }]) und welcher bei Gerätedichte dpr gewählt wird (der kleinste mit d ≥ dpr,
   sonst der größte – so wählt Chrome bei leerem Speicher) */
function kandidaten(H) {
  return (H.srcset || "").split(",").map((x) => x.trim().split(/\s+/)).filter((x) => x[0])
    .map(([u, d]) => ({ u, d: parseFloat(d), g: Number((u.match(/ueber-alex-(\d+)\.webp/) || [])[1]) }));
}
function gewaehlt(H, dpr) {
  const k = kandidaten(H).sort((a, b) => a.d - b.d);
  return k.find((x) => x.d >= dpr) || k[k.length - 1];
}

function server(wurzel) {
  const datei = new Map(), anfragen = [];
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const bild = /^\/bilder\//.test(p);
    if (bild) anfragen.push(q.url);
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
    if (bild) zaehler.bytes += d.inhalt.length;
    a.end(gz ? d.gz : d.inhalt);
  });
  const zaehler = { bytes: 0 };
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok({ srv, anfragen, zaehler, basis: "http://127.0.0.1:" + srv.address().port + "/index.html" })));
}

/* Bildvergleich zweier PNG-Bildschirmfotos gleicher Größe:
   roh     PSNR Pixel für Pixel (straft schon eine Verschiebung um einen Bruchteil eines Pixels an harten Kanten)
   glatt   PSNR nach Weichzeichnen um 1 CSS-Pixel (σ = DPR) – was ein Auge auf dem Telefon unterscheiden kann
   farbe   größte Abweichung der Mittelwerte je Kanal (Farbstich, Helligkeit; Farbprofil vergessen?)
   Weichzeichnen mit ImageMagick (convert), wie werkzeug/foto-ueber.js. */
function psnr(A, B) {
  let se = 0, n = 0;
  for (let i = 0; i < A.data.length; i += 4) for (let k = 0; k < 3; k++) { const d = A.data[i + k] - B.data[i + k]; se += d * d; n++; }
  return se === 0 ? 99 : 10 * Math.log10(255 * 255 / (se / n));
}
function weich(png, sigma) {
  return PNG.sync.read(require("child_process").execFileSync("convert", ["png:-", "-blur", "0x" + sigma, "png:-"], { input: png }));
}
function vergleich(a, b, dpr) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  if (A.width !== B.width || A.height !== B.height) return { roh: 0, glatt: 0, farbe: 255, groesse: A.width + "×" + A.height + " / " + B.width + "×" + B.height };
  const mA = [0, 0, 0], mB = [0, 0, 0];
  for (let i = 0; i < A.data.length; i += 4) for (let k = 0; k < 3; k++) { mA[k] += A.data[i + k]; mB[k] += B.data[i + k]; }
  const n = A.data.length / 4;
  return { roh: psnr(A, B), glatt: psnr(weich(a, dpr), weich(b, dpr)), farbe: Math.max(...mA.map((x, k) => Math.abs(x - mB[k]) / n)), groesse: A.width + "×" + A.height };
}
const zeige = (v) => "roh " + v.roh.toFixed(1) + " dB, geglättet " + v.glatt.toFixed(1) + " dB, Farbe ±" + v.farbe.toFixed(2);

(async () => {
  const H = fotoAusHtml(WURZEL);
  const quelleDa = Boolean(QUELLE) && fs.existsSync(QUELLE);
  const QUELLE_BYTES = quelleDa ? fs.readFileSync(QUELLE) : null;
  /* Eigene Fotos (wie die Speicher-Adresse der Datenbank), jede Anfrage mitgezählt */
  const fotoAnfragen = [];
  const fotoSrv = http.createServer((q, a) => {
    fotoAnfragen.push(q.url);
    a.writeHead(200, { "Content-Type": "image/svg+xml", "Cache-Control": "max-age=600" });
    a.end('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#c85"/></svg>');
  });
  await new Promise((ok) => fotoSrv.listen(0, "127.0.0.1", ok));
  const X_URL = "http://127.0.0.1:" + fotoSrv.address().port + "/x.svg";
  const TEXTE = { heading: "Hallo, ich bin Alex!", role: "Musiker & Deutschlehrer, 46", shortText: "", supportNote: "" };

  const haupt = await server(WURZEL);
  const gegen = GEGEN ? await server(GEGEN) : null;
  /* Kein Proxy, kein fremder Name (nur 127.0.0.1): nichts verlässt den Rechner – auch keine Anfrage, an der eine Route vorbeigeht */
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });
  const seitenFehler = [];

  /* z: { about, dbMs, github: 0, githubMs: [Verzögerung github.com, Verzögerung raw], aboutAbfragen } */
  async function kontext(z, o) {
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: o.dpr || 2, serviceWorkers: "block",
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => {
      const u = r.request().url();
      if (/cdn\.jsdelivr\.net\/.*supabase/.test(u)) return r.fulfill({ status: 200, contentType: "text/javascript", body: UMD_TEXT });
      /* github nachgestellt OHNE echte Umleitung (eine Umleitung auf einen fremden Namen liefe an der Route vorbei):
         die Zeit für github.com → 302 → raw.githubusercontent.com steckt in der Verzögerung (githubMs = [Umleitung, Bild]) */
      if (/github\.com\/XanderFoxy\/|githubusercontent\.com/.test(u)) {
        z.github++;
        const [d1, d2] = z.githubMs || [0, 0];
        if (!QUELLE_BYTES) return r.abort();
        /* timing-allow-origin nur, damit Element Timing die Malzeit nennt (ohne ihn meldet Chrome für fremde Bilder 0) */
        return warte(d1 + d2).then(() => { z.githubBytes = (z.githubBytes || 0) + QUELLE_BYTES.length;
          return r.fulfill({ status: 200, contentType: "image/jpeg", headers: { "cache-control": "max-age=300", "timing-allow-origin": "*" }, body: QUELLE_BYTES }); }).catch(() => {});
      }
      const k = decodeURIComponent(u);
      if (/supabase\.co\/rest\/v1\/site_content/.test(k) && /key=eq\.about(&|$)/.test(k)) {
        z.aboutAbfragen++;
        const modus = z.about;
        return warte(z.dbMs).then(() => {
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
      window.__foto = []; window.__fcp = null; window.__fotoSteht = null; window.__lazyBeiDcl = null; window.__fotoGemalt = null;
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.name === "first-contentful-paint") window.__fcp = Math.round(e.startTime); })).observe({ type: "paint", buffered: true }); } catch (e) {}
      /* „Foto gemalt“: Element Timing (renderTime = das Bild ist auf dem Schirm, mit Dekodieren). Das Merkmal elementtiming
         setzt die Sonde, sobald der Parser das Bild anlegt – es ändert am Laden nichts. */
      try {
        new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.identifier === "foto" && window.__fotoGemalt == null) window.__fotoGemalt = Math.round(e.renderTime || e.loadTime); })).observe({ type: "element", buffered: true });
        const mo = new MutationObserver(() => { const i = document.querySelector("#view-about .avatar-wrap img"); if (i) { i.setAttribute("elementtiming", "foto"); mo.disconnect(); } });
        mo.observe(document, { childList: true, subtree: true });
      } catch (e) {}
      let letzte;
      const schritt = () => {
        const i = document.querySelector("#view-about .avatar-wrap img");
        if (i) {
          const s = JSON.stringify([i.getAttribute("src"), i.getAttribute("srcset"), i.currentSrc, i.complete && i.naturalWidth > 0]);
          if (s !== letzte) { window.__foto.push({ t: Math.round(performance.now()), s }); letzte = s; }
          if (window.__fotoSteht == null && i.complete && i.naturalWidth > 0) window.__fotoSteht = Math.round(performance.now());
        }
        requestAnimationFrame(schritt);
      };
      requestAnimationFrame(schritt);
      document.addEventListener("DOMContentLoaded", () => {
        const i = document.querySelector("#view-about .avatar-wrap img");
        window.__lazyBeiDcl = i ? i.getAttribute("loading") : "kein Bild";
      });
    }, [o.merker === undefined ? null : o.merker]);
    if (o.drossel) ctx.__drossel = true;
    return ctx;
  }

  async function oeffnen(ctx, z, srv, o) {
    o = o || {};
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    if (ctx.__drossel) {
      const cdp = await ctx.newCDPSession(pg);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 750e3 / 8 });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    const vorAbfragen = z.aboutAbfragen, vorKopie = srv.anfragen.length, vorX = fotoAnfragen.length, vorBytes = srv.zaehler.bytes;
    z.github = 0; z.githubBytes = 0;
    await pg.goto(srv.basis, { waitUntil: "domcontentloaded", timeout: 60000 });
    const t0 = Date.now();
    while (z.aboutAbfragen === vorAbfragen && Date.now() - t0 < 20000) await warte(50);
    await warte(z.dbMs + 1500);
    const t1 = Date.now();
    while (Date.now() - t1 < 15000 && !(await pg.evaluate(() => window.__fotoSteht != null && (window.__fotoGemalt != null || !window.PerformanceElementTiming)))) await warte(50);
    const st = await pg.evaluate(() => {
      const i = document.querySelector("#view-about .avatar-wrap img");
      const res = performance.getEntriesByType("resource").filter((e) => /bilder\/ueber-alex|x\.svg|github/.test(e.name))
        .map((e) => ({ name: e.name, start: Math.round(e.startTime), ende: Math.round(e.responseEnd), bytes: e.encodedBodySize }));
      let m = null;
      try { m = localStorage.getItem("dma-ueber"); } catch (e) {}
      return { foto: window.__foto.slice(), fcp: window.__fcp, steht: window.__fotoSteht, gemalt: window.__fotoGemalt, lazyBeiDcl: window.__lazyBeiDcl, res, merker: m,
        src: i && i.getAttribute("src"), srcset: i && i.getAttribute("srcset"), current: i && i.currentSrc, nw: i && i.naturalWidth };
    });
    if (o.bild) {
      await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const box = await pg.evaluate(() => { const r = document.querySelector("#view-about .avatar-wrap img").getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
      st.bild = await pg.screenshot({ clip: { x: Math.floor(box.x) - 2, y: Math.floor(box.y) - 2, width: Math.ceil(box.width) + 4, height: Math.ceil(box.height) + 4 }, animations: "disabled" });
    }
    st.kopie = srv.anfragen.slice(vorKopie);
    st.x = fotoAnfragen.slice(vorX);
    st.github = z.github;
    st.bytes = srv.zaehler.bytes - vorBytes + z.githubBytes;
    await pg.close();
    return st;
  }
  const fotoReq = (st) => st.res.filter((e) => KOPIE.test(e.name) || /x\.svg/.test(e.name));
  const kurzUrl = (u) => String(u || "–").replace(/^https?:\/\/127\.0\.0\.1:\d+\//, "").slice(0, 60);
  const merkerMit = (photoUrl) => JSON.stringify({ f: "886", t: Date.now(), w: Object.assign({}, TEXTE, { photoUrl }) });

  try {
    /* ---------------- Q: Bauweise ---------------- */
    abschnitt("Q  Bauweise");
    {
      teil = "Q1";
      const K = kandidaten(H);
      const passend = K.length >= 2 && K.every(({ u, d }, j) => {
        const m = u.match(/^bilder\/ueber-alex-(\d+)\.webp\?v=([0-9a-f]{10})$/);
        const f = m && path.join(WURZEL, "bilder", "ueber-alex-" + m[1] + ".webp");
        return m && d === j + 1 && fs.existsSync(f) && sha10(f) === m[2];
      });
      const zwei = K.find((k) => k.d === 2);
      sage(passend && zwei && H.src === zwei.u, "src = 2x-Kopie, srcset 1x/2x(/3x) auf eigene Kopien, Stempel = Inhalt", H.img.slice(0, 220));
      teil = "Q2";
      const groessen = K.map((k) => { const f = path.join(WURZEL, "bilder", "ueber-alex-" + k.g + ".webp"); return fs.existsSync(f) ? { g: k.g, d: k.d, wh: webpGroesse(f), b: fs.statSync(f).size } : { g: k.g, d: k.d, wh: null, b: 0 }; });
      sage(groessen.length >= 2 && groessen.every((x) => x.wh && x.wh[0] === x.g && x.wh[1] === x.g && x.g >= 76 * x.d) && Math.max(...groessen.map((x) => x.g)) >= 228,
        "die Kopien sind quadratisch (WebP), je Dichte mindestens 76 · Dichte Pixel, die größte reicht für 3x (228)", groessen.map((x) => x.d + "x: " + (x.wh ? x.wh.join("×") : "–") + ", " + x.b + " B").join(" · "));
      teil = "Q3";
      sage(!/github\.com|raw=true|githubusercontent/.test(H.sek), "keine github-Adresse mehr in „Über mich“");
      teil = "Q4";
      const w = H.html.indexOf('localStorage.getItem("dma-ueber")'), weg = H.html.indexOf('i.removeAttribute("loading")'), blaetter = H.html.indexOf("document.write('<link rel=\"stylesheet\"");
      sage(w > 0 && weg > w && weg < blaetter, "der Wächter im Kopf (vor den Stilblättern) nimmt lazy weg – nach dem Einsetzen eines gemerkten Fotos");
      teil = "Q5";
      const kern = fs.readFileSync(path.join(WURZEL, "min/app.js"), "utf8");
      sage(kern.indexOf("9ob2nzt2") >= 0 && kern.indexOf("ueber-alex-") >= 0, "app.js (Kern, min/app.js) kennt das Original (github-Adresse und Kopie)");
    }

    /* ---------------- A, B: Erstbesuch und Wiederkehr je DPR ---------------- */
    for (const dpr of NUR_V ? [] : [1, 2, 3]) {
      abschnitt("A/B  DPR " + dpr + ": Datenbank-Foto = alte github-Adresse");
      const z = { about: { wert: Object.assign({}, TEXTE, { photoUrl: ORIG_URL }) }, dbMs: 300, github: 0, aboutAbfragen: 0 };
      const ctx = await kontext(z, { dpr });
      const wahl = gewaehlt(H, dpr) || { g: 0, d: 1 };
      const soll = "ueber-alex-" + wahl.g + ".webp", nwSoll = wahl.g / wahl.d;
      for (const [name, nr] of [["A", 1], ["B", 2]]) {
        const st = await oeffnen(ctx, z, haupt);
        const req = fotoReq(st);
        teil = name + dpr;
        sage(st.github === 0 && st.kopie.length <= 1 && st.kopie.every((u) => u.indexOf(soll) >= 0) && (nr === 2 || st.kopie.length === 1),
          (nr === 1 ? "Erstbesuch" : "Wiederkehr") + ": nur die passende Kopie geholt (" + soll + "), nichts von github",
          "Kopie-Anfragen: " + (st.kopie.map(kurzUrl).join(", ") || "keine (HTTP-Speicher)") + ", github: " + st.github);
        sage(st.lazyBeiDcl === null, "bei DOMContentLoaded ist lazy schon weg", "loading=" + st.lazyBeiDcl);
        const r0 = req[0];
        sage(Boolean(r0 && st.fcp != null && r0.start <= st.fcp), "das Foto wird vor dem ersten Bild angefragt (nicht erst nach dem Layout)",
          r0 ? "Anfrage " + r0.start + " ms, erstes Bild " + st.fcp + " ms, Foto steht " + st.steht + " ms" : "keine Anfrage gesehen");
        /* naturalWidth eines srcset-Kandidaten ist schon durch die Dichte geteilt: 290 px bei 2x = 145 */
        sage(st.current && st.current.indexOf(soll) >= 0 && st.srcset === H.srcset && st.src === H.src && st.nw === nwSoll,
          "am Ende die Kopie " + soll + " (src/srcset wie index.html)", "current " + kurzUrl(st.current) + ", nw " + st.nw);
        const adressen = new Set(st.foto.map((f) => JSON.parse(f.s)[0]));
        sage(adressen.size === 1, "kein Wechsel der Adresse in keinem Bild", [...adressen].map(kurzUrl).join(" → "));
      }
      await ctx.close();
    }

    /* ---------------- C: eigenes Foto gemerkt ---------------- */
    if (!NUR_V) {
    abschnitt("C  Merker = eigenes Foto X, Datenbank = X");
    {
      const z = { about: { wert: Object.assign({}, TEXTE, { photoUrl: X_URL }) }, dbMs: 300, github: 0, aboutAbfragen: 0 };
      const ctx = await kontext(z, { dpr: 2, merker: merkerMit(X_URL) });
      const st = await oeffnen(ctx, z, haupt);
      teil = "C1";
      sage(st.kopie.length === 0 && st.github === 0, "die Kopie aus index.html wird gar nicht erst geholt", "Kopie: " + st.kopie.length + ", github: " + st.github);
      teil = "C2";
      const rx = st.res.find((e) => /x\.svg/.test(e.name));
      sage(st.x.length === 1 && rx && st.fcp != null && rx.start <= st.fcp, "X genau einmal angefragt, vor dem ersten Bild", rx ? "Anfrage " + rx.start + ", erstes Bild " + st.fcp + ", X-Anfragen " + st.x.length : "keine");
      teil = "C3";
      sage(st.current === X_URL && st.srcset === null && st.foto.every((f) => JSON.parse(f.s)[0] === X_URL), "gezeigt wird X (srcset weg), in keinem Bild die Kopie", "current " + kurzUrl(st.current) + ", srcset " + st.srcset);
      await ctx.close();
    }

    /* ---------------- D: zurück zum Original ---------------- */
    abschnitt("D  Merker X, Datenbank inzwischen „zurück zum Original“ (photoUrl \"\")");
    {
      const z = { about: { wert: Object.assign({}, TEXTE, { photoUrl: "" }) }, dbMs: 300, github: 0, aboutAbfragen: 0 };
      const ctx = await kontext(z, { dpr: 2, merker: merkerMit(X_URL) });
      const st = await oeffnen(ctx, z, haupt);
      teil = "D";
      const w2 = gewaehlt(H, 2) || { g: 0, d: 1 };
      sage(st.src === H.src && st.srcset === H.srcset && st.current && st.current.indexOf("ueber-alex-" + w2.g + ".webp") >= 0 && st.nw === w2.g / w2.d,
        "am Ende src/srcset genau wie in index.html, gezeigt die Kopie", "src " + kurzUrl(st.src) + ", current " + kurzUrl(st.current) + ", nw " + st.nw);
      sage(st.github === 0, "nichts von github", "github: " + st.github);
      await ctx.close();
    }

    /* ---------------- E: Adresse der Kopie mit altem Stempel gespeichert ---------------- */
    abschnitt("E  Datenbank = Adresse der Kopie mit altem Stempel (Formular nach S8)");
    {
      /* eine Kopie aus einem früheren Bau (andere Größe, die es nicht mehr gibt) und die heutige mit falschem Stempel */
      for (const altPfad of ["bilder/ueber-alex-152.webp?v=0123456789", (H.src || "").replace(/\?v=.*$/, "") + "?v=0123456789"]) {
        const alt = haupt.basis.replace("index.html", altPfad);
        const z = { about: { wert: Object.assign({}, TEXTE, { photoUrl: alt }) }, dbMs: 300, github: 0, aboutAbfragen: 0 };
        const ctx = await kontext(z, { dpr: 2 });
        const a = await oeffnen(ctx, z, haupt);
        const b = await oeffnen(ctx, z, haupt);
        teil = "E";
        const nieAlt = a.kopie.concat(b.kopie).every((u) => u.indexOf("0123456789") < 0) && a.x.length + b.x.length === 0;
        sage(nieAlt && a.src === H.src && b.src === H.src && b.srcset === H.srcset && a.github + b.github === 0,
          altPfad.replace(/\?.*/, "") + " mit altem Stempel: bleibt die Kopie aus index.html, die alte Adresse wird nie geholt (Erstbesuch und Wiederkehr)",
          "Anfragen: " + a.kopie.concat(b.kopie).map(kurzUrl).join(", "));
        await ctx.close();
      }
    }

    /* ---------------- F: kaputter Merker ---------------- */
    abschnitt("F  Kaputter Merker");
    for (const [name, saat] of [["kein JSON", "{kaputt"], ["w ist kein Objekt", JSON.stringify({ f: "884", t: 1, w: "Text" })], ["Foto kein Text", JSON.stringify({ f: "886", t: 1, w: { photoUrl: {} } })]]) {
      const z = { about: "leer", dbMs: 300, github: 0, aboutAbfragen: 0 };
      const ctx = await kontext(z, { dpr: 2, merker: saat });
      const vor = seitenFehler.length;
      const st = await oeffnen(ctx, z, haupt);
      const r0 = fotoReq(st)[0];
      teil = "F";
      sage(st.kopie.length === 1 && st.lazyBeiDcl === null && r0 && r0.start <= st.fcp && seitenFehler.length === vor && st.src === H.src,
        name + ": Foto sofort (eine Anfrage vor dem ersten Bild), keine Seitenfehler", "Anfragen " + st.kopie.length + ", loading " + st.lazyBeiDcl + ", Seitenfehler " + (seitenFehler.length - vor));
      await ctx.close();
    }
    }

    /* ---------------- V: Bildvergleich ---------------- */
    if (gegen && quelleDa) {
      /* Maß: Farbe (Mittelwerte je Kanal ±1 von 255) und geglättet (σ = 1 CSS-Pixel) ≥ 33 dB. Roh wird nur genannt:
         Chrome verkleinert das Original anders als ImageMagick (Mipmaps statt Lanczos) – an harten Kanten ergibt das
         Säume von einem Bruchteil eines Pixels, die roh viel, fürs Auge nichts ausmachen. Probe 20.10. mit einem
         ERSATZBILD (harte Kanten, starkes Rauschen): roh 27,7–29,3 dB, geglättet 34,4–35,0 dB, Farbe ±0,08–0,39;
         Chrome zeigt das Original als JPEG und als verlustfreies PNG Pixel für Pixel gleich (99 dB) – die Abweichung
         kommt allein aus dem Verkleinern. Mit dem echten Foto nachmessen; Seite an Seite: BILDER=<Ordner>. */
      abschnitt("V  Bildvergleich: GEGEN (Original von github, nachgestellt aus " + path.relative(path.join(__dirname, ".."), QUELLE) + ") gegen diesen Stand");
      for (const dpr of [1, 2, 3]) {
        const za = { about: "leer", dbMs: 50, github: 0, aboutAbfragen: 0 }, zb = { about: "leer", dbMs: 50, github: 0, aboutAbfragen: 0 };
        const ca = await kontext(za, { dpr }), cb = await kontext(zb, { dpr });
        const a = await oeffnen(ca, za, gegen, { bild: true }), b = await oeffnen(cb, zb, haupt, { bild: true });
        await ca.close(); await cb.close();
        if (process.env.BILDER) [["vorher", a], ["nachher", b]].forEach(([n, x]) => fs.writeFileSync(path.join(process.env.BILDER, n + "-" + dpr + "x.png"), x.bild));
        const v = vergleich(a.bild, b.bild, dpr);
        teil = "V" + dpr;
        const wv = gewaehlt(H, dpr) || { g: 0, d: 1 };
        sage(a.github > 0 && a.nw > 0 && b.nw === wv.g / wv.d && v.farbe <= 1 && v.glatt >= 33,
          "DPR " + dpr + ": sieht gleich aus (Farbe ±1, geglättet ≥ 33 dB)", zeige(v) + ", Ausschnitt " + v.groesse + ", vorher nw " + a.nw + ", nachher nw " + b.nw);
      }
    } else console.log("\n(V übersprungen: " + (gegen ? "" : "kein GEGEN ") + (quelleDa ? "" : "kein Original unter " + QUELLE) + ")");

    /* ---------------- M: Messung ---------------- */
    if (MESSEN && gegen && quelleDa) {
      /* github-Modell 4G (60 ms): github.com neue Verbindung (DNS + TCP + TLS = 3 Rundreisen) + Anfrage = 240 ms → 302;
         raw.githubusercontent.com ebenso 240 ms + Übertragung des Originals mit 9 Mbit/s. Zweites Öffnen: Verbindungen
         offen (60 ms für die Umleitung). Die eigene Kopie läuft über den gedrosselten Prüfserver (60 ms, 9 Mbit/s). */
      const uebertragung = Math.round(QUELLE_BYTES.length * 8 / 9e6 * 1000);
      abschnitt("M  Foto, 4G + CPU 4×, DPR 2, " + MESSEN + " Paare verschränkt (A = GEGEN, B = dieser Stand); github-Modell 240 + 240 + " + uebertragung + " ms");
      const werte = {};
      for (let i = 0; i < MESSEN; i++) {
        const reihe = i % 2 ? [["B", haupt], ["A", gegen]] : [["A", gegen], ["B", haupt]];
        for (const [name, srv] of reihe) {
          const z = { about: "leer", dbMs: 300, github: 0, aboutAbfragen: 0, githubMs: [240, 240 + uebertragung] };
          const ctx = await kontext(z, { dpr: 2, drossel: true });
          for (const art of ["netz", "speicher"]) {
            if (art === "speicher") z.githubMs = [60, 60 + uebertragung];
            const st = await oeffnen(ctx, z, srv);
            ((werte[art] = werte[art] || {})[name] = werte[art][name] || []).push({ fcp: st.fcp, steht: st.steht, gemalt: st.gemalt, bytes: st.bytes,
              abstand: st.steht != null && st.fcp != null ? st.steht - st.fcp : null, abstandGemalt: st.gemalt != null && st.fcp != null ? st.gemalt - st.fcp : null });
          }
          await ctx.close();
        }
        if (process.env.MESS_JSON) fs.writeFileSync(process.env.MESS_JSON, JSON.stringify(werte, null, 1));
      }
      for (const art of Object.keys(werte)) {
        /* Achtung: Playwright schaltet mit Routen den HTTP-Speicher ab – „zweites Öffnen“ heißt hier: Verbindungen warm,
           Dateien trotzdem neu geholt (der Speicher-Fall fehlt; ladezeit-messen.js misst ihn ohne Routen). */
        console.log("  " + (art === "netz" ? "erstes Öffnen" : "zweites Öffnen (Verbindungen warm; Playwright-Routen: ohne HTTP-Speicher)"));
        for (const k of ["bytes", "fcp", "steht", "gemalt", "abstand", "abstandGemalt"]) {
          const A = werte[art].A.map((x) => x[k]), B = werte[art].B.map((x) => x[k]);
          const d = A.map((x, j) => (B[j] != null && x != null ? B[j] - x : null)).filter((x) => x != null);
          console.log("    " + ({ bytes: "Bytes des Fotos", fcp: "erstes Bild", steht: "Foto geladen", gemalt: "Foto gemalt", abstand: "geladen − erstes Bild", abstandGemalt: "gemalt − erstes Bild" })[k].padEnd(24)
            + "A " + String(median(A)).padStart(8) + "   B " + String(median(B)).padStart(6)
            + "   B−A Median " + String(median(d)).padStart(8) + " (" + d.filter((x) => x < 0).length + " kleiner, " + d.filter((x) => x > 0).length + " größer von " + d.length + ")"
            + (k === "bytes" ? "" : "   A " + Math.min(...A.filter((x) => x != null)) + "…" + Math.max(...A.filter((x) => x != null)) + ", B " + Math.min(...B.filter((x) => x != null)) + "…" + Math.max(...B.filter((x) => x != null))));
        }
      }
      teil = "M";
      const g = (art, n, k) => median(werte[art][n].map((x) => x[k]));
      sage(["netz", "speicher"].every((art) => g(art, "B", "steht") < g(art, "A", "steht") && g(art, "B", "bytes") < g(art, "A", "bytes") / 100),
        "das Foto steht früher und kostet weniger als 1 % der Bytes (je Median, erstes und zweites Öffnen)");
      sage(["netz", "speicher"].every((art) => g(art, "B", "fcp") <= g(art, "A", "fcp") + 54),
        "erstes Bild nicht schlechter (Median B − A ≤ Rauschgrenze 54 ms)", ["netz", "speicher"].map((art) => art + " " + g(art, "A", "fcp") + " → " + g(art, "B", "fcp")).join(", "));
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
