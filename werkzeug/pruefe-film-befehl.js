#!/usr/bin/env node
/* =========================================================
   PRUEFT AN DER ECHTEN SEITE: TUT /film WIRKLICH ETWAS?
   ---------------------------------------------------------
   GEMELDET: „Es funktioniert im Chat noch nicht. Ich habe auch
   /trex versucht, aber das geht nicht."

   Die Sonde laedt die richtige index.html, wartet, bis das
   Klassenzimmer da ist, und fuehrt den Befehl ueber dieselbe
   Tuer aus, die auch das Eingabefeld benutzt. Danach wird
   gemessen, ob wirklich eine Filmschicht auf der Seite liegt
   und ein Video darin laeuft. Behauptet wird nichts.
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

(async () => {
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
  const fehlerAufSeite = [];
  pg.on("pageerror", (e) => fehlerAufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });

  console.log("\nIST DER BEFEHL UEBERHAUPT DA?\n");
  const da = await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl,
    { timeout: 20000 }).then(() => true).catch(() => false);
  pruefe("LiveChat ist geladen", da);
  if (!da) { await br.close(); srv.close(); process.exit(1); }

  const kennt = await pg.evaluate(() =>
    (window.LiveChat.befehlsliste ? window.LiveChat.befehlsliste() : [])
      .some((b) => b.w === "film" || b.nutzt === "/film <Name>"));
  pruefe("„/film\" steht in der Befehlsliste", kennt);

  console.log("\nUND TUT ER AUCH ETWAS?\n");
  const ging = await pg.evaluate(() => {
    try { return window.LiveChat.pruefBefehl("/film trex"); } catch (e) { return "AUSNAHME: " + e.message; }
  });
  /* befehlAusfuehren gibt die erzeugte Zeile zurueck, nicht true —
     erkannt ist er, wenn ueberhaupt etwas zurueckkommt UND die
     Zeile den Filmnamen traegt. (Erster Entwurf verlangte true und
     meldete deshalb einen Fehler, wo keiner war.) */
  pruefe("der Befehl wird als Befehl erkannt und trägt den Filmnamen",
    Boolean(ging) && typeof ging === "object" && ging.film === "trex",
    ging && ging.film ? "film=" + ging.film : JSON.stringify(ging).slice(0, 70));

  /* Jetzt die Wirkung: kommt der Abspieler und eine Schicht? */
  const kam = await pg.waitForFunction(() => Boolean(window.DMA_FILM), { timeout: 15000 })
    .then(() => true).catch(() => false);
  pruefe("filmspieler.js wird nachgeladen", kam);

  const schicht = await pg.waitForFunction(() => Boolean(document.querySelector(".dma-film")),
    { timeout: 15000 }).then(() => true).catch(() => false);
  pruefe("eine Filmschicht liegt auf der Seite", schicht);

  if (schicht) {
    await pg.waitForTimeout(2500);
    const z = await pg.evaluate(() => {
      const v = document.querySelector(".dma-film video");
      const c = document.querySelector(".dma-film canvas");
      const i = document.querySelector(".dma-film img");
      return { video: !!v, canvas: !!c, standbild: !!i,
        zeit: v ? +v.currentTime.toFixed(2) : -1,
        groesse: v ? v.videoWidth + "x" + v.videoHeight : "-",
        fehlerCode: v && v.error ? v.error.code : null };
    });
    pruefe("es läuft wirklich ein Video", z.video && z.zeit > 0.3,
      "Zeit " + z.zeit + " s, " + z.groesse + (z.fehlerCode ? ", Fehler " + z.fehlerCode : ""));
  }

  if (fehlerAufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    fehlerAufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "/film tut, was es soll.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
