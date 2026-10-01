#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 829 (Arbeitsnummer 850): NACH DEM GROSSEN MENÜ STEHT
   DAS KLASSENZIMMER WIEDER AN SEINEM PLATZ
   ---------------------------------------------------------------------
   XANDER (Funk 256, wörtlich): „Wenn man in ein größeres Menü geht bei
   einer Aufgabe die man erfüllen soll bzw wenn man produzieren möchte man
   geht das größere Menü dann schiebt sich der Chat im Hintergrund bzw das
   Klassenzimmer nach oben und wenn man das erledigt hat und eingestellt
   hat dann springt es nicht wieder zurück an den Platz".
   Aufbau wie Sonde 817 (Android 360 × 740, Spiel mit nachgebautem Server).
   Geprüft:
     - die Knöpfe im Dorf rollen nur das Menü, nie die Seite oder einen
       Behälter des Klassenzimmers (kein scrollIntoView mehr im Dorf)
     - Station öffnen → Aufgabe: die Seite steht danach wieder dort, wo
       sie nach dem Öffnen des Dorfs stand; die Behälter darüber unverändert
     - auch wenn die Seite unterwegs verrutscht ist, kommt sie nach der
       Aufgabe zurück (soweit das Bild der Stadt ganz zu sehen bleibt)
     - Dorf schließen → die Seite steht genau wie vor dem Öffnen
   Mit dem Stand vor 829 ist das rot.
   Aufruf: node werkzeug/pruefe-850-platz-nach-menue.js
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
  console.log("\nFUNK 256: SEITE UND KLASSENZIMMER BLEIBEN AN IHREM PLATZ\n");
  const lageSeite = () => pg.evaluate(() => { const b = []; let e = document.getElementById("lcForm"); for (e = e && e.parentNode; e && e !== document.body && e !== document.documentElement; e = e.parentNode) b.push(Math.round(e.scrollTop)); const k = document.getElementById("livechatKarte") || document.getElementById("livechatArea"); return { y: Math.round(scrollY), karte: k ? Math.round(k.getBoundingClientRect().top) : null, b: b.join(",") }; });
  const tippeHier = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };
  /* Die Seite steht so, dass die Leiste weit oben ist – das Dorf-Menü darüber ragt oben hinaus (wie in Sonde 817). */
  { const l = await lage(".sp-schnell"); await pg.evaluate((d) => window.scrollBy(0, d), l.t - 250); await tick(400); }
  const vor = await lageSeite();
  await tippeHier('.sp-schnell [data-s="makro"]'); await tick(900);
  await menueRunter(); await tick(300);
  await tippe('[data-s="stadtversion"][data-v="neu"]'); await tick(900);
  let fr = null;
  for (let i = 0; i < 80 && !fr; i++) { const f = stadtFrame(); if (f && await f.evaluate(() => !!document.querySelector(".lk-lupe") && !!window.STADT.oberflaeche.ueberblick).catch(() => false)) fr = f; else await tick(250); }
  sage(!!fr, "die neue Stadt ist im Rahmen geladen");
  await tick(1500);
  await menueHoch(); await tick(600);
  const offen = await lageSeite();
  const sj = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
  const dorfTeil = sj.slice(sj.indexOf("function schnellKlick"), sj.indexOf("function schnellKlick") + 120000);
  sage(!/sp-dl-station"\); if \(st\) st\.scrollIntoView|sp-dl-rahmen"\); if \(dr\) dr\.scrollIntoView|sp-dorf-auf"\); if \(z\) z\.scrollIntoView/.test(sj) && /function menueZeigen/.test(sj),
    "im Dorf rollen die Knöpfe nur das Menü (menueZeigen statt scrollIntoView)");

  /* 1) Station öffnen, Aufgabe erledigen */
  let spS = null;
  for (let i = 0; i < 4 && !spS; i++) { spS = await tippeHaus("schule"); if (!spS) await tick(1000); }
  await tick(1700);
  const station = await lageSeite();
  await tippeHier(".sp-dl-neustadt ~ .sp-dl-station .sp-dl-st-knoepfe button:not([disabled])"); await tick(1800);
  const nach = await lageSeite();
  sage(!!spS && Math.abs(nach.y - offen.y) <= 2 && nach.b === offen.b, "Station → Aufgabe: die Seite steht wieder wie nach dem Öffnen, kein Behälter verrutscht", JSON.stringify({ vor, offen, station, nach }));

  /* 2) die Seite verrutscht, während die Station offen ist (z. B. durch das Telefon) – nach der Aufgabe kommt sie zurück */
  await tippeHaus("schule"); await tick(1700);
  await pg.evaluate(() => window.scrollBy(0, -90)); await tick(400);
  const verrutscht = await lageSeite();
  await tippeHier(".sp-dl-neustadt ~ .sp-dl-station .sp-dl-st-knoepfe button:not([disabled])"); await tick(1800);
  const zurueck = await lageSeite();
  const p2 = await passt();
  sage(Math.abs(zurueck.y - offen.y) <= 2 && imSpot(p2, true), "verrutscht → nach der Aufgabe wieder an seinem Platz, das Bild der Stadt ganz zu sehen", JSON.stringify({ offen, verrutscht, zurueck, p2 }));

  /* 3) Dorf schließen → genau wie vor dem Öffnen */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(1200);
  const zu = await lageSeite();
  sage(Math.abs(zu.y - vor.y) <= 2 && zu.b === vor.b, "Dorf zu: Seite und Klassenzimmer stehen genau wie vor dem Öffnen", JSON.stringify({ vor, zu }));
  } catch (e) { sage(false, "Sonde abgebrochen", String(e && e.message || e).split("\n")[0]); }
  sage(konsolenFehler.length === 0, "keine Skriptfehler", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
