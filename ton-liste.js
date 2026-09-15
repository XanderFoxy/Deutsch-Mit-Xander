/* =========================================================
   TON-LISTE — was vorproduziert wird und was nicht
   ---------------------------------------------------------
   EINE Datei entscheidet, welche Texte eine vorproduzierte
   Sprachaufnahme bekommen. Der Erzeuger (werkzeug/ton-bauen.js)
   liest sie, und die App liest sie auch — sonst weichen die
   Schlüssel der Sprite-Tabelle irgendwann von dem ab, was
   wirklich erzeugt wurde.

   Läuft in Node und im Browser. Kein Zustand, keine Netzwerk-
   zugriffe, nur reine Funktionen.

   WAS DRIN IST
     * das Wort mit Artikel (Feld "word"), bis 30 Zeichen
     * echte Beispielsätze (Feld "example")

   WAS DRAUSSEN BLEIBT — und warum
     * Grammatik-Notizen im Feld "example". Der erzeugte Teil des
       Wörterbuchs (DMA_VOKABELN_ZUSATZ) hat bei gebeugten Formen
       keinen Beispielsatz, sondern einen Satz ÜBER das Wort:
       „Die Form „abbrachte" gehört zu „abbringen" (Präteritum)."
       Das ist als Sprachaufnahme wertlos und kostet Geld.
     * Wörterbuch-Erklärungen (Feld "de"). „die höchste Stelle
       eines Berges" ist eine Definition, kein Hörbeispiel.
     * Alles, was der Satzbaukasten erst im Browser
       zusammensetzt. Das steht gar nicht in den Daten.
     * Die Lesetexte des Kalenders („Es war einmal in
       Deutschland"). 366 Tage × 6 Niveaus. Bewusst nicht.
   ========================================================= */
