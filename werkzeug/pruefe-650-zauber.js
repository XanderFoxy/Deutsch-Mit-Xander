#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 650: DIE ZAUBER (NEBEL, ERDBEBEN, ORKAN)
   ---------------------------------------------------------------------
   XANDER: „Zauber oder Erdbeben Orkane … Gegner von der Bildfläche
   werfen oder durcheinanderbringen … Nebeln" und Funk 125: „Updates ab
   einem bestimmten Level".
   Android-Telefon, echte Fingertipps:
     · Zauberstab in der Leiste öffnet das Zauberrad, ganz im Bild
     · gesperrte Zauber zeigen ihr Level und sagen es beim Tippen
     · Zauber wählen, auf ein Gesicht tippen: Server-Aufruf, Ereignis an
       alle, Ton und Bild am richtigen Platz
     · Nebel reist mit dem Platz, die Gesichtsmitte bleibt frei
     · Orkan: das Bild fliegt weg und sitzt danach genau wieder da
     · wer selbst verzaubert wird, bekommt Bescheid und sieht den Nebel
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
  const ctx = await br.newContext({ viewport: { width: 393, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
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
                  level: 7, ladung: 60, helm: 2, brust: 1, daemon: false };
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
  const hinweisSeit = () => pg.evaluate(() => window.__hinweise.length);
  const hinweiseAb = (n) => pg.evaluate((n) => window.__hinweise.slice(n).join(" | "), n);

  console.log("\nZAUBERRAD MIT LEVEL-SPERRE (Level 3, 40 Mana)\n");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  const stab = await pg.evaluate(() => Boolean(document.querySelector(".sp-schnell .sp-s-zauber")));
  sage(stab, "der Zauberstab steht in der Leiste");
  await tippe(".sp-schnell .sp-s-zauber");
  const zr = await pg.evaluate(() => {
    const r = document.querySelector(".sp-zauberrad"), stab = document.querySelector(".sp-s-zauber");
    if (!r) return { da: false };
    const k = [...r.querySelectorAll(".sp-rad-zauber")];
    const rr = r.getBoundingClientRect(), sr = stab.getBoundingClientRect();
    const tippbar = k.every((b) => { const q = b.getBoundingClientRect(); const o = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return o && (o === b || b.contains(o)); });
    return { da: true, n: k.length, imBild: rr.left >= 0 && rr.right <= innerWidth && rr.top >= 0, ueber: rr.bottom <= sr.top + 2, tippbar,
             zahlen: k.map((b) => b.dataset.z + ":" + b.textContent.trim()).join(" "), zu: k.filter((b) => b.classList.contains("sp-zu")).map((b) => b.dataset.z).join(",") };
  });
  sage(zr.da && zr.n === 3, "der Stab öffnet das Zauberrad mit drei Zaubern", zr.zahlen);
  sage(zr.imBild && zr.ueber && zr.tippbar, "das Rad steht über dem Stab, ganz im Bild, jeder Zauber erreichbar", JSON.stringify({ imBild: zr.imBild, ueber: zr.ueber, tippbar: zr.tippbar }));
  sage(zr.zu === "erdbeben,orkan" && /nebel:25/.test(zr.zahlen) && /erdbeben:Lv5/.test(zr.zahlen) && /orkan:Lv7/.test(zr.zahlen), "Level 3: Nebel offen (25 Mana), Erdbeben ab Lv 5, Orkan ab Lv 7 – Level steht dran");
  let h0 = await hinweisSeit();
  await tippe('.sp-zauberrad .sp-rad-zauber[data-z="erdbeben"]');
  const gesperrt = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().zauber);
  sage(gesperrt === "" && /ab Level 5/.test(await hinweiseAb(h0)), "Tipp auf einen gesperrten Zauber sagt, ab welchem Level", await hinweiseAb(h0));

  console.log("\nNEBEL AUF BEA\n");
  await tippe('.sp-zauberrad .sp-rad-zauber[data-z="nebel"]');
  const bereit = await pg.evaluate(() => ({ z: window.DMA_SPIEL.pruef.zustand().zauber, rad: Boolean(document.querySelector(".sp-zauberrad")),
    an: Boolean(document.querySelector(".sp-s-zauber.sp-an")), kampf: document.body.classList.contains("sp-kampf") }));
  sage(bereit.z === "nebel" && !bereit.rad && bereit.an, "Nebel ist bereit, das Rad zu, der Stab leuchtet", JSON.stringify(bereit));
  await pg.evaluate(() => { window.__rufe.length = 0; window.__raus.length = 0; window.DMA_TONLOG.length = 0; });
  const bea0 = await seite("bea");
  await pg.touchscreen.tap(bea0.x, bea0.y); await tick(900);
  const nebel = await pg.evaluate(() => {
    const ruf = window.__rufe.find((r) => r.name === "spiel_zaubern"), raus = window.__raus.find((p) => p && p.ereignis === "zauber");
    const n = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-nebel'), k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis');
    let mitteFrei = false;
    if (n) { const bg = getComputedStyle(n).backgroundImage; mitteFrei = /rgba\(222, 228, 235, 0\) 40%/.test(bg); }
    return { ruf: ruf && ruf.args, raus: raus && { sorte: raus.sorte, zielChat: raus.zielChat, dauer: raus.dauer }, nebel: Boolean(n), mitteFrei,
             toene: window.DMA_TONLOG.map((t) => t.name).join(","), zauber: window.DMA_SPIEL.pruef.zustand().zauber, mana: window.DMA_SPIEL.pruef.zustand().ich.mana };
  });
  sage(nebel.ruf && nebel.ruf.p_zauber === "nebel" && nebel.ruf.p_ziel === "11111111-1111-4111-8111-111111111111", "Tipp auf Bea ruft spiel_zaubern mit Nebel und Beas Spiel-Id", JSON.stringify(nebel.ruf));
  sage(nebel.raus && nebel.raus.sorte === "nebel" && nebel.raus.zielChat === "bea" && nebel.raus.dauer === 15, "alle im Raum bekommen das Zauber-Ereignis", JSON.stringify(nebel.raus));
  sage(nebel.nebel && nebel.mitteFrei, "Nebel liegt als Ring an Beas Platz, die Gesichtsmitte bleibt frei");
  sage(/swoosh/.test(nebel.toene), "der Nebel ist zu hören", nebel.toene);
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD.replace(/\.png$/, "-nebel.png"), clip: { x: 0, y: 0, width: 393, height: 200 } });
  sage(nebel.zauber === "" && nebel.mana === 15, "der Zauber ist verbraucht, Mana 40 → 15", JSON.stringify({ z: nebel.zauber, mana: nebel.mana }));

  console.log("\nERDBEBEN UND ORKAN (Level 8, 100 Mana)\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); window.__ich.level = 8; window.__ich.mana = 100; S.ich.level = 8; S.ich.mana = 100; S.zauber = "erdbeben"; window.DMA_TONLOG.length = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await pg.touchscreen.tap(bea0.x, bea0.y); await tick(250);
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD.replace(/\.png$/, "-beben.png"), clip: { x: 0, y: 0, width: 393, height: 200 } });
  const beben = await pg.evaluate(() => ({ bebt: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"].sp-bebt')), riss: Boolean(document.querySelector(".sp-beben-riss")),
    raum: document.getElementById("lcPlaetze").classList.contains("sp-raum-bebt"), toene: window.DMA_TONLOG.map((t) => t.name).join(",") }));
  await tick(700);
  const bebenZahl = await pg.evaluate(() => [...document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-zahl')].map((z) => z.textContent).join(" | "));
  sage(beben.bebt && beben.riss && beben.raum, "Erdbeben: Beas Platz bebt, der Boden reißt, der Raum ruckt kurz", JSON.stringify(beben));
  sage(/erdbeben/.test(beben.toene), "das Erdbeben ist zu hören", beben.toene);
  sage(/−10 Erdbeben/.test(bebenZahl), "die rote Zahl kommt mitten im Beben", bebenZahl);
  await tick(3200);
  const nachBeben = await pg.evaluate(() => ({ bebt: Boolean(document.querySelector(".sp-bebt")), riss: Boolean(document.querySelector(".sp-beben-riss")), wackel: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"].sp-w-wackel')) }));
  sage(!nachBeben.bebt && !nachBeben.riss && nachBeben.wackel, "nach 3,6 s ist das Beben vorbei, Bea zittert noch (6 s)", JSON.stringify(nachBeben));

  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.zauber = "orkan"; window.DMA_TONLOG.length = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await pg.touchscreen.tap(bea0.x, bea0.y); await tick(1500);
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD.replace(/\.png$/, "-orkan.png"), clip: { x: 0, y: 0, width: 393, height: 200 } });
  const orkan = await pg.evaluate(() => {
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis'), r = k.getBoundingClientRect();
    return { weg: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"].sp-weggeweht')), wirbel: Boolean(document.querySelector(".sp-orkan")),
             versetzt: Math.round(Math.abs(r.left + r.width / 2 - innerWidth / 2)), toene: window.DMA_TONLOG.map((t) => t.name).join(",") };
  });
  sage(orkan.weg && orkan.wirbel, "Orkan: ein Wirbel steht am Platz, Beas Bild wird vom Platz gerissen", JSON.stringify(orkan));
  sage(/orkan/.test(orkan.toene), "der Orkan ist zu hören", orkan.toene);
  await tick(2600);
  const bea1 = await seite("bea");
  const reste = await pg.evaluate(() => ({ weg: Boolean(document.querySelector(".sp-weggeweht")), wirbel: Boolean(document.querySelector(".sp-orkan")) }));
  /* Bea taumelt danach noch (Wackeln: ±1 px, ±0,6°) – deshalb 3 px Spielraum. */
  sage(!reste.weg && !reste.wirbel && Math.abs(bea1.x - bea0.x) < 3 && Math.abs(bea1.y - bea0.y) < 3, "nach 3,8 s sitzt Bea wieder auf ihrem Platz (nur das Taumeln bleibt), kein Rest",
       JSON.stringify({ vorher: bea0, nachher: bea1, reste }));

  console.log("\nWER VERZAUBERT WIRD\n");
  h0 = await hinweisSeit();
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "nebel", von: "bea", zielChat: "ich", dauer: 15, schaden: 0 }); });
  await tick(300);
  const ich = await pg.evaluate(() => ({ sicht: document.body.classList.contains("sp-ich-nebel"), nebel: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-nebel')),
    unscharf: getComputedStyle(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis')).filter }));
  sage(ich.sicht && ich.nebel && /blur/.test(ich.unscharf), "im Nebel: Nebel an meinem Platz, die anderen verschwimmen", JSON.stringify(ich));
  sage(/Nebel!.*60 %/.test(await hinweiseAb(h0)), "ich bekomme gesagt, was der Nebel macht", await hinweiseAb(h0));

  console.log("\nSPÄTER DAZUGEKOMMEN\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); const id = "22222222-2222-4222-8222-222222222222"; S.stand[id] = Object.assign({}, S.stand[id], { mitspielen: true, nebel_s: 5 }); window.DMA_SPIEL.pruef.zeichnen(); });
  await tick(200);
  sage(await pg.evaluate(() => Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="cem"] .sp-nebel'))), "wer später kommt, sieht den laufenden Nebel aus dem Stand (nebel_s)");

  console.log("\nMENÜ „MEHR“\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.level = 5; S.schnellReiter = "mehr"; });
  const mehr = await pg.evaluate(() => window.DMA_SPIEL.pruef.schnellMenueHtml());
  sage(/Nebel <small>25 Mana/.test(mehr) && /Erdbeben <small>35 Mana/.test(mehr) && /Orkan <small>ab Level 7/.test(mehr), "„Mehr“ zeigt alle Zauber mit Mana oder Level");
  if (process.env.BILD) { await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.zrad = true; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(300); await pg.screenshot({ path: process.env.BILD }); }

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 650 auf dem Telefon: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
