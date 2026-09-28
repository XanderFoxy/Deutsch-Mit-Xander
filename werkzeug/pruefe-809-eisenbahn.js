#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 809: DIE EISENBAHN IN DER LEICHTEN STADT
   ---------------------------------------------------------------------
   XANDER: „die Lok soll aber mehr hinten lang fahren hinten in der
   Stadt" – „dass ich die Eisenbahn wieder hinten lang fahren [sehe] und
   die Eisenbahn brauchen wir auch unbedingt".
   Geprüft (stadt-leicht.html, Telefon 390 × 844, echte Bildschleife):
     • es gibt die Bahn (stadt-leicht/bahn.js) und ihr Gleis liegt hinten
       (Norden, ST.dorf.BAHN bzw. Ersatzstrecke), am Bahnhof vorbei;
     • der Zug erscheint vom Kartenrand, fährt (Tempo, Bremsen, Anfahren
       realistisch), hält ≈ 14 s mit der Zugmitte am Bahnsteig, fährt zum
       anderen Rand hinaus; das nächste Mal kommt er von der anderen Seite;
     • die Wagen folgen dem Gleis (jeder auf der Kurve, Abstände über
       Puffer), die Blickrichtung passt zur Fahrtrichtung und Kamera
       (8 Richtungen, auch nach Drehen der Kamera);
     • er wird wirklich gemalt (Bildpunkte ändern sich), er raucht, nachts
       mit Nachtblatt und Lampen;
     • im kleinen Rahmen (?mini=1) nur Zwergblätter, alles < 300 KB.
   AUFRUF: node werkzeug/pruefe-809-eisenbahn.js
     WURZEL=/pfad (anderer Stand, z. B. Gegenprobe), BILD=/pfad/praefix
     (Bildschirmfotos: Tag, Nacht, Winter, nah und Überblick).
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib");
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
    pg.fehler = [];
    pg.geladen = [];
    pg.on("pageerror", (e) => pg.fehler.push(e.message));
    pg.on("requestfinished", (r) => pg.geladen.push(r.url()));
    await pg.goto(basis + "?demo=1&" + query, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(800);
    return pg;
  };
  const foto = async (pg, name) => { if (BILD) await pg.screenshot({ path: BILD + "-" + name + ".png" }); };

  console.log("\nDIE STRECKE HINTEN IN DER STADT\n");
  const pg = await seite("jahr=winter&zeit=tag");
  sage(!pg.fehler.length, "lädt ohne Seitenfehler", pg.fehler.join(" | "));
  const da = await pg.evaluate(() => !!(window.STADT && STADT.bahn && STADT.bahn.bewegen && STADT.bahn.weg));
  sage(da, "es gibt die Eisenbahn (STADT.bahn mit Strecke)");
  if (!da) { await br.close(); srv.close(); console.log("\n" + fehler + " FEHLER\n"); process.exit(1); }
  const S = await pg.evaluate(() => {
    const BA = STADT.bahn, W = BA.weg, D = STADT.dorf;
    const innen = []; for (let i = W.i0; i <= W.i1; i++) if (Math.abs(W.X[i]) < 72) innen.push([W.X[i], W.Y[i]]);   // der Abschnitt vor der Stadt
    const hf = D.BAHN_HALT || null, b = STADT.szene.objekte.find((o) => o.bild === "k_bahnhof");
    const h = BA.an(BA.halt);
    return { ersatz: BA.ersatz, von: [W.X[W.i0], W.Y[W.i0]], bis: [W.X[W.i1], W.Y[W.i1]], ymittel: innen.reduce((s, p) => s + p[1], 0) / Math.max(1, innen.length),
      halt: [h.x, h.y], haltSoll: hf, bahnhof: b ? [b.x, b.y] : null, takt: BA.plan.takt, V: BA.V, eigenerSteig: BA.eigenerSteig,
      baeumeAufGleis: STADT.szene.objekte.filter((o) => o.art === "natur" && !o.versteckt && (() => { let d = 1e9; for (let i = W.i0; i <= W.i1; i += 2) d = Math.min(d, Math.hypot(W.X[i] - o.x, W.Y[i] - o.y)); return d < 3.2; })()).length };
  });
  sage(Math.abs(S.von[0] - S.bis[0]) > 200 || Math.abs(S.von[1] - S.bis[1]) > 200, "die Strecke läuft von Kartenrand zu Kartenrand (Nachbardörfer)", JSON.stringify({ von: S.von.map(Math.round), bis: S.bis.map(Math.round) }));
  sage(S.ymittel < -60, "sie liegt hinten in der Stadt (Norden, im Bild oben)", "mittleres y " + S.ymittel.toFixed(1) + (S.ersatz ? " (Ersatzstrecke)" : " (ST.dorf.BAHN)"));
  sage(!!S.bahnhof && Math.hypot(S.bahnhof[0] - S.halt[0], S.bahnhof[1] - S.halt[1]) < 16, "der Halt liegt am Bahnhof (k_bahnhof)", JSON.stringify({ halt: S.halt.map((v) => +v.toFixed(1)), bahnhof: S.bahnhof, soll: S.haltSoll }));
  if (S.haltSoll) sage(Math.hypot(S.haltSoll[0] - S.halt[0], S.haltSoll[1] - S.halt[1]) < 1, "Halt genau am Bahnsteig (ST.dorf.BAHN_HALT)");
  sage(S.baeumeAufGleis === 0, "kein Baum steht auf dem Gleis", S.baeumeAufGleis + " Bäume");

  console.log("\nDER FAHRPLAN: ERSCHEINEN, BREMSEN, 14 s HALT, ANFAHREN, HINAUS\n");
  const F = await pg.evaluate(() => {
    const BA = STADT.bahn, P = BA.plan, aus = {};
    for (const dir of [1, -1]) {
      const fp = dir > 0 ? P.hin : P.her, reihe = [];
      for (let t = -1; t <= P.takt; t += 0.25) {
        BA.fest = { t: t, dir: dir }; BA.bewegen(performance.now());
        const st = BA.st;
        reihe.push({ t: t, s: st ? st.s : null, v: st ? st.v : null, art: st ? st.art : null,
          zug: BA.zug.map((z) => ({ x: z.x, y: z.y, h: z.h, s: z.s, art: z.w.art, vorn: z.w.vorn, hinten: z.w.hinten, luecke: z.w.luecke })) });
      }
      aus[dir] = { reihe: reihe, tEnde: fp.tEnde };
    }
    BA.fest = null;
    return aus;
  });
  const RAND = 112;
  const drin = (z) => Math.abs(z.x) < RAND && Math.abs(z.y) < RAND;
  for (const dir of [1, -1]) {
    const R = F[dir].reihe, name = dir > 0 ? "West → Ost" : "Ost → West";
    const erst = R.find((r) => r.zug.some(drin));
    sage(!!erst && erst.t > 0.5, "[" + name + "] der Zug kommt vom Kartenrand herein (erscheint erst nach dem Start)", erst ? "t = " + erst.t + " s bei x = " + erst.zug.find(drin).x.toFixed(0) : "–");
    const x0 = erst && erst.zug.find(drin).x;
    sage(!!erst && (dir > 0 ? x0 < -80 : x0 > 80), "[" + name + "] … und zwar vom richtigen Rand", x0 != null ? "x = " + x0.toFixed(0) : "");
    const stehen = R.filter((r) => r.art === "steht");
    const dauer = stehen.length ? stehen[stehen.length - 1].t - stehen[0].t + 0.25 : 0;
    sage(Math.abs(dauer - 14) <= 0.5, "[" + name + "] hält ≈ 14 s am Bahnhof", dauer.toFixed(2) + " s");
    if (stehen.length) {
      const z = stehen[0].zug, mx = (z[0].x + z[z.length - 1].x) / 2, my = (z[0].y + z[z.length - 1].y) / 2;
      sage(Math.hypot(mx - S.halt[0], my - S.halt[1]) < 3, "[" + name + "] Zugmitte steht am Bahnsteig", "Abstand " + Math.hypot(mx - S.halt[0], my - S.halt[1]).toFixed(2) + " m");
    }
    /* Tempo und Beschleunigung aus den Positionen */
    let vmax = 0, amax = 0, rueck = 0, bremst = false, faehrtAn = false, vAlt = null;
    for (let i = 1; i < R.length; i++) {
      if (R[i].s == null || R[i - 1].s == null) { vAlt = null; continue; }
      const v = (R[i].s - R[i - 1].s) * dir / 0.25;
      if (v < -1e-6) rueck++;
      vmax = Math.max(vmax, v);
      if (vAlt != null) amax = Math.max(amax, Math.abs(v - vAlt) / 0.25);
      if (R[i].art === "bremst") bremst = true; if (R[i].art === "anfahren") faehrtAn = true;
      vAlt = v;
    }
    sage(rueck === 0 && vmax <= S.V + 0.01 && vmax >= 10, "[" + name + "] fährt immer vorwärts, höchstens " + (S.V * 3.6).toFixed(0) + " km/h", "vmax " + (vmax * 3.6).toFixed(1) + " km/h");
    sage(bremst && faehrtAn && amax < 1.2, "[" + name + "] bremst sanft und fährt sanft an (keine Sprünge)", "größte Änderung " + amax.toFixed(2) + " m/s²");
    const ende = R.find((r) => r.t > F[dir].tEnde + 0.3);
    sage(!!ende && (!ende.zug.length || !ende.zug.some(drin)), "[" + name + "] am Ende ganz zum anderen Rand hinaus", ende ? "t = " + ende.t : "");
    const raus = R.filter((r) => r.t > (stehen.length ? stehen[stehen.length - 1].t : 0) && r.zug.length && !r.zug.some(drin))[0];
    sage(!!raus && (dir > 0 ? raus.zug[raus.zug.length - 1].x > 100 : raus.zug[raus.zug.length - 1].x < -100), "[" + name + "] … auf der anderen Seite", raus ? "letzter Wagen x = " + raus.zug[raus.zug.length - 1].x.toFixed(0) : "");
    /* Wagen folgen dem Gleis: jeder auf der Strecke, Abstände über Puffer, Richtung = Gleis */
    let abGleis = 0, abAbst = 0, abRicht = 0, n = 0;
    const W = await pg.evaluate(() => ({ X: STADT.bahn.weg.X, Y: STADT.bahn.weg.Y }));
    for (const r of R) for (let i = 0; i < r.zug.length; i++) {
      const z = r.zug[i]; if (!drin(z)) continue; n++;
      let d = 1e9, bi = 0; for (let k = 0; k < W.X.length; k += 1) { const e = Math.hypot(W.X[k] - z.x, W.Y[k] - z.y); if (e < d) { d = e; bi = k; } }
      abGleis = Math.max(abGleis, d);
      const k0 = Math.max(0, bi - 2), k1 = Math.min(W.X.length - 1, bi + 2), tw = Math.atan2(W.Y[k1] - W.Y[k0], W.X[k1] - W.X[k0]) + (dir < 0 ? Math.PI : 0);
      let dw = Math.abs(((z.h - tw) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
      abRicht = Math.max(abRicht, dw * 180 / Math.PI);
      if (i > 0) { const p = r.zug[i - 1], soll = p.hinten + p.luecke + z.vorn, ist = Math.abs(p.s - z.s); abAbst = Math.max(abAbst, Math.abs(ist - soll)); }
    }
    sage(n > 50 && abGleis < 0.35, "[" + name + "] jeder Wagen steht auf dem Gleis", "größter Abstand " + abGleis.toFixed(3) + " m (" + n + " Stellungen)");
    sage(abAbst < 0.01, "[" + name + "] Wagen hängen mit ihren Längen über Puffer hintereinander", "Abweichung " + abAbst.toFixed(4) + " m");
    sage(abRicht < 6, "[" + name + "] jeder Wagen schaut in Fahrtrichtung längs des Gleises", "größte Abweichung " + abRicht.toFixed(2) + "°");
  }

  console.log("\nIM BILD: GEMALT, RICHTIG GEDREHT, RAUCH\n");
  /* Zug an den Bahnhof stellen (Halt) und die Kamera darauf */
  const hin = async (x, y, s) => { await pg.evaluate(([x, y, s]) => { const K = STADT.kamera; K.x = x; K.y = y; K.s = s * K.dpr; STADT.leicht.unruhe = 3; }, [x, y, s]); await pg.waitForTimeout(1200); };
  const stelle = (t, dir) => pg.evaluate(([t, d]) => { STADT.bahn.fest = t == null ? null : { t: t, dir: d }; STADT.leicht.unruhe = 3; }, [t, dir]);
  const tHalt = await pg.evaluate(() => (STADT.bahn.plan.hin.tAn + STADT.bahn.plan.hin.tAb) / 2);
  await stelle(tHalt, 1); await hin(S.halt[0] + 6, S.halt[1] + 2, 16);
  await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(1500);
  const lok = await pg.evaluate(() => { const z = STADT.bahn.zug[0], p = STADT.proj(z.x, z.y, 2); return [p[0] / STADT.kamera.dpr, p[1] / STADT.kamera.dpr]; });
  const ausschnitt = { x: Math.max(0, lok[0] - 60), y: Math.max(0, lok[1] - 50), width: 120, height: 90 };
  const mit = await pg.screenshot({ clip: ausschnitt });
  const gez = await pg.evaluate(() => STADT.bahn.gezeigt || 0);
  await foto(pg, "tag-winter-nah");
  await stelle(-5, 1); await pg.waitForTimeout(900);
  const ohne = await pg.screenshot({ clip: ausschnitt });
  const unterschied = await pg.evaluate(([a, b]) => new Promise((ok) => {
    const lade = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
    Promise.all([lade(a), lade(b)]).then(([A, Bq]) => {
      const c = document.createElement("canvas"); c.width = A.width; c.height = A.height; const g = c.getContext("2d");
      g.drawImage(A, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data; g.clearRect(0, 0, c.width, c.height); g.drawImage(Bq, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 60) n++;
      ok(n / (da.length / 4));
    });
  }), [mit.toString("base64"), ohne.toString("base64")]);
  sage(gez >= 4, "der Zug ist im Bild (Lok, Tender, Wagen als Laufblätter)", gez + " Fahrzeuge");
  sage(unterschied > 0.15, "er wird wirklich gemalt (Bildpunkte an der Lok ändern sich, wenn er weg ist)", (unterschied * 100).toFixed(1) + " % der Punkte");
  /* Blickrichtung: gebackene Zeile r zeigt die Modellspitze (+y) in Kamerarichtung (−sin, cos) von r·45° */
  await stelle(tHalt, 1);
  const richt = [];
  for (let d = 0; d < 4; d++) {
    richt.push(await pg.evaluate((d) => {
      const K = STADT.kamera; K.dreh = d; STADT.leicht.unruhe = 3;
      STADT.bahn.bewegen(performance.now());
      const Z = STADT.szene.zeitDaten(), liste = STADT.bahn.sichtbar(Z);
      let schlimm = 0;
      for (const p of liste) {
        const g = p.reihe * Math.PI / 4, v1 = [-Math.sin(g), Math.cos(g)], v2 = STADT.drehXY(Math.cos(p.z.h), Math.sin(p.z.h), d);
        schlimm = Math.max(schlimm, Math.acos(Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1]))) * 180 / Math.PI);
      }
      return { d: d, n: liste.length, reihen: liste.map((p) => p.reihe).join(""), schlimm: schlimm };
    }, d));
  }
  await pg.evaluate(() => { STADT.kamera.dreh = 0; STADT.leicht.unruhe = 3; });
  sage(richt.every((r) => r.n > 0 && r.schlimm <= 22.6), "Blickrichtung passt in allen vier Kameradrehungen (8 Richtungen, höchstens 22,5° daneben)", richt.map((r) => "dreh " + r.d + ": Zeilen " + r.reihen + ", " + r.schlimm.toFixed(1) + "°").join(" · "));
  sage(new Set(richt.map((r) => r.reihen[0])).size === 4, "nach jeder Vierteldrehung zeigt die Lok eine andere Seite");
  /* echte Uhr: Zug einfahren lassen (Versatz), 2 s zusehen */
  const bew = await pg.evaluate(() => new Promise((ok) => {
    const BA = STADT.bahn; BA.fest = null;
    const P = BA.plan, T = Date.now() / 1000, n = Math.floor(T / P.takt);
    /* so verschieben, dass jetzt der Hinweg läuft, 3 s nach dem Start (volle Fahrt) */
    const soll = (n % 2 ? n + 1 : n) * P.takt + 3; BA.versatz = soll - T;
    const proben = [];
    const f = () => { if (BA.st && BA.st.s < P.hin.sHalt - 60) proben.push([performance.now(), BA.st.s, BA.st.art]); if (proben.length && performance.now() - proben[0][0] > 2500) { const a = proben[0], b = proben[proben.length - 1]; ok({ v: (b[1] - a[1]) / ((b[0] - a[0]) / 1000), n: proben.length, puffs: BA.puffs.length, art: b[2] }); } else requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }));
  sage(bew.v > 11 && bew.v < 13.5 && bew.n >= 3, "mit der echten Uhr fährt der Zug in der Bildschleife (≈ 45 km/h)", (bew.v * 3.6).toFixed(1) + " km/h, " + bew.n + " Bilder, " + bew.art);
  sage(bew.puffs > 3, "aus dem Schornstein kommt Rauch", bew.puffs + " Wolken");
  await pg.evaluate(() => { STADT.bahn.versatz = 0; });
  /* Überblick: Zug beim Einfahren hinten */
  await stelle(await pg.evaluate(() => STADT.bahn.plan.hin.t1 + 4), 1);
  await hin(-10, -45, 4);
  await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(1200);
  const uebersicht = await pg.evaluate(() => ({ n: STADT.bahn.gezeigt || 0, y: STADT.bahn.zug.map((z) => STADT.proj(z.x, z.y, 0)[1] / STADT.kamera.H) }));
  sage(uebersicht.n >= 3 && uebersicht.y.every((y) => y < 0.5), "im Überblick fährt er hinten (obere Bildhälfte)", JSON.stringify(uebersicht.y.map((v) => +v.toFixed(2))));
  await foto(pg, "tag-winter-ueberblick");
  await pg.close();

  console.log("\nNACHT UND HERBST\n");
  const pn = await seite("jahr=winter&zeit=nacht&bahnt=24");
  const hn = await pn.evaluate(() => { const BA = STADT.bahn; const h = BA.an(BA.halt); const K = STADT.kamera; K.x = h.x + 8; K.y = h.y + 2; K.s = 15 * K.dpr; STADT.leicht.unruhe = 3; return 1; });
  await pn.waitForTimeout(1500); await pn.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {}); await pn.waitForTimeout(800);
  const nb = await pn.evaluate(() => { const Z = STADT.szene.zeitDaten(); return { nacht: Z.nacht, blatt: STADT.bahn.sichtbar(Z).map((p) => p.img.src.split("/").pop().split("?")[0]) }; });
  sage(nb.blatt.length >= 4 && nb.blatt.every((b) => /_nacht/.test(b)), "nachts: Nachtblätter (Stirnlampen, Führerstand hell, Schlusslicht)", nb.blatt.join(", "));
  sage(!pn.fehler.length, "nachts ohne Seitenfehler", pn.fehler.join(" | "));
  await foto(pn, "nacht-winter-nah"); void hn;
  await pn.close();
  const ph = await seite("jahr=herbst&zeit=tag&bahnt=40");
  await ph.evaluate(() => { const BA = STADT.bahn; const z = BA.zug[0]; const K = STADT.kamera; K.x = z.x; K.y = z.y + 4; K.s = 12 * K.dpr; STADT.leicht.unruhe = 3; });
  await ph.waitForTimeout(1500); await ph.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {}); await ph.waitForTimeout(800);
  const hb = await ph.evaluate(() => { const Z = STADT.szene.zeitDaten(); return STADT.bahn.sichtbar(Z).map((p) => p.img.src.split("/").pop().split("?")[0]); });
  sage(hb.length >= 3 && hb.every((b) => /_herbst_tag/.test(b)), "Herbst bei Tag: Herbstblätter (ohne Schnee)", hb.join(", "));
  await foto(ph, "tag-herbst-anfahren");
  await ph.close();

  console.log("\nIM KLEINEN RAHMEN (mini=1: Zwergblätter)\n");
  /* Wie im Rahmen des Spiels: nur kleine Bilder (LB.nurKlein), Überblick über die ganze Stadt (≈ 6,6 Bildpunkte je Meter).
     Die Gesamtgrenze (< 300 KB im echten Dorfrahmen) misst die Sonde 799. */
  const pm = await seite("mini=1&eingebettet=1&jahr=winter&zeit=tag&bahnt=24", { width: 330, height: 206 });
  const vorher = pm.geladen.length;
  await pm.evaluate(() => { const K = STADT.kamera, h = STADT.bahn.an(STADT.bahn.halt); STADT.bilder.nurKlein = true; K.x = h.x + 20; K.y = h.y + 40; K.s = 6.6; STADT.leicht.unruhe = 3; });
  await pm.waitForTimeout(2500);
  await pm.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  await pm.waitForTimeout(600);
  const mm = await pm.evaluate(() => ({ gez: STADT.bahn.gezeigt || 0, namen: STADT.bahn.sichtbar(STADT.szene.zeitDaten()).map((p) => p.img.src.split("/").pop().split("?")[0]) }));
  const bahnDateien = pm.geladen.slice(vorher).concat(pm.geladen.slice(0, vorher)).filter((u) => /l_bahn_/.test(u)).map((u) => decodeURIComponent(new URL(u).pathname).replace(/^\//, ""));
  const bahnKb = [...new Set(bahnDateien)].reduce((n, p) => n + fs.statSync(path.join(WURZEL, p)).size / 1024, 0);
  sage(mm.gez >= 3 && mm.namen.every((n) => /_z\.webp$/.test(n)), "im kleinen Rahmen fährt der Zug mit Zwergblättern (Lok, Tender, zwei Wagen)", mm.namen.join(", "));
  sage(bahnDateien.length > 0 && bahnDateien.every((p) => /_z\.webp$/.test(p)) && bahnKb < 40, "die Bahn kostet dort wenig (nur _z-Blätter)", bahnKb.toFixed(1) + " KB in " + new Set(bahnDateien).size + " Dateien");
  sage(!pm.fehler.length, "im kleinen Rahmen ohne Seitenfehler", pm.fehler.join(" | "));
  await foto(pm, "mini");
  await pm.close();

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
