#!/usr/bin/env node
/* =====================================================================
   SONDE — KOPFHOERER IN DER LAENGE DES LIEDES, FARBIGE LIEDTEILE,
           WELLENFORM MIT ZWEI KLAMMERN (Funk 104)
   ---------------------------------------------------------------------
   XANDER, woertlich: „hast du eigentlich auch die Kopfhoerer
   ueberarbeitet dass sie in der Laenge des Liedes zu sehen sind und dass
   ich auch diese farbcodierten Lied Teile haben kann bzw nicht codiert
   aber farblich wie Buttons halt wie ich schon gesagt habe und hast du
   auch schon den w-form sample Ausschnitt so gewaehlt dass ich die
   Klammern auf flexibel noch ziehen kann ueber der w-form um so eine
   einfachere Auswahl fuer ein Lied Teil zu ermoeglichen."

   Geprueft wird im ECHTEN Klassenzimmer (LiveChat.pruefSitz +
   DMA_PRUEF.neuZeichnen), auf 390 x 844 wie ein Telefon, mit Finger UND
   Maus:
     1. Der Weg ist der echte: Musikwaehler fuer Bea -> Lied antippen ->
        der Ausschnittwaehler.
     2. Die Liedteile sind farbige Knoepfe, jeder in eigener Farbe.
     3. Die Wellenform ist gezeichnet (Web Audio, 160 Balken, gemerkt).
     4. Ein Tipp auf einen Liedteil legt die Klammern darauf und faerbt
        die Strecke in seiner Farbe.
     5. Die Klammern lassen sich ziehen — Maus UND Finger — und die
        Zeitfelder laufen mit.
     6. Vorhoeren spielt.
     7. Der Ausschnitt reist in der Nachricht (liedAb/liedBis).
     8. Die Kopfhoerer sind SICHTBAR, solange der Ausschnitt laeuft, und
        gehen danach von selbst ab — auch nach einem Neuzeichnen nicht
        wieder da. Ohne Lied bleiben sie sitzen.
     9. Die Sitzreihe verschiebt sich dabei nicht.
    10. Keine Fehler in der Konsole.

   Aufruf:  node werkzeug/pruefe-hoerer-klammern.js [Bilderordner]
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.PRUEF_WURZEL || path.join(__dirname, "..");
const BILDER = process.argv[2] || path.join(os.tmpdir(), "pruefe-hoerer-klammern");
fs.mkdirSync(BILDER, { recursive: true });
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".gif": "image/gif",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};
const LIED = "One Day In Rome - Ein Leben Lang.mp3";

(async () => {
  console.log("KOPFHOERER, LIEDTEILE UND KLAMMERN (Funk 104)\n");
  /* Mit Range-Anfragen — sonst kann ein <audio> nicht springen, und das
     Vorhoeren ab 1:18 liesse sich nicht pruefen. */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    const groesse = fs.statSync(f).size;
    const typ = TYP[path.extname(f)] || "application/octet-stream";
    const m = /bytes=(\d*)-(\d*)/.exec(q.headers.range || "");
    if (m) {
      const von = m[1] ? Number(m[1]) : 0;
      const bis = m[2] ? Number(m[2]) : groesse - 1;
      a.writeHead(206, { "Content-Type": typ, "Accept-Ranges": "bytes",
        "Content-Range": "bytes " + von + "-" + bis + "/" + groesse, "Content-Length": bis - von + 1 });
      return fs.createReadStream(f, { start: von, end: bis }).pipe(a);
    }
    a.writeHead(200, { "Content-Type": typ, "Accept-Ranges": "bytes", "Content-Length": groesse });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const kontext = await br.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, hasTouch: true, isMobile: false });
  const pg = await kontext.newPage();

  const konsole = [];
  pg.on("pageerror", (e) => konsole.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    const ort = (m.location() && m.location().url) || "";
    if (/Failed to load resource/.test(t) && ort.indexOf(HIER) !== 0) return;
    konsole.push("console.error: " + t.slice(0, 160));
  });
  pg.on("response", (r) => {
    if (r.url().indexOf(HIER) === 0 && r.status() >= 400) konsole.push(r.status() + " " + r.url().slice(HIER.length));
  });

  await pg.addInitScript(() => { try {
    localStorage.setItem("dma_tour_seen", "1");
    localStorage.removeItem("dma_wellenform");
    localStorage.removeItem("dma_lied_ausschnitt");
  } catch (e) {} });
  await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF
    && window.DMA_PRUEF.ausschnittWahl && window.DMA_PRUEFUNG, { timeout: 25000 });

  /* --- IN DEN RAUM ------------------------------------------------- */
  await pg.evaluate((LIED) => {
    const leute = {
      bea: { id: "bea", name: "Bea", seit: 5000, gesehen: 9e15, buehne: true, bild: "" },
      cem: { id: "cem", name: "Cem", seit: 6000, gesehen: 9e15, buehne: true, bild: "" }
    };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    window.DMA_PRUEFUNG.toeneSetzen(true);
    /* Zwei eigene Liedteile dazu — die Farbe soll man an mehr als einem
       Knopf sehen. Genau so legt er sie an („Merken und benennen"). */
    window.DMA_PRUEF.liedStelleMerken(LIED, "Strophe 1", 20, 50);
    window.DMA_PRUEF.liedStelleMerken(LIED, "Bridge", 150, 172);
    window.__raus = [];
    window.LiveChat.pruefAbfangen((p) => { window.__raus.push(JSON.parse(JSON.stringify(p))); });
  }, LIED);
  await pg.waitForTimeout(600);
  const plaetzeDa = await pg.evaluate(() => document.querySelectorAll("#livechatKarte .lc-platz").length);
  sage(plaetzeDa >= 3, "das Klassenzimmer steht", plaetzeDa + " Plaetze");

  /* Gemessen wird relativ zur Karte des Klassenzimmers: ein Rollen der
     Seite ist kein Sitzsprung, ein Platz, der IN der Karte wandert, schon. */
  const sitzordnung = () => pg.evaluate(() => {
    const k = document.getElementById("livechatKarte").getBoundingClientRect();
    return [...document.querySelectorAll("#livechatKarte .lc-platz, #livechatKarte .lc-platz .lc-kreis")].map((e) => {
      const b = e.getBoundingClientRect();
      return [b.left - k.left, b.top - k.top, b.width, b.height].map((x) => Math.round(x * 10) / 10).join(",");
    }).join(" | ");
  });
  const rollStand = () => pg.evaluate(() => {
    const k = document.getElementById("livechatKarte").getBoundingClientRect();
    return "Seite bei " + Math.round(window.scrollY) + " px, Karte oben bei " + Math.round(k.top) + " px";
  });
  await pg.evaluate(() => document.getElementById("livechatKarte").scrollIntoView({ block: "start" }));
  await pg.waitForTimeout(200);
  const sitzVorher = await sitzordnung();
  console.log("       (" + await rollStand() + ")");

  /* --- 1. DER ECHTE WEG ------------------------------------------- */
  console.log("\n1) DER WEG: Musikwaehler fuer Bea -> Lied -> welcher Teil?\n");
  const weg = await pg.evaluate(() => {
    window.DMA_PRUEF.musikWaehler("Bea");
    const k = document.getElementById("lcPlatzMenue");
    if (!k) return { fehlt: "Musikwaehler" };
    const b = [...k.querySelectorAll(".lc-lese-text")].find((x) => /Ein Leben lang/.test(x.textContent));
    if (!b) return { fehlt: "Lied in der Liste" };
    b.click();
    const z = document.getElementById("lcPlatzMenue");
    return { kopf: z ? (z.querySelector(".lc-platzmenue-kopf") || {}).textContent : "",
             welle: Boolean(z && z.querySelector(".lc-welle canvas")),
             klammern: z ? z.querySelectorAll(".lc-klammer").length : 0 };
  });
  sage(!weg.fehlt && /welcher Teil/.test(weg.kopf || ""), "der Ausschnittwaehler geht auf", weg.fehlt || weg.kopf);
  sage(weg.welle && weg.klammern === 2, "mit Wellenform und zwei Klammern darin", weg.klammern + " Klammern");

  /* --- 3. DIE WELLE ------------------------------------------------ */
  await pg.waitForFunction(() => {
    const w = document.querySelector("#lcPlatzMenue .lc-welle");
    return w && w.classList.contains("lc-welle-fertig");
  }, { timeout: 30000 }).catch(() => {});
  await pg.waitForTimeout(150);
  await pg.screenshot({ path: path.join(BILDER, "1-waehler-geladen.png") });
  console.log("\n2) + 3) LIEDTEILE IN FARBE, DIE WELLENFORM\n");
  const bildStand = await pg.evaluate(async (LIED) => {
    const k = document.getElementById("lcPlatzMenue");
    const c = k.querySelector(".lc-welle canvas");
    const g = c.getContext("2d");
    const d = g.getImageData(0, 0, c.width, c.height).data;
    /* Wie viele Spalten tragen einen Balken? */
    let spalten = 0;
    for (let x = 0; x < c.width; x++) {
      let an = false;
      for (let y = 0; y < c.height * 0.85 && !an; y += 2) if (d[(y * c.width + x) * 4 + 3] > 60) an = true;
      if (an) spalten++;
    }
    /* Hoehenprofil: die Balken sind nicht alle gleich hoch. */
    const hoehen = [];
    for (let i = 0; i < 20; i++) {
      /* Der hoechste Balken in einem Fenster von 6 Spalten — eine
         einzelne Spalte kann genau in die Luft zwischen zwei Balken
         fallen. */
      const x0 = Math.floor((i + 0.5) * c.width / 20);
      let h = 0;
      for (let x = x0; x < x0 + 6; x++) {
        let hx = 0;
        for (let y = 0; y < c.height * 0.85; y++) if (d[(y * c.width + x) * 4 + 3] > 200) hx++;
        if (hx > h) h = hx;
      }
      hoehen.push(h);
    }
    const w = await window.DMA_PRUEF.welleHolen(LIED);
    const knoepfe = [...k.querySelectorAll(".lc-lied-stelle")].map((b) => ({
      text: b.textContent.replace(/\s+/g, " ").trim(),
      grund: getComputedStyle(b).backgroundColor, schrift: getComputedStyle(b).color }));
    let merker = null;
    try { merker = JSON.parse(localStorage.getItem("dma_wellenform") || "{}")[LIED] || null; } catch (e) {}
    return { spalten, breite: c.width, hoehen, balken: w ? w.balken.length : 0,
             dauer: w ? w.dauer : 0, knoepfe, gemerkt: Boolean(merker && merker.b && merker.b.length) };
  }, LIED);
  sage(bildStand.knoepfe.length === 3, "drei Liedteile als Knoepfe (Strophe 1, Refrain, Bridge)",
    bildStand.knoepfe.map((k) => k.text).join(" | "));
  const farben = bildStand.knoepfe.map((k) => k.grund);
  const grau = (f) => { const m = f.match(/\d+/g) || []; return m.length >= 3 && Math.max(+m[0], +m[1], +m[2]) - Math.min(+m[0], +m[1], +m[2]) < 25; };
  sage(new Set(farben).size === farben.length && farben.every((f) => !grau(f) && !/rgba\(.*, 0(\.0\d*)?\)$/.test(f)),
    "jeder Liedteil hat seine EIGENE Farbe — wie ein Knopf, nicht grau", farben.join(" "));
  const refrainK = bildStand.knoepfe.find((k) => /Refrain/.test(k.text)) || {};
  sage(/1:18–1:53/.test(refrainK.text || ""), "der Refrain traegt seine Zeit", refrainK.text || "-");
  sage(bildStand.balken >= 120 && bildStand.balken <= 200, "die Welle hat 120-200 Balken (Web Audio)",
    bildStand.balken + " Balken, " + Math.round(bildStand.dauer) + " s");
  sage(bildStand.spalten > bildStand.breite * 0.5, "die Wellenform ist wirklich gezeichnet",
    bildStand.spalten + " von " + bildStand.breite + " Pixelspalten");
  sage(Math.max(...bildStand.hoehen) - Math.min(...bildStand.hoehen) > 6,
    "und sie hat Profil (leise und laute Stellen)", bildStand.hoehen.join(","));
  sage(bildStand.gemerkt, "die Welle wird je Lied gemerkt (dma_wellenform)");

  /* --- 4. TIPP AUF DEN REFRAIN ------------------------------------ */
  console.log("\n4) EIN TIPP AUF DEN REFRAIN\n");
  await pg.evaluate(() => {
    [...document.querySelectorAll("#lcPlatzMenue .lc-lied-stelle")]
      .find((b) => /Refrain/.test(b.textContent)).click();
  });
  await pg.waitForTimeout(120);
  const nachTipp = await pg.evaluate(() => {
    const k = document.getElementById("lcPlatzMenue");
    const c = k.querySelector(".lc-welle canvas");
    const r = c.getBoundingClientRect();
    const lage = (s) => { const b = k.querySelector(s).getBoundingClientRect(); return (b.left + b.width / 2 - r.left) / r.width; };
    /* Die Farbe MITTEN in der Strecke, auf Hoehe der Mittellinie. */
    const g = c.getContext("2d");
    const x0 = Math.round(((lage(".lc-klammer-ab") + lage(".lc-klammer-bis")) / 2) * c.width);
    /* Ein paar Spalten nebeneinander: zwischen zwei Balken ist Luft. */
    let px = null;
    for (let x = x0 - 6; x <= x0 + 6 && !px; x++) {
      const d = g.getImageData(x, Math.round(c.height * 0.44), 1, 1).data;
      if (d[3] > 240) px = [d[0], d[1], d[2]];
    }
    const knopf = [...k.querySelectorAll(".lc-lied-stelle")].find((b) => /Refrain/.test(b.textContent));
    return { ab: k.querySelector(".lc-ausschnitt-ab").value, bis: k.querySelector(".lc-ausschnitt-bis").value,
             lageAb: lage(".lc-klammer-ab"), lageBis: lage(".lc-klammer-bis"),
             px, knopfFarbe: getComputedStyle(knopf).backgroundColor,
             gedrueckt: knopf.getAttribute("aria-pressed"),
             zeit: k.querySelector(".lc-welle-zeit").textContent };
  });
  sage(nachTipp.ab === "1:18" && nachTipp.bis === "1:53", "die Zeitfelder springen auf 1:18 bis 1:53",
    nachTipp.ab + " – " + nachTipp.bis);
  const soll = (s) => s / bildStand.dauer;
  sage(Math.abs(nachTipp.lageAb - soll(78)) < 0.012 && Math.abs(nachTipp.lageBis - soll(113)) < 0.012,
    "die Klammern stehen auf dem Refrain",
    "[ bei " + (nachTipp.lageAb * 100).toFixed(1) + " %, ] bei " + (nachTipp.lageBis * 100).toFixed(1) + " %");
  const rgb = (nachTipp.knopfFarbe.match(/\d+/g) || []).slice(0, 3).map(Number);
  const nah = nachTipp.px && rgb.length === 3 && nachTipp.px.every((v, i) => Math.abs(v - rgb[i]) < 12);
  sage(nah, "die Strecke dazwischen hat die Farbe des Refrain-Knopfs",
    "Welle " + JSON.stringify(nachTipp.px) + ", Knopf " + nachTipp.knopfFarbe);
  sage(nachTipp.gedrueckt === "true", "der Refrain-Knopf ist als gewaehlt markiert", nachTipp.zeit);
  await pg.screenshot({ path: path.join(BILDER, "2-refrain-getippt.png") });

  /* --- 5. ZIEHEN: MAUS UND FINGER ---------------------------------- */
  console.log("\n5) KLAMMERN ZIEHEN — Maus und Finger\n");
  const griff = (s) => pg.evaluate((s) => {
    const b = document.querySelector("#lcPlatzMenue " + s).getBoundingClientRect();
    const c = document.querySelector("#lcPlatzMenue .lc-welle canvas").getBoundingClientRect();
    return { x: b.left + b.width / 2, y: c.top + c.height / 2, breite: c.width };
  }, s);
  const felder = () => pg.evaluate(() => ({
    ab: document.querySelector("#lcPlatzMenue .lc-ausschnitt-ab").value,
    bis: document.querySelector("#lcPlatzMenue .lc-ausschnitt-bis").value,
    offen: Boolean(document.getElementById("lcPlatzMenue")) }));
  const gB = await griff(".lc-klammer-bis");
  await pg.mouse.move(gB.x, gB.y);
  await pg.mouse.down();
  for (let i = 1; i <= 6; i++) await pg.mouse.move(gB.x + i * 5, gB.y);
  await pg.mouse.up();
  const nachMaus = await felder();
  const sBis = 113 + Math.round(30 / gB.breite * bildStand.dauer);
  sage(nachMaus.offen && nachMaus.bis !== "1:53" && Math.abs(
    Number(nachMaus.bis.split(":")[0]) * 60 + Number(nachMaus.bis.split(":")[1]) - sBis) <= 2,
    "Maus: die Endklammer 30 px nach rechts verschiebt das Ende", "1:53 -> " + nachMaus.bis
    + " (erwartet etwa " + Math.floor(sBis / 60) + ":" + String(sBis % 60).padStart(2, "0") + ")");

  const gA = await griff(".lc-klammer-ab");
  const cdp = await kontext.newCDPSession(pg);
  const finger = (typ, x, y) => cdp.send("Input.dispatchTouchEvent", { type: typ,
    touchPoints: typ === "touchEnd" ? [] : [{ x: x, y: y, id: 1, radiusX: 4, radiusY: 4, force: 1 }] });
  await finger("touchStart", gA.x, gA.y);
  for (let i = 1; i <= 8; i++) { await finger("touchMove", gA.x - i * 5, gA.y); await pg.waitForTimeout(16); }
  await finger("touchEnd", gA.x - 40, gA.y);
  await pg.waitForTimeout(100);
  const nachFinger = await felder();
  sage(nachFinger.offen && nachFinger.ab !== "1:18" && nachFinger.ab !== "",
    "Finger: die Anfangsklammer nach links gezogen", "1:18 -> " + nachFinger.ab);
  const nichtMehrRefrain = await pg.evaluate(() => [...document.querySelectorAll("#lcPlatzMenue .lc-lied-stelle")]
    .every((b) => b.getAttribute("aria-pressed") === "false"));
  sage(nichtMehrRefrain, "frei gezogen ist kein Liedteil mehr gewaehlt");
  sage(nachFinger.offen, "das Menue bleibt beim Ziehen offen");
  await pg.screenshot({ path: path.join(BILDER, "3-klammern-gezogen.png") });

  /* Ein Tipp auf die Welle holt die naehere Klammer (die Endklammer). */
  const cRect = await pg.evaluate(() => { const r = document.querySelector("#lcPlatzMenue .lc-welle canvas").getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; });
  await pg.touchscreen.tap(cRect.l + cRect.w * 0.93, cRect.t + cRect.h / 2);
  await pg.waitForTimeout(100);
  const nachTap = await felder();
  sage(nachTap.bis !== nachFinger.bis, "ein Tipp auf die Welle holt die naehere Klammer dorthin",
    nachFinger.bis + " -> " + nachTap.bis);

  /* Und die Bridge: wieder in ihrer Farbe. */
  await pg.evaluate(() => {
    [...document.querySelectorAll("#lcPlatzMenue .lc-lied-stelle")].find((b) => /Bridge/.test(b.textContent)).click();
  });
  await pg.waitForTimeout(100);
  const bridge = await felder();
  sage(bridge.ab === "2:30" && bridge.bis === "2:52", "Tipp auf „Bridge“ legt die Klammern auf 2:30–2:52",
    bridge.ab + " – " + bridge.bis);
  await pg.screenshot({ path: path.join(BILDER, "4-bridge.png") });

  /* --- 6. VORHOEREN ------------------------------------------------ */
  console.log("\n6) VORHOEREN\n");
  await pg.evaluate(() => document.querySelector("#lcPlatzMenue .lc-welle-hoeren").click());
  await pg.waitForTimeout(1300);
  const vor = await pg.evaluate(() => {
    const k = document.getElementById("lcPlatzMenue");
    return { an: k.querySelector(".lc-welle-hoeren").classList.contains("lc-welle-hoeren-an") };
  });
  sage(vor.an, "der Abspielknopf spielt den Ausschnitt (und zeigt Stopp)");
  await pg.screenshot({ path: path.join(BILDER, "5-vorhoeren.png") });
  await pg.evaluate(() => document.querySelector("#lcPlatzMenue .lc-welle-hoeren").click());
  await pg.waitForTimeout(100);
  const vorAus = await pg.evaluate(() => !document.querySelector("#lcPlatzMenue .lc-welle-hoeren")
    .classList.contains("lc-welle-hoeren-an"));
  sage(vorAus, "und ein zweiter Tipp haelt es an");

  /* --- 7. SCHICKEN: DER AUSSCHNITT FAEHRT MIT --------------------- */
  console.log("\n7) SCHICKEN — ein kurzer Ausschnitt, drei Sekunden\n");
  await pg.evaluate(() => {
    const k = document.getElementById("lcPlatzMenue");
    const a = k.querySelector(".lc-ausschnitt-ab"), b = k.querySelector(".lc-ausschnitt-bis");
    a.value = "1:18"; a.dispatchEvent(new Event("input", { bubbles: true }));
    b.value = "1:21"; b.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await pg.waitForTimeout(80);
  const kurzLage = await pg.evaluate(() => {
    const k = document.getElementById("lcPlatzMenue");
    return { ab: k.querySelector(".lc-klammer-ab .lc-klammer-zeit").textContent,
             bis: k.querySelector(".lc-klammer-bis .lc-klammer-zeit").textContent };
  });
  sage(kurzLage.ab === "1:18" && kurzLage.bis === "1:21", "getippte Zeiten ziehen die Klammern mit",
    kurzLage.ab + " / " + kurzLage.bis);
  const sitzMitMenue = await sitzordnung();
  console.log("       (" + await rollStand() + ")");
  await pg.evaluate(() => { window.__raus.length = 0; document.querySelector("#lcPlatzMenue .lc-ausschnitt-los").click(); });
  const gesendetUm = Date.now();
  await pg.waitForTimeout(250);
  const post = await pg.evaluate(() => window.__raus.find((p) => p.wirkung === "kopfhoerer") || null);
  sage(Boolean(post) && post.wen === "Bea" && post.lied === "One Day In Rome - Ein Leben Lang.mp3",
    "die Nachricht geht hinaus: Kopfhoerer fuer Bea mit diesem Lied", post ? post.wen + " / " + post.lied : "nichts gesendet");
  sage(Boolean(post) && Number(post.liedAb) === 78 && Number(post.liedBis) === 81,
    "und der Ausschnitt reist mit: liedAb 78, liedBis 81", post ? post.liedAb + " / " + post.liedBis : "-");

  /* --- 8. DIE KOPFHOERER: SICHTBAR, SO LANGE ES LAEUFT ------------- */
  console.log("\n8) KOPFHOERER — so lange zu sehen wie der Ausschnitt\n");
  /* Bei den ANDEREN kommt die Nachricht an und laeuft durch lcWirkung —
     genau das passiert hier, mit derselben Nachricht. Liegen die Hoerer
     schon (weil die eigene Zeile sie gesetzt hat), stellt sie nur die
     Uhr neu. */
  const beaHoerer = () => pg.evaluate(() => {
    const pl = [...document.querySelectorAll("#livechatKarte .lc-platz")]
      .find((p) => /^bea/i.test(((p.querySelector(".lc-platz-name") || {}).textContent || "").trim()));
    const h = pl && pl.querySelector(".lc-kopfhoerer:not(.lc-kopfhoerer-ab) .lc-kopfhoerer-bild");
    return h ? Number(getComputedStyle(h).opacity) : -1;
  });
  const nachEigen = await beaHoerer();
  if (nachEigen < 0) {
    await pg.evaluate((p) => window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Bea", "Alex", p), post || {});
  }
  await pg.waitForTimeout(1200);
  const sichtbar12 = await beaHoerer();
  sage(sichtbar12 === 1, "nach 1,2 s sitzen sie sichtbar auf Beas Bild", "opacity " + sichtbar12);
  await pg.screenshot({ path: path.join(BILDER, "6-hoerer-auf.png") });
  const uhr = await pg.evaluate(() => window.DMA_PRUEF.hoererUhrStand());
  sage(uhr.bea === true, "die Lied-Uhr laeuft", JSON.stringify(uhr));
  await pg.waitForTimeout(Math.max(0, gesendetUm + 2500 - Date.now()));
  const sichtbar25 = await beaHoerer();
  sage(sichtbar25 === 1, "nach 2,5 s (Ausschnitt laeuft noch) immer noch sichtbar — nicht mehr weggeblendet",
    "opacity " + sichtbar25);
  await pg.waitForTimeout(Math.max(0, gesendetUm + 4200 - Date.now()));
  const nachEnde = await beaHoerer();
  sage(nachEnde === -1, "nach dem Ende des Ausschnitts (3 s) sind sie von selbst ab", nachEnde === -1 ? "weg" : "noch da");
  await pg.evaluate(() => { window.DMA_PRUEF.auffrischen(); window.DMA_PRUEF.neuZeichnen(); });
  await pg.waitForTimeout(500);
  const nachNeu = await beaHoerer();
  sage(nachNeu === -1, "und ein Neuzeichnen legt sie nicht wieder auf", nachNeu === -1 ? "weg" : "wieder da");
  await pg.screenshot({ path: path.join(BILDER, "7-hoerer-ab.png") });

  /* Das GANZE Lied: die Uhr kennt seine Laenge auf jedem Geraet. */
  const ganz = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Cem", "Alex", { lied: "Du.mp3", liedTitel: "Du" });
    await new Promise((f) => setTimeout(f, 1500));
    return { uhr: window.DMA_PRUEF.hoererUhrStand(),
             laufzeit: window.DMA_PRUEF.liedLaufzeit(0, 0, 200),
             ausschnitt: window.DMA_PRUEF.liedLaufzeit(78, 81, 200),
             nurAb: window.DMA_PRUEF.liedLaufzeit(78, 0, 200) };
  });
  sage(ganz.uhr.cem === true, "ganzes Lied: auch dafuer laeuft eine Uhr (Laenge aus der Datei)", JSON.stringify(ganz.uhr));
  sage(ganz.laufzeit === 200 && ganz.ausschnitt === 3 && ganz.nurAb === 30,
    "Laufzeit wie lcMusikSpielen: ganz = Liedlaenge, Ausschnitt = bis-ab, nur Anfang = 30 s",
    ganz.laufzeit + " / " + ganz.ausschnitt + " / " + ganz.nurAb);

  /* Ohne Lied: sie bleiben sitzen, bis man sie abnimmt. */
  const ohne = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Alex", "Bea", {});
    await new Promise((f) => setTimeout(f, 4200));
    const pl = document.querySelector("#livechatKarte .lc-platz-ich");
    const h = pl && pl.querySelector(".lc-kopfhoerer .lc-kopfhoerer-bild");
    const op = h ? Number(getComputedStyle(h).opacity) : -1;
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Alex", "Bea", {});
    await new Promise((f) => setTimeout(f, 200));
    return { op, uhr: window.DMA_PRUEF.hoererUhrStand(),
             ab: !(pl && pl.querySelector(".lc-kopfhoerer")) };
  });
  sage(ohne.op === 1, "„Nur aufsetzen“: nach 4,2 s noch sichtbar (vorher: unsichtbar)", "opacity " + ohne.op);
  sage(ohne.ab, "und ein zweites „Nur aufsetzen“ nimmt sie wie gehabt sofort ab");

  /* --- 9. DIE SITZREIHE --------------------------------------------- */
  console.log("\n9) DIE SITZREIHE\n");
  const sitzNachher = await sitzordnung();
  sage(sitzMitMenue === sitzVorher, "das offene Menue verschiebt keinen Platz");
  sage(sitzNachher === sitzVorher, "Aufsetzen und Abnehmen verschieben keinen Platz",
    sitzNachher === sitzVorher ? "" : "\n     vorher  " + sitzVorher + "\n     nachher " + sitzNachher);

  /* --- 10. KONSOLE -------------------------------------------------- */
  console.log("\n10) KONSOLE\n");
  sage(konsole.length === 0, "keine Fehler in der Konsole", konsole.slice(0, 3).join(" | ") || "keine");

  await br.close(); srv.close();
  console.log("\nBilder: " + BILDER);
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
