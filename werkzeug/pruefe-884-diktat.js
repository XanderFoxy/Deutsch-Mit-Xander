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
     - Spracherkennung des Browsers (zählt Starts: __rfRunden, liefert
       „alter weg“),
     - Backend (Betreiber, Funk-Mitschrift),
     - die ZENTRALE im Netz: die Seite ruft die echte Kette
       (AusspracheP.zentralErkennen → alsBase64 → zentralRufen →
       JSON → fetch); abgefangen wird erst der Aufruf von
       …/functions/v1/aussprache – hier in Node: WAV lesen, nach einer
       einstellbaren Zeit wie Azure antworten (Success/„Satz k.“, je Fall
       abgewandelt, auch 429 „kontingent“ und „tagesgrenze“). Dafür ein
       Ersatz für window.supabase, der nur die Anmeldemarke liefert.
     - die Live-Spur: eine WebAudio-Quelle mit 48 kHz spricht „Sätze“
       (1 kHz + 5,5 kHz + 11 kHz, Silbentakt 4 Hz) über ein leises
       Grundrauschen (wie ein echtes Mikrofon) – über
       MediaStreamDestination in LiveChat.pruefEigenerStrom / „drin“,
     - „die anderen“: dieselbe Spur geht über eine lokale Leitung A→B;
       gemessen wird totalAudioEnergy von inbound-rtp bei B alle 100 ms.
   Geprüft (Diktat über den echten 🎤 im Feld .rf-vorschlag):
     1  im Livestream startet KEINE Browser-Erkennung, nichts ausgeliehen,
        tonAn bleibt, Original-Spur lebt und ist an, kein „stumm“ hinaus
     2  HÖRBAR: bei B kommt in jedem Satz Ton an, keine Lücke > 1 s
     3  drei Sätze (Pausen 2,2 s) = drei Anfragen; WAV RIFF/16 kHz/mono/
        16 Bit, ≤ 55 s, ≤ 0,45 s Stille vorn; Aufruf „erkennen“, de-DE,
        mit Anmeldemarke; mit 1,0-s-Pausen werden die ersten beiden
        zusammengefasst (Stück < 4 s)
     4  kein Falten: 5-kHz-Rest < 1 % von 1 kHz; 1 kHz und 5,5 kHz ≥ 95 %
        – mit 16-kHz-Kontext und mit Gerätefrequenz (rate16k = false)
     5  Feld „Satz 1. Satz 2. Satz 3.“ in Reihenfolge (Antwortzeiten 1,5 /
        0,2 / 0,7 s)
     6  ⏹ mitten im 3. Satz: der Rest geht noch hinaus, „Einen Moment …“,
        dann „✓ Steht im Feld …“, Knopf 🎤, Kontext zu, Klon beendet,
        Original lebt
     7  harter Schnitt: stueckMaxMs = 3000, 7 s Dauerrede → ≥ 3 Stücke,
        jedes ≤ 3 s; im Original stueckMaxMs = 55000
     8  Nachschub: deckt die Antwort nur die erste Hälfte ab, folgt eine
        zweite, kürzere Anfrage, beide Texte stehen im Feld
     8b NACHBESSERUNG: Nachschub ohne Fortschritt (Antwort deckt 0,1 s) –
        genau EINE Anfrage, „Ja.“ einmal
     8c NACHBESSERUNG: Azures Ende 0,1 s vor dem hörbaren Ende (Nachhall)
        – drei Sätze bleiben drei Anfragen
     8d NACHBESSERUNG: Grenze von 4 Nachschüben erreicht, es bleibt
        Sprache – Meldung „strom-nachschub-grenze“
     8e 884b: Nachschub in Teilen – 6 Sätze mit 0,6-s-Pausen in EINEM
        Stück, Azure hört an jeder Pause auf: alle 6 Sätze, 6 Anfragen,
        gesendeter Ton ≤ 2,1× das Stück (vorher 5 Anfragen, der 6. Satz
        fehlte, ~3,3× Ton)
     9  „tagesgrenze“ – der Text bis dahin bleibt, 884b: Ende mit Grund
        („Für heute …“), KEIN alter Weg, nichts ausgeliehen; Meldung mit
        „verworfen=“ ≥ 1; der nächste 🎤 (mit FRISCHER Live-Spur, sonst
        bewiese es nichts) sagt gleich den Grund, kein Kontext, 0 Anfragen
     9b einmal 429 „kontingent“ – nach 2,5 s noch einmal, nichts geht
        verloren, das Diktat läuft weiter, keine Meldung
     9c dauernd „kontingent“ – nach 3 Versuchen Ende mit Grund (884b),
        Meldung mit versuche=3 und verworfen=1
     9d Tagesmenge (hier 4 s) – das Gesprochene wird noch aufgeschrieben,
        dann Ende mit Grund (884b); der nächste 🎤 (frische Spur) ebenso
     9e 884b: Tagesmenge erreicht, eine Antwort ist noch unterwegs, Xander
        tippt EINMAL ⏹ – sie wird noch geschrieben (vorher verworfen)
     10 884b: das Worklet-Modul hängt – nach 1,5 s übernimmt der
        ScriptProcessor, der Satz wird erkannt, kein alter Weg; hängt
        auch der: nach 3 s Ende mit Grund, Meldung strom-kein-start,
        nichts ausgeliehen
     10b die Kopie liefert nur Nullen – 884b: Ende mit Grund, kein alter
        Weg, Meldung strom-nullen; zu leise (keine 0,012) – 884b: nach
        6 s nur EINE Meldung strom-still (max rms) und weiterhören, nach
        stillEndeMs (hier 9,5 s, im Original 30 s) „Ich habe nichts
        gehört …“; nie ausgeliehen, nie „stumm“
     10c ⏹ ohne Gesprochenes – „Ich habe nichts gehört …“
     10d 884b (Prüfung, wichtig): 7 s still (zuhören, überlegen), dann ein
        Satz – aus der Live-Spur erkannt, die anderen hören ihn, kein
        alter Weg
     15 884b: Gateway-Antwort ohne RecognitionStatus (546 WORKER_LIMIT) –
        Fehler, einmal wiederholt, Meldung mit Grund, Diktat läuft weiter
     16 884b: Raumkanal 2 s weg (lage „fehler“) – das Diktat läuft weiter;
        bleibt er weg (raumWegMs, hier 1,5 s), endet es
     11 außerhalb des Livestreams: wie bisher, Browser-Erkennung, keine
        Anfrage an die Zentrale
     12 stumm geschaltet (tonUmschalten): das Diktat hört trotzdem, B hört
        weiter nichts
     12b NACHBESSERUNG: Walkie zugeklappt (✕) – das Diktat endet, keine
        Anfrage mehr für das danach Gesprochene, Klon und Kontext zu, nach
        dem Aufklappen steht der Text im Feld, Knopf 🎤
     12c NACHBESSERUNG: Raum verlassen – ebenso
     13 Leistung: 30-s-Diktat über die echte Kette, keine lange Aufgabe
        > 100 ms; alsWav-Zeit je Stück; im Quellen-Lauf zusätzlich EIN
        Stück von ~50 s: Zeit von zentralErkennen bis fetch (Base64 +
        JSON auf dem Hauptfaden) und lange Aufgaben dabei
     14 keine Seitenfehler
   GEGENPROBE: ALT=1 – der kleine Server liefert rueckfrage.js,
   livechat.js und aussprache-pruefung.js aus „git show a043c20:<datei>“
   (der Stand direkt vor diesem Punkt), nur der Quellen-Lauf. Enthält die
   Revision den Bau schon, bricht die Sonde ab. Erwartet rot: 1, 2, 3–9d,
   12b/c (keine Anfrage).
   ALT=vorbau – dieselben Dateien aus 7cbc825 (der erste Bau, VOR der
   Nachbesserung). Erwartet rot genau dort, wo nachgebessert wurde: 8b, 8c,
   8d, 9–9d, 10b, 10c, 12b, 12c.
   GEGENPROBE 884b (der Stand vor der zweiten Nachbesserung, f6f8968 =
   0df7804 für rueckfrage.js): ein Baum aus Verweisen auf diesen, nur
   rueckfrage.js aus „git show f6f8968:rueckfrage.js“, dann
   WURZEL=<Baum> NUR=quelle. Erwartet rot: 8e, 9–9e, 10, 10b, 10d, 15, 16
   (alter Weg = Browser-Erkennung + ausgeliehen + „stumm“) – gemessen 31 rot,
   alles andere grün.
   EHRLICH: echtes Azure, Samsung Internet und ein Gespräch über zwei
   Geräte sind hier nicht nachstellbar; die lokale Leitung zeigt nur, dass
   die unveränderte Spur weiter Ton liefert.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const VOR_884_DIKTAT = "a043c20";   // der Stand direkt vor „WIP 884 diktat"
