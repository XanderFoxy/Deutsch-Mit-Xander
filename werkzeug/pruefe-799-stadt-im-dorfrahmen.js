#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 799: DIE NEUE STADT IM KLEINEN DORFRAHMEN
   ---------------------------------------------------------------------
   XANDER: „Ich möchte es in diesem Platz haben, wo die kleine Panorama
   an sich die alte noch ist, dass man darunter einen Schalter hat und
   dann neue Version wählen … man bleibt innerhalb dieses Frames … Nicht
   dass ich unten ein komplett neues Layer drüberlegt … durch einen Klick
   auf das Vollbild … und trotzdem noch zurückkommt".
   Geprüft auf einem Android-Telefon (360 px, echte Finger): der Schalter
   unter dem kleinen Bild, die Stadt genau im alten Rahmen (gleiche Größe,
   16:10), Neuzeichnen des Menüs lädt sie nicht neu, Lupe bleibt im
   Rahmen, Vollbild und zurück, „Alte Version" holt das alte Dorf zurück.
   ---------------------------------------------------------------------
   (Aufbau der Prüfumgebung aus der Sonde 709:)
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
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e) + (process.env.STAPEL ? " @ " + String(e.stack || "").split("\n").slice(1, 4).join(" | ") : "")));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} window.LEICHT_FREI = true; });
  /* FASSUNG 831 — die Uhr der Stadt ist die deutsche Ortszeit (Fassung 825). In der Dämmerung (Herbst ab ≈ 17 Uhr) und
     nachts lädt die Stadt zu den Tag- auch die Nachtbilder (sie blendet über) – die Grenze von 330 KB (Fassung 812:
     „am Tag 313 KB") galt aber für den Tag, und die Sonde war je nach Uhrzeit rot oder grün. Deshalb läuft die Uhr hier
     (in der Seite und im Rahmen) auf 12 Uhr deutscher Zeit versetzt weiter; UHR_ECHT=1 lässt die echte Uhr. */
  if (!process.env.UHR_ECHT) {
    const B = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hourCycle: "h23", hour: "2-digit", minute: "2-digit" });
    const jetzt = Date.now(); let off = 0;
    for (let h = -24; h <= 24; h++) { const t = jetzt + h * 3600000, [hh, mm] = B.format(new Date(t)).split(":").map(Number); if (hh === 12) { off = h * 3600000 - mm * 60000; break; } }
    await pg.addInitScript((off) => {
      const D = Date;
      class Versetzt extends D { constructor(...a) { if (a.length) super(...a); else super(D.now() + off); } static now() { return D.now() + off; } }
      window.Date = Versetzt;
    }, off);
  }
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

  console.log("\nDER SCHALTER UNTER DEM KLEINEN DORFBILD\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1200);
  const alt = await lage(".sp-dl-rahmen .sp-dl-fenster");
  sage(await pg.evaluate(() => document.querySelectorAll('[data-s="stadtversion"]').length === 2 && document.querySelector('[data-s="stadtversion"][data-v="alt"]').classList.contains("sp-an")),
    "zwei Knöpfe „Alte Version“ (an) und „Neue Version“ unter dem Bild");
  const seitenVorher = ctx.pages().length;
  await tippe('[data-s="stadtversion"][data-v="neu"]'); await tick(700);
  const platz = await lage(".sp-dl-neustadt-platz"), ueber = await lage(".sp-lstadt");
  sage(ctx.pages().length === seitenVorher, "kein neuer Tab");
  sage(!!platz && !!alt && Math.abs(platz.w - alt.w) < 1.5 && Math.abs(platz.h - alt.h) < 1.5 && Math.abs(platz.l - alt.l) < 1.5 && Math.abs(platz.h / platz.w - .625) < .02, "die neue Stadt sitzt genau im alten Rahmen (gleiche Größe, 16:10)", JSON.stringify({ alt, platz }));
  sage(!!ueber && nah(ueber, platz) && ueber.vis !== "hidden", "der Stadtrahmen liegt deckungsgleich darauf, nichts ragt heraus", JSON.stringify(ueber));
  sage(await pg.evaluate(() => /mini=1/.test((document.querySelector(".sp-lstadt iframe") || {}).src || "")), "die Stadt läuft im Kleinformat (mini=1)");
  let fr = null;
  for (let i = 0; i < 80 && !fr; i++) { await tick(250); const f = stadtFrame(); if (f && await f.evaluate(() => !!document.querySelector(".lk-lupe")).catch(() => false)) fr = f; }
  sage(!!fr, "die Stadt ist im Rahmen geladen");
  await tick(3000);
  let r = await imFrame(() => { const g = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { w: r.width, h: r.height, sicht: getComputedStyle(e).display !== "none" }; };
    const felder = [...document.querySelectorAll(".lk-mini-feld")].map((f) => f.getBoundingClientRect()).filter((q) => q.width > 0);
    return { mini: document.body.classList.contains("lk-mini-modus"), kopf: g(".lk-kopf"), bauen: g(".lk-bauen"), lupe: g(".lk-lupe"), voll: g(".lk-vollknopf"), feld: felder.length ? Math.min(...felder.map((q) => Math.min(q.width, q.height))) : 0, felder: felder.length }; });
  sage(!!r && r.mini && !r.kopf.sicht && !r.bauen.sicht, "im kleinen Rahmen nur das Bild: keine Kopfleiste, kein Bauen/Schmücken", JSON.stringify(r && { kopf: r.kopf, bauen: r.bauen }));
  sage(!!r && r.lupe.sicht && r.voll.sicht && r.lupe.w >= 24 && r.voll.w >= 30 && r.felder === 0, "Kompass (26 px, Tippfläche 34 px) und Vollbild (≥ 30 px); die kleine Karte erst mit der Lupe, wie beim alten Dorf", JSON.stringify(r && { lupe: r.lupe, voll: r.voll, felder: r.felder }));
  /* FASSUNG 817 — XANDER (Walkie 305): „genau die Buttons und genau die Funktionen sollen unter der neuen Version genauso
     stehen". Seitdem dieselbe Reihe wie unter dem alten Bild (Symbole, Namen, Umbauen …), dazu Vollbild, Schmücken, Bauen
     (im kleinen Rahmen, Funk 207) und „Ein Tipp produziert" (die Einzelheiten prüft pruefe-817-rahmen-bedienung.js). */
  sage(await pg.evaluate(() => { const b = [...document.querySelectorAll(".sp-dl-beschriftung button")].map((x) => x.dataset.s); return /^dorfanzeige,dorfanzeige,umbau,stadtversion,stadtversion,stadtvoll,stadtgestalten,stadtgestalten,lsdirekt(,appholen)?$/.test(b.join(",")); }), "darunter dieselbe Reihe wie beim alten Bild (Symbole, Namen, Umbauen, Alte/Neue Version) und Vollbild, Schmücken, Bauen, „Ein Tipp produziert“ (Fassung 817)", await pg.evaluate(() => [...document.querySelectorAll(".sp-dl-beschriftung button")].map((x) => x.dataset.s).join(",")));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-klein.png" });

  /* FASSUNG 806 — XANDER: „Jetzt fehlt in der kleinen Ansicht der neuen Version der Kompass … Danach muss wieder die
     Uhrzeit stehen. In der Mitte muss wieder mein Spitzname stehen" und „dass du die Labels … wieder einbaust". */
  console.log("\nKOMPASS, UHR, ORTSSCHILD UND NAMEN (Fassung 806)\n");
  await tick(1300);
  const kz = await imFrame(() => { const g = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, t: e.textContent.trim(), sicht: getComputedStyle(e).display !== "none" && r.width > 0 }; };
    const n = [...document.querySelectorAll(".lk-name-schild")].filter((e) => e.style.display !== "none").map((e) => e.textContent);
    return { kompass: !!document.querySelector(".lk-lupe svg .lk-nadel"), k: g(".lk-lupe"), uhr: g(".lk-uhr"), ort: g(".lk-ortsschild"), namen: n, W: innerWidth }; });
  sage(!!kz && kz.kompass && kz.k.x < 12 && kz.k.y < 12 && kz.k.w <= 28, "oben links der kleine Kompass (Kreis mit Nadel) statt der Lupe", JSON.stringify(kz && kz.k));
  sage(!!kz && kz.uhr.sicht && /^\d\d:\d\d$/.test(kz.uhr.t) && kz.uhr.x > kz.k.x + kz.k.w - 2, "daneben die Uhrzeit (Deutschland)", JSON.stringify(kz && kz.uhr));
  sage(!!kz && kz.ort.sicht && kz.ort.t === "Alex" && Math.abs(kz.ort.x + kz.ort.w / 2 - kz.W / 2) < 3, "in der Mitte das Ortsschild mit dem Namen", JSON.stringify(kz && kz.ort));
  sage(!!kz && kz.namen.length >= 5 && kz.namen.some((t) => /Bäckerei/.test(t)), "an den Häusern stehen ihre Namen", JSON.stringify(kz && kz.namen));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-kopf.png" });

  console.log("\nSCHLANK UND STILL (Fassung 805)\n");
  /* Gezählt wird, was über die Leitung geht: Bilder wie sie sind, Text (JSON, JS, CSS) gepackt – wie GitHub Pages es schickt. */
  const liste = await imFrame(() => performance.getEntriesByType("resource").map((r) => r.name));
  const last = liste && liste.reduce((a, u) => { const p = decodeURIComponent(new URL(u).pathname).replace(/^\//, ""), d = path.join(WURZEL, p);
    const roh = /^https?:\/\/(127\.0\.0\.1|localhost)/.test(u) && fs.existsSync(d) ? fs.readFileSync(d) : null;
    const kb = roh ? (/\.(webp|png|jpe?g)$/.test(p) ? roh.length : require("zlib").gzipSync(roh, { level: 9 }).length) / 1024 : 0;
    return { n: a.n + 1, kb: a.kb + kb, gross: a.gross + (/_(g|m)\.webp|l_geher|verzeichnis\.json/.test(u) ? 1 : 0) }; }, { n: 0, kb: 0, gross: 0 });
  if (process.env.LISTE && liste) console.log(liste.map((u) => { const p = decodeURIComponent(new URL(u).pathname).replace(/^\//, ""), d = path.join(WURZEL, p);
    const roh = fs.existsSync(d) && fs.statSync(d).isFile() ? fs.readFileSync(d) : null;
    return [roh ? Math.round((/\.(webp|png|jpe?g)$/.test(p) ? roh.length : require("zlib").gzipSync(roh, { level: 9 }).length) / 1024) : 0, p]; }).sort((x, y) => y[0] - x[0]).slice(0, 25).map((z) => z.join(" KB  ")).join("\n"));
  /* FASSUNG 812 — die 300 KB galten, als die Stadt kleiner war und die Probe nachts lief (dunkle Bilder sind kleiner).
     Mit Rathaus, Kolosseum, Bergwerk, Lok samt Wagen und Baustellen sind es am Tag 313 KB, nachdem die Zwerge ihren
     Transparenzkanal verlustbehaftet speichern (vorher 384 KB) und das kleine Verzeichnis die _k-Einträge hochrechnet.
     Die Grenze liegt deshalb bei 330 KB; große Bilder, Leute und das große Verzeichnis bleiben verboten. */
  /* FASSUNG 844 — die Grenze war schon vor 844 knapp überschritten (334 KB); 844 bringt das Ladebild (4 KB) und die neue
     Bedienung (langes Drücken, kleine Symbole, Stecknadel). Grenze jetzt 345 KB – große Bilder, Leute und das große
     Verzeichnis bleiben verboten. */
  sage(!!last && last.gross === 0 && last.kb < 345, "der kleine Rahmen lädt unter 345 KB: nur Zwergbilder und das kleine Verzeichnis (keine großen Bilder, keine Leute, kein großes Verzeichnis)", JSON.stringify(last && { dateien: last.n, kb: Math.round(last.kb), gross: last.gross }));
  const k0 = await imFrame(() => ({ x: window.STADT.kamera.x, y: window.STADT.kamera.y }));
  const scMess = () => pg.evaluate(() => { const e = document.querySelector(".sp-dl-neustadt-platz"); let p = e.parentElement; while (p && p !== document.body && !(p.scrollHeight > p.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(p).overflowY))) p = p.parentElement; return { menue: p && p !== document.body ? p.scrollTop : -1, seite: window.scrollY }; });
  const sc0 = await scMess();
  { const o = await lage(".sp-lstadt"); const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: o.l + o.w / 2, y: o.t + o.h * .7 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: o.l + o.w / 2 + i * 4, y: o.t + o.h * .7 - i * 14 }] }); await tick(16); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await tick(600); }
  const k1 = await imFrame(() => ({ x: window.STADT.kamera.x, y: window.STADT.kamera.y }));
  sage(k0 && k1 && Math.abs(k0.x - k1.x) < .01 && Math.abs(k0.y - k1.y) < .01, "Wischen über die kleine Stadt verschiebt sie nicht (das Bild steht still wie beim alten Dorf)", JSON.stringify({ k0, k1 }));
  /* FASSUNG 807 — XANDER: „kann man über den Bereich des Bildes scrollen und man kommt … unter das Bild … jetzt bewegt sich die komplette Webseite". */
  const sc1 = await scMess();
  sage(sc0.menue >= 0 && sc1.menue > sc0.menue + 40 && Math.abs(sc1.seite - sc0.seite) < 2, "Wischen über die kleine Stadt scrollt das Dorf-Menü darunter (nicht die ganze Seite)", JSON.stringify({ sc0, sc1 }));

  /* FASSUNG 809 — Walkie 304: „Das Scrollen ist sehr schwerfällig und hängt immer nach und schiebt sich zurück". Langsam
     wischen (ohne Schwung): das Menü folgt dem Finger 1 : 1, auch wenn der Rahmen dabei mitwandert. */
  { await pg.evaluate(() => { const e = document.querySelector(".sp-dl-neustadt-platz"); let p = e.parentElement; while (p && p !== document.body && !(p.scrollHeight > p.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(p).overflowY))) p = p.parentElement; if (p && p !== document.body) p.scrollTop = 0; }); await tick(300);
    const a = await scMess(), o = await lage(".sp-lstadt"), cdp = await ctx.newCDPSession(pg);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: o.l + o.w / 2, y: o.t + o.h * .8 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: o.l + o.w / 2, y: o.t + o.h * .8 - i * 10 }] }); await tick(40); }
    await tick(250); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await tick(400);
    const b = await scMess();
    sage(Math.abs((b.menue - a.menue) - 80) <= 12, "langsames Wischen um 80 px scrollt das Menü um 80 px (folgt dem Finger, hängt nicht nach)", JSON.stringify({ a, b, weg: b.menue - a.menue })); }

  console.log("\nNEUZEICHNEN DES MENÜS LÄDT DIE STADT NICHT NEU\n");
  await imFrame(() => { window.__marke = 42; });
  await pg.evaluate(() => { for (let i = 0; i < 4; i++) window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(600);
  sage((await imFrame(() => window.__marke)) === 42, "nach viermal Neuzeichnen ist es dieselbe Stadt (kein Neuladen)");
  sage(nah(await lage(".sp-lstadt"), await lage(".sp-dl-neustadt-platz")), "und sie liegt weiter genau im Rahmen");

  console.log("\nLUPE: NÄHER RAN, ABER IM RAHMEN\n");
  const s0 = await imFrame(() => window.STADT.kamera.s);
  if (process.env.STAPEL) console.log(await imFrame(() => { const e = document.querySelector(".lk-lupe"), r = e.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return (t && (t.className && t.className.baseVal != null ? t.className.baseVal : t.className)) + " / " + (t && t.tagName) + " " + JSON.stringify(r); }));
  if (process.env.STAPEL) { await imFrame(() => { window.__klicks = 0; document.addEventListener("click", (e) => { window.__klicks++; window.__ziel = String(e.target.className && e.target.className.baseVal != null ? "svg" : e.target.className); }, true); }); }
  await tippeImFrame(".lk-lupe"); await tick(900);
  if (process.env.STAPEL) console.log("klicks", await imFrame(() => [window.__klicks, window.__ziel, typeof window.STADT.leicht.fliegeZu]));
  const s1 = await imFrame(() => window.STADT.kamera.s);
  sage(s1 / s0 > 2.5 && s1 / s0 < 3.1, "der Kompass holt fast dreimal so nah heran (die ganze Stadt ist im Überblick kleiner)", (s1 / s0).toFixed(2) + (process.env.STAPEL ? " " + JSON.stringify(await imFrame(() => ({ s: window.STADT.kamera.s, min: window.STADT.kamera.min, W: window.STADT.kamera.W, an: document.querySelector(".lk-lupe").className }))) + " s0=" + s0 : ""));
  sage(nah(await lage(".sp-lstadt"), await lage(".sp-dl-neustadt-platz")), "der Rahmen bleibt dabei so klein wie vorher");
  const kf = await imFrame(() => { const f = [...document.querySelectorAll(".lk-mini-feld")].map((q) => q.getBoundingClientRect()).filter((q) => q.width > 0); return { n: f.length, min: f.length ? Math.min(...f.map((q) => Math.min(q.width, q.height))) : 0 }; });
  /* FASSUNG 805 — XANDER: „diese Kachel … muss nicht so ein großes Viereck sein … viel kleiner, weil man kann seinen
     Finger auch bisschen anstrengen". Die Karte ist 72 px, die Viertel also 24 px (bewusst unter den sonst üblichen 30 px). */
  /* FASSUNG 806 — XANDER: „Die kann halb so klein sein": 40 px, Viertel ≈ 13 px. */
  /* FASSUNG 817 — die kleine Karte hat die Form des Bildes (16:10): Viertel ≈ 25 × 16 px */
  sage(kf && kf.n === 9 && kf.min >= 15 && kf.min <= 20, "mit dem Kompass erscheint die kleine Karte am Rand: 9 Viertel à ≈ 25 × 16 px", JSON.stringify(kf));
  { const a0 = await imFrame(() => ({ x: window.STADT.kamera.x, y: window.STADT.kamera.y })); const o = await lage(".sp-lstadt"); const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: o.l + o.w / 2, y: o.t + o.h * .6 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: o.l + o.w / 2 - i * 6, y: o.t + o.h * .6 - i * 3 }] }); await tick(16); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await tick(400);
    const a1 = await imFrame(() => ({ x: window.STADT.kamera.x, y: window.STADT.kamera.y }));
    sage(a0 && a1 && Math.hypot(a0.x - a1.x, a0.y - a1.y) > 1, "mit dem Kompass (nah) verschiebt der Finger die Stadt", JSON.stringify({ a0, a1 })); }
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-lupe.png" });
  await tippeImFrame(".lk-mini-feld:nth-child(9)"); await tick(1100);
  const k9 = await imFrame(() => ({ x: window.STADT.kamera.x, y: window.STADT.kamera.y }));
  /* FASSUNG 817 — XANDER (Walkie 306): die Kachel unten rechts zeigt genau das untere rechte Neuntel des Überblicks */
  const t9 = await imFrame(() => window.STADT.oberflaeche.blickTeile ? window.STADT.oberflaeche.blickTeile() : null);
  sage(!!t9 && Math.abs(t9[0][0] - 2 / 3) < .02 && Math.abs(t9[0][1] - 2 / 3) < .02 && Math.abs(t9[1][0] - 1) < .02 && Math.abs(t9[1][1] - 1) < .02, "ein Tipp auf ein Viertel der kleinen Karte fährt dorthin (Fassung 817: genau das Neuntel unten rechts)", JSON.stringify({ k9, t9 }));

  console.log("\nHANDELN IM KLEINEN RAHMEN (Fassung 801): TIPP AUFS HAUS → KARTE MIT EINSAMMELN DARUNTER\n");
  sage((await imFrame(() => performance.getEntriesByType("resource").filter((r) => /_g\.webp/.test(r.name)).length)) === 0, "im kleinen Rahmen nur kleine Bilder (kein großes geladen)");
  await pg.evaluate(() => { const p = document.querySelector(".sp-dl-neustadt-platz"); if (p) p.scrollIntoView({ block: "center" }); }); await tick(200);
  await imFrame(() => { const K = window.STADT.kamera; window.STADT.leicht.fliegeZu(0, 4, K.s, 10); }); await tick(1200);
  const ziel = await imFrame(() => { const SZ = window.STADT.szene, K = window.STADT.kamera;
    /* FASSUNG 827 — Funk 248: Häuser, die etwas herstellen, zeigen die kleinen Symbole am Haus (Sonde 847); die Karte
       darunter öffnet ein Haus ohne Herstellung */
    const HERSTELLT = ["muehle", "baeckerei", "schmiede", "labor", "brauerei", "bergwerk"];
    for (const e of SZ.sichtbare.slice().reverse()) { if (e.o.art !== "haus" || !e.o.spiel || HERSTELLT.indexOf(e.o.spiel) >= 0) continue; const m = e.meta;
      for (let fy = .5; fy < .95; fy += .1) for (let fx = .3; fx < .75; fx += .1) { const px = e.X - m.ax * e.k + m.w * e.k * fx, py = e.Y - m.ay * e.k + m.h * e.k * fy;
        if (px < 50 * K.dpr || py < 50 * K.dpr || px > K.W - 110 * K.dpr || py > K.H - 10 * K.dpr) continue;
        if (SZ.treffer(px, py) === e.o) return { x: px / K.dpr, y: py / K.dpr, g: e.o.spiel }; } }
    return null; });
  if (ziel) { const off = await lage(".sp-lstadt"); await pg.touchscreen.tap(off.l + ziel.x, off.t + ziel.y); await tick(900); }
  const st = await pg.evaluate(() => { const e = document.querySelector(".sp-dl-rahmen ~ .sp-dl-station"); if (!e) return null; const p = document.querySelector(".sp-dl-neustadt-platz").getBoundingClientRect(), r = e.getBoundingClientRect();
    return { name: e.getAttribute("aria-label"), knoepfe: e.querySelectorAll("button").length, frei: r.top >= p.bottom - .5 }; });
  sage(!!st && st.frei, "die Karte liegt unter dem Stadtbild, nicht darunter versteckt", JSON.stringify(st));
  sage(!!ziel && !!st && st.knoepfe > 0, "Tipp auf ein Haus in der kleinen Stadt öffnet darunter die Karte des Spiels (mit Knöpfen wie Einsammeln)", JSON.stringify({ ziel, st }));
  /* FASSUNG 831 — nach dem Tipp rollt das Menü sanft zur Karte (lsStationZeigen: sanft, nach 0,7 s genau nach); der Rahmen
     folgt dem Platzhalter Bild für Bild. Beide wurden vorher nacheinander (in zwei Aufrufen) gemessen – mitten im Rollen
     lagen sie dann bis 96 px auseinander, ohne dass der Rahmen danebenlag. Jetzt beide im selben Augenblick, und bis 4 s
     gewartet, bis das Rollen vorbei ist (zweimal hintereinander dieselbe Lage); ein echter Versatz bleibt rot. */
  const beide = () => pg.evaluate(() => { const g = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height, vis: getComputedStyle(e).visibility }; }; return { ls: g(".sp-lstadt"), platz: g(".sp-dl-neustadt-platz") }; });
  let imR = await beide();
  for (let i = 0, vor = null; i < 20; i++) { if (vor && nah(imR.ls, imR.platz) && nah(vor.platz, imR.platz)) break; vor = imR; await tick(200); imR = await beide(); }
  imR.marke = await imFrame(() => window.__marke);
  sage(nah(imR.ls, imR.platz) && imR.marke === 42, "die Stadt bleibt dabei im Rahmen und lädt nicht neu", JSON.stringify(imR));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-haus.png" });

  /* FASSUNG 806 — XANDER: „dass die Sachen verlinkt sind, dass ich schon in der Map jetzt schon einsammeln kann". */
  console.log("\nVERLINKT: SPIELSTAND UND EINSAMMELN IN DER KARTE (Fassung 806)\n");
  const haeuser = await imFrame(() => window.STADT.szene.objekte.filter((o) => o.art === "haus").map((o) => o.spiel).sort().join(","));
  const soll = await pg.evaluate(() => { const d = window.DMA_SPIEL.pruef.zustand().ich.dorf || {}; return Object.keys(d).filter((k) => d[k] && d[k].stufe > 0).sort().join(","); });
  sage(!!haeuser && haeuser === soll, "die neue Stadt zeigt genau die Gebäude des Spielstands (vom Spiel geschickt, nicht die Beispielstadt)", JSON.stringify({ haeuser, soll }));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; S.ich.dorf = Object.assign({}, S.ich.dorf, { gasthaus: { stufe: 1, lp: 20 } }); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(1600);
  sage(await imFrame(() => window.STADT.szene.objekte.some((o) => o.art === "haus" && o.spiel === "gasthaus")) && (await imFrame(() => window.__marke)) === 42, "was im Spiel neu gebaut wird (Gasthaus), steht gleich auch in der Stadt – ohne Neuladen");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(), vor = new Date(Date.now() - 60000).toISOString();
    S.ich.werk = { baeckerei: { ware: "brot", menge: 4, start: vor, fertig: new Date(Date.now() - 1000).toISOString() }, schule: { ware: "kuchen", menge: 2, start: vor, fertig: new Date(Date.now() + 130000).toISOString() } };
    window.__abgeholt = [];
    window.__extra = Object.assign(window.__extra || {}, { spiel_werk_abholen: (a, ich) => { window.__abgeholt.push(a.p_gebaeude); return Object.assign({ ok: true, menge: 4, ware: "brot" }, ich); } });
    window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await imFrame(() => { const o = window.STADT.szene.objekte.find((x) => x.spiel === "baeckerei"); window.STADT.leicht.fliegeZu(o.x, o.y, window.STADT.kamera.s, 10); });
  await tick(1600);
  const zb = await imFrame(() => { const b = document.querySelector('.lk-zeichen[data-g="baeckerei"]'); if (!b) return null; const r = b.getBoundingClientRect();
    const s = document.querySelector('.lk-zeichen[data-g="schule"]');
    return { t: b.textContent, titel: b.title, kl: b.className, x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height, sicht: getComputedStyle(b).display !== "none", schule: s ? s.textContent : null }; });
  sage(!!zb && zb.sicht && (/4 Brot/.test(zb.t) || (/×4/.test(zb.t) && /4 Brot/.test(zb.titel)))  && /lk-z-fertig/.test(zb.kl) && zb.h >= 30, "über der Bäckerei steht „4 Brot“ (Fassung 809: Brot-Bild ×4, Titel „4 Brot“; ≥ 30 px hoch)", JSON.stringify(zb));
  sage(!!zb && /^Kuchen [12]:\d\d$/.test(zb.schule || ""), "über der Schule läuft die Uhr („… 2:10“)", JSON.stringify(zb && zb.schule));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-zeichen.png" });
  if (process.env.STAPEL && zb) console.log("ZIEL", await imFrame((p) => { const e = document.elementFromPoint(p.x, p.y); return e && (e.className + "/" + e.tagName); }, zb));
  /* FASSUNG 817 — der Tipp aufs Haus rollt das Menü zur Karte darunter: vorher das Bild wieder ganz ins Blickfeld */
  await pg.evaluate(() => { const p = document.querySelector(".sp-dl-neustadt-platz"); if (p) p.scrollIntoView({ block: "center" }); }); await tick(400);
  if (zb) { const off = await lage(".sp-lstadt"); await pg.touchscreen.tap(off.l + zb.x, off.t + zb.y); await tick(1200); }
  const nach = await pg.evaluate(() => ({ ab: window.__abgeholt, wahl: window.DMA_SPIEL.pruef.zustand().dorfWahl }));
  sage(nach.ab.join() === "baeckerei" && nach.wahl !== "baeckerei", "ein Tipp auf „4 Brot“ sammelt direkt ein (spiel_werk_abholen), ohne erst die Station zu öffnen", JSON.stringify(nach));

  console.log("\nVOLLBILD UND ZURÜCK\n");
  await tippe('[data-s="stadtvoll"]'); await tick(700);
  let v = await lage(".sp-lstadt");
  sage(!!v && v.l === 0 && v.t === 0 && Math.abs(v.w - 360) < 1 && Math.abs(v.h - 740) < 1, "„Vollbild“: die Stadt füllt den Bildschirm", JSON.stringify(v));
  r = await imFrame(() => ({ mini: document.body.classList.contains("lk-mini-modus"), kopf: getComputedStyle(document.querySelector(".lk-kopf")).display }));
  sage(!!r && !r.mini && r.kopf !== "none", "im Vollbild ist die ganze Bedienung da (Kopfleiste, Bauen …)", JSON.stringify(r));
  await tick(1500);
  const vg = await imFrame(() => ({ gross: performance.getEntriesByType("resource").filter((r) => /_g\.webp/.test(r.name)).length, max: window.STADT.kamera.max, tab: !!document.querySelector(".lk-neuer-tab") }));
  sage(!!vg && vg.gross === 0 && vg.max <= 29 && vg.tab, "auch das Vollbild bleibt schlank (keine großen Bilder, Nähe begrenzt) und bietet „In neuem Tab öffnen“", JSON.stringify(vg));
  await pg.setViewportSize({ width: 740, height: 360 }); await tick(500);
  v = await lage(".sp-lstadt");
  sage(!!v && Math.abs(v.w - 740) < 1 && Math.abs(v.h - 360) < 1, "quer gedreht: weiter bildschirmfüllend", JSON.stringify(v));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-voll.png" });
  await pg.setViewportSize({ width: 360, height: 740 }); await tick(500);
  await tippeImFrame(".lk-kopf-links .lk-knopf");
  { const t0 = Date.now(); await tick(300); while (Date.now() - t0 < 2500 && !nah(await lage(".sp-lstadt"), await lage(".sp-dl-neustadt-platz"))) await tick(100); console.log("     (zurück im Rahmen nach " + (Date.now() - t0) + " ms)"); }
  sage(nah(await lage(".sp-lstadt"), await lage(".sp-dl-neustadt-platz")) && (await imFrame(() => document.body.classList.contains("lk-mini-modus"))) === true && (await imFrame(() => window.__marke)) === 42,
    "„Zurück“ in der Stadt: wieder klein im Dorfrahmen, dieselbe Stadt");

  console.log("\nALTE VERSION\n");
  await tippe('[data-s="stadtversion"][data-v="alt"]'); await tick(700);
  sage(!(await lage(".sp-lstadt")) && !!(await lage(".sp-dl-rahmen canvas.sp-dl-mal")), "„Alte Version“: das alte Dorfbild ist zurück, die neue Stadt weg", JSON.stringify({ ls: await lage(".sp-lstadt"), mal: await lage(".sp-dl-rahmen canvas.sp-dl-mal"), knopf: await pg.evaluate(() => [...document.querySelectorAll('[data-s="stadtversion"]')].map((b) => b.className).join("|")) }));

  sage(konsolenFehler.length === 0, "keine Skriptfehler", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
