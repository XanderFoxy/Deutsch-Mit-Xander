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
   weg, wenn die Kopie bleibt. Ein gemerktes eigenes Foto setzt er ein und
   lässt es lazy (Nachbesserung 1: wie in S2 erst nach dem ersten Layout –
   ein großes Foto aus dem Formular soll nicht schon beim Lesen der Seite mit
   CSS und JS um die Leitung konkurrieren). Ein gespeicherter Link auf das
   Original (die alte github-Adresse oder eine Adresse der Kopie) gilt als Original.
   Geprüft (Telefon 390 × 844, Datenbank nachgestellt wie in pruefe-885-ueber.js):
     Q  Bauweise: src/srcset zeigen auf die Kopien, Stempel = Inhalt, quadratisch
        und je Dichte mindestens 76 · Dichte Pixel (bis 3x), keine github-Adresse
        mehr, Wächter nimmt lazy weg (nur wenn die Kopie bleibt), app.js (Kern)
        kennt das Original
     A  Erstbesuch je DPR 1/2/3, Datenbank-Foto = alte github-Adresse: genau eine
        Foto-Anfrage (die zur Dichte passende Kopie), keine an github, Anfrage vor dem ersten
        Bild (nicht lazy), am Ende die Kopie (srcset bleibt)
     B  Wiederkehr (Merker = github-Adresse): ebenso, kein Wechsel der Adresse
     C  Merker = eigenes Foto X: die Kopie wird gar nicht geholt, X genau
        einmal angefragt, gezeigt wird X (srcset weg); lazy bleibt, X kommt
        erst nach den Stilblättern (wie S2)
     D  Merker X, Datenbank inzwischen „zurück zum Original“ (""): am Ende
        src/srcset genau wie in index.html, gezeigt die Kopie
     E  Datenbank = Adresse einer Kopie mit altem Stempel bzw. einer Größe, die es
        nicht mehr gibt (so speichert das Formular nach S8): bleibt die Kopie,
        die alte Adresse wird nie geholt
     F  kaputter Merker: Foto trotzdem sofort, eine Anfrage
     G  Bearbeiten-Formular (Nachbesserung 2): zeigt das Bild das Original, steht im
        Foto-Feld wie vor S8 die github-Adresse; Speichern nur des Textes liest
        about_photo_history dann nicht (Datenbank = github-Adresse); eigenes Foto: das Foto
     V  (GEGEN + Original) Bildvergleich DPR 1/2/3: Stand GEGEN (Original von
        github, nachgestellt aus QUELLE) gegen diesen Stand, Ausschnitt um das
        Foto: Farbe ±1 je Kanal, roh ≥ 36 dB, Schärfe (Laplace-Streuung der
        Bildmitte, Kopie/Original) ≥ 0,85, geglättet (1 CSS-Pixel) ≥ 33 dB
        (Nachbesserung 2: vorher nur Farbe und geglättet – das ließ eine
        absichtlich weichgezeichnete Kopie grün; Gegenprobe GEGEN_WEICH unten)
     M  (MESSEN=n, GEGEN, QUELLE) Bytes des Fotos, „Foto geladen“ und „Foto
        gemalt“ (Element Timing) je ab Start und − erstes Bild, 4G + CPU 4×, DPR 2
        (M_NETZ=3g: 150 ms, 1,6 Mbit/s – Nachbesserung 2).
        OHNE Playwright-Routen (die schalten den HTTP-Speicher ab): HTTPS mit h2,
        fremde Namen per host-resolver-rules auf eigene Server (je Name ein Port,
        also eine eigene Verbindung; die erste Anfrage je Verbindung +3 Rundreisen =
        DNS + TCP + TLS), github.com 302 no-cache, raw.githubusercontent.com mit
        max-age=300 und ETag wie das echte (per curl geprüft) – ein MODELL der
        Leitung, kein echtes github; Bytes, Speicher und Dekodieren sind echt.
        Fälle (FAELLE_M, Grundeinstellung erstes,zweites,abgelaufen):
          erstes      neuer Kontext, Speicher leer
          zweites     derselbe Kontext gleich danach (Speicher frisch: 0 Byte)
          abgelaufen  raw mit max-age=0: zweites Öffnen fragt nach (304)
          eigen       (X_GROSS=<großes JPEG>) Merker und Datenbank = eigenes Foto
                      aus dem Supabase-Speicher, erstes Öffnen: erstes Bild und
                      „Foto gemalt“ (Kosten eines großen eigenen Fotos)
     P  keine Seitenfehler
   Das ORIGINAL liegt nicht im Repo (1,3 MB): für V und M QUELLE=<Pfad> angeben
   (XanderFoxy/Deutsch, Bilder2/9ob2nzt2.jpeg). Ohne QUELLE bricht die
   nachgestellte github-Anfrage ab (A–F prüfen ohnehin, dass keine kommt).
   Aufruf:   node werkzeug/pruefe-886-foto.js
   Gegenprobe (Stand vor S8):
     S=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/<sitzung>/scratchpad
     git archive <vorher> index.html app.js min | tar -x -C $S/gegen886/foto-vorher (Rest als Verweis)
     WURZEL=$S/gegen886/foto-vorher node werkzeug/pruefe-886-foto.js
   Gegenprobe V (Nachbesserung 2): ein Baum, in dem nur bilder/ueber-alex-*.webp weichgezeichnet sind (verkleinert,
     wieder vergrößert, gleiche Pixelmaße), bzw. die Kopien in Gerätegröße (GROESSEN=76,152,228 FILTER=Lanczos):
     NUR_V=1 WURZEL=<Baum> QUELLE=… GEGEN=… node werkzeug/pruefe-886-foto.js  → V1–V3 rot
   Bildvergleich/Messen: QUELLE=<Original> GEGEN=$S/gegen886/foto-vorher [MESSEN=10] [FAELLE_M=…] [X_GROSS=<JPEG>]
     [MESS_JSON=<Datei>] [MESS_LOG=1] [M_CPU=4] [M_NETZ=4g|3g] [NUR_V=1: ohne A–F] [OHNE_V=1: ohne V, z. B. GEGEN = ein Stand mit S8]
     node werkzeug/pruefe-886-foto.js
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
   glatt   PSNR nach Weichzeichnen um 1 CSS-Pixel (σ = DPR) – grobe Abweichungen (Ausschnitt, Lage, Helligkeit)
   farbe   größte Abweichung der Mittelwerte je Kanal (Farbstich, Helligkeit; Farbprofil vergessen?)
   schaerfe  Feinzeichnung der Kopie im Verhältnis zum Original: Streuung des Laplace-Filters (Helligkeit, 4 Nachbarn)
           in der Bildmitte (70 % des Ausschnitts, ohne Rahmen und Ecken) – ein weicheres Bild hat kleinere Sprünge
           von Pixel zu Pixel. Nachbesserung 2: „geglättet“ allein ließ eine absichtlich weichgezeichnete Kopie
           grün (geglättet 42,6/47,0/47,2 dB) – das Glätten nimmt genau die Feinzeichnung weg, um die es geht.
   Weichzeichnen mit ImageMagick (convert), wie werkzeug/foto-ueber.js. */
