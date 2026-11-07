#!/usr/bin/env node
/* =====================================================================
   SONDE 887 — MODUL M4: TUTOR UND BETONUNG ALS MODUL (MODULE-PLAN.md 3)
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität" – und für Xander ändert sich dabei NICHTS Sichtbares.

   A  ohne Browser (Bau und Quelle)
      A1 jede Gruppe aus werkzeug/app-gruppen/*.json steht in
         src/app/<gruppe>.js und ist aus app.js verschwunden (dort höchstens
         eine Weiterleitung)
      A2 Weiterleitungen in app.js = Exporte der Module (nichts fehlt,
         nichts zu viel); src/bruecke.js importiert jedes Modul
      A3 was die Module über window.DMA_APP rufen, stellt app.js dort hin
      A4 min/app.js: jede Weiterleitung ist eine echte Funktion im Kern
         (kein Platzhalter, also kein synchrones Stück-Holen nur fürs
         Weiterreichen), kein gezogener Name mehr darin
      A5 index.html: das Modul steht in der defer-Reihe VOR app.js;
         DMA_MODUL.bruecke nennt eine Datei aus bau/manifest.json, die es gibt
   B  im Browser (gast min, gast ?quelle, konto min)
      B1 die Brücke läuft vor app.js (Ereignis „load“ je Skript), alle
         Eingänge auf window, kein Konflikt
      B2 der Tutor kommt von selbst (frisches Gerät, Tipp auf „Lernen“), „ד schickt ihn
         hinaus, der Reiter 🎓 holt ihn zurück (mit Text)
      B3 Betonung: Tippen in einen Textkasten schaltet sie ein (Punkt/Strich
         im Kasten), noch einmal aus; nach dem Neuzeichnen des Kastens stellt
         der Beobachter sie wieder her
      B4 Schreiben im Chat-Feld blendet den Reiter aus (lc-schreibt), danach
         wieder ein (Ohren des Tutors)
      B5 kein pageerror
   K  Konflikt: steht window.tutorAn schon da (Init-Skript), überschreibt
      die Brücke ihn nicht, nennt ihn in DMA_BRUECKE.konflikt, die Seite
      läuft ohne pageerror
   R  Rückweg: bau/bruecke-*.js nicht ladbar → die Quelle src/bruecke.js
      kommt nach, die gemerkten Rufe werden nachgeholt (Reiter da, Betonung
      geht), kein pageerror

   Aufruf:     node werkzeug/pruefe-887-modul-app.js          (TEIL=A,B,K,R)
   Gegenprobe: WURZEL=<Stand d9637a22> node werkzeug/pruefe-887-modul-app.js → rot
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http"), os = require("os");
const HIER = path.join(__dirname, "..");
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const TEILE = (process.env.TEIL || "A,B,K,R").split(",");
const PROJEKT = "rolcktiryrvjzbwuvobb";
const KONTO = "11111111-2222-4333-8444-555555555555";
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const lies = (p) => { try { return fs.readFileSync(path.join(WURZEL, p), "utf8"); } catch (e) { return ""; } };

function acornHolen() {
  try { return require(path.join(HIER, "werkzeug", "teile-bauen.js")).acornHolen(); } catch (e) { return null; }
}
function oberste(text, modul, acorn) {
  const ast = acorn.parse(text, { ecmaVersion: "latest", sourceType: modul ? "module" : "script" });
  let rumpf = ast.body;
  if (!modul) {
    const h = ast.body.find((st) => st.type === "ExpressionStatement" && st.expression.type === "CallExpression" && st.expression.callee.type === "FunctionExpression");
    rumpf = h ? h.expression.callee.body.body : [];
  }
  const namen = new Map();
  rumpf.forEach((st) => {
    if ((st.type === "FunctionDeclaration" || st.type === "ClassDeclaration") && st.id) namen.set(st.id.name, st);
    if (st.type === "VariableDeclaration") st.declarations.forEach((d) => d.id.type === "Identifier" && namen.set(d.id.name, st));
  });
  return { ast, rumpf, namen };
}
const istWeiter = (st) => st && st.type === "FunctionDeclaration" && st.body.body.length === 1 && st.body.body[0].type === "ReturnStatement"
  && st.body.body[0].argument && st.body.body[0].argument.type === "CallExpression" && st.body.body[0].argument.callee.name === "dmaModul";

function teilA() {
  console.log("A  BAU UND QUELLE (ohne Browser)");
  const acorn = acornHolen();
  if (!acorn) { sage(false, "acorn fehlt"); return; }
  const app = lies("app.js");
  const A = oberste(app, false, acorn);
  const gruppenOrdner = path.join(HIER, "werkzeug", "app-gruppen");   /* die Gruppen gehören zur Sonde (Gegenprobe: WURZEL=alter Stand) */
  const gruppen = fs.existsSync(gruppenOrdner) ? fs.readdirSync(gruppenOrdner).filter((n) => /\.json$/.test(n)).sort()
    .map((n) => JSON.parse(fs.readFileSync(path.join(gruppenOrdner, n), "utf8"))) : [];
  sage(gruppen.length >= 2 && ["tutor", "betonung"].every((g) => gruppen.some((x) => x.gruppe === g)), "A1 Gruppen tutor und betonung beschrieben (werkzeug/app-gruppen/)", gruppen.map((g) => g.gruppe).join(", "));
  const exporte = new Set(), weiter = new Set();
  A.namen.forEach((st, n) => { if (istWeiter(st)) weiter.add(n); });
  const dmaApp = (() => {
    const m = /window\.DMA_APP = \{([\s\S]*?)\n  \};/.exec(app);
    return new Set(m ? m[1].replace(/\/\*[\s\S]*?\*\//g, "").split(/[,\s]+/).map((x) => x.replace(/:.*$/, "")).filter(Boolean) : []);
  })();
  const bruecke = lies("src/bruecke.js");
  for (const g of gruppen) {
    const text = lies("src/app/" + g.gruppe + ".js");
    if (!text) { sage(false, "A1 src/app/" + g.gruppe + ".js fehlt"); continue; }
    const M = oberste(text, true, acorn);
    const fehltDort = g.namen.filter((n) => !M.namen.has(n));
    const nochHier = g.namen.filter((n) => A.namen.has(n) && !istWeiter(A.namen.get(n)));
    sage(!fehltDort.length && !nochHier.length, "A1 " + g.gruppe + ": alle " + g.namen.length + " Namen im Modul, in app.js höchstens als Weiterleitung",
      (fehltDort.length ? "fehlen im Modul: " + fehltDort.join(", ") + " " : "") + (nochHier.length ? "noch in app.js: " + nochHier.join(", ") : ""));
    const ex = [];
    M.rumpf.forEach((st) => { if (st.type === "ExportNamedDeclaration") st.specifiers.forEach((s) => ex.push(s.exported.name)); });
    ex.forEach((n) => exporte.add(n));
    const helfer = [...text.matchAll(/window\.DMA_APP\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]);
    const ohne = [...new Set(helfer)].filter((n) => !dmaApp.has(n));
    sage(helfer.length > 0 && !ohne.length, "A3 " + g.gruppe + ": jeder Helfer aus window.DMA_APP steht dort (" + new Set(helfer).size + ")", ohne.length ? "fehlt in DMA_APP: " + ohne.join(", ") : "");
    sage(new RegExp("import \\* as \\w+ from \"\\./app/" + g.gruppe + "\\.js\"").test(bruecke), "A2 src/bruecke.js importiert src/app/" + g.gruppe + ".js");
  }
  const zuViel = [...weiter].filter((n) => !exporte.has(n)), fehlt = [...exporte].filter((n) => !weiter.has(n));
  sage(weiter.size > 5 && !zuViel.length && !fehlt.length, "A2 Weiterleitungen in app.js (" + weiter.size + ") = Exporte der Module (" + exporte.size + ")",
    (zuViel.length ? "ohne Export: " + zuViel.join(", ") + " " : "") + (fehlt.length ? "ohne Weiterleitung: " + fehlt.join(", ") : ""));
  /* A4 min/app.js */
  const minApp = lies("min/app.js");
  const platz = [...weiter].filter((n) => !new RegExp("function " + n + "\\([^)]*\\)\\{return dmaModul\\(\"" + n + "\"").test(minApp));
  sage(minApp.length > 100000 && weiter.size && !platz.length, "A4 min/app.js: jede Weiterleitung ist eine echte Funktion im Kern", platz.length ? "nicht als Weiterleitung: " + platz.join(", ") : "");
  const alle = gruppen.flatMap((g) => g.namen).filter((n) => !weiter.has(n));
  const drin = alle.filter((n) => new RegExp("(function|const|let|var) " + n + "\\b").test(minApp));
  sage(alle.length > 20 && !drin.length, "A4 min/app.js: keiner der " + alle.length + " gezogenen Namen ist noch darin", drin.join(", "));
  /* A5 index.html */
  const html = lies("index.html");
  const reihe = (/var dateien = \[([\s\S]*?)\];/.exec(html) || [])[1] || "";
  const iM = reihe.indexOf('"@bruecke"'), iA = reihe.indexOf('"app.js"');
  sage(iM > 0 && iA > iM, "A5 index.html: das Modul steht in der defer-Reihe VOR app.js");
  sage(/if \(d === "@bruecke"\) return document\.write\('<scr' \+ 'ipt type="module" src="'/.test(html) && /\(window\.DMA_MODUL \|\| \{\}\)\.bruecke \|\| "src\/bruecke\.js"/.test(html),
    "A5 index.html: schreibt type=\"module\" mit bau/ aus DMA_MODUL, sonst (Quelle, kein Bau) src/bruecke.js");
  sage(/if \(!window\.DMA_BRUECKE\) \{[^}]*s\.type = "module";[^}]*"src\/bruecke\.js"/.test(app), "A5 app.js: Rückweg – ist die Brücke nicht gelaufen, lädt app.js src/bruecke.js nach");
  let karte = null;
  try { karte = JSON.parse((/window\.DMA_MODUL = (\{[^\n]*?\});/.exec(html) || [])[1]); } catch (e) {}
  let manifest = null;
  try { manifest = JSON.parse(lies("bau/manifest.json")); } catch (e) {}
  const datei = karte && karte.bruecke;
  const imManifest = manifest && Object.values(manifest).some((e) => e.isEntry && e.name === "bruecke" && "bau/" + e.file === datei);
  sage(Boolean(datei && imManifest && fs.existsSync(path.join(WURZEL, datei))), "A5 DMA_MODUL.bruecke = Datei aus bau/manifest.json, vorhanden", datei || "fehlt");
}

/* ---------- Browser ---------- */
function supabaseUmd() {
  const kand = [process.env.SUPABASE_UMD, path.join(os.tmpdir(), "dma-mess-supabase-js-2.117.3.umd.js"), "/tmp/dma-mess-supabase-js-2.117.3.umd.js"];
  for (const k of kand) if (k && fs.existsSync(k)) return k;
  return null;
}
function sitzung() {
  const jetzt = Math.floor(Date.now() / 1000);
  return { access_token: "sonde.887.betreiber", token_type: "bearer", expires_in: 86400, expires_at: jetzt + 86400, refresh_token: "sonde-betreiber",
    user: { id: KONTO, aud: "authenticated", role: "authenticated", email: "betreiber@sonde.test", user_metadata: { name: "Xander" }, app_metadata: { provider: "email" }, created_at: "2026-01-01T00:00:00Z" } };
}
const PROFIL = { id: KONTO, name: "Xander", points: 10, badges: [], trophies: [], theme: "bastelheft", is_owner: true, is_admin: true,
  is_moderator: false, is_premium: false, extra_profile_data: { seenFoxIntro: true } };

async function browserTeile() {
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
    ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".m4a": "audio/mp4",
    ".opus": "audio/ogg", ".woff2": "font/woff2", ".gif": "image/gif", ".webm": "video/webm", ".mp4": "video/mp4" };
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(f).pipe(a);
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const BASIS = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--no-proxy-server", "--autoplay-policy=no-user-gesture-required", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });
  const UMD = supabaseUmd();

  async function seite(o) {
    const mitKonto = Boolean(o.konto);
    const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (r) => {
      const u = r.request().url();
      if (/cdn\.jsdelivr\.net\/.*supabase/.test(u)) return mitKonto && UMD ? r.fulfill({ status: 200, contentType: "text/javascript", body: fs.readFileSync(UMD) }) : r.abort();
      if (u.indexOf(PROJEKT + ".supabase.co") < 0) return r.abort();
      const x = new URL(u), m = r.request().method();
      const kopf = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*", "access-control-expose-headers": "*" };
      if (m === "OPTIONS") return r.fulfill({ status: 204, headers: kopf });
      if (x.pathname.startsWith("/auth/v1/user")) return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body: JSON.stringify(sitzung().user) }).catch(() => {});
      if (!x.pathname.startsWith("/rest/v1/")) return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body: "{}" }).catch(() => {});
      const tab = x.pathname.replace("/rest/v1/", "");
      let body = "[]";
      if (m === "GET" && tab === "profiles" && /id=eq\./.test(x.search)) body = JSON.stringify([PROFIL]);
      await warte(120);
      return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body }).catch(() => {});
    });
    if (o.ohneBau) await ctx.route(/\/bau\/bruecke-[^/]*\.js/, (r) => r.abort());
    await ctx.addInitScript(([konto, sitz, konflikt]) => {
      try {
        localStorage.setItem("dma_tour_seen", "1");
        if (konto) localStorage.setItem("sb-rolcktiryrvjzbwuvobb-auth-token", JSON.stringify(sitz));
      } catch (e) {}
      if (konflikt) window.tutorAn = 1;
      window.__lauf = [];
      document.addEventListener("load", (e) => {
        const t = e.target;
        if (t && t.tagName === "SCRIPT" && t.src) window.__lauf.push(t.src.replace(location.origin + "/", "").replace(/\?.*$/, ""));
      }, true);
    }, [mitKonto, sitzung(), Boolean(o.konflikt)]);
    const pg = await ctx.newPage();
    const pe = [], kons = [];
    pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
    pg.on("console", (m) => { if (m.type() === "error") kons.push(m.text().slice(0, 160)); });
    await pg.goto(BASIS + "/index.html" + (o.quelle ? "?quelle" : ""), { waitUntil: "load", timeout: 90000 });
    return { ctx, pg, pe, kons };
  }

  /* B2–B4 auf einer offenen Seite; liefert [gut, was, dazu] */
  async function bedienen(pg) {
    const erg = [];
    /* B2 Tutor kommt von selbst – beim Wechsel in einen Bereich (activateTab; der allererste Aufbau ohne #… ruft ihn nicht) */
    await pg.evaluate(() => { const t = document.querySelector('.tape-tab[data-target="view-learn"]'); if (t) t.click(); });
    const selbst = await pg.waitForFunction(() => { const b = document.querySelector("#tutorBuehne.tutor-da"); const t = document.getElementById("tutorText"); return b && t && t.textContent.trim().length > 10; }, null, { timeout: 12000 }).then(() => true, () => false);
    const text1 = await pg.evaluate(() => (document.getElementById("tutorText") || {}).textContent || "");
    erg.push([selbst, "B2 der Tutor kommt von selbst (frisches Gerät, Tipp auf „Lernen“) mit Text", "„" + text1.slice(0, 50) + "…“"]);
    await pg.evaluate(() => { const z = document.getElementById("tutorZu"); if (z) z.click(); });
    const weg = await pg.waitForFunction(() => !document.getElementById("tutorBuehne") && document.getElementById("tutorReiter"), null, { timeout: 4000 }).then(() => true, () => false);
    erg.push([weg, "B2 „ד schickt ihn hinaus, der Reiter 🎓 steht da"]);
    await pg.evaluate(() => { const r = document.getElementById("tutorReiter"); if (r) r.click(); });
    const zurueck = await pg.waitForFunction(() => { const b = document.querySelector("#tutorBuehne.tutor-da"); const t = document.getElementById("tutorText"); return b && t && t.textContent.trim().length > 10; }, null, { timeout: 8000 }).then(() => true, () => false);
    erg.push([zurueck, "B2 der Reiter holt ihn zurück (mit Text)"]);
    await pg.evaluate(() => { const z = document.getElementById("tutorZu"); if (z) z.click(); });
    await warte(700);
    /* B4 Ohren: Schreiben im Chat-Feld */
    const ohren = await pg.evaluate(async () => {
      const f = document.createElement("input"); f.id = "lcFeld"; document.body.appendChild(f);
      f.focus();
      const an = document.body.classList.contains("lc-schreibt");
      f.blur();
      await new Promise((r) => setTimeout(r, 700));
      const aus = !document.body.classList.contains("lc-schreibt");
      f.remove();
      return { an, aus };
    });
    erg.push([ohren.an && ohren.aus, "B4 Schreiben im Chat-Feld: Reiter weg (lc-schreibt), danach wieder da", JSON.stringify(ohren)]);
    /* B3 Betonung durch Tippen */
    const kasten = await pg.evaluate(() => {
      const SEL = ".question-card, .sammel-text, .kal-karte, .lesetext, .about-card, .profile-modal-card, .tile-detail, .kompass-karte, .witz-karte, .material-card, .tip-card, .community-text, .weg-karte";
      const kand = [...document.querySelectorAll(SEL)].filter((k) => {
        const r = k.getBoundingClientRect();
        return r.width > 50 && r.height > 20 && (k.innerText || "").trim().length >= 40 && k.querySelectorAll("button, a, input, select, textarea").length < 12
          && [...k.querySelectorAll(SEL)].length === 0;
      });
      const k = kand[0];
      if (!k) return null;
      k.setAttribute("data-sonde-kasten", "1");
      return { klasse: k.className, text: (k.innerText || "").slice(0, 40) };
    });
    if (!kasten) { erg.push([false, "B3 Betonung: kein sichtbarer Textkasten gefunden"]); return erg; }
    const tippe = () => pg.evaluate(() => {
      const k = document.querySelector("[data-sonde-kasten]");
      const w = document.createTreeWalker(k, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim().length > 3 && !n.parentElement.closest("button, a, input, select, textarea, label, summary, [role='button'], .speak-btn, svg") ? 1 : 3) });
      const t = w.nextNode();
      (t ? t.parentElement : k).click();
    });
    await tippe();
    const an = await pg.waitForFunction(() => { const k = document.querySelector("[data-sonde-kasten]"); return k && k.classList.contains("betonung-hier") && !k.classList.contains("betonung-laedt") && k.querySelector(".stress-short, .stress-long, .stress, [class*='stress']"); }, null, { timeout: 15000 }).then(() => true, () => false);
    const zeichen = await pg.evaluate(() => { const k = document.querySelector("[data-sonde-kasten]"); return k ? k.querySelectorAll("[class*='stress']").length : 0; });
    erg.push([an, "B3 Tippen in den Textkasten schaltet die Betonung ein (" + kasten.klasse.split(" ")[0] + ")", zeichen + " markierte Silben"]);
    /* Neuzeichnen: Kasten durch eine Kopie ohne Betonung ersetzen → Beobachter stellt sie wieder her */
    const wieder = await pg.evaluate(async () => {
      const k = document.querySelector("[data-sonde-kasten]");
      const roh = k.cloneNode(false);
      roh.classList.remove("betonung-hier");
      roh.innerHTML = k.getAttribute("data-sonde-roh") || k.innerHTML;
      k.replaceWith(roh);
      await new Promise((r) => setTimeout(r, 600));
      return document.querySelector("[data-sonde-kasten]").classList.contains("betonung-hier");
    });
    erg.push([wieder, "B3 nach dem Neuzeichnen stellt der Beobachter die Betonung wieder her"]);
    await tippe();
    const aus = await pg.waitForFunction(() => { const k = document.querySelector("[data-sonde-kasten]"); return k && k.classList.contains("betonung-aus") && !k.classList.contains("betonung-hier"); }, null, { timeout: 5000 }).then(() => true, () => false);
    erg.push([aus, "B3 noch einmal tippen schaltet sie aus"]);
    return erg;
  }

  if (TEILE.includes("B")) {
    console.log("\nB  IM BROWSER");
    const faelle = [{ name: "gast min" }, { name: "gast ?quelle", quelle: true }];
    if (UMD) faelle.push({ name: "konto min", konto: true }); else console.log("  info konto: supabase-js (umd) nicht gefunden – Fall fehlt");
    for (const f of faelle) {
      const s = await seite(f);
      await s.pg.waitForFunction(() => window.__dmaAppInitialized, null, { timeout: 20000 }).catch(() => {});
      const r = await s.pg.evaluate(() => ({ lauf: window.__lauf.slice(), br: window.DMA_BRUECKE || null,
        fn: ["tutorRufen", "tutorAn", "betonungTippen", "betonungNachschlagen"].every((n) => typeof window[n] === "function"),
        app: Boolean(window.DMA_APP && window.DMA_APP.showToast && window.DMA_APP.applyStressToTree) }));
      const iB = r.lauf.findIndex((x) => /(^|\/)bruecke(-[\w-]{8})?\.js$/.test(x)), iA = r.lauf.findIndex((x) => /(^|\/)app\.js$/.test(x));
      sage(iB >= 0 && iA > iB, "B1 " + f.name + ": die Brücke läuft vor app.js", (r.lauf[iB] || "keine Brücke") + " #" + iB + ", app.js #" + iA);
      sage(Boolean(r.br && r.br.namen.length >= 14 && !r.br.konflikt.length && r.fn && r.app), "B1 " + f.name + ": Eingänge auf window, DMA_APP da, kein Konflikt",
        r.br ? r.br.namen.length + " Namen, Konflikt: " + (r.br.konflikt.join(",") || "keiner") : "DMA_BRUECKE fehlt");
      for (const [gut, was, dazu] of await bedienen(s.pg)) sage(gut, was.replace(/^(B\d) /, "$1 " + f.name + ": "), dazu);
      sage(!s.pe.length, "B5 " + f.name + ": kein pageerror", s.pe.slice(0, 3).join(" | "));
      await s.ctx.close();
    }
  }
  if (TEILE.includes("K")) {
    console.log("\nK  KONFLIKT (window.tutorAn steht schon da)");
    const s = await seite({ konflikt: true });
    await s.pg.waitForFunction(() => window.__dmaAppInitialized, null, { timeout: 20000 }).catch(() => {});
    await warte(2500);
    const r = await s.pg.evaluate(() => ({ br: window.DMA_BRUECKE || null, wert: window.tutorAn, reiter: Boolean(document.getElementById("tutorReiter")) }));
    sage(Boolean(r.br && r.br.konflikt.indexOf("tutorAn") >= 0 && r.wert === 1), "K  die Brücke überschreibt window.tutorAn nicht und nennt ihn in DMA_BRUECKE.konflikt",
      r.br ? "Konflikt: " + r.br.konflikt.join(",") + ", window.tutorAn = " + r.wert : "DMA_BRUECKE fehlt");
    sage(s.kons.some((k) => /bruecke: schon auf window/.test(k)), "K  laut auf der Konsole");
    sage(!r.reiter, "K  app.js nimmt den Ersatz (tutorAn → false: kein Reiter), statt fremden Code zu rufen");
    sage(!s.pe.length, "K  kein pageerror", s.pe.slice(0, 3).join(" | "));
    await s.ctx.close();
  }
  if (TEILE.includes("R")) {
    console.log("\nR  RÜCKWEG (bau/bruecke-*.js nicht ladbar)");
    const s = await seite({ ohneBau: true });
    await s.pg.waitForFunction(() => window.DMA_BRUECKE, null, { timeout: 20000 }).catch(() => {});
    const r = await s.pg.evaluate(() => ({ lauf: window.__lauf.slice(), br: window.DMA_BRUECKE || null }));
    sage(Boolean(r.br && r.br.namen.length >= 14) && r.lauf.some((x) => /^src\/bruecke\.js$/.test(x)), "R  die Quelle src/bruecke.js kommt nach, Eingänge auf window",
      r.lauf.filter((x) => /bruecke/.test(x)).join(", ") || "keine Brücke");
    for (const [gut, was, dazu] of await bedienen(s.pg)) sage(gut, was.replace(/^(B\d) /, "R  ($1) "), dazu);
    sage(!s.pe.length, "R  kein pageerror", s.pe.slice(0, 3).join(" | "));
    await s.ctx.close();
  }
  await br.close(); srv.close();
}

(async () => {
  console.log("SONDE 887 — Modul M4 (Tutor und Betonung)   WURZEL " + WURZEL + "\n");
  if (TEILE.includes("A")) teilA();
  if (TEILE.some((t) => /^[BKR]$/.test(t))) await browserTeile();
  console.log("\n  " + (fehler ? fehler + " FEHL" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
