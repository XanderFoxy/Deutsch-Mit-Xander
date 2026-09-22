/* =====================================================================
   SONDE RUNDE 83 — Frosch-Sprung und Zylinder mit Kaninchen
   ---------------------------------------------------------------------
   Die letzten beiden ANIMATIONEN aus Xanders Liste von Runde 76.
   Gemessen wird das Verhalten im Browser, nicht der Quelltext: wo der
   Frosch aufsetzt, ob seine Beine im Takt der Spruenge arbeiten, und
   ob der Zaubertrick wirklich in der richtigen Reihenfolge ablaeuft —
   Hut, Rauch, Pause, Hut, Kaninchen, Person.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

function tonMessen(name) {
  const roh = "/tmp/claude-0/pr83-" + name + ".raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", name + ".opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const n = b.length / 2, st = 1200, huelle = [];
  for (let i = 0; i < n; i += st) {
    let x = 0;
    for (let j = i; j < Math.min(n, i + st); j++) {
      const v = Math.abs(b.readInt16LE(j * 2)); if (v > x) x = v;
    }
    huelle.push(x ? Math.round(20 * Math.log10(x / 32768)) : -99);
  }
  return { dauer: n / 24000, huelle: huelle };
}

(async () => {
  console.log("RUNDE 83 — Frosch und Zauberzylinder");

  /* =================================================================
     1. DIE BEIDEN NEUEN GERAEUSCHE
     ================================================================= */
  console.log("\nToene");
  ["quaken", "zauberpuff"].forEach((n) => {
    sage(fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
      && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a")),
      "ton/" + n + " liegt als opus und m4a bereit");
  });
  const gl = fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8");
  sage(/\|quaken\|/.test(gl) && /\|zauberpuff\|/.test(gl),
    "und beide stehen in data-geraeusche.js");

  /* Ein Quaken ist eine PULSFOLGE mit Pausen dazwischen, kein
     Dauerton: drei Rufe muessen als drei Inseln messbar sein. */
  const q = tonMessen("quaken");
  let inseln = 0, drin = false;
  q.huelle.forEach((d) => {
    if (d > -40 && !drin) { inseln++; drin = true; }
    else if (d <= -40) drin = false;
  });
  sage(inseln === 3 && Math.abs(q.dauer - 1.8) < 0.15,
    "quaken sind drei getrennte Rufe in 1,8 s",
    inseln + " Rufe, " + q.dauer.toFixed(2) + " s");

  /* Der Zauberpuff hat ZWEI Puffs mit einer Stille dazwischen — sonst
     gibt es kein Verschwinden und kein Auftauchen, nur Geklingel. */
  const zp = tonMessen("zauberpuff");
  const mitte = zp.huelle.slice(24, 31).filter((d) => d < -40).length;
  sage(mitte >= 3 && Math.abs(zp.dauer - 2.4) < 0.15,
    "zauberpuff hat die Pause zwischen Verschwinden und Auftauchen",
    mitte + " stille Proben in der Mitte, " + zp.dauer.toFixed(2) + " s");

  /* =================================================================
     2. DER BROWSER
     ================================================================= */
  const srv = http.createServer((qq, a) => {
    let p = decodeURIComponent(qq.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  console.log("\nDer Frosch");
  const froschBahn = async (kette) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((k) => window.DMA_PRUEFUNG.wirkung("frosch", k, "Alex"), kette);
    await new Promise((f) => setTimeout(f, 180));
    const aus = await pg.evaluate(() => {
      const el = document.querySelector(".lc-frosch");
      if (!el) return null;
      const an = el.getAnimations().find((a) => a.effect && a.effect.getKeyframes().length > 3);
      if (!an) return null;
      an.pause();
      const bahn = [];
      for (let ms = 0; ms <= 4600; ms += 40) {
        an.currentTime = ms;
        const r = el.getBoundingClientRect();
        bahn.push([r.left + r.width / 2, r.top + r.height / 2]);
      }
      const beine = [...el.querySelectorAll(".lc-frosch-bein")]
        .map((b) => parseFloat(getComputedStyle(b).animationDuration));
      return { bahn: bahn, beine: beine, last: !!el.querySelector(".lc-frosch-last"),
               auge: !!el.querySelector("circle[r='8.4']") };
    });
    await new Promise((f) => setTimeout(f, 4000));
    return aus;
  };
  /* Erst die Buehne bauen, DANN messen: ohne diesen Aufruf gibt es
     noch gar keine Plaetze, und die Messung sucht eine leere Liste ab. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* Die Plaetze der Pruefbuehne — nur die mit einer Nummer: im
     echten Raum stehen weitere .lc-platz ohne data-lc-platz, und ohne
     diesen Filter sucht die Messung einen Platz, den es nicht gibt. */
  const gitter = await pg.evaluate(() =>
    [...document.querySelectorAll("#lcPlaetze .lc-platz")]
      .map((p) => { const r = p.getBoundingClientRect();
        return { nr: +p.dataset.lcPlatz, x: r.left + r.width / 2, y: r.top + r.height / 2 }; })
      .filter((g) => g.nr > 0));
  const nahBei = (bahn, nr) => { const g = gitter.find((q2) => q2.nr === nr);
    return Math.min(...bahn.map((p) => Math.hypot(p[0] - g.x, p[1] - g.y))); };

  const gerade = await froschBahn("8");
  sage(gerade && gerade.last && gerade.auge,
    "der Frosch traegt das Profilbild und hat sein Auge oben auf dem Kopf");
  sage(gerade && gerade.beine.length === 2 && gerade.beine.every((x) => x > 0.3),
    "und seine Hinterbeine arbeiten im Takt der Spruenge",
    gerade ? gerade.beine.map((x) => x.toFixed(2) + " s").join(" / ") : "-");
  const mitWeg = await froschBahn("1-6-7-8");
  const trefferM = [6, 7].map((nr) => nahBei(mitWeg.bahn, nr));
  const trefferO = [6, 7].map((nr) => nahBei(gerade.bahn, nr));
  sage(Math.max(...trefferM) < 12 && Math.max(...trefferO) > 25,
    "mit gemaltem Weg setzt er auf jeder Station auf",
    "mit Weg " + trefferM.map((x) => x.toFixed(1)).join(" / ")
    + " px, ohne Weg " + trefferO.map((x) => x.toFixed(1)).join(" / ") + " px");

  console.log("\nDer Zauberzylinder");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("zylinder", "8", "Alex"));
  const t0 = Date.now();
  const sicht = [];
  for (const wann of [300, 900, 1500, 2100, 2700, 3300, 3900, 4500]) {
    while (Date.now() - t0 < wann) await new Promise((f) => setTimeout(f, 20));
    sicht.push(await pg.evaluate(() => {
      const d = (s) => { const e = document.querySelector(s);
        return e ? +(+getComputedStyle(e).opacity).toFixed(2) : -1; };
      return { hutA: d(".lc-zylinder-ab"), hutB: d(".lc-zylinder-an"),
               hase: d(".lc-zyl-hase"), last: d(".lc-zyl-last"),
               rauch: document.querySelectorAll(".lc-zyl-rauch").length };
    }));
  }
  const zeige = (k) => sicht.map((x) => x[k]).join(" ");
  /* 1. Zuerst der Hut am Startplatz. */
  sage(sicht[0].hutA > 0.5 && sicht[0].hutB < 0.5 && sicht[0].last < 0.5,
    "zuerst steht nur der Hut ueber dem Startplatz", "HutA " + zeige("hutA"));
  /* 2. Dann eine Pause, in der GAR NICHTS zu sehen ist. */
  const leer = sicht.filter((x) => x.hutA < 0.1 && x.hutB < 0.1
                                && x.hase < 0.1 && x.last < 0.1).length;
  sage(leer >= 1, "dann ist einen Augenblick lang gar nichts da (das Verschwinden)",
    leer + " von 8 Proben leer");
  /* 3. Das Kaninchen kommt VOR der Person. */
  const hasenErst = sicht.findIndex((x) => x.hase > 0.5);
  const personErst = sicht.findIndex((x) => x.last > 0.5);
  sage(hasenErst >= 0 && personErst >= 0 && hasenErst < personErst,
    "das Kaninchen kommt vor der Person heraus",
    "Hase ab Probe " + hasenErst + ", Person ab Probe " + personErst);
  /* 4. Und die Person steigt aus einem Hut, der noch da ist. */
  sage(sicht[personErst].hutB > 0.05,
    "und der Hut steht noch, wenn sie heraussteigt",
    "HutB dabei " + sicht[personErst].hutB);
  sage(sicht[0].rauch === 2, "zwei Rauchwolken: eine hier, eine drueben",
    sicht[0].rauch + " Wolken");
  /* 5. Der Kopf des Kaninchens darf nicht im Zylinder stecken. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("zylinder", "8", "Alex"));
  await new Promise((f) => setTimeout(f, 3050));
  const kopf = await pg.evaluate(() => {
    const h = document.querySelector(".lc-zyl-hase");
    const z = document.querySelector(".lc-zylinder-an");
    if (!h || !z) return null;
    const k = h.querySelector("circle[r='17']");
    const kr = z.querySelector("rect");
    if (!k || !kr) return null;
    return { kopfOben: k.getBoundingClientRect().top,
             kopfUnten: k.getBoundingClientRect().bottom,
             kroneOben: kr.getBoundingClientRect().top };
  });
  sage(kopf && kopf.kopfOben < kopf.kroneOben - 20,
    "der Kopf steht ueber der Zylinderoeffnung, nicht darin",
    kopf ? "Kopf " + Math.round(kopf.kopfOben) + " bis " + Math.round(kopf.kopfUnten)
      + " px, Zylinderrand bei " + Math.round(kopf.kroneOben) + " px" : "nicht messbar");

  /* --- Und die Befehle kommen an ---------------------------------- */
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/frosch:   \{ wirkung: "frosch"/.test(lc) && /zylinder: \{ wirkung: "zylinder"/.test(lc),
    "beide haben einen eigenen Befehl");
  sage(/art === "frosch"\)/.test(lc),
    "und der Frosch nimmt auch den gemalten Weg an");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
