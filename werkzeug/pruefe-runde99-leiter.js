/* =====================================================================
   SONDE RUNDE 99 — DIE LEITER WECHSELT DEN PLATZ
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Wenn man sie einmal klickt, dann wird
   entschieden je nach Position: ist man oben, dann klettert man nach
   unten, ist man unten, dann klettert man nach oben — und bleibt auch
   da."
   GEMESSEN:
     1. Obere Reihe -> Ziel ist der Platz DIREKT darunter (+4),
        untere Reihe -> der Platz DIREKT darueber (-4).
     2. Die neue Sitzordnung geht erst NACH dem Klettern hinaus
        (nicht vorher — Runde 98: „erst die Animation, dann der
        Platzwechsel").
     3. Auf dem Bildschirm kommt das Bild genau in der Mitte des
        Zielplatzes an, und die Leiter liegt hinter beiden Bildern.
     4. ZWEITER ANLAUF — „das Bild muss VOR der Leiter klettern …
        denk logisch": mitten im Klettern trifft ein Tipp auf die
        Bildmitte das BILD, und links und rechts daneben sieht man die
        Holme (die Leiter ist breiter als das kletternde Bild).
     5. Sitzt am Ziel jemand, klettert er gleichzeitig entgegen —
        ebenfalls VOR der Leiter.
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
  console.log("RUNDE 99 — die Leiter wechselt den Platz\n");
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
  const pg = await br.newPage({ viewport: { width: 900, height: 1000 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz
    && window.DMA_PRUEF && window.DMA_PRUEFUNG, { timeout: 25000 });

  console.log("1  WOHIN KLETTERT MAN?\n");
  const sitz = await pg.evaluate(() => {
    const leute = {};
    ["Bea", "Cem", "Dana"].forEach((n, i) => {
      leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 };
    });
    leute.e1 = { id: "e1", name: "Emmi", seit: 9000 };
    const s = window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex",
      seit: 1000, zuruecksetzen: true, leute: leute });
    const wo = {};
    (s.plaetze || []).forEach((p) => { if (!p.leer) wo[p.name] = p.nummer; });
    return wo;
  });
  /* Die Pakete werden DAUERHAFT mitgeschrieben und dann abgewartet,
     bis die Sitzordnung kommt (hoechstens 10 s). Gemessen in der
     Seitenzeit: beim Probelauf lief die Uhr der Seite unter Last
     langsamer als die Wanduhr — ein fester Schlaf von 3,4 s kam dann
     VOR dem 3,05-s-Zeitgeber der Leiter zurueck und meldete „gar
     nicht", obwohl die Sitzordnung kurz danach sauber hinausging. */
  const schicken = async (befehl) => {
    await pg.evaluate((b) => {
      window.__pakete = [];
      window.LiveChat.pruefPost((p) => window.__pakete.push({ p: p, t: performance.now() }));
      window.__t0 = performance.now();
      window.LiveChat.pruefBefehl(b);
    }, befehl);
    try {
      await pg.waitForFunction(() => (window.__pakete || [])
        .some((x) => x.p && x.p.art === "sitzplatz"), { timeout: 10000, polling: 100 });
    } catch (e) {}
    return pg.evaluate(() => ({ pakete: (window.__pakete || []).map((x) => ({
      art: x.p && x.p.art, wirkung: x.p && x.p.wirkung, ziel: x.p && x.p.ziel,
      wen: x.p && x.p.wen, nach: Math.round(x.t - window.__t0) })) }));
  };

  const oben = Object.keys(sitz).find((n) => sitz[n] <= 4 && n !== "Alex");
  const unten = Object.keys(sitz).find((n) => sitz[n] > 4 && n !== "Alex");
  const r1 = await schicken("/leiter " + oben);
  const w1 = r1.pakete.find((p) => p.wirkung === "leiter");
  sage(w1 && w1.ziel === sitz[oben] + 4,
    oben + " sitzt oben (" + sitz[oben] + ") und klettert HINUNTER",
    "Ziel " + (w1 && w1.ziel));
  const s1 = r1.pakete.find((p) => p.art === "sitzplatz");
  sage(s1 && s1.nach >= 2900,
    "Die neue Sitzordnung kommt erst nach dem Klettern",
    s1 ? s1.nach + " ms nach dem Klick" : "gar nicht");

  /* Nach dem Umsetzen sitzt er unten — also muss er jetzt HINAUF. */
  const sitz2 = await pg.evaluate(() => {
    const wo = {};
    (window.LiveChat.pruefSitz({}).plaetze || []).forEach((p) => { if (!p.leer) wo[p.name] = p.nummer; });
    return wo;
  });
  sage(sitz2[oben] === sitz[oben] + 4, "... und bleibt dann auch unten",
    oben + " jetzt auf " + sitz2[oben]);
  const r2 = await schicken("/leiter " + oben);
  const w2 = r2.pakete.find((p) => p.wirkung === "leiter");
  sage(w2 && w2.ziel === sitz2[oben] - 4,
    "Ein zweiter Klick: jetzt sitzt " + oben + " unten und klettert HINAUF",
    "Ziel " + (w2 && w2.ziel));

  console.log("\n2  AUF DEM BILDSCHIRM\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("leiter", "Bea", "Alex", { ziel: 6 }));
  await pg.waitForTimeout(3050);
  const m = await pg.evaluate(() => {
    const a = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"] .lc-kreis');
    const b = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="6"] .lc-kreis');
    const l = document.querySelector(".lc-leiter-weg");
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    return {
      versatz: Math.round(Math.hypot((ra.left + ra.width / 2) - (rb.left + rb.width / 2),
        (ra.top + ra.height / 2) - (rb.top + rb.height / 2))),
      leiter: Boolean(l),
      leiterZ: l ? getComputedStyle(l).zIndex : "-"
    };
  });
  sage(m.versatz <= 3, "Bei 3,05 s steht das Bild genau auf dem Zielplatz",
    m.versatz + " px neben dessen Mitte");
  sage(m.leiter && m.leiterZ === "-1", "Die Leiter liegt HINTER den Bildern",
    "z-index " + m.leiterZ);

  console.log("\n3  VOR DER LEITER, NICHT DAHINTER\n");
  /* Mitten im Klettern: was liegt an der Bildmitte oben, und was
     links und rechts am Bildrand daneben? */
  const mitte = async (wen, ziel, partner) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.waitForTimeout(400);
    await pg.evaluate(([w, z]) => window.DMA_PRUEFUNG.wirkung("leiter", w, "Alex", { ziel: z }), [wen, ziel]);
    await pg.waitForFunction(() => document.querySelector(".lc-leiter-weg"), { timeout: 4000 });
    await pg.waitForTimeout(1300);
    return pg.evaluate(([w, p]) => {
      const platzVon = (n) => [...document.querySelectorAll("#lcPlaetze .lc-platz")]
        .find((x) => (x.textContent || "").indexOf(n) >= 0);
      const pruefe = (name) => {
        const k = platzVon(name).querySelector(".lc-kreis");
        const r = k.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const oben = document.elementFromPoint(cx, cy);
        /* Die Leiter nimmt sonst keine Tipps an (pointer-events: none);
           fuer die Messung kurz einschalten und genau auf die HOLME
           zielen (viewBox-Stellen 3..10 und 70..77 von 80). Liegt dort gerade
           eine Sprosse ueber dem Holm, zaehlt sie genauso: sichtbar
           ist in beiden Faellen die Leiter, nicht das Bild. */
        const le = document.querySelector(".lc-leiter-weg");
        le.style.pointerEvents = "auto";
        const l = le.getBoundingClientRect();
        const links = document.elementFromPoint(l.left + l.width * 0.08, cy);
        const rechts = document.elementFromPoint(l.right - l.width * 0.08, cy);
        le.style.pointerEvents = "";
        return { bildOben: Boolean(oben && k.contains(oben)),
                 holmL: Boolean(links && links.closest && links.closest(".lc-leiter-weg")),
                 holmR: Boolean(rechts && rechts.closest && rechts.closest(".lc-leiter-weg")),
                 wasL: links && (links.tagName + "." + (links.getAttribute("class")||"")), wasR: rechts && (rechts.tagName + "." + (rechts.getAttribute("class")||"")),
                 bildB: Math.round(r.width), leiterB: Math.round(l.width), cy: Math.round(cy) };
      };
      return { er: pruefe(w), gegen: p ? pruefe(p) : null };
    }, [wen, partner]);
  };
  const e1 = await mitte("Bea", 6, null);
  sage(e1.er.bildOben, "Mitten im Klettern liegt das Bild VOR der Leiter");
  sage(e1.er.holmL && e1.er.holmR && e1.er.leiterB > e1.er.bildB,
    "... und links und rechts daneben sieht man die Holme",
    "Bild " + e1.er.bildB + " px, Leiter " + e1.er.leiterB + " px " + e1.er.wasL + " / " + e1.er.wasR);
  await pg.waitForTimeout(2600);

  const e2 = await mitte("Alex", 5, "Emmi");
  sage(e2.er.bildOben && e2.gegen && e2.gegen.bildOben,
    "Ziel besetzt: beide klettern, beide VOR der Leiter");
  sage(e2.gegen && e2.er.cy !== e2.gegen.cy && Math.abs(e2.er.cy - e2.gegen.cy) < 80,
    "... und sie sind sich unterwegs entgegengekommen", "Alex bei y=" + e2.er.cy + ", Emmi bei y=" + e2.gegen.cy);
  await pg.screenshot({ path: "/tmp/claude-0/leiter-tausch.png" });

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
