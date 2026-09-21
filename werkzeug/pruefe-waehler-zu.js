#!/usr/bin/env node
/* =========================================================
   GEHT EIN WAEHLER WIEDER ZU?
   ---------------------------------------------------------
   GEMELDET: „Wenn ich auf mein eigenes Profilbild klicke, um
   das Menue aufzurufen, wo ich ein anderes Profilbild
   einstellen kann, moechte ich, dass es wieder schliesst,
   wenn ich in den Lernbereich klicke. Also intuitiv wie bei
   Apple. Bei dir gibt es nur, wenn man nach unten scrollt —
   es gibt gar kein Schliessen."

   Geprueft an allen Waehlern, die es gibt:
   1. Ein Tipp auf den dunklen Grund schliesst.
   2. Die Escape-Taste schliesst.
   3. Ein Tipp INNEN schliesst NICHT — sonst koennte man
      nichts mehr auswaehlen.
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
  const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.bildWaehler, { timeout: 20000 });

  const oeffnen = async (welcher) => pg.evaluate((w) => {
    document.querySelectorAll(".lc-waehler-hinter").forEach((x) => x.remove());
    window.DMA_PRUEF[w]();
    return document.querySelectorAll(".lc-waehler-hinter").length;
  }, welcher);

  for (const welcher of ["bildWaehler", "sendeWaehler"]) {
    console.log("\n" + welcher.toUpperCase() + "\n");
    pruefe("geht auf", (await oeffnen(welcher)) === 1);

    /* RUNDE 75 — DIESE REGEL HAT XANDER SELBST GEAENDERT.
       ----------------------------------------------------------------
       Hier stand: „ein Tipp INNEN schliesst nicht". Das galt bis
       Runde 72.
       XANDER in Runde 73: „Man kann das Panel immer noch nicht
       schliessen beim Klicken in den Leerraum … man soll in ein Leeres
       klicken koennen und dann schliesst sich das Panel. Das soll bei
       jeglichen schwebenden Panels, die erzeugt werden, moeglich
       sein."
       Seitdem gilt auch der LEERE Teil im Kasten als „daneben". Nur
       was man bedienen kann — ein Knopf, eine Kachel, ein Feld, eine
       Zeile mit Text — nimmt den Tipp fuer sich in Anspruch.
       Gemessen wird deshalb beides: ein Tipp auf etwas Bedienbares
       schliesst NICHT, ein Tipp in den Leerraum schliesst DOCH.
       (Und die Sonde greift nicht mehr blind auf das Panel zu — sie
       ist vorher daran abgestuerzt, weil es schon zu war.) */
    const aufKnopf = await pg.evaluate(() => {
      const k = document.querySelector(".lc-waehler-hinter");
      if (!k) return { fehlt: true };
      const knopf = k.querySelector("button, .lc-waehler-knopf, .lc-bildkachel, .lc-kachel, input");
      if (!knopf) return { keinKnopf: true };
      knopf.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      return { offen: document.querySelectorAll(".lc-waehler-hinter").length };
    });
    if (aufKnopf.fehlt || aufKnopf.keinKnopf) {
      console.log("  --   kein bedienbares Teil im Kasten gefunden — hier nicht pruefbar");
    } else {
      pruefe("ein Tipp auf etwas BEDIENBARES schliesst nicht",
        aufKnopf.offen === 1, aufKnopf.offen + " noch offen");
    }

    if ((await pg.evaluate(() => document.querySelectorAll(".lc-waehler-hinter").length)) !== 1) {
      await oeffnen(welcher);
    }
    const leerInnen = await pg.evaluate(() => {
      const k = document.querySelector(".lc-waehler-hinter");
      if (!k) return -1;
      const drin = k.querySelector(".lc-waehler") || k.firstElementChild;
      drin.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      return document.querySelectorAll(".lc-waehler-hinter").length;
    });
    pruefe("ein Tipp in den LEERRAUM im Kasten schliesst",
      leerInnen === 0, leerInnen + " noch offen");

    await oeffnen(welcher);
    const daneben = await pg.evaluate(() => {
      const k = document.querySelector(".lc-waehler-hinter");
      if (!k) return -1;
      k.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      return document.querySelectorAll(".lc-waehler-hinter").length;
    });
    pruefe("ein Tipp DANEBEN schliesst", daneben === 0, daneben + " noch offen");

    await oeffnen(welcher);
    await pg.keyboard.press("Escape");
    const nachEsc = await pg.evaluate(() => document.querySelectorAll(".lc-waehler-hinter").length);
    pruefe("Escape schliesst auch", nachEsc === 0, nachEsc + " noch offen");
  }

  /* =========================================================
     RUNDE 79 — DAS PLATZ- UND EFFEKTMENUE KANN ES JETZT AUCH
     ---------------------------------------------------------
     XANDER, in einer Liste gleich fuenfmal: „Ich kann in einem
     Menue, was ich aufrufe, immer noch nicht ins Leere klicken, um
     es wieder abzulegen" und „wenn man die Profileffekte des Panels
     wieder schliessen will, kann man auch nicht ins Leere klicken,
     WO KEINE KACHEL IST."

     Die Waehler koennen das seit Runde 73 (siehe oben). Das
     Platzmenue konnte es nie: dort stand nur
       if (kasten.contains(e.target)) return;
     — es schloss also ausschliesslich ein Tipp NEBEN dem Kasten.
     „Wo keine Kachel ist" liegt aber IM Kasten.
     ========================================================= */
  console.log("\nDAS PLATZMENUE\n");
  {
    const auf = async () => pg.evaluate(() => {
      document.getElementById("lcPlatzMenue")?.remove();
      window.DMA_PRUEF.effektBuehne();
      document.querySelectorAll(".lightbox").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.platzMenue(document.querySelectorAll(".lc-platz")[2]);
      return Boolean(document.getElementById("lcPlatzMenue"));
    });
    pruefe("geht auf", (await auf()) === true);
    /* Eine Stelle IM Kasten suchen, an der keine Kachel liegt. */
    const leer = await pg.evaluate(() => {
      const m = document.getElementById("lcPlatzMenue");
      if (!m) return null;
      const b = m.getBoundingClientRect();
      for (let dy = 2; dy < b.height - 2; dy += 3) {
        for (let dx = 2; dx < b.width - 2; dx += 3) {
          const el = document.elementFromPoint(b.left + dx, b.top + dy);
          if (el && m.contains(el)
              && !el.closest("button, a, input, [role='button'], .lc-platzmenue-knopf")) {
            return { x: Math.round(b.left + dx), y: Math.round(b.top + dy) };
          }
        }
      }
      return null;
    });
    pruefe("es gibt ueberhaupt Leerraum im Kasten", Boolean(leer));
    if (leer) {
      await pg.mouse.click(leer.x, leer.y);
      await pg.waitForTimeout(160);
    }
    pruefe("ein Tipp in den Leerraum IM Kasten schliesst",
      (await pg.evaluate(() => !document.getElementById("lcPlatzMenue"))) === true);
    await auf();
    await pg.waitForTimeout(120);
    /* Eine Kachel darf NICHT schliessen, bevor sie ihre Arbeit tut. */
    const aufKachel = await pg.evaluate(() => {
      const k = document.querySelector("#lcPlatzMenue .lc-platzmenue-knopf");
      if (!k) return null;
      const b = k.getBoundingClientRect();
      return { x: Math.round(b.left + b.width / 2), y: Math.round(b.top + b.height / 2) };
    });
    if (aufKachel) {
      await pg.evaluate(([x, y]) => {
        const el = document.elementFromPoint(x, y);
        el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: x, clientY: y }));
      }, [aufKachel.x, aufKachel.y]);
      await pg.waitForTimeout(80);
    }
    pruefe("ein Tipp auf eine KACHEL schliesst nicht vorzeitig",
      (await pg.evaluate(() => Boolean(document.getElementById("lcPlatzMenue")))) === true);
    await pg.evaluate(() => document.getElementById("lcPlatzMenue")?.remove());
  }

  /* Und die Hoehenbegrenzung in „dvh": auf Android ist der sichtbare
     Bereich kleiner als 100vh, solange die Adressleiste steht. */
  console.log("\nDIE HOEHE RECHNET MIT DEM SICHTBAREN FENSTER\n");
  const dvh = await pg.evaluate(() => ({
    kann: window.CSS && CSS.supports ? CSS.supports("max-height", "72dvh") : false,
    fenster: window.innerHeight,
    menue: (() => {
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.platzMenue(document.querySelectorAll(".lc-platz")[2]);
      const m = document.getElementById("lcPlatzMenue");
      const h = m ? getComputedStyle(m).maxHeight : "";
      m?.remove();
      return h;
    })()
  }));
  pruefe("der Browser kennt dvh", dvh.kann === true);
  /* 72 % des sichtbaren Fensters — am Rechner ist das dasselbe wie
     72vh, auf dem Telefon nicht. */
  /* 72 % des Fensters, das der Browser gerade zeigt. Gegen eine feste
     Zahl zu messen waere falsch: die Sonde laeuft nicht immer mit
     derselben Fensterhoehe. */
  pruefe("und das Menue begrenzt sich darauf",
    Math.abs(parseFloat(dvh.menue) - 0.72 * dvh.fenster) < 2,
    dvh.menue + " bei " + dvh.fenster + " px Fenster");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Jeder Waehler geht wieder zu.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
