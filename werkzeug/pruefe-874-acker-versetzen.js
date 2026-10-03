#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 874: DIE ÄCKER VERSETZEN (Funk 255)
   ---------------------------------------------------------------------
   XANDER (Funk 255, wörtlich): „Ich möchte dass man das Feld verschieben
   kann und dass es standardmäßig zwischen der Bäckerei und der Mühle ist
   also hinter der Bäckerei quasi … das Feld auf der rechten Seite ist
   auch noch nicht in einer geeigneten Position wo ich locker drauf
   zugreifen kann innerhalb des Bildausschnitts".
   Geprüft:
   A  Telefon 360 × 740 (Finger), stadt-leicht.html angemeldet mit
      nachgebautem Server (Stand von spiel_stadt_leicht_speichern in
      sessionStorage; vor dem Neuladen wird der Browser-Speicher geleert =
      anderes Gerät):
        · ohne Speicherstand: Acker 91 hinter der Bäckerei (u −58, v −14),
          Acker 92 auf seinem Ackerplatz; beide Plätze gelten als frei;
          der Kornwagen lädt an beiden
        · Tipp auf den Acker → Menü am Acker „Getreidefeld“ mit
          „Versetzen“, ganz im Bild
        · Versetzen auf eine Straße/ein Haus: Rahmen rot, „Setzen“ lehnt
          ab („Hier geht kein Acker hin …“), der Acker rastet zurück,
          nichts wird gemerkt
        · Versetzen auf freie Wiese: Rahmen grün, „Gesetzt“; dort stehen
          jetzt Korn (gemalt), Tippfläche, Zeichen („Getreide reif“) und
          die Ladestelle des Kornwagens, am alten Platz nichts mehr; ein
          Kornwagen lädt am neuen Platz; kein Baum steht darauf
        · gemerkt im Stand „verwalten“ (felder) – über
          spiel_stadt_leicht_speichern und im Browser (leicht_verwalten_v1),
          kein anderer Serveraufruf (keine neue Tabelle)
        · Halten und Ziehen wie bei einem Haus: Menü offen, Finger ruhig →
          Brummen, angehoben, ziehen, loslassen → „Gesetzt“, Menü am Acker
        · Neuladen (nur der Server): der Acker liegt am neuen Platz
        · „Zurück auf den Ackerplatz“ → wieder hinter der Bäckerei,
          nichts mehr gemerkt
        · langes Drücken auf den Acker → Bearbeiten-Menü mit „Versetzen“
   B  Kleiner Rahmen im Spiel (Telefon hochkant: 360 × 225, dazu
      280 × 175), Beispielstadt ohne Speicherstand, Überblick:
        · der rechte Acker (92) liegt ganz im Bild, frei von Knöpfen und
          Zeichen, mit einer bequemen freien Tippfläche (Quadrat ≥ 18 px)
          – ein Tipp darauf erntet (leicht-feld 92)
        · ebenso der linke (91)
        · langes Drücken auf den Acker → Menü mit „Versetzen“ im Rahmen
        · versetzt (Browser-Speicher, Beispielstadt): der Tipp am neuen
          Platz erntet, das Zeichen steht dort; nach Neuladen noch dort
   Gegenprobe: ALT=/pfad mit leicht.min.js, leicht.css, korn.min.js des
   alten Stands – dann ist das rot (kein Menü am Acker, kein Versetzen).
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/pruefe-874-acker-versetzen.js
           (BILD=/pfad für Bildschirmfotos, NUR=A|B, QUELLE=1 Einzeldateien)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const ALT = process.env.ALT || "", BILD = process.env.BILD || "", NUR = process.env.NUR || "AB", QU = process.env.QUELLE ? "&quelle=1" : "";
/* die Ackerplätze ohne Speicherstand (Mitte u, v und Größe in den Bildachsen u = x − y, v = x + y) */
const STANDARD = { 91: [-58, -14, 16, 24], 92: [94, 31, 18, 30] };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

/* nachgebauter Server: angemeldet, Mühle und Bäckerei stehen (Kornwagen fährt) */
const FALSCH = `(function(){
  function srv(){ try { return JSON.parse(sessionStorage.getItem("__srv874") || "null") || { v: 1, deko: [], lage: {} }; } catch (e) { return null; } }
  window.__rufe874 = [];
  var ich = { id: "u874", name: "Xander", dorf_name: "Prüfstadt", punkte: 900, level: 12,
    dorf: { rathaus: { stufe: 3, lp: 60 }, kuhstall: { stufe: 2, lp: 40 }, huehnerstall: { stufe: 1, lp: 20 }, baeckerei: { stufe: 2, lp: 40 }, muehle: { stufe: 2, lp: 40 },
      schule: { stufe: 1, lp: 20 }, gasthaus: { stufe: 1, lp: 20 }, krankenhaus: { stufe: 1, lp: 20 }, kaserne: { stufe: 1, lp: 20 }, labor: { stufe: 1, lp: 20 }, flickstube: { stufe: 1, lp: 20 } },
    dorf_plan: {}, baustellen: [], volk: { wunder: { brandenburger: { stufe: 1 }, fernsehturm: { stufe: 1 } } } };
  var klient = {
    auth: { getSession: function () { return Promise.resolve({ data: { session: { user: { id: "u874" } } } }); } },
    from: function () { var k = { select: function () { return k; }, eq: function () { return k; }, maybeSingle: function () { return Promise.resolve({ data: { is_owner: false } }); } }; return k; },
    rpc: function (name, args) {
      window.__rufe874.push({ name: name, args: args });
      var d = { ok: true };
      if (name === "spiel_ich") d = JSON.parse(JSON.stringify(ich));
      else if (name === "spiel_stadt_leicht_holen") d = srv();
      else if (name === "spiel_stadt_leicht_speichern") { sessionStorage.setItem("__srv874", JSON.stringify(args.p_daten)); d = { ok: true }; }
      else if (name === "spiel_autos") d = { autos: [] };
      return Promise.resolve({ data: d, error: null });
    }
  };
  window.supabase = { createClient: function () { return klient; } };
})();`;

