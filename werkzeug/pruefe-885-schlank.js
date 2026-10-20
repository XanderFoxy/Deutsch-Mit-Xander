#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — START SCHLANKER (Ladezeit-Entwurf, Schritt K)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller“ · (Funk 310/312):
   „das Maximum rausholen“ · (Funk 255): „die schnelle Performance und die
   Verbindung zu den anderen haben oberste Priorität“.

   Was der Schritt tut (SPIELSYSTEM.md, „Fassung 885 — Start schlanker“):
     1. Die langen Begründungs-Kommentare in index.html (jeder lädt die
        Seite bei jedem Start) stehen jetzt wörtlich in SPIELSYSTEM.md
        (I1 … I42); in index.html bleibt je Stelle eine kurze Zeile mit
        Verweis. Am Verhalten ändert das nichts.
     2. rueckfrage.js (das Walkie) steht nicht mehr in der Startliste. Es
        lädt nur für den Betreiber: backend.js erkennt ihn am eigenen Profil
        (is_owner) und ruft dmaWalkieLaden; sein Gerät merkt sich das
        („dma-walkie“) und holt die Datei beim nächsten Start schon in der
        Ruhepause nach DOMContentLoaded. Gestartet wird wie bisher 1,5 s nach
        DOMContentLoaded (ab DOMContentLoaded gerechnet).

   TEILE
     Q  Bau: Startliste ohne rueckfrage.js; dmaWalkieLaden, walkieMerken,
        erkannt (Quelle und min/); Code der Inline-Skripte nach dem
        Verkleinern (esbuild) Zeichen für Zeichen wie im Stand vor K
        (BASIS), bis auf den Walkie-Lader; die Seite ohne Kommentare
        (DOMParser) Knoten für Knoten gleich; kein Kommentar länger als zwei
        Zeilen; jeder Kommentar > 140 Zeichen aus BASIS steht wörtlich in
        SPIELSYSTEM.md; jeder Verweis „SPIELSYSTEM.md I<n>“ hat dort seine
        Überschrift; index.html gepackt mindestens 5 KB kleiner.
     A  Gast: rueckfrage.js wird nie geholt, kein Walkie, kein Merker.
     B  Betreiber, Gerät mit Merker, Anmeldung aus dem Gerät, Profil nach
        300 ms: rueckfrage.js nach DOMContentLoaded (≤ +1 s), erste
        Walkie-Abfrage ~1,5 s nach DOMContentLoaded wie bisher, Reiter da,
        genau ein Abruf, kein Neuladen.
     C  Betreiber, erster Start nach dem Update (kein Merker): die Datei
        kommt erst nach der Antwort mit is_owner; Reiter da; danach Merker.
     D  Profil kommt spät (3,5 s): Reiter ≤ 1 s nach der Antwort (bis 884
        erst beim nächsten 20-s-Takt) – mit und ohne Merker.
     E  Anderes Konto auf einem Gerät mit Merker: Merker weg, kein Reiter;
        beim nächsten Öffnen wird rueckfrage.js nicht mehr geholt.
     F  min/rueckfrage.js fehlt (404): die Quelle kommt, Reiter da, KEIN
        Neuladen (vorher: dmaMinFehlt → Neuladen).
     G  Anmeldung erst später (Formularweg Backend.signIn): Reiter ≤ 2,5 s
        nach der Anmeldung (bis 884 bis zu 20 s).
     M  Messung (nur mit GEGEN=<alter Stand>): Betreiber mit und ohne
        Merker, CPU 4×, Datenbank 150 ms (Profil 300 ms), verschränkt
        A B / B A, A = GEGEN, B = WURZEL: DOMContentLoaded → erste
        Walkie-Abfrage und → Reiter. Median, B − A gepaart.

   Die Datenbank ist nachgestellt: supabase-js aus der lokalen Kopie
   (wie werkzeug/ladezeit-messen.js), die Anmeldung steht im Gerät
   (sb-rolcktiryrvjzbwuvobb-auth-token), jede REST-Anfrage beantwortet die
   Sonde selbst. Fremde Namen löst der Browser nicht auf.

   Schalter:
     WURZEL=<ordner>   Stand, der geprüft wird (Standard: dieser Baum)
     BASIS=<commit>    Stand vor K für Teil Q (Standard a508dc56)
     GEGEN=<ordner>    alter Stand für Teil M
     PAARE=n           Paare je Messfall (Standard 8)
     NUR=QABCDEFGM     nur diese Teile
   Gegenprobe (Stand vor K):
     S=<Zwischenordner>; bash $S/schlank/stand-bauen.sh a508dc56 $S/gegen885/schlank-vorher
     WURZEL=$S/gegen885/schlank-vorher node werkzeug/pruefe-885-schlank.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib"), os = require("os");
