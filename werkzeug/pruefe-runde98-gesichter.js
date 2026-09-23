#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DIE GESICHTER VOM AVATAR
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Und ich moechte mit meinem Avatar, den wir
   fuer die Webseiten-Vorstellung haben — nur das Gesicht davon haben
   wir in Animation, sagt oh my god und wow, also diese zwei einzelnen.
   Und dann so Alter, verbissen, schockiert, und eins, wo er sagt
   Leute, bisschen genervt … und eins, wo er Hallo sagt, und eins, wo
   er okay sagt."

   GEMESSEN WIRD, WAS DA IST:
     · die Bilddateien liegen wirklich im Ordner und laden auch,
     · das Gesicht erscheint ueber dem Platz und geht wieder,
     · es deckt das Profilbild nicht zu,
     · was er sagt, steht dabei,
     · und der Befehl versteht beide Schreibweisen.

   WAS FEHLT, SAGT DIESE SONDE AUCH: von den sieben gewuenschten
   Gesichtern sind SECHS gezeichnet (ohmygod, wow, verbissen,
   schockiert, Leute, Hallo). Das siebte (okay) fehlt noch — der
   Zugang zum Bildwerkzeug laesst im kostenlosen Plan nur drei Bilder
   je Zeitfenster zu, und das war zweimal aufgebraucht.
   Die Sonde zaehlt es mit, damit das nicht in Vergessenheit geraet.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

