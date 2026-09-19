#!/usr/bin/env node
/* =========================================================
   SETZT EIN ANKOEMMLING MEINEN CHAT ZURUECK?
   ---------------------------------------------------------
   GEMELDET: „In dem Moment, wenn ein anderer reinkommt, wird
   der Chat auf den Zustand gesetzt, den der andere aus seinem
   persoenlichen Chat mit mir kennt. Mein Chat soll sich gar
   nicht resetten dadurch, dass er reinkommt. Wenn ich unten
   zuletzt lese, dass ich mich selbst geschlagen habe, und
   dann kommt der neue Gast, soll der Chat nicht ploetzlich
   leer werden oder den alten Stand zeigen."

   Der Raum reicht seinen Verlauf selbst herum: wer
   hereinkommt, meldet sich, und die anderen schicken ihm, was
   sie haben. Das gilt aber in beide Richtungen — meldet sich
   jemand neu an, schickt ER seinen Verlauf an den, der schon
   dasitzt. Und der nahm ihn an, solange er selbst noch keinen
   bekommen hatte. Wer einen leeren Raum betritt, bekommt nie
   einen: bei ihm stand das Tor also dauerhaft offen.

   Diese Sonde stellt beides nach — einmal den Ankoemmling
   (der den Verlauf bekommen MUSS) und einmal den, der schon
   sitzt (dessen Chat unangetastet bleiben MUSS).

   Aufruf:  node werkzeug/pruefe-verlauf-kein-reset.js
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };

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
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 150)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefVerlaufSetzen, { timeout: 20000 });

  /* Der Verlauf, der auf keinen Fall verschwinden darf. */
  const MEINS = [
    { id: "m1", von: "ich", name: "Alex", text: "Guten Morgen zusammen", art: "text", zeit: Date.now() - 5000 },
    { id: "m2", von: "ich", name: "Alex", text: "Alex haut mit dem Hammer auf sich selbst", art: "aktion", zeit: Date.now() - 2000 }
  ];
  /* Und der alte Stand, den ein Ankoemmling mitbringt. */
  const SEINS = [
    { id: "a1", von: "gast", name: "Emmi", text: "Hallo, bin neu hier", art: "text", zeit: Date.now() - 900000 }
  ];

  console.log("\nICH SITZE SCHON DRIN — MEIN CHAT BLEIBT\n");
  const sitzt = await pg.evaluate(async ({ meins, seins }) => {
    window.LiveChat.pruefVerlaufSetzen(meins);
    const ich = window.LiveChat.lage().ichId;
    /* Das Fenster nach dem Betreten ist laengst zu: genau der Fall,
       in dem jemand hereinkommt, waehrend ich schon dasitze. Die
       Sonde wartet nicht 30 Sekunden, sondern nutzt denselben Weg,
       den der Alltag nimmt — sie meldet einen Ankoemmling. */
    window.LiveChat.pruefVerlaufFensterZu();
    window.LiveChat.pruefEmpfangen({ art: "verlauf", an: ich, von: "gast", zeilen: seins });
    await new Promise((f) => setTimeout(f, 120));
    const z = window.LiveChat.pruefZeilen(50);
    return { zeilen: z, letzte: z[z.length - 1] || "" };
  }, { meins: MEINS, seins: SEINS });
  pruefe("mein Chat ist nicht leer", sitzt.zeilen.length >= 2, sitzt.zeilen.length + " Zeilen");
  pruefe("meine letzte Zeile steht noch da",
    /Hammer/.test(sitzt.letzte), "„" + String(sitzt.letzte).slice(0, 50) + "“");
  pruefe("der alte Stand des Ankoemmlings ist NICHT hereingerutscht",
    !sitzt.zeilen.some((t) => /bin neu hier/.test(t)),
    sitzt.zeilen.filter((t) => /bin neu hier/.test(t)).length + " fremde Zeilen");

  console.log("\nICH KOMME GERADE HEREIN — ICH BEKOMME DEN VERLAUF\n");
  const neu = await pg.evaluate(async ({ seins }) => {
    window.LiveChat.pruefVerlaufSetzen([]);
    /* Einen Raum betreten heisst: das Fenster geht auf. */
    window.LiveChat.pruefVerlaufFensterAuf();
    const ich = window.LiveChat.lage().ichId;
    window.LiveChat.pruefEmpfangen({ art: "verlauf", an: ich, von: "gast", zeilen: seins });
    await new Promise((f) => setTimeout(f, 120));
    return window.LiveChat.pruefZeilen(50);
  }, { seins: SEINS });
  pruefe("der Ankoemmling bekommt den Verlauf weiterhin",
    neu.some((t) => /bin neu hier/.test(t)), neu.length + " Zeilen");

  console.log("\nUND EIN ZWEITER VERLAUF KOMMT NICHT MEHR DAZU\n");
  const zweimal = await pg.evaluate(async () => {
    const ich = window.LiveChat.lage().ichId;
    window.LiveChat.pruefEmpfangen({ art: "verlauf", an: ich, von: "gast2",
      zeilen: [{ id: "b1", von: "g2", name: "Bert", text: "noch ein alter Stand", art: "text", zeit: Date.now() - 800000 }] });
    await new Promise((f) => setTimeout(f, 120));
    return window.LiveChat.pruefZeilen(50);
  });
  pruefe("ein zweiter Verlauf wird abgewiesen",
    !zweimal.some((t) => /noch ein alter Stand/.test(t)),
    zweimal.length + " Zeilen");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)"
    : "Wer hereinkommt, bekommt den Verlauf — wer sitzt, behaelt seinen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
