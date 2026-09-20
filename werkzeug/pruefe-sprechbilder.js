#!/usr/bin/env node
/* =========================================================
   DIE SPRECHBILDER — VIERZEHN STUECK, JEDES ANDERS
   ---------------------------------------------------------
   GEWUENSCHT: „Ich brauche noch mehr fantastische
   Profilbildrahmen, wenn man spricht … Der Regenbogen muss
   viel bunter, dafuer klarer und farbiger werden … viele
   kleine Sternchen funkeln in verschiedenen Staerken, die
   das Profilbild umgeben … und dann vielleicht noch eins,
   wo Noten rauskommen."

   Gemessen wird:
   1. Alle elf stehen zur Auswahl.
   2. Der Regenbogen ist WIRKLICH mehrfarbig — geprueft am
      gerechneten Hintergrund: ein Farbkreis mit mehreren
      Farben, nicht eine Farbe, die wandert.
   3. Die sechs neuen bauen echte Teilchen, und die Teilchen
      haben VERSCHIEDENE Groessen und Helligkeiten („in
      verschiedenen Staerken").
   4. Nichts davon ragt aus dem Platz heraus.
   5. Hoert das Sprechen auf, ist das Feld wieder weg.
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

const TEILCHEN = ["magie", "noten", "herzen", "feuer", "strom", "blasen"];

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
  const pg = await br.newPage({ viewport: { width: 420, height: 760 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.sprechbilder, { timeout: 20000 });

  console.log("\nWAS STEHT ZUR AUSWAHL?\n");
  const liste = await pg.evaluate(() => Object.keys(window.LiveChat.sprechbilder()));
  /* GEWACHSEN, auf Ansage: „Vielleicht kannst du noch was mit Eis
     machen, dass das Bild gefriert, wenn ich spreche" und „als
     Sprech-Effekt waeren noch Blumenblaetter, als wenn der
     Profilrahmen eine Blume waere und die blueht, wenn man spricht."
     Aus elf sind damit dreizehn geworden — und mit Fassung 357
     vierzehn: „die Störung ist kein Effekt um das Profilbild zu
     beeinflussen durch einen Klick sondern es ist ein Sprechbild-
     Effekt." Geprueft wird weiter, dass „aus" dabei ist und keines
     verloren geht. */
  pruefe("es sind vierzehn Sprechbilder plus „aus“", liste.length === 15,
    liste.length + ": " + liste.join(", "));
  ["eis", "bluete", "stoerung"].forEach((n) => pruefe("„" + n + "“ ist neu dabei", liste.indexOf(n) >= 0));
  TEILCHEN.forEach((t) => pruefe("„" + t + "“ steht dabei", liste.indexOf(t) >= 0));

  /* Eine Buehne mit einem sprechenden Platz bauen. */
  await pg.evaluate(() => {
    document.getElementById("lcPruefBuehne")?.remove();
    const b = document.createElement("div");
    b.id = "lcPruefBuehne";
    b.innerHTML = '<div class="question-card livechat" id="livechatKarte">'
      + '<div class="lc-plaetze" id="lcPlaetze">'
      + '<button class="lc-platz lc-platz-belegt lc-platz-spricht" data-lc-platz="1">'
      + '<span class="lc-kreis"></span><span class="lc-platz-name">Emmi</span></button>'
      + "</div></div>";
    document.body.appendChild(b);
  });

  console.log("\nIST DER REGENBOGEN WIRKLICH BUNT?\n");
  const bogen = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "regenbogen";
    const kreis = knopf.querySelector(".lc-kreis");
    const vor = getComputedStyle(kreis, "::before");
    const nach = getComputedStyle(kreis, "::after");
    const zaehle = (t) => (String(t).match(/rgb/g) || []).length;
    return {
      vorBild: vor.backgroundImage.slice(0, 40),
      farbenVor: zaehle(vor.backgroundImage),
      farbenNach: zaehle(nach.backgroundImage),
      schein: nach.filter
    };
  });
  pruefe("der Ring ist ein Farbkreis, kein einzelner Farbton",
    /conic-gradient/.test(bogen.vorBild), bogen.vorBild);
  pruefe("er zeigt viele Farben GLEICHZEITIG", bogen.farbenVor >= 8,
    bogen.farbenVor + " Farben im Ring");
  pruefe("und strahlt weich nach aussen", /blur/.test(bogen.schein || ""),
    bogen.schein || "kein Schein");

  console.log("\nDIE TEILCHEN\n");
  for (const art of TEILCHEN) {
    const d = await pg.evaluate((a) => {
      const knopf = document.querySelector(".lc-platz");
      knopf.dataset.sprechbild = a;
      window.DMA_PRUEFUNG.sprechFeld(knopf, a);
      const feld = knopf.querySelector(".lc-sprechfeld");
      if (!feld) return { da: false };
      const teile = [...feld.querySelectorAll(".lc-teilchen")];
      const gross = new Set(teile.map((t) => t.style.getPropertyValue("--gross")));
      const hell = new Set(teile.map((t) => t.style.getPropertyValue("--hell")));
      const takt = new Set(teile.map((t) => t.style.animationDuration));
      const kreis = knopf.querySelector(".lc-kreis").getBoundingClientRect();
      const fr = feld.getBoundingClientRect();
      const laeuft = teile.filter((t) => getComputedStyle(t).animationName !== "none").length;
      return { da: true, menge: teile.length, gross: gross.size, hell: hell.size,
        takt: takt.size, laeuft: laeuft,
        ueber: Math.round(fr.width - kreis.width) };
    }, art);
    pruefe(art + " baut Teilchen", d.da && d.menge >= 8, d.da ? d.menge + " Stueck" : "keins");
    pruefe(art + " — jedes mit eigener Staerke und eigenem Takt",
      d.gross >= 5 && d.hell >= 5 && d.takt >= 5,
      "Groessen " + d.gross + ", Helligkeiten " + d.hell + ", Takte " + d.takt);
    pruefe(art + " — alle Teilchen bewegen sich", d.laeuft === d.menge,
      d.laeuft + " von " + d.menge);
    pruefe(art + " bleibt beim Profilbild", d.ueber <= 40,
      d.ueber + " px groesser als das Bild");
  }

  console.log("\nUND WENN DAS SPRECHEN AUFHOERT?\n");
  const weg = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    window.DMA_PRUEFUNG.sprechFeldWeg(knopf);
    return !knopf.querySelector(".lc-sprechfeld");
  });
  pruefe("das Feld ist wieder weg", weg);

  console.log("\nBLEIBT DIE WAHL AM PROFIL?\n");
  const gemerkt = await pg.evaluate(() => {
    window.LiveChat.sprechbildSetzen ? window.LiveChat.sprechbildSetzen("magie") : null;
    try { window.LiveChat.pruefBefehl("/sprechbild magie"); } catch (e) {}
    return { wahl: window.LiveChat.sprechbild(),
             imProfil: window.DMA_EINST ? window.DMA_EINST.holen("sprechbild", "") : "kein Fach" };
  });
  pruefe("die Wahl steht", gemerkt.wahl === "magie", gemerkt.wahl);
  pruefe("und liegt in der Profil-Ablage", gemerkt.imProfil === "magie", String(gemerkt.imProfil));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Vierzehn Sprechbilder, jedes mit eigenem Leben.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
