/* PRÜFT: MERKT DIE SEITE, DASS SIE ALT IST?
   ---------------------------------------------------------------
   GEMELDET: „Bei Emmi gibt es diesen Umschalter nicht zwischen den
   zwei Plätzen und dem Klassenzimmer."

   Der Knopf ist im Gerüst — für jede Person, ohne Bedingung (das
   misst werkzeug/pruefe-bild-fluestern.js gleich mit). Fehlen kann er
   nur, wenn das Gerät noch eine ältere index.html im Zwischenspeicher
   hat. Alle Stilblätter und Programmdateien hängen an DMA_VERSION und
   bleiben deshalb frisch — die index.html selbst TRÄGT diese Nummer
   und kann sich nicht selbst erneuern.

   Hier wird genau dieser Fall nachgestellt: Die Seite läuft mit einer
   Nummer, und der Server liefert auf Nachfrage eine höhere. Gemessen
   wird, ob die Leiste kommt und ob ihr Knopf wirklich neu lädt. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css" };

const HIER = Number((/DMA_VERSION = "(\d+)"/.exec(
  fs.readFileSync(path.join(WURZEL, "index.html"), "utf8")) || [])[1] || 0);

(async () => {
  let frischGefragt = 0;
  const srv = http.createServer((q, a) => {
    const adresse = q.url.split("?")[0];
    const anhang = q.url.slice(adresse.length);
    let p = decodeURIComponent(adresse); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    /* Die Nachfrage der Seite („index.html?frisch=…") bekommt eine
       HÖHERE Nummer — so sieht es aus, wenn im Netz eine neuere
       Fassung liegt und das Gerät noch die alte zeigt. */
    if (/index\.html$/.test(p) && /frisch=/.test(anhang)) {
      frischGefragt += 1;
      const roh = fs.readFileSync(f, "utf8")
        .replace(/DMA_VERSION = "\d+"/, 'DMA_VERSION = "' + (HIER + 7) + '"');
      a.writeHead(200, { "Content-Type": "text/html" });
      return a.end(roh);
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 800 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  console.log("\n  DIE SEITE LÄUFT MIT " + HIER + ", IM NETZ LIEGT " + (HIER + 7));
  /* Vor der Nachfrage darf nichts dastehen. */
  const vorher = await pg.$("#dmaNeueFassung");
  ok(!vorher, "vor der Nachfrage steht keine Leiste da");

  /* Die Nachfrage kommt von selbst nach zwölf Sekunden — so lange
     wartet hier niemand. Sie wird deshalb angestossen, wie es der
     Wechsel in den Vordergrund auch tut. */
  await pg.evaluate(() => { document.dispatchEvent(new Event("visibilitychange")); });
  await pg.waitForTimeout(1200);

  const leiste = await pg.evaluate(() => {
    const b = document.getElementById("dmaNeueFassung");
    if (!b) return null;
    const s = getComputedStyle(b), r = b.getBoundingClientRect();
    return { text: b.querySelector(".dma-neuestand-text")?.textContent.replace(/\s+/g, " ").trim() || "",
             knopf: Boolean(b.querySelector("#dmaNeueFassungLaden")),
             zu: Boolean(b.querySelector("#dmaNeueFassungZu")),
             sichtbar: s.display !== "none" && r.width > 100 && r.height > 20,
             breite: Math.round(r.width), hoehe: Math.round(r.height),
             unten: Math.round(window.innerHeight - r.bottom) };
  });
  ok(Boolean(leiste), "die Leiste kommt");
  if (leiste) {
    ok(leiste.sichtbar, "und sie ist wirklich zu sehen", leiste.breite + "×" + leiste.hoehe + " Pixel, "
      + leiste.unten + " px über dem unteren Rand");
    ok(leiste.text.indexOf(String(HIER + 7)) >= 0 && leiste.text.indexOf(String(HIER)) >= 0,
       "sie nennt beide Nummern", "„" + leiste.text.slice(0, 96) + "…“");
    ok(leiste.knopf && leiste.zu, "mit einem Knopf zum Laden und einem zum Wegklicken");
  }
  ok(frischGefragt >= 1, "gefragt wurde am Zwischenspeicher vorbei", frischGefragt + "× nachgefragt");

  /* Und der Knopf muss wirklich neu laden — mit einer neuen Adresse,
     sonst gäbe der Browser dieselbe alte Datei noch einmer heraus. */
  if (leiste && leiste.knopf) {
    /* RUNDE 75 — GEMESSEN WIRD DIE FAHRT, NICHT DAS ZIEL.
       -----------------------------------------------------------------
       Hier stand vorher `pg.url()` NACH dem Klick, und das ging nicht
       auf. Der Grund liegt an dieser Sonde selbst und nicht an der
       Seite: sie gibt auf „index.html?frisch=…" eine HÖHERE
       Fassungsnummer heraus (HIER + 7), „fassung.json" behält aber die
       alte. Die frisch geladene Seite vergleicht beide — das ist der
       Wächter ganz oben in index.html — findet sie verschieden und
       holt sich pflichtgemäss „?f=<fassung.json>". Damit ist „frisch"
       wieder aus der Adresse verschwunden, BEVOR hier nachgesehen
       wurde. Im Netz kann das nicht passieren: dort werden index.html
       und fassung.json zusammen hochgezählt.
       Nachgesehen wird deshalb, womit der Knopf die Seite WIRKLICH
       angefordert hat. */
    const geholt = [];
    pg.on("request", (r) => {
      if (r.resourceType() === "document") geholt.push(r.url());
    });
    await Promise.all([
      pg.waitForNavigation({ timeout: 8000 }).catch(() => null),
      pg.click("#dmaNeueFassungLaden")
    ]);
    await pg.waitForTimeout(600);
    const mitFrisch = geholt.filter((u) => /frisch=\d+/.test(u));
    ok(mitFrisch.length >= 1, "der Knopf lädt mit einer frischen Adresse neu",
       (mitFrisch[0] || geholt[0] || "gar nichts geholt").replace(/^http:\/\/[^/]+/, ""));
  }

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Eine alte Seite merkt jetzt, dass sie alt ist.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
