#!/usr/bin/env node
/* =========================================================
   GIPHY: FAVORITEN UND EIGENE SUCHEN
   ---------------------------------------------------------
   GEWUENSCHT: „Die Favoriten, die man bei GIPHY macht,
   sollen sich immer im Profil mitspeichern, sodass man das
   auf einem anderen Geraet auch wiederfindet … Dann sollen
   auch die Suchen, die man gemacht hat, als Auswahl mit
   dabeistehen … Und die Favoriten, die ich oft auswaehle,
   das soll automatisch in den Favoriten sein."

   Gemessen wird ohne GIPHY — es geht hier nicht um Bilder,
   sondern um das Merken:
   1. Ein Stern heftet an und wieder ab.
   2. Zweimal dasselbe Bild genommen heftet von selbst an.
   3. Eine abgeschickte Suche steht danach als Knopf da.
   4. Alles drei liegt in der Profil-Ablage (kzEinstellung) —
      also dort, wo es das Geraet wechseln kann.
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
  const pg = await br.newPage({ viewport: { width: 420, height: 800 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.gif, { timeout: 20000 });

  console.log("\nANHEFTEN UND WIEDER ABHEFTEN\n");
  const a = await pg.evaluate(() => {
    const g = window.DMA_PRUEF.gif;
    g.leeren();
    const u = "https://example.test/eins.gif";
    const an = g.umschalten(u);
    const drin = g.favoriten();
    const ab = g.umschalten(u);
    return { an: an, drin: drin, ab: ab, danach: g.favoriten() };
  });
  pruefe("der Stern heftet an", a.an === true && a.drin.length === 1, a.drin.join(", "));
  pruefe("und wieder ab", a.ab === false && a.danach.length === 0, a.danach.join(", "));

  console.log("\nZWEIMAL GENOMMEN HEISST FAVORIT\n");
  const b = await pg.evaluate(() => {
    const g = window.DMA_PRUEF.gif;
    g.leeren();
    const u = "https://example.test/zwei.gif";
    g.genommen(u);
    const nachEins = g.favoriten().length;
    g.genommen(u);
    const nachZwei = g.favoriten();
    return { nachEins: nachEins, nachZwei: nachZwei };
  });
  pruefe("einmal genommen ist noch kein Favorit", b.nachEins === 0, b.nachEins + " Favoriten");
  pruefe("zweimal genommen heftet von selbst an",
    b.nachZwei.length === 1 && /zwei\.gif/.test(b.nachZwei[0]), b.nachZwei.join(", "));

  console.log("\nEIGENE SUCHEN STEHEN ZUR AUSWAHL\n");
  const c = await pg.evaluate(() => {
    const g = window.DMA_PRUEF.gif;
    g.leeren();
    g.sucheMerken("dinosaurier");
    g.sucheMerken("kaffee");
    g.sucheMerken("lachen");        // steht schon als festes Thema da
    g.sucheMerken("a");             // zu kurz
    return g.suchen();
  });
  pruefe("eine eigene Suche wird gemerkt", c.indexOf("dinosaurier") >= 0, c.join(", "));
  pruefe("die neueste steht vorn", c[0] === "kaffee", c.join(", "));
  pruefe("ein festes Thema wird nicht doppelt gemerkt", c.indexOf("lachen") < 0, c.join(", "));
  pruefe("ein einzelner Buchstabe ist keine Suche", c.indexOf("a") < 0, c.join(", "));

  console.log("\nUND IM WAEHLER?\n");
  const d = await pg.evaluate(() => {
    const g = window.DMA_PRUEF.gif;
    g.leeren();
    g.umschalten("https://example.test/drei.gif");
    g.sucheMerken("dinosaurier");
    document.getElementById("lcSendeWaehler")?.remove();
    window.DMA_PRUEF.sendeWaehler();
    const knoepfe = [...document.querySelectorAll("[data-lc-gifthema]")]
      .map((x) => x.dataset.lcGifthema);
    const meins = document.querySelectorAll(".lc-gif-meins").length;
    const fav = document.querySelectorAll(".lc-gif-fav").length;
    return { knoepfe: knoepfe, meins: meins, fav: fav };
  });
  pruefe("der Favoriten-Knopf steht da", d.fav === 1, d.fav + " Stueck");
  pruefe("die eigene Suche steht als Knopf da", d.meins >= 1 && d.knoepfe.indexOf("dinosaurier") >= 0,
    d.knoepfe.join(" | "));

  console.log("\nLIEGT ES IN DER PROFIL-ABLAGE?\n");
  const e = await pg.evaluate(() => ({
    fav: (window.DMA_EINST.holen("gifFavoriten", []) || []).length,
    suchen: (window.DMA_EINST.holen("gifSuchen", []) || []).length
  }));
  pruefe("die Favoriten liegen in der Profil-Ablage", e.fav >= 1, e.fav + " Eintraege");
  pruefe("die Suchen auch", e.suchen >= 1, e.suchen + " Eintraege");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Favoriten und Suchen reisen mit dem Profil.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
