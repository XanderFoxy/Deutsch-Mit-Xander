#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 733: JAHRESZEITEN UND FESTE IM DORF (Funk 169)
   ---------------------------------------------------------------------
   XANDER (Funk 169): „ich möchte das schon mal in der Vorschau sehen wie
   sowas aussieht wenn die Stadt dann geschmückt ist".
   Geprüft: Jahreszeit/Fest nach Datum (Ostern nach Gauß), der Knopf
   „Saison" nur für den Betreiber, jede Stufe malt ein anderes Bild,
   Kürbisgesichter und Christbaumkerzen leuchten nachts.
   BILD=/pfad/praefix legt Bilder jeder Stufe ab.
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
    ich.level = 12; ich.punkte = 900;
    ich.dorf = { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, schule: { stufe: 1, lp: 20 }, rathaus: { stufe: 3, lp: 60 }, schmiede: { stufe: 1, lp: 0 },
                 kuhstall: { stufe: 1, lp: 20 }, brauerei: { stufe: 2, lp: 40 } };
    ich.werk = {}; ich.volk = { arbeiter: 20, ritter: 0, quote: 80, berufe: { bauer: 2, mueller: 1 } };
    ich.dorf_ab = new Date(jetzt - 3600000).toISOString();
    window.__extra = Object.assign({}, window.__extra || {}, { spiel_markt_preise: () => ({ ok: true, preise: {} }), spiel_angebote_liste: () => ({ ok: true, angebote: [] }) });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false; S.dorfTeil = ""; S.dorfWahl = "";
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  await pg.evaluate(() => { try { localStorage.removeItem("dma_dorf_nah"); } catch (e) {} const S = window.DMA_SPIEL.pruef.zustand(); S.dorfNah = null; S.dorfKarte = false; });
  await pg.evaluate(() => { try { localStorage.removeItem("dma_dorf_zeichen"); } catch (e) {} const S = window.DMA_SPIEL.pruef.zustand(); S.dorfZeichen = null;
    const ich = window.__ich; ich.werk = { baeckerei: { fertig: new Date(Date.now() - 60000).toISOString(), menge: 4, ware: "brot" } };
    ich.dorf.kuhstall = { stufe: 1, lp: 20, stand: new Date(Date.now() - 3 * 1200000).toISOString() };
    S.ich = JSON.parse(JSON.stringify(ich));
    window.__extra = Object.assign({}, window.__extra, {
      spiel_werk_abholen: (a) => { const i = JSON.parse(JSON.stringify(window.__ich)); i.werk = {}; window.__ich.werk = {}; return Object.assign(i, { ok: true, menge: 4, ware: "brot" }); },
      spiel_melken: () => { window.__ich.dorf.kuhstall.stand = new Date().toISOString(); return Object.assign(JSON.parse(JSON.stringify(window.__ich)), { ok: true, menge: 3 }); } }); });
  const bild0 = async (name) => { if (!process.env.BILD) return; await pg.evaluate(() => document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "start" })); await tick(350); await (await pg.$(".sp-dl-rahmen")).screenshot({ path: process.env.BILD + "-" + name + ".png" }); };

  const P = (f, ...a) => pg.evaluate(([f, a]) => window.DMA_SPIEL.pruef[f](...a), [f, a]);
  console.log("\nJAHRESZEIT NACH DATUM\n");
  const J = (y, m, d) => pg.evaluate(([y, m, d]) => { const j = window.DMA_SPIEL.pruef.dorfJahr(new Date(y, m - 1, d)); return j.zeit + "|" + j.fest; }, [y, m, d]);
  const os = await pg.evaluate(() => [2026, 2027, 2028].map((j) => window.DMA_SPIEL.pruef.osterSonntag(j).toDateString()));
  sage(os.join(",") === ["Sun Apr 05 2026", "Sun Mar 28 2027", "Sun Apr 16 2028"].join(","), "Ostersonntag 2026/27/28 richtig", os.join(", "));
  for (const [y, m, d, soll] of [[2026, 9, 27, "herbst|erntedank"], [2026, 10, 12, "herbst|"], [2026, 10, 31, "herbst|halloween"], [2026, 11, 15, "herbst|"],
    [2026, 12, 10, "winter|advent"], [2027, 1, 3, "winter|advent"], [2027, 1, 20, "winter|"], [2027, 3, 25, "fruehling|ostern"], [2026, 4, 3, "fruehling|ostern"],
    [2026, 5, 1, "fruehling|"], [2026, 7, 14, "sommer|"]]) {
    const ist = await J(y, m, d);
    sage(ist === soll, d + "." + m + "." + y + " → " + soll, ist);
  }
  console.log("\nVORSCHAU-KNOPF NUR FÜR DEN BETREIBER\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1200);
  let r = await pg.evaluate(() => !!document.querySelector('[data-s="jahrvorschau"]'));
  sage(!r, "wer nicht Betreiber ist, sieht keinen „Saison“-Knopf");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.jahrVorschau("", true); window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(600);
  const knopf = () => pg.evaluate(() => { const k = document.querySelector('[data-s="jahrvorschau"]'), c = document.querySelector(".sp-dl-mal"); return { text: k && k.textContent, sig: c && c.dataset.sig, gemalt: c && c.dataset.gemalt }; });
  r = await knopf();
  sage(r.text === "Saison: echt", "Betreiber: Knopf „Saison: echt“ unter dem Bild", JSON.stringify(r.text));
  const bild = async (name) => { if (!process.env.BILD) return; await pg.evaluate(() => document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "start" })); await tick(350); await (await pg.$(".sp-dl-rahmen")).screenshot({ path: process.env.BILD + "-" + name + ".png" }); };
  const W = (tag) => pg.evaluate((tag) => { const S = window.DMA_SPIEL.pruef.zustand(); S.wetterTest = { code: 0, tag, temp: 12, ort: "Döbeln" }; window.DMA_SPIEL.pruef.schnellZeichnen(true); }, tag);
  await W(true); await tick(600);
  const sigs = {};
  for (const [v, name] of [["herbst|", "Herbst"], ["herbst|erntedank", "Erntedank"], ["herbst|halloween", "Halloween"], ["winter|advent", "Advent"], ["winter|", "Winter"], ["fruehling|ostern", "Ostern"], ["fruehling|", "Frühling"], ["sommer|", "Sommer"]]) {
    await tippe('[data-s="jahrvorschau"]'); await tick(900);
    r = await knopf();
    sigs[r.sig] = 1;
    sage(r.text === "Saison: " + name && r.gemalt && r.gemalt.indexOf(r.sig) === 0, "Tipp → „" + name + "“, Bild neu gemalt", JSON.stringify(r));
    await bild(v.replace("|", "-") || "echt");
  }
  sage(Object.keys(sigs).length === 8, "jede Stufe malt ein eigenes Bild", Object.keys(sigs).length + " Bilder");
  await tippe('[data-s="jahrvorschau"]'); await tick(500);
  r = await knopf();
  sage(r.text === "Saison: echt" && /^[^J]*J/.test(r.sig), "nach Sommer zurück auf „echt“ (heutiges Datum)", JSON.stringify(r));
  console.log("\nFESTLICHTER IN DER NACHT\n");
  await W(false);
  for (const [v, n] of [["herbst|halloween", "Kürbisgesichter"], ["winter|advent", "Christbaumkerzen"]]) {
    await pg.evaluate((v) => { window.DMA_SPIEL.pruef.jahrVorschau(v); window.DMA_SPIEL.pruef.dmNeu(); window.DMA_SPIEL.pruef.schnellZeichnen(true); }, v); await tick(1200);
    r = await P("jahrLichter");
    sage(r >= 3, n + " leuchten nachts", r + " Lichter");
    await bild(v.replace("|", "-") + "-nacht");
  }
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.jahrVorschau("herbst|"); window.DMA_SPIEL.pruef.dmNeu(); window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(1200);
  r = await P("jahrLichter");
  sage(r === 0, "Herbst ohne Halloween: Kürbisse ohne Gesicht, kein Leuchten", r + " Lichter");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.jahrVorschau("", false); window.DMA_SPIEL.pruef.zustand().wetterTest = null; });
  sage(konsolenFehler.length === 0, "keine Skriptfehler", konsolenFehler.slice(0, 3).join(" | "));
  console.log(fehler ? "\n" + fehler + " FEHLER\n" : "\nALLES GRÜN\n");
  await br.close(); srv.close(); process.exit(fehler ? 1 : 0);
})();
