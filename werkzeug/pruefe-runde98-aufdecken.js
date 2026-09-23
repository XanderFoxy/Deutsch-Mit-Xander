#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DAS AUFDECKEN: GLEICHE FELDER, ECHTES REIHUM
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „und das Aufdecken muss auf allen Seiten
   funktionieren — die Felder, die keine Buchstaben enthalten, sollen
   genau dieselbe Groesse haben und einfach nur die Platzhalter fuer
   die Buchstaben darstellen, und das muss wirklich reihum
   funktionieren in einer logischen Reihenfolge von den Leuten, die da
   sind."

   DREI MESSUNGEN:

   1. DIE FELDER. Jedes Buchstabenfeld muss gleich gross sein, ob
      aufgedeckt oder nicht. (Gemessen: 17,2 x 22 px auf dem Telefon,
      19,3 x 23,7 px am Schreibtisch — ein einziger Wert je Fenster.)
      Und die Satzzeichen dazwischen ragen nicht mehr heraus: sie
      waren 25,6 px hoch neben 22 px hohen Feldern.

   2. REIHUM. Die Reihenfolge ist die Ankunft im Raum. Gemessen wird
      eine ganze Runde und darueber hinaus.

   3. WER DAZWISCHENRUFT, DREHT NICHTS WEITER.
      GEFUNDEN, vorher: Reihe Alex → Bea → Cem → Dana. Dana war dran,
      BEA rief dazwischen — weitergezaehlt wurde von BEA aus, also auf
      Cem. Dana kam nie an die Reihe. Jetzt bleibt die Runde stehen,
      bis der Richtige antwortet.

   4. UND AUF JEDEM GERAET. Wer die Aufgabenzeile nie bekommen hat,
      warf bisher jede Runden-Meldung weg. Gemessen wird deshalb, ob
      „dran" auch ohne offene Aufgabe ankommt.
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

  console.log("\nDIE FELDER SIND ALLE GLEICH GROSS\n");
  for (const breite of [360, 412, 760]) {
    const pg = await br.newPage({ viewport: { width: breite, height: 900 } });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
      { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEFUNG.ratentafel
      && window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
    const m = await pg.evaluate(async () => {
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
      window.DMA_PRUEFUNG.ratentafel(
        { id: "r1", raten: "Wer A sagt, muss auch B sagen!", dran: "Bea" }, z);
      await new Promise((f) => setTimeout(f, 220));
      const felder = [...z.querySelectorAll(".lc-raten-feld")];
      if (!felder.length) return null;
      const masse = felder.map((f) => {
        const r = f.getBoundingClientRect();
        return { b: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10,
                 offen: f.classList.contains("offen") };
      });
      const zeichen = [...z.querySelectorAll(".lc-raten-zeichen")].map((f) =>
        Math.round(f.getBoundingClientRect().height * 10) / 10);
      const reihe = z.querySelector(".lc-raten-reihe");
      return {
        anzahl: felder.length,
        breiten: [...new Set(masse.map((x) => x.b))],
        hoehen: [...new Set(masse.map((x) => x.h))],
        offene: masse.filter((x) => x.offen).length,
        zeichenHoehen: [...new Set(zeichen)],
        ueberstand: Math.round(reihe.scrollWidth - reihe.clientWidth)
      };
    });
    sage(Boolean(m) && m.breiten.length === 1 && m.hoehen.length === 1,
      breite + " px: jedes Feld ist gleich breit und gleich hoch, aufgedeckt wie verdeckt",
      m ? m.anzahl + " Felder (" + m.offene + " offen): "
        + m.breiten.join("/") + " x " + m.hoehen.join("/") + " px" : "-");
    sage(Boolean(m) && m.zeichenHoehen.length === 1
      && Math.abs(m.zeichenHoehen[0] - m.hoehen[0]) < 0.6,
      breite + " px: und die Satzzeichen ragen nicht mehr aus der Reihe",
      m ? "Zeichen " + m.zeichenHoehen.join("/") + " px, Felder "
        + m.hoehen.join("/") + " px" : "-");
    sage(Boolean(m) && m.ueberstand <= 0,
      breite + " px: die Reihe passt in die Breite, ohne seitlich zu laufen",
      m ? m.ueberstand + " px Ueberstand" : "-");
    await pg.close();
  }

  console.log("\nUND ES GEHT WIRKLICH REIHUM\n");
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz,
    { timeout: 20000 });
  const runde = await pg.evaluate(() => {
    const L = window.LiveChat;
    /* Vier Leute, in dieser Ankunftsreihenfolge. */
    L.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      leute: { b: { id: "b", name: "Bea", seit: 2000 },
               c: { id: "c", name: "Cem", seit: 3000 },
               d: { id: "d", name: "Dana", seit: 4000 } } });
    L.pruefBefehl("/raten Der Hund bellt laut");
    const idVon = { Alex: "ich", Bea: "b", Cem: "c", Dana: "d" };
    const raus = { start: L.werIstDran(), folge: [] };
    for (let i = 0; i < 6; i++) {
      const dran = L.werIstDran();
      L.pruefAufgabeVersuch(idVon[dran] || "b", "irgendwas");
      raus.folge.push(L.werIstDran());
    }
    /* Und jetzt ruft jemand dazwischen, der nicht dran ist. */
    const dranVor = L.werIstDran();
    const stoerId = dranVor === "Bea" ? "c" : "b";
    L.pruefAufgabeVersuch(stoerId, "dazwischengerufen");
    raus.dranVor = dranVor;
    raus.nachStoerung = L.werIstDran();
    /* Danach antwortet der Richtige wieder. */
    L.pruefAufgabeVersuch(idVon[L.werIstDran()] || "b", "richtig");
    raus.danach = L.werIstDran();
    /* Und die Runde je Aufgabenzeile — auch ohne offene Aufgabe. */
    raus.dranZuGibtEs = typeof L.dranZu === "function";
    return raus;
  });
  console.log("  Start: " + runde.start + "  —  Folge: " + runde.folge.join(" → ") + "\n");
  const erwartet = ["Cem", "Dana", "Alex", "Bea", "Cem", "Dana"];
  sage(runde.start === "Bea",
    "es faengt bei dem an, der nach dem Fragesteller kam", runde.start);
  sage(JSON.stringify(runde.folge) === JSON.stringify(erwartet),
    "und laeuft genau in der Ankunftsreihenfolge im Kreis",
    runde.folge.join(" → "));
  sage(runde.nachStoerung === runde.dranVor,
    "wer dazwischenruft, dreht die Runde NICHT weiter",
    runde.dranVor + " war dran, danach ist dran: " + runde.nachStoerung);
  sage(runde.danach && runde.danach !== runde.dranVor,
    "antwortet der Richtige, rueckt sie weiter", runde.dranVor + " → " + runde.danach);

  console.log("\nUND AUF EINEM GERAET, DAS DIE AUFGABE NIE BEKOMMEN HAT\n");
  const fremd = await pg.evaluate(() => {
    const L = window.LiveChat;
    /* Die Aufgabe wegnehmen — so wie bei jemandem, der spaeter
       hereinkommt: er hat die Aufgabenzeile nie gesehen. */
    L.pruefAufgabeVergessenImSpeicher();
    /* Und jetzt kommt die Runden-Meldung von draussen. */
    L.pruefEmpfangen({ art: "dran", zeileId: "zx1", name: "Cem", von: "b" });
    return { dranZu: L.dranZu ? L.dranZu("zx1") : "?",
             werIstDran: L.werIstDran() };
  });
  sage(fremd.dranZu === "Cem",
    "die Runde kommt auch dort an und gilt fuer genau diese Aufgabenzeile",
    "dranZu(zx1) = " + fremd.dranZu + ", werIstDran = \"" + fremd.werIstDran + "\"");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
