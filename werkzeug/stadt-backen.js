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
    for (const jahr of a.jahr) for (const zeit of a.zeit) liste.push({ leute: true, name: [a.bild, jahr, zeit].join("_"), id: a.id, saat: a.saat, jahr: jahr, zeit: zeit, s: a.s || 40, schritte: a.schritte || 12, zelle: a.zelle, q: a.q });
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
  /* FASSUNG 812 — Drehblätter der Auftritte (siehe drehblattBacken unten) */
  const dreh = (plan.drehblaetter || []).filter((a) => (!NUR || NUR.includes(a.bild)) && (NEU || !fs.existsSync(path.join(ZIEL, a.bild + ".json"))));
  console.log(liste.length + " Bilder zu backen" + (dreh.length ? ", " + dreh.length + " Drehblätter" : ""));
  if (!liste.length && !dreh.length) return;
  if (!liste.length) { await drehblaetterBacken(dreh); return; }

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
        /* Zelle: links 0,9 m, rechts 3,1 m (Schatten fällt nach rechts), oben 2 m, unten 0,5 m.
           Andere Figuren (Tretboot) geben im Plan ihre eigene Zelle an: zelle: [links, rechts, oben, unten] in Metern */
        const Zl = a.zelle || [0.9, 3.1, 2.05, 0.55];
        const cw = Math.ceil((Zl[0] + Zl[1]) * s), ch = Math.ceil((Zl[2] + Zl[3]) * s), ax = Math.round(Zl[0] * s), ay = Math.round(Zl[2] * s);
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
        const url = blatt.toDataURL("image/webp", a.q || 0.82);
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
  if (dreh.length) await drehblaetterBacken(dreh);
})().catch((e) => { console.error(e); process.exit(1); });

/* =====================================================================
   FASSUNG 812 — DREHBLÄTTER FÜR DIE AUFTRITTE IM KLASSENZIMMER
   ---------------------------------------------------------------------
   XANDER (wörtlich): „dieses Batmobil hätte ich nicht nur in dem Spiel
   gerne das als fahrendes Auto zu sehen ist, sondern auch als
   Einstiegsanimation und da möcht ich, dass du dir mehr Mühe gibst,
   genauso wie du hier denkst in diesem 3-D Maßstab möchte ich, dass das
   Auto herein gefahren kommt um eine Kurve quietschen, so dass man es
   schön von vorne sieht und dann soll es wieder in einem Bogen
   realistisch wieder die Fahrt in die andere Richtung machen" – und zum
   Dodge Viper: „meine Lieblingsanimation, so ein richtig schöner roter
   Dodge Viper … Dafür sollst du dir richtig Zeit lassen".

   Ein Drehblatt zeigt das Auto aus <gier> Blickwinkeln rundum (32 →
   alle 11,25°), gemalt vom selben 3D-Modell wie in der Stadt, aber aus
   einer flacheren Kamera (plan.neigung, z. B. 20° statt 30° – so sieht
   man das Auto wie auf einem Werbefoto und nicht von oben).

   Die Räder: je Blickwinkel die KAROSSERIE OHNE RÄDER (variante
   „rad:aus", die Radflächen bleiben als Maß im Modell) und dazu kleine
   „Flicken" je Rad, Lenkeinschlag (plan.lenk) und Radstellung
   (plan.roll): das Modell wird mit genau diesem einen Rad gemalt, und
   alles, was sich gegenüber der Karosserie allein geändert hat, ist das
   sichtbare Rad – richtig verdeckt von Stoßstange, Kotflügel und
   Karosserie. So kostet jede weitere Radstellung nur ein paar Kilobyte
   statt eines ganzen Bildes. Beim Abspielen: Karosserie, dann die
   Flicken nach Tiefe (hinten zuerst).

   Der Schatten ist eine eigene Ebene (halbe Auflösung, nur Deckkraft).

   Ergebnis in stadt-leicht/bilder/:
     <bild>_1.webp, <bild>_2.webp …  Blätter (Karosserie und Flicken)
     <bild>_s.webp                   Schattenblatt
     <bild>.json                     wo was liegt (Anker, Flicken, Maßstab)
   ===================================================================== */