const { execFileSync } = require("child_process");
const HIER = path.join(__dirname, "..");
const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : HIER;
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : "";
const BASIS = process.env.BASIS || "a508dc56";
const PAARE = Math.max(1, Number(process.env.PAARE || 8));
const NUR = process.env.NUR || "QABCDEFG" + (GEGEN ? "M" : "");
const PROJEKT = "rolcktiryrvjzbwuvobb";
const KONTO = { betreiber: "11111111-2222-4333-8444-555555555555", schueler: "66666666-7777-4888-9999-000000000000" };

let fehler = 0, teil = "";
const rot = {};
const sage = (gut, was, dazu) => {
  if (!gut) { fehler++; rot[teil] = (rot[teil] || 0) + 1; }
  console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : ""));
};
const info = (was) => console.log("  info " + was);
const abschnitt = (t, titel) => { teil = t; console.log("\n" + t + "  " + titel + "\n"); };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => { const s = a.filter((x) => x != null && isFinite(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r0 = (x) => (x == null ? "–" : Math.round(x));

/* ---------- supabase-js: dieselbe lokale Kopie wie werkzeug/ladezeit-messen.js ---------- */
function supabaseHolen() {
  if (process.env.SUPABASE_UMD) return process.env.SUPABASE_UMD;
  const ziel = path.join(os.tmpdir(), "dma-mess-supabase-js-2.117.3.umd.js");
  if (fs.existsSync(ziel)) return ziel;
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "dma-mess-npm-"));
  execFileSync("npm", ["pack", "@supabase/supabase-js@2.117.3", "--pack-destination", d], { stdio: "ignore", timeout: 90000 });
  const tgz = fs.readdirSync(d).find((f) => f.endsWith(".tgz"));
  execFileSync("tar", ["-xzf", path.join(d, tgz), "-C", d, "package/dist/umd/supabase.js"], { stdio: "ignore" });
  fs.copyFileSync(path.join(d, "package/dist/umd/supabase.js"), ziel);
  fs.rmSync(d, { recursive: true, force: true });
  return ziel;
}

/* ---------- esbuild (wie werkzeug/fassung-setzen.js) ---------- */
function esbuildHolen() {
  try { return require("esbuild"); } catch (e) {}
  const basis = path.join(os.homedir(), ".npm", "_npx");
  try {
    for (const d of fs.readdirSync(basis)) {
      const p = path.join(basis, d, "node_modules", "esbuild");
      if (fs.existsSync(path.join(p, "package.json"))) return require(p);
    }
  } catch (e) {}
  return null;
}

/* ---------- Quelltext ---------- */
const lies = (w, f) => fs.readFileSync(path.join(w, f), "utf8");
const inlineSkripte = (html) => [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
function kommentare(html) {
  const l = [];
  for (const m of html.matchAll(/<!--[\s\S]*?-->/g)) l.push(m[0]);
  for (const s of inlineSkripte(html)) for (const m of s.matchAll(/\/\*[\s\S]*?\*\//g)) l.push(m[0]);
  return l;
}
const glatt = (s) => s.replace(/\s+/g, " ").trim();
const gz = (s) => zlib.gzipSync(Buffer.from(s), { level: 9 }).length;

/* ---------- Server ---------- */
function server(wurzel, o) {
  o = o || {};
  const log = [];
  const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
    ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json", ".gif": "image/gif", ".webp": "image/webp" };
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    log.push({ p, t: Date.now() });
    if (o.ohneMinWalkie && p === "/min/rueckfrage.js") { a.writeHead(404); return a.end(); }
    const f = path.join(wurzel, p);
    if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(f).pipe(a);
  });
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok({ srv, log, basis: "http://127.0.0.1:" + srv.address().port })));
}

/* ---------- eine Seite mit nachgestellter Datenbank ----------
   o.konto "betreiber" | "schueler" | "" · o.merker (dma-walkie beim ersten Öffnen) · o.profilMs · o.restMs · o.cpu */