const RAHMEN = (w, h, extra) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;background:#223}iframe{border:0;width:${w}px;height:${h}px;display:block;margin-top:120px}</style></head><body>
<iframe id="f" src="/stadt-leicht.html?eingebettet=1&mini=1&demo=1&zeit=tag&jahr=sommer&uhr=12:00&leute=0${QU}${extra || ""}"></iframe>
<script>window.__msgs=[];addEventListener("message",function(e){window.__msgs.push(e.data);});</script></body></html>`;

(async () => {
  const srv = http.createServer((q, a) => {
    const p = decodeURIComponent(q.url.split("?")[0]);
    const m = /^\/__rahmen874-(\d+)x(\d+)\.html$/.exec(p);
    if (m) { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(RAHMEN(+m[1], +m[2])); }
    if (ALT && (p === "/stadt-leicht/leicht.min.js" || p === "/stadt-leicht/leicht.css" || p === "/stadt-leicht/korn.min.js")) { a.writeHead(200, { "Content-Type": TYP[path.extname(p)] }); return fs.createReadStream(path.join(ALT, path.basename(p))).pipe(a); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const handy = () => br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const seitenFehler = [];
  if (BILD) fs.mkdirSync(BILD, { recursive: true });

  /* ---- im Fenster der Stadt (Seite oder Rahmen) ---- */
  /* Mitte eines Ackers (u, v) */
  const mitte = (w, nr) => w.evaluate((nr) => { const f = (STADT.dorf.FELD_ORTE || []).find((q) => q.nr === nr); return f ? [+((f.u0 + f.u1) / 2).toFixed(2), +((f.v0 + f.v1) / 2).toFixed(2), +(f.u1 - f.u0).toFixed(2), +(f.v1 - f.v0).toFixed(2)] : null; }, nr);
  /* Kamera so, dass die Punkte (u, v) mittig im oberen Teil des Bildes liegen */
  const blick = (w, pts, s) => w.evaluate(({ pts, s }) => {
    const K = STADT.kamera; let u = 0, v = 0; for (const p of pts) { u += p[0]; v += p[1]; } u /= pts.length; v /= pts.length;
    K.x = (u + v) / 2; K.y = (v - u) / 2 + 6; K.s = s * K.dpr; if (STADT.drehen && STADT.drehen.setzen) STADT.drehen.setzen(0); K.dreh = 0; STADT.leicht.unruhe = 3; return 1;
  }, { pts, s });
  /* Bildschirmpunkt (CSS-px) einer Stelle (u, v) */
  const schirm = (w, u, v, z) => w.evaluate(([u, v, z]) => { const K = STADT.kamera, P = STADT.proj((u + v) / 2, (v - u) / 2, z || 0); return { x: P[0] / K.dpr, y: P[1] / K.dpr }; }, [u, v, z || 0]);
  /* ein freier Punkt auf dem Acker nr (kein Haus/Baum davor, kein Knopf), vorne bevorzugt */
  const ackerPunkt = (w, nr, rand) => w.evaluate(([nr, rand]) => {
    const K = STADT.kamera, SZ = STADT.szene, f = STADT.dorf.FELD_ORTE.find((q) => q.nr === nr); if (!f) return null;
    for (const b of [0.5, 0.65, 0.35, 0.8, 0.2]) for (const a of [0.5, 0.35, 0.65, 0.2, 0.8]) {
      const u = f.u0 + (f.u1 - f.u0) * a, v = f.v0 + (f.v1 - f.v0) * b, P = STADT.proj((u + v) / 2, (v - u) / 2, 0), x = P[0] / K.dpr, y = P[1] / K.dpr;
      if (x < rand || y < rand || x > innerWidth - rand || y > innerHeight - rand) continue;
      if (SZ.treffer(P[0], P[1])) continue;
      const e = document.elementFromPoint(x, y); if (!e || e.id !== "lDinge") continue;
      return { x: x, y: y, u: u, v: v };
    }
    return null;
  }, [nr, rand || 20]);
  /* eine freie Stelle für Acker nr in der Nähe von (u, v): erst ganz frei, dann möglichst nah – zwischen dmin und dmax */
  const freieStelle = (w, nr, u0, v0, dmin, dmax) => w.evaluate(([nr, u0, v0, dmin, dmax]) => {
    const D = STADT.dorf; let best = null;
    for (let r = dmin; r <= dmax && !best; r += 4) for (let i = 0, n = Math.max(12, Math.round(r)); i < n; i++) {
      const a = i / n * Math.PI * 2, u = +(u0 + Math.cos(a) * r).toFixed(1), v = +(v0 + Math.sin(a) * r).toFixed(1);
      if (!D.feldPruefen || D.feldPruefen(nr, u, v)) continue;
      best = [u, v]; break;
    }
    return best;
  }, [nr, u0, v0, dmin, dmax]);
  const karteInfo = (w) => w.evaluate(() => { const k = document.querySelector(".lk-karte"); if (!k || k.hidden) return null; const r = k.getBoundingClientRect();
    return { t: k.textContent, am: k.classList.contains("lk-am-ding"), titel: (k.querySelector(".lk-karte-titel") || {}).textContent || "", vs: !!k.querySelector('.lk-knopf[title="Versetzen"]'),
      zurueck: !!k.querySelector('.lk-knopf[title="Zurück auf den Ackerplatz"]'), drin: r.left >= -0.5 && r.right <= innerWidth + 0.5 && r.top >= -0.5 && r.bottom <= innerHeight + 0.5, r: [r.left, r.top, r.right, r.bottom].map(Math.round) }; });
  const klick = (w, sel) => w.evaluate((sel) => { const b = document.querySelector(sel); if (!b) return false; b.click(); return true; }, sel);
  /* Pixel auf der Dinge-Leinwand an (u, v), Höhe z: [r, g, b, a] */
  const pixel = (w, u, v, z) => w.evaluate(([u, v, z]) => { const c = document.getElementById("lDinge"), g = c.getContext("2d"), P = STADT.proj((u + v) / 2, (v - u) / 2, z || 0);
    const d = g.getImageData(Math.round(P[0]) - 2, Math.round(P[1]) - 2, 5, 5).data; let r = 0, gg = 0, b = 0, a = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; a += d[i + 3]; } const n = d.length / 4; return [r / n, gg / n, b / n, a / n].map(Math.round); }, [u, v, z || 0]);
  const korn = (p) => p[3] > 200 && p[0] + p[1] - 2 * p[2] > 100 && p[0] > p[2] + 40;
  const tick = (pg, ms) => pg.waitForTimeout(ms);
  const ruhig = async (pg, w) => { let alt = "", gleich = 0; for (let i = 0; i < 80; i++) { const k = await w.evaluate(() => { const K = STADT.kamera; return [K.x, K.y, K.s].map((v) => v.toFixed(3)).join(); }); gleich = k === alt ? gleich + 1 : 0; if (gleich >= 3) return; alt = k; await pg.waitForTimeout(250); } };
  /* ziehen mit der Maus (Zeigerereignisse wie ein Finger) von a nach b in Schritten */
  const ziehen = async (pg, a, b, schritte) => { await pg.mouse.move(a.x, a.y); await pg.mouse.down(); const n = schritte || 18; for (let i = 1; i <= n; i++) { await pg.mouse.move(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n); await pg.waitForTimeout(25); } };

  try {
    /* ======================= A: Telefon, angemeldet ======================= */
    if (NUR.indexOf("A") >= 0) {
      console.log("\nTEIL A — Telefon 360 × 740, angemeldet (Server-Attrappe)\n");
      const ctx = await handy();
      await ctx.route(/supabase-js@2\/dist\/umd\/supabase\.js/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: FALSCH }));
      await ctx.addInitScript(() => { window.__brumm = []; try { Object.defineProperty(navigator, "vibrate", { configurable: true, value: (ms) => { window.__brumm.push(ms); return true; } }); } catch (e) {} });
      const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
      pg.on("pageerror", (e) => seitenFehler.push("A: " + String(e.message || e)));
      const laden = async () => {
        await pg.goto(basis + "/stadt-leicht.html?zeit=tag&jahr=sommer&uhr=12:00&leute=0" + QU, { waitUntil: "load" });
        await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
        await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 60000 }).catch(() => {});
        await pg.waitForFunction(() => !!window.STADT.korn, null, { timeout: 20000 }).catch(() => {});
        await tick(pg, 800);
      };
      await sessionStorageLeeren(pg, basis);
      await laden();
      sage(await pg.evaluate(() => STADT.spiel.angemeldet && !STADT.spiel.beispiel), "angemeldet mit dem nachgebauten Server");

      /* A1 Standard */
      const m91 = await mitte(pg, 91), m92 = await mitte(pg, 92);
      const gleichStd = (m, nr) => !!m && Math.abs(m[0] - STANDARD[nr][0]) < 0.01 && Math.abs(m[1] - STANDARD[nr][1]) < 0.01 && Math.abs(m[2] - STANDARD[nr][2]) < 0.01 && Math.abs(m[3] - STANDARD[nr][3]) < 0.01;
      sage(gleichStd(m91, 91) && gleichStd(m92, 92), "ohne Speicherstand: Acker 91 hinter der Bäckerei (u −58, v −14, 16 × 24), Acker 92 auf seinem Ackerplatz (u " + STANDARD[92][0] + ", v " + STANDARD[92][1] + ")", JSON.stringify({ m91, m92 }));
      /* (erst hinschauen: die Bilder davor sind dann geladen und werden Bildpunkt genau gezählt) */
      const std = [];
      for (const [nr, m] of [[91, m91], [92, m92]]) {
        await blick(pg, [[m[0], m[1] + 12]], 5); await tick(pg, 1500); await ruhig(pg, pg);
        std.push(await pg.evaluate(([nr, m]) => { const D = STADT.dorf; return D.feldPruefen ? [nr, D.feldPruefen(nr, m[0], m[1])] : [nr, "keine Prüfung"]; }, [nr, m]));
      }
      sage(std.every((x) => x[1] === null), "beide Ackerplätze gelten als frei (dorf.js D.feldPruefen)", JSON.stringify(std));
      const wagenAn = (nr) => pg.evaluate((nr) => { const f = STADT.dorf.FELD_ORTE.find((q) => q.nr === nr), FW = STADT.fuhrwerk;
        const drin = (p) => { const u = p[0] - p[1], v = p[0] + p[1]; return u > f.u0 - 1 && u < f.u1 + 1 && v > f.v0 - 1 && v < f.v1 + 1; };
        return { feld: (FW.felder || []).some((q) => drin(q.mitte)), wagen: (FW.wagen || []).some((w) => w.feld && drin(w.feld.mitte)) }; }, nr);
      const w0 = [await wagenAn(91), await wagenAn(92)];
      sage(w0.every((x) => x.feld && x.wagen), "der Kornwagen lädt an beiden Äckern (Ladestellen unter dem Korn)", JSON.stringify(w0));

      /* A2 Tipp auf den Acker → Menü */
      await blick(pg, [[m91[0], m91[1]]], 7); await tick(pg, 900); await ruhig(pg, pg);
      let ap = null; for (let i = 0; i < 8 && !ap; i++) { ap = await ackerPunkt(pg, 91, 30); if (!ap) await tick(pg, 500); }
      if (ap) { await pg.mouse.click(ap.x, ap.y); await tick(pg, 600); }
      let km = await karteInfo(pg);
      sage(!!ap && !!km && km.am && /Getreidefeld/.test(km.titel) && km.vs && km.drin, "Tipp auf den Acker: Menü am Acker „Getreidefeld“ mit „Versetzen“, ganz im Bild", JSON.stringify({ ap, km: km && { titel: km.titel, am: km.am, vs: km.vs, drin: km.drin } }));
      if (BILD) await pg.screenshot({ path: path.join(BILD, "a1-menue.png") });

      /* A3 auf eine Straße/ein Haus → rot, abgelehnt, zurück */
      await klick(pg, '.lk-karte .lk-knopf[title="Versetzen"]'); await tick(pg, 400);
      const setzKarte = await karteInfo(pg);
      const ziel1 = await pg.evaluate(() => { const o = STADT.szene.objekte.find((x) => x.spiel === "baeckerei"); return [o.x - o.y, o.x + o.y]; });
      await blick(pg, [[m91[0], m91[1]], ziel1], 6); await tick(pg, 900); await ruhig(pg, pg);
      const a3 = await schirm(pg, m91[0], m91[1] + 4), b3 = await schirm(pg, ziel1[0], ziel1[1] + 2);
      await ziehen(pg, a3, b3); await tick(pg, 300);
      const rot = await pg.evaluate(() => { const o = STADT.oberflaeche.feldDing && STADT.oberflaeche.feldDing(91); return o ? { geist: !!o.geist, frei: o._frei, grund: o._grund } : null; });
      await pg.mouse.up(); await tick(pg, 200);
      if (BILD) await pg.screenshot({ path: path.join(BILD, "a2-rot.png") });
      await klick(pg, ".lk-karte .lk-gut"); await tick(pg, 500);
      const ans3 = await pg.evaluate(() => { const a = document.querySelector(".lk-ansage"); return a ? a.textContent : ""; });
      const m91b = await mitte(pg, 91);
      const gem3 = await pg.evaluate(() => { const v = JSON.parse(localStorage.getItem("leicht_verwalten_v1") || "null"); return v && v.felder ? v.felder : null; });
      sage(!!setzKarte && /Getreidefeld versetzen/.test(setzKarte.titel) && !!rot && rot.geist && rot.frei === false, "„Versetzen“: der Acker hängt am Finger; über der Bäckerei ist der Rahmen rot", JSON.stringify({ titel: setzKarte && setzKarte.titel, rot }));
      sage(/Hier geht kein Acker hin/.test(ans3) && gleichStd(m91b, 91) && !gem3, "„Setzen“ an der roten Stelle: abgelehnt mit Grund, der Acker rastet zurück, nichts gemerkt", JSON.stringify({ ans3, m91b, gem3 }));

      /* A4 auf freie Wiese → grün, gesetzt; alles geht mit */
      const ziel = await freieStelle(pg, 91, m91[0], m91[1] + 6, 22, 70);
      sage(!!ziel, "es gibt freie Wiese für den Acker in der Nähe (D.feldPruefen)", JSON.stringify(ziel));
      if (ziel) {
        await blick(pg, [[m91[0], m91[1]], ziel], 6); await tick(pg, 900); await ruhig(pg, pg);
        let p0 = null; for (let i = 0; i < 6 && !p0; i++) { p0 = await ackerPunkt(pg, 91, 30); if (!p0) await tick(pg, 400); }
        if (p0) { await pg.mouse.click(p0.x, p0.y); await tick(pg, 500); }
        await klick(pg, '.lk-karte .lk-knopf[title="Versetzen"]'); await tick(pg, 400);
        const weg0 = await pg.evaluate((m) => { const D = STADT.dorf; return D.ladestellen(91, m[0], m[1]).map(([x, y]) => STADT.boden.wert(x, y, 2)); }, m91).catch(() => null);
        const a4 = p0 ? { x: p0.x, y: p0.y } : await schirm(pg, m91[0], m91[1]), b4 = p0 ? await schirm(pg, ziel[0] + (p0.u - m91[0]), ziel[1] + (p0.v - m91[1])) : await schirm(pg, ziel[0], ziel[1]);
        await ziehen(pg, a4, b4, 24); await tick(pg, 300);
        const gruen = await pg.evaluate(() => { const o = STADT.oberflaeche.feldDing && STADT.oberflaeche.feldDing(91); return o ? { geist: !!o.geist, frei: o._frei, grund: o._grund } : null; });
        const zieh = await mitte(pg, 91);
        await pg.mouse.up(); await tick(pg, 200);
        if (BILD) await pg.screenshot({ path: path.join(BILD, "a3-gruen.png") });
        sage(!!gruen && gruen.geist && gruen.frei === true && !!zieh && Math.hypot(zieh[0] - m91[0], zieh[1] - m91[1]) > 15, "auf freier Wiese ist der Rahmen grün; das Korn folgt dem Finger schon beim Ziehen", JSON.stringify({ gruen, zieh }));
        sage(!!weg0 && weg0.every((x) => x < 0.1), "beim Ziehen bleibt am alten Platz kein brauner Ladefleck stehen", JSON.stringify(weg0));
        await klick(pg, ".lk-karte .lk-gut"); await tick(pg, 900);
        const ans4 = await pg.evaluate(() => { const a = document.querySelector(".lk-ansage"); return a ? a.textContent : ""; });
        const neu = await mitte(pg, 91);
        sage(/Gesetzt/.test(ans4) && !!neu && Math.hypot(neu[0] - zieh[0], neu[1] - zieh[1]) < 0.6 && Math.hypot(neu[0] - m91[0], neu[1] - m91[1]) > 15, "„Setzen“: „Gesetzt“, der Acker liegt am neuen Platz", JSON.stringify({ ans4, neu }));
        /* Korn, Tippfläche, Zeichen, Ladestelle, Kornwagen, Bäume */
        await blick(pg, [[m91[0], m91[1]], [neu[0], neu[1]]], 6); await tick(pg, 1500); await ruhig(pg, pg);
        const kh = await pg.evaluate(() => (STADT.korn ? STADT.korn.stufe(undefined, false).h : 0.95));
        const pNeu = await pixel(pg, neu[0], neu[1], kh), pAlt = await pixel(pg, m91[0], m91[1], kh);
        sage(korn(pNeu) && !korn(pAlt), "das Korn ist am neuen Platz gemalt, am alten nicht mehr", JSON.stringify({ pNeu, pAlt }));
        const tipp = await pg.evaluate(([neu, alt]) => { const O = STADT.oberflaeche, P = (u, v) => STADT.proj((u + v) / 2, (v - u) / 2, 0);
          const a = O.feldUnter ? O.feldUnter(...P(neu[0], neu[1])) : null, b = O.feldUnter ? O.feldUnter(...P(alt[0], alt[1])) : null; return { neu: a && a.nr, alt: b && b.nr }; }, [neu, m91]);
        sage(tipp.neu === 91 && tipp.alt == null, "die Tippfläche zum Ernten liegt am neuen Platz (am alten trifft der Finger keinen Acker mehr)", JSON.stringify(tipp));
        /* (die Zeichen gibt es nur im Spiel – geprüft in Teil B) */
        const lade = await pg.evaluate(([neu, alt]) => { const D = STADT.dorf, B = STADT.boden; return { neu: D.ladestellen(91, neu[0], neu[1]).map(([x, y]) => +B.wert(x, y, 2).toFixed(2)), alt: D.ladestellen(91, alt[0], alt[1]).map(([x, y]) => +B.wert(x, y, 2).toFixed(2)) }; }, [neu, m91]);
        sage(lade.neu.every((x) => x > 0.9) && lade.alt.every((x) => x < 0.1), "die Ladestellen des Kornwagens liegen unter dem neuen Acker, am alten Platz keine mehr", JSON.stringify(lade));
        const w1 = await wagenAn(91);
        sage(w1.feld && w1.wagen, "der Kornwagen findet den neuen Platz und lädt dort", JSON.stringify(w1));
        const baeume = await pg.evaluate(() => { const D = STADT.dorf; return STADT.szene.objekte.filter((o) => o.art === "natur" && !o.versetzt && D.feldNah(o.x, o.y)).length; });
        sage(baeume === 0, "kein Baum steht auf oder vor dem versetzten Acker", "Bäume: " + baeume);
        await tick(pg, 1800);
        const gem = await pg.evaluate(() => ({ server: (JSON.parse(sessionStorage.getItem("__srv874") || "null") || {}).verwalten, lokal: JSON.parse(localStorage.getItem("leicht_verwalten_v1") || "null"), rufe: [...new Set(window.__rufe874.map((r) => r.name))] }));
        const fs91 = gem.server && gem.server.felder && gem.server.felder["91"], fl91 = gem.lokal && gem.lokal.felder && gem.lokal.felder["91"];
        sage(!!fs91 && Math.hypot(fs91[0] - neu[0], fs91[1] - neu[1]) < 0.05 && !!fl91 && Math.hypot(fl91[0] - neu[0], fl91[1] - neu[1]) < 0.05,
          "gemerkt im Stand „verwalten“ (felder) – über spiel_stadt_leicht_speichern und im Browser", JSON.stringify({ server: fs91, lokal: fl91 }));
        sage(gem.rufe.every((n) => /^spiel_(ich|stadt_leicht_holen|stadt_leicht_speichern|autos)$/.test(n)), "kein anderer Serveraufruf (keine neue Tabelle)", JSON.stringify(gem.rufe));

        /* A5 Halten und Ziehen wie bei einem Haus */
        const ziel2 = await freieStelle(pg, 91, neu[0], neu[1], 8, 60);
        let hz = null;
        if (ziel2) {
          await blick(pg, [[neu[0], neu[1]], ziel2], 6); await tick(pg, 900); await ruhig(pg, pg);
          let p1 = null; for (let i = 0; i < 6 && !p1; i++) { p1 = await ackerPunkt(pg, 91, 30); if (!p1) await tick(pg, 400); }
          if (p1) {
            await pg.mouse.click(p1.x, p1.y); await tick(pg, 600);
            const offen = !!(await karteInfo(pg));
            /* das Menü kann über dem Acker liegen: einen Punkt suchen, der nicht unter dem Menü ist */
            const p2 = (await pg.evaluate(() => { const k = document.querySelector(".lk-karte"); const r = k && !k.hidden ? k.getBoundingClientRect() : null; return r && [r.left, r.top, r.right, r.bottom]; })) || null;
            let q = p1;
            if (p2 && q.x > p2[0] - 4 && q.x < p2[2] + 4 && q.y > p2[1] - 4 && q.y < p2[3] + 4) q = await pg.evaluate(([r]) => { const K = STADT.kamera, SZ = STADT.szene, f = STADT.dorf.FELD_ORTE.find((q) => q.nr === 91);
              for (let i = 1; i < 10; i++) for (let j = 1; j < 10; j++) { const u = f.u0 + (f.u1 - f.u0) * i / 10, v = f.v0 + (f.v1 - f.v0) * j / 10, P = STADT.proj((u + v) / 2, (v - u) / 2, 0), x = P[0] / K.dpr, y = P[1] / K.dpr;
                if (x > r[0] - 6 && x < r[2] + 6 && y > r[1] - 6 && y < r[3] + 6) continue; if (SZ.treffer(P[0], P[1])) continue; const e = document.elementFromPoint(x, y); if (!e || e.id !== "lDinge") continue; return { x: x, y: y, u: u, v: v }; }
              return null; }, [p2]);
            if (q) {
              const brumm0 = await pg.evaluate(() => window.__brumm.length);
              const b = await schirm(pg, ziel2[0] + (q.u - neu[0]), ziel2[1] + (q.v - neu[1]));
              await pg.mouse.move(q.x, q.y); await pg.mouse.down(); await tick(pg, 900);
              const oben = await pg.evaluate((b0) => { const g = STADT.oberflaeche.gehoben && STADT.oberflaeche.gehoben(); return { geh: !!g && g.art === "feld", brumm: window.__brumm.slice(b0) }; }, brumm0);
              for (let i = 1; i <= 16; i++) { await pg.mouse.move(q.x + (b.x - q.x) * i / 16, q.y + (b.y - q.y) * i / 16); await tick(pg, 30); }
              await pg.mouse.up(); await tick(pg, 900);
              const ans5 = await pg.evaluate(() => { const a = document.querySelector(".lk-ansage"); return a ? a.textContent : ""; });
              hz = { offen, oben, ans5, neu2: await mitte(pg, 91), menue: await karteInfo(pg) };
            }
          }
        }
        if (!hz) console.log("    (Halten: " + JSON.stringify({ ziel2 }) + ")");
        sage(!!hz && hz.offen && hz.oben.geh && hz.oben.brumm.length > 0, "Menü offen, Finger ruhig auf dem Acker: kurzes Brummen, der Acker ist angehoben (wie ein Haus)", JSON.stringify(hz && { offen: hz.offen, oben: hz.oben }));
        sage(!!hz && /Gesetzt/.test(hz.ans5) && !!hz.neu2 && Math.hypot(hz.neu2[0] - ziel2[0], hz.neu2[1] - ziel2[1]) < 3 && !!hz.menue && hz.menue.am && /Getreidefeld/.test(hz.menue.titel),
          "… ziehen und loslassen: „Gesetzt“ am neuen Platz, danach das Menü am Acker", JSON.stringify(hz && { ans5: hz.ans5, neu2: hz.neu2, ziel2, menue: hz.menue && hz.menue.titel }));
        const gesetzt = (hz && hz.neu2) || neu;

        /* A6 Neuladen wie ein anderes Gerät (nur der Server) */
        await tick(pg, 1800);
        await pg.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
        await laden();
        const nach = await mitte(pg, 91), w2 = await wagenAn(91);
        const lade2 = await pg.evaluate((m) => STADT.dorf.ladestellen(91, m[0], m[1]).map(([x, y]) => +STADT.boden.wert(x, y, 2).toFixed(2)), nach || gesetzt).catch(() => null);
        sage(!!nach && Math.hypot(nach[0] - gesetzt[0], nach[1] - gesetzt[1]) < 0.05 && w2.wagen && !!lade2 && lade2.every((x) => x > 0.9), "nach Neuladen (anderes Gerät, nur der Server): der Acker liegt am neuen Platz, der Kornwagen lädt dort", JSON.stringify({ nach, gesetzt, w2, lade2 }));
        const n92 = await mitte(pg, 92);
        sage(gleichStd(n92, 92), "der andere Acker (92) blieb auf seinem Ackerplatz", JSON.stringify(n92));

        /* A7 Zurück auf den Ackerplatz */
        await blick(pg, [[nach[0], nach[1]]], 7); await tick(pg, 900); await ruhig(pg, pg);
        let p3 = null; for (let i = 0; i < 6 && !p3; i++) { p3 = await ackerPunkt(pg, 91, 30); if (!p3) await tick(pg, 400); }
        if (p3) { await pg.mouse.click(p3.x, p3.y); await tick(pg, 500); }
        km = await karteInfo(pg);
        const hatZurueck = !!km && km.zurueck;
        await klick(pg, '.lk-karte .lk-knopf[title="Zurück auf den Ackerplatz"]'); await tick(pg, 1800);
        const z91 = await mitte(pg, 91), zg = await pg.evaluate(() => { const s = (JSON.parse(sessionStorage.getItem("__srv874") || "null") || {}).verwalten; return s && s.felder ? s.felder : null; });
        sage(hatZurueck && gleichStd(z91, 91) && !(zg && zg["91"]), "„Zurück auf den Ackerplatz“: wieder hinter der Bäckerei, nichts mehr gemerkt", JSON.stringify({ hatZurueck, z91, zg }));
      }

      /* A8 langes Drücken (wie bei Häusern) */
      await klick(pg, '.lk-karte .lk-knopf[title="Schließen"]'); await tick(pg, 300);
      await pg.evaluate(() => { STADT.oberflaeche.langMs = 1200; });
      const m91c = await mitte(pg, 91);
      await blick(pg, [[m91c[0], m91c[1]]], 7); await tick(pg, 900); await ruhig(pg, pg);
      let p4 = null; for (let i = 0; i < 6 && !p4; i++) { p4 = await ackerPunkt(pg, 91, 30); if (!p4) await tick(pg, 400); }
      let lang = null;
      if (p4) { const cdp = await ctx.newCDPSession(pg), t0 = Date.now() / 1000;
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p4.x, y: p4.y, id: 1 }], timestamp: t0 }); await tick(pg, 2000);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: t0 + 2.01 }); await tick(pg, 600);
        lang = await karteInfo(pg); }
      sage(!!lang && lang.am && /Getreidefeld/.test(lang.titel) && lang.vs, "langes Drücken auf den Acker: Bearbeiten-Menü am Acker mit „Versetzen“", JSON.stringify(lang && { titel: lang.titel, vs: lang.vs }));
      await ctx.close();
    }

    /* ======================= B: kleiner Rahmen ======================= */
    if (NUR.indexOf("B") >= 0) {
      for (const [W, H] of [[360, 225], [280, 175]]) {
        console.log("\nTEIL B — kleiner Rahmen " + W + " × " + H + " im Spiel (Telefon hochkant), Beispielstadt\n");
        const ctx = await handy();
        await ctx.route(/cdn\.jsdelivr\.net/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "window.supabase=null;" }));
        const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
        pg.on("pageerror", (e) => seitenFehler.push("B: " + String(e.message || e)));
        const oeffnen = async () => {
          await pg.goto(basis + "/__rahmen874-" + W + "x" + H + ".html", { waitUntil: "load" });
          const fr = await (await pg.$("#f")).contentFrame();
          await fr.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
          await fr.waitForFunction(() => !!window.STADT.korn, null, { timeout: 20000 }).catch(() => {});
          await fr.waitForFunction(() => !document.getElementById("lLade") && !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
          await tick(pg, 2500);
          return fr;
        };
        let fr = await oeffnen();
        await fr.evaluate(() => { try { localStorage.removeItem("leicht_verwalten_v1"); } catch (e) {} });
        fr = await oeffnen();
        const off = await pg.evaluate(() => { const r = document.getElementById("f").getBoundingClientRect(); return { l: r.left, t: r.top }; });
        /* die Zeichen, die das Spiel schickt (wie bei Xander: See, Wald, Jagd, Mühle, Äcker, Krankenhaus …) */
        const ZEICHEN = { muehle: ["fertig", "4 Mehl", "mehl"], baeckerei: ["laeuft", "Brot 2:10", "brot"], see: ["laeuft", "Fisch 2:10", "fisch"], wald: ["laeuft", "Holz 1:10", "holz"], jagd: ["fertig", "2 Fleisch", "fleisch"],
          feld91: ["fertig", "2 Getreide", "getreide"], feld92: ["fertig", "2 Getreide", "getreide"], krankenhaus: ["fertig", "1 Heiltrank", ""], kuhstall: ["fertig", "3 Milch", "milch"], huehnerstall: ["fertig", "5 Eier", "ei"], labor: ["laeuft", "Forschung 3:00", ""] };
        const zeichenSchicken = (z) => pg.evaluate((z) => { document.getElementById("f").contentWindow.postMessage({ typ: "leicht-zeichen", z: z }, location.origin); }, z);
        await zeichenSchicken(ZEICHEN); await tick(pg, 1200);
        /* bequem: der Acker ganz im Bild, die größte freie Tippfläche – ein Quadrat, in dem jeder Tipp den Acker trifft: auf dem
           Acker oder bis 10 px daneben (FASSUNG 874), dort kein Knopf, kein Zeichen, kein Haus, kein Baum */
        const bequem = (nr, nurAcker) => fr.evaluate(([nr, nurAcker]) => {
          const K = STADT.kamera, SZ = STADT.szene, f = STADT.dorf.FELD_ORTE.find((q) => q.nr === nr), W = innerWidth, H = innerHeight;
          const P = (u, v) => { const p = STADT.proj((u + v) / 2, (v - u) / 2, 0); return [p[0] / K.dpr, p[1] / K.dpr]; };
          const ecken = [P(f.u0, f.v0), P(f.u1, f.v0), P(f.u1, f.v1), P(f.u0, f.v1)];
          const ganz = ecken.every((e) => e[0] >= 2 && e[1] >= 2 && e[0] <= W - 2 && e[1] <= H - 2);
          const abst = (x, y) => { let innen = true, d = 1e9; for (let i = 0; i < 4; i++) { const A = ecken[i], B = ecken[(i + 1) % 4], ex = B[0] - A[0], ey = B[1] - A[1], l2 = ex * ex + ey * ey || 1;
            if (ex * (y - A[1]) - ey * (x - A[0]) < 0) innen = false; const t = Math.max(0, Math.min(1, ((x - A[0]) * ex + (y - A[1]) * ey) / l2)); d = Math.min(d, Math.hypot(x - A[0] - ex * t, y - A[1] - ey * t)); } return innen ? 0 : d; };
          /* (das eigene Zeichen des Ackers zählt mit: ein Tipp darauf erntet ihn; fremde Knöpfe und Zeichen brauchen 10 px Luft –
             das Handy rückt einen Tipp daneben auf den Knopf) */
          const eigen = nurAcker ? null : document.querySelector('.lk-zeichen[data-g="feld' + nr + '"]');
          const fremd = [...document.querySelectorAll("button, .lk-zeichen, .lk-kopfzeile > *")].filter((b) => b !== eigen && !(eigen && eigen.contains(b)) && getComputedStyle(b).display !== "none" && getComputedStyle(b).visibility !== "hidden").map((b) => b.getBoundingClientRect()).filter((r) => r.width > 0);
          const frei = (x, y) => { if (x < 0 || y < 0 || x > W || y > H) return false; const e = document.elementFromPoint(x, y); if (!e) return false;
            if (fremd.some((r) => x > r.left - 10 && x < r.right + 10 && y > r.top - 10 && y < r.bottom + 10)) return false;
            if (eigen && e.closest && e.closest('.lk-zeichen[data-g="feld' + nr + '"]')) return true;
            return e.id === "lDinge" && abst(x, y) <= 9 && !SZ.treffer(x * K.dpr, y * K.dpr); };
          let best = null;
          const xs = ecken.map((e) => e[0]), ys = ecken.map((e) => e[1]);
          for (let y = Math.min(...ys) - 8; y <= Math.max(...ys) + 8; y += 1) for (let x = Math.min(...xs) - 8; x <= Math.max(...xs) + 8; x += 1) {
            if (!frei(x, y)) continue;
            let r = 0; for (let k = 1; k < 30; k++) { let ok = true; for (let t = -k; t <= k && ok; t += Math.max(1, k / 3)) ok = frei(x + t, y - k) && frei(x + t, y + k) && frei(x - k, y + t) && frei(x + k, y + t); if (!ok) break; r = k; }
            if (!best || r > best.r) best = { x: Math.round(x), y: Math.round(y), r: r };
          }
          return { ganz: ganz, ecken: ecken.map((e) => e.map(Math.round)), seite: best ? 2 * best.r + 1 : 0, punkt: best };
        }, [nr, !!nurAcker]);
        for (const nr of [92, 91]) {
          const bq = await bequem(nr);
          sage(bq.ganz && bq.seite >= 15, "Überblick mit den Zeichen des Spiels: Acker " + nr + " liegt ganz im Bild, mit freier Tippfläche (Quadrat " + bq.seite + " px ≥ 15 px, ein Finger darf ±7 px danebengehen; kein fremdes Zeichen oder Knopf bis 10 px daneben, kein Haus, kein Baum)", JSON.stringify(bq));
          await pg.evaluate(() => { window.__msgs.length = 0; });
          if (process.env.DEBUG && bq.punkt) console.log("    (vor dem Tipp: " + JSON.stringify(await fr.evaluate((p) => { const e = document.elementFromPoint(p.x, p.y), K = STADT.kamera, o = STADT.szene.treffer(p.x * K.dpr, p.y * K.dpr); return { e: e && (e.id || e.className), o: o && (o.name || o.bild), zeichen: [...document.querySelectorAll(".lk-zeichen")].map((z) => { const r = z.getBoundingClientRect(); return z.dataset.g + ":" + [r.left, r.top, r.right, r.bottom].map(Math.round).join(","); }) }; }, bq.punkt)) + ")");
          if (bq.punkt) { await pg.touchscreen.tap(off.l + bq.punkt.x, off.t + bq.punkt.y); await tick(pg, 900); }
          const ms = await pg.evaluate(() => window.__msgs.filter((m) => m && /^leicht-(feld|haus|baum)$/.test(m.typ)).map((m) => m.typ + ":" + (m.nr || m.g || "") + (m.zeichen ? "(zeichen)" : "") + (m.klein ? "(klein)" : "")));
          sage(ms.length === 1 && ms[0] === "leicht-feld:" + nr, "… ein Tipp darauf erntet im Spiel (leicht-feld " + nr + ")", JSON.stringify(ms));
          await zeichenSchicken(ZEICHEN); await tick(pg, 3000);   // (das geerntete Zeichen kommt zurück, wie wenn das Spiel den alten Stand schickt)
        }
        if (BILD) await pg.screenshot({ path: path.join(BILD, "b-ueberblick-" + W + ".png"), clip: { x: 0, y: off.t - 10, width: W, height: H + 20 } });
        /* langes Drücken auf den rechten Acker im Überblick → Menü mit „Versetzen" im Rahmen */
        await fr.evaluate(() => { STADT.oberflaeche.langMs = 1200; });
        const bq92 = await bequem(92, true);   // (auf dem Acker selbst, nicht auf seinem Zeichen)
        let lm = null;
        if (bq92.punkt) { const cdp = await ctx.newCDPSession(pg), t0 = Date.now() / 1000, x = off.l + bq92.punkt.x, y = off.t + bq92.punkt.y;
          await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x, y: y, id: 1 }], timestamp: t0 }); await tick(pg, 2000);
          await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: t0 + 2.01 }); await tick(pg, 1200);
          lm = await karteInfo(fr); }
        if (!lm) console.log("    (langes Drücken: " + JSON.stringify({ bq92, karte: await fr.evaluate(() => { const k = document.querySelector(".lk-karte"); return k ? { hidden: k.hidden, t: k.textContent.slice(0, 60) } : null; }), msgs: await pg.evaluate(() => window.__msgs.slice(-4)) }) + ")");
        sage(!!lm && /Getreidefeld/.test(lm.titel) && lm.vs && lm.drin, "langes Drücken auf den rechten Acker: Menü „Getreidefeld“ mit „Versetzen“, ganz im Rahmen", JSON.stringify(lm && { titel: lm.titel, vs: lm.vs, drin: lm.drin, r: lm.r }));
        if (BILD) await pg.screenshot({ path: path.join(BILD, "b-menue-" + W + ".png"), clip: { x: 0, y: off.t - 10, width: W, height: H + 20 } });
        /* versetzt (Beispielstadt: im Browser gemerkt) – Tipp am neuen Platz erntet, Zeichen dort, nach Neuladen noch dort */
        if (lm && lm.vs) {
          await klick(fr, '.lk-karte .lk-knopf[title="Versetzen"]'); await tick(pg, 600);
          const m = await mitte(fr, 92), ziel = await freieStelle(fr, 92, m[0] - 4, m[1] + 4, 10, 40);
          /* (das Ziehen mit dem Finger prüft Teil A; hier zählt, was am neuen Platz geschieht – der Geist wird dorthin gestellt) */
          const p = await fr.evaluate(([u, v]) => { const o = STADT.oberflaeche.feldDing(92); if (!o || !o.geist) return false; o.x = (u + v) / 2; o.y = (v - u) / 2; return true; }, ziel || m);
          await klick(fr, ".lk-karte .lk-gut"); await tick(pg, 1200);
          const neu = await mitte(fr, 92);
          sage(!!ziel && p && !!neu && Math.hypot(neu[0] - ziel[0], neu[1] - ziel[1]) < 2.5, "im Rahmen versetzt: Acker 92 liegt am neuen Platz", JSON.stringify({ ziel, neu }));
          await fr.evaluate(() => { if (STADT.oberflaeche.zurStartAnsicht) STADT.oberflaeche.zurStartAnsicht(false); }); await tick(pg, 1500);
          const bq2 = await bequem(92, true);
          await pg.evaluate(() => { window.__msgs.length = 0; });
          if (bq2.punkt) { await pg.touchscreen.tap(off.l + bq2.punkt.x, off.t + bq2.punkt.y); await tick(pg, 900); }
          const ms2 = await pg.evaluate(() => window.__msgs.filter((m) => m && /^leicht-(feld|haus|baum)$/.test(m.typ)).map((m) => m.typ + ":" + (m.nr || m.g || "")));
          sage(ms2.length === 1 && ms2[0] === "leicht-feld:92", "der Tipp am neuen Platz erntet (leicht-feld 92)", JSON.stringify({ bq2: bq2.punkt, ms2 }));
          await pg.evaluate(() => { const f = document.getElementById("f"); f.contentWindow.postMessage({ typ: "leicht-zeichen", z: { feld92: ["fertig", "3 Getreide", "getreide"] } }, location.origin); });
          await tick(pg, 900);
          const zei = await fr.evaluate(([neu, alt]) => { const b = document.querySelector('.lk-zeichen[data-g="feld92"]'); if (!b || getComputedStyle(b).display === "none") return null; const r = b.getBoundingClientRect(), K = STADT.kamera;
            const P = (u, v) => { const p = STADT.proj((u + v) / 2, (v - u) / 2, 0); return [p[0] / K.dpr, p[1] / K.dpr]; }, x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
            return { neu: Math.round(Math.hypot(x - P(neu[0], neu[1])[0], y - P(neu[0], neu[1])[1])), alt: Math.round(Math.hypot(x - P(alt[0], alt[1])[0], y - P(alt[0], alt[1])[1])) }; }, [neu, m]);
          sage(!!zei && zei.neu <= zei.alt, "das Zeichen des Ackers steht am neuen Platz", JSON.stringify(zei));
          if (BILD) await pg.screenshot({ path: path.join(BILD, "b-versetzt-" + W + ".png"), clip: { x: 0, y: off.t - 10, width: W, height: H + 20 } });
          fr = await oeffnen();
          const nach = await mitte(fr, 92);
          sage(!!nach && !!neu && Math.hypot(nach[0] - neu[0], nach[1] - neu[1]) < 0.05, "nach Neuladen (Beispielstadt, im Browser gemerkt) liegt er noch dort", JSON.stringify({ neu, nach }));
          await fr.evaluate(() => { try { localStorage.removeItem("leicht_verwalten_v1"); } catch (e) {} });
          fr = await oeffnen();
          sage(gleichStd2(await mitte(fr, 92), 92), "ohne Speicherstand wieder auf dem Ackerplatz", "");
        }
        await ctx.close();
      }
    }
  } catch (e) { sage(false, "Sonde abgebrochen", String(e && e.stack || e).split("\n").slice(0, 3).join(" | ")); }
  sage(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " FEHLER" : "\nALLES GUT");
  process.exit(fehler ? 1 : 0);

  function gleichStd2(m, nr) { return !!m && Math.abs(m[0] - STANDARD[nr][0]) < 0.01 && Math.abs(m[1] - STANDARD[nr][1]) < 0.01; }
  async function sessionStorageLeeren(pg, basis) { await pg.goto(basis + "/stadt-leicht/leicht.css"); await pg.evaluate(() => { try { sessionStorage.clear(); localStorage.clear(); } catch (e) {} }); }
})().catch((e) => { console.error(e); process.exit(2); });
