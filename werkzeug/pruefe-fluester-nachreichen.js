/* PRÜFT: FLÜSTERN FOLGT DER PERSON, NICHT DEM RAUM.
   ---------------------------------------------------------------
   GEWUENSCHT: „Wenn ich jemandem auf sein Fluestern antworte und
   derjenige ist im selben Moment dabei zu gehen und kann die
   Nachricht nicht mehr lesen — dann moechte ich, dass er sie spaeter
   trotzdem sieht … egal in welchem Raum sie ist, chronologisch,
   unabhaengig vom Raum."

   Zwei Konten lassen sich hier nicht anmelden. Gemessen wird deshalb
   genau das, was das Geraet tut: WELCHE Abfrage es stellt und WAS es
   aus den Zeilen macht, die zurueckkommen. Die Datenbank selbst ist
   getrennt geprueft (siehe supabase/klassenzimmer-chat.sql: eine
   gefluesterte Zeile geben die Regeln nur an Absender und Empfaenger
   heraus). */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 780 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2300);

  const erg = await pg.evaluate(async () => {
    const ICH = "11111111-1111-1111-1111-111111111111";
    const ANDERE = "22222222-2222-2222-2222-222222222222";
    const notiert = { abfrage: null, eingefuegt: null };
    /* Eine Attrappe der Datenbank: sie merkt sich, WAS gefragt wurde,
       und gibt drei Zeilen zurueck — eine aus einem anderen Raum. */
    const zeilen = [
      { id: 7, raum: "langeweile", autor: ANDERE, name: "Emmy", text: "bist du noch da?",
        farbe: "", farbe_name: "", bild: "", an_id: ICH, an_name: "Xander",
        quelle_id: "abc", erstellt: "2026-09-18T10:00:00Z" },
      { id: 8, raum: "klassenzimmer", autor: ICH, name: "Xander", text: "ja, gleich",
        farbe: "", farbe_name: "", bild: "", an_id: ANDERE, an_name: "Emmy",
        quelle_id: "def", erstellt: "2026-09-18T10:01:00Z" }
    ];
    const bauer = () => {
      const zustand = { filter: [] };
      const b = {
        select: (f) => { zustand.select = f; return b; },
        eq: (k, v) => { zustand.filter.push(["eq", k, v]); return b; },
        is: (k, v) => { zustand.filter.push(["is", k, v]); return b; },
        not: (k, op, v) => { zustand.filter.push(["not", k, op, v]); return b; },
        or: (v) => { zustand.filter.push(["or", v]); return b; },
        neq: (k, v) => { zustand.filter.push(["neq", k, v]); return b; },
        order: () => b,
        limit: (n) => { zustand.limit = n; return b; },
        insert: (r) => { notiert.eingefuegt = r; return { then: (ok) => { ok({ error: null }); return { catch: () => {} }; } }; },
        then: (ok) => { notiert.abfrage = zustand; return Promise.resolve(ok({ data: zeilen.slice().reverse(), error: null })); }
      };
      return b;
    };
    Backend.zugang = () => ({ from: () => bauer() });
    Backend.currentUser = () => ({ id: ICH });

    const geladen = await LiveChat.pruefFluesternLaden();
    LiveChat.pruefFluesternSichern({ id: "kfremd", name: "Emmy", konto: ANDERE }, "bis gleich", "xyz");
    return {
      filter: notiert.abfrage ? notiert.abfrage.filter : [],
      zeilen: geladen.map((n) => ({ id: n.id, text: n.text, art: n.art, eigen: n.eigen,
                                    woher: n.woher, zeit: n.zeit })),
      eingefuegt: notiert.eingefuegt
    };
  });

  let fehler = 0;
  const ok = (bedingung, was, zusatz) => {
    if (!bedingung) fehler++;
    console.log("  " + (bedingung ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : ""));
  };
  console.log("\n  WAS GEFRAGT WIRD");
  const f = JSON.stringify(erg.filter);
  ok(f.includes('["not","an_id","is",null]'), "nur Zeilen mit Anschrift");
  ok(f.includes("an_id.eq.11111111") && f.includes("autor.eq.11111111"),
     "an mich ODER von mir — aus allen Räumen");
  ok(!f.includes('["eq","raum"'), "kein Raumfilter (das ist der ganze Punkt)");

  console.log("\n  WAS DARAUS WIRD");
  const a = erg.zeilen[0], b = erg.zeilen[1];
  ok(erg.zeilen.length === 2, "zwei Zeilen, chronologisch",
     erg.zeilen.map((z) => new Date(z.zeit).toISOString().slice(11, 16)).join(" → "));
  ok(a && a.id === "abc" && b && b.id === "def",
     "die Kennung des Zurufs gewinnt — nichts steht doppelt da");
  ok(a && a.text === "bist du noch da?" && !a.eigen, "von Emmy: nur ihr Text", a ? "„" + a.text + "“" : "");
  ok(b && b.text === "an Emmy: ja, gleich" && b.eigen, "von mir: mit Anschrift", b ? "„" + b.text + "“" : "");
  ok(a && a.woher === "Langeweile", "aus einem anderen Raum steht dabei, woher",
     a ? "„(aus " + a.woher + ")“" : "");

  console.log("\n  WAS ABGELEGT WIRD");
  const e = erg.eingefuegt || {};
  ok(e.art === "fluester", "als Flüstern gekennzeichnet");
  ok(e.an_id === "22222222-2222-2222-2222-222222222222", "mit der Anschrift des Empfängers");
  ok(e.an_name === "Emmy", "mit seinem Namen (damit „an Emmy:“ dastehen kann)");
  ok(e.quelle_id === "xyz", "mit der Kennung des Zurufs");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Das Flüstern findet die Person überall.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
