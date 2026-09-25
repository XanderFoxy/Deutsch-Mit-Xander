#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 646: TIERE VERLASSEN DEN PLATZ, LANGE ANGRIFFE,
   NEUE TIERE, KACHELN, KLEBEN BEIM PLATZWECHSEL
   ---------------------------------------------------------------------
   XANDER (25.09.): „wenn meine Tiere auf den Gegner losgehen, dann
   bleiben sie gleichzeitig mit an ihrem Platz" · „der Kleine muss sich
   richtig fest beißen … bisschen länger" · „der Drache … um den
   rumfliegen … von allen Seiten mit seinem Feuer" · „Schäferhund …
   Baby Fuchs … Fuchs … zauberhafte Wesen" · „die Tiere die ich schon
   gekauft hab die brauchen nicht doppelt in der Liste stehen" · „nicht
   richtig präsentiert in ihren Kacheln" · „das soll an mir kleben …
   niemals nachziehen oder nachspringen".
   Server (Rollback-Test): neue Tiere kaufen, doppelt verhindert,
   wechseln behält Kraft. Hier der BROWSER:
     · Bodentier: am Platz weg, solange es angreift; beißt ≥ 2,4 s
     · Drache: umkreist das Bild (≥ 300°), drei Feuerstrahlen mit Ton
     · alle neuen Tiere zeichnen sich; Kacheln zeigen den Ausschnitt
     · das Tier, das draußen ist, steht nur einmal in der Liste
     · nach dem Platzwechsel sitzt das Tier im SELBEN Bild am neuen
       Platz und ist am alten weg
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
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
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
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "cem" ? cemId : "");
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

  console.log("\nBODENTIER VERLÄSST SEINEN PLATZ\n");
  const boden = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef;
    window.DMA_TONLOG = [];
    const heim = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
    const vorher = getComputedStyle(heim.querySelector(".sp-tier")).visibility;
    const t0 = performance.now();
    P.tierAngriff("ich", "bea", "fellmonster");
    await new Promise((r) => setTimeout(r, 300));
    const waehrend = getComputedStyle(heim.querySelector(".sp-tier")).visibility;
    const springer = document.querySelectorAll(".sp-tier-sprung").length;
    let ende = 0;
    while (performance.now() - t0 < 4000) { if (!document.querySelector(".sp-tier-sprung")) { ende = performance.now() - t0; break; } await new Promise((r) => setTimeout(r, 30)); }
    const danach = getComputedStyle(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-tier')).visibility;
    return { vorher, waehrend, springer, ende: Math.round(ende), danach, ton: window.DMA_TONLOG.map((t) => t.name).join(",") };
  });
  sage(boden.vorher === "visible" && boden.waehrend === "hidden" && boden.springer === 1, "während des Angriffs ist das Tier NICHT mehr am eigenen Platz (kein Doppel)", JSON.stringify(boden));
  sage(boden.ende >= 2400 && boden.danach === "visible", "es beißt sich lange fest (≥ 2,4 s) und sitzt danach wieder am Platz", boden.ende + " ms");
  sage(/monsterbiss/.test(boden.ton), "der Biss klingt", boden.ton);

  console.log("\nDRACHE KREIST UND SPEIT FEUER\n");
  const drache = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef;
    window.DMA_TONLOG = [];
    const ziel = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis').getBoundingClientRect();
    const zx = ziel.left + ziel.width / 2, zy = ziel.top + ziel.height / 2;
    const heim = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
    const t0 = performance.now();
    P.tierAngriff("ich", "bea", "drache");
    const winkel = []; let strahlen = 0, gesehen = new Set(), weg = false;
    while (performance.now() - t0 < 3700) {
      const t = document.querySelector(".sp-tier-sprung .sp-tier-koerper");
      if (t) { const r = t.getBoundingClientRect(); winkel.push(Math.atan2(r.top + r.height / 2 - zy, r.left + r.width / 2 - zx)); }
      document.querySelectorAll(".sp-feuerstrahl").forEach((f) => { if (!gesehen.has(f)) { gesehen.add(f); strahlen++; } });
      if (performance.now() - t0 > 400 && performance.now() - t0 < 3000 && getComputedStyle(heim.querySelector(".sp-flugtier")).visibility === "hidden") weg = true;
      await new Promise((r) => setTimeout(r, 25));
    }
    /* Gesamtdrehung aufaddieren. */
    let dreh = 0;
    for (let i = 1; i < winkel.length; i++) { let d = winkel[i] - winkel[i - 1]; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; dreh += d; }
    return { grad: Math.round(Math.abs(dreh) * 180 / Math.PI), strahlen, weg, toene: window.DMA_TONLOG.filter((t) => t.name === "drachenpuste").length };
  });
  sage(drache.grad >= 300, "der Drache fliegt einmal ganz um das Bild herum", drache.grad + "°");
  sage(drache.strahlen === 3 && drache.toene >= 3, "drei Feuerstrahlen von verschiedenen Seiten, jeder mit (weichem) Feuerton", JSON.stringify(drache));
  sage(drache.weg, "der Drache ist dabei nicht mehr an seinem Platz");

  console.log("\nNEUE TIERE UND KACHELN\n");
  const neu = await pg.evaluate(() => {
    const P = window.DMA_SPIEL.pruef, aus = {};
    ["schaeferhund", "babyfuchs", "fuchs", "einhorn", "phoenix", "fee"].forEach((a) => {
      const s = P.tierSvg(a), k = P.tierSvg(a, true);
      aus[a] = { teile: (s.match(/<(path|ellipse|circle)/g) || []).length, kachel: /sp-kachel-svg/.test(k) && !/viewBox="0 0 100 100"/.test(k) };
    });
    return aus;
  });
  sage(Object.values(neu).every((x) => x.teile >= 10 && x.kachel), "Schäferhund, Babyfuchs, Fuchs, Einhorn, Phönix, Fee sind gezeichnet, Kacheln zeigen den Ausschnitt", JSON.stringify(neu));
  const liste = await pg.evaluate(() => {
    const html = window.DMA_SPIEL.pruef.menueInhalt("tiere");
    const box = document.createElement("div"); box.innerHTML = html;
    const namen = [...box.querySelectorAll(".sp-zeile b")].map((b) => b.textContent);
    return { fell: namen.filter((n) => n === "Fellmonster").length, drache: namen.filter((n) => n === "Babydrache").length,
             neu: ["Schäferhund", "Kleiner Fuchs", "Fuchs", "Einhorn", "Phönix", "Fee"].filter((n) => namen.indexOf(n) >= 0).length,
             gruppen: [...box.querySelectorAll(".sp-tier-gruppe")].map((g) => g.textContent).join("|"), kacheln: box.querySelectorAll("svg.sp-kachel-svg").length };
  });
  sage(liste.fell === 1 && liste.drache === 1, "das Tier draußen steht nur EINMAL in der Liste", JSON.stringify(liste));
  sage(liste.neu === 6 && /Deine Tiere/.test(liste.gruppen) && /Zu kaufen/.test(liste.gruppen), "die neuen Tiere sind kaufbar, getrennt: deine / zu kaufen", liste.gruppen);

  console.log("\nKLEBT BEIM PLATZWECHSEL\n");
  const kleben = await pg.evaluate(async () => {
    /* Ohne Mauer: sonst fragt platzGewechselt() den Server, und die
       (hier sofortige) Antwort zeichnet zufällig rechtzeitig neu. */
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mauer_lp = 0; S.stand[S.uid].mauer_lp = 0;
    await new Promise((r) => setTimeout(r, 800));
    const alt = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
    const altNr = alt.dataset.lcPlatz;
    const frei = [...document.querySelectorAll("#lcPlaetze .lc-platz")].find((p) => !p.dataset.lcId);
    const neuNr = frei.dataset.lcPlatz;
    window.LiveChat.platzNehmen(Number(neuNr));
    window.DMA_PRUEF.neuZeichnen();
    /* Genau ein Bild später — vor dem nächsten 0,7-s-Takt. */
    await new Promise((r) => requestAnimationFrame(() => r()));
    const neuEl = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + neuNr + '"]');
    const altEl = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + altNr + '"]');
    return { neuIch: neuEl.dataset.lcId === "ich", tierNeu: Boolean(neuEl.querySelector(".sp-tier")), flugNeu: Boolean(neuEl.querySelector(".sp-flugtier")),
             tierAlt: Boolean(altEl.querySelector(".sp-tier")), ringNeu: Boolean(neuEl.querySelector(".sp-lp")) };
  });
  sage(kleben.neuIch && kleben.tierNeu && kleben.flugNeu && kleben.ringNeu && !kleben.tierAlt, "im selben Bild: Tiere und Ring am neuen Platz, am alten nichts mehr", JSON.stringify(kleben));

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 646 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
