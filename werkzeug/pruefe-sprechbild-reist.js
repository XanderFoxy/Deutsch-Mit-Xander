#!/usr/bin/env node
/* =========================================================
   SIEHT MAN DAS SPRECHBILD DER ANDEREN?
   ---------------------------------------------------------
   GEMELDET: „Wenn jemand anders einen Effekt in seinem
   Sprechbild einstellt — zum Beispiel bei Emmi aus Aegypten —,
   ich sehe ihren Effekt nicht. Sie sieht ihn selber, aber ich
   seh ihn nicht."

   Nachgesehen: das Sprechbild reiste nur in der Chatzeile und
   in der einen Meldung beim Umstellen mit. Im PULS — der
   Meldung, die jeder alle sechs Sekunden schickt und in der
   alles steht, was die anderen ueber einen wissen muessen —
   stand es nicht. Wer spaeter hereinkam oder das eine Paket
   verpasste, sah bei allen anderen fuer immer den gruenen
   Standardring.

   Diese Sonde laesst drei Pakete eintreffen und sieht nach, ob
   die Wahl ankommt: den Puls, die Begruessung und die Chatzeile.

   Aufruf:  node werkzeug/pruefe-sprechbild-reist.js
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
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefEmpfangen, { timeout: 20000 });

  console.log("\nWAS EIN FREMDES PAKET UEBER DIE WAHL SAGT\n");
  const faelle = [
    ["die Begruessung", { art: "auch-da", von: "emmi", name: "Emmi", sprechbild: "feuer" }, "feuer"],
    ["der Puls",        { art: "puls",    von: "emmi", name: "Emmi", sprechbild: "eis" },   "eis"],
    ["die Chatzeile",   { art: "text",    von: "emmi", name: "Emmi", id: "x1", zeit: Date.now(),
                          text: "hallo", sprechbild: "regenbogen" }, "regenbogen"]
  ];
  for (const [wie, paket, soll] of faelle) {
    const da = await pg.evaluate(async (p) => {
      window.LiveChat.pruefEmpfangen(p);
      await new Promise((f) => setTimeout(f, 120));
      const l = window.LiveChat.lage();
      const platz = (l.plaetze || []).filter((x) => /emmi/i.test(x.name || ""))[0];
      return platz ? (platz.sprechbild || "") : "kein Platz";
    }, paket);
    pruefe(wie + " bringt die Wahl mit", da === soll, "„" + da + "“ statt „" + soll + "“");
  }

  console.log("\nUND WAS NICHTS DAZU SAGT, AENDERT NICHTS\n");
  const bleibt = await pg.evaluate(async () => {
    window.LiveChat.pruefEmpfangen({ art: "puls", von: "emmi", name: "Emmi" });
    await new Promise((f) => setTimeout(f, 120));
    const l = window.LiveChat.lage();
    const platz = (l.plaetze || []).filter((x) => /emmi/i.test(x.name || ""))[0];
    return platz ? (platz.sprechbild || "") : "kein Platz";
  });
  pruefe("ein Puls ohne Angabe wirft die Wahl nicht um", bleibt === "regenbogen",
    "„" + bleibt + "“");

  console.log("\nUND WAS HINAUSGEHT, TRAEGT SIE AUCH\n");
  const raus = await pg.evaluate(async () => {
    window.LiveChat.sprechbildSetzen("magie");
    let paket = null;
    window.LiveChat.pruefPost((p) => { if (p && p.art === "puls") paket = p; });
    window.LiveChat.pruefPuls();
    await new Promise((f) => setTimeout(f, 120));
    return paket ? (paket.sprechbild || "") : "kein Puls abgefangen";
  });
  pruefe("der eigene Puls traegt das eigene Sprechbild", raus === "magie", "„" + raus + "“");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)"
    : "Die Wahl der anderen kommt an.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
