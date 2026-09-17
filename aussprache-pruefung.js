/* =========================================================
   AUSSPRACHE-PRÜFUNG — zweistufig
   ---------------------------------------------------------
   STUFE 1 — AZURE AUSSPRACHEBEWERTUNG (die richtige Prüfung)
   Azure schickt für jedes Wort und für jeden LAUT darin eine
   Note zurück. Damit lässt sich sagen: „dein ö klang wie ein o“.
   Das ist die Auskunft, die weiterbringt. Ein Gesamtprozentwert
   allein bringt niemanden weiter.
   Braucht: Schlüssel + Region, die der Betreiber in den
   Einstellungen einträgt. NIE im Quelltext, nie im Repo.

   STUFE 2 — DAS FREIE VERFAHREN (das Auffangnetz)
   Wenn kein Schlüssel da ist, das Monatskontingent leer ist,
   jemand offline lernt oder das Netz hakt: die eigene Aufnahme
   und die Originalaufnahme werden je in eine Merkmalsfolge
   (MFCC) verwandelt und mit Dynamic Time Warping
   übereinandergelegt. Der Abstand wird zu einem Prozentwert.

   WAS STUFE 2 KANN UND WAS NICHT — ehrlich:
     KANN:   zeigen, WO im Wort die Aufnahme abweicht.
     KANN NICHT: sagen, WAS falsch war. Es weiss nicht, dass
             ein „ö“ ein „o“ war. Es weiss nur, dass an Stelle 3
             etwas anders klingt als im Original.
   Stufe 2 ersetzt Stufe 1 nicht. Sie verhindert nur, dass der
   Trainer ohne Netz oder ohne Kontingent gar nichts tut.

   DIE AUFNAHME BLEIBT IM GERÄT.
   Stufe 2 rechnet vollständig im Browser. Stufe 1 schickt die
   Aufnahme an Azure, weil es dort bewertet wird — das steht in
   der Oberfläche, nicht nur hier.

   Kein DOM, keine Oberfläche. Nur Messen und Rechnen.
   ========================================================= */
