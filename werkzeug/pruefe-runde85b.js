/* =====================================================================
   SONDE RUNDE 85, ZWEITER TEIL
   ---------------------------------------------------------------------
   Gemessen wird, was Xander in Runde 85 genannt hat und was in Runde 86
   nachgezogen wurde: der Popo beim Klaps, die Gluehbirne (zweiter
   Druck und Schraeglage), die Augen und die Dunkelheit ueber der
   ganzen Seite, die Schneekugel mit Sockel, der Frosch in Sprung-
   richtung mit einem sauberen Quaken und die Schwingen des Adlers.
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

(async () => {
  console.log("RUNDE 85, zweiter Teil");
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
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({ t: Math.round(performance.now()),
        n: (this.currentSrc || this.src || "").split("/").pop().split("?")[0]
             .replace(/\.(opus|m4a)$/, "") });
      return ap.call(this);
    };
  });
  const buehne = () => pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* =================================================================
     1. DER POPO BEIM KLAPS
     ================================================================= */
  console.log("\nDer Klaps");
  await buehne();
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-platz")[1].dataset.lcGeschlecht = "w";
    document.querySelectorAll(".lc-platz")[2].dataset.lcGeschlecht = "m";
    window.DMA_PRUEFUNG.wirkung("klaps", "Bea", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("klaps", "Cem", "Alex", {});
  });
  await pg.waitForTimeout(700);
  const popo = await pg.evaluate(() => {
    const hol = (i) => {
      const pl = document.querySelectorAll(".lc-platz")[i];
      const p = pl.querySelector(".lc-popo");
      if (!p) return null;
      const leib = p.querySelector(".lc-popo-leib").getAttribute("d");
      const zahlen = leib.match(/-?\d+(\.\d+)?/g).map(Number);
      /* Im Pfad steht immer ein Paar: x, dann y. Die x-Werte sind also
         die geraden Stellen — und der kleinste davon ist die breiteste
         Stelle der Huefte (links). */
      const ecke = zahlen.filter((_, i) => i % 2 === 0);
      const backe = p.querySelector(".lc-popo-backe");
      return { da: true, frau: p.classList.contains("lc-popo-frau"),
               /* Die erste Zahl im Pfad ist die linke Taille. */
               taille: ecke[0], breiteste: Math.min.apply(null, ecke.slice(0, 8)),
               backeRx: +backe.getAttribute("rx"),
               backen: pl.querySelectorAll(".lc-popo-backe").length,
               imBild: !!pl.querySelector(".lc-zp-blende .lc-popo") };
    };
    return { w: hol(1), m: hol(2) };
  });
  sage(popo.w && popo.m && popo.w.da && popo.m.da && popo.w.backen === 2,
    "beim Klaps ist jetzt ein Popo zu sehen, mit zwei Backen");
  sage(popo.w && popo.m && popo.w.frau && !popo.m.frau
    && popo.w.breiteste < popo.m.breiteste && popo.w.backeRx > popo.m.backeRx,
    "und er ist verschieden, je nach eingestelltem Geschlecht",
    popo.w ? ("Frau: Huefte bis " + popo.w.breiteste + ", Backe " + popo.w.backeRx
      + " — Mann: Huefte bis " + popo.m.breiteste + ", Backe " + popo.m.backeRx) : "-");
  sage(popo.w && popo.w.imBild, "und er liegt IM Bild, in der runden Blende");
  await pg.waitForTimeout(1700);

  /* =================================================================
     2. DIE GLUEHBIRNE
     ================================================================= */
  console.log("\nDie Gluehbirne");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("gluehbirne", "Bea", "Alex", {}));
  await pg.waitForTimeout(4300);
  const anEins = await pg.evaluate(() =>
    document.querySelectorAll(".lc-platz")[1].querySelector(".lc-kreis")
      .classList.contains("lc-birne-an"));
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("gluehbirne", "Bea", "Alex", {}));
  await pg.waitForTimeout(4300);
  const anZwei = await pg.evaluate(() =>
    document.querySelectorAll(".lc-platz")[1].querySelector(".lc-kreis")
      .classList.contains("lc-birne-an"));
  sage(anEins && anZwei,
    "zweimal „Birne an“ laesst sie an — ausgedreht wird mit /birneraus",
    "erster Druck: " + anEins + ", zweiter: " + anZwei);
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const endWinkel = (css.match(/100% \{ transform: rotate\((\d+)deg\) scale\(1\); filter: brightness\(1\); \}/) || [])[1];
  sage(endWinkel && Number(endWinkel) % 360 === 0,
    "und am Ende steht sie gerade, nicht schraeg",
    endWinkel + " Grad = " + (Number(endWinkel) / 360) + " volle Umdrehungen");
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("birneraus", "Bea", "Alex", {}));
  await pg.waitForTimeout(900);

  /* =================================================================
     3. AUGEN UND DUNKELHEIT GELTEN DER GANZEN SEITE
     ================================================================= */
  console.log("\nDie ganze Seite");
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("augen", "", "Alex", {}));
  await pg.waitForTimeout(600);
  const augen = await pg.evaluate(() => {
    const a = document.getElementById("lcAugen");
    const heim = a && a.parentElement;
    const r = a ? a.getBoundingClientRect() : null;
    return {
      imSeitenheim: !!heim && heim.id === "lcSeitenBuehne",
      heimVerformt: heim ? getComputedStyle(heim).transform : "?",
      deckt: r ? [Math.round(r.width - window.innerWidth),
                  Math.round(r.height - window.innerHeight)] : null
    };
  });
  sage(augen.imSeitenheim && augen.heimVerformt === "none",
    "die Augen haengen an der Seite und nicht an der Karte — dort ist „fixed“ wieder fixed",
    "Zuhause verformt: " + augen.heimVerformt);
  sage(augen.deckt && Math.abs(augen.deckt[0]) <= 1 && Math.abs(augen.deckt[1]) <= 1,
    "und sie decken das ganze Fenster",
    augen.deckt ? augen.deckt.join(" / ") + " px Unterschied" : "-");
  /* Und beim Rollen bleiben sie stehen. */
  const vorher = await pg.evaluate(() => {
    const p = document.querySelector("#lcAugen .lc-augenpaar");
    return p ? Math.round(p.getBoundingClientRect().top) : null;
  });
  await pg.evaluate(() => window.scrollBy(0, 220));
  await pg.waitForTimeout(220);
  const nachher = await pg.evaluate(() => {
    const p = document.querySelector("#lcAugen .lc-augenpaar");
    return p ? Math.round(p.getBoundingClientRect().top) : null;
  });
  sage(vorher !== null && nachher !== null && Math.abs(vorher - nachher) <= 2,
    "beim Rollen springen sie nicht mehr",
    "vor dem Rollen " + vorher + " px, danach " + nachher + " px");
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(600);
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("finsternis", "", "Alex", {}));
  await pg.waitForTimeout(500);
  const dunkel = await pg.evaluate(() => {
    const d = document.getElementById("lcDunkel");
    const heim = d && d.parentElement;
    const r = d ? d.getBoundingClientRect() : null;
    return { imSeitenheim: !!heim && heim.id === "lcSeitenBuehne",
             breit: r ? Math.round(r.width) : 0, schirm: window.innerWidth };
  });
  sage(dunkel.imSeitenheim && Math.abs(dunkel.breit - dunkel.schirm) <= 1,
    "und die Dunkelheit liegt ueber der ganzen Webseite, nicht nur ueber der Karte",
    dunkel.breit + " von " + dunkel.schirm + " px");
  await pg.waitForTimeout(6200);

  /* =================================================================
     4. DIE SCHNEEKUGEL WIRD MIT SOCKEL GESCHUETTELT
     ================================================================= */
  console.log("\nDie Schneekugel");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("schneekugel", "Bea", "Alex", {}));
  await pg.waitForTimeout(400);
  const kugel = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    const teil = (w) => {
      const el = pl.querySelector(w);
      if (!el) return null;
      const t = getComputedStyle(el).transform;
      const m = t.match(/matrix\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)/);
      return m ? { x: +(+m[5]).toFixed(1), y: +(+m[6]).toFixed(1) } : null;
    };
    return { bild: teil(".lc-kreis"), glas: teil(".lc-sk-glas"), sockel: teil(".lc-sk-sockel"),
             dauer: getComputedStyle(pl.querySelector(".lc-kreis")).animationDuration };
  });
  const bewegt = (a) => a && (Math.abs(a.x) > 0.3 || Math.abs(a.y) > 0.3);
  sage(bewegt(kugel.bild) && bewegt(kugel.glas) && bewegt(kugel.sockel),
    "Bild, Glas und Sockel werden zusammen geschuettelt",
    JSON.stringify(kugel.bild) + " / " + JSON.stringify(kugel.glas)
      + " / " + JSON.stringify(kugel.sockel));
  sage(/1\.45s/.test(kugel.dauer || ""),
    "und das Schuetteln dauert so lange wie das Geraeusch zu hoeren ist (1,45 s)",
    kugel.dauer);
  await pg.waitForTimeout(7200);

  /* =================================================================
     5. DER FROSCH
     ================================================================= */
  console.log("\nDer Frosch");
  const roh = "/tmp/claude-0/pr85-quaken.raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", "quaken.opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const quakDauer = fs.readFileSync(roh).length / 2 / 24000;
  sage(quakDauer < 0.8,
    "„quaken“ ist jetzt EIN Ruf, der nicht mehr abgeschnitten werden muss",
    quakDauer.toFixed(2) + " s");
  const froschNach = async (ziel) => {
    await buehne();
    await pg.evaluate(() => { window.__toene = []; window.__start = performance.now(); });
    await pg.evaluate((z) => window.DMA_PRUEFUNG.wirkung("frosch", z, "Alex", {}), ziel);
    await pg.waitForTimeout(1200);
    return pg.evaluate(() => {
      const f = document.querySelector(".lc-frosch");
      const b = document.querySelector(".lc-frosch-bild");
      return { rechts: !!f && f.classList.contains("lc-frosch-rechts"),
               bildGespiegelt: b ? /matrix\(-1/.test(getComputedStyle(b).transform) : null,
               rufe: (window.__toene || []).filter((x) => x.n === "quaken").length };
    });
  };
  /* Alex sitzt auf Platz 1 links oben. Platz 8 liegt rechts unten,
     Platz 5 direkt darunter — also einmal nach rechts, einmal nicht. */
  const nachRechts = await froschNach("8");
  await pg.waitForTimeout(2600);
  const nachUnten = await froschNach("5");
  sage(nachRechts.rechts && nachRechts.bildGespiegelt,
    "springt er nach rechts, schaut er auch nach rechts",
    "gespiegelt: " + nachRechts.bildGespiegelt);
  sage(!nachUnten.bildGespiegelt,
    "springt er nach unten (nicht nach rechts), bleibt er wie gezeichnet");
  sage(nachRechts.rufe >= 1, "und er quakt beim Springen", nachRechts.rufe + " Rufe");
  await pg.waitForTimeout(2600);

  /* =================================================================
     6. DIE SCHWINGEN DES ADLERS
     ================================================================= */
  console.log("\nDer Greifvogel");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const spitzen = js.match(/const tx = (\d+) \+ t \* (\d+), ty = (\d+) \+ t \* (\d+);/);
  /* Der Vogel schaut nach rechts (Schnabel bei x = 134), der Schwanz
     liegt links. „Nach hinten" heisst also: kleines x. */
  sage(spitzen && Number(spitzen[1]) <= 20,
    "die Schwungfedern zeigen nach hinten, zum Schwanz",
    spitzen ? ("aeusserste Spitze bei x = " + spitzen[1] + " (vorher 33)") : "nicht gefunden");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("greifvogel", "6", "Alex", {}));
  await pg.waitForTimeout(900);
  const fluegel = await pg.evaluate(() => {
    const f = document.querySelector(".lc-greif-schwinge");
    const alle = document.querySelectorAll(".lc-greif-schwinge").length;
    return { federn: alle, da: !!f };
  });
  sage(fluegel.da && fluegel.federn >= 14,
    "und jeder Fluegel hat einzelne Handschwingen, nicht eine Haut",
    fluegel.federn + " Federn (zwei Fluegel zu je sieben)");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
