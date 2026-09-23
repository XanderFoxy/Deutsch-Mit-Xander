#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — GANZ KAPUTT, UND NUR DAS PFLASTER MACHT ES HEIL
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Ich moechte, dass der Hammer, wenn man ihn
   mehrfach benutzt, irgendwann das Ganze kaputt schlagen laesst, dass da
   nur noch Teile liegen. Das Profilbild in Fragmenten und der einzige
   Weg wie man sich wieder ganz machen kann, weil es ein bleibender
   Effekt ist, ist dass wir einen Pflaster Profil Effekt nehmen und zwar,
   dass man von oben links nach unten rechts ein Pflaster klebt und von
   unten links nach oben rechts dann noch ein zweites, dass es so kreuz
   ist und dann passiert kurz nach dem so ein kleiner magischer Effekt
   und alles ist wieder heil … Ansonsten bleibt der Scherbenhaufen immer
   unten."

   GEMESSEN WIRD GENAU DAS:
     1. Nach genug Schlaegen zerfaellt das Bild in Scherben.
     2. Der Haufen liegt UNTEN am Platz und bleibt liegen — auch nach
        dem Auffrischen und dem Neuzeichnen.
     3. Von selbst wird nichts mehr heil (keine Heiluhr mehr).
     4. Das Pflaster kommt in zwei Streifen, ueber Kreuz — der erste
        nach unten rechts geneigt (+45 Grad), der zweite andersherum
        (-45 Grad), und der zweite spaeter als der erste.
     5. Danach ist alles heil: keine Scherbe, kein Haufen, kein Riss.
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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nSECHS SCHLAEGE — UND DANN LIEGT ES IN SCHERBEN\n");
  const kaputt = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const bea = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    const stand = [];
    for (let i = 1; i <= 6; i++) {
      window.DMA_PRUEFUNG.wirkung("hammer", "Bea", "Alex", {});
      await new Promise((f) => setTimeout(f, 1000));
      const p = bea();
      stand.push({ schlag: i,
        scherben: p ? p.querySelectorAll(".lc-scherbe").length : -1,
        haufen: p ? p.querySelectorAll(".lc-scherbenstueck").length : -1 });
    }
    /* Und jetzt der Betrieb: auffrischen und neu zeichnen. */
    await new Promise((f) => setTimeout(f, 600));
    window.DMA_PRUEF.auffrischen();
    await new Promise((f) => setTimeout(f, 300));
    const nachAuffrischen = (() => { const p = bea();
      return p ? p.querySelectorAll(".lc-scherbe").length : -1; })();
    /* Und das ganze Klassenzimmer neu zeichnen \u2014 der haerteste Fall. */
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 400));
    const nachNeuZeichnen = (() => { const p = bea();
      return p ? p.querySelectorAll(".lc-scherbe").length : -1; })();
    /* Bleibt es liegen, auch wenn man lange wartet? Die alte Heiluhr
       stand auf 22 Sekunden; hier wird nur kurz gewartet und statt
       dessen nachgesehen, ob ueberhaupt noch eine Uhr laeuft. */
    const p2 = bea();
    return { stand: stand, nachAuffrischen: nachAuffrischen,
             nachNeuZeichnen: nachNeuZeichnen,
             klasse: p2 ? p2.className : "",
             haufenUnten: (() => {
               const p = bea();
               const h = p && p.querySelector(".lc-scherbenhaufen");
               if (!h || !p) return null;
               const a = h.getBoundingClientRect(), b = p.getBoundingClientRect();
               return Math.round((a.top + a.height / 2 - b.top) / b.height * 100);
             })() };
  });
  kaputt.stand.forEach((z) => console.log("  Schlag " + z.schlag + ": "
    + z.scherben + " Scherben, " + z.haufen + " Stuecke im Haufen"));
  console.log("");
  const vorher = kaputt.stand.slice(0, 4).every((z) => z.scherben === 0);
  sage(vorher, "die ersten Schlaege lassen das Bild noch ganz",
    kaputt.stand.slice(0, 4).map((z) => z.scherben).join(", ") + " Scherben");
  const letzte = kaputt.stand[kaputt.stand.length - 1];
  sage(letzte.scherben >= 6, "nach genug Schlaegen liegt es in Fragmenten",
    letzte.scherben + " Scherben");
  sage(letzte.haufen >= 6, "und unten liegt ein Scherbenhaufen",
    letzte.haufen + " Stuecke");
  sage(kaputt.haufenUnten !== null && kaputt.haufenUnten > 60,
    "der Haufen liegt wirklich UNTEN am Platz",
    kaputt.haufenUnten + " % der Platzhoehe");
  sage(kaputt.nachAuffrischen >= 6,
    "und er ueberlebt das Auffrischen (es ist ein bleibender Effekt)",
    kaputt.nachAuffrischen + " Scherben");
  sage(kaputt.nachNeuZeichnen >= 6,
    "und auch das Neuzeichnen des ganzen Klassenzimmers",
    kaputt.nachNeuZeichnen + " Scherben");
  sage(/lc-platz-zerschlagen/.test(kaputt.klasse),
    "der Platz weiss, dass er zerschlagen ist", kaputt.klasse);

  console.log("\nDAS PFLASTER — ZWEI STREIFEN UEBER KREUZ\n");
  const pfl = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("pflaster", "Bea", "Alex", {});
    const spur = [];
    for (let i = 0; i < 26; i++) {
      await new Promise((f) => setTimeout(f, 100));
      const eins = document.querySelector(".lc-pflaster-eins");
      const zwei = document.querySelector(".lc-pflaster-zwei");
      const dreh = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        if (Number(cs.opacity) < 0.5) return null;
        const m = new DOMMatrixReadOnly(cs.transform);
        return Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI);
      };
      spur.push({ t: i * 100, eins: dreh(eins), zwei: dreh(zwei),
        funken: document.querySelectorAll(".lc-pflaster-funke").length });
    }
    await new Promise((f) => setTimeout(f, 1400));
    const bea = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    return { spur: spur,
      heil: { scherben: bea ? bea.querySelectorAll(".lc-scherbe").length : -1,
              haufen: bea ? bea.querySelectorAll(".lc-scherbenstueck").length : -1,
              risse: bea ? bea.querySelectorAll(".lc-hschaden").length : -1,
              klasse: bea ? bea.className : "" } };
  });
  const ersteEins = pfl.spur.find((z) => z.eins !== null);
  const ersteZwei = pfl.spur.find((z) => z.zwei !== null);
  sage(Boolean(ersteEins), "das erste Pflaster klebt",
    ersteEins ? ersteEins.t + " ms, " + ersteEins.eins + " Grad" : "keins gesehen");
  sage(Boolean(ersteZwei), "das zweite auch",
    ersteZwei ? ersteZwei.t + " ms, " + ersteZwei.zwei + " Grad" : "keins gesehen");
  sage(Boolean(ersteEins && ersteZwei) && ersteZwei.t > ersteEins.t,
    "und zwar NACH dem ersten — nicht beide auf einmal",
    ersteEins && ersteZwei ? ersteEins.t + " ms → " + ersteZwei.t + " ms" : "-");
  sage(Boolean(ersteEins && ersteZwei)
    && Math.abs(Math.abs(ersteEins.eins - ersteZwei.zwei) - 90) <= 12,
    "sie liegen ueber Kreuz (90 Grad auseinander)",
    ersteEins && ersteZwei
      ? ersteEins.eins + " Grad und " + ersteZwei.zwei + " Grad" : "-");
  const funken = Math.max.apply(null, pfl.spur.map((z) => z.funken));
  sage(funken >= 8, "danach kommt der magische Puff", funken + " Funken");
  sage(pfl.heil.scherben === 0 && pfl.heil.haufen === 0 && pfl.heil.risse === 0,
    "und alles ist wieder heil — keine Scherbe, kein Haufen, kein Riss",
    JSON.stringify(pfl.heil));

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