window.AusspracheP = (function () {
  "use strict";

  /* =========================================================
     TEIL A — AUFNAHME
     ========================================================= */

  function mikrofonDa() {
    return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia &&
                   typeof window.MediaRecorder !== "undefined");
  }

  /* Welcher Behälter geht auf diesem Gerät? Safari kann kein webm,
     Chrome kein mp4 — darum wird gefragt, nicht geraten. */
  function behaelter() {
    var kandidaten = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus",
                      "audio/mp4", "audio/mpeg", ""];
    for (var i = 0; i < kandidaten.length; i++) {
      if (!kandidaten[i]) return "";
      if (window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(kandidaten[i])) {
        return kandidaten[i];
      }
    }
    return "";
  }

  var HOECHSTDAUER_MS = 15000;   // deutlich unter den 30 s, die Azure erlaubt

  /* Eine Aufnahme. aufnahmeStarten() gibt einen Griff zurück:
       .stoppen()  -> Promise<{ blob, typ, dauerMs }>
       .abbrechen()
     Der Mikrofonzugriff wird danach IMMER freigegeben (sonst bleibt
     auf dem Telefon das rote Aufnahmezeichen stehen). */
  function aufnahmeStarten(optionen) {
    var o = optionen || {};
    return navigator.mediaDevices.getUserMedia({
      /* Rauschunterdrückung und Pegelautomatik sind AUS, und das ist
         Absicht. Beide verändern das Signal genau in den Merkmalen,
         die hier gemessen werden: die Rauschunterdrückung schneidet
         Reibelaute (s, sch, ch, f) weg, weil sie wie Rauschen
         aussehen, und die Pegelautomatik zieht Lautstärkeverläufe
         gerade, an denen die Betonung hängt.
         GEMESSEN (im Browser, ganze Kette, mit einer Attrappe als
         Mikrofon):
           dieselbe Aufnahme    mit AN 57 %   mit AUS 65 %
           andere Aufnahme      mit AN  7 %   mit AUS  4 %
         Acht Punkte mehr bei „gleich“ und drei weniger bei
         „anders“ — die Trennung wird also in beide Richtungen
         besser, allein durch das Abschalten der Aufbereitung.
         Die Echounterdrückung BLEIBT an: ohne sie nimmt das Telefon
         die Originalaufnahme aus dem eigenen Lautsprecher mit auf,
         und dann vergleicht man das Original mit sich selbst. */
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: false,
        autoGainControl: false
      }
    }).then(function (strom) {
      var typ = behaelter();
      var rec = typ ? new MediaRecorder(strom, { mimeType: typ }) : new MediaRecorder(strom);
      var stuecke = [];
      var start = Date.now();
      var fertigMelden = null;
      var abgebrochen = false;
      var uhr = null;

      rec.ondataavailable = function (e) { if (e.data && e.data.size) stuecke.push(e.data); };
      rec.onstop = function () {
        try { strom.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        if (uhr) clearTimeout(uhr);
        if (abgebrochen || !fertigMelden) return;
        var blob = new Blob(stuecke, { type: rec.mimeType || typ || "audio/webm" });
        fertigMelden({ blob: blob, typ: blob.type, dauerMs: Date.now() - start });
      };
      rec.start();

      /* --- Mithören, WIE LAUT es gerade ist ---
         Zwei Dinge hängen daran:
           * die Aussteuerungsanzeige, damit man sieht, dass das
             Mikrofon wirklich etwas hört (sonst spricht man gegen
             ein stummes Gerät und wundert sich über die Note);
           * das Erkennen der Sprechpause: wer fertig ist, soll
             nicht noch einen Knopf suchen müssen.
         Das läuft an der Aufnahme VORBEI — der Analyser hängt am
         selben Strom, verändert ihn aber nicht. Die Aufnahme, die
         zu Azure geht, ist unangetastet. */
      var pegelJetzt = 0;
      var lauschKontext = null, lauschUhr = null;
      var hatGesprochen = false;
      var stillSeit = 0;

      var STILLE_MS = typeof o.stilleMs === "number" ? o.stilleMs : 900;
      var MINDESTENS_MS = typeof o.mindestdauerMs === "number" ? o.mindestdauerMs : 700;
      /* Schwelle relativ zur lautesten Stelle: ein leises Mikrofon
         und ein lautes Zimmer brauchen verschiedene Grenzen, und
         ein fester Wert wäre auf einem der beiden Geräte falsch. */
      var lautestes = 0;

      function lauschenStarten() {
        var K = window.AudioContext || window.webkitAudioContext;
        if (!K) return;
        try {
          lauschKontext = new K();
          var quelle = lauschKontext.createMediaStreamSource(strom);
          var messer = lauschKontext.createAnalyser();
          messer.fftSize = 1024;
          quelle.connect(messer);
          var feld = new Uint8Array(messer.fftSize);
          lauschUhr = setInterval(function () {
            if (!griff.laeuft) return;
            messer.getByteTimeDomainData(feld);
            var summe = 0;
            for (var i = 0; i < feld.length; i++) {
              var v = (feld[i] - 128) / 128;
              summe += v * v;
            }
            var pegel = Math.sqrt(summe / feld.length);
            pegelJetzt = pegel;
            if (pegel > lautestes) lautestes = pegel;
            if (o.beiPegel) { try { o.beiPegel(pegel); } catch (e) {} }

            /* Erst ab hier gilt jemand als „spricht gerade":
               deutlich über dem Grundrauschen UND über einem
               absoluten Mindestwert, damit ein stilles Zimmer
               nicht sein eigenes Rauschen für Sprache hält. */
            var grenze = Math.max(0.035, lautestes * 0.22);
            var jetzt = Date.now();
            if (pegel > grenze) {
              hatGesprochen = true;
              stillSeit = 0;
            } else if (hatGesprochen) {
              if (!stillSeit) stillSeit = jetzt;
              else if (jetzt - stillSeit >= STILLE_MS && jetzt - start >= MINDESTENS_MS) {
                /* Fertig gesprochen. Einmal melden, dann nie wieder. */
                stillSeit = 0;
                hatGesprochen = false;
                if (o.beiStille) { try { o.beiStille(); } catch (e) {} }
              }
            }
          }, 60);
        } catch (e) { /* ohne Aussteuerung geht es auch, nur ohne Komfort */ }
      }
      function lauschenBeenden() {
        if (lauschUhr) { clearInterval(lauschUhr); lauschUhr = null; }
        if (lauschKontext) { try { lauschKontext.close(); } catch (e) {} lauschKontext = null; }
      }

      var griff = {
        laeuft: true,
        pegel: function () { return pegelJetzt; },
        /* Hat überhaupt jemand gesprochen? Der automatische Ablauf
           soll bei völliger Stille nicht so tun, als hätte er
           etwas gemessen. */
        etwasGehoert: function () { return lautestes > 0.035; },
        stoppen: function () {
          return new Promise(function (loesen) {
            lauschenBeenden();
            fertigMelden = loesen;
            griff.laeuft = false;
            try { rec.stop(); } catch (e) { loesen({ fehler: "stopp-fehlgeschlagen" }); }
          });
        },
        abbrechen: function () {
          lauschenBeenden();
          abgebrochen = true;
          griff.laeuft = false;
          try { rec.stop(); } catch (e) {}
          try { strom.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        }
      };
      if (o.beiStille || o.beiPegel) lauschenStarten();
      /* Notbremse: wer den Stopp-Knopf nicht findet, soll nicht
         eine Stunde lang aufnehmen. */
      uhr = setTimeout(function () {
        if (griff.laeuft && o.beiZeitablauf) o.beiZeitablauf();
        else if (griff.laeuft) griff.abbrechen();
      }, o.hoechstdauer || HOECHSTDAUER_MS);

      return griff;
    });
  }

  /* =========================================================
     TEIL B — TON EINLESEN UND UMRECHNEN
     ========================================================= */

  var tonKontext = null;
  function kontext() {
    if (tonKontext && tonKontext.state !== "closed") return tonKontext;
    var K = window.AudioContext || window.webkitAudioContext;
    if (!K) return null;
    tonKontext = new K();
    return tonKontext;
  }

  /* Blob oder URL -> AudioBuffer */
  function tonLesen(quelle) {
    var k = kontext();
    if (!k) return Promise.reject(new Error("kein-audiokontext"));
    var roh;
    if (quelle instanceof Blob) roh = quelle.arrayBuffer();
    else roh = fetch(quelle).then(function (a) { return a.arrayBuffer(); });
    return roh.then(function (puffer) {
      return new Promise(function (loesen, ablehnen) {
        /* Beide Schreibweisen: Safari kennt die Promise-Fassung
           von decodeAudioData lange nicht. */
        var p = k.decodeAudioData(puffer, loesen, ablehnen);
        if (p && p.then) p.then(loesen, ablehnen);
      });
    });
  }

  /* Ein Kanal, eine Abtastrate. Für die Merkmale und für Azure
     wird beides gebraucht. Einfache lineare Umrechnung — für
     Sprache bei 16 kHz völlig ausreichend, und sie braucht keinen
     OfflineAudioContext (den Safari gern verweigert). */
  function einKanal(puffer) {
    if (puffer.numberOfChannels === 1) return puffer.getChannelData(0);
    var n = puffer.length;
    var raus = new Float32Array(n);
    for (var c = 0; c < puffer.numberOfChannels; c++) {
      var d = puffer.getChannelData(c);
      for (var i = 0; i < n; i++) raus[i] += d[i];
    }
    for (var j = 0; j < n; j++) raus[j] /= puffer.numberOfChannels;
    return raus;
  }

  function umrechnen(daten, vonRate, nachRate) {
    if (vonRate === nachRate) return daten;
    var faktor = vonRate / nachRate;
    var n = Math.floor(daten.length / faktor);
    var raus = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var p = i * faktor;
      var a = Math.floor(p), b = Math.min(a + 1, daten.length - 1);
      raus[i] = daten[a] + (daten[b] - daten[a]) * (p - a);
    }
    return raus;
  }

  /* Stille vorn und hinten weg. OHNE das misst DTW vor allem, wie
     lange jemand vor dem Sprechen gezögert hat — gemessen: eine
     halbe Sekunde Vorlauf drückte den Wert um über 20 Punkte. */
  function stilleWeg(daten, rate) {
    var fenster = Math.max(1, Math.round(rate * 0.01));   // 10 ms
    var spitze = 0, i;
    for (i = 0; i < daten.length; i++) { var a = Math.abs(daten[i]); if (a > spitze) spitze = a; }
    if (spitze < 1e-5) return daten;                       // alles still
    var schwelle = spitze * 0.04;
    var anfang = 0, ende = daten.length;
    for (i = 0; i + fenster <= daten.length; i += fenster) {
      var m = 0;
      for (var j = 0; j < fenster; j++) m = Math.max(m, Math.abs(daten[i + j]));
      if (m > schwelle) { anfang = i; break; }
    }
    for (i = daten.length - fenster; i >= 0; i -= fenster) {
      var m2 = 0;
      for (var j2 = 0; j2 < fenster; j2++) m2 = Math.max(m2, Math.abs(daten[i + j2]));
      if (m2 > schwelle) { ende = Math.min(daten.length, i + fenster); break; }
    }
    // etwas Luft lassen, damit kein Anlaut abgeschnitten wird
    var luft = Math.round(rate * 0.02);
    anfang = Math.max(0, anfang - luft);
    ende = Math.min(daten.length, ende + luft);
    if (ende - anfang < fenster * 2) return daten;
    return daten.subarray(anfang, ende);
  }

  /* =========================================================
     TEIL C — MERKMALE (MFCC) UND DTW
     ---------------------------------------------------------
     Eigene FFT, eigene Mel-Filterbank, eigene DCT. Keine
     Fremdbücherei: die App lädt nichts nach, und auf dem
     Telefon im Mobilfunknetz zählt jedes Byte.
     ========================================================= */

  var RATE = 16000;
  var FENSTER = 400;        // 25 ms
  var SCHRITT = 160;        // 10 ms
  var FFT_N = 512;
  var MEL_BAENDER = 26;
  var CEPSTREN = 13;

  /* --- FFT, radix-2, an der Stelle (in-place) --- */
  function fft(re, im) {
    var n = re.length, i, j, k;
    for (i = 1, j = 0; i < n; i++) {
      var bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        var t = re[i]; re[i] = re[j]; re[j] = t;
        t = im[i]; im[i] = im[j]; im[j] = t;
      }
    }
    for (var laenge = 2; laenge <= n; laenge <<= 1) {
      var winkel = -2 * Math.PI / laenge;
      var wr = Math.cos(winkel), wi = Math.sin(winkel);
      for (i = 0; i < n; i += laenge) {
        var cr = 1, ci = 0;
        for (j = 0; j < laenge / 2; j++) {
          var ur = re[i + j], ui = im[i + j];
          var vr = re[i + j + laenge / 2] * cr - im[i + j + laenge / 2] * ci;
          var vi = re[i + j + laenge / 2] * ci + im[i + j + laenge / 2] * cr;
          re[i + j] = ur + vr; im[i + j] = ui + vi;
          re[i + j + laenge / 2] = ur - vr; im[i + j + laenge / 2] = ui - vi;
          var nr = cr * wr - ci * wi;
          ci = cr * wi + ci * wr; cr = nr;
        }
      }
    }
  }

  function hertzZuMel(f) { return 2595 * Math.log10(1 + f / 700); }
  function melZuHertz(m) { return 700 * (Math.pow(10, m / 2595) - 1); }

  var melBank = null;
  function bankBauen() {
    if (melBank) return melBank;
    var unten = hertzZuMel(80), oben = hertzZuMel(RATE / 2);
    var punkte = [];
    for (var i = 0; i < MEL_BAENDER + 2; i++) {
      var mel = unten + (oben - unten) * i / (MEL_BAENDER + 1);
      punkte.push(Math.floor((FFT_N + 1) * melZuHertz(mel) / RATE));
    }
    melBank = [];
    for (var b = 1; b <= MEL_BAENDER; b++) {
      var reihe = new Float32Array(FFT_N / 2 + 1);
      var l = punkte[b - 1], m = punkte[b], r = punkte[b + 1];
      for (var k = l; k < m; k++) if (m > l) reihe[k] = (k - l) / (m - l);
      for (var k2 = m; k2 < r; k2++) if (r > m) reihe[k2] = (r - k2) / (r - m);
      melBank.push(reihe);
    }
    return melBank;
  }

  var hamming = null;
  function fensterKurve() {
    if (hamming) return hamming;
    hamming = new Float32Array(FENSTER);
    for (var i = 0; i < FENSTER; i++) hamming[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (FENSTER - 1));
    return hamming;
  }

  /* Float32Array (16 kHz, mono) -> Liste von MFCC-Vektoren.
     Zusätzlich die Lautstärke je Rahmen: daran hängt die Anzeige,
     wo im Wort überhaupt gesprochen wurde. */
  function merkmale(daten) {
    var bank = bankBauen(), kurve = fensterKurve();
    var rahmen = [], lautstaerke = [];
    var re = new Float64Array(FFT_N), im = new Float64Array(FFT_N);
    for (var start = 0; start + FENSTER <= daten.length; start += SCHRITT) {
      var i, energie = 0;
      for (i = 0; i < FFT_N; i++) { re[i] = 0; im[i] = 0; }
      for (i = 0; i < FENSTER; i++) {
        var w = daten[start + i];
        energie += w * w;
        re[i] = w * kurve[i];
      }
      fft(re, im);
      // Leistungsspektrum
      var leistung = new Float64Array(FFT_N / 2 + 1);
      for (i = 0; i <= FFT_N / 2; i++) leistung[i] = (re[i] * re[i] + im[i] * im[i]) / FFT_N;
      // Mel-Bänder, logarithmiert
      var log = new Float64Array(MEL_BAENDER);
      for (var b = 0; b < MEL_BAENDER; b++) {
        var s = 0, reihe = bank[b];
        for (i = 0; i <= FFT_N / 2; i++) s += leistung[i] * reihe[i];
        log[b] = Math.log(s + 1e-10);
      }
      // DCT-II -> Cepstren
      var c = new Float32Array(CEPSTREN);
      for (var k = 0; k < CEPSTREN; k++) {
        var summe = 0;
        for (b = 0; b < MEL_BAENDER; b++) summe += log[b] * Math.cos(Math.PI * k * (b + 0.5) / MEL_BAENDER);
        c[k] = summe;
      }
      rahmen.push(c);
      lautstaerke.push(Math.sqrt(energie / FENSTER));
    }
    return { rahmen: rahmen, lautstaerke: lautstaerke, schrittMs: SCHRITT / RATE * 1000 };
  }

  /* Jede Merkmalsspalte auf Mittel 0 / Streuung 1 bringen.
     Der Grund ist handfest: ohne das messen wir vor allem den
     Unterschied zwischen Mikrofon und Lautsprecher. Der erste
     Cepstralwert ist fast nur Lautstärke — er wird ganz
     weggelassen (übliche Praxis, und im Versuch hat er die
     Werte um zweistellige Beträge verzerrt). */
  function normieren(rahmen) {
    if (!rahmen.length) return rahmen;
    var d = rahmen[0].length;
    var mittel = new Float64Array(d), streu = new Float64Array(d);
    var i, k;
    for (i = 0; i < rahmen.length; i++) for (k = 0; k < d; k++) mittel[k] += rahmen[i][k];
    for (k = 0; k < d; k++) mittel[k] /= rahmen.length;
    for (i = 0; i < rahmen.length; i++) for (k = 0; k < d; k++) {
      var v = rahmen[i][k] - mittel[k]; streu[k] += v * v;
    }
    for (k = 0; k < d; k++) streu[k] = Math.sqrt(streu[k] / rahmen.length) || 1;
    var raus = [];
    for (i = 0; i < rahmen.length; i++) {
      var z = new Float32Array(d - 1);
      for (k = 1; k < d; k++) z[k - 1] = (rahmen[i][k] - mittel[k]) / streu[k];
      raus.push(z);
    }
    return raus;
  }

  function abstand(a, b) {
    var s = 0;
    for (var i = 0; i < a.length; i++) { var d = a[i] - b[i]; s += d * d; }
    return Math.sqrt(s);
  }

  /* --- Dynamic Time Warping ---
     Gibt den auf die Pfadlänge normierten Abstand zurück, dazu
     den Pfad (für die Anzeige, welche Stelle zu welcher gehört)
     und den Abstand JE ORIGINALRAHMEN — das ist es, was „WO im
     Wort weicht es ab“ beantwortet. */
  function dtw(a, b) {
    var n = a.length, m = b.length;
    if (!n || !m) return null;
    var UNENDLICH = Infinity;
    var vorher = new Float64Array(m + 1), jetzt = new Float64Array(m + 1);
    // Rückverfolgung: 0=diagonal, 1=oben, 2=links
    var weg = new Uint8Array((n + 1) * (m + 1));
    var i, j;
    for (j = 0; j <= m; j++) vorher[j] = UNENDLICH;
    vorher[0] = 0;
    for (i = 1; i <= n; i++) {
      jetzt[0] = UNENDLICH;
      for (j = 1; j <= m; j++) {
        var kosten = abstand(a[i - 1], b[j - 1]);
        var diag = vorher[j - 1], oben = vorher[j], links = jetzt[j - 1];
        var best = diag, richtung = 0;
        if (oben < best) { best = oben; richtung = 1; }
        if (links < best) { best = links; richtung = 2; }
        jetzt[j] = kosten + best;
        weg[i * (m + 1) + j] = richtung;
      }
      var t = vorher; vorher = jetzt; jetzt = t;
    }
    var gesamt = vorher[m];
    // Pfad zurückverfolgen
    var pfad = [];
    i = n; j = m;
    while (i > 0 && j > 0) {
      pfad.push([i - 1, j - 1]);
      var r = weg[i * (m + 1) + j];
      if (r === 0) { i--; j--; }
      else if (r === 1) { i--; }
      else { j--; }
    }
    pfad.reverse();
    // Abstand je Originalrahmen (b = Original)
    var jeOriginal = new Float64Array(m), zaehler = new Float64Array(m);
    for (var p = 0; p < pfad.length; p++) {
      var ia = pfad[p][0], jb = pfad[p][1];
      jeOriginal[jb] += abstand(a[ia], b[jb]);
      zaehler[jb]++;
    }
    for (j = 0; j < m; j++) jeOriginal[j] = zaehler[j] ? jeOriginal[j] / zaehler[j] : 0;
    return { abstand: gesamt / pfad.length, pfad: pfad, jeOriginal: jeOriginal, laengeA: n, laengeB: m };
  }

  /* --- Eichung ---
     Aus dem DTW-Abstand einen Prozentwert machen.

     DIE ZWEI ZAHLEN SIND GEMESSEN, NICHT GERATEN.
     Gemessen an echten deutschen Gesangsaufnahmen (music/*.mp3),
     mit genau diesem Code, Fenster 1,3 s. Nachrechnen:
         node werkzeug/eichen.js
     Messreihe (Abstände, Mittelwerte über je 4–8 Paare):

       dieselbe Aufnahme gegen sich selbst        0,000
       dieselbe Stelle, Opus 24 kbit/s gedreht    0,794
       dieselbe Stelle, 12 dB leiser              0,000
       dieselbe Stelle, Rauschen dazu             0,275
       dieselbe Stelle, Telefonband 300–3400 Hz   0,498
       DIESELBEN WÖRTER, zweite Darbietung        1,609
         (wiederholter Refrain, 79 s auseinander)
       andere Wörter, dieselbe Stimme             4,408  (4,094–4,831)
       anderes Lied, andere Stimme                4,661  (4,425–4,992)

     Zwei Dinge fallen daran auf, und beide sind wichtig:
     1. Der Sprung von „dieselben Wörter" (1,6) zu „andere Wörter"
        (4,4) ist gross und eindeutig. Das Verfahren trennt also
        wirklich nach Inhalt.
     2. Der Unterschied zwischen „andere Wörter, GLEICHE Stimme"
        (4,41) und „andere Wörter, ANDERE Stimme" (4,60) ist mit
        0,19 winzig. Die Stimme fällt also kaum ins Gewicht, der
        Inhalt trägt fast alles. Das muss so sein: die Lernenden
        haben eine andere Stimme als die Aufnahme, gegen die sie
        geprüft werden.

     GLEICH wird auf den Opus-Wert gelegt (0,80): was höchstens so
     weit weg ist wie dieselbe Aufnahme nach unserer eigenen
     Kodierung, gilt als gleich. ANDERS auf den kleinsten
     gemessenen Fremdwort-Abstand (4,10). Dazwischen linear.
     Damit liest sich die Messreihe als:
       gleiche Aufnahme    100 %
       nach Opus           100 %
       dieselben Wörter     75 %
       andere Wörter          0 %

     WICHTIGE EINSCHRÄNKUNG, damit niemand die Zahl überschätzt:
     Diese Reihe vergleicht DATEI mit DATEI. Der wirkliche Weg geht
     zusätzlich durch Mikrofon, Echounterdrückung und Opus-Kodierung.
     Dieselbe Tonquelle einmal durch diese Kette geschickt kam im
     Browser auf 65 % statt 100 % — die Kette allein kostet also
     rund ein Drittel. Eine fehlerfreie Aussprache wird hier darum
     eher 65–85 % anzeigen als 100 %.
     Gemessen wurde mit GESANG als Ersatz, weil in dieser Umgebung
     keine gesprochene deutsche Aufnahme vorlag. Sobald die
     Originalaufnahmen da sind, gehört die Reihe wiederholt:
         node werkzeug/eichen.js --paar meins.wav original.wav
     und die zwei Zahlen hier entsprechend nachgezogen. */
  var EICHUNG = { gleich: 0.80, anders: 4.10 };

  function abstandZuProzent(d) {
    var e = EICHUNG;
    if (d <= e.gleich) return 100;
    if (d >= e.anders) return 0;
    return Math.round(100 * (1 - (d - e.gleich) / (e.anders - e.gleich)));
  }

  /* Der ganze Weg für Stufe 2:
     zwei Blobs/URLs rein, Prozentwert und Abweichungsprofil raus. */
  function freieBewertung(eigene, original) {
    return Promise.all([tonLesen(eigene), tonLesen(original)]).then(function (paar) {
      return freieBewertungAusPuffern(paar[0], paar[1]);
    });
  }

  function aufbereiten(puffer) {
    var d = umrechnen(einKanal(puffer), puffer.sampleRate, RATE);
    return stilleWeg(d, RATE);
  }

  function freieBewertungAusPuffern(eigenerPuffer, originalPuffer) {
    var a = aufbereiten(eigenerPuffer);
    var b = aufbereiten(originalPuffer);
    var ma = merkmale(a), mb = merkmale(b);
    var na = normieren(ma.rahmen), nb = normieren(mb.rahmen);
    var erg = dtw(na, nb);
    if (!erg) return { fehler: "zu-kurz" };
    var prozent = abstandZuProzent(erg.abstand);
    return {
      quelle: "frei",
      prozent: prozent,
      abstand: erg.abstand,
      /* Abweichungsprofil, auf 0..1 gebracht: für den Balken, der
         zeigt, WO es abweicht. */
      profil: profilGlaetten(erg.jeOriginal, mb.lautstaerke),
      schrittMs: mb.schrittMs,
      dauerEigeneMs: a.length / RATE * 1000,
      dauerOriginalMs: b.length / RATE * 1000
    };
  }

  /* Rohe Rahmenabstände sind zappelig. Über 5 Rahmen (50 ms)
     glätten, und Rahmen ohne Sprache ausblenden — sonst zeigt
     die Anzeige Ausschläge in der Stille. */
  function profilGlaetten(jeOriginal, lautstaerke) {
    var n = jeOriginal.length;
    if (!n) return [];
    var spitze = 0, i;
    for (i = 0; i < lautstaerke.length; i++) spitze = Math.max(spitze, lautstaerke[i]);
    var stumm = spitze * 0.06;
    var glatt = new Float64Array(n);
    var breite = 2;
    for (i = 0; i < n; i++) {
      var s = 0, z = 0;
      for (var k = -breite; k <= breite; k++) {
        var j = i + k;
        if (j < 0 || j >= n) continue;
        s += jeOriginal[j]; z++;
      }
      glatt[i] = s / z;
    }
    var maxi = 0;
    for (i = 0; i < n; i++) maxi = Math.max(maxi, glatt[i]);
    var raus = [];
    for (i = 0; i < n; i++) {
      var laut = i < lautstaerke.length ? lautstaerke[i] : 0;
      raus.push({
        wert: maxi ? glatt[i] / maxi : 0,
        gesprochen: laut > stumm
      });
    }
    return raus;
  }

  /* =========================================================
     TEIL D — HÜLLKURVE FÜR DIE WELLENFORM
     Zwei Wellenformen untereinander, auf dieselbe Länge gelegt:
     darum immer GENAU so viele Stützstellen, wie Punkte gezeichnet
     werden sollen — die Streckung passiert hier, nicht im CSS.
     ========================================================= */
  function huellkurve(puffer, punkte) {
    var d = einKanal(puffer);
    var n = punkte || 160;
    var raus = new Array(n);
    var breite = d.length / n;
    for (var i = 0; i < n; i++) {
      var von = Math.floor(i * breite), bis = Math.min(d.length, Math.floor((i + 1) * breite));
      var m = 0;
      for (var j = von; j < bis; j++) { var a = Math.abs(d[j]); if (a > m) m = a; }
      raus[i] = m;
    }
    var spitze = 0;
    for (var k = 0; k < n; k++) spitze = Math.max(spitze, raus[k]);
    if (spitze > 0) for (var k2 = 0; k2 < n; k2++) raus[k2] = raus[k2] / spitze;
    return raus;
  }

  /* =========================================================
     TEIL E — WAV BAUEN (für Azure)
     Azure nimmt am zuverlässigsten 16-bit-PCM-WAV, 16 kHz, mono.
     MediaRecorder liefert webm/opus. Darum: entpacken, umrechnen,
     als WAV neu zusammensetzen. Das passiert im Gerät.
     ========================================================= */
  function alsWav(puffer) {
    var daten = umrechnen(einKanal(puffer), puffer.sampleRate, RATE);
    var n = daten.length;
    var ab = new ArrayBuffer(44 + n * 2);
    var s = new DataView(ab);
    function text(pos, t) { for (var i = 0; i < t.length; i++) s.setUint8(pos + i, t.charCodeAt(i)); }
    text(0, "RIFF");
    s.setUint32(4, 36 + n * 2, true);
    text(8, "WAVE");
    text(12, "fmt ");
    s.setUint32(16, 16, true);
    s.setUint16(20, 1, true);          // PCM
    s.setUint16(22, 1, true);          // mono
    s.setUint32(24, RATE, true);
    s.setUint32(28, RATE * 2, true);   // Bytes je Sekunde
    s.setUint16(32, 2, true);          // Bytes je Rahmen
    s.setUint16(34, 16, true);         // Bits
    text(36, "data");
    s.setUint32(40, n * 2, true);
    for (var i = 0; i < n; i++) {
      var v = Math.max(-1, Math.min(1, daten[i]));
      s.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
    }
    return new Blob([ab], { type: "audio/wav" });
  }

  /* =========================================================
     TEIL F — AZURE AUSSPRACHEBEWERTUNG
     ---------------------------------------------------------
     REST, eine Anfrage. Aufbau nach der Microsoft-Beschreibung:
       POST https://<region>.stt.speech.microsoft.com
            /speech/recognition/conversation/cognitiveservices/v1
            ?language=de-DE&format=detailed
       Ocp-Apim-Subscription-Key: <schluessel>
       Pronunciation-Assessment: <base64 von JSON>
       Content-Type: audio/wav; codecs=audio/pcm; samplerate=16000
     Antwort: NBest[0].PronunciationAssessment (Gesamtnoten) und
     NBest[0].Words[] mit Syllables[] und Phonemes[] — DAS ist der
     Teil, auf den es ankommt.
     ========================================================= */

  function azureEinstellungen() {
    var s = { schluessel: "", region: "" };
    try {
      s.schluessel = localStorage.getItem("dma_azure_schluessel") || "";
      s.region = localStorage.getItem("dma_azure_region") || "";
    } catch (e) {}
    return s;
  }
  /* null  = löschen
     undefined = NICHT ändern
     Zeichenkette = setzen

     Der Unterschied ist wichtig und war schon einmal ein Fehler:
     das Schlüsselfeld in den Einstellungen wird aus Vorsicht leer
     angezeigt. Würde ein leeres Feld als „setze auf leer" gelesen,
     löschte ein Klick auf Speichern den Schlüssel, nur weil der
     Nutzer bloss die Region ändern wollte. */
  function azureEinstellungenSetzen(schluessel, region) {
    try {
      if (schluessel === null) localStorage.removeItem("dma_azure_schluessel");
      else if (schluessel !== undefined) localStorage.setItem("dma_azure_schluessel", String(schluessel).trim());
      if (region === null) localStorage.removeItem("dma_azure_region");
      else if (region !== undefined) localStorage.setItem("dma_azure_region", String(region).trim().toLowerCase());
    } catch (e) {}
  }
  function azureDa() {
    var s = azureEinstellungen();
    return Boolean(s.schluessel && s.region);
  }

  /* Merkt sich, dass das Kontingent leer ist — bis zum
     Monatsanfang. Sonst läuft der Trainer bei jedem Wort erneut
     in denselben 429 und wartet jedes Mal auf die Antwort. */
  var SPERRE_SCHLUESSEL = "dma_azure_gesperrt_bis";
  function gesperrtBis() {
    try {
      var v = localStorage.getItem(SPERRE_SCHLUESSEL);
      return v ? Number(v) : 0;
    } catch (e) { return 0; }
  }
  function istGesperrt() { return gesperrtBis() > Date.now(); }
  function sperren() {
    /* Bis zum ersten Tag des nächsten Monats: so steht es in der
       Azure-Abrechnung, und so sagt es die Oberfläche auch. */
    var jetzt = new Date();
    var naechster = new Date(jetzt.getFullYear(), jetzt.getMonth() + 1, 1, 0, 30, 0);
    try { localStorage.setItem(SPERRE_SCHLUESSEL, String(naechster.getTime())); } catch (e) {}
    return naechster;
  }
  function sperreLoesen() {
    try { localStorage.removeItem(SPERRE_SCHLUESSEL); } catch (e) {}
  }

  function base64(objekt) {
    var t = JSON.stringify(objekt);
    /* btoa kann kein UTF-8 — beim Referenztext mit „ö" wäre das
       sonst eine Ausnahme mitten in der Prüfung. */
    var bytes = new TextEncoder().encode(t);
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  /* Der Referenztext für Azure: OHNE Artikel wird nicht geprüft,
     WEIL der Artikel mitgesprochen wird — Azure würde ihn sonst
     als „ausgelassen" zählen und die Vollständigkeit einbrechen
     lassen. Was angezeigt wird, steht mit Artikel da, also wird
     auch mit Artikel geprüft. */
  function azureBewerten(optionen) {
    var o = optionen || {};
    var s = azureEinstellungen();
    if (!s.schluessel || !s.region) return Promise.resolve({ fehler: "kein-schluessel" });
    if (istGesperrt()) return Promise.resolve({ fehler: "kontingent", bis: new Date(gesperrtBis()) });
    if (!o.wav) return Promise.resolve({ fehler: "keine-aufnahme" });

    var kopf = {
      referenceText: String(o.text || ""),
      gradingSystem: "HundredMark",
      granularity: "Phoneme",
      /* Damit die Laut-Anzeige überhaupt etwas zu zeigen hat:
         Azure liefert Phoneme nur bei dieser Körnung, und die
         Silben nur, wenn man sie ausdrücklich anfordert. */
      phonemeAlphabet: "IPA",
      nBestPhonemeCount: 3,
      dimension: "Comprehensive",
      enableMiscue: false
    };
    var url = "https://" + s.region + ".stt.speech.microsoft.com" +
              "/speech/recognition/conversation/cognitiveservices/v1" +
              "?language=" + encodeURIComponent(o.sprache || "de-DE") +
              "&format=detailed";

    var abbruch = new AbortController();
    var uhr = setTimeout(function () { abbruch.abort(); }, o.zeitgrenze || 20000);

    return fetch(url, {
      method: "POST",
      signal: abbruch.signal,
      headers: {
        "Ocp-Apim-Subscription-Key": s.schluessel,
        "Pronunciation-Assessment": base64(kopf),
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Accept": "application/json"
      },
      body: o.wav
    }).then(function (antwort) {
      clearTimeout(uhr);
      if (antwort.status === 429) {
        var bis = sperren();
        return { fehler: "kontingent", bis: bis };
      }
      if (antwort.status === 401 || antwort.status === 403) return { fehler: "schluessel-falsch" };
      if (!antwort.ok) return { fehler: "dienst", status: antwort.status };
      return antwort.json().then(function (j) { return azureAuswerten(j, o.text); });
    }).catch(function (e) {
      clearTimeout(uhr);
      if (e && e.name === "AbortError") return { fehler: "zeit-abgelaufen" };
      return { fehler: "netz" };
    });
  }

  /* --- Die Azure-Antwort in unsere Anzeige übersetzen ---
     Azure schreibt Feldnamen gross ("NBest"), in manchen
     Fassungen klein ("nBest"). Beides wird genommen: an einem
     Namensunterschied soll die Laut-Anzeige nicht scheitern. */
  function hole(o, name) {
    if (!o) return undefined;
    if (o[name] !== undefined) return o[name];
    var klein = name.charAt(0).toLowerCase() + name.slice(1);
    if (o[klein] !== undefined) return o[klein];
    return undefined;
  }

  /* --- Die Noten herausholen, EGAL in welcher Schreibweise ---
     DAS war der Grund für „0 % Aussprache".
     Azure legt die Noten je nach Fassung des Dienstes an zwei
     verschiedene Stellen:

       A) im Unterobjekt:  NBest[0].PronunciationAssessment.PronScore
       B) flach daneben:   NBest[0].PronScore

     Gelesen wurde nur A. Kam eine Antwort in Schreibweise B —
     und das ist die, die die REST-Schnittstelle in mehreren
     Regionen zurückgibt — war das Unterobjekt leer. Der Wert
     landete als „nichts" in der Anzeige und wurde dort zu einer
     0. Nicht Azure hat 0 gemeldet: es stand gar nichts da.

     Darum wird ab jetzt an BEIDEN Stellen nachgesehen, und zwar
     auf jeder Ebene — Gesamtnote, Wort, Silbe, Laut. */
  function note(o, name) {
    if (!o) return null;
    var unter = hole(o, "PronunciationAssessment");
    var v = unter ? hole(unter, name) : undefined;
    if (v === undefined || v === null) v = hole(o, name);
    return zahl(v);
  }
  /* Textfelder (ErrorType) liegen genauso mal hier, mal dort. */
  function feld(o, name) {
    if (!o) return undefined;
    var unter = hole(o, "PronunciationAssessment");
    var v = unter ? hole(unter, name) : undefined;
    if (v === undefined || v === null) v = hole(o, name);
    return v;
  }

  function azureAuswerten(j, zielText) {
    if (hole(j, "RecognitionStatus") === "NoMatch" || hole(j, "RecognitionStatus") === "InitialSilenceTimeout") {
      return { fehler: "nichts-verstanden" };
    }
    var nbest = hole(j, "NBest");
    if (!nbest || !nbest.length) return { fehler: "nichts-verstanden" };
    var b = nbest[0];
    var woerter = (hole(b, "Words") || []).map(function (w) {
      var silben = (hole(w, "Syllables") || []).map(function (sy) {
        return {
          silbe: hole(sy, "Syllable") || "",
          gradient: hole(sy, "Grapheme") || "",
          note: note(sy, "AccuracyScore")
        };
      });
      var laute = (hole(w, "Phonemes") || []).map(function (ph) {
        var ppa = hole(ph, "PronunciationAssessment") || ph;
        var andere = (hole(ppa, "NBestPhonemes") || hole(ph, "NBestPhonemes") || []).map(function (n) {
          return { laut: hole(n, "Phoneme") || "", note: zahl(hole(n, "Score")) };
        });
        return {
          laut: hole(ph, "Phoneme") || "",
          note: note(ph, "AccuracyScore"),
          /* Das ist der Kern: Azure sagt nicht nur „schlecht",
             sondern welchen Laut es STATTDESSEN gehört hat.
             Daraus wird „dein ö klang wie ein o". */
          stattdessen: andere
        };
      });
      return {
        wort: hole(w, "Word") || "",
        note: note(w, "AccuracyScore"),
        fehlerart: feld(w, "ErrorType") || "None",
        silben: silben,
        laute: laute
      };
    });

    var gesamt = note(b, "PronScore");
    var genauigkeit = note(b, "AccuracyScore");
    var fluessigkeit = note(b, "FluencyScore");
    var vollstaendigkeit = note(b, "CompletenessScore");

    /* Zweites Auffangnetz: steht die Gesamtnote auch flach nicht
       da, aber die Wörter haben Noten, wird sie daraus gemittelt.
       Lieber ein aus den Wortnoten gerechneter Wert mit Hinweis
       als eine erfundene 0. */
    var ausWoertern = mittelNote(woerter);
    if (gesamt === null) gesamt = genauigkeit !== null ? genauigkeit : ausWoertern;
    if (genauigkeit === null) genauigkeit = ausWoertern;

    /* Und wenn wirklich NIRGENDS eine Zahl steht: dann ist das
       keine 0, sondern eine Antwort ohne Bewertung. Das muss die
       Oberfläche auch so sagen dürfen. */
    if (gesamt === null) {
      return {
        fehler: "keine-bewertung",
        erkannt: hole(b, "Display") || hole(b, "Lexical") || "",
        ziel: zielText || ""
      };
    }

    /* WELCHE ZAHL OBEN STEHT — und warum nicht die von Azure.
       GEMELDET: „Manchmal zeigt die Korrektur 33 %, obwohl man das
       Wort ganz sauber ausspricht."

       Azures „PronScore" ist ein Mischwert aus drei Dingen:
       Genauigkeit der Laute, Flüssigkeit UND Vollständigkeit. Die
       Vollständigkeit misst, ob ALLE Wörter des Vorlagetextes
       gesprochen wurden. Im Trainer steht als Vorlage aber „der
       Hund" — wer nur „Hund" sagt (und das tun die meisten), hat
       eines von zwei Wörtern gesagt: Vollständigkeit 50 %. Damit
       stürzt der Mischwert ab, obwohl jeder einzelne Laut sitzt.
       Genau das war die 33 %.

       Für eine Übung mit EINEM Wort ist die Genauigkeit die
       ehrliche Zahl — sie misst, was die Übung übt. Vollständigkeit
       und Flüssigkeit bleiben erhalten und stehen im Kleingedruckten;
       fehlt ein Wort, sagt der Trainer das als Satz, statt die Note
       heimlich zu drücken. */
    var ausgelassen = woerter.filter(function (w) { return w.fehlerart === "Omission"; })
                             .map(function (w) { return w.wort; });
    var angezeigt = (genauigkeit !== null) ? genauigkeit : gesamt;

    return {
      quelle: "azure",
      prozent: angezeigt,
      azureGesamt: gesamt,
      genauigkeit: genauigkeit,
      fluessigkeit: fluessigkeit,
      vollstaendigkeit: vollstaendigkeit,
      ausgelassen: ausgelassen,
      erkannt: hole(b, "Display") || hole(b, "Lexical") || "",
      ziel: zielText || "",
      woerter: woerter
    };
  }

  /* Mittel über die Wortnoten — nur über die, die wirklich eine
     Zahl haben. Ein Wort ohne Note darf den Schnitt nicht nach
     unten ziehen, als wäre es eine 0. */
  function mittelNote(woerter) {
    var summe = 0, zaehler = 0;
    (woerter || []).forEach(function (w) {
      if (typeof w.note === "number" && isFinite(w.note)) { summe += w.note; zaehler++; }
    });
    return zaehler ? Math.round(summe / zaehler) : null;
  }

  function zahl(v) {
    var n = Number(v);
    return isFinite(n) ? Math.round(n) : null;
  }


  /* =========================================================
     TEIL F2 — DER ZENTRALE WEG
     ---------------------------------------------------------
     DER AUFTRAG
     „Ich möchte, dass der Aussprache-Trainer für jeden, der auf
      der Seite angemeldet ist, benutzbar ist. Der Schlüssel wird
      einmal eingetragen und jeder kann ihn benutzen."

     WAS SICH DADURCH ÄNDERT — und was NICHT
     Die Seite kennt den Azure-Schlüssel nicht mehr. Sie schickt
     die Aufnahme an eine eigene Funktion auf dem Supabase-Server,
     und DIE spricht mit Azure. Der Schlüssel liegt dort in einer
     Tabelle, an die aus dem Browser niemand herankommt.

     NICHT geändert hat sich die Auswertung: was von Azure
     zurückkommt, wird mit DEMSELBEN azureAuswerten() gelesen wie
     vorher. Es gibt weiterhin nur eine Stelle, an der die Antwort
     verstanden wird — sonst liefen zwei Auswertungen langsam
     auseinander, und niemand merkte es.

     DER ALTE WEG BLEIBT
     Wer einen eigenen Schlüssel im Gerät eingetragen hat, kann
     ihn behalten; er wird genommen, wenn der zentrale gerade
     nicht erreichbar ist. Ein zweiter Weg kostet nichts und
     rettet den Abend, wenn der erste hakt.
     ========================================================= */

  var ZENTRALE = "/functions/v1/aussprache";

  function zentralMoeglich() {
    return Boolean(window.supabase && window.SUPABASE_CONFIG &&
                   window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey);
  }

  /* Ein eigener Supabase-Klient — NUR um an die Anmeldung
     heranzukommen. Er benutzt denselben Speicherplatz wie der in
     backend.js, also dieselbe Sitzung; backend.js wird dafür
     nicht angefasst. */
  var zKlient = null;
  function klientHolen() {
    if (zKlient) return zKlient;
    if (!zentralMoeglich()) return null;
    zKlient = window.supabase.createClient(
      window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey
    );
    return zKlient;
  }

  function anmeldeMarke() {
    var k = klientHolen();
    if (!k) return Promise.resolve("");
    return k.auth.getSession().then(function (a) {
      return (a && a.data && a.data.session && a.data.session.access_token) || "";
    }).catch(function () { return ""; });
  }

  /* Der Stand: gibt es einen zentralen Schlüssel, bin ich der
     Betreiber, wie viel habe ich heute verbraucht?
     Wird gemerkt, damit nicht bei jedem Wort neu gefragt wird —
     das wären zehn überflüssige Anfragen je Runde. */
  var standDaten = null;
  var standLaeuft = null;
  function zentralStand(neuLaden) {
    if (standDaten && !neuLaden) return Promise.resolve(standDaten);
    if (standLaeuft && !neuLaden) return standLaeuft;
    standLaeuft = zentralRufen({ aktion: "stand" }).then(function (a) {
      standDaten = a && !a.fehler ? a : { zentralDa: false, betreiber: false, nichtAngemeldet: Boolean(a && a.fehler === "nicht-angemeldet") };
      standLaeuft = null;
      return standDaten;
    }).catch(function () {
      standDaten = { zentralDa: false, betreiber: false };
      standLaeuft = null;
      return standDaten;
    });
    return standLaeuft;
  }
  function zentralStandJetzt() { return standDaten; }
  function zentralDa() { return Boolean(standDaten && standDaten.zentralDa); }
  function zentralVergessen() { standDaten = null; standLaeuft = null; }

  /* Eine Anfrage an die Funktion. `roh` heisst: die Antwort ist
     kein JSON, sondern Ton — dann wird der Blob zurückgegeben. */
  function zentralRufen(koerper, roh) {
    if (!zentralMoeglich()) return Promise.resolve({ fehler: "keine-verbindung" });
    return anmeldeMarke().then(function (marke) {
      if (!marke) return { fehler: "nicht-angemeldet" };
      var abbruch = new AbortController();
      var uhr = setTimeout(function () { abbruch.abort(); }, koerper.zeitgrenze || 25000);
      return fetch(window.SUPABASE_CONFIG.url.replace(/\/+$/, "") + ZENTRALE, {
        method: "POST",
        signal: abbruch.signal,
        headers: {
          "Authorization": "Bearer " + marke,
          "apikey": window.SUPABASE_CONFIG.anonKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(koerper)
      }).then(function (antwort) {
        clearTimeout(uhr);
        if (roh && antwort.ok) return antwort.blob();
        return antwort.json().catch(function () { return { fehler: "antwort-unlesbar" }; });
      }).catch(function (e) {
        clearTimeout(uhr);
        return { fehler: e && e.name === "AbortError" ? "zeit-abgelaufen" : "netz" };
      });
    });
  }

  /* Ein WAV in Base64. In Stücken, nicht am Stück:
     String.fromCharCode.apply() mit 200.000 Argumenten bringt den
     Browser zum Absturz — das ist kein theoretischer Fall, eine
     Aufnahme von drei Sekunden hat genau diese Grösse. */
  function alsBase64(blob) {
    return blob.arrayBuffer().then(function (puffer) {
      var bytes = new Uint8Array(puffer);
      var s = "", stueck = 8192;
      for (var i = 0; i < bytes.length; i += stueck) {
        s += String.fromCharCode.apply(null, bytes.subarray(i, i + stueck));
      }
      return btoa(s);
    });
  }

  /* --- Bewerten über die Zentrale --- */
  function zentralBewerten(optionen) {
    var o = optionen || {};
    if (!o.wav) return Promise.resolve({ fehler: "keine-aufnahme" });
    return alsBase64(o.wav).then(function (b64) {
      return zentralRufen({
        aktion: "bewerten",
        wav: b64,
        text: String(o.text || ""),
        sprache: o.sprache || "de-DE",
        zeitgrenze: o.zeitgrenze || 25000
      });
    }).then(function (a) {
      if (!a) return { fehler: "netz" };
      if (a.fehler) return { fehler: a.fehler === "tagesgrenze" ? "tagesgrenze" : a.fehler };
      /* DIESELBE Auswertung wie beim eigenen Schlüssel. */
      return azureAuswerten(a, o.text);
    });
  }

  /* --- Vorlesen mit Azures neuronaler Stimme ---
     Was einmal geholt wurde, bleibt für diese Sitzung im
     Speicher. Ohne das kostet jedes „noch einmal vorsprechen"
     eine neue Anfrage, und die Monatsmenge wäre an einem
     Nachmittag weg. */
  var stimmenLager = {};
  function zentralVorlesen(optionen) {
    var o = optionen || {};
    var text = String(o.text || "").trim();
    if (!text) return Promise.resolve(null);
    var schrank = text + "|" + (o.sprache || "de-DE") + "|" + (o.langsam ? "l" : "n");
    if (stimmenLager[schrank]) return Promise.resolve(stimmenLager[schrank]);
    return zentralRufen({
      aktion: "vorlesen", text: text,
      sprache: o.sprache || "de-DE", langsam: Boolean(o.langsam)
    }, true).then(function (a) {
      if (!a || a.fehler || !(a instanceof Blob)) return null;
      return tonLesen(a).then(function (puffer) {
        stimmenLager[schrank] = puffer;
        return puffer;
      }).catch(function () { return null; });
    }).catch(function () { return null; });
  }

  /* --- Den Schlüssel eintragen (nur Betreiber) --- */
  function zentralSchluesselSetzen(schluessel, region) {
    return zentralRufen({
      aktion: "schluessel-setzen",
      schluessel: String(schluessel || "").trim(),
      region: String(region || "").trim().toLowerCase()
    }).then(function (a) { zentralVergessen(); return a; });
  }
  function zentralSchluesselLoeschen() {
    return zentralRufen({ aktion: "schluessel-loeschen" }).then(function (a) {
      zentralVergessen(); return a;
    });
  }

  /* =========================================================
     STUFE 1 — EIN EINGANG FÜR BEIDE WEGE
     ---------------------------------------------------------
     Der Rest der App soll nicht wissen müssen, ob der Schlüssel
     zentral liegt oder im Gerät. Sie fragt: „geht Stufe 1?" und
     „bewerte das". Welcher Weg genommen wird, entscheidet sich
     hier — und zwar in dieser Reihenfolge:

       1. ZENTRAL, wenn möglich. Das ist der Weg, den alle
          anderen auch gehen. Wer als Betreiber prüft, soll
          genau das prüfen, was seine Lernenden erleben.
       2. Der eigene Schlüssel im Gerät, wenn die Zentrale
          nichts hat oder nicht antwortet.
     ========================================================= */
  function stufe1Da() {
    if (zentralDa()) return true;
    return azureDa() && !istGesperrt();
  }

  function stufe1Bewerten(optionen) {
    var o = optionen || {};
    if (zentralDa()) {
      return zentralBewerten(o).then(function (erg) {
        /* Hakt die Zentrale, wird der eigene Schlüssel versucht —
           aber nur, wenn wirklich einer da ist. Sonst wandert der
           Fehler unverändert nach oben, damit die Oberfläche ihn
           benennen kann. */
        var hakt = erg && erg.fehler &&
                   ["netz", "zeit-abgelaufen", "dienst", "kein-zentraler-schluessel", "antwort-unlesbar"].indexOf(erg.fehler) >= 0;
        if (hakt && azureDa() && !istGesperrt()) return azureBewerten(o);
        return erg;
      });
    }
    return azureBewerten(o);
  }

  /* =========================================================
     TEIL G — LAUTE IN KLARTEXT
     ---------------------------------------------------------
     Azure gibt IPA zurück („øː"). „Dein øː war ein oː" hilft
     niemandem. Darum eine Übersetzung in das, was auf der
     Tastatur steht und im Wort zu sehen ist.
     ========================================================= */
  var LAUTNAMEN = {
    "aː": "langes a", "a": "kurzes a", "ɐ": "a wie in „besser“", "ɐ̯": "r am Ende (wie ein a)",
    "eː": "langes e", "ɛ": "kurzes e (wie in „Bett“)", "ɛː": "langes ä", "ə": "unbetontes e (wie in „bitte“)",
    "iː": "langes i (ie)", "ɪ": "kurzes i",
    "oː": "langes o", "ɔ": "kurzes o",
    "uː": "langes u", "ʊ": "kurzes u",
    "øː": "langes ö", "œ": "kurzes ö",
    "yː": "langes ü", "ʏ": "kurzes ü",
    "aɪ": "ei", "aʊ": "au", "ɔʏ": "eu/äu",
    "b": "b", "d": "d", "f": "f", "g": "g", "h": "h", "j": "j", "k": "k", "l": "l",
    "m": "m", "n": "n", "ŋ": "ng", "p": "p", "s": "scharfes s (ß)", "z": "stimmhaftes s (wie in „Rose“)",
    "t": "t", "v": "w", "w": "w", "x": "ch wie in „Bach“", "ç": "ch wie in „ich“",
    "ʃ": "sch", "ʒ": "j wie in „Journal“", "ʁ": "r", "r": "r", "ts": "z (ts)", "tʃ": "tsch",
    "pf": "pf", "ʔ": "Knacklaut"
  };
  function lautName(ipa) {
    if (!ipa) return "";
    if (LAUTNAMEN[ipa]) return LAUTNAMEN[ipa];
    var ohneLaenge = ipa.replace(/ː/g, "");
    if (LAUTNAMEN[ohneLaenge]) return LAUTNAMEN[ohneLaenge];
    return ipa;
  }

  /* Aus einem Laut mit schlechter Note einen Satz machen, der
     weiterbringt. Ohne Alternative bleibt es bei „saß nicht" —
     erfunden wird nichts. */
  function lautKlartext(laut) {
    var soll = lautName(laut.laut);
    var beste = null;
    (laut.stattdessen || []).forEach(function (a) {
      if (!a.laut || a.laut === laut.laut) return;
      if (!beste || (a.note || 0) > (beste.note || 0)) beste = a;
    });
    if (beste && (beste.note || 0) > (laut.note || 0)) {
      return "dein " + soll + " klang wie " + lautMitArtikel(lautName(beste.laut));
    }
    return "das " + soll + " saß nicht";
  }
  function lautMitArtikel(name) {
    if (/^(langes|kurzes|unbetontes|scharfes|stimmhaftes)/.test(name)) return "ein " + name;
    return "ein „" + name + "“";
  }

  /* Noten in Farben — dieselbe Ampel wie im Rest der App. */
  function noteFarbe(note) {
    if (note === null || note === undefined) return "var(--ausspr-grau, #9aa0a6)";
    if (note >= 80) return "#4FA88E";
    if (note >= 60) return "#E8A33D";
    return "#E85F6F";
  }

  return {
    /* Aufnahme */
    mikrofonDa: mikrofonDa,
    aufnahmeStarten: aufnahmeStarten,
    HOECHSTDAUER_MS: HOECHSTDAUER_MS,
    /* Ton */
    tonLesen: tonLesen,
    alsWav: alsWav,
    huellkurve: huellkurve,
    /* Stufe 2 */
    merkmale: merkmale,
    normieren: normieren,
    dtw: dtw,
    freieBewertung: freieBewertung,
    freieBewertungAusPuffern: freieBewertungAusPuffern,
    abstandZuProzent: abstandZuProzent,
    EICHUNG: EICHUNG,
    /* Stufe 1 — der gemeinsame Eingang */
    /* Nach aussen gegeben, damit sich die Auswertung MESSEN laesst:
       eine Azure-Antwort hinein, die angezeigte Zahl heraus. Ohne das
       liesse sich nicht pruefen, ob die Note stimmt. */
    azureAuswerten: azureAuswerten,
    stufe1Da: stufe1Da,
    stufe1Bewerten: stufe1Bewerten,
    /* Stufe 1 — zentral */
    zentralMoeglich: zentralMoeglich,
    zentralStand: zentralStand,
    zentralStandJetzt: zentralStandJetzt,
    zentralDa: zentralDa,
    zentralVergessen: zentralVergessen,
    zentralVorlesen: zentralVorlesen,
    zentralSchluesselSetzen: zentralSchluesselSetzen,
    zentralSchluesselLoeschen: zentralSchluesselLoeschen,
    /* Stufe 1 — eigener Schlüssel im Gerät */
    azureDa: azureDa,
    azureEinstellungen: azureEinstellungen,
    azureEinstellungenSetzen: azureEinstellungenSetzen,
    azureBewerten: azureBewerten,
    azureAuswerten: azureAuswerten,
    istGesperrt: istGesperrt,
    gesperrtBis: gesperrtBis,
    sperreLoesen: sperreLoesen,
    /* Anzeige-Helfer */
    lautName: lautName,
    lautKlartext: lautKlartext,
    noteFarbe: noteFarbe
  };
})();
