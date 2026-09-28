#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 811: TIERE IM DORF (KÜHE, SCHWEINE, HÜHNER)
   ---------------------------------------------------------------------
   XANDER: „Tiere im Dorf: Hühner, Kühe, Schweine – nachts nicht
   draußen".
   Geprüft (stadt-leicht.html?demo=1, Telefon 390 × 844):
     • tagsüber gibt es Tiere (stadt-leicht/tiere.js): 3–4 Kühe auf einer
       Weide und 2–3 Schweine im Auslauf beim Kuhstall, 5–7 Hühner mit
       einem Hahn um den Hühnerstall; Weide und Auslauf haben einen
       gebackenen Zaun (d_zaun) und liegen auf freier Wiese – nicht auf
       Wegen, Wasser, Häusern;
     • zwei Minuten lang (Bewegung vorgespult): jedes Tier bleibt im
       Gehege, steht nie auf Weg, Wasser oder Haus, keine zwei überlappen,
       sie gehen umher und grasen / wühlen / picken;
     • die Laufblätter sind im richtigen Maßstab neben den Leuten (Kuh
       länger als ein Mensch hoch, Huhn ein Viertel so hoch) und werden
       wirklich gemalt (Bildpunkte ändern sich);
     • nachts (zeit=nacht) ist keines draußen; in der Dämmerung (uhr=17.6)
       gehen sie zum Stalltor und verschwinden; am Morgen kommen sie
       wieder heraus ins Gehege;
     • im kleinen Rahmen (mini=1) und im Sparmodus (spar=1) halb so viele,
       im kleinen Rahmen nur Zwergblätter (_z);
     • keine Seitenfehler.
   AUFRUF: node werkzeug/pruefe-811-tiere.js
     WURZEL=/pfad (anderer Stand, z. B. Gegenprobe), BILD=/pfad/praefix (Bildschirmfotos)
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };

