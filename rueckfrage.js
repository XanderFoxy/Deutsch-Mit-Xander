/* =========================================================
   DAS WALKIE-TALKIE — RUECKFRAGEN AN DEN BETREIBER
   ---------------------------------------------------------
   XANDER (23.09.2026): „dass ich praktisch immer wieder ein
   Pop-up bekomme, in dem Moment, wenn du etwas brauchst … nach
   Beendigung einiger Aufgaben, dass du wissen willst, ob das
   jetzt für mich passt … ich sag dann entweder ja oder nein, und
   wenn du dann noch mal fragst, was nicht stimmt, dass du
   Auswahl-Antworten hast … und ich einfach das anklicke …
   vielleicht auch multiple Sachen."

   UMBAU (derselbe Abend) — seine Beschwerden an der ersten Karte:
   „die Karte verdeckt … die Schaltfläche vom Klassenzimmer" und
   die Leiter, „auf Android über den ganzen unteren Rand",
   „zweimal Später gedrückt, und die Fragen waren weg", und „ich
   wusste nicht, was ‚Karte unten links' heißen soll".
   Sein Wunsch: „vielleicht machst du das wie ein Club-Menü an der
   Seite … dass ich das Walkie-Talkie aufklappen kann … wie beim
   Tutor", „das Walkie-Talkie muss wieder auftauchen", wenn er
   neu lädt.

   SO IST ES JETZT
   • Am LINKEN Rand ein kleiner Reiter „📻" (der Tutor-Reiter sitzt
     rechts). Er verdeckt nichts: 34 × 44 Pixel am Rand, und
     solange man im Chat schreibt, ist er ganz weg.
   • Antippen klappt die Leiste auf, ✕ oder der Reiter klappt sie
     wieder zu. Ob sie offen war, merkt sich der Browser — nach
     dem Neuladen steht sie wieder so da.
   • „Später" legt nichts mehr weg: es blaettert nur zur naechsten
     Frage. Offen bleibt eine Frage, bis sie gesendet ist. Was
     schon angekreuzt war, bleibt auch nach dem Neuladen stehen.
   • Jede Frage hat die drei Stufen, die er genannt hat:
       „komplett fertig" / „erst mal okay, später nochmal prüfen" /
       „geht nicht, überarbeiten"
     und darunter zum Mehrfach-Ankreuzen „verstehe ich nicht",
     „muss später prüfen (niemand im Raum)", „taucht gar nicht
     auf", „Glitch", „andere sehen es nicht" — dazu, was die Frage
     selbst noch anbietet, und ein freies Feld „etwas anderes".
     Es gibt kein „Nein" mehr, das Haekchen verschluckt: alles
     steht gleichzeitig da, und gesendet wird genau das.
   • „📍 Wo testen" sagt bei jeder Frage, wo man es findet.
   • 🎤 diktiert ins Textfeld (die Spracherkennung des Browsers),
     wenn man lieber spricht als tippt.
   • Oben steht, woran Claude gerade arbeitet; unten kann er
     jederzeit selbst etwas schicken — auch mitten im Livestream.

   Alles liest und schreibt nur der BETREIBER: die Tabellen geben
   niemand anderem etwas heraus (Zeilenschutz: profiles.is_owner).
   ========================================================= */
