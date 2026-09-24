/* =====================================================================
   SONDE RUNDE 99 — DER ZYLINDER STEHT RICHTIG HERUM
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Das Kaninchen, was aus dem Hut gezaubert wird,
   hast du immer noch nicht gefixt — der Hut ist falsch herum."

   Was falsch war, laesst sich benennen: der Hut stuelpt sich ueber den
   Kopf, die Krempe liegt also unten und die Oeffnung zeigt nach unten.
   Gezeichnet war aber OBEN eine schwarze Oeffnung — und das Kaninchen
   kam durch den geschlossenen Deckel heraus.

   GEMESSEN WIRD DER ABLAUF, Bild fuer Bild angehalten:
     1. Solange der Hut ueber dem Kopf steht: die Ansicht „zu" ist zu
        sehen, die Ansicht „auf" nicht.
     2. In der Mitte wird er umgedreht — er staucht sich dabei auf
        weniger als ein Fuenftel seiner Hoehe.
     3. Danach ist die Ansicht „auf" zu sehen: Krempe oben, Oeffnung
        zu uns.
     4. UND ERST DANN kommt das Bild heraus. Kommt es frueher, waere
        es wieder durch den Deckel.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
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
  console.log("RUNDE 99 — der Zylinder steht richtig herum\n");
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
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 900, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne
    && window.DMA_PRUEFUNG, { timeout: 25000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(250);
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-zaubertrick").forEach((e) => e.remove());
    window.DMA_PRUEFUNG.wirkung("kaninchen", "Bea", "Alex");
  });
  await pg.waitForSelector(".lc-zt-hut", { timeout: 8000 });
  await pg.waitForTimeout(120);

  /* Den ganzen Trick in 100 Schritten abtasten. */
  const bahn = [];
  for (let k = 0; k <= 100; k++) {
    const t = k / 100;
    const p = await pg.evaluate((tt) => {
      document.getAnimations().forEach((an) => {
        try {
          const d = an.effect && an.effect.getTiming().duration;
          if (d) { an.currentTime = d * tt; an.pause(); }
        } catch (e) {}
      });
      const hut = document.querySelector(".lc-zt-hut");
      const zu = document.querySelector(".lc-zt-hut-zu");
      const auf = document.querySelector(".lc-zt-hut-auf");
      const platz = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"]');
      const kreis = platz && platz.querySelector(".lc-kreis");
      if (!hut || !zu || !auf || !kreis) return null;
      const m = new DOMMatrixReadOnly(getComputedStyle(hut).transform);
      const mk = new DOMMatrixReadOnly(getComputedStyle(kreis).transform);
      return {
        zu: Number(getComputedStyle(zu).opacity),
        auf: Number(getComputedStyle(auf).opacity),
        hutSicht: Number(getComputedStyle(hut).opacity),
        /* Wie flach ist der Hut gerade? (die senkrechte Laenge der
           Matrix — bei scaleY(.08) sind das 0,08) */
        flach: Math.round(Math.hypot(m.c, m.d) * 1000) / 1000,
        /* Wie weit ist das Bild nach oben gewandert? */
        bildY: Math.round(mk.f * 10) / 10
      };
    }, t);
    if (p) bahn.push(Object.assign({ t: t }, p));
  }
  await pg.close();

  if (bahn.length < 90) {
    sage(false, "Der Trick liess sich nicht abtasten", bahn.length + " Punkte");
  } else {
    /* 1. Waehrend der Hut ueber dem Kopf steht (12 % bis 40 %) */
    const drauf = bahn.filter((p) => p.t >= 0.12 && p.t <= 0.34);
    sage(drauf.every((p) => p.zu > 0.9) && drauf.every((p) => p.auf < 0.1),
      "Solange er ueber dem Kopf steht, ist er OBEN ZU",
      "zu " + drauf[0].zu + ", auf " + drauf[0].auf);

    /* 2. Das Umdrehen */
    const flachstes = bahn.reduce((a, b) => (b.flach < a.flach ? b : a));
    sage(flachstes.flach <= 0.2 && flachstes.t > 0.33 && flachstes.t < 0.41,
      "In der Mitte wird er wirklich umgedreht",
      "bei " + Math.round(flachstes.t * 100) + " % nur noch "
      + flachstes.flach + " seiner Hoehe");

    /* 3. Danach die andere Ansicht */
    const danach = bahn.filter((p) => p.t >= 0.40 && p.t <= 0.58);
    sage(danach.every((p) => p.auf > 0.9) && danach.every((p) => p.zu < 0.1),
      "Danach zeigt er uns seine OEFFNUNG",
      "auf " + danach[0].auf + ", zu " + danach[0].zu);

    /* 4. Und erst dann kommt das Bild heraus. */
    const vorher = bahn.filter((p) => p.t >= 0.12 && p.t <= 0.39);
    const hoechstVorher = Math.min.apply(null, vorher.map((p) => p.bildY));
    const raus = bahn.filter((p) => p.t >= 0.47 && p.t <= 0.58);
    const hoechstRaus = Math.min.apply(null, raus.map((p) => p.bildY));
    /* ZWEITER ANLAUF: unter dem Hut wird das Bild jetzt in die Mitte
       des Kegels gezogen (translateY -12 %, siehe app.js) — das ist
       VERSTECKEN, nicht herauskommen. Deshalb zaehlt jetzt: vor dem
       Umdrehen ruehrt es sich nicht (hoechstens 3 px Unterschied), und
       danach geht es deutlich hoeher als je zuvor. */
    const tiefsteVorher = Math.max.apply(null, vorher.map((p) => p.bildY));
    sage(tiefsteVorher - hoechstVorher <= 3 && hoechstRaus < hoechstVorher - 30,
      "Das Bild kommt erst NACH dem Umdrehen heraus",
      "vor dem Umdrehen hoechstens " + hoechstVorher
      + " px, danach " + hoechstRaus + " px");
  }

  /* ZWEITER ANLAUF (Walkie-Talkie): „das Bild muss in dem Moment unter
     dem Hut verschwinden, wenn der Hut dort steht — realistisch
     umschliessen." Gemessen bei 20 % (der Hut sitzt, der Stab klopft):
     liegt das Bild ganz innerhalb des Kegels (28–72 % der Hutbreite)? */
  const pg2 = await br.newPage({ viewport: { width: 900, height: 1000 } });
  await pg2.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg2.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg2.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEFUNG, { timeout: 25000 });
  const drunter = await pg2.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 300));
    window.DMA_PRUEFUNG.wirkung("kaninchen", "Bea", "Alex");
    await new Promise((f) => setTimeout(f, 950));
    const platz = [...document.querySelectorAll("#lcPlaetze .lc-platz")]
      .find((x) => (x.textContent || "").indexOf("Bea") >= 0);
    const k = platz.querySelector(".lc-kreis").getBoundingClientRect();
    const h = platz.querySelector(".lc-zt-hut").getBoundingClientRect();
    const kegel = { l: h.left + h.width * 0.28, r: h.left + h.width * 0.72,
                    o: h.top + h.height * 0.186, u: h.top + h.height * 0.86 };
    return { links: Math.round(k.left - kegel.l), rechts: Math.round(kegel.r - k.right),
             oben: Math.round(k.top - kegel.o), unten: Math.round(kegel.u - k.bottom) };
  });
  sage(drunter.links >= 0 && drunter.rechts >= 0 && drunter.oben >= 0 && drunter.unten >= 0,
    "Solange der Hut sitzt, liegt das Bild ganz darunter (nichts schaut heraus)",
    "Rand zum Kegel: links " + drunter.links + ", rechts " + drunter.rechts
    + ", oben " + drunter.oben + ", unten " + drunter.unten + " px");

  /* RUNDE 100 — XANDER (Walkie-Talkie): „Bild noch sichtbar unter dem
     Hut". Zwei Ursachen gemessen: der Hut war beim Herabfallen halb
     durchsichtig (das Bild schien durch), und unter dem kleinen Bild
     kam der gestrichelte Platzring hervor. */
  const fall = await pg2.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 300));
    window.DMA_PRUEFUNG.wirkung("kaninchen", "Bea", "Alex");
    const platz = [...document.querySelectorAll("#lcPlaetze .lc-platz")]
      .find((x) => (x.textContent || "").indexOf("Bea") >= 0);
    const deckung = [];
    let ring = "";
    for (let i = 0; i < 12; i++) {
      await new Promise((f) => setTimeout(f, 25));
      const hut = platz.querySelector(".lc-zt-hut");
      if (!hut) continue;
      const t = hut.getAnimations()[0];
      const zeit = t ? t.currentTime : 0;
      /* Von 2 % (184 ms) bis zur Landung muss er voll decken. */
      if (zeit > 4600 * 0.02) deckung.push(Number(getComputedStyle(hut).opacity));
      if (zeit > 4600 * 0.1 && !ring) ring = getComputedStyle(platz.querySelector(".lc-schild")).visibility;
    }
    await new Promise((f) => setTimeout(f, 400));
    if (!ring) ring = getComputedStyle(platz.querySelector(".lc-schild")).visibility;
    return { min: deckung.length ? Math.min.apply(null, deckung) : -1, n: deckung.length, ring };
  });
  sage(fall.min >= 0.99, "Der Hut faellt undurchsichtig — durch ihn scheint kein Bild",
    "kleinste Deckung " + fall.min + " in " + fall.n + " Proben");
  sage(fall.ring === "hidden", "Unter dem Hut kommt kein gestrichelter Platzring hervor",
    "Ring: " + fall.ring);

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