const VORBAU = "7cbc825";           // der erste Bau, vor der Nachbesserung
const ALT = process.env.ALT_REV || (process.env.ALT === "1" ? VOR_884_DIKTAT : process.env.ALT === "vorbau" ? VORBAU : (process.env.ALT || ""));
const DATEIEN = ["rueckfrage.js", "livechat.js", "aussprache-pruefung.js"];
const ERSATZ = {};
if (ALT) {
  DATEIEN.forEach((d) => { ERSATZ["/" + d] = execFileSync("git", ["-C", WURZEL, "show", ALT + ":" + d], { maxBuffer: 1 << 28 }).toString("utf8"); });
  const gebaut = /tonSpurKlon/.test(ERSATZ["/livechat.js"]) || /diktatAusStrom/.test(ERSATZ["/rueckfrage.js"]);
  if (gebaut && ALT !== VORBAU && process.env.VORBAU !== "1") {
    console.log("GEGENPROBE UNGÜLTIG: " + ALT + " enthält den Bau schon – sie wäre grün und bewiese nichts. ALT=1 (= " + VOR_884_DIKTAT + ") nehmen, oder ALT=vorbau für den Stand vor der Nachbesserung.");
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
async function warteBis(f, ms) {
  const ende = Date.now() + ms;
  while (Date.now() < ende) { if (await f()) return true; await schlaf(60); }
  return Boolean(await f());
}

/* --- WAV lesen und messen (in Node) --- */
function wavLesen(b64) {
  const b = Buffer.from(b64, "base64");
  const kopf = { riff: b.toString("ascii", 0, 4), wave: b.toString("ascii", 8, 12), pcm: b.readUInt16LE(20),
    kanaele: b.readUInt16LE(22), rate: b.readUInt32LE(24), bits: b.readUInt16LE(34), data: b.toString("ascii", 36, 40) };
  const n = (b.length - 44) >> 1, x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = b.readInt16LE(44 + 2 * i) / 32768;
  return { kopf, x, dauer: n / 16000, bytes: b.length };
}
function goertzel(x, f, rate) {
  const w = 2 * Math.PI * f / rate, c = 2 * Math.cos(w);
  let s1 = 0, s2 = 0;
  for (let i = 0; i < x.length; i++) { const s0 = x[i] + c * s1 - s2; s2 = s1; s1 = s0; }
  const re = s1 - s2 * Math.cos(w), im = s2 * Math.sin(w);
  return 2 * Math.sqrt(re * re + im * im) / x.length;
}
function anfang(x) { for (let i = 0; i < x.length; i++) if (Math.abs(x[i]) > 0.02) return i; return -1; }
function hoerbarEnde(x) { for (let i = x.length - 1; i >= 0; i--) if (Math.abs(x[i]) > 0.02) return (i + 1) / 16000; return 0; }
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
    await einLauf(br, lauf === "quelle" ? basis + "?quelle" : basis, lauf);
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.log("ABBRUCH: " + (e && e.stack || e)); process.exit(2); });

