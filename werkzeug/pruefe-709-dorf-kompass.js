#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 709: DAS DORF KLEIN WIE VORHER, MIT KOMPASS (Funk 150/152)
   ---------------------------------------------------------------------
   XANDER (Funk 152): „die Karte des Dorfes ist immer noch nicht so klein
   wie sie vorher war … kleiner und kompakter so wie es vorher war".
   Funk 150: „wenn wir das größer haben wollen dann gibt es so einen
   kleinen Kompass … die entsprechenden Symbole … wie auf solchen Google
   Maps Karten dass man sieht okay das eine ist eine Bäckerei das andere
   ist eine Mühle".
   Geprüft auf einem Android-Telefon (360 px, echte Finger): am Anfang das
   ganze Dorf in voller Breite (16:10, nichts zu wischen), an jedem Haus
   sein Kartenzeichen; der Kompass öffnet die Karte mit Zeichen und Namen;
   ein Tipp auf die Bäckerei holt einen dorthin (doppelt so groß) und
   öffnet sie; der Rahmen in der Karte zeigt den Ausschnitt; „Ganzes
   Dorf" zurück; Doppeltipp in die Landschaft zoomt; kein neues Malen.
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
  const bild = async (name) => { if (!process.env.BILD) return; await pg.evaluate(() => document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "start" })); await tick(350); await (await pg.$(".sp-dl-rahmen")).screenshot({ path: process.env.BILD + "-" + name + ".png" }); };
  const lage = () => pg.evaluate(() => { const r = document.querySelector(".sp-dl-rahmen"), f = r.querySelector(".sp-dl-fenster"), l = f.querySelector(".sp-dorfland");
    return { klasse: r.className, fw: f.clientWidth, fh: f.clientHeight, lw: l.clientWidth, sw: f.scrollWidth, sl: Math.round(f.scrollLeft), st: Math.round(f.scrollTop), gemalt: (f.querySelector("canvas.sp-dl-mal") || {}).dataset.gemalt || "" }; });

  console.log("\nAM ANFANG: DAS GANZE DORF, KLEIN WIE VORHER\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1200);
  let r = await lage();
  sage(/sp-dl-ganz/.test(r.klasse) && Math.abs(r.lw - r.fw) <= 1 && r.sw <= r.fw + 1, "das ganze Dorf passt ins Fenster (nichts zu wischen)", JSON.stringify(r));
  sage(Math.abs(r.fh / r.fw - .625) < .02, "Format 16:10 wie vor 704 (volle Breite, nicht höher)", (r.fh / r.fw).toFixed(3));
  const gemalt0 = r.gemalt;
  r = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(), d = S.ich.dorf; const gebaut = Object.keys(d).filter((k) => d[k].stufe > 0).length;
    const pins = [...document.querySelectorAll(".sp-dl-haus-gemalt:not(.sp-dl-bauplatz) small .sp-dl-pin")]; const namen = [...document.querySelectorAll(".sp-dl-haus-gemalt small span")].filter((e) => e.getBoundingClientRect().width > 0).length;
    return { gebaut, pins: pins.length, groesse: pins.length ? Math.round(pins[0].getBoundingClientRect().width) : 0, sichtbareNamen: namen }; });
  sage(r.pins === r.gebaut && r.groesse >= 12 && r.sichtbareNamen === 0, "an jedem Haus sein Kartenzeichen, keine Namensschilder (Karte von weitem)", JSON.stringify(r));
  await bild("ganz");

  console.log("\nDER KOMPASS: KARTE MIT ZEICHEN UND NAMEN\n");
  r = await pg.evaluate(() => { const k = document.querySelector(".sp-dl-kompass").getBoundingClientRect(); const e = document.elementFromPoint(k.left + k.width / 2, k.top + k.height / 2); return { w: Math.round(k.width), oben: Boolean(e && e.closest(".sp-dl-kompass")) }; });
  sage(r.w >= 32 && r.oben, "der Kompass liegt unten rechts im Bild, 34 px, nichts liegt darüber", JSON.stringify(r));
  await tippe(".sp-dl-kompass"); await tick(500);
  r = await pg.evaluate(() => { const k = document.querySelector(".sp-dl-karte"); if (!k) return null; const b = k.querySelector("canvas.sp-dl-karte-bild"); let bunt = 0;
    try { const d = b.getContext("2d").getImageData(0, 0, b.width, b.height).data; for (let i = 0; i < d.length; i += 4 * 211) if (d[i + 3] > 0) bunt++; } catch (e) {}
    const pins = [...k.querySelectorAll(".sp-dl-kpin")]; return { pins: pins.length, namen: pins.map((p) => p.textContent), klein: Math.min(...pins.map((p) => Math.min(p.getBoundingClientRect().width, p.getBoundingClientRect().height))), bild: bunt }; });
  sage(r && r.pins === 12 && r.namen.includes("Bäckerei") && r.namen.includes("Mühle"), "die Karte zeigt alle 12 Gebäude mit Zeichen und Namen (Bäckerei, Mühle …)", r && r.namen.join(", "));
  sage(r && r.bild > 50, "in der Karte ist das gemalte Dorf in klein zu sehen", r && r.bild + " Stichproben");
  sage(r && r.klein >= 26, "jedes Zeichen ist groß genug für den Finger", r && r.klein + " px");
  await bild("karte");

  console.log("\nTIPP AUF DIE BÄCKEREI: DORTHIN, NÄHER RAN\n");
  await tippe('.sp-dl-kpin[data-g="baeckerei"]'); await tick(700);
  r = await lage();
  const b = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster").getBoundingClientRect(), h = document.querySelector('.sp-dl-haus-gemalt[data-g="baeckerei"]').getBoundingClientRect();
    return { drin: h.left >= f.left - 2 && h.right <= f.right + 2 && h.top >= f.top - 2 && h.bottom <= f.bottom + 2, breit: Math.round(h.width), wahl: window.DMA_SPIEL.pruef.zustand().dorfWahl, karte: Boolean(document.querySelector(".sp-dl-karte")),
      name: [...document.querySelectorAll('.sp-dl-haus-gemalt[data-g="baeckerei"] small span')].map((e) => e.getBoundingClientRect().width > 0)[0], gemerkt: localStorage.getItem("dma_dorf_nah") }; });
  sage(/sp-dl-nah/.test(r.klasse) && r.lw >= r.fw * 1.9, "näher ran: das Dorf ist doppelt so groß", JSON.stringify(r));
  sage(b.drin && b.breit >= 40, "die Bäckerei ist mitten im Bild und gut zu erkennen", JSON.stringify(b));
  sage(b.wahl === "baeckerei" && !b.karte && b.name, "sie ist gleich geöffnet, die Karte zu, jetzt mit Namensschild", JSON.stringify(b));
  sage(r.gemalt === gemalt0, "beim Zoomen wird nicht neu gemalt (dasselbe Bild, nur größer)", r.gemalt);
  sage(b.gemerkt === "1", "die Zoomstufe wird auf dem Gerät gemerkt", b.gemerkt);
  await bild("nah");

  console.log("\nIM KOMPASS SIEHT MAN, WO MAN IST\n");
  await tippe(".sp-dl-kompass"); await tick(400);
  const r1 = await pg.evaluate(() => { const b = document.querySelector(".sp-dl-karte-blick"); return b ? { l: parseFloat(b.style.left), w: parseFloat(b.style.width) } : null; });
  await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster"); f.scrollLeft = f.scrollWidth - f.clientWidth; }); await tick(300);
  const r2 = await pg.evaluate(() => { const b = document.querySelector(".sp-dl-karte-blick"); return b ? { l: parseFloat(b.style.left), w: parseFloat(b.style.width) } : null; });
  sage(r1 && r1.w > 40 && r1.w < 60, "der rote Rahmen zeigt den Ausschnitt (etwa die Hälfte)", JSON.stringify(r1));
  sage(r2 && r2.l > r1.l + 10, "wischt man nach rechts, wandert der Rahmen mit", JSON.stringify({ r1, r2 }));
  await pg.evaluate(() => { window.__zoomAnim = 0; const alt = Element.prototype.animate; Element.prototype.animate = function (k, o) { if (this.classList && this.classList.contains("sp-dorfland")) window.__zoomAnim++; return alt.call(this, k, o); }; });
  await tippe('.sp-dl-karte [data-s="dorfzoom"]'); await tick(150);
  const anim = await pg.evaluate(() => window.__zoomAnim);
  await tick(600);
  r = await lage();
  sage(/sp-dl-ganz/.test(r.klasse) && Math.abs(r.lw - r.fw) <= 1 && anim >= 1, "„Ganzes Dorf“: wieder alles im Blick, weich gezoomt", JSON.stringify({ klasse: r.klasse, anim }));

  console.log("\nDOPPELTIPP IN DIE LANDSCHAFT\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; window.DMA_SPIEL.pruef.schnellZeichnen(true); document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "center", behavior: "instant" }); }); await tick(1500);
  const p = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster").getBoundingClientRect(); const hs = [...document.querySelectorAll(".sp-dl-haus-gemalt, .sp-dl-kompass, .sp-dw-schild")].map((e) => e.getBoundingClientRect());
    /* Chrome rastet einen Fingertipp auf einen nahen Knopf ein – deshalb 22 px Abstand zu jedem Haus. */
    for (let y = f.top + f.height * .3; y < f.bottom - 20; y += 5) for (let x = f.left + f.width * .5; x < f.right - 44; x += 5) { if (!hs.some((b) => x >= b.left - 22 && x <= b.right + 22 && y >= b.top - 22 && y <= b.bottom + 22)) { const e = document.elementFromPoint(x, y); if (e && e.matches("canvas.sp-dl-mal")) return { x, y, fx: (x - f.left) / f.width, fy: (y - f.top) / f.height }; } } return null; });
  if (p) { await pg.touchscreen.tap(p.x, p.y); await tick(120); await pg.touchscreen.tap(p.x, p.y); await tick(700); }
  r = await lage();
  const zmitte = p && { fx: (r.sl + r.fw / 2) / r.lw, fy: (r.st + r.fh / 2) / (r.lw * .625) };
  sage(p && /sp-dl-nah/.test(r.klasse) && Math.abs(zmitte.fx - p.fx) < .15, "zweimal schnell in die freie Landschaft: näher ran, genau dort", JSON.stringify({ p, zmitte }));
  await pg.evaluate(() => window.DMA_SPIEL.pruef.dorfZoom(false)); await tick(500);

  console.log("\nTELEFON: NICHTS RAGT HERAUS\n");
  r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); return { quer: m.scrollWidth - m.clientWidth, raus: [...document.querySelectorAll(".sp-dl-rahmen *")].filter((e) => { const b = e.getBoundingClientRect(); return b.width && b.right > innerWidth + 1; }).length }; });
  sage(r.quer <= 1 && r.raus === 0, "360 px: nichts ragt heraus", JSON.stringify(r));
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 709 (Dorf klein, Kompass): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
