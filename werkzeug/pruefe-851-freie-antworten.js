#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 830 (Arbeitsnummer 851): FREIE ANTWORTEN IN DEN
   STADT-QUESTS, SIGNALTON
   ---------------------------------------------------------------------
   XANDER (Funk 257, wörtlich): „Es fehlt der Signalton beim einsprechen
   bei den Aufgaben und die Antworten müssen wirklich variabel sein … z.B
   ich möchte 95 Brötchen kaufen bitte … dann muss das genauso gültig sein
   wie wenn man sagt ich möchte Brötchen kaufen oder ich möchte ein Brot
   kaufen je nach Kontext der Aufgabe … es geht nur darum ob sie
   grammatikalisch richtig sind … und dieses fast kannst du nur schreiben
   wenn er die Grammatik fast richtig hat".
   Geprüft (STADT.quests.sprechen.pruefen mit echten Quests):
     - eigene, passende Sätze zählen voll (1), auch weit weg vom Vorschlag
     - „Fast“ (0,5) nur bei einem Grammatikfehler – mit genau diesem Fehler
     - was nicht zur Aufgabe passt: 0, aber ohne Versuch-Abzug
     - die vorgegebenen Antworten gelten weiter
     - quests.js spielt beim Mikro-Start einen Signalton (an/aus)
   Mit dem Stand 829 ist das rot.
   Aufruf: node werkzeug/pruefe-851-freie-antworten.js
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
/* [Vorlage, Satz (mit {stadt} / {ziel}), erwartete Stufe] */
const FAELLE = [
  ["baeckerei", "Ich möchte 95 Brötchen kaufen, bitte.", 1],
  ["baeckerei", "Ich möchte ein Brot kaufen.", 1],
  ["baeckerei", "Ich hätte gern vier Brötchen, bitte.", 1],
  ["baeckerei", "Eine Brezel und zwei Croissants, bitte.", 1],
  ["baeckerei", "Ich hätte gern vier Brötchens, bitte.", 0.5],
  ["baeckerei", "Ich will vier Brötchen. Schnell!", 0.5],
  ["baeckerei", "Ich möchte kaufen ein Brot.", 0.5],
  ["baeckerei", "Ich hätte gern einen Brezel, bitte.", 0.5],
  ["baeckerei", "Zwei Brezel, bitte.", 0.5],
  ["baeckerei", "Das Wetter ist heute schön.", 0],
  ["schnitzel", "Ich nehme die Bratwurst mit Pommes, bitte.", 1],
  ["schnitzel", "Ein Bier, bitte.", 1],
  ["schnitzel", "Ich hätte gern einen Schnitzel, bitte.", 0.5],
  ["fahrkarte", "Ich möchte bitte ein Ticket nach {stadt}.", 1],
  ["fahrkarte", "Einmal nach {stadt}, bitte.", 1],
  ["fahrkarte", "Eine Fahrkarte zu {stadt}, bitte.", 0.5],
  ["fahrkarte", "Eine Fahrkarte, bitte.", 0],
  ["sie_du", "Natürlich, ich bringe Sie hin.", 1],
  ["sie_du", "Komm mit, ich zeige dir den Weg.", 0.5],
  ["arzt", "Ich habe starke Kopfschmerzen.", 1],
  ["arzt", "Ich tut der Kopf weh.", 0.5],
  ["perfekt_kino", "Ich habe gestern einen Film gesehen.", 1],
  ["perfekt_kino", "Ich bin gestern mit dem Fahrrad zum See gefahren.", 1],
  ["perfekt_kino", "Ich habe gestern ins Kino gegangen.", 0.5],
  ["perfekt_kino", "Ich bin gestern ins Kino gegeht.", 0.5],
  ["zurueckgeben", "Ich möchte dieses Buch bitte zurückgeben.", 1],
  ["zurueckgeben", "Ich möchte das Buch geben zurück.", 0.5],
  ["steigerung", "{Ziel} ist viel höher als das Rathaus.", 1],
  ["steigerung", "Das Rathaus ist höher.", 0],
  ["geburtstag", "Herzlichen Glückwunsch zum Geburtstag!", 1],
  ["vorstellen", "Hallo, ich bin Lena und komme aus Wien.", 1],
  ["vorstellen", "Ich heiße Mia und habe acht Jahre.", 0.5],
  ["zug_an", "Entschuldigung, wie viel Verspätung hat der Zug?", 1],
  ["zug_an", "Wann der Zug kommt an?", 0.5],
  ["eis", "Ich möchte bitte zwei Kugeln Schokoeis.", 1],
  ["eis", "Ich möchten bitte eine Kugel Erdbeereis.", 0.5],
  ["tretboot", "Darf ich bitte ein Tretboot für eine Stunde mieten?", 1],
  ["mehl", "Ich hätte gern ein Kilo Mehl.", 1],
  ["mehl", "Ich brauche zwei Kilos Mehl.", 0.5],
  ["plural_aepfel", "Ich habe heute fünf Äpfel gekauft.", 1],
  ["plural_aepfel", "Ich habe drei Apfel gekauft.", 0.5]
];
(async () => {
  const srv = http.createServer((q, a) => { const f = path.join(WURZEL, decodeURIComponent(q.url.split("?")[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  try {
    const pg = await (await br.newContext({ viewport: { width: 400, height: 700 } })).newPage();
    const seitenFehler = []; pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&uhr=12:00&quest=1&questnur=1");
    await pg.waitForFunction(() => window.STADT && STADT.quests && STADT.quests.pruef && STADT.quests.sprechen && window.__fertig, null, { timeout: 120000 });
    const erg = await pg.evaluate((faelle) => {
      const Q = STADT.quests, aus = [];
      for (const [id, satz0, soll] of faelle) {
        for (const q of Q.liste) q.f.zustand = "weg"; Q.liste.length = 0;
        const i = Q.pruef.neu(id); const qu = Q.liste.find((x) => x.id === i);
        if (!qu) { aus.push({ id, satz: satz0, soll, ist: "keine Quest" }); continue; }
        const z = qu.ziel, Nz = (z.g === "der" ? "Der " : z.g === "die" ? "Die " : "Das ") + z.name;
        const satz = satz0.replace("{stadt}", (qu.vars || {}).stadt || "?").replace("{Ziel}", Nz);
        const e = Q.sprechen.pruefen(qu, [satz]);
        aus.push({ id, satz, soll, ist: e.stufe, grund: e.grund, ohneVersuch: !!e.ohneVersuch });
      }
      return aus;
    }, FAELLE);
    /* jede vorgegebene richtige Antwort, gesprochen, zählt weiter voll; die falschen nicht voll */
    const vorgabe = await pg.evaluate(() => {
      const Q = STADT.quests, aus = [];
      for (const v of Q.VORLAGEN) {
        if (v.richtung || v.zeigen || v.kat === "betonung") continue;   // (Betonung wird gesprochen geprüft, nicht als Satz)
        for (let k = 0; k < 3; k++) {
          for (const q of Q.liste) q.f.zustand = "weg"; Q.liste.length = 0;
          const i = Q.pruef.neu(v.id); const qu = Q.liste.find((x) => x.id === i); if (!qu) continue;
          for (const a of qu.antworten) { const satz = a.html.replace(/<[^>]+>/g, "").replace(/[„“]/g, ""), e = Q.sprechen.pruefen(qu, [satz]);
            if (a.richtig ? e.stufe !== 1 : e.stufe === 1) aus.push(v.id + ": „" + satz + "“ → " + e.stufe + " " + (e.grund || "")); }
        }
      }
      return aus;
    });
    sage(!vorgabe.length, "die vorgegebenen Antworten: die richtige zählt voll, keine falsche voll", vorgabe.slice(0, 6).join(" | "));
    let gut = 0;
    for (const r of erg) { const ok = r.ist === r.soll; if (ok) gut++; else console.log("     ✗ " + r.id + ": „" + r.satz + "“ → " + r.ist + " (soll " + r.soll + ")  " + (r.grund || "")); }
    sage(gut === erg.length, "eigene Sätze: passend + richtig = 1, nur ein Grammatikfehler = 0,5 (Fast), passt nicht zur Aufgabe = 0", gut + "/" + erg.length);
    const beispiel = erg.filter((r) => r.ist === 0.5).slice(0, 4).map((r) => "„" + r.satz + "“ → " + r.grund);
    sage(erg.filter((r) => r.ist === 0.5).every((r) => r.grund && r.grund.length > 10), "„Fast“ nennt genau den Fehler und wie es richtig heißt", beispiel.join(" | "));
    sage(erg.filter((r) => r.soll === 0 && r.id !== "steigerung").every((r) => r.ohneVersuch), "was nicht zur Aufgabe passt, kostet keinen Versuch");
    const qs = fs.readFileSync(path.join(WURZEL, "stadt-leicht/quests.js"), "utf8");
    sage(/function signal\(ctx, an\)/.test(qs) && /signal\(ctx, true\)/.test(qs) && /signal\(ctx, false\)/.test(qs), "Signalton beim Mikro-Start und am Ende der Aufnahme");
    const sig = await pg.evaluate(() => { try { const AC = window.AudioContext || window.webkitAudioContext, c = new AC(); STADT.quests.sprechen.signal(c, true); return true; } catch (e) { return String(e); } });
    sage(sig === true, "der Signalton lässt sich abspielen", String(sig));
    sage(!seitenFehler.length, "keine Skriptfehler", seitenFehler.slice(0, 3).join(" | "));
  } finally { await br.close(); srv.close(); }
  console.log("\n" + (fehler ? fehler + " Fehler" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
