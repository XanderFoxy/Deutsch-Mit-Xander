#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 829: RATHAUS (GIEBEL VORN), KOLOSSEUM, EISDIELE, BERGWERK
   ---------------------------------------------------------------------
   XANDER (29.09.): „Da gibt es wirklich nicht dieses Dach auf der Seite.
   Das ist einfach nur ein Haus zur Seite und das was du als Dach da
   gemacht hast. Das ist eigentlich die Ansicht auf die wir gucken auf dem
   Foto … Also dieser dreieckige Teil den wir im Gesicht haben." – „siehst
   du nicht im Foto, dass das in diesem Seitenflügel noch so ein Balkon
   hat, so Blumenkästen, wo es sehr auffällig dort noch ist, wo das
   hervorsteht … wie der Teil, der hinterm Rathaus langgeht, dass der
   richtig vermessen ist und nicht zu weit links vom hinteren Rathaus
   weggeht" – „Guck mal, dass du noch ein realistisches Kolosseum baust …
   dass das dann von der Größenordnung zum Döbelner Rathaus passt" – „bei
   den Schmück-Sachen oder Bausachen eine Eisdiele machen, wo dann die
   Leute auch mal Eis essen gehen können" – „du hast das Bergwerk nicht
   mit der Öffnung zu uns gestellt … schade dass dahinten nicht noch mehr
   Berg dran ist … sieht aus wie ein Bunker".
   Geprüft:
   RATHAUS (Modell in Node gebaut)
     • der große Stufengiebel an Flügel A schaut nach vorn (+y, zum Brunnen)
     • über A genau EIN First, und der läuft nach hinten (kein Dach quer)
     • kein Stufengiebel an der Seite (keiner schaut nach ±x)
     • Balkon vorn am Flügel, weit vorgezogen (≥ 1 m), links zum Turm hin,
       mit mindestens fünf Blumenkästen auf der Brüstung
     • Flügel B ragt höchstens 1,5 m links über die Turmkante hinaus
   KOLOSSEUM
     • Modell: oval 189 : 156, Maßstab = der des Rathauses im Dorf
       (Modell 1:1,5 × D.MASS 0,7), vier Geschosse (Außenwand 48 m echt
       hoch), eine Seite eingestürzt (niedriger zweiter Ring), Arena
     • in der Schmücken-Leiste unter „Wahrzeichen", Bildchen von vorn
     • alle Bilder gebacken (8 Winkel, Winter/Herbst, Tag/Nacht, g/k/z)
     • setzbar: steht danach in der Stadt, von vorn gezeichnet (_f_315)
   EISDIELE
     • Modell: Pavillon, Markise, drei Tische mit Schirmen, Leute (≥ 2)
     • in der Schmücken-Leiste (nicht bei den Wahrzeichen), Bildchen von vorn
     • alle Bilder gebacken; setzbar, von vorn gezeichnet
   BERGWERK
     • in der Beispielstadt zeigt das Mundloch in der Grundansicht zum
       Betrachter (Bild _f_315, Front des Modells zeigt im Bild nach unten)
     • die Bau-Leiste zeigt das Bergwerk ebenso von vorn (_f_315_k)
     • hinter dem Stollenhügel steigt ein Berg an (≥ 10 m, ≥ 1,4 × Hügel)
   ALLGEMEIN: keine Seitenfehler; Leiste auf 360 px ohne Überlappung.
   AUFRUF: node werkzeug/pruefe-829-modelle.js
     WURZEL=/pfad (Gegenprobe mit altem Stand), BILD=/pfad/praefix (Fotos)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), vm = require("vm");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log("  " + (gut ? "ok  " : "FEHL") + " " + was + (zusatz ? "   " + zusatz : "")); };
const r2 = (z) => Math.round(z * 100) / 100;
const lies = (p) => { try { return fs.readFileSync(path.join(WURZEL, p), "utf8"); } catch (e) { return null; } };

