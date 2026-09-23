/* =====================================================================
   SONDE RUNDE 88/99 — DER KLAPS: DIE ERSTE HAND, UND SIE TRIFFT
   ---------------------------------------------------------------------
   XANDER: „ueberleg auch mal, wenn man jemanden schlaegt auf dem Popo,
   das bei den Emoji-Haenden, ob das auch richtig aussieht. Die kommen
   naemlich manchmal so von der Seite, als wenn sie mit der Rueckhand
   schlagen, oder dass die Physik nicht stimmt. Wenn man jemand auf die
   Wange schlaegt, schlaegt man seitlich. Wenn man auf den Popo
   schlaegt, schlaegt man so hinten drauf, und dann ist die Hand flach
   so von der Seite zu sehen und kommt auch so animiert auf dem Po
   geschlagen."

   Er hat den Unterschied anatomisch genau benannt:
   · Eine Ohrfeige geht QUER durch die Bildebene.
   · Ein Klaps geht von OBEN UND HINTEN nach unten vorn. Die
     Handflaeche zeigt dabei nach unten, also vom Betrachter weg — man
     sieht die Hand nie von der Flaeche, sondern immer von der KANTE.

   Bisher lag die Handflaeche flach VORN auf dem Bild (viewBox 64 x 62,
   also quadratisch) und kam von UNTEN AUSSEN herauf. Das ist die Bahn
   einer Ohrfeige, nur seitenverkehrt.

   NACHGEZOGEN IN RUNDE 99, und zwar auf seinen ausdruecklichen Wunsch:
   „Ich moechte die alte Hand wiederhaben, die auf den Popo schlaegt,
    die erste, die wir hatten. Sie soll nur richtig schlagen, also mach
    einfach die erste wieder rein. Der Abdruck bleibt, und achte darauf,
    dass erst die Hose runtergezogen wird, dann der Schlag kommt und
    dann der Schrei — dass das alles richtig getimet ist."

   Damit sind ZWEI Regeln dieser Sonde hinfaellig: die Zeichnung ist
   wieder die ERSTE (flache Handflaeche, viewBox 64 x 62, also fast
   quadratisch), und die Bahn kommt wieder von UNTEN AUSSEN herauf.
   Beides hat er selbst zurueckbestellt; was er zweimal verworfen hat,
   war meine Verbesserung, nicht seine Bestellung.

   Gemessen wird deshalb jetzt:
     1. Ist die Zeichnung wieder die erste (fast quadratisch)?
     2. Ist es ein BOGEN und kein Sprung — die Hand kommt aus der
        Ferne und ist beim Aufprall am naechsten an der Backe?
     3. Trifft sie wirklich, also liegt die Handflaeche im Aufprall
        auf der Pobacke (das misst pruefe-runde87-klaps in Pixeln)?
     4. Und die REIHENFOLGE: Waesche runter, dann der Schlag, dann der
        Laut — in dieser Reihenfolge und nicht durcheinander.
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
  console.log("RUNDE 88/99 — der Klaps\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  console.log("DIE ZEICHNUNG\n");
  const vb = /<svg class="lc-klaps-hand" viewBox="0 0 (\d+) (\d+)"/.exec(js);
  const breit = vb ? Number(vb[1]) : 0, hoch = vb ? Number(vb[2]) : 1;
  /* NACHGEZOGEN IN RUNDE 92. Hier stand: „mindestens doppelt so lang
     wie hoch" — das Profil aus Runde 88. XANDER hat das verworfen:
     „Auf dem Po mit dem Klaps ist immer noch nicht die Hand wie
      vorher zu sehen. Du schlaegst immer noch flach von obendrauf.
      Ich habe gesagt, die moechte ich nicht. Moechte die seitliche
      Hand haben. Das kann auch ein flaches Draufschlagen sein, aber
      … sie war die ganze Hand zu sehen, in der Draufsicht."
     Also DRAUFSICHT: breiter als hoch (eine Hand ist laenger als
     breit), aber keine Kante — zwischen 1,1 und 1,8. */
  /* RUNDE 99 — zurueck zur ERSTEN Zeichnung: „mach einfach die erste
     wieder rein." Die war 64 x 62, also fast quadratisch. */
  sage(breit === 64 && hoch === 62,
    "es ist wieder die erste Hand \u2014 die flache Handfl\u00e4che",
    breit + " x " + hoch + " (die erste war 64 x 62)");

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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const p = document.querySelectorAll(".lc-platz")[1];
    p.dataset.lcGeschlecht = "w";
    window.DMA_PRUEFUNG.wirkung("klaps", "2", "Alex", {});
  });
  await pg.waitForTimeout(250);

  const bei = async (t) => {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-zp, .lc-zp *").forEach((el) =>
        el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
    }, t);
    await pg.waitForTimeout(90);
    return pg.evaluate(() => {
      const h = document.querySelector(".lc-klaps-hand");
      const bl = document.querySelector(".lc-zp .lc-zp-blende, .lc-zp");
      if (!h) return null;
      const b = h.getBoundingClientRect();
      const p = (bl || h.parentElement).getBoundingClientRect();
      const m = getComputedStyle(h).transform;
      let grad = 0;
      if (m && m !== "none") {
        const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
        /* Bei gespiegelter Zeichnung (negatives a) zaehlt der Winkel
           der SICHTBAREN Kante — deshalb ueber die zweite Spalte. */
        grad = Math.atan2(-z[2], z[3]) * 180 / Math.PI;
      }
      return { mx: Number((b.left + b.width / 2 - p.left).toFixed(1)),
               unten: Number((b.bottom - p.top).toFixed(1)),
               my: Number((b.top + b.height / 2 - p.top).toFixed(1)),
               grad: Number(grad.toFixed(1)),
               deck: Number(getComputedStyle(h).opacity.toFixed ? getComputedStyle(h).opacity : 0),
               feld: [Number(p.width.toFixed(1)), Number(p.height.toFixed(1))] };
    });
  };

  console.log("\nDIE BAHN\n");
  const hoch1 = await bei(300);
  const hoch2 = await bei(450);
  const treffer = await bei(600);
  const nach = await bei(760);
  /* RUNDE 99, ZWEITER ANLAUF — XANDER (Walkie-Talkie): „sie sollte
     ein bisschen seitlich schlagen — du musst sie zur Seite drehen,
     die Hand, dass sie auf den Po schlaegt."
     Die Bahn kommt jetzt von der SEITE: 300 ms vor dem Aufprall steht
     die Hand weit aussen (nicht tiefer), sie schwingt waagerecht herein,
     und im Aufprall liegt sie QUER (um 70 Grad gedreht, Finger zur
     Pomitte). Die Regeln davor (von unten, fast waagerecht) galten der
     Bahn, die er jetzt anders bestellt hat. */
  const seitlich = (h) => (h && treffer) ? Math.abs(h.mx - treffer.mx) : 0;
  sage(hoch1 && treffer && seitlich(hoch1) > treffer.feld[0] * 0.5,
    "300 ms vor dem Aufprall holt die Hand SEITLICH aus",
    hoch1 ? "x = " + hoch1.mx + ", im Aufprall " + treffer.mx : "-");
  sage(hoch2 && seitlich(hoch2) < seitlich(hoch1) && seitlich(hoch2) > 2,
    "und sie schwingt von der Seite herein \u2014 ein Bogen, kein Sprung",
    hoch2 ? hoch1.mx + " \u2192 " + hoch2.mx + " \u2192 " + treffer.mx : "-");
  sage(treffer && Math.abs(treffer.grad) >= 55 && Math.abs(treffer.grad) <= 85,
    "beim Aufprall liegt sie quer, zur Seite gedreht, auf der Backe",
    treffer ? treffer.grad + " Grad" : "-");
  sage(nach && nach.my >= treffer.my - 2,
    "und drueckt danach noch einmal nach, statt sofort wegzuspringen",
    nach ? "y = " + nach.my + " nach " + treffer.my : "-");

  console.log("\nDIE REIHENFOLGE: WAESCHE, SCHLAG, LAUT\n");
  /* XANDER: „achte darauf, dass erst die Hose runtergezogen wird, dann
     der Schlag kommt und dann der Schrei \u2014 dass das alles richtig
     getimet ist."
     Gemessen wird an dem, was wirklich passiert: wann die Waesche
     unten ist, wann die Hand die Backe beruehrt, wann der Laut
     bestellt ist. Der Laut wird nicht gehoert, sondern abgefangen —
     eine Sonde hat keine Ohren, aber sie kann mitschreiben, wann er
     bestellt wurde. */
  const folge = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    const start = performance.now();
    window.DMA_PRUEFUNG.wirkung("klaps", "Bea", "Alex", {});
    /* Zwei Bahnen mitschreiben: wie tief die Waesche steht und wie
       weit die Hand von der Backe weg ist. Danach wird ausgewertet —
       waehrend des Laufs zu urteilen fuehrt in die Irre (die Hand
       kommt auf ihrem Bogen ZWEIMAL in die Naehe). */
    const waescheBahn = [], handBahn = [];
    for (let i = 0; i < 45; i++) {
      await new Promise((f) => setTimeout(f, 30));
      const jetzt = performance.now() - start;
      const slip = platz.querySelector(".lc-popo-slip, .lc-popo-slip-hose, .lc-popo-band");
      if (slip) {
        const b = slip.getBoundingClientRect();
        const p = platz.getBoundingClientRect();
        waescheBahn.push([jetzt, b.top + b.height / 2 - p.top]);
      }
      const hand = platz.querySelector(".lc-klaps-hand");
      const abdruck = platz.querySelector(".lc-klaps-abdruck");
      if (hand && abdruck) {
        const h = hand.getBoundingClientRect(), a = abdruck.getBoundingClientRect();
        handBahn.push([jetzt, Math.hypot(h.left + h.width / 2 - (a.left + a.width / 2),
                                         h.top + h.height / 2 - (a.top + a.height / 2))]);
      }
    }
    /* Die Waesche ist unten, sobald sie ihren tiefsten Punkt erreicht
       hat (danach bleibt sie liegen). */
    /* RUNDE 99: gezaehlt wird der ERSTE Augenblick, in dem sie (bis
       auf 1,5 px) ganz unten ist. Vorher zaehlte der letzte tiefste
       Punkt — und weil der Popo beim Aufprall mitwackelt, kam dieser
       „tiefste Punkt" erst NACH dem Schlag, obwohl die Waesche schon
       lange unten lag. */
    let tiefste = -1, waesche = 0;
    waescheBahn.forEach(([t, y]) => { if (y > tiefste) tiefste = y; });
    const erst = waescheBahn.find(([t, y]) => y >= tiefste - 1.5);
    if (erst) waesche = Math.round(erst[0]);
    /* Die Hand trifft dort, wo sie der Backe am naechsten ist. */
    let naeheste = 1e9, schlag = 0;
    handBahn.forEach(([t, d]) => { if (d < naeheste) { naeheste = d; schlag = Math.round(t); } });
    return { waesche: waesche, schlag: schlag,
             abstand: Math.round(naeheste), tief: Math.round(tiefste) };
  });
  sage(folge.waesche > 0 && folge.schlag > 0 && folge.waesche <= folge.schlag,
    "erst ist die W\u00e4sche unten, dann trifft die Hand",
    "W\u00e4sche unten bei " + folge.waesche + " ms, Schlag bei " + folge.schlag
    + " ms (Abstand zur Backe dann " + folge.abstand + " px)");
  /* Und der Laut steht im Programm 90 ms NACH dem Aufprall — das ist
     nachlesbar und braucht keine Ohren. */
  const tonZeile = /lcTonSpaeter\(lcSchmerzTon\(platz\), (\d+)/.exec(js);
  sage(tonZeile && Number(tonZeile[1]) > 600,
    "und der Schmerzlaut kommt NACH dem Schlag",
    tonZeile ? tonZeile[1] + " ms (Aufprall bei 600 ms)" : "nicht gefunden");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nDie erste Hand ist wieder da, sie trifft die Backe, und die Reihenfolge stimmt.\n");
  process.exit(fehler ? 1 : 0);
})();
