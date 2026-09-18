#!/usr/bin/env node
/* MISST, OB DIE STIMMERKENNUNG WIRKLICH UNTERSCHEIDET.
   ---------------------------------------------------------------
   GEWUENSCHT: „…dass wir praktisch unterscheiden, ob es einfach nur
   Stille ist, ob eine menschliche Stimme erkannt wird oder nicht."

   Ein echtes Mikrofon steht hier nicht zur Verfuegung, und „klingt
   richtig" ist kein Messwert. Deshalb bekommt die Erkennung SELBST
   ERZEUGTE Signale, bei denen man genau weiss, was drinsteckt:

     1. Brummen bei 120 Hz      — Ventilator, Kuehlschrank
     2. Zischen bei 6 kHz       — Rascheln, Wind im Mikrofon
     3. reiner Ton bei 1000 Hz  — mitten im Sprachband, haertester Fall
     4. sprachaehnlich          — Grundton, Formanten, Silbenrhythmus

   Erwartet wird: nur 4 kommt durch.

   WICHTIG, und beim ersten Versuch schiefgegangen: die echte
   Mikrofonquelle muss ABGEKLEMMT werden, sonst mischt sie sich dazu
   und die Messung sagt nichts aus. Das macht LiveChat.pruefQuelle.

   Aufruf (die Seite muss unter 127.0.0.1:8899 laufen):
       node werkzeug/stimme-messen.js
*/
const { chromium } = require("/tmp/claude-0/node_modules/playwright");

(async () => {
  const br = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream",
           "--autoplay-policy=no-user-gesture-required"],
  });
  const pg = await br.newPage({ permissions: ["microphone"] });
  const fehler = [];
  pg.on("pageerror", (e) => fehler.push(String(e).slice(0, 220)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:8899/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(3000);

  const r = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((f) => setTimeout(f, ms));
    await LiveChat.freisprechenStarten();
    await warte(1200);
    if (!LiveChat.freiInnen().an) return { fehlt: "Freisprechen ging nicht an" };

    const messen = async (bauen, name) => {
      const k = new (window.AudioContext || window.webkitAudioContext)();
      const ziel = k.createMediaStreamDestination();
      bauen(k, ziel);
      LiveChat.pruefQuelle(ziel.stream);
      await warte(1400);                 // einschwingen lassen
      LiveChat.pruefVerlaufLeeren();
      await warte(1400);                 // dann erst urteilen
      const u = LiveChat.stimmeUrteil();
      try { k.close(); } catch (e) {}
      return { was: name, ja: u.ja, warum: u.warum,
               band: Math.round(u.band * 100) / 100,
               breite: u.breite,
               schwung: Math.round(u.schwung * 100) / 100 };
    };

    const tonQuelle = (hz) => (k, z) => {
      const o = k.createOscillator(), g = k.createGain();
      o.frequency.value = hz; o.type = "sine"; g.gain.value = 0.25;
      o.connect(g); g.connect(z); o.start();
    };

    const ergebnisse = [];
    ergebnisse.push(await messen(tonQuelle(120), "Brummen 120 Hz"));
    ergebnisse.push(await messen(tonQuelle(6000), "Zischen 6 kHz"));
    ergebnisse.push(await messen(tonQuelle(1000), "reiner Ton 1000 Hz (im Sprachband)"));
    ergebnisse.push(await messen((k, z) => {
      const g = k.createGain();
      [130, 700, 1200, 2400, 3000].forEach((hz, i) => {
        const o = k.createOscillator();
        o.frequency.value = hz;
        o.type = i === 0 ? "sawtooth" : "sine";
        const eg = k.createGain();
        eg.gain.value = [0.30, 0.30, 0.26, 0.16, 0.10][i];
        o.connect(eg); eg.connect(g); o.start();
      });
      /* Silbenrhythmus: viermal in der Sekunde an und ab. */
      const lfo = k.createOscillator(), lg = k.createGain();
      lfo.frequency.value = 4; lfo.type = "sine"; lg.gain.value = 0.22;
      lfo.connect(lg); lg.connect(g.gain); lfo.start();
      g.gain.value = 0.25;
      g.connect(z);
    }, "sprachaehnlich (Formanten + Silben)"));

    const grenzen = LiveChat.stimmeUrteil();
    LiveChat.freisprechenBeenden();
    return { ergebnisse, stillePause: LiveChat.freiStille(),
             grenzen: { band: grenzen.bandMin, breite: grenzen.breiteMin, schwung: grenzen.schwungMin } };
  });

  if (r.fehlt) { console.log("Abbruch:", r.fehlt); await br.close(); process.exit(1); }
  console.log("Grenzwerte: Bandanteil ≥ " + r.grenzen.band
    + ", Breite ≥ " + r.grenzen.breite + " Stellen, Schwung ≥ " + r.grenzen.schwung);
  console.log("Stille bis zum Absenden: " + r.stillePause + " ms\n");
  r.ergebnisse.forEach((e) => {
    console.log((e.ja ? "  DURCH  " : "  raus   ") + e.was.padEnd(38)
      + " Band=" + String(e.band).padEnd(5)
      + " Breite=" + String(e.breite).padEnd(4)
      + " Schwung=" + String(e.schwung).padEnd(5)
      + (e.warum ? "  (" + e.warum + ")" : ""));
  });
  const soll = [false, false, false, true];
  const ist = r.ergebnisse.map((e) => e.ja);
  const stimmt = soll.every((v, i) => v === ist[i]);
  console.log("\n" + (stimmt ? "✅ Alle vier wie erwartet." : "⚠️ NICHT wie erwartet."));
  console.log("Seitenfehler:", fehler.length ? fehler : "keine");
  await br.close();
  process.exit(stimmt ? 0 : 1);
})();
