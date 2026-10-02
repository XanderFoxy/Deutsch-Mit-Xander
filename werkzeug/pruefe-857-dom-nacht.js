#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 836 (Arbeitsnummer 857): DER KÖLNER DOM NACHTS
   ---------------------------------------------------------------------
   XANDER (Funk 263, wörtlich): „dann ist der Kölner Dom jetzt richtig
   von der Färbung allerdings ist er nachts manchmal weiß in einer
   bestimmten Zoomstufe oder verschwindet einfach komplett also schau
   mal darauf dass es dort keine Inkonsistenzen gibt".

   Die Diagnose fand vier Wege, auf denen der Dom fehlte oder nur seine
   Lichter blieben:
     1. Im Überblick gab der Rahmen alle 700 ms jedes _k-Bild frei; ein
        Sprung in die Lupenstufe fand dann kein Bild (LB.wahl → null)
        und ließ den Dom weg, bis es neu geladen war.
     2. LB.wahl fiel nie auf eine schon geladene andere Größe zurück.
     3. Die Lichter (Bodenstrahler, Fenster) wurden auch ohne Gebäude
        gemalt: ein heller Fleck statt Dom.
     4. Am oberen Rand wurde nach dem Fußpunkt aussortiert – der Dom
        reicht 11 m darunter und brach dort schlagartig weg.

   Geprüft (stadt-leicht.html?demo=1&mini=1&eingebettet=1&uhr=22:00, wie
   der Rahmen im Spiel, Nacht, Herbst):
     A  3 s im Überblick, dann Sprung auf 2,8× (Lupe): in JEDEM der
        folgenden Bilder ist der Dom in der Szene, mit geladenem Bild.
     B  Zoom vom Überblick bis ganz nah und zurück, in 8 Richtungen:
        der Dom ist immer da, gemalt wird nur Geladenes, Lichter nur
        mit Gebäude; weiß überstrahlt ist er nirgends.
     C  Dom knapp über dem oberen Bildrand (Fußpunkt draußen, Turm
        noch drin): er bleibt in der Szene.
     D  Ein Bild, das einmal nicht kam, wird erneut versucht.
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/pruefe-857-dom-nacht.js
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
    const ctx = await br.newContext({ viewport: { width: 420, height: 330 }, deviceScaleFactor: 1 });
    await ctx.route(/cdn\.jsdelivr\.net/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "window.supabase=null;" }));
    /* D: das erste Mal kommt ein Dom-Bild nicht (Netzfehler), danach schon */
    let verweigert = "", danach = 0;
    await ctx.route(/w_koelner_dom_herbst_nacht_f_315_z\./, (r) => {
      if (!verweigert) { verweigert = r.request().url(); return r.abort("failed"); }
      danach++; return r.continue();
    });
    const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
    const pf = []; pg.on("pageerror", (e) => pf.push(e.message));
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&mini=1&eingebettet=1&leute=0&gaeste=0&quest=0&jahr=herbst&uhr=22:00" + (process.env.QUELLE ? "&quelle=1" : ""), { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForTimeout(1500);
    const da = await pg.evaluate(() => {
      const o = STADT.szene.objekte.find((x) => x.bild === "w_koelner_dom" && !x.versteckt);
      if (!o) return null;
      window.__dom = o;
      return { x: o.x, y: o.y, stufe: o.stufe, s0: STADT.kamera.s, min: STADT.kamera.min, max: STADT.kamera.max, nacht: STADT.szene.zeitDaten().nacht };
    });
    sage(!!da, "der Kölner Dom steht in der Stadt", JSON.stringify(da));
    if (!da) throw new Error("kein Dom");
    sage(da.nacht > 0.9, "es ist Nacht (22:00)", String(da.nacht));

    /* je Bild aufzeichnen, ob und wie der Dom in der Szene ist */
    await pg.evaluate(() => {
      const SZ = STADT.szene, LB = STADT.bilder, alt = SZ.zeichnen;
      window.__log = [];
      SZ.zeichnen = function (j) {
        const r = alt.apply(this, arguments);
        const e = (SZ.sichtbare || []).find((x) => x.o === window.__dom);
        window.__log.push(e ? { da: 1, name: e.lagen[0][0], fertig: LB.fertig(e.lagen[0][0]), licht: !!e.licht, s: STADT.kamera.s, Y: e.Y } : { da: 0, s: STADT.kamera.s });
        return r;
      };
    });
    const bilder = async (n) => { const t0 = await pg.evaluate(() => STADT.bilder.takt); await pg.waitForFunction(([t0, n]) => STADT.bilder.takt >= t0 + n, [t0, n], { timeout: 30000 }); };
    const setze = (s, dreh, dy) => pg.evaluate(([s, dreh, dy]) => {
      const K = STADT.kamera, o = window.__dom;
      if (dreh != null) K.dreh = dreh;
      K.x = o.x; K.y = o.y; K.s = s; STADT.leicht.unruhe = 2;
      if (dy) { /* Kamera so verschieben, dass der Fußpunkt dy Punkte über dem oberen Rand liegt (ST.proj ist affin) */
        const P = STADT.proj(o.x, o.y, 0), A = STADT.proj(o.x + 1, o.y, 0), B = STADT.proj(o.x, o.y + 1, 0);
        const a = A[0] - P[0], c = A[1] - P[1], b = B[0] - P[0], d = B[1] - P[1], det = a * d - b * c, dY = -dy - P[1];
        /* Kamera um w verschieben verschiebt das Ding um −J·w; gesucht J·w = (0, −dY) */
        K.x += (-b * -dY) / det; K.y += (a * -dY) / det;
      }
    }, [s, dreh == null ? null : dreh, dy || 0]);

    console.log("\nA  ÜBERBLICK → LUPE\n");
    await setze(da.s0, 3.5); await pg.waitForTimeout(3000);
    await pg.evaluate(() => { window.__log.length = 0; });
    await setze(da.s0 * 2.8, 3.5); await bilder(20);
    const A = await pg.evaluate(() => window.__log.slice());
    const fehltA = A.filter((x) => !x.da).length, ungeladenA = A.filter((x) => x.da && !x.fertig).length;
    sage(A.length >= 20 && fehltA === 0, "nach dem Sprung in die Lupe ist der Dom in jedem Bild da", A.length + " Bilder, fehlt in " + fehltA + "; Bild " + (A[0] && A[0].name));
    sage(ungeladenA === 0, "gemalt wird nur ein geladenes Bild", ungeladenA + " ungeladen");

    console.log("\nB  ZOOM GANZ HINEIN UND ZURÜCK, 8 RICHTUNGEN\n");
    const stufen = []; for (let i = 0; i <= 10; i++) stufen.push(da.min + (Math.min(da.max, 60) - da.min) * Math.pow(i / 10, 1.6));
    const weg = stufen.concat(stufen.slice().reverse());
    let fehlt = 0, ungeladen = 0, lichtOhne = 0, n = 0, weissMax = 0, weissWo = "";
    for (const dreh of [3.5, 0, 0.5, 1, 1.5, 2, 2.5, 3]) {
      await pg.evaluate(() => { window.__log.length = 0; });
      for (const s of (dreh === 3.5 ? weg : stufen)) {
        await setze(s, dreh); await bilder(2);
        /* weiß überstrahlt? Anteil fast weißer Punkte im Dom-Umriss (Bildschirm um den Fußpunkt bis zur Turmhöhe) */
        const w = await pg.evaluate(() => {
          const c = document.getElementById("lDinge"), g = c.getContext("2d"), o = window.__dom, K = STADT.kamera, P = STADT.proj(o.x, o.y, 0);
          const h = Math.min(c.height, 40 * K.s * o.stufe), b = Math.min(c.width, 22 * K.s * o.stufe);
          const x0 = Math.max(0, Math.round(P[0] - b / 2)), y0 = Math.max(0, Math.round(P[1] - h)), x1 = Math.min(c.width, Math.round(P[0] + b / 2)), y1 = Math.min(c.height, Math.round(P[1]));
          if (x1 - x0 < 4 || y1 - y0 < 4) return null;
          const d = g.getImageData(x0, y0, x1 - x0, y1 - y0).data; let deck = 0, weiss = 0;
          for (let i = 0; i < d.length; i += 16) { if (d[i + 3] < 200) continue; deck++; if (d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 225) weiss++; }
          return deck > 20 ? weiss / deck : null;
        });
        if (w != null && w > weissMax) { weissMax = w; weissWo = "dreh " + dreh + ", K.s " + s.toFixed(1); }
      }
      const L = await pg.evaluate(() => window.__log.slice());
      n += L.length; fehlt += L.filter((x) => !x.da).length; ungeladen += L.filter((x) => x.da && !x.fertig).length; lichtOhne += L.filter((x) => x.da && x.licht && !x.fertig).length;
    }
    sage(n > 100 && fehlt === 0, "über alle Zoomstufen und Richtungen fehlt der Dom in keinem Bild", n + " Bilder, fehlt in " + fehlt);
    sage(ungeladen === 0 && lichtOhne === 0, "nur geladene Bilder, keine Lichter ohne Gebäude", JSON.stringify({ ungeladen, lichtOhne }));
    sage(weissMax < 0.2, "nirgends weiß überstrahlt (< 20 % fast weiße Punkte im Dom)", (weissMax * 100).toFixed(1) + " % bei " + weissWo);

    console.log("\nC  OBERER BILDRAND\n");
    await pg.evaluate(() => { window.__log.length = 0; });
    const sNah = da.s0 * 2.8;
    await setze(sNah, 3.5, 70 + 2 * sNah); await bilder(3);
    const C = await pg.evaluate(() => window.__log.slice(-2));
    sage(C.length && C.every((x) => x.da && x.Y < 0), "Fußpunkt über dem oberen Rand, Turm noch im Bild: der Dom bleibt in der Szene", JSON.stringify(C));

    console.log("\nD  NACH EINEM FEHLER ERNEUT LADEN\n");
    if (verweigert) {
      await setze(da.min, 3.5); await pg.waitForTimeout(16500); await bilder(3);
      sage(danach >= 1, "ein Dom-Bild, das beim ersten Mal nicht kam, wurde erneut angefordert", "verweigert: " + verweigert.split("/").pop() + ", danach geholt: " + danach);
    } else console.log("  (das Zwergbild wurde in diesem Lauf nicht angefordert – Teil D entfällt)");

    sage(!pf.length, "keine Seitenfehler", pf.slice(0, 3).join(" | "));
  } catch (e) { console.error(e); fehler++; }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n");
  process.exit(fehler ? 1 : 0);
})();
