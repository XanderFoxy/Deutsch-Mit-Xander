#!/usr/bin/env node
/* =====================================================================
   STADT BACKEN — Gebäudebilder für die leichte Stadt (stadt-leicht.html)
   ---------------------------------------------------------------------
   XANDER: „ob du auf der Basis von diesem Konzept das Ganze in einem
   kleineren Maßstab schlanke und Systemressourcen sparend machen kannst"
   – „dass man das weit aufziehen kann. Das ist schön aussieht und nicht
   pixelig … wie bei dem Spiel Simpsons Tapped Out."

   Die großen Vektormodelle aus stadt/modelle/ werden hier EINMAL im
   Browser (Chromium im Container) gemalt – genau wie in Winterhausen, mit
   Licht, Schatten, Schnee, Baustelle – und als durchsichtige WebP-Bilder
   gespeichert. Das Telefon lädt später nur diese Bilder und muss nichts
   mehr rechnen.

   Je Bild entstehen zwei Dateien:
     <name>.webp    das Gebäude (mit Baustelle: Bagger, Gerüst, Kran, Leute)
     <form>_s.webp  der Schatten (nur Deckkraft, halbe Auflösung; einer je
                    Form und Drehung, gilt für alle Jahres- und Tageszeiten)
   und ein Eintrag im Verzeichnis stadt-leicht/bilder/verzeichnis.json:
     Größe, Ankerpunkt (wo der Fußpunkt des Modells im Bild liegt),
     Maßstab (Bildpunkte je Meter), Lichtpunkte und Rauchquellen.

   AUFRUF
     node werkzeug/stadt-backen.js [auftrag.json]    (ohne: stadt-leicht/backplan.json)
   Der Plan listet Aufträge: { id, bild, saat, variante, gier[], jahr[],
   zeit[], bau[], s: { gross, klein } } – siehe stadt-leicht/backplan.json.
   Schon vorhandene Bilder werden übersprungen (NEU=1 erzwingt alles).
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const ZIEL = path.join(WURZEL, "stadt-leicht", "bilder");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png" };

const planDatei = process.argv[2] || path.join(WURZEL, "stadt-leicht", "backplan.json");
const plan = JSON.parse(fs.readFileSync(planDatei, "utf8"));
const NEU = process.env.NEU === "1";
const NUR = process.env.NUR ? process.env.NUR.split(",") : null;

/* Alle Einzelbilder aus dem Plan aufzählen */
function auftraege() {
  const liste = [];
  /* Menschen: je Art, Saat, Jahres- und Tageszeit EIN Blatt mit 12 Schritten × 8 Richtungen */
  for (const a of plan.leute || []) {
    if (NUR && !NUR.includes(a.bild)) continue;
    for (const jahr of a.jahr) for (const zeit of a.zeit) liste.push({ leute: true, name: [a.bild, jahr, zeit].join("_"), id: a.id, saat: a.saat, jahr: jahr, zeit: zeit, s: a.s || 40, schritte: a.schritte || 12 });
  }
  for (const a of plan.bilder) {
    if (NUR && !NUR.includes(a.bild)) continue;
    for (const jahr of a.jahr) for (const zeit of a.zeit) for (const bau of a.bau) for (const gier of a.gier) {
      /* Baustellen werden nur tagsüber und nur mittelgroß gebacken (Plan: s.bau) */
      const stufen = bau < 1 ? [["m", a.s.bau || a.s.gross * 0.6]] : [["g", a.s.gross], ["k", a.s.klein]];
      if (bau < 1 && zeit !== "tag") continue;
      for (const [st, s] of stufen) {
        const name = [a.bild, jahr, zeit, bau < 1 ? "b" + Math.round(bau * 100) : "f", gier, st].join("_");
        /* Schatten hängen nicht an Jahres- und Tageszeit: einer je Form */
        const sname = [a.bild, bau < 1 ? "b" + Math.round(bau * 100) : "f", gier, st, "s"].join("_");
        liste.push({ name: name, sname: sname, id: a.id, saat: a.saat || 7, variante: a.variante, gier: gier, jahr: jahr, zeit: zeit, bau: bau, s: s, t: a.t || 1.5 });
      }
    }
  }
  return liste;
}

