#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER FAHRSTUHL
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Der Fahrstuhl ist unlogisch, weil die Tueren
   von einem Fahrstuhl niemals nach links und rechts sich erweitern.
   Sie geht innerhalb des Rahmens auf, dann wird er auch nicht so
   riesig der Fahrstuhl, und er soll realistisch zaehlen: auf der einen
   Seite, wo man losfaehrt, soll die Zahl steigen, solange bleiben die
   Tueren zu, und auf der anderen Seite soll die Zahl genauso am
   steigen sein und dann dieses Blink-Geraeusch geben. Die
   Fahrstuhltuer geht auf und im Fahrstuhl ist das Profilbild, wonach
   sich der Fahrstuhl dann leicht ausblendet und das Profilbild wieder
   seinen Platz einnimmt."

   GEMESSEN WIRD JEDER EINZELNE DIESER PUNKTE:
     1  Kein Tuerfluegel steht je ueber den Rahmen hinaus.
     2  Die Kabine ist nicht groesser als gut ein Platz.
     3  Beide Anzeigen zaehlen, und zwar Platz fuer Platz.
     4  In beiden Kabinen steckt das Profilbild.
     5  Das Glockchen klingt, wenn die Tuer aufgeht.
     6  Am Ende ist der Fahrstuhl weg.
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
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({ was: (this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a|mp3)$/, ""),
        wann: Math.round(performance.now() - (window.__start || 0)) });
      return ap.call(this);
    };
  });

  console.log("\nWAS DER FAHRSTUHL TUT\n");
  const m = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.__toene = [];
    const platz = document.querySelector('[data-lc-platz="5"]');
    const platzBreit = platz ? platz.getBoundingClientRect().width : 0;
    window.__start = performance.now();
    /* Emmi (Platz 5) faehrt zu Platz 8 — drei Stockwerke. */
    window.DMA_PRUEFUNG.wirkung("fahrstuhl", "8", "Emmi", {});
    await new Promise((f) => setTimeout(f, 120));
    const kabinen = Array.from(document.querySelectorAll(".lc-lift"));
    const anzeigen = kabinen.map((k) => k.querySelector(".lc-lift-zahl"));
    const zahlen = [[], []];
    let ueberstand = 0, schlimmster = 0, bilder = 0;
    const breit = kabinen.length
      ? Math.max.apply(null, kabinen.map((k) => k.getBoundingClientRect().width)) : 0;
    const bild = document.querySelectorAll(".lc-lift-bild").length;
    const bildKreis = document.querySelectorAll(".lc-lift-bild .lc-kreis").length;
    /* OB DIE TUER UEBER DEN RAHMEN HINAUSSTEHT, laesst sich NICHT mit
       getBoundingClientRect messen: der liefert den Layoutkasten, auch
       wenn der Elternteil ihn abschneidet. Deshalb wird hier nur
       nachgesehen, DASS der Rahmen abschneidet — und weiter unten
       wird Bild gegen Bild verglichen, was wirklich zu sehen ist. */
    const schneidet = kabinen.filter((k) => {
      const r = k.querySelector(".lc-lift-rahmen");
      return r && getComputedStyle(r).overflow === "hidden";
    }).length;
    const bis = performance.now() + 2600;
    while (performance.now() < bis) {
      kabinen.forEach((k, i) => {
        const z = anzeigen[i];
        if (z) {
          const t = z.textContent.trim();
          if (!zahlen[i].length || zahlen[i][zahlen[i].length - 1] !== t) zahlen[i].push(t);
        }
      });
      bilder++;
      await new Promise((f) => requestAnimationFrame(f));
    }
    await new Promise((f) => setTimeout(f, 1200));
    void ueberstand; void schlimmster;
    return { platzBreit: Math.round(platzBreit), breit: Math.round(breit),
      kabinen: kabinen.length, bild: bild, bildKreis: bildKreis,
      zahlen: zahlen, schneidet: schneidet,
      bilder: bilder, toene: (window.__toene || []).slice(),
      uebrig: document.querySelectorAll(".lc-lift").length };
  });

  sage(m.kabinen === 2, "zwei Kabinen: Start und Ziel", m.kabinen + " Kabinen");
  sage(m.schneidet === 2, "beide Rahmen schneiden ab \u2014 die Tuer laeuft in die Wand",
    m.schneidet + " von " + m.kabinen + " mit overflow:hidden");
  sage(m.breit > 0 && m.breit <= m.platzBreit * 1.15,
    "und die Kabine ist nicht riesig",
    m.breit + " px auf einem Platz von " + m.platzBreit + " px ("
    + (m.platzBreit ? (m.breit / m.platzBreit).toFixed(2) : "?") + "×)");
  sage(m.bild === 2, "in BEIDEN Kabinen steckt ein Profilbild", m.bild + " Bilder");
  sage(m.bildKreis === 2, "und es ist wirklich die Abschrift des Platzbildes",
    m.bildKreis + " Abschriften");
  sage(m.zahlen[0].length >= 3, "die Anzeige am Start zaehlt",
    m.zahlen[0].join(" → "));
  sage(m.zahlen[1].length >= 3, "und die am Ziel genauso",
    m.zahlen[1].join(" → "));
  sage(m.zahlen[0].join(",") === m.zahlen[1].join(","),
    "beide zeigen dieselbe Fahrt — es ist ja dieselbe");
  sage(m.zahlen[0][m.zahlen[0].length - 1] === "8",
    "und am Ende steht das Ziel da", m.zahlen[0].join(" → "));
  const bling = m.toene.filter((t) => t.was === "bling");
  sage(bling.length > 0, "das Glockchen klingt",
    bling.map((b) => b.wann + " ms").join(", ") || "gar nicht");
  if (bling.length) sage(bling[0].wann >= 1700 && bling[0].wann <= 2200,
    "und zwar genau dann, wenn die Tuer aufgeht",
    bling[0].wann + " ms (Tuer ab 2002 ms)");
  sage(m.uebrig === 0, "danach ist der Fahrstuhl weg", m.uebrig + " Reste");

  /* =====================================================================
     UND JETZT DER BEWEIS AM BILD
     ---------------------------------------------------------------------
     getBoundingClientRect taugt hier nicht: er liefert den Layoutkasten,
     auch wenn der Rahmen ihn abschneidet. Also wird verglichen, was der
     Browser WIRKLICH ZEICHNET — dieselbe Sitzreihe einmal mit und einmal
     ohne Fahrstuhl, Bildpunkt fuer Bildpunkt. Alles, was sich
     unterscheidet, MUSS innerhalb der Kabine liegen.
     ===================================================================== */
  const { execFileSync } = require("child_process");
  const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
  const rohBild = (datei) => {
    const kopf = execFileSync(FFMPEG, ["-v", "error", "-i", datei,
      "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 28 });
    return kopf;
  };
  const masse = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const r = document.getElementById("lcPlaetze").getBoundingClientRect();
    return { breit: Math.round(r.width), hoch: Math.round(r.height) };
  });
  await (await pg.$("#lcPlaetze")).screenshot({ path: "/tmp/claude-0/lift-ohne.png" });
  /* Genau in dem Bild, in dem die Tueren am Ziel offen stehen. */
  const kasten = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("fahrstuhl", "8", "Emmi", {});
    await new Promise((f) => setTimeout(f, 2260));
    const flaecheR = document.getElementById("lcPlaetze").getBoundingClientRect();
    const alle = Array.from(document.querySelectorAll(".lc-lift"))
      .map((k) => k.getBoundingClientRect());
    if (!alle.length) return null;
    /* JEDE KABINE EINZELN \u2014 nicht ihr gemeinsamer Kasten. Der
       spannte ueber die halbe Sitzreihe und wuerde jeden Ueberstand
       verstecken. Die Anzeige haengt ein Stueck ueber der Kabine,
       dafuer 7 px Luft nach oben. */
    return alle.map((r) => ({
      links: Math.floor(r.left - flaecheR.left),
      rechts: Math.ceil(r.right - flaecheR.left),
      oben: Math.floor(r.top - flaecheR.top) - 7,
      unten: Math.ceil(r.bottom - flaecheR.top),
    }));
  });
  await (await pg.$("#lcPlaetze")).screenshot({ path: "/tmp/claude-0/lift-mit.png" });
  if (kasten && kasten.length) {
    const a1 = rohBild("/tmp/claude-0/lift-ohne.png");
    const a2 = rohBild("/tmp/claude-0/lift-mit.png");
    const b = masse.breit, h = masse.hoch;
    let anders = 0, draussen = 0, weiteste = 0;
    const drin = (x, y) => kasten.some((k) =>
      x >= k.links - 1 && x <= k.rechts + 1 && y >= k.oben - 1 && y <= k.unten + 1);
    if (a1.length === a2.length && a1.length >= b * h * 3) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < b; x++) {
          const i = (y * b + x) * 3;
          if (Math.abs(a1[i] - a2[i]) > 12 || Math.abs(a1[i + 1] - a2[i + 1]) > 12
              || Math.abs(a1[i + 2] - a2[i + 2]) > 12) {
            anders++;
            if (!drin(x, y)) {
              draussen++;
              const wie = Math.min.apply(null, kasten.map((k) =>
                Math.max(k.links - x, x - k.rechts, 0)));
              if (wie > weiteste) weiteste = wie;
            }
          }
        }
      }
    }
    sage(anders > 500, "der Fahrstuhl ist wirklich zu sehen",
      anders + " veraenderte Bildpunkte");
    /* JEDE KABINE EINZELN geprueft \u2014 ein gemeinsamer Kasten wuerde
       ueber die halbe Sitzreihe spannen und jeden Ueberstand decken. */
    sage(draussen === 0,
      "und KEIN Bildpunkt davon liegt ausserhalb seiner eigenen Kabine",
      draussen ? draussen + " Punkte, bis zu " + weiteste + " px daneben"
               : anders + " Punkte geprueft, alle drin (Kabinen bei "
                 + kasten.map((k) => k.links + "\u2013" + k.rechts).join(" und ") + " px)");
  } else {
    sage(false, "die Kabine war im Vergleichsbild nicht da");
  }

  /* Ein Bild vom Moment, in dem die Tuer am Ziel aufgeht. */
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("fahrstuhl", "8", "Emmi", {});
  });
  await pg.waitForTimeout(2180);
  const el = await pg.$("#lcPlaetze");
  if (el) await el.screenshot({ path: "/tmp/claude-0/fahrstuhl-auf.png" });
  await pg.waitForTimeout(1400);
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("fahrstuhl", "8", "Emmi", {});
  });
  await pg.waitForTimeout(900);
  const el2 = await pg.$("#lcPlaetze");
  if (el2) await el2.screenshot({ path: "/tmp/claude-0/fahrstuhl-zu.png" });

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
