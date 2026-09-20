#!/usr/bin/env node
/* =========================================================
   RUNDE 21 — LESEN IM CHAT
   ---------------------------------------------------------
   GEWUENSCHT, woertlich:
   „Kann man sich die Texte von der Seite — es war einmal in
    Deutschland oder egal was man lesen moechte — in den Chat
    bringen? Also dass man eine Auswahl hat im Chat, wo man
    auswaehlt, welchen Text in welchem Niveau man lesen
    moechte, und dass dort auch angegeben markiert steht C1
    oder je nachdem, welches Niveau man ausgewaehlt hat …
    Und koennte man das zeilenweise gewissenhaft lesen,
    sodass die Leute nicht abgelenkt sind, wenn sie den
    ganzen Text lesen — dass ich die Zeile highlighten kann,
    die sie lesen sollen in dem Moment, und sie das auf ihrer
    Seite auch sehen … sofern dass das Laden nicht
    verschlimmert."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");

  console.log("\nDAS LADEN WIRD NICHT SCHLECHTER\n");
  pruefe("keine neue Datei in der Startliste",
    !/data-lesetexte|data-lesen/.test(html),
    "die Texte liegen schon in app.js (SCHNEE_ENTRIES)");
  pruefe("und der Waehler laedt auch nichts nach",
    !/lcLesestoff[\s\S]{0,700}createElement\("script"\)/.test(js),
    "er nimmt nur, was schon da ist");

  console.log("\nDER WAEHLER\n");
  pruefe("es gibt ihn", /function lcLeseWaehler/.test(js));
  pruefe("mit sechs Niveaus",
    /const LC_NIVEAUS = \["A1", "A2", "B1", "B2", "C1", "C2"\]/.test(js));
  pruefe("das gewaehlte Niveau bleibt im Profil",
    /kzEinstellungSetzen\("leseniveau"/.test(js));
  pruefe("es gibt einen Knopf dafuer", /id="lcLeseKnopf"/.test(js));
  pruefe("und den Befehl /lesen", /w: "lesen", kurz: "text"/.test(lc));

  console.log("\nDER TEXT WIRD IN ZEILEN GESCHNITTEN\n");
  pruefe("es gibt den Schnitt", /function lcTextInZeilen/.test(js));
  pruefe("er trennt an Satzzeichen", /\[\^\.\!\?\]\+\[\.\!\?\]\*/.test(js));

  console.log("\nDIE ZEILE SEHEN ALLE\n");
  pruefe("die Marke geht als eigener Rundruf hinaus",
    /senden\(\{ art: "lesezeile", leseId: id, nr: n \}\)/.test(lc),
    "keine neue Chatzeile je Satz");
  pruefe("und wird beim Empfang gesetzt",
    /if \(n\.art === "lesezeile"\)/.test(lc));
  pruefe("die Stelle wird gemerkt, fuer Spaeterkommende",
    /var leseStelle = \{\};/.test(lc) && /leseStelle\[String\(n\.leseId\)\]/.test(lc));
  pruefe("Titel, Niveau und Zeilen reisen mit",
    /n\.leseZeilen = zusatz\.leseZeilen/.test(lc)
    && /leseZeilen: Array\.isArray\(n\.leseZeilen\)/.test(lc));

  /* ---------- Im Browser ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz, { timeout: 20000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: { b: { id: "b", name: "Bea", seit: 500 } } });
    const t = document.querySelector('[data-sub="sub-livechat"]');
    if (t) t.click();
  });
  await pg.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });

  console.log("\nGEMESSEN: AUSWAHL, NIVEAU, ZEILEN, MARKE\n");
  const erg = await pg.evaluate(async () => {
    const auf = window.DMA_LESEWAHL();
    /* NACHGEBESSERT IN RUNDE 24: der Waehler holt seine Liste jetzt
       je Kategorie und damit als Versprechen — die Texte stehen also
       einen Wimpernschlag spaeter da. Gewartet wird auf die Liste,
       nicht auf eine feste Zeit. */
    await new Promise((f) => {
      let mal = 0;
      const sehen = () => {
        const k = document.getElementById("lcPlatzMenue");
        if ((k && k.querySelectorAll(".lc-lese-text").length) || ++mal > 40) return f();
        setTimeout(sehen, 50);
      };
      sehen();
    });
    const kasten = document.getElementById("lcPlatzMenue");
    const stufen = kasten ? [...kasten.querySelectorAll(".lc-lese-stufe")].map((b) => b.textContent) : [];
    const texte = kasten ? kasten.querySelectorAll(".lc-lese-text").length : 0;
    const c1 = kasten ? [...kasten.querySelectorAll(".lc-lese-stufe")].find((b) => b.textContent === "C1") : null;
    if (c1) c1.click();
    const erste = document.getElementById("lcPlatzMenue")
      && document.getElementById("lcPlatzMenue").querySelector(".lc-lese-text:not(:disabled)");
    if (erste) erste.click();
    await new Promise((f) => setTimeout(f, 400));
    const tafel = document.querySelector(".lc-lesetafel");
    if (!tafel) return { auf: auf, stufen: stufen, texte: texte, tafel: false };
    const zeilen = [...tafel.querySelectorAll(".lc-lese-zeile")];
    if (zeilen[1]) zeilen[1].click();
    await new Promise((f) => setTimeout(f, 150));
    /* Und der Weg von aussen: so kaeme die Marke von einem anderen
       Geraet herein. */
    const id = tafel.dataset.leseId;
    const vonAussen = window.DMA_LESEZEILE(id, 0);
    return { auf: auf, stufen: stufen, texte: texte, tafel: true,
      niveau: (tafel.querySelector(".lc-lese-abzeichen") || {}).textContent,
      titel: (tafel.querySelector(".lc-lese-titel") || {}).textContent,
      zeilen: zeilen.length,
      vonAussen: vonAussen,
      leuchtetJetzt: [...tafel.querySelectorAll(".lc-lese-zeile")]
        .findIndex((b) => b.classList.contains("lc-lese-hier")),
      nurEine: tafel.querySelectorAll(".lc-lese-hier").length };
  });
  pruefe("der Waehler geht auf", erg.auf === true);
  pruefe("sechs Niveaus stehen zur Wahl", erg.stufen.join(",") === "A1,A2,B1,B2,C1,C2",
    erg.stufen.join(" "));
  pruefe("und mehrere Texte", erg.texte >= 5, erg.texte + " Texte");
  pruefe("die Tafel kommt in den Chat", erg.tafel === true, erg.titel || "");
  pruefe("das gewaehlte Niveau steht dran", erg.niveau === "C1", erg.niveau || "-");
  pruefe("der Text ist in Zeilen geschnitten", erg.zeilen >= 2, erg.zeilen + " Zeilen");
  pruefe("eine Marke von aussen kommt an", erg.vonAussen === true);
  pruefe("und es leuchtet genau EINE Zeile",
    erg.nurEine === 1 && erg.leuchtetJetzt === 0,
    "Zeile " + erg.leuchtetJetzt + ", " + erg.nurEine + " markiert");

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0,
    aufSeite.length ? aufSeite.join(" | ") : "keine");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 21 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
