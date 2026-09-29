#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 823: DER BAHNHOF IN EINEM KOMPAKTEN FENSTER
   ---------------------------------------------------------------------
   XANDER: „Was macht zum Beispiel der Screen vom Bahnhof. Da ist jetzt
   Export vier Mehl verladen Import acht Erz kaufen und das nimmt mir die
   ganze Sicht weg und wenn ich auf eins klicke, dann muss ich noch mal
   auf dem Bahnhof um auch den Export zu machen und dann muss ich noch mal
   auf den Bahnhof, um dann auch festzulegen, ob die Touristen zu mir
   kommen können und das ist ein bisschen viel für eine Sache, die dich
   da mit einmal regeln will".
   Geprüft auf einem Android-Telefon (360 × 740, echte Finger), das Spiel
   mit nachgebautem Server (Aufbau wie Sonde 817), an allen drei Stellen,
   an denen der Bahnhof aufgeht: im alten Dorfbild, in der neuen Stadt im
   kleinen Rahmen und in der neuen Stadt im Vollbild (hoch und quer):
   – EIN Tipp auf den Bahnhof: Export, Import und Touristen stehen
     zugleich ganz im Bild;
   – das Fenster ist höchstens halb so hoch wie der Bildschirm, die
     Stadt mit dem Bahnhof bleibt daneben zu sehen (nicht verdeckt);
   – Export, Import und Touristen nacheinander tippen, OHNE den Bahnhof
     noch einmal anzutippen und ohne zu rollen (das Fenster bleibt offen
     und steht still); dieselben Serverfunktionen (spiel_bahn);
   – „Touristen: an/aus“ legt fest, ob sie (mit jedem Zug) kommen;
   – ✕ schließt klar; Tippflächen ≥ 30 px, nichts überlappt, nichts ragt
     über den Rand, keine Emoji-Grafiken im Fenster.
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/fassung-setzen.js --nur-stempel
           node werkzeug/pruefe-823-bahnhof-fenster.js   (BILD=/pfad/f823 für Bilder)
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
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e) + (process.env.STAPEL ? " @ " + String(e.stack || "").split("\n").slice(1, 4).join(" | ") : "")));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} window.LEICHT_FREI = true; });
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

  const lage = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height, vis: getComputedStyle(e).visibility }; }, sel);
  const stadtFrame = () => pg.frames().find((x) => /stadt-leicht\.html/.test(x.url()));
  const imFrame = async (fn, arg) => { const f = stadtFrame(); if (!f) return null; try { return await f.evaluate(fn, arg); } catch (e) { return null; } };

  /* ---------------- FASSUNG 823 ---------------- */
  const BILD = process.env.BILD || "";
  const knipsen = async (n) => { if (BILD) await pg.screenshot({ path: BILD + "-" + n + ".png" }); };
  const stand = (fn) => pg.evaluate((f) => { const g = new Function("ich", f); g(window.__ich); g(window.DMA_SPIEL.pruef.zustand().ich); window.DMA_SPIEL.pruef.schnellZeichnen(true); }, fn);
  const rufe = (name) => pg.evaluate((n) => window.__rufe.filter((r) => r.name === n).map((r) => r.args), name);
  await pg.evaluate(() => {
    const ich = window.__ich;
    /* „Export: 4 Mehl verladen“, „Import: 8 Erz kaufen“ und Touristen – wie bei Xander */
    window.__neuZug = () => ({ slot: 5, bis: new Date(Date.now() + 900000).toISOString(),
      export: { ware: "mehl", menge: 4, erloes: 30, erledigt: false }, import: { ware: "erz", menge: 8, kosten: 40, erledigt: false },
      touristen: { anzahl: 7, kurtaxe: 14, taxe: 2, platz: 10, erledigt: false, beliebtheit: { wert: 30, wahrzeichen: 0, gasthaus: 0, deutsch: 5, ruf: 0 } },
      reise: { leute: 3, kosten: 12, forschung: 6, erledigt: false }, gaeste: [] });
    window.__zug = window.__neuZug();
    const kopie = (x) => JSON.parse(JSON.stringify(x));
    window.__extra = Object.assign(window.__extra || {}, {
      spiel_markt_preise: () => ({ ok: true, preise: {} }), spiel_angebote_liste: () => ({ ok: true, angebote: [] }),
      spiel_bahn_info: () => window.__zug,
      spiel_bahn: (a) => {
        const z = window.__zug;
        if (a.p_art === "export") { ich.punkte += 30; ich.vorraete.mehl -= 4; z.export.erledigt = true; return Object.assign(kopie(ich), { ok: true, art: "export", ware: "mehl", menge: 4, erloes: 30, zug: z }); }
        if (a.p_art === "import") { ich.punkte -= 40; ich.vorraete.erz = (ich.vorraete.erz || 0) + 8; z.import.erledigt = true; return Object.assign(kopie(ich), { ok: true, art: "import", ware: "erz", menge: 8, kosten: 40, zug: z }); }
        ich.punkte += 34; z.touristen.erledigt = true;
        return Object.assign(kopie(ich), { ok: true, art: "touristen", anzahl: 7, kurtaxe: 14, gekauft: 3, erloes: 34, zug: z });
      }
    });
  });
  await stand("ich.punkte = 900; ich.werk = {}; ich.vorraete = Object.assign({}, ich.vorraete, { mehl: 6, brot: 3, getreide: 2 }); delete ich.dorf.kuhstall;");
  /* frischer Zug, Bahnhof zu, Einstellung „Touristen“ aus */
  const neuerZug = () => pg.evaluate(() => {
    window.__zug = window.__neuZug(); window.__rufe.length = 0; window.__hinweise.length = 0;
    try { localStorage.removeItem("dma_bahn_touristen"); } catch (e) {}
    const S = window.DMA_SPIEL.pruef.zustand(); S.bahn = null; S.bahnZeit = 0; S.bahnVersuch = 0; S.bahnAuto = null; S.dorfWahl = "";
    for (const ich of [window.__ich, S.ich]) { ich.punkte = 900; ich.vorraete = Object.assign({}, ich.vorraete, { mehl: 6, erz: 4 }); }
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });

  /* Das Fenster vermessen: was ist ganz zu sehen (Bildschirm UND scrollende Behälter) und nicht verdeckt? */
  const messen = (wsel) => pg.evaluate((ws) => {
    const st = document.querySelector(ws); if (!st) return null;
    const clip = (e) => { let o = 0, u = innerHeight, l = 0, r = innerWidth, p = e.parentElement;
      while (p && p !== document.body && p !== document.documentElement) { const cs = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(cs.overflowY + cs.overflowX)) { const q = p.getBoundingClientRect(); o = Math.max(o, q.top); u = Math.min(u, q.bottom); l = Math.max(l, q.left); r = Math.min(r, q.right); } p = p.parentElement; }
      return { o, u, l, r }; };
    const ganz = (e) => { if (!e) return false; const q = e.getBoundingClientRect(), c = clip(e);
      if (!(q.width > 0 && q.top >= c.o - 1 && q.bottom <= c.u + 1 && q.left >= c.l - 1 && q.right <= c.r + 1)) return false;
      const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return !!t && (t === e || e.contains(t)); };
    const k = (s) => st.querySelector(s), r = st.getBoundingClientRect(), c = clip(st);
    const sicht = Math.max(0, Math.min(r.bottom, c.u) - Math.max(r.top, c.o));
    const kn = [...st.querySelectorAll("button")].filter((b) => { const q = b.getBoundingClientRect(), cc = clip(b); return q.width > 0 && q.bottom > cc.o + 1 && q.top < cc.u - 1; }).map((b) => b.getBoundingClientRect());
    let ueber = 0;
    for (let i = 0; i < kn.length; i++) for (let j = i + 1; j < kn.length; j++) { const w = Math.min(kn[i].right, kn[j].right) - Math.max(kn[i].left, kn[j].left), h = Math.min(kn[i].bottom, kn[j].bottom) - Math.max(kn[i].top, kn[j].top); if (w > .5 && h > .5) ueber++; }
    const ex = k('[data-s="bahn"][data-a="export"]'), im = k('[data-s="bahn"][data-a="import"]'), to = k('[data-s="bahn"][data-a="touristen"]'), au = k('[data-s="bahnauto"]');
    const lage = (e) => { if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top)]; };
    return { h: Math.round(r.height), sicht: Math.round(sicht), t: Math.round(r.top), b: Math.round(r.bottom), H: innerHeight, W: innerWidth,
      ex: ganz(ex), im: ganz(im), to: ganz(to), au: ganz(au), zu: ganz(k(".sp-dl-st-zu")), lageEx: lage(ex), lageIm: lage(im), lageTo: lage(to),
      exText: ex ? ex.textContent.replace(/\s+/g, " ").trim() : "", imText: im ? im.textContent.replace(/\s+/g, " ").trim() : "", toText: to ? to.textContent.replace(/\s+/g, " ").trim() : "", auText: au ? au.textContent.replace(/\s+/g, " ").trim() + "|" + au.getAttribute("aria-pressed") : "",
      exAus: ex ? ex.disabled : null, imAus: im ? im.disabled : null, toAus: to ? to.disabled : null,
      min: kn.length ? Math.round(Math.min(...kn.map((q) => Math.min(q.width, q.height)))) : 0, n: kn.length, ueber, rand: r.left >= -0.5 && r.right <= innerWidth + 0.5,
      emoji: /\p{Extended_Pictographic}/u.test(st.textContent) };
  }, wsel);
  /* Mitte eines Knopfs – OHNE vorher zu rollen: was man tippt, muss schon da sein */
  const tippeStill = async (sel) => { const m = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); return true; };
  const rollStand = () => pg.evaluate(() => { const m = document.querySelector(".sp-schnell .sp-sm-blick") || document.querySelector(".sp-schnellmenue"); return [m ? Math.round(m.scrollTop) : -1, Math.round(scrollY)]; });

  /* Ein Tipp auf den Bahnhof in der neuen Stadt: ein Punkt, an dem wirklich der Bahnhof getroffen wird (kein Schild darüber). */
  const bahnhofPunkt = () => imFrame(() => { const SZ = window.STADT.szene, K = window.STADT.kamera;
    for (const e of SZ.sichtbare.slice().reverse()) { if (e.o.bild !== "k_bahnhof") continue; const m = e.meta;
      for (let fy = .5; fy < .95; fy += .08) for (let fx = .3; fx < .75; fx += .08) { const px = e.X - m.ax * e.k + m.w * e.k * fx, py = e.Y - m.ay * e.k + m.h * e.k * fy;
        if (px < 10 * K.dpr || py < 34 * K.dpr || px > K.W - 10 * K.dpr || py > K.H - 10 * K.dpr) continue;
        if (SZ.treffer(px, py, (o) => o.art !== "natur" || o.rand !== 1) !== e.o) continue;
        const b = document.elementFromPoint(px / K.dpr, py / K.dpr); if (b && b.closest && (b.closest("button") || b.closest(".lk-karte"))) continue;
        return { x: px / K.dpr, y: py / K.dpr }; } }
    return null; });
  /* Ist dieser Punkt der Stadt (Bildschirmlage) zu sehen und nicht vom Fenster verdeckt? */
  const stadtPunktFrei = (x, y) => pg.evaluate((q) => { if (q.x < 0 || q.y < 0 || q.x > innerWidth || q.y > innerHeight) return false; const e = document.elementFromPoint(q.x, q.y); return !!e && e.tagName === "IFRAME"; }, { x, y });
  const bahnhofImFrame = async (warten) => { let p = await bahnhofPunkt(); for (let i = 0; warten && !p && i < 20; i++) { await tick(300); p = await bahnhofPunkt(); } const o = await lage(".sp-lstadt"); return p && o ? { x: o.l + p.x, y: o.t + p.y } : null; };

  let r, m, m2, p;
  const ablauf = async (name, wsel, stadtFrei, schritt) => {
    /* Export, Import, Touristen nacheinander – ohne erneuten Tipp auf den Bahnhof, ohne zu rollen */
    if (!m) { sage(false, name + ": kein Fenster – Ablauf übersprungen"); return; }
    const roll0 = await rollStand();
    await tippeStill(wsel + ' [data-s="bahn"][data-a="export"]'); await tick(1800);
    m2 = await messen(wsel);
    const b1 = (await rufe("spiel_bahn")).map((a) => a.p_art);
    sage(b1.join() === "export" && !!m2 && m2.exAus && m2.im && m2.to, name + ": Export tippen → spiel_bahn(export); das Fenster bleibt offen, Import und Touristen stehen weiter da (ohne neuen Bahnhof-Tipp)", JSON.stringify({ b1, m2: m2 && { im: m2.im, to: m2.to, exText: m2.exText, t: m2.t } }));
    sage(!!m2 && JSON.stringify(m2.lageIm) === JSON.stringify(m.lageIm) && JSON.stringify(await rollStand()) === JSON.stringify(roll0), name + ": nichts springt weg – der Import-Knopf steht noch an derselben Stelle, das Menü hat nicht gerollt", JSON.stringify({ vor: m.lageIm, nach: m2 && m2.lageIm, roll0, roll1: await rollStand() }));
    await knipsen(schritt + "-nach-export");
    await tippeStill(wsel + ' [data-s="bahn"][data-a="import"]'); await tick(1800);
    const b2 = (await rufe("spiel_bahn")).map((a) => a.p_art);
    m2 = await messen(wsel);
    sage(b2.join() === "export,import" && !!m2 && m2.imAus && m2.to, name + ": gleich danach Import tippen → spiel_bahn(import), Touristen stehen noch da", JSON.stringify({ b2, h: await pg.evaluate(() => window.__hinweise.slice(-1)[0] || "") }));
    await tippeStill(wsel + ' [data-s="bahnauto"]'); await tick(1800);
    const b3 = (await rufe("spiel_bahn")).map((a) => a.p_art);
    m2 = await messen(wsel);
    const merk = await pg.evaluate(() => { try { return localStorage.getItem("dma_bahn_touristen"); } catch (e) { return "?"; } });
    sage(b3.join() === "export,import,touristen" && !!m2 && /an\|true$/.test(m2.auText) && merk === "1", name + ": „Touristen: an“ → sie steigen mit diesem Zug aus (spiel_bahn(touristen)) und kommen künftig mit jedem Zug", JSON.stringify({ b3, au: m2 && m2.auText, merk }));
    await knipsen(schritt + "-alles");
    if (stadtFrei) sage(await stadtFrei(), name + ": auch nach allen drei Aufgaben ist der Bahnhof in der Stadt noch zu sehen");
    await tippeStill(wsel + ' [data-s="bahnauto"]'); await tick(900);
    m2 = await messen(wsel);
    sage(!!m2 && /aus\|false$/.test(m2.auText) && (await rufe("spiel_bahn")).length === 3 && await pg.evaluate(() => { try { return localStorage.getItem("dma_bahn_touristen"); } catch (e) { return "?"; } }) === "0", name + ": „Touristen: aus“ schaltet wieder ab (kein weiterer Serverruf)", m2 && m2.auText);
    await tippeStill(wsel + " .sp-dl-st-zu"); await tick(700);
    sage(!(await pg.evaluate((s) => !!document.querySelector(s), wsel)), name + ": ✕ schließt das Fenster");
  };
  const pruefeFenster = (name, mm, hoechstens) => {
    sage(!!mm && mm.ex && mm.im && mm.to && mm.au && mm.zu, name + ": EIN Tipp auf den Bahnhof – Export, Import, Touristen (an/aus) und ✕ stehen zugleich ganz im Bild", JSON.stringify(mm && { ex: mm.ex, im: mm.im, to: mm.to, au: mm.au, zu: mm.zu, t: mm.t, b: mm.b }));
    sage(!!mm && /Export/.test(mm.exText) && /4 Mehl/.test(mm.exText) && /Import/.test(mm.imText) && /8 Erz/.test(mm.imText) && /Touristen/.test(mm.toText) && /7/.test(mm.toText), name + ": mit Ware und Menge (4 Mehl verladen · 8 Erz kaufen · 7 Touristen)", JSON.stringify(mm && [mm.exText, mm.imText, mm.toText]));
    sage(!!mm && mm.h <= hoechstens, name + ": das Fenster ist kompakt (höchstens " + hoechstens + " px von " + (mm && mm.H) + " px hoch)", JSON.stringify(mm && { h: mm.h, sicht: mm.sicht }));
    sage(!!mm && mm.min >= 30 && mm.ueber === 0 && mm.rand && !mm.emoji, name + ": Tippflächen ≥ 30 px, kein Knopf über dem anderen, nichts ragt über den Rand, keine Emoji-Grafik", JSON.stringify(mm && { min: mm.min, n: mm.n, ueber: mm.ueber, rand: mm.rand, emoji: mm.emoji }));
  };

  try {
  console.log("\nALTES DORFBILD: EIN TIPP AUF DEN BAHNHOF\n");
  { const l = await lage(".sp-schnell"); await pg.evaluate((d) => window.scrollBy(0, d), l.t - 250); await tick(300); }
  await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
  await neuerZug(); await tick(300);
  await pg.evaluate(() => { const b = document.querySelector(".sp-dl-bahnhof"); if (b) b.scrollIntoView({ block: "center" }); }); await tick(400);
  await tippeStill(".sp-dl-bahnhof"); await tick(1800);
  m = await messen(".sp-bahnhof");
  await knipsen("1-alt-offen");
  pruefeFenster("Altes Dorfbild", m, 370);
  const bahnAltFrei = () => pg.evaluate(() => { const b = document.querySelector(".sp-dl-bahnhof"); if (!b) return false; const q = b.getBoundingClientRect(), x = q.left + q.width / 2, y = q.top + q.height * 0.4;
    if (y < 0 || y > innerHeight) return false; const e = document.elementFromPoint(x, y); return !!e && !!e.closest(".sp-dl-fenster"); });
  sage(await bahnAltFrei(), "Altes Dorfbild: der Bahnhof im Bild bleibt zu sehen (nicht vom Fenster verdeckt)");
  await ablauf("Altes Dorfbild", ".sp-bahnhof", bahnAltFrei, "2-alt");

  console.log("\nNEUE STADT IM KLEINEN RAHMEN: EIN TIPP AUF DEN BAHNHOF\n");
  await pg.evaluate(() => { const m = document.querySelector(".sp-schnell .sp-sm-blick"); if (m) m.scrollTop = 1e6; }); await tick(300);
  await tippe('[data-s="stadtversion"][data-v="neu"]'); await tick(900);
  let fr = null;
  for (let i = 0; i < 80 && !fr; i++) { const f = stadtFrame(); if (f && await f.evaluate(() => !!document.querySelector(".lk-lupe") && !!window.STADT.oberflaeche.ueberblick).catch(() => false)) fr = f; else await tick(250); }
  sage(!!fr, "die neue Stadt ist im Rahmen geladen");
  await tick(2500);
  await neuerZug(); await tick(600);
  p = await bahnhofImFrame(true);
  sage(!!p, "der Bahnhof ist in der kleinen Stadt zu sehen und antippbar", JSON.stringify(p));
  if (p) await pg.touchscreen.tap(p.x, p.y);
  await tick(2200);
  m = await messen(".sp-bahnhof");
  await knipsen("3-neu-offen");
  pruefeFenster("Neue Stadt (Rahmen)", m, 370);
  const bahnNeuFrei = async () => { const q = await bahnhofImFrame(); return !!q && await stadtPunktFrei(q.x, q.y); };
  sage(await bahnNeuFrei(), "Neue Stadt (Rahmen): die Stadt mit dem Bahnhof bleibt über dem Fenster zu sehen", JSON.stringify({ ls: await lage(".sp-lstadt"), p: await bahnhofImFrame() }));
  await ablauf("Neue Stadt (Rahmen)", ".sp-bahnhof", bahnNeuFrei, "4-neu");

  console.log("\nNEUE STADT IM VOLLBILD (HOCH): DAS FENSTER UNTEN\n");
  await neuerZug(); await tick(300);
  await pg.evaluate(() => { const m = document.querySelector(".sp-schnell .sp-sm-blick"); if (m) m.scrollTop = 1e6; }); await tick(300);
  await tippe('[data-s="stadtvoll"]'); await tick(2500);
  const voll = await pg.evaluate(() => { const e = document.querySelector(".sp-lstadt"); return !!e && e.classList.contains("sp-ls-voll"); });
  sage(voll, "Vollbild der neuen Stadt ist an");
  p = await bahnhofImFrame(true);
  if (p) await pg.touchscreen.tap(p.x, p.y);
  await tick(2200);
  m = await messen(".sp-lstadt .sp-bahnhof");
  await knipsen("5-voll-offen");
  const karteStadt = await imFrame(() => { const k = document.querySelector(".lk-karte"); return !!k && !k.hidden && getComputedStyle(k).display !== "none" ? k.textContent : ""; });
  pruefeFenster("Vollbild hoch", m, 370);
  sage(!karteStadt, "Vollbild hoch: keine zweite Karte der Stadt („Gehört zum Dorf“) darunter", karteStadt);
  const bahnVollFrei = async () => { const q = await bahnhofImFrame(); return !!q && await stadtPunktFrei(q.x, q.y); };
  sage(await bahnVollFrei(), "Vollbild hoch: der Bahnhof liegt im freien Teil der Stadt (über dem Fenster)", JSON.stringify(await bahnhofImFrame()));
  sage(!!m && m.t >= m.H * 0.45, "Vollbild hoch: das Fenster sitzt unten (obere Hälfte bleibt Stadt)", JSON.stringify(m && { t: m.t, H: m.H }));
  await ablauf("Vollbild hoch", ".sp-lstadt .sp-bahnhof", bahnVollFrei, "6-voll");

  console.log("\nNEUE STADT IM VOLLBILD (QUER): DAS FENSTER SEITLICH\n");
  await neuerZug(); await tick(300);
  await pg.setViewportSize({ width: 740, height: 360 }); await tick(1800);
  p = await bahnhofImFrame(true);
  if (p) await pg.touchscreen.tap(p.x, p.y);
  await tick(2200);
  m = await messen(".sp-lstadt .sp-bahnhof");
  await knipsen("7-quer-offen");
  const seit = await pg.evaluate(() => { const e = document.querySelector(".sp-lstadt .sp-bahnhof"); if (!e) return null; const q = e.getBoundingClientRect(); return { l: Math.round(q.left), w: Math.round(q.width), W: innerWidth }; });
  sage(!!m && m.ex && m.im && m.to && m.au && m.zu && m.min >= 30 && m.ueber === 0 && m.rand, "Vollbild quer: Export, Import, Touristen und ✕ ganz im Bild, Tippflächen ≥ 30 px, nichts überlappt", JSON.stringify(m && { ex: m.ex, im: m.im, to: m.to, au: m.au, zu: m.zu, min: m.min, ueber: m.ueber }));
  sage(!!seit && seit.w <= seit.W * 0.5 && seit.l >= seit.W * 0.45, "Vollbild quer: das Fenster steht seitlich (rechts, höchstens die halbe Breite)", JSON.stringify(seit));
  sage(await bahnVollFrei(), "Vollbild quer: der Bahnhof liegt im freien Teil der Stadt (links vom Fenster)", JSON.stringify(await bahnhofImFrame()));
  await tippeStill(".sp-lstadt .sp-bahnhof .sp-dl-st-zu"); await tick(600);
  sage(!(await pg.evaluate(() => !!document.querySelector(".sp-lstadt .sp-bahnhof"))), "Vollbild quer: ✕ schließt das Fenster");
  await pg.setViewportSize({ width: 360, height: 740 }); await tick(800);
  } catch (e) { console.error(e); fehler++; }

  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 823 (Bahnhof in einem Fenster): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
