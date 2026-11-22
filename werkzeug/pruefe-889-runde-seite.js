/* =====================================================================
   SONDE 889, TEIL B — die echte Seite (Chromium, min/ wie ausgeliefert)
   ---------------------------------------------------------------------
   Aufgerufen von werkzeug/pruefe-889-runde.js (NUR=B). Der Prüfserver hält
   jede Wortschatz-Datei (vokabeln/*.js) WS_MS lang zurück (Standard 3 s; HTTP/1.1, also höchstens 6 zugleich – ganz erst nach ≈ 5 × WS_MS):
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
     B1b/B4b (Nachmessung) nach dem Kartentipp: wortstellung höchstens 4
        Wortschatz-Dateien angefordert (die Reihe), Wortschatz ALLE (eilig –
        auf ihn wird gewartet)
     B9 satzbau.js (185 KB) beim ersten Öffnen von „Lernen" erst NACH dem Teil
        von data-exercises.js, den jeder Kartentipp braucht (der Server hält
        diesen Teil 2,5 s zurück); es kommt trotzdem, genau einmal
     B10 wer gleich nach „Lernen" den Reiter „Satzbaukasten" tippt, bekommt
        satzbau.js sofort (vor dem Teil), genau einmal, und den Kasten
     B11 (Nachbesserung, Prüfer) die Spiele unter „Lernen", die erst mit dem
        GANZEN Wortschatz zeichnen (Flussfuchs, Setzerei, Wortkette,
        Augenblick, Meine Sätze, Wortlisten), „Alle Wörter dieses Textes in
        eine Liste" und das „Hörspiel mit meiner Stimme": warten sie
        (Platzhalter), sind 400 ms nach dem Öffnen
        alle Wortschatz-Dateien angefordert (eilig) – die Wortkette zeichnet,
        sobald er ganz da ist. B11r Gegenstück: ist man im Raum
        (LiveChat.lage „drin"), bleibt es bei der Reihe (höchstens 4).
     B12 (Nachbesserung) kennt der Browser transferSize nicht (Safari unter
        16.4; hier: aus PerformanceResourceTiming.prototype gelöscht), lädt
        der Wortschatz nach dem Kartentipp wie in 888 ganz zugleich (B1b
        bleibt die Gegenprobe: mit transferSize die Reihe)
   Gegenprobe: WURZEL=<Baum mit 888> → B1, B1b, B2, B3, B8, B9 rot (B10 dort grün);
   gegen ed33c26f (vor eilig) B4b rot; gegen 46223744 (vor der Nachbesserung)
   B11 ×8 und B12 rot, B11r grün.
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http");

async function teilB(WURZEL, sage) {
  const vorher = { n: 0 };
  const zaehl = (gut, was, dazu) => { if (!gut) vorher.n++; sage(gut, was, dazu); };
  console.log("\nB  DIE ECHTE SEITE (Chromium, Wortschatz-Dateien je " + (Number(process.env.WS_MS) || 3000) + " ms zurückgehalten)\n");
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const WS_MS = Number(process.env.WS_MS) || 3000;
  const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
    ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".gif": "image/gif" };
  const log = [];
  const S = { wnWeg: false, wnFalsch: false, halten: false, wartend: [], basisMs: 0 };
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    const istWn = /^\/bau\/wortniveau-[A-Za-z0-9_-]{8}\.js$/.test(p);
    const da = f.startsWith(WURZEL) && fs.existsSync(f) && !fs.statSync(f).isDirectory() && !(istWn && S.wnWeg);
    const z = { p, s: da ? 200 : 404, t: Date.now() };
    log.push(z);
    if (!da) { a.writeHead(404); return a.end(); }
    const senden = () => {
      z.aus = Date.now();
      a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
      if (istWn && S.wnFalsch) return a.end(fs.readFileSync(f, "utf8").replace(/("vokabeln\/[a-z]+\.js":")[0-9a-f]{10}"/, '$10000000000"'));
      fs.createReadStream(f).pipe(a);
    };
    /* halten (B4): der Wortschatz kommt erst, wenn die Sonde ihn freigibt */
    if (/^\/vokabeln\//.test(p)) { if (S.halten) S.wartend.push(senden); else setTimeout(senden, WS_MS); }
    else if (S.basisMs && /^\/min\/data-exercises-teil\.js$/.test(p)) setTimeout(senden, S.basisMs);   /* B9/B10: der Teil, den jeder Kartentipp braucht */
    else senden();
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const BASIS = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const istWn = (x) => /^\/bau\/wortniveau-/.test(x.p);
  const seite = async (o) => {
    o = o || {};
    S.wnWeg = Boolean(o.wnWeg); S.wnFalsch = Boolean(o.wnFalsch); S.halten = Boolean(o.halten); S.wartend = []; S.basisMs = Number(o.basisMs) || 0;
    const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    /* B12: ein Browser ohne transferSize (wie Safari unter 16.4) */
    if (o.ohneTransfer) await ctx.addInitScript(() => { try { delete PerformanceResourceTiming.prototype.transferSize; } catch (e) {} });
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
        if (k && k.offsetParent !== null) {
          window.__r.frage = performance.now();
          /* im selben Augenblick: war der Wortschatz schon ganz da? (der 10-ms-Blick oben käme bis zu 10 ms zu spät) */
          try { window.__r.wsBeiFrage = Boolean(VocabData.alleThemenDa()); } catch (e) { window.__r.wsBeiFrage = null; }
        }
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
        await pg.evaluate((k) => { const e = document.querySelector('#exerciseSetup .category-card[data-cat="' + k + '"] .cat-checkbox'); e.scrollIntoView({ block: "center" }); e.click(); }, k);
        await pg.waitForFunction((k) => { const b = document.getElementById("startBtn"); return b && !b.disabled && document.querySelector('#exerciseSetup .category-card.selected[data-cat="' + k + '"]'); }, k, { timeout: 30000 });
      }
      /* Nachmessung 889: wie viele Wortschatz-Dateien hat die Seite nach dem Kartentipp angefordert (Skript-Elemente)? */
      const vokNachKarte = await pg.evaluate(() => ({ n: document.querySelectorAll('script[src*="vokabeln/"]').length, alle: VocabData.themenListe ? VocabData.themenListe().length : null,
        transfer: "transferSize" in PerformanceResourceTiming.prototype }));
      if (o.thema) {
        await pg.evaluate((t) => { const e = document.querySelector('[data-wortschatztopic="' + t + '"]'); e.scrollIntoView({ block: "center" }); e.click(); }, o.thema);
        await pg.waitForFunction((t) => { const b = document.querySelector('[data-wortschatztopic="' + t + '"]'); const s = document.getElementById("startBtn"); return b && b.getAttribute("aria-selected") === "true" && s && !s.disabled; }, o.thema, { timeout: 30000 });
      }
      const vorStart = log.slice(s.ab).filter(istWn).length;
      if (o.halten) { S.halten = false; S.wartend.splice(0).forEach((f) => f()); }
      const tipp = await pg.evaluate(() => performance.now());
      await pg.evaluate(() => { const e = document.getElementById("startBtn"); e.scrollIntoView({ block: "center" }); e.click(); });
      await pg.waitForFunction(() => window.__r.frage != null, null, { timeout: WS_MS * 12 + 20000 });
      const r = await pg.evaluate(() => ({ r: window.__r, total: Quiz.progress ? Quiz.progress().total : null, stand: Quiz.auszugStand ? Quiz.auszugStand() : null,
        ganz: typeof VocabData !== "undefined" && VocabData.alleThemenDa(), lvl: (Quiz.getState() || {}).level }));
      r.tipp = tipp; r.dauer = Math.round(r.r.frage - tipp); r.vok = vokNachKarte;
      r.vorWs = r.r.wsBeiFrage === false;
      /* wann die Seite den Auszug ANGEFRAGT hat (Resource Timing; beim Prüfserver mit HTTP/1.1 kann die Anfrage hinter
         den Wortschatz-Dateien warten, bevor sie beim Server ankommt) */
      r.wnStarts = await pg.evaluate(() => performance.getEntriesByType("resource").filter((e) => /\/bau\/wortniveau-/.test(e.name)).map((e) => e.startTime));
      r.wnVorStart = r.wnStarts.filter((t) => t < tipp).length;
      r.wn = log.slice(s.ab).filter(istWn); void vorStart;
      r.pe = s.pe;
      return r;
    } finally { await s.ctx.close(); }
  };
  const kurz = (r) => "Tipp → Frage " + r.dauer + " ms, Wortschatz bei der Frage " + (r.r.wsBeiFrage ? "ganz" : "noch nicht ganz") + (r.r.ws == null ? "" : " (ganz " + Math.round(r.r.ws - r.tipp) + " ms nach dem Tipp)")
    + ", " + r.total + " Fragen (Niveau " + r.lvl + "), Auszug geholt " + r.wn.length + "× (vor dem Start " + r.wnVorStart + "), " + JSON.stringify(r.stand) + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : "");

  try {
    {
      const r = await runde({ karten: ["wortstellung"] });
      zaehl(r.vorWs && r.dauer < WS_MS - 1500 && r.total === 10 && !r.wn.length && !r.pe.length, "B1 wortstellung: Frage vor dem Wortschatz, ohne Auszug, 10 Fragen", kurz(r));
      zaehl(r.vok.n <= 4, "B1b wortstellung: der Wortschatz lädt in der Reihe (nach dem Kartentipp höchstens 4 Dateien angefordert)", r.vok.n + " von " + r.vok.alle);
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
      /* „Alle Themen" (Vorgabe beim Antippen der Karte) mit schon (teilweise) geladenem Wörterbuch friert die Seite minutenlang
         ein (Fund 889, schon in 888) – darum hält der Server den Wortschatz zurück, bis das Thema gewählt ist */
      const r = await runde({ karten: ["wortschatz"], profil: true, thema: "Essen & Trinken", halten: true });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && !r.wn.length && !r.pe.length, "B4 Wortschatz (Thema Essen & Trinken): wartet wie bisher auf den ganzen Wortschatz, kein Auszug", kurz(r));
      zaehl(r.vok.alle > 4 && r.vok.n === r.vok.alle, "B4b Wortschatz: wer auf den ganzen Wortschatz wartet, bekommt ihn nicht mehr in der Reihe (nach dem Kartentipp alle Dateien angefordert, VocabData.eilig)", r.vok.n + " von " + r.vok.alle);
    }
    {
      const r = await runde({ karten: ["plural"], query: "?quelle" });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && !r.wn.length && !r.pe.length, "B5 ?quelle, plural: alter Weg – wartet auf den Wortschatz, kein Auszug", kurz(r));
    }
    {
      const r = await runde({ karten: ["plural"], wnWeg: true });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && r.stand && r.stand.benutzt === 0 && !r.pe.length, "B6 Auszug 404, plural: wartet auf den Wortschatz, Runde läuft (der Auszug wird beim Kartentipp und noch einmal beim Start versucht)", kurz(r));
    }
    {
      const r = await runde({ karten: ["plural"], wnFalsch: true });
      zaehl(!r.vorWs && r.ganz && r.total === 10 && r.stand && r.stand.benutzt === 0 && !r.pe.length, "B7 Auszug mit falschem Stempel, plural: nicht benutzt, wartet auf den Wortschatz", kurz(r));
    }
    /* B9/B10 — satzbau.js erst nach dem Teil von data-exercises.js (Fassung 889, „Karte → startklar" auf 3G) */
    const satzbauFall = async (reiter) => {
      const s = await seite({ basisMs: 2500 });
      try {
        const t0 = Date.now();
        await s.pg.click('.tape-tab[data-target="view-learn"]');
        if (reiter) await s.pg.evaluate(() => { const e = document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]'); e.scrollIntoView({ block: "center" }); e.click(); });
        const da = await s.pg.waitForFunction(() => Boolean(window.Satzbau), null, { timeout: 12000 }).then(() => true, () => false);
        const kasten = reiter ? await s.pg.waitForFunction(() => { const a = document.getElementById("satzbaukastenDeArea"); return a && a.children.length > 0 && !/wird geladen|nicht geladen/.test(a.textContent); }, null, { timeout: 8000 }).then(() => true, () => false) : null;
        await s.pg.waitForTimeout(500);
        /* bis der zurückgehaltene Teil hinaus ist (höchstens 4 s), damit beide Zeiten im Protokoll stehen */
        for (let i = 0; i < 40 && !log.slice(s.ab).some((x) => x.p === "/min/data-exercises-teil.js" && x.aus); i++) await s.pg.waitForTimeout(100);
        const l = log.slice(s.ab), sb = l.filter((x) => /^\/(?:min\/)?satzbau\.js$/.test(x.p)), ba = l.filter((x) => x.p === "/min/data-exercises-teil.js");
        const basisAus = ba.length && ba[0].aus ? ba[0].aus : null;
        return { da, kasten, sb: sb.length, sbAb: sb.length ? sb[0].t - t0 : null, basis: ba.length, basisAus: basisAus ? basisAus - t0 : null,
          nachBasis: Boolean(sb.length && basisAus && sb[0].t >= basisAus), pe: s.pe };
      } finally { await s.ctx.close(); }
    };
    {
      const r = await satzbauFall(false);
      zaehl(r.da && r.sb === 1 && r.basis === 1 && r.nachBasis && !r.pe.length,
        "B9 erstes „Lernen“: satzbau.js erst nach dem Teil von data-exercises.js, genau einmal, kommt",
        "Teil geschickt " + r.basisAus + " ms, satzbau.js angefragt " + r.sbAb + " ms nach dem Tipp (" + r.sb + "×), Satzbau " + (r.da ? "da" : "FEHLT") + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : ""));
    }
    {
      const r = await satzbauFall(true);
      zaehl(r.da && r.kasten && r.sb === 1 && !r.nachBasis && !r.pe.length,
        "B10 Reiter „Satzbaukasten“ gleich nach „Lernen“: satzbau.js sofort (vor dem Teil), genau einmal, der Kasten steht",
        "Teil geschickt " + r.basisAus + " ms, satzbau.js angefragt " + r.sbAb + " ms nach dem Tipp (" + r.sb + "×), Kasten " + (r.kasten ? "steht" : "FEHLT") + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : ""));
    }
    /* B11/B12 — Nachbesserung (Prüfer): wer auf den GANZEN Wortschatz wartet, bekommt ihn nicht in der Reihe */
    const spielFall = async (o) => {
      const s = await seite({ ohneTransfer: o.ohneTransfer });
      try {
        const { pg } = s;
        await pg.click('.tape-tab[data-target="view-learn"]');
        await pg.waitForFunction(() => { const g = document.querySelector("#exerciseSetup .category-grid .category-card"); return g && g.offsetParent !== null; }, null, { timeout: 30000 });
        if (o.konto) await pg.evaluate(() => { Backend.currentUser = () => ({ id: "pruef", email: "pruef@example.invalid" }); });
        if (o.raum) await pg.evaluate(() => { window.LiveChat.lage = () => ({ lage: "drin" }); });
        const vorher = await pg.evaluate(() => document.querySelectorAll('script[src*="vokabeln/"]').length);
        await pg.evaluate(o.oeffnen, o.arg);
        await pg.waitForTimeout(400);
        const r = await pg.evaluate((area) => ({ n: document.querySelectorAll('script[src*="vokabeln/"]').length, alle: VocabData.themenListe().length, ganz: VocabData.alleThemenDa(),
          text: (area && document.getElementById(area) ? document.getElementById(area).textContent : "").replace(/\s+/g, " ").trim().slice(0, 90),
          toast: [...document.querySelectorAll(".toast, #toast, [class*='toast']")].map((e) => e.textContent).join(" ").replace(/\s+/g, " ").slice(0, 90) }), o.area || null);
        r.vorher = vorher;
        if (o.zeichnen) {
          const t0 = Date.now();
          r.gezeichnet = await pg.waitForFunction(([area, platz]) => { const a = document.getElementById(area); return VocabData.alleThemenDa() && a && a.textContent.length > 0 && !a.textContent.includes(platz); },
            [o.area, o.platz], { timeout: WS_MS * 12 + 20000 }).then(() => true, () => false);
          r.zeichnenMs = Date.now() - t0;
        }
        r.pe = s.pe;
        return r;
      } finally { await s.ctx.close(); }
    };
    const pille = (sub) => { const e = document.querySelector('#learnSubnav [data-sub="' + sub + '"]'); e.click(); };
    const SPIELE = [
      { name: "Flussfuchs", sub: "sub-flussfuchs", area: "flussfuchsArea", platz: "sucht sich seine Steine" },
      { name: "Setzerei", sub: "sub-setzerei", area: "setzereiArea", platz: "wird gefüllt" },
      { name: "Wortkette", sub: "sub-wortkette", area: "wortketteArea", platz: "wird geschmiedet", zeichnen: true },
      { name: "Augenblick", sub: "sub-augenblick", area: "augenblickArea", platz: "werden geholt" },
      { name: "Meine Sätze", sub: "sub-meinesaetze", area: "meineSaetzeArea", platz: "wird geladen" },
      { name: "Wortlisten (angemeldet)", sub: "sub-wortlisten", area: "wortlistenArea", platz: "wird geladen", konto: true },
    ];
    for (const sp of SPIELE) {
      const r = await spielFall({ oeffnen: pille, arg: sp.sub, area: sp.area, zeichnen: sp.zeichnen, platz: sp.platz, konto: sp.konto });
      const wartet = r.text.includes(sp.platz);
      zaehl(wartet && r.alle > 4 && r.n === r.alle && (!sp.zeichnen || r.gezeichnet) && !r.pe.length,
        "B11 " + sp.name + ": wartet auf den ganzen Wortschatz – 400 ms nach dem Öffnen alle Dateien angefordert (eilig)" + (sp.zeichnen ? ", zeichnet, sobald er ganz da ist" : ""),
        "vor dem Öffnen " + r.vorher + ", danach " + r.n + " von " + r.alle + ", Platzhalter " + (wartet ? "ja" : "NEIN: " + JSON.stringify(r.text))
        + (sp.zeichnen ? ", gezeichnet " + (r.gezeichnet ? r.zeichnenMs + " ms nach dem Blick" : "NEIN") : "") + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : ""));
    }
    {
      /* „Alle Wörter dieses Textes in eine Liste" (Lesetexte, Gespräch, Kompass): angemeldet, Text da, Wortschatz unterwegs */
      const r = await spielFall({ konto: true, oeffnen: () => {
        const k = document.createElement("div"); k.className = "question-card";
        k.innerHTML = '<p class="sammel-text">Am Morgen trinkt meine Schwester einen Kaffee und liest die Zeitung im Garten.</p><button type="button" data-text-in-liste="Sonde">Liste</button>';
        document.getElementById("view-learn").appendChild(k);
        k.querySelector("button").click();
      } });
      zaehl(/Wortschatz wird geladen/.test(r.toast) && r.alle > 4 && r.n === r.alle && !r.pe.length,
        "B11 „Alle Wörter dieses Textes in eine Liste“: wartet auf den ganzen Wortschatz – alle Dateien angefordert (eilig)",
        "vor dem Tipp " + r.vorher + ", danach " + r.n + " von " + r.alle + ", Hinweis " + JSON.stringify(r.toast) + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : ""));
    }
    {
      /* „Hörspiel mit meiner Stimme" (eigenes Aussprache-Wörterbuch): wartet mit „Das Wörterbuch lädt …" */
      const r = await spielFall({ area: "sondeHoerspiel", oeffnen: () => {
        const k = document.createElement("div");
        k.innerHTML = '<div class="eigen-spiel-start"><button type="button" data-eigen="spiel">Hörspiel</button></div><div class="eigen-spiel" id="sondeHoerspiel" hidden></div>';
        document.getElementById("view-learn").appendChild(k);
        k.querySelector("button").click();
      } });
      zaehl(r.text.includes("Das Wörterbuch lädt") && r.alle > 4 && r.n === r.alle && !r.pe.length,
        "B11 „Hörspiel mit meiner Stimme“: wartet auf den ganzen Wortschatz – alle Dateien angefordert (eilig)",
        "vor dem Tipp " + r.vorher + ", danach " + r.n + " von " + r.alle + ", " + JSON.stringify(r.text) + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : ""));
    }
    {
      const r = await spielFall({ raum: true, oeffnen: pille, arg: "sub-wortkette", area: "wortketteArea" });
      zaehl(r.text.includes("wird geschmiedet") && r.alle > 4 && r.n <= 4 && !r.pe.length,
        "B11r Wortkette im Raum (LiveChat.lage „drin“): die Reihe bleibt – höchstens 4 Dateien (Vorrang 1, die Leitung für Raum und Gespräch)",
        "vor dem Öffnen " + r.vorher + ", danach " + r.n + " von " + r.alle + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : ""));
    }
    {
      const r = await runde({ karten: ["wortstellung"], ohneTransfer: true });
      zaehl(r.vok.transfer === false && r.vok.alle > 4 && r.vok.n === r.vok.alle && r.vorWs && r.total === 10 && !r.pe.length,
        "B12 ohne transferSize (wie Safari unter 16.4): nach dem Kartentipp alle Wortschatz-Dateien zugleich wie in 888 (die Weiche sähe den Speicher nicht); die Runde wie in B1",
        "transferSize " + (r.vok.transfer ? "DA" : "fehlt") + ", " + r.vok.n + " von " + r.vok.alle + " angefordert; " + kurz(r));
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
