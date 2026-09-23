#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DIE UEBERSCHRIFT IM KOPF DER LESETAFEL
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „repariere mal die Ueberschrift im Android, wo
   ich bei den Aufgaben etwas mache und dann sollen sie Texte vorlesen
   — die Ueberschrift, die steht zwischen dem Niveau und zwischen
   Betonung und Fokus und ist von oben nach unten in einzeln
   runtergequetscht, das macht ueberhaupt keinen Sinn."

   GEMESSEN, vorher (Titel „Der Wolkenkratzer in der Abenddaemmerung",
   39 Zeichen):
       760 px Fenster:    1 Zeile,  Kopf  21 px hoch
       460 px:            4 Zeilen, Kopf  72 px
       412 px (Android):  5 Zeilen, Kopf  89 px
       360 px (Android): 18 Zeilen, Kopf 322 px, Titel nur 21 px breit
   Bei 360 px stand wirklich ein Buchstabe je Zeile.

   DER GRUND: der Kopf war eine EINZELNE Flex-Zeile. Die Schalter
   „Betonung" und „Fokus" tragen white-space: nowrap und geben keinen
   Platz ab; der Titel dazwischen wurde zusammengedrueckt, und weil im
   Chat overflow-wrap: anywhere gilt, brach er Buchstabe fuer
   Buchstabe um.

   ACHTUNG BEIM MESSEN, das ist hier der halbe Aufwand:
   „.lc-zeile" ist ein Raster mit DREI Spalten (2,6em Uhrzeit | auto
   Name | 1fr Text). Haengt man die Tafel als EINZIGES Kind ein,
   landet sie in der 36 px schmalen Uhrzeitspalte — dann misst die
   Sonde ihren eigenen Fehler und meldet auch am Schreibtisch einen
   zerquetschten Titel. Genau das ist beim ersten Entwurf passiert.
   Deshalb stehen hier Uhr und Name davor, wie im echten Chat.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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
  /* Vier Fensterbreiten: zwei typische Android-Telefone, ein grosses
     Telefon und der Schreibtisch. */
  const breiten = [360, 412, 460, 760];
  const ergebnis = [];
  for (const breite of breiten) {
    const pg = await br.newPage({ viewport: { width: breite, height: 820 } });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
      { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF
      && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
    const mass = await pg.evaluate(async () => {
      window.DMA_PRUEF.effektBuehne();
      await new Promise((f) => setTimeout(f, 150));
      const z = document.createElement("p");
      z.className = "lc-zeile";
      const uhr = document.createElement("span");
      uhr.className = "lc-zeit"; uhr.textContent = "09:12";
      const nam = document.createElement("b");
      nam.className = "lc-nick"; nam.textContent = "Alex:";
      z.appendChild(uhr); z.appendChild(nam);
      document.getElementById("lcVerlauf").appendChild(z);
      window.DMA_PRUEFUNG.lesetafel({ id: "t9", text: "Lies vor.", leseNiveau: "B1",
        leseTitel: "Der Wolkenkratzer in der Abenddämmerung",
        leseZeilen: ["Erster Satz.", "Zweiter Satz."] }, z);
      await new Promise((f) => setTimeout(f, 220));
      const kopf = z.querySelector(".lc-lese-kopf");
      const titel = z.querySelector(".lc-lese-titel");
      const abz = z.querySelector(".lc-lese-abzeichen");
      const schalter = z.querySelectorAll(".lc-lese-schalter");
      if (!titel || !kopf) return null;
      const rt = titel.getBoundingClientRect();
      const rk = kopf.getBoundingClientRect();
      const cs = getComputedStyle(titel);
      const zh = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) * 1.3);
      return {
        kopfBreit: Math.round(rk.width), kopfHoch: Math.round(rk.height),
        titelBreit: Math.round(rt.width),
        zeilen: Math.round(rt.height / zh * 10) / 10,
        abzeichen: Boolean(abz) && abz.textContent.trim() === "B1",
        schalter: schalter.length,
        /* Steht wirklich noch alles nebeneinander oder untereinander
           — aber jedenfalls IM Kopf? */
        schalterDrin: [...schalter].every((s) => {
          const r = s.getBoundingClientRect();
          return r.left >= rk.left - 1 && r.right <= rk.right + 1;
        })
      };
    });
    ergebnis.push({ breite: breite, m: mass });
    await pg.close();
  }
  await br.close(); srv.close();

  console.log("\nWIE HOCH IST DER KOPF, UND AUF WIE VIELEN ZEILEN STEHT DER TITEL?\n");
  ergebnis.forEach((e) => {
    console.log("  " + String(e.breite).padStart(4) + " px: "
      + (e.m ? e.m.zeilen + " Zeile(n), Kopf " + e.m.kopfHoch + " px hoch, Titel "
        + e.m.titelBreit + " px breit" : "keine Tafel"));
  });
  console.log("");

  ergebnis.forEach((e) => {
    const m = e.m;
    sage(Boolean(m), e.breite + " px: die Lesetafel steht da");
    if (!m) return;
    /* DIE KERNMESSUNG. Zwei Zeilen sind in Ordnung (ein langer Titel
       darf umbrechen); achtzehn sind ein Buchstabe je Zeile. */
    sage(m.zeilen <= 3,
      e.breite + " px: der Titel steht waagerecht, nicht buchstabenweise untereinander",
      m.zeilen + " Zeile(n)");
    /* Und er hat wirklich Platz: mindestens acht Zeichen breit. */
    sage(m.titelBreit >= 70,
      e.breite + " px: und er hat auch Breite bekommen",
      m.titelBreit + " px");
    sage(m.abzeichen && m.schalter === 2 && m.schalterDrin,
      e.breite + " px: Niveau, Betonung und Fokus stehen weiterhin alle im Kopf",
      "Abzeichen " + (m.abzeichen ? "da" : "fehlt") + ", " + m.schalter + " Schalter");
  });

  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
