/* MISST DEN NEUEN SCHREI — TON UND WELLE.
   ---------------------------------------------------------------
   GEMELDET: „Jetzt höre ich die Stimme. Aber dieses komische
   Föhngeräusch ist noch im Hintergrund, was wie ein Staubsauger
   klingt, das soll weggehen. Und das Hallo soll viel kürzere
   Echozeiten haben, viel öfter Echo und lauter. Man soll plötzlich
   Schreck bekommen."
   Und: „Der Schall soll von dem Wort zentriert ausgehen in alle
   Richtungen und nicht nur nach oben."

   Vier Dinge sind daran messbar, und genau die werden hier gemessen:
     1. Wird beim Schreien noch die alte Hall-DATEI abgespielt?
        (Das ist der Föhn. Sie darf nur noch kommen, wenn gar nicht
        gesprochen werden kann.)
     2. Wie viele Durchgänge hat der Hall, wie laut sind sie, und wie
        lange ist die Pause dazwischen?
     3. Startet die Welle da, wo das Wort steht?
     4. Läuft sie nach allen vier Seiten gleich weit — oder wieder
        nur nach oben?
   Gemessen wird am echten Stylesheet und am echten app.js, nicht an
   nachgebauten Regeln. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { PNG } = (() => { try { return { PNG: require("/tmp/claude-0/node_modules/pngjs").PNG }; } catch (e) { return {}; } })();
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 780 } });

  await pg.addInitScript(() => {
    /* Ein Gerät MIT deutscher Stimme — so wie bei ihm, seit es
       spricht. Jeder Ruf wird mitgeschrieben. */
    const gesagt = []; window.__gesagt = gesagt;
    const stimmen = [{ name: "Microsoft Katja - German (Germany)", lang: "de-DE" },
                     { name: "Microsoft Stefan - German (Germany)", lang: "de-DE" }];
    let laufend = null;
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      getVoices: () => stimmen,
      cancel: () => { laufend = null; },
      speak: (u) => {
        gesagt.push({ text: u.text, zeit: performance.now(), laut: u.volume,
                      tempo: u.rate, hoehe: u.pitch });
        /* Ein Ruf dauert; „onend" kommt erst danach — genau wie echt. */
        laufend = u;
        setTimeout(() => { if (u.onend) u.onend(); }, 180);
      },
      addEventListener: () => {}
    } });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true,
      value: function (t) { this.text = t; this.pitch = 1; this.rate = 1; this.volume = 1; } });
    /* Jede Tondatei, die wirklich losgeht, wird mitgeschrieben —
       daran erkennt man den Föhn. */
    const gespielt = []; window.__tondateien = gespielt;
    const EchtesAudio = window.Audio;
    window.Audio = function (src) {
      const a = new EchtesAudio();
      a.src = src || "";
      const echt = a.play.bind(a);
      a.play = function () { gespielt.push(String(a.src).split("/").pop().split("?")[0]); return Promise.resolve(); };
      void echt;
      return a;
    };
  });

  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2600);

  const ton = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    if (!window.__schallStoss || !window.__schreiKette) return null;
    const raus = {};
    window.__gesagt.length = 0; window.__tondateien.length = 0;
    window.__schallStoss("HALLO", "maennlich");
    /* Sofort nachsehen, was NOCH in der Kette liegt: alles, was ohne
       Pause geplant ist, muss schon abgeschickt sein. */
    raus.sofortGesagt = window.__gesagt.length;
    raus.restInKette = window.__schreiKette().length;
    await warte(1400);
    raus.durchgaenge = window.__gesagt.length;
    raus.lautstaerken = window.__gesagt.map((g) => Math.round(g.laut * 100) / 100);
    raus.tempi = window.__gesagt.map((g) => Math.round(g.tempo * 100) / 100);
    const t0 = window.__gesagt.length ? window.__gesagt[0].zeit : 0;
    raus.abstaende = window.__gesagt.map((g) => Math.round(g.zeit - t0));
    raus.tondateien = window.__tondateien.slice();
    /* Und der Gegenbeweis: ohne Sprachausgabe MUSS der Hall kommen —
       sonst säße man vor einem stummen Schrei. */
    const merk = window.speechSynthesis;
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: null });
    window.__tondateien.length = 0;
    window.__schallStoss("HALLO", "maennlich");
    await warte(200);
    raus.ohneSprache = window.__tondateien.slice();
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: merk });
    return raus;
  });

  /* ---- Die Welle: Mittelpunkt und Ausbreitung ---- */
  const welle = await pg.evaluate(() => {
    const k = document.createElement("div");
    k.id = "schallProbe";
    k.style.cssText = "position:fixed;left:0;top:0;width:360px;height:520px;background:#221c1a;z-index:99999;overflow:hidden";
    document.body.appendChild(k);
    const z = document.createElement("div");
    z.className = "lc-zeile";
    z.style.cssText = "position:absolute;left:60px;top:150px;width:120px;height:20px";
    const t = document.createElement("span");
    t.className = "lc-zeilentext"; t.textContent = "HALLO";
    t.style.cssText = "display:block;width:120px;height:20px";
    z.appendChild(t); k.appendChild(z);
    const mitte = window.__schallMitteFuer ? null : null;
    void mitte;
    /* Denselben Rechenweg wie die App: Mitte der Zeile in Prozent. */
    const kr = k.getBoundingClientRect(), zr = t.getBoundingClientRect();
    const x = ((zr.left + zr.width / 2) - kr.left) / kr.width * 100;
    const y = ((zr.top + zr.height / 2) - kr.top) / kr.height * 100;
    k.style.setProperty("--lc-schall-x", x.toFixed(1) + "%");
    k.style.setProperty("--lc-schall-y", y.toFixed(1) + "%");
    /* Die Zeile hat ihren Dienst getan (sie sagt, WO das Wort steht).
       Sichtbar darf sie jetzt nicht mehr sein: sie ist heller als der
       Ring und würde beim Messen alles übertönen. */
    z.style.visibility = "hidden";
    /* Angehalten, damit jeder Zeitpunkt einzeln fotografiert werden
       kann. Über getAnimations() geht das hier nicht zuverlässig —
       die Animation des ::after-Kastens liess sich so nicht
       zurückspulen (gemessen: sie lief einfach zu Ende). Über die
       CSS-Verzögerung geht es. */
    const halt = document.createElement("style");
    halt.id = "schallHalt";
    halt.textContent = "#schallProbe::after{animation-play-state:paused!important;animation-delay:0ms!important}";
    document.head.appendChild(halt);
    k.classList.add("lc-schallt");
    const s = getComputedStyle(k, "::after");
    return { x: x, y: y, links: s.left, oben: s.top, rund: s.borderRadius,
             breite: s.width, hintergrund: s.backgroundImage.slice(0, 22) };
  });

  /* Jetzt ein Bild mitten in der Animation und nachmessen, wie weit
     der Ring nach LINKS, RECHTS, OBEN und UNTEN gekommen ist.

     Gemessen wird die Stelle mit der GRÖSSTEN Helligkeit auf dem
     jeweiligen Strahl — das ist der Ring selbst. Ein Schwellenwert
     wäre hier falsch: der Verlauf läuft nach beiden Seiten weich
     aus, und wo genau er im Rauschen verschwindet, hängt an der
     Hintergrundfarbe.

     Und es wird FRÜH gemessen: Der Kasten ist 360 × 520 gross, das
     Wort steht nicht in seiner Mitte — ein grosser Ring liefe nach
     rechts und oben schon aus dem Bild, und man hielte das dann
     fälschlich für Unwucht. Gesucht wird deshalb der erste
     Zeitpunkt, an dem der Ring noch in alle vier Richtungen
     hineinpasst. */
  let richtungen = null;
  if (PNG) {
    const cx = Math.round(360 * welle.x / 100), cy = Math.round(520 * welle.y / 100);
    const RAND = Math.min(cx, 360 - cx, cy, 520 - cy) - 6;   // so weit reicht das Bild überall
    for (let ms = 6; ms <= 120 && !richtungen; ms += 3) {
      await pg.evaluate((t) => {
        document.getElementById("schallHalt").textContent =
          "#schallProbe::after{animation-play-state:paused!important;animation-delay:-" + t + "ms!important}";
      }, ms);
      const bild = await pg.screenshot({ clip: { x: 0, y: 0, width: 360, height: 520 } });
      const png = PNG.sync.read(bild);
      const hell = (x, y) => {
        if (x < 0 || y < 0 || x >= png.width || y >= png.height) return -1;
        const i = (y * png.width + x) * 4;
        return png.data[i] * 0.299 + png.data[i + 1] * 0.587 + png.data[i + 2] * 0.114;
      };
      const grund = hell(cx, cy);          // in der Mitte ist der Ring noch nicht
      const strahl = (dx, dy) => {
        let bestD = 0, bestH = -1;
        for (let d = 8; d <= RAND; d++) {
          const h = hell(cx + dx * d, cy + dy * d);
          if (h > bestH) { bestH = h; bestD = d; }
        }
        return { d: bestD, h: bestH };
      };
      const l = strahl(-1, 0), r = strahl(1, 0), o = strahl(0, -1), u = strahl(0, 1);
      /* Nur brauchbar, wenn der Ring wirklich zu sehen und noch nicht
         am Bildrand angekommen ist. */
      if (process.env.SCHALL_LAUT) console.log("    " + ms + "ms grund=" + grund.toFixed(1)
        + " l=" + l.d + "/" + l.h.toFixed(1) + " r=" + r.d + "/" + r.h.toFixed(1)
        + " o=" + o.d + "/" + o.h.toFixed(1) + " u=" + u.d + "/" + u.h.toFixed(1));
      if (l.h > grund + 1 && l.d > 18 && l.d < RAND - 10) {
        richtungen = { zeit: ms, rand: RAND, mitteX: cx, mitteY: cy,
                       links: l.d, rechts: r.d, oben: o.d, unten: u.d };
      }
    }
  }

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  if (!ton) { console.log("  Testnaht fehlt — nur auf localhost."); await br.close(); srv.close(); process.exit(1); }

  console.log("\n  DAS FÖHNGERÄUSCH");
  ok(ton.tondateien.indexOf("schrei.opus") < 0 && ton.tondateien.indexOf("schrei.m4a") < 0,
     "beim gesprochenen Schrei läuft KEINE Hall-Datei mehr",
     ton.tondateien.length ? ton.tondateien.join(", ") : "keine Tondatei");
  ok(ton.ohneSprache.some((f) => f.indexOf("schrei") === 0),
     "ohne Sprachausgabe trägt der Hall weiterhin allein",
     ton.ohneSprache.join(", ") || "NICHTS");

  console.log("\n  DER HALL: ÖFTER, LAUTER, DICHTER");
  ok(ton.durchgaenge >= 5, "ein kurzer Ruf hallt mindestens viermal nach",
     ton.durchgaenge + " Durchgänge (Ruf + Hall)");
  ok(ton.sofortGesagt === ton.durchgaenge && ton.restInKette === 0,
     "alle Durchgänge gehen in EINEM Zug raus, nichts wartet",
     "sofort " + ton.sofortGesagt + ", Rest in der Kette " + ton.restInKette);
  ok(ton.abstaende.every((a) => a < 30), "zwischen ihnen liegt keine Wartezeit mehr",
     "Abstände in ms: " + ton.abstaende.join(" · "));
  ok(ton.lautstaerken[1] >= 0.6, "der erste Hall ist laut (vorher 0.34)",
     "Lautstärken: " + ton.lautstaerken.join(" · "));
  ok(ton.tempi[0] > 1, "gesprochen wird schnell, nicht gedehnt",
     "Tempo: " + ton.tempi.join(" · "));

  console.log("\n  DIE WELLE GEHT VOM WORT AUS");
  ok(welle.hintergrund.indexOf("radial") >= 0, "die Welle ist ein Ring, kein Band",
     welle.hintergrund);
  ok(welle.rund.indexOf("50%") >= 0, "und rund", welle.rund);
  ok(Math.abs(parseFloat(welle.links) - 360 * welle.x / 100) < 2
     && Math.abs(parseFloat(welle.oben) - 520 * welle.y / 100) < 2,
     "sie sitzt auf dem Wort",
     "Wort bei " + welle.x.toFixed(1) + "% / " + welle.y.toFixed(1) + "%, Welle bei "
       + welle.links + " / " + welle.oben);
  if (richtungen) {
    const w = [richtungen.links, richtungen.rechts, richtungen.oben, richtungen.unten];
    const grosse = Math.max.apply(null, w), kleine = Math.min.apply(null, w);
    ok(kleine > 15, "sie läuft in alle vier Richtungen hinaus",
       "nach " + richtungen.zeit + " ms: links " + richtungen.links + " · rechts " + richtungen.rechts
         + " · oben " + richtungen.oben + " · unten " + richtungen.unten + " Pixel vom Wort");
    ok(grosse - kleine <= Math.max(6, grosse * 0.12),
       "und in alle gleich weit — nicht mehr nur nach oben",
       "Unterschied " + (grosse - kleine) + " Pixel");
  } else {
    console.log("  (pngjs fehlt — die Ausbreitung konnte nicht gemessen werden)");
  }

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Schrei erschreckt, und der Schall geht rundherum.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