const UMD = { pfad: "" };
async function seite(br, basis, o) {
  o = o || {};
  const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  const t = { null: 0, profilAntwort: null, signIn: 0 };
  const rest = [];
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (r) => {
    const u = r.request().url();
    if (/cdn\.jsdelivr\.net\/.*supabase/.test(u)) return r.fulfill({ status: 200, contentType: "text/javascript", body: fs.readFileSync(UMD.pfad) });
    if (u.indexOf(PROJEKT + ".supabase.co") < 0) return r.abort();
    const x = new URL(u), m = r.request().method();
    const kopf = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*", "access-control-expose-headers": "*" };
    if (m === "OPTIONS") return r.fulfill({ status: 204, headers: kopf });
    const tab = x.pathname.replace("/rest/v1/", "");
    rest.push({ t: Date.now() - t.null, tab, m });
    if (x.pathname.startsWith("/auth/v1/token")) {
      /* Formularweg (Teil G): Anmeldung mit Passwort */
      await warte(o.restMs || 150);
      return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body: JSON.stringify(sitzung(o.spaeterKonto || "betreiber")) }).catch(() => {});
    }
    if (x.pathname.startsWith("/auth/v1/user")) return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body: JSON.stringify(sitzung(o.konto || "betreiber").user) }).catch(() => {});
    if (!x.pathname.startsWith("/rest/v1/")) return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body: "{}" }).catch(() => {});
    let body = "[]";
    if (m === "GET" && tab === "profiles" && /id=eq\./.test(x.search)) {
      const wer = decodeURIComponent(x.search).indexOf(KONTO.betreiber) >= 0 ? "betreiber" : "schueler";
      await warte(o.profilMs || 300);
      t.profilAntwort = Date.now() - t.null;
      return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body: JSON.stringify([profilZeile(wer)]) }).catch(() => {});
    }
    if (m === "GET" && tab === "betreiber_rueckfragen") body = JSON.stringify([{ id: 7, thema: "Sonde", frage: "Steht das Walkie da?", art: "ja_nein", optionen: [], wo: "überall" }]);
    if (m === "GET" && tab === "betreiber_funk") body = JSON.stringify([{ id: 3, erstellt: new Date().toISOString(), von: "claude", text: "Sonde 885 schlank", gelesen: null }]);
    await warte(o.restMs || 150);
    return r.fulfill({ status: 200, contentType: "application/json", headers: kopf, body }).catch(() => {});
  });
  const pg = await ctx.newPage();
  const fehlerListe = [];
  pg.on("pageerror", (e) => fehlerListe.push(String((e && e.stack) || e)));
  await pg.addInitScript(([konto, merker, sitz]) => {
    try {
      /* nur beim ersten Öffnen dieses Kontexts (Teil E öffnet ein zweites Mal) */
      if (!sessionStorage.getItem("__sonde885")) {
        sessionStorage.setItem("__sonde885", "1");
        localStorage.setItem("dma_tour_seen", "1");
        if (merker) localStorage.setItem("dma-walkie", "1");
        if (konto) localStorage.setItem("sb-rolcktiryrvjzbwuvobb-auth-token", JSON.stringify(sitz));
      }
    } catch (e) {}
    window.__s = { reiter: null, abrufe: [], skripte: [] };
    const f0 = window.fetch;
    window.fetch = function (u) {
      const a = { u: String((u && u.url) || u), t: performance.now(), e: null };
      window.__s.abrufe.push(a);
      const p = f0.apply(this, arguments);
      p.then(() => { a.e = performance.now(); }, () => { a.e = -1; });
      return p;
    };
    new MutationObserver((l) => l.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.tagName === "SCRIPT" && /rueckfrage\.js/.test(n.getAttribute("src") || "")) window.__s.skripte.push({ src: n.getAttribute("src"), t: performance.now() });
      if (window.__s.reiter == null && n.classList && n.classList.contains("rf-reiter")) window.__s.reiter = performance.now();
    }))).observe(document, { childList: true, subtree: true });
  }, [o.konto ? KONTO[o.konto] : "", Boolean(o.merker), o.konto ? sitzung(o.konto) : null]);
  if (o.cpu) { const cdp = await ctx.newCDPSession(pg); await cdp.send("Emulation.setCPUThrottlingRate", { rate: o.cpu }); }
  t.null = Date.now();
  await pg.goto(basis + "/index.html", { waitUntil: "domcontentloaded" });
  return { ctx, pg, t, rest, fehlerListe };
}
function sitzung(wer) {
  const id = KONTO[wer], jetzt = Math.floor(Date.now() / 1000);
  return { access_token: "sonde.885." + wer, token_type: "bearer", expires_in: 86400, expires_at: jetzt + 86400, refresh_token: "sonde-" + wer,
    user: { id, aud: "authenticated", role: "authenticated", email: wer + "@sonde.test", user_metadata: { name: wer === "betreiber" ? "Xander" : "Schueler" }, app_metadata: { provider: "email" }, created_at: "2026-01-01T00:00:00Z" } };
}
function profilZeile(wer) {
  return { id: KONTO[wer], name: wer === "betreiber" ? "Xander" : "Schueler", points: 10, badges: [], trophies: [], theme: "bastelheft",
    is_owner: wer === "betreiber", is_admin: wer === "betreiber", is_moderator: false, is_premium: false, extra_profile_data: { seenFoxIntro: true } };
}
/* Zeiten in der Seite (performance.now): DOMContentLoaded, rueckfrage.js, Profil-Antwort, erste Walkie-Abfrage, Reiter */
const stand = (pg) => pg.evaluate(() => {
  const n = performance.getEntriesByType("navigation")[0] || {};
  const res = performance.getEntriesByType("resource");
  const rf = res.filter((e) => /\/rueckfrage\.js(\?|$)/.test(e.name));
  const ab = window.__s.abrufe;
  const profil = ab.find((a) => /\/rest\/v1\/profiles\?/.test(a.u) && /id=eq\./.test(decodeURIComponent(a.u)));
  const walkie = ab.find((a) => /\/rest\/v1\/betreiber_rueckfragen/.test(a.u));
  let merker = null; try { merker = localStorage.getItem("dma-walkie"); } catch (e) {}
  let ohneMin = null; try { ohneMin = localStorage.getItem("dma-ohne-min"); } catch (e) {}
  return { dcl: n.domContentLoadedEventStart || null, rfStart: rf.length ? rf[0].startTime : null, rfZahl: rf.length, rfNamen: rf.map((e) => e.name.replace(/^https?:\/\/[^/]+/, "")),
    rfEnde: rf.length ? rf[rf.length - 1].responseEnd : null, eingefuegt: window.__s.skripte.slice(),
    profilEnde: profil ? profil.e : null, walkie: walkie ? walkie.t : null, reiter: window.__s.reiter, merker, ohneMin,
    rueckfrage: typeof window.Rueckfrage, zahl: (document.querySelector(".rf-reiter .rf-reiter-zahl") || {}).textContent || "" };
});
const warteReiter = (pg, ms) => pg.waitForFunction(() => window.__s && window.__s.reiter != null, null, { timeout: ms }).then(() => true, () => false);
const indexAbrufe = (log, ab) => log.slice(ab || 0).filter((x) => x.p === "/index.html").length;
const walkieAbrufe = (log, ab) => log.slice(ab || 0).filter((x) => /\/rueckfrage\.js$/.test(x.p)).map((x) => x.p);

