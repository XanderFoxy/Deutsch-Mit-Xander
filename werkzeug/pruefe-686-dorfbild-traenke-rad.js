#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 686: HAUPTMENÜ WIE VORHER, DORF ALS BILD MIT
   STATIONEN, TRANK-KNOPF, LANGER DRUCK = ZAUBER ODER WAFFEN,
   RÜSTUNG UNTER LEVEL UND MANA
   ---------------------------------------------------------------------
   XANDER (25.09. spät): „Das mit dem Dorf hast du falsch verstanden ich
   wollte das nicht im Hauptmenü haben … diese grafischen Sachen … die
   kannst du klickbar machen … unten in der Hauptschnellleiste meine
   Manatränke … lange auf mein Profilbild gedrückt … zwei Optionen …
   Zauber und Waffen … Mana mit drin, dass ich Torten Shortcut habe" und
   „die Rüstung muss die Level Anzeige und die Magie oben drüber haben".
   =====================================================================
   (Aufbau der Bühne wie Sonde 683:)
   ---------------------------------------------------------------------
   XANDER (25.09. nachts): „Mein Dorf hätte ich gern zusätzlich … in dem
   Shortcut Menü unten … dass der letzte wie ein Makroknopf ist … diese
   kleinen Zahlen, die Gesundheitspunkte … Krankenhaus … die Gebäude
   angreifen … Ritter … angeln … Bäume fällen … Eier einsammeln … Kuh
   melken … Silizium und Computerchips … Laser Waffen verbessern".
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
    ich.level = 10; ich.punkte = 500; ich.mana = 60;
    ich.dorf = { baeckerei: { stufe: 1, lp: 20 }, huehnerstall: { stufe: 1, lp: 20, stand: new Date(jetzt - 2 * 900000 - 5000).toISOString() },
                 kuhstall: { stufe: 1, lp: 20, stand: new Date(jetzt - 1300000).toISOString() }, krankenhaus: { stufe: 1, lp: 0 },
                 schmiede: { stufe: 1, lp: 20 }, labor: { stufe: 1, lp: 20 } };
    ich.werk = { baeckerei: { ware: "brot", menge: 3, fertig: new Date(jetzt + 300000).toISOString() } };
    ich.dorf_ab = new Date(jetzt - 5 * 3600000).toISOString();
    ich.volk = { arbeiter: 12, ritter: 1, quote: 90 };
    ich.vorraete = Object.assign({}, ich.vorraete, { mehl: 6, ei: 2, milch: 1, fisch: 2, quarz: 4, holz: 3, silizium: 1, gold: 1, chip: 2 });
    ich.waffen_stufe = { lasersalve: 2 };
    const bea = window.DMA_SPIEL.pruef.zustand().stand["11111111-1111-4111-8111-111111111111"];
    bea.dorf = { baeckerei: { stufe: 1, lp: 20 }, schule: { stufe: 1, lp: 20 }, muehle: { stufe: 1, lp: 20, gepl: new Date(jetzt - 60000).toISOString() } };
    bea.ritter = 2;
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_markt_preise: () => ({ ok: true, preise: {} }),
      spiel_angebote_liste: () => ({ ok: true, angebote: [] }),
      spiel_pluendern: (a) => { ich.mana -= 10; ich.vorraete = Object.assign({}, ich.vorraete, { brot: (ich.vorraete.brot || 0) + 2 }); return Object.assign({}, ich, { ok: true, gebaeude: a.p_gebaeude, an: "Bea", beute: { brot: 2 }, mana: 0, punkte_beute: 0, anteil: 25, schaden: 10 }); },
      spiel_ritter: (a) => { ich.volk = Object.assign({}, ich.volk, { ritter: ich.volk.ritter + a.p_menge }); ich.punkte -= 40; return Object.assign({}, ich, { ok: true, ritter: ich.volk.ritter, preis: 40 }); },
      spiel_melken: () => { ich.vorraete = Object.assign({}, ich.vorraete, { milch: ich.vorraete.milch + 1 }); ich.dorf.kuhstall.stand = new Date().toISOString(); return Object.assign({}, ich, { ok: true, menge: 1 }); },
      spiel_ei_sammeln: () => { ich.vorraete = Object.assign({}, ich.vorraete, { ei: ich.vorraete.ei + 1 }); ich.dorf.huehnerstall.stand = new Date(Date.parse(ich.dorf.huehnerstall.stand) + 900000).toISOString(); return Object.assign({}, ich, { ok: true, menge: 1, rest: 0 }); },
      spiel_holzen: (a) => { ich.vorraete = Object.assign({}, ich.vorraete, { holz: ich.vorraete.holz + 2 }); ich.acker = Object.assign({}, ich.acker, { ["w" + a.p_platz]: { ab: new Date().toISOString() } }); return Object.assign({}, ich, { ok: true, menge: 2, nest: false }); },
      spiel_angeln: () => { ich.vorraete = Object.assign({}, ich.vorraete, { fisch: ich.vorraete.fisch + 1 }); return Object.assign({}, ich, { ok: true, fang: "fisch", menge: 1 }); }
    });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, ich); S.schnellMenue = false; S.graben = false;
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  await tick(400);


  const B = process.env.BILD;
  console.log("\nHAUPTMENÜ BLEIBT DAS HAUPTMENÜ\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(400);
  const d1 = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); const land = m && m.querySelector(".sp-dorfland");
    return { blick: Boolean(m && m.classList.contains("sp-sm-blick")), reiter: Boolean(m && m.querySelector(".sp-sm-reiter")), land: Boolean(land),
      haeuser: land ? land.querySelectorAll(".sp-dl-haus").length : 0, gebaut: land ? land.querySelectorAll(".sp-dl-haus:not(.sp-dl-bauplatz)").length : 0,
      bauplatz: land ? land.querySelectorAll(".sp-dl-bauplatz").length : 0, fachwerk: land ? land.querySelectorAll(".sp-dh-baeckerei rect").length : 0,
      quer: m ? m.scrollWidth - m.clientWidth : -1 }; });
  if (B) await pg.screenshot({ path: B + "-dorf.png" });
  sage(d1.blick && !d1.reiter && d1.land, "Makroknopf „Mein Dorf“: eigenes Fenster mit dem Dorfbild, ohne Reiter", JSON.stringify(d1));
  sage(d1.haeuser === 12 && d1.gebaut === 6 && d1.bauplatz === 6, "im Bild: alle 12 Gebäude an ihrem Ort – 6 gebaut, 6 als Bauplatz", JSON.stringify(d1));
  sage(d1.fachwerk >= 6 && d1.quer <= 1, "die Bäckerei ist ein Fachwerkhaus mit Einzelheiten; nichts ragt seitlich heraus", JSON.stringify(d1));
  /* ☰ danach: das Hauptmenü mit allen Reitern, nicht das Dorf. */
  await tippe('.sp-schnell [data-s="klappe"]'); await tick(300);
  const h1 = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue");
    return { blick: Boolean(m && m.classList.contains("sp-sm-blick")), reiter: m ? [...m.querySelectorAll(".sp-sm-reiter button")].map((b) => b.textContent).join(",") : "" }; });
  sage(!h1.blick && /Waffen,Heilen,Tiere,Deutsch,Mehr/.test(h1.reiter), "☰ bei offenem Dorf: gleich das Hauptmenü mit Waffen, Heilen, Tiere, Deutsch, Mehr", JSON.stringify(h1));
  await tippe('.sp-schnell [data-s="klappe"]'); await tick(300);
  await tippe('.sp-schnell [data-s="makro"]'); await tick(300);
  await tippe('.sp-schnellmenue [data-s="blickzu"]'); await tick(300);
  await tippe('.sp-schnell [data-s="klappe"]'); await tick(300);
  const h2 = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); return { blick: Boolean(m && m.classList.contains("sp-sm-blick")), reiter: Boolean(m && m.querySelector(".sp-sm-reiter")) }; });
  sage(!h2.blick && h2.reiter, "Dorf mit ✕ zu, danach ☰: wieder das normale Hauptmenü (früher blieb es beim Dorf hängen)", JSON.stringify(h2));
  await tippe('.sp-schnell [data-s="klappe"]'); await tick(300);

  console.log("\nGEBÄUDE ANTIPPEN: DIE STATION IM BILD\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(300);
  if (process.env.DBG) console.log(await pg.evaluate(() => { const b = document.querySelector('.sp-dorfland .sp-dl-haus[data-g="baeckerei"]'); b.scrollIntoView({ block: "nearest" }); const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return JSON.stringify({ r: [r.left, r.top, r.width, r.height], hit: e && e.closest(".sp-dl-haus") && e.closest(".sp-dl-haus").dataset.g, tag: e && e.tagName }); }));
  await tippe('.sp-dorfland .sp-dl-haus[data-g="baeckerei"]'); await tick(350);
  const st1 = await pg.evaluate(() => { const s = document.querySelector(".sp-sm-blick .sp-dl-station"); const l = document.querySelector(".sp-dorfland");
    const r = s && s.getBoundingClientRect(), lr = l.getBoundingClientRect();
    return { da: Boolean(s), name: s ? s.querySelector("b").textContent : "", aus: s ? (s.querySelector('[data-s="bauen"][data-w="baeckerei"]') || {}).textContent : "",
      liefern: s ? s.querySelectorAll('[data-s="abholen"],[data-s="liefern"]').length : 0, imBild: r ? r.top < lr.bottom - 10 && r.left >= lr.left && r.right <= lr.right : false,
      an: Boolean(document.querySelector('.sp-dl-haus.sp-an[data-g="baeckerei"]')) }; });
  if (B) await pg.screenshot({ path: B + "-station.png" });
  sage(st1.da && st1.name === "Bäckerei" && /Ausbauen auf Stufe 2/.test(st1.aus) && st1.an, "Tipp auf die Bäckerei: ihre Station öffnet sich im Bild – „Ausbauen auf Stufe 2“", JSON.stringify(st1));
  sage(st1.liefern >= 1 && st1.imBild, "die Station zeigt, was die Bäckerei gerade backt (Abholen), und ragt ins Bild", JSON.stringify(st1));
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippe('.sp-dl-station [data-s="bauen"][data-w="baeckerei"]'); await tick(400);
  const bau = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_bauen") || {}).args, stufe: (window.__ich.dorf.baeckerei || {}).stufe,
    klein: (document.querySelector('.sp-dl-station small') || {}).textContent || "" }));
  sage(bau.ruf && bau.ruf.p_was === "baeckerei" && /Stufe 2/.test(bau.klein), "Ausbauen aus dem Bild heraus: Server-Ruf, die Station zeigt Stufe 2", JSON.stringify(bau));
  await tippe('.sp-dorfland .sp-dl-haus[data-g="rathaus"]'); await tick(300);
  const st2 = await pg.evaluate(() => { const s = document.querySelector(".sp-dl-station"); return s ? { name: s.querySelector("b").textContent, knopf: (s.querySelector('[data-s="bauen"]') || {}).textContent } : null; });
  sage(st2 && st2.name === "Rathaus" && /Bauen/.test(st2.knopf), "Bauplatz „Rathaus“ antippen: Station mit „Bauen · 200 P“", JSON.stringify(st2));
  await tippe('.sp-dl-station [data-s="dorfwahl"]'); await tick(300);
  const zu1 = await pg.evaluate(() => Boolean(document.querySelector(".sp-dl-station")));
  sage(!zu1, "✕ an der Station schließt nur die Station, das Dorf bleibt", String(zu1));
  await tippe('.sp-schnellmenue [data-s="blickzu"]'); await tick(300);

  console.log("\nTRANK-KNOPF IN DER LEISTE\n");
  await pg.evaluate(() => { const ich = window.__ich; ich.trank_mana = 2; ich.trank_kraft = 1; ich.traenke = 1; ich.vorraete = Object.assign({}, ich.vorraete, { torte: 2 });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, ich); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);
  const tk = await pg.evaluate(() => { const r = document.querySelector(".sp-schnell .sp-s-reihe"), t = r.querySelector('[data-s="trankauf"]');
    const rr = r.getBoundingClientRect(), tr = t ? t.getBoundingClientRect() : null;
    return { da: Boolean(t), zahl: t ? t.querySelector("small").textContent : "", imBild: tr ? tr.right <= innerWidth && tr.left >= 0 : false, quer: r.scrollWidth - r.clientWidth, hoch: Math.round(rr.height) }; });
  sage(tk.da && tk.zahl === "6" && tk.imBild && tk.quer <= 1 && tk.hoch <= 50, "Flasche in der Leiste: 6 (Heiltrank, 2 Manatränke, Kraftelixier, 2 Torten), alles passt auf 360 px", JSON.stringify(tk));
  await tippe('.sp-schnell [data-s="trankauf"]'); await tick(300);
  const tw = await pg.evaluate(() => { const w = document.querySelector(".sp-trankwahl"); const r = w && w.getBoundingClientRect();
    return { da: Boolean(w), knoepfe: w ? [...w.querySelectorAll("button b")].map((b) => b.textContent).join(",") : "", imBild: r ? r.left >= 0 && r.right <= innerWidth && r.top >= 0 : false }; });
  if (B) await pg.screenshot({ path: B + "-traenke.png" });
  sage(tw.da && /Heiltrank/.test(tw.knoepfe) && /Manatrank/.test(tw.knoepfe) && /Torte/.test(tw.knoepfe) && tw.imBild, "Tipp: alle Tränke und die Torte zum sofortigen Trinken/Essen, ganz im Bild", JSON.stringify(tw));
  await pg.evaluate(() => { window.__rufe.length = 0; window.__extra.spiel_trinken = (a) => Object.assign({}, window.__ich, { ok: true, mana: 90 }); });
  await tippe('.sp-trankwahl [data-t="mana"]'); await tick(400);
  const tr1 = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_trinken") || {}).args, zu: !document.querySelector(".sp-trankwahl") }));
  sage(tr1.ruf && tr1.ruf.p_trank === "mana" && tr1.zu, "Manatrank antippen: getrunken (Server-Ruf), die Auswahl schließt", JSON.stringify(tr1));

  console.log("\nLANGER DRUCK: ZAUBER ODER WAFFEN\n");
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); });
  await tick(350);
  const lw = await pg.evaluate(() => { const w = document.querySelector(".sp-langwahl"); const r = w && w.getBoundingClientRect();
    return { da: Boolean(w), zauber: Boolean(w && w.querySelector('[data-s="langzauber"]')), waffen: Boolean(w && w.querySelector('[data-s="langwaffen"]')),
      imBild: r ? r.left >= 0 && r.right <= innerWidth && r.top >= 0 : false, radOffen: Boolean(document.querySelector(".sp-zauberrad")) }; });
  if (B) await pg.screenshot({ path: B + "-lang.png" });
  sage(lw.da && lw.zauber && lw.waffen && lw.imBild && !lw.radOffen, "langer Druck aufs eigene Bild: erst die Wahl „Zauber | Waffen“", JSON.stringify(lw));
  await pg.waitForTimeout(700);
  await tippe('.sp-langwahl [data-s="langzauber"]'); await tick(350);
  const zr = await pg.evaluate(() => { const z = document.querySelector(".sp-zauberrad"); const r = z && z.getBoundingClientRect();
    return { da: Boolean(z), tausch: z ? (z.querySelector('[data-s="radtausch"]') || {}).textContent : "", torte: Boolean(z && z.querySelector('[data-s="iss"][data-d="torte"]')),
      trank: Boolean(z && z.querySelector('[data-s="trinken"][data-t="mana"]')), bogen: Boolean(z && z.querySelector(".sp-zr-manabogen")), imBild: r ? r.left >= 0 && r.right <= innerWidth && r.top >= 0 : false }; });
  if (B) await pg.screenshot({ path: B + "-zauberrad.png" });
  sage(zr.da && /Waffen/.test(zr.tausch) && zr.imBild, "„Zauber“: das Zauberrad, oben „⇄ Waffen“", JSON.stringify(zr));
  sage(zr.torte && zr.trank && zr.bogen, "im Zauberrad: Mana-Bogen, Torte und Manatrank zum sofortigen Auffüllen", JSON.stringify(zr));
  await pg.waitForTimeout(700);
  await tippe('.sp-zauberrad [data-s="radtausch"]'); await tick(350);
  const wr = await pg.evaluate(() => { const w = document.querySelector(".sp-rad-voll:not(.sp-zauberrad):not(.sp-langwahl)");
    return { da: Boolean(w), waffen: w ? w.querySelectorAll('[data-s="radwahl"]').length : 0, tausch: w ? (w.querySelector('[data-s="radtausch"]') || {}).textContent : "", zauber: Boolean(document.querySelector(".sp-zauberrad")) }; });
  if (B) await pg.screenshot({ path: B + "-waffenrad.png" });
  sage(wr.da && wr.waffen >= 5 && /Zauber/.test(wr.tausch) && !wr.zauber, "⇄ Waffen: ins Waffenrad, dort „⇄ Zauber“ zurück", JSON.stringify(wr));
  await pg.waitForTimeout(700);
  await tippe('.sp-rad-voll [data-s="radtausch"]'); await tick(350);
  const zr2 = await pg.evaluate(() => Boolean(document.querySelector(".sp-zauberrad")));
  sage(zr2, "und wieder zurück ins Zauberrad", String(zr2));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.zrad = false; S.rad = null; window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  console.log("\nRÜSTUNG UNTER LEVEL UND MANA\n");
  const ring = await pg.evaluate(() => { const h = window.DMA_SPIEL.pruef.ringSvg ? window.DMA_SPIEL.pruef.ringSvg(0.8, 0, "#3aa655", 0.6, { ladung: 40, helm: 2, brust: 3, level: 12 }) : "";
    const i = (t) => h.indexOf(t); return { helm: i("sp-helm"), brust: i("sp-brust"), mana: i("sp-mana-voll"), lp: i("sp-lp-voll"), level: i("sp-level") }; });
  sage(ring.helm > 0 && ring.brust > 0 && ring.helm < ring.lp && ring.brust < ring.mana && ring.mana < ring.level, "Helm und Kürass werden zuerst gezeichnet – Lebenspunkte, Mana und Level liegen darüber", JSON.stringify(ring));

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.join(" | "));
  console.log("\nFassung 686 auf dem Telefon: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