(async () => {
  fs.mkdirSync(ZIEL, { recursive: true });
  const vzDatei = path.join(ZIEL, "verzeichnis.json");
  const vz = fs.existsSync(vzDatei) ? JSON.parse(fs.readFileSync(vzDatei, "utf8")) : {};
  const liste = auftraege().filter((a) => NEU || !vz[a.name] || !fs.existsSync(path.join(ZIEL, a.name + ".webp")));
  console.log(liste.length + " Bilder zu backen");
  if (!liste.length) return;

  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: 400, height: 300 } });
  pg.on("pageerror", (e) => console.log("Seitenfehler: " + e.message));
  /* Werkbank mit einem kleinen Modell öffnen: dann sind alle Modelle geladen */
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?quelle=1&werkbank=bank&still=1&dazu=menschen", { waitUntil: "load", timeout: 300000 });
  await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 300000 });

  let n = 0;
  for (const a of liste) {
    const t0 = Date.now();
    if (a.leute) {
      const r = await pg.evaluate((a) => {
        const ST = window.STADT, SZ = ST.szene;
        SZ.jahr = a.jahr; SZ.zeit = a.zeit;
        const Z = SZ.zeitDaten(), def = ST.MODELLE[a.id], s = a.s;
        /* Zelle: links 0,9 m, rechts 3,1 m (Schatten fällt nach rechts), oben 2 m, unten 0,5 m */
        const cw = Math.ceil(4.0 * s), ch = Math.ceil(2.6 * s), ax = Math.round(0.9 * s), ay = Math.round(2.05 * s);
        const N = a.schritte, blatt = document.createElement("canvas"); blatt.width = cw * N; blatt.height = ch * 8;
        const bg = blatt.getContext("2d");
        const zelle = document.createElement("canvas"); zelle.width = cw; zelle.height = ch; const zg = zelle.getContext("2d");
        const sch = document.createElement("canvas"); sch.width = cw; sch.height = ch; const shg = sch.getContext("2d");
        for (let r = 0; r < 8; r++) for (let i = 0; i < N; i++) {
          const gier = r * 45, rad = gier * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad);
          const o = { id: 700000 + r * 100 + i, typ: a.id, x: 0, y: 0, gier: gier, saat: a.saat, immer: true };
          o._m = { r: ST.zufall(a.saat), ph: i / N, g: 1, h: rad, kopf: 0, t: 0, trink: 0 };
          ST.jetzt = 1e6 + r * 1000 + i;
          const proj = (x, y, z) => { const p = x * c - y * sn, q = x * sn + y * c; return [ax + (p - q) * ST.KX * s, ay + (p + q) * ST.KY * s - (z || 0) * ST.KZ * s]; };
          const schattenAuf = (x, y, z) => { const p = x * c - y * sn, q = x * sn + y * c; const L = ST.LICHT; const sa = p - L[0] / L[2] * (z || 0), sb = q - L[1] / L[2] * (z || 0); return [ax + (sa - sb) * ST.KX * s, ay + (sa + sb) * ST.KY * s]; };
          const P = { proj: proj, schattenAuf: schattenAuf, s: s, t: 3 + i * 0.1, Z: Z, o: { jahr: a.jahr }, g: zg, c: c, sn: sn, objekt: o, def: def, gier: gier, jahr: a.jahr, dpr: 1 };
          zg.setTransform(1, 0, 0, 1, 0, 0); zg.clearRect(0, 0, cw, ch);
          shg.setTransform(1, 0, 0, 1, 0, 0); shg.clearRect(0, 0, cw, ch);
          if (def.schatten) { shg.save(); def.schatten(shg, P); shg.restore(); }
          shg.globalCompositeOperation = "source-in"; shg.fillStyle = a.jahr === "winter" ? "rgba(40,62,120," + (Z.schatten * 1.15).toFixed(3) + ")" : "rgba(22,34,52," + Z.schatten.toFixed(3) + ")"; shg.fillRect(0, 0, cw, ch); shg.globalCompositeOperation = "source-over";
          zg.drawImage(sch, 0, 0);
          zg.save(); def.zeichnen(zg, P); zg.restore();
          bg.drawImage(zelle, i * cw, r * ch);
        }
        const url = blatt.toDataURL("image/webp", 0.82);
        return { bild: url, zw: cw, zh: ch, ax: ax, ay: ay, n: N, s: s };
      }, a);
      fs.writeFileSync(path.join(ZIEL, a.name + ".webp"), Buffer.from(r.bild.split(",")[1], "base64"));
      delete r.bild; vz[a.name] = r; n++;
      console.log(n + "/" + liste.length + " " + a.name + " " + (fs.statSync(path.join(ZIEL, a.name + ".webp")).size / 1024).toFixed(0) + " KB " + (Date.now() - t0) + " ms");
      continue;
    }
    const r = await pg.evaluate(async (a) => {
      const ST = window.STADT, SZ = ST.szene;
      SZ.jahr = a.jahr; SZ.zeit = a.zeit;
      const Z = SZ.zeitDaten();
      const def = ST.MODELLE[a.id];
      const bau = a.bau < 1 ? a.bau : 1;
      const o = { id: 900000 + Math.floor(Math.random() * 1e5), typ: a.id, x: 0, y: 0, gier: a.gier, saat: a.saat, variante: a.variante, bau: a.bau < 1 ? { fest: a.bau } : null };
      const opt = { jahr: a.jahr, bau: bau, saat: a.saat, variante: a.variante, schluessel: (a.variante || "") + "|" + a.saat, objekt: o };
      ST.jetzt = a.t * 1000;
      /* Modelle, die nach dem Kamerazoom entscheiden (Kölner Dom: ganzes Bild
         oder Kacheln), sollen den Backmaßstab sehen */
      const KS = ST.kamera.s, KD = ST.kamera.dreh; ST.kamera.s = Math.min(a.s, 10); ST.kamera.dreh = 0;
      const sp = ST.spriteMalen(a.id, Object.assign({ ungekappt: true }, opt), a.gier, a.s, Z, a.t);
      /* große Arbeitsfläche: Kran und Bagger ragen weit über das Haus hinaus */
      const rand = a.bau < 1 ? Math.ceil(a.s * 22) : 0;
      const W = sp.W + 2 * rand, H = sp.H + 2 * rand + (a.bau < 1 ? Math.ceil(a.s * 20) : 0);
      const CX = -sp.ox + rand, CY = -sp.oy + rand + (a.bau < 1 ? Math.ceil(a.s * 20) : 0);
      const bild = document.createElement("canvas"); bild.width = W; bild.height = H;
      const g = bild.getContext("2d");
      const schatten = document.createElement("canvas"); schatten.width = W; schatten.height = H;
      const sg = schatten.getContext("2d");
      const rad = a.gier * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad), s = a.s;
      const proj = (x, y, z) => { const p = x * c - y * sn, q = x * sn + y * c; return [CX + (p - q) * ST.KX * s, CY + (p + q) * ST.KY * s - (z || 0) * ST.KZ * s]; };
      const schattenAuf = (x, y, z) => { const p = x * c - y * sn, q = x * sn + y * c; const L = ST.LICHT; const sa = p - L[0] / L[2] * (z || 0), sb = q - L[1] / L[2] * (z || 0); return [CX + (sa - sb) * ST.KX * s, CY + (sa + sb) * ST.KY * s]; };
      const P = { proj: proj, schattenAuf: schattenAuf, s: s, t: a.t, Z: Z, o: opt, g: g, c: c, sn: sn, objekt: o, def: def, gier: a.gier, jahr: a.jahr, dpr: 1, backen: true };
      sg.drawImage(sp.schatten, CX + sp.ox, CY + sp.oy);
      const BS = ST.baustelle;
      /* die Baustelle malt nur, was „im Bild" liegt: Bild = unsere Arbeitsfläche */
      const KW = ST.kamera.W, KH = ST.kamera.H; ST.kamera.W = W; ST.kamera.H = H; SZ.ohneBudget = true;
      if (a.bau < 1 && BS && BS.schatten) { sg.save(); BS.schatten(sg, P, o, bau); sg.restore(); }
      if (a.bau < 1 && BS && BS.hinten) { g.save(); BS.hinten(g, P, o, bau); g.restore(); }
      g.drawImage(sp.bild, CX + sp.ox, CY + sp.oy);
      for (const fn of sp.leben) { g.save(); try { fn(g, P); } catch (e) { console.error(e); } g.restore(); }
      if (a.bau < 1 && BS && BS.vorne) { g.save(); BS.vorne(g, P, o, bau); g.restore(); }
      ST.kamera.W = KW; ST.kamera.H = KH; ST.kamera.s = KS; ST.kamera.dreh = KD;
      /* auf das Sichtbare zuschneiden (beide Ebenen gemeinsam) */
      const kasten = (cv) => {
        const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data, w = cv.width, h = cv.height;
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y++) { const r = y * w * 4; for (let x = 0; x < w; x++) if (d[r + x * 4 + 3] > 2) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
        return x1 < 0 ? null : [x0, y0, x1 + 1, y1 + 1];
      };
      const kb = kasten(bild) || [0, 0, 2, 2], ks = kasten(schatten) || kb;
      const zu = (cv, k, f) => { const w = Math.max(1, Math.round((k[2] - k[0]) * f)), h = Math.max(1, Math.round((k[3] - k[1]) * f)); const n = document.createElement("canvas"); n.width = w; n.height = h; const ng = n.getContext("2d"); ng.imageSmoothingQuality = "high"; ng.drawImage(cv, k[0], k[1], k[2] - k[0], k[3] - k[1], 0, 0, w, h); return n; };
      const b2 = zu(bild, kb, 1), s2 = zu(schatten, ks, 0.5);
      const erg = {
        bild: b2.toDataURL("image/webp", a.bau < 1 ? 0.8 : 0.86), schatten: s2.toDataURL("image/webp", 0.7),
        w: b2.width, h: b2.height, ax: Math.round((CX - kb[0]) * 10) / 10, ay: Math.round((CY - kb[1]) * 10) / 10,
        sw: s2.width, sh: s2.height, sax: Math.round((CX - ks[0]) * 10) / 10, say: Math.round((CY - ks[1]) * 10) / 10,
        s: s,
        /* Lichter und Rauch relativ zum Fußpunkt, in Bildpunkten dieses Maßstabs */
        l: sp.lichter.map((l) => [Math.round((l.x + sp.ox) * 10) / 10, Math.round((l.y + sp.oy) * 10) / 10, Math.round(l.r * 10) / 10, l.farbe, Math.round((l.k == null ? 1 : l.k) * 100) / 100, l.flacker ? 1 : 0, l.boden ? 1 : 0]),
        r: sp.rauch.map((r) => [Math.round((r.x + sp.ox) * 10) / 10, Math.round((r.y + sp.oy) * 10) / 10, Math.round((r.k == null ? 1 : r.k) * 100) / 100])
      };
      bild.width = bild.height = 0; schatten.width = schatten.height = 0; sp.bild.width = 0; sp.schatten.width = 0;
      return erg;
    }, a);
    fs.writeFileSync(path.join(ZIEL, a.name + ".webp"), Buffer.from(r.bild.split(",")[1], "base64"));
    const sd = path.join(ZIEL, a.sname + ".webp");
    if (NEU || !fs.existsSync(sd)) fs.writeFileSync(sd, Buffer.from(r.schatten.split(",")[1], "base64"));
    r.sn = a.sname;
    delete r.bild; delete r.schatten;
    vz[a.name] = r;
    n++;
    const kb = (fs.statSync(path.join(ZIEL, a.name + ".webp")).size / 1024).toFixed(0);
    console.log(n + "/" + liste.length + " " + a.name + " " + r.w + "×" + r.h + " " + kb + " KB " + (Date.now() - t0) + " ms");
    if (n % 10 === 0) fs.writeFileSync(vzDatei, JSON.stringify(vz));
  }
  fs.writeFileSync(vzDatei, JSON.stringify(vz));
  await br.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