/* im Browser: Bewegung vorspulen (die echte Bildschleife anhalten, damit sich die Uhren nicht mischen) */
const VORSPULEN = `(sek, jede, pruef) => {
  const L = STADT.leicht; L.still = true;
  const T = STADT.tiere; let t = (T.__uhr || performance.now()) + 50; const aus = [];
  for (let k = 0; k * 0.05 < sek; k++, t += 50) { T.bewegen(t); if (pruef && k % Math.round(jede / 0.05) === 0) aus.push(pruef()); }
  T.__uhr = t; return aus;
}`;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const seite = async (query, vp) => {
    const pg = await br.newPage({ viewport: vp || { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
    pg.setDefaultTimeout(120000);
    pg.fehler = []; pg.geladen = [];
    pg.on("pageerror", (e) => pg.fehler.push(e.message));
    pg.on("requestfinished", (r) => pg.geladen.push(r.url()));
    await pg.goto(basis + "?demo=1&" + query, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(1500);
    return pg;
  };
  const foto = async (pg, name) => { if (BILD) await pg.screenshot({ path: BILD + "-" + name + ".png" }); };
  const spule = (pg, sek, jede, pruef) => pg.evaluate(`(${VORSPULEN})(${sek}, ${jede || 1}, ${pruef || "null"})`);
  /* Zustand eines Tiers prüfen: im Gehege, nicht auf Weg/Wasser/Haus, Abstand zu den anderen */
  const LAGE = `() => {
    const T = STADT.tiere, B = STADT.boden, SZ = STADT.szene;
    const kl = !!(STADT.bilder.spar || STADT.bilder.nurKlein || document.body.classList.contains("lk-mini-modus"));
    const haeuser = SZ.objekte.filter((o) => (o.art === "haus" || o.art === "wunder" || o.art === "kulisse") && !o.versteckt && !SZ.flach(o)).map((o) => SZ.ecken(o, 0));
    const innen = (p, q) => { let vz = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4], k = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); if (k) { const s = k > 0 ? 1 : -1; if (vz && s !== vz) return false; vz = s; } } return true; };
    const aus = { n: 0, draussen: 0, weg: 0, wasser: 0, haus: 0, ueberlapp: 0, schlimm: [], tun: {} };
    const da = T.liste.filter((t) => t.modus === "frei" && (!kl || !t.voll));
    for (const t of da) {
      aus.n++; aus.tun[t.tun] = (aus.tun[t.tun] || 0) + 1;
      const g = t.g;
      let drin;
      if (g.hof) drin = Math.hypot(t.x - g.stall.x, t.y - g.stall.y) <= g.RAD + 0.01 && g.frei(t.x, t.y);
      else { const dx = t.x - g.R.m[0], dy = t.y - g.R.m[1]; drin = Math.abs(dx) <= g.R.hw - 0.3 && Math.abs(dy) <= g.R.hd - 0.3; }
      if (!drin) { aus.draussen++; aus.schlimm.push(t.art + " außerhalb " + t.x.toFixed(1) + "," + t.y.toFixed(1)); }
      if (B.wert(t.x, t.y, 0) > 0.3) { aus.weg++; aus.schlimm.push(t.art + " auf dem Weg"); }
      if (B.wert(t.x, t.y, 1) > 0.1) { aus.wasser++; aus.schlimm.push(t.art + " im Wasser"); }
      if (haeuser.some((q) => innen([t.x, t.y], q))) { aus.haus++; aus.schlimm.push(t.art + " im Haus"); }
    }
    for (let i = 0; i < da.length; i++) for (let j = i + 1; j < da.length; j++) if (da[i].g === da[j].g && T.abstand(da[i], da[j]) < -0.02) { aus.ueberlapp++; aus.schlimm.push(da[i].art + "/" + da[j].art + " überlappen"); }
    aus.pos = T.liste.map((t) => [t.x, t.y]);
    return aus;
  }`;

  console.log("\nTAGSÜBER: WER, WO, WIE VIELE\n");
  const pg = await seite("jahr=herbst&zeit=tag");
  sage(!pg.fehler.length, "lädt ohne Seitenfehler", pg.fehler.join(" | "));
  const da = await pg.evaluate(() => !!(window.STADT && STADT.tiere && STADT.tiere.bewegen && STADT.tiere.sichtbar));
  sage(da, "es gibt die Tiere (STADT.tiere mit bewegen und sichtbar)");
  if (!da) { await br.close(); srv.close(); console.log("\n" + fehler + " FEHLER\n"); process.exit(1); }
  await spule(pg, 2);
  const S = await pg.evaluate(() => {
    const T = STADT.tiere, SZ = STADT.szene, B = STADT.boden;
    const zahl = (a) => T.liste.filter((t) => t.art === a).length;
    const weide = T.gehege.find((g) => g.art === "kuh"), auslauf = T.gehege.find((g) => g.art === "schwein"), hof = T.gehege.find((g) => g.hof);
    /* Gehegeflächen: nichts von Weg, Wasser, Haus darin */
    const flaeche = (g) => {
      if (!g) return null;
      let weg = 0, wasser = 0, haus = 0, n = 0;
      const haeuser = SZ.objekte.filter((o) => !o.tiere && !SZ.flach(o)).map((o) => SZ.ecken(o, 0));
      const innen = (p, q) => { let vz = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4], k = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); if (k) { const s = k > 0 ? 1 : -1; if (vz && s !== vz) return false; vz = s; } } return true; };
      for (let a = -g.R.hw; a <= g.R.hw; a += 0.5) for (let b = -g.R.hd; b <= g.R.hd; b += 0.5) {
        const x = g.R.m[0] + a, y = g.R.m[1] + b; n++;
        if (B.wert(x, y, 0) > 0.1) weg++; if (B.wert(x, y, 1) > 0.05) wasser++; if (haeuser.some((q) => innen([x, y], q))) haus++;
      }
      return { n: n, weg: weg, wasser: wasser, haus: haus, m: g.R.m.map((v) => +v.toFixed(1)), gr: [g.R.hw * 2, g.R.hd * 2] };
    };
    const stall = SZ.objekte.find((o) => o.art === "haus" && o.spiel === "kuhstall"), hs = SZ.objekte.find((o) => o.art === "haus" && o.spiel === "huehnerstall");
    const zaun = SZ.objekte.filter((o) => o.tiere && o.bild === "d_zaun");
    return { kuh: zahl("kuh"), schwein: zahl("schwein"), huhn: zahl("huhn"), hahn: zahl("hahn"), weide: flaeche(weide), auslauf: flaeche(auslauf), hof: !!hof,
      zaun: zaun.length, zaunDa: zaun.every((z) => !!STADT.bilder.vz["d_zaun_herbst_tag_f_" + STADT.szene.gierFuer("d_zaun", STADT.szene.gierVon(z)) + "_k"]),
      abstStall: weide && stall ? Math.hypot(weide.R.m[0] - stall.x, weide.R.m[1] - stall.y) : null,
      abstHof: hof && hs ? Math.max(...T.liste.filter((t) => t.g === hof).map((t) => Math.hypot(t.x - hs.x, t.y - hs.y))) : null };
  });
  sage(S.kuh >= 3 && S.kuh <= 4, "3–4 Kühe beim Kuhstall", S.kuh + " Kühe");
  sage(S.schwein >= 2 && S.schwein <= 3, "2–3 Schweine im Auslauf", S.schwein + " Schweine");
  sage(S.huhn + S.hahn >= 5 && S.huhn + S.hahn <= 7 && S.hahn === 1, "5–7 Hühner, einer davon der Hahn", S.huhn + " Hennen, " + S.hahn + " Hahn");
  sage(S.zaun >= 8 && S.zaunDa, "Weide und Auslauf sind eingezäunt (gebackener Zaun d_zaun)", S.zaun + " Zaunstücke");
  for (const [n, f] of [["Weide", S.weide], ["Auslauf", S.auslauf]]) sage(!!f && f.weg === 0 && f.wasser === 0 && f.haus === 0, n + " liegt auf freier Wiese (kein Weg, kein Wasser, kein Haus)", f ? JSON.stringify(f) : "fehlt");
  sage(S.abstStall != null && S.abstStall < 30, "die Weide liegt beim Kuhstall", S.abstStall != null ? S.abstStall.toFixed(1) + " m" : "");
  sage(S.hof && S.abstHof < 10, "die Hühner laufen um den Hühnerstall", S.abstHof != null ? "höchstens " + S.abstHof.toFixed(1) + " m" : "");

  console.log("\nZWEI MINUTEN LEBEN IM DORF\n");
  const P = await spule(pg, 120, 1, LAGE);
  const summe = (k) => P.reduce((n, p) => n + p[k], 0);
  sage(P.every((p) => p.n >= 10), "alle Tiere sind draußen", "je Probe " + Math.min(...P.map((p) => p.n)) + "–" + Math.max(...P.map((p) => p.n)));
  sage(summe("draussen") === 0, "jedes Tier bleibt in seinem Gehege", [...new Set(P.flatMap((p) => p.schlimm.filter((s) => /außerhalb/.test(s))))].slice(0, 4).join("; "));
  sage(summe("weg") === 0 && summe("wasser") === 0 && summe("haus") === 0, "keines steht auf Weg, Wasser oder in einem Haus", "Weg " + summe("weg") + ", Wasser " + summe("wasser") + ", Haus " + summe("haus"));
  sage(summe("ueberlapp") === 0, "keine zwei Tiere überlappen", [...new Set(P.flatMap((p) => p.schlimm.filter((s) => /überlappen/.test(s))))].slice(0, 4).join("; "));
  const tun = {}; for (const p of P) for (const k in p.tun) tun[k] = (tun[k] || 0) + p.tun[k];
  sage(tun.gehen > 20 && tun.haltung > 20 && tun.stehen > 20, "sie gehen umher, stehen und grasen / wühlen / picken", JSON.stringify(tun));
  const wege = P[0].pos.map((p, i) => Math.hypot(P[P.length - 1].pos[i][0] - p[0], P[P.length - 1].pos[i][1] - p[1]));
  sage(wege.filter((w) => w > 0.8).length >= 5, "nach zwei Minuten stehen die meisten woanders", wege.map((w) => w.toFixed(1)).join(" "));
  /* Tempo: langsam (Kühe höchstens 1 m/s, Hühner höchstens 0,6 m/s) */
  const tempo = await pg.evaluate(() => { const m = {}; for (const t of STADT.tiere.liste) m[t.art] = Math.max(m[t.art] || 0, t.tempo); return m; });
  sage(tempo.kuh <= 1 && tempo.schwein <= 0.8 && tempo.huhn <= 0.6, "sie gehen langsam", JSON.stringify(tempo));

  console.log("\nIM BILD: GEMALT, IM RICHTIGEN MASSSTAB\n");
  const hin = async (pgx, x, y, s) => { await pgx.evaluate(([x, y, s]) => { const K = STADT.kamera; K.x = x; K.y = y; K.s = s * K.dpr; const L = STADT.leicht; L.unruhe = 3; }, [x, y, s]); };
  const malen = (pgx) => pgx.evaluate(() => { const L = STADT.leicht, SZ = STADT.szene; STADT.boden.zeichnen(performance.now() / 1000, SZ.zeitDaten(), SZ.jahr); SZ.zeichnen(performance.now()); return STADT.tiere.gezeigt || 0; });
  const weideM = await pg.evaluate(() => { const g = STADT.tiere.gehege.find((g) => g.art === "kuh"); return g ? g.R.m : [0, 0]; });
  await hin(pg, weideM[0], weideM[1] + 2, 34); await malen(pg);
  await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(400);
  const gez = await malen(pg);
  const pix = async () => pg.screenshot({ clip: { x: 20, y: 250, width: 350, height: 350 } });
  const mit = await pix();
  await foto(pg, "tag-weide-nah");
  await pg.evaluate(() => { STADT.tiere.__liste = STADT.tiere.liste; STADT.tiere.liste = []; });
  await malen(pg);
  const ohne = await pix();
  await pg.evaluate(() => { STADT.tiere.liste = STADT.tiere.__liste; });
  await malen(pg);
  const unterschied = await pg.evaluate(([a, b]) => new Promise((ok) => {
    const lade = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
    Promise.all([lade(a), lade(b)]).then(([A, Bq]) => {
      const c = document.createElement("canvas"); c.width = A.width; c.height = A.height; const g = c.getContext("2d");
      g.drawImage(A, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data; g.clearRect(0, 0, c.width, c.height); g.drawImage(Bq, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 60) n++;
      ok(n / (da.length / 4));
    });
  }), [mit.toString("base64"), ohne.toString("base64")]);
  sage(gez >= 3, "die Tiere sind im Bild (Laufblätter l_tier_…)", gez + " Tiere");
  sage(unterschied > 0.02, "sie werden wirklich gemalt (Bildpunkte ändern sich ohne sie)", (unterschied * 100).toFixed(1) + " % der Punkte");
  /* Maßstab: Höhe/Länge der gebackenen Figuren (deckende Bildpunkte, ohne Schatten) gegen einen Spaziergänger */
  const mass = await pg.evaluate(() => new Promise((ok) => {
    const LB = STADT.bilder, namen = { kuh: "l_tier_kuh0_herbst_tag", schwein: "l_tier_schwein_herbst_tag", huhn: "l_tier_huhn_herbst_tag", hahn: "l_tier_hahn_herbst_tag", mensch: "l_geher0_herbst_tag" };
    const erg = {}; let offen = 0;
    for (const k in namen) {
      const m = LB.vz[namen[k]]; if (!m) continue; offen++;
      const i = new Image();
      i.onload = () => {
        /* Stehbild (Mensch: Bild 0), Blick zur Seite (Zeile 2 = 90°): Breite und Höhe in Metern */
        const c = document.createElement("canvas"); c.width = m.zw; c.height = m.zh; const g = c.getContext("2d");
        const sp = k === "mensch" ? 0 : m.n - 2;
        g.drawImage(i, sp * m.zw, 2 * m.zh, m.zw, m.zh, 0, 0, m.zw, m.zh);
        const d = g.getImageData(0, 0, m.zw, m.zh).data; let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
        for (let y = 0; y < m.zh; y++) for (let x = 0; x < m.zw; x++) if (d[(y * m.zw + x) * 4 + 3] > 200) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        erg[k] = { b: (x1 - x0 + 1) / m.s, h: (y1 - y0 + 1) / m.s };
        if (--offen === 0) ok(erg);
      };
      i.onerror = () => { if (--offen === 0) ok(erg); };
      i.src = "stadt-leicht/bilder/" + namen[k] + ".webp";
    }
  }));
  /* Soll: der Umriss eines Quaders mit den echten Maßen (Breite x, Länge y von hinten bis vorn, Höhe z), in derselben
     Schrägsicht (Zeile 2: Modell um 90° gedreht) abgebildet. Die Figur füllt ihn nicht ganz (runde Formen, dünne Beine): 65–102 %. */
  const QUADER = { mensch: [0.25, -0.15, 0.15, 1.75], kuh: [0.33, -1.1, 1.35, 1.45], schwein: [0.25, -0.56, 0.8, 0.74], huhn: [0.09, -0.19, 0.18, 0.42], hahn: [0.12, -0.45, 0.22, 0.58] };
  const soll = (q) => { const KX = Math.SQRT1_2, KY = Math.SQRT1_2 / 2, KZ = Math.sqrt(3) / 2; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const x of [-q[0], q[0]]) for (const y of [q[1], q[2]]) for (const z of [0, q[3]]) { const p = -y, qq = x, X = (p - qq) * KX, Y = (p + qq) * KY - z * KZ; x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y); }
    return { b: x1 - x0, h: y1 - y0 }; };
  const anteil = (k) => { if (!mass[k]) return [0, 0]; const S = soll(QUADER[k]); return [mass[k].b / S.b, mass[k].h / S.h]; };
  const passt = (k) => { const [b, h] = anteil(k); return b > 0.65 && b < 1.02 && h > 0.65 && h < 1.02; };
  const txt = (k) => mass[k] ? "Bild " + mass[k].b.toFixed(2) + " × " + mass[k].h.toFixed(2) + " m = " + anteil(k).map((v) => Math.round(v * 100) + " %").join(" / ") + " des Quaders" : "fehlt";
  sage(passt("mensch"), "(Messung geeicht: Spaziergänger 1,75 m)", txt("mensch"));
  sage(passt("kuh"), "Kuh 2,4 m lang, 1,45 m hoch – im Maßstab der Leute", txt("kuh"));
  sage(passt("schwein"), "Schwein 1,3 m lang, 0,74 m hoch", txt("schwein"));
  sage(passt("huhn") && passt("hahn") && mass.hahn.h > mass.huhn.h, "Henne 0,42 m, Hahn 0,58 m hoch", "Henne " + txt("huhn") + "; Hahn " + txt("hahn"));
  /* Blickrichtung passt zur Laufrichtung, auch bei gedrehter Kamera */
  const richt = await pg.evaluate(() => {
    let schlimm = 0, n = 0;
    for (let d = 0; d < 4; d++) {
      STADT.kamera.dreh = d;
      for (const p of STADT.tiere.sichtbar(STADT.szene.zeitDaten())) {
        const g = p.reihe * Math.PI / 4, v1 = [-Math.sin(g), Math.cos(g)], v2 = STADT.drehXY(Math.cos(p.tier.h), Math.sin(p.tier.h), d);
        schlimm = Math.max(schlimm, Math.acos(Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1]))) * 180 / Math.PI); n++;
      }
    }
    STADT.kamera.dreh = 0; return { schlimm: schlimm, n: n };
  });
  sage(richt.n > 0 && richt.schlimm <= 22.6, "jedes Tier schaut in seine Richtung (8 Richtungen, alle Kameradrehungen)", richt.n + " Ansichten, höchstens " + richt.schlimm.toFixed(1) + "° daneben");
  const hofM = await pg.evaluate(() => { const g = STADT.tiere.gehege.find((g) => g.hof); return g ? g.mitte : [0, 0]; });
  await hin(pg, hofM[0], hofM[1] + 1, 44); await malen(pg);
  await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(300); await malen(pg);
  await foto(pg, "tag-huehner-nah");
  await hin(pg, weideM[0] + 4, weideM[1] - 4, 14); await malen(pg);
  await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(300); await malen(pg);
  await foto(pg, "tag-ueberblick");

  console.log("\nNACHT, DÄMMERUNG, MORGEN\n");
  /* Morgen: aus der Nacht wieder heraus (SZ.zeit umstellen) */
  await pg.evaluate(() => { STADT.szene.zeitAuto = false; STADT.szene.zeit = "nacht"; });
  await spule(pg, 3);
  const nacht1 = await pg.evaluate(() => ({ drin: STADT.tiere.liste.filter((t) => t.modus === "drin").length, n: STADT.tiere.liste.length, zu: STADT.tiere.sichtbar(STADT.szene.zeitDaten()).length }));
  sage(nacht1.drin === nacht1.n && nacht1.zu === 0, "wird es Nacht, sind alle im Stall", nacht1.drin + " von " + nacht1.n + " drin, " + nacht1.zu + " zu sehen");
  await pg.evaluate(() => { STADT.szene.zeit = "tag"; });
  const morgen = await spule(pg, 150, 5, LAGE);
  const ende = morgen[morgen.length - 1];
  sage(ende.n === nacht1.n, "morgens kommen alle wieder heraus", ende.n + " von " + nacht1.n);
  sage(ende.draussen === 0 && ende.weg === 0 && ende.wasser === 0 && ende.haus === 0 && ende.ueberlapp === 0, "… und sind wieder in ihren Gehegen", ende.schlimm.join("; "));
  await pg.close();

  const pn = await seite("jahr=winter&zeit=nacht");
  await spule(pn, 5);
  const N = await pn.evaluate(() => { const T = STADT.tiere; const Z = STADT.szene.zeitDaten(); return { n: T.liste.length, drin: T.liste.filter((t) => t.modus === "drin").length, zu: T.sichtbar(Z).length, nacht: Z.nacht, zaun: (T.zaun || []).length }; });
  sage(N.n > 0 && N.drin === N.n && N.zu === 0, "nachts (zeit=nacht) ist kein Tier draußen", N.drin + " von " + N.n + " im Stall, " + N.zu + " zu sehen (Nachtgrad " + N.nacht + ")");
  sage(N.zaun > 0, "der Zaun steht auch nachts");
  sage(!pn.fehler.length, "nachts ohne Seitenfehler", pn.fehler.join(" | "));
  const wm = await pn.evaluate(() => { const g = STADT.tiere.gehege.find((g) => g.art === "kuh"); return g ? g.R.m : [0, 0]; });
  await hin(pn, wm[0], wm[1] + 2, 30); await pn.waitForTimeout(1500); await foto(pn, "nacht-weide");
  await pn.close();

  /* Dämmerung nach der Uhr (17:36 → Nachtgrad ≈ 0,41): alle gehen zum Tor und verschwinden */
  const pd = await seite("jahr=herbst&uhr=17.6");
  const D0 = await pd.evaluate(() => { const T = STADT.tiere; return { nacht: STADT.szene.zeitDaten().nacht, n: T.liste.length, tuer: T.liste.map((t) => Math.hypot(t.x - t.g.tuer[0], t.y - t.g.tuer[1])) }; });
  const dm = await pd.evaluate(() => { const g = STADT.tiere.gehege.find((g) => g.art === "kuh"); return g ? g.tuer : [0, 0]; });
  await spule(pd, 45);
  await hin(pd, dm[0], dm[1] + 2, 24); await malen(pd); await pd.waitForTimeout(1200); await malen(pd); await foto(pd, "daemmerung");
  const D1 = await pd.evaluate(() => { const T = STADT.tiere; return { heim: T.liste.filter((t) => t.modus === "heim").length, drin: T.liste.filter((t) => t.modus === "drin").length, zeit: STADT.tiere.sichtbar(STADT.szene.zeitDaten()).map((p) => p.img.src.split("/").pop().split("?")[0]) }; });
  await spule(pd, 240);
  const D2 = await pd.evaluate(() => { const T = STADT.tiere; return { drin: T.liste.filter((t) => t.modus === "drin").length, zu: T.sichtbar(STADT.szene.zeitDaten()).length }; });
  sage(D0.nacht > 0.3 && D0.nacht < 0.6, "Dämmerung nach der Uhr (uhr=17.6)", "Nachtgrad " + D0.nacht.toFixed(2));
  sage(D1.heim + D1.drin > 0, "in der Dämmerung gehen sie heim zum Stalltor", D1.heim + " unterwegs, " + D1.drin + " schon drin");
  sage(D1.zeit.every((n) => /_abend/.test(n)), "in der Dämmerung mit dem Dämmerungsblatt", D1.zeit.slice(0, 3).join(", "));
  sage(D2.drin === D0.n && D2.zu === 0, "nach einigen Minuten sind alle im Stall", D2.drin + " von " + D0.n);
  sage(!pd.fehler.length, "Dämmerung ohne Seitenfehler", pd.fehler.join(" | "));
  await pd.close();

  console.log("\nKLEINER RAHMEN UND SPARMODUS: HALB SO VIELE\n");
  const pm = await seite("mini=1&eingebettet=1&jahr=herbst&zeit=tag", { width: 330, height: 206 });
  await pm.evaluate(() => { const K = STADT.kamera, g = STADT.tiere.gehege.find((g) => g.art === "kuh"); if (g) { K.x = g.R.m[0]; K.y = g.R.m[1]; } K.s = 8 * K.dpr; STADT.leicht.unruhe = 3; });
  await pm.waitForTimeout(2500);
  await pm.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  await pm.waitForTimeout(600);
  const mm = await pm.evaluate(() => { const T = STADT.tiere; const l = T.sichtbar(STADT.szene.zeitDaten()); return { n: T.liste.length, gez: l.length, namen: [...new Set(l.map((p) => p.img.src.split("/").pop().split("?")[0]))] }; });
  const tierDateien = [...new Set(pm.geladen.filter((u) => /l_tier_/.test(u)).map((u) => decodeURIComponent(new URL(u).pathname).replace(/^\//, "")))];
  const kb = tierDateien.reduce((n, p) => n + fs.statSync(path.join(WURZEL, p)).size / 1024, 0);
  sage(mm.gez > 0 && mm.gez <= Math.ceil(mm.n / 2) + 1, "im kleinen Rahmen halb so viele Tiere", mm.gez + " von " + mm.n + " zu sehen");
  sage(tierDateien.length > 0 && tierDateien.every((p) => /_z\.webp$/.test(p)) && kb < 120, "dort nur Zwergblätter (_z)", kb.toFixed(1) + " KB: " + tierDateien.map((p) => p.split("/").pop()).join(", "));
  sage(!pm.fehler.length, "im kleinen Rahmen ohne Seitenfehler", pm.fehler.join(" | "));
  await foto(pm, "mini");
  await pm.close();
  const ps = await seite("spar=1&jahr=herbst&zeit=tag");
  await spule(ps, 2);
  const sp = await ps.evaluate(`(() => { const T = STADT.tiere; const L = (${LAGE})(); return { n: T.liste.length, aktiv: L.n }; })()`);
  sage(sp.aktiv > 0 && sp.aktiv <= Math.ceil(sp.n / 2) + 1, "im Sparmodus halb so viele", sp.aktiv + " von " + sp.n);
  sage(!ps.fehler.length, "Sparmodus ohne Seitenfehler", ps.fehler.join(" | "));
  await ps.close();

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
