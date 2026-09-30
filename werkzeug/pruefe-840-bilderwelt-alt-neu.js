/* FASSUNG 840 — PRÜFT DIE ALTE BILDERWELT ALS STANDARD UND DIE NEUE PER LINK
   ---------------------------------------------------------------
   XANDER (Funk 225, wörtlich): „für die Bilderwelt möchte ich meine alte
   Version wieder zurück haben so wie sie war unverändert und nur eine
   Option als Link zur neuen Version so dass ich beide Version habe damit
   ich selber entscheiden kann ob ich deine Updates die du heute gemacht
   hast überhaupt nehmen möchte an der alten Version soll nichts geändert
   werden die möchte ich wieder genauso haben wie sie war“.

   Geprüft wird:
     1 DATEIEN: Alles, was die alte Bilderwelt lädt (baukasten.js,
       data-plaetze.js, data-szenen.js, szenen/*, figuren/*, deren min/-
       Kopien), ist Byte für Byte der Stand 53eaa31 (Fassung 812). In app.js
       unterscheiden sich die Bilderwelt- und Bilderrätsel-Abschnitte nur
       durch die dokumentierte Weiche: jede Stelle trägt „FASSUNG 840“, und
       jede alte Zeile steht unverändert im ALT-Zweig. Die neue Bilderwelt
       liegt vollständig in bilderwelt-neu/.
     2 IM BROWSER, 360 px (Android): Standard ist ALT (alte Figuren, keine
       Datei aus bilderwelt-neu/); Szene, Lupe, Baukasten, Bilderrätsel
       laufen. Der Link „Neue Version ansehen (Test)“ schaltet auf NEU
       (figuren/mensch.js, neue Szenen), „Zur alten Version“ zurück; die
       Wahl hält über das Neuladen. Der Link ist ≥ 30 px hoch, nichts
       überlappt, kein Querscrollen.

   Aufruf:  node werkzeug/pruefe-840-bilderwelt-alt-neu.js
   Bildschirmfotos: BILD=/pfad/praefix   Anderer Stand: WURZEL=/pfad */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync } = require("child_process");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const REPO = path.join(__dirname, "..");          // hier liegt die Versionsgeschichte
const ALT = "53eaa31";                             // Fassung 812 — die alte Bilderwelt
const BILD = process.env.BILD || "";
/* So viele Stellen hat die Weiche in den Bilderwelt-/Bilderrätsel-
   Abschnitten von app.js — jede ist in SPIELSYSTEM.md (Fassung 840)
   einzeln aufgeführt. Eine weitere Stelle ist eine undokumentierte
   Änderung an der alten Bilderwelt. */
const WEICHE_STELLEN = 11;
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };

let fehler = 0;
function sage(ok, text, info) { if (!ok) fehler++; console.log("  " + (ok ? "ok  " : "FEHL") + " " + text + (info ? "   " + info : "")); }
const tick = (ms) => new Promise((r) => setTimeout(r, ms));
const git = (args) => execFileSync("git", args, { cwd: REPO, maxBuffer: 1 << 28 });
const lies = (f) => { const p = path.join(WURZEL, f); return fs.existsSync(p) ? fs.readFileSync(p) : null; };

