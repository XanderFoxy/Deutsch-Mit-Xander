#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 682: SCHÄTZE, LEISTE, DEUTSCH-LAYOUT, HANDEL,
   SPASSWAFFEN, CHAT-MAUER, TIERE IM CHAT
   ---------------------------------------------------------------------
   XANDER (25.09. nachts): „ich hab 116 Punkte. Ich sammle jetzt ein
   Schatz ein … immer noch 116 … die Tab Suchleiste … wird plötzlich
   groß … ein Sternsymbol was da blinkt … die eigentliche Aufgabe oben
   … links Mission holen und rechts neue Aufgabe … der Handel den sehe
   ich noch nicht … mit allen anderen Funktionen bis zum Schluss".
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

  console.log("\nFUNDSTÜCK: SOFORT PUNKTE, LEISTE BLEIBT KLEIN\n");
  await pg.evaluate(() => {
    const ich = window.__ich; ich.punkte = 116;
    window.__extra = {
      spiel_fund_heben: (a) => { ich.punkte += 3; return Object.assign({}, ich, { ok: true, fund: "erz", sofort: 3 }); },
      spiel_markt_preise: () => ({ ok: true, preise: { getreide: { preis: 0.74, nachfrage: 1, laune: 0.88, beliebt: 0.84 }, mehl: { preis: 2.6 }, brot: { preis: 5.2 }, kuchen: { preis: 12 }, duenger: { preis: 3.5 } } }),
      spiel_angebote_liste: () => ({ ok: true, angebote: window.__angebote || [] }),
      spiel_schenken: (a) => { ich.vorraete = Object.assign({}, ich.vorraete, { [a.p_ware]: (ich.vorraete[a.p_ware] || 0) - a.p_menge }); return Object.assign({}, ich, { ok: true, ware: a.p_ware, menge: a.p_menge, an: "Bea" }); },
      spiel_angebot: (a) => { window.__angebote = [{ id: 7, ware: a.p_ware, menge: a.p_menge, preis: a.p_preis, von: "Alex", eigen: true }]; return Object.assign({}, ich, { ok: true, ware: a.p_ware, menge: a.p_menge, preis: a.p_preis }); },
      spiel_angebot_kaufen: (a) => ({ ...ich, ok: true, ware: "duenger", menge: 3, kosten: 6, von: "Bea" }),
      spiel_duenger_kaufen: () => { ich.punkte -= 8; ich.vorraete = Object.assign({}, ich.vorraete, { duenger: (ich.vorraete.duenger || 0) + 1 }); return Object.assign({}, ich, { ok: true, menge: 1, preis: 8 }); },
      spiel_zeigen: (a) => { ich.zeigen = { level: a.p_level, tiere: a.p_tiere, schutz: a.p_schutz }; return Object.assign({}, ich, { ok: true }); }
    };
    ich.vorraete = Object.assign({}, ich.vorraete, { getreide: 12, duenger: 0 });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, ich); S.fundNaechst = 0; window.__hinweise.length = 0;
  });
  await tick(1600);
  const leiste = await pg.evaluate(() => { const b = document.querySelector('.sp-schnell [data-s="fund"]'), r = document.querySelector(".sp-schnell .sp-s-reihe");
    return { da: Boolean(b), svgBreit: b ? Math.round(b.querySelector("svg").getBoundingClientRect().width) : 0, reiheHoch: r ? Math.round(r.getBoundingClientRect().height) : 0, knopfHoch: b ? Math.round(b.getBoundingClientRect().height) : 0 }; });
  sage(leiste.da && leiste.svgBreit <= 26 && leiste.reiheHoch <= 50, "Fundstück in der Leiste: kleines Säckchen, die Leiste bleibt klein (kein riesiger Stern)", JSON.stringify(leiste));
  await pg.evaluate(() => { const f = document.querySelector("#lcPlaetze .sp-fundsack"); f.closest(".lc-platz").scrollIntoView({ block: "nearest" }); });
  await tick(400);
  await tippe("#lcPlaetze .sp-fundsack");
  await tick(500);
  const fund = await pg.evaluate(() => ({ punkte: window.DMA_SPIEL.pruef.zustand().ich.punkte, meld: window.__hinweise.join(" | ") }));
  sage(fund.punkte === 119 && /\+3 Punkte sofort/.test(fund.meld) && /\+5 Punkte dazu/.test(fund.meld), "Säckchen aufheben: 116 → 119 Punkte sofort, Meldung nennt +5 nach der Aufgabe", JSON.stringify(fund));

  console.log("\nDEUTSCH: AUFGABE OBEN, MISSION | NEUE AUFGABE, WAHL EINGEKLAPPT\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.kategorie = null; S.aufgabe = { id: 5, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"], niveau: "A1" }; S.deutschWahl = false; window.DMA_SPIEL.menue("deutsch"); });
  await tick(300);
  const d1 = await pg.evaluate(() => { const inh = document.querySelector("#spPanel .sp-inhalt"), auf = inh.querySelector(".sp-aufgabe"), kn = inh.querySelector(".sp-deutsch-knoepfe"), wahl = inh.querySelector(".sp-deutsch-wahl");
    return { aufgabeErst: Boolean(auf && inh.firstElementChild === auf), knoepfe: kn ? [...kn.querySelectorAll("button")].map((b) => b.textContent.trim()) : [], knoepfeInAufgabe: Boolean(kn && auf && auf.contains(kn)),
      wahlZu: wahl ? getComputedStyle(wahl).display === "none" : false, tippe: /Tippe die richtige Antwort/.test(inh.textContent) }; });
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-deutsch.png" });
  sage(d1.aufgabeErst && d1.knoepfeInAufgabe && !d1.tippe, "die Aufgabe steht ganz oben; wo „Tippe die richtige Antwort“ stand, stehen jetzt Knöpfe", JSON.stringify(d1));
  sage(/Mission holen/.test(d1.knoepfe[0] || "") && /Neue Aufgabe/.test(d1.knoepfe[1] || "") && d1.wahlZu, "links „Mission holen“, rechts „Neue Aufgabe“; Niveau und Arten eingeklappt", JSON.stringify(d1));
  await tippe('#spPanel [data-tu="neuwahl"]');
  await tick(300);
  const d2 = await pg.evaluate(() => { const w = document.querySelector("#spPanel .sp-deutsch-wahl"); return { offen: w && getComputedStyle(w).display !== "none", niveau: w ? w.querySelectorAll('[data-tu="niveau"]').length : 0, arten: w ? w.querySelectorAll('[data-tu="kategorie"]').length : 0 }; });
  sage(d2.offen && d2.niveau === 6 && d2.arten >= 4, "„Neue Aufgabe“ klappt Niveau und Arten auf", JSON.stringify(d2));
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippe('#spPanel .sp-deutsch-wahl [data-tu="kategorie"][data-k="artikel"]');
  await tick(700);
  const d3 = await pg.evaluate(() => { const w = document.querySelector("#spPanel .sp-deutsch-wahl"); return { zu: w && getComputedStyle(w).display === "none", ruf: window.__rufe.some((r) => r.name === "spiel_aufgabe"), wahl: window.DMA_SPIEL.pruef.zustand().deutschWahl }; });
  sage(d3.zu && d3.ruf && !d3.wahl, "eine Wahl lädt die Aufgabe und klappt wieder zu (springt nach oben)", JSON.stringify(d3));
  const skill = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.skill_frei = 0; S.ich.level = 14; window.DMA_SPIEL.menue("deutsch"); return document.querySelector("#spPanel .sp-status").textContent; });
  sage(/Skillpunkte: alle 13 verteilt/.test(skill), "0 freie Skillpunkte: „Skillpunkte: alle 13 verteilt“ statt nichts", skill.slice(0, 120));
  await pg.evaluate(() => { document.getElementById("spPanel").hidden = true; });

  console.log("\nHANDEL IM DORF\n");
  await pg.evaluate(() => { const Q = window.DMA_SPIEL.pruef, S = Q.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; Q.schnellZeichnen(true); document.querySelector('.sp-schnellmenue [data-s="dorf"]').click(); });
  await tick(600);
  if (process.env.BILD) { await pg.evaluate(() => document.querySelector(".sp-schnellmenue .sp-handel").scrollIntoView({ block: "start" })); await pg.screenshot({ path: process.env.BILD + "-handel.png" }); }
  const h1 = await pg.evaluate(() => { const h = document.querySelector(".sp-schnellmenue .sp-handel"); return { da: Boolean(h), text: h ? h.textContent : "", getreideKnopf: (document.querySelector('.sp-schnellmenue [data-s="markt"][data-w="getreide"]') || {}).textContent || "" }; });
  sage(h1.da && /Nachfrage ×1/.test(h1.text) && /Beliebtheit ×0,84/.test(h1.text) && /weniger Kundschaft/.test(h1.text), "Handel: Tagespreis mit Nachfrage, Laune und Beliebtheit (wer viel angreift, hat weniger Kundschaft)", h1.text.slice(0, 200));
  sage(/12 × 0,74 = \+9/.test(h1.getreideKnopf), "Markt verkauft zum Tagespreis (12 × 0,74 = +9)", h1.getreideKnopf);
  await pg.evaluate(() => { window.__rufe.length = 0; const f = document.querySelector('.sp-schnellmenue [data-s="schenken"]'); f.scrollIntoView({ block: "center" });
    const s = f.parentElement.querySelectorAll("select"); s[0].value = "getreide"; s[0].dispatchEvent(new Event("change", { bubbles: true })); s[1].value = "5"; s[1].dispatchEvent(new Event("change", { bubbles: true })); });
  await tippe('.sp-schnellmenue [data-s="schenken"]');
  await tick(300);
  const h2 = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_schenken") || {}).args, raus: window.__raus.filter((m) => m.ereignis === "geschenk_ware").length }));
  sage(h2.ruf && h2.ruf.p_ware === "getreide" && h2.ruf.p_menge === 5 && h2.ruf.p_ziel === "11111111-1111-4111-8111-111111111111" && h2.raus >= 1, "Schenken: 5 Getreide an Bea (Server-Ruf + Nachricht an Bea)", JSON.stringify(h2));
  await pg.evaluate(() => { window.__rufe.length = 0; document.querySelector('.sp-schnellmenue [data-s="anbieten"]').scrollIntoView({ block: "center" }); });
  await tippe('.sp-schnellmenue [data-s="anbieten"]');
  await tick(600);
  const h3 = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_angebot") || {}).args, eigen: Boolean(document.querySelector('.sp-schnellmenue [data-s="angebotweg"][data-id="7"]')) }));
  sage(h3.ruf && h3.ruf.p_preis === 2 && h3.eigen, "Eigenes Angebot (je 2 P) steht in der Liste, mit „Zurückziehen“", JSON.stringify(h3));
  await pg.evaluate(() => { window.__angebote = [{ id: 9, ware: "duenger", menge: 3, preis: 2, von: "Bea", eigen: false }]; window.DMA_SPIEL.pruef.handelLaden(true); });
  await tick(500);
  const h4 = await pg.evaluate(() => ({ knopf: (document.querySelector('.sp-schnellmenue [data-s="angebotkauf"][data-id="9"]') || {}).textContent || "", zeile: ((document.querySelector('.sp-schnellmenue [data-s="angebotkauf"][data-id="9"]') || {}).parentElement || {}).textContent || "" }));
  sage(/Kaufen · 6/.test(h4.knopf) && /billiger als beim Händler/.test(h4.zeile), "Bea bietet Dünger billiger an als der Händler – „Kaufen · 6“", JSON.stringify(h4));
  await pg.evaluate(() => { document.querySelector('.sp-schnellmenue [data-s="werkzeugsetzen"][data-w="duenger"]').click(); });
  await tick(300);
  const h5 = await pg.evaluate(() => ({ wz: window.DMA_SPIEL.pruef.zustand().werkzeug, leiste: Boolean(document.querySelector(".sp-schnell .sp-s-graben.sp-wz-duenger")) }));
  sage(h5.wz === "duenger" && h5.leiste, "„Düngen“ nimmt den Düngersack als Werkzeug", JSON.stringify(h5));
  await pg.evaluate(() => { const Q = window.DMA_SPIEL.pruef; Q.grabenUmschalten(false); const S = Q.zustand(); S.schnellMenue = false; Q.schnellZeichnen(true); });

  console.log("\nSPASSWAFFEN IM CHAT (ohne Mitspielen)\n");
  await pg.evaluate(() => { const Q = window.DMA_SPIEL.pruef, S = Q.zustand(); S.ich.mitspielen = false; S.stand[S.ich.id] = Object.assign({}, S.stand[S.ich.id], { mitspielen: false }); S.chatWaffe = true; S.waffe = "bazooka"; S.ich.waffen = S.ich.waffen.concat(["bazooka"]); window.__raus.length = 0; });
  await tick(900);
  const vorher = await pg.evaluate(() => window.LiveChat.lage().plaetze.find((p) => p.id === "ich").nummer);
  await pg.evaluate(() => document.querySelector('#lcPlaetze .lc-platz[data-lc-id="cem"]').scrollIntoView({ block: "nearest" }));
  await tick(300);
  const cem = await seite("cem");
  await pg.touchscreen.tap(cem.x, cem.y);
  await tick(250);
  const c1 = await pg.evaluate(() => { const g = document.querySelector(".sp-chatwaffe"); return { gross: g ? Math.round(g.getBoundingClientRect().width) : 0, raus: window.__raus.filter((m) => m.ereignis === "chatwaffe").map((m) => m.waffe + ">" + m.zielChat) }; });
  await tick(1500);
  const c2 = await pg.evaluate(() => ({ weg: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="cem"] .lc-kreis.sp-chat-weg')), platz: window.LiveChat.lage().plaetze.find((p) => p.id === "ich").nummer }));
  sage(c1.raus.join() === "bazooka>cem" && c1.gross >= 80, "Tipp auf Cem: die Bazooka erscheint groß am eigenen Bild, der Schuss geht an alle", JSON.stringify(c1));
  sage(c2.weg && c2.platz === vorher, "Cem verschwindet kurz – kein Platztausch", JSON.stringify(c2));
  await tick(1600);
  const angek = await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "chatwaffe", von: "cem", zielChat: "bea", waffe: "zwille" }); return true; });
  await tick(400);
  sage(await pg.evaluate(() => Boolean(document.querySelector(".sp-chatwaffe"))), "auch wer nicht mitspielt, sieht einen fremden Spaßschuss (Nachricht „chatwaffe“)");
  await tick(2000);

  console.log("\nCHAT-MAUER UND TIERE IM CHAT\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.stand["11111111-1111-4111-8111-111111111111"] = Object.assign({}, S.stand["11111111-1111-4111-8111-111111111111"], { zeigen: { schutz: true, tiere: true } }); });
  const m1 = await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'); const ab = window.DMA_SPIEL.chatEffekt(pl, "lc-ohrfeige"); const lieb = window.DMA_SPIEL.chatEffekt(pl, "lc-streichel");
    return { ab, lieb, mauer: Boolean(pl.querySelector(".sp-chatmauer")) }; });
  sage(m1.ab === true && m1.mauer && m1.lieb === false, "Bea hat die Chat-Mauer: die Ohrfeige prallt an der Mauer ab, Streicheln kommt durch", JSON.stringify(m1));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.stand["11111111-1111-4111-8111-111111111111"].zeigen = { tiere: true }; S.ich.mitspielen = true; S.stand[S.ich.id] = Object.assign({}, S.stand[S.ich.id], { mitspielen: true }); window.DMA_SPIEL.pruef.zeichnen(); window.DMA_TONLOG.length = 0; });
  await tick(900);
  const t1 = await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-sahne"); return new Promise((ok) => { const w = { leckt: false }; const u = setInterval(() => { if (pl.querySelector(".sp-tier-leckt")) w.leckt = true; }, 80);
    /* Fassung 695: erst wird geschnuppert, bis die Sahne fertig ist (2,9 s), dann geleckt. */
    setTimeout(() => { clearInterval(u); ok({ leckt: w.leckt, herz: pl.querySelectorAll(".sp-tier-herz").length, ton: window.DMA_TONLOG.map((t) => t.name) }); }, 3900); }); });
  sage(t1.leckt && t1.herz >= 1 && t1.ton.includes("lecken"), "Sprühsahne auf Bea: ihr Tier leckt sie ab (Herzchen, „lecken“)", JSON.stringify(t1));
  const t2 = await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'); pl.dataset.tierZeit = 0; window.DMA_TONLOG.length = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-streichel"); return new Promise((ok) => setTimeout(() => ok({ kuschelt: Boolean(pl.querySelector(".sp-tier-kuschelt")), ton: window.DMA_TONLOG.map((t) => t.name) }), 700)); });
  /* FASSUNG 690 — Funk 137: „beim Streicheln hechelt das Fellmonster wie ein Hund, der Babydrache macht ein süßes ‚mmmh'". */
  sage(t2.kuschelt && (t2.ton.includes("stimme:mmh") || t2.ton.includes("stimme:hecheln")), "Streicheln: das Tier kuschelt und hechelt bzw. macht „mmmh“", JSON.stringify(t2));
  const hk = await pg.evaluate(() => /DMA_SPIEL\.chatEffekt\(platz, klasse\)/.test(document.documentElement.outerHTML) || true);
  const appHaken = require("fs").readFileSync(require("path").join(__dirname, "..", "app.js"), "utf8").includes("window.DMA_SPIEL.chatEffekt(platz, klasse, lcEffektVon)");
  sage(appHaken, "app.js fragt bei jedem Profil-Effekt das Spiel (lcAmPlatz)");

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 682: " + fehler + " rot." : "Fassung 682 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
