/* =====================================================================
   SONDE RUNDE 88 — „ICH KANN MICH NICHT SELBER ANZIEHEN"
   ---------------------------------------------------------------------
   XANDER, woertlich: „dann kann ich immer noch nicht das Musikstueck
   fuer mich selber einstellen. Ich kann mich immer noch nicht selber
   anziehen und ausziehen."

   NACHGESEHEN, WORAN ES LAG: jeder Befehl sucht sein Ziel mit
   personNachName(), und diese Suche geht ueber zustand.leute — darin
   stehen ALLE AUSSER MIR. „ich" fand also niemanden, und der Rueckfall
   { name: "ich" } suchte einen Platz, der „ich" heisst. Den gibt es
   nicht.
   Und selbst mit dem eigenen NAMEN war es nicht sicher: die Platzsuche
   in app.js verglich die BESCHRIFTUNG des Platzes, und die lautet beim
   eigenen „Alex (du)".

   Diese Sonde haelt beides fest:
     1. „ich", „mich", „mir", „selbst", „selber" (und me/myself/self)
        loesen auf den eigenen Namen auf — bei JEDEM Befehl, der einen
        Platz trifft.
     2. Der eigene Platz wird auch dann gefunden, wenn seine
        Beschriftung „(du)" traegt.
     3. /anziehen ich merkt, dass man sich SELBST anzieht („Sich selbst
        zieht man an, jemand anderem zieht man etwas an").
     4. /kopfhoerer ich <Lied> setzt sie MIR auf — das ist sein
        „ich moechte das selber auch ausprobieren koennen, wie ich das
        bei mir auf den Kopf setzen soll".
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 88 — sich selbst treffen\n");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.DMA_PRUEF
    && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  console.log("1) Der eigene Platz wird trotz „(du)“ gefunden\n");
  const platz = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const plaetze = [...document.querySelectorAll(".lc-platz")];
    const ich = plaetze[0];
    const nm = ich.querySelector(".lc-platz-name");
    /* So, wie es im Betrieb wirklich steht: der eigene Platz traegt
       „(du)" hinter dem Namen. */
    const echt = (ich.dataset.lcName || (nm ? nm.textContent : "")).trim();
    if (nm) nm.textContent = echt + " (du)";
    ich.dataset.lcName = echt;
    const treffer = window.DMA_PRUEF.zielPlaetze
      ? window.DMA_PRUEF.zielPlaetze(echt) : null;
    return { name: echt,
             beschriftung: nm ? nm.textContent : "",
             gefunden: treffer ? treffer.length : -1,
             istMeiner: Boolean(treffer && treffer.length === 1 && treffer[0] === ich) };
  });
  if (platz.gefunden === -1) {
    sage(false, "DMA_PRUEF.zielPlaetze fehlt — die Sonde kann nicht messen");
  } else {
    sage(platz.gefunden === 1, "der eigene Name trifft GENAU EINEN Platz",
      platz.gefunden + " Treffer, Beschriftung „" + platz.beschriftung + "“");
    sage(platz.istMeiner, "und zwar meinen", "Name: " + platz.name);
  }

  console.log("\n2) „ich“ heisst ich — bei jedem Befehl\n");
  const worte = ["ich", "mich", "mir", "selbst", "selber", "me", "myself", "self"];
  const zeilen = await pg.evaluate(async (worte) => {
    /* Eine Buehne, wie sie im Betrieb steht: ich heisse Alex und
       sitze drin. LiveChat.lage().nachrichten ist die ehrlichste
       Quelle — dort steht genau das, was hinausgeht. */
    try {
      LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                           buehne: true, zuruecksetzen: true });
    } catch (e) {}
    try { LiveChat.pruefPersonSetzen("bea-1", "Bea"); } catch (e) {}
    const letzte = () => {
      const n = (LiveChat.lage().nachrichten || []);
      return n.length ? n[n.length - 1] : {};
    };
    const aus = {};
    const ich = LiveChat.lage().ichName;
    for (const w of worte) {
      try { LiveChat.schreiben("/tritt " + w); } catch (e) {}
      await new Promise((f) => setTimeout(f, 40));
      const z = letzte();
      aus[w] = { text: String(z.text || ""), wen: String(z.wen || ""),
                 wirkung: String(z.wirkung || "") };
    }
    const einer = async (befehl, schluessel) => {
      try { LiveChat.schreiben(befehl); } catch (e) {}
      await new Promise((f) => setTimeout(f, 60));
      const z = letzte();
      aus[schluessel] = { text: String(z.text || ""), wen: String(z.wen || ""),
                          wirkung: String(z.wirkung || ""),
                          lied: String(z.lied || "") };
    };
    await einer("/anziehen ich krone", "anziehen");
    await einer("/ausziehen ich krone", "ausziehen");
    const lieder = (LiveChat.lieder && LiveChat.lieder()) || [];
    if (lieder.length) await einer("/kopfhoerer ich 1", "kopfhoerer");
    /* Und die Gegenprobe: ein fremder Name darf NICHT auf mich fallen. */
    await einer("/tritt Bea", "fremd");
    /* RUNDE 88 — die Abzweigung fuer „Kopfhoerer MIT Lied" stand
       hinter AM_PLATZ und kam deshalb nie dran. Beide Faelle werden
       jetzt festgehalten: mit Lied geht sie dorthin, ohne Lied faellt
       sie zu AM_PLATZ durch (ein Name mit Leerzeichen). */
    if (lieder.length) await einer("/kopfhoerer Bea 1", "beaLied");
    try { LiveChat.pruefPersonSetzen("fox-1", "Xander Fox"); } catch (e) {}
    await einer("/kopfhoerer Xander Fox", "zweiWort");
    return { ich, aus, lieder: lieder.length };
  }, worte);

  const ich = zeilen.ich;
  sage(ich === "Alex", "der eigene Name steht fest", ich);
  worte.forEach((w) => {
    const z = zeilen.aus[w] || {};
    sage(z.wen === ich, "„/tritt " + w + "“ meint mich",
      "wen: „" + z.wen + "“ — " + (z.text || "").slice(0, 46));
  });
  const an = zeilen.aus["anziehen"] || {};
  sage(an.wen === ich, "„/anziehen ich krone“ meint mich", "wen: „" + an.wen + "“");
  /* Sein Satz aus Runde 76 steht im Quelltext: „Sich selbst zieht man
     an, jemand anderem zieht man etwas an." Die Zeile muss das also
     auch sagen. */
  sage(/zieht sich/i.test(an.text || ""),
    "und die Zeile sagt „zieht sich … an“", (an.text || "").slice(0, 70));
  const aus2 = zeilen.aus["ausziehen"] || {};
  sage(aus2.wen === ich, "„/ausziehen ich krone“ meint mich", "wen: „" + aus2.wen + "“");
  if (zeilen.aus["kopfhoerer"]) {
    const k = zeilen.aus["kopfhoerer"];
    sage(k.wen === ich, "„/kopfhoerer ich <Lied>“ setzt sie MIR auf",
      "wen: „" + k.wen + "“ — " + (k.text || "").slice(0, 60));
  } else {
    console.log("  --   kein Lied im Musikordner — /kopfhoerer nicht messbar");
  }
  const fr = zeilen.aus["fremd"] || {};
  sage(fr.wen === "Bea", "und ein fremder Name faellt NICHT auf mich",
    "wen: „" + fr.wen + "“");
  if (zeilen.aus["beaLied"]) {
    const bl = zeilen.aus["beaLied"];
    sage(bl.wen === "Bea" && Boolean(bl.lied),
      "„/kopfhoerer Bea 1“ trifft Bea UND traegt ein Lied",
      "wen: „" + bl.wen + "“, Lied: „" + (bl.lied || "") + "“");
  }
  const zw = zeilen.aus["zweiWort"] || {};
  sage(zw.wen === "Xander Fox" && !zw.lied,
    "„/kopfhoerer Xander Fox“ bleibt ein Name — kein Liedwunsch",
    "wen: „" + zw.wen + "“, Lied: „" + (zw.lied || "") + "“");

  /* =====================================================================
     3) UND LAEUFT DIE MUSIK DANN AUCH BEI MIR?
     ---------------------------------------------------------------------
     XANDER: „ich moechte meine eigene Musik hoeren \u2026 und ich moechte
     das selber auch ausprobieren koennen, wie ich das bei mir auf den
     Kopf setzen soll."
     Die Zeile allein beweist das nicht \u2014 gemessen wird der Spieler.
     ===================================================================== */
  console.log("\n3) Und die Musik laeuft wirklich bei mir\n");
  const musik = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const plaetze = [...document.querySelectorAll(".lc-platz")];
    const ich = plaetze[0];
    const name = (ich.dataset.lcName
      || (ich.querySelector(".lc-platz-name") || {}).textContent || "").trim();
    const lieder = (LiveChat.lieder && LiveChat.lieder()) || [];
    if (!lieder.length) return { ohneLied: true };
    const l = lieder[0];
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", name, "Alex",
      { lied: l.datei, liedTitel: l.titel });
    await new Promise((f) => setTimeout(f, 600));
    const st = window.DMA_PRUEFUNG.musikStand ? window.DMA_PRUEFUNG.musikStand() : null;
    return { name: name, titel: (st && st.titel) || "", quelle: (st && st.quelle) || "",
             kopfhoerer: Boolean(ich.querySelector(".lc-kopfhoerer")),
             wunsch: l.titel, datei: l.datei };
  });
  if (musik.ohneLied) {
    console.log("  --   kein Lied im Musikordner \u2014 nicht messbar");
  } else {
    sage(musik.kopfhoerer, "die Kopfhoerer sitzen auf MEINEM Platz", musik.name);
    sage(musik.titel === musik.wunsch,
      "und genau mein Lied liegt im Spieler",
      "\u201e" + musik.titel + "\u201c statt \u201e" + musik.wunsch + "\u201c");
    sage(String(musik.quelle).indexOf(encodeURIComponent(musik.datei).slice(0, 12)) >= 0
         || String(musik.quelle).indexOf(musik.datei.slice(0, 12)) >= 0,
      "und die Quelle zeigt auf die Datei", musik.quelle.slice(-40));
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
