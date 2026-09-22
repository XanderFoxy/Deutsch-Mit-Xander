/* PRÜFT DAS UPDATE-PANEL BEI „ES WAR EINMAL IN DEUTSCHLAND".
   ---------------------------------------------------------------
   XANDER: „Ich sehe übrigens immer noch nicht wieder mein Update
   Panel bei ‚Es war einmal in Deutschland'. Ich als Administrator
   muss das sehen, damit ich darauf Einfluss haben kann … an der
   Stelle, wo es früher war, über dem Beitrag … Es soll so
   freigegeben sein, wie ich es freigegeben hab, indem ich auf
   dieses Häkchen geklickt habe."

   Gemessen wird deshalb dreierlei:
     1. Ist die Schaltfläche überhaupt da, wenn das Konto moderieren
        darf?
     2. Steht sie ÜBER dem Beitrag des Tages (kleinere Y-Position)?
     3. Ist das Häkchen gesetzt, obwohl in der Merkmal-Tabelle nichts
        steht — also „nie gesperrt heisst freigegeben"? */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".png":"image/png", ".json":"application/json" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(W, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage();
  await pg.addInitScript(() => localStorage.setItem("dma_tour_seen", "1"));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  // Konto auf „darf moderieren" stellen, BEVOR gezeichnet wird.
  await pg.evaluate(() => {
    Backend.canModerate = () => true;
    Backend.isOwner = () => true;
    Backend.getRawFeatureFlagValue = () => undefined; // nie gesetzt
    Backend.isFeatureOnDefaultTrue = (k) => Backend.getRawFeatureFlagValue(k) === false ? false : true;
  });
  // Zum Bereich „Wissen" und dort auf den Unterreiter „Kompass".
  await pg.evaluate(() => {
    const reiter = document.querySelector('[data-target="view-knowledge"]');
    if (reiter) reiter.click();
  });
  await pg.waitForTimeout(900);
  await pg.evaluate(() => {
    const pille = document.querySelector('[data-sub="sub-kompass"]');
    if (pille) pille.click();
  });
  await pg.waitForTimeout(2500);

  const erg = await pg.evaluate(() => {
    const area = document.getElementById("kompassArea");
    const schalter = area.querySelector('.inline-feature-flag-toggle[data-flag-key]');
    const beitrag = area.querySelector('#kompass-geschichte-heute') || area.querySelector('.question-card');
    const ueberschrift = area.querySelector('#kompass-geschichte');
    const box = (el) => el ? el.getBoundingClientRect() : null;
    return {
      schalterDa: Boolean(schalter),
      schalterKey: schalter ? schalter.dataset.flagKey : null,
      hakenGesetzt: schalter ? schalter.checked : null,
      beitragDa: Boolean(beitrag),
      ySchalter: schalter ? Math.round(box(schalter).top) : null,
      yBeitrag: beitrag ? Math.round(box(beitrag).top) : null,
      yUeberschrift: ueberschrift ? Math.round(box(ueberschrift).top) : null,
      htmlAusschnitt: area.innerHTML.length
    };
  });

  const regeln = [
    ["Schalter ist für Betreiber da", erg.schalterDa === true],
    ["Schalter gehört zum Kalender-Paket", erg.schalterKey === "history_paket_01"],
    ["Häkchen ist gesetzt (nie gesperrt = freigegeben)", erg.hakenGesetzt === true],
    ["Beitrag des Tages ist da", erg.beitragDa === true],
    ["Schalter steht ÜBER dem Beitrag", erg.ySchalter !== null && erg.yBeitrag !== null && erg.ySchalter < erg.yBeitrag],
    ["Schalter steht UNTER der Überschrift", erg.ySchalter !== null && erg.yUeberschrift !== null && erg.ySchalter > erg.yUeberschrift]
  ];
  console.log(JSON.stringify(erg, null, 1));
  let rot = 0;
  regeln.forEach(([t, ok]) => { if (!ok) rot++; console.log((ok ? "GRUEN " : "ROT   ") + t); });
  await br.close(); srv.close();
  process.exit(rot ? 1 : 0);
})();
