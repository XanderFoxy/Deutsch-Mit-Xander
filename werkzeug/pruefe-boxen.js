/* PRÜFT DAS BOXEN — HIN UND ZURÜCK.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Mach jetzt bitte mal die Box-Animation und die
   Rückanimation fertig, dass sie auch kommt, wenn man schreibt, dass
   ich jemand anderen boxe."

   Zwei Dinge fehlten:
     1. Der Rückschlag. Der Handschuh flog nur hin — es sah aus, als
        hätte die andere Seite gar nichts gemerkt.
     2. Die Namenssuche war zu streng: Sie verlangte den Platznamen auf
        den Buchstaben genau. Wer „/box Emmi" schrieb, während sie auf
        ihrem Platz „Emmy" heisst, traf NIEMANDEN — und weil die
        Funktion dann auf „alle Besetzten" zurückfällt, bekamen
        plötzlich alle einen Schlag ab. Das sieht kaputt aus, und es
        war auch kaputt. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 780 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    const buehne = () => {
      document.getElementById("lcPruefBuehne")?.remove();
      const b = document.createElement("div");
      b.id = "lcPruefBuehne";
      b.innerHTML = '<div class="question-card livechat" id="livechatKarte">'
        + '<div class="lc-plaetze" id="lcPlaetze">'
        + '<button class="lc-platz" data-lc-platz="1"><span class="lc-kreis"></span><span class="lc-platz-name">Alex</span></button>'
        + '<button class="lc-platz" data-lc-platz="2"><span class="lc-kreis"></span><span class="lc-platz-name">Emmy</span></button>'
        + '<button class="lc-platz lc-platz-frei" data-lc-platz="3"><span class="lc-kreis"></span><span class="lc-platz-name">frei</span></button>'
        + "</div></div>";
      document.body.appendChild(b);
    };
    const zaehlen = () => ({
      hin: document.querySelectorAll(".lc-box:not(.lc-box-zurueck)").length,
      geboxt: [...document.querySelectorAll(".lc-wird-geboxt")].map((p) => p.textContent.trim()),
      konter: document.querySelectorAll(".lc-box-konter").length,
      wackelt: [...document.querySelectorAll(".lc-boxt-zurueck")].map((p) => p.textContent.trim())
    });
    const raus = {};

    /* 1. Genau getroffen — und der Rückschlag kommt. */
    buehne();
    raus.gab = window.DMA_PRUEF.boxen("Emmy", "Alex");
    await warte(300);
    raus.sofort = zaehlen();
    await warte(1200);
    raus.spaeter = zaehlen();

    /* 2. Der Name ist nur fast richtig: „/box Emmi", sie heisst „Emmy". */
    buehne();
    window.DMA_PRUEF.boxen("Emmi", "Alex");
    await warte(300);
    raus.fastName = zaehlen();

    /* 3. Sich selbst boxen — dann gibt es keinen Rückschlag. */
    buehne();
    window.DMA_PRUEF.boxen("Alex", "Alex");
    await warte(1600);
    raus.selbst = zaehlen();
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  console.log("\n  DER SCHLAG HIN");
  ok(erg.gab === true, "die Animation läuft an");
  ok(erg.sofort.hin === 1, "ein Handschuh fliegt", erg.sofort.hin + "×");
  ok(erg.sofort.geboxt.length === 1 && erg.sofort.geboxt[0].indexOf("Emmy") === 0,
     "und zwar auf Emmys Platz — nicht auf alle", erg.sofort.geboxt.join(", ") || "niemand");

  console.log("\n  UND DER RÜCKSCHLAG");
  ok(erg.spaeter.konter === 1, "sie boxt zurück", erg.spaeter.konter + "×");
  ok(erg.spaeter.wackelt.length === 1 && erg.spaeter.wackelt[0].indexOf("Alex") === 0,
     "und Alex wackelt — der, der angefangen hat", erg.spaeter.wackelt.join(", ") || "niemand");

  console.log("\n  EIN NAME, DER NUR FAST STIMMT");
  ok(erg.fastName.geboxt.length === 1 && erg.fastName.geboxt[0].indexOf("Emmy") === 0,
     "„/box Emmi“ trifft Emmy — und nicht plötzlich alle",
     erg.fastName.geboxt.join(", ") || "niemand");

  console.log("\n  SICH SELBST BOXEN");
  ok(erg.selbst.konter === 0, "gibt keinen Rückschlag — man schlägt nicht sich selbst zurück",
     erg.selbst.konter + "×");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Hin und zurück, und der Richtige wird getroffen.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
