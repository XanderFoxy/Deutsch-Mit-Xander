#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 658: SUPERKRAFT AM GEGNER, FILIGRANES FEUER,
   DEUTSCH-REITER, ERSCHÖPFTE TIERE, FLÜSSIGKEIT, WENIGER VERMITTLER
   ---------------------------------------------------------------------
   XANDER (25.09.): „ich sehe keinen Effekt den es macht durch das Feuer,
   was ich auf den Gegner schicke" · „mein Fell … schwächer dargestellt.
   Woran liegt das?" · „die Blasen … einfach nur Punkte die hoch und
   runter wandern" · „diese Feuereffekte noch filigran" · „aus dem Bürger
   nicht sofort heraus, dass man die Deutsch Aufgaben machen kann".
   Android-Telefon (360 px), echte Fingertipps.
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
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_meine_fallen") data = window.__fallen;
      else if (name === "spiel_falle_legen") { window.__fallen = [{ platz: args.p_platz, art: args.p_art }]; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_falle_pruefen") data = window.__falleAntwort;
      else if (name === "spiel_heilen") data = Object.assign({}, ich, { ok: true, geheilt: 25, fremd: Boolean(args.p_ziel), geheilter: Object.assign({}, bea, { lp: 75 }) });
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
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: true, loesung: "gehe", gewonnen: 3, bonus: 0, mana_plus: 6, xp_plus: 6, level_vorher: 3, level: 4 });
      else if (name === "spiel_zaubern") {
        const R = { nebel: [25, 0, 0, 15], erdbeben: [35, 10, 25, 6], orkan: [50, 15, 0, 10] }[args.p_zauber];
        ich.mana -= R[0];
        data = { ok: true, zauber: args.p_zauber, schaden: R[1], abgewehrt: 0, mauer_riss: R[2], dauer: R[3], kaputt: false, lohn: 1,
                 ziel: Object.assign({}, bea, { lp: bea.lp - R[1] }), ich_voll: Object.assign({}, ich) };
      }
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
  const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  const seite = (chat) => pg.evaluate((c) => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + c + '"] .lc-kreis'); if (!k) return null; const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, chat);


  console.log("\nDEUTSCH HAT EINEN EIGENEN REITER\n");
  await tippe(".sp-schnell .sp-s-burger");
  await tick(200);
  const reiter = await pg.evaluate(() => { const bs = [...document.querySelectorAll(".sp-sm-reiter button")];
    return { namen: bs.map((b) => b.textContent).join(","), passt: bs.every((b) => { const r = b.getBoundingClientRect(); const o = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return r.left >= 0 && r.right <= innerWidth && b.scrollWidth <= b.clientWidth + 1 && (o === b || b.contains(o)); }),
      gruen: getComputedStyle(bs.find((b) => b.dataset.r === "deutsch")).backgroundColor }; });
  sage(reiter.namen === "Waffen,Heilen,Tiere,Deutsch,Mehr", "fünf Reiter, Deutsch dazwischen", reiter.namen);
  sage(reiter.passt, "alle fünf passen aufs Telefon, Text nicht abgeschnitten, tippbar", JSON.stringify(await pg.evaluate(() => [...document.querySelectorAll(".sp-sm-reiter button")].map((b) => { const r = b.getBoundingClientRect(); const o = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return [b.textContent, Math.round(r.left), Math.round(r.right), b.scrollWidth, b.clientWidth, o === b || b.contains(o) ? "" : (o && o.className)]; }))));
  sage(/rgb\(31, 107, 58\)/.test(reiter.gruen), "der Deutsch-Reiter ist grün markiert", reiter.gruen);
  /* FASSUNG 666 — XANDER: „das mit diesem Deutsch Menü das hätte ich wieder,
     wie das vorher war". Der grüne Reiter führt direkt ins große Deutsch-Menü. */
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippe('.sp-sm-reiter [data-r="deutsch"]');
  await tick(300);
  const auf = await pg.evaluate(() => ({ ruf: window.__rufe.filter((r) => r.name === "spiel_aufgabe").pop(), panel: !!(document.getElementById("spPanel") && !document.getElementById("spPanel").hidden),
    frage: (document.querySelector("#spPanel .sp-frage-satz") || {}).textContent || "", zu: !document.querySelector(".sp-schnellmenue") }));
  sage(auf.ruf && auf.panel && /nach Hause/.test(auf.frage) && auf.zu, "Deutsch-Reiter öffnet direkt das große Deutsch-Menü mit Aufgabe", JSON.stringify(auf));
  await pg.evaluate(() => { const p = document.getElementById("spPanel"); if (p) p.hidden = true; const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(150);
  sage(await pg.evaluate(() => !!document.querySelector('.sp-schnellmenue [data-s="gross"][data-r="deutsch"]')), "unter „Mehr“ steht wieder „Deutsch-Aufgaben“");

  console.log("\nDAS TIER IST ERSCHÖPFT\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.haustier_leben = 0; S.stand[S.ich.id].haustier_leben = 0; S.schnellReiter = "tiere"; window.DMA_SPIEL.pruef.zeichnen(); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  const muede = await pg.evaluate(() => { const t = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-tier');
    return { schwach: t && t.classList.contains("sp-tier-schwach"), zzz: t ? getComputedStyle(t, "::after").content : "",
      warn: (document.querySelector(".sp-schnellmenue .sp-sm-warn") || {}).textContent || "", fuettern: !!document.querySelector('.sp-schnellmenue [data-s="gross"][data-r="tiere"]') }; });
  sage(muede.schwach && /Zzz/.test(muede.zzz), "0 Kraft: das Fellmonster ist grau und schläft („Zzz“)", muede.zzz);
  sage(/Gegenbiss kostet 1 Kraft/.test(muede.warn) && muede.fuettern, "im Tiere-Reiter steht warum – und „Jetzt füttern“", muede.warn);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.haustier_leben = 30; S.stand[S.ich.id].haustier_leben = 30; S.schnellMenue = false; window.DMA_SPIEL.pruef.zeichnen(); window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  console.log("\nSUPERKRAFT: DAS FEUER KOMMT BEIM GEGNER AN\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.daemon = true; S.ich.daemon_bis = new Date(Date.now() + 60000).toISOString();
    window.__kugel = []; const alt = document.body.appendChild.bind(document.body);
    new MutationObserver((m) => m.forEach((x) => x.addedNodes.forEach((n) => { if (n.classList && n.classList.contains("sp-geschoss")) window.__kugel.push(n.className); }))).observe(document.body, { childList: true });
    window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", "kartoffel", 0, 0); });
  await tick(60);
  const kugel = await pg.evaluate(() => window.__kugel.join("|"));
  sage(/sp-g-daemon/.test(kugel), "die eigene Kugel fliegt mit lila Feuerschweif", kugel);
  await pg.evaluate(() => { window.DMA_TONLOG.length = 0; window.DMA_SPIEL.pruef.trefferZeigen("bea", { zone: "koerper", schaden: 12, daemon: true }); });
  await tick(250);
  await pg.evaluate(() => { let e = document.getElementById("lcPlaetze"); while (e) { if (e.scrollHeight > e.clientHeight + 4) e.scrollTop = 0; e = e.parentElement; } });
  const brand = await pg.evaluate(() => ({ flammen: document.querySelectorAll(".sp-zunge.sp-zunge-daemon").length, funken: document.querySelectorAll(".sp-glutfunke.sp-zunge-daemon").length,
    brennt: document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]').classList.contains("sp-daemon-brand"),
    zahl: [...document.querySelectorAll(".sp-zahl-daemon")].map((z) => z.textContent).join(","), toene: window.DMA_TONLOG.map((t) => t.name).join(",") }));
  /* Erst messen, dann fotografieren: das Glühen hält 1,3 s, ein Foto auf
     einem ausgelasteten Rechner kann länger dauern. */
  await pg.locator("#lcPlaetze").screenshot({ path: "/tmp/claude-0/p-658-brand.png" }).catch(() => {});
  sage(brand.flammen >= 12 && brand.funken >= 6, "Treffer: lila Flammen züngeln am Gegner hoch, Glutfunken steigen", JSON.stringify(brand));
  sage(brand.brennt && /×1,5/.test(brand.zahl), "sein Bild glüht lila, die Zahl zeigt ×1,5", JSON.stringify({ brennt: brand.brennt, zahl: brand.zahl }));
  await tick(1800);
  const rest = await pg.evaluate(() => ({ f: document.querySelectorAll(".sp-zunge,.sp-glutfunke").length, b: [...document.querySelectorAll(".sp-daemon-brand")].map((x) => x.className) }));
  sage(rest.f === 0 && !rest.b.length, "danach ist alles wieder weg – nichts bleibt hängen", JSON.stringify(rest));
  await pg.evaluate(() => { window.__kugel = []; window.DMA_SPIEL.empfangen({ ereignis: "schuss", von: "bea", zielChat: "cem", waffe: "bogen", dx: 0, dy: 0 }); });
  await tick(60);
  sage(await pg.evaluate(() => !/sp-g-daemon/.test(window.__kugel.join("|"))), "Beas Kugel (ohne Superkraft) fliegt normal");
  await pg.evaluate(() => { window.__kugel = []; const S = window.DMA_SPIEL.pruef.zustand(); S.stand["11111111-1111-4111-8111-111111111111"].daemon = true;
    window.DMA_SPIEL.empfangen({ ereignis: "schuss", von: "bea", zielChat: "cem", waffe: "bogen", dx: 0, dy: 0 }); });
  await tick(60);
  sage(await pg.evaluate(() => /sp-g-daemon/.test(window.__kugel.join("|"))), "hat Bea Superkraft, sieht man es auch an ihrer Kugel");

  console.log("\nFEUER FILIGRAN\n");
  await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis').getBoundingClientRect();
    window.DMA_SPIEL.pruef.flammen(r.left + r.width / 2, r.top + r.height / 2, r.width / 2, "gold", 9); });
  await tick(300);
  const fil = await pg.evaluate(() => { const f = [...document.querySelectorAll(".sp-zunge.sp-zunge-gold")]; const r = f[0].getBoundingClientRect();
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis').getBoundingClientRect();
    return { n: f.length, breit: Math.round(r.width), kopfFrei: f.every((x) => parseFloat(x.style.top) >= k.top + k.height / 2) }; });
  sage(fil.n === 9 && fil.breit <= 30, "Phönixfeuer: neun schmale Goldflammen statt eines Balls", JSON.stringify(fil));
  sage(fil.kopfFrei, "sie entstehen in der unteren Bildhälfte – das Gesicht bleibt frei");

  console.log("\nFLÜSSIGKEIT IN DEN RINGEN\n");
  const flut = await pg.evaluate(() => { const f = document.querySelector("#lcPlaetze .sp-lp .sp-flut"); const c = getComputedStyle(f);
    return { dash: c.strokeDasharray, anim: c.animationName, blur: c.filter }; });
  sage(flut.anim === "spGlanz" && /7px, 26px|7, 26/.test(flut.dash) && /blur/.test(flut.blur), "statt wandernder Punkte gleitet ein weicher Lichtglanz durch", JSON.stringify(flut));

  console.log("\nWENIGER VERMITTLER (FIREFOX)\n");
  const ice = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/function mitRelais\(server\) \{ return server\.concat\(NOTVERMITTLER\.slice\(0, 1\)\); \}/.test(ice) && (ice.match(/VERMITTLER = mitRelais\(/g) || []).length === 2 && !/server\.concat\(NOTVERMITTLER\)/.test(ice),
    "mit eigenem Relais: Cloudflare + ein STUN (statt sieben Einträgen)");

  await pg.screenshot({ path: "/tmp/claude-0/p-658.png" });
  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 658: " + fehler + " rot." : "Fassung 658 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
