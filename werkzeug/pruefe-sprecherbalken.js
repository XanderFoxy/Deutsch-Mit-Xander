/* PRÜFT DEN SPRECHERBALKEN IN DEN DREI FÄLLEN.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Wenn sie danach noch mal gehört wird, die Nachricht
   nach dem Abschicken, soll oben in der Chatleiste auch mein grüner
   Balken stehen — damit ich abschätzen kann, wann die andere Seite
   die Nachricht zu Ende gehört hat."

   Drei Fälle: ich spreche · jemand anders spricht · drüben wird
   meine Wortmeldung gerade abgespielt. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 430, height: 880 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(() => {
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const leiste = document.createElement("div");
    leiste.className = "lc-live-leiste";
    leiste.id = "lcLiveLeiste";
    leiste.hidden = true;
    document.body.appendChild(leiste);
    if (!window.__balken) return "Prüfnaht __balken fehlt";
    const lies = () => ({
      sichtbar: !leiste.hidden,
      text: leiste.textContent.replace(/\s+/g, " ").trim(),
      meins: leiste.classList.contains("lc-live-ich")
    });
    const aus = {};
    /* 1. Niemand spricht. */
    window.__balken({ ich: false, jetzt: null, lauscher: null });
    aus.still = lies();
    /* 2. Ich nehme gerade auf. */
    window.__balken({ ich: true, jetzt: null, lauscher: null });
    aus.ichSpreche = lies();
    /* 3. Jemand anders spricht. */
    window.__balken({ ich: false, jetzt: { von: "e", name: "Emmy" }, lauscher: null });
    aus.andere = lies();
    /* 4. Meine Wortmeldung läuft drüben. */
    window.__balken({ ich: false, jetzt: null, lauscher: ["Emmy"] });
    aus.wirdGehoert = lies();
    return aus;
  });

  console.log("");
  if (typeof erg === "string") { console.log("  " + erg); }
  else {
    const z = (name, x) => console.log("  " + name.padEnd(26)
      + (x.sichtbar ? "sichtbar" : "versteckt").padEnd(11)
      + (x.meins ? "[meine Farbe] " : "              ") + JSON.stringify(x.text));
    z("niemand spricht", erg.still);
    z("ich nehme auf", erg.ichSpreche);
    z("Emmy spricht", erg.andere);
    z("drüben läuft meine", erg.wirdGehoert);
  }
  await br.close(); srv.close();
})();
