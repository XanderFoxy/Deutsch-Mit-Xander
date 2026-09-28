/* Fehlerjagd: jedes Modell in allen Jahres- und Tageszeiten, mehreren Winkeln,
   Bauphasen und Zoomstufen malen – jeder Fehler wird gemeldet. Danach jede
   Baustelle in der Szene und Winterhausen mit Menschen einige Sekunden laufen lassen.
   node werkzeug/stadt-fehlerjagd.js */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: 400, height: 400 } });
  pg.setDefaultTimeout(600000);
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(e.message));
  pg.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) seitenFehler.push("Konsole: " + m.text().slice(0, 300)); });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?quelle=1&werkbank=probehaus&still=1", { waitUntil: "load", timeout: 600000 });
  await pg.waitForFunction(() => window.__fertig, null, { timeout: 600000 });
  /* alle Modelle nachladen */
  await pg.evaluate(() => Promise.all((STADT.MODELL_DATEIEN || []).map((n) => new Promise((ok) => { if (document.querySelector('script[src^="stadt/modelle/' + n + '.js"]')) return ok(); const s = document.createElement("script"); s.src = "stadt/modelle/" + n + ".js?t=" + Date.now(); s.onload = s.onerror = ok; document.head.appendChild(s); }))));
  const erg = await pg.evaluate(async () => {
    const fehler = [], zeiten = {};
    const pause = () => new Promise((r) => setTimeout(r, 0));
    for (const id of Object.keys(STADT.MODELLE)) {
      const d = STADT.MODELLE[id];
      if (d.live) continue;
      let max = 0, n = 0;
      const baus = d.bauzeit ? [0.03, 0.1, 0.18, 0.28, 0.4, 0.55, 0.66, 0.76, 0.85, 0.95, 1] : [1];
      for (const jahr of ["winter", "fruehling", "sommer", "herbst"]) for (const zeit of ["tag", "abend", "nacht"]) for (const gier of [0, 45, 135, 250]) {
        for (const bau of (jahr === "winter" && zeit === "tag" ? baus : [1])) {
          const Z = Object.assign({ name: zeit }, STADT.ZEITEN[zeit]);
          const a = performance.now();
          try { STADT.spriteMalen(id, { jahr: jahr, bau: bau, saat: 3 + (gier % 7), schluessel: "f" }, gier, 18, Z, 1); }
          catch (e) { fehler.push(id + " " + jahr + "/" + zeit + "/" + gier + "°/bau " + bau + ": " + e.message + " @ " + ((e.stack || "").split("\n")[1] || "").trim()); }
          const dt = performance.now() - a; max = Math.max(max, dt); n++;
          if (n % 8 === 0) await pause();
        }
      }
      for (const s of [60, 140]) { try { STADT.spriteMalen(id, { jahr: "winter", bau: 1, saat: 5, schluessel: "f" }, 30, s, Object.assign({ name: "abend" }, STADT.ZEITEN.abend), 1); } catch (e) { fehler.push(id + " s=" + s + ": " + e.message); } await pause(); }
      zeiten[id] = { n: n, max: Math.round(max) };
    }
    return { fehler: fehler, zeiten: zeiten };
  });
  console.log("Sprites ohne Fehler je Modell (Anzahl Bilder, längste Zeit ms bei s=18):");
  for (const [id, z] of Object.entries(erg.zeiten)) console.log("  " + id.padEnd(16) + z.n + " Bilder, max " + z.max + " ms");
  /* Baustellen in der Szene + lebende Menschen: Stadt laufen lassen */
  const p2 = await br.newPage({ viewport: { width: 700, height: 500 } });
  p2.setDefaultTimeout(600000);
  p2.on("pageerror", (e) => seitenFehler.push("Stadt: " + e.message));
  p2.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) seitenFehler.push("Stadt-Konsole: " + m.text().slice(0, 300)); });
  await p2.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?quelle=1&neu=1&s=14", { waitUntil: "load", timeout: 600000 });
  await p2.waitForFunction(() => window.__fertig, null, { timeout: 600000 });
  await p2.evaluate(() => { const S = STADT.szene; let i = 0; for (const o of S.objekte) { const d = STADT.MODELLE[o.typ]; if (d.bauzeit && !o.rand) { o.bau = { fest: [0.05, 0.2, 0.35, 0.6, 0.8, 0.97][i++ % 6] }; } } S.zeit = "nacht"; });
  await p2.waitForTimeout(8000);
  await p2.evaluate(() => { STADT.szene.zeit = "tag"; STADT.szene.jahr = "fruehling"; STADT.kamera.dreh = 1; });
  await p2.waitForTimeout(8000);
  console.log("Fehler beim Malen: " + erg.fehler.length);
  erg.fehler.slice(0, 40).forEach((f) => console.log("  FEHL " + f));
  console.log("Seiten-/Konsolenfehler: " + seitenFehler.length);
  [...new Set(seitenFehler)].slice(0, 30).forEach((f) => console.log("  FEHL " + f));
  await br.close(); srv.close();
  process.exit(erg.fehler.length || seitenFehler.length ? 1 : 0);
})();
