#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 882: FUNK 302 (TAFEL-ORDNER UND SCHIEBER)
   ---------------------------------------------------------------------
   XANDER: „Wenn man das Whiteboard aufmacht und in die Ordner geht hat man
   z.B bei der Bilderwelt die Schriften teilweise außerhalb der Ordner …
   dann denkt man … die Schrift gehört zur Kachel darunter und geht dann in
   den falschen Ordner … schön wäre es auch wenn man das Bild was man sich
   zurechtzoomt auf dem Whiteboard dass man das auch einfacher verschieben
   kann mit einem Handle … nach links rechts nach links oben nach rechts
   oben nach links unten … total sperrig".

   Geprüft wird, bei 360 px (Android, Finger) und am Rechner (1280 px, Maus):
     1 ORDNER: in jedem Ordner der Tafel (Start, Bilderwelten, ein Thema mit
       Szenen, Aussprache, der große Ordner) liegt jede Schrift INNERHALB
       ihrer Kachel, keine Kachel überlappt eine andere, keine Schrift ragt
       in eine fremde Kachel, zwischen den Reihen ist Luft, und ein Tipp
       auf die Mitte eines Namens trifft genau seine eigene Kachel.
     2 SCHIEBER: ohne Heranholen ist er nicht da; herangeholt erscheint er.
       Ziehen am Schieber verschiebt das Bild in die Zugrichtung (rechts,
       links, oben, unten, schräg – frei), malt dabei keinen Strich, geht
       als „blick" an die anderen, und am Rand bleibt das Bild am Rand
       stehen (springt nicht zur Mitte zurück). Ein „blick" von außen
       stellt das Bild ebenso. Aufziehen und ➕/➖ gehen wie vorher.

   Läuft mit ?quelle (die Quellen, nicht min/ – min/ baut der Commit-Haken).
   MIN=1 prüft die verkleinerten Kopien.
   Aufruf:  node werkzeug/pruefe-882-tafel-ordner-griff.js
   Bildschirmfotos: BILD=/pfad/praefix
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp3": "audio/mpeg", ".opus": "audio/ogg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

/* Misst alle sichtbaren Kacheln eines Ordners. */
function kachelnMessen() {
  const kacheln = [...document.querySelectorAll(".lc-tafel-bildmappe .lc-tafel-bm-ordner, .lc-tafel-bildmappe .lc-tafel-bm-bild, #lcTafelMappe .lc-mappe-kat, #lcTafelMappe .lc-mappe-blatt")]
    .filter((k) => k.offsetParent);
  const R = kacheln.map((k) => k.getBoundingClientRect());
  const name = (k) => ((k.querySelector("span, figcaption") || k).textContent || "").trim().slice(0, 24);
  const raus = [], ueber = [], fremd = [], tipp = [];
  let luft = Infinity;
  kacheln.forEach((k, i) => {
    const r = R[i];
    k.querySelectorAll(":scope > span, :scope > small, :scope > i, :scope > svg, :scope > figcaption").forEach((s) => {
      const q = s.getBoundingClientRect();
      if (!q.width || !q.height) return;
      if (q.top < r.top - 0.5 || q.bottom > r.bottom + 0.5 || q.left < r.left - 0.5 || q.right > r.right + 0.5)
        raus.push(name(k) + " " + s.tagName.toLowerCase() + " " + Math.round(q.bottom - r.bottom) + " px");
      R.forEach((o, j) => {
        if (j === i) return;
        const x = Math.min(q.right, o.right) - Math.max(q.left, o.left), y = Math.min(q.bottom, o.bottom) - Math.max(q.top, o.top);
        if (x > 0.5 && y > 0.5) fremd.push(name(k) + " → " + name(kacheln[j]));
      });
    });
    R.forEach((o, j) => {
      if (j <= i) return;
      const x = Math.min(r.right, o.right) - Math.max(r.left, o.left), y = Math.min(r.bottom, o.bottom) - Math.max(r.top, o.top);
      if (x > 0.5 && y > 0.5) ueber.push(name(k) + " × " + name(kacheln[j]));
      /* Luft zwischen zwei übereinanderliegenden Kacheln derselben Spalte */
      if (x > 0.5 && o.top >= r.bottom - 0.5) luft = Math.min(luft, o.top - r.bottom);
    });
    /* Tipp auf die Mitte des Namens – nur wo er im Ordner zu sehen ist (der Ordner scrollt). */
    const s = k.querySelector(":scope > span, :scope > figcaption");
    if (s) {
      const q = s.getBoundingClientRect(), cx = q.left + q.width / 2, cy = q.top + q.height / 2;
      const liste = k.closest(".lc-tafel-bm-liste, #lcTafelMappe");
      const lr = liste ? liste.getBoundingClientRect() : null;
      if (q.width && (!lr || (cy > lr.top + 2 && cy < lr.bottom - 2)) && cy > 0 && cy < innerHeight) {
        const e = document.elementFromPoint(cx, cy);
        const ziel = e && e.closest(".lc-tafel-bm-ordner, .lc-tafel-bm-bild, .lc-mappe-kat, .lc-mappe-blatt");
        if (ziel !== k) tipp.push(name(k) + " → " + (ziel ? name(ziel) : e ? e.className : "nichts"));
      }
    }
  });
  return { anzahl: kacheln.length, raus, ueber, fremd, tipp, luft: luft === Infinity ? null : Math.round(luft * 10) / 10,
    hoehe: R.length ? Math.round(Math.min(...R.map((r) => r.height))) + "–" + Math.round(Math.max(...R.map((r) => r.height))) : "" };
}

