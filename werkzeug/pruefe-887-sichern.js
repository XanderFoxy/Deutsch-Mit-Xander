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
   Gegenprobe: WURZEL=<886-Baum> → A, B(verdeckt), W, F rot. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || require("path").join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const NUR = (process.env.NUR || "ABWFRDK").split("");
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
      return { rohLaenge: roh ? roh.length : -1, rohFoto: roh ? roh.indexOf(fotos[0].slice(0, 200)) >= 0 : null, lsLaenge: ls.length, lsFoto: ls.indexOf(fotos[0].slice(0, 200)) >= 0,
               fotoPuts: zuFotos, einFotoOk: fotos.indexOf(einFoto) >= 0, zweitePuts, fotos };
    });
    fotos = r.fotos;
    ok(r.rohLaenge > 0 && !r.rohFoto, "Lager-Text ohne Profilfoto", r.rohLaenge + " Zeichen");
    ok(r.lsLaenge > 0 && !r.lsFoto, "localStorage (300 Zeilen) ohne Profilfoto", r.lsLaenge + " Zeichen");
    ok(Object.keys(r.fotoPuts).length === 3 && Object.values(r.fotoPuts).every((v) => v === 1), "jedes der 3 Fotos genau einmal als „chatbild:…“ ins Lager", JSON.stringify(Object.values(r.fotoPuts)));
    ok(r.einFotoOk, "das gelegte Foto ist das Original");
    ok(r.zweitePuts === 0, "zweite Sicherung legt die Fotos nicht noch einmal", r.zweitePuts + " Mal");
  }

  if (hat("R")) {
    console.log("\n  R  nach dem Neuladen: Verlauf, Fotos, Sprachnachricht, Chatbild");
    await pg.reload({ waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && LiveChat.pruefVerlaufSetzen, null, { timeout: 60000 });
    await pg.waitForTimeout(800);
    await pg.evaluate(helfer);
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

  ok(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Sicherung läuft gebündelt, und es geht nichts verloren.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
