#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 843: ITALIENISCH NUR NOCH IM ITALIENISCHRAUM
   ---------------------------------------------------------------------
   XANDER (Funk 225/232): Italienisch soll „generell … rausnehmen“
   werden — überall außerhalb des Italienischraums.

   Geprüft (index.html?quelle=1 — die Quellen, nicht die min/-Kopien;
   Telefon 360 × 740):
     1 ALTE BILDERWELT (Standard, nicht bilderwelt-neu/), Deutsch-Raum,
       mit einem Profil, das ausdrücklich Italienisch als Hilfssprache
       gewählt hat und Italien als Herkunftsland angibt:
         · die Übersicht ohne „Wer will, sieht zu jedem Wort auch gleich
           das italienische daneben“ (und ohne jedes „italienisch“);
         · die Wortkarte (Küche → der Herd) ohne 🇮🇹-Zeile und ohne das
           italienische Wort („il fornello“).
     2 HILFSSPRACHE: in den Einstellungen bietet „Sprache der
       Erklärungen“ kein Italienisch an; „Erste Schritte“ übersetzt
       nicht ins Italienische und bietet es nicht an; „Es war einmal in
       Deutschland“ bietet in der Sprachwahl kein Italienisch an.
     3 ITALIENISCHRAUM bleibt: Betreiber, Lernraum „it“ — die Bilderwelt
       sagt „Im Italienisch-Raum läuft alles auf Italienisch“, die
       Wortkarte zeigt „il fornello“, window.DMA_IT_SPIEL ist da, und die
       Einstellungen zeigen den Schalter 🇮🇹 Italiano.
     4 keine Seitenfehler.
   Mit dem alten Stand (vor 843) ist 1 und 2 rot.

   Aufruf: node werkzeug/pruefe-843-italienisch-nur-im-raum.js
   Anderer Stand: WURZEL=/pfad   Bildschirmfotos: BILD=/pfad/praefix
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html?quelle=1";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const seitenFehler = [];

  async function neueSeite() {
    const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => { try {
      localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus");
      localStorage.setItem("dma_bilderwelt", "alt");
    } catch (e) {} });
    const pg = await ctx.newPage();
    pg.setDefaultTimeout(90000);
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e).split("\n")[0]));
    await pg.goto(adresse, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEF && typeof ExerciseData !== "undefined" && typeof Backend !== "undefined"
      && document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'), null, { timeout: 120000 });
    await tick(600);
    /* Ein angemeldetes Konto, das Italienisch ausdrücklich als Hilfssprache
       gewählt hat und aus Italien kommt — der schärfste Fall. */
    await pg.evaluate(() => {
      window.__extra = { hilfsSprache: "it" };
      window.__owner = false;
      Backend.currentUser = () => ({ id: "probe" });
      Backend.currentProfile = () => ({ id: "probe", name: "Probe", origin: "Italien", points: 10, extraProfileData: window.__extra });
      Backend.updateExtraProfileField = (feld, wert) => { window.__extra[feld] = wert; return Promise.resolve(true); };
      Backend.isOwner = () => window.__owner;
    });
    return { ctx, pg };
  }
  const reiter = (pg, ansicht, sub) => pg.evaluate(([ansicht, sub]) => {
    const t = document.querySelector('.tape-tab[data-target="' + ansicht + '"]'); if (t) t.click();
    const b = document.querySelector('[data-sub="' + sub + '"]'); if (b) { b.style.display = ""; b.click(); }
    return Boolean(b);
  }, [ansicht, sub]);
  async function bilderwelt(pg) {
    await reiter(pg, "view-learn", "sub-bilderwelt");
    await pg.waitForFunction(() => document.querySelector("#bilderweltArea [data-bw-szene]"), null, { timeout: 60000 });
    await tick(400);
    const uebersicht = await pg.evaluate(() => document.getElementById("bilderweltArea").innerText);
    await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-szene="kueche"]').click());
    await pg.waitForFunction(() => document.querySelector('#bilderweltArea [data-bw-teil="herd"]'), null, { timeout: 60000 });
    await tick(500);
    await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-teil="herd"]').dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await pg.waitForFunction(() => document.querySelector("#bilderweltArea .bw-wortkarte"), null, { timeout: 30000 }).catch(() => {});
    await tick(300);
    const karte = await pg.evaluate(() => { const k = document.querySelector("#bilderweltArea .bw-wortkarte"); return k ? k.innerText : ""; });
    return { uebersicht, karte };
  }

  /* ---------------------------------------------------------------- 1 */
  console.log("\n1 · ALTE BILDERWELT IM DEUTSCH-RAUM (Hilfssprache Italienisch gewählt, Herkunft Italien)\n");
  const { ctx, pg } = await neueSeite();
  const alt = await pg.evaluate(() => ({ neu: window.DMA_BILDERWELT_NEU, raum: ExerciseData.getLernraum ? ExerciseData.getLernraum() : "?" }));
  sage(alt.neu === false && alt.raum !== "it", "Standard: alte Bilderwelt, Deutsch-Raum", JSON.stringify(alt));
  const de = await bilderwelt(pg);
  if (BILD) { const k = await pg.$("#bilderweltArea .bw-wortkarte"); if (k) await k.screenshot({ path: BILD + "-de-wortkarte.png" }); }
  sage(de.uebersicht.length > 0 && !/Wer will, sieht zu jedem Wort auch gleich das italienische daneben/.test(de.uebersicht),
    "Übersicht ohne „Wer will, sieht zu jedem Wort auch gleich das italienische daneben“");
  sage(!/italienisch/i.test(de.uebersicht), "Übersicht ohne jedes „italienisch“", (de.uebersicht.match(/[^\n]*italienisch[^\n]*/i) || [""])[0].slice(0, 90));
  sage(/Herd/.test(de.karte), "Wortkarte „der Herd“ ist offen", de.karte.split("\n")[0]);
  sage(de.karte.length > 0 && !/🇮🇹/.test(de.karte), "Wortkarte ohne 🇮🇹-Zeile", (de.karte.match(/🇮🇹[^\n]*/) || [""])[0]);
  sage(de.karte.length > 0 && !/fornello/i.test(de.karte), "Wortkarte ohne das italienische Wort „il fornello“");

  /* ---------------------------------------------------------------- 2 */
  console.log("\n2 · HILFSSPRACHE OHNE ITALIENISCH\n");
  await reiter(pg, "view-profile", "sub-settings");
  await pg.waitForFunction(() => document.getElementById("hilfsSpracheWahl"), null, { timeout: 30000 }).catch(() => {});
  const einst = await pg.evaluate(() => {
    const s = document.getElementById("hilfsSpracheWahl");
    return s ? { da: true, codes: [...s.options].map((o) => o.value), texte: [...s.options].map((o) => o.textContent).join(" | ") } : { da: false };
  });
  sage(einst.da && einst.codes.length > 5, "Einstellungen: Auswahl „Sprache der Erklärungen“ ist da", einst.da ? einst.codes.length + " Einträge" : "nicht gefunden");
  sage(einst.da && !einst.codes.includes("it") && !/Italien|Italiano/i.test(einst.texte), "… ohne Italienisch (auch nicht als „gerade“ gewählte Sprache)",
    einst.da ? (einst.texte.match(/[^|]*Itali[^|]*/i) || [""])[0].trim() : "");

  await reiter(pg, "view-learn", "sub-erste-schritte");
  await pg.waitForFunction(() => document.getElementById("firstStepsLangSelect"), null, { timeout: 30000 }).catch(() => {});
  const fs1 = await pg.evaluate(() => {
    const s = document.getElementById("firstStepsLangSelect"), a = document.getElementById("firstStepsArea");
    return s ? { da: true, codes: [...s.options].map((o) => o.value), kopf: (a.querySelector(".eyebrow") || {}).textContent || "" } : { da: false };
  });
  sage(fs1.da && !fs1.codes.includes("it"), "Erste Schritte: Sprachwahl ohne Italienisch", fs1.da ? fs1.codes.join(",") : "nicht gefunden");
  sage(fs1.da && !/Italienisch/.test(fs1.kopf), "Erste Schritte: „Übersetzung gerade in“ nicht Italienisch (trotz Herkunft Italien)", fs1.kopf.trim().slice(0, 80));

  await reiter(pg, "view-knowledge", "sub-kompass");
  await pg.waitForFunction(() => document.querySelector("#kompassArea .hist-lang-select"), null, { timeout: 60000 }).catch(() => {});
  const hist = await pg.evaluate(() => {
    const s = document.querySelector("#kompassArea .hist-lang-select");
    const d = s && s.closest("details");
    return s ? { da: true, codes: [...s.options].map((o) => o.value), kopf: d ? (d.querySelector("summary") || {}).textContent : "" } : { da: false };
  });
  sage(hist.da && !hist.codes.includes("it"), "„Es war einmal in Deutschland“: Sprachwahl ohne Italienisch", hist.da ? hist.codes.join(",") : "nicht gefunden");
  sage(hist.da && !/Italien/.test(hist.kopf), "… und die Übersetzung steht nicht auf Italienisch", (hist.kopf || "").trim());
  await ctx.close();

  /* ---------------------------------------------------------------- 3 */
  console.log("\n3 · DER ITALIENISCHRAUM BLEIBT\n");
  const s2 = await neueSeite();
  await s2.pg.evaluate(async () => {
    window.__owner = true;
    /* FASSUNG 850: die Daten des Italienisch-Raums kommen erst beim Betreten */
    if (ExerciseData.ladeItalienisch) await ExerciseData.ladeItalienisch();
    ExerciseData.setLernraum("it");
    document.body.classList.add("lernraum-it");
  });
  const it = await bilderwelt(s2.pg);
  if (BILD) { const k = await s2.pg.$("#bilderweltArea .bw-wortkarte"); if (k) await k.screenshot({ path: BILD + "-it-wortkarte.png" }); }
  sage(/Im Italienisch-Raum läuft alles auf Italienisch/.test(it.uebersicht), "Bilderwelt-Übersicht: „Im Italienisch-Raum läuft alles auf Italienisch“");
  sage(/fornello/.test(it.karte), "Wortkarte zeigt das italienische Wort „il fornello“", it.karte.split("\n").slice(0, 2).join(" / "));
  const raum = await s2.pg.evaluate(() => ({ spiel: Boolean(window.DMA_IT_SPIEL), raum: ExerciseData.getLernraum() }));
  sage(raum.spiel && raum.raum === "it", "window.DMA_IT_SPIEL ist da, Lernraum „it“", JSON.stringify(raum));
  await reiter(s2.pg, "view-profile", "sub-settings");
  await s2.pg.waitForFunction(() => document.querySelector('#settingsArea [data-lernraum="it"]'), null, { timeout: 30000 }).catch(() => {});
  const schalter = await s2.pg.evaluate(() => Boolean(document.querySelector('#settingsArea [data-lernraum="it"]')));
  sage(schalter, "Einstellungen: der Schalter 🇮🇹 Italiano ist für den Betreiber da");
  await s2.ctx.close();

  /* ---------------------------------------------------------------- 4 */
  console.log("\n4 · SEITENFEHLER\n");
  const echte = seitenFehler.filter((e) => !/Failed to fetch|NetworkError|supabase|Load failed|ERR_/i.test(e));
  sage(!echte.length, "keine Seitenfehler", echte.slice(0, 3).join(" | "));

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nItalienisch nur noch im Italienischraum.\n");
  process.exit(fehler ? 1 : 0);
})();
