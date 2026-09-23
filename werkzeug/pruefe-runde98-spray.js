#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER LACK IST DEUTLICH, UND ES GIBT GIFT
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „das Spruehen von der Spraydose muss etwas
   deutlicher sein, weil man meistens die Bilder nicht erkennt auf
   anderen Untergruenden und man kann immer noch kein Giftspruehen oder
   irgendetwas anderes … ausserdem, wenn jemand spricht oder generell,
   scheint sich der aufgesprueht Effekt zu verfluechtigen das darf nicht
   sein."

   DREI MESSUNGEN:
     1. DEUTLICHER. Jeder Tropfen bekommt jetzt einen dunklen Saum
        unter sich. Gemessen wird der KONTRAST des fertigen Lacks: wie
        weit liegen hellster und dunkelster Bildpunkt auseinander? Ein
        Motiv, das nur aus einer hellen Farbe besteht, verschwindet auf
        hellem Grund; eines mit dunklem Saum nicht.
     2. GIFT. Der Totenkopf wird gespruecht, und eine gruene Wolke
        steigt darueber auf.
     3. ES VERFLUECHTIGT SICH NICHT. Waehrend die Person spricht, bleibt
        der Lack vollstaendig sichtbar — gemessen ueber mehrere
        Sekunden, mit laufender Sprechanimation.
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

  console.log("\nDER LACK AUF JEDEM UNTERGRUND\n");
  const kontrast = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Bea", "Alex", { stueck: "sonne" });
    /* Die Sonne ist gelb — genau der Fall, der auf hellem Grund
       verschwindet. */
    await new Promise((f) => setTimeout(f, 2600));
    const c = document.querySelector(".lc-spray-lack");
    if (!c) return null;
    const g = c.getContext("2d");
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let hell = 0, dunkel = 255, gezaehlt = 0;
    for (let i = 0; i < d.length; i += 4 * 17) {
      if (d[i + 3] < 60) continue;
      const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      if (l > hell) hell = l;
      if (l < dunkel) dunkel = l;
      gezaehlt++;
    }
    return { hell: Math.round(hell), dunkel: Math.round(dunkel), punkte: gezaehlt };
  });
  sage(Boolean(kontrast) && kontrast.punkte > 100, "der Lack ist da",
    kontrast ? kontrast.punkte + " gemessene Bildpunkte" : "nichts");
  sage(Boolean(kontrast) && (kontrast.hell - kontrast.dunkel) >= 90,
    "und er traegt hell UND dunkel — damit ist er auf jedem Untergrund zu sehen",
    kontrast ? "hellster " + kontrast.hell + ", dunkelster " + kontrast.dunkel : "-");

  console.log("\nDAS GIFT\n");
  const gift = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Cem", "Alex", { stueck: "gift" });
    let schwaden = 0;
    for (let i = 0; i < 20; i++) {
      await new Promise((f) => setTimeout(f, 150));
      schwaden = Math.max(schwaden, document.querySelectorAll(".lc-giftschwade").length);
    }
    const c = document.querySelector(".lc-spray-lack");
    let gruen = 0;
    if (c) {
      const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      for (let i = 0; i < d.length; i += 4 * 23) {
        if (d[i + 3] < 60) continue;
        if (d[i + 1] > d[i] + 12 && d[i + 1] > d[i + 2] + 12) gruen++;
      }
    }
    return { schwaden: schwaden, gruen: gruen };
  });
  sage(gift.schwaden >= 4, "die Giftwolke steigt auf", gift.schwaden + " Schwaden");
  sage(gift.gruen > 20, "und der Totenkopf ist wirklich giftgruen gespruecht",
    gift.gruen + " gruene Bildpunkte");

  console.log("\nUND ES VERFLUECHTIGT SICH NICHT, AUCH NICHT BEIM SPRECHEN\n");
  const bleibt = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Dana", "Alex", { stueck: "herz" });
    await new Promise((f) => setTimeout(f, 7000));
    const dana = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("dana") >= 0)[0];
    const p = dana();
    if (!p) return null;
    p.classList.add("lc-platz-spricht");
    p.setAttribute("data-sprechbild", "puls");
    const spur = [];
    for (let i = 0; i < 12; i++) {
      await new Promise((f) => setTimeout(f, 300));
      const b = p.querySelector(".lc-sprayfarbe-bild");
      if (!b) { spur.push(0); continue; }
      /* Sichtbar heisst: da, nicht durchsichtig, nicht weggeblendet. */
      const cs = getComputedStyle(b);
      const eltern = getComputedStyle(p.querySelector(".lc-sprayfarbe"));
      spur.push(Math.round(Number(cs.opacity) * Number(eltern.opacity) * 100));
    }
    return spur;
  });
  console.log("  Sichtbarkeit waehrend des Sprechens: "
    + (bleibt || []).join(" % ") + " %\n");
  sage(Array.isArray(bleibt) && bleibt.length > 0 && bleibt.every((x) => x >= 95),
    "der Lack bleibt vollstaendig sichtbar, solange sie spricht",
    Array.isArray(bleibt) ? "kleinster Wert " + Math.min.apply(null, bleibt) + " %" : "-");

  /* =====================================================================
     RUNDE 98 \u2014 UND WIE FRUEH DER LACK IN SICHERHEIT IST
     ---------------------------------------------------------------------
     XANDER: „wenn jemand spricht oder generell, scheint sich der
     aufgespruehte Effekt zu verfluechtigen \u2014 das darf nicht sein."
     GEFUNDEN: gemalt war der Lack nach 1,7 s, FESTGEHALTEN aber erst
     nach 6,2 s. In diesen 4,5 Sekunden lag er nur auf der Leinwand der
     Animation; wurde die Sitzreihe in dieser Zeit neu gezeichnet (beim
     Sprechen, beim Kommen und Gehen, bei jedem Sitzwechsel), war er
     weg. Gemessen wird deshalb genau das: die Spruehschicht wird
     mitten im Lauf weggenommen \u2014 der Lack muss bleiben.
     ===================================================================== */
  console.log("\nUND DER LACK UEBERLEBT EIN NEUZEICHNEN MITTENDRIN\n");
  const frueh = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Bea", "Alex", { stueck: "herz" });
    const raus = { bei: [], nachWegnahme: 0, doppelt: 0 };
    for (const t of [1500, 1000, 1000]) {
      await new Promise((f) => setTimeout(f, t));
      raus.bei.push(document.querySelectorAll(".lc-sprayfarbe").length);
    }
    /* Doppelt gezeichnet? Die Leinwand muss weg sein, sobald der Lack
       in seiner eigenen Schicht liegt. */
    const lw = document.querySelector(".lc-spray-lack");
    raus.doppelt = lw && getComputedStyle(lw).visibility !== "hidden" ? 1 : 0;
    /* Und jetzt das Neuzeichnen: die Spruehschicht faellt weg. */
    document.querySelectorAll(".lc-spray").forEach((x) => x.remove());
    if (window.DMA_PRUEF.auffrischen) window.DMA_PRUEF.auffrischen();
    await new Promise((f) => setTimeout(f, 400));
    raus.nachWegnahme = document.querySelectorAll(".lc-sprayfarbe").length;
    return raus;
  });
  /* Gemalt ist er nach 1,7 s, festgehalten nach 2,2 s (dazu kommen
     bis zu 90 ms Anlauf je Ziel). Vor dem Umbau lag er erst nach
     6,2 s in seiner eigenen Schicht \u2014 die Messung bei 2,5 s ist
     also genau die, die vorher rot war. */
  sage(frueh.bei[1] >= 1,
    "der Lack liegt schon nach zweieinhalb Sekunden in seiner eigenen Schicht",
    "nach 1,5 s: " + frueh.bei[0] + ", nach 2,5 s: " + frueh.bei[1]
      + ", nach 3,5 s: " + frueh.bei[2]);
  sage(frueh.doppelt === 0, "und die Leinwand darueber ist weg, nichts liegt doppelt");
  sage(frueh.nachWegnahme >= 1,
    "nimmt man die Spruehschicht mittendrin weg, bleibt der Lack trotzdem",
    frueh.nachWegnahme + " Lackschicht(en)");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
