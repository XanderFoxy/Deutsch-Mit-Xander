#!/usr/bin/env node
/* =========================================================
   PRUEFT DIE DREI GEMELDETEN FEHLER — GEMESSEN, NICHT GEGLAUBT
   ---------------------------------------------------------
   GEMELDET, woertlich:

   1. „Das Video bleibt nicht an Ort und Stelle, sondern es
      springt nach oben über die Besucher im Chat und geht dort
      weiter … das darf nicht auf der Achse von unten nach oben
      springen."
      → Gemessen wird die Lage der Filmschicht ueber die ganze
        Laufzeit. Sie darf sich um KEINEN Punkt bewegen.

   2. „Die Videos unterbrechen ständig mindestens zwei oder
      dreimal, die sind nicht vollständig."
      → Gezaehlt werden die „waiting"-Ereignisse (jedes ist ein
        Aussetzer) und am Ende geprueft, ob die Spielzeit die
        volle Laenge erreicht hat.

   3. „Man hört nicht den Sound von den Videos."
      → Geprueft wird, dass die Datei eine Tonspur hat und der
        Spieler sie nicht stumm schaltet.

   Dazu: der Staub darf nur dort liegen, wo er hingehoert.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webm": "video/webm", ".mp4": "video/mp4",
  ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Welcher Film soll welche Wirkung haben? Staub NUR beim T-Rex. */
/* Die schwarze Lok („lok") ist seit Fassung 349 heraus — gewuenscht:
   „Nimm mal die schwarze Lokomotive raus, dann sparen wir Speicher."
   Geblieben ist die bunte, traditionelle: im Ordner „lok2", im Chat
   der Befehl /lok. */
const SOLL = { trex: "erde", loewe: "glanz", adler: "wind", lok2: "dampf" };