window.Rueckfrage = (function () {
  "use strict";

  var TAKT = 20000;
  var TAKT_OFFEN = 8000;
  var SPEICHER_OFFEN = "dma_funk_offen";
  var SPEICHER_ENTWURF = "dma_funk_entwurf";
  var SPEICHER_STELLE = "dma_funk_stelle";

  /* Seine Worte, in seiner Reihenfolge. */
  var STUFEN = [
    ["fertig", "✅ Komplett fertig"],
    ["okay", "🟡 Erst mal okay – später nochmal prüfen"],
    ["ueberarbeiten", "❌ Geht nicht – überarbeiten"]
  ];
  var IMMER = [
    "Verstehe die Frage nicht",
    "Muss ich später prüfen (niemand im Raum)",
    "Effekt taucht gar nicht auf",
    "Glitch / ruckelt",
    "Andere sehen es nicht"
  ];

  var reiter = null, leiste = null;
  var fragen = [];
  var funk = [];
  var stelle = 0;
  var laeuft = false;
  var uhr = null;
  var zuletztGesehen = "";
  var entwurf = lesen(SPEICHER_ENTWURF, {});

  function lesen(schluessel, sonst) {
    try {
      var w = localStorage.getItem(schluessel);
      return w == null ? sonst : JSON.parse(w);
    } catch (e) { return sonst; }
  }
  function merken(schluessel, wert) {
    try { localStorage.setItem(schluessel, JSON.stringify(wert)); } catch (e) {}
  }

  function istBetreiber() {
    try {
      return typeof Backend !== "undefined" && Boolean(Backend.isOwner && Backend.isOwner());
    } catch (e) { return false; }
  }
  function zugang() {
    try { return Backend.zugang ? Backend.zugang() : null; } catch (e) { return null; }
  }
  function istOffen() { return Boolean(lesen(SPEICHER_OFFEN, false)); }

  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text != null) e.textContent = text;
    return e;
  }
  function knopf(klasse, text, tun) {
    var b = el("button", klasse, text);
    b.type = "button";
    b.addEventListener("click", tun);
    return b;
  }
  /* Ein Klick in die Leiste darf nicht durchgreifen — auch nicht
     auf einen Platz dahinter. Genau das war seine Beschwerde bei
     den anderen Panels. */
  function abschirmen(e) {
    ["pointerdown", "click", "touchstart"].forEach(function (t) {
      e.addEventListener(t, function (ev) { ev.stopPropagation(); }, { passive: true });
    });
  }

  /* ---------- Holen ---------- */
  function holen() {
    if (!istBetreiber()) { weg(); return; }
    var sb = zugang();
    if (!sb || laeuft) return;
    laeuft = true;
    var a = sb.from("betreiber_rueckfragen")
      .select("id, thema, frage, art, optionen, wo")
      .is("beantwortet", null)
      .order("id", { ascending: true })
      .limit(60);
    var b = sb.from("betreiber_funk")
      .select("id, erstellt, von, text, gelesen")
      .order("id", { ascending: false })
      .limit(20);
    Promise.all([a, b]).then(function (r) {
      laeuft = false;
      if (!r[0].error && r[0].data) fragen = r[0].data;
      if (r[1] && !r[1].error && r[1].data) funk = r[1].data;
      /* Die Stelle haengt an der Frage, nicht an der Nummer — kommt
         eine neue dazu, springt er nicht woanders hin. */
      var gemerkt = lesen(SPEICHER_STELLE, null);
      var i = fragen.findIndex(function (f) { return f.id === gemerkt; });
      stelle = i >= 0 ? i : Math.min(stelle, Math.max(0, fragen.length - 1));
      zeigen();
    }, function () { laeuft = false; });
  }

  function weg() {
    if (reiter) { reiter.remove(); reiter = null; }
    if (leiste) { leiste.remove(); leiste = null; }
  }

  function ungelesen() {
    return funk.filter(function (m) { return m.von === "claude" && !m.gelesen; });
  }

  /* ---------- Reiter ---------- */
  function reiterBauen() {
    if (reiter) return;
    reiter = el("button", "rf-reiter");
    reiter.type = "button";
    reiter.setAttribute("aria-label", "Walkie-Talkie: Rückfragen von Claude");
    reiter.appendChild(el("span", "rf-reiter-bild", "📻"));
    reiter.appendChild(el("span", "rf-reiter-zahl", ""));
    reiter.addEventListener("click", function () { aufzu(!istOffen()); });
    abschirmen(reiter);
    document.body.appendChild(reiter);
  }

  function aufzu(auf) {
    merken(SPEICHER_OFFEN, Boolean(auf));
    if (auf) gelesenMelden();
    zeigen(true);
    planen();
  }

  function gelesenMelden() {
    var neu = ungelesen();
    if (!neu.length) return;
    var jetzt = new Date().toISOString();
    neu.forEach(function (m) { m.gelesen = jetzt; });
    var sb = zugang();
    if (!sb) return;
    sb.from("betreiber_funk").update({ gelesen: jetzt })
      .in("id", neu.map(function (m) { return m.id; }))
      .then(function () {}, function () {});
  }

  /* ---------- Zeigen ---------- */
  function zeigen(neuBauen) {
    if (!istBetreiber()) { weg(); return; }
    reiterBauen();
    var zahl = fragen.length;
    var z = reiter.querySelector(".rf-reiter-zahl");
    z.textContent = zahl ? String(zahl) : (ungelesen().length ? "•" : "");
    /* Kam etwas Neues, seit er zuletzt geschaut hat, zuckt der
       Reiter — er springt aber NICHT von selbst auf, damit nichts
       mitten im Livestream etwas verdeckt. */
    var kennung = fragen.map(function (f) { return f.id; }).join(",") + "|" +
      ungelesen().map(function (m) { return m.id; }).join(",");
    reiter.classList.toggle("rf-neu", !istOffen() && kennung !== zuletztGesehen &&
      (zahl > 0 || ungelesen().length > 0));
    document.body.classList.toggle("rf-leiste-auf", istOffen());

    if (!istOffen()) {
      if (leiste) { leiste.remove(); leiste = null; }
      return;
    }
    zuletztGesehen = kennung;
    reiter.classList.remove("rf-neu");
    /* Nicht bei jedem Nachsehen neu bauen — sonst verschwaende ein
       halb getipptes Wort oder ein Haekchen. Neu gebaut wird nur,
       wenn sich an den Fragen oder Meldungen wirklich etwas aendert. */
    var fingerabdruck = kennung + "|" + stelle + "|" + (funk[0] ? funk[0].id : "");
    if (leiste && !neuBauen && leiste.dataset.stand === fingerabdruck) return;
    var fokus = document.activeElement && leiste && leiste.contains(document.activeElement);
    if (fokus && !neuBauen) return;
    bauen(fingerabdruck);
  }

  function bauen(fingerabdruck) {
    var alt = leiste;
    var hoehe = alt ? alt.scrollTop : 0;
    leiste = el("div", "rf-leiste");
    leiste.dataset.stand = fingerabdruck;
    leiste.setAttribute("role", "dialog");
    leiste.setAttribute("aria-label", "Walkie-Talkie");

    var kopf = el("div", "rf-kopf");
    kopf.appendChild(el("span", "rf-marke", "📻 Walkie-Talkie"));
    kopf.appendChild(knopf("rf-zu", "✕", function () { aufzu(false); }));
    leiste.appendChild(kopf);

    /* Woran Claude gerade ist — die neueste Meldung von Claude. */
    var meldung = funk.find(function (m) { return m.von === "claude"; });
    if (meldung) {
      var st = el("div", "rf-status");
      st.appendChild(el("span", "rf-status-wer", "Claude: "));
      st.appendChild(el("span", "rf-status-text", meldung.text));
      st.appendChild(el("span", "rf-status-zeit", " · " + wannText(meldung.erstellt)));
      leiste.appendChild(st);
    }

    if (fragen.length) {
      leiste.appendChild(frageBauen(fragen[stelle]));
    } else {
      leiste.appendChild(el("p", "rf-leer", "Gerade keine offene Frage. 👍"));
    }
    leiste.appendChild(vorschlagBauen());

    abschirmen(leiste);
    if (alt) alt.replaceWith(leiste); else document.body.appendChild(leiste);
    leiste.scrollTop = hoehe;
  }

  function wannText(iso) {
    var t = Date.parse(iso);
    if (!t) return "";
    var min = Math.round((Date.now() - t) / 60000);
    if (min < 1) return "gerade eben";
    if (min < 60) return "vor " + min + " Min.";
    var h = Math.round(min / 60);
    return "vor " + h + " Std.";
  }

  function entwurfVon(id) {
    if (!entwurf[id]) entwurf[id] = { stufe: null, gewaehlt: [], notiz: "" };
    return entwurf[id];
  }
  function entwurfMerken() { merken(SPEICHER_ENTWURF, entwurf); }

  function frageBauen(f) {
    var box = el("div", "rf-frage-box");
    box.dataset.id = f.id;
    var e = entwurfVon(f.id);

    var nav = el("div", "rf-nav");
    nav.appendChild(knopf("rf-vor", "‹", function () { blaettern(-1); }));
    nav.appendChild(el("span", "rf-zahl", "Frage " + (stelle + 1) + " von " + fragen.length));
    nav.appendChild(knopf("rf-weiter", "›", function () { blaettern(1); }));
    box.appendChild(nav);

    if (f.thema) box.appendChild(el("div", "rf-thema", f.thema));
    box.appendChild(el("p", "rf-frage", f.frage));
    if (f.wo) {
      var wo = el("p", "rf-wo");
      wo.appendChild(el("b", null, "📍 Wo testen: "));
      wo.appendChild(document.createTextNode(f.wo));
      box.appendChild(wo);
    }

    var extra = Array.isArray(f.optionen) ? f.optionen.map(String) : [];
    var senden;

    if (f.art === "auswahl") {
      /* Genau eine Moeglichkeit — so wie gefragt. */
      var wahl = el("div", "rf-liste");
      extra.forEach(function (o) {
        wahl.appendChild(haken("radio", "rf-" + f.id, o, e.gewaehlt.indexOf(o) >= 0, function (an) {
          e.gewaehlt = an ? [o] : [];
          entwurfMerken(); pruefen();
        }));
      });
      box.appendChild(wahl);
    } else {
      var stufen = el("div", "rf-stufen");
      STUFEN.forEach(function (s) {
        var b = knopf("rf-stufe rf-stufe-" + s[0], s[1], function () {
          e.stufe = e.stufe === s[0] ? null : s[0];
          stufen.querySelectorAll(".rf-stufe").forEach(function (x) {
            x.classList.toggle("rf-gewaehlt", x === b && e.stufe === s[0]);
            x.setAttribute("aria-pressed", String(x === b && e.stufe === s[0]));
          });
          entwurfMerken(); pruefen();
        });
        b.classList.toggle("rf-gewaehlt", e.stufe === s[0]);
        b.setAttribute("aria-pressed", String(e.stufe === s[0]));
        stufen.appendChild(b);
      });
      box.appendChild(stufen);

      box.appendChild(el("div", "rf-unter", "Dazu (mehrere möglich):"));
      var liste = el("div", "rf-liste");
      extra.concat(IMMER).forEach(function (o) {
        liste.appendChild(haken("checkbox", null, o, e.gewaehlt.indexOf(o) >= 0, function (an) {
          e.gewaehlt = e.gewaehlt.filter(function (x) { return x !== o; });
          if (an) e.gewaehlt.push(o);
          entwurfMerken(); pruefen();
        }));
      });
      box.appendChild(liste);
    }

    var notiz = textfeld("rf-notiz", "Etwas anderes? Hier schreiben oder 🎤 sprechen", e.notiz,
      function (w) { e.notiz = w; entwurfMerken(); pruefen(); });
    box.appendChild(notiz);

    var knoepfe = el("div", "rf-knoepfe");
    senden = knopf("rf-senden", "Senden", function () { abschicken(f, e, knoepfe); });
    knoepfe.appendChild(senden);
    if (fragen.length > 1) {
      /* „Später" blaettert nur weiter. Die Frage bleibt offen. */
      knoepfe.appendChild(knopf("rf-spaeter", "Später (nächste Frage)", function () { blaettern(1); }));
    }
    box.appendChild(knoepfe);

    function pruefen() {
      senden.disabled = !(e.stufe || e.gewaehlt.length || (e.notiz || "").trim());
    }
    pruefen();
    return box;
  }

  function haken(typ, name, text, an, tun) {
    var z = el("label", "rf-option");
    var h = document.createElement("input");
    h.type = typ;
    if (name) h.name = name;
    h.value = text;
    h.checked = an;
    h.addEventListener("change", function () { tun(h.checked); });
    z.appendChild(h);
    z.appendChild(el("span", null, text));
    return z;
  }

  /* Ein Textfeld mit 🎤: die Spracherkennung des Browsers schreibt
     mit, was er sagt. Gibt es sie nicht (manche Browser), bleibt
     nur das Tippen — der Knopf erscheint dann gar nicht erst.
     RUNDE 99, ZWEITER ANLAUF — XANDER: „die Sprachnachrichten scheint
     es nicht zu senden." Angekommen ist sie (als Text) — aber er hat
     beim Sprechen NICHTS gesehen und konnte nicht wissen, ob es lief.
     Und auf Android liefert die Dauer-Erkennung (continuous) Saetze
     doppelt oder bricht nach ein paar Sekunden still ab. Deshalb jetzt:
       - was erkannt wird, steht SOFORT darunter (auch Zwischenstaende),
       - Satz fuer Satz einzeln erkannt und danach von selbst weiter,
         bis er ⏹ drueckt — nichts doppelt, nichts bricht ab,
       - klappt es nicht (Mikrofon verboten, kein Netz), steht dort,
         warum. */
  function textfeld(klasse, platzhalter, wert, tun) {
    var huelle = el("div", "rf-feld");
    var t = document.createElement("textarea");
    t.className = klasse;
    t.rows = 2;
    t.placeholder = platzhalter;
    t.value = wert || "";
    t.setAttribute("autocapitalize", "sentences");
    t.addEventListener("input", function () { tun(t.value); });
    huelle.appendChild(t);
    var Erkenner = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Erkenner) {
      var mik = null, weiter = false;
      var live = el("div", "rf-live", "");
      var b = knopf("rf-mik", "🎤", function () {
        if (weiter) { weiter = false; if (mik) try { mik.stop(); } catch (e) {} return; }
        weiter = true;
        b.classList.add("rf-hoert");
        b.textContent = "⏹";
        live.textContent = "Ich höre zu … sprich einfach.";
        runde();
      });
      var fertigMachen = function (hinweis) {
        weiter = false; mik = null;
        b.classList.remove("rf-hoert"); b.textContent = "🎤";
        live.textContent = hinweis || "";
      };
      var runde = function () {
        mik = new Erkenner();
        mik.lang = "de-DE";
        mik.continuous = false;
        mik.interimResults = true;
        mik.onresult = function (ev) {
          var fest = "", zwischen = "";
          for (var i = ev.resultIndex; i < ev.results.length; i++) {
            if (ev.results[i].isFinal) fest += ev.results[i][0].transcript;
            else zwischen += ev.results[i][0].transcript;
          }
          if (fest.trim()) {
            var satz = fest.trim();
            /* Gross angefangen wird nur ein neuer Satz — nicht jedes
               Stueck, das die Erkennung zwischendurch abliefert. */
            var davor = t.value.replace(/\s*$/, "");
            if (!davor || /[.!?]$/.test(davor)) satz = satz.charAt(0).toUpperCase() + satz.slice(1);
            t.value = (davor ? davor + " " : "") + satz;
            tun(t.value);
          }
          live.textContent = zwischen.trim() ? "… " + zwischen.trim() : "Ich höre zu …";
        };
        mik.onerror = function (ev) {
          var w = ev && ev.error;
          if (w === "not-allowed" || w === "service-not-allowed") {
            fertigMachen("Das Mikrofon ist nicht erlaubt – bitte im Browser freigeben.");
          } else if (w === "network") {
            fertigMachen("Die Spracherkennung braucht Netz – gerade keins.");
          }
          /* „no-speech" und „aborted": einfach weiter, onend startet neu. */
        };
        mik.onend = function () {
          if (weiter) { try { runde(); } catch (e) { fertigMachen(""); } }
          else fertigMachen(t.value.trim() ? "✓ Steht im Feld – jetzt „Senden“." : "");
        };
        try { mik.start(); } catch (e) { fertigMachen("Die Spracherkennung ließ sich nicht starten."); }
      };
      b.setAttribute("aria-label", "Sprechen statt tippen");
      huelle.appendChild(b);
      var rahmen = el("div", "rf-feldrahmen");
      rahmen.appendChild(huelle);
      rahmen.appendChild(live);
      return rahmen;
    }
    return huelle;
  }

  function blaettern(schritt) {
    if (!fragen.length) return;
    stelle = (stelle + schritt + fragen.length) % fragen.length;
    merken(SPEICHER_STELLE, fragen[stelle].id);
    zeigen(true);
  }

  function abschicken(f, e, knoepfe) {
    var sb = zugang();
    if (!sb) return;
    var antwort = f.art === "auswahl"
      ? { gewaehlt: e.gewaehlt.slice() }
      : { stufe: e.stufe, gewaehlt: e.gewaehlt.slice() };
    knoepfe.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    sb.from("betreiber_rueckfragen")
      .update({ antwort: antwort, notiz: (e.notiz || "").trim() || null,
                beantwortet: new Date().toISOString() })
      .eq("id", f.id)
      .then(function (r) {
        if (r.error) {
          knoepfe.querySelectorAll("button").forEach(function (b) { b.disabled = false; });
          return;
        }
        delete entwurf[f.id];
        entwurfMerken();
        fragen = fragen.filter(function (x) { return x.id !== f.id; });
        if (stelle >= fragen.length) stelle = 0;
        if (fragen.length) merken(SPEICHER_STELLE, fragen[stelle].id);
        zeigen(true);
      });
  }

  /* ---------- Sein eigener Draht zu Claude ---------- */
  function vorschlagBauen() {
    var box = el("div", "rf-vorschlag");
    box.appendChild(el("div", "rf-unter", "✉️ Etwas an Claude schicken (Vorschlag, Fehler, Idee):"));
    var text = entwurf._vorschlag || "";
    var feld = textfeld("rf-vorschlag-text", "Schreiben oder 🎤 sprechen …", text,
      function (w) { entwurf._vorschlag = w; entwurfMerken(); los.disabled = !w.trim(); });
    box.appendChild(feld);
    var gesendet = el("span", "rf-gesendet", "");
    var los = knopf("rf-vorschlag-senden", "An Claude senden", function () {
      var w = (entwurf._vorschlag || "").trim();
      var sb = zugang();
      if (!w || !sb) return;
      los.disabled = true;
      sb.from("betreiber_funk").insert({ von: "xander", text: w }).then(function (r) {
        if (r && r.error) { los.disabled = false; gesendet.textContent = "Nicht angekommen – nochmal?"; return; }
        entwurf._vorschlag = "";
        entwurfMerken();
        feld.querySelector("textarea").value = "";
        gesendet.textContent = "✓ angekommen";
      });
    });
    los.disabled = !text.trim();
    var zeile = el("div", "rf-knoepfe");
    zeile.appendChild(los);
    zeile.appendChild(gesendet);
    box.appendChild(zeile);
    return box;
  }

  /* ---------- Takt ---------- */
  function planen() {
    if (uhr) clearTimeout(uhr);
    uhr = setTimeout(function () { holen(); planen(); }, istOffen() ? TAKT_OFFEN : TAKT);
  }

  function start() {
    holen();
    planen();
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) holen();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(start, 1500); });
  } else {
    setTimeout(start, 1500);
  }

  return {
    holen: holen,
    aufzu: aufzu,
    stand: function () { return fragen.slice(); }
  };
})();
