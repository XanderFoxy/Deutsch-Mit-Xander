#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 667: LATENZ IM KAMPF, FLÜSSIGE TIERE
   ---------------------------------------------------------------------
   XANDER: „Die Latenz ist noch schwierig wenn ich mit jemanden kämpfe
   dann kann ich ihn schwierig erreichen, ohne dass die Effekte hinterher
   hängen … die Tiere nicht mitziehen man gar nicht weiß, wohin man
   schießt, was aktuell ist".
   Gemessen: (1) vom Einschlag bis zur Treffer-Zahl, wenn der Server
   400 ms braucht; (2) Ruckler (Bilder > 50 ms) bei vierfach gedrosselter
   CPU, während Tiere angreifen und Feuer fliegt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  /* Ein Android-Telefon: Fingertipps statt Programm-Klicks — sonst merkt
     die Sonde nicht, wenn etwas über dem Knopf liegt. */
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  const konsolenFehler = [];
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 25000 });

  await pg.evaluate(() => {
    const leute = {
      uebungspuppe: { id: "uebungspuppe", name: "Puppe", seit: 5000, gesehen: 9e15, buehne: true, bild: "" },
      bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" },
      cem: { id: "cem", name: "Cem", seit: 7000, gesehen: 9e15, buehne: true, bild: "" }
    };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
    const cemId = "22222222-2222-4222-8222-222222222222";
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "cem" ? cemId : id === "ich" ? ichId : "");
    const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 200,
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille", "bogen", "laser", "huehnerwerfer", "brezel", "bierkrug", "spaetzle", "doener", "mg", "lasersalve"], mission: null, mana: 40, mana_max: 100, mitspielen: true,
                  level: 3, xp: 260, xp_stufe: 300 - 200, xp_naechste: 300, skill_frei: 1, skills: { zaehigkeit: 1 }, training: null,
                  ladung: 40, helm: 0, brust: 0, helm_stufe: 1, helm_halt: 10, brust_stufe: 0, brust_halt: 0,
                  vorraete: { bratwurst: 2, sauerkraut: 1, erz: 4 }, haustier: "fellmonster", haustier_leben: 30, haustier_max: 40, haustier_stufe: 2,
                  tiere: { fellmonster: { kraft: 30, stufe: 2 }, chihuahua: { kraft: 12, stufe: 1 }, drache: { kraft: 25, stufe: 1 } },
                  flugtier: "drache", flugtier_leben: 25, flugtier_max: 25, flugtier_stufe: 1,
                  waffen_halt: { brezel: 60, bierkrug: 10, spaetzle: 0 }, geschuetz_ladungen: 5, geschuetz_max: 16, geschuetz_stufe: 2, mauer_lp: 40, mauer_art: "holz", tag_serie: 2, geschenk_offen: true, daemon_bis: null };
    const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, haustier: "chihuahua",
                  haustier_leben: 20, haustier_max: 30, mauer_lp: 90, mauer_art: "stein", mauer_aufbau: true, haustier_stufe: 1, flugtier: "drache", flugtier_leben: 25, flugtier_max: 25, flugtier_stufe: 1, geschuetz: true, mana: 10, mana_max: 100, mitspielen: true,
                  level: 7, ladung: 60, helm: 2, brust: 1, daemon: false, zeigen: { level: true, tiere: true } };
    window.__rufe = [];
    window.__raus = [];
    window.__fallen = [];
    window.__falleAntwort = { ok: true, falle: false };
    window.LiveChat.pruefAbfangen((p) => { window.__raus.push(p); });
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args || {} });
      let data = { ok: true };
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_meine_fallen") data = window.__fallen;
      else if (name === "spiel_falle_legen") { window.__fallen = [{ platz: args.p_platz, art: args.p_art }]; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_falle_pruefen") data = window.__falleAntwort;
      else if (name === "spiel_heilen") data = Object.assign({}, ich, { ok: true, geheilt: 25, fremd: Boolean(args.p_ziel), geheilter: Object.assign({}, bea, { lp: 75 }) });
      else if (name === "spiel_trophaeen") data = window.__troph || { ok: true, liste: [], neu: [], lohn: 0 };
      else if (name === "spiel_fund_heben") data = window.__fundAntwort || { ok: true, fund: "erz" };
      else if (name === "spiel_bauen") { if (args.p_was === "reparatur") { ich.dorf.schmiede.lp = 20; ich.vorraete.erz -= 1; data = Object.assign({ ok: true, gebaut: "reparatur" }, ich); }
        else { const st = ((ich.dorf || {})[args.p_was] || {}).stufe || 0; ich.dorf = Object.assign({}, ich.dorf, { [args.p_was]: { stufe: st + 1, lp: 20 * (st + 1) } }); data = Object.assign({ ok: true, gebaut: args.p_was, stufe: st + 1 }, ich); } }
      else if (name === "spiel_dorf_abholen") data = window.__ernte || Object.assign({ ok: true, bratwurst: 4, erz: 1, xp: 0 }, ich);
      else if (name === "spiel_turm_platz") { ich.turm_platz = args.p_platz; ich.turm_raum = args.p_platz ? args.p_raum : null; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_klasse") { if ((ich.level || 1) < 5) data = { ok: false, grund: "Klassen gibt es ab Level 5" }; else { ich.klasse = args.p_klasse; data = Object.assign({ ok: true, klasse: args.p_klasse, preis: 0 }, ich); } }
      else if (name === "spiel_zeigen") { ich.zeigen = { level: Boolean(args.p_level), tiere: Boolean(args.p_tiere) }; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_mitspielen") { ich.mitspielen = Boolean(args.p_an); data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_tier_wechseln") data = Object.assign({}, ich, { ok: true, gewechselt: args.p_art, haustier: args.p_art });
      else if (name === "spiel_platzwechsel") data = { darf: true, mauer_weg: false, mauer_aufbau: true };
      else if (name === "spiel_fuettern") data = Object.assign({}, ich, { ok: true, plus: 12, welches: args.p_welches });
      else if (name === "spiel_essen") data = Object.assign({}, ich, { ok: true, geheilt: 10, gegessen: args.p_ding });
      else if (name === "spiel_wischer") data = { ok: true };
      else if (name === "spiel_tagesgeschenk") { ich.geschenk_offen = false; data = Object.assign({}, ich, { ok: true, punkte_plus: 16, bratwurst_plus: 1, serie: 3, pflaster_plus: 1 }); }
      else if (name === "spiel_seite_abholen") data = Object.assign({}, ich, { ok: true, muenzen: 4, bratwurst_plus: 0 });
      else if (name === "spiel_superkraft") { ich.ladung = 0; ich.daemon = true; ich.daemon_bis = new Date(Date.now() + 45000).toISOString(); data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_trainieren") { ich.training = { skill: args.p_skill, stufe: 1, bis: new Date(Date.now() + 300000).toISOString() }; ich.skill_frei = 0; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_graben") {
        const f = window.__fund || "nichts";
        if (f === "erz" || f === "schatz") ich.vorraete = Object.assign({}, ich.vorraete, { erz: (ich.vorraete.erz || 0) + (f === "schatz" ? 2 : 1) });
        if (f === "schatz") ich.mission = null;
        data = Object.assign({}, ich, { ok: true, fund: f, menge: f === "schatz" ? 25 : f === "muenzen" ? 3 : 1 });
      }
      else if (name === "spiel_mission") { ich.mission = window.__mission; data = { ok: true, mission: window.__mission }; }
      else if (name === "spiel_schmieden") { ich.vorraete = Object.assign({}, ich.vorraete, { erz: ich.vorraete.erz - 1 }); ich.pflaster++; data = Object.assign({ ok: true, geschmiedet: args.p_was }, ich); }
      else if (name === "spiel_diagnose_senden") data = { ok: true };
      else if (name === "spiel_kaufen") data = Object.assign({}, ich, { ok: true, gekauft: args.p_ding });
      else if (name === "spiel_aufgabe") data = { ok: true, id: 1000 + window.__rufe.length, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"], niveau: "A1" };
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: true, loesung: "gehe", gewonnen: 3, bonus: 0, mana_plus: 6, xp_plus: 6, level_vorher: 3, level: 4, fund: window.__fundLohn || null });
      else if (name === "spiel_zaubern") {
        const R = { nebel: [25, 0, 0, 15], erdbeben: [35, 10, 25, 6], orkan: [50, 15, 0, 10] }[args.p_zauber];
        ich.mana -= R[0];
        data = { ok: true, zauber: args.p_zauber, schaden: R[1], abgewehrt: 0, mauer_riss: R[2], dauer: R[3], kaputt: false, lohn: 1,
                 ziel: Object.assign({}, bea, { lp: bea.lp - R[1] }), ich_voll: Object.assign({}, ich) };
      }
      else if (name === "spiel_fusion") { window.__fusionArgs = args; const fr = { feuerfuchs: ["fuchs", "phoenix"] }[args.p_rezept]; const t = Object.assign({}, ich.tiere); fr.forEach((a) => delete t[a]); t[args.p_rezept] = { kraft: 38, stufe: 1 }; ich.tiere = t; ich.haustier = args.p_rezept; ich.haustier_leben = 38; ich.haustier_max = 38; ich.haustier_stufe = 1; ich.punkte -= 200; data = Object.assign({ ok: true, fusion: args.p_rezept }, ich); }
      else if (name === "spiel_treffer") data = { ok: true, zone: "koerper", schaden: 8, abgewehrt: 0, kaputt: false,
        ziel: Object.assign({}, bea, { lp: 42 }), ich: Object.assign({}, ich, { lp: 94 }), gegenwehr: 6,
        gegen_geschuetz: 4, gegen_tier: 2, tier: "fellmonster", lohn: 1, waffe: args.p_waffe };
      const warte = name === "spiel_treffer" ? (window.__serverMs || 0) : 0;
      return new Promise((ok) => setTimeout(() => ok({ data: data, error: null }), warte));
    } };
    const cem = { id: cemId, name: "Cem", lp: 100, lp_max: 100, kaputt: false, mitspielen: false };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich,
      stand: { [ichId]: ich, [beaId]: bea, [cemId]: cem }, letzterAbruf: Date.now() });
    window.__ich = ich;
    /* Ohne Anmeldung ist die Chat-Eingabe versteckt; hier spielt ein Angemeldeter. */
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    window.DMA_TONLOG = [];
    window.__hinweise = [];
    window.DMA_SPIEL_BRUECKE = window.DMA_SPIEL_BRUECKE || {};
    const altToast = window.DMA_SPIEL_BRUECKE.toast;
    window.DMA_SPIEL_BRUECKE.toast = (t) => { window.__hinweise.push(t); try { if (altToast) altToast(t); } catch (e) {} };
    /* Ab Fassung 645 meldet sich das Spiel in einer eigenen Zeile. */
    window.__spielMeldungen = window.__hinweise;
  });
  await pg.waitForTimeout(800);

  const tick = (ms) => pg.waitForTimeout(ms);
  const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  const seite = (chat) => pg.evaluate((c) => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + c + '"] .lc-kreis'); if (!k) return null; const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, chat);
  pg.on("dialog", (d) => d.accept());

  console.log("\nVOM EINSCHLAG BIS ZUR ZAHL (Server 400 ms)\n");
  await pg.evaluate(() => { window.__serverMs = 400; window.__ich.waffen.push("bogen"); const S = window.DMA_SPIEL.pruef.zustand(); S.waffe = "bogen";
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis'); k.scrollIntoView({ block: "center", behavior: "instant" }); });
  await tick(300);
  const messen = async () => pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef;
    window.__raus.length = 0;
    const knopf = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    const t0 = performance.now();
    let zahlBei = 0, gesendetBei = 0;
    const altPush = window.__raus.push.bind(window.__raus);
    window.__raus.push = (x) => { if (x && x.ereignis === "treffer" && !gesendetBei) gesendetBei = performance.now(); return altPush(x); };
    const mo = new MutationObserver((l) => l.forEach((m) => m.addedNodes.forEach((n) => { if (!zahlBei && n.classList && n.classList.contains("sp-zahl")) zahlBei = performance.now(); })));
    mo.observe(document.body, { childList: true, subtree: true });
    const flug = P.tippAufPlatz(knopf, { id: "bea", name: "Bea", nummer: Number(knopf.dataset.lcPlatz), leer: false }, null);
    await new Promise((r) => setTimeout(r, 2500));
    mo.disconnect();
    const schuss = window.__raus.find((p) => p.ereignis === "schuss"), treffer = window.__raus.find((p) => p.ereignis === "treffer");
    delete window.__raus.push;
    return { zahlNach: Math.round(zahlBei - t0), gesendetNach: Math.round(gesendetBei - t0), flug: schuss ? P.flugzeit("bogen") : -1 };
  });
  const m1 = await messen();
  const m2 = await messen();
  const spaet = Math.max(m1.zahlNach - m1.flug, m2.zahlNach - m2.flug);
  console.log("   Messung", JSON.stringify([m1, m2]));
  sage(spaet <= 120, "die Treffer-Zahl kommt mit dem Einschlag, nicht eine Server-Runde später (≤ 120 ms)", "Verspätung " + spaet + " ms");
  const sendSpaet = Math.max(m1.gesendetNach - m1.flug, m2.gesendetNach - m2.flug);
  sage(sendSpaet <= 120, "die Treffer-Meldung geht im Moment des Einschlags an die anderen (dort landet ihr Geschoss gleichzeitig)", "Verspätung " + sendSpaet + " ms");

  console.log("\nRUCKLER BEI GEDROSSELTER CPU\n");
  const cdp = await pg.context().newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(process.env.DROSSEL || 8) });
  if (process.env.LEER) await pg.evaluate(() => { window.__leer = true; });
  if (process.env.NUR) await pg.evaluate((n) => { window.__nur = n; }, process.env.NUR);
  if (process.env.CSSTEST) await pg.addStyleTag({ content: process.env.CSSTEST });
  if (process.env.OHNEFILTER) await pg.addStyleTag({ content: "*{filter:none!important;backdrop-filter:none!important}" });
  if (process.env.OHNESCHATTEN) await pg.addStyleTag({ content: "*{box-shadow:none!important;text-shadow:none!important}" });
  if (process.env.OHNEMIX) await pg.addStyleTag({ content: "*{mix-blend-mode:normal!important}" });
  if (process.env.PROFIL) { await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval", { interval: 200 }); await cdp.send("Profiler.start"); }
  const ruck = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef;
    const zeiten = []; let letzt = performance.now(), laeuft = true;
    const schleife = (t) => { zeiten.push(t - letzt); letzt = t; if (laeuft) requestAnimationFrame(schleife); };
    requestAnimationFrame(schleife);
    const nur = window.__nur;
    if (nur === "phoenix") P.tierAngriff("bea", "ich", "phoenix");
    else if (nur === "drache") P.tierAngriff("bea", "ich", "drache");
    else if (nur === "fell") P.tierAngriff("ich", "bea", "fellmonster");
    else if (nur === "schuss") P.geschossZeigen("bea", "ich", "bogen", 0, 0);
    else if (nur === "daemon") P.trefferZeigen("ich", { zone: "kopf", schaden: 12, daemon: true });
    else if (!window.__leer) {
    P.tierAngriff("bea", "ich", "phoenix");
    P.tierAngriff("bea", "ich", "drache");
    P.tierAngriff("ich", "bea", "fellmonster");
    P.geschossZeigen("bea", "ich", "bogen", 0, 0);
    P.trefferZeigen("ich", { zone: "kopf", schaden: 12, daemon: true });
    }
    await new Promise((r) => setTimeout(r, 3600));
    laeuft = false;
    const lang = zeiten.filter((z) => z > 50).length, schlimm = zeiten.filter((z) => z > 100).length;
    const sort = zeiten.slice(1).sort((a, b) => a - b);
    return { bilder: zeiten.length, ueber50: lang, ueber100: schlimm, median: Math.round(sort[Math.floor(sort.length / 2)]), max: Math.round(sort[sort.length - 1]), sparsam: P.takt().sparsam };
  });
  if (process.env.PROFIL) {
    const { profile } = await cdp.send("Profiler.stop");
    const selbst = {}; const dt = profile.timeDeltas; const id2 = {}; profile.nodes.forEach((n) => { id2[n.id] = n; });
    profile.samples.forEach((sid, i) => { const n = id2[sid]; const k = (n.callFrame.functionName || "(anon)") + " " + (n.callFrame.url || "").split("/").pop() + ":" + n.callFrame.lineNumber; selbst[k] = (selbst[k] || 0) + (dt[i] || 0); });
    console.log(Object.entries(selbst).sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k, v]) => "   " + Math.round(v / 1000) + " ms  " + k).join("\n"));
  }
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  console.log("   Ruckler", JSON.stringify(ruck));
  sage(ruck.ueber100 <= 3 && (process.env.NUR || process.env.LEER || ruck.sparsam), "achtfach langsame CPU: das Spiel merkt es selbst, spart Teilchen, kaum grobe Ruckler", JSON.stringify(ruck));

  console.log("\nMAUERN ALS BOGEN UNTER DEM RING\n");
  const bilder = [];
  for (const [art, brust] of [["holz", 0], ["stein", 0], ["stahl", 0], ["titan", 0], ["diamant", 0], ["holz", 1], ["stein", 1], ["stahl", 1], ["titan", 1], ["diamant", 1]]) {
    const m = await pg.evaluate(([art, brust]) => {
      const P = window.DMA_SPIEL.pruef, S = P.zustand();
      Object.keys(S.stand).forEach((id) => { if (S.stand[id].name === "Bea") S.stand[id] = Object.assign({}, S.stand[id], { mauer_lp: 60, mauer_art: art, mauer_aufbau: false, brust: brust }); });
      P.zeichnen();
      const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'), k = pl.querySelector(".lc-kreis");
      k.scrollIntoView({ block: "center", behavior: "instant" });
      const m = pl.querySelector(".sp-mauer svg"); if (!m) return null;
      const kr = k.getBoundingClientRect(), mr = m.querySelector("path").ownerSVGElement.getBBox(), sr = m.getBoundingClientRect();
      /* Ober-/Unterkante der Zeichnung in Bildschirm-Punkten */
      const skala = sr.width / 100;
      return { kl: m.parentNode.className, fill: (m.querySelector("path[fill]") || {}).getAttribute ? m.querySelector("path[fill]").getAttribute("fill") : "", art, oben: Math.round(sr.top + mr.y * skala - kr.top), unten: Math.round(sr.top + (mr.y + mr.height) * skala - kr.top), kreisH: Math.round(kr.height),
               links: Math.round(sr.left + mr.x * skala - kr.left), breit: Math.round(mr.width * skala) };
    }, [art, brust]);
    m.brust = brust;
    bilder.push(m);
    const box = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]').getBoundingClientRect(); return { x: r.left - 6, y: r.top - 6, width: r.width + 12, height: r.height + 12 }; });
    await pg.screenshot({ path: "/tmp/claude-0/p-667-mauer-" + art + brust + ".png", clip: box });
  }
  console.log("   " + JSON.stringify(bilder));
  /* Der Bogen liegt unten außen am Ring: beginnt unterhalb der Bildmitte, reicht knapp unter den Kreis. */
  sage(bilder.every((b) => b && b.oben > b.kreisH * 0.6 && b.unten <= b.kreisH * 1.11 && b.unten > b.kreisH * 0.98), "alle fünf Mauern als Bogen unten am Ring (mit und ohne Brustpanzer), Gesicht frei", JSON.stringify(bilder.map((b) => b && [b.art + b.brust, b.oben, b.unten, b.kreisH])));

  console.log("\nDER ORKAN\n");
  await pg.evaluate(() => { window.DMA_TONLOG = []; const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis'); k.scrollIntoView({ block: "center", behavior: "instant" });
    window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "orkan", von: "ich", zielChat: "bea", schaden: 15, dauer: 10 }); });
  const lagen = [];
  for (const [ms, name] of [[500, "a"], [700, "b"], [700, "c"], [2200, "d"]]) {
    await tick(ms);
    lagen.push(await pg.evaluate(() => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis'); const r = k.getBoundingClientRect(); const cs = getComputedStyle(k);
      return { y: Math.round(r.top), x: Math.round(r.left), op: Number(cs.opacity), trichter: document.querySelectorAll(".sp-orkan .sp-orkan-strudel").length, truemmer: document.querySelectorAll(".sp-orkan-truemmer").length }; }));
    const box = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]').getBoundingClientRect(); return { x: Math.max(0, r.left - 60), y: Math.max(0, r.top - 120), width: r.width + 120, height: r.height + 180 }; });
    if (name !== "d") await pg.screenshot({ path: "/tmp/claude-0/p-667-orkan-" + name + ".png", clip: box });
  }
  console.log("   " + JSON.stringify(lagen));
  sage(lagen[0].trichter === 11 && lagen[0].truemmer === 9, "Trichter aus 11 drehenden Luftringen, 9 kreisende Trümmer", JSON.stringify(lagen[0]));
  sage(lagen.slice(0, 3).every((l) => l.op > 0.9) && Math.min(lagen[0].y, lagen[1].y, lagen[2].y) < lagen[3].y - 15 && new Set(lagen.slice(0, 3).map((l) => l.x)).size > 1,
    "der Getroffene bleibt sichtbar, wird hochgehoben und herumgewirbelt, landet wieder", JSON.stringify(lagen.map((l) => [l.x, l.y, l.op])));
  sage(await pg.evaluate(() => (window.DMA_TONLOG || []).some((t) => t.name === "orkan")), "man hört den Orkan");

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 667: " + fehler + " rot." : "Fassung 667 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
