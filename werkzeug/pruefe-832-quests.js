#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 832: QUESTS IN DER LEICHTEN STADT
   ---------------------------------------------------------------------
   XANDER (Funk 213/214, wörtlich): „Bitte gestalte überall Quest
   innerhalb der Stadt mit Leuten die in Deutsch Hilfe brauchen … dann
   leuchtet es immer irgendwo … da steht dann z.B eine weinende Frau …
   wie sie den Weg zum Rathaus findet … dann muss sie halt einen Satz
   auswählen … dass die Frau dann realistisch auch zu dem Rathaus läuft
   … sieht es so eine Linie die … rot geht oder grün geht … vielleicht
   bräuchten wir dann ein Wegesystem … dass wir sie immer als Connector
   haben immer da wo ein Haus an einem Weg steht".

   Geprüft (stadt-leicht.html?demo=1 mit der gebündelten leicht.min.js;
   die Quests kommen nachgeladen aus quests.min.js):
     A WEGENETZ   ein zusammenhängender Graph; jedes Haus, Wahrzeichen,
                  Bahnhof, Bootsverleih, Brunnen hat einen Eingang vor
                  seiner Front (nicht im eigenen oder einem anderen
                  Grundriss), einen kurzen Connector und ist vom Markt
                  aus erreichbar – auch nach Versetzen eines Hauses (822)
                  und eines Wahrzeichens (826)
     B WEGBESCHREIBUNG  für viele zufällige Routen: an jeder Kreuzung
                  stimmt links/rechts/geradeaus mit dem Winkel der Route
                  (Welt und Bild), das Ende (links/rechts/vor Ihnen) mit
                  der Lage der Tür; der Text nennt die Schritte in dieser
                  Reihenfolge; wer ihm folgt, kommt an, wer einer
                  falschen Antwort folgt, nicht
     C QUEST      „!" erscheint (≥ 30 px), Tipp → Kamera fährt hin,
                  Dialog (360 px: im Bild, Tippflächen ≥ 30 px, nichts
                  überlappt, Person über dem Dialog), falsche Antwort →
                  Hinweis + rote Linie, „?"; richtige → grüne Linie, die
                  Person läuft auf dem Weg (≤ 0,35 m daneben) bis zur
                  Tür, Jubel, Punkte gemeldet und gezählt
     D VORLAGEN   alle 16 Vorlagen lassen sich bauen, genau eine Antwort
                  richtig, drei verschiedene; Hund und Eiswagen da; nach
                  der dritten Quest ein Schmuck-Geschenk in der Stadt
     E SCHWÄCHEN  „betonung" schwach → Betonungs-Quests öfter, Mut-Bonus
     F KLEINER RAHMEN  in einer Elternseite (360 × 740, Rahmen 360 × 225):
                  leicht.min.js ohne Quest-Code, kein Laufblatt vor dem
                  Tipp, „!" im Überblick, Dialog im Rahmen (rollbar),
                  Meldung „leicht-quest" mit Punkten kommt beim Spiel an;
                  ohne ?quest=1 lädt die Sonde keine Quests
   Mit dem alten Stand (ohne quests.js) ist alles rot.
   Bildschirmfotos (BILD=/pfad/praefix): -dialog.png, -rot.png,
   -gruen.png, -rahmen.png, -rahmen-dialog.png, -hund.png, -eis.png
   Aufruf: node werkzeug/pruefe-832-quests.js   (TEIL=A…F einzeln)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TEIL = process.env.TEIL || "ABCDEF";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };

