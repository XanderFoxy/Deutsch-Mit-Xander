#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 764: FUNK 184 (DORF)
   ---------------------------------------------------------------------
   XANDER: „wenn man auf Sehenswürdigkeiten geht dann werden die Buttons
   ein bisschen größer … und überdecken die darunter liegende Überschrift"
   · „kann man das irgendwie anpassen dass man nicht so sein ganzes Brot
   verkauft" · „warum kann ich meinen Fernsehturm nicht in meinem Dorf
   sehen … kann ich mir mittlerweile bestimmen wo ich das hinstelle".
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
      if (window.__extra && window.__extra[name]) return Promise.resolve({ data: window.__extra[name](args || {}, ich), error: null });
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_meine_fallen") data = window.__fallen;
      else if (name === "spiel_falle_legen") { window.__fallen = [{ platz: args.p_platz, art: args.p_art }]; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_falle_pruefen") data = window.__falleAntwort;
      else if (name === "spiel_heilen") data = Object.assign({}, ich, { ok: true, geheilt: 25, fremd: Boolean(args.p_ziel), geheilter: Object.assign({}, bea, { lp: 75 }) });
      else if (name === "spiel_trophaeen") data = window.__troph || { ok: true, liste: [], neu: [], lohn: 0 };
      else if (name === "spiel_verkaufen") { ich.waffen = ich.waffen.filter((w) => w !== args.p_ding); ich.punkte += 27; data = Object.assign({ ok: true, verkauft: args.p_ding, erloes: 27 }, ich); }
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
      return Promise.resolve({ data: data, error: null });
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
    const altTon = window.DMA_SPIEL_BRUECKE.ton;
    window.DMA_SPIEL_BRUECKE.ton = (n, l) => { window.DMA_TONLOG.push({ name: n, wann: Math.round(performance.now()), weg: "ersatz" }); try { if (altTon) altTon(n, l); } catch (e) {} };
    /* Ab Fassung 645 meldet sich das Spiel in einer eigenen Zeile. */
    window.__spielMeldungen = window.__hinweise;
  });
  await pg.waitForTimeout(800);

  const tick = (ms) => pg.waitForTimeout(ms);
  const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  const tippe = async (sel) => { await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: "nearest" }); }, sel); const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  const seite = (chat) => pg.evaluate((c) => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + c + '"] .lc-kreis'); if (!k) return null; const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, chat);


  const meld = () => pg.evaluate(() => window.__hinweise.filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "");


  const zuletzt = () => pg.evaluate(() => window.__hinweise.slice(-1)[0] || "");

  await pg.evaluate(() => {
    const ich = window.__ich, jetzt = Date.now();
    ich.level = 13; ich.punkte = 1500; ich.mana = 60;
    ich.dorf = { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, schule: { stufe: 1, lp: 20 }, bibliothek: { stufe: 1, lp: 20 }, labor: { stufe: 1, lp: 20 } };
    ich.werk = {};
    ich.dorf_ab = new Date(jetzt - 5 * 3600000).toISOString();
    ich.volk = { arbeiter: 16, ritter: 0, quote: 80, berufe: { bauer: 2, wissenschaftler: 3 }, forschung: 100 };
    ich.vorraete = Object.assign({}, ich.vorraete, { erz: 30, quarz: 20, gold: 3, holz: 12, brot: 10, fisch: 5, bratwurst: 5 });
    const FK = { dreifelder: 20, sauerteig: 30, wassermuehle: 40, buchdruck: 60, duden: 80, dampf: 120 };
    const WD = { holstentor: [4, 250, { holz: 10, erz: 5 }], brandenburger: [8, 500, { erz: 10, quarz: 6 }], koelner_dom: [12, 900, { erz: 20, quarz: 10, gold: 2 }],
                 neuschwanstein: [16, 1400, { quarz: 25, gold: 5, holz: 10 }], fernsehturm: [20, 2000, { erz: 30, silizium: 4, chip: 2 }] };
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_markt_preise: () => ({ ok: true, preise: {} }),
      spiel_angebote_liste: () => ({ ok: true, angebote: [] }),
      spiel_erforschen: (a) => { if ((ich.volk.forschung || 0) < FK[a.p_was]) return { ok: false, grund: "zu wenig Forschung" };
        ich.volk = Object.assign({}, ich.volk, { forschung: ich.volk.forschung - FK[a.p_was], erforscht: (ich.volk.erforscht || []).concat([a.p_was]) });
        return Object.assign({ ok: true, erforscht: a.p_was }, JSON.parse(JSON.stringify(ich))); },
      spiel_wunder_bauen: (a) => { const d = WD[a.p_was]; if (ich.level < d[0]) return { ok: false, grund: "ab Level " + d[0] };
        ich.punkte -= d[1]; Object.keys(d[2]).forEach((x) => { ich.vorraete[x] -= d[2][x]; });
        ich.volk = Object.assign({}, ich.volk, { wunder: Object.assign({}, ich.volk.wunder, { [a.p_was]: new Date().toISOString() }) });
        return Object.assign({ ok: true, wunder: a.p_was }, JSON.parse(JSON.stringify(ich))); }
    });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false; S.dorfTeil = "";
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  await pg.evaluate(() => {
    const W = { koelner_dom: "2026-09-27T09:00:00Z", fernsehturm: "2026-09-27T09:41:00Z" };
    window.__ich.volk = Object.assign({}, window.__ich.volk, { wunder: W, wunder_platz: {} });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.volk = JSON.parse(JSON.stringify(window.__ich.volk));
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_markt: (a, ich) => { const n = a.p_menge || ich.vorraete[a.p_ware]; ich.vorraete[a.p_ware] -= n; ich.punkte += n * 6; return Object.assign({ ok: true, ware: a.p_ware, menge: n, erloes: n * 6, rang: n * 6 }, JSON.parse(JSON.stringify(ich))); },
      spiel_wunder_platz: (a, ich) => { const pl = Object.assign({}, ich.volk.wunder_platz || {}); let alt = null; Object.keys(pl).forEach((k) => { if (pl[k] === a.p_platz && k !== a.p_was) alt = k; });
        if (alt) delete pl[alt]; pl[a.p_was] = a.p_platz; ich.volk = Object.assign({}, ich.volk, { wunder_platz: pl });
        return Object.assign({ ok: true, wunder: a.p_was, platz: a.p_platz, getauscht: alt }, JSON.parse(JSON.stringify(ich))); } });
  });

  console.log("\nKNÖPFE ÜBERDECKEN NICHTS MEHR\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
  for (const t of ["markt", "wunder"]) {
    await pg.evaluate((t) => document.querySelector('.sp-schnellmenue .sp-dorf-auf [data-t="' + t + '"]').scrollIntoView({ block: "center" }), t); await tick(150);
    /* Das Menü gleitet nach dem Scrollen noch ~60 ms nach – erst dann tippen. */
    await tick(600);
    await tippe('.sp-schnellmenue .sp-dorf-auf [data-t="' + t + '"]'); await tick(400);
    const r = await pg.evaluate(() => { const box = document.querySelector(".sp-schnellmenue .sp-dorf-auf"), an = box.querySelector(".sp-an"), n = box.nextElementSibling;
      const a = an.getBoundingClientRect(), q = n.getBoundingClientRect(), sh = getComputedStyle(an).boxShadow;
      return { luft: Math.round(q.top - box.getBoundingClientRect().bottom), innen: /inset/.test(sh), zuBreit: [...box.querySelectorAll("button")].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent), text: an.textContent }; });
    sage(r.luft >= 8 && r.innen && !r.zuBreit.length, "„" + r.text.trim() + "“ aktiv: goldener Rand innen, " + r.luft + " px Luft bis zur Überschrift, keine Beschriftung abgeschnitten", JSON.stringify(r));
  }

  console.log("\nVERKAUFEN MIT MENGE\n");
  await pg.evaluate(() => { window.__ich.vorraete.brot = 12; const S = window.DMA_SPIEL.pruef.zustand(); S.ich.vorraete = Object.assign({}, S.ich.vorraete, { brot: 12 }); S.dorfTeil = "markt"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);
  let r = await pg.evaluate(() => ({ mengen: document.querySelectorAll('.sp-schnellmenue [data-s="markt"]').length, ware: (document.querySelector('.sp-schnellmenue [data-s="marktwahl"][data-w="brot"]') || {}).textContent }));
  sage(r.mengen === 0 && /Brot verkaufen\s*12 da/.test(r.ware), "am Anfang nur „Brot verkaufen · 12 da · … je Stück“ – ein Tipp verkauft noch nichts", JSON.stringify(r));
  await pg.evaluate(() => document.querySelector('.sp-schnellmenue [data-s="marktwahl"][data-w="brot"]').scrollIntoView({ block: "center" })); await tick(100);
  await tippe('.sp-schnellmenue [data-s="marktwahl"][data-w="brot"]'); await tick(300);
  r = await pg.evaluate(() => [...document.querySelectorAll('.sp-schnellmenue [data-s="markt"][data-w="brot"]')].map((b) => { const q = b.getBoundingClientRect(); const m = document.querySelector(".sp-schnellmenue").getBoundingClientRect(); return [b.dataset.n, b.textContent, Math.round(q.height), q.right <= m.right - 4 && b.scrollWidth <= b.clientWidth + 1]; }));
  sage(r.map((x) => x[0]).join() === "1,5,10,12" && r.every((x) => x[2] >= 30 && x[3]) && /alle 12/.test(r[3][1]), "Mengen 1× · 5× · 10× · alle 12 (je ≥ 30 px, ganz im Menü, nichts abgeschnitten)", JSON.stringify(r));
  if (process.env.BILD) { await pg.evaluate(() => document.querySelector(".sp-markt-mengen").scrollIntoView({ block: "center" })); await pg.screenshot({ path: process.env.BILD + "-markt.png" }); }
  await pg.evaluate(() => { window.__rufe.length = 0; }); 
  await tippe('.sp-schnellmenue [data-s="markt"][data-w="brot"][data-n="5"]'); await tick(400);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_markt").map((x) => x.args), brot: window.DMA_SPIEL.pruef.zustand().ich.vorraete.brot, hin: window.__hinweise.slice(-1)[0] }));
  sage(r.ruf.length === 1 && r.ruf[0].p_menge === 5 && r.brot === 7 && /5 Brot verkauft/.test(r.hin), "Tipp auf 5×: spiel_markt(brot, 5) – 7 Brot bleiben", JSON.stringify(r));

  console.log("\nWAHRZEICHEN IM DORFBILD, PLATZ WÄHLBAR\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfTeil = ""; window.DMA_SPIEL.pruef.schnellZeichnen(true); document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "start" }); });
  await tick(600);
  const lage = () => pg.evaluate(() => { const land = document.querySelector(".sp-dorfland").getBoundingClientRect();
    return [...document.querySelectorAll(".sp-dorfland .sp-dl-wunder")].map((e) => { const b = e.getBoundingClientRect(); return { w: e.dataset.w, x: Math.round((b.left + b.width / 2 - land.left) / land.width * 320), boden: Math.round((b.bottom - land.top) / land.height * 200) }; }); });
  r = await lage();
  sage(r.length === 2 && r[0].w === "koelner_dom" && r[1].w === "fernsehturm" && r.every((x) => x.boden >= 194 && x.boden <= 200), "Kölner Dom und Fernsehturm stehen im Dorfbild unten auf der Wiese (Fassung 768: Boden bei y ≈ 197)", JSON.stringify(r));
  sage(Math.abs(r[0].x - 84) <= 4 && Math.abs(r[1].x - 300) <= 4, "ohne Wahl: die ersten freien Plätze von links (1 und 2)", JSON.stringify(r));
  const unter = await pg.evaluate(() => { const e = document.querySelector('.sp-dl-wunder[data-w="fernsehturm"]'), b = e.getBoundingClientRect(), n = document.querySelector(".sp-dl-ueber");
    const vor = e.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING; return { vorUeber: !!vor, h: Math.round(b.height) }; });
  sage(unter.vorUeber, "die Wahrzeichen liegen unter der Nacht- und Wetterebene (wie die gemalten Häuser)", JSON.stringify(unter));
  if (process.env.BILD) await (await pg.$(".sp-dl-fenster")).screenshot({ path: process.env.BILD + "-dorf.png" });
  await tippe('.sp-dl-wunder[data-w="fernsehturm"]'); await tick(500);
  r = await pg.evaluate(() => ({ teil: window.DMA_SPIEL.pruef.zustand().dorfTeil, chips: [...document.querySelectorAll('.sp-wunder-platz [data-w="fernsehturm"]')].map((b) => b.textContent + (b.classList.contains("sp-an") ? "*" : "")).join(" ") }));
  sage(r.teil === "wunder" && r.chips === "1 2* 3 4 5", "Tipp auf den Fernsehturm öffnet die Sehenswürdigkeiten: „Platz im Dorf: 1 2* 3 4 5“", JSON.stringify(r));
  const chip = await pg.evaluate(() => { const b = document.querySelector('.sp-wunder-platz [data-w="fernsehturm"][data-p="4"]'); b.scrollIntoView({ block: "center" }); const q = b.getBoundingClientRect(); return [Math.round(q.width), Math.round(q.height)]; });
  sage(chip[0] >= 30 && chip[1] >= 30, "Platz-Knöpfe groß genug (" + chip.join(" × ") + " px)", "");
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-liste.png" });
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippe('.sp-wunder-platz [data-w="fernsehturm"][data-p="4"]'); await tick(500);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_wunder_platz").map((x) => x.args), hin: window.__hinweise.slice(-1)[0] }));
  sage(r.ruf.length === 1 && r.ruf[0].p_was === "fernsehturm" && r.ruf[0].p_platz === 4 && /Platz 5/.test(r.hin), "Platz 5 gewählt: spiel_wunder_platz(fernsehturm, 4), Meldung", JSON.stringify(r));
  r = await lage();
  sage(Math.abs(r.find((x) => x.w === "fernsehturm").x - 180) <= 4 && Math.abs(r.find((x) => x.w === "koelner_dom").x - 84) <= 4, "der Fernsehturm steht jetzt auf Platz 5 (am Fluss), der Dom bleibt", JSON.stringify(r));
  await tippe('.sp-wunder-platz [data-w="koelner_dom"][data-p="4"]'); await tick(500);
  r = await lage();
  sage(Math.abs(r.find((x) => x.w === "koelner_dom").x - 180) <= 4 && Math.abs(r.find((x) => x.w === "fernsehturm").x - 180) > 20 && /Fernsehturm hat Platz gemacht/.test(await pg.evaluate(() => window.__hinweise.slice(-1)[0])), "Dom auf denselben Platz: der Fernsehturm macht Platz (nächster freier)", JSON.stringify(r));

  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 764 (Funk 184, Dorf): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
