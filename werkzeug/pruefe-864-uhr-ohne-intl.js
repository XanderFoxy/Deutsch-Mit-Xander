#!/usr/bin/env node
/* =====================================================================
   SONDE 864 — UHR OHNE ZEITZONEN-TABELLEN, SCHLANKERE ÄNDERUNGSLISTE (FASSUNG 845)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".
   1. mezWandzeit() stimmt mit Intl (Europe/Berlin, Europe/Rome) überein:
      jede Minute rund um acht Umstellungen (2025–2028) und ein Raster über
      sieben Jahre.
   2. Auf der Seite zeigt die Uhr dieselbe Zeit wie Intl für Berlin.
   3. Beim Start wird kein Zeitzonen-Formatierer mehr gebaut (gezählt).
   4. In app.js steht von der Änderungsliste nur noch die laufende
      Fassung; die alten Einträge liegen im Archiv (nicht geladen).
   5. Keine Fehler in der Konsole.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };

(async () => {
  const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  console.log("\n1) Die Rechnung\n");
  const i = quelle.indexOf("  function mezWandzeit"), j = quelle.indexOf("  function updateClock");
  let mezWandzeit = null;
  try { mezWandzeit = new Function(quelle.slice(i, j) + "; return mezWandzeit;")(); } catch (e) {}
  sage(typeof mezWandzeit === "function", "mezWandzeit steht in app.js");
  if (mezWandzeit) {
    for (const zone of ["Europe/Berlin", "Europe/Rome"]) {
      const f = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", minute: "numeric", hourCycle: "h23", month: "numeric", day: "numeric" });
      let n = 0, falsch = 0;
      const pruef = (t) => {
        n++; const d = new Date(t), w = mezWandzeit(d), p = {};
        f.formatToParts(d).forEach((x) => { p[x.type] = +x.value; });
        if (p.hour !== w.std || p.minute !== w.min || p.month !== w.monat || p.day !== w.tag) falsch++;
      };
      for (let t = Date.UTC(2024, 0, 1); t < Date.UTC(2031, 0, 1); t += 106 * 60000) pruef(t);
      for (const y of [2025, 2026, 2027, 2028]) for (const m of [2, 9]) {
        const ende = new Date(Date.UTC(y, m + 1, 0));
        const s = Date.UTC(y, m, ende.getUTCDate() - ende.getUTCDay(), 1);
        for (let t = s - 3 * 3600000; t < s + 3 * 3600000; t += 60000) pruef(t);
      }
      sage(falsch === 0, zone + ": " + n + " Zeitpunkte wie Intl", falsch + " abweichend");
    }
  }

  console.log("\n2)–3) Auf der Seite\n");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 860 } });
  const konsole = [];
  pg.on("pageerror", (e) => konsole.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => {
    if (m.type() !== "error") return;
    const ort = (m.location() && m.location().url) || "";
    if (/Failed to load resource/.test(m.text()) && ort.indexOf(HIER) !== 0) return;
    konsole.push("console.error: " + m.text().slice(0, 160));
  });
  /* Zählen, wie oft beim Start ein Formatierer MIT Zeitzone gebaut wird. */
  await pg.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
    window.__tzFormatierer = 0;
    const Echt = Intl.DateTimeFormat;
    const Zaehler = function (l, o) { if (o && o.timeZone) window.__tzFormatierer++; return new Echt(l, o); };
    Zaehler.prototype = Echt.prototype; Zaehler.supportedLocalesOf = Echt.supportedLocalesOf;
    Intl.DateTimeFormat = Zaehler;
    const tls = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = function (l, o) { if (o && o.timeZone) window.__tzFormatierer++; return tls.call(this, l, o); };
  });
  await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND, null, { timeout: 60000 });
  await pg.waitForTimeout(800);
  const seite = await pg.evaluate(() => ({ uhr: (document.getElementById("clockOut") || {}).textContent || "",
    tz: window.__tzFormatierer, jetzt: Date.now() }));
  const soll = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });
  const moeglich = [soll.format(new Date(seite.jetzt)), soll.format(new Date(seite.jetzt - 60000))];
  sage(moeglich.includes(seite.uhr), "die Uhr zeigt Berliner Zeit", seite.uhr + " (Intl: " + moeglich[0] + ")");
  sage(seite.tz === 0, "beim Start kein Zeitzonen-Formatierer", seite.tz + " gebaut");

  console.log("\n4) Änderungsliste\n");
  const L = quelle.split("\n");
  const schluessel = (name) => {
    const st = L.findIndex((l) => l.startsWith("  const " + name + " = {"));
    let en = st + 1; while (L[en] !== "  };") en++;
    return Object.keys(eval("({" + L.slice(st + 1, en).join("\n") + "})"));
  };
  const ver = (quelle.match(/const APP_VERSION = "(\d+)"/) || [])[1];
  sage(schluessel("APP_CHANGELOG").join() === ver, "APP_CHANGELOG hat nur die laufende Fassung " + ver, schluessel("APP_CHANGELOG").join());
  sage(schluessel("APP_CHANGELOG_INTERN").join() === ver, "APP_CHANGELOG_INTERN ebenso", schluessel("APP_CHANGELOG_INTERN").join());
  const archiv = path.join(WURZEL, "werkzeug/archiv/app-changelog-alt.js");
  sage(fs.existsSync(archiv) && fs.statSync(archiv).size > 50000, "die alten Einträge liegen im Archiv");
  const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
  sage(html.indexOf("app-changelog-alt") < 0, "das Archiv wird nicht geladen");

  const neu = konsole;
  sage(neu.length === 0, "keine Fehler in der Konsole", neu.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
