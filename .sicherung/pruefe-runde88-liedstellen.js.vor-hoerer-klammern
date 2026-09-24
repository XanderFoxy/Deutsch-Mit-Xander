/* =====================================================================
   SONDE RUNDE 88 — DIE SONGABSCHNITTE
   ---------------------------------------------------------------------
   XANDER hat die Zeiten selbst diktiert:
     „125-167 ist die Zeitmarke fuer [A Lovers] Fairytale."
     „Fuer Nah habe ich 45 Sekunden bis 1 Minute 19."
     „Fuer Ein Leben lang habe ich 1 Minute 18 bis 1 Minute 53."
     „Fuer Du habe ich 52 Sekunden bis 1 Minute 32."
   Und dazu: „Man soll die Moeglichkeit haben, einen Teilbereich des
   Liedes festzusetzen und zu benennen wie einen Button, den man dann
   daraus generiert … die Songabschnitte, die ich festlege … sollen fuer
   alle hoerbar werden … und wenn man so ein Lied aufsetzt, soll man
   auch wieder zurueckkommen aus dem Mini in die Uebersicht fuer die
   anderen Lieder."

   HIER WIRD NACHGERECHNET, NICHT NACHGELESEN. Eine Zeitmarke, die um
   eine Sekunde danebenliegt, faellt beim Hoeren auf und in keiner
   Beschreibung. Deshalb pruefen die ersten Regeln die SEKUNDEN gegen
   das, was er gesagt hat — Minute mal sechzig plus Sekunde.
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
/* Was er gesagt hat, in Sekunden — einmal ausgerechnet und hier
   hingeschrieben, damit die Rechnung nachlesbar ist. */
const GESAGT = [
  { datei: "One Day In Rome - A Lovers Fairytale.mp3", name: "Letzter Refrain",
    ab: 125, bis: 167, wort: "125 bis 167 Sekunden (2:05–2:47)" },
  { datei: "Nah (2011).mp3", name: "Refrain",
    ab: 45, bis: 79, wort: "45 s bis 1:19 = 45–79" },
  { datei: "One Day In Rome - Ein Leben Lang.mp3", name: "Refrain",
    ab: 78, bis: 113, wort: "1:18 bis 1:53 = 78–113" },
  { datei: "Du.mp3", name: "Refrain",
    ab: 52, bis: 92, wort: "52 s bis 1:32 = 52–92" },
];

