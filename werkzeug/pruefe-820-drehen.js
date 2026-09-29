#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 820: KARTE MIT ZWEI FINGERN DREHEN, EINRASTEN IN 8 WINKELN
   ---------------------------------------------------------------------
   XANDER (Walkie 309): „Jetzt: Zwei-Finger-Drehen mit Einrasten in 8
   Winkeln (schnell machbar)". Funk 207: „stufenlos drehen … wie Google Maps".
   Geprüft am Android-Telefon (360 × 740, Finger über CDP-Touch):
     • ST.proj und ST.aufBoden sind bei 45°-Winkeln (0,5 · 1,5 · 2,5 · 3,5)
       und Zwischenwerten zueinander invers und drehen wirklich um 45°;
       bei ganzen Vierteldrehungen genau dieselben Zahlen wie vorher
     • zwei Finger drehen: während der Geste ein Zwischenwinkel, nach dem
       Loslassen rastet die Kamera weich auf ein Vielfaches von 0,5 ein,
       der Punkt zwischen den Fingern bleibt auf dem Boden, wo er war;
       reines Kneifen (auch leicht schief) dreht nicht
     • bei 45° zeigt jedes Haus das passende Bild (gier Vielfaches von 45,
       = Hausdrehung + Kamera), Schatten dazu
     • der Boden wird gemalt und passt zu den Wegen der Karte (Wegpunkte
       grau, Wiesenpunkte grün – auch bei 45° und 135°)
     • ein Tipp aufs Haus bei 45° wählt genau dieses Haus
     • Knöpfe und Umschalt+Mausrad drehen um 45° (weich), Ansage mit acht
       Richtungen; Himmel und Alpen nur beim Blick nach Norden
     • im kleinen Rahmen (eingebettet, mini=1) dreht Zwei-Finger nur mit dem
       Kompass (lk-nah); die Kompassnadel dreht stufenlos mit
     • keine Seitenfehler
   AUFRUF: node werkzeug/pruefe-820-drehen.js   (BILD=/pfad/praefix für die
           Bildschirmfotos, QUELLE=1 lädt die Einzeldateien statt leicht.min.js)
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const BILD = process.env.BILD || path.join(os.tmpdir(), "pruefe-820");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const wurzelUrl = "http://127.0.0.1:" + srv.address().port;
  const basis = wurzelUrl + "/stadt-leicht.html?demo=1&zeit=tag&jahr=sommer" + (process.env.QUELLE ? "&quelle=1" : "");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  pg.setDefaultTimeout(120000);
  const seitenfehler = [];
  pg.on("pageerror", (e) => { seitenfehler.push(e.message); console.log("  (Seitenfehler: " + e.message + ")"); });
  /* (für die Gegenprobe mit dem alten Stand ohne drehen.js: dann direkt an der Kamera drehen) */
  await ctx.addInitScript(() => { window.__drehSetzen = (d) => { const ST = window.STADT; if (ST.drehen) return ST.drehen.setzen(d); ST.kamera.dreh = d; ST.szene.geaendert(); ST.leicht.unruhe = 3; }; });
  const cdp = await ctx.newCDPSession(pg);
  await pg.goto(basis, { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
  await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 120000 }).catch(() => {});
  await pg.waitForTimeout(800);

  /* ---------------- 1. Abbildung ---------------- */
  console.log("\nABBILDUNG (kern.js)\n");
  const m = await pg.evaluate(() => {
    const ST = STADT, K = ST.kamera, alt = { x: K.x, y: K.y, s: K.s, dreh: K.dreh };
    /* so rechnete kern.js bis Fassung 819 (nur ganze Vierteldrehungen) */
    const altDreh = (x, y, d) => { switch (d & 3) { case 1: return [-y, x]; case 2: return [-x, -y]; case 3: return [y, -x]; default: return [x, y]; } };
    const altProj = (x, y, z) => { const r = altDreh(x - K.x, y - K.y, K.dreh); return [K.W / 2 + (r[0] - r[1]) * ST.KX * K.s, K.H / 2 + (r[0] + r[1]) * ST.KY * K.s - (z || 0) * ST.KZ * K.s]; };
    const altBoden = (px, py) => { const u = (px - K.W / 2) / (ST.KX * K.s), v = (py - K.H / 2) / (ST.KY * K.s), a = (u + v) / 2, b = (v - u) / 2, w = altDreh(a, b, (4 - (K.dreh & 3)) & 3); return [w[0] + K.x, w[1] + K.y]; };
    const zz = ST.zufall(820), pkt = []; for (let i = 0; i < 60; i++) pkt.push([(zz() - 0.5) * 160, (zz() - 0.5) * 160, zz() * 20]);
    K.x = 7.3; K.y = -12.1; K.s = 17.5;
    let invers = 0, gleich = true, dreht = 0, tiefe = 0;
    for (const d of [0.5, 1.5, 2.5, 3.5, 0.25, 1.3, 3.9]) {
      K.dreh = d;
      for (const p of pkt) {
        const P = ST.proj(p[0], p[1], 0), w = ST.aufBoden(P[0], P[1]); invers = Math.max(invers, Math.hypot(w[0] - p[0], w[1] - p[1]));
        /* echte Drehung um d · 90° (Welt um die Kamera gedreht, dann wie gewohnt 2:1 abgebildet) */
        const a = d * Math.PI / 2, dx = p[0] - K.x, dy = p[1] - K.y, r0 = dx * Math.cos(a) - dy * Math.sin(a), r1 = dx * Math.sin(a) + dy * Math.cos(a);
        const E = [K.W / 2 + (r0 - r1) * ST.KX * K.s, K.H / 2 + (r0 + r1) * ST.KY * K.s - p[2] * ST.KZ * K.s], Q = ST.proj(p[0], p[1], p[2]);
        dreht = Math.max(dreht, Math.hypot(E[0] - Q[0], E[1] - Q[1]));
        tiefe = Math.max(tiefe, Math.abs(ST.tiefe(dx, dy) - (r0 + r1)));
      }
    }
    for (const d of [0, 1, 2, 3]) {
      K.dreh = d;
      for (const p of pkt) {
        const P = ST.proj(p[0], p[1], p[2]), A = altProj(p[0], p[1], p[2]); if (P[0] !== A[0] || P[1] !== A[1]) gleich = false;
        const w = ST.aufBoden(P[0], P[1]), wa = altBoden(P[0], P[1]); if (w[0] !== wa[0] || w[1] !== wa[1]) gleich = false;
        const r = ST.drehXY(p[0], p[1], d), ra = altDreh(p[0], p[1], d); if (r[0] !== ra[0] || r[1] !== ra[1]) gleich = false;
      }
    }
    Object.assign(K, alt);
    return { invers: invers, gleich: gleich, dreht: dreht, tiefe: tiefe };
  });
  sage(m.invers < 1e-6, "proj und aufBoden sind bei 45°-Winkeln und Zwischenwerten zueinander invers", "größter Fehler " + m.invers.toExponential(1) + " m");
  sage(m.dreht < 1e-6 && m.tiefe < 1e-9, "proj dreht wirklich um dreh · 90° (auch 0,5 = 45°), Tiefe passend", "Abweichung " + m.dreht.toExponential(1) + " px");
  sage(m.gleich, "bei ganzen Vierteldrehungen (0…3) genau dieselben Zahlen wie vorher (proj, aufBoden, drehXY)");

  /* ---------------- 2. Bilder bei 0°, 45°, 135° ---------------- */
  const ort = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "rathaus"); return [o.x, o.y]; });
  const stellen = async (d, x, y, s) => pg.evaluate(([d, x, y, s]) => { const K = STADT.kamera; K.x = x; K.y = y; K.s = s * K.dpr; __drehSetzen(d); STADT.leicht.unruhe = 3; }, [d, x, y, s]);
  /* warten, bis alle sichtbaren Bilder geladen sind und das Bild neu gemalt ist */
  const warteBis = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await pg.waitForTimeout(100); } return false; };
  /* bis die Kamera eingerastet ist und keine Drehung mehr läuft (höchstens 15 s) */
  const eingerastet = () => warteBis(() => pg.evaluate(() => (!STADT.drehen || !STADT.drehen.laeuft()) && STADT.kamera.dreh * 2 === Math.round(STADT.kamera.dreh * 2)), 15000);
  const ruhig = async () => {
    for (let i = 0; i < 160; i++) {
      const r = await pg.evaluate(() => STADT.bilder.offen() === 0 && STADT.szene.sichtbare.every((e) => STADT.bilder.fertig(e.lagen[0][0]) && new RegExp("_(f|b\\d+)_" + STADT.szene.gierFuer(e.o.bau && e.o.bau.p < 1 && e.o.bauBild ? e.o.bauBild : e.o.bild, STADT.szene.gierVon(e.o)) + "_[a-z]$").test(e.lagen[0][0])));
      if (r) break;
      await pg.waitForTimeout(250);
    }
    await pg.evaluate(() => { STADT.leicht.unruhe = 3; });
    await pg.waitForTimeout(500);
  };
  /* Häuser und ihre Bilder; Boden gegen die Karte (Wege grau, Wiese grün); Himmel */
  const bildPruefen = () => pg.evaluate(() => {
    const ST = STADT, K = ST.kamera, SZ = ST.szene, B = ST.boden;
    const haeuser = SZ.sichtbare.filter((e) => e.o.art === "haus" || e.o.art === "wunder" || (e.o.art === "kulisse" && e.o.name));
    const falsch = [];
    for (const e of haeuser) {
      const o = e.o, bild = o.bau && o.bau.p < 1 && o.bauBild ? o.bauBild : o.bild;
      const roh = (((Math.round(((o.dreh || 0) + K.dreh) * 2) / 2) % 4 + 4) % 4) * 90, soll = SZ.gierFuer(bild, roh);
      const m = /_(?:f|b\d+)_(\d+)_[a-z]$/.exec(e.lagen[0][0]), gier = m ? +m[1] : -1;   // fertig (_f_) oder Baustelle (_b80_)
      if (gier % 45 !== 0 || gier !== soll || (SZ.achtWinkel(bild) && gier !== roh) || (e.meta.sn && !new RegExp("_(f|b\\d+)_" + gier + "_").test(e.meta.sn))) falsch.push(o.spiel || o.bild);
    }
    /* Boden: den WebGL-Boden und die Dinge-Ebene in Bildpunkte lesen */
    const bc = document.getElementById("lBoden"), dc = document.getElementById("lDinge");
    const c1 = document.createElement("canvas"); c1.width = bc.width; c1.height = bc.height;
    const g1 = c1.getContext("2d"); g1.drawImage(bc, 0, 0);
    const boden = g1.getImageData(0, 0, c1.width, c1.height).data, dinge = dc.getContext("2d").getImageData(0, 0, dc.width, dc.height).data;
    let bunt = 0, n = 0;
    for (let i = 0; i < boden.length; i += 4 * 97) { n++; if (boden[i + 3] > 0 && boden[i] + boden[i + 1] + boden[i + 2] > 30) bunt++; }
    const umgebung = (x, y, r, f) => { for (let a = 0; a < 8; a++) for (const rr of [r * 0.5, r]) if (!f(B.wert(x + Math.cos(a * 0.785) * rr, y + Math.sin(a * 0.785) * rr, 0), B.wert(x + Math.cos(a * 0.785) * rr, y + Math.sin(a * 0.785) * rr, 1), B.wert(x + Math.cos(a * 0.785) * rr, y + Math.sin(a * 0.785) * rr, 2), B.wert(x + Math.cos(a * 0.785) * rr, y + Math.sin(a * 0.785) * rr, 3))) return false; return true; };
    const W = { weg: [0, 0], wiese: [0, 0] };
    for (let py = Math.round(K.H * 0.36); py < K.H - 4; py += 9) for (let px = 4; px < K.W - 4; px += 9) {
      if (dinge[(py * dc.width + px) * 4 + 3] > 4) continue;   // Haus, Schatten, Leute darüber
      const w = ST.aufBoden(px, py), weg = B.wert(w[0], w[1], 0);
      let art = null;
      if (weg > 0.95 && umgebung(w[0], w[1], 1.3, (a, b) => a > 0.9 && b < 0.1)) art = "weg";
      else if (weg < 0.02 && umgebung(w[0], w[1], 2, (a, b, c, d) => a < 0.02 && b < 0.02 && c < 0.02 && d < 0.02)) art = "wiese";
      if (!art) continue;
      const bx = Math.floor(px * bc.width / K.W), by = Math.floor(py * bc.height / K.H), i = (by * bc.width + bx) * 4;
      const r = boden[i], g = boden[i + 1], b = boden[i + 2];
      const grau = Math.max(r, g, b) - Math.min(r, g, b) < 34 && g - Math.max(r, b) < 12, gruen = g - Math.max(r, b) > 14;
      W[art][1]++; if (art === "weg" ? grau && !gruen : gruen) W[art][0]++;
    }
    return { dreh: K.dreh, haeuser: haeuser.length, falsch: falsch, bunt: bunt / n, weg: W.weg, wiese: W.wiese, himmel: ST.__himmel || 0 };
  });
  /* Zähler: wie oft Himmel und ganze Bilder gemalt wurden (die Software-Grafik im Prüfbrowser schafft oft nur 1–3 Bilder je Sekunde) */
  await pg.evaluate(() => { const H = STADT.himmel, alt = H.hinten; H.hinten = function () { STADT.__himmel = (STADT.__himmel || 0) + 1; return alt.apply(this, arguments); };
    const SZ = STADT.szene, z = SZ.zeichnen; SZ.zeichnen = function () { STADT.__bilder = (STADT.__bilder || 0) + 1; return z.apply(this, arguments); }; });
  console.log("\nBILDER UND BODEN BEI 0°, 45°, 135°\n");
  const ergebnisse = {};
  for (const [d, name] of [[0, "0"], [0.5, "45"], [1.5, "135"]]) {
    await stellen(d, ort[0], ort[1] + 6, 9);
    await ruhig();
    await pg.evaluate(() => { STADT.__himmel = 0; STADT.__bilder = 0; STADT.leicht.unruhe = 3; });
    await warteBis(() => pg.evaluate(() => STADT.__bilder >= 3), 20000);
    const r = await bildPruefen();
    ergebnisse[name] = r;
    await pg.screenshot({ path: BILD + "-" + name + "grad.png" });
    const anteil = (a) => a[1] ? a[0] / a[1] : 0;
    sage(r.haeuser >= 3 && !r.falsch.length, name + "°: jedes Haus zeigt das Bild seines Winkels (gier Vielfaches von 45, mit Schatten)", r.haeuser + " Häuser" + (r.falsch.length ? ", falsch: " + r.falsch.join(", ") : ""));
    sage(r.bunt > 0.95, name + "°: der Boden ist gemalt (Bildpunkte nicht leer)", Math.round(r.bunt * 100) + " %");
    sage(r.weg[1] >= 15 && r.wiese[1] >= 15 && anteil(r.weg) > 0.85 && anteil(r.wiese) > 0.85, name + "°: Boden passt zur Karte (Wegpunkte grau, Wiesenpunkte grün)",
      "Weg " + r.weg[0] + "/" + r.weg[1] + ", Wiese " + r.wiese[0] + "/" + r.wiese[1]);
    sage(d === 0 ? r.himmel > 0 : r.himmel === 0, name + "°: Himmel und Alpen " + (d === 0 ? "beim Blick nach Norden da" : "schräg/seitlich nicht gemalt (kein halber Himmel)"), "hinten() " + r.himmel + "×");
  }

  /* ---------------- 3. Tipp aufs Haus bei 45° ---------------- */
  console.log("\nTIPPEN BEI 45°\n");
  await stellen(0.5, ort[0], ort[1] + 6, 12);
  await ruhig();
  const ziel = await pg.evaluate(() => {
    const ST = STADT, K = ST.kamera, SZ = ST.szene;
    /* ein Haus, dessen Bildpunkt über der Mitte der Grundfläche wirklich zu ihm gehört */
    for (const e of SZ.sichtbare.slice().reverse()) {
      const o = e.o; if (o.art !== "haus") continue;
      for (const z of [2, 3, 4, 1.2]) {
        const P = ST.proj(o.x, o.y, z * (o.stufe || 1));
        if (P[0] < 30 * K.dpr || P[0] > K.W - 30 * K.dpr || P[1] < 120 * K.dpr || P[1] > K.H - 200 * K.dpr) continue;
        if (SZ.treffer(P[0], P[1]) === o) return { spiel: o.spiel, name: o.name, x: P[0] / K.dpr, y: P[1] / K.dpr, id: o.id };
      }
    }
    return null;
  });
  if (ziel) {
    await pg.touchscreen.tap(ziel.x, ziel.y); await pg.waitForTimeout(500);
    const gew = await pg.evaluate(() => { const a = STADT.szene.auswahl, k = document.querySelector(".lk-karte"); return { id: a && a.id, spiel: a && a.spiel, text: k && !k.hidden ? k.textContent.slice(0, 40) : "" }; });
    sage(gew.id === ziel.id && gew.text.indexOf(ziel.name) >= 0, "Tipp aufs Haus bei 45° wählt genau dieses Haus", ziel.spiel + " → " + gew.spiel + " „" + gew.text + "“");
    await pg.screenshot({ path: BILD + "-45grad-auswahl.png" });
    await pg.locator(".lk-karte .lk-knopf[title='Schließen']").tap().catch(() => {});
    await pg.evaluate(() => { STADT.szene.auswahl = null; });
  } else sage(false, "Tipp aufs Haus bei 45°: kein freies Haus im Bild gefunden");

  /* ---------------- 4. Zwei-Finger-Geste ---------------- */
  console.log("\nZWEI FINGER\n");
  const finger = (typ, pkte) => cdp.send("Input.dispatchTouchEvent", { type: typ, touchPoints: pkte.map((p, i) => ({ x: p[0], y: p[1], id: i + 1, radiusX: 4, radiusY: 4, force: 1 })) });
  /* zwei Finger um (cx, cy): Abstand r0 → r1, Linie von w0° nach w1° (Bildschirm, im Uhrzeigersinn), in n Schritten */
  const geste = async (cx, cy, r0, r1, w0, w1, n, mitten) => {
    const lage = (k) => { const r = r0 + (r1 - r0) * k, w = (w0 + (w1 - w0) * k) * Math.PI / 180; return [[cx - Math.cos(w) * r, cy - Math.sin(w) * r], [cx + Math.cos(w) * r, cy + Math.sin(w) * r]]; };
    await finger("touchStart", lage(0)); await pg.waitForTimeout(40);
    let mitte = null;
    for (let i = 1; i <= n; i++) { await finger("touchMove", lage(i / n)); await pg.waitForTimeout(30); if (i === Math.round(n * 0.7) && mitten) mitte = await mitten(); }
    await finger("touchEnd", []);
    return mitte;
  };
  await stellen(0, ort[0], ort[1] + 6, 10);
  await pg.waitForTimeout(300);
  /* der Boden unter der Fingermitte (180, 400) */
  const vor = await pg.evaluate(() => { const K = STADT.kamera; return { dreh: K.dreh, w: STADT.aufBoden(180 * K.dpr, 400 * K.dpr) }; });
  const mitten = () => pg.evaluate(() => STADT.kamera.dreh);
  const zwischen = await geste(180, 400, 80, 80, 0, 50, 14, mitten);
  sage(zwischen > 0.05 && Math.abs(zwischen * 2 - Math.round(zwischen * 2)) > 0.02, "während der Geste dreht die Karte stufenlos (Zwischenwinkel)", "K.dreh " + (zwischen != null ? zwischen.toFixed(3) : zwischen));
  const gleich = await pg.evaluate(() => [STADT.kamera.dreh, !!(STADT.drehen && STADT.drehen.laeuft())]);
  await pg.waitForTimeout(400); await eingerastet();
  const nach = await pg.evaluate(() => { const K = STADT.kamera; return { dreh: K.dreh, w: STADT.aufBoden(180 * K.dpr, 400 * K.dpr), ansage: (document.querySelector(".lk-ansage") || {}).textContent || "", name: STADT.drehen ? STADT.drehen.name() : "?" }; });
  sage(nach.dreh !== vor.dreh && nach.dreh * 2 === Math.round(nach.dreh * 2), "nach dem Loslassen eingerastet auf ein Vielfaches von 45°", "K.dreh " + vor.dreh + " → " + nach.dreh + " (beim Loslassen " + gleich[0].toFixed(3) + (gleich[1] ? ", rastet weich ein" : "") + ")");
  sage(Math.hypot(nach.w[0] - vor.w[0], nach.w[1] - vor.w[1]) < 0.05, "gedreht um den Punkt zwischen den Fingern (der Boden dort bleibt, wo er war)", JSON.stringify(vor.w.map((v) => +v.toFixed(2))) + " → " + JSON.stringify(nach.w.map((v) => +v.toFixed(2))));
  sage(nach.ansage === "Blick nach " + nach.name && ["Nordwesten", "Westen", "Nordosten", "Osten"].indexOf(nach.name) >= 0, "Ansage mit acht Richtungen", "„" + nach.ansage + "“");
  await ruhig();
  const r45 = await bildPruefen();
  sage(!r45.falsch.length, "nach der Geste zeigen alle Häuser ihr eingerastetes Bild", r45.haeuser + " Häuser" + (r45.falsch.length ? ", falsch: " + r45.falsch.join(", ") : ""));
  await pg.screenshot({ path: BILD + "-geste.png" });
  /* Kneifen: auseinander, auch leicht schief – zoomt, dreht aber nicht */
  const k0 = await pg.evaluate(() => [STADT.kamera.dreh, STADT.kamera.s]);
  await geste(180, 400, 60, 120, 0, 5, 12); await pg.waitForTimeout(600); await eingerastet();
  await geste(180, 400, 110, 70, 90, 94, 12); await pg.waitForTimeout(600); await eingerastet();
  const k1 = await pg.evaluate(() => [STADT.kamera.dreh, STADT.kamera.s]);
  sage(k1[0] === k0[0] && Math.abs(k1[1] - k0[1]) > 0.5, "reines Kneifen (auch 4–5° schief) zoomt, dreht aber nicht", "dreh " + k0[0] + " → " + k1[0] + ", Zoom " + k0[1].toFixed(1) + " → " + k1[1].toFixed(1));
  /* andersherum zurück */
  await geste(180, 400, 80, 80, 40, -10, 14); await pg.waitForTimeout(400); await eingerastet();
  const zur = await pg.evaluate(() => STADT.kamera.dreh);
  sage(zur * 2 === Math.round(zur * 2) && zur !== k1[0], "andersherum gedreht: wieder eingerastet", k1[0] + " → " + zur);

  /* ---------------- 5. Knöpfe und Umschalt+Mausrad ---------------- */
  console.log("\nKNÖPFE UND MAUSRAD\n");
  await stellen(0, ort[0], ort[1] + 6, 10);
  /* weich: gleich nach dem Tipp steht die Kamera noch, eine Drehung läuft; Zwischenwerte werden mitgeschrieben */
  const halb = await pg.evaluate(() => { const K = STADT.kamera, werte = (window.__werte = []); const f = () => { werte.push(K.dreh); if (werte.length < 400) requestAnimationFrame(f); }; requestAnimationFrame(f);
    document.querySelector(".lk-kopf-rechts .lk-knopf[title='Karte nach links drehen']").click(); return { d: K.dreh, laeuft: !!(STADT.drehen && STADT.drehen.laeuft()) }; });
  await pg.waitForTimeout(400); await eingerastet();
  const zwischenwerte = await pg.evaluate(() => window.__werte.filter((w) => w > 0 && w < 0.5).length);
  const k45 = await pg.evaluate(() => ({ d: STADT.kamera.dreh, a: document.querySelector(".lk-ansage").textContent }));
  sage(halb.d === 0 && halb.laeuft && k45.d === 0.5 && k45.a === "Blick nach Nordwesten", "„Karte nach links drehen“: weich um 45° (Ansage „Blick nach Nordwesten“)", "0 → " + k45.d + ", " + zwischenwerte + " Zwischenbilder, „" + k45.a + "“");
  await pg.evaluate(() => { const b = document.querySelector(".lk-kopf-rechts .lk-knopf[title='Karte nach rechts drehen']"); b.click(); b.click(); });
  await pg.waitForTimeout(400); await eingerastet();
  const kr = await pg.evaluate(() => ({ d: STADT.kamera.dreh, a: document.querySelector(".lk-ansage").textContent }));
  sage(kr.d === 3.5 && kr.a === "Blick nach Nordosten", "„Karte nach rechts drehen“ zweimal schnell: 90° zurück (Ansage „Blick nach Nordosten“)", kr.d + " „" + kr.a + "“");
  const rad = async (dy, shift) => pg.evaluate(([dy, shift]) => { const c = document.getElementById("lDinge"); c.dispatchEvent(new WheelEvent("wheel", { deltaY: dy, shiftKey: shift, clientX: 180, clientY: 400, bubbles: true, cancelable: true })); }, [dy, shift]);
  const s0 = await pg.evaluate(() => STADT.kamera.s);
  await rad(120, true); await pg.waitForTimeout(400); await eingerastet();
  const m1 = await pg.evaluate(() => [STADT.kamera.dreh, STADT.kamera.s]);
  await rad(-120, true); await pg.waitForTimeout(400); await eingerastet();
  const m2 = await pg.evaluate(() => STADT.kamera.dreh);
  sage(m1[0] === 0 && m2 === 3.5 && Math.abs(m1[1] - s0) < 1e-9, "Umschalt+Mausrad dreht um 45° (ohne zu zoomen)", "3.5 → " + m1[0] + " → " + m2);
  await pg.evaluate(() => __drehSetzen(0));

  sage(!seitenfehler.length, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));

  /* ---------------- 6. Im kleinen Rahmen ---------------- */
  console.log("\nIM KLEINEN RAHMEN (eingebettet, mini=1)\n");
  const pm = await ctx.newPage();
  pm.on("pageerror", (e) => { seitenfehler.push(e.message); console.log("  (Seitenfehler im Rahmen: " + e.message + ")"); });
  await pm.route(wurzelUrl + "/rahmen-820.html", (r) => r.fulfill({ contentType: "text/html", body: '<!doctype html><meta name="viewport" content="width=device-width"><body style="margin:0"><iframe id="f" src="/stadt-leicht.html?demo=1&zeit=tag&jahr=sommer&mini=1&eingebettet=1' + (process.env.QUELLE ? "&quelle=1" : "") + '" style="border:0;width:360px;height:300px;display:block"></iframe><div style="height:900px"></div>' }));
  await pm.goto(wurzelUrl + "/rahmen-820.html");
  const cdpM = await ctx.newCDPSession(pm);
  let fr = null;
  for (let i = 0; i < 240 && !fr; i++) { fr = pm.frames().find((f) => /stadt-leicht\.html/.test(f.url())); if (!fr) await pm.waitForTimeout(250); }
  await fr.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
  await pm.waitForTimeout(1500);
  const fingerM = (typ, pkte) => cdpM.send("Input.dispatchTouchEvent", { type: typ, touchPoints: pkte.map((p, i) => ({ x: p[0], y: p[1], id: i + 1, radiusX: 4, radiusY: 4, force: 1 })) });
  const gesteM = async (w1) => {
    const lage = (k) => { const w = w1 * k * Math.PI / 180; return [[180 - Math.cos(w) * 70, 150 - Math.sin(w) * 70], [180 + Math.cos(w) * 70, 150 + Math.sin(w) * 70]]; };
    await fingerM("touchStart", lage(0)); for (let i = 1; i <= 12; i++) { await fingerM("touchMove", lage(i / 12)); await pm.waitForTimeout(30); } await fingerM("touchEnd", []); await pm.waitForTimeout(400);
    for (let i = 0; i < 150; i++) { if (await fr.evaluate(() => !STADT.drehen || !STADT.drehen.laeuft())) break; await pm.waitForTimeout(100); }
    await pm.waitForTimeout(300);
  };
  const zustand = () => fr.evaluate(() => ({ mini: document.body.classList.contains("lk-mini-modus"), nah: document.body.classList.contains("lk-nah"), dreh: STADT.kamera.dreh,
    nadel: getComputedStyle(document.querySelector(".lk-lupe .lk-nadel")).transform, var: document.documentElement.style.getPropertyValue("--lk-nadel") }));
  const z0 = await zustand();
  await gesteM(50);
  const z1 = await zustand();
  sage(z0.mini && !z0.nah && z1.dreh === z0.dreh, "kleiner Rahmen ohne Kompass: zwei Finger drehen nicht (die Seite bleibt scrollbar)", JSON.stringify({ mini: z0.mini, nah: z0.nah, dreh: z0.dreh + " → " + z1.dreh }));
  await fr.locator(".lk-lupe").tap(); await pm.waitForTimeout(900);
  await gesteM(50);
  const z2 = await zustand();
  sage(z2.nah && z2.dreh !== z1.dreh && z2.dreh * 2 === Math.round(z2.dreh * 2), "mit dem Kompass (nah): zwei Finger drehen und rasten ein", z1.dreh + " → " + z2.dreh);
  sage(z2.var && z2.var !== z1.var && z2.nadel !== z1.nadel, "die Kompassnadel dreht mit (zeigt nach Norden)", (z1.var || "0deg") + " → " + z2.var);
  await pm.screenshot({ path: BILD + "-rahmen.png" });
  sage(!seitenfehler.length, "auch im Rahmen keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));

  /* ---------------- 7. Aufwand beim Drehen (und: Zwischenwinkel malen ohne Absturz) ---------------- */
  const zeit = await pg.evaluate(() => {
    const SZ = STADT.szene, B = STADT.boden, t0 = performance.now();
    for (let i = 0; i < 24; i++) { __drehSetzen(i * 0.043); B.zeichnen(1, SZ.zeitDaten(), SZ.jahr); SZ.zeichnen(performance.now()); }
    __drehSetzen(0);
    return (performance.now() - t0) / 24;
  }).catch((e) => { sage(false, "Zwischenwinkel malen ohne Fehler", String(e.message).split("\n")[0]); return NaN; });
  console.log("  (ein Bild während der Drehung: " + zeit.toFixed(1) + " ms im Prüfbrowser mit Software-Grafik)");

  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "   Bilder: " + BILD + "-{0,45,135}grad.png, -45grad-auswahl.png, -geste.png, -rahmen.png\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
