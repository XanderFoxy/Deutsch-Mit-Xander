/* =====================================================================
   SONDE RUNDE 88 — DER SPIELFUEHRER WERTET AUS
   ---------------------------------------------------------------------
   XANDER: „koennen wir sogar ein Stadt Land Fluss einbauen, was wir
   realistisch jeder fuer uns ausfuellen koennen und dann wenn die Zeit
   um ist beenden koennen mit einer realistischen Auswertung, so dass
   die Ergebnisse beim Spielfuehrer immer vorliegen und er dann
   entscheiden kann, ob die Woerter Sinn machen, ob wir die verwenden
   koennen, wo der Lehrer aber auch immer noch Mit-Entscheidungsrecht
   hat, wenn es zu der Auswertung kommt — ja also derjenige, der das
   auswertet, ist ja der Spielfuehrer an sich, der auch am Anfang den
   Buchstaben bestimmt."

   WAS EINE ECHTE AUSWERTUNG AUSMACHT. Am Kuechentisch ist ein
   gestrichenes Wort nicht einfach nur null Punkte fuer den, der es
   geschrieben hat. Es ist fuer die ganze SPALTE nicht vorhanden.
   Steht danach nur noch ein einziges Wort in der Spalte, bekommt
   dessen Schreiber die 20 Punkte, die ihm zustehen — vorher waren es
   nur 10, weil ja ein zweiter „auch etwas" hatte. Genau daran
   entscheidet sich, ob das hier eine Auswertung ist oder nur ein
   graues Kaestchen.

   WAS HIER GEMESSEN WIRD, und zwar an der laufenden Seite:
     1  Ein Strich setzt die Zelle auf null.
     2  Derselbe Strich hebt den letzten Verbliebenen von 10 auf 20.
     3  Der Gesamtstand ueber mehrere Runden zieht mit und zaehlt die
        Runde nicht doppelt.
     4  Ein zweiter Druck nimmt den Strich zurueck — alles wie vorher.
     5  Wer nicht Spielfuehrer ist, sieht keinen einzigen Knopf,
        aber sehr wohl den Strich.
     6  Ein fremdes Urteil (vom Lehrer, aus dem Netz) kommt an, und
        das juengere gewinnt.
   Gedrueckt wird dabei das ECHTE slfUrteilen, nicht ein Nachbau.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

/* Drei Zettel, absichtlich so gebaut, dass jeder Fall einmal vorkommt.
   Buchstabe B.
     stadt  — Berlin / Berlin / Bonn      (zweimal dasselbe, einmal allein)
     land   — Belgien / Bolivien / —      (zwei eigene, einer leer)
     fluss  — Bodensee / — / —            (nur einer hat etwas: 20) */
const BLAETTER = [
  { name: "Alex", blatt: { stadt: "Berlin", land: "Belgien", fluss: "Bodensee" } },
  { name: "Bea",  blatt: { stadt: "Berlin", land: "Bolivien", fluss: "" } },
  { name: "Cem",  blatt: { stadt: "Bonn",   land: "",         fluss: "" } },
];