async function drehblaetterBacken(dreh) {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  for (const a of dreh) {
    const t0 = Date.now();
    const pg = await br.newPage({ viewport: { width: 400, height: 300 } });
    pg.on("pageerror", (e) => console.log("Seitenfehler: " + e.message));
    pg.on("console", (m) => { if (m.type() === "error") console.log("Konsole: " + m.text()); });
    /* Die flachere Kamera: nur für diesen Backlauf wird der Kern mit einer anderen
       Neigung ausgeliefert (die Stadt selbst bleibt bei 30°). */
    const neig = a.neigung || 30;
    await pg.route(/\/stadt\/kern\.js/, async (route) => {
      let t = fs.readFileSync(path.join(WURZEL, "stadt", "kern.js"), "utf8");
      const vorher = t;
      t = t.replace("const KY = Math.SQRT1_2 * 0.5;", "const NEIG = " + neig + " * Math.PI / 180;\n  const KY = Math.SQRT1_2 * Math.sin(NEIG);")
        .replace("const KZ = Math.sqrt(3) / 2;", "const KZ = Math.cos(NEIG);")
        .replace("const ZUM_AUGE = [KZ * Math.SQRT1_2, KZ * Math.SQRT1_2, 0.5];", "const ZUM_AUGE = [KZ * Math.SQRT1_2, KZ * Math.SQRT1_2, Math.sin(NEIG)];");
      if ((t.match(/NEIG\)/g) || []).length !== 3 || t === vorher) throw new Error("kern.js: Kamerazeilen nicht gefunden – Neigung lässt sich nicht setzen");
      await route.fulfill({ contentType: "text/javascript", body: t });
    });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?quelle=1&werkbank=bank&still=1", { waitUntil: "load", timeout: 300000 });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 300000 });
    const kz = await pg.evaluate(() => window.STADT.KZ);
    if (Math.abs(kz - Math.cos(neig * Math.PI / 180)) > 1e-9) throw new Error("Neigung nicht gesetzt (KZ " + kz + ")");
    const N = a.gier || 32;
    await pg.evaluate(() => { window.__DREH = []; });
    for (let i = 0; i < N; i++) {
      const info = await pg.evaluate((arg) => {
        const a = arg.a, i = arg.i, N = arg.N;
        const ST = window.STADT, SZ = ST.szene;
        SZ.jahr = a.jahr || "herbst"; SZ.zeit = a.zeit || "tag";
        const gier = i * 360 / N;
        /* Maßstab je Blickwinkel: von vorn (Gier 315°, am Halt ganz nah) am feinsten (plan.sVorn),
           von der Seite und hinten (weiter weg) plan.s – dazwischen weich übergehend */
        const vorn = Math.max(0, Math.cos((gier - 315) * Math.PI / 180));
        const Z = SZ.zeitDaten(), s = Math.round((a.s + ((a.sVorn || a.s) - a.s) * vorn * vorn) * 10) / 10;
        const feld = a.feld || [8, 6];
        const WW = Math.ceil(feld[0] * s), HH = Math.ceil(feld[1] * s), CX = Math.round(WW / 2), CY = Math.round(HH * 0.62);
        const malen = (variante, mitSchatten) => {
          const o = { id: 1, typ: a.id, x: 0, y: 0, gier: gier, saat: 7, variante: variante };
          const opt = { ungekappt: true, jahr: SZ.jahr, bau: 1, saat: 7, variante: variante, schluessel: variante + "|7", objekt: o };
          ST.jetzt = 1500;
          const sp = ST.spriteMalen(a.id, opt, gier, s, Z, 1.5);
          const cv = document.createElement("canvas"); cv.width = WW; cv.height = HH;
          cv.getContext("2d").drawImage(sp.bild, CX + sp.ox, CY + sp.oy);
          let sch = null;
          if (mitSchatten) { sch = document.createElement("canvas"); sch.width = WW; sch.height = HH; sch.getContext("2d").drawImage(sp.schatten, CX + sp.ox, CY + sp.oy); }
          sp.bild.width = 0; sp.schatten.width = 0;
          return { cv: cv, sch: sch };
        };
        const kasten = (d, x0, y0, x1, y1, w) => {
          let a0 = x1, b0 = y1, a1 = x0 - 1, b1 = y0 - 1;
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (d[(y * w + x) * 4 + 3] > 2) { if (x < a0) a0 = x; if (x > a1) a1 = x; if (y < b0) b0 = y; if (y > b1) b1 = y; }
          return a1 < a0 ? null : [a0, b0, a1 + 1, b1 + 1];
        };
        const zu = (cv, k, f) => { const w = Math.max(1, Math.round((k[2] - k[0]) * f)), h = Math.max(1, Math.round((k[3] - k[1]) * f)); const n = document.createElement("canvas"); n.width = w; n.height = h; const g = n.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(cv, k[0], k[1], k[2] - k[0], k[3] - k[1], 0, 0, w, h); return n; };
        /* 1) Karosserie ohne Räder, mit Schatten */
        const basis = malen("rad:aus", true);
        const bd = basis.cv.getContext("2d").getImageData(0, 0, WW, HH).data;
        const kb = kasten(bd, 0, 0, WW, HH, WW);
        /* Schatten weicher: noch einmal weichgezeichnet (Halbschatten, wie an einem hellen Tag) */
        const weich = document.createElement("canvas"); weich.width = WW; weich.height = HH;
        const wg = weich.getContext("2d"); wg.filter = "blur(" + (s * (a.schattenWeich || 0.06)).toFixed(1) + "px)"; wg.drawImage(basis.sch, 0, 0);
        const sd = weich.getContext("2d").getImageData(0, 0, WW, HH).data;
        const ks = kasten(sd, 0, 0, WW, HH, WW) || kb;
        const eintrag = { g: gier, m: s, a: [CX - kb[0], CY - kb[1]], k: zu(basis.cv, kb, 1), s: zu(weich, ks, 0.5), so: [ks[0] - CX, ks[1] - CY], r: [] };
        /* 2) Flicken je Rad: nur dieses Rad malen, Unterschied zur Karosserie ausschneiden */
        const rad = gier * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad);
        const proj = (p) => { const x = p[0] * c - p[1] * sn, y = p[0] * sn + p[1] * c; return [CX + (x - y) * ST.KX * s, CY + (x + y) * ST.KY * s - p[2] * ST.KZ * s, x * ST.ZUM_AUGE[0] + y * ST.ZUM_AUGE[1] + p[2] * ST.ZUM_AUGE[2]]; };
        /* Die Räder der abgewandten Seite (man sieht ihre Innenseite, meist nur unten ein Stück
           unter der Karosserie) bekommen nur eine Radstellung – das Drehen sieht man dort nicht,
           es spart fast die Hälfte. Welche Seite abgewandt ist: die Außenseite (+x links, −x
           rechts) zeigt vom Betrachter weg. Genau von vorn/hinten gelten beide als zugewandt. */
        const seite = (c + sn) * ST.ZUM_AUGE[0];
        const fern = seite > 0.05 ? { vr: 1, hr: 1 } : seite < -0.05 ? { vl: 1, hl: 1 } : {};
        for (const nm of ["vl", "vr", "hl", "hr"]) {
          const m = a.raeder[nm], P = proj(m), R = (m[2] + 0.22) * s;
          const x0 = Math.max(0, Math.floor(P[0] - R)), x1 = Math.min(WW, Math.ceil(P[0] + R)), y0 = Math.max(0, Math.floor(P[1] - R)), y1 = Math.min(HH, Math.ceil(P[1] + R));
          const lenks = nm[0] === "v" ? a.lenk : [0];
          lenks.forEach((lenk, li) => a.roll.forEach((roll, ki) => {
            if (fern[nm] && ki > 0) return;
            const r = malen("rad:" + nm + ":" + lenk + ":" + roll, false);
            const g = r.cv.getContext("2d"), img = g.getImageData(x0, y0, x1 - x0, y1 - y0), d = img.data, w = x1 - x0;
            let a0 = x1, b0 = y1, a1 = -1, b1 = -1, stark = 0;
            for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
              const o = ((y - y0) * w + (x - x0)) * 4, ob = (y * WW + x) * 4;
              const diff = Math.abs(d[o] - bd[ob]) + Math.abs(d[o + 1] - bd[ob + 1]) + Math.abs(d[o + 2] - bd[ob + 2]) + Math.abs(d[o + 3] - bd[ob + 3]);
              if (diff > 6) { if (x < a0) a0 = x; if (x > a1) a1 = x; if (y < b0) b0 = y; if (y > b1) b1 = y; if (diff > 60) stark++; }
              else { d[o] = d[o + 1] = d[o + 2] = d[o + 3] = 0; }
            }
            /* ganz verdeckt – oder nur ein Hauch durch die Kantenglättung der Karosserie: weglassen */
            if (a1 < 0 || stark < 0.004 * s * s) return;
            g.putImageData(img, x0, y0);
            eintrag.r.push({ rad: nm, l: nm[0] === "v" ? li : -1, k: ki, n: Math.round(P[2] * 1000) / 1000, o: [a0 - CX, b0 - CY], bild: zu(r.cv, [a0, b0, a1 + 1, b1 + 1], 1) });
          }));
        }
        window.__DREH[i] = eintrag;
        return { w: eintrag.k.width, h: eintrag.k.height, flicken: eintrag.r.length, s: s };
      }, { a: a, i: i, N: N });
      console.log(a.bild + " " + (i + 1) + "/" + N + " Gier " + (i * 360 / N) + "° (" + info.s + " px/m): " + info.w + "×" + info.h + ", " + info.flicken + " Radflicken");
    }
    /* 3) Alles auf Blätter packen (Regale: nach Höhe sortiert, 2 px Luft) */
    const erg = await pg.evaluate((a) => {
      const D = window.__DREH, BB = a.blattBreite || 2048, BH = a.blattHoehe || 4096, LUFT = 2;
      const packen = (stuecke) => {
        stuecke.sort((p, q) => q.cv.height - p.cv.height || q.cv.width - p.cv.width);
        const blaetter = []; let bl = null, x = 0, y = 0, zeile = 0;
        for (const st of stuecke) {
          const w = st.cv.width + LUFT, h = st.cv.height + LUFT;
          if (!bl || x + w > BB) { y += zeile; x = 0; zeile = 0; }
          if (!bl || y + h > BH) { bl = { teile: [], h: 0 }; blaetter.push(bl); x = 0; y = 0; zeile = 0; }
          st.ort = [blaetter.length - 1, x + 1, y + 1, st.cv.width, st.cv.height];
          bl.teile.push(st); bl.h = Math.max(bl.h, y + h); x += w; zeile = Math.max(zeile, h);
        }
        return blaetter.map((b) => {
          const cv = document.createElement("canvas"); cv.width = BB; cv.height = b.h;
          const g = cv.getContext("2d");
          for (const st of b.teile) g.drawImage(st.cv, st.ort[1], st.ort[2]);
          return cv;
        });
      };
      const koerper = [], schatten = [];
      D.forEach((e) => { koerper.push({ cv: e.k, e: e, art: "k" }); e.r.forEach((f) => koerper.push({ cv: f.bild, e: f, art: "r" })); schatten.push({ cv: e.s, e: e, art: "s" }); });
      const bk = packen(koerper), bs = packen(schatten);
      /* Blätter so schmal wie nötig */
      const schmal = (cv) => { const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data; let r = 0; for (let y = 0; y < cv.height; y++) for (let x = cv.width - 1; x > r; x--) if (d[(y * cv.width + x) * 4 + 3]) { r = x; break; } const n = document.createElement("canvas"); n.width = r + 3; n.height = cv.height; n.getContext("2d").drawImage(cv, 0, 0); return n; };
      const blaetter = bk.map((cv) => schmal(cv).toDataURL("image/webp", a.q || 0.8));
      const sblatt = schmal(bs[0]).toDataURL("image/webp", a.qs || 0.7);
      const pixel = bk.reduce((t, cv) => t + cv.width * cv.height, 0);
      const bilder = D.map((e) => ({
        g: e.g, m: e.m, a: e.a, b: koerper.find((st) => st.e === e && st.art === "k").ort,
        s: schatten.find((st) => st.e === e).ort, so: e.so,
        r: e.r.map((f) => ({ rad: f.rad, l: f.l, k: f.k, n: f.n, o: f.o, b: koerper.find((st) => st.e === f).ort }))
      }));
      return { blaetter: blaetter, sblatt: sblatt, bilder: bilder, pixel: pixel, sb: bs.length };
    }, a);
    if (erg.sb > 1) throw new Error("Schattenblatt zu groß");
    const namen = [];
    erg.blaetter.forEach((u, k) => { const n = a.bild + "_" + (k + 1) + ".webp"; fs.writeFileSync(path.join(ZIEL, n), Buffer.from(u.split(",")[1], "base64")); namen.push(n); });
    fs.writeFileSync(path.join(ZIEL, a.bild + "_s.webp"), Buffer.from(erg.sblatt.split(",")[1], "base64"));
    const meta = {
      hinweis: "Drehblatt (werkzeug/stadt-backen.js, FASSUNG 812): m = Bildpunkte je Meter dieses Blickwinkels, b = [Blatt, x, y, w, h], a = Anker (Fußpunkt der Wagenmitte) im Bild, Flicken r: o = linke obere Ecke relativ zum Anker, l = Lenk-, k = Radstellung, n = Tiefe (größer = näher). Schatten in halber Auflösung, so = Ecke relativ zum Anker (volle Auflösung).",
      id: a.id, s: a.s, neigung: neig, gier: N, lenk: a.lenk, roll: a.roll, raeder: a.raeder, punkte: a.punkte || {},
      blaetter: namen, schatten: a.bild + "_s.webp", sf: 0.5, bilder: erg.bilder
    };
    fs.writeFileSync(path.join(ZIEL, a.bild + ".json"), JSON.stringify(meta));
    const kb = namen.reduce((t, n) => t + fs.statSync(path.join(ZIEL, n)).size, 0) / 1024;
    console.log(a.bild + ": " + namen.length + " Blatt/Blätter, " + (erg.pixel / 1e6).toFixed(1) + " Mio. Bildpunkte, " + kb.toFixed(0) + " KB (+ Schatten " + (fs.statSync(path.join(ZIEL, a.bild + "_s.webp")).size / 1024).toFixed(0) + " KB), " + ((Date.now() - t0) / 1000).toFixed(0) + " s");
    await pg.close();
  }
  await br.close(); srv.close();
}
