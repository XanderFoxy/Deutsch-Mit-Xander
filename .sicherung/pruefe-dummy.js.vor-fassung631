#!/usr/bin/env node
/* =====================================================================
   SONDE — DER DUMMY SPIELT MIT (Funk 100)
   ---------------------------------------------------------------------
   XANDER: „Kannst du mir den Dummy so machen dass ich mit ihm Schiffe
   testen … dass er eigenes Spielzüge macht … und auch das mit dem
   Kampfsystem kann ich das mit dem Dummy testen wenn ich ihn irgendwo
   hin treffe oder das ja zufällig Punkte so an meinem Profilbild
   aussucht wo er mir hinschießt dass ich sehen kann ob das
   funktioniert."
   Geprüft, im echten Raum mit „Puppe" und „Dummy":
     KAMPF
       · Tipp oben mittig auf die Puppe = Kopfschuss, −16, Balken sinkt;
         der Server wird dafür NICHT gefragt, nichts geht an den Raum
       · Übungsduell: die Puppe schießt auf zufällige Punkte meines
         Bildes, rote Zahlen bei mir, Übungs-LP sinken, die echten nicht
       · wer vor dem Einschlag den Platz wechselt, weicht aus
     SCHIFFE VERSENKEN
       · nach /versenken ist Verstecken dran (nicht schon Schießen)
       · beide Puppen sind sofort versteckt
       · nach meinem Schuss schießen Puppe und Dummy selbst, dann bin
         ich wieder dran
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const konsolenFehler = [];
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 25000 });

  await pg.evaluate(() => {
    const leute = {
      uebungspuppe: { id: "uebungspuppe", name: "Puppe", seit: 5000, gesehen: 9e15, buehne: true, bild: "" },
      uebungspuppe2: { id: "uebungspuppe2", name: "Dummy", seit: 6000, gesehen: 9e15, buehne: true, bild: "" }
    };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000";
    window.LiveChat.spielIdVon = () => "";
    const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 50, pflaster: 3, traenke: 0, waffen: ["zwille", "bogen", "laser"], mission: null };
    window.__rufe = [];
    window.__raus = [];
    window.LiveChat.pruefAbfangen((p) => { window.__raus.push(p); });
    const klient = { rpc: (name, args) => {
      window.__rufe.push(name);
      const data = name === "spiel_ich" ? ich : name === "spiel_stand" ? [ich] : { ok: true };
      return Promise.resolve({ data: data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich,
      stand: { [ichId]: ich }, letzterAbruf: Date.now() });
    window.__ichEcht = ich;
  });
  await pg.waitForTimeout(700);

  console.log("\nKAMPF: ICH TREFFE DIE PUPPE\n");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.setzen({ waffe: "bogen" }); window.__rufe.length = 0; window.__raus.length = 0; });
  const kreis = await pg.evaluate(() => {
    const r = document.querySelector('.lc-platz[data-lc-id="uebungspuppe"] .lc-kreis').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 - 0.3 * r.height / 2 };
  });
  await pg.mouse.click(kreis.x, kreis.y);
  await pg.waitForTimeout(250);
  const zahlText = await pg.evaluate(() => { const z = document.querySelector('.lc-platz[data-lc-id="uebungspuppe"] .sp-zahl'); return z ? z.textContent : ""; });
  await pg.waitForTimeout(900);
  const nachTreffer = await pg.evaluate(() => {
    const st = window.DMA_SPIEL.pruef.zustand().stand["puppe:uebungspuppe"];
    const bal = document.querySelector('.lc-platz[data-lc-id="uebungspuppe"] .sp-lp-voll');
    return { lp: st && st.lp, balken: bal ? bal.style.width : "", rufe: window.__rufe.slice(), raus: window.__raus.map((p) => p.art + ":" + (p.ereignis || "")) };
  });
  const zahlDanach = await pg.evaluate(() => [...document.querySelectorAll('.sp-zahl')].map((z) => z.textContent).join(" | "));
  sage(nachTreffer.lp === 84, "Kopfschuss auf die Puppe: 100 → 84", "LP " + nachTreffer.lp + ", Zahl „" + (zahlText || zahlDanach) + "“");
  sage(parseFloat(nachTreffer.balken) === 84, "ihr Lebensbalken sinkt", nachTreffer.balken);
  sage(!nachTreffer.rufe.includes("spiel_treffer"), "der Server wird für die Puppe nicht gefragt", nachTreffer.rufe.join(","));
  sage(!nachTreffer.raus.some((r) => /spiel/.test(r)), "nichts geht an den Raum", nachTreffer.raus.join(","));

  console.log("\nKAMPF: DIE PUPPE SCHIESST ZURÜCK (ÜBUNGSDUELL)\n");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.setzen({ waffe: "" }); window.DMA_SPIEL.uebungStarten("uebungspuppe"); });
  const zonen = [];
  for (let i = 0; i < 6; i++) {
    const vor = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().uebung.lp);
    await pg.evaluate(() => { clearTimeout(window.DMA_SPIEL.pruef.zustand().puppeUhr); window.DMA_SPIEL.pruef.puppeSchiesst(); });
    let text = "";
    for (let t = 0; t < 30 && !text; t++) {
      await pg.waitForTimeout(80);
      text = await pg.evaluate(() => { const z = document.querySelector('.lc-platz[data-lc-id="ich"] .sp-zahl'); return z ? z.textContent : ""; });
    }
    const nach = await pg.evaluate(() => (window.DMA_SPIEL.pruef.zustand().uebung || {}).lp);
    zonen.push(text + " (" + vor + "→" + nach + ")");
    await pg.waitForTimeout(1500);
    if (nach === undefined) break;
  }
  console.log("       " + zonen.join("  ·  "));
  sage(zonen.some((z) => /−\d+/.test(z)), "rote Zahlen an meinem Bild", zonen.length + " Schüsse");
  const echt = await pg.evaluate(() => ({ lp: window.__ichEcht.lp, rufe: window.__rufe.filter((r) => r !== "spiel_stand" && r !== "spiel_ich") }));
  sage(echt.lp === 100 && echt.rufe.length === 0, "meine echten Lebenspunkte bleiben, kein Serverruf", "LP " + echt.lp + " " + echt.rufe.join(","));
  const bildschirm = path.join("/tmp/claude-0", "dummy-duell.png");
  await pg.screenshot({ path: bildschirm });

  console.log("\nKAMPF: AUSWEICHEN\n");
  await pg.evaluate(() => { window.DMA_SPIEL.uebungEnde(); window.DMA_SPIEL.uebungStarten("uebungspuppe"); });
  await pg.evaluate(() => {
    clearTimeout(window.DMA_SPIEL.pruef.zustand().puppeUhr);
    window.DMA_SPIEL.pruef.puppeSchiesst();
    const frei = window.LiveChat.lage().plaetze.find((p) => p.leer);
    window.LiveChat.platzNehmen(frei.nummer);
  });
  let ausw = "";
  for (let t = 0; t < 30 && !/ausgewichen/.test(ausw); t++) {
    await pg.waitForTimeout(80);
    ausw = await pg.evaluate(() => [...document.querySelectorAll(".sp-zahl")].map((z) => z.textContent).join("|"));
  }
  sage(/ausgewichen/.test(ausw), "Platz gewechselt vor dem Einschlag = ausgewichen", ausw);
  await pg.evaluate(() => window.DMA_SPIEL.uebungEnde());

  console.log("\nSCHIFFE VERSENKEN MIT PUPPE UND DUMMY\n");
  await pg.evaluate(() => window.LiveChat.pruefBefehl("/versenken"));
  await pg.waitForTimeout(200);
  const start = await pg.evaluate(() => ({ phase: window.LiveChat.schiffeStand().phase, richter: window.LiveChat.schiffeRichterStand() }));
  sage(start.phase === "verstecken", "nach dem Start ist Verstecken dran", "Phase " + start.phase);
  sage(start.richter && start.richter.versteckt === 2 && start.richter.mitspieler === 3, "Puppe und Dummy sind sofort versteckt",
    JSON.stringify(start.richter));
  await pg.evaluate(() => window.LiveChat.schiffeWahl(1));
  await pg.waitForFunction(() => window.LiveChat.schiffeStand() && window.LiveChat.schiffeStand().phase === "schiessen", { timeout: 8000 });
  const los = await pg.evaluate(() => window.LiveChat.schiffeStand().dran);
  sage(los === "ich", "nach dem Countdown bin ich zuerst dran", los);
  /* Ich schieße auf ein Feld, auf dem sicher niemand liegt? Unbekannt —
     also auf Feld 16; trifft es, ist das auch richtig. */
  await pg.evaluate(() => window.LiveChat.schiffeWahl(16));
  await pg.waitForTimeout(200);
  const nachMir = await pg.evaluate(() => window.LiveChat.schiffeStand().dranName);
  let zuege = 0, ende = false;
  for (let t = 0; t < 80; t++) {
    await pg.waitForTimeout(100);
    const st = await pg.evaluate(() => { const s = window.LiveChat.schiffeStand(); return s ? { n: Object.keys(s.tafel).length, dran: s.dran, phase: s.phase } : null; });
    if (!st || st.phase === "aus") { ende = true; break; }
    zuege = st.n;
    if (st.dran === "ich" && st.n >= 2) break;
  }
  sage(/Puppe|Dummy/.test(nachMir), "nach meinem Schuss ist eine Puppe dran", nachMir);
  /* Mindestens ein Puppenschuss, und danach bin ich wieder dran (versenkt
     eine Puppe die andere, kommt nur EIN Puppenschuss zwischen meine). */
  sage(ende || zuege >= 2, "Puppe und Dummy schießen selbst (Schüsse auf dem Brett)", ende ? "Spiel schon zu Ende" : zuege + " Schüsse");
  const tafel = await pg.evaluate(() => { const s = window.LiveChat.schiffeStand(); return s ? s.text : "aus"; });
  console.log("       zuletzt: " + tafel);
  await pg.evaluate(() => window.LiveChat.pruefBefehl("/versenken aus"));

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " FEHLER" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
