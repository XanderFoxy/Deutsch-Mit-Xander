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
         DMA_MODUL.bruecke nennt eine Datei aus bau/manifest.json, die es gibt;
         der Notweg (app.js aus der Quelle) nimmt bau/ (nur ?quelle nimmt src/);
         dmaModul holt die Funktion aus DMA_BRUECKE.fn (nie window[name]) und
         merkt sich keine Rufe mit einem Ereignis
      A6 werkzeug/app-modul-ziehen.js: eine Zeile IN einem mehrzeiligen
         Template-Literal bleibt, wie sie ist (der String ändert sich nicht);
         --pruefen erkennt eine Abweichung
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
   K  Konflikt: steht ein Name schon auf window (Init-Skript), überschreibt
      die Brücke ihn nicht, nennt ihn in DMA_BRUECKE.konflikt (laut), und
      app.js ruft trotzdem das EIGENE Modul, nie den fremden Wert:
      K1 window.tutorAn = 1 (kein Funktion) – der Tutor kommt trotzdem
      K2 window.tutorBereichRufen = fremde Funktion – sie wird nie gerufen,
         der Tutor kommt
   R  Rückweg: bau/bruecke-*.js nicht ladbar → die Quelle src/bruecke.js
      kommt nach (angefragt erst bei DOMContentLoaded, genau einmal – seit
      Prüfung Runde 2; hier 3 s verzögert), die gemerkten Rufe werden nachgeholt
      (Reiter da, Betonung geht), ein Tipp in einen Textkasten VOR der Brücke
      schaltet danach nichts um (Ereignisse werden nicht gemerkt), kein
      pageerror
   N  Notweg im Funkloch: dma-ohne-min gesetzt, Helfer sw.js an, Laden 1 und
      2 mit Leitung, Laden 3 ohne – die Brücke kommt aus bau/ (aus dem
      Speicher des Helfers), Betonung durch Tippen und die Ohren gehen wie
      auf d9637a22 (dort stand beides in app.js). Der Tutor kommt offline
      auf beiden Ständen nicht (kein Teil dieser Prüfung).
   W  Helferwechsel (Prüfung Runde 2): Laden 1 und 2 mit dem Helfer der
      Fassung 887 (dieser sw.js OHNE die Regel für bau/ – Byte für Byte der
      sw.js von main/887; er legt bau/ nicht ab), dann ein Besuch mit
      Leitung, in dem dieser sw.js übernimmt (controllerchange), dann ein
      Besuch ohne Leitung: Betonung durch Tippen und Ohren gehen (wie auf
      d9637a22); hat der Stand eine Brücke, liegt sie nach dem Wechsel im
      Speicher des Helfers und kommt offline aus bau/.
      W1 wie im Betrieb; W2 ohne das Ohr für controllerchange (nachgestellt:
      der Wechsel kam, bevor app.js zuhörte) – dann fängt es die Prüfung
      in der Ruhepause.
   A7 (ohne Browser) app.js: der Rückweg wartet auf DOMContentLoaded;
      die Sicherung nach dem Helferwechsel hört auf controllerchange, prüft
      in der Ruhepause, nur wenn die Seite beim Start gesteuert war, und
      nennt denselben Speicher wie KASTEN in sw.js.

   Aufruf:     node werkzeug/pruefe-887-modul-app.js          (TEIL=A,B,K,R,N,W)
   Gegenprobe: WURZEL=<Stand d9637a22> node werkzeug/pruefe-887-modul-app.js → rot
               (K2, R-Tipp und N auch auf 2417165d rot: Stand vor der Nachbesserung;
               W auf d9637a22 grün – Betonung stand dort in app.js –, auf 542e4250 rot)
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http"), os = require("os");
const HIER = path.join(__dirname, "..");
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const TEILE = (process.env.TEIL || "A,B,K,R,N,W").split(",");
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
  sage(/if \(!window\.DMA_BRUECKE\) \{[^}]*s\.type = "module";[^}]*"src\/bruecke\.js"/.test(app)
    || /function dmaBrueckeRueckweg\(\) \{\s*if \(window\.DMA_BRUECKE\) return;[^}]*s\.type = "module";[^}]*"src\/bruecke\.js"/.test(app), "A5 app.js: Rückweg – ist die Brücke nicht gelaufen, lädt app.js src/bruecke.js nach");
  /* Nachbesserung M4 (Prüfung Runde 1) */
  const lader = (/if \(d === "@bruecke"\) return document\.write\(([^\n]*)\);/.exec(html) || [])[1] || "";
  sage(/!\/\[\?&\]quelle\\b\/\.test\(location\.search\) && \(window\.DMA_MODUL \|\| \{\}\)\.bruecke/.test(lader) && !/DMA_Q\("app\.js"\)/.test(lader),
    "A5 index.html: auch der Notweg (app.js aus der Quelle) lädt bau/bruecke – src/ nur mit ?quelle oder ohne Bau", lader.slice(0, 120));
  const dm = (/function dmaModul\(name, args, ersatz\) \{([\s\S]*?)\n  \}/.exec(app) || [])[1] || "";
  sage(/DMA_BRUECKE\.fn/.test(dm) && !/window\[name\]/.test(dm), "A5 app.js: dmaModul holt die Funktion aus DMA_BRUECKE.fn, nie window[name]");
  sage(/instanceof Event/.test(dm), "A5 app.js: dmaModul merkt sich keine Rufe mit einem Ereignis");
  sage(/fn\[n\] = m\[n\];\s*\n\s*if \(Object\.prototype\.hasOwnProperty\.call\(window, n\)\)/.test(bruecke) && /window\.DMA_BRUECKE = \{ namen, konflikt, fn \}/.test(bruecke),
    "A5 src/bruecke.js: jede Funktion in DMA_BRUECKE.fn, auch bei Konflikt");
  let karte = null;
  try { karte = JSON.parse((/window\.DMA_MODUL = (\{[^\n]*?\});/.exec(html) || [])[1]); } catch (e) {}
  let manifest = null;
  try { manifest = JSON.parse(lies("bau/manifest.json")); } catch (e) {}
  const datei = karte && karte.bruecke;
  const imManifest = manifest && Object.values(manifest).some((e) => e.isEntry && e.name === "bruecke" && "bau/" + e.file === datei);
  sage(Boolean(datei && imManifest && fs.existsSync(path.join(WURZEL, datei))), "A5 DMA_MODUL.bruecke = Datei aus bau/manifest.json, vorhanden", datei || "fehlt");
  /* A7 Nachbesserung M4 (Prüfung Runde 2) */
  const rw = (/if \(!window\.DMA_BRUECKE\) \{\n\s*const nav = [^\n]*\n([^\n]*)\n/.exec(app) || [])[1] || "";
  sage(/addEventListener\("DOMContentLoaded", dmaBrueckeRueckweg/.test(rw) && /domContentLoadedEventStart/.test(app), "A7 app.js: der Rückweg wartet auf DOMContentLoaded (kein Doppel, wenn das Modul später als app.js läuft)");
  const bs = (/\(function dmaBauSichern\(\) \{([\s\S]*?)\n  \}\)\(\);/.exec(app) || [])[1] || "";
  const kasten = (/var KASTEN = "([^"]+)";/.exec(lies("sw.js")) || [])[1] || "";
  sage(/if \(!sw \|\| !sw\.controller \|\| !window\.caches\) return;/.test(bs) && /addEventListener\("controllerchange"/.test(bs) && /setTimeout\(ruhig, \d+\)/.test(bs),
    "A7 app.js: Sicherung nach dem Helferwechsel – nur wenn beim Start gesteuert, nach controllerchange und einmal in der Ruhepause", bs ? "" : "dmaBauSichern fehlt");
  sage(Boolean(kasten) && bs.indexOf('caches.open("' + kasten + '")') >= 0 && /k\.match\(u\)/.test(bs) && /fetch\(u\)/.test(bs),
    "A7 app.js: holt nur, was im Speicher des Helfers fehlt, und nennt denselben Speicher wie sw.js (KASTEN = " + (kasten || "?") + ")");
}

/* A6: das Werkzeug lässt Strings, wie sie sind */
function teilA6() {
  const acorn = acornHolen();
  let Z = null;
  try { Z = require(path.join(WURZEL, "werkzeug", "app-modul-ziehen.js")); } catch (e) {}
  if (!acorn || !Z || typeof Z.ziehen !== "function") { sage(false, "A6 werkzeug/app-modul-ziehen.js fehlt"); return; }
  const q = '(function () {\n  "use strict";\n  function probeHtml() {\n    const t = `<div>\n      <b>${probeWort()}</b>\n    </div>`;\n'
    + '    const u = "a\\\n    b";\n    return t + u;\n  }\n  function probeWort() { return "x"; }\n  probeHtml();\n})();\n';
  const kochen = (text, modul) => {
    const w = [];
    (function gehe(k) {
      if (!k || typeof k.type !== "string") return;
      if (k.type === "TemplateElement") w.push(k.value.cooked);
      if (k.type === "Literal" && typeof k.value === "string" && k.value !== "use strict") w.push(k.value);
      for (const f in k) { const x = k[f]; if (Array.isArray(x)) x.forEach(gehe); else if (x && typeof x.type === "string") gehe(x); }
    })(acorn.parse(text, { ecmaVersion: "latest", sourceType: modul ? "module" : "script" }));
    return w.filter((x) => /\s{2}/.test(x));
  };
  let r = null;
  try { r = Z.ziehen({ gruppe: "probe", namen: ["probeHtml"] }, q, acorn); } catch (e) { sage(false, "A6 Werkzeug lehnt die Probe ab", e.message); return; }
  const vor = kochen(q, false), nach = kochen(r.modul, true);
  sage(vor.length === 3 && JSON.stringify(vor) === JSON.stringify(nach), "A6 Werkzeug: Zeilen in mehrzeiligen Strings (Template-Literal, „\\“ am Zeilenende) bleiben gleich",
    JSON.stringify(vor) + " → " + JSON.stringify(nach));
  const v = typeof Z.vergleichen === "function" ? Z.vergleichen(r.modul.replace("      <b>", "    <b>"), q, acorn) : null;
  sage(Boolean(v && v.anders.indexOf("probeHtml") >= 0), "A6 Werkzeug --pruefen: findet eine Abweichung im String", v ? JSON.stringify(v) : "kein vergleichen");
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
  const zustand = { aus: false, sw: null };
  const srv = http.createServer((q, a) => {
    if (zustand.aus) { q.socket.destroy(); return; }   /* N: Funkloch */
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (p === "/sw.js" && zustand.sw) { a.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" }); return a.end(zustand.sw); }   /* W: alter Helfer */
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

  const FASSUNG = (/window\.DMA_VERSION = "(\d+)"/.exec(lies("index.html")) || [])[1] || "";
  async function seite(o) {
    const mitKonto = Boolean(o.konto);
    const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: o.sw ? "allow" : "block" });
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
    if (o.quelleSpaet) await ctx.route(/\/src\/bruecke\.js/, async (r) => { await warte(o.quelleSpaet); r.continue().catch(() => {}); });
    await ctx.addInitScript(([konto, sitz, konflikt, notweg, ohneOhr]) => {
      window.__wechsel = 0;
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("controllerchange", () => { window.__wechsel++; });
        /* W2: app.js hört controllerchange nicht (der Wechsel kam, bevor es zuhörte) */
        if (ohneOhr) {
          const ein = ServiceWorkerContainer.prototype.addEventListener;
          ServiceWorkerContainer.prototype.addEventListener = function (art, f, o) { if (art === "controllerchange") return; return ein.call(this, art, f, o); };
        }
      }
      try {
        localStorage.setItem("dma_tour_seen", "1");
        if (konto) localStorage.setItem("sb-rolcktiryrvjzbwuvobb-auth-token", JSON.stringify(sitz));
        if (notweg) localStorage.setItem("dma-ohne-min", notweg);
      } catch (e) {}
      if (konflikt === "wert") window.tutorAn = 1;
      if (konflikt === "funktion") window.tutorBereichRufen = function () { window.__fremd = (window.__fremd || 0) + 1; };
      window.__lauf = [];
      document.addEventListener("load", (e) => {
        const t = e.target;
        if (t && t.tagName === "SCRIPT" && t.src) window.__lauf.push(t.src.replace(location.origin + "/", "").replace(/\?.*$/, ""));
      }, true);
    }, [mitKonto, sitzung(), o.konflikt || "", o.notweg ? FASSUNG : "", Boolean(o.ohneOhr)]);
    const pg = await ctx.newPage();
    const pe = [], kons = [];
    pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
    pg.on("console", (m) => { if (m.type() === "error") kons.push(m.text().slice(0, 160)); });
    const url = BASIS + "/index.html" + (o.quelle ? "?quelle" : o.sw ? "?mit-sw" : "");
    if (!o.ohneLaden) await pg.goto(url, { waitUntil: o.bisDom ? "domcontentloaded" : "load", timeout: 90000 });
    return { ctx, pg, pe, kons, url };
  }
  /* DMA_BRUECKE ohne die Funktionen (die lassen sich nicht übergeben) */
  const brueckeLesen = () => (window.DMA_BRUECKE ? { namen: window.DMA_BRUECKE.namen, konflikt: window.DMA_BRUECKE.konflikt,
    fn: Object.keys(window.DMA_BRUECKE.fn || {}) } : null);

  /* B2–B4 auf einer offenen Seite; liefert [gut, was, dazu] */
  async function bedienen(pg, ohneTutor) {
    const erg = [];
    /* B2 Tutor kommt von selbst – beim Wechsel in einen Bereich (activateTab; der allererste Aufbau ohne #… ruft ihn nicht) */
    await pg.evaluate(() => { const t = document.querySelector('.tape-tab[data-target="view-learn"]'); if (t) t.click(); });
    if (ohneTutor) await warte(1500);
    else {
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
    }
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
      const r = await s.pg.evaluate((lesen) => ({ lauf: window.__lauf.slice(), br: (0, eval)(lesen)(),
        fn: ["tutorRufen", "tutorAn", "betonungTippen", "betonungNachschlagen"].every((n) => typeof window[n] === "function"),
        app: Boolean(window.DMA_APP && window.DMA_APP.showToast && window.DMA_APP.applyStressToTree) }), "(" + brueckeLesen.toString() + ")");
      const iB = r.lauf.findIndex((x) => /(^|\/)bruecke(-[\w-]{8})?\.js$/.test(x)), iA = r.lauf.findIndex((x) => /(^|\/)app\.js$/.test(x));
      sage(iB >= 0 && iA > iB, "B1 " + f.name + ": die Brücke läuft vor app.js", (r.lauf[iB] || "keine Brücke") + " #" + iB + ", app.js #" + iA);
      sage(Boolean(r.br && r.br.namen.length >= 14 && r.br.fn.length === r.br.namen.length && !r.br.konflikt.length && r.fn && r.app), "B1 " + f.name + ": Eingänge auf window und in DMA_BRUECKE.fn, DMA_APP da, kein Konflikt",
        r.br ? r.br.namen.length + " Namen, " + r.br.fn.length + " in fn, Konflikt: " + (r.br.konflikt.join(",") || "keiner") : "DMA_BRUECKE fehlt");
      for (const [gut, was, dazu] of await bedienen(s.pg)) sage(gut, was.replace(/^(B\d) /, "$1 " + f.name + ": "), dazu);
      sage(!s.pe.length, "B5 " + f.name + ": kein pageerror", s.pe.slice(0, 3).join(" | "));
      await s.ctx.close();
    }
  }
  /* Tutor kommt beim Tipp auf „Lernen“ (wie B2) */
  const tutorKommt = (pg) => pg.evaluate(() => { const t = document.querySelector('.tape-tab[data-target="view-learn"]'); if (t) t.click(); })
    .then(() => pg.waitForFunction(() => { const b = document.querySelector("#tutorBuehne.tutor-da"); const t = document.getElementById("tutorText"); return b && t && t.textContent.trim().length > 10; }, null, { timeout: 12000 }))
    .then(() => true, () => false);
  if (TEILE.includes("K")) {
    console.log("\nK  KONFLIKT (ein Name steht schon auf window)");
    for (const [k, art, name] of [["K1", "wert", "tutorAn"], ["K2", "funktion", "tutorBereichRufen"]]) {
      const s = await seite({ konflikt: art });
      await s.pg.waitForFunction(() => window.__dmaAppInitialized, null, { timeout: 20000 }).catch(() => {});
      await warte(1500);
      const kommt = await tutorKommt(s.pg);
      await warte(500);
      const r = await s.pg.evaluate(([lesen, n]) => ({ br: (0, eval)(lesen)(), art: typeof window[n], wert: typeof window[n] === "function" ? "fremde Funktion" : window[n],
        fremd: window.__fremd || 0, eigen: Boolean(window.DMA_BRUECKE && window.DMA_BRUECKE.fn && typeof window.DMA_BRUECKE.fn[n] === "function" && window.DMA_BRUECKE.fn[n] !== window[n]) }),
        ["(" + brueckeLesen.toString() + ")", name]);
      const fremdDa = art === "wert" ? r.wert === 1 : r.art === "function" && r.eigen;
      sage(Boolean(r.br && r.br.konflikt.indexOf(name) >= 0 && fremdDa), k + " (" + art + ") die Brücke überschreibt window." + name + " nicht und nennt ihn in DMA_BRUECKE.konflikt",
        r.br ? "Konflikt: " + r.br.konflikt.join(",") + ", window." + name + " = " + r.wert : "DMA_BRUECKE fehlt");
      sage(s.kons.some((x) => /bruecke: schon auf window/.test(x)), k + " laut auf der Konsole");
      sage(Boolean(r.br && r.br.fn.indexOf(name) >= 0) && kommt && r.fremd === 0, k + " app.js ruft das eigene Modul (DMA_BRUECKE.fn), nie den fremden Wert: der Tutor kommt (Tipp auf „Lernen“)"
        + (art === "funktion" ? ", die fremde Funktion bleibt ungerufen" : ""), "Tutor " + (kommt ? "da" : "fehlt") + ", fremd gerufen: " + r.fremd);
      sage(!s.pe.length, k + " kein pageerror", s.pe.slice(0, 3).join(" | "));
      await s.ctx.close();
    }
  }
  if (TEILE.includes("R")) {
    console.log("\nR  RÜCKWEG (bau/bruecke-*.js nicht ladbar, src/bruecke.js 3 s verzögert)");
    const s = await seite({ ohneBau: true, quelleSpaet: 3000, bisDom: true });
    await s.pg.waitForFunction(() => window.__dmaAppInitialized, null, { timeout: 20000 }).catch(() => {});
    /* ein Tipp in einen Textkasten, solange die Brücke fehlt – darf später nichts umschalten */
    const frueh = await s.pg.waitForFunction(() => {
      if (window.DMA_BRUECKE) return "zu spät";
      const SEL = ".question-card, .sammel-text, .kal-karte, .lesetext, .about-card, .tip-card, .community-text, .weg-karte, .material-card";
      const k = [...document.querySelectorAll(SEL)].find((x) => { const r = x.getBoundingClientRect(); return r.width > 50 && r.height > 20 && (x.innerText || "").trim().length >= 40; });
      if (!k) return false;
      k.setAttribute("data-sonde-frueh", "1");
      const w = document.createTreeWalker(k, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim().length > 3 && !n.parentElement.closest("button, a, input, select, textarea, label, summary, [role='button'], .speak-btn, svg") ? 1 : 3) });
      const t = w.nextNode();
      (t ? t.parentElement : k).click();
      return k.className.split(" ")[0] || "kasten";
    }, null, { timeout: 2500, polling: 100 }).then((h) => h.jsonValue(), () => null);
    await s.pg.waitForFunction(() => window.DMA_BRUECKE, null, { timeout: 20000 }).catch(() => {});
    await warte(1200);
    const r = await s.pg.evaluate((lesen) => ({ lauf: window.__lauf.slice(), br: (0, eval)(lesen)(),
      umgeschaltet: Boolean(document.querySelector("[data-sonde-frueh].betonung-hier, [data-sonde-frueh] [class*='stress']")) }), "(" + brueckeLesen.toString() + ")");
    sage(Boolean(frueh && frueh !== "zu spät") && !r.umgeschaltet, "R  ein Tipp in einen Textkasten VOR der Brücke schaltet danach nichts um (Ereignisse werden nicht gemerkt)",
      (frueh || "kein Kasten vor der Brücke") + (r.umgeschaltet ? ": Betonung kam verspätet an" : ""));
    sage(Boolean(r.br && r.br.namen.length >= 14) && r.lauf.some((x) => /^src\/bruecke\.js$/.test(x)), "R  die Quelle src/bruecke.js kommt nach, Eingänge auf window",
      r.lauf.filter((x) => /bruecke/.test(x)).join(", ") || "keine Brücke");
    /* Prüfung Runde 2: der Rückweg wartet auf DOMContentLoaded (dann ist jedes Modul der defer-Reihe gelaufen oder gescheitert) */
    const zeit = await s.pg.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0], q = performance.getEntriesByType("resource").filter((x) => /\/src\/bruecke\.js/.test(x.name));
      return { dcl: nav ? Math.round(nav.domContentLoadedEventStart) : null, src: q.length ? Math.round(q[0].startTime) : null, n: q.length };
    });
    sage(zeit.src != null && zeit.dcl > 0 && zeit.src >= zeit.dcl && zeit.n === 1, "R  der Rückweg holt src/bruecke.js erst bei DOMContentLoaded, genau einmal",
      "DOMContentLoaded " + zeit.dcl + " ms, src/bruecke.js angefragt " + zeit.src + " ms, " + zeit.n + "×");
    for (const [gut, was, dazu] of await bedienen(s.pg)) sage(gut, was.replace(/^(B\d) /, "R  ($1) "), dazu);
    sage(!s.pe.length, "R  kein pageerror", s.pe.slice(0, 3).join(" | "));
    await s.ctx.close();
  }
  if (TEILE.includes("N")) {
    console.log("\nN  NOTWEG IM FUNKLOCH (dma-ohne-min, Helfer sw.js, Laden 3 ohne Leitung)");
    const s = await seite({ sw: true, notweg: true, ohneLaden: true });
    zustand.aus = false;
    await s.pg.goto(s.url, { waitUntil: "load", timeout: 90000 });
    const bereit = await s.pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.ready.then(() => true), null, { timeout: 20000 }).then(() => true, () => false);
    await warte(1500);
    await s.pg.goto(s.url, { waitUntil: "load", timeout: 90000 });
    await warte(3000);
    const gest2 = await s.pg.evaluate(() => Boolean(navigator.serviceWorker && navigator.serviceWorker.controller));
    zustand.aus = true;
    let geladen = true;
    await s.pg.goto(s.url, { waitUntil: "load", timeout: 90000 }).catch(() => { geladen = false; });
    await s.pg.waitForFunction(() => window.__dmaAppInitialized, null, { timeout: 20000 }).catch(() => {});
    await warte(2000);
    const r = await s.pg.evaluate((lesen) => ({ lauf: window.__lauf.slice(), br: (0, eval)(lesen)(), q: window.DMA_Q ? window.DMA_Q("app.js") : null,
      gest: Boolean(navigator.serviceWorker && navigator.serviceWorker.controller) }), "(" + brueckeLesen.toString() + ")").catch(() => ({ lauf: [], br: null }));
    sage(bereit && gest2 && r.gest && geladen && r.q === "app.js", "N  Notweg aktiv (app.js aus der Quelle), Seite ohne Leitung aus dem Helfer", "Helfer " + bereit + "/" + gest2 + "/" + r.gest + ", DMA_Q(app.js) = " + r.q);
    const b = r.lauf.find((x) => /bruecke/.test(x)) || "";
    sage(/^bau\/bruecke-[\w-]{8}\.js$/.test(b) && Boolean(r.br && r.br.namen.length >= 14), "N  die Brücke kommt aus bau/ (Speicher des Helfers), Eingänge da", (b || "keine Brücke") + ", " + (r.br ? r.br.namen.length + " Namen" : "DMA_BRUECKE fehlt"));
    for (const [gut, was, dazu] of await bedienen(s.pg, true)) sage(gut, was.replace(/^(B\d) /, "N  ($1) "), dazu);
    sage(!s.pe.length, "N  kein pageerror", s.pe.slice(0, 3).join(" | "));
    zustand.aus = false;
    await s.ctx.close();
  }
  if (TEILE.includes("W")) {
    console.log("\nW  HELFERWECHSEL (Helfer wie in 887 ohne bau/-Regel → dieser sw.js; nächster Besuch ohne Leitung)");
    const alt = swOhneBau();
    const mitBruecke = Boolean((/window\.DMA_MODUL = \{[^\n]*"bruecke":/.exec(lies("index.html")) || [])[0]);
    if (!alt) sage(false, "W  sw.js: die Regel für bau/ nicht gefunden – kann den Helfer von 887 nicht nachbilden");
    else {
      if (alt.main !== null) console.log("  info alter Helfer = sw.js von origin/main: " + (alt.main ? "Byte für Byte gleich" : "NICHT gleich (main hat inzwischen mehr – nachgebildet bleibt: ohne bau/-Regel)"));
      for (const [w, ohneOhr] of [["W1", false], ["W2", true]]) {
        zustand.sw = alt.text; zustand.aus = false;
        const s = await seite({ sw: true, ohneLaden: true, ohneOhr });
        const imSpeicher = () => s.pg.evaluate(async () => (await (await caches.open("dma-dateien-1")).keys()).map((q) => q.url.replace(location.origin + "/", "")).filter((u) => /^bau\//.test(u))).catch(() => null);
        await s.pg.goto(s.url, { waitUntil: "load", timeout: 90000 });
        await s.pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.ready.then(() => true), null, { timeout: 20000 }).catch(() => {});
        await warte(1500);
        await s.pg.goto(s.url, { waitUntil: "load", timeout: 90000 });
        await warte(2500);
        const p1 = { gest: await s.pg.evaluate(() => Boolean(navigator.serviceWorker && navigator.serviceWorker.controller)), bau: await imSpeicher() };
        /* Phase 2: dieser sw.js auf dem Server; ein Besuch mit Leitung, bis er übernommen hat */
        zustand.sw = null;
        await s.pg.goto(s.url, { waitUntil: "load", timeout: 90000 });
        const wechsel = await s.pg.waitForFunction(() => window.__wechsel > 0, null, { timeout: 25000 }).then(() => true, () => false);
        await warte(ohneOhr ? 14000 : 4000);
        const p2 = { bau: await imSpeicher() };
        sage(p1.gest && Array.isArray(p1.bau) && !p1.bau.length && wechsel, w + " Ausgangslage: Seite vom alten Helfer gesteuert, der legt bau/ nicht ab; danach übernimmt dieser sw.js (controllerchange)",
          "gesteuert " + p1.gest + ", bau/ im Speicher vorher: " + (p1.bau ? p1.bau.length : "?") + ", Wechsel " + wechsel);
        if (mitBruecke) sage(Array.isArray(p2.bau) && p2.bau.some((u) => /^bau\/bruecke-[\w-]{8}\.js$/.test(u)), w + " nach dem Wechsel liegt die Brücke im Speicher des Helfers" + (ohneOhr ? " (ohne Ohr: aus der Ruhepause)" : ""), (p2.bau || []).join(", ") || "nichts aus bau/");
        /* Phase 3: ohne Leitung */
        zustand.aus = true;
        let geladen = true;
        await s.pg.goto(s.url, { waitUntil: "load", timeout: 90000 }).catch(() => { geladen = false; });
        await s.pg.waitForFunction(() => window.__dmaAppInitialized, null, { timeout: 20000 }).catch(() => {});
        await warte(2000);
        const r = await s.pg.evaluate((lesen) => ({ lauf: window.__lauf.slice(), br: (0, eval)(lesen)(), gest: Boolean(navigator.serviceWorker && navigator.serviceWorker.controller) }),
          "(" + brueckeLesen.toString() + ")").catch(() => ({ lauf: [], br: null }));
        sage(geladen && r.gest && Boolean(r.lauf.length), w + " ohne Leitung: die Seite kommt aus dem Helfer", "gesteuert " + r.gest + ", " + r.lauf.length + " Skripte");
        if (mitBruecke) {
          const b = r.lauf.find((x) => /bruecke/.test(x)) || "";
          sage(/^bau\/bruecke-[\w-]{8}\.js$/.test(b) && Boolean(r.br && r.br.namen.length >= 14), w + " ohne Leitung: die Brücke kommt aus bau/, Eingänge da", (b || "keine Brücke") + ", " + (r.br ? r.br.namen.length + " Namen" : "DMA_BRUECKE fehlt"));
        } else console.log("  info " + w + ": Stand ohne Brücke (Tutor und Betonung in app.js)");
        for (const [gut, was, dazu] of await bedienen(s.pg, true)) sage(gut, was.replace(/^(B\d) /, w + " ($1) "), dazu);
        sage(!s.pe.length, w + " kein pageerror", s.pe.slice(0, 3).join(" | "));
        zustand.aus = false; zustand.sw = null;
        await s.ctx.close();
      }
    }
  }
  await br.close(); srv.close();
}

/* W: der Helfer der Fassung 887 = dieser sw.js ohne die Regel für bau/ (MODUL-UMBAU M1). Gegen origin/main geprüft
   (main = null: kein git oder kein origin/main) – nur zur Auskunft; nachgebildet wird immer aus dem eigenen sw.js. */
function swOhneBau() {
  const t = lies("sw.js");
  const z = "  /* MODUL-UMBAU (M1): Stücke aus bau/ (Name aus dem Inhalt, siehe bauGrund) */\n  var b = bauGrund(u);\n  if (b) { e.respondWith(bauHolen(r, b)); return; }\n";
  const i = t.indexOf(z), a = t.indexOf("/* MODUL-UMBAU (Schritt 1, MODULE-PLAN.md Abschnitt 3, M1)"), e = t.indexOf("/* Gestempelte Datei:");
  if (i < 0 || a < i || e < a) return null;
  const text = t.slice(0, i) + t.slice(i + z.length, a) + t.slice(e);
  let main = null;
  try { main = require("child_process").execFileSync("git", ["-C", HIER, "show", "origin/main:sw.js"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }) === text; } catch (x) {}
  return { text, main };
}

(async () => {
  console.log("SONDE 887 — Modul M4 (Tutor und Betonung)   WURZEL " + WURZEL + "\n");
  if (TEILE.includes("A")) { teilA(); teilA6(); }
  if (TEILE.some((t) => /^[BKRNW]$/.test(t))) await browserTeile();
  console.log("\n  " + (fehler ? fehler + " FEHL" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
