#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 821: AUTO-SCHAU FÜR DODGE VIPER UND BATMOBIL
   ---------------------------------------------------------------------
   XANDER (Funk 207, wörtlich): „wenn man bei Batmobil oder Viper klick
   dann muss ich die Möglichkeit geben sich das Auto schön anzugucken
   ich habe ja schon mal gesagt wenn man sich entscheidet man will
   weiter rein [zoomen] soll diese [Zoom]stufe auch möglich sein dann
   muss es halt temporär zwischengeladen werden das soll auf jeden Fall
   anzuschauen sein und ich habe gesagt ich brauche so ein Handle der die
   Z-Achse schön navigieren kann nicht so mit einmal klickt das ist total
   sinnlos weil dann kann man ja nicht mal mehr zurückklicken ich möchte
   dass man das durch den Finger-Swipe steuern kann".

   Geprüft (stadt-leicht.html?demo=1&zeit=tag&autos=viper,batmobil – die
   gebündelte leicht.min.js; Telefon 360 × 740 mit Fingern, Rechner
   1280 × 800 mit Maus):
     • vor dem Öffnen wird kein Blatt der Autos angefragt (schau_*, auftritt_*)
     • „Anschauen" in der Karte des Autos öffnet die Vollbild-Ebene; erst
       jetzt werden die Blätter geladen – zuerst 14°, dann 30° und 55°;
       solange die noch laden, zeigt der Kippgriff den Ladezustand
     • Name oben („Dein Auto"), unten die Knöpfe der Karte und „Zurück",
       nichts überlappt, Tippflächen ≥ 30 px, das Auto ganz im Bild
     • waagrecht wischen dreht stufenlos (Zwischenwerte), mit Schwung,
       und kommt auf einem der 32 Winkel zur Ruhe
     • senkrecht wischen kippt 14° → 30° → 55° (die gemalten Bildpunkte
       ändern sich), der Schieber am Rand tut dasselbe
     • Kneifen (zwei Finger) und Mausrad zoomen bis zur vollen
       Auflösung der Blätter; Doppeltipp = nah / zurück
     • die Zurück-Taste des Browsers schließt die Schau, die Stadt ist
       wieder da (Kreuz und „Zurück" ebenso)
     • ein Tipp auf ein fahrendes Auto öffnet die Schau (mit „Hinfahren")
     • keine Seitenfehler
   Bildschirmfotos (BILD=/pfad/praefix): beide Autos, 360 × 740 und
   1280 × 800, je 3 Winkel × 3 Neigungen.
   Mit dem alten Stand (ohne stadt-leicht/autoschau.js) ist alles rot.
   FASSUNG 812 — die Schau wird nachgeladen (autoschau-laden.js): vor dem Messen wartet die Sonde, bis sie offen ist.
   Aufruf: node werkzeug/pruefe-821-autoschau.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };

let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const BLATT = /\/(schau_|auftritt_)[a-z0-9_]+\.(json|webp)/;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&autos=viper,batmobil";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ende = async () => { await br.close(); srv.close(); console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0); };
  const seite = async (vp, telefon, vorher) => {
    const pg = await br.newPage({ viewport: vp, deviceScaleFactor: telefon ? 2 : 1, hasTouch: !!telefon, isMobile: !!telefon });
    pg.setDefaultTimeout(120000);
    pg.fehler = []; pg.anfragen = [];
    pg.on("pageerror", (e) => pg.fehler.push(e.message));
    pg.on("request", (r) => pg.anfragen.push(r.url()));
    if (vorher) await vorher(pg);
    await pg.goto(basis, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(800);
    return pg;
  };
  const zustand = (pg) => pg.evaluate(() => (window.STADT && STADT.autoschau ? STADT.autoschau.zustand() : null));
  const blaetter = (pg) => pg.anfragen.filter((u) => BLATT.test(u)).map((u) => u.split("/").pop().split("?")[0]);
  /* Finger über CDP (echte Touch-Ereignisse → Pointer Events mit pointerType „touch") */
  const cdpVon = async (pg) => pg.__cdp || (pg.__cdp = await pg.context().newCDPSession(pg));
  /* Jedes Ereignis trägt seine Zeit (timestamp) wie von einem echten Finger: im Prüf-Chromium (Software-Grafik) malt
     ein Bild einige hundert Millisekunden, und CDP wartet auf jedes Ereignis – ohne eigene Zeitstempel sähe jeder Wisch
     wie ein langsames Schieben aus. */
  const wischen = async (pg, wege, dauer, schritte, probe) => {
    const cdp = await cdpVon(pg), n = schritte || 12, proben = [], t0 = Date.now() / 1000;
    const pt = (k) => wege.map((w, i) => ({ x: w[0][0] + (w[1][0] - w[0][0]) * k / n, y: w[0][1] + (w[1][1] - w[0][1]) * k / n, id: i + 1 }));
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(0), timestamp: t0 });
    for (let k = 1; k <= n; k++) {
      await pg.waitForTimeout(dauer / n);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(k), timestamp: t0 + k * dauer / n / 1000 });
      if (probe && k < n - 1) proben.push(await zustand(pg));
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: t0 + (dauer + 8) / 1000 });
    return proben;
  };
  const tippen = async (pg, x, y, t0) => { const cdp = await cdpVon(pg); t0 = t0 || Date.now() / 1000; await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x, y: y, id: 1 }], timestamp: t0 }); await pg.waitForTimeout(40); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: t0 + 0.05 }); };
  const doppeltippen = async (pg, x, y) => { const t0 = Date.now() / 1000; await tippen(pg, x, y, t0); await pg.waitForTimeout(100); await tippen(pg, x, y, t0 + 0.16); };
  const ruhe = (pg) => pg.waitForFunction(() => { const z = STADT.autoschau.zustand(); return z.offen && z.ruhe; }, null, { timeout: 15000 }).catch(() => {});
  /* grobe Unterschrift des Bildes auf der Bühne: 24 × 24 Felder Helligkeit */
  const unterschrift = (pg) => pg.evaluate(() => {
    const cv = document.querySelector(".as-leinwand"), g = cv.getContext("2d"), d = cv.width / cv.clientWidth, b = STADT.autoschau.zustand().buehne;
    const x0 = Math.round(b.x * d), y0 = Math.round(b.y * d), w = Math.round(b.w * d), h = Math.round(b.h * d), D = g.getImageData(x0, y0, w, h).data, N = 24, u = new Array(N * N).fill(0), n = new Array(N * N).fill(0);
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) { const i = (y * w + x) * 4, k = Math.floor(y / h * N) * N + Math.floor(x / w * N); u[k] += D[i] + D[i + 1] + D[i + 2]; n[k]++; }
    return u.map((v, k) => v / Math.max(1, n[k]));
  });
  const abstand = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };
  /* Schmücken-Leiste → Karte des Autos → „Anschauen" */
  const anschauen = async (pg, id) => pg.evaluate((id) => {
    const lk = document.querySelector(".lk-schmuck:not(.lk-bauen)"); if (!lk) return "keine Schmücken-Leiste";
    lk.click();
    const k = document.querySelector('.lk-auto-karte[data-auto="' + id + '"]'); if (!k) return "keine Autokarte";
    k.click();
    const b = document.querySelector(".lk-karte .lk-anschauen-knopf") || [...document.querySelectorAll(".lk-karte button")].find((x) => /Anschauen/.test(x.textContent));
    if (!b) return "kein Anschauen-Knopf in der Karte (" + [...document.querySelectorAll(".lk-karte button")].map((x) => x.textContent || x.title).join(", ") + ")";
    b.click();
    return "";
  }, id);
  /* nichts überlappt, alles im Bild, Tippflächen ≥ 30 px; das Auto zwischen Kopf und Knöpfen */
  const anordnung = (pg) => pg.evaluate(() => {
    const W = innerWidth, H = innerHeight, r = (e) => e.getBoundingClientRect();
    const teile = [...document.querySelectorAll(".as-knoepfe button, .as-zu, .as-kipp, .as-name")].filter((e) => r(e).width > 0);
    const aus = [], klein = [];
    for (const e of teile) { const a = r(e); if (a.left < -0.5 || a.top < -0.5 || a.right > W + 0.5 || a.bottom > H + 0.5) aus.push(e.className); if (e.tagName === "BUTTON" && (a.width < 30 || a.height < 30)) klein.push(e.className + " " + Math.round(a.width) + "×" + Math.round(a.height)); }
    const ueber = [];
    for (let i = 0; i < teile.length; i++) for (let j = i + 1; j < teile.length; j++) { const a = r(teile[i]), b = r(teile[j]); if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) ueber.push(teile[i].className + " / " + teile[j].className); }
    const z = STADT.autoschau.zustand(), R = z.rahmen, name = r(document.querySelector(".as-name")), knoepfe = [...document.querySelectorAll(".as-knoepfe button")].map(r), kipp = r(document.querySelector(".as-kipp"));
    const obenK = Math.min(...knoepfe.map((b) => b.top));
    const auto = R ? { l: R[0], o: R[1], r: R[0] + R[2], u: R[1] + R[3] } : null;
    const autoGut = !!auto && auto.l >= 0 && auto.r <= W && auto.o >= name.bottom - 2 && auto.u <= obenK + 2 && auto.r <= kipp.left + 40;
    return { aus: aus, klein: klein, ueber: ueber, auto: auto && [auto.l, auto.o, auto.r, auto.u].map(Math.round), autoGut: autoGut, oben: Math.round(name.bottom), unten: Math.round(obenK), knoepfe: [...document.querySelectorAll(".as-knoepfe button")].map((b) => b.textContent.trim()) };
  });

  /* =================== TELEFON 360 × 740 =================== */
  console.log("\nTELEFON 360 × 740 (Finger)\n");
  /* die höheren Stufen kommen absichtlich verzögert – so sieht man den Ladezustand am Griff */
  const pg = await seite({ width: 360, height: 740 }, true, async (p) => {
    await p.route(/schau_viper_(30|55)\.json/, async (route) => { await new Promise((ja) => setTimeout(ja, 1500)); route.continue(); });
  });
  sage(!pg.fehler.length, "lädt ohne Seitenfehler", pg.fehler.join(" | "));
  sage(await pg.evaluate(() => /leicht\.min\.js/.test([...document.scripts].map((s) => s.src).join(" "))), "die Seite lädt die gebündelte leicht.min.js");
  sage(blaetter(pg).length === 0, "vor dem Öffnen wird kein Blatt der Autos angefragt (schau_*, auftritt_*)", blaetter(pg).join(", ") || "keine");
  const a1 = await anschauen(pg, "viper");
  sage(!a1, "die Karte des Vipers hat „Anschauen\"", a1);
  await pg.waitForFunction(() => STADT.autoschau.zustand().offen, null, { timeout: 5000 }).catch(() => {});
  await pg.waitForTimeout(150);
  const Z0 = await zustand(pg);
  const eb = await pg.evaluate(() => { const e = document.querySelector(".as-ebene"); if (!e) return null; const r = e.getBoundingClientRect(), s = getComputedStyle(e); return { w: r.width, h: r.height, touch: s.touchAction, lein: !!e.querySelector("canvas.as-leinwand"), laedt: !!document.querySelector(".as-kipp.as-laedt"), marke30: !!document.querySelector('.as-marke.as-laedt[data-neig="30"]'), name: (document.querySelector(".as-name") || {}).textContent, unter: (document.querySelector(".as-unter") || {}).textContent }; });
  sage(!!eb && Z0 && Z0.offen && eb.w === 360 && eb.h === 740 && eb.lein && eb.touch === "none", "„Anschauen\" öffnet die Vollbild-Ebene (eigene Leinwand, touch-action: none)", JSON.stringify(eb));
  if (!eb || !Z0 || !Z0.offen) return ende();
  sage(eb.name === "Dodge Viper" && eb.unter === "Dein Auto", "oben der Name und „Dein Auto\"", eb.name + " · " + eb.unter);
  sage(eb.laedt && eb.marke30, "solange 30° und 55° laden, zeigt der Kippgriff den Ladezustand", JSON.stringify({ laedt: eb.laedt, marke30: eb.marke30 }));
  await pg.waitForFunction(() => { const z = STADT.autoschau.zustand(); return z.offen && z.stufen && z.stufen.every((s) => s.fertig || s.fehler); }, null, { timeout: 60000 }).catch(() => {});
  const Z1 = await zustand(pg), bl = blaetter(pg);
  const i14 = bl.indexOf("auftritt_viper.json"), i30 = bl.indexOf("schau_viper_30.json"), i55 = bl.indexOf("schau_viper_55.json");
  sage(Z1.stufen.every((s) => s.fertig) && i14 >= 0 && i30 > i14 && i55 > i30, "erst jetzt werden die Blätter geladen: zuerst 14°, dann 30° und 55°", bl.join(", "));
  sage(!(await pg.evaluate(() => !!document.querySelector(".as-kipp.as-laedt"))), "alle Stufen da: der Griff lädt nicht mehr");
  const L1 = await anordnung(pg);
  sage(!L1.aus.length && !L1.klein.length && !L1.ueber.length, "nichts überlappt, alles im Bild, Tippflächen ≥ 30 px", JSON.stringify({ aus: L1.aus, klein: L1.klein, ueber: L1.ueber }));
  sage(L1.knoepfe.some((t) => /Hinfahren/.test(t)) && L1.knoepfe.some((t) => /Zurück/.test(t)), "unten die Knöpfe der Karte und „Zurück\"", L1.knoepfe.join(" | "));
  sage(L1.autoGut, "das Auto ist ganz im Bild (zwischen Name und Knöpfen)", "Auto " + JSON.stringify(L1.auto) + ", Name bis " + L1.oben + ", Knöpfe ab " + L1.unten);

  /* ---- waagrecht wischen: stufenlos drehen, mit Schwung ---- */
  const B = Z1.buehne, mx = B.x + B.w / 2, my = B.y + B.h / 2;
  const g0 = Z1.gier, u0 = await unterschrift(pg);
  const P = await wischen(pg, [[[mx - 80, my], [mx + 40, my]]], 160, 10, true);
  const nachLos = await zustand(pg);
  /* ein paar Bilder abwarten (im Prüf-Chromium malt ein Bild bis zu ~0,2 s) */
  await pg.waitForFunction((g) => Math.abs(STADT.autoschau.zustand().gier - g) > 2, nachLos.gier, { timeout: 3000 }).catch(() => {});
  const spaeter = await zustand(pg);
  const zwischen = P.filter((z) => Math.abs(z.gier / 11.25 - Math.round(z.gier / 11.25)) > 0.05).length;
  sage(zwischen >= 4 && P.every((z, i) => i === 0 || z.gier !== P[i - 1].gier), "waagrecht wischen dreht stufenlos (Zwischenwerte zwischen den 32 Winkeln)", P.map((z) => z.gier.toFixed(1)).join(" → "));
  const dSchwung = Math.abs(((spaeter.gier - nachLos.gier + 540) % 360) - 180);
  sage(dSchwung > 2 && Math.abs(nachLos.gv) > 25, "nach dem Loslassen dreht es mit Schwung weiter", "Schwung " + nachLos.gv.toFixed(0) + " °/s, danach noch " + dSchwung.toFixed(1) + "° (in wenigen Bildern)");
  await ruhe(pg);
  const Zr = await zustand(pg), u1 = await unterschrift(pg);
  const dG = Math.abs(((Zr.gier - g0 + 540) % 360) - 180);
  const dAus = Math.abs(((Zr.gier - nachLos.gier + 540) % 360) - 180);
  sage(Zr.ruhe && Math.abs(Zr.gier / 11.25 - Math.round(Zr.gier / 11.25)) < 0.01 && dG > 20 && dAus > 20, "es läuft aus und kommt auf einem der 32 Winkel zur Ruhe", g0 + "° → (losgelassen bei " + nachLos.gier.toFixed(1) + "°) → " + Zr.gier.toFixed(2) + "°");
  sage(abstand(u0, u1) > 3, "das gemalte Bild hat sich gedreht", "Unterschied " + abstand(u0, u1).toFixed(1));
  /* nach rechts wischen = die vordere Seite wandert nach rechts: die Gier nimmt ab */
  sage(P[P.length - 1].gier !== g0 && (((P[P.length - 1].gier - g0 + 540) % 360) - 180) < 0, "die Richtung passt zum Finger (nach rechts wischen dreht die Nase nach rechts)");
  /* ---- senkrecht wischen: kippen 14 → 30 → 55 ---- */
  await pg.evaluate(() => STADT.autoschau.stellen({ gier: 292.5 }));
  const n0 = (await zustand(pg)).neig, s14 = await unterschrift(pg);
  await wischen(pg, [[[mx, my + 90], [mx, my - 110]]], 260, 12);
  await ruhe(pg);
  const n1 = (await zustand(pg)).neig, s30 = await unterschrift(pg);
  await wischen(pg, [[[mx, my + 90], [mx, my - 110]]], 260, 12);
  await ruhe(pg);
  const n2 = (await zustand(pg)).neig, s55 = await unterschrift(pg);
  sage(n0 === 14 && n1 === 30 && n2 === 55, "senkrecht (hoch) wischen kippt 14° → 30° → 55° und rastet ein", n0 + "° → " + n1 + "° → " + n2 + "°");
  sage(abstand(s14, s30) > 3 && abstand(s30, s55) > 3, "die gemalten Bildpunkte ändern sich mit der Neigung", "Unterschied 14/30 " + abstand(s14, s30).toFixed(1) + ", 30/55 " + abstand(s30, s55).toFixed(1));
  const griffOben = await pg.evaluate(() => { const g = document.querySelector(".as-griff").getBoundingClientRect(), k = document.querySelector(".as-kipp").getBoundingClientRect(); return { g: g.top + g.height / 2 - k.top, h: k.height, w: k.width }; });
  sage(griffOben.g < 20 && griffOben.w >= 30, "der Griff am Rand steht bei 55° oben (Tippfläche " + griffOben.w + " px breit)", JSON.stringify(griffOben));
  /* den Griff nach unten ziehen → 14° */
  const kr = await pg.evaluate(() => { const r = document.querySelector(".as-kipp").getBoundingClientRect(); return { x: r.left + r.width / 2, o: r.top + 12, u: r.bottom - 4 }; });
  await wischen(pg, [[[kr.x, kr.o], [kr.x, kr.u]]], 240, 10);
  await ruhe(pg);
  const n3 = (await zustand(pg)).neig;
  /* und zur Mitte → 30° */
  await wischen(pg, [[[kr.x, kr.u], [kr.x, (kr.o + kr.u) / 2 + 6]]], 200, 8);
  await ruhe(pg);
  const n4 = (await zustand(pg)).neig;
  sage(n3 === 14 && n4 === 30, "der Schieber am Rand kippt genauso (unten 14°, Mitte 30°)", n3 + "°, " + n4 + "°");
  /* ---- Kneifen: zwei Finger auseinander ---- */
  const S0 = (await zustand(pg)).S;
  await wischen(pg, [[[mx - 30, my], [mx - 150, my]], [[mx + 30, my], [mx + 150, my]]], 300, 12);
  await ruhe(pg);
  const Zk = await zustand(pg);
  sage(Zk.S > S0 * 1.4, "zwei Finger auseinander zoomen heran", "Maßstab " + S0.toFixed(1) + " → " + Zk.S.toFixed(1) + " CSS-px/m");
  sage(Zk.S >= Zk.Smax - 0.01 && Zk.voll >= 0.999, "bis zur vollen Auflösung der Blätter (1 Blatt-Bildpunkt je Gerätepixel)", "S " + Zk.S.toFixed(1) + " = Grenze " + Zk.Smax.toFixed(1) + ", Blatt-Bildpunkte je Gerätepixel " + Zk.voll.toFixed(2));
  if (BILD) await pg.screenshot({ path: BILD + "-viper-360-nah.png" });
  /* Doppeltipp: zurück – und noch einmal: nah */
  await doppeltippen(pg, mx, my);
  await pg.waitForTimeout(700); await ruhe(pg);
  const Zd1 = await zustand(pg);
  await doppeltippen(pg, mx + 20, my + 10);
  await pg.waitForTimeout(700); await ruhe(pg);
  const Zd2 = await zustand(pg);
  sage(Math.abs(Zd1.S - Zd1.Sfit) < 0.01 && Zd2.S > Zd2.Sfit * 1.3, "Doppeltipp: zurück auf die ganze Ansicht, noch einmal: nah heran", Zk.S.toFixed(1) + " → " + Zd1.S.toFixed(1) + " → " + Zd2.S.toFixed(1));
  /* ---- Zurück-Taste des Browsers ---- */
  const hs = await pg.evaluate(() => history.state && history.state.autoschau);
  await pg.goBack({ waitUntil: "commit" }).catch(() => {});
  await pg.waitForTimeout(500);
  const zu1 = await pg.evaluate(() => ({ offen: STADT.autoschau.zustand().offen, ebene: document.querySelectorAll(".as-ebene").length, stadt: !!document.getElementById("lDinge") && getComputedStyle(document.getElementById("lStadt")).display !== "none", url: location.pathname }));
  sage(hs === "viper" && !zu1.offen && !zu1.ebene && zu1.stadt && /stadt-leicht\.html$/.test(zu1.url), "die Zurück-Taste des Browsers schließt die Schau, die Stadt ist wieder da", JSON.stringify(Object.assign({ eintrag: hs }, zu1)));
  if (BILD) await pg.screenshot({ path: BILD + "-stadt-nach-zurueck-360.png" });
  /* ---- Tipp auf ein fahrendes Auto ---- */
  const t = await pg.evaluate(() => {
    const AU = STADT.autos, a = AU.auto("batmobil"), K = STADT.kamera;
    if (!a) return null;
    for (let i = 0; i < 200 && (a.zustand !== "faehrt" || a.v < 2); i++) AU.vorspulen(0.25);
    K.x = a.x; K.y = a.y; K.s = 18 * K.dpr; AU.folge = "batmobil"; STADT.leicht.unruhe = 2;
    return true;
  });
  await pg.waitForTimeout(400);
  const P2 = await pg.evaluate(() => { const a = STADT.autos.auto("batmobil"), P = STADT.proj(a.x, a.y, 0.5), d = STADT.kamera.dpr; return [P[0] / d, P[1] / d]; });
  await tippen(pg, P2[0], P2[1]);
  await pg.waitForFunction(() => STADT.autoschau.zustand().offen, null, { timeout: 5000 }).catch(() => {});
  await pg.waitForTimeout(400);
  const Zt = await zustand(pg);
  const kn = await pg.evaluate(() => [...document.querySelectorAll(".as-knoepfe button")].map((b) => b.textContent.trim()));
  sage(!!t && Zt.offen && Zt.id === "batmobil" && kn.some((x) => /Hinfahren/.test(x)), "ein Tipp auf das fahrende Batmobil öffnet die Schau (unten „Hinfahren\", „Abstellen\", „Zurück\")", JSON.stringify({ offen: Zt.offen, id: Zt.id, knoepfe: kn }));
  if (Zt.offen) {
    await pg.waitForFunction(() => { const z = STADT.autoschau.zustand(); return z.offen && z.stufen && z.stufen.every((s) => s.fertig || s.fehler); }, null, { timeout: 60000 }).catch(() => {});
    /* „Zurück" unten schließt, der Eintrag in der Geschichte ist wieder weg */
    await pg.evaluate(() => document.querySelector(".as-zurueck").click());
    await pg.waitForTimeout(400);
    const zu2 = await pg.evaluate(() => ({ offen: STADT.autoschau.zustand().offen, eintrag: !!(history.state && history.state.autoschau), ebene: document.querySelectorAll(".as-ebene").length }));
    sage(!zu2.offen && !zu2.eintrag && !zu2.ebene, "„Zurück\" unten schließt die Schau (und nimmt den Eintrag aus der Geschichte)", JSON.stringify(zu2));
  }
  /* Kreuz oben rechts */
  await anschauen(pg, "batmobil");
  await pg.waitForTimeout(200);
  const kreuz = await pg.evaluate(() => { const b = document.querySelector(".as-zu"); if (!b) return null; const r = b.getBoundingClientRect(); b.click(); return [Math.round(r.width), Math.round(r.height)]; });
  await pg.waitForTimeout(400);
  sage(!!kreuz && !(await zustand(pg)).offen && kreuz[0] >= 30, "das Kreuz oben rechts schließt die Schau", JSON.stringify(kreuz));
  sage(!pg.fehler.length, "keine Seitenfehler am Telefon", pg.fehler.join(" | "));

  /* ---- Bildschirmfotos: 3 Winkel × 3 Neigungen ---- */
  const WINKEL = [292.5, 45, 157.5], NEIG = [14, 30, 55];
  const fotos = async (p, id, tag) => {
    const a = await anschauen(p, id);
    if (a) return sage(false, "[" + tag + "] " + id + " öffnen", a);
    await p.waitForFunction(() => { const z = STADT.autoschau.zustand(); return z.offen && z.stufen && z.stufen.every((s) => s.fertig || s.fehler); }, null, { timeout: 60000 }).catch(() => {});
    await p.waitForTimeout(300);
    let schlecht = [];
    for (const n of NEIG) for (const g of WINKEL) {
      await p.evaluate(([g, n]) => STADT.autoschau.stellen({ gier: g, neig: n, S: 0, mitte: true }), [g, n]);
      await p.waitForTimeout(60);
      const L = await anordnung(p);
      if (!L.autoGut || L.ueber.length || L.aus.length) schlecht.push(g + "°/" + n + "° " + JSON.stringify(L.auto) + " " + L.ueber.join(",") + L.aus.join(","));
      if (BILD) await p.screenshot({ path: BILD + "-" + id + "-" + tag + "-g" + g + "-n" + n + ".png" });
    }
    sage(!schlecht.length, "[" + tag + "] " + id + ": bei 3 Winkeln × 3 Neigungen ganz im Bild, nichts überlappt", schlecht.join(" | "));
    await p.evaluate(() => STADT.autoschau.schliessen());
    await p.waitForTimeout(200);
  };
  await fotos(pg, "viper", "360");
  await fotos(pg, "batmobil", "360");
  await pg.close();

  /* =================== RECHNER 1280 × 800 =================== */
  console.log("\nRECHNER 1280 × 800 (Maus)\n");
  const pd = await seite({ width: 1280, height: 800 }, false);
  sage(blaetter(pd).length === 0, "vor dem Öffnen kein Blatt angefragt", blaetter(pd).join(", ") || "keine");
  const a2 = await anschauen(pd, "batmobil");
  sage(!a2, "„Anschauen\" beim Batmobil", a2);
  await pd.waitForFunction(() => { const z = STADT.autoschau.zustand(); return z.offen && z.stufen && z.stufen.every((s) => s.fertig || s.fehler); }, null, { timeout: 60000 }).catch(() => {});
  const D0 = await zustand(pd), LD = await anordnung(pd);
  sage(!LD.aus.length && !LD.klein.length && !LD.ueber.length && LD.autoGut, "nichts überlappt, das Auto ganz im Bild", JSON.stringify(LD));
  /* Maus: waagrecht ziehen dreht */
  const dm = [D0.buehne.x + D0.buehne.w / 2, D0.buehne.y + D0.buehne.h / 2];
  await pd.mouse.move(dm[0] - 150, dm[1]); await pd.mouse.down();
  for (let k = 1; k <= 10; k++) { await pd.mouse.move(dm[0] - 150 + k * 25, dm[1]); await pd.waitForTimeout(16); }
  await pd.mouse.up();
  await ruhe(pd);
  const D1 = await zustand(pd);
  sage(Math.abs(((D1.gier - D0.gier + 540) % 360) - 180) > 20, "mit der Maus ziehen dreht das Auto", D0.gier + "° → " + D1.gier + "°");
  /* Mausrad: heran bis zur vollen Auflösung */
  await pd.mouse.move(dm[0] + 40, dm[1] - 20);
  for (let k = 0; k < 14; k++) { await pd.mouse.wheel(0, -240); await pd.waitForTimeout(30); }
  await pd.waitForTimeout(200);
  const D2 = await zustand(pd);
  sage(D2.S > D0.S * 1.5 && D2.S >= D2.Smax - 0.01 && D2.voll >= 0.999, "das Mausrad zoomt heran – bis zur vollen Auflösung der Blätter", "S " + D0.S.toFixed(1) + " → " + D2.S.toFixed(1) + " (Grenze " + D2.Smax.toFixed(1) + "), Blatt-Bildpunkte je Gerätepixel " + D2.voll.toFixed(2));
  sage(Math.abs(D2.ox) + Math.abs(D2.oy) > 5, "gezoomt wird um den Mauszeiger (nicht nur um die Mitte)", "Verschiebung " + D2.ox.toFixed(0) + ", " + D2.oy.toFixed(0));
  if (BILD) await pd.screenshot({ path: BILD + "-batmobil-1280-nah.png" });
  for (let k = 0; k < 14; k++) { await pd.mouse.wheel(0, 240); await pd.waitForTimeout(30); }
  await pd.waitForTimeout(300);
  const D3 = await zustand(pd);
  sage(Math.abs(D3.S - D3.Sfit) < 0.01, "und wieder zurück auf die ganze Ansicht", D3.S.toFixed(1));
  /* Esc schließt */
  await pd.keyboard.press("Escape"); await pd.waitForTimeout(300);
  sage(!(await zustand(pd)).offen, "Esc schließt die Schau");
  await fotos(pd, "viper", "1280");
  await fotos(pd, "batmobil", "1280");
  /* Zurück-Taste auch am Rechner */
  await anschauen(pd, "viper"); await pd.waitForTimeout(300);
  await pd.goBack({ waitUntil: "commit" }).catch(() => {});
  await pd.waitForTimeout(500);
  const zd = await pd.evaluate(() => ({ offen: STADT.autoschau.zustand().offen, url: location.pathname }));
  sage(!zd.offen && /stadt-leicht\.html$/.test(zd.url), "die Zurück-Taste schließt die Schau (die Seite bleibt)", JSON.stringify(zd));
  sage(!pd.fehler.length, "keine Seitenfehler am Rechner", pd.fehler.join(" | "));
  await pd.close();
  await ende();
})().catch((e) => { console.error(e); process.exit(1); });
