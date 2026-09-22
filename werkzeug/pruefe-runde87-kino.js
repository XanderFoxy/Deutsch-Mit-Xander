/* =====================================================================
   SONDE RUNDE 87 — ADRESSZEILE WEG UND BILDSCHIRM AN
   ---------------------------------------------------------------------
   XANDER: „Ich habe auch noch immer nicht den Modus, dass oben die
   Adresszeile ausgeblendet wird beim Klassenzimmer und des Weiteren
   möchte ich einen Screen-on-Modus haben in dieser Situation, dass man
   dort länger bleiben kann … ich möchte, dass der Bildschirm hier offen
   gezwungen bleibt."

   Gemessen wird:
     1. Steht der Knopf in der Kopfzeile des Klassenzimmers?
     2. Bringt ein echter Tipp die Seite ins Vollbild? (Nur das nimmt
        die Adresszeile wirklich weg — Rollen tut es nicht.)
     3. Merkt sich der Knopf sein Aus, und kommt es beim naechsten
        Betreten von allein wieder?
     4. Geht beides aus, wenn man das Klassenzimmer verlaesst?
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 87 — Vollbild und Bildschirm-an");
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
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && document.getElementById("knowledgeSubnav"),
    { timeout: 20000 });

  /* Das Klassenzimmer braucht Supabase und WebRTC, beides gibt es in
     dieser Pruefung nicht. Damit die KOPFZEILE ueberhaupt gezeichnet
     wird — und nur um die geht es hier —, wird die Lage auf „drin"
     gestellt. Am Kino-Modus selbst aendert das nichts: der haengt am
     Tippen auf den Reiter und auf den Knopf, nicht an der Verbindung. */
  await pg.evaluate(() => {
    const echt = LiveChat.lage;
    LiveChat.moeglich = () => true;
    LiveChat.lage = () => Object.assign(echt(), {
      lage: "drin", raum: "klassenzimmer", ichId: "pruef", ichName: "Alex",
      moeglich: true, frei: 7
    });
  });

  const insKlassenzimmer = async () => {
    await pg.click('[data-target="view-knowledge"]');
    await pg.waitForTimeout(500);
    await pg.click('#knowledgeSubnav [data-sub="sub-livechat"]');
    await pg.waitForTimeout(900);
  };

  /* --- 1. Der Knopf ist da ------------------------------------------- */
  await insKlassenzimmer();
  const knopfDa = await pg.evaluate(() => {
    const k = document.getElementById("lcKino");
    return k ? { text: k.textContent.trim(), titel: k.title,
                 imKopf: Boolean(k.closest(".lc-kopf, .lc-karte, #livechatArea")) } : null;
  });
  sage(Boolean(knopfDa), "Der Knopf steht im Klassenzimmer",
    knopfDa ? JSON.stringify(knopfDa) : "fehlt");

  /* --- 2. Ein echter Tipp bringt Vollbild ---------------------------- */
  /* Schon das Betreten schaltet ein — das ist der „Modus", den er
     wollte, und nicht erst der Knopf. Also wird genau das geprueft. */
  const beimEintritt = await pg.evaluate(() => ({
    voll: Boolean(document.fullscreenElement),
    /* Und der zweite Teil: bleibt der Bildschirm an? Die Sperre
       selbst ist von aussen nicht sichtbar, ihr Zustand steht aber
       im Knopftext. */
    titel: document.getElementById("lcKino")?.title || ""
  }));
  sage(beimEintritt.voll === true,
    "Schon das Betreten blendet die Adresszeile aus (Vollbild)");
  sage(/Bildschirm bleibt an/.test(beimEintritt.titel),
    "Und der Bildschirm wird wachgehalten", beimEintritt.titel);
  /* Fuer die naechste Messung wieder aus, sonst misst der Tipp das
     Ausschalten. */
  await pg.click("#lcKino"); await pg.waitForTimeout(400);
  await pg.click("#lcKino");
  await pg.waitForTimeout(700);
  const nachAn = await pg.evaluate(() => ({
    voll: Boolean(document.fullscreenElement),
    markiert: document.getElementById("lcKino")?.classList.contains("lc-kino-an"),
    text: document.getElementById("lcKino")?.textContent.trim(),
    merker: (() => { try { return localStorage.getItem("dma_lc_kino"); } catch (e) { return "?"; } })()
  }));
  sage(nachAn.voll === true, "Ein Tipp bringt die Seite ins Vollbild — die Adresszeile ist weg");
  sage(nachAn.markiert === true, "Der Knopf zeigt, dass er laeuft", nachAn.text);
  sage(nachAn.merker === null, "Das Einschalten ist gemerkt (kein ,aus')", String(nachAn.merker));

  /* --- 3. Noch ein Tipp schaltet ab und merkt sich das ---------------- */
  await pg.click("#lcKino");
  await pg.waitForTimeout(700);
  const nachAus = await pg.evaluate(() => ({
    voll: Boolean(document.fullscreenElement),
    markiert: document.getElementById("lcKino")?.classList.contains("lc-kino-an"),
    merker: (() => { try { return localStorage.getItem("dma_lc_kino"); } catch (e) { return "?"; } })()
  }));
  sage(nachAus.voll === false, "Noch ein Tipp beendet das Vollbild");
  sage(nachAus.markiert === false, "Der Knopf sieht wieder aus wie vorher");
  sage(nachAus.merker === "aus", "Das Ausschalten ist gemerkt", String(nachAus.merker));

  /* --- 4. Beim Betreten kommt es von allein wieder -------------------- */
  await pg.evaluate(() => { try { localStorage.removeItem("dma_lc_kino"); } catch (e) {} });
  await pg.click('#knowledgeSubnav [data-sub="sub-wegweiser"]');
  await pg.waitForTimeout(500);
  await pg.click('#knowledgeSubnav [data-sub="sub-livechat"]');
  await pg.waitForTimeout(900);
  const beimBetreten = await pg.evaluate(() => Boolean(document.fullscreenElement));
  sage(beimBetreten === true,
    "Beim Betreten geht es von allein an, solange es nicht abgeschaltet wurde");

  /* --- 5. Beim Verlassen geht es wieder aus --------------------------- */
  await pg.click('#knowledgeSubnav [data-sub="sub-wegweiser"]');
  await pg.waitForTimeout(800);
  const nachWeg = await pg.evaluate(() => Boolean(document.fullscreenElement));
  sage(nachWeg === false, "Wer das Klassenzimmer verlaesst, ist auch aus dem Vollbild");

  /* --- 6. Der Bildschirm-an-Teil ------------------------------------- */
  const wach = await pg.evaluate(() => Boolean(navigator.wakeLock));
  console.log("  (zur Kenntnis) navigator.wakeLock in diesem Browser: " + wach);

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
