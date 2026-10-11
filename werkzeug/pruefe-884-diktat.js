#!/usr/bin/env node
/* =====================================================================
   SONDE 884 — WALKIE-DIKTAT IM LIVESTREAM: MAN BLEIBT HÖRBAR (Funk 163)
   ---------------------------------------------------------------------
   XANDER (Funk 163): „hast du mal geschaut warum ich mit niemanden mehr
   sprechen kann auch das Mikrofon im Chat wenn ich dir etwas übers
   Walkie-Talkie schicken will sobald ich da mit jemanden spreche
   irgendwie und dich aktiviere das aber hier schaltet sich das wieder aus
   wenn jemand da ist das soll generell immer aktiv sein …".
   Bis 883 lieh das Diktat im Livestream das Mikrofon aus (die anderen
   hörten einen nicht). Seit 884 nimmt es eine KOPIE der Live-Spur auf und
   lässt sie von der Zentrale („erkennen“) aufschreiben.
   Aufbau: echter Chromium, Telefonbreite 412 px, die Seite aus den
   QUELLEN (index.html?quelle) und danach aus min/ (vorher
   „node werkzeug/fassung-setzen.js --nur-stempel“). Nachgebaut:
     - Spracherkennung des Browsers (zählt Starts: __rfRunden),
     - Backend (Betreiber, Funk-Mitschrift),
     - AusspracheP.zentralErkennen (merkt sich jede WAV, antwortet nach
       einer einstellbaren Zeit mit Success/„Satz k.“; je Fall abgewandelt),
     - die Live-Spur: eine WebAudio-Quelle mit 48 kHz spricht „Sätze“
       (1 kHz + 5,5 kHz + 11 kHz, Silbentakt 4 Hz) – über
       MediaStreamDestination in LiveChat.pruefEigenerStrom / „drin“,
     - „die anderen“: dieselbe Spur geht über eine lokale Leitung A→B;
       gemessen wird totalAudioEnergy von inbound-rtp bei B alle 100 ms.
   Geprüft (Diktat über den echten 🎤 im Feld .rf-vorschlag):
     1  im Livestream startet KEINE Browser-Erkennung, nichts ausgeliehen,
        tonAn bleibt, Original-Spur lebt und ist an, kein „stumm“ hinaus
     2  HÖRBAR: bei B kommt in jedem Satz Ton an, keine Lücke > 1 s
     3  drei Sätze (Pausen 2,2 s) = drei Anfragen; WAV RIFF/16 kHz/mono/
        16 Bit, ≤ 55 s, ≤ 0,45 s Stille vorn; mit 1,2-s-Pausen werden die
        ersten beiden zusammengefasst (Stück < 4 s)
     4  kein Falten: 5-kHz-Rest < 1 % von 1 kHz; 1 kHz und 5,5 kHz ≥ 95 %
        – mit 16-kHz-Kontext und mit Gerätefrequenz (rate16k = false)
     5  Feld „Satz 1. Satz 2. Satz 3.“ in Reihenfolge (Antwortzeiten 1,5 /
        0,2 / 0,7 s)
     6  ⏹ mitten im 3. Satz: der Rest geht noch hinaus, „Einen Moment …“,
        dann „✓ Steht im Feld …“, Knopf 🎤, Kontext zu, Klon beendet,
        Original lebt
     7  harter Schnitt: stueckMaxMs = 3000, 7 s Dauerrede → ≥ 3 Stücke,
        jedes ≤ 3 s; im Original stueckMaxMs ≤ 55000
     8  Nachschub: deckt die Antwort nur die erste Hälfte ab, folgt eine
        zweite, kürzere Anfrage, beide Texte stehen im Feld
     9  Fehler „tagesgrenze“: endet sichtbar mit Grund, Text bleibt,
        „[automatisch] Diktat-Fehler: strom-tagesgrenze …“ im Funk
     10 kein Block in 3 s (addModule hängt): Rückfall auf den alten Weg
        (__rfRunden === 1), Meldung strom-kein-start
     11 außerhalb des Livestreams: wie bisher, Browser-Erkennung, keine
        Anfrage an die Zentrale
     12 stumm geschaltet (tonUmschalten): das Diktat hört trotzdem, B hört
        weiter nichts
     13 Leistung: 30-s-Diktat, keine lange Aufgabe > 100 ms; alsWav-Zeit je
        Stück wird ausgegeben
     14 keine Seitenfehler
   GEGENPROBE: ALT=1 (oder ALT_REV=<rev>) – der kleine Server liefert
   rueckfrage.js, livechat.js und aussprache-pruefung.js aus
   „git show <rev>:<datei>“ (Standard a043c20, der Stand direkt vor diesem
   Punkt), nur der Quellen-Lauf. Enthält die Revision den Bau schon,
   bricht die Sonde ab. Erwartet rot: 1, 2, 3–9, 12 (keine Anfrage).
   EHRLICH: echtes Azure, Samsung Internet und ein Gespräch über zwei
   Geräte sind hier nicht nachstellbar; die lokale Leitung zeigt nur, dass
   die unveränderte Spur weiter Ton liefert.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const VOR_884_DIKTAT = "a043c20";   // der Stand direkt vor „WIP 884 diktat"
const ALT = (process.env.ALT || process.env.ALT_REV) ? (process.env.ALT_REV || (process.env.ALT === "1" ? VOR_884_DIKTAT : process.env.ALT)) : "";
const DATEIEN = ["rueckfrage.js", "livechat.js", "aussprache-pruefung.js"];
const ERSATZ = {};
if (ALT) {
  DATEIEN.forEach((d) => { ERSATZ["/" + d] = execFileSync("git", ["-C", WURZEL, "show", ALT + ":" + d], { maxBuffer: 1 << 28 }).toString("utf8"); });
  if (/tonSpurKlon/.test(ERSATZ["/livechat.js"]) || /diktatAusStrom/.test(ERSATZ["/rueckfrage.js"])) {
    console.log("GEGENPROBE UNGÜLTIG: " + ALT + " enthält den Bau schon – sie wäre grün und bewiese nichts. ALT=1 (= " + VOR_884_DIKTAT + ") nehmen.");
    process.exit(3);
  }
}
const NUR = process.env.NUR || "";   // "quelle" oder "min": nur ein Lauf
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- WAV lesen und messen (in Node) --- */
function wavLesen(b64) {
  const b = Buffer.from(b64, "base64");
  const kopf = { riff: b.toString("ascii", 0, 4), wave: b.toString("ascii", 8, 12), pcm: b.readUInt16LE(20),
    kanaele: b.readUInt16LE(22), rate: b.readUInt32LE(24), bits: b.readUInt16LE(34), data: b.toString("ascii", 36, 40) };
  const n = (b.length - 44) >> 1, x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = b.readInt16LE(44 + 2 * i) / 32768;
  return { kopf, x, dauer: n / 16000 };
}
function goertzel(x, f, rate) {
  const w = 2 * Math.PI * f / rate, c = 2 * Math.cos(w);
  let s1 = 0, s2 = 0;
  for (let i = 0; i < x.length; i++) { const s0 = x[i] + c * s1 - s2; s2 = s1; s1 = s0; }
  const re = s1 - s2 * Math.cos(w), im = s2 * Math.sin(w);
  return 2 * Math.sqrt(re * re + im * im) / x.length;
}
function anfang(x) { for (let i = 0; i < x.length; i++) if (Math.abs(x[i]) > 0.02) return i; return -1; }
/* Spektrum 1 s ab 0,3 s nach dem Einsatz (mitten im ersten Satz) */
function spektrum(w) {
  const a = anfang(w.x);
  if (a < 0 || a + 0.3 * 16000 + 16000 > w.x.length) return null;
  const seg = w.x.subarray(a + 4800, a + 4800 + 16000);
  const f1 = goertzel(seg, 1000, 16000), f5 = goertzel(seg, 5000, 16000), f55 = goertzel(seg, 5500, 16000);
  return { f1, f5, f55, falten: f5 / f1, hoch: (f55 / f1) / 0.5, tief: f1 / 0.12 };
}

