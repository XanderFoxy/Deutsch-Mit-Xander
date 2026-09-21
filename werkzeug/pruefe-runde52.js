#!/usr/bin/env node
/* =========================================================
   RUNDE 52 — DAS BOWLING IM TAKT, DIE PUNKTE AUF DEN PLAETZEN
   ---------------------------------------------------------
   GEMELDET:
   · „Das Bowling ist schlecht getimet" — dazu: der Ball soll
      von MEINEM Platz losrollen.
   · beim Pac-Man „gelbe Punkte auf den Plaetzen".

   Beim Bowling wird die ZEIT gemessen: wann steht ein Kegel,
   wann faellt er, und wann trifft die Kugel. Genau da lag es.
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

  console.log("\nDAS BOWLING: DIE KEGEL STEHEN, DANN FALLEN SIE\n");
  /* GEMESSEN statt abgelesen: an drei Zeitpunkten nachsehen, wo die
     Kegel stehen. Vorher waren sie bei 600 ms noch gar nicht da
     (Verzoegerung 780 ms) und standen bei 900 ms noch aufrecht,
     obwohl die Kugel bei 768 ms schon durch war. */
  const kegel = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-bowling").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("bowling", "3", "Alex");
    const ziel = document.querySelectorAll(".lc-platz")[2];
    const winkel = () => {
      const k = ziel.querySelector(".lc-kegel-1");
      if (!k) return null;
      const cs = getComputedStyle(k);
      const m = new DOMMatrixReadOnly(cs.transform);
      /* Drehwinkel aus der Matrix — nur der Betrag zaehlt. */
      return { sicht: Number(cs.opacity),
               dreh: Math.abs(Math.atan2(m.b, m.a) * 180 / Math.PI) };
    };
    await new Promise((f) => setTimeout(f, 300));
    const a = winkel();
    await new Promise((f) => setTimeout(f, 300));   /* 600 ms */
    const b = winkel();
    /* RUNDE 73: der Kegel kippt jetzt bei 1392 ms, nicht mehr bei
       768 ms. XANDER: „Der Bowling-Sound ist nicht synchron" —
       nachgerechnet kippte der Kegel wegen einer Kurve ueber die
       ganze Animation erst 850 ms NACH dem Ball. Jetzt treffen
       beide bei 58 % von 2,4 s zusammen, und der Ton hat seinen
       Schlag bei 1,4 s. Also wird bei 1700 ms nachgesehen. */
    await new Promise((f) => setTimeout(f, 1100));  /* 1700 ms */
    const c = winkel();
    const kugel = ziel.querySelector(".lc-stoss-bowling");
    return { a: a, b: b, c: c,
             weite: kugel ? getComputedStyle(kugel.parentElement).getPropertyValue("--wx").trim() : "",
             kegelZahl: ziel.querySelectorAll(".lc-kegel").length };
  });
  pruefe("es stehen drei Kegel", kegel.kegelZahl === 3, kegel.kegelZahl + " Stueck");
  pruefe("bei 300 ms sind sie schon zu sehen",
    kegel.a && kegel.a.sicht > 0.9, kegel.a ? "Deckkraft " + kegel.a.sicht : "nicht da");
  pruefe("und sie stehen noch aufrecht",
    kegel.b && kegel.b.dreh < 5, kegel.b ? kegel.b.dreh.toFixed(1) + "° bei 600 ms" : "-");
  /* Die Kugel trifft jetzt bei 1392 ms (58 % von 2,4 s). */
  pruefe("bei 1700 ms sind sie umgefallen — nach dem Einschlag",
    kegel.c && kegel.c.dreh > 30, kegel.c ? kegel.c.dreh.toFixed(1) + "° bei 1700 ms" : "-");

  console.log("\nUND DER BALL KOMMT VON MEINEM PLATZ\n");
  const weiten = await pg.evaluate(async () => {
    const raus = {};
    for (const nr of ["2", "4"]) {
      document.querySelectorAll(".lc-bowling").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung("bowling", nr, "Alex");
      await new Promise((f) => setTimeout(f, 120));
      const pl = document.querySelector('[data-lc-platz="' + nr + '"]');
      const sch = pl ? pl.querySelector(".lc-bowling") : null;
      raus[nr] = sch ? Math.abs(parseFloat(sch.style.getPropertyValue("--wx")) || 0) : 0;
    }
    return raus;
  });
  /* Platz 4 ist doppelt so weit weg wie Platz 2 — der Ball muss also
     auch aus doppelter Entfernung kommen. Vorher stand ueberall
     dieselbe 240. */
  pruefe("aus zwei Plaetzen Entfernung kommt er weiter her als aus einem",
    weiten["4"] > weiten["2"] * 1.5,
    "Platz 2: " + Math.round(weiten["2"]) + " %, Platz 4: " + Math.round(weiten["4"]) + " %");

  console.log("\nPAC-MAN: AUF JEDEM PLATZ LIEGT EIN PUNKT\n");
  const pac = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-pac-krume").forEach((x) => x.remove());
    const ziel = document.querySelectorAll(".lc-platz")[3];
    const name = (ziel.querySelector(".lc-platz-name") || {}).textContent || "";
    const ich = document.querySelector(".lc-platz-ich");
    const ichName = (ich.querySelector(".lc-platz-name") || {}).textContent || "";
    window.DMA_PRUEFUNG.wirkung("pacjagd", name.trim(), ichName.trim());
    await new Promise((f) => setTimeout(f, 200));
    const reihe = document.getElementById("lcPlaetze");
    const aufPlatz = [...reihe.querySelectorAll(".lc-pac-krume-platz")];
    const rk = reihe.getBoundingClientRect();
    /* Liegt jeder dieser Punkte wirklich AUF einem Bild? */
    const treffer = aufPlatz.filter((k) => {
      const b = k.getBoundingClientRect();
      const mx = b.left + b.width / 2, my = b.top + b.height / 2;
      return [...reihe.querySelectorAll(".lc-kreis")].some((c) => {
        const cb = c.getBoundingClientRect();
        return Math.hypot(mx - (cb.left + cb.width / 2), my - (cb.top + cb.height / 2))
               < cb.width / 2;
      });
    });
    return { alle: reihe.querySelectorAll(".lc-pac-krume").length,
             aufPlatz: aufPlatz.length, treffer: treffer.length,
             gross: aufPlatz[0] ? Math.round(aufPlatz[0].getBoundingClientRect().width) : 0,
             rk: Math.round(rk.width) };
  });
  pruefe("es liegen Punkte auf der Strecke", pac.alle >= 4, pac.alle + " Stueck");
  pruefe("und davon welche auf den Plaetzen", pac.aufPlatz >= 2, pac.aufPlatz + " Stueck");
  pruefe("die auch wirklich auf einem Profilbild liegen",
    pac.treffer >= 2, pac.treffer + " von " + pac.aufPlatz);
  /* Auf einem hellen Bild geht ein 8-px-Punkt unter. */
  pruefe("und gross genug sind, um auf einem Bild aufzufallen",
    pac.gross >= 12, pac.gross + " px");

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nDie Kegel fallen im Takt, und Pac-Man findet Futter.\n");
  process.exit(fehler ? 1 : 0);
})();
