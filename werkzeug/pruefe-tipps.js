/* PRÜFT: DIE ERKLÄRUNG ZUM BEFEHL IST AUCH AUF DEM TELEFON DA.
   ---------------------------------------------------------------
   GEMELDET: „Die Beschreibungen der Befehle sehe ich auf dem Handy
   gar nicht."
   Sie waren dort ausgeblendet (display:none), weil Name und Erklaerung
   nicht nebeneinander passen. Jetzt stehen sie untereinander. Gemessen
   wird auf einem schmalen und auf einem breiten Schirm: ist die
   Erklaerung sichtbar, hat sie Hoehe, und bleibt die Liste in ihrem
   Rahmen? */
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
      const chips = [...kasten.querySelectorAll(".lc-tipp")].filter((c) => c.querySelector("small"));
      if (!chips.length) return { chips: 0 };
      const c = chips[0];
      const kl = c.querySelector("small");
      const r = kl.getBoundingClientRect();
      return {
        chips: chips.length,
        erklaerung: (kl.textContent || "").trim(),
        sichtbar: getComputedStyle(kl).display !== "none" && r.height > 0,
        hoehe: Math.round(r.height),
        abgeschnitten: kl.scrollWidth > kl.clientWidth + 1,
        hinweistext: (c.title || "").trim(),
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
    if (!e.chips) { console.log("    FEHL keine Vorschläge mit Erklärung gefunden"); fehler++; continue; }
    console.log("    Vorschläge mit Erklärung: " + e.chips);
    console.log("    erste Erklärung: „" + e.erklaerung + "“");
    if (!e.sichtbar) fehler++;
    console.log("    " + (e.sichtbar ? "ok   " : "FEHL ") + "sichtbar, Höhe " + e.hoehe + " px");
    /* Auf dem Telefon MUSS die Erklaerung ganz dastehen. Auf dem
       breiten Schirm stehen die Vorschlaege nebeneinander; dort darf
       sie gekuerzt sein, dann aber im Hinweistext stehen. */
    if (b < 520) {
      if (e.abgeschnitten) fehler++;
      console.log("    " + (e.abgeschnitten ? "FEHL " : "ok   ")
        + (e.abgeschnitten ? "Text ist abgeschnitten" : "nichts abgeschnitten"));
    } else {
      const gut = !e.abgeschnitten || e.hinweistext === e.erklaerung;
      if (!gut) fehler++;
      console.log("    " + (gut ? "ok   " : "FEHL ")
        + (e.abgeschnitten ? "gekürzt, steht aber im Hinweistext" : "nichts abgeschnitten"));
    }
    const passt = e.kastenHoehe <= Math.round(e.schirm * 0.45);
    if (!passt) fehler++;
    console.log("    " + (passt ? "ok   " : "FEHL ") + "Liste " + e.kastenHoehe + " px von " + e.schirm + " px Schirm");
  }
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Erklärungen stehen überall.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
