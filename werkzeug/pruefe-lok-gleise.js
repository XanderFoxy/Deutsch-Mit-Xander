#!/usr/bin/env node
/* =====================================================================
   SONDE — DIE LOK FAEHRT NUR AUF GERADEN GLEISEN UND RUNDEN KURVEN
   ---------------------------------------------------------------------
   XANDER (25.09.): „übrigens solltest du der Lok auch noch die
   Möglichkeit geben, dass sie in Sequenzen fahren kann und die darf
   niemals schräg mit dem Gleis irgendwo unter. Die muss immer so
   geradlinige Sachen fahren. Also Kurven schon aber auf der Basis, dass
   man gerade Wege zieht und selbst wenn man einen Weg nicht komplett
   voll gezogen hat, dann soll ich nicht schräg zurückfahren. Es soll
   niemals unterbrochene Gleise dargestellt werden … wenn ich jetzt auf
   der sieben sitze und ich zieh meinen Weg nur bis zur zwei. Dann
   könnte das ja schräg ne schräge Kurve machen aber es darf dann
   niemals so wie übereinander gelegte Gleise sein und die müssen
   wirklich verbunden sein."

   GEMESSEN WIRD AN DEN GEZEICHNETEN GLEISEN (SVG .lc-lok-gleis):
     a  jedes gerade Stueck ist genau waagerecht oder senkrecht,
     b  das Ende jedes Stuecks ist der Anfang des naechsten (< 1 px),
        und die Richtung stimmt am Uebergang (kein Knick),
     c  keine zwei Stuecke liegen uebereinander,
     d  die Lok steht waehrend der ganzen Fahrt auf der Gleismitte
        (Abweichung < 3 px), Bild fuer Bild gemessen.
   Die Mittellinie wird aus den beiden Schienen jedes Moduls
   zurueckgerechnet: sie liegen paarweise und in Fahrtreihenfolge im
   SVG (lcLokGleise).

   FAELLE — wer wo sitzt, steht dabei:
     /lok 2 von Platz 7            (Xanders Beispiel, Weg selbst gesucht)
     /lok 7-6-2                    (die gezogene Kette dazu)
     /lok 1-5-6-7-3                (eine Sequenz ueber fuenf Stationen)
     /lok 7-2                      (Weg nur halb gezogen: 7 direkt zur 2,
                                    ohne Zwischenstation — frueher schraeg)
     /lok 7-1  von Platz 7         (halb gezogen, zwei Reihen und zwei
                                    Spalten weit)
     /lok 1-2-6-5                  (geschlossener Kreis)
     /lok 1-12                     (drei Reihen, schraeg gegenueber)
     /lok 6-2  von Platz 7         (Sequenz, die nicht am eigenen Platz
                                    beginnt)
     /lok 4-3-7-6-5-1-2 von der 4  (Schleife — das Tunnelstueck hinter
                                    der 2 laege geradeaus auf 3-4)
     /lok 1-2-3-4-8 mit Schranke   (FUNK 76 bleibt erhalten)
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

const FAELLE = [
  { ich: 7, wen: "2", name: "/lok 2 von Platz 7" },
  { ich: 7, wen: "7-6-2", name: "/lok 7-6-2" },
  { ich: 1, wen: "1-5-6-7-3", name: "/lok 1-5-6-7-3 (Sequenz)" },
  { ich: 7, wen: "7-2", name: "/lok 7-2 (Weg nur halb gezogen)" },
  { ich: 7, wen: "7-1", name: "/lok 7-1 (halb gezogen, zwei Spalten weit)" },
  { ich: 1, wen: "1-2-6-5", name: "/lok 1-2-6-5 (geschlossener Kreis)" },
  { ich: 1, wen: "1-12", name: "/lok 1-12 (drei Reihen)" },
  { ich: 7, wen: "6-2", name: "/lok 6-2 von Platz 7 (Sequenz beginnt nicht am eigenen Platz)" },
  { ich: 4, wen: "4-3-7-6-5-1-2", name: "/lok 4-3-7-6-5-1-2 (Tunnelstueck laege auf dem Anfang)" },
  { ich: 1, wen: "1-2-3-4-8", los: 0.2, name: "/lok 1-2-3-4-8 mit Schranke" }
];

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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 1000 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  /* Die Pruefbuehne hat acht Plaetze; hier kommen 9 bis 12 dazu (drei
     Reihen wie im echten Klassenzimmer), und „Alex" sitzt dort, wo der
     Fall es verlangt. */
  const buehne = (ich) => pg.evaluate((ich) => {
    window.DMA_PRUEF.effektBuehne();
    const reihe = document.getElementById("lcPlaetze");
    for (let nr = 9; nr <= 12; nr++) {
      const b = document.createElement("button");
      b.className = "lc-platz lc-platz-frei";
      b.dataset.lcPlatz = String(nr);
      b.innerHTML = '<span class="lc-kreis"></span><span class="lc-schild" aria-hidden="true">'
        + '<span class="lc-nummer">' + nr + '</span></span><span class="lc-platz-name"></span>';
      reihe.appendChild(b);
    }
    const namen = { 1: "Alex", 2: "Bea", 3: "Cem", 4: "Dana", 5: "Emmi" };
    if (ich !== 1) { namen[ich] = "Alex"; namen[1] = "Finn"; }
    reihe.querySelectorAll(".lc-platz").forEach((p) => {
      const nr = Number(p.dataset.lcPlatz);
      const nm = namen[nr] || "";
      p.classList.toggle("lc-platz-ich", nm === "Alex");
      p.classList.toggle("lc-platz-belegt", Boolean(nm));
      p.classList.toggle("lc-platz-frei", !nm);
      p.querySelector(".lc-platz-name").textContent = nm;
    });
  }, ich);

  const messen = (wen, los) => pg.evaluate(async ([wen, los]) => {
    const warte = (ms) => new Promise((f) => setTimeout(f, ms));
    window.DMA_PRUEFUNG.wirkung("lok", wen, "Alex", { los: los || 0.9 });
    await warte(120);
    const svg = document.querySelector(".lc-lok-gleis");
    if (!svg) return { keinGleis: true };
    const sr = svg.getBoundingClientRect();
    /* Die Schienen, paarweise = ein Modul. */
    const schienen = [...svg.querySelectorAll(".lc-lok-schiene")].map((pf) => {
      const d = pf.getAttribute("d") || "";
      const zahlen = (d.match(/-?[\d.]+/g) || []).map(Number);
      if (/A/.test(d)) {
        return { art: "bogen", x1: zahlen[0], y1: zahlen[1], rr: zahlen[2],
                 fl: zahlen[6], x2: zahlen[7], y2: zahlen[8], rund: pf.classList.contains("lc-lok-rund") };
      }
      return { art: "gerade", x1: zahlen[0], y1: zahlen[1], x2: zahlen[2], y2: zahlen[3],
               rund: pf.classList.contains("lc-lok-rund") };
    });
    const mods = [];
    for (let i = 0; i + 1 < schienen.length; i += 2) {
      const p = schienen[i], q = schienen[i + 1];
      const m = { art: p.art, ax: (p.x1 + q.x1) / 2, ay: (p.y1 + q.y1) / 2,
                  bx: (p.x2 + q.x2) / 2, by: (p.y2 + q.y2) / 2 };
      if (p.art === "bogen") {
        /* Innen- und Aussenschiene haben denselben Mittelpunkt; ihr
           Unterschied zeigt vom Mittelpunkt weg. */
        const inn = p.rr < q.rr ? p : q, aus = p.rr < q.rr ? q : p;
        const dr = aus.rr - inn.rr || 1;
        const ux = (aus.x1 - inn.x1) / dr, uy = (aus.y1 - inn.y1) / dr;
        m.cx = inn.x1 - ux * inn.rr; m.cy = inn.y1 - uy * inn.rr;
        m.r = (inn.rr + aus.rr) / 2;
        m.w0 = Math.atan2(m.ay - m.cy, m.ax - m.cx);
        let dw = Math.atan2(m.by - m.cy, m.bx - m.cx) - m.w0;
        /* Die Drehrichtung steht in der Kennung „sweep". */
        if (p.fl === 1) { while (dw <= 0) dw += 2 * Math.PI; } else { while (dw >= 0) dw -= 2 * Math.PI; }
        m.dw = dw;
      }
      mods.push(m);
    }
    /* Richtung am Anfang und am Ende eines Moduls. */
    const richtung = (m, amEnde) => {
      if (m.art === "gerade") {
        const l = Math.hypot(m.bx - m.ax, m.by - m.ay) || 1;
        return [(m.bx - m.ax) / l, (m.by - m.ay) / l];
      }
      const w = m.w0 + (amEnde ? m.dw : 0), s = m.dw > 0 ? 1 : -1;
      return [-Math.sin(w) * s, Math.cos(w) * s];
    };
    /* a — gerade Stuecke genau waagerecht oder senkrecht. */
    let schraeg = 0, schraegMax = 0;
    mods.forEach((m) => {
      if (m.art !== "gerade") return;
      const dx = Math.abs(m.bx - m.ax), dy = Math.abs(m.by - m.ay);
      const ab = Math.min(dx, dy);
      schraegMax = Math.max(schraegMax, ab);
      if (ab > 0.25) schraeg++;
    });
    /* Boegen: nur echte Viertelkreise (90 Grad). */
    let krumm = 0;
    mods.forEach((m) => {
      if (m.art === "bogen" && Math.abs(Math.abs(m.dw) - Math.PI / 2) > 0.03) krumm++;
    });
    /* b — lueckenlos und ohne Knick. */
    let luecke = 0, lueckeMax = 0, knick = 0, knickMax = 0;
    for (let i = 1; i < mods.length; i++) {
      const a = mods[i - 1], b = mods[i];
      const l = Math.hypot(b.ax - a.bx, b.ay - a.by);
      lueckeMax = Math.max(lueckeMax, l);
      if (l >= 1) luecke++;
      const r1 = richtung(a, true), r2 = richtung(b, false);
      const w = Math.acos(Math.max(-1, Math.min(1, r1[0] * r2[0] + r1[1] * r2[1]))) * 180 / Math.PI;
      knickMax = Math.max(knickMax, w);
      if (w > 3) knick++;
    }
    /* c — nichts liegt uebereinander. */
    let ueber = 0;
    for (let i = 0; i < mods.length; i++) for (let j = i + 1; j < mods.length; j++) {
      const a = mods[i], b = mods[j];
      if (a.art === "gerade" && b.art === "gerade") {
        /* Liegen beide auf derselben Linie (auch schraeg), zaehlt, wie
           weit sich ihre Strecken auf dieser Linie decken. */
        const la = Math.hypot(a.bx - a.ax, a.by - a.ay) || 1;
        const ux = (a.bx - a.ax) / la, uy = (a.by - a.ay) / la;
        const quer = (x, y) => Math.abs(-uy * (x - a.ax) + ux * (y - a.ay));
        if (quer(b.ax, b.ay) < 1 && quer(b.bx, b.by) < 1) {
          const t = (x, y) => (x - a.ax) * ux + (y - a.ay) * uy;
          const b0 = t(b.ax, b.ay), b1 = t(b.bx, b.by);
          const ov = Math.min(la, Math.max(b0, b1)) - Math.max(0, Math.min(b0, b1));
          if (ov > 1) ueber++;
        }
      } else if (a.art === "bogen" && b.art === "bogen") {
        if (Math.hypot(a.cx - b.cx, a.cy - b.cy) < 1 && Math.abs(a.r - b.r) < 1) {
          const iv = (m) => { const x = m.w0, y = m.w0 + m.dw; return [Math.min(x, y), Math.max(x, y)]; };
          const [a0, a1] = iv(a);
          let ov = 0;
          for (let k = -1; k <= 1; k++) {
            const [b0, b1] = iv(b).map((w) => w + k * 2 * Math.PI);
            ov = Math.max(ov, Math.min(a1, b1) - Math.max(a0, b0));
          }
          if (ov > 0.02) ueber++;
        }
      }
    }
    /* Abstand eines Punktes (SVG-Koordinaten) zur Gleismitte. */
    const abstand = (x, y) => {
      let best = Infinity;
      mods.forEach((m) => {
        if (m.art === "gerade") {
          const dx = m.bx - m.ax, dy = m.by - m.ay, ll = dx * dx + dy * dy;
          let f = ll ? ((x - m.ax) * dx + (y - m.ay) * dy) / ll : 0;
          f = Math.max(0, Math.min(1, f));
          best = Math.min(best, Math.hypot(x - m.ax - dx * f, y - m.ay - dy * f));
        } else {
          let w = Math.atan2(y - m.cy, x - m.cx) - m.w0;
          /* Liegt der Winkel innerhalb des Bogens? */
          const s = m.dw > 0 ? 1 : -1;
          let rel = w * s;
          while (rel < 0) rel += 2 * Math.PI;
          while (rel >= 2 * Math.PI) rel -= 2 * Math.PI;
          if (rel <= Math.abs(m.dw)) best = Math.min(best, Math.abs(Math.hypot(x - m.cx, y - m.cy) - m.r));
          best = Math.min(best, Math.hypot(x - m.ax, y - m.ay), Math.hypot(x - m.bx, y - m.by));
        }
      });
      return best;
    };
    /* d — die Lok Bild fuer Bild. */
    let lokMax = 0, bilder = 0, lokAus = 0, schrankeGesehen = false;
    const bis = performance.now() + 20000;
    while (performance.now() < bis && document.querySelector(".lc-lok")) {
      const el = document.querySelector(".lc-lok");
      if (document.querySelector(".lc-lok-schranke")) schrankeGesehen = true;
      const k = el.getBoundingClientRect();
      if (k.width > 2) {
        const mx = k.left + k.width / 2 - sr.left, my = k.top + k.height / 2 - sr.top;
        const ab = abstand(mx, my);
        bilder++;
        if (ab > lokMax) lokMax = ab;
        if (ab >= 3) lokAus++;
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    await warte(300);
    return { module: mods.length, geraden: mods.filter((m) => m.art === "gerade").length,
             boegen: mods.filter((m) => m.art === "bogen").length,
             schraeg: schraeg, schraegMax: +schraegMax.toFixed(2), krumm: krumm,
             luecke: luecke, lueckeMax: +lueckeMax.toFixed(2), knick: knick, knickMax: +knickMax.toFixed(1),
             ueber: ueber, lokMax: +lokMax.toFixed(2), lokAus: lokAus, bilder: bilder,
             schranke: Boolean(document.querySelector(".lc-lok-schranke")) || schrankeGesehen };
  }, [wen, los]);

  for (const fall of FAELLE) {
    console.log("\n" + fall.name + "   (Alex sitzt auf " + fall.ich + ")\n");
    await buehne(fall.ich);
    const m = await messen(fall.wen, fall.los);
    if (m.keinGleis) { sage(false, "es liegen Gleise", "kein .lc-lok-gleis gefunden"); continue; }
    sage(m.module >= 2, "es liegen Gleise", m.geraden + " Geraden, " + m.boegen + " Kurven");
    sage(m.schraeg === 0, "a  jede Gerade ist waagerecht oder senkrecht",
      m.schraeg + " schraeg, groesste Abweichung " + m.schraegMax + " px");
    sage(m.krumm === 0, "a  jede Kurve ist ein Viertelkreis", m.krumm + " andere Boegen");
    sage(m.luecke === 0, "b  jedes Stueck beginnt, wo das vorige endet",
      m.luecke + " Luecken, groesste " + m.lueckeMax + " px");
    sage(m.knick === 0, "b  ohne Knick am Uebergang", m.knick + " Knicke, groesster " + m.knickMax + " Grad");
    sage(m.ueber === 0, "c  keine Gleise uebereinander", m.ueber + " Paare liegen uebereinander");
    sage(m.bilder > 20 && m.lokAus === 0, "d  die Lok bleibt auf der Gleismitte",
      "groesste Abweichung " + m.lokMax + " px, " + m.lokAus + " von " + m.bilder + " Bildern >= 3 px");
    if (fall.los) sage(m.schranke, "die Schranke aus FUNK 76 steht noch da");
  }

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
