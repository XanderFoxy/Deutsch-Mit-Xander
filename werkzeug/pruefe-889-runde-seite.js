/* =====================================================================
   SONDE 889, TEIL B — die echte Seite (Chromium, min/ wie ausgeliefert)
   ---------------------------------------------------------------------
   Aufgerufen von werkzeug/pruefe-889-runde.js (NUR=B). Der Prüfserver hält
   jede Wortschatz-Datei (vokabeln/*.js) WS_MS lang zurück (Standard 6 s):
   so ist sicher, ob die erste Frage vor oder nach dem ganzen Wortschatz
   kommt. Getippt wird wie ein Mensch (Lernen → Karte → Runde starten).

     B1 Karte ohne wortschatzabhängige Aufgaben (wortstellung): die erste
        Frage kommt VOR dem ganzen Wortschatz, ohne den Auszug, Runde mit
        10 Fragen, keine Seitenfehler
     B2 Karte mit abhängigen Aufgaben (plural, Niveau aus dem Profil/B1):
        die Frage kommt vor dem Wortschatz; der Auszug wurde genau einmal
        geholt, und zwar schon beim Tipp auf die Karte (vor „Runde
        starten“); benutzt, keine Lücke
     B3 drei Karten zugleich (quiz, ss-eszett, wortstellung): wie B2
     B4 „Wortschatz“ (baut die Aufgaben aus dem Wörterbuch; Profil mit
        Punkten, Thema gewählt): wartet wie bisher auf den ganzen
        Wortschatz, kein Auszug
     B5 ?quelle (der alte Weg ohne min/ und ohne Teile): wartet auf den
        Wortschatz, kein Auszug
     B6 Auszug nicht da (404): wartet auf den Wortschatz, Runde läuft
     B7 Auszug aus einem anderen Wörterbuch (ein Stempel falsch): nicht
        benutzt, wartet auf den Wortschatz
     B8 Gleichlauf IN der Seite (min/quiz.js, min/data-exercises.js, die
        Teile aus bau/): je Kategorie × Niveau × Startwert die Runde vor dem
        Wortschatz (889-Weg) = dieselbe Runde nach dem ganzen Wortschatz
        (bisheriger Aufruf)
   Gegenprobe: WURZEL=<Baum mit 888> → B1, B2, B3, B8 rot.
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http");

async function teilB(WURZEL, sage) {
  const vorher = { n: 0 };
  const zaehl = (gut, was, dazu) => { if (!gut) vorher.n++; sage(gut, was, dazu); };
  console.log("\nB  DIE ECHTE SEITE (Chromium, Wortschatz-Dateien je " + (Number(process.env.WS_MS) || 6000) + " ms zurückgehalten)\n");
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const WS_MS = Number(process.env.WS_MS) || 6000;
  const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
    ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".gif": "image/gif" };
  const log = [];
  const S = { wnWeg: false, wnFalsch: false };
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    const istWn = /^\/bau\/wortniveau-[A-Za-z0-9_-]{8}\.js$/.test(p);
    const da = f.startsWith(WURZEL) && fs.existsSync(f) && !fs.statSync(f).isDirectory() && !(istWn && S.wnWeg);
    const z = { p, s: da ? 200 : 404, t: Date.now() };
    log.push(z);
    if (!da) { a.writeHead(404); return a.end(); }
    const senden = () => {
      a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
      if (istWn && S.wnFalsch) return a.end(fs.readFileSync(f, "utf8").replace(/("vokabeln\/[a-z]+\.js":")[0-9a-f]{10}"/, '$10000000000"'));
      fs.createReadStream(f).pipe(a);
    };
    if (/^\/vokabeln\//.test(p)) setTimeout(senden, WS_MS); else senden();
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const BASIS = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const istWn = (x) => /^\/bau\/wortniveau-/.test(x.p);
  const seite = async (o) => {
    o = o || {};
    S.wnWeg = Boolean(o.wnWeg); S.wnFalsch = Boolean(o.wnFalsch);
    const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await ctx.addInitScript(() => {
      try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {}
      window.__r = { ws: null, frage: null };
      const uhr = setInterval(() => {
        let V = null; try { V = typeof VocabData !== "undefined" ? VocabData : null; } catch (e) {}
        if (V && window.__r.ws == null && V.alleThemenDa && V.alleThemenDa()) { window.__r.ws = performance.now(); clearInterval(uhr); }
      }, 10);
      new MutationObserver(() => {
        if (window.__r.frage != null) return;
        const k = document.querySelector("#exercisePlay .question-card");
        if (k && k.offsetParent !== null) window.__r.frage = performance.now();
      }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    });
    const pg = await ctx.newPage();
    const pe = [];
    pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
    const ab = log.length;
    await pg.goto(BASIS + "/index.html" + (o.query || ""), { waitUntil: "load", timeout: 60000 });
    await pg.waitForFunction(() => typeof ExerciseData !== "undefined" && window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading"
      && document.querySelector('.tape-tab[data-target="view-learn"]'), null, { timeout: 30000 });
    await pg.waitForTimeout(1200);
    return { ctx, pg, pe, ab };
  };
  /* Lernen → Karte(n) → (Thema) → Runde starten → erste Frage */
  const runde = async (o) => {
    const s = await seite(o);
    const { pg } = s;
    try {
      if (o.profil) await pg.evaluate(() => { const p = { id: "pruef", name: "Prüf", points: 999, trophies: [], badges: [], giftedCategories: [], extraProfileData: {} }; Backend.currentProfile = () => p; });
      await pg.click('.tape-tab[data-target="view-learn"]');
      await pg.waitForFunction(() => { const g = document.querySelector("#exerciseSetup .category-grid .category-card"); return g && g.offsetParent !== null; }, null, { timeout: 30000 });
      for (const k of o.karten) {
        await pg.click('#exerciseSetup .category-card[data-cat="' + k + '"] .cat-checkbox');
        await pg.waitForFunction((k) => { const b = document.getElementById("startBtn"); return b && !b.disabled && document.querySelector('#exerciseSetup .category-card.selected[data-cat="' + k + '"]'); }, k, { timeout: 30000 });
      }
      if (o.thema) {
        await pg.click('[data-wortschatztopic="' + o.thema + '"]');
        await pg.waitForFunction((t) => { const b = document.querySelector('[data-wortschatztopic="' + t + '"]'); const s = document.getElementById("startBtn"); return b && b.getAttribute("aria-selected") === "true" && s && !s.disabled; }, o.thema, { timeout: 30000 });
      }
      const vorStart = log.slice(s.ab).filter(istWn).length;
      const tipp = await pg.evaluate(() => performance.now());
      await pg.click("#startBtn");
      await pg.waitForFunction(() => window.__r.frage != null, null, { timeout: WS_MS + 30000 });
      const r = await pg.evaluate(() => ({ r: window.__r, total: Quiz.progress ? Quiz.progress().total : null, stand: Quiz.auszugStand ? Quiz.auszugStand() : null,
        ganz: typeof VocabData !== "undefined" && VocabData.alleThemenDa(), lvl: (Quiz.getState() || {}).level }));
      r.tipp = tipp; r.dauer = Math.round(r.r.frage - tipp);
      r.vorWs = r.r.ws == null || r.r.frage < r.r.ws;
      r.wn = log.slice(s.ab).filter(istWn); r.wnVorStart = vorStart;
      r.pe = s.pe;
      return r;
    } finally { await s.ctx.close(); }
  };
  const kurz = (r) => "Tipp → Frage " + r.dauer + " ms, Wortschatz ganz " + (r.r.ws == null ? "noch nicht" : Math.round(r.r.ws - r.tipp) + " ms nach dem Tipp")
    + ", " + r.total + " Fragen (Niveau " + r.lvl + "), Auszug geholt " + r.wn.length + "× (vor dem Start " + r.wnVorStart + "), " + JSON.stringify(r.stand) + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : "");

  try {
    {
      const r = await runde({ karten: ["wortstellung"] });
      zaehl(r.vorWs && r.dauer < WS_MS - 1500 && r.total === 10 && !r.wn.length && !r.pe.length, "B1 wortstellung: Frage vor dem Wortschatz, ohne Auszug, 10 Fragen", kurz(r));
    }
    {
      const r = await runde({ karten: ["plural"] });
      zaehl(r.vorWs && r.dauer < WS_MS - 1500 && r.total === 10 && r.wn.length === 1 && r.wnVorStart === 1 && r.stand && r.stand.benutzt > 0 && r.stand.luecke === 0 && !r.pe.length,
        "B2 plural: Frage vor dem Wortschatz, Auszug einmal schon beim Kartentipp geholt und benutzt, keine Lücke", kurz(r));
    }
    {
      const r = await runde({ karten: ["quiz", "ss-eszett", "wortstellung"] });
      zaehl(r.vorWs && r.dauer < WS_MS - 1500 && r.total === 10 && r.wn.length === 1 && r.wnVorStart === 1 && r.stand && r.stand.benutzt > 0 && r.stand.luecke === 0 && !r.pe.length,
        "B3 quiz + ss-eszett + wortstellung: wie B2", kurz(r));
    }
    {
      const r = await runde({ karten: ["wortschatz"], profil: true, thema: "Essen & Trinken" });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && !r.wn.length && !r.pe.length, "B4 Wortschatz (Thema Essen & Trinken): wartet wie bisher auf den ganzen Wortschatz, kein Auszug", kurz(r));
    }
    {
      const r = await runde({ karten: ["plural"], query: "?quelle" });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && !r.wn.length && !r.pe.length, "B5 ?quelle, plural: alter Weg – wartet auf den Wortschatz, kein Auszug", kurz(r));
    }
    {
      const r = await runde({ karten: ["plural"], wnWeg: true });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && r.stand && r.stand.benutzt === 0 && !r.pe.length, "B6 Auszug 404, plural: wartet auf den Wortschatz, Runde läuft", kurz(r));
    }
    {
      const r = await runde({ karten: ["plural"], wnFalsch: true });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && r.stand && r.stand.benutzt === 0 && !r.pe.length, "B7 Auszug mit falschem Stempel, plural: nicht benutzt, wartet auf den Wortschatz", kurz(r));
    }
    /* B8 — Gleichlauf in der Seite */
    {
      const s = await seite({});
      try {
        const e = await s.pg.evaluate(async () => {
          if (!Quiz.wortschatzWeg) return { fehlt: true };
          const kats = ["plural", "quiz", "ss-eszett", "lueckentext", "redewendungen", "wenn-ob", "wortstellung", "artikel"];
          await ExerciseData.ladeUebungen(kats);
          await ExerciseData.wortniveauHolen();
          const zuf = (st) => { let x = st >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; };
          const echt = Math.random;
          const faelle = [];
          let n = 0;
          kats.forEach((k) => ["A1", "B1", "C1", "C2"].forEach((lv) => [1, 2].forEach((st) => faelle.push({ ids: [k], lv, st: 100 + (n++) }))));
          faelle.push({ ids: ["plural", "quiz", "wortstellung"], lv: "B2", st: 7 }, { ids: ["ss-eszett", "lueckentext"], lv: "A2", st: 8 });
          const th = { quiz: "", wortschatz: "" };
          const vor = [], wege = {};
          const ws0 = VocabData.alleThemenDa();
          faelle.forEach((f) => {
            Math.random = zuf(f.st);
            const b = { ohneNiveau: true };
            const v = Quiz.poolSizeFor(f.ids, th, f.lv, b);
            const w = Quiz.wortschatzWeg(b); wege[w] = (wege[w] || 0) + 1;
            Quiz.startSession(f.ids, "mittel", null, "mix", th, f.lv, { auszug: true });
            vor.push(JSON.stringify([v, Quiz.getState().questions]));
          });
          Math.random = echt;
          const stand = Quiz.auszugStand();
          await VocabData.ladeWoerter();
          let abw = 0;
          faelle.forEach((f, i) => {
            Math.random = zuf(f.st);
            const v = Quiz.poolSizeFor(f.ids, th, f.lv);
            Quiz.startSession(f.ids, "mittel", null, "mix", th, f.lv);
            if (JSON.stringify([v, Quiz.getState().questions]) !== vor[i]) abw++;
          });
          Math.random = echt;
          Quiz.reset();
          return { n: faelle.length, abw, wege, stand, ws0, ws1: VocabData.alleThemenDa() };
        });
        zaehl(!e.fehlt && e.abw === 0 && !e.ws0 && e.ws1 && e.stand.benutzt > 0 && e.stand.luecke === 0 && !e.wege.voll,
          "B8 Gleichlauf in der Seite (min/): Runde vor dem Wortschatz (889-Weg) = nach dem ganzen Wortschatz (bisheriger Aufruf)",
          e.fehlt ? "kein Quiz.wortschatzWeg" : e.n + " Runden, abweichend " + e.abw + ", Wege " + JSON.stringify(e.wege) + ", Auszug " + JSON.stringify(e.stand));
      } finally { await s.ctx.close(); }
    }
  } catch (e) {
    zaehl(false, "B abgebrochen: " + String(e.message || e).split("\n")[0].slice(0, 200));
  } finally {
    await br.close();
    srv.close();
  }
  return 0;   /* gezählt hat sage() schon */
}
module.exports = { teilB };
