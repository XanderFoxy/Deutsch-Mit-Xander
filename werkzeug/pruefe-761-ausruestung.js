#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 761: RUNDENKAMPF „FAUSTKAMPF" ODER „MIT AUSRÜSTUNG" (Walkie 290)
   ---------------------------------------------------------------------
   XANDER: „vorher ein Set von Waffen festlegen oder Eigenschaften
   Primärwaffen Sekundärwaffe … und wie machen wir das dass es dann
   trotzdem fair bleibt … oder wir machen halt zwei Versionen … eine
   normale … vielleicht ein Faustkampf und dann gibt es das mit Waffen".
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
    ich.vorraete = Object.assign({}, ich.vorraete, { brot: 5, fisch: 1 });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false; S.dorfTeil = ""; S.dorfWahl = "";
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  /* Die Uhr der Seite verstellen: der Zug fährt nach Date.now(). */
  await pg.evaluate(() => { const echt = Date.now.bind(Date); window.__echt = echt; window.__versatz = 0; Date.now = () => echt() + window.__versatz;
    const S = window.DMA_SPIEL.pruef.zustand(); S.wetterTest = { code: 1, tag: true, temp: 18, ort: "Test" }; });
  const setzeT = (z) => pg.evaluate((z) => { const echt = window.__echt(); window.__versatz = (z - (echt / 1000) % 60) * 1000; }, z);
  const P = await pg.evaluate(() => window.DMA_SPIEL.pruef.bahn.plan());
  const bahn = (sel) => pg.evaluate(() => {
    const svg = document.querySelector("svg.sp-dl-bahn"); if (!svg) return null;
    const zug = svg.querySelector(".sp-bz-zug"), lok = zug.querySelector(".sp-bz-f"), tr = lok.getAttribute("transform") || "";
    const m = tr.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
    const rad = zug.querySelectorAll(".sp-bz-rad")[2], lr = zug.querySelector(".lc-lok-rad-2");
    const rauch = [...svg.querySelectorAll(".sp-bz-rauch circle")].filter((c) => Number(c.getAttribute("r")) > 0 && Number(c.getAttribute("opacity")) > .02).length;
    return { da: zug.style.display !== "none", x: m ? Number(m[1]) : null, y: m ? Number(m[2]) : null, rad: rad ? rad.getAttribute("transform") : "", lokRad: lr ? lr.style.transform : "", rauch: rauch, teile: zug.querySelectorAll(".sp-bz-f").length };
  });
  const toene = (ab) => pg.evaluate((ab) => window.DMA_TONLOG.filter((t) => t.wann >= ab).map((t) => [t.name, t.wann - ab]), ab);
  const jetztMs = () => pg.evaluate(() => Math.round(performance.now()));

  console.log("\nAUSWAHL VOR DEM KAMPF\n");
  await pg.evaluate(() => { try { localStorage.removeItem("dma_strat_art"); localStorage.removeItem("dma_strat_set"); } catch (e) {}
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.waffen = ["kartoffel", "zwille", "bogen", "laser", "bazooka", "tomahawk"]; S.waffe = "bazooka"; S.ich.kampfklasse = null;
    window.DMA_SPIEL.pruef.extraOeffnen("strat"); });
  await tick(400);
  let R = await pg.evaluate(() => ({ arten: [...document.querySelectorAll(".sp-extra-strat [data-art]")].map((b) => b.dataset.art + (b.classList.contains("sp-an") ? "*" : "")), setVersteckt: document.querySelector(".sp-st-set").hidden }));
  sage(R.arten.join() === "faust*,ausruestung" && R.setVersteckt, "zwei Kampfarten, vorgewählt „Faustkampf“ (Set ausgeblendet)", JSON.stringify(R));
  await tippe('.sp-extra-strat [data-art="ausruestung"]'); await tick(200);
  R = await pg.evaluate(() => { const s = document.querySelector(".sp-st-set"); return { sicht: !s.hidden, prim: s.querySelector('[data-set="prim"]').value, primText: s.querySelector('[data-set="prim"]').selectedOptions[0].textContent,
    eig: [...s.querySelectorAll("[data-eig].sp-an")].map((b) => b.dataset.eig), anzahl: s.querySelectorAll("[data-eig]").length }; });
  sage(R.sicht && R.prim === "bazooka" && /\+4/.test(R.primText) && R.anzahl === 6 && R.eig.length === 3, "„Mit Ausrüstung“: Set sichtbar, Primärwaffe Bazooka (+4), 6 Eigenschaften, 3 vorgewählt", JSON.stringify(R));
  await pg.evaluate(() => { const s = document.querySelector('.sp-st-set [data-set="sek"]'); s.value = "tomahawk"; s.dispatchEvent(new Event("change", { bubbles: true })); });
  await tick(200);
  await pg.evaluate(() => { window.__hinweise.length = 0; });
  await tippe('.sp-st-set [data-eig="wut"]'); await tick(200);
  R = await pg.evaluate(() => ({ meld: window.__hinweise.slice(-1)[0] || "", eig: [...document.querySelectorAll(".sp-st-set [data-eig].sp-an")].map((b) => b.dataset.eig) }));
  sage(/Höchstens drei/.test(R.meld) && R.eig.indexOf("wut") < 0, "eine vierte Eigenschaft geht nicht („Höchstens drei …“)", JSON.stringify(R));
  await tippe('.sp-st-set [data-eig="eisenhaut"]'); await tippe('.sp-st-set [data-eig="wut"]'); await tick(200);
  R = await pg.evaluate(() => ({ eig: [...document.querySelectorAll(".sp-st-set [data-eig].sp-an")].map((b) => b.dataset.eig).sort().join(), gemerkt: localStorage.getItem("dma_strat_set"), art: localStorage.getItem("dma_strat_art"),
    breit: document.documentElement.scrollWidth <= innerWidth, eng: [...document.querySelectorAll(".sp-st-eigen button")].every((b) => b.scrollWidth <= b.clientWidth + 1) }));
  sage(R.eig === "heilkunde,schildwall,wut" && /tomahawk/.test(R.gemerkt) && R.art === "ausruestung", "Set gemerkt: Bazooka + Tomahawk, Heilkunde, Schildwall, Wut", JSON.stringify(R));
  sage(R.breit && R.eng, "auf 360 px nichts zu breit, kein Text abgeschnitten", JSON.stringify({ breit: R.breit, eng: R.eng }));
  if (process.env.BILD) await (await pg.$(".sp-extra-strat")).screenshot({ path: process.env.BILD + "-wahl.png" });

  console.log("\nKAMPF MIT AUSRÜSTUNG GEGEN DEN COMPUTER\n");
  await tippe('.sp-extra-strat [data-st="computer"]'); await tick(600);
  R = await pg.evaluate(() => { const ST = window.DMA_SPIEL.pruef.st(); const kn = [...document.querySelectorAll(".sp-st-aktionen [data-ak]")];
    return { art: ST.kampfart, knoepfe: kn.map((b) => b.dataset.ak), angriff: (kn.find((b) => b.dataset.ak === "angriff") || {}).textContent, zweit: (kn.find((b) => b.dataset.ak === "zweit") || {}).textContent,
      heilen: (kn.find((b) => b.dataset.ak === "heilen") || {}).textContent, fair: (document.querySelector(".sp-sa-fair") || {}).textContent, erSet: ST.er.set && ST.er.set.eig.join() }; });
  sage(R.art === "ausruestung" && R.knoepfe.indexOf("zweit") >= 0 && /16 Schaden.*Bazooka/.test(R.angriff) && /17 Schaden.*Tomahawk.*1 Stern/.test(R.zweit) && /\+18 LP/.test(R.heilen), "Knöpfe zeigen die Ausrüstung: Angriff 16 (Bazooka), Zweitwaffe 17 (Tomahawk, 1 Stern), Heilen +18", JSON.stringify(R));
  sage(/Mit Ausrüstung: Bazooka \+ Tomahawk · Heilkunde, Schildwall, Wut/.test(R.fair) && R.erSet, "unter der Bühne steht das Set; der Computer hat auch eins", R.fair);
  R = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, ST = P.st(), w = ST.ich; const r = {};
    w.lp = 60; w.sterne = 2; r.angriff = P.stratWirkung(w, "angriff", 1); r.zweit = P.stratWirkung(w, "zweit", 1); r.sterneNach = w.sterne;
    w.lp = 25; r.wut = P.stratWirkung(w, "angriff", 1);
    w.lp = 20; P.stratWirkung(w, "heilen", 1); r.heil = w.lp; w.schild = 0; P.stratWirkung(w, "schild", 1); r.schild = w.schild;
    const f = { lp: 60, schild: 0, sterne: 0 }; r.faust = P.stratWirkung(f, "angriff", 1);
    return r; });
  sage(R.angriff === 16 && R.zweit === 17 && R.sterneNach === 1 && R.wut === 20 && R.heil === 38 && R.schild === 15 && R.faust === 12, "Rechnung: 16 / 17 (−1 Stern) / Wut 20 / Heilen +18 / Schild +15; ohne Set 12", JSON.stringify(R));
  if (process.env.BILD) await (await pg.$(".sp-extra-strat")).screenshot({ path: process.env.BILD + "-kampf.png" });

  console.log("\nFAUSTKAMPF BLEIBT WIE BISHER\n");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.extraOeffnen("strat"); }); await tick(300);
  await tippe('.sp-extra-strat [data-art="faust"]'); await tippe('.sp-extra-strat [data-st="computer"]'); await tick(500);
  R = await pg.evaluate(() => { const ST = window.DMA_SPIEL.pruef.st(); return { art: ST.kampfart, set: !!ST.ich.set, zweit: !!document.querySelector('.sp-st-aktionen [data-ak="zweit"]'), angriff: (document.querySelector('.sp-st-aktionen [data-ak="angriff"]') || {}).textContent, fair: (document.querySelector(".sp-sa-fair") || {}).textContent }; });
  sage(R.art === "faust" && !R.set && !R.zweit && /12 Schaden/.test(R.angriff) && /Faustkampf/.test(R.fair), "Faustkampf: kein Set, keine Zweitwaffe, Angriff 12 – nur Deutsch zählt", JSON.stringify(R));

  console.log("\nEINLADUNG TRÄGT DIE KAMPFART\n");
  R = await pg.evaluate(() => { window.DMA_SPIEL.pruef.extraOeffnen("strat"); try { localStorage.setItem("dma_strat_art", "ausruestung"); } catch (e) {}
    window.DMA_SPIEL.pruef.extraOeffnen("strat"); const b = document.querySelector('.sp-extra-strat [data-st]:not([data-st="computer"])'); if (!b) return null; window.__raus.length = 0; b.click();
    const e = window.__raus.find((x) => x && x.ereignis === "strat" && x.typ === "einladung"); return e ? { kampfart: e.kampfart } : { keine: true }; });
  sage(R === null || (R && R.kampfart === "ausruestung"), "die Einladung sagt „mit Ausrüstung“ (sofern jemand im Raum ist)", JSON.stringify(R));
  R = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; document.querySelectorAll(".sp-frage").forEach((x) => x.remove());
    P.stratEmpfangen({ ereignis: "strat", typ: "einladung", an: "", von: "gast1", partie: "p1", name: "Emy", modus: "zug", lv: 5, kampfart: "ausruestung" });
    return (document.querySelector(".sp-frage .sp-frage-text") || {}).textContent || ""; });
  sage(/mit Ausrüstung/.test(R), "eingeladen werden: „… mit Ausrüstung – dein Set aus dem Rundenkampf-Menü …“", R);
  await pg.evaluate(() => document.querySelectorAll(".sp-frage").forEach((x) => x.remove()));

  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 761 (Faustkampf / mit Ausrüstung): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
