#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 775: GASTHAUS UND GEFÄNGNIS (WALKIE 299)
   ---------------------------------------------------------------------
   Gasthaus: Touristen essen dort, je Gericht 5 + 2 × Stufe P, mit Koch
   +3 P. Gefängnis: wer beim Plündern scheitert, sitzt; Freikaufen oder
   jemand anderes zahlt die Kaution.
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

  const beaId = "11111111-1111-4111-8111-111111111111", cemId = "22222222-2222-4222-8222-222222222222";
  await pg.evaluate(([beaId, cemId]) => {
    const ich = window.__ich, S = window.DMA_SPIEL.pruef.zustand(), jetzt = Date.now();
    ich.dorf = Object.assign({}, ich.dorf, { gasthaus: { stufe: 2, lp: 40 }, gefaengnis: { stufe: 1, lp: 20 } });
    ich.volk = Object.assign({}, ich.volk, { berufe: Object.assign({}, ich.volk.berufe, { koch: 1 }),
      haft: { bei: beaId, bei_name: "Bea", dorf_name: "Beastadt", seit: new Date(jetzt).toISOString(), bis: new Date(jetzt + 2 * 3600000).toISOString(), kaution: 20 },
      gefangene: [{ id: cemId, name: "Cem", bis: new Date(jetzt + 3600000).toISOString(), kaution: 20 }] });
    ich.mitspielen = true;
    window.__extra = Object.assign({}, window.__extra, {
      spiel_kaution: (a) => { const neu = JSON.parse(JSON.stringify(ich)); if (!a.p_haeftling) { delete neu.volk.haft; ich.volk = neu.volk; }
        return Object.assign({ ok: true, frei: a.p_haeftling ? "Emy" : "Alex", kaution: 20, an: "Bea" }, neu); }
    });
    const bea = S.stand[beaId];
    bea.mitspielen = true; bea.dorf_name = "Beastadt";
    bea.dorf = { baeckerei: { stufe: 1, lp: 20 }, gefaengnis: { stufe: 2, lp: 40 } };
    bea.gefangene = [{ id: "33333333-3333-4333-8333-333333333333", name: "Emy", bis: new Date(jetzt + 5400000).toISOString(), kaution: 30 }];
    S.ich = JSON.parse(JSON.stringify(ich)); S.stand[ich.id] = Object.assign({}, S.stand[ich.id], { dorf: ich.dorf });
    S.schnellMenue = true; S.blick = "dorfblick"; S.dorfWahl = ""; S.dorfBesuch = "";
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  }, [beaId, cemId]);
  await tick(900);
  const SP = process.env.SP || "/tmp";

  /* 1. Haft-Band oben im Dorf */
  let b = await pg.evaluate(() => { const e = document.querySelector(".sp-haft"); if (!e) return null; const r = e.getBoundingClientRect(), k = e.querySelector("button").getBoundingClientRect();
    return { text: e.textContent, rechts: r.right, knopfRechts: k.right, knopfH: k.height, breit: document.documentElement.scrollWidth }; });
  sage(!!b && /Gefängnis von Bea/.test(b.text) && /Freikaufen/.test(b.text) && /20 P/.test(b.text), "Haft-Band: bei Bea, Freikaufen 20 P", b && b.text.slice(0, 90));
  sage(!!b && b.knopfRechts <= 360 && b.knopfH >= 30 && b.breit <= 360, "Haft-Band passt auf 360 px, Knopf ≥30 px", b && JSON.stringify({ r: b.knopfRechts, h: b.knopfH, w: b.breit }));
  await pg.evaluate(() => { const e = document.querySelector(".sp-haft"); if (e) e.scrollIntoView({ block: "center" }); });
  await pg.screenshot({ path: SP + "/p775_haft.png" }).catch(() => {});

  /* 2. Plündern-Knopf sagt „du sitzt" */
  const pk = await pg.evaluate(() => { const k = [...document.querySelectorAll('.sp-nachbarn ~ * [data-s="pluendern"], [data-s="pluendern"]')]; const g = document.querySelector(".sp-nachbarn");
    return { alleZu: k.length > 0 && k.every((e) => e.disabled), titel: k.map((e) => e.title).join("|"), kopf: g ? g.textContent : "" }; });
  sage(pk.alleZu && /du sitzt/.test(pk.titel) && /erst wenn du frei bist/.test(pk.kopf), "Plündern gesperrt, solange man sitzt", JSON.stringify(pk).slice(0, 140));
  sage(/noch 2 h/.test(b.text), "Haftzeit lesbar („2 h“)", b.text.slice(0, 90));

  /* 3. Freikaufen ruft spiel_kaution ohne Häftling */
  await tippe('.sp-haft button'); await tick(700);
  let ruf = await pg.evaluate(() => window.__rufe.filter((r) => r.name === "spiel_kaution").slice(-1)[0]);
  sage(!!ruf && ruf.args.p_haeftling === null, "Freikaufen → spiel_kaution(p_haeftling null)", JSON.stringify(ruf));
  const alle = await pg.evaluate(() => window.__hinweise.join(" || "));
  sage(/Du hast dich freigekauft – das Geld geht an Bea/.test(alle), "Meldung: freigekauft", alle.slice(-160));
  sage(await pg.evaluate(() => !document.querySelector(".sp-haft")), "Band weg nach dem Freikaufen");

  /* 4. Eigene Stationen: Gasthaus, Gefängnis */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = "gasthaus"; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(500);
  let t = await pg.evaluate(() => (document.querySelector(".sp-dl-station") || {}).textContent || "");
  sage(/Gasthaus/.test(t) && /12 P je Gericht/.test(t) && /\+2 Gast/.test(t), "Gasthaus-Station: 12 P je Gericht (5+2·2+3), +2 Gast", t.slice(0, 140));
  await pg.evaluate(() => { const e = document.querySelector(".sp-dl-station"); if (e) e.scrollIntoView({ block: "center" }); });
  await pg.screenshot({ path: SP + "/p775_gasthaus.png" }).catch(() => {});
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = "gefaengnis"; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(500);
  t = await pg.evaluate(() => { const e = document.querySelector(".sp-dl-station"); return e ? { t: e.textContent, k: e.querySelectorAll('.sp-gefangener [data-s="kaution"]').length } : null; });
  sage(!!t && /Cem/.test(t.t) && /Kaution 20 P/.test(t.t) && t.k === 0, "Eigenes Gefängnis: Cem sitzt, kein Zahlknopf", t && t.t.slice(0, 160));

  /* 5. Berufe: Koch */
  const ber = await pg.evaluate(() => document.body.textContent.indexOf("Koch") >= 0);
  sage(ber, "Beruf Koch erscheint im Dorf");

  /* 6. Bau-Liste: Gasthaus und Gefängnis */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; S.dorfTeil = "bau"; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(500);
  const bau = await pg.evaluate(() => [...document.querySelectorAll('[data-s="bauen"]')].map((e) => e.dataset.w));
  sage(bau.indexOf("gasthaus") >= 0 && bau.indexOf("gefaengnis") >= 0, "Bau-Liste hat Gasthaus und Gefängnis", bau.join(","));

  /* 7. Besuch bei Bea: fremdes Gefängnis mit Kaution zahlen */
  await pg.evaluate((beaId) => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfTeil = ""; S.dorfBesuch = beaId; S.dorfWahl = "gefaengnis"; window.DMA_SPIEL.pruef.schnellZeichnen(true); }, beaId); await tick(600);
  t = await pg.evaluate(() => { const e = document.querySelector(".sp-dl-station"); if (!e) return null; const k = e.querySelector('[data-s="kaution"]'); const r = k && k.getBoundingClientRect(); return { t: e.textContent, z: k && k.dataset.z, r: r && r.right, h: r && r.height }; });
  sage(!!t && /Emy/.test(t.t) && /Kaution zahlen/.test(t.t) && t.z === "33333333-3333-4333-8333-333333333333", "Fremdes Gefängnis: Emy, „Kaution zahlen“", t && t.t.slice(0, 160));
  sage(!!t && t.r <= 360 && t.h >= 30, "Kaution-Knopf passt, ≥30 px", t && JSON.stringify({ r: t.r, h: t.h }));
  await pg.evaluate(() => { const e = document.querySelector(".sp-dl-station"); if (e) e.scrollIntoView({ block: "center" }); });
  await pg.screenshot({ path: SP + "/p775_fremd.png" }).catch(() => {});
  await tippe('.sp-dl-station [data-s="kaution"]'); await tick(700);
  ruf = await pg.evaluate(() => window.__rufe.filter((r) => r.name === "spiel_kaution").slice(-1)[0]);
  sage(!!ruf && ruf.args.p_haeftling === "33333333-3333-4333-8333-333333333333", "Kaution zahlen → spiel_kaution(Emy)", JSON.stringify(ruf && ruf.args));
  sage(/Kaution für Emy/.test(await zuletzt()), "Meldung: Kaution für Emy bezahlt", await zuletzt());

  /* 8. Gescheitertes Plündern mit Haft */
  await pg.evaluate((beaId) => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.dorfBesuch = ""; S.dorfWahl = "";
    window.__extra.spiel_pluendern = () => Object.assign({ ok: true, gescheitert: true, an: "Bea", strafe: 12, fehl: 34, ritter: 0,
      haft: { bei_name: "Bea", bis: new Date(Date.now() + 4 * 3600000).toISOString(), kaution: 30 } }, JSON.parse(JSON.stringify(window.__ich)));
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  }, beaId); await tick(500);
  await tippe('[data-s="pluendern"][data-g="baeckerei"]'); await tick(900);
  sage(/Gefängnis/.test(await zuletzt()) && /Kaution 30 P/.test(await zuletzt()) && /4 h/.test(await zuletzt()), "Scheitern meldet Haft und Kaution", await zuletzt());

  /* 9. Dorfbild zeichnet ohne Fehler */
  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.join(" | ").slice(0, 200));
  console.log(fehler ? "\nROT: " + fehler + " Fehler" : "\nGRÜN");
  await br.close(); srv.close(); process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
