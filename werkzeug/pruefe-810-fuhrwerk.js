#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 810: FUHRWERKE IN DER LEICHTEN STADT
   ---------------------------------------------------------------------
   XANDER: „Pferdebahn driving plus horse carts taking grain to the mill
   and flour to the bakery" – „Pferde, die Mehl transportieren" – „die
   Pferdebahn, die wir in Döbeln haben".
   Geprüft (stadt-leicht.html?demo=1, Telefon 390 × 844):
     • es gibt die Fuhrwerke (stadt-leicht/fuhrwerk.js): zwei Kornwagen
       und die Pferdebahn (die Beispielstadt hat Mühle und Bäckerei);
     • die Kornwagen fahren auf den Wegen (jeder Punkt < 3 m von einem
       Wegpunkt aus ST.dorf.WEGE oder dem Feldweg), im Schritt (≈ 1,4 m/s),
       vom Feld zur Mühle (mit Korn), zur Bäckerei (mit Mehl) und leer
       zurück, und halten dort; das Pferd geht (Gangbilder wechseln) und
       steht beim Halten;
     • die Pferdebahn liegt auf einem Weg zum Bahnhof, pendelt mit ≈ 10 s
       Halt an beiden Enden, das Pferd läuft vorn in Fahrtrichtung;
     • nachts (zeit=nacht) ruhen die Kornwagen;
     • im kleinen Rahmen (mini=1) und im Sparmodus (spar=1) höchstens ein
       Wagen, dort mit Zwergblättern;
     • die Fuhrwerke werden wirklich gemalt; keine Seitenfehler.
   AUFRUF: node werkzeug/pruefe-810-fuhrwerk.js
     WURZEL=/pfad (anderer Stand, z. B. Gegenprobe ohne fuhrwerk.js),
     BILD=/pfad/praefix (Bildschirmfotos: Kornwagen, Pferdebahn, Nacht).
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const seite = async (query, vp) => {
    const pg = await br.newPage({ viewport: vp || { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
    pg.setDefaultTimeout(120000);
    pg.fehler = []; pg.geladen = [];
    pg.on("pageerror", (e) => pg.fehler.push(e.message));
    pg.on("requestfinished", (r) => pg.geladen.push(r.url()));
    await pg.goto(basis + "?demo=1&" + query, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(800);
    return pg;
  };
  const foto = async (pg, name) => { if (BILD) await pg.screenshot({ path: BILD + "-" + name + ".png" }); };
  const ruhig = async (pg) => { await pg.waitForTimeout(900); await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {}); await pg.waitForTimeout(700); };
  const ende = async () => { await br.close(); srv.close(); console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0); };

  console.log("\nDIE FUHRWERKE (Beispielstadt, Tag)\n");
  const pg = await seite("zeit=tag&jahr=herbst");
  sage(!pg.fehler.length, "lädt ohne Seitenfehler", pg.fehler.join(" | "));
  const da = await pg.evaluate(() => !!(window.STADT && STADT.fuhrwerk && STADT.fuhrwerk.bewegen && STADT.fuhrwerk.sichtbar && STADT.fuhrwerk.aufbauen));
  sage(da, "es gibt die Fuhrwerke (STADT.fuhrwerk)");
  if (!da) return ende();
  const A = await pg.evaluate(() => {
    const FW = STADT.fuhrwerk, SZ = STADT.szene;
    const hs = (n) => { const o = SZ.objekte.find((o) => o.art === "haus" && o.spiel === n); return o ? [o.x, o.y, o.stufenZahl] : null; };
    return { n: FW.wagen.length, bahn: !!FW.bahn, grund: FW.grund || "", bahnGrund: FW.bahnGrund || "", muehle: hs("muehle"), baeckerei: hs("baeckerei") };
  });
  sage(!!A.muehle && !!A.baeckerei, "die Beispielstadt hat Mühle und Bäckerei", JSON.stringify({ muehle: A.muehle, baeckerei: A.baeckerei }));
  sage(A.n === 2, "zwei Kornwagen", A.n + " " + A.grund);
  sage(A.bahn, "eine Pferdebahn", A.bahnGrund);

  console.log("\nKORNWAGEN: FELD → MÜHLE → BÄCKEREI → FELD\n");
  /* 12 Minuten Spielzeit in Zehntelschritten, alle halbe Sekunde notiert */
  const R = await pg.evaluate(() => {
    const FW = STADT.fuhrwerk, aus = FW.wagen.map(() => []), halte = FW.wagen.map(() => []);
    for (let i = 0; i < 1440; i++) {
      FW.vorspulen(0.5);
      FW.wagen.forEach((w, k) => {
        aus[k].push([w.x, w.y, w.v, w.zustand, w.art, w.wo]);
        if (w.zustand !== w._z) { if (w.zustand === "laden" || w.zustand === "abladen") halte[k].push({ t: i * 0.5, wo: w.wo, art: w.art, x: w.x, y: w.y }); w._z = w.zustand; }
      });
    }
    /* Wegpunkte: die Wege des Dorfes und die Feldwege, alle 0,5 m */
    const pts = [];
    const dazu = (w) => { for (let i = 1; i < w.length; i++) { const a = w[i - 1], b = w[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5)); for (let k = 0; k <= n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } };
    for (const w of STADT.dorf.WEGE || []) dazu(w);
    for (const f of FW.feldwege) dazu(f.weg);
    const hs = (n) => STADT.szene.objekte.find((o) => o.art === "haus" && o.spiel === n);
    const m = hs("muehle"), b = hs("baeckerei");
    return { spur: aus, halte: halte, pts: pts, muehle: [m.x, m.y, m.fuss[0] * m.stufe, m.fuss[1] * m.stufe], baeckerei: [b.x, b.y, b.fuss[0] * b.stufe, b.fuss[1] * b.stufe], feldwege: FW.feldwege.length };
  });
  const naeh = (x, y) => { let d = 1e9; for (const p of R.pts) { const e = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (e < d) d = e; } return Math.sqrt(d); };
  for (let k = 0; k < R.spur.length; k++) {
    const S = R.spur[k], H = R.halte[k];
    let weit = 0, strecke = 0, vmax = 0, sprung = 0;
    for (let i = 0; i < S.length; i += 2) weit = Math.max(weit, naeh(S[i][0], S[i][1]));
    for (let i = 1; i < S.length; i++) { const d = Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]); strecke += d; vmax = Math.max(vmax, S[i][2]); if (S[i][3] === "faehrt" && S[i - 1][3] === "faehrt") sprung = Math.max(sprung, d / 0.5); }
    sage(strecke > 150, "[Wagen " + (k + 1) + "] fährt (in 12 min)", strecke.toFixed(0) + " m");
    sage(weit < 3, "[Wagen " + (k + 1) + "] bleibt auf den Wegen (jeder Punkt < 3 m von einem Wegpunkt)", "weitester Abstand " + weit.toFixed(2) + " m");
    /* (rechts vom Weg fährt der Wagen in Linkskurven außen: dort ist er etwas schneller als auf der Wegmitte) */
    sage(vmax <= 1.45 && vmax >= 1.3 && sprung <= 2, "[Wagen " + (k + 1) + "] im Schritt (≈ 1,4 m/s, keine Sprünge)", "vmax " + vmax.toFixed(2) + " m/s auf dem Weg, schnellster Halbsekundenschritt " + sprung.toFixed(2) + " m/s");
    const inM = H.filter((h) => h.wo === "muehle"), inB = H.filter((h) => h.wo === "baeckerei"), inF = H.filter((h) => h.wo === "feld");
    const abst = (h, o) => Math.hypot(h.x - o[0], h.y - o[1]) - Math.hypot(o[2], o[3]) / 2;
    sage(inM.length >= 1 && inM.every((h) => abst(h, R.muehle) < 8), "[Wagen " + (k + 1) + "] hält an der Mühle", inM.map((h) => "t=" + h.t + " s, " + abst(h, R.muehle).toFixed(1) + " m vor dem Rand, Ladung " + h.art).join("; "));
    sage(inB.length >= 1 && inB.every((h) => abst(h, R.baeckerei) < 8), "[Wagen " + (k + 1) + "] hält an der Bäckerei", inB.map((h) => "t=" + h.t + " s, " + abst(h, R.baeckerei).toFixed(1) + " m vor dem Rand, Ladung " + h.art).join("; "));
    sage(inF.length >= 1, "[Wagen " + (k + 1) + "] fährt zurück aufs Feld", inF.length + " mal");
    /* Ladung: zur Mühle mit Korn, von der Mühle mit Mehl zur Bäckerei, von dort leer */
    let falsch = 0, fahrten = 0;
    for (let i = 1; i < S.length; i++) if (S[i][3] === "faehrt") {
      fahrten++;
      const von = S[i][5], soll = von === "feld" ? "korn" : von === "muehle" ? "mehl" : "leer";
      if (S[i][4] !== soll) falsch++;
    }
    sage(fahrten > 100 && falsch === 0, "[Wagen " + (k + 1) + "] Ladung stimmt (Korn zur Mühle, Mehl zur Bäckerei, leer zurück)", falsch + " falsche von " + fahrten);
  }
  /* Gangbilder: in Fahrt wechseln die vier Spalten, beim Halten steht das Pferd (Spalte 4) */
  await pg.evaluate(() => { for (const a of ["korn", "mehl", "leer"]) STADT.bilder.bild("l_fuhr_" + a + "_herbst_tag", true); });
  await pg.waitForFunction(() => ["korn", "mehl", "leer"].every((a) => STADT.bilder.fertig("l_fuhr_" + a + "_herbst_tag")), null, { timeout: 60000 }).catch(() => {});
  const G = await pg.evaluate(() => {
    const FW = STADT.fuhrwerk, Z = STADT.szene.zeitDaten(), K = STADT.kamera, spalten = { faehrt: new Set(), steht: new Set() };
    const w = FW.wagen[0];
    for (let i = 0; i < 2400; i++) {   // (FASSUNG 808: die Wege der Originalkarte sind länger – vier Minuten spulen)
      FW.vorspulen(0.1);
      K.x = w.x; K.y = w.y;
      const e = FW.sichtbar(Z).find((p) => p.wagen === w);
      if (e) (w.v > 0.05 ? spalten.faehrt : spalten.steht).add(e.schritt);
    }
    return { faehrt: [...spalten.faehrt].sort(), steht: [...spalten.steht].sort() };
  });
  sage(G.faehrt.length === 4 && G.faehrt.join() === "0,1,2,3", "in Fahrt geht das Pferd (vier Gangbilder)", "Spalten " + G.faehrt.join(","));
  sage(G.steht.length === 1 && G.steht[0] === 4, "beim Halten steht das Pferd", "Spalten " + G.steht.join(","));

  console.log("\nDIE PFERDEBAHN\n");
  const P = await pg.evaluate(() => {
    const FW = STADT.fuhrwerk, P = FW.bahn, D = STADT.dorf, SZ = STADT.szene;
    const b = D.BAHNHOF ? (Array.isArray(D.BAHNHOF) ? D.BAHNHOF : [D.BAHNHOF.x, D.BAHNHOF.y]) : (() => { const o = SZ.objekte.find((o) => o.bild === "k_bahnhof"); return o ? [o.x, o.y] : D.BAHN_HALT; })();
    const W = P.W, gleis = []; for (let i = 0; i <= W.n; i += 2) gleis.push([W.X[i], W.Y[i]]);
    const reihe = [];
    for (let t = 0; t < P.takt; t += 0.25) { FW.bahnFest = t; FW.vorspulen(0.1); reihe.push({ t: t, s: P.s, v: P.v, x: P.x, y: P.y, mx: P.mx, my: P.my, h: P.h, z: P.zustand, wo: P.wo, dir: P.dir }); }
    FW.bahnFest = null;
    return { gleis: gleis, reihe: reihe, takt: P.takt, bahnhof: b, markt: D.MARKT || [-1, -1], sA: P.sA, sB: P.sB };
  });
  const aufWeg = Math.max(...P.gleis.map((p) => naeh(p[0], p[1])));
  sage(aufWeg < 1, "das Gleis liegt auf einem vorhandenen Weg", "weitester Abstand " + aufWeg.toFixed(2) + " m");
  const e0 = P.gleis[0], e1 = P.gleis[P.gleis.length - 1];
  const dB = Math.min(Math.hypot(e0[0] - P.bahnhof[0], e0[1] - P.bahnhof[1]), Math.hypot(e1[0] - P.bahnhof[0], e1[1] - P.bahnhof[1]));
  const zumMarkt = Math.hypot(e0[0] - P.markt[0], e0[1] - P.markt[1]) < Math.hypot(e1[0] - P.markt[0], e1[1] - P.markt[1]);
  sage(dB < 25 && zumMarkt, "es führt vom Markt her zum Bahnhof (ein Ende am Bahnhof)", "Enden " + JSON.stringify([e0, e1].map((p) => p.map((v) => +v.toFixed(1)))) + ", Bahnhof " + JSON.stringify(P.bahnhof) + ", " + dB.toFixed(1) + " m");
  const halteA = P.reihe.filter((r) => r.z === "haelt" && r.wo === "markt").length * 0.25, halteB = P.reihe.filter((r) => r.z === "haelt" && r.wo === "bahnhof").length * 0.25;
  sage(Math.abs(halteA - 10) <= 0.5 && Math.abs(halteB - 10) <= 0.5, "pendelt mit ≈ 10 s Halt an beiden Enden", "Markt " + halteA + " s, Bahnhof " + halteB + " s, Umlauf " + P.takt.toFixed(1) + " s");
  let vmaxB = 0, gegen = 0, zSprung = 0;
  for (let i = 1; i < P.reihe.length; i++) {
    const a = P.reihe[i - 1], b = P.reihe[i];
    vmaxB = Math.max(vmaxB, b.v);
    zSprung = Math.max(zSprung, Math.hypot(b.mx - a.mx, b.my - a.my) / 0.25);
    /* Pferd vorn: der Modellursprung (Pferdeseite) liegt in Fahrtrichtung vor der Wagenmitte */
    if (b.z === "faehrt") { const fx = b.mx - a.mx, fy = b.my - a.my, l = Math.hypot(fx, fy); if (l > 1e-3 && (fx * (b.x - b.mx) + fy * (b.y - b.my)) / l < 1.4) gegen++; }
  }
  sage(vmaxB <= 1.85 && zSprung <= 1.9, "Tempo eines Pferdes im Schritt, kein Springen", "vmax " + vmaxB.toFixed(2) + " m/s");
  sage(gegen === 0, "das Pferd läuft vorn in Fahrtrichtung (wird an der Endstelle umgespannt)", gegen + " Stellungen verkehrt");
  sage(P.reihe.some((r) => r.s <= P.sA + 0.01) && P.reihe.some((r) => r.s >= P.sB - 0.01), "fährt von Ende zu Ende", "sA " + P.sA.toFixed(1) + ", sB " + P.sB.toFixed(1));

  console.log("\nIM BILD\n");
  /* Blickrichtung aller Fuhrwerke in allen vier Kameradrehungen: Zeile r zeigt die Modellspitze (+y, Pferd) nach (−sin, cos) von r·45° */
  const richt = [];
  for (let d = 0; d < 4; d++) richt.push(await pg.evaluate((d) => {
    const K = STADT.kamera, FW = STADT.fuhrwerk; K.dreh = d; K.s = 3 * K.dpr; K.x = -20; K.y = 10;
    const Z = STADT.szene.zeitDaten(); let schlimm = 0, n = 0;
    for (let i = 0; i < 40; i++) {
      FW.vorspulen(3);
      for (const p of FW.sichtbar(Z)) {
        const h = p.wagen ? p.wagen.h : p.bahn.h, g = p.reihe * Math.PI / 4, v1 = [-Math.sin(g), Math.cos(g)], v2 = STADT.drehXY(Math.cos(h), Math.sin(h), d);
        schlimm = Math.max(schlimm, Math.acos(Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1]))) * 180 / Math.PI); n++;
      }
    }
    K.dreh = 0;
    return { n: n, schlimm: schlimm };
  }, d));
  sage(richt.every((r) => r.n > 20 && r.schlimm <= 22.6), "Blickrichtung passt in allen vier Kameradrehungen (höchstens 22,5° daneben)", richt.map((r, d) => "dreh " + d + ": " + r.n + " Bilder, " + r.schlimm.toFixed(1) + "°").join(" · "));
  /* Kornwagen in Fahrt ins Bild holen und nachsehen, ob er gemalt wird */
  const bildDiff = async (x, y, s, ausblenden) => {
    await pg.evaluate(([x, y, s]) => { const K = STADT.kamera; K.x = x; K.y = y; K.s = s * K.dpr; STADT.leicht.unruhe = 3; }, [x, y, s]);
    await ruhig(pg);
    const mitte = { x: 195 - 55, y: 422 - 50, width: 110, height: 80 };
    const mit = await pg.screenshot({ clip: mitte });
    await pg.evaluate(ausblenden); await pg.waitForTimeout(600);
    const ohne = await pg.screenshot({ clip: mitte });
    await pg.evaluate(() => { STADT.fuhrwerk.sichtbar = STADT.fuhrwerk._sichtbar || STADT.fuhrwerk.sichtbar; STADT.leicht.unruhe = 3; });
    return pg.evaluate(([a, b]) => new Promise((ok) => {
      const lade = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
      Promise.all([lade(a), lade(b)]).then(([A, Bq]) => {
        const c = document.createElement("canvas"); c.width = A.width; c.height = A.height; const g = c.getContext("2d");
        g.drawImage(A, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data; g.clearRect(0, 0, c.width, c.height); g.drawImage(Bq, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data;
        let n = 0; for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 60) n++;
        ok(n / (da.length / 4));
      });
    }), [mit.toString("base64"), ohne.toString("base64")]);
  };
  const ausblenden = () => { const FW = STADT.fuhrwerk; FW._sichtbar = FW.sichtbar; FW.sichtbar = () => []; STADT.leicht.unruhe = 3; };
  /* Wagen 1 bis in Fahrt spulen, dann anhalten (Uhr steht, solange die Sonde schaut) */
  const w1 = await pg.evaluate(() => { const FW = STADT.fuhrwerk, w = FW.wagen[0]; let n = 0; while (!(w.zustand === "faehrt" && w.v > 1.3) && n++ < 3000) FW.vorspulen(0.2); FW.vorspulen(6); FW._bew = FW.bewegen; FW.bewegen = () => {}; return [w.x, w.y, w.art]; });
  const dw = await bildDiff(w1[0], w1[1], 22, ausblenden);
  sage(dw > 0.12, "der Kornwagen wird gemalt (Bildpunkte ändern sich ohne ihn)", (dw * 100).toFixed(1) + " % der Punkte, Ladung " + w1[2]);
  await foto(pg, "kornwagen-nah");
  const pb = await pg.evaluate(() => { const FW = STADT.fuhrwerk; FW.bahnFest = 12 + FW.bahn.fahr / 2; FW.vorspulen(0.1); return [FW.bahn.mx, FW.bahn.my]; });
  const db = await bildDiff(pb[0], pb[1], 18, ausblenden);
  sage(db > 0.12, "die Pferdebahn wird gemalt", (db * 100).toFixed(1) + " % der Punkte");
  await foto(pg, "pferdebahn-nah");
  const gr = await pg.evaluate(() => { const FW = STADT.fuhrwerk, Z = STADT.szene.zeitDaten(); return FW.sichtbar(Z).map((p) => ({ art: p.art, m: p.meta.s, zw: p.meta.zw })); });
  sage(gr.length >= 1, "Blätter im Bild", JSON.stringify(gr));
  await pg.evaluate(() => { const FW = STADT.fuhrwerk; FW.bewegen = FW._bew; FW.bahnFest = null; });
  sage(!pg.fehler.length, "ohne Seitenfehler", pg.fehler.join(" | "));
  await pg.close();

  console.log("\nNACHTS RUHEN DIE KORNWAGEN\n");
  const pn = await seite("zeit=nacht&jahr=winter");
  const N = await pn.evaluate(() => {
    const FW = STADT.fuhrwerk, vor = FW.wagen.map((w) => [w.x, w.y]);
    FW.vorspulen(240);
    const nach = FW.wagen.map((w) => [w.x, w.y]);
    return { n: FW.wagen.length, nacht: STADT.szene.zeitDaten().nacht, weg: Math.max(0, ...vor.map((p, i) => Math.hypot(p[0] - nach[i][0], p[1] - nach[i][1]))), zustand: FW.wagen.map((w) => w.zustand), bahn: !!FW.bahn };
  });
  sage(N.n >= 1 && N.weg < 0.01 && N.zustand.every((z) => z === "ruht"), "nachts bewegen sich die Kornwagen nicht (4 min)", "Nachtgrad " + N.nacht + ", " + N.weg.toFixed(3) + " m, " + N.zustand.join(","));
  await pn.evaluate(() => { const FW = STADT.fuhrwerk; FW.bahnFest = 12 + FW.bahn.fahr / 2; FW.vorspulen(0.1); const K = STADT.kamera; K.x = FW.bahn.mx; K.y = FW.bahn.my; K.s = 16 * K.dpr; STADT.leicht.unruhe = 3; });
  await ruhig(pn);
  const nb = await pn.evaluate(() => STADT.fuhrwerk.sichtbar(STADT.szene.zeitDaten()).map((p) => p.img.src.split("/").pop().split("?")[0]));
  sage(nb.length >= 1 && nb.every((b) => /_nacht/.test(b)), "nachts: Nachtblätter", nb.join(", "));
  sage(!pn.fehler.length, "nachts ohne Seitenfehler", pn.fehler.join(" | "));
  await foto(pn, "pferdebahn-nacht");
  await pn.close();

  console.log("\nKLEINER RAHMEN UND SPARMODUS: HÖCHSTENS EIN WAGEN\n");
  const pm = await seite("mini=1&eingebettet=1&jahr=winter&zeit=tag", { width: 330, height: 206 });
  const mm = await pm.evaluate(() => { const FW = STADT.fuhrwerk, K = STADT.kamera; const w = FW.wagen[0] || FW.bahn; K.x = w.x; K.y = w.y; K.s = 6.6; STADT.leicht.unruhe = 3; return { n: FW.wagen.length + (FW.bahn ? 1 : 0) }; });
  await pm.waitForTimeout(2000); await ruhig(pm);
  const mn = await pm.evaluate(() => STADT.fuhrwerk.sichtbar(STADT.szene.zeitDaten()).map((p) => p.img.src.split("/").pop().split("?")[0]));
  sage(mm.n === 1, "im kleinen Rahmen ein Wagen", mm.n + " Fuhrwerke");
  sage(mn.length === 1 && mn.every((n) => /_z\.webp$/.test(n)), "… mit Zwergblatt", mn.join(", "));
  sage(!pm.fehler.length, "im kleinen Rahmen ohne Seitenfehler", pm.fehler.join(" | "));
  await foto(pm, "mini");
  await pm.close();
  const ps = await seite("spar=1&jahr=herbst&zeit=tag");
  const sn = await ps.evaluate(() => STADT.fuhrwerk.wagen.length + (STADT.fuhrwerk.bahn ? 1 : 0));
  sage(sn === 1, "im Sparmodus ein Wagen", sn + " Fuhrwerke");
  sage(!ps.fehler.length, "im Sparmodus ohne Seitenfehler", ps.fehler.join(" | "));
  await ps.close();
  await ende();
})().catch((e) => { console.error(e); process.exit(2); });
