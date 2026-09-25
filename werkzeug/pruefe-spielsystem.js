#!/usr/bin/env node
/* =====================================================================
   SONDE — SPIELSYSTEM „DEUTSCH ZUM ÜBERLEBEN" (Funk 95, SPIELSYSTEM.md)
   ---------------------------------------------------------------------
   Die Regeln selbst rechnet der Server (Supabase-Funktionen spiel_*);
   sie sind dort mit einem Probelauf in einer zurückgerollten Transaktion
   geprüft (Kopfschuss 16, Herz 13, Anfängerschutz, kaputt → kein
   Reisen, Pflaster → 40 LP, Mauer fängt ab …).
   Diese Sonde prüft das GESICHT im Browser, mit einer Attrappe statt des
   Servers:
     · Lebensbalken an jedem Spieler, ohne dass ein Platz verrutscht
     · Kampfmodus: Tipp mit Waffe trifft (kein Platztausch), die Zone
       kommt aus dem Tippunkt, das Geschoss fliegt, rote Zahl ÜBER dem Bild
     · ohne Waffe bleibt der Tipp ein Platztausch
     · Ausweichen: wer vor dem Einschlag den Platz wechselt, wird nicht
       gemeldet
     · kaputt: kein Platzwechsel (Tipp und Befehl)
     · Waffenstillstand, solange die Tafel offen ist
     · Spielfenster: /spiel, Deutsch-Aufgabe, Antwort geht an den Server
     · Schild, Mauer, Fellmonster sind zu sehen
     · Kachel „Spiel“ im Platzmenü, Menü passt weiter auf den Schirm
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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const konsolenFehler = [];
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 25000 });

  /* Raum mit fünf Leuten, dazu die Attrappe des Servers. */
  await pg.evaluate(() => {
    const leute = {};
    ["Bea", "Cem", "Dana", "Emil", "Fritz"].forEach((n, i) => { leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 }; });
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();

    const uuid = (n) => "00000000-0000-4000-8000-00000000000" + n;
    const ids = { ich: uuid(0), p0: uuid(1), p1: uuid(2), p2: uuid(3), p3: uuid(4), p4: uuid(5) };
    window.LiveChat.spielIdVon = (chatId) => ids[chatId] || "";
    const stand = {};
    Object.keys(ids).forEach((k, i) => {
      stand[ids[k]] = { id: ids[k], name: k, lp: 100 - i * 10, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, haustier: null, geschuetz: false, wischer: 0, anfaenger: false, verdient: 0,
        /* Fassung 633: Mitspielen ist freiwillig; hier spielen alle mit. */
        mitspielen: true };
    });
    stand[ids.p1].schild = 30;
    stand[ids.p2].mauer_lp = 90; stand[ids.p2].mauer_art = "stein";
    stand[ids.p3].haustier = "fellmonster";
    const ich = Object.assign({}, stand[ids.ich], { punkte: 50, pflaster: 3, traenke: 0, waffen: ["zwille", "bogen", "laser"], ruestung: 0, mission: null });
    window.__rufe = [];
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args });
      let data = null;
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = Object.values(stand);
      else if (name === "spiel_treffer") {
        const z = (args.p_dy + 0.3) * (args.p_dy + 0.3) + args.p_dx * args.p_dx <= 0.09 ? "kopf" : "koerper";
        const schaden = z === "kopf" ? 16 : 8;
        const s = stand[args.p_ziel]; s.lp -= schaden;
        data = { ok: true, zone: z, schaden: schaden, abgewehrt: 0, kaputt: false, ziel: s, ich: stand[ids.ich], gegenwehr: 0, lohn: 1 };
      } else if (name === "spiel_aufgabe") data = { ok: true, id: 7, frage: "Das ist ___ Tisch.", optionen: ["die", "der", "das", "den"], niveau: "A1", kategorie: "artikel" };
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: args.p_antwort === "der", loesung: "der", erklaerung: "Tisch ist maskulin.", gewonnen: 3, bonus: 0 });
      else data = { ok: true };
      return Promise.resolve({ data: data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ids.ich, ich: ich, stand: stand, letzterAbruf: Date.now() });
    window.__ids = ids;
  });
  await pg.waitForTimeout(900);

  console.log("\nLEBENSBALKEN AN DEN PLÄTZEN\n");
  const balken = await pg.evaluate(() => {
    const pl = [...document.querySelectorAll("#lcPlaetze .lc-platz")];
    const besetzt = pl.filter((p) => p.dataset.lcId);
    return {
      besetzt: besetzt.length,
      mitBalken: besetzt.filter((p) => p.querySelector(".sp-lp")).length,
      freiOhne: pl.filter((p) => !p.dataset.lcId && p.querySelector(".sp-lp")).length,
      /* FUNK 110 — der Balken ist jetzt ein Ring AUF dem Rand des Bildes
         („unten in das Kreisrund … dass du unten den Platz nicht
         wegnimmst"). Geprüft wird: er deckt genau den Kreis, und seine
         Bögen liegen im äußersten Achtel — die Gesichtsmitte bleibt frei. */
      unterDemKreis: besetzt.every((p) => {
        const b = p.querySelector(".sp-lp"), k = p.querySelector(".lc-kreis");
        if (!b) return true;
        const rb = b.getBoundingClientRect(), rk = k.getBoundingClientRect();
        const deckt = Math.abs(rb.left - rk.left) < 1.5 && Math.abs(rb.width - rk.width) < 1.5;
        const innen = Number(b.dataset.radius) - 7 / 2 / 50;
        return deckt && innen >= 0.83;
      }),
      aura: Boolean(document.querySelector('.lc-platz[data-lc-id="p1"] .sp-aura')),
      mauer: Boolean(document.querySelector('.lc-platz[data-lc-id="p2"] .sp-mauer-stein')),
      tier: Boolean(document.querySelector('.lc-platz[data-lc-id="p3"] .sp-tier svg'))
    };
  });
  sage(balken.besetzt >= 6 && balken.mitBalken === balken.besetzt, "jeder Spieler hat einen Lebensbalken", balken.mitBalken + " von " + balken.besetzt);
  sage(balken.freiOhne === 0, "freie Plätze haben keinen Balken");
  sage(balken.unterDemKreis, "der Lebensring liegt auf dem Rand des Bildes, die Gesichtsmitte bleibt frei");
  sage(balken.aura && balken.mauer && balken.tier, "Schild-Aura, Steinmauer und Fellmonster sind zu sehen",
    "Aura " + balken.aura + ", Mauer " + balken.mauer + ", Tier " + balken.tier);

  /* Verrutscht durch das Schmücken ein Platz? */
  const lage = () => pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .lc-platz")].map((p) => {
    const r = p.getBoundingClientRect(); return Math.round(r.left) + "," + Math.round(r.top) + "," + Math.round(r.width) + "," + Math.round(r.height);
  }).join("|"));
  const vorher = await lage();
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.zeichnen(); window.DMA_SPIEL.pruef.zeichnen(); });
  sage(vorher === await lage(), "kein Platz verrutscht durch Balken und Schmuck");

  console.log("\nKAMPFMODUS: DER TIPP TRIFFT\n");
  const kampf = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    const tausch = []; const altT = window.LiveChat.platzTauschenMit;
    window.LiveChat.platzTauschenMit = function (id) { tausch.push(id); return { ok: false }; };
    /* Ohne Waffe: der Tipp bleibt ein Platztausch. */
    const bea = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="p0"]');
    bea.click();
    const ohneWaffe = { tausch: tausch.length, treffer: window.__rufe.filter((r) => r.name === "spiel_treffer").length };
    /* Mit Bogen: oben in die Mitte tippen = Kopfschuss. */
    window.DMA_SPIEL.pruef.setzen({ waffe: "bogen" });
    const k = bea.querySelector(".lc-kreis").getBoundingClientRect();
    const x = k.left + k.width / 2, y = k.top + k.height / 2 - k.height * 0.15;
    bea.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: x, clientY: y }));
    await new Promise((f) => setTimeout(f, 120));
    const geschoss = Boolean(document.querySelector(".sp-geschoss"));
    await new Promise((f) => setTimeout(f, 900));
    const tr = window.__rufe.find((r) => r.name === "spiel_treffer");
    const zahl = document.querySelector('.lc-platz[data-lc-id="p0"] .sp-zahl');
    const zahlOben = zahl ? zahl.getBoundingClientRect().top <= bea.querySelector(".lc-kreis").getBoundingClientRect().top + 2 : false;
    window.LiveChat.platzTauschenMit = altT;
    return { ohneWaffe, tauschMitWaffe: tausch.length - ohneWaffe.tausch, geschoss,
      treffer: tr ? tr.args : null, zahl: zahl ? zahl.textContent : "", zahlOben };
  });
  sage(kampf.ohneWaffe.tausch === 1 && kampf.ohneWaffe.treffer === 0, "ohne Waffe tauscht der Tipp die Plätze (wie bisher)");
  sage(kampf.tauschMitWaffe === 0, "mit Waffe tauscht der Tipp NICHT");
  sage(kampf.geschoss, "ein gezeichnetes Geschoss fliegt");
  sage(kampf.treffer && kampf.treffer.p_waffe === "bogen" && Math.abs(kampf.treffer.p_dx) < 0.05 && kampf.treffer.p_dy < -0.2 && kampf.treffer.p_dy > -0.4,
    "der Server bekommt Waffe und Tippunkt (oben Mitte)", kampf.treffer ? "dx " + kampf.treffer.p_dx + ", dy " + kampf.treffer.p_dy : "kein Aufruf");
  sage(/−16/.test(kampf.zahl) && /Kopf/.test(kampf.zahl), "rote Zahl mit Kopfschuss", kampf.zahl);
  sage(kampf.zahlOben, "die Zahl steht über dem Bild, nicht auf dem Gesicht");

  console.log("\nZONEN (wie auf dem Server)\n");
  const zonen = await pg.evaluate(() => { const z = window.DMA_SPIEL.pruef.zone;
    return [z(0, -0.3), z(0.18, 0.35), z(0.1, 0.1), z(0.85, 0), z(1.2, 0)]; });
  sage(zonen.join(",") === "kopf,herz,koerper,streif,daneben", "Kopf, Herz, Körper, Streifschuss, daneben", zonen.join(", "));

  console.log("\nAUSWEICHEN\n");
  const aus = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    const cem = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="p1"]');
    const nr = Number(cem.dataset.lcPlatz);
    cem.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 1, clientY: 1 }));
    /* Cem wechselt vor dem Einschlag den Platz — die Lage meldet ihn woanders. */
    const altL = window.LiveChat.lage;
    window.LiveChat.lage = function () { const l = altL(); l.plaetze = l.plaetze.map((p) => p.nummer === nr ? Object.assign({}, p, { id: "", leer: true }) : p); return l; };
    await new Promise((f) => setTimeout(f, 900));
    window.LiveChat.lage = altL;
    return { treffer: window.__rufe.filter((r) => r.name === "spiel_treffer").length };
  });
  sage(aus.treffer === 0, "wer vor dem Einschlag weg ist, wird nicht getroffen");

  console.log("\nKAPUTT: KEIN PLATZWECHSEL\n");
  const kaputt = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand();
    S.waffe = ""; S.ich.kaputt = true;
    const frei = document.querySelector("#lcPlaetze .lc-platz.lc-platz-frei, #lcPlaetze .lc-platz:not([data-lc-id])");
    const meinVorher = window.LiveChat.lage().plaetze.find((p) => p.ich).nummer;
    if (frei) frei.click();
    const meinNachTipp = window.LiveChat.lage().plaetze.find((p) => p.ich).nummer;
    const erg = window.LiveChat.platzNehmen(8);
    window.LiveChat.pruefBefehl("/tausch");
    const meinNachBefehl = window.LiveChat.lage().plaetze.find((p) => p.ich).nummer;
    S.ich.kaputt = false;
    return { vorher: meinVorher, nachTipp: meinNachTipp, nachBefehl: meinNachBefehl, erg };
  });
  sage(kaputt.vorher === kaputt.nachTipp && kaputt.vorher === kaputt.nachBefehl, "kaputt: weder Tipp noch /tausch bewegt dich",
    "Platz " + kaputt.vorher + " → " + kaputt.nachTipp + " / " + kaputt.nachBefehl);
  sage(kaputt.erg && kaputt.erg.ok === false && /kaputt/.test(kaputt.erg.warum || ""), "platzNehmen sagt, warum", (kaputt.erg && kaputt.erg.warum) || "");

  console.log("\nWAFFENSTILLSTAND (TAFEL OFFEN)\n");
  const ruhe = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    const karte = document.getElementById("livechatKarte");
    if (karte) karte.classList.add("lc-tafel-an");
    await new Promise((f) => setTimeout(f, 900));
    const S = window.DMA_SPIEL.pruef.zustand();
    S.waffe = "bogen";
    const bea = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="p0"]');
    bea.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 1, clientY: 1 }));
    await new Promise((f) => setTimeout(f, 900));
    const still = S.stillstand;
    if (karte) karte.classList.remove("lc-tafel-an");
    await new Promise((f) => setTimeout(f, 900));
    S.waffe = "";
    return { karte: Boolean(karte), still, treffer: window.__rufe.filter((r) => r.name === "spiel_treffer").length, danach: S.stillstand };
  });
  sage(ruhe.karte && ruhe.still && ruhe.treffer === 0, "Tafel offen: Waffenstillstand, kein Treffer");
  sage(ruhe.danach === false, "Tafel zu: der Waffenstillstand endet");

  console.log("\nSPIELFENSTER UND DEUTSCH-AUFGABE\n");
  const fenster = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    window.LiveChat.pruefBefehl("/spiel");
    await new Promise((f) => setTimeout(f, 200));
    const p = document.getElementById("spPanel");
    const tabs = p ? [...p.querySelectorAll(".sp-tabs button")].map((b) => b.textContent) : [];
    const dt = p && p.querySelector('[data-tab="deutsch"]'); if (dt) dt.click();
    await new Promise((f) => setTimeout(f, 200));
    const frage = (p.querySelector(".sp-frage-satz") || {}).textContent || "";
    const opt = [...p.querySelectorAll(".sp-optionen button")].map((b) => b.textContent);
    const der = [...p.querySelectorAll(".sp-optionen button")].find((b) => b.textContent === "der");
    if (der) der.click();
    await new Promise((f) => setTimeout(f, 200));
    const erg = (p.querySelector(".sp-erg-platz") || p.querySelector(".sp-erg") || {}).textContent || ""; /* Fassung 645: fester Platz */
    const r = window.__rufe.find((x) => x.name === "spiel_antwort");
    window.DMA_SPIEL.schliessen();
    return { da: Boolean(p), tabs, frage, opt, erg, antwort: r ? r.args : null };
  });
  sage(fenster.da && fenster.tabs.length >= 6, "/spiel öffnet das Spielfenster mit Reitern", fenster.tabs.join(" · "));
  sage(fenster.frage.indexOf("___") >= 0 && fenster.opt.length === 4, "die Deutsch-Aufgabe steht da, mit vier Antworten", fenster.frage);
  sage(fenster.antwort && fenster.antwort.p_antwort === "der" && fenster.antwort.p_id === 7, "die Antwort geht an den Server (nicht selbst gerechnet)");
  sage(/Richtig/.test(fenster.erg), "Rückmeldung „Richtig!“ mit Punkten", fenster.erg);

  console.log("\nKACHEL IM PLATZMENÜ\n");
  const kachel = await pg.evaluate(async () => {
    const ich = document.querySelector("#lcPlaetze .lc-platz.lc-platz-ich");
    window.DMA_PRUEFUNG.platzMenue(ich);
    await new Promise((f) => setTimeout(f, 200));
    const worte = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")].map((w) => w.textContent);
    const m = document.getElementById("lcPlatzMenue");
    const r = m ? m.getBoundingClientRect() : null;
    const k = worte.indexOf("Spiel");
    if (k >= 0) {
      const w = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")][k];
      (w.closest("button") || w.parentElement).click();
    }
    await new Promise((f) => setTimeout(f, 200));
    const offen = !document.getElementById("spPanel").hidden;
    window.DMA_SPIEL.schliessen();
    return { hat: k >= 0, passt: r ? r.bottom <= window.innerHeight + 1 && r.top >= -1 : false, offen };
  });
  sage(kachel.hat && kachel.offen, "die Kachel „Spiel“ öffnet das Spielfenster");
  sage(kachel.passt, "das Platzmenü passt weiter auf den Bildschirm");

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfüllt" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
