#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 807: DIE ORIGINALKARTE ALS VORLAGE 1
   ---------------------------------------------------------------------
   XANDER: „denk an das Layout der Originalmap. Die Leute sollen sich
   sofort zurechtfinden" und „dass ich die Eisenbahn wieder hinten lang
   fahren [sehe]".
   Geprüft (Beispielstadt, ?demo=1):
   - jedes Gebäude steht im Bild dort, wo es im alten Dorf stand
     (gleiche Reihenfolge links→rechts und hinten→vorn, Rangkorrelation)
   - kein Haus, kein Wahrzeichen überdeckt ein anderes
   - die Bahn läuft hinten (hinter allen Häusern) quer durch die Karte
     und aus beiden Rändern hinaus, der Bahnhof steht an der Bahn
   - der Fluss führt vom Markt zum See, die Mühle hat ihren Bach
   - die Leute gehen auf den Wegen der Karte
   - der Rundling ist mit ?vorlage=rundling weiter da
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = path.join(__dirname, "..");
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log("  " + (gut ? "ok  " : "FEHL") + " " + was + (zusatz ? "   " + zusatz : "")); };
/* Rangkorrelation nach Spearman */
const rang = (a) => { const s = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]), r = []; s.forEach((e, i) => { r[e[1]] = i; }); return r; };
const spearman = (a, b) => { const ra = rang(a), rb = rang(b), n = a.length; let d = 0; for (let i = 0; i < n; i++) d += (ra[i] - rb[i]) ** 2; return 1 - 6 * d / (n * (n * n - 1)); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); const f = path.join(W, p); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(e.message));
  const laden = async (zusatz) => {
    await pg.goto(`http://127.0.0.1:${srv.address().port}/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst${zusatz || ""}`);
    await pg.waitForFunction(() => window.__fertig, { timeout: 120000 }).catch(() => {});
    await pg.waitForTimeout(800);
  };
  await laden("");
  console.log("\nORIGINALKARTE (Fassung 807)\n");
  const r = await pg.evaluate(() => {
    const ST = window.STADT, D = ST.dorf;
    const haeuser = ST.szene.objekte.filter((o) => o.art === "haus").map((o) => ({ k: o.spiel, x: o.x, y: o.y, f: o.fuss, d: o.dreh }));
    const wunder = ST.szene.objekte.filter((o) => o.art === "wunder").map((o) => ({ k: o.spiel, x: o.x, y: o.y, f: o.fuss, d: o.dreh }));
    const bahnhof = ST.szene.objekte.find((o) => o.bild === "k_bahnhof");
    const leute = (ST.leute && ST.leute.liste || []).length;
    return { vorlage: D.VORLAGE, plaetze: D.PLAETZE, bahn: D.BAHN, halt: D.BAHN_HALT, fluss: D.FLUSS, bach: D.MUEHLBACH, wege: D.WEGE, haeuser, wunder,
      bahnhof: bahnhof && { x: bahnhof.x, y: bahnhof.y }, knoten: ST.leute && ST.leute.knoten, leute };
  });
  sage(r.vorlage === "altdorf", "ohne Angabe gilt die Originalkarte (Vorlage „altdorf“)", r.vorlage);
  const LAGE = { muehle: [50, 74], bergwerk: [292, 62], rathaus: [160, 96], schule: [214, 86], baeckerei: [110, 114], kuhstall: [30, 118], krankenhaus: [282, 108],
    schmiede: [222, 138], huehnerstall: [70, 150], brauerei: [126, 166], bibliothek: [186, 164], labor: [272, 182], kaserne: [262, 136], gasthaus: [150, 58], gefaengnis: [240, 64], flickstube: [100, 70] };
  const ks = Object.keys(LAGE).filter((k) => r.plaetze && r.plaetze[k]);
  const bx = ks.map((k) => r.plaetze[k].x - r.plaetze[k].y), by = ks.map((k) => r.plaetze[k].x + r.plaetze[k].y);
  const rx = spearman(bx, ks.map((k) => LAGE[k][0])), ry = spearman(by, ks.map((k) => LAGE[k][1]));
  sage(ks.length === 16 && rx > 0.97 && ry > 0.97, "alle 16 Bauplätze liegen im Bild wie im alten Dorf (links→rechts und hinten→vorn)", "Rang x " + rx.toFixed(3) + ", y " + ry.toFixed(3));
  const kaesten = r.haeuser.concat(r.wunder).map((h) => { const q = Math.round(h.d) % 2 === 1, sch = h.d % 1 !== 0, w = sch ? (h.f[0] + h.f[1]) * 0.7071 : q ? h.f[1] : h.f[0], t = sch ? w : q ? h.f[0] : h.f[1]; return { k: h.k, x0: h.x - w / 2, x1: h.x + w / 2, y0: h.y - t / 2, y1: h.y + t / 2 }; });
  const ueber = [];
  for (let i = 0; i < kaesten.length; i++) for (let j = i + 1; j < kaesten.length; j++) {
    const a = kaesten[i], b = kaesten[j];
    if (a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5) ueber.push(a.k + "/" + b.k);
  }
  sage(r.haeuser.length >= 10 && ueber.length === 0, "kein Haus und kein Wahrzeichen überdeckt ein anderes", ueber.join(", ") || r.haeuser.length + " Häuser, " + r.wunder.length + " Wahrzeichen");
  const hinten = Math.min(...Object.values(r.plaetze).map((p) => p.y));
  const bys = (r.bahn || []).map((p) => p[1]), bxs = (r.bahn || []).map((p) => p[0]);
  sage(bys.length > 10 && Math.max(...bys) < hinten - 8 && Math.min(...bxs) < -112 && Math.max(...bxs) > 112, "die Bahn läuft hinten, hinter allen Häusern, durch die ganze Karte und aus beiden Rändern hinaus", "Bahn y ≤ " + Math.max(...bys) + ", hinterstes Haus y = " + hinten.toFixed(1));
  sage(!!r.bahnhof && Math.abs(r.bahnhof.y - r.halt[1]) < 12 && Math.abs(r.bahnhof.x - r.halt[0]) < 3, "der Bahnhof steht am Haltepunkt der Bahn", JSON.stringify({ bahnhof: r.bahnhof, halt: r.halt }));
  const f0 = r.fluss[0], f1 = r.fluss[r.fluss.length - 1];
  sage(Math.hypot(f0[0] + 1, f0[1] + 1) < 16 && Math.hypot(f1[0] - 66, f1[1] - 56) < 8, "der Fluss beginnt am Markt und mündet in den See", JSON.stringify({ f0, f1 }));
  const m = r.plaetze.muehle;
  sage(r.bach.some((q) => Math.abs(q[0] - (m.x + 11.5)) < 1 && Math.abs(q[1] - m.y) < 9), "der Mühlbach läuft am Wasserrad der Mühle vorbei", JSON.stringify(m));
  const aufWeg = (x, y) => r.wege.some((w) => w.some((q) => Math.hypot(q[0] - x, q[1] - y) < 4));
  sage(r.knoten && r.knoten.length > 20 && r.knoten.every((k) => aufWeg(k[0], k[1])) && r.leute > 0, "die Leute gehen auf den Wegen der Karte", (r.knoten || []).length + " Knoten, " + r.leute + " Leute");
  await pg.screenshot({ path: process.env.BILD ? process.env.BILD + "-karte.png" : "/tmp/pruefe-807.png" });
  await laden("&vorlage=rundling");
  const rund = await pg.evaluate(() => { const P = window.STADT.dorf.PLAETZE; return { v: window.STADT.dorf.VORLAGE, r: Math.hypot(P.rathaus.x, P.rathaus.y) }; });
  sage(rund.v === "rundling" && rund.r > 20 && rund.r < 26, "der Rundling bleibt mit ?vorlage=rundling erreichbar", JSON.stringify(rund));
  sage(seitenfehler.length === 0, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