async function durchlauf(br, basis, art) {
  const handy = art === "handy";
  const ctx = await br.newContext(handy
    ? { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
        userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" }
    : { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(basis, { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_TAFEL && window.DMA_TAFEL_ORDNER, { timeout: 30000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    window.__gesendet = []; window.LiveChat.tafelSenden = (d) => { window.__gesendet.push(JSON.parse(JSON.stringify(d))); return true; };
    window.DMA_TAFEL({ t: "blick", z: 1, x: .5, y: .5 }, "Alex", "Alex");
  });
  await tick(700);
  const B = handy ? "360 px" : "1280 px";
  const foto = async (n) => { if (BILD) await pg.screenshot({ path: BILD + "-" + art + "-" + n + ".png" }); };

  console.log("\n" + (handy ? "HANDY 360 px (Finger)" : "RECHNER 1280 px (Maus)") + " · 1 ORDNER\n");
  const ordnerPruefen = async (titel, mindest) => {
    const m = await pg.evaluate(kachelnMessen);
    sage(m.anzahl >= mindest && !m.raus.length, B + ", " + titel + ": jede Schrift liegt in ihrer Kachel",
      m.anzahl + " Kacheln, " + m.hoehe + " px hoch" + (m.raus.length ? "; heraus: " + m.raus.slice(0, 3).join(" | ") : ""));
    sage(!m.ueber.length && !m.fremd.length, B + ", " + titel + ": keine Kachel und keine Schrift über einer anderen Kachel",
      [...m.ueber, ...m.fremd].slice(0, 3).join(" | "));
    if (m.luft !== null) sage(m.luft >= 6, B + ", " + titel + ": sichtbare Luft zwischen den Reihen", m.luft + " px");
    sage(!m.tipp.length, B + ", " + titel + ": ein Tipp auf den Namen trifft seine eigene Kachel", m.tipp.slice(0, 3).join(" | "));
  };
  await pg.evaluate(() => window.DMA_TAFEL_ORDNER(""));
  await tick(300);
  await ordnerPruefen("Start-Ordner", 3);
  await foto("start");
  await pg.evaluate(() => document.querySelector('.lc-tafel-bildmappe [data-o="welten"]').click());
  await pg.waitForFunction(() => document.querySelectorAll('.lc-tafel-bildmappe [data-o^="welten:"]').length > 2, { timeout: 20000 }).catch(() => {});
  await ordnerPruefen("Bilderwelten (Themen)", 10);
  /* Der Ordner scrollt – auch weiter unten muss es stimmen. */
  await pg.evaluate(() => { const l = document.querySelector(".lc-tafel-bildmappe .lc-tafel-bm-liste"); l.scrollTop = l.scrollHeight / 2; });
  await tick(150);
  await ordnerPruefen("Bilderwelten, halb gescrollt", 10);
  await pg.evaluate(() => { const l = document.querySelector(".lc-tafel-bildmappe .lc-tafel-bm-liste"); l.scrollTop = 0; });
  await foto("welten");
  /* Ein Tipp auf den NAMEN „Alltag" öffnet Alltag (nicht den Ordner darunter). */
  const name = await pg.evaluate(() => {
    const s = [...document.querySelectorAll('.lc-tafel-bildmappe [data-o^="welten:"] span')].find((x) => x.textContent === "Alltag") || document.querySelector('.lc-tafel-bildmappe [data-o^="welten:"] span');
    const q = s.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2, t: s.textContent };
  });
  if (handy) await pg.touchscreen.tap(name.x, name.y); else await pg.mouse.click(name.x, name.y);
  await tick(400);
  const offen = await pg.evaluate(() => { const b = document.querySelector(".lc-tafel-bildmappe .lc-tafel-bm-kopf b"); return b ? b.textContent : ""; });
  sage(offen.indexOf(name.t) >= 0, B + ": Tipp auf den Namen „" + name.t + "“ öffnet genau diesen Ordner", offen);
  await ordnerPruefen("Szenen in „" + name.t + "“", 2);
  await foto("thema");
  await pg.evaluate(() => window.DMA_TAFEL_ORDNER("laute"));
  await pg.waitForFunction(() => document.querySelectorAll(".lc-tafel-bildmappe [data-mappe=laut]").length > 0, { timeout: 15000 }).catch(() => {});
  await tick(200);
  await ordnerPruefen("Aussprache", 8);
  await foto("laute");
  /* Der große Ordner, mit drei gesicherten Tafeln (Attrappe statt Konto). */
  await pg.evaluate(() => {
    const m = document.querySelector(".lc-tafel-bildmappe"); if (m) m.remove();
    const bild = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="160" height="100" fill="#fff"/></svg>');
    Backend.getMyWhiteboards = async () => [1, 2, 3].map((i) => ({ id: "t" + i, bild: bild, name: "Tafel vom 0" + i + ".10.2026 14:3" + i }));
    document.querySelector('#lcTafel [data-tafel="mappe"]').click();
  });
  await pg.waitForSelector("#lcTafelMappe", { timeout: 8000 }).catch(() => {});
  await tick(300);
  await ordnerPruefen("großer Ordner (Kategorien, gesicherte Tafeln)", 6);
  await foto("ordner");
  await pg.evaluate(() => { const k = document.getElementById("lcTafelMappe"); if (k) k.remove(); });

  console.log("\n" + (handy ? "HANDY 360 px" : "RECHNER 1280 px") + " · 2 SCHIEBER\n");
  /* Ein Bild auf die Tafel (NG), wie ein Lehrer es tut. */
  await pg.evaluate(() => window.DMA_TAFEL_ORDNER("laute"));
  await pg.waitForFunction(() => document.querySelectorAll(".lc-tafel-bildmappe [data-mappe=laut]").length > 0, { timeout: 15000 }).catch(() => {});
  await pg.evaluate(() => document.querySelector('.lc-tafel-bildmappe [data-mappe="laut"][data-k="ng"]').click());
  await pg.waitForFunction(() => window.__gesendet.some((d) => d.t === "bild"), { timeout: 10000 }).catch(() => {});
  await pg.evaluate(() => document.getElementById("lcTafel").scrollIntoView({ block: "center" }));
  await tick(300);
  const sichtbar = () => pg.evaluate(() => { const s = document.getElementById("lcTafelSchieber"); return Boolean(s && !s.hidden && s.offsetWidth); });
  sage(!(await sichtbar()), B + ": ohne Heranholen ist kein Schieber da (es gäbe nichts zu verschieben)");
  await pg.evaluate(() => { document.querySelector('#lcTafel [data-tafel="rein"]').click(); document.querySelector('#lcTafel [data-tafel="rein"]').click(); });
  await tick(450);
  const geo = await pg.evaluate(() => {
    const s = document.getElementById("lcTafelSchieber"), t = document.getElementById("lcTafel"), r = s.getBoundingClientRect(), tr = t.getBoundingClientRect();
    const svg = s.querySelector("svg");
    return { sicht: !s.hidden && r.width > 0, w: Math.round(r.width), innen: r.left >= tr.left && r.right <= tr.right && r.top >= tr.top && r.bottom <= tr.bottom,
      pfeil: Boolean(svg && svg.querySelector("path")), oben: document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === s,
      x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  sage(geo.sicht && geo.innen && geo.pfeil && geo.w >= 26 && geo.w <= 40, B + ": herangeholt erscheint der Schieber (Vier-Wege-Pfeil, klein, in der Tafel)", geo.w + " px");
  sage(geo.oben, B + ": nichts liegt über dem Schieber");
  await foto("zoom");

  /* Ziehen: Finger (CDP-Berührung) am Handy, Maus am Rechner. */
  const cdp = handy ? await ctx.newCDPSession(pg) : null;
  let fx = geo.x, fy = geo.y;
  const ziehen = async (dx, dy, loslassen) => {
    if (handy) {
      if (!ziehen.dran) { await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: fx, y: fy }] }); ziehen.dran = true; }
      for (let i = 1; i <= 6; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: fx + dx * i / 6, y: fy + dy * i / 6 }] });
      fx += dx; fy += dy;
      if (loslassen) { await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); ziehen.dran = false; fx = geo.x; fy = geo.y; }
    } else {
      if (!ziehen.dran) { await pg.mouse.move(fx, fy); await pg.mouse.down(); ziehen.dran = true; }
      await pg.mouse.move(fx + dx, fy + dy, { steps: 6 });
      fx += dx; fy += dy;
      if (loslassen) { await pg.mouse.up(); ziehen.dran = false; fx = geo.x; fy = geo.y; }
    }
    await tick(60);
  };
  /* Wo steht ein fester Punkt des Blatts (die Mitte) gerade auf dem Bildschirm? */
  const punkt = () => pg.evaluate(() => {
    const b = document.getElementById("lcTafelBlatt"), r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  /* Der Blick, wie er am Blatt steht: Drehpunkt in Prozent (x, y) und Vergrößerung z. */
  const blick = () => pg.evaluate(() => {
    const b = document.getElementById("lcTafelBlatt"), o = (b.style.transformOrigin || "").match(/-?[\d.]+/g) || [];
    return { x: Number(o[0]), y: Number(o[1]), z: Number(b.style.getPropertyValue("--tz")), o: b.style.transformOrigin };
  });
  await pg.evaluate(() => { window.__gesendet = window.__gesendet.filter((d) => d.t !== "blick" && d.t !== "strich"); });

  const richtungen = [["rechts", 24, 0], ["links", -24, 0], ["unten", 0, 16], ["oben", 0, -16], ["rechts unten", 18, 12], ["links oben", -18, -12], ["rechts oben", 18, -12], ["links unten", -18, 12]];
  const ergebnis = [];
  for (const [wort, dx, dy] of richtungen) {
    const a = await punkt();
    await ziehen(dx, dy, false);
    const b = await punkt();
    const mx = b.x - a.x, my = b.y - a.y;
    /* Das Bild folgt dem Finger 1 : 1 (± 1,5 px) – solange es nicht am Rand steht. */
    ergebnis.push({ wort, ok: Math.abs(mx - dx) <= 1.5 && Math.abs(my - dy) <= 1.5, mx: Math.round(mx * 10) / 10, my: Math.round(my * 10) / 10 });
  }
  await ziehen(0, 0, true);
  const falsch = ergebnis.filter((e) => !e.ok);
  sage(!falsch.length, B + ": das Bild geht mit dem Schieber mit – in alle acht Richtungen, 1 : 1",
    ergebnis.map((e) => e.wort + " " + e.mx + "/" + e.my).join(", "));
  /* Frei, nicht nur acht Richtungen: ein krummer Zug. */
  {
    const a = await punkt();
    await ziehen(11, -7, false); await ziehen(-4, 13, true);
    const b = await punkt();
    sage(Math.abs(b.x - a.x - 7) <= 2 && Math.abs(b.y - a.y - 6) <= 2, B + ": frei in jede Richtung (krummer Zug kommt genau an)", Math.round(b.x - a.x) + "/" + Math.round(b.y - a.y));
  }
  let r = await pg.evaluate(() => ({ striche: window.__gesendet.filter((d) => d.t === "strich").length, blicke: window.__gesendet.filter((d) => d.t === "blick") }));
  sage(r.striche === 0, B + ": Schieben malt keinen Strich");
  const letzter = r.blicke[r.blicke.length - 1];
  const jetzt = await blick();
  sage(r.blicke.length >= 1 && letzter && Math.abs(letzter.z - 1.96) < 0.01
    && Math.abs(jetzt.x - letzter.x * 100) < 0.01 && Math.abs(jetzt.y - letzter.y * 100) < 0.01,
    B + ": die neue Lage geht als „blick“ an alle (beim Loslassen der letzte Stand)", r.blicke.length + " Nachrichten, zuletzt " + jetzt.o);
  sage(r.blicke.length <= 30, B + ": nicht bei jedem Bildpunkt eine Nachricht (höchstens alle 200 ms)", r.blicke.length + " Nachrichten");
  /* Bis an den Rand: ganz nach links oben ziehen – x und y bleiben 0, kein Sprung zur Mitte. */
  await ziehen(handy ? 260 : 900, handy ? 200 : 500, true);
  r = await pg.evaluate(() => window.__gesendet.filter((d) => d.t === "blick").pop());
  const rand = await blick();
  sage(r && r.x === 0 && r.y === 0 && rand.x === 0 && rand.y === 0, B + ": am Rand bleibt das Bild am Rand (springt nicht zur Mitte zurück)", rand.o);
  /* und wieder zurück: ein kleiner Zug nach links bewegt sofort (kein „Überhang“). */
  {
    const a = await punkt(); await ziehen(-20, 0, true); const b = await punkt();
    sage(Math.abs(b.x - a.x + 20) <= 1.5, B + ": vom Rand zurück geht es sofort wieder mit", Math.round(b.x - a.x) + " px");
  }
  await foto("geschoben");
  /* Was von außen kommt: ein „blick" eines anderen stellt das Bild genauso. */
  await pg.evaluate(() => window.DMA_TAFEL({ t: "blick", z: 2.5, x: 1, y: 0 }, "Bea", "Bea"));
  await tick(100);
  r = await blick();
  sage(r.x === 100 && r.y === 0 && r.z === 2.5, B + ": ein „blick“ von Bea (rechts oben) stellt das Bild bei mir genauso", r.o + " ×" + r.z);
  /* Pfeiltasten (Tastatur) */
  if (!handy) {
    await pg.focus("#lcTafelSchieber"); const a = await punkt(); await pg.keyboard.press("ArrowLeft"); await tick(60); const b = await punkt();
    sage(b.x < a.x - 5, B + ": Pfeiltaste ← schiebt das Bild nach links", Math.round(b.x - a.x) + " px");
  }
  /* ➖ ganz heraus: der Schieber verschwindet wieder. ➕/➖ gehen weiter. */
  await pg.evaluate(() => { for (let i = 0; i < 6; i++) document.querySelector('#lcTafel [data-tafel="raus"]').click(); });
  await tick(350);
  r = await blick();
  sage(r.z === 1 && !(await sichtbar()), B + ": ➖ bis ganz heraus – das ganze Bild, der Schieber ist wieder weg", "×" + r.z);
  /* Aufziehen mit zwei Fingern geht weiter (nur am Handy). */
  if (handy) {
    const t = await pg.evaluate(() => { const r = document.getElementById("lcTafelStift").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 3 }; });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: t.x - 20, y: t.y, id: 1 }, { x: t.x + 20, y: t.y, id: 2 }] });
    for (let i = 1; i <= 6; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: t.x - 20 - i * 8, y: t.y, id: 1 }, { x: t.x + 20 + i * 8, y: t.y, id: 2 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await tick(400);
    r = await blick();
    sage(Number(r.z) > 1.5 && (await sichtbar()), B + ": Aufziehen mit zwei Fingern geht wie vorher – und danach ist der Schieber da", "×" + r.z);
  }
  sage(!seitenFehler.length, B + ": keine Seitenfehler", seitenFehler.slice(0, 2).join(" | "));
  await ctx.close();
}

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); a.end(); return; }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html" + (process.env.MIN ? "" : "?quelle");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  console.log("\n0 · IM QUELLTEXT\n");
  const app = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8"), css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  sage(/FASSUNG 882 — XANDER \(Funk 302\)/.test(app) && /FASSUNG 882 — XANDER \(Funk 302\)/.test(css), "app.js und korrekturen.css tragen den Kopf „FASSUNG 882 — XANDER (Funk 302)“");
  sage(/\.lc-tafel-bildmappe \.lc-tafel-bm-liste \{[^}]*grid-auto-rows: max-content/.test(css), "die Reihen im Tafel-Ordner sind so hoch wie ihr Inhalt (grid-auto-rows: max-content)");
  sage(!/x: Math\.min\(1, Math\.max\(0, Number\(blick\.x\)\)\) \|\| 0\.5/.test(app), "der Rand (0) springt im Blick nicht mehr zur Mitte (kein „|| 0.5“)");

  await durchlauf(br, basis, "handy");
  await durchlauf(br, basis, "rechner");
  await br.close(); srv.close();
  console.log("\nFassung 882 (Tafel: Ordner-Kacheln und Schieber): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
