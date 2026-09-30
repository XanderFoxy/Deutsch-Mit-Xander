#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 822: HÄUSER VERSETZEN BLEIBT, ZWEITES GEBÄUDE KLAR,
   KLEINES MENÜ AM DING (AUCH IM KLEINEN RAHMEN)
   ---------------------------------------------------------------------
   XANDER: „wenn ich auf der großen Ansicht mein Kuhstall … einen neuen
   bauen will, baut er gar keinen neuen, sondern er orientiert sich an
   meinem alten und wo ich ihn hinziehe, schnippst der plötzlich wieder
   zurück" – „guck auch, dass ich Häuser wirklich versetzen kann".
   „ich möchte im kleinen Menü einen Baum rausnehmen und bin jetzt ein
   gezoomt … Ich hab jetzt kein Menü … der Baum ist halt direkt noch vorm
   Rathaus kriegt den da nicht weg" – „dieses einfache Menü haben am Haus
   selber".
   Geprüft (360 × 740, Finger, angemeldet mit nachgebautem Server – der
   Stand von spiel_stadt_leicht_speichern liegt in sessionStorage, die
   Speicher des Browsers werden vor dem Neuladen geleert = anderes Gerät):
   A  Bauen → Kuhstall sagt „hast du schon – versetzen?", kein spiel_bauen;
      das Menü sitzt am Haus; Versetzen, ziehen, Setzen; ein Neuaufbau
      (Spielstand vom Spiel) lässt das Haus stehen; nach Neuladen steht es
      noch dort; das Menü wirkt nach einem Neuaufbau auf das neue Haus;
      der leere alte Bauplatz sagt „steht schon", statt zu bauen.
   B  Großes Bild: Tipp auf einen Baum → kleines Menü am Baum (verdeckt
      ihn nicht, ganz im Bild) → Entfernen; bleibt nach Neuaufbau und
      Neuladen weg.
   C  Kleiner Rahmen (360 × 225 im Spiel): im Überblick bleibt der Baum-
      Tipp wie bisher (Wald-Station); mit dem Kompass nah → Menü am Baum,
      kein „leicht-haus wald", passt in den Rahmen, Knöpfe ≥ 30 px →
      Entfernen entfernt ihn; Tipp aufs Haus: Spiel bekommt den Tipp und
      das Menü hat „Versetzen".
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/pruefe-822-versetzen-menue.js
           (BILD=/pfad für Bildschirmfotos; ALT=/pfad mit leicht.min.js und leicht.css für die Gegenprobe)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const ALT = process.env.ALT || "", BILD = process.env.BILD || "";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

