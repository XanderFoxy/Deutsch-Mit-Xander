#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 817: DAS BILD PASSGENAU, DIESELBEN KNÖPFE, HAUS-TIPP,
   KACHELN BIS AN DEN RAND, DOPPELTIPP
   ---------------------------------------------------------------------
   XANDER (Walkie 305): „beim öffnen soll das Bild passgenau in diesem
   iPhone liegen so wie es ja auch rein passt … es ist nur an der falschen
   Position geöffnet mit der Überschrift … die Überschrift soll da bleiben
   … auch wenn man zwischen der alten und neuen … wechselt soll es immer
   wieder an dem Platz springen".
   „genau die Buttons und genau die Funktionen sollen unter der neuen
   Version genauso stehen … dass die Labels an und ausgehen dass sich das
   Halloween Paket an und ausschalten kann … nur unter dem neuen Bild".
   „entweder springe ich runter zu der Dialogbox die unter dem Bild liegt
   … und sobald ich dann gesagt habe losschicken oder einsammeln oder
   produzieren dass es bei dem Klick auf den Button wieder an die Position
   in mein Dorfbild springt … dass man beim einfachen klicken auf ein Haus
   einfach schon die Aufgabe anstellt … es sei denn … Brot, Kuchen oder
   Torte … kleine Einzelauswahl … wo man auf das Symbol klickt".
   „durch einen Double Tab in das Bild soll man auch … stärker reinkommen
   nicht nur durch den Kompass".
   Walkie 306: „die Kachel ist nicht kongruent mit dem eigentlichen
   Bildausschnitt … die Kachel oben rechts das ganze oben rechts anzeigen
   bis zur Grenze … oben links … unten links … unten rechts".
   Geprüft auf einem Android-Telefon (360 × 740, echte Finger), das Spiel
   mit nachgebautem Server (Aufbau wie Sonde 799): das Bild liegt nach dem
   Öffnen und nach alt → neu → alt → neu ganz im sichtbaren Teil (±2 px),
   die Überschrift darüber; unter der neuen Version stehen alle Knöpfe der
   alten und wirken in der Stadt; Tipp aufs Haus → Karte darunter →
   Aufgabe → zurück zum Bild; die Mühle mahlt sofort, die Bäckerei zeigt
   eine kleine Auswahl; die Ecken-Kacheln zeigen genau die Ecken;
   Doppeltipp rein und raus (ohne dass der erste Tipp etwas auslöst);
   Tippflächen ≥ 30 px, nichts überlappt, keine neuen Emoji-Grafiken.
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/fassung-setzen.js --nur-stempel
           node werkzeug/pruefe-817-rahmen-bedienung.js   (BILD=/pfad/f817 für Bilder)
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
  const nah = (a, b) => a && b && Math.abs(a.l - b.l) < 1.5 && Math.abs(a.t - b.t) < 1.5 && Math.abs(a.w - b.w) < 1.5 && Math.abs(a.h - b.h) < 1.5;
  const stadtFrame = () => pg.frames().find((x) => /stadt-leicht\.html/.test(x.url()));
  const imFrame = async (fn, arg) => { const f = stadtFrame(); if (!f) return null; try { return await f.evaluate(fn, arg); } catch (e) { return null; } };
  const tippeImFrame = async (sel) => {
    await pg.evaluate(() => { const p = document.querySelector(".sp-dl-neustadt-platz"); if (p) p.scrollIntoView({ block: "center" }); }); await tick(450);
    const m = await imFrame((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; }, sel);
    const off = await lage(".sp-lstadt");
    if (!m || !off) return null;
    await pg.touchscreen.tap(off.l + m.x, off.t + m.y); return m;
  };


  /* ---------------- FASSUNG 817 ---------------- */
  const BILD = process.env.BILD || "";
  const knipsen = async (n) => { if (BILD) await pg.screenshot({ path: BILD + "-" + n + ".png" }); };
  const S = () => "window.DMA_SPIEL.pruef.zustand()";
  /* Spielstand auf beiden Seiten setzen: im nachgebauten Server (window.__ich) und im Spiel (S.ich). */
  const stand = (fn) => pg.evaluate((f) => { const g = new Function("ich", f); g(window.__ich); g(window.DMA_SPIEL.pruef.zustand().ich); window.DMA_SPIEL.pruef.schnellZeichnen(true); }, fn);
  await pg.evaluate(() => {
    window.DMA_SPIEL.pruef.jahrVorschau("", true);   // „Saison" und „Halloween-Paket" wie beim Betreiber
    window.__extra = Object.assign(window.__extra || {}, {
      spiel_beliefern: (a, ich) => { ich.werk = Object.assign({}, ich.werk, { [a.p_gebaeude]: { ware: a.p_ware, menge: a.p_menge, start: new Date().toISOString(), fertig: new Date(Date.now() + 600000).toISOString() } });
        return Object.assign({ ok: true, gebaeude: a.p_gebaeude, ware: a.p_ware, menge: a.p_menge, minuten: 10 }, ich); },
      spiel_saison_setzen: (a, ich) => { ich.saison = a.p_an ? [a.p_art] : []; return { ok: true, art: a.p_art, aufgaben: 3 }; },
      spiel_dorf_umsetzen: (a, ich) => Object.assign({ ok: true }, ich)
    });
  });
  /* ohne Kuhstall: sein Milch-Schild läge im Überblick über der Mühle */
  await stand("ich.werk = {}; ich.vorraete = Object.assign({}, ich.vorraete, { getreide: 6, mehl: 3 }); delete ich.dorf.kuhstall; ich.dorf.schmiede = { stufe: 1, lp: 20 };");
  const rufe = (name) => pg.evaluate((n) => window.__rufe.filter((r) => r.name === n).map((r) => r.args), name);
  /* Liegt das Bild ganz im sichtbaren Teil (Menü UND Bildschirm), die Überschrift darüber? */
  const passt = () => pg.evaluate(() => {
    const r = document.querySelector(".sp-schnell .sp-dl-rahmen"); if (!r) return null;
    const sc = r.closest(".sp-schnellmenue"), q = r.getBoundingClientRect(), s = sc.getBoundingClientRect(), k = sc.querySelector(".sp-sm-kopf").getBoundingClientRect();
    let kopfAlles = k.bottom; sc.querySelectorAll(".sp-sm-kopf *").forEach((e) => { const b = e.getBoundingClientRect(); if (b.height) kopfAlles = Math.max(kopfAlles, b.bottom); });
    const oben = Math.max(0, s.top + sc.clientTop), unten = Math.min(innerHeight, s.top + sc.clientTop + sc.clientHeight);
    const ls = document.querySelector(".sp-lstadt"), lr = ls && getComputedStyle(ls).visibility !== "hidden" ? ls.getBoundingClientRect() : null;
    return { t: +q.top.toFixed(1), b: +q.bottom.toFixed(1), oben: +oben.toFixed(1), unten: +unten.toFixed(1), kopf: [+k.top.toFixed(1), +k.bottom.toFixed(1)], kopfAlles: +kopfAlles.toFixed(1), ls: lr && [+lr.top.toFixed(1), +lr.bottom.toFixed(1)], clip: ls ? ls.style.clipPath : "", menue: Math.round(sc.scrollTop), seite: Math.round(scrollY) };
  });
  const istPassgenau = (p, neu) => !!p && p.t >= p.oben - 2 && p.b <= p.unten + 2 && p.kopf[0] >= p.oben - 2 && p.kopf[1] <= p.t + 1
    && (!neu || (!!p.ls && Math.abs(p.ls[0] - p.t) < 2 && Math.abs(p.ls[1] - p.b) < 2 && !p.clip));
  /* FASSUNG 812 — nach einer Aufgabe (Rücksprung) „im Spot": Bild mittig (oben ≈ unten Rand), die Kopfzeile mit dem Kreuz
     ganz ausgeblendet (dafür bekommt das Bild oben Luft), auch beim Öffnen */
  const imSpot = (p, neu) => !!p && p.t >= p.oben - 2 && p.b <= p.unten + 2 && p.kopfAlles <= p.oben + 1
    && Math.abs((p.t - p.oben) - (p.unten - p.b)) < 8   // oben und unten gleicher Rand („wie ein gerahmtes Foto")
    && (!neu || (!!p.ls && Math.abs(p.ls[0] - p.t) < 2 && Math.abs(p.ls[1] - p.b) < 2 && !p.clip));
  const menueRunter = () => pg.evaluate(() => { const m = document.querySelector(".sp-schnell .sp-sm-blick"); if (m) m.scrollTop = 1e6; });
  const menueHoch = () => pg.evaluate(() => { const m = document.querySelector(".sp-schnell .sp-sm-blick"); if (m) m.scrollTop = 0; });
  const knoepfe = () => pg.evaluate(() => [...document.querySelectorAll(".sp-schnell .sp-dl-beschriftung button")].map((b) => b.dataset.s + (b.dataset.v ? ":" + b.dataset.v : "") + (b.dataset.mit ? ":" + b.dataset.mit : "") + (b.dataset.s === "dorfanzeige" ? ":" + b.textContent.trim().split(" ")[0] : "")));
  const hausPunkt = (g) => imFrame((g) => { const SZ = window.STADT.szene, K = window.STADT.kamera;
    for (const e of SZ.sichtbare.slice().reverse()) { if (e.o.art !== "haus" || e.o.spiel !== g) continue; const m = e.meta;
      for (let fy = .55; fy < .95; fy += .1) for (let fx = .3; fx < .75; fx += .1) { const px = e.X - m.ax * e.k + m.w * e.k * fx, py = e.Y - m.ay * e.k + m.h * e.k * fy;
        if (px < 4 * K.dpr || py < 34 * K.dpr || px > K.W - 4 * K.dpr || py > K.H - 4 * K.dpr || (px < 42 * K.dpr && py > K.H - 42 * K.dpr)) continue;
        if (SZ.treffer(px, py) !== e.o) continue;
        const b = document.elementFromPoint(px / K.dpr, py / K.dpr); if (b && b.closest && b.closest("button, .lk-schieber, .lk-zeichen")) continue;   // (FASSUNG 812: nicht auf den Dreh-Schieber; 829: nicht auf ein Zeichen – Acker 91 liegt seit Funk 255 zwischen Mühle und Bäckerei, sein Zeichen ragt über die Bäckerei)
        return { x: px / K.dpr, y: py / K.dpr }; } }
    if (false) return null; return { fehl: SZ.sichtbare.filter((e) => e.o.spiel === g).map((e) => [Math.round(e.X / K.dpr), Math.round(e.Y / K.dpr)]), z: [...document.querySelectorAll(".lk-zeichen")].filter((z) => getComputedStyle(z).display !== "none").map((z) => z.dataset.g + ":" + JSON.stringify(z.getBoundingClientRect())) }; }, g);
  const tippeHaus = async (g) => { const p = await hausPunkt(g), o = await lage(".sp-lstadt"); if (p && p.fehl) console.log("     (" + g + " nicht antippbar: " + JSON.stringify(p) + ")"); if (!p || p.fehl || !o) return null; await pg.touchscreen.tap(o.l + p.x, o.t + p.y); return p; };
  /* Doppeltipp wie ein Finger: zweimal kurz, 120 ms Abstand (direkt über CDP – touchscreen.tap braucht selbst ~0,3 s) */
  const cdpT = await ctx.newCDPSession(pg);
  const tippSenden = (x, y) => [cdpT.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }), cdpT.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })];
  const doppel = async (x, y) => { if (!isFinite(x) || !isFinite(y)) return; const a = tippSenden(x, y); await new Promise((ok) => setTimeout(ok, 120)); await Promise.all(a.concat(tippSenden(x, y))); };

  try {
  console.log("\nDAS BILD PASSGENAU: BEIM ÖFFNEN UND BEIM UMSCHALTEN (Walkie 305)\n");
  /* Die Seite steht so, dass die Leiste weit oben ist – das Dorf-Menü darüber ragte ohne Nachrollen oben hinaus. */
  { const l = await lage(".sp-schnell"); await pg.evaluate((d) => window.scrollBy(0, d), l.t - 250); await tick(300); }
  await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
  let p = await passt();
  sage(imSpot(p, false), "beim Öffnen liegt das Dorfbild wie ein gerahmtes Foto im Menü: oben und unten gleicher Rand, Kopfzeile ausgeblendet (Fassung 812)", JSON.stringify(p));
  await knipsen("1-offen");
  const altListe = await knoepfe();
  await menueRunter(); await tick(300);
  await tippe('[data-s="stadtversion"][data-v="neu"]'); await tick(900);
  let fr = null;
  for (let i = 0; i < 80 && !fr; i++) { const f = stadtFrame(); if (f && await f.evaluate(() => !!document.querySelector(".lk-lupe") && !!window.STADT.oberflaeche.ueberblick).catch(() => false)) fr = f; else await tick(250); }
  sage(!!fr, "die neue Stadt ist im Rahmen geladen");
  await tick(1500);
  p = await passt();
  sage(imSpot(p, true), "alt → neu: das Stadtbild springt passgenau an den Platz (Rahmen der Stadt deckungsgleich, nichts abgeschnitten)", JSON.stringify(p));
  await knipsen("2-neu");
  const neuListe = await knoepfe();
  for (const [v, neu] of [["alt", false], ["neu", true]]) {
    await menueRunter(); await tick(300);
    await tippe('[data-s="stadtversion"][data-v="' + v + '"]'); await tick(v === "neu" ? 2500 : 900);
    p = await passt();
    sage(imSpot(p, neu), "→ " + v + ": wieder genau an seinem Platz", JSON.stringify(p));
  }

  console.log("\nDIESELBEN KNÖPFE UNTER DER NEUEN VERSION (Walkie 305)\n");
  const teilfolge = (a, b) => { let i = 0; for (const x of b) if (x === a[i]) i++; return i === a.length; };
  sage(altListe.length >= 7 && teilfolge(altListe, neuListe), "jeder Knopf unter dem alten Bild steht auch unter dem neuen – in derselben Reihenfolge", JSON.stringify({ altListe, neuListe }));
  sage(["stadtvoll", "stadtgestalten:schmuck", "stadtgestalten:bauen", "lsdirekt"].every((k) => neuListe.includes(k)) && ["umbau", "jahrvorschau", "saisonschalter"].every((k) => neuListe.includes(k)),
    "dazu die neuen: Vollbild, Schmücken, Bauen, „Ein Tipp produziert“ (und Umbauen, Saison, Halloween-Paket sind da)", JSON.stringify(neuListe));
  const imStadt = (fn) => imFrame(fn);
  await tippe('.sp-dl-beschriftung [data-s="dorfanzeige"]'); await tick(1400);
  let st = await imStadt(() => ({ sym: !document.body.classList.contains("lk-ohne-symbole"), nam: !document.body.classList.contains("lk-ohne-namen") }));
  sage(!!st && st.sym && !st.nam, "„Symbole“ schaltet die Symbole in der neuen Stadt an", JSON.stringify(st));
  await tippe('.sp-dl-beschriftung [data-s="dorfanzeige"]:nth-of-type(2)'); await tick(1400);
  st = await imStadt(() => ({ sym: !document.body.classList.contains("lk-ohne-symbole"), nam: !document.body.classList.contains("lk-ohne-namen") }));
  sage(!!st && st.nam, "„Namen“ schaltet die Namen in der neuen Stadt an", JSON.stringify(st));
  for (let i = 0; i < 3; i++) { await tippe('.sp-dl-beschriftung [data-s="jahrvorschau"]'); await tick(350); }
  await tick(1300);
  const saisonText = await pg.evaluate(() => (document.querySelector('.sp-dl-beschriftung [data-s="jahrvorschau"]') || {}).textContent);
  st = await imStadt(() => ({ modus: window.STADT.szene.modus, jahr: window.STADT.szene.jahr, fest: window.STADT.oberflaeche.fest }));
  sage(/Halloween/.test(saisonText || "") && !!st && st.modus === "fruehherbst" && st.jahr === "herbst" && st.fest === "halloween", "„Saison: Halloween“ stellt die neue Stadt auf Herbst mit Halloween (Kürbisse)", JSON.stringify({ saisonText, st }));
  if (BILD) { await imFrame(() => { const O = window.STADT.oberflaeche, g = O.ueberblick(); const b = window.STADT.szene.objekte.find((o) => o.spiel === "baeckerei"); window.STADT.leicht.fliegeZu(b.x, b.y, g.s * 3, 10); }); await tick(1500); await knipsen("3-halloween"); await imFrame(() => { const g = window.STADT.oberflaeche.ueberblick(); window.STADT.leicht.fliegeZu(g.x, g.y, g.s, 10); }); await tick(900); }
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.jahrVorschau("", true); try { localStorage.removeItem("dma_jahr_vorschau"); } catch (e) {} window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(1400);
  st = await imStadt(() => ({ modus: window.STADT.szene.modus, fest: window.STADT.oberflaeche.fest }));
  sage(!!st && st.modus === "auto" && st.fest !== "halloween", "„Saison: echt“ gibt der Stadt Datum und Wetter zurück", JSON.stringify(st));
  await tippe('.sp-dl-beschriftung [data-s="saisonschalter"]'); await tick(700);
  const hp = await rufe("spiel_saison_setzen"), hpText = await pg.evaluate(() => (document.querySelector('.sp-dl-beschriftung [data-s="saisonschalter"]') || {}).textContent);
  sage(hp.length === 1 && hp[0].p_art === "halloween" && hp[0].p_an === true && /an$/.test(hpText || ""), "„Halloween-Paket“ schaltet auch unter der neuen Version (spiel_saison_setzen)", JSON.stringify({ hp, hpText }));
  await tippe('.sp-dl-beschriftung [data-s="saisonschalter"]'); await tick(700);
  sage(((await rufe("spiel_saison_setzen")).slice(-1)[0] || {}).p_an === false, "… und wieder aus");
  await tippe('.sp-dl-beschriftung [data-s="umbau"]'); await tick(700);
  const ul = await pg.evaluate(() => !!document.querySelector(".sp-dl-neustadt ~ .sp-dl-umbauleiste"));
  await menueHoch(); await tick(500);
  await tippeHaus("baeckerei"); await tick(900);
  const uw = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().umbauWahl);
  await tippeHaus("brauerei"); await tick(900);
  const us = await rufe("spiel_dorf_umsetzen");
  sage(ul && uw === "baeckerei" && us.length === 1 && us[0].p_was === "baeckerei" && us[0].p_ziel === "brauerei", "„Umbauen“ unter der neuen Stadt: Leiste darunter, Tipp aufs Haus wählt, Tipp aufs nächste setzt um (spiel_dorf_umsetzen)", JSON.stringify({ ul, uw, us, h: await zuletzt() }));
  await tippe('.sp-dl-umbauleiste [data-s="umbau"]'); await tick(700);
  sage(await pg.evaluate(() => !window.DMA_SPIEL.pruef.zustand().umbau), "„Fertig“ beendet das Umbauen");

  console.log("\nTIPPFLÄCHEN, ÜBERLAPPUNG, KEINE NEUEN EMOJI-GRAFIKEN (Knopfreihe)\n");
  const kr = await pg.evaluate(() => { const b = [...document.querySelectorAll(".sp-schnell .sp-dl-beschriftung button")].map((x) => x.getBoundingClientRect());
    let ueber = 0; for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) { const w = Math.min(b[i].right, b[j].right) - Math.max(b[i].left, b[j].left), h = Math.min(b[i].bottom, b[j].bottom) - Math.max(b[i].top, b[j].top); if (w > .5 && h > .5) ueber++; }
    return { n: b.length, min: Math.min(...b.map((r) => Math.min(r.width, r.height))), ueber: ueber }; });
  sage(kr.n >= 10 && kr.min >= 30 && kr.ueber === 0, "alle Knöpfe unter der neuen Version ≥ 30 px, keiner über dem anderen", JSON.stringify(kr));

  console.log("\nHAUS ANTIPPEN: KARTE DARUNTER → AUFGABE → ZURÜCK ZUM BILD (Walkie 305)\n");
  await menueHoch(); await tick(600);
  const spS = await tippeHaus("schule"); await tick(1700);
  const sk = await pg.evaluate(() => { const e = document.querySelector(".sp-dl-neustadt ~ .sp-dl-station"); if (!e) return null; const sc = e.closest(".sp-schnellmenue"), r = e.getBoundingClientRect(), s = sc.getBoundingClientRect();
    const o = s.top + sc.clientTop, u = o + sc.clientHeight; return { name: e.getAttribute("aria-label"), t: r.top, b: r.bottom, o: o, u: u, ganz: r.top >= o - 2 && (r.bottom <= u + 2 || Math.abs(r.top - o) < 2) }; });
  sage(!!sk && sk.name === "Schule" && sk.ganz, "Tipp auf die Schule: das Menü rollt sanft zur Karte darunter, sie ist ganz zu sehen", JSON.stringify(sk || { spS, wahl: await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().dorfWahl), h: await zuletzt() }));
  await knipsen("4-karte");
  const bau0 = (await rufe("spiel_bauen")).length;
  await tippe(".sp-dl-neustadt ~ .sp-dl-station .sp-dl-st-knoepfe button:not([disabled])"); await tick(1700);
  p = await passt();
  sage((await rufe("spiel_bauen")).length === bau0 + 1 && imSpot(p, true), "Aufgabe in der Karte (Ausbauen) → das Menü springt zurück, das Bild liegt mittig im Spot, Kopfzeile mit Kreuz ganz ausgeblendet (Fassung 812)", JSON.stringify(p));
  await knipsen("5-zurueck");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(400);
  await menueHoch(); await tick(300);
  /* Ohne die Einstellung „Ein Tipp produziert“ (Grundstellung): nichts startet von selbst.
     FASSUNG 844 — XANDER (Walkie 313): „kleine Symbole am Haus … jetzt kriege ich trotzdem wieder das große Menü und dann
     springt manchmal die Seite hoch". Hat die Mühle etwas zu tun, kommt die kleine Auswahl ans Haus (kein Sprung zur Karte). */
  await tippeHaus("muehle"); await tick(1700);
  const ms = await pg.evaluate(() => { const e = document.querySelector(".sp-dl-neustadt ~ .sp-dl-station"); return e && e.getAttribute("aria-label"); });
  const mw = await imFrame(() => { const w = document.querySelector(".lk-wahl"); return w ? w.querySelectorAll(".lk-wahl-knopf").length : 0; });
  sage((ms === "Mühle" || mw > 0) && (await rufe("spiel_beliefern")).length === 0, "ohne „Ein Tipp produziert“: Tipp auf die Mühle zeigt die kleine Auswahl am Haus (oder die Karte), nichts startet von selbst", JSON.stringify({ ms, mw }));
  /* die Auswahl schließen wie ein Tipp daneben: die Stadt fliegt zurück zur ganzen Stadt */
  await imFrame(() => { const O = window.STADT && STADT.oberflaeche; if (!O) return; if (O.wahlZu) O.wahlZu(); if (O.fokusVergessen) O.fokusVergessen(); if (O.zurStartAnsicht) O.zurStartAnsicht(false); });
  await tick(900);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(300);
  await tippe('.sp-dl-beschriftung [data-s="lsdirekt"]'); await tick(1400);
  const dk = await pg.evaluate(() => (document.querySelector('.sp-dl-beschriftung [data-s="lsdirekt"]') || {}).textContent);
  sage(/an$/.test(dk || "") && await imFrame(() => document.body.classList.contains("lk-direkt")), "Einstellung „Ein Tipp produziert: an“ unter dem Bild (Funk 207), die Stadt weiß es", dk);
  await menueHoch(); await tick(400);
  await tippeHaus("muehle"); await tick(1100);
  let bl = await rufe("spiel_beliefern");
  sage(bl.length === 1 && bl[0].p_gebaeude === "muehle" && bl[0].p_ware === "mehl" && bl[0].p_menge === 6 && (await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().dorfWahl)) !== "muehle",
    "Tipp auf die Mühle (eine Aufgabe): sie mahlt gleich alles Getreide – ohne Umweg über die Karte", JSON.stringify({ bl, z: await imFrame(() => [...document.querySelectorAll(".lk-zeichen")].map((z) => z.dataset.g + ":" + z.title)), h: await zuletzt() }));
  await tick(1300);
  const uhr = await imFrame(() => { const z = document.querySelector('.lk-zeichen[data-g="muehle"]'); return z && { kl: z.className, t: z.textContent, sicht: getComputedStyle(z).display !== "none" }; });
  sage(!!uhr && /lk-z-laeuft/.test(uhr.kl) && uhr.sicht && /\d:\d\d/.test(uhr.t), "… und über der Mühle steht gleich die kleine Uhr (auch im Überblick)", JSON.stringify(uhr));
  await tippeHaus("baeckerei"); await tick(1100);
  const wahl = await imFrame(() => { const w = document.querySelector(".lk-wahl"); if (!w) return null; const r = w.getBoundingClientRect(), g = (s) => { const e = document.querySelector(s); if (!e || getComputedStyle(e).display === "none") return null; return e.getBoundingClientRect(); };
    const k = [...w.querySelectorAll("button")].map((b) => { const q = b.getBoundingClientRect(); return { w: b.dataset.w || "karte", t: b.textContent, aus: b.disabled, gr: Math.min(q.width, q.height) }; });
    const schnitt = (a) => a && Math.min(a.right, r.right) - Math.max(a.left, r.left) > .5 && Math.min(a.bottom, r.bottom) - Math.max(a.top, r.top) > .5;
    const zeichen = [...document.querySelectorAll(".lk-zeichen")].filter((z) => getComputedStyle(z).display !== "none").map((z) => z.getBoundingClientRect());
    return { k: k, drin: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, ueber: [".lk-lupe", ".lk-uhr", ".lk-ortsschild", ".lk-vollknopf", ".lk-wetter"].filter((s) => schnitt(g(s))).concat(zeichen.filter(schnitt).map(() => "zeichen")), emoji: /\p{Extended_Pictographic}/u.test(w.textContent) }; });
  sage(!!wahl && wahl.k.map((x) => x.w).join() === "brot,kuchen,torte,karte" && wahl.k[2].aus && !wahl.k[0].aus && /×3/.test(wahl.k[0].t) && (await rufe("spiel_beliefern")).length === 1,
    "Tipp auf die Bäckerei: über dem Haus eine kleine Auswahl Brot ×3 · Kuchen ×1 · Torte (fehlt) · Karte – noch nichts gestartet", JSON.stringify(wahl && wahl.k));
  sage(!!wahl && wahl.drin && wahl.ueber.length === 0 && wahl.k.every((x) => x.gr >= 30) && !wahl.emoji, "die Auswahl liegt im Bild, über nichts anderem, Tippflächen ≥ 30 px, keine Emoji", JSON.stringify(wahl && { drin: wahl.drin, ueber: wahl.ueber }));
  await knipsen("6-auswahl");
  { const q = await imFrame(() => { const e = document.querySelector('.lk-wahl [data-w="kuchen"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }), o = await lage(".sp-lstadt");
    if (q) await pg.touchscreen.tap(o.l + q.x, o.t + q.y); await tick(900); }
  bl = await rufe("spiel_beliefern");
  sage(bl.length === 2 && bl[1].p_gebaeude === "baeckerei" && bl[1].p_ware === "kuchen" && bl[1].p_menge === 1 && !(await imFrame(() => !!document.querySelector(".lk-wahl"))), "Tipp auf den Kuchen: die Bäckerei backt Kuchen, die Auswahl geht zu", JSON.stringify(bl[1]));
  /* FASSUNG 844 — nach dem Symbol fliegt die Stadt zurück zur ganzen Stadt (Walkie 313: „wenn man die Aufgabe erledigt hat … dass es dann wieder auf das Gesamtbild der Stadt springt"); erst danach wieder tippen */
  await stand("ich.werk = {}; ich.vorraete = Object.assign({}, ich.vorraete, { getreide: 6, mehl: 3 });"); await tick(2600);
  await tippeHaus("baeckerei"); await tick(1000);
  { const q = await imFrame(() => { const b = document.querySelector(".lk-wahl .lk-wahl-karte"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }), o = await lage(".sp-lstadt");
    if (q) await pg.touchscreen.tap(o.l + q.x, o.t + q.y); await tick(1200); }
  sage(await pg.evaluate(() => { const e = document.querySelector(".sp-dl-neustadt ~ .sp-dl-station"); return !!e && e.getAttribute("aria-label") === "Bäckerei"; }), "„Karte“ in der Auswahl öffnet die Station der Bäckerei darunter");
  await tippe('.sp-dl-neustadt ~ .sp-dl-station [data-s="liefern"][data-w="brot"]'); await tick(1700);
  p = await passt();
  sage(((await rufe("spiel_beliefern")).slice(-1)[0] || {}).p_ware === "brot" && imSpot(p, true), "„Brot“ in der Station → wieder zurück zum Bild, mittig im Spot (Fassung 812)", JSON.stringify({ p, b: (await rufe("spiel_beliefern")).slice(-2), w: await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().dorfWahl), h: await zuletzt() }));

  console.log("\nKACHELN DER KLEINEN KARTE: GENAU IHR TEIL, BIS AN DEN RAND (Walkie 306)\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(300);
  await tippeImFrame(".lk-lupe"); await tick(1000);
  const mk = await imFrame(() => { const m = document.querySelector(".lk-mini").getBoundingClientRect(), f = [...document.querySelectorAll(".lk-mini-feld")].map((q) => q.getBoundingClientRect()); return { v: m.width / m.height, bild: innerWidth / innerHeight, n: f.length, min: Math.min(...f.map((q) => Math.min(q.width, q.height))) }; });
  sage(!!mk && mk.n === 9 && Math.abs(mk.v - mk.bild) < 0.08, "die kleine Karte hat die Form des Bildes (16:10) – ein Abbild des Überblicks", JSON.stringify(mk));
  for (const [i, j, name] of [[2, 0, "oben rechts"], [0, 0, "oben links"], [0, 2, "unten links"], [2, 2, "unten rechts"], [1, 1, "Mitte"]]) {
    await tippeImFrame(".lk-mini-feld:nth-child(" + (j * 3 + i + 1) + ")"); await tick(1200);
    const t = await imFrame(() => window.STADT.oberflaeche.blickTeile ? window.STADT.oberflaeche.blickTeile() : null);
    const soll = [[i / 3, j / 3], [(i + 1) / 3, (j + 1) / 3]];
    const ok = !!t && [0, 1].every((a) => [0, 1].every((b) => Math.abs(t[a][b] - soll[a][b]) < 0.02));
    const deck = await imFrame((n) => { const b = document.querySelector(".lk-mini-blick"), f = document.querySelector(".lk-mini-feld:nth-child(" + n + ")"); if (!b || !f) return null; const r = b.getBoundingClientRect(), q = f.getBoundingClientRect(); return Math.max(Math.abs(r.left - q.left), Math.abs(r.top - q.top), Math.abs(r.right - q.right), Math.abs(r.bottom - q.bottom)); }, j * 3 + i + 1);
    sage(ok && deck != null && deck < 2.5, "Kachel " + name + ": das Bild zeigt genau dieses Neuntel des Überblicks" + (i !== 1 ? " – bis an den Rand" : "") + ", der helle Rahmen deckt die Kachel", JSON.stringify({ t: t && t.map((q) => q.map((x) => +x.toFixed(3))), deck }));
    if (i === 2 && j === 0) {
      await knipsen("7-kachel-oben-rechts");
      /* Funk 207: „ich kann dann trotzdem noch weiter scrollen das macht keinen Sinn" – weiter nach rechts oben geht es nicht */
      /* in beide Richtungen wischen: die Richtung, die über den Rand hinaus wollte, bleibt am Rand stehen */
      const q = await lage(".sp-lstadt"), c = await ctx.newCDPSession(pg), x0 = q.l + q.w * .5, y0 = q.t + q.h * .5, ergebnis = [];
      for (const r of [1, -1]) {
        await c.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: y0 }] });
        for (let n = 1; n <= 10; n++) { await c.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + r * n * 9, y: y0 - r * n * 6 }] }); await tick(16); }
        await c.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await tick(800);
        ergebnis.push(await imFrame(() => window.STADT.oberflaeche.blickTeile().map((v) => v.map((x) => +x.toFixed(3)))));
        await tippeImFrame(".lk-mini-feld:nth-child(3)"); await tick(1100);
      }
      const drin = ergebnis.every((t2) => t2 && t2[0][0] >= -0.005 && t2[0][1] >= -0.005 && t2[1][0] <= 1.005 && t2[1][1] <= 1.005);
      const amRand = ergebnis.some((t2) => t2 && Math.abs(t2[1][0] - 1) < .01 && Math.abs(t2[0][1]) < .01);
      sage(drin && amRand, "… und weiter nach rechts oben wischen: der Blick bleibt am Rand der Karte stehen, nie darüber hinaus", JSON.stringify(ergebnis));
    }
  }

  console.log("\nDOPPELTIPP: STÄRKER REIN – UND WIEDER RAUS (Walkie 305)\n");
  await tippeImFrame(".lk-lupe"); await tick(1000);
  /* FASSUNG 844 — nach dem Symbol fliegt die Stadt zurück zur ganzen Stadt (Walkie 313: „wenn man die Aufgabe erledigt hat … dass es dann wieder auf das Gesamtbild der Stadt springt"); erst danach wieder tippen */
  await stand("ich.werk = {}; ich.vorraete = Object.assign({}, ich.vorraete, { getreide: 6, mehl: 3 });"); await tick(2600);
  const b0 = (await rufe("spiel_beliefern")).length;
  const mp = (await hausPunkt("muehle")) || { x: 140, y: 90 }, o = await lage(".sp-lstadt");
  const w0 = await imFrame((m) => { const K = window.STADT.kamera; return { s: K.s, g: window.STADT.oberflaeche.ueberblick().s, w: window.STADT.aufBoden(m.x * K.dpr, m.y * K.dpr) }; }, mp);
  await doppel(o.l + mp.x, o.t + mp.y); await tick(1100);
  const w1 = await imFrame(() => { const K = window.STADT.kamera; return { s: K.s, x: K.x, y: K.y, nah: document.body.classList.contains("lk-nah") }; });
  sage(!!w0 && Math.abs(w0.s / w0.g - 1) < 0.15 && !!w1 && w1.s / w0.g > 2.5 && w1.s / w0.g < 3.1 && w1.nah && Math.hypot(w1.x - w0.w[0], w1.y - w0.w[1]) < 3,
    "Doppeltipp im Überblick holt die getippte Stelle heran (so nah wie der Kompass, die Stelle in der Mitte)", JSON.stringify({ w0, w1 }));
  await tick(500);
  sage((await rufe("spiel_beliefern")).length === b0 && (await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().dorfWahl)) === "" && !(await imFrame(() => !!document.querySelector(".lk-wahl"))),
    "der erste Tipp des Doppeltipps (auf die Mühle) hat nichts gestartet und nichts geöffnet");
  await knipsen("8-doppeltipp");
  { const q = await lage(".sp-lstadt"), f = await imFrame(() => { const K = window.STADT.kamera; for (let fy = .5; fy < .9; fy += .05) for (let fx = .3; fx < .7; fx += .05) { const x = innerWidth * fx, y = innerHeight * fy, e = document.elementFromPoint(x, y); if (e && e.id === "lDinge" && !window.STADT.szene.treffer(x * K.dpr, y * K.dpr)) return { x, y }; } return null; });
    if (process.env.STAPEL) await imFrame(() => { const O = window.STADT.oberflaeche, alt = O.tippen; window.__t = []; O.tippen = (x, y) => { window.__t.push([Math.round(performance.now()), Math.round(x), Math.round(y)]); return alt(x, y); }; });
    await doppel(q.l + (f ? f.x : q.w / 2), q.t + (f ? f.y : q.h / 2)); await tick(1100);
    if (process.env.STAPEL) console.log("     tipps", JSON.stringify(f), JSON.stringify(await imFrame(() => window.__t))); }
  await tick(1800);
  const w2 = await imFrame(() => ({ s: window.STADT.kamera.s, g: window.STADT.oberflaeche.ueberblick().s, gross: window.STADT.bilder.zahl(/_g$/), stufe: window.STADT.oberflaeche.stufe() }));
  sage(!!w2 && w2.s / w2.g > 6.5 && w2.s / w2.g < 7.5 && w2.stufe === 2 && w2.gross > 0, "noch ein Doppeltipp: die zweite Zoomstufe (7-fach, Funk 207) – erst jetzt kommen große Bilder", JSON.stringify(w2));
  await knipsen("9-zweite-stufe");
  { const q = await lage(".sp-lstadt"); await doppel(q.l + q.w * .5, q.t + q.h * .45); await tick(2200); }
  const w3 = await imFrame(() => ({ s: window.STADT.kamera.s, g: window.STADT.oberflaeche.ueberblick().s, nah: document.body.classList.contains("lk-nah"), gross: window.STADT.bilder.zahl(/_g$/) }));
  sage(!!w3 && Math.abs(w3.s / w3.g - 1) < 0.1 && !w3.nah && w3.gross === 0, "und noch einmal: zurück zur ganzen Stadt, die großen Bilder sind wieder freigegeben", JSON.stringify(w3));

  console.log("\nSCHMÜCKEN UND BAUEN IM KLEINEN RAHMEN, OHNE VOLLBILD (Funk 207)\n");
  const g0 = await imFrame(() => performance.getEntriesByType("resource").filter((r) => /_g\.webp/.test(r.name)).length);
  await menueRunter(); await tick(300);
  await tippe('.sp-dl-beschriftung [data-s="stadtgestalten"][data-mit="schmuck"]'); await tick(1600);
  const imR = (s) => imFrame((s) => { const e = document.querySelector(s); if (!e || getComputedStyle(e).display === "none" || e.hidden) return null; const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; }, s);
  const le = await imFrame(() => { const l = document.querySelector(".lk-leiste:not(.lk-bauleiste)"); if (!l || l.hidden) return null; const r = l.getBoundingClientRect(), k = [...l.querySelectorAll(".lk-karte-klein")].map((b) => b.getBoundingClientRect());
    const ueber = [".lk-lupe", ".lk-uhr", ".lk-ortsschild", ".lk-gestalten-fertig"].filter((s) => { const e = document.querySelector(s); if (!e || getComputedStyle(e).display === "none") return false; const q = e.getBoundingClientRect(); return Math.min(q.right, r.right) - Math.max(q.left, r.left) > .5 && Math.min(q.bottom, r.bottom) - Math.max(q.top, r.top) > .5; });
    return { mini: document.body.classList.contains("lk-mini-modus"), drin: r.left >= 0 && r.right <= innerWidth + .5 && r.bottom <= innerHeight + .5 && r.top >= 0, min: Math.min(...k.map((q) => Math.min(q.width, q.height))), n: k.length, ueber: ueber, fertig: !!document.querySelector(".lk-gestalten-fertig") && getComputedStyle(document.querySelector(".lk-gestalten-fertig")).display !== "none" }; });
  const vollNein = await pg.evaluate(() => !document.querySelector(".sp-lstadt").classList.contains("sp-ls-voll"));
  sage(vollNein && !!le && le.mini && le.drin && le.n >= 10 && le.min >= 30 && le.ueber.length === 0 && le.fertig, "„Schmücken“ unter dem Bild: die Leiste öffnet sich IM kleinen Rahmen (kein Vollbild), Tippflächen ≥ 30 px, nichts verdeckt, „Fertig“ oben rechts", JSON.stringify({ vollNein, le }));
  await knipsen("10-schmuecken");
  { const q = await imR(".lk-leiste:not(.lk-bauleiste) .lk-karte-klein"), o = await lage(".sp-lstadt"); if (q) await pg.touchscreen.tap(o.l + q.l + q.w / 2, o.t + q.t + q.h / 2); await tick(900); }
  const ka = await imFrame(() => { const k = document.querySelector(".lk-karte"); if (!k || k.hidden) return null; const r = k.getBoundingClientRect(), b = [...k.querySelectorAll("button")].map((x) => x.getBoundingClientRect());
    return { titel: k.querySelector(".lk-karte-titel").textContent, drin: r.left >= 0 && r.right <= innerWidth + .5 && r.bottom <= innerHeight + .5 && r.top >= 0, min: Math.min(...b.map((q) => Math.min(q.width, q.height))), geist: window.STADT.szene.objekte.some((o) => o.geist) }; });
  sage(!!ka && ka.titel === "Schmuck setzen" && ka.geist && ka.drin && ka.min >= 30, "Laterne gewählt: sie steht als Geist in der Stadt, darunter kompakt Drehen · Setzen · Abbrechen (≥ 30 px)", JSON.stringify(ka));
  await knipsen("11-setzen");
  const eigen0 = await imFrame(() => window.STADT.szene.objekte.filter((o) => o.art === "eigen" && !o.geist).length);
  { const q = await imR(".lk-karte .lk-gut"), o = await lage(".sp-lstadt"); if (q) await pg.touchscreen.tap(o.l + q.l + q.w / 2, o.t + q.t + q.h / 2); await tick(900); }
  const eigen1 = await imFrame(() => ({ n: window.STADT.szene.objekte.filter((o) => o.art === "eigen" && !o.geist).length, geist: window.STADT.szene.objekte.some((o) => o.geist), karte: !document.querySelector(".lk-karte") || document.querySelector(".lk-karte").hidden }));
  sage(!!eigen1 && eigen1.n === eigen0 + 1 && !eigen1.geist && eigen1.karte, "„Setzen“: die Laterne steht (gemerkt), alles im kleinen Fenster", JSON.stringify({ eigen0, eigen1 }));
  await menueRunter(); await tick(300);
  await tippe('.sp-dl-beschriftung [data-s="stadtgestalten"][data-mit="bauen"]'); await tick(1200);
  const bl2 = await imR(".lk-bauleiste");
  sage(!!bl2 && bl2.b <= 176 && bl2.h <= 70, "„Bauen“: die Gebäudeleiste ebenfalls im kleinen Rahmen", JSON.stringify(bl2));
  await knipsen("12-bauen");
  await menueRunter(); await tick(300);
  await tippe('.sp-dl-beschriftung [data-s="stadtgestalten"][data-mit="bauen"]'); await tick(900);
  await menueHoch(); await tick(500);
  const d0 = await imFrame(() => { const o = window.STADT.szene.objekte.find((x) => x.spiel === "schule"); window.STADT.leicht.fliegeZu(o.x, o.y, window.STADT.kamera.s, 10); return o.dreh; });
  await tick(900);
  await tippeHaus("schule"); await tick(1100);
  const hk = await imFrame(() => { const k = document.querySelector(".lk-karte"); return k && !k.hidden ? k.querySelector(".lk-karte-titel").textContent : null; });
  sage(hk === "Schule" && (await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().dorfWahl)) === "", "beim Gestalten öffnet ein Tipp aufs Haus die Karte der Stadt (Drehen, Versetzen) – nicht die Station darunter", JSON.stringify(hk));
  await knipsen("13-hauskarte");
  { const q = await imR('.lk-karte .lk-knopf[aria-label="Drehen"]'), o = await lage(".sp-lstadt"); if (q) await pg.touchscreen.tap(o.l + q.l + q.w / 2, o.t + q.t + q.h / 2); await tick(700); }
  const d1 = await imFrame(() => window.STADT.szene.objekte.find((o) => o.spiel === "schule").dreh);
  sage(d1 !== d0, "„Drehen“ dreht die Schule im kleinen Rahmen", JSON.stringify({ d0, d1 }));
  const fq = await imR(".lk-gestalten-fertig");
  { const o = await lage(".sp-lstadt"); if (fq) await pg.touchscreen.tap(o.l + fq.l + fq.w / 2, o.t + fq.t + fq.h / 2); await tick(700); }
  const fe = (await imFrame(() => ({ g: document.body.classList.contains("lk-gestalten"), k: !!document.querySelector(".lk-karte:not([hidden])") }))) || { g: true };
  fe.q = fq; fe.passt = await passt();
  const g1 = await imFrame(() => performance.getEntriesByType("resource").filter((r) => /_g\.webp/.test(r.name)).length);
  sage(!fe.g && !fe.k && g1 === g0, "„Fertig“ beendet das Gestalten; dabei wurde kein großes Bild geladen (nur die kleinen)", JSON.stringify({ fe, g0, g1 }));


  console.log("\nVOLLBILD UND ZURÜCK: WIEDER AM PLATZ\n");
  await menueRunter(); await tick(300);
  await tippe('[data-s="stadtvoll"]:not([data-mit])'); await tick(900);
  { const bereit = async () => (await pg.evaluate(() => document.querySelector(".sp-lstadt.sp-ls-voll") != null)) && (await imFrame(() => getComputedStyle(document.querySelector(".lk-kopf")).display !== "none" && !document.body.classList.contains("lk-mini-modus")));
    for (let i = 0; i < 20 && !(await bereit()); i++) await tick(150);
    for (let v = 0; v < 3 && await pg.evaluate(() => document.querySelector(".sp-lstadt.sp-ls-voll") != null); v++) { await tippeImFrame(".lk-kopf-links .lk-knopf"); await tick(700); } }
  if (process.env.STAPEL) for (let i = 0; i < 12; i++) { await tick(150); console.log("     " + JSON.stringify(await passt())); }
  await tick(1500);
  p = await passt();
  sage(imSpot(p, true), "nach dem Vollbild liegt das Bild wieder passgenau", JSON.stringify(p));
  const emo = await pg.evaluate(() => [".sp-dl-beschriftung", ".sp-dl-umbauleiste"].map((s) => [...document.querySelectorAll(".sp-schnell " + s)].map((e) => e.innerHTML).join("")).some((h) => /\p{Extended_Pictographic}/u.test(h)));
  sage(!emo, "keine Emoji-Grafiken in der Knopfreihe");

  } catch (e) { sage(false, "Sonde abgebrochen", String(e && e.message || e).split("\n")[0]); }
  sage(konsolenFehler.length === 0, "keine Skriptfehler", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
