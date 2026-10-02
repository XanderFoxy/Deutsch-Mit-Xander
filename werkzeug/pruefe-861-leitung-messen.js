#!/usr/bin/env node
/* =====================================================================
   SONDE 861 — DIE LEITUNG JE GEGENÜBER WIRD GEMESSEN (Fassung 840)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller". Am 02.10.
   trafen sich zwei Geräte: einmal Ton nach 3,5 s und Leitung nach 8,9 s,
   einmal kam auf ein Angebot nie etwas zurück. Woran es hing, sagte die
   alte Messung nicht (sie zählt nur beim Neuen und nur 30 s).
   Zwei echte Browser-Seiten bauen eine echte Leitung auf (wie 659/856).
   Geprüft:
     A  beide Seiten melden „leitung" (spiel_diagnose), sobald sie steht
     B  der Anrufer hat Gruss → Angebot raus → Antwort da → steht, mit
        Zeiten in der richtigen Reihenfolge; der Angerufene Angebot da →
        Antwort raus
     C  Wege-Kandidaten raus/da nach Art, der Weg (lokal>entfernt) und
        der Zustand der Leitung stehen im Bericht
     D  der Bericht bleibt klein (< 6000 Zeichen, sonst verwirft ihn der
        Server)
     E  der Anruf beginnt im Gruss gleich nach „auch-da" (vor Auftritt
        und Aufgabe)
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
      /* Berichte an den Betreiber abfangen (statt Supabase) */
      window.__berichte = [];
      (typeof Backend !== "undefined" ? Backend : window.Backend).zugang = () => ({ rpc: (name, a) => { window.__berichte.push({ name, art: a && a.p_art, d: a && a.p_daten }); return Promise.resolve({ data: { ok: true } }); } });
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
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  let bereit = null;
  for (let i = 0; i < 300 && !bereit; i++) {
    const k = await A.evaluate(() => window.LiveChat.pruefKanal()), kb = await B.evaluate(() => window.LiveChat.pruefKanal());
    if (k.bereit.indexOf("bbb") >= 0 && kb.bereit.indexOf("aaa") >= 0) bereit = true; else await schlaf(50);
  }
  sage(!!bereit, "die Leitung steht");
  await schlaf(2500);
  const ba = (await A.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung");
  const bb = (await B.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung");
  console.log("   B: " + String(JSON.stringify(bb[0] && bb[0].d)).slice(0, 700));
  sage(ba.length === 1 && bb.length === 1, "A: beide Seiten melden genau einen Bericht „leitung“", ba.length + "/" + bb.length);
  const da = ba[0] && ba[0].d, db = bb[0] && bb[0].d;
  const zeit = (d, was) => { const e = d && d.ev.find((x) => x[0] === was); return e ? e[1] : null; };
  const pcVerbunden = (d) => d && d.ev.some((x) => x[0] === "pc" && x[2] === "connected");
  sage(da && da.anrufer === true && zeit(da, "hallo") === 0 && zeit(da, "angebotRaus") != null && zeit(da, "antwortDa") >= zeit(da, "angebotRaus") && pcVerbunden(da),
    "B: Anrufer – Gruss, Angebot raus, Antwort da, Leitung steht", da && JSON.stringify(da.ev.slice(0, 8)));
  sage(db && db.anrufer === false && zeit(db, "auchDa") === 0 && zeit(db, "angebotDa") != null && zeit(db, "antwortRaus") >= zeit(db, "angebotDa") && pcVerbunden(db),
    "B: Angerufener – „auch-da“ zuerst, dann Angebot da, Antwort raus, Leitung steht", db && JSON.stringify(db.ev.slice(0, 6)));
  sage(da && Object.keys(da.kr).length > 0 && Object.keys(da.kd).length > 0 && db && Object.keys(db.kr).length > 0,
    "C: Wege-Kandidaten raus und da, nach Art gezählt", da && JSON.stringify({ raus: da.kr, da: da.kd }));
  sage(da && /host|srflx|relay|prflx/.test(da.weg) && da.jetzt && da.jetzt[2] === "connected", "C: Weg und Zustand stehen im Bericht", da && (da.weg + " " + JSON.stringify(da.jetzt)));
  sage(da && JSON.stringify(da).length < 6000 && db && JSON.stringify(db).length < 6000, "D: der Bericht bleibt unter 6000 Zeichen", da && JSON.stringify(da).length + " / " + (db && JSON.stringify(db).length));
  /* E: Reihenfolge im Quelltext des Grusses */
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const h = lc.indexOf('if (n.art === "hallo") {'), hs = lc.slice(h, h + 9000);
  const iAuch = hs.indexOf('senden({ art: "auch-da"'), iRuf = hs.indexOf("anrufen(n.von)"), iAuftritt = hs.indexOf("auftrittZeigen(n.von"), iAufgabe = hs.indexOf("aufgabeVerkuenden(n.von)");
  sage(iAuch > 0 && iRuf > iAuch && iRuf < iAuftritt && iRuf < iAufgabe && hs.split("anrufen(n.von)").length === 2, "E: der Anruf beginnt gleich nach „auch-da“, vor Auftritt und Aufgabe (und nur einmal)");
  /* ein zweiter Gruss desselben (Neuladen) startet eine neue Messung */
  await A.evaluate(() => { window.__berichte.length = 0; window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }); });
  let neu = [];
  for (let i = 0; i < 200 && !neu.length; i++) { await schlaf(50); neu = (await A.evaluate(() => window.__berichte)).filter((b) => b.art === "leitung"); }
  sage(neu.length === 1 && neu[0].d.ev[0][0] === "hallo", "nach einem neuen Gruss (Neuladen) gibt es eine neue Zeitleiste", neu.length ? JSON.stringify(neu[0].d.ev.slice(0, 3)) : "keine");
  const f = A.__fehler.concat(B.__fehler);
  sage(f.length === 0, "keine Fehler in der Konsole", f.slice(0, 3).join(" | "));
  laeuft = false;
  console.log("\nFassung 840 (Sonde 861): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
