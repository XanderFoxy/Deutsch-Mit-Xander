#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 642: DÖNER-KATAPULT, MG, LASER-SALVE, FEINES KRAUT, DRACHE
   ---------------------------------------------------------------------
   XANDER (25.09.): „Döner Katapult … realistisch" · „Laser Salven,
   Maschinengewehr … Turrican-mäßig" · „das Sauerkraut kann feiner am
   Gesicht runterlaufen … viel zu breit" · „der Drache … Mega niedlich …
   merk dir den … filigraner … Struktur sehen".
   Server: spiel_waffe_schaden/spiel_kaufen kennen doener (13/70),
   mg (12/110), lasersalve (10/80); alle drei nutzen sich ab.
   Hier der BROWSER:
     · Döner gezeichnet (Brot, Fleisch, Salat, Tomate, Zwiebel, Soße),
       fliegt im hohen Bogen, Katapult- und Klatsch-Ton
     · MG: sechs Kugeln, Laser-Salve: drei Blitze, jeweils mit Ton
     · Sauerkraut: viele dünne Fäden (höchstens 1 breit)
     · der Drache blinzelt und hat Schuppen und Flügeladern
     · Menü → Waffen hat die Gruppe „Arcade"
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
                  vorraete: { bratwurst: 2, sauerkraut: 1 }, haustier: "fellmonster", haustier_leben: 30, haustier_max: 40, haustier_stufe: 2,
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
  });
  await pg.waitForTimeout(800);

  console.log("\nDÖNER, MG, LASER-SALVE\n");
  const d = await pg.evaluate(() => {
    const s = window.DMA_SPIEL.pruef.geschossSvg("doener");
    return { lang: s.length, teile: ["#6f3b1c", "#5fae3a", "#e0342a", "#9c3b8a", "#fbf6e6", "#e9c27e"].every((f) => s.includes(f)) };
  });
  sage(d.teile, "der Döner ist gezeichnet: Brot, Fleisch, Salat, Tomate, Zwiebel, Soße", d.lang + " Zeichen");
  const flug = await pg.evaluate(async () => {
    const aus = {};
    for (const w of ["doener", "mg", "lasersalve"]) {
      window.DMA_TONLOG = []; let max = 0, hoch = 1e9;
      const t0 = performance.now();
      const dauer = window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", w, 0, 0, "");
      while (performance.now() - t0 < dauer + 250) {
        const g = document.querySelectorAll(".sp-g-" + w);
        max = Math.max(max, g.length);
        g.forEach((x) => { hoch = Math.min(hoch, x.getBoundingClientRect().top); });
        await new Promise((r) => setTimeout(r, 15));
      }
      const a = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis').getBoundingClientRect();
      aus[w] = { max, ton: (window.DMA_TONLOG || []).map((t) => t.name || t).join(","), ueber: Math.round(a.top - hoch) };
    }
    return aus;
  });
  sage(/katapult4/.test(flug.doener.ton) && /doenerklatsch/.test(flug.doener.ton), "Döner: Katapult- und Klatsch-Ton", flug.doener.ton);
  sage(flug.doener.ueber > 20, "der Döner fliegt im hohen Bogen", flug.doener.ueber + " px über dem Bild");
  sage(flug.mg.max >= 4 && /mgsalve/.test(flug.mg.ton), "MG: mehrere Kugeln gleichzeitig in der Luft, Salven-Ton", flug.mg.max + " · " + flug.mg.ton);
  sage(flug.lasersalve.max >= 2 && /lasersalve/.test(flug.lasersalve.ton) && /lasertreffer/.test(flug.lasersalve.ton), "Laser-Salve: mehrere Blitze, eigener Ton", flug.lasersalve.max + " · " + flug.lasersalve.ton);
  const gruppe = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mitspielen = true; S.schnellMenue = true; S.schnellReiter = "waffen";
    window.DMA_SPIEL.pruef.schnellZeichnen();
    const g = [...document.querySelectorAll(".sp-sm-gruppe")].map((x) => x.querySelector("span").textContent + ":" + [...x.querySelectorAll("[data-w]")].map((b) => b.dataset.w).join("+"));
    S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen();
    return g;
  });
  sage(gruppe.some((g) => /^Arcade:lasersalve\+mg$/.test(g)) && gruppe.some((g) => /^Lustig:.*doener/.test(g)), "Menü: Gruppe „Arcade“ (Laser-Salve, MG), Döner bei „Lustig“", gruppe.join(" | "));

  console.log("\nFEINES SAUERKRAUT\n");
  const kraut = await pg.evaluate(() => {
    window.DMA_SPIEL.pruef.krautZeigen("bea");
    const p = [...document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-kraut path')];
    const faeden = p.filter((x) => !/rgba/.test(x.getAttribute("stroke") || ""));
    const breit = Math.max(...faeden.map((x) => Number(x.getAttribute("stroke-width"))));
    document.querySelectorAll(".sp-kraut-sicht").forEach((x) => x.remove());
    return { n: faeden.length, breit };
  });
  sage(kraut.n >= 15 && kraut.breit <= 1.01, "viele dünne Fäden statt breiter Streifen", kraut.n + " Fäden, höchstens " + kraut.breit + " breit");

  console.log("\nDER DRACHE: STRUKTUR UND BLINZELN\n");
  const dr = await pg.evaluate(async () => {
    const s = window.DMA_SPIEL.pruef.tierSvg("drache");
    const hatBlinzeln = /sp-blinzeln/.test(s);
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-flugtier .sp-blinzeln ellipse');
    let zu = false;
    if (k) { const t0 = performance.now(); while (performance.now() - t0 < 4600) { const m = new DOMMatrix(getComputedStyle(k).transform); if (m.d > 0.5) { zu = true; break; } await new Promise((r) => setTimeout(r, 20)); } }
    return { hatBlinzeln, zu, schuppen: (s.match(/q1 -\.8 2 0/g) || []).length, adern: /L75 12\.6/.test(s) };
  });
  sage(dr.hatBlinzeln && dr.zu, "der Drache blinzelt (Lid geht zu)", JSON.stringify(dr));
  sage(dr.schuppen >= 6 && dr.adern, "Schuppen und Flügeladern sind da");

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 642 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
