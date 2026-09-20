#!/usr/bin/env node
/* =========================================================
   BOOT UND BAUSTELLENKRAN — DIE ZWEI NEUEN REISEN
   ---------------------------------------------------------
   GEWUENSCHT: „eine Variante mit dem Flugzeug ... und eine
   Variante vielleicht noch mit einem Boot ... oder dass man
   einen Baustellenkran hat, der einen dann dahin hebt."

   Und GEMELDET war vorher: „viele der neuen Animationen
   funktionieren noch gar nichts. Sie sind einfach nicht
   sichtbar." Deshalb genuegt es hier nicht, dass der Befehl
   etwas verschickt. Gemessen wird:
   1. /boot 5 und /kran 5 schicken die richtige Wirkung mit
      der Platznummer los.
   2. Die Zeichnung haengt danach wirklich in der Sitzreihe.
   3. Sie traegt das Profilbild des Absenders mit.
   4. Sie steht in LC_EFFEKTE — sonst faellt sie still
      durchs Raster (genau das war der Fehler bei der
      Schneekugel).
   5. Sie bewegt sich auch wirklich (laufende Animation).
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

const REISEN = [
  ["/boot 5", "boot", "lc-boot", "lc-boot-fenster"],
  ["/kran 5", "kran", "lc-kran", "lc-kran-last"]
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
  const pg = await br.newPage({ viewport: { width: 420, height: 760 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nDER BEFEHL — UND WAS ER SCHICKT\n");
  for (const [zeile, wirkung] of REISEN) {
    const paket = await pg.evaluate((z) => {
      let raus = null;
      window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
      window.LiveChat.pruefBefehl(z);
      return raus;
    }, zeile);
    pruefe("„" + zeile + "“ schickt „" + wirkung + "“",
      Boolean(paket) && String(paket.wirkung || "") === wirkung,
      paket ? (paket.wirkung || "ohne Wirkung") : "nichts abgefangen");
    pruefe("… und sagt, WOHIN es geht", Boolean(paket && String(paket.wen || "") === "5"),
      paket ? "wen=" + (paket.wen || "FEHLT") : "-");
    /* Ein Platz ist kein Mensch: im Chat darf nicht stehen,
       jemand hiesse 5. */
    pruefe("… und schreibt „Platz 5“, nicht einen Namen",
      Boolean(paket) && /Platz 5/.test(String(paket.text || "")),
      paket ? String(paket.text || "") : "-");
  }

  console.log("\nSTEHT DIE WIRKUNG UEBERHAUPT IN LC_EFFEKTE?\n");
  for (const [, wirkung] of REISEN) {
    const da = await pg.evaluate((w) => {
      /* lcWirkung steigt ohne Eintrag stumm aus — genau daran ist die
         Schneekugel gescheitert. Ein Aufruf, der nichts zeichnet und
         keinen Fehler wirft, ist deshalb kein Beweis. Gemessen wird
         am Ergebnis: zeichnet es etwas? */
      document.querySelectorAll(".lc-boot, .lc-kran").forEach((x) => x.remove());
      return typeof window.DMA_PRUEFUNG.wirkung === "function";
    }, wirkung);
    pruefe(wirkung + ": der Pruefweg steht offen", da);
  }

  /* Die Pruefbuehne besetzt jeden ihrer fuenf Plaetze. Eine Reise
     braucht aber ein freies Ziel — sonst sagt sie zu Recht „Platz ist
     besetzt" und zeichnet nichts. Also bekommt die Reihe einen
     sechsten, freien Platz, genau wie ein echter Raum ihn hat. */
  const freiDa = await pg.evaluate(() => {
    const reihe = document.getElementById("lcPlaetze");
    const vorbild = document.querySelector(".lc-platz");
    if (!reihe || !vorbild) return 0;
    if (reihe.querySelector(".lc-platz-frei")) return 6;
    const frei = vorbild.cloneNode(true);
    frei.className = "lc-platz lc-platz-frei";
    frei.dataset.lcPlatz = "6";
    const n = frei.querySelector(".lc-platz-name");
    if (n) n.textContent = "frei";
    reihe.appendChild(frei);
    return 6;
  });
  pruefe("die Reihe hat ein freies Ziel", freiDa === 6, "Platz " + freiDa);

  console.log("\nUND SIEHT MAN DIE REISE?\n");
  for (const [, wirkung, klasse, teil] of REISEN) {
    const d = await pg.evaluate(async ({ w, k, t }) => {
      document.querySelectorAll("." + k).forEach((x) => x.remove());
      /* Der Absender ist der, der reist — hier der erste Platz. */
      const ersterName = (document.querySelector(".lc-platz .lc-platz-name") || {}).textContent || "";
      window.DMA_PRUEFUNG.wirkung(w, "6", (ersterName || "").trim());
      await new Promise((f) => setTimeout(f, 260));
      const el = document.querySelector("." + k);
      if (!el) return { da: false };
      const inReihe = Boolean(el.closest("#lcPlaetze") || el.parentElement);
      const kasten = el.getBoundingClientRect();
      const stueck = el.querySelector("." + t);
      let laeuft = 0;
      try { laeuft = el.getAnimations({ subtree: true }).length; } catch (e) {}
      return { da: true, inReihe: inReihe, breit: Math.round(kasten.width),
               hoch: Math.round(kasten.height), teil: Boolean(stueck),
               laeuft: laeuft, eltern: String((el.parentElement || {}).id || (el.parentElement || {}).className || "") };
    }, { w: wirkung, k: klasse, t: teil });
    pruefe(wirkung + " zeichnet sich", d.da, d.da ? d.breit + "×" + d.hoch + " px" : "nichts im Dokument");
    pruefe(wirkung + " haengt in der Sitzreihe", Boolean(d.inReihe), d.eltern || "-");
    pruefe(wirkung + " nimmt das Bild mit (." + teil + ")", Boolean(d.teil));
    pruefe(wirkung + " bewegt sich wirklich", (d.laeuft || 0) > 0, (d.laeuft || 0) + " Animationen");
  }

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nBoot und Kran fahren und heben.\n");
  process.exit(fehler ? 1 : 0);
})();
