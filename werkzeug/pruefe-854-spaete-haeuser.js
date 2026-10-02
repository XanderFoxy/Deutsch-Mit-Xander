#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 833 (Arbeitsnummer 854): GEBAUTE HÄUSER ERSCHEINEN,
   BAUEN GIBT SOFORT RÜCKMELDUNG
   ---------------------------------------------------------------------
   XANDER (Funk 255, wörtlich): „die Sachen die ich weiter baue tauchen
   niemals auf der Karte auf die Jagdhütte oder Kuhstall oder sowas und
   gibt es da einen standardplatz an dem sie gebaut werden wo man das
   sieht" · „wenn ich das anklicke dann habe ich niemals irgendwie so ein
   responsives Feedback oder irgend so ein haptisches Feedback … manchmal
   drücke ich da fünfmal drauf".
   Geprüft:
     ALTES DORF (spiel.js, gemalt): Holzfällerhütte, Marktstand,
       Schweinestall, Jagdhütte, Sternwarte erscheinen gebaut, frei von
       anderen Häusern, im Bild; ungebaut gibt es für sie keinen leeren
       Bauplatz.
     BAUEN: Tipp → sofort Klopfton, Zittern, Knopf „wird gebaut …"
       gesperrt; ein zweiter Bau-Tipp während der Antwort schickt nichts;
       danach doppeltes Zittern und „gebaut".
     NEUE STADT (stadt-leicht, Beispielstadt): die fünf Häuser stehen,
       ihre Bilder sind gebacken und geladen, auf dem Plateau, nicht im
       Wasser, auf keinem anderen Haus oder Wahrzeichen; ohne sie bleibt
       die Stadt wie vorher.
   Mit dem Stand 832 ist das rot.
   Aufruf: node werkzeug/pruefe-854-spaete-haeuser.js   (BILD=/pfad für Bilder)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp3": "audio/mpeg",
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

  const SPAET = ["holzhuette", "marktstand", "schweinestall", "jagdhuette", "sternwarte"];
  const dorfSetzen = (mitSpaet) => pg.evaluate((mit) => {
    const ich = window.__ich;
    ich.level = 35; ich.punkte = 5000;
    ich.dorf = { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, schule: { stufe: 1, lp: 20 }, rathaus: { stufe: 3, lp: 60 }, schmiede: { stufe: 1, lp: 20 },
                 kuhstall: { stufe: 1, lp: 20 }, brauerei: { stufe: 2, lp: 40 }, krankenhaus: { stufe: 1, lp: 20 }, huehnerstall: { stufe: 1, lp: 20 }, gasthaus: { stufe: 1, lp: 20 },
                 bibliothek: { stufe: 1, lp: 20 }, labor: { stufe: 1, lp: 20 }, kaserne: { stufe: 1, lp: 20 }, gefaengnis: { stufe: 1, lp: 20 }, flickstube: { stufe: 1, lp: 20 }, bergwerk: { stufe: 1, lp: 20 } };
    if (mit) ["holzhuette", "marktstand", "schweinestall", "jagdhuette", "sternwarte"].forEach((k) => { ich.dorf[k] = { stufe: 1, lp: 20 }; });
    ich.werk = {}; ich.volk = { arbeiter: 20, ritter: 0, quote: 80, berufe: { bauer: 2, mueller: 1 } }; ich.baustellen = [];
    ich.dorf_ab = new Date(Date.now() - 3600000).toISOString();
    window.__extra = Object.assign({}, window.__extra || {}, { spiel_markt_preise: () => ({ ok: true, preise: {} }), spiel_angebote_liste: () => ({ ok: true, angebote: [] }) });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false; S.dorfTeil = ""; S.dorfWahl = "";
    try { localStorage.removeItem("dma_spiel_makro"); localStorage.removeItem("dma_dorf_nah"); } catch (e) {}
    S.dorfNah = null; S.wetterTest = { code: 1, tag: true };
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  }, mitSpaet);
  const haeuser = () => pg.evaluate(() => {
    const land = document.querySelector(".sp-dorfland"); if (!land) return null;
    const lb = land.getBoundingClientRect();
    return { land: { l: lb.left, t: lb.top, r: lb.right, b: lb.bottom }, h: [...document.querySelectorAll(".sp-dl-haus-gemalt")].map((e) => { const b = e.getBoundingClientRect(); return { g: e.dataset.g, platz: e.classList.contains("sp-dl-bauplatz"), l: b.left, t: b.top, r: b.right, b: b.bottom }; }) };
  });

  console.log("\nALTES DORF: OHNE DIE SPÄTEN HÄUSER\n");
  await dorfSetzen(false);
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1200);
  let H = await haeuser();
  sage(H && H.h.length >= 10, "das gemalte Dorf ist offen", H && H.h.length + " Häuser");
  sage(H && !H.h.some((x) => SPAET.includes(x.g)), "ungebaut: kein leerer Bauplatz für die fünf späten Häuser", H && JSON.stringify(H.h.filter((x) => SPAET.includes(x.g)).map((x) => x.g)));

  console.log("\nALTES DORF: GEBAUT\n");
  await pg.evaluate(() => { const ich = window.__ich; ["holzhuette", "marktstand", "schweinestall", "jagdhuette", "sternwarte"].forEach((k) => { ich.dorf[k] = { stufe: 1, lp: 20 }; });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(1500);
  H = await haeuser();
  for (const k of SPAET) {
    const e = H && H.h.find((x) => x.g === k);
    sage(!!e && !e.platz && e.l >= H.land.l - 1 && e.r <= H.land.r + 1 && e.t >= H.land.t - 1 && e.b <= H.land.b + 1, k + " steht im Dorf, ganz im Bild", e ? JSON.stringify({ l: Math.round(e.l - H.land.l), t: Math.round(e.t - H.land.t), w: Math.round(e.r - e.l), h: Math.round(e.b - e.t) }) : "fehlt");
  }
  const ueber = [];
  for (const a of H.h.filter((x) => SPAET.includes(x.g))) for (const b of H.h) {
    if (a === b) continue;
    const w = Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)), h = Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
    const kl = Math.min((a.r - a.l) * (a.b - a.t), (b.r - b.l) * (b.b - b.t));
    if (w * h > kl * 0.2) ueber.push(a.g + "/" + b.g + " " + Math.round(100 * w * h / kl) + "%");
  }
  sage(!ueber.length, "kein spätes Haus liegt über einem anderen (höchstens 20 % Überdeckung der Tippflächen)", ueber.join(", "));
  const tl = await pg.evaluate(() => [...document.querySelectorAll(".sp-dl-haus-gemalt")].filter((e) => ["holzhuette", "jagdhuette", "sternwarte"].includes(e.dataset.g)).length);
  if (process.env.BILD) {
    const url = await pg.evaluate(() => document.querySelector("canvas.sp-dl-mal").toDataURL("image/png"));
    fs.writeFileSync(process.env.BILD + "-altdorf.png", Buffer.from(url.split(",")[1], "base64"));
  }

  console.log("\nBAUEN: SOFORT RÜCKMELDUNG\n");
  await pg.evaluate(() => {
    window.__summ = []; navigator.vibrate = (m) => { window.__summ.push(m); return true; };
    window.__bauFrei = null;
    window.__extra.spiel_bauen = (args, ich) => new Promise((ok) => { window.__bauFrei = () => { const st = ((ich.dorf || {})[args.p_was] || {}).stufe || 0; ich.dorf = Object.assign({}, ich.dorf, { [args.p_was]: { stufe: st + 1, lp: 20 * (st + 1) } }); ok(Object.assign({ ok: true, gebaut: args.p_was, stufe: st + 1 }, ich)); }; });
    const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = "holzhuette"; window.DMA_SPIEL.pruef.schnellZeichnen(true);
    window.__rufe.length = 0; window.DMA_TONLOG.length = 0;
  });
  await tick(500);
  const kn = '.sp-dl-station [data-s="bauen"][data-w="holzhuette"]';
  const da = await pg.evaluate((s) => { const b = document.querySelector(s); return b ? { aus: b.disabled, text: b.textContent } : null; }, kn);
  sage(!!da && !da.aus, "die Holzfällerhütte hat einen Ausbau-Knopf", JSON.stringify(da));
  await tippe(kn);
  const sofort = await pg.evaluate(() => { const b = document.querySelector(".sp-bau-laeuft");
    return { knopf: !!b, aus: b ? b.disabled : null, text: b ? b.textContent.trim() : "", uhr: !!(b && b.querySelector(".sp-bau-uhr")), ton: window.DMA_TONLOG.map((t) => t.name), summ: window.__summ.slice(), rufe: window.__rufe.filter((r) => r.name === "spiel_bauen").length }; });
  sage(sofort.knopf && sofort.aus && /wird gebaut/.test(sofort.text) && sofort.uhr, "sofort nach dem Tipp: Knopf „wird gebaut …“ mit Uhr, gesperrt", JSON.stringify({ text: sofort.text, aus: sofort.aus }));
  sage(sofort.ton.includes("holzklopf"), "sofort ein Klopfton", JSON.stringify(sofort.ton));
  sage(sofort.summ.length >= 1, "sofort ein kurzes Zittern", JSON.stringify(sofort.summ));
  /* ein zweiter Bau-Tipp, solange die Antwort fehlt (anderes Haus, derselbe Weg) */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); const b = document.createElement("button"); b.dataset.s = "bauen"; b.dataset.w = "schule"; b.className = "__test"; (document.querySelector(".sp-dl-station") || document.body).appendChild(b); b.click(); });
  await tick(300);
  const zweit = await pg.evaluate(() => ({ rufe: window.__rufe.filter((r) => r.name === "spiel_bauen").length, summ: window.__summ.length }));
  sage(zweit.rufe === 1, "ein zweiter Bau-Tipp während der Antwort schickt nichts los (nur Zittern)", JSON.stringify(zweit));
  await pg.evaluate(() => { document.querySelectorAll(".__test").forEach((e) => e.remove()); if (window.__bauFrei) window.__bauFrei(); });
  await tick(900);
  const danach = await pg.evaluate(() => ({ summ: window.__summ.slice(), hinweis: window.__hinweise.slice(-1)[0] || "", laeuft: !!document.querySelector(".sp-bau-laeuft"), frei: !window.DMA_SPIEL.pruef.zustand().bauLaeuft }));
  sage(danach.summ.some((m) => Array.isArray(m)) && /Stufe 2|steht/.test(danach.hinweis) && !danach.laeuft && danach.frei, "nach der Antwort: doppeltes Zittern, Meldung, Knopf wieder frei", JSON.stringify(danach));
  sage(!konsolenFehler.length, "keine Skriptfehler (Spiel)", JSON.stringify(konsolenFehler.slice(0, 3)));
  await ctx.close();

  console.log("\nNEUE STADT (Beispielstadt)\n");
  const ctx2 = await br.newContext({ viewport: { width: 420, height: 760 }, deviceScaleFactor: 2 });
  const sp = await ctx2.newPage();
  const fehler2 = [], fehlt = [];
  sp.on("pageerror", (e) => fehler2.push(String(e.message || e)));
  sp.on("response", (r) => { if (r.status() === 404 && /bilder\//.test(r.url())) fehlt.push(r.url().split("/").pop().split("?")[0]); });
  await sp.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&uhr=12:00&kx=-50&ky=86&s=4", { waitUntil: "domcontentloaded" });
  await sp.waitForFunction(() => window.STADT && STADT.szene && STADT.szene.objekte.some((o) => o.art === "haus"), null, { timeout: 120000 });
  await sp.waitForTimeout(6000);
  const st = await sp.evaluate((SP) => {
    const ST = window.STADT, SZ = ST.szene, D = ST.dorf, B = ST.boden;
    const ecken = (o) => { const f = o.fuss, m = 1, a = (o.dreh || 0) * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), hw = f[0] * (o.stufe || 1) / 2, hd = f[1] * (o.stufe || 1) / 2; return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([u, v]) => [o.x + u * c - v * s, o.y + u * s + v * c]); };
    const trennt = (A, Q) => { for (const P of [A, Q]) for (let i = 0; i < 4; i++) { const p = P[i], q = P[(i + 1) % 4], nx = q[1] - p[1], ny = p[0] - q[0]; const pa = A.map((e) => e[0] * nx + e[1] * ny), pb = Q.map((e) => e[0] * nx + e[1] * ny); if (Math.max(...pa) < Math.min(...pb) || Math.max(...pb) < Math.min(...pa)) return true; } return false; };
    const gross = SZ.objekte.filter((o) => (o.art === "haus" || o.art === "wunder") && !o.versteckt);
    const aus = {};
    for (const k of SP) {
      const o = SZ.objekte.find((x) => x.art === "haus" && x.spiel === k);
      if (!o) { aus[k] = null; continue; }
      const E = ecken(o), stoesst = gross.filter((x) => x !== o && !trennt(E, ecken(x))).map((x) => x.spiel || x.name);
      const e = SZ.sichtbare.find((x) => x.o === o);
      aus[k] = { x: +o.x.toFixed(1), y: +o.y.toFixed(1), bild: o.bild, plateau: D.randAbst(o.x, o.y) < -3, wasser: B.wert(o.x, o.y, 1), stoesst: stoesst, geladen: !!(e && e.lagen && ST.bilder.fertig(e.lagen[0][0])) };
    }
    return aus;
  }, SPAET);
  for (const k of SPAET) {
    const a = st[k];
    sage(!!a && a.plateau && a.wasser < 0.25 && !a.stoesst.length, k + " steht in der Stadt: auf dem Plateau, nicht im Wasser, auf keinem anderen Haus", JSON.stringify(a));
    sage(!!a && a.geladen, k + ": sein Bild ist gebacken und geladen", a ? a.bild : "");
  }
  const dateien = SPAET.map((k) => "g_" + k + "_herbst_tag_f_315_g.webp").filter((n) => !fs.existsSync(path.join(WURZEL, "stadt-leicht", "bilder", n)));
  sage(!dateien.length, "gebackene Bilder liegen im Ordner (je Haus, Herbst, Tag, Grundansicht)", dateien.join(", "));
  sage(!fehlt.length, "keine fehlenden Bilder (404)", fehlt.slice(0, 5).join(", "));
  /* FASSUNG 834 — die Bau-Uhr (833) hieß „.lk-uhr“ wie die Uhrzeit oben links: die Uhrzeit drehte sich als Kreis
     (Funk 263: „die Uhranzeige oder die Wetteranzeige … scheint beides zusammen in einem Klumpen sich zu drehen“) */
  const sp2 = await ctx2.newPage();
  await sp2.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "commit" }).catch(() => {});
  await sp2.setContent('<body style="margin:0"><iframe id="r" src="/stadt-leicht.html?eingebettet=1&mini=1&demo=1&zeit=tag&jahr=herbst&uhr=12:00" style="width:360px;height:225px;border:0;display:block"></iframe></body>');
  let fr = null;
  for (let i = 0; i < 120 && !fr; i++) { fr = sp2.frames().find((x) => /stadt-leicht\.html/.test(x.url())); if (!fr) await sp2.waitForTimeout(500); }
  if (fr) await fr.waitForFunction(() => !!document.querySelector(".lk-kopfzeile .lk-uhr") && /\d/.test(document.querySelector(".lk-kopfzeile .lk-uhr").textContent), null, { timeout: 120000 }).catch(() => {});
  const uhr = !fr ? null : await fr.evaluate(() => { const u = document.querySelector(".lk-kopfzeile .lk-uhr"); if (!u) return null; const c = getComputedStyle(u), r = u.getBoundingClientRect();
    return { anim: c.animationName, rund: c.borderRadius, w: Math.round(r.width), text: u.textContent }; });
  sage(!!uhr && uhr.anim === "none" && uhr.w > 22 && /\d/.test(uhr.text), "die Uhrzeit oben links steht still und zeigt die Zeit (kein drehender Kreis)", JSON.stringify(uhr));
  if (process.env.BILD) await sp.screenshot({ path: process.env.BILD + "-stadt.png" });
  sage(!fehler2.length, "keine Skriptfehler (Stadt)", JSON.stringify(fehler2.slice(0, 3)));
  const ol = fs.readFileSync(path.join(WURZEL, "stadt-leicht", "oberflaeche.js"), "utf8");
  sage(/function aktion\(fn, text, knopf\)/.test(ol) && /lk-laeuft/.test(ol) && /aktion\(\(\) => ST\.spiel\.bauen\(k\), G\[0\] \+ " wird gebaut", bau\)/.test(ol), "neue Stadt: Bauen meldet sich sofort (Knopf gesperrt, Klopfen, Zittern)");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Fehler" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
