#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 826: WEICHER KARTENRAND, MEHR BAURAUM, PLATEAU,
   BRÜCKEN QUER ÜBER DEM WASSER, LEUTE AUF DEN BRÜCKEN
   ---------------------------------------------------------------------
   XANDER: „wenn man die große Karte hat in der Panoramaansicht dann ist
   es so, dass es ja recht so viel Platz gibt und die Berge aber wie so ne
   Hintergrund Leinwand einfach abschneiden kann man die weich ausführen
   lassen … dass das die irgendwie so spitz zu laufen und dann … aus-
   klingen" – „dass wir da von den Grenzen her, dass das ein bisschen mehr
   verschwimmt oder wie das bei Anno … professionell ist".
   „das mit dem Raster scheint jetzt übrigens zu gehen. Du hast es jetzt
   so rechteckig gemacht … nach unten hin könnte ein bisschen tiefer gehen
   … ich will noch den Kölner Dom rein bauen … Der Bootsverleih will ich
   mir richtig angucken können" – „Außerdem wollten wir das Plateau noch
   ein bisschen anheben." – „Leute sollen über die Brücke laufen. Guck
   mal, dass die Brücken nicht korrigieren weil das wirkt hier so als wenn
   da zwei Brücken sich überlappen".

   Geprüft (stadt-leicht.html?demo=1, große Ansicht 1280 × 800 und
   Telefon 360 × 740, kleiner Rahmen in einer Hülle mit iframe):
     • die Kamera erreicht den erweiterten Rand (links, rechts, unten und
       unten links), oben bleiben die Alpen die Grenze;
     • unten auf dem Plateau ist freie Fläche für ein Gebäude in der Größe
       des Kölner Doms (keine Häuser, Bäume, Wege, kein Wasser), die Kamera
       kommt hin – auch im kleinen Rahmen (Raster/Kacheln, Grenze beim
       Verschieben), der Bootsverleih ist dort ganz zu sehen;
     • Plateau: die Stadt liegt 5 m oder mehr über dem Umland; alle
       Häuser, Wahrzeichen, der Bahnhof, das Wasser liegen oben (Höhe 0),
       Bäume im Umland stehen auf ihrer Bodenhöhe (schweben nicht);
     • keine zwei Brücken überlappen, jede liegt mitten auf dem Wasser,
       quer zum Wasserlauf (≥ 60°), beide Enden auf Land, am Weg;
     • im Lauf einer Minute (Simulationszeit) gehen mehrere Leute über
       Brücken, auf der Brücke gehoben und nach ihr gemalt;
     • Horizont weich: kein Sprung in der Spaltenfarbe, wo die Alpen enden,
       und kein harter Übergang Himmel → Wiese am linken/rechten Bildrand;
     • Ergänzung: „der Kölner Dom … ist fast doppelt so hoch wie das
       Döbelner Rathaus … Schloss Neuschwanstein ist auch riesig … die
       sollen frei aufstellbar sein … bestehende Bäume … fällen … mehr
       rauszoomen": Dom 1,7–2,2 × Rathausturm, Neuschwanstein höher als
       das Rathaus, Fernsehturm gekappt; der Dom steht frei auf dem
       Bauland; ein Wahrzeichen versetzen, speichern, neu aufbauen (mit
       Weg), zurück; Baum fällen bleibt gemerkt; kleinster Maßstab ≤ 1,7;
     • keine Seitenfehler.
   Mit dem alten Stand (Fassung 811) ist fast alles rot.
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/pruefe-826-rand-bauraum.js
           (BILD=/pfad/826 → Fotos, WURZEL=/anderer/stand für die Gegenprobe)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };

let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const HUELLE = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#223}iframe{border:0;width:360px;height:225px;display:block;margin-top:60px}</style></head><body>'
  + '<iframe id="f" src="stadt-leicht.html?demo=1&mini=1&eingebettet=1&zeit=tag&jahr=sommer"></iframe></body></html>';

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/huelle-826.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(HUELLE); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const seitenFehler = [];
  const oeffnen = async (vp, dpr, url) => {
    const ctx = await br.newContext({ viewport: vp, deviceScaleFactor: dpr });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    await pg.goto(basis + url, { waitUntil: "load" });
    return { ctx, pg };
  };
  const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));

  /* ---------------- 1. Große Ansicht ---------------- */
  console.log("\nGROSSE ANSICHT 1280 × 800: RAND, BAURAUM, PLATEAU, BRÜCKEN, LEUTE, HORIZONT\n");
  const { ctx, pg } = await oeffnen({ width: 1280, height: 800 }, 1, "/stadt-leicht.html?demo=1&zeit=tag&jahr=sommer");
  await pg.waitForFunction(() => window.__fertig, { timeout: 90000 });
  await warte(1500);

  /* Kamera an den Rand: Ziele in Bildachsen (u = x − y, v = x + y) */
  const rand = await pg.evaluate(() => {
    const ST = window.STADT, K = ST.kamera, D = ST.dorf, R = D.BAURAUM || { u0: -168, u1: 166, v0: -142, v1: 190 };
    const hin = (u, v) => { K.x = (u + v) / 2; K.y = (v - u) / 2; ST.leicht.schiebe(0, 0); return [+(K.x - K.y).toFixed(1), +(K.x + K.y).toFixed(1)]; };
    const aus = { links: hin(R.u0, 0), rechts: hin(R.u1, 0), unten: hin(0, R.v1), untenLinks: hin(R.u0 + 10, R.v1 - 10), oben: hin(0, -400), R: R };
    hin(0, 8);
    return aus;
  });
  const nah = (a, u, v) => Math.hypot(a[0] - u, a[1] - v) < 3;
  sage(nah(rand.links, rand.R.u0, 0) && nah(rand.rechts, rand.R.u1, 0), "die Kamera fährt bis an den linken und rechten Rand des Bauraums", JSON.stringify({ links: rand.links, rechts: rand.rechts }));
  sage(nah(rand.unten, 0, rand.R.v1) && nah(rand.untenLinks, rand.R.u0 + 10, rand.R.v1 - 10), "… bis an den unteren Rand, auch unten links (dort war beim alten Quadrat Schluss)", JSON.stringify({ unten: rand.unten, untenLinks: rand.untenLinks }));
  sage(rand.oben[1] >= -125 && rand.oben[1] <= -110, "oben bleiben die Alpen die Grenze (nicht weit über die Horizontlinie)", JSON.stringify(rand.oben));

  /* Plateau und Platz für den Kölner Dom unten */
  const platz = await pg.evaluate(() => {
    const ST = window.STADT, D = ST.dorf, B = ST.boden, SZ = ST.szene;
    const hoehe = D.hoehe || (() => null);
    const erg = { plateau: !!D.BAURAUM && D.BAURAUM.hoehe, fehlt: [] };
    /* alles Gebaute liegt oben */
    for (const o of SZ.objekte) {
      if (o.art === "natur") continue;
      const h = hoehe(o.x, o.y); if (h == null || Math.abs(h) > 0.01) erg.fehlt.push((o.name || o.bild) + ":" + h);
    }
    /* Wasser liegt oben */
    let wasser = 0, wasserUnten = 0;
    for (let y = -110; y <= 110; y += 2) for (let x = -110; x <= 110; x += 2) if (B.wert(x, y, 1) > 0.5) { wasser++; const h = hoehe(x, y); if (h == null || h < -0.01) wasserUnten++; }
    erg.wasser = wasser; erg.wasserUnten = wasserUnten;
    /* Bäume im Umland schweben nicht (o.z = Bodenhöhe) */
    let umland = 0, schwebt = 0;
    for (const o of SZ.objekte) { if (o.art !== "natur") continue; const h = hoehe(o.x, o.y); if (h == null) continue; if (h < -0.5) { umland++; if (Math.abs((o.z || 0) - h) > 0.05) schwebt++; } }
    erg.umland = umland; erg.schwebt = schwebt;
    erg.aussen = hoehe(0, 330);   // weit unten vor dem Plateau
    /* Dom-Größe (Maßstab wie im Dorf 0,36, schräg zum Betrachter): 19,5 × 10,9 m, in Bildachsen 27,6 × 15,4 – dazu 3 m Rand */
    const W = D.WUNDER && D.WUNDER.koelner_dom, m = (W && W.mass) || 0.36, fu = W ? W.fuss : [54.2, 30.4];
    const du = fu[0] * m * Math.SQRT2 + 8.5, dv = fu[1] * m * Math.SQRT2 + 8.5;
    const hind = SZ.objekte.filter((o) => !o.versteckt && o.fuss && o.spiel !== "koelner_dom");   // der Dom selbst darf dort stehen
    const frei = (u, v) => {
      for (let a = -0.5; a <= 0.5; a += 0.125) for (let b = -0.5; b <= 0.5; b += 0.125) {
        const uu = u + a * du, vv = v + b * dv, x = (uu + vv) / 2, y = (vv - uu) / 2;
        if (B.wert(x, y, 0) > 0.1 || B.wert(x, y, 1) > 0.1) return false;
        const h = hoehe(x, y); if (h != null && h < -0.01) return false;
      }
      for (const o of hind) {
        const ou = o.x - o.y, ov = o.x + o.y, r = Math.hypot(o.fuss[0], o.fuss[1]) / 2 * (o.stufe || 1) * Math.SQRT2 * 0.8;
        if (Math.abs(ou - u) < du / 2 + r && Math.abs(ov - v) < dv / 2 + r) return false;
      }
      return true;
    };
    erg.spot = null;
    for (let v = 190; v >= 100 && !erg.spot; v -= 3) for (let u = -170; u <= 170 && !erg.spot; u += 3) if (frei(u, v)) erg.spot = [u, v];
    if (erg.spot) {
      const K = ST.kamera, [u, v] = erg.spot; K.x = (u + v) / 2; K.y = (v - u) / 2; ST.leicht.schiebe(0, 0);
      erg.kamera = Math.hypot(K.x - K.y - u, K.x + K.y - v);
      K.x = 0; K.y = 8; ST.leicht.schiebe(0, 0);
    }
    return erg;
  });
  sage(platz.plateau >= 5 && platz.aussen != null && platz.aussen <= -5, "Plateau: die Stadt liegt mindestens 5 m über dem Umland", JSON.stringify({ hoehe: platz.plateau, aussen: platz.aussen }));
  sage(platz.plateau >= 5 && !platz.fehlt.length && platz.wasser > 100 && !platz.wasserUnten, "alle Häuser, Wahrzeichen, Bahnhof, Brücken und das ganze Wasser liegen oben auf dem Plateau (nichts schwebt, der See bleibt ganz)", JSON.stringify({ fehlt: platz.fehlt.slice(0, 4), wasser: platz.wasser, wasserUnten: platz.wasserUnten }));
  sage(platz.umland > 10 && platz.schwebt === 0, "Bäume im Umland stehen unten auf ihrer Bodenhöhe", JSON.stringify({ umland: platz.umland, schwebt: platz.schwebt }));
  sage(!!platz.spot && platz.kamera < 2, "unten auf dem Plateau ist Platz für ein Gebäude in Dom-Größe (frei von Häusern, Bäumen, Wegen, Wasser) und die Kamera kommt hin", JSON.stringify({ spot: platz.spot, kamera: platz.kamera }));

  /* Ergänzung (Xander): Maßstab der Wahrzeichen, frei aufstellbar, Bäume fällen, weiter herauszoomen */
  const wz = await pg.evaluate(() => {
    const ST = window.STADT, D = ST.dorf, SZ = ST.szene, L = ST.leicht, K = ST.kamera;
    const ob = (k) => SZ.objekte.find((o) => o.spiel === k);
    const rat = ob("rathaus"), dom = ob("koelner_dom"), neu = ob("neuschwanstein"), turm = ob("fernsehturm");
    const aus = { rathaus: rat && rat.hoehe, dom: dom && +dom.hoehe.toFixed(1), neuschwanstein: neu && +neu.hoehe.toFixed(1), fernsehturm: turm && +turm.hoehe.toFixed(1), kMin: +(K.min / K.dpr).toFixed(2) };
    /* der Dom steht frei: nicht auf Häusern, anderen Wahrzeichen, im Wasser oder über dem Plateaurand */
    if (dom) {
      const ecken = SZ.ecken(dom, 0); let wasser = 0, rand = 0;
      for (let a = 0; a <= 1; a += 0.1) for (let b = 0; b <= 1; b += 0.1) {
        const x = ecken[0][0] + (ecken[1][0] - ecken[0][0]) * a + (ecken[3][0] - ecken[0][0]) * b, y = ecken[0][1] + (ecken[1][1] - ecken[0][1]) * a + (ecken[3][1] - ecken[0][1]) * b;
        if (ST.boden.wert(x, y, 1) > 0.3) wasser++; if (D.randAbst && D.randAbst(x, y) > -1) rand++;
      }
      const r = Math.hypot(dom.fuss[0], dom.fuss[1]) / 2 * 0.75;
      const stoesst = SZ.objekte.filter((o) => o !== dom && (o.art === "haus" || o.art === "wunder" || (o.art === "kulisse" && o.name)) && Math.hypot(o.x - dom.x, o.y - dom.y) < r + Math.hypot(o.fuss[0], o.fuss[1]) / 2 * 0.75).map((o) => o.name || o.spiel);
      aus.domFrei = { wasser, rand, stoesst, v: +(dom.x + dom.y).toFixed(0) };
    }
    /* frei aufstellen: Neuschwanstein auf das Bauland links, speichern, neu aufbauen – und zurück */
    if (neu && L.dekoSpeichern && D.BAULAND) {
      const b = D.BAULAND[1], u = (b.u0 + b.u1) / 2, v = (b.v0 + b.v1) / 2;
      neu.x = (u + v) / 2; neu.y = (v - u) / 2; neu.dreh = 3;
      L.dekoSpeichern(); L.aufbauen();
      const n2 = ob("neuschwanstein");
      aus.frei = { lage: L.lage && L.lage.neuschwanstein, x: n2 && n2.x, y: n2 && n2.y, dreh: n2 && n2.dreh, weg: D.WEGE.some((w) => Math.hypot(w[w.length - 1][0] - n2.x, w[w.length - 1][1] - n2.y) < 30 || Math.hypot(w[0][0] - n2.x, w[0][1] - n2.y) < 30) };
      n2.x = n2.platzX; n2.y = n2.platzY; n2.dreh = n2.platzDreh; L.dekoSpeichern(); L.aufbauen();
      const n3 = ob("neuschwanstein"); aus.zurueck = { lage: L.lage && L.lage.neuschwanstein, x: n3.x, y: n3.y };
    }
    /* einen Baum fällen: er bleibt auch nach dem Neuaufbau weg */
    const baum = SZ.objekte.find((o) => o.art === "natur" && !o.rand && /^n_(tanne|laubbaum)/.test(o.bild));
    if (baum && L.baumFaellen) {
      const k = baum.x.toFixed(1) + "," + baum.y.toFixed(1);
      L.baumFaellen(baum); L.aufbauen();
      aus.faellen = { weg: !SZ.objekte.some((o) => o.art === "natur" && o.x.toFixed(1) + "," + o.y.toFixed(1) === k), gemerkt: (L.gefaellt || []).indexOf(k) >= 0 };
    }
    return aus;
  });
  sage(wz.dom && wz.rathaus && wz.dom / wz.rathaus >= 1.7 && wz.dom / wz.rathaus <= 2.2, "Kölner Dom fast doppelt so hoch wie der Turm des Döbelner Rathauses (" + wz.dom + " m zu " + wz.rathaus + " m)");
  sage(wz.neuschwanstein > wz.rathaus && wz.fernsehturm > wz.dom && wz.fernsehturm <= 50, "Neuschwanstein höher als das Rathaus (" + wz.neuschwanstein + " m), Fernsehturm überragt den Dom, gekappt (" + wz.fernsehturm + " m statt echt 368 m)");
  sage(!!wz.domFrei && wz.domFrei.v > 100 && !wz.domFrei.wasser && !wz.domFrei.rand && !wz.domFrei.stoesst.length, "der große Dom hat unten auf dem Bauland Platz (nicht im Wasser, nicht über dem Rand, stößt an nichts)", JSON.stringify(wz.domFrei));
  sage(!!wz.frei && !!wz.frei.lage && wz.frei.lage.x != null && Math.abs(wz.frei.x - wz.frei.lage.x) < 0.1 && wz.frei.dreh === 3 && wz.frei.weg, "Wahrzeichen frei aufstellbar: Neuschwanstein steht nach dem Speichern und Neuaufbau am neuen Ort, ein Weg führt hin", JSON.stringify(wz.frei));
  sage(!!wz.zurueck && !wz.zurueck.lage, "„Zurück auf den Wahrzeichenplatz\" löscht die freie Lage wieder", JSON.stringify(wz.zurueck));
  sage(!!wz.faellen && wz.faellen.weg && wz.faellen.gemerkt, "ein Baum lässt sich fällen und bleibt auch nach dem Neuaufbau weg", JSON.stringify(wz.faellen));
  sage(wz.kMin <= 1.7, "weiter herauszoomen: kleinster Maßstab " + wz.kMin + " Bildpunkte je Meter (vorher 2,4)");

  /* Brücken */
  const bruecken = await pg.evaluate(() => {
    const ST = window.STADT, B = ST.boden, SZ = ST.szene;
    const liste = SZ.objekte.filter((o) => /^d_bruecke/.test(o.bild || ""));
    const ecken = (o) => { const w = o.fuss[0] / 2, d = o.fuss[1] / 2, a = o.dreh * Math.PI / 2, c = Math.cos(a), s = Math.sin(a); return [[-w, -d], [w, -d], [w, d], [-w, d]].map((p) => [o.x + p[0] * c - p[1] * s, o.y + p[0] * s + p[1] * c]); };
    const trennt = (A, Bq) => { for (const P of [A, Bq]) for (let i = 0; i < 4; i++) { const p = P[i], q = P[(i + 1) % 4], n = [q[1] - p[1], p[0] - q[0]]; const pa = A.map((z) => z[0] * n[0] + z[1] * n[1]), pb = Bq.map((z) => z[0] * n[0] + z[1] * n[1]); if (Math.max(...pa) < Math.min(...pb) || Math.max(...pb) < Math.min(...pa)) return true; } return false; };
    const paare = [];
    for (let i = 0; i < liste.length; i++) for (let j = i + 1; j < liste.length; j++) if (!trennt(ecken(liste[i]), ecken(liste[j]))) paare.push([i, j]);
    const einzel = liste.map((o) => {
      const a = o.dreh * Math.PI / 2, ax = [-Math.sin(a), Math.cos(a)];
      const mitte = B.wert(o.x, o.y, 1);
      const enden = [1, -1].map((f) => B.wert(o.x + ax[0] * 5.6 * f, o.y + ax[1] * 5.6 * f, 1));
      const weg = [1, -1].map((f) => Math.max(B.wert(o.x + ax[0] * 6.8 * f, o.y + ax[1] * 6.8 * f, 0), B.wert(o.x + ax[0] * 7.6 * f, o.y + ax[1] * 7.6 * f, 0)));
      /* Wasserlauf: Richtung der Wasserpunkte auf zwei Ringen (Winkel verdoppelt, damit Hin und Zurück zählen) */
      let sx = 0, sy = 0;
      for (const r of [3.2, 4.5]) for (let k = 0; k < 72; k++) { const w = k * Math.PI / 36, x = o.x + Math.cos(w) * r, y = o.y + Math.sin(w) * r, g = B.wert(x, y, 1); if (g > 0.5) { sx += Math.cos(2 * w) * g; sy += Math.sin(2 * w) * g; } }
      const lauf = Math.atan2(sy, sx) / 2, quer = Math.abs(Math.cos(Math.atan2(ax[1], ax[0]) - lauf));
      return { x: +o.x.toFixed(1), y: +o.y.toFixed(1), dreh: o.dreh, mitte: +mitte.toFixed(2), enden: enden.map((z) => +z.toFixed(2)), weg: weg.map((z) => +z.toFixed(2)), winkel: +(Math.acos(Math.min(1, quer)) * 180 / Math.PI).toFixed(0) };
    });
    let abst = Infinity; for (let i = 0; i < liste.length; i++) for (let j = i + 1; j < liste.length; j++) abst = Math.min(abst, Math.hypot(liste[i].x - liste[j].x, liste[i].y - liste[j].y));
    return { n: liste.length, paare: paare, einzel: einzel, abst: +abst.toFixed(1) };
  });
  sage(bruecken.n >= 3 && bruecken.paare.length === 0 && bruecken.abst >= 12, "keine zwei Brücken überlappen, auch nicht im Bild: mindestens eine Brückenlänge (12 m) Abstand (" + bruecken.n + " Brücken, kleinster Abstand " + bruecken.abst + " m)", JSON.stringify(bruecken.paare));
  const aufWasser = bruecken.einzel.filter((b) => b.mitte > 0.5 && b.enden.every((z) => z < 0.35));
  sage(bruecken.n >= 3 && aufWasser.length === bruecken.n, "jede Brücke liegt mitten auf dem Wasser, beide Enden auf Land", JSON.stringify(bruecken.einzel.filter((b) => aufWasser.indexOf(b) < 0)));
  const quer = bruecken.einzel.filter((b) => b.winkel >= 60);
  sage(bruecken.n >= 3 && quer.length === bruecken.n, "jede Brücke steht quer zum Wasserlauf (≥ 60°)", JSON.stringify(bruecken.einzel.map((b) => [b.x, b.y, b.dreh, b.winkel])));
  const amWeg = bruecken.einzel.filter((b) => b.weg.every((z) => z > 0.3));
  sage(bruecken.n >= 3 && amWeg.length === bruecken.n, "an beiden Enden jeder Brücke geht der Weg weiter", JSON.stringify(bruecken.einzel.filter((b) => amWeg.indexOf(b) < 0)));

  /* Leute auf den Brücken, eine Minute Simulationszeit */
  const leute = await pg.evaluate(() => {
    const ST = window.STADT, LE = ST.leute, SZ = ST.szene, br = SZ.objekte.filter((o) => /^d_bruecke/.test(o.bild || ""));
    const K = LE.knoten;
    const pos = (m) => { const a = K[m.von], b = K[m.nach], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [a[0] + dx * m.t - dy / l * m.seite, a[1] + dy * m.t + dx / l * m.seite]; };
    const auf = (p) => br.find((o) => { const w = o.dreh * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), dx = p[0] - o.x, dy = p[1] - o.y; return Math.abs(dx * c + dy * s) < 1.9 && Math.abs(-dx * s + dy * c) < 5.4; });
    const wer = new Set(); let momente = 0, halt = null;
    /* eine Minute in Schritten von 50 ms (synchron – die Bildschleife kommt dazwischen nicht dran) */
    const t0 = 5e6;
    LE.bewegen(t0);
    for (let t = t0 + 50; t <= t0 + 60000; t += 50) {
      LE.bewegen(t);
      LE.liste.forEach((m, i) => {
        const p = pos(m), b = auf(p); if (!b) return;
        wer.add(i); momente++;
        /* jemand mitten auf der Brücke bleibt stehen – für das Bild danach */
        if (!halt && t > t0 + 20000) { const w = b.dreh * Math.PI / 2; if (Math.abs(-(p[0] - b.x) * Math.sin(w) + (p[1] - b.y) * Math.cos(w)) < 2.5) { halt = { i, b }; m.pause = 1e4; } }
      });
    }
    if (halt) { const Kam = ST.kamera; Kam.x = halt.b.x; Kam.y = halt.b.y; Kam.s = 16 * Kam.dpr; ST.leicht.unruhe = 3; window.__halt826 = halt; }
    return { zahl: LE.liste.length, wer: wer.size, momente: momente, halt: !!halt, brueckenKnoten: LE.brueckenKnoten ? LE.brueckenKnoten.size : 0 };
  });
  for (let i = 0; i < 60; i++) { await warte(500); if (await pg.evaluate(() => { const ST = window.STADT, h = window.__halt826; ST.leicht.unruhe = 2; if (!h) return true; const m = ST.leute.liste[h.i], K = ST.leute.knoten, a = K[m.von], b = K[m.nach], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, r = ST.drehXY(a[0] + dx * m.t - dy / l * m.seite, a[1] + dy * m.t + dx / l * m.seite, ST.kamera.dreh); return ST.leute.sichtbar(ST.szene.zeitDaten()).some((e) => Math.abs(e.a - r[0]) < 0.01 && Math.abs(e.b - r[1]) < 0.01); })) break; }
  await warte(600);
  leute.probe = await pg.evaluate(() => {
    const ST = window.STADT, LE = ST.leute, SZ = ST.szene, h = window.__halt826; if (!h) return null;
    const m = LE.liste[h.i], K = LE.knoten, a = K[m.von], b = K[m.nach], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const p = [a[0] + dx * m.t - dy / l * m.seite, a[1] + dy * m.t + dx / l * m.seite], r = ST.drehXY(p[0], p[1], ST.kamera.dreh);
    const s = LE.sichtbar(SZ.zeitDaten()).find((e) => Math.abs(e.a - r[0]) < 0.01 && Math.abs(e.b - r[1]) < 0.01);
    const boden = ST.proj(p[0], p[1], 0);
    const alle = LE.sichtbar(SZ.zeitDaten());
    return s ? { vorhanden: true, auf: !!s.auf && s.auf.x === h.b.x && s.auf.y === h.b.y && SZ.objekte.indexOf(s.auf) >= 0, hoch: +((boden[1] - s.Y) / (ST.kamera.s * ST.KZ)).toFixed(2) } : { vorhanden: false, sichtbar: alle.length, naechste: Math.min(...alle.map((e) => Math.hypot(e.a - r[0], e.b - r[1]))), pause: m.pause, p: p };
  });
  sage(leute.zahl >= 36, "mehr Bewegung auf den Wegen: " + leute.zahl + " Spaziergänger (vorher 30)");
  sage(leute.wer >= 4, "im Lauf einer Minute gehen mehrere Leute über die Brücken", JSON.stringify(leute));
  sage(!!leute.probe && leute.probe.auf && leute.probe.hoch > 0.5, "wer auf der Brücke geht, wird um die Deckhöhe gehoben (Meter) und nach der Brücke gemalt (nicht darunter versteckt)", JSON.stringify(leute.probe));
  if (BILD) await pg.screenshot({ path: BILD + "-gross-leute-bruecke.png" });

  /* Weicher Horizont: Spaltenmittel über dem Horizont, Zeilen am Bildrand */
  const horizont = async (pgx, u) => pgx.evaluate(async (u) => {
    const ST = window.STADT, K = ST.kamera, D = ST.dorf;
    K.s = K.min; K.x = (u + 8) / 2; K.y = (8 - u) / 2; ST.leicht.schiebe(0, 0); ST.leicht.unruhe = 3;
    await new Promise((ok) => setTimeout(ok, 1500));
    /* nur Boden + Himmel und Berge (himmel.js), ohne Häuser und Bäume davor – die haben eigene Kanten */
    const c = document.createElement("canvas"); c.width = K.W; c.height = K.H;
    const g = c.getContext("2d");
    g.drawImage(document.getElementById("lBoden"), 0, 0, K.W, K.H);
    ST.himmel.hinten(g, 1, ST.szene.zeitDaten());
    const Yh = Math.round(ST.proj(D.HORIZONT / 2, D.HORIZONT / 2, 0)[1]), s = K.s;
    const y0 = Math.max(0, Math.round(Yh - 16 * s)), y1 = Yh - 1;
    const bild = g.getImageData(0, 0, K.W, K.H).data;
    const px = (x, y) => { const o = (y * K.W + x) * 4; return [bild[o], bild[o + 1], bild[o + 2]]; };
    const spalte = [];
    for (let x = 0; x < K.W; x++) { let r = 0, gg = 0, b = 0, n = 0; for (let y = y0; y <= y1; y++) { const p = px(x, y); r += p[0]; gg += p[1]; b += p[2]; n++; } spalte.push([r / n, gg / n, b / n]); }
    let spMax = 0, spWo = 0;
    const d2 = Math.max(2, Math.round(2 * K.dpr));
    for (let x = 0; x + d2 < K.W; x++) { const a = spalte[x], b = spalte[x + d2], d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); if (d > spMax) { spMax = d; spWo = x; } }
    /* am linken und rechten Bildrand: senkrecht durch den Horizont */
    let zMax = 0;
    for (const x of [Math.round(6 * K.dpr), K.W - Math.round(6 * K.dpr)]) for (let y = Math.max(0, Yh - Math.round(1.5 * s)); y < Math.min(K.H - d2, Yh + Math.round(8 * s)); y++) {
      const a = px(x, y), b = px(x, y + d2), d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); zMax = Math.max(zMax, d);
    }
    return { Yh, spMax: +spMax.toFixed(1), spWo, zMax, W: K.W };
  }, u);
  const h1a = await horizont(pg, 0);
  if (BILD) await pg.screenshot({ path: BILD + "-gross-weit.png" });
  const h1b = await horizont(pg, -168);
  if (BILD) await pg.screenshot({ path: BILD + "-gross-weit-links.png" });
  const h1 = { spMax: Math.max(h1a.spMax, h1b.spMax), zMax: Math.max(h1a.zMax, h1b.zMax), mitte: h1a, links: h1b };
  sage(h1.spMax < 60, "Horizont 1280 × 800: die Alpen laufen seitlich weich aus (größter Sprung im Spaltenmittel über dem Horizont " + h1.spMax + ", Grenze 60)", JSON.stringify(h1));
  sage(h1.zMax < 130, "am linken und rechten Bildrand geht der Himmel weich ins Umland über (größter Sprung " + h1.zMax + ", Grenze 130 – alter Stand über 290)", JSON.stringify(h1));

  if (BILD) {
    await pg.evaluate(() => { const ST = window.STADT, K = ST.kamera; K.s = K.min; K.x = -40; K.y = 150; ST.leicht.schiebe(0, 0); ST.leicht.unruhe = 3; }); await warte(1500);
    await pg.screenshot({ path: BILD + "-gross-untenlinks.png" });
    const b = await pg.evaluate(() => { const o = window.STADT.szene.objekte.find((q) => /^d_bruecke/.test(q.bild) && Math.abs(q.x + 6.7) < 3); const K = window.STADT.kamera; K.s = 16 * K.dpr; K.x = o ? o.x : -7; K.y = o ? o.y : 11; window.STADT.leicht.schiebe(0, 0); window.STADT.leicht.unruhe = 3; return !!o; });
    await warte(4000); await pg.screenshot({ path: BILD + "-gross-bruecke.png" });
  }
  await ctx.close();

  /* ---------------- 2. Telefon hoch 360 × 740 ---------------- */
  console.log("\nTELEFON 360 × 740 (HOCH): HORIZONT UND RAND\n");
  {
    const t = await oeffnen({ width: 360, height: 740 }, 2, "/stadt-leicht.html?demo=1&zeit=tag&jahr=sommer");
    await t.pg.waitForFunction(() => window.__fertig, { timeout: 90000 }); await warte(1200);
    const h2 = await horizont(t.pg, 0);
    sage(h2.spMax < 60 && h2.zMax < 130, "Horizont auf dem Telefon weich (Spalten " + h2.spMax + ", Rand " + h2.zMax + ")", JSON.stringify(h2));
    const r2 = await t.pg.evaluate(() => { const ST = window.STADT, K = ST.kamera, R = ST.dorf.BAURAUM || { u0: -168, v1: 190 }; K.x = (R.u0 + 10 + R.v1 - 10) / 2; K.y = (R.v1 - 10 - R.u0 - 10) / 2; ST.leicht.schiebe(0, 0); return Math.hypot(K.x - K.y - R.u0 - 10, K.x + K.y - R.v1 + 10); });
    sage(r2 < 3, "auch auf dem Telefon reicht die Kamera bis unten links", String(r2));
    if (BILD) { await warte(1200); await t.pg.screenshot({ path: BILD + "-hoch-untenlinks.png" }); }
    await t.ctx.close();
  }

  /* ---------------- 3. Kleiner Rahmen ---------------- */
  console.log("\nKLEINER RAHMEN (mini=1): RASTER UND GRENZE NACH UNTEN\n");
  {
    const t = await oeffnen({ width: 360, height: 400 }, 2, "/huelle-826.html");
    let fr = null;
    for (let i = 0; i < 120 && !fr; i++) { fr = t.pg.frames().find((f) => /stadt-leicht\.html/.test(f.url())); if (fr && !(await fr.evaluate(() => !!window.__fertig && !!(window.STADT.oberflaeche || {}).ueberblick).catch(() => false))) fr = null; if (!fr) await warte(250); }
    sage(!!fr, "die Stadt läuft im kleinen Rahmen");
    if (fr) {
      await warte(800);
      const m = await fr.evaluate(() => {
        const ST = window.STADT, O = ST.oberflaeche, D = ST.dorf, K = ST.kamera, g = O.ueberblick();
        const s1 = g.s * 2.8;
        const ziel = (x, y) => { const z = O.klemmZiel(x, y, s1); return +Math.hypot(z[0] - x, z[1] - y).toFixed(2); };
        const bh = D.BOOTSHAUS || [56.5, 44.5];
        /* Bauland unten links: Mitte des freien Platzes (wie in der großen Ansicht gefunden) */
        const bl = D.BAULAND ? D.BAULAND[0] : { u0: -132, u1: -40, v0: 104, v1: 176 };
        const bu = (bl.u0 + bl.u1) / 2, bv = (bl.v0 + bl.v1) / 2;
        const aus = { bootshaus: ziel(bh[0], bh[1] + 1.5), s: g.s };
        /* Bauland: mit dem Kompass so weit hin, wie es geht – liegt seine Mitte dann gut im Bild? */
        {
          const bx = (bu + bv) / 2, by = (bv - bu) / 2, z = O.klemmZiel(bx, by, s1), alt = { x: K.x, y: K.y, s: K.s };
          K.x = z[0]; K.y = z[1]; K.s = s1;
          const P = ST.proj(bx, by, 0); aus.bauland = [+(P[0] / K.W).toFixed(2), +(P[1] / K.H).toFixed(2)];
          K.x = alt.x; K.y = alt.y; K.s = alt.s;
        }
        /* Bootsverleih ganz im Bild, wenn die Kamera dort ist */
        const z = O.klemmZiel(bh[0], bh[1], s1), alt = { x: K.x, y: K.y, s: K.s };
        K.x = z[0]; K.y = z[1]; K.s = s1;
        const o = ST.szene.objekte.find((q) => q.bild === "d_bootshaus");
        const e = o ? ST.szene.ecken(o).map((q) => ST.proj(q[0], q[1], 0)) : [];
        aus.bootImBild = e.length === 4 && e.every((p) => p[0] > 0 && p[0] < K.W && p[1] > 0 && p[1] < K.H);
        K.x = alt.x; K.y = alt.y; K.s = alt.s;
        return aus;
      });
      sage(m.bootshaus < 1, "im kleinen Rahmen kommt man mit dem Kompass zum Bootsverleih", JSON.stringify(m));
      sage(m.bootImBild, "der Bootsverleih ist dort ganz im Bild");
      sage(m.bauland[0] > 0.1 && m.bauland[0] < 0.9 && m.bauland[1] > 0.1 && m.bauland[1] < 0.9, "… und weiter nach unten bis zum Bauland (Platz für den Kölner Dom): seine Mitte liegt gut im Bild", JSON.stringify(m));
      /* Kachel unten links: genau das Neuntel des Rasters, und es liegt tiefer als der Überblick */
      await fr.evaluate(() => { const O = window.STADT.oberflaeche; O.kachelHin(0, 2); });
      await warte(1300);
      const k = await fr.evaluate(() => { const ST = window.STADT, O = ST.oberflaeche, K = ST.kamera, g = O.ueberblick(); const t = O.blickTeile(); const mx = K.x, my = K.y; const unten = O.imUeberblick(() => ST.proj(mx, my, 0)[1] / K.H); return { t: t.map((q) => q.map((x) => +x.toFixed(3))), untenImUeberblick: +unten.toFixed(2), v: +(mx + my).toFixed(0) }; });
      const soll = [[0, 2 / 3], [1 / 3, 1]];
      sage([0, 1].every((a) => [0, 1].every((b) => Math.abs(k.t[a][b] - soll[a][b]) < 0.02)), "Kachel unten links zeigt genau ihr Neuntel des Rasters", JSON.stringify(k));
      sage(k.v >= 100, "… und reicht nach unten bis zum Bauland und See (Mitte der Kachel v = x + y ≥ 100; das alte Raster endete an der Zunge des Sees)", JSON.stringify(k));
      if (BILD) { await t.pg.screenshot({ path: BILD + "-rahmen-untenlinks.png" }); }
    }
    await t.ctx.close();
  }

  sage(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " FEHLER" : "\nALLES GUT");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