(function (wurzel) {
  "use strict";

  var HOECHSTLAENGE_WORT = 30;

  /* ---- Grammatik-Notizen erkennen -------------------------
     Absichtlich AM ANFANG verankert (^) statt irgendwo im Satz
     gesucht. Sonst fliegen echte Sätze mit heraus:
       „Die Altstadt gehört zum Weltkulturerbe."       (echt)
       „Der Plural von Haus ist Häuser."               (echt, Sprachthema)
       „Bei starken Verben ändert sich die Wortform
        im Präteritum."                                (echt, Sprachthema)
     Die Notizen haben eine feste, erzeugte Form. Genau die
     wird getroffen, nichts daneben.
     „…" ist U+201E / U+201C; die Daten verwenden beide, und in
     älteren Dateien stehen auch gerade Anführungszeichen. Alle
     Varianten stehen darum im Zeichenvorrat.
  */
  var A = "[„“”«»\"'‘’]"; // ein Anführungszeichen, egal welches

  var NOTIZ_MUSTER = [
    // Die Form „X" gehört zu „Y" (Partizip II).
    new RegExp("^Die Form\\s*" + A),
    // „X" ist aus „A" und „B" zusammengesetzt.
    new RegExp("^" + A + ".{1,60}" + A + "\\s+ist\\s+aus\\s"),
    // „X" ist von „Y" abgeleitet.
    new RegExp("^" + A + ".{1,60}" + A + "\\s+ist\\s+von\\s"),
    // „X" ist mit der Vorsilbe un- von „Y" gebildet.
    new RegExp("^" + A + ".{1,60}" + A + "\\s+ist\\s+mit\\s+der\\s+(Vorsilbe|Nachsilbe)\\s"),
    // „X" ist die substantivierte Form von „Y".
    new RegExp("^" + A + ".{1,60}" + A + "\\s+ist\\s+die\\s+substantivierte\\s"),
    // „X" ist der Plural von „Y".
    new RegExp("^" + A + ".{1,60}" + A + "\\s+ist\\s+(der|die|das)\\s+Plural\\s+von\\s"),
    // „X" ist die Steigerung / der Superlativ von „Y".
    new RegExp("^" + A + ".{1,60}" + A + "\\s+ist\\s+(der|die|das)\\s+(Superlativ|Komparativ|Steigerung)\\s"),
    // In der Übung ist „X" die falsche Antwort; richtig ist dort „Y".
    /^In der (Übung|Aufgabe) ist\s/,
    // Die Schreibweise „X" …  /  Die schweizerische Schreibweise …
    new RegExp("^Die (schweizerische |österreichische )?Schreibweise\\s*" + A),
    // Mit der Vorsilbe be- wird aus arbeiten bearbeiten.  (Notiz über eine Silbe)
    /^Mit (der|dem) (Vorsilbe|Nachsilbe|Suffix|Präfix)\s/,
    // Die Vorsilbe bleibt hier unbetont.
    /^Die (Vorsilbe|Nachsilbe|Endung|Wortform|Grundform) /,
    // „X" ist die 3. Person Singular von „Y".
    new RegExp("^" + A + ".{1,60}" + A + "\\s+ist\\s+die\\s+\\d\\.\\s*Person\\s")
  ];

  function istGrammatikNotiz(satz) {
    if (!satz) return true;
    var s = String(satz).trim();
    if (!s) return true;
    for (var i = 0; i < NOTIZ_MUSTER.length; i++) {
      if (NOTIZ_MUSTER[i].test(s)) return true;
    }
    return false;
  }

  /* ---- Wort mit Artikel: sprechbar? ----------------------- */
  function wortSprechbar(wort) {
    if (!wort) return false;
    var w = String(wort).trim();
    if (!w) return false;
    if (w.length > HOECHSTLAENGE_WORT) return false;   // Erklärung, kein Wort
    if (!/[A-Za-zÄÖÜäöüß]/.test(w)) return false;      // reine Zahl oder Zeichen
    return true;
  }

  /* ---- Schlüssel: kurz, stabil, dateisystemfreundlich -----
     Der Schlüssel landet in der Sprite-Tabelle und in der App.
     Er muss über Neuläufe des Erzeugers hinweg gleich bleiben,
     darum wird er aus dem Text selbst berechnet, nicht aus
     einer laufenden Nummer.
  */
  function schluessel(text) {
    var s = String(text);
    // Zwei FNV-1a-Durchläufe mit verschiedenem Startwert, einmal
    // vorwärts und einmal rückwärts — zusammen 64 bit. Mit 32 bit
    // allein gab es bei 71 664 Stücken tatsächlich eine Kollision
    // (gemessen, nicht befürchtet); bei 64 bit liegt die
    // Wahrscheinlichkeit unter 1 zu 70 Millionen.
    var h1 = 0x811c9dc5, h2 = 0x01000193, i, c;
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      h1 ^= c;
      h1 = (h1 + ((h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24))) >>> 0;
    }
    for (i = s.length - 1; i >= 0; i--) {
      c = s.charCodeAt(i);
      h2 ^= (c + i) & 0xffff;
      h2 = (h2 + ((h2 << 1) + (h2 << 5) + (h2 << 9) + (h2 << 13) + (h2 << 21))) >>> 0;
    }
    return ("0000000" + h1.toString(16)).slice(-8) + ("0000000" + h2.toString(16)).slice(-8);
  }

  /* ---- Bereichsname aus dem Thema -------------------------
     Eine Tondatei JE BEREICH. Der Bereich ist das Thema des
     Wörterbuchs, damit beim Öffnen eines Themas genau eine
     Tondatei geladen wird — dieselbe Aufteilung, die das
     Wörterbuch selbst schon hat.
  */
  function bereichName(thema) {
    return String(thema || "sonstiges")
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /* ---- Aus den Wörterbuch-Einträgen die Sprechliste bauen --
     Gibt zurück:
       { stuecke: [ {id, text, art, bereich, wort} ], statistik: {...} }
     art ist "wort" oder "satz".
  */
  function sprechliste(eintraege) {
    var stuecke = [];
    var gesehen = Object.create(null);
    var st = {
      eintraege: 0,
      wortBehalten: 0, wortZeichen: 0, wortZuLang: 0, wortDoppelt: 0,
      satzBehalten: 0, satzZeichen: 0, satzNotiz: 0, satzNotizZeichen: 0, satzDoppelt: 0
    };
    var notizBeispiele = [], behaltenBeispiele = [];

    for (var i = 0; i < eintraege.length; i++) {
      var e = eintraege[i];
      st.eintraege++;
      var bereich = bereichName(e.theme || e.__thema);

      // --- das Wort mit Artikel
      if (e.word) {
        if (!wortSprechbar(e.word)) {
          st.wortZuLang++;
        } else {
          var kw = "w:" + e.word;
          if (gesehen[kw]) { st.wortDoppelt++; }
          else {
            gesehen[kw] = 1;
            st.wortBehalten++; st.wortZeichen += e.word.length;
            stuecke.push({ id: schluessel(e.word), text: e.word, art: "wort", bereich: bereich, wort: e.word });
          }
        }
      }

      // --- der Beispielsatz
      if (e.example) {
        if (istGrammatikNotiz(e.example)) {
          st.satzNotiz++; st.satzNotizZeichen += e.example.length;
          if (notizBeispiele.length < 40) notizBeispiele.push(e.example);
        } else {
          var ks = "s:" + e.example;
          if (gesehen[ks]) { st.satzDoppelt++; }
          else {
            gesehen[ks] = 1;
            st.satzBehalten++; st.satzZeichen += e.example.length;
            if (behaltenBeispiele.length < 40) behaltenBeispiele.push(e.example);
            stuecke.push({ id: schluessel(e.example), text: e.example, art: "satz", bereich: bereich, wort: e.word });
          }
        }
      }
    }

    st.zeichenGesamt = st.wortZeichen + st.satzZeichen;
    return { stuecke: stuecke, statistik: st, notizBeispiele: notizBeispiele, behaltenBeispiele: behaltenBeispiele };
  }

  /* =========================================================
     SPRITE-TABELLE ABSPIELEN — nur im Browser
     ---------------------------------------------------------
     Eine Tondatei je Bereich, dazu eine Tabelle mit GEMESSENEN
     Anfangs- und Endzeiten (ffprobe je Einzelstück, vor dem
     Kleben — nichts geschätzt). Abgespielt wird über ein
     einziges <audio>-Element je Bereich, das an die richtige
     Stelle gesetzt und nach der Länge des Stücks gestoppt wird.

     Warum kein Web-Audio-Puffer? Der wäre genauer, müsste aber
     die ganze Datei (1–2 MB) entpacken und im Speicher halten.
     Auf einem älteren Telefon ist das die teure Lösung. Das
     <audio>-Element lädt über HTTP-Bereichsanfragen nur, was es
     braucht.

     Aufbau von ton/<bereich>.json:
       { "bereich": "alltag-zuhause",
         "dateien": [ { "datei": "ton/alltag-zuhause-1.opus",
                        "ersatz": "ton/alltag-zuhause-1.m4a",
                        "stuecke": { "<id>": [startMs, dauerMs] } } ] }
     ========================================================= */
  var spriteTabellen = Object.create(null);   // bereich -> Tabelle
  var spriteLaeuft = Object.create(null);
  var spriteElemente = Object.create(null);   // datei -> <audio>
  var spriteFehlt = Object.create(null);
  var TON_ORDNER = "ton/";

  function opusGeht() {
    try {
      var a = document.createElement("audio");
      return Boolean(a.canPlayType && a.canPlayType('audio/ogg; codecs="opus"'));
    } catch (e) { return false; }
  }

  /* Die Tabelle eines Bereichs holen. Fehlt sie, wird das gemerkt
     und nicht bei jedem Wort erneut versucht — sonst hagelt es
     404er, solange die Tondateien noch nicht hochgeladen sind. */
  function tabelleLaden(bereich) {
    if (spriteTabellen[bereich]) return Promise.resolve(spriteTabellen[bereich]);
    if (spriteFehlt[bereich]) return Promise.resolve(null);
    if (spriteLaeuft[bereich]) return spriteLaeuft[bereich];
    var url = TON_ORDNER + bereich + ".json?v=" + (window.DMA_VERSION || "1");
    spriteLaeuft[bereich] = fetch(url).then(function (a) {
      if (!a.ok) throw new Error("fehlt");
      return a.json();
    }).then(function (t) {
      spriteTabellen[bereich] = t;
      return t;
    }).catch(function () {
      spriteFehlt[bereich] = 1;
      return null;
    });
    return spriteLaeuft[bereich];
  }

  /* Wo liegt ein Stück? -> { datei, startMs, dauerMs } oder null */
  function stueckFinden(tabelle, id) {
    if (!tabelle || !tabelle.dateien) return null;
    for (var i = 0; i < tabelle.dateien.length; i++) {
      var d = tabelle.dateien[i];
      var s = d.stuecke && d.stuecke[id];
      if (s) {
        var datei = (!opusGeht() && d.ersatz) ? d.ersatz : d.datei;
        return { datei: datei, startMs: s[0], dauerMs: s[1] };
      }
    }
    return null;
  }

  function elementFuer(datei) {
    if (spriteElemente[datei]) return spriteElemente[datei];
    var a = new Audio();
    a.src = datei + "?v=" + (window.DMA_VERSION || "1");
    a.preload = "none";
    spriteElemente[datei] = a;
    return a;
  }

  var laufenderStopp = null;

  /* Ein Stück abspielen.
     optionen.tempo — 0,6 für „langsamer abspielen".
     Auflösung: Promise, das fertig wird, wenn das Stück zu Ende
     ist (damit „beide hintereinander" ohne Raten geht). */
  function abspielen(bereich, id, optionen) {
    var o = optionen || {};
    return tabelleLaden(bereich).then(function (t) {
      var s = stueckFinden(t, id);
      if (!s) return { fehler: "kein-ton" };
      var a = elementFuer(s.datei);
      if (laufenderStopp) { laufenderStopp(); laufenderStopp = null; }
      a.playbackRate = o.tempo || 1;
      /* preservesPitch aus: beim langsamen Abspielen soll die
         Tonhöhe fallen wie bei einer Schallplatte — dann hört man
         die Laute einzeln. Mit Tonhöhenkorrektur klingt es
         verwaschen. */
      try { a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false; } catch (e) {}
      a.currentTime = s.startMs / 1000;
      return new Promise(function (loesen) {
        var uhr = null;
        var schluss = function () {
          if (uhr) clearTimeout(uhr);
          a.removeEventListener("timeupdate", pruefen);
          try { a.pause(); } catch (e) {}
          laufenderStopp = null;
          loesen({ ok: true });
        };
        var endeSek = (s.startMs + s.dauerMs) / 1000;
        var pruefen = function () { if (a.currentTime >= endeSek) schluss(); };
        a.addEventListener("timeupdate", pruefen);
        laufenderStopp = schluss;
        /* timeupdate kommt nur etwa vier Mal je Sekunde — für ein
           kurzes Wort zu grob. Darum zusätzlich eine Uhr, die
           nach der gemessenen Dauer zuschlägt. */
        uhr = setTimeout(schluss, s.dauerMs / (o.tempo || 1) + 60);
        var p = a.play();
        if (p && p.catch) p.catch(function () { schluss(); });
      });
    });
  }

  function stoppen() { if (laufenderStopp) { laufenderStopp(); laufenderStopp = null; } }

  /* Gibt es für diesen Text eine vorproduzierte Aufnahme?
     Wird gebraucht, um zwischen „echte Aufnahme" und
     „Gerätestimme" zu entscheiden — und um dem Nutzer ehrlich zu
     sagen, welche von beiden er gerade hört. */
  function tonDa(bereich, id) {
    return tabelleLaden(bereich).then(function (t) {
      return Boolean(stueckFinden(t, id));
    });
  }

  /* Die Adresse eines Stücks als Bereichsangabe — für die
     Ausspracheprüfung, die den Ton als Datei braucht und nicht
     als Element. */
  function stueckAdresse(bereich, id) {
    return tabelleLaden(bereich).then(function (t) {
      var s = stueckFinden(t, id);
      if (!s) return null;
      return { datei: s.datei, startMs: s.startMs, dauerMs: s.dauerMs };
    });
  }

  var API = {
    HOECHSTLAENGE_WORT: HOECHSTLAENGE_WORT,
    istGrammatikNotiz: istGrammatikNotiz,
    wortSprechbar: wortSprechbar,
    schluessel: schluessel,
    bereichName: bereichName,
    sprechliste: sprechliste,
    /* Abspielen (nur im Browser sinnvoll) */
    abspielen: abspielen,
    stoppen: stoppen,
    tonDa: tonDa,
    stueckAdresse: stueckAdresse,
    tabelleLaden: tabelleLaden,
    opusGeht: opusGeht
  };

  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (wurzel) wurzel.TonListe = API;
})(typeof window !== "undefined" ? window : null);
