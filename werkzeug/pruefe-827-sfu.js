#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 827: DER TONSERVER (Cloudflare Realtime SFU)
   ---------------------------------------------------------------------
   XANDER (Funk 209): „Die App … hängt total erst recht. Wenn andere
   Leute mit dazu kommen … das funktioniert auch bei HelloTalk … was
   müssen wir denn machen damit das endlich leicht und stabil läuft?"
   Walkie 311: „Erst nur Ton über den Server, Bild bleibt wie jetzt".

   Echte Browser-Seiten, echte WebRTC-Leitungen. Den Supabase-Kanal
   spielt die Sonde (sie trägt jedes Paket zu allen anderen Seiten). Die
   Edge-Function „sfu" wird NACHGEBILDET (Route abgefangen): hinter ihr
   steht eine dritte Browser-Seite, die sich wie der Cloudflare-Server
   verhält — sie nimmt die Stimmen an und reicht sie an die weiter, die
   sie abholen. Es geht KEIN Aufruf zu Cloudflare oder Supabase hinaus.

   Geprüft wird:
   1. Ohne Freischaltung: kein einziger Aufruf, kein sfu-Paket, das Netz
      (Mesh) trägt den Ton wie bisher.
   2. Allein im Raum (und mit jemandem ohne Tonserver): kein Aufruf.
   3. Mit Freischaltung (?sfu=1) und zwei Leuten: sitzung → spuren →
      neu_verhandeln, Paketaustausch (sfu-spuren, sfu-hoere), die
      Stimmen kommen über den Server (Tonpakete gezählt), die Netz-
      Tonspur ist leer, Bild-/Spielleitung steht weiter.
   4. Rückfall bei {aus:true, grund:"budget"} im Puls: sofort zurück
      aufs Netz, auf BEIDEN Seiten; danach kein neuer Versuch.
   5. Rückfall bei Fehler (500), bei Zeitüberschreitung (Funktion
      antwortet nie) und wenn die Verbindung zum Server nie steht —
      jeweils innerhalb von ~8 s, ohne Hängen, Netz-Ton wieder da.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/* Der nachgebildete Cloudflare-Server: eine eigene Seite mit je einer
   RTCPeerConnection pro Sitzung. Er antwortet in der Form, die die
   Cloudflare-Doku (Connection API, 22.09.2026) beschreibt. */
