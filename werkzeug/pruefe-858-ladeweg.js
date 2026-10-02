#!/usr/bin/env node
/* =====================================================================
   SONDE 858 — DER WEG INS KLASSENZIMMER LÄDT NUR, WAS ER BRAUCHT (Fassung 837)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „die Ladezeit … ca. 10 mal schneller … sofort im
   Livestream wie HelloTalk".

   Geprüft:
     A  Wortschatz (vokabeln/) und Kalender (kalender/) haben je Datei einen
        eigenen Stempel und werden damit geladen – nicht mehr mit ?v=Fassung.
     B  Wissen → Klassenzimmer, dazu ein paar Tipps: kein Wortschatz, keine
        68 Spieltöne in den ersten 12 s.
     C  Lernen holt den Wortschatz weiter sofort (mit Dateistempel).
     D  Wer unter „Wissen" beim Kompass bleibt, bekommt den Wortschatz nach
        etwa 8 s Ruhe trotzdem (wie vorher, nur später).
     E  preconnect zu jsDelivr und zum Supabase-Projekt steht im Kopf.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".m4a": "audio/mp4", ".opus": "audio/ogg" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
  const stempel = JSON.parse((html.match(/window\.DMA_STEMPEL = (\{[^;]*\});/) || [])[1] || "{}");
  const fassung = (html.match(/DMA_VERSION = "(\d+)"/) || [])[1];

  console.log("\nA) EIGENER STEMPEL JE WORT- UND KALENDERDATEI\n");
  const vok = fs.readdirSync(path.join(WURZEL, "vokabeln")).filter((n) => /\.js$/.test(n));
  const kal = fs.readdirSync(path.join(WURZEL, "kalender")).filter((n) => /\.js$/.test(n));
  sage(vok.every((n) => /^[0-9a-f]{10}$/.test(stempel["vokabeln/" + n] || "")), "jede Datei in vokabeln/ hat ihren Stempel", vok.length + " Dateien");
  sage(kal.every((n) => /^[0-9a-f]{10}$/.test(stempel["kalender/" + n] || "")), "jede Datei in kalender/ hat ihren Stempel", kal.length + " Dateien");
  const dv = fs.readFileSync(path.join(WURZEL, "data-vocab.js"), "utf8");
  sage(/DMA_V\('vokabeln\/' \+ datei \+ '\.js'\)/.test(dv), "data-vocab.js lädt über DMA_V (Stempel) statt ?v=Fassung");

  console.log("\nE) VERBINDUNGEN FRÜH ÖFFNEN\n");
  sage(/<link rel="preconnect" href="https:\/\/cdn\.jsdelivr\.net"/.test(html), "preconnect zu jsDelivr (supabase-js)");
  sage(/<link rel="preconnect" href="https:\/\/rolcktiryrvjzbwuvobb\.supabase\.co" crossorigin/.test(html), "preconnect zum Supabase-Projekt (mit crossorigin)");

  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    a.end(fs.readFileSync(f));
  }).listen(0);
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  async function seite() {
    const ctx = await br.newContext({ viewport: { width: 400, height: 850 } });
    const pg = await ctx.newPage();
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} });
    const anfragen = [];
    pg.on("request", (r) => { const u = r.url(); if (u.startsWith("http://127.0.0.1")) anfragen.push({ t: Date.now(), u: u.replace(/^http:\/\/127\.0\.0\.1:\d+\//, "") }); });
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pg.goto(url, { waitUntil: "load", timeout: 120000 });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_V && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 60000 });
    await warte(1500);
    return { ctx, pg, anfragen };
  }
  const vokAb = (liste, t0) => liste.filter((a) => a.t >= t0 && /^vokabeln\//.test(a.u));

  console.log("\nB) WISSEN → KLASSENZIMMER: KEIN WORTSCHATZ, KEINE SPIELTÖNE\n");
  {
    const { ctx, pg, anfragen } = await seite();
    const t0 = Date.now();
    await pg.click('.tape-tab[data-target="view-knowledge"]');
    await warte(400);
    await pg.evaluate(() => { const b = document.querySelector('.subnav-pill[data-sub="sub-livechat"]'); if (b) b.click(); });
    /* Tipps, die nichts Bestimmtes treffen (auf body): sie wecken den Klang wie jeder Tipp. Ein Tipp auf einen TEXT
       schaltet dagegen ausdrücklich die Betonung an und holt dafür den Wortschatz – das ist gewollt (siehe app.js,
       wortschatzHolenFuer) und wird hier nicht geprüft. */
    for (let i = 0; i < 4; i++) {
      await pg.evaluate(() => ["pointerup", "click"].forEach((t) => document.body.dispatchEvent(new MouseEvent(t, { bubbles: true }))));
      await warte(300);
    }
    await warte(12000);
    const v = vokAb(anfragen, t0);
    const tone = anfragen.filter((a) => a.t >= t0 && /^ton\//.test(a.u));
    sage(v.length === 0, "12 s im Klassenzimmer: keine Datei aus vokabeln/ geladen", v.length + " Dateien");
    sage(tone.length < 10, "die Tipps laden nicht die 68 Spieltöne", tone.length + " Töne");
    const k = anfragen.filter((a) => /^kalender\/\d+\.js/.test(a.u));
    /* FASSUNG 842 — satzbau.js steht nicht mehr in der Startliste und kommt im Klassenzimmer nicht */
    sage(!anfragen.some((a) => /satzbau\.js/.test(a.u)), "Fassung 842: satzbau.js wird weder beim Start noch im Klassenzimmer geladen", anfragen.filter((a) => /satzbau/.test(a.u)).map((a) => a.u).join(", "));
    /* FASSUNG 840 — auch der Kalendermonat (≈ 229 KB) kommt auf dem Weg ins Klassenzimmer nicht mehr */
    sage(!anfragen.some((a) => a.t >= t0 && /^kalender\/\d+\.js/.test(a.u)), "Fassung 840: auf dem Weg ins Klassenzimmer kein Kalendermonat", k.map((a) => a.u).join(", "));
    if (k.length) sage(k.every((a) => { const n = a.u.split("?")[0]; return a.u.endsWith("?v=" + stempel[n]); }), "der Kalender kommt mit seinem Dateistempel", k.map((a) => a.u).join(", "));

    console.log("\nC) LERNEN HOLT DEN WORTSCHATZ WEITER SOFORT\n");
    const t1 = Date.now();
    await pg.click('.tape-tab[data-target="view-learn"]');
    let v2 = [];
    for (let i = 0; i < 40 && !v2.length; i++) { await warte(250); v2 = vokAb(anfragen, t1); }
    let sb = [];
    for (let i = 0; i < 40 && !sb.length; i++) { sb = anfragen.filter((a) => a.t >= t1 && /satzbau\.js/.test(a.u)); if (!sb.length) await warte(100); }
    sage(sb.length > 0 && await pg.evaluate(() => new Promise((ok) => { let n = 0; const t = setInterval(() => { if (window.Satzbau || ++n > 50) { clearInterval(t); ok(Boolean(window.Satzbau)); } }, 100); })),
      "Fassung 842: „Lernen“ holt satzbau.js sofort (Satzbaukasten bereit)", sb.length ? sb[0].u : "nicht geholt");
    sage(v2.length > 0, "nach dem Wechsel zu „Lernen“ kommt der Wortschatz", v2.length ? Math.round((v2[0].t - t1)) + " ms bis zur ersten Datei" : "nichts");
    const falsch = v2.filter((a) => { const n = a.u.split("?")[0]; return !a.u.endsWith("?v=" + stempel[n]); });
    sage(v2.length > 0 && !falsch.length && !v2.some((a) => a.u.endsWith("?v=" + fassung)), "jede Wortdatei mit ihrem eigenen Stempel (nicht ?v=" + fassung + ")", falsch.slice(0, 3).map((a) => a.u).join(", "));
    await ctx.close();
  }

  console.log("\nD) BEIM KOMPASS BLEIBEN: DER WORTSCHATZ KOMMT NACH DER RUHE\n");
  {
    const { ctx, pg, anfragen } = await seite();
    const t0 = Date.now();
    await pg.click('.tape-tab[data-target="view-knowledge"]');
    let v = [];
    for (let i = 0; i < 80 && !v.length; i++) { await warte(250); v = vokAb(anfragen, t0); }
    sage(v.length > 0 && v[0].t - t0 >= 6000, "der Wortschatz kommt – aber erst nach der Ruhe (≥ 6 s), nicht beim Öffnen", v.length ? Math.round((v[0].t - t0) / 100) / 10 + " s" : "kam nicht in 20 s");
    const kal = anfragen.filter((a) => a.t >= t0 && /^kalender\/\d+\.js/.test(a.u));
    sage(kal.length > 0 && kal[0].t - t0 < 4000, "Fassung 840: beim Kompass kommt der Kalendermonat weiter gleich (nach ≈ 1,2 s)", kal.length ? Math.round((kal[0].t - t0) / 100) / 10 + " s" : "kam nicht");
    await ctx.close();
  }

  await br.close(); srv.close();
  console.log("\nFassung 837 (Sonde 858): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
