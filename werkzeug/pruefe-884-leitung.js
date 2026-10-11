#!/usr/bin/env node
/* =====================================================================
   SONDE 884 — DAS GESPRÄCH BAUT SICH ZUVERLÄSSIG AUF (FASSUNG 884)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „die Verbindung … hat Priorität".
   Telemetrie seit 881: 126 Zeitleisten, Median „connected" 1,9 s, 16 echte
   Fehlschläge – alle ohne Gruss und ohne Kandidaten von drüben: Anrufe
   der Wache (oder beim Zurückkommen) an wohl abwesende oder im
   Hintergrund schlafende Gegenüber.
   Zwei echte Chromium-Seiten aus den QUELLEN (index.html?quelle), die
   Pakete trägt die Sonde von Hand hinüber (wie 861/862). Geprüft:
     A  Messung: am Angebot steht der Auslöser („hallo|0|neu",
        „puls|0|neu"), der Abbau hat einen Grund („tschuess"), eine
        überholte Zeitleiste geht nicht mehr als scheinbarer Fehlschlag
        hinaus (genau EIN Bericht, mit „vorher"), ein Gegenüber, das
        ging, steht als fort:true im Bericht; Angebot trägt nr, Antwort zu
     B  stumm/taub: die Wache ruft niemanden an, der zwei Pulse verpasst
        hat oder dessen Kanal taub ist; ein frischer Puls ruft sofort an
     C  alte Antwort: eine Antwort auf ein älteres Angebot wird verworfen
        („antwortAlt"); die Leitung scheitert nicht erst an ihr („failed",
        Neuaufbau) – im Labor heilt das die alte Fassung in 0,6 s (schneller
        Neuanruf aus 836), im Feld dauert das Scheitern Sekunden
     D  „auch-da" mit haelt:false: eine über 8 s alte Leitung wird sofort
        frisch angerufen; eine junge bleibt (Fall aus 841); haelt:true und
        ohne haelt (ältere Fassung) wie bisher – nur als LOGIK geprüft
     E  der Gruss der Wache geht nur an das eine Gegenüber („an")
   Dazu: Berichte unter 6000 Zeichen, keine Seitenfehler.
   GEGENPROBE: ALT=<rev> (z. B. ALT=HEAD~1) – der kleine Server liefert
   /livechat.js dann aus „git show <rev>:livechat.js", und auch die
   Quelltext-Prüfungen lesen diese Fassung. Erwartet: A–E rot, die
   Kontrollen (Leitung steht überhaupt, keine Seitenfehler) grün.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const ALT = process.env.ALT || "";
const LC = ALT ? execFileSync("git", ["-C", WURZEL, "show", ALT + ":livechat.js"], { maxBuffer: 1 << 28 }).toString("utf8")
               : fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

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
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns"] });
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html?quelle";
  const seiten = [];

  /* leute: { id: { gesehenVor: ms } } – ohne Angabe „gerade eben" weit in der Zukunft (wie 861/862) */
  async function seite(ich, leute) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pg.goto(url, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.LiveChat.pruefWache && window.DMA_SPIEL, null, { timeout: 60000 });
    await pg.evaluate(([ich, leute]) => {
      const l = {};
      Object.keys(leute).forEach((id) => {
        const o = leute[id] || {};
        l[id] = { id, name: id.toUpperCase(), seit: 2000, buehne: true, bild: "",
                  gesehen: o.gesehenVor != null ? Date.now() - o.gesehenVor : 9e15 };
      });
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: 1000, buehne: true, zuruecksetzen: true, leute: l });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.DMA_SPIEL.empfangen = () => {};
      window.__berichte = [];
      (typeof Backend !== "undefined" ? Backend : window.Backend).zugang = () => ({ rpc: (name, a) => {
        window.__berichte.push({ name, art: a && a.p_art, d: a && a.p_daten, t: Date.now() }); return Promise.resolve({ data: { ok: true } }); } });
    }, [ich, leute]);
    seiten.push(pg);
    return pg;
  }

  /* Der „Server": trägt die Pakete einer Seite zur anderen; regel.halten hält Pakete zurück (regel.gehalten) */
  let laeuft = true;
  function traeger(von, nach) {
    const regel = { halten: null, gehalten: [], log: [] };
    (async () => {
      while (laeuft) {
        let pakete = [];
        try { pakete = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
        for (const p of pakete) {
          regel.log.push(Object.assign({ __t: Date.now() }, p));
          if (regel.halten && regel.halten(p)) { regel.gehalten.push(p); continue; }
          try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
        }
        await schlaf(15);
      }
    })();
    return regel;
  }
  async function paar(a, b) {
    const A = await seite(a, { [b]: {} }), B = await seite(b, { [a]: {} });
    return { A, B, vonA: traeger(A, B), vonB: traeger(B, A) };
  }
  const kanalSteht = async (A, B, a, b, bis) => {
    const t0 = Date.now();
    while (Date.now() - t0 < bis) {
      const k = await A.evaluate(() => window.LiveChat.pruefKanal()), kb = await B.evaluate(() => window.LiveChat.pruefKanal());
      if (k.bereit.indexOf(b) >= 0 && kb.bereit.indexOf(a) >= 0 && k.offen.indexOf(b) >= 0 && kb.offen.indexOf(a) >= 0) return Date.now() - t0;
      await schlaf(40);
    }
    return -1;
  };
  const leiste = (pg, id) => pg.evaluate((id) => (window.LiveChat.pruefLeitungMess() || {})[id] || null, id);
  const zusatzVon = (m, was) => { const e = m && m.ev.find((x) => x[0] === was); return e ? String(e[2] == null ? "" : e[2]) : null; };
  const hallo = (pg, von, sitzung) => pg.evaluate(([von, sitzung]) =>
    window.LiveChat.pruefEmpfangen({ art: "hallo", von, name: von.toUpperCase(), seit: 2000, kf: 1, sitzung }), [von, sitzung]);
  const allesBerichte = [];

  /* ------------------------------------------------------------- A */
  console.log("\nA) MESSUNG: AUSLÖSER, ABBAU-GRUND, ÜBERHOLTE LEISTE, FORT\n");
  {
    const { A, B, vonA, vonB } = await paar("aaa", "bbb");
    await hallo(A, "bbb", "s1");
    const d1 = await kanalSteht(A, B, "aaa", "bbb", 10000);
    sage(d1 >= 0, "Kontrolle: die Leitung steht", d1 + " ms");
    const m1 = await leiste(A, "bbb");
    sage(/^hallo\|0\|neu/.test(zusatzVon(m1, "angebotRaus") || ""), "A: am Angebot steht der Auslöser „hallo|0|neu“", JSON.stringify(m1 && m1.ev.slice(0, 4)));
    const ang = vonA.log.find((p) => p.art === "angebot" && p.an === "bbb"), antw = vonB.log.find((p) => p.art === "antwort");
    sage(ang && typeof ang.nr === "number" && antw && antw.zu === ang.nr, "A: das Angebot trägt nr, die Antwort sagt zu welchem (zu)", ang && antw ? ang.nr + " / " + antw.zu : "fehlt");
    /* ein Unbekannter pulst (kein Gruss) → Anruf mit Auslöser „puls" */
    await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "puls", von: "ccc", name: "CCC", seit: 3000, kf: 1 }));
    await schlaf(400);
    const mc = await leiste(A, "ccc");
    sage(/^puls\|0\|neu/.test(zusatzVon(mc, "angebotRaus") || ""), "A: Puls eines Unbekannten → Anruf mit „puls|0|neu“", JSON.stringify(mc && mc.ev));
    await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "tschuess", von: "ccc", name: "CCC", kf: 1 }));
    const mc2 = await leiste(A, "ccc");
    sage(zusatzVon(mc2, "abbau") === "tschuess", "A: der Abschied steht als [„abbau“, t, „tschuess“] in der Zeitleiste", JSON.stringify(mc2 && mc2.ev));
    await schlaf(2000);
    /* Überholt: A ruft B, die Antworten bleiben hängen, dann ein Neuladen drüben (neue Sitzung) */
    await A.evaluate(() => { window.__berichte.length = 0; });
    vonB.halten = (p) => p.art === "antwort";
    const tUeber = Date.now();
    await hallo(A, "bbb", "s2");
    for (let i = 0; i < 100 && vonB.gehalten.length < 1; i++) await schlaf(50);
    await hallo(A, "bbb", "s3");
    for (let i = 0; i < 100 && vonB.gehalten.length < 2; i++) await schlaf(50);
    const mUeber = await leiste(A, "bbb");
    sage(mUeber && Array.isArray(mUeber.vorher) && mUeber.vorher[0] > 0 && mUeber.vorher[1] === "abbau",
      "A: die neue Zeitleiste vermerkt die überholte (vorher: Ereignisse, letztes, Alter)", JSON.stringify(mUeber && mUeber.vorher));
    /* nur die passende (letzte) Antwort durchlassen */
    vonB.halten = null;
    const letzte = vonB.gehalten[vonB.gehalten.length - 1];
    if (letzte) await A.evaluate((p) => window.LiveChat.pruefEmpfangen(p), letzte);
    const d2 = await kanalSteht(A, B, "aaa", "bbb", 10000);
    sage(d2 >= 0, "Kontrolle: die Leitung steht wieder", d2 + " ms");
    const rest = 31500 - (Date.now() - tUeber);
    console.log("       … " + Math.round(rest / 1000) + " s warten (30-s-Frist der Zeitleisten)");
    await schlaf(Math.max(0, rest));
    const ba = (await A.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung");
    const bbb = ba.filter((b) => b.d && b.d.mit === "bbb"), bccc = ba.filter((b) => b.d && b.d.mit === "ccc");
    sage(bbb.length === 1, "A: seit dem Neuladen genau EIN Bericht für bbb (die überholte Leiste geht nicht mehr hinaus)",
      bbb.length + " Berichte: " + bbb.map((b) => JSON.stringify(b.d.jetzt)).join(" | "));
    sage(bbb[0] && Array.isArray(bbb[0].d.vorher) && bbb[0].d.fort === false && bbb[0].d.lebt >= 0 && typeof bbb[0].d.still === "number",
      "A: der Bericht trägt vorher, fort:false, lebt, still", bbb[0] && JSON.stringify({ vorher: bbb[0].d.vorher, fort: bbb[0].d.fort, lebt: bbb[0].d.lebt, still: bbb[0].d.still }));
    sage(bccc.length === 1 && bccc[0].d.fort === true && bccc[0].d.lebt >= 0,
      "A: ccc (ging nach dem Anruf) steht nach 30 s mit fort:true und seinem letzten Lebenszeichen im Bericht",
      bccc[0] && JSON.stringify({ fort: bccc[0].d.fort, lebt: bccc[0].d.lebt, still: bccc[0].d.still, ev: bccc[0].d.ev }));
    sage(bbb[0] && /host|srflx|relay|prflx/.test(bbb[0].d.weg || ""), "Kontrolle: „weg“ ist weiter der Weg der Leitung", bbb[0] && bbb[0].d.weg);
    allesBerichte.push(...ba, ...(await B.evaluate(() => window.__berichte)));
  }

  /* ------------------------------------------------------------- B */
  console.log("\nB) KEIN ANRUF INS LEERE (STUMM / TAUB)\n");
  {
    const P = await seite("aaa", { bbb: { gesehenVor: 20000 } });
    await P.evaluate(() => window.LiveChat.pruefWache({ geduld: 300, takt: 100 }));
    await schlaf(2000);
    const n1 = await P.evaluate(() => window.__raus.filter((p) => p.art === "angebot").length);
    sage(n1 === 0, "B: ein Gegenüber, von dem seit 20 s nichts kam, wird von der Wache nicht angerufen", n1 + " Angebote in 2 s");
    await P.evaluate(() => { window.__raus.length = 0; window.LiveChat.pruefEmpfangen({ art: "puls", von: "ccc", name: "CCC", seit: 3000, kf: 1, taub: 1 }); });
    await schlaf(1000);
    const n2 = await P.evaluate(() => window.__raus.filter((p) => p.art === "angebot").length);
    sage(n2 === 0, "B: ein Puls mit „taub“ (sein Kanal hört nichts) → kein Anruf", n2 + " Angebote in 1 s");
    await P.evaluate(() => { window.__raus.length = 0; window.LiveChat.pruefEmpfangen({ art: "puls", von: "bbb", name: "BBB", seit: 2000, kf: 1 }); });
    await schlaf(1000);
    const r3 = await P.evaluate(() => ({ n: window.__raus.filter((p) => p.art === "angebot" && p.an === "bbb").length, m: window.LiveChat.pruefLeitungMess().bbb || null }));
    sage(r3.n >= 1 && /^puls\|0\|neu/.test(zusatzVon(r3.m, "angebotRaus") || ""), "B: sein frischer Puls → sofort ein Anruf („puls|0|neu“)", r3.n + " Angebote, " + zusatzVon(r3.m, "angebotRaus"));
    await P.evaluate(() => { window.__raus.length = 0; window.LiveChat.pruefEmpfangen({ art: "puls", von: "ccc", name: "CCC", seit: 3000, kf: 1 }); });
    await schlaf(1000);
    const r4 = await P.evaluate(() => ({ n: window.__raus.filter((p) => p.art === "angebot" && p.an === "ccc").length, m: window.LiveChat.pruefLeitungMess().ccc || null }));
    sage(r4.n >= 1 && /^puls\|0\|neu/.test(zusatzVon(r4.m, "angebotRaus") || ""), "B: hört ccc wieder (Puls ohne „taub“) → sofort ein Anruf", r4.n + " Angebote, " + zusatzVon(r4.m, "angebotRaus"));
    sage(/var STUMM_MS = 2 \* PULS_MS \+ 500/.test(LC), "B: Quelltext – stumm heisst zwei verpasste Pulse");
    sage(/var GEIST_MS = 90000;/.test(LC), "Kontrolle: GEIST_MS unverändert (Sonde 866)");
    allesBerichte.push(...(await P.evaluate(() => window.__berichte)));
  }

  /* ------------------------------------------------------------- C */
  console.log("\nC) DIE ANTWORT GEHÖRT ZUM ANGEBOT\n");
  {
    const { A, B, vonB } = await paar("aaa", "bbb");
    await A.evaluate(() => window.LiveChat.pruefWache({}));
    vonB.halten = (p) => p.art === "antwort";
    await hallo(A, "bbb", "s1");
    for (let i = 0; i < 100 && vonB.gehalten.length < 1; i++) await schlaf(50);
    await hallo(A, "bbb", "s2");
    for (let i = 0; i < 100 && vonB.gehalten.length < 2; i++) await schlaf(50);
    sage(vonB.gehalten.length === 2, "Kontrolle: zwei Antworten festgehalten (auf das erste und das zweite Angebot)", vonB.gehalten.length + "");
    vonB.halten = null;
    const t0 = Date.now();
    for (const p of vonB.gehalten) await A.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p);   // erst die alte, dann die neue
    const d = await kanalSteht(A, B, "aaa", "bbb", 15000);
    const dauer = d < 0 ? -1 : Date.now() - t0;
    sage(dauer >= 0, "Kontrolle: die Leitung steht überhaupt", dauer + " ms");
    /* Im Labor heilt auch die alte Fassung schnell: die falsche Antwort lässt die Leitung auf 127.0.0.1 sofort
       scheitern („failed"), und der schnelle Neuanruf aus 836 baut nach 0,4 s neu. Im Feld (ohne Rückmeldung des
       Netzes) dauert dieses Scheitern Sekunden. Darum ist die Zeit hier nur Kontrolle; entscheidend ist, dass die
       Leitung gar nicht erst scheitert. */
    sage(dauer >= 0 && dauer < 3000, "Kontrolle: alte Antwort zuerst, dann die passende → Leitung steht in unter 3 s", dauer + " ms");
    const m = await leiste(A, "bbb");
    sage(m && m.ev.some((x) => x[0] === "antwortAlt"), "C: die alte Antwort ist als „antwortAlt“ vermerkt und verworfen", JSON.stringify(m && m.ev.filter((x) => /^antwort|^pc$/.test(x[0]))));
    sage(m && !m.ev.some((x) => x[0] === "pc" && x[2] === "failed") && m.ev.filter((x) => x[0] === "angebotRaus").length === 1,
      "C: die Leitung scheitert nicht erst (kein „failed“, kein zweites Angebot)", JSON.stringify(m && m.ev.filter((x) => x[0] === "angebotRaus" || (x[0] === "pc" && x[2] === "failed"))));
    allesBerichte.push(...(await A.evaluate(() => window.__berichte)), ...(await B.evaluate(() => window.__berichte)));
  }

  /* ------------------------------------------------------------- D */
  console.log("\nD) „AUCH-DA“ SAGT, OB DRÜBEN EINE LEITUNG STEHEN BLIEB (nur Logik)\n");
  {
    const { A, B, vonA } = await paar("aaa", "bbb");
    const tPc = Date.now();
    await hallo(A, "bbb", "s1");
    const d1 = await kanalSteht(A, B, "aaa", "bbb", 10000);
    sage(d1 >= 0, "Kontrolle: die Leitung steht", d1 + " ms");
    const auch = (haelt) => A.evaluate((haelt) => {
      const n = { art: "auch-da", von: "bbb", an: "aaa", name: "BBB", seit: 2000, kf: 1 };
      if (haelt !== undefined) n.haelt = haelt;
      window.LiveChat.pruefEmpfangen(n);
    }, haelt);
    const angeboteNach = async (fn) => { const vor = vonA.log.length; await fn(); await schlaf(600); return vonA.log.slice(vor).filter((p) => p.art === "angebot").length; };
    const n0 = await angeboteNach(() => auch(false));
    sage(n0 === 0, "D: „auch-da“ haelt:false bei einer jungen Leitung (< 8 s) → kein neues Angebot (841)", n0 + "");
    await schlaf(Math.max(0, 8600 - (Date.now() - tPc)));
    const n1 = await angeboteNach(() => auch(true));
    const n2 = await angeboteNach(() => auch(undefined));
    sage(n1 === 0 && n2 === 0, "D: haelt:true bzw. ohne haelt (ältere Fassung) → kein neues Angebot", n1 + " / " + n2);
    const tVor = await A.evaluate(() => Date.now());
    const n3 = await angeboteNach(() => auch(false));
    const m = await leiste(A, "bbb");
    sage(n3 >= 1 && /^auch-da\|0\|neu/.test(zusatzVon(m, "angebotRaus") || ""), "D: haelt:false bei einer Leitung über 8 s → abgebaut und sofort frisch angerufen („auch-da|0|neu“)",
      n3 + " Angebote, " + zusatzVon(m, "angebotRaus"));
    let neu = null;
    for (let i = 0; i < 75 && !neu; i++) { const mm = await leiste(A, "bbb"); if (mm && mm.t0 >= tVor && mm.ev.some((x) => x[0] === "pc" && x[2] === "connected")) neu = mm; else await schlaf(40); }
    sage(Boolean(neu), "D: danach steht die (neue) Leitung binnen 3 s wieder", neu ? JSON.stringify(neu.ev.filter((x) => x[0] === "pc")) : "nein");
    allesBerichte.push(...(await A.evaluate(() => window.__berichte)), ...(await B.evaluate(() => window.__berichte)));
  }

  /* ------------------------------------------------------------- E */
  console.log("\nE) DER GRUSS DER WACHE GEHT NUR AN DAS EINE GEGENÜBER\n");
  {
    const Z = await seite("zzz", { aaa: {} });
    await Z.evaluate(async () => {
      const pc = new RTCPeerConnection(); pc.createDataChannel("x");
      const o = await pc.createOffer(); await pc.setLocalDescription(o);
      window.__fremd = pc;
      window.LiveChat.pruefEmpfangen({ art: "angebot", von: "aaa", an: "zzz", name: "AAA", kf: 1, nr: 7, beschreibung: { type: o.type, sdp: o.sdp } });
    });
    await Z.evaluate(() => window.LiveChat.pruefWache({ geduld: 300, takt: 100 }));
    let hallos = [];
    for (let i = 0; i < 60 && !hallos.length; i++) { await schlaf(50); hallos = await Z.evaluate(() => window.__raus.filter((p) => p.art === "hallo")); }
    const antw = await Z.evaluate(() => window.__raus.find((p) => p.art === "antwort") || null);
    sage(antw && antw.zu === 7, "E: die Antwort sagt, zu welchem Angebot sie gehört", antw ? String(antw.zu) : "keine Antwort");
    sage(hallos.length >= 1, "Kontrolle: die Wache der grösseren Kennung grüsst, wenn die Leitung nicht zustande kommt", hallos.length + "");
    sage(hallos.length >= 1 && hallos.every((h) => h.an === "aaa"), "E: der Gruss geht nur an „aaa“ (andere bauen ihre stehenden Leitungen nicht ab)", hallos.map((h) => h.an).join(","));
    allesBerichte.push(...(await Z.evaluate(() => window.__berichte)));
  }

  /* ------------------------------------------------------------- Rest */
  console.log("\nALLGEMEIN\n");
  const gross = allesBerichte.filter((b) => b.art === "leitung").map((b) => JSON.stringify(b.d).length);
  sage(gross.length > 0 && Math.max(...gross) < 6000, "die Berichte bleiben unter 6000 Zeichen", gross.length + " Berichte, höchstens " + Math.max(0, ...gross));
  const f = [].concat(...seiten.map((pg) => pg.__fehler));
  sage(f.length === 0, "Kontrolle: keine Seitenfehler", f.slice(0, 3).join(" | "));
  laeuft = false;
  console.log("\nFassung 884 (Sonde 884 leitung" + (ALT ? ", Gegenprobe " + ALT : "") + "): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
