#!/usr/bin/env node
/* =====================================================================
   SONDE 866 — DIE WACHE RUFT KEINEN GEIST MEHR AN (FASSUNG 848)
   ---------------------------------------------------------------------
   Test vom 03.10., 01:10–01:19: das Oppo rief neun Minuten lang alle
   6–8 s „pvvqnljpk1" an – die alte Kennung des Samsung, die pulste, aber
   nie antwortete. Jedes Angebot ist eine neue Wegesuche.
   Geprüft (Wache mit verkürzten Zeiten: Geduld 300 ms, Geist 3 s):
     1. Eine Gegenseite, die nie antwortet: nach vier Versuchen ohne
        Antwort kommt das nächste erst nach der Geist-Pause.
     2. Meldet sie sich mit „hallo", gilt sofort wieder das normale Tempo.
     3. Zurück im Vordergrund: steht eine Leitung nicht, geht EIN „hallo"
        mit „wieder" hinaus (nicht zweimal kurz hintereinander).
     4. Keine Seitenfehler.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  const pg = await (await br.newContext({ viewport: { width: 393, height: 800 } })).newPage();
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.LiveChat.pruefWache, null, { timeout: 30000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "aaa", ichName: "AAA", seit: 1000, buehne: true, zuruecksetzen: true,
      leute: { zzz: { id: "zzz", name: "GEIST", seit: 2000, gesehen: 9e15, buehne: true, bild: "" } } });
    window.__raus = [];
    window.LiveChat.pruefAbfangen((p) => window.__raus.push(Object.assign({ t: performance.now() }, JSON.parse(JSON.stringify(p)))));
    window.LiveChat.pruefWache({ geduld: 300, geist: 3000, takt: 100 });
  });

  console.log("\n1) Eine Gegenseite, die nie antwortet\n");
  await schlaf(14000);
  const r1 = await pg.evaluate(() => ({ angebote: window.__raus.filter((p) => p.art === "angebot").map((p) => Math.round(p.t)),
    v: window.LiveChat.pruefVersuch("zzz") }));
  const a = r1.angebote, abst = a.slice(1).map((t, i) => t - a[i]);
  console.log("       Angebote: " + a.length + ", Abstände ms: " + abst.join(", ") + ", ohne Antwort: " + (r1.v && r1.v.ohneAntwort));
  sage(a.length >= 4 && abst.slice(0, 3).every((d) => d < 2800), "die ersten Angebote gehen wie bisher im kurzen Takt hinaus", abst.slice(0, 3).join(", "));
  const danach = abst.slice(3);
  sage(danach.length >= 1 && danach.every((d) => d >= 2400), "nach vier Versuchen ohne Antwort kommt das nächste erst nach der Geist-Pause (±0,4 s Neuaufbau)", danach.join(", "));
  sage(a.length <= 8, "in 14 s höchstens 8 Angebote", a.length + "");

  console.log("\n2) Sie meldet sich\n");
  const r2 = await pg.evaluate(async () => {
    const vor = window.__raus.filter((p) => p.art === "angebot").length;
    window.LiveChat.pruefEmpfangen({ art: "hallo", von: "zzz", name: "GEIST", seit: 2000, buehne: true });
    const v = window.LiveChat.pruefVersuch("zzz");
    await new Promise((r) => setTimeout(r, 1500));
    return { ohneAntwort: v && v.ohneAntwort, neu: window.__raus.filter((p) => p.art === "angebot").length - vor };
  });
  sage(r2.ohneAntwort === 0, "„hallo“ setzt die Zählung zurück", String(r2.ohneAntwort));
  sage(r2.neu >= 1, "und es wird sofort wieder angerufen", r2.neu + " neue Angebote in 1,5 s");

  console.log("\n3) Zurück im Vordergrund\n");
  const r3 = await pg.evaluate(async () => {
    const vor = window.__raus.length;
    window.LiveChat.pruefVordergrund();
    const nach1 = window.__raus.slice(vor).filter((p) => p.art === "hallo");
    /* gleich noch einmal sichtbar werden: keine zweite Begrüßung innerhalb von 3 s */
    document.dispatchEvent(new Event("visibilitychange"));
    const nach2 = window.__raus.slice(vor).filter((p) => p.art === "hallo");
    return { erst: nach1.length, wieder: nach1[0] && nach1[0].wieder, zweit: nach2.length };
  });
  sage(r3.erst === 1 && r3.wieder === true, "eine hängende Leitung: EIN „hallo“ mit „wieder“", JSON.stringify(r3));
  sage(r3.zweit === 1, "kein zweites „hallo“ kurz danach", r3.zweit + "");
  const r4 = await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "aaa", ichName: "AAA", seit: 1000, buehne: true, zuruecksetzen: true, leute: {} });
    const vor = window.__raus.length;
    window.LiveChat.pruefVordergrund();
    return window.__raus.slice(vor).filter((p) => p.art === "hallo").length;
  });
  sage(r4 === 0, "niemand sonst im Raum: kein „hallo“", r4 + "");

  console.log("\n4) Quelltext\n");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/var GEIST_MS = 90000;/.test(lc), "im Betrieb: 90 s Abstand bei einer stummen Gegenseite");

  sage(seitenfehler.length === 0, "keine Seitenfehler", seitenfehler.slice(0, 2).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
