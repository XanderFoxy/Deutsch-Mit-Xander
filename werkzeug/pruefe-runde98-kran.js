#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER KRAN HEBT JEMAND ANDEREN AUF EINEN PLATZ
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Dann haette ich gerne den Kran dafuer, dass man
   jemand anderen noch auf einen Platz heben kann."

   Den Kran gab es bisher nur als REISE: er hat MICH von hier nach dort
   gehoben. Als Werkzeug fuer jemand anderen fehlte er — dafuer gab es
   nur die Angel („/heb") und das Lasso.

   GEMESSEN WIRD:
     1  Es gibt den Befehl, und er steht im Platzmenue unter „Holen".
     2  Ausleger, Katze, Seil und Haken sind da — ein Kran, kein Kran-
        Symbol.
     3  Die Katze faehrt wirklich vom Start zum Ziel.
     4  Das Bild wird gehoben und kommt am Zielplatz an.
     5  Erst fangen, dann heben: das Bild bewegt sich erst, nachdem der
        Haken unten war.
     6  RUNDE 100 — XANDER (Walkie #85): „Der Kran kann einheitlich über
        allen Feldern stehen … Die Animation geht gar nicht mit."
        Im echten Raum (die Chatzeile schiebt die Seite): der Haken
        bleibt am Bild, der Ausleger steht bei jedem Zug gleich hoch
        ueber der obersten Reihe, der Turm aussen neben den Plaetzen.
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
  console.log("\n1  ES GIBT IHN ALS WERKZEUG\n");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/art === "kranheb"/.test(lc), "der Befehl /kranheb steht in livechat.js");
  sage(/var kranZieht = false;/.test(lc)
    /* RUNDE 101 — der Bagger haengt sich genauso dazwischen. */
    && /lassoZieht \? "lasso" : \(kranZieht \? "kranheben" : \(baggerZieht \? "bagger"\s*: \(schaufelZieht \? "schaufel" : \(hauabZieht \? "hauab" : "heber"\)\)\)\)/.test(lc),
    "und das Werkzeug sagt selbst an, welche Animation laeuft");

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
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\n2  UND ER SIEHT AUS WIE EIN KRAN UND ARBEITET AUCH SO\n");
  const m = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const ziel = document.querySelector('[data-lc-platz="7"]').getBoundingClientRect();
    window.DMA_PRUEFUNG.wirkung("kranheben", "Bea", "Alex", { ziel: 7 });
    const t0 = performance.now();
    let teile = null, hakenUnten = -1, bildAb = -1;
    let katzeVon = null, katzeBis = null, bildHoch = 0, nahAmZiel = 1e9;
    const bis = t0 + 2700;
    while (performance.now() < bis) {
      const jetzt = Math.round(performance.now() - t0);
      /* RUNDE 99: der Kran ist eine Zeichnung ueber der Sitzreihe
         (.lc-kran-buehne) — Gurte und Streben sind Pfade darin. */
      const sch = document.querySelector(".lc-kran-buehne");
      if (sch && !teile) {
        const gurt = sch.querySelector(".lc-kr-gurt"), str = sch.querySelector(".lc-kr-strebe");
        teile = { ausleger: gurt ? 1 : 0,
          gurte: gurt ? ((gurt.getAttribute("d") || "").match(/M/g) || []).length : 0,
          streben: str ? ((str.getAttribute("d") || "").match(/M/g) || []).length : 0,
          katze: sch.querySelectorAll(".lc-kr-katze").length,
          seil: sch.querySelectorAll(".lc-kr-seil").length,
          haken: sch.querySelectorAll(".lc-kr-haken").length };
      }
      const katze = document.querySelector(".lc-kr-katze");
      if (katze) {
        const r = katze.getBoundingClientRect();
        const x = Math.round(r.left + r.width / 2);
        if (katzeVon === null) katzeVon = x;
        katzeBis = x;
      }
      const haken = document.querySelector(".lc-kr-haken");
      if (haken && hakenUnten < 0) {
        const r = haken.getBoundingClientRect();
        const k = document.querySelector('[data-lc-platz="2"] .lc-kreis')
          .getBoundingClientRect();
        /* Der Haken greift OBEN am Bild an (seit Runde 99 — er haengt
           am Seil, er steckt nicht im Gesicht). */
        if (r.top + r.height >= k.top + 2) hakenUnten = jetzt;
      }
      const k2 = document.querySelector('[data-lc-platz="2"] .lc-kreis');
      if (k2) {
        const mm = /matrix\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\)/
          .exec(getComputedStyle(k2).transform);
        if (mm) {
          const dx = Number(mm[5]), dy = Number(mm[6]);
          if (bildAb < 0 && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) bildAb = jetzt;
          if (-dy > bildHoch) bildHoch = -dy;
          /* Wie nah kommt das Bild dem Zielplatz? Gemessen WAEHREND
             der Fahrt — danach faellt die Animation ab und das Bild
             steht wieder auf seinem Platz (den Sitzwechsel macht in
             Wirklichkeit livechat.js bei 2400 ms). */
          const rr = k2.getBoundingClientRect();
          const dd = Math.abs((rr.left + rr.width / 2) - (ziel.left + ziel.width / 2));
          if (dd < nahAmZiel) nahAmZiel = dd;
        }
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    const amZiel = Math.round(nahAmZiel);
    return { teile: teile, hakenUnten: hakenUnten, bildAb: bildAb,
      katzeWeg: katzeVon === null ? 0 : Math.abs(katzeBis - katzeVon),
      bildHoch: Math.round(bildHoch), amZiel: amZiel };
  });

  const t = m.teile || {};
  sage(t.ausleger === 1 && t.gurte > 0 && t.streben > 0,
    "der Ausleger ist ein Gittertraeger mit Gurten und Streben",
    "Gurte " + t.gurte + ", Streben " + t.streben);
  sage(t.katze === 1 && t.seil === 1 && t.haken === 1,
    "Katze, Seil und Haken sind da",
    "Katze " + t.katze + ", Seil " + t.seil + ", Haken " + t.haken);
  sage(m.katzeWeg > 60, "die Katze faehrt wirklich auf dem Ausleger hinueber",
    m.katzeWeg + " px gefahren");
  sage(m.bildHoch > 10, "das Bild wird angehoben", m.bildHoch + " px hoch");
  sage(m.amZiel <= 40, "und kommt am Zielplatz an", m.amZiel + " px daneben (waehrend der Fahrt gemessen)");

  console.log("\n3  ERST ANSCHLAGEN, DANN HEBEN\n");
  sage(m.hakenUnten >= 0, "der Haken kommt herunter", "ab " + m.hakenUnten + " ms");
  sage(m.bildAb > m.hakenUnten, "und das Bild bewegt sich erst DANACH",
    "Haken unten ab " + m.hakenUnten + " ms, Bild ab " + m.bildAb + " ms");

  console.log("\n4  RUNDE 99 — VON UNTEN NACH OBEN: DER AUSLEGER STEHT UEBER DEM ZIEL\n");
  /* XANDER: „der Kran muss ueber der Zielposition stehen, wenn er
     jemanden von unten nach oben hebt — jetzt faengt er auf der unteren
     Ebene an und traegt ihn darueber hinaus." */
  const h = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 300));
    const zielK = document.querySelector('[data-lc-platz="3"] .lc-kreis').getBoundingClientRect();
    const k5 = document.querySelector('[data-lc-platz="5"] .lc-kreis');
    window.DMA_PRUEFUNG.wirkung("kranheben", "Emmi", "Alex", { ziel: 3 });
    const t0 = performance.now();
    let auslegerUnten = null, hoechstesBild = 1e9, nahAmZiel = 1e9;
    while (performance.now() < t0 + 2600) {
      const gurt = document.querySelector(".lc-kr-gurt");
      if (gurt && auslegerUnten === null) {
        const g = gurt.getBoundingClientRect();
        auslegerUnten = g.bottom;
      }
      const r = k5.getBoundingClientRect();
      if (r.top < hoechstesBild) hoechstesBild = r.top;
      const d = Math.hypot((r.left + r.width / 2) - (zielK.left + zielK.width / 2),
                           (r.top + r.height / 2) - (zielK.top + zielK.height / 2));
      if (d < nahAmZiel) nahAmZiel = d;
      await new Promise((f) => requestAnimationFrame(f));
    }
    return { auslegerUnten: Math.round(auslegerUnten), zielOben: Math.round(zielK.top),
             hoechstesBild: Math.round(hoechstesBild), nahAmZiel: Math.round(nahAmZiel) };
  });
  sage(h.auslegerUnten !== null && h.auslegerUnten <= h.zielOben,
    "der Ausleger steht UEBER dem Zielplatz oben", "Ausleger bis y=" + h.auslegerUnten
    + ", Zielbild ab y=" + h.zielOben);
  sage(h.hoechstesBild >= h.auslegerUnten,
    "das Bild kommt nie ueber den Ausleger hinaus", "hoechster Bildrand y=" + h.hoechstesBild);
  sage(h.nahAmZiel <= 4, "und es kommt genau auf dem Zielplatz an", h.nahAmZiel + " px daneben");

  /* RUNDE 100 — XANDER: „Der Kran ist manchmal langsamer oder schneller
     als die Person eigentlich am Zielort ist." Gemessen wird, wie weit
     Laufkatze und Bild waehrend der Querfahrt (48–72 %) waagerecht
     auseinanderliegen. Vorher bis 52 px (easing ueber die ganze
     Zeitleiste), jetzt eine gemeinsame Kurve. Und: der Kran hat oben
     Fuehrerhaus, Turmspitze, Abspannseile und Gegengewicht. */
  console.log("\n5  RUNDE 100 — KATZE UND BILD IM GLEICHSCHRITT, EIN ECHTER TURMDREHKRAN\n");
  const gleich = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 300));
    const k5 = document.querySelector('[data-lc-platz="5"] .lc-kreis');
    window.DMA_PRUEFUNG.wirkung("kranheben", "Emmi", "Alex", { ziel: 3 });
    const t0 = performance.now(), ab = [];
    let teile = null;
    while (performance.now() < t0 + 2700) {
      const t = performance.now() - t0, kz = document.querySelector(".lc-kr-katze");
      if (kz && t > 2800 * 0.49 && t < 2800 * 0.71) {
        const a = kz.getBoundingClientRect(), b = k5.getBoundingClientRect();
        ab.push(Math.abs((a.left + a.width / 2) - (b.left + b.width / 2)));
      }
      if (!teile && document.querySelector(".lc-kran-buehne")) {
        const q = (c) => document.querySelectorAll(".lc-kran-buehne ." + c).length;
        teile = { haus: q("lc-kr-haus"), fenster: q("lc-kr-fenster"), gewicht: q("lc-kr-gewicht"),
                  abspann: q("lc-kr-abspann"),
                  staerken: [...new Set([...document.querySelectorAll(".lc-kran-buehne .lc-kr-gurt")]
                    .map((g) => getComputedStyle(g).strokeWidth))] };
      }
      /* Erst messen, wenn ALLE Bildtakt-Aufrufe dieses Bildes gelaufen
         sind — sonst liest die Probe mal vor, mal nach dem Setzen der
         Katze (gemessen: dieselbe Fassung ergab 10, 18, 10 px). */
      await new Promise((f) => requestAnimationFrame(() => setTimeout(f, 0)));
    }
    return { max: ab.length ? Math.max.apply(null, ab) : 999, n: ab.length, teile: teile };
  });
  /* 15 px: das Bild pendelt am Haken (±7° um den oberen Rand) — das
     allein verschiebt seine Mitte um bis zu 6 px. Vorher waren es 52–61. */
  sage(gleich.n > 5 && gleich.max <= 15, "Katze und Bild fahren im Gleichschritt",
    "groesster Abstand " + Math.round(gleich.max) + " px (" + gleich.n + " Bilder)");
  const tl = gleich.teile || {};
  sage(tl.haus === 1 && tl.fenster === 1 && tl.gewicht === 1 && tl.abspann === 1,
    "oben: Fuehrerhaus mit Fenster, Gegengewicht, Abspannseile", JSON.stringify(tl));
  sage(tl.staerken && tl.staerken.length === 1, "Turm und Ausleger: dieselbe Gurtstaerke",
    tl.staerken ? tl.staerken.join(", ") : "-");

  console.log("\n6  RUNDE 100 — IM ECHTEN RAUM: HAKEN AM BILD, KRAN UEBER ALLEN FELDERN\n");
  const echt = [];
  for (const [wer, ziel] of [["Cem", 8], ["Emil", 3], ["Dana", 5]]) {
    const pg6 = await br.newPage({ viewport: { width: 390, height: 844 } });
    await pg6.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg6.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg6.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF, { timeout: 25000 });
    echt.push(await pg6.evaluate(async ({ wer, ziel }) => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
        leute: { p0: { id: "p0", name: "Bea", seit: 2000 }, p1: { id: "p1", name: "Cem", seit: 2100 },
                 p2: { id: "p2", name: "Dana", seit: 2200 }, p3: { id: "p3", name: "Emil", seit: 2300 },
                 p4: { id: "p4", name: "Fritz", seit: 2400 } } });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      await new Promise((f) => setTimeout(f, 500));
      const reihe = document.getElementById("lcPlaetze");
      const platz = [...reihe.querySelectorAll(".lc-platz")].find((p) => p.textContent.indexOf(wer) >= 0);
      const kreis = platz.querySelector(".lc-kreis");
      const alle = [...reihe.querySelectorAll(".lc-platz .lc-kreis")].map((k) => k.getBoundingClientRect());
      const g0 = reihe.getBoundingClientRect();
      const feldOben = Math.min(...alle.map((b) => b.top)) - g0.top;
      const feldL = Math.min(...alle.map((b) => b.left)) - g0.left, feldR = Math.max(...alle.map((b) => b.right)) - g0.left;
      window.LiveChat.pruefBefehl("/kranheb " + wer + " " + ziel);
      const t0 = performance.now(), abst = [];
      let ausleger = null, turm = null, verschoben = 0;
      while (performance.now() < t0 + 2300) {
        const t = performance.now() - t0, g = reihe.getBoundingClientRect();
        verschoben = Math.max(verschoben, Math.abs(g.top - g0.top));
        const h = document.querySelector(".lc-kr-haken");
        if (h && t > 2800 * 0.36 && t < 2800 * 0.8) {
          const a = h.getBoundingClientRect(), b = kreis.getBoundingClientRect();
          abst.push(Math.hypot((a.left + a.width / 2) - (b.left + b.width / 2), a.bottom - (b.top + b.height * 0.04)));
        }
        if (!ausleger && document.querySelector(".lc-kran-buehne .lc-kr-gurt")) {
          const bb = document.querySelector(".lc-kran-buehne .lc-kr-gurt").getBBox();
          const tb = document.querySelector(".lc-kran-buehne .lc-kr-turmgurt").getBBox();
          ausleger = bb.y + bb.height;                     /* Unterkante des Auslegers */
          turm = tb.x + tb.width / 2;
        }
        await new Promise((f) => requestAnimationFrame(f));
      }
      return { wer, ziel, haken: abst.length ? Math.max(...abst) : 999, n: abst.length, verschoben: Math.round(verschoben),
               luft: Math.round(feldOben - ausleger), turmAussen: turm < feldL || turm > feldR, turm: Math.round(turm),
               feld: [Math.round(feldL), Math.round(feldR)] };
    }, { wer, ziel }));
    await pg6.close();
  }
  /* 20 px: der Hakenbogen reicht ~11 px unter seinen Aufhaengepunkt,
     und das Bild pendelt ±7° um seinen oberen Rand. Vorher: ~100 px —
     so weit, wie die Seite gerutscht war. */
  echt.forEach((r) => sage(r.n > 5 && r.haken <= 20, r.wer + " → " + r.ziel + ": der Haken bleibt am Bild",
    "groesster Abstand " + Math.round(r.haken) + " px, Seite dabei um " + r.verschoben + " px gerutscht"));
  const luefte = echt.map((r) => r.luft);
  sage(Math.max(...luefte) - Math.min(...luefte) <= 1 && Math.min(...luefte) > 0,
    "der Ausleger steht bei jedem Zug gleich hoch ueber der obersten Reihe", luefte.join(" / ") + " px");
  sage(echt.every((r) => r.turmAussen), "der Turm steht aussen neben den Plaetzen",
    echt.map((r) => r.wer + ": " + r.turm + " (Felder " + r.feld.join("–") + ")").join(", "));

  /* =====================================================================
     7  RUNDE 101 — DER SCHAUFELRADBAGGER
     XANDER (Funk #39): „einen Schaufelradbagger [der jemanden] von seinem
     Platz weg befördern kann und realistisch irgendwo abladen kann."
     ===================================================================== */
  console.log("\n7  RUNDE 101 — DER SCHAUFELRADBAGGER\n");
  const bag = [];
  for (const [wer, ziel] of [["Bea", 6], ["Fritz", 3], ["Dana", 5]]) {
    const pg7 = await br.newPage({ viewport: { width: 390, height: 844 } });
    await pg7.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg7.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg7.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF, { timeout: 25000 });
    bag.push(await pg7.evaluate(async ({ wer, ziel }) => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
        leute: { p0: { id: "p0", name: "Bea", seit: 2000 }, p1: { id: "p1", name: "Cem", seit: 2100 },
                 p2: { id: "p2", name: "Dana", seit: 2200 }, p3: { id: "p3", name: "Emil", seit: 2300 },
                 p4: { id: "p4", name: "Fritz", seit: 2400 } } });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      await new Promise((f) => setTimeout(f, 500));
      const reihe = document.getElementById("lcPlaetze");
      const platzVon = (n) => [...reihe.querySelectorAll(".lc-platz")].find((p) =>
        ((p.querySelector(".lc-platz-name") || {}).textContent || "") === n);
      const platz = platzVon(wer);
      const kreis = platz.querySelector(".lc-kreis");
      const zielK = reihe.querySelector('.lc-platz[data-lc-platz="' + ziel + '"] .lc-kreis');
      const mitte = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      /* Die Lage des Ziels merken wir RELATIV zur Reihe — die Seite rutscht,
         sobald die Chatzeile erscheint. */
      const g0 = reihe.getBoundingClientRect(), zr = zielK.getBoundingClientRect();
      const zRel = { x: mitte(zr).x - g0.left, y: mitte(zr).y - g0.top };
      const breiteK = kreis.getBoundingClientRect().width;
      window.DMA_TONLOG = [];
      window.LiveChat.pruefBefehl("/bagger " + wer + " " + ziel);
      const t0 = performance.now(), proben = [];
      while (performance.now() < t0 + 5600) {
        const t = performance.now() - t0, g = reihe.getBoundingClientRect();
        const k = mitte(kreis.getBoundingClientRect());
        const nabe = document.querySelector(".lc-bg-nabe");
        const nb = nabe ? mitte(nabe.getBoundingClientRect()) : null;
        /* Liegt die Radnabe auf einem Gesicht? (innerhalb 30 % des Radius
           um die Mitte eines anderen Bildes) */
        let aufGesicht = false;
        if (nb && t > 4800 * 0.15 && t < 4800 * 0.84) {
          reihe.querySelectorAll(".lc-platz .lc-kreis").forEach((kk) => {
            if (kk === kreis) return;
            const m = mitte(kk.getBoundingClientRect());
            if (Math.hypot(m.x - nb.x, m.y - nb.y) < breiteK * 0.3) aufGesicht = true;
          });
        }
        const zl = mitte(zielK.getBoundingClientRect());
        proben.push({ t: Math.round(t), bx: k.x - g.left, by: k.y - g.top, zx: zl.x - g.left, zy: zl.y - g.top,
                      da: !!document.querySelector(".lc-bagger-buehne"), aufGesicht });
        await new Promise((f) => requestAnimationFrame(f));
      }
      const nachher = platzVon(wer);
      return { wer, ziel, zRel, proben, breiteK,
               sitztAuf: nachher ? Number(nachher.getAttribute("data-lc-platz")) : 0,
               nachricht: ((window.LiveChat.lage().nachrichten || []).slice(-1)[0] || {}).text || "",
               toene: (window.DMA_TONLOG || []).map((x) => [x.name, Math.round(x.wann - t0)]) };
    }, { wer, ziel }));
    await pg7.close();
  }
  bag.forEach((b) => {
    const P = b.proben;
    const bei = (ms) => P.reduce((a, c) => (Math.abs(c.t - ms) < Math.abs(a.t - ms) ? c : a));
    /* 80 % ist der Aufprall; danach federt es bis 86 % gewollt nach.
       Gesucht wird der Augenblick, in dem das Bild dem Ziel am naechsten
       ist — und der muss zum Aufsetz-Ton passen. */
    const umLand = P.filter((p) => p.t > 4800 * 0.76 && p.t < 4800 * 0.86);
    /* Der ERSTE Augenblick auf dem Ziel (spaeter, beim Platztausch um
       3150 ms, liegt es sowieso dort). */
    const land = umLand.find((c) => Math.hypot(c.bx - c.zx, c.by - c.zy) <= 3)
      || umLand.reduce((a, c) => (Math.hypot(c.bx - c.zx, c.by - c.zy) < Math.hypot(a.bx - a.zx, a.by - a.zy) ? c : a));
    const abLand = Math.round(Math.hypot(land.bx - land.zx, land.by - land.zy));
    let sprung = 0, sprungBei = 0;
    for (let i = 1; i < P.length; i++) {
      if (P[i].t > 4800 * 0.84) break;
      const d = Math.hypot(P[i].bx - P[i - 1].bx, P[i].by - P[i - 1].by);
      if (d > sprung) { sprung = d; sprungBei = P[i].t; }
    }
    sage(/Schaufelradbagger/.test(b.nachricht), b.wer + " → " + b.ziel + ": die Zeile nennt den Bagger", b.nachricht.trim());
    sage(P.filter((p) => p.t > 200 && p.t < 4400).every((p) => p.da), "   der Bagger steht die ganze Zeit da");
    /* RUNDE 101 — eigener Bagger-Ton, eine Datei; der Schlag darin liegt
       bei 80 % (3,82 s). Xander: „Zu schnell" — jetzt 4,8 s. */
    const tonB = (b.toene.find((x) => x[0] === "bagger") || ["", -1])[1];
    sage(abLand <= 3, "   das Bild landet genau auf dem Zielplatz", abLand + " px daneben, bei " + land.t + " ms");
    sage(tonB >= 0 && Math.abs(land.t - (tonB + 3820)) <= 100, "   und der Schlag im Bagger-Ton kommt mit dem Aufprall",
      "Aufprall " + land.t + " ms, Schlag " + (tonB + 3820) + " ms");
    sage(sprung <= b.breiteK * 0.25, "   das Bild springt nie (groesster Schritt je Bild)", Math.round(sprung) + " px bei " + sprungBei + " ms");
    sage(b.sitztAuf === b.ziel, "   danach sitzt " + b.wer + " wirklich auf Platz " + b.ziel, "Platz " + b.sitztAuf);
    sage(P.filter((p) => p.t > 5300).every((p) => !p.da), "   und der Bagger ist wieder weg");
    const auf = P.filter((p) => p.aufGesicht).length;
    sage(auf === 0, "   die Radnabe steht nie auf einem fremden Gesicht", auf + " Bilder");
    const ton = (n) => (b.toene.find((x) => x[0] === n) || [n, -1])[1];
    sage(ton("bagger") >= 0 && ton("bagger") <= 120, "   der Bagger-Ton beginnt mit der Animation", ton("bagger") + " ms");
  });

  /* =====================================================================
     8  RUNDE 101 — HAU AB: MIT BEIDEN HAENDEN EINEN PLATZ WEITER
     XANDER (Funk #18): „… von sich weg schieben … in jede Richtung … Der
     andere wandert dabei einen Platz weiter und bleibt dann dort."
     Alex sitzt in der Mitte der oberen Reihe; jeder Nachbar wird einmal
     geschoben — waagerecht, nach unten und schraeg.
     ===================================================================== */
  console.log("\n8  RUNDE 101 — HAU AB\n");
  const setz8 = async (pg) => {
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF, { timeout: 25000 });
    await pg.evaluate(async () => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 2150, zuruecksetzen: true,
        leute: { p0: { id: "p0", name: "Bea", seit: 2000 }, p1: { id: "p1", name: "Cem", seit: 2100 },
                 p2: { id: "p2", name: "Dana", seit: 2200 }, p3: { id: "p3", name: "Emil", seit: 2300 },
                 p4: { id: "p4", name: "Fritz", seit: 2400 }, p5: { id: "p5", name: "Gina", seit: 2500 } } });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      await new Promise((f) => setTimeout(f, 500));
    });
  };
  const pg8 = await br.newPage({ viewport: { width: 390, height: 844 } });
  await setz8(pg8);
  const sitz8 = await pg8.evaluate(() => {
    const reihe = document.getElementById("lcPlaetze");
    const out = {};
    reihe.querySelectorAll(".lc-platz[data-lc-platz]").forEach((p) => {
      const r = p.querySelector(".lc-kreis").getBoundingClientRect();
      out[p.getAttribute("data-lc-platz")] = { name: ((p.querySelector(".lc-platz-name") || {}).textContent || "").replace(/\s*\(du\)\s*$/i, "").trim(),
        x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width };
    });
    return out;
  });
  const ichNr = Object.keys(sitz8).find((k) => sitz8[k].name === "Alex");
  const I = sitz8[ichNr];
  const nachbarn = Object.keys(sitz8).filter((k) => k !== ichNr && sitz8[k].name && !/^frei$/i.test(sitz8[k].name)
    && Math.hypot(sitz8[k].x - I.x, sitz8[k].y - I.y) <= I.w * 1.9);
  const fern = Object.keys(sitz8).find((k) => k !== ichNr && sitz8[k].name && !/^frei$/i.test(sitz8[k].name)
    && Math.hypot(sitz8[k].x - I.x, sitz8[k].y - I.y) > I.w * 1.9);
  const nein = await pg8.evaluate(async (fernName) => {
    const letzte = () => { const n = window.LiveChat.lage().nachrichten || []; return (n[n.length - 1] || {}).text || ""; };
    window.LiveChat.pruefBefehl("/hauab Alex"); await new Promise((f) => setTimeout(f, 60));
    const selbst = letzte();
    window.LiveChat.pruefBefehl("/hauab " + fernName); await new Promise((f) => setTimeout(f, 60));
    const weit = letzte();
    window.LiveChat.pruefBefehl("/wegschieben " + fernName); await new Promise((f) => setTimeout(f, 60));
    return { selbst, weit, kurz: letzte() };
  }, fern ? sitz8[fern].name : "Niemand");
  await pg8.close();
  sage(/selbst/.test(nein.selbst), "sich selbst wegschieben geht nicht", nein.selbst.trim());
  sage(/nicht direkt neben dir/.test(nein.weit), "wer weiter weg sitzt, wird nicht geschoben", nein.weit.trim());
  sage(/nicht direkt neben dir/.test(nein.kurz), "/wegschieben ist dasselbe wie /hauab", nein.kurz.trim());
  sage(nachbarn.length >= 3, "Alex hat Nachbarn in mehreren Richtungen", nachbarn.map((k) => sitz8[k].name + " (" + k + ")").join(", "));
  for (const nr of nachbarn) {
    const wer = sitz8[nr].name;
    const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
    await setz8(pg);
    const b = await pg.evaluate(async (wer) => {
      const reihe = document.getElementById("lcPlaetze");
      const platzVon = (n) => [...reihe.querySelectorAll(".lc-platz")].find((p) =>
        ((p.querySelector(".lc-platz-name") || {}).textContent || "").replace(/\s*\(du\)\s*$/i, "").trim() === n);
      const kreis = platzVon(wer).querySelector(".lc-kreis");
      const mitte = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      window.DMA_TONLOG = [];
      window.LiveChat.pruefBefehl("/hauab " + wer);
      const t0 = performance.now(), proben = [];
      while (performance.now() < t0 + 2600) {
        const t = performance.now() - t0, g = reihe.getBoundingClientRect();
        const k = mitte(kreis.getBoundingClientRect());
        const h = [...document.querySelectorAll(".lc-ha-hand")].map((x) => mitte(x.getBoundingClientRect()));
        proben.push({ t: Math.round(t), bx: k.x - g.left, by: k.y - g.top,
          hand: h.length ? Math.min(...h.map((p) => Math.hypot(p.x - k.x, p.y - k.y))) : null,
          da: !!document.querySelector(".lc-hauab-buehne") });
        await new Promise((f) => requestAnimationFrame(f));
      }
      const nachher = platzVon(wer);
      return { proben, breite: kreis.getBoundingClientRect().width,
               nach: nachher ? nachher.getAttribute("data-lc-platz") : "",
               text: ((window.LiveChat.lage().nachrichten || []).slice(-1)[0] || {}).text || "",
               toene: (window.DMA_TONLOG || []).map((x) => [x.name, Math.round(x.wann - t0)]) };
    }, wer);
    await pg.close();
    const vorher = sitz8[nr], nachher = sitz8[b.nach] || null;
    const abMirV = Math.hypot(vorher.x - I.x, vorher.y - I.y);
    const abMirN = nachher ? Math.hypot(nachher.x - I.x, nachher.y - I.y) : 0;
    const schritt = nachher ? Math.hypot(nachher.x - vorher.x, nachher.y - vorher.y) : 0;
    sage(/schiebt .* mit beiden H/.test(b.text), wer + " (Platz " + nr + "): die Zeile sagt, was passiert", b.text.trim());
    sage(nachher && abMirN > abMirV + 5, "   landet weiter weg von Alex", "Platz " + nr + " → " + b.nach
      + " (" + Math.round(abMirV) + " → " + Math.round(abMirN) + " px)");
    sage(nachher && schritt <= vorher.w * 1.6, "   und nur EINEN Platz weiter", Math.round(schritt / vorher.w * 100) + " % einer Bildbreite");
    let sprung = 0;
    for (let i = 1; i < b.proben.length; i++) {
      if (b.proben[i].t > 1800) break;
      sprung = Math.max(sprung, Math.hypot(b.proben[i].bx - b.proben[i - 1].bx, b.proben[i].by - b.proben[i - 1].by));
    }
    sage(sprung <= b.breite * 0.25, "   das Bild springt nie", Math.round(sprung) + " px je Bild");
    const anliegen = b.proben.filter((p) => p.t > 700 && p.t < 1150 && p.hand !== null);
    sage(anliegen.length && anliegen.every((p) => p.hand > b.breite * 0.35 && p.hand < b.breite * 0.8),
      "   waehrend des Stosses liegen die Haende am Rand des Bildes",
      anliegen.length ? Math.round(Math.min(...anliegen.map((p) => p.hand))) + "–" + Math.round(Math.max(...anliegen.map((p) => p.hand))) + " px (Bild " + Math.round(b.breite) + ")" : "keine Haende");
    sage(b.proben.filter((p) => p.t > 2500).every((p) => !p.da), "   die Haende sind danach wieder weg");
    const ton = (n) => (b.toene.find((x) => x[0] === n) || [n, -1])[1];
    sage(Math.abs(ton("aufsetzen") - 600) <= 120 && Math.abs(ton("schlurfen") - 1200) <= 120,
      "   Anlegen (0,6 s) und Rutschen (1,2 s) sind zu hoeren", ton("aufsetzen") + " / " + ton("schlurfen") + " ms");
    /* RUNDE 101 — Xander: „Eigener ‚Hau ab!'-Ruf". */
    sage(Math.abs(ton("hauabmann") - 280) <= 120 || Math.abs(ton("hauabfrau") - 280) <= 120,
      "   und der Ruf „Hau ab!“ faellt auf den Stoss", ton("hauabmann") + " / " + ton("hauabfrau") + " ms");
  }

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
