/* PRÜFT, OB EIN BLOCKIERTER TON DEN RAUM ANHÄLT.
   ---------------------------------------------------------------
   GEFRAGT: „Bist du sicher, dass Emmy mich hören kann mit der
   Pseudovariante?"

   Der Browser lässt Ton erst durch, wenn die Person die Seite einmal
   berührt hat. Nachgestellt wird genau das: play() wird abgelehnt.
   Gemessen wird, ob die Reihe danach weiterläuft — also ob „fertig"
   irgendwann kommt. Tut es das nicht, bleibt liveLaeuftGerade stehen
   und im Fokus-Modus geht gar nichts mehr. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 430, height: 880 } });
  /* Jedes play() wird abgelehnt — wie bei einem Browser, der noch
     keine Berührung gesehen hat. */
  await pg.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () {
      return Promise.reject(new DOMException("blocked", "NotAllowedError"));
    };
    /* Damit NUR der Weg „play() abgelehnt" gemessen wird und nicht
       zufaellig der Ladefehler: onerror wird stillgelegt. */
    Object.defineProperty(HTMLMediaElement.prototype, "onerror", {
      configurable: true, get: function () { return null; }, set: function () {}
    });
  });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  const erg = await pg.evaluate(async () => {
    if (!window.LiveChat || !LiveChat.tonAusVorrat) return "LiveChat.tonAusVorrat fehlt";
    let fertig = false;
    const start = Date.now();
    document.querySelectorAll("audio").forEach((a) => { a.onerror = null; });
    const gestartet = LiveChat.tonAusVorrat(
      "ton/schrei.m4a",   // eine echte, ladbare Aufnahme
      () => { fertig = true; }, 0, 0);
    /* onerror wuerde ebenfalls freigeben — das waere aber nicht der
       Fall, den wir pruefen wollen. Deshalb wird er hier abgeklemmt,
       damit NUR der Weg „play() abgelehnt" uebrigbleibt. */
    /* Bis zu zehn Sekunden zusehen. */
    for (let i = 0; i < 100 && !fertig; i++) await new Promise((r) => setTimeout(r, 100));
    return { gestartet: gestartet, fertig: fertig, nachMs: Date.now() - start };
  });

  console.log("");
  if (typeof erg === "string") { console.log("  " + erg); }
  else {
    console.log("  Abspielen versucht: " + erg.gestartet);
    console.log("  Reihe lief weiter : " + (erg.fertig ? "ja, nach " + erg.nachMs + " ms" : "NEIN — der Raum bliebe stehen"));
    console.log("  " + (erg.fertig
      ? "Damit kann ein geblockter Ton den Fokus-Modus nicht mehr festfahren."
      : "FEHLER: liveLaeuftGerade bliebe gesetzt, niemand duerfte mehr sprechen."));
  }
  /* =================================================================
     RUNDE 100 — DIE EFFEKT-TOENE, WENN DER BROWSER NICHT SPIELEN LAESST
     -----------------------------------------------------------------
     XANDER (Walkie-Talkie): „Die Sounds der Profil-Effekte werden nicht
     immer bei allen anderen gehoert."
     Nachgestellt wie auf einem iPhone: jedes play() wird abgelehnt, und
     Web Audio ist gesperrt, bis jemand tippt. Erwartet:
       1. vor dem ersten Tipp steht der Knopf „Tippe hier …" da,
       2. ein Tipp nimmt ihn weg,
       3. danach klingt der naechste Effekt — ueber Web Audio.
     GEGENPROBE (Fassung vor 540): kein Knopf, kein Ton, nie.
     ================================================================= */
  console.log("\nEFFEKT-TOENE BEI GESPERRTEM ABSPIELEN (wie iPhone)\n");
  let fehlerWa = 0;
  const sageWa = (gut, was, dazu) => { if (!gut) fehlerWa++;
    console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
  const pg2 = await br.newPage({ viewport: { width: 390, height: 844 } });
  await pg2.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
    window.__getippt = false;
    document.addEventListener("pointerdown", () => { window.__getippt = true; }, true);
    Object.defineProperty(BaseAudioContext.prototype, "state",
      { get() { return window.__getippt ? "running" : "suspended"; } });
    window.__wa = 0;
    const st = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function () {
      if (this.buffer && this.buffer.length > 1) window.__wa++;
      return st.apply(this, arguments);
    };
    HTMLMediaElement.prototype.play = function () {
      return Promise.reject(new DOMException("blocked", "NotAllowedError"));
    };
  });
  await pg2.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg2.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEFUNG, { timeout: 25000 });
  await pg2.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg2.waitForTimeout(300);
  const tritt = async () => {
    await pg2.evaluate(() => window.DMA_PRUEFUNG.wirkung("tritt", "Bea", "Cem", {}));
    await pg2.waitForTimeout(1800);
    return pg2.evaluate(() => ({ wa: window.__wa, knopf: Boolean(document.querySelector(".lc-tonhinweis")) }));
  };
  const vor = await tritt();
  sageWa(vor.knopf && vor.wa === 0, "vor dem ersten Tipp: der Knopf „Tippe hier …“ steht da",
    vor.knopf ? "Knopf da" : "kein Knopf");
  const knopf = await pg2.$(".lc-tonhinweis");
  if (knopf) { await knopf.click(); await pg2.waitForTimeout(300); }
  sageWa(!(await pg2.$(".lc-tonhinweis")), "ein Tipp nimmt ihn weg");
  const nach = await tritt();
  sageWa(nach.wa >= 1, "danach klingt der naechste Effekt (ueber Web Audio)", nach.wa + " Ton(e)");
  console.log(fehlerWa ? "\n" + fehlerWa + " FEHLER" : "\nalles gruen");
  await br.close(); srv.close();
  process.exit(fehlerWa ? 1 : 0);
})();
