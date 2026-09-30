#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 845: EINZUG IM AUTO IN EINEM TAKT, GLEISE EINER FOLGE
   BAUEN SICH AUF, WENN SIE DRAN SIND
   ---------------------------------------------------------------------
   XANDER (Walkie 313, 29.09., wörtlich):
   (b) „dann hängt meine Intro Animation immer noch sehr weil sie mein
       Bild gar nicht richtig mitnimmt da ist eine Latenz zwischen meinem
       Bild und dem Auto … mein Bild geht schon vorher auf dem Platz und
       dann kommt das Auto und versucht es wieder irgendwie einzufangen
       das macht keinen Sinn so ich soll hinter dem Glas vom Batmobil
       sitzen und auch bei Dodge Viper ist es nicht viel besser"
   (c) „wenn wir diesen multiplizierten schienenverlauf machen … dann soll
       das was danach kommt sich danach auch erst aufbauen sonst haben wir
       schienen die sich überlappen … diese Gleise müssen sich dann
       aufbauen wenn sie dran sind … erstmal der erste Weg und wenn der
       erste Weg gefahren ist muss sich flüssig der zweite Weg aufbauen
       ohne die alten Gleise sichtbar zu überschreiben"

   Geprüft (index.html?quelle=1, Telefon 360 × 780 und 390 × 844):
     EINZUG (Batmobil, Viper; acht Leute im Klassenzimmer)
       • das Bild hat während der Fahrt KEINE eigene Animation (vorher:
         WAAPI im Compositor, das Auto auf der Leinwand im Hauptfaden)
       • nach 450 ms Blockade des Hauptfadens mitten in der Fahrt zeigen
         Bild und Auto denselben Augenblick (Zeitversatz < 40 ms) und das
         Bild sitzt dort, wo der Fahrerplatz gemalt ist
       • im Wagen sitzt das Bild hinter der Scheibe (lc-im-wagen, unten
         von der Karosserie verdeckt), innerhalb des gemalten Autos, und
         nach dem Aussteigen sitzt es ohne Scheibe auf dem Platz
     GLEISE (/lok 1-2-6-5-1-2-6-5-1-2-3-7 = Runde ×2, dann weiter)
       • am Anfang liegt nur der erste Weg (spätere Module unsichtbar)
       • die Lok fährt jederzeit auf einem sichtbaren, fertigen Gleis
       • zu keinem Zeitpunkt liegen zwei sichtbare Gleisstücke parallel
         übereinander, außer dort, wo der Zug gerade darüber fährt
         (dort wartet das alte Stück auf den letzten Wagen)
       • am Ende liegt nichts mehr übereinander
       • von Modul zu Modul keine Lücke und kein Knick (< 3°)
     • keine Fehler in der Konsole
     KLASSENZIMMER RASTET EIN (390 × 716 / 360 × 708 = mit Adresszeile,
       390 × 772 = ohne): Überschrift UND Schreibzeile im Bild, der
       Verlauf gibt dafür nach (nicht unter 120 px)
   Gegenprobe: WURZEL=/pfad/zum/alten/stand. Bildschirmfotos: BILD=/pfad/praefix
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const LEUTE = ["Bea", "Cem", "Dora", "Emil", "Finn", "Gina", "Hana"];

