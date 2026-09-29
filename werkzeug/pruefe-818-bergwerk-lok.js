#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 818: BERGWERK MIT STOLLEN, DIE SCHÖNE ALTE LOK, KLANG
   ---------------------------------------------------------------------
   XANDER (wörtlich): „unser Bergwerk ist keine schöne steinmine mehr wie
   sie vorher vom Logo … das ist nur so ein Gestell so ein Gerüst … ich
   möchte dieses höhlenartige haben dass man instinktiv weiß da geht's in
   das Bergwerk hinein" – „unser Lok sieht nicht mehr so schön wie vorher
   aus … diese schönen klassischen Wagen daran und irgendwie scheint sie
   nur die eine Richtung zu fahren … sie muss ja wegfahren und …
   ankommen" – „unsere Lokomotive hat noch keinen Klang".
   Geprüft (stadt-leicht.html, Beispielstadt ?demo=1):
   BERGWERK
     • neues Bild (g_bergstollen statt g_bergwerk) in allen 8 Winkeln,
       Winter/Herbst, Tag/Nacht, groß/klein/Zwerg, dazu die Bauphasen
     • in der Stadt geladen und gezeichnet
     • der Stolleneingang ist dunkel (Bildpunkte im gebackenen Bild und
       auf der Leinwand), der Fels drumherum hell
     • nachts leuchtet die Grubenlampe (warmes Glas, Licht im Verzeichnis)
   LOK
     • Blätter l_bahn_reiselok (6 Radstellungen), Tender, Abteilwagen;
       die alten Güterzugblätter sind weg
     • echte Uhr vorgespult über zwei Umläufe: der Zug fährt einmal von
       links nach rechts und einmal von rechts nach links durchs Bild,
       hält jedes Mal am Bahnhof, fährt in seiner Richtung weiter hinaus;
       die Lok ist vorn und schaut in Fahrtrichtung (andere Blattzeile)
     • die Räder drehen sich (mehrere Radstellungen während der Fahrt)
   KLANG (Web Audio als Stub gezählt, ?ton=1)
     • Einfahrt: Pfiff, Bremsquietschen; Halt: Zischen; Abfahrt: Pfiff
       kurz–lang, dann Schnaufen im Takt; Schienenstöße; Web-Audio-
       Knoten werden wirklich angelegt und gestartet
     • leiser, je weiter weg die Kamera ist; stumm mit ?ton=0 und bei
       Lautstärke „aus"; im eingebetteten Rahmen nur, wenn das Spiel Töne
       an hat (DMA_SPIEL_BRUECKE.toeneAn)
   ALLGEMEIN: keine Seitenfehler; im kleinen Rahmen nur kleine Bilder
     (< 300 KB, keine großen _g/_m, keine vollen Lokblätter).
   AUFRUF: node werkzeug/pruefe-818-bergwerk-lok.js
     WURZEL=/pfad (Gegenprobe mit altem Stand), BILD=/pfad/praefix (Fotos)
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };

/* Web-Audio-Stub: zählt, was angelegt und gestartet wird (läuft sofort, ohne Berührung) */
const STUB = `(() => {
  const Z = window.__tonZaehler = { ctx: 0, osc: 0, quelle: 0, filter: 0, gain: 0, start: 0, resume: 0 };
  const knoten = (art) => { const n = { connect() { return n; }, disconnect() {}, start() { Z.start++; }, stop() {},
    frequency: param(), gain: param(), Q: param(), pan: param(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param(), type: "", buffer: null, loop: false }; return n; };
  function param() { return { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }; }
  class AC {
    constructor() { Z.ctx++; this.state = "running"; this.sampleRate = 22050; this.destination = knoten(); }
    get currentTime() { return performance.now() / 1000; }
    resume() { Z.resume++; return Promise.resolve(); }
    createGain() { Z.gain++; return knoten(); }
    createOscillator() { Z.osc++; return knoten(); }
    createBufferSource() { Z.quelle++; return knoten(); }
    createBiquadFilter() { Z.filter++; return knoten(); }
    createStereoPanner() { return knoten(); }
    createDynamicsCompressor() { return knoten(); }
    createBuffer(k, n) { const d = new Float32Array(n); return { getChannelData: () => d }; }
  }
  window.AudioContext = AC; window.webkitAudioContext = AC;
})();`;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    /* eine kleine Elternseite wie das Spiel: DMA_SPIEL_BRUECKE.toeneAn() und die Stadt im Rahmen */
    if (p === "/__eltern.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end('<!doctype html><meta charset="utf-8"><script>window.__an = true; window.DMA_SPIEL_BRUECKE = { toeneAn: () => window.__an };</script><iframe id="r" src="stadt-leicht.html?eingebettet=1&mini=1&demo=1" style="width:330px;height:206px;border:0"></iframe>'); }
    if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const alleFehler = [];
  const seite = async (query, vp, stub) => {
    const pg = await br.newPage({ viewport: vp || { width: 900, height: 700 } });
    pg.setDefaultTimeout(120000);
    pg.fehler = []; pg.geladen = [];
    pg.on("pageerror", (e) => { pg.fehler.push(e.message); alleFehler.push(e.message); });
    pg.on("requestfinished", (r) => pg.geladen.push(r.url()));
    if (stub) await pg.addInitScript(STUB);
    await pg.goto(basis + "/stadt-leicht.html?demo=1&" + query, { waitUntil: "load" });
    await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(600);
    return pg;
  };
  const warteBilder = (pg) => pg.waitForFunction(() => window.STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});

  /* ================= BERGWERK ================= */
  console.log("\nDAS BERGWERK: FELSHÜGEL MIT STOLLENEINGANG\n");
  const pg = await seite("jahr=herbst&zeit=tag");
  const vz = await pg.evaluate(() => {
    const ST = window.STADT, D = ST.dorf, v = ST.bilder.vz, b = D.BILD.bergwerk;
    const name = b[0], winkel = [0, 45, 90, 135, 180, 225, 270, 315];
    const fehlt = [];
    for (const j of ["winter", "herbst"]) for (const z of ["tag", "nacht"]) for (const w of winkel) for (const g of ["g", "k", "z"]) { const n = [name, j, z, "f", w, g].join("_"); if (!v[n]) fehlt.push(n); }
    const bau = Object.keys(v).filter((k) => k.indexOf(b[1] + "_") === 0 && /_m$/.test(k)).length;
    const alt = Object.keys(v).filter((k) => /^(g|bau)_bergwerk_/.test(k)).length;
    return { name: name, bau: b[1], fehlt: fehlt.slice(0, 5), nFehlt: fehlt.length, bauBilder: bau, alt: alt };
  });
  sage(vz.name !== "g_bergwerk" && /^g_berg/.test(vz.name), "das Bergwerk hat ein neues Bild (nicht mehr das Gerüst g_bergwerk)", vz.name + " / " + vz.bau);
  sage(vz.nFehlt === 0, "alle 8 Winkel in Winter/Herbst, Tag/Nacht, groß/klein/Zwerg im Verzeichnis", vz.nFehlt ? vz.nFehlt + " fehlen, z. B. " + vz.fehlt.join(", ") : "");
  sage(vz.bauBilder >= 32, "Bauphasen gebacken (4 Winkel × 4 Stufen × Winter/Herbst)", vz.bauBilder + " Baustellenbilder");
  sage(vz.alt === 0, "die alten Gerüst-Bilder sind aus dem Verzeichnis", vz.alt + " alte Einträge");
  /* Kamera aufs Bergwerk */
  const zumBerg = (p, s) => p.evaluate((s) => {
    const ST = window.STADT, SZ = ST.szene, K = ST.kamera, o = SZ.objekte.find((x) => x.spiel === "bergwerk");
    if (!o) return null;
    K.x = o.x + 1; K.y = o.y + 1; K.s = s * K.dpr; K.dreh = 0; ST.leicht.unruhe = 3;
    return { x: o.x, y: o.y, dreh: o.dreh, stufe: o.stufe, bild: o.bild };
  }, s);
  const bo = await zumBerg(pg, 22);
  await pg.waitForTimeout(900); await warteBilder(pg); await pg.waitForTimeout(700);
  /* gezeichnet? und das Mundloch auf der Leinwand dunkel */
  const imBild = await pg.evaluate(() => {
    const ST = window.STADT, SZ = ST.szene, LB = ST.bilder, o = SZ.objekte.find((x) => x.spiel === "bergwerk");
    const e = o && (SZ.sichtbare || []).find((x) => x.o === o);
    if (!e) return { gezeichnet: false };
    const name = e.lagen[0][0], m = e.meta, gier = +(/_f_(\d+)_/.exec(name) || [0, 0])[1];
    const KX = Math.SQRT1_2, KY = Math.SQRT1_2 * 0.5, KZ = Math.sqrt(3) / 2, r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const bildPunkt = (x, y, z) => { const a = x * c - y * sn, b = x * sn + y * c; return [m.ax + (a - b) * KX * m.s, m.ay + (a + b) * KY * m.s - z * KZ * m.s]; };
    const loch = bildPunkt(-0.3, 1.24, 1.1);
    const cv = document.getElementById("lDinge"), g = cv.getContext("2d");
    const X = e.X + (loch[0] - m.ax) * e.k, Y = e.Y + (loch[1] - m.ay) * e.k;
    const d = g.getImageData(Math.round(X) - 3, Math.round(Y) - 3, 7, 7).data;
    let hl = 0; for (let i = 0; i < d.length; i += 4) hl += (d[i] + d[i + 1] + d[i + 2]) / 3; hl /= d.length / 4;
    /* Vergleich: Mittel über den ganzen Hügel */
    const w = Math.round(m.w * e.k), h = Math.round(m.h * e.k), x0 = Math.round(e.X - m.ax * e.k), y0 = Math.round(e.Y - m.ay * e.k);
    const D2 = g.getImageData(Math.max(0, x0), Math.max(0, y0), Math.min(cv.width, w), Math.min(cv.height, h)).data;
    let s = 0, n = 0; for (let i = 0; i < D2.length; i += 16) { s += (D2[i] + D2[i + 1] + D2[i + 2]) / 3; n++; }
    return { gezeichnet: LB.fertig(name), name: name, loch: Math.round(hl), mittel: Math.round(s / Math.max(1, n)) };
  });
  sage(!!bo && imBild.gezeichnet && imBild.name.indexOf(vz.name) === 0, "in der Stadt geladen und gezeichnet", JSON.stringify({ lage: imBild.name, platz: bo }));
  sage(imBild.gezeichnet && imBild.loch < 45 && imBild.loch < imBild.mittel * 0.5, "auf der Leinwand: der Stolleneingang ist dunkel, der Hügel drumherum hell", JSON.stringify({ loch: imBild.loch, huegel: imBild.mittel }));
  if (BILD) await pg.screenshot({ path: BILD + "-bergwerk-tag.png" });
  /* im gebackenen Bild: Mundloch dunkel, Grubenlampe nachts warm */
  const back = await pg.evaluate(async (name) => {
    const v = window.STADT.bilder.vz, KX = Math.SQRT1_2, KY = Math.SQRT1_2 * 0.5, KZ = Math.sqrt(3) / 2;
    const lade = (n) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = "stadt-leicht/bilder/" + n + ".webp"; });
    const probe = async (n, pkt, gier) => {
      const m = v[n], img = await lade(n); if (!img || !m) return null;
      const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height; const g = cv.getContext("2d"); g.drawImage(img, 0, 0);
      const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
      const a = pkt[0] * c - pkt[1] * sn, b = pkt[0] * sn + pkt[1] * c, X = Math.round(m.ax + (a - b) * KX * m.s), Y = Math.round(m.ay + (a + b) * KY * m.s - pkt[2] * KZ * m.s);
      const d = g.getImageData(X - 4, Y - 4, 9, 9).data; let hl = 0, warm = 0;
      for (let i = 0; i < d.length; i += 4) { hl += (d[i] + d[i + 1] + d[i + 2]) / 3; if (d[i] > 225 && d[i + 1] > 170 && d[i + 2] < 175 && d[i + 3] > 200) warm++; }
      const A = g.getImageData(0, 0, cv.width, cv.height).data; let s = 0, n2 = 0; for (let i = 0; i < A.length; i += 32) if (A[i + 3] > 200) { s += (A[i] + A[i + 1] + A[i + 2]) / 3; n2++; }
      return { hell: Math.round(hl / 81), warm: warm, mittel: Math.round(s / Math.max(1, n2)), l: (m.l || []).length, lampe: (m.l || []).some((l) => /255,196,120/.test(l[3])) };
    };
    return {
      loch: await probe(name + "_herbst_tag_f_315_g", [-0.3, 1.24, 1.1], 315),
      lochW: await probe(name + "_winter_tag_f_0_g", [-0.3, 1.24, 1.1], 0),
      lampeNacht: await probe(name + "_winter_nacht_f_315_g", [-1.92, 1.72 + 0.11, 2.12], 315),
      lampeTag: await probe(name + "_herbst_tag_f_315_g", [-1.92, 1.72 + 0.11, 2.12], 315)
    };
  }, vz.name);
  sage(!!back.loch && back.loch.hell < 40 && back.loch.hell < back.loch.mittel * 0.45, "im gebackenen Bild (315°, Herbst): das Mundloch ist dunkel, der Fels hell", JSON.stringify(back.loch));
  sage(!!back.lochW && back.lochW.hell < 45 && back.lochW.hell < back.lochW.mittel * 0.45, "… auch schräg (0°, Winter)", JSON.stringify(back.lochW));
  sage(!!back.lampeNacht && back.lampeNacht.warm >= 3 && back.lampeNacht.lampe && !!back.lampeTag && back.lampeTag.warm === 0, "nachts leuchtet die Grubenlampe am Stolleneingang (warmes Glas, Licht im Verzeichnis), am Tag nicht", JSON.stringify({ nacht: back.lampeNacht, tag: back.lampeTag && back.lampeTag.warm }));
  await pg.close();
  const pn = await seite("jahr=winter&zeit=nacht");
  await zumBerg(pn, 22); await pn.waitForTimeout(900); await warteBilder(pn); await pn.waitForTimeout(700);
  const nacht = await pn.evaluate(() => { const ST = window.STADT, SZ = ST.szene, o = SZ.objekte.find((x) => x.spiel === "bergwerk"), e = (SZ.sichtbare || []).find((x) => x.o === o); return e ? e.lagen[0][0] : null; });
  sage(/_winter_nacht_/.test(nacht || ""), "in der Winternacht das Nachtbild", nacht);
  if (BILD) await pn.screenshot({ path: BILD + "-bergwerk-nacht.png" });
  await pn.close();

  /* ================= LOK ================= */
  console.log("\nDIE SCHÖNE ALTE LOK MIT KLASSISCHEN WAGEN\n");
  const pz = await seite("jahr=herbst&zeit=tag&ton=1", null, true);
  const blaetter = await pz.evaluate(() => {
    const BA = window.STADT.bahn, v = window.STADT.bilder.vz;
    const lok = BA.WAGEN[0].bild;
    const alle = ["winter", "herbst"].every((j) => ["tag", "nacht"].every((z) => BA.WAGEN.every((w) => v[w.bild + "_" + j + "_" + z] && v[w.bild + "_" + j + "_" + z + "_z"])));
    return { lok: lok, n: v[lok + "_herbst_tag"] && v[lok + "_herbst_tag"].n, wagen: BA.WAGEN.map((w) => w.art + ":" + w.bild), alle: alle, alt: Object.keys(v).filter((k) => /^l_bahn_(lok|tender|gwagen|rungen|kessel)_/.test(k)).length };
  });
  sage(blaetter.lok !== "l_bahn_lok" && blaetter.n >= 4, "neues Lokblatt mit mehreren Radstellungen", JSON.stringify({ lok: blaetter.lok, radstellungen: blaetter.n }));
  sage(blaetter.wagen.filter((w) => /personenwagen/.test(w)).length >= 2 && blaetter.alle, "klassische Personenwagen hinter Lok und Tender, alle Blätter (auch Zwerg) da", blaetter.wagen.join(" · "));
  sage(blaetter.alt === 0, "die alten Güterzugblätter sind weg", blaetter.alt + " alte");
  /* Zwei Umläufe mit der echten Uhr (vorgespult über den Versatz) */
  const lauf = await pz.evaluate(() => {
    const ST = window.STADT, BA = ST.bahn, P = BA.plan, K = ST.kamera;
    const h = BA.an(BA.halt); K.x = h.x + 10; K.y = h.y + 10; K.s = 5 * K.dpr; K.dreh = 0;
    const jetzt = Date.now() / 1000, n = Math.floor((jetzt + BA.versatz) / P.takt);
    const start = (n + 1) * P.takt;                          // Anfang des nächsten Umlaufs
    const proben = [];
    for (let t = 0; t < 2 * P.takt; t += 0.5) {
      BA.versatz = start + t - Date.now() / 1000; BA.bewegen(performance.now());
      if (!BA.st || !BA.zug.length) { proben.push({ t: t, dir: BA.dir, weg: true }); continue; }
      const lok = BA.zug[0], ten = BA.zug[1], L = ST.proj(lok.x, lok.y, 0), T = ST.proj(ten.x, ten.y, 0);
      /* Blattzeile der Lok wie in bahn.js (sichtbar): Blickrichtung aus der Lage auf dem Gleis */
      const gier = Math.atan2(-Math.cos(lok.h), Math.sin(lok.h)) * 180 / Math.PI + K.dreh * 90;
      proben.push({ t: t, dir: BA.dir, art: BA.st.art, lx: L[0] / K.W, tx: T[0] / K.W, drin: Math.max(Math.abs(lok.x), Math.abs(lok.y)) < 110, reihe: ((Math.round(gier / 45) % 8) + 8) % 8 });
    }
    BA.versatz = 0;
    return { takt: P.takt, proben: proben };
  });
  for (const dir of [1, -1]) {
    const R = lauf.proben.filter((p) => p.dir === dir && !p.weg && p.drin);
    const name = dir > 0 ? "von links nach rechts" : "von rechts nach links";
    const erst = R[0], letzt = R[R.length - 1];
    const bewegt = erst && letzt ? letzt.lx - erst.lx : 0;
    sage(R.length > 20 && (dir > 0 ? bewegt > 0.5 : bewegt < -0.5), "[" + name + "] der Zug fährt durchs Bild", erst ? "Lok x " + erst.lx.toFixed(2) + " → " + letzt.lx.toFixed(2) + " (Bildbreiten)" : "nie im Bild");
    const steht = R.filter((p) => p.art === "steht").length, ab = R.findIndex((p) => p.art === "anfahren"), an = R.findIndex((p) => p.art === "bremst");
    sage(steht >= 20 && an >= 0 && ab > an, "[" + name + "] kommt an (bremst), hält am Bahnhof, fährt wieder ab", "Halt " + steht * 0.5 + " s");
    const vorn = R.filter((p) => p.art !== "steht").every((p) => dir > 0 ? p.lx > p.tx : p.lx < p.tx);
    sage(vorn, "[" + name + "] die Lok fährt vorn (vor dem Tender in Fahrtrichtung)");
    lauf["reihe" + dir] = [...new Set(R.map((p) => p.reihe))].join(",");
  }
  sage(lauf["reihe1"] && lauf["reihe-1"] && lauf["reihe1"] !== lauf["reihe-1"], "die Lok schaut je Richtung anders (andere Blattzeile, nicht rückwärts)", "hin " + lauf["reihe1"] + " / her " + lauf["reihe-1"]);
  sage(lauf.proben.some((p) => p.dir === 1 && p.drin) && lauf.proben.some((p) => p.dir === -1 && p.drin), "über zwei Umläufe (je " + lauf.takt + " s) kommen beide Richtungen vor");
  /* Räder drehen sich: während der Fahrt verschiedene Radstellungen */
  const rad = await pz.evaluate(() => new Promise((ok) => {
    const ST = window.STADT, BA = ST.bahn, P = BA.plan, K = ST.kamera;
    BA.fest = null;
    const T = Date.now() / 1000, n = Math.floor(T / P.takt);
    BA.versatz = (n % 2 ? n + 1 : n) * P.takt + P.hin.t1 * 0.5 - T;
    const spalten = new Set(); let bilder = 0;
    const f = () => { const lok = BA.zug[0]; if (lok) { K.x = lok.x; K.y = lok.y; K.s = 14 * K.dpr; } const v = BA.sichtbar(ST.szene.zeitDaten()).find((x) => x.bahn === 0); if (v) spalten.add(v.schritt); bilder++; if (bilder > 50) ok({ spalten: [...spalten], bilder: bilder }); else requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }));
  sage(rad.spalten.length >= 3, "die Räder drehen sich (Stangen und Speichen laufen mit)", "Radstellungen " + rad.spalten.join(","));
  if (BILD) {
    for (const [dir, name] of [[1, "hin"], [-1, "her"]]) {
      await pz.evaluate((dir) => { const ST = window.STADT, BA = ST.bahn, P = BA.plan, fp = dir > 0 ? P.hin : P.her; BA.fest = { t: fp.tAb + 6, dir: dir }; BA.bewegen(performance.now()); const z = BA.zug[1]; const K = ST.kamera; K.x = z.x + 3; K.y = z.y + 7; K.s = 16 * K.dpr; ST.leicht.unruhe = 3; }, dir);
      await pz.waitForTimeout(1200); await warteBilder(pz); await pz.waitForTimeout(500);
      await pz.screenshot({ path: BILD + "-zug-" + name + ".png" });
    }
    await pz.evaluate(() => { window.STADT.bahn.fest = null; });
  }

  /* ================= KLANG ================= */
  console.log("\nDER KLANG DER LOK (Web Audio, gezählt)\n");
  const tonLauf = (p, weit) => p.evaluate((weit) => {
    const ST = window.STADT, BA = ST.bahn, P = BA.plan, K = ST.kamera, T = ST.ton;
    if (!T) return { fehlt: true };
    BA.fest = null;
    const h = BA.an(BA.halt); K.x = h.x + (weit ? 260 : 2); K.y = h.y + (weit ? 260 : 2); K.s = 14 * K.dpr; K.dreh = 0;
    const vorher = T.log.length, Z0 = Object.assign({}, window.__tonZaehler || {});
    const jetzt = Date.now() / 1000, n = Math.floor(jetzt / P.takt), start = (n % 2 ? n + 1 : n + 2) * P.takt;
    /* vom Einrollen bis weit hinter die Abfahrt, in kleinen Schritten */
    const laut = [];
    for (let t = P.hin.t1 - 3; t < P.hin.tAb + 12; t += 0.04) {
      BA.versatz = start + t - Date.now() / 1000; BA.bewegen(performance.now());
      if (BA.tonInfo) laut.push(BA.tonInfo.laut);
    }
    BA.versatz = 0;
    const log = T.log.slice(vorher), zahl = (n) => log.filter((e) => e.name === n).length;
    const Z = window.__tonZaehler || {}, d = (k) => (Z[k] || 0) - (Z0[k] || 0);
    return { pfiffEin: zahl("pfiff-ein"), bremse: zahl("bremse"), zisch: zahl("zisch"), pfiffAb: zahl("pfiff-ab"), schnauf: zahl("schnauf"), klack: zahl("klack"),
      reihenfolge: log.filter((e) => e.name !== "schnauf" && e.name !== "klack").map((e) => e.name).join(" → "),
      maxLaut: Math.max(0, ...log.map((e) => e.laut)), osc: d("osc"), quelle: d("quelle"), start: d("start"), ctx: Z.ctx || 0, lautMax: Math.max(0, ...laut) };
  }, weit);
  const tn = await tonLauf(pz, false);
  sage(!tn.fehlt, "es gibt eine Tonanlage in der Stadt (STADT.ton)");
  if (!tn.fehlt) {
    sage(tn.pfiffEin >= 1 && tn.bremse >= 1, "Einfahrt: Pfiff und Bremsquietschen am Halt", JSON.stringify({ pfiff: tn.pfiffEin, bremse: tn.bremse }));
    sage(tn.zisch >= 1 && tn.pfiffAb >= 1, "Halt: Dampf ablassen; vor der Abfahrt kurz–lang pfeifen", JSON.stringify({ zisch: tn.zisch, pfiff: tn.pfiffAb }));
    sage(/pfiff-ein.*bremse.*zisch.*pfiff-ab/.test(tn.reihenfolge), "in der richtigen Reihenfolge", tn.reihenfolge);
    sage(tn.schnauf >= 15 && tn.klack >= 1, "Abfahrt: Schnaufen im Takt der Räder, Schienenstöße", JSON.stringify({ schnauf: tn.schnauf, klack: tn.klack }));
    sage(tn.ctx >= 1 && tn.osc > 5 && tn.quelle > 10 && tn.start > 20, "Web Audio wird wirklich benutzt (Knoten angelegt und gestartet)", JSON.stringify({ ctx: tn.ctx, osc: tn.osc, quellen: tn.quelle, starts: tn.start }));
    sage(tn.maxLaut > 0.05 && tn.maxLaut <= 0.7, "leise (höchstens 0,7 vor der Lautstärkestufe)", "lauteste " + tn.maxLaut);
    const tw = await tonLauf(pz, true);
    sage(tw.lautMax < tn.lautMax * 0.3 && tw.schnauf < tn.schnauf, "weit weg (Kamera 370 m entfernt) viel leiser bis stumm", JSON.stringify({ nah: +tn.lautMax.toFixed(3), weit: +tw.lautMax.toFixed(3), schnaufWeit: tw.schnauf }));
  }
  sage(!pz.fehler.length, "Lok und Klang ohne Seitenfehler", pz.fehler.join(" | "));
  await pz.close();
  /* Stumm: ?ton=0, Lautstärke „aus"; eingebettet nur mit Tönen des Spiels */
  const ps = await seite("jahr=herbst&zeit=tag&ton=0", null, true);
  const stumm = await ps.evaluate(() => { const T = window.STADT.ton; return T ? T.darf() : null; });
  await ps.close();
  const pl = await seite("jahr=herbst&zeit=tag", null, true);
  const laut = await pl.evaluate(() => { const T = window.STADT.ton; if (!T) return null; const r = {}; localStorage.setItem("dma_spiel_laut", "0"); r.aus = T.darf(); localStorage.setItem("dma_spiel_laut", "2"); r.mittel = T.darf(); localStorage.removeItem("dma_spiel_laut"); return r; });
  await pl.close();
  sage(stumm === false && !!laut && laut.aus === false && laut.mittel === true, "stumm mit ?ton=0 und bei Lautstärke „aus“, sonst erlaubt", JSON.stringify({ ton0: stumm, laut: laut }));
  const pe = await br.newPage({ viewport: { width: 400, height: 300 } });
  pe.on("pageerror", (e) => alleFehler.push(e.message));
  await pe.addInitScript(STUB);
  await pe.goto(basis + "/__eltern.html", { waitUntil: "load" });
  const rahmen = pe.frames().find((f) => /stadt-leicht\.html/.test(f.url()));
  let eing = null;
  if (rahmen) {
    await rahmen.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 }).catch(() => {});
    eing = await rahmen.evaluate(() => { const T = window.STADT.ton; if (!T) return null; window.parent.__an = false; const aus = T.darf(); window.parent.__an = true; const an = T.darf(); return { spielAus: aus, spielAn: an }; });
  }
  sage(!!eing && eing.spielAus === false && eing.spielAn === true, "im eingebetteten Rahmen nur, wenn das Spiel Töne an hat", JSON.stringify(eing));
  await pe.close();

  /* ================= KLEINER RAHMEN ================= */
  console.log("\nIM KLEINEN RAHMEN (mini=1: nur kleine Bilder)\n");
  const pm = await seite("mini=1&eingebettet=1&jahr=winter&zeit=tag&bahnt=24", { width: 330, height: 206 });
  await pm.evaluate(() => { const K = window.STADT.kamera; window.STADT.bilder.nurKlein = true; K.s = 6.6; window.STADT.leicht.unruhe = 3; });
  await pm.waitForTimeout(2500); await warteBilder(pm); await pm.waitForTimeout(600);
  /* dann zum Bergwerk schauen */
  await pm.evaluate(() => { const ST = window.STADT, K = ST.kamera, o = ST.szene.objekte.find((x) => x.spiel === "bergwerk"); if (o) { K.x = o.x + 8; K.y = o.y + 8; } ST.leicht.unruhe = 3; });
  await pm.waitForTimeout(2000); await warteBilder(pm); await pm.waitForTimeout(600);
  const bilderMini = [...new Set(pm.geladen.filter((u) => /stadt-leicht\/bilder\/.*\.webp/.test(u)).map((u) => decodeURIComponent(new URL(u).pathname).replace(/^\//, "")))];
  const kb = bilderMini.reduce((n, p) => n + (fs.existsSync(path.join(WURZEL, p)) ? fs.statSync(path.join(WURZEL, p)).size : 0), 0) / 1024;
  const gross = bilderMini.filter((p) => /_(g|m)(_s)?\.webp$/.test(p) || (/l_bahn_/.test(p) && !/_z\.webp$/.test(p)));
  const bergMini = bilderMini.filter((p) => /berg/.test(p));
  sage(kb < 300 && gross.length === 0, "nur kleine Bilder, zusammen unter 300 KB", kb.toFixed(0) + " KB in " + bilderMini.length + " Dateien" + (gross.length ? ", groß: " + gross.slice(0, 4).join(", ") : ""));
  sage(bergMini.length > 0 && bergMini.every((p) => /_z(_s)?\.webp$|_n(_s)?\.webp$/.test(p)), "das Bergwerk erscheint dort als Zwergbild", bergMini.join(", "));
  sage(!pm.fehler.length, "im kleinen Rahmen ohne Seitenfehler", pm.fehler.join(" | "));
  if (BILD) await pm.screenshot({ path: BILD + "-mini.png" });
  await pm.close();

  sage(!alleFehler.length, "keine Seitenfehler insgesamt", alleFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
