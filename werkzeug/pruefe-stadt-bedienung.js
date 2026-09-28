/* SONDE: Baukasten-Stadt – Bedienung am Telefon (360 × 740)
   XANDER: „Man soll sie in jedem Winkel aufstellen können … diese kleine Map
   hat und dann dorthin springt"
   Geprüft: Reiter öffnen, Gebäude wählen, Geist verschieben, drehen, bauen,
   Baustelle mit Fortschritt und Zeitraffer, auswählen, abreißen, Boden malen,
   Mini-Karte springt, Kamera drehen, nichts überlappt, kein Seitenfehler. */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: +(process.env.DPR || 1), hasTouch: true });
  pg.setDefaultTimeout(120000);
  pg.on("pageerror", (e) => { fehler++; console.log("  FEHL Seitenfehler: " + e.message); });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?neu=1" + (process.env.BUENDEL ? "" : "&quelle=1"), { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
  await pg.waitForFunction(() => !document.querySelector(".st-vorhang"), null, { timeout: 120000 }).catch(() => {});
  await pg.waitForTimeout(800);
  const aus = process.argv[2];

  /* Überlappung der Bedienelemente */
  const kaesten = await pg.evaluate(() => [".st-kopf .st-name", ".st-kopf-rechts", ".st-mini", ".st-leiste"].map((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { s, x: b.left, y: b.top, r: b.right, u: b.bottom }; }));
  const ueber = (a, b) => !(a.r <= b.x || b.r <= a.x || a.u <= b.y || b.u <= a.y);
  sage(!ueber(kaesten[0], kaesten[1]), "Name und Knöpfe oben überlappen nicht", JSON.stringify(kaesten.slice(0, 2).map((k) => [k.x | 0, k.r | 0])));
  sage(!ueber(kaesten[2], kaesten[3]), "Mini-Karte liegt über der Bauleiste, nicht darauf");
  sage(kaesten.every((k) => k.x >= 0 && k.r <= 360), "Alles innerhalb von 360 px");
  const kleinste = await pg.evaluate(() => Math.min(...[...document.querySelectorAll("button")].filter((b) => b.offsetParent).map((b) => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height))));
  sage(kleinste >= 30, "Alle Knöpfe mindestens 30 px", kleinste.toFixed(0) + " px");

  /* Reiter Häuser → Karte → Geist */
  await pg.click(".st-reiter-k[data-gruppe='Häuser']");
  await pg.waitForTimeout(700);
  const karten = await pg.$$eval(".st-karte span", (x) => x.map((e) => e.textContent));
  sage(karten.length > 0, "Häuser-Reiter zeigt Karten", karten.join(", "));
  const bildDa = await pg.$eval(".st-karte img", (i) => i.naturalWidth > 0).catch(() => false);
  sage(bildDa, "Karte hat ein echtes Vorschaubild");
  await pg.click(".st-karte");
  await pg.waitForTimeout(300);
  const geist = await pg.evaluate(() => { const g = STADT.szene.geist; return g && { typ: g.typ, x: g.x, y: g.y, gier: g.gier }; });
  sage(!!geist, "Geist hängt in der Mitte", JSON.stringify(geist));
  /* ins Freie verschieben (Tipp auf den Boden) und drehen */
  const frei = await pg.evaluate(() => { const p = STADT.proj(-30, 30, 0); return [p[0] / STADT.kamera.dpr, p[1] / STADT.kamera.dpr]; });
  /* freien Bauplatz suchen, Kamera dorthin, auf die Bildmitte tippen */
  const platz = await pg.evaluate(() => { const g = STADT.szene.geist; for (let r = 20; r < 70; r += 4) for (let a = 0; a < 6.28; a += 0.4) { const x = Math.round(Math.cos(a) * r), y = Math.round(Math.sin(a) * r); if (STADT.szene.passt(g.typ, x, y, 30) && STADT.szene.passt(g.typ, x, y, 0)) { STADT.kamera.x = x; STADT.kamera.y = y; return [x, y]; } } return null; });
  await pg.waitForTimeout(600);
  const mitte = await pg.evaluate((pl) => { const P = STADT.proj(pl[0], pl[1], 0); return [P[0] / STADT.kamera.dpr, P[1] / STADT.kamera.dpr]; }, platz);
  const oben = await pg.evaluate((m) => { const e = document.elementFromPoint(m[0], m[1]); return e ? e.id : "–"; }, mitte);
  sage(oben === "stadtDinge", "Beim Platzieren ist die Bildmitte frei (kein Feld darüber)", oben);
  await pg.mouse.click(mitte[0], mitte[1]);
  await pg.waitForTimeout(200);
  await pg.click(".st-steuer .st-knopf[title^='15° nach rechts']");
  await pg.click(".st-steuer .st-knopf[title^='15° nach rechts']");
  const ueber2 = await pg.evaluate(() => { const r = (s) => { const e = document.querySelector(s); if (!e || !e.offsetParent) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, r: b.right, u: b.bottom }; };
    const a = [r(".st-steuer"), r(".st-mini-rahmen"), r(".st-reiter"), r(".st-karten")].filter(Boolean);
    let n = 0; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (!(a[i].r <= a[j].x || a[j].r <= a[i].x || a[i].u <= a[j].y || a[j].u <= a[i].y)) n++; return n; });
  sage(ueber2 === 0, "Beim Bauen überlappt nichts (Steuerung, Karte, Leiste)", String(ueber2));
  const g2 = await pg.evaluate(() => { const g = STADT.szene.geist; const nah = STADT.szene.objekte.filter((o) => Math.hypot(o.x - g.x, o.y - g.y) < 12).map((o) => o.typ + "@" + o.x.toFixed(1) + "," + o.y.toFixed(1)); return { gier: g.gier, frei: g.frei, x: g.x, y: g.y, nah: nah.join(" "), kam: [STADT.kamera.x.toFixed(1), STADT.kamera.y.toFixed(1)] }; });
  sage(g2.gier === (geist.gier + 30) % 360, "Zweimal drehen = 30°", JSON.stringify(g2));
  sage(g2.frei, "Platz ist frei (grün)");
  const vorher = await pg.evaluate(() => STADT.szene.objekte.length);
  await pg.click(".st-steuer .st-ja");
  await pg.waitForTimeout(300);
  const neu = await pg.evaluate(() => { const o = STADT.szene.auswahl; return o && { typ: o.typ, bau: !!o.bau, gier: o.gier, n: STADT.szene.objekte.length }; });
  sage(neu && neu.n === vorher + 1 && neu.bau, "Gebaut: neue Baustelle steht", JSON.stringify(neu));
  await pg.waitForFunction(() => { const e = document.querySelector(".st-bau span"); return e && e.textContent; }, null, { timeout: 90000 }).catch(() => {});
  const balken = await pg.$eval(".st-bau span", (e) => e.textContent).catch((e) => "fehlt: " + e.message.slice(0, 80));
  sage(/Baugrube|Fundament|noch/.test(balken), "Baufortschritt mit Phase und Restzeit", balken);
  await pg.click(".st-raffer-k:nth-child(3)");
  await pg.waitForTimeout(2500);
  const p2 = await pg.evaluate(() => STADT.szene.fortschritt(STADT.szene.auswahl, performance.now()));
  sage(p2 > 0.02, "Zeitraffer ×60 treibt den Bau voran", (p2 * 100).toFixed(1) + " %");
  if (aus) await pg.screenshot({ path: aus.replace(".png", "-bau.png") });
  /* Abreißen */
  await pg.click(".st-steuer .st-nein");
  await pg.waitForTimeout(200);
  const nach = await pg.evaluate(() => STADT.szene.objekte.length);
  sage(nach === vorher, "Abreißen entfernt das Gebäude");

  /* Boden malen */
  await pg.click(".st-reiter-k[data-gruppe='Boden']");
  await pg.waitForTimeout(200);
  await pg.click(".st-karte-boden:nth-child(3)");      // Bachlauf
  const w0 = await pg.evaluate(() => { const p = STADT.aufBoden(100 * STADT.kamera.dpr, 300 * STADT.kamera.dpr); return STADT.boden.wert(p[0], p[1], 1); });
  await pg.mouse.move(100, 300); await pg.mouse.down(); for (let i = 0; i < 10; i++) await pg.mouse.move(100 + i * 12, 300 + i * 4); await pg.mouse.up();
  const w1 = await pg.evaluate(() => { const p = STADT.aufBoden(100 * STADT.kamera.dpr, 300 * STADT.kamera.dpr); return STADT.boden.wert(p[0], p[1], 1); });
  sage(w0 < 0.5 && w1 > 0.5, "Bachlauf malen setzt Wasser", w0.toFixed(2) + " → " + w1.toFixed(2));
  await pg.click(".st-steuer .st-ja");

  /* Mini-Karte: Kirchberg antippen → Kamera fliegt hin */
  console.log(await pg.evaluate(() => JSON.stringify([".st-mini", ".st-mini-feld:nth-child(2)", ".st-mini-schalter"].map((s) => { const b = document.querySelector(s).getBoundingClientRect(); return [s, b.left | 0, b.top | 0, b.width | 0, b.height | 0]; }))));
  await pg.click(".st-mini-feld:nth-child(2)");
  await pg.waitForFunction(() => Math.abs(STADT.kamera.y + 48) < 0.5, null, { timeout: 8000 }).catch(() => {});
  const kam = await pg.evaluate(() => ({ x: STADT.kamera.x, y: STADT.kamera.y }));
  sage(Math.abs(kam.x) < 2 && Math.abs(kam.y + 48) < 2, "Mini-Karte: Kirchberg angeflogen", JSON.stringify(kam));
  /* Kamera drehen */
  await pg.click(".st-kopf-rechts .st-knopf:nth-child(3)");
  const d = await pg.evaluate(() => STADT.kamera.dreh);
  sage(d === 1, "Karte gedreht", String(d));
  await pg.waitForTimeout(500);
  if (aus) await pg.screenshot({ path: aus });
  /* gespeichert? */
  await pg.waitForTimeout(800);
  const gesp = await pg.evaluate(() => (localStorage.getItem("stadt_stand") || "").length);
  sage(gesp > 100 && gesp < 150000, "Stadt im Browser gespeichert (klein)", gesp + " Zeichen");
  /* Neu laden: dieselbe Stadt, derselbe Bach */
  const vorherObj = await pg.evaluate(() => STADT.szene.objekte.length);
  await pg.goto(pg.url().replace("neu=1", "x=1"), { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig, null, { timeout: 60000 });
  const nachLaden = await pg.evaluate(() => ({ n: STADT.szene.objekte.length, bach: STADT.boden.wert(31, -2, 1) }));
  sage(nachLaden.n === vorherObj && nachLaden.bach > 0.5, "Nach dem Neuladen ist alles wieder da", JSON.stringify(nachLaden));
  await br.close(); srv.close();
  console.log(fehler ? "  " + fehler + " FEHLER" : "  alles gut");
  process.exit(fehler ? 1 : 0);
})();