(async () => {
  console.log("SONDE 885 — Start schlanker (K)   WURZEL " + WURZEL + (GEGEN ? "   GEGEN " + GEGEN : "") + "   BASIS " + BASIS);
  const HTML = lies(WURZEL, "index.html");

  /* ===================== Q ===================== */
  if (NUR.includes("Q")) {
    abschnitt("Q", "Bau");
    const ALT = execFileSync("git", ["-C", HIER, "show", BASIS + ":index.html"], { encoding: "utf8", maxBuffer: 64 << 20 });
    const startliste = (HTML.match(/var dateien = \[[\s\S]*?\];/) || [""])[0];
    sage(startliste.length > 100 && !/"rueckfrage\.js"/.test(startliste), "rueckfrage.js steht nicht in der Startliste");
    sage(/window\.dmaWalkieLaden = function \(\)/.test(HTML) && /localStorage\.getItem\("dma-walkie"\)/.test(HTML) && /requestIdleCallback\(window\.dmaWalkieLaden/.test(HTML),
      "index.html: dmaWalkieLaden, mit Merker in der Ruhepause nach DOMContentLoaded");
    {
      const i0 = HTML.indexOf("window.dmaWalkieLaden = function"), i1 = HTML.indexOf('try { window.addEventListener("beforeinstallprompt"', i0);
      sage(i0 > 0 && i1 > i0 && !/dmaMinFehlt|reload/.test(HTML.slice(i0, i1)), "der Walkie-Lader ruft nie dmaMinFehlt oder reload (kein Neuladen, wenn min/rueckfrage.js fehlt)");
    }
    for (const f of ["backend.js", "min/backend.js"]) {
      const s = fs.existsSync(path.join(WURZEL, f)) ? lies(WURZEL, f) : "";
      sage(/dma-walkie/.test(s) && /dmaWalkieLaden/.test(s) && (f.startsWith("min/") || /walkieMerken\(Boolean\(data\.is_owner\)\)/.test(s)), f + ": erkennt den Betreiber am eigenen Profil (is_owner) und ruft dmaWalkieLaden");
    }
    for (const f of ["rueckfrage.js", "min/rueckfrage.js"]) {
      const s = fs.existsSync(path.join(WURZEL, f)) ? lies(WURZEL, f) : "";
      sage(/erkannt\s*:/.test(s) && /domContentLoadedEventStart/.test(s), f + ": Start ab DOMContentLoaded gerechnet, erkannt()");
    }
    const eb = esbuildHolen();
    if (!eb) sage(false, "esbuild fehlt (npx --yes esbuild@0.28.2 --version)");
    else {
      const knapp = (js) => eb.transformSync(js, { minifyWhitespace: true, legalComments: "none", loader: "js" }).code;
      const ohneStempel = (l) => l.filter((s) => !/^window\.DMA_STEMPEL = /.test(s));
      const a = ohneStempel(inlineSkripte(ALT)), b = ohneStempel(inlineSkripte(HTML));
      sage(a.length === b.length, "gleich viele Inline-Skripte wie vor K", a.length + " → " + b.length);
      let gleich = 0, lader = null;
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        let x = knapp(a[i]), y = knapp(b[i]);
        if (/var dateien=\[/.test(x)) {
          x = x.replace('"rueckfrage.js",', "");
          const i0 = y.indexOf("window.dmaWalkieLaden="), i1 = y.indexOf('try{window.addEventListener("beforeinstallprompt"', i0);
          if (i0 >= 0 && i1 > i0) y = y.slice(0, i0) + y.slice(i1);
          lader = x === y;
        }
        if (x === y) gleich++;
        else { let k = 0; while (k < x.length && x[k] === y[k]) k++; info("Skript " + (i + 1) + " weicht ab bei: …" + x.slice(Math.max(0, k - 60), k + 60) + "… / …" + y.slice(Math.max(0, k - 60), k + 60) + "…"); }
      }
      sage(gleich === a.length && a.length === b.length, "Code aller Inline-Skripte nach dem Verkleinern gleich (" + gleich + " von " + a.length + ")");
      sage(lader === true, "im Lader nur: \"rueckfrage.js\" aus der Liste, dmaWalkieLaden + Merker-Zeile dazu");
    }
    /* Die Seite ohne Kommentare und Skript-Texte, Knoten für Knoten (DOMParser im Browser) */
    {
      const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
      const pg = await br.newPage();
      const [x, y] = await pg.evaluate(([a, b]) => {
        const zug = (html) => {
          const d = new DOMParser().parseFromString(html, "text/html"), aus = [];
          let text = null;
          const flush = () => { if (text != null) { const t = text.replace(/\s+/g, " "); if (t !== " " && t !== "") aus.push("#" + t); else aus.push("#_"); text = null; } };
          const geh = (n) => {
            for (const k of n.childNodes) {
              if (k.nodeType === 8) continue;
              if (k.nodeType === 3) { text = (text || "") + k.data; continue; }
              flush();
              if (k.nodeType === 1) {
                const at = [...k.attributes].map((a) => a.name + "=" + a.value).sort().join(" ");
                aus.push("<" + k.tagName + " " + at + ">");
                if (k.tagName !== "SCRIPT") geh(k.tagName === "TEMPLATE" ? k.content : k);
                aus.push("</" + k.tagName + ">");
              }
            }
            flush();
          };
          geh(d);
          return aus.join("\n");
        };
        return [zug(a), zug(b)];
      }, [ALT, HTML]);
      let k = 0; while (k < x.length && x[k] === y[k]) k++;
      sage(x === y, "die Seite ohne Kommentare Knoten für Knoten gleich (DOMParser, " + x.split("\n").length + " Einträge)", x === y ? "" : "erste Abweichung: …" + x.slice(Math.max(0, k - 80), k + 80).replace(/\n/g, "⏎") + "… / …" + y.slice(Math.max(0, k - 80), k + 80).replace(/\n/g, "⏎") + "…");
      await br.close();
    }
    const kn = kommentare(HTML), ka = kommentare(ALT);
    const laengster = kn.reduce((m, c) => (c.length > m.length ? c : m), "");
    const summe = kn.reduce((s, c) => s + c.length, 0), summeAlt = ka.reduce((s, c) => s + c.length, 0);
    sage(kn.every((c) => c.split("\n").length <= 2) && laengster.length <= 300, "kein Kommentar in index.html länger als zwei Zeilen / 300 Zeichen", "längster " + laengster.length + ": " + laengster.slice(0, 70).replace(/\n/g, "⏎") + "…");
    sage(summe <= 6500, "Kommentare in index.html zusammen ≤ 6500 Zeichen", summeAlt + " → " + summe + " Zeichen (" + ka.length + " → " + kn.length + " Kommentare)");
    const SPS = glatt(fs.existsSync(path.join(WURZEL, "SPIELSYSTEM.md")) ? lies(WURZEL, "SPIELSYSTEM.md") : "");
    const lang = ka.filter((c) => c.length > 140);
    const fehlt = lang.filter((c) => SPS.indexOf(glatt(c)) < 0);
    sage(lang.length > 30 && fehlt.length === 0, "jeder Kommentar > 140 Zeichen aus dem Stand vor K steht wörtlich in SPIELSYSTEM.md", lang.length + " lange, fehlen: " + fehlt.length + (fehlt.length ? " (z. B. " + fehlt[0].slice(0, 60).replace(/\n/g, "⏎") + "…)" : ""));
    const verweise = [...HTML.matchAll(/SPIELSYSTEM\.md I(\d+)\b/g)].map((m) => Number(m[1]));
    const ohneZiel = verweise.filter((n) => SPS.indexOf("#### I" + n + " — ") < 0);
    sage(verweise.length >= 40 && ohneZiel.length === 0 && new Set(verweise).size === verweise.length, "jeder Verweis „SPIELSYSTEM.md I<n>“ hat dort seine Überschrift (je Nummer einmal)", verweise.length + " Verweise, ohne Ziel: " + ohneZiel.join(", "));
    const ga = gz(ALT), gn = gz(HTML);
    sage(gn <= ga - 5000, "index.html gepackt mindestens 5 KB kleiner", "gzip -9: " + ga + " → " + gn + " B (" + (gn - ga) + "), roh " + Buffer.byteLength(ALT) + " → " + Buffer.byteLength(HTML));
  }

  UMD.pfad = supabaseHolen();
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"] });
  const S = await server(WURZEL);
  const keinWalkieFehler = (l) => l.filter((e) => /rueckfrage|dmaWalkie|walkieMerken/.test(e));

  try {
    /* ===================== A ===================== */
    if (NUR.includes("A")) {
      abschnitt("A", "Gast: rueckfrage.js wird nie geholt");
      const ab = S.log.length;
      const x = await seite(br, S.basis, {});
      await x.pg.waitForLoadState("load");
      await warte(6000);
      const s = await stand(x.pg);
      sage(walkieAbrufe(S.log, ab).length === 0 && s.rfZahl === 0, "rueckfrage.js nicht geholt (load + 6 s)", "Abrufe: " + (walkieAbrufe(S.log, ab).join(", ") || "keine"));
      sage(s.rueckfrage === "undefined" && s.reiter == null, "kein Walkie (window.Rueckfrage " + s.rueckfrage + ", Reiter " + (s.reiter == null ? "keiner" : "da") + ")");
      sage(s.merker == null, "kein Merker dma-walkie");
      sage(keinWalkieFehler(x.fehlerListe).length === 0, "keine Seitenfehler aus dem Walkie", x.fehlerListe.length ? x.fehlerListe.length + " andere (Datenbank nachgestellt)" : "");
      await x.ctx.close();
    }

    /* ===================== B ===================== */
    if (NUR.includes("B")) {
      abschnitt("B", "Betreiber, Gerät mit Merker, Profil nach 300 ms");
      const ab = S.log.length;
      const x = await seite(br, S.basis, { konto: "betreiber", merker: true, profilMs: 300 });
      const da = await warteReiter(x.pg, 10000);
      await warte(500);
      const s = await stand(x.pg);
      sage(da && s.zahl === "1", "Reiter steht da (eine offene Frage)", "Reiter " + r0(s.reiter - s.dcl) + " ms nach DOMContentLoaded");
      sage(s.rfStart != null && s.rfStart >= s.dcl && s.rfStart <= s.dcl + 1000, "rueckfrage.js nach DOMContentLoaded geholt, spätestens +1 s (Ruhepause)", "Beginn " + r0(s.rfStart - s.dcl) + " ms nach DOMContentLoaded");
      sage(s.walkie != null && s.walkie - s.dcl >= 1400 && s.walkie - s.dcl <= 2000, "erste Walkie-Abfrage ~1,5 s nach DOMContentLoaded (wie bisher)", r0(s.walkie - s.dcl) + " ms; Profil-Antwort " + r0(s.profilEnde - s.dcl) + " ms");
      sage(walkieAbrufe(S.log, ab).length === 1 && indexAbrufe(S.log, ab) === 1, "genau ein Abruf, kein Neuladen", walkieAbrufe(S.log, ab).join(", ") + "; index.html " + indexAbrufe(S.log, ab) + "×");
      sage(s.merker === "1", "Merker bleibt");
      sage(keinWalkieFehler(x.fehlerListe).length === 0, "keine Seitenfehler aus dem Walkie", keinWalkieFehler(x.fehlerListe)[0] || "");
      await x.ctx.close();
    }

    /* ===================== C ===================== */
    if (NUR.includes("C")) {
      abschnitt("C", "Betreiber, erster Start nach dem Update (kein Merker), Profil nach 300 ms");
      const ab = S.log.length;
      const x = await seite(br, S.basis, { konto: "betreiber", profilMs: 300 });
      const da = await warteReiter(x.pg, 10000);
      await warte(500);
      const s = await stand(x.pg);
      sage(s.profilEnde != null && s.rfStart != null && s.rfStart >= s.profilEnde - 5, "rueckfrage.js erst nach der Antwort mit is_owner", "Profil-Antwort " + r0(s.profilEnde - s.dcl) + ", Datei " + r0(s.rfStart - s.dcl) + " ms nach DOMContentLoaded");
      sage(da, "Reiter steht da", "Reiter " + r0(s.reiter - s.dcl) + " ms, erste Abfrage " + r0(s.walkie - s.dcl) + " ms nach DOMContentLoaded");
      sage(s.walkie != null && s.walkie - s.dcl <= Math.max(1500, s.rfEnde - s.dcl) + 400, "erste Walkie-Abfrage spätestens 1,5 s nach DOMContentLoaded bzw. gleich nach der Datei", "Datei fertig " + r0(s.rfEnde - s.dcl) + " ms");
      sage(s.merker === "1", "danach Merker dma-walkie = 1");
      sage(walkieAbrufe(S.log, ab).length === 1 && indexAbrufe(S.log, ab) === 1, "genau ein Abruf, kein Neuladen", walkieAbrufe(S.log, ab).join(", ") + "; index.html " + indexAbrufe(S.log, ab) + "×");
      await x.ctx.close();
    }

    /* ===================== D ===================== */
    if (NUR.includes("D")) {
      abschnitt("D", "Profil kommt spät (3,5 s): Reiter gleich danach statt beim nächsten 20-s-Takt");
      for (const merker of [true, false]) {
        const x = await seite(br, S.basis, { konto: "betreiber", merker, profilMs: 3500 });
        await x.pg.waitForFunction(() => window.__s.abrufe.some((a) => /\/rest\/v1\/profiles\?/.test(a.u) && a.e != null), null, { timeout: 20000 }).catch(() => {});
        const da = await warteReiter(x.pg, 2500);
        const s = await stand(x.pg);
        sage(da && s.reiter - s.profilEnde <= 1000, (merker ? "mit" : "ohne") + " Merker: Reiter ≤ 1 s nach der Antwort mit is_owner",
          "Profil-Antwort " + r0(s.profilEnde - s.dcl) + " ms, Reiter " + (s.reiter == null ? "nicht binnen 2,5 s" : r0(s.reiter - s.dcl) + " ms") + " nach DOMContentLoaded");
        await x.ctx.close();
      }
    }

    /* ===================== E ===================== */
    if (NUR.includes("E")) {
      abschnitt("E", "Anderes Konto auf einem Gerät mit Merker");
      const x = await seite(br, S.basis, { konto: "schueler", merker: true, profilMs: 300 });
      await x.pg.waitForFunction(() => window.__s.abrufe.some((a) => /\/rest\/v1\/profiles\?/.test(a.u) && a.e != null), null, { timeout: 15000 }).catch(() => {});
      await warte(3000);
      const s = await stand(x.pg);
      sage(s.merker == null, "Merker nach dem Profil (is_owner = false) weg", "dma-walkie = " + s.merker);
      sage(s.reiter == null, "kein Reiter");
      const ab = S.log.length;
      await x.pg.reload({ waitUntil: "load" });
      await warte(4000);
      const s2 = await stand(x.pg);
      sage(walkieAbrufe(S.log, ab).length === 0 && s2.rfZahl === 0, "beim nächsten Öffnen wird rueckfrage.js nicht mehr geholt", walkieAbrufe(S.log, ab).join(", ") || "keine");
      await x.ctx.close();
    }

    /* ===================== F ===================== */
    if (NUR.includes("F")) {
      abschnitt("F", "min/rueckfrage.js fehlt (404): die Quelle, kein Neuladen");
      const F = await server(WURZEL, { ohneMinWalkie: true });
      const x = await seite(br, F.basis, { konto: "betreiber", merker: true, profilMs: 300 });
      const da = await warteReiter(x.pg, 10000);
      await warte(1500);
      const s = await stand(x.pg);
      sage(da, "Reiter steht da", s.rfNamen.join(", "));
      sage(walkieAbrufe(F.log).includes("/rueckfrage.js"), "die Quelle rueckfrage.js wurde geholt", walkieAbrufe(F.log).join(", "));
      sage(indexAbrufe(F.log) === 1 && s.ohneMin == null, "kein Neuladen, „dma-ohne-min“ nicht gesetzt", "index.html " + indexAbrufe(F.log) + "×, dma-ohne-min " + s.ohneMin);
      await x.ctx.close(); F.srv.close();
    }

    /* ===================== G ===================== */
    if (NUR.includes("G")) {
      abschnitt("G", "Anmeldung erst später (Backend.signIn, Formularweg)");
      const ab = S.log.length;
      const x = await seite(br, S.basis, { spaeterKonto: "betreiber", profilMs: 300 });
      await x.pg.waitForLoadState("load");
      await x.pg.waitForFunction(() => typeof Backend !== "undefined" && window.supabase, null, { timeout: 15000 });
      await warte(2500);
      const vor = walkieAbrufe(S.log, ab).length;
      const t0 = await x.pg.evaluate(() => performance.now());
      await x.pg.evaluate(() => Backend.signIn("betreiber@sonde.test", "sonde").catch((e) => { window.__s.anmeldeFehler = String(e && e.message); }));
      const da = await warteReiter(x.pg, 2500);
      const s = await stand(x.pg);
      sage(vor === 0, "vor der Anmeldung kein rueckfrage.js", vor + " Abrufe");
      sage(da, "Reiter ≤ 2,5 s nach dem Anmelden", s.reiter == null ? "nicht da" : r0(s.reiter - t0) + " ms nach dem Aufruf");
      sage(s.merker === "1" && indexAbrufe(S.log, ab) === 1, "Merker gesetzt, kein Neuladen");
      await x.ctx.close();
    }

    /* ===================== M ===================== */
    if (NUR.includes("M") && GEGEN) {
      abschnitt("M", "Messung: Betreiber, CPU 4×, Datenbank 150 ms (Profil 300 ms); A = GEGEN, B = WURZEL, verschränkt");
      const G = await server(GEGEN);
      for (const merker of [true, false]) {
        const werte = { A: [], B: [] };
        for (let i = 0; i < PAARE; i++) {
          for (const w of i % 2 ? ["B", "A"] : ["A", "B"]) {
            const x = await seite(br, (w === "A" ? G : S).basis, { konto: "betreiber", merker, profilMs: 300, restMs: 150, cpu: 4 });
            await warteReiter(x.pg, 15000);
            const s = await stand(x.pg);
            werte[w].push({ dcl: s.dcl, abfrage: s.walkie != null ? s.walkie - s.dcl : null, reiter: s.reiter != null ? s.reiter - s.dcl : null, datei: s.rfStart != null ? s.rfStart - s.dcl : null });
            await x.ctx.close();
          }
        }
        console.log("\n  " + (merker ? "mit Merker (sein Gerät)" : "ohne Merker (erster Start nach dem Update)") + ", " + PAARE + " Paare, Median A → B, B − A gepaart (↓ B schneller / ↑ B langsamer):");
        for (const k of ["dcl", "datei", "abfrage", "reiter"]) {
          const d = werte.A.map((a, i) => (werte.B[i][k] != null && a[k] != null ? werte.B[i][k] - a[k] : null)).filter((x) => x != null);
          console.log("    " + { dcl: "DOMContentLoaded (ab Start)", datei: "rueckfrage.js geholt (ab DCL)", abfrage: "erste Walkie-Abfrage (ab DCL)", reiter: "Reiter da (ab DCL)" }[k].padEnd(32) +
            r0(median(werte.A.map((a) => a[k]))) + " → " + r0(median(werte.B.map((a) => a[k]))) + ", " + (d.length ? (median(d) > 0 ? "+" : "") + r0(median(d)) + " (" + d.filter((x) => x < 0).length + "↓/" + d.filter((x) => x > 0).length + "↑)" : "–"));
        }
        const dr = werte.A.map((a, i) => (werte.B[i].reiter != null && a.reiter != null ? werte.B[i].reiter - a.reiter : null)).filter((x) => x != null);
        sage(dr.length === PAARE && median(dr) <= 100, (merker ? "mit" : "ohne") + " Merker: Reiter nicht später als vorher (Median B − A ≤ 100 ms)", "Median " + r0(median(dr)) + " ms");
        if (process.env.M_JSON) fs.writeFileSync(process.env.M_JSON.replace(/\.json$/, "") + (merker ? "-mit" : "-ohne") + ".json", JSON.stringify(werte, null, 1));
      }
      G.srv.close();
    }
  } finally {
    await br.close();
    S.srv.close();
  }
  console.log("\n" + (fehler ? fehler + " FEHL (" + Object.keys(rot).map((k) => k + " ×" + rot[k]).join(", ") + ")" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
