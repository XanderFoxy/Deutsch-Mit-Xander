#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 683: MAKROKNOPF, DORF-ANSICHT, VOLK, PLÜNDERN,
   EIER, MELKEN, AXT, ANGEL, ERHOLEN, ★★★
   ---------------------------------------------------------------------
   XANDER (25.09. nachts): „Mein Dorf hätte ich gern zusätzlich … in dem
   Shortcut Menü unten … dass der letzte wie ein Makroknopf ist … diese
   kleinen Zahlen, die Gesundheitspunkte … Krankenhaus … die Gebäude
   angreifen … Ritter … angeln … Bäume fällen … Eier einsammeln … Kuh
   melken … Silizium und Computerchips … Laser Waffen verbessern".
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


  const meld = () => pg.evaluate(() => window.__hinweise.filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "");


  const zuletzt = () => pg.evaluate(() => window.__hinweise.slice(-1)[0] || "");
  await pg.evaluate(() => {
    const ich = window.__ich, jetzt = Date.now();
    ich.level = 10; ich.punkte = 500; ich.mana = 60;
    ich.dorf = { baeckerei: { stufe: 1, lp: 20 }, huehnerstall: { stufe: 1, lp: 20, stand: new Date(jetzt - 2 * 900000 - 5000).toISOString() },
                 kuhstall: { stufe: 1, lp: 20, stand: new Date(jetzt - 1300000).toISOString() }, krankenhaus: { stufe: 1, lp: 0 },
                 schmiede: { stufe: 1, lp: 20 }, labor: { stufe: 1, lp: 20 } };
    ich.werk = { baeckerei: { ware: "brot", menge: 3, fertig: new Date(jetzt + 300000).toISOString() } };
    ich.dorf_ab = new Date(jetzt - 5 * 3600000).toISOString();
    ich.volk = { arbeiter: 12, ritter: 1, quote: 90 };
    ich.vorraete = Object.assign({}, ich.vorraete, { mehl: 6, ei: 2, milch: 1, fisch: 2, quarz: 4, holz: 3, silizium: 1, gold: 1, chip: 2 });
    ich.waffen_stufe = { lasersalve: 2 };
    const bea = window.DMA_SPIEL.pruef.zustand().stand["11111111-1111-4111-8111-111111111111"];
    bea.dorf = { baeckerei: { stufe: 1, lp: 20 }, schule: { stufe: 1, lp: 20 }, muehle: { stufe: 1, lp: 20, gepl: new Date(jetzt - 60000).toISOString() } };
    bea.ritter = 2;
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_markt_preise: () => ({ ok: true, preise: {} }),
      spiel_angebote_liste: () => ({ ok: true, angebote: [] }),
      spiel_pluendern: (a) => { ich.mana -= 10; ich.vorraete = Object.assign({}, ich.vorraete, { brot: (ich.vorraete.brot || 0) + 2 }); return Object.assign({}, ich, { ok: true, gebaeude: a.p_gebaeude, an: "Bea", beute: { brot: 2 }, mana: 0, punkte_beute: 0, anteil: 25, schaden: 10 }); },
      spiel_ritter: (a) => { ich.volk = Object.assign({}, ich.volk, { ritter: ich.volk.ritter + a.p_menge }); ich.punkte -= 40; return Object.assign({}, ich, { ok: true, ritter: ich.volk.ritter, preis: 40 }); },
      spiel_melken: () => { ich.vorraete = Object.assign({}, ich.vorraete, { milch: ich.vorraete.milch + 1 }); ich.dorf.kuhstall.stand = new Date().toISOString(); return Object.assign({}, ich, { ok: true, menge: 1 }); },
      spiel_ei_sammeln: () => { ich.vorraete = Object.assign({}, ich.vorraete, { ei: ich.vorraete.ei + 1 }); ich.dorf.huehnerstall.stand = new Date(Date.parse(ich.dorf.huehnerstall.stand) + 900000).toISOString(); return Object.assign({}, ich, { ok: true, menge: 1, rest: 0 }); },
      spiel_holzen: (a) => { ich.vorraete = Object.assign({}, ich.vorraete, { holz: ich.vorraete.holz + 2 }); ich.acker = Object.assign({}, ich.acker, { ["w" + a.p_platz]: { ab: new Date().toISOString() } }); return Object.assign({}, ich, { ok: true, menge: 2, nest: false }); },
      spiel_angeln: () => { ich.vorraete = Object.assign({}, ich.vorraete, { fisch: ich.vorraete.fisch + 1 }); return Object.assign({}, ich, { ok: true, fang: "fisch", menge: 1 }); }
    });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, ich); S.schnellMenue = false; S.graben = false;
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  await tick(400);

  console.log("\nMAKROKNOPF: DAS DORF MIT EINEM TIPP\n");
  const mk = await pg.evaluate(() => { const r = document.querySelector(".sp-schnell .sp-s-reihe"), m = r && r.querySelector('[data-s="makro"]'), z = r && r.querySelector('[data-s="zauberrad"]');
    const rr = r.getBoundingClientRect(), mr = m ? m.getBoundingClientRect() : null;
    return { da: Boolean(m), nachZauber: Boolean(m && z && (z.compareDocumentPosition(m) & 4)), bild: Boolean(m && m.querySelector("svg")), titel: m ? m.title : "",
      imBild: mr ? mr.right <= innerWidth && mr.left >= 0 : false, quer: r.scrollWidth - r.clientWidth, letzter: (() => { const l = r.lastElementChild.getBoundingClientRect(); return Math.round(l.right - rr.right); })(), hoch: Math.round(rr.height) }; });
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-leiste.png" });
  sage(mk.da && mk.nachZauber && mk.bild && /Mein Dorf/.test(mk.titel), "hinter dem Zauberstab: der Makroknopf mit dem Dorf-Bild", JSON.stringify(mk));
  sage(mk.imBild && mk.hoch <= 50 && mk.quer <= 1, "alle Knöpfe passen in die Leiste (360 px, nichts abgeschnitten), einzeilig", JSON.stringify(mk));
  await tippe('.sp-schnell [data-s="makro"]');
  await tick(400);
  const blick = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue");
    return { blick: Boolean(m && m.classList.contains("sp-sm-blick")), reiter: Boolean(m && m.querySelector(".sp-sm-reiter")), kopf: m ? m.querySelector(".sp-sm-kopf").textContent : "",
      haeuser: m ? m.querySelectorAll(".sp-dorfszene .sp-ds-haus").length : 0, laeuft: m ? (m.querySelector(".sp-ds-laeuft") || {}).textContent || "" : "",
      kaputt: Boolean(m && m.querySelector(".sp-ds-kaputt")), eier: m ? (m.querySelector(".sp-ds-fertig") || {}).textContent || "" : "",
      quer: m ? m.scrollWidth - m.clientWidth : -1, rechts: m ? Math.round(m.getBoundingClientRect().right) : 0 }; });
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-dorf.png" });
  sage(blick.blick && !blick.reiter && /Mein Dorf/.test(blick.kopf), "Tipp: nur das Dorf – keine Reiter, oben „Mein Dorf“ mit Punkten", JSON.stringify(blick));
  sage(blick.haeuser === 6 && /^\d+:\d\d$/.test(blick.laeuft) && blick.kaputt && /Eier/.test(blick.eier), "die Dorf-Szene zeigt jedes Gebäude und was dort gerade passiert (Uhr, fertig, kaputt)", JSON.stringify(blick));
  sage(blick.quer <= 1 && blick.rechts <= 360, "die Dorf-Ansicht passt in die Breite", JSON.stringify(blick));
  const volk = await pg.evaluate(() => { const v = document.querySelector(".sp-schnellmenue .sp-volk"); return v ? v.textContent : ""; });
  sage(/\d+ % zufrieden/.test(volk) && /12 Arbeiter/.test(volk) && /1 Ritter/.test(volk) && /Deutsch-Quote 90 %/.test(volk), "Volk: Zufriedenheit, Arbeiter, Ritter, Deutsch-Quote", volk);

  console.log("\nRITTER, MELKEN, WERKSTÄTTEN\n");
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippe('.sp-schnellmenue [data-s="ritter"][data-n="1"]');
  await tick(400);
  const rit = await pg.evaluate(() => ({ ruf: window.__rufe.filter((r) => r.name === "spiel_ritter").map((r) => r.args.p_menge), meld: window.__hinweise.slice(-1)[0] || "", ton: window.DMA_TONLOG.some((t) => t.name === "marschtrommel") }));
  sage(rit.ruf[0] === 1 && /Ritter/.test(rit.meld) && rit.ton, "„Ritter +“ wirbt einen Ritter an (Trommel)", JSON.stringify(rit));
  await tippe('.sp-schnellmenue [data-s="melken"]');
  await tick(400);
  const melk = await pg.evaluate(() => ({ ruf: window.__rufe.some((r) => r.name === "spiel_melken"), meld: window.__hinweise.slice(-1)[0] || "" }));
  sage(melk.ruf && /Milch gemolken/.test(melk.meld), "Kuhstall: „Melken“ holt die Milch", JSON.stringify(melk));
  const werk = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); const t = (sel) => [...m.querySelectorAll(sel)].map((b) => b.textContent.trim());
    return { torte: t('[data-s="liefern"][data-w="torte"]'), si: t('[data-s="liefern"][data-w="silizium"]'), chip: t('[data-s="liefern"][data-w="chip"]'), abholen: t('[data-s="abholen"]') }; });
  sage(werk.torte.length === 0 && werk.si.length === 1 && werk.chip.length === 1 && werk.abholen.length === 1, "Bäckerei läuft (nur Abholen), Schmiede: Silizium, Labor: Chips", JSON.stringify(werk));
  const torte = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); const ich = Object.assign({}, S.ich, { werk: {} }); const d = document.createElement("div"); d.innerHTML = window.DMA_SPIEL.pruef.werkHtml(ich);
    const b = d.querySelector('[data-s="liefern"][data-w="torte"]'); return b ? { text: b.textContent, n: b.dataset.n, zu: b.disabled } : null; });
  sage(torte && torte.n === "1" && !torte.zu, "Bäckerei frei: „Torte“ (2 Mehl, 2 Eier, 1 Milch) – mit 2 Eiern und 1 Milch geht 1 Stück", JSON.stringify(torte));

  console.log("\nPLÜNDERN: GEBÄUDE BLEIBT, BEUTE GEHT MIT\n");
  const nach = await pg.evaluate(() => { const n = [...document.querySelectorAll(".sp-schnellmenue .sp-nachbar")].map((x) => ({ name: x.querySelector("b").textContent, knoepfe: [...x.querySelectorAll('[data-s="pluendern"]')].map((b) => b.dataset.g + (b.disabled ? "-zu" : "")) })); return n; });
  sage(nach.length === 1 && nach[0].name === "Bea" && nach[0].knoepfe.join(",") === "baeckerei,muehle-zu", "Nachbardorf von Bea: Bäckerei plünderbar, Mühle 4 h geschützt, Schule gar nicht", JSON.stringify(nach));
  await pg.evaluate(() => { window.__rufe.length = 0; window.__raus.length = 0; window.DMA_TONLOG.length = 0; });
  await tippe('.sp-schnellmenue [data-s="pluendern"][data-g="baeckerei"]');
  await tick(900);
  const pl = await pg.evaluate(() => ({ ruf: window.__rufe.filter((r) => r.name === "spiel_pluendern").map((r) => r.args), meld: window.__hinweise.filter((h) => /⚔️/.test(h)).slice(-1)[0] || "",
    raus: window.__raus.filter((r) => r.ereignis === "gepluendert").map((r) => r.zielChat + ":" + r.gebaeude), toene: window.DMA_TONLOG.map((t) => t.name),
    bild: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-pluender')) }));
  sage(pl.ruf.length === 1 && pl.ruf[0].p_ziel === "11111111-1111-4111-8111-111111111111" && pl.ruf[0].p_gebaeude === "baeckerei", "Tipp auf Beas Bäckerei: Server-Ruf spiel_pluendern", JSON.stringify(pl.ruf));
  sage(/geplündert: 2 Brot/.test(pl.meld) && /bleibt stehen/.test(pl.meld) && pl.toene.indexOf("hammerschlag") >= 0 && pl.toene.indexOf("kasse") >= 0, "Meldung mit Beute, Gebäude bleibt stehen; Schlag und Kasse", JSON.stringify(pl));
  sage(pl.raus[0] === "bea:baeckerei" && pl.bild, "Bea bekommt Bescheid; über ihrem Bild wackelt die Bäckerei", JSON.stringify(pl));
  await pg.evaluate(() => { window.__hinweise.length = 0; window.DMA_SPIEL.empfangen({ ereignis: "gepluendert", von: "bea", zielChat: "ich", gebaeude: "schmiede", beute: { erz: 1 }, name: "Bea" }); });
  await tick(200);
  const opfer = await zuletzt();
  sage(/Bea hat deine Schmiede geplündert \(1 Erz\)/.test(opfer) && /reparieren/.test(opfer), "wird MEIN Gebäude geplündert: Meldung mit Verlust und Reparatur-Hinweis", opfer);

  console.log("\nMAKROKNOPF SELBST BELEGEN\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);
  const wahl = await pg.evaluate(() => [...document.querySelectorAll('.sp-schnellmenue [data-s="makrowahl"]')].map((b) => b.textContent + (b.classList.contains("sp-an") ? "*" : "")));
  sage(wahl.length === 6 && wahl[0] === "Mein Dorf*", "Menü → Mehr → „Letzter Knopf“: Dorf, Markt, Werkzeug, Deutsch, Tiere, Heilen", wahl.join(","));
  await tippe('.sp-schnellmenue [data-s="makrowahl"][data-m="handel"]');
  await tick(300);
  const hb = await pg.evaluate(() => { let m = ""; try { m = localStorage.getItem("dma_spiel_makro"); } catch (e) {} const k = document.querySelector('.sp-schnell [data-s="makro"]'); return { merk: m, titel: k ? k.title : "" }; });
  sage(hb.merk === "handel" && /Markt/.test(hb.titel), "gewählt: Markt & Handel liegt jetzt auf dem Knopf (gemerkt)", JSON.stringify(hb));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; S.makro = "dorf"; try { localStorage.setItem("dma_spiel_makro", "dorf"); } catch (e) {} window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  console.log("\nEIER AUF DEM FELD\n");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.eierPflegen(); });
  await tick(300);
  const eier = await pg.evaluate(() => { const e = [...document.querySelectorAll("#lcPlaetze .sp-ei-feld")]; return { zahl: e.length, frei: e.every((x) => !x.closest(".lc-platz").dataset.lcId) }; });
  sage(eier.zahl === 2 && eier.frei, "der Hühnerstall hat 2 Eier gelegt – sie liegen auf freien Plätzen", JSON.stringify(eier));
  await pg.evaluate(() => { window.__rufe.length = 0; const e = document.querySelector("#lcPlaetze .sp-ei-feld"); e.closest(".lc-platz").scrollIntoView({ block: "nearest" }); });
  await tick(450);
  await tippe("#lcPlaetze .sp-ei-feld");
  await tick(700);
  const ei = await pg.evaluate(() => ({ ruf: window.__rufe.some((r) => r.name === "spiel_ei_sammeln"), meld: window.__hinweise.slice(-1)[0] || "", rest: document.querySelectorAll("#lcPlaetze .sp-ei-feld").length, gesetzt: window.__rufe.some((r) => r.name === "spiel_platzwechsel") }));
  sage(ei.ruf && /\+1 Ei/.test(ei.meld) && ei.rest === 1 && !ei.gesetzt, "Tipp aufs Ei: eingesammelt (kein Hinsetzen), eins bleibt liegen", JSON.stringify(ei));

  console.log("\nAXT UND ANGEL\n");
  const frei = await pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .lc-platz")].filter((q) => !q.dataset.lcId && !q.querySelector(".sp-ei-feld")).map((q) => Number(q.dataset.lcPlatz)));
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.werkzeugSetzen("axt"); });
  await tick(900);
  const wald = await pg.evaluate(() => ({ wald: document.querySelectorAll("#lcPlaetze .sp-acker-wald").length, plaetze: document.querySelectorAll("#lcPlaetze .lc-platz").length, uhr: (document.querySelector("#lcPlaetze .sp-acker-wald .sp-acker-uhr") || {}).textContent }));
  sage(wald.wald >= wald.plaetze - 1 && wald.uhr === "+2", "Axt in der Hand: auf jedem Platz steht ein Baum („+2“)", JSON.stringify(wald));
  const tippePlatz = async (nr) => { await pg.evaluate((n) => { const q = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + n + '"]'); q.scrollIntoView({ block: "nearest" }); }, nr); await tick(450);
    const m = await pg.evaluate((n) => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + n + '"] .lc-kreis').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, nr);
    await pg.touchscreen.tap(m.x, m.y); };
  await pg.evaluate(() => { window.__rufe.length = 0; window.DMA_TONLOG.length = 0; });
  await tippePlatz(frei[0]);
  await tick(1000);
  const hz = await pg.evaluate((n) => ({ ruf: window.__rufe.filter((r) => r.name === "spiel_holzen").map((r) => r.args.p_platz), ton: window.DMA_TONLOG.some((t) => t.name === "axttreffer"), meld: window.__hinweise.slice(-1)[0] || "",
    stumpf: (document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + n + '"] .sp-acker-wald') || {}).className || "" }), frei[0]);
  sage(hz.ruf[0] === frei[0] && hz.ton && /\+2 Holz/.test(hz.meld) && /waechst/.test(hz.stumpf), "Tipp auf den Baum: Axt schlägt (Ton), +2 Holz, der Baum wächst nach", JSON.stringify(hz));
  const wwahl = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.wwahl = true; window.DMA_SPIEL.pruef.schnellZeichnen(true);
    const w = [...document.querySelectorAll('.sp-werkzeugwahl [data-s="werkzeugsetzen"]')].map((b) => b.dataset.w).join(","); S.wwahl = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); return w; });
  sage(wwahl === "schaufel,sense,saat,duenger,axt,angel", "die Werkzeugwahl hat jetzt auch Axt und Angel", wwahl);
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.werkzeugSetzen("angel"); });
  await tick(900);
  const teich = await pg.evaluate(() => ({ teich: document.querySelectorAll("#lcPlaetze .sp-acker-teich").length, uhrWeg: [...document.querySelectorAll("#lcPlaetze .sp-acker-teich .sp-acker-uhr")].every((u) => getComputedStyle(u).display === "none") }));
  sage(teich.teich >= wald.plaetze - 1 && teich.uhrWeg, "Angel in der Hand: auf jedem Platz ein Teich (ohne Uhr)", JSON.stringify(teich));
  await pg.evaluate(() => { window.__rufe.length = 0; window.DMA_TONLOG.length = 0; window.__t0 = performance.now(); });
  await tippePlatz(frei[1]);
  await tick(2400);
  const an = await pg.evaluate(() => { const t = (n) => { const x = window.DMA_TONLOG.find((e) => e.name === n); return x ? Math.round(x.wann - window.__t0) : -1; };
    return { ruf: window.__rufe.some((r) => r.name === "spiel_angeln"), swoosh: t("swoosh"), platsch: t("platsch"), kurbel: t("angelkurbel"), meld: window.__hinweise.slice(-1)[0] || "" }; });
  sage(an.ruf && /Fisch/.test(an.meld), "Tipp auf den Teich: auswerfen, warten, Fisch!", JSON.stringify(an));
  sage(an.swoosh >= 0 && an.platsch > an.swoosh && an.kurbel > an.platsch + 800, "Ton passt zum Bild: Wurf, Platsch der Pose, dann die Kurbel beim Einholen", JSON.stringify(an));
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippePlatz(frei[1]);
  await tick(300);
  const nochmal = await pg.evaluate(() => ({ ruf: window.__rufe.some((r) => r.name === "spiel_angeln"), meld: window.__hinweise.slice(-1)[0] || "" }));
  sage(!nochmal.ruf && /noch im Wasser/.test(nochmal.meld), "gleich nochmal: die Angel ist noch im Wasser (kein Server-Ruf)", JSON.stringify(nochmal));
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.grabenUmschalten(false); });

  console.log("\nERHOLEN: KLEINE GRÜNE ZAHLEN\n");
  await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand(), beaId = "11111111-1111-4111-8111-111111111111";
    S.stand[beaId] = Object.assign({}, S.stand[beaId], { lp: 50 });
    const bea2 = Object.assign({}, S.stand[beaId], { lp: 53, dorf: Object.assign({}, S.stand[beaId].dorf, { krankenhaus: { stufe: 1, lp: 20 } }) });
    window.__extra.spiel_stand = () => [Object.assign({}, window.__ich), bea2];
    window.DMA_SPIEL.pruef.abrufen(true);
  });
  await tick(500);
  const erh = await pg.evaluate(() => { const z = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-zahl-erholt'); return { text: z ? z.textContent : "", leuchtet: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"].sp-erholt')) }; });
  sage(erh.text === "+3 Krankenhaus" && erh.leuchtet, "Bea erholt sich (+3, sie hat ein Krankenhaus): grüne Zahl und Leuchten am Bild", JSON.stringify(erh));
  await pg.evaluate(() => { delete window.__extra.spiel_stand; });

  console.log("\n★★★ UND ESSEN\n");
  const st3 = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, window.__ich); const h = window.DMA_SPIEL.pruef.menueInhalt("waffen"); const d = document.createElement("div"); d.innerHTML = h;
    const b = d.querySelector('[data-tu="veredeln"][data-d="lasersalve"]'); return b ? { text: b.textContent, zu: b.disabled } : null; });
  sage(st3 && /★★★/.test(st3.text) && /2 Chips/.test(st3.text) && !st3.zu, "Lasersalve ★★ + Labor + 2 Chips: „Verstärken ★★★ · 100 P + 2 Chips“ ist frei", JSON.stringify(st3));
  const iss = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "heilen"; window.DMA_SPIEL.pruef.schnellZeichnen(true);
    const r = [...document.querySelectorAll('.sp-schnellmenue [data-s="iss"]')].map((b) => b.dataset.d); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); return r; });
  sage(iss.indexOf("fisch") >= 0, "Heilen-Menü: „Fisch essen“", iss.join(","));

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.join(" | "));
  console.log("\nFassung 683 auf dem Telefon: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
