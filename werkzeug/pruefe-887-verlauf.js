#!/usr/bin/env node
/* PRÜFT FASSUNG 887 (L2): DER VERLAUF WIRD SCHLANK VERARBEITET.
   ---------------------------------------------------------------
   Beim Betreten holt das Klassenzimmer bis zu 20 000 Zeilen in Seiten zu 2 000. Bis 886 zeichnete JEDE Hintergrund-
   Seite den ganzen Raum neu (melden() → renderLiveChat), und verschmelzen sortierte alles neu. Jetzt: Reißverschluss
   zweier geordneter Listen, Seiten in Leerlaufpausen, nach einer Hintergrund-Seite nur melden("aeltere") – die
   Oberfläche frischt dann nur Zahl und Knopf der älteren Zeilen auf.
   Die Tabelle ist nachgestellt (Klient wie in pruefe-642-verlauf-laden.js), 7 000 Zeilen, echte Seite, Klassenzimmer
   offen, CPU 4×. Jeder Fall läuft im geprüften Baum UND in 886 (7e23e157) mit denselben Daten.
     G  Ergebnis gleich wie 886: dieselben Zeilen in derselben Reihenfolge (Kennung, Text, Bild, Zusatzfelder), keine
        Doppelzeilen, Bildzwillinge zusammengeführt
     Z  verschmelzen: 400 Zufallsfälle (geordnet, ungeordnet, gleiche Zeiten, Zwillinge, Zusatzfelder) – Ergebnis
        gleich wie 886
     M  nach den Hintergrund-Seiten: höchstens 1 volles Melden, sonst „aeltere"
     K  der Knopf „↑ N ältere Nachrichten" stimmt, und ein Tipp darauf lädt ältere Zeilen nach (lcAeltereLaden)
     L  je Hintergrund-Seite kein langes Bild über 120 ms (CPU 4×)
   Vergleich: VERGLEICH=<886-Baum> (sonst git archive 7e23e157 in TMPDIR). Gegenprobe: WURZEL=<886-Baum> → M, L rot. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), { execSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

function vergleichsBaum() {
  if (process.env.VERGLEICH) return path.resolve(process.env.VERGLEICH);
  const ziel = path.join(os.tmpdir(), "dma-887-verlauf-886");
  if (fs.existsSync(path.join(ziel, "livechat.js"))) return ziel;
  fs.mkdirSync(ziel, { recursive: true });
  const repo = path.join(__dirname, "..");
  const dateien = execSync("git -C " + JSON.stringify(repo) + " ls-tree --name-only 7e23e157", { encoding: "utf8" }).split("\n").filter(Boolean);
  const blobs = dateien.filter((f) => execSync("git -C " + JSON.stringify(repo) + " cat-file -t 7e23e157:" + JSON.stringify(f), { encoding: "utf8" }).trim() === "blob");
  execSync("git -C " + JSON.stringify(repo) + " archive 7e23e157 " + blobs.concat(["min"]).map((f) => JSON.stringify(f)).join(" ") + " | tar -x -C " + JSON.stringify(ziel));
  dateien.filter((f) => !blobs.includes(f) && !["min", "werkzeug", ".sicherung"].includes(f)).forEach((d) => { try { fs.symlinkSync(path.join(repo, d), path.join(ziel, d)); } catch (e) {} });
  return ziel;
}
function server(wurzel) {
  return new Promise((ok) => {
    const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(wurzel, p);
      if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0, () => ok(srv));
  });
}

/* IN der Seite: Tabelle mit n Zeilen, Klient wie PostgREST (eq, is, lt, order desc, limit) */
function buehne(n) {
  window.__arten = []; window.__loaf = window.__loaf || [];
  LiveChat.beiAenderung((l, art) => window.__arten.push([Math.round(performance.now()), art || "voll", l.nachrichten.length]));
  const t0 = Date.parse("2026-10-30T12:00:00Z");
  const foto = (k) => "data:image/png;base64,iVBOR" + String(k).repeat(4000);
  const saetze = ["Hallo zusammen", "Aufgabe 3 war schwer", "Kannst du das erklären?", "Der Dativ 😅", "Seite 12", "wenn oder als?", "Danke!", "Prüfung morgen", "😂", "Gute Nacht"];
  const ZEILEN = [];
  for (let i = 0; i < n; i++) {
    const a = i % 30;
    ZEILEN.push({ id: i + 1, raum: "klassenzimmer", autor: "a" + a, name: "Schüler" + a, text: saetze[i % 10] + " " + i, art: "text", farbe: "", farbe_name: "", quelle_id: "q" + (i + 1),
      /* gleiche Zeiten in Paaren (Reihenfolge bei Gleichstand) */
      erstellt: new Date(t0 - (n - i) * 30000 + (i % 7 === 3 ? -30000 : 0)).toISOString() });
  }
  const klient = { from: () => {
    const q = { spalten: "", filter: [], limitN: null };
    const b = {};
    ["eq", "is", "not", "or", "neq", "lt", "gte"].forEach((m) => { b[m] = (...args) => { q.filter.push([m].concat(args)); return b; }; });
    b.select = (s) => { q.spalten = String(s || ""); return b; };
    b.order = () => b; b.limit = (k) => { q.limitN = k; return b; }; b.abortSignal = () => b;
    b.then = (ok, schief) => new Promise((r) => setTimeout(r, 30)).then(() => {
      if (q.spalten.indexOf("bild_im_chat") >= 0 || q.filter.some((f) => f[0] === "not" || f[0] === "or")) return { data: [], error: null };
      if (q.spalten === "bild") { const a = (q.filter.find((f) => f[0] === "eq" && f[1] === "autor") || [])[2] || ""; return { data: [{ bild: /^a[012]$/.test(a) ? foto(a.slice(1)) : "" }], error: null }; }
      let l = ZEILEN;
      const lt = q.filter.find((f) => f[0] === "lt");
      if (lt) l = l.filter((z) => z.erstellt < lt[2]);
      l = l.slice().sort((x, y) => (x.erstellt < y.erstellt ? 1 : x.erstellt > y.erstellt ? -1 : 0));
      return { data: l.slice(0, q.limitN || l.length), error: null };
    }).then(ok, schief);
    return b;
  } };
  Backend.currentUser = () => ({ id: "u-xander" });
  Backend.zugang = () => klient;
  /* Klassenzimmer offen (Oberfläche zeichnet mit) */
  LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Xander", seit: 1000, zuruecksetzen: true, leute: {} });
  document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
  let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
  LiveChat.pruefRaum("klassenzimmer");
  /* auf dem Gerät: 40 eigene Zeilen, darunter Zwillinge der Tabelle (gleiche Kennung) und eine mit Bild */
  const lokal = [];
  for (let i = n - 60; i < n - 20; i++) lokal.push({ id: "q" + (i + 1), von: "kua" + (i % 30), name: "Schüler" + (i % 30), text: saetze[i % 10] + " " + i, art: "text",
    zeit: Date.parse(ZEILEN[i].erstellt), eigen: false, bild: "", bildImChat: i === n - 30 ? "data:image/png;base64,QUJD" : "", leseTitel: i === n - 40 ? "Tafel" : undefined });
  LiveChat.pruefVerlaufSetzen(lokal);
  LiveChat.pruefLageSetzen("drin");
  window.DMA_PRUEF && window.DMA_PRUEF.neuZeichnen && window.DMA_PRUEF.neuZeichnen();
}