const GEWUENSCHT = ["ohmygod", "wow", "verbissen", "schockiert", "leute", "hallo", "okay"];
const DA = ["ohmygod", "wow", "verbissen", "schockiert", "leute", "hallo"];

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  console.log("\nDIE BILDER LIEGEN DA\n");
  DA.forEach((n) => {
    const f = path.join(WURZEL, "tutor", "gesicht-" + n + ".png");
    const gibt = fs.existsSync(f);
    sage(gibt, "tutor/gesicht-" + n + ".png",
      gibt ? Math.round(fs.statSync(f).size / 1024) + " kB" : "fehlt");
  });
  const fehlen = GEWUENSCHT.filter((n) => DA.indexOf(n) < 0);
  console.log("\n  Von " + GEWUENSCHT.length + " gewuenschten Gesichtern sind "
    + DA.length + " gezeichnet. Es fehlen noch: " + fehlen.join(", ") + "\n");

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

  console.log("UND SIE KOMMEN UEBER DEN PLATZ\n");
  for (const welches of DA) {
    const m = await pg.evaluate(async (w) => {
      window.DMA_PRUEF.effektBuehne();
      await new Promise((f) => setTimeout(f, 200));
      const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
        ((p.querySelector(".lc-platz-name") || {}).textContent || "")
          .toLowerCase().indexOf("bea") >= 0)[0];
      if (!platz) return null;
      const kreis = platz.querySelector(".lc-kreis");
      const rk = kreis.getBoundingClientRect();
      window.DMA_PRUEFUNG.wirkung("gesicht", "Bea", "Alex", { stueck: w });
      await new Promise((f) => setTimeout(f, 900));
      const bild = platz.querySelector(".lc-gesicht-bild");
      const wort = platz.querySelector(".lc-gesicht-wort");
      if (!bild) return { da: false };
      /* Laedt es auch wirklich? naturalWidth ist 0, wenn nicht. */
      await new Promise((f) => { if (bild.complete) f(); else bild.onload = f; });
      const rb = bild.getBoundingClientRect();
      return {
        da: true,
        quelle: (bild.getAttribute("src") || ""),
        geladen: bild.naturalWidth > 0,
        breit: Math.round(rb.width),
        /* Deckt es das Profilbild zu? Gemessen wird, wie viel vom
           Bild unter dem Kopf liegt. */
        ueberdeckung: Math.round(Math.max(0,
          Math.min(rb.bottom, rk.bottom) - Math.max(rb.top, rk.top))),
        kreisHoch: Math.round(rk.height),
        wort: wort ? wort.textContent : "",
        /* RUNDE 99: wo liegt die Gesichtsmitte (im Bild 50 % / 58 %)
           gegenueber der Bildmitte, und beruehrt die Blase das Gesicht
           (Kasten 20–80 % breit, 30–85 % hoch)? */
        mitteDx: Math.round(rb.left + rb.width * 0.5 - (rk.left + rk.width / 2)),
        mitteDy: Math.round(rb.top + rb.height * 0.58 - (rk.top + rk.height / 2)),
        blaseAufGesicht: (() => {
          if (!wort) return 0;
          const w = wort.getBoundingClientRect();
          const g = { l: rb.left + rb.width * 0.2, r: rb.left + rb.width * 0.8,
                      o: rb.top + rb.height * 0.3, u: rb.top + rb.height * 0.85 };
          const x = Math.max(0, Math.min(w.right, g.r) - Math.max(w.left, g.l));
          const y = Math.max(0, Math.min(w.bottom, g.u) - Math.max(w.top, g.o));
          return Math.round(x * y);
        })()
      };
    }, welches);
    sage(m && m.da && m.geladen, welches + ": das Gesicht ist da und geladen",
      m ? (m.quelle || "-") + (m.geladen ? "" : " (laedt NICHT)") : "-");
    sage(m && m.wort && m.wort.length > 1, welches + ": und es steht dabei, was er sagt",
      m ? "„" + m.wort + "“" : "-");
    /* RUNDE 99 — XANDER: „das Gesicht soll mittig auf dem Platzpunkt
       null sitzen" und „die Woerter verdecken mein Gesicht". Die alte
       Regel (Profilbild bleibt sichtbar) galt fuer den Kopf, der
       UEBER dem Bild auftauchte — das hat er ausdruecklich anders
       bestellt. */
    sage(m && Math.abs(m.mitteDx) <= 3 && Math.abs(m.mitteDy) <= 3,
      welches + ": das Gesicht sitzt mittig auf dem Platz",
      m ? m.mitteDx + " / " + m.mitteDy + " px neben der Mitte" : "-");
    sage(m && m.blaseAufGesicht === 0,
      welches + ": und die Schrift liegt NICHT auf dem Gesicht",
      m ? m.blaseAufGesicht + " px² Ueberschneidung" : "-");
  }

  console.log("\nUND ES GEHT AUCH WIEDER WEG\n");
  const weg = await pg.evaluate(async () => {
    await new Promise((f) => setTimeout(f, 2600));
    return document.querySelectorAll(".lc-gesicht").length;
  });
  sage(weg === 0, "nach der Animation ist nichts mehr da", weg + " Schichten");

  console.log("\nUND DIE KACHEL IM PLATZMENUE\n");
  const menue = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    const bea = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    window.DMA_PRUEF.platzMenue(bea);
    await new Promise((f) => setTimeout(f, 200));
    const kasten = document.getElementById("lcPlatzMenue");
    const worte = [...kasten.querySelectorAll(".lc-platzmenue-wort")]
      .map((w) => w.textContent.trim());
    const r = kasten.getBoundingClientRect();
    const k = worte.indexOf("Gesicht");
    let unter = [];
    if (k >= 0) {
      [...kasten.querySelectorAll(".lc-platzmenue-wort")][k].closest("button").click();
      await new Promise((f) => setTimeout(f, 200));
      unter = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
        .map((w) => w.textContent.trim());
    }
    return { hat: k >= 0, unter: unter,
      unten: Math.round(r.bottom - window.innerHeight), kacheln: worte.length };
  });
  sage(menue.hat, "die Kachel „Gesicht“ steht im Platzmenue",
    menue.kacheln + " Kacheln, " + menue.unten + " px unter dem Rand");
  sage(menue.unten <= 0, "und das Menue passt weiterhin auf den Bildschirm",
    menue.unten + " px");
  sage(menue.unter.length >= DA.length,
    "darunter stehen alle gezeichneten Gesichter",
    menue.unter.join(" · "));

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