const FAKE_SEITE = `<!doctype html><meta charset="utf-8"><title>sfu</title><script>
window.FAKE = (() => {
  const S = {}; let n = 0;
  const sammeln = (pc) => new Promise((r) => { if (pc.iceGatheringState === "complete") return r();
    const t = setTimeout(r, 1500); pc.addEventListener("icegatheringstatechange", () => { if (pc.iceGatheringState === "complete") { clearTimeout(t); r(); } }); });
  async function neu() { const id = "fake" + (++n) + "sitzung" + Math.random().toString(36).slice(2, 8);
    const pc = new RTCPeerConnection(); const s = { pc, name: {}, spur: {} };
    /* Chrome gibt eine empfangene Stimme erst weiter, wenn sie irgendwo
       „abgespielt" wird — also hängt sie an ein stummes Element. */
    pc.ontrack = (e) => { const nm = s.name[e.transceiver.mid]; if (!nm) return; s.spur[nm] = e.track;
      const a = new Audio(); a.muted = true; a.srcObject = new MediaStream([e.track]); a.play().catch(() => {}); s.el = a; };
    S[id] = s; return id; }
  async function lokal(id, angebot, spuren, ohneIce) { const s = S[id]; spuren.forEach((t) => { s.name[String(t.mid)] = t.trackName; });
    await s.pc.setRemoteDescription(angebot); await s.pc.setLocalDescription(await s.pc.createAnswer()); await sammeln(s.pc);
    const sdp = s.pc.localDescription.sdp;
    if (ohneIce) s.pc.close();
    return { sessionDescription: { type: "answer", sdp }, tracks: spuren.map((t) => ({ location: "local", mid: String(t.mid), trackName: t.trackName })) }; }
  async function fern(id, spuren) { const s = S[id]; const tr = [];
    for (const t of spuren) { const q = S[t.sessionId]; const spur = q && q.spur[t.trackName];
      if (!spur) { tr.push({ t, fehlt: true }); continue; }
      tr.push({ t, x: s.pc.addTransceiver(spur, { direction: "sendonly" }) }); }
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
  return { S, neu, lokal, fern, neuVerhandeln, schliessen };
})();
</script>`;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (p === "/__sfu") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(FAKE_SEITE); }
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

  /* Aufrufe an die (nachgebildete) Funktion — und hinaus ins Netz. */
  const aufrufe = [];          // { seite, aktion, marke }
  const nachAussen = [];       // alles, was zu cloudflare.com / supabase.co wollte
  const modus = {};            // je Seite: { aus: {aktion: grund}, fehler: {aktion:1}, haengen: {aktion:1}, ohneIce: bool }

  async function seite(ich, leute, mitFlag) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.__name = ich;
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.route(/cloudflare\.com|supabase\.co/, (r) => { nachAussen.push(ich + " " + r.request().url().slice(0, 60)); r.abort(); });
    await pg.route(/giphy|googleapis|gstatic|open-meteo|youtube|jsdelivr/, (r) => r.abort());
    await pg.route("**/functions/v1/sfu", async (route) => {
      let k = {};
      try { k = JSON.parse(route.request().postData() || "{}"); } catch (e) {}
      const m = modus[ich] || {};
      aufrufe.push({ seite: ich, aktion: k.aktion, marke: (route.request().headers()["authorization"] || "").slice(0, 20), t: Date.now() });
      if (m.haengen && m.haengen[k.aktion]) return;                 // antwortet nie
      if (m.fehler && m.fehler[k.aktion]) return route.fulfill({ status: 500, contentType: "text/plain", body: "kaputt" });
      if (m.aus && m.aus[k.aktion]) return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ aus: true, grund: m.aus[k.aktion] }) });
      let antwort;
      try {
        if (k.aktion === "sitzung") {
          const id = await F.evaluate(() => window.FAKE.neu());
          const r = await F.evaluate(([id, a, s, o]) => window.FAKE.lokal(id, a, s, o), [id, k.angebot, k.spuren, Boolean(m.ohneIce)]);
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
    await pg.goto(basis + "/index.html" + (mitFlag ? "?sfu=1" : ""), { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.LiveChat.pruefEmpfangen, { timeout: 40000 });
    await pg.evaluate(async ([ich, leute]) => {
      const strom = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.__tonId = strom.getAudioTracks()[0].id;
      window.LiveChat.pruefEigenerStrom(strom, true);
      const l = {};
      leute.forEach((id) => { l[id] = { id, name: id.toUpperCase(), seit: 2000, gesehen: 9e15, buehne: true, bild: "" }; });
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: 1000, zuruecksetzen: true, leute: l });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      if (window.LiveChat.pruefSfu) window.LiveChat.pruefSfu({ url: location.origin, marke: "probe-marke" });
    }, [ich, leute]);
    return pg;
  }

  /* Der „Supabase-Kanal": trägt jedes Paket zu allen anderen Seiten. */
  let seiten = [];
  const pakete = [];          // { von, art, p }
  let laeuft = true;
  (async function tragen() {
    while (laeuft) {
      for (const von of seiten.slice()) {
        let raus = [];
        try { raus = await von.evaluate(() => (window.__raus || []).splice(0)); } catch (e) { continue; }
        for (const p of raus) {
          pakete.push({ von: von.__name, art: p.art, p });
          for (const nach of seiten) {
            if (nach === von) continue;
            try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
          }
        }
      }
      await warte(15);
    }
  })();

  const stand = (pg) => pg.evaluate(() => window.LiveChat.pruefSfu ? window.LiveChat.pruefSfu() : null);
  const tonId = (pg) => pg.evaluate(() => window.__tonId);
  const leitungSteht = (pg) => pg.evaluate(() => (window.LiveChat.leitungen() || []).length > 0 && (window.LiveChat.leitungen() || []).every((v) => v.steht));
  async function bis(f, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await f()) return Date.now() - t0; } catch (e) {} await warte(150); } return -1; }
  const aufrufeVon = (name) => aufrufe.filter((a) => a.seite === name);
  const schliesseSeiten = async () => { for (const pg of seiten) { try { await pg.context().close(); } catch (e) {} } seiten = []; };

  /* ---------------------------------------------------------------- */
  console.log("\n  1) OHNE FREISCHALTUNG — alles wie bisher\n");
  {
    const A = await seite("aaa", ["bbb"], false), B = await seite("bbb", ["aaa"], false);
    seiten = [A, B];
    const hatSfu = await A.evaluate(() => Boolean(window.LiveChat.pruefSfu));
    sage(hatSfu, "die Seite hat den Tonserver-Weg (pruefSfu)", hatSfu ? "" : "fehlt — alte Fassung?");
    await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
    const d = await bis(async () => (await leitungSteht(A)) && (await leitungSteht(B)), 15000);
    sage(d >= 0, "die Netz-Leitung steht", d + " ms");
    await warte(7000);        // mehr als zwei Takte des Tonservers
    sage(aufrufe.length === 0, "kein einziger Aufruf der Funktion „sfu“", aufrufe.length + " Aufrufe");
    const sfuPakete = pakete.filter((p) => /^sfu-/.test(p.art));
    sage(sfuPakete.length === 0, "kein sfu-Paket auf dem Kanal", sfuPakete.length + " Pakete");
    const sA = await stand(A), idA = await tonId(A);
    sage(sA && sA.erlaubt === false && sA.aufrufe === 0 && sA.lage === "aus", "Tonserver nicht freigeschaltet, nicht gestartet", sA ? sA.lage + "/" + sA.aufrufe : "");
    sage(sA && sA.meshTon.bbb === idA, "die eigene Stimme geht wie bisher über die Netz-Leitung", sA ? String(sA.meshTon.bbb).slice(0, 8) : "");
    const sB = await stand(B);
    sage(sB && (sB.stromTon.aaa || []).length === 1, "B hat A's Netz-Stimme im Strom", JSON.stringify(sB && sB.stromTon.aaa));
    await schliesseSeiten();
  }

  /* ---------------------------------------------------------------- */
  console.log("\n  2) ALLEIN IM RAUM — und mit jemandem ohne Tonserver\n");
  {
    const vorher = aufrufe.length;
    const C = await seite("ccc", [], true);
    const A = await seite("aaa", ["bbb"], true), B = await seite("bbb", ["aaa"], false);
    seiten = [C, A, B];
    await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
    await warte(8000);
    const sC = await stand(C), sA = await stand(A);
    sage(sC && sC.erlaubt === true, "mit ?sfu=1 ist der Tonserver freigeschaltet", sC ? String(sC.erlaubt) : "");
    sage(aufrufeVon("ccc").length === 0 && sC && sC.lage === "aus", "allein im Raum: kein Aufruf, nichts aufgebaut (0 GB)", aufrufeVon("ccc").length + " Aufrufe, " + (sC && sC.lage));
    sage(aufrufeVon("aaa").length === 0 && sA && sA.lage === "aus", "mit jemandem ohne Tonserver: kein Aufruf", aufrufeVon("aaa").length + " Aufrufe, " + (sA && sA.lage));
    sage(aufrufe.length === vorher, "insgesamt kein Aufruf", (aufrufe.length - vorher) + "");
    await schliesseSeiten();
  }

  /* ---------------------------------------------------------------- */
  console.log("\n  3) MIT FREISCHALTUNG, ZWEI LEUTE — Ton über den Server\n");
  aufrufe.length = 0; pakete.length = 0;
  const A = await seite("aaa", ["bbb"], true), B = await seite("bbb", ["aaa"], true);
  seiten = [A, B];
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  const beideDa = async () => {
    const a = await stand(A), b = await stand(B);
    return a && b && a.lage === "laeuft" && b.lage === "laeuft" && a.empfang.bbb && a.empfang.bbb.bestaetigt
      && b.empfang.aaa && b.empfang.aaa.bestaetigt && a.hoertMich.indexOf("bbb") >= 0 && b.hoertMich.indexOf("aaa") >= 0;
  };
  const dSfu = await bis(beideDa, 30000);
  sage(dSfu >= 0, "beide hören sich über den (nachgebildeten) Tonserver", dSfu + " ms");
  if (dSfu < 0 || process.env.SFU_BEFUND) {
    const befund = await F.evaluate(async () => {
      const aus = [];
      for (const id of Object.keys(window.FAKE.S)) {
        const pc = window.FAKE.S[id].pc; const st = await pc.getStats(); const z = [];
        st.forEach((x) => { if (x.type === "inbound-rtp" || x.type === "outbound-rtp") z.push(x.type + ":" + (x.packetsReceived || x.packetsSent || 0)); });
        aus.push(id.slice(0, 12) + " " + pc.connectionState + " " + pc.signalingState + " spuren=" + Object.keys(window.FAKE.S[id].spur) + " " + z.join(","));
      }
      return aus;
    });
    console.log("     Befund Nachbildung:\n     " + befund.join("\n     "));
    console.log("     Stand A: " + JSON.stringify(await stand(A)).slice(0, 400));
  }
  const reihe = (name) => aufrufeVon(name).map((a) => a.aktion);
  const rA = reihe("aaa"), rB = reihe("bbb");
  const reihenfolge = (r) => r.indexOf("sitzung") === 0 && r.indexOf("spuren") > 0 && r.indexOf("neu_verhandeln") > r.indexOf("spuren");
  sage(reihenfolge(rA) && reihenfolge(rB), "Ablauf je Seite: sitzung → spuren → neu_verhandeln", JSON.stringify(rA) + " / " + JSON.stringify(rB));
  sage(aufrufe.every((a) => a.marke === "Bearer probe-marke"), "jeder Aufruf trägt die Anmeldemarke", "");
  const sp = pakete.filter((p) => p.art === "sfu-spuren" && p.p.sitzung);
  const hoere = pakete.filter((p) => p.art === "sfu-hoere" && p.p.ja);
  sage(sp.some((p) => p.von === "aaa") && sp.some((p) => p.von === "bbb"), "beide sagen ihre Sitzung an (sfu-spuren)", sp.length + " Ansagen");
  sage(hoere.some((p) => p.von === "aaa" && p.p.an === "bbb") && hoere.some((p) => p.von === "bbb" && p.p.an === "aaa"), "beide bestätigen „ich höre dich über den Server“ (sfu-hoere)", hoere.length + "");
  let sA = await stand(A), sB = await stand(B);
  sage(sA && sA.stromTon.bbb.length === 1 && sA.stromTon.bbb[0] === sA.empfang.bbb.spur, "A spielt B's Server-Stimme (und nur die)", JSON.stringify(sA && sA.stromTon.bbb));
  sage(sB && sB.stromTon.aaa.length === 1 && sB.stromTon.aaa[0] === sB.empfang.aaa.spur, "B spielt A's Server-Stimme (und nur die)", "");
  sage(sA && sA.meshTon.bbb === null && sB && sB.meshTon.aaa === null, "die Netz-Tonspur ist auf beiden Seiten leer (kein doppelter Ton)", JSON.stringify([sA && sA.meshTon.bbb, sB && sB.meshTon.aaa]));
  const sfuSpurBbei_A = sA && sA.empfang.bbb && sA.empfang.bbb.spur;
  const tonElemente = await A.evaluate(() => Array.from(document.querySelectorAll("audio")).filter((a) => a.srcObject && a.srcObject.getAudioTracks().length).length);
  sage(tonElemente >= 1, "A hat ein Tonelement, das die Stimme spielt", tonElemente + "");
  sage((await leitungSteht(A)) && (await leitungSteht(B)), "die Netz-Leitung (Bild, Spiel) steht weiter", "");
  const kb = await A.evaluate(() => window.LiveChat.pruefKanal ? window.LiveChat.pruefKanal() : null);
  sage(Boolean(kb && kb.offen.indexOf("bbb") >= 0), "der Spielkanal zu B ist offen", JSON.stringify(kb));
  const bericht = await A.evaluate(() => window.LiveChat.sfuBericht());
  sage(/läuft/.test(bericht), "/verbindung sagt, dass der Tonserver läuft", bericht);
  const puls = await A.evaluate(() => window.LiveChat.pruefSfuPuls());
  sage(puls && puls.ok && aufrufeVon("aaa").some((a) => a.aktion === "puls"), "der Puls geht an die Funktion", JSON.stringify(puls));

  /* ---------------------------------------------------------------- */
  console.log("\n  4) RÜCKFALL: DIE BREMSE SAGT {aus:true, grund:\"budget\"}\n");
  modus.aaa = { aus: { puls: "budget" } };
  const vorAufrufe = aufrufeVon("aaa").length;
  const t4 = Date.now();
  await A.evaluate(() => window.LiveChat.pruefSfuPuls());
  sA = await stand(A);
  sage(sA.lage === "rueckfall" && sA.grund === "budget", "A schaltet sofort ab", sA.lage + " / " + sA.grund + " in " + (Date.now() - t4) + " ms");
  const idA = await tonId(A), idB = await tonId(B);
  sage(sA.meshTon.bbb === idA, "A's Stimme geht wieder übers Netz zu B", String(sA.meshTon.bbb).slice(0, 8));
  sage(sA.stromTon.bbb.length === 1 && sA.stromTon.bbb[0] !== sfuSpurBbei_A && Object.keys(sA.empfang).length === 0, "A spielt wieder B's Netz-Stimme (nicht mehr die vom Server)", JSON.stringify(sA.stromTon.bbb));
  const dB = await bis(async () => { const b = await stand(B); return b && !b.empfang.aaa && b.hoertMich.indexOf("aaa") < 0 && b.meshTon.aaa === idB; }, 5000);
  sB = await stand(B);
  sage(dB >= 0, "B merkt es und schickt/holt A's Ton wieder übers Netz", dB + " ms, B: " + sB.lage);
  sage(sB.stromTon.aaa.length === 1, "B spielt A's Netz-Stimme", JSON.stringify(sB.stromTon.aaa));
  await warte(7000);
  sA = await stand(A);
  const neuA = aufrufeVon("aaa").slice(vorAufrufe);
  sage(!neuA.some((a) => a.aktion === "sitzung") && sA.lage === "rueckfall", "nach der Bremse kein neuer Versuch", JSON.stringify(neuA.map((a) => a.aktion)));
  sage(/aus/.test(await A.evaluate(() => window.LiveChat.sfuBericht())), "/verbindung sagt „aus — Grund: budget“", await A.evaluate(() => window.LiveChat.sfuBericht()));

  /* ---------------------------------------------------------------- */
  async function neuAnfangen(m) {
    modus.aaa = m; modus.bbb = m;
    await A.evaluate(() => window.LiveChat.pruefSfu({ neu: true }));
    await B.evaluate(() => window.LiveChat.pruefSfu({ neu: true }));
    const n0 = aufrufe.length;
    await A.evaluate(() => window.LiveChat.pruefSfu({ takt: true }));
    await B.evaluate(() => window.LiveChat.pruefSfu({ takt: true }));
    return n0;
  }
  async function rueckfallPruefen(name, m, grundMuster, grenzeMs) {
    const n0 = await neuAnfangen(m);
    const dStart = await bis(async () => aufrufe.slice(n0).some((a) => a.aktion === "sitzung"), 10000);
    const d = await bis(async () => { const a = await stand(A), b = await stand(B); return a.lage === "rueckfall" && b.lage === "rueckfall"; }, 15000);
    const a = await stand(A);
    sage(dStart >= 0 && d >= 0 && d <= grenzeMs, name + ": beide zurück aufs Netz", "nach " + d + " ms, Grund: " + a.grund);
    sage(grundMuster.test(a.grund), name + ": Grund benannt", a.grund);
    const tAntwort = Date.now(); await A.evaluate(() => 1); const traeg = Date.now() - tAntwort;
    sage(traeg < 1000, name + ": die Seite hängt nicht", traeg + " ms für einen Aufruf");
    sage(a.meshTon.bbb === idA && a.stromTon.bbb.length === 1 && Object.keys(a.empfang).length === 0, name + ": Netz-Ton in beide Richtungen da", JSON.stringify({ mesh: String(a.meshTon.bbb).slice(0, 6), strom: a.stromTon.bbb.length }));
  }
  console.log("\n  5) RÜCKFALL BEI FEHLER, ZEIT UND OHNE VERBINDUNG\n");
  await rueckfallPruefen("Funktion antwortet 500", { fehler: { sitzung: 1 } }, /kein-json|fehler/, 6000);
  await rueckfallPruefen("Funktion sagt budget beim Start", { aus: { sitzung: "budget" } }, /budget/, 6000);
  await rueckfallPruefen("Funktion antwortet nie", { haengen: { sitzung: 1 } }, /zeit/, 11000);
  await rueckfallPruefen("Verbindung zum Server steht nie", { ohneIce: true }, /zeit|ice/, 11000);

  /* Und zum Schluss: ohne Störung kommen beide wieder zusammen. */
  await neuAnfangen({});
  const dWieder = await bis(beideDa, 30000);
  sage(dWieder >= 0, "ohne Störung schalten beide wieder auf den Tonserver", dWieder + " ms");

  console.log("\n  6) NICHTS GEHT HINAUS\n");
  sage(nachAussen.filter((u) => /cloudflare/.test(u)).length === 0, "kein Aufruf zu cloudflare.com", nachAussen.filter((u) => /cloudflare/.test(u)).slice(0, 2).join(" | "));
  const f = A.__fehler.concat(B.__fehler);
  sage(f.length === 0, "keine Fehler in der Konsole", f.slice(0, 3).join(" | "));

  laeuft = false;
  console.log("\n" + (fehler ? "Fassung 827: " + fehler + " rot." : "Fassung 827: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
