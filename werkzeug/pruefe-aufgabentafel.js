#!/usr/bin/env node
/* =========================================================
   HAT DIE AUFGABE EINE FUNKTION?
   ---------------------------------------------------------
   GEMELDET: „Die Aufgabe hat keine Funktion. Man schreibt
   einen ganzen Satz, und der ganze Satz ist eingerahmt, und
   es hat ueberhaupt keine Funktion — man kann nur den Satz
   anklicken, und das ist quasi die Loesung. Was soll das fuer
   eine Aufgabe sein?" Und: „Das wird bei anderen nicht
   angezeigt."

   Beides stimmte. Die Oberflaeche bekam nur den Satz und hat
   ihn hingeschrieben; die gemischten Teile lagen in
   livechat.js und kamen nie heraus. Und die Ansage an die
   anderen trug sie gar nicht erst mit — die bekamen eine
   Aufgabe ohne Teile.

   Diese Sonde stellt eine Aufgabe, baut die Antwort aus den
   Kacheln zusammen und sieht nach, was hinausgeht. Und sie
   stellt den zweiten Fall nach: eine Aufgabe, die von einem
   ANDEREN Geraet hereinkommt.

   Aufruf:  node werkzeug/pruefe-aufgabentafel.js
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
  const pg = await br.newPage({ viewport: { width: 420, height: 860 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 150)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    /* Der Kasten, in dem die laufende Aufgabe steht, gehoert zur
       Chatleiste. Die Buehne der Sonde baut sie nicht mit auf — also
       hier, damit die Tafel einen Platz hat. */
    if (!document.getElementById("lcAufgabeLaeuft")) {
      const k = document.createElement("div");
      k.id = "lcAufgabeLaeuft";
      k.innerHTML = '<span id="lcAufgabeText"></span>'
                  + '<button type="button" id="lcAufgabeSchluss">Schluss</button>';
      document.body.appendChild(k);
    }
  });

  console.log("\nEIN SATZPUZZLE, SELBST GESTELLT\n");
  const satz = await pg.evaluate(async () => {
    window.LiveChat.pruefAufgabeStellen("satz", "Der Hund läuft über die Wiese");
    window.DMA_PRUEF.aufgabeZeichnen();
    await new Promise((f) => setTimeout(f, 120));
    const t = document.querySelector(".lc-aufgabentafel");
    if (!t) return { keineTafel: true };
    return { teile: t.querySelectorAll(".lc-aufgabe-vorrat .lc-aufgabe-teil").length,
             woerter: [...t.querySelectorAll(".lc-aufgabe-teil")].map((b) => b.textContent),
             knopfAus: t.querySelector(".lc-aufgabe-fertig").disabled };
  });
  pruefe("es gibt eine Tafel mit Teilen", !satz.keineTafel && satz.teile === 6,
    satz.keineTafel ? "keine Tafel" : satz.teile + " Teile");
  pruefe("die Teile sind die Wörter des Satzes",
    !satz.keineTafel && satz.woerter.slice().sort().join(" ")
      === "Der Hund Wiese die läuft über".split(" ").sort().join(" "),
    (satz.woerter || []).join(" · "));
  pruefe("gemischt, nicht in der richtigen Reihenfolge",
    !satz.keineTafel && satz.woerter.join(" ") !== "Der Hund läuft über die Wiese",
    (satz.woerter || []).join(" "));
  pruefe("der Abschicken-Knopf ist noch aus", satz.knopfAus === true);

  console.log("\nDIE ANTWORT WIRD ANGETIPPT\n");
  const antwort = await pg.evaluate(async () => {
    const t = document.querySelector(".lc-aufgabentafel");
    const soll = "Der Hund läuft über die Wiese".split(" ");
    /* Der Reihe nach das richtige Wort antippen. */
    soll.forEach((w) => {
      const b = [...t.querySelectorAll(".lc-aufgabe-vorrat .lc-aufgabe-teil")]
        .filter((x) => x.dataset.teil === w)[0];
      if (b) b.click();
    });
    const inZeile = [...t.querySelectorAll(".lc-aufgabe-zeile .lc-aufgabe-teil")]
      .map((b) => b.dataset.teil).join(" ");
    const knopfAn = !t.querySelector(".lc-aufgabe-fertig").disabled;
    let raus = null;
    window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
    t.querySelector(".lc-aufgabe-fertig").click();
    await new Promise((f) => setTimeout(f, 160));
    return { inZeile, knopfAn,
             text: raus ? String(raus.text || "") : "",
             zurueck: t.querySelectorAll(".lc-aufgabe-vorrat .lc-aufgabe-teil").length };
  });
  pruefe("die Wörter stehen in der Zeile", antwort.inZeile === "Der Hund läuft über die Wiese",
    antwort.inZeile);
  pruefe("und der Knopf geht an, wenn alle gesetzt sind", antwort.knopfAn === true);
  pruefe("abgeschickt geht die Antwort hinaus",
    /Der Hund läuft über die Wiese/.test(antwort.text), antwort.text || "nichts abgefangen");
  pruefe("danach liegen die Teile wieder bereit", antwort.zurueck === 6,
    antwort.zurueck + " Teile");

  console.log("\nEIN WORTPUZZLE VON EINEM ANDEREN GERAET\n");
  const fremd = await pg.evaluate(async () => {
    window.LiveChat.pruefEmpfangen({ art: "aufgabeAn", von: "emmi", name: "Emmi",
      typ: "wort", frage: "", zeileId: "x9", zeit: Date.now() + 5000,
      teile: ["r", "F", "a", "h", "d", "r"] });
    window.DMA_PRUEF.aufgabeZeichnen();
    await new Promise((f) => setTimeout(f, 120));
    const t = document.querySelector(".lc-aufgabentafel");
    if (!t) return { keineTafel: true };
    return { teile: t.querySelectorAll(".lc-aufgabe-teil").length,
             eng: t.querySelector(".lc-aufgabe-vorrat").classList.contains("lc-aufgabe-eng") };
  });
  pruefe("auch eine fremde Aufgabe hat Teile zum Antippen",
    !fremd.keineTafel && fremd.teile === 6,
    fremd.keineTafel ? "keine Tafel" : fremd.teile + " Teile");
  pruefe("beim Wortpuzzle stehen sie eng, es sind ja Buchstaben",
    fremd.eng === true, String(fremd.eng));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)"
    : "Die Aufgabe laesst sich antippen — bei allen im Raum.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
