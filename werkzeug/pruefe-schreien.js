/* PRÜFT DAS SCHREIEN.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Wenn man schreit, dann sollen die Buchstaben der
   ausgewählten Schriftart sein. Wenn es bunt eingestellt ist, sollen
   die Buchstaben durcheinander bunt sein, so wie das vorher auch war.
   Und wenn die Animation kommt, soll es auch den Chat ein bisschen
   beeinflussen … und vielleicht ein Sound-Effekt, der neutral dazu
   passt, egal was man schreit."

   Vier Messungen, keine Meinung:
     1. Nimmt der Ruf die eingestellte SCHRIFTART an?
     2. Sind bei „bunt" wirklich die BUCHSTABEN einzeln gefärbt —
        und zwar mit mehr als einer Farbe je Wort?
     3. Bekommt der Chatraum den Stoss (Klasse + laufende Animation)?
     4. Liegt der Ton da und ist er kurz genug? */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
              ".json":"application/json", ".png":"image/png", ".opus":"audio/ogg", ".m4a":"audio/mp4" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 520, height: 800 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2200);

  const erg = await pg.evaluate(async () => {
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const karte = document.createElement("div");
    karte.id = "livechatKarte";
    karte.innerHTML = '<div class="lc-chat-verlauf" id="pruefVerlauf"></div>';
    karte.style.cssText = "position:fixed;left:0;top:0;width:500px;background:#222;z-index:99999";
    document.body.appendChild(karte);
    const v = karte.querySelector("#pruefVerlauf");

    const bauen = (schrift, farbe) => {
      v.dataset.schrift = schrift;
      v.innerHTML = "";
      const z = document.createElement("div");
      z.className = "lc-zeile lc-zeile-ruf";
      const t = document.createElement("span");
      t.className = "lc-zeilentext";
      window.__rufSetzen(t, "HALLO LEUTE", { farbe: farbe, name: "Alex" });
      z.appendChild(t);
      v.appendChild(z);
      const woerter = [...t.querySelectorAll(".lc-ruf-wort")];
      return {
        schrift,
        farbe: farbe || "(keine)",
        schriftart: woerter[0] ? getComputedStyle(woerter[0]).fontFamily.split(",")[0].replace(/"/g, "") : "",
        woerter: woerter.map((w) => ({
          wort: w.dataset.wort,
          buchstaben: [...w.children].length,
          farben: [...w.children].map((c) => getComputedStyle(c).color)
            .filter((f, i, a) => a.indexOf(f) === i)
        }))
      };
    };

    const ohneBunt = bauen("1", "");
    const mitBunt = bauen("1", "bunt");
    const buntSchreib = bauen("2", "bunt");

    /* Der Stoss. */
    window.__schallStoss();
    await new Promise((r) => setTimeout(r, 120));
    const stoss = {
      klasse: karte.classList.contains("lc-schallt"),
      animation: getComputedStyle(karte).animationName,
      welle: getComputedStyle(karte, "::after").animationName
    };
    await new Promise((r) => setTimeout(r, 2200));
    const danach = karte.classList.contains("lc-schallt");

    /* Der Ton — liegt er da und wie lang ist er? */
    /* Der Ton. Zum Vergleich ein LAENGST vorhandener daneben: meldet
       der auch „Infinity", liegt es am Pruefserver (er kann keine
       Bereichsanfragen) und nicht an der neuen Datei. */
    const messen = (pfad) => new Promise((r) => {
      const a = new Audio(pfad);
      a.addEventListener("loadedmetadata", () => r(a.duration));
      a.addEventListener("error", () => r(-1));
      setTimeout(() => r(-2), 4000);
    });
    const dauer = await messen("ton/schrei.opus");
    const alterTon = await messen("ton/konfetti.opus");
    /* Und der echte Beweis, dass sie spielt: wirklich abspielen und
       schauen, ob die Zeit laeuft. */
    const spielt = await new Promise((r) => {
      const a = new Audio("ton/schrei.opus");
      a.volume = 0;
      a.play().then(() => setTimeout(() => { const t = a.currentTime; a.pause(); r(t); }, 700))
        .catch(() => r(-1));
    });

    return { ohneBunt, mitBunt, buntSchreib, stoss, danach,
             tonDauer: dauer, alterTon: alterTon, tonLaeuft: Math.round(spielt * 100) / 100 };
  });

  const zeig = (e) => {
    console.log("  Schrift " + e.schrift + ", Farbe " + e.farbe + "  →  gerendert mit „" + e.schriftart + "“");
    e.woerter.forEach((w) => console.log("    „" + w.wort + "“: " + w.buchstaben
      + " Buchstabenkästchen, " + w.farben.length + " verschiedene Farben"));
  };
  console.log("=== Ohne bunt ==="); zeig(erg.ohneBunt);
  console.log("=== Mit bunt ===");  zeig(erg.mitBunt);
  console.log("=== Mit bunt, Schreibmaschine ==="); zeig(erg.buntSchreib);
  console.log("\n=== Der Stoss durch den Raum ===");
  console.log("  Klasse gesetzt: " + erg.stoss.klasse + "   Animation: " + erg.stoss.animation
    + "   Welle: " + erg.stoss.welle);
  console.log("  nach 2,3 s wieder weg: " + (!erg.danach));
  console.log("\n=== Der Ton ===");
  console.log("  ton/schrei.opus   Dauer laut Browser: " + erg.tonDauer);
  console.log("  ton/konfetti.opus Dauer laut Browser: " + erg.alterTon + "   (Vergleich)");
  console.log("  wirklich abgespielt nach 0,7 s: " + erg.tonLaeuft + " Sekunden");

  const buntOk = erg.mitBunt.woerter.every((w) => w.buchstaben > 1 && w.farben.length > 1);
  const schlichtOk = erg.ohneBunt.woerter.every((w) => w.buchstaben === 0);
  const schriftOk = erg.buntSchreib.schriftart !== erg.mitBunt.schriftart;
  const ok = buntOk && schlichtOk && schriftOk
    && erg.stoss.klasse && erg.stoss.animation === "lcSchallStoss" && !erg.danach
    && erg.tonLaeuft > 0.3;
  console.log(ok ? "\n✅ Buchstaben einzeln bunt, Schriftart folgt, Stoss läuft und vergeht, Ton liegt da."
                 : "\n❌ Etwas stimmt noch nicht.");
  await br.close(); srv.close();
})();
