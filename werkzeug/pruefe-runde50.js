#!/usr/bin/env node
/* =========================================================
   RUNDE 50 — WAS MAN HAELT, BLEIBT BEIM HALTENDEN
   ---------------------------------------------------------
   GEMELDET:
   · „bei der Zwille — die soll natuerlich bei mir bleiben,
      wenn ich sie aufziehe."
   · „Das Blasrohr ist realistisch, aber der Spuckball, der
      muss nach unten laufen."
   · „dieses eine Boot mit dem Dampfer, das kann so ein
      klassischer Raddampfer sein wie bei Steamboat Willie."
   · „die Liane ist auch nicht realistisch."

   Gemessen wird, WO die Teile haengen — nicht, ob es sie gibt.
   Genau das war naemlich der Fehler: es gab sie, sie hingen nur
   am falschen Platz.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nEINE PLATZNUMMER IST EIN ZIEL — UND NUR DAS\n");
  /* Vorher fand die Namenssuche zu „3" nichts, und dann griff der
     Rueckfall „alle": EIN Wurf traf den ganzen Raum. */
  const treffer = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-zwille, .lc-zwille-halt").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("zwille", "3", "Alex");
    await new Promise((f) => setTimeout(f, 260));
    return [...document.querySelectorAll(".lc-platz")]
      .map((pl, i) => (pl.querySelector(".lc-zwille") ? i + 1 : 0)).filter(Boolean);
  });
  pruefe("/zwille 3 trifft GENAU Platz 3", treffer.length === 1 && treffer[0] === 3,
    "getroffen: Platz " + (treffer.join(", ") || "keiner"));

  console.log("\nDIE ZWILLE BLEIBT BEIM SCHUETZEN\n");
  const zw = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-zwille, .lc-zwille-halt").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("zwille", "3", "Alex");
    await new Promise((f) => setTimeout(f, 1150));
    const ich = document.querySelector(".lc-platz-ich");
    const ziel = document.querySelectorAll(".lc-platz")[2];
    const halt = ich ? ich.querySelector(".lc-zwille-halt .lc-zwille-bild") : null;
    const cs = halt ? getComputedStyle(halt) : null;
    return {
      geraetBeimSchuetzen: Boolean(halt),
      geraetBeimZiel: Boolean(ziel && ziel.querySelector(".lc-zwille-bild")),
      kugelBeimZiel: Boolean(ziel && ziel.querySelector(".lc-zwille-kugel")),
      kugelBeimSchuetzen: Boolean(ich && ich.querySelector(".lc-zwille-kugel")),
      dreh: ich && ich.querySelector(".lc-zwille-halt")
        ? ich.querySelector(".lc-zwille-halt").style.getPropertyValue("--zieldreh") : "",
      anim: cs ? cs.animationName : "-"
    };
  });
  pruefe("die Zwille haengt am Platz des Schuetzen", zw.geraetBeimSchuetzen);
  pruefe("und NICHT mehr beim Getroffenen", !zw.geraetBeimZiel);
  pruefe("die Kugel dagegen kommt beim Getroffenen an", zw.kugelBeimZiel);
  pruefe("und bleibt nicht beim Schuetzen liegen", !zw.kugelBeimSchuetzen);
  pruefe("sie zielt auch wirklich", Boolean(zw.dreh), "--zieldreh: " + (zw.dreh || "fehlt"));
  pruefe("und sie wird aufgezogen", zw.anim === "lcZwilleHaltR50", zw.anim);

  console.log("\nDAS BLASROHR BLEIBT AM MUND, DIE KUGEL LAEUFT HERUNTER\n");
  const pu = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-puste, .lc-puste-halt").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("pusterohr", "3", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const ich = document.querySelector(".lc-platz-ich");
    const ziel = document.querySelectorAll(".lc-platz")[2];
    const kugel = ziel ? ziel.querySelector(".lc-puste-kugel") : null;
    const cs = kugel ? getComputedStyle(kugel) : null;
    /* Wie weit laeuft die Kugel? Aus den Schluesselbildern den
       groessten Versatz ablesen — messen liesse sich nur EIN Moment,
       und der sagt nichts ueber den Weg. */
    let weit = 0;
    try {
      (kugel ? kugel.getAnimations() : []).forEach((an) => {
        (an.effect.getKeyframes() || []).forEach((f) => {
          /* Die Schluesselbilder koennen als „calc(var(--py) + 170%)"
             ODER schon ausgerechnet als „translate(0%, 170%)"
             zurueckkommen — je nachdem, wie weit der Browser die
             Variablen aufgeloest hat. Deshalb wird nach ALLEN
             Prozentwerten gesucht und der groesste genommen. */
          String(f.transform || "").replace(/(-?[\d.]+)%/g, (g, z) => {
            weit = Math.max(weit, Number(z)); return g;
          });
        });
      });
    } catch (e) {}
    return { rohrBeimSchuetzen: Boolean(ich && ich.querySelector(".lc-puste-halt .lc-puste-rohr")),
             rohrBeimZiel: Boolean(ziel && ziel.querySelector(".lc-puste-rohr")),
             kugelBeimZiel: Boolean(kugel), anim: cs ? cs.animationName : "-", weit: weit };
  });
  pruefe("das Rohr haengt am Platz des Pustenden", pu.rohrBeimSchuetzen);
  pruefe("und NICHT mehr beim Getroffenen", !pu.rohrBeimZiel);
  pruefe("die Spuckkugel klebt am Getroffenen", pu.kugelBeimZiel);
  /* Vorher endete sie bei 74 % — mitten auf der Wange. */
  pruefe("und sie laeuft bis unter den Bildrand", pu.weit >= 150,
    "bis " + pu.weit + " % der Bildhoehe");

  console.log("\nDER RADDAMPFER UND DIE LIANE\n");
  const reise = await pg.evaluate(async () => {
    /* Eine Reise braucht ein FREIES Ziel. */
    const reihe = document.getElementById("lcPlaetze");
    const vorbild = document.querySelector(".lc-platz");
    if (reihe && vorbild && !reihe.querySelector(".lc-platz-frei")) {
      const frei = vorbild.cloneNode(true);
      frei.className = "lc-platz lc-platz-frei";
      frei.dataset.lcPlatz = "6";
      const n = frei.querySelector(".lc-platz-name");
      if (n) n.textContent = "frei";
      reihe.appendChild(frei);
    }
    document.querySelectorAll(".lc-dampfer, .lc-liane").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("dampfer", "6", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const d = document.querySelector(".lc-dampfer");
    const rad = d ? d.querySelector(".lc-dampfer-rad") : null;
    const raus = {
      dampfer: Boolean(d),
      schaufeln: rad ? rad.querySelectorAll("b").length : 0,
      nabe: Boolean(rad && rad.querySelector("u")),
      /* Ein RADKASTEN gehoert zu einem SEITENraddampfer. Seit Runde 57
         ist es ein Heckraddampfer vom Mississippi („recherchiere das
         mal"), und der hat keinen — dafuer zwei Schornsteine, zwei
         Decks und ein Steuerhaus. Genau danach wird jetzt gesucht. */
      schlote: d ? d.querySelectorAll(".lc-dampfer-schlot rect").length : 0,
      decks: d ? d.querySelectorAll(".lc-dampfer-haus").length : 0,
      saeulen: d ? d.querySelectorAll(".lc-dampfer-saeule path").length : 0,
      /* RUNDE 60 UMGEDREHT, auf Ansage: „bei dem Raddampfer vom
         Mississippi, da muss in der Mitte so ein grosses Rad sein,
         wie das klassisch ist, nicht hinten." Es gab beides — das
         Heckrad war die spaetere, billigere Bauart fuer enge
         Nebenfluesse, das klassische Bild ist der Seitenraddampfer.
         Also wird jetzt genau das Gegenteil von frueher gemessen:
         der Radkasten MUSS da sein, und das Rad MUSS mittschiffs
         liegen. */
      kastenDa: Boolean(d && d.querySelector(".lc-dampfer-kasten")
                    && getComputedStyle(d.querySelector(".lc-dampfer-kasten")).display !== "none"),
      radMitte: (() => {
        if (!rad || !d) return 99;
        const rb = rad.getBoundingClientRect(), db = d.getBoundingClientRect();
        return ((rb.left + rb.width / 2) - (db.left + db.width / 2)) / db.width;
      })(),
      gischt: Boolean(d && d.querySelector(".lc-dampfer-spritzer")),
      radDreht: rad ? getComputedStyle(rad).animationName : "-"
    };
    document.querySelectorAll(".lc-dampfer, .lc-liane").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("liane", "6", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const l = document.querySelector(".lc-liane");
    const seil = l ? l.querySelector(".lc-liane-seil") : null;
    raus.liane = Boolean(l);
    raus.seilGezeichnet = Boolean(seil && seil.tagName.toLowerCase() === "svg");
    raus.blaetter = l ? l.querySelectorAll(".lc-liane-blatt").length : 0;
    raus.seilWiegt = seil ? getComputedStyle(seil).animationName : "-";
    return raus;
  });
  pruefe("der Raddampfer faehrt", reise.dampfer);
  /* Vier Speichen sind ein Wagenrad. Ein Schaufelrad hat Schaufeln. */
  pruefe("sein Rad hat acht Schaufeln", reise.schaufeln === 8, reise.schaufeln + " Stueck");
  pruefe("es hat eine Nabe", reise.nabe);
  /* „so ein echtes geiles altes Schiff mit so einem Riesenrad zum
     Antrieb des Ganzen ... ein klassischer traditioneller Raddampfer
     auf dem Mississippi." */
  pruefe("es hat zwei Schornsteine", reise.schlote === 2, reise.schlote + " Stueck");
  pruefe("zwei Decks und ein Steuerhaus", reise.decks === 3, reise.decks + " Haeuser");
  pruefe("und filigrane Saeulen am Deck", (reise.saeulen || 0) >= 10,
    reise.saeulen + " Saeulen");
  pruefe("das Rad sitzt MITTSCHIFFS, so wie beim Seitenraddampfer",
    Math.abs(reise.radMitte) <= 0.06,
    "um " + (reise.radMitte * 100).toFixed(1) + " % versetzt");
  pruefe("und es hat wieder seinen Radkasten — der gehoert zum Seitenrad",
    reise.kastenDa === true);
  pruefe("es spritzt, wo es eintaucht", reise.gischt);
  pruefe("und das Rad dreht sich", reise.radDreht !== "none" && reise.radDreht !== "-",
    reise.radDreht);
  pruefe("die Liane haengt", reise.liane);
  pruefe("sie ist gezeichnet, nicht aus Balken", reise.seilGezeichnet);
  pruefe("sie traegt Blaetter", reise.blaetter >= 3, reise.blaetter + " Stueck");
  /* RUNDE 74 — UMGEDREHT, UND ZWAR AUF SEINEN WUNSCH.
     XANDER: „Die Liane ist totaler Quatsch … sie tanzt immer herum.
     Es gibt gar keinen richtig realistischen, physikalischen
     Schwung."
     Das Wiegen IN SICH (lcLianeWiegtR50) kam ZUSAETZLICH zum Schwung
     des ganzen Pendels — zwei Bewegungen uebereinander, und genau das
     ist das Tanzen. Ein Seil, das am Pendel haengt, wiegt nicht noch
     einmal fuer sich. Die Regel verlangt jetzt das Gegenteil. */
  pruefe("und sie wiegt sich NICHT mehr in sich — das war das Tanzen",
    reise.seilWiegt === "none" || reise.seilWiegt === "-",
    reise.seilWiegt);

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nZwille, Blasrohr, Raddampfer und Liane sitzen.\n");
  process.exit(fehler ? 1 : 0);
})();
