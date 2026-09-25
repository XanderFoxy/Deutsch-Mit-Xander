#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 640: TURM, MAUER ZIEHT MIT, WAFFEN NUTZEN SICH AB
   ---------------------------------------------------------------------
   XANDER (Funk 112): „Die Mauer … Muß Entweder Bei Einem Bleiben Oder Da
   Wo Man Sie Aufgestellt Hat Und Sie Muß Einem So Lange Gehören Und
   Gegebenenfalls Wieder Aufstellbar Sein Bis Sie Zerstört Wird".
   (25.09.): „Geschütz … aufwerten können wie bei einem Tower …
   reparieren … Waffen … abnutzen … reparieren, ohne dass man das Spiel
   unterbrechen muss".
   Die Zahlen rechnet der Server (Probelauf mit Rollback: stumpfe
   Armbrust 12 → 6, Mauer im Aufbau fängt nichts ab, Geschütz nicht
   doppelt kaufbar, Stufe 2 = 16 Schuss, Reparatur nur wenn nötig).
   Hier der BROWSER:
     · Schraubenschlüssel in der Leiste, sobald eine Waffe ≤ 15 hält;
       ein Tipp repariert (ohne Menü)
     · stumpfe Waffe (0) sieht man in der Leiste und im Waffen-Reiter
     · Turm-Zeile: Nachladen und nächste Stufe statt neu kaufen
     · Platzwechsel mit Mauer: Server gefragt, die Mauer baut sich sichtbar
       wieder auf
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
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille", "bogen", "laser", "huehnerwerfer", "brezel", "bierkrug", "spaetzle"], mission: null, mana: 40, mana_max: 100, mitspielen: true,
                  level: 3, xp: 260, xp_stufe: 300 - 200, xp_naechste: 300, skill_frei: 1, skills: { zaehigkeit: 1 }, training: null,
                  ladung: 40, helm: 0, brust: 0, helm_stufe: 1, helm_halt: 10, brust_stufe: 0, brust_halt: 0,
                  vorraete: { bratwurst: 2, sauerkraut: 1 }, haustier: "fellmonster", haustier_leben: 5, haustier_max: 40, haustier_stufe: 2,
                  flugtier: null, flugtier_leben: 0, flugtier_max: 25, flugtier_stufe: 1,
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

  console.log("\nABNUTZUNG UND REPARATUR PER TIPP\n");
  const lei = await pg.evaluate(async () => {
    window.DMA_SPIEL.pruef.schnellZeichnen();
    const s = document.querySelector(".sp-schnell");
    const rep = s.querySelector('[data-s="reparieren"]');
    const stumpf = [...s.querySelectorAll(".sp-stumpf")].map((b) => b.dataset.w);
    window.__rufe.length = 0;
    if (rep) rep.click();
    await new Promise((r) => setTimeout(r, 250));
    const ruf = window.__rufe.find((r) => r.name === "spiel_kaufen");
    return { rep: Boolean(rep), stumpf, ruf: ruf ? ruf.args.p_ding : "", menue: !(document.getElementById("spPanel") && !document.getElementById("spPanel").hidden) };
  });
  sage(lei.rep, "Bierkrug hält nur noch 10 → Schraubenschlüssel in der Leiste");
  sage(lei.stumpf.join(",") === "spaetzle", "die stumpfe Spätzle-Kanone ist in der Leiste markiert", lei.stumpf.join(","));
  sage(lei.ruf === "waffen_reparatur" && lei.menue, "ein Tipp repariert – ohne Menü", lei.ruf);
  const wt = await pg.evaluate(() => window.DMA_SPIEL.pruef.menueInhalt("waffen"));
  sage(/stumpf – halber Schaden/.test(wt) && /hält noch 10\/60/.test(wt) && /Alle reparieren · 15/.test(wt), "Waffen-Reiter zeigt Haltbarkeit, stumpf und Reparatur");

  console.log("\nDER TURM\n");
  const turm = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand();
    const mit = window.DMA_SPIEL.pruef.turmZeile(S.ich);
    const ohne = window.DMA_SPIEL.pruef.turmZeile(Object.assign({}, S.ich, { geschuetz_ladungen: 0, geschuetz_stufe: 1 }));
    const fuenf = window.DMA_SPIEL.pruef.turmZeile(Object.assign({}, S.ich, { geschuetz_stufe: 5, geschuetz_ladungen: 28, geschuetz_max: 28 }));
    return { mit, ohne, fuenf };
  });
  sage(/Nachladen · 20/.test(turm.mit) && /Stufe 3 · 90/.test(turm.mit) && !/Kaufen · 60/.test(turm.mit), "mit Turm: Nachladen 20 und Stufe 3 für 90, kein Neukauf");
  sage(/Kaufen · 60/.test(turm.ohne) && !/Nachladen/.test(turm.ohne), "ohne Turm: Kaufen 60");
  sage(!/Stufe 6/.test(turm.fuenf) && !/Nachladen/.test(turm.fuenf), "Stufe 5 voll geladen: nichts mehr zu tun");

  console.log("\nDIE MAUER ZIEHT MIT UND BAUT SICH WIEDER AUF\n");
  const mauer = await pg.evaluate(async () => {
    window.DMA_SPIEL.pruef.zeichnen();
    const m = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-mauer');
    const svg = m && m.querySelector("svg");
    const h = () => svg.getBoundingClientRect().height;
    const frueh = svg ? h() : 0;
    await new Promise((r) => setTimeout(r, 2500));
    const spaeter = svg ? h() : 0;
    window.__rufe.length = 0;
    window.DMA_SPIEL.pruef.platzGewechselt();
    await new Promise((r) => setTimeout(r, 500));
    return { klasse: m ? m.className : "", frueh, spaeter, ruf: window.__rufe.some((r) => r.name === "spiel_platzwechsel") };
  });
  sage(/sp-mauer-aufbau/.test(mauer.klasse), "Beas Mauer ist im Aufbau", mauer.klasse);
  sage(mauer.spaeter > mauer.frueh * 1.5, "sie wächst sichtbar hoch", mauer.frueh.toFixed(1) + " → " + mauer.spaeter.toFixed(1) + " px");
  sage(mauer.ruf, "mein Platzwechsel mit Mauer fragt den Server (sie zieht mit)");

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 640 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
