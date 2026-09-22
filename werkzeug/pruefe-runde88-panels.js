/* =====================================================================
   SONDE RUNDE 88 — JEDES PANEL LAESST SICH SCHLIESSEN
   ---------------------------------------------------------------------
   XANDER, zum wiederholten Mal:
   · „das Text-Panel, wenn man es oeffnet, ist immer noch beim Android
      zu gross — man sieht das untere Ende und die Seite nicht, man
      kann nur hinscrollen … das geht aus dem Bildschirm raus."
   · „und man kann das Panel immer noch nicht schliessen beim Klicken
      in den Leerraum. Genauso beim Bild-Panel … man muss immer
      versuchen, links neben das Bild-Panel den Hintergrund zu
      erreichen, um ueberhaupt wieder rauszukommen. Ansonsten muss man
      glaube ich nur nach unten scrollen, um das zu schliessen, aber
      das ist viel zu umstaendlich — UND DA IST NICHT MAL EIN
      SCHLIESSEN UNTEN IN DEM RAHMEN."

   Der letzte Halbsatz ist der Kern. „Ins Leere tippen" gibt es seit
   Runde 73 und 79 und es funktioniert — aber man SIEHT es nicht. Wer
   es nicht weiss, sucht einen Knopf. Gezaehlt: kein einziges Panel im
   Klassenzimmer hatte einen.

   Gemessen wird deshalb an einem 360 x 740 grossen Bildschirm — das
   ist ein gewoehnliches Android-Telefon —, und zwar:
     1. hat das Panel einen sichtbaren Schliessen-Knopf in SEINEM
        Rahmen?
     2. schliesst dieser Knopf es auch wirklich?
     3. passt das Panel ganz auf den Bildschirm?
     4. und beim Text-Panel: bleibt es in seiner Hoehe und rollt in
        sich, statt den Chat aus dem Bild zu schieben?
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
  console.log("RUNDE 88 — jedes Panel laesst sich schliessen\n");
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
  /* 360 x 740: ein gewoehnliches Android-Telefon. */
  const pg = await br.newPage({ viewport: { width: 360, height: 740 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  console.log("DIE SCHWEBENDEN MENUES\n");
  const menues = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const w = innerWidth, h = innerHeight;
    const pruefe = async (name, auf) => {
      document.getElementById("lcPlatzMenue")?.remove();
      try { auf(); } catch (e) { return { name, fehler: String(e).slice(0, 80) }; }
      await new Promise((f) => setTimeout(f, 220));
      const el = document.querySelector(".lc-platzmenue");
      if (!el) return { name, fehlt: true };
      const r = el.getBoundingClientRect();
      const zu = el.querySelector(".lc-panel-zu");
      const erg = { name,
        drin: r.left >= -1 && r.top >= -1 && r.right <= w + 1 && r.bottom <= h + 1,
        kasten: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
        knopf: Boolean(zu), wort: zu ? zu.textContent.trim() : "" };
      if (zu) {
        zu.click();
        await new Promise((f) => setTimeout(f, 120));
        erg.zuDanach = !document.querySelector(".lc-platzmenue");
      }
      return erg;
    };
    const aus = [];
    /* Die Liederliste wird nachgeladen; ohne sie sagt der Waehler
       „Im Musikordner liegt gerade nichts" und baut gar nichts. */
    for (let i = 0; i < 40; i++) {
      let n = 0;
      try { n = ((LiveChat.lieder && LiveChat.lieder()) || []).length; } catch (e) { n = 0; }
      if (n) break;
      await new Promise((f) => setTimeout(f, 100));
    }
    aus.push(await pruefe("Musik für alle", () => window.DMA_PRUEF.musikWaehler()));
    const platz = document.querySelectorAll(".lc-platz")[1];
    aus.push(await pruefe("Platzmenü", () => window.DMA_PRUEFUNG.platzMenue(platz)));
    const frei = [...document.querySelectorAll(".lc-platz")].find(
      (p) => p.classList.contains("lc-platz-frei"));
    if (frei) aus.push(await pruefe("Anreise-Menü", () => window.DMA_PRUEFUNG.anreiseMenue(frei)));
    return { schirm: [w, h], aus };
  });
  menues.aus.forEach((m) => {
    if (m.fehlt || m.fehler) {
      sage(false, m.name + ": das Menü geht auf", m.fehler || "es kam keines");
      return;
    }
    sage(m.knopf, m.name + ": hat ein „Schliessen“ im Rahmen", m.wort);
    sage(m.zuDanach === true, m.name + ": und der Knopf schliesst es auch wirklich");
    sage(m.drin, m.name + ": passt ganz auf den Bildschirm",
      m.kasten.join(" ") + " bei " + menues.schirm.join(" x "));
  });

  console.log("\nDAS TEXT-PANEL (BEFEHLE & SCHRIFT)\n");
  /* Das Klassenzimmer selbst — nicht die Pruefbuehne: nur dort gibt
     es die Befehlsliste. */
  const text = await pg.evaluate(async () => {
    document.getElementById("lcPruefBuehne")?.remove();
    try { LiveChat.pruefBetreiber(true); } catch (e) {}
    try { LiveChat.pruefRaum("klassenzimmer"); } catch (e) {}
    try { LiveChat.pruefLageSetzen("drin"); } catch (e) {}
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.getElementById("view-knowledge")?.classList.add("active");
    document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]')?.click();
    await new Promise((f) => setTimeout(f, 800));
    const d = document.getElementById("lcBefehleKasten");
    if (!d) return { fehlt: true };
    d.open = true;
    await new Promise((f) => setTimeout(f, 250));
    const st = getComputedStyle(d);
    const knopf = d.querySelector(".lc-panel-zu");
    const erg = { hoehe: st.maxHeight, rollt: st.overflowY, schirm: innerHeight,
                  knopf: Boolean(knopf), kopfKlebt: "" };
    const sum = d.querySelector("summary");
    if (sum) erg.kopfKlebt = getComputedStyle(sum).position;
    /* Tipp ins Leere: der Kasten selbst ist kein Knopf und kein Text. */
    d.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await new Promise((f) => setTimeout(f, 80));
    erg.zuNachLeer = !d.open;
    d.open = true;
    await new Promise((f) => setTimeout(f, 80));
    if (knopf) { knopf.click(); await new Promise((f) => setTimeout(f, 80)); }
    erg.zuNachKnopf = !d.open;
    return erg;
  });
  if (text.fehlt) {
    sage(false, "das Text-Panel ist da", "kein #lcBefehleKasten gefunden");
  } else {
    const grenze = parseFloat(text.hoehe);
    sage(Number.isFinite(grenze) && grenze <= text.schirm,
      "es ist nicht höher als der Bildschirm", text.hoehe + " bei " + text.schirm + " px");
    sage(text.rollt === "auto" || text.rollt === "scroll",
      "und rollt in sich, statt den Chat hinauszuschieben", "overflow-y: " + text.rollt);
    sage(text.kopfKlebt === "sticky",
      "die Zeile „Was man tippen kann“ bleibt oben stehen", "position: " + text.kopfKlebt);
    sage(text.knopf, "es hat ein „Schliessen“ im Rahmen");
    sage(text.zuNachLeer === true, "ein Tipp ins Leere schliesst es");
    sage(text.zuNachKnopf === true, "und der Knopf schliesst es auch");
  }

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nJedes Panel hat sein Schliessen — und bleibt auf dem Bildschirm.\n");
  process.exit(fehler ? 1 : 0);
})();
