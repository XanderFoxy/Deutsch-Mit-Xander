#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 828 (Arbeitsnummer 848): IN DER STADT SPRECHEN
   ---------------------------------------------------------------------
   XANDER (Funk 249, wörtlich): „ein System … auf der Basis von Azure …
   wo wir innerhalb der Stadtmissionen … in echt mit den Menschen
   sprechen … nachdem die Person dich gefragt hat in der Mission
   antwortest du einfach was du antworten möchtest und das System
   erkennt dann ob es logisch ist … wenn einer dieser Sätze getriggert
   wird dann kriegt man die Punktzahl bzw kriege nur eine halbe
   Punktzahl wenn es nur in etwa der Satz ist".

   Geprüft (stadt-leicht.html?demo=1&quest=1, Azure nachgestellt über
   STADT.quests._sprTest, Mikrofon: Chromiums Probe-Mikro):
     A PRÜFEN   Wegbeschreibung: der richtige Satz der Quest und eine
                frei formulierte Fassung („Du gehst … dann …") → ganz;
                nur die Richtungswörter → halb; falsche Richtung → 0 mit
                roter Linie; Lage („… ist neben dem …" mit einem nahen
                Haus) → ganz, mit einem fernen Haus → 0; Unverstandenes
                → -1. Andere Quest (Uhrzeit): richtige Antwort ganz,
                ungefähr halb, falsche 0.
     B ABLAUF   im Dialog steht „🎤 Antwort sprechen"; Tipp → das Mikro
                hört zu (Knopf rot), Azure „erkennen" bekommt eine WAV
                (16 kHz, RIFF), die Antwort wird gezeigt, die Person geht
                los, Punkte mit Sprech-Bonus; danach geht das Mikro beim
                nächsten Dialog nach der vorgelesenen Frage von selbst an.
     C SERVER   supabase/functions/aussprache: Aktion „erkennen" (ohne
                Pronunciation-Assessment), Männerstimme für „stimme: m";
                spiel.js: der Rahmen darf das Mikrofon benutzen.
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/pruefe-848-sprechen.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

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
    const ctx = await br.newContext({ viewport: { width: 900, height: 640 }, permissions: ["microphone"] });
    const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
    const pf = []; pg.on("pageerror", (e) => pf.push(e.message));
    await pg.goto(basis + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&uhr=12:00&quest=1&questnur=1");
    await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
    await pg.waitForFunction(() => window.STADT && STADT.quests && STADT.quests.pruef && STADT.quests.sprechen, null, { timeout: 60000 }).catch(() => {});
    const da = await pg.evaluate(() => !!(STADT.quests && STADT.quests.sprechen && STADT.quests.sprechen.pruefen));
    sage(da, "quests.js hat den Sprech-Teil (STADT.quests.sprechen)");
    if (!da) { console.log(pf.join("\n")); return ende(); }
    await pg.evaluate(() => STADT.quests.pruef.schnell(4));

    console.log("\nA  PRÜFEN\n");
    const id = await pg.evaluate(() => STADT.quests.pruef.neu("weg_bahnhof"));
    const A = await pg.evaluate((i) => {
      const Q = STADT.quests, qu = Q.liste.find((x) => x.id === i), P = Q.sprechen.pruefen;
      const richtig = qu.antworten.find((a) => a.richtig).html.replace(/<[^>]+>/g, "");
      const kl = qu.route.schritte.map((x) => x.k);
      const frei = "Du gehst hier " + kl.map((k, j) => (j ? "und an der nächsten Kreuzung " : "bis zur Kreuzung und dann ") + k).join(" ") + ", dann bist du da.";
      const nurWorte = kl.join(" ");
      const falschK = kl.slice(); falschK[0] = falschK[0] === "links" ? "rechts" : "links";
      const falsch = "Gehen Sie bis zur Kreuzung, dann " + falschK.join(", dann ") + ".";
      /* ein nahes und ein fernes Haus zum Ziel */
      const Z = {}; for (const o of STADT.szene.objekte) if (o.art === "haus" && o.spiel && o.spiel !== "bahnhof" && !o.bau && !o.versteckt) Z[o.spiel] = o;
      const NAME = { baeckerei: "Bäckerei", schule: "Schule", schmiede: "Schmiede", rathaus: "Rathaus", muehle: "Mühle", krankenhaus: "Krankenhaus", kaserne: "Kaserne", bibliothek: "Bibliothek", brauerei: "Brauerei", gasthaus: "Gasthaus", kuhstall: "Kuhstall", huehnerstall: "Hühnerstall", labor: "Labor", gefaengnis: "Gefängnis", bergwerk: "Bergwerk", flickstube: "Flickstube" };
      const z = qu.ziel, ab = Object.keys(Z).filter((k) => NAME[k]).map((k) => [k, Math.hypot(Z[k].x - z.x, Z[k].y - z.y)]).sort((a, b) => a[1] - b[1]);
      const nah = ab[0], fern = ab[ab.length - 1];
      const r = (t) => { const e = P(qu, [t]); return { stufe: e.stufe, weg: !!(e.weg && e.weg.length), grund: e.grund }; };
      return { kl, richtig: r(richtig), frei: r(frei), freiText: frei, nurWorte: r(nurWorte), falsch: r(falsch), lageNah: r("Der Bahnhof ist neben der " + NAME[nah[0]] + "."), nah: nah, lageFern: r("Der Bahnhof ist neben der " + NAME[fern[0]] + "."), fern: fern, nichts: P(qu, []).stufe };
    }, id);
    sage(A.richtig.stufe === 1, "der richtige Satz der Quest (gesprochen) → volle Punkte", JSON.stringify(A.richtig));
    sage(A.frei.stufe === 1, "frei formuliert, du-Form, gleiche Richtungen → volle Punkte", A.freiText + " " + JSON.stringify(A.frei));
    sage(A.nurWorte.stufe === 0.5, "nur die Richtungswörter ohne Satz → halbe Punkte", JSON.stringify(A.nurWorte));
    sage(A.falsch.stufe === 0 && A.falsch.weg, "falsche Richtung → 0, mit roter Linie wohin sie führt", JSON.stringify(A.falsch));
    sage(A.lageNah.stufe === 1, "Lage mit einem nahen Haus („ist neben der …“) → volle Punkte", JSON.stringify({ haus: A.nah, e: A.lageNah }));
    sage(A.lageFern.stufe === 0, "Lage mit einem fernen Haus → 0", JSON.stringify({ haus: A.fern, e: A.lageFern }));
    sage(A.nichts === -1, "nichts verstanden → noch einmal sprechen (-1)");
    const U = await pg.evaluate(() => {
      const Q = STADT.quests, i = Q.pruef.neu("uhr_jetzt"); const qu = Q.liste.find((x) => x.id === i); if (!qu) return null;
      const P = Q.sprechen.pruefen, ri = qu.antworten.find((a) => a.richtig).html.replace(/<[^>]+>/g, ""), fa = qu.antworten.find((a) => !a.richtig).html.replace(/<[^>]+>/g, "");
      const w = ri.split(" "), ungefaehr = w.slice(0, Math.max(2, Math.ceil(w.length * 0.6))).join(" ");
      return { ri, ganz: P(qu, [ri]).stufe, ungefaehr: P(qu, [ungefaehr]).stufe, ungefaehrText: ungefaehr, falsch: P(qu, [fa]).stufe };
    });
    sage(U && U.ganz === 1 && U.falsch === 0, "Uhrzeit-Quest: richtige Antwort ganz, falsche 0", JSON.stringify(U));
    sage(U && U.ungefaehr >= 0.5, "Uhrzeit-Quest: ungefähr gesagt → mindestens halb", JSON.stringify(U && { t: U.ungefaehrText, s: U.ungefaehr }));

    console.log("\nB  ABLAUF IM DIALOG\n");
    await pg.evaluate(() => { for (const q of STADT.quests.liste) q.f.zustand = "weg"; STADT.quests.liste.length = 0; });
    const id2 = await pg.evaluate(() => STADT.quests.pruef.neu("weg_bahnhof"));
    await pg.waitForFunction((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return q && q.zustand === "wartet"; }, id2, { timeout: 120000 }).catch(() => {});
    /* Azure nachgestellt: „erkennen" liefert den richtigen Satz, „vorlesen" einen kurzen Ton */
    await pg.evaluate((i) => {
      const qu = STADT.quests.liste.find((x) => x.id === i), satz = qu.antworten.find((a) => a.richtig).html.replace(/<[^>]+>/g, "");
      window.__azure = [];
      STADT.quests._sprTest = (k, roh) => {
        window.__azure.push({ aktion: k.aktion, wavLang: k.wav ? k.wav.length : 0, riff: k.wav ? atob(k.wav.slice(0, 8)).slice(0, 4) : "", stimme: k.stimme || "", text: k.text || "" });
        if (k.aktion === "erkennen") return new Promise((ok) => setTimeout(() => ok({ RecognitionStatus: "Success", DisplayText: satz, NBest: [{ Display: satz, Lexical: satz.toLowerCase() }] }), 200));
        return Promise.resolve(new Blob([new Uint8Array(10)], { type: "audio/mpeg" }));
      };
    }, id2);
    const pk0 = await pg.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => /quest/.test(k)) || "x") || "{}").punkte || 0).catch(() => 0);
    await pg.evaluate((i) => STADT.quests.pruef.tipp(i), id2);
    await pg.waitForFunction(() => document.querySelector(".lq-dialog .lq-mik button"), null, { timeout: 20000 }).catch(() => {});
    const knopf = await pg.evaluate(() => { const b = document.querySelector(".lq-dialog .lq-mik button"); if (!b) return null; const r = b.getBoundingClientRect(); return { text: b.textContent, h: Math.round(r.height) }; });
    sage(!!knopf && /sprechen/i.test(knopf.text) && knopf.h >= 28, "im Dialog steht der Knopf „🎤 Antwort sprechen“ (≥ 28 px)", JSON.stringify(knopf));
    await pg.waitForTimeout(700);   // (Klicks in den ersten 0,5 s nach dem Aufgehen zählen als Geisterklick, Fassung 813)
    await pg.evaluate(() => document.querySelector(".lq-dialog .lq-mik button").click());
    await pg.waitForTimeout(700);
    const hoert = await pg.evaluate(() => { const b = document.querySelector(".lq-dialog .lq-mik button"); return b ? { rot: b.classList.contains("lq-hoert"), text: b.textContent, still: !!(STADT.ton && STADT.ton.stillAn) } : null; });
    sage(hoert && hoert.rot, "nach dem Tipp hört das Mikro zu (Knopf rot, „Ich höre zu …“)", JSON.stringify(hoert));
    /* FASSUNG 836 — „Ich höre zu" erst, wenn wirklich aufgenommen wird; die Stadt schweigt so lange */
    sage(hoert && /Ich höre zu/.test(hoert.text), "836: „Ich höre zu“ steht, sobald das Mikro wirklich aufnimmt", hoert && hoert.text);
    sage(hoert && hoert.still, "836: während der Aufnahme ist der Stadtklang ausgeblendet (STADT.ton.still)", JSON.stringify(hoert));
    /* das Probe-Mikro piept ohne Pause: nach höchstens 9 s ist Schluss (oder Tipp = fertig) */
    await pg.evaluate(() => document.querySelector(".lq-dialog .lq-mik button").click());
    await pg.waitForFunction((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return !q || ["unterwegs", "jubel", "geht", "fort"].indexOf(q.zustand) >= 0; }, id2, { timeout: 30000 }).catch(() => {});
    const B = await pg.evaluate((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return { zustand: q ? q.zustand : "fort", azure: window.__azure, du: (document.querySelector(".lq-mik-status") || {}).textContent || "" }; }, id2);
    const er = B.azure.find((x) => x.aktion === "erkennen");
    sage(!!er && er.riff === "RIFF" && er.wavLang > 4000, "Azure „erkennen“ bekommt eine WAV-Aufnahme (RIFF, 16 kHz)", JSON.stringify(er));
    sage(/unterwegs|jubel|geht|fort/.test(B.zustand), "richtig gesprochen → die Person geht los", B.zustand);
    sage(/Du: „/.test(B.du), "der erkannte Satz wird angezeigt („Du: …“)", B.du.slice(0, 80));
    await pg.waitForTimeout(500);
    sage(await pg.evaluate(() => !(STADT.ton && STADT.ton.stillAn)), "836: nach der Aufnahme kommt der Stadtklang wieder");
    await pg.waitForFunction((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return !q || ["jubel", "geht", "fort"].indexOf(q.zustand) >= 0; }, id2, { timeout: 90000 }).catch(() => {});
    const M = await pg.evaluate(() => STADT.quests.pruef.meldung());
    sage(M && M.gesprochen === 1 && M.punkte >= 14, "angekommen: Punkte mit Sprech-Bonus (8 + 2 + 4)", JSON.stringify(M && { punkte: M.punkte, gesprochen: M.gesprochen }));
    /* nächster Dialog: Frage vorgelesen (Männerstimme beim Mann mit Koffer), danach Mikro von selbst */
    await pg.evaluate(() => { window.__azure.length = 0; });
    const id3 = await pg.evaluate(() => STADT.quests.pruef.neu("weg_bahnhof"));
    await pg.waitForFunction((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return q && q.zustand === "wartet"; }, id3, { timeout: 120000 }).catch(() => {});
    await pg.evaluate((i) => STADT.quests.pruef.tipp(i), id3);
    await pg.waitForFunction(() => { const b = document.querySelector(".lq-dialog .lq-mik button"); return b && b.classList.contains("lq-hoert"); }, null, { timeout: 15000 }).catch(() => {});
    const C = await pg.evaluate(() => ({ az: window.__azure.map((x) => x.aktion + ":" + x.stimme + ":" + x.text.slice(0, 30)), hoert: !!document.querySelector(".lq-dialog .lq-mik button.lq-hoert") }));
    sage(C.az.some((x) => /^vorlesen:m:/.test(x)) && C.hoert, "danach: die Frage wird vorgelesen (Männerstimme) und das Mikro geht von selbst an", JSON.stringify(C));
    await pg.evaluate(() => STADT.quests.sprechen.stopp());

    console.log("\nD  FASSUNG 836 — AUFNAHME UND AUSWERTUNG (Funk 263: „hört oft falsche Wörter“)\n");
    /* sauber auf 16 kHz: Sprachband bleibt, Zischlaute über 8 kHz falten nicht zurück */
    const R = await pg.evaluate(() => {
      const f = STADT.quests.sprechen.auf16k; if (!f) return null;
      const pegel = (rate, hz) => { const n = rate; const x = new Float32Array(n); for (let i = 0; i < n; i++) x[i] = 0.5 * Math.sin(2 * Math.PI * hz * i / rate);
        const p = f([x.subarray(0, 4096), x.subarray(4096)], rate); let e = 0; for (let i = 2000; i < p.length - 2000; i++) e += (p[i] / 32767) ** 2;
        return Math.round(20 * Math.log10(Math.sqrt(e / (p.length - 4000)) / (0.5 / Math.SQRT2)) * 10) / 10; };
      return { d48_1k: pegel(48000, 1000), d48_3k: pegel(48000, 3000), d48_11k: pegel(48000, 11000), d44_3k: pegel(44100, 3000), d44_9k: pegel(44100, 9000), laenge: f([new Float32Array(48000)], 48000).length };
    });
    sage(R && R.laenge === 16000 && R.d48_1k > -0.5 && R.d48_3k > -0.5 && R.d44_3k > -0.5, "836: 1 s bei 48 kHz → 16000 Werte, Sprachband (1–3 kHz) unverändert", JSON.stringify(R));
    sage(R && R.d48_11k < -40 && R.d44_9k < -40, "836: 11 kHz (48 kHz) und 9 kHz (44,1 kHz) kommen nicht als Geisterton an (< −40 dB)", JSON.stringify(R));
    const quell = fs.readFileSync(path.join(WURZEL, "stadt-leicht/quests.js"), "utf8");
    sage(/noiseSuppression: false, autoGainControl: false/.test(quell), "836: Rauschunterdrückung und Pegelautomatik aus (wie im Aussprachetrainer)");
    sage(/typ: "leicht-mikro"/.test(quell) && /ev\.data\.typ === "leicht-mikro"/.test(fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8")), "836: das Spiel um die Stadt schweigt während der Aufnahme mit");
    /* Display „2." passt gleich gut zu „zweite" und „zwei": kein Urteil, kein Versuch weg; die Lexical-Lesart entscheidet */
    const D = await pg.evaluate(() => {
      const Q = STADT.quests, i = Q.pruef.neu("datum"), qu = Q.liste.find((x) => x.id === i); if (!qu) return null;
      const P = Q.sprechen.pruefen, ri = qu.antworten.find((a) => a.richtig).html.replace(/<[^>]+>/g, "").replace(/[„“]/g, "");
      const w = ri.replace(/\.$/, "").split(" "), ziffer = w.slice(0, 3).concat(["2."], w.slice(4)).join(" ") + ".";
      const lexR = ri.toLowerCase().replace(/[.„“]/g, ""), lexF = w.slice(0, 3).concat(["zwei"], w.slice(4)).join(" ").toLowerCase();
      const e1 = P(qu, [ziffer]), e2 = P(qu, [ziffer, lexR]), e3 = P(qu, [ziffer, lexF]);
      return { ziffer, lexR, lexF, nurZiffer: { s: e1.stufe, ohne: !!e1.ohneVersuch }, mitRichtig: e2.stufe, mitFalsch: { s: e3.stufe, ohne: !!e3.ohneVersuch } };
    });
    sage(D && D.nurZiffer.s === 0 && D.nurZiffer.ohne, "836: „Heute ist der 2. …“ (Ziffer) → nicht sicher, kein Versuch weg", JSON.stringify(D));
    sage(D && D.mitRichtig === 1, "836: mit Lexical „… zweite …“ → richtig", JSON.stringify(D && D.lexR));
    sage(D && D.mitFalsch.s === 0 && !D.mitFalsch.ohne, "836: mit Lexical „… zwei …“ → falsch (zählt als Versuch)", JSON.stringify(D && D.mitFalsch));
    const E = await pg.evaluate(() => {
      STADT.quests._sprTest = (k) => Promise.resolve({ RecognitionStatus: "Success", DisplayText: "Heute ist der 2. Oktober.", NBest: [{ Display: "Heute ist der 2. Oktober.", Lexical: "heute ist der zweite oktober", Confidence: 0.9 }] });
      return STADT.quests.sprechen.erkennen("UklGRg==").then((l) => ({ l: l.slice(), anzeige: l.anzeige && l.anzeige["heute ist der zweite oktober"] }));
    });
    sage(E && E.l.indexOf("heute ist der zweite oktober") >= 0 && E.anzeige === "Heute ist der 2. Oktober.", "836: Azure-Lexical wird mitgeprüft, angezeigt bleibt die Display-Fassung", JSON.stringify(E));
    sage(!pf.length, "keine Seitenfehler", pf.join(" | ").slice(0, 200));

    console.log("\nC  SERVER UND RAHMEN\n");
    const fn = fs.readFileSync(path.join(WURZEL, "supabase/functions/aussprache/index.ts"), "utf8");
    sage(/aktion !== "erkennen"/.test(fn) && /headers: erkennen \?/.test(fn), "Edge Function „aussprache“: Aktion „erkennen“ ohne Aussprachebewertung");
    sage(/de-DE-ConradNeural/.test(fn), "Edge Function: Männerstimme (stimme: m)");
    const sj = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
    sage(/allow="fullscreen; microphone; autoplay"/.test(sj), "spiel.js: der Stadtrahmen darf das Mikrofon benutzen");
  } catch (e) { sage(false, "Sonde abgebrochen", e.message.split("\n")[0]); }
  return ende();
})();
