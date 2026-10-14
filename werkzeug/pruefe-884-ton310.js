#!/usr/bin/env node
/* =====================================================================
   SONDE 884 — „SIE HÖRT MICH DANN NICHT MEHR" (FASSUNG 884, Funk 310)
   ---------------------------------------------------------------------
   XANDER (Funk 310): „… sie fragt mich immer ob ich sie hören kann ich
   höre sie immer aber sie hört mich dann nicht mehr" (Emy, Android-
   WebView, beim Spielen im Klassenzimmer).
   Ursache (Versuch 310, im Labor bestätigt): baut der Anrufer (Xander,
   kleinere Kennung) die Leitung neu auf, ohne dass jemand neu lädt, kommt
   seine neue Tonspur bei Emy mit DERSELBEN Kennung an; pc.ontrack
   verglich nur Kennungen, die tote alte Spur blieb im Strom, die lebende
   wurde nicht angehängt – jeder zweite Neuaufbau taub.
   Zwei echte Chromium-Seiten aus den QUELLEN (index.html?quelle), echte
   WebRTC-Leitung, die Raum-Pakete trägt die Sonde von Hand hinüber (wie
   884-leitung), das Spiel hängt an einem nachgebildeten Server (wie 842).
   Browser mit --autoplay-policy=user-gesture-required (wie die WebView).
     A = Betreiber k258507e0a (kleinere Kennung → ruft an, wie Xander)
     B = k908c6857a, Telefon-Kontext, Touch, UA von Emy (Android 11, wv)
   „HÖRT" wird VON AUSSEN gemessen (ohne Prüfhaken, gilt also auch für den
   alten Stand): in 1 s > 20 Pakete, abgespielte Samples > 0, Energie > 0,
   und ein <audio> spielt die LEBENDE Empfangsspur als Gegenstand, nicht
   stumm, nicht pausiert.
     A  6 Neuaufbauten durch A ohne Neuladen: 2× Ton-Knopf #lcTonNeu (echter
        Klick), 2× Gruss von B (ohne „wieder"), 2× dasselbe, während B
        mitspielt (Controller-Tipp) und die Stadt im Rahmen offen ist.
        Danach hört B A und A B (je binnen 6 s ab dem Auslöser)
     B  nach jedem Neuaufbau liegt bei B genau EINE Tonspur in A's Strom, und
        sie ist die lebende Empfangsspur; der Bericht „leitung" trägt
        „tonGleicheKennung" (der Auslöser wird gezählt)
     C  Stufe 1 (von aussen gestört, bei B): Spur heraus + toter Klon hinein,
        Element stumm, Element an leerem Strom → je binnen 5,5 s wieder
        hörbar; keine neue Leitung, kein Angebot, keine Chat-/Systemzeile,
        kein Toast; genau EIN „ton-weg" (Befund spur, geheilt 1) – die
        weiteren Vorfälle nur gezählt (1 je Gegenüber in 2 min)
     D  Stufe 3: A's Tonsender zu B leer (wie ein geliehenes Mikro), A sagt
        „redet". Kontrolle zuerst: hat A „stumm tonAn:false" gemeldet, kommt
        KEIN „tonweg". Danach: B schickt „tonweg", A legt die Spur zurück,
        B hört A binnen 15 s
     E  Stufe 2 (nur neue Fassung, Prüfhaken pruefEmpfangFaelschen sm 0):
        erst neu angehängt, dann ein anderes Element, danach hört B
   Dazu (aus dem Plan, kurz):
     F  Plan B: play() bei B nur in pointerup/touchend/click/keydown (wie ein
        strenger WebView-Gastgeber) – nach einem Neuaufbau ist B still; F1 ein
        Fingertipp auf die Seite, F2 ein Fingertipp in die Stadt im Rahmen →
        binnen 1,5 s hörbar
     G  „Nur Mitspieler hören" an: A bleibt bei B stumm (die Wache entstummt
        NICHT), tonstand trägt nur/filt; aus: wieder hörbar
     H  Berichte (leitung, verbindung, ton-weg) < 6000 Zeichen (wie der
        Server misst), kein Anzeigename; verbindung trägt heil und filt
     I  Ruhe: B ruft getStats höchstens 5× in 10 s (eine Leitung, Takt
        2,5 s); im Leerlauf keine Heilung; keine Seitenfehler
   NACHBESSERUNG 1 (nach der Prüfung):
     A  zusätzlich: während der sechs Neuaufbauten greift die Wache bei B
        NICHT ein (Befund-Zähler unverändert) – sonst bliebe A grün, auch
        wenn ontrack wieder bricht (die Wache heilt das in ~3 s)
     J  Browser ohne Messgrösse (B's getStats ohne totalSamplesReceived
        bzw. ohne totalAudioEnergy, A redet): gesunde Leitung, je 15 s –
        keine Heilung, keine neue Leitung, kein „tonweg"; ohne Samples
        schliesst ein Vorfall trotzdem („hört wieder" ohne sm)
     K  Stufe 3 von der KLEINEREN Kennung: bei B ein veraltetes „A hört
        mich über den Tonserver" (leere Netz-Tonspur zu A), B redet → A
        schickt „tonweg" und baut neu auf, B räumt auf, A hört B
   GEGENPROBE: WURZEL=<Baum mit livechat.js und spiel.js aus 7f053be> (siehe
   SPIELSYSTEM.md, Fassung 884 — Ton 310) oder ALT=1 (= 7f053be) bzw.
   ALT=<rev> (git show aus WURZEL). Im alten Stand bleibt B nach einem
   tauben Schritt taub; vor C-stumm, C-element, D und G stellt die Sonde dann
   mit dem Ton-Knopf auf B zurück (zurueck), damit jeder Fall an seinem
   eigenen Befund gemessen wird. Gemessen am 12.10.: neu 37 ok, 0 rot;
   alt 21 rot – A1/A3/A5 taub (jeder zweite), B1/B3/B5, tonGleicheKennung,
   C-spur, C-stumm, C-Zeile (falsches „Dein Browser lässt den Ton noch nicht
   durch" nach AbortError), C-Bericht, C-Zähler, D (2), E, F1, F2,
   G-hoerFilterStand, H (3); grün: Kontrollen, A2/A4/A6, C-element (die alte
   Tonwache heilt das in 3,3 s), C ohne Leitung/Angebot, D-Kontrolle, G
   (stumm, Schalter aus), H-Grösse, I.
   GEGENPROBEN DER NACHBESSERUNG (WURZEL=<Baum mit Verweisen, nur
   livechat.js ausgetauscht>): „vor" = livechat.js aus e704342 (J rot,
   K rot – dort fehlt auch der Prüfhaken); „ohneFix" = neue livechat.js,
   nur ontrack (Kennung) und brueckeAbbauen (Ton bleibt im Strom) auf dem
   alten Stand (A-Wache rot); „ohneTonwegKlein" = neue livechat.js, nur
   empfangStufe3 schickt bei der kleineren Kennung kein „tonweg" (K rot).
   Gemessen am 12.10. (Nachbesserung 1): neu 45 ok, 0 rot (zweimal); vor 4 rot
   (J ×3, K-Haken), ohneFix 2 rot (A-Wache spur1:6, C-ton-weg), ohneTonwegKlein
   3 rot (K: kein Paket, kein Aufräumen, nach dem Spurwechsel bei B taub).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const VOR = "7f053be";   // der Stand direkt vor „WIP 884b ton310"
const ALT = process.env.ALT ? (process.env.ALT === "1" ? VOR : process.env.ALT) : "";
const holen = (d) => ALT ? execFileSync("git", ["-C", WURZEL, "show", ALT + ":" + d], { maxBuffer: 1 << 28 }).toString("utf8")
                         : fs.readFileSync(path.join(WURZEL, d), "utf8");
const LC = holen("livechat.js"), SP = holen("spiel.js");
const NEU = /function empfangPruefen/.test(LC);
if (ALT && NEU) { console.log("GEGENPROBE UNGÜLTIG: livechat.js aus " + ALT + " enthält den Bau schon – ALT=1 (= " + VOR + ") nehmen."); process.exit(3); }
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
/* Der Server misst length(p_daten::text) – jsonb-Text mit Leerzeichen nach „:" und „," (wie Sonde 884-mikro) */
function jsonbText(v) {
  if (v === null || typeof v !== "object") return v === undefined ? "null" : JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map((x) => (x === undefined ? "null" : jsonbText(x))).join(", ") + "]";
  return "{" + Object.keys(v).filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ": " + jsonbText(v[k])).join(", ") + "}";
}

