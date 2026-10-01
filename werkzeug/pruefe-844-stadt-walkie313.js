#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 844: XANDERS LISTE AUS WALKIE 313 (29.09.) FÜR DIE
   LEICHTE STADT
   ---------------------------------------------------------------------
   XANDER (wörtlich, Auszüge):
   „es sollte ein Dach vom vom Turm aus nach rechts gehen über den
   Seitenflügel … keine extra Dächer quer nach vorne" · „der Kölner Dom
   [hat] keinen Kontrast der sieht so gelblich aus" · „die Laternen die
   einen Kegel geben sollten der die die Häuser anstrahlt" · „mit der
   pinnadel einen zoomausschnitt … anpinnen … wenn man auf mein Dorf
   kommt immer mit dieser Ansicht präsentiert wird" · „wenn ich lange auf
   ein Haus gedrückt halte soll das Bearbeiten Menü kommen ich weiß
   allerdings nicht wofür der Blitz … ist" · „den Kölner Dom irgendwie
   besser setzen" · „ich möchte sichtbare Getreidefelder" · „das Bergwerk
   … hinter den Gleisen … wo [die] Berge sind" · „dass der Zoom direkt
   auf dieses Haus springt … dann wieder auf das Gesamtbild" · „viele
   Sachen sind gar nicht anwählbar" · „kleine Symbole am Haus … jetzt
   kriege ich trotzdem wieder das große Menü" · „nicht mal einen
   [Lade]bild für die Stadt".

   Teil A (stadt-leicht.html?demo=1, Rechner 900 × 600): Rathaus-Modell
   (EIN First über Flügel A, Stufengiebel als Kopfseite, kein Zeltdach,
   Balkon mit Blumenkästen), Nachtbild des Doms (heller, weniger gelb,
   mehr Kontrast), Laternen (Fleck am Boden, angestrahlte Häuser),
   Getreidefelder (groß, von keinem Bild verdeckt, Halme gemalt),
   Bergwerk (hinter der Bahn, größer, im Überblick zu sehen), Dom
   versetzen (grün/rot, „Freier Platz").
   Teil B (kleiner Rahmen 360 × 225 in einer Elternseite, Android 360 × 780
   mit Fingern über CDP): Ladebild mit Alex und Name, Stecknadel immer da,
   feststecken → Rahmen neu laden → dieselbe Ansicht, Dorf zu/auf → wieder
   die Ansicht; langes Drücken → Bearbeiten-Menü mit beschriftetem Blitz
   (kein Tipp ans Spiel); Tipp aufs Haus → „klein: 1" ans Spiel, die Stadt
   fliegt hin, Auswahl am Haus, Zeichen ändert sich → zurück zur Ansicht;
   Tipp aufs Wahrzeichen im Überblick → Menü mit „Verwalten"; der
   versteckte Rahmen ruht.
   Teil C: Bildschirmfotos Tag und Nacht, 360 × 780 und 390 × 844 (BILD=…).

   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/pruefe-844-stadt-walkie313.js
           (BILD=/pfad für Bildschirmfotos, WURZEL=/pfad für die Gegenprobe, NUR=A|B|C)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "", NUR = process.env.NUR || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
/* FASSUNG 844 — die großen Äcker sind vorerst zurückgenommen (Kornwagen/Autos, Sonde 830): diese Punkte stehen als offen, nicht als Fehler */
const offen844 = (gut, was, zusatz) => console.log("  offen " + was + (zusatz ? "   " + zusatz : ""));

const ELTERN = (w, h, suche) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;background:#1b2440;height:2000px}.sp-lstadt{position:absolute;left:0;top:${Math.round((h - w * 10 / 16) / 2)}px;width:${w}px;height:${Math.round(w * 10 / 16)}px}iframe{border:0;width:100%;height:100%;display:block}</style></head><body>
<div class="sp-dl-neustadt-platz" id="platz"></div>
<div class="sp-lstadt" id="huelle"><iframe id="f" src="/stadt-leicht.html?eingebettet=1&mini=1&demo=1&leute=0&gaeste=0&quest=0&jahr=herbst${suche || ""}"></iframe></div>
<script>window.__msgs=[];addEventListener("message",function(e){window.__msgs.push(e.data);});</script></body></html>`;

(async () => {
  const srv = http.createServer((q, a) => {
    const p = decodeURIComponent(q.url.split("?")[0]);
    const m = /^\/__eltern_(\d+)x(\d+)(n?)\.html$/.exec(p);
    if (m) { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(ELTERN(+m[1], +m[2], m[3] ? "&uhr=22:00" : "&uhr=12:00")); }
    const f = path.join(WURZEL, p === "/" ? "/stadt-leicht.html" : p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ende = async () => { await br.close(); srv.close(); console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0); };
  if (BILD) fs.mkdirSync(BILD, { recursive: true });
  /* supabase kommt im Prüfbild nicht aus dem Netz: ein leerer Ersatz */
  const ohneNetz = async (ctx) => { await ctx.route(/cdn\.jsdelivr\.net/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "window.supabase=null;" })); };
  const warteFertig = (f) => f.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });

  /* =================== TEIL A =================== */
  if (!NUR || NUR === "A") {
    console.log("\nTEIL A — Modelle, Licht, Felder, Bergwerk, Dom setzen (900 × 600)\n");
    /* Rathaus: das Modell (Quelltext) */
    const rh = fs.readFileSync(path.join(WURZEL, "stadt/modelle/rathaus_doebeln.js"), "utf8");
    sage(/giebelScheibe\(W, "kopfgiebel"/.test(rh) && /W\.teil\("adachV"\)/.test(rh) && /A_FIRST/.test(rh), "Rathaus: EIN Satteldach über Flügel A (First A_FIRST) bis zur Kopfseite mit dem Stufengiebel");
    sage(!/zeltdach[SONW]/.test(rh) && !/"giebelvorn"/.test(rh) && !/W\.teil\("giebeldach"\)/.test(rh), "Rathaus: kein Giebel nach vorn, kein Dach nach hinten, kein Zeltdach daneben (keine Dächer quer nach vorn)");
    sage(/balkonBauen\([^;]*GY1 \+ 1\.25, "balkonA"\)/.test(rh) && /blumenkastenMaler/.test(rh), "Rathaus: der Balkon weit vorgezogen, mit Blumenkästen");
    const ctx = await br.newContext({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 1 });
    await ohneNetz(ctx);
    const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
    const pf = []; pg.on("pageerror", (e) => pf.push(e.message));
    await pg.goto(basis + "/stadt-leicht.html?demo=1&leute=0&gaeste=0&quest=0&jahr=herbst&uhr=22:00", { waitUntil: "load" });
    await warteFertig(pg); await pg.waitForTimeout(1500);
    sage(!pf.length, "lädt ohne Seitenfehler", pf.join(" | "));
    /* Rathaus-Bild: Die gebackenen Bilder sind neuer als das Modell von 829 (Dach über Flügel A sieht man im Bild) */
    const domWerte = await pg.evaluate(() => new Promise((ok) => {
      const img = new Image(); img.onload = () => {
        const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const g = c.getContext("2d"); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0, s = 0, s2 = 0, gelb = 0; const l = [];
        /* nur die Wände (unteres Drittel bis Mitte, dort wo die Strahler hinleuchten) */
        for (let y = Math.round(c.height * 0.45); y < c.height * 0.95; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4; if (d[i + 3] < 200) continue; const L = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11); n++; s += L; s2 += L * L; gelb += (d[i] - d[i + 2]); l.push(L); }
        l.sort((a, b) => a - b);
        ok({ hell: s / n, streu: Math.sqrt(s2 / n - (s / n) * (s / n)), gelb: gelb / n / Math.max(1, s / n), p90: l[Math.floor(l.length * 0.9)], p10: l[Math.floor(l.length * 0.1)] });
      }; img.src = "stadt-leicht/bilder/w_koelner_dom_herbst_nacht_f_315_k.webp?t=" + Date.now();
    }));
    const dw = JSON.stringify(Object.fromEntries(Object.entries(domWerte).map(([k, v]) => [k, +v.toFixed(3)])));
    sage(domWerte.hell > 76 && domWerte.p90 > 105, "Kölner Dom nachts: die angestrahlten Wände sind hell (weißes Flutlicht statt beiger Block)", dw);
    sage(domWerte.gelb < 0.13, "Kölner Dom nachts: nicht mehr gelblich (Rot kaum über Blau)", dw);
    sage(domWerte.p90 - domWerte.p10 > 60, "Kölner Dom nachts: Kontrast zwischen angestrahlten Flächen und tiefen Schatten", dw);

    /* Laternen: Fleck am Boden (mit und ohne Kegel verglichen) und angestrahlte Häuser */
    const licht = await pg.evaluate(async () => {
      const ST = STADT, K = ST.kamera, SZ = ST.szene;
      const lat = SZ.objekte.filter((o) => SZ.istLaterne(o) && SZ.laterneAn(o, SZ.zeitDaten(), 22));
      const o = lat[Math.floor(lat.length / 2)];
      K.x = o.x; K.y = o.y; K.s = 14 * K.dpr; ST.leicht.unruhe = 2;
      const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
      await warte(1200);
      const miss = async (ohne) => {
        SZ.pruef.ohneKegel = ohne; ST.leicht.unruhe = 2; await warte(700);
        const c = document.getElementById("lDinge"), g = c.getContext("2d"), P = ST.proj(o.x, o.y, 0), R = 5 * K.s;
        const d = g.getImageData(Math.round(P[0] - R), Math.round(P[1] - R * 0.5), Math.round(2 * R), Math.round(R)).data; let s = 0;
        for (let i = 0; i < d.length; i += 4) s += (d[i] + d[i + 1] + d[i + 2]) / 3 * d[i + 3] / 255;
        return s / (d.length / 4);
      };
      const mit = await miss(false), ohne = await miss(true); SZ.pruef.ohneKegel = false;
      /* Überblick: wie viele Häuser werden angestrahlt? */
      K.x = 5; K.y = 10; K.s = 3.2 * K.dpr; ST.leicht.unruhe = 2; await warte(1500);
      return { mit: mit, ohne: ohne, angestrahlt: SZ.angestrahlt, laternen: lat.length };
    });
    sage(licht.mit - licht.ohne > 18, "Laterne: deutlicher warmer Fleck am Boden (Helligkeit mit − ohne Kegel)", JSON.stringify({ mit: +licht.mit.toFixed(1), ohne: +licht.ohne.toFixed(1) }));
    sage(licht.angestrahlt >= 17, "Laternen strahlen viele Häuser an (Reichweite 13 m)", "angestrahlt " + licht.angestrahlt + " von " + licht.laternen + " Laternen");

    /* Felder */
    await pg.goto(basis + "/stadt-leicht.html?demo=1&leute=0&gaeste=0&quest=0&jahr=herbst&uhr=12:00&s=3.2&kx=5&ky=10", { waitUntil: "load" });
    await warteFertig(pg); await pg.waitForTimeout(2500);
    const felder = await pg.evaluate(() => {
      const D = STADT.dorf, SZ = STADT.szene, K = STADT.kamera;
      return (D.FELD_ORTE || []).map((f) => {
        const flaeche = f.u0 != null ? (f.u1 - f.u0) * (f.v1 - f.v0) / 2 : Math.PI * f.r * f.r / 2;
        /* Punkte im Feld: deckt ein Bild (Haus, Wahrzeichen, Baum) sie zu? */
        let gedeckt = 0, n = 0;
        for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
          const u = f.u0 != null ? f.u0 + (f.u1 - f.u0) * (i + 0.5) / 5 : f.x - f.y, v = f.v0 != null ? f.v0 + (f.v1 - f.v0) * (j + 0.5) / 5 : f.x + f.y;
          const P = STADT.proj((u + v) / 2, (v - u) / 2, 0); n++;
          if (SZ.treffer(P[0], P[1])) gedeckt++;
        }
        return { nr: f.nr, flaeche: Math.round(flaeche), gedeckt: gedeckt / n };
      });
    });
    /* FASSUNG 829 — XANDER (Funk 255): Acker 91 „standardmäßig zwischen der Bäckerei und der Mühle … hinter der Bäckerei";
       dort ist weniger Platz – der Ort geht vor der Größe (91 ≥ 180 m², 92 weiter ≥ 250 m²) */
    sage(felder.length >= 2 && felder.every((f) => f.flaeche >= (f.nr === 91 ? 180 : 250)), "zwei große Äcker (91 ≥ 180 m² hinter der Bäckerei, 92 ≥ 250 m²)", JSON.stringify(felder));
    sage(felder.length >= 2 && felder.every((f) => f.gedeckt <= 0.15), "kein Wahrzeichen, Haus oder Baum verdeckt die Äcker (≤ 15 % der Prüfpunkte)", JSON.stringify(felder.map((f) => f.gedeckt)));
    const halme = await pg.evaluate(() => {
      const c = document.getElementById("lDinge"), g = c.getContext("2d"), f = STADT.dorf.FELD_ORTE[0], P = STADT.proj(f.x, f.y, 0);
      const d = g.getImageData(Math.round(P[0] - 6), Math.round(P[1] - 3), 12, 6).data; let a = 0, gelb = 0; for (let i = 0; i < d.length; i += 4) { a += d[i + 3]; gelb += d[i] + d[i + 1] - 2 * d[i + 2]; }
      return { deckend: a / (d.length / 4), gelb: gelb / (d.length / 4) };
    });
    sage(halme.deckend > 200 && halme.gelb > 120, "auf dem Acker steht gemaltes Korn (deckend, gelb-grün)", JSON.stringify(halme));
    /* Bergwerk */
    const berg = await pg.evaluate(() => {
      const D = STADT.dorf, o = STADT.szene.objekte.find((x) => x.spiel === "bergwerk"), K = STADT.kamera;
      const u = o.x - o.y, v = o.x + o.y, e = STADT.szene.sichtbare.find((x) => x.o === o);
      return { hinter: v < D.bahnV(u) - 8, v: +v.toFixed(1), bahn: +D.bahnV(u).toFixed(1), horizont: D.HORIZONT, stufe: +o.stufe.toFixed(2), hoch: e ? Math.round(e.meta.h * e.k / K.dpr) : 0 };
    });
    sage(berg.hinter && berg.v > berg.horizont - 12, "Bergwerk hinter den Gleisen am Fuß der Alpen", JSON.stringify(berg));
    sage(berg.stufe >= 1.3 && berg.hoch >= 45, "Bergwerk größer (≥ 1,3-fach) und im Überblick gut zu sehen (≥ 45 px hoch)", JSON.stringify(berg));
    if (BILD) await pg.screenshot({ path: path.join(BILD, "a-ueberblick-tag.png") });

    /* Dom versetzen: grün/rot und „Freier Platz" */
    const dom = await pg.evaluate(async () => {
      const ST = STADT, SZ = ST.szene, O = ST.oberflaeche, warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
      const o = SZ.objekte.find((x) => x.spiel === "koelner_dom"); if (!o) return { fehlt: 1 };
      if (!O.langMenue) return { fehlt: "langes Drücken (O.langMenue)" };
      SZ.auswahl = o; O.langMenue(o); await warte(200);
      const vs = [...document.querySelectorAll(".lk-karte button")].find((b) => b.title === "Versetzen" || /Versetzen/.test(b.textContent));
      if (!vs) return { keinVersetzen: [...document.querySelectorAll(".lk-karte button")].map((b) => b.title || b.textContent) };
      vs.click(); await warte(300);
      const fp = [...document.querySelectorAll(".lk-karte button")].find((b) => /Freier Platz/.test(b.textContent));
      const frei0 = o._frei;
      const rh = SZ.objekte.find((x) => x.spiel === "rathaus"); o.x = rh.x; o.y = rh.y;
      O.zeigerZiehen({ x: 100, y: 100 }, { x: 100, y: 100 }); // (kein echter Zug: prüft nur)
      const ziehenAn = O.gehoben ? 1 : 0;
      /* auf das Rathaus gestellt: rot */
      const q0 = STADT.dorf.freiFuerWunder({ fussS: o.fuss, pruefDreh: o.dreh }, o.x, o.y, [], true);
      if (fp) fp.click(); await warte(200);
      const frei1 = o._frei, weg = Math.hypot(o.x - rh.x, o.y - rh.y);
      return { knopf: !!fp, frei0: frei0, aufRathausFrei: !!q0, frei1: frei1, weg: +weg.toFixed(1), ziehenAn: ziehenAn };
    });
    sage(dom.knopf && typeof dom.frei0 === "boolean", "Dom versetzen: der Rahmen zeigt frei (grün) oder besetzt (rot), dazu „Freier Platz\"", JSON.stringify(dom));
    sage(dom.aufRathausFrei === false && dom.frei1 === true && dom.weg > 10, "Dom auf das Rathaus gestellt → rot; „Freier Platz\" schiebt ihn an eine freie Stelle", JSON.stringify(dom));
    await ctx.close();
  }

  /* =================== TEIL B =================== */
  const rahmenTeil = async (w, h, bildName) => {
    const ctx = await br.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    await ohneNetz(ctx);
    await ctx.addInitScript(() => { window.__brumm = []; try { Object.defineProperty(navigator, "vibrate", { configurable: true, value: (ms) => { window.__brumm.push(ms); return true; } }); } catch (e) {} });
    const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
    const pf = []; pg.on("pageerror", (e) => pf.push(e.message));
    const cdp = await ctx.newCDPSession(pg);
    const rahmen = () => pg.frames().find((x) => /stadt-leicht\.html/.test(x.url()));
    const laden = async (langsam) => {
      if (langsam) await pg.route(/stadt-leicht\/bilder\/.*\.webp/, async (r) => { await new Promise((ok) => setTimeout(ok, 1500)); try { await r.continue(); } catch (e) {} });
      await pg.goto(basis + "/__eltern_" + w + "x" + h + ".html", { waitUntil: "commit" });
      let f = null; for (let i = 0; i < 200 && !(f = rahmen()); i++) await pg.waitForTimeout(50);
      return f;
    };
    try { await pg.evaluate(() => localStorage.clear()); } catch (e) {}
    let f = await laden(true);
    await pg.waitForTimeout(700);
    /* Ladebild: steht, mit Alex und Name (der Name vom letzten Mal: hier vorher gemerkt) */
    const lade0 = await f.evaluate(() => { const l = document.getElementById("lLade"); if (!l) return null; const r = l.getBoundingClientRect(), i = l.querySelector("img"); return { da: !l.classList.contains("weg"), voll: r.width >= innerWidth - 1 && r.height >= innerHeight - 1, bild: !!i && /alex/.test(i.src), name: (l.querySelector("b") || {}).textContent, text: l.textContent }; }).catch(() => null);
    sage(!!lade0 && lade0.da && lade0.voll && lade0.bild && /Gleich siehst du deine Stadt/.test(lade0.text || ""), "Ladebild: Alex, „Gleich siehst du deine Stadt!\" und der Name, über dem ganzen Rahmen", JSON.stringify(lade0));
    await pg.unroute(/stadt-leicht\/bilder\/.*\.webp/);
    await warteFertig(f);
    const weg = await f.waitForFunction(() => !document.getElementById("lLade"), null, { timeout: 20000 }).then(() => true, () => false);
    sage(weg, "das Ladebild geht, sobald die Häuser stehen");
    await f.evaluate(() => { try { localStorage.setItem("leicht_stadtname", "Xanderhausen"); } catch (e) {} });
    await pg.waitForTimeout(800);
    const off = await pg.evaluate(() => { const r = document.getElementById("f").getBoundingClientRect(); return { x: r.left, y: r.top }; });
    /* (ein kurzer Tipp: Ende gleich hinter dem Anfang – unter Last malt das Prüf-Chromium ein Bild mehrere hundert ms lang,
       sonst würde aus dem Tipp schon ein langes Drücken) */
    const tipp = async (x, y, dauer) => { const t0 = Date.now() / 1000; await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x, y: y, id: 1 }], timestamp: t0 }); if (dauer) await pg.waitForTimeout(dauer); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: t0 + (dauer || 40) / 1000 + 0.01 }); };
    const kam = () => f.evaluate(() => { const K = STADT.kamera; return { x: K.x, y: K.y, s: K.s / K.dpr, dreh: K.dreh, ue: STADT.oberflaeche.ueberblick().s / K.dpr }; });
    const ruhig = async () => { let alt = "", n = 0; for (let i = 0; i < 60; i++) { const k = JSON.stringify(await kam()); n = k === alt ? n + 1 : 0; if (n >= 3) return; alt = k; await pg.waitForTimeout(200); } };
    const hausPunkt = (g, anteil) => f.evaluate(([g, a]) => { const K = STADT.kamera, o = STADT.szene.objekte.find((x) => x.spiel === g); const P = STADT.proj(o.x, o.y, (o.hoehe || 8) * (o.stufe || 1) * (a == null ? 0.35 : a)); return { x: P[0] / K.dpr, y: P[1] / K.dpr }; }, [g, anteil]);
    await ruhig();
    /* unter Last malt das Prüf-Chromium ein Bild mehrere hundert ms lang, das Loslassen käme dann nach 0,5 s an: für die
       Sonde zählt erst 1,5 s Halten als langes Drücken (O.langMs), das lange Drücken hält 2,2 s */
    await f.evaluate(() => { STADT.oberflaeche.langMs = 1500; });

    /* Stecknadel */
    const pin0 = await f.evaluate(() => { const b = document.querySelector(".lk-pinknopf"); const r = b && b.getBoundingClientRect(); return b && { sicht: getComputedStyle(b).display !== "none" && r.width > 0, w: Math.round(r.width + 6), h: Math.round(r.height + 6) }; });
    sage(!!pin0 && pin0.sicht, "Stecknadel steht im kleinen Bild auch im Überblick (nicht erst nah dran)", JSON.stringify(pin0));
    /* eine eigene Ansicht: näher, gedreht, verschoben */
    await f.evaluate(() => { const ST = STADT, K = ST.kamera, g = ST.oberflaeche.ueberblick(); ST.drehen.setzen(0.5); K.x = g.x + 6; K.y = g.y - 4; K.s = g.s * 2.2; ST.leicht.unruhe = 2; });
    await pg.waitForTimeout(900);
    const ansicht = await kam();
    await f.evaluate(() => document.querySelector(".lk-pinknopf").click());
    const gespeichert = await f.evaluate(() => { try { return JSON.parse(localStorage.getItem("lk-pin-ansicht")); } catch (e) { return null; } });
    sage(!!gespeichert && Math.abs(gespeichert.dreh - 0.5) < 0.01 && Math.abs(gespeichert.s - ansicht.s) < 0.05, "Nadel steckt die eigene Ansicht fest (Lage, Nähe, Drehung)", JSON.stringify(gespeichert));
    /* raus aus dem Dorf (Platzhalter weg, Rahmen versteckt), woanders hinschauen, wieder rein */
    await f.evaluate(() => { const K = STADT.kamera, g = STADT.oberflaeche.ueberblick(); K.x = g.x - 20; K.y = g.y + 10; K.s = g.s; STADT.drehen.setzen(0); });
    await pg.evaluate(() => { document.getElementById("platz").remove(); document.getElementById("huelle").style.visibility = "hidden"; });
    await pg.waitForTimeout(1900);
    const ruht = await f.evaluate(() => STADT.leicht.versteckt);
    sage(ruht === true, "versteckter Rahmen: die Stadt ruht (keine Bilder, warm im Speicher)");
    await pg.evaluate(() => { const p = document.createElement("div"); p.className = "sp-dl-neustadt-platz"; p.id = "platz"; document.body.prepend(p); document.getElementById("huelle").style.visibility = ""; });
    await pg.waitForTimeout(1300); await ruhig();
    const zurueck = await kam();
    sage(Math.abs(zurueck.x - ansicht.x) < 0.6 && Math.abs(zurueck.y - ansicht.y) < 0.6 && Math.abs(zurueck.s - ansicht.s) < 0.1 && Math.abs(zurueck.dreh - 0.5) < 0.01, "zurück ins Dorf: wieder genau die festgesteckte Ansicht", JSON.stringify({ ansicht, zurueck }));
    /* Rahmen neu laden (nach Minuten weggeworfen): öffnet dort */
    f = await (async () => { await pg.evaluate(() => { const i = document.getElementById("f"); i.src = i.src; }); await pg.waitForTimeout(500); const r = rahmen(); await warteFertig(r); await pg.waitForTimeout(1500); return r; })();
    f = rahmen(); await ruhig();
    const neu = await kam();
    sage(Math.abs(neu.x - ansicht.x) < 0.6 && Math.abs(neu.s - ansicht.s) < 0.1 && Math.abs(neu.dreh - 0.5) < 0.01, "neu geladener Rahmen öffnet mit der festgesteckten Ansicht", JSON.stringify(neu));
    await f.evaluate(() => document.querySelector(".lk-pinknopf").click());
    const los = await f.evaluate(() => localStorage.getItem("lk-pin-ansicht"));
    sage(los == null, "Tipp auf die Nadel in genau dieser Ansicht löst sie wieder");
    await f.evaluate(() => (STADT.oberflaeche.zurStartAnsicht || (() => {}))(false)); await pg.waitForTimeout(600); await ruhig();

    /* langes Drücken → Bearbeiten-Menü */
    await pg.evaluate(() => { window.__msgs.length = 0; });
    let hp = await hausPunkt("schule");
    await f.evaluate(() => { STADT.oberflaeche.langMs = 1500; });
    await tipp(off.x + hp.x, off.y + hp.y, 2200);
    await pg.waitForTimeout(700);
    const lang = await f.evaluate(() => { const k = document.querySelector(".lk-karte.lk-am-ding"); if (!k || k.hidden) return null; const d = k.querySelector(".lk-direkt-zeile"), r = d && d.getBoundingClientRect(); return { titel: k.querySelector(".lk-karte-titel").textContent, knoepfe: [...k.querySelectorAll("button")].map((b) => b.title || b.textContent.trim()), blitz: d && d.textContent, blitzH: r && Math.round(r.height), brumm: window.__brumm.length }; });
    const msgLang = await pg.evaluate(() => window.__msgs.filter((m) => m && m.typ === "leicht-haus"));
    sage(!!lang && /Schule/.test(lang.titel) && lang.knoepfe.indexOf("Versetzen") >= 0 && lang.brumm > 0, "langes Drücken auf ein Haus (auch im Überblick): kurzes Summen, Bearbeiten-Menü am Haus mit Versetzen", JSON.stringify(lang));
    sage(!!lang && /Ein Tipp produziert sofort: aus/.test(lang.blitz || ""), "das Loslassen nach dem langen Drücken schaltet nichts im Menü (der Blitz bleibt aus)", JSON.stringify(lang && lang.blitz));
    sage(!!lang && /Ein Tipp produziert sofort: (an|aus)/.test(lang.blitz || "") && lang.blitzH >= 30, "der Blitz hat eine Beschriftung („Ein Tipp produziert sofort: an/aus\", ≥ 30 px)", JSON.stringify(lang && lang.blitz));
    sage(msgLang.length === 0, "langes Drücken ist kein Tipp: das Spiel öffnet nichts", JSON.stringify(msgLang));
    if (BILD) await pg.screenshot({ path: path.join(BILD, "b-" + w + "-lang-menue.png") });
    await f.evaluate(() => { const z = [...document.querySelectorAll(".lk-karte button")].find((b) => b.title === "Schließen"); if (z) z.click(); (STADT.oberflaeche.zurStartAnsicht || (() => {}))(false); });
    await pg.waitForTimeout(600); await ruhig();

    /* Tipp aufs Haus → klein: 1, hinfliegen, Auswahl, Zeichen ändert sich → zurück */
    const vor = await kam();
    await pg.evaluate(() => { window.__msgs.length = 0; });
    hp = await hausPunkt("muehle", 0.3);
    if (process.env.DEBUG) await f.evaluate(() => { const O = STADT.oberflaeche; window.__log = []; for (const k of ["langMenue", "tippen", "zeigerRunter", "zeigerHoch", "fokus"]) { const alt = O[k]; O[k] = function () { window.__log.push(k + "@" + Math.round(performance.now())); return alt.apply(this, arguments); }; } });
    await tipp(off.x + hp.x, off.y + hp.y);
    for (let i = 0; i < 40 && !(await pg.evaluate(() => window.__msgs.some((m) => m && m.typ === "leicht-haus"))); i++) await pg.waitForTimeout(150);
    const msgs = await pg.evaluate(() => window.__msgs.filter((m) => m && m.typ === "leicht-haus"));
    /* das Spiel antwortet mit den kleinen Symbolen (spiel.js lsKleineWahl) – dann fliegt die Stadt zum Haus */
    await pg.evaluate(() => document.getElementById("f").contentWindow.postMessage({ typ: "leicht-wahl", g: "muehle", fokus: 1, wahl: [{ w: "mehl", name: "Mehl", n: 4 }] }, location.origin));
    await pg.waitForTimeout(900); await ruhig();
    if (process.env.DEBUG) console.log("DEBUG", JSON.stringify(await f.evaluate(() => window.__log)), JSON.stringify(await pg.evaluate(() => window.__msgs)), await f.evaluate(() => document.body.className + " karte:" + (document.querySelector(".lk-karte:not([hidden])") || { textContent: "-" }).textContent));
    const nah = await kam();
    const mitte = await f.evaluate(() => { const K = STADT.kamera, o = STADT.szene.objekte.find((x) => x.spiel === "muehle"), P = STADT.proj(o.x, o.y, 4); return { dx: Math.round(P[0] / K.dpr - innerWidth / 2), dy: Math.round(P[1] / K.dpr - innerHeight / 2) }; });
    sage(msgs.length === 1 && msgs[0].g === "muehle" && msgs[0].klein === 1, "Tipp aufs Haus fragt das Spiel nach den kleinen Symbolen (leicht-haus mit klein: 1)", JSON.stringify(msgs));
    sage(nah.s > vor.s * 2 && Math.abs(mitte.dx) < 70 && Math.abs(mitte.dy) < 60, "mit den kleinen Symbolen fliegt die Stadt zum gewählten Haus (näher, das Haus in der Mitte)", JSON.stringify({ vor: +vor.s.toFixed(2), nah: +nah.s.toFixed(2), mitte }));
    const wahl = await f.evaluate(() => { const w = document.querySelector(".lk-wahl"); if (!w) return null; const r = w.getBoundingClientRect(); return { n: w.querySelectorAll("button").length, drin: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight, klein: [...w.querySelectorAll("button")].every((b) => b.getBoundingClientRect().width >= 30) }; });
    sage(!!wahl && wahl.n >= 2 && wahl.drin && wahl.klein, "die kleinen Symbole stehen am Haus, ganz im Bild (Tippflächen ≥ 30 px)", JSON.stringify(wahl));
    if (BILD) await pg.screenshot({ path: path.join(BILD, "b-" + w + "-haus-symbole.png") });
    await f.evaluate(() => { const b = document.querySelector(".lk-wahl .lk-wahl-knopf"); if (b) b.click(); });
    await pg.evaluate(() => document.getElementById("f").contentWindow.postMessage({ typ: "leicht-zeichen", z: { muehle: ["laeuft", "Mehl 2:00", "mehl"] } }, location.origin));
    for (let i = 0; i < 30; i++) { const k = await kam(); if (Math.abs(k.s - vor.s) < vor.s * 0.05) break; await pg.waitForTimeout(200); }
    await ruhig();
    const danach = await kam();
    sage(Math.abs(danach.s - vor.s) < vor.s * 0.05 && Math.abs(danach.x - vor.x) < 1 && Math.abs(danach.y - vor.y) < 1, "Aufgabe erledigt (Symbol getippt, Mühle mahlt) → wieder das Gesamtbild der Stadt", JSON.stringify({ vor, danach }));
    const machen = await pg.evaluate(() => window.__msgs.filter((m) => m && m.typ === "leicht-machen"));
    sage(machen.length === 1 && machen[0].w === "mehl", "das Symbol startet genau diese Aufgabe (leicht-machen)", JSON.stringify(machen));

    /* Wahrzeichen im Überblick anwählbar */
    await pg.evaluate(() => { window.__msgs.length = 0; });
    hp = await hausPunkt("fernsehturm", 0.25);
    await tipp(off.x + hp.x, off.y + hp.y);
    for (let i = 0; i < 40 && !(await f.evaluate(() => { const k = document.querySelector(".lk-karte.lk-am-ding"); return !!k && !k.hidden; })); i++) await pg.waitForTimeout(150);
    await pg.waitForTimeout(900);
    const wz = await f.evaluate(() => { const k = document.querySelector(".lk-karte.lk-am-ding"); if (!k || k.hidden) return null; const r = k.getBoundingClientRect(); return { titel: k.querySelector(".lk-karte-titel").textContent, verwalten: !!k.querySelector(".lk-verwalten-knopf"), drin: r.left >= -0.5 && r.right <= innerWidth + 0.5 && r.top >= -0.5 && r.bottom <= innerHeight + 0.5 }; });
    sage(!!wz && /Fernsehturm/.test(wz.titel) && wz.verwalten && wz.drin, "Tipp auf ein Wahrzeichen im Überblick: Menü mit „Verwalten\" (vorher geschah nichts)", JSON.stringify(wz));
    if (BILD) await pg.screenshot({ path: path.join(BILD, "b-" + w + "-wahrzeichen.png") });
    sage(!pf.length, "keine Seitenfehler", pf.slice(0, 3).join(" | "));
    await ctx.close();
  };
  if (!NUR || NUR === "B") {
    console.log("\nTEIL B — kleiner Rahmen, Android 360 × 780 (Finger)\n");
    await rahmenTeil(360, 780);
  }

  /* =================== TEIL C: Bildschirmfotos =================== */
  if ((!NUR || NUR === "C") && BILD) {
    console.log("\nTEIL C — Bildschirmfotos\n");
    for (const [w, h] of [[360, 780], [390, 844]]) for (const nacht of [false, true]) {
      const ctx = await br.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      await ohneNetz(ctx);
      const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
      await pg.goto(basis + "/__eltern_" + w + "x" + h + (nacht ? "n" : "") + ".html", { waitUntil: "load" });
      let f = null; for (let i = 0; i < 200 && !(f = pg.frames().find((x) => /stadt-leicht\.html/.test(x.url()))); i++) await pg.waitForTimeout(50);
      await warteFertig(f); await pg.waitForTimeout(3000);
      await pg.screenshot({ path: path.join(BILD, "c-" + w + "x" + h + (nacht ? "-nacht" : "-tag") + ".png") });
      await f.evaluate(() => document.querySelector(".lk-lupe").click()); await pg.waitForTimeout(2500);
      await pg.screenshot({ path: path.join(BILD, "c-" + w + "x" + h + (nacht ? "-nacht" : "-tag") + "-nah.png") });
      console.log("  Bild " + w + "×" + h + (nacht ? " Nacht" : " Tag"));
      await ctx.close();
    }
  }
  await ende();
})().catch((e) => { console.error(e); fehler++; process.exit(1); });
