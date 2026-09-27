#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 722: FRAGEN NACH DEM LERNPROFIL (Funk 167)
   ---------------------------------------------------------------------
   XANDER: „in Interaktion mit dem System was wir in den Einstellungen
   haben global auf der Webseite in welchen Bereichen wir gut oder nicht
   so gut sind … Fragen eher vorgeschlagen … Bereichen zu üben wo sie
   nicht gut sind … einstellen ob sie … die leichten Sachen … das soll
   aber beides möglich sein".
   Die Sonde legt ein Lernprofil ins Konto (Backend.currentProfile – ein const, nicht window.Backend), holt
   es über die Brücke und prüft, welche Kategorie das Spiel beim Server
   anfragt – für „Schwächen", „Stärken" und „Gemischt".
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); a.end(); return; }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const seitenFehler = []; pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.removeItem("dma_spiel_fragenart"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_SPIEL && window.DMA_SPIEL_BRUECKE && typeof Backend !== "undefined", { timeout: 25000 });

  console.log("\nDIE BRÜCKE LIEST DAS LERNPROFIL AUS DEM KONTO\n");
  const leer = await pg.evaluate(() => JSON.stringify(window.DMA_SPIEL_BRUECKE.lernprofil()));
  sage(leer === "{}", "ohne Konto: leeres Profil", leer);
  const profil = await pg.evaluate(() => {
    const p = { artikel: "schwach", faelle: "schwach", modalverben: "stark", konnektoren: "mittel" };
    Backend.currentProfile = () => ({ extraProfileData: { learningProfile: p } });
    return JSON.stringify(window.DMA_SPIEL_BRUECKE.lernprofil());
  });
  /* Wäre getLearningProfile in der Brücke nicht erreichbar, schluckte das catch den Fehler und es käme {} zurück. */
  sage(profil === JSON.stringify({ artikel: "schwach", faelle: "schwach", modalverben: "stark", konnektoren: "mittel" }), "mit Konto: die Brücke liefert genau die Selbsteinschätzung aus den Einstellungen", profil);

  const ich = { id: "00000000-0000-4000-8000-000000000000", name: "Alex", lp: 100, lp_max: 100, punkte: 100, waffen: [], mana: 50, mana_max: 100, level: 5, xp: 0, skills: {}, vorraete: {}, tiere: {} };
  await pg.evaluate((ich) => {
    window.__rufe = [];
    const klient = { rpc: (name, args) => { window.__rufe.push({ name, args: args || {} });
      const data = name === "spiel_ich" ? ich : name === "spiel_stand" ? [ich] : name === "spiel_aufgabe" ? { ok: true, id: 1, frage: "Der ___ Hund.", optionen: ["a", "b"], niveau: "A1" } : { ok: true };
      return Promise.resolve({ data, error: null }); } };
    window.DMA_SPIEL.pruef.setzen({ klient, bereit: true, versucht: true, uid: ich.id, ich, stand: { [ich.id]: ich }, letzterAbruf: Date.now() });
    window.DMA_SPIEL.aufgabe();
  }, ich);
  await new Promise((r) => setTimeout(r, 800));

  console.log("\nWÄHLEN: SCHWÄCHEN, STÄRKEN, GEMISCHT\n");
  const chips = await pg.evaluate(() => [...document.querySelectorAll('[data-tu="fragenart"]')].map((b) => b.dataset.f + (b.classList.contains("sp-an") ? "*" : "")));
  sage(JSON.stringify(chips) === JSON.stringify(["schwach*", "stark", "gemischt"]), "Deutsch-Menü zeigt die drei Arten, „Schwächen üben“ ist vorgewählt", JSON.stringify(chips));
  const ziehen = async (art, n) => pg.evaluate(async ([art, n]) => {
    const k = document.querySelector('[data-tu="fragenart"][data-f="' + art + '"]'); if (k) k.click();
    const out = [];
    for (let i = 0; i < n; i++) { window.__rufe = []; window.DMA_SPIEL.aufgabe(); await new Promise((r) => setTimeout(r, 30));
      const r = window.__rufe.find((x) => x.name === "spiel_aufgabe"); out.push(r ? r.args.p_kategorie : "KEIN RUF"); }
    return out;
  }, [art, n]);
  const schwach = await ziehen("schwach", 40);
  const nurSchwach = schwach.every((k) => k === null || k === "artikel" || k === "faelle");
  const anteil = schwach.filter((k) => k === "artikel" || k === "faelle").length;
  sage(nurSchwach && anteil >= 20, "Schwächen: nur Artikel/Fälle – ab und zu (≈25 %) eine gemischte Frage", anteil + " von 40 gezielt · " + JSON.stringify(schwach.slice(0, 8)));
  const stark = await ziehen("stark", 12);
  sage(stark.every((k) => k === "modalverben"), "Stärken (leichter): nur Modalverben", JSON.stringify(stark.slice(0, 6)));
  const gemischt = await ziehen("gemischt", 8);
  sage(gemischt.every((k) => k === null), "Gemischt: keine Kategorie vorgegeben", JSON.stringify(gemischt.slice(0, 4)));
  const gemerkt = await pg.evaluate(() => localStorage.getItem("dma_spiel_fragenart"));
  sage(gemerkt === "gemischt", "die Wahl bleibt gemerkt", gemerkt);
  sage(!seitenFehler.length, "keine Seitenfehler", seitenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 722 (Fragen nach Lernprofil): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
