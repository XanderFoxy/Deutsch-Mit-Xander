#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 835 (Arbeitsnummer 855): GETREIDEFELDER WIE ECHTE ÄCKER
   ---------------------------------------------------------------------
   XANDER (Funk 263, wörtlich): „im Spiel lass die Getreidefelder mehr wie
   Getreidefelder aussehen nicht nur wie einfache Vierecke".
   Geprüft (neue Stadt, 900 × 600, Sommer, mittags):
     - die Stufe folgt dem Spiel: ohne Stand reif, nach der Ernte
       Stoppelfeld, dann Saat, grün, gelb; im Winter Schnee
     - spiel.js schickt den Anteil bis zur Reife mit
     - reif: auf dem Acker gelb-goldenes Korn (deckend), quer zu den
       Reihen wechseln hell und dunkel (Drillreihen, Fahrgasse) – keine
       glatte Fläche
     - vorn steht eine Halmwand (unter der Vorderkante kein Wiesengrün)
     - die Ecken sind rund (in der Ecke selbst kein Korn)
     - das Stoppelfeld ist heller als das reife Korn und hat Rundballen
     - der Acker-Maler kostet je Bild wenig (Median < 2 ms)
     - keine Skriptfehler
   Mit dem Stand 834 ist das rot (flache Fläche ohne Wand, kein ST.korn).
   Aufruf: node werkzeug/pruefe-855-kornfeld.js   (QUELLE=1: Einzeldateien)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => {
    const p = decodeURIComponent(q.url.split("?")[0]), f = path.join(WURZEL, p === "/" ? "/stadt-leicht.html" : p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  try {
    const spiel = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
    sage(/\["laeuft", "Getreide " \+ uhrText\(st\.rest\), "getreide", Math\.round\(st\.anteil \* 100\) \/ 100\]/.test(spiel), "spiel.js schickt den Anteil bis zur Reife mit (Zeichen feld91/feld92)");

    const ctx = await br.newContext({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 1 });
    await ctx.route(/cdn\.jsdelivr\.net/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "window.supabase=null;" }));
    const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
    const pf = []; pg.on("pageerror", (e) => pf.push(e.message));
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&leute=0&gaeste=0&quest=0&jahr=sommer&uhr=12:00" + (process.env.QUELLE ? "&quelle=1" : ""), { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForTimeout(1000);

    const stufen = await pg.evaluate(() => {
      const k = STADT.korn; if (!k) return null;
      const L = (a) => ["laeuft", "Getreide 1:00", "getreide", a];
      return [k.stufe(undefined, false).art, k.stufe(["fertig", "2 Getreide", "getreide"], false).art, k.stufe(L(0.05), false).art, k.stufe(L(0.3), false).art,
        k.stufe(L(0.6), false).art, k.stufe(L(0.9), false).art, k.stufe(L(0.9), true).art, k.stufe(["laeuft", "Getreide 1:00", "getreide"], false).art];
    });
    sage(stufen && stufen.join(",") === "reif,reif,stoppel,saat,gruen,gelb,schnee,gelb", "Stufen: ohne Stand/fertig reif, dann Stoppel → Saat → grün → gelb, Winter Schnee, alter Stand ohne Anteil gelb", JSON.stringify(stufen));

    /* Kamera auf Acker 92, Spielstand setzen, ein paar Bilder abwarten */
    const zeige = async (z, s) => {
      await pg.evaluate(({ z, s }) => {
        STADT.oberflaeche.zeichenJetzt = z;
        const f = STADT.dorf.FELD_ORTE.find((q) => q.nr === 92), K = STADT.kamera; K.x = f.x; K.y = f.y; K.s = s * K.dpr; STADT.leicht.unruhe = 2;
      }, { z, s });
      await pg.waitForTimeout(1600);
    };
    /* Pixel in (u, v) des Ackers auf der Höhe z lesen */
    const lies = (punkte) => pg.evaluate((punkte) => {
      const c = document.getElementById("lDinge"), g = c.getContext("2d"), f = STADT.dorf.FELD_ORTE.find((q) => q.nr === 92);
      return punkte.map(([a, b, z]) => {
        const u = f.u0 + (f.u1 - f.u0) * a, v = f.v0 + (f.v1 - f.v0) * b, P = STADT.proj((u + v) / 2, (v - u) / 2, z || 0);
        const d = g.getImageData(Math.round(P[0]), Math.round(P[1]), 1, 1).data; return [d[0], d[1], d[2], d[3]];
      });
    }, punkte);

    await zeige({}, 9);
    const k = await pg.evaluate(() => (STADT.korn ? STADT.korn.stufe(undefined, false).h : 0));
    /* eine Zeile quer zu den Reihen in der Mitte (auf der Kornhöhe) */
    const zeile = await lies(Array.from({ length: 60 }, (_, i) => [0.2 + i * 0.01, 0.5, k]));
    const gelb = zeile.filter((p) => p[3] > 200 && p[0] + p[1] - 2 * p[2] > 120).length;
    const hell = zeile.map((p) => p[0] * 0.3 + p[1] * 0.59 + p[2] * 0.11), mitte = hell.reduce((a, b) => a + b, 0) / hell.length;
    const streu = Math.sqrt(hell.reduce((a, b) => a + (b - mitte) * (b - mitte), 0) / hell.length);
    let wechsel = 0; for (let i = 1; i < hell.length; i++) if ((hell[i] - mitte) * (hell[i - 1] - mitte) < 0) wechsel++;
    sage(gelb >= 54, "reif: deckendes gelb-goldenes Korn auf dem Acker", gelb + " von 60 Punkten");
    sage(streu > 6 && wechsel >= 8, "quer zu den Reihen wechseln hell und dunkel (keine glatte Fläche)", "Streuung " + streu.toFixed(1) + ", Wechsel " + wechsel);
    /* die Halmwand: knapp unter der Vorderkante (v = v1), halbe Kornhöhe – dort ist Halm, nicht Wiese */
    const wand = await lies([[0.3, 1, k * 0.45], [0.5, 1, k * 0.45], [0.7, 1, k * 0.45]]);
    const wiese = await lies([[0.5, 1.12, 0]]);
    const istWiese = (p) => p[1] > p[0] + 8 && p[3] > 0;
    sage(wand.every((p) => p[3] > 200 && !istWiese(p) && p[0] > p[2] + 25), "vorn steht eine Halmwand (gelbbraun, nicht Wiese)", JSON.stringify(wand));
    /* runde Ecke: genau in der hinteren linken Ecke (auf Kornhöhe) kein Korn */
    const ecke = await lies([[0.004, 0.004, k]]), innen = await lies([[0.12, 0.12, k]]);
    sage(!(ecke[0][3] > 200 && ecke[0][0] + ecke[0][1] - 2 * ecke[0][2] > 120) && innen[0][3] > 200, "die Ecken sind rund (in der Ecke selbst kein Korn, etwas weiter innen schon)", JSON.stringify([ecke[0], innen[0]]));
    if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-reif.png" });

    /* Stoppelfeld nach der Ernte */
    await zeige({ feld91: ["laeuft", "x", "getreide", 0.05], feld92: ["laeuft", "x", "getreide", 0.05] }, 9);
    const st = await lies(Array.from({ length: 60 }, (_, i) => [0.2 + i * 0.01, 0.5, 0.12]));
    const hellSt = st.map((p) => p[0] * 0.3 + p[1] * 0.59 + p[2] * 0.11).reduce((a, b) => a + b, 0) / st.length;
    sage(hellSt > mitte + 8, "Stoppelfeld: heller (Stroh) als das reife Korn", hellSt.toFixed(0) + " gegen " + mitte.toFixed(0));
    const ballen = await pg.evaluate(() => !!STADT.korn && /Rundballen/.test(String(STADT.szene.bodenMaler.find((q) => /KORN\.stufe/.test(String(q))))) && STADT.korn.schwaden(18 * STADT.korn.M).length >= 2);
    sage(ballen, "Stoppelfeld: Strohschwaden mit Rundballen");
    if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-stoppel.png" });

    /* Kosten je Bild */
    const ms = await pg.evaluate(() => new Promise((ok) => {
      const SZ = STADT.szene, i = SZ.bodenMaler.findIndex((q) => /KORN\.stufe/.test(String(q))), f = SZ.bodenMaler[i], l = [];
      if (i < 0) return ok(-1);
      SZ.bodenMaler[i] = function (g, t, Z) { const t0 = performance.now(); f(g, t, Z); l.push(performance.now() - t0); };
      STADT.oberflaeche.zeichenJetzt = {};
      setTimeout(() => { SZ.bodenMaler[i] = f; l.sort((a, b) => a - b); ok(l.length ? l[Math.floor(l.length / 2)] : -1); }, 2500);
    }));
    sage(ms >= 0 && ms < 2, "der Acker-Maler kostet je Bild wenig (Median < 2 ms)", ms.toFixed(2) + " ms");
    sage(!pf.length, "keine Skriptfehler", JSON.stringify(pf.slice(0, 3)));
  } finally { await br.close(); srv.close(); }
  console.log("\n" + (fehler ? fehler + " Fehler" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
