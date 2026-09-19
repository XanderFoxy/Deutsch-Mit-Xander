#!/usr/bin/env node
/* =========================================================
   GEHT DAS BILDERFACH NACH DER WAHL WIEDER ZU?
   ---------------------------------------------------------
   GEMELDET: „Wenn man sich ein Bild aussucht und dann in
   dieses Panel klickt, um sich das Bild auszusuchen, dann
   soll sich das eigentlich wieder schliessen — aber es
   schliesst sich nicht. Und die Auswahl fuer die GIPHY-
   Bilder: da sind meine Favoriten nicht."

   Zwei Ursachen, beide hier nachgemessen:

   1. Das Fach ging nur zu, wenn das Schicken GELANG. Ohne
      Raum oder Leitung blieb es offen — und darueber stand
      „Das war keine Adresse", obwohl die Adresse stimmte.
   2. Der Knopf „★ Favoriten" stand nur da, WENN beim
      Aufbauen schon Favoriten bekannt waren. Die kommen aber
      aus dem Profil und damit aus dem Netz: wer das Fach
      gleich nach dem Laden oeffnet, hatte noch keine — und
      der Knopf fehlte ganz.

   Aufruf:  node werkzeug/pruefe-bildwaehler-zu.js
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".gif": "image/gif" };

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
  const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 150)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.sendeWaehler, { timeout: 20000 });

  console.log("\nDAS FACH OHNE EINEN EINZIGEN FAVORITEN\n");
  const leer = await pg.evaluate(() => {
    window.DMA_PRUEF.gif.leeren();
    window.DMA_PRUEF.sendeWaehler();
    const k = document.getElementById("lcSendeWaehler");
    return { da: Boolean(k),
             favKnopf: Boolean(k && k.querySelector(".lc-gif-fav")),
             themen: k ? k.querySelectorAll(".lc-gif-thema").length : 0,
             kacheln: k ? k.querySelectorAll(".lc-waehler-gif, [data-lc-aufkleb]").length : 0 };
  });
  pruefe("das Fach geht auf", leer.da);
  pruefe("der Knopf „★ Favoriten“ steht da, auch wenn noch keiner angeheftet ist",
    leer.favKnopf, leer.themen + " Themenknoepfe");
  pruefe("und es gibt etwas zum Antippen", leer.kacheln > 0, leer.kacheln + " Bilder");

  console.log("\nMIT EINEM ANGEHEFTETEN FAVORITEN\n");
  const mit = await pg.evaluate(async () => {
    document.getElementById("lcSendeWaehler")?.remove();
    window.DMA_PRUEF.gif.umschalten("https://example.invalid/eins.gif");
    window.DMA_PRUEF.sendeWaehler();
    const k = document.getElementById("lcSendeWaehler");
    const knopf = k && k.querySelector(".lc-gif-fav");
    if (knopf) knopf.click();
    await new Promise((f) => setTimeout(f, 250));
    const fach = k && k.querySelector("#lcSendeGifTreffer");
    return { favKnopf: Boolean(knopf),
             kacheln: fach ? fach.querySelectorAll(".lc-waehler-gif").length : -1,
             text: fach ? String(fach.textContent || "").slice(0, 60) : "" };
  });
  pruefe("der Favoriten-Knopf ist da", mit.favKnopf);
  pruefe("und zeigt den angehefteten Favoriten", mit.kacheln >= 1,
    mit.kacheln + " Kachel(n) " + mit.text);

  console.log("\nEIN TIPP AUF EIN BILD SCHLIESST DAS FACH\n");
  const zu = await pg.evaluate(async () => {
    const k = document.getElementById("lcSendeWaehler");
    const kachel = k && k.querySelector("#lcSendeGifTreffer .lc-waehler-gif");
    if (!kachel) return { keineKachel: true };
    kachel.click();
    await new Promise((f) => setTimeout(f, 200));
    return { offen: Boolean(document.getElementById("lcSendeWaehler")) };
  });
  pruefe("das Fach ist danach zu — auch wenn das Schicken misslingt",
    !zu.keineKachel && zu.offen === false,
    zu.keineKachel ? "keine Kachel gefunden" : (zu.offen ? "steht noch offen" : "zu"));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)"
    : "Das Bilderfach zeigt die Favoriten und geht nach der Wahl zu.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
