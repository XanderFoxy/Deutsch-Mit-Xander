#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 97 — EIN BILD SEINER WAHL AUFSPRUEHEN
   ---------------------------------------------------------------------
   XANDER (Runde 86): „und dass man ein Bild seiner Wahl darauf spruehen
   kann und dass das Bild genauso partiell eingespruecht wird … wie
   Partikel langsam auftaucht und sich realistisch fuellt, das Bild
   Pixel fuer Pixel, als wenn man das wirklich dran spruehen wuerde."
   XANDER (23.09.2026): „Die [gespruehten] Sachen haben immer noch kein
   Bild, was man sich einspruehen kann."

   NACHGESEHEN, und er hatte recht: die Spruehdose kannte 23 feste
   Motive und zwei Gesichter. Ein eigenes Bild ging nirgends — weder
   im Befehl noch im Menue.

   GEMESSEN WIRD JETZT:
     1. Der Befehl nimmt eine Bildadresse an (und NUR eine Bildadresse:
        was nicht nach einem Bild aussieht, geht nicht durch).
     2. Das Bild wird wirklich Tropfen fuer Tropfen aufgebaut — die
        Deckung der Lackflaeche steigt waehrend des Spruehens.
     3. Danach bleibt es liegen, wie jeder Lack seit Runde 92.
     4. Und im Platzmenue steht der Weg dorthin.
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

/* Ein kleines, eigenes Bild als Datenadresse — so haengt die Messung
   an keinem fremden Server und an keinem CORS-Kopf. */
const BILD = "data:image/svg+xml;base64," + Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">'
  + '<rect width="80" height="80" fill="#1f7ae0"/>'
  + '<circle cx="40" cy="40" r="26" fill="#ffd400"/></svg>').toString("base64");

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

  console.log("\nDAS EIGENE BILD WIRD AUFGESPRUEHT\n");
  const mess = await pg.evaluate(async (bild) => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Bea", "Alex", { stueck: bild });
    /* Waehrend des Spruehens: wie viel Farbe liegt schon auf der
       Flaeche? Gezaehlt werden die Bildpunkte, die nicht durchsichtig
       sind — das ist das Aufbauen, das er beschrieben hat. */
    const deckung = [];
    for (let i = 0; i < 9; i++) {
      await new Promise((f) => setTimeout(f, 260));
      const c = document.querySelector(".lc-spray-lack");
      if (!c) { deckung.push(null); continue; }
      try {
        const g = c.getContext("2d");
        const d = g.getImageData(0, 0, c.width, c.height).data;
        let voll = 0;
        for (let k = 3; k < d.length; k += 4 * 40) if (d[k] > 24) voll++;
        deckung.push(Math.round(voll * 4 * 40 / d.length * 1000) / 10);
      } catch (e) { deckung.push(-1); }
    }
    /* Und danach: bleibt es liegen? */
    await new Promise((f) => setTimeout(f, 4200));
    const platz = [...document.querySelectorAll(".lc-platz")]
      .filter((p) => (p.dataset.lcName || "").toLowerCase() === "bea"
        || ((p.querySelector(".lc-platz-name") || {}).textContent || "").toLowerCase().indexOf("bea") >= 0)[0];
    const lack = platz ? platz.querySelector(".lc-sprayfarbe .lc-sprayfarbe-bild") : null;
    return { deckung: deckung, bleibt: Boolean(lack),
             quelle: lack ? String(lack.getAttribute("src") || "").slice(0, 22) : "" };
  }, BILD);

  const zahlen = mess.deckung.filter((x) => x !== null && x >= 0);
  console.log("  Deckung waehrend des Spruehens: "
    + mess.deckung.map((x) => (x === null ? "-" : x + " %")).join("  ") + "\n");
  sage(zahlen.length >= 3, "die Lackflaeche entsteht ueberhaupt",
    zahlen.length + " Messpunkte");
  sage(zahlen.length >= 2 && zahlen[zahlen.length - 1] > zahlen[0],
    "und sie fuellt sich Tropfen fuer Tropfen, statt auf einmal dazustehen",
    zahlen.length ? zahlen[0] + " % → " + zahlen[zahlen.length - 1] + " %" : "-");
  sage(mess.bleibt, "danach bleibt das Bild liegen (wie jeder Lack seit Runde 92)",
    mess.quelle || "nichts gefunden");

  console.log("\nDER WEG DAHIN\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/\*spraybild/.test(js) && /function lcSprayBildWaehler/.test(js),
    "im Platzmenue steht „Eigenes Bild …“ unter der Sprühdose");
  /* Und der Waehler geht wirklich auf, mit Bildern darin. */
  const waehler = await pg.evaluate(async () => {
    try {
      const bunt = (f) => "data:image/svg+xml;base64," + btoa(
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">'
        + '<rect width="20" height="20" fill="' + f + '"/></svg>');
      localStorage.setItem("dma_livechat_letzte_bilder",
        JSON.stringify([bunt("#1f7ae0"), bunt("#2fa84f"), bunt("#c0392b")]));
    } catch (e) {}
    window.DMA_PRUEF.sprayWaehler("Bea");
    await new Promise((f) => setTimeout(f, 300));
    const k = document.querySelector(".lc-spraywahl");
    if (!k) return { da: false };
    return { da: true,
      bilder: k.querySelectorAll(".lc-waehler-gif").length,
      feld: Boolean(k.querySelector("input.lc-chat-feld")),
      kopf: (k.querySelector(".lc-platzmenue-kopf") || {}).textContent || "" };
  });
  sage(waehler.da === true, "und er geht auch wirklich auf", waehler.kopf || "-");
  sage(waehler.bilder >= 3, "die zuletzt benutzten Bilder stehen darin",
    waehler.bilder + " Bildchen");
  sage(waehler.feld === true, "und eine Adresse kann man auch einsetzen");
  sage(/istBild = \/\^\(https\?:\\\/\\\/\|data:image\\\/\)\/i\.test\(roh\)/.test(lc),
    "der Befehl nimmt eine Bildadresse an");
  /* Und er nimmt NUR eine Bildadresse: alles andere faellt auf das
     Motiv zurueck, statt weitergereicht zu werden. */
  const gefahr = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Cem", "Alex", { stueck: "javascript:alert(1)" });
    await new Promise((f) => setTimeout(f, 900));
    const c = document.querySelector(".lc-spray-lack");
    return { da: Boolean(c),
             html: document.body.innerHTML.indexOf("javascript:alert(1)") >= 0 };
  });
  sage(gefahr.html === false,
    "und was keine Bildadresse ist, landet nirgends in der Seite",
    gefahr.da ? "es wird ein Motiv gesprüht" : "nichts");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
