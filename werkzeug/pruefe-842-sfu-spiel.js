#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 842: TONSERVER UND SPIEL
   ---------------------------------------------------------------------
   XANDER (Funk 233): „Wir haben es eben getestet in dem Moment wo ich
   das Spiel angeschalten habe hat der Ton so offenbar wieder Probleme
   gehabt wie verhält sich das mit dem Spiel liegt das auf dem Server
   oder was liegt auf dem was ist mit dem Server warum hängt das jetzt
   schon wieder liegt es an dem Spiel oder war das Zufall"

   Wie pruefe-827-sfu.js: echte Browser-Seiten, echte WebRTC-Leitungen,
   der Supabase-Kanal wird von der Sonde getragen, die Edge-Function
   „sfu" wird abgefangen, und hinter ihr steht eine Browser-Seite, die
   sich wie der Cloudflare-Server verhält. Nichts geht hinaus.

   NEU: die Sonde HÖRT MIT. Auf jeder Seite wird alle 100 ms gezählt,
   wie viele Tonpakete in der Spur ankommen, die gerade wirklich
   gespielt wird (das <audio>, das nicht stumm ist). Daraus:
     - die längste Lücke je Stimme (Grenze 1 s),
     - „doppelt": zwei hörbare Spuren derselben Person, die beide
       Pakete bekommen (Netz UND Server zugleich).

   Geprüft wird:
   1. Zwei Leute, Tonserver läuft. Das Spiel wird mit dem echten Knopf
      („Mitspielen" in der Leiste) eingeschaltet — erst bei A, dann bei
      B, A wieder aus, A wieder an. Die ganze Zeit: keine Lücke > 1 s,
      nichts doppelt, die Server-Sitzung bleibt dieselbe, „empfang"
      bleibt gesetzt, kein neuer Aufruf „sitzung".
   2. Eine dritte Person kommt dazu (während gespielt wird): A und B
      hören sich dabei ohne Lücke weiter, C hört beide und beide C.
   3. Der Server-Weg hört mitten im Gespräch auf zu liefern (der
      Tonserver reicht A's Stimme nicht mehr weiter). Dann muss B
      SOFORT aufs Netz zurück — und A muss seine Netz-Stimme wieder
      schicken. Keine Stille (Lücke höchstens 2 s).
   4. A's Seite fängt neu an (ein „hallo" von A, wie nach einem
      Neuladen oder einem neu verbundenen Raumkanal): keine lange Stille,
      danach wieder alles über den Server.
   5. A geht in den Rückfall (seine Funktion sagt „aus"): B hört A
      sofort übers Netz, A hört B sofort übers Netz — keine Stille.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const LUECKE_MS = 1000;

/* Der nachgebildete Cloudflare-Server (wie in Sonde 827), dazu „stau":
   er reicht die Stimme einer Sitzung nicht mehr weiter. */
const FAKE_SEITE = `<!doctype html><meta charset="utf-8"><title>sfu</title><script>
window.FAKE = (() => {
  const S = {}; let n = 0; const weiter = [];
  const sammeln = (pc) => new Promise((r) => { if (pc.iceGatheringState === "complete") return r();
    const t = setTimeout(r, 1500); pc.addEventListener("icegatheringstatechange", () => { if (pc.iceGatheringState === "complete") { clearTimeout(t); r(); } }); });
  async function neu() { const id = "fake" + (++n) + "sitzung" + Math.random().toString(36).slice(2, 8);
    const pc = new RTCPeerConnection(); const s = { pc, name: {}, spur: {} };
    pc.ontrack = (e) => { const nm = s.name[e.transceiver.mid]; if (!nm) return; s.spur[nm] = e.track;
      const a = new Audio(); a.muted = true; a.srcObject = new MediaStream([e.track]); a.play().catch(() => {}); s.el = a; };
    S[id] = s; return id; }
  async function lokal(id, angebot, spuren) { const s = S[id]; spuren.forEach((t) => { s.name[String(t.mid)] = t.trackName; });
    await s.pc.setRemoteDescription(angebot); await s.pc.setLocalDescription(await s.pc.createAnswer()); await sammeln(s.pc);
    return { sessionDescription: { type: "answer", sdp: s.pc.localDescription.sdp }, tracks: spuren.map((t) => ({ location: "local", mid: String(t.mid), trackName: t.trackName })) }; }
  async function fern(id, spuren) { const s = S[id]; const tr = [];
    for (const t of spuren) { const q = S[t.sessionId]; const spur = q && q.spur[t.trackName];
      if (!spur) { tr.push({ t, fehlt: true }); continue; }
      const x = s.pc.addTransceiver(spur, { direction: "sendonly" }); weiter.push({ von: t.sessionId, an: id, x }); tr.push({ t, x }); }
    await s.pc.setLocalDescription(await s.pc.createOffer()); await sammeln(s.pc);
    return { requiresImmediateRenegotiation: true, sessionDescription: { type: "offer", sdp: s.pc.localDescription.sdp },
      tracks: tr.map((e) => e.fehlt ? { location: "remote", sessionId: e.t.sessionId, trackName: e.t.trackName, errorCode: "not_found", errorDescription: "track not found" }
        : { location: "remote", sessionId: e.t.sessionId, trackName: e.t.trackName, mid: e.x.mid }) }; }
  async function neuVerhandeln(id, antwort) { await S[id].pc.setRemoteDescription(antwort); return {}; }
  async function schliessen(id, mids, angebot) { const s = S[id]; if (!s) return { tracks: [] };
    if (angebot) { await s.pc.setRemoteDescription(angebot); await s.pc.setLocalDescription(await s.pc.createAnswer());
      return { requiresImmediateRenegotiation: false, sessionDescription: { type: "answer", sdp: s.pc.localDescription.sdp }, tracks: mids.map((m) => ({ mid: m })) }; }
    s.pc.getTransceivers().forEach((t) => { if (mids.includes(t.mid)) t.stop(); });
    return { requiresImmediateRenegotiation: false, tracks: mids.map((m) => ({ mid: m })) }; }
  /* Die Stimme der Sitzung „von" wird nicht mehr weitergereicht. */
  function stau(von) { let z = 0; weiter.forEach((w) => { if (w.von === von) { try { w.x.sender.replaceTrack(null); z++; } catch (e) {} } }); return z; }
  return { S, neu, lokal, fern, neuVerhandeln, schliessen, stau };
})();
</script>`;

/* Auf jeder Seite: jede RTCPeerConnection merken (die Sonde muss die
   Empfänger finden, ohne dass die Seite dafür etwas anbietet — so läuft
   dieselbe Messung auch gegen den alten Stand). */
const MITHOEREN = () => {
  const O = window.RTCPeerConnection;
  window.__pcs = [];
  window.RTCPeerConnection = class extends O { constructor(...a) { super(...a); window.__pcs.push(this); } };
  window.__mess = { je: {}, laeuft: false, proben: 0 };
  window.__messNeu = () => { const t = performance.now(); Object.values(window.__mess.je).forEach((m) => { m.maxLuecke = 0; m.zuletztNeu = t; m.doppelt = 0; m.pakete = 0; m.server = 0; m.netz = 0; m.proben = 0; }); };
  async function messen() {
    const L = window.LiveChat;
    if (!L || !L.pruefSfu) return;
    const st = L.pruefSfu();
    /* Nach dem Gegenstand zuordnen: Netz- und Server-Spur derselben
       Person können dieselbe Kennung tragen. */
    const karte = new Map();
    window.__pcs.forEach((pc) => {
      if (pc.signalingState === "closed") return;
      let server = false; try { server = pc.getConfiguration().bundlePolicy === "max-bundle"; } catch (e) {}
      pc.getReceivers().forEach((r) => { if (r.track && r.track.kind === "audio") karte.set(r.track, { r, server }); });
    });
    const hoerbar = new Map();
    document.querySelectorAll("audio,video").forEach((a) => {
      if (!a.srcObject || a.paused || a.muted || !a.srcObject.getAudioTracks) return;
      a.srcObject.getAudioTracks().forEach((t) => { if (t.readyState === "live") hoerbar.set(t, (hoerbar.get(t) || 0) + 1); });
    });
    const jetzt = performance.now();
    for (const id of Object.keys(st.stromTon || {})) {
      const m = window.__mess.je[id] || (window.__mess.je[id] = { letzt: {}, zuletztNeu: jetzt, maxLuecke: 0, doppelt: 0, pakete: 0, server: 0, netz: 0, proben: 0 });
      let laufend = 0, neu = 0, sv = 0, nz = 0, elemente = 0;
      if (!m.schluessel) m.schluessel = new WeakMap();
      for (const [spur, anzahl] of hoerbar) {
        if ((st.stromTon[id] || []).indexOf(spur.id) < 0) continue;
        elemente += anzahl;
        const k = karte.get(spur); if (!k) continue;
        if (!m.schluessel.has(spur)) m.schluessel.set(spur, "s" + (++window.__mess.proben));
        const tid = m.schluessel.get(spur);
        let n = 0;
        try { (await k.r.getStats()).forEach((x) => { if (x.type === "inbound-rtp") n += x.packetsReceived || 0; }); } catch (e) {}
        const alt = m.letzt[tid]; m.letzt[tid] = n;
        if (alt !== undefined && n > alt) { laufend++; neu += n - alt; if (k.server) sv++; else nz++; }
      }
      m.proben++;
      if (laufend > 1 || elemente > 1) m.doppelt++;
      if (neu > 0) { m.maxLuecke = Math.max(m.maxLuecke, jetzt - m.zuletztNeu); m.zuletztNeu = jetzt; m.pakete += neu; }
      if (sv) m.server++; if (nz) m.netz++;
    }
  }
  (async function schleife() { for (;;) { try { await messen(); } catch (e) {} await new Promise((r) => setTimeout(r, 100)); } })();
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (p === "/__sfu") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(FAKE_SEITE); }
    /* Was an der Seite vorbei direkt hier ankommt (keepalive beim Schliessen der Seite). */
    if (p === "/functions/v1/sfu") {
      let roh = ""; q.on("data", (d) => { roh += d; });
      q.on("end", () => { let k = {}; try { k = JSON.parse(roh || "{}"); } catch (e) {}
        if (k.aktion) direkt.push({ aktion: k.aktion, sitzung: k.sitzung || "", alles: k.alles === true });
        a.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); a.end("{\"ok\":true}"); });
      return;
    }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns",
      "--autoplay-policy=no-user-gesture-required"] });
  const F = await (await br.newContext()).newPage();
  await F.goto(basis + "/__sfu");
  await F.waitForFunction(() => window.FAKE);

  const aufrufe = [];
  const direkt = [];
  const nachAussen = [];
  const modus = {};
  const UID = { aaa: "aaaaaaaa-0000-4000-8000-000000000001", bbb: "bbbbbbbb-0000-4000-8000-000000000002", ccc: "cccccccc-0000-4000-8000-000000000003" };

  async function seite(ich, leute) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = []; pg.__name = ich;
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.addInitScript(MITHOEREN);
    await pg.route(/cloudflare\.com|supabase\.co/, (r) => { nachAussen.push(ich + " " + r.request().url().slice(0, 60)); r.abort(); });
    await pg.route(/giphy|googleapis|gstatic|open-meteo|youtube|jsdelivr/, (r) => r.abort());
    await pg.route("**/functions/v1/sfu", async (route) => {
      let k = {};
      try { k = JSON.parse(route.request().postData() || "{}"); } catch (e) {}
      const m = modus[ich] || {};
      aufrufe.push({ seite: ich, aktion: k.aktion, sitzung: k.sitzung || "", alles: k.alles === true, t: Date.now() });
      if (m.aus && m.aus[k.aktion]) return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ aus: true, grund: m.aus[k.aktion] }) });
      let antwort;
      try {
        if (k.aktion === "sitzung") {
          const id = await F.evaluate(() => window.FAKE.neu());
          const r = await F.evaluate(([id, a, s]) => window.FAKE.lokal(id, a, s), [id, k.angebot, k.spuren]);
          antwort = { ok: true, sitzung: id, antwort: r.sessionDescription, spuren: r.tracks };
        } else if (k.aktion === "spuren") {
          antwort = Object.assign({ ok: true }, await F.evaluate(([id, s]) => window.FAKE.fern(id, s), [k.sitzung, k.spuren]));
        } else if (k.aktion === "neu_verhandeln") {
          await F.evaluate(([id, a]) => window.FAKE.neuVerhandeln(id, a), [k.sitzung, k.antwort]);
          antwort = { ok: true };
        } else if (k.aktion === "schliessen") {
          antwort = Object.assign({ ok: true }, await F.evaluate(([id, mids, a]) => window.FAKE.schliessen(id, mids || [], a || null), [k.sitzung, k.mids, k.angebot]));
        } else if (k.aktion === "puls") {
          antwort = { ok: true, verbrauchtGb: 0.001, grenzeGb: 975 };
        } else antwort = { aus: true, grund: "unbekannte-aktion" };
      } catch (e) { return route.fulfill({ status: 500, contentType: "text/plain", body: String(e.message || e).slice(0, 80) }); }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(antwort) });
    });
    await pg.goto(basis + "/index.html?sfu=1", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.LiveChat.pruefEmpfangen && window.DMA_SPIEL && window.DMA_PRUEF, { timeout: 40000 });
    await pg.evaluate(async ([ich, leute, UID]) => {
      const strom = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.__tonId = strom.getAudioTracks()[0].id;
      window.LiveChat.pruefEigenerStrom(strom, true);
      const l = {};
      leute.forEach((id) => { l[id] = { id, name: id.toUpperCase(), seit: 2000, gesehen: 9e15, buehne: true, bild: "" }; });
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: 1000, zuruecksetzen: true, leute: l });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.LiveChat.pruefSfu({ url: location.origin, marke: "probe-marke" });
      /* Das Klassenzimmer zeigen, damit die Spielleiste mit dem Knopf „Mitspielen" da ist. */
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      /* Das Spiel mit einem nachgebildeten Server (wie in Sonde 645). */
      window.LiveChat.spielIdVon = (id) => UID[id] || "";
      const ichSp = { id: UID[ich], name: ich.toUpperCase(), lp: 100, lp_max: 100, kaputt: false, schild: 0, punkte: 50, pflaster: 1, traenke: 1,
        waffen: ["kartoffel"], mission: null, mana: 40, mana_max: 100, mitspielen: false, level: 2, xp: 10, skills: {}, vorraete: {} };
      window.__ichSp = ichSp;
      const klient = { rpc: (name, args) => {
        let data = { ok: true };
        if (name === "spiel_ich") data = ichSp;
        else if (name === "spiel_stand") data = [ichSp];
        else if (name === "spiel_mitspielen") { ichSp.mitspielen = Boolean(args && args.p_an); data = Object.assign({ ok: true }, ichSp); }
        return Promise.resolve({ data, error: null });
      } };
      window.DMA_SPIEL.pruef.setzen({ klient, bereit: true, versucht: true, uid: UID[ich], ich: ichSp, stand: { [UID[ich]]: ichSp }, letzterAbruf: Date.now() });
      window.LiveChat.spielKennungSetzen(UID[ich]);
      const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    }, [ich, leute, UID]);
    return pg;
  }

  let seiten = [];
  const pakete = [];
  let laeuft = true;
  (async function tragen() {
    while (laeuft) {
      for (const von of seiten.slice()) {
        let raus = [];
        try { raus = await von.evaluate(() => (window.__raus || []).splice(0)); } catch (e) { continue; }
        for (const p of raus) {
          pakete.push({ von: von.__name, art: p.art, p, t: Date.now() });
          for (const nach of seiten) {
            if (nach === von) continue;
            try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
          }
        }
      }
      await warte(15);
    }
  })();

  const stand = (pg) => pg.evaluate(() => window.LiveChat.pruefSfu());
  const leitungSteht = (pg) => pg.evaluate(() => (window.LiveChat.leitungen() || []).length > 0 && (window.LiveChat.leitungen() || []).every((v) => v.steht));
  async function bis(f, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await f()) return Date.now() - t0; } catch (e) {} await warte(150); } return -1; }
  const aufrufeVon = (name, ab) => aufrufe.slice(ab || 0).filter((a) => a.seite === name);
  const messNeu = async () => { for (const pg of seiten) await pg.evaluate(() => window.__messNeu()); };
  /* Ergebnis der Messung seit messNeu: je Seite und je gehörter Person. */
  async function messung() {
    const aus = {};
    for (const pg of seiten) {
      aus[pg.__name] = await pg.evaluate(() => {
        const r = {}, t = performance.now();
        Object.keys(window.__mess.je).forEach((id) => { const m = window.__mess.je[id];
          r[id] = { luecke: Math.round(Math.max(m.maxLuecke, t - m.zuletztNeu)), doppelt: m.doppelt, pakete: m.pakete, server: m.server, netz: m.netz, proben: m.proben }; });
        return r;
      });
    }
    return aus;
  }
  /* Hört jede Seite jede andere (aus „wer"), ohne Lücke und nichts doppelt? */
  async function durchgehend(titel, wer, grenze) {
    const m = await messung();
    const zeilen = [], schlecht = [];
    wer.forEach(([hoerer, sprecher]) => {
      const x = (m[hoerer] || {})[sprecher];
      if (!x) { schlecht.push(hoerer + "←" + sprecher + ": keine Messung"); return; }
      zeilen.push(hoerer + "←" + sprecher + " " + x.luecke + "ms/" + x.pakete + "P" + (x.doppelt ? "/doppelt " + x.doppelt : "") + " (S" + x.server + "/N" + x.netz + ")");
      if (x.luecke > (grenze || LUECKE_MS) || x.pakete < 10) schlecht.push(hoerer + "←" + sprecher + " Lücke " + x.luecke + " ms, " + x.pakete + " Pakete");
    });
    sage(!schlecht.length, titel + ": jede Stimme kommt ohne Lücke > " + (grenze || LUECKE_MS) + " ms an", schlecht.length ? schlecht.join("; ") : zeilen.join(" · "));
    if (schlecht.length) {
      for (const pg of seiten) {
        const d = await pg.evaluate(() => { const st = window.LiveChat.pruefSfu();
          const el = Array.from(document.querySelectorAll("audio")).filter((a) => a.srcObject).map((a) => (a.paused ? "P" : "") + (a.muted ? "M" : "") + ":" + a.srcObject.getAudioTracks().map((t) => t.id.slice(0, 6) + t.readyState[0]).join("+"));
          return { lage: st.lage, empfang: st.empfang, hoertMich: st.hoertMich, meshTon: st.meshTon, stromTon: st.stromTon, stille: st.stille, el }; });
        console.log("     " + pg.__name + ": " + JSON.stringify(d).slice(0, 700));
        if (process.env.SFU_BEFUND) {
          const t = await pg.evaluate(async () => { const out = [];
            for (const pc of window.__pcs) { if (pc.signalingState === "closed") continue;
              const sv = pc.getConfiguration().bundlePolicy === "max-bundle";
              for (const tr of pc.getTransceivers()) { let n = -1; try { (await tr.receiver.getStats()).forEach((x) => { if (x.type === "inbound-rtp") n = x.packetsReceived; }); } catch (e) {}
                out.push((sv ? "S" : "N") + " mid=" + tr.mid + " " + tr.direction + "/" + tr.currentDirection + " stop=" + tr.stopped + " rx=" + (tr.receiver.track ? tr.receiver.track.id.slice(0, 6) + tr.receiver.track.kind[0] : "-") + " n=" + n); } }
            const L = window.LiveChat; const leute = L.lage ? L.lage().leute : null;
            return out.join(" | ") + " || leute=" + JSON.stringify(leute || {}).slice(0, 300); });
          console.log("       " + t);
        }
      }
    }
    const doppelt = wer.filter(([h, s]) => ((m[h] || {})[s] || {}).doppelt > 1);
    sage(!doppelt.length, titel + ": keine Stimme doppelt (nie Netz UND Server zugleich hörbar)", doppelt.map(([h, s]) => h + "←" + s + " " + m[h][s].doppelt + "×").join("; "));
    return m;
  }
  async function spielKnopf(pg) {
    const vorher = await pg.evaluate(() => Boolean(window.__ichSp.mitspielen));
    const sel = '.sp-schnell [data-s="mitspielen"]';
    const da = await pg.evaluate((sel) => Boolean(document.querySelector(sel)), sel);
    if (!da) await pg.evaluate(() => window.DMA_SPIEL.pruef.schnellZeichnen && window.DMA_SPIEL.pruef.schnellZeichnen(true));
    try { await pg.click(sel, { timeout: 3000 }); }
    catch (e) { await pg.evaluate((sel) => { const b = document.querySelector(sel); if (b) b.click(); }, sel); }
    const d = await bis(() => pg.evaluate((v) => Boolean(window.__ichSp.mitspielen) !== v, vorher), 4000);
    return d >= 0 ? !vorher : vorher;
  }
  const sitzungVon = async (pg) => (await stand(pg)).sitzung;

  /* ---------------------------------------------------------------- */
  console.log("\n  1) ZWEI LEUTE, TONSERVER LÄUFT — DAS SPIEL WIRD EINGESCHALTET\n");
  const A = await seite("aaa", ["bbb"]), B = await seite("bbb", ["aaa"]);
  seiten = [A, B];
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  const beideServer = async (x, y, ix, iy) => {
    const a = await stand(x), b = await stand(y);
    return a.lage === "laeuft" && b.lage === "laeuft" && a.empfang[iy] && a.empfang[iy].bestaetigt && b.empfang[ix] && b.empfang[ix].bestaetigt
      && a.hoertMich.indexOf(iy) >= 0 && b.hoertMich.indexOf(ix) >= 0;
  };
  const d1 = await bis(() => beideServer(A, B, "aaa", "bbb"), 30000);
  sage(d1 >= 0, "beide hören sich über den (nachgebildeten) Tonserver", d1 + " ms");
  await warte(1500);
  await messNeu(); await warte(2500);
  await durchgehend("vor dem Spiel", [["aaa", "bbb"], ["bbb", "aaa"]]);

  const sitzA0 = await sitzungVon(A), sitzB0 = await sitzungVon(B);
  const n0 = aufrufe.length;
  await messNeu();
  const an1 = await spielKnopf(A);
  sage(an1 === true, "A schaltet das Spiel mit dem Knopf „Mitspielen“ ein", String(an1));
  const spielPakete = () => pakete.filter((p) => p.art === "spiel" && p.p.ereignis === "stand").length;
  await warte(6000);
  sage(spielPakete() >= 1, "das Spiel meldet sich bei den anderen (Spielpaket „stand“)", spielPakete() + "");
  await durchgehend("A spielt", [["aaa", "bbb"], ["bbb", "aaa"]]);
  const an2 = await spielKnopf(B);
  await warte(4000);
  const aus1 = await spielKnopf(A);
  await warte(4000);
  const an3 = await spielKnopf(A);
  await warte(4000);
  sage(an2 === true && aus1 === false && an3 === true, "B an, A aus, A wieder an", JSON.stringify([an2, aus1, an3]));
  await durchgehend("Spiel an/aus/an", [["aaa", "bbb"], ["bbb", "aaa"]]);
  let sA = await stand(A), sB = await stand(B);
  sage(sA.sitzung === sitzA0 && sB.sitzung === sitzB0 && sA.lage === "laeuft" && sB.lage === "laeuft", "die Server-Sitzungen bleiben dieselben (kein Neuaufbau)", sA.lage + "/" + sB.lage);
  sage(sA.empfang.bbb && sA.empfang.bbb.bestaetigt && sB.empfang.aaa && sB.empfang.aaa.bestaetigt, "„empfang“ bleibt auf beiden Seiten gesetzt", JSON.stringify([sA.empfang, sB.empfang]).slice(0, 160));
  const neuSitz = aufrufe.slice(n0).filter((a) => a.aktion === "sitzung" || a.aktion === "schliessen");
  sage(!neuSitz.length, "kein neuer Aufruf „sitzung“ oder „schliessen“ durch das Spiel", JSON.stringify(neuSitz.map((a) => a.seite + ":" + a.aktion)));
  sage(sA.meshTon.bbb === null && sB.meshTon.aaa === null, "die Netz-Tonspur bleibt leer (die Stimme geht nur über den Server)", JSON.stringify([sA.meshTon.bbb, sB.meshTon.aaa]));

  /* ---------------------------------------------------------------- */
  console.log("\n  2) EINE DRITTE PERSON KOMMT DAZU (während gespielt wird)\n");
  const C = await seite("ccc", ["aaa", "bbb"]);
  await messNeu();
  seiten = [A, B, C];
  for (const pg of [A, B]) await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "ccc", name: "CCC", seit: 3000, kf: 1 }));
  const d3 = await bis(async () => (await beideServer(A, C, "aaa", "ccc")) && (await beideServer(B, C, "bbb", "ccc")) && (await beideServer(A, B, "aaa", "bbb")), 40000);
  sage(d3 >= 0, "alle drei hören sich über den Tonserver", d3 + " ms");
  await durchgehend("A und B, während C dazukommt", [["aaa", "bbb"], ["bbb", "aaa"]]);
  await messNeu(); await warte(3000);
  await durchgehend("zu dritt", [["aaa", "bbb"], ["bbb", "aaa"], ["ccc", "aaa"], ["ccc", "bbb"], ["aaa", "ccc"], ["bbb", "ccc"]]);
  const anC = await spielKnopf(C);
  await warte(3000);
  sage(anC === true, "C schaltet das Spiel ein", String(anC));
  await durchgehend("zu dritt, C spielt", [["aaa", "bbb"], ["bbb", "aaa"], ["ccc", "aaa"], ["ccc", "bbb"], ["aaa", "ccc"], ["bbb", "ccc"]]);
  sA = await stand(A);
  sage(sA.sitzung === sitzA0 && sA.lage === "laeuft", "A behält seine Sitzung", sA.lage);

  /* ---------------------------------------------------------------- */
  console.log("\n  3) DER SERVER-WEG LIEFERT A's STIMME NICHT MEHR — SOFORT ZURÜCK AUFS NETZ\n");
  await messNeu();
  const tStau = Date.now();
  const gestaut = await F.evaluate((s) => window.FAKE.stau(s), sitzA0);
  sage(gestaut >= 2, "der nachgebildete Server reicht A's Stimme nicht mehr weiter", gestaut + " Weiterleitungen gestoppt");
  const dNetzB = await bis(async () => { const b = await stand(B), a = await stand(A); return !(b.empfang.aaa && b.empfang.aaa.bestaetigt) && a.hoertMich.indexOf("bbb") < 0 && a.meshTon.bbb; }, 8000);
  sage(dNetzB >= 0 && dNetzB <= 2500, "B hört A wieder übers Netz, A schickt seine Netz-Stimme wieder", dNetzB + " ms");
  await warte(2500);
  await durchgehend("nach dem Stau", [["bbb", "aaa"], ["ccc", "aaa"], ["aaa", "bbb"], ["aaa", "ccc"]], 2000);

  /* ---------------------------------------------------------------- */
  console.log("\n  4) A's RAUMKANAL VERBINDET SICH NEU („hallo“ von A, ohne Neuladen)\n");
  await C.context().close(); seiten = [A, B];
  for (const pg of [A, B]) await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "tschuess", von: "ccc", name: "CCC", kf: 1 }));
  /* Nach dem Stau wird A in B erst nach der Pause wieder über den Server
     abgeholt — für diese Probe gleich neu anfangen lassen. */
  for (const pg of [A, B]) await pg.evaluate(() => window.LiveChat.pruefSfu({ neu: true, takt: true }));
  const d4a = await bis(() => beideServer(A, B, "aaa", "bbb"), 30000);
  sage(d4a >= 0, "A und B hören sich wieder über den Server", d4a + " ms");
  await warte(1500);
  await messNeu();
  const n4 = aufrufe.length;
  const sitzB4 = await sitzungVon(B);
  const echtHallo = await A.evaluate(() => Boolean(window.LiveChat.pruefHallo));
  if (echtHallo) await A.evaluate(() => window.LiveChat.pruefHallo(true));
  else await B.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "aaa", name: "AAA", seit: 1000, kf: 1 }));
  await warte(5000);
  await durchgehend("nach dem neu verbundenen Raumkanal", [["bbb", "aaa"], ["aaa", "bbb"]]);
  sB = await stand(B);
  const auf4 = aufrufe.slice(n4).filter((a) => a.aktion !== "puls");
  sage(sB.sitzung === sitzB4 && sB.empfang.aaa && sB.empfang.aaa.bestaetigt && !auf4.length, "über den Server bleibt alles, wie es war (keine neue Sitzung, empfang bleibt)",
    JSON.stringify(auf4.map((a) => a.seite[0] + ":" + a.aktion)));
  sage((await leitungSteht(A)) && (await leitungSteht(B)), "die Netz-Leitung (Bild, Spiel) steht weiter", "");

  /* ---------------------------------------------------------------- */
  console.log("\n  4b) A LÄDT DIE SEITE NEU — B BEHÄLT SEINE SITZUNG, A WIRD WIEDER ABGEHOLT\n");
  const n4b = aufrufe.length;
  const sitzA4 = await sitzungVon(A);
  await A.close({ runBeforeUnload: true }).catch(() => {});
  await warte(800);
  const zuA = aufrufe.slice(n4b).concat(direkt).some((a) => a.aktion === "schliessen" && a.alles && a.sitzung === sitzA4);
  sage(zuA, "beim Schliessen der Seite macht A seine Server-Sitzung zu", JSON.stringify(direkt));
  const A2 = await seite("aaa", ["bbb"]);
  seiten = [A2, B];
  await messNeu();
  if (await A2.evaluate(() => Boolean(window.LiveChat.pruefHallo))) await A2.evaluate(() => window.LiveChat.pruefHallo(false));
  else await B.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "aaa", name: "AAA", seit: 1000, kf: 1 }));
  await warte(600);
  /* B grüsst zurück; A (kleinere Kennung) ruft an — wie im Raum. */
  await A2.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  const d4b = await bis(() => beideServer(A2, B, "aaa", "bbb"), 40000);
  sB = await stand(B);
  const auf4b = aufrufe.slice(n4b).filter((a) => a.seite === "bbb" && (a.aktion === "sitzung" || (a.aktion === "schliessen" && a.alles)));
  sage(d4b >= 0, "danach hören sich beide wieder über den Server, B hat A in „empfang“", d4b + " ms, B.empfang: " + JSON.stringify(sB.empfang).slice(0, 80));
  sage(!auf4b.length && sB.sitzung === sitzB4, "B baut seine Sitzung dafür NICHT ab und neu auf", JSON.stringify(auf4b.map((a) => a.aktion)));
  await warte(1000);
  await messNeu(); await warte(2500);
  await durchgehend("nach dem Neuladen", [["bbb", "aaa"], ["aaa", "bbb"]]);

  /* ---------------------------------------------------------------- */
  console.log("\n  5) A FÄLLT ZURÜCK („aus“ vom Puls) — BEIDE SOFORT ÜBERS NETZ\n");
  await warte(1500);
  await messNeu();
  modus.aaa = { aus: { puls: "budget" } };
  await A2.evaluate(() => window.LiveChat.pruefSfuPuls());
  await warte(3000);
  await durchgehend("nach dem Rückfall von A", [["bbb", "aaa"], ["aaa", "bbb"]]);
  sA = await stand(A2); sB = await stand(B);
  sage(sA.lage === "rueckfall" && !Object.keys(sA.empfang).length && !sB.empfang.aaa && sB.hoertMich.indexOf("aaa") < 0, "A im Rückfall, B hört A und schickt zu A übers Netz", sA.lage + " / B: " + JSON.stringify(sB.empfang));

  console.log("\n  6) NICHTS GEHT HINAUS, KEINE FEHLER\n");
  sage(nachAussen.filter((u) => /cloudflare/.test(u)).length === 0, "kein Aufruf zu cloudflare.com", "");
  const f = A.__fehler.concat(B.__fehler, C.__fehler, A2.__fehler);
  sage(f.length === 0, "keine Fehler in der Konsole", f.slice(0, 3).join(" | "));

  laeuft = false;
  console.log("\n" + (fehler ? "Fassung 842: " + fehler + " rot." : "Fassung 842: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