const RAHMEN = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;background:#223}iframe{border:0;width:360px;height:225px;display:block;margin-top:120px}</style></head><body>
<iframe id="f" src="/stadt-leicht.html?eingebettet=1&mini=1&zeit=tag&jahr=sommer"></iframe>
<script>window.__msgs=[];addEventListener("message",function(e){window.__msgs.push(e.data);});</script></body></html>`;

/* nachgebauter Server: angemeldet, Kuhstall steht schon (Stufe 2) */
const FALSCH = `(function(){
  /* wie bei Xander: es liegt schon ein gespeicherter Stand auf dem Server (Schmuck, Lage) – erst dann kam das Zurückschnappen */
  function srv(){ try { return JSON.parse(sessionStorage.getItem("__srv822") || "null") || { v: 1, deko: [], lage: {} }; } catch (e) { return null; } }
  window.__rufe822 = [];
  var ich = { id: "u822", name: "Xander", dorf_name: "Prüfstadt", punkte: 900, level: 12,
    dorf: { rathaus: { stufe: 3, lp: 60 }, kuhstall: { stufe: 2, lp: 40 }, huehnerstall: { stufe: 1, lp: 20 }, baeckerei: { stufe: 2, lp: 40 }, muehle: { stufe: 1, lp: 20 }, schule: { stufe: 1, lp: 20 }, gasthaus: { stufe: 1, lp: 20 } },
    dorf_plan: {}, baustellen: [], volk: { wunder: {} } };
  var klient = {
    auth: { getSession: function () { return Promise.resolve({ data: { session: { user: { id: "u822" } } } }); } },
    from: function () { var k = { select: function () { return k; }, eq: function () { return k; }, maybeSingle: function () { return Promise.resolve({ data: { is_owner: false } }); } }; return k; },
    rpc: function (name, args) {
      window.__rufe822.push({ name: name, args: args });
      var d = { ok: true };
      if (name === "spiel_ich") d = JSON.parse(JSON.stringify(ich));
      else if (name === "spiel_stadt_leicht_holen") d = srv();
      else if (name === "spiel_stadt_leicht_speichern") { sessionStorage.setItem("__srv822", JSON.stringify(args.p_daten)); d = { ok: true }; }
      else if (name === "spiel_autos") d = { autos: [] };
      return Promise.resolve({ data: d, error: null });
    }
  };
  window.supabase = { createClient: function () { return klient; } };
})();`;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/__rahmen822.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(RAHMEN); }
    if (ALT && (p === "/stadt-leicht/leicht.min.js" || p === "/stadt-leicht/leicht.css")) { a.writeHead(200, { "Content-Type": TYP[path.extname(p)] }); return fs.createReadStream(path.join(ALT, path.basename(p))).pipe(a); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  await ctx.route(/supabase-js@2\/dist\/umd\/supabase\.js/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: FALSCH }));
  /* navigator.vibrate mitschreiben (Haptik beim Halten) */
  await ctx.addInitScript(() => { window.__brumm = []; try { Object.defineProperty(navigator, "vibrate", { configurable: true, value: (ms) => { window.__brumm.push(ms); return true; } }); } catch (e) {} });
  const pg = await ctx.newPage();
  pg.setDefaultTimeout(120000);
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e) + (process.env.STAPEL ? " @ " + String(e.stack || "").split("\n").slice(1, 4).join(" | ") : "")));
  const tick = (ms) => pg.waitForTimeout(ms);
  /* unter Last: warten, bis die Kamera steht (kein Flug mehr) */
  /* (ein Bild kann unter Last länger als 150 ms dauern: erst vier gleiche Blicke in Folge zählen als ruhig) */
  const ruhig = async (f) => { const w = f || pg; let alt = "", gleich = 0; for (let i = 0; i < 80; i++) { const k = await w.evaluate(() => { const K = STADT.kamera; return [K.x, K.y, K.s].map((v) => v.toFixed(3)).join(); }); gleich = k === alt ? gleich + 1 : 0; if (gleich >= 3) return; alt = k; await pg.waitForTimeout(250); } };
  const bis = async (fn, arg, ms) => { const t0 = Date.now(); let r = null; while (Date.now() - t0 < (ms || 8000)) { r = await pg.evaluate(fn, arg); if (r) return r; await pg.waitForTimeout(200); } return r; };
  if (BILD) fs.mkdirSync(BILD, { recursive: true });

  const laden = async () => {
    await pg.goto(basis + "/stadt-leicht.html?zeit=tag&jahr=sommer&leute=0" + (process.env.QUELLE ? "&quelle=1" : ""), { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 60000 }).catch(() => {});
    await tick(600);
  };
  await laden();
  sage(await pg.evaluate(() => window.STADT.spiel.angemeldet && !window.STADT.spiel.beispiel), "angemeldet mit dem nachgebauten Server");

  /* ---------------- A: Kuhstall ---------------- */
  const stall = () => pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"); return o && { x: +o.x.toFixed(2), y: +o.y.toFixed(2), px: o.platzX, py: o.platzY }; });
  const s0 = await stall();
  await pg.evaluate(() => document.querySelector(".lk-bauen").click());
  await tick(400);
  const eintrag = await pg.evaluate(() => { const b = [...document.querySelectorAll(".lk-bauleiste .lk-karte-klein")].find((b) => /Kuhstall/.test(b.textContent)); return b && b.textContent; });
  sage(/hast du schon/i.test(eintrag || "") && /versetzen/i.test(eintrag || ""), "Bauen → Kuhstall sagt „hast du schon – versetzen?“", JSON.stringify(eintrag));
  const bau0 = await pg.evaluate(() => window.__rufe822.filter((r) => r.name === "spiel_bauen").length);
  await pg.evaluate(() => [...document.querySelectorAll(".lk-bauleiste .lk-karte-klein")].find((b) => /Kuhstall/.test(b.textContent)).click());
  await tick(900); await ruhig();
  if (process.env.DEBUG) console.log(await pg.evaluate(() => { const K = STADT.kamera, o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"), P = STADT.proj(o.x, o.y, 0); return JSON.stringify({ K: [K.x, K.y, K.s, K.dreh], P: [P[0] / K.dpr, P[1] / K.dpr], o: [o.x, o.y] }); }));
  let menueA = null; for (let i = 0; i < 10 && !(menueA && menueA.drin); i++) { if (i) await tick(300); menueA = await pg.evaluate(() => { const k = document.querySelector(".lk-karte"); if (!k || k.hidden) return null; const r = k.getBoundingClientRect();
    return { t: k.textContent, am: k.classList.contains("lk-am-ding"), vs: !!k.querySelector(".lk-versetzen-text"), drin: r.left >= 0 && r.right <= innerWidth + 0.5 && r.top >= 0 && r.bottom <= innerHeight + 0.5, w: Math.round(r.width), r: [r.left, r.top, r.right, r.bottom].map(Math.round), vis: k.style.visibility, tf: k.style.transform }; }); }
  sage(!!menueA && /Hast du schon/.test(menueA.t) && menueA.vs && (await pg.evaluate(() => window.__rufe822.filter((r) => r.name === "spiel_bauen").length)) === bau0,
    "Tipp auf den Eintrag: Hinweis „ein zweiter geht nicht“ und „Versetzen“ – nichts wird gebaut", JSON.stringify(menueA && { t: menueA.t.slice(0, 90), vs: menueA.vs }));
  sage(!!menueA && menueA.am && menueA.drin, "das Menü sitzt klein am Haus und ganz im Bild", JSON.stringify(menueA && { am: menueA.am, drin: menueA.drin, w: menueA.w, r: menueA.r, vis: menueA.vis, tf: menueA.tf }));
  if (BILD) await pg.screenshot({ path: path.join(BILD, "a-kuhstall-menue.png") });
  await pg.evaluate(() => { const b = document.querySelector(".lk-versetzen-text") || document.querySelector('.lk-karte .lk-knopf[title="Versetzen"]'); if (b) b.click(); });
  await tick(300);
  /* mit dem Finger (Maus) am Haus ziehen */
  await ruhig();
  const zug = await bis(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"); if (!o || !o.geist) return null; const P = STADT.proj(o.x, o.y, 2); return { x: P[0] / STADT.kamera.dpr, y: P[1] / STADT.kamera.dpr }; });
  if (zug) { await pg.mouse.move(zug.x, zug.y); await pg.mouse.down(); for (let i = 1; i <= 20; i++) { await pg.mouse.move(zug.x + 7 * i, zug.y - 6 * i); await tick(20); } await pg.mouse.up(); await tick(200); }
  await pg.evaluate(() => { const b = document.querySelector(".lk-karte .lk-gut"); if (b) b.click(); });
  await tick(300);
  const s1 = await stall();
  const bewegt = s1 && s0 && Math.hypot(s1.x - s0.x, s1.y - s0.y) > 3;
  sage(!!zug && bewegt, "Versetzen: das Haus folgt dem Finger und steht nach „Setzen“ am neuen Ort", JSON.stringify({ zug, s0, s1 }));
  /* das Spiel schickt einen neuen Stand (wie ständig im Spiel) → Neuaufbau */
  await pg.evaluate(() => STADT.leicht.aufbauen());
  await tick(200);
  const s2 = await stall();
  sage(bewegt && s2 && Math.abs(s2.x - s1.x) < 0.05 && Math.abs(s2.y - s1.y) < 0.05, "nach einem Neuaufbau (Spielstand vom Spiel) schnappt es NICHT zurück", JSON.stringify({ s1, s2 }));
  /* Menü offen, dann Neuaufbau, dann Versetzen: wirkt auf das Haus in der Stadt */
  await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"); STADT.szene.auswahl = null; });
  const hp = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"); const K = STADT.kamera; K.x = o.x; K.y = o.y + 3; K.s = 14 * K.dpr; STADT.leicht.unruhe = 3; return 1; });
  await tick(600); await ruhig();
  const hausPunkt = await bis(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"), K = STADT.kamera, P = STADT.proj(o.x, o.y, 0);
    for (let dy = 4; dy < 200; dy += 4) for (const dx of [0, -8, 8, -16, 16]) { const x = P[0] + dx * K.dpr, y = P[1] - dy * K.dpr; if (STADT.szene.treffer(x, y) === o) { const cx = x / K.dpr, cy = y / K.dpr; const e = document.elementFromPoint(cx, cy); if (e && e.id === "lDinge") return { x: cx, y: cy }; } } return null; });
  if (hausPunkt) { await pg.mouse.click(hausPunkt.x, hausPunkt.y); await tick(400); }
  await pg.evaluate(() => STADT.leicht.aufbauen());
  await tick(300);
  await pg.evaluate(() => { const b = document.querySelector('.lk-karte:not([hidden]) .lk-knopf[title="Versetzen"]'); if (b) b.click(); });
  await tick(300);
  const echt = await pg.evaluate(() => { const g = STADT.szene.objekte.find((o) => o.geist); return { geistDrin: !!g && g.spiel === "kuhstall" }; });
  sage(!!hausPunkt && echt.geistDrin, "Menü offen, Stadt baut neu auf, dann „Versetzen“: es wirkt auf den Kuhstall, der in der Stadt steht", JSON.stringify({ hausPunkt, echt }));
  await pg.evaluate(() => { const b = document.querySelector('.lk-karte .lk-knopf[title="Abbrechen"]'); if (b) b.click(); });
  await tick(200);
  /* Neuladen wie auf einem anderen Gerät (Browser-Speicher leer, nur der Server) */
  await tick(1600);
  await pg.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await laden();
  const s3 = await stall();
  sage(bewegt && s3 && Math.abs(s3.x - s1.x) < 0.05 && Math.abs(s3.y - s1.y) < 0.05, "nach Neuladen (anderes Gerät, nur der Server) steht der Kuhstall am neuen Ort", JSON.stringify({ s1, s3 }));
  /* der alte Bauplatz ist leer: er sagt „steht schon“, statt den alten Stall auszubauen */
  /* (der Kuhstall-Hof samt Weide ist breit: für diese Prüfung das Haus ein gutes Stück weiter weg stellen) */
  await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"); o.x = o.platzX - 30; o.y = o.platzY - 20; STADT.szene.geaendert(); });
  await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"); const K = STADT.kamera; K.x = o.platzX; K.y = o.platzY + 2; K.s = 12 * K.dpr; STADT.leicht.unruhe = 3; });
  await tick(800);
  const platzText = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "kuhstall"), P = STADT.proj(o.platzX, o.platzY, 0); STADT.oberflaeche.tippen(P[0], P[1]); const k = document.querySelector(".lk-karte"); return k && !k.hidden ? k.textContent : "(keine Karte)"; });
  sage(/steht schon/.test(platzText) && !/Bauen/.test(platzText), "der leere alte Bauplatz sagt „steht schon – nur versetzt“ statt „Bauen“", JSON.stringify(platzText.slice(0, 90)));
  await pg.evaluate(() => { const b = document.querySelector('.lk-karte .lk-knopf[title="Schließen"]'); if (b) b.click(); });

  /* ---------------- D: Halten und Ziehen, Dreh-Schieber ---------------- */
  /* Koordinator (Xander): „wenn es jetzt angeklickt ist … und ich würde das jetzt halten dann würde das kurz so ne Haptik
     geben … dann kann ich es zur Seite ziehen und die Karte bleibt still … gleichzeitig auch die Werkzeuge zum drehen" */
  await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "baeckerei"); const K = STADT.kamera; K.x = o.x; K.y = o.y + 3; K.s = 14 * K.dpr; STADT.leicht.unruhe = 3; });
  await tick(600); await ruhig();
  const bk0 = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "baeckerei"); return { x: o.x, y: o.y, dreh: o.dreh }; });
  const bp = await bis(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "baeckerei"), K = STADT.kamera, P = STADT.proj(o.x, o.y, 0);
    for (let dy = 4; dy < 200; dy += 4) for (const dx of [0, -8, 8]) { const x = P[0] + dx * K.dpr, y = P[1] - dy * K.dpr; if (STADT.szene.treffer(x, y) === o) { const cx = x / K.dpr, cy = y / K.dpr, e = document.elementFromPoint(cx, cy); if (e && e.id === "lDinge") return { x: cx, y: cy }; } } return null; });
  let hz = null;
  if (bp) {
    /* erst antippen (Menü am Haus), dann halten – „wenn es jetzt angeklickt ist … und ich würde das jetzt halten“ */
    await pg.mouse.click(bp.x, bp.y); await tick(500);
    const kam0 = await pg.evaluate(() => [STADT.kamera.x, STADT.kamera.y]);
    await pg.mouse.move(bp.x, bp.y); await pg.mouse.down();
    await tick(700);
    const oben = await pg.evaluate(() => ({ geh: !!(STADT.oberflaeche.gehoben && STADT.oberflaeche.gehoben()), brumm: window.__brumm.slice() }));
    for (let i = 1; i <= 12; i++) { await pg.mouse.move(bp.x + 6 * i, bp.y - 3 * i); await tick(25); }
    const kam1 = await pg.evaluate(() => [STADT.kamera.x, STADT.kamera.y]);
    await pg.mouse.up(); await tick(400);
    hz = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "baeckerei"), k = document.querySelector(".lk-karte"); return { x: o.x, y: o.y, geist: !!o.geist, menue: !!k && !k.hidden && k.classList.contains("lk-am-ding") && k._ding === o }; });
    hz.oben = oben; hz.still = Math.hypot(kam1[0] - kam0[0], kam1[1] - kam0[1]) < 0.01;
  }
  sage(!!hz && hz.oben.geh && hz.oben.brumm.length > 0, "Haus antippen, dann halten (0,45 s): kurzes Brummen, das Haus ist angehoben", JSON.stringify(hz && hz.oben));
  sage(!!hz && hz.still && Math.hypot(hz.x - bk0.x, hz.y - bk0.y) > 2 && !hz.geist && hz.menue, "… Ziehen verschiebt das Haus, die Karte bleibt still; Loslassen setzt es, das Menü steht am Haus", JSON.stringify(hz && { still: hz.still, von: [bk0.x, bk0.y], nach: [+hz.x.toFixed(2), +hz.y.toFixed(2)], menue: hz.menue }));
  await pg.evaluate(() => STADT.leicht.aufbauen()); await tick(200);
  const hz2 = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "baeckerei"); return { x: o.x, y: o.y }; });
  sage(!!hz && Math.abs(hz2.x - hz.x) < 0.05 && Math.abs(hz2.y - hz.y) < 0.05, "… und bleibt dort (gespeichert, auch nach Neuaufbau)", JSON.stringify(hz2));
  const sch = await pg.evaluate(() => { const O = STADT.oberflaeche, o = STADT.szene.objekte.find((o) => o.spiel === "baeckerei");
    const k = document.querySelector(".lk-karte"); const offen = !!k && !k.hidden;
    const d0 = o.dreh, kd0 = STADT.kamera.dreh, r1 = O.schieberDrehen && O.schieberDrehen(1), d1 = o.dreh;
    const zu = document.querySelector('.lk-karte .lk-knopf[title="Schließen"]'); if (zu) zu.click();
    const r2 = O.schieberDrehen && O.schieberDrehen(1);
    return { offen, d0, d1, r1: !!r1, r2: !!r2, karteGleich: STADT.kamera.dreh === kd0 }; });
  sage(sch.offen && sch.r1 && sch.d1 !== sch.d0 && sch.karteGleich && !sch.r2, "Dreh-Schieber-Anschluss: bei offenem Menü dreht O.schieberDrehen das Haus (45°), ohne Menü nicht", JSON.stringify(sch));

  /* Gegenstück: auf einem nicht gewählten Haus halten und langsam ziehen – die Karte wandert, nichts wird angehoben */
  { const zu = await pg.evaluate(() => { const b = document.querySelector('.lk-karte .lk-knopf[title="Schließen"]'); if (b) b.click(); return 1; });
    const q = await bis(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "baeckerei"), K = STADT.kamera, P = STADT.proj(o.x, o.y, 0);
      for (let dy = 4; dy < 200; dy += 4) { const x = P[0], y = P[1] - dy * K.dpr; if (STADT.szene.treffer(x, y) === o) { const e = document.elementFromPoint(x / K.dpr, y / K.dpr); if (e && e.id === "lDinge") return { x: x / K.dpr, y: y / K.dpr }; } } return null; });
    let r = null;
    if (q) { const k0 = await pg.evaluate(() => [STADT.kamera.x, STADT.kamera.y]); await pg.mouse.move(q.x, q.y); await pg.mouse.down(); await tick(700);
      for (let i = 1; i <= 10; i++) { await pg.mouse.move(q.x - 5 * i, q.y - 2 * i); await tick(25); } await pg.mouse.up(); await tick(300);
      r = await pg.evaluate((k0) => ({ geh: !!STADT.oberflaeche.gehoben(), geist: STADT.szene.objekte.some((o) => o.geist), karte: Math.hypot(STADT.kamera.x - k0[0], STADT.kamera.y - k0[1]) > 0.2 }), k0); }
    sage(!!r && !r.geh && !r.geist && r.karte, "ohne Antippen: Halten und Ziehen auf einem Haus verschiebt die Karte, das Haus bleibt stehen", JSON.stringify({ q, r })); }

  /* ---------------- B: Baum im großen Bild ---------------- */
  const baumFinden = () => pg.evaluate(() => {
    const K = STADT.kamera, SZ = STADT.szene;
    const kandidaten = SZ.objekte.filter((o) => o.art === "natur" && !o.rand && !o.versteckt && /^n_(tanne|laubbaum|obstbaum)/.test(o.bild));
    kandidaten.sort((a, b) => Math.hypot(a.x - K.x, a.y - K.y) - Math.hypot(b.x - K.x, b.y - K.y));
    for (const o of kandidaten.slice(0, 40)) {
      const P = STADT.proj(o.x, o.y, 0);
      for (let dy = 3; dy < 120; dy += 3) for (const dx of [0, -3, 3]) {
        const x = P[0] + dx * K.dpr, y = P[1] - dy * K.dpr, cx = x / K.dpr, cy = y / K.dpr;
        if (cx < 20 || cy < 70 || cx > innerWidth - 20 || cy > innerHeight - 120) continue;
        if (SZ.treffer(x, y) !== o) continue;
        const e = document.elementFromPoint(cx, cy); if (!e || e.id !== "lDinge") continue;
        return { x: cx, y: cy, key: o.nkey };
      }
    }
    return null;
  });
  await pg.evaluate(() => { const K = STADT.kamera, SZ = STADT.szene; const b = SZ.objekte.filter((o) => o.art === "natur" && !o.rand && /^n_(tanne|laubbaum)/.test(o.bild)); const o = b[Math.floor(b.length / 2)]; K.x = o.x; K.y = o.y + 2; K.s = 14 * K.dpr; STADT.leicht.unruhe = 3; });
  await tick(600); await ruhig();
  let baum = null; for (let i = 0; i < 12 && !baum; i++) { baum = await baumFinden(); if (!baum) await tick(700); }
  if (baum) { await pg.mouse.click(baum.x, baum.y); await tick(400); }
  const menueB = await pg.evaluate((b) => { const k = document.querySelector(".lk-karte"); if (!k || k.hidden) return null; const r = k.getBoundingClientRect();
    return { t: k.textContent, am: k.classList.contains("lk-am-ding"), ent: !!k.querySelector('.lk-knopf[title="Entfernen"]'), vs: !!k.querySelector('.lk-knopf[title="Versetzen"]'),
      drin: r.left >= 0 && r.right <= innerWidth + 0.5 && r.top >= 0 && r.bottom <= innerHeight + 0.5, deckt: b && b.x > r.left && b.x < r.right && b.y > r.top && b.y < r.bottom, h: Math.round(r.height), w: Math.round(r.width) }; }, baum);
  sage(!!baum && !!menueB && menueB.am && menueB.ent && menueB.vs, "großes Bild: Tipp auf einen Baum öffnet das kleine Menü am Baum (Versetzen, Entfernen)", JSON.stringify({ baum, m: menueB && { t: menueB.t.slice(0, 40), am: menueB.am } }));
  sage(!!menueB && menueB.drin && !menueB.deckt, "das Menü ist ganz im Bild und deckt die getippte Stelle am Baum nicht zu", JSON.stringify(menueB && { drin: menueB.drin, deckt: menueB.deckt, w: menueB.w, h: menueB.h }));
  if (BILD) await pg.screenshot({ path: path.join(BILD, "b-baum-menue-gross.png") });
  await pg.evaluate(() => { const b = document.querySelector('.lk-karte .lk-knopf[title="Entfernen"]'); if (b) b.click(); });
  await tick(300);
  const wegB = (key) => pg.evaluate((k) => !STADT.szene.objekte.some((o) => o.nkey === k), key);
  sage(!!baum && await wegB(baum.key), "„Entfernen“ nimmt den Baum heraus");
  await pg.evaluate(() => STADT.leicht.aufbauen()); await tick(200);
  sage(!!baum && await wegB(baum.key), "… und er bleibt nach einem Neuaufbau weg");
  await tick(1600);
  await pg.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await laden();
  sage(!!baum && await wegB(baum.key), "… und nach Neuladen (nur der Server) auch");

  /* ---------------- C: kleiner Rahmen ---------------- */
  await pg.goto(basis + "/__rahmen822.html", { waitUntil: "load" });
  const fr = await (await pg.$("#f")).contentFrame();
  await fr.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
  await tick(1500);
  const off = await pg.evaluate(() => { const r = document.getElementById("f").getBoundingClientRect(); return { l: r.left, t: r.top }; });
  const baumImRahmen = () => fr.evaluate(() => {
    const K = STADT.kamera, SZ = STADT.szene;
    const kandidaten = SZ.objekte.filter((o) => o.art === "natur" && !o.versteckt && /^n_(tanne|laubbaum|obstbaum)/.test(o.bild));
    kandidaten.sort((a, b) => Math.hypot(a.x - K.x, a.y - K.y) - Math.hypot(b.x - K.x, b.y - K.y));
    for (const o of kandidaten.slice(0, 80)) {
      const P = STADT.proj(o.x, o.y, 0);
      for (let dy = 1; dy < 60; dy += 1.5) for (const dx of [0, -1.5, 1.5]) {
        const x = P[0] + dx * K.dpr, y = P[1] - dy * K.dpr, cx = x / K.dpr, cy = y / K.dpr;
        if (cx < 45 || cy < 45 || cx > innerWidth - 90 || cy > innerHeight - 45) continue;
        if (SZ.treffer(x, y) !== o) continue;
        const e = document.elementFromPoint(cx, cy); if (!e || e.id !== "lDinge") continue;
        return { x: cx, y: cy, key: o.nkey };
      }
    }
    return null;
  });
  /* im Überblick: wie bisher (Wald-Station darunter, kein Menü) */
  let b0 = null; for (let i = 0; i < 12 && !b0; i++) { b0 = await baumImRahmen(); if (!b0) await tick(700); }
  await pg.evaluate(() => { window.__msgs.length = 0; });
  if (b0) { await pg.touchscreen.tap(off.l + b0.x, off.t + b0.y); await tick(700); }
  /* FASSUNG 812 — seit Fassung 828 schickt der Baum im Überblick die Holzfäller los („leicht-baum") statt die Station zu öffnen */
  const ue = { msgs: await pg.evaluate(() => window.__msgs.filter((m) => m && (m.typ === "leicht-haus" || m.typ === "leicht-baum")).map((m) => m.g || m.typ)), karte: await fr.evaluate(() => { const k = document.querySelector(".lk-karte"); return !!k && !k.hidden; }) };
  sage(!!b0 && (ue.msgs.indexOf("wald") >= 0 || ue.msgs.indexOf("leicht-baum") >= 0) && !ue.karte, "kleiner Rahmen, Überblick: Baum-Tipp wie bisher → Holzfäller/Wald (kein Menü)", JSON.stringify({ b0, ue }));
  /* Kompass: nah dran */
  const lupe = await fr.evaluate(() => { const r = document.querySelector(".lk-lupe").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  for (let v = 0; v < 3; v++) {
    await pg.touchscreen.tap(off.l + lupe.x, off.t + lupe.y);
    await tick(900); await ruhig(fr);
    let nah = false; for (let i = 0; i < 10 && !nah; i++) { nah = await fr.evaluate(() => document.body.classList.contains("lk-nah")); if (!nah) await tick(500); }
    if (nah) break;
  }
  sage(await fr.evaluate(() => document.body.classList.contains("lk-nah")), "Kompass: nah dran (lk-nah)");
  let b1 = null; for (let i = 0; i < 12 && !b1; i++) { b1 = await baumImRahmen(); if (!b1) await tick(700); }
  await pg.evaluate(() => { window.__msgs.length = 0; });
  if (b1) { await pg.touchscreen.tap(off.l + b1.x, off.t + b1.y); await tick(800); }
  const menueC = await fr.evaluate((b) => { const k = document.querySelector(".lk-karte"); if (!k || k.hidden) return null; const r = k.getBoundingClientRect(), kn = [...k.querySelectorAll("button")].map((x) => x.getBoundingClientRect());
    /* FASSUNG 831 — dazu der Dreh-Schieber (.lk-drehschieber hat den Drehknopf links im kleinen Rahmen abgelöst) */
    const hud = [...document.querySelectorAll(".lk-lupe,.lk-uhr,.lk-ortsschild,.lk-vollknopf,.lk-drehknopf,.lk-drehschieber")].map((e) => e.getBoundingClientRect()).filter((q) => q.width > 0);
    const ueber = hud.filter((q) => Math.min(q.right, r.right) - Math.max(q.left, r.left) > 1 && Math.min(q.bottom, r.bottom) - Math.max(q.top, r.top) > 1).length;
    return { t: k.textContent, am: k.classList.contains("lk-am-ding"), ent: !!k.querySelector('.lk-knopf[title="Entfernen"]'), vs: !!k.querySelector('.lk-knopf[title="Versetzen"]'),
      drin: r.left >= 0 && r.right <= innerWidth + 0.5 && r.top >= 0 && r.bottom <= innerHeight + 0.5, breite: innerWidth, w: Math.round(r.width), h: Math.round(r.height),
      min: Math.min(...kn.map((q) => Math.min(q.width, q.height))), deckt: b && b.x > r.left && b.x < r.right && b.y > r.top && b.y < r.bottom, ueber: ueber }; }, b1);
  const waldGeschickt = await pg.evaluate(() => window.__msgs.some((m) => m && m.typ === "leicht-haus" && m.g === "wald"));
  sage(!!b1 && !!menueC && menueC.am && menueC.ent && menueC.vs && !waldGeschickt, "kleiner Rahmen, nah: Tipp auf den Baum → kleines Menü am Baum (Versetzen, Entfernen), kein Sprung zur Wald-Station", JSON.stringify({ b1, t: menueC && menueC.t.slice(0, 50), waldGeschickt }));
  sage(!!menueC && menueC.drin && menueC.breite === 360 && menueC.min >= 30 && !menueC.deckt && menueC.ueber === 0, "das Menü passt in den 360-px-Rahmen, Knöpfe ≥ 30 px, deckt weder Baum noch Kompass/Uhr/Knöpfe", JSON.stringify(menueC && { drin: menueC.drin, w: menueC.w, h: menueC.h, min: menueC.min, deckt: menueC.deckt, ueber: menueC.ueber }));
  if (BILD) await pg.screenshot({ path: path.join(BILD, "c-baum-menue-rahmen.png"), clip: { x: 0, y: off.t - 10, width: 360, height: 245 } });
  { const q = await fr.evaluate(() => { const b = document.querySelector('.lk-karte .lk-knopf[title="Entfernen"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    if (q) { await pg.touchscreen.tap(off.l + q.x, off.t + q.y); await tick(500); } }
  sage(!!b1 && await fr.evaluate((k) => !STADT.szene.objekte.some((o) => o.nkey === k), b1.key), "„Entfernen“ im kleinen Rahmen nimmt den Baum heraus");
  /* ein Haus im kleinen Rahmen (nah): das Spiel bekommt den Tipp, das Menü bietet Versetzen */
  const haus = await fr.evaluate(() => { const K = STADT.kamera, SZ = STADT.szene;
    for (const o of SZ.objekte.filter((o) => o.art === "haus")) { const P = STADT.proj(o.x, o.y, 0);
      for (let dy = 2; dy < 80; dy += 2) for (const dx of [0, -3, 3]) { const x = P[0] + dx * K.dpr, y = P[1] - dy * K.dpr, cx = x / K.dpr, cy = y / K.dpr;
        if (cx < 45 || cy < 45 || cx > innerWidth - 90 || cy > innerHeight - 45) continue;
        if (SZ.treffer(x, y) !== o) continue; const e = document.elementFromPoint(cx, cy); if (!e || e.id !== "lDinge") continue; return { x: cx, y: cy, g: o.spiel }; } }
    return null; });
  await pg.evaluate(() => { window.__msgs.length = 0; });
  if (haus) { await pg.touchscreen.tap(off.l + haus.x, off.t + haus.y); await tick(800); }
  const hmsgs = await pg.evaluate(() => window.__msgs.filter((m) => m && m.typ === "leicht-haus").map((m) => m.g));
  /* FASSUNG 844 — XANDER (Walkie 313): „wenn ich lange auf ein Haus gedrückt halte soll das Bearbeiten Menü kommen". Der
     kurze Tipp geht ans Spiel (kleine Symbole), das Menü am Haus mit „Versetzen" kommt beim langen Drücken. Das Prüf-
     Chromium malt langsam: 1,5 s Schwelle, 2,2 s halten (wie Sonde 844). */
  await fr.evaluate(() => { const z = [...document.querySelectorAll(".lk-wahl")]; z.forEach((w) => w.remove()); STADT.oberflaeche.langMs = 1500; });
  if (haus) { const cdpH = await pg.context().newCDPSession(pg), t0 = Date.now() / 1000, hx = off.l + haus.x, hy = off.t + haus.y;
    await cdpH.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: hx, y: hy, id: 1 }], timestamp: t0 }); await tick(2200);
    await cdpH.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: t0 + 2.21 }); await tick(700); }
  const hm = { msgs: hmsgs,
    m: await fr.evaluate(() => { const k = document.querySelector(".lk-karte"); if (!k || k.hidden) return null; const r = k.getBoundingClientRect(); return { vs: !!k.querySelector('.lk-knopf[title="Versetzen"]'), drin: r.left >= 0 && r.right <= innerWidth + 0.5 && r.top >= 0 && r.bottom <= innerHeight + 0.5 }; }) };
  sage(!!haus && hm.msgs.indexOf(haus.g) >= 0 && !!hm.m && hm.m.vs && hm.m.drin, "kleiner Rahmen, nah: Tipp aufs Haus geht ans Spiel, langes Drücken bringt das Menü am Haus mit „Versetzen“", JSON.stringify({ haus, hm }));
  if (BILD) await pg.screenshot({ path: path.join(BILD, "c-haus-menue-rahmen.png"), clip: { x: 0, y: off.t - 10, width: 360, height: 245 } });
  /* „Ein Tipp produziert" am Haus: der Blitz schaltet die Einstellung des Spiels */
  { const q = await fr.evaluate(() => { const b = document.querySelector(".lk-karte:not([hidden]) .lk-direkt-zeile, .lk-karte:not([hidden]) .lk-direkt-knopf"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, t: b.title }; });
    await pg.evaluate(() => { window.__msgs.length = 0; });
    if (q) { await pg.touchscreen.tap(off.l + q.x, off.t + q.y); await tick(400); }
    const dm = await pg.evaluate(() => window.__msgs.filter((m) => m && m.typ === "leicht-direkt"));
    const an = await fr.evaluate(() => document.body.classList.contains("lk-direkt"));
    sage(!!q && q.w >= 30 && dm.length === 1 && dm[0].an === true && an, "im Menü am Haus: „Ein Tipp produziert“ (Blitz) schaltet die Einstellung des Spiels", JSON.stringify({ q, dm, an })); }

  sage(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " FEHLER" : "\nALLES GUT");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
