#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 808: ACHT BAUWINKEL IN DER LEICHTEN STADT (+ neue Modelle)
   ---------------------------------------------------------------------
   XANDER: „du hast gesagt acht Winkel und hast sie nicht umgesetzt die
   möchte ich bitte" – beim Platzieren sollen auch schräge Winkel gehen.
   Geprüft am Android-Telefon (360 × 740, Finger):
     • am Anfang (alles gerade) wird kein schräges Bild geladen
     • das Rathaus antippen, „Drehen" → 45°: gezeichnet wird das _f_45-Bild
       (bzw. mit Kameradrehung das passende), Tippziele ≥ 30 px, nichts
       überlappt, nichts ragt über 360 px
     • die Lage wird gemerkt und nach dem Neuladen wiederhergestellt
     • ein Tipp aufs schräge Haus trifft es (Karte „Rathaus")
     • Schmuck (Bank) lässt sich schräg setzen und bleibt schräg
     • neue Modelle: Schmuck-Leiste mit Gruppen „Wahrzeichen", „Fahrzeuge",
       „Gleise"; die Pferdebahn steht auf dem Gleis und wird darüber gemalt;
       der kleine Rahmen (mini=1) lädt davon nichts, solange es nicht steht
   AUFRUF: node werkzeug/pruefe-808-acht-winkel.js     (BILD=/pfad/praefix für
           Bildschirmfotos, QUELLE=1 lädt die Einzeldateien statt leicht.min.js)
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const BILD = process.env.BILD || path.join(os.tmpdir(), "pruefe-808");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };
const SCHRAEG = /_f_(45|135|225|315)_[a-z]\.webp/;
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  /* FASSUNG 807: in der Originalkarte stehen manche Häuser schon schräg (zum Markt hin) – die Drehmechanik prüft diese
     Sonde im Rundling, wo am Anfang alles gerade steht. */
  const basis = "http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&vorlage=rundling&jahr=winter&zeit=tag" + (process.env.QUELLE ? "&quelle=1" : "");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  pg.setDefaultTimeout(120000);
  let geladen = [];
  pg.on("pageerror", (e) => { fehler++; console.log("  FEHL Seitenfehler: " + e.message); });
  pg.on("request", (r) => { if (/\.webp/.test(r.url())) geladen.push(r.url()); });
  const oeffnen = async () => {
    await pg.goto(basis, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 120000 }).catch(() => {});
    await pg.waitForTimeout(800);
  };
  const tipp = async (x, y) => { await pg.touchscreen.tap(x, y); await pg.waitForTimeout(350); };
  const bildpunkt = (wx, wy, wz) => pg.evaluate(([x, y, z]) => { const p = STADT.proj(x, y, z); return [p[0] / STADT.kamera.dpr, p[1] / STADT.kamera.dpr]; }, [wx, wy, wz]);
  const hin = async (x, y, s) => { await pg.evaluate(([x, y, s]) => { const K = STADT.kamera; K.x = x; K.y = y; K.s = s * K.dpr; STADT.leicht.unruhe = 3; }, [x, y, s]); await pg.waitForTimeout(900); };
  const karteText = () => pg.evaluate(() => { const k = document.querySelector(".lk-karte"); return k && !k.hidden ? k.textContent : ""; });
  /* das Bild, das für ein Objekt gerade gezeichnet wird (wartet, bis es geladen ist) */
  /* muster: so lange warten, bis das erwartete Bild dran ist (die Bildschleife malt erst im nächsten Takt neu) */
  const gezeichnet = async (fn, muster) => {
    for (let i = 0; i < 60; i++) {
      const r = await pg.evaluate((fn) => { const f = eval(fn); const e = STADT.szene.sichtbare.find((e) => f(e.o)); if (!e) return null; const n = e.lagen[0][0]; return { name: n, fertig: STADT.bilder.fertig(n), dreh: e.o.dreh, kdreh: STADT.kamera.dreh }; }, fn.toString());
      if (r && r.fertig && (!muster || muster.test(r.name))) return r;
      await pg.waitForTimeout(250);
    }
    return muster ? gezeichnet(fn) : null;
  };
  const kartePruefen = async (was) => {
    const r = await pg.evaluate(() => {
      const k = document.querySelector(".lk-karte"), b = [...k.querySelectorAll("button")].filter((x) => x.offsetParent).map((x) => x.getBoundingClientRect());
      const ueber = b.some((p, i) => b.some((q, j) => j > i && !(p.right <= q.left || q.right <= p.left || p.bottom <= q.top || q.bottom <= p.top)));
      const kb = k.getBoundingClientRect();
      return { min: Math.min(...b.map((p) => Math.min(p.width, p.height))), ueber: ueber, links: Math.min(kb.left, ...b.map((p) => p.left)), rechts: Math.max(kb.right, ...b.map((p) => p.right)), n: b.length };
    });
    sage(r.min >= 30 && !r.ueber && r.links >= 0 && r.rechts <= 360, was + ": Knöpfe ≥ 30 px, ohne Überlappung, innerhalb 360 px", JSON.stringify(r));
  };

  console.log("\nACHT BAUWINKEL (Fassung 808)\n");
  await oeffnen();
  sage(!geladen.some((u) => SCHRAEG.test(u)), "Start (alles gerade): kein schräges Bild geladen", geladen.length + " Bilder");
  const rathaus = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "rathaus"); return o && [o.x, o.y, o.dreh]; });
  await hin(rathaus[0], rathaus[1] + 4, 12);
  let p = await bildpunkt(rathaus[0], rathaus[1], 4);
  await tipp(p[0], p[1]);
  sage(/Rathaus/.test(await karteText()), "Rathaus antippen öffnet seine Karte");
  await kartePruefen("Karte am Haus");
  const d0 = await pg.evaluate(() => STADT.szene.auswahl && STADT.szene.auswahl.dreh);
  await pg.locator(".lk-karte .lk-knopf[title='Drehen']").first().tap();
  await pg.waitForTimeout(300);
  const d1 = await pg.evaluate(() => STADT.szene.auswahl && STADT.szene.auswahl.dreh);
  sage(d1 === (d0 + 0.5) % 4, "„Drehen“ dreht das Haus um 45°", d0 + " → " + d1);
  let e = await gezeichnet((o) => o.spiel === "rathaus", /_f_(45|135|225|315)_[kg]$/);
  const soll = ((d1 * 90) % 360);
  sage(!!e && new RegExp("^g_rathaus_winter_tag_f_" + soll + "_[kg]$").test(e.name), "gezeichnet wird das schräge Bild _f_" + soll, e && e.name);
  sage(geladen.some((u) => new RegExp("g_rathaus_winter_tag_f_" + soll + "_[kg]\\.webp").test(u)) && !geladen.some((u) => SCHRAEG.test(u) && !/g_rathaus_/.test(u)), "geladen wird nur das schräge Bild dieses Hauses", geladen.filter((u) => SCHRAEG.test(u)).map((u) => u.split("/").pop().split("?")[0]).join(", "));
  const schatten = await pg.evaluate(() => { const e = STADT.szene.sichtbare.find((e) => e.o.spiel === "rathaus"); return e && e.meta.sn; });
  sage(new RegExp("_f_" + soll + "_[kg]_s$").test(schatten || ""), "mit eigenem schrägem Schatten", schatten);
  await pg.screenshot({ path: BILD + "-schraeg.png" });
  /* zurück und wieder hin: links/rechts sind Gegenrichtungen */
  await pg.locator(".lk-karte .lk-knopf[title='Andersherum drehen']").tap({ timeout: 12000 }).catch(() => {}); await pg.waitForTimeout(200);   // (die Software-Grafik im Prüfbrowser ist langsam: großzügig warten)
  const d2 = await pg.evaluate(() => STADT.szene.auswahl.dreh);
  await pg.locator(".lk-karte .lk-knopf[title='Drehen']").first().tap(); await pg.waitForTimeout(200);
  sage(d2 === d0 && (await pg.evaluate(() => STADT.szene.auswahl.dreh)) === d1, "„Andersherum drehen“ dreht 45° zurück", d1 + " → " + d2 + " → " + d1);
  const gemerkt = await pg.evaluate(() => JSON.parse(localStorage.getItem("leicht_lage_v1") || "{}"));
  sage(gemerkt.rathaus && gemerkt.rathaus.dreh === d1, "die schräge Lage wird gemerkt", JSON.stringify(gemerkt));
  /* Kamera drehen: das Haus bleibt schräg (Blick + 90°) */
  await pg.evaluate(() => { STADT.kamera.dreh = 1; STADT.szene.geaendert(); STADT.leicht.unruhe = 3; });
  const soll2 = (soll + 90) % 360;
  e = await gezeichnet((o) => o.spiel === "rathaus", new RegExp("_f_" + soll2 + "_[kg]$"));
  sage(!!e && new RegExp("_f_" + soll2 + "_[kg]$").test(e.name), "Karte gedreht: das Haus zeigt _f_" + soll2, JSON.stringify(e));
  await pg.evaluate(() => { STADT.kamera.dreh = 0; STADT.szene.geaendert(); STADT.leicht.unruhe = 3; });
  /* Tiefensortierung: umschließendes Rechteck der gedrehten Grundfläche */
  const R = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "rathaus"); STADT.szene.zeichnen(performance.now()); const R = o._R; return R && { b: R.a1 - R.a0, t: R.b1 - R.b0, fuss: o.fuss }; });
  const erw = R && (R.fuss[0] + R.fuss[1]) * Math.SQRT1_2;
  sage(!!R && Math.abs(R.b - erw) < 0.05 && Math.abs(R.t - erw) < 0.05, "Fußabdruck schräg = umschließendes Rechteck der gedrehten Grundfläche", JSON.stringify(R) + " erwartet " + (erw && erw.toFixed(2)));

  /* Schmuck: Bank schräg setzen */
  await pg.locator(".lk-karte .lk-knopf[title='Schließen']").tap().catch(() => {});
  await hin(-8, 20, 14);
  await pg.locator(".lk-schmuck").first().tap(); await pg.waitForTimeout(500);
  await pg.locator(".lk-karte-klein", { hasText: "Bank" }).first().tap(); await pg.waitForTimeout(300);
  await kartePruefen("Karte beim Setzen");
  await pg.locator(".lk-karte .lk-knopf[title='Drehen']").first().tap(); await pg.waitForTimeout(200);
  await pg.locator(".lk-karte .lk-knopf[title='Setzen']").tap(); await pg.waitForTimeout(300);
  const bank = await pg.evaluate(() => JSON.parse(localStorage.getItem("leicht_deko_v1") || "[]").find((d) => d.bild === "d_bank"));
  sage(bank && bank.dreh === 0.5, "Bank schräg gesetzt und gemerkt", JSON.stringify(bank));
  e = await gezeichnet((o) => o.bild === "d_bank" && o.art === "eigen", /_f_45_[kg]$/);
  sage(!!e && /^d_bank_winter_tag_f_45_[kg]$/.test(e.name), "die Bank zeigt ihr 45°-Bild", e && e.name);

  /* Neu laden: alles wieder schräg */
  console.log("\nNACH DEM NEULADEN\n");
  geladen = [];
  await oeffnen();
  const r2 = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "rathaus"); const b = STADT.szene.objekte.find((o) => o.bild === "d_bank" && o.art === "eigen"); return { r: o && o.dreh, b: b && b.dreh }; });
  sage(r2.r === d1 && r2.b === 0.5, "Rathaus und Bank stehen wieder schräg", JSON.stringify(r2));
  await hin(rathaus[0], rathaus[1] + 4, 12);
  e = await gezeichnet((o) => o.spiel === "rathaus", new RegExp("_f_" + soll + "_[kg]$"));
  sage(!!e && new RegExp("_f_" + soll + "_[kg]$").test(e.name), "das Rathaus zeigt wieder _f_" + soll, e && e.name);
  /* Treffer schräg: ein Tipp aufs Haus (Mitte, halbe Höhe und die schräg vorstehende Ecke) */
  p = await bildpunkt(rathaus[0], rathaus[1], 4);
  await tipp(p[0], p[1]);
  sage(/Rathaus/.test(await karteText()), "Tipp aufs schräge Rathaus öffnet seine Karte", (await karteText()).slice(0, 40));
  const ecke = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.spiel === "rathaus"); /* alter Stand ohne szene.ecken: die gerade Grundfläche */
    const w = o.fuss[0] / 2, d = o.fuss[1] / 2, ec = STADT.szene.ecken ? STADT.szene.ecken(o) : [[o.x - w, o.y - d], [o.x + w, o.y - d], [o.x + w, o.y + d], [o.x - w, o.y + d]]; let best = null;
    for (const q of ec) { const P = STADT.proj(q[0] * 0.8 + o.x * 0.2, q[1] * 0.8 + o.y * 0.2, 2); if (!best || P[1] > best[1]) best = P; }
    const t = STADT.szene.treffer(best[0], best[1]); return { treffer: t && t.spiel, x: best[0] / STADT.kamera.dpr, y: best[1] / STADT.kamera.dpr }; });
  sage(ecke.treffer === "rathaus", "auch die vordere Ecke des schrägen Hauses trifft", JSON.stringify(ecke));
  await pg.screenshot({ path: BILD + "-neugeladen.png" });

  /* ---------------- neue Modelle ---------------- */
  console.log("\nNEUE MODELLE IM BAUKASTEN\n");
  await pg.locator(".lk-karte .lk-knopf[title='Schließen']").tap().catch(() => {});
  await hin(-6, 22, 14);
  await pg.locator(".lk-schmuck").first().tap(); await pg.waitForTimeout(600);
  const gruppen = await pg.$$eval(".lk-leiste .lk-gruppe", (x) => x.map((e) => e.textContent));
  sage(["Wahrzeichen", "Fahrzeuge", "Gleise"].every((g) => gruppen.indexOf(g) >= 0), "Schmuck-Leiste mit den Gruppen Wahrzeichen, Fahrzeuge, Gleise", gruppen.join(", "));
  const namen = await pg.$$eval(".lk-karte-klein span", (x) => x.map((e) => e.textContent));
  sage(["Rathaus Döbeln", "Dodge Viper", "Batmobil", "Pferdebahn", "Kornwagen", "Mehlwagen", "Leerer Wagen", "Gleis", "Gleisbogen"].every((n) => namen.indexOf(n) >= 0), "Rathaus Döbeln, Viper, Batmobil, Pferdebahn, drei Wagen und zwei Gleise wählbar");
  await pg.locator(".lk-leiste").evaluate((l) => { l.scrollLeft = l.scrollWidth; });
  await pg.waitForTimeout(1500);
  const vorschau = await pg.$$eval(".lk-karte-klein img", (x) => x.filter((i) => /w_rathaus_doebeln|v_|d_gleis/.test(i.src)).map((i) => i.naturalWidth > 0));
  sage(vorschau.length === 9 && vorschau.every(Boolean), "Vorschaubilder der neuen Modelle geladen", vorschau.length + " Stück");
  await pg.screenshot({ path: BILD + "-leiste.png" });
  /* Gleis setzen, Pferdebahn genau darauf */
  const setzen = async (name, x, y, drehen) => {
    /* FASSUNG 815 — XANDER: „Ich kann sie nicht dazu kaufen". Die Autos stehen jetzt mit Preis und „Kaufen" in der
       Leiste; ein gekauftes stellt man mit „Abstellen" als Schmuck hin (hier: der Viper gehört dem Spieler schon). */
    const auto = name === "Dodge Viper";
    if (auto) await pg.evaluate(() => { STADT.spiel.autos = ["viper"]; });
    await pg.locator(".lk-karte-klein", { hasText: name }).first().tap(); await pg.waitForTimeout(300);
    if (auto) { await pg.locator(".lk-karte .lk-text-knopf", { hasText: "Abstellen" }).first().tap(); await pg.waitForTimeout(300); }
    await pg.evaluate(([x, y]) => { const g = STADT.szene.objekte.find((o) => o.geist); g.x = x; g.y = y; STADT.szene.geaendert(); }, [x, y]);
    for (let i = 0; i < (drehen || 0); i++) { await pg.locator(".lk-karte .lk-knopf[title='Drehen']").first().tap(); await pg.waitForTimeout(120); }
    await pg.locator(".lk-karte .lk-knopf[title='Setzen']").tap(); await pg.waitForTimeout(300);
  };
  const leisteAuf = async () => { await pg.locator(".lk-schmuck").first().tap(); await pg.waitForTimeout(400); };
  /* ein freier Platz (nichts im Umkreis von 11 m), damit man es auch sieht */
  const F = await pg.evaluate(() => { const O = STADT.szene.objekte.filter((o) => !o.geist && !o.versteckt);
    for (let r = 20; r < 100; r += 2) for (let a = 0; a < 360; a += 10) { const x = Math.cos(a * Math.PI / 180) * r, y = Math.sin(a * Math.PI / 180) * r;
      if (O.every((o) => Math.hypot(o.x - x, o.y - y) > (o.art === "natur" ? 17 : 11) + Math.max(o.fuss ? o.fuss[0] : 2, o.fuss ? o.fuss[1] : 2) / 2)) return [Math.round(x), Math.round(y)]; } return [0, 44]; });   // (Bäume weiter weg: sie stünden vor dem Tipp)
  await pg.locator(".lk-leiste").evaluate((l) => { l.scrollLeft = 0; });
  await setzen("Gleis", F[0], F[1] + 2);
  await leisteAuf(); await setzen("Gleis", F[0], F[1] - 2);
  await leisteAuf(); await setzen("Pferdebahn", F[0], F[1]);
  await leisteAuf(); await setzen("Dodge Viper", F[0] + 5, F[1] + 1, 1);
  /* (FASSUNG 808: etwas weiter weg, damit Gleis, Pferdebahn und Viper sicher alle im Bild sind) */
  await hin(F[0] + 2.5, F[1] + 1, 11);
  await pg.waitForTimeout(1500);
  await gezeichnet((o) => o.bild === "v_viper", /_f_45_[kg]$/);
  const reihe = await pg.evaluate(() => { STADT.szene.zeichnen(performance.now()); const s = STADT.szene.sichtbare.map((e) => e.o.bild); return { gleis: s.lastIndexOf("d_gleis"), bahn: s.indexOf("v_pferdebahn"), viper: STADT.szene.sichtbare.filter((e) => e.o.bild === "v_viper").map((e) => e.lagen[0][0])[0] }; });
  sage(reihe.gleis >= 0 && reihe.bahn > reihe.gleis, "das Gleis wird unter der Pferdebahn gemalt (flach zuerst)", JSON.stringify(reihe));
  sage(/^v_viper_winter_tag_f_45_[kg]$/.test(reihe.viper || ""), "die Viper steht schräg (45°)", reihe.viper);
  const pb = await gezeichnet((o) => o.bild === "v_pferdebahn");
  sage(!!pb, "Pferdebahn-Bild geladen", pb && pb.name);
  const tb = await pg.evaluate(() => { const o = STADT.szene.objekte.find((o) => o.bild === "v_pferdebahn"); const P = STADT.proj(o.x, o.y + 1, 1.5); const t = STADT.szene.treffer(P[0], P[1]); return t && t.bild; });
  sage(tb === "v_pferdebahn", "ein Tipp auf die Pferdebahn trifft sie, nicht das Gleis darunter", tb);
  await pg.screenshot({ path: BILD + "-gleis.png" });

  /* kleiner Rahmen: nichts von den neuen Bildern, solange nichts davon steht */
  console.log("\nKLEINER RAHMEN\n");
  const pg2 = await (await br.newContext({ viewport: { width: 330, height: 206 }, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true })).newPage();
  const g2 = [];
  pg2.on("request", (r) => g2.push(r.url()));
  await pg2.goto(basis.replace("?demo=1", "?demo=1&mini=1"), { waitUntil: "load" });
  await pg2.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
  await pg2.waitForTimeout(3000);
  const neu = g2.filter((u) => /w_rathaus_doebeln|\/v_|d_gleis|verzeichnis\.json/.test(u));
  sage(neu.length === 0 && g2.some((u) => /verzeichnis-klein(-winter|-herbst)?\.json/.test(u)), "mini=1 lädt keine Bilder der neuen Modelle und nicht das große Verzeichnis", neu.map((u) => u.split("/").pop()).join(", ") || g2.filter((u) => /\.webp/.test(u)).length + " Bilder");

  console.log(fehler ? "\n  " + fehler + " FEHLER" : "\n  alles gut");
  console.log("  Bildschirmfotos: " + BILD + "-{schraeg,neugeladen,leiste,gleis}.png");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
