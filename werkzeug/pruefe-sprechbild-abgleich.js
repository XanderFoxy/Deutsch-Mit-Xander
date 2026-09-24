#!/usr/bin/env node
/* =========================================================
   SPRECHBILD (UND ALLE KLASSENZIMMER-EINSTELLUNGEN) ÜBER GERÄTE
   ---------------------------------------------------------
   GEMELDET: „Ach so noch etwas zum Abspeichern im gesamten
   Profil ich habe schon wieder gemerkt dass meine
   sprechanimation also mein sprechbild die Einstellung die ich
   gemacht habe auf dem anderen Gerät nicht gefunden wird auf
   meinem iPhone 12 … habe ich eine andere Sprachbild Animation
   als die die ich gerade eingestellt habe zuletzt."

   pruefe-gif-favoriten.js hat nur nachgesehen, ob etwas in der
   Ablage (DMA_EINST) liegt — nie, ob es auch beim SERVER ankommt.
   Genau dort lag der Fehler (window.Backend ist immer undefined).
   Diese Sonde spielt zwei Geräte mit EINEM gemeinsamen, falschen
   Supabase: die Datenbankzeile liegt hier in Node, beide Seiten
   lesen und schreiben sie über dieselbe Brücke.

     A = Rechner, B = iPhone (mit altem Sprechbild im Gerät)

   1. A wählt „feuer2" → die Zeile hat klassenzimmer.sprechbild.
   2. B lädt neu → B zeigt „feuer2", nicht sein altes „herzen".
   3. B war schon offen, A wählt neu, B setzt nur einen GIF-Zähler
      → das neue Sprechbild von A bleibt in der Zeile stehen.
   4. B kommt aus dem Hintergrund → übernimmt A's Wahl ohne Neuladen.
   5. B wählt selbst neu → A findet es nach dem Neuladen.

   Aufruf: node werkzeug/pruefe-sprechbild-abgleich.js
           DMA_ALT=1 node … → spielt dieselbe Runde mit den Dateien
           aus .sicherung/*.vor-sprechbild-sync (Gegenprobe).
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const ALT = process.env.DMA_ALT === "1";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".webmanifest": "application/json" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Die eine Datenbankzeile — so wie XanderFox am 24.09. aussah:
   extra_profile_data ohne „klassenzimmer". */
const NUTZER = "258507e0-0000-4000-8000-000000000001";
const zeile = { id: NUTZER, name: "XanderFox", points: 0, badges: [], theme: "bastelheft",
  is_owner: true, extra_profile_data: { loginStreak: 3, motto: "Nie aufgeben" } };
let schreibvorgaenge = 0;

function antwort(a) {
  if (a.table === "profiles" && a.op === "select") {
    const f = a.filters.find((x) => x[0] === "id");
    if (f && f[1] !== NUTZER) return { data: a.single ? null : [], error: null };
    let r = JSON.parse(JSON.stringify(zeile));
    const m = /^(\w+):extra_profile_data->(\w+)$/.exec(a.cols || "");
    if (m) r = { [m[1]]: (zeile.extra_profile_data || {})[m[2]] || null };
    return { data: a.single ? r : [r], error: null };
  }
  if (a.table === "profiles" && a.op === "update") {
    Object.assign(zeile, JSON.parse(JSON.stringify(a.payload)));
    schreibvorgaenge++;
    return { data: [zeile], error: null };
  }
  return { data: a.single ? null : [], error: null };
}

/* Ein Supabase zum Anfassen: jede Kette (from().select().eq()…) wird
   gesammelt und beim await über die Brücke nach Node geschickt. */
