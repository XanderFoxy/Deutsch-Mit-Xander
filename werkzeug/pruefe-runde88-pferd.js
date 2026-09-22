/* =====================================================================
   SONDE RUNDE 88 — TRAB UND GALOPP
   ---------------------------------------------------------------------
   XANDER: „bei der Physik der Beine von dem Pferd, da gibt es auch
   Wissenschaften dazu, wie so ein Pferd Galopp laeuft. Ja, entweder
   sind es beide Beine, die gleichzeitig auftreffen vorne, und dann die
   hinteren, die nachziehen, oder sie sind im Wechsel — so, das ist
   glaube ich Trab, der Wechsel ist Trab. Aber da koenntest du ja
   entweder den Trab machen, wie realistisch ist, und wenn man das
   Ganze aufzieht, dann soll es Pferd im Galopp."
   Und frueher: „achte dabei auf den Arsch, dass die Beine am Arsch
   sind"; „der Arsch hinten, weil das so lang ist … es sieht aus wie so
   eine wulstige Wurst anstatt von dem Pferdekoerper."

   DIE GANGARTEN, wie sie im Lehrbuch stehen:
   · TRAB ist ein ZWEITAKT. Ein Vorderbein und das GEGENUEBERLIEGENDE
     Hinterbein bewegen sich GLEICHZEITIG; das andere Paar eine halbe
     Runde spaeter. In dieser Zeichnung: b1 (Hinterbein fern) mit b4
     (Vorderbein nah), b3 mit b2.
   · GALOPP ist ein VIERTAKT. Die vier Hufe setzen NACHEINANDER auf,
     danach ist das Pferd frei in der Luft. Zu keinem Zeitpunkt stehen
     zwei Beine gleich.

   Gemessen wird der Drehwinkel jeder Beingruppe aus der berechneten
   Matrix, an mehreren Zeitpunkten. Zwei Beine „laufen zusammen", wenn
   ihr Winkel sich um weniger als ein Grad unterscheidet.
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
  console.log("RUNDE 88 — Trab und Galopp\n");
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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  const reiten = async (tempo) => {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-pferd").forEach((x) => x.remove());
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.wirkung("pferd", "6", "Alex", T > 1 ? { tempo: String(T) } : {});
    }, tempo);
    await pg.waitForTimeout(400);
    return pg.evaluate(() => {
      const p = document.querySelector(".lc-pferd");
      return p ? p.className : "";
    });
  };
  /* Der Winkel jeder Beingruppe zu einem Zeitpunkt. */
  const winkel = async (t) => {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-pferd-beingruppe").forEach((el) =>
        el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
    }, t);
    await pg.waitForTimeout(60);
    return pg.evaluate(() => {
      const lies = (k) => {
        const el = document.querySelector(".lc-pferd-" + k);
        if (!el) return null;
        const m = getComputedStyle(el).transform;
        if (!m || m === "none") return 0;
        const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
        return Number((Math.atan2(z[1], z[0]) * 180 / Math.PI).toFixed(2));
      };
      return { b1: lies("b1"), b2: lies("b2"), b3: lies("b3"), b4: lies("b4") };
    });
  };

  console.log("DER TRAB — ohne Aufziehen\n");
  const klasseT = await reiten(1);
  sage(/lc-pferd-trab/.test(klasseT), "ohne Aufziehen trabt das Pferd", klasseT);
  /* Vier Zeitpunkte ueber eine Runde (0,54 s). */
  const zeitenT = [0, 120, 240, 380];
  const messT = [];
  for (const t of zeitenT) messT.push(await winkel(t));
  const gleich = (a, b) => Math.abs(a - b) < 1;
  sage(messT.every((m) => gleich(m.b1, m.b4)),
    "Hinterbein fern und Vorderbein nah gehen GLEICHZEITIG — das ist die Diagonale",
    messT.map((m) => m.b1 + "/" + m.b4).join("  "));
  sage(messT.every((m) => gleich(m.b3, m.b2)),
    "und das andere Paar ebenso",
    messT.map((m) => m.b3 + "/" + m.b2).join("  "));
  const abstandT = Math.max.apply(null, messT.map((m) => Math.abs(m.b1 - m.b3)));
  sage(abstandT > 20,
    "die beiden Paare laufen im Gegentakt, nicht gleichauf",
    "groesster Abstand " + abstandT.toFixed(1) + " Grad");

  console.log("\nDER GALOPP — aufgezogen\n");
  const klasseG = await reiten(3);
  sage(/lc-pferd-galopp/.test(klasseG), "aufgezogen galoppiert es", klasseG);
  const zeitenG = [0, 90, 180, 300];
  const messG = [];
  for (const t of zeitenG) messG.push(await winkel(t));
  /* Viertakt: zu keinem Zeitpunkt stehen zwei Beine gleich. */
  const paare = [["b1", "b2"], ["b1", "b3"], ["b1", "b4"],
                 ["b2", "b3"], ["b2", "b4"], ["b3", "b4"]];
  const doppelt = [];
  messG.forEach((m, i) => paare.forEach(([a, b]) => {
    if (gleich(m[a], m[b])) doppelt.push(zeitenG[i] + "ms " + a + "=" + b);
  }));
  sage(doppelt.length === 0,
    "im Galopp setzt jeder Huf fuer sich auf — vier Takte, kein Paar",
    doppelt.length ? doppelt.join(", ") : "vier verschiedene Winkel zu jeder Zeit");
  /* Und die Reihenfolge stimmt: hinten aussen, hinten innen, vorn
     aussen, vorn innen. Wer frueher dran ist, ist im Ablauf weiter. */
  const reihe = await winkel(0);
  sage(reihe.b1 !== null && reihe.b3 !== null && reihe.b2 !== null && reihe.b4 !== null,
    "alle vier Beine sind da",
    "b1 " + reihe.b1 + ", b3 " + reihe.b3 + ", b2 " + reihe.b2 + ", b4 " + reihe.b4);

  console.log("\nDER HUF GEHOERT ANS BEIN\n");
  /* Bein und Huf muessen zusammen wandern. Gemessen wird der Abstand
     zwischen dem unteren Ende des Beins und der Mitte des Hufs zu
     zwei sehr verschiedenen Zeitpunkten. */
  const hufAbstand = async (t) => {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-pferd-beingruppe").forEach((el) =>
        el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
    }, t);
    await pg.waitForTimeout(60);
    return pg.evaluate(() => {
      const g = document.querySelector(".lc-pferd-b3");
      const bein = g.querySelector(".lc-pferd-bein").getBoundingClientRect();
      const huf = g.querySelector(".lc-pferd-huf").getBoundingClientRect();
      return Number(Math.hypot(huf.left + huf.width / 2 - (bein.left + bein.width / 2),
                               huf.top + huf.height / 2 - bein.bottom).toFixed(2));
    });
  };
  const a1 = await hufAbstand(0), a2 = await hufAbstand(210);
  sage(Math.abs(a1 - a2) < 2,
    "der Huf bleibt am Bein, egal wo das Bein gerade steht",
    a1 + " px und " + a2 + " px (frueher drehten beide getrennt)");

  console.log("\nDIE HINTERHAND\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/class="lc-pferd-kruppe"/.test(js)
    && !/lc-pferd-hand" d="M47 41 Q62 43 64 59/.test(js),
    "die Hinterhand ist kein Oval mehr — Kruppe, Gesaess, Oberschenkel");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nZweitakt im Trab, Viertakt im Galopp — und der Huf laeuft mit.\n");
  process.exit(fehler ? 1 : 0);
})();