let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const ELTERN = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<body style="margin:0;background:#223"><div style="height:120px;color:#fff;font:14px system-ui;padding:8px">Spiel (Elternseite)</div>
<iframe id="r" src="/stadt-leicht.html?eingebettet=1&mini=1&demo=1&zeit=tag&jahr=herbst&uhr=12:00&QUEST" style="width:360px;height:225px;border:0;display:block"></iframe>
<script>window.__meldungen=[];addEventListener("message",function(e){if(e.data&&e.data.typ==="leicht-quest")__meldungen.push(e.data);});</script></body>`;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    if (p === "/__eltern.html" || p === "/__eltern0.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(ELTERN.replace("&QUEST", p === "/__eltern.html" ? "&quest=1&questnur=1" : "")); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ende = async () => { await br.close(); srv.close(); console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0); };
  const seite = async (url, vp, telefon) => {
    const ctx = await br.newContext({ viewport: vp, deviceScaleFactor: telefon ? 2 : 1, hasTouch: !!telefon, isMobile: !!telefon });
    const pg = await ctx.newPage();
    pg.setDefaultTimeout(120000);
    pg.fehler = []; pg.anfragen = [];
    pg.on("pageerror", (e) => pg.fehler.push(e.message));
    pg.on("request", (r) => pg.anfragen.push(r.url()));
    await pg.goto(basis + url, { waitUntil: "load" });
    return pg;
  };
  const warteQuests = async (fr) => {
    const t0 = Date.now();
    while (Date.now() - t0 < 60000) { if (await fr.evaluate(() => !!(window.STADT && STADT.quests && STADT.quests.echt && STADT.quests.pruef)).catch(() => false)) return true; await new Promise((r) => setTimeout(r, 300)); }
    return false;
  };
  const Qp = (fr, fn, arg) => fr.evaluate(fn, arg);
  /* warten, bis die Kamera ruht (unter Last malt Chromium hier nur wenige Bilder je Sekunde) */
  const ruhig = async (fr) => {
    let alt = "", gleich = 0; const t0 = Date.now();
    await new Promise((r) => setTimeout(r, 600));
    while (Date.now() - t0 < 40000 && gleich < 3) {
      const k = await fr.evaluate(() => { const K = STADT.kamera; return [K.x, K.y, K.s].map((v) => v.toFixed(3)).join(","); });
      gleich = k === alt ? gleich + 1 : 0; alt = k; await new Promise((r) => setTimeout(r, 400));
    }
  };
  const warteZustand = async (fr, id, zustaende, ms) => {
    const t0 = Date.now();
    while (Date.now() - t0 < (ms || 60000)) {
      const z = await fr.evaluate((i) => { const l = STADT.quests.pruef.zustand(); const q = l.find((x) => x.id === i); return q ? q.zustand : "fort"; }, id);
      if (zustaende.indexOf(z) >= 0) return z;
      await new Promise((r) => setTimeout(r, 120));
    }
    return null;
  };

  /* ================= Telefon, ganzes Bild ================= */
  const pg = await seite("/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&uhr=12:00&quest=1&questnur=1", { width: 360, height: 740 }, true);
  await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
  await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
  const da = await warteQuests(pg);
  sage(da, "die Quests sind nachgeladen (quests.min.js)", pg.anfragen.filter((u) => /quests/.test(u)).map((u) => u.split("/").pop()).join(","));
  if (!da) { console.log(pg.fehler.join("\n")); return ende(); }

  if (TEIL.indexOf("A") >= 0) {
    console.log("\nA  WEGENETZ UND EINGÄNGE\n");
    const netz = await Qp(pg, () => Object.assign(STADT.quests.pruef.netz(), { komp: STADT.quests.pruef.komponenten() }));
    sage(netz.komp === 1 && netz.knoten > 200 && netz.kreuzungen >= 8, "ein zusammenhängendes Wegenetz mit Kreuzungen", JSON.stringify(netz));
    const pruefeZiele = async (was) => {
      const r = await Qp(pg, () => {
        const SZ = STADT.szene, Z = STADT.quests.pruef.ziele();
        const inPoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
        return Z.map((z) => {
          const eigen = SZ.objekte.find((o) => (o.spiel === z.key) || (z.key === "bahnhof" && o.name === "Bahnhof") || (z.key === "bootsverleih" && o.name === "Bootsverleih"));
          const drin = SZ.objekte.filter((o) => (o.art === "haus" || o.art === "wunder") && !o.versteckt).filter((o) => {
            if (STADT.dorf.teileWelt && o.spiel === "rathaus") return STADT.dorf.imGrundriss("rathaus", z.tuer[0], z.tuer[1], 0.3);
            return inPoly(z.tuer, SZ.ecken(o, 0.3));
          }).map((o) => o.spiel);
          const rand = eigen && eigen.spiel !== "rathaus" ? Math.min(...SZ.ecken(eigen).map((p, i, l) => { const q = l[(i + 1) % l.length], dx = q[0] - p[0], dy = q[1] - p[1], t = Math.max(0, Math.min(1, ((z.tuer[0] - p[0]) * dx + (z.tuer[1] - p[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(z.tuer[0] - p[0] - dx * t, z.tuer[1] - p[1] - dy * t); })) : null;
          return { key: z.key, laenge: z.laenge, abst: z.abst, drin: drin, rand: rand == null ? null : +rand.toFixed(2) };
        });
      });
      const schlecht = r.filter((z) => z.laenge == null || z.abst == null || z.abst > 12 || z.drin.length || (z.rand != null && z.rand > 3.5));
      sage(r.length >= 20 && !schlecht.length, was + ": " + r.length + " Ziele, jedes mit Eingang vor der Front (≤ 3,5 m vom Grundriss, in keinem Haus), Connector ≤ 12 m, vom Markt erreichbar", JSON.stringify(schlecht.length ? schlecht : r.slice(0, 4)));
      return r;
    };
    await pruefeZiele("Grundstellung");
    /* 822: ein Haus versetzen (wie „Versetzen" im Menü: Lage x/y ändern, dann Neuaufbau aus L.lage) */
    const vers = await Qp(pg, () => {
      const o = STADT.szene.objekte.find((x) => x.spiel === "schule"), alt = [o.x, o.y];
      o.x += 7; o.y += 9; STADT.szene.geaendert(); STADT.leicht.dekoSpeichern(); STADT.leicht.aufbauen();
      const n = STADT.szene.objekte.find((x) => x.spiel === "schule"), z = STADT.quests.pruef.ziele().find((q) => q.key === "schule");
      return { alt: alt, neu: [n.x, n.y], tuer: z.tuer, laenge: z.laenge };
    });
    sage(Math.hypot(vers.neu[0] - vers.alt[0] - 7, vers.neu[1] - vers.alt[1] - 9) < 0.3 && vers.laenge != null && Math.hypot(vers.tuer[0] - vers.neu[0], vers.tuer[1] - vers.neu[1]) < 9, "versetzte Schule (822): Eingang wandert mit, weiter erreichbar", JSON.stringify(vers));
    /* 826: ein Wahrzeichen frei aufstellen (L.lage mit Weltlage → Wege werden neu gebaut) */
    const wv = await Qp(pg, () => {
      const L = STADT.leicht, wegeAlt = STADT.dorf.WEGE;
      L.lage = Object.assign({}, L.lage, { fernsehturm: { x: -30, y: 70, dreh: 3.5 } }); L.aufbauen();
      const o = STADT.szene.objekte.find((x) => x.spiel === "fernsehturm"), z = STADT.quests.pruef.ziele().find((q) => q.key === "fernsehturm");
      return { o: o && [o.x, o.y], neuWege: STADT.dorf.WEGE !== wegeAlt, laenge: z && z.laenge, komp: STADT.quests.pruef.komponenten() };
    });
    sage(!!wv.o && Math.hypot(wv.o[0] + 30, wv.o[1] - 70) < 1 && wv.laenge != null && wv.komp === 1, "frei aufgestelltes Wahrzeichen (826): Netz neu, Fernsehturm erreichbar", JSON.stringify(wv));
    await pruefeZiele("nach dem Versetzen");
  }

  if (TEIL.indexOf("B") >= 0) {
    console.log("\nB  WEGBESCHREIBUNG PASST ZUR ROUTE\n");
    const keys = ["rathaus", "bahnhof", "gasthaus", "krankenhaus", "baeckerei", "bibliothek", "fernsehturm", "holstentor", "koelner_dom", "schmiede", "kaserne", "bootsverleih"];
    let n = 0, gut = 0, schlecht = [], worte = { links: 0, rechts: 0, geradeaus: 0, "halb links": 0, "halb rechts": 0 }, enden = {}, bruecken = 0;
    for (let runde = 0; runde < 3; runde++) for (const key of keys) {
      const r = await Qp(pg, (k) => {
        const R0 = STADT.quests.pruef.richtung(k); if (!R0) return null;
        /* unabhängig nachrechnen: 6 m vor dem Eintritt in die Kreuzung, Kreuzung, 6 m nach dem Austritt */
        const R = R0.R, zurueck = (i, d) => { let s = 0; while (i > 0 && s < d) { s += Math.hypot(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]); i--; } return R[i]; };
        const vor = (i, d) => { let s = 0; while (i < R.length - 1 && s < d) { s += Math.hypot(R[i + 1][0] - R[i][0], R[i + 1][1] - R[i][1]); i++; } return R[i]; };
        const cross = (a, b, c) => { const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]]; return { w: Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]) * 180 / Math.PI }; };
        const P = (p) => STADT.proj(p[0], p[1], 0);
        const geo = R0.schritte.map((s) => { const a = zurueck(s.i - 1, 6), b = s.kreuzung, c = vor(s.j, 6), wW = cross(a, b, c).w, wB = cross(P(a), P(b), P(c)).w; return { k: s.k, welt: +wW.toFixed(0), bild: +wB.toFixed(0) }; });
        /* Ende: Laufrichtung am Anschluss gegen die Richtung zur Tür */
        const pts = R0.pts, A = R0.A, T = R0.tuer; let i = pts.length - 3, s = 0; while (i > 0 && s < 4) { s += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); i--; }
        const d = [A[0] - pts[i][0], A[1] - pts[i][1]], v = [T[0] - A[0], T[1] - A[1]], we = Math.atan2(d[0] * v[1] - d[1] * v[0], d[0] * v[0] + d[1] * v[1]) * 180 / Math.PI;
        return { text: R0.text, ende: R0.ende, endeW: +we.toFixed(0), endeLang: Math.hypot(v[0], v[1]), geo: geo, ok: R0.richtigNach, falsch: R0.falsch, brueckeZahl: R0.schritte.filter((x) => x.bruecke).length };
      }, key);
      if (!r) continue;
      n++;
      const klassePasst = (k, w) => k === "geradeaus" ? Math.abs(w) <= 45 : k === "rechts" ? w > 20 && w < 165 : k === "links" ? w < -20 && w > -165 : k === "halb rechts" ? w > 15 && w < 95 : k === "halb links" ? w < -15 && w > -95 : false;
      const geoOk = r.geo.every((g) => klassePasst(g.k, g.welt) && Math.sign(g.welt) === Math.sign(g.bild || g.welt));
      const woerter = (r.text.match(/dann (halb links|halb rechts|links|rechts|weiter geradeaus)\.|Kreuzung (halb links|halb rechts|links|rechts|weiter geradeaus)\./g) || []).map((t) => /halb links/.test(t) ? "halb links" : /halb rechts/.test(t) ? "halb rechts" : /links/.test(t) ? "links" : /rechts/.test(t) ? "rechts" : "geradeaus");
      const textOk = woerter.join(",") === r.geo.map((g) => g.k).join(",");
      const endeOk = r.ende === "vorn" ? (Math.abs(r.endeW) < 50 || r.endeLang < 1.2) : r.ende === "rechts" ? r.endeW > 30 : r.endeW < -30;
      const endeText = r.ende === "vorn" ? /direkt vor Ihnen\.$/.test(r.text) : new RegExp(" " + r.ende + "\\.$").test(r.text);
      const simOk = r.ok && r.falsch.length === 2 && r.falsch.every((f) => !f.ok && f.text !== r.text);
      if (geoOk && textOk && endeOk && endeText && simOk) gut++; else schlecht.push({ key: key, text: r.text, geo: r.geo, ende: r.ende, endeW: r.endeW, simOk: simOk, woerter: woerter });
      for (const g of r.geo) worte[g.k]++;
      enden[r.ende] = (enden[r.ende] || 0) + 1; bruecken += r.brueckeZahl;
    }
    sage(n >= 24 && gut === n, "jede Wegbeschreibung passt zur echten Route: links/rechts/geradeaus = Winkel an der Kreuzung (Welt und Bild gleich), Ende = Lage der Tür, der Richtige kommt an, die zwei Falschen nicht", gut + "/" + n + (schlecht.length ? " " + JSON.stringify(schlecht.slice(0, 2)) : ""));
    sage(worte.links > 0 && worte.rechts > 0, "es kommen Abzweige nach links und nach rechts vor (" + JSON.stringify(worte) + "), Enden " + JSON.stringify(enden) + ", Brücken " + bruecken);
    const bsp = await Qp(pg, () => STADT.quests.pruef.richtung("rathaus"));
    console.log("       Beispiel Rathaus: " + (bsp && bsp.text) + "\n       falsch: " + (bsp && bsp.falsch.map((f) => f.text).join(" | ")));
  }

  if (TEIL.indexOf("C") >= 0) {
    console.log("\nC  QUEST: „!“, DIALOG, FALSCH (ROT), RICHTIG (GRÜN), LAUFEN, PUNKTE\n");
    await Qp(pg, () => { STADT.quests.liste.slice().forEach((q) => { if (q.el) q.el.remove(); }); STADT.quests.liste.length = 0; STADT.kamera.x = 0; STADT.kamera.y = 4; STADT.kamera.s = 7 * STADT.kamera.dpr; STADT.leicht.unruhe = 2; });
    const punkteVor = (await Qp(pg, () => STADT.quests.pruef.stand())).punkte;
    const id = await Qp(pg, () => STADT.quests.pruef.neu("weg_rathaus"));
    sage(id != null, "Quest „Touristin sucht das Rathaus“ erzeugt");
    const z0 = await warteZustand(pg, id, ["wartet"], 120000);
    await pg.waitForFunction(() => { const b = document.querySelector(".lq-zeichen"); return b && b.style.display !== "none" && b.dataset.a === "!"; }, null, { timeout: 90000 }).catch(() => {});
    await pg.waitForTimeout(400);
    let zs = (await Qp(pg, () => STADT.quests.pruef.zustand()))[0];
    const zr = await pg.evaluate(() => { const b = document.querySelector(".lq-zeichen"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, sicht: b.style.display !== "none", svg: !!b.querySelector("svg"), glanz: getComputedStyle(b, "::before").animationName }; });
    sage(z0 === "wartet" && zs.zeichen && zs.zeichen.art === "!" && zr && zr.sicht && zr.w >= 30 && zr.h >= 30 && zr.svg && /lq-leuchten/.test(zr.glanz), "über der Person ein leuchtendes „!“ (selbst gezeichnet, pulsierender Schein, Tippfläche ≥ 30 px)", JSON.stringify(zr));
    const kVor = await Qp(pg, () => ({ x: STADT.kamera.x, y: STADT.kamera.y, s: STADT.kamera.s }));
    await pg.tap(".lq-zeichen");
    await pg.waitForFunction(() => !!document.querySelector(".lq-dialog"), null, { timeout: 30000 }).catch(() => {});
    await ruhig(pg);
    const nach = await Qp(pg, () => { const q = STADT.quests.pruef.zustand()[0], P = STADT.proj(q.x, q.y, 0); return { k: { x: STADT.kamera.x, y: STADT.kamera.y, s: STADT.kamera.s }, px: P[0] / STADT.kamera.dpr, py: P[1] / STADT.kamera.dpr, d: STADT.quests.pruef.dialog(), z: q.zustand, art: q.zeichen && q.zeichen.art }; });
    const d = nach.d;
    sage(Math.hypot(nach.k.x - kVor.x, nach.k.y - kVor.y) > 1 && nach.px > 0 && nach.px < 360 && nach.py > 40, "Tipp aufs „!“: die Kamera fährt weich zur Person", JSON.stringify({ px: Math.round(nach.px), py: Math.round(nach.py), s: +(nach.k.s / 2).toFixed(1) }));
    const antw = d ? d.knoepfe.filter((b) => /lq-antwort/.test(b.klasse)) : [];
    const ueber = antw.some((a, i) => antw.some((b, j) => i < j && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 0.5));
    sage(!!d && antw.length === 3 && d.rahmen.x >= 0 && d.rahmen.x + d.rahmen.w <= 360.5 && d.rahmen.y >= 0 && d.rahmen.y + d.rahmen.h <= 740 && !ueber && d.knoepfe.every((b) => b.h >= 30 && b.w >= 30 && b.sw <= b.cw + 1), "Dialog im 360-px-Bild: Situation, drei Antworten untereinander, nichts überlappt oder läuft über, alle Tippflächen ≥ 30 px", JSON.stringify(d && { rahmen: d.rahmen, knoepfe: d.knoepfe.map((b) => [Math.round(b.w), Math.round(b.h)]) }));
    sage(!!d && nach.py < d.rahmen.y - 20, "die Person steht über dem Dialog im Bild (nicht verdeckt)", JSON.stringify({ person: Math.round(nach.py), dialog: d && Math.round(d.rahmen.y) }));
    sage(nach.z === "offen" && nach.art === "?" && /Orientierung verloren/.test(d.text), "solange sie auf die Antwort wartet: „?“ über ihr; der Text passt (weinende Touristin, Orientierung verloren)", d && d.text);
    if (BILD) await pg.screenshot({ path: BILD + "-dialog.png" });
    const qa = (await Qp(pg, () => STADT.quests.pruef.zustand()))[0];
    const falschI = qa.antworten.findIndex((a) => !a.richtig), richtigI = qa.antworten.findIndex((a) => a.richtig);
    const zaehle = (art) => pg.evaluate((a) => { const c = document.getElementById("lDinge"), g = c.getContext("2d"), d = g.getImageData(0, 0, c.width, c.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 16) { if (d[i + 3] < 200) continue; if (a === "rot" ? d[i] > 200 && d[i + 1] < 80 && d[i + 2] < 70 : d[i + 1] > 180 && d[i] < 100 && d[i + 2] < 120) n++; } return n; }, art);
    const rot0 = await zaehle("rot");
    await Qp(pg, () => { STADT.quests.rotDauer = 60000; });   // (unter Last malt die Sonde nur wenige Bilder je Sekunde)
    await pg.tap('.lq-antwort[data-i="' + falschI + '"]');
    await ruhig(pg);
    const f1 = await Qp(pg, () => ({ d: STADT.quests.pruef.dialog(), q: STADT.quests.pruef.zustand()[0] }));
    const fk = f1.d && f1.d.knoepfe.find((b) => b.i === String(falschI));
    sage(!!fk && fk.aus && /lq-falsch/.test(fk.klasse) && f1.d.hinweis.length > 10 && f1.q.rot && f1.q.zustand === "offen" && f1.q.versuche === 1, "falsche Wegbeschreibung: freundlicher Hinweis, Knopf aus, rote Linie zeigt, wohin sie so käme – nochmal", f1.d && f1.d.hinweis);
    /* rote Linie wirklich im Bild: rote Bildpunkte entlang des falschen Wegs */
    let rotPx = 0; for (let i = 0; i < 40 && rotPx <= 60; i++) { await pg.waitForTimeout(500); rotPx = (await zaehle("rot")) - rot0; }
    await Qp(pg, () => { STADT.quests.rotDauer = 0; });
    sage(rotPx > 60, "die rote Linie ist zu sehen", rotPx + " rote Bildpunkte mehr als vorher (" + rot0 + ")");
    if (BILD) await pg.screenshot({ path: BILD + "-rot.png" });
    await pg.tap('.lq-antwort[data-i="' + richtigI + '"]');
    await pg.waitForTimeout(700);
    const r1 = await Qp(pg, () => ({ d: STADT.quests.pruef.dialog(), q: STADT.quests.pruef.zustand()[0] }));
    sage(r1.q.zustand === "unterwegs" && r1.q.zeichen && r1.q.zeichen.art === "?" && r1.d && /Richtig!/.test(r1.d.hinweis), "richtige Antwort: „Richtig!“ + Dank, sie geht los, „?“ bleibt über ihr, solange sie unterwegs ist", r1.d && r1.d.hinweis);
    await pg.waitForTimeout(2000);
    sage(!(await Qp(pg, () => STADT.quests.pruef.dialog())), "der Dialog geht danach von selbst zu");
    await Qp(pg, () => { const q = STADT.quests.liste[0], K = STADT.kamera; K.x = (q.f.x + q.ziel.tuer[0]) / 2; K.y = (q.f.y + q.ziel.tuer[1]) / 2; K.s = 9 * K.dpr; STADT.leicht.unruhe = 2; STADT.quests._ohneLinie = true; });
    await pg.waitForTimeout(1500);
    const gruen0 = await zaehle("gruen");
    await Qp(pg, () => { STADT.quests._ohneLinie = false; STADT.leicht.unruhe = 2; });
    let gruenPx = 0; for (let i = 0; i < 40 && gruenPx <= 60; i++) { await pg.waitForTimeout(500); gruenPx = (await zaehle("gruen")) - gruen0; }
    sage(gruenPx > 60, "die grüne Linie zeigt den Weg bis zum Ziel", gruenPx + " grüne Bildpunkte mehr als ohne Linie (" + gruen0 + ")");
    if (BILD) await pg.screenshot({ path: BILD + "-gruen.png" });
    /* läuft sie auf dem Weg? (Zeitraffer ×4) */
    await Qp(pg, () => STADT.quests.pruef.schnell(4));
    const spur = [];
    for (let i = 0; i < 400; i++) {
      const q = (await Qp(pg, () => STADT.quests.pruef.zustand()))[0];
      if (!q || q.zustand !== "unterwegs") { spur.zu = q && q.zustand; break; }
      spur.push(q);
      await pg.waitForTimeout(150);
    }
    const abstWeg = (p, W) => { let m = Infinity; for (let i = 1; i < W.length; i++) { const a = W[i - 1], b = W[i], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)); m = Math.min(m, Math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dy * t)); } return m; };
    const maxAb = spur.length ? Math.max(...spur.map((q) => abstWeg([q.x, q.y], q.weg))) : 99;
    const steigt = spur.every((q, i) => i === 0 || q.s >= spur[i - 1].s - 1e-6);
    sage(spur.length >= 5 && maxAb <= 0.35 && steigt, "sie läuft auf dem Wegenetz (höchstens " + maxAb.toFixed(2) + " m neben der Route), immer vorwärts", spur.length + " Messungen, Weg " + (spur[0] && spur[0].weglaenge.toFixed(1)) + " m");
    const fertig = await warteZustand(pg, id, ["jubel", "geht", "fort"], 60000);
    const endeQ = (await Qp(pg, () => ({ q: STADT.quests.liste[0] ? { x: STADT.quests.liste[0].f.x, y: STADT.quests.liste[0].f.y, t: STADT.quests.liste[0].ziel.tuer } : null, m: STADT.quests.pruef.meldung(), st: STADT.quests.pruef.stand() })));
    sage(!!fertig && (!endeQ.q || Math.hypot(endeQ.q.x - endeQ.q.t[0], endeQ.q.y - endeQ.q.t[1]) < 0.6), "am Ziel: sie steht vor dem Rathausportal und jubelt", JSON.stringify(endeQ.q));
    sage(!!endeQ.m && endeQ.m.typ === "leicht-quest" && endeQ.m.punkte >= 8 && endeQ.m.versuche === 1 && endeQ.st.punkte === punkteVor + endeQ.m.punkte, "Punkte gezählt und gemeldet (leicht-quest): Wegbeschreibung 8 P., nach einem Fehlversuch ohne Erstversuch-Bonus", JSON.stringify(endeQ.m));
    await Qp(pg, () => STADT.quests.pruef.schnell(1));
  }

  if (TEIL.indexOf("D") >= 0) {
    console.log("\nD  ALLE VORLAGEN, HUND, EISWAGEN, GESCHENK\n");
    const ids = await Qp(pg, () => STADT.quests.VORLAGEN.map((v) => v.id));
    sage(ids.length >= 12, ids.length + " Quest-Vorlagen", ids.join(", "));
    const probleme = [];
    let gebaut = 0, hundBild = false, eisBild = false;
    for (const vid of ids) {
      await Qp(pg, () => { STADT.quests.dialogZu(); STADT.quests.liste.slice().forEach((q) => { if (q.el) q.el.remove(); }); STADT.quests.liste.length = 0; });
      const id = await Qp(pg, (v) => STADT.quests.pruef.neu(v), vid);
      if (id == null) { probleme.push(vid + ": nicht gebaut"); continue; }
      gebaut++;
      const q = (await Qp(pg, () => STADT.quests.pruef.zustand()))[0];
      const texte = q.antworten.map((a) => a.text);
      if (q.antworten.filter((a) => a.richtig).length !== 1 || new Set(texte).size !== 3) probleme.push(vid + ": Antworten " + JSON.stringify(texte));
      if (vid === "hund" && !q.hund) probleme.push("hund ohne Hund");
      if (vid === "eis" && !q.wagen) probleme.push("eis ohne Wagen");
      if (vid === "hund" || vid === "eis") {
        await Qp(pg, () => STADT.quests.pruef.schnell(3));
        await warteZustand(pg, id, ["wartet"], 120000);
        await Qp(pg, () => STADT.quests.pruef.schnell(1));
        await Qp(pg, () => { const q = STADT.quests.liste[0], K = STADT.kamera; const p = q.hund ? [q.hund.x, q.hund.y] : [q.f.x, q.f.y]; K.x = p[0]; K.y = p[1] + 2; K.s = 16 * K.dpr; STADT.leicht.unruhe = 2; });
        await pg.waitForTimeout(600);
        if (BILD) await pg.screenshot({ path: BILD + "-" + vid + ".png" });
        if (vid === "hund") hundBild = true; else eisBild = (await Qp(pg, () => { const q = STADT.quests.liste[0]; return !!q.wagen && q.wagen.alpha > 0.9 && !q.wagen.rollt; }));
      }
    }
    sage(gebaut === ids.length && !probleme.length, "jede Vorlage lässt sich in dieser Stadt bauen: genau eine richtige, drei verschiedene Antworten; Hund und Eiswagen dabei", probleme.join(" | "));
    sage(hundBild && eisBild, "Hund sitzt am Ziel, der Eiswagen ist herangerollt und steht");
    /* drei Quests ganz durchspielen (Tipp aufs „!“, richtige Antwort, ankommen) → Geschenk */
    await Qp(pg, () => { STADT.quests.dialogZu(); STADT.quests.liste.slice().forEach((q) => { if (q.el) q.el.remove(); }); STADT.quests.liste.length = 0; localStorage.removeItem("leicht_quest_v1"); STADT.quests.pruef.schnell(5); });
    const schmuckVor = await Qp(pg, () => STADT.szene.objekte.filter((o) => o.art === "eigen").length);
    let geschafft = 0; const meld = [];
    for (const vid of ["artikel_ort", "betonung_wort", "sie_du"]) {
      const id = await Qp(pg, (v) => STADT.quests.pruef.neu(v), vid);
      await warteZustand(pg, id, ["wartet"], 120000);
      await pg.waitForFunction((i) => { const b = document.querySelector('.lq-zeichen[data-q="' + i + '"]'); return b && b.style.display !== "none" && b.dataset.a === "!"; }, id, { timeout: 90000 }).catch(() => {});
      await pg.waitForTimeout(300);
      const box = await pg.evaluate((i) => { const b = document.querySelector('.lq-zeichen[data-q="' + i + '"]'); if (!b || b.style.display === "none") return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, id);
      if (box) await pg.touchscreen.tap(box[0], box[1]);
      /* FASSUNG 813 — Geisterklick: der nachgeschobene Klick des Handys trifft eine falsche Antwort,
         die gerade unter dem Finger aufgegangen ist – das darf kein Fehlversuch sein */
      if (vid === "artikel_ort") {
        await pg.waitForFunction(() => !!document.querySelector(".lq-antwort"), null, { timeout: 2000 }).catch(() => {});
        const geist = await pg.evaluate(() => { const q = STADT.quests.liste[0]; const i = q.antworten.findIndex((a) => !a.richtig); const b = document.querySelector('.lq-antwort[data-i="' + i + '"]'); if (!b) return null; b.click(); return { versuche: q.versuche, aus: b.disabled }; });
        sage(!!geist && geist.versuche === 0 && !geist.aus, "Geisterklick gleich nach dem Aufgehen zählt nicht als falsche Antwort", JSON.stringify(geist));
      }
      await pg.waitForTimeout(300);
      if (!(await Qp(pg, () => STADT.quests.pruef.dialog()))) console.log("       " + vid + ": Tipp aufs Zeichen bei " + JSON.stringify(box) + " öffnet nichts – " + (await pg.evaluate((b) => { const e = b && document.elementFromPoint(b[0], b[1]); return e ? (e.closest("button") || e).className.toString() : "-"; }, box)));
      await pg.waitForTimeout(900);
      const ri = (await Qp(pg, () => STADT.quests.pruef.zustand()))[0].antworten.findIndex((a) => a.richtig);
      await pg.evaluate((i) => { const b = document.querySelector('.lq-antwort[data-i="' + i + '"]'); if (b) b.click(); }, ri);
      const offen = !!(await Qp(pg, () => STADT.quests.pruef.dialog()));
      const z = await warteZustand(pg, id, ["jubel", "geht", "fort"], 120000);
      if (z) geschafft++;
      meld.push(await Qp(pg, () => STADT.quests.pruef.meldung()));
      if (!z || !offen) console.log("       " + vid + ": Dialog " + (offen ? "offen" : "ZU") + ", Ende " + z + " " + JSON.stringify(await Qp(pg, () => STADT.quests.pruef.zustand().map((q) => [q.zustand, q.s, q.weglaenge]))));
      await Qp(pg, () => { STADT.quests.liste.slice().forEach((q) => { if (q.el) q.el.remove(); }); STADT.quests.liste.length = 0; });
    }
    const gesch = await Qp(pg, () => ({ n: STADT.szene.objekte.filter((o) => o.art === "eigen").length, neu: STADT.szene.objekte.filter((o) => o.questGeschenk).map((o) => [o.bild, +o.x.toFixed(1), +o.y.toFixed(1)]), gespeichert: (JSON.parse(localStorage.getItem("leicht_deko_v1") || "[]")).length, st: STADT.quests.pruef.stand() }));
    sage(geschafft === 3 && meld.every((m) => m && m.punkte >= 8) && gesch.st.geschafft === 3, "drei Quests nacheinander geschafft (je 6 + 2 für den ersten Versuch)", JSON.stringify(meld.map((m) => m && m.punkte)));
    sage(gesch.n === schmuckVor + 1 && gesch.neu.length === 1 && !!meld[2].geschenk && gesch.gespeichert >= 1, "nach der dritten Quest steht ein Schmuck-Geschenk in der Stadt (gespeichert): " + (meld[2] && meld[2].geschenk), JSON.stringify(gesch.neu));
    await Qp(pg, () => STADT.quests.pruef.schnell(1));
  }

  if (TEIL.indexOf("E") >= 0) {
    console.log("\nE  SCHWÄCHEN: BETONUNG\n");
    const ohne = await Qp(pg, () => { STADT.questInfo.schwach = []; return STADT.quests.pruef.waehlen(3000); });
    const mit = await Qp(pg, () => { STADT.questInfo.schwach = ["betonung"]; return STADT.quests.pruef.waehlen(3000); });
    sage((mit.betonung || 0) > (ohne.betonung || 0) * 2, "ist „Betonung“ eine Schwäche, kommen Betonungs-Quests mehr als doppelt so oft", (ohne.betonung || 0) + " → " + (mit.betonung || 0) + " von 3000");
    await Qp(pg, () => { STADT.quests.liste.slice().forEach((q) => { if (q.el) q.el.remove(); }); STADT.quests.liste.length = 0; STADT.quests.pruef.schnell(6); });
    const id = await Qp(pg, () => STADT.quests.pruef.neu("betonung_haus"));
    await warteZustand(pg, id, ["wartet"], 120000);
    await pg.waitForFunction((i) => { const b = document.querySelector('.lq-zeichen[data-q="' + i + '"]'); return b && b.dataset.a === "!"; }, id, { timeout: 90000 }).catch(() => {});
    await Qp(pg, (i) => { const b = document.querySelector('.lq-zeichen[data-q="' + i + '"]'); b && b.click(); }, id);
    await pg.waitForTimeout(800);
    const d = await Qp(pg, () => STADT.quests.pruef.dialog());
    const ri = (await Qp(pg, () => STADT.quests.pruef.zustand()))[0].antworten.findIndex((a) => a.richtig);
    const betont = await pg.evaluate(() => Array.from(document.querySelectorAll(".lq-antwort")).map((b) => (b.querySelector(".lq-betont") || {}).textContent));
    sage(!!d && betont.every((t) => t && t === t.toUpperCase()), "Betonungs-Quest: die betonte Silbe ist groß und markiert", JSON.stringify(d && d.knoepfe.filter((b) => /antwort/.test(b.klasse)).map((b) => b.text)));
    await pg.evaluate((i) => { const b = document.querySelector('.lq-antwort[data-i="' + i + '"]'); if (b) b.click(); }, ri);
    await warteZustand(pg, id, ["jubel", "geht", "fort"], 90000);
    const m = await Qp(pg, () => STADT.quests.pruef.meldung());
    sage(!!m && m.kat === "betonung" && m.mut >= 4 && m.punkte === 12, "Mut-Bonus für die Schwäche: 6 + 2 + 50 % = 12 Punkte", JSON.stringify(m));
    await Qp(pg, () => { STADT.questInfo.schwach = []; STADT.quests.pruef.schnell(1); });
  }
  sage(!pg.fehler.length, "keine Seitenfehler (ganzes Bild)", pg.fehler.slice(0, 3).join(" | "));
  await pg.context().close();

  if (TEIL.indexOf("F") >= 0) {
    console.log("\nF  KLEINER RAHMEN IM SPIEL\n");
    const min = fs.readFileSync(path.join(WURZEL, "stadt-leicht/leicht.min.js"), "utf8");
    sage(!/weg_rathaus|Orientierung verloren/.test(min) && /LEICHT_QUESTS/.test(fs.readFileSync(path.join(WURZEL, "stadt-leicht.html"), "utf8")), "leicht.min.js enthält keinen Quest-Code (nur die kleine Vertretung), quests.min.js wird nachgeladen", (min.length / 1024).toFixed(0) + " KB");
    const el = await seite("/__eltern.html", { width: 360, height: 740 }, true);
    const fr = () => el.frames().find((f) => /stadt-leicht\.html/.test(f.url()));
    await el.waitForFunction(() => { const f = document.getElementById("r"); return f && f.contentWindow && f.contentWindow.__fertig; }, null, { timeout: 120000 });
    const f = fr();
    const q1 = await warteQuests(f);
    sage(q1, "im Rahmen: Quests nachgeladen");
    const vorTipp = el.anfragen.filter((u) => /l_geher/.test(u)).length;
    await f.evaluate(() => STADT.quests.pruef.schnell(4));
    const id = await f.evaluate(() => STADT.quests.pruef.neu("weg_bahnhof"));
    sage(id != null, "Quest „Mann mit Koffer sucht den Bahnhof“ im Rahmen erzeugt");
    await warteZustand(f, id, ["wartet"], 120000);
    await f.waitForFunction(() => { const b = document.querySelector(".lq-zeichen"); return b && b.style.display !== "none" && b.dataset.a === "!"; }, null, { timeout: 90000 }).catch(() => {});
    await el.waitForTimeout(500);
    const zr = await f.evaluate(() => { const b = document.querySelector(".lq-zeichen"); if (!b) return { sicht: false, x: -1, y: -1, w: 0, h: 0 }; const r = b.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, sicht: b.style.display !== "none", mini: document.body.classList.contains("lk-mini-modus") }; });
    sage(zr.mini && zr.sicht && zr.x >= 0 && zr.x + zr.w <= 360 && zr.y >= 0 && zr.y + zr.h <= 225 && vorTipp === 0 && el.anfragen.filter((u) => /l_geher/.test(u)).length === 0, "im Überblick des kleinen Rahmens leuchtet das „!“ im Bild – noch kein Laufblatt geladen", JSON.stringify(zr));
    if (BILD) await el.screenshot({ path: BILD + "-rahmen.png" });
    const fb = await el.$("#r"), rb = await fb.boundingBox();
    await el.touchscreen.tap(rb.x + zr.x + zr.w / 2, rb.y + zr.y + zr.h / 2);
    await f.waitForFunction(() => !!document.querySelector(".lq-dialog"), null, { timeout: 30000 }).catch(() => {});
    await ruhig(f);
    const d = await f.evaluate(() => ({ d: STADT.quests.pruef.dialog(), nah: document.body.classList.contains("lk-nah"), H: innerHeight, W: innerWidth }));
    const antw = d.d ? d.d.knoepfe.filter((b) => /lq-antwort/.test(b.klasse)) : [];
    sage(!!d.d && d.nah && d.d.rahmen.x >= 0 && d.d.rahmen.x + d.d.rahmen.w <= d.W + 0.5 && d.d.rahmen.y >= 0 && d.d.rahmen.y + d.d.rahmen.h <= d.H + 0.5 && antw.length === 3 && d.d.knoepfe.every((b) => b.h >= 30 && b.w >= 30),
      "Tipp aufs „!“ im Rahmen: näher ran, der Dialog passt in den Rahmen (" + d.W + " × " + d.H + "), rollbar, Tippflächen ≥ 30 px", JSON.stringify(d.d && { rahmen: d.d.rahmen, scroll: d.d.scrollH + "/" + d.d.clientH, knoepfe: d.d.knoepfe.map((b) => Math.round(b.h)) }));
    if (BILD) await el.screenshot({ path: BILD + "-rahmen-dialog.png" });
    const ri = (await f.evaluate(() => STADT.quests.pruef.zustand()))[0].antworten.findIndex((a) => a.richtig);
    await f.evaluate((i) => { const b = document.querySelector('.lq-antwort[data-i="' + i + '"]'); b.click(); }, ri);
    await warteZustand(f, id, ["jubel", "geht", "fort"], 90000);
    await el.waitForTimeout(400);
    const meld = await el.evaluate(() => window.__meldungen);
    sage(meld.length === 1 && meld[0].punkte >= 8 && meld[0].gesamt >= meld[0].punkte, "das Spiel (Elternseite) bekommt „leicht-quest“ mit den Punkten", JSON.stringify(meld));
    sage(await f.evaluate(() => STADT.quests.blattErlaubt) && el.anfragen.some((u) => /l_geher2/.test(u)), "nach dem Tipp darf die Person ihr Laufblatt laden (Mann mit Koffer: l_geher2)");
    const spielJs = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
    sage(/ev\.data\.typ === "leicht-quest"/.test(spielJs) && /kopf\.schwach = fragenArten\("schwach"\)/.test(spielJs), "spiel.js nimmt „leicht-quest“ an (Meldung) und schickt die Schwächen mit „leicht-kopf“");
    await el.context().close();
    /* ohne ?quest=1 unter der Sonde: keine Quests (andere Sonden bleiben ungestört) */
    const el0 = await seite("/__eltern0.html", { width: 360, height: 740 }, true);
    await el0.waitForFunction(() => { const f = document.getElementById("r"); return f && f.contentWindow && f.contentWindow.__fertig; }, null, { timeout: 120000 });
    await el0.waitForTimeout(3000);
    sage(!el0.anfragen.some((u) => /quests\.min\.js/.test(u)), "ohne ?quest=1 (unter Sonden) wird quests.min.js nicht geladen");
    await el0.context().close();
  }
  return ende();
})().catch((e) => { console.error(e); process.exit(2); });
