#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 703: FORSCHUNG UND SEHENSWÜRDIGKEITEN
   ---------------------------------------------------------------------
   XANDER (Funk 139): „schlauere Wissenschaftler … geheime Freischaltung"
   und „Sehenswürdigkeiten … Kölner Dom oder den Berliner Fernsehturm …
   Besucher anziehen". Geprüft auf einem Android-Telefon mit echten
   Fingertipps: Wahrzeichen-Band, Bauen des Kölner Doms (Besucher gehen
   durchs Bild, Volk froher), Forschungstafel mit verborgenen geheimen
   Forschungen, die sich erst bei guter Deutsch-Quote zeigen, Erforschen,
   Erntemeldung mit Besuchern, nichts ragt heraus, Leistung.
   Aufbau wie pruefe-702 (Server-Regeln in der Attrappe nachgebaut).
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
  const rufe = (n) => pg.evaluate((n) => window.__rufe.filter((r) => r.name === n), n);
  const zufrieden = () => pg.evaluate(() => { const b = document.querySelector(".sp-schnellmenue .sp-volk b"); return b ? parseInt(b.textContent, 10) : null; });

  console.log("\nWAHRZEICHEN-BAND UND SEHENSWÜRDIGKEITEN\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(700);
  let r = await pg.evaluate(() => { const b = document.querySelector(".sp-schnellmenue .sp-wunderband"); return { da: Boolean(b), leer: b ? b.querySelectorAll(".sp-wb-leer").length : 0, gaeste: b ? b.querySelectorAll(".sp-wb-gast").length : 0,
    namen: b ? [...b.querySelectorAll(".sp-wb-name")].map((t) => t.textContent).join("|") : "" }; });
  sage(r.da && r.leer === 5 && r.gaeste === 0, "unter dem Dorf das Wahrzeichen-Band: 5 Plätze, noch alle als Schatten, keine Besucher", JSON.stringify(r));
  sage(/ab Level 12/.test(r.namen) && /ab Level 20/.test(r.namen), "unter jedem Schatten steht, ab welchem Level", r.namen);
  const z0 = await zufrieden();
  await tippe(".sp-schnellmenue .sp-wunderband"); await tick(600);
  r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); const zeilen = [...m.querySelectorAll(".sp-wunder")];
    return { teil: window.DMA_SPIEL.pruef.zustand().dorfTeil, n: zeilen.length, frei: zeilen.filter((z) => z.querySelector('[data-s="wunderbauen"]:not([disabled])')).map((z) => z.querySelector("b").textContent),
      zu: zeilen.filter((z) => z.querySelector('[data-s="wunderbauen"][disabled]')).map((z) => z.querySelector("small").textContent.split(" · ").pop()) }; });
  sage(r.teil === "wunder" && r.n === 5, "Tipp aufs Band klappt die Sehenswürdigkeiten auf (5 Zeilen)", r.teil + " / " + r.n);
  sage(r.frei.join(",") === "Holstentor,Brandenburger Tor,Kölner Dom" && r.zu.join(",") === "ab Level 16,ab Level 20", "Level 13: Holstentor, Brandenburger Tor und Kölner Dom baubar; Neuschwanstein ab 16, Fernsehturm ab 20", JSON.stringify(r.frei) + " " + JSON.stringify(r.zu));
  await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
  await tippe('.sp-wunder [data-s="wunderbauen"][data-w="koelner_dom"]'); await tick(700);
  let a = await rufe("spiel_wunder_bauen");
  r = await pg.evaluate(() => { const b = document.querySelector(".sp-schnellmenue .sp-wunderband"); const g = [...b.querySelectorAll(".sp-wb-gast")];
    return { leer: b.querySelectorAll(".sp-wb-leer").length, gaeste: g.length, laufen: g.filter((e) => e.getAnimations().some((x) => x.playState === "running")).length,
      dom: /Kölner Dom/.test(b.textContent), zeile: document.querySelector('.sp-wunder [data-w="koelner_dom"]') ? "knopf" : "steht", hin: window.__hinweise.slice(-1)[0] || "", ton: window.DMA_TONLOG.map((t) => t.name).join(",") }; });
  sage(a.length === 1 && a[0].args.p_was === "koelner_dom", "Tipp auf „Bauen“ ruft spiel_wunder_bauen(koelner_dom)");
  sage(r.leer === 4 && r.dom && r.zeile === "steht", "der Dom steht jetzt in Farbe im Band, die Zeile sagt „steht“", JSON.stringify(r));
  sage(r.gaeste === 3 && r.laufen === 3, "3 Besucher spazieren durchs Band (7 Besucher je Ernte)", r.gaeste + " / " + r.laufen);
  sage(/Kölner Dom steht/.test(r.hin) && /jubel/.test(r.ton), "Meldung mit Besucherzahl, Jubel", r.hin.slice(0, 90));
  const z1 = await zufrieden();
  sage(z0 != null && z1 === Math.min(100, z0 + 5), "das Volk ist 5 % froher (Kölner Dom)", z0 + " → " + z1);

  console.log("\nFORSCHUNG MIT GEHEIMEN ENTDECKUNGEN\n");
  await tippe('.sp-dorf-auf [data-t="forschung"]'); await tick(600);
  r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); const z = [...m.querySelectorAll(".sp-forschung")];
    return { n: z.length, geheim: m.querySelectorAll(".sp-geheim").length, text: m.querySelector(".sp-forschung-kopf").textContent, duden: /Duden/.test(m.textContent), dampf: /Dampfmaschine/.test(m.textContent),
      warum: (m.querySelector(".sp-geheim small") || {}).textContent || "", frei: z.filter((e) => e.querySelector('[data-s="erforschen"]:not([disabled])')).map((e) => e.querySelector("b").textContent) }; });
  sage(r.n === 6 && /100 Punkte/.test(r.text), "Forschungstafel: 6 Forschungen, 100 Forschung gesammelt", r.n + " · " + r.text);
  sage(r.geheim === 2 && !r.duden && !r.dampf, "die beiden geheimen Forschungen sind verborgen (Name und Wirkung unsichtbar)", r.geheim + " verborgen");
  sage(/Deutsch-Quote 85 % \(du hast 80 %\)/.test(r.warum), "… und sagen, was fehlt: bessere Deutsch-Quote", r.warum);
  sage(r.frei.join(",") === "Dreifelderwirtschaft,Sauerteig,Wasserrad an der Mühle,Buchdruck", "die vier offenen sind erforschbar", JSON.stringify(r.frei));
  await tippe('.sp-forschung [data-s="erforschen"][data-f="buchdruck"]'); await tick(600);
  a = await rufe("spiel_erforschen");
  r = await pg.evaluate(() => ({ zeile: [...document.querySelectorAll(".sp-forschung")].find((e) => /Buchdruck/.test(e.textContent)).textContent, kopf: document.querySelector(".sp-forschung-kopf").textContent,
    hin: window.__hinweise.slice(-1)[0] || "", sauer: Boolean(document.querySelector('[data-f="sauerteig"][disabled]')) }));
  sage(a.length === 1 && a[0].args.p_was === "buchdruck" && /erforscht/.test(r.zeile) && /40 Punkte/.test(r.kopf), "Buchdruck erforscht, 60 Forschung abgezogen", r.kopf);
  sage(!r.sauer && /Erforscht: Buchdruck/.test(r.hin), "Meldung nennt die Forschung; mit 40 übrig bleibt Sauerteig (30) erforschbar", r.hin.slice(0, 70));
  /* Klüger geworden: Deutsch-Quote 90 %, 5 Wissenschaftler – die Geheimnisse zeigen sich. */
  await pg.evaluate(() => { const ich = window.__ich; ich.volk = Object.assign({}, ich.volk, { quote: 90, berufe: { bauer: 2, wissenschaftler: 5 } });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(400);
  r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); return { geheim: m.querySelectorAll(".sp-geheim").length, duden: /Der Duden/.test(m.textContent), dampf: /Dampfmaschine/.test(m.textContent), offen: m.querySelectorAll(".sp-geheim-offen").length }; });
  sage(r.geheim === 0 && r.duden && r.dampf && r.offen === 2, "mit Deutsch-Quote 90 % und 5 Wissenschaftlern: Duden und Dampfmaschine werden sichtbar (golden umrandet)", JSON.stringify(r));

  console.log("\nERNTE MIT BESUCHERN\n");
  await pg.evaluate(() => { window.__ernte = Object.assign({ ok: true, bratwurst: 0, erz: 0, xp: 0, mana: 0, besucher: 7, besucher_kauf: 7, eintritt: 21, punkte_plus: 56, zufrieden: 97, satt: 4, bedarf: 4, bezahlt: 16, quote: 90 },
    JSON.parse(JSON.stringify(window.__ich)), { xp: 0, mana: 0 }); });
  await tippe('.sp-schnellmenue [data-s="ernte"]'); await tick(600);
  r = await zuletzt();
  sage(/7 Besucher: 21 P Eintritt, sie kauften 7 Stück Essen \(35 P\)/.test(r), "Erntemeldung nennt Besucher, Eintritt und was sie gekauft haben", r.slice(-110));

  console.log("\nANDROID UND LEISTUNG\n");
  r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); const mr = m.getBoundingClientRect();
    const raus = [...m.querySelectorAll(".sp-beruf button, .sp-beruf span, .sp-dorf-auf button")].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > mr.right + 1 || b.left < mr.left - 1 || e.scrollWidth > e.clientWidth + 1); }).map((e) => e.textContent.slice(0, 20));
    return { raus, quer: m.scrollWidth - m.clientWidth }; });
  sage(r.raus.length === 0 && r.quer <= 1, "360 px: kein Knopf ragt heraus, kein Querscrollen", JSON.stringify(r));
  await pg.evaluate(() => { document.querySelector(".sp-dorfland").scrollIntoView({ block: "start" }); }); await tick(300);
  await (await pg.$(".sp-wunderband")).screenshot({ path: (process.env.BILD || "/tmp/w703.png").replace(/\.png$/, "-band.png") });
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); const ich = window.__ich;
    ich.volk = Object.assign({}, ich.volk, { wunder: { holstentor: 1, brandenburger: 1, koelner_dom: 1, neuschwanstein: 1, fernsehturm: 1 } }); S.ich = JSON.parse(JSON.stringify(ich)); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(500);
  await (await pg.$(".sp-wunderband")).screenshot({ path: (process.env.BILD || "/tmp/w703.png").replace(/\.png$/, "-alle.png") });
  await pg.evaluate(() => { document.querySelector(".sp-forschung-kopf").scrollIntoView({ block: "start" }); }); await tick(300);
  await pg.screenshot({ path: (process.env.BILD || "/tmp/w703.png").replace(/\.png$/, "-tafel.png") });
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const leistung = await pg.evaluate(() => new Promise((ok) => {
    const S = window.DMA_SPIEL.pruef.zustand(); const t0 = performance.now(); S.ich = Object.assign({}, S.ich, { punkte: (S.ich.punkte || 0) + 1 }); window.DMA_SPIEL.pruef.schnellZeichnen(true); const zeichnen = performance.now() - t0;
    const bilder = []; let letzt = performance.now(); const ende = letzt + 3000;
    const f = (t) => { bilder.push(t - letzt); letzt = t; if (t < ende) requestAnimationFrame(f); else ok({ zeichnen: Math.round(zeichnen), bilder: bilder.length, lang: bilder.filter((x) => x > 50).length }); };
    requestAnimationFrame(f); }));
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  sage(leistung.zeichnen < 120 && leistung.lang <= 5, "4× gedrosselte CPU mit allen 5 Wahrzeichen und Besuchern: Neuzeichnen unter 120 ms, höchstens 5 lange Bilder", JSON.stringify(leistung));
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 703 (Forschung, Sehenswürdigkeiten): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
