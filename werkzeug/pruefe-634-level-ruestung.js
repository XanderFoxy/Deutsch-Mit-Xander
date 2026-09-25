#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 634: LEVEL, KÖNNEN, RÜSTUNG, SUPERKRAFT, GESCHENK
   ---------------------------------------------------------------------
   XANDER (25.09.): „Bitte das Skill Training noch einbauen … dass man
   sich auch ne Rüstung zur Armo kaufen kann … dämonisch aufgeladen …
   tägliche Login … Geschenke … jeder muss den Stand von dem anderen
   sehen … auch wenn man einen Hut aufhat".
   Die Zahlen rechnet der Server (spiel_treffer, spiel_kaufen,
   spiel_trainieren, spiel_superkraft, spiel_tagesgeschenk; dort mit
   einem Probelauf geprüft, der sich selbst zurückrollt: Helm Stufe 1
   macht aus 12 Kopfschaden 11, Brust 1 aus 10 Herzschaden 9,
   dämonisch aus 12 → 18). Hier wird der BROWSER geprüft:
     · am fremden Bild: Ladung oben, Levelzahl links, Helm oben außen,
       Brustpanzer unten außen — alles auf dem Rand, nichts in der
       Gesichtsmitte, und über Hut/Kleidung
     · Schnellleiste: Level, Flamme erst bei 100 % antippbar, dann
       spiel_superkraft und das Bild glüht
     · Tagesgeschenk holt sich selbst ab, genau einmal
     · Reiter „Können“: sechs Fertigkeiten, Training startet
     · „Schutz & Laden“: Helm kaufen, Reparieren
     · Level-Aufstieg klingt (Jubel)
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
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille", "bogen", "laser", "huehnerwerfer"], mission: null, mana: 40, mana_max: 100, mitspielen: true,
                  level: 3, xp: 260, xp_stufe: 300 - 200, xp_naechste: 300, skill_frei: 1, skills: { zaehigkeit: 1 }, training: null,
                  ladung: 40, helm: 0, brust: 0, helm_stufe: 1, helm_halt: 10, brust_stufe: 0, brust_halt: 0,
                  vorraete: { bratwurst: 2 }, tag_serie: 2, geschenk_offen: true, daemon_bis: null };
    const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, haustier: "fellmonster",
                  haustier_leben: 30, geschuetz: true, mana: 10, mana_max: 100, mitspielen: true,
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
      else if (name === "spiel_tagesgeschenk") { ich.geschenk_offen = false; data = Object.assign({}, ich, { ok: true, punkte_plus: 16, bratwurst_plus: 1, serie: 3, pflaster_plus: 1 }); }
      else if (name === "spiel_seite_abholen") data = Object.assign({}, ich, { ok: true, muenzen: 4, bratwurst_plus: 0 });
      else if (name === "spiel_superkraft") { ich.ladung = 0; ich.daemon = true; ich.daemon_bis = new Date(Date.now() + 45000).toISOString(); data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_trainieren") { ich.training = { skill: args.p_skill, stufe: 1, bis: new Date(Date.now() + 300000).toISOString() }; ich.skill_frei = 0; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_kaufen") data = Object.assign({}, ich, { ok: true, gekauft: args.p_ding });
      else if (name === "spiel_aufgabe") data = { ok: true, id: 1000 + window.__rufe.length, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"], niveau: "A1" };
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: true, loesung: "gehe", gewonnen: 3, bonus: 0, mana_plus: 6, xp_plus: 6, level_vorher: 3, level: 4 });
      else if (name === "spiel_treffer") data = { ok: true, zone: "koerper", schaden: 8, abgewehrt: 0, kaputt: false,
        ziel: Object.assign({}, bea, { lp: 42 }), ich: Object.assign({}, ich, { lp: 94 }), gegenwehr: 6,
        gegen_geschuetz: 4, gegen_tier: 2, tier: "fellmonster", lohn: 1 };
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

  console.log("\nAM FREMDEN BILD: LADUNG, LEVEL, HELM, BRUSTPANZER\n");
  const bea = await pg.evaluate(() => {
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    const kreis = k.querySelector(".lc-kreis").getBoundingClientRect();
    const cx = kreis.left + kreis.width / 2, cy = kreis.top + kreis.height / 2, r = kreis.width / 2;
    const ring = k.querySelector(".sp-lp");
    const box = (sel) => { const e = ring && ring.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return { l: b.left - cx, r: b.right - cx, t: b.top - cy, b: b.bottom - cy }; };
    /* Wie weit reicht ein Stück ins Bild hinein? Kleinster Abstand der
       Punkte auf dem Pfad zur Mitte, in Radien. */
    const innen = (sel) => {
      const e = ring && ring.querySelector(sel); if (!e) return null;
      if (e.tagName === "g") { const c = e.querySelector("circle"); const b = c.getBoundingClientRect(); return (Math.hypot(b.left + b.width / 2 - cx, b.top + b.height / 2 - cy) - b.width / 2) / r; }
      /* Die Bögen sind Kreisbögen um die Bildmitte (50|50): Anfang und
         Ende liegen im Abstand ihres Radius, der innerste Punkt ist
         Radius minus halbe Strichbreite. Beides wird nachgerechnet. */
      const z = (e.getAttribute("d") || "").match(/-?[\d.]+/g).map(Number);
      const [x0, y0, rr, , , , , x1, y1] = z;
      const ab0 = Math.hypot(x0 - 50, y0 - 50), ab1 = Math.hypot(x1 - 50, y1 - 50);
      if (Math.abs(ab0 - rr) > 0.2 || Math.abs(ab1 - rr) > 0.2) return 0;
      const sw = parseFloat(getComputedStyle(e).strokeWidth) || 0;
      return (rr - sw / 2) / 50;
    };
    const lv = ring && ring.querySelector(".sp-level text");
    const kleid = document.createElement("div"); kleid.className = "lc-kleid"; k.appendChild(kleid);
    const zKleid = Number(getComputedStyle(kleid).zIndex), zRing = Number(getComputedStyle(ring).zIndex);
    kleid.remove();
    return { ladung: box(".sp-ladung-voll"), helm: box(".sp-ruest-2"), brust: box(".sp-ruest-1"), level: lv ? lv.textContent : "",
             lvBox: box(".sp-level"), r: r,
             innen: { ladung: innen(".sp-ladung-voll"), helm: innen(".sp-ruest-2"), brust: innen(".sp-ruest-1"), level: innen(".sp-level") },
             zKleid, zRing };
  });
  sage(bea.ladung && bea.ladung.b < 0, "die Ladung liegt ganz in der oberen Hälfte", bea.ladung ? "Unterkante " + (bea.ladung.b / bea.r).toFixed(2) + " r" : "fehlt");
  sage(bea.helm && bea.helm.b < -bea.r * 0.5, "Helm Stufe 2 (Silber) oben außen", bea.helm ? "Unterkante " + (bea.helm.b / bea.r).toFixed(2) + " r" : "fehlt");
  sage(bea.brust && bea.brust.t > bea.r * 0.5, "Brustpanzer Stufe 1 (Bronze) unten außen", bea.brust ? "Oberkante " + (bea.brust.t / bea.r).toFixed(2) + " r" : "fehlt");
  sage(bea.level === "7" && bea.lvBox && bea.lvBox.r < -bea.r * 0.55, "Level 7 steht links am Rand", bea.level + (bea.lvBox ? " · rechte Kante " + (bea.lvBox.r / bea.r).toFixed(2) + " r" : ""));
  const tiefst = Math.min(...Object.values(bea.innen).filter((x) => x != null));
  sage(tiefst >= 0.7, "nichts davon reicht in die Gesichtsmitte (innerste 70 %)", "tiefster Punkt " + tiefst.toFixed(2) + " r " + JSON.stringify(bea.innen, (k, v) => typeof v === "number" ? Number(v.toFixed(2)) : v));
  sage(bea.zRing > bea.zKleid, "der Ring liegt über Hut und Kleidung", "Ring " + bea.zRing + " · Kleidung " + bea.zKleid);

  /* Zum Anschauen: BILD=datei.png node werkzeug/pruefe-634-level-ruestung.js */
  if (process.env.BILD) {
    const r = await pg.evaluate(() => { const b = document.getElementById("lcPlaetze").getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: Math.min(b.height, 260) }; });
    await pg.screenshot({ path: process.env.BILD, clip: r });
  }

  console.log("\nTAGESGESCHENK HOLT SICH SELBST AB\n");
  const gesch = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    const S = window.DMA_SPIEL.pruef.zustand(); S.seiteZeit = 0; S.geschenkLaeuft = false;
    window.DMA_SPIEL.pruef.geschenkePruefen();
    await new Promise((r) => setTimeout(r, 300));
    const erst = window.__rufe.map((r) => r.name);
    window.__rufe.length = 0;
    window.DMA_SPIEL.pruef.geschenkePruefen();
    await new Promise((r) => setTimeout(r, 300));
    return { erst, dann: window.__rufe.map((r) => r.name), ton: (window.DMA_TONLOG || []).map((t) => t.name || t) };
  });
  sage(gesch.erst.includes("spiel_tagesgeschenk") && gesch.erst.includes("spiel_seite_abholen"), "beim Kommen: Geschenk und Seitenpunkte", gesch.erst.join(","));
  sage(!gesch.dann.includes("spiel_tagesgeschenk") && !gesch.dann.includes("spiel_seite_abholen"), "gleich danach nicht noch einmal", gesch.dann.join(",") || "kein Aufruf");

  console.log("\nSCHNELLLEISTE: LEVEL UND SUPERKRAFT\n");
  const sk = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand();
    S.ich.ladung = 40; S.ich.daemon = false; S.ich.daemon_bis = null;
    window.DMA_SPIEL.pruef.schnellZeichnen();
    const lp = (document.querySelector(".sp-s-lp") || {}).textContent || "";
    const b40 = document.querySelector('.sp-schnell [data-s="superkraft"]');
    const aus40 = { da: Boolean(b40), gesperrt: b40 && b40.disabled, text: b40 ? b40.textContent : "" };
    S.ich.ladung = 100; window.__ich.ladung = 100;
    window.DMA_SPIEL.pruef.schnellZeichnen();
    const b100 = document.querySelector('.sp-schnell [data-s="superkraft"]');
    const bei100 = { gesperrt: b100.disabled, voll: b100.classList.contains("sp-voll") };
    window.__rufe.length = 0; window.__raus.length = 0;
    b100.click();
    await new Promise((r) => setTimeout(r, 300));
    const ichPlatz = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
    const glut = ichPlatz && ichPlatz.classList.contains("sp-w-daemon");
    const ringD = Boolean(ichPlatz && ichPlatz.querySelector(".sp-ladung-daemon"));
    const nach = document.querySelector('.sp-schnell [data-s="superkraft"]');
    return { lp, aus40, bei100, rufe: window.__rufe.map((r) => r.name), raus: window.__raus.map((p) => p.ereignis),
             glut, ringD, nachText: nach ? nach.textContent : "", ton: (window.DMA_TONLOG || []).map((t) => t.name || t) };
  });
  sage(/^Lv 3 /.test(sk.lp), "die Leiste zeigt das Level", sk.lp);
  sage(sk.aus40.da && sk.aus40.gesperrt && /40 %/.test(sk.aus40.text), "Flamme bei 40 % gesperrt, zeigt die Ladung", JSON.stringify(sk.aus40));
  sage(!sk.bei100.gesperrt && sk.bei100.voll, "bei 100 % leuchtet sie und ist antippbar", JSON.stringify(sk.bei100));
  sage(sk.rufe.includes("spiel_superkraft"), "Tipp → spiel_superkraft", sk.rufe.join(","));
  sage(sk.raus.includes("daemon"), "der Raum erfährt es (Ton bei allen)", sk.raus.join(","));
  sage(sk.glut && sk.ringD, "das eigene Bild glüht dämonisch, der Ring oben auch", "Glut " + sk.glut + " · Ring " + sk.ringD);
  sage(/\d+ s/.test(sk.nachText), "die Flamme zählt die Sekunden herunter", sk.nachText);

  console.log("\nREITER „KÖNNEN“: TRAINING\n");
  const kn = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.skill_frei = 1; S.ich.training = null;
    window.DMA_SPIEL.menue("koennen");
    await new Promise((r) => setTimeout(r, 200));
    const knoepfe = [...document.querySelectorAll('#spPanel [data-tu="trainieren"]')];
    const frei = knoepfe.filter((b) => !b.disabled).length;
    const zStufe = (document.querySelector('#spPanel [data-k="zaehigkeit"]') || {}).textContent || "";
    window.__rufe.length = 0;
    const pz = document.querySelector('#spPanel [data-k="panzerhaut"]'); if (pz) pz.click();
    await new Promise((r) => setTimeout(r, 300));
    const ruf = window.__rufe.find((r) => r.name === "spiel_trainieren");
    const laeuft = /Training läuft/.test(document.getElementById("spPanel").textContent);
    const gesperrt = [...document.querySelectorAll('#spPanel [data-tu="trainieren"]')].every((b) => b.disabled);
    return { anzahl: knoepfe.length, frei, zStufe, arg: ruf ? ruf.args.p_skill : "", laeuft, gesperrt };
  });
  sage(kn.anzahl === 6 && kn.frei === 6, "sechs Fertigkeiten, mit freiem Punkt alle trainierbar", kn.anzahl + " Knöpfe, " + kn.frei + " frei");
  sage(/10 min/.test(kn.zStufe), "Zähigkeit steht auf 1 → nächste Stufe dauert 10 min", kn.zStufe);
  sage(kn.arg === "panzerhaut", "Tipp → spiel_trainieren(panzerhaut)", kn.arg);
  sage(kn.laeuft && kn.gesperrt, "danach: „Training läuft“, kein zweites gleichzeitig");

  console.log("\nSCHUTZ & LADEN: HELM UND BRUSTPANZER\n");
  const la = await pg.evaluate(async () => {
    window.DMA_SPIEL.menue("schutz");
    await new Promise((r) => setTimeout(r, 200));
    const p = document.getElementById("spPanel");
    const t = [...p.querySelectorAll('[data-tu="kaufen"]')].map((b) => b.dataset.d + ":" + b.textContent);
    window.__rufe.length = 0;
    const rep = p.querySelector('[data-d="reparatur_helm"]'); if (rep) rep.click();
    await new Promise((r) => setTimeout(r, 300));
    const ruf = window.__rufe.find((r) => r.name === "spiel_kaufen");
    return { t, rep: ruf ? ruf.args.p_ding : "", text: p.textContent };
  });
  sage(la.t.some((x) => x === "helm:Stufe 2 · 60"), "Helm Stufe 1 → nächste Stufe 60 Punkte", la.t.filter((x) => /helm|brust/.test(x)).join(" | "));
  sage(la.t.some((x) => x === "brust:Kaufen · 40"), "Brustpanzer kaufen: 40 Punkte");
  sage(/hält noch 10\/40/.test(la.text), "man sieht, wie lange der Helm noch hält");
  sage(la.rep === "reparatur_helm", "Reparieren → spiel_kaufen(reparatur_helm)", la.rep);

  console.log("\nLEVEL-AUFSTIEG\n");
  const lv = await pg.evaluate(async () => {
    window.DMA_TONLOG = [];
    const S = window.DMA_SPIEL.pruef.zustand();
    S.aufgabe = { id: 77, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"] };
    window.DMA_SPIEL.menue("deutsch");
    await new Promise((r) => setTimeout(r, 200));
    const b = [...document.querySelectorAll('#spPanel [data-tu="antwort"]')].find((x) => x.dataset.o === "gehe"); if (b) b.click();
    await new Promise((r) => setTimeout(r, 900));
    return { ton: (window.DMA_TONLOG || []).map((t) => t.name || t), text: document.getElementById("spPanel").textContent };
  });
  sage(lv.ton.some((t) => /jubel/.test(JSON.stringify(t))), "Aufstieg auf Level 4 klingt (Jubel)", JSON.stringify(lv.ton));
  sage(/\+6 Erfahrung/.test(lv.text), "das Ergebnis zeigt die Erfahrung", (lv.text.match(/\+\d+ Erfahrung/) || [""])[0]);

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 634 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