const FALSCHES_SUPABASE = `
(function () {
  function kette(zustand) {
    var f = function () {};
    return new Proxy(f, {
      get: function (_, p) {
        if (p === "then") {
          return function (ja, nein) {
            return window.__dmaDb(JSON.stringify(zustand)).then(function (t) { return JSON.parse(t); }).then(ja, nein);
          };
        }
        return function () {
          var n = JSON.parse(JSON.stringify(zustand));
          var args = Array.prototype.slice.call(arguments);
          if (p === "select") { if (!n.op) n.op = "select"; n.cols = args[0] || "*"; }
          else if (p === "update" || p === "insert" || p === "upsert" || p === "delete") { n.op = p; n.payload = args[0]; }
          else if (p === "eq") n.filters.push([args[0], args[1]]);
          else if (p === "maybeSingle" || p === "single") n.single = true;
          return kette(n);
        };
      }
    });
  }
  function leer() {
    return new Proxy(function () {}, {
      get: function (_, p) {
        if (p === "then") return undefined;
        return function () { return leer(); };
      },
      apply: function () { return leer(); }
    });
  }
  var sitzung = { user: { id: "${NUTZER}", email: "x@example.test", user_metadata: { name: "XanderFox" } } };
  window.supabase = { createClient: function () {
    return {
      from: function (t) { return kette({ table: t, op: "", filters: [] }); },
      rpc: function () { return Promise.resolve({ data: null, error: null }); },
      auth: {
        getSession: function () { return Promise.resolve({ data: { session: sitzung }, error: null }); },
        getUser: function () { return Promise.resolve({ data: { user: sitzung.user }, error: null }); },
        onAuthStateChange: function () { return { data: { subscription: { unsubscribe: function () {} } } }; }
      },
      channel: function () { return leer(); },
      removeChannel: function () { return Promise.resolve(); },
      storage: { from: function () { return leer(); } },
      functions: { invoke: function () { return Promise.resolve({ data: null, error: null }); } }
    };
  } };
})();`;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    let f = path.join(WURZEL, p);
    if (ALT && /^\/(app|backend|livechat)\.js$/.test(p)) f = path.join(WURZEL, ".sicherung", p.slice(1) + ".vor-sprechbild-sync");
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const ADRESSE = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  async function geraet(name, altesSprechbild) {
    const ctx = await br.newContext({ viewport: { width: 420, height: 800 } });
    await ctx.exposeFunction("__dmaDb", (t) => JSON.stringify(antwort(JSON.parse(t))));
    await ctx.route(/cdn\.jsdelivr\.net\/npm\/@supabase/, (r) =>
      r.fulfill({ status: 200, contentType: "text/javascript", body: FALSCHES_SUPABASE }));
    await ctx.route(/supabase\.co|giphy|googleapis|open-meteo|youtube/, (r) => r.abort());
    if (altesSprechbild) {
      /* Das iPhone hatte sich früher etwas anderes gemerkt — nur im Gerät. */
      await ctx.addInitScript((alt) => {
        try {
          if (!sessionStorage.getItem("__schon")) {
            sessionStorage.setItem("__schon", "1");
            localStorage.setItem("dma_livechat_sprechbild", alt);
            localStorage.setItem("dma_kz_einstellungen", JSON.stringify({ sprechbild: alt }));
          }
        } catch (e) {}
      }, altesSprechbild);
    }
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(name + ": " + String(e).slice(0, 140)));
    await laden(pg);
    return pg;
  }
  async function laden(pg) {
    await pg.goto(ADRESSE, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => {
      try {
        /* eslint-disable-next-line no-undef */
        const p = Backend.currentProfile();
        return window.DMA_EINST && window.LiveChat && p && p.name === "XanderFox";
      } catch (e) { return false; }
    }, null, { timeout: 60000 });
  }
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const kz = () => (zeile.extra_profile_data || {}).klassenzimmer || {};

  const B = await geraet("iPhone", "herzen");   // schon offen, mit altem Stand
  const A = await geraet("Rechner", null);

  console.log("\n1. RECHNER WÄHLT „feuer2\" — KOMMT ES BEIM SERVER AN?\n");
  await A.evaluate(() => window.LiveChat.sprechbildSetzen("feuer2"));
  await warte(800);
  pruefe("die Profilzeile trägt klassenzimmer.sprechbild", kz().sprechbild === "feuer2",
    JSON.stringify(kz()).slice(0, 120));
  pruefe("mit Zeitstempel in _stand", Boolean(kz()._stand && kz()._stand.sprechbild));
  pruefe("die übrigen Profilangaben bleiben stehen", zeile.extra_profile_data.motto === "Nie aufgeben");

  console.log("\n3. IPHONE WAR SCHON OFFEN UND SETZT NUR EINEN GIF-ZÄHLER\n");
  await B.evaluate(() => window.DMA_EINST.setzen("gifZaehler", { "https://example.test/a.gif": 1 }));
  await warte(800);
  pruefe("das Sprechbild vom Rechner bleibt in der Zeile", kz().sprechbild === "feuer2",
    "Zeile: " + kz().sprechbild);
  pruefe("der GIF-Zähler kommt trotzdem an", Boolean(kz().gifZaehler), JSON.stringify(kz().gifZaehler || null));

  console.log("\n4. IPHONE KOMMT AUS DEM HINTERGRUND ZURÜCK (ohne Neuladen)\n");
  await B.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await warte(800);
  const b4 = await B.evaluate(() => window.LiveChat.sprechbild());
  pruefe("das iPhone zeigt jetzt „feuer2\"", b4 === "feuer2", "zeigt: " + b4);

  console.log("\n2. IPHONE LÄDT NEU\n");
  await laden(B);
  const b2 = await B.evaluate(() => window.LiveChat.sprechbild());
  pruefe("nach dem Neuladen: „feuer2\", nicht das alte „herzen\"", b2 === "feuer2", "zeigt: " + b2);

  console.log("\n5. IPHONE WÄHLT SELBST „noten2\" — FINDET DER RECHNER ES?\n");
  await warte(20);
  await B.evaluate(() => window.LiveChat.sprechbildSetzen("noten2"));
  await warte(800);
  pruefe("die Zeile trägt „noten2\"", kz().sprechbild === "noten2", "Zeile: " + kz().sprechbild);
  await laden(A);
  const a5 = await A.evaluate(() => window.LiveChat.sprechbild());
  pruefe("der Rechner zeigt nach dem Neuladen „noten2\"", a5 === "noten2", "zeigt: " + a5);
  /* Der Rechner hat „feuer2" noch im Gerät (älter) — das darf nicht
     beim nächsten Schreiben wieder zurückkommen. */
  await A.evaluate(() => window.DMA_EINST.setzen("sofortSenden", true));
  await warte(800);
  pruefe("ein anderes Schreiben vom Rechner lässt „noten2\" stehen", kz().sprechbild === "noten2",
    "Zeile: " + kz().sprechbild);

  console.log("\nFARBE REIST AUCH MIT\n");
  await A.evaluate(() => window.DMA_EINST.setzen("farbe", "lila"));
  await warte(800);
  await laden(B);
  const fb = await B.evaluate(() => window.DMA_EINST.holen("farbe", null));
  pruefe("die Namens-/Schriftfarbe steht auf dem iPhone", fb === "lila", "iPhone: " + fb);

  console.log("\n  Schreibvorgänge an der Zeile: " + schreibvorgaenge);
  const alle = [].concat(A.__fehler, B.__fehler);
  if (alle.length) {
    console.log("\n  Fehler auf den Seiten (zur Kenntnis):");
    alle.slice(0, 6).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " FEHLER" + (ALT ? " (Gegenprobe mit dem alten Stand)" : "") : "\nalles gut");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
