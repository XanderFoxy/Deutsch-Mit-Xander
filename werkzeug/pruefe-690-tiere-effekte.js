#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 690: DIE TIERE SPIELEN BEI DEN PROFILEFFEKTEN MIT
   ---------------------------------------------------------------------
   XANDER (Funk 137): „die Tiere sollen … auf die Effekte reagieren …
   aufsaugen und zurückspucken … lecken, schmatzen, rülpsen … hecheln
   wie ein Hund … ‚mmmh' … Euro-Scheine in den Augen … nass werden,
   schütteln, die anderen anspritzen … sich wundern, aufs leere Glas
   schauen … hochschauen und ‚wow' … Pflaster zufriedene Geräusche, die
   Sounds sollen variieren … Blume schnüffeln … Klaps … tanzen …
   zuschauen, aber auf dem Platz bleiben."
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
  /* Beide sichtbar: Tiere zeigen, mitspielen. Alex: Fellmonster + Babydrache; Bea: Chihuahua + Babydrache. */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.stand["11111111-1111-4111-8111-111111111111"].zeigen = { tiere: true };
    S.ich.mitspielen = true; S.ich.flugtier = "drache"; S.ich.flugtier_leben = 20; S.ich.flugtier_max = 20; S.ich.haustier = "fellmonster";
    S.stand[S.ich.id] = Object.assign({}, S.ich, { mitspielen: true }); window.DMA_SPIEL.pruef.zeichnen(); window.__tierReaktionen = []; });
  await tick(500);
  const probe = (chat, klasse, von, warte, blick) => pg.evaluate(([chat, klasse, von, warte, blick]) => new Promise((ok) => {
    const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + chat + '"]');
    pl.dataset.tierZeit = 0; window.DMA_TONLOG.length = 0; window.__tierReaktionen.length = 0;
    const gesehen = {};
    const merk = () => {
      pl.querySelectorAll(".sp-tier, .sp-flugtier").forEach((t) => t.classList.forEach((c) => { if (/^sp-tier-(saugt|spuckt|schnappt|lacht|hechelt|nass|schuettelt|wundert|hochgucken|schnueffelt|tanzt|guckt|schreck|zittert|hops|leckt|kuschelt|sucht|schwindelig|nickt|versteckt|glaenzt|kratzt|pustet|ekelt)$/.test(c)) gesehen[c] = 1; }));
      pl.querySelectorAll(".sp-tier-zusatz").forEach((z) => z.classList.forEach((c) => { if (c !== "sp-tier-zusatz") gesehen["zusatz:" + c] = 1; }));
      if (pl.querySelector(".sp-tier-zusatz .sp-tz-zunge")) gesehen["zunge"] = 1;
      if (pl.querySelector(".sp-tier-zusatz .sp-tz-glas")) gesehen["glas"] = 1;
      if (document.querySelector(".sp-spuckkugel-tier")) gesehen["spuckkugel"] = 1;
      if (document.querySelector(".sp-spuckfleck")) gesehen["spuckfleck"] = 1;
      if (document.querySelector(".sp-tier-spritzer, .sp-tier-spritzer-flug")) gesehen["spritzer"] = 1;
      if (pl.querySelector(".sp-tier-herz")) gesehen["herz"] = 1;
      document.querySelectorAll(".sp-text-puff, .sp-tier-sagt").forEach((p) => { gesehen["sagt:" + p.textContent] = 1; });
    };
    const uhr = setInterval(merk, 60);
    window.DMA_SPIEL.chatEffekt(pl, klasse, von);
    setTimeout(() => { clearInterval(uhr); ok({ art: (window.__tierReaktionen[0] || {}).art, gesehen: Object.keys(gesehen), ton: window.DMA_TONLOG.map((t) => t.name) }); }, warte);
  }), [chat, klasse, von, warte, blick]);
  const hat = (r, ...w) => w.every((x) => r.gesehen.includes(x) || r.ton.includes(x));
  const sagt = (r, re) => r.gesehen.some((g) => g.startsWith("sagt:") && re.test(g.slice(5)));

  console.log("\nFUNK 137: TIERE REAGIEREN AUF DIE PROFILEFFEKTE\n");
  let r = await probe("ich", "lc-sabber", "Bea", 3200);
  sage(r.art === "zurueckspucken" && hat(r, "sp-tier-saugt", "spuckkugel", "spuckfleck", "spuckkugel", "spucktreffer"), "Sabber: Tiere saugen auf und spucken Bea auf den Kopf zurück", JSON.stringify(r));
  const fleck = await pg.evaluate(() => true);
  r = await probe("ich", "lc-spucke", "Bea", 2600);
  sage(r.art === "schlucken" && hat(r, "sp-tier-schnappt", "zunge", "mampf", "stimme:schluck"), "Spucke: fangen und schlucken", JSON.stringify(r));
  r = await probe("ich", "lc-sahne", "Bea", 3000);
  sage(r.art === "schlecken" && hat(r, "sp-tier-leckt", "zunge", "lecken", "mampf", "ruelps", "herz") && sagt(r, /Rülps/), "Sahne: lecken, schmatzen, rülpsen", JSON.stringify(r));
  r = await probe("ich", "lc-streichel", "Bea", 1800);
  sage(r.art === "lieb" && hat(r, "sp-tier-hechelt", "zusatz:sp-tz-hechel", "stimme:hecheln", "stimme:mmh", "sp-tier-kuschelt") && sagt(r, /Mm|Hm/), "Streicheln: Fellmonster hechelt wie ein Hund, Babydrache macht „mmmh“", JSON.stringify(r));
  r = await probe("ich", "lc-muenze", "Bea", 1600);
  sage(r.art === "geld" && hat(r, "zusatz:sp-tz-geld", "sp-tier-hops", "bling"), "Münze: Euro-Scheine in den Augen, grinsen, Ka-tsching", JSON.stringify(r));
  const augen = await pg.evaluate(() => { window.DMA_SPIEL.chatEffekt(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'), "lc-zgeld", "Alex"); return true; });
  r = await probe("ich", "lc-eimer", "Bea", 3200);
  sage(r.art === "nass" && hat(r, "sp-tier-nass", "sp-tier-schuettelt", "stimme:schuetteln", "spritzer"), "Eimer: nass, schütteln sich, spritzen die anderen an", JSON.stringify(r));
  r = await probe("ich", "lc-strohhalm", "Bea", 2900);
  sage(r.art === "strohhalm" && hat(r, "sp-tier-wundert", "glas", "stimme:frage"), "Strohhalm: wundern sich, schauen aufs leere Glas", JSON.stringify(r));
  r = await probe("ich", "lc-blubber", "Bea", 2200);
  sage(r.art === "blubber" && hat(r, "sp-tier-hochgucken", "stimme:wow") && sagt(r, /Wow|Oooh/), "Blubbern: schauen hoch, „wow“", JSON.stringify(r));
  const t1 = await probe("ich", "lc-pflaster", "Bea", 1400), t2 = await probe("ich", "lc-pflaster", "Bea", 1400), t3 = await probe("ich", "lc-pflaster", "Bea", 1400);
  sage(t1.art === "pflaster" && hat(t1, "sp-tier-kuschelt"), "Pflaster: zufrieden", JSON.stringify(t1));
  const laute = new Set([t1, t2, t3].map((x) => x.ton.join("+") + [...x.gesehen].filter((g) => g.startsWith("sagt:")).join("")));
  sage(laute.size >= 2, "Pflaster: die Laute variieren", [...laute].join(" | "));
  r = await probe("ich", "lc-blume", "Bea", 2400);
  sage(r.art === "blume" && hat(r, "sp-tier-schnueffelt", "stimme:schnueffeln", "stimme:mmh"), "Blume: schnüffeln, zufrieden", JSON.stringify(r));
  r = await probe("ich", "lc-klaps", "Bea", 5800);
  sage(r.art === "klaps" && hat(r, "sp-tier-wundert", "popoklatsch", "stimme:kichern", "sp-tier-lacht") && sagt(r, /\?/) && sagt(r, /Au!/) && sagt(r, /Autsch/) && sagt(r, /Hi|He|Bwa/), "Klaps: erst verwundert, der Drache klapst dem Fellmonster auf den Po, das Fellmonster klapst zurück, dann lachen", JSON.stringify(r));
  await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); const h = document.createElement("span"); h.className = "lc-kopfhoerer"; pl.appendChild(h); window.__hoerer = h; });
  r = await probe("ich", "lc-kopfhoerer", "Bea", 1200);
  sage(r.art === "tanz" && hat(r, "sp-tier-tanzt", "zusatz:sp-tz-tanz"), "Kopfhörer: die Tiere tanzen", JSON.stringify(r));
  await pg.evaluate(() => window.__hoerer.remove()); await tick(1300);
  sage(await pg.evaluate(() => !document.querySelector("#lcPlaetze .sp-tier-tanzt")), "Kopfhörer ab: das Tanzen hört auf");
  r = await probe("ich", "lc-bowling", "Bea", 1200);
  sage(r.art === "zuschauen" && hat(r, "sp-tier-guckt"), "Bowling: sie schauen zu und bleiben am Platz", JSON.stringify(r));
  r = await probe("ich", "lc-zaubertrick", "Bea", 1500);
  sage(r.art === "staunen" && hat(r, "sp-tier-hochgucken"), "Zaubertrick: sie staunen", JSON.stringify(r));
  r = await probe("ich", "lc-wecker", "Bea", 900);
  sage(r.art === "erschrecken" && hat(r, "sp-tier-schreck"), "Wecker: sie erschrecken", JSON.stringify(r));
  r = await probe("ich", "lc-schnee", "Bea", 1200);
  sage(r.art === "frieren" && hat(r, "sp-tier-zittert"), "Schnee: sie zittern", JSON.stringify(r));
  r = await probe("ich", "lc-ohrfeige", "Bea", 900);
  sage(r.art === "wurf" && hat(r, "sp-tier-hops"), "Ohrfeige: aufspringen und knurren", JSON.stringify(r));
  console.log("\nFASSUNG 691: EIGENE REAKTIONEN FÜR DIE ÜBRIGEN EFFEKTE\n");
  for (const [klasse, art, merkmal, was] of [
    ["lc-wasch", "schwindelig", "sp-tier-schwindelig", "Waschmaschine: den Tieren wird schwindelig (Sterne)"],
    ["lc-sobri", "cool", "sp-tier-nickt", "Sonnenbrille: die Tiere bekommen auch eine und nicken cool"],
    ["lc-rollo", "kuckuck", "sp-tier-versteckt", "Rollo: verstecken, dann „Kuckuck!“"],
    ["lc-putzen", "blank", "sp-tier-glaenzt", "Putzen: die Tiere glänzen mit"],
    ["lc-kratzen", "jucken", "sp-tier-kratzt", "Kratzen: den Tieren juckt es auch"],
    ["lc-brand", "loeschen", "sp-tier-pustet", "Feuer: „Feuer!“, dann pusten sie es aus"],
    ["lc-vogelkot", "ekel", "sp-tier-ekelt", "Vogelkot: „Bäh!“"],
    ["lc-paintfleck", "farbe", "sp-tier-hops", "Farbklecks: die Tiere werden auch bunt"],
    ["lc-hut", "hut", "sp-tier-nickt", "Cowboyhut: die Tiere bekommen kleine Hüte"],
    ["lc-gesicht", "lachen", "sp-tier-lacht", "Grimasse: die Tiere lachen"],
    ["lc-platte", "tanzkurz", "sp-tier-tanzt", "Schallplatte: kurz tanzen"],
    ["lc-zorro", "zorro", "sp-tier-schreck", "Zorro: erst erschrecken, dann „Olé!“"],
    ["lc-zei", "schlecken", "sp-tier-leckt", "Ei auf dem Kopf: die Tiere schlecken es ab"],
    ["lc-zhammer", "schwindelig", "sp-tier-schwindelig", "Hammer: Sterne vor den Augen"]]) {
    const q = await probe("ich", klasse, "Bea", 2300);
    sage(q.art === art && hat(q, merkmal) && q.gesehen.some((g) => g.startsWith("sagt:")), was, JSON.stringify(q).slice(0, 260));
  }
  console.log("\nDIE TIERE KOMMEN MIT\n");
  r = await probe("ich", "lc-heber", "Bea", 900);
  const mit = await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    const d = [...document.querySelectorAll(".sp-tier-begleiter")].map((e) => e.getBoundingClientRect());
    return { doppel: d.length, versteckt: pl.classList.contains("sp-tier-reist"), passt: d.every((b) => Math.abs(b.width - k.width) < k.width * 0.5) }; });
  sage(r.art === "mitreisen" && mit.doppel === 2 && mit.versteckt, "Angel/Kran: die Tiere halten sich fest und kommen mit (Doppelgänger am Bild)", JSON.stringify(mit));
  await tick(4300);
  sage(await pg.evaluate(() => !document.querySelector(".sp-tier-begleiter") && !document.querySelector("#lcPlaetze .sp-tier-reist")), "danach sitzen sie wieder am Platz");
  r = await probe("ich", "lc-katapult", "Bea", 1400);
  sage(r.art === "suchen" && hat(r, "sp-tier-sucht") && sagt(r, /Wo|Hallo|Weg/), "Katapult: die Tiere bleiben und suchen auf dem Platz", JSON.stringify(r));
  await tick(2600);
  /* Die Lok fährt über Bea: die Tiere jagen hinterher. */
  const jagd = await pg.evaluate(() => new Promise((ok) => { window.DMA_TONLOG.length = 0;
    const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'); pl.dataset.tierJagd = 0; const k = pl.querySelector(".lc-kreis");
    k.classList.add("lc-ueberfahren"); setTimeout(() => k.classList.remove("lc-ueberfahren"), 900);
    setTimeout(() => ok({ bewegt: [...pl.querySelectorAll(".sp-tier, .sp-flugtier")].some((t) => t.getAnimations().length > 0), sagt: [...document.querySelectorAll(".sp-tier-sagt")].map((e) => e.textContent), ton: window.DMA_TONLOG.map((t) => t.name) }), 700); }));
  sage(jagd.bewegt && jagd.sagt.some((t) => /Wuff|Grrr|Halt|Rrrr/.test(t)) && jagd.ton.some((t) => /bellen|knurr|grummeln/.test(t)), "Fahrzeug fährt drüber: die Tiere jagen hinterher und knurren", JSON.stringify(jagd));
  await tick(1800);
  /* Reisen: der Platz ist unterwegs, das Bild bewegt sich — die Doppelgänger hängen dran; mit Beamen kommen sie kurz vertauscht an. */
  const reise = await pg.evaluate(() => new Promise((ok) => {
    const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'), k = pl.querySelector(".lc-kreis");
    const beam = document.createElement("span"); beam.className = "lc-beam"; beam.style.cssText = "position:absolute;left:0;top:0;width:30px;height:60px"; document.getElementById("lcPlaetze").appendChild(beam);
    pl.classList.add("lc-platz-unterwegs");
    k.animate([{ transform: "translate(0,0)" }, { transform: "translate(60px,20px)" }], { duration: 800, fill: "forwards" });
    setTimeout(() => {
      const kr = k.getBoundingClientRect(), d = [...document.querySelectorAll(".sp-tier-begleiter")];
      const boden = d.find((e) => e.classList.contains("sp-tier")), br = boden ? boden.getBoundingClientRect() : null;
      const erg = { doppel: d.length, folgt: br ? Math.abs(br.left - kr.left) < 12 && Math.abs(br.top - kr.top) < 12 : false, beamt: d.some((e) => e.classList.contains("sp-tier-beamt")), saeulen: document.querySelectorAll(".sp-tier-begleiter .sp-tier-beamsaeule").length };
      k.getAnimations().forEach((a) => a.cancel());
      pl.classList.remove("lc-platz-unterwegs");
      setTimeout(() => { erg.tausch = [...document.querySelectorAll(".sp-tier-sagt")].map((e) => e.textContent).filter((t) => /Hä|\?!/.test(t)); }, 900);
      setTimeout(() => { erg.weg = !document.querySelector(".sp-tier-begleiter"); beam.remove(); ok(erg); }, 2400);
    }, 900);
  }));
  sage(reise.doppel === 2 && reise.folgt, "unterwegs: die Tiere hängen am fahrenden Bild (folgen Bild für Bild)", JSON.stringify(reise));
  sage(reise.beamt && reise.saeulen === 2 && reise.tausch.length >= 1 && reise.weg, "Beamen: eigene Beam-Wirkung, kurz vertauscht, merken es, tauschen zurück", JSON.stringify(reise));
  const einzug = await pg.evaluate(() => new Promise((ok) => {
    window.DMA_AUFTRITT("ich", "sportwagen", "rein");
    setTimeout(() => { const d = [...document.querySelectorAll(".sp-tier-begleiter")], w = document.querySelector(".lc-auftritt-wagen");
      const wr = w ? w.getBoundingClientRect() : null, dr = d[0] ? d[0].getBoundingClientRect() : null;
      const erg = { doppel: d.length, imWagen: Boolean(wr && dr && dr.left + dr.width * 0.84 > wr.left && dr.left + dr.width * 0.84 < wr.right) };
      setTimeout(() => { erg.weg = !document.querySelector(".sp-tier-begleiter"); ok(erg); }, 3400);
    }, 1400);
  }));
  sage(einzug.doppel === 2 && einzug.imWagen && einzug.weg, "Einzug im Sportwagen: die Tiere sitzen auf dem Rücksitz und steigen nach mir aus", JSON.stringify(einzug));
  const magie = await pg.evaluate(() => new Promise((ok) => {
    window.DMA_AUFTRITT("ich", "zauber", "rein");
    setTimeout(() => { const d = [...document.querySelectorAll(".sp-tier-begleiter")]; const erg = { doppel: d.length, zauber: d.every((e) => e.classList.contains("sp-tier-zauber")), frueh: d.map((e) => Number(getComputedStyle(e).opacity).toFixed(2)) };
      setTimeout(() => { erg.spaeter = d.map((e) => Number(getComputedStyle(e).opacity).toFixed(2)); }, 1400);
      setTimeout(() => { erg.weg = !document.querySelector(".sp-tier-begleiter"); ok(erg); }, 2600); }, 600);
  }));
  sage(magie.doppel === 2 && magie.zauber && magie.frueh.every((o) => o < 0.2) && magie.spaeter.every((o) => o > 0.8) && magie.weg, "Magie: die Tiere kommen NACH mir aus dem Zauber", JSON.stringify(magie));
  console.log("\nFELLMONSTER-BISS: DIE ZÄHNE GEHEN MIT DEM MONSTER\n");
  const biss = await pg.evaluate(() => new Promise((ok) => {
    const Q = window.DMA_SPIEL.pruef; Q.tierAngriff("ich", "bea", "fellmonster");
    let zahnOhneTier = 0, zahnGesehen = 0;
    const uhr = setInterval(() => { const z = document.querySelector(".sp-bisszaehne"); if (!z) return; const o = Number(getComputedStyle(z).opacity); if (o > 0.5) { zahnGesehen++; if (!z.closest(".sp-tier-sprung")) zahnOhneTier++; } }, 40);
    setTimeout(() => { clearInterval(uhr); ok({ zahnGesehen, zahnOhneTier, rest: Boolean(document.querySelector(".sp-bisszaehne")) }); }, 5200);
  }));
  sage(biss.zahnGesehen > 3 && biss.zahnOhneTier === 0 && !biss.rest, "die Zähne sind nur da, solange das Monster beißt, und hängen an ihm", JSON.stringify(biss));
  if (process.env.BILD) {
    await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); pl.scrollIntoView({ block: "center" }); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-muenze", "Bea"); });
    await tick(1100);
    const k = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]').getBoundingClientRect(); return { x: Math.max(0, r.left - 20), y: Math.max(0, r.top - 30), width: r.width + 40, height: r.height + 50 }; });
    await pg.screenshot({ path: process.env.BILD + "-geld.png", clip: k });
    await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-sahne", "Bea"); });
    await tick(700);
    await pg.screenshot({ path: process.env.BILD + "-sahne.png", clip: k });
    await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-strohhalm", "Bea"); });
    await tick(2000);
    await pg.screenshot({ path: process.env.BILD + "-glas.png", clip: k });
    await pg.evaluate(() => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-klaps", "Bea"); });
    await tick(2450);
    await pg.screenshot({ path: process.env.BILD + "-klaps.png", clip: k });
    for (const [kl, name, ms] of [["lc-sobri", "brille", 1400], ["lc-hut", "hut", 1300], ["lc-wasch", "schwindel", 900]]) {
      await tick(2600);
      await pg.evaluate((kl) => { const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, kl, "Bea"); }, kl);
      await tick(ms);
      await pg.screenshot({ path: process.env.BILD + "-" + name + ".png", clip: k });
    }
  }
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | ").slice(0, 300));
  await br.close(); srv.close();
  console.log(fehler ? "\n  " + fehler + " FEHLER" : "\n  alles gut");
  process.exit(fehler ? 1 : 0);
})();