(async () => {
  /* ---------------------------------------------------------------- 1 */
  console.log("\n1 · DATEIEN: ALTER PFAD = STAND " + ALT + "\n");
  const altListe = git(["ls-tree", "-r", "--name-only", ALT, "--", "szenen", "figuren", "baukasten.js", "data-plaetze.js", "data-szenen.js",
    "min/baukasten.js", "min/data-plaetze.js", "min/data-szenen.js"]).toString().split("\n").filter(Boolean);
  const anders = altListe.filter((f) => { const jetzt = lies(f); return !jetzt || !jetzt.equals(git(["show", ALT + ":" + f])); });
  sage(altListe.length > 60 && !anders.length, "alle Dateien der alten Bilderwelt sind Byte für Byte wie in " + ALT, altListe.length + " Dateien" + (anders.length ? ", anders: " + anders.slice(0, 5).join(" ") : ""));
  const altSet = new Set(altListe);
  const dazu = ["szenen", "figuren"].flatMap((o) => fs.readdirSync(path.join(WURZEL, o)).map((n) => o + "/" + n)).filter((f) => !altSet.has(f));
  sage(!dazu.length, "im alten Pfad liegt nichts Neues (kein figuren/mensch.js, keine Muskel- oder Geschlechtsorgan-Tafel)", dazu.join(" "));
  const NEU_DATEIEN = ["figuren/mensch.js", "baukasten.js", "data-plaetze.js", "data-szenen.js", "szenen/muskeln.js", "szenen/geschlechtsorgane.js", "szenen/wohnzimmer.js", "szenen/badezimmer.js"];
  const fehltNeu = NEU_DATEIEN.filter((f) => !lies("bilderwelt-neu/" + f));
  sage(!fehltNeu.length && /DMA_MENSCH/.test(String(lies("bilderwelt-neu/figuren/mensch.js"))), "die neue Bilderwelt liegt vollständig in bilderwelt-neu/", fehltNeu.join(" "));

  /* Stil: die Baukasten-Chips der alten Bilderwelt wie in 812 */
  const chip = (css) => (/\n\.bk-chip \{[^}]*\}/.exec(css) || [""])[0];
  const cssJetzt = String(lies("app-styles.css")), cssAlt = git(["show", ALT + ":app-styles.css"]).toString();
  sage(chip(cssJetzt) && chip(cssJetzt) === chip(cssAlt) && /html\.bilderwelt-neu \.bk-chip \{ min-height: 32px; \}/.test(cssJetzt),
    "Stil: .bk-chip wie in 812, die größere Tippfläche nur unter html.bilderwelt-neu");

  /* app.js: jede Änderung in den Bilderwelt-/Bilderrätsel-Abschnitten
     gegenüber 53eaa31 muss eine dokumentierte Weichenstelle sein. */
  const appAlt = git(["show", ALT + ":app.js"]).toString();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p840-"));
  const altPfad = path.join(tmp, "app-alt.js");
  fs.writeFileSync(altPfad, appAlt);
  let diff = "";
  try { diff = execFileSync("git", ["diff", "--no-index", "-U0", "--no-color", altPfad, path.join(WURZEL, "app.js")], { maxBuffer: 1 << 28 }).toString(); }
  catch (e) { diff = String(e.stdout || ""); }
  fs.unlinkSync(altPfad); fs.rmdirSync(tmp);
  const zeilen = appAlt.split("\n");
  const zeileVon = (muster) => zeilen.findIndex((z) => z.includes(muster)) + 1;
  /* Die Abschnitte im alten app.js, von Kopfkommentar zu Kopfkommentar */
  const BEREICHE = [[zeileVon("DIE BILDERWELT — Räume, in denen jedes Ding anklickbar ist") - 1, zeileVon("DIE SAUBERE STIMME — ueberall da") - 2],
                    [zeileVon("     DAS BILDERRÄTSEL") - 1, zeileVon("WAS DIE APP KOSTET — offen aufgeschrieben") - 2]];
  const stuecke = [];
  diff.split("\n").forEach((z) => {
    const m = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(z);
    if (m) { stuecke.push({ alt: +m[1], weg: [], neu: [] }); return; }
    const s = stuecke[stuecke.length - 1];
    if (!s || z.startsWith("---") || z.startsWith("+++")) return;
    if (z[0] === "-") s.weg.push(z.slice(1)); else if (z[0] === "+") s.neu.push(z.slice(1));
  });
  const imBereich = (s) => BEREICHE.some(([a, b]) => s.alt >= a && s.alt <= b);
  const bw = stuecke.filter(imBereich), rest = stuecke.filter((s) => !imBereich(s));
  const ohneMarke = bw.filter((s) => !s.neu.some((z) => z.includes("FASSUNG 840")));
  /* Eine ersetzte Zeile gilt als erhalten, wenn ihr Ausdruck (ohne
     „x = “ vorn und „;“ hinten) wörtlich im ALT-Zweig steht — oder wenn
     die neue Zeile ohne den eingeschobenen, markierten NEU-Teil
     „${window.DMA_BILDERWELT_NEU ? … : ""}“ (mit Kommentar „FASSUNG 840“) genau
     die alte Zeile ist. */
  const erhalten = (w, n) => n.includes("FASSUNG 840") && (n.includes(w.trim().replace(/^(const |let )?[\w.]+ = /, "").replace(/;$/, ""))
    || n.replace(/\$\{window\.DMA_BILDERWELT_NEU \? [^}]*\/\* FASSUNG 840[^*]*\*\/\}/g, "") === w);
  const altVerloren = bw.flatMap((s) => s.weg.filter((w) => !s.neu.some((n) => erhalten(w, n))));
  sage(BEREICHE.every(([a, b]) => a > 0 && b > a), "Bilderwelt- und Bilderrätsel-Abschnitt im alten app.js gefunden", BEREICHE.map((b) => b.join("–")).join(", "));
  sage(!ohneMarke.length, "app.js: jede Änderung an Bilderwelt/Bilderrätsel ist als „FASSUNG 840“-Weiche markiert", ohneMarke.map((s) => "alt Z. " + s.alt + ": " + (s.neu[0] || s.weg[0] || "").trim().slice(0, 60)).join(" | "));
  sage(!altVerloren.length, "app.js: jede alte Zeile steht unverändert im ALT-Zweig der Weiche", altVerloren.map((w) => w.trim().slice(0, 70)).join(" | "));
  sage(bw.length === WEICHE_STELLEN, "app.js: genau " + WEICHE_STELLEN + " Weichenstellen (wie in SPIELSYSTEM.md aufgeführt)", bw.length + " gefunden");
  bw.forEach((s) => console.log("         · alt Z. " + s.alt + ": −" + s.weg.length + " +" + s.neu.length + "  " + (s.neu.find((z) => z.includes("FASSUNG 840")) || "").trim().slice(0, 90)));
  const leck = rest.filter((s) => s.neu.some((z) => /FASSUNG 840|DMA_BILDERWELT_NEU|DMA_BW_PFAD/.test(z)));
  sage(!leck.length, "die Weiche reicht nicht in andere Teile von app.js (Satzbaukasten bleibt, wie er ist)", leck.map((s) => "alt Z. " + s.alt).join(" "));

  const html = String(lies("index.html"));
  const neueSzenen = (/var NEUE_SZENEN = (\[[^\]]*\])/.exec(html) || [])[1];
  const neuOrdner = path.join(WURZEL, "bilderwelt-neu/szenen");
  const liegen = (fs.existsSync(neuOrdner) ? fs.readdirSync(neuOrdner) : []).map((n) => n.replace(/\.js$/, "")).sort();
  sage(/window\.DMA_BW_PFAD = function/.test(html) && /\[window\.DMA_BW_PFAD\("baukasten\.js"\), true\]/.test(html) && neueSzenen && liegen.length && JSON.stringify(JSON.parse(neueSzenen).sort()) === JSON.stringify(liegen),
    "index.html: Ladeweiche da, sie kennt genau die Szenen in bilderwelt-neu/szenen", liegen.length + " Szenen");

  /* ---------------------------------------------------------------- 2 */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const basis = "http://127.0.0.1:" + srv.address().port + "/";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
  const pg = await ctx.newPage();
  pg.setDefaultTimeout(90000);
  let anfragen = [];
  const seitenFehler = [];
  pg.on("request", (r) => anfragen.push(r.url().replace(basis, "")));
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e).split("\n")[0]));

  async function bereit() {
    await pg.waitForFunction(() => window.DMA_PRUEF && document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'), null, { timeout: 120000 });
  }
  /* erst den Reiter „Lernen“, dann den Unterpunkt — wie mit dem Finger */
  const unterpunkt = (sub) => pg.evaluate((sub) => {
    const v = document.getElementById("view-learn");
    if (!v || getComputedStyle(v).display === "none") document.querySelector('.tape-tab[data-target="view-learn"]').click();
    const b = document.querySelector('#learnSubnav [data-sub="' + sub + '"]'); b.style.display = ""; b.click();
  }, sub);
  async function bilderweltOeffnen() {
    if (!(await pg.evaluate(() => { const a = document.querySelector("#bilderweltArea .bw-kachel"); return a && a.getBoundingClientRect().height > 0; }))) await unterpunkt("sub-bilderwelt");
    await pg.waitForFunction(() => document.querySelector("#bwVersion a") && document.querySelector("#bilderweltArea [data-bw-szene]"), null, { timeout: 60000 });
    await tick(300);
  }
  async function lage() {
    return pg.evaluate(() => {
      const a = document.querySelector("#bwVersion a"), p = document.getElementById("bwVersion"), ar = document.getElementById("bilderweltArea");
      const ra = a.getBoundingClientRect(), rp = p.getBoundingClientRect(), rb = ar.getBoundingClientRect();
      const kinder = [...p.children].map((k) => k.getBoundingClientRect());
      const ueber = kinder.some((k, i) => kinder.some((l, j) => j > i && k.right > l.left + 0.5 && l.right > k.left + 0.5 && k.bottom > l.top + 0.5 && l.bottom > k.top + 0.5));
      return { text: a.textContent.trim(), hoehe: Math.round(ra.height), breite: Math.round(ra.width), links: Math.round(ra.left), rechts: Math.round(ra.right),
        ueberBereich: rp.bottom <= rb.top + 0.5, ueberKinder: ueber, quer: document.documentElement.scrollWidth - window.innerWidth,
        neu: window.DMA_BILDERWELT_NEU, klasse: document.documentElement.classList.contains("bilderwelt-neu"),
        muskeln: !!document.querySelector('#bilderweltArea [data-bw-szene="muskeln"]') };
    });
  }
  async function szeneUndLupe(modus) {
    /* das Badezimmer: es hat eine Lupe (zur Dusche) in beiden Fassungen */
    await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-szene="badezimmer"]').click());
    await pg.waitForFunction(() => document.querySelector("#bilderweltArea svg.bw-szene-badezimmer [data-bw-teil]"), null, { timeout: 60000 });
    await tick(600);
    const sz = await pg.evaluate(() => { const s = document.querySelector("#bilderweltArea svg.bw-szene-badezimmer");
      return { teile: s.querySelectorAll("[data-bw-teil]").length, iris: s.querySelectorAll('[data-teil="iris"]').length, quer: document.documentElement.scrollWidth - window.innerWidth }; });
    if (BILD) await pg.screenshot({ path: BILD + "-" + modus + "-szene.png" });
    const lupe = await pg.evaluate(() => { const g = document.querySelector("#bilderweltArea [data-bw-lupe-sofort]"); if (!g) return null; const z = g.dataset.bwLupeSofort; g.dispatchEvent(new MouseEvent("click", { bubbles: true })); return z; });
    let lupeOk = false;
    if (lupe) {
      try { await pg.waitForFunction((z) => document.querySelector("#bilderweltArea svg.bw-szene-" + z + " [data-bw-teil]"), lupe, { timeout: 30000 }); lupeOk = true; } catch (e) {}
    }
    if (BILD && lupeOk) await pg.screenshot({ path: BILD + "-" + modus + "-lupe.png" });
    return { ...sz, lupe, lupeOk };
  }
  async function baukasten(modus) {
    await unterpunkt("sub-bilderwelt");
    await pg.waitForFunction(() => document.getElementById("bwZumBaukasten") || document.querySelector("#bilderweltArea .bw-zurueck"), null, { timeout: 30000 });
    /* zurück zur Übersicht, dann die Baukasten-Kachel */
    for (let i = 0; i < 4 && !(await pg.$("#bwZumBaukasten")); i++) {
      await pg.evaluate(() => { const z = document.querySelector("#bilderweltArea .bw-zurueck, #bwZurueck, #bwZoomRaus"); if (z) z.click(); });
      await tick(500);
    }
    await pg.evaluate(() => document.getElementById("bwZumBaukasten").click());
    await pg.waitForFunction(() => { const f = document.querySelector("#baukastenArea [data-bk-figur]"); return f && f.innerHTML.length > 500; }, null, { timeout: 60000 });
    await tick(500);
    const r = await pg.evaluate(() => ({ figur: document.querySelector("#baukastenArea [data-bk-figur]").innerHTML.length,
      mensch: !!document.querySelector("#baukastenArea [data-bk-figur] .mensch"), quer: document.documentElement.scrollWidth - window.innerWidth }));
    if (BILD) await (await pg.$("#baukastenArea")).screenshot({ path: BILD + "-" + modus + "-baukasten.png" });
    return r;
  }
  async function raetsel(modus) {
    await unterpunkt("sub-bilderraetsel");
    await pg.waitForFunction(() => document.querySelector("#bilderraetselArea .br-svg") && document.querySelector("#bilderraetselArea [data-br-satz]"), null, { timeout: 90000 });
    await tick(400);
    if (BILD) await pg.screenshot({ path: BILD + "-" + modus + "-raetsel.png" });
    await pg.evaluate(() => document.querySelector("#bilderraetselArea [data-br-satz]").click());
    await tick(200);
    return pg.evaluate(() => ({ rueck: !!document.querySelector("#bilderraetselArea .bw-rueckmeldung"),
      figur: (document.querySelector("#bilderraetselArea .br-svg") || { innerHTML: "" }).innerHTML.length,
      quer: document.documentElement.scrollWidth - window.innerWidth }));
  }
  const ausNeu = (liste) => liste.filter((u) => /^bilderwelt-neu\//.test(u));
  const alteFiguren = (liste) => liste.filter((u) => /^figuren\/[a-z]+-[mw](-teil\d)?\.js/.test(u));

  try {
    /* ---------- ALT: der Standard ---------- */
    console.log("\n2 · STANDARD = ALTE BILDERWELT (360 px)\n");
    await pg.goto(basis + "index.html", { waitUntil: "domcontentloaded" });
    await bereit();
    await bilderweltOeffnen();
    let l = await lage();
    sage(l.neu === false && !l.klasse, "ohne Wahl lädt die ALTE Bilderwelt");
    sage(l.text === "Neue Version ansehen (Test)" && l.hoehe >= 30, "dezenter Link „Neue Version ansehen (Test)“, Tippfläche ≥ 30 px", l.hoehe + " px hoch");
    sage(l.ueberBereich && !l.ueberKinder && l.quer <= 0 && l.links >= 0 && l.rechts <= 360, "360 px: Link über der Bilderwelt, nichts überlappt, kein Querscrollen", JSON.stringify({ quer: l.quer, rechts: l.rechts }));
    sage(!l.muskeln, "Übersicht wie in 812 (keine Muskel-Tafel)");
    if (BILD) await pg.screenshot({ path: BILD + "-alt-uebersicht.png" });
    const szA = await szeneUndLupe("alt");
    sage(szA.teile > 5 && szA.iris === 0, "alte Szene (Badezimmer) mit den alten Figuren", szA.teile + " Teile, " + szA.iris + " Iris-Marken");
    sage(szA.lupeOk, "Lupe öffnet in der alten Bilderwelt", szA.lupe);
    const bkA = await baukasten("alt");
    sage(bkA.figur > 500 && !bkA.mensch && alteFiguren(anfragen).length > 0, "Baukasten: alte Figur (figuren/<alter>-<geschlecht>.js)", alteFiguren(anfragen).slice(0, 2).join(" "));
    const rA = await raetsel("alt");
    sage(rA.rueck && rA.figur > 1000, "Bilderrätsel läuft (Bild, Sätze, Rückmeldung)");
    sage(!ausNeu(anfragen).length && !anfragen.some((u) => /figuren\/mensch\.js/.test(u)), "ALT holt nichts aus bilderwelt-neu/ und kein figuren/mensch.js", ausNeu(anfragen).slice(0, 3).join(" "));
    sage(szA.quer <= 0 && bkA.quer <= 0 && rA.quer <= 0, "ALT: kein Querscrollen in Szene, Baukasten, Rätsel");

    /* ---------- Link → NEU ---------- */
    console.log("\n3 · LINK → NEUE BILDERWELT\n");
    await unterpunkt("sub-bilderwelt");
    await pg.waitForFunction(() => { const a = document.querySelector("#bwVersion a"); return a && a.getBoundingClientRect().height > 0; }, null, { timeout: 30000 });
    anfragen = [];
    await Promise.all([pg.waitForNavigation({ waitUntil: "domcontentloaded" }), pg.evaluate(() => document.querySelector("#bwVersion a").click())]);
    await bereit();
    await pg.waitForFunction(() => document.querySelector("#bwVersion a") && document.querySelector("#bilderweltArea [data-bw-szene]"), null, { timeout: 60000 });
    await tick(400);
    l = await lage();
    sage(l.neu === true && l.klasse && /bilderwelt=neu/.test(pg.url()), "der Link schaltet auf NEU, die Bilderwelt öffnet sich wieder von selbst", pg.url().replace(basis, ""));
    sage(l.text === "Zur alten Version" && l.hoehe >= 30, "in NEU steht „Zur alten Version“, Tippfläche ≥ 30 px", l.hoehe + " px hoch");
    sage(l.ueberBereich && !l.ueberKinder && l.quer <= 0 && l.rechts <= 360, "360 px: Link und Hinweis überlappen nichts, kein Querscrollen");
    sage(l.muskeln, "NEU: die Tafel „Die Muskeln“ ist in der Übersicht");
    if (BILD) await pg.screenshot({ path: BILD + "-neu-uebersicht.png" });
    const szN = await szeneUndLupe("neu");
    sage(szN.teile > 5 && szN.iris > 0 && anfragen.some((u) => /^bilderwelt-neu\/szenen\/badezimmer\.js/.test(u)), "neue Szene aus bilderwelt-neu/ mit den neuen Menschen", szN.iris + " Iris-Marken");
    sage(szN.lupeOk, "Lupe öffnet in der neuen Bilderwelt", szN.lupe);
    const bkN = await baukasten("neu");
    sage(bkN.mensch && anfragen.some((u) => /^bilderwelt-neu\/figuren\/mensch\.js/.test(u)) && anfragen.some((u) => /^bilderwelt-neu\/baukasten\.js/.test(u)), "Baukasten: neuer Baukasten mit figuren/mensch.js");
    const rN = await raetsel("neu");
    sage(rN.rueck && rN.figur > 1000 && anfragen.some((u) => /^bilderwelt-neu\/data-plaetze\.js/.test(u)), "Bilderrätsel läuft in NEU (Plätze aus bilderwelt-neu/)");
    sage(!alteFiguren(anfragen).length, "NEU holt keine alten Figurendateien", alteFiguren(anfragen).slice(0, 2).join(" "));
    sage(szN.quer <= 0 && bkN.quer <= 0 && rN.quer <= 0, "NEU: kein Querscrollen in Szene, Baukasten, Rätsel");

    /* ---------- die Wahl hält ---------- */
    console.log("\n4 · DIE WAHL WIRD GEMERKT\n");
    anfragen = [];
    await pg.goto(basis + "index.html", { waitUntil: "domcontentloaded" });
    await bereit();
    sage(await pg.evaluate(() => window.DMA_BILDERWELT_NEU === true) && anfragen.some((u) => /^bilderwelt-neu\/baukasten\.js/.test(u)), "nach dem Neuladen (ohne ?bilderwelt) bleibt NEU");
    await bilderweltOeffnen();
    await Promise.all([pg.waitForNavigation({ waitUntil: "domcontentloaded" }), pg.evaluate(() => document.querySelector("#bwVersion a").click())]);
    await bereit();
    await pg.waitForFunction(() => document.querySelector("#bwVersion a"), null, { timeout: 60000 });
    l = await lage();
    sage(l.neu === false && !l.klasse && l.text === "Neue Version ansehen (Test)", "„Zur alten Version“ schaltet zurück auf ALT");
    anfragen = [];
    await pg.goto(basis + "index.html", { waitUntil: "domcontentloaded" });
    await bereit();
    await bilderweltOeffnen();
    sage(await pg.evaluate(() => window.DMA_BILDERWELT_NEU === false) && !ausNeu(anfragen).length, "nach dem Neuladen bleibt ALT, nichts aus bilderwelt-neu/");
    sage(!seitenFehler.length, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  } catch (e) { sage(false, "Browser-Teil lief durch", String(e.message || e).split("\n")[0]); }

  await br.close(); srv.close();
  console.log("\nFassung 840 (Bilderwelt: alt als Standard, neu per Link): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