(async () => {
  console.log("\nWAS STEHT IN DEN FILMEN?\n");
  Object.keys(SOLL).forEach((n) => {
    let d = null;
    try { d = JSON.parse(fs.readFileSync(path.join(WURZEL, "filme", n + ".json"), "utf8")); } catch (e) {}
    pruefe("„" + n + "“ traegt die Wirkung „" + SOLL[n] + "“", Boolean(d) && d.wirkung === SOLL[n],
      d ? "steht: " + d.wirkung : "keine Beschreibung");
  });

  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne());

  /* Der kuerzeste Film, damit die Sonde nicht ewig braucht. */
  const NAME = "lok2";
  console.log("\nBLEIBT DER FILM AN SEINEM PLATZ?  (" + NAME + ")\n");

  await pg.evaluate((n) => {
    window.__fp = { stellen: [], chat: [], wartet: 0, zeit: 0, dauer: 0, stumm: null, schicht: 0 };
    return window.LiveChat.pruefBefehl("/film " + n);
  }, NAME);

  const kam = await pg.waitForFunction(() => {
    const s = document.querySelector(".dma-film");
    const v = s && s.querySelector("video");
    return Boolean(v && v.readyState >= 2);
  }, { timeout: 40000 }).then(() => true).catch(() => false);
  pruefe("der Film kommt und ist geladen", kam);
  if (!kam) { await br.close(); srv.close(); process.exit(1); }

  /* Aussetzer zaehlen und die Lage aufschreiben — im Browser,
     damit jede Bewegung erwischt wird und nicht nur die in den
     Momenten, in denen die Sonde zufaellig hinsieht. */
  await pg.evaluate(() => {
    const s = document.querySelector(".dma-film");
    const v = s.querySelector("video");
    window.__fp.stumm = v.muted;
    window.__fp.dauer = v.duration || 0;
    /* JETZT nachsehen, nicht spaeter: nach acht Sekunden ist der Film
       vorbei und die Schicht abgeraeumt. Der erste Entwurf hat genau
       das gemacht und sechs Fehler gemeldet, wo keiner war. */
    window.__fp.blende = {
      controls: v.hasAttribute("controls"),
      pip: v.disablePictureInPicture === true || v.hasAttribute("disablepictureinpicture"),
      liste: v.getAttribute("controlslist") || "",
      airplay: v.getAttribute("x-webkit-airplay") || "",
      zeiger: getComputedStyle(s).pointerEvents,
      stil: Boolean(document.getElementById("dmaFilmOhneLeiste"))
    };
    v.addEventListener("waiting", () => { window.__fp.wartet++; });
    (function sieh() {
      const l = document.querySelector(".dma-film");
      if (!l) return;
      const r = l.getBoundingClientRect();
      /* Zuerst die Leinwand: das Video haengt seit Fassung 334
         unsichtbar in der Ecke und wird nie gezeigt. */
      const b = l.querySelector("canvas.dma-film-bild") || l.querySelector("video");
      const rb = b ? b.getBoundingClientRect() : r;
      window.__fp.stellen.push([Math.round(r.top), Math.round(r.left),
                                Math.round(rb.top), Math.round(rb.left)]);
      /* Und rattert der Chatverlauf wirklich? Bei „dampf" soll er
         die ganze Zeit leicht zittern — aber eben NUR er. */
      const ch = document.getElementById("lcVerlauf");
      if (ch) window.__fp.chat.push(ch.style.transform || "");
      window.__fp.zeit = (l.querySelector("video") || {}).currentTime || window.__fp.zeit;
      window.__fp.schicht = window.__fp.stellen.length;
      requestAnimationFrame(sieh);
    })();
  });

  await pg.waitForTimeout(8500);
  const m = await pg.evaluate(() => window.__fp);
  const oben = m.stellen.map((s) => s[0]);
  const links = m.stellen.map((s) => s[1]);
  const bOben = m.stellen.map((s) => s[2]);
  const bLinks = m.stellen.map((s) => s[3]);
  const spanne = (a) => (a.length ? Math.max.apply(null, a) - Math.min.apply(null, a) : 0);

  pruefe("die Schicht bewegt sich keinen Punkt (oben/links)",
    spanne(oben) === 0 && spanne(links) === 0,
    m.stellen.length + " Messungen, Spanne " + spanne(oben) + "/" + spanne(links) + " Punkte");
  pruefe("das Bild selbst bewegt sich keinen Punkt",
    spanne(bOben) === 0 && spanne(bLinks) === 0,
    "Spanne " + spanne(bOben) + "/" + spanne(bLinks) + " Punkte");

  const koerper = await pg.evaluate(() => document.body.style.transform || "");
  pruefe("am Dokument haengt keine Verschiebung", koerper === "",
    koerper ? "body.transform = " + koerper : "leer");

  const versch = m.chat.filter((t) => /translate3d/.test(t));
  const eigen = new Set(versch).size;
  pruefe("der Chatverlauf rattert dabei mit (und nur er)", eigen > 5,
    versch.length + " von " + m.chat.length + " Messungen verschoben, " + eigen + " verschiedene Lagen");

  /* GEMELDET: „Da ist unten so ein Symbol zum Grossermachen auf
     Vollbild … ich moechte nicht, dass es aussieht, dass es ein Video
     ist." Also nachsehen, dass kein einziger dieser Wege offen ist. */
  console.log("\nSIEHT ES NACH VIDEO AUS?\n");
  const bl = m.blende;
  pruefe("das Video hat keine Bedienleiste", bl && !bl.controls);
  pruefe("Bild-im-Bild ist abgeschaltet", bl && bl.pip);
  pruefe("Vollbild und Herunterladen sind gesperrt",
    bl && /nofullscreen/.test(bl.liste) && /nodownload/.test(bl.liste), bl ? bl.liste : "");
  pruefe("AirPlay ist abgelehnt", bl && bl.airplay === "deny");
  pruefe("kein Fingertipp erreicht das Video", bl && bl.zeiger === "none", bl ? bl.zeiger : "");
  pruefe("die WebKit-Leiste ist per Stilblatt weg", bl && bl.stil);

  const yt = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const zeile = (yt.match(/<iframe[^>]*youtube\.com\/embed[^>]*>/) || [""])[0];
  pruefe("der YouTube-Rahmen hat keinen Vollbildknopf",
    /fs=0/.test(zeile) && !/allowfullscreen/.test(zeile),
    zeile ? zeile.slice(0, 90) + "…" : "kein Rahmen gefunden");

  console.log("\nLAEUFT ER DURCH, UND MIT TON?\n");
  pruefe("kein einziger Aussetzer", m.wartet === 0, m.wartet + " Aussetzer");
  pruefe("er spielt bis zum Ende", m.zeit >= (m.dauer || 7) - 0.6,
    "gespielt " + (m.zeit || 0).toFixed(2) + " von " + (m.dauer || 0).toFixed(2) + " s");
  pruefe("der Spieler schaltet den Film nicht stumm", m.stumm === false,
    m.stumm === false ? "" : "muted = " + m.stumm);

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Der Film steht still, laeuft durch und hat Ton.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
