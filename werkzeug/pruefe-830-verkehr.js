#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 830: VERKEHR IN DER LEICHTEN STADT
   ---------------------------------------------------------------------
   XANDER (wörtlich):
     1. „die Lok schneidet am Bahnhof die Waggons"
     2. „die Autos verschmelzen mit der Brücke" – „fahren durch den
        Brunnen durch"
     3. „Autos auch tagsüber mit Geräuschen"
   Geprüft (stadt-leicht.html?demo=1, die gebündelte leicht.min.js):
     • BAHNHOF (Telefon 360 × 740): Zug am Halt (beide Richtungen) und
       beim Einfahren, in allen 8 Kamerawinkeln – jeder Wagen, der sich im
       Bild mit dem Bahnhof deckt, wird nach ihm gemalt, wenn er auf der
       Gleisseite steht und die zur Kamera schaut, sonst vor ihm; und von
       zwei Wagen, die sich an der Kupplung decken, kommt der vordere
       (näher an der Kamera) später. Gemessen an der echten Malfolge eines
       Bildes (drawImage des Bahnhofs, malen() jedes Wagens).
     • BRÜCKE: ein Auto auf der Brücke ist um die Deckhöhe gehoben, wird
       nach der Brücke gemalt; im Fahren über eine Brücke bleibt es
       zwischen den Brüstungen (mittig).
     • HINDERNISSE: 400 s Fahrt (Herbst und Winter mit Christbaum und
       Buden, Ziele Rathaus/Markt/Schule/Dom): kein Auto berührt je einen
       Brunnen, eine Bank, Bude, einen Schmuck oder ein Wahrzeichen
       (Grundfläche fuss × stufe, gedreht); es hält nie darin; außerhalb
       der Umfahrungen bleibt es < 2 m vom Weg.
     • GÄSTE AM TAG: ohne eigenes Auto kommt tagsüber ein Gast (Viper oder
       Batmobil) vom Kartenrand, fährt, ist zu sehen, hat mit Ton einen
       leisen Motor (nah lauter, weit weg aus; ?ton=0: keiner), fährt
       wieder hinaus (Liste und Motoren leer), der nächste kommt später;
       nachts kommt keiner.
     • KLEINER RAHMEN (mini=1): kein Gast ohne geladenes Blatt, keine
       Autoblätter werden angefragt.
   Gegenprobe: mit dem alten Stand (WURZEL=…) scheitern Bahnhof, Brücke,
   Hindernisse und Gäste.
   AUFRUF: node werkzeug/pruefe-830-verkehr.js   (BILD=/pfad/praefix für
   Bildschirmfotos, WURZEL=/anderer/stand)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TEIL = process.env.TEIL || "12345";   // nur einzelne Teile prüfen (z. B. TEIL=3)
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&leute=0&";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"] });
  const ende = async () => { await br.close(); srv.close(); console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0); };
  const seite = async (query, vp, dpr) => {
    const pg = await br.newPage({ viewport: vp || { width: 360, height: 740 }, deviceScaleFactor: dpr || 2, hasTouch: true });
    pg.setDefaultTimeout(120000);
    pg.fehler = []; pg.anfragen = [];
    pg.on("pageerror", (e) => pg.fehler.push(e.message));
    pg.on("request", (r) => pg.anfragen.push(r.url()));
    /* Malfolge mitschreiben: drawImage des Bahnhofs und der Brücken */
    await pg.addInitScript(() => {
      window.__log = null;
      const P = CanvasRenderingContext2D.prototype, d = P.drawImage;
      P.drawImage = function (img) {
        /* (nur die Bilder selbst, nicht ihre Schatten …_s) */
        if (window.__log && img && img.src) { const m = /\/(k_bahnhof|d_bruecke)_[a-z]+_(tag|nacht)_[^/]*$/.exec(img.src); if (m) { window.__log.push(m[1]); window.__log.push("@" + Math.round(arguments.length > 5 ? arguments[5] : arguments[1])); } }
        return d.apply(this, arguments);
      };
    });
    await pg.goto(basis + query, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(600);
    return pg;
  };
  /* bis alle Bilder des Ausschnitts da und ein paar Bilder gemalt sind (die Maschine ist oft belastet) */
  const ruhig = async (pg) => {
    for (let r = 0; r < 2; r++) {
      const t0 = await pg.evaluate(() => STADT.bilder.takt);
      await pg.waitForFunction((t0) => { STADT.leicht.unruhe = 3; return STADT.bilder.takt >= t0 + 3 && STADT.bilder.offen() === 0; }, t0, { timeout: 120000, polling: 200 }).catch(() => {});
    }
  };
  const foto = async (pg, name) => { if (BILD) await pg.screenshot({ path: BILD + "-" + name + ".png" }); };

  if (TEIL.indexOf("1") >= 0) {
  /* ================= 1. BAHNHOF ================= */
  console.log("\n1. DIE LOK AM BAHNHOF – ALLE 8 WINKEL (Telefon 360 × 740)\n");
  const pb = await seite("zeit=tag&jahr=herbst&gaeste=0");
  await pb.evaluate(() => {
    /* jeden Wagen beim Malen mitschreiben */
    const BA = STADT.bahn, s0 = BA.sichtbar;
    BA.sichtbar = function (Z) { const l = s0.call(this, Z); for (const p of l) { const m = p.malen; p.malen = function (g, q) { if (window.__log) window.__log.push("wagen:" + q.bahn); return m(g, q); }; } return l; };
  });
  const faelle = [];
  for (const [art, dir] of [["halt", 1], ["einfahrt", 1], ["halt", -1]]) for (const d of [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]) faelle.push([art, dir, d]);
  const schlecht = [], kette = [], gesehen = { deckt: 0, vor: 0, nach: 0 };
  for (const [art, dir, d] of faelle) {
    await pb.evaluate(([art, dir, d]) => {
      const BA = STADT.bahn, P = dir > 0 ? BA.plan.hin : BA.plan.her, K = STADT.kamera;
      BA.fest = { t: art === "halt" ? (P.tAn + P.tAb) / 2 : P.tAn - 3, dir: dir };
      BA.bewegen(performance.now());
      const h = BA.an(BA.halt); K.dreh = d; K.x = h.x - 3; K.y = h.y - 3; K.s = 11 * K.dpr; STADT.leicht.unruhe = 3;
    }, [art, dir, d]);
    await ruhig(pb);
    const r = await pb.evaluate(() => {
      const ST = STADT, SZ = ST.szene, BA = ST.bahn, K = ST.kamera;
      window.__log = []; SZ.zeichnen(performance.now()); const log = window.__log; window.__log = null;
      const b = SZ.objekte.find((o) => o.bild === "k_bahnhof"), e = SZ.sichtbare.find((x) => x.o === b);
      if (!e) return { keinBahnhof: true };
      const bx0 = e.X - e.meta.ax * e.k, by0 = e.Y - e.meta.ay * e.k, bx1 = bx0 + e.meta.w * e.k, by1 = by0 + e.meta.h * e.k;
      const Z = SZ.zeitDaten(), liste = BA.sichtbar(Z), iB = log.indexOf("k_bahnhof");
      const w = (b.dreh || 0) * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), nT = [s, -c];   // Gleisseite des Bahnhofs (Modell −y)
      const tT = ST.tiefe(nT[0], nT[1]), hw = b.fuss[0] / 2, hd = b.fuss[1] / 2;
      const ding = [[hw, hd], [-hw, hd], [-hw, -hd], [hw, -hd]].map((p) => [b.x + p[0] * c - p[1] * s, b.y + p[0] * s + p[1] * c]);
      /* Soll aus der Geometrie: jede Trennachse der Grundflächen, deren Seite zur Kamera (vorn) oder weg schaut; sagen alle
         dasselbe, steht der Wagen davor bzw. dahinter (sonst kreuzt kein Blickstrahl beide – dann ist es gleich) */
      const sollVon = (z) => {
        const zc = Math.cos(z.h), zs = Math.sin(z.h), L0 = -z.w.hinten, L1 = z.w.vorn;
        const wg = [[L1, 1.5], [L1, -1.5], [L0, -1.5], [L0, 1.5]].map((p) => [z.x + zc * p[0] - zs * p[1], z.y + zs * p[0] + zc * p[1]]);
        let ja = 0, nein = 0;
        for (const ax of [[c, s], [-s, c], [zc, zs], [-zs, zc]]) {
          const pr = (P) => { let a = Infinity, e = -Infinity; for (const q of P) { const d = q[0] * ax[0] + q[1] * ax[1]; a = Math.min(a, d); e = Math.max(e, d); } return [a, e]; };
          const A = pr(wg), B = pr(ding), n = A[0] >= B[1] - 0.05 ? ax : A[1] <= B[0] + 0.05 ? [-ax[0], -ax[1]] : null;
          if (!n) continue;
          const t = ST.tiefe(n[0], n[1]); if (t > 0.05) ja++; else if (t < -0.05) nein++;
        }
        return ja && !nein ? "nach" : nein && !ja ? "vor" : "";
      };
      const aus = [];
      for (const p of liste) {
        const z = p.z, kk = K.s, x0 = p.X - p.bx * kk, x1 = p.X + p.bx * kk, y0 = p.Y - p.bh * kk, y1 = p.Y + 0.2 * kk;
        const deckt = !(x1 < bx0 || x0 > bx1 || y1 < by0 || y0 > by1);
        const ly = -(z.x - b.x) * s + (z.y - b.y) * c;   // Lage quer zum Bahnhof (Gleisseite negativ)
        const pos = log.indexOf("wagen:" + p.bahn);
        aus.push({ i: p.bahn, art: z.w.art, deckt: deckt, ly: +ly.toFixed(2), nach: pos > iB, pos: pos, tiefe: p.a + p.b, X0: x0, X1: x1, Y0: y0, Y1: y1, soll: sollVon(z) });
      }
      return { iB: iB, tT: tT, hd: b.fuss[1] / 2, wagen: aus };
    });
    if (r.keinBahnhof || r.iB < 0) { schlecht.push(d + "/" + art + dir + ": Bahnhof nicht gemalt"); continue; }
    for (const w of r.wagen) {
      if (!w.deckt) continue;
      gesehen.deckt++;
      const soll = w.soll;
      if (!soll) continue;
      gesehen[soll]++;
      if ((soll === "nach") !== w.nach) schlecht.push("Winkel " + d * 90 + "° " + art + (dir > 0 ? "→" : "←") + ": " + w.art + " " + (w.nach ? "nach" : "vor") + " dem Bahnhof, soll " + soll);
    }
    /* Kupplungen: zwei Nachbarwagen, die sich im Bild decken → der nähere später */
    const W = r.wagen.slice().sort((u, v) => u.i - v.i);
    for (let k = 1; k < W.length; k++) {
      const u = W[k - 1], v = W[k];
      if (u.pos < 0 || v.pos < 0 || u.X1 < v.X0 || v.X1 < u.X0 || u.Y1 < v.Y0 || v.Y1 < u.Y0 || Math.abs(u.tiefe - v.tiefe) < 0.5) continue;
      const nah = u.tiefe > v.tiefe ? u : v, fern = nah === u ? v : u;
      if (nah.pos < fern.pos) kette.push("Winkel " + d * 90 + "° " + art + (dir > 0 ? "→" : "←") + ": " + fern.art + " über " + nah.art);
    }
    if (art === "halt" && dir > 0 && (d === 0 || d === 1.5 || d === 2.5)) await foto(pb, "bahnhof-tel-" + d * 90);
    if (art === "einfahrt" && d === 0) await foto(pb, "bahnhof-tel-einfahrt");
  }
  sage(gesehen.nach >= 6 && gesehen.vor >= 6, "der Zug deckt sich in den Winkeln oft mit dem Bahnhof (davor und dahinter)", JSON.stringify(gesehen));
  sage(!schlecht.length, "jeder Wagen wird richtig vor bzw. hinter dem Bahnhof gemalt (8 Winkel, Halt beidseitig, Einfahrt)", schlecht.slice(0, 6).join(" | ") + (schlecht.length > 6 ? " … (" + schlecht.length + ")" : ""));
  sage(!kette.length, "an den Kupplungen deckt immer der vordere Wagen den hinteren (Lok, Tender, Wagen sauber hintereinander)", kette.slice(0, 6).join(" | ") + (kette.length > 6 ? " … (" + kette.length + ")" : ""));
  /* Abstände beim Bremsen: die Wagen hängen starr über ihre Puffer (wie 809) */
  const ab = await pb.evaluate(() => {
    const BA = STADT.bahn, P = BA.plan.hin; let schlimm = 0;
    for (let t = P.t1; t <= P.tAn + 1; t += 0.2) {
      BA.fest = { t: t, dir: 1 }; BA.bewegen(performance.now());
      for (let i = 1; i < BA.zug.length; i++) { const a = BA.zug[i - 1], b = BA.zug[i], soll = a.w.hinten + a.w.luecke + b.w.vorn; schlimm = Math.max(schlimm, Math.abs(Math.abs(a.s - b.s) - soll)); }
    }
    BA.fest = null; return schlimm;
  });
  sage(ab < 0.01, "beim Bremsen bleiben die Abstände der Wagen gleich (Puffer an Puffer)", "Abweichung " + ab.toFixed(4) + " m");
  sage(!pb.fehler.length, "Bahnhof ohne Seitenfehler", pb.fehler.join(" | "));
  await pb.close();

  }
  if (TEIL.indexOf("2") >= 0) {
  /* ================= 2. BRÜCKE ================= */
  console.log("\n2. AUTOS AUF DER BRÜCKE (Rechner 1280 × 800)\n");
  const pr = await seite("zeit=tag&jahr=herbst&autos=viper,batmobil&gaeste=0", { width: 1280, height: 800 }, 1);
  const Br = await pr.evaluate(() => {
    const AU = STADT.autos, SZ = STADT.szene, K = STADT.kamera;
    const brs = SZ.objekte.filter((o) => /^d_bruecke/.test(o.bild));
    let best = null; for (const o of brs) { const d = AU.wegAbstand(o.x, o.y); if (!best || d < best.d) best = { o: o, d: d }; }
    const o = best.o, w = (o.dreh || 0) * Math.PI / 2, ax = -Math.sin(w), ay = Math.cos(w);
    const pts = []; for (let t = -16; t <= 16; t += 1) pts.push([o.x + ax * t, o.y + ay * t]);
    window.__brW = STADT.fuhrwerk.strecke(pts); window.__br = o;
    AU.setzeAuf("viper", window.__brW, 16);
    const a = AU.auto("viper"); a.seite = 0; a.x = o.x; a.y = o.y; a.v = 0;
    const b = AU.auto("batmobil"); b.x += 300;
    window.__autoBew = AU.bewegen; AU.bewegen = () => {};
    K.x = o.x; K.y = o.y; K.s = 20 * K.dpr; K.dreh = 0; STADT.leicht.unruhe = 3;
    return { x: o.x, y: o.y, dreh: o.dreh };
  });
  await ruhig(pr);
  const B1 = await pr.evaluate(() => {
    const AU = STADT.autos, SZ = STADT.szene, a = AU.auto("viper"), o = window.__br;
    /* das Auto beim Malen mitschreiben */
    const s0 = AU.sichtbar;
    AU.sichtbar = function (Z) { const l = s0.call(this, Z); for (const p of l) { const m = p.malen; p.malen = function (g, q) { if (window.__log) window.__log.push("auto:" + q.auto.id); return m(g, q); }; } return l; };
    window.__log = []; SZ.zeichnen(performance.now()); const log = window.__log; window.__log = null;
    AU.sichtbar = s0;
    const p = s0.call(AU, SZ.zeitDaten()).find((x) => x.auto === a), P0 = STADT.proj(a.x, a.y, 0);
    const e = SZ.sichtbare.find((x) => x.o === o), bx = e ? Math.round(e.X - e.meta.ax * e.k) : null;
    const iA = log.indexOf("auto:viper"), iB = log.findIndex((x, i) => x === "d_bruecke" && Math.abs(+String(log[i + 1]).slice(1) - bx) <= 1);
    return { z: a.z == null ? null : +a.z.toFixed(2), auf: !!(p && p.auf === o), gehoben: p ? +((P0[1] - p.Y) / STADT.kamera.s).toFixed(2) : null, iA: iA, iB: iB };
  });
  sage(B1.z > 1.2 && B1.gehoben > 1, "auf der Brücke fährt das Auto oben auf dem Buckel (gehoben um die Deckhöhe)", JSON.stringify(B1));
  sage(B1.auf && B1.iA > B1.iB && B1.iB >= 0, "es wird nach seiner Brücke gemalt (nicht von ihr verdeckt)", "Auto an Stelle " + B1.iA + ", seine Brücke an Stelle " + B1.iB);
  await foto(pr, "bruecke");
  /* über die Brücke fahren: zwischen den Brüstungen (2,9 m) – das Auto mittig */
  const B2 = await pr.evaluate(() => {
    const AU = STADT.autos, o = window.__br, FW = STADT.fuhrwerk;
    AU.bewegen = window.__autoBew;
    let schlimm = 0, n = 0, zmax = 0;
    for (const id of ["viper", "batmobil"]) {
      const a = AU.auto(id); AU.setzeAuf(id, window.__brW, 1);
      for (const b of AU.liste) if (b !== a) { b.x += 400; b.zustand = "haelt"; b.halt = 99; b.W = null; }
      for (let i = 0; i < 300 && a.zustand === "faehrt"; i++) {
        AU.vorspulen(0.05);
        const w = (o.dreh || 0) * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), dx = a.x - o.x, dy = a.y - o.y;
        const lx = dx * c + dy * s, ly = -dx * s + dy * c;
        if (Math.abs(ly) > 4.5) continue;   // auf dem Deck (die Brücke ist 11,2 m lang)
        n++; schlimm = Math.max(schlimm, Math.abs(lx) + a.A.halb);
        if (FW.aufBruecke) { const q = FW.aufBruecke(a.x, a.y); if (q) zmax = Math.max(zmax, q.z); }
      }
      for (const b of AU.liste) if (b !== a) { b.x -= 400; b.halt = 0.5; }
    }
    return { n: n, aussen: +schlimm.toFixed(2), zmax: +zmax.toFixed(2) };
  });
  sage(B2.n > 20 && B2.aussen <= 1.5, "beim Überfahren bleibt jedes Auto zwischen den Brüstungen (mittig, halbe Deckbreite 1,45 m)", JSON.stringify(B2));
  sage(!pr.fehler.length, "Brücke ohne Seitenfehler", pr.fehler.join(" | "));
  await pr.close();

  }
  if (TEIL.indexOf("3") >= 0) {
  /* ================= 3. HINDERNISSE ================= */
  console.log("\n3. NICHT DURCH DEN BRUNNEN (400 s Fahrt, Herbst und Winter)\n");
  for (const jahr of ["herbst", "winter"]) {
    const ph = await seite("zeit=tag&jahr=" + jahr + "&autos=viper,batmobil&gaeste=0", { width: 1280, height: 800 }, 1);
    const H = await ph.evaluate(() => {
      const AU = STADT.autos, SZ = STADT.szene;
      /* Ziele rund um Markt und Rathaus (in der Liste selbst, sie gehört dem Modul) */
      const Z = AU.ziele, beh = Z.filter((z) => /Rathaus|Markt|Schule|Kölner|Brandenburger|Fernseh/.test(z.name)); Z.splice(0, Z.length, ...beh);
      const hind = SZ.objekte.filter((o) => o.fuss && !o.versteckt && o.art !== "natur" && o.art !== "haus" && !SZ.flach(o) && !/^d_(bruecke|laterne)/.test(o.bild || "")).map((o) => {
        const k = o.stufe || 1, w = (o.dreh || 0) * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), hw = o.fuss[0] * k / 2, hd = o.fuss[1] * k / 2;
        return { name: o.name || o.bild, wunder: o.art === "wunder", x: o.x, y: o.y, c: c, s: s, ecken: [[hw, hd], [-hw, hd], [-hw, -hd], [hw, -hd]].map((p) => [o.x + p[0] * c - p[1] * s, o.y + p[0] * s + p[1] * c]), r: Math.hypot(hw, hd) };
      });
      /* wie tief ragt Viereck A in Viereck B (Ecken im Umlauf)? 0 = getrennt (kleinste Überlappung über alle Trennachsen) */
      const tiefe = (A, B) => {
        let m = Infinity;
        for (const P of [A, B]) for (let i = 0; i < 4; i++) {
          const p = P[i], q = P[(i + 1) % 4], l = Math.hypot(q[1] - p[1], p[0] - q[0]) || 1, nx = (q[1] - p[1]) / l, ny = (p[0] - q[0]) / l;
          let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
          for (const e of A) { const d = e[0] * nx + e[1] * ny; a0 = Math.min(a0, d); a1 = Math.max(a1, d); }
          for (const e of B) { const d = e[0] * nx + e[1] * ny; b0 = Math.min(b0, d); b1 = Math.max(b1, d); }
          m = Math.min(m, Math.min(a1, b1) - Math.max(a0, b0));
          if (m <= 0) return 0;
        }
        return m;
      };
      const mit = []; AU.vorspulen(400, 0.1, { mit: mit });
      const treffer = {}, halt = {}; let n = 0, weit = 0, weitBei = "", umf = 0, tief = 0, tiefBei = "", streif = 0;
      for (const r of mit) for (const a of r) {
        const A = AU.auto(a.id).A, c = Math.cos(a.h), s = Math.sin(a.h);
        const auto = [[A.vorn, A.halb], [A.vorn, -A.halb], [-A.hinten, -A.halb], [-A.hinten, A.halb]].map((p) => [a.x + p[0] * c - p[1] * s, a.y + p[0] * s + p[1] * c]);
        n++;
        for (const h of hind) {
          if (Math.hypot(h.x - a.x, h.y - a.y) > h.r + 4) continue;
          const t = tiefe(auto, h.ecken);
          if (t > 0.02) { streif++; if (a.z === "haelt") halt[h.name] = 1; }
          if (t > tief) { tief = t; tiefBei = h.name + ": " + a.id + " " + a.z + " (" + a.x.toFixed(1) + ", " + a.y.toFixed(1) + ")"; }
          /* beim Wenden in drei Zügen direkt vor einem großen Wahrzeichen darf das Heck die Sockelecke streifen (bis 0,8 m) */
          const grenze = a.z === "wendet" && h.wunder ? 0.8 : 0.35;
          if (t > grenze) treffer[h.name] = (treffer[h.name] || 0) + 1;
        }
        /* (Schritte mit Streifen: s. o.) */
      /* wie Sonde 815: < 2 m vom Weg – außer dort, wo das Auto ein Hindernis umfährt (FASSUNG 830) */
        const um = AU.inUmfahrung ? AU.inUmfahrung(a.x, a.y) : false;
        if (um) { umf++; continue; }
        const wa = AU.wegAbstand(a.x, a.y); if (wa > weit) { weit = wa; weitBei = a.id + " " + a.z + " (" + a.x.toFixed(1) + ", " + a.y.toFixed(1) + ")"; }
      }
      const brunnen = SZ.objekte.find((o) => o.bild === "d_brunnen" && !o.versteckt);
      let nahB = Infinity; if (brunnen) for (const r of mit) for (const a of r) nahB = Math.min(nahB, Math.hypot(a.x - brunnen.x, a.y - brunnen.y));
      const markt = AU.liste.map((a) => (a.halte || []).filter((h) => h.ziel === "Markt").length).reduce((x, y) => x + y, 0);
      return { n: n, tief: +tief.toFixed(2), tiefBei: tiefBei, streif: streif, treffer: treffer, halt: Object.keys(halt), weit: +weit.toFixed(2), weitBei: weitBei, umf: umf, hind: hind.length, nahBrunnen: brunnen ? +nahB.toFixed(2) : null, markt: markt,
        wege: +AU.liste.reduce((s, a) => s + a.weg, 0).toFixed(0), halte: AU.liste.map((a) => (a.halte || []).map((h) => h.ziel).join(",")).join(" | ") };
    });
    const N = Object.keys(H.treffer).length;
    sage(H.wege > 1000 && H.markt >= 1, "[" + jahr + "] die Autos fahren kreuz und quer über den Markt (" + H.hind + " Hindernisse in der Stadt)", H.wege + " m, " + H.markt + "× am Markt · " + H.halte);
    /* (beim Wenden in drei Zügen an einer Spitzkehre darf der Wagenkasten eine Kante kurz streifen – hindurch nie) */
    sage(N === 0, "[" + jahr + "] kein Auto fährt durch Brunnen, Bänke, Buden, Christbaum, Schmuck oder Wahrzeichen (höchstens 35 cm gestreift, beim Wenden an einem Wahrzeichen 80 cm)",
      "tiefstens " + H.tief + " m (" + H.tiefBei + "), gestreift in " + H.streif + " von " + H.n + " Schritten" + (N ? " · " + JSON.stringify(H.treffer) : "") + (H.nahBrunnen != null ? " · Brunnen nächstens " + H.nahBrunnen + " m (Mitte–Mitte)" : ""));
    sage(!H.halt.length, "[" + jahr + "] kein Auto hält in einem Hindernis", H.halt.join(", "));
    /* (Sonde 815 prüft dasselbe streng mit 2 m; hier nur, dass die Umfahrungen nicht anderswo hinausführen) */
    sage(H.weit < 2.1, "[" + jahr + "] sonst bleiben sie auf den Wegen (≈ 2 m, außerhalb der Umfahrungen)", "weitester Abstand " + H.weit + " m (" + H.weitBei + "), " + H.umf + " Schritte an Hindernissen");
    sage(!ph.fehler.length, "[" + jahr + "] ohne Seitenfehler", ph.fehler.join(" | "));
    if (jahr === "herbst" && BILD) {
      /* Foto: ein Auto am Brunnen vorbei */
      await ph.evaluate(() => { const b = STADT.szene.objekte.find((o) => o.bild === "d_brunnen"), K = STADT.kamera; K.x = b.x; K.y = b.y; K.s = 18 * K.dpr; STADT.leicht.unruhe = 3; });
      await ruhig(ph); await foto(ph, "brunnen-" + jahr);
    }
    await ph.close();
  }

  }
  if (TEIL.indexOf("4") >= 0) {
  /* ================= 4. GÄSTE ================= */
  console.log("\n4. TAGSÜBER KOMMEN AUTOS ZU BESUCH – MIT LEISEM MOTOR\n");
  const pg = await seite("zeit=tag&jahr=herbst&gaeste=1&ton=1", { width: 1280, height: 800 }, 1);
  await pg.waitForFunction(() => STADT.autos && STADT.autos.liste.some((a) => a.gast), null, { timeout: 30000, polling: 250 }).catch(() => {});
  const G1 = await pg.evaluate(() => {
    const AU = STADT.autos, a = AU.liste.find((x) => x.gast); if (!a) return { keiner: true, n: AU.liste.length };
    const x0 = a.x, y0 = a.y, rand = Math.max(Math.abs(a.x), Math.abs(a.y)), enden = AU.randKnoten ? AU.randKnoten() : [];
    const amEnde = enden.some((p) => Math.hypot(p[0] - a.x, p[1] - a.y) < 4), weitestes = enden.length ? Math.max(...enden.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1])))) : 0;
    const t0 = a.gast.t0 != null ? AU.t - a.gast.t0 : null;
    AU.vorspulen(6, 0.05);
    return { id: a.id, gekauft: AU.hat(a.id), rand: +rand.toFixed(0), weitestes: +weitestes.toFixed(0), amEnde: amEnde, alt: t0 == null ? null : +t0.toFixed(1), weg: +Math.hypot(a.x - x0, a.y - y0).toFixed(1), v: +a.v.toFixed(2) };
  });
  sage(!G1.keiner && !G1.gekauft, "ohne eigenes Auto kommt tagsüber ein Gast (Viper oder Batmobil)", JSON.stringify(G1));
  sage(!G1.keiner && G1.amEnde && G1.rand > 40 && G1.weg > 5, "er kommt an einem äußeren Ende des Wegenetzes herein (Landstraße) und fährt", G1.keiner ? "" : "Start " + G1.rand + " m von der Mitte (weitestes Wegende " + G1.weitestes + " m), " + G1.weg + " m in 6 s");
  /* Kamera auf den Gast: zu sehen und zu hören */
  await pg.evaluate(() => { const a = STADT.autos.liste.find((x) => x.gast); if (!a) return; STADT.autos.folge = a.id; const K = STADT.kamera; K.x = a.x; K.y = a.y; K.s = 18 * K.dpr; STADT.leicht.unruhe = 3; });
  await ruhig(pg);
  await pg.waitForTimeout(1500);
  const G2 = await pg.evaluate(() => {
    const AU = STADT.autos, a = AU.liste.find((x) => x.gast); if (!a) return { keiner: true };
    AU.motorTon(); const m = AU.motoren.get(a.id), nah = m ? +m.laut.toFixed(3) : 0;
    const K = STADT.kamera; AU.folge = null; K.x = a.x + 300; K.y = a.y + 300; AU.motorTon(); const weit = AU.motoren.get(a.id);
    K.x = a.x; K.y = a.y; AU.folge = a.id;
    return { gezeigt: AU.gezeigt, nah: nah, weit: weit ? +weit.laut.toFixed(3) : 0, log: STADT.ton.log ? STADT.ton.log.map((e) => e.name).filter((n) => /^motor-/.test(n)).slice(0, 4) : [] };
  });
  sage(!G2.keiner && G2.gezeigt >= 1, "der Gast ist im Bild", JSON.stringify({ gezeigt: G2.gezeigt }));
  sage(!G2.keiner && G2.nah > 0.02 && G2.nah < 0.3 && G2.weit === 0, "er hat einen leisen Motor (nah hörbar, weit weg aus)", JSON.stringify(G2));
  await foto(pg, "gast");
  const G3 = await pg.evaluate(() => {
    const AU = STADT.autos; AU.folge = null;
    const a = AU.liste.find((x) => x.gast); if (!a) return { keiner: true };
    const halte = () => (a.halte || []).map((h) => h.ziel);
    let t = 0; while (t < 900 && AU.liste.indexOf(a) >= 0) { AU.vorspulen(1, 0.1); t += 1; }
    AU.motorTon();
    return { weg: AU.liste.indexOf(a) < 0, t: t, halte: halte(), liste: AU.liste.length, motoren: AU.motoren.size, naechst: AU.gast ? +(AU.gast.naechst - AU.t).toFixed(0) : null };
  });
  sage(!G3.keiner && G3.weg && G3.halte.length >= 2 && G3.halte[G3.halte.length - 1] === "Ausfahrt", "er hält in der Stadt und fährt am Rand wieder hinaus", JSON.stringify(G3));
  sage(!G3.keiner && G3.liste === 0 && G3.motoren === 0 && G3.naechst >= 30 && G3.naechst <= 85, "danach ist es still (kein Auto, kein Motor), der nächste kommt in 35–80 s", JSON.stringify({ liste: G3.liste, motoren: G3.motoren, naechst: G3.naechst }));
  sage(!pg.fehler.length, "Gäste ohne Seitenfehler", pg.fehler.join(" | "));
  await pg.close();
  /* ohne Ton: kein Motor; ohne ?gaeste: der erste nach 12–22 s */
  const pt = await seite("zeit=tag&jahr=herbst&ton=0", { width: 900, height: 700 }, 1);
  const G4 = await pt.evaluate(() => {
    const AU = STADT.autos; let t0 = null;
    for (let t = 0; t < 40; t += 0.5) { AU.vorspulen(0.5, 0.1); if (t0 == null && AU.liste.some((a) => a.gast)) t0 = +AU.t.toFixed(1); }
    const a = AU.liste.find((x) => x.gast); if (a) { const K = STADT.kamera; K.x = a.x; K.y = a.y; K.s = 20 * K.dpr; AU.motorTon(); }
    return { erster: t0, motoren: AU.motoren.size };
  });
  sage(G4.erster != null && G4.erster >= 10 && G4.erster <= 26, "von selbst kommt der erste Gast nach etwa 12–22 s", "nach " + G4.erster + " s");
  sage(G4.motoren === 0, "ohne Ton (?ton=0) hat er keinen Motor", "Motoren " + G4.motoren);
  await pt.close();
  const pn = await seite("zeit=nacht&jahr=herbst&gaeste=1&ton=1", { width: 900, height: 700 }, 1);
  const G5 = await pn.evaluate(() => { const AU = STADT.autos; AU.vorspulen(90, 0.1); return { gaeste: AU.liste.filter((a) => a.gast).length }; });
  sage(G5.gaeste === 0, "nachts kommt kein Gast", JSON.stringify(G5));
  await pn.close();

  }
  if (TEIL.indexOf("5") >= 0) {
  /* ================= 5. KLEINER RAHMEN ================= */
  console.log("\n5. IM KLEINEN RAHMEN (mini=1): KEIN ZUSÄTZLICHES BILD\n");
  const pm = await seite("mini=1&eingebettet=1&zeit=tag&jahr=herbst&gaeste=1", { width: 330, height: 206 }, 2);
  await pm.waitForTimeout(3000);
  const M = await pm.evaluate(() => { const AU = STADT.autos; if (AU && AU.vorspulen) AU.vorspulen(60, 0.1); STADT.leicht.unruhe = 3; return { gaeste: AU ? AU.liste.filter((a) => a.gast).length : 0 }; });
  await pm.waitForTimeout(2500);
  const autoBl = pm.anfragen.filter((u) => /\/(l_auto_|schau_|auftritt_)/.test(u)).map((u) => u.split("/").pop().split("?")[0]);
  sage(M.gaeste === 0 && !autoBl.length, "im kleinen Rahmen: kein Gast ohne geladenes Blatt, kein Autoblatt angefragt", JSON.stringify({ gaeste: M.gaeste, blaetter: autoBl }));
  sage(!pm.fehler.length, "kleiner Rahmen ohne Seitenfehler", pm.fehler.join(" | "));
  await pm.close();
  }
  await ende();
})().catch((e) => { console.error(e); process.exit(2); });
