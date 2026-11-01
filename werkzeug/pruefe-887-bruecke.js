#!/usr/bin/env node
/* =====================================================================
   SONDE 887 — BRÜCKENWÄCHTER (MODULE-PLAN.md Abschnitt 3, M1)
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität".

   Beim Umbau auf Module zieht Code Stück für Stück aus den klassischen
   Skripten (globale Namen) in Module (eigener Bereich). Was die übrigen
   klassischen Skripte, index.html, die Sonden und die Messung über
   window.* oder globale const/let/class-Namen erreichen, muss erreichbar
   bleiben – sonst bricht etwas still, oft erst im Klassenzimmer.

   Diese Sonde lädt die Seite in drei Fällen, jeweils mit min/ und mit
   ?quelle:
     gast   Gast, 6 s nach load (spiel.js und messung.js sind da)
     konto  Betreiber angemeldet (Anmeldung im Gerät, Datenbank nachgebaut,
            supabase-js aus der lokalen Kopie) – das Walkie kommt dazu
     raum   wie konto, dazu Tipp auf „Klassenzimmer“ und LiveChat.betreten
            (die Raum-Stücke aus app.js laden)
   und prüft:
     N  die window-Namen und die globalen const/let/class-Namen bleiben eine
        Obermenge von werkzeug/bruecke-liste.json (je Fall)
     R  die Startskripte laufen in der Reihenfolge der Liste in index.html
        (Ereignis „load“ je Skript)
     E  kein pageerror
   Die Liste entsteht aus dem Stand vor dem Umbau (7e23e157) als
   Schnittmenge aus min/ und ?quelle (nur, was in beiden sicher da ist):
     LISTE=neu WURZEL=<ordner mit 7e23e157> node werkzeug/pruefe-887-bruecke.js
   Fehlt ein Name, steht er in der Ausgabe. Zieht ein Name bewusst weg
   (Schritt 12 „Brücke abbauen“), wird die Liste mit Begründung im Logbuch
   neu geschrieben – nie still.

   Aufruf:     node werkzeug/pruefe-887-bruecke.js          (FALL=gast,konto,raum)
   Gegenprobe: eine Brücke weglassen, z. B. BRUCH=Rueckfrage (die Sonde
               löscht window.Rueckfrage nach dem Laden) → rot
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const HIER = path.join(__dirname, "..");
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const LISTE = path.join(__dirname, "bruecke-liste.json");
const NEU = process.env.LISTE === "neu";
const FAELLE = (process.env.FALL || "gast,konto,raum").split(",").filter(Boolean);
const BRUCH = process.env.BRUCH || "";
const PROJEKT = "rolcktiryrvjzbwuvobb";
const KONTO = "11111111-2222-4333-8444-555555555555";
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/* supabase-js: dieselbe lokale Kopie wie pruefe-885-schlank.js / ladezeit-messen.js */
function supabaseUmd() {
  const kand = [process.env.SUPABASE_UMD, path.join(os.tmpdir(), "dma-mess-supabase-js-2.117.3.umd.js"), "/tmp/dma-mess-supabase-js-2.117.3.umd.js"];
  for (const k of kand) if (k && fs.existsSync(k)) return k;
  throw new Error("supabase-js 2.117.3 (umd) nicht gefunden – einmal pruefe-885-schlank.js laufen lassen oder SUPABASE_UMD=… setzen");
}
function sitzung() {
  const jetzt = Math.floor(Date.now() / 1000);
  return { access_token: "sonde.887.betreiber", token_type: "bearer", expires_in: 86400, expires_at: jetzt + 86400, refresh_token: "sonde-betreiber",
    user: { id: KONTO, aud: "authenticated", role: "authenticated", email: "betreiber@sonde.test", user_metadata: { name: "Xander" }, app_metadata: { provider: "email" }, created_at: "2026-01-01T00:00:00Z" } };
}
const PROFIL = { id: KONTO, name: "Xander", points: 10, badges: [], trophies: [], theme: "bastelheft", is_owner: true, is_admin: true,
  is_moderator: false, is_premium: false, extra_profile_data: { seenFoxIntro: true } };

/* Kandidaten für globale const/let/class: Zeilenanfang (oberste Ebene) in allen klassischen Skripten der Wurzel */
function lexKandidaten(w) {
  const s = new Set();
  fs.readdirSync(w).filter((n) => /^[a-z0-9-]+\.js$/.test(n) && n !== "sw.js").forEach((n) => {
    const t = fs.readFileSync(path.join(w, n), "utf8");
    for (const m of t.matchAll(/^(?:const|let|class)\s+([A-Za-z_$][\w$]*)/gm)) s.add(m[1]);
  });
  return [...s].sort();
}

