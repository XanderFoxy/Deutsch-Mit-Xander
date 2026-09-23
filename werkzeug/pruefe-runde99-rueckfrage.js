/* =====================================================================
   SONDE RUNDE 99 — DAS WALKIE-TALKIE
   ---------------------------------------------------------------------
   XANDER: „dass ich praktisch immer wieder ein Pop-up bekomme, in dem
   Moment, wenn du etwas brauchst … ja oder nein … und dann Auswahl-
   Antworten … multiple Sachen."
   UMBAU: „die Karte verdeckt die Schaltfläche vom Klassenzimmer …
   wie ein Club-Menü an der Seite … zweimal Später gedrückt, und die
   Fragen waren weg … das Walkie-Talkie muss wieder auftauchen."
   Gemessen mit einer nachgebauten Datenbank (keine echte Anfrage),
   einmal auf Telefonbreite (412 px) und einmal am Rechner:
     1. Wer NICHT Betreiber ist, sieht nichts.
     2. Zugeklappt ist nur ein kleiner Reiter am linken Rand da —
        unten links (wo die alte Karte lag) und in der Mitte ist frei.
     3. Aufgeklappt: Frage, Thema, „Wo testen", die drei Stufen und
        die Haekchen stehen gleichzeitig da (kein „Nein" mehr).
     4. „Später" blaettert nur — beide Fragen bleiben offen.
     5. Haekchen und Offen-Zustand ueberleben das Neuladen.
     6. „Senden" schreibt Stufe, Haekchen und Notiz zurueck.
     7. Ein Vorschlag an Claude kommt in betreiber_funk an.
     8. Claudes Statusmeldung steht oben.
     9. Ein Klick in die Leiste greift nicht dahinter durch.
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
(async () => {
  console.log("RUNDE 99 — das Walkie-Talkie\n");
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
  const pg = await br.newPage({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  /* Eine nachgebaute Spracherkennung: sie „hoert" erst einen
     Zwischenstand, dann den fertigen Satz, und endet — wie Chrome auf
     Android bei continuous = false. */
  await pg.addInitScript(() => {
    window.__rfRunden = 0;
    /* DRITTER ANLAUF: Dauer-Erkennung wie auf Android — die Ergebnisse
       wachsen an (alle bisherigen Saetze stehen jedes Mal mit drin),
       erst ein Zwischenstand, dann zwei fertige Saetze. */
    window.webkitSpeechRecognition = class {
      start() {
        window.__rfRunden++;
        const r = (t, fertig) => Object.assign([{ transcript: t }], { isFinal: fertig });
        setTimeout(() => this.onresult && this.onresult({ resultIndex: 0, results: [r("bist du", false)] }), 30);
        setTimeout(() => {
          window.__rfZwischen = (document.querySelector(".rf-vorschlag .rf-live") || {}).textContent || "";
          this.onresult && this.onresult({ resultIndex: 0, results: [r("bist du hier", true)] });
        }, 120);
        setTimeout(() => this.onresult && this.onresult({ resultIndex: 1,
          results: [r("bist du hier", true), r("und noch was", true)] }), 200);
        this._ende = setTimeout(() => this.onend && this.onend(), 5000);
      }
      stop() { clearTimeout(this._ende); setTimeout(() => this.onend && this.onend(), 10); }
    };
    /* Neuere Chromes haben sie auch ohne Vorsilbe — beide ersetzen. */
    window.SpeechRecognition = window.webkitSpeechRecognition;
  });
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html";
  await pg.goto(url, { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.Rueckfrage && typeof Backend !== "undefined", { timeout: 25000 });

  /* Die nachgebaute Datenbank: zwei offene Fragen, eine Meldung von
     Claude, und jede Antwort wird mitgeschrieben. */
  const aufbauen = (betreiber) => pg.evaluate((b) => {
    window.__rf = { antworten: [], funk: [] };
    const fragen = [
      { id: 7, thema: "Blume", frage: "Passt die Blume jetzt?", art: "ja_nein",
        optionen: ["zu gross", "nicht mittig"], wo: "Klassenzimmer → Platz antippen → Lieb sein" },
      { id: 8, thema: "Leiter", frage: "Klettert das Bild vor der Leiter?", art: "ja_nein",
        optionen: [], wo: "Klassenzimmer → Platz → Leiter" }
    ];
    const meldungen = [{ id: 3, erstellt: new Date().toISOString(), von: "claude",
      text: "Ich baue gerade das Walkie-Talkie um.", gelesen: null }];
    const kette = (tab) => ({
      select() { return this; }, is() { return this; }, order() { return this; },
      limit() {
        return Promise.resolve({ data: tab === "betreiber_funk" ? meldungen : fragen, error: null });
      },
      update(werte) {
        return { eq(feld, wert) {
          window.__rf.antworten.push({ id: wert, werte: werte });
          return Promise.resolve({ error: null });
        }, in() { return Promise.resolve({ error: null }); } };
      },
      insert(werte) { window.__rf.funk.push(werte); return Promise.resolve({ error: null }); }
    });
    Backend.isOwner = () => b;
    Backend.zugang = () => ({ from: (t) => kette(t) });
    window.Rueckfrage.holen();
  }, betreiber);

  await aufbauen(false);
  await pg.waitForTimeout(400);
  sage(await pg.evaluate(() => !document.querySelector(".rf-reiter, .rf-leiste")),
    "Wer nicht Betreiber ist, sieht nichts");

  await pg.evaluate(() => { try { localStorage.removeItem("dma_funk_offen"); } catch (e) {} });
  await aufbauen(true);
  await pg.waitForSelector(".rf-reiter", { timeout: 4000 });
  const zu = await pg.evaluate(() => {
    const r = document.querySelector(".rf-reiter").getBoundingClientRect();
    const unser = (x, y) => {
      const e = document.elementFromPoint(x, y);
      return Boolean(e && e.closest(".rf-reiter, .rf-leiste"));
    };
    return { b: Math.round(r.width), h: Math.round(r.height), links: Math.round(r.left),
             leiste: Boolean(document.querySelector(".rf-leiste")),
             zahl: document.querySelector(".rf-reiter-zahl").textContent,
             untenLinks: unser(20, innerHeight - 30), mitte: unser(innerWidth / 2, innerHeight / 2) };
  });
  sage(!zu.leiste && zu.b <= 40 && zu.h <= 50 && zu.links === 0,
    "Zugeklappt nur ein kleiner Reiter am linken Rand", zu.b + "×" + zu.h + " bei x=" + zu.links);
  sage(!zu.untenLinks && !zu.mitte, "Unten links und in der Mitte liegt nichts vom Walkie-Talkie");
  sage(zu.zahl === "2", "Der Reiter zeigt, wie viele Fragen offen sind", zu.zahl);

  /* RUNDE 100 — der Reiter laesst sich am Rand verschieben, damit er
     nichts verdeckt; die Stelle bleibt gemerkt. Schieben klappt NICHT
     auf, erst ein Tipp. */
  const vorher = await pg.evaluate(() => document.querySelector(".rf-reiter").getBoundingClientRect());
  await pg.mouse.move(vorher.left + 15, vorher.top + 20);
  await pg.mouse.down();
  await pg.mouse.move(vorher.left + 15, vorher.top + 80, { steps: 6 });
  await pg.mouse.move(vorher.left + 15, vorher.top + 140, { steps: 6 });
  await pg.mouse.up();
  await pg.waitForTimeout(200);
  const geschoben = await pg.evaluate(() => ({
    top: Math.round(document.querySelector(".rf-reiter").getBoundingClientRect().top),
    gemerkt: localStorage.getItem("dma_funk_reiter"),
    offen: Boolean(document.querySelector(".rf-leiste")) }));
  sage(geschoben.top - vorher.top > 100 && geschoben.gemerkt && !geschoben.offen,
    "Den Reiter kann man am Rand verschieben — er merkt sich die Stelle und klappt dabei nicht auf",
    Math.round(vorher.top) + " → " + geschoben.top + " px, gemerkt " + geschoben.gemerkt);

  await pg.evaluate(() => document.querySelector(".rf-reiter").click());
  await pg.waitForSelector(".rf-leiste", { timeout: 3000 });
  const auf = await pg.evaluate(() => {
    const c = document.querySelector(".rf-leiste");
    const r = c.getBoundingClientRect();
    return { frage: c.querySelector(".rf-frage").textContent,
             thema: (c.querySelector(".rf-thema") || {}).textContent,
             wo: (c.querySelector(".rf-wo") || {}).textContent || "",
             stufen: [...c.querySelectorAll(".rf-stufe")].map((b) => b.textContent),
             kaesten: c.querySelectorAll(".rf-option input[type=checkbox]").length,
             nein: Boolean(c.querySelector(".rf-nein")),
             status: (c.querySelector(".rf-status-text") || {}).textContent,
             rechtsFrei: Math.round(innerWidth - r.right) };
  });
  sage(auf.frage === "Passt die Blume jetzt?" && auf.thema === "Blume",
    "Aufgeklappt: Frage mit Thema", auf.thema + " — " + auf.frage);
  sage(/Wo testen/.test(auf.wo) && /Lieb sein/.test(auf.wo), "„Wo testen“ steht dabei", auf.wo);
  sage(auf.stufen.length === 3 && /Komplett fertig/.test(auf.stufen[0]) &&
    /später nochmal prüfen/.test(auf.stufen[1]) && /überarbeiten/.test(auf.stufen[2]),
    "Die drei Stufen in seinen Worten", auf.stufen.join(" | "));
  sage(auf.kaesten === 7 && !auf.nein,
    "Haekchen stehen gleich da (2 eigene + 5 immer), kein „Nein“ mehr", auf.kaesten + " Kästchen");
  sage(auf.status === "Ich baue gerade das Walkie-Talkie um.", "Claudes Meldung steht oben", auf.status);
  sage(auf.rechtsFrei >= 56, "Auch offen bleibt rechts ein Streifen frei", auf.rechtsFrei + " px");

  const durch = await pg.evaluate(() => {
    let angekommen = false;
    const h = () => { angekommen = true; };
    document.addEventListener("click", h);
    document.querySelector(".rf-frage").click();
    document.removeEventListener("click", h);
    return angekommen;
  });
  sage(!durch, "Ein Klick in die Leiste greift nicht dahinter durch");

  /* Ankreuzen, dann „Später": die erste Frage darf nicht verschwinden. */
  await pg.evaluate(() => {
    document.querySelector(".rf-stufe-okay").click();
    const h = document.querySelectorAll(".rf-option input");
    h[1].click(); h[3].click();
  });
  await pg.evaluate(() => document.querySelector(".rf-spaeter").click());
  const sp = await pg.evaluate(() => ({
    frage: document.querySelector(".rf-frage").textContent,
    zahl: document.querySelector(".rf-zahl").textContent,
    offen: window.Rueckfrage.stand().length }));
  sage(sp.frage.startsWith("Klettert") && sp.offen === 2 && /2 von 2/.test(sp.zahl),
    "„Später“ blättert nur weiter — beide Fragen bleiben offen", sp.zahl);
  await pg.evaluate(() => document.querySelector(".rf-vor").click());

  /* Neu laden: Leiste wieder offen, Haekchen noch da. */
  await pg.reload({ waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.Rueckfrage && typeof Backend !== "undefined", { timeout: 25000 });
  await aufbauen(true);
  await pg.waitForSelector(".rf-leiste .rf-frage", { timeout: 4000 });
  const neu = await pg.evaluate(() => {
    const c = document.querySelector(".rf-leiste");
    return { frage: c.querySelector(".rf-frage").textContent,
             stufe: (c.querySelector(".rf-stufe.rf-gewaehlt") || {}).className || "",
             haken: [...c.querySelectorAll(".rf-option input:checked")].map((x) => x.value) };
  });
  sage(neu.frage === "Passt die Blume jetzt?" && /okay/.test(neu.stufe) &&
    neu.haken.join("|") === "nicht mittig|Muss ich später prüfen (niemand im Raum)",
    "Nach dem Neuladen: offen, dieselbe Frage, Haekchen noch da", neu.haken.join(" | "));

  await pg.evaluate(() => {
    const t = document.querySelector(".rf-notiz");
    t.value = "etwas nach links"; t.dispatchEvent(new Event("input"));
    document.querySelector(".rf-senden").click();
  });
  await pg.waitForTimeout(200);
  const a = await pg.evaluate(() => window.__rf.antworten);
  const w = a[0] && a[0].werte;
  sage(w && a[0].id === 7 && w.antwort.stufe === "okay" &&
    w.antwort.gewaehlt.join("|") === "nicht mittig|Muss ich später prüfen (niemand im Raum)" &&
    w.notiz === "etwas nach links" && w.beantwortet,
    "Zurück geht Stufe, Haekchen und Notiz", w ? JSON.stringify(w.antwort) + " / " + w.notiz : "nichts");
  const rest = await pg.evaluate(() => document.querySelector(".rf-frage").textContent);
  sage(rest.startsWith("Klettert"), "Danach steht die nächste offene Frage da", rest);

  await pg.evaluate(() => {
    const t = document.querySelector(".rf-vorschlag-text");
    t.value = "Bist du hier?"; t.dispatchEvent(new Event("input"));
    document.querySelector(".rf-vorschlag-senden").click();
  });
  await pg.waitForTimeout(200);
  const f = await pg.evaluate(() => ({ funk: window.__rf.funk,
    ok: document.querySelector(".rf-gesendet").textContent }));
  sage(f.funk.length === 1 && f.funk[0].von === "xander" && f.funk[0].text === "Bist du hier?" &&
    /angekommen/.test(f.ok), "Ein Vorschlag an Claude kommt an", JSON.stringify(f.funk[0] || {}));

  /* DAS DIKTAT: 🎤 druecken, zwei Saetze hoeren lassen, ⏹. */
  await pg.evaluate(() => {
    const t = document.querySelector(".rf-vorschlag-text");
    t.value = ""; t.dispatchEvent(new Event("input"));
    t.closest(".rf-feldrahmen").querySelector(".rf-mik").click();
  });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => document.querySelector(".rf-vorschlag").querySelector(".rf-mik").click());
  await pg.waitForTimeout(400);
  const dikt = await pg.evaluate(() => ({
    zwischen: window.__rfZwischen || "",
    text: document.querySelector(".rf-vorschlag-text").value,
    live: (document.querySelector(".rf-vorschlag .rf-live") || {}).textContent || "",
    runden: window.__rfRunden,
    knopf: document.querySelector(".rf-vorschlag .rf-mik").textContent }));
  sage(/bist du/.test(dikt.zwischen), "Beim Sprechen steht sofort da, was gerade erkannt wird", dikt.zwischen);
  sage(dikt.text === "Bist du hier und noch was" && dikt.runden === 1,
    "Beide Saetze landen einmal im Feld (nichts doppelt), ohne Neustart",
    JSON.stringify(dikt.text) + ", " + dikt.runden + " Runden");
  sage(dikt.knopf === "🎤" && /Senden/.test(dikt.live), "⏹ beendet es, und darunter steht, was jetzt zu tun ist",
    dikt.live);

  /* Zuklappen und Schreiben im Chat: der Reiter geht aus dem Weg. */
  await pg.screenshot({ path: "/tmp/claude-0/walkie-offen.png" });
  await pg.evaluate(() => document.querySelector(".rf-zu").click());
  const weg = await pg.evaluate(() => {
    const vorher = Boolean(document.querySelector(".rf-leiste"));
    document.body.classList.add("lc-schreibt");
    const pe = getComputedStyle(document.querySelector(".rf-reiter")).pointerEvents;
    const kl = document.body.className;
    document.body.classList.remove("lc-schreibt");
    return { vorher, pe, kl };
  });
  sage(!weg.vorher && weg.pe === "none", "✕ klappt zu; beim Schreiben ist der Reiter nicht anzutippen", JSON.stringify(weg));

  await pg.screenshot({ path: "/tmp/claude-0/walkie-telefon.png" });

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
