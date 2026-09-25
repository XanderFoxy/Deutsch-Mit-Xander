#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 659: VERBINDUNG SCHNELLER, SPIEL DIREKT
   ---------------------------------------------------------------------
   XANDER (25.09.): „speziell auch die Geschwindigkeit von der
   Verbindung generell mit Leuten … bei HelloTalk geht es doch auch …
   wie wir mit den Leuten … auch flüssig spielen können … optimiere
   alles was du rausholen kannst damit die Verbindungen in Zukunft
   schneller steht."
   Zwei echte Browser-Seiten bauen eine echte WebRTC-Leitung auf. Den
   Supabase-Kanal spielt die Sonde: sie trägt jedes Paket von der
   einen Seite zur anderen (so wie der Server es täte) und zählt mit.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns"] });
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html";

  async function seite(ich, anderer) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto(url, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_SPIEL, { timeout: 25000 });
    await pg.evaluate(([ich, anderer]) => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: 1000, zuruecksetzen: true,
        leute: { [anderer]: { id: anderer, name: anderer.toUpperCase(), seit: 2000, gesehen: 9e15, buehne: true, bild: "" } } });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.__spielRein = [];
      const alt = window.DMA_SPIEL.empfangen;
      window.DMA_SPIEL.empfangen = (n) => { window.__spielRein.push({ ereignis: n.ereignis, gid: n.gid, t: performance.now() }); };
    }, [ich, anderer]);
    return pg;
  }

  /* Der „Server": trägt Pakete hinüber, zählt nach Art. */
  const zaehler = { A: {}, B: {} };
  let alteFassungB = false, spielZurueckhalten = false;
  const zurueck = [];
  let laeuft = true;
  async function tragen(von, nach, name) {
    while (laeuft) {
      let pakete = [];
      try { pakete = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
      for (const p of pakete) {
        zaehler[name][p.art] = (zaehler[name][p.art] || 0) + 1;
        if (name === "B" && alteFassungB) delete p.kf;
        if (p.art === "spiel" && spielZurueckhalten) { zurueck.push({ nach, p }); continue; }
        try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
      }
      await new Promise((r) => setTimeout(r, 15));
    }
  }

  const A = await seite("aaa", "bbb"), B = await seite("bbb", "aaa");
  tragen(A, B, "A"); tragen(B, A, "B");

  const stehtBeide = () => Promise.all([A, B].map((pg) => pg.evaluate(() => (window.LiveChat.leitungen() || []).every((v) => v.steht) && (window.LiveChat.leitungen() || []).length > 0)));
  async function warteAufLeitung(ms) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { const s = await stehtBeide(); if (s[0] && s[1]) return Date.now() - t0; await new Promise((r) => setTimeout(r, 50)); }
    return -1;
  }

  console.log("\nNEUE FASSUNG AUF BEIDEN SEITEN\n");
  /* B grüßt (wie beim Betreten), A hat die kleinere Kennung und ruft an. */
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  const dauer = await warteAufLeitung(15000);
  sage(dauer >= 0, "die Leitung steht", dauer + " ms");
  sage(dauer >= 0 && dauer < 4000, "und zwar schnell (unter 4 s)", dauer + " ms");
  const kz = { einzelnA: zaehler.A.kerze || 0, buendelA: zaehler.A.kerzen || 0, einzelnB: zaehler.B.kerze || 0, buendelB: zaehler.B.kerzen || 0 };
  sage(kz.einzelnA === 0 && kz.einzelnB === 0 && kz.buendelA >= 1 && kz.buendelB >= 1, "die Wege gehen gebündelt statt einzeln über den Kanal", JSON.stringify(kz));
  const alle = (z) => Object.values(z).reduce((a, b) => a + b, 0);
  sage(alle(zaehler.A) + alle(zaehler.B) <= 14, "insgesamt nur wenige Pakete für den ganzen Aufbau", JSON.stringify(zaehler));

  console.log("\nDAS SPIEL GEHT DIREKT DURCH DIE LEITUNG\n");
  const bereit = async () => { for (let i = 0; i < 60; i++) { const ok = await A.evaluate(() => { try { return window.LiveChat.pruefKanal ? window.LiveChat.pruefKanal() : null; } catch (e) { return null; } }); if (ok && ok.bereit && ok.bereit.length) return ok; await new Promise((r) => setTimeout(r, 50)); } return null; };
  const kb = await bereit();
  sage(Boolean(kb && kb.bereit.indexOf("bbb") >= 0), "der Spielkanal zu B ist offen (beide haben „dc-hallo“ gesagt)", JSON.stringify(kb));
  spielZurueckhalten = true;
  const t0 = await A.evaluate(() => { window.LiveChat.spielSenden({ ereignis: "schuss", zielChat: "bbb", waffe: "bogen" }); return performance.now(); });
  let direkt = null;
  for (let i = 0; i < 40 && !direkt; i++) { direkt = await B.evaluate(() => window.__spielRein.find((e) => e.ereignis === "schuss")); if (!direkt) await new Promise((r) => setTimeout(r, 25)); }
  sage(Boolean(direkt), "B sieht den Schuss, obwohl der Server-Weg noch zurückgehalten wird", direkt ? "über den Datenkanal" : "kam nicht an");
  /* Jetzt kommt auch die Server-Kopie an — sie darf nicht doppelt zählen. */
  spielZurueckhalten = false;
  for (const z of zurueck.splice(0)) await z.nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), z.p);
  await new Promise((r) => setTimeout(r, 150));
  const anzahl = await B.evaluate(() => window.__spielRein.filter((e) => e.ereignis === "schuss").length);
  sage(anzahl === 1, "die Server-Kopie kommt danach an und wird nicht doppelt gezeigt", anzahl + "×");
  /* Umlaufzeit messen: 20 Schüsse hin, direkt. */
  const zeiten = await (async () => {
    const r = [];
    for (let i = 0; i < 20; i++) {
      spielZurueckhalten = true;
      await B.evaluate(() => { window.__spielRein.length = 0; });
      const t = Date.now();
      await A.evaluate((i) => window.LiveChat.spielSenden({ ereignis: "schuss", zielChat: "bbb", waffe: "bogen", nr: i }), i);
      for (let k = 0; k < 80; k++) { const d = await B.evaluate(() => window.__spielRein.length); if (d) break; await new Promise((q) => setTimeout(q, 5)); }
      r.push(Date.now() - t);
    }
    spielZurueckhalten = false; zurueck.length = 0;
    return r.sort((a, b) => a - b);
  })();
  sage(zeiten[10] < 120, "Direktweg: halbe Umlaufzeit (inkl. Sonde) im Mittel unter 120 ms", "Median " + zeiten[10] + " ms");

  console.log("\nMIT JEMANDEM, DER NOCH DIE ALTE FASSUNG HAT\n");
  await A.evaluate(() => { window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000 }); });
  await B.evaluate(() => { window.LiveChat.pruefEmpfangen({ art: "hallo", von: "aaa", name: "AAA", seit: 1000 }); });
  /* Beide haben neu angefangen; B tut ab jetzt so, als verstünde es keine Bündel. */
  alteFassungB = true;
  await A.evaluate(() => { /* A vergisst, dass B Bündel kann: so sähe es mit einer alten Fassung aus */ window.LiveChat.pruefBuendelVergessen && window.LiveChat.pruefBuendelVergessen("bbb"); });
  zaehler.A = {}; zaehler.B = {};
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000 }));
  const dauer2 = await warteAufLeitung(15000);
  sage(dauer2 >= 0, "auch dann steht die Leitung", dauer2 + " ms");
  sage((zaehler.A.kerze || 0) >= 1 && !(zaehler.A.kerzen), "A schickt ihm die Wege einzeln, wie früher", JSON.stringify(zaehler.A));

  const f = A.__fehler.concat(B.__fehler);
  sage(f.length === 0, "keine Fehler in der Konsole", f.slice(0, 3).join(" | "));
  laeuft = false;
  console.log("\n" + (fehler ? "Fassung 659: " + fehler + " rot." : "Fassung 659: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
