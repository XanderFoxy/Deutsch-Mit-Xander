/* =========================================================
   CORE — geteilte Hilfsfunktionen für alle Module
   ========================================================= */
const Core = (function () {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Zieht `count` einzigartige Elemente aus `pool`, ohne Wiederholung.
  // Wenn der Pool kleiner ist als `count`, wird der ganze (gemischte) Pool zurückgegeben.
  function drawUnique(pool, count) {
    const shuffled = shuffle(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (v !== undefined && v !== null && v !== false) {
          node.setAttribute(k, v);
        }
      });
    }
    children.flat().forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "de-DE";
    utter.rate = 0.92;
    // Viele Geräte (besonders iPhone) bieten mehrere deutsche Stimmen an — eine "Standard"-
    // Stimme, die oft roboterhaft klingt, und daneben oft bessere "Enhanced"/"Premium"-Stimmen.
    // Wenn eine davon verfügbar ist, wird sie bevorzugt statt der ersten besten deutschen Stimme.
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang && v.lang.startsWith("de"));
    const preferred = voices.find((v) => /enhanced|premium|natural/i.test(v.name)) || voices[0];
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  /* ============================================================
     AUSSPRACHE HÖREN UND PRÜFEN
     ------------------------------------------------------------
     Was hier gemessen wird — und was nicht:

     Der Browser bringt eine Spracherkennung mit (Web Speech API). Sie
     hört zu und liefert zurück, welches Wort sie VERSTANDEN hat, dazu
     eine eigene Sicherheit zwischen 0 und 1. Daraus lässt sich ehrlich
     ableiten, ob das gesprochene Wort ANKOMMT: Wer „Betriebskosten-
     abrechnung“ sagt und die Erkennung schreibt genau das, hat sich
     verständlich gemacht.

     Was hier NICHT gemessen wird, ist die Lautqualität — ob das „ö“
     wirklich ein „ö“ ist oder eher ein „ø“. Das können nur eigens dafür
     gebaute Dienste (z. B. die Aussprachebewertung von Azure), und die
     brauchen einen Server und kosten Geld. Deshalb heißt die Anzeige in
     der Oberfläche „Verständlichkeit“ und nicht „Aussprachenote“ — ein
     Prozentwert, der etwas anderes verspricht, als er misst, wäre
     Augenwischerei.

     Die Anbindung ist so geschnitten, dass ein solcher Dienst später nur
     eine weitere Bewertungsquelle wäre: hoerePruefung() gibt Text und
     Sicherheit zurück, bewerteAussprache() macht daraus die Zahl.
     ============================================================ */
  function spracherkennungDa() {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  /* Hört EINMAL zu und meldet, was verstanden wurde.
     Auflösung: { text, sicherheit, alternativen } oder { fehler }. */
  function hoereZu(optionen) {
    const o = optionen || {};
    return new Promise((fertig) => {
      const Erkenner = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Erkenner) { fertig({ fehler: "nicht-verfuegbar" }); return; }
      let erkenner;
      try { erkenner = new Erkenner(); } catch (e) { fertig({ fehler: "nicht-verfuegbar" }); return; }
      erkenner.lang = o.sprache || "de-DE";
      erkenner.interimResults = false;
      erkenner.continuous = false;
      /* Mehrere Vorschläge anfordern: die Erkennung schreibt oft eine
         gängigere Schreibweise an die erste Stelle („Bahn hofs“ statt
         „Bahnhofs“). Wer richtig gesprochen hat, soll daran nicht
         scheitern — deshalb zählt der beste Treffer, nicht der erste. */
      erkenner.maxAlternatives = 5;
      let beendet = false;
      const schluss = (ergebnis) => { if (beendet) return; beendet = true; try { erkenner.stop(); } catch (e) {} fertig(ergebnis); };
      erkenner.onresult = (e) => {
        const treffer = e.results && e.results[0];
        if (!treffer || !treffer.length) { schluss({ fehler: "nichts-verstanden" }); return; }
        const alternativen = [];
        for (let i = 0; i < treffer.length; i++) alternativen.push({ text: treffer[i].transcript, sicherheit: treffer[i].confidence || 0 });
        schluss({ text: alternativen[0].text, sicherheit: alternativen[0].sicherheit, alternativen });
      };
      erkenner.onerror = (e) => {
        // "not-allowed" heißt: das Mikrofon wurde abgelehnt oder ist gesperrt.
        schluss({ fehler: e && e.error ? e.error : "fehler" });
      };
      erkenner.onend = () => schluss({ fehler: "nichts-verstanden" });
      // Notbremse: manche Geräte lösen weder onend noch onerror aus.
      setTimeout(() => schluss({ fehler: "zeit-abgelaufen" }), o.hoechstdauer || 8000);
      try { erkenner.start(); } catch (e) { schluss({ fehler: "start-fehlgeschlagen" }); }
    });
  }
  /* Wie ähnlich sind zwei Wörter? Levenshtein-Abstand, auf 0–1 normiert.
     Klein geschrieben, ohne Satzzeichen — „Bahnhof.“ und „bahnhof“ sind
     dieselbe Aussprache. */
  function wortAehnlichkeit(a, b) {
    /* Leerzeichen fallen weg, wenn das Zielwort selbst keines hat: die
       Erkennung trennt zusammengesetzte Wörter gern („Bahn Hof“), wer sie
       richtig ausgesprochen hat, soll daran nicht scheitern. Auch der
       Artikel wird abgeschnitten — geprüft wird die Aussprache des Wortes,
       nicht ob jemand „der“ mitgesprochen hat. */
    const grund = (s) => String(s || "").toLowerCase()
      .replace(/^(der|die|das|ein|eine)\s+/, "")
      .replace(/[^a-zäöüß\s]/g, "").replace(/\s+/g, " ").trim();
    const zielHatLuecke = grund(a).includes(" ");
    const norm = (s) => (zielHatLuecke ? grund(s) : grund(s).replace(/\s+/g, ""));
    const x = norm(a), y = norm(b);
    if (!x || !y) return 0;
    if (x === y) return 1;
    const m = x.length, n = y.length;
    let vorher = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const jetzt = [i];
      for (let j = 1; j <= n; j++) {
        jetzt[j] = Math.min(vorher[j] + 1, jetzt[j - 1] + 1, vorher[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
      }
      vorher = jetzt;
    }
    return Math.max(0, 1 - vorher[n] / Math.max(m, n));
  }
  /* Aus dem Gehörten eine Zahl machen.
     Die Ähnlichkeit wiegt schwer (sie sagt, OB das Wort ankam), die
     Sicherheit der Erkennung ergänzt sie (sie sagt, wie deutlich).
     Bei Geräten, die gar keine Sicherheit liefern (Safari gibt oft 0),
     zählt allein die Ähnlichkeit — sonst wäre dort jede Aufnahme
     schlecht bewertet, obwohl richtig gesprochen wurde. */
  function bewerteAussprache(ziel, gehoert) {
    const liste = (gehoert && gehoert.alternativen) || (gehoert && gehoert.text ? [{ text: gehoert.text, sicherheit: gehoert.sicherheit || 0 }] : []);
    if (!liste.length) return { prozent: 0, beste: "", aehnlichkeit: 0 };
    let beste = liste[0], besteAehnlichkeit = -1;
    liste.forEach((a) => { const w = wortAehnlichkeit(ziel, a.text); if (w > besteAehnlichkeit) { besteAehnlichkeit = w; beste = a; } });
    const sicherheit = beste.sicherheit > 0 ? beste.sicherheit : null;
    /* Die Sicherheit wird MULTIPLIZIERT, nicht addiert. Sie sagt ja nur,
       wie sicher sich die Erkennung ihrer eigenen Abschrift ist — nicht,
       ob das Wort stimmt. Addiert man sie, bekäme ein selbstsicher
       erkanntes FALSCHES Wort trotzdem eine ordentliche Note; „Banane“
       für „Bahnhof“ kam so auf 55 %. Multipliziert kann sie eine gute
       Aussprache bestätigen, aber eine falsche nie retten. */
    const wert = sicherheit === null ? besteAehnlichkeit : besteAehnlichkeit * (0.7 + 0.3 * sicherheit);
    return { prozent: Math.round(clamp(wert, 0, 1) * 100), beste: beste.text, aehnlichkeit: besteAehnlichkeit, sicherheit };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10);
  }

  // Wandelt "HA-ben" in Duden-Stil um: betonte Silbe fett + Punkt darunter.
  /* ============================================================
     BETONUNG — Kennzeichnung wie im Duden
     ------------------------------------------------------------
     Der Duden markiert nicht die ganze Silbe, sondern den betonten
     VOKAL, und unterscheidet dabei die Länge:
       · Punkt darunter  = kurzer Vokal (Bạnk, Lọch)
       ‗ Strich darunter = langer Vokal  (Ta̲g, Wie̲se)
     Die Länge wird nicht geraten, sondern nach den deutschen
     Schreibregeln am ganzen Wort abgelesen: Dehnungs-h, Doppelvokal,
     „ie", Diphthong und die Zahl der folgenden Konsonanten.
     ============================================================ */
  const VOKALE = "aeiouäöüy";
  const DIPHTHONGE = ["ei", "ai", "au", "eu", "äu", "ey", "ay"];
  const LANGE_PAARE = ["ie", "aa", "ee", "oo"];
  // Häufige kurze Wörter, die trotz nur eines Konsonanten kurz gesprochen werden —
  // die allgemeine Regel würde sie sonst fälschlich als lang markieren.
  const KURZE_AUSNAHMEN = new Set(["das", "was", "es", "in", "an", "um", "am", "im", "hat", "bis", "man", "von", "vom", "zum", "ab", "ob", "bin", "hin", "des", "un", "hin", "dran", "drin", "dass", "bis", "mit"]);
  // Ergebnis: { von, bis, lang } — lang ist true (lang), false (kurz) oder null.
  // null heißt ausdrücklich: die SCHREIBUNG gibt die Länge nicht eindeutig her.
  // Dann wird die Betonung angezeigt, aber keine Länge behauptet — lieber ehrlich
  // als geraten. Eindeutig sind: Dehnungs-h, Doppelvokal, „ie", Diphthong und ß
  // (lang) sowie Doppelkonsonant, ck, tz und ein zweifach geschlossener Silbenauslaut
  // (kurz).
  function betonterVokal(wort, start, laenge) {
    const silbe = wort.slice(start, start + laenge);
    let i = 0;
    while (i < silbe.length && !VOKALE.includes(silbe[i])) i += 1;
    if (i >= silbe.length) return null;
    let ende = i + 1;
    let lang = null;
    const paar = silbe.slice(i, i + 2);
    if (DIPHTHONGE.includes(paar)) { ende = i + 2; lang = true; }
    else if (LANGE_PAARE.includes(paar)) { ende = i + 2; lang = true; }
    if (lang === null) {
      // Alles, was im GANZEN Wort nach dem Vokal folgt — die Silbengrenze läuft
      // mitten durch Doppelkonsonanten („Löf-fel"), deshalb reicht die Silbe allein nicht.
      const rest = wort.slice(start + ende);
      let k = 0;
      while (k < rest.length && !VOKALE.includes(rest[k])) k += 1;
      const cluster = rest.slice(0, k);
      const imSilbenrest = silbe.slice(ende); // Konsonanten, die noch zur betonten Silbe gehören
      if (rest[0] === "h") lang = true;                                         // Dehnungs-h: Bahn, Uhr
      else if (cluster.startsWith("ß")) lang = true;                            // Straße, Fuß
      else if (/^(ck|tz|dt)/.test(cluster)) lang = false;                       // Zucker, Katze
      else if (cluster.length >= 2 && cluster[0] === cluster[1]) lang = false;  // Doppelkonsonant: Löffel
      else if (imSilbenrest.length === 0 && cluster.length <= 1) lang = true;   // offene Silbe: Ta-ge
      else if (/(sch|ch|ph|th)/.test(cluster)) lang = null;                     // Buch vs. Geschichte — nicht ablesbar
      else if (imSilbenrest.length >= 2) lang = false;                          // geschlossene Silbe: Bank, Angst
      else if (cluster.length === 1 && start + ende + 1 >= wort.length) lang = true; // Zug, Tag
      else lang = null;
      if (KURZE_AUSNAHMEN.has(wort)) lang = false;
    }
    return { von: i, bis: ende, lang };
  }
  /* Ist diese Silbe komplett großgeschrieben, also die betonte?

     Zwei Fallen stecken darin, und beide sind echte Fehlerquellen gewesen:

     1. Das ß. „MAß-band" ist eine Großsilbe, aber `"MAß" === "MAß".toUpperCase()`
        ist falsch, weil JavaScript aus ß beim Großschreiben „SS" macht. Wörter
        mit ß in der betonten Silbe (Maßband, Fußsohle, Straßenschild, Bußgeld …)
        galten dadurch als „ohne Betonung" und fielen aus dem Betonungs-Trainer
        heraus. Deshalb wird ß hier als Zeichen ohne Groß-/Kleinform behandelt.
     2. Einzelne Großbuchstaben am Wortanfang. „E-le-MENT" schreibt das E groß,
        weil das Wort nun einmal so geschrieben wird — betont ist trotzdem MENT.
        Darum entscheidet betonteSilbenIndex() bei mehreren Kandidaten für die
        erste MEHRbuchstabige Silbe. */
  function silbeIstGross(p) {
    return /[A-ZÄÖÜ]/.test(p) && !/[a-zäöü]/.test(p.replace(/ß/g, ""));
  }
  function betonteSilbenIndex(teile) {
    const kandidaten = [];
    teile.forEach((p, i) => { if (silbeIstGross(p)) kandidaten.push(i); });
    if (!kandidaten.length) return -1;
    if (kandidaten.length === 1) return kandidaten[0];
    const mehrbuchstabig = kandidaten.filter((i) => teile[i].length > 1);
    return mehrbuchstabig.length ? mehrbuchstabig[0] : kandidaten[0];
  }
  function formatStress(syl) {
    if (!syl) return "";
    // Mehrteilige Angaben („das ZIEL") Wort für Wort behandeln.
    if (syl.includes(" ")) return syl.split(" ").map(formatStress).join(" ");
    const rohTeile = syl.split("-");
    /* Ein Stern vor einer Silbe kennzeichnet eine NEBENbetonung. Lange
       zusammengesetzte Wörter haben nämlich mehr als eine betonte Silbe:
       „Be-TRIEBS-kos-ten-ab-rech-nung" wird auf BETRIEBS haupt-, auf
       KOSten und ABrechnung nebenbetont. Wer nur die erste Betonung
       sieht, liest den Rest flach — und genau das klingt falsch. */
    const nebenIdx = new Set();
    const parts = rohTeile.map((p, i) => {
      if (p.startsWith("*")) { nebenIdx.add(i); return p.slice(1); }
      return p;
    });
    // Betonte Silbe finden. Achtung: die ERSTE Silbe ist bei Nomen ohnehin groß
    // geschrieben — ein einzelner Großbuchstabe („Ü-ber-LIE-fe-rung") ist deshalb
    // kein Betonungszeichen, solange es eine echte Großbuchstaben-Silbe gibt.
    const betontIdx = betonteSilbenIndex(parts);
    if (betontIdx < 0 && !nebenIdx.size) return syl;
    const klein = parts.map((p) => p.toLowerCase());
    const wort = klein.join("");
    const versatz = betontIdx > 0 ? klein.slice(0, betontIdx).join("").length : 0;
    const marke = betontIdx >= 0 ? betonterVokal(wort, versatz, klein[betontIdx].length) : null;
    return parts.map((part, i) => {
      let shown = part.toLowerCase();
      if (i === 0) shown = shown.charAt(0).toUpperCase() + shown.slice(1);
      if (i !== betontIdx) {
        if (!nebenIdx.has(i)) return shown;
        // Nebenbetonung: schwächer als die Hauptbetonung, aber sichtbar.
        const nebenMarke = betonterVokal(wort, klein.slice(0, i).join("").length, klein[i].length);
        if (!nebenMarke) return `<span class="stress-neben" title="nebenbetont">${shown}</span>`;
        const nv = shown.slice(0, nebenMarke.von);
        const nk = shown.slice(nebenMarke.von, nebenMarke.bis);
        const nh = shown.slice(nebenMarke.bis);
        const nart = nebenMarke.lang === true ? "stress-lang" : nebenMarke.lang === false ? "stress-kurz" : "stress-offen";
        return `<span class="stress-neben" title="nebenbetont"><span class="stress-vokal ${nart}">${nv}${nk}${nh}</span></span>`;
      }
      if (!marke) return `<span class="stress-mark">${shown}</span>`;
      const vorne = shown.slice(0, marke.von);
      const kern = shown.slice(marke.von, marke.bis);
      const hinten = shown.slice(marke.bis);
      const art = marke.lang === true ? "stress-lang" : marke.lang === false ? "stress-kurz" : "stress-offen";
      const titel = marke.lang === true ? "betont, langer Vokal" : marke.lang === false ? "betont, kurzer Vokal" : "betont — die Vokallänge lässt sich der Schreibung nicht eindeutig entnehmen";
      return `<span class="stress-mark">${vorne}<span class="stress-vokal ${art}" title="${titel}">${kern}</span>${hinten}</span>`;
    }).join("");
  }

  // ---------- Soundeffekte (synthetisiert, keine Audiodateien nötig) ----------
  let audioCtx = null;
  function getCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function tone(freq, start, duration, type = "sine", volume = 0.15) {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  }
  // Weißes Rauschen, gefiltert und mit Lautstärke-Hüllkurve — klingt deutlich authentischer nach
  // einem echten Explosions-/Knall-Geräusch als reine Sinus-/Sägezahn-Töne allein.
  function noiseBurst(start, duration, volume = 0.2, filterFreq = 800) {
    const ctx = getCtx();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime + start);
    filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + start + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(ctx.currentTime + start);
    noise.stop(ctx.currentTime + start + duration);
  }

  const sound = {
    correct() { tone(880, 0, 0.12, "sine"); tone(1318, 0.08, 0.18, "sine"); },
    wrong() { tone(180, 0, 0.22, "sawtooth", 0.12); },
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.25, "triangle", 0.14));
    },
    okay() {
      [523, 587].forEach((f, i) => tone(f, i * 0.12, 0.18, "triangle", 0.12));
    },
    fail() {
      // "Sad trombone" — absteigende Töne
      [400, 360, 320, 260].forEach((f, i) => tone(f, i * 0.18, 0.24, "sawtooth", 0.12));
    },
    explosion() {
      // Echter Knall: gefiltertes Rauschen für den initialen "Wumms", darunter tiefe, abfallende
      // Töne fürs Nachrumpeln — klingt deutlich authentischer als reine Sinus-/Sägezahn-Töne.
      noiseBurst(0, 0.22, 0.28, 1400);
      tone(90, 0, 0.28, "sawtooth", 0.2);
      tone(55, 0.02, 0.32, "square", 0.16);
      tone(180, 0, 0.06, "square", 0.08);
    },
    zonk() {
      // Zweisilbiger "Falsch!"-Buzzer, wie bei Quizshows ("eh-EH") — zwei kurze, tiefe Töne mit
      // fallender Tonhöhe innerhalb jeder Silbe, deutlich vom normalen wrong()-Ton unterscheidbar.
      tone(220, 0, 0.14, "square", 0.16); tone(160, 0.05, 0.14, "square", 0.14);
      tone(200, 0.28, 0.16, "square", 0.18); tone(130, 0.34, 0.18, "square", 0.16);
    },
    miau() {
      /* Ein Katzenlaut aus zwei Teilen: das "mi" steigt kurz an, das "au"
         fällt langsam ab. Zusammen mit dem leichten Vibrato klingt es nach
         Katze statt nach Piepton. Rein erzeugt, keine Audiodatei nötig. */
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      osc.type = "sawtooth";
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.linearRampToValueAtTime(760, t + 0.09);   // „mi“ steigt
      osc.frequency.linearRampToValueAtTime(430, t + 0.42);   // „au“ fällt
      vib.type = "sine";
      vib.frequency.setValueAtTime(16, t);
      vibGain.gain.setValueAtTime(22, t);
      vib.connect(vibGain).connect(osc.frequency);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.13, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1600, t);
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(t); vib.start(t);
      osc.stop(t + 0.5); vib.stop(t + 0.5);
    },
    bubblePop() {
      // Kurzes, helles "Blubb" wie eine echte Seifenblase — bewusst deutlich anders als
      // explosion() (dumpfer Knall): ein kurzer, hoher Ton, der schnell in der Tonhöhe absackt
      // und leise ausklingt, statt eines lauten, tiefen "Wumms".
      tone(1100, 0, 0.05, "sine", 0.1);
      tone(700, 0.03, 0.08, "sine", 0.09);
    },
    whistle(duration = 0.22) {
      // Kurzes, absteigendes Pfeifen — wie ein Geschoss im Anflug, kurz bevor es einschlägt.
      // Frequenz sinkt exponentiell während der gesamten Flugdauer, synchron zur Kugel-Animation.
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    },
  };

  return { shuffle, drawUnique, el, speak, clamp, uid, formatStress, sound,
    silbeIstGross, betonteSilbenIndex,
    spracherkennungDa, hoereZu, wortAehnlichkeit, bewerteAussprache };
})();