async function einLauf(br, url, lauf) {
  const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(String(e.message || e)));
  await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  /* Die Zentrale (später angemeldet = hat Vorrang vor dem Abbruch oben) */
  const Z = { anfr: [], antworter: null };
  const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS" };
  await pg.route(/\/functions\/v1\/aussprache/, async (route) => {
    const q = route.request();
    if (q.method() === "OPTIONS") return route.fulfill({ status: 200, headers: CORS, body: "" });
    let k = {};
    try { k = JSON.parse(q.postData() || "{}"); } catch (e) {}
    if (k.aktion !== "erkennen" || !k.wav) {
      return route.fulfill({ status: 400, headers: Object.assign({ "Content-Type": "application/json" }, CORS), body: JSON.stringify({ fehler: "unbekannte-aktion" }) });
    }
    const w = wavLesen(k.wav);
    const nr = Z.anfr.length;
    const e = { t: Date.now(), dauerS: w.dauer, w, aktion: k.aktion, sprache: k.sprache, zeitgrenze: k.zeitgrenze,
      marke: (q.headers()["authorization"] || ""), b64Laenge: k.wav.length };
    Z.anfr.push(e);
    const std = { ms: 300, status: 200, antw: { RecognitionStatus: "Success", DisplayText: "Satz " + (nr + 1) + ".", Offset: 0, Duration: Math.round(w.dauer * 1e7) } };
    const r = Z.antworter ? Z.antworter(nr, e, std) : std;
    await schlaf(r.ms);
    try {
      await route.fulfill({ status: r.status || 200, headers: Object.assign({ "Content-Type": "application/json" }, CORS), body: JSON.stringify(r.antw) });
    } catch (x) {}
  });
  await pg.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); localStorage.removeItem("dma_funk_offen"); } catch (e) {}
    /* FASSUNG 885 (Schritt K): rueckfrage.js lädt nur auf dem Gerät des Betreibers (Merker „dma-walkie“, Sonde 885-schlank) */
    try { localStorage.setItem("dma-walkie", "1"); } catch (e) {}
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
    /* Fall I2 (884b): auch der Ersatz (ScriptProcessor) geht nicht */
    window.__spWirft = false;
    if (window.BaseAudioContext && BaseAudioContext.prototype.createScriptProcessor) {
      const oSP = BaseAudioContext.prototype.createScriptProcessor;
      BaseAudioContext.prototype.createScriptProcessor = function () {
        if (window.__spWirft) throw new Error("Sonde: kein ScriptProcessor");
        return oSP.apply(this, arguments);
      };
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

  /* Live-Ton, die Leitung zu „den anderen“, die Anmeldung für die Zentrale */
  await pg.evaluate(async () => {
    /* supabase-js kommt im Netz von außen und ist hier gesperrt. Für die Zentrale braucht AusspracheP nur die
       Anmeldemarke; alles andere antwortet leer (Ketten, die nie etwas tun). Erst JETZT gesetzt – Backend und
       LiveChat sind längst ohne ihn gestartet. */
    const leer = () => Promise.resolve({ data: null, error: null });
    const kette = () => { const f = function () { return p; }; const p = new Proxy(f, {
      get(t, k) { if (k === "then") return (a, b) => leer().then(a, b); if (k === "catch") return (b) => leer().catch(b);
        if (k === Symbol.toPrimitive) return () => ""; return p; },
      apply() { return p; } }); return p; };
    window.supabase = { createClient: () => new Proxy({}, { get(t, k) {
      if (k === "auth") return { getSession: () => Promise.resolve({ data: { session: { access_token: "sonde-marke" } } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) };
      return kette(); } }) };
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
    /* Grundrauschen wie bei einem echten Mikrofon (rms ≈ 0,0002) – nie exakt null */
    const rb = ac.createBuffer(1, 48000 * 2, 48000), rd = rb.getChannelData(0);
    for (let i = 0; i < rd.length; i++) rd[i] = (Math.random() * 2 - 1) * 3.5e-4;
    const rauschen = ac.createBufferSource(); rauschen.buffer = rb; rauschen.loop = true; rauschen.start();
    const mix = ac.createGain(); huelle.connect(mix); rauschen.connect(mix);
    window.__ton = { ac, huelle, saetze: [], t0: 0 };
    /* jeder Fall beginnt still: was ein voriger Fall noch geplant hatte (ein dritter Satz), fällt weg */
    window.__still = () => { huelle.gain.cancelScheduledValues(0); huelle.gain.setValueAtTime(0, ac.currentTime); window.__ton.saetze = []; };
    /* plan: [[ab s, dauer s], …] ab jetzt */
    window.__sprich = (plan) => {
      const t0 = ac.currentTime + 0.05, p0 = performance.now() + 50;
      window.__ton.t0 = Date.now() + 50;
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
    const ziel = ac.createMediaStreamDestination(); mix.connect(ziel);
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
    /* eine frische Live-Spur je Fall (der alte Weg stoppt sie); art: "normal" | "tot" (nur Nullen) | "leise" */
    window.__neueSpur = (art) => {
      const z = ac.createMediaStreamDestination();
      if (art === "leise") { const g = ac.createGain(); g.gain.value = 0.05; silbe.connect(g); g.connect(z); rauschen.connect(z); }
      else if (art !== "tot") mix.connect(z);
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
    /* Spion: jede Kopie der Live-Spur merken (ist sie danach beendet?) */
    window.__klone = [];
    if (window.LiveChat.tonSpurKlon) {
      const oK = window.LiveChat.tonSpurKlon;
      window.LiveChat.tonSpurKlon = function () { const k = oK.apply(this, arguments); if (k) window.__klone.push(k); return k; };
    }
    /* Zeiten: alsWav je Stück; zentralErkennen → fetch (Base64 + JSON auf dem Hauptfaden) */
    window.__wavZeit = [];
    if (window.AusspracheP.alsWav) {
      const oW = window.AusspracheP.alsWav;
      window.AusspracheP.alsWav = function (p) { const t = performance.now(); const r = oW(p); window.__wavZeit.push([p.sampleRate, p.length, performance.now() - t]); return r; };
    }
    window.__kette = [];
    if (window.AusspracheP.zentralErkennen) {
      const oE = window.AusspracheP.zentralErkennen;
      window.AusspracheP.zentralErkennen = function (wav, o) { window.__kette.push({ ruf: performance.now(), bytes: wav && wav.size }); return oE.apply(this, arguments); };
    }
    const oF = window.fetch;
    window.fetch = function (u, o) {
      if (/functions\/v1\/aussprache/.test(String(u))) { const k = window.__kette[window.__kette.length - 1]; if (k && !k.fetch) { k.fetch = performance.now(); k.body = (o && o.body && o.body.length) || 0; } }
      return oF.apply(this, arguments);
    };
  });
  await pg.waitForFunction(() => window.__bMess.some((m) => m[1] !== null), null, { timeout: 8000 }).catch(() => {});
  const strom = await pg.evaluate(() => window.Rueckfrage.diktatStrom ? Object.assign({}, window.Rueckfrage.diktatStrom) : null);

  const feld = () => pg.evaluate(() => (document.querySelector(".rf-vorschlag-text") || {}).value);
  const stand = async () => Object.assign(await pg.evaluate(() => {
    const k = document.querySelector(".rf-vorschlag .rf-mik");
    return { knopf: k ? k.textContent : "", live: (document.querySelector(".rf-vorschlag .rf-live") || {}).textContent || "",
      feld: (document.querySelector(".rf-vorschlag-text") || {}).value, runden: window.__rfRunden };
  }), { anfr: Z.anfr.length });
  const tipp = () => pg.locator(".rf-vorschlag .rf-mik").click();
  const meldungen = (re) => pg.evaluate((q) => window.__rf.funk.map((f) => f.text).filter((t) => new RegExp(q).test(t)), re);
  /* Ein Fall: frische Spur, Feld leer, Zentrale zurücksetzen, Zahlen merken */
  async function vorbereiten(einst, art) {
    Z.anfr = []; Z.antworter = null;
    await pg.evaluate(([einst, art]) => {
      try { localStorage.removeItem("dma_diktat_strom_tag"); localStorage.removeItem("dma_diktat_strom_sperre"); } catch (e) {}
      window.__still();
      window.__neueSpur(art);
      const t = document.querySelector(".rf-vorschlag-text"); t.value = ""; t.dispatchEvent(new Event("input"));
      window.__wavZeit = []; window.__kette = []; window.__raus = []; window.__rfRunden = 0; window.__klone = [];
      window.__ctxVorher = window.__ctxe.length;
      if (window.Rueckfrage.diktatStrom && einst) Object.assign(window.Rueckfrage.diktatStrom, einst);
    }, [einst || null, art || "normal"]);
    await schlaf(400);
  }
  async function zuruecksetzen() {
    if (strom) await pg.evaluate((s) => Object.assign(window.Rueckfrage.diktatStrom, s), strom);
  }
  /* nach dem Ende wartet die Sonde, bis der Knopf wieder 🎤 ist */
  async function bisEnde(ms) {
    return pg.waitForFunction(() => document.querySelector(".rf-vorschlag .rf-mik").textContent === "🎤", null, { timeout: ms || 8000 })
      .then(() => true, () => false);
  }
  async function stoppen() { const s = await stand(); if (s.knopf && s.knopf !== "🎤") { await tipp(); if (!(await bisEnde(4000))) { await tipp(); await bisEnde(2000); } } }
  /* nach dem alten Weg: das Mikrofon kommt nicht zurück in eine Spur, die der nächste Fall schon ersetzt hat */
  async function altAufraeumen() { await stoppen(); await pg.evaluate(() => window.LiveChat.pruefLageSetzen("aus")); await schlaf(600); }
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
  const DREI = [[0.5, 2.5], [5.2, 2.5], [9.9, 2.5]];
  /* 884b: der Rückfall nimmt das Live-Mikro nie weg – nichts ausgeliehen, Original-Spur lebt und ist an, tonAn, kein „stumm“ */
  const unberuehrt = () => pg.evaluate(() => ({ geliehen: window.LiveChat.mikrofonGeliehen(), spur: window.__live.readyState,
    an: window.__live.enabled, tonAn: window.LiveChat.lage().tonAn, stumm: window.__raus.filter((p) => p.art === "stumm").length }));
  const heil = (u) => u.geliehen === false && u.spur === "live" && u.an === true && u.tonAn === true && u.stumm === 0;
  const heilText = (u) => "geliehen=" + u.geliehen + ", Spur " + u.spur + "/" + u.an + ", tonAn=" + u.tonAn + ", „stumm“=" + u.stumm;

  /* ---------- Fall A: drei Sätze, Pausen 2,2 s, 16-kHz-Kontext ---------- */
  console.log("\nA  drei Sätze (2,5 s, Pause 2,2 s), Antwortzeiten 1,5 / 0,2 / 0,7 s");
  await vorbereiten({ rate16k: true });
  Z.antworter = (k, e, std) => ({ ms: [1500, 200, 700][k] || 300, antw: std.antw });
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
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
  await warteBis(async () => Z.anfr.length >= 3 && /Satz 3/.test(await feld()), 16000);
  await schlaf(400);
  const aH = await hoerbar();
  sage(aH.je.length === 3 && aH.je.every((x) => x > 0) && aH.luecke <= 1000,
    "2  HÖRBAR: bei B kommt in jedem Satz Ton an, keine Lücke > 1 s", "Energie je Satz " + aH.je.map((x) => x.toExponential(2)).join(" / ") + ", längste Lücke " + aH.luecke + " ms");
  const aS = await stand();
  sage(aS.anfr === 3, "3  Drei Sätze = drei Anfragen (geschnitten an den Pausen)", aS.anfr + " Anfragen");
  const aW = Z.anfr.map((e) => e.w);
  const kopfOk = aW.length && aW.every((w) => w.kopf.riff === "RIFF" && w.kopf.wave === "WAVE" && w.kopf.pcm === 1 && w.kopf.kanaele === 1 && w.kopf.rate === 16000 && w.kopf.bits === 16 && w.kopf.data === "data");
  sage(kopfOk && aW.every((w) => w.dauer <= 55), "3  Jede WAV: RIFF, 16 kHz, mono, 16 Bit, ≤ 55 s", aW.map((w) => w.dauer.toFixed(2) + " s").join(", "));
  const vorn = aW.map((w) => anfang(w.x) / 16000);
  sage(vorn.length && vorn.every((v) => v >= 0 && v <= 0.45), "3  Höchstens ~0,4 s Stille vorn", vorn.map((v) => v.toFixed(2) + " s").join(", "));
  const aK = Z.anfr[0] || {};
  sage(Z.anfr.length && Z.anfr.every((e) => e.aktion === "erkennen" && e.sprache === "de-DE" && e.zeitgrenze === 40000 && e.marke === "Bearer sonde-marke"),
    "3  Echte Kette bis ins Netz: „erkennen“, de-DE, Zeitgrenze 40 s, mit Anmeldemarke", aK.aktion + " / " + aK.sprache + " / " + aK.zeitgrenze + " / " + aK.marke);
  const aSp = aW.length ? spektrum(aW[0]) : null;
  sage(aSp && aSp.falten < 0.01 && aSp.tief >= 0.95 && aSp.hoch >= 0.95,
    "4  16-kHz-Kontext: kein Falten (5-kHz-Rest < 1 %), 1 kHz und 5,5 kHz ≥ 95 %",
    aSp ? "5 kHz/1 kHz " + aSp.falten.toFixed(5) + ", 1 kHz " + (aSp.tief * 100).toFixed(1) + " %, 5,5 kHz " + (aSp.hoch * 100).toFixed(1) + " %" : "keine WAV");
  sage(aS.feld === "Satz 1. Satz 2. Satz 3.", "5  Feld in der richtigen Reihenfolge (Antwortzeiten verschieden)", JSON.stringify(aS.feld));
  sage(aS.knopf === "⏹", "   Das Diktat läuft weiter (Knopf ⏹)", aS.knopf);
  const aZ = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("dma_diktat_strom_tag")); } catch (e) { return null; } });
  sage(aZ && Math.abs(aZ.s - aW.reduce((s, w) => s + w.dauer, 0)) < 0.3, "   Die gesendeten Sekunden werden gezählt (Tagesmenge)", JSON.stringify(aZ) + " · gesendet " + aW.reduce((s, w) => s + w.dauer, 0).toFixed(1) + " s");
  await stoppen();
  const aE = await stand();
  sage(aE.knopf === "🎤" && /Steht im Feld/.test(aE.live), "   ⏹ ohne offenes Stück: sofort „✓ Steht im Feld …“", aE.live);

  /* ---------- Fall B: Gerätefrequenz, Pausen 1,0 s ---------- */
  console.log("\nB  Gerätefrequenz (rate16k = false), drei Sätze mit 1,0 s Pause");
  await vorbereiten({ rate16k: false });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 2.5], [4.0, 2.5], [7.5, 2.5]]));
  await warteBis(async () => Z.anfr.length >= 2 && /Satz 2/.test(await feld()), 16000);
  await schlaf(300);
  const bS = await stand();
  const bRate = await pg.evaluate(() => window.__ctxe.slice(window.__ctxVorher).map((c) => c.sampleRate).join(","));
  const bW = Z.anfr.map((e) => e.w);
  sage(bS.anfr === 2 && bW.length === 2 && bW[0].dauer > 6 && bW[1].dauer < 4,
    "3  Mit 1,0 s Pause: Satz 1+2 in einem Stück (unter 4 s wird an keiner Pause geschnitten), Satz 3 allein",
    bS.anfr + " Anfragen: " + bW.map((w) => w.dauer.toFixed(2) + " s").join(", ") + " · Kontext " + bRate + " Hz");
  const bSp = bW.length ? spektrum(bW[0]) : null;
  sage(bSp && bW.every((w) => w.kopf.rate === 16000) && bSp.falten < 0.01 && bSp.tief >= 0.95 && bSp.hoch >= 0.95,
    "4  Gerätefrequenz + alsWav (Tiefpass 882): kein Falten, 1 kHz und 5,5 kHz ≥ 95 %",
    bSp ? "5 kHz/1 kHz " + bSp.falten.toFixed(5) + ", 1 kHz " + (bSp.tief * 100).toFixed(1) + " %, 5,5 kHz " + (bSp.hoch * 100).toFixed(1) + " %" : "keine WAV");
  const bT0 = await pg.evaluate(() => window.__ton.t0);
  console.log("       Anfragen bei " + Z.anfr.map((e) => ((e.t - bT0) / 1000).toFixed(2)).join(", ") + " s nach dem Plan-Start · Stille vorn " + bW.map((w) => (anfang(w.x) / 16000).toFixed(2)).join(", ") + " s");
  const bZeit = await pg.evaluate(() => window.__wavZeit.map((z) => z[0] + " Hz " + (z[1] / z[0]).toFixed(1) + " s → " + z[2].toFixed(1) + " ms").join("; "));
  console.log("       alsWav: " + (bZeit || "–"));
  await stoppen();
  await zuruecksetzen();

  /* ---------- Fall C: ⏹ mitten im 3. Satz ---------- */
  console.log("\nC  ⏹ mitten im 3. Satz");
  await vorbereiten();
  await tipp();
  const klonVorher = await pg.evaluate(() => window.__live.id);
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await schlaf(9900 + 50 + 1200);
  await warteBis(() => Z.anfr.length >= 2, 3000);
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
  const cK = await pg.evaluate(() => (window.__klone || []).map((k) => k.readyState).join(","));
  if (cK) sage(cK.split(",").every((s) => s === "ended"), "6  Der Klon ist beendet", cK);

  /* ---------- Fall D: harter Schnitt ---------- */
  console.log("\nD  harter Schnitt: stueckMaxMs = 3000, 7 s Dauerrede");
  sage(strom && strom.stueckMaxMs === 55000, "7  Im Original: stueckMaxMs = 55000", strom ? String(strom.stueckMaxMs) : "kein diktatStrom");
  await vorbereiten({ stueckMaxMs: 3000 });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 7]]));
  await schlaf(500 + 7000 + 2600);
  await warteBis(() => Z.anfr.length >= 3, 4000);
  await schlaf(500);
  const dS = await stand();
  const dW = Z.anfr.map((e) => e.w);
  sage(dS.anfr >= 3 && dW.every((w) => w.dauer <= 3.0), "7  ≥ 3 Stücke, jedes ≤ 3 s", dS.anfr + " Stücke: " + dW.map((w) => w.dauer.toFixed(2)).join(" / ") + " s");
  await stoppen();
  await zuruecksetzen();

  /* ---------- Fall E: Nachschub ---------- */
  console.log("\nE  Nachschub: die Antwort deckt nur die erste Hälfte ab");
  await vorbereiten();
  Z.antworter = (k, e, std) => k === 0
    ? { ms: 300, antw: { RecognitionStatus: "Success", DisplayText: "Teil A.", Offset: 0, Duration: Math.round(e.dauerS / 2 * 1e7) } }
    : { ms: 300, antw: { RecognitionStatus: "Success", DisplayText: "Teil B.", Offset: 0, Duration: Math.round(e.dauerS * 1e7) } };
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 4]]));
  await warteBis(async () => Z.anfr.length >= 2 && /Teil B/.test(await feld()), 12000);
  await schlaf(300);
  const eS = await stand();
  const eD = Z.anfr.map((a) => a.dauerS);
  sage(eS.anfr === 2 && eD[1] < eD[0] && eS.feld === "Teil A. Teil B.", "8  Zweite Anfrage mit dem Rest, beide Texte im Feld", eS.anfr + " Anfragen (" + eD.map((x) => x.toFixed(2)).join(" → ") + " s), " + JSON.stringify(eS.feld));
  await stoppen();

  /* ---------- Fall E2: Nachschub ohne Fortschritt ---------- */
  console.log("\nE2 Nachschub ohne Fortschritt: die Antwort deckt nur 0,1 s ab");
  await vorbereiten();
  Z.antworter = () => ({ ms: 200, antw: { RecognitionStatus: "Success", DisplayText: "Ja.", Offset: 0, Duration: 1000000 } });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 2.5]]));
  await warteBis(async () => /Ja\./.test(await feld()), 9000);
  await schlaf(2500);
  const e2S = await stand();
  sage(e2S.anfr === 1 && e2S.feld === "Ja.", "8b Genau EINE Anfrage, „Ja.“ steht einmal da (kein Stück mehrfach hinaus)", e2S.anfr + " Anfragen (" + Z.anfr.map((a) => a.dauerS.toFixed(2)).join(" / ") + " s), " + JSON.stringify(e2S.feld));
  await stoppen();

  /* ---------- Fall E3: Azures Ende 0,1 s vor dem hörbaren Ende ---------- */
  console.log("\nE3 Azures Zeitangabe endet 0,1 s vor dem hörbaren Ende (Endkonsonant, Nachhall)");
  await vorbereiten();
  Z.antworter = (k, e, std) => {
    const von = Math.max(0, anfang(e.w.x) / 16000), bis = Math.max(von, hoerbarEnde(e.w.x) - 0.1);
    return { ms: 300, antw: { RecognitionStatus: "Success", DisplayText: "Satz " + (k + 1) + ".", Offset: Math.round(von * 1e7), Duration: Math.round((bis - von) * 1e7) } };
  };
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await warteBis(async () => /Satz 3/.test(await feld()), 16000);
  await schlaf(1500);
  const e3S = await stand();
  sage(e3S.anfr === 3 && e3S.feld === "Satz 1. Satz 2. Satz 3.", "8c Drei Sätze bleiben drei Anfragen (kein Nachschub aus Nachhall)", e3S.anfr + " Anfragen (" + Z.anfr.map((a) => a.dauerS.toFixed(2)).join(" / ") + " s), " + JSON.stringify(e3S.feld));
  await stoppen();

  /* ---------- Fall E4: Grenze von 4 Nachschüben ---------- */
  console.log("\nE4 Nachschub-Grenze: jede Antwort deckt nur 1 s ab, 7 s Rede");
  await vorbereiten();
  Z.antworter = (k) => ({ ms: 150, antw: { RecognitionStatus: "Success", DisplayText: "Teil " + (k + 1) + ".", Offset: 0, Duration: 10000000 } });
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 7]]));
  await warteBis(async () => Z.anfr.length >= 5 && /Teil 5/.test(await feld()), 16000);
  await schlaf(1200);
  const e4S = await stand();
  const e4M = await meldungen("strom-nachschub-grenze");
  sage(e4S.anfr === 5 && e4S.feld === "Teil 1. Teil 2. Teil 3. Teil 4. Teil 5.", "8d Höchstens 4 Nachschübe (5 Anfragen), jeder kürzer", e4S.anfr + " Anfragen (" + Z.anfr.map((a) => a.dauerS.toFixed(2)).join(" → ") + " s), " + JSON.stringify(e4S.feld));
  sage(e4M.length === 1, "8d … und bleibt danach Sprache übrig: Meldung strom-nachschub-grenze", (e4M[0] || "keine").slice(0, 110));
  await stoppen();

  /* ---------- Fall E5 (884b): Nachschub in Teilen ---------- */
  console.log("\nE5 Nachschub in Teilen: 6 Sätze mit 0,6-s-Pausen in EINEM Stück, Azure hört an jeder Pause auf");
  await vorbereiten();
  /* wie Azures Kurz-Audio, wenn es an der ersten Pause aufhört: von der ersten Sprache bis zur ersten Lücke ≥ 0,3 s */
  Z.antworter = (k, e) => {
    const x = e.w.x, r = 16000, f = Math.round(0.05 * r), von = anfang(x);
    if (von < 0) return { ms: 200, antw: { RecognitionStatus: "NoMatch", Offset: 0, Duration: 0 } };
    let bis = x.length, still = 0;
    for (let i = von; i + f <= x.length; i += f) {
      let q = 0; for (let j = i; j < i + f; j++) q += x[j] * x[j];
      if (Math.sqrt(q / f) < 0.01) { still += f; if (still >= 0.3 * r) { bis = i + f - still; break; } } else still = 0;
    }
    return { ms: 200, antw: { RecognitionStatus: "Success", DisplayText: "Teil " + (k + 1) + ".", Offset: Math.round(von / r * 1e7), Duration: Math.round((bis - von) / r * 1e7) } };
  };
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 1.6], [2.7, 1.6], [4.9, 1.6], [7.1, 1.6], [9.3, 1.6], [11.5, 1.6]]));
  await warteBis(async () => /Teil 6/.test(await feld()), 24000);
  await schlaf(1500);
  const e5S = await stand();
  const e5D = Z.anfr.map((a) => a.dauerS), e5Summe = e5D.reduce((x, y) => x + y, 0);
  sage(e5S.anfr === 6 && e5S.feld === "Teil 1. Teil 2. Teil 3. Teil 4. Teil 5. Teil 6.",
    "8e Alle 6 Sätze, je EINE Anfrage (der Rest geht in Teilen nach, nicht ganz bei jedem Nachschub)",
    e5S.anfr + " Anfragen (" + e5D.map((x) => x.toFixed(2)).join(" / ") + " s), " + JSON.stringify(e5S.feld));
  sage(e5D.length && e5Summe <= 2.1 * e5D[0], "8e Gesendeter Ton ≤ 2,1× das Stück (kein Ton mehr als zweimal)",
    e5Summe.toFixed(1) + " s für ein Stück von " + (e5D[0] || 0).toFixed(1) + " s = " + (e5D.length ? (e5Summe / e5D[0]).toFixed(2) : "–") + "×");
  await stoppen();

  /* ---------- Fall M: Walkie zugeklappt ---------- */
  console.log("\nM  Walkie mitten im 2. Satz zugeklappt (✕)");
  await vorbereiten();
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await schlaf(6500);
  await pg.locator(".rf-zu").click();
  await schlaf(13500 - 6500);
  const mE = await pg.evaluate(() => ({
    klon: (window.__klone || []).map((k) => k.readyState).join(","),
    ctx: window.__ctxe.slice(window.__ctxVorher).map((c) => c.state).join(","),
    live: window.__live.readyState }));
  const mN = Z.anfr.length;
  sage(mN === 2, "12b Nach ✕ geht nur noch das schon Gesprochene hinaus (Satz 3 nicht mehr)", mN + " Anfragen");
  sage(/^(ended,?)+$/.test(mE.klon) && /^(closed,?)+$/.test(mE.ctx) && mE.live === "live", "12b Klon beendet, Kontext zu, Original lebt", "Klon " + mE.klon + ", Kontext " + mE.ctx + ", Original " + mE.live);
  await pg.evaluate(() => window.Rueckfrage.aufzu(true));
  await pg.waitForSelector(".rf-vorschlag .rf-mik", { timeout: 5000 });
  const mS = await stand();
  sage(mS.feld === "Satz 1. Satz 2." && mS.knopf === "🎤", "12b Nach dem Aufklappen: der Text steht im Feld, Knopf 🎤", JSON.stringify(mS.feld) + " · " + mS.knopf);

  /* ---------- Fall N: Raum verlassen ---------- */
  console.log("\nN  Raum mitten im 2. Satz verlassen");
  await vorbereiten();
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await schlaf(6500);
  await pg.evaluate(() => window.LiveChat.pruefLageSetzen("aus"));
  await schlaf(13500 - 6500);
  const nE = await pg.evaluate(() => (window.__klone || []).map((k) => k.readyState).join(","));
  const nS = await stand();
  sage(nS.anfr === 2 && nS.feld === "Satz 1. Satz 2.", "12c Nach dem Verlassen: nur noch das schon Gesprochene, dann Ende", nS.anfr + " Anfragen, " + JSON.stringify(nS.feld));
  sage(nS.knopf === "🎤" && /^(ended,?)+$/.test(nE), "12c Knopf 🎤, Klon beendet", nS.knopf + " · Klon " + nE);
  await stoppen();

  /* ---------- Fall Q (884b): kurzer Aussetzer des Raumkanals ---------- */
  console.log("\nQ  Raumkanal 2 s weg (lage „fehler“ wie nach CHANNEL_ERROR), WebRTC läuft weiter");
  await vorbereiten();
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await schlaf(6000);
  await pg.evaluate(() => window.LiveChat.pruefLageSetzen("fehler"));
  await schlaf(2000);
  await pg.evaluate(() => window.LiveChat.pruefLageSetzen("drin"));
  await warteBis(async () => /Satz 3/.test(await feld()), 10000);
  await schlaf(300);
  const qS = await stand();
  sage(qS.anfr === 3 && qS.feld === "Satz 1. Satz 2. Satz 3." && qS.knopf === "⏹", "16 Ein kurzer Aussetzer des Raumkanals beendet das Diktat nicht (Satz 3 kommt noch)",
    qS.anfr + " Anfragen, " + JSON.stringify(qS.feld) + " · " + qS.knopf);
  await stoppen();
  console.log("\nQ2 Raumkanal bleibt weg (raumWegMs hier 1,5 s statt 30 s)");
  await vorbereiten({ raumWegMs: 1500 });
  await tipp();
  await schlaf(1000);
  await pg.evaluate(() => window.LiveChat.pruefLageSetzen("fehler"));
  const q2Weg = Date.now();
  const q2 = await bisEnde(5000);
  sage(q2 && strom && strom.raumWegMs === 30000, "16 … bleibt der Raum weg, endet es nach der Gnadenfrist (Original 30 s)",
    (q2 ? "Ende nach " + ((Date.now() - q2Weg) / 1000).toFixed(1) + " s" : "läuft noch") + " · raumWegMs " + (strom ? strom.raumWegMs : "–"));
  await zuruecksetzen();

  /* ---------- Fall R: ⏹ ohne Gesprochenes ---------- */
  console.log("\nR  ⏹ nach 1,5 s, ohne zu sprechen");
  await vorbereiten();
  await tipp();
  await schlaf(1500);
  await tipp();
  await bisEnde(3000);
  const rS = await stand();
  sage(rS.anfr === 0 && rS.knopf === "🎤" && /Ich habe nichts gehört – nochmal 🎤 und gleich sprechen\./.test(rS.live),
    "10c Ohne Gesprochenes: „Ich habe nichts gehört – nochmal 🎤 …“ (wie beim Browser-Diktat)", rS.anfr + " Anfragen · " + JSON.stringify(rS.live));

  /* ---------- Fall K: einmal „kontingent“ ---------- */
  console.log("\nK  einmal 429 „kontingent“ beim 2. Stück");
  await vorbereiten();
  Z.antworter = (k, e, std) => k === 1 ? { ms: 100, status: 429, antw: { fehler: "kontingent" } }
    : { ms: 300, antw: Object.assign({}, std.antw, { DisplayText: "Satz " + (k === 0 ? 1 : k) + "." }) };
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await warteBis(async () => /Satz 3/.test(await feld()), 20000);
  await schlaf(300);
  const kS = await stand();
  const kM = await meldungen("strom-kontingent");
  sage(kS.feld === "Satz 1. Satz 2. Satz 3." && kS.anfr === 4 && kS.runden === 0, "9b Nach 2,5 s noch einmal: nichts verloren, kein alter Weg", kS.anfr + " Anfragen, " + JSON.stringify(kS.feld) + ", " + kS.runden + " Starts");
  sage(kS.knopf === "⏹" && kM.length === 0, "9b Das Diktat läuft weiter, keine Meldung", kS.knopf + " · " + kM.length + " Meldungen");
  if (Z.anfr.length >= 3) console.log("       Wiederholung nach " + ((Z.anfr[2].t - Z.anfr[1].t) / 1000).toFixed(2) + " s");
  await stoppen();

  /* ---------- Fall P (884b): Gateway-Antwort ohne Azure-Ergebnis ---------- */
  console.log("\nP  546 WORKER_LIMIT vom Gateway beim 2. Stück (auch beim Wiederholen)");
  await vorbereiten();
  Z.antworter = (k, e, std) => (k === 1 || k === 2)
    ? { ms: 100, status: 546, antw: { code: "WORKER_LIMIT", message: "Function failed due to not having enough compute resources (please check logs)" } }
    : { ms: 300, antw: Object.assign({}, std.antw, { DisplayText: k === 0 ? "Satz 1." : "Satz 3." }) };
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await warteBis(async () => /Satz 3/.test(await feld()), 20000);
  await schlaf(300);
  const pS = await stand();
  const pM = await meldungen("strom-antwort-unlesbar");
  sage(pS.anfr === 4 && pS.feld === "Satz 1. Satz 3." && pS.knopf === "⏹", "15 Antwort ohne RecognitionStatus = Fehler: einmal wiederholt (4 Anfragen), das Diktat läuft weiter",
    pS.anfr + " Anfragen, " + JSON.stringify(pS.feld) + " · " + pS.knopf);
  sage(pM.length === 1 && /grund=WORKER_LIMIT/.test(pM[0]), "15 Meldung strom-antwort-unlesbar mit dem Grund des Gateways (nicht still „nichts gesagt“)", (pM[0] || "keine").slice(0, 130));
  await stoppen();

  /* ---------- Fall O1: die Kopie liefert nur Nullen ---------- */
  console.log("\nO1 die Live-Spur liefert nur Nullen");
  await vorbereiten(null, "tot");
  await tipp();
  await schlaf(4300);
  const o1S = await stand();
  const o1M = await meldungen("strom-nullen");
  const o1U = await unberuehrt();
  sage(o1S.runden === 0 && o1S.anfr === 0 && o1S.knopf === "🎤" && /in einer anderen App belegt/.test(o1S.live),
    "10b Nur Nullen: nach 3 s Ende mit Grund – KEIN alter Weg", o1S.runden + " Starts, " + o1S.anfr + " Anfragen · " + JSON.stringify(o1S.live));
  sage(heil(o1U), "10b … nichts ausgeliehen, die Live-Spur lebt, kein „stumm“", heilText(o1U));
  sage(o1M.length === 1, "10b Meldung strom-nullen", (o1M[0] || "keine").slice(0, 140));
  await altAufraeumen();

  /* ---------- Fall O2: zu leise ---------- */
  console.log("\nO2 die Live-Spur ist zu leise (Sprache unter der Schwelle 0,012); stillEndeMs hier 9,5 s");
  await vorbereiten({ stillEndeMs: 9500 }, "leise");
  await tipp();
  await schlaf(7200);
  const o2S = await stand();
  const o2M = await meldungen("strom-still");
  const o2U = await unberuehrt();
  sage(o2S.runden === 0 && o2S.anfr === 0 && o2S.knopf === "⏹", "10b 6 s nichts Lautes: weiter aus der Live-Spur – KEIN alter Weg", o2S.runden + " Starts, " + o2S.anfr + " Anfragen · " + o2S.knopf + " · " + JSON.stringify(o2S.live));
  sage(heil(o2U), "10b … nichts ausgeliehen, die Live-Spur lebt, kein „stumm“", heilText(o2U));
  sage(o2M.length === 1 && /max rms=0\.0\d+/.test(o2M[0]) && /weiter/.test(o2M[0]), "10b EINE Meldung strom-still mit max rms („weiter“)", (o2M[0] || "keine").slice(0, 160));
  const o2E = await bisEnde(4000) && await stand();
  sage(o2E && o2E.runden === 0 && /Ich habe nichts gehört – nochmal 🎤 und gleich sprechen\./.test(o2E.live),
    "10b Nach stillEndeMs ohne etwas Lautes: sauberes Ende „Ich habe nichts gehört …“", o2E ? JSON.stringify(o2E.live) : "läuft noch");
  sage(strom && strom.stillEndeMs === 30000, "10b Im Original: stillEndeMs = 30000", strom ? String(strom.stillEndeMs) : "–");
  await zuruecksetzen();
  await altAufraeumen();

  /* ---------- Fall O3 (884b): 7 s still, dann sprechen ---------- */
  console.log("\nO3 7 s still (dem Gegenüber zuhören, überlegen), dann ein Satz");
  await vorbereiten();
  await tipp();
  await pg.evaluate(() => window.__sprich([[7.0, 2.5]]));
  await warteBis(async () => /Satz 1|lter weg/i.test(await feld()), 16000);
  await schlaf(400);
  const o3S = await stand();
  const o3U = await unberuehrt();
  const o3H = await hoerbar();
  sage(o3S.feld === "Satz 1." && o3S.runden === 0 && o3S.knopf === "⏹", "10d Nach 7 s Stille gesprochen: aus der Live-Spur erkannt – KEIN alter Weg",
    o3S.runden + " Starts, " + JSON.stringify(o3S.feld) + " · " + o3S.knopf);
  sage(heil(o3U) && o3H.je.length === 1 && o3H.je[0] > 0, "10d … und die anderen hören den Satz (nichts ausgeliehen, kein „stumm“)",
    heilText(o3U) + " · Energie bei B " + (o3H.je[0] !== undefined ? o3H.je[0].toExponential(2) : "?"));
  await stoppen();
  await altAufraeumen();

  /* ---------- Fall F: Tagesgrenze ---------- */
  console.log("\nF  „tagesgrenze“ beim zweiten Stück");
  await vorbereiten();
  Z.antworter = (k, e, std) => k === 0 ? std : { ms: 200, status: 429, antw: { fehler: "tagesgrenze", grenze: 300 } };
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await warteBis(() => Z.anfr.length >= 2, 14000);
  await bisEnde(4000);
  await schlaf(300);
  const fS = await stand();
  const fU = await unberuehrt();
  const fF = await meldungen("strom-tagesgrenze");
  const fSp = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("dma_diktat_strom_sperre")); } catch (e) { return null; } });
  sage(fS.runden === 0 && fS.knopf === "🎤", "9  Tagesgrenze: Ende – KEIN alter Weg (keine Browser-Erkennung)", fS.runden + " Starts · " + fS.knopf);
  sage(heil(fU), "9  … nichts ausgeliehen, die Live-Spur lebt, kein „stumm“", heilText(fU));
  sage(fS.feld === "Satz 1." && /Für heute ist die Spracherkennung aufgebraucht – bitte tippen\./.test(fS.live), "9  Der Text bis dahin bleibt, der Grund steht da", JSON.stringify(fS.feld) + " · " + JSON.stringify(fS.live));
  sage(fF.length === 1 && /^\[automatisch\] Diktat-Fehler: strom-tagesgrenze \(nr=1/.test(fF[0]) && /verworfen=[1-9]/.test(fF[0]),
    "9  Meldung im Funk, „verworfen=“ zählt das fehlgeschlagene Stück mit", (fF[0] || "keine").slice(0, 150));
  sage(fSp && fSp.grund === "tagesgrenze" && fSp.bis > Date.now(), "9  Der Strom-Weg ruht bis Mitternacht (UTC)", fSp ? new Date(fSp.bis).toISOString() : "keine Sperre");
  await stoppen();
  /* der nächste 🎤 mit einer FRISCHEN Live-Spur – sonst käme „kein Strom-Weg“ auch ohne Sperre (Prüfung: zahnlos) */
  const fVor = Z.anfr.length;
  const fCtx = await pg.evaluate(() => { window.__rfRunden = 0; window.__neueSpur(); return window.__ctxe.length; });
  await tipp();
  await schlaf(600);
  const fN = await stand();
  const fNctx = await pg.evaluate(() => window.__ctxe.length);
  sage(fN.runden === 0 && Z.anfr.length === fVor && fNctx === fCtx && fN.knopf === "🎤" && /Für heute/.test(fN.live),
    "9  Der nächste 🎤 (frische Live-Spur): gleich der Grund – kein Strom-Weg, kein alter Weg", fN.runden + " Starts, " + (Z.anfr.length - fVor) + " neue Anfragen, " + (fNctx - fCtx) + " neue Kontexte · " + JSON.stringify(fN.live));
  await altAufraeumen();

  /* ---------- Fall K2: dauernd „kontingent“ ---------- */
  console.log("\nK2 dauernd 429 „kontingent“ (Pause hier 0,5 s statt 2,5 s)");
  await vorbereiten({ kontingentMs: 500 });
  Z.antworter = (k, e, std) => k === 0 ? std : { ms: 100, status: 429, antw: { fehler: "kontingent" } };
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI.slice(0, 2));
  await warteBis(() => Z.anfr.length >= 4, 16000);
  await bisEnde(4000);
  await schlaf(300);
  const k2S = await stand();
  const k2U = await unberuehrt();
  const k2M = await meldungen("strom-kontingent");
  sage(k2S.runden === 0 && Z.anfr.length === 4 && k2S.feld === "Satz 1." && k2S.knopf === "🎤" && /gerade nicht verfügbar – bitte tippen/.test(k2S.live),
    "9c Nach 3 Versuchen Ende mit Grund, der Text bleibt – KEIN alter Weg", k2S.runden + " Starts, " + Z.anfr.length + " Anfragen, " + JSON.stringify(k2S.feld) + " · " + JSON.stringify(k2S.live));
  sage(heil(k2U), "9c … nichts ausgeliehen, die Live-Spur lebt, kein „stumm“", heilText(k2U));
  sage(k2M.length === 1 && /versuche=3/.test(k2M[0]) && /verworfen=1\b/.test(k2M[0]), "9c Meldung strom-kontingent (versuche=3, verworfen=1: das fehlgeschlagene Stück zählt mit)", (k2M[0] || "keine").slice(0, 150));
  await altAufraeumen();
  await zuruecksetzen();

  /* ---------- Fall L: Tagesmenge ---------- */
  console.log("\nL  Tagesmenge (hier 4 s statt 300 s)");
  await vorbereiten({ tagesSekunden: 4 });
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await warteBis(() => Z.anfr.length >= 2, 16000);
  await bisEnde(6000);
  await schlaf(300);
  const lS = await stand();
  const lU = await unberuehrt();
  const lM = await meldungen("strom-tagesmenge");
  sage(lS.runden === 0 && Z.anfr.length === 2 && lS.feld === "Satz 1. Satz 2." && /im Livestream aufgebraucht – bitte tippen/.test(lS.live),
    "9d Das schon Gesprochene wird noch aufgeschrieben, dann Ende mit Grund – KEIN alter Weg", lS.runden + " Starts, " + Z.anfr.length + " Anfragen, " + JSON.stringify(lS.feld) + " · " + JSON.stringify(lS.live));
  sage(heil(lU), "9d … nichts ausgeliehen, die Live-Spur lebt, kein „stumm“", heilText(lU));
  sage(lM.length === 1, "9d Meldung strom-tagesmenge", (lM[0] || "keine").slice(0, 120));
  await stoppen();
  const lVor = Z.anfr.length;
  const lCtx = await pg.evaluate(() => { window.__rfRunden = 0; window.__neueSpur(); return window.__ctxe.length; });
  await tipp();
  await schlaf(600);
  const lN = await stand();
  const lNctx = await pg.evaluate(() => window.__ctxe.length);
  sage(lN.runden === 0 && Z.anfr.length === lVor && lNctx === lCtx && /im Livestream aufgebraucht/.test(lN.live),
    "9d Der nächste 🎤 (frische Live-Spur): gleich der Grund – kein Strom-Weg, kein alter Weg", lN.runden + " Starts, " + (Z.anfr.length - lVor) + " neue Anfragen, " + (lNctx - lCtx) + " neue Kontexte");
  await altAufraeumen();

  /* ---------- Fall L2 (884b): erstes ⏹ während des Ausklangs ---------- */
  console.log("\nL2 Tagesmenge erreicht, die Antwort auf Satz 2 ist noch unterwegs (2,5 s) – Xander tippt EINMAL ⏹");
  await vorbereiten({ tagesSekunden: 4 });
  Z.antworter = (k, e, std) => ({ ms: k === 1 ? 2500 : 300, antw: std.antw });
  await tipp();
  await pg.evaluate((p) => window.__sprich(p), DREI);
  await warteBis(async () => /Einen Moment/.test((await stand()).live), 16000);
  await tipp();
  await bisEnde(6000);
  await schlaf(200);
  const l2S = await stand();
  sage(l2S.anfr === 2 && l2S.feld === "Satz 1. Satz 2." && l2S.knopf === "🎤" && /im Livestream aufgebraucht/.test(l2S.live),
    "9e Erstes ⏹ während des Ausklangs: die Antwort unterwegs wird noch geschrieben, dann Ende mit Grund", l2S.anfr + " Anfragen, " + JSON.stringify(l2S.feld) + " · " + JSON.stringify(l2S.live));
  await altAufraeumen();
  await zuruecksetzen();
  sage(strom && strom.tagesSekunden === 300, "9d Im Original: 300 s (5 min) gesendete Sprache am Tag", strom ? String(strom.tagesSekunden) : "–");

  /* ---------- Fall G: stumm geschaltet ---------- */
  console.log("\nG  stumm geschaltet (tonUmschalten), dann diktieren");
  await vorbereiten();
  await pg.evaluate(() => window.LiveChat.tonUmschalten());
  const gV = await pg.evaluate(() => window.__live.enabled + "/" + window.LiveChat.lage().tonAn);
  await tipp();
  await pg.evaluate(() => window.__sprich([[0.5, 2.5]]));
  await warteBis(async () => /Satz 1/.test(await feld()), 9000);
  const gH = await hoerbar();
  const gS = await stand();
  sage(gV === "false/false" && gS.feld === "Satz 1.", "12 Stumm: das Diktat hört trotzdem (Klon an)", "Original an/tonAn " + gV + ", Feld " + JSON.stringify(gS.feld));
  sage(gH.je.length === 1 && gH.je[0] < 1e-6, "12 ... und die anderen hören weiter nichts", "Energie bei B im Satz " + (gH.je[0] !== undefined ? gH.je[0].toExponential(2) : "?"));
  await stoppen();
  await pg.evaluate(() => window.LiveChat.tonUmschalten());

  /* ---------- Fall H: 30 s Leistung ---------- */
  console.log("\nH  Leistung: 30-s-Diktat (16-kHz-Kontext), echte Kette bis zum Netz");
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
  const hK = await pg.evaluate(() => window.__kette.filter((k) => k.fetch).map((k) => k.fetch - k.ruf));
  const hS = await stand();
  sage(hS.anfr >= 3 && hL.every((d) => d <= 100), "13 Keine lange Aufgabe > 100 ms während des Diktats", (hL.length ? hL.join(", ") + " ms" : "keine langen Aufgaben") + " · " + hS.anfr + " Stücke");
  console.log("       alsWav je Stück (16 kHz): " + (hZ.length ? hZ.map((z) => z.toFixed(1)).join(" / ") + " ms" : "–"));
  console.log("       zentralErkennen → fetch (Base64 + JSON): " + (hK.length ? hK.map((z) => z.toFixed(1)).join(" / ") + " ms" : "–"));

  /* ---------- Fall H2: EIN großes Stück (nur im Quellen-Lauf) ---------- */
  if (lauf === "quelle") {
    console.log("\nH2 Leistung: 50 s Dauerrede = EIN Stück von ~50 s");
    await vorbereiten();
    const h2T0 = await pg.evaluate(() => performance.now());
    await tipp();
    await pg.evaluate(() => window.__sprich([[0.5, 50]]));
    await warteBis(() => Z.anfr.length >= 1, 60000);
    await schlaf(1500);
    await stoppen();
    const h2T1 = await pg.evaluate(() => performance.now());
    const h2L = await pg.evaluate(([a, b]) => window.__lange.filter((l) => l.t >= a && l.t <= b).map((l) => Math.round(l.d)), [h2T0, h2T1]);
    const h2K = await pg.evaluate(() => window.__kette.map((k) => ({ ms: k.fetch ? k.fetch - k.ruf : null, wav: k.bytes, body: k.body })));
    const h2Z = await pg.evaluate(() => window.__wavZeit.map((z) => z[2]));
    const e0 = Z.anfr[0] || { dauerS: 0, b64Laenge: 0 };
    sage(Z.anfr.length >= 1 && e0.dauerS > 45 && e0.dauerS <= 55 && h2L.every((d) => d <= 100),
      "13 Ein Stück von ~50 s: keine lange Aufgabe > 100 ms (alsWav + Base64 + JSON)",
      "Stück " + e0.dauerS.toFixed(1) + " s, WAV " + ((h2K[0] || {}).wav / 1e6).toFixed(2) + " MB, Körper " + (((h2K[0] || {}).body || 0) / 1e6).toFixed(2) + " MB · lange Aufgaben " + (h2L.length ? h2L.join(", ") + " ms" : "keine"));
    console.log("       alsWav " + (h2Z[0] !== undefined ? h2Z[0].toFixed(1) : "–") + " ms · zentralErkennen → fetch " + (h2K[0] && h2K[0].ms !== null ? h2K[0].ms.toFixed(1) : "–") + " ms");
  }

  /* ---------- Fall J: außerhalb des Livestreams ---------- */
  console.log("\nJ  außerhalb des Livestreams");
  await vorbereiten();
  await pg.evaluate(() => window.LiveChat.pruefLageSetzen("aus"));
  await tipp();
  await schlaf(500);
  const jS = await stand();
  sage(jS.runden >= 1 && jS.anfr === 0 && /alter weg/i.test(jS.feld), "11 Wie bisher: Browser-Erkennung, keine Anfrage an die Zentrale", jS.runden + " Starts, " + jS.anfr + " Anfragen, " + JSON.stringify(jS.feld));
  await stoppen();

  /* ---------- Fall I: das Worklet-Modul hängt ---------- */
  console.log("\nI  das Worklet-Modul hängt (addModule kommt nie zurück)");
  await vorbereiten();
  await pg.evaluate(() => { window.__wHaengt = true; });
  await tipp();
  await pg.evaluate(() => window.__sprich([[2.5, 2.5]]));
  await warteBis(async () => /Satz 1|lter weg/i.test(await feld()), 12000);
  await schlaf(300);
  const iS = await stand();
  const iU = await unberuehrt();
  const iF = await meldungen("strom-kein-start");
  sage(iS.feld === "Satz 1." && iS.runden === 0 && iS.anfr === 1, "10 Nach 1,5 s übernimmt der ScriptProcessor: der Satz wird erkannt – KEIN alter Weg", iS.runden + " Starts, " + iS.anfr + " Anfragen, " + JSON.stringify(iS.feld));
  sage(iF.length === 0 && heil(iU), "10 … keine Meldung strom-kein-start, nichts ausgeliehen", iF.length + " Meldungen · " + heilText(iU));
  await stoppen();
  await pg.evaluate(() => { window.__wHaengt = false; });
  await altAufraeumen();

  /* ---------- Fall I2: auch der ScriptProcessor geht nicht → Ende ---------- */
  console.log("\nI2 Worklet hängt UND ScriptProcessor wirft (kein Block in 3 s)");
  await vorbereiten();
  await pg.evaluate(() => { window.__wHaengt = true; window.__spWirft = true; });
  await tipp();
  await schlaf(4200);
  const i2S = await stand();
  const i2U = await unberuehrt();
  const i2F = await meldungen("strom-kein-start");
  sage(i2S.runden === 0 && i2S.knopf === "🎤" && /ließ sich nicht starten/.test(i2S.live), "10 Kein Block in 3 s: Ende mit Grund – KEIN alter Weg", i2S.runden + " Starts · " + JSON.stringify(i2S.live));
  sage(i2F.length === 1 && /knoten=keiner/.test(i2F[0]) && heil(i2U), "10 Meldung strom-kein-start, nichts ausgeliehen", (i2F[0] || "keine").slice(0, 110) + " · " + heilText(i2U));
  await pg.evaluate(() => { window.__wHaengt = false; window.__spWirft = false; });
  await altAufraeumen();

  sage(seitenfehler.length === 0, "14 Keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  await ctx.close();
}
