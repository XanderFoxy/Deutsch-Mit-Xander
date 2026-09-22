/* =====================================================================
   SONDE RUNDE 88 — SCHIFFE VERSENKEN, JETZT MIT SINN
   ---------------------------------------------------------------------
   XANDER, woertlich:
   · „Das Schiffe versenken macht im Uebrigen auch keinen Sinn. Da
      muessen wir uns etwas ueberlegen, wie wir das spielen koennen,
      denn wenn sich ein Zweiter einen Platz aussucht, dann darf er
      nicht rausfinden, dass ein Platz besetzt ist, weil dann wuerde
      er den ja anklicken, um ihn zu versenken. Deswegen musst du das
      eher mit Zufallszahlen loesen, dass einfach jeder zufaellig
      gesetzt wird und die anderen das eben nicht wissen, wo sie
      hingesetzt sind."
   · „weil wir sind ja maximal acht Leute, und damit wir ein bisschen
      Verteilung machen koennen … dass da vielleicht ploetzlich
      sechzehn sind."
   · „diese Reihenfolge muss einem logischen Prinzip folgen, nach der
      Reihe der Anmeldungen im Chat."
   · „dann sollen wir das Spiel natuerlich auch wieder ausschalten
      koennen."
   · „wenn man jemanden getroffen hat und versenkt hat, dann soll das
      auch eine Animation dazu geben, dass man dort ein Schiff
      versinken sieht — so Titanic-maessig, so dramatisch im Stil,
      mit der Nase nach oben und dem Rumpf gebrochen, oder irgendwas,
      dass es dort wirklich in dieses Positionsbild abtaucht."
   · „hast du das ueberprueft, dass es auf jedem Geraet von allen
      nacheinander gespielt werden kann."

   Gemessen wird das, was er sieht — die Drehung der Bugspitze wird
   aus der berechneten Matrix gelesen und in die Koordinaten der
   Zeichnung zurueckgerechnet, damit die Sonde sagen kann: die Nase
   steht wirklich ueber Wasser.
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
  console.log("RUNDE 88 — Schiffe versenken\n");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");

  console.log("DIE REGELN DES SPIELS\n");
  /* 1. Ausgelost, nicht ausgesucht. */
  sage(/var SCHIFFE_FELDER = 16;/.test(lc)
    && /schiffeSpiel\.reihe\.forEach\(function \(m, k\) \{ schiffeSpiel\.verstecke\[m\.id\] = felder\[k\]; \}\);/.test(lc),
    "die Verstecke werden ausgelost — sechzehn Felder, gemischt");
  /* 2. Und niemand kann mehr nach einem fremden Versteck fragen:
        es gibt keine Versteck-Nachricht mehr und keine Antwort
        „da ist schon jemand". */
  sage(!/t: "versteck"/.test(lc) && !/t: "belegt", nr: nr/.test(lc)
    && !/systemZeile\("Dort versteckt sich schon jemand/.test(lc),
    "niemand sucht sich mehr ein Feld aus — also verraet auch niemand eines");
  /* 3. Jeder erfaehrt nur sein eigenes Feld, und zwar als Post an
        genau ein Geraet. */
  sage(/postSenden\(m\.id, \{ art: "spielpost", spiel: \{ t: "platz", nr: nr \} \}\);/.test(lc)
    && /if \(d\.t === "platz"\)/.test(lc),
    "und jeder erfaehrt nur sein eigenes Feld, per Post an ein Geraet");
  /* 4. Die Reihenfolge ist die Ankunft. */
  sage(/var reihe = spielReihe\(\);/.test(lc)
    && /return \(a\.seit - b\.seit\)/.test(lc),
    "die Reihenfolge ist die Ankunft im Raum, nicht die Platznummer");
  /* 5. Der Spielleiter sieht sein eigenes Spiel. */
  sage(/function schiffeAnAlle\(d\) \{\s*\n\s*senden\(\{ art: "spiel", spiel: d \}\);\s*\n\s*schiffeEmpfangen\(d, zustand\.ichId\);/.test(lc),
    "jeder Rundruf legt auch auf dem eigenen Geraet an");
  /* 6. Ausschalten. */
  sage(/\^\(aus\|stop\|stopp\|schluss\|ende\|fertig\)\$/.test(lc),
    "und das Spiel laesst sich wieder ausschalten");

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
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_SCHIFFE, { timeout: 20000 });

  console.log("\nDAS BRETT — GEMESSEN\n");
  const brett = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const karte = document.getElementById("livechatKarte");
    const gitter = document.getElementById("lcPlaetze")
      || document.querySelector("#livechatKarte .lc-plaetze");
    const vorher = gitter.getBoundingClientRect();
    const reihe = [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }];
    window.DMA_SCHIFFE({ phase: "schiessen", richter: "a", plaetze: 16, reihe: reihe,
      tafel: {}, meins: 5, dran: "a", dranName: "Alex", raus: [],
      text: "Die Verstecke sind ausgelost.", ichBin: "a" });
    await new Promise((f) => setTimeout(f, 260));
    const nachher = gitter.getBoundingClientRect();
    const felder = document.querySelectorAll(".lc-platz.lc-schiff-feld").length;
    const eigenes = document.querySelectorAll(".lc-schiff-meins").length;
    /* Waehrend des Spiels sieht man seine Mitspieler nicht. */
    const einName = document.querySelector(".lc-platz .lc-platz-name");
    const namenSicht = einName ? getComputedStyle(einName).visibility : "-";
    const kopf = document.querySelector(".lc-schiffe-kopfzeile");
    return { obenVor: vorher.top, obenNach: nachher.top,
             untenVor: vorher.bottom, untenNach: nachher.bottom,
             felder, eigenes, namenSicht, kopf: kopf ? kopf.textContent : "" };
  });
  sage(brett.felder === 16, "sechzehn Felder stehen bereit", brett.felder + " Felder");
  /* „Es soll genau in dem selben Abstand nur stattfinden … nicht,
     dass das, was ueber den Positionsplaetzen liegt, weiter hoeher
     rutscht und das, was darunter liegt, weiter runterrutscht." */
  sage(Math.abs(brett.obenNach - brett.obenVor) < 1.5
    && Math.abs(brett.untenNach - brett.untenVor) < 1.5,
    "oben und unten bleibt alles, wo es war",
    "oben " + (brett.obenNach - brett.obenVor).toFixed(1)
    + " px, unten " + (brett.untenNach - brett.untenVor).toFixed(1) + " px");
  sage(brett.namenSicht === "hidden",
    "man sieht seine Mitspieler waehrend des Spiels nicht", brett.namenSicht);
  sage(brett.eigenes === 1, "nur das eigene Versteck ist markiert",
    brett.eigenes + " markiert");
  sage(/Du bist dran/.test(brett.kopf), "und oben steht, wer dran ist", brett.kopf);

  console.log("\nDER UNTERGANG — GEMESSEN\n");
  /* Die Bugspitze liegt in der Zeichnung bei (4|62), der Drehpunkt
     bei (60|70), das Wasser bei y = 74. Aus der Matrix der Gruppe
     laesst sich ausrechnen, wo die Spitze zu einem Zeitpunkt steht —
     und damit, ob die Nase wirklich oben ist. */
  const lauf = await pg.evaluate(async () => {
    const reihe = [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }];
    window.DMA_SCHIFFE({ phase: "schiessen", richter: "a", plaetze: 16, reihe: reihe,
      tafel: { 3: "treffer" }, meins: 5, dran: "b", dranName: "Bea", raus: ["Bea"],
      text: "Alex trifft auf Platz 3 — Bea ist versenkt!", ichBin: "a" });
    const feld = document.querySelector('.lc-platz[data-lc-platz="3"]');
    const spitze = (el) => {
      const m = getComputedStyle(el).transform;
      if (!m || m === "none") return { x: 4, y: 62, grad: 0 };
      const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
      /* Der Ursprung der Drehung ist (60|70) — dorthin verschieben,
         die Matrix anwenden, zurueckschieben. */
      const rx = 4 - 60, ry = 62 - 70;
      return { x: 60 + z[0] * rx + z[2] * ry + z[4],
               y: 70 + z[1] * rx + z[3] * ry + z[5],
               grad: Math.atan2(z[1], z[0]) * 180 / Math.PI };
    };
    const aus = [];
    for (let i = 0; i <= 38; i++) {
      await new Promise((f) => setTimeout(f, 100));
      const bug = feld.querySelector(".lc-schiff-bug");
      const zeichen = feld.querySelector(".lc-schiff-zeichen");
      const p = bug ? spitze(bug) : null;
      aus.push({ t: i * 100, da: Boolean(bug),
                 x: p ? Number(p.x.toFixed(1)) : null,
                 y: p ? Number(p.y.toFixed(1)) : null,
                 grad: p ? Number(p.grad.toFixed(1)) : null,
                 zeichen: zeichen ? Number(getComputedStyle(zeichen).opacity) : -1 });
    }
    return aus;
  });
  const mitSchiff = lauf.filter((r) => r.da);
  sage(mitSchiff.length > 0, "auf einen Treffer hin geht dort ein Schiff unter");
  /* 1. Erst liegt es flach. */
  const anfang = mitSchiff.filter((r) => r.t <= 400);
  sage(anfang.length && anfang.every((r) => Math.abs(r.grad) < 4),
    "am Anfang liegt es flach im Wasser",
    anfang.length ? "hoechstens " + Math.max.apply(null, anfang.map((r) => Math.abs(r.grad))).toFixed(1) + " Grad" : "-");
  /* 2. Dann steht die NASE OBEN — und zwar ueber Wasser (y < 74). */
  const steil = mitSchiff.filter((r) => r.grad > 60);
  const hoch = steil.filter((r) => r.y < 74);
  sage(steil.length > 0 && hoch.length > 0,
    "dann steht die Nase senkrecht — und ueber Wasser",
    steil.length ? "steilste " + Math.max.apply(null, steil.map((r) => r.grad)).toFixed(0)
      + " Grad, Spitze bei y = " + Math.min.apply(null, steil.map((r) => r.y)).toFixed(0)
      + " (Wasser bei 74)" : "nie steiler als 60 Grad");
  /* 3. Die Drehung darf NIE negativ werden — negativ hiesse: die Nase
        geht nach unten, und genau das war der Fehler der ersten
        Fassung. */
  const verkehrt = mitSchiff.filter((r) => r.grad < -6);
  sage(verkehrt.length === 0, "und sie geht nie nach unten weg",
    verkehrt.length ? "bei " + verkehrt[0].t + " ms " + verkehrt[0].grad + " Grad" : "kein einziger Punkt");
  /* 4. Am Ende ist die Spitze unter Wasser — „dass es dort wirklich
        in dieses Positionsbild abtaucht". */
  const letzte = mitSchiff[mitSchiff.length - 1];
  sage(letzte && letzte.y > 74, "am Ende taucht sie unter",
    letzte ? "zuletzt y = " + letzte.y + " bei " + letzte.t + " ms" : "-");
  /* 5. Und das Zeichen liegt nicht darauf. */
  const verdeckt = mitSchiff.filter((r) => r.zeichen > 0.05);
  sage(verdeckt.length === 0, "das 💥 verdeckt den Untergang nicht",
    verdeckt.length ? "bei " + verdeckt[0].t + " ms sichtbar" : "waehrend des Untergangs unsichtbar");
  /* 6. Danach ist es weg und das Zeichen steht. */
  const danach = lauf.filter((r) => !r.da && r.t > 3400);
  sage(danach.length > 0 && danach[danach.length - 1].zeichen > 0.5,
    "danach ist das Schiff weg und der Treffer bleibt markiert",
    danach.length ? "Zeichen " + danach[danach.length - 1].zeichen : "-");

  console.log("\nUND WIEDER AUS\n");
  const aus = await pg.evaluate(async () => {
    window.DMA_SCHIFFE(null);
    await new Promise((f) => setTimeout(f, 150));
    const gitter = document.getElementById("lcPlaetze")
      || document.querySelector("#livechatKarte .lc-plaetze");
    return { plaetze: document.querySelectorAll(".lc-platz").length,
             felder: document.querySelectorAll(".lc-schiff-feld").length,
             schiff: document.querySelectorAll(".lc-schiff-unter").length,
             zeile: document.querySelectorAll(".lc-schiffe-zeile").length,
             sechzehn: gitter.classList.contains("lc-plaetze-sechzehn"),
             an: document.getElementById("livechatKarte").classList.contains("lc-schiffe-an") };
  });
  sage(aus.plaetze === 8 && !aus.sechzehn,
    "die acht Plaetze sind wieder da", aus.plaetze + " Plaetze");
  sage(!aus.felder && !aus.schiff && !aus.zeile && !aus.an,
    "und vom Spiel ist nichts uebrig");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nAusgelost, der Reihe nach, und die Nase geht nach oben.\n");
  process.exit(fehler ? 1 : 0);
})();
