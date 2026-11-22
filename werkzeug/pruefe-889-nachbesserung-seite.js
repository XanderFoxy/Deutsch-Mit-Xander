/* =====================================================================
   SONDE 889 NACHBESSERUNG, TEIL S — die echte Seite (Chromium, min/ wie
   ausgeliefert). Aufgerufen von werkzeug/pruefe-889-nachbesserung.js
   (NUR=S). Der Prüfserver kann die Wortschatz-Dateien (vokabeln/*.js)
   zurückhalten, bis die Sonde sie freigibt. Nichts geht nach draußen.

     S1 „Wortschatz“ mit „Alle Themen“ (Vorgabe der Karte), der ganze
        Wortschatz schon da: der Tipp auf die Karte friert die Seite nicht
        ein (längste Aufgabe unter 2 s, „Runde starten“ bereit unter 5 s),
        die Runde kommt (10 Fragen) – in 888 minutenlang eingefroren
     S2 dieselbe Karte im Raum (LiveChat.lage „drin“), Wortschatz noch
        unterwegs: nach dem Kartentipp höchstens 4 Wortschatz-Dateien
        angefordert (die Reihe bleibt – wortschatzEilig statt eilig); die
        Runde mit Thema kommt trotzdem, sobald der Wortschatz ganz da ist
     S3 Vokabelmeister: nach der Wahl des Buchstabens alle Wortschatz-
        Dateien angefordert (eilig, wie die anderen Spiele, die ihn ganz
        brauchen); ein Wort, das vor dem ganzen Wortschatz „❔“ bekam,
        steht nach der nächsten Eingabe als „✅“ da
   Gegenprobe: WURZEL=<Baum aus 2260d4d0, 889 vor dieser Nachbesserung> → alle
   fünf rot; WURZEL=<Baum mit 888> → S1 (eingefroren, Frist 30 s), S2 (läuft
   nicht durch: dort wartet die Karte auf den zurückgehaltenen Wortschatz)
   und S3 „❔ → ✅“ rot – S3 „alle angefordert“ ist dort grün (888 lädt
   ohnehin alles zugleich).
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http");

async function teilS(WURZEL, sage) {
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
    ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".gif": "image/gif" };
  const S = { halten: false, wartend: [] };
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    const senden = () => { a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(a); };
    if (/^\/vokabeln\//.test(p) && S.halten) S.wartend.push(senden); else senden();
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const BASIS = "http://127.0.0.1:" + srv.address().port;
  let br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const freigeben = () => { S.halten = false; S.wartend.splice(0).forEach((f) => f()); };
  const frist = (ms) => new Promise((r) => setTimeout(() => r("FRIST"), ms));
  const seite = async (o) => {
    o = o || {};
    S.halten = Boolean(o.halten); S.wartend = [];
    const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await ctx.addInitScript(() => {
      try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {}
      window.__lang = [];
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lang.push({ t: e.startTime, d: e.duration }))).observe({ type: "longtask", buffered: true }); } catch (e) {}
    });
    const pg = await ctx.newPage();
    const pe = [];
    pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
    await pg.goto(BASIS + "/index.html", { waitUntil: "load", timeout: 60000 });
    await pg.waitForFunction(() => typeof ExerciseData !== "undefined" && window.LiveChat && document.readyState !== "loading"
      && document.querySelector('.tape-tab[data-target="view-learn"]'), null, { timeout: 30000 });
    await pg.waitForTimeout(1000);
    if (o.profil) await pg.evaluate(() => { const p = { id: "pruef", name: "Prüf", points: 999, trophies: [], badges: [], giftedCategories: [], extraProfileData: {} }; Backend.currentProfile = () => p; });
    if (o.raum) await pg.evaluate(() => { window.LiveChat.lage = () => ({ lage: "drin" }); });
    await pg.click('.tape-tab[data-target="view-learn"]');
    await pg.waitForFunction(() => { const g = document.querySelector("#exerciseSetup .category-grid .category-card"); return g && g.offsetParent !== null; }, null, { timeout: 30000 });
    return { ctx, pg, pe };
  };
  const anzahl = (pg) => pg.evaluate(() => ({ n: document.querySelectorAll('script[src*="vokabeln/"]').length, alle: VocabData.themenListe().length, ganz: VocabData.alleThemenDa() }));
  const karteTippen = (pg, k) => pg.evaluate((k) => { const e = document.querySelector('#exerciseSetup .category-card[data-cat="' + k + '"] .cat-checkbox'); e.scrollIntoView({ block: "center" }); e.click(); }, k);
  const startBereit = (pg, k) => pg.waitForFunction((k) => { const b = document.getElementById("startBtn"); return b && !b.disabled && document.querySelector('#exerciseSetup .category-card.selected[data-cat="' + k + '"]'); }, k, { timeout: 60000 });
  const rundeStarten = async (pg, ms) => {
    await pg.evaluate(() => { window.__frage = null; const e = document.getElementById("startBtn"); e.scrollIntoView({ block: "center" }); e.click(); });
    return pg.waitForFunction(() => { const k = document.querySelector("#exercisePlay .question-card"); return k && k.offsetParent !== null; }, null, { timeout: ms })
      .then(() => pg.evaluate(() => ({ total: Quiz.progress ? Quiz.progress().total : null, ganz: VocabData.alleThemenDa() })), () => null);
  };

  try {
    /* S2 — im Raum bleibt die Reihe */
    {
      const s = await seite({ halten: true, profil: true, raum: true });
      try {
        await karteTippen(s.pg, "wortschatz");
        await startBereit(s.pg, "wortschatz");
        await s.pg.waitForTimeout(400);
        const a = await anzahl(s.pg);
        await s.pg.evaluate((t) => { const e = document.querySelector('[data-wortschatztopic="' + t + '"]'); e.scrollIntoView({ block: "center" }); e.click(); }, "Essen & Trinken");
        await s.pg.waitForFunction((t) => { const b = document.querySelector('[data-wortschatztopic="' + t + '"]'); const s = document.getElementById("startBtn"); return b && b.getAttribute("aria-selected") === "true" && s && !s.disabled; }, "Essen & Trinken", { timeout: 30000 });
        freigeben();
        const r = await rundeStarten(s.pg, 60000);
        sage(a.alle > 4 && a.n <= 4 && r && r.total === 10 && r.ganz && !s.pe.length,
          "S2 „Wortschatz“ im Raum: die Reihe bleibt (nach dem Kartentipp höchstens 4 Dateien), die Runde mit Thema kommt, sobald er ganz da ist",
          "nach dem Kartentipp " + a.n + " von " + a.alle + " angefordert; Runde " + JSON.stringify(r) + (s.pe.length ? ", Fehler: " + s.pe.join(" | ") : ""));
      } catch (e) { sage(false, "S2 „Wortschatz“ im Raum lief nicht durch", String(e.message || e).slice(0, 160)); } finally { await s.ctx.close(); }
    }
    /* S3 — Vokabelmeister */
    {
      const s = await seite({ halten: true });
      try {
        const { pg } = s;
        await pg.evaluate(() => { Backend.isFeatureOn = () => true; Backend.isFeatureOnDefaultTrue = () => true; });
        const vorher = await anzahl(pg);
        await pg.evaluate(() => { const e = document.querySelector('#learnSubnav [data-sub="sub-vokabelmeister"]'); e.click(); });
        await pg.waitForFunction(() => document.querySelector('[data-vm-letter="T"]'), null, { timeout: 15000 });
        await pg.evaluate(() => document.querySelector('[data-vm-letter="T"]').click());
        await pg.waitForFunction(() => document.getElementById("vmWordInput"), null, { timeout: 15000 });
        await pg.waitForTimeout(400);
        const a = await anzahl(pg);
        const KAND = ["Tischler", "Tischbein", "Tischtuch", "Teekanne", "Tankstelle", "Taschenlampe", "Tageslicht", "Teppich"];
        const wort = await pg.evaluate((k) => k.find((w) => !window.DMA_PRUEFUNG.vokabelWort(w)) || null, KAND);
        const tippe = async (w) => {
          await pg.evaluate(() => { const i = document.getElementById("vmWordInput"); i.focus(); i.value = ""; });
          await pg.keyboard.type(w, { delay: 5 });
          await pg.keyboard.press("Enter");
          await pg.waitForTimeout(250);
        };
        const zeilen = () => pg.evaluate(() => [...document.querySelectorAll("#vokabelmeisterArea .breakdown-row span")].map((e) => e.textContent.trim()));
        let z1 = [], z2 = [], nachher = null, kennt = null;
        if (wort) {
          await tippe(wort);
          z1 = await zeilen();
          freigeben();
          await pg.waitForFunction(() => VocabData.alleThemenDa(), null, { timeout: 60000 }).catch(() => {});
          kennt = await pg.evaluate((w) => window.DMA_PRUEFUNG.vokabelWort(w), wort);
          await tippe("Tomate");
          z2 = await zeilen();
          nachher = await anzahl(pg);
        } else freigeben();
        sage(a.alle > 4 && vorher.n <= 4 && a.n === a.alle && !s.pe.length,
          "S3 Vokabelmeister: nach der Wahl des Buchstabens alle Wortschatz-Dateien angefordert (eilig, wie die anderen Spiele, die ihn ganz brauchen)",
          "vor dem Öffnen " + vorher.n + ", danach " + a.n + " von " + a.alle + (s.pe.length ? ", Fehler: " + s.pe.join(" | ") : ""));
        sage(Boolean(wort) && kennt === true && z1.includes("❔ " + wort) && z2.includes("✅ " + wort) && nachher && nachher.ganz,
          "S3 Vokabelmeister: ein Wort, das vor dem ganzen Wortschatz „❔“ bekam, ist nach der nächsten Eingabe „✅“",
          "Wort " + JSON.stringify(wort) + " (im ganzen Wörterbuch: " + kennt + "), vorher " + JSON.stringify(z1) + ", nachher " + JSON.stringify(z2));
      } catch (e) { freigeben(); sage(false, "S3 Vokabelmeister lief nicht durch", String(e.message || e).slice(0, 160)); } finally { await s.ctx.close(); }
    }
    /* S1 — „Alle Themen“ mit dem ganzen Wortschatz (zuletzt: in 888 friert die Seite ein, der Browser wird dann beendet) */
    {
      const s = await seite({ profil: true });
      let ctxZu = false;
      try {
        await s.pg.evaluate(() => { if (VocabData.eilig) VocabData.eilig(); return VocabData.ladeWoerter(); });
        await s.pg.waitForFunction(() => VocabData.alleThemenDa(), null, { timeout: 60000 });
        await s.pg.waitForTimeout(500);
        const t0 = Date.now();
        await s.pg.evaluate(() => { window.__lang.length = 0; });
        const tipp = await Promise.race([karteTippen(s.pg, "wortschatz").then(() => startBereit(s.pg, "wortschatz")).then(() => "ok", (e) => "fehler " + String(e.message || e).slice(0, 80)), frist(30000)]);
        const bereitMs = Date.now() - t0;
        if (tipp === "FRIST") {
          sage(false, "S1 „Wortschatz – Alle Themen“ mit dem ganzen Wortschatz: der Kartentipp friert die Seite nicht ein", "nach 30 s noch nicht bereit (eingefroren)");
          sage(false, "S1 … und die Runde kommt", "nicht versucht");
          await br.close().catch(() => {}); ctxZu = true; br = null;
        } else {
          const lang = await s.pg.evaluate(() => Math.round(Math.max(0, ...window.__lang.map((e) => e.d))));
          const thema = await s.pg.evaluate(() => { const b = document.querySelector('[data-wortschatztopic][aria-selected="true"]'); return b ? b.getAttribute("data-wortschatztopic") : null; });
          sage(tipp === "ok" && bereitMs < 5000 && lang < 2000 && (thema === "" || thema === null),
            "S1 „Wortschatz – Alle Themen“ mit dem ganzen Wortschatz: der Kartentipp friert die Seite nicht ein",
            "„Runde starten“ bereit nach " + bereitMs + " ms, längste Aufgabe " + lang + " ms, Thema " + JSON.stringify(thema) + " (" + tipp + ")");
          const t1 = Date.now();
          const r = await Promise.race([rundeStarten(s.pg, 30000), frist(35000)]);
          sage(r && r !== "FRIST" && r.total === 10 && !s.pe.length, "S1 … und die Runde kommt (10 Fragen)",
            (r === "FRIST" ? "eingefroren" : JSON.stringify(r)) + ", " + (Date.now() - t1) + " ms" + (s.pe.length ? ", Fehler: " + s.pe.join(" | ") : ""));
          if (r === "FRIST") { await br.close().catch(() => {}); ctxZu = true; br = null; }
        }
      } catch (e) { sage(false, "S1 „Alle Themen“ lief nicht durch", String(e.message || e).slice(0, 160)); } finally { if (!ctxZu) await s.ctx.close().catch(() => {}); }
    }
  } finally {
    if (br) await br.close().catch(() => {});
    srv.close();
  }
}
module.exports = { teilS };
