/* PRÜFT FASSUNG 887 (L1): DIE SICHERUNG DES CHATVERLAUFS HÄNGT NICHT MEHR AM EMPFANG.
   ---------------------------------------------------------------
   XANDER: „Der Livestream ist das Wichtigste, weil der am meisten hängt."
   Bis 886 schrieb JEDE neue Chatzeile den ganzen Verlauf neu (Lager + 300 Zeilen localStorage), mit den Profilfotos in
   jeder Zeile. Jetzt sichert chatSichernBald() in einer Leerlaufpause, höchstens einmal in 20 s; sofort gesichert wird
   bei pagehide, verdeckt, verlassen, Verlauf leeren, Raumwechsel und pruefVerlaufSetzen. Das Profilfoto liegt einmal
   im Lager („chatbild:" + Fingerabdruck), in der Zeile steht nur bildH.

   Teile:
     A  Flut: 50 Zeilen in 25 s → höchstens 2 Sicherungen (die erste sofort durch pruefVerlaufSetzen), Abstand ≥ 20 s,
        und die ausstehende kommt wirklich (nach der Flut steht alles im Lager).
     B  pagehide und visibilitychange → hidden sichern sofort alles (Lager UND localStorage).
     W  Raumwechsel sichert das Ausstehende des alten Raums sofort; chatLeeren leert auch das Lager.
     F  Fotos: weder Lager-Text noch localStorage enthalten das Profilfoto; „chatbild:…" liegt einmal im Lager.
     R  Nach dem Neuladen: Verlauf vollständig, Fotos wieder eingesetzt, Sprachnachricht und Chatbild aus dem Lager.
     D  Ein Speicherstand im 886-Format (Foto in der Zeile) wird gelesen, auch über eine neue Sicherung hinweg.
     K  Doppelprüfung: dieselbe Kennung kommt nicht zweimal hinein; nach Austausch der Liste gilt die neue Liste.
   NACHBESSERUNG (Prüfer, Runde 1):
     L  Die Seite geht (pagehide / verdeckt), WÄHREND das Lager gelesen wird – nach dem Verlauf, vor den Profilfotos,
        also vor dem Einmischen: das Lager bleibt vollständig (3 000 Zeilen, nicht die kurze Liste).
     S  Eine stückweise Sicherung, deren Liste unterwegs ersetzt wird (das Lager wird eingemischt), legt nie den alten
        Schnappschuss ins Lager; danach steht der volle Verlauf dort.
     T  Nach dem Neuladen haben die localStorage-Zeilen ihre Profilfotos SOFORT (synchron, ohne Lager-Abfrage) –
        die Fototafel liegt einmal daneben und wird bei unveränderten Fotos nicht neu geschrieben.
   PRÜFUNG RUNDE 1 (Auslieferung 887):
     Q  Die Fototafel ist gedeckelt: Fotos über 40 K nur im Lager, Tafel ≤ 400 K, danach bleiben ≥ 300 K frei (Q1: 700 K
        frei, 30 Fotos je 20 K – 886 ließ 318 K, e84652ac 60 K); ein eigenes Profilfoto (140 K) passt danach noch. Q3:
        bei vollem Speicher scheitert die Tafel ohne Schaden und wird mit denselben Fotos wieder versucht, sobald Platz ist.
     P  Kommt eine Zeile, während ein Stücklauf läuft, und feuert ihr Plan vor dessen Ende, wird sie trotzdem gesichert
        (das Ende des Laufs plant neu).
   Gegenprobe: WURZEL=<886-Baum> → A, B(verdeckt), W, F rot. WURZEL=<Baum auf e9187509 (887 vor der Nachbesserung)>
   → L, S, T rot. WURZEL=<Baum auf e84652ac> → Q1, Q3, P rot. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || require("path").join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const NUR = (process.env.NUR || "ABWFTRDKSLQP").split("");
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const ctx = await br.newContext({ viewport: { width: 390, height: 780 } });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  const pg = await ctx.newPage();
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e).slice(0, 160)));
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html";
  await pg.goto(adresse, { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && LiveChat.pruefVerlaufSetzen, null, { timeout: 60000 });
  await pg.waitForTimeout(1500);

  /* Helfer in der Seite: Zähler für localStorage.setItem und IndexedDB-put, Fotos, Lager roh lesen */
  const helfer = () => {
    window.__z = { ls: {}, put: {} };
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { window.__z.ls[k] = (window.__z.ls[k] || 0) + 1; return setItem.apply(this, arguments); };
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (v) { const id = v && v.id; if (id) window.__z.put[id] = (window.__z.put[id] || 0) + 1; return put.apply(this, arguments); };
    window.__foto = (seed, groesse) => { let s = "data:image/png;base64,iVBORw0KGgo"; let x = seed * 7919; const z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      while (s.length < groesse) { x = (x * 1103515245 + 12345) % 2147483648; s += z[x % 64]; } return s; };
    window.__lagerRoh = (id) => new Promise((ok) => { const a = indexedDB.open("dma_klassenzimmer", 1);
      a.onsuccess = () => { try { const t = a.result.transaction("bilder", "readonly"); const g = t.objectStore("bilder").get(id); g.onsuccess = () => ok(g.result ? g.result.daten : null); g.onerror = () => ok(null); } catch (e) { ok(null); } };
      a.onerror = () => ok(null); });
    window.__lagerLegenRoh = (id, raum, daten) => new Promise((ok) => { const a = indexedDB.open("dma_klassenzimmer", 1);
      a.onupgradeneeded = () => { const f = a.result.createObjectStore("bilder", { keyPath: "id" }); f.createIndex("zeit", "zeit"); };
      a.onsuccess = () => { const t = a.result.transaction("bilder", "readwrite"); t.objectStore("bilder").put({ id, raum, daten, zeit: Date.now() }); t.oncomplete = () => ok(true); t.onerror = () => ok(false); };
      a.onerror = () => ok(false); });
    window.__zeilen = (n, wo, ab, fotos) => { const l = [], t0 = Date.now() - 100000; for (let i = 0; i < n; i++) { const a = i % 30;
      l.push({ id: wo + (ab + i), von: "p" + a, name: "Schüler" + a, art: "text", text: wo + "-Zeile " + (ab + i), zeit: t0 + (ab + i) * 10, bild: a < 3 && fotos ? fotos[a] : (a % 2 ? "emoji:🦊" : "") }); } return l; };
  };
  await pg.evaluate(helfer);

  let fehler = 0;
  const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  const hat = (t) => NUR.includes(t);

  if (hat("A")) {
    console.log("\n  A  FLUT: höchstens eine Sicherung in 20 s");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      LiveChat.pruefRaum("probe-flut");
      await LiveChat.pruefVerlaufAusLager("probe-flut");
      LiveChat.pruefVerlaufSetzen(window.__zeilen(400, "F", 0, null));   // sofort gesichert
      await warte(300);
      window.__z.ls = {}; window.__z.put = {};
      const t0 = performance.now(), zeiten = [];
      const orig = Storage.prototype.setItem;
      const merk = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k) { if (k === "dma_livechat_chat_probe-flut") zeiten.push(Math.round(performance.now() - t0)); return merk.apply(this, arguments); };
      for (let i = 0; i < 50; i++) { LiveChat.pruefAnhaengen({ id: "flut" + i, von: "p1", name: "Bea", art: "text", text: "Flut " + i, zeit: Date.now() }); await warte(500); }
      const nachFlut = window.__z.ls["dma_livechat_chat_probe-flut"] || 0;
      const putsNachFlut = window.__z.put["chat:probe-flut"] || 0;
      /* die ausstehende Sicherung kommt (spätestens 20 s nach der letzten + Leerlauf) */
      await warte(21000);
      Storage.prototype.setItem = orig;
      const lager = await LiveChat.pruefVerlaufAusLager("probe-flut");
      const speicher = LiveChat.pruefVerlaufAusSpeicher("probe-flut");
      return { nachFlut, putsNachFlut, zeiten, lagerN: lager.length, lagerLetzte: (lager[lager.length - 1] || {}).text, speicherLetzte: (speicher[speicher.length - 1] || {}).text };
    });
    ok(r.nachFlut <= 2, "50 Zeilen in 25 s → höchstens 2 Sicherungen (localStorage)", r.nachFlut + " Sicherungen, ms " + JSON.stringify(r.zeiten.slice(0, 6)));
    ok(r.putsNachFlut <= 2, "… und höchstens 2 Mal der Verlauf ins Lager", r.putsNachFlut + " Mal");
    const abst = r.zeiten.slice(1).map((z, i) => z - r.zeiten[i]);
    ok(abst.every((d) => d >= 19900), "zwischen zwei Sicherungen ≥ 20 s", JSON.stringify(abst));
    ok(r.lagerN === 450 && r.lagerLetzte === "Flut 49", "danach steht alles im Lager", r.lagerN + " Zeilen, letzte „" + r.lagerLetzte + "“");
    ok(r.speicherLetzte === "Flut 49", "… und im localStorage", "letzte „" + r.speicherLetzte + "“");
  }

  if (hat("B")) {
    console.log("\n  B  pagehide / verdeckt: sofort alles");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      const o = {};
      for (const weg of ["pagehide", "hidden"]) {
        const raum = "probe-weg-" + weg;
        LiveChat.pruefRaum(raum);
        await LiveChat.pruefVerlaufAusLager(raum);
        LiveChat.pruefVerlaufSetzen(window.__zeilen(30, "W", 0, null));
        await warte(200);
        /* gleich danach drei neue Zeilen – sie stehen noch aus (20-s-Abstand) */
        for (let i = 0; i < 3; i++) LiveChat.pruefAnhaengen({ id: weg + i, von: "p2", name: "Cem", art: "text", text: weg + " " + i, zeit: Date.now() + i });
        const vorher = (LiveChat.pruefVerlaufAusSpeicher(raum).slice(-1)[0] || {}).text;
        if (weg === "pagehide") window.dispatchEvent(new Event("pagehide"));
        else {
          Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
          Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
          document.dispatchEvent(new Event("visibilitychange"));
          Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
          Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
        }
        const speicher = LiveChat.pruefVerlaufAusSpeicher(raum);       // synchron, gleich nach dem Ereignis
        await warte(150);
        const lager = await LiveChat.pruefVerlaufAusLager(raum);
        o[weg] = { vorher, speicherN: speicher.length, speicherLetzte: (speicher.slice(-1)[0] || {}).text, lagerN: lager.length, lagerLetzte: (lager.slice(-1)[0] || {}).text };
      }
      return o;
    });
    for (const weg of ["pagehide", "hidden"]) {
      const x = r[weg];
      ok(x.speicherN === 33 && x.speicherLetzte === weg + " 2", weg + ": localStorage sofort vollständig", x.speicherN + " Zeilen, letzte „" + x.speicherLetzte + "“ (vorher „" + x.vorher + "“)");
      ok(x.lagerN === 33 && x.lagerLetzte === weg + " 2", weg + ": Lager vollständig", x.lagerN + " Zeilen");
    }
  }

  if (hat("W")) {
    console.log("\n  W  Raumwechsel und Verlauf leeren");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      LiveChat.pruefRaum("probe-w1");
      await LiveChat.pruefVerlaufAusLager("probe-w1");
      LiveChat.pruefVerlaufSetzen(window.__zeilen(20, "V", 0, null));
      await warte(200);
      LiveChat.pruefAnhaengen({ id: "w1-neu", von: "p3", name: "Dora", art: "text", text: "kurz vor dem Wechsel", zeit: Date.now() });
      LiveChat.pruefRaum("probe-w2");                        // Wechsel
      const w1 = LiveChat.pruefVerlaufAusSpeicher("probe-w1");
      await warte(150);
      const w1Lager = await LiveChat.pruefVerlaufAusLager("probe-w1");
      /* Leeren: Lager und localStorage leer, und es kommt nichts zurück */
      LiveChat.pruefRaum("probe-w1");
      await LiveChat.pruefVerlaufAusLager("probe-w1");
      LiveChat.pruefVerlaufSetzen(w1Lager);
      LiveChat.pruefAnhaengen({ id: "w1-neu2", von: "p3", name: "Dora", art: "text", text: "noch eine", zeit: Date.now() });
      LiveChat.chatLeeren();
      await warte(23000);
      const nachLeeren = await LiveChat.pruefVerlaufAusLager("probe-w1");
      return { w1Letzte: (w1.slice(-1)[0] || {}).text, w1N: w1.length, w1LagerN: w1Lager.length, nachLeerenN: nachLeeren.length, speicherNach: LiveChat.pruefVerlaufAusSpeicher("probe-w1").length };
    });
    ok(r.w1N === 21 && r.w1Letzte === "kurz vor dem Wechsel", "Raumwechsel: der alte Raum ist sofort gesichert", r.w1N + " Zeilen, letzte „" + r.w1Letzte + "“");
    ok(r.w1LagerN === 21, "… auch im Lager", r.w1LagerN + " Zeilen");
    ok(r.nachLeerenN === 0 && r.speicherNach === 0, "Verlauf leeren: Lager und localStorage leer, keine Sicherung legt den alten Stand zurück", "Lager " + r.nachLeerenN + ", Speicher " + r.speicherNach);
  }

  let fotos = null;
  if (hat("F") || hat("R")) {
    console.log("\n  F  Profilfotos einmal ins Lager, nicht in jede Zeile");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      const fotos = [window.__foto(1, 16000), window.__foto(2, 16000), window.__foto(3, 16000)];
      LiveChat.pruefRaum("probe-foto");
      await LiveChat.pruefVerlaufAusLager("probe-foto");
      const liste = window.__zeilen(600, "P", 0, fotos);
      liste.push({ id: "sprach1", von: "p4", name: "Ezra", art: "sprach", text: "🎤", zeit: Date.now(), sprach: "data:audio/webm;base64," + "QUJD".repeat(3000), sprachSek: 3 });
      liste.push({ id: "chatbild1", von: "p5", name: "Finn", art: "bild", text: "", zeit: Date.now() + 1, bildImChat: window.__foto(9, 30000) });
      window.__z.put = {};
      LiveChat.pruefVerlaufSetzen(liste);
      await warte(400);
      const roh = await window.__lagerRoh("chat:probe-foto");
      const ls = localStorage.getItem("dma_livechat_chat_probe-foto") || "";
      const zuFotos = {};
      for (const k of Object.keys(window.__z.put)) if (k.indexOf("chatbild:") === 0) zuFotos[k] = window.__z.put[k];
      const einFoto = Object.keys(zuFotos)[0] ? await window.__lagerRoh(Object.keys(zuFotos)[0]) : null;
      /* zweite Sicherung: dieselben Fotos werden nicht noch einmal gelegt */
      window.__z.put = {};
      LiveChat.pruefVerlaufSetzen(liste.concat([{ id: "P-extra", von: "p0", name: "Schüler0", art: "text", text: "noch", zeit: Date.now() + 5, bild: fotos[0] }]));
      await warte(300);
      const zweitePuts = Object.keys(window.__z.put).filter((k) => k.indexOf("chatbild:") === 0).length;
      let tafel = null; try { tafel = JSON.parse(localStorage.getItem("dma_livechat_chatfoto_probe-foto") || "null"); } catch (e) {}
      window.__z.ls = {};
      LiveChat.pruefVerlaufSetzen(liste.concat([{ id: "P-extra2", von: "p1", name: "Schüler1", art: "text", text: "noch2", zeit: Date.now() + 6, bild: fotos[1] }]));
      const tafelNeu = window.__z.ls["dma_livechat_chatfoto_probe-foto"] || 0;
      return { tafelN: tafel ? Object.keys(tafel).length : -1, tafelRichtig: tafel ? Object.values(tafel).every((b) => fotos.indexOf(b) >= 0) : false, tafelNeu, rohLaenge: roh ? roh.length : -1, rohFoto: roh ? roh.indexOf(fotos[0].slice(0, 200)) >= 0 : null, lsLaenge: ls.length, lsFoto: ls.indexOf(fotos[0].slice(0, 200)) >= 0,
               fotoPuts: zuFotos, einFotoOk: fotos.indexOf(einFoto) >= 0, zweitePuts, fotos };
    });
    fotos = r.fotos;
    ok(r.rohLaenge > 0 && !r.rohFoto, "Lager-Text ohne Profilfoto", r.rohLaenge + " Zeichen");
    ok(r.lsLaenge > 0 && !r.lsFoto, "localStorage (300 Zeilen) ohne Profilfoto", r.lsLaenge + " Zeichen");
    ok(Object.keys(r.fotoPuts).length === 3 && Object.values(r.fotoPuts).every((v) => v === 1), "jedes der 3 Fotos genau einmal als „chatbild:…“ ins Lager", JSON.stringify(Object.values(r.fotoPuts)));
    ok(r.einFotoOk, "das gelegte Foto ist das Original");
    ok(r.zweitePuts === 0, "zweite Sicherung legt die Fotos nicht noch einmal", r.zweitePuts + " Mal");
    if (hat("T")) {
      ok(r.tafelN === 3 && r.tafelRichtig, "T  Fototafel neben dem localStorage-Verlauf: die 3 Fotos, je einmal", r.tafelN + " Fotos");
      ok(r.tafelNeu === 0, "T  … bei unveränderten Fotos nicht neu geschrieben", r.tafelNeu + " Mal");
    }
  }

  if (hat("R")) {
    console.log("\n  R  nach dem Neuladen: Verlauf, Fotos, Sprachnachricht, Chatbild");
    await pg.reload({ waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && LiveChat.pruefVerlaufSetzen, null, { timeout: 60000 });
    await pg.waitForTimeout(800);
    await pg.evaluate(helfer);
    if (hat("T")) {
      /* T: gleich nach dem Neuladen, vor jeder Lager-Abfrage, synchron – so zeichnet betreten() das erste Mal */
      const t = await pg.evaluate((fotos) => {
        LiveChat.pruefRaum("probe-foto");
        const l = LiveChat.pruefVerlaufAusSpeicher("probe-foto");
        const mit = l.filter((n) => /^P\d/.test(n.id) && Number(n.id.slice(1)) % 30 < 3);
        return { n: l.length, mit: mit.length, richtig: mit.filter((n) => n.bild === fotos[Number(n.id.slice(1)) % 30]).length };
      }, fotos);
      ok(t.n === 300 && t.mit > 0 && t.richtig === t.mit, "T  nach dem Neuladen: localStorage-Zeilen haben ihr Profilfoto sofort (ohne Lager)", t.richtig + "/" + t.mit + " Foto-Zeilen");
    }
    const r = await pg.evaluate(async (fotos) => {
      LiveChat.pruefRaum("probe-foto");
      const lager = await LiveChat.pruefVerlaufAusLager("probe-foto");
      const speicher = LiveChat.pruefVerlaufAusSpeicher("probe-foto");
      if (LiveChat.pruefFotosZurueck) await LiveChat.pruefFotosZurueck(speicher);
      const mitFoto = (l) => l.filter((n) => /^P\d/.test(n.id) && Number(n.id.slice(1)) % 30 < 3);
      const fotoRichtig = (l) => mitFoto(l).every((n) => n.bild === fotos[Number(n.id.slice(1)) % 30]);
      const sp = lager.find((n) => n.id === "sprach1") || {};
      const cb = lager.find((n) => n.id === "chatbild1") || {};
      return { lagerN: lager.length, speicherN: speicher.length, lagerFotos: mitFoto(lager).length, lagerFotoRichtig: fotoRichtig(lager), speicherFotoRichtig: fotoRichtig(speicher),
               emojiBleibt: lager.filter((n) => n.bild === "emoji:🦊").length,
               sprachImLager: sp.sprachImLager === true, sprachDa: ((await window.__lagerRoh("sprach:sprach1")) || "").length,
               bildImLager: cb.bildImLager === true, bildDa: ((await window.__lagerRoh("chatbild1")) || "").length };
    }, fotos);
    ok(r.lagerN === 603, "Verlauf aus dem Lager vollständig", r.lagerN + " Zeilen");
    ok(r.lagerFotos > 0 && r.lagerFotoRichtig, "Profilfotos im Lager-Verlauf wieder eingesetzt", r.lagerFotos + " Zeilen mit Foto");
    ok(r.speicherN === 300 && r.speicherFotoRichtig, "… und im localStorage-Verlauf (300 Zeilen)", r.speicherN + " Zeilen");
    ok(r.emojiBleibt > 0, "Emoji-Bilder bleiben, wie sie sind", r.emojiBleibt + " Zeilen");
    ok(r.sprachImLager && r.sprachDa > 10000, "Sprachnachricht: Haken in der Zeile, Ton im Lager", r.sprachDa + " Zeichen");
    ok(r.bildImLager && r.bildDa > 20000, "Chatbild: Haken in der Zeile, Bild im Lager", r.bildDa + " Zeichen");
  }

  if (hat("D")) {
    console.log("\n  D  Speicherstand im 886-Format (Foto in der Zeile)");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      const foto = window.__foto(5, 12000);
      const alt = window.__zeilen(40, "ALT", 0, [foto, foto, foto]);
      localStorage.setItem("dma_livechat_chat_probe-alt", JSON.stringify(alt.slice(-30)));
      await window.__lagerLegenRoh("chat:probe-alt", "probe-alt", JSON.stringify(alt));
      LiveChat.pruefRaum("probe-alt");
      const speicher = LiveChat.pruefVerlaufAusSpeicher("probe-alt");
      const lager = await LiveChat.pruefVerlaufAusLager("probe-alt");
      const n1 = lager.filter((n) => n.bild === foto).length, n0 = alt.filter((n) => n.bild === foto).length;
      /* einmal neu sichern (neues Format) und wieder lesen */
      LiveChat.pruefVerlaufSetzen(lager);
      await warte(300);
      const wieder = await LiveChat.pruefVerlaufAusLager("probe-alt");
      return { speicherN: speicher.length, speicherFoto: speicher.filter((n) => n.bild === foto).length, lagerN: lager.length, n0, n1, wiederFoto: wieder.filter((n) => n.bild === foto).length };
    });
    ok(r.speicherN === 30 && r.speicherFoto > 0, "localStorage im alten Format gelesen, Fotos da", r.speicherN + " Zeilen, " + r.speicherFoto + " mit Foto");
    ok(r.lagerN === 40 && r.n1 === r.n0, "Lager im alten Format gelesen, Fotos da", r.lagerN + " Zeilen, " + r.n1 + "/" + r.n0 + " mit Foto");
    ok(r.wiederFoto === r.n0, "nach neuer Sicherung (neues Format) wieder mit Foto", r.wiederFoto + "/" + r.n0);
  }

  if (hat("K")) {
    console.log("\n  K  Doppelprüfung über Kennungen");
    const r = await pg.evaluate(async () => {
      LiveChat.pruefRaum("probe-k");
      await LiveChat.pruefVerlaufAusLager("probe-k");
      LiveChat.pruefVerlaufSetzen(window.__zeilen(5000, "K", 0, null));
      const n0 = LiveChat.pruefAnhaengen({ id: "K10", von: "p1", name: "x", art: "text", text: "doppelt", zeit: Date.now() });
      const n1 = LiveChat.pruefAnhaengen({ id: "neu-1", von: "p1", name: "x", art: "text", text: "neu", zeit: Date.now() });
      const n2 = LiveChat.pruefAnhaengen({ id: "neu-1", von: "p1", name: "x", art: "text", text: "neu nochmal", zeit: Date.now() });
      /* Liste ausgetauscht: K10 ist weg → darf wieder hinein */
      LiveChat.pruefVerlaufSetzen(window.__zeilen(5000, "K", 0, null).filter((n) => n.id !== "K10"));
      const n3 = LiveChat.pruefAnhaengen({ id: "K10", von: "p1", name: "x", art: "text", text: "wieder da", zeit: Date.now() });
      const n4 = LiveChat.pruefAnhaengen({ id: "K11", von: "p1", name: "x", art: "text", text: "doppelt", zeit: Date.now() });
      /* Zeit je Zeile bei 5000 Zeilen */
      const t = performance.now();
      for (let i = 0; i < 200; i++) LiveChat.pruefAnhaengen({ id: "z" + i, von: "p1", name: "x", art: "text", text: "z", zeit: Date.now() });
      const ms = (performance.now() - t) / 200;
      return { n0, n1, n2, n3, n4, ms: Math.round(ms * 100) / 100 };
    });
    ok(r.n0 === 5000, "vorhandene Kennung wird nicht angehängt", r.n0 + " Zeilen");
    ok(r.n1 === 5001 && r.n2 === 5001, "neue Kennung einmal, zweites Mal nicht", r.n1 + " / " + r.n2);
    ok(r.n3 === 5000 && r.n4 === 5000, "nach Austausch der Liste: gelöschte Kennung wieder erlaubt, vorhandene nicht", r.n3 + " / " + r.n4);
    ok(r.ms < 1, "eine Zeile anhängen (5 000 Zeilen, ohne Sicherung) unter 1 ms", r.ms + " ms");
  }

  if (hat("S")) {
    console.log("\n  S  Stückweise Sicherung: Liste unterwegs ersetzt (Lager eingemischt) → nie der alte Schnappschuss ins Lager");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      const raum = "probe-s";
      LiveChat.pruefRaum(raum);
      await LiveChat.pruefVerlaufAusLager(raum);
      const lang = window.__zeilen(3000, "S", 0, null);
      LiveChat.pruefVerlaufSetzen(lang);                       // Lager: 3000
      await warte(400);
      /* wie nach dem Betreten: Lager noch nicht gelesen, im Arbeitsspeicher nur die jüngsten Zeilen */
      LiveChat.pruefLagerVergessen();
      LiveChat.pruefVerlaufSetzen(lang.slice(-1000));          // nur localStorage
      const puts = [];
      const put = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function (v) { if (v && v.id === "chat:" + raum) { try { puts.push(JSON.parse(v.daten).length); } catch (e) { puts.push(-1); } } return put.apply(this, arguments); };
      /* Leerlaufpausen festhalten: je Freigabe genau ein Schritt (timeRemaining 0 → ein Stück je Pause) */
      const ric = window.requestIdleCallback, gehalten = [];
      window.requestIdleCallback = (f) => { gehalten.push(f); return 0; };
      const frei = () => { const f = gehalten.shift(); if (f) f({ timeRemaining: () => 0, didTimeout: false }); return !!f; };
      /* nur die JETZT gehaltenen freigeben – ein Leerlauf-Takt der Seite, der sich selbst neu anmeldet, liefe sonst endlos */
      const runde = () => { let n = gehalten.length; while (n-- > 0) frei(); };
      const abstand = LiveChat.pruefSichernAbstand();
      LiveChat.pruefSichernAbstand(0);
      LiveChat.pruefAnhaengen({ id: "s-neu", von: "p1", name: "Bea", art: "text", text: "neu", zeit: Date.now() });
      await warte(60);
      /* Steht aus einem früheren Teil (K) noch eine geplante Sicherung an (setTimeout bis 20 s), plant chatSichernBald
         nicht neu – sie feuert dann für den jetzigen Raum. Darum bis 30 s auf den Start warten. */
      for (let k = 0; k < 1500 && !LiveChat.pruefSichernStand().laeuft; k++) { runde(); if (!LiveChat.pruefSichernStand().laeuft) await warte(20); }
      const lief = LiveChat.pruefSichernStand().laeuft;        // geplante Sicherung → Schnappschuss (1001 Zeilen)
      runde();                                                 // erstes Stück
      /* jetzt wie betreten(): Lager lesen und einmischen */
      const ausLager = await LiveChat.pruefVerlaufAusLager(raum);
      LiveChat.pruefVerlaufFensterAuf();
      LiveChat.pruefEmpfangen({ art: "verlauf", von: "lager-nachbau", name: "Lager", zeilen: ausLager });
      LiveChat.pruefVerlaufFensterZu();
      for (let k = 0; k < 80; k++) { await warte(25); runde(); }
      window.requestIdleCallback = ric;
      LiveChat.pruefSichernAbstand(abstand);
      await warte(400);
      IDBObjectStore.prototype.put = put;
      const lager = await window.__lagerRoh("chat:" + raum);
      return { lief, puts, ausLagerN: ausLager.length, lagerN: lager ? JSON.parse(lager).length : -1 };
    });
    ok(r.lief, "der Stücklauf lief, als die Liste ersetzt wurde", "Lager gelesen: " + r.ausLagerN + " Zeilen");
    ok(r.puts.every((n) => n >= 3000), "kein Schreiben eines alten Schnappschusses ins Lager", "Zeilen je Schreiben " + JSON.stringify(r.puts));
    ok(r.lagerN >= 3001, "danach steht der volle Verlauf (mit der neuen Zeile) im Lager", r.lagerN + " Zeilen");
  }

  if (hat("L")) {
    console.log("\n  L  Seite geht, während das Lager gelesen wird (nach dem Verlauf, vor den Profilfotos)");
    for (const art of ["pagehide", "hidden"]) {
      const raum = "probe-l-" + art;
      const vorher = await pg.evaluate(async (raum) => {
        LiveChat.pruefRaum(raum);
        await LiveChat.pruefVerlaufAusLager(raum);
        const l = [], t0 = Date.now() - 3000 * 60000;
        /* Zeilen 0–999 von „alt*"-Autoren mit Foto, die in den letzten 300 nicht mehr vorkommen (ihr Foto liegt nur im Lager) */
        for (let i = 0; i < 3000; i++) { const alt = i < 1000; const a = alt ? "alt" + (i % 10) : "p" + (i % 20);
          l.push({ id: "L" + i, von: a, name: a, text: "Zeile " + i, art: "text", zeit: t0 + i * 60000, bild: window.__foto(alt ? 100 + (i % 10) : (i % 20), 600) }); }
        LiveChat.pruefVerlaufSetzen(l);
        await new Promise((f) => setTimeout(f, 600));
        const roh = await window.__lagerRoh("chat:" + raum);
        return roh ? JSON.parse(roh).length : -1;
      }, raum);
      const B = await ctx.newPage();
      const fehlerB = [];
      B.on("pageerror", (e) => fehlerB.push(String(e.message || e).slice(0, 160)));
      await B.goto(adresse, { waitUntil: "domcontentloaded" });
      await B.waitForFunction(() => window.LiveChat && LiveChat.pruefVerlaufSetzen, null, { timeout: 60000 });
      await B.waitForTimeout(1500);
      await B.evaluate(helfer);
      const r = await B.evaluate(async ({ raum, art }) => {
        LiveChat.pruefLagerVergessen();
        LiveChat.pruefRaum(raum);
        const kurz = LiveChat.pruefVerlaufAusSpeicher(raum);
        LiveChat.pruefVerlaufSetzen(kurz);                       // wie chatLaden beim Betreten (Lager ungelesen → nur localStorage)
        LiveChat.pruefAnhaengen({ id: "neu1", von: "q", name: "Q", text: "neu", art: "text", zeit: Date.now() });   // etwas steht aus
        let lesend = 0, gefeuert = false, aufgeloest = false;
        const orig = IDBDatabase.prototype.transaction;
        IDBDatabase.prototype.transaction = function (fach, modus) {
          const t = orig.apply(this, arguments);
          if ((modus || "readonly") === "readonly") {
            lesend++;
            /* 1. Lese-Abfrage = chat:<raum>, 2. = chatbild:… – genau jetzt geht die Seite */
            if (lesend === 2 && !gefeuert) { gefeuert = true; setTimeout(() => { window.__gehtUm = aufgeloest ? "nach" : "vor";
              if (art === "hidden") { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); document.dispatchEvent(new Event("visibilitychange")); }
              else window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false })); }, 0); }
          }
          return t;
        };
        const aus = await LiveChat.pruefVerlaufAusLager(raum).then((x) => { aufgeloest = true; return x; });
        IDBDatabase.prototype.transaction = orig;
        return { kurz: kurz.length, ausLager: aus.length, lesend, gefeuert, gehtUm: window.__gehtUm || "-" };
      }, { raum, art });
      await B.waitForTimeout(1200);
      const nachher = await B.evaluate((raum) => window.__lagerRoh("chat:" + raum).then((x) => (x ? JSON.parse(x).length : -1)), raum);
      await B.close();
      ok(r.gefeuert === true && r.gehtUm === "vor", art + ": das Ereignis kam zwischen Lager-Lesen und Einmischen", "Lese-Abfragen " + r.lesend + ", Ereignis " + r.gehtUm + " dem Ende von chatAusLager");
      ok(vorher === 3000 && nachher >= vorher, art + ": das Lager bleibt vollständig", vorher + " → " + nachher + " Zeilen (kurze Liste " + r.kurz + ")");
      ok(fehlerB.length === 0, art + ": keine Seitenfehler auf der zweiten Seite", fehlerB.slice(0, 2).join(" | "));
    }
  }

  if (hat("Q")) {
    console.log("\n  Q  Fototafel gedeckelt: der localStorage behält Platz (Prüfung Runde 1, Punkte 2 und 3)");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      /* freier Platz im localStorage in Zeichen (wie das Messskript des Prüfers, a887/quota.js) */
      const frei = () => { let lo = 0, hi = 12e6; while (hi - lo > 64) { const mid = (lo + hi) >> 1; try { localStorage.setItem("__p", "x".repeat(mid)); localStorage.removeItem("__p"); lo = mid; } catch (e) { hi = mid; } } try { localStorage.removeItem("__p"); } catch (e) {} return lo; };
      const fuellen = (F) => { try { localStorage.removeItem("__fill"); } catch (e) {} const c = frei(); localStorage.setItem("__fill", "f".repeat(Math.max(0, c - F))); return frei(); };
      const zeilen = (raum, n, fotos) => { const l = [], t0 = Date.now() - 100000; for (let i = 0; i < n; i++) { const a = i % fotos.length;
        l.push({ id: raum + "-" + i, von: "q" + a, name: "Q" + a, art: "text", text: "Zeile " + i, zeit: t0 + i * 10, bild: fotos[a] }); } return l; };
      const tafel = (raum) => { try { return JSON.parse(localStorage.getItem("dma_livechat_chatfoto_" + raum) || "null"); } catch (e) { return "kaputt"; } };
      const o = {};
      /* Q1: 700 K frei, 30 Profilfotos je 20 K in den 300 Zeilen (886 ließ hier 318 K frei, 887 vor der Nachbesserung 60 K) */
      {
        const raum = "probe-q1";
        o.q1vorher = fuellen(700000);
        LiveChat.pruefRaum(raum);
        await LiveChat.pruefVerlaufAusLager(raum);
        const fotos = []; for (let a = 0; a < 30; a++) fotos.push(window.__foto(500 + a, 20000));
        const t0 = performance.now();
        LiveChat.pruefVerlaufSetzen(zeilen(raum, 300, fotos));
        o.q1ms = Math.round(performance.now() - t0);
        const t = tafel(raum) || {};
        const kurz = JSON.parse(localStorage.getItem("dma_livechat_chat_" + raum) || "[]");
        const juengste = []; for (let i = kurz.length - 1; i >= 0; i--) { const h = kurz[i].bildH; if (h && juengste.indexOf(h) < 0) juengste.push(h); }
        const keys = Object.keys(t);
        o.q1 = { frei: frei(), zeichen: JSON.stringify(t).length, fotos: keys.length, groesstes: Math.max(0, ...Object.values(t).map((b) => b.length)),
                 juengste: keys.length > 0 && keys.every((h) => juengste.indexOf(h) >= 0 && juengste.indexOf(h) < keys.length),
                 zeilen: kurz.length, probeWeg: localStorage.getItem("dma__frei") === null };
        try { localStorage.setItem("__profilprobe", "p".repeat(140000)); o.q1profil = "ok"; localStorage.removeItem("__profilprobe"); } catch (e) { o.q1profil = e.name; }
      }
      /* Q2: große Fotos (60 K) – nur im Lager, nicht in der Tafel */
      {
        const raum = "probe-q2";
        o.q2vorher = fuellen(2000000);
        LiveChat.pruefRaum(raum);
        await LiveChat.pruefVerlaufAusLager(raum);
        const fotos = []; for (let a = 0; a < 30; a++) fotos.push(window.__foto(600 + a, 60000));
        LiveChat.pruefVerlaufSetzen(zeilen(raum, 300, fotos));
        const t = tafel(raum);
        o.q2 = { frei: frei(), fotos: t && typeof t === "object" ? Object.keys(t).length : 0 };
        await warte(300);
        o.q2lager = await window.__lagerRoh("chatbild:" + JSON.parse(localStorage.getItem("dma_livechat_chat_" + raum) || "[{}]").slice(-1)[0].bildH);
        o.q2lager = typeof o.q2lager === "string" ? o.q2lager.length : 0;
      }
      /* Q3: Speicher voll (100 K frei) – die Tafel scheitert ohne Schaden; ist wieder Platz, wird sie beim nächsten
         Sichern mit DENSELBEN Fotos geschrieben (vorher galt der Stand schon vor dem Schreiben: nie wieder versucht) */
      {
        const raum = "probe-q3";
        o.q3vorher = fuellen(100000);
        LiveChat.pruefRaum(raum);
        await LiveChat.pruefVerlaufAusLager(raum);
        const fotos = [window.__foto(701, 30000), window.__foto(702, 30000), window.__foto(703, 30000)];
        const l = zeilen(raum, 300, fotos);
        let fehler = "";
        try { LiveChat.pruefVerlaufSetzen(l); } catch (e) { fehler = String(e && e.message || e); }
        const t1 = tafel(raum);
        const kurz1 = JSON.parse(localStorage.getItem("dma_livechat_chat_" + raum) || "[]").length;
        o.q3voll = { fehler, fotos: t1 && typeof t1 === "object" ? Object.keys(t1).length : 0, zeilen: kurz1, frei: frei() };
        localStorage.removeItem("__fill");
        LiveChat.pruefVerlaufSetzen(l.slice());
        const t2 = tafel(raum);
        o.q3danach = { fotos: t2 && typeof t2 === "object" ? Object.keys(t2).length : 0, richtig: t2 && typeof t2 === "object" ? Object.values(t2).every((b) => fotos.indexOf(b) >= 0) : false };
      }
      try { localStorage.removeItem("__fill"); } catch (e) {}
      ["probe-q1", "probe-q2", "probe-q3"].forEach((x) => { try { localStorage.removeItem("dma_livechat_chat_" + x); localStorage.removeItem("dma_livechat_chatfoto_" + x); } catch (e) {} });
      return o;
    });
    ok(r.q1.frei >= 300000, "Q1  700 K frei, 30 Fotos je 20 K: danach ≥ 300 K frei (886: 318 K; vorher 60 K)", Math.round(r.q1.frei / 1000) + " K frei (vorher " + Math.round(r.q1vorher / 1000) + " K), Tafel " + Math.round(r.q1.zeichen / 1000) + " K / " + r.q1.fotos + " Fotos, Sichern " + r.q1ms + " ms");
    ok(r.q1.zeichen <= 400100 && r.q1.groesstes <= 40000, "Q1  Tafel ≤ 400 K, kein Foto über 40 K darin", Math.round(r.q1.zeichen / 1000) + " K, größtes " + r.q1.groesstes);
    ok(r.q1.fotos > 0 && r.q1.juengste, "Q1  in der Tafel die Fotos der jüngsten Zeilen", r.q1.fotos + " Fotos");
    ok(r.q1.zeilen === 300 && r.q1.probeWeg, "Q1  Verlauf (300 Zeilen) unberührt, keine Probe liegen geblieben", r.q1.zeilen + " Zeilen");
    ok(r.q1profil === "ok", "Q1  danach passt noch ein eigenes Profilfoto (140 K)", r.q1profil);
    ok(r.q2.fotos === 0 && r.q2.frei >= r.q2vorher - 60000, "Q2  Fotos über 40 K nur im Lager, nicht in der Tafel", r.q2.fotos + " in der Tafel, " + Math.round((r.q2vorher - r.q2.frei) / 1000) + " K belegt");
    ok(r.q2lager >= 60000, "Q2  … das Foto liegt im Lager", r.q2lager + " Zeichen");
    ok(!r.q3voll.fehler && r.q3voll.zeilen === 300 && r.q3voll.fotos === 0, "Q3  Speicher voll (100 K frei): Tafel nicht geschrieben, Verlauf da, kein Fehler", "Tafel " + r.q3voll.fotos + ", Zeilen " + r.q3voll.zeilen + ", frei " + Math.round(r.q3voll.frei / 1000) + " K" + (r.q3voll.fehler ? ", Fehler " + r.q3voll.fehler : ""));
    ok(r.q3danach.fotos === 3 && r.q3danach.richtig, "Q3  wieder Platz: dieselben Fotos kommen beim nächsten Sichern in die Tafel", r.q3danach.fotos + " Fotos");
  }

  if (hat("P")) {
    console.log("\n  P  Zeile kommt, während ein Stücklauf läuft, und dessen Plan feuert noch vor dem Ende → sie wird trotzdem gesichert");
    const r = await pg.evaluate(async () => {
      const warte = (ms) => new Promise((f) => setTimeout(f, ms));
      /* erst Ruhe: keine geplante oder laufende Sicherung aus früheren Teilen (Plan bis 20 s) */
      for (let k = 0; k < 130; k++) { const s = LiveChat.pruefSichernStand(); if (!s.geplant && !s.laeuft) break; await warte(200); }
      const raum = "probe-p";
      LiveChat.pruefRaum(raum);
      await LiveChat.pruefVerlaufAusLager(raum);
      LiveChat.pruefVerlaufSetzen(window.__zeilen(1200, "PZ", 0, null));   // sofort gesichert
      const ric = window.requestIdleCallback, gehalten = [];
      window.requestIdleCallback = (f) => { gehalten.push(f); return 0; };
      const runde = () => { let n = gehalten.length; while (n-- > 0) { const f = gehalten.shift(); if (f) f({ timeRemaining: () => 0, didTimeout: false }); } };
      const abstand = LiveChat.pruefSichernAbstand();
      LiveChat.pruefSichernAbstand(300);
      await warte(350);
      LiveChat.pruefAnhaengen({ id: "p-1", von: "p1", name: "Bea", art: "text", text: "p eins", zeit: Date.now() });
      for (let k = 0; k < 100 && !LiveChat.pruefSichernStand().laeuft; k++) { runde(); if (!LiveChat.pruefSichernStand().laeuft) await warte(20); }
      const lief = LiveChat.pruefSichernStand().laeuft;
      /* jetzt, mitten im Lauf: die zweite Zeile; ihr Plan feuert, bevor der Lauf fertig ist */
      LiveChat.pruefAnhaengen({ id: "p-2", von: "p1", name: "Bea", art: "text", text: "p zwei", zeit: Date.now() });
      await warte(450);
      runde();
      const mitten = LiveChat.pruefSichernStand();
      /* den Lauf zu Ende gehen lassen (und alles, was danach geplant wird) */
      for (let k = 0; k < 120; k++) { await warte(25); runde(); }
      window.requestIdleCallback = ric;
      const ende = LiveChat.pruefSichernStand();
      LiveChat.pruefSichernAbstand(abstand);
      await warte(300);
      const roh = await window.__lagerRoh("chat:" + raum);
      const lager = roh ? JSON.parse(roh) : [];
      return { lief, mitten: { schmutzig: mitten.schmutzig, geplant: mitten.geplant, laeuft: mitten.laeuft }, ende: { schmutzig: ende.schmutzig, geplant: ende.geplant, laeuft: ende.laeuft },
               lagerN: lager.length, letzte: (lager.slice(-1)[0] || {}).text, speicherLetzte: (LiveChat.pruefVerlaufAusSpeicher(raum).slice(-1)[0] || {}).text };
    });
    ok(r.lief && r.mitten.laeuft && r.mitten.schmutzig, "P  nachgestellt: Plan feuerte während des Laufs (schmutzig, Lauf noch nicht fertig)", JSON.stringify(r.mitten));
    ok(r.letzte === "p zwei" && r.lagerN === 1202, "P  die Zeile aus dem Lauf heraus steht danach im Lager", r.lagerN + " Zeilen, letzte „" + r.letzte + "“");
    ok(r.speicherLetzte === "p zwei", "P  … und im localStorage", "letzte „" + r.speicherLetzte + "“");
    ok(!r.ende.schmutzig, "P  am Ende steht nichts mehr aus", JSON.stringify(r.ende));
  }

  ok(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Sicherung läuft gebündelt, und es geht nichts verloren.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
