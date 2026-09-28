#!/usr/bin/env node
/* =====================================================================
   WEIHNACHTSMANN BACKEN — Rentierschlitten für die leichte Stadt
   ---------------------------------------------------------------------
   XANDER: „mit Santa Claus, der animiert durch den Himmel fliegt".
   Das Gespann aus stadt/himmel.js (Rudolph, acht Rentiere im Galopp,
   Schlitten, Weihnachtsmann) wird hier für 8 Flugrichtungen im Bild und
   8 Galopp-Schritte gemalt und als ein Blatt gespeichert
   (stadt-leicht/bilder/santa_<zeit>.webp, Zeile = Richtung, Spalte =
   Schritt). Eintrag im Verzeichnis: Zellgröße, Anker (Schlitten),
   Maßstab.  AUFRUF: node werkzeug/santa-backen.js
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { PNG } = require("/tmp/claude-0/node_modules/pngjs");
const WURZEL = path.join(__dirname, "..");
const ZIEL = path.join(WURZEL, "stadt-leicht", "bilder");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const W = 1100, H = 800, S = 20, SCHRITTE = 8;
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const vzDatei = path.join(ZIEL, "verzeichnis.json");
  const vz = JSON.parse(fs.readFileSync(vzDatei, "utf8"));
  for (const zeit of ["tag", "nacht"]) {
    const reihen = [];
    for (let r = 0; r < 8; r++) {
      const kurs = r * 45;
      const pg = await br.newPage({ viewport: { width: W, height: H } });
      pg.on("pageerror", (e) => console.log("Seitenfehler: " + e.message));
      await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?quelle=1&werkbank=bank&still=1&jahr=winter&zeit=" + zeit + "&s=" + S + "&santa=0.5&santakurs=" + kurs + "&santahoehe=40", { waitUntil: "load", timeout: 300000 });
      await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 300000 });
      const bilder = await pg.evaluate(([n]) => {
        const ST = window.STADT, SZ = ST.szene, K = ST.kamera;
        ST.himmel.mess.ohneSchatten = true; ST.himmel.mess.ohneDunst = true; ST.himmel.mess.ohneSpur = true;
        const aus = [];
        for (let i = 0; i < n; i++) {
          /* ein Galopp dauert ≈ 1 / (1,6 + 0,04·v) s ≈ 0,48 s */
          const t = 30 + i * (0.48 / n);
          const c = document.createElement("canvas"); c.width = K.W; c.height = K.H;
          ST.himmel.zeichnen(c.getContext("2d"), t, SZ.zeitDaten(), SZ);
          aus.push(c.toDataURL("image/png"));
        }
        return aus;
      }, [SCHRITTE]);
      await pg.close();
      reihen.push(bilder.map((b) => PNG.sync.read(Buffer.from(b.split(",")[1], "base64"))));
      console.log(zeit + " Richtung " + kurs + "° fertig");
    }
    /* gemeinsamer Kasten aller Bilder (damit der Anker überall gleich sitzt) */
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (const reihe of reihen) for (const p of reihe) for (let y = 0; y < p.height; y++) for (let x = 0; x < p.width; x++) if (p.data[(y * p.width + x) * 4 + 3] > 3) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(W - 1, x1 + 2); y1 = Math.min(H - 1, y1 + 2);
    const zw = x1 - x0 + 1, zh = y1 - y0 + 1;
    const blatt = new PNG({ width: zw * SCHRITTE, height: zh * 8 });
    reihen.forEach((reihe, r) => reihe.forEach((p, i) => PNG.bitblt(p, blatt, x0, y0, zw, zh, i * zw, r * zh)));
    const png = path.join(ZIEL, "santa_" + zeit + ".png");
    fs.writeFileSync(png, PNG.sync.write(blatt));
    /* nach WebP (Chromium kann das) */
    const pg = await br.newPage();
    const webp = await pg.evaluate(async (daten) => {
      const img = new Image(); img.src = "data:image/png;base64," + daten; await img.decode();
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; c.getContext("2d").drawImage(img, 0, 0);
      return c.toDataURL("image/webp", 0.85);
    }, fs.readFileSync(png).toString("base64"));
    await pg.close();
    fs.writeFileSync(path.join(ZIEL, "santa_" + zeit + ".webp"), Buffer.from(webp.split(",")[1], "base64"));
    fs.unlinkSync(png);
    /* Anker = Bildmitte (dort steht der Schlitten), Maßstab wie im Himmel: max(s, √(24·s)) */
    vz["santa_" + zeit] = { zw: zw, zh: zh, ax: W / 2 - x0, ay: H / 2 - y0, n: SCHRITTE, s: Math.max(S, Math.sqrt(24 * S)) };
    console.log("santa_" + zeit + ".webp " + zw + "×" + zh + " je Bild, " + (fs.statSync(path.join(ZIEL, "santa_" + zeit + ".webp")).size / 1024).toFixed(0) + " KB");
  }
  fs.writeFileSync(vzDatei, JSON.stringify(vz));
  await br.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
