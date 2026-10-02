#!/usr/bin/env node
/* =====================================================================
   SONDE 859 — DER RAUMKANAL GEHT SOFORT AUF (Fassung 839)
   ---------------------------------------------------------------------
   XANDER (Funk 268): „die Latenz bei den Sitzplätzen ist immer noch
   bemerkbar … kümmere Dich jetzt mal bitte intensiv um alles".
   Messung aus 836 (spiel_diagnose, „verbindung", sein Samsung): bis der
   Raumkanal steht 1,6–9 s, einmal 29 s – der Kanal wurde erst NACH
   Mikrofon (bis 2 s) und Relais (bis 2,5 s) geöffnet.

   Die Sonde ersetzt den Supabase-Klienten durch einen nachgebauten Kanal,
   der SUBSCRIBED erst nach KANAL_MS meldet, und lässt das Relais 2,5 s
   hängen (wie ein Kaltstart). Geprüft:
     A  „drin" nach etwa max(Relais, Kanal) statt Relais + Kanal
     B  ein Paket, das in der Wartezeit im Raum ankommt, wird danach
        verarbeitet (die Person ist bekannt), nicht verschluckt
     C  der Kanal wurde gleich beim Betreten geöffnet (channel() vor dem
        Ende der Relais-Wartezeit)
     D  Verlassen während der Wartezeit räumt den Kanal weg; man ist
        danach nicht „drin"
     E  kanalVorwaermen() öffnet die Verbindung zum Server (realtime.connect)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
const KANAL_MS = 1500;
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); a.end(fs.readFileSync(f));
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });

  async function seite() {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} });
    /* Relais (Edge Function) hängt 2,5 s – wie ein Kaltstart; alles andere Fremde fällt sofort aus */
    await pg.route(/functions\/v1\//, async (r) => { await schlaf(2600); r.abort(); });
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)(?!.*functions\/v1\/)/, (r) => r.abort());
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "load" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.betreten, null, { timeout: 60000 });
    await pg.evaluate((KANAL_MS) => {
      const log = window.__kanal = { kanaele: [], connect: 0, weg: 0, t0: 0 };
      window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || { url: "https://beispiel.supabase.co", anonKey: "x" };
      window.supabase = { createClient: () => ({
        realtime: { connect: () => { log.connect++; }, isConnected: () => false },
        channel: (name) => {
          const k = { name, horcher: [], geoeffnet: performance.now(), gesendet: [],
            on(art, filter, fn) { this.horcher.push(fn); return this; },
            subscribe(fn) { this.abo = fn; setTimeout(() => fn("SUBSCRIBED"), KANAL_MS); return this; },
            send(p) { this.gesendet.push(p.payload); return Promise.resolve("ok"); },
            unsubscribe() { log.weg++; return Promise.resolve("ok"); },
            track() { return Promise.resolve(); }, untrack() { return Promise.resolve(); }, presenceState() { return {}; } };
          log.kanaele.push(k);
          return k;
        },
        removeChannel() { return Promise.resolve(); },
        from() { const q = { select: () => q, eq: () => q, order: () => q, limit: () => q, maybeSingle: () => Promise.resolve({ data: null, error: null }), then: (ok) => ok({ data: [], error: null }) }; return q; },
        rpc: () => Promise.resolve({ data: null, error: null }),
        auth: { getSession: () => Promise.resolve({ data: { session: null } }) }
      }) };
    }, KANAL_MS);
    return { ctx, pg };
  }

  console.log("\nA–C) BETRETEN: KANAL SOFORT AUF\n");
  {
    const { ctx, pg } = await seite();
    const erg = await pg.evaluate(() => new Promise((fertig) => {
      const t0 = performance.now(); window.__kanal.t0 = t0;
      let paketGeschickt = false, kanalNachMs = null;
      const uhr = setInterval(() => {
        const k = window.__kanal.kanaele.find((x) => /^dma-raum-/.test(x.name));
        if (k && kanalNachMs == null) kanalNachMs = Math.round(k.geoeffnet - t0);
        /* B: kurz nach dem Öffnen, noch vor „drin", schickt jemand im Raum etwas */
        if (k && !paketGeschickt && performance.now() - t0 > 300 && window.LiveChat.lage().lage !== "drin") {
          paketGeschickt = true;
          k.horcher.forEach((f) => f({ payload: { art: "puls", von: "zzz", name: "ZZZ", seit: 5000, buehne: true } }));
        }
        const l = window.LiveChat.lage();
        if (l.lage === "drin" || performance.now() - t0 > 12000) {
          clearInterval(uhr);
          fertig({ drinMs: Math.round(performance.now() - t0), lage: l.lage, kanalNachMs, paketGeschickt,
                   zzzBekannt: false, leute: "" });
        }
      }, 20);
      window.LiveChat.betreten("sonde859", { name: "Sonde", mitBild: false });
    }));
    /* B: ist „zzz" jetzt bekannt? (die Sitzordnung führt jeden, den man kennt) */
    await schlaf(300);
    const bekannt = await pg.evaluate(() => (window.LiveChat.pruefSitz().plaetze || []).filter((p) => p.id).map((p) => p.id));
    erg.zzzBekannt = bekannt.indexOf("zzz") >= 0; erg.leute = bekannt.join(",");
    console.log("   " + JSON.stringify(erg));
    sage(erg.lage === "drin", "man kommt in den Raum", erg.lage);
    sage(erg.kanalNachMs != null && erg.kanalNachMs < 500, "C: der Raumkanal geht gleich beim Betreten auf (nicht erst nach Mikrofon und Relais)", erg.kanalNachMs + " ms");
    sage(erg.drinMs < 2500 + KANAL_MS - 300, "A: „drin\" nach etwa max(Relais 2,5 s, Kanal " + KANAL_MS / 1000 + " s) statt der Summe", erg.drinMs + " ms (Summe wäre ≥ " + (2500 + KANAL_MS) + " ms)");
    sage(erg.paketGeschickt && erg.zzzBekannt, "B: ein Paket aus der Wartezeit geht nicht verloren (die Person ist danach bekannt)", erg.leute);
    sage(!pg.__fehler.length, "keine Fehler auf der Seite", pg.__fehler.slice(0, 2).join(" | "));
    await ctx.close();
  }

  console.log("\nD) VERLASSEN WÄHREND DER WARTEZEIT\n");
  {
    const { ctx, pg } = await seite();
    const erg = await pg.evaluate(() => new Promise((fertig) => {
      window.LiveChat.betreten("sonde859b", { name: "Sonde", mitBild: false });
      let wurf = "";
      setTimeout(() => { try { window.LiveChat.verlassen(); } catch (e) { wurf = String(e && e.message || e); } }, 400);
      setTimeout(() => fertig({ lage: window.LiveChat.lage().lage, weg: window.__kanal.weg, kanaele: window.__kanal.kanaele.map((k) => k.name).join(","), wurf }), 4500);
    }));
    sage(erg.lage !== "drin", "wer in der Wartezeit geht, ist danach nicht „drin\"", erg.lage);
    sage(erg.weg >= 1, "der schon offene Kanal wird abgemeldet", JSON.stringify(erg));
    await ctx.close();
  }

  console.log("\nE) VORWÄRMEN\n");
  {
    const { ctx, pg } = await seite();
    const n = await pg.evaluate(() => { window.LiveChat.kanalVorwaermen && window.LiveChat.kanalVorwaermen(); return window.__kanal.connect; });
    sage(n >= 1, "kanalVorwaermen() öffnet die Verbindung zum Raum-Server", n + "×");
    const app = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
    sage(/function livechatTor[\s\S]{0,1200}LiveChat\.kanalVorwaermen\(\)/.test(app), "das Tor (Mikrofon/Kamera-Frage) wärmt die Verbindung vor");
    await ctx.close();
  }

  await br.close(); srv.close();
  console.log("\nFassung 839 (Sonde 859): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
