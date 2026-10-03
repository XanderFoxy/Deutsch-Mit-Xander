#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 875: QUESTS NACH NIVEAU (A1–C2) UND NACH STAND DER
   STADT, ABWECHSLUNG, FREIE ANTWORTEN, BESSERE ERKENNUNG
   ---------------------------------------------------------------------
   XANDER (Funk 257, wörtlich): „die Missionen müssen Variation haben und
   dürfen nicht zu repetitiv sein … vielleicht sind sie auch gekoppelt an
   den gewissen Stand des Dorfes wie das Dorf sich entwickelt so erwachsen
   auch die Aufgaben und Fragen oder die Leute denen man unterwegs begegnet
   z.B ein Wissenschaftler der etwas über den aktuellen Entwicklungsstand
   wissen möchte vielleicht von A1 bis C2 dass man das in den Einstellungen
   hat … dass man das auf seinem Niveau lernen kann zu kommunizieren“ ·
   „dieses fast kannst du nur schreiben wenn er die Grammatik fast richtig
   hat aber dazu muss die Erkennung auch korrekt sein weil er hat meine
   Worte oft nicht richtig erkannt“. Funk 263: „die Spracherkennung von
   Azure … hört so oft falsche Sachen“.

   Geprüft (stadt-leicht.html?demo=1&quest=1, gepackt; Netz nach außen
   gesperrt, Azure nachgestellt über STADT.quests._sprTest):
     A NIVEAU     Vorgabe A2, sonst das Niveau des Spiels (dma_spiel_niveau);
                  der Wähler im Kopf des Quest-Fensters (≥ 30 px), Wahl C1
                  gespeichert und nach dem Neuladen noch da; gewählt wird
                  nie über dem eigenen Niveau, gut die Hälfte auf dem eigenen
     B STAND      neue Missionen nur mit ihrem Gebäude: Sternwarte weg →
                  keine Astronomin; keine Baustelle → kein „Was baut ihr
                  da?“; ohne Labor, Bibliothek, Schule, Sternwarte → keine
                  Forschenden; Labor fertig → die Forscherin kommt „aus dem
                  Labor“; die Fragen lesen die echte Stadt (Zahl der Gebäude,
                  Baustelle, Name der Stadt)
     C ABWECHSLUNG  80 Missionen hintereinander: nie zweimal dieselbe
                  direkt nacheinander, viele verschiedene
     D FREI       mindestens 30 neue Missionen (A1 bis C2), jede mit FREI-
                  Prüfung, Wortliste und Tipp; die richtige Antwort zählt
                  voll, keine falsche; 97 eigene Sätze (davon über 40 neue
                  Formulierungen) richtig angenommen, mit „Fast“ (nur bei
                  Grammatikfehler) oder als falsch abgelehnt
     E ERKENNUNG  die Wortliste geht mit an „erkennen“; sie enthält keine
                  Wörter, die über richtig und falsch entscheiden; verhörte
                  Schlüsselwörter werden nach Klang gezogen („Winter hausen“,
                  „Labo“, „Neu Schwan Stein“), Endungen und Umlaute nie –
                  ein „Fast“ bleibt ein „Fast“; ganzer Ablauf mit Mikrofon
   Mit dem Stand 874 ist das rot (kein Niveau, keine neuen Missionen).
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/pruefe-875-quest-niveau.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
/* [Mission, Satz, Soll (1 | 0.5 | 0 = falsch, zählt als Versuch | "0f" = passt nicht zur Aufgabe, kein Versuch), Vars (fest gesetzt), Ziel] */
const KH = { key: "krankenhaus", g: "das", name: "Krankenhaus" }, LAB = { key: "labor", g: "das", name: "Labor" };
const FAELLE = [
  ["forscher_gibt", "Ja, wir haben ein Krankenhaus.", 1, { haus: KH, da: true }],
  ["forscher_gibt", "Ja, natürlich gibt es hier ein großes Krankenhaus.", 1, { haus: KH, da: true }],
  ["forscher_gibt", "Ja, es gibt hier einen Krankenhaus.", 0.5, { haus: KH, da: true }],
  ["forscher_gibt", "Nein, ein Krankenhaus gibt es nicht.", 0, { haus: KH, da: true }],
  ["forscher_gibt", "Nein, ein Labor haben wir noch nicht.", 1, { haus: LAB, da: false }],
  ["forscher_gibt", "Nein, es gibt hier keinen Labor.", 0.5, { haus: LAB, da: false }],
  ["forscher_gibt", "Ja, wir haben ein Labor.", 0, { haus: LAB, da: false }],
  ["bahnhof_gleis", "Der Zug fährt von Gleis 3 ab.", 1, { gleis: 3 }],
  ["bahnhof_gleis", "Sie müssen zu Gleis drei gehen.", 1, { gleis: 3 }],
  ["bahnhof_gleis", "Er fahrt von Gleis drei.", 0.5, { gleis: 3 }],
  ["bahnhof_gleis", "Der Zug fährt vom dritten Gleis.", 0.5, { gleis: 3 }],
  ["bahnhof_gleis", "Der Zug fährt von Gleis fünf.", 0, { gleis: 3 }],
  ["fischer_fang", "Du hast vier Fische gefangen!", 1, { n: 4 }],
  ["fischer_fang", "Heute hast du 4 Fische gefangen.", 1, { n: 4 }],
  ["fischer_fang", "Das sind vier Fisch.", 0.5, { n: 4 }],
  ["fischer_fang", "Du hast drei Fische gefangen.", 0, { n: 4 }],
  ["krankenhaus_befinden", "Danke, mir geht es heute viel besser.", 1],
  ["krankenhaus_befinden", "Es geht mir nicht so gut, ich bin müde.", 1],
  ["krankenhaus_befinden", "Ich bin gut, danke.", 0.5],
  ["krankenhaus_befinden", "Mich geht es super.", 0.5],
  ["rathaus_stadtname", "Sie heißt Winterhausen.", 1, { name: "Winterhausen" }],
  ["rathaus_stadtname", "Unsere Stadt heißt Winterhausen, ein schöner Name, oder?", 1, { name: "Winterhausen" }],
  ["rathaus_stadtname", "Mein Stadt heißt Winterhausen.", 0.5, { name: "Winterhausen" }],
  ["bau_kran", "Da bauen wir ein neues Labor.", 1, { bau: LAB, neu: true }],
  ["bau_kran", "Dort baut die Stadt einen Labor.", 0.5, { bau: LAB, neu: true }],
  ["bau_kran", "Wir bauen eine neue Bäckerei.", 0, { bau: LAB, neu: true }],
  ["reisende_uebernachten", "Sie können im Gasthaus übernachten, da gibt es Zimmer.", 1],
  ["reisende_uebernachten", "Im Gasthaus Sie können schlafen.", 0.5],
  ["reisende_uebernachten", "Gehen Sie ins Hotel.", "0f"],
  ["krankenhaus_besuch", "Von 14 bis 18 Uhr darfst du sie besuchen.", 1, { zeit: [14, 18] }],
  ["krankenhaus_besuch", "Du kannst sie von zwei bis sechs besuchen.", 1, { zeit: [14, 18] }],
  ["krankenhaus_besuch", "Seit 14 bis 18 Uhr kannst du kommen.", 0.5, { zeit: [14, 18] }],
  ["bibliothek_ausleihe", "Drei Wochen dürfen Sie es behalten.", 1, { wochen: 3 }],
  ["bibliothek_ausleihe", "Das Buch dürfen Sie drei Woche behalten.", 0.5, { wochen: 3 }],
  ["brauerei_fuehrung", "Die nächste Führung fängt um 15 Uhr an.", 1, { h: 15 }],
  ["brauerei_fuehrung", "Um drei Uhr nachmittags geht es los.", 1, { h: 15 }],
  ["brauerei_fuehrung", "Die Führung beginnt am fünfzehn Uhr.", 0.5, { h: 15 }],
  ["forscher_veraendert", "Wir haben eine Schule gebaut und die Bibliothek ist größer geworden.", 1],
  ["forscher_veraendert", "In letzter Zeit sind wir eine Bäckerei gebaut.", 0.5],
  ["forscher_veraendert", "Wir haben ein Labor gebaut.", 0],
  ["forscher_veraendert", "Wir bauen viele Häuser.", "0f"],
  ["reisende_empfehlung", "Den Fernsehturm müssen Sie sehen, denn die Aussicht ist toll.", 1],
  ["reisende_empfehlung", "Schauen Sie sich das Holstentor an, weil es sehr alt ist.", 1],
  ["reisende_empfehlung", "Sie sollten sich den Kölner Dom ansehen, weil er ist sehr groß.", 0.5],
  ["reisende_empfehlung", "Gehen Sie unbedingt zum Eiffelturm.", "0f"],
  ["fischer_wetter", "Wenn es regnet, nehmen Sie eine Regenjacke mit.", 1],
  ["fischer_wetter", "Bei Regen sollten Sie lieber zu Hause bleiben.", 1],
  ["fischer_wetter", "Wenn es regnet, Sie müssen zu Hause bleiben.", 0.5],
  ["gasthaus_beschwerde", "Entschuldigung, meine Suppe ist kalt. Würden Sie sie bitte aufwärmen?", 1],
  ["gasthaus_beschwerde", "Die Suppe ist kalt, bringen Sie mir schnell eine andere.", 0.5],
  ["rathaus_anmelden", "Zuerst müssen Sie sich beim Bürgeramt anmelden.", 1],
  ["rathaus_anmelden", "Sie müssen Ihren Wohnsitz im Rathaus anmelden.", 1],
  ["rathaus_anmelden", "Sie müssen im Rathaus anmelden, das ist wichtig.", 0.5],
  ["schule_wozu", "Die Kinder lernen dort lesen und schreiben, deshalb brauchen wir eine Schule.", 1],
  ["schule_wozu", "Damit die Kinder können zusammen spielen und lernen.", 0.5],
  ["forscher_bauen", "Ich finde, die Stadt sollte ein Labor bauen, denn Forschung ist wichtig.", 1],
  ["forscher_bauen", "Meiner Meinung nach wir brauchen mehr Parks, weil Kinder draußen spielen wollen.", 0.5],
  ["forscher_bauen", "Ich glaube, wir sollten eine Bäckerei bauen, weil Brot wichtig ist.", 0],
  ["reisende_zug_auto", "An Ihrer Stelle würde ich mit dem Zug fahren, da man unterwegs lesen kann.", 1],
  ["reisende_zug_auto", "Ich würde das Auto nehmen, weil es schneller wie der Zug ist.", 0.5],
  ["reisende_zug_auto", "Ich würde den Zug genommen, weil er bequemer ist.", 0.5],
  ["brauerei_laerm", "Ich verstehe Sie, aber die Brauerei ist wichtig für die Arbeitsplätze.", 1],
  ["brauerei_laerm", "Obwohl es manchmal laut ist, ich finde die Brauerei gut.", 0.5],
  ["krankenhaus_rat", "Ich würde an Ihrer Stelle weniger arbeiten und mehr schlafen.", 1],
  ["krankenhaus_rat", "An Ihrer Stelle ich würde Urlaub machen.", 0.5],
  ["rathaus_verkehr", "Man könnte mehr Busse einsetzen, damit weniger Autos in die Stadt kommen.", 1],
  ["rathaus_verkehr", "Es müssten mehr Radwege gebaut worden.", 0.5],
  ["bibliothek_internet", "Natürlich, denn dort bekommt man Hilfe und kann in Ruhe lesen.", 1],
  ["bibliothek_internet", "Ja, weil dort kann man in Ruhe arbeiten.", 0.5],
  ["forscher_stand", "Die Stadt ist gut entwickelt, aber es fehlt noch ein Labor für die Forschung.", 1],
  ["forscher_stand", "Insgesamt ist die Stadt solide aufgestellt, Bedarf sehe ich bei einer zweiten Schule.", 1],
  ["forscher_stand", "Die Stadt ist weit entwickelt, aber es mangelt an ein Labor.", 0.5],
  ["forscher_stand", "Die Stadt ist schon weit, aber es fehlt eine Schule.", 0],
  ["bahnhof_ausbau", "Mehr Touristen könnten kommen und Pendler wären schneller in der Stadt, das wäre ein großer Vorteil.", 1],
  ["bahnhof_ausbau", "Die Betriebe könnten schneller beliefert worden.", 0.5],
  ["forschung_geld", "Ich stimme zu, aber das Geld sollte auch in die Schulen fließen.", 1],
  ["forschung_geld", "Zwar Forschung ist teuer, aber sie lohnt sich.", 0.5],
  ["forschung_geld", "Wir sollten lieber in der Bildung investieren, weil sie die Zukunft ist.", 0.5],
  ["rathaus_antrag", "Ich möchte hiermit eine Genehmigung für ein Straßenfest am Samstag beantragen.", 1],
  ["rathaus_antrag", "Hey, ich will ein Straßenfest machen.", 0.5],
  ["krankenhaus_personal", "Man sollte die Gehälter erhöhen und mehr Pflegekräfte im Ausland anwerben.", 1],
  ["krankenhaus_personal", "Ich schlage vor, die Bezahlung verbessern.", 0.5],
  ["sternwarte_licht", "Man könnte die Lampen nachts ausschalten oder nach unten richten.", 1],
  ["sternwarte_licht", "Man sollte die Laternen gedimmt werden.", 0.5],
  ["forscher_hypothese", "Vermutlich wäre die Stadt heute moderner, aber vielleicht auch teurer.", 1],
  ["forscher_hypothese", "Wenn man mehr geforscht hätte, die Stadt wäre reicher.", 0.5],
  ["forscher_hypothese", "Die Stadt ist bestimmt besser.", "0f"],
  ["bahnhof_ironie", "Ach, typisch Bahn – wollen wir solange einen Kaffee trinken?", 1],
  ["bahnhof_ironie", "Ja, die Bahn ist immer pünktlich.", 0],
  ["bahnhof_ironie", "Wir können die Zeit im Café vertreiben.", 0.5],
  ["brauerei_konzern", "Ich würde das Angebot nur annehmen, wenn das Rezept im Vertrag steht.", 1],
  ["brauerei_konzern", "Ich rate Ihnen dafür, es zu verkaufen.", 0.5],
  ["rathaus_zeitung", "Laut dem Stadtforscher wächst die Stadt schnell, es fehlt aber eine Umgehungsstraße.", 1, { fehlt: { key: "umgehung", g: "die", name: "Umgehungsstraße" } }],
  ["rathaus_zeitung", "Er sagte, die Stadt wächst schnell.", 0.5, { fehlt: { key: "umgehung", g: "die", name: "Umgehungsstraße" } }],
  ["rathaus_zeitung", "Der Forscher erklärte, die Stadt wachse rasant und es fehle eine Umgehungsstraße.", 1, { fehlt: { key: "umgehung", g: "die", name: "Umgehungsstraße" } }],
  ["bergwerk_wandel", "Das verstehe ich gut. Vielleicht könnte man Führungen für Touristen anbieten.", 1],
  ["bergwerk_wandel", "Man könnte Solaranlagen bauen, sodass entstehen neue Jobs.", 0.5]
];
const NEU_JE_NIVEAU = { A1: 5, A2: 5, B1: 6, B2: 6, C1: 6, C2: 5 };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  const ende = async () => { await br.close(); srv.close(); console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0); };
  try {
    const ctx = await br.newContext({ viewport: { width: 400, height: 720 }, permissions: ["microphone"] });
    /* nichts nach außen: nur der eigene Server */
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
    const pf = []; pg.on("pageerror", (e) => pf.push(e.message));
    const URL_STADT = basis + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&uhr=12:00&quest=1&questnur=1";
    const laden = async () => {
      await pg.goto(URL_STADT);
      await pg.waitForFunction(() => window.__fertig && window.STADT && STADT.quests && STADT.quests.pruef && STADT.quests.sprechen, null, { timeout: 180000 });
      await pg.evaluate(() => { STADT.quests.pruef.schnell(4); });
    };
    const Q = (fn, arg) => pg.evaluate(fn, arg);
    const leeren = () => Q(() => { const Q = STADT.quests; Q.dialogZu(); Q.liste.slice().forEach((q) => { if (q.el) q.el.remove(); }); Q.liste.length = 0; });
    const warte = async (id, zs, ms) => { const t0 = Date.now(); while (Date.now() - t0 < (ms || 60000)) { const z = await Q((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return q ? q.zustand : "fort"; }, id); if (zs.indexOf(z) >= 0) return z; await pg.waitForTimeout(120); } return null; };
    await laden();
    const da = await Q(() => typeof STADT.quests.pruef.niveau === "function");
    sage(da, "quests.js hat Niveau und Stand (STADT.quests.pruef.niveau)");
    if (!da) { console.log(pf.join("\n")); return ende(); }

    console.log("\nA  NIVEAU A1–C2\n");
    const vorgabe = await Q(() => { localStorage.removeItem("dma_quest_niveau"); localStorage.removeItem("dma_spiel_niveau"); const a = STADT.quests.pruef.niveau();
      localStorage.setItem("dma_spiel_niveau", "B2"); const b = STADT.quests.pruef.niveau(); localStorage.removeItem("dma_spiel_niveau"); return { ohne: a, spiel: b }; });
    sage(vorgabe.ohne === "A2" && vorgabe.spiel === "B2", "Vorgabe: A2 – oder das Niveau, das im Spiel eingestellt ist", JSON.stringify(vorgabe));
    await leeren();
    const id1 = await Q(() => STADT.quests.pruef.neu("forscher_gibt"));
    await warte(id1, ["wartet"], 120000);
    await Q((i) => STADT.quests.pruef.tipp(i), id1);
    await pg.waitForFunction(() => document.querySelector(".lq-dialog .lq-niv"), null, { timeout: 20000 }).catch(() => {});
    const knopf = await Q(() => { const b = document.querySelector(".lq-dialog .lq-niv"); if (!b) return null; const r = b.getBoundingClientRect(); return { text: b.textContent, w: Math.round(r.width), h: Math.round(r.height), titel: b.title, kopf: !!b.closest(".lq-kopf") }; });
    sage(!!knopf && knopf.text === "A2" && knopf.w >= 30 && knopf.h >= 30 && knopf.kopf, "im Kopf des Quest-Fensters steht klein das Niveau („A2“, Tippfläche ≥ 30 px)", JSON.stringify(knopf));
    await pg.waitForTimeout(700);   // (Klicks in den ersten 0,5 s nach dem Aufgehen zählen als Geisterklick, Fassung 813)
    await Q(() => document.querySelector(".lq-dialog .lq-niv").click());
    const reihe = await Q(() => { const r = document.querySelector(".lq-dialog .lq-niveaus"); return r ? Array.from(r.querySelectorAll("button")).map((b) => { const x = b.getBoundingClientRect(); return [b.textContent, Math.round(x.width), Math.round(x.height), b.classList.contains("lq-an")]; }) : null; });
    sage(!!reihe && reihe.map((x) => x[0]).join() === "A1,A2,B1,B2,C1,C2" && reihe.every((x) => x[1] >= 30 && x[2] >= 30) && reihe[1][3], "Tipp darauf: A1 · A2 · B1 · B2 · C1 · C2 zur Wahl (≥ 30 px), das eigene markiert", JSON.stringify(reihe));
    await Q(() => document.querySelector('.lq-dialog .lq-niveaus button[data-niv="C1"]').click());
    const gewaehlt = await Q(() => ({ speicher: localStorage.getItem("dma_quest_niveau"), knopf: document.querySelector(".lq-dialog .lq-niv").textContent, text: (document.querySelector(".lq-niv-text") || {}).textContent, niveau: STADT.quests.pruef.niveau() }));
    sage(gewaehlt.speicher === "C1" && gewaehlt.knopf === "C1" && gewaehlt.niveau === "C1", "C1 gewählt: im Browser gespeichert, der Knopf zeigt C1", JSON.stringify(gewaehlt));
    await laden();
    await leeren();
    const id2 = await Q(() => STADT.quests.pruef.neu("bahnhof_gleis"));
    await warte(id2, ["wartet"], 120000);
    await Q((i) => STADT.quests.pruef.tipp(i), id2);
    await pg.waitForFunction(() => document.querySelector(".lq-dialog .lq-niv"), null, { timeout: 20000 }).catch(() => {});
    const nachLaden = await Q(() => ({ niveau: STADT.quests.pruef.niveau(), knopf: (document.querySelector(".lq-dialog .lq-niv") || {}).textContent }));
    sage(nachLaden.niveau === "C1" && nachLaden.knopf === "C1", "nach dem Neuladen gilt weiter C1", JSON.stringify(nachLaden));
    await leeren();
    const vert = await Q(() => {
      const P = STADT.quests.pruef, N = ["A1", "A2", "B1", "B2", "C1", "C2"], aus = {};
      for (const n of N) { P.niveau(n); const z = P.waehlenIds(2000), je = {}; for (const id in z) { const l = P.niveauVon(id); je[l] = (je[l] || 0) + z[id]; } aus[n] = je; }
      P.niveau("C1"); return aus;
    });
    const N = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const ueber = N.filter((n, i) => Object.keys(vert[n]).some((l) => N.indexOf(l) > i));
    const anteil = N.map((n) => [n, Math.round((vert[n][n] || 0) / 20)]);
    sage(!ueber.length, "nie eine Mission über dem eigenen Niveau (je 2000 Wahlen)", ueber.join(",") || "");
    sage(anteil.every((x) => x[1] >= 45) && anteil.every((x, i) => !i || Object.keys(vert[x[0]]).length >= 2), "Schwerpunkt auf dem eigenen Niveau (≥ 45 %), darunter gemischt", JSON.stringify(anteil));

    console.log("\nB  MISSIONEN NACH STAND DER STADT\n");
    const st = await Q(() => STADT.quests.pruef.stadt());
    sage(st.da.indexOf("sternwarte") >= 0 && st.bau.some((b) => b.key === "labor") && st.name === "Winterhausen" && st.haeuser >= 10,
      "die Stadt wird gelesen: Sternwarte steht, Labor im Bau, Name Winterhausen, " + st.haeuser + " fertige Häuser", JSON.stringify({ bau: st.bau, wunder: st.wunder }));
    const mitOhne = async (titel, verstecken, ids, niveau) => {
      const r = await Q(([verst, ids, niv]) => {
        const P = STADT.quests.pruef, SZ = STADT.szene; P.niveau(niv);
        /* (die Merkliste leeren: was pruef.neu eben gestellt hat, käme sonst nicht direkt noch einmal – das ist Absicht, Teil C) */
        const zaehl = () => { Object.keys(localStorage).filter((x) => /^leicht_quest_v1/.test(x)).forEach((x) => localStorage.removeItem(x)); P.stadt(); const z = P.waehlenIds(1500); return ids.reduce((s, id) => s + (z[id] || 0), 0); };
        const neuGeht = () => ids.map((id) => { const i = P.neu(id); const qu = STADT.quests.liste.find((x) => x.id === i); STADT.quests.liste.length = 0; return !!qu; });
        const vorher = zaehl(), baueVorher = neuGeht();
        const merk = [];
        for (const o of SZ.objekte) if (o.art === "haus" && verst.haus.indexOf(o.spiel) >= 0 && !o.versteckt) { o.versteckt = true; merk.push([o, "v"]); }
        for (const o of SZ.objekte) if (verst.bau && o.bau) { merk.push([o, "b", o.bau]); o.bau = null; if (!o.stufenZahl) { o.versteckt = true; merk.push([o, "v"]); } }
        const ohne = zaehl(), baueOhne = neuGeht();
        for (const m of merk) { if (m[1] === "v") m[0].versteckt = false; else m[0].bau = m[2]; }
        const danach = zaehl();
        return { vorher, ohne, danach, baueVorher, baueOhne };
      }, [verstecken, ids, niveau]);
      sage(r.vorher > 0 && r.ohne === 0 && r.danach > 0 && r.baueVorher.every(Boolean) && !r.baueOhne.some(Boolean), titel, JSON.stringify(r));
    };
    await mitOhne("Sternwarte weg → keine Astronomin (sternwarte_licht kommt nicht und lässt sich nicht bauen); wieder da → sie kommt", { haus: ["sternwarte"] }, ["sternwarte_licht"], "C1");
    await mitOhne("keine Baustelle → kein „Was baut ihr da?“; mit Baustelle → es kommt", { haus: [], bau: true }, ["bau_kran"], "A2");
    await mitOhne("ohne Labor, Bibliothek, Schule und Sternwarte → keine Forscherin, kein Wissenschaftler (A1 bis C2)", { haus: ["labor", "bibliothek", "schule", "sternwarte"] },
      ["forscher_gibt", "forscher_veraendert", "forscher_bauen", "forscher_stand", "forscher_hypothese", "forschung_geld"], "C2");
    const labor = await Q(() => {
      const o = STADT.szene.objekte.find((x) => x.art === "haus" && x.spiel === "labor"); const alt = [o.bau, o.stufenZahl]; o.bau = null; o.stufenZahl = 1;
      STADT.quests.pruef.stadt(); STADT.quests.liste.length = 0;
      const i = STADT.quests.pruef.neu("forscher_gibt", { ziel: "labor" }), qu = STADT.quests.liste.find((x) => x.id === i);
      const r = qu ? { text: qu.text, ziel: qu.ziel.key } : null; STADT.quests.liste.length = 0; o.bau = alt[0]; o.stufenZahl = alt[1]; STADT.quests.pruef.stadt(); return r;
    });
    sage(!!labor && labor.ziel === "labor" && /aus dem Labor/.test(labor.text), "Labor fertig gebaut → die Forscherin kommt aus dem Labor", labor && labor.text);
    const lesen = await Q(() => {
      const P = STADT.quests.pruef, Qs = STADT.quests, r = {};
      for (const id of ["forscher_stand", "bau_kran", "rathaus_stadtname"]) { Qs.liste.length = 0; const i = P.neu(id), qu = Qs.liste.find((x) => x.id === i); r[id] = qu ? { text: qu.text, antworten: qu.antworten.map((a) => a.html) } : null; }
      Qs.liste.length = 0; r.haeuser = P.stadt().haeuser; return r;
    });
    sage(!!lesen.forscher_stand && lesen.forscher_stand.text.indexOf(lesen.haeuser + " Gebäude") >= 0 && /im Bau: Labor/.test(lesen.forscher_stand.text), "C1-Forscherin nennt die echte Zahl der Gebäude und die Baustelle", lesen.forscher_stand && lesen.forscher_stand.text.slice(-70));
    sage(!!lesen.bau_kran && lesen.bau_kran.antworten.some((a) => /bauen gerade ein Labor/.test(a)), "„Was baut ihr da?“ – die Antwort nennt das Gebäude, das gerade gebaut wird", lesen.bau_kran && lesen.bau_kran.antworten[0]);
    sage(!!lesen.rathaus_stadtname && lesen.rathaus_stadtname.antworten.some((a) => /Meine Stadt heißt Winterhausen/.test(a)), "im Rathaus: der Name der eigenen Stadt", lesen.rathaus_stadtname && lesen.rathaus_stadtname.antworten[0]);

    console.log("\nC  ABWECHSLUNG\n");
    const folge = await Q(() => {
      const P = STADT.quests.pruef, k = Object.keys(localStorage).filter((x) => /^leicht_quest_v1/.test(x)); k.forEach((x) => localStorage.removeItem(x));
      const r = {};
      for (const n of ["A2", "C2"]) { P.niveau(n); const f = P.folge(80); let doppelt = 0; for (let i = 1; i < f.length; i++) if (f[i] === f[i - 1]) doppelt++; r[n] = { doppelt, verschieden: new Set(f).size }; }
      r.gemerkt = P.stand().letzte.length; P.niveau("C1"); return r;
    });
    sage(folge.A2.doppelt === 0 && folge.C2.doppelt === 0, "80 Missionen hintereinander (A2 und C2): nie zweimal dieselbe direkt nacheinander", JSON.stringify(folge));
    sage(folge.A2.verschieden >= 25 && folge.C2.verschieden >= 25 && folge.gemerkt === 12, "viele verschiedene (≥ 25 von 80), die letzten zwölf werden gemerkt", JSON.stringify(folge));

    console.log("\nD  NEUE MISSIONEN UND FREIE ANTWORTEN\n");
    const bib = await Q(() => {
      const Qs = STADT.quests, neu = Qs.VORLAGEN.filter((v) => v.pruefe), je = {}, probleme = [];
      for (const v of neu) {
        je[v.niveau] = (je[v.niveau] || 0) + 1;
        if (!v.woerter || !v.frei || !v.titel || !v.person) probleme.push(v.id + ": ohne Wortliste/Tipp");
        Qs.liste.length = 0; const i = Qs.pruef.neu(v.id), qu = Qs.liste.find((x) => x.id === i);
        if (!qu) { probleme.push(v.id + ": nicht gebaut"); continue; }
        if (qu.antworten.filter((a) => a.richtig).length !== 1 || new Set(qu.antworten.map((a) => a.html)).size !== 3) probleme.push(v.id + ": nicht genau eine richtige von drei Antworten");
        for (const a of qu.antworten) {
          const satz = a.html.replace(/<[^>]+>/g, "").replace(/[„“]/g, ""), e = Qs.sprechen.pruefen(qu, [satz]), f = Qs.freiPruefen(qu, satz);
          if (a.richtig ? e.stufe !== 1 || !f || f.stufe !== 1 : e.stufe === 1 || !f || f.stufe === 1) probleme.push(v.id + ": „" + satz + "“ → " + e.stufe + "/" + (f && f.stufe));
        }
      }
      Qs.liste.length = 0;
      return { n: neu.length, je, probleme, alle: Qs.VORLAGEN.length, ohneNiveau: Qs.VORLAGEN.filter((v) => ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(v.niveau) < 0).map((v) => v.id) };
    });
    sage(bib.n >= 30 && Object.keys(NEU_JE_NIVEAU).every((n) => (bib.je[n] || 0) >= NEU_JE_NIVEAU[n]) && !bib.ohneNiveau.length, bib.n + " neue Missionen über A1–C2 verteilt, jede Mission hat ein Niveau (" + bib.alle + " insgesamt)", JSON.stringify(bib.je));
    sage(!bib.probleme.length, "jede neue Mission: FREI-Prüfung, Wortliste, Tipp; die richtige Antwort zählt voll, jede falsche wird erkannt", bib.probleme.slice(0, 5).join(" | "));
    const erg = await Q((faelle) => faelle.map(([id, satz, soll, vars, ziel]) => {
      const Qs = STADT.quests; Qs.liste.length = 0;
      const i = Qs.pruef.neu(id, ziel ? { ziel } : undefined), qu = Qs.liste.find((x) => x.id === i);
      if (!qu) return { id, satz, soll, ist: "keine Quest" };
      if (vars) Object.assign(qu.vars, vars);
      const e = Qs.sprechen.pruefen(qu, [satz]); Qs.liste.length = 0;
      return { id, satz, soll, ist: e.stufe === 0 && e.ohneVersuch ? "0f" : e.stufe, grund: e.grund };
    }), FAELLE);
    let gut = 0;
    for (const r of erg) { if (String(r.ist) === String(r.soll)) gut++; else console.log("     ✗ " + r.id + ": „" + r.satz + "“ → " + r.ist + " (soll " + r.soll + ")  " + (r.grund || "")); }
    const richtig = erg.filter((r) => r.soll === 1).length, fast = erg.filter((r) => r.soll === 0.5).length, abgelehnt = erg.length - richtig - fast;
    sage(gut === erg.length && erg.length >= 40, "eigene Sätze: " + richtig + " richtig angenommen, " + fast + " „Fast“ (Grammatikfehler), " + abgelehnt + " abgelehnt (stimmt nicht / passt nicht)", gut + "/" + erg.length);
    const fastGrund = erg.filter((r) => r.soll === 0.5);
    sage(fastGrund.every((r) => /^(Fast!|Inhaltlich)/.test(r.grund || "")), "„Fast“ nennt den Fehler und wie es richtig heißt", fastGrund.slice(0, 3).map((r) => r.grund).join(" | "));
    const ohneV = erg.filter((r) => r.soll === "0f");
    sage(ohneV.length >= 3 && ohneV.every((r) => r.ist === "0f"), "was nicht zur Aufgabe passt (Hotel, Eiffelturm, kein Perfekt …), kostet keinen Versuch", ohneV.map((r) => r.id).join(", "));

    console.log("\nE  ERKENNUNG\n");
    const wl = await Q(() => {
      const Qs = STADT.quests, P = Qs.pruef, r = {};
      for (const id of ["fischer_fang", "plural_aepfel", "baeckerei", "rathaus_stadtname", "bahnhof_gleis", "brauerei_fuehrung", "bahnhof_ironie"]) { Qs.liste.length = 0; const i = P.neu(id); r[id] = { liste: P.wortliste(i), vars: P.vars(i) }; }
      Qs.liste.length = 0; return r;
    });
    sage(wl.fischer_fang.liste.indexOf("Fische") < 0 && wl.plural_aepfel.liste.indexOf("Äpfel") < 0 && wl.baeckerei.liste.indexOf("Brötchen") < 0 && wl.bahnhof_gleis.liste.every((w) => !/^fährt$/i.test(w)),
      "die Wortliste lässt Wörter weg, die über richtig und falsch entscheiden („Fische“/„Fisch“, „Äpfel“/„Apfel“, „Brötchen“/„Brötchens“)", JSON.stringify({ fisch: wl.fischer_fang.liste, aepfel: wl.plural_aepfel.liste }));
    sage(wl.rathaus_stadtname.liste.indexOf("Winterhausen") >= 0 && wl.bahnhof_gleis.liste.indexOf(wl.bahnhof_gleis.vars.stadt) >= 0 && wl.brauerei_fuehrung.liste.indexOf("Führung") >= 0 && wl.bahnhof_ironie.liste.indexOf("Geduld") >= 0,
      "sie enthält, was Azure oft verhört: den Namen der Stadt, die Zielstadt, die Schlüsselwörter der Mission", JSON.stringify({ rathaus: wl.rathaus_stadtname.liste, gleis: wl.bahnhof_gleis.liste }));
    const an = await Q(() => {
      const A = STADT.quests.sprechen.anpassen;
      return { schwan: A("Ich war beim Neu Schwan Stein.", ["Schloss Neuschwanstein"]), rad: A("Gehen Sie zum Rad aus.", ["Rathaus"]), labo: A("Wir bauen gerade ein Labo.", ["Labor"]), winter: A("Meine Stadt heißt Winter hausen.", ["Winterhausen"]),
        broetchens: A("Ich hätte gern vier Brötchens.", ["Brötchen"]), fahrt: A("Der Zug fahrt von Gleis drei.", ["fährt"]), kilos: A("Zwei Kilos Mehl.", ["Kilo"]), immer: A("Das mache ich immer so.", ["Eimer"]), moechten: A("Ich möchten ein Eis.", ["möchte"]) };
    });
    sage(/Neuschwanstein/.test(an.schwan || "") && /Rathaus/.test(an.rad || "") && /Labor/.test(an.labo || "") && /Winterhausen/.test(an.winter || ""),
      "Lautähnlichkeit: „Neu Schwan Stein“ → Neuschwanstein, „Rad aus“ → Rathaus, „Labo“ → Labor, „Winter hausen“ → Winterhausen", JSON.stringify([an.schwan, an.rad, an.labo, an.winter]));
    sage(!an.broetchens && !an.fahrt && !an.kilos && !an.immer && !an.moechten, "nie angefasst: Endungen, Umlaute, Verbformen, Funktionswörter („Brötchens“, „fahrt“, „Kilos“, „möchten“, „immer“)", JSON.stringify(an));
    const zug = await Q(() => {
      const Qs = STADT.quests, P = Qs.pruef, r = {}, mit = (id, satz, vars, ziel) => { Qs.liste.length = 0; const i = P.neu(id, ziel ? { ziel } : undefined), qu = Qs.liste.find((x) => x.id === i); if (!qu) return null; if (vars) Object.assign(qu.vars, vars); const e = Qs.sprechen.pruefen(qu, [satz]); return { s: e.stufe, angepasst: !!e.angepasst, t: e.text }; };
      r.stadtname = mit("rathaus_stadtname", "Meine Stadt heißt Winter hausen.");
      r.labor = mit("bau_kran", "Wir bauen gerade ein Labo.", { bau: { key: "labor", g: "das", name: "Labor" }, neu: true });
      r.schloss = mit("reisende_empfehlung", "Sie sollten sich das Schloss Neu Schwan Stein ansehen, weil es wunderschön ist.", null, "neuschwanstein");
      r.fisch = mit("fischer_fang", "Du hast vier Fisch gefangen.", { n: 4 });
      r.eis = mit("eis", "Ich möchten bitte eine Kugel Erdbeereis.");
      r.mehl = mit("mehl", "Ich brauche zwei Kilos Mehl.");
      Qs.liste.length = 0; return r;
    });
    sage(zug.stadtname && zug.stadtname.s === 1 && zug.stadtname.angepasst && zug.labor && zug.labor.s === 1 && zug.schloss && zug.schloss.s === 1,
      "verhört, aber richtig gesagt → volle Punkte („Winter hausen“, „Labo“, „Neu Schwan Stein“)", JSON.stringify([zug.stadtname, zug.labor, zug.schloss]));
    sage(zug.fisch && zug.fisch.s === 0.5 && zug.eis && zug.eis.s === 0.5 && zug.mehl && zug.mehl.s === 0.5, "ein echter Grammatikfehler bleibt „Fast“ (Fisch, möchten, Kilos)", JSON.stringify([zug.fisch, zug.eis, zug.mehl]));
    /* der ganze Ablauf: Mikrofon (Probe-Mikro), Azure nachgestellt – die Wortliste geht mit, das verhörte Wort wird gezogen */
    await leeren();
    const id3 = await Q(() => STADT.quests.pruef.neu("rathaus_stadtname"));
    await warte(id3, ["wartet"], 120000);
    await Q(() => {
      window.__azure = [];
      STADT.quests._sprTest = (k, roh) => {
        window.__azure.push({ aktion: k.aktion, phrasen: k.phrasen || null });
        if (k.aktion === "erkennen") return new Promise((ok) => setTimeout(() => ok({ RecognitionStatus: "Success", DisplayText: "Meine Stadt heißt Winter hausen.", NBest: [{ Display: "Meine Stadt heißt Winter hausen.", Lexical: "meine stadt heißt winter hausen" }] }), 150));
        return Promise.resolve(new Blob([new Uint8Array(10)], { type: "audio/mpeg" }));
      };
    });
    await Q((i) => STADT.quests.pruef.tipp(i), id3);
    await pg.waitForFunction(() => document.querySelector(".lq-dialog .lq-mik button"), null, { timeout: 20000 }).catch(() => {});
    await pg.waitForTimeout(700);
    await Q(() => { const b = document.querySelector(".lq-dialog .lq-mik button"); if (b) b.click(); });
    await pg.waitForFunction(() => { const b = document.querySelector(".lq-dialog .lq-mik button"); return b && /Ich höre zu/.test(b.textContent); }, null, { timeout: 8000 }).catch(() => {});
    await Q(() => { const b = document.querySelector(".lq-dialog .lq-mik button"); if (b) b.click(); });
    await warte(id3, ["unterwegs", "jubel", "geht", "fort"], 30000);
    const ab = await Q((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return { zustand: q ? q.zustand : "fort", azure: window.__azure, du: (document.querySelector(".lq-mik-status") || {}).textContent || "", gesprochen: (STADT.quests.liste.find((x) => x.id === i) || {}).gesprochen }; }, id3);
    const er = ab.azure.find((x) => x.aktion === "erkennen");
    sage(!!er && Array.isArray(er.phrasen) && er.phrasen.indexOf("Winterhausen") >= 0 && er.phrasen.indexOf("Rathaus") >= 0, "„erkennen“ bekommt die Wortliste der Mission mit (für eine Phrase List am Server)", JSON.stringify(er && er.phrasen));
    sage(/unterwegs|jubel|geht|fort/.test(ab.zustand) && /Winterhausen/.test(ab.du) && ab.gesprochen === 1, "Azure hört „Winter hausen“ – die Stadt versteht „Winterhausen“, volle Punkte, die Beamtin geht los", JSON.stringify({ zustand: ab.zustand, du: ab.du.slice(0, 70), gesprochen: ab.gesprochen }));
    await Q(() => { STADT.quests.sprechen.stopp(); STADT.quests._sprTest = null; });

    console.log("\nF  SONST\n");
    const quell = fs.readFileSync(path.join(WURZEL, "stadt-leicht/quests.js"), "utf8"), mini = fs.readFileSync(path.join(WURZEL, "stadt-leicht/quests.min.js"), "utf8");
    sage(/FASSUNG 875/.test(quell) && /dma_quest_niveau/.test(mini) && /forscher_stand/.test(mini), "quests.min.js ist gepackt (Niveau und neue Missionen drin)");
    sage(!pf.length, "keine Seitenfehler", pf.join(" | ").slice(0, 300));
  } catch (e) { sage(false, "Sonde abgebrochen", String(e.message || e).split("\n")[0]); }
  return ende();
})();
