#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 836 (Arbeitsnummer 856): PLATZWECHSEL DIREKT
   ---------------------------------------------------------------------
   XANDER (Funk 263, wörtlich): „die Latenz bei dem Sitzplätzen wenn man
   sie wechselt ist immer noch extrem … für den Zweikampf … absolut
   unbrauchbar … deutlich besser".
   Zwei echte Browser-Seiten bauen eine echte WebRTC-Leitung auf (wie
   Sonde 659); den Supabase-Kanal spielt die Sonde und kann ihn
   zurückhalten. Geprüft:
     - ein Platzwechsel kommt beim anderen über den Datenkanal an, auch
       wenn der Server-Weg zurückgehalten wird – und zwar schnell
     - die Server-Kopie kommt danach an: nichts ändert sich, die Zeile
       „… setzt sich auf Platz n" steht genau einmal im Chat
     - ein spätes, älteres Paket dreht den Platz nicht zurück
     - der Empfänger zeichnet nur die Plätze (Meldung „plaetze"), nicht
       das ganze Klassenzimmer; unveränderte Nachsendungen zeichnen gar
       nicht; „spricht" nur bei Änderung
     - der Wechsler sendet, bevor er zeichnet, und zeichnet nur einmal
     - der Puls heilt einen veralteten Platz (Meldung verloren)
     - im Spiel (spielsitz) ebenso direkt
     - ein Paket ohne Stempel (ältere Fassung) wirkt wie bisher
   Mit dem Stand 835 ist das rot (Sitz nur über den Server).
   Aufruf: node werkzeug/pruefe-856-platz-direkt.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns"] });
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html";

  async function seite(ich, anderer) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto(url, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_SPIEL, { timeout: 25000 });
    await pg.evaluate(([ich, anderer]) => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: ich === "aaa" ? 1000 : 2000, buehne: true, zuruecksetzen: true,
        leute: { [anderer]: { id: anderer, name: anderer.toUpperCase(), seit: anderer === "aaa" ? 1000 : 2000, gesehen: 9e15, buehne: true, bild: "" } } });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.__arten = [];
      window.LiveChat.beiAenderung((l, art) => window.__arten.push(art || "voll"));
      window.DMA_SPIEL.empfangen = () => {};
    }, [ich, anderer]);
    return pg;
  }

  /* Der „Server": trägt Pakete hinüber; Sitzmeldungen kann er zurückhalten. */
  let sitzZurueck = false, laeuft = true;
  const zurueck = [];
  async function tragen(von, nach) {
    while (laeuft) {
      let pakete = [];
      try { pakete = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
      for (const p of pakete) {
        if (sitzZurueck && (p.art === "sitzplatz" || p.art === "spielsitz")) { zurueck.push({ nach, p }); continue; }
        try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
      }
      await schlaf(15);
    }
  }
  const A = await seite("aaa", "bbb"), B = await seite("bbb", "aaa");
  tragen(A, B); tragen(B, A);

  /* Leitung aufbauen wie in 659: B grüßt, A (kleinere Kennung) ruft an */
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  let bereit = null;
  for (let i = 0; i < 300 && !bereit; i++) {
    const k = await A.evaluate(() => window.LiveChat.pruefKanal()), kb = await B.evaluate(() => window.LiveChat.pruefKanal());
    if (k.bereit.indexOf("bbb") >= 0 && kb.bereit.indexOf("aaa") >= 0) bereit = true; else await schlaf(50);
  }
  sage(!!bereit, "die Leitung steht und der Datenkanal ist auf beiden Seiten offen");

  const platzVon = (pg, id) => pg.evaluate((id) => { const p = window.LiveChat.pruefSitz().plaetze.find((x) => x.id === id); return p ? p.nummer : null; }, id);
  const freierPlatz = () => A.evaluate(() => { const p = window.LiveChat.pruefSitz().plaetze.find((x) => x.leer); return p ? p.nummer : null; });
  const zeilen = (pg, re) => pg.evaluate((q) => window.LiveChat.lage().nachrichten.filter((n) => new RegExp(q).test(n.text || "")).length, re);

  console.log("\nCHAT-PLATZWECHSEL\n");
  const alt = await platzVon(B, "aaa"), ziel = await freierPlatz();
  sitzZurueck = true;
  await A.evaluate(() => { window.__arten.length = 0; });
  await B.evaluate(() => { window.__arten.length = 0; });
  const t0 = Date.now();
  const erg = await A.evaluate((n) => window.LiveChat.platzNehmen(n), ziel);
  let da = -1;
  for (let i = 0; i < 200; i++) { if ((await platzVon(B, "aaa")) === ziel) { da = Date.now() - t0; break; } await schlaf(5); }
  sage(erg && erg.ok, "A nimmt einen freien Platz", JSON.stringify({ von: alt, nach: ziel }));
  sage(da >= 0, "B sieht A am neuen Platz, obwohl der Server-Weg zurückgehalten wird (Datenkanal)", da + " ms");
  sage(da >= 0 && da < 300, "und zwar schnell (unter 300 ms inklusive Sonde)", da + " ms");
  const artenA = await A.evaluate(() => window.__arten.slice());
  sage(artenA.length === 1 && artenA[0] === "plaetze", "der Wechsler zeichnet einmal, nur die Plätze", JSON.stringify(artenA));
  /* der Satz kommt nach dem nächsten Bild */
  await schlaf(400);
  let artenB = await B.evaluate(() => window.__arten.slice());
  sage(artenB[0] === "plaetze", "der Empfänger zeichnet zuerst nur die Plätze (nicht das ganze Klassenzimmer)", JSON.stringify(artenB));
  sage(await zeilen(B, "setzt sich auf Platz " + ziel) === 1, "die Chatzeile „setzt sich auf Platz …“ steht bei B einmal");
  /* jetzt die Server-Kopien (und die Nachsendungen) */
  await schlaf(1500);
  sitzZurueck = false;
  await B.evaluate(() => { window.__arten.length = 0; });
  for (const z of zurueck.splice(0)) await z.nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), z.p);
  await schlaf(300);
  artenB = await B.evaluate(() => window.__arten.slice());
  sage(artenB.length === 0, "die Server-Kopien und Nachsendungen ändern nichts und zeichnen nichts", JSON.stringify(artenB));
  sage(await zeilen(B, "setzt sich auf Platz " + ziel) === 1, "die Chatzeile steht weiterhin genau einmal");
  sage((await platzVon(B, "aaa")) === ziel, "A sitzt bei B weiter am neuen Platz");

  console.log("\nSPÄTES ÄLTERES PAKET, PULS, ÄLTERE FASSUNG\n");
  await B.evaluate((alt) => window.LiveChat.pruefEmpfangen({ art: "sitzplatz", von: "aaa", ordnung: { aaa: alt - 1 }, sn: 1 }), alt);
  sage((await platzVon(B, "aaa")) === ziel, "ein spätes Paket mit älterem Stempel dreht den Platz nicht zurück");
  /* ein Paket ohne Stempel (ältere Fassung) wirkt wie bisher: B setzt A auf einen falschen Platz */
  const falsch = await B.evaluate((ziel) => { const p = window.LiveChat.pruefSitz().plaetze.find((x) => x.leer && x.nummer !== ziel); return p ? p.nummer : null; }, ziel);
  await B.evaluate((n) => window.LiveChat.pruefEmpfangen({ art: "sitzplatz", von: "aaa", ordnung: { aaa: n - 1 } }), falsch);
  sage((await platzVon(B, "aaa")) === falsch, "ein Paket ohne Stempel (ältere Fassung) wirkt wie bisher", "Platz " + falsch);
  /* So sähe es aus, wenn ein Wechsel verloren ging: B hat A falsch. Der Puls von A (sein eigener Platz) heilt das,
     aber erst 2,5 s nach der letzten Änderung hier. */
  const puls = { art: "puls", von: "aaa", name: "AAA", seit: 1000, sitz: { aaa: ziel - 1 }, spielsitz: {} };
  await B.evaluate((p) => window.LiveChat.pruefEmpfangen(p), puls);
  sage((await platzVon(B, "aaa")) === falsch, "ein Puls direkt nach einer Änderung dreht sie nicht zurück (2,5-s-Sperre)");
  await schlaf(2700);
  await B.evaluate((p) => window.LiveChat.pruefEmpfangen(p), puls);
  sage((await platzVon(B, "aaa")) === ziel, "der Puls heilt den veralteten Platz (A sitzt bei B wieder richtig)", "Platz " + (await platzVon(B, "aaa")));

  console.log("\nSPRECHEN AN/AUS\n");
  await B.evaluate(() => { window.__arten.length = 0; });
  for (const an of [true, true, false, false]) await B.evaluate((an) => window.LiveChat.pruefEmpfangen({ art: "redet", von: "aaa", spricht: an }), an);
  artenB = await B.evaluate(() => window.__arten.slice());
  sage(artenB.length === 2 && artenB.every((a) => a === "plaetze"), "„spricht“ zeichnet nur bei Änderung und nur die Plätze", JSON.stringify(artenB));

  console.log("\nIM SPIEL (spielsitz)\n");
  /* Ein Spiel-Platzwechsel (platzNehmen im Spiel) braucht ein laufendes Spiel; geprüft wird der Empfang: ein
     spielsitz-Paket mit Stempel wird übernommen, ein älteres danach nicht. Gesendet wird es wie sitzplatz (sitzSenden). */
  const vorher = await B.evaluate(() => window.LiveChat.spielSitzTabelle().aaa);
  await B.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "spielsitz", von: "aaa", ordnung: { aaa: 5 }, sn: Date.now() * 1000 + 1 }));
  const s1 = await B.evaluate(() => window.LiveChat.spielSitzTabelle().aaa);
  await B.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "spielsitz", von: "aaa", ordnung: { aaa: 2 }, sn: 5 }));
  const s2 = await B.evaluate(() => window.LiveChat.spielSitzTabelle().aaa);
  sage(vorher !== 5 && s1 === 5 && s2 === 5, "spielsitz: übernommen, ein älteres Paket danach nicht", JSON.stringify({ vorher, s1, s2 }));
  const lcq = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/function spielSitzSchicken[\s\S]{0,300}sitzSenden\(\{ art: "spielsitz"/.test(lcq), "spielSitzSchicken geht über sitzSenden (direkt, dann Server)");

  /* Quelltext: der Wechsler sendet vor der Spiel-Nacharbeit, der Datenkanal nimmt Sitzmeldungen an */
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/sitzSchicken\(\[zustand\.ichId\], zustand\.ichName \+ " setzt sich auf Platz " \+ n \+ "\."\);[^\n]*\n\s*spielGewechselt\(\);/.test(lc), "der Wechsler sendet zuerst, dann die Spiel-Nacharbeit");
  sage(/n\.art === "sitzplatz" \|\| n\.art === "spielsitz"\) && typeof n\.sn === "number"/.test(lc), "der Datenkanal nimmt Sitzmeldungen mit Stempel an");
  const sp = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
  sage(/setTimeout\(fallePruefen, 0\)/.test(sp), "die Fallen-Prüfung wartet nicht mehr 350 ms");

  /* Edge-Functions neben der Datenbank (London), mit Rückfall ohne Region; Sonden-Adressen unverändert */
  sage(/FUNKTION_REGION = "eu-west-2"/.test(lc) && /"\?forceFunctionRegion=" \+ FUNKTION_REGION/.test(lc), "Edge-Functions mit ?forceFunctionRegion=eu-west-2");
  sage(/funktionRegionAus = true;\s*return fetch\(funktionsUrl\(basis, weg, true\), init\)/.test(lc) && /init\.signal\.aborted\)\) throw e/.test(lc), "scheitert die Anfrage im Netz, geht sie sofort ohne Region (nicht bei Zeitablauf)");
  sage(/funktionRufen\(window\.SUPABASE_CONFIG\.url, RELAIS_WEG/.test(lc) && /funktionRufen\(basis, SFU_WEG, Boolean\(sfu\.pruefUrl\)/.test(lc) && /fetch\(funktionsUrl\(basis, SFU_WEG, Boolean\(sfu\.pruefUrl\)\)/.test(lc), "Relais, Tonserver und Abschied nutzen die Region, Prüf-Adressen nicht");
  /* Tonserver: Startgrenze 14 s, kurze Sperre mit Verdopplung, Nachsicht 60 s */
  sage(/SFU_START_MS = 14000/.test(lc) && /\}, SFU_START_MS\);/.test(lc), "der ganze Tonserver-Start darf 14 s dauern");
  sage(/Math\.min\(120000, SFU_KURZ_SPERRE_MS \* Math\.pow\(2, sfu\.kurzFehler\+\+\)\)/.test(lc), "vorübergehender Rückfall sperrt 20/40/80 s statt 2 Minuten");
  sage(/if \(!sfuGenug\(halten\)\) \{ sfuBeenden\("allein"\)/.test(lc), "ein kurz Zurückgefallener reißt die anderen nicht mit");

  const f = A.__fehler.concat(B.__fehler);
  sage(f.length === 0, "keine Fehler in der Konsole", f.slice(0, 3).join(" | "));
  laeuft = false;
  console.log("\n" + (fehler ? fehler + " Fehler" : "alles grün"));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
