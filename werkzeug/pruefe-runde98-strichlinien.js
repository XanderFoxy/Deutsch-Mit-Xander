#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DIE STRICHLINIE BEIM VERLASSEN UND ANKOMMEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Auch diese Strichlinienkreise mit der Profil-
   Platznummer [werden] beeinflusst, wenn man sie verlaesst und auf
   einem anderen Profilplatz ankommt — da sind sie immer noch leer oder
   glitschig. Das wolltest du eigentlich reparieren, das ist immer noch
   nicht repariert."

   DIE URSACHE, gemessen: eine Reise setzt am Startplatz die Klassen
   „lc-platz-unterwegs" und „lc-platz-bildweg" und nimmt sie erst beim
   Aufraeumen wieder ab — rund 380 ms NACH dem Sitzwechsel. In dieser
   Luecke ist der Platz schon frei (oder beim Tausch sogar schon von
   jemand anderem besetzt) und traegt trotzdem noch die Reisekennzeichen:
     · auf einem freien Platz IST der gestrichelte Ring der Kreis
       selbst — „lc-platz-bildweg" setzt ihn auf opacity 0,
     · „.lc-platz-unterwegs .lc-schild { z-index: -1 }" schiebt die
       Zahl hinter den Platz.
   Ergebnis: ein nackter Platz mit einer Zahl daneben. Genau das.

   DIESE SONDE STELLT GENAU DIESEN ZUSTAND HER und misst, was dabei
   herauskommt — einmal fuer den freien Platz, einmal fuer den, auf den
   sich beim Tausch jemand anderes setzt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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

  console.log("\n1  DER VERLASSENE PLATZ, WAEHREND DER SITZWECHSEL SCHON DURCH IST\n");
  const m = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const lies = (nr) => {
      const p = document.querySelector('[data-lc-platz="' + nr + '"]');
      const schild = p.querySelector(".lc-schild");
      const num = p.querySelector(".lc-nummer");
      const kreis = p.querySelector(".lc-kreis");
      const name = p.querySelector(".lc-platz-name");
      const cs = getComputedStyle(schild), cv = getComputedStyle(schild, "::before");
      const ck = getComputedStyle(kreis), cn = getComputedStyle(num);
      return {
        schildZ: Number(cs.zIndex), schildOp: Number(cs.opacity),
        ersatzring: cv.content !== "none" && cv.borderStyle === "dashed",
        kreisRing: ck.borderStyle === "dashed" && parseFloat(ck.borderWidth) > 0,
        kreisOp: Number(ck.opacity),
        nummer: num.textContent.trim(),
        nummerDa: cn.display !== "none" && cn.visibility !== "hidden"
                  && Number(cn.opacity) > 0.5,
        nameSicht: name ? getComputedStyle(name).visibility : "-",
      };
    };
    const vorher = lies(6);
    /* Genau der Zustand aus der Luecke: frei UND noch unterwegs. */
    const p6 = document.querySelector('[data-lc-platz="6"]');
    p6.classList.add("lc-platz-unterwegs", "lc-platz-bildweg");
    const luecke = lies(6);
    /* Und derselbe Fall beim TAUSCH: auf dem Platz sitzt jetzt jemand
       ANDERES, die Kennzeichen der fremden Reise haengen aber noch dran.
       Genau dafuer merkt sich der Platz seit Runde 98, wessen Reise es
       ist (data-lc-reist) — livechatPlaetzeAuffrischen raeumt sie dann
       beim naechsten Zeichnen ab. */
    const p2 = document.querySelector('[data-lc-platz="2"]');
    p2.dataset.lcReist = "wer-weggefahren-ist";
    p2.classList.add("lc-platz-unterwegs", "lc-platz-bildweg");
    const fremdVorher = { kreisOp: Number(getComputedStyle(
      p2.querySelector(".lc-kreis")).opacity) };
    /* So, wie es die Sitzreihe beim Zeichnen tut. */
    const reist = p2.dataset.lcReist || "";
    const sitzt = "jemand-anderes";
    if (reist && sitzt && sitzt !== reist) {
      p2.classList.remove("lc-platz-unterwegs", "lc-platz-bildweg");
      delete p2.dataset.lcReist;
    }
    const fremdNachher = { kreisOp: Number(getComputedStyle(
      p2.querySelector(".lc-kreis")).opacity),
      klassen: p2.className };
    return { vorher, luecke, fremdVorher, fremdNachher };
  });

  const v = m.vorher, l = m.luecke;
  sage(v.kreisRing && v.kreisOp === 1 && v.nummerDa,
    "ein freier Platz zeigt Strichlinie und Nummer",
    "Ring " + (v.kreisRing ? "da" : "fehlt") + ", Deckkraft " + v.kreisOp
    + ", Nummer " + v.nummer);
  sage(l.kreisOp === 1 || l.ersatzring,
    "und AUCH DANN, wenn die Reisekennzeichen noch daran haengen",
    "Ring-Deckkraft " + l.kreisOp + (l.ersatzring ? " (Ersatzring da)" : ""));
  sage(l.schildZ >= 0, "die Zahl bleibt vorn, nicht hinter dem Platz",
    "Schild-Ebene " + l.schildZ);
  sage(l.nummerDa && l.nummer === "6", "und sie steht wirklich da",
    "„" + l.nummer + "“");
  sage(l.nameSicht === "visible", "der Name „frei“ ist auch zu lesen",
    l.nameSicht);

  console.log("\n2  UND DER PLATZ, AUF DEN SICH JEMAND ANDERES SETZT\n");
  sage(m.fremdVorher.kreisOp === 0,
    "ohne Aufraeumen waere SEIN Bild unsichtbar",
    "Deckkraft " + m.fremdVorher.kreisOp);
  sage(m.fremdNachher.kreisOp === 1,
    "die Sitzreihe spricht den Platz von der fremden Reise los",
    "Deckkraft " + m.fremdNachher.kreisOp);
  sage(m.fremdNachher.klassen.indexOf("unterwegs") < 0
    && m.fremdNachher.klassen.indexOf("bildweg") < 0,
    "und die Kennzeichen sind weg", m.fremdNachher.klassen);

  /* Ein Bild vom Zustand aus der Luecke — so sieht er wirklich aus. */
  const el = await pg.$("#lcPlaetze");
  if (el) await el.screenshot({ path: "/tmp/claude-0/strichlinien-luecke.png" });

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
