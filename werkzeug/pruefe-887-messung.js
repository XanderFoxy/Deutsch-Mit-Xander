/* PRÜFT FASSUNG 887 (L6): DIE FELDMESSUNG SAGT, WER IM KLASSENZIMMER HÄNGT.
   ---------------------------------------------------------------
   Die Raumzeile („mess-raum", messung.js) nannte je langem Bild (LoAF) nur das längste Skript als Datei@Zeichen und
   Art – im Feld oft „?" oder „supabase.js resolve-promise", also nicht, WAS lief. Jetzt je LoAF zusätzlich
   blockingDuration, renderStart, styleAndLayoutStart und die 3 längsten Skripte [Dauer, Aufrufer, Art, Datei@Zeichen];
   dazu chat: [Verlaufzeilen, Zeichen der letzten Sicherung, Sicherungen je Minute]. Dieselbe Sendung, keine
   zusätzliche Anfrage, unter 6000 Zeichen, keine Inhalte.
     A  ein Aufenthalt mit zwei Langläufern (Zeitgeber, Klick auf einen Knopf mit Kennung im id) → loaf[i] hat 8
        Stellen, die Skripte stehen drin, der Aufrufer ist gereinigt (keine Kennung, keine Adresse)
     B  chat = [Zeilen, Zeichen, je Minute] aus livechat.js (Sicherung im Raum)
     C  viele lange Bilder und 60 Fenster → die Zeile bleibt unter 6000 Zeichen
     D  genau eine Raumzeile je Aufenthalt (keine zusätzliche Anfrage), keine Namen/Chattexte
   Gegenprobe: WURZEL=<886-Baum> → A, B rot. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || require("path").join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
  await ctx.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); localStorage.setItem("dma-mess-pruef", "schnell"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {}
  });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  const pg = await ctx.newPage();
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "load", timeout: 60000 });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && typeof Backend !== "undefined", null, { timeout: 60000 });
  /* Server-Attrappe wie pruefe-884-messung.js: rpc schreibt mit, angemeldet, neuer Server (mess: 12) */
  await pg.evaluate(() => {
    window.__berichte = [];
    const be = Backend;
    be.zugang = () => ({ rpc: (n, a) => new Promise((f) => setTimeout(() => { window.__berichte.push({ n, art: a && a.p_art, d: a && a.p_daten !== undefined ? JSON.parse(JSON.stringify(a.p_daten)) : null }); f({ data: { ok: true, mess: 12 }, error: null }); }, 0)) });
    be.currentUser = () => ({ id: "u1" });
    const d = new Date(), tag = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    localStorage.setItem("dma-mess-tag", JSON.stringify({ tag, n: 0, srv: 1 }));
  });
  await pg.waitForFunction(() => window.DMA_MESS && window.DMA_MESS.da && window.DMA_MESS.stand, null, { timeout: 20000, polling: 50 }).catch(() => {});
  await schlaf(1500);
  const melde = () => pg.evaluate(() => window.LiveChat.spielSitzeNeu()).catch(() => {});
  async function aufenthalt(arbeit) {
    await pg.evaluate(() => window.LiveChat.pruefSitz({ lage: "verbindet", ichId: "ich", ichName: "Zuzana Testperson", seit: 1000, zuruecksetzen: true, leute: {} })).catch(() => {});
    await melde(); await schlaf(120);
    await pg.evaluate(() => window.LiveChat.pruefSitz({ lage: "drin" })).catch(() => {});
    await melde(); await schlaf(200);
    await arbeit();
    await schlaf(500);
    await pg.evaluate(() => window.LiveChat.pruefSitz({ lage: "aus" })).catch(() => {});
    await melde(); await schlaf(800);
    return pg.evaluate(() => (window.__berichte || []).filter((b) => b.art === "mess-raum"));
  }
  let fehler = 0;
  const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  /* A + B */
  const r1 = await aufenthalt(async () => {
    await pg.evaluate(async () => {
      /* Verlauf im Raum, einmal gesichert (Zeilen mit Namen und Text – die dürfen NICHT in der Zeile stehen) */
      LiveChat.pruefRaum("probe-mess");
      await LiveChat.pruefVerlaufAusLager("probe-mess");
      const t0 = Date.now(), l = [];
      for (let i = 0; i < 1200; i++) l.push({ id: "m" + i, von: "p" + (i % 7), name: "Geheimname" + (i % 7), art: "text", text: "Geheimtext " + i, zeit: t0 - 100000 + i });
      LiveChat.pruefVerlaufSetzen(l);
      /* Langläufer 1: Zeitgeber */
      await new Promise((f) => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 220) {} f(); }, 30));
      await new Promise((f) => setTimeout(f, 120));
      /* Langläufer 2: Klick auf einen Knopf, dessen id eine Kennung trägt */
      const b = document.createElement("button");
      b.id = "lc-k2585aa3c9d1234ef"; b.textContent = "x"; b.style.cssText = "position:fixed;left:5px;top:5px;z-index:99999";
      b.addEventListener("click", () => { const t = performance.now(); while (performance.now() - t < 260) {} });
      document.body.appendChild(b);
    });
    await pg.click("#lc-k2585aa3c9d1234ef", { timeout: 5000 }).catch(() => {});
    await schlaf(300);
  });
  const d1 = r1[0] && r1[0].d;
  console.log("   " + JSON.stringify(d1 || null).slice(0, 900));
  console.log("\n  A  LoAF mit Skripten");
  const loaf = (d1 && d1.loaf) || [];
  ok(loaf.length >= 2, "mindestens zwei lange Bilder", loaf.length + "");
  ok(loaf.length && loaf.every((x) => x.length === 8 && typeof x[4] === "number" && typeof x[5] === "number" && typeof x[6] === "number" && Array.isArray(x[7])),
    "jedes hat 8 Stellen: [Dauer, Datei, Zeichen, Art, blocking, renderStart, styleAndLayoutStart, Skripte]", JSON.stringify(loaf.map((x) => x.length)));
  ok(loaf.length && loaf[0][0] >= 200 && loaf[0][4] > 0, "Dauer und blockingDuration stehen drin", loaf[0] && loaf[0][0] + " / " + loaf[0][4]);
  const sk = [].concat(...loaf.map((x) => x[7] || []));
  ok(sk.length >= 2 && sk.every((s) => s.length === 4 && typeof s[0] === "number" && /@-?\d+$/.test(s[3])), "Skripte als [Dauer, Aufrufer, Art, Datei@Zeichen]", JSON.stringify(sk).slice(0, 300));
  ok(sk.some((s) => /setTimeout/.test(s[1])) && sk.some((s) => /onclick/i.test(s[1])), "Aufrufer genannt (Zeitgeber, Klick)", sk.map((s) => s[1]).join(" | "));
  const roh = JSON.stringify(d1 || {});
  ok(!/2585aa3c9d|1234ef|https?:|127\.0\.0\.1/.test(roh), "Aufrufer gereinigt: keine Kennung, keine Adresse");
  console.log("\n  B  Chat-Sicherung");
  ok(d1 && Array.isArray(d1.chat) && d1.chat[0] === 1200 && d1.chat[1] > 1000 && d1.chat[2] > 0, "chat = [Zeilen, Zeichen der letzten Sicherung, Sicherungen je Minute]", JSON.stringify(d1 && d1.chat));
  ok(d1 && d1.mv === 2, "Zeilenformat mv 2", d1 && String(d1.mv));

  /* C: viele lange Bilder → Größenbremse */
  const r2 = await aufenthalt(async () => {
    await pg.evaluate(async () => {
      for (let i = 0; i < 12; i++) await new Promise((f) => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 60 + i * 10) {} f(); }, 20));
    });
  });
  const d2 = r2[r2.length - 1] && r2[r2.length - 1].d;
  console.log("\n  C  Größe");
  ok(d2 && JSON.stringify(d2).length < 6000, "Zeile unter 6000 Zeichen", d2 && JSON.stringify(d2).length + " Zeichen");
  const lauter = JSON.stringify({ loaf: Array.from({ length: 3 }, () => [999, "min/app-teil-raum6.js", 93213, "user-callback", 999, 999, 999, Array.from({ length: 3 }, () => [999, "x".repeat(48), "event-listener", "min/app-teil-raum6.js@1234567"])]) }).length;
  ok(lauter < 1200, "größtmögliche LoAF-Angabe (3 × 3 Skripte, volle Längen) unter 1200 Zeichen", lauter + " Zeichen");

  console.log("\n  D  keine zusätzliche Anfrage, keine Inhalte");
  ok(r1.length === 1 && r2.length === 2, "je Aufenthalt genau eine Raumzeile", r1.length + " / " + r2.length);
  const alle = await pg.evaluate(() => window.__berichte || []);
  ok(!/Geheimname|Geheimtext|Zuzana|probe-mess/.test(JSON.stringify(alle)), "keine Namen, keine Chattexte, kein Raumname");
  ok(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Raumzeile sagt jetzt, wer hängt.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
