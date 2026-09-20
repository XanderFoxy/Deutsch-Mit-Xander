#!/usr/bin/env node
/* =========================================================
   WER DARF DEN FOKUS-MODUS SCHALTEN?
   ---------------------------------------------------------
   GEMELDET: „Emmi hat mir gerade gesagt, dass sie den
   Fokus-Schalter auch hat. Er ist nicht fuer die anderen. Der
   ist fuer mich, falls ich das Kontingent weiter nutzen
   moechte. Das ist nur fuer mich zur Kontrolle — ist ja mein
   Geld. Wir muessen ja sowieso die automatische Regel haben:
   wenn das aufgebraucht ist, dass es dann blockiert und wieder
   in den Fokus-Modus zurueckgeht."

   Vorher durfte jeder HAEUPTLING schalten — und Haeuptling wird
   man schon dadurch, dass man einen Raum als Erster betritt.
   Emmi hatte den Schalter also zu Recht, nur sollte sie ihn
   gar nicht haben.

   Zwei Dinge werden hier gemessen: dass nur der Betreiber
   schaltet (auch ueber die Leitung — ein fremdes Geraet darf
   die Regel nicht setzen), und dass der Fokus von selbst
   zurueckkommt, wenn das Kontingent aufgebraucht ist.

   Aufruf:  node werkzeug/pruefe-fokus-betreiber.js
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
  const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 150)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBetreiber, { timeout: 20000 });

  console.log("\nEIN HAEUPTLING, DER NICHT DER BETREIBER IST\n");
  const chef = await pg.evaluate(() => {
    window.LiveChat.pruefBetreiber(false);
    window.LiveChat.pruefHaeuptling ? window.LiveChat.pruefHaeuptling(true) : null;
    window.LiveChat.pruefBefehl("/fokus");
    const z = window.LiveChat.pruefZeilen(2);
    return { letzte: z[z.length - 1] || "", fokus: window.LiveChat.fokusAn() };
  });
  pruefe("er darf nicht schalten", /Betreiber|schaltet der/.test(chef.letzte),
    String(chef.letzte).slice(0, 80));

  console.log("\nEIN FREMDES PAKET, DAS SICH ALS CHEF AUSGIBT\n");
  const fremd = await pg.evaluate(async () => {
    const vorher = window.LiveChat.fokusAn();
    /* Ohne „betreiber: true" — so schickt es jedes gewoehnliche
       Geraet. Es darf die Regel des Raums nicht setzen. */
    window.LiveChat.pruefEmpfangen({ art: "fokus", von: "emmi", name: "Emmi", fokus: !vorher });
    await new Promise((f) => setTimeout(f, 120));
    return { vorher: vorher, nachher: window.LiveChat.fokusAn() };
  });
  pruefe("es aendert nichts", fremd.vorher === fremd.nachher,
    "vorher " + fremd.vorher + ", nachher " + fremd.nachher);

  console.log("\nDER BETREIBER SCHALTET\n");
  const alex = await pg.evaluate(() => {
    window.LiveChat.pruefBetreiber(true);
    const a = window.LiveChat.fokusAn();
    window.LiveChat.pruefBefehl("/fokus");
    return { vorher: a, nachher: window.LiveChat.fokusAn() };
  });
  pruefe("bei ihm geht es", alex.vorher !== alex.nachher,
    "vorher " + alex.vorher + ", nachher " + alex.nachher);

  console.log("\nIST DAS KONTINGENT AUS, BLEIBT DER FOKUS AN\n");
  const aus = await pg.evaluate(async () => {
    window.LiveChat.pruefBetreiber(true);
    window.LiveChat.pruefRelaisGrund("budget-erschoepft");
    await new Promise((f) => setTimeout(f, 120));
    const nachMeldung = window.LiveChat.fokusAn();
    window.LiveChat.pruefBefehl("/fokus");     // ausschalten versuchen
    /* Die Begruendung kann ein paar Zeilen zurueckliegen: sie kommt
       im Augenblick der Meldung, der Versuch danach. Gesucht wird
       deshalb in den letzten Zeilen, nicht nur in der letzten. */
    const z = window.LiveChat.pruefZeilen(8);
    return { nachMeldung: nachMeldung, jetzt: window.LiveChat.fokusAn(),
             letzte: z.filter((t) => /Monatsbudget|Kontingent/.test(t)).join(" | ") };
  });
  pruefe("der Fokus geht von selbst an", aus.nachMeldung === true, String(aus.nachMeldung));
  pruefe("und laesst sich auch vom Betreiber nicht ausschalten", aus.jetzt === true,
    String(aus.jetzt));
  /* NACHGEBESSERT: gesucht wurde das Wort „Kontingent". Genau das
     hiess frueher so und wurde in Runde 27 umbenannt — GEMELDET:
     „Bei mir steht das Gespraechskontingent ist aufgebraucht", und
     gemeint war das selbst gesetzte MONATSBUDGET. Der Text ist also
     richtig, die Sonde war es nicht mehr. */
  pruefe("und es steht dabei, warum", /Monatsbudget|Kontingent/.test(aus.letzte),
    String(aus.letzte).slice(0, 80));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)"
    : "Den Fokus schaltet nur der Betreiber — und das Kontingent schaltet ihn zurueck.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
