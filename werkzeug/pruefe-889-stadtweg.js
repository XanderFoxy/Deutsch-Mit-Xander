#!/usr/bin/env node
/* =====================================================================
   SONDE 889 — ALTE STADT-DATEIEN VOM SERVER UND AUS DEM HELFER-SPEICHER
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die schnelle Performance und die Verbindung zu den
   anderen haben oberste Priorität" · CLAUDE.md „Puls": Ladezeiten,
   Ordnung, nichts sichtbar ändern.

   Seit 888 laden die Stadt-Seiten ihre Stücke aus bau/ (Vite, M5). Die
   gepackten Dateien der Fassung 887 (stadt/stadt.min.js, stadt-leicht/
   {leicht,autoschau,quests,korn}.min.js, 3,94 MB) lagen nur noch für
   Seiten der Fassung 887 auf dem Server. 889 nimmt sie weg; sw.js räumt
   sie beim Helferwechsel aus seinem Speicher (feste Liste ALT_WEG) und
   gibt einer neu geladenen 887-Seite statt der 404 ihres Bündels ein
   Skript, das sie EINMAL neu lädt.

   TEILE
     A  ohne Browser
        A1 die alten Dateien = genau die .min.js, die die 887-Seiten
           (git f619cbe7: stadt.html, stadt-leicht.html) anfragen; sw.js
           ALT_WEG nennt genau diese
        A2 keine davon liegt mehr im Baum
        A3 keine veröffentlichte Datei nennt sie (alles außer werkzeug/,
           node_modules/, Punkt-Ordnern, *.md, *.txt; sw.js
           nur in ALT_WEG)
        A4 die Bauwege (fassung-setzen, modul-bauen, stadt-backen,
           leicht-zwerg, vite.config.mjs, bau/quelle.json) nennen sie nicht
     B  jede Seite fragt keine davon an und bekommt keine 404 unter
        stadt/, stadt-leicht/, bau/, min/, src/: index.html (Gast, mit
        Ruhepause), index.html?quelle, stadt-leicht.html wie im Spiel und
        mit ?quelle=1 (mit Äckern, Quests und Auto-Schau), stadt.html?neu=1
        gebaut und mit ?quelle=1, __kz.html
     C  Helferwechsel (Server zuerst wie 888: alter Helfer aus git, die
        alten Dateien da, 887-Seiten aus git; dann dieser Baum):
        C1 vorher liegen alle fünf (mit 887-Stempel) und die Stücke aus
           bau/ im Speicher
        C2 nach dem Wechsel: keine der fünf mehr; alles andere ist noch da
        C3 ohne Leitung geht danach alles wie vorher (Seite aus dem
           Speicher, Chat, Reiter, Brücke aus bau/; dieselben Anfragen
           scheitern)
     D  eine Seite der Fassung 887 nach dem Wechsel
        D1 läuft schon (Tab tagelang offen) und öffnet ein Auto: 404 der
           Auto-Schau, die Vertretung zeigt die Autokarte (sonst), kein
           Seitenfehler, die Stadt läuft weiter
        D2 ihre Nachlade-Stücke fehlen (Äcker, Quests): goldene Fläche,
           keine Quests, kein Seitenfehler
        D3 kommt neu aus dem HTTP-Speicher (leichte Stadt): EIN Neuladen,
           danach die neue Seite aus bau/, die Stadt steht
        D4 dasselbe für die Baukasten-Stadt (stadt.html)
        D5 liefert der Server weiter die alte Seite: genau ein Neuladen,
           kein Kreis

   Aufruf:      node werkzeug/pruefe-889-stadtweg.js        (NUR=ABCD)
   Gegenprobe:  WURZEL=<Baum 888, z. B. /tmp/claude-0/v888> node …  → A, C, D rot
                WURZEL=<dieser Baum mit sw.js aus 4bd701b3> node …  → C, D3/D4 rot
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http");
const { execFileSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const REPO = path.join(__dirname, "..");
const NUR = process.env.NUR || "ABCD";
const ALT_GIT = process.env.ALT_GIT || "4bd701b3";   /* Fassung 888: alter Helfer, die alten Dateien noch da */
const GIT_887 = "f619cbe7";                          /* Fassung 887: die Stadt-Seiten, die sie anfragen */
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const info = (was) => console.log("  info " + was);
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const git = (rev, p) => { try { return execFileSync("git", ["-C", REPO, "show", rev + ":" + p], { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 }); } catch (e) { return null; } };

