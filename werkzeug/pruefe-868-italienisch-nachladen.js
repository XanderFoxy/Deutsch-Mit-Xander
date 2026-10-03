#!/usr/bin/env node
/* =====================================================================
   SONDE 868 — DIE ITALIENISCH-DATEN KOMMEN ERST BEIM BETRETEN (FASSUNG 850)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".
   Satzbaukasten, Grammatik, Wortschatz, Fragenbänke, „C'era una volta in
   Italia" und die Laufschrift des Italienisch-Raums (rund 170 KB) lagen in
   data-exercises.js und kamen bei jedem Start mit. Jetzt liegen sie in
   data-italienisch.js.
   Geprüft:
     1. Inhalt: data-italienisch.js trägt genau dieselben Daten wie vorher
        data-exercises.js (Fassung 849, aus git).
     2. Beim Start wird die Datei nicht geholt; ExerciseData.IT_WOERTER ist
        leer, der Deutsch-Raum unverändert.
     3. Betreiber tippt in den Einstellungen auf 🇮🇹 Italiano: die Datei
        kommt (einmal), der Raum wechselt, Wörter, Grammatik, Kategorien
        und Fragen sind da.
     4. Zurück auf 🇩🇪 Deutsch geht wie bisher.
     5. Keine Fehler in der Konsole.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), cp = require("child_process");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
const NAMEN = ["IT_SUBJEKTE", "IT_VERBEN", "IT_ERGAENZUNGEN", "IT_ZEITANGABEN", "IT_GRAMMATIK", "IT_WOERTER", "IT_BANKEN", "IT_GESCHICHTE", "IT_TICKER"];
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log("\n1) Inhalt unverändert\n");
  const fenster = {};
  new Function("window", fs.readFileSync(path.join(WURZEL, "data-italienisch.js"), "utf8"))(fenster);
  const neu = fenster.DMA_DATEN && fenster.DMA_DATEN.ITALIENISCH;
  let alt = null;
  try {
    const q = cp.execSync("git show 1798d0f:data-exercises.js", { cwd: WURZEL, maxBuffer: 64 << 20 }).toString();
    const a = q.indexOf("  const IT_SUBJEKTE = ["), b = q.indexOf("  const IT_KATEGORIEN = [");
    alt = new Function(q.slice(a, b) + "; return {" + NAMEN.join(",") + "};")();
  } catch (e) { console.log("       (git-Stand 849 nicht lesbar: " + e.message.slice(0, 80) + ")"); }
  sage(Boolean(neu) && NAMEN.every((n) => neu[n]), "data-italienisch.js meldet alle neun Teile an");
  if (alt) {
    const anders = NAMEN.filter((n) => JSON.stringify(alt[n]) !== JSON.stringify(neu[n]));
    sage(anders.length === 0, "dieselben Daten wie in Fassung 849", anders.join(", ") || NAMEN.map((n) => n.slice(3) + ":" + (Array.isArray(neu[n]) ? neu[n].length : Object.keys(neu[n]).length)).join(" "));
  }
  const de = fs.readFileSync(path.join(WURZEL, "data-exercises.js"), "utf8");
  sage(!/const IT_WOERTER = \[/.test(de) && !/const IT_BANKEN = \{/.test(de), "data-exercises.js trägt sie nicht mehr selbst", (fs.statSync(path.join(WURZEL, "data-exercises.js")).size / 1024).toFixed(0) + " KB");

  const geholt = [];
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (/italienisch\.js$/.test(p)) geholt.push(p);
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await (await br.newContext({ viewport: { width: 393, height: 800 } })).newPage();
  const konsole = [];
  pg.on("pageerror", (e) => konsole.push("Seitenfehler: " + e.message));
  const fehlt = [];
  pg.on("response", (r) => { if (r.status() === 404 && r.url().indexOf(HIER) === 0) fehlt.push(r.url().slice(HIER.length)); });
  pg.on("console", (m) => {
    if (m.type() !== "error") return;
    const ort = (m.location() && m.location().url) || "";
    if (/Failed to load resource/.test(m.text()) && ort.indexOf(HIER) !== 0) return;
    konsole.push("console.error: " + m.text().slice(0, 160));
  });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => typeof ExerciseData !== "undefined" && typeof Backend !== "undefined" && window.DMA_PRUEF, null, { timeout: 60000 });
  await tick(2500);

  console.log("\n2) Beim Start\n");
  const start = await pg.evaluate(() => ({ da: ExerciseData.italienischDa(), woerter: ExerciseData.IT_WOERTER.length,
    raum: ExerciseData.getLernraum(), kat: ExerciseData.activeCategories().length, erste: (ExerciseData.activeCategories()[0] || {}).id }));
  sage(geholt.length === 0 && !start.da, "data-italienisch.js wird beim Start nicht geholt", geholt.join(",") || "nicht geholt");
  sage(start.woerter === 0 && start.raum === "de" && start.kat > 10 && !/^it-/.test(start.erste), "Deutsch-Raum wie bisher, italienische Wörter noch leer", JSON.stringify(start));

  console.log("\n3) Betreiber wechselt in den Italienisch-Raum\n");
  await pg.evaluate(() => {
    Backend.isOwner = () => true;
    Backend.currentUser = () => ({ id: "xander" });
    Backend.currentProfile = () => ({ id: "xander", name: "Xander", points: 10, extraProfileData: {} });
    Backend.updateExtraProfileField = () => Promise.resolve(true);
    const t = document.querySelector('.tape-tab[data-target="view-profile"]'); if (t) t.click();
    const b = document.querySelector('[data-sub="sub-settings"]'); if (b) { b.style.display = ""; b.click(); }
  });
  const knopf = await pg.waitForFunction(() => document.querySelector('#settingsArea [data-lernraum="it"]'), null, { timeout: 30000 }).then(() => true).catch(() => false);
  sage(knopf, "der Schalter 🇮🇹 Italiano ist da");
  await pg.evaluate(() => document.querySelector('#settingsArea [data-lernraum="it"]').click());
  const gewechselt = await pg.waitForFunction(() => document.body.classList.contains("lernraum-it"), null, { timeout: 20000 }).then(() => true).catch(() => false);
  const it = await pg.evaluate(() => {
    const kats = ExerciseData.activeCategories();
    return { raum: ExerciseData.getLernraum(), woerter: ExerciseData.IT_WOERTER.length, verben: ExerciseData.IT_VERBEN.length,
      grammatik: Object.keys(ExerciseData.activeGrammatik() || {}).length, geschichte: ExerciseData.activeHistoryEntries().length,
      kats: kats.length, alleIt: kats.every((k) => /^it-/.test(k.id)), fragen: kats.reduce((s, k) => s + (k.getBank ? k.getBank().length : 0), 0),
      ticker: ExerciseData.IT_TICKER.length };
  });
  sage(gewechselt && it.raum === "it", "der Raum wechselt", it.raum);
  sage(geholt.length === 1, "data-italienisch.js wurde genau einmal geholt", geholt.join(","));
  sage(it.woerter > 300 && it.verben > 10 && it.grammatik >= 6 && it.geschichte >= 6 && it.ticker >= 30, "Wörter, Verben, Grammatik, Geschichte und Laufschrift sind da",
    "Wörter " + it.woerter + ", Verben " + it.verben + ", Grammatik " + it.grammatik + ", Geschichte " + it.geschichte + ", Laufschrift " + it.ticker);
  sage(it.kats >= 8 && it.alleIt && it.fragen >= 60, "die italienischen Kategorien haben ihre Fragen", it.kats + " Kategorien, " + it.fragen + " Fragen");

  console.log("\n4) Zurück\n");
  await pg.waitForFunction(() => document.querySelector('#settingsArea [data-lernraum="de"]'), null, { timeout: 10000 }).catch(() => {});
  await pg.evaluate(() => document.querySelector('#settingsArea [data-lernraum="de"]').click());
  await tick(400);
  const zurueck = await pg.evaluate(() => ({ raum: ExerciseData.getLernraum(), klasse: document.body.classList.contains("lernraum-it") }));
  sage(zurueck.raum === "de" && !zurueck.klasse, "zurück im Deutsch-Raum", JSON.stringify(zurueck));

  sage(konsole.length === 0, "keine Fehler in der Konsole", konsole.slice(0, 3).join(" | ") + (fehlt.length ? "  fehlt: " + fehlt.join(", ") : ""));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