function psnr(A, B) {
  let se = 0, n = 0;
  for (let i = 0; i < A.data.length; i += 4) for (let k = 0; k < 3; k++) { const d = A.data[i + k] - B.data[i + k]; se += d * d; n++; }
  return se === 0 ? 99 : 10 * Math.log10(255 * 255 / (se / n));
}
function weich(png, sigma) {
  return PNG.sync.read(require("child_process").execFileSync("convert", ["png:-", "-blur", "0x" + sigma, "png:-"], { input: png }));
}
function laplaceStreuung(P, anteil) {
  const { width: w, height: h, data } = P, g = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = 0.299 * data[4 * i] + 0.587 * data[4 * i + 1] + 0.114 * data[4 * i + 2];
  const x0 = Math.max(1, Math.round(w * (0.5 - anteil / 2))), x1 = Math.min(w - 1, Math.round(w * (0.5 + anteil / 2)));
  const y0 = Math.max(1, Math.round(h * (0.5 - anteil / 2))), y1 = Math.min(h - 1, Math.round(h * (0.5 + anteil / 2)));
  let s = 0, s2 = 0, n = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = y * w + x, l = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
    s += l; s2 += l * l; n++;
  }
  return n ? Math.sqrt(Math.max(0, s2 / n - (s / n) * (s / n))) : 0;
}
function vergleich(a, b, dpr) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  if (A.width !== B.width || A.height !== B.height) return { roh: 0, glatt: 0, farbe: 255, schaerfe: 0, lapA: 0, lapB: 0, groesse: A.width + "×" + A.height + " / " + B.width + "×" + B.height };
  const mA = [0, 0, 0], mB = [0, 0, 0];
  for (let i = 0; i < A.data.length; i += 4) for (let k = 0; k < 3; k++) { mA[k] += A.data[i + k]; mB[k] += B.data[i + k]; }
  const n = A.data.length / 4, lapA = laplaceStreuung(A, 0.7), lapB = laplaceStreuung(B, 0.7);
  return { roh: psnr(A, B), glatt: psnr(weich(a, dpr), weich(b, dpr)), farbe: Math.max(...mA.map((x, k) => Math.abs(x - mB[k]) / n)),
    schaerfe: lapA > 0 ? lapB / lapA : 0, lapA, lapB, groesse: A.width + "×" + A.height };
}
const zeige = (v) => "roh " + v.roh.toFixed(1) + " dB, Schärfe " + v.lapA.toFixed(1) + " → " + v.lapB.toFixed(1) + " (" + v.schaerfe.toFixed(3) + ")"
  + ", geglättet " + v.glatt.toFixed(1) + " dB, Farbe ±" + v.farbe.toFixed(2);

