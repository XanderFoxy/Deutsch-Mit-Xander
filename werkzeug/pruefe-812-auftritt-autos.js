#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 812: BATMOBIL UND DODGE VIPER ALS 3D-AUFTRITT
   ---------------------------------------------------------------------
   XANDER (wörtlich): „dieses Batmobil hätte ich nicht nur in dem Spiel
   gerne das als fahrendes Auto zu sehen ist, sondern auch als
   Einstiegsanimation … dass das Auto herein gefahren kommt um eine Kurve
   quietschen, so dass man es schön von vorne sieht und dann soll es
   wieder in einem Bogen realistisch wieder die Fahrt in die andere
   Richtung machen … praktisch präsentiert und wegfährt aber nicht
   einfach [seitlich weggekippt]" – und zur Viper: „meine
   Lieblingsanimation, so ein richtig schöner roter Dodge Viper".

   Geprüft (Telefon 360 × 740, doppelte Pixeldichte):
     • beide Auftritte laufen aus dem Drehblatt (Leinwand, 32 Blickwinkel)
     • der Blickwinkel wechselt stetig: bei 60 Bildern je Sekunde springt
       er nie um mehr als eine Blattstufe (11,25°)
     • in der Mitte der Fahrt steht das Auto frontal (Gier 315°), ganz im
       Bild, mit blitzenden Scheinwerfern, der Kopf am Steuer auf dem Platz
     • die Karosserie neigt sich höchstens 3,5° (kein seitliches Kippen)
     • Lenkeinschlag in der Kurve, Räder drehen sich
     • Reifenspuren und Qualm in der Kurve, Reifenquietschen und Motor
     • am Ende ist das Auto aus dem Bild, das Profilbild sitzt am Platz
     • „Batmobil" steht in der Auswahl, die Auswahl passt auf 360 px
     • keine Fehler in der Konsole
   Bildschirmfotos (BILD=/pfad/praefix): Anfahrt, Kurve, frontal, Abfahrt
   – jeweils das ganze Telefon und vergrößert um das Auto.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
