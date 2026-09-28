#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 794: DIE HAUSTIERE REISEN WIRKLICH MIT
   ---------------------------------------------------------------------
   XANDER (Walkie 259): „meine Haustiere bleiben noch zurück auf meinem
   Abfahrtsplatz verbessere das mal bitte auch in sämtlichen anderen
   Animationen die zur Reise gehören".
   Gemessen je Reise (echte Wirkung, kein Nachbau): unterwegs sind die
   Doppelgänger der Tiere SICHTBAR und NICHT mehr am Abfahrtsplatz; am
   Ende sind sie weg (gelandet), nichts bleibt hängen.
   AUFRUF: node werkzeug/pruefe-794-tiere-reisen.js [art,art,…]
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
  await tick(500);
  const einzeln = {};
  const ARTEN = (process.argv[2] || "flug,greifvogel,boot,delfin,kran,dampfer,lok,liane,feder,frosch,zylinder,fahrstuhl,beamen,rohr,maulwurf,heli,pferd,turm,untertasse,mieze,frisbee,gotteshand,portal").split(",");
  /* Sequenzen (gemalte Wege): „art@7" fährt eine Kette über sieben Stationen. */
  if (!process.argv[2]) ARTEN.push("lok@7", "flug@7", "boot@7", "feder@7");
  for (const art0 of ARTEN) {
    const art = art0.split("@")[0], stationen = Number(art0.split("@")[1]) || 0;
    const r = await pg.evaluate(([art, stationen]) => new Promise((ok) => {
      const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
      if (!pl || !pl.querySelector(".sp-tier")) return ok({ fehler: "keine Tiere am Platz" });
      const nr = pl.dataset.lcPlatz;
      const andere = [...document.querySelectorAll("#lcPlaetze .lc-platz")].map((p) => p.dataset.lcPlatz).filter((n) => n && n !== nr);
      let ziel = andere[andere.length - 1];
      if (stationen) {
        const kette = [nr];
        for (let i = 1; i < stationen; i++) kette.push(andere[(i * 2) % andere.length] === kette[i - 1] ? andere[(i * 2 + 1) % andere.length] : andere[(i * 2) % andere.length]);
        ziel = kette.join("-");
      }
      const start = pl.querySelector(".lc-kreis").getBoundingClientRect();
      const name = (pl.querySelector(".lc-platz-name") || {}).textContent || "Alex";
      window.DMA_PRUEFUNG.wirkung(art, ziel, name.trim());
      const t0 = performance.now();
      /* Gezählt wird nur, solange die Reise läuft (der Abfahrtsplatz ist
         noch „unterwegs"): wie viele Bilder die Tiere zu sehen sind und wie
         viele davon weg vom Abfahrtsplatz. Danach: wie lange sie noch
         nachhängen, bis sie gelandet sind. */
      let maxWeg = 0, bilder = 0, sichtbar = 0, sichtbarWeg = 0, jeGesehen = 0, reiseEnde = 0;
      (function schau() {
        const t = performance.now() - t0;
        const d = [...document.querySelectorAll(".sp-tier-begleiter")];
        const unterwegs = pl.isConnected && pl.classList.contains("lc-platz-unterwegs");
        if (d.length) jeGesehen = Math.max(jeGesehen, d.length);
        if (unterwegs && d.length) {
          bilder++;
          const e = d.find((x) => !x.classList.contains("sp-flugtier")) || d[0];
          const r = e.getBoundingClientRect(), o = Number(getComputedStyle(e).opacity);
          const weg = Math.hypot(r.left - start.left, r.top - start.top);
          if (o > 0.15) { sichtbar++; maxWeg = Math.max(maxWeg, weg); if (weg > 30) sichtbarWeg++; }
        }
        if (!unterwegs && !reiseEnde && t > 300) reiseEnde = t;
        if (t < 30000 && (t < 800 || d.length || unterwegs)) { requestAnimationFrame(schau); return; }
        ok({ doppel: jeGesehen, maxWeg: Math.round(maxWeg), sichtbarAnteil: bilder ? Math.round(100 * sichtbar / bilder) : 0,
             wegAnteil: bilder ? Math.round(100 * sichtbarWeg / bilder) : 0, reise: Math.round(reiseEnde), nachhaengen: Math.round(t - (reiseEnde || t)),
             rest: document.querySelectorAll(".sp-tier-begleiter").length, ziel: ziel });
      })();
    }), [art, stationen]);
    /* Beamen, Tor und Maulwurf: das Bild ist einen Teil der Reise ganz weg
       (im Strahl, im Tor, unter der Erde) — dort dürfen die Tiere auch weg sein. */
    const kurz = /^(beamen|portal|maulwurf|rohr|zylinder)$/.test(art);
    sage(!r.fehler && r.doppel >= 2 && r.sichtbarAnteil >= (kurz ? 25 : 60) && r.wegAnteil >= (kurz ? 10 : 30) && r.maxWeg > 40 && r.nachhaengen < (art === "beamen" ? 2600 : 1500) && r.rest === 0,
      art0 + ": die Tiere reisen sichtbar mit und landen gleich", JSON.stringify(r));
    if (!stationen) einzeln[art] = r.reise;
    /* Tempo: eine Kette über sieben Stationen darf nicht so kurz sein wie
       ein Katzensprung (dann rast das Fahrzeug) — FASSUNG 794. */
    else sage(r.reise > 1.8 * (einzeln[art] || 3000), art0 + ": die lange Kette dauert länger (normales Tempo)", r.reise + " ms statt " + einzeln[art] + " ms für eine Station");
    await pg.evaluate(() => { try { window.DMA_PRUEF.neuZeichnen(); window.DMA_SPIEL.pruef.zeichnen(); } catch (e) {} });
    await tick(700);
  }
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | ").slice(0, 300));
  await br.close(); srv.close();
  console.log(fehler ? "\n  " + fehler + " FEHLER" : "\n  alles gut");
  process.exit(fehler ? 1 : 0);
})();
