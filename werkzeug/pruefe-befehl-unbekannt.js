#!/usr/bin/env node
/* =========================================================
   GEHT EIN BEFEHL, DEN ES NICHT GIBT, TROTZDEM HINAUS?
   ---------------------------------------------------------
   GEWUENSCHT: „Ich moechte, dass es Befehle, die es nicht
   gibt, nicht schickt — also zum Beispiel, wenn ich schreibe
   /hallo, dass das nicht gesendet wird."

   Gemessen wird am Rundruf selbst: was der Chat abschickt,
   wird abgefangen. Was NICHT abgefangen wird, ist auch nicht
   hinausgegangen.

   Und die Gegenprobe gehoert dazu, sonst waere die Sperre
   schlimmer als das Problem: ein richtiger Befehl muss
   weiter tun, was er tut, „/me/" bleibt eine ganz normale
   Zeile, ein Bruch wie „3/4" auch, und wer den Schraegstrich
   wirklich schreiben will, kann ihn verdoppeln.
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
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.schreiben, { timeout: 20000 });

  const schicken = (text) => pg.evaluate((t) => {
    let raus = null;
    window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
    window.LiveChat.schreiben(t);
    return { paket: raus, zeilen: (window.LiveChat.pruefZeilen(2) || []).join(" | ") };
  }, text);

  console.log("\nWAS NICHT HINAUSGEHEN DARF\n");
  for (const wort of ["/hallo", "/knofetti", "/trexx", "/ßüö"]) {
    const r = await schicken(wort);
    pruefe("„" + wort + "“ geht NICHT hinaus", !r.paket,
      r.paket ? "hinausgegangen: " + String(r.paket.text || "") : r.zeilen.slice(0, 70));
  }
  const sagt = await schicken("/hallo");
  pruefe("und es steht da, warum", /kenne ich nicht/.test(sagt.zeilen), sagt.zeilen.slice(0, 90));

  console.log("\nWAS WEITER HINAUSGEHEN MUSS\n");
  const gut = [
    ["Guten Morgen zusammen", "gewöhnlicher Text"],
    ["3/4 von der Klasse ist da", "ein Bruch mitten im Satz"],
    ["/me/ findet das gut", "der Namenstrick"],
    ["//hallo", "verdoppelter Schrägstrich"]
  ];
  for (const [text, was] of gut) {
    const r = await schicken(text);
    pruefe(was + " geht hinaus", Boolean(r.paket),
      r.paket ? String(r.paket.text || "") : "NICHTS abgefangen");
  }
  const doppelt = await schicken("//konfetti");
  pruefe("„//konfetti“ kommt als „/konfetti“ an, nicht als Konfetti",
    Boolean(doppelt.paket) && String(doppelt.paket.text || "").indexOf("/konfetti") === 0,
    doppelt.paket ? String(doppelt.paket.text || "") : "-");

  console.log("\nUND EIN ECHTER BEFEHL?\n");
  const echt = await schicken("/konfetti");
  pruefe("„/konfetti“ loest die Animation aus statt Text zu schicken",
    Boolean(echt.paket) && String(echt.paket.wirkung || "") === "konfetti",
    echt.paket ? (echt.paket.wirkung || "ohne Wirkung") : "-");
  const film = await schicken("/trex");
  pruefe("„/trex“ loest den Film aus",
    Boolean(film.paket) && String(film.paket.wirkung || "") === "trex",
    film.paket ? (film.paket.wirkung || "ohne Wirkung") : "-");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Nur echte Befehle gehen durch.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