(async () => {
  if (ALT) console.log("GEGENPROBE: " + DATEIEN.join(", ") + " aus " + ALT + " (nur Quellen)");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    if (ERSATZ[p]) { a.writeHead(200, { "Content-Type": "text/javascript" }); return a.end(ERSATZ[p]); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required",
      "--disable-features=WebRtcHideLocalIpsWithMdns"] });
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const laeufe = ALT ? ["quelle"] : (NUR ? [NUR] : ["quelle", "min"]);
  for (const lauf of laeufe) {
    console.log("\n=== Lauf: " + (lauf === "quelle" ? "Quellen (index.html?quelle)" : "min/ (index.html)") + " ===");
    await einLauf(br, lauf === "quelle" ? basis + "?quelle" : basis);
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.log("ABBRUCH: " + (e && e.stack || e)); process.exit(2); });

async function einLauf(br, url) {
  const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(String(e.message || e)));
  await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await pg.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); localStorage.removeItem("dma_funk_offen"); } catch (e) {}
    /* Spracherkennung des Browsers: zählt Starts, liefert „alter weg“ */
    window.__rfRunden = 0;
    window.webkitSpeechRecognition = class {
      start() {
        window.__rfRunden++;
        setTimeout(() => this.onstart && this.onstart(), 20);
        setTimeout(() => this.onresult && this.onresult({ resultIndex: 0,
          results: [Object.assign([{ transcript: "alter weg" }], { isFinal: true })] }), 120);
        this._ende = setTimeout(() => this.onend && this.onend(), 60000);
      }
      stop() { clearTimeout(this._ende); setTimeout(() => this.onend && this.onend(), 10); }
      abort() { clearTimeout(this._ende); setTimeout(() => this.onend && this.onend(), 10); }
    };
    window.SpeechRecognition = window.webkitSpeechRecognition;
    /* jeden AudioContext merken (das Diktat legt seinen im Tipp an) */
    const OAC = window.AudioContext;
    window.__OAC = OAC;
    window.__ctxe = [];
    window.AudioContext = class extends OAC { constructor(o) { super(o); window.__ctxe.push(this); } };
    /* Fall 10: das Worklet-Modul hängt */
    window.__wHaengt = false;
    if (window.AudioWorklet) {
      const oAdd = AudioWorklet.prototype.addModule;
      AudioWorklet.prototype.addModule = function (u, o) { return window.__wHaengt ? new Promise(() => {}) : oAdd.call(this, u, o); };
    }
    /* lange Aufgaben */
    window.__lange = [];
    try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lange.push({ t: e.startTime, d: e.duration })))
      .observe({ type: "longtask", buffered: true }); } catch (e) {}
  });
  await pg.goto(url, { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.Rueckfrage && window.LiveChat && window.AusspracheP && typeof Backend !== "undefined"
    && window.LiveChat.pruefEigenerStrom && window.LiveChat.pruefLageSetzen, null, { timeout: 60000 });
  await schlaf(2500);   // Rueckfrage startet nach 1,5 s

  /* Walkie: Betreiber, eine Frage, Funk-Mitschrift; aufklappen */
  await pg.evaluate(() => {
    window.__rf = { funk: [] };
    const fragen = [{ id: 7, thema: "Diktat", frage: "Geht das Diktat im Livestream?", art: "ja_nein", optionen: [], wo: "Walkie" }];
    const kette = (tab) => ({
      select() { return this; }, is() { return this; }, order() { return this; },
      limit() { return Promise.resolve({ data: tab === "betreiber_funk" ? [] : fragen, error: null }); },
      update() { return { eq() { return Promise.resolve({ error: null }); }, in() { return Promise.resolve({ error: null }); } }; },
      insert(werte) { window.__rf.funk.push(werte); return Promise.resolve({ error: null }); }
    });
    Backend.isOwner = () => true;
    Backend.zugang = () => ({ from: (t) => kette(t), rpc: () => Promise.resolve({ data: null }) });
    window.Rueckfrage.holen();
    window.Rueckfrage.aufzu(true);
  });
  await pg.waitForSelector(".rf-vorschlag .rf-mik", { timeout: 8000 });

  /* Live-Ton, die Leitung zu „den anderen“, die nachgebaute Zentrale */
  await pg.evaluate(async () => {
    const ac = new window.__OAC({ sampleRate: 48000 });
    try { await ac.resume(); } catch (e) {}
    const summe = ac.createGain();
    [[1000, 0.2], [5500, 0.1], [11000, 0.1]].forEach(([f, a]) => {
      const o = ac.createOscillator(); o.frequency.value = f;
      const g = ac.createGain(); g.gain.value = a; o.connect(g); g.connect(summe); o.start();
    });
    const silbe = ac.createGain(); silbe.gain.value = 0.6;
    const lfo = ac.createOscillator(); lfo.frequency.value = 4;
    const lfoG = ac.createGain(); lfoG.gain.value = 0.4; lfo.connect(lfoG); lfoG.connect(silbe.gain); lfo.start();
    summe.connect(silbe);
    const huelle = ac.createGain(); huelle.gain.value = 0;
    silbe.connect(huelle);
    window.__ton = { ac, huelle, saetze: [] };
    /* plan: [[ab s, dauer s], …] ab jetzt */
    window.__sprich = (plan) => {
      const t0 = ac.currentTime + 0.05, p0 = performance.now() + 50;
      huelle.gain.cancelScheduledValues(0); huelle.gain.setValueAtTime(0, t0);
      window.__ton.saetze = plan.map(([ab, dauer]) => {
        huelle.gain.setValueAtTime(0, t0 + ab); huelle.gain.linearRampToValueAtTime(1, t0 + ab + 0.01);
        huelle.gain.setValueAtTime(1, t0 + ab + dauer - 0.01); huelle.gain.linearRampToValueAtTime(0, t0 + ab + dauer);
        return [p0 + ab * 1000, p0 + (ab + dauer) * 1000];
      });
      return window.__ton.saetze;
    };
    /* Leitung A → B (wie zu einem anderen im Raum) */
    const a = new RTCPeerConnection(), b = new RTCPeerConnection();
    a.onicecandidate = (e) => { if (e.candidate) b.addIceCandidate(e.candidate); };
    b.onicecandidate = (e) => { if (e.candidate) a.addIceCandidate(e.candidate); };
    b.ontrack = (e) => {
      const el = new Audio(); el.srcObject = e.streams[0] || new MediaStream([e.track]); el.volume = 1;
      el.play().catch(() => {}); window.__bEl = el;
    };
    const ziel = ac.createMediaStreamDestination(); huelle.connect(ziel);
    const spur = ziel.stream.getAudioTracks()[0];
    window.__sender = a.addTrack(spur, ziel.stream);
    const angebot = await a.createOffer(); await a.setLocalDescription(angebot); await b.setRemoteDescription(angebot);
    const antwort = await b.createAnswer(); await b.setLocalDescription(antwort); await a.setRemoteDescription(antwort);
    window.__leitung = { a, b };
    window.__bMess = [];
    setInterval(async () => {
      try {
        const st = await b.getStats(); let e = null;
        st.forEach((r) => { if (r.type === "inbound-rtp" && r.kind === "audio") e = r.totalAudioEnergy || 0; });
        window.__bMess.push([performance.now(), e]);
        if (window.__bMess.length > 3000) window.__bMess.shift();
      } catch (x) {}
    }, 100);
    /* eine frische Live-Spur je Fall (der alte Weg stoppt sie) */
    window.__neueSpur = () => {
      const z = ac.createMediaStreamDestination(); huelle.connect(z);
      const t = z.stream.getAudioTracks()[0];
      window.__live = t;
      window.LiveChat.pruefEigenerStrom(new MediaStream([t]), true);
      window.LiveChat.pruefLageSetzen("drin");
      window.__sender.replaceTrack(t);
      return t.id;
    };
    /* Ausgehendes abfangen (kein „stumm“) */
    window.__raus = [];
    window.LiveChat.pruefAbfangen((p) => { try { window.__raus.push({ art: p.art, tonAn: p.tonAn }); } catch (e) {} });
    /* Spion: jede Kopie der Live-Spur merken (Fall C: ist sie danach beendet?) */
    window.__klone = [];
    if (window.LiveChat.tonSpurKlon) {
      const oK = window.LiveChat.tonSpurKlon;
      window.LiveChat.tonSpurKlon = function () { const k = oK.apply(this, arguments); if (k) window.__klone.push(k); return k; };
    }
    /* die Zentrale */
    window.__anfr = [];
    window.__antworter = null;
    window.__wavZeit = [];
    window.AusspracheP.zentralMoeglich = () => true;
    if (window.AusspracheP.alsWav) {
      const oW = window.AusspracheP.alsWav;
      window.AusspracheP.alsWav = function (p) { const t = performance.now(); const r = oW(p); window.__wavZeit.push([p.sampleRate, p.length, performance.now() - t]); return r; };
    }
    window.AusspracheP.zentralErkennen = (wav, o) => wav.arrayBuffer().then((buf) => {
      const k = window.__anfr.length;
      const dauerS = (buf.byteLength - 44) / 2 / 16000;
      const e = { t: performance.now(), dauerS, o, b64: null, buf };
      window.__anfr.push(e);
      const std = { ms: 300, antw: { RecognitionStatus: "Success", DisplayText: "Satz " + (k + 1) + ".", Offset: 0, Duration: Math.round(dauerS * 1e7) } };
      const r = window.__antworter ? window.__antworter(k, e, std) : std;
      return new Promise((fertig) => setTimeout(() => fertig(r.antw), r.ms));
    });
    window.__wavB64 = (k) => {
      const b = new Uint8Array(window.__anfr[k].buf); let s = "";
      for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
      return btoa(s);
    };
  });
  await pg.waitForFunction(() => window.__bMess.some((m) => m[1] !== null), null, { timeout: 8000 }).catch(() => {});
  const strom = await pg.evaluate(() => window.Rueckfrage.diktatStrom ? Object.assign({}, window.Rueckfrage.diktatStrom) : null);

  const feld = () => pg.evaluate(() => document.querySelector(".rf-vorschlag-text").value);
  const stand = () => pg.evaluate(() => ({
    knopf: document.querySelector(".rf-vorschlag .rf-mik").textContent,
    live: (document.querySelector(".rf-vorschlag .rf-live") || {}).textContent || "",
    feld: document.querySelector(".rf-vorschlag-text").value,
    anfr: window.__anfr.length, runden: window.__rfRunden }));
  const tipp = () => pg.locator(".rf-vorschlag .rf-mik").click();
  /* Ein Fall: frische Spur, Feld leer, Zentrale zurücksetzen, Zahlen merken */
  async function vorbereiten(einst) {
    await pg.evaluate((einst) => {
      window.__neueSpur();
      const t = document.querySelector(".rf-vorschlag-text"); t.value = ""; t.dispatchEvent(new Event("input"));
      window.__anfr = []; window.__antworter = null; window.__wavZeit = []; window.__raus = []; window.__rfRunden = 0; window.__klone = [];
      window.__ctxVorher = window.__ctxe.length;
      if (window.Rueckfrage.diktatStrom && einst) Object.assign(window.Rueckfrage.diktatStrom, einst);
    }, einst || null);
    await schlaf(150);
  }
  async function zuruecksetzen() {
    if (strom) await pg.evaluate((s) => Object.assign(window.Rueckfrage.diktatStrom, s), strom);
  }
  /* nach dem Ende wartet die Sonde, bis der Knopf wieder 🎤 ist */
  async function bisEnde(ms) {
    return pg.waitForFunction(() => document.querySelector(".rf-vorschlag .rf-mik").textContent === "🎤", null, { timeout: ms || 8000 })
      .then(() => true, () => false);
  }
  async function stoppen() { const s = await stand(); if (s.knopf !== "🎤") { await tipp(); if (!(await bisEnde(4000))) { await tipp(); await bisEnde(2000); } } }
  /* Hören die anderen in den Sätzen etwas? (B: totalAudioEnergy steigt) */
  async function hoerbar() {
    return pg.evaluate(() => {
      const m = window.__bMess, saetze = window.__ton.saetze, je = [];
      let luecke = 0;
      saetze.forEach(([s, e]) => {
        const drin = m.filter((x) => x[0] >= s + 300 && x[0] <= e - 100 && x[1] !== null);
        if (drin.length < 3) { je.push(0); return; }
        je.push(drin[drin.length - 1][1] - drin[0][1]);
        let lauf = 0;
        for (let i = 1; i < drin.length; i++) {
          if (drin[i][1] > drin[i - 1][1]) lauf = 0; else { lauf += drin[i][0] - drin[i - 1][0]; luecke = Math.max(luecke, lauf); }
        }
      });
      return { je, luecke: Math.round(luecke) };
    });
  }

  /* ---------- Fall A: drei Sätze, Pausen 2,2 s, 16-kHz-Kontext ---------- */
  console.log("\nA  drei Sätze (2,5 s, Pause 2,2 s), Antwortzeiten 1,5 / 0,2 / 0,7 s");
  await vorbereiten({ rate16k: true });
  await pg.evaluate(() => { window.__antworter = (k, e, std) => ({ ms: [1500, 200, 700][k] || 300, antw: std.antw }); });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 2.5], [5.2, 2.5], [9.9, 2.5]]));
  await schlaf(1500);
  const a1 = await pg.evaluate(() => {
    const t = window.__live, l = window.LiveChat.lage();
    return { runden: window.__rfRunden, geliehen: window.LiveChat.mikrofonGeliehen(), tonAn: l.tonAn,
      spur: t.readyState, an: t.enabled, stumm: window.__raus.filter((p) => p.art === "stumm").length,
      live: (document.querySelector(".rf-vorschlag .rf-live") || {}).textContent || "",
      ctx: window.__ctxe.slice(window.__ctxVorher).map((c) => c.sampleRate + "/" + c.state).join(",") };
  });
  sage(a1.runden === 0, "1  Im Livestream startet KEINE Browser-Erkennung", a1.runden + " Starts");
  sage(a1.geliehen === false && a1.tonAn === true, "1  Nichts ausgeliehen, tonAn bleibt an", "geliehen=" + a1.geliehen + ", tonAn=" + a1.tonAn);
  sage(a1.spur === "live" && a1.an === true, "1  Die Original-Spur lebt und ist an", a1.spur + "/" + a1.an);
  sage(a1.stumm === 0, "1  Kein „stumm“ an die anderen", a1.stumm + " Pakete");
  sage(/höre zu/.test(a1.live), "1  „Ich höre zu …“ steht da", a1.live + " · Kontext " + a1.ctx);
  await pg.waitForFunction(() => window.__anfr.length >= 3 && /Satz 3/.test(document.querySelector(".rf-vorschlag-text").value), null, { timeout: 16000 }).catch(() => {});
  await schlaf(400);
  const aH = await hoerbar();
  sage(aH.je.length === 3 && aH.je.every((x) => x > 0) && aH.luecke <= 1000,
    "2  HÖRBAR: bei B kommt in jedem Satz Ton an, keine Lücke > 1 s", "Energie je Satz " + aH.je.map((x) => x.toExponential(2)).join(" / ") + ", längste Lücke " + aH.luecke + " ms");
  const aS = await stand();
  sage(aS.anfr === 3, "3  Drei Sätze = drei Anfragen (geschnitten an den Pausen)", aS.anfr + " Anfragen");
  const aW = [];
  for (let k = 0; k < aS.anfr; k++) aW.push(wavLesen(await pg.evaluate((k) => window.__wavB64(k), k)));
  const kopfOk = aW.length && aW.every((w) => w.kopf.riff === "RIFF" && w.kopf.wave === "WAVE" && w.kopf.pcm === 1 && w.kopf.kanaele === 1 && w.kopf.rate === 16000 && w.kopf.bits === 16 && w.kopf.data === "data");
  sage(kopfOk && aW.every((w) => w.dauer <= 55), "3  Jede WAV: RIFF, 16 kHz, mono, 16 Bit, ≤ 55 s", aW.map((w) => w.dauer.toFixed(2) + " s").join(", "));
  const vorn = aW.map((w) => anfang(w.x) / 16000);
  sage(vorn.length && vorn.every((v) => v >= 0 && v <= 0.45), "3  Höchstens ~0,4 s Stille vorn", vorn.map((v) => v.toFixed(2) + " s").join(", "));
  const aSp = aW.length ? spektrum(aW[0]) : null;
  sage(aSp && aSp.falten < 0.01 && aSp.tief >= 0.95 && aSp.hoch >= 0.95,
    "4  16-kHz-Kontext: kein Falten (5-kHz-Rest < 1 %), 1 kHz und 5,5 kHz ≥ 95 %",
    aSp ? "5 kHz/1 kHz " + aSp.falten.toFixed(5) + ", 1 kHz " + (aSp.tief * 100).toFixed(1) + " %, 5,5 kHz " + (aSp.hoch * 100).toFixed(1) + " %" : "keine WAV");
  sage(aS.feld === "Satz 1. Satz 2. Satz 3.", "5  Feld in der richtigen Reihenfolge (Antwortzeiten verschieden)", JSON.stringify(aS.feld));
  sage(aS.knopf === "⏹", "   Das Diktat läuft weiter (Knopf ⏹)", aS.knopf);
  await stoppen();
  const aE = await stand();
  sage(aE.knopf === "🎤" && /Steht im Feld/.test(aE.live), "   ⏹ ohne offenes Stück: sofort „✓ Steht im Feld …“", aE.live);

  /* ---------- Fall B: Gerätefrequenz, Pausen 1,2 s ---------- */
  console.log("\nB  Gerätefrequenz (rate16k = false), drei Sätze mit 1,0 s Pause");
  await vorbereiten({ rate16k: false });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 2.5], [4.0, 2.5], [7.5, 2.5]]));
  await pg.waitForFunction(() => window.__anfr.length >= 2 && /Satz 2/.test(document.querySelector(".rf-vorschlag-text").value), null, { timeout: 16000 }).catch(() => {});
  await schlaf(300);
  const bS = await stand();
  const bRate = await pg.evaluate(() => window.__ctxe.slice(window.__ctxVorher).map((c) => c.sampleRate).join(","));
  const bW = [];
  for (let k = 0; k < bS.anfr; k++) bW.push(wavLesen(await pg.evaluate((k) => window.__wavB64(k), k)));
  sage(bS.anfr === 2 && bW.length === 2 && bW[0].dauer > 6 && bW[1].dauer < 4,
    "3  Mit 1,0 s Pause: Satz 1+2 in einem Stück (unter 4 s wird an keiner Pause geschnitten), Satz 3 allein",
    bS.anfr + " Anfragen: " + bW.map((w) => w.dauer.toFixed(2) + " s").join(", ") + " · Kontext " + bRate + " Hz");
  const bSp = bW.length ? spektrum(bW[0]) : null;
  sage(bSp && bW.every((w) => w.kopf.rate === 16000) && bSp.falten < 0.01 && bSp.tief >= 0.95 && bSp.hoch >= 0.95,
    "4  Gerätefrequenz + alsWav (Tiefpass 882): kein Falten, 1 kHz und 5,5 kHz ≥ 95 %",
    bSp ? "5 kHz/1 kHz " + bSp.falten.toFixed(5) + ", 1 kHz " + (bSp.tief * 100).toFixed(1) + " %, 5,5 kHz " + (bSp.hoch * 100).toFixed(1) + " %" : "keine WAV");
  const bT = await pg.evaluate(() => window.__anfr.map((a) => ((a.t - window.__ton.saetze[0][0]) / 1000).toFixed(2)).join(", "));
  console.log("       Anfragen bei " + bT + " s nach Satz 1 · Stille vorn " + bW.map((w) => (anfang(w.x) / 16000).toFixed(2)).join(", ") + " s");
  const bZeit = await pg.evaluate(() => window.__wavZeit.map((z) => z[0] + " Hz " + (z[1] / z[0]).toFixed(1) + " s → " + z[2].toFixed(1) + " ms").join("; "));
  console.log("       alsWav: " + (bZeit || "–"));
  await stoppen();
  await zuruecksetzen();

  /* ---------- Fall C: ⏹ mitten im 3. Satz ---------- */
  console.log("\nC  ⏹ mitten im 3. Satz");
  await vorbereiten();
  await tipp();
  const klonVorher = await pg.evaluate(() => window.__live.id);
  await pg.evaluate(() => window.__sprich([[0.5, 2.5], [5.2, 2.5], [9.9, 2.5]]));
  await schlaf(9900 + 50 + 1200);
  await pg.waitForFunction(() => window.__anfr.length >= 2, null, { timeout: 3000 }).catch(() => {});
  await tipp();
  await schlaf(60);
  const cMitte = await stand();
  sage(/Einen Moment/.test(cMitte.live) && cMitte.knopf === "⏹", "6  Nach ⏹: „Einen Moment – ich schreibe noch auf …“", cMitte.live);
  await bisEnde(5000);
  await schlaf(100);
  const cE = await pg.evaluate(() => ({
    ctx: window.__ctxe.slice(window.__ctxVorher).map((c) => c.state),
    live: window.__live.readyState + "/" + window.__live.enabled,
    lc: window.LiveChat.mikrofonGeliehen() + "/" + window.LiveChat.lage().tonAn }));
  const cS = await stand();
  sage(cS.anfr === 3 && cS.feld === "Satz 1. Satz 2. Satz 3.", "6  Der Rest des 3. Satzes geht noch hinaus und erscheint", cS.anfr + " Anfragen, " + JSON.stringify(cS.feld));
  sage(cS.knopf === "🎤" && /✓ Steht im Feld/.test(cS.live), "6  Danach „✓ Steht im Feld …“, Knopf wieder 🎤", cS.live);
  sage(cE.ctx.length >= 1 && cE.ctx.every((s) => s === "closed"), "6  Der Kontext des Diktats ist geschlossen", cE.ctx.join(","));
  sage(cE.live === "live/true" && cE.lc === "false/true", "6  Die Original-Spur lebt weiter, nichts ausgeliehen", cE.live + " · geliehen/tonAn " + cE.lc + " · " + klonVorher.slice(0, 8));
  /* Klon beendet? Der Klon ist eine eigene Spur – über die Liste der Live-Spuren nicht zu sehen; nachgemessen über
     einen Tonspur-Spion: jede von tonSpurKlon gelieferte Spur wird gemerkt. */
  const cK = await pg.evaluate(() => (window.__klone || []).map((k) => k.readyState).join(","));
  if (cK) sage(cK.split(",").every((s) => s === "ended"), "6  Der Klon ist beendet", cK);

  /* ---------- Fall D: harter Schnitt ---------- */
  console.log("\nD  harter Schnitt: stueckMaxMs = 3000, 7 s Dauerrede");
  sage(strom && strom.stueckMaxMs <= 55000 && strom.stueckMaxMs === 55000, "7  Im Original: stueckMaxMs ≤ 55000", strom ? String(strom.stueckMaxMs) : "kein diktatStrom");
  await vorbereiten({ stueckMaxMs: 3000 });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 7]]));
  await schlaf(500 + 7000 + 2600);
  await pg.waitForFunction(() => !document.querySelector(".rf-vorschlag-text").value.endsWith("…") && window.__anfr.length >= 3, null, { timeout: 4000 }).catch(() => {});
  await schlaf(500);
  const dS = await stand();
  const dW = [];
  for (let k = 0; k < dS.anfr; k++) dW.push(wavLesen(await pg.evaluate((k) => window.__wavB64(k), k)));
  sage(dS.anfr >= 3 && dW.every((w) => w.dauer <= 3.0), "7  ≥ 3 Stücke, jedes ≤ 3 s", dS.anfr + " Stücke: " + dW.map((w) => w.dauer.toFixed(2)).join(" / ") + " s");
  await stoppen();
  await zuruecksetzen();

  /* ---------- Fall E: Nachschub ---------- */
  console.log("\nE  Nachschub: die Antwort deckt nur die erste Hälfte ab");
  await vorbereiten();
  await pg.evaluate(() => {
    window.__antworter = (k, e, std) => k === 0
      ? { ms: 300, antw: { RecognitionStatus: "Success", DisplayText: "Teil A.", Offset: 0, Duration: Math.round(e.dauerS / 2 * 1e7) } }
      : { ms: 300, antw: { RecognitionStatus: "Success", DisplayText: "Teil B.", Offset: 0, Duration: Math.round(e.dauerS * 1e7) } };
  });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 4]]));
  await pg.waitForFunction(() => window.__anfr.length >= 2 && /Teil B/.test(document.querySelector(".rf-vorschlag-text").value), null, { timeout: 12000 }).catch(() => {});
  await schlaf(300);
  const eS = await stand();
  const eD = await pg.evaluate(() => window.__anfr.map((a) => a.dauerS.toFixed(2)).join(" → "));
  const eDz = await pg.evaluate(() => window.__anfr.map((a) => a.dauerS));
  sage(eS.anfr === 2 && eDz[1] < eDz[0] && eS.feld === "Teil A. Teil B.", "8  Zweite Anfrage mit dem Rest, beide Texte im Feld", eS.anfr + " Anfragen (" + eD + " s), " + JSON.stringify(eS.feld));
  await stoppen();

  /* ---------- Fall F: Tagesgrenze ---------- */
  console.log("\nF  Fehler „tagesgrenze“ beim zweiten Stück");
  await vorbereiten();
  await pg.evaluate(() => {
    window.__antworter = (k, e, std) => k === 0 ? std : { ms: 200, antw: { fehler: "tagesgrenze", grenze: 300 } };
  });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 2.5], [5.2, 2.5]]));
  await bisEnde(14000);
  await schlaf(200);
  const fS = await stand();
  const fF = await pg.evaluate(() => window.__rf.funk.map((f) => f.text).filter((t) => /strom-tagesgrenze/.test(t)));
  sage(fS.knopf === "🎤" && /aufgebraucht/.test(fS.live), "9  Endet sichtbar mit Grund", fS.live);
  sage(fS.feld === "Satz 1.", "9  Der Text bis dahin bleibt", JSON.stringify(fS.feld));
  sage(fF.length === 1 && /^\[automatisch\] Diktat-Fehler: strom-tagesgrenze \(nr=1/.test(fF[0]), "9  Meldung im Funk", (fF[0] || "keine").slice(0, 110));

  /* ---------- Fall G: stumm geschaltet ---------- */
  console.log("\nG  stumm geschaltet (tonUmschalten), dann diktieren");
  await vorbereiten();
  await pg.evaluate(() => window.LiveChat.tonUmschalten());
  const gV = await pg.evaluate(() => window.__live.enabled + "/" + window.LiveChat.lage().tonAn);
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 2.5]]));
  await pg.waitForFunction(() => /Satz 1/.test(document.querySelector(".rf-vorschlag-text").value), null, { timeout: 9000 }).catch(() => {});
  const gH = await hoerbar();
  const gS = await stand();
  sage(gV === "false/false" && gS.feld === "Satz 1.", "12 Stumm: das Diktat hört trotzdem (Klon an)", "Original an/tonAn " + gV + ", Feld " + JSON.stringify(gS.feld));
  sage(gH.je.length === 1 && gH.je[0] < 1e-6, "12 ... und die anderen hören weiter nichts", "Energie bei B im Satz " + (gH.je[0] !== undefined ? gH.je[0].toExponential(2) : "?"));
  await stoppen();
  await pg.evaluate(() => window.LiveChat.tonUmschalten());

  /* ---------- Fall H: 30 s Leistung ---------- */
  console.log("\nH  Leistung: 30-s-Diktat (16-kHz-Kontext)");
  await vorbereiten();
  const hT0 = await pg.evaluate(() => performance.now());
  await tipp();
  const plan = []; for (let t = 0.5; t + 2.5 < 30; t += 3.7) plan.push([t, 2.5]);
  await pg.evaluate((p) => window.__sprich(p), plan);
  await schlaf(31500);
  await stoppen();
  const hT1 = await pg.evaluate(() => performance.now());
  const hL = await pg.evaluate(([a, b]) => window.__lange.filter((l) => l.t >= a && l.t <= b).map((l) => Math.round(l.d)), [hT0, hT1]);
  const hZ = await pg.evaluate(() => window.__wavZeit.map((z) => z[2]));
  const hS = await stand();
  sage(hL.every((d) => d <= 100), "13 Keine lange Aufgabe > 100 ms während des Diktats", (hL.length ? hL.join(", ") + " ms" : "keine langen Aufgaben") + " · " + hS.anfr + " Stücke");
  console.log("       alsWav je Stück (16 kHz): " + (hZ.length ? hZ.map((z) => z.toFixed(1)).join(" / ") + " ms" : "–"));

  /* ---------- Fall J: außerhalb des Livestreams ---------- */
  console.log("\nJ  außerhalb des Livestreams");
  await vorbereiten();
  await pg.evaluate(() => window.LiveChat.pruefLageSetzen("aus"));
  await tipp();
  await schlaf(500);
  const jS = await stand();
  sage(jS.runden >= 1 && jS.anfr === 0 && /alter weg/i.test(jS.feld), "11 Wie bisher: Browser-Erkennung, keine Anfrage an die Zentrale", jS.runden + " Starts, " + jS.anfr + " Anfragen, " + JSON.stringify(jS.feld));
  await stoppen();

  /* ---------- Fall I: kein Block in 3 s → alter Weg ---------- */
  console.log("\nI  das Worklet hängt (kein Block in 3 s)");
  await vorbereiten();
  await pg.evaluate(() => { window.__wHaengt = true; });
  await tipp();
  await schlaf(3700);
  const iS = await stand();
  const iF = await pg.evaluate(() => window.__rf.funk.map((f) => f.text).filter((t) => /strom-kein-start/.test(t)));
  sage(iS.runden === 1, "10 Rückfall auf den alten Weg (Browser-Erkennung startet)", iS.runden + " Starts, Feld " + JSON.stringify(iS.feld));
  sage(iF.length === 1, "10 Meldung strom-kein-start im Funk", (iF[0] || "keine").slice(0, 110));
  await pg.evaluate(() => { window.__wHaengt = false; });
  await stoppen();
  await schlaf(500);

  sage(seitenfehler.length === 0, "14 Keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  await ctx.close();
}