/* ---------- Modelle in Node bauen (ohne Malen) ---------- */
function umgebung() {
  const MOD = {};
  const stumm = () => stumm;
  const PI = new Proxy({}, { get: () => () => [200, 200, 200] });
  const ST = { pinsel: PI, KX: Math.SQRT1_2, KY: Math.SQRT1_2 * 0.5, KZ: Math.sqrt(3) / 2, modell: (id, def) => { MOD[id] = def; }, hash2: () => 0.5, zufall: () => () => 0.5, rausch: () => 0.5, fbm: () => 0.5, kamera: { dreh: 0 } };
  const ctx = { window: { STADT: ST }, Math, Object, Array, console, Map, Set, JSON, Infinity, Float32Array, Uint8Array, document: { createElement: () => ({ getContext: () => new Proxy({}, { get: () => stumm }) }) } };
  vm.createContext(ctx);
  return { MOD, ST, ctx };
}
function bauen(def, o) {
  const teile = [], flaechen = [], figuren = [];
  const M = {
    akt: null,
    teil(name) { const t = { name: name, flaechen: [], figuren: [] }; teile.push(t); M.akt = t; return t; },
    flaeche(f) { f.teil = M.akt && M.akt.name; M.akt.flaechen.push(f); flaechen.push(f); return f; },
    figur(f) { f.teil = M.akt && M.akt.name; M.akt.figuren.push(f); figuren.push(f); return f; },
    quader(q, m) {
      const x0 = q.x, y0 = q.y, z0 = q.z || 0, x1 = q.x + q.b, y1 = q.y + q.t, z1 = z0 + q.h;
      const f = (name, oo, u, w) => { if (m[name] != null) M.flaeche({ name: name, o: oo, u: u, v: [0, 0, -1], w: w, h: q.h }); };
      f("sued", [x0, y1, z1], [1, 0, 0], q.b); f("nord", [x1, y0, z1], [-1, 0, 0], q.b); f("ost", [x1, y1, z1], [0, -1, 0], q.t); f("west", [x0, y0, z1], [0, 1, 0], q.t);
      if (m.oben != null) M.flaeche({ name: "oben", o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: q.b, h: q.t });
    },
    licht() {}, bodenlicht() {}, rauchAus() {}, lebendig() {}
  };
  M.teil("rumpf");
  def.bauen(M, Object.assign({ bau: 1, objekt: { gier: 0 }, jahr: "herbst" }, o || {}));
  for (const f of flaechen) {
    if (!f.umriss) f.umriss = [[0, 0], [f.w, 0], [f.w, f.h], [0, f.h]];
    f.P = f.umriss.map(([a, b]) => [f.o[0] + f.u[0] * a + f.v[0] * b, f.o[1] + f.u[1] * a + f.v[1] * b, f.o[2] + f.u[2] * a + f.v[2] * b]);
    const n = [f.u[1] * f.v[2] - f.u[2] * f.v[1], f.u[2] * f.v[0] - f.u[0] * f.v[2], f.u[0] * f.v[1] - f.u[1] * f.v[0]];
    const l = Math.hypot(...n) || 1; f.n = n.map((z) => z / l);
    let A = 0; for (let i = 0; i < f.umriss.length; i++) { const p = f.umriss[i], q = f.umriss[(i + 1) % f.umriss.length]; A += p[0] * q[1] - q[0] * p[1]; }
    f.flaeche = Math.abs(A) / 2;
    f.m = f.P.reduce((s, p) => [s[0] + p[0] / f.P.length, s[1] + p[1] / f.P.length, s[2] + p[2] / f.P.length], [0, 0, 0]);
  }
  return { teile, flaechen, figuren };
}
const innen = (p, poly, rand) => {
  const xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1]);
  return p[0] >= Math.min(...xs) - rand && p[0] <= Math.max(...xs) + rand && p[1] >= Math.min(...ys) - rand && p[1] <= Math.max(...ys) + rand;
};

