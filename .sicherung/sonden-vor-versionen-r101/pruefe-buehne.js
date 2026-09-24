/* PRÜFT DIE BÜHNENANSICHT UND DIE BEIDEN SPRECH-EFFEKTE.
   ---------------------------------------------------------------
   GEWUENSCHT: „Mach die Bühnenansicht fertig, die man wechseln kann
   zwischen der klassischen und zwischen den beiden Personen, die nur
   sich selbst sehen, wenn sie nur zwei auf der Bühne sind." Und:
   „Bei dem Sprechen die Effekte — der Regenbogen deutlicher und das
   magische Funkeln als eigener Effekt."

   Gemessen wird an den echten Stilblättern: wie viele Plätze im
   Gegenüber sichtbar sind, wie gross sie dabei werden — und ob die
   beiden Effekte wirklich anders aussehen als der Standard. */
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
  const pg = await br.newPage({ viewport: { width: 390, height: 800 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2300);

  const erg = await pg.evaluate(() => {
    document.querySelectorAll(".lc-probe").forEach((e) => e.remove());
    const huelle = document.createElement("div");
    huelle.className = "lc-probe livechat";
    huelle.style.cssText = "position:fixed;left:0;top:0;width:390px;background:#221c1a;padding:8px;z-index:99999";
    let plaetze = "";
    for (let i = 1; i <= 8; i++) {
      const frei = i > 2;
      plaetze += '<button class="lc-platz ' + (frei ? "lc-platz-frei" : "lc-platz-belegt")
        + '" data-lc-platz="' + i + '"><span class="lc-kreis"></span>'
        + '<span class="lc-platz-name">' + (frei ? "frei" : (i === 1 ? "Xander" : "Emmy")) + "</span></button>";
    }
    huelle.innerHTML = '<div class="lc-plaetze" id="probePlaetze">' + plaetze + "</div>";
    document.body.appendChild(huelle);
    const raster = huelle.querySelector("#probePlaetze");
    const sichtbar = () => [...raster.querySelectorAll(".lc-platz")]
      .filter((k) => getComputedStyle(k).display !== "none");
    const breite = () => Math.round(sichtbar()[0].getBoundingClientRect().width);

    const klassisch = { wieviele: sichtbar().length, breite: breite() };
    raster.classList.add("lc-buehne-gegenueber");
    raster.dataset.besetzt = "2";
    const zweit = { wieviele: sichtbar().length, breite: breite() };
    raster.dataset.besetzt = "1";
    raster.querySelectorAll(".lc-platz")[1].classList.add("lc-platz-frei");
    raster.querySelectorAll(".lc-platz")[1].classList.remove("lc-platz-belegt");
    const allein = { wieviele: sichtbar().length, breite: breite() };

    /* Und die Sprech-Effekte: sehen Regenbogen und Funkeln anders aus
       als der gewoehnliche Ring? */
    const effekt = (art) => {
      const k = document.createElement("button");
      k.className = "lc-platz lc-platz-belegt lc-platz-spricht";
      k.dataset.sprechbild = art;
      k.innerHTML = '<span class="lc-kreis"></span>';
      huelle.appendChild(k);
      const kreis = k.querySelector(".lc-kreis");
      const st = getComputedStyle(kreis);
      const vor = getComputedStyle(kreis, "::before");
      const nach = getComputedStyle(kreis, "::after");
      return {
        animation: (st.animationName || "none").split(",")[0],
        rand: st.borderTopWidth,
        vorAnimation: (vor.animationName || "none").split(",")[0],
        nachAnimation: (nach.animationName || "none").split(",")[0],
        vorBild: (vor.backgroundImage || "none").slice(0, 18),
        nachBild: (nach.backgroundImage || "none").slice(0, 18)
      };
    };
    return { klassisch, zweit, allein,
             ring: effekt("ring"), regenbogen: effekt("regenbogen"), funkeln: effekt("funkeln") };
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  console.log("\n  DIE BÜHNENANSICHT (390 px, zwei sitzen)");
  ok(erg.klassisch.wieviele === 8, "klassisch: alle acht Plätze", erg.klassisch.wieviele + " sichtbar, je " + erg.klassisch.breite + " px");
  ok(erg.zweit.wieviele === 2, "Gegenüber: nur die beiden auf der Bühne", erg.zweit.wieviele + " sichtbar");
  ok(erg.zweit.breite > erg.klassisch.breite * 1.5, "und sie sind deutlich grösser",
     erg.klassisch.breite + " px → " + erg.zweit.breite + " px");
  ok(erg.allein.wieviele === 1 && erg.allein.breite >= erg.zweit.breite,
     "einer allein hat die Bühne für sich", erg.allein.breite + " px");

  console.log("\n  DIE SPRECH-EFFEKTE");
  /* NEU IN FASSUNG 340. GEMELDET: „Der Regenbogen muss viel bunter,
     dafür klarer und farbiger werden, viel mehr ausstrahlen wie ein
     schöner Regenbogen."
     Vorher wanderte EINE Farbe durch den Rand (lcSprichtBogen) — zu
     jedem Zeitpunkt war der Ring also einfarbig. Jetzt dreht sich ein
     echter Farbkreis; die Namen heissen deshalb anders, und das ist
     kein Fehler, sondern der Umbau. Wie bunt er wirklich ist, misst
     pruefe-sprechbilder.js an den gerechneten Farben. */
  /* UMGEBAUT IN FASSUNG 350, und wieder auf Ansage: „Der
     Regenbogeneffekt soll sich aussen konzentrieren. Da soll nicht
     das ganze Bild zumachen, sondern der Kreis soll ein einziger
     Regenbogen sein — die Farben sollen nach aussen wandern."

     Vorher lag der Farbkreis auf dem Bild (lcBogenGlimmen /
     lcBogenDreht). Jetzt liegt er als RING darum: ein
     conic-gradient, dem eine Maske die Mitte ausschneidet
     (lcBogenRing), und darueber ein Ring, der nach aussen laeuft und
     vergeht (lcRandWelle). Die Namen heissen deshalb anders — das ist
     der Umbau, kein Fehler. Wie bunt er ist, misst weiterhin
     pruefe-sprechbilder.js an den gerechneten Farben. */
  ok(erg.regenbogen.vorAnimation === "lcRandWelle", "ein Ring laeuft nach aussen",
     erg.regenbogen.vorAnimation);
  ok(erg.regenbogen.nachAnimation === "lcBogenRing",
     "und der Farbkreis dreht sich am Rand", erg.regenbogen.nachAnimation);
  ok(erg.regenbogen.animation === "none",
     "das Bild selbst bleibt frei", erg.regenbogen.animation);
  /* SCHON-PASS 8 (Xanders Liste vom 23.09.): Funkeln blitzt seitdem im
     Sprechfeld auf („Aufblitzen 0,15–0,35 s … dann weg") — das Bild
     selbst glimmt nicht mehr. Gemessen in pruefe-sprechbilder. */
  ok(erg.funkeln.animation === "none", "Funkeln: das Bild selbst bleibt ruhig", erg.funkeln.animation);
  ok(erg.funkeln.nachAnimation === "lcFunkelDreh" && erg.funkeln.vorAnimation === "lcFunkelDreh",
     "und zwei Lichterkränze wandern gegenläufig");
  ok(erg.funkeln.nachBild.indexOf("radial-gradient") === 0,
     "die Lichter sind wirklich gezeichnet", erg.funkeln.nachBild + "…");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Bühne und Effekte sitzen.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