const IDA = "k258507e0a", IDB = "k908c6857a";
const UID = { [IDA]: "258507e0-0000-4000-8000-00000000000a", [IDB]: "908c6857-a656-4b5f-9b06-1d39dcad70dd" };
const UA_EMY = "Mozilla/5.0 (Linux; Android 11; CPH1937 Build/RKQ1.200903.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.0.0 Mobile Safari/537.36";
const UA_XANDER = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36";

/* ---- in jeder Seite (und jedem Rahmen) vor allem anderen ---- */
const HAKEN = () => {
  try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
  window.LEICHT_FREI = true;   // die neue Stadt im Rahmen (lsAuf) für die Sonde frei
  const oben = () => { try { return window.top; } catch (e) { return window; } };
  /* Gesten-Merker für Fall F: pointerup/touchend/click/keydown zählen, pointerdown nicht (wie Android) */
  ["pointerup", "touchend", "click", "keydown"].forEach((a) => window.addEventListener(a, () => {
    const t = oben(); t.__geste = true; setTimeout(() => { t.__geste = false; }, 0);
  }, true));
  const play0 = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    const t = oben();
    if (t.__streng && this.srcObject && !t.__geste) { t.__abgelehnt = (t.__abgelehnt || 0) + 1; return Promise.reject(new DOMException("streng", "NotAllowedError")); }
    const v = play0.call(this), st = String(new Error().stack || "").split("\n").slice(2, 6).map((x) => x.trim().replace(/^at /, "").replace(/\(?https?:\/\/[^/]+\//, "(")).join(" < ");
    if (v && v.catch) v.catch((e) => { (t.__playFehler = t.__playFehler || []).push((e && e.name) + " @ " + st); });
    return v;
  };
  if (window !== oben()) return;   // im Rahmen nur die Gesten und play()
  const O = window.RTCPeerConnection;
  window.__pcs = [];
  window.RTCPeerConnection = class extends O { constructor(...a) { super(...a); window.__pcs.push(this); } };
  const gs = O.prototype.getStats;
  window.__getStats0 = gs; window.__statsZahl = 0;
  O.prototype.getStats = function () { window.__statsZahl++; return gs.apply(this, arguments); };
  window.__toasts = 0;
  try {
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.classList && n.classList.contains("toast-popup")) window.__toasts++; })))
      .observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
  /* Messung von aussen: die neueste offene Leitung, ihre lebende Empfangsspur, Zähler, und wer sie abspielt */
  window.__ton = async function () {
    const offen = window.__pcs.filter((pc) => pc.signalingState !== "closed");
    const pc = offen[offen.length - 1];
    if (!pc) return { nr: -1, offen: 0, alle: window.__pcs.length };
    let R = null;
    pc.getReceivers().forEach((r) => { if (r.track && r.track.kind === "audio" && r.track.readyState !== "ended") R = r.track; });
    let pk = 0, sm = 0, en = 0;
    try { (await window.__getStats0.call(pc)).forEach((x) => { if (x.type === "inbound-rtp" && x.kind === "audio") { pk += x.packetsReceived || 0; sm += x.totalSamplesReceived || 0; en += x.totalAudioEnergy || 0; } }); } catch (e) {}
    const el = Array.from(document.querySelectorAll("audio")).filter((a) => a.srcObject && R && a.srcObject.getAudioTracks().indexOf(R) >= 0);
    return { nr: window.__pcs.indexOf(pc), offen: offen.length, alle: window.__pcs.length, pk, sm, en,
             spielt: el.filter((a) => !a.muted && !a.paused && a.isConnected).length, el: el.length, stumm: el.filter((a) => a.muted).length,
             pause: el.filter((a) => a.paused).length };
  };
};

