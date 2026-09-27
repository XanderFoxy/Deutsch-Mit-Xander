#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 772: FUNK 198 (UND 190)
   ---------------------------------------------------------------------
   XANDER: „man kriegt dort offenbar nur drei Punkte auf Stufe C2 außerdem
   wird immer noch nicht diese kreisrunde Prozentanzeige angezeigt … dass
   wir das Wort automatisch vorgelesen bekommen und direkt nachsprechen
   können und direkt bewertet bekommen dann soll uns bei einer sehr guten
   Bewertung der Vorschlag gemacht werden ob wir … diese Aussprache … in
   unser persönliches Aussprache Wörterbuch übernehmen wollen … dass das
   Wort sauber ausgeschnitten ist und auch entrauscht".
   (Die Punkte prüft der Server-Test in SPIELSYSTEM.md, Fassung 772.)
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

  const klick = (sel) => pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);

  /* Eine echte Aufnahme nachbauen: 0,5 s Rauschen, 0,6 s Ton (das „Wort“), 0,4 s Rauschen. */
  await pg.evaluate(() => {
    const sr = 16000, n = Math.round(sr * 1.5), d = new Float32Array(n);
    let z = 7; const rnd = () => { z = (z * 16807) % 2147483647; return z / 2147483647 - 0.5; };
    for (let i = 0; i < n; i++) { const t = i / sr; d[i] = rnd() * 0.01 + (t >= 0.5 && t < 1.1 ? 0.5 * Math.sin(2 * Math.PI * 220 * t) * Math.min(1, (t - 0.5) * 40, (1.1 - t) * 40) : 0); }
    window.__eigenPuffer = { numberOfChannels: 1, sampleRate: sr, length: n, duration: n / sr, getChannelData: () => d };
    const puffer = { length: 8000, sampleRate: 16000, duration: 0.5, numberOfChannels: 1, getChannelData: () => new Float32Array(8000) };
    window.DMA_AUSSPR_BRUECKE = { original: () => Promise.resolve({ puffer: puffer, art: "azure" }) };
    window.__aufnahmen = 0; window.__note = 97;
    window.AusspracheP = Object.assign({}, window.AusspracheP || {}, {
      mikrofonDa: () => true,
      aufnahmeStarten: (o) => { window.__aufnahmen++; setTimeout(o.beiStille, 300); return Promise.resolve({ stoppen: () => Promise.resolve({ blob: new Blob(["x"]) }) }); },
      tonLesen: () => Promise.resolve(window.__eigenPuffer), stufe1Da: () => true,
      stufe1Bewerten: () => Promise.resolve({ quelle: "azure", prozent: window.__note, woerter: [{ wort: "Schule", laute: [{ laut: "ʃ", note: 96 }, { laut: "uː", note: 99 }, { laut: "l", note: 97 }, { laut: "ə", note: 94 }] }] }),
      lautKlartext: (l) => "Dein " + l.laut + " war gut."
    });
    /* Konto und Wörterbuch-Server nachbauen */
    window.__woerterbuch = []; window.__eigenRufe = [];
    const kl = { rpc: (name, args) => {
      window.__eigenRufe.push({ name, args });
      let data = null;
      if (name === "aussprache_eigen_speichern") { window.__woerterbuch = window.__woerterbuch.filter((e) => e.wort.toLowerCase() !== args.p_wort.toLowerCase()); window.__woerterbuch.push({ id: window.__woerterbuch.length + 1, wort: args.p_wort, prozent: args.p_prozent, audio: args.p_audio, dauer: args.p_dauer }); data = { ok: true, wort: args.p_wort, anzahl: window.__woerterbuch.length }; }
      else if (name === "aussprache_eigen_liste") data = window.__woerterbuch.map((e) => ({ id: e.id, wort: e.wort, prozent: e.prozent, dauer: e.dauer }));
      else if (name === "aussprache_eigen_ton") { const e = window.__woerterbuch.find((x) => x.wort.toLowerCase() === String(args.p_wort).toLowerCase()); data = e ? { ok: true, audio: e.audio } : { ok: false }; }
      else if (name === "aussprache_eigen_loeschen") { window.__woerterbuch = window.__woerterbuch.filter((x) => x.id !== args.p_id); data = { ok: true }; }
      return Promise.resolve({ data, error: null });
    } };
    Backend.zugang = () => kl; Backend.currentUser = () => ({ id: "00000000-0000-4000-8000-000000000000", email: "t@t" });
    window.__abgespielt = 0; const altPlay = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__abgespielt++; return Promise.resolve(); };
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_aussprache_wort: (a) => ({ ok: true, wort: "Schule", silben: "SCHU-le", niveau: a.p_niveau }),
      spiel_aussprache_fertig: (a, ich) => { window.__fertig = a; return Object.assign({}, ich, { ok: true, gewonnen: 12 }); }
    });
    try { localStorage.setItem("dma_spiel_sprech_auto", "1"); localStorage.setItem("dma_spiel_niveau", "C2"); } catch (e) {}
    const S = window.DMA_SPIEL.pruef.zustand(); S.niveau = "C2"; S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true);
    S.deutschWahl = true; window.DMA_SPIEL.menue("deutsch");
  });
  await tick(500);

  console.log("\nAUTOMATISCH: VORSPRECHEN, ZUHÖREN, BEWERTEN\n");
  await klick('#spPanel [data-tu="kategorie"][data-k="aussprache"]');
  await pg.waitForFunction(() => document.querySelector("#spPanel .sp-sprech-kreisel"), { timeout: 8000 }).catch(() => {});
  let r = await pg.evaluate(() => ({ aufnahmen: window.__aufnahmen, fertig: window.__fertig, ring: (document.querySelector("#spPanel .sp-sprech-kreisel .kreisel") || { getAttribute: () => "" }).getAttribute("aria-label"),
    balken: !!document.querySelector("#spPanel .sp-sprech-balken"), auto: (document.querySelector('#spPanel [data-tu="sprechauto"]') || {}).textContent || "" }));
  sage(r.aufnahmen === 1 && r.fertig && r.fertig.p_prozent === 97, "ohne Tippen: das Wort wird vorgesprochen, das Mikrofon hört zu, die Bewertung kommt", JSON.stringify({ a: r.aufnahmen, f: r.fertig }));
  sage(/^97 Prozent/.test(r.ring) && !r.balken, "die Note steht im runden Kreisel wie im Aussprachetrainer", r.ring);
  sage(/an$/.test(r.auto), "Schalter „Automatisch vorsprechen und zuhören: an“ ist in der Karte", r.auto);
  const text = await pg.evaluate(() => document.querySelector("#spPanel .sp-erg-platz").textContent);
  sage(/\+12 Punkte/.test(text), "C2 mit 97 % zeigt +12 Punkte (Server)", text.slice(0, 80));
  if (process.env.BILD) await (await pg.$("#spPanel .sp-sprech")).screenshot({ path: process.env.BILD + "-karte.png" });

  console.log("\nPERSÖNLICHES AUSSPRACHE-WÖRTERBUCH\n");
  r = await pg.evaluate(() => { const b = document.querySelector('#spPanel [data-eigen="uebernehmen"]'); return b ? b.textContent : ""; });
  sage(/In mein Aussprache-Wörterbuch/.test(r), "ab 95 % kommt das Angebot „In mein Aussprache-Wörterbuch übernehmen“", r);
  await tippe('#spPanel [data-eigen="uebernehmen"]');
  await pg.waitForFunction(() => window.__woerterbuch.length === 1, { timeout: 6000 }).catch(() => {});
  r = await pg.evaluate(() => { const e = window.__woerterbuch[0] || {}; return { wort: e.wort, prozent: e.prozent, wav: /^data:audio\/wav;base64,/.test(e.audio || ""), dauer: e.dauer, laenge: (e.audio || "").length }; });
  sage(r.wort === "Schule" && r.prozent === 97 && r.wav, "gespeichert: „Schule“, 97 %, als WAV", JSON.stringify(r));
  sage(r.dauer >= 700 && r.dauer <= 950, "sauber geschnitten: aus 1,5 s Aufnahme bleibt das Wort (0,6 s) plus etwas Luft", r.dauer + " ms");
  const schnitt = await pg.evaluate(() => { const s = window.DMA_EIGENE_AUSSPRACHE.schneiden(window.__eigenPuffer); let rausch = 0; for (let i = 0; i < 400; i++) rausch = Math.max(rausch, Math.abs(s.daten[i])); return { vorn: s.vorn, hinten: s.hinten, rand: Math.round(rausch * 1000) / 1000 }; });
  sage(schnitt.vorn >= 350 && schnitt.hinten >= 200 && schnitt.rand < 0.05, "Atempause vorn und Stille hinten fallen weg, der Rand ist leise (entrauscht, eingeblendet)", JSON.stringify(schnitt));
  const leer = await pg.evaluate(() => { const n = 16000, d = new Float32Array(n); for (let i = 0; i < n; i++) d[i] = (Math.random() - 0.5) * 0.004; return window.DMA_EIGENE_AUSSPRACHE.schneiden({ numberOfChannels: 1, sampleRate: 16000, length: n, getChannelData: () => d }); });
  sage(leer === null, "reine Stille wird nicht gespeichert", String(leer));
  await tick(600);
  r = await pg.evaluate(() => ({ meine: !!document.querySelector('#spPanel [data-eigen="hoeren"]'), angebot: !!document.querySelector('#spPanel [data-eigen="uebernehmen"]') }));
  sage(r.meine && !r.angebot, "danach: „Meine Stimme“ in der Karte, das Angebot ist weg", JSON.stringify(r));
  await tippe('#spPanel [data-eigen="hoeren"]'); await tick(400);
  r = await pg.evaluate(() => ({ ton: window.__eigenRufe.some((x) => x.name === "aussprache_eigen_ton"), gespielt: window.__abgespielt }));
  sage(r.ton && r.gespielt >= 1, "„Meine Stimme“ spielt die eigene Aufnahme", JSON.stringify(r));
  if (process.env.BILD) await (await pg.$("#spPanel .sp-sprech")).screenshot({ path: process.env.BILD + "-meine.png" });

  console.log("\nSCHWÄCHER ALS 95 %: KEIN ANGEBOT; AUTOMATIK ABSCHALTBAR\n");
  await pg.evaluate(() => { window.__note = 88; });
  await tippe('#spPanel [data-tu="sprechneu"]');
  await pg.waitForFunction(() => window.__aufnahmen >= 2 && document.querySelector("#spPanel .sp-sprech-kreisel"), { timeout: 8000 }).catch(() => {});
  r = await pg.evaluate(() => ({ aufn: window.__aufnahmen, angebot: !!document.querySelector('#spPanel [data-eigen="uebernehmen"]') }));
  sage(r.aufn === 2 && !r.angebot, "88 %: bewertet, aber kein Wörterbuch-Angebot", JSON.stringify(r));
  await tippe('#spPanel [data-tu="sprechauto"]');
  await tippe('#spPanel [data-tu="sprechneu"]'); await tick(1500);
  r = await pg.evaluate(() => ({ aufn: window.__aufnahmen, gemerkt: localStorage.getItem("dma_spiel_sprech_auto"), text: (document.querySelector('#spPanel [data-tu="sprechauto"]') || {}).textContent }));
  sage(r.aufn === 2 && r.gemerkt === "0" && /aus$/.test(r.text), "Automatik aus: das neue Wort wartet auf „Nachsprechen“", JSON.stringify(r));
  const klein = await pg.evaluate(() => [...document.querySelectorAll("#spPanel .sp-sprech button")].filter((b) => { const q = b.getBoundingClientRect(); return q.width && q.height < 29; }).map((b) => b.textContent));
  sage(!klein.length, "alle Knöpfe der Karte mindestens 30 px hoch", klein.join(" | "));

  console.log("\nDIE LISTE (PRIVATER BEREICH)\n");
  r = await pg.evaluate(() => { const h = window.DMA_EIGENE_AUSSPRACHE.listeHtml(window.DMA_EIGENE_AUSSPRACHE.liste); const d = document.createElement("div"); d.innerHTML = h; return { zeilen: d.querySelectorAll(".eigen-zeile").length, hoeren: d.querySelectorAll('[data-eigen="hoeren"]').length, weg: d.querySelectorAll('[data-eigen="weg"]').length }; });
  sage(r.zeilen === 1 && r.hoeren === 1 && r.weg === 1, "Liste: jedes Wort mit „Anhören“ und „Löschen“", JSON.stringify(r));

  console.log("\nAUSSPRACHETRAINER DER SEITE\n");
  await pg.evaluate(() => { document.querySelectorAll(".sp-panel").forEach((x) => { x.hidden = true; }); const pille = document.querySelector('[data-sub="sub-aussprache"]'); const v = pille && pille.closest(".view"); if (v && typeof activateTab === "function") activateTab(v.id); if (pille) pille.click(); });
  await pg.waitForFunction(() => document.querySelector("#eigenBereich .eigen-zeile"), { timeout: 8000 }).catch(() => {});
  r = await pg.evaluate(() => { const d = document.getElementById("eigenBereich"); return { da: !!d, titel: d ? d.querySelector("summary").textContent : "", zeilen: d ? d.querySelectorAll(".eigen-zeile").length : 0 }; });
  sage(r.da && /\(1\)/.test(r.titel) && r.zeilen === 1, "im Aussprachetrainer: „Mein Aussprache-Wörterbuch (1)“ mit dem gespeicherten Wort", JSON.stringify(r));
  if (process.env.BILD && r.da) { await pg.evaluate(() => { const d = document.getElementById("eigenBereich"); d.open = true; d.scrollIntoView({ block: "center" }); }); await tick(300); await pg.screenshot({ path: process.env.BILD + "-trainer.png", timeout: 8000 }).catch(() => {}); }

  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 772 (Funk 198): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
