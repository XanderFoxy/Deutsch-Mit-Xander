/* =====================================================================
   SONDE RUNDE 88 — PAC-MAN
   ---------------------------------------------------------------------
   XANDER, und er hat es dreimal gesagt:
   · „Die Futterpunkte beim Pac-Man liegen nicht mittig auf den Feldern
      … die Futterpunkte muessen exakt im Zentrum der Zahlen liegen, und
      in dem Moment braucht man auch keine Zahlen zu sehen, damit das
      wie das klassische Spiel aussieht."
   · „Er frisst immer noch nicht in die richtige Richtung, wenn er die
      Richtung aendert … wenn ich ihn von links nach rechts, dann runter
      und von rechts nach links wieder schicke, dann soll er auch nach
      links essen. Das soll original wie bei Pac-Man sein. Dann soll er
      seinen Mund drehen, also beziehungsweise sein Gesicht drehen und
      richtig herum essen, so wie er sich von der Physik in dem Spiel
      auch wirklich dreht."
   · „Wenn ich spreche, soll der Pac-Man nicht in seiner Animation
      gestoert werden. Wenn ich den Weg zeichne, soll er da bleiben, wo
      ich ihn hinschicke."

   ZWEI FEHLER STECKTEN DAHINTER, und beide sind hier nachgemessen:

   1. DIE PUNKTE LAGEN AUF DER MITTE DES PLATZES, nicht auf der Mitte
      des BILDES — und ein Platz ist das Bild plus die Namenszeile
      darunter. Neun Pixel zu tief, auf jedem Feld.

   2. DAS MAUL DREHTE SICH UEBERHAUPT NICHT. „steps(1, end)" stand an
      der ganzen Animation statt an den einzelnen Bildern. Eine
      Zeitkurve an dieser Stelle rechnet den Fortschritt der GANZEN
      Animation um, und „ein Schritt" heisst dann: null Prozent, bis
      alles vorbei ist. Gemessen ueber den Weg 1-2-3-4-8-7-6-5: Winkel
      0 Grad an allen acht Messpunkten, auch waehrend er nach unten und
      nach links lief.

   Gefahren wird deshalb genau der Weg, den er beschrieben hat: von
   links nach rechts, dann runter, dann von rechts nach links.
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
const winkelAus = (m) => {
  if (!m || m === "none") return 0;
  const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
  return Math.round(Math.atan2(z[1], z[0]) * 180 / Math.PI);
};

(async () => {
  console.log("RUNDE 88 — Pac-Man\n");
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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  /* Wo die Plaetze liegen, BEVOR irgendetwas laeuft — damit sich
     nachweisen laesst, dass sich nichts verschiebt. */
  const vorher = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    return [...document.querySelectorAll(".lc-platz")].map((p) => {
      const r = p.getBoundingClientRect();
      return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
    });
  });

  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("pacjagd", "1-2-3-4-8-7-6-5", "Alex");
  });
  await pg.waitForTimeout(350);

  console.log("DIE PUNKTE LIEGEN IM ZENTRUM DER ZAHLEN\n");
  const punkte = await pg.evaluate(() => {
    const raus = [];
    document.querySelectorAll(".lc-platz").forEach((pl) => {
      const n = pl.querySelector(".lc-nummer");
      if (!n) return;
      const nr = n.getBoundingClientRect();
      const mx = nr.left + nr.width / 2, my = nr.top + nr.height / 2;
      let beste = Infinity;
      document.querySelectorAll(".lc-pac-krume-platz").forEach((k) => {
        const r = k.getBoundingClientRect();
        beste = Math.min(beste, Math.hypot(r.left + r.width / 2 - mx,
                                           r.top + r.height / 2 - my));
      });
      raus.push({ nr: pl.dataset.lcPlatz, d: Number(beste.toFixed(2)) });
    });
    return { je: raus,
             sichtbar: getComputedStyle(document.querySelector(".lc-nummer")).visibility,
             anzahl: document.querySelectorAll(".lc-pac-krume-platz").length,
             dazwischen: document.querySelectorAll(
               ".lc-pac-krume:not(.lc-pac-krume-platz)").length };
  });
  const weit = punkte.je.filter((p) => p.d > 1);
  sage(weit.length === 0,
    "auf JEDEM Feld liegt der Punkt genau im Zentrum der Zahl",
    weit.length ? weit.map((p) => "Platz " + p.nr + ": " + p.d + " px").join(", ")
      : "groesster Abstand " + Math.max.apply(null, punkte.je.map((p) => p.d)).toFixed(2)
        + " px bei " + punkte.je.length + " Feldern");
  sage(punkte.anzahl === 8, "auf jedem der acht Felder liegt einer",
    punkte.anzahl + " Punkte");
  sage(punkte.dazwischen === 0,
    "und keiner dazwischen — „nicht an Stellen, die keine Profil-Sitzplaetze sind“",
    punkte.dazwischen + " zwischen den Feldern");

  console.log("\nDIE ZAHLEN SIND WEG — UND NICHTS VERRUTSCHT\n");
  sage(punkte.sichtbar === "hidden",
    "waehrend der Jagd sieht man die Zahlen nicht", "visibility: " + punkte.sichtbar);
  const jetzt = await pg.evaluate(() => [...document.querySelectorAll(".lc-platz")].map((p) => {
    const r = p.getBoundingClientRect();
    return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
  }));
  const verrutscht = jetzt.filter((k, i) => k.join() !== vorher[i].join());
  sage(verrutscht.length === 0,
    "die Plaetze stehen dabei auf den Pixel genau, wo sie vorher standen",
    verrutscht.length ? verrutscht.length + " verrutscht" : "acht Plaetze unveraendert");

  console.log("\nDAS MAUL DREHT SICH — UND DAS AUGE BLEIBT OBEN\n");
  const bei = async (t) => {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-kreis, .lc-pac-maul-gruppe").forEach((el) =>
        el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
    }, t);
    await pg.waitForTimeout(50);
    return pg.evaluate(() => {
      const g = document.querySelector(".lc-pac-maul-gruppe");
      const m = document.querySelector(".lc-pac-figur-maul");
      const au = document.querySelector(".lc-pac-auge");
      const f = document.querySelector(".lc-pac-figur");
      const k = document.querySelector(".lc-pacman");
      if (!g || !m || !f || !k) return null;
      const fr = f.getBoundingClientRect(), mr = m.getBoundingClientRect();
      const kr = k.getBoundingClientRect();
      const ar = au ? au.getBoundingClientRect() : null;
      return {
        dreh: getComputedStyle(g).transform,
        x: Math.round(kr.left + kr.width / 2), y: Math.round(kr.top + kr.height / 2),
        /* Liegt das Maul noch IM Kopf? */
        drin: mr.left >= fr.left - 2 && mr.right <= fr.right + 2
           && mr.top >= fr.top - 2 && mr.bottom <= fr.bottom + 2,
        /* Und das Auge ueber der Kopfmitte? */
        augeOben: ar ? (ar.top + ar.height / 2) < (fr.top + fr.height / 2) : false,
      };
    });
  };
  const rechts = await bei(700), runter = await bei(1700), links = await bei(2700);
  sage(rechts && winkelAus(rechts.dreh) === 0,
    "nach rechts unterwegs frisst er nach rechts", winkelAus(rechts.dreh) + " Grad");
  sage(runter && winkelAus(runter.dreh) === 90,
    "nach unten unterwegs frisst er nach unten", winkelAus(runter.dreh) + " Grad");
  sage(links && Math.abs(winkelAus(links.dreh)) === 180,
    "nach links unterwegs frisst er nach LINKS — genau das fehlte",
    winkelAus(links.dreh) + " Grad");
  sage([rechts, runter, links].every((b) => b && b.drin),
    "das Maul bleibt dabei im Kopf",
    [rechts, runter, links].map((b) => (b && b.drin) ? "ja" : "nein").join(", "));
  sage([rechts, runter, links].every((b) => b && b.augeOben),
    "und das Auge bleibt oben, egal wohin er frisst — der Kopf steht nie auf dem Kopf");

  console.log("\nER BLEIBT, WO ICH IHN HINSCHICKE\n");
  const ende = await bei(4600);
  const platz5 = await pg.evaluate(() => {
    const r = document.querySelector('.lc-platz[data-lc-platz="5"] .lc-kreis')
      .getBoundingClientRect();
    return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)];
  });
  sage(ende && Math.hypot(ende.x - platz5[0], ende.y - platz5[1]) < 6,
    "am Ende der gemalten Kette 1-2-3-4-8-7-6-5 steht er auf Platz 5",
    ende ? (ende.x + "/" + ende.y + " gegen " + platz5.join("/")) : "-");

  console.log("\nSPRECHEN STOERT IHN NICHT\n");
  const sprich = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-pac-figur, .lc-pac-krume").forEach((x) => x.remove());
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("pacjagd", "1-2-3-4", "Alex");
    await new Promise((f) => setTimeout(f, 500));
    const k = document.querySelector(".lc-pacman");
    const platz = k.closest(".lc-platz");
    const vor = k.getAnimations().length;
    platz.classList.add("lc-platz-spricht");
    await new Promise((f) => setTimeout(f, 300));
    const k2 = document.querySelector(".lc-pacman");
    const ring = k2 ? getComputedStyle(k2, "::after").display : "-";
    return { vor: vor, nach: k2 ? k2.getAnimations().length : 0,
             laeuft: k2 ? k2.getAnimations().some((a) => a.playState === "running") : false,
             ring: ring, figurDa: Boolean(document.querySelector(".lc-pac-figur")) };
  });
  sage(sprich.nach >= 1 && sprich.laeuft,
    "die Jagd laeuft weiter, waehrend er spricht",
    sprich.vor + " Animationen vorher, " + sprich.nach + " nachher, laufend: " + sprich.laeuft);
  sage(sprich.figurDa, "und die Pac-Man-Figur ist noch da");
  sage(sprich.ring === "none",
    "der gruene Sprechring wird nicht ueber den gelben Kopf gemalt",
    "::after display: " + sprich.ring);

  console.log("\nDER TON BEIM EINZEICHNEN\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const malBlock = js.slice(js.indexOf("function lcWegMalen"),
                            js.indexOf("function lcWegMalen") + 6000);
  const toene = (malBlock.match(/lcTonZu\("([a-z]+)"\)/g) || []);
  sage(toene.length === 1 && /spielzug/.test(toene[0]),
    "Pac-Man und das gewoehnliche Einzeichnen nehmen DENSELBEN Ton",
    toene.join(", ") + " — eine einzige Stelle fuer alle gemalten Wege");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
    : "\nDas Maul dreht sich, die Punkte liegen mittig, die Zahlen sind weg.\n");
  process.exit(fehler ? 1 : 0);
})();
