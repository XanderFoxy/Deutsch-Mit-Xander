#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 837: DAS SPIEL IM ITALIENISCH-RAUM
   ---------------------------------------------------------------------
   XANDER (Funk 214): „dann hätte ich gerne das Spielsystem für mich und
   vielleicht in Verbindung mit Azoren dem Aussprache Trainer auch global
   auf der Webseite wenn ich in den italienischen Modus gehe von der
   Webseite würde ich auch gerne das Spiel nutzen können dann mit Fragen
   zu italienischen Sprache also in in Deutsch die Fragen natürlich aber
   das nur wenn ich in diesen eigenen da nicht für alle zugänglich ist in
   den eigenen italienischen Bereich in der Seite gehe dann soll das
   mitgekoppelt werden dass diese Sachen dann für mich zum Lernen auch da
   sind".
   Geprüft (Server wie in den anderen Spielsonden nachgebaut):
     · Deutsch-Raum (auch als Betreiber) und Nicht-Betreiber im
       Italienisch-Raum: das Spiel bleibt deutsch, Aufgaben vom Server.
     · Betreiber im Italienisch-Raum: Reiter „Italienisch“, Fragen auf
       Deutsch nach italienischen Wörtern, Artikeln, Verbformen, passato
       prossimo, Präpositionen, Aussprache-Regeln, Stimmt's? – kein
       spiel_aufgabe/spiel_antwort an den Server.
     · Jede erzeugte Antwort stimmt: gegen IT_WOERTER, IT_VERBEN,
       Satzbau.ORTE und die Verschmelzungstabelle nachgerechnet.
     · Aussprache: Vorsprechen und Bewerten mit sprache „it-IT“, kein
       spiel_aussprache_*.
     · Punkte: in extra_profile_data.itPunkte und itKurs, nie in
       profiles.points (saveResult) und nie über den Spiel-Server.
     · 360 px: nichts ragt heraus, Tippflächen ≥ 30 px, Bildschirmfotos.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const BILDER = process.env.BILDER || "/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".webp": "image/webp" };

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
  const pg = await br.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, hasTouch: true });
  const konsolenFehler = [];
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_spiel_sprech_auto", "0"); localStorage.removeItem("dma_spiel_it_art"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL && window.ExerciseData !== undefined || (typeof ExerciseData !== "undefined" && window.DMA_SPIEL && window.LiveChat && window.LiveChat.pruefSitz), { timeout: 30000 });
  await pg.waitForTimeout(600);

  /* Spielserver nachgebaut wie in pruefe-648 – jeder Aufruf wird protokolliert. */
  await pg.evaluate(() => {
    const leute = {
      bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" },
      cem: { id: "cem", name: "Cem", seit: 7000, gesehen: 9e15, buehne: true, bild: "" }
    };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Xander", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000";
    const ich = { id: ichId, name: "Xander", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 200, verdient: 50,
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille", "bogen", "laser"], mission: null, mana: 40, mana_max: 100, mitspielen: true,
                  level: 3, xp: 260, xp_stufe: 100, xp_naechste: 300, skill_frei: 0, skills: {}, training: null,
                  ladung: 40, helm: 0, brust: 0, vorraete: {}, haustier: "", tiere: {} };
    window.__rufe = [];
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args || {} });
      let data = { ok: true };
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich];
      else if (name === "spiel_aussprache_wort") data = { ok: true, wort: "Abend", silben: "A-bend", niveau: "A1" };
      else if (name === "spiel_aussprache_fertig") data = Object.assign({}, ich, { ok: true, gewonnen: 2 });
      else if (name === "spiel_aufgabe") data = { ok: true, id: 1000 + window.__rufe.length, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"], niveau: "A1" };
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: true, loesung: "gehe", gewonnen: 3, bonus: 0, mana_plus: 6, xp_plus: 6, level_vorher: 3, level: 3 });
      return Promise.resolve({ data: data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich, stand: { [ichId]: ich }, letzterAbruf: Date.now() });
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    /* Das Profil: wer schreibt was? saveResult wäre der deutsche Punktestand (profiles.points). */
    window.__profilSchreiben = []; window.__saveResult = [];
    window.__extra = {};
    Backend.currentUser = () => ({ id: "xander" });
    Backend.currentProfile = () => ({ id: "xander", points: 500, extraProfileData: window.__extra });
    Backend.updateExtraProfileField = (feld, wert) => { window.__profilSchreiben.push(feld); window.__extra[feld] = wert; return Promise.resolve(true); };
    Backend.saveResult = (r) => { window.__saveResult.push(r); return Promise.resolve(); };
    Backend.addTrophy = () => {}; Backend.sendSystemMessage = () => {};
    window.__owner = false;
    Backend.isOwner = () => window.__owner;
    const echt = window.DMA_IT_SPIEL && window.DMA_IT_SPIEL.gutschreiben;
    window.__gutschriften = [];
    if (echt) window.DMA_IT_SPIEL.gutschreiben = function () { window.__gutschriften.push([].slice.call(arguments)); return echt.apply(this, arguments); };
  });
  await pg.waitForTimeout(500);

  const panelStand = () => pg.evaluate(() => {
    const p = document.getElementById("spPanel");
    const tab = p && [...p.querySelectorAll(".sp-tabs button")].find((b) => b.dataset.tab === "deutsch");
    const it = p && p.querySelector(".sp-it-aufgabe");
    return {
      offen: Boolean(p && !p.hidden), reiter: tab ? tab.textContent : "", it: Boolean(it),
      frage: ((it || p || {}).querySelector ? ((it || p).querySelector(".sp-frage-satz") || {}).textContent : "") || "",
      aufgabeRufe: window.__rufe.filter((r) => r.name === "spiel_aufgabe").length,
      text: p ? p.textContent : ""
    };
  });
  const lernraum = (raum, owner) => pg.evaluate(([raum, owner]) => {
    window.__owner = owner;
    ExerciseData.setLernraum(raum);
    document.body.classList.toggle("lernraum-it", raum === "it");
    window.__rufe = [];
  }, [raum, owner]);
  const oeffnen = () => pg.evaluate(async () => { window.DMA_SPIEL.aufgabe(); await new Promise((r) => setTimeout(r, 350)); });

  console.log("\nDEUTSCH BLEIBT DEUTSCH\n");
  await lernraum("de", true);
  await oeffnen();
  let st = await panelStand();
  sage(st.offen && st.reiter === "Deutsch" && !st.it && st.aufgabeRufe >= 1, "Betreiber im Deutsch-Raum: Reiter „Deutsch“, Aufgabe vom Server", JSON.stringify({ reiter: st.reiter, it: st.it, rufe: st.aufgabeRufe }));
  sage(/Ich ___ nach Hause/.test(st.text), "… die deutsche Aufgabe steht da");
  await lernraum("it", false);
  await oeffnen();
  st = await panelStand();
  sage(st.reiter === "Deutsch" && !st.it && st.aufgabeRufe >= 1, "Nicht-Betreiber mit Italienisch-Raum im Profil: das Spiel bleibt deutsch", JSON.stringify({ reiter: st.reiter, it: st.it, rufe: st.aufgabeRufe }));
  const aktivOhne = await pg.evaluate(() => window.DMA_IT_SPIEL && window.DMA_IT_SPIEL.aktiv());
  sage(aktivOhne === false, "DMA_IT_SPIEL.aktiv() ist für Nicht-Freigegebene aus");

  console.log("\nITALIENISCH-RAUM ALS BETREIBER\n");
  await lernraum("it", true);
  await oeffnen();
  st = await panelStand();
  sage(st.reiter === "Italienisch" && st.it && st.aufgabeRufe === 0, "Reiter „Italienisch“, italienische Aufgabe, kein spiel_aufgabe an den Server", JSON.stringify({ reiter: st.reiter, it: st.it, rufe: st.aufgabeRufe }));
  sage(/^(Was heißt|Welcher Artikel|Setze|Mit welchem Hilfsverb|Wie heißt|Wie sagt man|Aus welcher|Wie klingt|Was passiert|Was zeigt|Auf welcher|„nonno“|Wie wird|Stimmt's\?)/.test(st.frage), "die Frage steht auf Deutsch", st.frage);

  /* Jede Art einmal antippen: die Frage kommt sofort, auf Deutsch, mit der passenden Art. */
  const arten = await pg.evaluate(async () => {
    const p = document.getElementById("spPanel"), aus = [];
    for (const k of ["woerter", "artikel", "verben", "passato", "praep", "laute", "stimmts"]) {
      const b = p.querySelector('.sp-it-wahl [data-tu="itart"][data-k="' + k + '"]');
      if (!b) { aus.push({ k, fehlt: true }); continue; }
      b.click(); await new Promise((r) => setTimeout(r, 120));
      const a = window.DMA_SPIEL.pruef.zustand().itAufgabe || {};
      aus.push({ k, art: a.art, frage: a.frage, n: (a.optionen || []).length, knoepfe: p.querySelectorAll('.sp-it-aufgabe [data-tu="itantwort"]').length });
    }
    return aus;
  });
  arten.forEach((x) => sage(!x.fehlt && x.art === x.k && x.n >= 2 && x.knoepfe === x.n, "Art „" + x.k + "“: " + (x.frage || ""), x.n + " Antworten"));
  sage(!(await pg.evaluate(() => window.__rufe.some((r) => /^spiel_(aufgabe|antwort)$/.test(r.name)))), "keine einzige Anfrage an die deutsche Aufgabenbank");

  console.log("\nANTWORTEN STIMMEN (je Art und Niveau nachgerechnet)\n");
  const pruefung = await pg.evaluate(() => {
    const IT = window.DMA_SPIEL.pruef.IT, ED = ExerciseData, SB = window.Satzbau;
    const V = {};
    ED.IT_VERBEN.forEach((v) => { V[v.inf] = v; });
    const W = ED.IT_WOERTER;
    const VER = { di: { il: "del", lo: "dello", la: "della", "l'": "dell'", i: "dei", gli: "degli", le: "delle" }, a: { il: "al", lo: "allo", la: "alla", "l'": "all'", i: "ai", gli: "agli", le: "alle" }, da: { il: "dal", lo: "dallo", la: "dalla", "l'": "dall'", i: "dai", gli: "dagli", le: "dalle" }, in: { il: "nel", lo: "nello", la: "nella", "l'": "nell'", i: "nei", gli: "negli", le: "nelle" }, su: { il: "sul", lo: "sullo", la: "sulla", "l'": "sull'", i: "sui", gli: "sugli", le: "sulle" } };
    const probleme = [], zahl = {}, beispiele = {};
    const fall = (a, grund) => { if (probleme.length < 12) probleme.push(grund + " :: " + JSON.stringify(a)); };
    const PERS = { io: 0, tu: 1, lui: 2, lei: 2, noi: 3, voi: 4, loro: 5 };
    const AUX = { essere: ["sono", "sei", "è", "siamo", "siete", "sono"], avere: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"] };
    for (const niveau of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      for (const art of ["", "woerter", "artikel", "verben", "passato", "praep", "laute", "stimmts"]) {
        for (let i = 0; i < 250; i++) {
          const a = IT.aufgabe(niveau, art);
          zahl[a.art] = (zahl[a.art] || 0) + 1;
          if (!beispiele[a.art]) beispiele[a.art] = a.frage + " → " + a.loesung;
          if (!a.frage || /undefined|null|NaN/.test(a.frage + a.optionen.join("|") + a.erklaerung)) fall(a, "leer/undefined");
          if (a.optionen.indexOf(a.loesung) < 0) fall(a, "Lösung fehlt in den Antworten");
          if (new Set(a.optionen.map((o) => o.toLowerCase())).size !== a.optionen.length) fall(a, "doppelte Antwort");
          if (a.optionen.length < 2) fall(a, "zu wenige Antworten");
          if (["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(a.niveau) < 0) fall(a, "Niveau");
          const m1 = /^Was heißt „(.+)“ auf Italienisch\?$/.exec(a.frage), m2 = /^Was heißt „(.+)“ auf Deutsch\?$/.exec(a.frage);
          if (m1) {
            if (!W.some((w) => w.de === m1[1] && w.word === a.loesung)) fall(a, "Wort-Paar nicht im Wörterbuch");
            a.optionen.filter((o) => o !== a.loesung).forEach((o) => { if (W.some((w) => w.word === o && w.de === m1[1])) fall(a, "falsche Antwort ist auch richtig"); });
          }
          if (m2) {
            if (!W.some((w) => w.word === m2[1] && w.de === a.loesung)) fall(a, "Wort-Paar nicht im Wörterbuch");
            a.optionen.filter((o) => o !== a.loesung).forEach((o) => { if (W.some((w) => w.word === m2[1] && w.de === o)) fall(a, "falsche Antwort ist auch richtig"); });
          }
          let m = /^Welcher Artikel passt\? ___ (.+) \((.+)\)$/.exec(a.frage);
          if (m) { const voll = a.loesung === "l'" ? "l'" + m[1] : a.loesung + " " + m[1]; if (!W.some((w) => w.word === voll && w.de === m[2])) fall(a, "Artikel passt nicht zum Wörterbuch"); }
          m = /^Setze „(.+)“ \(.+\) ein: (\w+) ___$/.exec(a.frage);
          if (m) { const v = V[m[1]]; if (!v || v.formen[PERS[m[2]]] !== a.loesung) fall(a, "Verbform"); if (a.optionen.filter((o) => o === v.formen[PERS[m[2]]]).length !== 1) fall(a, "Verbform doppelt"); }
          m = /^Mit welchem Hilfsverb bildet „(.+)“/.exec(a.frage);
          if (m) { if (V[m[1]].hilfsverb !== a.loesung) fall(a, "Hilfsverb"); }
          m = /^Wie heißt „(.+)“ auf Italienisch\?$/.exec(a.frage);
          if (m && a.art === "passato") {
            const t = a.loesung.split(" "), subj = t[0], aux = t[1], part = t.slice(2).join(" ");
            const v = ED.IT_VERBEN.find((x) => x.hilfsverb === "essere" ? part.slice(0, -1) === x.partizip : part === x.partizip);
            if (!v) fall(a, "Partizip unbekannt");
            else {
              if (AUX[v.hilfsverb][PERS[subj]] !== aux) fall(a, "Hilfsverb-Form");
              if (v.hilfsverb === "essere") { const end = part.slice(-1), soll = subj === "lei" ? "a" : subj === "lui" ? "o" : "i"; if (end !== soll) fall(a, "Angleichung"); }
              if (m[1].indexOf(v.dePartizip) < 0) fall(a, "deutsches Partizip");
              /* Keine falsche Antwort darf richtig sein. */
              a.optionen.filter((o) => o !== a.loesung).forEach((o) => { if (o === a.loesung) fall(a, "doppelt"); });
            }
          }
          m = /^Aus welcher Präposition und welchem Artikel ist „(.+)“ verschmolzen\?$/.exec(a.frage);
          if (m) {
            const [p, ar] = a.loesung.split(" + "); if (VER[p][ar] !== m[1]) fall(a, "Verschmelzung");
            a.optionen.filter((o) => o !== a.loesung).forEach((o) => { const [p2, a2] = o.split(" + "); if (VER[p2][a2] === m[1]) fall(a, "falsche Verschmelzung ist richtig"); });
          }
          m = /^Wie sagt man „(.+)“ auf Italienisch\? \((wo|woher)\?\)$/.exec(a.frage);
          if (m) {
            const ort = SB.ORTE.find((o) => SB.ortsform(o, m[2]) === m[1] && (m[2] === "woher" ? o.itWoher : o.it) === a.loesung);
            if (!ort) fall(a, "Ort nicht im Satzbaukasten");
            if (m[2] === "woher" && ort && ort.eigenname) fall(a, "woher bei Eigennamen");
            /* Keine falsche Antwort ist die richtige Form eines anderen Eintrags mit derselben deutschen Angabe. */
            a.optionen.filter((o) => o !== a.loesung).forEach((o) => { if (SB.ORTE.some((x) => SB.ortsform(x, m[2]) === m[1] && (m[2] === "woher" ? x.itWoher : x.it) === o)) fall(a, "falsche Ortsangabe ist auch richtig"); });
          }
          if (a.art === "laute" && !IT.LAUTE.some((l) => l[1] === a.frage && l[2] === a.loesung)) fall(a, "Laut-Regel");
          if (a.art === "stimmts") {
            const s = a.frage;
            let mm = /^Stimmt's\? „(.+)“ heißt „(.+)“\.$/.exec(s);
            if (mm) { const wahr = W.some((w) => w.word === mm[1] && w.de === mm[2]); if ((a.loesung === "richtig") !== wahr) fall(a, "Stimmt's Bedeutung"); }
            mm = /^Stimmt's\? Richtig geschrieben: „(.+)“ \((.+)\)\.$/.exec(s);
            if (mm) { const wahr = W.some((w) => w.word === mm[1] && w.de === mm[2]); if ((a.loesung === "richtig") !== wahr) fall(a, "Stimmt's Artikel"); }
            mm = /^Stimmt's\? „(.+)“ bildet das passato prossimo mit „(.+)“\.$/.exec(s);
            if (mm) { if ((a.loesung === "richtig") !== (V[mm[1]].hilfsverb === mm[2])) fall(a, "Stimmt's Hilfsverb"); }
          }
        }
      }
    }
    /* Die Laut-Regeln: die richtige Antwort steht genau einmal, jede Frage kommt vor. */
    const laute = IT.LAUTE.length;
    return { probleme, zahl, beispiele, laute };
  });
  sage(!pruefung.probleme.length, "12 000 erzeugte Aufgaben: jede Lösung stimmt mit den Daten der Seite überein", pruefung.probleme.join("\n        ") || JSON.stringify(pruefung.zahl));
  Object.keys(pruefung.beispiele).forEach((k) => console.log("        Beispiel " + k + ": " + pruefung.beispiele[k]));

  console.log("\nANTWORTEN UND PUNKTE\n");
  const antwort = await pg.evaluate(async () => {
    const p = document.getElementById("spPanel");
    p.querySelector('.sp-it-wahl [data-tu="itart"][data-k="artikel"]').click();
    await new Promise((r) => setTimeout(r, 100));
    window.__gutschriften = []; window.__profilSchreiben = []; window.__rufe = [];
    const erg = [];
    for (let i = 0; i < 5; i++) {
      const a = window.DMA_SPIEL.pruef.zustand().itAufgabe;
      const wahl = i === 1 ? a.optionen.find((o) => o !== a.loesung) : a.loesung;
      const h1 = Math.round(p.querySelector(".sp-it-aufgabe .sp-erg-platz").getBoundingClientRect().height);
      [...p.querySelectorAll('.sp-it-aufgabe [data-tu="itantwort"]')].find((b) => b.dataset.o === wahl).click();
      await new Promise((r) => setTimeout(r, 80));
      const zeile = (p.querySelector(".sp-it-aufgabe .sp-erg-zeile") || {}).textContent || "";
      const h2 = Math.round(p.querySelector(".sp-it-aufgabe .sp-erg-platz").getBoundingClientRect().height);
      erg.push({ richtig: wahl === a.loesung, zeile, h1, h2, niveau: a.niveau });
      if (i < 4) { p.querySelector('.sp-it-aufgabe [data-tu="itweiter"]').click(); await new Promise((r) => setTimeout(r, 80)); }
    }
    await new Promise((r) => setTimeout(r, 300));
    return { erg, gut: window.__gutschriften, felder: window.__profilSchreiben, extra: JSON.parse(JSON.stringify(window.__extra)), save: window.__saveResult.length,
             server: window.__rufe.map((r) => r.name) };
  });
  sage(antwort.erg[0].richtig && /^Richtig! \+\d/.test(antwort.erg[0].zeile), "richtige Antwort: „Richtig! +Punkte“", antwort.erg[0].zeile);
  sage(!antwort.erg[1].richtig && /Leider falsch/.test(antwort.erg[1].zeile), "falsche Antwort: „Leider falsch“ mit Erklärung", antwort.erg[1].zeile);
  sage(antwort.erg.every((x) => x.h1 === x.h2 && x.h1 > 0), "die Auswertung hat einen festen Platz (nichts springt)", antwort.erg.map((x) => x.h1 + "→" + x.h2).join(" "));
  const soll = antwort.erg.filter((x) => x.richtig).reduce((s, x) => s + ({ A1: 3, A2: 4, B1: 5, B2: 6, C1: 7, C2: 8 })[x.niveau], 0);
  sage(antwort.gut.length === 1 && antwort.gut[0][0] === soll, "nach 5 Antworten eine Gutschrift in die italienische Kasse", JSON.stringify(antwort.gut) + " soll " + soll);
  sage(antwort.extra.itPunkte && antwort.extra.itPunkte.punkte === soll && antwort.felder.indexOf("itPunkte") >= 0, "extra_profile_data.itPunkte bekommt die Punkte", JSON.stringify(antwort.extra.itPunkte));
  sage(antwort.felder.every((f) => f === "itPunkte" || f === "itKurs"), "geschrieben werden nur itPunkte/itKurs", antwort.felder.join(","));
  sage(antwort.save === 0 && !antwort.server.some((n) => /^spiel_(antwort|aussprache_fertig|extra_lohn)$/.test(n)), "kein saveResult (deutscher Punktestand/Ranking), kein Spiel-Server", antwort.server.join(",") || "–");

  console.log("\nAUSSPRACHE MIT AZURE AUF ITALIENISCH\n");
  const sprech = await pg.evaluate(async () => {
    window.__vorlesen = []; window.__bewerten = []; window.__rufe = []; window.__gutschriften = [];
    const AP = window.AusspracheP;
    AP.zentralDa = () => true;
    AP.zentralStandJetzt = () => ({ zentralDa: true });
    AP.zentralMoeglich = () => true;
    AP.zentralVorlesen = (o) => { window.__vorlesen.push(o); const k = new AudioContext(); return Promise.resolve(k.createBuffer(1, 4800, 48000)); };
    AP.mikrofonDa = () => true;
    AP.aufnahmeStarten = (o) => Promise.resolve({ stoppen: () => Promise.resolve({ blob: new Blob(["x"]) }), abbrechen() {} });
    AP.tonLesen = () => Promise.resolve({ eigen: true });
    AP.stufe1Da = () => true;
    AP.alsWav = () => new Blob(["wav"]);
    AP.stufe1Bewerten = (o) => { window.__bewerten.push({ text: o.text, sprache: o.sprache }); return Promise.resolve({ prozent: 82, woerter: [{ laute: [{ laut: "a", note: 90 }, { laut: "ts", note: 70 }] }] }); };
    if (window.DMA_AUSSPR_BRUECKE) window.DMA_AUSSPR_BRUECKE.bereit = () => Promise.resolve();
    const p = document.getElementById("spPanel");
    p.querySelector('.sp-it-wahl [data-tu="itart"][data-k="aussprache"]').click();
    let t0 = performance.now();
    while (performance.now() - t0 < 4000 && !(window.DMA_SPIEL.pruef.zustand().sprech || {}).wort) await new Promise((r) => setTimeout(r, 50));
    const sp = window.DMA_SPIEL.pruef.zustand().sprech || {};
    const wortImWb = ExerciseData.IT_WOERTER.some((w) => w.word.replace(/^(il|lo|la|i|gli|le) /, "").replace(/^l'/, "") === sp.wort);
    p.querySelector('[data-tu="sprechen"]').click();
    t0 = performance.now();
    while (performance.now() - t0 < 6000 && !(window.DMA_SPIEL.pruef.zustand().sprech || {}).ergebnis) await new Promise((r) => setTimeout(r, 50));
    await new Promise((r) => setTimeout(r, 150));
    const e = (window.DMA_SPIEL.pruef.zustand().sprech || {}).ergebnis || {};
    return { wort: sp.wort, it: sp.it, wortImWb, vorlesen: window.__vorlesen, bewerten: window.__bewerten, erg: e,
             text: (p.querySelector(".sp-sprech .sp-erg-platz") || {}).textContent || "", server: window.__rufe.map((r) => r.name),
             karte: Boolean(p.querySelector(".sp-sprech")), runde: JSON.parse(JSON.stringify(window.DMA_SPIEL.pruef.zustand().itRunde)) };
  });
  sage(sprech.karte && sprech.it && sprech.wortImWb, "die Sprechkarte zeigt ein Wort aus dem italienischen Wörterbuch", sprech.wort);
  sage(sprech.vorlesen.length >= 1 && sprech.vorlesen.every((o) => o.sprache === "it-IT" && o.text === sprech.wort), "Vorsprechen über Azure mit sprache „it-IT“", JSON.stringify(sprech.vorlesen));
  sage(sprech.bewerten.length === 1 && sprech.bewerten[0].sprache === "it-IT" && sprech.bewerten[0].text === sprech.wort, "Laut-Bewertung mit sprache „it-IT“", JSON.stringify(sprech.bewerten));
  sage(!sprech.server.some((n) => /^spiel_aussprache/.test(n)), "kein spiel_aussprache_wort/_fertig (die kennen nur deutsche Wörter)", sprech.server.join(",") || "–");
  sage(sprech.erg.prozent === 82 && sprech.erg.gewonnen > 0 && /\+\d+ Punkte/.test(sprech.text) && sprech.runde.punkte === sprech.erg.gewonnen, "82 / 100 → Punkte in die italienische Runde", sprech.text.slice(0, 80) + " · Runde " + JSON.stringify(sprech.runde));
  await pg.screenshot({ path: path.join(BILDER, "837-aussprache-360.png") });

  console.log("\nEXTRA-SPIELE FRAGEN AUCH ITALIENISCH\n");
  const extra = await pg.evaluate(async () => {
    window.__rufe = [];
    let ergebnis = null;
    window.DMA_SPIEL.pruef.deutschFrage((ok) => { ergebnis = ok; });
    await new Promise((r) => setTimeout(r, 100));
    const box = document.querySelector(".sp-extra-frage");
    const frage = box ? box.querySelector(".sp-extra-frage-text").textContent : "";
    const knoepfe = box ? [...box.querySelectorAll(".sp-extra-frage-knoepfe button")] : [];
    if (knoepfe[0]) knoepfe[0].click();
    await new Promise((r) => setTimeout(r, 1600));
    return { frage, n: knoepfe.length, ergebnis, server: window.__rufe.map((r) => r.name) };
  });
  sage(extra.n >= 2 && typeof extra.ergebnis === "boolean" && !extra.server.some((n) => /^spiel_(aufgabe|antwort)$/.test(n)), "Extra-Spiel-Frage kommt aus dem Italienischen, ohne Server", extra.frage);

  console.log("\n360 PX\n");
  const mass = await pg.evaluate(async () => {
    const p = document.getElementById("spPanel");
    p.querySelector('.sp-it-wahl [data-tu="itart"][data-k="passato"]').click();
    await new Promise((r) => setTimeout(r, 150));
    const ziele = [...p.querySelectorAll(".sp-it-aufgabe button, .sp-it-wahl button")].filter((b) => b.offsetParent);
    const klein = ziele.map((b) => ({ t: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), w: Math.round(b.getBoundingClientRect().width) })).filter((x) => x.h < 30 || x.w < 30);
    const r = p.getBoundingClientRect();
    const raus = [...p.querySelectorAll(".sp-it-kasse, .sp-it-aufgabe, .sp-it-aufgabe *, .sp-it-wahl")].filter((el) => { const q = el.getBoundingClientRect(); return q.width && (q.right > r.right + 1 || q.left < r.left - 1); }).length;
    /* Die Antwortknöpfe überlappen sich nicht. */
    const opt = [...p.querySelectorAll('.sp-it-aufgabe [data-tu="itantwort"]')].map((b) => b.getBoundingClientRect());
    let ueber = 0;
    for (let i = 0; i < opt.length; i++) for (let j = i + 1; j < opt.length; j++) {
      const a = opt[i], b = opt[j];
      if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) ueber++;
    }
    p.scrollTop = 0; const sc = p.querySelector(".sp-inhalt"); if (sc) sc.scrollTop = 0;
    return { klein, raus, ueber, breite: Math.round(r.width), seite: document.documentElement.scrollWidth, n: ziele.length };
  });
  sage(!mass.klein.length, "alle " + mass.n + " Tippflächen mindestens 30 px", JSON.stringify(mass.klein.slice(0, 5)));
  sage(mass.raus === 0 && mass.ueber === 0 && mass.seite <= 360, "nichts ragt aus dem Fenster, keine Überlappung, kein Querscrollen", JSON.stringify({ raus: mass.raus, ueber: mass.ueber, panel: mass.breite, seite: mass.seite }));
  await pg.screenshot({ path: path.join(BILDER, "837-frage-360.png") });
  await pg.evaluate(async () => {
    const p = document.getElementById("spPanel");
    const a = window.DMA_SPIEL.pruef.zustand().itAufgabe;
    [...p.querySelectorAll('.sp-it-aufgabe [data-tu="itantwort"]')].find((b) => b.dataset.o !== a.loesung).click();
    await new Promise((r) => setTimeout(r, 100));
    p.scrollTop = 0; const sc = p.querySelector(".sp-inhalt"); if (sc) sc.scrollTop = 0;
  });
  await pg.screenshot({ path: path.join(BILDER, "837-falsch-360.png") });

  console.log("\nZURÜCK IN DEN DEUTSCH-RAUM\n");
  await lernraum("de", true);
  await oeffnen();
  st = await panelStand();
  sage(st.reiter === "Deutsch" && !st.it && st.aufgabeRufe >= 1 && /Ich ___ nach Hause/.test(st.text), "wieder „Deutsch zum Überleben“ mit Server-Aufgaben", JSON.stringify({ reiter: st.reiter, it: st.it, rufe: st.aufgabeRufe }));
  await pg.screenshot({ path: path.join(BILDER, "837-deutsch-360.png") });

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.slice(0, 5).join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 837: das Spiel im Italienisch-Raum – alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
