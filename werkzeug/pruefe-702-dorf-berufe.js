#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 702: DORF – BERUFE, AUTOMATIK, HUNGER, FUHRWERK
   ---------------------------------------------------------------------
   XANDER (Funk 139): „wie kriegen wir überhaupt die Dorfbewohner dazu
   Bäcker zu werden" und „ab einer gewissen Stufe der Bäckerei so die
   Sachen automatisieren dass da automatisch jemand so das Getreide
   abholt in die Mühle bringt". Geprüft mit echten Fingertipps auf einem
   Android-Telefon: Berufe-Tafel, Ausbilden/Entlassen, Automatik-Schalter
   nur mit Müller und Bäcker, Takt beim Öffnen, Fuhrwerk fährt und bleibt
   beim Neuzeichnen dasselbe Element, Erntemeldung mit Hunger/Wegzug,
   nichts ragt aus dem Menü. Die Server-Regeln sind hier nachgebaut
   (spiel_ausbilden, spiel_dorf_automatik, spiel_dorf_takt).
   Aufbau (Sitzplätze, Server-Attrappe) wie pruefe-700.
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
    ich.level = 10; ich.punkte = 500; ich.mana = 60;
    ich.dorf = { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, schmiede: { stufe: 1, lp: 20 }, labor: { stufe: 1, lp: 20 }, schule: { stufe: 1, lp: 20 } };
    ich.werk = {};
    ich.dorf_ab = new Date(jetzt - 5 * 3600000).toISOString();
    ich.volk = { arbeiter: 14, ritter: 0, quote: 90, berufe: { bauer: 2 }, hunger: 1, forschung: 5 };
    ich.vorraete = Object.assign({}, ich.vorraete, { getreide: 12, mehl: 0, brot: 0, fisch: 1 });
    /* Die Server-Regeln aus spiel_702 nachgebaut. */
    const st = (k) => ((ich.dorf[k] || {}).stufe || 0);
    const MAX = { bauer: () => 4 + 2 * st("muehle"), mueller: () => 2 * st("muehle"), baecker: () => 2 * st("baeckerei"), schmied: () => 2 * st("schmiede"),
                  wissenschaftler: () => 2 * (st("schule") + st("bibliothek") + st("labor")) };
    const summe = () => Object.values(ich.volk.berufe || {}).reduce((a, b) => a + b, 0);
    const alle = () => 2 * Object.values(ich.dorf).reduce((a, g) => a + g.stufe, 0);
    window.__taktAntwort = null;
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_markt_preise: () => ({ ok: true, preise: {} }),
      spiel_angebote_liste: () => ({ ok: true, angebote: [] }),
      spiel_ausbilden: (a) => {
        const n = (ich.volk.berufe || {})[a.p_beruf] || 0, neu = Math.max(0, n + a.p_menge);
        let preis = 0;
        if (neu > n) {
          if (neu > MAX[a.p_beruf]()) return { ok: false, grund: "höchstens " + MAX[a.p_beruf]() };
          if (alle() - summe() < neu - n) return { ok: false, grund: "keine freien Dorfbewohner" };
          preis = (neu - n) * (a.p_beruf === "bauer" ? 5 : a.p_beruf === "wissenschaftler" ? 30 : 15);
          ich.punkte -= preis;
        }
        ich.volk = Object.assign({}, ich.volk, { berufe: Object.assign({}, ich.volk.berufe, { [a.p_beruf]: neu }) });
        return Object.assign({ ok: true, beruf: a.p_beruf, anzahl: neu, preis: preis }, JSON.parse(JSON.stringify(ich)));
      },
      spiel_dorf_automatik: (a) => {
        if (a.p_an && (!(ich.volk.berufe.mueller > 0) || !(ich.volk.berufe.baecker > 0))) return { ok: false, grund: "bilde erst einen Müller und einen Bäcker aus" };
        ich.volk = Object.assign({}, ich.volk, { automatik: a.p_an });
        let takt = { an: false };
        if (a.p_an) {
          ich.vorraete.getreide -= 10;
          ich.werk = Object.assign({}, ich.werk, { muehle: { ware: "mehl", menge: 10, fertig: new Date(Date.now() + 360000).toISOString(), auto: true } });
          takt = { an: true, laeuft: true, gemacht: ["Fuhrmann bringt 10 Getreide zur Mühle"] };
        }
        return Object.assign({ ok: true, automatik: a.p_an, takt: takt }, JSON.parse(JSON.stringify(ich)));
      },
      spiel_dorf_takt: () => {
        const r = window.__taktAntwort || { an: true, laeuft: true, gemacht: [] };
        if (r.gemacht.length) {
          ich.vorraete.mehl = 0; ich.werk = Object.assign({}, ich.werk, { baeckerei: { ware: "brot", menge: 10, fertig: new Date(Date.now() + 480000).toISOString(), auto: true } });
        }
        return Object.assign({ ok: true, automatik: r }, JSON.parse(JSON.stringify(ich)));
      }
    });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false;
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  const rufe = (n) => pg.evaluate((n) => window.__rufe.filter((r) => r.name === n), n);
  const knopf = (b, n) => '.sp-beruf [data-s="ausbilden"][data-b="' + b + '"][data-n="' + n + '"]';

  console.log("\nBERUFE-TAFEL IM DORF\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(700);
  let r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); const k = m && m.querySelector(".sp-berufe");
    return { kopf: k ? k.textContent : "", zeilen: m ? m.querySelectorAll(".sp-beruf").length : 0, hunger: Boolean(m && m.querySelector(".sp-hunger")),
      forschung: m ? /Forschung gesammelt: 5/.test(m.textContent) : false, bauern: m ? (m.querySelector('.sp-beruf [data-b="bauer"]') || {}).closest && m.querySelector('.sp-beruf [data-b="bauer"]').closest(".sp-beruf").textContent : "",
      autoAus: Boolean(m && m.querySelector('.sp-automatik [data-s="automatik"][disabled]')) }; });
  sage(/12 von 14 Dorfbewohnern frei/.test(r.kopf), "die Tafel zählt freie Dorfbewohner (14 aus 7 Gebäudestufen, 2 sind Bauern)", r.kopf);
  sage(r.zeilen === 6, "fünf Berufe und die Automatik als Zeilen", r.zeilen + " Zeilen");
  sage(/2 Bauern/.test(r.bauern) && /höchstens 8/.test(r.bauern), "Bauern: 2, höchstens 4 + 2 je Mühlenstufe = 8", r.bauern.replace(/\s+/g, " ").slice(0, 90));
  sage(r.hunger, "Hunger-Warnung steht da, wenn das Volk bei der letzten Ernte gehungert hat");
  sage(r.forschung, "gesammelte Forschung wird gezeigt");
  sage(r.autoAus, "Automatik-Schalter ist gesperrt, solange Müller und Bäcker fehlen");

  console.log("\nAUSBILDEN UND ENTLASSEN (Fingertipp)\n");
  await tippe(knopf("mueller", 1)); await tick(500);
  let a = await rufe("spiel_ausbilden");
  sage(a.length === 1 && a[0].args.p_beruf === "mueller" && a[0].args.p_menge === 1, "Tipp auf „Ausbilden“ beim Müller ruft spiel_ausbilden(mueller, 1)", JSON.stringify(a.map((x) => x.args)));
  r = await pg.evaluate(() => ({ zeile: document.querySelector('.sp-beruf [data-b="mueller"]').closest(".sp-beruf").textContent, kopf: document.querySelector(".sp-berufe").textContent, punkte: window.DMA_SPIEL.pruef.zustand().ich.punkte,
    ton: window.DMA_TONLOG.map((t) => t.name).join(","), hin: window.__hinweise.slice(-1)[0] || "" }));
  sage(/1 Müller/.test(r.zeile) && /11 von 14/.test(r.kopf) && r.punkte === 485, "danach: 1 Müller, 11 frei, 15 P abgezogen", r.punkte + " P");
  sage(/Müller/.test(r.hin) && /jubel/.test(r.ton), "Meldung nennt den Beruf, Jubel-Ton", r.hin.slice(0, 80));
  await tippe(knopf("baecker", 1)); await tick(500);
  r = await pg.evaluate(() => Boolean(document.querySelector('.sp-automatik [data-s="automatik"][data-an="1"]:not([disabled])')));
  sage(r, "mit Müller und Bäcker wird der Automatik-Schalter frei");
  await tippe(knopf("bauer", -1)); await tick(500);
  a = await rufe("spiel_ausbilden");
  r = await pg.evaluate(() => document.querySelector('.sp-beruf [data-b="bauer"]').closest(".sp-beruf").textContent);
  sage(a[a.length - 1].args.p_menge === -1 && /1 Bauer(?!n)/.test(r), "„−“ entlässt einen Bauern (p_menge −1, 1 Bauer übrig)", r.replace(/\s+/g, " ").slice(0, 40));
  r = await pg.evaluate(() => Boolean(document.querySelector('.sp-beruf [data-b="schmied"][data-n="1"]:not([disabled])')) && Boolean(document.querySelector('.sp-beruf [data-b="wissenschaftler"][data-n="1"]:not([disabled])')));
  sage(r, "Schmied und Wissenschaftler sind ausbildbar (Schmiede, Schule/Labor stehen)");

  console.log("\nAUTOMATIK: SCHALTER, FUHRWERK, TAKT\n");
  await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
  await tippe('.sp-automatik [data-s="automatik"]'); await tick(600);
  a = await rufe("spiel_dorf_automatik");
  r = await pg.evaluate(() => ({ hin: window.__hinweise.slice(-1)[0] || "", fw: document.querySelectorAll(".sp-dorfland .sp-dl-fuhrwerk").length, motion: [...document.querySelectorAll(".sp-dorfland .sp-dl-fuhrwerk")].reduce((n, e) => n + e.getAnimations().filter((x) => x.animationName === "spDlFuhre" && x.playState === "running").length, 0),
    leute: document.querySelectorAll(".sp-dorfland .sp-dl-mensch").length, text: document.querySelector(".sp-automatik").textContent, ton: window.DMA_TONLOG.map((t) => t.name).join(","),
    werk: (document.querySelector(".sp-schnellmenue").textContent.match(/Mühle arbeitet · Automatik/) || [""])[0] }));
  sage(a.length === 1 && a[0].args.p_an === true, "Tipp auf „Einschalten“ ruft spiel_dorf_automatik(true)");
  sage(/Automatik an: Fuhrmann bringt 10 Getreide zur Mühle/.test(r.hin) && /pferd/.test(r.ton), "Meldung sagt, was das Fuhrwerk tut; dazu Pferdegeräusch", r.hin + " · " + r.ton);
  sage(r.fw === 1 && r.motion === 1, "im Dorfbild fährt ein Fuhrwerk (Fahrt-Animation auf dem Mühlweg läuft)", r.fw + "/" + r.motion);
  sage(r.leute === 3, "Leute im Bild: 1 Bauer, 1 Müller, 1 Bäcker", r.leute + " Figuren");
  sage(/läuft/.test(r.text) && r.werk, "Zeile „Automatik läuft“, Mühle als „Automatik“ markiert", r.werk);
  /* Das Fuhrwerk bewegt sich und bleibt beim Neuzeichnen dasselbe Element. */
  const lage = () => pg.evaluate(() => { const g = document.querySelector(".sp-dorfland .sp-dl-fuhrwerk"); const b = g.getBoundingClientRect(); window.__fw = window.__fw || g; return { x: Math.round(b.left), y: Math.round(b.top), gleich: g === window.__fw }; });
  const l1 = await lage(); await tick(2600); const l2 = await lage();
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, S.ich, { punkte: S.ich.punkte + 1 }); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300); const l3 = await lage();
  sage(Math.abs(l2.x - l1.x) + Math.abs(l2.y - l1.y) >= 6 && l2.x > l1.x && l2.y > l1.y, "das Fuhrwerk fährt von der Mühle Richtung Bäckerei (nach rechts unten)", JSON.stringify([l1, l2]));
  sage(l3.gleich && Math.abs(l3.x - l2.x) < 20, "beim Neuzeichnen bleibt es dasselbe Element und springt nicht an den Anfang", JSON.stringify(l3));
  /* Wieder öffnen: der Takt läuft sofort. */
  await pg.evaluate(() => { window.__taktAntwort = { an: true, laeuft: true, gemacht: ["Fuhrmann holt 10 Mehl aus der Mühle", "Fuhrmann bringt 10 Mehl zur Bäckerei"] }; window.DMA_TONLOG.length = 0; });
  await tippe('.sp-schnell [data-s="makro"]'); await tick(500);
  await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
  a = await rufe("spiel_dorf_takt");
  r = await pg.evaluate(() => ({ hin: window.__hinweise.slice(-1)[0] || "", ton: window.DMA_TONLOG.map((t) => t.name).join(","), offen: window.DMA_SPIEL.pruef.zustand().blick }));
  sage(a.length >= 1 && r.offen === "dorfblick", "beim Öffnen des Dorfs läuft der Automatik-Takt (spiel_dorf_takt)", a.length + "×");
  sage(/Fuhrwerk: Fuhrmann holt 10 Mehl/.test(r.hin) && /pferd/.test(r.ton), "was der Takt geschafft hat, steht in der Meldung – mit Pferdegeräusch", r.hin.slice(0, 90));
  const vorher = a.length; await tick(2500); a = await rufe("spiel_dorf_takt");
  sage(a.length === vorher, "kein Dauerfeuer: der Takt fragt höchstens alle 30 s", vorher + " → " + a.length);

  console.log("\nERNTE: GETREIDE, BROT, FORSCHUNG, HUNGER\n");
  await pg.evaluate(() => { const ich = window.__ich; window.__ernte = Object.assign({ ok: true, bratwurst: 4, erz: 1, xp: 0, getreide: 4, brot: 1, forschung: 3, hunger: 2, weggezogen: "bauer",
    zufrieden: 60, satt: 3, bedarf: 6, bezahlt: 14, quote: 90, automatik: { an: true, laeuft: true, gemacht: ["Fuhrmann bringt 10 Getreide zur Mühle"] } }, JSON.parse(JSON.stringify(ich))); });
  await tippe('.sp-schnellmenue [data-s="ernte"]'); await tick(600);
  r = await zuletzt();
  sage(/4 Getreide/.test(r) && /1 Brot/.test(r) && /3 Forschung/.test(r), "Erntemeldung nennt Getreide, Brot und Forschung", r.slice(0, 120));
  sage(/ein Bauer ist weggezogen/.test(r) && /Fuhrwerk: Fuhrmann bringt 10 Getreide/.test(r), "… und dass ein Bauer wegen Hunger weggezogen ist, und was das Fuhrwerk tat");

  console.log("\nANDROID: NICHTS RAGT HERAUS\n");
  r = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"); const mr = m.getBoundingClientRect();
    const raus = [...m.querySelectorAll(".sp-beruf button, .sp-beruf span")].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > mr.right + 1 || b.left < mr.left - 1 || e.scrollWidth > e.clientWidth + 1); }).map((e) => e.textContent.slice(0, 20));
    return { raus, quer: m.scrollWidth - m.clientWidth }; });
  sage(r.raus.length === 0 && r.quer <= 1, "360 px breit: kein Knopf und keine Zeile ragt heraus, kein Querscrollen", JSON.stringify(r));
  await pg.evaluate(() => { const e = document.querySelector(".sp-dorfland"); e.scrollIntoView({ block: "start" }); }); await tick(300);
  await (await pg.$(".sp-dorfland")).screenshot({ path: process.env.BILD || "/tmp/dorf-702.png" });
  await pg.evaluate(() => { const e = document.querySelector(".sp-berufe"); e.scrollIntoView({ block: "start" }); }); await tick(300);
  await pg.screenshot({ path: (process.env.BILD || "/tmp/dorf-702.png").replace(/\.png$/, "-tafel.png") });

  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const leistung = await pg.evaluate(() => new Promise((ok) => {
    const S = window.DMA_SPIEL.pruef.zustand(); const t0 = performance.now(); S.ich = Object.assign({}, S.ich, { punkte: (S.ich.punkte || 0) + 1 }); window.DMA_SPIEL.pruef.schnellZeichnen(true); const zeichnen = performance.now() - t0;
    const bilder = []; let letzt = performance.now(); const ende = letzt + 3000;
    const f = (t) => { bilder.push(t - letzt); letzt = t; if (t < ende) requestAnimationFrame(f); else ok({ zeichnen: Math.round(zeichnen), bilder: bilder.length, lang: bilder.filter((x) => x > 50).length }); };
    requestAnimationFrame(f); }));
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  sage(leistung.zeichnen < 120 && leistung.lang <= 5, "4× gedrosselte CPU mit Leuten und Fuhrwerk: Neuzeichnen unter 120 ms, höchstens 5 lange Bilder", JSON.stringify(leistung));
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 702 (Dorf-Berufe): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