(async () => {
  console.log("RUNDE 88 — Stadt · Land · Fluss: der Spielfuehrer entscheidet mit\n");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.slfProbeStellen,
    { timeout: 20000 });

  const stellen = (gast) => pg.evaluate(
    ([b, g]) => window.DMA_PRUEF.slfProbeStellen({ buchstabe: "b", blaetter: b, gast: g }),
    [BLAETTER, Boolean(gast)]);
  const druecken = (k) => pg.evaluate((s) => window.DMA_PRUEF.slfProbeUrteilen(s), k);
  const knoepfe = (html) => (html.match(/data-slf-urteil="/g) || []).length;
  const zelle = (html, wort) => {
    /* Die <td>, in der dieses Wort steht — samt ihrer Klassen. */
    const re = new RegExp('<td class="([^"]*)"[^>]*>\\s*<span class="slf-zellwort">' + wort + '<', "i");
    const m = html.match(re);
    return m ? m[1] : null;
  };

  console.log("DIE RUNDE, BEVOR JEMAND STREICHT\n");
  const a0 = await stellen(false);
  sage(a0.punkte.join(",") === "35,15,10",
    "gezaehlt wird wie am Kuechentisch",
    "Alex 5+10+20=35, Bea 5+10+0=15, Cem 10+0+0=10 — gemessen " + a0.punkte.join("/"));
  sage(a0.gruende[0].join("|") === "gleiches Wort|gleiches Wort|eigenes Wort",
    "zweimal Berlin ist fuer beide nur 5 wert, Bonn steht fuer sich",
    a0.gruende[0].join(" / "));
  sage(a0.gruende[2][0] === "nur du",
    "der Bodensee bringt 20, weil ihn sonst keiner hatte", a0.gruende[2][0]);

  console.log("\nDER SPIELFUEHRER STREICHT „Bonn\"\n");
  /* Cems Bonn faellt weg. Danach steht in der Spalte Stadt nur noch
     zweimal Berlin — daran darf sich fuer Alex und Bea NICHTS aendern. */
  const a1 = await druecken("stadt|2");
  sage(a1.punkte[2] === a0.punkte[2] - 10,
    "Cem verliert genau die 10 Punkte fuer Bonn",
    a0.punkte[2] + " → " + a1.punkte[2]);
  sage(a1.punkte[0] === a0.punkte[0] && a1.punkte[1] === a0.punkte[1],
    "Alex und Bea bleiben unberuehrt — sie hatten ja beide Berlin",
    a1.punkte.join("/"));
  sage(/slf-zelle-raus/.test(String(zelle(a1.html, "bonn"))),
    "die Zelle ist als gestrichen gezeichnet", String(zelle(a1.html, "bonn")));
  sage(/>bonn</i.test(a1.html),
    "das Wort steht weiter da — durchgestrichen, nicht geloescht");

  console.log("\nDER STRICH, DER DIE ANDEREN ANHEBT\n");
  /* Jetzt Beas Bolivien. In der Spalte Land bleibt nur noch Alex'
     Belgien uebrig — und das ist dann 20 wert statt 10. */
  const a2 = await druecken("land|1");
  sage(a2.punkte[1] === a1.punkte[1] - 10,
    "Bea verliert die 10 fuer Bolivien", a1.punkte[1] + " → " + a2.punkte[1]);
  sage(a2.punkte[0] === a1.punkte[0] + 10,
    "und Alex STEIGT von 10 auf 20 — er ist der Einzige mit einem Land",
    a1.punkte[0] + " → " + a2.punkte[0]);
  sage(a2.gruende[1][0] === "nur du",
    "die Begruendung sagt es auch so", a2.gruende[1][0]);

  console.log("\nDER GESAMTSTAND ZAEHLT NICHT DOPPELT\n");
  sage(a2.gesamt.Alex === a2.punkte[0] && a2.gesamt.Bea === a2.punkte[1]
       && a2.gesamt.Cem === a2.punkte[2],
    "nach zwei Strichen steht im Gesamtstand genau die Rundenpunktzahl",
    JSON.stringify(a2.gesamt) + " gegen " + a2.punkte.join("/"));

  console.log("\nZURUECKNEHMEN\n");
  const a3 = await druecken("land|1");
  const a4 = await druecken("stadt|2");
  sage(a4.punkte.join(",") === a0.punkte.join(","),
    "beide Striche zurueckgenommen — die Runde steht wieder wie am Anfang",
    a0.punkte.join("/") + " → " + a4.punkte.join("/"));
  sage(a4.gesamt.Alex === a0.gesamt.Alex && a4.gesamt.Bea === a0.gesamt.Bea
       && a4.gesamt.Cem === a0.gesamt.Cem,
    "und der Gesamtstand ebenso", JSON.stringify(a4.gesamt));
  sage(!/slf-zelle-raus/.test(a4.html), "kein durchgestrichenes Wort mehr da");
  void a3;

  console.log("\nWER DARF DRUECKEN\n");
  sage(knoepfe(a0.html) === 6,
    "der Spielfuehrer sieht an jedem geschriebenen Wort einen Knopf",
    knoepfe(a0.html) + " Knoepfe bei 6 ausgefuellten Zellen");
  const g0 = await stellen(true);
  sage(knoepfe(g0.html) === 0,
    "ein Gast sieht keinen einzigen Knopf", knoepfe(g0.html) + " Knoepfe");
  sage(/entscheidet, ob ein Wort gilt/.test(g0.html),
    "dafuer steht da, wer entscheidet");
  const g1 = await pg.evaluate(() =>
    window.DMA_PRUEF.slfProbeUrteilen("stadt|2"));
  sage(g1.punkte.join(",") === g0.punkte.join(","),
    "und ein Gast, der es trotzdem versucht, aendert nichts",
    g0.punkte.join("/") + " → " + g1.punkte.join("/"));

  console.log("\nDAS URTEIL DES SPIELFUEHRERS ERREICHT DEN GAST\n");
  const f1 = await pg.evaluate(() =>
    window.DMA_PRUEF.slfProbeFremdesUrteil({ "stadt|2": { raus: true, n: 1 } }));
  sage(f1.anders && f1.punkte[2] === g0.punkte[2] - 10,
    "kommt der Strich aus dem Netz, gilt er auch beim Gast",
    g0.punkte[2] + " → " + f1.punkte[2]);
  sage(/slf-zelle-raus/.test(String(zelle(f1.html, "bonn"))),
    "und er sieht ihn durchgestrichen");
  const f2 = await pg.evaluate(() =>
    window.DMA_PRUEF.slfProbeFremdesUrteil({ "stadt|2": { raus: false, n: 0 } }));
  sage(!f2.anders && f2.punkte[2] === f1.punkte[2],
    "ein AELTERES Urteil (kleineres n) wird nicht angenommen",
    "n=0 gegen n=1 — Punkte bleiben " + f2.punkte[2]);
  const f3 = await pg.evaluate(() =>
    window.DMA_PRUEF.slfProbeFremdesUrteil({ "stadt|2": { raus: false, n: 2 } }));
  sage(f3.anders && f3.punkte[2] === g0.punkte[2],
    "ein JUENGERES nimmt den Strich wieder zurueck",
    f1.punkte[2] + " → " + f3.punkte[2]);

  await pg.evaluate(() => window.DMA_PRUEF.slfProbeAufraeumen());

  console.log("\nDIE VERDRAHTUNG IN DER DATEI\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/area\.querySelectorAll\("\[data-slf-urteil\]"\)\.forEach\(\(b\) =>\s*\n?\s*b\.addEventListener\("click", \(\) => slfUrteilen\(b\.dataset\.slfUrteil\)\)\);/.test(js),
    "der Knopf in der Tabelle haengt am echten slfUrteilen");
  sage(/urteile: slfUrteile/.test(js) && /urteile: \{\},/.test(js),
    "die Urteile reisen mit in den Raum und werden je Runde geleert");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  sage(/\.slf-zelle-raus \.slf-zellwort \{[^}]*line-through/.test(css),
    "und ein gestrichenes Wort ist wirklich durchgestrichen");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
    : "\nEin Strich nimmt Punkte weg UND gibt welche zurueck — das ist eine Auswertung.\n");
  process.exit(fehler ? 1 : 0);
})();
