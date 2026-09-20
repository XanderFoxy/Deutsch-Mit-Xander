#!/usr/bin/env node
/* =========================================================
   RUNDE 25 — DIE AUFGABE MIT SINN, DER WOERTERBUCH-LINK,
   DAS AUFDECKEN FUER ALLE UND DAS RUNDENLAUFEN
   ---------------------------------------------------------
   GEFRAGT und GEMELDET, woertlich:
   „Und bei Aufgabe gibt's immer noch keinen richtigen Sinn
    in der Aufgabe. Was ist deine Strategie fuer diese
    Aufgabe?"
   · „vielleicht sofern das moeglich ist auch einige der
     Spiele, die fuer den Chat kompatibel sind, zum Beispiel
     Artikel raten … dass man im Chat sogar auf den Link im
     Woerterbuch zugreifen kann … Das Ganze soll dann
     natuerlich auch benotet werden koennen."
   · „Dann ist bei diesem Aufdeckspiel — sehen die anderen das
     immer noch nicht und da soll, wie gesagt, das Runden
     laufen."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");

  console.log("\nDIE STRATEGIE STEHT AUFGESCHRIEBEN\n");
  pruefe("die Strategie steht im Code, nicht nur im Chat",
    /DIE STRATEGIE, in einem Satz/.test(js));
  pruefe("und sie nennt die drei Bedingungen",
    /aus dem Stoff kommt[\s\S]{0,200}SELBST pruefen[\s\S]{0,200}Note/.test(js));

  console.log("\nDIE ZWEI NEUEN AUFGABEN\n");
  pruefe("/artikel ist ein Befehl",
    /art === "artikel"\) return wortAufgabeStellen/.test(lc) && /w: "artikel"/.test(lc));
  pruefe("/begriff ist ein Befehl",
    /art === "begriff" \|\| art === "bedeutung"/.test(lc) && /w: "begriff"/.test(lc));
  pruefe("die Woerter kommen aus dem Woerterbuch",
    /window\.DMA_WORTPROBE/.test(js) && /VocabData\.WORDS/.test(js));
  pruefe("das Woerterbuch wird erst dafuer geholt",
    /function lcWoerterbuchHolen/.test(js) && /VocabData\.ladeWoerter\(\)/.test(js));
  pruefe("beim Artikel zaehlt das erste Wort",
    /offeneAufgabe\.typ === "artikel"[\s\S]{0,400}erstes/.test(lc));
  pruefe("und drei Kacheln stehen zur Wahl",
    /teile: \["der", "die", "das"\]/.test(lc));

  console.log("\nDER LINK INS WOERTERBUCH\n");
  /* NACHGEBESSERT IN RUNDE 28: alle Zusatzfelder stehen in EINER
     Liste, damit keines mehr vergessen werden kann. */
  pruefe("das Wort steht in der Liste der Zusatzfelder",
    /var ZUSATZ_FELDER = \[/.test(lc) && /"wortLink"/.test(lc));
  pruefe("die Aufgabe zeigt einen Knopf dafuer",
    /lc-aufgabe-nachschlagen/.test(js) && /lc-aufgabe-nachschlagen/.test(css));
  pruefe("und er schlaegt wirklich nach",
    /function lcWortNachschlagen/.test(js) && /vocabSearch/.test(js));

  console.log("\nDAS AUFDECKEN SEHEN JETZT ALLE\n");
  pruefe("„raten“ und „dran“ stehen ebenfalls darin",
    /"raten", "dran"/.test(lc));
  pruefe("und die Uebernahme laeuft an allen drei Stellen",
    (lc.match(/zusatzUebernehmen\(/g) || []).length >= 4,
    (lc.match(/zusatzUebernehmen\(/g) || []).length + " Stellen");

  console.log("\nDAS RUNDENLAUFEN\n");
  pruefe("die Runde ist die Sitzreihe", /function rundeNamen/.test(lc)
    && /plaetzeBauen\(\)\.filter/.test(lc));
  pruefe("nach dem Stellen ist der Naechste dran",
    /dran: naechsterDran\(zustand\.ichId\)/.test(lc));
  pruefe("nach jedem Versuch rueckt sie weiter",
    /if \(offeneAufgabe\.typ === "raten"\) rundeWeiter\(\);/.test(lc));
  pruefe("weitergezaehlt wird nur beim Steller",
    /offeneAufgabe\.vonMir/.test(lc));
  pruefe("und die Tafel sagt, wer dran ist",
    /lc-raten-dran/.test(js) && /lc-raten-dran/.test(css)
    && /werIstDran/.test(lc) && /werIstDran/.test(js));

  /* ---------- Und jetzt im Browser ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_WORTPROBE, { timeout: 20000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: { b: { id: "b", name: "Bea", seit: 500 },
                                    c: { id: "c", name: "Cem", seit: 1500 } } });
    const t = document.querySelector('[data-sub="sub-livechat"]');
    if (t) t.click();
  });
  await pg.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });

  console.log("\nGEMESSEN: DAS WOERTERBUCH LIEFERT EINE AUFGABE\n");
  const wort = await pg.evaluate(async () => {
    await window.DMA_WORTPROBE.nachladen();
    const a = window.DMA_WORTPROBE.artikel();
    const b = window.DMA_WORTPROBE.begriff();
    return { bereit: window.DMA_WORTPROBE.bereit(),
             artikel: a ? a.artikel + " " + a.nomen : "",
             richtig: a ? /^(der|die|das)$/.test(a.artikel) : false,
             begriff: b ? b.wort : "", bedeutung: b ? b.bedeutung.slice(0, 40) : "" };
  });
  pruefe("das Woerterbuch ist nachgeladen", wort.bereit === true);
  pruefe("es kommt ein Nomen mit Artikel", Boolean(wort.artikel) && wort.richtig,
    wort.artikel || "-");
  pruefe("und ein Wort mit Bedeutung", Boolean(wort.begriff && wort.bedeutung),
    wort.begriff + " — " + wort.bedeutung);

  console.log("\nGEMESSEN: DIE ARTIKELAUFGABE IM CHAT\n");
  const auf = await pg.evaluate(async () => {
    window.LiveChat.schreiben("/artikel");
    await new Promise((f) => setTimeout(f, 600));
    const tafel = [...document.querySelectorAll(".lc-aufgabe")]
      .find((t) => /Artikel/.test(t.textContent));
    if (!tafel) return null;
    return { kacheln: [...tafel.querySelectorAll(".lc-aufgabe-teil")].map((b) => b.textContent),
             nachschlagen: Boolean(tafel.querySelector(".lc-aufgabe-nachschlagen")),
             text: tafel.textContent.slice(0, 70) };
  });
  pruefe("die Aufgabe steht im Chat", Boolean(auf), auf ? auf.text.replace(/\s+/g, " ") : "-");
  pruefe("drei Kacheln: der, die, das",
    Boolean(auf && auf.kacheln.join(",") === "der,die,das"),
    auf ? auf.kacheln.join(" ") : "-");
  pruefe("und daneben der Weg ins Woerterbuch", Boolean(auf && auf.nachschlagen));

  console.log("\nGEMESSEN: DAS AUFDECKEN UND DIE RUNDE\n");
  const raten = await pg.evaluate(async () => {
    window.LiveChat.schreiben("/raten Aller Anfang ist schwer");
    await new Promise((f) => setTimeout(f, 600));
    const tafel = document.querySelector(".lc-raten");
    if (!tafel) return null;
    return { felder: tafel.querySelectorAll(".lc-raten-feld").length,
             dran: (tafel.querySelector(".lc-raten-dran") || {}).textContent || "",
             werIstDran: window.LiveChat.werIstDran() };
  });
  pruefe("das Rad steht da", Boolean(raten && raten.felder > 10),
    raten ? raten.felder + " Felder" : "-");
  pruefe("und es sagt, wer dran ist",
    Boolean(raten && /Bea|Cem|Du bist dran/.test(raten.dran)),
    raten ? raten.dran : "-");
  pruefe("der Steller selbst ist nicht dran",
    Boolean(raten && raten.werIstDran && raten.werIstDran !== "Alex"),
    raten ? raten.werIstDran : "-");

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0,
    aufSeite.slice(0, 3).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nRunde 25 sitzt.");
  process.exit(fehler ? 1 : 0);
})();
