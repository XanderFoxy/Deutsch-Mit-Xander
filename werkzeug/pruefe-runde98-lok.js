#!/usr/bin/env node
/* RUNDE 100 — gemessen werden nur die Schienen, auf denen die Lok FAEHRT.
   Der Rueckweg, der die Strecke zum Rundkurs schliesst (XANDER: „die Strecke
   immer automatisch und logisch geschlossen"), traegt „lc-lok-rund". */
/* =====================================================================
   SONDE RUNDE 98 — DIE LOK FAEHRT, WO MAN SIE HINSCHICKT
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Schienen von der Lok gehen noch nicht in
   alle Richtung. Die ist noch total inkonsistent, die geht nach oben,
   manchmal geht sie auch manchmal um die Kurve, aber sie soll generell
   ueber alle Leute immer fahren koennen, egal wo ich hinfahren
   moechte."

   GEFUNDEN: die Lok hat den gemalten Weg NIE gesehen. Sie hat sich
   ihre Strecke immer selbst gesucht (lcWegSuchen) — auch dann, wenn
   man mit dem Finger eine ganz andere gezogen hatte. Man malt einen
   Weg, sie faehrt einen anderen: genau das ist „inkonsistent".

   GEMESSEN WIRD:
     1  Mit gemaltem Weg faehrt sie die Stationen ab.
     2  Unter ihr liegen dabei WIRKLICH Gleise, und zwar in alle
        Richtungen: waagerechte UND senkrechte Schienenstuecke.
     3  Sie faehrt ueber Besetzte hinweg — die schreien dann auch.
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
      window.__toene.push((this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a|mp3)$/, ""));
      return ap.call(this);
    };
  });

  const fahrt = async (ziel) => pg.evaluate(async (ziel) => {
    window.DMA_PRUEF.effektBuehne();
    window.__toene = [];
    const platz = (nr) => {
      const p = document.querySelector('[data-lc-platz="' + nr + '"]');
      const k = p.getBoundingClientRect();
      return { x: k.left + k.width / 2, y: k.top + k.height / 2 };
    };
    const st4 = platz(4);
    window.DMA_PRUEFUNG.wirkung("lok", ziel, "Alex", {});
    let naeh = 1e9, strecke = 0, vorX = null;
    /* FUNK 76 — die ganze Fahrt messen (mit Tunnel und Wagen dauert sie
       laenger); frueher hoerte die Messung nach 4 s auf, und ob die Lok
       Platz 4 „erreichte", hing nur davon ab, wie schnell sie war. */
    const bis = performance.now() + 16000;
    await new Promise((f) => setTimeout(f, 200));
    /* Das Gleis wird gleich am Anfang festgehalten — nach der Fahrt ist
       es aufgeraeumt. */
    const gleisKopie = (document.querySelector(".lc-lok-gleis") || { cloneNode: () => null }).cloneNode(true);
    while (performance.now() < bis && document.querySelector(".lc-lok")) {
      const el = document.querySelector(".lc-lok");
      if (el) {
        const k = el.getBoundingClientRect();
        const mx = k.left + k.width / 2, my = k.top + k.height / 2;
        naeh = Math.min(naeh, Math.hypot(mx - st4.x, my - st4.y));
        if (vorX !== null) strecke += Math.abs(mx - vorX);
        vorX = mx;
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    /* Die Gleise: jedes Schienenstueck als Richtung. */
    const gleis = gleisKopie;
    let waagerecht = 0, senkrecht = 0, bogen = 0, schienen = 0;
    if (gleis) {
      gleis.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)").forEach((pf) => {
        schienen++;
        const d = pf.getAttribute("d") || "";
        if (/A/.test(d)) { bogen++; return; }
        const m = /M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)/.exec(d);
        if (!m) return;
        const dx = Math.abs(Number(m[3]) - Number(m[1]));
        const dy = Math.abs(Number(m[4]) - Number(m[2]));
        if (dx > dy * 2) waagerecht++;
        else if (dy > dx * 2) senkrecht++;
      });
    }
    return { naeh: Math.round(naeh), strecke: Math.round(strecke),
      schienen: schienen, waagerecht: waagerecht, senkrecht: senkrecht, bogen: bogen,
      toene: (window.__toene || []).slice(),
      geplaettet: document.querySelectorAll(".lc-ueberfahren, .lc-lok-platt").length };
  }, ziel);

  console.log("\n1  DER GEMALTE WEG GILT\n");
  const mit = await fahrt("1-4-5-8");
  /* Ohne gemalten Weg nach 5: die kuerzeste Strecke fuehrt senkrecht
     hinunter und kommt Platz 4 nie nahe (nach 8 kann die kuerzeste
     Strecke selbst ueber 4 fuehren — dann bewiese der Vergleich nichts). */
  const ohne = await fahrt("5");
  sage(mit.naeh <= 60 && mit.naeh < ohne.naeh - 20,
    "mit gemaltem Weg kommt sie an Platz 4 vorbei",
    "mit Weg " + mit.naeh + " px, ohne Weg " + ohne.naeh + " px");
  sage(mit.strecke > ohne.strecke * 1.3,
    "und faehrt dabei wirklich den laengeren Weg",
    "mit Weg " + mit.strecke + " px, ohne Weg " + ohne.strecke + " px");

  console.log("\n2  UND UNTER IHR LIEGEN GLEISE IN ALLE RICHTUNGEN\n");
  /* Ein Weg mit einem echten RECHTEN WINKEL: 1 nach 2 waagerecht,
     2 nach 6 senkrecht, 6 nach 7 wieder waagerecht. Nur so laesst
     sich ueberhaupt pruefen, ob es senkrechte Gleise und Kurven
     gibt — auf 1-4-5-8 kommt kein einziger rechter Winkel vor. */
  const eck = await fahrt("1-2-6-7");
  sage(eck.schienen > 0, "es liegen Schienen da", eck.schienen + " Schienenstuecke");
  sage(eck.waagerecht > 0, "waagerechte Gleise", eck.waagerecht + " Stueck");
  sage(eck.senkrecht > 0, "senkrechte Gleise — also auch nach oben und unten",
    eck.senkrecht + " Stueck");
  sage(eck.bogen > 0, "und Kurvenmodule dazwischen", eck.bogen + " Boegen");

  console.log("\n3  SIE FAEHRT UEBER DIE LEUTE\n");
  sage(mit.toene.some((t) => /^(aumann|aufrau|schrei)/.test(t)),
    "wer ueberfahren wird, schreit auch",
    mit.toene.join(", ") || "nichts");

  /* Ein Bild von der Strecke. */
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("lok", "1-4-5-8", "Alex", {});
  });
  await pg.waitForTimeout(1600);
  const el = await pg.$("#lcPlaetze");
  if (el) await el.screenshot({ path: "/tmp/claude-0/lok-weg.png" });

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
