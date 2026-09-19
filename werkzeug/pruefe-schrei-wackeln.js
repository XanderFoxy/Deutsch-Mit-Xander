#!/usr/bin/env node
/* =========================================================
   LAUFEN BEIM SCHREIEN BEIDE EFFEKTE GLEICHZEITIG?
   ---------------------------------------------------------
   GEWUENSCHT: „Da hatten wir vorher so eine Art wackelnde
   Animation mit dem Wort, bevor wir diesen Schall gesendet
   haben. Schau bitte wirklich in den Verlauf … genau das
   moechte ich wie frueher haben, mit der Addition von dem
   Kreisel — also beide Effekte gleichzeitig."

   NACHGESEHEN, NICHT GERATEN: git zeigt, dass das Wackeln
   „lcRufAn" aus c587852 war (scale 0.55 → 1.20 → 0.98 →
   1.08 → 1.0 → 1.04 → 1, dazu letter-spacing) und dass
   b2dcee4 es durch reines Licht ERSETZT hat. Es heisst
   jetzt lcRufWackeln und laeuft wieder — neben dem Licht
   und neben dem Kreisel.

   Diese Sonde misst am laufenden Wort:
   1. Beide Animationen haengen am selben Wort.
   2. Die Groesse aendert sich waehrend des Ablaufs wirklich
      (ein Name allein waere kein Beweis).
   3. Der Schallkreis liegt dabei im Raum.
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
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEFUNG.chatStand, { timeout: 20000 });

  await pg.evaluate(() => {
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    window.DMA_PRUEFUNG.chatStand([{ id: "s1", von: "x", name: "Alex", art: "ruf",
      text: "ACHTUNG DER T-REX", zeit: Date.now() }]);
  });
  await pg.waitForTimeout(120);

  console.log("\nHAENGEN BEIDE ANIMATIONEN AM WORT?\n");
  const namen = await pg.evaluate(() => {
    const w = document.querySelector(".lc-ruf-wort");
    if (!w) return null;
    return getComputedStyle(w).animationName;
  });
  pruefe("es gibt ein Rufwort", Boolean(namen));
  pruefe("das Wackeln laeuft", /lcRufWackeln/.test(namen || ""), namen || "-");
  pruefe("das Licht laeuft dazu", /lcRufAn/.test(namen || ""), namen || "-");

  console.log("\nBEWEGT SICH DAS WORT WIRKLICH?\n");
  /* Die Groesse ueber den Ablauf abtasten. Ein Name allein waere
     kein Beweis — eine Animation kann angeschrieben sein und
     trotzdem nichts tun. */
  const proben = [];
  for (let i = 0; i < 14; i++) {
    proben.push(await pg.evaluate(() => {
      const w = document.querySelector(".lc-ruf-wort");
      const r = w.getBoundingClientRect();
      return +(r.width).toFixed(2);
    }));
    await pg.waitForTimeout(120);
  }
  const min = Math.min(...proben), max = Math.max(...proben);
  pruefe("die Breite aendert sich waehrend des Ablaufs", max - min > 1.5,
    "von " + min + " bis " + max + " px (" + proben.slice(0, 8).join(" ") + " …)");

  console.log("\nUND DER KREISEL?\n");
  const kreis = await pg.evaluate(() => {
    const z = document.querySelector(".lc-zeile-ruf") || document.querySelector("#lcVerlauf > *");
    try { window.__schallStoss("ACHTUNG DER T-REX", "", z); } catch (e) { return "AUSNAHME: " + e.message; }
    return document.querySelectorAll(".lc-schallwelle, .lc-schall, [class*='schall']").length;
  });
  pruefe("der Schallkreis wird gezeichnet", typeof kreis === "number" && kreis > 0, String(kreis));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Wackeln, Licht und Kreisel laufen zusammen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
