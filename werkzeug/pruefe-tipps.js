/* PRÜFT: DIE ERKLÄRUNG ZUM BEFEHL IST AUCH AUF DEM TELEFON DA.
   ---------------------------------------------------------------
   GEMELDET: „Die Beschreibungen der Befehle sehe ich auf dem Handy
   gar nicht."
   Und gleich danach: „Mache die Liste der Befehle wieder
   nebeneinander, so wie es vorher war … Was ich wollte, war nur, dass
   du diese einzelnen Sachen leicht erklaeren kannst — und das galt nur
   fuer die einzelnen Buchstaben, fuer W oder S oder I."

   Also wird beides gemessen: die Vorschlaege stehen NEBENEINANDER
   (mehrere teilen sich eine Zeile), und trotzdem traegt ein kurzer
   Befehl wie /w seine Erklaerung — waehrend ein langer wie
   /hintergrund auf dem Telefon nur seinen Namen zeigt. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  const messen = async (breite, hoehe) => {
    const pg = await br.newPage({ viewport: { width: breite, height: hoehe } });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForTimeout(2300);
    const erg = await pg.evaluate(() => {
      document.querySelectorAll(".lc-probe").forEach((e) => e.remove());
      const huelle = document.createElement("div");
      huelle.className = "lc-probe lc-chat-fuss";
      huelle.style.cssText = "position:relative;padding:8px";
      huelle.innerHTML = '<input type="text" class="lc-chat-feld" id="lcFeld">'
        + '<div class="lc-tipps" id="lcTipps" role="listbox" hidden></div>';
      document.body.appendChild(huelle);
      window.__tippsBinden(huelle);
      const feld = huelle.querySelector("#lcFeld");
      feld.value = "/";
      feld.dispatchEvent(new Event("input", { bubbles: true }));
      const kasten = huelle.querySelector("#lcTipps");
      const chips = [...kasten.querySelectorAll(".lc-tipp")];
      if (!chips.length) return { chips: 0 };
      const lesen = (c) => {
        const kl = c.querySelector("small");
        const r = kl ? kl.getBoundingClientRect() : null;
        return {
          name: (c.querySelector("strong") || {}).textContent || "",
          kurz: c.classList.contains("lc-tipp-kurz"),
          erklaerung: kl ? (kl.textContent || "").trim() : "",
          sichtbar: Boolean(kl) && getComputedStyle(kl).display !== "none" && r.height > 0,
          hinweistext: (c.title || "").trim()
        };
      };
      /* Stehen sie nebeneinander? Dann teilen sich mehrere Vorschlaege
         dieselbe Oberkante. */
      const oben = chips.map((c) => Math.round(c.getBoundingClientRect().top));
      const zeilen = [...new Set(oben)].length;
      const proZeile = Math.max(...[...new Set(oben)]
        .map((y) => oben.filter((o) => o === y).length));
      return {
        chips: chips.length,
        zeilen: zeilen,
        proZeile: proZeile,
        kurzer: chips.map(lesen).find((c) => c.kurz) || null,
        langer: chips.map(lesen).find((c) => !c.kurz && c.erklaerung) || null,
        kastenHoehe: Math.round(kasten.getBoundingClientRect().height),
        schirm: window.innerHeight
      };
    });
    await pg.close();
    return erg;
  };

  let fehler = 0;
  for (const [was, b, h] of [["TELEFON (390 px)", 390, 780], ["SCHIRM (1100 px)", 1100, 800]]) {
    const e = await messen(b, h);
    console.log("\n  " + was);
    if (!e.chips) { console.log("    FEHL keine Vorschläge gefunden"); fehler++; continue; }
    console.log("    " + e.chips + " Vorschläge auf " + e.zeilen + " Zeilen, bis zu "
      + e.proZeile + " nebeneinander");
    const nebeneinander = e.proZeile >= 2;
    if (!nebeneinander) fehler++;
    console.log("    " + (nebeneinander ? "ok   " : "FEHL ")
      + (nebeneinander ? "sie stehen nebeneinander" : "sie stehen untereinander"));

    if (!e.kurzer) { console.log("    FEHL kein kurzer Befehl (ein bis zwei Buchstaben) dabei"); fehler++; }
    else {
      const gut = e.kurzer.sichtbar;
      if (!gut) fehler++;
      console.log("    " + (gut ? "ok   " : "FEHL ") + "kurzer Befehl " + e.kurzer.name
        + " erklärt sich: „" + e.kurzer.erklaerung + "“");
    }
    if (e.langer) {
      /* Auf dem Telefon traegt ein langer Befehl nur seinen Namen —
         die Erklaerung steht im Hinweistext. */
      const sollSichtbar = b >= 520;
      const gut = e.langer.sichtbar === sollSichtbar
        && (sollSichtbar || e.langer.hinweistext.length > 0);
      if (!gut) fehler++;
      console.log("    " + (gut ? "ok   " : "FEHL ") + "langer Befehl " + e.langer.name
        + (sollSichtbar ? " erklärt sich in der Zeile" : " nur mit Namen, Erklärung im Hinweistext"));
    }
    const passt = e.kastenHoehe <= Math.round(e.schirm * 0.4);
    if (!passt) fehler++;
    console.log("    " + (passt ? "ok   " : "FEHL ") + "Liste " + e.kastenHoehe + " px von "
      + e.schirm + " px Schirm");
  }
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Reihe steht — und die kurzen Befehle erklären sich.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
