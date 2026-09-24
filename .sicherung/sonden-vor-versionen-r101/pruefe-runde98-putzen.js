#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DRECK BLEIBT LIEGEN, UND MAN KANN IHN WEGPUTZEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Dann haette ich gern noch alternativen
   Putzlappen, der die Scheibe wischt. Also alternativ zum
   Scheibenwischer. Und beim Scheibenwischer: wenn man ueber ein
   draufgespritztes Bild wischt, dann darf die Grundeinstellung von dem
   Dreck nicht da sein, dann muss er nur den Smiley wegwischen …
   Die Leute muessen das selber putzen entweder mit dem Scheibenwischer
   oder mit dem Schwamm, ja vielleicht ist dabei auch noch ein Eimer
   Wasser daneben, wo der Schwamm dann in den Eimer Wasser geht und dann
   wischt man die Scheibe und dann quietscht es so … oder alternativ
   dran spucken und wegputzen, und saemtlicher Dreck, der erzeugt wird
   wie durch die Vogelkacke oder irgendwas anderes, das koennen wir
   wieder sauber putzen."

   VIER MESSUNGEN:
     1. Die Vogelkacke bleibt liegen — auch nach dem Neuzeichnen.
     2. Der Schwamm holt den Eimer, wischt und macht sauber.
     3. Lappen und Spucke machen dasselbe, sehen aber anders aus.
     4. Der Scheibenwischer malt sich KEINEN eigenen Dreck mehr hin,
        wenn schon etwas auf der Scheibe liegt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nDIE VOGELKACKE BLEIBT LIEGEN\n");
  const kot = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const bea = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    window.DMA_PRUEFUNG.wirkung("vogelkot", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 4200));
    const nachEffekt = bea().querySelectorAll(".lc-dreckfleck").length;
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 400));
    return { nachEffekt: nachEffekt,
             nachNeuZeichnen: bea().querySelectorAll(".lc-dreckfleck").length };
  });
  sage(kot.nachEffekt >= 1, "der Vogel hinterlaesst einen Fleck",
    kot.nachEffekt + " Fleck(en)");
  sage(kot.nachNeuZeichnen >= 1, "und der bleibt auch nach dem Neuzeichnen liegen",
    kot.nachNeuZeichnen + " Fleck(en)");

  console.log("\nDER SCHWAMM MIT DEM EIMER\n");
  const schwamm = await pg.evaluate(async () => {
    const bea = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    window.DMA_PRUEFUNG.wirkung("putzen", "Bea", "Alex", { stueck: "schwamm" });
    let eimer = 0, zeug = 0;
    for (let i = 0; i < 16; i++) {
      await new Promise((f) => setTimeout(f, 120));
      eimer = Math.max(eimer, document.querySelectorAll(".lc-putz-eimer").length);
      zeug = Math.max(zeug, document.querySelectorAll(".lc-putzzeug-schwamm").length);
    }
    await new Promise((f) => setTimeout(f, 2200));
    return { eimer: eimer, zeug: zeug,
             flecken: bea().querySelectorAll(".lc-dreckfleck").length };
  });
  sage(schwamm.eimer >= 1, "der Wassereimer steht daneben", schwamm.eimer + " Eimer");
  sage(schwamm.zeug >= 1, "der Schwamm wischt", schwamm.zeug + " Schwamm");
  sage(schwamm.flecken === 0, "und danach ist die Scheibe sauber",
    schwamm.flecken + " Flecken uebrig");

  console.log("\nLAPPEN UND SPUCKE\n");
  for (const [zeug, wahl] of [["lappen", ".lc-putzzeug-lappen"],
                              ["spucke", ".lc-putzzeug-spucke"]]) {
    const e = await pg.evaluate(async ([zeug, wahl]) => {
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.wirkung("vogelkot", "Cem", "Alex", {});
      await new Promise((f) => setTimeout(f, 4200));
      const cem = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
        ((p.querySelector(".lc-platz-name") || {}).textContent || "")
          .toLowerCase().indexOf("cem") >= 0)[0];
      const vorher = cem().querySelectorAll(".lc-dreckfleck").length;
      window.DMA_PRUEFUNG.wirkung("putzen", "Cem", "Alex", { stueck: zeug });
      let gesehen = 0, spucke = 0;
      for (let i = 0; i < 16; i++) {
        await new Promise((f) => setTimeout(f, 120));
        gesehen = Math.max(gesehen, document.querySelectorAll(wahl).length);
        spucke = Math.max(spucke, document.querySelectorAll(".lc-putz-spucke").length);
      }
      await new Promise((f) => setTimeout(f, 2200));
      return { vorher: vorher, gesehen: gesehen, spucke: spucke,
               nachher: cem().querySelectorAll(".lc-dreckfleck").length };
    }, [zeug, wahl]);
    sage(e.vorher >= 1 && e.gesehen >= 1 && e.nachher === 0,
      "/putzen " + zeug + " macht sauber",
      e.vorher + " Flecken → " + e.nachher + (zeug === "spucke"
        ? ", " + e.spucke + " Spucker" : ""));
  }

  console.log("\nDER SCHEIBENWISCHER MALT SICH KEINEN DRECK MEHR HIN\n");
  const wischer = await pg.evaluate(async () => {
    /* 1. Auf sauberer Scheibe darf er seinen Dreck zeigen — das ist
       der alte Gag und der bleibt. */
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("wischer", "Dana", "Alex", {});
    await new Promise((f) => setTimeout(f, 500));
    const sauber = document.querySelectorAll(".lc-wischer-klecks").length;
    await new Promise((f) => setTimeout(f, 4200));
    /* 2. Liegt aber ein aufgespruehtes Bild darauf, wischt er NUR das
       weg. */
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Emmi", "Alex", { stueck: "herz" });
    await new Promise((f) => setTimeout(f, 7200));
    window.DMA_PRUEFUNG.wirkung("wischer", "Emmi", "Alex", {});
    await new Promise((f) => setTimeout(f, 500));
    const dreckig = document.querySelectorAll(".lc-wischer-klecks").length;
    await new Promise((f) => setTimeout(f, 3600));
    const emmi = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("emmi") >= 0)[0];
    return { sauber: sauber, dreckig: dreckig,
             lack: emmi ? emmi.querySelectorAll(".lc-sprayfarbe").length : -1 };
  });
  sage(wischer.sauber >= 10, "auf sauberer Scheibe bringt er seinen eigenen Dreck mit",
    wischer.sauber + " Kleckse");
  sage(wischer.dreckig === 0,
    "auf einer bespruehten Scheibe aber NICHT — er wischt nur das Motiv weg",
    wischer.dreckig + " Kleckse");
  sage(wischer.lack === 0, "und danach ist der Lack ab", wischer.lack + " Lackschichten");

  console.log("\nRUNDE 100 — GEWISCHT WIRD, WO DER SCHWAMM IST\n");
  /* XANDER (Walkie #75): „das Abputzen mit dem Putzwerkzeug sieht noch
     nicht realistisch aus." Vorher verschwand der Lack bei 1,75 s auf
     einen Schlag — mitten im zweiten von drei Zuegen. Jetzt: waehrend
     der Zuege wird er Stueck fuer Stueck ausgespart (Maske), und weg ist
     er erst nach dem letzten Zug. */
  const pgW = await br.newPage({ viewport: { width: 390, height: 844 } });
  await pgW.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pgW.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pgW.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEFUNG, { timeout: 25000 });
  const wi = await pgW.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 300));
    window.DMA_PRUEFUNG.wirkung("spray", "Bea", "Alex", { stueck: "herz" });
    await new Promise((f) => setTimeout(f, 4200));
    const platz = [...document.querySelectorAll(".lc-platz")].find((p) => /Bea/.test(p.textContent));
    window.DMA_PRUEFUNG.wirkung("putzen", "Bea", "Alex", { stueck: "schwamm" });
    const t0 = performance.now(), stufen = [];
    let weg = 0;
    while (performance.now() - t0 < 3300) {
      const t = performance.now() - t0;
      const lack = platz.querySelector(".lc-sprayfarbe:not(.lc-sprayfarbe-geht)");
      const m = lack ? (lack.style.maskImage || lack.style.webkitMaskImage || "") : "";
      const n = (decodeURIComponent(m).match(/<ellipse/g) || []).length;
      if (!lack && !weg) weg = Math.round(t);
      if (stufen.length === 0 || stufen[stufen.length - 1][1] !== n) stufen.push([Math.round(t), n, !!lack]);
      await new Promise((f) => setTimeout(f, 50));
    }
    return { stufen, weg };
  });
  await pgW.close();
  const mitte = wi.stufen.filter((x) => x[0] > 1000 && x[0] < 2400 && x[2]);
  sage(mitte.length >= 3 && mitte[mitte.length - 1][1] > mitte[0][1],
    "waehrend der Zuege wird der Lack Stueck fuer Stueck weggewischt",
    mitte.map((x) => x[0] + "ms:" + x[1]).slice(0, 6).join(" "));
  sage(wi.weg === 0 || wi.weg > 2500, "ganz weg erst nach dem letzten Zug (2,6 s)",
    wi.weg ? "weg bei " + wi.weg + " ms" : "bis 3,3 s ausgeblendet");

  /* ===================================================================
     RUNDE 101 — DIE WASCHMASCHINE
     XANDER (Funk #39): „Ich möchte eine Waschmaschine als Profilbild
     Effekt wo der andere richtig durchgewirbelt wird".
     =================================================================== */
  console.log("\nDIE WASCHMASCHINE\n");
  const pgM = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pgM.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pgM.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pgM.waitForFunction(() => window.DMA_PRUEF && window.LiveChat && window.LiveChat.pruefSitz,
    { timeout: 20000 });
  const wm = await pgM.evaluate(async () => {
    /* Im ECHTEN Raum: auf der Pruefbuehne sind die Kreise leer, dort
       gaebe es nichts zu wirbeln. */
    const leute = {};
    ["Bea", "Cem"].forEach((n, i) => { leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 }; });
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 800));
    const platz = [...document.querySelectorAll("#lcPlaetze .lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    const kreis = platz.querySelector(".lc-kreis");
    const bild = [...kreis.querySelectorAll("img, video, .lc-initial")]
      .filter((e) => getComputedStyle(e).display !== "none")[0];
    window.DMA_TONLOG = [];
    const t0 = performance.now();
    window.DMA_PRUEFUNG.wirkung("waschmaschine", "Bea", "Alex", {});
    const proben = [];
    while (performance.now() - t0 < 6000) {
      const ms = Math.round(performance.now() - t0);
      const rk = kreis.getBoundingClientRect();
      const tuer = platz.querySelector(".lc-wasch-tuer");
      const rt = tuer ? tuer.getBoundingClientRect() : null;
      const wasser = platz.querySelector(".lc-wasch-wasser");
      const rw = wasser ? wasser.getBoundingClientRect() : null;
      const m = bild ? new DOMMatrix(getComputedStyle(bild).transform === "none"
        ? undefined : getComputedStyle(bild).transform) : new DOMMatrix();
      const blasen = [...platz.querySelectorAll(".lc-wasch-blase")]
        .filter((b) => Number(getComputedStyle(b).opacity) > 0.05).length;
      proben.push({
        ms: ms,
        da: !!platz.querySelector(".lc-wasch-maschine"),
        /* Wie weit liegt die Mitte der Tuer neben der Mitte des Bildes? */
        mitteAb: rt ? Math.round(Math.hypot((rt.left + rt.width / 2) - (rk.left + rk.width / 2),
                                            (rt.top + rt.height / 2) - (rk.top + rk.height / 2))) : null,
        tuerBreit: rt ? Math.round(rt.width / rk.width * 100) : 0,
        /* Wasserspiegel in % der Bildhoehe von unten (Wellen reichen etwas hoeher). */
        wasser: rw ? Math.max(0, Math.round((rk.bottom - rw.top) / rk.height * 100)) : 0,
        winkel: Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI),
        blasen: blasen
      });
      await new Promise((f) => requestAnimationFrame(f));
    }
    const toene = (window.DMA_TONLOG || []).map((t) => [t.name, Math.round(t.wann - t0)]);
    return { proben, toene, bildDa: !!bild,
             nachher: bild ? getComputedStyle(bild).transform : "?" };
  });
  await pgM.close();
  const P = wm.proben;
  const bei = (a, b) => P.filter((p) => p.ms >= a && p.ms <= b);
  sage(wm.bildDa && P.length > 100, "Die Waschmaschine liess sich abtasten", P.length + " Bilder");
  sage(bei(100, 5400).every((p) => p.da), "Die Maschine steht die ganze Zeit um das Bild");
  sage(bei(5750, 6000).every((p) => !p.da), "und ist danach wieder weg");
  const zu = bei(900, 4800);
  const schief = Math.max(...zu.map((p) => p.mitteAb));
  sage(zu.length && schief <= 3, "Die Tuer sitzt genau auf dem Bild (auch beim Ruetteln)",
    "hoechstens " + schief + " px daneben");
  sage(zu.every((p) => p.tuerBreit >= 120 && p.tuerBreit <= 136),
    "Die Tuer ist zu (volle Breite) von 0,9 bis 4,8 s",
    Math.min(...zu.map((p) => p.tuerBreit)) + "–" + Math.max(...zu.map((p) => p.tuerBreit)) + " %");
  sage(bei(100, 300).every((p) => p.tuerBreit < 60), "Am Anfang steht die Tuer offen",
    bei(100, 300).map((p) => p.tuerBreit).slice(0, 3).join("/") + " %");
  const vollW = bei(1600, 3100).map((p) => p.wasser);
  sage(vollW.length && Math.min(...vollW) >= 20, "Beim Waschen steht Wasser im Bullauge",
    Math.min(...vollW) + "–" + Math.max(...vollW) + " % hoch");
  sage(P.every((p) => p.wasser <= 45), "Die Mitte des Gesichts bleibt immer ueber dem Wasser",
    "hoechstens " + Math.max(...P.map((p) => p.wasser)) + " %");
  sage(bei(3600, 5600).every((p) => p.wasser <= 2), "Beim Schleudern ist das Wasser abgepumpt");
  sage(bei(1700, 3000).some((p) => p.blasen >= 4), "Beim Waschen schaeumt es",
    Math.max(...bei(1700, 3000).map((p) => p.blasen)) + " Blaeschen");
  sage(bei(3450, 6000).every((p) => p.blasen === 0), "Kein Schaum schwebt im Trockenen");
  const wasch = bei(1500, 3100).map((p) => p.winkel);
  sage(Math.min(...wasch) <= -100 && Math.max(...wasch) >= 90,
    "Beim Waschen wirbelt das Bild hin und her", Math.min(...wasch) + "° bis " + Math.max(...wasch) + "°");
  /* Beim Schleudern: der Winkel springt zwischen zwei Bildern weit — so
     schnell dreht es sich. */
  const schl = bei(3300, 4700);
  let wechsel = 0;
  for (let i = 1; i < schl.length; i++) {
    if (Math.sign(schl[i].winkel) !== Math.sign(schl[i - 1].winkel)) wechsel++;
  }
  sage(wechsel >= 6, "Beim Schleudern dreht es sich mehrmals ganz herum", wechsel + " Halbdrehungen gezaehlt");
  sage(wm.nachher === "none", "Am Ende steht das Bild wieder gerade", wm.nachher);
  const ton = (n) => (wm.toene.find((t) => t[0] === n) || [n, -1])[1];
  /* RUNDE 101 — ein eigener Waschmaschinen-Ton (Xander: „Echten
     Waschmaschinen-Ton machen"), schon auf die Phasen geschnitten; er
     beginnt mit der Animation. */
  sage(ton("waschmaschine") >= 0 && ton("waschmaschine") <= 150, "Der eigene Waschmaschinen-Ton beginnt mit der Animation",
    ton("waschmaschine") + " ms");

  /* ===================================================================
     RUNDE 101 — DER AUFZIEH-HOT-ROD
     XANDER (Funk #40): „… das Profilbild auf zwei Mini-Rädern mit den
     seitlich verchromten Auspüffen eines Hot Rods, mit ganz viel Dampf,
     der die anderen Gesichter der anwesenden Teilnehmer bleibend
     schmutzig macht."
     =================================================================== */
  console.log("\nDER AUFZIEH-HOT-ROD\n");
  const pgR = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pgR.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pgR.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pgR.waitForFunction(() => window.DMA_PRUEF && window.LiveChat && window.LiveChat.pruefSitz, { timeout: 20000 });
  const hr = await pgR.evaluate(async () => {
    const leute = {};
    ["Bea", "Cem", "Dana", "Emil"].forEach((n, i) => { leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 }; });
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 800));
    const reihe = document.getElementById("lcPlaetze");
    const platzVon = (n) => [...reihe.querySelectorAll(".lc-platz")].find((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "").replace(/\s*\(du\)\s*$/i, "").trim() === n);
    const kreis = platzVon("Bea").querySelector(".lc-kreis");
    const k0 = kreis.getBoundingClientRect();
    window.DMA_TONLOG = [];
    const t0 = performance.now();
    window.LiveChat.pruefBefehl("/hotrod Bea x3");
    const text = ((window.LiveChat.lage().nachrichten || []).slice(-1)[0] || {}).text || "";
    let raeder = 0, rohre = 0, schluessel = 0, dampf = 0, weit = 0, kippMax = 0;
    while (performance.now() - t0 < 5600) {
      const t = performance.now() - t0, r = kreis.getBoundingClientRect(), g = reihe.getBoundingClientRect();
      raeder = Math.max(raeder, document.querySelectorAll(".lc-hr-rad").length);
      rohre = Math.max(rohre, document.querySelectorAll(".lc-hr-rohr").length);
      schluessel = Math.max(schluessel, document.querySelectorAll(".lc-hr-schluessel").length);
      dampf = Math.max(dampf, [...document.querySelectorAll(".lc-hr-dampf")].filter((c) => Number(c.style.opacity) > 0.1).length);
      weit = Math.max(weit, Math.hypot(r.left - k0.left, r.top - k0.top - 0));
      const m = new DOMMatrix(getComputedStyle(kreis).transform === "none" ? undefined : getComputedStyle(kreis).transform);
      kippMax = Math.max(kippMax, Math.abs(Math.atan2(m.b, m.a) * 180 / Math.PI));
      await new Promise((f) => requestAnimationFrame(f));
    }
    const k1 = kreis.getBoundingClientRect();
    const russ = {};
    ["Alex", "Bea", "Cem", "Dana", "Emil"].forEach((n) => {
      const flecken = [...platzVon(n).querySelectorAll(".lc-dreck-russ")];
      russ[n] = { zahl: flecken.length,
        mitte: flecken.filter((f) => Math.hypot(parseFloat(f.style.left) - 50, parseFloat(f.style.top) - 50) < 25).length };
    });
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 400));
    const nachNeu = platzVon("Cem").querySelectorAll(".lc-dreck-russ").length;
    window.DMA_PRUEFUNG.wirkung("putzen", "Cem", "Alex", { stueck: "schwamm" });
    await new Promise((f) => setTimeout(f, 3600));
    const nachPutzen = platzVon("Cem").querySelectorAll(".lc-dreck-russ").length;
    return { text, raeder, rohre, schluessel, dampf, weit: Math.round(weit), kippMax: Math.round(kippMax),
             zurueck: Math.round(Math.hypot(k1.left - k0.left, k1.top - k0.top)), breite: k0.width,
             russ, nachNeu, nachPutzen, weg: !document.querySelector(".lc-hotrod-buehne"),
             toene: (window.DMA_TONLOG || []).map((x) => [x.name, Math.round(x.wann - t0)]) };
  });
  await pgR.close();
  sage(/zieht Bea 3× auf .* Hot Rod/.test(hr.text), "die Zeile sagt, was passiert", hr.text.trim());
  sage(hr.raeder === 2 && hr.rohre >= 3 && hr.schluessel === 1,
    "zwei Mini-Raeder, verchromte Auspuffe, ein Aufziehschluessel", hr.raeder + " Raeder, " + hr.rohre + " Rohre, " + hr.schluessel + " Schluessel");
  sage(hr.dampf >= 8, "es dampft kraeftig", "bis " + hr.dampf + " Wolken gleichzeitig");
  sage(hr.weit > hr.breite * 2, "er flitzt wirklich los (nicht nur auf der Stelle)", hr.weit + " px weit");
  sage(hr.kippMax <= 7, "das Bild (der Fahrer) dreht sich nie, es kippt nur leicht", "hoechstens " + hr.kippMax + "°");
  sage(hr.zurueck <= 2 && hr.weg, "am Ende steht er wieder auf seinem Platz, die Zeichnung ist weg", hr.zurueck + " px daneben");
  const andereR = ["Alex", "Cem", "Dana", "Emil"];
  sage(andereR.every((n) => hr.russ[n].zahl >= 1), "alle anderen haben Russ im Gesicht",
    andereR.map((n) => n + " " + hr.russ[n].zahl).join(", "));
  sage(hr.russ.Bea.zahl === 0, "der Fahrer selbst bleibt sauber", hr.russ.Bea.zahl + " Flecken");
  sage(andereR.every((n) => hr.russ[n].mitte === 0), "die Mitte der Gesichter bleibt frei (kein Fleck naeher als 25 %)");
  sage(hr.nachNeu >= 1, "der Russ bleibt auch nach dem Neuzeichnen", hr.nachNeu + " Flecken");
  sage(hr.nachPutzen === 0, "und geht mit dem Schwamm wieder weg", hr.nachPutzen + " Flecken");
  const tonR = (n) => (hr.toene.find((x) => x[0] === n) || [n, -1])[1];
  /* RUNDE 101 — das Aufziehen dauert jetzt je Umdrehung 0,55 s (Funk 67:
     „zieht gar nicht in den benannten Zahlen auf"): bei 3× also
     350 + 3 · 550 = 2000 ms bis zum Loslassen. */
  sage(tonR("aufziehen") >= 0 && tonR("aufziehen") <= 120 && Math.abs(tonR("luftraus") - 2000) <= 120 && Math.abs(tonR("rennauto") - 2060) <= 120,
    "Ratschen beim Aufziehen, Zischen beim Loslassen, Motor beim Flitzen",
    tonR("aufziehen") + " / " + tonR("luftraus") + " / " + tonR("rennauto") + " ms");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
