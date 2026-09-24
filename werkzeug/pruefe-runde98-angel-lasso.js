#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — ERST FANGEN, DANN ZIEHEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „repariere noch das Lasso und die Angel, weil
   die sind immer noch von ihrer Animation erst dann, wenn derjenige
   schon an den Platz gezogen wurde. Sie sollen aber erst mal denjenigen
   fangen und dann zu sich ziehen. Die Angel kann auch ein bisschen
   klassischer sein. Also das soll so 'ne Angelrute sein, wo man dann
   die Angelschnur einrollt, und man denjenigen wirklich hochzieht, und
   er baumelt dann so ein bisschen."

   GEFUNDEN: in Runde 76 wurde die NACHRICHT verzoegert — aber
   „sitzTausch" wurde trotzdem sofort gesetzt. Und sitzTausch IST die
   Sitzordnung: jedes melden() aus irgendeinem anderen Anlass zeichnet
   die Sitzreihe daraufhin neu. Die Person sass also schon auf dem
   Zielplatz, waehrend das Lasso noch flog.

   GEMESSEN WIRD:
     1  Die Reihenfolge im Programm: sitzTausch wird erst in schickenH
        gesetzt, also gemeinsam mit dem Verschicken.
     2  Das Bild bewegt sich erst, nachdem das Fangwerkzeug da ist.
     3  Die Angel hat eine Rute mit Rolle, und die Rolle dreht sich.
     4  RUNDE 100 — XANDER: „Zwei Schlingen bei einmal Ziehen erzeugt
        Person ist zu früh da und wird von der Animation nicht richtig
        mitgezogen." Im echten Raum: nie zwei Schlingen gleichzeitig,
        und beim Platztausch springt das Bild nicht.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  console.log("\n1  DIE REIHENFOLGE IM PROGRAMM\n");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  /* Die Zuweisung darf NUR noch innerhalb von schickenH stehen. */
  const stelleSchicken = lc.indexOf("var schickenH = function () {");
  const stelleTausch = lc.indexOf("sitzTausch[wenH.id] = nummerH - 1;");
  sage(stelleTausch > stelleSchicken && stelleSchicken > 0,
    "die Sitzordnung wird erst beim Verschicken geaendert, nicht vorher",
    stelleTausch > stelleSchicken ? "in schickenH" : "davor — wie vorher");
  sage((lc.match(/sitzTausch\[wenH\.id\] = nummerH - 1;/g) || []).length === 1,
    "und nur an dieser einen Stelle",
    (lc.match(/sitzTausch\[wenH\.id\] = nummerH - 1;/g) || []).length + "×");

  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\n2  ERST IST DAS WERKZEUG DA, DANN BEWEGT SICH DAS BILD\n");
  /* Die Schlinge haengt AM PLATZ, die Angelleine liegt in der
     Sitzreihe (sie geht ja von meinem Platz aus) \u2014 deshalb zwei
     verschiedene Wege, sie zu finden. */
  for (const [art, wahl, wort] of [["lasso", '[data-lc-platz="2"] .lc-lasso-schlinge', "Lasso"],
                                   /* RUNDE 99: die Angel ist eine eigene Zeichnung
                                      ueber der Sitzreihe; der Haken liegt in
                                      seiner eigenen Lage ueber dem Bild. */
                                   ["heber", ".lc-angel-hakenlage .lc-an-haken[transform]", "Angel"]]) {
    const r = await pg.evaluate(async ([art, wahl]) => {
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.wirkung(art, "Bea", "Alex", { ziel: 7 });
      const t0 = performance.now();
      let werkzeugAb = -1, bewegungAb = -1;
      const bis = t0 + 2600;
      while (performance.now() < bis) {
        const jetzt = Math.round(performance.now() - t0);
        if (werkzeugAb < 0 && document.querySelector(wahl)) {
          werkzeugAb = jetzt;
        }
        const k = document.querySelector('[data-lc-platz="2"] .lc-kreis');
        if (bewegungAb < 0 && k) {
          const m = /matrix\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\)/
            .exec(getComputedStyle(k).transform);
          if (m && (Math.abs(Number(m[5])) > 3 || Math.abs(Number(m[6])) > 3)) {
            bewegungAb = jetzt;
          }
        }
        await new Promise((f) => requestAnimationFrame(f));
      }
      return { werkzeugAb: werkzeugAb, bewegungAb: bewegungAb };
    }, [art, wahl]);
    sage(r.werkzeugAb >= 0, wort + ": das Werkzeug ist zu sehen",
      "ab " + r.werkzeugAb + " ms");
    sage(r.bewegungAb > r.werkzeugAb + 200,
      wort + ": das Bild bewegt sich erst DANACH",
      "Werkzeug ab " + r.werkzeugAb + " ms, Bewegung ab " + r.bewegungAb + " ms");
  }

  console.log("\n3  DIE ANGEL IST EINE RICHTIGE RUTE\n");
  const rute = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("heber", "Bea", "Alex", { ziel: 7 });
    /* RUNDE 99: gekurbelt wird beim EINHOLEN (1,5 bis 3,15 s) — erst
       dann wird die Kurbel gemessen. */
    await new Promise((f) => setTimeout(f, 1600));
    const r = document.querySelector(".lc-angel-buehne:not(.lc-angel-hakenlage)");
    if (!r) return null;
    const kurbel = r.querySelector(".lc-an-kurbel");
    const dreht = [];
    for (let i = 0; i < 8; i++) {
      await new Promise((f) => setTimeout(f, 140));
      const t = kurbel ? kurbel.getAttribute("d") : "";
      if (dreht.indexOf(t) < 0) dreht.push(t);
    }
    return { rute: 1, griff: r.querySelectorAll(".lc-an-griff").length,
      rolle: r.querySelectorAll(".lc-an-gehaeuse").length,
      kurbel: r.querySelectorAll(".lc-an-kurbel").length,
      ringe: r.querySelectorAll(".lc-an-ring").length,
      drehstufen: dreht.length };
  });
  if (!rute) {
    sage(false, "eine Angelrute ist ueberhaupt nicht da");
  } else {
    sage(rute.griff > 0 && rute.rolle > 0 && rute.kurbel > 0,
      "Griff, Rolle und Kurbel sind gezeichnet",
      "Griff " + rute.griff + ", Rolle " + rute.rolle + ", Kurbel " + rute.kurbel);
    sage(rute.ringe >= 3, "und die Schnur laeuft durch Ringe",
      rute.ringe + " Ringe");
    sage(rute.drehstufen >= 4, "die Spule dreht sich — die Schnur wird eingerollt",
      rute.drehstufen + " verschiedene Stellungen gemessen");
  }

  console.log("\n4  LASSO IM ECHTEN RAUM: EINE SCHLINGE, KEIN SPRUNG\n");
  const pg2 = await br.newPage({ viewport: { width: 390, height: 844 } });
  await pg2.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg2.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg2.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF, { timeout: 25000 });
  const film = await pg2.evaluate(async () => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { p0: { id: "p0", name: "Bea", seit: 2000 }, p1: { id: "p1", name: "Cem", seit: 2100 }, p2: { id: "p2", name: "Dana", seit: 2200 } } });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 500));
    const reihe = document.getElementById("lcPlaetze");
    const bilder = [], t0 = performance.now();
    window.LiveChat.pruefBefehl("/lasso Cem");
    await new Promise((fertig) => { const lauf = () => {
      const t = performance.now() - t0, g = reihe.getBoundingClientRect();
      let cem = null;
      reihe.querySelectorAll(".lc-kreis").forEach((k) => {
        if (((k.querySelector("[data-lc-initial]") || {}).textContent || "").trim() === "C") {
          const b = k.getBoundingClientRect();
          cem = [b.left + b.width / 2 - g.left, b.top + b.height / 2 - g.top];
        } });
      const schl = [...document.querySelectorAll(".lc-lasso-nah, .lc-leine-schlinge")]
        .filter((x) => parseFloat(getComputedStyle(x).opacity) > 0.15).length;
      const sitz = [...reihe.querySelectorAll(".lc-platz")].map((p) => ((p.querySelector(".lc-platz-name") || {}).textContent || "").trim()[0] || "-").join("");
      bilder.push({ t, cem, schl, sitz });
      if (t < 4200) requestAnimationFrame(lauf); else fertig(); }; lauf(); });
    return bilder;
  });
  await pg2.close();
  const maxSchl = Math.max(...film.map((b) => b.schl));
  sage(maxSchl === 1, "nie zwei Schlingen gleichzeitig", "hoechstens " + maxSchl);
  const iW = film.findIndex((b, i) => i > 0 && b.sitz !== film[0].sitz);
  if (iW < 1) {
    sage(false, "der Platztausch kommt ueberhaupt");
  } else {
    const vor = film[iW - 1].cem, nach = film[iW].cem;
    const sprung = vor && nach ? Math.hypot(nach[0] - vor[0], nach[1] - vor[1]) : 999;
    sage(sprung <= 12, "beim Platztausch springt das Bild nicht — es wurde bis hin gezogen",
      Math.round(sprung) + " px Sprung bei " + Math.round(film[iW].t) + " ms");
    const leer = film.slice(0, iW).filter((b) => b.t > 520 && b.schl === 0).length;
    sage(leer === 0, "zwischen Fang und Platztausch ist das Lasso nie leer", leer + " Bilder ohne Schlinge");
  }

  /* RUNDE 100 — dieselbe Falle bei der Angel: der Haken wurde gegen
     die Lage der Sitzreihe vom START gerechnet; die Chatzeile schiebt
     die Seite, und der Haken hing neben dem Bild. */
  const pg3 = await br.newPage({ viewport: { width: 390, height: 844 } });
  await pg3.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg3.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg3.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF, { timeout: 25000 });
  const angel = await pg3.evaluate(async () => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { p0: { id: "p0", name: "Bea", seit: 2000 }, p1: { id: "p1", name: "Cem", seit: 2100 }, p2: { id: "p2", name: "Dana", seit: 2200 } } });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 500));
    const reihe = document.getElementById("lcPlaetze"), g0 = reihe.getBoundingClientRect();
    const kreis = [...reihe.querySelectorAll(".lc-platz")].find((p) => p.textContent.indexOf("Cem") >= 0).querySelector(".lc-kreis");
    window.LiveChat.pruefBefehl("/heb Cem 8");
    const t0 = performance.now(), abst = [];
    let rutsch = 0;
    while (performance.now() < t0 + 3000) {
      const t = performance.now() - t0;
      rutsch = Math.max(rutsch, Math.abs(reihe.getBoundingClientRect().top - g0.top));
      const h = document.querySelector(".lc-an-haken");
      if (h && t > 1100 && t < 3000) {
        const a = h.getBoundingClientRect(), b = kreis.getBoundingClientRect();
        abst.push(Math.hypot((a.left + a.width / 2) - (b.left + b.width / 2), (a.top + a.height / 2) - (b.top + b.height * 0.06)));
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    return { max: abst.length ? Math.max(...abst) : 999, n: abst.length, rutsch: Math.round(rutsch) };
  });
  await pg3.close();
  /* 20 px: Hakengroesse und das Pendeln des Bildes. */
  sage(angel.n > 5 && angel.max <= 20, "Angel: der Haken bleibt am Bild, auch wenn die Seite rutscht",
    "groesster Abstand " + Math.round(angel.max) + " px, Seite um " + angel.rutsch + " px gerutscht");

  /* Ein Bild von der Rute. */
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("heber", "Dana", "Alex", { ziel: 7 });
  });
  await pg.waitForTimeout(900);
  const el = await pg.$("#lcPlaetze");
  if (el) await el.screenshot({ path: "/tmp/claude-0/angel.png" });

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
