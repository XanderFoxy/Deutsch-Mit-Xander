#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 95 — DER DELFIN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Du hast den Delfin noch nicht gebaut."

   Gebaut ist er als REISE: er springt in drei Boegen ueber die
   Sitzreihe, das Bild sitzt auf seinem Ruecken. Gemessen wird an der
   laufenden Seite:
     1. Der Befehl geht hinaus — mit Namen und mit Platznummer.
     2. Der Delfin haengt in der Sitzreihe, mit Finne, Schwanz und
        einem Reiter darauf.
     3. Er SPRINGT: zwischen Start und Ziel geht es mehrmals hoch und
        wieder herunter (nicht auf einer geraden Linie wie ein Boot).
     4. Bei jedem Eintauchen platscht es.
     5. Am Ende bleibt nichts liegen.
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
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({ t: Math.round(performance.now()),
        n: (this.currentSrc || this.src || "").split("/").pop().split("?")[0]
             .replace(/\.(opus|m4a|mp3)$/, "") });
      return ap.call(this);
    };
  });

  console.log("\n1) DER BEFEHL\n");
  const zeilen = await pg.evaluate(async () => {
    try {
      LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                           buehne: true, zuruecksetzen: true });
    } catch (e) {}
    try { LiveChat.pruefPersonSetzen("bea-1", "Bea"); } catch (e) {}
    const letzte = () => {
      const n = LiveChat.lage().nachrichten || [];
      return n.length ? n[n.length - 1] : {};
    };
    const eins = async (z) => {
      LiveChat.schreiben(z);
      await new Promise((f) => setTimeout(f, 70));
      const m = letzte();
      return { wirkung: String(m.wirkung || ""), wen: String(m.wen || ""),
               text: String(m.text || "") };
    };
    return { nummer: await eins("/delfin 5"), name: await eins("/delfin Bea") };
  });
  sage(zeilen.nummer.wirkung === "delfin" && zeilen.nummer.wen === "5",
    "„/delfin 5“ reist zu Platz 5", zeilen.nummer.text);
  sage(zeilen.name.wirkung === "delfin" && zeilen.name.wen === "Bea",
    "„/delfin Bea“ reist zu Bea", zeilen.name.text);

  console.log("\n2) WIE ER AUSSIEHT UND SPRINGT\n");
  const bahn = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.__toene = [];
    window.DMA_PRUEFUNG.wirkung("delfin", "Bea", "Alex", {});
    /* Feiner abgetastet als beim ersten Versuch: mit 300-ms-Schritten
       fiel ein ganzer Bogen zwischen zwei Proben. Ein Sprung dauert
       hier rund 450 ms. */
    const proben = [];
    let vorher = 0;
    const zeiten = [];
    for (let t = 150; t <= 3400; t += 150) zeiten.push(t);
    for (const t of zeiten) {
      await new Promise((f) => setTimeout(f, t - vorher));
      vorher = t;
      const d = document.querySelector(".lc-delfin");
      if (!d) { proben.push(null); continue; }
      const r = d.getBoundingClientRect();
      proben.push({ x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
    }
    const d = document.querySelector(".lc-delfin");
    return { proben: proben,
             teile: d ? {
               finne: Boolean(d.querySelector(".lc-delfin-finne")),
               schwanz: Boolean(d.querySelector(".lc-delfin-schwanz")),
               reiter: Boolean(d.querySelector(".lc-delfin-reiter")),
               auge: Boolean(d.querySelector(".lc-delfin-auge"))
             } : null,
             toene: (window.__toene || []).map((x) => x.n) };
  });
  const da = bahn.proben.filter(Boolean);
  sage(da.length >= 8, "der Delfin ist unterwegs zu sehen",
    da.length + " von " + bahn.proben.length + " Proben");
  sage(Boolean(bahn.teile && bahn.teile.finne && bahn.teile.schwanz && bahn.teile.auge),
    "er hat Finne, Schwanzflosse und ein Auge");
  sage(Boolean(bahn.teile && bahn.teile.reiter), "und das Profilbild sitzt auf seinem Ruecken");
  /* Springt er? Dann muss die Hoehe mehrfach wechseln: hoch, runter,
     hoch, runter. Gezaehlt werden die Richtungswechsel in y. */
  /* Ein Wechsel zaehlt erst ab 8 px — sonst zaehlt jedes Zittern mit. */
  let wechsel = 0;
  let richtung = 0;
  let letzteY = da.length ? da[0].y : 0;
  da.forEach((p) => {
    const d = p.y - letzteY;
    if (Math.abs(d) < 8) return;
    const neu = d > 0 ? 1 : -1;
    if (richtung && neu !== richtung) wechsel++;
    richtung = neu;
    letzteY = p.y;
  });
  sage(wechsel >= 2, "und er SPRINGT — mehrmals hoch und wieder herunter",
    wechsel + " Richtungswechsel in der Hoehe");
  sage(bahn.toene.filter((n) => n === "platsch").length >= 2,
    "bei jedem Eintauchen platscht es",
    bahn.toene.join(", ") || "still");

  console.log("\n3) UND DANACH\n");
  await pg.waitForTimeout(2600);
  const rest = await pg.evaluate(() => document.querySelectorAll(".lc-delfin").length);
  sage(rest === 0, "nach der Ankunft bleibt nichts liegen", rest + " Reste");
  sage(aufSeite.length === 0, "keine Fehler auf der Seite",
    aufSeite.slice(0, 2).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