/* Messung in der Seite (vor jedem Skript der Seite): erstes Bild, „Foto geladen“ (rAF), „Foto gemalt“ (Element Timing),
   lazy bei DOMContentLoaded, jeder Wechsel von src/srcset/currentSrc; saat = Merker dma-ueber (einmal je Kontext) */
function messSkript([saat]) {
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
  /* „bereit“ wie werkzeug/ladezeit-messen.js: erstes Bild, in dem LiveChat, die Tafel und der Wissen-Reiter da sind */
  window.__bereit = null;
  const bereitSchritt = () => {
    if (window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading" && document.querySelector('.tape-tab[data-target="view-knowledge"]')) window.__bereit = Math.round(performance.now());
    else requestAnimationFrame(bereitSchritt);
  };
  requestAnimationFrame(bereitSchritt);
  document.addEventListener("DOMContentLoaded", () => {
    const i = document.querySelector("#view-about .avatar-wrap img");
    window.__lazyBeiDcl = i ? i.getAttribute("loading") : "kein Bild";
  });
}

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
  let brOffen = true;
  const seitenFehler = [];

  /* z: { about, dbMs, github: 0, githubMs: [Verzögerung github.com, Verzögerung raw], aboutAbfragen } – für Q–V (M läuft ohne Routen) */
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
      /* Teil G: wie oft das Formular about_photo_history liest (Nachbesserung 2) */
      if (/supabase\.co\/rest\/v1\/site_content/.test(k) && /key=eq\.about_photo_history/.test(k)) z.historie = (z.historie || 0) + 1;
      if (/supabase\.co\/rest\//.test(u)) return warte(300).then(() => r.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: "[]" })).catch(() => {});
      return r.abort();
    });
    await ctx.addInitScript(messSkript, [o.merker === undefined ? null : o.merker]);
    return ctx;
  }

  async function oeffnen(ctx, z, srv, o) {
    o = o || {};
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
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
      /* die Stilblätter, die das erste Bild aufhalten (renderBlockingStatus, Chrome 107+) */
      const css = performance.getEntriesByType("resource").filter((e) => e.initiatorType === "link" && e.renderBlockingStatus === "blocking")
        .map((e) => ({ name: e.name, start: Math.round(e.startTime), ende: Math.round(e.responseEnd) }));
      let m = null;
      try { m = localStorage.getItem("dma-ueber"); } catch (e) {}
      return { foto: window.__foto.slice(), fcp: window.__fcp, steht: window.__fotoSteht, gemalt: window.__fotoGemalt, lazyBeiDcl: window.__lazyBeiDcl, res, css, merker: m,
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
      /* Nachbesserung 1: nur im Zweig „die Kopie bleibt“ (else nach dem Einsetzen eines eigenen Fotos) */
      const nurKopie = /\}\s*else\s+i\.removeAttribute\("loading"\)/.test(H.html) && H.html.split('i.removeAttribute("loading")').length === 2;
      sage(w > 0 && weg > w && weg < blaetter && nurKopie, "der Wächter im Kopf (vor den Stilblättern) nimmt lazy weg – nur wenn die Kopie bleibt (ein eigenes Foto bleibt lazy)");
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
      sage(st.x.length === 1 && Boolean(rx), "X genau einmal angefragt", rx ? "Anfrage " + rx.start + ", erstes Bild " + st.fcp + ", X-Anfragen " + st.x.length : "keine");
      teil = "C3";
      sage(st.current === X_URL && st.srcset === null && st.foto.every((f) => JSON.parse(f.s)[0] === X_URL), "gezeigt wird X (srcset weg), in keinem Bild die Kopie", "current " + kurzUrl(st.current) + ", srcset " + st.srcset);
      /* Nachbesserung 1 (Prüfbericht zu 50f82a93): ein eigenes Foto kommt aus dem Formular in voller Größe (uploadSiteImage
         rechnet nicht klein) – ohne lazy würde es schon beim Lesen der Seite angefragt und konkurrierte mit CSS und JS.
         Es bleibt lazy wie in S2: angefragt erst nach dem ersten Layout, also nach den Stilblättern. */
      teil = "C4";
      const css = st.css.filter((e) => e.ende > 0);
      const cssEnde = css.length ? Math.max(...css.map((e) => e.ende)) : null;
      sage(st.lazyBeiDcl === "lazy" && rx && cssEnde != null && rx.start >= cssEnde, "lazy bleibt: X erst nach den Stilblättern angefragt (wie S2)",
        "loading bei DOMContentLoaded " + st.lazyBeiDcl + ", X-Anfrage " + (rx ? rx.start : "–") + " ms, Stilblätter fertig " + cssEnde + " ms (" + css.length + ")");
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

    /* ---------------- G: Bearbeiten-Formular (Nachbesserung 2, Prüfbericht zu 374ff591) ---------------- */
    abschnitt("G  Bearbeiten-Formular: Foto-Feld und about_photo_history beim Speichern nur des Textes");
    /* Vor S8 trug das Formular img.src ein – die github-Adresse. Mit S8 stand dort die volle Adresse der Kopie: Speichern
       nur des Textes bei github-Adresse in der Datenbank las (und schrieb) about_photo_history zusätzlich. Jetzt steht bei
       gezeigtem Original wieder die github-Adresse im Feld. Angemeldet ist niemand: canModerate und currentProfile werden
       in der Seite vorgetäuscht, das Schreiben scheitert darum (isAdmin) – gezählt wird das Lesen davor. */
    for (const [name, foto, merker] of [["Datenbank = github-Adresse", ORIG_URL, null], ["Datenbank und Merker = eigenes Foto X", X_URL, merkerMit(X_URL)]]) {
      const z = { about: { wert: Object.assign({}, TEXTE, { photoUrl: foto }) }, dbMs: 300, github: 0, aboutAbfragen: 0, historie: 0 };
      const ctx = await kontext(z, { dpr: 2, merker: merker || undefined });
      const pg = await ctx.newPage();
      pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
      await pg.goto(haupt.basis, { waitUntil: "domcontentloaded", timeout: 60000 });
      const t0 = Date.now();
      while (z.aboutAbfragen === 0 && Date.now() - t0 < 20000) await warte(50);
      await warte(z.dbMs + 1500);
      const g = await pg.evaluate(async () => {
        const w = (ms) => new Promise((r) => setTimeout(r, ms));
        Backend.canModerate = () => true; Backend.currentProfile = () => ({});
        document.querySelector('.tape-tab[data-target="view-about"]').click();
        for (let i = 0; i < 40 && !document.getElementById("aboutEditBtn"); i++) await w(50);
        const knopf = document.getElementById("aboutEditBtn");
        if (!knopf) return { feld: null };
        knopf.click();
        for (let i = 0; i < 40 && !document.getElementById("aboutEditPhoto"); i++) await w(50);
        const f = document.getElementById("aboutEditPhoto");
        return { feld: f ? f.value : null };
      });
      const vorHist = z.historie;
      await pg.click("#aboutEditSave").catch(() => {});
      const t1 = Date.now();
      while (Date.now() - t1 < 3000 && !(await pg.evaluate(() => { const e = document.getElementById("aboutEditError"); return Boolean(e && e.style.display === "block"); }))) await warte(50);
      await warte(500);
      const fehlerText = await pg.evaluate(() => { const e = document.getElementById("aboutEditError"); return e ? e.textContent : "–"; });
      teil = "G";
      if (foto === ORIG_URL) {
        sage(g.feld === ORIG_URL, name + ": im Foto-Feld steht wie vor S8 die github-Adresse (nicht die Adresse der Kopie)", "Feld: " + kurzUrl(g.feld));
        sage(z.historie - vorHist === 0, name + ": Speichern nur des Textes liest about_photo_history nicht (wie vor S8)",
          "about_photo_history gelesen: " + (z.historie - vorHist) + ", danach: " + String(fehlerText).slice(0, 60));
      } else sage(g.feld === X_URL, name + ": im Foto-Feld steht das eigene Foto (unverändert)", "Feld: " + kurzUrl(g.feld));
      await pg.close();
      await ctx.close();
    }
    }

    /* ---------------- V: Bildvergleich ---------------- */
    if (gegen && quelleDa && !process.env.OHNE_V) {
      /* Maß (Nachbesserung 2, Prüfbericht zu 374ff591): Farbe (Mittelwerte je Kanal ±1 von 255), roh ≥ 36 dB, Schärfe
         (Laplace-Streuung der Bildmitte, Kopie/Original) ≥ 0,85 und geglättet (σ = 1 CSS-Pixel) ≥ 33 dB. Bis dahin
         galten nur Farbe und geglättet – zu lasch: eine absichtlich weichgezeichnete Kopie (verkleinert auf 60 bzw.
         110 px, wieder vergrößert; nebeneinander deutlich weicher) war grün (geglättet 42,6/47,0/47,2 dB), ebenso die
         beim Bau als „sichtbar weicher“ verworfenen Kopien in Gerätegröße (76/152/228, Lanczos: 42,6/46,5/47,7).
         Die Grenzen aus den Bildschirmfotos aller Bau-Varianten (SPIELSYSTEM.md, Abschnitt S8, Tabelle) gewählt:
           gebaut (Mip-Stufen 145/290)   roh 37,5/36,6/36,6  Schärfe 0,991/0,921/0,878   → grün
           Gerätegröße 76/152/228        roh 34,7/35,1/36,3  Schärfe 0,699/0,620/0,764   → rot (beides)
           weichgezeichnet (Prüfer)      roh 33,1/34,0/34,1  Schärfe 0,549/0,466/0,365   → rot (beides)
         Die erste Probe (20.10., ERSATZBILD mit harten Kanten und starkem Rauschen) lag roh bei 27,7–29,3 dB – darum
         galt roh damals nur als Hinweis; mit dem echten Foto trennt roh gut. Chrome zeigt das Original als JPEG und als
         verlustfreies PNG Pixel für Pixel gleich (99 dB) – die Abweichung kommt allein aus dem Verkleinern.
         Seite an Seite: BILDER=<Ordner>. */
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
        sage(a.github > 0 && a.nw > 0 && b.nw === wv.g / wv.d && v.farbe <= 1 && v.roh >= 36 && v.schaerfe >= 0.85 && v.glatt >= 33,
          "DPR " + dpr + ": sieht gleich aus (Farbe ±1, roh ≥ 36 dB, Schärfe ≥ 0,85, geglättet ≥ 33 dB)", zeige(v) + ", Ausschnitt " + v.groesse + ", vorher nw " + a.nw + ", nachher nw " + b.nw);
      }
    } else console.log("\n(V übersprungen: " + (gegen ? "" : "kein GEGEN ") + (quelleDa ? "" : "kein Original unter " + QUELLE) + ")");

    /* ---------------- M: Messung mit echtem HTTP-Speicher ---------------- */
    if (MESSEN && gegen && quelleDa) {
      /* Nachbesserung 1 (Prüfbericht zu 50f82a93): bis dahin lief M über Playwright-Routen – die schalten den HTTP-Speicher
         ab, das „zweite Öffnen“ holte im alten Stand die 1,3 MB jedes Mal neu (gemeldet: 2 262 → 608 ms, 1 369 667 → 10 768 B).
         Ein echter Browser nimmt das Original beim zweiten Öffnen aus dem Speicher (raw.githubusercontent.com: max-age=300,
         ETag; danach 304). Darum jetzt ohne Routen: eigene HTTPS-Server (h2) für die Seite und für jeden fremden Namen. */
      await br.close(); brOffen = false;   // höchstens ein Chromium zugleich (M braucht andere Startschalter)
      const os = require("os"), http2 = require("http2"), { execFileSync } = require("child_process");
      const FAELLE = (process.env.FAELLE_M || "erstes,zweites,abgelaufen" + (process.env.X_GROSS ? ",eigen" : "")).split(",").map((x) => x.trim()).filter(Boolean);
      const X_GROSS = process.env.X_GROSS ? fs.readFileSync(path.resolve(process.env.X_GROSS)) : null;
      const M_CPU = Number(process.env.M_CPU || 4);   // CPU-Bremse (4 = Mittelklasse-Telefon; 1 = schneller Rechner, die Leitung entscheidet)
      /* Nachbesserung 2 (Prüfbericht zu 374ff591): auch auf langsamem Handy-Netz – 3g wie werkzeug/ladezeit-messen.js
         (150 ms, 1,6 Mbit/s); Aufbau je neue fremde Verbindung 3 Rundreisen wie bei 4G (DNS + TCP + TLS) */
      const NETZE_M = { "4g": { rtt: 60, down: 9e6, name: "4G (60 ms, 9 Mbit/s)" }, "3g": { rtt: 150, down: 1.6e6, name: "3G (150 ms, 1,6 Mbit/s)" } };
      const NETZ_M = NETZE_M[process.env.M_NETZ || "4g"];
      if (!NETZ_M) throw new Error("M_NETZ unbekannt: " + process.env.M_NETZ + " (4g | 3g)");
      if (FAELLE.includes("eigen") && !X_GROSS) throw new Error("M „eigen“ braucht X_GROSS=<großes JPEG>");
      /* eigenes Zertifikat für alle Namen, im Browser per SPKI freigegeben */
      const tdir = fs.mkdtempSync(path.join(os.tmpdir(), "m886-"));
      execFileSync("openssl", ["req", "-x509", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:prime256v1", "-nodes", "-keyout", tdir + "/k.pem", "-out", tdir + "/c.pem",
        "-days", "2", "-subj", "/CN=127.0.0.1", "-addext", "subjectAltName=IP:127.0.0.1,DNS:github.com,DNS:raw.githubusercontent.com,DNS:cdn.jsdelivr.net,DNS:*.supabase.co"], { stdio: "ignore" });
      const cert = fs.readFileSync(tdir + "/c.pem"), key = fs.readFileSync(tdir + "/k.pem");
      fs.rmSync(tdir, { recursive: true, force: true });
      const spki = crypto.createHash("sha256").update(crypto.createPublicKey(cert).export({ type: "spki", format: "der" })).digest("base64");
      const zaehl = { bytes: 0, kopie: 0, github: 0, x: 0 };
      const lage = { rawMaxAge: 300, about: "leer" };
      const h2srv = (fn) => new Promise((ok) => { const srv = http2.createSecureServer({ key, cert, allowHTTP1: true }, fn); srv.listen(0, "127.0.0.1", () => ok({ srv, port: srv.address().port })); });
      /* die Seite (A, B) wie GitHub Pages: h2, gzip, ETag, max-age=600; index.html und fassung.json no-cache */
      const seiteM = (wurzel) => {
        const datei = new Map();
        return h2srv((q, a) => {
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
          const h = { "content-type": TYP[d.ext] || "application/octet-stream", "cache-control": p === "/index.html" || p === "/fassung.json" ? "no-cache" : "max-age=600", etag: d.etag };
          if (q.headers["if-none-match"] === d.etag) { a.writeHead(304, h); return a.end(); }
          const gz = d.gz && /gzip/.test(q.headers["accept-encoding"] || "");
          if (gz) h["content-encoding"] = "gzip";
          if (/^\/bilder\/ueber-alex-/.test(p)) { zaehl.bytes += d.inhalt.length; zaehl.kopie++; }
          a.writeHead(200, h);
          a.end(gz ? d.gz : d.inhalt);
        });
      };
      /* Fremde Namen: je Name ein eigener Server und Port – Chrome legt h2-Verbindungen nur bei gleicher Adresse samt Port
         zusammen, so bekommt jeder Name wie draußen eine eigene Verbindung. Die erste Anfrage je Verbindung wartet 3
         Rundreisen (DNS + TCP + TLS: 180 ms bei 4G, 450 ms bei 3G; die Drosselung selbst gibt jeder Anfrage eine). */
      const neueVerbindung = async (q) => {
        const s = q.stream ? q.stream.session : q.socket;
        /* MESS_LOG: jede neue Verbindung und jede Anfrage außer den Datenbank-Abfragen */
        if (process.env.MESS_LOG && (!(s && s.__m886) || !/\/rest\/v1\//.test(q.url))) console.log("      " + (q.headers[":authority"] || q.headers.host) + " " + q.method + " " + q.url.slice(0, 50) + (s && s.__m886 ? "" : "  (neue Verbindung)"));
        if (s && !s.__m886) { s.__m886 = 1; await warte(3 * NETZ_M.rtt); }
      };
      const RAW_ETAG = '"' + crypto.createHash("sha1").update(QUELLE_BYTES).digest("hex") + '"';
      const SUPA = "https://rolcktiryrvjzbwuvobb.supabase.co", X_PFAD = "/storage/v1/object/public/avatars/site-images/about-1761400000000-foto.jpg";
      const X_GROSS_URL = SUPA + X_PFAD;
      const gh = await h2srv(async (q, a) => {
        await neueVerbindung(q); zaehl.github++;
        a.writeHead(302, { location: "https://raw.githubusercontent.com/XanderFoxy/Deutsch/main/Bilder2/9ob2nzt2.jpeg", "cache-control": "no-cache", "timing-allow-origin": "*" });
        a.end();
      });
      const raw = await h2srv(async (q, a) => {
        await neueVerbindung(q); zaehl.github++;
        /* timing-allow-origin nur, damit Element Timing die Malzeit nennt (ohne ihn meldet Chrome für fremde Bilder 0) */
        const h = { "content-type": "image/jpeg", "cache-control": "max-age=" + lage.rawMaxAge, etag: RAW_ETAG, "access-control-allow-origin": "*", "timing-allow-origin": "*" };
        if (q.headers["if-none-match"] === RAW_ETAG) { a.writeHead(304, h); return a.end(); }
        zaehl.bytes += QUELLE_BYTES.length;
        a.writeHead(200, h); a.end(QUELLE_BYTES);
      });
      const cdn = await h2srv(async (q, a) => {
        await neueVerbindung(q);
        a.writeHead(200, { "content-type": "text/javascript", "cache-control": "max-age=604800", "access-control-allow-origin": "*" }); a.end(UMD_TEXT);
      });
      const supa = await h2srv(async (q, a) => {
        await neueVerbindung(q);
        if (q.method === "OPTIONS") {
          a.writeHead(204, { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS", "access-control-max-age": "600" });
          return a.end();
        }
        const u = decodeURIComponent(q.url);
        if (u.split("?")[0] === X_PFAD && X_GROSS) {
          /* Supabase-Speicher, öffentliche Datei: max-age=3600 (Voreinstellung beim Hochladen) */
          zaehl.x++; zaehl.bytes += X_GROSS.length;
          a.writeHead(200, { "content-type": "image/jpeg", "cache-control": "max-age=3600", "access-control-allow-origin": "*", "timing-allow-origin": "*" });
          return a.end(X_GROSS);
        }
        await warte(300);
        let body = "[]";
        if (/\/rest\/v1\/site_content/.test(u) && /key=eq\.about(&|$)/.test(u) && lage.about !== "leer") body = JSON.stringify([{ value: lage.about }]);
        a.writeHead(200, { "content-type": "application/json", "access-control-allow-origin": "*" }); a.end(body);
      });
      const sA = await seiteM(GEGEN), sB = await seiteM(WURZEL);
      const regeln = "MAP github.com 127.0.0.1:" + gh.port + ", MAP raw.githubusercontent.com 127.0.0.1:" + raw.port + ", MAP cdn.jsdelivr.net 127.0.0.1:" + cdn.port
        + ", MAP *.supabase.co 127.0.0.1:" + supa.port + ", MAP * ~NOTFOUND, EXCLUDE 127.0.0.1";
      const brM = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server", "--host-resolver-rules=" + regeln, "--ignore-certificate-errors-spki-list=" + spki] });
      const NAMEN = { erstes: "erstes Öffnen (Speicher leer)", zweites: "zweites Öffnen gleich danach (HTTP-Speicher frisch, raw max-age=300)",
        abgelaufen: "zweites Öffnen nach Ablauf (raw max-age=0 → Nachfrage, 304)", eigen: "eigenes großes Foto gemerkt (" + (X_GROSS ? X_GROSS.length : 0) + " B, Supabase-Speicher), erstes Öffnen" };
      /* Gruppen je Kontext: [erstes, zweites], [erstes, abgelaufen], [eigen] – das erste Öffnen jeder Gruppe zählt als „erstes“ */
      const gruppen = [];
      if (FAELLE.includes("erstes") || FAELLE.includes("zweites")) gruppen.push(["erstes", "zweites"].filter((f) => f === "erstes" || FAELLE.includes(f)));
      if (FAELLE.includes("abgelaufen")) gruppen.push([FAELLE.includes("erstes") ? "erstes" : null, "abgelaufen"]);
      if (FAELLE.includes("eigen")) gruppen.push(["eigen"]);
      abschnitt("M  Foto, " + NETZ_M.name + " + CPU " + M_CPU + "×, DPR 2, " + MESSEN + " Paare verschränkt (A = GEGEN, B = dieser Stand); ohne Routen, echter HTTP-Speicher, Fälle " + FAELLE.join(","));
      const werte = {};
      async function mLauf(name, port, gruppe) {
        const fall0 = gruppe[gruppe.length - 1];
        lage.rawMaxAge = fall0 === "abgelaufen" ? 0 : 300;
        lage.about = fall0 === "eigen" ? Object.assign({}, TEXTE, { photoUrl: X_GROSS_URL }) : "leer";
        const ctx = await brM.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, serviceWorkers: "block",
          userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
        await ctx.addInitScript(messSkript, [fall0 === "eigen" ? merkerMit(X_GROSS_URL) : null]);
        for (let n = 0; n < gruppe.length; n++) {
          const fall = gruppe[n];
          const pg = await ctx.newPage();
          pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
          const cdp = await ctx.newCDPSession(pg);
          await cdp.send("Network.enable");
          await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: NETZ_M.rtt, downloadThroughput: NETZ_M.down / 8, uploadThroughput: 750e3 / 8 });
          await cdp.send("Emulation.setCPUThrottlingRate", { rate: M_CPU });
          const vor = Object.assign({}, zaehl);
          await pg.goto("https://127.0.0.1:" + port + "/index.html", { waitUntil: "load", timeout: 90000 });
          const t0 = Date.now();
          while (Date.now() - t0 < 15000 && !(await pg.evaluate(() => window.__fotoGemalt != null && window.__fcp != null && window.__bereit != null))) await warte(100);
          await warte(500);
          const st = await pg.evaluate(() => {
            const i = document.querySelector("#view-about .avatar-wrap img");
            /* Ablauf der Foto-Anfrage (Resource Timing; bei github mit timing-allow-origin): Start, erste Antwort, Ende, übertragen */
            const r = performance.getEntriesByType("resource").filter((e) => /bilder\/ueber-alex|9ob2nzt2|storage\/v1/.test(e.name))
              .map((e) => [Math.round(e.startTime), Math.round(e.responseStart), Math.round(e.responseEnd), e.transferSize].join("/"));
            return { fcp: window.__fcp, steht: window.__fotoSteht, gemalt: window.__fotoGemalt, bereit: window.__bereit, lazy: window.__lazyBeiDcl, current: i && i.currentSrc, ablauf: r.join(" ") };
          });
          await pg.close();
          if (fall) {
            const w = { fcp: st.fcp, steht: st.steht, gemalt: st.gemalt, bereit: st.bereit, bytes: zaehl.bytes - vor.bytes, github: zaehl.github - vor.github, kopie: zaehl.kopie - vor.kopie, x: zaehl.x - vor.x,
              lazy: st.lazy, current: kurzUrl(st.current), zeigtX: st.current === X_GROSS_URL, ablauf: st.ablauf, abstand: st.steht != null && st.fcp != null ? st.steht - st.fcp : null,
              abstandGemalt: st.gemalt != null && st.fcp != null ? st.gemalt - st.fcp : null };
            ((werte[fall] = werte[fall] || {})[name] = werte[fall][name] || []).push(w);
            if (process.env.MESS_LOG) console.log("    " + name + " " + fall + " " + JSON.stringify(w));
          }
          await warte(1000);
        }
        await ctx.close();
      }
      try {
        for (let i = 0; i < MESSEN; i++) {
          const reihe = i % 2 ? [["B", sB.port], ["A", sA.port]] : [["A", sA.port], ["B", sB.port]];
          for (const gruppe of gruppen) for (const [name, port] of reihe) await mLauf(name, port, gruppe);
          if (process.env.MESS_JSON) fs.writeFileSync(process.env.MESS_JSON, JSON.stringify(werte, null, 1));
          console.log("    Paar " + (i + 1) + " von " + MESSEN + " fertig");
        }
      } finally {
        await brM.close().catch(() => {});
        [gh, raw, cdn, supa, sA, sB].forEach((x) => x.srv.close());
      }
      const NAME_K = { bytes: "Bytes des Fotos", fcp: "erstes Bild", bereit: "bereit (Seite bedienbar)", steht: "Foto geladen", gemalt: "Foto gemalt", abstand: "geladen − erstes Bild", abstandGemalt: "gemalt − erstes Bild" };
      const paar = (fall, k) => { const A = werte[fall].A.map((x) => x[k]), B = werte[fall].B.map((x) => x[k]); return A.map((x, j) => (B[j] != null && x != null ? B[j] - x : null)).filter((x) => x != null); };
      for (const fall of Object.keys(werte)) {
        console.log("  " + NAMEN[fall] + " – " + werte[fall].A.length + " Paare");
        for (const k of Object.keys(NAME_K)) {
          const A = werte[fall].A.map((x) => x[k]), B = werte[fall].B.map((x) => x[k]), d = paar(fall, k);
          const spanne = (l) => { const z = l.filter((x) => x != null); return z.length ? Math.min(...z) + "…" + Math.max(...z) : "–"; };
          console.log("    " + NAME_K[k].padEnd(24) + "A " + String(median(A)).padStart(8) + "   B " + String(median(B)).padStart(6)
            + "   B−A gepaart Median " + String(median(d)).padStart(8) + " (" + d.filter((x) => x < 0).length + " kleiner, " + d.filter((x) => x > 0).length + " größer von " + d.length + ")"
            + (k === "bytes" ? "" : "   A " + spanne(A) + ", B " + spanne(B)));
        }
      }
      teil = "M";
      const g = (fall, n, k) => median(werte[fall][n].map((x) => x[k]));
      if (werte.erstes) sage(g("erstes", "B", "gemalt") < g("erstes", "A", "gemalt") && g("erstes", "B", "bytes") < g("erstes", "A", "bytes") / 100,
        "erstes Öffnen: das Foto ist früher gemalt und kostet weniger als 1 % der Bytes (Median)",
        "gemalt " + g("erstes", "A", "gemalt") + " → " + g("erstes", "B", "gemalt") + " ms, Bytes " + g("erstes", "A", "bytes") + " → " + g("erstes", "B", "bytes"));
      for (const fall of ["zweites", "abgelaufen"].filter((f) => werte[f])) {
        /* beide Stände holen kein Byte des Fotos neu (Speicher bzw. 304) – sonst misst M falsch; der Gewinn ist nur noch Zeit */
        sage(g(fall, "A", "bytes") === 0 && g(fall, "B", "bytes") === 0 && g(fall, "B", "gemalt") < g(fall, "A", "gemalt"),
          NAMEN[fall] + ": beide 0 Byte, das Foto ist früher gemalt (Median)", "gemalt " + g(fall, "A", "gemalt") + " → " + g(fall, "B", "gemalt") + " ms, B−A gepaart " + median(paar(fall, "gemalt")));
      }
      const ohneEigen = Object.keys(werte).filter((f) => f !== "eigen");
      sage(ohneEigen.every((f) => median(paar(f, "fcp")) <= 54),
        "erstes Bild im Rauschen (B − A gepaart, Median ≤ Rauschgrenze 54 ms)", ohneEigen.map((f) => f + " " + median(paar(f, "fcp"))).join(", "));
      if (werte.eigen) {
        teil = "M-X";
        /* nur dieser Stand wird geprüft (A hängt an GEGEN): das eigene Foto bleibt lazy, wird gezeigt und genau einmal geholt */
        sage(werte.eigen.B.every((x) => x.lazy === "lazy" && x.x === 1 && x.kopie === 0 && x.github === 0 && x.zeigtX),
          "eigenes Foto: lazy bleibt, genau einmal geholt, gezeigt; keine Kopie, nichts von github",
          "erstes Bild B−A gepaart " + median(paar("eigen", "fcp")) + " ms, Foto gemalt B−A " + median(paar("eigen", "gemalt")) + " ms");
      }
    }
  } catch (e) {
    fehler++;
    console.log("  FEHL Abbruch: " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join(" / ") : e));
  }
  teil = "P";
  const echte = seitenFehler.filter((x) => !/Failed to fetch|NetworkError|ERR_|Load failed/i.test(x));
  sage(echte.length === 0, "keine Seitenfehler", echte.slice(0, 5).join(" | "));
  if (brOffen) await br.close();
  haupt.srv.close(); if (gegen) gegen.srv.close(); fotoSrv.close();
  console.log("\n" + (fehler ? "ROT: " + fehler + " (" + Object.entries(roteTeile).map(([t, n]) => t + ":" + n).join(", ") + ")" : "GRÜN") + "  [" + (process.env.WURZEL ? "WURZEL=" + WURZEL : "Arbeitsbaum") + "]");
  process.exit(fehler ? 1 : 0);
})();
