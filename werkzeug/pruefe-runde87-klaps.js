/* =====================================================================
   SONDE RUNDE 87 — DER KLAPS
   ---------------------------------------------------------------------
   XANDER: „Ich habe dir auch gesagt, dass man der Frau den Tanga
   runterziehen soll, bevor man den Po schlaegt und die Hand soll auch
   drauf schlagen und es soll auch der Abdruck sein, der vorher da war,
   nur eben, dass er jetzt auf der Pobacke zu sehen ist."

   Gemessen wird also der Reihe nach:
     1. Liegt vor dem Schlag Waesche auf dem Popo — Tanga bei der Frau,
        Unterhose beim Mann?
     2. Ist sie VOR 600 ms unten? (Der Schlag liegt bei 600 ms.)
     3. Trifft die Handflaeche im Moment des Schlags die Backe — und
        liegt die Hand dabei SICHTBAR obenauf, nicht hinter dem Popo?
     4. Sitzt der Abdruck danach auf derselben Backe?
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 87 — der Klaps");
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
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* Platz 2 ist eine Frau, Platz 3 ein Mann — dieselbe Quelle wie beim
     Schmerzlaut und beim Popo selbst. */
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-platz")[1].dataset.lcGeschlecht = "w";
    document.querySelectorAll(".lc-platz")[2].dataset.lcGeschlecht = "m";
    window.DMA_PRUEFUNG.wirkung("klaps", "Bea", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("klaps", "Cem", "Alex", {});
  });

  /* Messhilfe: wo liegt die Backe, wo der Ballen, wo der Abdruck? */
  const messen = () => pg.evaluate(() => {
    const hol = (i) => {
      const pl = document.querySelectorAll(".lc-platz")[i];
      const zp = pl.querySelector(".lc-zp");
      if (!zp) return null;
      const blende = zp.querySelector(".lc-zp-blende");
      const popo = zp.querySelector(".lc-popo");
      const slip = zp.querySelector(".lc-popo-slip");
      /* Bei der Frau ist es das Baendchen des Tangas, beim Mann das
         Hoeschen selbst — beides ist „die Waesche". */
      const band = zp.querySelector(".lc-popo-slip-band, .lc-popo-slip-hose");
      const hand = zp.querySelector(".lc-klaps-hand");
      const abdruck = zp.querySelector(".lc-klaps-abdruck");
      const backeLinks = zp.querySelector(".lc-popo-links");
      const backeRechts = zp.querySelector(".lc-popo-rechts");
      const k = (el) => { const b = el.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2,
                 b: b.width, h: b.height, o: Math.round(b.top) }; };
      /* Der Ballen der Hand: in der Zeichnung (64 x 62) liegt er bei
         (32, 47). Ueber die wirkliche Lage des <svg> zurueckgerechnet. */
      let ballen = null;
      if (hand) {
        const b = hand.getBoundingClientRect();
        // Mittelpunkt + gedrehte/verschobene Lage steckt schon in b;
        // fuer den Ballen reicht die relative Lage im Kasten.
        ballen = { x: b.left + b.width * (32 / 64), y: b.top + b.height * (47 / 62) };
      }
      return {
        blende: blende ? k(blende) : null,
        popoDa: Boolean(popo),
        slipDa: Boolean(slip),
        bandTyp: slip ? (slip.querySelector(".lc-popo-slip-schnur") ? "tanga"
                        : (slip.querySelector(".lc-popo-slip-hose") ? "hose" : "?")) : null,
        bandY: band ? Math.round(band.getBoundingClientRect().top) : null,
        handDa: Boolean(hand),
        handSicht: hand ? Number(getComputedStyle(hand).opacity) : null,
        handZ: hand ? getComputedStyle(hand).zIndex : null,
        popoZ: popo ? getComputedStyle(popo).zIndex : null,
        ballen,
        abdruck: abdruck ? k(abdruck) : null,
        abdruckSicht: abdruck ? Number(getComputedStyle(abdruck).opacity) : null,
        backeL: backeLinks ? k(backeLinks) : null,
        backeR: backeRechts ? k(backeRechts) : null,
        /* WER LIEGT OBEN? elementFromPoint taugt hier NICHT: die ganze
           Effektschicht hat pointer-events:none, der Zeigetest faellt
           also immer bis auf das Profilbild durch und saehe selbst
           dann „Bild" wenn die Hand obenauf laege. Gemessen wird
           stattdessen die Malreihenfolge selbst: beide liegen im
           gleichen Stapelzusammenhang (.lc-zp), also entscheidet der
           z-index — vorausgesetzt, die Blende dazwischen macht keinen
           eigenen Stapel auf. Genau das wird mitgeprueft. */
        stapel: (() => {
          if (!blende) return null;
          const st = getComputedStyle(blende);
          return {
            blendeZ: st.zIndex, blendeDeck: st.opacity, blendeDreh: st.transform,
            blendeFilter: st.filter, blendeIso: st.isolation, blendeMisch: st.mixBlendMode
          };
        })()
      };
    };
    return { frau: hol(1), mann: hol(2) };
  });

  /* --- 1. Kurz nach dem Erscheinen: die Waesche liegt noch oben ------ */
  await pg.waitForTimeout(190);
  const a0 = await messen();
  console.log("\n  bei ~190 ms");
  sage(a0.frau && a0.frau.slipDa, "Frau: Waesche liegt auf dem Popo");
  sage(a0.frau && a0.frau.bandTyp === "tanga", "Frau: es ist ein Tanga", a0.frau && a0.frau.bandTyp);
  sage(a0.mann && a0.mann.slipDa, "Mann: Waesche liegt auf dem Popo");
  sage(a0.mann && a0.mann.bandTyp === "hose", "Mann: es ist eine Unterhose", a0.mann && a0.mann.bandTyp);
  const bandOben = a0.frau && a0.frau.bandY;

  /* --- 2. Kurz VOR dem Schlag: sie ist unten -------------------------- */
  await pg.waitForTimeout(350);   // ~540 ms
  const a1 = await messen();
  const bandUnten = a1.frau && a1.frau.bandY;
  console.log("\n  bei ~540 ms (der Schlag kommt bei 600 ms)");
  sage(bandOben !== null && bandUnten !== null && bandUnten - bandOben > 18,
    "Frau: der Tanga ist VOR dem Schlag heruntergezogen",
    "von y=" + bandOben + " auf y=" + bandUnten + " (" + (bandUnten - bandOben) + " px)");
  const bandUntenM = a1.mann && a1.mann.bandY;
  sage(bandUntenM !== null && a0.mann && bandUntenM - a0.mann.bandY > 18,
    "Mann: die Unterhose ist VOR dem Schlag heruntergezogen",
    "von y=" + (a0.mann && a0.mann.bandY) + " auf y=" + bandUntenM);

  /* --- 3. Im Moment des Schlags -------------------------------------- */
  await pg.waitForTimeout(70);    // ~610 ms
  const a2 = await messen();
  console.log("\n  bei ~610 ms — der Schlag");
  for (const [wer, m] of [["Frau", a2.frau], ["Mann", a2.mann]]) {
    if (!m || !m.handDa || !m.ballen) { sage(false, wer + ": Hand fehlt"); continue; }
    /* Auf welche Backe zielt die Hand? Die naehere zaehlt. */
    const backen = [m.backeL, m.backeR].filter(Boolean);
    const nah = backen.sort((p, q) =>
      Math.hypot(p.x - m.ballen.x, p.y - m.ballen.y)
      - Math.hypot(q.x - m.ballen.x, q.y - m.ballen.y))[0];
    const weg = nah ? Math.hypot(nah.x - m.ballen.x, nah.y - m.ballen.y) : 999;
    /* Erlaubt ist ein Drittel der Backenbreite — dann liegt der Ballen
       sicher noch AUF der Backe und nicht daneben. */
    const grenze = nah ? nah.b / 3 : 0;
    sage(weg < grenze, wer + ": die Handflaeche trifft die Backe",
      "Abstand " + weg.toFixed(1) + " px, erlaubt " + grenze.toFixed(1) + " px");
    sage(m.handSicht > 0.8, wer + ": die Hand ist im Schlag sichtbar", "Deckkraft " + m.handSicht);
    const st = m.stapel || {};
    const blendeNeutral = st.blendeZ === "auto" && Number(st.blendeDeck) === 1
      && (st.blendeDreh === "none" || !st.blendeDreh) && (st.blendeFilter === "none" || !st.blendeFilter)
      && st.blendeIso === "auto" && st.blendeMisch === "normal";
    sage(blendeNeutral, wer + ": die Blende macht keinen eigenen Stapel auf",
      JSON.stringify(st));
    sage(Number(m.handZ) > Number(m.popoZ),
      wer + ": die Hand liegt OBEN, nicht hinter dem Popo",
      "Hand z=" + m.handZ + ", Popo z=" + m.popoZ);
  }

  /* --- 4. Kurz danach: der Abdruck auf der Backe ---------------------- */
  await pg.waitForTimeout(300);   // ~910 ms
  const a3 = await messen();
  console.log("\n  bei ~910 ms — der Abdruck");
  for (const [wer, m] of [["Frau", a3.frau], ["Mann", a3.mann]]) {
    if (!m || !m.abdruck) { sage(false, wer + ": Abdruck fehlt"); continue; }
    sage(m.abdruckSicht > 0.5, wer + ": der Abdruck ist zu sehen", "Deckkraft " + m.abdruckSicht);
    const backen = [m.backeL, m.backeR].filter(Boolean);
    const nah = backen.sort((p, q) =>
      Math.hypot(p.x - m.abdruck.x, p.y - m.abdruck.y)
      - Math.hypot(q.x - m.abdruck.x, q.y - m.abdruck.y))[0];
    const weg = nah ? Math.hypot(nah.x - m.abdruck.x, nah.y - m.abdruck.y) : 999;
    const grenze = nah ? nah.b / 3 : 0;
    sage(weg < grenze, wer + ": der Abdruck sitzt auf der Pobacke",
      "Abstand " + weg.toFixed(1) + " px, erlaubt " + grenze.toFixed(1) + " px");
    /* Und nicht mehr in der Bildmitte, wo er frueher sass. */
    const mitte = m.blende ? Math.hypot(m.blende.x - m.abdruck.x, m.blende.y - m.abdruck.y) : 0;
    sage(mitte > 10, wer + ": er sitzt nicht mehr in der Bildmitte",
      "Abstand zur Mitte " + mitte.toFixed(1) + " px");
  }

  /* --- 5. GEGENPROBE AM BILD ----------------------------------------
     Rechnen ist das eine, Sehen das andere. Derselbe Augenblick wird
     zweimal aufgenommen: einmal normal und einmal mit versteckter
     Hand. Liegt die Hand wirklich obenauf, muessen sich die Bildpunkte
     rund um den Ballen unterscheiden. Laege sie dahinter, waere beides
     Pixel fuer Pixel gleich. */
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-zp").forEach((z) => z.remove());
    document.querySelectorAll(".lc-platz")[1].dataset.lcGeschlecht = "w";
    window.DMA_PRUEFUNG.wirkung("klaps", "Bea", "Alex", {});
  });
  await pg.waitForTimeout(600);
  const kasten = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    const hand = pl.querySelector(".lc-klaps-hand");
    if (!hand) return null;
    const b = hand.getBoundingClientRect();
    const x = b.left + b.width * (32 / 64), y = b.top + b.height * (47 / 62);
    return { x: Math.round(x - 12), y: Math.round(y - 12), width: 24, height: 24 };
  });
  if (!kasten) sage(false, "Bildprobe: die Hand war nicht da");
  else {
    /* Die Bewegung anhalten, damit beide Aufnahmen denselben Moment
       zeigen — sonst vergleicht man zwei verschiedene Zeitpunkte. */
    await pg.evaluate(() => {
      document.querySelectorAll(".lc-zp *").forEach((el) => {
        try { el.getAnimations().forEach((a) => a.pause()); } catch (e) {}
      });
      document.querySelectorAll(".lc-kreis").forEach((el) => {
        try { el.getAnimations().forEach((a) => a.pause()); } catch (e) {}
      });
    });
    const mitHand = await pg.screenshot({ clip: kasten });
    await pg.evaluate(() => {
      const s = document.createElement("style");
      s.id = "pruefHandWeg";
      s.textContent = ".lc-klaps-hand { display: none !important; }";
      document.head.appendChild(s);
    });
    const ohneHand = await pg.screenshot({ clip: kasten });
    sage(Buffer.compare(mitHand, ohneHand) !== 0,
      "Bildprobe: am Ballen ist die Hand wirklich zu sehen",
      mitHand.length + " vs " + ohneHand.length + " Byte");
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
