#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 812: DÖBELNER RATHAUS UND WINDMÜHLE
   ---------------------------------------------------------------------
   XANDER (zu vier Fotos vom Obermarkt): „wenn man vor dem Brunnen steht,
   dann guck mal genau auf den Eingang zu, dann ist dieser dominante Teil
   seitlich nach rechts … und im Winter kannst du es auch genauso
   darstellen." — und: „Vergiss die Windmühle nicht. Ich will den selben
   Look haben."
   Geprüft (Beispielstadt, ?demo=1):
   - das Rathaus-Bild (w_rathaus_doebeln) ist geladen und gezeichnet
   - Winter-Nacht: Fensterlichter und die Lichterkette unter dem Gesims
     (im Herbst keine Kette); Schnee auf den Dächern (Winterbilder heller)
   - die Windmühle (g_windmuehle) steht auf dem Mühlenplatz; steht in
     dorf.js noch die Wassermühle, setzt die Sonde das Bild selbst um
     (D.BILD.muehle = ["g_windmuehle", "bau_windmuehle", [13, 13], 22])
   - die Flügel werden direkt nach der Mühle gemalt (Drehblatt
     g_windfluegel) und drehen sich: Bildvergleich um den Wellkopf
   - im kleinen Rahmen (?mini=1) nur Zwergbilder (_z), keine großen
   - keine Seitenfehler
   AUFRUF: node werkzeug/pruefe-812-rathaus-windmuehle.js   (QUELLE=1: Einzeldateien, BILD=pfad: Bildschirmfotos)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = path.join(__dirname, "..");
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log("  " + (gut ? "ok  " : "FEHL") + " " + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => { const p = decodeURIComponent(q.url.split("?")[0]); const f = path.join(W, p); if (!f.startsWith(W) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  const seitenfehler = [], geladen = [];
  pg.on("pageerror", (e) => seitenfehler.push(e.message));
  pg.on("response", (r) => { const u = r.url(); if (/stadt-leicht\/bilder\//.test(u)) geladen.push(decodeURIComponent(new URL(u).pathname).replace(/^\//, "")); });
  const laden = async (zusatz) => {
    geladen.length = 0;
    await pg.goto(`http://127.0.0.1:${srv.address().port}/stadt-leicht.html?demo=1${process.env.QUELLE ? "&quelle=1" : ""}${zusatz || ""}`);
    await pg.waitForFunction(() => window.__fertig, { timeout: 120000 }).catch(() => {});
    await pg.waitForTimeout(600);
  };
  /* Mühle auf die Windmühle stellen (falls dorf.js noch die Wassermühle zeigt) und die Kamera hinführen */
  const zurMuehle = (s) => pg.evaluate((s) => {
    const ST = window.STADT, SZ = ST.szene, K = ST.kamera;
    const o = SZ.objekte.find((x) => x.spiel === "muehle");
    if (!o) return { fehlt: true };
    const vorher = o.bild;
    if (o.bild !== "g_windmuehle") { o.bild = "g_windmuehle"; o.bauBild = "bau_windmuehle"; o.fuss = [13 * o.stufe, 13 * o.stufe]; o.hoehe = 22; SZ.geaendert(); }
    K.x = o.x; K.y = o.y; K.s = s * K.dpr; K.dreh = 0;
    return { vorher: vorher, x: o.x, y: o.y, dreh: o.dreh, stufe: o.stufe };
  }, s);
  const warteBilder = () => pg.waitForFunction(() => window.STADT.bilder.offen() === 0, { timeout: 60000 }).catch(() => {});
  /* Bildausschnitt der Leinwand um den Wellkopf (Bildpunkte) */
  const ausschnitt = () => pg.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, o = SZ.objekte.find((x) => x.spiel === "muehle"), N = (ST.windmuehle && ST.windmuehle.nabe) || [2.51, 2.51, 13.25];
    const p = ST.proj(o.x + N[0] * o.stufe, o.y + N[1] * o.stufe, N[2] * o.stufe);
    const c = document.getElementById("lDinge"), g = c.getContext("2d"), r = Math.round(6 * ST.kamera.s * o.stufe);
    const x0 = Math.max(0, Math.round(p[0] - r)), y0 = Math.max(0, Math.round(p[1] - r)), w = Math.min(c.width - x0, 2 * r), h = Math.min(c.height - y0, 2 * r);
    return { x0, y0, w, h, d: Array.from(g.getImageData(x0, y0, w, h).data) };
  });
  const unterschied = (a, b) => { let n = 0, s = 0; for (let i = 0; i < a.d.length; i += 4) { const d = Math.abs(a.d[i] - b.d[i]) + Math.abs(a.d[i + 1] - b.d[i + 1]) + Math.abs(a.d[i + 2] - b.d[i + 2]); if (d > 60) n++; s++; } return n / Math.max(1, s); };

  console.log("\nDÖBELNER RATHAUS (Fassung 812)\n");
  await laden("&zeit=tag&jahr=herbst&s=14&kx=-10&ky=-8");
  await warteBilder(); await pg.waitForTimeout(400);
  const rh = await pg.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, LB = ST.bilder, vz = LB.vz;
    const o = SZ.objekte.find((x) => x.spiel === "rathaus");
    const e = (SZ.sichtbare || []).find((x) => x.o === o);
    const zaehl = (n) => (vz[n] && vz[n].l ? vz[n].l.length : 0);
    return { bild: o && o.bild, dreh: o && o.dreh, gezeichnet: !!e, geladen: !!e && LB.fertig(e.lagen[0][0]), lage: e && e.lagen[0][0],
      winterNacht: zaehl("w_rathaus_doebeln_winter_nacht_f_270_g"), herbstNacht: zaehl("w_rathaus_doebeln_herbst_nacht_f_270_g"),
      winterNacht315: zaehl("w_rathaus_doebeln_winter_nacht_f_315_g"), herbstNacht315: zaehl("w_rathaus_doebeln_herbst_nacht_f_315_g"), acht: [0, 45, 90, 135, 180, 225, 270, 315].every((w) => ["winter", "herbst"].every((j) => ["tag", "nacht"].every((z) => vz["w_rathaus_doebeln_" + j + "_" + z + "_f_" + w + "_g"] && vz["w_rathaus_doebeln_" + j + "_" + z + "_f_" + w + "_k"]))) };
  });
  sage(rh.bild === "w_rathaus_doebeln" && rh.gezeichnet && rh.geladen, "das Rathaus-Bild ist geladen und gezeichnet", JSON.stringify({ lage: rh.lage, dreh: rh.dreh }));
  sage(rh.acht, "alle 8 Winkel in Winter/Herbst, Tag/Nacht, groß und klein im Verzeichnis");
  sage(rh.winterNacht >= 40 && rh.winterNacht > rh.herbstNacht + 10 && rh.winterNacht315 > rh.herbstNacht315 + 6, "Winter-Nacht: Fensterlichter und die Lichterkette unter dem Gesims (im Herbst keine Kette)", JSON.stringify({ winterNacht: rh.winterNacht, herbstNacht: rh.herbstNacht, winterNacht315: rh.winterNacht315, herbstNacht315: rh.herbstNacht315 }));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-rathaus.png" });
  /* Winter-Nacht im Bild: Schnee (Dächer hell) und Lichter (warme Punkte) */
  await laden("&zeit=nacht&jahr=winter&s=14&kx=-10&ky=-8");
  await warteBilder(); await pg.waitForTimeout(400);
  const wn = await pg.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, o = SZ.objekte.find((x) => x.spiel === "rathaus"), e = (SZ.sichtbare || []).find((x) => x.o === o);
    const m = e.meta, x0 = Math.max(0, Math.round(e.X - m.ax * e.k)), y0 = Math.max(0, Math.round(e.Y - m.ay * e.k));
    const c = document.getElementById("lDinge"), w = Math.min(c.width - x0, Math.round(m.w * e.k)), h = Math.min(c.height - y0, Math.round(m.h * e.k));
    const d = c.getContext("2d").getImageData(x0, y0, w, h).data;
    let warm = 0, n = 0; for (let i = 0; i < d.length; i += 4) { n++; if (d[i] > 200 && d[i + 1] > 150 && d[i + 2] < 150) warm++; }
    return { lage: e.lagen.map((l) => l[0]).join(" + "), warm: warm / n };
  });
  sage(/winter_nacht/.test(wn.lage) && wn.warm > 0.004, "im Winter nachts leuchten Fenster und Lichterkette (warme Bildpunkte am Rathaus)", JSON.stringify({ lage: wn.lage, warm: +wn.warm.toFixed(4) }));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-winternacht.png" });

  console.log("\nWINDMÜHLE (Fassung 812)\n");
  await laden("&zeit=tag&jahr=herbst");
  const m0 = await zurMuehle(16);
  sage(!m0.fehlt, "die Mühle steht im Dorf", JSON.stringify(m0));
  await warteBilder(); await pg.waitForTimeout(800);
  const wm = await pg.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, LB = ST.bilder, vz = LB.vz;
    const o = SZ.objekte.find((x) => x.spiel === "muehle"), e = (SZ.sichtbare || []).find((x) => x.o === o);
    const blatt = Object.keys(vz).filter((k) => /^g_windfluegel_/.test(k));
    return { modul: !!ST.windmuehle, gezeichnet: !!e && LB.fertig(e.lagen[0][0]), lage: e && e.lagen[0][0], blaetter: blatt.length,
      zellen: blatt.length ? vz[blatt[0]].n : 0, bau: Object.keys(vz).filter((k) => /^bau_windmuehle_/.test(k)).length, gemalt: ST.windmuehle && ST.windmuehle.gemalt };
  });
  sage(wm.gezeichnet && /^g_windmuehle_/.test(wm.lage || ""), "die Windmühle (g_windmuehle) ist geladen und gezeichnet", wm.lage);
  sage(wm.blaetter >= 64 && wm.zellen >= 8 && wm.zellen <= 12 && wm.bau >= 32, "Drehblätter für alle 8 Winkel (Winter/Herbst, Tag/Nacht, groß/klein) mit 8–12 Stellungen, Baustellenbilder da", JSON.stringify({ blaetter: wm.blaetter, zellen: wm.zellen, bau: wm.bau }));
  sage(wm.modul && !!wm.gemalt && /^g_windfluegel_herbst_tag_f_\d+_[gk]$/.test(wm.gemalt.name), "die Flügel werden direkt nach der Mühle gemalt (passendes Drehblatt)", JSON.stringify(wm.gemalt));
  const a1 = await ausschnitt(), s1 = await pg.evaluate(() => window.STADT.windmuehle && window.STADT.windmuehle.gemalt);
  await pg.waitForTimeout(1300);
  const a2 = await ausschnitt(), s2 = await pg.evaluate(() => window.STADT.windmuehle && window.STADT.windmuehle.gemalt);
  const du = unterschied(a1, a2);
  const upm = s1 && s2 ? (s2.stellung - s1.stellung) / 4 / ((s2.t - s1.t) / 60) : 0;
  sage(du > 0.01 && upm > 5.5 && upm < 8.5, "die Flügel drehen sich (Bildvergleich um den Wellkopf) – am Tag etwa 7 Umdrehungen je Minute", JSON.stringify({ geaendert: +du.toFixed(3), upm: +upm.toFixed(2) }));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-muehle.png" });
  await laden("&zeit=nacht&jahr=winter");
  await zurMuehle(16); await warteBilder(); await pg.waitForTimeout(600);
  const n1 = await pg.evaluate(() => window.STADT.windmuehle && window.STADT.windmuehle.gemalt);
  await pg.waitForTimeout(1300);
  const n2 = await pg.evaluate(() => window.STADT.windmuehle && window.STADT.windmuehle.gemalt);
  const upmN = n1 && n2 ? (n2.stellung - n1.stellung) / 4 / ((n2.t - n1.t) / 60) : 0;
  sage(!!n2 && /winter_nacht/.test(n2.name) && upmN > 2 && upmN < 4.5, "nachts drehen sie langsamer (etwa 3 U/min), Winter-Nacht-Blatt", JSON.stringify({ name: n2 && n2.name, upm: +upmN.toFixed(2) }));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-muehle-nacht.png" });

  console.log("\nIM KLEINEN RAHMEN (mini=1)\n");
  await pg.setViewportSize({ width: 360, height: 225 });
  await laden("&zeit=tag&jahr=herbst&mini=1");
  await zurMuehle(5); await warteBilder(); await pg.waitForTimeout(1200);
  const mi = await pg.evaluate(() => ({ gemalt: window.STADT.windmuehle && window.STADT.windmuehle.gemalt }));
  const gross = geladen.filter((u) => /_(g|m)\.webp$|verzeichnis\.json/.test(u));
  const kb = geladen.filter((u) => /windmuehle|windfluegel/.test(u)).reduce((a, u) => a + (fs.existsSync(path.join(W, u)) ? fs.statSync(path.join(W, u)).size : 0), 0) / 1024;
  sage(!!mi.gemalt && /_z$/.test(mi.gemalt.name) && gross.length === 0, "auch im kleinen Rahmen drehen sich die Flügel – nur Zwergbilder, keine großen", JSON.stringify({ blatt: mi.gemalt && mi.gemalt.name, gross: gross, windmuehleKB: Math.round(kb) }));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-mini.png" });

  sage(seitenfehler.length === 0, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gut") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
