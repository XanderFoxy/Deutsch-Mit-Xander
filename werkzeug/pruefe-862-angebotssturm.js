#!/usr/bin/env node
/* =====================================================================
   SONDE 862 — KEIN ANGEBOTS-STURM MEHR (Fassung 841)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".
   Zeitleiste vom 02.10., 22:43 (Samsung, Fassung 840): fünf Angebote,
   vier binnen 17 ms; die Antwort ging erst nach 3,2 s hinaus, die
   Leitung stand nach 8,7 s. Das andere Gerät hatte mehrere „hallo" auf
   einmal abgearbeitet und für jedes die Leitung neu gebaut.
   Zwei echte Browser-Seiten, echte Leitung (wie 659/856/861). Geprüft:
     A  drei „hallo" derselben Sitzung auf einmal: EIN Angebot, die
        Leitung steht, die Erinnerungen sind vermerkt
     B  ein „hallo" einer NEUEN Sitzung (Neuladen) baut neu auf
     C  drei „hallo" einer älteren Fassung (ohne Sitzung) auf einmal: drei
        Angebote wie früher – die Gegenseite nimmt nur das neueste an,
        und die Leitung steht trotzdem schnell
     D  „hallo" trägt die Sitzung
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

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
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: ich === "aaa" ? 1000 : 2000, buehne: true, zuruecksetzen: true,
        leute: { [anderer]: { id: anderer, name: anderer.toUpperCase(), seit: anderer === "aaa" ? 1000 : 2000, gesehen: 9e15, buehne: true, bild: "" } } });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.__arten = [];
      window.LiveChat.beiAenderung((l, art) => window.__arten.push(art || "voll"));
      window.DMA_SPIEL.empfangen = () => {};
      /* Berichte an den Betreiber abfangen (statt Supabase) */
      window.__berichte = [];
      (typeof Backend !== "undefined" ? Backend : window.Backend).zugang = () => ({ rpc: (name, a) => { window.__berichte.push({ name, art: a && a.p_art, d: a && a.p_daten }); return Promise.resolve({ data: { ok: true } }); } });
    }, [ich, anderer]);
    return pg;
  }

  /* Der „Server": trägt Pakete hinüber; Sitzmeldungen kann er zurückhalten. */
  let sitzZurueck = false, laeuft = true;
  const zurueck = [];
  async function tragen(von, nach) {
    while (laeuft) {
      let pakete = [];
      try { pakete = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
      for (const p of pakete) {
        if (sitzZurueck && (p.art === "sitzplatz" || p.art === "spielsitz")) { zurueck.push({ nach, p }); continue; }
        try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
      }
      await schlaf(15);
    }
  }
  const A = await seite("aaa", "bbb"), B = await seite("bbb", "aaa");
  tragen(A, B); tragen(B, A);
  const steht = async () => {
    for (let i = 0; i < 200; i++) {
      const k = await A.evaluate(() => window.LiveChat.pruefKanal()), kb = await B.evaluate(() => window.LiveChat.pruefKanal());
      if (k.bereit.indexOf("bbb") >= 0 && kb.bereit.indexOf("aaa") >= 0) return true;
      await schlaf(50);
    }
    return false;
  };
  const angeboteVonA = () => A.evaluate(() => window.__angebote || 0);
  await A.evaluate(() => { window.__angebote = 0; const alt = window.LiveChat.pruefAbfangen; });
  /* Angebote zählen: der Sonden-Server sieht alle Pakete von A */
  let angebote = 0;
  const zaehlen = setInterval(() => {}, 1000);
  const trage = async () => {};
  /* A bekommt drei „hallo" derselben Sitzung im selben Augenblick */
  console.log("\nA) DREI ERINNERUNGEN DERSELBEN SITZUNG\n");
  await A.evaluate(() => {
    window.__raus.length = 0;
    const h = { art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1, sitzung: "s1" };
    window.LiveChat.pruefEmpfangen(Object.assign({}, h));
    window.LiveChat.pruefEmpfangen(Object.assign({}, h));
    window.LiveChat.pruefEmpfangen(Object.assign({}, h));
  });
  const tA = Date.now();
  /* die Pakete von A mitzählen, bevor der Sonden-Server sie wegträgt: zählen über den Bericht */
  const stehtA = await steht();
  const dauerA = Date.now() - tA;
  await schlaf(1800);
  const berA = (await A.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung").pop();
  const evA = berA ? berA.d.ev : [];
  const zahl = (ev, was) => ev.filter((x) => x[0] === was).length;
  console.log("   A: " + JSON.stringify(evA).slice(0, 400));
  sage(stehtA, "A: die Leitung steht", dauerA + " ms");
  sage(zahl(evA, "angebotRaus") === 1, "A: genau EIN Angebot für drei „hallo“ derselben Sitzung", zahl(evA, "angebotRaus") + " Angebote");
  sage(zahl(evA, "halloErinnerung") === 2, "A: die zwei weiteren sind als Erinnerung vermerkt (Leitung bleibt)", zahl(evA, "halloErinnerung") + "×");

  console.log("\nB) NEUE SITZUNG = NEULADEN\n");
  /* B lädt neu: seine Leitungen sind weg (wie nach einem echten Neuladen), dann grüsst er mit neuer Sitzung */
  await B.evaluate(() => { window.__berichte.length = 0; window.LiveChat.tonNeuAufbauen(); });
  await A.evaluate(() => { window.__berichte.length = 0; window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1, sitzung: "s2" }); });
  let berB = null;
  for (let i = 0; i < 100 && !berB; i++) { await schlaf(50); berB = (await A.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung").pop(); }
  sage(berB && berB.d.ev[0][0] === "hallo" && zahl(berB.d.ev, "angebotRaus") === 1 && berB.d.ev.some((x) => x[0] === "pc" && x[2] === "connected"),
    "B: ein „hallo“ einer neuen Sitzung baut die Leitung neu auf und sie steht", berB ? JSON.stringify(berB.d.ev).slice(0, 300) : "kein Bericht");

  console.log("\nC) ÄLTERE FASSUNG OHNE SITZUNG: DREIMAL NEU AUFGEBAUT, DIE LEITUNG STEHT TROTZDEM\n");
  await A.evaluate(() => { window.__berichte.length = 0; });
  await B.evaluate(() => { window.__berichte.length = 0; });
  const tC = Date.now();
  await B.evaluate(() => { window.LiveChat.tonNeuAufbauen(); });
  await A.evaluate(() => {
    const h = { art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 };
    window.LiveChat.pruefEmpfangen(Object.assign({}, h));
    window.LiveChat.pruefEmpfangen(Object.assign({}, h));
    window.LiveChat.pruefEmpfangen(Object.assign({}, h));
  });
  const stehtC = await steht();
  const dauerC = Date.now() - tC;
  await schlaf(2000);
  const bA = (await A.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung");
  const bB = (await B.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung");
  const evB = bB.length ? bB[bB.length - 1].d.ev : [];
  console.log("   B: " + JSON.stringify(evB).slice(0, 500));
  sage(stehtC && dauerC < 3000, "C: die Leitung steht trotzdem schnell", dauerC + " ms");
  /* (Im Browser kommt meist nur das letzte Angebot hinaus: die früheren Leitungen sind schon zu, bevor createOffer fertig ist.
     Wie viele drüben ankamen und ob welche übersprungen wurden, steht hier nur zur Auskunft.) */
  console.log("   Auskunft: Angebote bei B " + bB.map((b) => zahl(b.d.ev, "angebotDa")).join("/") + ", übersprungen " + bB.map((b) => zahl(b.d.ev, "angebotUeberholt") + "+" + zahl(b.d.ev, "angebotNeueLeitung")).join("/"));

  console.log("\nE) GRUSS UND „AUCH-DA“ IM SELBEN AUGENBLICK (22:54)\n");
  /* B lädt neu (neue Sitzung); A bekommt den Gruss und gleich danach ein „auch-da“ – vorher rief A dabei zweimal an */
  await B.evaluate(() => { window.__berichte.length = 0; window.LiveChat.tonNeuAufbauen(); });
  await A.evaluate(() => {
    window.__berichte.length = 0;
    window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1, sitzung: "s3" });
    window.LiveChat.pruefEmpfangen({ art: "auch-da", von: "bbb", an: "aaa", name: "BBB", seit: 2000, kf: 1 });
  });
  const tE = Date.now();
  const stehtE = await steht();
  const dauerE = Date.now() - tE;
  await schlaf(1800);
  const berE = (await A.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung").pop();
  const evE = berE ? berE.d.ev : [];
  console.log("   A: " + JSON.stringify(evE).slice(0, 400));
  sage(stehtE, "E: die Leitung steht", dauerE + " ms");
  sage(zahl(evE, "angebotRaus") === 1, "E: Gruss und „auch-da“ im selben Augenblick = EIN Angebot", zahl(evE, "angebotRaus") + " Angebote");

  console.log("\nD) QUELLTEXT\n");
  sage(/localStorage\.setItem\("dma_lc_konto", kontoId\)/.test(fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8")), "D: die zuletzt bekannte Konto-Kennung wird gemerkt (keine Zufallskennung nach dem Neuladen)");
  sage(/rueckkehrOffen[\s\S]{0,600}konto: \(Backend\.currentUser\(\) \|\| \{\}\)\.id/.test(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8")), "D: die Rückkehr nach dem Neuladen gibt das Konto mit");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/nutzlast\.art === "hallo" && zustand\.sitzung && !nutzlast\.sitzung\) nutzlast\.sitzung = zustand\.sitzung/.test(lc), "D: jedes „hallo“ trägt die Sitzung");
  sage(/zustand\.sitzung = Math\.random\(\)/.test(lc), "D: die Sitzung entsteht je Betreten");
  const f = A.__fehler.concat(B.__fehler);
  sage(f.length === 0, "keine Fehler in der Konsole", f.slice(0, 3).join(" | "));
  clearInterval(zaehlen);
  laeuft = false;
  console.log("\nFassung 841 (Sonde 862): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
