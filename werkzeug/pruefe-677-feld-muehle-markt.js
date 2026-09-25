#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 677: FELD, SENSE, SAAT, MÜHLE, BÄCKEREI, MARKT
   ---------------------------------------------------------------------
   XANDER: „dass wir auf dem Feld arbeiten ernten können genauso wie
   mit der Schaufel … mit einer Sense … überall auf jeden Platz
   Getreide … dass ich das Werkzeug wechseln kann, indem ich zweimal …
   auf den Festplatz klicke … in der Bäckerei irgendwas backen …
   beliefern … einsammeln … verkaufen … auf dem Markt".
   Server (Rollback-Test in der Fassung): spiel_ernten, spiel_saeen,
   spiel_beliefern, spiel_werk_abholen, spiel_markt. Hier: das Telefon.
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


  const leerePlaetze = () => pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .lc-platz")].filter((q) => !q.dataset.lcId && q.querySelector(".lc-kreis")).map((q) => Number(q.dataset.lcPlatz)));
  const platzMitte = (nr) => mitte('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"] .lc-kreis');
  const tippePlatz = async (nr, warte) => { await pg.evaluate((nr) => document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"]').scrollIntoView({ block: "nearest" }), nr); await tick(450);
    const m = await platzMitte(nr); await pg.touchscreen.tap(m.x, m.y); await tick(warte == null ? 250 : warte); };

  /* Der Server als Attrappe: dieselben Regeln wie spiel_ernten / spiel_saeen (4 min, wild 2, gesät 5, 1,5 s Sense). */
  await pg.evaluate(() => {
    const ich = window.__ich;
    ich.acker = {}; ich.werk = {}; ich.vorraete = Object.assign({}, ich.vorraete, { getreide: 0 });
    ich.dorf = { muehle: { stufe: 1, lp: 20 }, baeckerei: { stufe: 1, lp: 20 } };
    let letzte = 0;
    const plus = (w, n) => { ich.vorraete = Object.assign({}, ich.vorraete, { [w]: (ich.vorraete[w] || 0) + n }); };
    window.__extra = {
      spiel_ernten: (a) => {
        if (Date.now() - letzte < 1500) return { ok: false, grund: "langsam – die Sense muss erst ausholen" };
        const f = ich.acker[a.p_platz] || {}; const reif = (f.ab ? Date.parse(f.ab) : 0) + 240000;
        if (reif > Date.now()) return { ok: false, grund: "das Korn wächst noch", sek: Math.ceil((reif - Date.now()) / 1000) };
        const menge = f.saat ? 5 : 2; letzte = Date.now(); plus("getreide", menge);
        ich.acker = Object.assign({}, ich.acker, { [a.p_platz]: { ab: new Date().toISOString(), saat: false } });
        return Object.assign({}, ich, { ok: true, menge, besaet: Boolean(f.saat) });
      },
      spiel_saeen: (a) => { plus("getreide", -1); ich.acker = Object.assign({}, ich.acker, { [a.p_platz]: { ab: new Date().toISOString(), saat: true } }); return Object.assign({}, ich, { ok: true, gesaet: a.p_platz }); },
      spiel_beliefern: (a) => {
        const roh = a.p_gebaeude === "muehle" ? "getreide" : "mehl", je = a.p_ware === "kuchen" ? 2 : 1;
        plus(roh, -je * a.p_menge);
        ich.werk = Object.assign({}, ich.werk, { [a.p_gebaeude]: { ware: a.p_gebaeude === "muehle" ? "mehl" : a.p_ware, menge: a.p_menge, fertig: new Date(Date.now() + 8 * 60000).toISOString() } });
        return Object.assign({}, ich, { ok: true, gebaeude: a.p_gebaeude, ware: ich.werk[a.p_gebaeude].ware, menge: a.p_menge, minuten: a.p_gebaeude === "muehle" ? 8 : 10 });
      },
      spiel_werk_abholen: (a) => {
        const j = ich.werk[a.p_gebaeude];
        if (Date.parse(j.fertig) > Date.now()) return { ok: false, grund: "noch nicht fertig", sek: Math.ceil((Date.parse(j.fertig) - Date.now()) / 1000) };
        plus(j.ware, j.menge); const w = Object.assign({}, ich.werk); delete w[a.p_gebaeude]; ich.werk = w;
        return Object.assign({}, ich, { ok: true, ware: j.ware, menge: j.menge });
      },
      spiel_markt: (a) => { const n = Math.min(50, ich.vorraete[a.p_ware] || 0), p = { getreide: 1, mehl: 3, brot: 6, kuchen: 14 }[a.p_ware]; plus(a.p_ware, -n); ich.punkte += n * p; return Object.assign({}, ich, { ok: true, ware: a.p_ware, menge: n, erloes: n * p }); },
      spiel_essen: (a) => { plus(a.p_ding, -1); return Object.assign({}, ich, { ok: true, geheilt: a.p_ding === "kuchen" ? 30 : 12, gegessen: a.p_ding }); }
    };
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = ich;
    try { localStorage.removeItem("dma_spiel_werkzeug"); } catch (e) {}
  });

  console.log("\nSENSE NEHMEN — FELDER AUF ALLEN FREIEN PLÄTZEN\n");
  const nehmen = await pg.evaluate(() => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand();
    S.schnellMenue = true; S.schnellReiter = "mehr"; P.schnellZeichnen(true);
    const schaufel = document.querySelector('.sp-schnellmenue [data-s="graben"]'), k = document.querySelector('.sp-schnellmenue [data-s="werkzeugsetzen"][data-w="sense"]');
    const text = k ? k.textContent : "";
    if (k) k.click();
    return { text, schaufel: schaufel ? schaufel.textContent : "", an: Boolean(S.graben), wz: S.werkzeug,
      leiste: Boolean(document.querySelector(".sp-schnell .sp-s-graben.sp-wz-sense .sp-sense-svg")), wechsel: Boolean(document.querySelector(".sp-schnell .sp-s-wwahl")) };
  });
  sage(/Sense/.test(nehmen.text) && /Graben \(Schaufel\)/.test(nehmen.schaufel), "Menü → Mehr: „Graben (Schaufel)“ bleibt, dazu „Feld: Sense“", nehmen.text + " | " + nehmen.schaufel);
  sage(nehmen.an && nehmen.wz === "sense" && nehmen.leiste && nehmen.wechsel, "Sense in der Hand: Leiste zeigt die Sense und den Wechsel-Knopf ⇄", JSON.stringify(nehmen));
  await tick(800);
  const frei = await leerePlaetze();
  const felder = await pg.evaluate(() => {
    const a = [...document.querySelectorAll("#lcPlaetze .sp-acker")];
    const falsch = a.filter((x) => x.closest(".lc-platz").dataset.lcId).length;
    const e = a[0], k = e && e.closest(".lc-platz").querySelector(".lc-kreis"), r1 = e && e.getBoundingClientRect(), r2 = k && k.getBoundingClientRect();
    return { zahl: a.length, falsch, reif: a.filter((x) => x.classList.contains("sp-acker-reif")).length, uhr: e ? e.textContent : "",
      deckung: r1 ? Math.round(Math.abs(r1.left - r2.left) + Math.abs(r1.top - r2.top) + Math.abs(r1.width - r2.width)) : -1, aehren: e ? e.querySelectorAll("ellipse").length : 0 };
  });
  sage(felder.zahl === frei.length && frei.length > 0 && felder.falsch === 0, "Getreide steht auf JEDEM freien Platz, nie auf einem besetzten", felder.zahl + " Felder / " + frei.length + " frei");
  sage(felder.reif === felder.zahl && felder.uhr === "+2" && felder.aehren >= 20, "wild gewachsen: reif, goldene Ähren, Zeichen „+2“", JSON.stringify(felder));
  sage(felder.deckung >= 0 && felder.deckung <= 3, "das Feld liegt genau im Kreis des Platzes", felder.deckung + " px Abweichung");

  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-felder.png" });
  console.log("\nMÄHEN\n");
  const nr1 = frei[0], nr2 = frei[1], nr3 = frei[2];
  await pg.evaluate(() => { window.__rufe.length = 0; window.DMA_TONLOG.length = 0; window.__hinweise.length = 0;
    window.__maehZeit = null; new MutationObserver((m, o) => { if (document.querySelector(".sp-maehen")) { window.__maehZeit = Math.round(performance.now()); o.disconnect(); } }).observe(document.getElementById("lcPlaetze"), { childList: true, subtree: true }); });
  await tippePlatz(nr1, 800);
  const m1 = await pg.evaluate((nr) => {
    const ruf = window.__rufe.filter((r) => r.name === "spiel_ernten").map((r) => r.args.p_platz);
    const ton = (window.DMA_TONLOG.find((t) => t.name === "swoosh") || {}).wann;
    const a = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"] .sp-acker');
    return { ruf, tonAbstand: ton != null && window.__maehZeit != null ? Math.abs(ton - window.__maehZeit) : null, klasse: a ? a.className : "", uhr: a ? a.textContent : "",
      getreide: window.DMA_SPIEL.pruef.zustand().ich.vorraete.getreide, meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "", hingesetzt: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"][data-lc-id="ich"]')) };
  }, nr1);
  sage(m1.ruf.length === 1 && m1.ruf[0] === nr1 && !m1.hingesetzt, "Tipp auf ein Feld mäht dort (Server-Ruf mit dem Platz), setzt nicht hin", JSON.stringify(m1.ruf));
  sage(m1.tonAbstand !== null && m1.tonAbstand < 60, "„swoosh“ startet mit dem Sensenschwung", m1.tonAbstand + " ms");
  sage(/sp-acker-waechst/.test(m1.klasse) && /^[34]:\d\d$/.test(m1.uhr) && m1.getreide === 2 && /\+2 Getreide/.test(m1.meld), "danach: Stoppeln mit Uhr (4 min), +2 Getreide im Lager, Meldung", JSON.stringify(m1));
  /* Sofort das nächste Feld: die Sense wartet die 1,5 s ab statt abgelehnt zu werden. */
  await tippePlatz(nr2, 250);
  const zwischen = await pg.evaluate(() => window.__rufe.filter((r) => r.name === "spiel_ernten").length);
  await tick(1500);
  const m2 = await pg.evaluate(() => ({ rufe: window.__rufe.filter((r) => r.name === "spiel_ernten").length, getreide: window.DMA_SPIEL.pruef.zustand().ich.vorraete.getreide,
    abgelehnt: window.__hinweise.some((h) => /langsam/.test(h)) }));
  sage(zwischen === 1 && m2.rufe === 2 && m2.getreide === 4 && !m2.abgelehnt, "schnell das nächste Feld: der Schnitt wartet kurz, kein „langsam“", JSON.stringify(m2));
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippePlatz(nr1, 400);
  const m3 = await pg.evaluate(() => ({ rufe: window.__rufe.filter((r) => r.name === "spiel_ernten").length, meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "" }));
  sage(m3.rufe === 0 && /wächst noch – reif in [34]:\d\d/.test(m3.meld), "gemähtes Feld: kein Server-Ruf, Meldung mit Restzeit", JSON.stringify(m3));
  await pg.evaluate(() => { window.__rufe.length = 0; });
  const besetzt = await pg.evaluate(() => Number(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]').dataset.lcPlatz));
  await tippePlatz(besetzt, 400);
  const m4 = await pg.evaluate(() => ({ rufe: window.__rufe.filter((r) => /spiel_(saeen|ernten)/.test(r.name)).length, meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "" }));
  sage(m4.rufe === 0 && /Da sitzt jemand/.test(m4.meld), "Sense auf einem besetzten Platz: nichts passiert, kurze Erklärung", JSON.stringify(m4));

  console.log("\nWERKZEUG WECHSELN: 2× AUF DEN PLATZ\n");
  await tick(1600);
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippePlatz(nr3, 0);
  const m = await platzMitte(nr3);
  await pg.touchscreen.tap(m.x, m.y);
  await tick(350);
  const wahl = await pg.evaluate(() => {
    const w = document.querySelector(".sp-schnell .sp-werkzeugwahl");
    const r = w && w.getBoundingClientRect();
    return { da: Boolean(w), knoepfe: w ? [...w.querySelectorAll('[data-s="werkzeugsetzen"]')].map((b) => b.dataset.w).join(",") : "", weg: Boolean(w && w.querySelector(".sp-ww-weg")),
      imBild: r ? r.left >= 0 && r.right <= innerWidth && r.top >= 0 : false, ernten: window.__rufe.filter((x) => x.name === "spiel_ernten").length };
  });
  sage(wahl.da && wahl.knoepfe === "schaufel,sense,saat" && wahl.weg, "2× schnell auf denselben Platz öffnet die Werkzeugwahl (Schaufel, Sense, Saat, Weglegen)", JSON.stringify(wahl));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-wahl.png" });
  sage(wahl.imBild, "die Werkzeugwahl passt ganz auf den Bildschirm (360 px)", JSON.stringify(wahl));
  sage(wahl.ernten === 1, "der erste Tipp hat trotzdem sofort gemäht (keine Wartezeit)", String(wahl.ernten));
  await tippe('.sp-werkzeugwahl [data-w="saat"]');
  const saat = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); return { wz: S.werkzeug, zu: !document.querySelector(".sp-werkzeugwahl"), leiste: Boolean(document.querySelector(".sp-s-graben .sp-saat-svg")), merk: localStorage.getItem("dma_spiel_werkzeug") }; });
  sage(saat.wz === "saat" && saat.zu && saat.leiste && saat.merk === "saat", "Saatbeutel gewählt: Wahl schließt, Leiste zeigt den Beutel, gemerkt", JSON.stringify(saat));

  console.log("\nSÄEN\n");
  await pg.evaluate(() => { window.__rufe.length = 0; window.DMA_TONLOG.length = 0; });
  await tippePlatz(nr1, 700);
  const s1 = await pg.evaluate((nr) => { const a = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"] .sp-acker');
    return { ruf: window.__rufe.filter((r) => r.name === "spiel_saeen").map((r) => r.args.p_platz), klasse: a ? a.className : "", ton: window.DMA_TONLOG.some((t) => t.name === "graben"), meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "" }; }, nr1);
  sage(s1.ruf[0] === nr1 && /sp-acker-saat/.test(s1.klasse) && s1.ton && /Gesät/.test(s1.meld), "Saat auf das gemähte Feld: Server-Ruf, Feld grün umrandet, Ton, Meldung", JSON.stringify(s1));
  const nr4 = frei[3];
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippePlatz(nr4, 400);
  const s2 = await pg.evaluate(() => ({ rufe: window.__rufe.filter((r) => /spiel_(saeen|ernten)/.test(r.name)).length, meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "" }));
  sage(s2.rufe === 0 && /erst mit der Sense/.test(s2.meld), "Saat auf ein reifes Feld: erst mähen (nichts geht verloren)", JSON.stringify(s2));
  /* 4 Minuten vorspulen: das gesäte Feld bringt 5. */
  await pg.evaluate((nr) => { const ich = window.__ich; ich.acker[nr].ab = new Date(Date.now() - 241000).toISOString(); window.DMA_SPIEL.pruef.zustand().ich = Object.assign({}, window.DMA_SPIEL.pruef.zustand().ich, { acker: ich.acker }); window.DMA_SPIEL.pruef.werkzeugSetzen("sense"); }, nr1);
  await tick(1700);
  await tippePlatz(nr1, 800);
  const s3 = await pg.evaluate(() => ({ getreide: window.DMA_SPIEL.pruef.zustand().ich.vorraete.getreide, meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "" }));
  sage(/\+5 Getreide/.test(s3.meld) && /volle Ernte/.test(s3.meld), "nach 4 Minuten: das gesäte Feld bringt 5 Getreide", JSON.stringify(s3));
  await tippe(".sp-schnell .sp-s-graben");
  await tick(300);
  const weg = await pg.evaluate(() => ({ an: window.DMA_SPIEL.pruef.zustand().graben, felder: document.querySelectorAll("#lcPlaetze .sp-acker").length }));
  sage(!weg.an && weg.felder === 0, "Werkzeug in der Leiste antippen: weggelegt, die Felder verschwinden", JSON.stringify(weg));

  console.log("\nMÜHLE, BÄCKEREI, MARKT\n");
  const dorf = async () => { await pg.evaluate(() => { const Q = window.DMA_SPIEL.pruef, S = Q.zustand(); S.ich = Object.assign({}, window.__ich, S.ich); S.schnellMenue = true; S.schnellReiter = "dorf"; Q.schnellZeichnen(true); }); await tick(200); };
  await dorf();
  const d1 = await pg.evaluate(() => {
    const m = document.querySelector('.sp-schnellmenue [data-s="liefern"][data-g="muehle"]'), sm = document.querySelector(".sp-schnellmenue");
    return { mahlen: m ? m.textContent : "", lager: (document.querySelector(".sp-lager") || {}).textContent || "", muehleSvg: Boolean(document.querySelector(".sp-schnellmenue .sp-muehle-fluegel")),
      mitMuehle: [...document.querySelectorAll(".sp-schnellmenue .sp-dorf b")].some((b) => /Mühle/.test(b.textContent)), quer: sm ? sm.scrollWidth - sm.clientWidth : -1 };
  });
  sage(/Mahlen\s*5 Getreide/.test(d1.mahlen) && /Getreide/.test(d1.lager) && d1.muehleSvg && d1.mitMuehle, "Mein Dorf: Lager, Mühle mit Windrad, „Mahlen · 5 Getreide“ (höchstens 5 je Stufe)", JSON.stringify(d1));
  sage(d1.quer <= 1, "das Dorf-Menü passt in die Breite (kein Seitwärts-Scrollen)", d1.quer + " px");
  await pg.evaluate(() => { window.__rufe.length = 0; document.querySelector('.sp-schnellmenue [data-s="liefern"][data-g="muehle"]').scrollIntoView({ block: "center" }); });
  await tippe('.sp-schnellmenue [data-s="liefern"][data-g="muehle"]');
  await tick(300);
  const d2 = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_beliefern") || {}).args, zeile: (document.querySelector('.sp-schnellmenue [data-s="abholen"][data-g="muehle"]') || {}).parentElement ? document.querySelector('.sp-schnellmenue [data-s="abholen"][data-g="muehle"]').parentElement.textContent : "", meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "" }));
  sage(d2.ruf && d2.ruf.p_gebaeude === "muehle" && d2.ruf.p_menge === 5 && /fertig um \d+:\d\d/.test(d2.zeile) && /mahlt 5 Mehl/.test(d2.meld), "Mühle beliefert: Auftrag läuft, „fertig um …“, Abholen-Knopf", JSON.stringify(d2));
  await tippe('.sp-schnellmenue [data-s="abholen"][data-g="muehle"]');
  const d3 = await pg.evaluate(() => window.__hinweise.slice(-1)[0] || "");
  sage(/noch nicht fertig – noch [78]:\d\d/.test(d3), "zu früh abholen: der Server sagt, wie lange noch", d3);
  await pg.evaluate(() => { window.__ich.werk.muehle.fertig = new Date(Date.now() - 1000).toISOString(); window.DMA_SPIEL.pruef.zustand().ich.werk = window.__ich.werk; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  await tippe('.sp-schnellmenue [data-s="abholen"][data-g="muehle"]');
  await tick(200);
  const d4 = await pg.evaluate(() => ({ mehl: window.DMA_SPIEL.pruef.zustand().ich.vorraete.mehl, meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "",
    brot: (document.querySelector('.sp-schnellmenue [data-s="liefern"][data-w="brot"]') || {}).textContent || "", kuchen: (document.querySelector('.sp-schnellmenue [data-s="liefern"][data-w="kuchen"]') || {}).textContent || "" }));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-dorf.png" });
  sage(d4.mehl === 5 && /\+5 Mehl abgeholt/.test(d4.meld), "fertig: abgeholt, 5 Mehl im Lager", JSON.stringify(d4));
  sage(/Brot\s*5 Mehl/.test(d4.brot) && /Kuchen\s*4 Mehl/.test(d4.kuchen), "Bäckerei bietet Brot (1 Mehl) und Kuchen (2 Mehl)", d4.brot + " | " + d4.kuchen);
  await pg.evaluate(() => document.querySelector('.sp-schnellmenue [data-s="liefern"][data-w="kuchen"]').scrollIntoView({ block: "center" }));
  await tippe('.sp-schnellmenue [data-s="liefern"][data-w="kuchen"]');
  await pg.evaluate(() => { window.__ich.werk.baeckerei.fertig = new Date(Date.now() - 1000).toISOString(); window.DMA_SPIEL.pruef.zustand().ich.werk = window.__ich.werk; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  await tippe('.sp-schnellmenue [data-s="abholen"][data-g="baeckerei"]');
  await tick(200);
  const d5 = await pg.evaluate(() => ({ kuchen: window.DMA_SPIEL.pruef.zustand().ich.vorraete.kuchen, markt: [...document.querySelectorAll('.sp-schnellmenue [data-s="markt"]')].map((b) => b.textContent),
    essen: (document.querySelector('.sp-schnellmenue .sp-markt [data-s="iss"][data-d="kuchen"]') || {}).textContent || "" }));
  sage(d5.kuchen === 2 && d5.essen && /\+30 LP/.test(d5.essen), "2 Kuchen gebacken und abgeholt – „Kuchen essen (+30 LP)“ steht bereit", JSON.stringify(d5));
  sage(d5.markt.some((t) => /Kuchen verkaufen\s*2 × 14 = \+28/.test(t)), "Markt: Kuchen verkaufen zeigt Menge × Preis = Erlös", JSON.stringify(d5.markt));
  await pg.evaluate(() => { window.__rufe.length = 0; const b = [...document.querySelectorAll('.sp-schnellmenue [data-s="markt"]')].find((x) => /Kuchen/.test(x.textContent)); b.scrollIntoView({ block: "center" }); b.id = "__kuchenMarkt"; });
  const punkteVor = await pg.evaluate(() => window.__ich.punkte);
  await tippe("#__kuchenMarkt");
  await tick(200);
  const d6 = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_markt") || {}).args, punkte: window.__ich.punkte, meld: window.__hinweise.slice(-3).filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "" }));
  sage(d6.ruf && d6.ruf.p_ware === "kuchen" && d6.punkte === punkteVor + 28 && /\+28 Punkte/.test(d6.meld), "verkauft: +28 Punkte", JSON.stringify(d6));
  await pg.evaluate(() => { window.__ich.vorraete.brot = 3; const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, S.ich, { vorraete: window.__ich.vorraete }); S.schnellMenue = true; S.schnellReiter = "heilen"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  const e1 = await pg.evaluate(() => { window.__rufe.length = 0; const b = document.querySelector('.sp-schnellmenue [data-s="iss"][data-d="brot"]'); const t = b ? b.textContent : ""; if (b) b.click(); return t; });
  await tick(300);
  const e2 = await pg.evaluate(() => (window.__rufe.find((r) => r.name === "spiel_essen") || {}).args);
  sage(/Brot essen/.test(e1) && e2 && e2.p_ding === "brot", "Heilen-Menü: „Brot essen“ ruft spiel_essen(brot)", e1 + " " + JSON.stringify(e2));

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 677: " + fehler + " rot." : "Fassung 677 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
