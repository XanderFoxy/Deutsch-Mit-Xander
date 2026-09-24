/* =====================================================================
   SONDE RUNDE 99 — ANGEL UND LASSO, AUCH WENN ZWEI GLEICHZEITIG WERFEN
   ---------------------------------------------------------------------
   XANDER: „man sieht die Angelschnur nicht … schraeg ausgeworfen in
   Richtung Ziel, der Haken beisst, das Bild wackelt, und dann wird es
   eingeholt … und keine Glitches, wenn wir uns gleichzeitig angeln"
   und „wenn wir uns gleichzeitig mit dem Lasso werfen … fliegen leere
   Lassos, und keiner wird gezogen … achte darauf, dass sich da nichts
   verknotet."
   GEMESSEN:
     1. Die Angel steht am Platz des ANGLERS (nicht des Zuschauers).
     2. Beim Auswurf ist der Haken unterwegs und bleibt im Bild.
     3. Beim Biss sitzt der Haken oben am Bild des Geangelten.
     4. Beim Einholen haengt er weiter oben am Bild — das Bild ist
        unterwegs, und die Schnur reicht bis zu ihm.
     5. Das Lasso kommt vom WERFER, auch auf fremden Geraeten.
     6. Zwei Lassos gleichzeitig (Alex auf Bea, Bea auf Alex): zwei
        Seile, keines loescht das andere, und Alex wird zu Bea gezogen.
     7. Vorfahrt: kommt ein Zug dazwischen, dessen Werfer die kleinere
        Kennung hat, laesst MEIN Geraet los (keine Sitzordnung); hat er
        die groessere, zieht meines durch.
     8. ZU ZWEIT REISEN („funktioniert nicht mehr"): eine Sitzordnung
        traegt nur noch die Plaetze, die sich JETZT aendern — und der,
        der losfaehrt, setzt beide in EINER Nachricht um. Gegenprobe:
        eine fremde Nachricht mit dem alten Platz des anderen setzt
        mich nicht mehr zurueck.
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
  console.log("RUNDE 99 — Angel und Lasso\n");
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

  /* Warten in SEITENZEIT — die Uhr der Seite laeuft unter Last langsamer. */
  const bis = (ms) => pg.waitForFunction((m) => performance.now() - window.__t0 >= m, ms,
    { timeout: 15000, polling: 16 });

  console.log("1  DIE ANGEL\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(400);
  const messen = () => pg.evaluate(() => {
    const reihe = document.getElementById("lcPlaetze").getBoundingClientRect();
    const platz = (n) => [...document.querySelectorAll("#lcPlaetze .lc-platz")]
      .find((x) => (x.textContent || "").indexOf(n) >= 0);
    const mitte = (n) => {
      const r = platz(n).querySelector(".lc-kreis").getBoundingClientRect();
      return { x: r.left + r.width / 2 - reihe.left, y: r.top + r.height / 2 - reihe.top,
               oben: r.top + r.height * 0.06 - reihe.top, b: r.width };
    };
    const griff = document.querySelector(".lc-an-griff");
    const haken = document.querySelector(".lc-an-haken");
    const schnur = document.querySelector(".lc-an-schnur");
    const m = haken && /translate\(([-\d.]+) ([-\d.]+)\)/.exec(haken.getAttribute("transform") || "");
    const k = platz("Dana").querySelector(".lc-kreis");
    return {
      bea: mitte("Bea"), alex: mitte("Alex"), dana: mitte("Dana"),
      griff: griff ? { x: Number(griff.getAttribute("x")) + Number(griff.getAttribute("width")) / 2,
                       y: Number(griff.getAttribute("y")) } : null,
      haken: m ? { x: Number(m[1]), y: Number(m[2]) } : null,
      schnurEnde: schnur ? (schnur.getAttribute("d") || "").trim().split(/\s+/).slice(-2).map(Number) : null,
      hoehe: reihe.height, breite: reihe.width,
      bewegt: getComputedStyle(k).transform
    };
  });
  await pg.evaluate(() => { window.__t0 = performance.now();
    window.DMA_PRUEFUNG.wirkung("heber", "Dana", "Bea", { ziel: 6 }); });
  await bis(500);
  const m1 = await messen();
  sage(m1.griff && Math.hypot(m1.griff.x - m1.bea.x, m1.griff.y - m1.bea.y) < m1.bea.b * 0.4,
    "Die Rute steht am Platz des Anglers (Bea), nicht am eigenen (Alex)",
    m1.griff ? Math.round(Math.hypot(m1.griff.x - m1.bea.x, m1.griff.y - m1.bea.y)) + " px von Beas Mitte" : "keine Rute");
  sage(m1.haken && m1.haken.x > m1.bea.x && m1.haken.x < m1.dana.x
    && m1.haken.y > -m1.bea.b * 0.3 && m1.haken.y < m1.hoehe,
    "Beim Auswurf fliegt der Haken zwischen Angler und Ziel und bleibt im Bild",
    m1.haken ? "x=" + Math.round(m1.haken.x) + " y=" + Math.round(m1.haken.y) : "-");
  await bis(1200);
  const m2 = await messen();
  const d2 = m2.haken ? Math.hypot(m2.haken.x - m2.dana.x, m2.haken.y - m2.dana.oben) : 999;
  sage(d2 < 6, "Beim Biss sitzt der Haken oben am Bild", Math.round(d2) + " px daneben");
  await bis(2300);
  const m3 = await messen();
  const d3 = m3.haken ? Math.hypot(m3.haken.x - m3.dana.x, m3.haken.y - m3.dana.oben) : 999;
  const ende = m3.schnurEnde || [];
  sage(m3.bewegt !== "none" && Math.hypot(m3.dana.x - m2.dana.x, m3.dana.y - m2.dana.y) > 20,
    "Beim Einholen ist das Bild unterwegs",
    Math.round(Math.hypot(m3.dana.x - m2.dana.x, m3.dana.y - m2.dana.y)) + " px weit");
  sage(d3 < 8 && m3.haken && Math.abs(ende[0] - m3.haken.x) < 1 && Math.abs(ende[1] - m3.haken.y) < 1,
    "... der Haken haengt weiter am Bild, und die Schnur endet genau am Haken",
    Math.round(d3) + " px");
  await pg.waitForTimeout(2600);

  console.log("\n2  DAS LASSO KOMMT VOM WERFER\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(400);
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("lasso", "Cem", "Bea"));
  await pg.waitForFunction(() => document.querySelector(".lc-leine-lasso"), { timeout: 4000 });
  const l1 = await pg.evaluate(() => {
    const reihe = document.getElementById("lcPlaetze").getBoundingClientRect();
    const mitteX = (n) => {
      const p = [...document.querySelectorAll("#lcPlaetze .lc-platz")]
        .find((x) => (x.textContent || "").indexOf(n) >= 0);
      const r = p.getBoundingClientRect();
      return r.left + r.width / 2 - reihe.left;
    };
    const l = document.querySelector(".lc-leine-lasso");
    return { start: parseFloat(l.style.left), bea: mitteX("Bea"), alex: mitteX("Alex") };
  });
  sage(Math.abs(l1.start - l1.bea) < 3, "Das Seil beginnt bei Bea (der wirft), nicht bei Alex (der zuschaut)",
    "Start x=" + Math.round(l1.start) + ", Bea " + Math.round(l1.bea) + ", Alex " + Math.round(l1.alex));
  await pg.waitForTimeout(3800);

  console.log("\n3  ZWEI LASSOS GLEICHZEITIG\n");
  await pg.evaluate(() => {
    window.DMA_PRUEFUNG.wirkung("lasso", "Bea", "Alex");
    window.DMA_PRUEFUNG.wirkung("lasso", "Alex", "Bea");
  });
  await pg.waitForTimeout(700);
  const l2 = await pg.evaluate(() => {
    const seile = document.querySelectorAll(".lc-leine-lasso").length;
    const alex = [...document.querySelectorAll("#lcPlaetze .lc-platz")]
      .find((x) => (x.textContent || "").indexOf("Alex") >= 0).querySelector(".lc-kreis");
    return { seile, gezogen: alex.classList.contains("lc-gezogen"),
             zux: parseFloat(alex.style.getPropertyValue("--zux")) || 0 };
  });
  sage(l2.seile === 2, "Zwei Seile — keines hat das andere geloescht", l2.seile + " Seile");
  sage(l2.gezogen && l2.zux > 0, "Alex wird gezogen, und zwar zu Bea hin (nach rechts)",
    "--zux " + l2.zux.toFixed(1) + " px");
  await pg.waitForTimeout(3600);

  console.log("\n4  VORFAHRT BEIM UMSETZEN\n");
  const vorfahrt = async (fremdId) => {
    await pg.evaluate(() => {
      const leute = {};
      ["Bea", "Cem", "Dana"].forEach((n, i) => {
        leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 };
      });
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex",
        seit: 1000, zuruecksetzen: true, leute: leute });
    });
    await pg.evaluate((f) => {
      window.__pakete = [];
      window.LiveChat.pruefPost((p) => window.__pakete.push(p));
      window.LiveChat.pruefBefehl("/lasso Bea");
      /* Genau jetzt kommt ein Zug eines anderen dazwischen, der Bea
         ebenfalls meint. */
      window.LiveChat.pruefEmpfangen({ von: f, name: "Zora", art: "text", chatArt: "aktion",
        text: "Zora zieht Bea mit dem Lasso", wirkung: "lasso", wen: "Bea", ziel: 7, id: "z" + f });
    }, fremdId);
    try {
      await pg.waitForFunction(() => (window.__pakete || []).some((p) => p.art === "sitzplatz"),
        { timeout: 4000, polling: 100 });
    } catch (e) {}
    return pg.evaluate(() => (window.__pakete || []).filter((p) => p.art === "sitzplatz").length);
  };
  const verliert = await vorfahrt("aaa");
  sage(verliert === 0, "Der andere hat die kleinere Kennung: mein Geraet laesst los",
    verliert + " Sitzordnung(en) hinausgegangen");
  const gewinnt = await vorfahrt("zzz");
  sage(gewinnt === 1, "Der andere hat die groessere Kennung: mein Geraet zieht durch",
    gewinnt + " Sitzordnung(en) hinausgegangen");

  console.log("\n5  ZU ZWEIT REISEN — DIE SITZORDNUNG\n");
  const zz = await pg.evaluate(() => {
    const leute = {};
    ["Bea", "Cem", "Dana"].forEach((n, i) => {
      leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 };
    });
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex",
      seit: 1000, zuruecksetzen: true, leute: leute });
    const pk = [];
    window.LiveChat.pruefPost((p) => pk.push(p));
    /* Erst ein alter Tausch, damit die Tabelle Eintraege fuer andere hat. */
    window.LiveChat.pruefBefehl("/tausch Cem");
    const erg = window.LiveChat.zuZweitSetzen(7, "Bea", 8);
    const wo = {};
    (window.LiveChat.pruefSitz({}).plaetze || []).forEach((p) => { if (!p.leer) wo[p.name] = p.nummer; });
    const letzte = pk.filter((p) => p.art === "sitzplatz").pop() || {};
    return { ok: erg && erg.ok, wo, schluessel: Object.keys(letzte.ordnung || {}).sort(),
             alle: pk.filter((p) => p.art === "sitzplatz").map((p) => Object.keys(p.ordnung || {}).length) };
  });
  sage(zz.ok && zz.wo.Alex === 7 && zz.wo.Bea === 8, "Der Losfahrer setzt beide um",
    "Alex " + zz.wo.Alex + ", Bea " + zz.wo.Bea);
  sage(zz.schluessel.join(",") === "ich,p0", "... in EINER Nachricht, die nur die beiden traegt",
    zz.schluessel.join(",") + " (Nachrichtengroessen: " + zz.alle.join("/") + ")");
  const zurueck = await pg.evaluate(() => {
    /* Eine Nachricht von Cem, die nur SEINEN Platz meldet, laesst
       Alex und Bea, wo sie sind. */
    window.LiveChat.pruefEmpfangen({ von: "p1", name: "Cem", art: "sitzplatz",
      ordnung: { p1: 5 }, text: "" });
    const wo = {};
    (window.LiveChat.pruefSitz({}).plaetze || []).forEach((p) => { if (!p.leer) wo[p.name] = p.nummer; });
    return wo;
  });
  sage(zurueck.Alex === 7 && zurueck.Bea === 8 && zurueck.Cem === 6,
    "Eine fremde Sitzmeldung setzt uns nicht zurueck",
    JSON.stringify(zurueck));

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
