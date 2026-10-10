#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 825: LATERNEN, FENSTER, LOK-KLANG, RATHAUSUHR, BAUSTELLE
   ---------------------------------------------------------------------
   XANDER (wörtlich): „hast du daran gedacht, dass du die Laternen richtig
   hast, dass sie die Häuser an Strahlen, dass sie nicht die ganze Nacht
   beleuchtet sind, um Strom zu sparen beziehungsweise es ist ja nicht
   jeder immer nachts noch wach" – „überprüfe mal wegen den Lampen ja dass
   nachts die Lampen an sind und diese schönen Lichtkegel geben, die auch
   realistisch sind." – „der Sound von alten Spiel von der Lokomotive den
   fand ich schöner als den jetzigen" – „Big Ben" (Westminster-Schlag) –
   „bei der Baustelle … man hört gar keine Baugeräten".

   Geprüft in der Beispielstadt (?demo=1, Winter, ?uhr= deutsche Uhr):
   LICHT   21:00 alle Laternen an, Lichtfleck am Boden und warmer Schein
           auf nahen Hauswänden in Bildpunkten messbar (Test-Haken
           SZ.pruef schaltet sie zum Vergleich ab); 1:30 jede zweite
           Laterne aus (ohne Lichtfleck), deutlich weniger helle Fenster;
           5:30 bei Dunkelheit wieder alle an; 12:00 alle aus; Fenster
           gehen nach und nach aus (kaum eins geht wieder an).
   KLANG   (echtes Web Audio, ohne Lautsprecher; gezählt über ST.ton.log)
           Lok mit den alten Aufnahmen: Pfiff bei der Einfahrt → Glocke →
           Pfiff vor der Abfahrt → Anfahr-Stampfen → Dampfstöße im Takt der
           Räder, Schienenrollen als Schleife; weit weg leiser.
           Rathausuhr: Westminster-Folge richtig (alle vier Viertel), um
           15:00 vier Wechsel und drei Stundenschläge wirklich angestoßen,
           um 23:00 still; nah lauter als fern; mit ?ton=0 nichts.
           Baustelle: Baugrube → Bagger und Hammer, Rohbau → Hammer und Kran;
           weit weg, nachts und ohne Baustelle nichts.
           Einsammeln: jede fertige Ware (Ei, Milch, Brot, Fisch) gibt dasselbe
           „Pling" und ein Zittern von 12 ms. Autos: leiser Motor, nah an, weit aus.
   AUFRUF  node werkzeug/pruefe-825-licht-klang.js   (QUELLE=1: Einzeldateien;
           WURZEL=<Ordner>: anderer Stand, z. B. für die Gegenprobe)
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { PNG } = require("/tmp/claude-0/node_modules/pngjs");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    /* eine kleine Elternseite wie das Spiel (Töne an), die Stadt eingebettet im Rahmen */
    if (p === "/__eltern825.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end('<!doctype html><meta charset="utf-8"><script>window.DMA_SPIEL_BRUECKE = { toeneAn: () => true };</script><iframe id="r" src="stadt-leicht.html?eingebettet=1&demo=1&zeit=tag&leute=0' + (process.env.QUELLE ? "&quelle=1" : "") + '" style="width:900px;height:600px;border:0"></iframe>'); }
    if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"] });
  const alleFehler = [];
  const seite = async (query, vp) => {
    const pg = await br.newPage({ viewport: vp || { width: 900, height: 700 } });
    pg.setDefaultTimeout(120000);
    pg.on("pageerror", (e) => alleFehler.push(e.message));
    /* zählt angelegte Oszillatoren und Pufferquellen (echtes Web Audio bleibt) */
    await pg.addInitScript(() => {
      window.__osz = 0; window.__quellen = 0;
      const P = (window.BaseAudioContext || window.AudioContext).prototype, o = P.createOscillator, q = P.createBufferSource;
      P.createOscillator = function () { window.__osz++; return o.apply(this, arguments); };
      P.createBufferSource = function () { window.__quellen++; return q.apply(this, arguments); };
    });
    await pg.goto(basis + "/stadt-leicht.html?demo=1&jahr=winter&leute=0&" + query + (process.env.QUELLE ? "&quelle=1" : ""), { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    const zustand = await pg.evaluate(() => ({ fehler: window.__fehler ? String(window.__fehler) : "", dinge: window.STADT.szene ? window.STADT.szene.objekte.length : 0 }));
    if (zustand.fehler || zustand.dinge < 50) console.log("  (Seite " + query + ": " + JSON.stringify(zustand) + ")");
    await pg.evaluate(() => { if (window.STADT.szene) window.STADT.szene.schneefall = false; });
    await pg.waitForTimeout(600);
    await pg.waitForFunction(() => window.STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
    await pg.waitForTimeout(900);
    return pg;
  };
  /* ein frisch gemaltes Bild als Bildpunkte */
  const foto = async (pg, name) => {
    await pg.evaluate(() => { window.STADT.leicht.unruhe = 3; });
    await pg.waitForTimeout(450);
    const buf = await pg.screenshot();
    if (BILD && name) fs.writeFileSync(path.join(BILD, "p825-" + name + ".png"), buf);
    return PNG.sync.read(buf);
  };
  const punkt = (b, x, y) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= b.width || y >= b.height) return null; const i = (y * b.width + x) * 4; return [b.data[i], b.data[i + 1], b.data[i + 2]]; };
  /* Mittel über Bildpunkte: Helligkeit und Wärme (Rot über Blau) */
  const mittel = (b, pts) => { let n = 0, L = 0, W = 0; for (const p of pts) { const c = punkt(b, p[0], p[1]); if (!c) continue; n++; L += (c[0] + c[1] + c[2]) / 3; W += c[0] - c[2]; } return n ? { L: L / n, W: W / n, n: n } : null; };
  const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; };
  /* helle, warme Bildpunkte (brennende Fenster und Laternen) */
  const warmHell = (b) => { let n = 0; for (let i = 0; i < b.data.length; i += 4) { const r = b.data[i], g = b.data[i + 1], bl = b.data[i + 2]; if (r > 200 && g > 150 && r - bl > 70) n++; } return n; };

  /* Ringe um die Laternenfüße (1,4 … 4,2 m) und Wandflecken naher Häuser, in Bildpunkten */
  const orte = (pg) => pg.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, K = ST.kamera;
    if (!SZ.laterneAn) return null;
    const Z = SZ.zeitDaten(), h = SZ.lichtStunde();
    const lat = SZ.objekte.filter((o) => /^d_laterne/.test(o.bild || ""));
    const sicht = lat.map((o) => ({ o: o, P: ST.proj(o.x, o.y, 0) })).filter((x) => x.P[0] > 60 && x.P[0] < K.W - 60 && x.P[1] > 60 && x.P[1] < K.H - 60);
    return sicht.map((x) => {
      const pts = [];
      for (let r = 1.4; r <= 4.3; r += 0.7) for (let a = 0; a < 16; a++) { const w = a / 16 * Math.PI * 2; pts.push(ST.proj(x.o.x + Math.cos(w) * r, x.o.y + Math.sin(w) * r, 0)); }
      return { an: SZ.laterneAn(x.o, Z, h), pts: pts };
    });
  });
  const wandOrte = (pg) => pg.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, aus = [];
    for (const e of SZ.sichtbare || []) for (const w of e.o._lat || []) {
      const pts = [];
      for (let dz = 1.2; dz <= 3.6; dz += 0.6) for (let d = -1.2; d <= 1.2; d += 0.6) pts.push(ST.proj(w.x + d * 0.7, w.y - d * 0.7, dz));
      aus.push({ haus: e.o.bild, d: +w.d.toFixed(1), pts: pts });
    }
    return aus;
  });

  /* ================= LICHT ================= */
  console.log("\nLATERNEN UND FENSTER (deutsche Uhr, ?uhr=)\n");
  const LQ = "s=13&kx=5&ky=5";
  const p21 = await seite("uhr=21:00&" + LQ);
  const st21 = await p21.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene;
    if (!SZ.laterneAn || !ST.uhr) return { fehlt: true };
    const Z = SZ.zeitDaten(), h = SZ.lichtStunde(), lat = SZ.objekte.filter((o) => /^d_laterne/.test(o.bild || ""));
    return { h: +h.toFixed(2), n: lat.length, an: lat.filter((o) => SZ.laterneAn(o, Z, h)).length, kegel: SZ.kegel, schein: SZ.angestrahlt, uhr: document.querySelector(".lk-uhr") && document.querySelector(".lk-uhr").textContent };
  });
  sage(!st21.fehlt, "es gibt Laternen-Uhr und Nachtschaltung (ST.uhr, SZ.laterneAn)");
  if (!st21.fehlt) {
    sage(Math.abs(st21.h - 21) < 0.05 && (st21.uhr == null || /^21:0/.test(st21.uhr)), "?uhr=21:00 stellt die deutsche Uhr der Stadt (auch die Anzeige oben)", JSON.stringify({ h: st21.h, anzeige: st21.uhr }));
    sage(st21.n >= 10 && st21.an === st21.n, "21:00 – alle Laternen brennen", st21.an + " von " + st21.n);
    /* Lichtfleck am Boden: mit und ohne (Test-Haken) vergleichen */
    const o21 = await orte(p21);
    const b1 = await foto(p21, "2100");
    await p21.evaluate(() => { window.STADT.szene.pruef.ohneKegel = true; });
    const b0 = await foto(p21);
    await p21.evaluate(() => { window.STADT.szene.pruef.ohneKegel = false; });
    const dW = [], dL = [];
    for (const x of o21.filter((x) => x.an)) { const m1 = mittel(b1, x.pts), m0 = mittel(b0, x.pts); if (m1 && m0) { dW.push(m1.W - m0.W); dL.push(m1.L - m0.L); } }
    sage(dW.length >= 3 && median(dL) > 5 && median(dW) > 8 && Math.max(...dL) > 12, "Lichtkegel am Boden sichtbar (heller und wärmer rund um den Laternenfuß)",
      JSON.stringify({ laternen: dW.length, heller: +median(dL).toFixed(1), waermer: +median(dW).toFixed(1), max: +Math.max(0, ...dL).toFixed(1) }));
    /* Wände im Schein */
    const w21 = await wandOrte(p21);
    await p21.evaluate(() => { window.STADT.szene.pruef.ohneSchein = true; });
    const bs0 = await foto(p21);
    await p21.evaluate(() => { window.STADT.szene.pruef.ohneSchein = false; });
    const bs1 = await foto(p21);
    const wd = w21.map((w) => { const m1 = mittel(bs1, w.pts), m0 = mittel(bs0, w.pts); return m1 && m0 ? { haus: w.haus, d: w.d, L: +(m1.L - m0.L).toFixed(1), W: +(m1.W - m0.W).toFixed(1) } : null; }).filter(Boolean);
    /* FASSUNG 831 — vorher zählte nur der hellste Fleck, und der musste wärmer werden. Auf der alten Karte war das eine
       Hauswand im Schatten; seit 826 (Wahrzeichen im Maßstab, neue Wege und Laternen) ist der hellste Fleck oft eine
       schon helle Wand – die weiße Platte des Fernsehturms, eine angestrahlte Rathauswand –, deren Rot bei 255 anstößt:
       dort wird es heller, aber nicht röter (W sinkt sogar). Jetzt: der wärmste deutlich aufgehellte Fleck (L > 6);
       dazu gezeigt der hellste. */
    const hell = wd.filter((w) => w.L > 6), best = hell.slice().sort((a, b) => b.W - a.W)[0], hellster = wd.slice().sort((a, b) => b.L - a.L)[0];
    sage(st21.schein >= 1 && wd.length >= 1 && best && best.L > 6 && best.W > 4, "nahe Hauswände werden von den Laternen warm angestrahlt", JSON.stringify({ haeuser: st21.schein, flecken: wd.length, aufgehellt: hell.length, bester: best, hellster: hellster }));
    p21.warm = warmHell(b1); p21.o = o21;
  }
  const p130 = await seite("uhr=01:30&" + LQ);
  const st130 = await p130.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene;
    if (!SZ.laterneAn) return { fehlt: true };
    const Z = SZ.zeitDaten(), h = SZ.lichtStunde(), lat = SZ.objekte.filter((o) => /^d_laterne/.test(o.bild || ""));
    return { h: +h.toFixed(2), n: lat.length, an: lat.filter((o) => SZ.laterneAn(o, Z, h)).length, anteil: SZ.fensterAnteil(h), anteil21: SZ.fensterAnteil(21) };
  });
  if (!st130.fehlt && !st21.fehlt) {
    const q = st130.an / st130.n;
    sage(q >= 0.4 && q <= 0.6, "1:30 – Nachtabschaltung: jede zweite Laterne aus", st130.an + " von " + st130.n + " an");
    const o130 = await orte(p130);
    const c1 = await foto(p130, "0130");
    await p130.evaluate(() => { window.STADT.szene.pruef.ohneKegel = true; });
    const c0 = await foto(p130);
    await p130.evaluate(() => { window.STADT.szene.pruef.ohneKegel = false; });
    /* (der Ring einer dunklen Laterne kann den Rand des Lichtflecks einer brennenden Nachbarin streifen – deshalb der Median) */
    const unterschied = (an) => o130.filter((x) => x.an === an).map((x) => { const m1 = mittel(c1, x.pts), m0 = mittel(c0, x.pts); return m1 && m0 ? m1.L - m0.L : null; }).filter((v) => v != null);
    const dAus = unterschied(false), dAn = unterschied(true);
    sage(dAus.length >= 2 && dAn.length >= 2 && Math.abs(median(dAus)) < 5 && median(dAn) > 8 && Math.abs(median(dAus)) < median(dAn) * 0.25,
      "1:30 – ausgeschaltete Laternen werfen keinen Lichtkegel, die brennenden schon", JSON.stringify({ aus: dAus.length, ausHeller: +median(dAus).toFixed(2), an: dAn.length, anHeller: +median(dAn).toFixed(2) }));
    const w130 = warmHell(c1);
    sage(st130.anteil < st130.anteil21 * 0.4 && w130 < p21.warm * 0.8, "1:30 – deutlich weniger helle Fenster als um 21 Uhr (gemalte Fenster werden dunkel)",
      JSON.stringify({ anteil21: +st130.anteil21.toFixed(2), anteil130: +st130.anteil.toFixed(2), warmeBildpunkte21: p21.warm, warmeBildpunkte130: w130 }));
    /* nach und nach: kaum ein Fenster geht im Lauf der Nacht wieder an; ein paar bleiben die ganze Nacht */
    const verlauf = await p130.evaluate(() => {
      const SZ = window.STADT.szene, hs = [20, 21, 22, 23, 24, 25, 26, 27], fen = [];
      for (const o of SZ.objekte) if ((o.art === "haus" || o.art === "wunder") && o.id != null) for (let i = 0; i < 12; i++) fen.push([o, i]);
      const an = hs.map((h) => fen.map((f) => SZ.fensterAn(f[0], f[1], h % 24)));
      let wieder = 0, wechsel = 0;
      for (let k = 1; k < hs.length; k++) for (let j = 0; j < fen.length; j++) if (an[k][j] !== an[k - 1][j]) { wechsel++; if (an[k][j]) wieder++; }
      return { zahl: an.map((a) => a.filter(Boolean).length), fenster: fen.length, wieder: wieder, wechsel: wechsel };
    });
    const fallend = verlauf.zahl.every((z, i) => i === 0 || z <= verlauf.zahl[i - 1] + verlauf.fenster * 0.04);
    /* FASSUNG 837 — seit den späten Häusern (833) sind es 312 statt ~250 Fenster; das gewollte kurze Aufleuchten einzelner
       Fenster (Nachteulen, 3,5 % je Takt) landet zufällig bei 36 von 266 Wechseln = 13,5 % (auf main genauso). Grenze 15 %;
       „nach und nach aus" und „ein paar bleiben" gelten unverändert. */
    sage(fallend && verlauf.wieder <= verlauf.wechsel * 0.15 && verlauf.zahl[verlauf.zahl.length - 1] > 0 && verlauf.zahl[verlauf.zahl.length - 1] < verlauf.zahl[0] * 0.3,
      "Fenster gehen nach und nach aus (nie alle zugleich, ein paar bleiben)", JSON.stringify(verlauf));
  }
  await p21.close(); await p130.close();
  const p530 = await seite("uhr=05:30&" + LQ);
  const st530 = await p530.evaluate(() => {
    const SZ = window.STADT.szene; if (!SZ.laterneAn) return { fehlt: true };
    const Z = SZ.zeitDaten(), h = SZ.lichtStunde(), lat = SZ.objekte.filter((o) => /^d_laterne/.test(o.bild || ""));
    const r = { n: lat.length, an: lat.filter((o) => SZ.laterneAn(o, Z, h)).length, grad: Z.grad, anteil: SZ.fensterAnteil(h), anteil130: SZ.fensterAnteil(1.5) };
    window.STADT.uhrStellen("12:00"); const Z2 = SZ.zeitDaten(); r.mittag = lat.filter((o) => SZ.laterneAn(o, Z2, SZ.lichtStunde())).length; window.STADT.uhrStellen("05:30");
    return r;
  });
  await foto(p530, "0530");
  if (!st530.fehlt) {
    sage(st530.grad > 0.9 && st530.an === st530.n, "5:30 – noch dunkel: alle Laternen wieder an", st530.an + " von " + st530.n);
    sage(st530.anteil > st530.anteil130, "5:30 – die Ersten stehen auf (mehr Fenster hell als um 1:30)", st530.anteil.toFixed(2) + " > " + st530.anteil130.toFixed(2));
    sage(st530.mittag === 0, "12:00 – tagsüber brennt keine Laterne", String(st530.mittag));
  }
  await p530.close();

  /* ================= KLANG ================= */
  console.log("\nKLANG (Web Audio, gezählt)\n");
  const pk = await seite("zeit=tag&ton=1&uhr=10:00");
  const bereit = await pk.evaluate(async () => {
    const T = window.STADT.ton; if (!T || !T.datei) return { fehlt: true };
    const N = ["lokpfeife", "lokstampf", "lokschiene", "lokglocke"];
    T.vorladen(N);
    for (let i = 0; i < 100 && !N.every(T.hat); i++) await new Promise((ok) => setTimeout(ok, 150));
    return { ctx: T.ctx && T.ctx.state, geladen: N.filter(T.hat), kaputt: N.filter(T.kaputt) };
  });
  sage(!bereit.fehlt && bereit.geladen.length === 4 && bereit.ctx === "running", "die alten Lok-Aufnahmen (ton/lok…) sind geladen, Tonanlage läuft", JSON.stringify(bereit));
  if (!bereit.fehlt) {
    const tonLauf = (weit) => pk.evaluate((weit) => {
      const ST = window.STADT, BA = ST.bahn, P = BA.plan, K = ST.kamera, T = ST.ton;
      BA.fest = null;
      const h = BA.an(BA.halt); K.x = h.x + (weit ? 260 : 2); K.y = h.y + (weit ? 260 : 2); K.s = 14 * K.dpr; K.dreh = 0;
      const vorher = T.log.length, q0 = window.__quellen;
      const jetzt = Date.now() / 1000, n = Math.floor(jetzt / P.takt), start = (n % 2 ? n + 1 : n + 2) * P.takt;
      for (let t = P.hin.t1 - 3; t < P.hin.tAb + 14; t += 0.04) { BA.versatz = start + t - Date.now() / 1000; BA.bewegen(performance.now()); }
      BA.versatz = 0; BA.bewegen(performance.now());
      const log = T.log.slice(vorher), zahl = (n) => log.filter((e) => e.name === n).length;
      return { reihe: log.filter((e) => !/^(dampfstoss|lokschiene)/.test(e.name)).map((e) => e.name).join(" → "), stoss: zahl("dampfstoss"), schiene: zahl("lokschiene-schleife"),
        synth: zahl("schnauf") + zahl("pfiff-ein") + zahl("bremse"), laut: Math.max(0, ...log.map((e) => e.laut)), quellen: window.__quellen - q0, alle: log.length };
    }, weit);
    const tn = await tonLauf(false);
    sage(/lokpfeife-ein.*lokglocke.*lokpfeife-ab.*lokstampf/.test(tn.reihe), "Lok wie im alten Dorf: Pfiff bei der Einfahrt → Glocke → Pfiff → Anfahr-Stampfen (Aufnahmen)", tn.reihe);
    sage(tn.stoss >= 12 && tn.schiene >= 1 && tn.synth === 0, "danach Dampfstöße im Takt der Räder und Schienenrollen – kein selbst erzeugter Ersatz", JSON.stringify({ stoesse: tn.stoss, schiene: tn.schiene, ersatz: tn.synth, quellen: tn.quellen }));
    sage(tn.laut > 0.05 && tn.laut <= 0.7, "leise (höchstens 0,7 vor der Lautstärkestufe)", "lauteste " + tn.laut.toFixed(3));
    const tw = await tonLauf(true);
    sage(tw.alle < tn.alle * 0.3, "weit weg (Kamera 370 m entfernt) viel leiser bis stumm", JSON.stringify({ nah: tn.alle, weit: tw.alle }));

    /* ---- Rathausuhr ---- */
    const plan = await pk.evaluate(() => {
      const T = window.STADT.ton; if (!T.glockenPlan) return null;
      const f = (h, v) => T.glockenPlan(h, v).map((p) => p.ton).join(" ");
      return { v1: f(9, 1), v2: f(9, 2), v3: f(9, 3), h15: f(15, 0), h12: T.glockenPlan(0, 0).filter((p) => p.art === "stunde").length, fr: T.WESTMINSTER.toene };
    });
    const W1 = "gis fis e h", W2 = "e gis fis h", W3 = "e fis gis e", W4 = "gis e fis h", W5 = "h fis gis e";
    sage(!!plan && plan.v1 === W1 && plan.v2 === W2 + " " + W3 && plan.v3 === [W4, W5, W1].join(" ") && plan.h15 === [W2, W3, W4, W5].join(" ") + " E E E" && plan.h12 === 12,
      "Westminster-Schlag richtig: Viertel, halb, dreiviertel, volle Stunde + Stundenschläge (0 Uhr = 12)", plan ? plan.h15 : "fehlt");
    sage(!!plan && Math.abs(plan.fr.gis / plan.fr.e - Math.pow(2, 4 / 12)) < 0.002 && Math.abs(plan.fr.fis / plan.fr.e - Math.pow(2, 2 / 12)) < 0.002 && Math.abs(plan.fr.e / plan.fr.h - Math.pow(2, 5 / 12)) < 0.002,
      "Töne in E-Dur: gis' fis' e' h (gleichstufig)", plan ? JSON.stringify(plan.fr) : "");
    if (plan) {
      /* Uhr kurz vor die Viertelstunde stellen und warten, bis die Uhr schlägt (höchstens ms + 8 s, falls die Seite unter Last hängt) */
      const warte = async (uhr, ms) => {
        await pk.evaluate((u) => { window.__osz0 = window.__osz; window.__q0 = window.__quellen; window.__log0 = window.STADT.ton.log.length; window.__gl0 = window.STADT.ton.glockenLog.length; window.STADT.uhrStellen(u); }, uhr);
        await pk.waitForTimeout(ms);
        await pk.waitForFunction(() => window.STADT.ton.glockenLog.length > window.__gl0, null, { timeout: 8000 }).catch(() => {});
        await pk.waitForTimeout(300);
      };
      await pk.evaluate(() => { const ST = window.STADT, o = ST.szene.objekte.find((o) => o.spiel === "rathaus"); ST.kamera.x = o.x + 5; ST.kamera.y = o.y + 12; ST.kamera.s = 12 * ST.kamera.dpr; });
      await warte("14:59:57", 4800);
      const g15 = await pk.evaluate(() => { const T = window.STADT.ton; return { neu: T.glockenLog.slice(window.__gl0), osz: window.__osz - window.__osz0, quellen: window.__quellen - window.__q0, log: T.log.slice(window.__log0).map((e) => e.name) }; });
      const e15 = g15.neu[g15.neu.length - 1] || {};
      sage(e15.stunde === 15 && e15.viertel === 0 && e15.gespielt === true && e15.folge === plan.h15 && g15.log.indexOf("glocke-stunde") >= 0 && (g15.osz > 150 || g15.quellen >= 19),   // FASSUNG 882: gegossene Glocken (19 Pufferquellen) oder direkt (Oszillatoren)
        
        "15:00 – die Rathausuhr schlägt: vier Wechsel und drei Stundenschläge, wirklich angestoßen", JSON.stringify({ eintrag: e15.uhr, gespielt: e15.gespielt, laut: e15.laut, oszillatoren: g15.osz, quellen: g15.quellen, art: e15.art }));
      await warte("16:14:57", 4200);
      const g1615 = await pk.evaluate(() => window.STADT.ton.glockenLog.slice(window.__gl0));
      const e1615 = g1615[g1615.length - 1] || {};
      sage(e1615.viertel === 1 && e1615.gespielt && e1615.folge === W1, "16:15 – Viertelschlag (ein Wechsel)", JSON.stringify(e1615));
      await warte("22:59:57", 4200);
      const g23 = await pk.evaluate(() => { const T = window.STADT.ton; return { neu: T.glockenLog.slice(window.__gl0), log: T.log.slice(window.__log0).map((e) => e.name).filter((n) => /glocke/.test(n)) }; });
      const e23 = g23.neu[g23.neu.length - 1] || {};
      sage(e23.stunde === 23 && e23.gespielt === false && /nacht/.test(e23.grund || "") && g23.log.length === 0, "23:00 – nachts still (22–7 Uhr)", JSON.stringify(e23));
      const lautNahFern = await pk.evaluate(() => {
        const ST = window.STADT, K = ST.kamera, o = ST.szene.objekte.find((o) => o.spiel === "rathaus");
        K.x = o.x; K.y = o.y + 5; const nah = ST.ton.glockeLaut().laut; K.x = o.x + 200; K.y = o.y + 160; const fern = ST.ton.glockeLaut().laut; K.x = o.x; K.y = o.y + 5;
        return { nah: nah, fern: fern };
      });
      /* FASSUNG 882 — XANDER (Funk 303): „ganz leise … mega leise". Fern bleibt sie deutlich (früher 1/20), nah am Rathaus lauter. */
      sage(lautNahFern.nah > lautNahFern.fern * 1.6 && lautNahFern.fern >= 0.15, "nah am Rathaus lauter, aber überall in der Stadt deutlich zu hören", JSON.stringify(lautNahFern));
    }

    /* ---- Baustelle ---- */
    const bauLauf = (p, nah, uhr, ms) => pk.evaluate(async (a) => {
      const ST = window.STADT, T = ST.ton, K = ST.kamera, o = ST.szene.objekte.find((o) => o.bau);
      if (!o) return { keine: true };
      ST.uhrStellen(a.uhr);
      /* Fortschritt festhalten (sonst stellt ihn die Oberfläche jede Sekunde nach der Uhr) */
      if (a.p != null) { o.bau.p = a.p; o.bau.bis = 0; }
      for (const x of ST.szene.objekte) if (x.bau && x !== o) { x.bau.p = 0.99; x.bau.bis = 0; }
      K.x = o.x + (a.nah ? 4 : 320); K.y = o.y + (a.nah ? 6 : 320); K.s = 18 * K.dpr;
      const v = T.log.length;
      await new Promise((ok) => setTimeout(ok, a.ms));
      const namen = T.log.slice(v).map((e) => e.name).filter((n) => /^bau-/.test(n)), z = (n) => namen.filter((x) => x === n).length;
      return { info: T.bauInfo, hammer: z("bau-hammer"), bagger: z("bau-bagger"), kran: z("bau-kran"), saege: z("bau-saege"), hacke: z("bau-spitzhacke"), alle: namen.length };
    }, { p: p, nah: nah, uhr: uhr, ms: ms });
    const b8 = await bauLauf(0.05, true, "10:00", 8000);
    sage(!b8.keine && b8.info && b8.info.phase === 8 && b8.bagger >= 1 && b8.hammer >= 1, "Baugrube (b8), Kamera nah: Bagger und Hammer", JSON.stringify(b8));
    const b55 = await bauLauf(0.55, true, "10:05", 9500);
    sage(b55.info && b55.info.phase === 55 && b55.hammer >= 3 && b55.kran >= 1 && b55.bagger === 0, "Rohbau (b55): Hämmern in Gruppen, Kran-Surren (kein Bagger mehr)", JSON.stringify(b55));
    const bw = await bauLauf(0.55, false, "10:10", 4000);
    sage(bw.alle === 0, "Kamera weit weg: keine Baugeräusche", JSON.stringify(bw));
    const bn = await bauLauf(0.55, true, "22:30", 4000);
    sage(bn.alle === 0 && bn.info && bn.info.ruhe, "nachts (Nachtruhe 20–7 Uhr) still", JSON.stringify(bn));
    const bo = await pk.evaluate(async () => {
      const ST = window.STADT, T = ST.ton; ST.uhrStellen("10:20");
      for (const o of ST.szene.objekte) o.bau = null;
      const v = T.log.length; await new Promise((ok) => setTimeout(ok, 3000));
      return { info: T.bauInfo, alle: T.log.slice(v).filter((e) => /^bau-/.test(e.name)).length };
    });
    sage(bo.alle === 0 && bo.info === null, "ohne Baustelle keine Baugeräusche", JSON.stringify(bo));
  }
  await pk.close();

  /* ---- Einsammeln (Ergänzung): „bei den anderen bei Ei … kommt da gar nix … so dieses Haptik-Geräusch" ----
     im Rahmen wie im Spiel: die Elternseite schickt die Zeichen, ein Tipp auf ein fertiges Zeichen sammelt ein */
  const pe = await br.newPage({ viewport: { width: 920, height: 640 } });
  pe.on("pageerror", (e) => alleFehler.push(e.message));
  await pe.goto(basis + "/__eltern825.html", { waitUntil: "load" });
  let sammeln = { fehlt: true };
  const rahmen = pe.frames().find((f) => /stadt-leicht\.html/.test(f.url()));
  if (rahmen) {
    await rahmen.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 }).catch(() => {});
    await rahmen.evaluate(() => { window.__zittern = []; navigator.vibrate = (ms) => { window.__zittern.push(ms); return true; }; });
    await pe.evaluate(() => document.getElementById("r").contentWindow.postMessage({ typ: "leicht-zeichen", z: { huehnerstall: ["fertig", "2 Eier", "ei"], kuhstall: ["fertig", "3 Milch", "milch"], baeckerei: ["fertig", "4 Brot", "brot"], see: ["fertig", "1 Fisch", "fisch"], schmiede: ["laeuft", "Werkzeug 2:10", ""] } }, location.origin));
    await pe.waitForTimeout(600);
    sammeln = await rahmen.evaluate(async () => {
      const T = window.STADT.ton; if (!T.einsammeln) return { fehlt: true };
      const v = T.log.length, knoepfe = Array.from(document.querySelectorAll(".lk-zeichen"));
      for (const b of knoepfe) b.click();
      await new Promise((ok) => setTimeout(ok, 500));
      return { zeichen: knoepfe.length, toene: T.log.slice(v).map((e) => e.name).filter((n) => /^einsammeln/.test(n)), zittern: window.__zittern.slice() };
    });
  }
  await pe.close();
  sage(!sammeln.fehlt && ["ei", "milch", "brot", "fisch"].every((w) => sammeln.toene.indexOf("einsammeln-" + w) >= 0) && sammeln.toene.length === 4 && sammeln.zittern.length === 4 && sammeln.zittern.every((m) => m === 12),
    "Einsammeln: für jede Ware (Ei, Milch, Brot, Fisch) dasselbe Pling + Zittern 12 ms, nichts bei Laufendem", JSON.stringify(sammeln));
  const pa = await seite("autos=viper,batmobil&zeit=tag&ton=1&uhr=10:00");
  /* ---- Motor der Autos: „am Tag … Autos fahren … mit Fahrgeräusche" ---- */
  const motor = await pa.evaluate(async () => {
    const ST = window.STADT, AU = ST.autos, K = ST.kamera, T = ST.ton;
    if (!AU || !AU.motoren) return { fehlt: true };
    /* (unter Last malt die Software-Grafik nur wenige Bilder je Sekunde, die Autos kommen kaum in Fahrt – deshalb wird
       das Tempo gesetzt und der Motor-Takt direkt gerufen, wie in einem Bild) */
    await new Promise((ok) => setTimeout(ok, 1500));
    const a = AU.liste[0]; if (!a || !AU.motorTon) return { keinAuto: true };
    const hoer = (v, gas, weit) => {
      K.x = a.x + (weit ? 400 : 0); K.y = a.y + (weit ? 400 : 0); K.s = 20 * K.dpr; a.v = v; a.gas = gas; AU.motorTon();
      const m = AU.motoren.get(a.id); return m ? { laut: +m.laut.toFixed(3), f: Math.round(m.f) } : null;
    };
    const steht = hoer(0, 0), faehrt = hoer(6.5, 0), gas = hoer(6.5, 2.2), weit = hoer(6.5, 0, true);
    return { auto: a.id, steht: steht, faehrt: faehrt, gas: gas, weit: weit, log: T.log.map((e) => e.name).filter((n) => /^motor-/.test(n)).slice(0, 6) };
  });
  sage(!motor.fehlt && !motor.keinAuto && motor.steht && motor.faehrt && motor.gas && motor.faehrt.laut > 0.05 && motor.faehrt.laut < 0.3 && motor.steht.laut < motor.faehrt.laut * 0.6
    && motor.faehrt.f > motor.steht.f + 30 && motor.gas.f > motor.faehrt.f && motor.weit === null && /motor-(v10|turbine)/.test(motor.log.join(" ")),
    "Autos: leiser Motor – schneller = höhere Drehzahl und lauter, Gas etwas mehr; weit weg aus", JSON.stringify(motor));
  await pa.close();
  /* ?ton=0: nichts */
  const p0 = await seite("zeit=tag&ton=0&uhr=10:00");
  const still = await p0.evaluate(() => { const T = window.STADT.ton; if (!T.glockeTesten) return null; T.glockeTesten(15, 0); const e = T.glockenLog[T.glockenLog.length - 1]; return { darf: T.darf(), gespielt: e.gespielt, grund: e.grund, log: T.log.length }; });
  sage(!!still && still.darf === false && still.gespielt === false && still.log === 0, "?ton=0 (Ton aus): keine Glocke, kein Klang", JSON.stringify(still));
  await p0.close();

  sage(!alleFehler.length, "keine Seitenfehler", alleFehler.slice(0, 4).join(" | "));
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
