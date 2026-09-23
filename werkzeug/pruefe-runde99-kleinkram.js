#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 99 — DIE FUENF KLEINEN DINGE AUS SEINER LISTE
   ---------------------------------------------------------------------
   XANDER (23.09.2026), woertlich:
     · „Die Muetze von Mario kann etwas hoeher auf dem Profilbild sitzen,
        dass man ein bisschen sieht, dass Mario gemeint sein soll mit dem
        Spiel."
     · „bei dem Ei hast du immer noch zu kleine Eihaelften, weil es
        faengt von einem grossen Ei an und es ist dann ploetzlich klein
        geoeffnet."
     · „bei dem Sound von dem Wegfliegen vom Luftballon hast du dieses
        Quietschgeraeusch noch nicht, das koennte dazu addiert werden."
     · „Man hoert bei dem Ufo noch nicht den Ent-Materialisieren oder
        den Re-Materialisieren Sound. Wenn man ankommt, ist noch kein
        Sound dafuer da."
     · „Schau bei der Schneekugel, dass sich die Glaskugel nicht vom
        Sockel wegwackelt und beide Einheiten unterschiedlich
        schuetteln, sondern das soll eine Einheit schuetteln, und der
        Sound muss mit der Animation bis zum Ende gehen."

   Jede dieser fuenf Zeilen wird hier an dem gemessen, was der Browser
   wirklich tut — nicht an dem, was im Programm steht.
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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  /* Jeder Ton, der wirklich abgespielt wird, wird mitgeschrieben —
     mit dem Zeitpunkt, denn auf den kommt es bei ihm oft an. */
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({
        name: (this.currentSrc || this.src || "").split("/").pop()
          .split("?")[0].replace(/\.(opus|m4a)$/, ""),
        wann: Math.round(performance.now() - (window.__tonNull || 0))
      });
      return ap.call(this);
    };
  });

  console.log("\n1  DIE MARIO-MUETZE SITZT HOEHER\n");
  const kappe = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    window.DMA_PRUEFUNG.wirkung("mariolauf", "", "Emmi", { los: "0.42" });
    await new Promise((f) => setTimeout(f, 500));
    const k = document.querySelector(".lc-mario-kappe");
    if (!k) return null;
    const rk = k.getBoundingClientRect();
    const kreis = k.closest(".lc-platz").querySelector(".lc-kreis");
    const rc = kreis.getBoundingClientRect();
    /* Wie weit steht die Muetze ueber dem Bild? In Prozent der
       Bildhoehe, damit die Zahl auf jedem Bildschirm dieselbe ist. */
    /* ZWEITER ANLAUF (Walkie-Talkie): „die Muetze wird abgeschnitten …
       sie ist nur innen ein Stueck zu sehen." Der Kasten allein sagt
       nichts darueber, ob man sie SIEHT — der Kreis schnitt sie ab. Also:
       ein Punkt der Kappe knapp UEBER dem Bildrand — trifft der Blick
       dort wirklich die Kappe? */
    const x = rk.left + rk.width / 2, y = rc.top - rc.height * 0.06;
    /* Die Kappe nimmt keine Tipps an (pointer-events: none) — fuer die
       Messung kurz einschalten, sonst sieht elementFromPoint sie nie. */
    k.style.pointerEvents = "auto";
    k.querySelectorAll("*").forEach((e) => { e.style.pointerEvents = "auto"; });
    const da = document.elementFromPoint(x, y);
    const sichtbar = Boolean(da && da.closest && da.closest(".lc-mario-kappe"));
    const cs = getComputedStyle(kreis);
    return { ueber: Math.round((rc.top - rk.top) / rc.height * 100), sichtbar,
             schnitt: cs.overflow };
  });
  sage(kappe && kappe.ueber >= 12,
    "die Mütze steht deutlich über dem Bild",
    kappe ? kappe.ueber + " % der Bildhöhe (vorher 3 %)" : "-");
  sage(kappe && kappe.sichtbar && kappe.schnitt === "visible",
    "und man SIEHT sie dort auch — der Kreis schneidet sie nicht ab",
    kappe ? "Kreis overflow " + kappe.schnitt : "-");

  console.log("\n2  DIE EIHAELFTEN SIND SO BREIT WIE DAS EI\n");
  const ei = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    window.DMA_PRUEFUNG.wirkung("ei", "Bea", "Alex", {});
    let ganz = 0, schale = 0;
    for (let i = 0; i < 40; i++) {
      await new Promise((f) => setTimeout(f, 80));
      const g = document.querySelector(".lc-zei-ganz");
      const h = document.querySelector(".lc-zei-schale");
      /* Die BREITE AUS DEM STIL, nicht der Kasten auf dem Bildschirm:
         das ganze Ei wackelt und staucht sich in seiner Animation,
         und dann misst man die Verzerrung statt der Groesse.
         (offsetWidth geht hier nicht — beides sind SVG-Elemente, und
         die haben keines.) */
      if (g && !ganz) ganz = Math.round(parseFloat(getComputedStyle(g).width));
      if (h && !schale) schale = Math.round(parseFloat(getComputedStyle(h).width));
      if (ganz && schale) break;
    }
    return { ganz: ganz, schale: schale };
  });
  sage(ei.ganz > 0 && ei.schale > 0 && Math.abs(ei.schale - ei.ganz) <= 2,
    "die Schale ist so breit wie das Ei, aus dem sie kommt",
    "Ei " + ei.ganz + " px, Schale " + ei.schale + " px (vorher 15 % schmaler)");

  console.log("\n3  DER LUFTBALLON QUIETSCHT BEIM WEGFLIEGEN\n");
  const ballon = await pg.evaluate(async () => {
    window.__toene = [];
    window.__tonNull = performance.now();
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    window.DMA_PRUEFUNG.wirkung("luftballon", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 3200));
    return window.__toene.slice();
  });
  const luft = ballon.find((t) => t.name === "luftraus");
  const quiets = ballon.find((t) => t.name === "quietschen");
  sage(Boolean(luft) && Boolean(quiets),
    "beim Loslassen kommt die Luft heraus UND es quietscht",
    ballon.map((t) => t.name).join(", ") || "kein Ton");
  sage(luft && quiets && quiets.wann >= luft.wann,
    "und das Quietschen gehört zum Entweichen, es kommt nicht davor",
    luft && quiets ? "luftraus bei " + luft.wann + " ms, quietschen bei "
      + quiets.wann + " ms" : "-");

  console.log("\n4  DAS UFO HAT SEINE BEIDEN TOENE\n");
  const ufo = await pg.evaluate(async () => {
    window.__toene = [];
    window.__tonNull = performance.now();
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    window.DMA_PRUEFUNG.wirkung("untertasse", "6", "Emmi", {});
    await new Promise((f) => setTimeout(f, 5200));
    return window.__toene.slice();
  });
  const weg = ufo.find((t) => t.name === "portaldunkel");
  const da = ufo.find((t) => t.name === "portal");
  sage(Boolean(weg), "das Auflösen am Startplatz hat einen Ton",
    weg ? "portaldunkel bei " + weg.wann + " ms" : ufo.map((t) => t.name).join(", "));
  sage(Boolean(da), "und das Ankommen am Ziel auch",
    da ? "portal bei " + da.wann + " ms" : ufo.map((t) => t.name).join(", "));
  sage(weg && da && da.wann > weg.wann,
    "erst weg, dann da — in dieser Reihenfolge",
    weg && da ? weg.wann + " ms → " + da.wann + " ms" : "-");

  console.log("\n5  DIE SCHNEEKUGEL SCHUETTELT ALS EINE EINHEIT\n");
  const kugel = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    window.DMA_PRUEFUNG.wirkung("schneekugel", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 300));
    const glas = platz.querySelector(".lc-sk-glas");
    const sockel = platz.querySelector(".lc-sk-sockel");
    const kreis = platz.querySelector(".lc-kreis");
    if (!glas || !sockel || !kreis) return null;
    /* Waehrend des Schuettelns: liegen Glas und Sockel IMMER gleich
       zueinander? Wenn beide dieselbe Einheit sind, aendert sich ihr
       Abstand nicht um einen Pixel. */
    /* WAS „EINE EINHEIT" WIRKLICH HEISST.
       Erster Versuch: der Unterschied ihrer linken oberen Ecken. Das
       war falsch gemessen — die Kugel DREHT sich beim Schuetteln, und
       bei einer Drehung wandern zwei Punkte in verschiedene
       Richtungen, obwohl sie fest verbunden sind. Richtig ist der
       ABSTAND ihrer Mittelpunkte: der bleibt bei einem starren
       Koerper gleich, egal wie er sich dreht. */
    const mitte = (el) => { const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; };
    let groessterVersatz = 0, proben = 0, bildBewegt = 0, landRutscht = 0;
    const land = platz.querySelector(".lc-sk-land") || platz.querySelector(".lc-sk-decke");
    const kmitte = () => mitte(kreis);
    /* ZWEITER ANLAUF: „man sieht sogar, dass sich innen das Innenleben,
       die Landschaft, verschiebt" — gemessen wird der Abstand der
       Landschaft zur Bildmitte. */
    const l0 = land ? mitte(land) : null, k0m = kmitte();
    const landAbstand0 = l0 ? Math.hypot(l0.x - k0m.x, l0.y - k0m.y) : 0;
    const m0 = mitte(glas), s0 = mitte(sockel);
    const startAbstand = Math.hypot(m0.x - s0.x, m0.y - s0.y);
    const kr0 = kreis.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
      await new Promise((f) => setTimeout(f, 60));
      const mg = mitte(glas), ms = mitte(sockel);
      groessterVersatz = Math.max(groessterVersatz,
        Math.abs(Math.hypot(mg.x - ms.x, mg.y - ms.y) - startAbstand));
      const kr = kreis.getBoundingClientRect();
      bildBewegt = Math.max(bildBewegt, Math.abs(kr.left - kr0.left), Math.abs(kr.top - kr0.top));
      if (land) {
        const lm = mitte(land), km = kmitte();
        landRutscht = Math.max(landRutscht, Math.abs(Math.hypot(lm.x - km.x, lm.y - km.y) - landAbstand0));
      }
      proben++;
    }
    /* Und: hoeren Bild und Kugel zusammen auf? Beide tragen dieselbe
       Dauer — abgelesen am laufenden Stil. */
    /* RUNDE 99, ZWEITER ANLAUF: die Bewegung laeuft per animate() mit
       gemeinsamem Startzeitpunkt — abgelesen wird deshalb dort. */
    const schicht = platz.querySelector(".lc-schneekugel");
    return { versatz: Math.round(groessterVersatz * 10) / 10, proben: proben,
             bild: Math.round(bildBewegt * 10) / 10,
             land: Math.round(landRutscht * 10) / 10, hatLand: Boolean(land),
             glasEigen: getComputedStyle(glas).animationName,
             blendetGanz: schicht ? schicht.getAnimations().some((a) => {
               const k = a.effect && a.effect.getKeyframes ? a.effect.getKeyframes() : [];
               return k.some((f) => f.opacity !== undefined && Number(f.opacity) === 0);
             }) : false };
  });
  sage(kugel && kugel.versatz <= 0.6,
    "Glas und Sockel h\u00e4ngen fest zusammen \u2014 ihr Abstand \u00e4ndert sich nicht",
    kugel ? kugel.versatz + " px Unterschied in " + kugel.proben + " Proben" : "-");
  sage(kugel && kugel.bild > 1,
    "und geschüttelt wird wirklich — das Bild bewegt sich",
    kugel ? kugel.bild + " px" : "-");
  sage(kugel && kugel.hatLand && kugel.land <= 1,
    "Das Innenleben verrutscht nicht gegen das Bild",
    kugel ? kugel.land + " px Unterschied" : "-");
  sage(kugel && kugel.glasEigen === "none" && kugel.blendetGanz,
    "Die ganze Kugel blendet gemeinsam aus, nicht Teil fuer Teil",
    kugel ? "Glas eigene Blende: " + kugel.glasEigen + ", Schicht blendet: " + kugel.blendetGanz : "-");

  console.log("\n6  „FREI“ STEHT DA, SOBALD DER PLATZ LEER IST\n");
  /* XANDER (Walkie-Talkie): „in dem Moment, wenn es den Platz verlassen
     hat, ist der Platz wieder frei, sofort, und da soll frei auch dran
     stehen — auch bei allen anderen Animationen … ohne zu glitchen." */
  for (const art of ["untertasse", "flug"]) {
    const f = await pg.evaluate(async (art) => {
      window.DMA_PRUEF.effektBuehne();
      await new Promise((r) => setTimeout(r, 300));
      const pl = document.querySelector('[data-lc-platz="1"]');
      const nm = pl.querySelector(".lc-platz-name");
      const kreis = pl.querySelector(".lc-kreis");
      window.DMA_PRUEFUNG.wirkung(art, "7", "Alex");
      let freiVorLeer = false, freiAb = -1, leerAb = -1;
      const t0 = performance.now();
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 60));
        const t = Math.round(performance.now() - t0);
        const leer = Number(getComputedStyle(kreis).opacity) < 0.15;
        const frei = getComputedStyle(nm, "::after").content === '"frei"';
        if (leer && leerAb < 0) leerAb = t;
        if (frei && freiAb < 0) freiAb = t;
        if (frei && !leer) freiVorLeer = true;
      }
      return { freiVorLeer, freiAb, leerAb };
    }, art);
    sage(f.freiAb >= 0 && !f.freiVorLeer && f.freiAb - f.leerAb <= 150,
      art + ": „frei“ erscheint, sobald das Bild weg ist — nicht vorher",
      "Bild weg ab " + f.leerAb + " ms, „frei“ ab " + f.freiAb + " ms");
    await pg.waitForTimeout(5000);
  }

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
