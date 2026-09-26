#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 673: WASSERGRABEN NUR EINMAL, DEUTSCH-FENSTER KOMPAKT,
   FUNDSTÜCK IMMER ERREICHBAR
   ---------------------------------------------------------------------
   XANDER: „der Wassergraben … egal wo ich mich hinsetze, taucht der
   plötzlich auf … ich hab den hier zweimal" · „wenn ich im Deutsch
   Lernmenü bin und dann taucht oben plötzlich was zum einsammeln auf
   dann komme ich nicht schnell genug auf die Oberfläche zurück" ·
   „beim klicken auf das leere im Hintergrund" · „direkt auf das
   Hauptmenü" · „dass die Kartoffel angelegt ist … Diese Zeile könnte man
   rausnehmen" · „komprimieren".
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
      else if (name === "spiel_trophaeen") data = window.__troph || { ok: true, liste: [], neu: [], lohn: 0 };
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
  const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  const seite = (chat) => pg.evaluate((c) => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + c + '"] .lc-kreis'); if (!k) return null; const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, chat);

  console.log("\nWASSERGRABEN NUR AM EIGENEN PLATZ\n");
  const graben = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.graben = 3; S.stand[S.ich.id].graben = 3;
    /* Ein Rest vom alten Platz, wie er bis 672 liegen blieb. */
    const leer = [...document.querySelectorAll("#lcPlaetze .lc-platz")].find((p) => !p.dataset.lcId && p.querySelector(".lc-kreis"));
    const rest = document.createElement("span"); rest.className = "sp-wassergraben"; leer.appendChild(rest);
    window.DMA_SPIEL.pruef.zeichnen();
    await new Promise((r) => setTimeout(r, 200));
    const ruhig = { alle: document.querySelectorAll("#lcPlaetze .sp-wassergraben").length, restDa: rest.isConnected };
    /* FASSUNG 678 — XANDER: „immer noch diesen Fluss … egal wo ich hingehe". Er zeigt sich nur, wenn er ein Beben schluckt. */
    S.grabenBis = { [S.ich.id]: Date.now() + 6000 };
    window.DMA_SPIEL.pruef.zeichnen();
    await new Promise((r) => setTimeout(r, 200));
    return { ruhig, alle: document.querySelectorAll("#lcPlaetze .sp-wassergraben").length,
             eigen: document.querySelectorAll("#lcPlaetze .lc-platz-ich .sp-wassergraben").length };
  });
  sage(graben.ruhig.alle === 0 && !graben.ruhig.restDa, "ohne Beben liegt KEIN Graben am Platz (auch kein Rest am alten Platz)", JSON.stringify(graben));
  sage(graben.alle === 1 && graben.eigen === 1, "schluckt er ein Beben, zeigt er sich einmal – an meinem Platz", JSON.stringify(graben));

  console.log("\nDAS DEUTSCH-FENSTER\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.waffe = "kartoffel"; window.DMA_SPIEL.menue("deutsch"); });
  await tick(400);
  const fenster = await pg.evaluate(() => {
    const p = document.getElementById("spPanel"), st = p.querySelector(".sp-status");
    const w = p.querySelector(".sp-status-werte");
    return { text: st.textContent, statusHoch: Math.round(st.getBoundingClientRect().height), zeilen: p.querySelectorAll(".sp-status-zeile").length,
             haupt: Boolean(p.querySelector('[data-tu="haupt"]')), umbruch: getComputedStyle(w).flexWrap, quer: w.scrollWidth - w.clientWidth,
             balken: p.querySelectorAll(".sp-status > .sp-status-lp").length, ab: Boolean(p.querySelector('[data-tu="fensterab"]')),
             /* FASSUNG 682 — XANDER: „das Panel mit dem Niveau und den Aufgaben unten hinlegen, die eigentliche Aufgabe oben". Mit Aufgabe: Aufgabe zuerst, Wahl eingeklappt; ohne Aufgabe: Wahl offen. */
             reihenfolge: (() => { const inh = p.querySelector(".sp-inhalt"), c = inh.querySelector(".sp-chips"), a = inh.querySelector(".sp-aufgabe"), w = inh.querySelector(".sp-deutsch-wahl");
               if (a) return Boolean(c && (a.compareDocumentPosition(c) & 4) && w && !w.classList.contains("sp-offen") && inh.querySelector('[data-tu="neuwahl"]'));
               return Boolean(w && w.classList.contains("sp-offen") && c); })(),
             fensterHoch: Math.round(p.getBoundingClientRect().height), bild: innerHeight, inhaltScrollt: getComputedStyle(p.querySelector(".sp-inhalt")).overflowY };
  });
  sage(!/angelegt/.test(fenster.text), "die Zeile „Kartoffel ist angelegt“ ist weg");
  /* FASSUNG 679 — XANDER: „Mache bitte wieder die erste Version von vorher … wo die Punkte und das alles untereinander steht". */
  sage(fenster.balken === 3 && fenster.umbruch === "wrap" && fenster.quer <= 1, "wie zuerst: LP, Level, Mana als Balken untereinander, die Werte brechen um", JSON.stringify(fenster));
  sage(!fenster.haupt && fenster.ab, "kein ☰; oben ▾ zum Ablegen und ✕ zum Schließen", JSON.stringify(fenster));
  sage(fenster.reihenfolge, "Deutsch: die Aufgabe steht oben, Niveau und Arten darunter (ohne Aufgabe offen)", JSON.stringify(fenster));

  console.log("\nFUNDSTÜCK, WÄHREND DAS FENSTER OFFEN IST\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.fundNaechst = 0; });
  await tick(1600);
  const fund = await pg.evaluate(() => ({ sack: Boolean(document.querySelector("#lcPlaetze .sp-fundsack")), panel: !document.getElementById("spPanel").hidden,
    knopf: Boolean(document.querySelector("#spPanel .sp-fund-knopf")), leiste: Boolean(document.querySelector('[data-s="fund"]')) }));
  sage(fund.sack && fund.panel && fund.knopf, "ein Fundstück erscheint – oben im offenen Deutsch-Fenster leuchtet sofort „Fundstück“", JSON.stringify(fund));
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippe("#spPanel .sp-fund-knopf");
  await tick(300);
  const geholt = await pg.evaluate(() => ({ ruf: window.__rufe.some((r) => r.name === "spiel_fund_heben"), sack: Boolean(document.querySelector("#lcPlaetze .sp-fundsack")),
    panel: !document.getElementById("spPanel").hidden, aufgabe: window.__rufe.some((r) => r.name === "spiel_aufgabe") }));
  geholt.zeigt = await pg.evaluate(() => Boolean(document.querySelector("#lcPlaetze .sp-fundsack.sp-fund-zeigen")));
  /* FASSUNG 678 — XANDER: „man soll es nicht so einfach haben nur auf den Knopf zu drücken … Nur dass der Button … dieses Dialogfenster ablegt". */
  geholt.griff = await pg.evaluate(() => Boolean(document.querySelector('.sp-schnell [data-s="fensterauf"]')));
  sage(!geholt.ruf && geholt.sack && !geholt.panel && geholt.zeigt && geholt.griff, "der Knopf hebt NICHT auf: er legt das Fenster ab (Griff in der Leiste) und zeigt das Säckchen", JSON.stringify(geholt));
  await tippe('.sp-schnell [data-s="fensterauf"]');
  await tick(300);
  const wieder = await pg.evaluate(() => ({ offen: !document.getElementById("spPanel").hidden, deutsch: Boolean(document.querySelector('#spPanel .sp-tabs [data-tab="deutsch"].sp-an')), griff: Boolean(document.querySelector('.sp-schnell [data-s="fensterauf"]')) }));
  sage(wieder.offen && wieder.deutsch && !wieder.griff, "ein Tipp auf den Griff holt das Fenster zurück – im selben Reiter", JSON.stringify(wieder));

  console.log("\nTIPP NEBEN DAS FENSTER, HAUPTMENÜ\n");
  await pg.evaluate(() => window.DMA_SPIEL.menue("deutsch"));
  await tick(1200);   /* das weiche Scrollen zum Fundstück muss erst stehen */
  /* Das Säckchen weg: sonst hebt der Tipp daneben es womöglich auf (und das öffnet zu Recht die Artikel-Aufgabe). */
  await pg.evaluate(() => { document.querySelectorAll(".sp-fundsack").forEach((x) => x.remove()); const S = window.DMA_SPIEL.pruef.zustand(); S.fundPlatz = 0; S.fundNaechst = Date.now() + 999999; });
  const panelOben = await pg.evaluate(() => Math.round(document.getElementById("spPanel").getBoundingClientRect().top));
  await pg.touchscreen.tap(180, Math.max(10, panelOben - 30));
  await tick(300);
  const abgelegt = await pg.evaluate(() => ({ zu: document.getElementById("spPanel").hidden, griff: Boolean(document.querySelector('.sp-schnell [data-s="fensterauf"]')),
    ab: window.DMA_SPIEL.pruef.zustand().panelAbgelegt || "", leiste: (document.querySelector(".sp-schnell") || {}).hidden, fund: window.DMA_SPIEL.pruef.zustand().fundPlatz}));
  sage(abgelegt.zu && abgelegt.griff, "ein Tipp über dem Fenster legt es ab (Griff liegt in der Leiste)", JSON.stringify(abgelegt));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  /* Fundstück auch in der Schnellleiste. */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.fundNaechst = 0; S.fundBis = 0; });
  await tick(1600);
  sage(await pg.evaluate(() => Boolean(document.querySelector('[data-s="fund"]'))), "liegt ein Fundstück da, steht es auch in der Schnellleiste");

  if (process.env.BILD) { await pg.evaluate(() => window.DMA_SPIEL.menue("deutsch")); await tick(400); await pg.screenshot({ path: process.env.BILD }); }
  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 673: " + fehler + " rot." : "Fassung 673 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
