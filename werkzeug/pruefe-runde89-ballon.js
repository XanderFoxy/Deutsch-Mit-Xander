#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 89 — DIE ZWEI LUFTBALLON-VARIANTEN, WIE ER SIE GENANNT HAT
   ---------------------------------------------------------------------
   XANDER am 21.09.2026 um 19:31 Uhr, woertlich:
   „Hast du eigentlich auch die Animation, dass man jemanden aufblasen
    kann bis er platzt? Da sollen auch zwei Animationen sein: ein, dass
    man ihn aufblasen kann, bis er platzt, und ein, dass man ihn
    einfach nur aufblasen kann wie ein Helium Luftballon und er fliegt
    dann von der Buehne hoch und oder fliegt halt zur Seite weg."
   Und spaeter, am 22.09.2026:
   „Welche zwei Varianten habe ich dir mit dem Luftballon genannt?
    Suche das wirklich."
   „Man soll das auch auf sich selbst anwenden koennen, deswegen soll
    es in den allgemeinen Profilbild-Effekten auch drin sein."
   „Ausserdem geht deine Luftballon Animation nicht einfach so, man
    muss immer einen Namen auswaehlen, die muss auch von so gehen."

   DIESE SONDE MISST GENAU DIESE ZWEI VARIANTEN AM LAUFENDEN PROGRAMM:
     1. „bis er platzt"      →  /aufblasen Name
     2. „wie ein Helium-Luftballon, fliegt hoch und zur Seite weg"
                             →  /ballonpumpe Name helium
   Und dazu die drei Dinge, die er danach noch verlangt hat: beide
   stehen im Profilbild-Menue, beide gehen auch ohne Namen auf mich
   selbst, und danach bleibt nichts am Platz liegen.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4",
  ".webm": "video/webm", ".woff2": "font/woff2" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");

  console.log("\nBEIDE VARIANTEN STEHEN IM MENUE\n");
  sage(/"Ballon", "ballonpumpe"/.test(js)
    && /"Aufpumpen", "ballonpumpe"/.test(js)
    && /"Helium \\u2014 fliegt weg", "ballonpumpe", "helium"/.test(js)
    && /"Bis es platzt", "aufblasen"/.test(js),
    "die Ballon-Kachel steht bei den Profilbild-Effekten und hat drei Wege");
  sage(/ballonpumpe: \{ wirkung: "luftballon"/.test(lc),
    "„/ballonpumpe“ ist ein eigener Befehl");
  sage(/aufblasen:\s*\{ wirkung: "aufblasen"/.test(lc),
    "„/aufblasen“ auch — das ist die Variante mit dem Platzen");

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
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({ t: Math.round(performance.now()),
        n: (this.currentSrc || this.src || "").split("/").pop().split("?")[0]
             .replace(/\.(opus|m4a|mp3)$/, "") });
      return ap.call(this);
    };
  });

  /* Wo steht das Bild gerade, und wie ist es gedreht? Der Winkel kommt
     aus der Matrix — atan2(b, a) ist der Drehwinkel in Grad. */
  const messen = () => pg.evaluate(() => {
    const platz = [...document.querySelectorAll(".lc-platz")]
      .find((p) => p.querySelector(".lc-ballon") || p.querySelector(".lc-pumpe"));
    if (!platz) return null;
    const kreis = platz.querySelector(".lc-kreis");
    if (!kreis) return null;
    const k = kreis.getBoundingClientRect(), p = platz.getBoundingClientRect();
    const m = new DOMMatrixReadOnly(getComputedStyle(kreis).transform);
    return {
      hoch: Math.round((p.top + p.height / 2) - (k.top + k.height / 2)),
      seit: Math.round((k.left + k.width / 2) - (p.left + p.width / 2)),
      dreh: Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI),
      gross: Math.round(Math.hypot(m.a, m.b) * 100) / 100
    };
  });

  const starten = (art, wen, mehr) => pg.evaluate(([art, wen, mehr]) => {
    window.__toene = []; window.__start = performance.now();
    window.DMA_PRUEFUNG.wirkung(art, wen, "Alex", mehr || {});
  }, [art, wen, mehr]);

  const toene = () => pg.evaluate(() =>
    (window.__toene || []).map((x) => x.n + "@" + Math.round(x.t - window.__start)));

  /* =================================================================
     VARIANTE 1 — „bis er platzt"
     ================================================================= */
  console.log("\nVARIANTE 1: AUFBLASEN, BIS ER PLATZT\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await starten("aufblasen", "Bea");
  await pg.waitForTimeout(2000);                    /* kurz vor dem Knall */
  const prall = await messen();
  sage(Boolean(prall && prall.gross >= 1.4),
    "das Bild wird prall aufgeblasen",
    prall ? prall.gross + "-fach" : "-");
  await pg.waitForTimeout(600);                     /* 2600 ms: es ist geplatzt */
  const knall = await pg.evaluate(() => {
    const platz = [...document.querySelectorAll(".lc-platz")]
      .find((p) => p.querySelector(".lc-pumpe"));
    if (!platz) return null;
    return { fetzen: platz.querySelectorAll(".lc-fetzen").length,
             knall: Boolean(platz.querySelector(".lc-knall")),
             glanz: Boolean(platz.querySelector(".lc-blaeh-glanz")) };
  });
  sage(Boolean(knall && knall.fetzen >= 10 && knall.knall),
    "und er platzt wirklich: Fetzen fliegen, der Knall blitzt",
    knall ? knall.fetzen + " Fetzen" : "-");
  const t1 = await toene();
  sage(t1.some((x) => /^platzen@/.test(x)),
    "und man hoert es knallen", t1.join(", ") || "still");
  await pg.waitForTimeout(1400);
  const rest1 = await pg.evaluate(() =>
    document.querySelectorAll(".lc-pumpe, .lc-fetzen").length);
  sage(rest1 === 0, "danach liegt nichts mehr am Platz", rest1 + " Reste");

  /* =================================================================
     VARIANTE 2 — „wie ein Helium-Luftballon … fliegt hoch und weg"
     ================================================================= */
  console.log("\nVARIANTE 2: HELIUM — ER STEIGT UND TREIBT ZUR SEITE\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await starten("luftballon", "Bea", { stueck: "helium" });
  await pg.waitForTimeout(1600);                    /* 38 %: drei Huebe sind durch */
  const gepumpt = await messen();
  sage(Boolean(gepumpt && gepumpt.gross >= 1.8),
    "erst wird er aufgepumpt", gepumpt ? gepumpt.gross + "-fach" : "-");
  await pg.waitForTimeout(1600);                    /* 76 %: er ist oben */
  const oben = await messen();
  sage(Boolean(oben && oben.hoch >= 150),
    "dann STEIGT er ueber die Sitzreihe hinauf",
    oben ? oben.hoch + " px ueber seinem Platz" : "-");
  sage(Boolean(oben && Math.abs(oben.seit) >= 40),
    "und treibt dabei zur Seite weg",
    oben ? oben.seit + " px zur Seite" : "-");
  sage(Boolean(oben && Math.abs(oben.dreh) <= 20),
    "er ueberschlaegt sich nicht — Helium zieht, es zischt nicht",
    oben ? oben.dreh + " Grad" : "-");
  const t2 = await toene();
  sage(t2.filter((x) => /^pumpe@/.test(x)).length === 3,
    "drei Pumpenhuebe sind zu hoeren", t2.join(", ") || "still");
  sage(!t2.some((x) => /^luftraus@/.test(x)),
    "aber keine entweichende Luft — ein Heliumballon verliert nichts");
  await pg.waitForTimeout(1400);
  const rest2 = await pg.evaluate(() => {
    const platz = [...document.querySelectorAll(".lc-platz")]
      .find((p) => p.querySelector(".lc-ballon"));
    const kreis = document.querySelectorAll(".lc-platz")[1].querySelector(".lc-kreis");
    const m = new DOMMatrixReadOnly(getComputedStyle(kreis).transform);
    return { schicht: Boolean(platz),
             zurueck: Math.round(Math.hypot(m.e, m.f)) };
  });
  sage(rest2.schicht === false && rest2.zurueck <= 4,
    "und danach sitzt er wieder auf seinem Platz",
    rest2.zurueck + " px daneben");

  /* =================================================================
     DIE DRITTE, DIE ER BEHALTEN WOLLTE: DER ZICKZACK
     „Lass gerne das was du bei dem Luftballon gemacht hast."
     ================================================================= */
  console.log("\nDER LOSGELASSENE BALLON (ohne Helium) BLEIBT, WIE ER WAR\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await starten("luftballon", "Bea");
  await pg.waitForTimeout(3200);
  const zick = await messen();
  sage(Boolean(zick && Math.abs(zick.dreh) >= 30),
    "er ueberschlaegt sich, wenn die Luft herausfaehrt",
    zick ? zick.dreh + " Grad" : "-");
  const t3 = await toene();
  sage(t3.some((x) => /^luftraus@/.test(x)),
    "und man hoert die Luft entweichen", t3.join(", ") || "still");

  /* =================================================================
     UND BEIDE GEHEN AUCH OHNE NAMEN — AUF MICH SELBST
     „Man soll das auch auf sich selbst anwenden koennen."
     ================================================================= */
  console.log("\nBEIDE GEHEN AUCH AUF MICH SELBST\n");
  const selbst = await pg.evaluate(async () => {
    /* Gemessen wird an der letzten Nachricht im Raum — so, wie sie
       wirklich hinausgeht. */
    /* Eine Buehne, wie sie im Betrieb steht — sonst gibt es keinen
       eigenen Namen, auf den ein Befehl ohne Namen fallen koennte. */
    try {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                                  buehne: true, zuruecksetzen: true });
    } catch (e) {}
    try { window.LiveChat.pruefPersonSetzen("bea-1", "Bea"); } catch (e) {}
    const letzte = () => {
      const n = (window.LiveChat.lage().nachrichten || []);
      return n.length ? n[n.length - 1] : {};
    };
    const einer = async (befehl) => {
      try { window.LiveChat.schreiben(befehl); } catch (e) {}
      await new Promise((f) => setTimeout(f, 60));
      const z = letzte();
      return { w: String(z.wirkung || ""), wen: String(z.wen || ""),
               stueck: String(z.stueck || "") };
    };
    const ich = (window.LiveChat.lage() || {}).ichName || "";
    return { ich: ich,
             b1: await einer("/ballonpumpe"),
             b2: await einer("/ballonpumpe helium"),
             b3: await einer("/aufblasen") };
  });
  sage(selbst.b1.w === "luftballon" && selbst.b1.wen === selbst.ich && !selbst.b1.stueck,
    "\u201e/ballonpumpe\u201c ohne Namen trifft mich",
    selbst.b1.wen + " / " + (selbst.b1.stueck || "ohne Helium"));
  sage(selbst.b2.w === "luftballon" && selbst.b2.wen === selbst.ich
    && selbst.b2.stueck === "helium",
    "\u201e/ballonpumpe helium\u201c ohne Namen auch \u2014 als zweite Variante",
    selbst.b2.wen + " / " + selbst.b2.stueck);
  sage(selbst.b3.w === "aufblasen" && selbst.b3.wen === selbst.ich,
    "und \u201e/aufblasen\u201c ohne Namen ebenso", selbst.b3.wen);

  sage(aufSeite.length === 0, "keine Fehler auf der Seite",
    aufSeite.slice(0, 3).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
