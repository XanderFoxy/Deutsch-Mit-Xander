/* =====================================================================
   SONDE RUNDE 99 — PSSST, UND WER FLUESTERT, IST FUER ALLE STUMM
   ---------------------------------------------------------------------
   XANDER (23.09.2026):
     „wenn man fluestert und eine Sprachnachricht schicken will, dass
      diese von einem PSSST angekuendigt wird."
     „dass ich ihn noch gehoert habe, waehrend er die Sprachnachricht
      geschickt hat."
   GEMESSEN (mit dem kuenstlichen Mikrofon des Browsers):
     1. Waehrend einer PRIVATEN Aufnahme ist die Live-Spur aus — und
        danach so an wie vorher.
     2. Eine OEFFENTLICHE Aufnahme laesst die Live-Spur in Ruhe.
     3. Beim Empfaenger kommt zuerst das Pssst, und die Stimme wird
        erst danach eingereiht.
     4. Die Tondatei ist wirklich ein Zischen: Schwerpunkt ueber 4 kHz.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};
(async () => {
  console.log("RUNDE 99 — Pssst, und wer fluestert, ist fuer alle stumm\n");

  /* 4 zuerst: die Datei selbst. */
  const roh = execFileSync("/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg",
    ["-v", "error", "-i", path.join(WURZEL, "ton", "pssst.opus"), "-f", "f32le", "-ac", "1",
     "-ar", "48000", "-"], { maxBuffer: 1 << 26 });
  const x = new Float32Array(roh.buffer, roh.byteOffset, Math.floor(roh.length / 4));
  /* Schwerpunkt ueber die Nulldurchgaenge — grob, aber ohne FFT: ein
     Zischen um 6 kHz kreuzt die Null rund 12000-mal je Sekunde. */
  let kreuz = 0;
  for (let i = 1; i < x.length; i++) if ((x[i - 1] < 0) !== (x[i] < 0)) kreuz++;
  const hz = kreuz / 2 / (x.length / 48000);
  sage(hz > 3500, "Die Datei zischt wirklich (Schwerpunkt ueber 3,5 kHz)",
    Math.round(hz) + " Hz, " + (x.length / 48000).toFixed(2) + " s");

  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  const ctx = await br.newContext();
  await ctx.grantPermissions(["microphone"]);
  const pg = await ctx.newPage();
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefEigenerStrom
    && window.DMA_GERAEUSCH, { timeout: 25000 });

  const stand = (privat) => pg.evaluate(async (pv) => {
    const leute = { b1: { id: "b1", name: "Bea", seit: 2000 } };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: leute });
    window.LiveChat.privatSetzen(pv ? "Bea" : null);
    const live = await navigator.mediaDevices.getUserMedia({ audio: true });
    window.LiveChat.pruefEigenerStrom(live, true);
    const spur = live.getAudioTracks()[0];
    const vorher = spur.enabled;
    await window.LiveChat.pruefAufnahmeStarten();
    await new Promise((f) => setTimeout(f, 400));
    const waehrend = spur.enabled;
    await window.LiveChat.pruefAufnahmeStoppen();
    await new Promise((f) => setTimeout(f, 200));
    const nachher = spur.enabled;
    window.LiveChat.privatSetzen(null);
    return { vorher, waehrend, nachher };
  }, privat);

  console.log("\n1  DIE LIVE-SPUR BEIM FLUESTERN\n");
  const p = await stand(true);
  sage(p.vorher === true && p.waehrend === false,
    "Waehrend der privaten Aufnahme ist das Live-Mikrofon AUS",
    "vorher " + p.vorher + ", waehrend " + p.waehrend);
  sage(p.nachher === true, "Danach ist es wieder an", "nachher " + p.nachher);
  const o = await stand(false);
  sage(o.waehrend === true, "Eine oeffentliche Aufnahme laesst es in Ruhe",
    "waehrend " + o.waehrend);

  console.log("\n2  BEIM EMPFAENGER: ERST PSSST, DANN DIE STIMME\n");
  const e = await pg.evaluate(async () => {
    window.DMA_TONLOG = [];
    window.LiveChat.pruefWarteschlangeLeeren();
    const t0 = performance.now();
    window.LiveChat.pruefPostEmpfangen({ art: "fluestersprachteil", id: "f99", nr: 0, anzahl: 1,
      teil: "data:audio/webm;base64,AAAA", von: "b1", vonName: "Bea", sprachSek: 2 });
    const direkt = window.LiveChat.pruefWarteschlange().length;
    await new Promise((f) => setTimeout(f, 1000));
    const toene = (window.DMA_TONLOG || []).map((t) => ({ name: t.name, nach: Math.round(t.wann - t0) }));
    return { direkt: direkt, toene: toene,
             spaeter: window.LiveChat.pruefWarteschlange().length };
  });
  const ps = e.toene.find((t) => t.name === "pssst");
  sage(Boolean(ps), "Das Pssst ertoent", ps ? ps.nach + " ms nach dem Eintreffen" : "gar nicht");
  sage(e.direkt === 0 && e.spaeter >= 0,
    "Die Stimme wird NICHT sofort eingereiht (erst nach dem Pssst)",
    "sofort " + e.direkt + " in der Warteschlange");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