(async () => {
  /* ================= RATHAUS ================= */
  console.log("\nRATHAUS DÖBELN: GIEBEL VORN, EIN FIRST NACH HINTEN, BALKON MIT BLUMENKÄSTEN\n");
  {
    const U = umgebung();
    vm.runInContext(lies("stadt/modelle/rathaus_doebeln.js"), U.ctx);
    const def = U.MOD.rathaus_doebeln, G = def.grundriss, A = G.teile.A;
    const { flaechen } = bauen(def);
    const aX0 = Math.min(...A.flat().map((p) => p[0])), aX1 = Math.max(...A.flat().map((p) => p[0]));
    const aY1 = Math.max(...A.flat().map((p) => p[1]));
    const ueberA = (p, rand) => A.some((poly) => innen(p, poly, rand));
    /* Stufengiebel: senkrechte Flächen mit vielen Ecken über A, die bemalte Außenseite */
    const giebel = flaechen.filter((f) => Math.abs(f.n[2]) < 0.05 && f.umriss.length > 25 && ueberA(f.m, 0.8) && f.m[2] > 11 && /v$/.test(f.name || ""));
    const vorn = giebel.filter((f) => f.n[1] > 0.99 && f.m[1] > aY1 - 0.8);
    const seite = giebel.filter((f) => Math.abs(f.n[0]) > 0.9);
    sage(vorn.length === 1, "der große Stufengiebel an Flügel A schaut nach vorn zum Brunnen (+y)", giebel.map((f) => f.name + " n=" + f.n.map(r2).join("/") + " y=" + r2(f.m[1])).join(", ") + " (Front y=" + r2(aY1) + ")");
    sage(seite.length === 0, "kein Stufengiebel an der Seite von Flügel A („nicht dieses Dach auf der Seite“)", seite.map((f) => f.name).join(", "));
    /* Firste: Oberkanten großer Dachflächen über A */
    const dach = flaechen.filter((f) => Math.abs(f.n[2]) > 0.3 && Math.abs(f.n[2]) < 0.95 && f.flaeche > 6 && ueberA(f.m, 0.6));
    const firste = [];
    for (const f of dach) {
      const zMax = Math.max(...f.P.map((p) => p[2])), oben = f.P.filter((p) => zMax - p[2] < 0.05);
      let l = 0, a = null, b = null; for (const p of oben) for (const q of oben) { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d > l) { l = d; a = p; b = q; } }
      if (l > 2) firste.push({ f: f.name, richtung: Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]) ? "quer" : "nach hinten", x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, z: zMax, l: l });
    }
    const linien = [];
    for (const k of firste) { if (!linien.some((L) => L.richtung === k.richtung && Math.abs(L.z - k.z) < 0.1 && (k.richtung === "quer" ? Math.abs(L.y - k.y) < 0.1 : Math.abs(L.x - k.x) < 0.1))) linien.push(k); }
    sage(linien.length === 1 && linien[0].richtung === "nach hinten", "über Flügel A genau EIN First, und der läuft nach hinten (kein zweites Dach quer)", linien.map((L) => L.richtung + " x=" + r2(L.x) + " z=" + r2(L.z) + " (" + r2(L.l) + " m)").join(" | ") || "keiner");
    sage(vorn.length === 1 && linien.length === 1 && Math.abs(vorn[0].m[0] - linien[0].x) < 0.3, "der Giebel steht mittig unter dem First (das Dach gehört zu ihm)", vorn[0] ? "Giebel x=" + r2(vorn[0].m[0]) : "—");
    /* Balkon und Blumenkästen */
    const balkon = flaechen.filter((f) => /^balkon/i.test(f.teil || ""));
    const kaesten = [...new Set(balkon.filter((f) => /blumen/.test(f.teil)).map((f) => f.teil))];
    const bz = balkon.filter((f) => /blumen/.test(f.teil)).map((f) => Math.min(...f.P.map((p) => p[2])));
    const yMax = balkon.length ? Math.max(...balkon.map((f) => Math.max(...f.P.map((p) => p[1])))) : -Infinity;
    const xm = balkon.length ? balkon.reduce((s, f) => s + f.m[0], 0) / balkon.length : Infinity;
    const giebelMitte = vorn[0] ? vorn[0].m[0] : (aX0 + aX1) / 2;
    sage(balkon.length > 0 && yMax - aY1 >= 1.0 && xm < giebelMitte, "Balkon vorn am Flügel, weit vorgezogen und links zum Turm hin (wie auf dem Foto)", "vor " + r2(yMax - aY1) + " m, Mitte x=" + r2(xm) + " (Giebelmitte " + r2(giebelMitte) + ")");
    sage(kaesten.length >= 5 && bz.length && Math.min(...bz) >= 4.9, "auf der Brüstung stehen mindestens fünf Blumenkästen", kaesten.length + " Kästen, Unterkante " + (bz.length ? r2(Math.min(...bz)) : "—") + " m");
    /* Flügel B nicht zu weit links */
    const turm = G.teile.turm[0], B = G.teile.B[0];
    const links = Math.min(...turm.map((p) => p[0])) - Math.min(...B.map((p) => p[0]));
    sage(links <= 1.5, "Flügel B ragt höchstens 1,5 m links über die Turmkante hinaus („nicht zu weit links“)", r2(links) + " m");
  }

  /* ================= KOLOSSEUM, EISDIELE, BERGSTOLLEN (Modelle) ================= */
  console.log("\nKOLOSSEUM UND EISDIELE (Modelle)\n");
  const kolText = lies("stadt/modelle/kolosseum.js"), eisText = lies("stadt/modelle/eisdiele.js");
  let kolDef = null, eisDef = null;
  {
    const U = umgebung();
    try { if (kolText) vm.runInContext(kolText, U.ctx); if (eisText) vm.runInContext(eisText, U.ctx); } catch (e) { console.log("  (Modellfehler: " + e.message + ")"); }
    kolDef = U.MOD.kolosseum || null; eisDef = U.MOD.eisdiele || null;
  }
  const doerfl = lies("stadt-leicht/dorf.js") || "";
  const massR = +((/D\.MASS = \{ rathaus: ([0-9.]+) \}/.exec(doerfl) || [0, NaN])[1]);
  const K_SOLL = massR / 1.5;   // Rathaus-Modell 1:1,5, im Dorf mit D.MASS
  if (kolDef) {
    const m = kolDef.masse || {}, { flaechen, teile } = bauen(kolDef);
    sage(Math.abs(m.laenge / m.breite - 189 / 156) < 0.01 && Math.abs(kolDef.grund[0] - m.laenge) < 0.05 && Math.abs(kolDef.grund[1] - m.breite) < 0.05, "oval wie das echte (189 : 156), Grundfläche = Außenellipse", r2(m.laenge) + " × " + r2(m.breite) + " m");
    sage(Math.abs(m.K - K_SOLL) / K_SOLL < 0.01 && Math.abs(m.laenge - 189 * K_SOLL) < 0.5 && Math.abs(m.hoehe - 48 * K_SOLL) < 0.3, "Maßstab wie das Rathaus im Dorf (1:1,5 × D.MASS " + massR + " = " + r2(K_SOLL) + " der echten Größe)", "K=" + m.K + ", Höhe " + r2(m.hoehe) + " m");
    const aussen = flaechen.filter((f) => /^aussen/.test(f.name));
    const hoehen = aussen.map((f) => f.h);
    sage(aussen.length >= 24 && Math.min(...hoehen) > 0.99 * m.hoehe, "vierstöckige Außenwand (drei Arkadenreihen und Attika) auf dem größten Teil des Rings", aussen.length + " Segmente, " + r2(Math.min(...hoehen)) + " m hoch");
    const ring2 = flaechen.filter((f) => /^ring2/.test(f.name)), schnitt = flaechen.filter((f) => /^schnitt/.test(f.name));
    sage(ring2.length >= 6 && ring2.every((f) => f.h < 0.55 * m.hoehe) && schnitt.length === 2, "eine Seite eingestürzt: niedriger zweiter Ring, an beiden Enden der Schnitt", ring2.length + " Segmente, " + schnitt.length + " Schnitte");
    sage(flaechen.some((f) => f.name === "arena") && flaechen.filter((f) => /^rang/.test(f.name)).length >= 60, "innen Ränge und Arena", flaechen.filter((f) => /^rang/.test(f.name)).length + " Rangflächen, " + teile.length + " Teile");
  } else sage(false, "Modell stadt/modelle/kolosseum.js vorhanden und angemeldet");
  if (eisDef) {
    const { teile, figuren, flaechen } = bauen(eisDef);
    const leute = teile.filter((t) => /^leute/.test(t.name) && t.figuren.length), tische = teile.filter((t) => /^tisch/.test(t.name) && t.figuren.length);
    sage(flaechen.some((f) => f.name === "markise") && flaechen.some((f) => f.name === "schild") && tische.length >= 3 && leute.length >= 2,
      "Eisdiele: Pavillon mit Markise und Schild, drei Tische mit Schirmen, Leute beim Eisessen", tische.length + " Tische, " + leute.length + " Leute, " + figuren.length + " Figuren");
  } else sage(false, "Modell stadt/modelle/eisdiele.js vorhanden und angemeldet");

  console.log("\nBERGWERK: BERG DAHINTER\n");
  {
    const doc = { createElement: () => ({ getContext: () => new Proxy({}, { get: () => () => {} }) }) };
    const ctx = { window: {}, document: doc, Math, Object, Array, console, Map, Set, JSON, Float32Array, Uint8Array, Infinity, performance: { now: () => 0 }, navigator: {}, location: { search: "" }, DOMMatrix: function () {} };
    vm.createContext(ctx); vm.runInContext("var window = this.window;", ctx);
    let vornH = 0, hintenH = 0;
    try {
      vm.runInContext(lies("stadt/kern.js"), ctx);
      ctx.window.STADT.pinsel = ctx.window.STADT.pinsel || {};
      vm.runInContext(lies("stadt/modelle/bergstollen.js"), ctx);
      const B = ctx.window.STADT.BERGSTOLLEN;
      for (let x = -10; x <= 10; x += 0.25) for (let y = -12.5; y <= 7; y += 0.25) { const h = B.hoehe(x, y); if (y < -3.5) hintenH = Math.max(hintenH, h); else vornH = Math.max(vornH, h); }
    } catch (e) { console.log("  (Fehler: " + e.message + ")"); }
    sage(hintenH >= 10 && hintenH >= 1.4 * vornH, "hinter dem Stollenhügel steigt ein Berg an (kein flacher Bunker)", "Hügel vorn " + r2(vornH) + " m, Berg dahinter " + r2(hintenH) + " m");
  }

  /* ================= IM BROWSER ================= */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const alleFehler = [];
  const seite = async (query, vp) => {
    const ctx = await br.newContext({ viewport: vp || { width: 900, height: 700 }, hasTouch: true });
    const pg = await ctx.newPage();
    pg.setDefaultTimeout(120000);
    pg.on("pageerror", (e) => alleFehler.push(e.message));
    await pg.goto(basis + "/stadt-leicht.html?demo=1&" + query, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(600);
    return pg;
  };
  const warteBilder = (pg) => pg.waitForFunction(() => window.STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});

  console.log("\nIM VERZEICHNIS UND IN DER SCHMÜCKEN-LEISTE\n");
  const pg = await seite("jahr=herbst&zeit=tag", { width: 360, height: 740 });
  const vz = await pg.evaluate(() => window.STADT.bilder.lade ? null : null).catch(() => null);
  void vz;
  const vzDaten = JSON.parse(fs.readFileSync(path.join(WURZEL, "stadt-leicht", "bilder", "verzeichnis.json"), "utf8"));
  for (const [name, was] of [["w_kolosseum", "Kolosseum"], ["d_eisdiele", "Eisdiele"]]) {
    const fehlt = [];
    for (const w of [0, 45, 90, 135, 180, 225, 270, 315]) for (const j of ["winter", "herbst"]) for (const t of ["tag", "nacht"]) for (const s of ["g", "k", "z"]) {
      const n = [name, j, t, "f", w, s].join("_");
      if (!vzDaten[n] || !fs.existsSync(path.join(WURZEL, "stadt-leicht", "bilder", n + ".webp"))) fehlt.push(n);
    }
    sage(fehlt.length === 0, was + ": alle 96 Bilder gebacken (8 Winkel, Winter/Herbst, Tag/Nacht, g/k/z) und im Verzeichnis", fehlt.length ? fehlt.length + " fehlen, z. B. " + fehlt[0] : "");
  }
  await pg.locator(".lk-schmuck").first().tap(); await pg.waitForTimeout(700);
  const leiste = await pg.evaluate(() => {
    const L = document.querySelector(".lk-leiste"); if (!L) return null;
    const aus = []; let gruppe = "";
    for (const k of L.children) {
      if (k.classList.contains("lk-gruppe")) { gruppe = k.textContent.trim(); continue; }
      const img = k.querySelector("img"), r = k.getBoundingClientRect();
      aus.push({ text: (k.querySelector("span") || {}).textContent, gruppe: gruppe, src: img ? img.getAttribute("src").split("?")[0].split("/").pop() : "", w: r.width, h: r.height });
    }
    return aus;
  });
  const karte = (t) => (leiste || []).find((k) => k.text === t);
  const kol = karte("Kolosseum"), eis = karte("Eisdiele");
  sage(!!kol && kol.gruppe === "Wahrzeichen" && /^w_kolosseum_herbst_tag_f_315_k\.webp$/.test(kol.src), "Kolosseum in der Schmücken-Leiste bei den Wahrzeichen, Bildchen von vorn", JSON.stringify(kol));
  sage(!!eis && eis.gruppe !== "Wahrzeichen" && /^d_eisdiele_herbst_tag_f_315_k\.webp$/.test(eis.src), "Eisdiele in der Schmücken-Leiste (Schmuck), Bildchen von vorn", JSON.stringify(eis));
  sage(!!kol && !!eis && Math.min(kol.w, kol.h, eis.w, eis.h) >= 30, "die neuen Karten sind Tippflächen ≥ 30 px", kol && eis ? [kol.w, kol.h, eis.w, eis.h].map(Math.round).join("/") : "");
  /* Bildchen wirklich geladen? */
  const bildchen = await pg.evaluate(() => [...document.querySelectorAll(".lk-leiste img")].filter((i) => /kolosseum|eisdiele/.test(i.src)).map((i) => ({ src: i.src.split("/").pop(), ok: i.complete && i.naturalWidth > 0 })));
  sage(bildchen.length === 2 && bildchen.every((b) => b.ok), "die Bildchen laden", JSON.stringify(bildchen));
  if (BILD) await pg.screenshot({ path: BILD + "-leiste.png" });

  console.log("\nSETZEN\n");
  const setzen = async (text, bild) => {
    await pg.evaluate(() => { try { localStorage.removeItem("leicht_deko_v1"); } catch (e) {} });
    const k = pg.locator(".lk-leiste .lk-karte-klein", { hasText: text }).first();
    if (!(await k.count())) return { ok: false, grund: "keine Karte" };
    await k.tap(); await pg.waitForTimeout(400);
    await pg.locator(".lk-karte .lk-knopf[title='Setzen']").tap({ timeout: 8000 }).catch(() => {}); await pg.waitForTimeout(500);
    const r = await pg.evaluate((bild) => {
      const d = JSON.parse(localStorage.getItem("leicht_deko_v1") || "[]").find((x) => x.bild === bild);
      const o = window.STADT.szene.objekte.find((x) => x.art === "eigen" && x.bild === bild && !x.geist);
      if (o) { const K = window.STADT.kamera; K.x = o.x; K.y = o.y; window.STADT.leicht.unruhe = 3; }
      return { gemerkt: d || null, basis: o ? window.STADT.szene.basis(o, "tag") : null };
    }, bild);
    return r;
  };
  const sk = await setzen("Kolosseum", "w_kolosseum");
  sage(!!sk.gemerkt && sk.gemerkt.dreh === 3.5 && /_f_315$/.test(sk.basis || ""), "Kolosseum setzbar: gemerkt, mit der Front zum Betrachter (_f_315)", JSON.stringify(sk));
  if (BILD) { await pg.evaluate(() => { const K = window.STADT.kamera; K.s = 3 * K.dpr; window.STADT.leicht.unruhe = 3; }); await warteBilder(pg); await pg.waitForTimeout(1500); await pg.screenshot({ path: BILD + "-kolosseum-stadt.png" }); }
  /* das Kolosseum wieder weg (es ist so groß wie halb Winterhausen), damit man die Eisdiele sieht */
  await pg.evaluate(() => { const SZ = window.STADT.szene; for (const o of SZ.objekte.filter((x) => x.bild === "w_kolosseum")) SZ.weg(o); });
  await pg.locator(".lk-schmuck").first().tap(); await pg.waitForTimeout(500);
  const se = await setzen("Eisdiele", "d_eisdiele");
  sage(!!se.gemerkt && se.gemerkt.dreh === 3.5 && /_f_315$/.test(se.basis || ""), "Eisdiele setzbar: gemerkt, mit der Theke zum Betrachter (_f_315)", JSON.stringify(se));
  if (BILD) { await pg.evaluate(() => { const ST = window.STADT, o = ST.szene.objekte.find((x) => x.bild === "d_eisdiele"), b = ST.dorf.BRUNNEN; if (o && b) { o.x = b[0] + 7; o.y = b[1] + 7; ST.szene.geaendert(); } const K = ST.kamera; if (o) { K.x = o.x; K.y = o.y; } K.s = 22 * K.dpr; window.STADT.leicht.unruhe = 3; }); await warteBilder(pg); await pg.waitForTimeout(1500); await pg.screenshot({ path: BILD + "-eisdiele-stadt.png" }); }
  await pg.context().close();

  console.log("\nBERGWERK IN DER STADT\n");
  const pb = await seite("jahr=herbst&zeit=tag");
  const berg = await pb.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, K = ST.kamera, o = SZ.objekte.find((x) => x.spiel === "bergwerk");
    if (!o) return null;
    K.x = o.x + 1; K.y = o.y + 1; K.s = 20 * K.dpr; K.dreh = 0; ST.leicht.unruhe = 3;
    const basis = SZ.basis(o, "tag"), gier = +(/_f_(\d+)$/.exec(basis) || [0, NaN])[1];
    /* Front des Modells (+y) im Bild: wie der Kern projiziert (x' = x·c − y·s, y' = x·s + y·c; X = x' − y', Y = x' + y') */
    const r = gier * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    const X = (-s) - c, Y = ((-s) + c) * 0.5;
    return { basis: basis, gier: gier, frontX: Math.round(X * 100) / 100, frontY: Math.round(Y * 100) / 100 };
  });
  sage(!!berg && berg.gier === 315 && Math.abs(berg.frontX) < 0.05 && berg.frontY > 0.3, "das Mundloch zeigt in der Grundansicht zum Betrachter (Bild _f_315, Front im Bild nach unten)", JSON.stringify(berg));
  await pb.waitForTimeout(800); await warteBilder(pb); await pb.waitForTimeout(800);
  if (BILD) await pb.screenshot({ path: BILD + "-bergwerk-stadt.png" });
  await pb.locator(".lk-bauen").first().tap(); await pb.waitForTimeout(700);
  const bauBild = await pb.evaluate(() => { const k = [...document.querySelectorAll(".lk-bauleiste .lk-karte-klein")].find((b) => /Bergwerk/.test(b.textContent)); const i = k && k.querySelector("img"); return i ? { src: i.getAttribute("src").split("?")[0].split("/").pop(), ok: i.complete && i.naturalWidth > 0 } : null; });
  await pb.waitForTimeout(600);
  const bauBild2 = await pb.evaluate(() => { const k = [...document.querySelectorAll(".lk-bauleiste .lk-karte-klein")].find((b) => /Bergwerk/.test(b.textContent)); const i = k && k.querySelector("img"); return i ? i.complete && i.naturalWidth > 0 : false; });
  sage(!!bauBild && /^g_bergstollen_herbst_tag_f_315_k\.webp$/.test(bauBild.src) && bauBild2, "in der Bau-Leiste zeigt das Bergwerk sein Mundloch nach vorn (_f_315_k)", JSON.stringify(bauBild));
  if (BILD) await pb.screenshot({ path: BILD + "-bauleiste.png" });
  await pb.context().close();

  sage(alleFehler.length === 0, "keine Seitenfehler", alleFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
