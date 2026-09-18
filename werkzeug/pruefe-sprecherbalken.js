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
    /* Wie im echten Chat: der Balken sitzt IN der Kopfzeile. */
    /* Wie im echten Chat wieder: Kopfzeile, darunter der Balken
       als eigene kleine Pille ueber dem Verlauf. */
    const kopf = document.createElement("div");
    kopf.className = "lc-chat";
    kopf.innerHTML = '<div class="lc-chat-kopf">'
      + '<button type="button" class="lc-chat-kopf-titel" id="titel">'
      + '<span class="lc-kopf-wort">\ud83d\udcac Chat</span></button>'
      + '<span class="lc-chat-kopf-rechts"><button class="lc-chat-raeumen">\u24d8</button></span></div>'
      + '<div class="lc-live-leiste" id="lcLiveLeiste" hidden></div>';
    kopf.style.cssText = "position:fixed;left:0;top:0;width:430px;z-index:99999;background:#221c1a";
    document.body.appendChild(kopf);
    const leiste = document.getElementById("lcLiveLeiste");
    if (!window.__balken) return "Prüfnaht __balken fehlt";
    const lies = () => ({
      sichtbar: !leiste.hidden,
      text: leiste.textContent.replace(/\s+/g, " ").trim(),
      meins: leiste.classList.contains("lc-live-ich"),
      /* Steht der Balken WIRKLICH in der Kopfzeile — und tritt der
         Titel dafuer zurueck? */
      breite: Math.round(leiste.getBoundingClientRect().width),
      hoehe: Math.round(leiste.getBoundingClientRect().height),
      rund: getComputedStyle(leiste).borderRadius,
      titelWeg: getComputedStyle(document.getElementById("titel")).display === "none"
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
    /* 5. Und das Entscheidende: aendert sich die HOEHE? Genau daran
       ist die Aufnahme abgebrochen — der Knopf rutschte weg. */
    window.__balken({ ich: false, jetzt: null, lauscher: null });
    aus.hoeheStill = Math.round(kopf.getBoundingClientRect().height);
    window.__balken({ ich: true, jetzt: null, lauscher: null });
    aus.hoeheSpricht = Math.round(kopf.getBoundingClientRect().height);
    /* Und der Fall, der die Aufnahme abgebrochen hat: waehrend der
       AUFNAHME steht „🔴 du sprichst" in der Kopfzeile. Wird sie
       dadurch hoeher? Dann rutscht der Knopf wieder weg. */
    const zeile = kopf.querySelector(".lc-chat-kopf");
    aus.kopfRuhig = Math.round(zeile.getBoundingClientRect().height);
    document.body.classList.add("lc-ich-spreche");
    aus.kopfAufnahme = Math.round(zeile.getBoundingClientRect().height);
    document.body.classList.remove("lc-ich-spreche");
    return aus;
  });

  console.log("");
  if (typeof erg === "string") { console.log("  " + erg); }
  else {
    const z = (name, x) => console.log("  " + name.padEnd(22)
      + (x.sichtbar ? "sichtbar" : "versteckt").padEnd(11)
      + (x.meins ? "[meine Farbe] " : "              ")
      + JSON.stringify(x.text)
      + (x.sichtbar ? "   " + x.breite + "x" + x.hoehe + " px, Radius " + x.rund : ""));
    z("niemand spricht", erg.still);
    z("ich nehme auf", erg.ichSpreche);
    console.log("      (beim Aufnehmen darf KEIN Balken kommen — nur die blinkende Zeile)");
    z("Emmy spricht", erg.andere);
    z("drüben läuft meine", erg.wirdGehoert);
    console.log("");
    console.log("  Höhe der Kopfzeile   still: " + erg.hoeheStill + " px"
      + "   beim Sprechen: " + erg.hoeheSpricht + " px"
      + (erg.hoeheStill === erg.hoeheSpricht
          ? "   (gleich — nichts verschiebt sich)"
          : "   VERSCHIEBT SICH UM " + Math.abs(erg.hoeheSpricht - erg.hoeheStill) + " px"));
    console.log("");
    console.log("  Kopfzeile ruhig: " + erg.kopfRuhig + " px   waehrend der Aufnahme: "
      + erg.kopfAufnahme + " px"
      + (erg.kopfRuhig === erg.kopfAufnahme
          ? "   (gleich — der Knopf bleibt liegen)"
          : "   WAECHST UM " + (erg.kopfAufnahme - erg.kopfRuhig) + " px"));
    console.log("  Titel bleibt beim Sprechen stehen: "
      + (erg.andere.titelWeg ? "NEIN — er weicht noch" : "ja, wie im Ursprungszustand"));
  }
  await br.close(); srv.close();
})();
