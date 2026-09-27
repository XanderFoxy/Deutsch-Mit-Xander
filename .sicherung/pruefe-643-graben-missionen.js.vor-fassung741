#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 643: GRABEN, SCHATZSUCHE, MISSIONEN, WERKSTATT
   ---------------------------------------------------------------------
   XANDER (25.09.): „mehr Arten von Missionen … Schatzsuche … man hat
   eine Schaufel und kann in den Plätzen graben … Bodenschätze … für
   Waffenproduktion".
   Server (Rollback-Test): spiel_graben, spiel_mission (5 Arten),
   spiel_schmieden. Hier der BROWSER:
     · Menü → Mehr → Graben nimmt die Schaufel, die Leiste zeigt sie
     · Tipp auf einen Platz gräbt dort (nicht hinsetzen), Ton „graben"
       und Schaufel zugleich, am UNTEREN Rand (Gesichtsmitte frei)
     · Fund steigt auf, Erz landet im Stand; doppelt tippen = 1 Loch
     · Schatzsuche: Reihe genannt, heiß/kalt nach jedem Loch
     · jede Missionsart hat ihren Text; erfüllt = Jubel
     · Werkstatt im Reiter Schutz schmiedet aus Erz
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

  console.log("\nSCHAUFEL NEHMEN\n");
  const nehmen = await pg.evaluate(() => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand();
    S.schnellMenue = true; S.schnellReiter = "mehr"; P.schnellZeichnen();
    const k = document.querySelector('.sp-schnellmenue [data-s="graben"]');
    const text = k ? k.textContent : "";
    if (k) k.click();
    return { text, an: Boolean(S.graben), klasse: document.body.classList.contains("sp-graben"),
             leiste: Boolean(document.querySelector('.sp-schnell .sp-s-graben')), zu: !S.schnellMenue };
  });
  sage(/Graben/.test(nehmen.text) && /4 Erz/.test(nehmen.text), "Menü → Mehr hat „Graben (Schaufel)“ mit Erz-Zahl", nehmen.text);
  sage(nehmen.an && nehmen.klasse && nehmen.leiste && nehmen.zu, "Schaufel in der Hand: Leiste zeigt sie, Menü klappt zu", JSON.stringify(nehmen));

  console.log("\nGRABEN AUF EINEM PLATZ\n");
  const grab = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef;
    window.__rufe = []; window.DMA_TONLOG = []; window.__fund = "erz";
    const knopf = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="7"]');
    const vorher = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]').dataset.lcPlatz;
    const t0 = performance.now();
    const genommen = P.tippAufPlatz(knopf, { nummer: 7, leer: true }, null);
    P.tippAufPlatz(knopf, { nummer: 7, leer: true }, null);
    const g = knopf.querySelector(".sp-grab"), kreis = knopf.querySelector(".lc-kreis");
    const kr = kreis.getBoundingClientRect(), gr = g ? g.getBoundingClientRect() : null;
    let fundZeit = 0;
    while (performance.now() - t0 < 1600) { if (knopf.querySelector(".sp-fund")) { fundZeit = performance.now() - t0; break; } await new Promise((r) => setTimeout(r, 20)); }
    /* Der Ton startet über setTimeout(0) — sein Zeitstempel zählt. */
    const tonZeit = (window.DMA_TONLOG.find((t) => t.name === "graben") || {}).wann;
    const fund = knopf.querySelector(".sp-fund");
    return { genommen, rufe: window.__rufe.filter((r) => r.name === "spiel_graben").map((r) => r.args),
             schaufel: Boolean(g && g.querySelector(".sp-grab-schaufel")), oben: gr ? Math.round(gr.top - (kr.top + kr.height / 2)) : null,
             tonAbstand: tonZeit != null ? Math.round(tonZeit - t0) : null, fundZeit: Math.round(fundZeit), fundText: fund ? fund.textContent : "",
             erz: window.DMA_SPIEL.pruef.zustand().ich.vorraete.erz, platzGleich: document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]').dataset.lcPlatz === vorher,
             hinweis: window.__hinweise.slice(-1)[0] || "" };
  });
  sage(grab.genommen && grab.platzGleich, "der Tipp gräbt – man setzt sich NICHT um");
  sage(grab.rufe.length === 1 && grab.rufe[0].p_platz === 7 && "p_raum" in grab.rufe[0], "genau ein Loch trotz Doppeltipp, Platz 7 mit Raum", JSON.stringify(grab.rufe));
  sage(grab.schaufel && grab.oben !== null && grab.oben > 0, "Schaufel sticht UNTER der Gesichtsmitte", grab.oben + " px unter der Mitte");
  sage(grab.tonAbstand !== null && grab.tonAbstand < 60, "Ton „graben“ startet mit der Schaufel", grab.tonAbstand + " ms");
  sage(grab.fundZeit >= 850 && /Erz/.test(grab.fundText), "der Fund steigt nach der Schaufel auf (0,9 s)", grab.fundZeit + " ms · " + grab.fundText);
  sage(grab.erz === 5 && /Erz/.test(grab.hinweis), "Erz landet im Stand, Hinweis sagt wofür", grab.erz + " · " + grab.hinweis);

  console.log("\nSCHATZSUCHE\n");
  await tick(300);
  const schatz = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand();
    window.__rufe = [];
    window.__mission = { art: "schatz", raum: "", platz: 6, reihe: 2, lohn: 25, bis: new Date(Date.now() + 600000).toISOString() };
    P.missionHolen();
    await new Promise((r) => setTimeout(r, 100));
    const ruf = window.__rufe.find((r) => r.name === "spiel_mission");
    const html = P.missionHtml(S.ich);
    const hinweise = [];
    for (const nr of [1, 5]) {
      window.__fund = "nichts";
      const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"]');
      P.tippAufPlatz(k, { nummer: nr }, null);
      await new Promise((r) => setTimeout(r, 1000));
      hinweise.push(window.__hinweise.slice(-1)[0]);
    }
    window.DMA_TONLOG = [];
    window.__fund = "schatz";
    P.tippAufPlatz(document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="6"]'), { nummer: 6 }, null);
    await new Promise((r) => setTimeout(r, 1000));
    P.zeichnen();
    return { args: ruf && ruf.args, html, hinweise, schatzHinweis: window.__hinweise.slice(-1)[0], tone: window.DMA_TONLOG.map((t) => t.name).join(","),
             karte: P.missionHtml(S.ich) };
  });
  sage(schatz.args && schatz.args.p_plaetze === 8 && "p_raum" in schatz.args && "p_ziel_name" in schatz.args, "Mission holen schickt Raum und Platzzahl", JSON.stringify(schatz.args));
  sage(/unteren Reihe/.test(schatz.html) && /data-tu="graben"/.test(schatz.html) && /Noch \d+ min/.test(schatz.html), "Karte: Reihe genannt, Schaufel-Knopf, Restzeit");
  sage(/Kalt/.test(schatz.hinweise[0]) && /Heiß/.test(schatz.hinweise[1]), "heiß und kalt nach dem Loch", schatz.hinweise.join(" | "));
  sage(/Schatz/.test(schatz.schatzHinweis) && (schatz.tone.match(/jubel/g) || []).length === 1, "Schatz gefunden: Hinweis und genau ein Jubel", schatz.schatzHinweis + " · " + schatz.tone);
  sage(/Mission holen/.test(schatz.karte), "danach ist wieder „Mission holen“ da");

  console.log("\nANDERE MISSIONEN\n");
  const arten = await pg.evaluate(() => {
    const P = window.DMA_SPIEL.pruef, bis = new Date(Date.now() + 600000).toISOString(), aus = {};
    [["serie", { rest: 2, lohn: 15 }], ["heiler", { lohn: 10 }], ["seite", { start: 100, ziel: 20, lohn: 12 }], ["neben", { ziel: "Bea", lohn: 8 }]].forEach(([a, x]) => {
      aus[a] = P.missionHtml({ mission: Object.assign({ art: a, bis }, x) }).replace(/<[^>]+>/g, "");
    });
    aus.abgelaufen = P.missionHtml({ mission: { art: "serie", rest: 3, lohn: 15, bis: new Date(Date.now() - 1000).toISOString() } }).replace(/<[^>]+>/g, "");
    return aus;
  });
  sage(/2 Aufgaben hintereinander/.test(arten.serie), "Serie zeigt, wie viele noch fehlen", arten.serie);
  sage(/Heile jemand anderen/.test(arten.heiler), "Heiler", arten.heiler);
  sage(/20 Punkte in den Übungen der Seite/.test(arten.seite) && !/neben/.test(arten.seite), "Seite (nicht mit „neben“ verwechselt)", arten.seite);
  sage(/neben Bea/.test(arten.neben), "neben jemandem", arten.neben);
  sage(/Mission holen/.test(arten.abgelaufen), "abgelaufene Mission: wieder „Mission holen“");
  const jubel = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand();
    window.DMA_TONLOG = [];
    S.missionAlt = { art: "serie", lohn: 15, bis: new Date(Date.now() + 600000).toISOString() }; S.ich.mission = null;
    P.missionPruefen();
    await new Promise((r) => setTimeout(r, 60));
    return { h: window.__hinweise.slice(-1)[0], t: window.DMA_TONLOG.map((t) => t.name).join(",") };
  });
  sage(/Mission geschafft: \+15/.test(jubel.h) && /jubel/.test(jubel.t), "vom Server erfüllte Mission: Jubel", jubel.h);

  console.log("\nWERKSTATT\n");
  const werk = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand();
    const html = P.menueInhalt("schutz");
    const box = document.createElement("div"); box.innerHTML = html;
    const knoepfe = [...box.querySelectorAll('[data-tu="schmieden"]')].map((b) => b.dataset.w + (b.disabled ? "-" : "+"));
    window.__rufe = []; window.DMA_TONLOG = [];
    const vorher = S.ich.pflaster;
    P.schmieden("pflaster");
    await new Promise((r) => setTimeout(r, 100));
    window.DMA_SPIEL.menue("schutz");
    const status = (document.querySelector(".sp-status") || {}).textContent || "";
    window.DMA_SPIEL.schliessen();
    return { knoepfe, ruf: window.__rufe.map((r) => r.name + ":" + (r.args.p_was || "")).join(","), ton: window.DMA_TONLOG.map((t) => t.name).join(","),
             pflaster: S.ich.pflaster - vorher, statusErz: /⛏️ \d+ Erz/.test(status), werkstatt: /Werkstatt/.test(html) };
  });
  sage(werk.werkstatt && werk.knoepfe.length === 3, "Reiter Schutz hat die Werkstatt mit drei Knöpfen", werk.knoepfe.join(" "));
  sage(/spiel_schmieden:pflaster/.test(werk.ruf) && /hammerschlag/.test(werk.ton) && werk.pflaster === 1, "Schmieden ruft den Server, Hammer klingt, Pflaster +1", werk.ruf + " · " + werk.ton);
  sage(werk.statusErz, "Erz steht in der Statuszeile");

  console.log("\nSCHAUFEL WEGLEGEN\n");
  const weg = await pg.evaluate(() => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand();
    document.querySelector('.sp-schnell .sp-s-graben').click();
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="7"]');
    window.__rufe = [];
    const genommen = P.tippAufPlatz(k, { nummer: 7, leer: true }, null);
    return { an: Boolean(S.graben), klasse: document.body.classList.contains("sp-graben"), genommen, rufe: window.__rufe.length };
  });
  sage(!weg.an && !weg.klasse && !weg.genommen && weg.rufe === 0, "weggelegt: ein Tipp auf den Platz ist wieder ein normaler Tipp", JSON.stringify(weg));
  if (process.env.BILD) {
    await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; P.grabenUmschalten(true); window.__fund = "truhe"; P.tippAufPlatz(document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="7"]'), { nummer: 7 }, null); });
    await tick(450); await pg.screenshot({ path: process.env.BILD + "-schaufel.png" });
    await tick(700); await pg.screenshot({ path: process.env.BILD + "-fund.png" });
  }

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 643 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
