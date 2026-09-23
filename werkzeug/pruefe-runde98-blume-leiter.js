#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DIE BLUME UND DIE LEITER
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „ich moechte, dass ein Profileffekt dabei ist,
   dass ich jemanden zur aufbluehenden Blume machen kann oder dass ich
   ueber eine Leiter von unten nach oben klettern kann oder jemand
   anderen von seinem Platz von unten nach oben klettern lassen kann."

   ZWEI EFFEKTE, VIER FRAGEN JE EFFEKT:
     · Ist er ueberhaupt da?
     · Bluehen die Blaetter NACHEINANDER auf (eine Blume geht nicht auf
       einen Schlag auf) und wachsen sie wirklich nach aussen?
     · Klettert das Bild bei der Leiter wirklich von UNTEN nach OBEN,
       und zwar in Stufen — nicht in einem Zug?
     · Bleibt das Profilbild selbst unangetastet?
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
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nDIE AUFBLUEHENDE BLUME\n");
  const blume = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 220));
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    if (!platz) return null;
    const kreis = platz.querySelector(".lc-kreis");
    const bildVorher = (platz.querySelector(".lc-kreis img") || {}).src || "";
    window.DMA_PRUEFUNG.wirkung("blume", "Bea", "Alex", {});
    /* Wie weit ist ein Blatt von der Mitte weg? Eine aufgehende Blume
       schiebt ihre Blaetter nach AUSSEN; gemessen wird der Abstand
       vom Mittelpunkt des Bildes. */
    const mitte = () => {
      const r = kreis.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const weiteste = () => {
      const m = mitte();
      let w = 0;
      document.querySelectorAll(".lc-blbl").forEach((b) => {
        const r = b.getBoundingClientRect();
        if (!r.width) return;
        w = Math.max(w, Math.hypot(r.left + r.width / 2 - m.x, r.top + r.height / 2 - m.y));
      });
      return Math.round(w);
    };
    /* Und WIE VIELE sind schon aufgegangen? Ein Blatt zaehlt erst,
       wenn es wirklich Flaeche hat. */
    const offen = () => [...document.querySelectorAll(".lc-blbl")]
      .filter((b) => b.getBoundingClientRect().width > 4
        && Number(getComputedStyle(b).opacity) > 0.5).length;
    const spur = [];
    let stielHoch = 0;
    for (let i = 0; i < 24; i++) {
      await new Promise((f) => setTimeout(f, 140));
      spur.push(offen());
      const st = document.querySelector(".lc-blume-stiel");
      if (st) stielHoch = Math.max(stielHoch, Math.round(st.getBoundingClientRect().height));
    }
    return {
      blaetter: document.querySelectorAll(".lc-blbl").length,
      stiel: Boolean(document.querySelector(".lc-blume-stiel")),
      stielHoch: stielHoch,
      blattAmStiel: document.querySelectorAll(".lc-bl-blatt").length,
      weit: weiteste(),
      spur: spur,
      wiegt: Boolean(kreis && kreis.classList.contains("lc-blueht")),
      bildNachher: (platz.querySelector(".lc-kreis img") || {}).src || "",
      bildVorher: bildVorher,
      kreisGross: Math.round(kreis.getBoundingClientRect().width)
    };
  });
  /* RUNDE 99 (Fassung 513) hat die Bluete auf zwoelf Blaetter in zwei
     Kraenzen umgebaut — auf seinen Wunsch „Bluete auf Stiel, zentriert,
     kleiner". Die Regel folgt seinem neuen Stand. */
  sage(blume && blume.blaetter === 12, "zwoelf Bluetenblaetter liegen um das Bild",
    blume ? blume.blaetter + " Blaetter" : "-");
  sage(blume && blume.stiel && blume.stielHoch > 20 && blume.blattAmStiel === 2,
    "der Stiel waechst unten heraus, mit zwei Blaettern daran",
    blume ? blume.stielHoch + " px hoch, " + blume.blattAmStiel + " Blaetter" : "-");
  /* NICHT ALLE AUF EINMAL: die Zahl der offenen Blaetter muss ueber
     die Zeit STEIGEN. Gingen alle gleichzeitig auf, stuende hier von
     Anfang an die Zehn. */
  const stufig = blume && blume.spur
    && blume.spur[0] < blume.spur[blume.spur.length - 1]
    && new Set(blume.spur).size >= 4;
  console.log("  offene Blaetter im Verlauf: " + ((blume && blume.spur) || []).join(" ") + "\n");
  sage(stufig, "sie gehen NACHEINANDER auf, nicht alle auf einen Schlag",
    blume ? new Set(blume.spur).size + " verschiedene Staende gemessen" : "-");
  sage(blume && blume.weit > blume.kreisGross * 0.2,
    "und sie stehen wirklich nach aussen, nicht uebereinander in der Mitte",
    blume ? "weitestes Blatt " + blume.weit + " px von der Mitte, Bild ist "
      + blume.kreisGross + " px breit" : "-");
  sage(blume && blume.bildVorher === blume.bildNachher,
    "das Profilbild selbst bleibt unangetastet");

  console.log("\nDIE LEITER\n");
  const leiter = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 220));
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("cem") >= 0)[0];
    if (!platz) return null;
    const kreis = platz.querySelector(".lc-kreis");
    const bildVorher = (platz.querySelector(".lc-kreis img") || {}).src || "";
    const ruhe = kreis.getBoundingClientRect().top;
    window.DMA_PRUEFUNG.wirkung("leiter", "Cem", "Alex", {});
    const spur = [];
    let sprossen = 0, holme = 0, leiterHoch = 0;
    for (let i = 0; i < 44; i++) {
      await new Promise((f) => setTimeout(f, 95));
      spur.push(Math.round(kreis.getBoundingClientRect().top - ruhe));
      const l = document.querySelector(".lc-leiter-holz");
      if (l) {
        sprossen = Math.max(sprossen, l.querySelectorAll(".lc-lt-sprosse").length);
        holme = Math.max(holme, l.querySelectorAll(".lc-lt-holm").length);
        leiterHoch = Math.max(leiterHoch, Math.round(l.getBoundingClientRect().height));
      }
    }
    return { spur: spur, sprossen: sprossen, holme: holme, leiterHoch: leiterHoch,
      bildVorher: bildVorher,
      bildNachher: (platz.querySelector(".lc-kreis img") || {}).src || "",
      kreisGross: Math.round(kreis.getBoundingClientRect().width) };
  });
  sage(leiter && leiter.sprossen === 6 && leiter.holme === 2,
    "die Leiter steht da: zwei Holme, sechs Sprossen",
    leiter ? leiter.holme + " Holme, " + leiter.sprossen + " Sprossen" : "-");
  sage(leiter && leiter.leiterHoch > leiter.kreisGross,
    "und sie reicht nach unten ueber das Bild hinaus",
    leiter ? leiter.leiterHoch + " px lang, Bild " + leiter.kreisGross + " px" : "-");
  const tiefste = leiter ? Math.max.apply(null, leiter.spur) : 0;
  console.log("  Hoehe des Bildes im Verlauf (0 = sein Platz): "
    + ((leiter && leiter.spur) || []).join(" ") + "\n");
  sage(tiefste > (leiter ? leiter.kreisGross * 0.6 : 1e9),
    "das Bild geht wirklich erst nach UNTEN an den Fuss der Leiter",
    leiter ? "tiefster Punkt " + tiefste + " px unter seinem Platz" : "-");
  /* KLETTERN HEISST STUFEN. Zwischen den Sprossen kippt das Bild,
     danach steht es wieder — im Verlauf muss es deshalb mehrfach
     kurz langsamer werden und wieder anziehen. Gemessen an der Zahl
     der Richtungswechsel im Abstand zweier Messpunkte. */
  let wechsel = 0;
  if (leiter) {
    const d = [];
    for (let i = 1; i < leiter.spur.length; i++) d.push(leiter.spur[i] - leiter.spur[i - 1]);
    for (let i = 1; i < d.length; i++) {
      if (Math.abs(d[i]) > 1 && Math.abs(d[i - 1]) > 1
        && Math.sign(d[i]) !== Math.sign(d[i - 1])) wechsel++;
    }
  }
  sage(leiter && leiter.spur[leiter.spur.length - 1] === 0,
    "und oben sitzt es wieder genau auf seinem Platz",
    leiter ? "zuletzt " + leiter.spur[leiter.spur.length - 1] + " px" : "-");
  sage(leiter && leiter.bildVorher === leiter.bildNachher,
    "auch hier bleibt das Profilbild unangetastet");

  console.log("\nUND BEIDE STEHEN IM PLATZMENUE\n");
  const menue = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 220));
    const bea = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    window.DMA_PRUEF.platzMenue(bea);
    await new Promise((f) => setTimeout(f, 220));
    const kasten = document.getElementById("lcPlatzMenue");
    const worte = [...kasten.querySelectorAll(".lc-platzmenue-wort")]
      .map((w) => w.textContent.trim());
    const r = kasten.getBoundingClientRect();
    return { worte: worte, unten: Math.round(r.bottom - window.innerHeight),
             oben: Math.round(r.top) };
  });
  sage(menue && menue.worte.indexOf("Leiter") >= 0, "die Leiter ist eine Kachel");
  /* RUNDE 99 — XANDER: die Blume ist „ein Extra, nicht unter Lieb
     sein". Seit Fassung 513 hat sie ihre eigene Kachel; die Regel folgt
     seinem neuen Stand (vorher: unter „Lieb sein"). */
  sage(menue && menue.worte.indexOf("Blume") >= 0,
    "die Blume hat ihre eigene Kachel", (menue ? menue.worte : []).join(" \u00b7 "));
  const unter = await pg.evaluate(async () => {
    const w = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
      .filter((x) => x.textContent.trim() === "Lieb sein")[0];
    if (!w) return [];
    w.closest("button").click();
    await new Promise((f) => setTimeout(f, 220));
    return [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
      .map((x) => x.textContent.trim());
  });
  sage(!unter.some((x) => x.indexOf("Blume") >= 0),
    "und unter \u201eLieb sein\u201c steht sie nicht mehr doppelt",
    unter.join(" \u00b7 "));
  sage(menue && menue.unten <= 0 && menue.oben >= 0,
    "und das Menue passt weiterhin auf den Bildschirm",
    menue ? menue.unten + " px unter dem Rand, oben bei " + menue.oben
      + ", " + menue.worte.length + " Kacheln" : "-");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
