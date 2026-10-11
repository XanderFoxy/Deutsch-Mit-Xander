#!/usr/bin/env node
/* =====================================================================
   SONDE 884-bild — GESPRÄCH ZUERST, FOTO DANACH (Fassung 884, Funk 288/296)
   ---------------------------------------------------------------------
   XANDER (Funk 296, zum Vorschlag „Profilfoto erst nach dem Gruß“): „Ja
   mach alles weiter“. Bis Fassung 884 fuhr ein Galeriefoto (Datenadresse,
   bis 140 000 Zeichen) voll im „hallo“ und in jedem „auch-da“ – genau in
   dem Fenster, in dem Angebot, Antwort und Wege-Kandidaten durch denselben
   Kanal müssen. Jetzt tragen Gruss und „auch-da“ nur den Fingerabdruck
   (bildH); wer das Foto nicht hat, fragt („bild-bitte“), und die Antwort
   („bild-voll“) geht 1 s nachdem die Leitung steht hinaus, höchstens 4 s
   nach der Frage, gebündelt.
   Geladen wird index.html?quelle (die Quellen, nicht min/).
   ALT_LIVECHAT=<datei> leitet livechat.js auf eine andere Fassung um:
   dann laufen A und B gegen sie (Gegenprobe: A1, A2, A4, A5, A6, B1, B2
   werden rot) und C mischt alt (bbb) mit neu (aaa).
     A  Paketebene, eine Seite (wie Sonde 811)
        A1 hallo ohne Foto, mit bildH, < 2000 Zeichen
        A2 auch-da ohne Foto, mit bildH
        A3 hallo mit eigenem Auftritt trägt das Foto (Funk 140)
        A4 bild-bitte ohne Leitung: nach 0,3 s nichts, nach 4,3 s genau
           einmal bild-voll an den Fragenden; zweite Frage in 10 s: nichts
        A5 zwei Fragende im selben Fenster: EIN bild-voll ohne Anschrift
        A6 Empfang: unbekannter Abdruck → 1 Nachfrage; bild-voll einer
           Unbekannten legt niemanden an; ihr späterer Gruss hat das Foto
           sofort; ein schon bekanntes Foto zeichnet nicht neu
     B  zwei echte Seiten (aaa, bbb), echte RTCPeerConnection, beide mit
        Galeriefoto; der „Server“ ist ein Modell-Relais: jede Richtung eine
        Warteschlange, je Paket Länge×8 / 1 Mbit/s + 50 ms
        B1 bis beide Leitungen stehen, fährt kein Foto und – ausser Angebot
           und Antwort (SDP, je rund 4 000 Zeichen) – kein Paket über 3000
        B2 jedes bild-voll frühestens 0,9 s nach „steht“ des Absenders
        B3 spätestens „steht“ + 2,5 s hat jede Seite das Foto der anderen
        B4 jedes Foto fährt genau einmal
        (dazu: Gruss → steht im Modell)
     C  nur mit ALT_LIVECHAT: bbb alt, aaa neu – beide Fotos kommen an
   EHRLICH: das Relais ist ein Modell (1 Mbit/s, 50 ms), kein echtes 4G.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const ALT = process.env.ALT_LIVECHAT ? fs.readFileSync(process.env.ALT_LIVECHAT, "utf8") : null;
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg",
  ".webmanifest": "application/manifest+json" };
const MBIT = 1, LATENZ = 50;   // Modell des langsamen Kanals
let fehler = 0;
const roteTeile = {};
let teil = "";
const sage = (gut, was, zusatz) => { if (!gut) { fehler++; roteTeile[teil] = (roteTeile[teil] || 0) + 1; } console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
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
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html?quelle";

  /* Eine Seite; alt = livechat.js aus ALT_LIVECHAT; abwehren = Netz nach draussen sperren (Teil A, wie Sonde 811) */
  async function seite(alt, abwehren) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    if (alt) await ctx.route(/\/livechat\.js(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: ALT }));
    if (abwehren) await ctx.route(/supabase\.co|giphy|googleapis|gstatic|open-meteo|youtube/, (r) => r.abort());
    const pg = await ctx.newPage();
    pg.__ctx = ctx;
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => {
      try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
      /* „Leitung steht“ von aussen messen – unabhängig von der Fassung unter Test */
      window.__steht = [];
      const O = window.RTCPeerConnection;
      if (O) {
        class P extends O {
          constructor(...a) { super(...a); this.addEventListener("connectionstatechange", () => { if (this.connectionState === "connected") window.__steht.push(Date.now()); }); }
        }
        window.RTCPeerConnection = P;
      }
    });
    await pg.goto(url, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.LiveChat.pruefAbfangen && window.LiveChat.pruefEmpfangen, { timeout: 40000 });
    return pg;
  }
  async function foto(pg, seed) {
    return pg.evaluate((seed) => { const c = document.createElement("canvas"); c.width = c.height = 360; const g = c.getContext("2d");
      for (let i = 0; i < 3000; i++) { g.fillStyle = "hsl(" + ((i * 37 + seed) % 360) + ",60%," + (30 + (i + seed) % 50) + "%)"; g.fillRect((i * 53 + seed) % 360, (i * 97) % 360, 11, 11); }
      return c.toDataURL("image/jpeg", 0.9); }, seed);
  }
  /* Ein „altes“ Foto setzen (ohne die 20 s nach dem Ändern). Kann die Fassung das nicht (pruefSitz ohne ichBild),
     über bildSetzen – dann muss der Aufrufer 21 s warten. Gibt zurück, ob gewartet werden muss. */
  async function fotoSetzen(pg, o, f) {
    return pg.evaluate(([o, f]) => {
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push({ t: Date.now(), p: JSON.parse(JSON.stringify(p)) }));
      window.LiveChat.pruefSitz(Object.assign({}, o, { ichBild: f }));
      if (window.LiveChat.lage().ichBild === f) return false;
      window.LiveChat.bildSetzen(f);
      return true;
    }, [o, f]);
  }
  const bildBei = (pg, wer) => pg.evaluate((wer) => {
    const p = (window.LiveChat.lage().plaetze || []).find((x) => x && (x.id === wer || (x.person && x.person.id === wer)));
    return p ? ((p.person || p).bild || "") : null;
  }, wer);

  /* =========================== TEIL A =========================== */
  teil = "A";
  console.log("\n  A) PAKETEBENE" + (ALT ? " — GEGEN ALT_LIVECHAT (Gegenprobe)" : ""));
  {
    const pg = await seite(Boolean(ALT), true);
    const f1 = await foto(pg, 0);
    console.log("     Testfoto: " + f1.length + " Zeichen");
    const warten = await fotoSetzen(pg, { lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, buehne: true, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } }, f1);
    if (warten) { console.log("     (diese Fassung kennt pruefSitz({ichBild}) nicht: bildSetzen und 21 s warten)"); await schlaf(21000); }
    const raus = () => pg.evaluate(() => window.__raus.splice(0).map((e) => e.p));
    await raus();

    /* A1 */
    await pg.evaluate(() => window.LiveChat.pruefHallo());
    const h1 = (await raus()).find((n) => n.art === "hallo");
    sage(h1 && !h1.bild && h1.bildH && JSON.stringify(h1).length < 2000, "A1 der Gruss trägt nur den Fingerabdruck (< 2000 Zeichen)",
      h1 ? JSON.stringify(h1).length + " Zeichen, bildH " + h1.bildH : "kein hallo");

    /* A2 */
    await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "cem", name: "Cem", bild: "", seit: 7000 }));
    const a2 = (await raus()).find((n) => n.art === "auch-da");
    sage(a2 && !a2.bild && a2.bildH, "A2 „auch-da“ trägt nur den Fingerabdruck", a2 ? JSON.stringify(a2).length + " Zeichen" : "kein auch-da");

    /* A3 */
    const h3 = await pg.evaluate(() => {
      try { localStorage.setItem("dma_auftritt", "sportwagen"); } catch (e) {}
      window.__raus = [];
      window.LiveChat.pruefHallo();
      try { localStorage.removeItem("dma_auftritt"); } catch (e) {}
      const h = window.__raus.splice(0).map((e) => e.p).find((n) => n.art === "hallo");
      return h ? { auftritt: h.auftritt, l: (h.bild || "").length, bildH: h.bildH } : null;
    });
    sage(h3 && h3.l > 2000, "A3 Gruss mit eigenem Auftritt trägt das Foto (der Wagen fährt mit Gesicht ein)", JSON.stringify(h3));

    /* A4 */
    await raus();
    await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "bild-bitte", von: "bea", an: "ich", h: "x" }));
    await schlaf(300);
    const a4a = (await pg.evaluate(() => window.__raus.map((e) => e.p))).filter((n) => n.art === "bild-voll");
    sage(a4a.length === 0, "A4 auf „bild-bitte“ geht nach 0,3 s noch KEIN Foto hinaus (keine Leitung: warten)", a4a.length + " bild-voll");
    await schlaf(4000);
    const a4b = (await raus()).filter((n) => n.art === "bild-voll");
    sage(a4b.length === 1 && a4b[0].an === "bea" && a4b[0].bild === f1, "A4 nach 4,3 s genau EINMAL das volle Foto an „bea“",
      JSON.stringify(a4b.map((n) => ({ an: n.an, l: (n.bild || "").length }))));
    await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "bild-bitte", von: "bea", an: "ich", h: "x" }));
    await schlaf(4300);
    const a4c = (await raus()).filter((n) => n.art === "bild-voll");
    sage(a4c.length === 0, "A4 eine zweite Frage innerhalb von 10 s bleibt ohne Antwort", a4c.length + " bild-voll");

    /* A5 */
    await pg.evaluate(() => {
      window.LiveChat.pruefEmpfangen({ art: "bild-bitte", von: "dan", an: "ich", h: "x" });
      window.LiveChat.pruefEmpfangen({ art: "bild-bitte", von: "eva", an: "ich", h: "x" });
    });
    await schlaf(4300);
    const a5 = (await raus()).filter((n) => n.art === "bild-voll");
    sage(a5.length === 1 && !a5[0].an && a5[0].bild === f1, "A5 zwei Fragende im selben Fenster: EIN Paket ohne Anschrift",
      JSON.stringify(a5.map((n) => ({ an: n.an || "", l: (n.bild || "").length }))));

    /* A6 */
    const f2 = await foto(pg, 120), f3 = await foto(pg, 240);
    const a6 = await pg.evaluate(([f2, f3]) => {
      const L = window.LiveChat, aus = {};
      window.__raus = [];
      L.pruefEmpfangen({ art: "puls", von: "bea", name: "Bea", bildH: "zz-neu1", seit: 6000, buehne: true, tonAn: true, bildAn: false });
      L.pruefEmpfangen({ art: "puls", von: "bea", name: "Bea", bildH: "zz-neu1", seit: 6000, buehne: true, tonAn: true, bildAn: false });
      aus.bitten = window.__raus.splice(0).map((e) => e.p).filter((n) => n.art === "bild-bitte").map((n) => n.an + ":" + n.h);
      /* gebündeltes Foto einer Unbekannten (ohne Anschrift, mit Abdruck wie nach bildKuerzen) */
      L.pruefEmpfangen({ art: "bild-voll", von: "fritz", name: "Fritz", bild: f2, bildH: "fr-1" });
      const fritzDa = (L.lage().plaetze || []).some((p) => p && (p.id === "fritz" || (p.person && p.person.id === "fritz")));
      aus.fritzAngelegt = fritzDa;
      /* sein Gruss danach: das Foto kommt aus dem Lager, ohne Nachfrage */
      window.__raus = [];
      const gruss = { art: "hallo", von: "fritz", name: "Fritz", bildH: "fr-1", seit: 8000, buehne: true };
      L.pruefEmpfangen(gruss);
      aus.fritzBitte = window.__raus.splice(0).map((e) => e.p).filter((n) => n.art === "bild-bitte").length;
      const fp = (L.lage().plaetze || []).find((p) => p && (p.id === "fritz" || (p.person && p.person.id === "fritz")));
      aus.fritzBild = fp ? (((fp.person || fp).bild || "") === f2) : null;
      /* ein schon bekanntes Foto zeichnet nicht neu – ein neues schon (Gegenprobe des Zählers) */
      let n = 0;
      L.beiAenderung(() => { n++; });
      L.pruefEmpfangen({ art: "bild-voll", von: "fritz", name: "Fritz", bild: f2, bildH: "fr-1" });
      aus.meldenBekannt = n;
      L.pruefEmpfangen({ art: "bild-voll", von: "bea", an: "ich", name: "Bea", bild: f3, bildH: "be-3" });
      aus.meldenNeu = n - aus.meldenBekannt;
      return aus;
    }, [f2, f3]);
    sage(a6.bitten.length === 1 && a6.bitten[0] === "bea:zz-neu1", "A6 unbekannter Fingerabdruck: genau EINE Nachfrage", JSON.stringify(a6.bitten));
    sage(a6.fritzAngelegt === false, "A6 ein Foto ohne Anschrift legt keine Unbekannte an", "angelegt: " + a6.fritzAngelegt);
    sage(a6.fritzBild === true && a6.fritzBitte === 0, "A6 ihr späterer Gruss hat das Foto sofort aus dem Lager, ohne Nachfrage", "Foto: " + a6.fritzBild + ", Nachfragen: " + a6.fritzBitte);
    sage(a6.meldenBekannt === 0 && a6.meldenNeu >= 1, "A6 ein schon bekanntes Foto zeichnet nicht neu (ein neues schon)", "bekannt: " + a6.meldenBekannt + "×, neu: " + a6.meldenNeu + "×");
    sage(!pg.__fehler.length, "A  ohne Seitenfehler", pg.__fehler.slice(0, 2).join(" | "));
    await pg.__ctx.close();
  }

  /* =========================== TEIL B / C =========================== */
  /* altA/altB: welche Seite die ALT_LIVECHAT-Fassung lädt. Gibt die Messwerte zurück. */
  async function zweiSeiten(altA, altB, titel, pruefen) {
    console.log("\n  " + titel);
    const A = await seite(altA, false), B = await seite(altB, false);
    const fA = await foto(A, 11), fB = await foto(B, 200);
    const setz = (ich) => ({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: ich === "aaa" ? 1000 : 2000, buehne: true, zuruecksetzen: true, leute: {} });
    const wA = await fotoSetzen(A, setz("aaa"), fA), wB = await fotoSetzen(B, setz("bbb"), fB);
    for (const pg of [A, B]) {
      await pg.evaluate(() => {
        window.DMA_SPIEL && (window.DMA_SPIEL.empfangen = () => {});
        window.__berichte = [];
        (typeof Backend !== "undefined" ? Backend : window.Backend).zugang = () => ({ rpc: (name, a) => { window.__berichte.push({ name, art: a && a.p_art }); return Promise.resolve({ data: { ok: true } }); } });
      });
    }
    if (wA || wB) { console.log("     (" + (wA ? "aaa" : "") + (wA && wB ? " und " : "") + (wB ? "bbb" : "") + ": bildSetzen, 21 s warten)"); await schlaf(21000); }
    await A.evaluate(() => { window.__raus = []; window.__steht = []; });
    await B.evaluate(() => { window.__raus = []; window.__steht = []; });

    /* Das Modell-Relais: je Richtung eine Warteschlange, Länge×8/1 Mbit/s + 50 ms, Reihenfolge bleibt */
    let laeuft = true;
    const log = [];
    function relais(von, nach, name) {
      let frei = 0, kette = Promise.resolve();
      (async () => {
        while (laeuft) {
          let pakete = [];
          try { pakete = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
          for (const e of pakete) {
            const len = JSON.stringify(e.p).length;
            const start = Math.max(e.t, frei);
            frei = start + len * 8 / (MBIT * 1e6) * 1000;
            const an = frei + LATENZ;
            log.push({ von: name, art: e.p.art, an_: e.p.an || "", len, t: e.t, da: an, bild: e.p.bild === fA ? "A" : e.p.bild === fB ? "B" : "",
                       foto: typeof e.p.bild === "string" && /^data:image\//.test(e.p.bild) });
            kette = kette.then(async () => { const w = an - Date.now(); if (w > 0) await schlaf(w); try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), e.p); } catch (x) {} });
          }
          await schlaf(8);
        }
      })();
    }
    relais(A, B, "aaa"); relais(B, A, "bbb");
    /* bbb kommt herein */
    await B.evaluate(() => window.LiveChat.pruefHallo());
    let sA = null, sB = null;
    const t0 = Date.now();
    while (Date.now() - t0 < 20000 && (!sA || !sB)) {
      sA = (await A.evaluate(() => window.__steht[0] || null)); sB = (await B.evaluate(() => window.__steht[0] || null));
      if (!sA || !sB) await schlaf(20);
    }
    const beide = Math.max(sA || 0, sB || 0);
    /* Fotos: wann hat jede Seite das der anderen? */
    let daA = null, daB = null;   // daA: aaa hat bbb's Foto
    while (Date.now() - t0 < 25000 && (!daA || !daB) && Date.now() < beide + 6000) {
      if (!daA && (await bildBei(A, "bbb")) === fB) daA = Date.now();
      if (!daB && (await bildBei(B, "aaa")) === fA) daB = Date.now();
      if (!daA || !daB) await schlaf(25);
    }
    const restBis = beide + 5000;   // noch zusehen, ob ein Foto ein zweites Mal fährt
    if (Date.now() < restBis) await schlaf(restBis - Date.now());
    laeuft = false;
    await schlaf(100);
    const gruss = log.find((e) => e.von === "bbb" && e.art === "hallo");
    const m = { sA, sB, beide, gruss: gruss && gruss.t, daA, daB, log, fA, fB };
    const ms = (x) => (x == null ? "–" : Math.round(x) + " ms");
    console.log("     Leitung steht: aaa " + ms(sA && gruss && sA - gruss.t) + ", bbb " + ms(sB && gruss && sB - gruss.t) + " nach dem Gruss (Modell " + MBIT + " Mbit/s + " + LATENZ + " ms)");
    console.log("     Pakete bis „steht“: " + log.filter((e) => e.t < beide).map((e) => e.von[0] + ":" + e.art + "(" + e.len + ")").join(" "));
    const bilder = log.filter((e) => e.bild);
    console.log("     Fotos: " + (bilder.map((e) => e.von + " " + e.art + (e.an_ ? "→" + e.an_ : "") + " " + e.len + " Z. bei " + ms(e.t - (gruss ? gruss.t : 0))).join("; ") || "keins"));
    if (pruefen) pruefen(m);
    const f = A.__fehler.concat(B.__fehler);
    sage(f.length === 0, titel.slice(0, 1) + "  ohne Seitenfehler", f.slice(0, 3).join(" | "));
    await A.__ctx.close(); await B.__ctx.close();
    return m;
  }

  const pruefeB = (m) => {
    sage(m.sA && m.sB, "B  beide Leitungen stehen", "aaa " + (m.sA ? "ja" : "nein") + ", bbb " + (m.sB ? "ja" : "nein"));
    /* Angebot und Antwort (SDP) sind selbst rund 4 000 Zeichen – sie SIND der Verbindungsaufbau. Gezählt wird alles andere. */
    const vorher = m.log.filter((e) => e.t < m.beide);
    const gross = vorher.filter((e) => e.foto || (e.len > 3000 && e.art !== "angebot" && e.art !== "antwort"));
    sage(m.beide && gross.length === 0, "B1 bis beide Leitungen stehen, fährt kein Foto und (ausser Angebot/Antwort) kein Paket über 3000 Zeichen",
      gross.map((e) => e.von + ":" + e.art + " " + e.len + (e.foto ? " mit Foto" : "")).join(", ")
        || "größtes sonst " + Math.max(0, ...vorher.filter((e) => e.art !== "angebot" && e.art !== "antwort").map((e) => e.len)) + " Zeichen, Bytes bis „steht“ "
           + vorher.reduce((s, e) => s + e.len, 0));
    const voll = m.log.filter((e) => e.art === "bild-voll");
    const frueh = voll.filter((e) => { const s = e.von === "aaa" ? m.sA : m.sB; return !s || e.t < s + 900; });
    sage(voll.length > 0 && frueh.length === 0, "B2 jedes „bild-voll“ geht frühestens 0,9 s nach „steht“ des Absenders hinaus",
      voll.map((e) => e.von + " +" + Math.round(e.t - (e.von === "aaa" ? m.sA : m.sB)) + " ms").join(", ") || "kein bild-voll");
    sage(m.daA && m.daB && m.daA <= m.beide + 2500 && m.daB <= m.beide + 2500, "B3 spätestens „steht“ + 2,5 s hat jede Seite das Foto der anderen",
      "aaa hat bbb's Foto " + (m.daA ? "+" + Math.round(m.daA - m.beide) + " ms" : "nie") + ", bbb hat aaa's " + (m.daB ? "+" + Math.round(m.daB - m.beide) + " ms" : "nie"));
    const nA = m.log.filter((e) => e.bild === "A").length, nB = m.log.filter((e) => e.bild === "B").length;
    sage(nA === 1 && nB === 1, "B4 jedes Foto fährt genau einmal", "aaa's " + nA + "×, bbb's " + nB + "×");
  };

  teil = "B";
  const mB = await zweiSeiten(Boolean(ALT), Boolean(ALT), "B) ZWEI SEITEN, ECHTE LEITUNG, LANGSAMER KANAL" + (ALT ? " — BEIDE ALT (Gegenprobe)" : ""), pruefeB);

  if (ALT) {
    teil = "C";
    await zweiSeiten(false, true, "C) GEMISCHT: aaa NEU, bbb ALT", (m) => {
      sage(m.sA && m.sB, "C  beide Leitungen stehen");
      const altHallo = m.log.find((e) => e.von === "bbb" && e.art === "hallo");
      /* da = Ankunft im Modell; das Foto bei aaa wird erst nach „steht“ abgefragt, darum zählt hier die Ankunft des Grusses */
      const fragtAaa = m.log.some((e) => e.von === "aaa" && e.art === "bild-bitte");
      sage(altHallo && altHallo.bild === "B" && altHallo.da <= m.beide && m.daA && !fragtAaa, "C  aaa hat bbb's Foto aus dessen vollem Gruss (vor „steht“, ohne Nachfrage)",
        altHallo ? "hallo " + altHallo.len + " Zeichen, da " + Math.round(altHallo.da - m.beide) + " ms vor/nach „steht“" + (fragtAaa ? ", aaa fragte trotzdem" : "") : "kein hallo");
      const bitte = m.log.find((e) => e.von === "bbb" && e.art === "bild-bitte");
      const voll = m.log.filter((e) => e.von === "aaa" && e.art === "bild-voll");
      sage(bitte && voll.length === 1 && voll[0].an_ === "bbb" && voll[0].t >= m.sA + 900 && m.daB && m.daB <= m.beide + 2500,
        "C  das alte bbb fragt selbst, aaa antwortet nach „steht“ + 1 s, und bbb hat aaa's Foto",
        (bitte ? "Frage ja" : "keine Frage") + ", Antwort " + voll.map((e) => "+" + Math.round(e.t - m.sA) + " ms →" + e.an_).join(",") + ", bbb hat es " + (m.daB ? "+" + Math.round(m.daB - m.beide) + " ms" : "nie"));
    });
    teil = "Bneu";
    const mN = await zweiSeiten(false, false, "Vergleich: BEIDE NEU (nur Messung)", null);
    const d = (m) => (m.gruss ? Math.round(Math.max(m.sA, m.sB) - m.gruss) : null);
    console.log("\n  MODELL Gruss → beide Leitungen stehen: alt↔alt " + d(mB) + " ms, neu↔neu " + d(mN) + " ms");
  }

  console.log("\n  " + (fehler ? fehler + " FEHLER" + (ALT ? " (je Teil: " + JSON.stringify(roteTeile) + ")" : "") : "ALLES GUT") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
