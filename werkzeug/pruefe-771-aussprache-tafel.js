#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 771: FUNK 195
   ---------------------------------------------------------------------
   XANDER: „Die Aussprache Übungen im Spiel hat kein Niveau und keine
   prozentuale Anzeige wie wir sie global auf der Webseite auch haben beim
   Whiteboard hat man immer noch nicht die Auswahl im Ordner mit den
   Bilderwelten … schau auch dass das mit dem makroknopf richtig verlinkt
   ist … vielleicht kannst du bei ST SP oder … den ch an dem s c h auch die
   Stellung der Zunge verdeutlichen über diese Vektorgrafik".
   Android 360 px, Fingertipps.
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

  console.log("\nTAFEL: EIN BESCHRIFTETER ORDNER-KNOPF\n");
  await pg.evaluate(() => { try { Backend.isOwner = () => true; Backend.canModerate = () => true; Backend.getMyWhiteboards = () => Promise.resolve([]); } catch (e) {}
    window.__gesendet = []; window.LiveChat.tafelSenden = (d) => window.__gesendet.push(d);
    window.DMA_TAFEL({ t: "blick", z: 1, x: .5, y: .5 }, "Alex", "Alex"); });
  await tick(700);
  let r = await pg.evaluate(() => {
    const t = document.getElementById("lcTafel"), o = t && t.querySelector('[data-tafel="mappe"]');
    return { tafel: !!t, bild: !!(t && t.querySelector('[data-tafel="bild"]')), ordner: !!o, svg: !!(o && o.querySelector("svg")), text: o ? o.textContent.trim() : "",
      emoji: o ? /\p{Extended_Pictographic}/u.test(o.textContent) : true };
  });
  sage(r.tafel && r.ordner && r.svg && r.text === "Ordner" && !r.emoji && !r.bild, "Knopf „Ordner“ mit gezeichnetem Ordner, kein 🖼️/📂 mehr", JSON.stringify(r));
  r = await pg.evaluate(() => {
    const g = document.getElementById("lcTafelGriff").getBoundingClientRect();
    const ueber = [...document.querySelectorAll("#lcTafel .lc-tafel-leiste button")].filter((b) => { const q = b.getBoundingClientRect(); return q.width && !(q.right <= g.left || q.left >= g.right || q.bottom <= g.top || q.top >= g.bottom); }).map((b) => b.dataset.tafel || b.className);
    const l = document.querySelector("#lcTafel .lc-tafel-leiste").getBoundingClientRect();
    return { ueber, griffUnten: Math.round(g.bottom), leisteOben: Math.round(l.top), leisteHoch: Math.round(l.height) };
  });
  sage(!r.ueber.length && r.griffUnten <= r.leisteOben, "der Griff ⌄ liegt über der Leiste, nicht auf dem Schwamm", JSON.stringify(r));
  const klein = await pg.evaluate(() => [...document.querySelectorAll("#lcTafel .lc-tafel-leiste button")].filter((b) => { const q = b.getBoundingClientRect(); return q.width && (q.height < 26 || q.width < 26); }).map((b) => b.dataset.tafel || "farbe"));
  if (process.env.BILD) await (await pg.$("#lcTafel")).screenshot({ path: process.env.BILD + "-tafel.png" });

  await tippe('#lcTafel [data-tafel="mappe"]'); await tick(500);
  r = await pg.evaluate(() => [...document.querySelectorAll("#lcTafelMappe .lc-mappe-kat span")].map((s) => s.textContent));
  sage(JSON.stringify(r) === JSON.stringify(["Vom Gerät", "Aussprache-Übungen", "Bilderwelten"]), "im Ordner: Vom Gerät, Aussprache-Übungen, Bilderwelten", JSON.stringify(r));
  if (process.env.BILD) await (await pg.$("#lcTafelMappe")).screenshot({ path: process.env.BILD + "-ordner.png" });
  await pg.evaluate(() => { const d = document.getElementById("lcTafelDatei"); d.addEventListener("click", (e) => { window.__datei = true; e.preventDefault(); }, { once: true }); });
  await tippe('#lcTafelMappe .lc-mappe-kat[data-kat="geraet"]'); await tick(300);
  r = await pg.evaluate(() => ({ datei: !!window.__datei, zu: !document.getElementById("lcTafelMappe") }));
  sage(r.datei && r.zu, "„Vom Gerät“ öffnet die Dateiauswahl", JSON.stringify(r));

  await tippe('#lcTafel [data-tafel="mappe"]'); await tick(500);
  await tippe('#lcTafelMappe .lc-mappe-kat[data-kat="laute"]');
  await pg.waitForFunction(() => document.querySelectorAll(".lc-tafel-bildmappe [data-mappe=laut]").length > 8, { timeout: 15000 }).catch(() => {});
  r = await pg.evaluate(() => [...document.querySelectorAll(".lc-tafel-bildmappe [data-mappe=laut]")].filter((b) => b.querySelector("svg")).map((b) => b.dataset.k));
  sage(["ng", "ich", "ach", "sch", "s", "st", "sp", "r"].every((k) => r.indexOf(k) >= 0), "Aussprache-Ordner: ng, ich, ach und neu sch, s, st, sp, r (mit Vorschau)", r.join(","));
  if (process.env.BILD) await (await pg.$(".lc-tafel-bildmappe")).screenshot({ path: process.env.BILD + "-laute.png" });
  await klick('.lc-tafel-bildmappe [data-mappe="laut"][data-k="sch"]');
  await pg.waitForFunction(() => window.__gesendet.some((d) => d.t === "bild"), { timeout: 10000 }).catch(() => {});
  const hell = await pg.evaluate(() => new Promise((ok) => { const b = document.getElementById("lcTafelBild"); if (!b || !b.src) return ok(999); const i = new Image(); i.onload = () => { const c = document.createElement("canvas"); c.width = 60; c.height = 40; const g = c.getContext("2d"); g.drawImage(i, 0, 0, 60, 40); const d = g.getImageData(0, 0, 60, 40).data; let s = 0; for (let k = 0; k < d.length; k += 4) s += (d[k] + d[k + 1] + d[k + 2]) / 3; ok(Math.round(s / (d.length / 4))); }; i.src = b.src; }));
  sage(hell < 248 && await pg.evaluate(() => window.__gesendet.some((d) => d.t === "bild")), "das sch-Bild liegt auf der Tafel und geht an alle", "Helligkeit " + hell);
  /* zurück aus dem Laute-Ordner führt in den Ordner */
  await pg.evaluate(() => window.DMA_TAFEL_ORDNER("laute")); await tick(300);
  await klick('.lc-tafel-bildmappe [data-mappe="ordner"][data-o=""]'); await tick(500);
  r = await pg.evaluate(() => ({ ordner: !!document.getElementById("lcTafelMappe"), bm: !!document.querySelector(".lc-tafel-bildmappe") }));
  sage(r.ordner && !r.bm, "„‹ zurück“ aus Aussprache führt zurück in den Ordner", JSON.stringify(r));
  await pg.evaluate(() => { const m = document.getElementById("lcTafelMappe"); if (m) m.remove(); });

  console.log("\nMAKROKNOPF: DIREKT IN DIE ORDNER\n");
  const mk = await pg.evaluate(() => {
    const a = window.DMA_MAGIC.aktionen();
    localStorage.removeItem("dma_magic_felder"); localStorage.removeItem("dma_magic_771");
    const neu = window.DMA_MAGIC.felder();
    localStorage.setItem("dma_magic_felder", JSON.stringify(["bilder", "spiele"])); localStorage.setItem("dma_magic_753", "1"); localStorage.removeItem("dma_magic_771");
    const alt1 = window.DMA_MAGIC.felder();
    localStorage.setItem("dma_magic_felder", JSON.stringify(["bilder"]));
    const alt2 = window.DMA_MAGIC.felder();
    return { aktionen: Object.keys(a), neu, alt1, alt2 };
  });
  sage(mk.aktionen.indexOf("ausspracheBilder") >= 0 && mk.aktionen.indexOf("bilderwelten") >= 0, "Makroknopf kennt „Aussprache-Bilder“ und „Bilderwelten“", mk.aktionen.join(","));
  sage(mk.neu.indexOf("ausspracheBilder") >= 0 && mk.alt1.join(",") === "bilder,spiele,ausspracheBilder" && mk.alt2.join(",") === "bilder", "als Feld: neu dabei, eigenen Feldern einmal angehängt, danach nicht mehr aufgedrängt", JSON.stringify(mk));
  await pg.evaluate(() => { try { window.LiveChat.schreiben("/tafel aus"); } catch (e) {} }); await tick(500);
  for (const [feld, sel, name] of [["ausspracheBilder", ".lc-tafel-bildmappe [data-mappe=laut]", "Aussprache-Bilder"], ["bilderwelten", '.lc-tafel-bildmappe [data-o^="welten:"]', "Bilderwelten"]]) {
    await pg.evaluate((f) => { localStorage.setItem("dma_magic_felder", JSON.stringify([f])); document.querySelectorAll("#lcPlatzMenue, .lc-tafel-bildmappe").forEach((x) => x.remove()); }, feld);
    await pg.evaluate(() => document.querySelector('[data-lc="magic"]').click()); await tick(300);
    const da = await pg.evaluate((f) => { const b = document.querySelector('#lcPlatzMenue .lc-magic-feld[data-feld="' + f + '"]'); if (b) b.click(); return !!b; }, feld);
    await pg.waitForFunction((s) => document.querySelectorAll(s).length > 2, sel, { timeout: 20000 }).catch(() => {});
    r = await pg.evaluate((s) => ({ tafel: !!(document.getElementById("lcTafel") && !document.getElementById("lcTafel").hidden), n: document.querySelectorAll(s).length }), sel);
    sage(da && r.tafel && r.n > 2, "Makroknopf „" + name + "“: Tafel auf und gleich der Ordner", JSON.stringify(r));
  }
  await pg.evaluate(() => { document.querySelectorAll(".lc-tafel-bildmappe").forEach((x) => x.remove()); try { window.LiveChat.schreiben("/tafel aus"); } catch (e) {} }); await tick(400);

  console.log("\nAUSSPRACHE IM SPIEL: NIVEAU UND PROZENT\n");
  await pg.evaluate(() => {
    const puffer = { length: 100, sampleRate: 16000, getChannelData: () => new Float32Array(100) };
    window.DMA_AUSSPR_BRUECKE = { original: () => Promise.resolve({ puffer: puffer, art: "azure" }) };
    window.AusspracheP = Object.assign({}, window.AusspracheP || {}, {
      mikrofonDa: () => true,
      aufnahmeStarten: (o) => { setTimeout(o.beiStille, 300); return Promise.resolve({ stoppen: () => Promise.resolve({ blob: new Blob(["x"]) }) }); },
      tonLesen: () => Promise.resolve(puffer), alsWav: () => new Blob(["wav"]), stufe1Da: () => true,
      stufe1Bewerten: () => Promise.resolve({ quelle: "azure", prozent: 73.2, woerter: [{ wort: "Schule", laute: [{ laut: "ʃ", note: 48 }, { laut: "uː", note: 92 }, { laut: "l", note: 81 }, { laut: "ə", note: 66 }] }] }),
      lautKlartext: (l) => "Dein " + l.laut + " war noch zu weit vorn."
    });
    window.__wortArgs = [];
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_aussprache_wort: (a) => { window.__wortArgs.push(a.p_niveau); return { ok: true, wort: "Schule", silben: "SCHU-le", niveau: a.p_niveau }; },
      spiel_aussprache_fertig: (a, ich) => Object.assign({}, ich, { ok: true, gewonnen: 3 })
    });
    try { localStorage.setItem("dma_spiel_niveau", "A1"); } catch (e) {}
    const S = window.DMA_SPIEL.pruef.zustand(); S.niveau = "A1"; S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true);
    S.deutschWahl = true; window.DMA_SPIEL.menue("deutsch");
  });
  await tick(500);
  await klick('#spPanel [data-tu="kategorie"][data-k="aussprache"]'); await tick(900);
  r = await pg.evaluate(() => ({ chips: [...document.querySelectorAll("#spPanel .sp-sprech-niveau button")].map((b) => b.textContent + (b.classList.contains("sp-an") ? "*" : "")) }));
  sage(r.chips.join(",") === "A1*,A2,B1,B2,C1,C2", "die Karte zeigt die Niveaus, A1 gewählt", r.chips.join(","));
  await tippe('#spPanel .sp-sprech-niveau [data-n="B1"]'); await tick(900);
  r = await pg.evaluate(() => ({ args: window.__wortArgs.slice(-1)[0], an: (document.querySelector("#spPanel .sp-sprech-niveau .sp-an") || {}).textContent, gemerkt: localStorage.getItem("dma_spiel_niveau") }));
  sage(r.args === "B1" && r.an === "B1" && r.gemerkt === "B1", "Tipp auf B1 holt ein Wort auf B1 und merkt es sich", JSON.stringify(r));
  const hoehe0 = await pg.evaluate(() => document.querySelector("#spPanel .sp-sprech").getBoundingClientRect().height);
  await tippe('#spPanel [data-tu="sprechen"]'); await tick(1600);
  r = await pg.evaluate(() => {
    const b = document.querySelector("#spPanel .sp-sprech-balken"), i = b && b.querySelector("i");
    return { balken: !!b, breite: i ? i.style.width : "", text: b ? b.textContent : "", laute: [...document.querySelectorAll("#spPanel .sp-sprech-laut")].map((l) => l.textContent + ":" + l.style.color),
      hoehe: document.querySelector("#spPanel .sp-sprech").getBoundingClientRect().height };
  });
  sage(r.balken && r.breite === "73%" && /73 %/.test(r.text), "nach dem Nachsprechen: Balken mit 73 %", JSON.stringify(r).slice(0, 160));
  sage(r.laute.length === 4 && /^ʃ:/.test(r.laute[0]) && new Set(r.laute.map((x) => x.split(":")[1])).size >= 2, "die Laute eingefärbt wie im Aussprachekurs (ʃ schwach, uː gut)", r.laute.join(" "));
  sage(Math.abs(r.hoehe - hoehe0) < 2, "die Karte springt nicht (gleiche Höhe vorher/nachher)", Math.round(hoehe0) + " → " + Math.round(r.hoehe));
  if (process.env.BILD) await (await pg.$("#spPanel .sp-sprech")).screenshot({ path: process.env.BILD + "-aussprache.png" });
  const kleinSp = await pg.evaluate(() => [...document.querySelectorAll("#spPanel .sp-sprech button")].filter((b) => { const q = b.getBoundingClientRect(); return q.width && q.height < 26; }).map((b) => b.textContent));
  sage(!kleinSp.length, "alle Knöpfe der Karte groß genug zum Tippen", kleinSp.join(","));

  console.log("\nTIPPS UND TRICKS AUF DER SEITE\n");
  r = await pg.evaluate(() => { const A = window.DMA_AUSSPRACHE; const t = A.TRICKS.de; const f = (id) => t.find((x) => x.id === id) || {};
    return { sch: !!(f("sch").svg && f("sch").svg2), stsp: !!(f("stsp").svg && f("stsp").svg2), r: !!f("r").svg, grafik: ["sch", "s", "st", "sp", "r"].filter((k) => A.GRAFIK[k]).length }; });
  sage(r.sch && r.stsp && r.r && r.grafik === 5, "Aussprachekurs: Tricks „SCH“ und „ST/SP“ mit je zwei Zungenbildern, „R“ mit Bild", JSON.stringify(r));

  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.slice(0, 2).join(" | "));
  if (klein.length) console.log("  (Hinweis: kleine Leistenknöpfe " + klein.join(",") + ")");
  await br.close(); srv.close();
  console.log("\nFassung 771 (Funk 195): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
