#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 707: FUNK 146 – FLÜSSIG SAMMELN, ERNTEN, ANGELN, TASCHEN
   ---------------------------------------------------------------------
   XANDER (Funk 146): „möchte den Schatz einfach nur einsammeln … verrutscht
   manchmal ein Ei … wenn man ganz schnell auf den Feldern so nacheinander
   alle abgrast … soll das ganz flüssig ab ernten … die Angel soll man in
   jeden einzelnen Teilbereich der Teiche hängen … ich möchte das frei
   entscheiden was ich links haben möchte was ich rechts haben möchte".
   Server-Attrappe mit den neuen Regeln (Sense alle 0,25 s, Angel je Teich
   12 s, Fundstück sofort mit Inhalt). Echte Fingertipps auf 360 px.
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

  const leerePlaetze = () => pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .lc-platz")].filter((q) => !q.dataset.lcId && q.querySelector(".lc-kreis")).map((q) => Number(q.dataset.lcPlatz)));
  const platzMitte = (nr) => mitte('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"] .lc-kreis');
  const zeigePlatz = (nr) => pg.evaluate((nr) => document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"]').scrollIntoView({ block: "nearest" }), nr);
  const tippePlatz = async (nr, warte) => { await zeigePlatz(nr); await tick(120); const m = await platzMitte(nr); await pg.touchscreen.tap(m.x, m.y); await tick(warte == null ? 250 : warte); };
  const rufe = (n) => pg.evaluate((n) => window.__rufe.filter((r) => r.name === n).map((r) => r.args), n);
  await pg.evaluate(() => {
    const ich = window.__ich;
    ich.acker = {}; ich.werk = {}; ich.vorraete = Object.assign({}, ich.vorraete, { getreide: 0, fisch: 0, ei: 0 });
    ich.dorf = { huehnerstall: { stufe: 1, lp: 20, stand: new Date(Date.now() - 3 * 900000 - 5000).toISOString() } };
    ich.waffen = ["kartoffel", "zwille", "bogen", "laser", "brezel"];
    let letzte = 0; const angel = {};
    const plus = (w, n) => { ich.vorraete = Object.assign({}, ich.vorraete, { [w]: (ich.vorraete[w] || 0) + n }); };
    window.__verzoegerung = 180;
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_ernten: (a) => {
        if (Date.now() - letzte < 250) return { ok: false, grund: "langsam – die Sense muss erst ausholen" };
        const f = ich.acker[a.p_platz] || {}; const reif = (f.ab ? Date.parse(f.ab) : 0) + 240000;
        if (reif > Date.now()) return { ok: false, grund: "das Korn wächst noch", sek: 200 };
        letzte = Date.now(); plus("getreide", 2);
        ich.acker = Object.assign({}, ich.acker, { [a.p_platz]: { ab: new Date().toISOString(), saat: false } });
        return Object.assign({}, JSON.parse(JSON.stringify(ich)), { ok: true, menge: 2, besaet: false });
      },
      spiel_angeln: (a) => {
        if (angel[a.p_platz] && Date.now() - angel[a.p_platz] < 12000) return { ok: false, grund: "in diesem Teich ist die Angel noch im Wasser", sek: 10 };
        angel[a.p_platz] = Date.now(); plus("fisch", 1);
        return Object.assign({}, JSON.parse(JSON.stringify(ich)), { ok: true, fang: "fisch", menge: 1 });
      },
      spiel_ei_sammeln: () => { plus("ei", 1); ich.dorf.huehnerstall.stand = new Date(Date.parse(ich.dorf.huehnerstall.stand) + 900000).toISOString();
        return Object.assign({}, JSON.parse(JSON.stringify(ich)), { ok: true, menge: 1 }); },
      spiel_fund_heben: () => { ich.punkte += 3; ich.vorraete.erz = (ich.vorraete.erz || 0) + 1; return Object.assign({}, JSON.parse(JSON.stringify(ich)), { ok: true, fund: "erz", sofort: 3 }); }
    });
    /* Jede Server-Antwort braucht 180 ms – wie im echten Netz. */
    const P = window.DMA_SPIEL.pruef, S = P.zustand(), alt = S.klient.rpc;
    S.klient = { rpc: (n, a) => new Promise((ok) => setTimeout(() => ok(alt(n, a)), window.__verzoegerung)) };
    S.ich = JSON.parse(JSON.stringify(ich));
    try { localStorage.removeItem("dma_spiel_werkzeug"); localStorage.removeItem("dma_spiel_slots"); localStorage.setItem("dma_spiel_slotzahl", "3"); } catch (e) {}
    S.slots = null; S.slotZahl = 0;
    window.__hinweise.length = 0;
    P.schnellZeichnen(true);
  });
  await tick(1600);

  console.log("\nEIER: JEDES FÜR SICH, NICHTS SPRINGT\n");
  let r = await pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .sp-ei-feld:not(.sp-ei-weg)")].map((e) => Number(e.closest(".lc-platz").dataset.lcPlatz)));
  sage(r.length === 3, "3 Eier liegen auf freien Plätzen", JSON.stringify(r));
  const eiA = r[0], eiB = r[1], eiC = r[2];
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippePlatz(eiA, 30); await tippePlatz(eiB, 30);
  const waehrend = await pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .sp-ei-feld:not(.sp-ei-weg)")].map((e) => Number(e.closest(".lc-platz").dataset.lcPlatz)));
  await tick(1600);
  const nach = await pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .sp-ei-feld:not(.sp-ei-weg)")].map((e) => Number(e.closest(".lc-platz").dataset.lcPlatz)));
  const eiRufe = await rufe("spiel_ei_sammeln");
  sage(eiRufe.length === 2 && eiRufe[0].p_platz === eiA && eiRufe[1].p_platz === eiB, "zwei Eier schnell hintereinander: beide eingesammelt (vorher schluckte die Sperre das zweite)", JSON.stringify(eiRufe));
  sage(waehrend.length === 1 && waehrend[0] === eiC && nach.length === 1 && nach[0] === eiC, "währenddessen und danach springt kein Ei: das dritte bleibt auf seinem Platz", JSON.stringify({ waehrend, nach, eiC }));

  console.log("\nSCHATZ: EINFACH EINSAMMELN\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.fundNaechst = 0; S.ich = Object.assign({}, S.ich, { mitspielen: true }); window.__rufe.length = 0; });
  await tick(1600);
  const sack = await pg.evaluate(() => { const f = document.querySelector("#lcPlaetze .sp-fundsack"); return f ? Number(f.closest(".lc-platz").dataset.lcPlatz) : 0; });
  sage(sack > 0, "ein Fundstück liegt auf einem Platz", "Platz " + sack);
  const leisteKnopf = await pg.evaluate(() => Boolean(document.querySelector('.sp-schnell [data-s="fund"]')));
  if (sack) { await tippePlatz(sack, 700); }
  r = await pg.evaluate(() => ({ rufe: window.__rufe.filter((x) => x.name === "spiel_fund_heben").length, deutsch: window.__rufe.some((x) => x.name === "spiel_aufgabe"),
    panel: (() => { const p = document.querySelector(".sp-panel"); return p ? !p.hidden : false; })(), meld: window.__hinweise.slice(-1)[0] || "", sack: Boolean(document.querySelector("#lcPlaetze .sp-fundsack")) }));
  sage(r.rufe === 1 && !r.sack && /eingesammelt: \+3 Punkte und 1 Erz/.test(r.meld), "Tipp aufs Säckchen: eingesammelt, Inhalt sofort (+3 Punkte und 1 Erz)", r.meld);
  sage(!r.deutsch && !r.panel, "kein Deutsch-Fenster geht auf, keine Aufgabe wird geholt", JSON.stringify({ deutsch: r.deutsch, panel: r.panel }));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.fundNaechst = 0; window.__rufe.length = 0; });
  await tick(1600);
  await pg.evaluate(() => window.DMA_SPIEL.pruef.schnellZeichnen(true)); await tick(300);
  const knopf = await pg.evaluate(() => Boolean(document.querySelector('.sp-schnell [data-s="fund"]')));
  if (knopf) await tippe('.sp-schnell [data-s="fund"]');
  await tick(700);
  r = await pg.evaluate(() => ({ rufe: window.__rufe.filter((x) => x.name === "spiel_fund_heben").length, sack: Boolean(document.querySelector("#lcPlaetze .sp-fundsack")), meld: window.__hinweise.slice(-1)[0] || "" }));
  sage(knopf && r.rufe === 1 && !r.sack, "der Knopf in der Leiste zeigt nicht mehr nur – er sammelt das Fundstück selbst ein", JSON.stringify(r));

  console.log("\nLANGER DRUCK: DAS GEWÄHLTE WERKZEUG, KEIN AN-AUS\n");
  r = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.graben = false; S.werkzeug = "sense";
    const f = window.DMA_SPIEL.langAufLeer || P.langAufLeer; if (!f) return { fehlt: true }; f(1); f(1); return { an: S.graben, wz: S.werkzeug }; });
  sage(r.an === true && r.wz === "sense", "zweimal derselbe lange Druck (Zeitgeber + Kontextmenü): Sense bleibt in der Hand, statt an und gleich wieder aus", JSON.stringify(r));

  console.log("\nSCHNELL ERNTEN: JEDER TIPP ZÄHLT\n");
  const frei = (await leerePlaetze()).filter((n) => n !== eiC).slice(0, 4);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.graben = true; S.werkzeug = "sense"; window.__rufe.length = 0; window.__hinweise.length = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(900);
  const t0 = Date.now();
  for (const nr of frei) { await tippePlatz(nr, 30); await tick(470); }
  await tick(2500);
  const ernteRufe = await rufe("spiel_ernten");
  r = await pg.evaluate(() => ({ getreide: window.DMA_SPIEL.pruef.zustand().ich.vorraete.getreide, langsam: window.__hinweise.some((h) => /langsam/.test(h)) }));
  sage(ernteRufe.length === frei.length && frei.every((n, i) => ernteRufe[i].p_platz === n), frei.length + " Felder schnell hintereinander angetippt: alle werden gemäht, der Reihe nach", JSON.stringify(ernteRufe.map((x) => x.p_platz)) + " von " + JSON.stringify(frei));
  sage(r.getreide === 2 * frei.length && !r.langsam, "+" + 2 * frei.length + " Getreide, kein „langsam“", JSON.stringify(r));

  console.log("\nANGELN: IN JEDEM TEICH EINE ANGEL\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.werkzeug = "angel"; window.__rufe.length = 0; window.__hinweise.length = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(900);
  const teiche = frei.slice(0, 3);
  for (const nr of teiche) await tippePlatz(nr, 60);
  const ruten = await pg.evaluate(() => document.querySelectorAll("#lcPlaetze .sp-angeln").length);
  await tick(2600);
  let angelRufe = await rufe("spiel_angeln");
  sage(angelRufe.length === 3 && teiche.every((n, i) => angelRufe[i].p_platz === n) && ruten >= 3, "drei Teiche schnell hintereinander: drei Angeln gleichzeitig im Wasser", JSON.stringify({ rufe: angelRufe.map((x) => x.p_platz), ruten }));
  r = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().ich.vorraete.fisch);
  sage(r === 3, "drei Fische gefangen", r + " Fische");
  await tippePlatz(teiche[0], 400);
  angelRufe = await rufe("spiel_angeln");
  const angelMeld = await pg.evaluate(() => window.__hinweise.slice(-1)[0] || "");
  sage(angelRufe.length === 3 && /In diesem Teich ist die Angel noch im Wasser.*anderen Teiche sind frei/.test(angelMeld), "derselbe Teich gleich nochmal: freundlicher Hinweis, die anderen Teiche sind frei", angelMeld);

  console.log("\nTASCHEN: IM MENÜ FREI ORDNEN\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.graben = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  r = await pg.evaluate(() => ({ plusInLeiste: Boolean(document.querySelector(".sp-schnell .sp-s-taschen")), slots: document.querySelectorAll(".sp-schnell .sp-s-slot").length }));
  sage(!r.plusInLeiste && r.slots === 3, "in der Leiste keine winzigen + / − mehr; 3 Taschen", JSON.stringify(r));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "waffen"; S.blick = null; S.schnellSlot = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(400);
  const vorher = await pg.evaluate(() => [...document.querySelectorAll(".sp-taschen-ed .sp-tasche small")].map((e) => e.textContent));
  const groesse = await pg.evaluate(() => { const b = document.querySelector(".sp-taschen-ed .sp-tasche").getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) }; });
  sage(vorher.length === 3 && groesse.w >= 60 && groesse.h >= 50, "im Menü die 3 Taschen groß mit Waffe und Namen", JSON.stringify({ vorher, groesse }));
  await tippe('.sp-taschen-ed [data-s="slot"][data-n="0"]');
  await tippe('.sp-taschen-knoepfe [data-s="slotschieb"][data-r="1"]');
  await tick(300);
  r = await pg.evaluate(() => ({ menue: [...document.querySelectorAll(".sp-taschen-ed .sp-tasche small")].map((e) => e.textContent.replace(/^\d\. /, "")), leiste: [...document.querySelectorAll(".sp-schnell .sp-s-slot")].map((e) => e.dataset.w),
    gemerkt: JSON.parse(localStorage.getItem("dma_spiel_slots") || "[]"), gewaehlt: window.DMA_SPIEL.pruef.zustand().schnellSlot }));
  const erste = vorher[0].replace(/^\d\. /, ""), zweite = vorher[1].replace(/^\d\. /, "");
  sage(r.menue[0] === zweite && r.menue[1] === erste && r.gewaehlt === 1, "Tasche 1 „nach rechts ▶“: sie tauscht mit Tasche 2, die Auswahl wandert mit", JSON.stringify(r.menue));
  sage(r.gemerkt[0] === r.leiste[0] && r.gemerkt[1] === r.leiste[1], "die Leiste unten zeigt dieselbe Reihenfolge, auf dem Gerät gemerkt", JSON.stringify({ leiste: r.leiste, gemerkt: r.gemerkt }));
  await tippe('.sp-taschen-knoepfe [data-s="slotplus"]'); await tick(300);
  r = await pg.evaluate(() => ({ menue: document.querySelectorAll(".sp-taschen-ed .sp-tasche").length, leiste: document.querySelectorAll(".sp-schnell .sp-s-slot").length }));
  sage(r.menue === 4 && r.leiste === 4, "„+ Tasche“ im Menü: eine vierte Tasche, auch unten", JSON.stringify(r));
  r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"), mr = m.getBoundingClientRect();
    return { quer: m.scrollWidth - m.clientWidth, raus: [...m.querySelectorAll(".sp-taschen-knoepfe button")].filter((e) => e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().right > mr.right + 1).length }; });
  sage(r.quer <= 1 && r.raus === 0, "360 px: nichts ragt heraus", JSON.stringify(r));
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 707 (Funk 146): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