async function lauf(br, wurzel, n) {
  const srv = await server(wurzel);
  const ctx = await br.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await ctx.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {}
    window.__loaf = [];
    try { new PerformanceObserver((l) => l.getEntries().forEach((x) => { if (x.duration >= 50) window.__loaf.push({ t: Math.round(x.startTime), d: Math.round(x.duration), sk: (x.scripts || []).slice(0, 2).map((s) => [Math.round(s.duration), String(s.sourceURL || "").replace(/^.*\//, "").replace(/\?.*$/, "") + "@" + s.sourceCharPosition, s.invokerType]) }); })).observe({ type: "long-animation-frame", buffered: true }); } catch (e) {}
  });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && LiveChat.pruefVerlaufFrisch && LiveChat.pruefSitz && typeof Backend !== "undefined" && window.DMA_PRUEF, null, { timeout: 30000 });
  await schlaf(5000);
  /* Z: verschmelzen mit Zufallsfällen (CPU 1×) */
  const z = await pg.evaluate(() => {
    let s = 12345; const r = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const aus = [];
    for (let fall = 0; fall < 400; fall++) {
      const mk = (wo, k, geordnet) => { const l = []; let t = 1000; for (let i = 0; i < k; i++) { t += Math.floor(r() * 3) * 1000; const id = r() < 0.3 ? "g" + Math.floor(r() * 20) : wo + i;
        l.push({ id, name: "N" + Math.floor(r() * 3), text: "T" + Math.floor(r() * 4), zeit: geordnet ? t : Math.floor(r() * 30) * 1000, art: r() < 0.05 ? "system" : "text",
          bildImChat: r() < 0.1 ? "B" + i : "", bildImLager: r() < 0.05, wirkung: r() < 0.1 ? "w" : "", farbe: r() < 0.1 ? "rot" : "", bild: r() < 0.1 ? "F" : "", leseTitel: r() < 0.05 ? "L" + i : undefined }); }
        return l; };
      const a = mk("a", Math.floor(r() * 30), r() < 0.8), b = mk("b", Math.floor(r() * 30), r() < 0.8);
      aus.push(JSON.stringify(LiveChat.pruefVerschmelzen(a, b)));
    }
    return aus;
  });
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await pg.evaluate(buehne, n);
  await schlaf(800);
  const t0 = await pg.evaluate(() => { window.__start = Math.round(performance.now()); LiveChat.pruefVerlaufFrisch(true); return window.__start; });
  /* warten, bis alle Zeilen da sind und 3 s Ruhe */
  for (let i = 0; i < 180; i++) { const k = await pg.evaluate(() => LiveChat.lage().nachrichten.length).catch(() => 0); if (k >= n) break; await schlaf(500); }
  await schlaf(3000);
  const erg = await pg.evaluate((t0) => {
    const l = LiveChat.lage().nachrichten;
    const v = document.getElementById("lcVerlauf");
    const erste = v && v.querySelector(".lc-zeile[data-lc-id]");
    const k = v && v.querySelector(".lc-aeltere");
    let idx = -1; if (erste) for (let i = 0; i < l.length; i++) if (String(l[i].id) === erste.dataset.lcId) { idx = i; break; }
    return { n: l.length, zeilen: l.map((x) => [x.id, x.text, x.bild ? x.bild.length : 0, x.bildImChat ? 1 : 0, x.leseTitel || ""].join("|")),
      arten: window.__arten.filter((a) => a[0] >= t0), loaf: window.__loaf.filter((x) => x.t >= t0), knopf: k ? k.textContent : "", idx,
      gezeichnet: v ? v.querySelectorAll(".lc-zeile").length : 0 };
  }, t0);
  /* K: Tipp auf den Knopf */
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const nach = await pg.evaluate(async () => {
    const v = document.getElementById("lcVerlauf"), k = v && v.querySelector(".lc-aeltere");
    const vor = v ? v.querySelectorAll(".lc-zeile").length : 0;
    if (k) k.click();
    await new Promise((r) => setTimeout(r, 1500));
    return { vor, nach: v ? v.querySelectorAll(".lc-zeile").length : 0, knopf: (v.querySelector(".lc-aeltere") || {}).textContent || "" };
  });
  await ctx.close(); srv.close();
  return { z, erg, nach, kf };
}

(async () => {
  const VGL = vergleichsBaum();
  const N = Number(process.env.ZEILEN || 7000);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const a = await lauf(br, WURZEL, N);
  const b = await lauf(br, VGL, N);
  await br.close();
  let fehler = 0;
  const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  console.log("\n  G  Ergebnis wie 886");
  ok(a.erg.n === b.erg.n && a.erg.n >= N, "gleich viele Zeilen", a.erg.n + " / 886: " + b.erg.n);
  const ersterUnterschied = a.erg.zeilen.findIndex((x, i) => x !== b.erg.zeilen[i]);
  ok(ersterUnterschied < 0, "dieselben Zeilen in derselben Reihenfolge (Kennung, Text, Foto, Chatbild, Lesetafel)", ersterUnterschied < 0 ? "" : "#" + ersterUnterschied + ": " + a.erg.zeilen[ersterUnterschied] + " / " + b.erg.zeilen[ersterUnterschied]);
  const ids = a.erg.zeilen.map((x) => x.split("|")[0]);
  ok(new Set(ids).size === ids.length, "keine Doppelzeilen", ids.length - new Set(ids).size + " doppelt");
  const zw = a.erg.zeilen.find((x) => x.startsWith("q" + (N - 30 + 1) + "|"));
  ok(zw && zw.split("|")[3] === "1", "Bildzwilling: das Chatbild der Geräte-Kopie bleibt an der Zeile", zw);
  const lt = a.erg.zeilen.find((x) => x.startsWith("q" + (N - 40 + 1) + "|"));
  ok(lt && lt.split("|")[4] === "Tafel", "Zusatzfeld (Lesetafel) der Geräte-Kopie bleibt", lt);
  console.log("\n  Z  verschmelzen, 400 Zufallsfälle");
  const zu = a.z.findIndex((x, i) => x !== b.z[i]);
  ok(zu < 0, "jedes Ergebnis gleich wie 886", zu < 0 ? "" : "Fall " + zu + ": " + a.z[zu].slice(0, 200) + " / " + b.z[zu].slice(0, 200));
  console.log("\n  M  Melden nach den Seiten");
  const zaehl = (e) => { const o = {}; e.arten.forEach((x) => { o[x[1]] = (o[x[1]] || 0) + 1; }); return o; };
  /* volle Meldungen, nachdem die erste Seite da ist (nachrichten > 400) */
  const vollSpaet = (e) => e.arten.filter((x) => x[1] === "voll" && x[2] > 400).length;
  console.log("     886: " + JSON.stringify(zaehl(b.erg)) + ", voll nach der ersten Seite " + vollSpaet(b.erg));
  ok(vollSpaet(a.erg) <= 1 && (zaehl(a.erg).aeltere || 0) >= 2, "Hintergrund-Seiten melden „aeltere“, höchstens 1 volles Melden danach", JSON.stringify(zaehl(a.erg)) + ", voll danach " + vollSpaet(a.erg));
  console.log("\n  K  Knopf „ältere Nachrichten“");
  ok(a.erg.idx > 0 && a.erg.knopf.indexOf(String(a.erg.idx)) >= 0, "Knopf nennt die richtige Zahl", "„" + a.erg.knopf + "“, erste gezeichnete Zeile #" + a.erg.idx + " (886: „" + b.erg.knopf + "“)");
  ok(a.nach.nach > a.nach.vor, "Tipp auf den Knopf lädt ältere Zeilen nach", a.nach.vor + " → " + a.nach.nach + " Zeilen (886: " + b.nach.vor + " → " + b.nach.nach + ")");
  console.log("\n  L  lange Bilder beim Laden (CPU 4×)");
  const top = (e) => e.erg.loaf.slice().sort((x, y) => y.d - x.d).slice(0, 4).map((x) => x.d + "[" + ((x.sk[0] || [])[1] || "?") + "]").join(" ");
  const maxNachErster = (e) => { const ab = (e.erg.arten.find((x) => x[2] > 400) || [Infinity])[0]; return Math.max(0, ...e.erg.loaf.filter((x) => x.t > ab + 50).map((x) => x.d)); };
  console.log("     886: längstes " + Math.max(0, ...b.erg.loaf.map((x) => x.d)) + " ms, nach der ersten Seite " + maxNachErster(b) + " ms; " + top(b));
  console.log("     887: längstes " + Math.max(0, ...a.erg.loaf.map((x) => x.d)) + " ms, nach der ersten Seite " + maxNachErster(a) + " ms; " + top(a));
  ok(maxNachErster(a) <= 120, "je Hintergrund-Seite kein Bild über 120 ms", maxNachErster(a) + " ms");
  ok(a.kf.length === 0, "keine Seitenfehler", a.kf.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Verlauf kommt herein, ohne das Klassenzimmer anzuhalten.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
