#!/usr/bin/env node
/* =====================================================================
   SONDE 884 — MIKRO RAUSCHT: ERST MESSEN (FASSUNG 884, Funk 191)
   ---------------------------------------------------------------------
   XANDER (Funk 191): „außerdem rauscht das Mikro jetzt so komisch …
   schau doch mal bitte, was da los ist". Es gab keine einzige Zahl.
   Gebaut ist nur die Messung (an den Mikrofon-Einstellungen ändert sich
   nichts): die Wache je Leitung liest aus ihrer ohnehin laufenden
   Statistik (alle 2,5 s) die Tongüte mit; sie reist im 30-s-Bericht
   „verbindung" mit, die Einstellungen des eigenen Mikrofons auch im
   Leitungsbericht „leitung".
   Zwei echte Chromium-Seiten aus den QUELLEN (index.html?quelle), mit
   Test-Mikrofon (piept), die Pakete trägt die Sonde hinüber (wie 861).
   Geprüft:
     A  tonGuete().je[<anderer>] auf beiden Seiten: Pakete > 100,
        ≥ 5 s Ton, verdeckt 0–100 %, Jitter als Zahl, Pegel > 0,01
        (das Test-Mikrofon piept laut), Ruhepegel da und ≤ Pegel
     B  mik: da 1, Echo/Rauschen/Pegelautomatik an, 48 kHz, Art aus
        {bt, kabel, standard, leer}; Datenschutz: kein Gerätename
        („Fake"), keine groupId/deviceId im JSON
     C  beide „leitung"-Berichte tragen d.mik (ec 1), < 6000 Zeichen
     D  pruefAufbauSenden(): genau ein „verbindung"-Bericht mit d.ton.mik
        und d.ton.je[<anderer>], < 6000 Zeichen; keine neue Meldungsart
     E  /verbindung (verbindungsBericht) zeigt „Güte: verdeckt" und
        „Dein Mikrofon: … Rauschunterdrückung an"; „kommt an (" bleibt
     F  Leistung: in einem ruhigen 10-s-Fenster ruft Seite B getStats
        höchstens 5-mal auf (eine Leitung, Wache 4 je 10 s) – die Zahl
        wird ausgegeben, zum Vergleich mit der Gegenprobe
   Dazu: keine Seitenfehler.
   EHRLICH: Das Rauschen selbst lässt sich hier nicht nachstellen – das
   Test-Mikrofon rauscht nicht. Bewiesen wird nur, dass die Messung
   richtig erhoben, klein und ohne Mehrkosten gesendet wird.
   GEGENPROBE: ALT=1 (Stand HEAD) oder ALT_REV=<rev> bzw. ALT=<rev> – der
   kleine Server liefert /livechat.js dann aus „git show <rev>:livechat.js"
   (das Arbeitsverzeichnis bleibt unberührt). Erwartet: A–E rot, F grün
   mit derselben Zahl wie im neuen Lauf.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const ALT = (process.env.ALT || process.env.ALT_REV) ? (process.env.ALT_REV || (process.env.ALT === "1" ? "HEAD" : process.env.ALT)) : "";
const LC = ALT ? execFileSync("git", ["-C", WURZEL, "show", ALT + ":livechat.js"], { maxBuffer: 1 << 28 }).toString("utf8")
               : fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const zahl = (x) => typeof x === "number" && isFinite(x);

(async () => {
  if (ALT) console.log("GEGENPROBE: livechat.js aus " + ALT);
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (p === "/livechat.js") { a.writeHead(200, { "Content-Type": "text/javascript" }); return a.end(LC); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns",
      "--autoplay-policy=no-user-gesture-required"] });
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html?quelle";

  async function seite(ich, anderer) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => {
      try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
      /* F: jeden getStats-Aufruf zählen (Leitung; Empfänger/Sender getrennt) */
      window.__gs = 0; window.__gsr = 0;
      const og = RTCPeerConnection.prototype.getStats;
      RTCPeerConnection.prototype.getStats = function () { window.__gs++; return og.apply(this, arguments); };
      [window.RTCRtpReceiver, window.RTCRtpSender].forEach((K) => {
        if (!K || !K.prototype.getStats) return;
        const o = K.prototype.getStats;
        K.prototype.getStats = function () { window.__gsr++; return o.apply(this, arguments); };
      });
    });
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pg.goto(url, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.LiveChat.mikrofonDazuholen && window.DMA_SPIEL, null, { timeout: 60000 });
    await pg.evaluate(([ich, anderer]) => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: ich === "aaa" ? 1000 : 2000, buehne: true, zuruecksetzen: true,
        leute: { [anderer]: { id: anderer, name: anderer.toUpperCase(), seit: anderer === "aaa" ? 1000 : 2000, gesehen: 9e15, buehne: true, bild: "" } } });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.DMA_SPIEL.empfangen = () => {};
      /* Berichte an den Betreiber abfangen (statt Supabase) */
      window.__berichte = [];
      (typeof Backend !== "undefined" ? Backend : window.Backend).zugang = () => ({ rpc: (name, a) => {
        window.__berichte.push({ name, art: a && a.p_art, d: a && a.p_daten, t: Date.now() }); return Promise.resolve({ data: { ok: true } }); } });
    }, [ich, anderer]);
    return pg;
  }

  let laeuft = true;
  async function tragen(von, nach) {
    while (laeuft) {
      let pakete = [];
      try { pakete = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
      for (const p of pakete) { try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {} }
      await schlaf(15);
    }
  }
  const A = await seite("aaa", "bbb"), B = await seite("bbb", "aaa");
  /* erst das Mikrofon, dann der Gruss – damit die Spur in der Leitung liegt */
  const mikA = await A.evaluate(() => window.LiveChat.mikrofonDazuholen()), mikB = await B.evaluate(() => window.LiveChat.mikrofonDazuholen());
  sage(mikA === true && mikB === true, "Kontrolle: beide Seiten haben das (Test-)Mikrofon", mikA + "/" + mikB);
  tragen(A, B); tragen(B, A);
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  let bereit = false;
  for (let i = 0; i < 300 && !bereit; i++) {
    const k = await A.evaluate(() => window.LiveChat.pruefKanal()), kb = await B.evaluate(() => window.LiveChat.pruefKanal());
    if (k.bereit.indexOf("bbb") >= 0 && kb.bereit.indexOf("aaa") >= 0) bereit = true; else await schlaf(50);
  }
  sage(bereit, "Kontrolle: die Leitung steht");
  await schlaf(12000);

  /* A — Tongüte je Leitung */
  const guete = async (pg) => pg.evaluate(() => (window.LiveChat.tonGuete ? window.LiveChat.tonGuete() : null));
  const gA = await guete(A), gB = await guete(B);
  console.log("   A: " + JSON.stringify(gA));
  console.log("   B: " + JSON.stringify(gB));
  const pruefJe = (g, wer) => {
    const j = g && g.je && g.je[wer];
    return { gut: !!j && j.pk > 100 && j.s >= 5 && zahl(j.v) && j.v >= 0 && j.v <= 100 && zahl(j.j) && zahl(j.pm) && j.pm > 0.01
                  && zahl(j.ruhe) && j.ruhe <= j.pm, j };
  };
  const ja = pruefJe(gA, "bbb"), jb = pruefJe(gB, "aaa");
  sage(ja.gut, "A: Seite A misst die Stimme von B (Pakete, Dauer, verdeckt, Jitter, Pegel, Ruhepegel)", JSON.stringify(ja.j));
  sage(jb.gut, "A: Seite B misst die Stimme von A", JSON.stringify(jb.j));

  /* B — die Einstellungen des eigenen Mikrofons, ohne Gerätenamen */
  const mikGut = (m) => !!m && m.da === 1 && m.ec === 1 && m.ns === 1 && m.agc === 1 && m.sr === 48000 && ["bt", "kabel", "standard", "leer"].indexOf(m.art) >= 0;
  sage(mikGut(gA && gA.mik) && mikGut(gB && gB.mik), "B: mik – da, Echo/Rauschen/Pegelautomatik an, 48 kHz, Art als Kategorie",
    JSON.stringify(gA && gA.mik));
  /* Datenschutz: das Label und die Kennungen des echten Geräts dürfen nirgends stehen */
  const geraet = await A.evaluate(async () => {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    const t = s.getAudioTracks()[0], st = t.getSettings();
    const r = { label: t.label, groupId: st.groupId || "", deviceId: st.deviceId || "" };
    s.getTracks().forEach((x) => x.stop());
    return r;
  });
  console.log("   Gerät (nur hier in der Sonde): " + JSON.stringify(geraet));

  /* C — der Leitungsbericht trägt die Einstellungen */
  const berA = await A.evaluate(() => window.__berichte), berB = await B.evaluate(() => window.__berichte);
  const leitA = berA.filter((b) => b.art === "leitung"), leitB = berB.filter((b) => b.art === "leitung");
  const lA = leitA[0] && leitA[0].d, lB = leitB[0] && leitB[0].d;
  sage(lA && lA.mik && lA.mik.ec === 1 && lB && lB.mik && lB.mik.ec === 1, "C: beide „leitung“-Berichte tragen mik (Echo an)",
    lA && JSON.stringify(lA.mik));
  sage(leitA.length && leitB.length && leitA.concat(leitB).every((b) => JSON.stringify(b.d).length < 6000), "C: jeder Leitungsbericht < 6000 Zeichen",
    leitA.concat(leitB).map((b) => JSON.stringify(b.d).length).join(" / "));

  /* D — der 30-s-Bericht „verbindung" */
  await B.evaluate(() => { window.__berichte.length = 0; if (window.LiveChat.pruefAufbauSenden) window.LiveChat.pruefAufbauSenden(); });
  await schlaf(300);
  const verB = (await B.evaluate(() => window.__berichte)).filter((b) => b.art === "verbindung");
  const dv = verB[0] && verB[0].d;
  sage(verB.length === 1 && dv && dv.ton && dv.ton.mik && dv.ton.mik.da === 1 && dv.ton.je && dv.ton.je.aaa && dv.ton.je.aaa.pk > 0,
    "D: genau ein „verbindung“-Bericht mit ton.mik und ton.je[aaa]", dv && dv.ton ? JSON.stringify(dv.ton).slice(0, 400) : String(verB.length));
  sage(dv && JSON.stringify(dv).length < 6000, "D: Bericht „verbindung“ < 6000 Zeichen", dv && String(JSON.stringify(dv).length));
  const alleBer = berA.concat(berB).concat(verB);
  const arten = Array.from(new Set(alleBer.map((b) => b.art)));
  sage(arten.every((a) => a === "leitung" || a === "verbindung"), "D: keine neue Meldungsart (nur leitung/verbindung)", arten.join(","));
  /* Datenschutz über alles, was hinausging (B) */
  const alles = JSON.stringify(alleBer.map((b) => b.d)) + JSON.stringify(gA) + JSON.stringify(gB);
  const verraet = [/Fake/i.test(alles) && "Label", geraet.groupId && alles.indexOf(geraet.groupId) >= 0 && "groupId",
    geraet.deviceId && geraet.deviceId.length > 8 && alles.indexOf(geraet.deviceId) >= 0 && "deviceId-Wert", /deviceId/.test(alles) && "deviceId"].filter(Boolean);
  sage(/Fake/i.test(geraet.label) && verraet.length === 0 && mikGut(gA && gA.mik), "B: Datenschutz – kein Gerätename, keine groupId/deviceId in Berichten und tonGuete()",
    verraet.join(",") || ("Label „" + geraet.label + "“ nirgends"));

  /* E — /verbindung als Text */
  const vb = await A.evaluate(() => window.LiveChat.verbindungsBericht());
  console.log("   /verbindung:\n      " + vb.split("\n").slice(0, 4).join("\n      "));
  sage(/Güte: verdeckt/.test(vb) && /Dein Mikrofon:/.test(vb) && /Rauschunterdrückung an/.test(vb), "E: /verbindung zeigt Güte und das eigene Mikrofon");
  sage(/kommt an \(/.test(vb), "E (Kontrolle): „kommt an (“ steht weiter darin");

  /* F — keine zusätzlichen getStats-Aufrufe */
  const z0 = await B.evaluate(() => [window.__gs, window.__gsr]);
  await schlaf(10000);
  const z1 = await B.evaluate(() => [window.__gs, window.__gsr]);
  const n = z1[0] - z0[0], nr = z1[1] - z0[1];
  console.log("   F: getStats in 10 s auf Seite B: Leitung " + n + ", Empfänger/Sender " + nr);
  sage(n <= 5 && nr === 0, "F: höchstens 5 getStats-Aufrufe in 10 s (eine Leitung, Wache 4 je 10 s)", n + " + " + nr);

  const f = A.__fehler.concat(B.__fehler);
  sage(f.length === 0, "keine Fehler in der Konsole", f.slice(0, 3).join(" | "));
  laeuft = false;
  console.log("\nFassung 884 mikro (Sonde 884-mikro" + (ALT ? ", GEGENPROBE " + ALT : "") + "): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