(async () => {
  console.log("SONDE 887 — Brückenwächter   WURZEL " + WURZEL + (NEU ? "   (schreibt " + path.relative(HIER, LISTE) + ")" : "") + (BRUCH ? "   BRUCH " + BRUCH : "") + "\n");
  const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
  const startliste = ((html.match(/var dateien = \[([\s\S]*?)\];/) || [])[1] || "").match(/"[a-z0-9-]+\.js"/g).map((x) => x.slice(1, -1));
  const kand = lexKandidaten(WURZEL);
  const UMD = supabaseUmd();
  const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
    ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".gif": "image/gif" };
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
    args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });

  /* die Namen einer leeren Seite (gehören dem Browser, nicht der Brücke) */
  const leer = await (async () => {
    const ctx = await br.newContext(); const pg = await ctx.newPage();
    const n = await pg.evaluate(() => Object.getOwnPropertyNames(window));
    await ctx.close();
    return new Set(n);
  })();

  const lauf = async (fall, quelle) => {
    const mitKonto = fall !== "gast";
    const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (r) => {
      const u = r.request().url();
      if (/cdn\.jsdelivr\.net\/.*supabase/.test(u)) return mitKonto ? r.fulfill({ status: 200, contentType: "text/javascript", body: fs.readFileSync(UMD) }) : r.abort();
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
    await ctx.addInitScript(([konto, sitz]) => {
      try {
        localStorage.setItem("dma_tour_seen", "1");
        if (konto) { localStorage.setItem("sb-rolcktiryrvjzbwuvobb-auth-token", JSON.stringify(sitz)); localStorage.setItem("dma-walkie", "1"); }
      } catch (e) {}
      window.__br = [];
      document.addEventListener("load", (e) => {
        const t = e.target;
        if (t && t.tagName === "SCRIPT" && t.src) window.__br.push(t.src.replace(location.origin + "/", "").replace(/\?.*$/, ""));
      }, true);
    }, [mitKonto, sitzung()]);
    const pg = await ctx.newPage();
    const pe = [];
    pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
    await pg.goto(BASIS + "/index.html" + (quelle ? "?quelle" : ""), { waitUntil: "load", timeout: 90000 });
    if (mitKonto) await pg.waitForFunction(() => window.Rueckfrage && typeof window.Rueckfrage.holen === "function", null, { timeout: 20000 }).catch(() => {});
    if (fall === "raum") {
      await pg.waitForFunction(() => document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]'), null, { timeout: 20000 }).catch(() => {});
      await pg.evaluate(() => {
        const t = document.querySelector('.tape-tab[data-target="view-knowledge"]'); if (t) t.click();
        const p = document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]'); if (p) p.click();
      }).catch(() => {});
      await warte(1500);
      await pg.evaluate(() => { try { window.LiveChat.betreten("sondebruecke887", { name: "Sonde", mitBild: false }); } catch (e) {} }).catch(() => {});
    }
    await warte(6500);
    if (BRUCH) await pg.evaluate((n) => { try { delete window[n]; } catch (e) {} }, BRUCH).catch(() => {});
    const r = await pg.evaluate((kand) => {
      const win = Object.getOwnPropertyNames(window);
      const lex = kand.filter((n) => { try { return (0, eval)("typeof " + n) !== "undefined"; } catch (e) { return false; } });
      return { win, lex, folge: window.__br.slice(), drin: !!(window.LiveChat && window.LiveChat.lage && window.LiveChat.lage().lage) ? window.LiveChat.lage().lage : "" };
    }, kand);
    await ctx.close();
    const namen = new Set(r.win.filter((n) => !leer.has(n)).concat(r.lex.map((n) => "lex:" + n)));
    return { namen, folge: r.folge, pe, lage: r.drin };
  };

  const ergebnis = {};
  for (const fall of FAELLE) {
    for (const quelle of [false, true]) {
      const t0 = Date.now();
      const e = await lauf(fall, quelle);
      ergebnis[fall + (quelle ? "-quelle" : "-min")] = e;
      console.log("  info " + fall + (quelle ? " ?quelle" : " min") + ": " + e.namen.size + " Namen, " + e.folge.length + " Skripte, Lage „" + e.lage + "“, " + Math.round((Date.now() - t0) / 1000) + " s");
    }
  }
  await br.close(); srv.close();

  if (NEU) {
    const liste = { stand: process.env.STAND || "", entstanden: new Date().toISOString().slice(0, 10), faelle: {} };
    for (const fall of FAELLE) {
      const a = ergebnis[fall + "-min"].namen, b = ergebnis[fall + "-quelle"].namen;
      liste.faelle[fall] = [...a].filter((n) => b.has(n) && !/^__/.test(n)).sort();
    }
    fs.writeFileSync(LISTE, JSON.stringify(liste, null, 1) + "\n");
    console.log("\n  Liste geschrieben: " + Object.entries(liste.faelle).map(([f, l]) => f + " " + l.length).join(", "));
    process.exit(0);
  }

  let liste = null;
  try { liste = JSON.parse(fs.readFileSync(LISTE, "utf8")); } catch (e) {}
  sage(Boolean(liste && liste.faelle), "werkzeug/bruecke-liste.json lesbar");
  console.log("");
  for (const fall of FAELLE) {
    for (const quelle of [false, true]) {
      const k = fall + (quelle ? "-quelle" : "-min"), e = ergebnis[k];
      const soll = (liste && liste.faelle && liste.faelle[fall]) || [];
      const fehlt = soll.filter((n) => !e.namen.has(n));
      sage(soll.length > 50 && !fehlt.length, "N  " + k + ": alle " + soll.length + " Brücken-Namen da (window + globale const/let/class)", fehlt.length ? "fehlt: " + fehlt.slice(0, 12).join(", ") : "");
      /* Reihenfolge: die Startskripte in der Reihenfolge der Liste (min/ oder Quelle) */
      const lauf2 = e.folge.map((s) => s.replace(/^min\//, "")).filter((s) => startliste.indexOf(s) >= 0);
      const erwartet = startliste.filter((s) => lauf2.indexOf(s) >= 0);
      sage(lauf2.length >= startliste.length - 2 && lauf2.join(",") === erwartet.join(","), "R  " + k + ": Startskripte in der Reihenfolge von index.html", lauf2.length + "/" + startliste.length
        + (lauf2.join(",") === erwartet.join(",") ? "" : " · " + lauf2.join(",")));
      sage(!e.pe.length, "E  " + k + ": kein pageerror", e.pe.slice(0, 3).join(" | "));
    }
  }
  console.log("\n  " + (fehler ? fehler + " FEHL" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
