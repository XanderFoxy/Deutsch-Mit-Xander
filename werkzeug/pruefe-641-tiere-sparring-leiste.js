#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 641: TIERE BLEIBEN DEINS, SPARRING WEHRT SICH, LEISTE
   ---------------------------------------------------------------------
   XANDER (25.09.): „die Monster die ich gekauft habe immer noch verfügbar
   … wechseln können" · „mein Drachen macht übrigens gar nix … wenn ich
   gegen den Sparring Partner kämpfe" · „der Sparring Partner … soll
   eingeloggt bleiben" · „wenn da ne Waffe drüber liegt … verdeckt die
   Waffe den kleinen Helfer" · „ich höre … keine Sounds".
   Server: Probelauf mit Rollback (Tier wechseln behält die Kraft, ein
   gekauftes Tier wird nicht ersetzt, sondern weggestellt; Xanders
   Fellmonster ist zurück). Hier der BROWSER:
     · Menü → Tiere: alle drei eigenen Tiere, Tipp holt eins raus
     · der Sparringspartner trifft mich → mein Fellmonster beißt und
       mein Drache faucht zurück, der Partner verliert LP
     · das Waffen-Abzeichen sitzt links oben, nicht auf dem Drachen
     · „Ton testen" sagt, woran es liegt
     · ein Tipp daneben klappt das Menü zu
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

  /* Zum Anschauen: BILD=leiste.png BILD2=menue.png */
  if (process.env.BILD) {
    await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mitspielen = true; S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(); });
    const r = await pg.evaluate(() => { const f = document.getElementById("lcForm").getBoundingClientRect(); return { x: 0, y: Math.max(0, f.top - 380), width: 460, height: f.bottom - Math.max(0, f.top - 380) + 4 }; });
    await pg.screenshot({ path: process.env.BILD, clip: r });
    await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "waffen"; window.DMA_SPIEL.pruef.schnellZeichnen(); });
    await pg.screenshot({ path: process.env.BILD2, clip: r });
    await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(); });
  }

  console.log("\nDEINE TIERE: ALLE DA, WECHSELN MIT EINEM TIPP\n");
  const tiere = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "tiere";
    window.DMA_SPIEL.pruef.schnellZeichnen();
    const liste = [...document.querySelectorAll('.sp-schnellmenue [data-s="tierraus"]')].map((b) => b.dataset.a + (b.classList.contains("sp-an") ? "*" : ""));
    window.__rufe.length = 0;
    const ch = document.querySelector('.sp-schnellmenue [data-s="tierraus"][data-a="chihuahua"]'); if (ch) ch.click();
    await new Promise((r) => setTimeout(r, 300));
    const ruf = window.__rufe.find((r) => r.name === "spiel_tier_wechseln");
    return { liste, ruf: ruf ? ruf.args.p_art : "", zu: !S.schnellMenue };
  });
  sage(["fellmonster*", "drache*", "chihuahua"].every((x) => tiere.liste.includes(x)), "alle drei eigenen Tiere stehen da, zwei sind draußen", tiere.liste.join(","));
  sage(tiere.ruf === "chihuahua" && tiere.zu, "Tipp → spiel_tier_wechseln(chihuahua), Menü geht zu", tiere.ruf);

  console.log("\nSPARRING: MEINE TIERE WEHREN SICH\n");
  const gw = await pg.evaluate(() => window.DMA_SPIEL.pruef.eigeneGegenwehr(10));
  sage(gw.gegen_tier > 0 && gw.gegen_flug > 0 && gw.gegenwehr === 8, "bei 10 Schaden: Fellmonster + Drache wehren sich (höchstens 8)", JSON.stringify(gw));
  const spar = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand();
    S.ich.haustier = "fellmonster"; S.ich.haustier_leben = 30; S.ich.flugtier = "drache"; S.ich.flugtier_leben = 25;
    const frei = [].find.call(document.querySelectorAll("#lcPlaetze .lc-platz"), (q) => !q.dataset.lcId);
    S.sparring = Number(frei.dataset.lcPlatz);
    window.DMA_SPIEL.pruef.zeichnen();
    window.DMA_SPIEL.uebungStarten("sparring:" + S.sparring);
    clearTimeout(S.puppeUhr);
    const zahlen = [0.1, 0.5, 0.37]; let i = 0; const alt = Math.random;
    Math.random = () => zahlen[i++ % zahlen.length];
    window.DMA_TONLOG = [];
    window.DMA_SPIEL.pruef.puppeSchiesst();
    Math.random = alt;
    await new Promise((r) => setTimeout(r, 2600));
    clearTimeout(S.puppeUhr);
    const st = S.stand["puppe:sparring:" + S.sparring];
    return { ton: (window.DMA_TONLOG || []).map((t) => t.name || t).join(","), lp: st ? st.lp : -1, max: st ? st.lp_max : -1, laeuft: Boolean(S.duell && S.duell.uebung) };
  });
  sage(/monsterbiss/.test(spar.ton) && /drachenfeuer/.test(spar.ton), "Fellmonster beißt, Drache faucht zurück", spar.ton);
  sage(spar.lp >= 0 && spar.lp < spar.max, "der Sparringspartner verliert dabei Lebenspunkte", spar.lp + "/" + spar.max);
  sage(spar.laeuft, "die Übung läuft weiter");
  await pg.evaluate(() => window.DMA_SPIEL.uebungEnde());

  console.log("\nWAFFEN-ABZEICHEN NICHT AUF DEM DRACHEN\n");
  const marke = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.waffe = "kartoffel";
    S.stand[S.uid].flugtier = "drache"; S.stand[S.uid].flugtier_leben = 25;
    window.DMA_SPIEL.pruef.zeichnen();
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
    const k = p.querySelector(".lc-kreis").getBoundingClientRect();
    const m = p.querySelector(".sp-waffenmarke svg"), d = p.querySelector(".sp-flugtier .sp-tier-koerper");
    if (!m || !d) return { fehlt: true };
    const a = m.getBoundingClientRect(), b = d.getBoundingClientRect();
    const ueber = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return { links: a.left + a.width / 2 < k.left + k.width / 2, ueber };
  });
  sage(!marke.fehlt && marke.links && marke.ueber === 0, "das Abzeichen sitzt links oben und deckt den Drachen nicht", JSON.stringify(marke));

  console.log("\nTON TESTEN UND MENÜ ZUKLAPPEN\n");
  const ton = await pg.evaluate(async () => {
    const b = window.DMA_SPIEL_BRUECKE;
    const antwort = b && b.tonTest ? await b.tonTest("krugklirr") : "";
    const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr";
    window.DMA_SPIEL.pruef.schnellZeichnen();
    const knopf = Boolean(document.querySelector('.sp-schnellmenue [data-s="tontest"]'));
    document.getElementById("lcPlaetze").click();
    await new Promise((r) => setTimeout(r, 100));
    return { antwort, knopf, zu: !S.schnellMenue && !document.querySelector(".sp-schnellmenue") };
  });
  sage(ton.knopf, "„Ton testen“ steht im Menü (Mehr)");
  sage(/Ton läuft|blockiert|AUS|nicht geladen/.test(ton.antwort), "der Test sagt, woran es liegt", ton.antwort);
  sage(ton.zu, "ein Tipp daneben klappt das Menü zu");

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 641 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
