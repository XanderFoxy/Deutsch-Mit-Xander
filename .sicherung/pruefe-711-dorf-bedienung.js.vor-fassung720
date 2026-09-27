#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 711: DORF-BEDIENUNG UND NACHT (Funk 158)
   ---------------------------------------------------------------------
   XANDER (Funk 158): „Das Dorf soll in der kleinen Sicht ohne die Symbole
   sein man kann die Symbole … optional dazu schalten", „wenn man oben ist
   kommt man z.B nicht ganz runter … das bricht da irgendwie ab", „muss man
   das Dorf auch irgendwie schließen können", „per Klick einfach automatisch
   einsammelt dort wo fertig steht", „dass man die Nacht besser erkennt mit
   den Laternen … realistischer Himmel der wie Nacht aussieht".
   Geprüft auf einem Android-Telefon (360 px, echte Finger).
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
  const bild = async (name) => { if (!process.env.BILD) return; await pg.evaluate(() => document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "start" })); await tick(350); await (await pg.$(".sp-dl-rahmen")).screenshot({ path: process.env.BILD + "-" + name + ".png" }); };

  console.log("\nKLEINE SICHT OHNE ZEICHEN – ZUSCHALTBAR\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1200);
  let r = await pg.evaluate(() => [...document.querySelectorAll(".sp-dl-haus-gemalt small")].filter((e) => e.getBoundingClientRect().width > 0).length);
  sage(r === 0, "ganzes Dorf: keine Zeichen im Bild", r + " sichtbar");
  await tippe(".sp-dl-kompass"); await tick(300);
  await tippe('.sp-dl-karte [data-s="dorfzeichen"]'); await tick(300);
  r = await pg.evaluate(() => ({ n: [...document.querySelectorAll(".sp-dl-haus-gemalt small .sp-dl-pin")].filter((e) => e.getBoundingClientRect().width > 0).length, gemerkt: localStorage.getItem("dma_dorf_zeichen") }));
  sage(r.n >= 6 && r.gemerkt === "1", "im Kompass „Zeichen“ antippen: die Zeichen erscheinen, gemerkt", JSON.stringify(r));
  await tippe('.sp-dl-karte [data-s="dorfzeichen"]'); await tick(200);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfKarte = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(200);

  console.log("\nWISCHEN AUF DEM BILD SCROLLT DAS MENÜ\n");
  const cdp = await ctx.newCDPSession(pg);
  const wisch = async (dy) => { const m = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster").getBoundingClientRect(); return { x: f.left + f.width * .5, y: f.top + f.height * .5 }; });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: m.x, y: m.y }] });
    for (let i = 1; i <= 10; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: m.x, y: m.y + dy * i / 10 }] }); await tick(16); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await tick(700); };
  await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); m.scrollTop = 0; }); await tick(200);
  const vor = await pg.evaluate(() => document.querySelector(".sp-schnellmenue").scrollTop);
  await wisch(-120);
  const nach = await pg.evaluate(() => document.querySelector(".sp-schnellmenue").scrollTop);
  sage(nach > vor + 40, "Finger auf dem Dorfbild nach oben wischen: das Menü scrollt weiter (vorher blieb es hängen)", vor + " → " + nach);
  r = await pg.evaluate(() => { window.DMA_SPIEL.pruef.dorfZoom(true, .5, .5); const f = document.querySelector(".sp-dl-fenster"); return getComputedStyle(f).overscrollBehaviorY; });
  sage(r === "auto", "näher dran: am Rand des Dorfes geht das Wischen im Menü weiter", r);
  await pg.evaluate(() => window.DMA_SPIEL.pruef.dorfZoom(false)); await tick(400);

  console.log("\nWO „FERTIG“ STEHT: ANTIPPEN SAMMELT EIN\n");
  await pg.evaluate(() => { window.__rufe.length = 0; window.__hinweise.length = 0; const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; window.DMA_SPIEL.pruef.schnellZeichnen(true); document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "center", behavior: "instant" }); });
  await tick(500);
  r = await pg.evaluate(() => Boolean(document.querySelector('.sp-dl-haus-gemalt[data-g="baeckerei"] .sp-ds-fertig')));
  sage(r, "an der Bäckerei steht „fertig“", String(r));
  await tippe('.sp-dl-haus-gemalt[data-g="baeckerei"]'); await tick(600);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_werk_abholen").map((x) => x.args.p_gebaeude), station: window.DMA_SPIEL.pruef.zustand().dorfWahl, meld: window.__hinweise.slice(-1)[0] || "" }));
  sage(r.ruf.join() === "baeckerei" && !r.station && /abgeholt/.test(r.meld), "ein Tipp auf die Bäckerei holt das Brot ab – ohne erst die Station zu öffnen", JSON.stringify(r));
  await tippe('.sp-dl-haus-gemalt[data-g="baeckerei"]'); await tick(500);
  r = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().dorfWahl);
  sage(r === "baeckerei", "nichts mehr fertig: der nächste Tipp öffnet die Bäckerei wie gewohnt", r);
  await pg.evaluate(() => { window.__rufe.length = 0; const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(300);
  await tippe('.sp-dl-haus-gemalt[data-g="kuhstall"]'); await tick(500);
  r = await pg.evaluate(() => window.__rufe.filter((x) => x.name === "spiel_melken").length);
  sage(r === 1, "Kuhstall mit Milch: ein Tipp melkt", r + " Ruf");

  console.log("\nSCHLIESSEN UND ZURÜCK\n");
  await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); m.scrollTop = 0; }); await tick(300);
  r = await pg.evaluate(() => { const f = document.querySelector(".sp-dorf-fuss"), m = document.querySelector(".sp-schnellmenue"); if (!f) return null; const a = f.getBoundingClientRect(), b = m.getBoundingClientRect(); return { sichtbar: a.bottom <= b.bottom + 1 && a.top >= b.top, text: f.textContent }; });
  sage(r && r.sichtbar && /Zum Dorfbild/.test(r.text) && /Dorf schließen/.test(r.text), "unten im Dorf steht immer: „↑ Zum Dorfbild“ und „✕ Dorf schließen“", JSON.stringify(r));
  await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); m.scrollTop = m.scrollHeight; }); await tick(400);
  await tippe('.sp-dorf-fuss [data-s="dorfnachoben"]'); await tick(900);
  r = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-rahmen").getBoundingClientRect(), m = document.querySelector(".sp-schnellmenue").getBoundingClientRect(); return { oben: Math.round(f.top - m.top) }; });
  sage(Math.abs(r.oben) < 60, "„↑ Zum Dorfbild“ bringt das Bild wieder nach oben", JSON.stringify(r));
  await tippe('.sp-dorf-fuss [data-s="blickzu"]'); await tick(400);
  r = await pg.evaluate(() => ({ menue: window.DMA_SPIEL.pruef.zustand().schnellMenue, dorf: Boolean(document.querySelector(".sp-dl-rahmen")) }));
  sage(!r.menue && !r.dorf, "„✕ Dorf schließen“ schließt das Dorf", JSON.stringify(r));

  console.log("\nNACHT: ECHTER HIMMEL, LATERNEN\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.wetterTest = { code: 0, tag: false, temp: 9, ort: "Döbeln" }; });
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1500);
  r = await pg.evaluate(() => { const lw = document.querySelector("canvas.sp-dl-mal"), g = lw.getContext("2d"), W = lw.width, H = lw.height;
    const px = (fx, fy) => { const d = g.getImageData(Math.round(fx * W), Math.round(fy * H), 1, 1).data; return [d[0], d[1], d[2]]; };
    const hell = (p) => p[0] + p[1] + p[2];
    const himmel = px(.03, .03), wiese = px(.1, .8), later = px((148 + 1.2) / 320, (99 - 5.6) / 200);
    return { sig: lw.dataset.gemalt, himmel, himmelHell: hell(himmel), wieseHell: hell(wiese), laterne: later, overlay: getComputedStyle(document.querySelector(".sp-dn")).backgroundImage }; });
  sage(/N@/.test(r.sig) && r.himmelHell < 45, "der Himmel ist nachtschwarz (nicht hellblau übertüncht)", JSON.stringify({ himmel: r.himmel, sig: r.sig }));
  sage(r.wieseHell > r.himmelHell * 3, "unten bleibt alles gut zu erkennen (Wiese deutlich heller als der Himmel)", JSON.stringify({ wiese: r.wieseHell, himmel: r.himmelHell }));
  sage(r.laterne[0] > 180 && r.laterne[0] > r.laterne[2] + 40, "die Laternen an den Wegen brennen warm", JSON.stringify(r.laterne));
  sage(r.overlay === "none", "keine blaue Schicht mehr über dem ganzen Bild", r.overlay);
  await bild("nacht");
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 711 (Dorf-Bedienung): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
