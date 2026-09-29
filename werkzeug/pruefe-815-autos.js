#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 815: DODGE VIPER UND BATMOBIL FAHREN IN DER STADT
   ---------------------------------------------------------------------
   XANDER: „mein neuen Dodge Viper und mein Batmobil habe ich immer noch
   nicht in der Map … Du sagst, sie sind fertig, aber ich seh sie noch
   immer nicht. Ich kann sie nicht dazu kaufen. Ich kann sie im Spiel
   überhaupt nicht ausprobieren." – früher: „dieses Batmobil hätte ich
   nicht nur in dem Spiel gerne, das als fahrendes Auto zu sehen ist".

   Geprüft (stadt-leicht.html?demo=1&quelle=1&autos=viper,batmobil,
   Telefon 390 × 844):
     • beide Autos fahren auf den Wegen (jeder Schritt < 2 m vom Weg),
       Tempo im Dorf 6–8 m/s, sanft (Beschleunigung ≤ 6 m/s²), keine
       Sprünge, die Blickrichtung passt zur Fahrtrichtung (rückwärts nur
       beim Wenden), sie halten vor Häusern und wenden in drei Zügen;
     • sie warten hinter einem Kornwagen, hinter der Pferdebahn und
       hinter einem anderen Auto (kein Auffahren);
     • in der Schmücken-Leiste stehen beide mit Preis und „Kaufen", die
       Karte hat den Kaufen-Knopf mit Preis (Beispielstadt: gesperrt,
       dafür Probefahrt); angemeldet ruft Kaufen spiel_auto_kaufen, das
       Auto fährt los; ohne diese Serverfunktion wird es vorläufig wie
       der Schmuck gespeichert; Abstellen und Losfahren;
     • nachts Scheinwerfer mit Lichtkegel, Nachtblätter, das Batmobil
       glüht beim Anfahren;
     • im kleinen Rahmen (mini=1) fahren sie mit dem Zwergblatt;
     • keine Seitenfehler.
   Mit dem alten Stand (ohne stadt-leicht/autos.js) ist alles rot.
   Aufruf: node werkzeug/pruefe-815-autos.js   (BILD=/pfad/815 → Fotos)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };

