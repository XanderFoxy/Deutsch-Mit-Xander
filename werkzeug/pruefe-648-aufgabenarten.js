#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 648: MEHR AUFGABENARTEN, AUSSPRACHE IM SPIEL
   ---------------------------------------------------------------------
   XANDER (25.09.): „hier braucht auf jeden Fall noch mehr Spiele bei Art
   alles Betonung … Artikel Trainer … Aussage Check ob etwas richtig oder
   falsch ist … den Aussprache Trainer ganz klein mit einbringen … dafür
   Punkte kriegt".
   Server (Rollback-Test): spiel_aussprache_wort / _fertig (fremdes Wort
   abgelehnt, jedes Wort einmal, +2/+3 ab 60 %); „Stimmt der Satz?" aus
   Formfehlern, jeder „falsch"-Satz einzeln geprüft, halbe Punkte.
   Hier der BROWSER:
     · Knöpfe: Alles, Artikel, Fälle, Präpositionen, das/dass, ss/ß,
       Betonung, Aussprache; „Weitere …" mit allen übrigen Arten
     · ein Knopf / die Liste fragt die Aufgabe mit dieser Kategorie an
     · Aussprache: Wort mit Alex' Aufnahme, Nachsprechen → Note → Punkte
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
      else if (name === "spiel_aussprache_wort") data = { ok: true, wort: "Abend", silben: "A-bend", niveau: "A1" };
      else if (name === "spiel_aussprache_fertig") data = Object.assign({}, ich, { ok: true, gewonnen: args.p_prozent >= 60 ? 2 : 0, prozent: args.p_prozent });
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

  console.log("\nAUFGABENARTEN\n");
  const arten = await pg.evaluate(async () => {
    window.DMA_SPIEL.aufgabe();
    await new Promise((r) => setTimeout(r, 300));
    const p = document.getElementById("spPanel");
    const knoepfe = [...p.querySelectorAll('.sp-arten [data-tu="kategorie"]')].map((b) => b.textContent);
    const liste = [...p.querySelectorAll(".sp-arten-mehr option")].length;
    window.__rufe = [];
    const art = [...p.querySelectorAll('.sp-arten [data-tu="kategorie"]')].find((b) => b.textContent === "Artikel"); art.click();
    await new Promise((r) => setTimeout(r, 200));
    const r1 = (window.__rufe.find((x) => x.name === "spiel_aufgabe") || {}).args;
    window.__rufe = [];
    const sel = p.querySelector(".sp-arten-mehr"); sel.value = "relativsatz"; sel.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));
    const r2 = (window.__rufe.find((x) => x.name === "spiel_aufgabe") || {}).args;
    return { knoepfe, liste, r1, r2 };
  });
  sage(["Alles", "Artikel", "Fälle", "Präpositionen", "das/dass", "ss/ß", "Betonung", "Aussprache"].every((k) => arten.knoepfe.indexOf(k) >= 0), "die wichtigsten Arten als Knöpfe", arten.knoepfe.join(" · "));
  sage(arten.liste >= 25, "„Weitere …“ bietet alle übrigen Arten", arten.liste + " Einträge");
  sage(arten.r1 && arten.r1.p_kategorie === "artikel" && arten.r2 && arten.r2.p_kategorie === "relativsatz", "Knopf und Liste holen die Aufgabe dieser Art", JSON.stringify([arten.r1, arten.r2]));
  sage(arten.knoepfe.indexOf("Stimmt's?") < 0, "„Stimmt's?“ bleibt verborgen, solange die falschen Sätze nicht geprüft sind");

  console.log("\nAUSSPRACHE IM SPIEL\n");
  const sprech = await pg.evaluate(async () => {
    /* Mikrofon und Vergleich nachgestellt – die echte Aufnahme braucht ein Gerät. */
    window.AusspracheP = window.AusspracheP || {};
    window.AusspracheP.mikrofonDa = () => true;
    window.AusspracheP.aufnahmeStarten = (o) => Promise.resolve({ stoppen: () => Promise.resolve({ blob: new Blob(["x"]) }), abbrechen() {} , _o: o });
    window.AusspracheP.freieBewertung = () => Promise.resolve({ prozent: 77 });
    window.__rufe = []; window.DMA_TONLOG = [];
    const p = document.getElementById("spPanel");
    [...p.querySelectorAll('.sp-arten [data-tu="kategorie"]')].find((b) => b.textContent === "Aussprache").click();
    let t0 = performance.now();
    while (performance.now() - t0 < 4000 && !p.querySelector(".sp-sprech-wort:not(:empty)")?.textContent.match(/Abend/)) await new Promise((r) => setTimeout(r, 50));
    const wort = (p.querySelector(".sp-sprech-wort") || {}).textContent;
    const hoeren = p.querySelector('[data-tu="sprechhoeren"]');
    const url = window.DMA_SPIEL.pruef.zustand().sprech.url;
    const h1 = Math.round(p.querySelector(".sp-erg-platz").getBoundingClientRect().height);
    p.querySelector('[data-tu="sprechen"]').click();
    t0 = performance.now();
    while (performance.now() - t0 < 6000 && !(window.DMA_SPIEL.pruef.zustand().sprech || {}).ergebnis) await new Promise((r) => setTimeout(r, 50));
    await new Promise((r) => setTimeout(r, 100));
    const erg = (p.querySelector(".sp-erg-platz") || {}).textContent;
    const h2 = Math.round(p.querySelector(".sp-erg-platz").getBoundingClientRect().height);
    const ruf = window.__rufe.find((x) => x.name === "spiel_aussprache_fertig");
    return { wort, url, hoerenAn: hoeren && !hoeren.disabled, erg, ruf: ruf && ruf.args, h1, h2, ton: window.DMA_TONLOG.map((t) => t.name).join(",") };
  });
  sage(sprech.wort === "Abend" && /aussprache\/a1\/abend\.mp3/.test(sprech.url) && sprech.hoerenAn, "das Wort kommt mit Alex' Aufnahme", JSON.stringify({ wort: sprech.wort, url: sprech.url }));
  sage(sprech.ruf && sprech.ruf.p_wort === "Abend" && sprech.ruf.p_prozent === 77, "nach dem Nachsprechen geht die Note an den Server", JSON.stringify(sprech.ruf));
  sage(/77 % ähnlich/.test(sprech.erg) && /\+2 Punkte/.test(sprech.erg), "Ergebnis mit Punkten im festen Platz", sprech.erg);
  sage(sprech.h1 === sprech.h2 && sprech.h1 > 0, "der Ergebnisplatz springt nicht", sprech.h1 + " → " + sprech.h2);

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 648 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
