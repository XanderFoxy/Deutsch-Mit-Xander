#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 704: DAS DORF GEMALT (Funk 145/146/148)
   ---------------------------------------------------------------------
   XANDER (Funk 146): „nicht glatt wie Vektor Grafiken sondern richtig
   schön … wie bei einer Bitmap … weiche strukturierte natürliche Texturen
   bei den Häuserwänden oder bei den Dächern". Funk 148: „dass man auf
   einem Klick in das leere dieses kleine Panel wieder schließt".
   Geprüft auf einem Android-Telefon (360 px, echte Finger): das Dorf ist
   ein gemaltes Rasterbild (viele Farben, keine Vektorhäuser mehr), doppelt
   so groß wie das Fenster und mit dem Finger verschiebbar, Tipp aufs
   gemalte Haus öffnet es, Tipp in die Landschaft schließt es, beim
   Neuzeichnen wird NICHT neu gemalt, beim Ausbau schon, Rauch und
   Mühlenflügel bewegen sich, Leistung, Rückfall auf Vektor.
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

  console.log("\nGEMALT STATT VEKTOR\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
  let r = await pg.evaluate(() => { const lw = document.querySelector(".sp-dl-fenster canvas.sp-dl-mal"); if (!lw) return null;
    const g = lw.getContext("2d"), d = g.getImageData(0, 0, lw.width, lw.height).data, farben = new Set();
    for (let i = 0; i < d.length; i += 4 * 97) farben.add((d[i] >> 3) + "," + (d[i + 1] >> 3) + "," + (d[i + 2] >> 3));
    return { breite: lw.width, hoehe: lw.height, css: Math.round(lw.clientWidth), gemalt: lw.dataset.gemalt || "", farben: farben.size, vektorHaeuser: document.querySelectorAll(".sp-dorfland .sp-dl-haus > svg").length, zeit: window.DMA_SPIEL.pruef.dmZeit ? window.DMA_SPIEL.pruef.dmZeit() : null }; });
  sage(r && r.gemalt && r.farben > 800, "das Dorf ist ein gemaltes Rasterbild (viele Farbtöne, nicht flach)", JSON.stringify(r));
  sage(r && r.vektorHaeuser === 0, "keine Vektor-Häuser mehr im Bild");
  sage(r && r.breite >= 2 * r.css * .95, "scharf: das Bild hat mindestens doppelt so viele Pixel wie es breit ist", r && r.breite + " px auf " + r.css + " CSS-px");
  r = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster"), l = f.querySelector(".sp-dorfland"); return { fenster: f.clientWidth, bild: l.clientWidth, links: Math.round(f.scrollLeft), oben: Math.round(f.scrollTop) }; });
  sage(r.bild >= r.fenster * 1.9, "das Dorf ist doppelt so groß wie sein Fenster (Häuser gut zu erkennen)", JSON.stringify(r));
  sage(r.links > 0 && r.oben > 0, "am Anfang schaut man auf die Dorfmitte", JSON.stringify(r));
  const bak = await pg.evaluate(() => { const b = document.querySelector('.sp-dl-haus-gemalt[data-g="baeckerei"]').getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) }; });
  sage(bak.w >= 40, "ein Haus ist auf dem Telefon mindestens 40 px breit (vorher etwa 25)", JSON.stringify(bak));

  console.log("\nWISCHEN, TIPPEN, SCHLIESSEN (Funk 148)\n");
  const cdp = await ctx.newCDPSession(pg);
  const vor = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster"); window.__fenster = f; const b = f.getBoundingClientRect(); return { x: b.left + b.width * .7, y: b.top + b.height * .5, l: f.scrollLeft }; });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: vor.x, y: vor.y }] });
  for (let i = 1; i <= 8; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: vor.x - 12 * i, y: vor.y }] }); await tick(16); }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await tick(900);
  const nach = await pg.evaluate(() => Math.round(document.querySelector(".sp-dl-fenster").scrollLeft));
  await tick(1600);
  r = await pg.evaluate(() => ({ l: Math.round(document.querySelector(".sp-dl-fenster").scrollLeft), gleich: document.querySelector(".sp-dl-fenster") === window.__fenster }));
  sage(nach > vor.l + 30, "mit dem Finger nach links wischen schiebt das Dorf", Math.round(vor.l) + " → " + nach);
  sage(r.l === nach && r.gleich, "nach 1,6 s steht es noch da (kein Zurückspringen)", nach + " → " + r.l);
  await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster"), b = document.querySelector('.sp-dl-haus-gemalt[data-g="baeckerei"]'); f.scrollLeft = b.offsetLeft - 40; f.scrollTop = Math.max(0, b.offsetTop - 30); });
  await tick(300);
  const hb = await pg.evaluate(() => { const b = document.querySelector('.sp-dl-haus-gemalt[data-g="baeckerei"]').getBoundingClientRect(); return { x: b.left + b.width * .45, y: b.top + b.height * .6 }; });
  await pg.touchscreen.tap(hb.x, hb.y); await tick(700);
  r = await pg.evaluate(() => ({ wahl: window.DMA_SPIEL.pruef.zustand().dorfWahl, station: Boolean(document.querySelector(".sp-dl-station")), ring: getComputedStyle(document.querySelector('.sp-dl-haus-gemalt[data-g="baeckerei"]'), "::after").opacity }));
  sage(r.wahl === "baeckerei" && r.station && r.ring === "1", "Tipp aufs gemalte Haus öffnet die Bäckerei, goldener Ring am Boden", JSON.stringify(r));
  await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster"); f.scrollIntoView({ block: "nearest" }); }); await tick(300);
  const leer = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster").getBoundingClientRect(); const hs = [...document.querySelectorAll(".sp-dl-haus-gemalt")].map((e) => e.getBoundingClientRect());
    for (let y = f.top + 8; y < f.bottom - 8; y += 9) for (let x = f.left + 8; x < f.right - 8; x += 9) { if (!hs.some((b) => x >= b.left - 4 && x <= b.right + 4 && y >= b.top - 4 && y <= b.bottom + 14)) { const e = document.elementFromPoint(x, y); if (e && e.matches("canvas.sp-dl-mal")) return { x, y }; } } return null; });
  if (leer) { await pg.touchscreen.tap(leer.x, leer.y); await tick(600); }
  r = await pg.evaluate(() => ({ wahl: window.DMA_SPIEL.pruef.zustand().dorfWahl, station: Boolean(document.querySelector(".sp-dl-station")) }));
  sage(leer && r.wahl === "" && !r.station, "Tipp in die leere Landschaft schließt das Haus wieder", JSON.stringify(r) + " " + JSON.stringify(leer));

  console.log("\nNUR NEU MALEN, WENN SICH DAS DORF ÄNDERT\n");
  r = await pg.evaluate(async () => { const lw = document.querySelector("canvas.sp-dl-mal"); lw.__merk = 1; const g0 = lw.dataset.gemalt; const S = window.DMA_SPIEL.pruef.zustand();
    for (let i = 0; i < 5; i++) { S.ich = Object.assign({}, S.ich, { punkte: S.ich.punkte + 1 }); window.DMA_SPIEL.pruef.schnellZeichnen(true); await new Promise((o) => setTimeout(o, 50)); }
    const lw2 = document.querySelector("canvas.sp-dl-mal"); return { gleich: lw2 === lw && lw2.__merk === 1, sig: lw2.dataset.gemalt === g0 }; });
  sage(r.gleich && r.sig, "5× neu zeichnen (Punkte ändern sich): dieselbe Leinwand, nicht neu gemalt", JSON.stringify(r));
  r = await pg.evaluate(async () => { const lw = document.querySelector("canvas.sp-dl-mal"); const g0 = lw.dataset.gemalt; const S = window.DMA_SPIEL.pruef.zustand();
    S.ich = Object.assign({}, S.ich, { dorf: Object.assign({}, S.ich.dorf, { schule: { stufe: 2, lp: 40 } }) }); window.DMA_SPIEL.pruef.schnellZeichnen(true); await new Promise((o) => setTimeout(o, 100));
    const lw2 = document.querySelector("canvas.sp-dl-mal"); return { vorher: g0, nachher: lw2.dataset.gemalt }; });
  sage(r.nachher && r.nachher !== r.vorher && /sch2/.test(r.nachher), "Schule ausgebaut: das Bild wird neu gemalt (Stufe 2 mit Gaube)", r.vorher + " → " + r.nachher);
  r = await pg.evaluate(() => { const u = document.querySelector(".sp-dl-ueber"); return { qualm: u.querySelectorAll(".sp-dl-qualm").length, fluegel: u.querySelectorAll(".sp-dl-fluegel").length,
    dreht: [...u.querySelectorAll(".sp-dl-fluegel svg")].some((e) => e.getAnimations().some((a) => a.playState === "running")) }; });
  sage(r.qualm >= 6 && r.fluegel === 1 && r.dreht, "Rauch aus den Schornsteinen, die Mühlenflügel drehen sich (die kaputte Schmiede raucht nicht)", JSON.stringify(r));
  await pg.evaluate(() => { const f = document.querySelector(".sp-dl-fenster"); f.scrollLeft = f.scrollWidth * 150 / 320 - f.clientWidth / 2; f.scrollTop = f.scrollHeight * 105 / 200 - f.clientHeight / 2; f.scrollIntoView({ block: "start" }); }); await tick(500);
  await (await pg.$(".sp-dl-fenster")).screenshot({ path: (process.env.BILD || "/tmp/d704.png") });
  await pg.evaluate(() => { const lw = document.querySelector("canvas.sp-dl-mal"); const c = document.createElement("canvas"); c.id = "__voll"; c.width = lw.width; c.height = lw.height; c.getContext("2d").drawImage(lw, 0, 0);
    c.style.cssText = "position:fixed;left:0;top:0;width:" + Math.round(lw.width / 2) + "px;z-index:99999"; document.body.appendChild(c); });
  await (await pg.$("#__voll")).screenshot({ path: (process.env.BILD || "/tmp/d704.png").replace(/\.png$/, "-voll.png") });
  await pg.evaluate(() => document.getElementById("__voll").remove());

  console.log("\nLEISTUNG\n");
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const malen = await pg.evaluate(() => { const c = document.createElement("canvas"); const t0 = performance.now(); window.DMA_SPIEL.pruef.dorfMalen(c, window.DMA_SPIEL.pruef.zustand().ich.dorf, window.DMA_SPIEL.pruef.DORF_LAGE, 1232); return Math.round(performance.now() - t0); });
  const leistung = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand(); const z = [];
    for (let i = 0; i < 9; i++) { await new Promise((o) => setTimeout(o, 60)); const t0 = performance.now(); S.ich = Object.assign({}, S.ich, { punkte: (S.ich.punkte || 0) + 1 }); window.DMA_SPIEL.pruef.schnellZeichnen(true); z.push(performance.now() - t0); }
    z.sort((a, b) => a - b);
    const bilder = []; let letzt = performance.now(); const ende = letzt + 3000;
    await new Promise((ok) => { const f = (t) => { bilder.push(t - letzt); letzt = t; if (t < ende) requestAnimationFrame(f); else ok(); }; requestAnimationFrame(f); });
    return { zeichnen: Math.round(z[4]), bilder: bilder.length, lang: bilder.filter((x) => x > 50).length }; });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  sage(malen < 1500, "einmal malen (1232 px, 4× gedrosselt, wie ein mittleres Telefon) unter 1,5 s – danach aus dem Speicher", malen + " ms");
  sage(leistung.zeichnen < 120 && leistung.lang <= 5, "danach: Neuzeichnen (Median) unter 120 ms, höchstens 5 lange Bilder in 3 s", JSON.stringify(leistung));

  console.log("\nRÜCKFALL OHNE MALEN\n");
  r = await pg.evaluate(() => { try { localStorage.setItem("dma_dorf_vektor", "1"); } catch (e) {} window.DMA_SPIEL.pruef.dmNeu(); window.DMA_SPIEL.pruef.schnellZeichnen(true);
    const n = document.querySelectorAll(".sp-dorfland .sp-dl-haus > svg").length, lw = document.querySelector("canvas.sp-dl-mal"); try { localStorage.removeItem("dma_dorf_vektor"); } catch (e) {} window.DMA_SPIEL.pruef.dmNeu(); window.DMA_SPIEL.pruef.schnellZeichnen(true); return { vektor: n, leinwand: Boolean(lw) }; });
  sage(r.vektor > 5 && !r.leinwand, "mit dem Schalter dma_dorf_vektor kommt das alte Vektorbild (Rückfall)", JSON.stringify(r));
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 704 (Dorf gemalt): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