(async () => {
  console.log("RUNDE 88 — die Songabschnitte\n");
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
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_LIEDSTELLEN && window.DMA_PRUEF
    && window.DMA_PRUEF.musikWaehler, { timeout: 20000 });

  console.log("DIE ZEITEN, DIE ER GENANNT HAT\n");
  const gelesen = await pg.evaluate(() => window.DMA_LIEDSTELLEN);
  GESAGT.forEach((g) => {
    const liste = gelesen[g.datei] || [];
    const st = liste.find((x) => x.name === g.name);
    sage(Boolean(st) && st.ab === g.ab && st.bis === g.bis,
      g.datei.replace(/\.mp3$/, "") + " — " + g.name,
      st ? (st.ab + "–" + st.bis + " Sekunden, verlangt " + g.wort)
         : "kein Abschnitt „" + g.name + "“");
  });
  sage(Object.keys(gelesen).length === 6,
    "jedes Lied im Ordner hat mindestens einen Abschnitt",
    Object.keys(gelesen).length + " Lieder");
  sage((gelesen["One Day In Rome - A Lovers Fairytale.mp3"] || [])[0].name === "Letzter Refrain",
    "bei Fairytale heisst der Abschnitt „Letzter Refrain“ — „als Letzteren“");

  console.log("\nDAS MENÜ: ABSCHNITTE ALS KNÖPFE\n");
  const menue = await pg.evaluate(() => {
    document.getElementById("lcPruefBuehne")?.remove();
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEF.musikWaehler("");          // Musik fuer alle
    const kasten = document.getElementById("lcPlatzMenue");
    if (!kasten) return { fehlt: true };
    const lieder = [...kasten.querySelectorAll(".lc-lese-liste .lc-lese-text")];
    const nr = lieder.findIndex((b) => /Ein Leben lang/.test(b.textContent));
    if (nr < 0) return { fehlt: true, grund: "Lied nicht in der Liste" };
    lieder[nr].click();
    const zwei = document.getElementById("lcPlatzMenue");
    if (!zwei) return { fehlt: true, grund: "zweite Stufe fehlt" };
    return {
      kopf: (zwei.querySelector(".lc-platzmenue-kopf") || {}).textContent || "",
      zurueck: Boolean(zwei.querySelector(".lc-lied-zurueck")),
      ganz: [...zwei.querySelectorAll(".lc-lese-text")]
        .some((b) => /Ganzes Lied/.test(b.textContent)),
      stellen: [...zwei.querySelectorAll(".lc-lied-stelle")].map((b) => ({
        text: b.textContent.replace(/\s+/g, " ").trim(),
        zeit: (b.querySelector(".lc-lied-zeit") || {}).textContent || "" })),
      felder: Boolean(zwei.querySelector(".lc-ausschnitt-ab"))
        && Boolean(zwei.querySelector(".lc-stelle-name")),
      merken: Boolean(zwei.querySelector(".lc-stelle-merken")),
      losWort: ([...zwei.querySelectorAll(".lc-ausschnitt-los")][0] || {}).textContent || "",
    };
  });
  if (menue.fehlt) sage(false, "das Menü ging nicht auf", menue.grund || "");
  else {
    sage(/Ein Leben lang/.test(menue.kopf) && /welcher Teil/.test(menue.kopf),
      "der Kopf fragt nach dem TEIL des Liedes", menue.kopf);
    sage(menue.zurueck,
      "es gibt den Weg zurück zu den Liedern — „aus dem Mini in die Übersicht“");
    sage(menue.ganz, "das ganze Lied bleibt wählbar");
    sage(menue.stellen.length === 1 && /Refrain/.test(menue.stellen[0].text),
      "der Abschnitt steht als eigener Knopf da",
      menue.stellen.map((s) => s.text).join(" | "));
    sage(menue.stellen.length === 1 && menue.stellen[0].zeit === "1:18–1:53",
      "und trägt seine Zeit als Minuten, nicht als Sekunden",
      menue.stellen[0] ? menue.stellen[0].zeit : "-");
    sage(menue.felder && menue.merken,
      "darunter zwei Zeitfelder, ein Namensfeld und „Merken und benennen“");
    sage(/für alle/.test(menue.losWort),
      "ohne Namen heißt der Knopf „für alle“ — der Abschnitt gilt allen",
      menue.losWort.trim());
  }

  console.log("\nEIN EIGENER ABSCHNITT WIRD ZUM KNOPF\n");
  const gemerkt = await pg.evaluate(() => {
    const zwei = document.getElementById("lcPlatzMenue");
    zwei.querySelector(".lc-ausschnitt-ab").value = "0:30";
    zwei.querySelector(".lc-ausschnitt-bis").value = "0:44";
    zwei.querySelector(".lc-stelle-name").value = "Bridge";
    zwei.querySelector(".lc-stelle-merken").click();
    const drei = document.getElementById("lcPlatzMenue");
    return {
      stellen: [...drei.querySelectorAll(".lc-lied-stelle")].map(
        (b) => b.textContent.replace(/\s+/g, " ").trim()),
      gespeichert: JSON.parse(localStorage.getItem("dma_liedstellen") || "{}"),
    };
  });
  sage(gemerkt.stellen.length === 2 && gemerkt.stellen.some((t) => /Bridge/.test(t)),
    "der neue Abschnitt steht sofort als Knopf da",
    gemerkt.stellen.join(" | "));
  const b = (gemerkt.gespeichert["One Day In Rome - Ein Leben Lang.mp3"] || [])
    .find((x) => x.name === "Bridge");
  sage(Boolean(b) && b.ab === 30 && b.bis === 44,
    "und er bleibt gespeichert — „so lange gespeichert bleiben mit dem Profil“",
    b ? (b.ab + "–" + b.bis + " Sekunden") : "nichts gespeichert");
  sage(gemerkt.stellen[0] && /0:30/.test(gemerkt.stellen[0]),
    "die Abschnitte stehen nach ihrer Zeit sortiert",
    gemerkt.stellen.join(" | "));

  console.log("\n„MUSIK FÜR ALLE“ NIMMT DIE ZEIT AN\n");
  const befehl = await pg.evaluate(() => {
    const raus = [];
    const alt = LiveChat.schreiben;
    /* Nicht wirklich in den Raum schicken — nur mitlesen, was ginge. */
    return (async () => {
      const probe = (zeile) => {
        raus.push(zeile);
      };
      LiveChat.schreiben = probe;
      const zwei = document.getElementById("lcPlatzMenue");
      [...zwei.querySelectorAll(".lc-lied-stelle")]
        .find((x) => /Refrain/.test(x.textContent)).click();
      LiveChat.schreiben = alt;
      return raus;
    })();
  });
  sage(befehl.length === 1 && /^\/musik \d+ 1:18-1:53$/.test(befehl[0]),
    "ein Tipp auf den Abschnitt schickt „/musik N 1:18-1:53“",
    befehl.join(" | ") || "nichts geschickt");

  console.log("\nUND DER BEFEHL VERSTEHT DIE ZEIT\n");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/liedAb: stueckM \? stueckM\.ab : 0/.test(lc),
    "„/musik 3 1:18-1:53“ schickt Anfang und Ende mit");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/Number\(\(nachricht && nachricht\.liedBis\) \|\| 0\)/.test(js),
    "und der Empfänger liest beides");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
    : "\nDeine Zeiten stehen auf die Sekunde — und jeder Abschnitt ist ein Knopf.\n");
  process.exit(fehler ? 1 : 0);
})();