let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

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
    await pg.goto(basis + "?demo=1&quelle=1&" + query, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(800);
    return pg;
  };
  const foto = async (pg, name) => { if (BILD) await pg.screenshot({ path: BILD + "-" + name + ".png" }); };
  const ruhig = async (pg) => { await pg.waitForTimeout(900); await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {}); await pg.waitForTimeout(600); };
  const ende = async () => { await br.close(); srv.close(); console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0); };
  /* Kamera auf ein Auto (nah) */
  /* fürs Foto: warten (vorspulen), bis das Auto fährt und nichts Hohes (Haus, Baum) davor steht; dann nachsehen, ob es
     im Bild wirklich zu sehen ist (einmal mit, einmal ohne das Auto malen) – sonst ein Stück weiter */
  const hin = async (pg, id, s) => {
    let sicht = 0;
    for (let versuch = 0; versuch < 12 && sicht < 0.1; versuch++) {
      await pg.evaluate(([id, s, versuch]) => {
        const AU = STADT.autos, a = AU.auto(id), K = STADT.kamera, SZ = STADT.szene;
        /* (eine Baustelle stellt Bauwagen, Zaun und Kran weit um das Haus herum) */
        const verdeckt = () => SZ.objekte.some((o) => !o.versteckt && !SZ.flach(o) && o.fuss && Math.hypot(o.x - a.x, o.y - a.y) < (o.bau ? 16 : 6) + Math.max(o.fuss[0], o.fuss[1]) * (o.stufe || 1) / 2 && (o.x + o.y) > (a.x + a.y) - (o.bau ? 12 : 0));
        if (versuch) AU.vorspulen(3);
        for (let i = 0; i < 240 && (verdeckt() || a.zustand !== "faehrt" || a.v < 2); i++) AU.vorspulen(0.25);
        K.x = a.x; K.y = a.y; K.s = s * K.dpr; AU.folge = id; STADT.leicht.unruhe = 2; }, [id, s, versuch]);
      await ruhig(pg);
      sicht = await pg.evaluate((id) => {
        const AU = STADT.autos, a = AU.auto(id), g = document.getElementById("lDinge").getContext("2d"), P = STADT.proj(a.x, a.y, 0.6), r = Math.round(1.8 * STADT.kamera.s);
        const bild = () => { STADT.szene.zeichnen(performance.now()); return g.getImageData(Math.round(P[0]) - r, Math.round(P[1]) - r, 2 * r, 2 * r).data; };
        const mit = bild(); AU.ohne = id; const ohne = bild(); AU.ohne = null; bild();
        let n = 0; for (let i = 0; i < mit.length; i += 4) if (Math.abs(mit[i] - ohne[i]) + Math.abs(mit[i + 1] - ohne[i + 1]) + Math.abs(mit[i + 2] - ohne[i + 2]) > 30) n++;
        const K = STADT.kamera; window.__hin = { K: [+K.x.toFixed(1), +K.y.toFixed(1), K.s, K.W, K.H], a: [+a.x.toFixed(1), +a.y.toFixed(1)], P: P.map(Math.round), r: r };
        return n / (mit.length / 4);
      }, id);
      if (process.env.HIN) console.log("    hin " + id + " " + JSON.stringify(await pg.evaluate(() => window.__hin)) + " sicht " + sicht);
    }
    return sicht;
  };
  console.log("\nDIE AUTOS FAHREN (Beispielstadt, Tag, autos=viper,batmobil)\n");
  const pg = await seite("autos=viper,batmobil&zeit=tag&jahr=herbst");
  sage(!pg.fehler.length, "lädt ohne Seitenfehler", pg.fehler.join(" | "));
  const da = await pg.evaluate(() => !!(window.STADT.autos && STADT.autos.liste));
  sage(da, "es gibt die Autos (STADT.autos)");
  if (!da) return ende();
  const A0 = await pg.evaluate(() => ({ n: STADT.autos.liste.map((a) => a.id).join(","), grund: STADT.autos.grund, ziele: (STADT.autos.ziele || []).length, gezeigt: STADT.autos.gezeigt }));
  sage(A0.n === "viper,batmobil", "Viper und Batmobil sind in der Stadt", JSON.stringify(A0));

  /* 5 Minuten in Zwanzigstelsekunden (Fuhrwerke laufen mit) */
  const F = await pg.evaluate(() => {
    const AU = STADT.autos, mit = [], dt = 0.05;
    AU.vorspulen(300, dt, { mit: mit, fuhrwerke: true });
    const W = (a, b) => Math.abs(((a - b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
    const aus = {};
    for (const a of AU.liste) {
      let neben = 0, weitBei = "", dhBei = "", beschlBei = "", schiefBei = "", sprungBei = "", weit = 0, sprung = 0, dh = 0, schritte = 0, schief = 0, schiefMax = 0, rueck = 0, vmax = 0, beschl = 0, weg = 0, voll = 0;
      for (let i = 1; i < mit.length; i++) {
        const p = mit[i].find((x) => x.id === a.id), o = mit[i - 1].find((x) => x.id === a.id);
        /* FASSUNG 830 — XANDER: „fahren durch den Brunnen durch": an Brunnen, Bänken, Schmuck weicht die Strecke bewusst vom
           Weg ab (AU.inUmfahrung) – dort zählt der Abstand zum Weg nicht */
        const wa = AU.inUmfahrung && AU.inUmfahrung(p.x, p.y) ? 0 : AU.wegAbstand(p.x, p.y); if (wa > 1.25) neben++; if (wa > weit) { weit = wa; weitBei = p.z + " seite " + (+p.s).toFixed(2) + " v " + p.v + (p.r ? " rückwärts" : ""); }
        const d = Math.hypot(p.x - o.x, p.y - o.y); weg += d;
        if (d / dt - Math.max(p.v, o.v) > sprung) { sprung = d / dt - Math.max(p.v, o.v); sprungBei = o.z + ">" + p.z + " v " + p.v + " seite " + (+o.s).toFixed(2) + ">" + (+p.s).toFixed(2) + " i " + i; }
        if (W(p.h, o.h) / dt > dh) { dh = W(p.h, o.h) / dt; dhBei = o.z + ">" + p.z + " v " + p.v + " seite " + (+p.s).toFixed(2) + " " + p.g + " i " + i; }
        vmax = Math.max(vmax, p.v); if (p.v > 6) voll++;
        if (Math.abs(p.v - o.v) / dt > beschl) { beschl = Math.abs(p.v - o.v) / dt; beschlBei = o.z + ">" + p.z + " " + o.v + ">" + p.v + " " + o.g + ">" + p.g; }
        if (d > 0.03) {
          schritte++;
          const m = Math.atan2(p.y - o.y, p.x - o.x) + (p.r ? Math.PI : 0), e = W(m, p.h) * 57.3;
          if (e > 30) schief++; if (e > schiefMax) { schiefMax = e; schiefBei = o.z + ">" + p.z + " v " + p.v + (p.r ? " rückwärts" : "") + " grenze " + p.g; }
          if (p.r) rueck++;
        }
      }
      aus[a.id] = { neben: +(neben / (mit.length - 1)).toFixed(3), weitBei, dhBei, beschlBei, schiefBei, sprungBei, weit: +weit.toFixed(2), sprung: +sprung.toFixed(2), dh: +(dh * 57.3).toFixed(0), schritte, schief, schiefMax: +schiefMax.toFixed(0), rueck, vmax: +vmax.toFixed(2), voll,
        beschl: +beschl.toFixed(2), weg: +weg.toFixed(0), halte: (a.halte || []).slice(), wenden: a.wenden || 0,
        haltZeit: mit.filter((m) => m.find((x) => x.id === a.id).z === "haelt").length * dt };
    }
    return aus;
  });
  for (const id of ["viper", "batmobil"]) {
    const f = F[id], N = id === "viper" ? "Viper" : "Batmobil";
    sage(f.weg > 450, "[" + N + "] fährt (in 5 min)", f.weg + " m");
    sage(f.weit < 2 && f.neben < 0.12, "[" + N + "] bleibt auf den Wegen (jeder Schritt < 2 m vom Weg, meist – über 88 % der Zeit – auf dem Pflaster)", "weitester Abstand " + f.weit + " m (" + f.weitBei + "), " + (f.neben * 100).toFixed(1) + " % der Zeit mehr als 1,25 m neben der Wegmitte");
    sage(f.vmax >= 6 && f.vmax <= 8 && f.voll > 100, "[" + N + "] Tempo im Dorf 6–8 m/s", "vmax " + f.vmax + " m/s, " + (f.voll * 0.05).toFixed(0) + " s schneller als 6 m/s");
    sage(f.beschl <= 6.05 && f.sprung < 0.5 && f.dh < 300, "[" + N + "] keine Sprünge, sanft anfahren und bremsen", "größte Beschleunigung " + f.beschl + " m/s² (" + f.beschlBei + "), Sprung " + f.sprung + " m/s über dem Tempo (" + f.sprungBei + "), Drehung höchstens " + f.dh + "°/s (" + f.dhBei + ")");
    sage(f.schief / f.schritte < 0.01 && f.schiefMax < 60, "[" + N + "] Blickrichtung passt zur Fahrtrichtung (rückwärts nur beim Wenden)", f.schief + " von " + f.schritte + " Schritten über 30° daneben, höchstens " + f.schiefMax + "° (" + f.schiefBei + "); rückwärts " + f.rueck + " Schritte");
    const vorHaus = f.halte.filter((h) => h.haus);
    sage(vorHaus.length >= 2 && f.haltZeit >= 8, "[" + N + "] hält vor Häusern", vorHaus.map((h) => h.ziel).join(", ") + " · " + f.haltZeit.toFixed(0) + " s gehalten");
    sage(f.wenden >= 1 && f.rueck > 20, "[" + N + "] wendet, wo der Weg zurückführt (in drei Zügen, einer rückwärts)", f.wenden + " mal");
  }
  /* Halte liegen wirklich vor dem Haus: höchstens 16 m von der Hausmitte */
  /* FASSUNG 826 — bei den großen Wahrzeichen (Kölner Dom 43 m lang) gilt: höchstens 6 m vor der halben Grundfläche */
  const HA = await pg.evaluate(() => { const aus = []; for (const a of STADT.autos.liste) for (const h of a.halte || []) if (h.haus) { const o = STADT.szene.objekte.find((x) => (x.name || x.spiel || x.bild) === h.ziel); if (o) { const d = Math.hypot(o.x - h.x, o.y - h.y), g = Math.max(17, (o.fuss[0] + o.fuss[1]) / 2 + 6); aus.push([+d.toFixed(1), +g.toFixed(1)]); } } return aus; });
  sage(HA.length >= 3 && HA.every((d) => d[0] < d[1]), "die Halte liegen vor den Häusern (< 17 m von der Hausmitte, bei großen Wahrzeichen halbe Grundfläche + 6 m)", HA.map((d) => d[0] + (d[1] > 17 ? " (≤ " + d[1] + ")" : "")).join(", ") + " m");

  console.log("\nWARTEN HINTER ANDEREN\n");
  /* hinter dem Kornwagen: das Auto wird 14 m hinter den fahrenden Kornwagen auf dessen Strecke gesetzt */
  const KW = await pg.evaluate(() => {
    const FW = STADT.fuhrwerk, AU = STADT.autos;
    let w = null;
    for (let i = 0; i < 3000 && !w; i++) { FW.vorspulen(0.2); w = FW.wagen.find((x) => x.W && x.s > 22 && x.bis - x.s > 40); }
    if (!w) return { fehlt: true };
    AU.setzeAuf("viper", w.W, w.s - 14);
    const bi = AU.liste.findIndex((x) => x.id === "batmobil"), b = AU.liste.splice(bi, 1)[0];   // das Batmobil kurz aus dem Spiel
    /* überlappen sich Auto und Wagen? (Ecken und Mitte des Autos im Umriss des Wagens: 3,4 m vor, 3,2 m hinter, 1 m zur Seite) */
    const im = (a) => { const c = Math.cos(a.h), s = Math.sin(a.h); for (const [l, q] of [[a.A.vorn, a.A.halb], [a.A.vorn, -a.A.halb], [0, 0], [a.A.vorn, 0]]) {
      const x = a.x + l * c - q * s, y = a.y + l * s + q * c, dx = x - w.x, dy = y - w.y, L = dx * Math.cos(w.h) + dy * Math.sin(w.h), Q = -dx * Math.sin(w.h) + dy * Math.cos(w.h);
      if (L < 3.4 && L > -3.2 && Math.abs(Q) < 1.0) return true; }
      /* und umgekehrt: die hinteren Ecken des Wagens im Auto */
      for (const q of [1, -1]) { const x = w.x - 3.2 * Math.cos(w.h) - q * Math.sin(w.h), y = w.y - 3.2 * Math.sin(w.h) + q * Math.cos(w.h), dx = x - a.x, dy = y - a.y, L = dx * c + dy * s, Q = -dx * s + dy * c;
        if (L < a.A.vorn && L > -a.A.hinten && Math.abs(Q) < a.A.halb) return true; }
      return false; };
    let ueber = 0, hinter = 0, minD = Infinity, vA = 0, n = 0;
    for (let i = 0; i < 300; i++) {
      FW.vorspulen(0.05); AU.vorspulen(0.05);
      const a = AU.auto("viper");
      if (im(a)) ueber++;
      if (a.vor === "kornwagen") { hinter++; minD = Math.min(minD, Math.hypot(a.x - w.x, a.y - w.y)); if (i > 100) { vA += a.v; n++; } }
    }
    AU.liste.push(b);
    return { ueber, hinter, minD: +minD.toFixed(2), vAuto: n ? +(vA / n).toFixed(2) : 0, vWagen: w.v };
  });
  sage(!KW.fehlt && KW.ueber === 0 && KW.hinter > 100 && KW.minD > 3.5 && KW.vAuto < 1.8, "hinter dem Kornwagen: das Auto fährt ihm im Schritt hinterher, ohne aufzufahren", JSON.stringify(KW));
  /* hinter der Pferdebahn: Bahn hält am Bahnhof (Uhr fest), das Auto kommt auf dem Gleis von hinten */
  const PB = await pg.evaluate(() => {
    const FW = STADT.fuhrwerk, AU = STADT.autos, P = FW.bahn; if (!P) return { fehlt: true };
    FW.bahnFest = P.takt * 1000 + 10 + P.fahr + 4;   // mitten im Halt am Bahnhof
    FW.vorspulen(0.1);
    const bi = AU.liste.findIndex((x) => x.id === "batmobil"), b = AU.liste.splice(bi, 1)[0];   // das Batmobil kurz aus dem Spiel
    const v0 = AU.auto("viper"); v0.geist = 0; v0.warte = 0;
    const sBahn = P.s;
    AU.setzeAuf("viper", P.W, Math.max(1, P.s - 26));
    let minD = Infinity, wartet = 0;
    for (let i = 0; i < 300; i++) {
      FW.vorspulen(0.05); AU.vorspulen(0.05);
      const a = AU.auto("viper"), c = Math.cos(P.h), s = Math.sin(P.h), dx = a.x - P.mx, dy = a.y - P.my;
      minD = Math.min(minD, Math.hypot(dx, dy));
      if (a.wartet && a.vor === "pferdebahn") wartet++;
    }
    FW.bahnFest = null; AU.liste.push(b);
    const a = AU.auto("viper");
    return { minD: +minD.toFixed(2), wartet, vor: a.vor, v: +a.v.toFixed(2), zustand: a.zustand, sBahn: +sBahn.toFixed(1), gleis: +P.W.L.toFixed(1) };
  });
  sage(!PB.fehlt && PB.wartet > 50 && PB.minD > 5, "hinter der Pferdebahn: das Auto hält an und wartet", JSON.stringify(PB));
  /* hinter einem anderen Auto: Viper hält auf einer Strecke, das Batmobil kommt von hinten */
  const AA = await pg.evaluate(() => {
    const AU = STADT.autos, v = AU.auto("viper"), b = AU.auto("batmobil");
    const Wz = AU.netz.W.slice().sort((x, y) => y.L - x.L)[0];
    AU.setzeAuf("viper", Wz, Math.min(Wz.L - 5, 40)); v.zustand = "haelt"; v.halt = 99; v.v = 0;
    AU.setzeAuf("batmobil", Wz, Math.max(0, Math.min(Wz.L - 5, 40) - 30));
    let wartet = 0, minD = Infinity;
    for (let i = 0; i < 300; i++) { AU.vorspulen(0.05); minD = Math.min(minD, Math.hypot(v.x - b.x, v.y - b.y)); if (b.wartet && b.vor === "auto:viper") wartet++; }
    v.halt = 0.1;
    return { wartet, minD: +minD.toFixed(2), luecke: +(minD - v.A.hinten - b.A.vorn).toFixed(2), vor: b.vor };
  });
  sage(AA.wartet > 50 && AA.luecke > 0.5, "hinter einem anderen Auto: das Batmobil hält hinter dem stehenden Viper", JSON.stringify(AA));
  /* nach den Versuchen (Autos auf fremden Strecken) frisch aufstellen */
  await pg.evaluate(() => { const AU = STADT.autos; AU.liste.length = 0; AU.neu = true; AU.vorspulen(20, 0.05, { fuhrwerke: true }); });

  /* Bild: beide Autos nah, neben Leuten und Häusern */
  const blatt = await pg.evaluate(() => { STADT.leicht.unruhe = 2; return STADT.autos.liste.map((a) => a.blatt || ""); });
  for (const id of ["viper", "batmobil"]) {
    const sicht = await hin(pg, id, 22);
    const r = await pg.evaluate((id) => { const a = STADT.autos.auto(id); return { blatt: a.blatt, reihe: a.reihe, gezeigt: STADT.autos.gezeigt, zustand: a.zustand, v: +a.v.toFixed(2), vor: a.vor, wo: [+a.x.toFixed(1), +a.y.toFixed(1)] }; }, id);
    sage(/^l_auto_(viper|batmobil)_herbst_tag$/.test(r.blatt || "") && r.gezeigt >= 1 && sicht > 0.05, "[" + id + "] ist im Bild zu sehen – aus dem Laufblatt gemalt (16 Richtungen, Tagblatt)", JSON.stringify(Object.assign(r, { sichtbar: +sicht.toFixed(2) })));
    await foto(pg, "tag-" + id);
  }
  /* Räder drehen sich: beim Fahren wechseln die Spalten (Radstellungen) */
  const RAD = await pg.evaluate(() => {
    const AU = STADT.autos, a = AU.auto(AU.folge) || AU.liste[0], sp = new Set();
    for (let i = 0; i < 400 && sp.size < 3; i++) { AU.vorspulen(0.05); if (a.v > 0.5) { const e = AU.sichtbar(STADT.szene.zeitDaten()).find((p) => p.auto === a); if (e) sp.add(e.schritt); } }
    return [...sp].sort().join(",");
  });
  sage(RAD === "0,1,2", "die Räder drehen sich (drei Radstellungen im Blatt)", RAD);
  sage(!pg.fehler.length, "ohne Seitenfehler", pg.fehler.join(" | "));
  await pg.close();

  console.log("\nKAUFEN (Schmücken-Leiste)\n");
  const pk = await seite("zeit=tag&jahr=herbst");
  sage(await pk.evaluate(() => STADT.autos.liste.length === 0), "ohne Kauf fährt kein Auto");
  await pk.evaluate(() => document.querySelector(".lk-schmuck:not(.lk-bauen)").click());
  await pk.waitForTimeout(500);
  const L = await pk.evaluate(() => [...document.querySelectorAll(".lk-auto-karte")].map((b) => ({ id: b.dataset.auto, text: b.textContent.replace(/\s+/g, " ").trim(), sicht: b.getBoundingClientRect().width > 0 })));
  sage(L.length === 2 && L.every((k) => /Kaufen/.test(k.text) && /\d+ Punkte/.test(k.text)), "in der Schmücken-Leiste: Viper und Batmobil mit Preis und „Kaufen“", JSON.stringify(L));
  await pk.evaluate(() => { const k = document.querySelector(".lk-auto-karte"); if (k) k.scrollIntoView({ inline: "center", block: "nearest" }); });
  await pk.waitForTimeout(400);
  await foto(pk, "leiste");
  await pk.evaluate(() => document.querySelector('.lk-auto-karte[data-auto="viper"]').click());
  await pk.waitForTimeout(400);
  const K1 = await pk.evaluate(() => { const b = document.querySelector(".lk-kaufen-knopf"); return b && { text: b.textContent, preis: b.dataset.preis, gesperrt: b.disabled, titel: b.title, karte: document.querySelector(".lk-karte-titel").textContent, probe: !!document.querySelector(".lk-probe-knopf") }; });
  sage(!!K1 && /Kaufen · 300 P\./.test(K1.text) && K1.karte === "Dodge Viper", "die Karte des Vipers: Kaufen-Knopf mit Preis", JSON.stringify(K1));
  sage(!!K1 && K1.gesperrt && /anmelden/.test(K1.titel) && K1.probe, "in der Beispielstadt ist Kaufen gesperrt (bitte anmelden) – dafür Probefahrt", JSON.stringify(K1 && { gesperrt: K1.gesperrt, titel: K1.titel }));
  await foto(pk, "karte-kaufen");
  await pk.evaluate(() => document.querySelector(".lk-probe-knopf").click());
  await pk.waitForTimeout(1500);
  const PR = await pk.evaluate(() => { STADT.autos.vorspulen(10); return { liste: STADT.autos.liste.map((a) => a.id).join(","), rest: STADT.autos.probeRest("viper"), weg: STADT.autos.liste[0] && STADT.autos.liste[0].weg }; });
  sage(PR.liste === "viper" && PR.rest > 60 && PR.weg > 5, "Probefahrt: der Viper fährt 90 Sekunden", JSON.stringify(PR));
  /* angemeldet: Kaufen ruft spiel_auto_kaufen, das Auto fährt los */
  await pk.evaluate(() => {
    const SP = STADT.spiel; SP.beispiel = false; SP.angemeldet = true; window.__rufe = [];
    SP.rpc = (name, args) => { window.__rufe.push({ name: name, args: args }); if (name === "spiel_auto_kaufen") return Promise.resolve({ ok: true, gekauft: args.p_auto, autos: [args.p_auto], punkte: 150, preis: 450 }); return Promise.resolve({ ok: true }); };
  });
  await pk.evaluate(() => { document.querySelector(".lk-schmuck:not(.lk-bauen)").click(); });
  await pk.waitForTimeout(300);
  await pk.evaluate(() => document.querySelector('.lk-auto-karte[data-auto="batmobil"]').click());
  await pk.waitForTimeout(300);
  const K2 = await pk.evaluate(() => { const b = document.querySelector(".lk-kaufen-knopf"); return b && { text: b.textContent, gesperrt: b.disabled }; });
  sage(!!K2 && /Kaufen · 450 P\./.test(K2.text) && !K2.gesperrt, "angemeldet: „Kaufen · 450 P.“ beim Batmobil ist frei", JSON.stringify(K2));
  await pk.evaluate(() => document.querySelector(".lk-kaufen-knopf").click());
  await pk.waitForTimeout(700);
  const KB = await pk.evaluate(() => ({ rufe: window.__rufe, hat: STADT.autos.hat("batmobil"), ansage: (document.querySelector(".lk-ansage") || {}).textContent, punkte: STADT.leicht.ich && STADT.leicht.ich.punkte, karte: document.querySelector(".lk-karte-zeile").textContent }));
  await pk.evaluate(() => STADT.autos.vorspulen(3));
  const KB2 = await pk.evaluate(() => STADT.autos.liste.map((a) => a.id).join(","));
  sage(KB.rufe.some((r) => r.name === "spiel_auto_kaufen" && r.args.p_auto === "batmobil") && KB.hat && /gekauft/.test(KB.ansage || "") && /batmobil/.test(KB2),
    "Kaufen ruft spiel_auto_kaufen, das Batmobil gehört dir und fährt los", JSON.stringify({ rufe: KB.rufe.map((r) => r.name), ansage: KB.ansage, punkte: KB.punkte, fahren: KB2, karte: KB.karte }));
  await foto(pk, "gekauft");
  /* ohne Serverfunktion: vorläufig wie der Schmuck gespeichert */
  await pk.evaluate(() => {
    window.__rufe = [];
    STADT.spiel.rpc = (name, args) => { window.__rufe.push({ name: name, args: args }); if (name === "spiel_auto_kaufen") return Promise.reject({ code: "PGRST202", message: "Could not find the function public.spiel_auto_kaufen" }); return Promise.resolve({ ok: true }); };
    STADT.autos.vorspulen(100);   // Probefahrt vorbei
  });
  await pk.evaluate(() => { document.querySelector(".lk-schmuck:not(.lk-bauen)").click(); });
  await pk.waitForTimeout(300);
  await pk.evaluate(() => document.querySelector('.lk-auto-karte[data-auto="viper"]').click());
  await pk.waitForTimeout(300);
  await pk.evaluate(() => document.querySelector(".lk-kaufen-knopf").click());
  await pk.waitForTimeout(2200);
  const VL = await pk.evaluate(() => ({ hat: STADT.autos.hat("viper"), vorl: STADT.spiel.autosVorlaeufig, gespeichert: window.__rufe.filter((r) => r.name === "spiel_stadt_leicht_speichern").map((r) => r.args.p_daten.autos) }));
  sage(VL.hat && VL.vorl.indexOf("viper") >= 0 && VL.gespeichert.some((a) => a && a.indexOf("viper") >= 0), "ohne spiel_auto_kaufen auf dem Server: der Viper wird vorläufig wie der Schmuck gespeichert", JSON.stringify(VL));
  /* Abstellen und Losfahren */
  const AB = await pk.evaluate(() => {
    const AU = STADT.autos; AU.vorspulen(1);
    document.querySelector(".lk-schmuck:not(.lk-bauen)").click();
    document.querySelector('.lk-auto-karte[data-auto="viper"]').click();
    const ab = [...document.querySelectorAll(".lk-karte-knoepfe .lk-text-knopf")].find((b) => /Abstellen/.test(b.textContent));
    if (!ab) return { fehlt: "Abstellen" };
    ab.click();
    const setzen = document.querySelector('.lk-karte-knoepfe [aria-label="Setzen"]'); if (!setzen) return { fehlt: "Setzen" };
    setzen.click(); AU.vorspulen(0.5);
    const r1 = { geparkt: AU.geparkt("viper"), faehrt: AU.liste.map((a) => a.id).join(","), deko: STADT.szene.objekte.filter((o) => o.art === "eigen" && o.bild === "v_viper").length };
    document.querySelector(".lk-schmuck:not(.lk-bauen)").click();
    document.querySelector('.lk-auto-karte[data-auto="viper"]').click();
    const los = [...document.querySelectorAll(".lk-karte-knoepfe .lk-text-knopf")].find((b) => /Losfahren/.test(b.textContent));
    if (!los) return Object.assign({ fehlt: "Losfahren" }, r1);
    los.click(); AU.vorspulen(0.5);
    return Object.assign(r1, { danach: AU.liste.map((a) => a.id).join(","), dekoDanach: STADT.szene.objekte.filter((o) => o.art === "eigen" && o.bild === "v_viper").length });
  });
  sage(!AB.fehlt && AB.geparkt && !/viper/.test(AB.faehrt) && AB.deko === 1 && /viper/.test(AB.danach) && AB.dekoDanach === 0, "gekauft lässt es sich als Schmuck abstellen – und fährt wieder los", JSON.stringify(AB));
  sage(!pk.fehler.length, "beim Kaufen ohne Seitenfehler", pk.fehler.join(" | "));
  await pk.close();

  console.log("\nNACHTS\n");
  const pn = await seite("autos=viper,batmobil&zeit=nacht&jahr=winter");
  await pn.evaluate(() => { const AU = STADT.autos; for (let i = 0; i < 400; i++) { AU.vorspulen(0.1); if (AU.liste.every((a) => a.zustand === "faehrt" && a.v > 3)) break; } });
  const sbN = await hin(pn, "batmobil", 20);
  sage(sbN > 0.05, "nachts ist das Batmobil im Bild zu sehen", "sichtbar " + sbN.toFixed(2));
  const NL = await pn.evaluate(async () => {
    /* selbst malen und gleich messen (dazwischen läuft keine Bildschleife) */
    const AU = STADT.autos, a = AU.auto("batmobil"), c = document.getElementById("lDinge"), g = c.getContext("2d");
    const vorn = () => { const x = a.x + Math.cos(a.h) * 7.5, y = a.y + Math.sin(a.h) * 7.5; return STADT.proj(x, y, 0); };
    const hell = () => { const P = vorn(), d = g.getImageData(Math.round(P[0]) - 12, Math.round(P[1]) - 12, 24, 24).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return s / (d.length / 4) / 3; };
    const Z = STADT.szene.zeitDaten();
    /* FASSUNG 831 — der Messpunkt 7,5 m vor dem Auto kann auf der Dinge-Ebene verdeckt sein (ein Haus, der Fernsehturm
       davor): ohne Licht ist die Ebene dort durchsichtig (≈ 0) – ist sie es nicht (ohne ≥ 25), ein Stück weiterfahren
       (Kamera mit), bis der Punkt frei ist; höchstens 30 Versuche */
    let ohne = 0, mit = 0, versuche = 0;
    for (; versuche < 30; versuche++) {
      if (versuche) { for (let i = 0; i < 40 && !(a.zustand === "faehrt" && a.v > 2); i++) AU.vorspulen(0.25); AU.vorspulen(0.5); STADT.kamera.x = a.x; STADT.kamera.y = a.y; }
      AU.ohneLicht = true; STADT.boden.zeichnen(1, Z, STADT.szene.jahr); STADT.szene.zeichnen(performance.now()); ohne = hell();
      if (ohne < 25) break;
    }
    AU.ohneLicht = false; STADT.boden.zeichnen(1, Z, STADT.szene.jahr); STADT.szene.zeichnen(performance.now()); mit = hell();
    return { ohne: +ohne.toFixed(1), mit: +mit.toFixed(1), licht: a.licht, blatt: a.blatt, nacht: Z.nacht, versuche: versuche };
  });
  sage(NL.ohne < 25 && NL.mit > NL.ohne + 8 && NL.licht > 0.9, "nachts leuchten die Scheinwerfer: der Weg vor dem Auto wird hell (Lichtkegel)", JSON.stringify(NL));
  sage(/_winter_nacht$/.test(NL.blatt || ""), "nachts das Nachtblatt", NL.blatt);
  await foto(pn, "nacht-batmobil");
  /* Batmobil glüht beim Anfahren: halten lassen, dann losfahren und malen */
  const FE = await pn.evaluate(() => {
    const AU = STADT.autos, a = AU.auto("batmobil"), Z = STADT.szene.zeitDaten();
    let max = 0;
    for (let i = 0; i < 1200; i++) {
      AU.vorspulen(0.05);
      const e = AU.sichtbar(Z).find((p) => p.auto === a);
      if (e) { const c = document.createElement("canvas").getContext("2d"); e.malen(c, e); max = Math.max(max, a.feuer || 0); }
      if (max > 0.5 && a.v > 5) break;
    }
    return { feuer: +max.toFixed(2) };
  });
  sage(FE.feuer > 0.4, "das Batmobil glüht beim Anfahren (Turbine)", JSON.stringify(FE));
  const svN = await hin(pn, "viper", 20);
  sage(svN > 0.05, "nachts ist der Viper im Bild zu sehen", "sichtbar " + svN.toFixed(2));
  await foto(pn, "nacht-viper");
  sage(!pn.fehler.length, "nachts ohne Seitenfehler", pn.fehler.join(" | "));
  await pn.close();

  console.log("\nIM KLEINEN RAHMEN (mini=1)\n");
  const pm = await seite("autos=viper,batmobil&mini=1&eingebettet=1&jahr=herbst&zeit=tag", { width: 330, height: 206 });
  await pm.evaluate(() => STADT.autos.vorspulen(8));
  await pm.waitForTimeout(2500);
  const MM = await pm.evaluate(() => ({ n: STADT.autos.liste.length, gezeigt: STADT.autos.gezeigt, blatt: STADT.autos.liste.map((a) => a.blatt) }));
  const ml = [...new Set(pm.geladen.filter((u) => /l_auto_/.test(u)).map((u) => u.split("/").pop().split("?")[0]))];
  sage(MM.n === 2 && MM.gezeigt >= 1 && MM.blatt.filter(Boolean).length >= 1 && MM.blatt.filter(Boolean).every((b) => /_z$/.test(b)), "im kleinen Bild fahren die gekauften Autos (Zwergblatt; gemalt wird, was im Bild ist)", JSON.stringify(MM));
  sage(ml.length >= 1 && ml.every((n) => /_z\.webp$/.test(n)), "… und laden nur die kleinen Blätter", ml.join(", "));
  await foto(pm, "mini");
  sage(!pm.fehler.length, "im kleinen Rahmen ohne Seitenfehler", pm.fehler.join(" | "));
  await pm.close();
  await ende();
})().catch((e) => { console.error(e); process.exit(2); });
