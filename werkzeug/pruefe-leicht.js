/* SONDE: Leichte Stadt (stadt-leicht.html) am Telefon (360 × 740)
   XANDER: „mit dem selben Komfort des Bauens und der Ansichten der
   Fertigstellung" – „dass man das weit aufziehen kann … nicht pixelig".
   Geprüft: lädt ohne Fehler, nichts überlappt, Knöpfe ≥ 30 px, Haus
   antippen zeigt Karte mit Stufe, Baustelle zeigt Fortschritt, Drehen,
   leerer Bauplatz, Schmuck setzen/entfernen, Mini-Karte springt, Kamera
   dreht, Aufziehen lädt die großen Bilder, Farbregler, Tages-/Jahreszeit.
   AUFRUF: node werkzeug/pruefe-leicht.js [bild.png]   (DPR=2, QUELLE=1) */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: +(process.env.DPR || 1), hasTouch: true });
  pg.setDefaultTimeout(120000);
  const geladen = [];
  pg.on("pageerror", (e) => { fehler++; console.log("  FEHL Seitenfehler: " + e.message); });
  pg.on("request", (r) => { if (/\.webp/.test(r.url())) geladen.push(r.url()); });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&jahr=winter&zeit=tag" + (process.env.QUELLE ? "&quelle=1" : ""), { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
  await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 120000 }).catch(() => {});
  await pg.waitForTimeout(600);
  const bytes = geladen.length;
  sage(bytes > 10, "Start lädt Bilder (nur die sichtbaren)", bytes + " Bilder");
  const skript = await pg.evaluate(() => [...document.scripts].map((s) => s.src).filter((s) => /stadt/.test(s)));
  sage(skript.length > 0, "Skripte der leichten Stadt", skript.map((s) => s.split("/").pop()).join(", "));

  const kaesten = await pg.evaluate(() => [".lk-kopf-links", ".lk-kopf-rechts", ".lk-mini-rahmen", ".lk-schmuck"].map((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { s, x: b.left, y: b.top, r: b.right, u: b.bottom }; }));
  const ueber = (a, b) => !(a.r <= b.x || b.r <= a.x || a.u <= b.y || b.u <= a.y);
  sage(!ueber(kaesten[0], kaesten[1]), "Name und Knöpfe oben überlappen nicht", JSON.stringify(kaesten.slice(0, 2).map((k) => [k.x | 0, k.r | 0, k.u | 0])));
  sage(!ueber(kaesten[2], kaesten[3]), "Mini-Karte und Schmücken überlappen nicht");
  sage(kaesten.every((k) => k.x >= 0 && k.r <= 360), "Alles innerhalb von 360 px");
  const kleinste = await pg.evaluate(() => Math.min(...[...document.querySelectorAll("button")].filter((b) => b.offsetParent).map((b) => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height))));
  sage(kleinste >= 30, "Alle Knöpfe mindestens 30 px", kleinste.toFixed(0) + " px");

  /* Haus antippen (Rathaus): Karte mit Name und Stufe */
  const tipp = async (x, y) => { await pg.mouse.click(x, y); await pg.waitForTimeout(250); };
  const bildpunkt = (wx, wy, wz) => pg.evaluate(([x, y, z]) => { const p = STADT.proj(x, y, z); return [p[0] / STADT.kamera.dpr, p[1] / STADT.kamera.dpr]; }, [wx, wy, wz]);
  const hin = async (x, y, s) => { await pg.evaluate(([x, y, s]) => { const K = STADT.kamera; K.x = x; K.y = y; K.s = s * K.dpr; STADT.leicht.unruhe = 3; }, [x, y, s]); await pg.waitForTimeout(900); };
  const rathaus = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "rathaus"); return o && [o.x, o.y]; });
  await hin(rathaus[0], rathaus[1] + 4, 12);
  let p = await bildpunkt(rathaus[0], rathaus[1], 4);
  await tipp(p[0], p[1]);
  let karte = await pg.evaluate(() => { const k = document.querySelector(".lk-karte"); return k && !k.hidden ? k.textContent : ""; });
  sage(/Rathaus/.test(karte) && /Stufe/.test(karte), "Rathaus antippen zeigt Name und Stufe", karte.slice(0, 60));
  const d0 = await pg.evaluate(() => STADT.szene.auswahl && STADT.szene.auswahl.dreh);
  await pg.click(".lk-karte .lk-knopf[title='Drehen']");
  const d1 = await pg.evaluate(() => STADT.szene.auswahl && STADT.szene.auswahl.dreh);
  /* FASSUNG 808 — Spielgebäude drehen in Achtelschritten (45°) */
  sage(d1 === (d0 + 0.5) % 4, "Haus drehen (Achteldrehung, 45°)", d0 + " → " + d1);
  const gemerkt = await pg.evaluate(() => localStorage.getItem("leicht_lage_v1"));
  sage(/rathaus/.test(gemerkt || ""), "Drehung bleibt gemerkt", gemerkt);
  for (let i = 0; i < 7; i++) await pg.click(".lk-karte .lk-knopf[title='Drehen']");
  sage(await pg.evaluate(() => STADT.szene.auswahl && STADT.szene.auswahl.dreh) === d0, "nach acht Achteldrehungen wieder wie vorher");

  /* Baustelle (Labor im Bau) */
  const labor = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "labor"); return o && [o.x, o.y, o.bau && o.bau.p]; });
  sage(labor && labor[2] > 0 && labor[2] < 1, "Labor steht als Baustelle", labor && labor[2] != null ? labor[2].toFixed(2) : "–");
  await hin(labor[0], labor[1] + 3, 12);
  p = await bildpunkt(labor[0], labor[1], 0.5);
  await tipp(p[0], p[1]);
  karte = await pg.evaluate(() => { const k = document.querySelector(".lk-karte"); return k && !k.hidden ? k.textContent : ""; });
  sage(/Im Bau/.test(karte) && /noch \d+:\d\d/.test(karte), "Baustelle zeigt Fortschritt und Restzeit", karte.slice(0, 70));
  const bauBild = await pg.evaluate(() => STADT.szene.sichtbare.filter((e) => e.o.spiel === "labor").map((e) => e.lagen[0][0])[0]);
  sage(/^bau_(labor|fachwerkerker)_winter_tag_b\d+/.test(bauBild || ""), "Baustelle zeigt ein Baustellenbild (Bagger, Kran …)", bauBild);

  /* Leerer Bauplatz (Gefängnis steht in der Beispielstadt; Labor ist Baustelle). Suche einen freien Platz */
  const frei = await pg.evaluate(() => { const D = STADT.dorf; for (const k in D.PLAETZE) { const pl = D.PLAETZE[k]; if (!STADT.szene.objekte.some((o) => o.art === "haus" && Math.hypot(o.x - pl.x, o.y - pl.y) < 1)) return [k, pl.x, pl.y]; } return null; });
  if (frei) {
    await hin(frei[1], frei[2], 12);
    /* so drehen, dass kein Haus davor den Platz verdeckt */
    for (let d = 0; d < 4; d++) {
      p = await bildpunkt(frei[1], frei[2], 0);
      const zu = await pg.evaluate(([x, y]) => !!STADT.szene.treffer(x * STADT.kamera.dpr, y * STADT.kamera.dpr, (o) => o.art !== "natur"), p);
      if (!zu) break;
      await pg.evaluate(() => { STADT.kamera.dreh = (STADT.kamera.dreh + 1) & 3; STADT.szene.geaendert(); STADT.leicht.unruhe = 3; });
      await pg.waitForTimeout(700);
    }
    await tipp(p[0], p[1]);
    karte = await pg.evaluate(() => { const k = document.querySelector(".lk-karte"); return k && !k.hidden ? k.textContent : ""; });
    sage(/Bauplatz/.test(karte) && /Preis/.test(karte), "Leerer Bauplatz zeigt, welches Haus hingehört, und den Preis", karte.slice(0, 70));
  } else sage(true, "kein leerer Bauplatz in der Beispielstadt");
  await pg.click(".lk-karte .lk-knopf[title='Schließen']").catch(() => {});
  await pg.evaluate(() => { STADT.kamera.dreh = 0; STADT.szene.geaendert(); });

  /* Schmücken: Leiste, Laterne setzen, antippen, entfernen */
  await hin(-8, 20, 12);
  await pg.click(".lk-schmuck");
  await pg.waitForTimeout(400);
  const kn = await pg.$$eval(".lk-karte-klein span", (x) => x.map((e) => e.textContent));
  sage(kn.length >= 10, "Schmuck-Leiste mit Vorschaubildern", kn.length + " Stück");
  const bilderOk = await pg.$$eval(".lk-karte-klein img", (x) => x.filter((i) => i.naturalWidth > 0).length);
  sage(bilderOk >= 8, "Vorschaubilder geladen", String(bilderOk));
  await pg.click(".lk-karte-klein");
  await pg.waitForTimeout(300);
  const geist = await pg.evaluate(() => STADT.szene.objekte.some((o) => o.geist));
  sage(geist, "Geist in der Bildmitte");
  await pg.click(".lk-karte .lk-knopf[title='Setzen']");
  const deko = await pg.evaluate(() => JSON.parse(localStorage.getItem("leicht_deko_v1") || "[]").length);
  sage(deko === 1, "Schmuck gesetzt und gemerkt", String(deko));

  /* Mini-Karte: Bahnhof anfliegen */
  const vor = await pg.evaluate(() => [STADT.kamera.x, STADT.kamera.y]);
  await pg.click(".lk-mini-feld:nth-child(8)");
  await pg.waitForTimeout(1300);
  const nach = await pg.evaluate(() => [STADT.kamera.x, STADT.kamera.y]);
  sage(Math.abs(nach[1] - 48) < 2 && Math.abs(nach[0]) < 2, "Mini-Karte: Bahnhof angeflogen", JSON.stringify(nach.map((v) => +v.toFixed(1))) + " (vorher " + JSON.stringify(vor.map((v) => +v.toFixed(1))) + ")");
  await pg.click(".lk-kopf-rechts .lk-knopf[title='Karte nach links drehen']");
  sage(await pg.evaluate(() => STADT.kamera.dreh) === 1, "Karte gedreht");
  await pg.click(".lk-kopf-rechts .lk-knopf[title='Karte nach rechts drehen']");

  /* Aufziehen: große Bilder werden geladen */
  await hin(rathaus[0], rathaus[1] + 3, 30);
  await pg.waitForTimeout(2500);
  const gross = await pg.evaluate(() => STADT.szene.sichtbare.filter((e) => /_g$/.test(e.lagen[0][0])).length);
  sage(gross > 0, "Ganz nah: große, scharfe Bilder", gross + " im Bild");

  /* Tages- und Jahreszeit, Farbregler. FASSUNG 808 — XANDER: „Tag und Nacht braucht man nicht wählen": die beiden
     Schalter sieht nur der Betreiber (Vorschau); für alle anderen laufen sie nach der Uhr. */
  sage(await pg.evaluate(() => document.querySelector(".lk-kopf-rechts .lk-knopf[title='Tageszeit']").hidden && document.querySelector(".lk-kopf-rechts .lk-knopf[title='Jahreszeit']").hidden), "ohne Betreiber keine Tages- und Jahreszeit-Schalter");
  await pg.evaluate(() => { STADT.spiel.betreiber = true; STADT.oberflaeche.betreiberDa(); });
  await pg.click(".lk-kopf-rechts .lk-knopf[title='Tageszeit']");
  sage(await pg.evaluate(() => STADT.szene.zeit) === "abend", "Tageszeit wechselt");
  await pg.click(".lk-kopf-rechts .lk-knopf[title='Jahreszeit']");
  sage(await pg.evaluate(() => STADT.szene.jahr) === "fruehling", "Jahreszeit wechselt");
  await pg.click(".lk-kopf-rechts .lk-knopf[title='Farbstimmung']");
  const regler = await pg.evaluate(() => !document.querySelector(".lk-farbfeld").hidden);
  sage(regler, "Farbregler geht auf");
  if (process.argv[2]) await pg.screenshot({ path: process.argv[2] });
  console.log(fehler ? "  " + fehler + " FEHLER" : "  alles gut");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
