#!/usr/bin/env node
/* =====================================================================
   SONDE 871 — BEITRITT, TOTE LEITUNG, ZWEITER GRUSS (Fassung 852)
   ---------------------------------------------------------------------
   XANDER (Funk 286): „… und dann machst du kontinuierlich weiter mit den
   restlichen Verbindung Sachen".
   Messung (spiel_diagnose „verbindung", 839–842): „kanal" 11,1 s und
   16,8 s, das Angebot des Gegenübers kam 8–21 s nach dem Betreten.

   Nachgebauter Supabase-Klient (wie Sonde 859). Geprüft:
     A  der Beitritt wartet höchstens 4 s; ein abgelaufener Beitritt
        (TIMED_OUT) ist kein Fehler – die spätere Bestätigung bringt
        einen hinein, „fehler" erscheint nie
     B  Vorwärmen am Tor schickt einen Herzschlag; bleibt die Antwort
        2,5 s aus, folgt ein zweiter (die Bibliothek baut dann neu auf);
        bei gesunder Leitung bleibt es bei einem
     C  Rückkehr aus dem Hintergrund nach mehr als 8 s prüft die Leitung
        ebenso; nach kurzem Wegsehen nicht
     D  kennt man jemanden, aber es kommt keine Leitung in Gang, geht der
        Gruss nach 1,2 s und 3 s noch einmal – mit derselben Sitzung
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
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

  /* art: { beitritt: [["TIMED_OUT", ms], ["SUBSCRIBED", ms]], leitung: "tot" | "gesund" } */
  async function seite(art) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} });
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "load" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.betreten, null, { timeout: 60000 });
    await pg.evaluate((art) => {
      const log = window.__kanal = { kanaele: [], herz: 0, timeouts: [], lagen: [] };
      const rt = { pendingHeartbeatRef: null, connect() {}, isConnected: () => true,
        sendHeartbeat() {
          log.herz++;
          if (rt.pendingHeartbeatRef && art.leitung === "tot") return;      // Bibliothek: zweiter Schlag = Neuaufbau
          const ref = rt.pendingHeartbeatRef = String(log.herz);
          if (art.leitung === "gesund") setTimeout(() => { if (rt.pendingHeartbeatRef === ref) rt.pendingHeartbeatRef = null; }, 80);
        } };
      window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || { url: "https://beispiel.supabase.co", anonKey: "x" };
      window.supabase = { createClient: () => ({
        realtime: rt,
        channel: (name) => {
          const k = { name, horcher: [], gesendet: [],
            on(a, f, fn) { this.horcher.push(fn); return this; },
            subscribe(fn, timeout) {
              log.timeouts.push(timeout == null ? null : timeout);
              (art.beitritt || [["SUBSCRIBED", 300]]).forEach((s) => setTimeout(() => fn(s[0]), s[1]));
              return this;
            },
            send(p) { this.gesendet.push(Object.assign({ t: performance.now() }, p.payload)); return Promise.resolve("ok"); },
            unsubscribe() { return Promise.resolve("ok"); },
            track() { return Promise.resolve(); }, untrack() { return Promise.resolve(); }, presenceState() { return {}; } };
          log.kanaele.push(k);
          return k;
        },
        removeChannel() { return Promise.resolve(); },
        from() { const q = { select: () => q, eq: () => q, order: () => q, limit: () => q, maybeSingle: () => Promise.resolve({ data: null, error: null }), then: (ok) => ok({ data: [], error: null }) }; return q; },
        rpc: () => Promise.resolve({ data: null, error: null }),
        auth: { getSession: () => Promise.resolve({ data: { session: null } }) }
      }) };
    }, art);
    return { ctx, pg };
  }

  console.log("\nA) BEITRITT: 4 s, ABGELAUFEN IST KEIN FEHLER\n");
  {
    const { ctx, pg } = await seite({ beitritt: [["TIMED_OUT", 400], ["SUBSCRIBED", 1600]] });
    const erg = await pg.evaluate(() => new Promise((fertig) => {
      const t0 = performance.now(), lagen = [];
      const uhr = setInterval(() => {
        const l = window.LiveChat.lage().lage;
        if (lagen[lagen.length - 1] !== l) lagen.push(l);
        if (l === "drin" || performance.now() - t0 > 9000) {
          clearInterval(uhr);
          fertig({ lagen, ms: Math.round(performance.now() - t0), timeouts: window.__kanal.timeouts });
        }
      }, 20);
      window.LiveChat.betreten("sonde871a", { name: "Sonde", mitBild: false });
    }));
    console.log("   " + JSON.stringify(erg));
    sage(erg.timeouts.indexOf(4000) >= 0, "der Raumkanal tritt mit 4 s Wartegrenze bei (vorher 10 s)", JSON.stringify(erg.timeouts));
    sage(erg.lagen.indexOf("fehler") < 0, "ein abgelaufener Beitritt zeigt keinen Fehler", erg.lagen.join(" → "));
    sage(erg.lagen[erg.lagen.length - 1] === "drin", "die spätere Bestätigung bringt einen hinein", erg.ms + " ms");
    sage(!pg.__fehler.length, "keine Fehler auf der Seite", pg.__fehler.slice(0, 2).join(" | "));
    await ctx.close();
  }
  {
    const { ctx, pg } = await seite({ beitritt: [["TIMED_OUT", 200], ["TIMED_OUT", 500], ["TIMED_OUT", 800]] });
    const l = await pg.evaluate(() => new Promise((fertig) => {
      window.LiveChat.betreten("sonde871a2", { name: "Sonde", mitBild: false });
      setTimeout(() => fertig(window.LiveChat.lage().lage), 3500);
    }));
    sage(l === "fehler", "nach dem dritten Ablauf erscheint der Fehler wie bisher", l);
    await ctx.close();
  }

  console.log("\nB) VORWÄRMEN AM TOR PRÜFT, OB DIE LEITUNG LEBT\n");
  for (const leitung of ["tot", "gesund"]) {
    const { ctx, pg } = await seite({ leitung });
    await pg.evaluate(() => window.LiveChat.kanalVorwaermen());
    await schlaf(3200);
    const n = await pg.evaluate(() => window.__kanal.herz);
    if (leitung === "tot") sage(n === 2, "tote Leitung: Herzschlag, nach 2,5 s ohne Antwort ein zweiter (Neuaufbau)", n + " Herzschläge");
    else sage(n === 1, "gesunde Leitung: genau ein Herzschlag, kein Neuaufbau", n + " Herzschläge");
    sage(!pg.__fehler.length, "keine Fehler auf der Seite", pg.__fehler.slice(0, 2).join(" | "));
    await ctx.close();
  }

  console.log("\nC) ZURÜCK AUS DEM HINTERGRUND\n");
  {
    const { ctx, pg } = await seite({ leitung: "tot" });
    const erg = await pg.evaluate(() => new Promise((fertig) => {
      let sicht = "visible", versatz = 0;
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => sicht });
      const echt = Date.now; Date.now = () => echt() + versatz;
      const wechsel = (v) => { sicht = v; document.dispatchEvent(new Event("visibilitychange")); };
      wechsel("hidden"); versatz += 3000; wechsel("visible");          // kurz weg: nichts
      const kurz = window.__kanal.herz;
      wechsel("hidden"); versatz += 9000; wechsel("visible");          // lange weg: prüfen
      setTimeout(() => fertig({ kurz, lang: window.__kanal.herz }), 2900);
    }));
    sage(erg.kurz === 0, "nach 3 s Wegsehen keine Prüfung", erg.kurz + " Herzschläge");
    sage(erg.lang === 2, "nach 9 s im Hintergrund: Herzschlag und, weil tot, der Neuaufbau", erg.lang + " Herzschläge");
    await ctx.close();
  }

  console.log("\nD) ZWEITER GRUSS, WENN KEINE LEITUNG IN GANG KOMMT\n");
  {
    const { ctx, pg } = await seite({ beitritt: [["SUBSCRIBED", 200]] });
    const erg = await pg.evaluate(() => new Promise((fertig) => {
      const t0 = performance.now();
      window.LiveChat.betreten("sonde871d", { name: "Sonde", mitBild: false });
      /* jemand, den man kennt (Puls während der Wartezeit), der selbst anrufen müsste – es kommt aber nichts */
      setTimeout(() => {
        const k = window.__kanal.kanaele.find((x) => /^dma-raum-/.test(x.name));
        if (k) k.horcher.forEach((f) => f({ payload: { art: "puls", von: "0000aaaa", name: "Null", seit: 5000, buehne: false } }));
      }, 100);
      setTimeout(() => {
        const k = window.__kanal.kanaele.find((x) => /^dma-raum-/.test(x.name));
        const h = (k ? k.gesendet : []).filter((p) => p.art === "hallo");
        fertig({ n: h.length, nach: h.map((p) => Math.round(p.t - t0)), sitz: Array.from(new Set(h.map((p) => p.sitzung))) });
      }, 6500);
    }));
    console.log("   " + JSON.stringify(erg));
    sage(erg.n >= 3, "der Gruss geht nach dem ersten noch zweimal hinaus", erg.n + "× " + erg.nach.join(", ") + " ms");
    const abst = erg.nach.length >= 3 ? [erg.nach[1] - erg.nach[0], erg.nach[2] - erg.nach[0]] : [];
    sage(abst.length && abst[0] >= 1000 && abst[0] <= 1700 && abst[1] >= 2800 && abst[1] <= 3600, "Abstände etwa 1,2 s und 3 s", abst.join(", "));
    sage(erg.sitz.length === 1 && erg.sitz[0], "alle mit derselben Sitzung (drüben nur Erinnerung, kein neues Angebot)", erg.sitz.join(","));
    sage(!pg.__fehler.length, "keine Fehler auf der Seite", pg.__fehler.slice(0, 2).join(" | "));
    await ctx.close();
  }

  await br.close(); srv.close();
  console.log("\nFassung 852 (Sonde 871): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