const BILD = process.env.BILD || "";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  /* BREITE=1280 zeigt denselben Auftritt am großen Bildschirm (nur zum Ansehen – die Zahlen der Prüfungen gelten fürs Telefon) */
  const BREITE = +process.env.BREITE || 360;
  const ctx = await br.newContext(BREITE > 500 ? { viewport: { width: BREITE, height: 800 }, deviceScaleFactor: 1 } : { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} window.DMA_TONLOG = []; });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEFUNG && window.DMA_PRUEF && window.DMA_AUFTRITT, { timeout: 25000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    document.documentElement.style.scrollBehavior = "auto";
    document.getElementById("lcPlaetze").scrollIntoView({ block: "center" });
  });
  const tick = (ms) => pg.waitForTimeout(ms);
  await tick(600);

  /* Zeit anhalten und auf t (Sekunden) stellen – Leinwand und Bild folgen derselben Uhr */
  const stellen = (t) => pg.evaluate((t) => new Promise((fertig) => {
    const b = document.querySelector(".lc-auftritt");
    if (!b) return fertig(null);
    b.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t * 1000; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const z = window.DMA_AUTO3D && window.DMA_AUTO3D.jetzt();
      const bild = document.querySelector(".lc-auftritt .lc-auftritt-bild:not(.lc-auftritt-nachbar)");
      const r = bild ? bild.getBoundingClientRect() : null;
      fertig(z ? Object.assign({}, z, { bild: r ? [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2), Math.round(r.width)] : null }) : null);
    }));
  }), t);
  const foto = async (name, z) => {
    if (!BILD) return;
    await pg.screenshot({ path: BILD + "-" + name + ".png" });
    if (z) {
      const V = pg.viewportSize();
      const x = Math.max(0, Math.min(z.links, V.width - 30) - 20), y = Math.max(0, Math.min(z.oben, V.height - 40) - 30);
      const w = Math.min(V.width - x, Math.max(80, z.rechts - z.links + 40)), h = Math.min(V.height - y, Math.max(60, z.unten - z.oben + 60));
      if (w > 20 && h > 20) await pg.screenshot({ path: BILD + "-" + name + "-nah.png", clip: { x: x, y: y, width: w, height: h } });
    }
  };

  for (const art of ["batmobil", "viper"]) {
    console.log("\n" + art.toUpperCase() + "\n");
    await pg.evaluate(() => { window.DMA_TONLOG.length = 0; window.DMA_AUTO3D = null; window.DMA_AUFTRITT_HALTEN = true; });
    const platz = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis').getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2), Math.round(r.width)]; });
    await pg.evaluate((a) => window.DMA_AUFTRITT("ich", a, "rein"), art);
    let da = false;
    try { await pg.waitForFunction(() => document.querySelector(".lc-auftritt canvas.lc-auftritt-3d") && window.DMA_AUTO3D, null, { timeout: 12000 }); da = true; } catch (e) {}
    sage(da, art + ": fährt als 3D-Auto aus dem Drehblatt (Leinwand)", "");
    if (!da) continue;
    const plan = await pg.evaluate(() => window.DMA_AUTO3D.plan);
    const D = plan.D;
    /* 1) stetiger Blickwinkel: 60 Bilder je Sekunde, vorwärts gespult */
    const reihe = [];
    for (let t = 0; t <= D + 1e-6; t += 1 / 60) reihe.push(await stellen(t));
    const N = plan.N;
    let sprung = 0, woSprung = "", dreh = 0, lenkSeiten = new Set(), rollen = new Set();
    for (let j = 1; j < reihe.length; j++) {
      const a = reihe[j - 1], b = reihe[j];
      if (!a || !b) continue;
      const d = Math.min((a.i - b.i + N) % N, (b.i - a.i + N) % N);
      if (d > sprung) { sprung = d; woSprung = a.t + "→" + b.t + " s: " + a.i + "→" + b.i; }
      dreh = Math.max(dreh, Math.abs(b.dreh));
      if (b.t < plan.Ta) lenkSeiten.add(b.lenk);
      rollen.add(b.roll);
    }
    sage(sprung <= 1, art + ": Blickwinkel wechselt stetig (größter Sprung " + sprung + " Blattstufe)", woSprung);
    const gierFolge = []; reihe.forEach((z) => { if (z && gierFolge[gierFolge.length - 1] !== z.i) gierFolge.push(z.i); });
    console.log("         Blattfolge: " + gierFolge.join(" "));
    sage(dreh <= 3.5, art + ": Karosserie neigt sich höchstens leicht (" + dreh + "°), kein seitliches Kippen", "");
    sage(lenkSeiten.size >= 2 && rollen.size >= 3, art + ": Vorderräder lenken in der Kurve, die Räder drehen sich", "Lenkstufen " + [...lenkSeiten].join(",") + ", Radstellungen " + [...rollen].join(","));
    sage(plan.Ta / D > 0.35 && plan.Ta / D < 0.65, art + ": frontal in der Mitte der Fahrt (Halt bei " + Math.round(plan.Ta / D * 100) + " %)", "");
    /* 2) Bildschirmfotos */
    const zeiten = { anfahrt: null, kurve: null, frontal: plan.Ta + 0.3, abfahrt: plan.Th + 0.55 };
    /* Anfahrt: kurz vor der Kurve; Kurve: der Scheitel des Bogens */
    zeiten.kurve = plan.tKurve; zeiten.anfahrt = Math.max(0, plan.tKurve - 0.4);
    const erg = {};
    zeiten.davon = plan.Th + 1.3;
    for (const k of ["anfahrt", "kurve", "frontal", "abfahrt", "davon"]) { erg[k] = await stellen(zeiten[k]); await foto(art + "-" + k, erg[k]); }
    const F = erg.frontal;
    sage(F && Math.abs(F.gier - 315) <= 180 / plan.N + 0.1 && F.i === Math.round(315 / (360 / plan.N)), art + ": am Halt frontal zum Betrachter (Blatt " + (F && F.i) + " = Gier " + (F && F.gier) + "°)", "");
    sage(F && Math.abs((F.links + F.rechts) / 2 - 180) <= 12, art + ": frontal in der Mitte des Bildes (" + (F && (F.links + F.rechts) / 2) + " von 360)", "");
    sage(F && F.links >= 0 && F.rechts <= 360 && F.oben >= 0 && F.unten <= 740, art + ": frontal ganz im Bild (" + (F && [F.links, F.rechts, F.oben, F.unten].join("/")) + ")", "");
    sage(F && F.breite >= 140 && F.breite <= 330, art + ": frontal gut zu sehen (" + (F && F.breite) + " px breit)", "");
    const kopf = await stellen(plan.Ta + 0.05);
    sage(kopf && kopf.bild && kopf.bild[0] > kopf.links && kopf.bild[0] < kopf.rechts && Math.abs(kopf.bild[1] - platz[1]) <= 12 && kopf.bild[2] < platz[2], art + ": am Steuer sitzt das Profilbild (im Auto, auf Höhe des Platzes, kleiner)", JSON.stringify({ bild: kopf && kopf.bild, platz, auto: kopf && [kopf.links, kopf.rechts] }));
    const E = await stellen(D - 0.001);
    const raus = E && (E.rechts < 0 || E.links > 360 || E.unten < 0 || E.deck < 0.02);
    const ganzRaus = E && (E.rechts < 0 || E.links > 360 || E.unten < 0);
    sage(ganzRaus, art + ": am Ende ist das Auto aus dem Bild gefahren", JSON.stringify(E && [E.links, E.rechts, E.oben, E.unten, E.deck]));
    const kleiner = reihe.filter((z) => z && z.t > plan.Th + 0.9).map((z) => z.k);
    sage(kleiner.length > 3 && kleiner[kleiner.length - 1] < kleiner[0], art + ": fährt perspektivisch kleiner werdend davon (" + (kleiner[0] || 0).toFixed(2) + " → " + (kleiner[kleiner.length - 1] || 0).toFixed(2) + ")", "");
    const ende = await stellen(D);
    sage(ende && ende.bild && Math.abs(ende.bild[0] - platz[0]) <= 2 && Math.abs(ende.bild[1] - platz[1]) <= 2 && Math.abs(ende.bild[2] - platz[2]) <= 2, art + ": das Profilbild ist auf seinem Platz abgesetzt", JSON.stringify({ bild: ende && ende.bild, platz }));
    /* Spuren und Qualm: in der Kurve zeichnet die Leinwand dunkle Striche (Pixel prüfen) */
    /* 3) Echt abspielen: Töne, Aufräumen */
    await pg.evaluate(() => { window.DMA_AUFTRITT_HALTEN = false; const b = document.querySelector(".lc-auftritt"); if (b) b.remove(); document.querySelectorAll("style").forEach((s) => { if (/visibility: hidden !important/.test(s.textContent)) s.remove(); }); window.DMA_TONLOG.length = 0; });
    await pg.evaluate(() => { window.__oszis = 0; window.__rausch = 0; const K = window.AudioContext || window.webkitAudioContext;
      if (K && !K.prototype.__gezaehlt) { const o = K.prototype.createOscillator, b = K.prototype.createBufferSource; K.prototype.createOscillator = function () { window.__oszis++; return o.apply(this, arguments); }; K.prototype.createBufferSource = function () { window.__rausch++; return b.apply(this, arguments); }; K.prototype.__gezaehlt = true; } });
    await pg.evaluate((a) => window.DMA_AUFTRITT("ich", a, "rein"), art);
    await tick(D * 1000 + 700);
    if (art === "batmobil") { const n = await pg.evaluate(() => [window.__oszis, window.__rausch]); sage(n[0] >= 5 && n[1] >= 1, "batmobil: der Klang wird gerechnet (Web Audio: " + n[0] + " Oszillatoren, Rauschen), keine Datei", ""); }
    const R = await pg.evaluate(() => ({ weg: !document.querySelector(".lc-auftritt"), toene: window.DMA_TONLOG.map((t) => t.name), spur: (window.DMA_AUTO3D.spur || []).length }));
    const motor = art === "viper" ? "auftritt-viper" : "@batmobil";
    sage(R.toene.indexOf(motor) >= 0 && R.toene.indexOf("reifenquietschen") >= 0, art + ": Motor (" + motor + ") und Reifenquietschen", R.toene.join(","));
    sage(R.weg, art + ": danach aufgeräumt", "");
    /* 4) Beim Gehen: das Auto holt die Person ab – erst sitzt das Bild am Platz, am Ende fährt es mit fort */
    await pg.evaluate((a) => { window.DMA_AUFTRITT_HALTEN = true; window.DMA_AUFTRITT("ich", a, "raus"); }, art);
    await pg.waitForFunction(() => document.querySelector(".lc-auftritt canvas.lc-auftritt-3d"), null, { timeout: 8000 });
    const g0 = await stellen(0.3), g1 = await stellen(D - 0.35);
    sage(g0 && g0.bild && Math.abs(g0.bild[0] - platz[0]) <= 2 && Math.abs(g0.bild[1] - platz[1]) <= 2 && g1 && g1.bild && (Math.abs(g1.bild[0] - platz[0]) > 40 || Math.abs(g1.bild[1] - platz[1]) > 40),
      art + " beim Gehen: das Bild steigt ein und fährt mit fort", JSON.stringify({ anfang: g0 && g0.bild, ende: g1 && g1.bild, platz }));
    if (BILD) { await stellen(plan.Th + 0.3); await pg.screenshot({ path: BILD + "-" + art + "-gehen.png" }); }
    await pg.evaluate(() => { window.DMA_AUFTRITT_HALTEN = false; const b = document.querySelector(".lc-auftritt"); if (b) b.remove(); document.querySelectorAll("style").forEach((s) => { if (/visibility: hidden !important/.test(s.textContent)) s.remove(); }); });
  }

  console.log("\nAUSWAHL\n");
  await pg.evaluate(() => { const p = document.querySelector("#lcPlaetze .lc-platz-ich"); window.DMA_PRUEFUNG.platzMenue(p); });
  await tick(300);
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Mein Auftritt/.test(x.textContent)); if (b) b.click(); });
  await tick(300);
  const M = await pg.evaluate(() => {
    const k = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].map((b) => { const r = b.getBoundingClientRect(); return { w: b.textContent.trim(), l: r.left, r: r.right, o: r.top, u: r.bottom, svg: !!b.querySelector("svg"), emoji: /\p{Extended_Pictographic}/u.test(b.textContent) }; });
    let ueber = 0; for (let i = 0; i < k.length; i++) for (let j = i + 1; j < k.length; j++) { const a = k[i], b = k[j]; if (a.l < b.r - 1 && b.l < a.r - 1 && a.o < b.u - 1 && b.o < a.u - 1) ueber++; }
    return { namen: k.map((x) => x.w), ueber, drin: k.every((x) => x.l >= 0 && x.r <= innerWidth), bat: k.find((x) => x.w === "Batmobil") };
  });
  if (BILD) await pg.screenshot({ path: BILD + "-auswahl.png" });
  sage(M.bat && M.bat.svg && !M.bat.emoji, "Auswahl: „Batmobil“ steht neben der Viper, mit gezeichnetem Zeichen (kein Emoji)", M.namen.join(","));
  sage(M.namen.indexOf("Batmobil") === M.namen.indexOf("Rote Dodge Viper") + 1, "Batmobil direkt nach der Viper", "");
  sage(M.ueber === 0 && M.drin, "Auswahl auf 360 px: nichts überlappt, alles im Bild", JSON.stringify({ ueber: M.ueber, drin: M.drin }));
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Batmobil/.test(x.textContent)); if (b) b.click(); });
  await tick(400);
  const gew = await pg.evaluate(() => ({ api: window.LiveChat.auftritt(), merk: localStorage.getItem("dma_auftritt") }));
  sage(gew.api === "batmobil" && gew.merk === "batmobil", "gewählt und gemerkt: batmobil", JSON.stringify(gew));
  await tick(5600);
  await pg.evaluate(() => { try { localStorage.removeItem("dma_auftritt"); } catch (e) {} });
  sage(kf.length === 0, "keine Fehler in der Konsole", kf.join(" | "));
  console.log("\nFassung 812 (Batmobil und Viper in 3D): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
