/* =====================================================================
   SONDE RUNDE 84 — die letzten drei Punkte aus Runde 76
   ---------------------------------------------------------------------
     · „Musik teilen mit YouTube"
     · „Anziehen-Modul"
     · „Telefon mit Audio"
   Gemessen wird das Verhalten: welche Kennung aus welchem Link
   herauskommt, ob die Krone ein Neuzeichnen ueberlebt, und ob die
   Telefonschnur wirklich erst DANN aufgeht, wenn abgehoben ist.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

function tonMessen(name) {
  const roh = "/tmp/claude-0/pr84-" + name + ".raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", name + ".opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const n = b.length / 2, st = 1200, huelle = [];
  for (let i = 0; i < n; i += st) {
    let x = 0;
    for (let j = i; j < Math.min(n, i + st); j++) {
      const v = Math.abs(b.readInt16LE(j * 2)); if (v > x) x = v;
    }
    huelle.push(x ? Math.round(20 * Math.log10(x / 32768)) : -99);
  }
  return { dauer: n / 24000, huelle: huelle };
}

(async () => {
  console.log("RUNDE 84 — YouTube, Anziehen, Telefon");

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
  /* YouTube ist von der Pruefung aus nicht erreichbar. Gemessen wird
     deshalb die Adresse und die Lage der Karte, nicht das Video. */
  await pg.route("**youtube-nocookie.com/**", (r) =>
    r.fulfill({ status: 200, contentType: "text/html", body: "<p>Video</p>" }));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* =================================================================
     1. MUSIK TEILEN MIT YOUTUBE
     ================================================================= */
  console.log("\nYouTube");
  const LINKS = [
    ["https://www.youtube.com/watch?v=GCExgRfrFr4", "GCExgRfrFr4"],
    ["https://youtu.be/1tD41isys1o?si=abcdef", "1tD41isys1o"],
    ["https://www.youtube.com/shorts/x6q0ciiqyG0", "x6q0ciiqyG0"],
    ["https://www.youtube.com/watch?list=PL1&v=9SLAdldR3Bs&t=42s", "9SLAdldR3Bs"],
    ["9SLAdldR3Bs", "9SLAdldR3Bs"],
    ["https://vimeo.com/12345", ""]
  ];
  const ids = await pg.evaluate((ls) => ls.map((l) => window.DMA_PRUEFUNG.ytId(l[0])),
                                LINKS);
  const falsch = LINKS.filter((l, i) => ids[i] !== l[1]);
  sage(falsch.length === 0,
    "jede Linkform ergibt dieselbe Kennung — und ein fremder Link keine",
    falsch.length ? falsch.map((l, i) => l[0]).join(", ")
      : LINKS.length + " Formen geprueft");

  const karte = await pg.evaluate(() => {
    window.DMA_PRUEFUNG.ytZeigen("GCExgRfrFr4", "Mein Lied", 80);
    const k = document.getElementById("lcYouTube");
    if (!k) return null;
    const i = k.querySelector("iframe");
    const r = i.getBoundingClientRect();
    const lc = document.getElementById("livechatKarte").getBoundingClientRect();
    return { src: i.src, titel: k.querySelector(".lc-ytband-titel").textContent,
             seite: +(r.width / r.height).toFixed(2),
             drin: r.left >= lc.left - 1 && r.right <= lc.right + 1 };
  });
  sage(karte && /\/embed\/GCExgRfrFr4\?/.test(karte.src) && /start=80/.test(karte.src),
    "der Spieler bekommt Kennung und Startzeit",
    karte ? karte.src.replace(/^https:\/\/[^/]+/, "") : "keine Karte");
  sage(karte && /youtube-nocookie\.com/.test(karte.src),
    "und laeuft ohne Werbeverfolgung (nocookie)");
  sage(karte && Math.abs(karte.seite - 1.78) < 0.03 && karte.drin,
    "die Karte sitzt im Klassenzimmer und ist 16:9",
    karte ? "Seitenverhaeltnis " + karte.seite + ", im Rahmen: " + karte.drin : "-");
  sage(karte && karte.titel === "Mein Lied", "und traegt die Aufschrift des Absenders");

  /* =================================================================
     2. DAS ANZIEH-MODUL
     ================================================================= */
  console.log("\nAnziehen");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const STUECKE = ["krone", "brille", "sonnenbrille", "schnurrbart", "muetze", "maske"];
  const angezogen = await pg.evaluate((liste) =>
    liste.map((w) => window.DMA_PRUEFUNG.anziehen("Bea", w)
      && !!document.querySelector('.lc-kleid[data-lc-kleid="' + w + '"]')), STUECKE);
  sage(angezogen.every(Boolean), "alle sechs Sachen lassen sich anziehen",
    STUECKE.filter((w, i) => !angezogen[i]).join(", ") || "sechs von sechs");

  const lage = await pg.evaluate(() => {
    const pl = [...document.querySelectorAll(".lc-platz")]
      .find((p) => p.querySelector(".lc-kleid"));
    if (!pl) return null;
    const r = pl.querySelector(".lc-kleid").getBoundingClientRect();
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    return [r.width - k.width, r.left - k.left, r.top - k.top].map((x) => Math.round(x));
  });
  sage(lage && lage.every((x) => Math.abs(x) <= 2),
    "und sitzen genau auf dem Profilbild",
    lage ? "Breite/links/oben gegen das Bild: " + lage.join(" / ") + " px" : "-");

  /* Der eigentliche Unterschied zu jedem anderen Effekt: es BLEIBT. */
  const nachher = await pg.evaluate(() => {
    window.DMA_PRUEFUNG.anziehen("Alex", "krone");
    window.DMA_PRUEFUNG.anziehen("Cem", "maske");
    window.DMA_PRUEFUNG.kleiderAuffrischen();
    return [...document.querySelectorAll(".lc-kleid")].map((k) => k.dataset.lcKleid).sort();
  });
  sage(nachher.length === 3 && nachher.join(",") === "krone,maske,maske",
    "was jemand anhat, ueberlebt das Neuzeichnen der Sitzreihe",
    "danach getragen: " + nachher.join(", "));
  const ausgezogen = await pg.evaluate(() => {
    window.DMA_PRUEFUNG.anziehen("Bea", "aus");
    return [...document.querySelectorAll(".lc-kleid")].map((k) => k.dataset.lcKleid).sort();
  });
  sage(ausgezogen.join(",") === "krone,maske",
    "und „aus\" nimmt es nur dem Einen wieder ab",
    "danach getragen: " + ausgezogen.join(", "));

  /* =================================================================
     3. DAS TELEFON MIT AUDIO
     ================================================================= */
  console.log("\nTelefon");
  sage(fs.existsSync(path.join(WURZEL, "ton", "telefon.opus"))
    && fs.existsSync(path.join(WURZEL, "ton", "telefon.m4a")),
    "ton/telefon liegt als opus und m4a bereit");
  const t = tonMessen("telefon");
  /* Zwei Klingeln mit einer echten Pause dazwischen — ein
     Dauerton waere kein deutsches Freizeichen. */
  let rufe = 0, drin = false;
  t.huelle.slice(0, 50).forEach((d) => {
    if (d > -40 && !drin) { rufe++; drin = true; }
    else if (d <= -40) drin = false;
  });
  sage(rufe === 2 && Math.abs(t.dauer - 3.4) < 0.15,
    "es klingelt zweimal mit Pause dazwischen",
    rufe + " Klingeln, " + t.dauer.toFixed(2) + " s");

  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("telefon", "Emmi", "Alex"));
  const t0 = Date.now();
  const proben = [];
  for (const wann of [400, 1700, 2600, 3300, 4200]) {
    while (Date.now() - t0 < wann) await new Promise((f) => setTimeout(f, 20));
    proben.push(await pg.evaluate(() => {
      const w = (s) => { const e = document.querySelector(s); if (!e) return null;
        const m = new DOMMatrix(getComputedStyle(e).transform);
        return { dreh: Math.atan2(m.b, m.a) * 180 / Math.PI, x: m.e, y: m.f }; };
      const k = document.querySelector(".lc-tel-kabel");
      return { gerufen: w(".lc-tel-gerufen"), anrufer: w(".lc-tel-anrufer"),
               rest: k ? parseFloat(getComputedStyle(k).strokeDashoffset) : -1,
               wellen: document.querySelectorAll(".lc-tel-welle").length };
    }));
  }
  sage(proben[0].wellen === 2, "zwei Klingelbogen, einer je Klingelton",
    proben[0].wellen + " Bogen");
  /* Der Hoerer des Angerufenen wackelt, solange es klingelt … */
  const wackelt = Math.abs(proben[0].gerufen.dreh) > 3 || Math.abs(proben[1].gerufen.dreh) > 3;
  sage(wackelt, "der Hoerer des Angerufenen wackelt beim Klingeln",
    "gemessen " + proben[0].gerufen.dreh.toFixed(0) + "° und "
    + proben[1].gerufen.dreh.toFixed(0) + "°");
  /* … und die Schnur geht ERST auf, wenn abgehoben ist (2,86 s). */
  sage(proben[2].rest > 1000 && proben[4].rest < 5,
    "die Schnur geht erst auf, wenn abgehoben ist",
    "bei 2,6 s noch " + Math.round(proben[2].rest) + " offen, bei 4,2 s "
    + Math.round(proben[4].rest));
  sage(proben[4].gerufen.y < -5 && proben[4].anrufer.y < -5,
    "und danach halten beide den Hoerer ans Ohr",
    "Gerufener " + proben[4].gerufen.y.toFixed(0) + " px, Anrufer "
    + proben[4].anrufer.y.toFixed(0) + " px nach oben");

  /* --- Und die Befehle kommen an ---------------------------------- */
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/art === "yt"\)/.test(lc) && /wirkung: "ytmusik"/.test(lc),
    "/yt teilt das Video mit allen");
  sage(/art === "anziehen" \|\| art === "ausziehen"/.test(lc)
    && /wirkung: "anziehen"/.test(lc), "/anziehen und /ausziehen gibt es");
  sage(/art === "telefon"\)/.test(lc) && /wirkung: "telefon"/.test(lc),
    "und /telefon ruft an");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
