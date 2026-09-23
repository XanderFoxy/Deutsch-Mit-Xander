#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — ZU ZWEIT REISEN: RAD, HUEPFBALL UND GEMALTER WEG
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „das zu zweit reisen. Das soll auch besser
   funktionieren einmal dass ich mit jemanden gemeinsam ein Fahrrad
   bin, wenn ich neben ihm bin mit ihm losfahren kann. Dann kann ich
   auch den Weg einzeichnen, wo ich lang fahr und einmal dass ich
   denjenigen als Sprungball benutze und auf ihm sitze und ihn an
   seinen Hoernern packe beziehungsweise an diesen Gummiball
   fortsetzen, um mit ihm da los zu reiten."

   VIER MESSUNGEN:
     1. DAS RAD faehrt wie bisher: beide bewegen sich, und die
        Speichen drehen sich mit.
     2. DER HUEPFBALL: der andere bekommt HOERNER aufgesetzt, und er
        huepft — er wird zwischen den Feldern hoch und beim Aufsetzen
        gestaucht. Gemessen wird die tatsaechliche Hoehe ueber mehrere
        Zeitpunkte, nicht nur, dass etwas da ist.
     3. DER GEMALTE WEG: „/gemeinsam Bea 3-4-8" laesst beide UEBER
        Platz 4 fahren — gemessen daran, dass sie unterwegs wirklich
        in die Naehe von Platz 4 kommen, was auf gerader Linie nicht
        passiert.
     4. DIE KACHELN: die drei Fassungen stehen im Reisen-Untermenue,
        und das Menue bleibt auf dem Bildschirm.
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

  console.log("\nAUF EINEM FAHRRAD\n");
  const rad = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const platzVon = (wort) => [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf(wort) >= 0)[0] || null;
    const bea = platzVon("bea"), ich = document.querySelector(".lc-platz-ich");
    if (!bea || !ich) return null;
    const wo = (el) => {
      const k = el.querySelector(".lc-kreis");
      const r = k.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const vorI = wo(ich), vorB = wo(bea);
    window.DMA_PRUEFUNG.wirkung("gemeinsam", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 1400));
    const speichen = document.querySelectorAll(".lc-speichen").length;
    await new Promise((f) => setTimeout(f, 1200));
    const mittI = wo(ich), mittB = wo(bea);
    return {
      speichen: speichen,
      wegI: Math.round(Math.hypot(mittI.x - vorI.x, mittI.y - vorI.y)),
      wegB: Math.round(Math.hypot(mittB.x - vorB.x, mittB.y - vorB.y)),
      hoerner: document.querySelectorAll(".lc-ballhoerner").length
    };
  });
  sage(Boolean(rad), "die Buehne steht");
  sage(rad && rad.speichen === 2, "beide Raeder haben Speichen",
    rad ? rad.speichen + " Speichenscheiben" : "-");
  sage(rad && rad.wegI > 40 && rad.wegB > 40, "und BEIDE fahren wirklich los",
    rad ? "ich " + rad.wegI + " px, Bea " + rad.wegB + " px" : "-");
  sage(rad && rad.hoerner === 0, "auf dem Rad wachsen keine Hoerner");

  console.log("\nALS HUEPFBALL — MIT HOERNERN ZUM FESTHALTEN\n");
  /* WIE MAN EINEN SPRUNG MISST.
     Erster Versuch war falsch: gemessen wurde die Hoehe ueber dem
     eigenen Sitzplatz. Der Ball geht aber als ERSTES unter mich, also
     nach UNTEN (hy = d*0,72) — ueber seinen Startpunkt kommt er damit
     nie, auch wenn er huepft. Gemessen wird deshalb der HUB: eine
     Stelle, an der das Bild hoeher liegt als kurz davor UND kurz
     danach. Genau das ist ein Sprung, und genau das tut ein rollendes
     Rad nicht. Der Gegenversuch weiter unten faehrt dieselbe Messung
     mit dem Fahrrad und muss dort nahe null herauskommen. */
  const huepfMessen = `(async (wer, stueck) => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 250));
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf(wer) >= 0)[0];
    if (!platz) return null;
    const kreis = platz.querySelector(".lc-kreis");
    window.DMA_PRUEFUNG.wirkung("gemeinsam", wer.charAt(0).toUpperCase() + wer.slice(1),
      "Alex", stueck ? { stueck: stueck } : {});
    const spur = [];
    let hoerner = 0, breitsten = 1, schmalsten = 1;
    let griffeGesehen = 0, farbeGesehen = "";
    /* GEMESSEN WIRD JEDES BILD, NICHT ALLE 70 ms.
       Beim vollen Durchlauf (zwei Sonden gleichzeitig) hat diese
       Messung „Hub 18 px, 1 Sprungstelle" gemeldet und war rot,
       obwohl sie allein 23 px und 3 Sprungstellen misst. Der Grund
       war die Sonde, nicht der Huepfball: unter Last zieht sich ein
       setTimeout(70) auf ein Vielfaches, und dann fallen ganze
       Spruenge zwischen zwei Messungen. Jetzt wird an JEDEM Bild
       gemessen (requestAnimationFrame) und die Zeit dazu behalten. */
    const zeit = [];
    const bis = performance.now() + 4400;
    await new Promise((fertig) => {
      const schlag = () => {
        const r = kreis.getBoundingClientRect();
        spur.push(r.top + r.height / 2);
        zeit.push(performance.now());
        const hh = platz.querySelector(".lc-ballhoerner");
        hoerner = Math.max(hoerner, platz.querySelectorAll(".lc-ballhoerner").length);
        /* Die Griffe WAEHREND der Fahrt festhalten. Am Ende der
           Messung sind die Hoerner schon wieder abgeraeumt — wer erst
           danach nachsieht, findet null Griffe und haelt das
           faelschlich fuer einen Fehler. */
        if (hh && !griffeGesehen) {
          griffeGesehen = hh.querySelectorAll(".lc-ballhorn-griff").length;
          const gg = hh.querySelector(".lc-ballhorn-griff");
          if (gg) farbeGesehen = getComputedStyle(gg).fill;
        }
        const v = r.width / (r.height || 1);
        breitsten = Math.max(breitsten, v);
        schmalsten = Math.min(schmalsten, v);
        if (performance.now() < bis) requestAnimationFrame(schlag); else fertig();
      };
      requestAnimationFrame(schlag);
    });
    /* Der Hub an einer Stelle: wie viel tiefer liegt der Nachbar auf
       beiden Seiten?
       ABSTAND IN ZEIT, NICHT IN MESSPUNKTEN: bei 60 Bildern je
       Sekunde liegt das Nachbarbild 16 ms daneben, und so kurz
       aendert sich an einem Sprung fast nichts — der Hub waere
       immer ungefaehr null. Verglichen wird deshalb mit dem
       Messpunkt 90 ms davor und 90 ms danach. */
    const nachbar = (i, richtung) => {
      const ziel = zeit[i] + richtung * 90;
      let k = i;
      while (k + richtung >= 0 && k + richtung < zeit.length
             && (richtung > 0 ? zeit[k] < ziel : zeit[k] > ziel)) k += richtung;
      return k;
    };
    let hub = 0, spruenge = 0;
    for (let i = 1; i < spur.length - 1; i++) {
      const a = nachbar(i, -1), b = nachbar(i, 1);
      if (a === i || b === i) continue;
      const h = Math.min(spur[a], spur[b]) - spur[i];
      if (h > hub) hub = h;
      /* Eine Sprungstelle nur einmal zaehlen: der hoechste Punkt in
         seiner Umgebung. Sonst zaehlt ein einziger Sprung bei 60
         Bildern je Sekunde als zwanzig. */
      if (h > 8 && spur[i] <= spur[i - 1] && spur[i] < spur[i + 1]) spruenge++;
    }
    const h = platz.querySelector(".lc-ballhoerner");
    let griffe = griffeGesehen, farbe = farbeGesehen;
    if (h && !griffe) {
      griffe = h.querySelectorAll(".lc-ballhorn-griff").length;
      const g = h.querySelector(".lc-ballhorn-griff");
      if (g) farbe = getComputedStyle(g).fill;
    }
    return { hub: Math.round(hub), spruenge: spruenge, hoerner: hoerner,
             griffe: griffe, farbe: farbe,
             breit: Number(breitsten.toFixed(3)), schmal: Number(schmalsten.toFixed(3)),
             speichen: document.querySelectorAll(".lc-speichen").length };
  })`;
  const ball = await pg.evaluate(huepfMessen + '("cem", "ball")');
  sage(Boolean(ball), "die Buehne steht");
  sage(ball && ball.hoerner >= 1, "der andere bekommt die Hoerner aufgesetzt",
    ball ? ball.hoerner + " Hoernerpaar(e)" : "-");
  sage(ball && ball.griffe === 2 && ball.farbe && ball.farbe !== "none",
    "und die zwei Griffkappen sind gezeichnet",
    ball ? ball.griffe + " Griffe, Farbe " + (ball.farbe || "keine") : "-");
  sage(ball && ball.hub >= 12 && ball.spruenge >= 2,
    "er huepft wirklich — er hebt zwischendurch mehrfach ab",
    ball ? "groesster Hub " + ball.hub + " px, " + ball.spruenge + " Sprungstellen" : "-");
  sage(ball && (ball.breit > 1.04 || ball.schmal < 0.97),
    "und er staucht und streckt sich dabei wie Gummi",
    ball ? "breitestes " + ball.breit + ", schmalstes " + ball.schmal : "-");
  sage(ball && ball.speichen === 0, "ein Huepfball hat keine Speichen");

  /* DER GEGENVERSUCH. Dieselbe Messung, aber auf dem Fahrrad: wer
     rollt, huepft nicht. Faende die Sonde hier denselben Hub, waere
     sie blind und die Messung oben nichts wert. */
  const radHub = await pg.evaluate(huepfMessen + '("dana", "")');
  sage(radHub && radHub.hub < ball.hub / 2,
    "und der Gegenversuch beweist die Messung: auf dem Rad huepft niemand",
    radHub ? "Rad-Hub " + radHub.hub + " px gegen " + (ball ? ball.hub : "-")
      + " px beim Ball" : "-");

  console.log("\nUND DER WEG, DEN ICH SELBST EINZEICHNE\n");
  const weg = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 250));
    const alle = [...document.querySelectorAll(".lc-platz")];
    const nrVon = (el) => Number(el.dataset.lcPlatz);
    const frei = alle.filter((p) => p.classList.contains("lc-platz-frei"));
    if (frei.length < 2) return { grund: "zu wenig frei" };
    /* Ein Umweg, der eine gerade Linie wirklich verlaesst: der
       ENTFERNTESTE freie Platz als Ziel, und als Station ein anderer
       freier Platz, der NICHT auf der Geraden dorthin liegt. */
    const ich = document.querySelector(".lc-platz-ich");
    const mitte = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const mI = mitte(ich);
    const sortiert = frei.slice().sort((a, b) =>
      Math.hypot(mitte(b).x - mI.x, mitte(b).y - mI.y)
      - Math.hypot(mitte(a).x - mI.x, mitte(a).y - mI.y));
    const ziel = sortiert[0];
    const mZ = mitte(ziel);
    /* Abstand eines Punktes von der Geraden ich→ziel. */
    const abstand = (p) => {
      const dx = mZ.x - mI.x, dy = mZ.y - mI.y;
      const l = Math.hypot(dx, dy) || 1;
      return Math.abs((p.x - mI.x) * dy - (p.y - mI.y) * dx) / l;
    };
    const station = sortiert.slice(1)
      .map((el) => ({ el: el, a: abstand(mitte(el)) }))
      .sort((a, b) => b.a - a.a)[0];
    if (!station || station.a < 20) return { grund: "kein Umweg moeglich" };
    const mS = mitte(station.el);
    const kette = nrVon(ich) + "-" + nrVon(station.el) + "-" + nrVon(ziel);
    const kreis = ich.querySelector(".lc-kreis");
    window.DMA_PRUEFUNG.wirkung("gemeinsam", "Bea", "Alex", { bahn: kette });
    /* Kommt mein Bild unterwegs wirklich in die Naehe der Station?
       Auf gerader Linie waere der kuerzeste Abstand dorthin genau
       „station.a" — der gemalte Weg muss deutlich naeher heran. */
    let naechste = 1e9;
    for (let i = 0; i < 48; i++) {
      await new Promise((f) => setTimeout(f, 90));
      const r = kreis.getBoundingClientRect();
      const p = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      naechste = Math.min(naechste, Math.hypot(p.x - mS.x, p.y - mS.y));
    }
    return { kette: kette, gerade: Math.round(station.a), naechste: Math.round(naechste) };
  });
  sage(weg && weg.kette, "ein echter Umweg liess sich stellen",
    weg ? (weg.kette || weg.grund) : "-");
  sage(weg && weg.kette && weg.naechste < weg.gerade * 0.5,
    "und beide fahren den gemalten Umweg wirklich ab",
    weg && weg.kette
      ? "naechster Abstand zur Station " + weg.naechste
        + " px, auf gerader Linie waeren es " + weg.gerade + " px"
      : "-");

  console.log("\nDIE KACHELN IM MENUE\n");
  const menue = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 250));
    const bea = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    if (!bea) return null;
    window.DMA_PRUEF.platzMenue(bea);
    await new Promise((f) => setTimeout(f, 220));
    const reisen = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
      .filter((w) => w.textContent.trim() === "Reisen")[0];
    if (!reisen) return { grund: "keine Reisen-Kachel" };
    reisen.closest("button").click();
    await new Promise((f) => setTimeout(f, 220));
    const kasten = document.getElementById("lcPlatzMenue");
    const worte = [...kasten.querySelectorAll(".lc-platzmenue-wort")]
      .map((w) => w.textContent.trim());
    const r = kasten.getBoundingClientRect();
    return { worte: worte, unten: Math.round(r.bottom - window.innerHeight),
             oben: Math.round(r.top) };
  });
  console.log("  im Reisen-Menue: " + ((menue && menue.worte) || []).join(" · ") + "\n");
  const hat = (t) => Boolean(menue && menue.worte
    && menue.worte.some((w) => w.indexOf(t) >= 0));
  sage(hat("Rad"), "das Fahrrad steht im Menue");
  sage(hat("Hüpfball"), "der Huepfball steht im Menue");
  sage(menue && menue.worte
    && menue.worte.filter((w) => w.indexOf("Weg malen") >= 0).length === 2,
    "und beide Fassungen lassen sich auch mit gemaltem Weg starten");
  sage(menue && menue.unten <= 0 && menue.oben >= 0,
    "das Menue bleibt dabei vollstaendig auf dem Bildschirm",
    menue ? menue.unten + " px unter dem Rand, oben bei " + menue.oben : "-");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
