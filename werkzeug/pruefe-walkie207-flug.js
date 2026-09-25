#!/usr/bin/env node
/* =========================================================
   WALKIE #207 — FLUGZEUG SENKRECHT: KEINE KEHRE, KEIN RUCK
   ---------------------------------------------------------
   XANDER: „Effekt taucht gar nicht auf", „Glitch / ruckelt"
   (Leeres Feld halten → Flugzeug, Feld darüber oder darunter).

   GEMESSEN vor der Reparatur: der Scheitel lag immer ueber
   beiden Plaetzen. Senkrecht hiess das hinauf und wieder
   hinunter, und die Draufsicht drehte sich am Scheitel in
   rund 0,2 s um 180 Grad.

   Geprueft wird hier, Bild fuer Bild, fuer Flugzeug und
   Greifvogel, hinauf und hinunter:
   1. Das Fahrzeug erscheint (Deckkraft erreicht 1).
   2. Die Draufsicht dreht sich auf dem ganzen Flug zusammen
      um hoechstens 30 Grad (keine Kehre). Vorher waren es 180 —
      verteilt auf rund 13 Bilder, deshalb zaehlt die Summe.
   3. Es fliegt nicht ueber das Ziel hinaus (kein Umweg nach
      oben ueber beide Plaetze).
   4. Es kommt am Ziel an.
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

/* [Wirkung, Klasse, Ziel, Absender] — Bea sitzt auf 2, darunter
   ist 6 frei; Emmi sitzt auf 5, darueber sitzt Alex auf 1. */
const FAELLE = [
  ["flug", "lc-flieger", "6", "Bea", "hinunter"],
  ["flug", "lc-flieger", "1", "Emmi", "hinauf"],
  ["greifvogel", "lc-greif", "6", "Bea", "hinunter"],
  ["greifvogel", "lc-greif", "1", "Emmi", "hinauf"]
];

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
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* Die Pruefbuehne hat fuenf besetzte Plaetze; fuer „darunter"
     braucht es freie in den Reihen 2 und 3. */
  await pg.evaluate(() => {
    const reihe = document.getElementById("lcPlaetze");
    const vorbild = document.querySelector(".lc-platz");
    for (let n = 6; n <= 12; n++) {
      if (reihe.querySelector('[data-lc-platz="' + n + '"]')) continue;
      const frei = vorbild.cloneNode(true);
      frei.className = "lc-platz lc-platz-frei";
      frei.dataset.lcPlatz = String(n);
      const nm = frei.querySelector(".lc-platz-name");
      if (nm) nm.textContent = "frei";
      reihe.appendChild(frei);
    }
  });

  for (const [wirkung, klasse, ziel, wer, richtung] of FAELLE) {
    console.log("\n" + wirkung.toUpperCase() + " " + richtung + " (" + wer + " → Platz " + ziel + ")\n");
    const m = await pg.evaluate(async ({ wirkung, klasse, ziel, wer }) => {
      document.querySelectorAll(".lc-flieger, .lc-greif").forEach((x) => x.remove());
      const platzY = (sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return r.top + r.height / 2; };
      const vonEl = [...document.querySelectorAll("#lcPlaetze .lc-platz")]
        .find((p) => ((p.querySelector(".lc-platz-name") || {}).textContent || "").trim() === wer);
      const zielEl = document.querySelector('#lcPlaetze [data-lc-platz="' + ziel + '"]');
      const kreisY = (el) => { const r = (el.querySelector(".lc-kreis") || el).getBoundingClientRect(); return r.top + r.height / 2; };
      const y0 = kreisY(vonEl), y1 = kreisY(zielEl);
      window.DMA_PRUEFUNG.wirkung(wirkung, ziel, wer);
      const t0 = performance.now();
      const bilder = [];
      await new Promise((fertig) => {
        const tick = () => {
          const el = document.querySelector("." + klasse);
          if (el) {
            const r = el.getBoundingClientRect();
            const oben = el.querySelector(".lc-v-oben");
            let winkel = null;
            if (oben) {
              const mt = new DOMMatrix(getComputedStyle(oben).transform);
              winkel = Math.atan2(mt.b, mt.a) * 180 / Math.PI;
            }
            bilder.push({ y: r.top + r.height / 2, deck: Number(getComputedStyle(el).opacity), winkel });
          }
          if (performance.now() - t0 < 4500) requestAnimationFrame(tick); else fertig();
        };
        tick();
      });
      return { y0, y1, bilder };
    }, { wirkung, klasse, ziel, wer });

    const b = m.bilder;
    pruefe("es erscheint", b.length > 0 && Math.max(...b.map((x) => x.deck)) > 0.99,
      b.length ? "hoechste Deckkraft " + Math.max(...b.map((x) => x.deck)).toFixed(2) : "kein Element");
    let summe = 0;
    for (let i = 1; i < b.length; i++) {
      if (b[i].winkel === null || b[i - 1].winkel === null) continue;
      let d = Math.abs(b[i].winkel - b[i - 1].winkel) % 360;
      if (d > 180) d = 360 - d;
      summe += d;
    }
    pruefe("die Draufsicht macht keine Kehre", summe <= 30, "Drehung insgesamt " + summe.toFixed(0) + "°");
    /* Das Fahrzeug sitzt am Platzpunkt, nicht in der Kreismitte —
       gemessen wird deshalb ab seinem eigenen ersten Bild, um die
       Strecke von Kreis zu Kreis verschoben. */
    const yA = b.length ? b[0].y : m.y0, yZ = yA + (m.y1 - m.y0);
    m.y1 = yZ;
    const lo = Math.min(yA, yZ), hi = Math.max(yA, yZ);
    const sichtbar = b.filter((x) => x.deck > 0.5);
    const ueber = sichtbar.length ? Math.max(...sichtbar.map((x) => Math.max(lo - x.y, x.y - hi, 0))) : 0;
    pruefe("kein Umweg ueber das Ziel hinaus", ueber <= 6, Math.round(ueber) + " px ausserhalb");
    const letzt = sichtbar[sichtbar.length - 1];
    pruefe("es kommt am Ziel an", Boolean(letzt) && Math.abs(letzt.y - m.y1) <= 8,
      letzt ? "Abstand " + Math.round(Math.abs(letzt.y - m.y1)) + " px" : "-");
  }

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nFlugzeug und Greifvogel fliegen senkrecht ohne Kehre.\n");
  process.exit(fehler ? 1 : 0);
})();
