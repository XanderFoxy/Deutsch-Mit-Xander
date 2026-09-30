#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 846: STUFENLOS ZOOMEN, DIE NADEL HÄLT NÄHE UND WINKEL
   ---------------------------------------------------------------------
   XANDER (Walkie 315): „ich möchte das wie vorher auch stufenlos Zoomen
   das fühlt sich jetzt so an als wenn das mit der Lupe direkt aufspringt"
   „wenn einer Ansicht festgepinnt ist nicht nur vom Winkel sondern auch
   von der Zoomstärke in diese wieder zurückfallen … der PIN setzt alles
   fest die Zoomstärke und den Winkel".
   Geprüft im kleinen Rahmen (360 × 300 in einer Spielseite, Finger):
   Kneifen zoomt in kleinen Schritten, die Kompass-Anzeige schaltet nicht
   mitten in der Geste um (erst nach dem Loslassen); die Nadel steckt eine
   gedrehte, nahe Ansicht fest; lädt der Rahmen versteckt (ohne Größe),
   steht danach genau diese Ansicht (kein negativer Maßstab, keine
   beschnittene Nähe); der Kompass führt von woanders zurück in die
   festgesteckte Ansicht; die Seite fängt Safaris Kneif-Geste ab.
   Aufruf: node werkzeug/pruefe-846-zoom-nadel.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); const f = path.join(WURZEL, p); if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const U = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const pm = await ctx.newPage();
  const seitenfehler = [];
  pm.on("pageerror", (e) => seitenfehler.push(e.message));
  await pm.route(U + "/r.html", (r) => r.fulfill({ contentType: "text/html", body: '<!doctype html><meta name="viewport" content="width=device-width"><body style="margin:0"><iframe id="f" src="/stadt-leicht.html?demo=1&zeit=tag&jahr=sommer&mini=1&eingebettet=1" style="border:0;width:360px;height:300px;display:block"></iframe><div style="height:900px"></div>' }));
  await pm.goto(U + "/r.html");
  const cdp = await ctx.newCDPSession(pm);
  const rahmen = async () => { let fr = null; for (let i = 0; i < 240 && !fr; i++) { fr = pm.frames().find((f) => /stadt-leicht\.html/.test(f.url())); if (!fr) await pm.waitForTimeout(250); } await fr.waitForFunction(() => window.__fertig, null, { timeout: 120000 }); return fr; };
  let fr = await rahmen(); await pm.waitForTimeout(1500);
  const finger = (typ, pk) => cdp.send("Input.dispatchTouchEvent", { type: typ, touchPoints: pk.map((p, i) => ({ x: p[0], y: p[1], id: i + 1, radiusX: 4, radiusY: 4, force: 1 })) });
  const kam = () => fr.evaluate(() => ({ s: STADT.kamera.s, max: STADT.kamera.max, min: STADT.kamera.min, dreh: STADT.kamera.dreh, nah: document.body.classList.contains("lk-nah") }));

  console.log("\nKNEIFEN\n");
  await fr.evaluate(() => { window.__log = []; const f = () => { window.__log.push([STADT.kamera.s, document.body.classList.contains("lk-nah")]); requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const k0 = await kam();
  const l = (r) => [[180 - r, 150], [180 + r, 150]];
  await finger("touchStart", l(25));
  let nahMitten = null;
  for (let i = 1; i <= 24; i++) { await finger("touchMove", l(25 + i * 2.5)); await pm.waitForTimeout(40); }
  await pm.waitForTimeout(900);
  nahMitten = (await kam()).nah;
  await finger("touchEnd", []);
  await pm.waitForTimeout(1000);
  const k1 = await kam();
  const log = await fr.evaluate(() => window.__log);
  let sprung = 1; for (let i = 1; i < log.length; i++) sprung = Math.max(sprung, log[i][0] / log[i - 1][0], log[i - 1][0] / log[i][0]);
  sage(k1.s > k0.s * 2.5 && sprung < 1.12, "zwei Finger zoomen stufenlos (größter Schritt je Bild ×" + sprung.toFixed(3) + ")", k0.s.toFixed(2) + " → " + k1.s.toFixed(2));
  sage(!k0.nah && nahMitten === false && k1.nah, "die Kompass-Anzeige springt nicht mitten in der Geste um, erst nach dem Loslassen", JSON.stringify({ vorher: k0.nah, fingerDrauf: nahMitten, danach: k1.nah }));
  const abgefangen = await fr.evaluate(() => { const e = new Event("gesturestart", { cancelable: true }); document.dispatchEvent(e); return e.defaultPrevented; });
  sage(abgefangen, "Safaris Kneif-Geste (gesturestart) wird abgefangen – die Spielseite zoomt nicht mit");

  console.log("\nNADEL\n");
  await fr.evaluate(() => { STADT.kamera.x += 3; STADT.kamera.s = STADT.kamera.max * 0.9; STADT.drehen.setzen(0.5); STADT.leicht.unruhe = 2; });
  await pm.waitForTimeout(1500);
  const vor = await kam();
  await fr.locator(".lk-pinknopf").tap(); await pm.waitForTimeout(500);
  const pin = await fr.evaluate(() => JSON.parse(localStorage.getItem("lk-pin-ansicht") || "null"));
  sage(pin && Math.abs(pin.s * 2 - vor.s) < 0.05 && pin.dreh === 0.5, "die Nadel steckt Nähe und Winkel fest", JSON.stringify(pin));
  /* woanders hin, dann Kompass: zurück in die festgesteckte Ansicht */
  await fr.evaluate(() => { STADT.drehen.setzen(0); STADT.kamera.s = STADT.kamera.max * 0.4; STADT.leicht.unruhe = 2; });
  await pm.waitForTimeout(900);
  await fr.locator(".lk-lupe").tap(); await pm.waitForTimeout(1500);
  const zur = await kam();
  sage(Math.abs(zur.s - vor.s) < 0.05 && zur.dreh === 0.5, "der Kompass führt zurück in die festgesteckte Ansicht (Nähe und Winkel)", "s " + zur.s.toFixed(2) + " (Nadel " + vor.s.toFixed(2) + "), dreh " + zur.dreh);
  /* versteckt neu laden (der Rahmen hat noch keine Größe), dann zeigen */
  await pm.evaluate(() => { const f = document.getElementById("f"); f.style.width = "0px"; f.style.height = "0px"; f.src = f.src; });
  await pm.waitForTimeout(300);
  fr = await rahmen(); await pm.waitForTimeout(1500);
  const vers = await kam();
  sage(vers.s > 0 && isFinite(vers.s), "versteckt geladen: kein negativer oder leerer Maßstab", "s " + vers.s);
  await pm.evaluate(() => { const f = document.getElementById("f"); f.style.width = "360px"; f.style.height = "300px"; });
  await pm.waitForTimeout(2500);
  const nach = await kam();
  sage(Math.abs(nach.s - vor.s) < 0.05 && nach.dreh === 0.5, "danach steht genau die festgesteckte Ansicht (Nähe und Winkel)", "s " + nach.s.toFixed(2) + " (Nadel " + vor.s.toFixed(2) + "), dreh " + nach.dreh);
  sage(Math.abs(nach.max - vor.max) < 0.05 && nach.min < nach.s, "die Zoomgrenzen des kleinen Rahmens gelten wieder (nicht die des Vollbilds)", "max " + nach.max.toFixed(2) + " (vorher " + vor.max.toFixed(2) + ")");
  sage(!seitenfehler.length, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 846 (stufenlos zoomen, Nadel hält Nähe und Winkel): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