/* die alten Dateien: was die 887-Seiten anfragen (ohne ?quelle=1) */
const SEITE_887 = { "stadt-leicht.html": git(GIT_887, "stadt-leicht.html"), "stadt.html": git(GIT_887, "stadt.html") };
const ALT = [...new Set(Object.values(SEITE_887).flatMap((b) => [...String(b || "").matchAll(/"((?:stadt|stadt-leicht)\/[a-z]+\.min\.js)\?v=[0-9a-f]{10}"/g)].map((m) => m[1])))].sort();
const ALT_SW = git(ALT_GIT, "sw.js");

(async () => {
  console.log("\nSONDE 889 — alte Stadt-Dateien weg (Server und Helfer-Speicher)   WURZEL " + WURZEL + "\n");
  const sw = (() => { try { return fs.readFileSync(path.join(WURZEL, "sw.js"), "utf8"); } catch (e) { return ""; } })();

  /* ===================== A: ohne Browser ===================== */
  if (NUR.includes("A")) {
    const liste = (() => { const m = /var ALT_WEG = (\[[^\]]*\]);/.exec(sw); try { return m ? JSON.parse(m[1]).slice().sort() : null; } catch (e) { return null; } })();
    sage(ALT.length === 5, "A1 die 887-Seiten (git " + GIT_887 + ") fragen genau fünf gepackte Dateien an", ALT.join(", "));
    sage(Boolean(liste) && JSON.stringify(liste) === JSON.stringify(ALT), "A1 sw.js ALT_WEG nennt genau diese", liste ? liste.join(", ") : "keine Liste ALT_WEG");
    const da = ALT.filter((p) => fs.existsSync(path.join(WURZEL, p)));
    sage(!da.length, "A2 keine davon liegt mehr im Baum (vom Server genommen)", da.join(", "));
    /* A3: jede veröffentlichte Textdatei */
    const weg = (rel) => /^(werkzeug|node_modules)(\/|$)/.test(rel) || /(^|\/)\./.test(rel);
    const text = /\.(html?|js|mjs|cjs|css|json|webmanifest|svg|xml)$/i;
    const treffer = [];
    const lauf = (rel) => {
      const abs = path.join(WURZEL, rel);
      for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
        const r = rel ? rel + "/" + e.name : e.name;
        if (weg(r)) continue;
        if (e.isDirectory()) lauf(r);
        else if (e.isFile() && text.test(e.name)) {
          let t = fs.readFileSync(path.join(WURZEL, r), "utf8");
          if (r === "sw.js") t = t.replace(/var ALT_WEG = \[[^\]]*\];/, "");
          for (const p of ALT) if (t.indexOf(p) >= 0) treffer.push(r + " → " + p);
          /* auch zusammengesetzt: der Dateiname in einer Zeichenkette ("leicht.min.js", 'stadt-leicht/' + "korn.min.js") */
          const n = t.match(/["'`][^"'`\s]{0,80}\b(?:stadt|leicht|autoschau|quests|korn)\.min\.js/g);
          if (n && r !== "sw.js") treffer.push(r + " → " + n.slice(0, 2).join(" | "));
        }
      }
    };
    lauf("");
    sage(!treffer.length, "A3 keine veröffentlichte Datei nennt sie (alles außer werkzeug/, node_modules/, Punkt-Ordnern und Texten: Seiten, Skripte, min/, bau/, src/, sicherung/)", treffer.slice(0, 6).join(" ; "));
    const bauwege = ["werkzeug/fassung-setzen.js", "werkzeug/modul-bauen.js", "werkzeug/stadt-backen.js", "werkzeug/leicht-zwerg.py", "vite.config.mjs", "bau/quelle.json", "package.json"];
    const bt = bauwege.filter((f) => { const t = (() => { try { return fs.readFileSync(path.join(WURZEL, f), "utf8"); } catch (e) { return ""; } })(); return ALT.some((p) => t.indexOf(p) >= 0) || /["'`](?:stadt|leicht|autoschau|quests|korn)\.min\.js/.test(t); });
    sage(!bt.length, "A4 die Bauwege nennen sie nicht (" + bauwege.map((f) => path.basename(f)).join(", ") + ")", bt.join(", "));
    const packer = ["werkzeug/stadt-packen.js", "werkzeug/leicht-packen.js"].filter((f) => fs.existsSync(path.join(WURZEL, f)));
    sage(!packer.length, "A4 keine Packer mehr im Baum", packer.join(", "));
    console.log("");
  }
  if (!/[BCD]/.test(NUR)) return ende();

  /* ===================== Server ===================== */
  const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json",
    ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg",
    ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".woff2": "font/woff2", ".gif": "image/gif", ".wav": "audio/wav", ".ogg": "audio/ogg" };
  const anfragen = [];
  /* phase: „alt“ = wie 888 (alter Helfer, alte Dateien da), „neu“ = WURZEL; stadt: „neu“ | „887“ | „887einmal“ | „887immer“ */
  const S = { phase: "neu", stadt: "neu", funkloch: false, altDa: null, einmal: {} };
  const seite887 = (p) => {
    const n = p.slice(1);
    if (!SEITE_887[n] || S.stadt === "neu") return null;
    if (S.stadt === "887einmal") { if (S.einmal[n]) return null; S.einmal[n] = 1; }
    return SEITE_887[n];
  };
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i)); if (p === "/") p = "/index.html";
    const rec = { p, url: q.url, s: 0, t: Date.now(), nav: q.headers["sec-fetch-mode"] === "navigate" };
    anfragen.push(rec);
    if (S.funkloch) { rec.s = -1; q.socket.destroy(); return; }
    const senden = (s, kopf, body) => { rec.s = s; a.writeHead(s, kopf); a.end(body); };
    const nocache = { "Cache-Control": "no-cache" };
    if (p === "/sw.js" && S.phase === "alt" && ALT_SW) return senden(200, Object.assign({ "Content-Type": "text/javascript" }, nocache), ALT_SW);
    const rel = p.slice(1);
    if (ALT.indexOf(rel) >= 0 && (S.phase === "alt" || (S.altDa && S.altDa.has(rel)))) {
      const b = git(ALT_GIT, rel);
      if (b) return senden(200, { "Content-Type": "text/javascript" }, b);
    }
    const s887 = seite887(p);
    if (s887) { rec.v887 = true; return senden(200, Object.assign({ "Content-Type": TYP[".html"] }, nocache), s887); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL + path.sep) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return senden(404, { "Content-Type": "text/plain" }, "404");
    const kopf = { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream" };
    if (/\.html$/.test(p) || p === "/sw.js" || p === "/fassung.json") Object.assign(kopf, nocache);
    senden(200, kopf, fs.readFileSync(f));
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const bis = async (pg, f, ms, arg) => { const ende = Date.now() + ms; while (Date.now() < ende) { if (await pg.evaluate(f, arg).catch(() => false)) return true; await schlaf(150); } return false; };
  const altAnfragen = (ab) => anfragen.slice(ab).filter((x) => ALT.indexOf(x.p.slice(1)) >= 0);
  const gebraucht404 = (ab) => anfragen.slice(ab).filter((x) => x.s === 404 && /^\/(stadt|stadt-leicht|bau|min|src)\//.test(x.p));
  const fensterNeu = async (o) => {
    const ctx = await br.newContext(Object.assign({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, o || {}));
    await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    return ctx;
  };
  const seiteNeu = async (ctx) => {
    const pg = await ctx.newPage(); pg.fehler = [];
    pg.on("pageerror", (e) => pg.fehler.push(String(e.message || e).slice(0, 140)));
    return pg;
  };
  /* die leichte Stadt ganz: erstes Bild, Äcker, Quests (mit quest=1), Auto-Schau geholt */
  const stadtGanz = async (pg, mitSchau) => {
    const fertig = await bis(pg, () => window.__fertig || window.__fehler, 90000);
    const korn = await bis(pg, () => !!(window.STADT && window.STADT.korn), 20000);
    const quests = await bis(pg, () => !!(window.STADT && window.STADT.quests && !window.STADT.quests.vertretung), 20000);
    let schau = null;
    if (mitSchau) {
      await pg.evaluate(() => { const a = window.STADT && window.STADT.autoschau; if (a && a.vertretung && a.vorladen) a.vorladen().catch(() => {}); }).catch(() => {});
      schau = await bis(pg, () => !!(window.STADT && window.STADT.autoschau && !window.STADT.autoschau.vertretung), 20000);
    }
    return { fertig, korn, quests, schau };
  };

  /* ===================== B: welche Seite fragt was an ===================== */
  if (NUR.includes("B")) {
    console.log("B  Seiten (ohne Helfer)\n");
    const ctx = await fensterNeu({ serviceWorkers: "block" });
    const fall = async (name, url, warten) => {
      const pg = await seiteNeu(ctx), ab = anfragen.length;
      const ok = await pg.goto(HIER + url, { waitUntil: "load", timeout: 120000 }).then(() => true, (e) => e.message.split("\n")[0]);
      const w = ok === true ? await warten(pg) : null;
      await schlaf(500);
      const alt = altAnfragen(ab), f404 = gebraucht404(ab), n = anfragen.length - ab;
      sage(ok === true && alt.length === 0 && f404.length === 0, "B " + name + ": keine alte Datei angefragt, keine 404 unter stadt/, stadt-leicht/, bau/, min/, src/",
        n + " Anfragen" + (w ? ", " + w : "") + (alt.length ? "; ALT: " + alt.map((x) => x.p).join(", ") : "") + (f404.length ? "; 404: " + f404.map((x) => x.p).slice(0, 4).join(", ") : "") + (ok === true ? "" : "; " + ok));
      await pg.close();
      return anfragen.slice(ab);
    };
    let lernenUm = 0;
    const idx = async (pg) => {
      const da = await bis(pg, () => window.LiveChat && document.querySelector('.tape-tab[data-target="view-knowledge"]'), 30000);
      await schlaf(14000);   /* Ruhepause: spiel.js … */
      /* danach „Lernen“ (die ganze Übungssammlung min/data-uebungen.js kommt nach den Kategorie-Teilen, M3b) */
      lernenUm = anfragen.length;
      await pg.click('.tape-tab[data-target="view-learn"]', { timeout: 5000 }).catch(() => {});
      const ende = Date.now() + 25000;
      while (Date.now() < ende && !anfragen.slice(lernenUm).some((x) => x.p === "/min/data-uebungen.js")) await schlaf(250);
      await schlaf(1000);
      return "Seite " + (da ? "läuft" : "NICHT da") + ", „Lernen“ getippt";
    };
    const r1 = await fall("index.html (Gast, mit Ruhepause und „Lernen“)", "/index.html", idx);
    const ganz = r1.filter((x) => x.p === "/min/data-uebungen.js");
    info("min/data-uebungen.js (die ganze Sammlung neben den 90 Kategorie-Dateien): " + (ganz.length ? "angefragt (" + ganz.map((x) => x.s).join(",") + ")" : "im Normalweg nicht angefragt")
      + " – bleibt: Rückfall (ein Teil fehlt, ohne DMA_MODUL, ?quelle/Notweg ohne min/) und spiel.js sammlungLaden (Betreiber spielt Aufgaben ein)");
    await fall("index.html?quelle", "/index.html?quelle", async (pg) => { const da = await bis(pg, () => window.LiveChat && document.querySelector('.tape-tab[data-target="view-knowledge"]'), 60000); await schlaf(4000); return "Seite " + (da ? "läuft" : "NICHT da"); });
    for (const q of ["", "&quelle=1"]) {
      await fall("stadt-leicht.html wie im Spiel" + (q ? " ?quelle=1" : ""), "/stadt-leicht.html?eingebettet=1&mini=1&demo=1&quest=1" + q, async (pg) => {
        const s = await stadtGanz(pg, true);
        return "fertig " + s.fertig + ", Äcker " + s.korn + ", Quests " + s.quests + ", Auto-Schau " + s.schau;
      });
    }
    for (const q of ["", "&quelle=1"]) {
      await fall("stadt.html?neu=1" + (q ? " ?quelle=1" : ""), "/stadt.html?neu=1" + q, async (pg) => {
        const f = await bis(pg, () => window.__fertig || window.__fehler, 120000);
        return "fertig " + f + ", gebündelt " + await pg.evaluate(() => !!(window.STADT && window.STADT.GEBUENDELT)).catch(() => "?");
      });
    }
    await fall("__kz.html", "/__kz.html", async () => { await schlaf(1500); return ""; });
    await ctx.close();
    console.log("");
  }

  /* ===================== C + D: Helferwechsel ===================== */
  if (/[CD]/.test(NUR)) {
    console.log("C  Helferwechsel (vorher: alter Helfer aus git " + ALT_GIT + ", alte Dateien da, 887-Seiten aus git " + GIT_887 + ")\n");
    if (!ALT_SW || ALT.length !== 5) { sage(false, "C  alter Helfer oder 887-Seiten aus git nicht lesbar"); await br.close(); srv.close(); return ende(); }
    S.phase = "alt"; S.stadt = "neu";
    const ctx = await fensterNeu();
    const pg = await seiteNeu(ctx);
    await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
    const gesteuert = await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).then(() => true, () => false);
    await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });   /* jetzt über den Helfer: die Seite kommt in seinen Speicher */
    await bis(pg, () => window.LiveChat && document.querySelector('.tape-tab[data-target="view-knowledge"]'), 30000);
    await schlaf(6000);
    sage(gesteuert, "C0 der alte Helfer (888) führt die Seite");
    /* den Speicher füllen wie ein Gerät unter 887 und 888 */
    const sA = await seiteNeu(ctx), abA = anfragen.length;
    await sA.goto(HIER + "/stadt-leicht.html?eingebettet=1&mini=1&demo=1&quest=1", { waitUntil: "load" });
    const gA = await stadtGanz(sA, true); await schlaf(800); await sA.close();
    gA.schauAnfragen = anfragen.slice(abA).filter((x) => /autoschau/.test(x.p)).map((x) => x.url + " " + x.s).join(", ");
    if (sA.fehler.length) gA.seitenfehler = sA.fehler.slice(0, 2).join(" | ");
    S.stadt = "887";
    const sB = await seiteNeu(ctx);
    await sB.goto(HIER + "/stadt-leicht.html?demo=1&quest=1", { waitUntil: "load" });
    const gB = await stadtGanz(sB, true); await schlaf(800); await sB.close();
    const sC = await seiteNeu(ctx), abC = anfragen.length;
    await sC.goto(HIER + "/stadt.html?neu=1", { waitUntil: "load", timeout: 120000 });
    await bis(sC, () => window.__fertig || window.__fehler, 90000);
    const gC = anfragen.slice(abC).some((x) => x.p === "/stadt/stadt.min.js" && x.s === 200);
    await schlaf(800); await sC.close();
    /* T887: eine 887-Stadt, die offen bleibt (wie im Spiel, Auto-Schau noch nicht geholt) */
    const t887 = await seiteNeu(ctx);
    await t887.goto(HIER + "/stadt-leicht.html?eingebettet=1&mini=1&demo=1&quest=0", { waitUntil: "load" });
    const tFertig = await bis(t887, () => window.__fertig || window.__fehler, 90000);
    S.stadt = "neu";
    info("gefüllt: neue Stadt " + JSON.stringify(gA) + "; 887-Stadt " + JSON.stringify(gB) + "; 887-Baukasten stadt.min.js geholt " + gC + "; offene 887-Stadt fertig " + tFertig);

    const speicher = (p) => p.evaluate(async () => {
      const aus = async (n) => (await caches.has(n)) ? (await (await caches.open(n)).keys()).map((r) => n + " " + r.url.replace(location.origin, "")) : [];
      return (await aus("dma-dateien-1")).concat(await aus("dma-seite-1"));
    }).catch((e) => ["FEHLER " + e.message]);
    const istAlt = (z) => ALT.some((p) => z.split(" ")[1].split("?")[0] === "/" + p);
    const vorher = await speicher(pg);
    const altVorher = vorher.filter(istAlt);
    sage(ALT.every((p) => altVorher.some((z) => z.indexOf(" /" + p + "?v=") >= 0)), "C1 vorher: alle fünf alten Dateien liegen (mit 887-Stempel) im Speicher des Helfers",
      altVorher.map((z) => z.split(" ")[1]).join(", "));
    const bauVorher = vorher.filter((z) => / \/bau\//.test(z));
    sage(bauVorher.some((z) => /\/bau\/stadt-leicht-/.test(z)) && bauVorher.some((z) => /\/bau\/leicht-korn-/.test(z)) && vorher.some((z) => /^dma-seite-1 /.test(z)),
      "C1 … dazu die Stücke der neuen Stadt aus bau/ und die Seite", vorher.length + " Einträge, davon bau/ " + bauVorher.length);

    /* ohne Leitung, vorher */
    const offline = async (wann) => {
      S.funkloch = true;
      const o = await seiteNeu(ctx), weg = new Set();
      o.on("requestfailed", (r) => { try { const u = new URL(r.url()); if (u.origin === HIER) weg.add(u.pathname); } catch (e) {} });
      const r = await o.goto(HIER + "/index.html?mit-sw", { waitUntil: "domcontentloaded", timeout: 30000 }).then(() => true, (e) => e.message.split("\n")[0]);
      const laeuft = await bis(o, () => window.LiveChat && document.querySelector('.tape-tab[data-target="view-knowledge"]'), 30000);
      const bruecke = await bis(o, () => window.DMA_APP && window.DMA_APP.brueckeVorher === true && window.DMA_BRUECKE, 15000);
      await schlaf(4000);
      const stand = { seite: r === true, laeuft, bruecke, weg: [...weg].sort() };
      await o.close();
      S.funkloch = false;
      info("ohne Leitung " + wann + ": Seite " + stand.seite + ", Chat und Reiter " + stand.laeuft + ", Brücke aus bau/ " + stand.bruecke + ", gescheitert " + stand.weg.length + " (" + stand.weg.slice(0, 8).join(" ") + ")");
      return stand;
    };
    const offVorher = await offline("vorher");

    /* der Wechsel */
    S.phase = "neu";
    const wechsel = await pg.evaluate(() => new Promise((ok) => {
      const w = { neu: false, t: {} };
      navigator.serviceWorker.getRegistration().then((r) => {
        if (!r) return ok(w);
        r.addEventListener("updatefound", () => {
          const n = r.installing, t0 = performance.now(); w.neu = true;
          n.addEventListener("statechange", () => { w.t[n.state] = Math.round(performance.now() - t0); if (n.state === "activated") ok(w); });
        });
        r.update().catch((e) => { w.fehler = String(e); });
      });
      setTimeout(() => ok(w), 15000);
    })).catch((e) => ({ neu: false, fehler: e.message }));
    sage(wechsel.neu && wechsel.t.activated != null, "C2 Helferwechsel: der neue Helfer ist aktiv", JSON.stringify(wechsel));
    if (wechsel.t.activated != null && wechsel.t.activating != null) info("activating → activated " + (wechsel.t.activated - wechsel.t.activating) + " ms (Räumen läuft danach, nicht in waitUntil)");
    const leer = await bis(pg, async () => {
      const k = await caches.open("dma-dateien-1"); const alle = await k.keys();
      return !alle.some((r) => /\/(stadt\/stadt|stadt-leicht\/(leicht|autoschau|quests|korn))\.min\.js\?/.test(r.url));
    }, 6000);
    await schlaf(500);
    const nachher = await speicher(pg);
    const altNachher = nachher.filter(istAlt);
    sage(leer && !altNachher.length, "C2 nach dem Wechsel: keine der fünf mehr im Speicher", altNachher.map((z) => z.split(" ")[1]).join(", ") || (vorher.length - nachher.length) + " Einträge weniger");
    const fehlt = vorher.filter((z) => !istAlt(z) && nachher.indexOf(z) < 0);
    const neuDa = nachher.filter((z) => vorher.indexOf(z) < 0);
    sage(!fehlt.length && nachher.length >= vorher.length - altVorher.length, "C2 … alles andere ist noch da (nichts Gebrauchtes gelöscht)",
      vorher.length + " → " + nachher.length + (fehlt.length ? "; FEHLT: " + fehlt.slice(0, 5).join(", ") : "") + (neuDa.length ? "; neu dazu: " + neuDa.slice(0, 4).join(", ") : ""));

    const offNachher = await offline("nachher");
    sage(offNachher.seite && offNachher.laeuft && offNachher.bruecke && offNachher.seite === offVorher.seite && offNachher.laeuft === offVorher.laeuft && offNachher.bruecke === offVorher.bruecke,
      "C3 ohne Leitung geht danach alles wie vorher: Seite aus dem Speicher, Chat und Reiter, Brücke aus bau/", JSON.stringify({ vorher: [offVorher.seite, offVorher.laeuft, offVorher.bruecke], nachher: [offNachher.seite, offNachher.laeuft, offNachher.bruecke] }));
    /* was vorher im Speicher lag (ohne die fünf), muss ohne Leitung weiter kommen; was nie im Speicher liegt (fassung.json,
       Dateien ohne Stempel wie filme/liste.json), scheitert vorher wie nachher – je nachdem, ob die Seite es in den 4 s fragt */
    const lag = new Set(vorher.filter((z) => !istAlt(z)).map((z) => z.split(" ")[1].split("?")[0]));
    const schlecht = offNachher.weg.filter((x) => lag.has(x));
    sage(!schlecht.length, "C3 … nachher scheitert keine Anfrage nach einer Datei, die vorher im Speicher lag",
      (schlecht.join(", ") || "keine") + " (gescheitert vorher: " + (offVorher.weg.join(" ") || "–") + "; nachher: " + (offNachher.weg.join(" ") || "–") + ")");

    if (NUR.includes("D")) {
      console.log("\nD  eine Seite der Fassung 887 nach dem Wechsel\n");
      /* D1: die offene 887-Stadt öffnet ein Auto */
      await t887.bringToFront().catch(() => {}); await schlaf(500);
      const bilder = () => t887.evaluate(() => new Promise((ok) => { let n = 0; const f = () => { if (++n < 5) requestAnimationFrame(f); else ok(n); }; requestAnimationFrame(f); setTimeout(() => ok(n), 3000); })).catch(() => 0);
      const lebtVor = await bilder();
      const fehlerVor = t887.fehler.length, abD1 = anfragen.length;
      const d1 = await t887.evaluate(() => new Promise((ok) => {
        const ST = window.STADT, AS = ST && ST.autoschau, r = { vertretung: !!(AS && AS.vertretung), sonst: 0 };
        const arten = Object.keys((ST && ST.autos && ST.autos.ARTEN) || {}).filter((k) => k === "viper" || k === "batmobil");
        r.art = arten[0] || null;
        if (!AS || !r.art) return ok(r);
        r.versucht = AS.oeffnen(r.art, { sonst: () => { r.sonst++; setTimeout(() => ok(r), 300); } });
        setTimeout(() => ok(r), 10000);
      })).catch((e) => ({ fehler: e.message }));
      const d1a = anfragen.slice(abD1).filter((x) => x.p === "/stadt-leicht/autoschau.min.js");
      const lebt = await bilder();
      const nochVertretung = await t887.evaluate(() => !!(window.STADT.autoschau && window.STADT.autoschau.vertretung)).catch(() => null);
      sage(d1.vertretung && d1.versucht === true && d1.sonst === 1 && d1a.length >= 1 && d1a.every((x) => x.s === 404) && nochVertretung === true,
        "D1 offene 887-Stadt öffnet ein Auto: die Auto-Schau gibt 404, die Vertretung zeigt die Autokarte (sonst)", JSON.stringify(d1) + "; autoschau.min.js " + d1a.map((x) => x.s).join(","));
      sage(t887.fehler.length === fehlerVor && lebt >= 5 && await t887.evaluate(() => !!window.__fertig).catch(() => false),
        "D1 … kein Seitenfehler, die Stadt läuft weiter (Bilder kommen)", "Bilder " + lebtVor + " vorher, " + lebt + " nachher" + (t887.fehler.length > fehlerVor ? "; " + t887.fehler.slice(fehlerVor).join(" | ") : ""));
      await t887.close();

      /* D2: Nachlade-Stücke fehlen (ohne Helfer: nur das Bündel liegt noch – eine Seite, deren Stadt erst nach dem Wechsel stand) */
      {
        const c2 = await fensterNeu({ serviceWorkers: "block" });
        const p2 = await seiteNeu(c2), ab = anfragen.length;
        S.stadt = "887"; S.altDa = new Set(["stadt-leicht/leicht.min.js"]);
        await p2.goto(HIER + "/stadt-leicht.html?eingebettet=1&mini=1&demo=1&quest=1", { waitUntil: "load" });
        const f = await bis(p2, () => window.__fertig || window.__fehler, 90000);
        await p2.bringToFront().catch(() => {});
        await schlaf(4000);
        const st = await p2.evaluate(() => ({ korn: !!window.STADT.korn, quests: !!(window.STADT.quests && window.STADT.quests.vertretung), fehler: window.__fehler || null })).catch((e) => ({ fehler: e.message }));
        const k404 = anfragen.slice(ab).filter((x) => /\/(korn|quests)\.min\.js$/.test(x.p)).map((x) => x.p.split("/").pop() + " " + x.s);
        const lebt2 = await p2.evaluate(() => new Promise((ok) => { let n = 0; const g = () => { if (++n < 5) requestAnimationFrame(g); else ok(n); }; requestAnimationFrame(g); setTimeout(() => ok(n), 3000); })).catch(() => 0);
        S.stadt = "neu"; S.altDa = null;
        sage(f && !st.fehler && !st.korn && st.quests && k404.length === 2 && k404.every((x) => / 404$/.test(x)) && !p2.fehler.length && lebt2 >= 5,
          "D2 887-Stadt ohne ihre Nachlade-Stücke: Äcker als goldene Fläche, keine Quests, kein Seitenfehler, die Stadt läuft", JSON.stringify(st) + "; " + k404.join(", ") + "; Bilder " + lebt2 + (p2.fehler.length ? "; " + p2.fehler.join(" | ") : ""));
        await c2.close();
      }

      /* D3/D4: eine 887-Seite kommt nach dem Wechsel neu (aus dem HTTP-Speicher, ohne Nachfrage) */
      const neuGeladen = async (url, n, warten) => {
        S.stadt = "887einmal"; S.einmal = {};
        const p = await seiteNeu(ctx), ab = anfragen.length;
        await p.goto(HIER + url, { waitUntil: "load", timeout: 120000 }).catch(() => {});
        const fertig = await bis(p, warten, 90000);
        await schlaf(2500);
        const navs = anfragen.slice(ab).filter((x) => x.p === "/" + n);
        const buendel = anfragen.slice(ab).filter((x) => ALT.indexOf(x.p.slice(1)) >= 0).map((x) => x.p.split("/").pop() + " " + x.s);
        const neu = await p.evaluate(() => [...document.querySelectorAll('script[type="module"]')].map((s) => s.getAttribute("src")).join(" ")).catch(() => "");
        const merker = await p.evaluate(() => Object.keys(sessionStorage).filter((k) => /^dma-alt-neu:/.test(k)).join(",")).catch(() => "");
        S.stadt = "neu";
        const r = { fertig, navs: navs.map((x) => (x.v887 ? "887" : "neu")).join(" "), buendel: buendel.join(", "), modul: neu, merker, fehler: p.fehler.slice(0, 2) };
        await p.close();
        return r;
      };
      const d3 = await neuGeladen("/stadt-leicht.html?eingebettet=1&mini=1&demo=1", "stadt-leicht.html", () => window.__fertig || window.__fehler);
      sage(d3.fertig && d3.navs === "887 neu" && /^leicht\.min\.js 404$/.test(d3.buendel) && /bau\/stadt-leicht-/.test(d3.modul) && /dma-alt-neu:/.test(d3.merker),
        "D3 alte leichte Stadt neu geladen: ihr Bündel fehlt → EIN Neuladen, danach die neue Seite aus bau/, die Stadt steht", JSON.stringify(d3));
      const d4 = await neuGeladen("/stadt.html?neu=1", "stadt.html", () => window.__fertig || window.__fehler);
      sage(d4.fertig && d4.navs === "887 neu" && /^stadt\.min\.js 404$/.test(d4.buendel) && /bau\/stadt-/.test(d4.modul),
        "D4 alte Baukasten-Stadt neu geladen: EIN Neuladen, danach die neue Seite aus bau/", JSON.stringify(d4));
      /* D5: der Server liefert weiter die alte Seite (z. B. ein Zwischenspeicher davor) – genau ein Neuladen, kein Kreis */
      {
        S.stadt = "887immer";
        const p = await seiteNeu(ctx), ab = anfragen.length;
        await p.goto(HIER + "/stadt-leicht.html?demo=1", { waitUntil: "load" }).catch(() => {});
        await schlaf(6000);
        const navs = anfragen.slice(ab).filter((x) => x.p === "/stadt-leicht.html").length;
        const b = anfragen.slice(ab).filter((x) => x.p === "/stadt-leicht/leicht.min.js").length;
        S.stadt = "neu";
        sage(navs === 2 && b === 2, "D5 Server liefert weiter die alte Seite: genau ein Neuladen, dann bleibt sie stehen (kein Kreis)", navs + " Navigationen, " + b + "× leicht.min.js");
        await p.close();
      }
    }
    await ctx.close();
  }
  await br.close(); srv.close();
  ende();
})().catch((e) => { console.error(e); process.exit(2); });

function ende() {
  console.log("\n  " + (fehler ? fehler + " FEHLER" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
}