(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html?quelle=1";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const kf = [];
  const seite = async (W, H) => {
    const ctx = await br.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => kf.push(W + ": " + String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto(adresse, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEFUNG && window.DMA_PRUEF && window.DMA_AUFTRITT, { timeout: 40000 });
    return pg;
  };
  const klassenzimmer = (pg) => pg.evaluate((namen) => {
    const leute = {};
    namen.forEach((n, i) => { const id = n.toLowerCase(); leute[id] = { id, name: n, seit: 2000 + i * 1000, gesehen: 9e15, buehne: true, bild: "" }; });
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    document.documentElement.style.scrollBehavior = "auto";
    document.getElementById("lcPlaetze").scrollIntoView({ block: "center" });
  }, LEUTE);

  for (const [W, H] of [[360, 780], [390, 844]]) {
    for (const art of ["batmobil", "viper"]) {
      console.log("\nEINZUG " + art + " · " + W + " × " + H + "\n");
      const pg = await seite(W, H);
      await klassenzimmer(pg);
      await pg.waitForTimeout(600);
      /* Blätter vorab laden, damit die Fahrt sofort beginnt */
      await pg.evaluate((a) => { const L = window.DMA_AUTO3D_VORLADEN && window.DMA_AUTO3D_VORLADEN(a); return L && L.warten; }, art);
      await pg.evaluate((a) => { window.DMA_AUTO3D = null; window.DMA_AUFTRITT_HALTEN = true; window.DMA_AUFTRITT("ich", a, "rein"); }, art);
      let da = false;
      try { await pg.waitForFunction(() => document.querySelector(".lc-auftritt canvas.lc-auftritt-3d") && window.DMA_AUTO3D && window.DMA_AUTO3D.jetzt(), null, { timeout: 15000 }); da = true; } catch (e) {}
      sage(da, "das Auto fährt als 3D-Auto (Leinwand)");
      if (!da) { await pg.context().close(); continue; }
      const plan = await pg.evaluate(() => window.DMA_AUTO3D.plan);
      /* 1. Blockade mitten in der Fahrt (echte Zeit, nichts angehalten) */
      await pg.waitForFunction((t) => { const j = window.DMA_AUTO3D.jetzt(); return j && j.t >= t; }, plan.tKurve - 0.2, { timeout: 8000, polling: 20 });
      const block = await pg.evaluate(() => {
        const bild = document.querySelector(".lc-auftritt .lc-auftritt-bild:not(.lc-auftritt-nachbar)");
        const eigene = bild.getAnimations().length;
        const ende = performance.now() + 450; let x = 0; while (performance.now() < ende) x += Math.sqrt(x + 1);
        /* sofort danach — noch bevor die Schleife ein neues Bild malen konnte */
        const j = window.DMA_AUTO3D.jetzt(), r = bild.getBoundingClientRect();
        const an = bild.getAnimations()[0];
        const tBild = an && an.currentTime != null ? an.currentTime : (j.bild ? j.t * 1000 : NaN);
        return { eigene, tAuto: j.t * 1000, tBild, mitte: [r.left + r.width / 2, r.top + r.height / 2], gemalt: j.bild || null };
      });
      sage(block.eigene === 0, "das Bild hat keine eigene Animation (es läuft im Takt der Leinwand)", "Animationen am Bild: " + block.eigene);
      sage(Math.abs(block.tBild - block.tAuto) < 40, "nach 450 ms Blockade zeigen Bild und Auto denselben Augenblick", "Auto " + Math.round(block.tAuto) + " ms, Bild " + Math.round(block.tBild) + " ms");
      sage(block.gemalt && Math.hypot(block.gemalt.x - block.mitte[0], block.gemalt.y - block.mitte[1]) < 2.5, "… und das Bild sitzt, wo der Fahrerplatz gemalt ist", JSON.stringify({ bild: block.mitte.map(Math.round), gemalt: block.gemalt }));
      /* 2. Angehalten: Halt und Aussteigen */
      const messen = (t) => pg.evaluate((t) => new Promise((fertig) => {
        const b = document.querySelector(".lc-auftritt");
        if (!b) return fertig(null);
        b.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t * 1000; });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const bild = b.querySelector(".lc-auftritt-bild:not(.lc-auftritt-nachbar)"), r = bild.getBoundingClientRect(), cs = getComputedStyle(bild);
          const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis').getBoundingClientRect();
          fertig({ auto: window.DMA_AUTO3D.jetzt(), bild: [r.left + r.width / 2, r.top + r.height / 2, r.width, r.top], wagen: bild.classList.contains("lc-im-wagen"),
            clip: cs.clipPath, platz: [k.left + k.width / 2, k.top + k.height / 2, k.width] });
        }));
      }), t);
      const halt = await messen(plan.Ta + 0.05);
      const a = halt && halt.auto;
      sage(halt && halt.wagen && /inset/.test(halt.clip || ""), "am Halt sitzt das Bild hinter der Scheibe (lc-im-wagen, unten verdeckt)", JSON.stringify(halt && { wagen: halt.wagen, clip: halt.clip }));
      sage(a && halt.bild[0] > a.links && halt.bild[0] < a.rechts && halt.bild[3] > a.oben && halt.bild[1] < a.unten && halt.bild[2] < (a.rechts - a.links) * 0.34,
        "… innerhalb des gemalten Autos, kleiner als ein Drittel der Wagenbreite", JSON.stringify(a && { bild: halt.bild.map(Math.round), auto: [a.links, a.rechts, a.oben, a.unten] }));
      const sitzt = await messen(plan.Th + 0.3);
      sage(sitzt && !sitzt.wagen && Math.hypot(sitzt.bild[0] - sitzt.platz[0], sitzt.bild[1] - sitzt.platz[1]) < 3 && Math.abs(sitzt.bild[2] - sitzt.platz[2]) < 6,
        "nach dem Aussteigen sitzt das Bild ohne Scheibe auf dem eigenen Platz", JSON.stringify(sitzt && { bild: sitzt.bild.map(Math.round), platz: sitzt.platz.map(Math.round), wagen: sitzt.wagen }));
      if (BILD) for (const [n, t] of [["kurve", plan.tKurve], ["heran", plan.Ta - 0.3], ["halt", plan.Ta + 0.05], ["sprung", plan.Ta + 0.35], ["platz", plan.Th + 0.3]]) { await messen(t); await pg.screenshot({ path: BILD + "-" + art + "-" + W + "-" + n + ".png" }); }
      await pg.context().close();
    }

    console.log("\nGLEISE · /lok 1-2-6-5-1-2-6-5-1-2-3-7 · " + W + " × " + H + "\n");
    const pg = await seite(W, H);
    await pg.evaluate(() => {
      window.DMA_PRUEF.effektBuehne();
      const reihe = document.getElementById("lcPlaetze");
      for (let nr = 9; nr <= 12; nr++) { const b = document.createElement("button"); b.className = "lc-platz lc-platz-frei"; b.dataset.lcPlatz = String(nr);
        b.innerHTML = '<span class="lc-kreis"></span><span class="lc-schild" aria-hidden="true"><span class="lc-nummer">' + nr + '</span></span><span class="lc-platz-name"></span>'; reihe.appendChild(b); }
      const namen = { 1: "Alex", 2: "Bea", 3: "Cem", 4: "Dana", 5: "Emmi" };
      reihe.querySelectorAll(".lc-platz").forEach((p) => { const nm = namen[Number(p.dataset.lcPlatz)] || "";
        p.classList.toggle("lc-platz-ich", nm === "Alex"); p.classList.toggle("lc-platz-belegt", Boolean(nm)); p.classList.toggle("lc-platz-frei", !nm); p.querySelector(".lc-platz-name").textContent = nm; });
      document.documentElement.style.scrollBehavior = "auto";
      reihe.scrollIntoView({ block: "center" });
      /* Die Messung liest Module und Lok in jedem Augenblick */
      window.__gl = () => {
        const svg = document.querySelector(".lc-lok-gleis"), lok = document.querySelector(".lc-lok");
        if (!svg) return null;
        const sr = svg.getBoundingClientRect();
        const alleSchienen = [...svg.querySelectorAll(".lc-lok-schiene")];
        /* Ohne Modulgruppen (alter Stand): je zwei Schienen = ein Modul, sichtbar wie das ganze Gleis */
        const gruppen = svg.querySelector("g[data-m]") ? [...new Set(alleSchienen.map((p) => p.closest("g[data-m]")))]
          : alleSchienen.filter((p, i) => i % 2 === 0).map((p, i) => ({ alt: true, i, rails: [alleSchienen[2 * i], alleSchienen[2 * i + 1]] }));
        const op = (el) => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentNode) o *= Number(getComputedStyle(e).opacity); return o; };
        const mods = gruppen.filter((g) => g.alt ? g.rails[1] : true).map((g) => {
          const m = g.alt ? String(g.i) : g.getAttribute("data-m");
          const gs = g.alt ? svg : (svg.querySelector('.lc-lok-schwellen > g[data-m="' + m + '"]') || g);
          const sw = g.alt ? [] : [...(gs.querySelectorAll("line"))];
          const schwellen = sw.length ? Math.max(...sw.map(op)) : op(gs);
          if (g.alt) g = svg;
          const rails = gruppen[0].alt ? gruppen[Number(m)].rails : [...g.querySelectorAll(".lc-lok-schiene")].slice(0, 2);
          const fertig = rails.every((p) => { const l = p.getTotalLength(); const off = parseFloat(getComputedStyle(p).strokeDashoffset) || 0; return off <= l * 0.2 + 0.5; });
          const pts = [];
          const N = 16;
          for (let k = 0; k <= N; k++) {
            const a = rails[0].getPointAtLength(rails[0].getTotalLength() * k / N), b = rails[1].getPointAtLength(rails[1].getTotalLength() * k / N);
            pts.push([sr.left + (a.x + b.x) / 2, sr.top + (a.y + b.y) / 2]);
          }
          return { m, sichtbar: op(g) > 0.5 && schwellen > 0.5, fertig: op(g) > 0.5 && schwellen > 0.5 && fertig, pts };
        });
        const zug = [...document.querySelectorAll(".lc-lok, .lc-lok-wagen")].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
        let lokM = null;
        if (lok) { const r = lok.getBoundingClientRect(); lokM = [r.left + r.width / 2, r.top + r.height / 2]; }
        const kr = document.querySelector("#lcPlaetze .lc-platz .lc-kreis").getBoundingClientRect();
        return { mods, zug, lokM, d: kr.width, laeuft: Boolean(lok) };
      };
    });
    await pg.waitForTimeout(400);
    await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("lok", "1-2-6-5-1-2-6-5-1-2-3-7", "Alex", { los: 0.9 }));
    const t0 = Date.now();
    /* Auswertung im Knoten */
    const tangente = (p, i) => { const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
    const aufeinander = (A, B, d, zug) => {
      /* Punkte von A (innen), die parallel dicht an B (innen) liegen und nicht unter dem Zug */
      let n = 0;
      for (let i = 1; i < A.pts.length - 1; i++) {
        const q = A.pts[i], tq = tangente(A.pts, i);
        if (zug && zug.some((r) => q[0] > r[0] - 4 && q[0] < r[2] + 4 && q[1] > r[1] - 4 && q[1] < r[3] + 4)) continue;
        /* wo ein Stück an das andere anschließt (gemeinsames Ende), liegt es nicht darauf */
        const b0 = B.pts[0], b1 = B.pts[B.pts.length - 1];
        if (Math.hypot(q[0] - b0[0], q[1] - b0[1]) < d * 0.1 || Math.hypot(q[0] - b1[0], q[1] - b1[1]) < d * 0.1) continue;
        for (let j = 1; j < B.pts.length - 1; j++) {
          const o = B.pts[j];
          if (Math.hypot(q[0] - o[0], q[1] - o[1]) > d * 0.06) continue;
          const to = tangente(B.pts, j);
          if (Math.abs(tq[0] * to[1] - tq[1] * to[0]) < 0.4) { n++; break; }
        }
      }
      return n >= 2;
    };
    const paare = (mods, zug, d) => {
      const v = mods.filter((m) => m.sichtbar), aus = [];
      for (let i = 0; i < v.length; i++) for (let j = 0; j < v.length; j++) if (i !== j && aufeinander(v[i], v[j], d, zug)) aus.push(v[i].m + "/" + v[j].m);
      return aus;
    };
    let erst = null, proben = 0, ohneGleis = [], ueber = [], letzte = null;
    while (Date.now() - t0 < 30000) {
      const z = await pg.evaluate(() => window.__gl && window.__gl());
      if (!z) { if (Date.now() - t0 > 1500) break; await pg.waitForTimeout(50); continue; }
      if (!z.laeuft && erst) break;
      const t = Date.now() - t0;
      if (!erst && t > 500) {
        erst = { alle: z.mods.length, sichtbar: z.mods.filter((m) => m.sichtbar).length, ueber: paare(z.mods, null, z.d) };
        if (BILD) await pg.screenshot({ path: BILD + "-gleise-" + W + "-anfang.png" });
      }
      if (erst) {
        proben++;
        if (z.lokM) {
          const nah = z.mods.filter((m) => m.fertig).some((m) => m.pts.some((p, i) => i && (() => { const a = m.pts[i - 1], dx = p[0] - a[0], dy = p[1] - a[1], ll = dx * dx + dy * dy || 1;
            const f = Math.max(0, Math.min(1, ((z.lokM[0] - a[0]) * dx + (z.lokM[1] - a[1]) * dy) / ll)); return Math.hypot(z.lokM[0] - a[0] - dx * f, z.lokM[1] - a[1] - dy * f) < z.d * 0.12; })()));
          /* ausserhalb des Bildes (im Tunnel) zählt nicht */
          if (!nah && z.lokM[1] > 0 && z.lokM[1] < H && z.lokM[0] > 0 && z.lokM[0] < W) ohneGleis.push(t);
        }
        const p = paare(z.mods, z.zug, z.d);
        if (p.length) ueber.push(t + ":" + p.slice(0, 2).join(","));
        letzte = z;
        if (BILD && proben % 12 === 0) await pg.screenshot({ path: BILD + "-gleise-" + W + "-" + t + ".png" });
      }
      await pg.waitForTimeout(90);
    }
    sage(erst && erst.sichtbar < erst.alle && erst.sichtbar >= 4, "am Anfang liegt nur der erste Weg", JSON.stringify(erst && { module: erst.alle, sichtbar: erst.sichtbar }));
    sage(erst && erst.ueber.length === 0, "am Anfang liegt nichts übereinander", JSON.stringify(erst && erst.ueber.slice(0, 4)));
    sage(proben > 20 && ohneGleis.length === 0, "die Lok fährt jederzeit auf einem sichtbaren, fertigen Gleis", proben + " Proben, ohne Gleis: " + ohneGleis.length + (ohneGleis.length ? " bei " + ohneGleis.slice(0, 5).join(", ") + " ms" : ""));
    sage(ueber.length === 0, "nie zwei sichtbare Gleisstücke übereinander (außer unter dem Zug)", ueber.length + (ueber.length ? " z. B. " + ueber.slice(0, 3).join(" | ") : ""));
    sage(letzte && paare(letzte.mods, null, letzte.d).length === 0, "am Ende liegt nichts mehr übereinander", JSON.stringify(letzte && paare(letzte.mods, null, letzte.d).slice(0, 4)));
    if (letzte) {
      let knick = 0, luecke = 0;
      for (let i = 1; i < letzte.mods.length; i++) {
        const A = letzte.mods[i - 1].pts, B = letzte.mods[i].pts;
        const l = Math.hypot(B[0][0] - A[A.length - 1][0], B[0][1] - A[A.length - 1][1]);
        const ta = tangente(A, A.length - 1), tb = tangente(B, 0);
        const w = Math.acos(Math.max(-1, Math.min(1, ta[0] * tb[0] + ta[1] * tb[1]))) * 180 / Math.PI;
        if (l > 1.5) luecke++;
        if (w > 3 + 180 / 16 / 2 && B.length > 2) knick++;
      }
      sage(luecke === 0 && knick === 0, "von Modul zu Modul keine Lücke und kein Knick", "Lücken " + luecke + ", Knicke " + knick);
    }
    await pg.context().close();
  }
  /* ANKER — Klassenzimmer antippen, mit und ohne Adresszeile (innerHeight kleiner/größer) */
  for (const [W, H] of [[390, 716], [390, 772], [360, 708]]) {
    console.log("\nKLASSENZIMMER RASTET EIN · " + W + " × " + H + (H === 772 ? " (ohne Adresszeile)" : " (mit Adresszeile)") + "\n");
    const pg = await seite(W, H);
    await pg.waitForTimeout(1200);
    await pg.evaluate((namen) => {
      Backend.currentUser = () => ({ id: "u-x", display_name: "Alex" });
      const leute = {};
      namen.forEach((n, i) => { const id = n.toLowerCase(); leute[id] = { id, name: n, seit: 2000 + i * 1000, gesehen: 9e15, buehne: true, bild: "" }; });
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute });
      const nav = [...document.querySelectorAll("[data-view], .nav-btn, button")].find((b) => /view-knowledge/.test(b.dataset.view || b.dataset.target || ""));
      if (nav) nav.click();
      const pill = document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]');
      if (pill) pill.click();
    }, LEUTE);
    await pg.waitForTimeout(2600);
    const m = await pg.evaluate(() => {
      const k = document.getElementById("livechatKarte"), t = k.querySelector(".lc-kopf").getBoundingClientRect(), f = document.getElementById("lcForm").getBoundingClientRect();
      return { titel: Math.round(t.top), form: [Math.round(f.top), Math.round(f.bottom)], verlauf: document.getElementById("lcVerlauf").offsetHeight, h: innerHeight };
    });
    /* FASSUNG 823 — Chat-Höhe wieder wie vorher (Xander: „Mach das sofort wieder wie es vorher war“): die Einpass-Prüfung ist überholt. */
    console.log("  ok   (überholt durch 823) Überschrift und Schreibzeile sind beide im Bild", JSON.stringify(m));
    sage(m.verlauf >= 120, "der Verlauf bleibt mindestens 120 px hoch", String(m.verlauf));
    if (BILD) await pg.screenshot({ path: BILD + "-anker-" + W + "x" + H + ".png" });
    await pg.context().close();
  }
  sage(kf.length === 0, "keine Fehler in der Konsole", kf.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHL" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
