#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — ALLES FUER ALLE, UND DAS TELEFON IM PLATZMENUE
   ---------------------------------------------------------------------
   XANDER (23.09.2026):
     „Auch das Telefon muss im Profil-Menue aufrufbar sein."
     „der Anruf muss von beiden Seiten auch ausgehen, da passiert noch
      nichts."
     „Ich moechte alle gleichzeitig bespruehen koennen. Ich moechte
      eigentlich alles, was man irgendwie machen kann, moechte ich bei
      allen gleichzeitig machen."

   NACHGEMESSEN, bevor etwas geaendert wurde: die WIRKUNGEN konnten es
   laengst. Zwoelf davon durchgespielt — mit dem Wort „alle" traf jede
   alle fuenf besetzten Plaetze. Gefehlt hat der WEG DORTHIN: unter
   „Alle" standen genau vier Kacheln, und das Telefon stand ueberhaupt
   nicht im Platzmenue.
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

/* Zwoelf Wirkungen, die genau EINEM Platz gelten — und ihre Spur. */
const ARTEN = [
  ["spray", "gift", ".lc-spray"],
  ["pflaster", "", ".lc-pflasterstreifen"],
  ["putzen", "schwamm", ".lc-putzzeug-schwamm"],
  ["applaus", "", ".lc-applaus"],
  ["klaps", "", ".lc-klaps"],
  ["ohrfeige", "", ".lc-ohrfeige"],
  ["anziehen", "krone", ".lc-kleid"],
  ["kopfhoerer", "", ".lc-kopfhoerer"],
  ["hammer", "", ".lc-zhammer"],
  ["streicheln", "", ".lc-streichel"],
  ["luftballon", "", ".lc-ballon"],
  ["kuss", "", ".lc-kuss"],
];

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

  console.log("\n1  MIT „ALLE“ TRIFFT ES WIRKLICH ALLE\n");
  for (const [art, stueck, wahl] of ARTEN) {
    const r = await pg.evaluate(async ([art, stueck, wahl]) => {
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.wirkung(art, "alle", "Alex", stueck ? { stueck: stueck } : {});
      await new Promise((f) => setTimeout(f, 900));
      const plaetze = [...document.querySelectorAll(".lc-platz")];
      return { belegt: plaetze.filter((p) => !p.classList.contains("lc-platz-frei")).length,
               getroffen: plaetze.filter((p) => p.querySelector(wahl)).length };
    }, [art, stueck, wahl]);
    sage(r.getroffen >= r.belegt && r.belegt > 0, "/" + art + " alle",
      r.getroffen + " von " + r.belegt + " Plaetzen");
  }

  console.log("\n2  UND DAS MENUE FUEHRT AUCH HIN\n");
  const menue = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const platz = document.querySelector('[data-lc-platz="2"]');
    /* Das Platzmenue eines FREMDEN Platzes. */
    const geoeffnet = window.DMA_PRUEF.platzMenue
      ? window.DMA_PRUEF.platzMenue(platz) : null;
    void geoeffnet;
    const k1 = document.getElementById("lcPlatzMenue");
    const woerter = k1 ? [...k1.querySelectorAll(".lc-platzmenue-wort")]
      .map((x) => x.textContent.trim()) : [];
    /* Das Telefon anklicken und sehen, was darunter steht. */
    let telefonWoerter = [];
    if (k1) {
      const tel = [...k1.querySelectorAll(".lc-platzmenue-knopf")]
        .filter((b) => /Telefon/.test(b.textContent))[0];
      if (tel) {
        tel.click();
        const k2 = document.getElementById("lcPlatzMenue");
        telefonWoerter = k2 ? [...k2.querySelectorAll(".lc-platzmenue-wort")]
          .map((x) => x.textContent.trim()) : [];
      }
    }
    return { woerter: woerter, telefonWoerter: telefonWoerter };
  });
  sage(menue.woerter.indexOf("Telefon") >= 0,
    "im Platzmenue steht eine Telefon-Kachel",
    menue.woerter.length + " Kacheln");
  sage(menue.telefonWoerter.indexOf("Anklingeln") >= 0
    && menue.telefonWoerter.indexOf("Heimlich telefonieren") >= 0
    && menue.telefonWoerter.indexOf("Auflegen") >= 0,
    "und darunter die drei Dinge, die man mit einem Telefon tut",
    menue.telefonWoerter.join(" · "));

  const alle = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const platz = document.querySelector('[data-lc-platz="2"]');
    if (window.DMA_PRUEF.platzMenue) window.DMA_PRUEF.platzMenue(platz);
    const k1 = document.getElementById("lcPlatzMenue");
    const alleKnopf = k1 ? [...k1.querySelectorAll(".lc-platzmenue-knopf")]
      .filter((b) => {
        const w = b.querySelector(".lc-platzmenue-wort");
        return w && w.textContent.trim() === "Alle";
      })[0] : null;
    if (!alleKnopf) return { fehlt: true };
    alleKnopf.click();
    const k2 = document.getElementById("lcPlatzMenue");
    const woerter = k2 ? [...k2.querySelectorAll(".lc-platzmenue-wort")]
      .map((x) => x.textContent.trim()) : [];
    /* Und ein Tipp darauf: geht wirklich „alle" hinaus? */
    let gesendet = "";
    const altS = window.LiveChat.schreiben;
    window.LiveChat.schreiben = function (t) { gesendet = t; };
    const spruehen = k2 ? [...k2.querySelectorAll(".lc-platzmenue-knopf")]
      .filter((b) => /Hammer/.test(b.textContent))[0] : null;
    if (spruehen) spruehen.click();
    window.LiveChat.schreiben = altS;
    return { woerter: woerter, gesendet: gesendet, kopf: k2
      ? (k2.querySelector(".lc-platzmenue-kopf") || {}).textContent : "" };
  });
  if (alle.fehlt) {
    sage(false, "die Kachel „Alle“ war gar nicht da");
  } else {
    sage(alle.woerter.length >= 20,
      "unter „Alle“ steht jetzt die ganze Kachelwand, nicht mehr vier Dinge",
      alle.woerter.length + " Kacheln");
    ["Sprühdose", "Applaus", "Hammer", "Umarmen", "Putzen"].forEach((w) => {
      sage(alle.woerter.some((x) => x.indexOf(w) === 0),
        "… darunter „" + w + "“");
    });
    sage(/\salle$/.test(alle.gesendet), "und ein Tipp schickt es wirklich an alle",
      "„" + alle.gesendet + "“");
  }

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