(async () => {
  console.log(NEU ? "Stand: mit Bau (empfangPruefen da)" : "GEGENPROBE: alter Stand (" + (ALT || WURZEL) + ")");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (p === "/livechat.js") { a.writeHead(200, { "Content-Type": "text/javascript" }); return a.end(LC); }
    if (p === "/spiel.js") { a.writeHead(200, { "Content-Type": "text/javascript" }); return a.end(SP); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns",
      "--autoplay-policy=user-gesture-required"] });
  const ctxA = await br.newContext({ viewport: { width: 393, height: 800 }, userAgent: UA_XANDER });
  const ctxB = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: UA_EMY });

  async function vorbereiten(pg, ich, ander, o) {
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_SPIEL && window.DMA_PRUEF, null, { timeout: 90000 });
    await pg.evaluate(async ([ich, ander, UID, o]) => {
      const strom = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.LiveChat.pruefEigenerStrom(strom, true);
      if (o.betreiber) { window.LiveChat.pruefBetreiber(true); try { window.LiveChat.pruefHaeuptling(true); } catch (e) {} }
      const l = { [ander]: { id: ander, name: o.anderName, seit: 2000, buehne: true, bild: "", gesehen: 9e15, haeuptling: Boolean(o.anderHaeuptling) } };
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: o.ichName, seit: 1000, buehne: true, zuruecksetzen: true, leute: l });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.__berichte = [];
      (typeof Backend !== "undefined" ? Backend : window.Backend).zugang = () => ({ rpc: (name, a) => {
        window.__berichte.push({ name, art: a && a.p_art, d: a && a.p_daten, t: Date.now() }); return Promise.resolve({ data: { ok: true } }); } });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      window.LiveChat.spielIdVon = (id) => UID[id] || "";
      const basisSp = { lp: 100, lp_max: 100, kaputt: false, schild: 0, punkte: 50, pflaster: 1, traenke: 1, waffen: ["kartoffel"], mission: null,
        mana: 40, mana_max: 100, level: 2, xp: 10, skills: {}, vorraete: {} };
      const ichSp = Object.assign({ id: UID[ich], name: o.ichName, mitspielen: false }, basisSp);
      const anderSp = Object.assign({ id: UID[ander], name: o.anderName, mitspielen: false }, basisSp);
      window.__ichSp = ichSp; window.__anderSp = anderSp;
      const klient = { rpc: (name, args) => {
        let data = { ok: true };
        if (name === "spiel_ich") data = ichSp;
        else if (name === "spiel_stand") data = [ichSp, anderSp];
        else if (name === "spiel_mitspielen") { ichSp.mitspielen = Boolean(args && args.p_an); data = Object.assign({ ok: true }, ichSp); }
        else if (name === "spiel_diagnose_senden") window.__berichte.push({ name, art: args && args.p_art, d: args && args.p_daten, t: Date.now() });
        return Promise.resolve({ data, error: null });
      } };
      window.DMA_SPIEL.pruef.setzen({ klient, bereit: true, versucht: true, uid: UID[ich], ich: ichSp,
        stand: { [UID[ich]]: ichSp, [UID[ander]]: anderSp }, letzterAbruf: Date.now() });
      window.LiveChat.spielKennungSetzen(UID[ich]);
      const f = document.getElementById("lcForm"); if (f) f.style.display = "";   // wie im Versuch: die Spielleiste mit „Mitspielen"
      try { window.DMA_SPIEL.pruef.schnellZeichnen(true); } catch (e) {}
    }, [ich, ander, UID, o]);
  }
  async function seiteAuf(ctx, ich, ander, o) {
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e).slice(0, 160)));
    await pg.addInitScript(HAKEN);
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pg.goto(basis + "/index.html?quelle", { waitUntil: "domcontentloaded" });
    await vorbereiten(pg, ich, ander, o);
    return pg;
  }
  const A = await seiteAuf(ctxA, IDA, IDB, { ichName: "Xander", anderName: "Emy", betreiber: true });
  const B = await seiteAuf(ctxB, IDB, IDA, { ichName: "Emy", anderName: "Xander", anderHaeuptling: true });

  /* der Raum-„Server": trägt die Pakete hinüber und merkt sich, was jede Seite hinausschickt */
  let laeuft = true;
  const gesendet = { A: [], B: [] };
  function traeger(vonName) {
    (async () => {
      while (laeuft) {
        const von = vonName === "A" ? A : B, nach = vonName === "A" ? B : A;
        let pakete = [];
        try { pakete = await von.evaluate(() => (window.__raus || []).splice(0)); } catch (e) { await schlaf(50); continue; }
        for (const p of pakete) {
          gesendet[vonName].push({ t: Date.now(), art: p.art, an: p.an, b: p.b });
          try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
        }
        await schlaf(15);
      }
    })();
  }
  traeger("A"); traeger("B");
  const hallo = (sitzung) => A.evaluate(([v, s]) => window.LiveChat.pruefEmpfangen({ art: "hallo", von: v, name: "Emy", seit: 2000, kf: 1, sitzung: s }), [IDB, sitzung]);
  const ton = (pg) => pg.evaluate(() => window.__ton());
  async function hoertJetzt(pg) {
    const m1 = await ton(pg); await schlaf(1000); const m2 = await ton(pg);
    const d = { pk: m2.pk - m1.pk, sm: m2.sm - m1.sm, en: m2.en - m1.en };
    return { ok: m1.nr === m2.nr && m2.nr >= 0 && d.pk > 20 && d.sm > 0 && d.en > 0 && m2.spielt > 0, d, m: m2 };
  }
  async function bisHoert(pg, frist) {
    const t0 = Date.now(); let r = null;
    while (Date.now() - t0 < frist) { r = await hoertJetzt(pg); if (r.ok) return { ms: Date.now() - t0, r }; }
    return { ms: -1, r };
  }
  const zeige = (x) => x.ms >= 0 ? x.ms + " ms" : "nie (" + JSON.stringify(x.r && { d: x.r.d, spielt: x.r.m.spielt, el: x.r.m.el, stumm: x.r.m.stumm, pause: x.r.m.pause, offen: x.r.m.offen }) + ")";
  const pcZahl = (pg) => pg.evaluate(() => window.__pcs.length);
  async function neueLeitung(vorB, frist) {
    const t0 = Date.now();
    while (Date.now() - t0 < frist) { if ((await pcZahl(B)) > vorB) return true; await schlaf(50); }
    return false;
  }
  /* B: A's Strom, so wie der Platz ihn zeigt */
  const spurLage = () => B.evaluate((ida) => {
    const p = (window.LiveChat.lage().plaetze || []).find((x) => x.id === ida);
    const st = p && p.strom ? p.strom.getAudioTracks() : [];
    const offen = window.__pcs.filter((pc) => pc.signalingState !== "closed"), pc = offen[offen.length - 1];
    let R = null; if (pc) pc.getReceivers().forEach((r) => { if (r.track && r.track.kind === "audio" && r.track.readyState !== "ended") R = r.track; });
    return { n: st.length, lebt: st.filter((t) => t.readyState === "live").length, istR: st.length === 1 && st[0] === R };
  }, IDA);
  async function tippe(pg, sel) {
    await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: "center" }); }, sel);
    await schlaf(150);
    const m = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, sel);
    if (!m || !m.w) return "fehlt";
    const oben = await pg.evaluate(([x, y, s]) => { const t = document.elementFromPoint(x, y), e = document.querySelector(s); return t && e && (t === e || e.contains(t)); }, [m.x, m.y, sel]);
    if (!oben) { await pg.evaluate((s) => document.querySelector(s).click(), sel); return "Ersatzklick (verdeckt)"; }
    if (pg === B) await pg.touchscreen.tap(m.x, m.y); else await pg.mouse.click(m.x, m.y);
    return "getippt";
  }
  async function mitspielen(pg, soll) {
    await pg.evaluate(() => { try { window.DMA_SPIEL.pruef.schnellZeichnen(true); } catch (e) {} });
    const wie = await tippe(pg, '.sp-schnell [data-s="mitspielen"]');
    for (let i = 0; i < 25 && (await pg.evaluate(() => Boolean(window.__ichSp.mitspielen))) !== soll; i++) await schlaf(120);
    let ist = await pg.evaluate(() => Boolean(window.__ichSp.mitspielen)), ersatz = "";
    if (ist !== soll) {   // wie im Versuch: notfalls ein Programm-Klick auf denselben Knopf
      ersatz = " → Ersatzklick";
      await pg.evaluate(() => { const b = document.querySelector('.sp-schnell [data-s="mitspielen"]'); if (b) b.click(); });
      for (let i = 0; i < 25 && (await pg.evaluate(() => Boolean(window.__ichSp.mitspielen))) !== soll; i++) await schlaf(120);
      ist = await pg.evaluate(() => Boolean(window.__ichSp.mitspielen));
    }
    await (pg === A ? B : A).evaluate((v) => { if (window.__anderSp) window.__anderSp.mitspielen = v; }, soll);
    return wie + ersatz + " → " + ist;
  }

  /* ============================================================== AUFBAU */
  await hallo("s0");
  const d0 = await Promise.all([bisHoert(B, 20000), bisHoert(A, 20000)]);
  sage(d0[0].ms >= 0 && d0[1].ms >= 0, "Kontrolle: Leitung steht, beide hören sich", "B " + zeige(d0[0]) + ", A " + zeige(d0[1]));
  await schlaf(1500);

  /* ============================================================== A + B */
  console.log("\nA) SECHS NEUAUFBAUTEN DURCH A OHNE NEULADEN  ·  B) DIE SPUR DANACH\n");
  const ausloeser = [
    ["Ton-Knopf #lcTonNeu (1)", async () => "Klick: " + await tippe(A, "#lcTonNeu")],
    ["Ton-Knopf #lcTonNeu (2)", async () => "Klick: " + await tippe(A, "#lcTonNeu")],
    ["Gruss von B ohne „wieder“ (1)", () => hallo("g1")],
    ["Gruss von B ohne „wieder“ (2)", () => hallo("g2")],
    ["B spielt mit + Stadt offen, Gruss (1)", () => hallo("g3")],
    ["B spielt mit + Stadt offen, Gruss (2)", () => hallo("g4")]
  ];
  let taub = 0, spurFalsch = 0, stadtWie = "";
  /* Nachbesserung 1: die Befund-Zähler der Wache bei B vorher/nachher – heilt sie einen Neuaufbau (Befund spur in ~3 s),
     verdeckt das einen kaputten ontrack, und A bliebe grün */
  const befunde = (h) => Object.keys(h || {}).filter((k) => /^(spur|element|stumm|pause|still|rede|pakete)\d$/.test(k)).sort().map((k) => k + ":" + h[k]).join(",");
  const heilB = async () => NEU ? (await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA)).heil : null;
  const heilA0 = await heilB();
  for (let i = 0; i < ausloeser.length; i++) {
    if (i === 4) {
      console.log("     B: " + await mitspielen(B, true));
      /* die neue Stadt im Rahmen, wie spiel.js sie öffnet (lsAuf über das Dorfbild) */
      stadtWie = await B.evaluate(() => {
        try { window.DMA_SPIEL.pruef.setzen({ stadtNeu: true }); } catch (e) {}
        try { window.DMA_SPIEL.pruef.dorfBlickHtml(window.DMA_SPIEL.pruef.zustand().ich); } catch (e) {}
        return "lsAuf";
      });
      let da = false;
      for (let k = 0; k < 60 && !da; k++) { da = await B.evaluate(() => { const f = document.querySelector(".sp-lstadt iframe"); try { return Boolean(f && f.contentDocument && f.contentDocument.readyState === "complete"); } catch (e) { return false; } }); if (!da) await schlaf(250); }
      if (!da) {   // Ersatz wie im Versuch: derselbe Rahmen, von Hand
        stadtWie = "von Hand";
        await B.evaluate(() => { const el = document.createElement("div"); el.className = "sp-lstadt"; el.innerHTML = '<iframe class="sp-ls-rahmen" src="stadt-leicht.html?eingebettet=1&mini=1" allow="fullscreen; microphone; autoplay"></iframe>'; document.body.appendChild(el); });
        await schlaf(4000);
      }
      console.log("     Stadt im Rahmen: " + stadtWie + (da ? " (geladen)" : ""));
    }
    const vorB = await pcZahl(B);
    const t0 = Date.now();
    const x = await ausloeser[i][1]();
    /* Fristen 8 s / 10 s statt 4 s / 6 s: unter Last (zwei Sonden gleichzeitig) kam die neue Leitung bei A1 öfter erst
       nach 4 s, obwohl B danach nach ~1 s hörte – die Frist war zu eng, nicht der Code (Gesamtlauf 884). */
    const neu = await neueLeitung(vorB, 8000);
    const [hb, ha] = await Promise.all([bisHoert(B, 10000 - (Date.now() - t0)), bisHoert(A, 10000 - (Date.now() - t0))]);
    if (hb.ms < 0) taub++;
    await schlaf(300);
    const sl = await spurLage();
    if (!(sl.n === 1 && sl.istR)) spurFalsch++;
    sage(neu && hb.ms >= 0 && ha.ms >= 0, "A" + (i + 1) + " " + ausloeser[i][0] + ": neue Leitung, B hört A, A hört B",
      (x ? "[" + String(x).slice(0, 40) + "] " : "") + "neu=" + neu + " · B " + zeige(hb) + " · A " + zeige(ha));
    sage(sl.n === 1 && sl.istR, "B" + (i + 1) + " genau eine Tonspur in A's Strom, und sie ist die lebende Empfangsspur", JSON.stringify(sl));
    await schlaf(800);
  }
  console.log("     taub: " + taub + " von 6, Spur falsch: " + spurFalsch + " von 6");
  const heilA1 = await heilB();
  sage(NEU && befunde(heilA1) === befunde(heilA0), "A: über alle sechs Neuaufbauten greift die Wache bei B nicht ein (Befund-Zähler unverändert)",
    NEU ? "vorher {" + befunde(heilA0) + "} · nachher {" + befunde(heilA1) + "}" : "Prüfhaken fehlt (alter Stand)");
  await schlaf(1800);   // Bericht „leitung" geht 1,5 s nach „connected"
  const leitB = await B.evaluate(() => window.__berichte.filter((b) => b.art === "leitung").map((b) => JSON.stringify(b.d)));
  const gleichZahl = leitB.filter((s) => /tonGleicheKennung/.test(s)).length;
  sage(gleichZahl >= 1, "B: der Bericht „leitung“ trägt „tonGleicheKennung“ (der Auslöser wird gezählt)", gleichZahl + " von " + leitB.length + " Berichten");

  /* ============================================================== C */
  /* Für jeden der folgenden Schritte muss B A hören. Im alten Stand bleibt B nach einem tauben Schritt taub; dann
     stellt die Sonde mit dem Ton-Knopf auf B zurück (heilt laut Versuch 310, K7) – so wird jeder Fall an seinem
     eigenen Befund gemessen. Im neuen Stand tut zurueck() nichts (B hört). */
  async function zurueck(wo) {
    if ((await bisHoert(B, 3000)).ms >= 0) return;
    await B.evaluate(() => window.LiveChat.tonNeuAufbauen());
    const r = await bisHoert(B, 12000);
    console.log("     (Sonde stellt vor " + wo + " zurück: Ton-Knopf auf B → " + zeige(r) + ")");
    await schlaf(2600);
  }

  console.log("\nC) STUFE 1 – VON AUSSEN GESTÖRT, DIE WACHE HEILT UNSICHTBAR\n");
  await schlaf(2600);
  const stand = async () => ({ pa: await pcZahl(A), pb: await pcZahl(B), angA: gesendet.A.filter((p) => p.art === "angebot").length, angB: gesendet.B.filter((p) => p.art === "angebot").length,
    zeilen: await B.evaluate(() => window.LiveChat.lage().nachrichten.length), toasts: await B.evaluate(() => window.__toasts) });
  const twVorC = await B.evaluate(() => window.__berichte.filter((b) => b.art === "ton-weg").length);
  const stoeren = (wie) => B.evaluate(([ida, wie]) => {
    const p = window.LiveChat.lage().plaetze.find((x) => x.id === ida);
    if (!p || !p.strom) return "kein Strom";
    const R = p.strom.getAudioTracks()[0];
    const a = Array.from(document.querySelectorAll("audio")).find((x) => x.srcObject === p.strom);
    if (wie === "spur") { if (!R) return "keine Spur"; const k = R.clone(); k.stop(); p.strom.removeTrack(R); p.strom.addTrack(k); return "Spur heraus, toter Klon hinein"; }
    if (!a) return "kein Element";
    if (wie === "stumm") { a.muted = true; return "Element stumm"; }
    if (wie === "element") { a.srcObject = new MediaStream(); return "Element an leerem Strom"; }
  }, [IDA, wie]);
  const cDiff = { leitung: 0, angebot: 0, zeilen: [], toasts: 0 };
  for (const wie of ["spur", "stumm", "element"]) {
    await zurueck("C-" + wie);
    const s0 = await stand();
    const was = await stoeren(wie);
    await schlaf(300);
    const vorher = await hoertJetzt(B);
    const h = await bisHoert(B, 5500);
    sage(h.ms >= 0, "C-" + wie + ": " + was + " → binnen 5,5 s wieder hörbar", "gestört: " + (vorher.ok ? "hörte noch" : "still") + " · " + zeige(h));
    await schlaf(wie === "spur" ? 3500 : 600);   // nach der Heilung einen Takt für den Bericht
    const s1 = await stand();
    cDiff.leitung += (s1.pa - s0.pa) + (s1.pb - s0.pb); cDiff.angebot += (s1.angA - s0.angA) + (s1.angB - s0.angB); cDiff.toasts += s1.toasts - s0.toasts;
    if (s1.zeilen > s0.zeilen) cDiff.zeilen.push(...await B.evaluate((n) => window.LiveChat.lage().nachrichten.slice(n).map((z) => String(z.text || "").slice(0, 70)), s0.zeilen));
  }
  sage(cDiff.leitung === 0 && cDiff.angebot === 0, "C: keine neue Leitung, kein Angebot", JSON.stringify({ leitung: cDiff.leitung, angebot: cDiff.angebot }));
  sage(cDiff.zeilen.length === 0 && cDiff.toasts === 0, "C: keine neue Chat-/Systemzeile, kein Toast (unsichtbar)",
    JSON.stringify(cDiff.zeilen) + " · play-Fehler: " + JSON.stringify(await B.evaluate(() => (window.__playFehler || []).slice(0, 3).map((x) => x.slice(0, 90)))));
  const twC = await B.evaluate(() => window.__berichte.filter((b) => b.art === "ton-weg").map((b) => b.d));
  sage(twC.length === twVorC + 1 && twC[twC.length - 1] && twC[twC.length - 1].befund === "spur" && twC[twC.length - 1].geheilt === 1,
    "C: genau EIN „ton-weg“ (Befund spur, geheilt 1, Stufe 1); stumm/element nur gezählt", JSON.stringify(twC.map((d) => d && { befund: d.befund, stufe: d.stufe, geheilt: d.geheilt, nachMs: d.nachMs })));
  const peC = NEU ? await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA) : null;
  sage(Boolean(peC && peC.heil.spur1 >= 1 && peC.heil.stumm1 >= 1), "C: die Wache hat gezählt (spur1, stumm1 …)", JSON.stringify(peC && peC.heil));

  /* ============================================================== D */
  await zurueck("D");
  console.log("\nD) STUFE 3 – A's TONSENDER LEER, A SPRICHT\n");
  const senderLeer = (an) => A.evaluate(async (an) => {
    const offen = window.__pcs.filter((pc) => pc.signalingState !== "closed"), pc = offen[offen.length - 1];
    const tr = pc.getTransceivers().find((t) => t.receiver && t.receiver.track && t.receiver.track.kind === "audio");
    if (!an) { window.__spurAlt = tr.sender.track; await tr.sender.replaceTrack(null); return "leer"; }
    return tr.sender.track ? "liegt" : "fehlt";
  }, an);
  await B.evaluate((ida) => window.LiveChat.pruefEmpfangen({ art: "stumm", von: ida, tonAn: false }), IDA);
  console.log("     A-Sender: " + await senderLeer(false));
  await A.evaluate(() => window.LiveChat.pruefSelbstSpricht(true));
  const twVorD = gesendet.B.filter((p) => p.art === "tonweg").length;
  await schlaf(7500);
  sage(gesendet.B.filter((p) => p.art === "tonweg").length === twVorD, "D Kontrolle: A meldet „stumm tonAn:false“ → B schickt KEIN „tonweg“");
  await B.evaluate((ida) => window.LiveChat.pruefEmpfangen({ art: "stumm", von: ida, tonAn: true }), IDA);
  await A.evaluate(() => { window.LiveChat.pruefSelbstSpricht(false); window.LiveChat.pruefSelbstSpricht(true); });
  const tD = Date.now();
  let twD = -1;
  const hD = await (async () => { const r = await bisHoert(B, 15000); return r; })();
  const twListe = gesendet.B.filter((p) => p.art === "tonweg");
  if (twListe.length > twVorD) twD = twListe[twListe.length - 1].t - tD;
  sage(twListe.length > twVorD, "D: B schickt „tonweg“ an A", twD >= 0 ? "nach " + twD + " ms (Befund " + twListe[twListe.length - 1].b + ")" : "nie");
  sage(hD.ms >= 0, "D: A legt die Spur zurück (oder baut neu auf), B hört A binnen 15 s", zeige(hD) + " · A-Sender " + await senderLeer(true));
  const peD = NEU ? await A.evaluate((idb) => window.LiveChat.pruefEmpfang(idb), IDB) : null;
  console.log("     A zählt: " + JSON.stringify(peD && peD.heil));
  await A.evaluate(() => window.LiveChat.pruefSelbstSpricht(false));
  if (hD.ms < 0) { await A.evaluate(async () => { const offen = window.__pcs.filter((pc) => pc.signalingState !== "closed"), pc = offen[offen.length - 1]; const tr = pc.getTransceivers().find((t) => t.receiver && t.receiver.track && t.receiver.track.kind === "audio"); if (!tr.sender.track && window.__spurAlt) await tr.sender.replaceTrack(window.__spurAlt); }); await schlaf(1500); }

  /* ============================================================== E */
  console.log("\nE) STUFE 2 – PAKETE OHNE WIEDERGABE (nur neue Fassung, Prüfhaken)\n");
  let eOk = false, eInfo = "Prüfhaken fehlt (alter Stand)";
  if (NEU) {
    await schlaf(3000);
    const el0 = (await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA)).el;
    await B.evaluate((ida) => window.LiveChat.pruefEmpfangFaelschen(ida, { sm: 0, n: 4 }), IDA);
    let pe = null; const t0 = Date.now();
    while (Date.now() - t0 < 16000) { pe = await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA); if ((pe.heil.still2 || 0) >= 1) break; await schlaf(300); }
    const h = await bisHoert(B, 6000);
    const pe2 = await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA);
    eOk = (pe2.heil.still1 || 0) >= 1 && (pe2.heil.still2 || 0) >= 1 && pe2.el !== el0 && h.ms >= 0;
    eInfo = "still1 " + (pe2.heil.still1 || 0) + ", still2 " + (pe2.heil.still2 || 0) + ", Element " + el0 + " → " + pe2.el + " · danach " + zeige(h) + " (nach " + (Date.now() - t0) + " ms)";
  }
  sage(eOk, "E: erst neu angehängt (Stufe 1), dann ein anderes Element (Stufe 2), danach hört B", eInfo);

  /* ============================================================== F */
  console.log("\nF) PLAN B – STRENGE WEBVIEW: play() NUR IN EINER ECHTEN GESTE\n");
  for (const wo of ["Seite", "Stadt"]) {
    await B.evaluate(() => { window.__streng = true; window.__abgelehnt = 0; });
    const vorB = await pcZahl(B);
    await hallo("f-" + wo);
    await neueLeitung(vorB, 4000);
    await schlaf(3500);
    const still = await hoertJetzt(B);
    const abgelehnt = await B.evaluate(() => window.__abgelehnt);
    let ziel = null;
    if (wo === "Seite") ziel = { x: 180, y: 60 };
    else {
      ziel = await B.evaluate(() => {
        const ls = document.querySelector(".sp-lstadt"); if (!ls) return null;
        const st = document.createElement("style");
        st.textContent = ".sp-lstadt{position:fixed!important;left:20px!important;top:420px!important;width:300px!important;height:180px!important;visibility:visible!important;display:block!important;z-index:2147483000!important;transform:none!important}.sp-lstadt iframe{width:300px!important;height:180px!important;visibility:visible!important}";
        document.head.appendChild(st);
        return { x: 170, y: 510 };
      });
      await schlaf(300);
    }
    if (!ziel) { sage(false, "F2: keine Stadt im Rahmen"); continue; }
    const imRahmen = wo === "Stadt" ? await B.evaluate(([x, y]) => { const t = document.elementFromPoint(x, y); return t ? t.tagName : "nichts"; }, [ziel.x, ziel.y]) : "";
    await B.touchscreen.tap(ziel.x, ziel.y);
    const h = await bisHoert(B, 1500);
    sage(!still.ok && abgelehnt > 0 && h.ms >= 0, "F" + (wo === "Seite" ? "1" : "2") + ": nach dem Neuaufbau still (play abgelehnt), ein Fingertipp " + (wo === "Seite" ? "auf die Seite" : "in die Stadt im Rahmen") + " → binnen 1,5 s hörbar",
      "vorher " + (still.ok ? "hörte" : "still") + ", abgelehnt " + abgelehnt + (imRahmen ? ", Tipp traf " + imRahmen : "") + " · " + zeige(h));
    await B.evaluate(() => { window.__streng = false; });
    if (h.ms < 0) { await B.touchscreen.tap(180, 60); await schlaf(800); }
  }

  /* ============================================================== G */
  console.log("\nG) „NUR MITSPIELER HÖREN“ – DIE WACHE ENTSTUMMT NICHT\n");
  await zurueck("G");
  await B.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.nurSpieler = true; window.DMA_SPIEL.pruef.hoerFilterPflegen(true); });
  await A.evaluate(() => window.LiveChat.pruefSelbstSpricht(true));
  await schlaf(6500);
  const gStumm = await B.evaluate(() => { const r = window.__ton(); return r; });
  const gFilt = await B.evaluate(() => window.LiveChat.hoerFilterStand ? window.LiveChat.hoerFilterStand() : null);
  sage(gStumm.stumm >= 1 && gStumm.spielt === 0, "G: B spielt mit, A nicht → A bleibt bei B stumm (6,5 s, die Wache greift nicht ein)", JSON.stringify({ stumm: gStumm.stumm, spielt: gStumm.spielt }));
  sage(Boolean(gFilt && gFilt.an === 1 && gFilt.stumm === 1 && gFilt.redet >= 1 && gFilt.haeu === 1 && gFilt.nur === 1 && gFilt.spielt === 1),
    "G: hoerFilterStand zählt (an 1, stumm 1, redet ≥ 1, haeu 1, nur 1, spielt 1)", JSON.stringify(gFilt));
  await A.evaluate(() => window.LiveChat.pruefSelbstSpricht(false));
  await B.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.nurSpieler = false; window.DMA_SPIEL.pruef.hoerFilterPflegen(true); });
  const gAus = await bisHoert(B, 4000);
  sage(gAus.ms >= 0, "G: Schalter aus → B hört A wieder", zeige(gAus));

  /* ============================================================== H */
  console.log("\nH) BERICHTE\n");
  await B.evaluate(() => window.LiveChat.pruefAufbauSenden && window.LiveChat.pruefAufbauSenden());
  await schlaf(300);
  const berB = await B.evaluate(() => window.__berichte.filter((b) => b.name === "spiel_diagnose_senden").map((b) => ({ art: b.art, d: b.d })));
  const berA = await A.evaluate(() => window.__berichte.filter((b) => b.name === "spiel_diagnose_senden").map((b) => ({ art: b.art, d: b.d })));
  const alle = berB.concat(berA);
  const gross = Math.max(0, ...alle.map((b) => jsonbText(b.d).length));
  sage(gross > 0 && gross < 6000, "H: alle Berichte < 6000 Zeichen (jsonb, wie der Server misst)", "längster " + gross + " · Arten " + JSON.stringify([...new Set(alle.map((b) => b.art))]));
  const tw = alle.filter((b) => b.art === "ton-weg");
  sage(tw.length >= 1 && tw.every((b) => !/Emy|Xander/.test(JSON.stringify(b.d))), "H: „ton-weg“ ohne Anzeigenamen", tw.length + " Berichte");
  const twd = tw[0] && tw[0].d;
  sage(Boolean(twd && ["mit", "befund", "stufe", "geheilt", "nachMs", "ms", "dpk", "dsm", "den", "rx", "el", "soll", "grund", "spricht", "spiel", "heil", "sichtbar", "fassung", "ua"].every((k) => k in twd)),
    "H: „ton-weg“ trägt alle Felder", twd ? JSON.stringify(twd).slice(0, 260) : "keiner");
  const vb = berB.filter((b) => b.art === "verbindung").pop();
  const vbJe = vb && vb.d && vb.d.ton && vb.d.ton.je && vb.d.ton.je[IDA];
  sage(Boolean(vb && vb.d.heil && vb.d.filt && vbJe && typeof vbJe.sm === "number"), "H: „verbindung“ trägt heil, filt und je Leitung sm",
    vb ? JSON.stringify({ heil: vb.d.heil, filt: vb.d.filt, sm: vbJe && vbJe.sm }) : "keiner");
  const ts = await B.evaluate(() => { try { return window.DMA_SPIEL.pruef.zustand().nurSpieler; } catch (e) { return null; } });
  console.log("     (tonstand geht erst nach 1 min Spiel – hier nicht abgewartet; nurSpieler jetzt " + ts + ")");

  /* ============================================================== J */
  console.log("\nJ) BROWSER OHNE MESSGRÖSSE – DIE WACHE ERNEUERT KEINE GESUNDE LEITUNG (Nachbesserung 1)\n");
  /* Wie im Versuch der Prüfung (ohnesm.js): B's getStats ohne totalSamplesReceived bzw. ohne totalAudioEnergy. Im
     Stand e704342 zählte die Wache das Fehlende als 0: Stufe 1 nach 10 s, Stufe 2 nach 15 s, Stufe 3 nach 25 s. Die
     Sonde misst „hört" weiter mit dem echten getStats (__getStats0). */
  const ohne = (feld) => B.evaluate((feld) => {
    const P = window.RTCPeerConnection.prototype;
    if (!feld) { delete P.getStats; return "getStats wieder vollständig"; }
    const gs = Object.getPrototypeOf(P).getStats;   // der Zähler aus HAKEN
    P.getStats = function () {
      return gs.apply(this, arguments).then((r) => {
        const m = new Map();
        r.forEach((v, k) => { if (v.type === "inbound-rtp" && v.kind === "audio") { const c = Object.assign({}, v); delete c[feld]; m.set(k, c); } else m.set(k, v); });
        return m;
      });
    };
    return "getStats ohne " + feld;
  }, feld);
  const twZahl = () => gesendet.A.concat(gesendet.B).filter((p) => p.art === "tonweg").length;
  await zurueck("J");
  await A.evaluate(() => window.LiveChat.pruefSelbstSpricht(false));
  await schlaf(2600);
  for (const [feld, redet] of [["totalSamplesReceived", false], ["totalAudioEnergy", true]]) {
    const j0 = { pa: await pcZahl(A), pb: await pcZahl(B), tw: twZahl(), heil: await heilB() };
    console.log("     B: " + await ohne(feld) + (redet ? ", A redet" : ""));
    if (redet) await A.evaluate(() => window.LiveChat.pruefSelbstSpricht(true));
    await schlaf(15000);
    const j1 = { pa: await pcZahl(A), pb: await pcZahl(B), tw: twZahl(), heil: await heilB() };
    const hj = await bisHoert(B, 3000);
    if (redet) await A.evaluate(() => window.LiveChat.pruefSelbstSpricht(false));
    await ohne("");
    sage(j1.pa === j0.pa && j1.pb === j0.pb && j1.tw === j0.tw && befunde(j1.heil) === befunde(j0.heil) && hj.ms >= 0,
      "J: gesunde Leitung, 15 s ohne " + feld + (redet ? " (A redet)" : "") + " → keine Heilung, keine neue Leitung, kein „tonweg“, B hört A",
      JSON.stringify({ leitungen: (j1.pa - j0.pa) + (j1.pb - j0.pb), tonweg: j1.tw - j0.tw, befunde: befunde(j1.heil) }) + " · " + zeige(hj));
    if (j1.pb !== j0.pb || befunde(j1.heil) !== befunde(j0.heil)) await zurueck("J (weiter)");
    await schlaf(2600);
  }
  /* „hört wieder" ohne Samples: eine gestörte Spur heilt (Befund spur), und der Vorfall schliesst im nächsten Takt */
  let jHeil = "Prüfhaken fehlt (alter Stand)", jOk = false;
  if (NEU) {
    await ohne("totalSamplesReceived");
    const was = await stoeren("spur");
    const t0 = Date.now(), h = await bisHoert(B, 6000);
    let pe = null;
    while (Date.now() - t0 < 10000) { pe = await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA); if (!pe.vorfall && pe.stufe === 0 && h.ms >= 0) break; await schlaf(300); }
    await ohne("");
    jOk = h.ms >= 0 && Boolean(pe) && !pe.vorfall && pe.stufe === 0;
    jHeil = was + " → " + zeige(h) + " · Vorfall " + (pe && pe.vorfall ? JSON.stringify({ befund: pe.vorfall.befund, stufe: pe.vorfall.stufe }) : "geschlossen") + " nach " + (Date.now() - t0) + " ms";
  }
  sage(jOk, "J: ohne totalSamplesReceived heilt eine gestörte Spur, und der Vorfall schliesst („hört wieder“ ohne Samples)", jHeil);

  /* ============================================================== K */
  console.log("\nK) STUFE 3 VON DER KLEINEREN KENNUNG – BEI B EIN VERALTETES „A HÖRT MICH ÜBER DEN TONSERVER“ (Nachbesserung 1)\n");
  /* B glaubt, A höre ihn über den Tonserver (sfu.hoertMich[A], etwa nach einem verlorenen „sfu-hoere nein") und schickt
     A übers Netz eine leere Tonspur. B redet. A (kleinere Kennung) bekommt 0 Pakete → Befund „pakete" → Stufe 3. Bisher
     baute A nur neu auf – B's spurenNachtragen legte die leere Spur gleich wieder hin. Jetzt sagt A vorher „tonweg",
     und B räumt hoertMich auf. */
  await zurueck("K");
  await schlaf(2600);
  const kHaken = await B.evaluate((ida) => window.LiveChat.pruefEmpfangFaelschen ? window.LiveChat.pruefEmpfangFaelschen(ida, { hoertMich: true }) : null, IDA);
  if (kHaken !== "hoertMich") {
    await B.evaluate((ida) => window.LiveChat.pruefEmpfangFaelschen && window.LiveChat.pruefEmpfangFaelschen(ida, null), IDA);
    sage(false, "K: Prüfhaken hoertMich fehlt (Stand vor der Nachbesserung)");
  } else {
    await schlaf(1200);
    const kVor = await hoertJetzt(A);
    const pa0 = await pcZahl(A), twA0 = gesendet.A.filter((p) => p.art === "tonweg").length;
    const heilBK0 = await heilB();
    await B.evaluate(() => window.LiveChat.pruefSelbstSpricht(true));
    const t0 = Date.now();
    let neu = false;
    while (Date.now() - t0 < 15000 && !neu) { neu = (await pcZahl(A)) > pa0; if (!neu) await schlaf(100); }
    const tNeu = Date.now() - t0;
    const hK = await bisHoert(A, Math.max(3000, 20000 - (Date.now() - t0)));
    const twA = gesendet.A.filter((p) => p.art === "tonweg").slice(twA0);
    const heilBK1 = await heilB();
    const peA = await A.evaluate((idb) => window.LiveChat.pruefEmpfang(idb), IDB);
    sage(!kVor.ok, "K Vorbedingung: B's Netz-Tonspur zu A ist leer → A hört B nicht", JSON.stringify(kVor.d));
    sage(twA.length >= 1 && twA[0].an === IDB && neu, "K: A (kleinere Kennung) schickt „tonweg“ an B und baut die Leitung neu",
      "tonweg " + twA.length + (twA[0] ? " (Befund " + twA[0].b + ", nach " + (twA[0].t - t0) + " ms)" : "") + " · neue Leitung " + (neu ? "nach " + tNeu + " ms" : "nie"));
    sage((heilBK1.tonwegServer || 0) > ((heilBK0 && heilBK0.tonwegServer) || 0) && hK.ms >= 0, "K: B räumt „hört mich über den Tonserver“ auf, A hört B binnen 20 s",
      "B tonwegServer " + ((heilBK0 && heilBK0.tonwegServer) || 0) + " → " + (heilBK1.tonwegServer || 0) + " · A " + zeige(hK) + " · A zählt " + JSON.stringify(peA.heil));
    await B.evaluate(() => window.LiveChat.pruefSelbstSpricht(false));
    /* K2: In Chromium hilft schon der Neuaufbau allein (B's spurenNachtragen ruft sfuMeshTonAnwenden, solange
       replaceTrack(Mikrofon) noch läuft – sender.track ist dann noch null, „schon leer", nichts geschieht). Der veraltete
       Eintrag bleibt aber stehen und schlägt beim nächsten Spurwechsel bei B zu (Mikrofon nach Diktat/Sprachnachricht
       zurück, Bühne): spurTauschen legt zu A wieder eine LEERE Spur. Ohne „tonweg" von A: A wieder taub. */
    await B.evaluate(() => window.LiveChat.mikrofonLeihen());
    await schlaf(600);
    await B.evaluate(() => window.LiveChat.mikrofonZurueck());
    await schlaf(1500);
    const hK2 = await bisHoert(A, 8000);
    const sfuB = await B.evaluate(() => window.LiveChat.pruefSfu({}).hoertMich);
    sage(hK2.ms >= 0 && sfuB.indexOf(IDA) < 0, "K: danach holt B sein Mikrofon zurück (Spurwechsel) → A hört B weiter, B führt A nicht mehr als „hört mich über den Tonserver“",
      "A " + zeige(hK2) + " · B hoertMich " + JSON.stringify(sfuB));
    await B.evaluate((ida) => window.LiveChat.pruefEmpfangFaelschen(ida, { hoertMich: false }), IDA);
    if (hK.ms < 0 || hK2.ms < 0) { await A.evaluate(() => window.LiveChat.tonNeuAufbauen()); await bisHoert(A, 12000); }
  }

  /* ============================================================== I */
  console.log("\nI) RUHE\n");
  await schlaf(2000);
  const i0 = { st: await B.evaluate(() => window.__statsZahl), heil: NEU ? JSON.stringify((await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA)).heil) : "" };
  await schlaf(10000);
  const i1 = { st: await B.evaluate(() => window.__statsZahl), heil: NEU ? JSON.stringify((await B.evaluate((ida) => window.LiveChat.pruefEmpfang(ida), IDA)).heil) : "" };
  sage(i1.st - i0.st <= 5, "I: B ruft getStats höchstens 5× in 10 s (eine Leitung, Takt 2,5 s – keine eigene Abfrage der Wache)", String(i1.st - i0.st));
  sage(i1.heil === i0.heil, "I: im Leerlauf keine Heilung", NEU ? i1.heil : "(alter Stand)");
  const sf = A.__fehler.concat(B.__fehler);
  sage(sf.length === 0, "I: keine Seitenfehler", JSON.stringify(sf.slice(0, 4)));

  laeuft = false;
  await schlaf(100);
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
