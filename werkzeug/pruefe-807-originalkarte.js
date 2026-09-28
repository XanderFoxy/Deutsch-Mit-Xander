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
   FASSUNG 808 — XANDER: „das soll genau das selbe Bild sein … oben war die
   Horizontlinie … ist der Zug an diesem Rand entlanggefahren … wo ich mein
   Berliner Fernsehturm stehen habe". Die Bahn läuft im Bild waagerecht oben
   (Welt: v = x + y fest), dahinter Horizont und Alpen; die Häuser schauen
   zum Betrachter; die Wahrzeichen stehen auf den Plätzen des alten Dorfs.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = path.join(__dirname, "..");
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log("  " + (gut ? "ok  " : "FEHL") + " " + was + (zusatz ? "   " + zusatz : "")); };
/* Rangkorrelation nach Spearman */
const rang = (a) => { const s = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]), r = []; s.forEach((e, i) => { r[e[1]] = i; }); return r; };
/* Dorfbild (320 × 200) → Welt, wie dorf.js welt() */
const welt = (px, py) => { const u = (px - 160) * 0.47 / Math.SQRT1_2, v = (py - 118) * 0.40 / (Math.SQRT1_2 * 0.5); return [(u + v) / 2, (v - u) / 2]; };
const spearman = (a, b) => { const ra = rang(a), rb = rang(b), n = a.length; let d = 0; for (let i = 0; i < n; i++) d += (ra[i] - rb[i]) ** 2; return 1 - 6 * d / (n * (n * n - 1)); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); const f = path.join(W, p); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(e.message));
  const laden = async (zusatz) => {
    await pg.goto(`http://127.0.0.1:${srv.address().port}/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst${process.env.QUELLE ? "&quelle=1" : ""}${zusatz || ""}`);
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
    return { vorlage: D.VORLAGE, horizont: D.HORIZONT, see: D.SEE_VERSATZ || [0, 0], plaetze: D.PLAETZE, bahn: D.BAHN, halt: D.BAHN_HALT, fluss: D.FLUSS, bach: D.MUEHLBACH, wege: D.WEGE, haeuser, wunder,
      bahnhof: bahnhof && { x: bahnhof.x, y: bahnhof.y }, knoten: ST.leute && ST.leute.knoten, leute };
  });
  sage(r.vorlage === "altdorf", "ohne Angabe gilt die Originalkarte (Vorlage „altdorf“)", r.vorlage);
  const LAGE = { muehle: [50, 74], bergwerk: [292, 62], rathaus: [160, 96], schule: [214, 86], baeckerei: [110, 114], kuhstall: [30, 118], krankenhaus: [282, 108],
    schmiede: [222, 138], huehnerstall: [70, 150], brauerei: [126, 166], bibliothek: [186, 164], labor: [272, 182], kaserne: [262, 136], gasthaus: [150, 58], gefaengnis: [240, 64], flickstube: [100, 70] };
  const ks = Object.keys(LAGE).filter((k) => r.plaetze && r.plaetze[k]);
  const bx = ks.map((k) => r.plaetze[k].x - r.plaetze[k].y), by = ks.map((k) => r.plaetze[k].x + r.plaetze[k].y);
  const rx = spearman(bx, ks.map((k) => LAGE[k][0])), ry = spearman(by, ks.map((k) => LAGE[k][1]));
  sage(ks.length === 16 && rx > 0.97 && ry > 0.97, "alle 16 Bauplätze liegen im Bild wie im alten Dorf (links→rechts und hinten→vorn)", "Rang x " + rx.toFixed(3) + ", y " + ry.toFixed(3));
  /* FASSUNG 808 — gedrehte Grundrisse (auch 45°) genau prüfen: Trennachsen-Test der beiden Rechtecke */
  const ecken = (h) => { const w = h.d * Math.PI / 2, c = Math.cos(w), sn = Math.sin(w), a = h.f[0] / 2 - 0.25, b = h.f[1] / 2 - 0.25; return [[-a, -b], [a, -b], [a, b], [-a, b]].map(([u, v]) => [h.x + u * c - v * sn, h.y + u * sn + v * c]); };
  const trennt = (A, Bq) => { for (const P of [A, Bq]) for (let i = 0; i < 4; i++) { const p = P[i], q = P[(i + 1) % 4], nx = q[1] - p[1], ny = p[0] - q[0]; const pr = (Q) => Q.map((e) => e[0] * nx + e[1] * ny); const a = pr(A), b = pr(Bq); if (Math.max(...a) < Math.min(...b) || Math.max(...b) < Math.min(...a)) return true; } return false; };
  const alle = r.haeuser.concat(r.wunder), ueber = [];
  for (let i = 0; i < alle.length; i++) for (let j = i + 1; j < alle.length; j++) if (!trennt(ecken(alle[i]), ecken(alle[j]))) ueber.push(alle[i].k + "/" + alle[j].k);
  sage(r.haeuser.length >= 10 && ueber.length === 0, "kein Haus und kein Wahrzeichen überdeckt ein anderes", ueber.join(", ") || r.haeuser.length + " Häuser, " + r.wunder.length + " Wahrzeichen");
  /* Bildachsen: u = x − y (links → rechts), v = x + y (hinten → vorn) */
  const hinten = Math.min(...Object.values(r.plaetze).map((p) => p.x + p.y));
  const bv = (r.bahn || []).map((p) => p[0] + p[1]), bu = (r.bahn || []).map((p) => p[0] - p[1]);
  sage(bv.length > 10 && Math.max(...bv) < hinten - 12 && Math.max(...bv) - Math.min(...bv) < 8 && Math.min(...bu) < -120 && Math.max(...bu) > 120, "die Bahn läuft oben waagerecht durchs Bild, hinter allen Häusern, und an beiden Seiten hinaus", "Bahn v " + Math.min(...bv).toFixed(1) + " … " + Math.max(...bv).toFixed(1) + ", vorderstes … hinterstes Haus v = " + hinten.toFixed(1));
  const hv = r.halt[0] + r.halt[1], hu = r.halt[0] - r.halt[1];
  sage(!!r.bahnhof && Math.hypot(r.bahnhof.x - r.halt[0], r.bahnhof.y - r.halt[1]) < 14 && r.bahnhof.x + r.bahnhof.y < hv && Math.abs(r.bahnhof.x - r.bahnhof.y - hu) < 3, "der Bahnhof steht hinter dem Gleis am Haltepunkt (wie im alten Bild)", JSON.stringify({ bahnhof: r.bahnhof, halt: r.halt }));
  sage(r.horizont != null && Math.max(...bv) < r.horizont + 20 && Math.min(...bv) > r.horizont, "zwischen Bahn und Horizont nur ein schmaler Streifen (die Alpen gleich dahinter)", "Horizont v = " + r.horizont);
  const f0 = r.fluss[0], f1 = r.fluss[r.fluss.length - 1], zunge = [66 + r.see[0], 56 + r.see[1]];
  sage(f0[0] + f0[1] < -40 && Math.hypot(f1[0] - zunge[0], f1[1] - zunge[1]) < 13, "der Fluss entspringt oben und mündet unten in den See", JSON.stringify({ f0, f1, zunge }));
  const zb = welt(231, 190);
  sage(Math.hypot(zunge[0] - zb[0], zunge[1] - zb[1]) < 10, "die Zunge des Sees liegt wie im alten Bild unten rechts der Mitte", JSON.stringify({ zunge, altesBild: zb.map((z) => +z.toFixed(1)) }));
  const falsch = r.haeuser.filter((h) => h.k !== "muehle" && h.d !== 3.5).map((h) => h.k + ":" + h.d);
  sage(r.haeuser.length >= 10 && !falsch.length, "alle Häuser schauen wie im alten Bild zum Betrachter (die Mühle mit dem Rad am Bach)", falsch.join(", "));
  const m = r.plaetze.muehle;
  sage(r.bach.some((q) => Math.abs(q[0] - (m.x + 11.5)) < 1 && Math.abs(q[1] - m.y) < 9), "der Mühlbach läuft am Wasserrad der Mühle vorbei", JSON.stringify(m));
  const aufWeg = (x, y) => r.wege.some((w) => w.some((q) => Math.hypot(q[0] - x, q[1] - y) < 4));
  sage(r.knoten && r.knoten.length > 20 && r.knoten.every((k) => aufWeg(k[0], k[1])) && r.leute > 0, "die Leute gehen auf den Wegen der Karte", (r.knoten || []).length + " Knoten, " + r.leute + " Leute");
  /* Himmel und Alpen: im Überblick oben Himmelblau, darunter die Berge, darunter Wiese */
  await pg.evaluate(() => { const K = STADT.kamera; K.x = -30; K.y = -30; K.s = 3.2 * K.dpr; STADT.leicht.unruhe = 3; });
  await pg.waitForTimeout(1500);
  const farbe = await pg.evaluate(() => {
    const D = STADT.dorf, A = STADT.proj(D.HORIZONT / 2, D.HORIZONT / 2, 0), c = document.getElementById("lDinge");
    const g = c.getContext("2d"), px = (y) => Array.from(g.getImageData(Math.round(c.width / 2), Math.max(0, Math.round(y)), 1, 1).data);
    return { yh: A[1] / c.height, himmel: px(A[1] - 40 * STADT.kamera.s), berg: px(A[1] - 6 * STADT.kamera.s), hinten: STADT.szene.objekte.filter((o) => o.hinten).length,
      hintenGezeigt: STADT.szene.sichtbare.filter((e) => e.o.hinten).length };
  });
  const blau = (p) => p[3] > 200 && p[2] > p[0] + 25;
  sage(farbe.yh > 0.05 && farbe.yh < 0.6 && blau(farbe.himmel) && !blau(farbe.berg) && farbe.berg[3] > 200, "oben der Himmel, darunter die Alpen, darunter die Wiese (Horizontlinie quer über dem Bild)", JSON.stringify(farbe));
  sage(farbe.hinten > 0 && farbe.hintenGezeigt === 0, "was hinter dem Horizont steht, ist beim Blick nach Norden verdeckt", farbe.hinten + " Bäume hinten");
  await pg.screenshot({ path: process.env.BILD ? process.env.BILD + "-karte.png" : "/tmp/pruefe-807.png" });
  /* Wahrzeichen auf dem gewählten Platz: Xanders Fernsehturm auf Platz 0 (unten links) */
  const turm = await pg.evaluate(() => { const L = STADT.leicht, ich = JSON.parse(JSON.stringify(L.ich)); ich.volk = { wunder: { fernsehturm: 1 }, wunder_platz: { fernsehturm: 0 } }; L.ich = ich; L.aufbauen(); const o = STADT.szene.objekte.find((q) => q.spiel === "fernsehturm"); return o && { x: o.x, y: o.y, d: o.dreh }; });
  const p0 = welt(84, 197);
  sage(!!turm && Math.hypot(turm.x - p0[0], turm.y - p0[1]) < 12 && turm.d === 3.5, "der Fernsehturm steht auf seinem Platz aus dem Spiel (Platz 1 unten links) und schaut zum Betrachter", JSON.stringify({ turm, platz: p0.map((z) => +z.toFixed(1)) }));
  await laden("&vorlage=rundling");
  const rund = await pg.evaluate(() => { const P = window.STADT.dorf.PLAETZE; return { v: window.STADT.dorf.VORLAGE, r: Math.hypot(P.rathaus.x, P.rathaus.y) }; });
  sage(rund.v === "rundling" && rund.r > 20 && rund.r < 26, "der Rundling bleibt mit ?vorlage=rundling erreichbar", JSON.stringify(rund));
  sage(seitenfehler.length === 0, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
