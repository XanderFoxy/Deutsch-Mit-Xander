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
  var SPEICHER_REITER = "dma_funk_reiter";   /* Runde 100: wo der Reiter am Rand steht */

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
    /* FASSUNG 885 (Nachbesserung 1) — vom Funk nur nachladen, was neu ist. Vorher kamen bei jedem Takt (20 s, offen
       8 s) die 20 neuesten Funkzeilen mit vollem Text – Claudes Antworten oft mehrere KB; bei sichtbarer Seite der
       größte Posten beim Datenabfluss (gemessen ≈ 7 von 12 MB je Stunde). Jetzt: Kennung und „gelesen“ der 20
       neuesten (winzig), den Text nur für Zeilen, die noch nicht da sind. Angezeigt wird genau dasselbe. */
    var b = sb.from("betreiber_funk")
      .select("id, gelesen")
      .order("id", { ascending: false })
      .limit(20)
      .then(function (k) {
        if (!k || k.error || !k.data) return k;
        var bekannt = {};
        funk.forEach(function (m) { bekannt[m.id] = m; });
        var fehlt = k.data.filter(function (x) { return !bekannt[x.id]; }).map(function (x) { return x.id; });
        function zusammen(neu) {
          return { data: k.data.map(function (x) {
            var m = neu[x.id] || bekannt[x.id];
            return m ? Object.assign({}, m, { gelesen: x.gelesen }) : null;
          }).filter(Boolean) };
        }
        if (!fehlt.length) return zusammen({});
        return sb.from("betreiber_funk")
          .select("id, erstellt, von, text, gelesen")
          .in("id", fehlt)
          .then(function (v) {
            if (!v || v.error || !v.data) return v;
            var neu = {};
            v.data.forEach(function (m) { neu[m.id] = m; });
            return zusammen(neu);
          });
      })
      ["catch"](function (e) { return { error: e }; });   /* der Funk darf die offenen Fragen nicht mitreißen */
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
    stromBeimZuklappen();   /* FASSUNG 884 (Nachbesserung) */
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
    /* RUNDE 100 — XANDER: „es darf die Schaltflaeche vom Klassenzimmer
       nicht verdecken … vielleicht an der linken Seite, dass ich das
       Walkie-Talkie hab und das nicht stoert."
       Wo genau „nicht stoert" ist, weiss nur er — auf jedem Geraet liegt
       etwas anderes am Rand. Deshalb laesst sich der Reiter mit dem
       Finger am Rand hinauf- und hinunterschieben, und er merkt sich die
       Stelle (auch nach dem Neuladen). Ein kurzer Tipp klappt wie bisher
       auf und zu; erst ab 6 px Bewegung ist es ein Schieben. */
    var gemerkt = Number(lesen(SPEICHER_REITER, 0));
    if (gemerkt > 0.02 && gemerkt < 0.95) reiter.style.top = (gemerkt * 100).toFixed(1) + "vh";
    var zug = null, geschoben = false;
    reiter.addEventListener("pointerdown", function (e) {
      zug = { y: e.clientY, top: reiter.getBoundingClientRect().top, id: e.pointerId };
      geschoben = false;
      try { reiter.setPointerCapture(e.pointerId); } catch (x) {}
    });
    reiter.addEventListener("pointermove", function (e) {
      if (!zug) return;
      var dy = e.clientY - zug.y;
      if (!geschoben && Math.abs(dy) < 6) return;
      geschoben = true;
      var h = window.innerHeight || 600;
      var neu = Math.max(8, Math.min(h - 52, zug.top + dy));
      reiter.style.top = neu + "px";
    });
    var loslassen = function () {
      if (!zug) return;
      zug = null;
      if (geschoben) {
        var h = window.innerHeight || 600;
        var anteil = reiter.getBoundingClientRect().top / h;
        merken(SPEICHER_REITER, Number(anteil.toFixed(3)));
        reiter.style.top = (anteil * 100).toFixed(1) + "vh";
      }
    };
    reiter.addEventListener("pointerup", loslassen);
    reiter.addEventListener("pointercancel", loslassen);
    reiter.addEventListener("click", function (e) {
      if (geschoben) { geschoben = false; e.preventDefault(); return; }
      aufzu(!istOffen());
    });
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
      /* FASSUNG 884 (Nachbesserung): zugeklappt – ein Diktat aus dem Strom hört nicht unsichtbar weiter */
      stromBeimZuklappen();
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
    /* RUNDE 100 — XANDER: „Mach mir mal einen Angel-Dummy, dass ich
       testen kann, auch wenn niemand da ist." Ein Tipp setzt die
       Uebungspuppe auf einen freien Platz (nur bei ihm, nur allein im
       Raum) — ein zweiter nimmt sie wieder weg. */
    /* RUNDE 100 — „Ich brauche einen zweiten Dummy um das auszutesten":
       reihum keine → Puppe → dazu „Dummy" → beide weg. */
    var puppen = 0;
    try {
      puppen = window.LiveChat && LiveChat.puppeZahl ? LiveChat.puppeZahl()
        : (LiveChat.puppeDa && LiveChat.puppeDa() ? 1 : 0);
    } catch (e) {}
    var puppeAn = puppen > 0;
    kopf.appendChild(knopf("rf-puppe" + (puppeAn ? " rf-puppe-an" : ""),
      puppen >= 2 ? "🧍 Puppen weg" : puppen === 1 ? "🧍 2. Puppe" : "🧍 Übungspuppe", function () {
        try { if (window.LiveChat && LiveChat.puppe) LiveChat.puppe(); } catch (e) {}
        setTimeout(function () { zeigen(true); }, 60);
      }));
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
    leiste.addEventListener("focusin", function () { tastaturLuft(true); setTimeout(tastaturLuft, 350); });
    leiste.addEventListener("focusout", function () { setTimeout(tastaturLuft, 150); });
    if (alt) alt.replaceWith(leiste); else document.body.appendChild(leiste);
    leiste.scrollTop = hoehe;
  }

  /* FASSUNG 884 — XANDER (Walkie 313): „kein Schwarzbild beim Öffnen der Tastatur" – (Funk 252) beim Schreiben
     an Claude. GEMESSEN (werkzeug/pruefe-884-vollbild.js, 390×844): die Leiste ist 326×709 groß, das Feld
     „An Claude" steht ganz unten in ihr – 1035 px tief im Inhalt, ganz hinuntergerollt bei 707 px auf dem
     Bildschirm. Geht die Tastatur auf, bleiben rund 506 px frei: das Feld liegt UNTER ihr. Dann schiebt Android
     das ganze Fenster hoch (im Vollbild samt Umbau) – und man schreibt blind.
     Jetzt rollt die Leiste ihren eigenen Inhalt so, dass das Feld über der Tastatur steht. Damit so weit gerollt
     werden kann, bekommt sie unten Polster (nur so viel, wie das Rollen braucht), und ihre Höhe wird solange genau
     auf der jetzigen festgehalten – sonst wüchse eine kürzere Leiste mit dem Polster nach unten. Das Polster liegt
     unter der Tastatur und ist nicht zu sehen. Lage, Größe, Farbe und Breite der Leiste bleiben gleich.
     Beim Antippen ist die Tastatur noch nicht offen. Am Telefon (grober Zeiger) wird deshalb schon gerechnet, als
     läge sie über der unteren Hälfte – sonst schiebt Android die Seite, bevor wir es können. Nach 350 ms und bei
     jedem visualViewport-resize wird mit den echten Werten nachgerechnet; steht das Feld dann schon frei, ruckelt
     nichts nach. Am Rechner passiert nichts: kein grober Zeiger, und die sichtbare Höhe ist die ganze Fensterhöhe.
     Gilt für beide Felder (Notiz und „An Claude"). */
  function fingerGeraet() {
    try { return window.matchMedia("(pointer: coarse)").matches; } catch (e) { return false; }
  }
  function luftWeg() {
    if (leiste && (leiste.style.paddingBottom || leiste.style.maxHeight)) {
      leiste.style.paddingBottom = "";
      leiste.style.maxHeight = "";
    }
  }
  function tastaturLuft(vorab) {
    if (!leiste) return;
    var feld = document.activeElement, vv = window.visualViewport;
    if (!vv || !feld || feld.tagName !== "TEXTAREA" || !leiste.contains(feld)) { luftWeg(); return; }
    var unten = vv.offsetTop + vv.height;
    if (vorab === true && vv.height > window.innerHeight * 0.8 && fingerGeraet()) unten = vv.offsetTop + window.innerHeight * 0.55;
    /* Mit festgehaltener Höhe ist das immer die echte Größe der Leiste – das eigene Polster rechnet sich nicht mit. */
    var lr = leiste.getBoundingClientRect();
    /* Nichts von ihr verdeckt (Rechner, kurze Leiste, Tastatur wieder zu): kein Polster, kein Rollen. */
    if (lr.bottom <= unten) { luftWeg(); return; }
    var zuTief = Math.round(feld.getBoundingClientRect().bottom + 12 - unten);
    if (zuTief <= 0) return;   // das Feld steht schon frei
    if (!leiste.style.maxHeight) leiste.style.maxHeight = lr.height + "px";
    var platz = leiste.scrollHeight - leiste.clientHeight - leiste.scrollTop;
    if (platz < zuTief) {
      /* 12 = unteres Polster aus korrekturen.css .rf-leiste */
      leiste.style.paddingBottom = ((parseFloat(leiste.style.paddingBottom) || 12) + zuTief - platz) + "px";
    }
    leiste.scrollTop += zuTief;
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

    /* RUNDE 101 — XANDER (Walkie #152): „Bitte das alte Walkie-Talkie-
       Modul zurück, was vorher war, mit der Mehrfachauswahl und der
       funktionierenden Spracheingabe."
       GEFUNDEN: die Fragen ab #145 hatte ich mit der Art „auswahl"
       angelegt — die zeigt nur runde Einfachknoepfe, ohne die drei
       Stufen und ohne die festen Zusatzpunkte. Ab jetzt bekommt JEDE
       Frage das volle Modul (Stufen + Mehrfachauswahl + Textfeld mit
       Mikrofon); „auswahl" gilt nur noch, wenn eine Frage es
       ausdruecklich mit „einzeln: true" verlangt. */
    if (f.art === "auswahl" && f.einzeln === true) {
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
  /* =====================================================================
     DAS DIKTAT — EINS FUER DAS GANZE WALKIE-TALKIE
     ---------------------------------------------------------------------
     RUNDE 100 — zwei Fehler, die bei ihm zusammen den Salat ergaben
     („Wenn wenn man wenn man sich …", Frage Leiter):
       1. Chrome auf Android liefert jeden WACHSENDEN Stand des Satzes als
          eigenes fertiges Ergebnis („wenn", „wenn man", …). Hintereinander
          gehaengt ergab das jedes Wort viele Male.
       2. Kommt waehrend des Sprechens eine neue Meldung von Claude, wird
          das Walkie-Talkie neu gebaut. Der NEUE 🎤-Knopf wusste nichts vom
          laufenden Diktat: ⏹ startete ein zweites, und der ganze Text
          stand doppelt da.
     Deshalb gehoert das laufende Diktat jetzt dem Walkie-Talkie, nicht
     einem Knopf: jeder neu gebaute Knopf sieht, dass es laeuft, und die
     Worte landen immer im Feld, das GERADE auf dem Bildschirm ist.
     ===================================================================== */
  var diktat = null;   /* { mik, klasse, anfang } */
  function diktatFeld(klasse) { return document.querySelector("textarea." + klasse); }
  function diktatKnopfZeigen(klasse, laeuft, hinweis) {
    var feld = diktatFeld(klasse);
    var rahmen = feld && feld.closest(".rf-feldrahmen");
    if (!rahmen) return;
    var b = rahmen.querySelector(".rf-mik"), live = rahmen.querySelector(".rf-live");
    if (b) { b.classList.toggle("rf-hoert", laeuft); b.textContent = laeuft ? "\u23f9" : "\ud83c\udfa4"; }
    if (live && hinweis !== undefined) live.textContent = hinweis;
  }
  function diktatGleich(a) {
    return String(a || "").toLowerCase().replace(/[^a-z\u00e4\u00f6\u00fc\u00df0-9 ]/g, "")
      .replace(/\s+/g, " ").trim();
  }
  /* Ein neues Stueck, das mit dem vorigen ANFAENGT, ersetzt es; eines, das
     im vorigen schon steckt, wird uebersprungen; nur Neues kommt dazu. */
  function diktatAnfuegen(liste, stueck) {
    var letzte = liste.length ? liste[liste.length - 1] : "";
    var a = diktatGleich(letzte), b = diktatGleich(stueck);
    if (!b) return;
    if (a && b.indexOf(a) === 0) { liste[liste.length - 1] = stueck; return; }
    if (a && a.indexOf(b) === 0) return;
    liste.push(stueck);
  }
  function diktatEnde(hinweis) {
    var d = diktat;
    diktat = null;
    if (!d) return;
    /* FASSUNG 884: Diktat aus dem Strom – Kontext, Klon und Uhren freigeben (siehe unten) */
    if (d.strom) {
      stromAufraeumen(d);
      clearTimeout(d.bremseUhr);
      clearTimeout(d.spaeterUhr);
      if (window.__dmaDiktatMik === d.mik) window.__dmaDiktatMik = null;
      /* FASSUNG 884b: trug der Strom-Weg nicht mehr (Tagesmenge, Tagesgrenze, Kontingent …), steht am Ende der Grund */
      if (hinweis === undefined && d.endeText) hinweis = d.endeText;
      /* Nichts aufgeschrieben: derselbe Satz wie beim Browser-Diktat („no-speech") – und einmal die Zahlen an mich,
         damit ich sehe, ob überhaupt Ton kam (Nachbesserung, siehe unten). */
      if (hinweis === undefined && !d.gehoert) {
        hinweis = STROM_NICHTS;
        if (d.an && Date.now() - d.anSeit >= 2000) diktatFehlerMelden("strom-nichts", stromZahlen(d));
      }
    }
    /* FASSUNG 698: hat der Livestream sein Mikrofon ausgeliehen, bekommt er es jetzt zurück. */
    if (d.geliehen) { try { window.LiveChat.mikrofonZurueck(); } catch (e) {} }
    var feld = diktatFeld(d.klasse);
    diktatKnopfZeigen(d.klasse, false,
      hinweis !== undefined ? hinweis : (feld && feld.value.trim() ? "\u2713 Steht im Feld \u2013 jetzt \u201eSenden\u201c." : ""));
    /* FASSUNG 884b: hier ging es bis eben „auf dem alten Weg weiter“ (diktatStarten ohne Strom = Mikrofon leihen) – das
       nahm im Livestream wieder das Mikrofon weg. Ein Diktat aus dem Strom endet jetzt immer hier; siehe oben. */
  }
  /* =====================================================================
     FASSUNG 884 — DIKTAT IM LIVESTREAM: AUS DEM LAUFENDEN STROM
     ---------------------------------------------------------------------
     XANDER (Funk 163): „hast du mal geschaut warum ich mit niemanden mehr sprechen kann auch das Mikrofon im Chat wenn
     ich dir etwas übers Walkie-Talkie schicken will sobald ich da mit jemanden spreche irgendwie und dich aktiviere das
     aber hier schaltet sich das wieder aus wenn jemand da ist das soll generell immer aktiv sein um dass ich dir eine
     Nachricht schicken kann".
     Bis hier lieh sich das Diktat im Livestream das Mikrofon aus (698/718): Android gibt es nur EINEM Nutzer, also
     wurde die Live-Spur abgegeben – die anderen sahen „stumm“ und hörten ihn nicht, bis das Diktat vorbei war. Genau
     das ist „schaltet sich das wieder aus“.
     Jetzt, wenn man im Raum ist und eine lebende Live-Tonspur hat: keine Browser-Erkennung, kein Ausleihen. Eine KOPIE
     der Live-Spur (LiveChat.tonSpurKlon) läuft in ein AudioWorklet; geschnitten wird an den Sprechpausen, jedes Stück
     geht als WAV 16 kHz (mit Tiefpass, AusspracheP.alsWav seit 882) an die Zentrale („erkennen“, Azure – derselbe Weg
     wie die Stadt-Quests), der Text kommt ins Feld. Die Live-Spur, ihre Leitungen und „tonAn“ bleiben unberührt.
       - Ein Stück endet nach ≥ 0,7 s Pause, wenn es ≥ 4 s lang ist, oder nach ≥ 2 s Pause (auch ein kurzes „Ja.“).
         Länger als 55 s wird keins (Azures Kurz-Audio nimmt höchstens 60 s): harter Schnitt an der leisesten Stelle
         der letzten 3 s, der Rest beginnt das nächste Stück.
       - An die Zentrale eins nach dem anderen: die Reihenfolge stimmt, Upload und Rechenlast verteilen sich.
       - Schreibt Azure nur bis zur ersten Pause auf (Offset + Duration vor dem Ende), geht der Rest nach (höchstens 4×).
       - Was keine 0,3 s Sprache hat, geht gar nicht erst hinaus (schont Kontingent und Tagesgrenze).
     Gleich bleiben 🎤 (er erscheint wie bisher nur, wo es die Browser-Erkennung gibt), ⏹, das Feld und die Hinweiszeile.
     Anders: der Text kommt satzweise nach einer kurzen Pause statt Wort für Wort, und nach ⏹ steht kurz „Einen Moment –
     ich schreibe noch auf …“. Außerhalb des Livestreams (oder ohne Live-Tonspur, ohne Zentrale) bleibt alles wie bisher.
     NACHBESSERUNG (Prüfung desselben Abends) – fünf Lücken, alle ohne sichtbare Änderung geschlossen:
       1. Das GEMEINSAME Azure-Kontingent. Das Diktat läuft über denselben zentralen Schlüssel wie der Aussprache-Trainer
          und die Stadt-Quests aller Lernenden (Tarif F0: 5 Audiostunden im Monat, eine Anfrage zur Zeit; welcher Tarif
          gilt, lässt sich von hier nicht prüfen). Deshalb höchstens 5 Minuten gesendete Sprache am Tag
          (STROM.tagesSekunden, im Gerät gezählt): höchstens 2,5 h im Monat und rund 60 Anfragen am Tag – von der
          Tagesgrenze 300 bleibt der größte Teil für den Trainer. Gemessen (azure_nutzung): September 381 Anfragen von
          3 Personen, Höchststand 173 an einem Tag. Ist die Tagesmenge voll, und bei „tagesgrenze“, bei „kontingent“
          nach zwei Wiederholungen (2,5 s / 5 s), ohne Anmeldung oder ohne Schlüssel: der ALTE Weg (Browser-Erkennung,
          Mikrofon leihen) – das Diktat geht weiter, der Text bis hier bleibt, eine Meldung geht an mich, und der
          Strom-Weg ruht (bis Mitternacht UTC bzw. 30 min).
       2. Walkie zu (✕), Feld weg oder Raum verlassen: das Diktat endet sofort (das schon Gesprochene wird noch
          aufgeschrieben, auch ins zugeklappte Feld) – es hört nicht mehr unsichtbar bis zu 5 min weiter.
       3. Nachschub nur mit echtem Fortschritt: erst ab 0,5 s Erkanntem, geschnitten genau am Ende des Erkannten, und nur,
          wenn danach (ab 0,2 s Abstand – der Nachhall des letzten Worts zählt nicht) noch ≥ 0,3 s Sprache kommt. Wird
          die Grenze (4) erreicht und es bleibt Sprache übrig: Meldung „strom-nachschub-grenze“.
       4. Stille Fehlschläge: liefert die Kopie 3 s lang nur Nullen, kommt in 6 s kein einziger lauter Block, oder stockt
          der Strom 6 s lang (sichtbare Seite) – alter Weg bzw. Ende, immer mit Meldung (max rms …). ⏹ ohne Erkanntes:
          „Ich habe nichts gehört …“ wie beim Browser-Diktat.
       5. Fehler zeigen dieselben Sätze wie das Browser-Diktat; neu ist nur „Einen Moment – ich schreibe noch auf …“.
     FASSUNG 884b — DER RÜCKFALL NIMMT DAS LIVE-MIKRO NIE MEHR WEG (zweite Prüfung). Die Nachbesserung schickte das
     Diktat bei Stille (6 s nichts Lautes), Nullen, „kein Start“, Tagesmenge, Tagesgrenze, Kontingent … „auf den alten
     Weg“ – und der leiht das Mikrofon aus: die Live-Spur wird gestoppt, „stumm“ geht an alle. Genau Funk 163. Und
     auslösbar ganz normal: 🎤 tippen, dem Gegenüber noch zuhören oder 6 s überlegen (die Echounterdrückung nimmt
     dessen Stimme aus dem eigenen Mikrofon) – schon war man bis zum Ende des Diktats für alle stumm. Jetzt:
       1. Im Livestream mit lebender Live-Spur wird NIE ausgeliehen und keine Browser-Erkennung gestartet (Android gibt
          sie neben dem Livestream ohnehin nicht her, Funk 139: „aborted“). Kein Weg führt von hier mehr in den alten.
       2. Stille: einmal melden (max rms) und weiter aus der Live-Spur hören – wer nach 7 s spricht, wird erkannt. Kommt
          30 s lang nichts Lautes, endet es sauber mit „Ich habe nichts gehört …“ (wie das Browser-Diktat bei Stille).
       3. Geht der Strom-Weg nicht (Tagesmenge, Tagesgrenze, Kontingent, Anmeldung, Schlüssel; Nullen; kein Start):
          das schon Gesprochene steht im Feld, das Diktat endet mit dem Grund (die Sätze aus dem ersten Bau bzw. des
          Browser-Diktats), der nächste 🎤 sagt ihn gleich. Hängt das Worklet, übernimmt nach 1,5 s der ScriptProcessor.
       4. Antworten des Gateways ohne Azure-Ergebnis (401 „Invalid JWT“, 503 BOOT_ERROR, 546 WORKER_LIMIT – JSON, aber
          ohne „fehler“ und ohne RecognitionStatus) galten als „nichts gesagt“: das Stück verschwand still. Jetzt sind
          sie ein Fehler („antwort-unlesbar“ mit dem Grund des Gateways): einmal wiederholt, dann gemeldet.
       5. Ein kurzer Aussetzer des Raumkanals (lage „fehler“, WebRTC läuft weiter) beendet das Diktat nicht mehr; nur
          „aus“ (Raum verlassen) sofort, sonst erst nach 30 s ohne Raum.
       6. Nachschub in Teilen: der Rest hinter Azures Ende ging mit jedem Nachschub GANZ noch einmal hinaus (28,5 s Ton
          für 7,7 s Rede). Jetzt wird er an den Pausen geteilt (siehe stromRestTeile) – jedes Teil geht einmal hinaus.
       7. Das erste ⏹ während eines Ausklangs, den das System begonnen hat (Tagesmenge, ✕), verwirft nichts mehr;
          erst ein zweites beendet sofort. Die Meldung „verworfen=…“ zählt das fehlgeschlagene Stück mit.
     ===================================================================== */
  var STROM = { blockMs: 100, pauseMs: 700, langePauseMs: 2000, stueckMinMs: 4000, stueckMaxMs: 55000,
                vorlaufMs: 300, nachlaufMs: 300, mindestSprechMs: 300, hoechstMs: 300000, rate16k: true, schwelle: 0.012,
                startMs: 3000, stillMs: 6000, stocktMs: 6000, zeitgrenze: 40000, bremseMs: 45000,
                tagesSekunden: 300, kontingentMs: 2500, sperreMs: 1800000,
                nachschubAbS: 0.5, nachschubAbstandS: 0.2, nachschubHoechst: 4,
                /* 884b: Stille-Ende, Ersatz fürs hängende Worklet, kleinste Teilpause im Nachschub, Gnadenfrist Raumkanal */
                stillEndeMs: 30000, ersatzMs: 1500, teilPauseMs: 300, raumWegMs: 30000 };
  /* Der Worklet-Baustein als Text (Blob-Adresse): keine eigene Datei, nichts lädt nach. Er sammelt n Abtastwerte und
     reicht sie als ganzen Block an die Seite (übertragen, nicht kopiert). */
  var STROM_WORKLET = "registerProcessor('dma-diktat',class extends AudioWorkletProcessor{" +
    "constructor(o){super();this.n=o.processorOptions.n;this.b=new Float32Array(this.n);this.i=0}" +
    "process(e){var c=e[0]&&e[0][0];if(c){for(var k=0;k<c.length;k++){this.b[this.i++]=c[k];" +
    "if(this.i===this.n){this.port.postMessage(this.b,[this.b.buffer]);this.b=new Float32Array(this.n);this.i=0}}}" +
    "return true}})";
  var STROM_NETZ = ["netz", "zeit-abgelaufen", "dienst", "antwort-unlesbar"];
  /* Hier trägt der Strom-Weg gerade nicht: Ende mit dem Grund (884b; bis dahin der alte Weg) und eine Weile gesperrt
     (siehe stromSperren) */
  var STROM_ALT = ["tagesgrenze", "kontingent", "nicht-angemeldet", "kein-zentraler-schluessel", "schluessel-falsch",
                   "keine-verbindung"];
  /* Dieselben Sätze wie beim Browser-Diktat (mik.onerror) – keine neuen Texte */
  var STROM_NICHTS = "Ich habe nichts gehört – nochmal 🎤 und gleich sprechen.";
  var STROM_KEIN_NETZ = "Die Spracherkennung braucht Netz – gerade keins.";
  /* FASSUNG 884b: Ende statt „alter Weg“ (Mikrofon leihen). Die Sätze des Browser-Diktats bzw. die aus dem ersten Bau
     (7cbc825); nur „im Livestream“ ist dazugekommen – die Tagesmenge gilt nur hier, draußen diktiert man wie immer. */
  var STROM_START = "Die Spracherkennung ließ sich nicht starten.";
  var STROM_BELEGT = "Das Mikrofon ist nicht angesprungen. Ist es gerade in einer anderen App belegt? Dann dort freigeben und nochmal 🎤.";
  var STROM_WEG = "Die Spracherkennung ist gerade nicht verfügbar – bitte tippen.";
  var STROM_HEUTE = "Für heute ist die Spracherkennung aufgebraucht – bitte tippen.";
  var STROM_HEUTE_LIVE = "Für heute ist die Spracherkennung im Livestream aufgebraucht – bitte tippen.";
  var SPEICHER_STROM_TAG = "dma_diktat_strom_tag";       /* { tag, s } – gesendete Sekunden heute */
  var SPEICHER_STROM_SPERRE = "dma_diktat_strom_sperre"; /* { bis, grund } */
  function diktatStromMoeglich() {
    var A = window.AusspracheP;
    try {
      return Boolean((window.AudioContext || window.webkitAudioContext) && window.MediaStream && A && A.alsWav &&
        A.zentralErkennen && A.zentralMoeglich && A.zentralMoeglich());
    } catch (e) { return false; }
  }
  function stromHeute() { var t = new Date(); return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(); }
  function stromVerbraucht() {
    var w = lesen(SPEICHER_STROM_TAG, null);
    return w && w.tag === stromHeute() ? Number(w.s) || 0 : 0;
  }
  function stromZaehlen(s) {
    merken(SPEICHER_STROM_TAG, { tag: stromHeute(), s: Math.round((stromVerbraucht() + s) * 10) / 10 });
  }
  /* Die Tagesgrenze der Zentrale zählt nach dem Datum der Datenbank (UTC) – bis dahin ruht der Strom-Weg; sonst 30 min. */
  function stromSperren(code) {
    var bis = Date.now() + STROM.sperreMs;
    if (code === "tagesgrenze") { var m = new Date(); m.setUTCHours(24, 0, 0, 0); bis = m.getTime(); }
    merken(SPEICHER_STROM_SPERRE, { bis: bis, grund: code });
  }
  /* FASSUNG 884b: statt ja/nein der Grund ("" = frei) – im Livestream gibt es keinen anderen Weg mehr, also sagt der
     🎤 gleich, warum nicht. */
  function stromSperrgrund() {
    var s = lesen(SPEICHER_STROM_SPERRE, null);
    if (s && Date.now() < Number(s.bis)) return String(s.grund || "sperre");
    var v = stromVerbraucht();
    if (v >= STROM.tagesSekunden) {
      diktatFehlerMelden("strom-tagesmenge", "s=" + Math.round(v) + " von " + STROM.tagesSekunden + ", Ende");
      return "tagesmenge";
    }
    return "";
  }
  function stromGrundText(grund) {
    return grund === "tagesmenge" ? STROM_HEUTE_LIVE : grund === "tagesgrenze" ? STROM_HEUTE : STROM_WEG;
  }
  function stromZahlen(d) {
    return "rate=" + d.rate + ", max rms=" + (d.hoechst || 0).toFixed(4) + ", schwelle=" + STROM.schwelle +
      ", laut=" + (d.lautJe ? 1 : 0) + ", nullen=" + (d.nurNullen ? 1 : 0) + ", stuecke=" + d.nr + ", ms=" + (Date.now() - d.seit);
  }
  function stromLeise(p) { if (p && p.catch) p.catch(function () {}); }
  function diktatAusStrom(klasse, feld, klon) {
    var AC = window.AudioContext || window.webkitAudioContext;
    var d = { strom: true, mik: null, klasse: klasse, feld: feld, anfang: feld.value.replace(/\s*$/, ""), an: false,
              anSeit: 0, gehoert: false, seit: Date.now(), teile: [], schlange: [], laeuft: 0, nr: 0, vorrat: [],
              vorratMs: 0, spitze: 0, hoechst: 0, lautJe: false, nurNullen: true, letzterBlock: 0, stueck: null,
              stoppen: false, endeText: "", klon: klon, rate: 0 };
    /* ⏹ ruft mik.stop(), ein neuer Start mik.abort() – wie bei der Browser-Erkennung.
       FASSUNG 884b (Prüfung): hat das SYSTEM den Ausklang schon begonnen (Tagesmenge, ✕, Raum verlassen), ist Xanders
       erstes ⏹ sein erstes – nicht das „zweite ⏹“, das sofort beendet und die Antworten unterwegs verwirft (der zuletzt
       gesprochene Satz fehlte). Erst ein weiteres ⏹ beendet sofort. */
    d.mik = { stop: function () { if (d.stoppen && !d.selbst) { d.selbst = true; return; } d.selbst = true; stromStoppen(d); },
              abort: function () { d.selbst = true; stromStoppen(d, true); } };
    diktat = d;
    window.__dmaDiktatMik = d.mik;
    diktatKnopfZeigen(klasse, true, "Mikrofon wird eingeschaltet …");
    /* Den Kontext NOCH IM TIPP anlegen – sonst bleibt er auf manchen Telefonen „suspended“. Zuerst gleich mit 16 kHz
       (der Browser rechnet die Spur selbst um, mit Filter); lehnt er das ab (Firefox, ältere Safari), in
       Gerätefrequenz – dann rechnet alsWav herunter (Tiefpass seit 882). „playback“: große Puffer, wenig Weckrufe –
       hörbar wird ohnehin nichts. */
    var strom = new MediaStream([klon]);
    if (STROM.rate16k) {
      try { d.ctx = new AC({ sampleRate: 16000, latencyHint: "playback" }); d.quelle = d.ctx.createMediaStreamSource(strom); }
      catch (e) { try { if (d.ctx) stromLeise(d.ctx.close()); } catch (x) {} d.ctx = null; d.quelle = null; }
    }
    if (!d.ctx) {
      try { d.ctx = new AC({ latencyHint: "playback" }); d.quelle = d.ctx.createMediaStreamSource(strom); }
      catch (e) { stromRueckfall(d, "strom-kein-kontext", String((e && e.message) || e), STROM_START); return; }
    }
    try { if (d.ctx.resume) stromLeise(d.ctx.resume()); } catch (e) {}
    d.rate = d.ctx.sampleRate;
    var n = Math.max(128, Math.round(d.rate * STROM.blockMs / 1000));
    /* Quelle → Sammler → stumm (0) → Ausgang: so läuft der Knoten sicher, hörbar wird nichts. */
    d.stumm = d.ctx.createGain();
    d.stumm.gain.value = 0;
    d.stumm.connect(d.ctx.destination);
    var modulFrei = function () { try { if (d.modul) URL.revokeObjectURL(d.modul); } catch (e) {} d.modul = null; };
    /* Ersatz ohne AudioWorklet (ältere Browser, oder das Modul lädt nicht): ScriptProcessor, 4096 je Block */
    var ersatz = function () {
      modulFrei();
      if (d.aufgeraeumt || d.knoten) return;
      try {
        var p = d.ctx.createScriptProcessor(4096, 1, 1);
        p.onaudioprocess = function (ev) { stromBlock(d, new Float32Array(ev.inputBuffer.getChannelData(0))); };
        d.quelle.connect(p); p.connect(d.stumm); d.knoten = p;
      } catch (e) {}
    };
    d.ersatz = ersatz;   /* FASSUNG 884b: die Wache greift darauf zurück, wenn das Worklet-Modul nicht lädt */
    if (d.ctx.audioWorklet && window.AudioWorkletNode && window.Blob && window.URL && URL.createObjectURL) {
      try {
        d.modul = URL.createObjectURL(new Blob([STROM_WORKLET], { type: "application/javascript" }));
        d.ctx.audioWorklet.addModule(d.modul).then(function () {
          modulFrei();
          if (d.aufgeraeumt || d.knoten) return;
          var w = new AudioWorkletNode(d.ctx, "dma-diktat", { numberOfInputs: 1, numberOfOutputs: 1,
            outputChannelCount: [1], processorOptions: { n: n } });
          w.port.onmessage = function (ev) { stromBlock(d, ev.data); };
          d.quelle.connect(w); w.connect(d.stumm); d.knoten = w;
        }).catch(ersatz);
      } catch (e) { ersatz(); }
    } else ersatz();
    /* Die Wache (alle 0,5 s): Start, Nullen, Stille, Stocken, Raum und Feld – siehe stromWache */
    d.wacheUhr = setInterval(function () { stromWache(d); }, 500);
    d.hoechstUhr = setTimeout(function () { if (diktat === d) stromStoppen(d); }, STROM.hoechstMs);
    klon.onended = function () { if (diktat === d) stromStoppen(d); };
  }
  /* NACHBESSERUNG 2 und 4: was der Wächter (3 s ohne Block) nicht sah – Nullen, Stille, ein stockender Strom, der Raum
     ist verlassen, das Walkie zu. Kein Fall bleibt mehr stumm: immer mit Meldung.
     FASSUNG 884b: und keiner führt mehr auf den alten Weg (Mikrofon leihen) – siehe oben. */
  function stromWache(d) {
    if (diktat !== d || d.aufgeraeumt) { clearInterval(d.wacheUhr); return; }
    var jetzt = Date.now();
    if (!d.an) {
      /* FASSUNG 884b: noch kein Block nach 1,5 s – lädt das Worklet-Modul nicht, übernimmt der ScriptProcessor (ersatz
         prüft selbst, ob schon ein Knoten läuft); ein angehaltener Kontext wird geweckt. Bis hier half nur der alte Weg. */
      if (jetzt - d.seit >= STROM.ersatzMs) {
        if (!d.knoten && d.ersatz) d.ersatz();
        try { if (d.ctx && d.ctx.state === "suspended") stromLeise(d.ctx.resume()); } catch (e) {}
      }
      /* kein einziger Block in 3 s: Ende mit dem Satz des Browser-Diktats (bis 884b: der alte Weg) */
      if (jetzt - d.seit >= STROM.startMs) {
        stromRueckfall(d, "strom-kein-start", "rate=" + d.rate + ", knoten=" +
          (d.knoten ? (d.knoten.port ? "worklet" : "ersatz") : "keiner") + ", ctx=" + d.ctx.state, STROM_START);
      }
      return;
    }
    if (d.stoppen) return;
    /* Die Kopie liefert nur Nullen (Spur an der Quelle stumm, Mikrofon von einer anderen App belegt): Ende mit Grund */
    if (d.nurNullen && jetzt - d.anSeit >= STROM.startMs) { stromRueckfall(d, "strom-nullen", stromZahlen(d), STROM_BELEGT); return; }
    /* 6 s kein einziger lauter Block – er überlegt, hört dem anderen zu (dessen Stimme nimmt die Echounterdrückung aus
       dem eigenen Mikrofon), oder es ist zu leise. FASSUNG 884b: nur EINMAL melden (max rms) und weiter aus der Live-Spur
       hören – bis eben ging es hier auf den alten Weg, und man war für alle stumm (Prüfung, wichtig). Nach 30 s ohne
       etwas Lautes ein sauberes Ende: „Ich habe nichts gehört …“ (diktatEnde, mit strom-nichts an mich). */
    if (!d.lautJe && jetzt - d.anSeit >= STROM.stillMs) {
      if (!d.stillGemeldet) { d.stillGemeldet = true; diktatFehlerMelden("strom-still", stromZahlen(d) + ", weiter"); }
      if (jetzt - d.anSeit >= STROM.stillEndeMs) { stromStoppen(d); return; }
    }
    /* Raum verlassen, Walkie zu, Feld weg: Ende – das schon Gesprochene wird noch aufgeschrieben.
       FASSUNG 884b: ein kurzer Aussetzer des Raumkanals (CHANNEL_ERROR → lage „fehler“, bis zum nächsten SUBSCRIBED)
       ist kein Verlassen – WebRTC und die Live-Spur laufen weiter, man sitzt noch im Raum. Sofort endet es nur bei
       „aus“; sonst erst, wenn der Raum 30 s lang weg bleibt. lage() (teuer) nur in diesen seltenen Augenblicken. */
    var raus = false;
    try {
      if (window.LiveChat && LiveChat.istDrin && !LiveChat.istDrin()) {
        if (!d.rausSeit) d.rausSeit = jetzt;
        var l = LiveChat.lage ? LiveChat.lage() : null;
        raus = !l || l.lage === "aus" || jetzt - d.rausSeit >= STROM.raumWegMs;
      } else d.rausSeit = 0;
    } catch (e) {}
    if (raus || !diktatFeld(d.klasse)) { stromStoppen(d); return; }
    /* Der Strom stockt (Kontext angehalten): wecken; bleibt er bei sichtbarer Seite 6 s aus, Ende mit Meldung */
    var stille = jetzt - d.letzterBlock;
    if (stille > 1500) { try { if (d.ctx && d.ctx.state === "suspended") stromLeise(d.ctx.resume()); } catch (e) {} }
    if (stille > STROM.stocktMs && !document.hidden) {
      diktatFehlerMelden("strom-stockt", "ctx=" + (d.ctx ? d.ctx.state : "-") + ", " + stromZahlen(d));
      stromStoppen(d);
    }
  }
  /* FASSUNG 884b: Kein Start, nur Nullen, kein Kontext – bis eben hieß das „diktatStarten(klasse, true)“, also Mikrofon
     leihen und für alle stumm. Jetzt: Meldung und Ende mit dem Grund (das Feld bleibt, wie es ist). */
  function stromRueckfall(d, code, text, hinweis) {
    diktatFehlerMelden(code, text);
    if (diktat === d) diktatEnde(hinweis);
    else stromAufraeumen(d);
  }
  /* NACHBESSERUNG 1: der Strom-Weg trägt gerade nicht. Was schon gesprochen ist, wird – wenn es noch geht – zu Ende
     aufgeschrieben. FASSUNG 884b: danach Ende mit dem Grund (endeText) statt des alten Wegs. dazu = null: nichts
     verwerfen (Tagesmenge); sonst wird verworfen, was noch wartet, und „verworfen=“ zählt das fehlgeschlagene Stück
     (dazu = 1) mit – bis hier stand bei der Tagesgrenze „verworfen=0“, obwohl „Satz 2“ fehlte (Prüfung). */
  function stromWechsel(d, code, info, dazu, endeText) {
    if (dazu !== null) {
      var weg = d.schlange.concat(d.stueck ? [{ daten: { length: d.stueck.n } }] : []);
      info += ", verworfen=" + (weg.length + dazu) + ", wartend=" +
        Math.round(weg.reduce(function (s, a) { return s + a.daten.length; }, 0) / d.rate * 1000) + " ms";
      d.stueck = null; d.schlange = [];
    }
    diktatFehlerMelden(code, info);
    if (!d.endeText) d.endeText = endeText;
    stromStoppen(d);
  }
  function stromStueck(d, bloecke, laut, pegel) {
    var st = { bloecke: bloecke, laut: laut, pegel: pegel, n: 0, sprechMs: 0, stillMs: 0 };
    for (var k = 0; k < bloecke.length; k++) {
      var ms = bloecke[k].length / d.rate * 1000;
      st.n += bloecke[k].length;
      if (laut[k]) { st.sprechMs += ms; st.stillMs = 0; } else st.stillMs += ms;
    }
    return st;
  }
  function stromBlock(d, daten) {
    if (diktat !== d || d.aufgeraeumt || !daten || !daten.length) return;
    var ms = daten.length / d.rate * 1000;
    d.letzterBlock = Date.now();
    if (!d.an) {
      d.an = true;
      d.anSeit = d.letzterBlock;
      diktatKnopfZeigen(d.klasse, true, "Ich höre zu … sprich einfach.");
    }
    var s = 0;
    for (var i = 0; i < daten.length; i++) s += daten[i] * daten[i];
    var rms = Math.sqrt(s / daten.length);
    if (rms > 0) d.nurNullen = false;
    if (rms > d.hoechst) d.hoechst = rms;
    /* Die Spitze sinkt langsam (Halbwert 20 s): ein einzelner Knall hebt die Schwelle nicht für den Rest. */
    d.spitze = Math.max(rms, d.spitze * Math.pow(0.5, ms / 20000));
    var laut = rms > Math.max(STROM.schwelle, d.spitze * 0.1);
    if (laut) d.lautJe = true;
    var st = d.stueck;
    if (!st) {
      if (!laut) {
        /* still und kein Stück offen: nur die letzten 0,3 s als Vorlauf halten (kein Anlaut geht verloren) */
        d.vorrat.push(daten); d.vorratMs += ms;
        while (d.vorrat.length && d.vorratMs > STROM.vorlaufMs) d.vorratMs -= d.vorrat.shift().length / d.rate * 1000;
        return;
      }
      st = d.stueck = stromStueck(d, d.vorrat, d.vorrat.map(function () { return false; }), d.vorrat.map(function () { return 0; }));
      d.vorrat = []; d.vorratMs = 0;
    }
    st.bloecke.push(daten); st.laut.push(laut); st.pegel.push(rms); st.n += daten.length;
    if (laut) { st.sprechMs += ms; st.stillMs = 0; } else st.stillMs += ms;
    var dauer = st.n / d.rate * 1000;
    if ((st.stillMs >= STROM.pauseMs && dauer >= STROM.stueckMinMs) || st.stillMs >= STROM.langePauseMs) {
      stueckAbschicken(d);
      /* die letzten 0,3 s der Pause bleiben Vorlauf für den nächsten Satz (ein leiser Anlaut geht nicht verloren) */
      for (var k = st.bloecke.length - 1; k >= 0 && !st.laut[k]; k--) {
        var bms = st.bloecke[k].length / d.rate * 1000;
        if (d.vorratMs + bms > STROM.vorlaufMs) break;
        d.vorrat.unshift(st.bloecke[k]); d.vorratMs += bms;
      }
      return;
    }
    if (dauer >= STROM.stueckMaxMs - STROM.vorlaufMs) stromSchnitt(d);
  }
  /* Harter Schnitt (Dauerrede): an der leisesten Stelle der letzten 3 s (nie vor der Hälfte des Stücks) */
  function stromSchnitt(d) {
    var st = d.stueck, b = st.bloecke, beste = b.length - 1, leiseste = Infinity, hinten = 0;
    for (var k = b.length - 1; k >= Math.ceil(b.length / 2) && hinten < 3000; k--) {
      hinten += b[k].length / d.rate * 1000;
      if (st.pegel[k] < leiseste) { leiseste = st.pegel[k]; beste = k; }
    }
    var rest = stromStueck(d, b.slice(beste + 1), st.laut.slice(beste + 1), st.pegel.slice(beste + 1));
    d.stueck = stromStueck(d, b.slice(0, beste + 1), st.laut.slice(0, beste + 1), st.pegel.slice(0, beste + 1));
    stueckAbschicken(d);
    if (rest.bloecke.length) d.stueck = rest;
  }
  function stueckAbschicken(d) {
    var st = d.stueck;
    d.stueck = null;
    if (!st || st.sprechMs < STROM.mindestSprechMs) return;
    var letzt = st.laut.lastIndexOf(true);
    if (letzt < 0) return;
    /* Stille am Ende auf 0,3 s kürzen */
    var bis = letzt + 1, nach = 0, n = 0, k;
    while (bis < st.bloecke.length && nach < STROM.nachlaufMs) { nach += st.bloecke[bis].length / d.rate * 1000; bis++; }
    for (k = 0; k < bis; k++) n += st.bloecke[k].length;
    var daten = new Float32Array(n), o = 0, laut = [];
    for (k = 0; k < bis; k++) {
      laut.push([o, st.bloecke[k].length, st.laut[k]]);
      daten.set(st.bloecke[k], o);
      o += st.bloecke[k].length;
    }
    var nr = d.nr++;
    d.teile[nr] = "";
    d.schlange.push({ nr: nr, daten: daten, laut: laut, nachschub: 0 });
    stromWeiter(d);
  }
  function stromWeiter(d) {
    if (d.laeuft || diktat !== d) return;
    var a = d.schlange.shift();
    if (!a) { if (d.stoppen) diktatEnde(); return; }
    d.laeuft = 1;
    a.grund = "";   /* 884b: der Grund des Gateways gilt nur für den Versuch, der ihn bekam */
    var wav = null;
    try {
      /* bei 16-kHz-Kontext nur das WAV-Gerüst, sonst der Sinc-Tiefpass aus 882 */
      wav = window.AusspracheP.alsWav({ numberOfChannels: 1, sampleRate: d.rate, length: a.daten.length,
        getChannelData: function () { return a.daten; } });
    } catch (e) {}
    if (!wav) { stromAntwort(d, a, { fehler: "wav" }); return; }
    window.AusspracheP.zentralErkennen(wav, { zeitgrenze: STROM.zeitgrenze }).then(function (antw) {
      stromAntwort(d, a, antw);
    }, function () { stromAntwort(d, a, { fehler: "netz" }); });
    /* NACHBESSERUNG 1: jede gesendete Sekunde zählt (Wiederholungen nicht doppelt). Ist die Tagesmenge voll, wird das
       schon Gesprochene noch aufgeschrieben, dann endet das Diktat (884b: mit dem Grund, nicht mehr der alte Weg). */
    if (!a.gezaehlt) { a.gezaehlt = 1; stromZaehlen(a.daten.length / d.rate); }
    if (!d.stoppen && stromVerbraucht() >= STROM.tagesSekunden) {
      stromWechsel(d, "strom-tagesmenge", "s=" + Math.round(stromVerbraucht()) + " von " + STROM.tagesSekunden + ", Ende", null, STROM_HEUTE_LIVE);
    }
  }
  function stromAntwort(d, a, antw) {
    d.laeuft = 0;
    if (diktat !== d) return;
    if (!antw || antw.fehler) { stromFehler(d, a, (antw && antw.fehler) || "netz"); return; }
    /* FASSUNG 884b (Prüfung): Azures Antwort reicht die Zentrale unverändert durch – sie hat IMMER RecognitionStatus.
       Fehlt er, kam die Antwort vom Gateway vor der Funktion (401 „Invalid JWT“ bei falsch gehender Geräteuhr, 503
       BOOT_ERROR, 546 WORKER_LIMIT: JSON, aber ohne „fehler“). Bis hier galt das als NoMatch – das Stück verschwand
       still, und am Ende stand nur „strom-nichts“ mit gutem Pegel. Jetzt ein Fehler mit dem Grund des Gateways. */
    if (typeof antw.RecognitionStatus !== "string") {
      a.grund = String(antw.code || antw.error || antw.msg || antw.message || "ohne Status").slice(0, 60);
      stromFehler(d, a, "antwort-unlesbar");
      return;
    }
    /* NoMatch / InitialSilenceTimeout: kein Text, kein Fehler */
    var nb = Array.isArray(antw.NBest) && antw.NBest[0] ? antw.NBest[0] : {};
    var text = String(antw.DisplayText || nb.Display || nb.Lexical || "").trim();
    if (text) {
      d.teile[a.nr] = d.teile[a.nr] ? d.teile[a.nr] + " " + text : text;
      d.gehoert = true;
      stromSchreiben(d);
    }
    /* Nachschub: liegt hinter dem, was Azure aufgeschrieben hat, noch Sprache, geht der Rest nach.
       NACHBESSERUNG 3: nur mit echtem Fortschritt (≥ 0,5 s erkannt, Schnitt genau am Ende des Erkannten – vorher
       begann er 0,15 s davor, mitten im letzten Wort, und bei „Ende ≤ 0,15 s“ ging dasselbe Stück bis zu 4× hinaus),
       und Sprache zählt erst 0,2 s hinter dem Erkannten (der Nachhall des letzten Worts ist keine neue Rede). */
    if (antw.RecognitionStatus === "Success" && text) {
      var ende = ((Number(antw.Offset) || 0) + (Number(antw.Duration) || 0)) / 1e7;
      var ab = Math.round(ende * d.rate), spaet = ab + Math.round(STROM.nachschubAbstandS * d.rate);
      var sprech = 0;
      if (ende >= STROM.nachschubAbS && ab < a.daten.length) {
        a.laut.forEach(function (z) {
          var von = Math.max(z[0], ab), bis = z[0] + z[1];
          if (bis > von && z[2]) sprech += Math.max(0, bis - Math.max(von, spaet)) / d.rate * 1000;
        });
      }
      if (sprech >= STROM.mindestSprechMs) {
        if (a.nachschub < STROM.nachschubHoechst) {
          /* FASSUNG 884b: in Teilen (stromRestTeile), vorn in die Schlange, in ihrer Reihenfolge */
          Array.prototype.unshift.apply(d.schlange, stromRestTeile(d, a, ab, spaet));
        } else {
          diktatFehlerMelden("strom-nachschub-grenze", "nr=" + a.nr + ", rest=" + Math.round(sprech) + " ms Sprache, rate=" + d.rate);
        }
      }
    }
    stromWeiter(d);
  }
  /* FASSUNG 884b — NACHSCHUB IN TEILEN (Prüfung: „jeder Nachschub schickt den ganzen Rest des Stücks noch einmal“).
     Hört Azure an jeder Pause auf, ging der Schluss eines langen Stücks bis zu fünfmal zur Zentrale (Sonde E4: 28,5 s
     Ton für 7,7 s Rede) – das kostet die Tagesmenge und die gemeinsamen Azure-Minuten mehrfach, und was nach der
     vierten Pause kam, fehlte. Jetzt wird der Rest an jeder Pause geteilt, die so lang ist wie die, an der Azure
     aufgehört hat (eine Blocklänge Spiel, 0,3–0,7 s): jedes Teil geht EINMAL hinaus, alle schreiben an dieselbe Stelle
     (nr), in ihrer Reihenfolge. Geteilt wird nur, wo davor und dahinter ≥ 0,3 s Sprache liegen; jedes Teil behält
     0,3 s Vor- und Nachlauf, kein Ton geht doppelt. Hört Azure innerhalb eines Teils noch früher auf, geht nur DESSEN
     Rest nach (höchstens 4 Stufen wie bisher). Ohne Pause im Rest (Dauerrede) bleibt es EIN Teil – wie bisher. */
  function stromRestTeile(d, a, ab, spaet) {
    var ms = function (n) { return n / d.rate * 1000; };
    /* Blöcke ab „ab“: [von, bis, laut, Sprache in ms] – laut zählt erst hinter „spaet“ (Nachhall, s. o.) */
    var bl = [], block = 0, i;
    a.laut.forEach(function (z) {
      block = Math.max(block, z[1]);
      var von = Math.max(z[0], ab), bis = z[0] + z[1];
      if (bis > von) bl.push([von, bis, Boolean(z[2]) && bis > spaet, z[2] ? Math.max(0, ms(bis - Math.max(von, spaet))) : 0]);
    });
    /* die Pause, an der Azure aufgehört hat: still ab „ab“ bis zur nächsten Sprache */
    var erst = -1, p = 0;
    for (i = 0; i < bl.length; i++) { if (bl[i][2]) { erst = i; break; } p += ms(bl[i][1] - bl[i][0]); }
    if (erst < 0) return [];
    var schwelle = Math.max(STROM.teilPauseMs, Math.min(STROM.pauseMs, p) - ms(block));
    var danach = [], summe = 0;
    for (i = bl.length - 1; i >= 0; i--) { if (bl[i][2]) summe += bl[i][3]; danach[i] = summe; }   /* Sprache ab Block i */
    var vor = Math.round(STROM.vorlaufMs * d.rate / 1000), nach = Math.round(STROM.nachlaufMs * d.rate / 1000);
    var grenzen = [], von0 = Math.max(ab, bl[erst][0] - vor), teilSprech = 0, stillVon = -1, still = 0;
    for (i = erst; i < bl.length; i++) {
      var b = bl[i];
      if (!b[2]) { if (stillVon < 0) stillVon = b[0]; still += ms(b[1] - b[0]); continue; }
      if (stillVon >= 0 && still >= schwelle && teilSprech >= STROM.mindestSprechMs && danach[i] >= STROM.mindestSprechMs) {
        var ende = Math.min(stillVon + nach, b[0]);
        grenzen.push([von0, ende]);
        von0 = Math.max(ende, b[0] - vor);
        teilSprech = 0;
      }
      stillVon = -1; still = 0;
      teilSprech += b[3];
    }
    grenzen.push([von0, a.daten.length]);
    return grenzen.map(function (g) {
      var laut = [];
      a.laut.forEach(function (z) {
        var v = Math.max(z[0], g[0]), e = Math.min(z[0] + z[1], g[1]);
        if (e > v) laut.push([v - g[0], e - v, z[2]]);
      });
      return { nr: a.nr, daten: a.daten.subarray(g[0], g[1]), laut: laut, nachschub: a.nachschub + 1, gezaehlt: 0 };
    });
  }
  function stromSpaeter(d, a, ms) {
    d.laeuft = 1;
    d.spaeterUhr = setTimeout(function () { d.laeuft = 0; if (diktat !== d) return; d.schlange.unshift(a); stromWeiter(d); }, ms);
  }
  function stromFehler(d, a, code) {
    var info = "nr=" + a.nr + (a.nachschub ? "." + a.nachschub : "") + ", rate=" + d.rate + ", ms=" +
      Math.round(a.daten.length / d.rate * 1000) + (a.grund ? ", grund=" + a.grund : "");
    /* Netz: einmal nach 1 s noch einmal */
    if (STROM_NETZ.indexOf(code) >= 0 && !a.wieder) { a.wieder = 1; stromSpaeter(d, a, 1000); return; }
    /* NACHBESSERUNG 1: „kontingent“ (429) ist meist vorübergehend – bei F0 genügt EIN anderer, der gerade im Trainer
       übt. Also nach 2,5 s und nach 5 s noch einmal, erst dann gilt es. */
    if (code === "kontingent" && (a.kontingent || 0) < 2) {
      a.kontingent = (a.kontingent || 0) + 1;
      stromSpaeter(d, a, STROM.kontingentMs * a.kontingent);
      return;
    }
    /* Tagesgrenze, Kontingent, Anmeldung, Schlüssel: der Strom-Weg ruht (stromSperren). FASSUNG 884b: Ende mit dem Grund
       – der alte Weg (Nachbesserung 1) nahm das Live-Mikro weg. Der Text bis hier bleibt im Feld. */
    if (STROM_ALT.indexOf(code) >= 0) {
      stromSperren(code);
      stromWechsel(d, "strom-" + code, info + (a.kontingent ? ", versuche=" + (a.kontingent + 1) : "") + ", Ende", 1, stromGrundText(code));
      return;
    }
    diktatFehlerMelden("strom-" + code, info);
    /* Ein Stück ging verloren (Netz, Dienst): einmal sagen – mit dem Satz des Browser-Diktats –, weiter diktieren */
    if (!d.verlorenGesagt) {
      d.verlorenGesagt = true;
      diktatKnopfZeigen(d.klasse, true, STROM_NETZ.indexOf(code) >= 0 ? STROM_KEIN_NETZ : "Die Spracherkennung meldet: " + code);
    }
    stromWeiter(d);
  }
  /* wie bei der Browser-Erkennung: Anfang + alles Erkannte, groß beginnen nach Satzende; immer ins Feld, das GERADE
     auf dem Bildschirm ist (auch wenn das Walkie inzwischen neu gebaut wurde). NACHBESSERUNG 2: ist das Walkie
     zugeklappt, in das zuletzt benutzte Feld – sein „input“ legt den Text in den Entwurf, und beim Aufklappen steht
     er wieder da. */
  function stromSchreiben(d) {
    var neu = d.teile.filter(Boolean).join(" ");
    if (neu && (!d.anfang || /[.!?]$/.test(d.anfang))) neu = neu.charAt(0).toUpperCase() + neu.slice(1);
    var ziel = diktatFeld(d.klasse) || d.feld;
    if (ziel) {
      d.feld = ziel;
      ziel.value = (d.anfang ? d.anfang + (neu ? " " : "") : "") + neu;
      ziel.dispatchEvent(new Event("input"));
    }
  }
  /* ⏹: das offene Stück geht noch hinaus, dann wird zu Ende geschrieben (höchstens 45 s). Ein zweites ⏹ beendet sofort. */
  function stromStoppen(d, sofort) {
    if (d.stoppen) { if (diktat === d) diktatEnde(); return; }
    d.stoppen = true;
    if (sofort) d.stueck = null; else stueckAbschicken(d);
    stromAufraeumen(d);
    if (diktat !== d) return;
    if (sofort || (!d.laeuft && !d.schlange.length)) { diktatEnde(); return; }
    diktatKnopfZeigen(d.klasse, true, "Einen Moment – ich schreibe noch auf …");
    d.bremseUhr = setTimeout(function () { if (diktat === d) diktatEnde(); }, STROM.bremseMs);
  }
  /* NACHBESSERUNG 2: zugeklappt (✕, Reiter) oder kein Betreiber mehr – ein laufendes Diktat aus dem Strom endet */
  function stromBeimZuklappen() {
    if (diktat && diktat.strom && !diktat.stoppen) stromStoppen(diktat);
  }
  function stromAufraeumen(d) {
    if (d.aufgeraeumt) return;
    d.aufgeraeumt = true;
    clearInterval(d.wacheUhr);
    clearTimeout(d.hoechstUhr);
    try { if (d.knoten) { if (d.knoten.port) d.knoten.port.onmessage = null; d.knoten.onaudioprocess = null; d.knoten.disconnect(); } } catch (e) {}
    try { if (d.quelle) d.quelle.disconnect(); } catch (e) {}
    try { if (d.stumm) d.stumm.disconnect(); } catch (e) {}
    try { if (d.ctx && d.ctx.state !== "closed") stromLeise(d.ctx.close()); } catch (e) {}
    try { if (d.klon) { d.klon.onended = null; d.klon.stop(); } } catch (e) {}
    try { if (d.modul) URL.revokeObjectURL(d.modul); } catch (e) {}
    d.modul = null;
    d.vorrat = [];
  }

  function diktatStarten(klasse) {
    var Erkenner = window.SpeechRecognition || window.webkitSpeechRecognition;
    var feld = diktatFeld(klasse);
    if (!Erkenner || !feld) return;
    /* FASSUNG 721 — Funk 166 (automatisch, Samsung Internet, nach Fassung 718): wieder „aborted". Läuft noch eine ältere
       Erkennung (z. B. ein schneller zweiter Tipp), bricht der Browser die neue ab – die alte wird jetzt vorher beendet. */
    try { if (window.__dmaDiktatMik) window.__dmaDiktatMik.abort(); } catch (e) {}
    /* FASSUNG 884 — im Livestream: aus dem laufenden Strom statt Mikrofon leihen (siehe oben). */
    var klon = null;
    try { klon = window.LiveChat && LiveChat.tonSpurKlon ? LiveChat.tonSpurKlon() : null; } catch (e) {}
    if (klon) {
      /* Nachbesserung 1: nur solange die Tagesmenge reicht und der Strom-Weg nicht ruht */
      var grund = diktatStromMoeglich() ? stromSperrgrund() : "unmoeglich";
      if (!grund) { diktatAusStrom(klasse, feld, klon); return; }
      try { klon.stop(); } catch (e) {}
      /* FASSUNG 884b — XANDER (Funk 163): „… schaltet sich das wieder aus wenn jemand da ist das soll generell immer
         aktiv sein“. Im Livestream mit lebender Live-Spur wird NIE ausgeliehen: bis hier ging es bei voller Tagesmenge,
         gesperrtem Strom-Weg oder ohne Zentrale auf den alten Weg (mikrofonLeihen → Live-Spur gestoppt, „stumm“ an
         alle). Neben dem Livestream bekommt die Browser-Erkennung auf Android das Mikrofon ohnehin nicht (Funk 139,
         „aborted“) – also kein Versuch, sondern gleich der Grund. Draußen (kein Klon) bleibt alles wie bisher. */
      if (grund === "unmoeglich") {
        var A = window.AusspracheP;
        diktatFehlerMelden("strom-unmoeglich", "ac=" + (window.AudioContext || window.webkitAudioContext ? 1 : 0) +
          ", aussprache=" + (A ? 1 : 0) + ", zentrale=" + (A && A.zentralMoeglich ? (A.zentralMoeglich() ? 1 : 0) : "-"));
      }
      diktatKnopfZeigen(klasse, false, stromGrundText(grund));
      return;
    }
    var mik = new Erkenner();
    window.__dmaDiktatMik = mik;
    mik.lang = "de-DE";
    mik.continuous = true;
    mik.interimResults = true;
    diktat = { mik: mik, klasse: klasse, anfang: feld.value.replace(/\s*$/, ""),
               an: false, gehoert: false, fehler: "", seit: Date.now() };
    /* FASSUNG 698 — XANDER (Funk 139): „bei dem Walkie-Talkie funktioniert die Spracheingabe
       nicht, wenn ich im Livestream-Modus bin". Der Livestream gibt sein Mikrofon fürs Diktat
       her und bekommt es danach zurück (livechat.js: mikrofonLeihen/-Zurueck).
       FASSUNG 884b: hierher kommt man nur noch OHNE lebende Live-Spur (draußen, oder die Spur ist schon tot) – dann
       nimmt das Leihen niemandem etwas weg („Dauernd an“, die warme Sprachnachricht-Spur, eine tote Spur). */
    try { if (window.LiveChat && LiveChat.mikrofonLeihen && LiveChat.mikrofonLeihen()) diktat.geliehen = true; } catch (e) {}
    diktatKnopfZeigen(klasse, true, diktat.geliehen ? "Livestream-Mikro kurz pausiert \u2026 Mikrofon wird eingeschaltet \u2026" : "Mikrofon wird eingeschaltet \u2026");
    /* RUNDE 100 — XANDER (Walkie-Talkie, Frage Diktat): „🎤 startet gar
       nicht". Hier nicht nachzustellen — der Startaufruf ist derselbe wie
       in der Fassung, die bei ihm lief (523). Gefunden habe ich aber zwei
       Stellen, an denen es GENAU so aussieht:
         1. Endet die Erkennung sofort mit einem Fehler, den ich nicht
            kannte (z. B. „audio-capture", „aborted",
            „language-not-supported"), sprang der Knopf ohne jedes Wort
            zurueck auf 🎤.
         2. Kam nach ⏹ kein „onend", blieb das alte Diktat haengen, und
            jeder weitere Tipp hielt nur das tote an.
       Jetzt steht JEDER Grund da, ein Waechter beendet ein Diktat, das
       nach 4 s noch nicht laeuft, und der Fehlercode geht als Meldung an
       mich — damit ich den echten Grund sehe statt zu raten. */
    var zeigenAn = function () {
      if (!diktat || diktat.mik !== mik || diktat.an) return;
      diktat.an = true;
      diktatKnopfZeigen(klasse, true, "Ich h\u00f6re zu \u2026 sprich einfach.");
    };
    mik.onstart = zeigenAn;
    mik.onaudiostart = zeigenAn;
    /* FASSUNG 774 — Funk 197 (automatisch, Samsung Internet 30, Android 10): „kein-start". Samsung meldet den Start
       manchmal nur über onsoundstart/onspeechstart – oder erst, nachdem die Mikrofon-Freigabe bestätigt ist. Bisher
       brach der Wächter nach 4 s ab. Jetzt zählen alle vier Startzeichen, der Wächter wartet 6 s und versucht dann
       EINMAL neu zu starten; erst wenn auch das nach 5 s nichts bringt, gilt es als Fehler (mit Zustand im Bericht). */
    mik.onsoundstart = zeigenAn;
    mik.onspeechstart = zeigenAn;
    var waechter = function (zweiter) {
      setTimeout(function () {
        if (!diktat || diktat.mik !== mik || diktat.an) return;
        if (!zweiter) {
          diktat.wartet = true;
          try { mik.abort(); } catch (e) {}
          diktatKnopfZeigen(klasse, true, "Das Mikrofon braucht noch einen Moment …");
          setTimeout(function () {
            if (!diktat || diktat.mik !== mik) return;
            diktat.wartet = false;
            try { mik.start(); } catch (e) {}
            waechter(true);
          }, 700);
          return;
        }
        try { mik.abort(); } catch (e) {}
        diktatFehlerMelden("kein-start", "geliehen=" + (diktat.geliehen ? 1 : 0) + ", zweiter Versuch, ms=" + (Date.now() - diktat.seit));
        diktatEnde("Das Mikrofon ist nicht angesprungen. Ist es gerade in einer anderen App belegt? Dann dort freigeben und nochmal 🎤.");
      }, zweiter ? 5000 : 6000);
    };
    waechter(false);
    mik.onresult = function (ev) {
      if (!diktat || diktat.mik !== mik) return;
      diktat.an = true;
      diktat.gehoert = true;
      var fest = [], zwischen = "";
      for (var i = 0; i < ev.results.length; i++) {
        var stueck = String(ev.results[i][0].transcript || "").trim();
        if (!stueck) continue;
        if (ev.results[i].isFinal) diktatAnfuegen(fest, stueck);
        else zwischen = stueck;
      }
      if (zwischen && fest.length &&
          diktatGleich(zwischen).indexOf(diktatGleich(fest[fest.length - 1])) === 0) {
        zwischen = zwischen.slice(fest[fest.length - 1].length).trim();
      }
      var anfang = diktat.anfang;
      var neu = fest.join(" ");
      if (neu && (!anfang || /[.!?]$/.test(anfang))) neu = neu.charAt(0).toUpperCase() + neu.slice(1);
      var ziel = diktatFeld(klasse);
      if (ziel) {
        ziel.value = (anfang ? anfang + (neu ? " " : "") : "") + neu;
        ziel.dispatchEvent(new Event("input"));
      }
      diktatKnopfZeigen(klasse, true, zwischen ? "\u2026 " + zwischen : "Ich h\u00f6re zu \u2026");
    };
    mik.onerror = function (ev) {
      if (!diktat || diktat.mik !== mik) return;
      var w = (ev && ev.error) || "unbekannt";
      /* FASSUNG 721 — Funk 166: der zweite Versuch galt bis 718 nur, wenn das Livestream-Mikrofon ausgeliehen war und die
         Erkennung noch nicht lief. Jetzt bei JEDEM „aborted", solange noch kein Wort angekommen ist – einmal, nach 700 ms. */
      if (w === "aborted" && !diktat.gehoert && !diktat.nochmal) {
        diktat.nochmal = true; diktat.wartet = true;
        setTimeout(function () { if (diktat && diktat.mik === mik) { diktat.wartet = false; try { mik.start(); } catch (e) { diktatEnde("Die Spracherkennung lie\u00df sich nicht starten."); } } }, 700);
        return;
      }
      /* FASSUNG 724 — Funk 171 (automatisch, Samsung Internet): „aborted" nach 41 s, die Erkennung lief und hatte schon
         Wörter geliefert. Das ist kein Defekt – Samsung beendet lange Diktate so. Der Text bleibt stehen, keine
         Fehlermeldung, kein Bericht. */
      if (w === "aborted" && diktat.gehoert) { diktatEnde(); return; }
      diktat.fehler = w;
      /* „no-speech" ist kein Defekt — er hat nur (noch) nichts gesagt. */
      /* Mit Zustand, damit man den Fall erkennt: geliehen = Livestream-Mikro abgegeben, an = Erkennung lief schon,
         nochmal = zweiter Versuch, ms = Zeit seit dem Tipp. */
      if (w !== "no-speech") diktatFehlerMelden(w, ((ev && ev.message) ? ev.message + "; " : "") + "geliehen=" + (diktat.geliehen ? 1 : 0) + ", an=" + (diktat.an ? 1 : 0)
        + ", nochmal=" + (diktat.nochmal ? 1 : 0) + ", ms=" + (Date.now() - diktat.seit));
      var grund = {
        "not-allowed": "Das Mikrofon ist nicht erlaubt \u2013 bitte im Browser freigeben.",
        "service-not-allowed": "Die Spracherkennung ist in diesem Browser gesperrt.",
        "network": "Die Spracherkennung braucht Netz \u2013 gerade keins.",
        "audio-capture": "Kein Mikrofon gefunden \u2013 oder eine andere App benutzt es gerade.",
        "aborted": "Die Spracherkennung wurde vom Browser abgebrochen.",
        "language-not-supported": "Deutsch wird von der Spracherkennung dieses Browsers nicht angeboten.",
        "no-speech": "Ich habe nichts geh\u00f6rt \u2013 nochmal \ud83c\udfa4 und gleich sprechen."
      }[w] || ("Die Spracherkennung meldet: " + w);
      diktatEnde(grund);
    };
    mik.onend = function () {
      if (!diktat || diktat.mik !== mik || diktat.wartet) return;
      /* Ende ohne Fehler und ohne ein einziges Wort: auch das sagen. */
      if (!diktat.gehoert && Date.now() - diktat.seit < 1500) {
        diktatFehlerMelden("sofort-ende", "");
        diktatEnde("Die Spracherkennung hat sofort wieder aufgeh\u00f6rt \u2013 ich habe die Meldung bekommen.");
        return;
      }
      diktatEnde();
    };
    /* FASSUNG 718 — hat der Livestream gerade sein Mikrofon abgegeben, braucht Android einen Moment, bis es frei ist:
       sofort gestartet, meldet die Erkennung „aborted" (Funk 164). Deshalb 350 ms warten; und kommt trotzdem „aborted",
       noch EIN Versuch nach 700 ms, bevor es als Fehler gilt. */
    var starten = function () {
      if (!diktat || diktat.mik !== mik) return;
      try { mik.start(); } catch (e) {
        diktatFehlerMelden("start-wirft", String((e && e.message) || e));
        diktatEnde("Die Spracherkennung lie\u00df sich nicht starten.");
      }
    };
    if (diktat.geliehen) setTimeout(starten, 350); else starten();
  }
  /* Der Fehlercode geht als kleine Meldung an Claude — einmal je Code
     und Sitzung, damit nichts zugemuellt wird. */
  var diktatGemeldet = {};
  function diktatFehlerMelden(code, text) {
    if (diktatGemeldet[code]) return;
    diktatGemeldet[code] = true;
    var sb = zugang();
    if (!sb) return;
    var geraet = String(navigator.userAgent || "").slice(0, 160);
    try {
      sb.from("betreiber_funk").insert({ von: "xander",
        text: "[automatisch] Diktat-Fehler: " + code + (text ? " (" + text + ")" : "") + " \u00b7 " + geraet })
        .then(function () {}, function () {});
    } catch (e) {}
  }

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
      var laeuft = Boolean(diktat && diktat.klasse === klasse);
      /* FASSUNG 884: wird das Walkie während des Nachschreibens neu gebaut, steht dort weiter „Einen Moment …“ */
      var live = el("div", "rf-live", laeuft ? (diktat.strom && diktat.stoppen ? "Einen Moment \u2013 ich schreibe noch auf \u2026" : "Ich h\u00f6re zu \u2026") : "");
      var b = knopf("rf-mik" + (laeuft ? " rf-hoert" : ""), laeuft ? "\u23f9" : "\ud83c\udfa4", function () {
        if (diktat) {
          var d = diktat;
          try { d.mik.stop(); } catch (e) { diktatEnde(); }
          /* Kommt nach ⏹ kein Ende, haengt es nicht fest: nach 0,8 s
             ist es trotzdem aus, und der naechste Tipp startet neu. */
          /* FASSUNG 884: nicht beim Diktat aus dem Strom – dort schreibt es nach ⏹ noch zu Ende (stromStoppen) */
          setTimeout(function () { if (diktat === d && !d.strom) diktatEnde(); }, 800);
          return;
        }
        diktatStarten(klasse);
      });
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
    var antwort = (f.art === "auswahl" && f.einzeln === true)
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
  /* FASSUNG 885 — der Takt fragte auch bei verdeckter Seite alle 20 s (8 s offen) nach, rund um die Uhr.
     Verdeckt oder während der Bremse (backend.js) wird nichts geholt; beim Zurückkommen sofort (wie bisher). */
  function gebremst() {
    try { return Boolean(Backend.bremse && Backend.bremse().aktiv); } catch (e) { return false; }
  }
  /* FASSUNG 885 (Nachbesserung 3) — verdeckt wie die Benachrichtigungen (app.js verdecktNachsehen): alle 2 min nur die
     neueste Kennung von Funk und offenen Fragen (je limit 1, nacheinander). Ist eine neu, wird einmal wie gewohnt geholt –
     der Reiter zuckt dann beim Zurückkommen schon wie in 884. Sonst holt erst das Zurückkommen. */
  var VERDECKT_TAKT = 120000, verdecktZuletzt = 0, verpasst = false;
  function verdecktNachsehen() {
    if (!istBetreiber()) return;
    var sb = zugang();
    if (!sb || laeuft) return;
    verdecktZuletzt = Date.now();
    function bekannt(liste, zeile) { return !zeile || liste.some(function (x) { return String(x.id) === String(zeile.id); }); }
    sb.from("betreiber_funk").select("id").order("id", { ascending: false }).limit(1).then(function (k) {
      if (!k || k.error || !k.data) return;
      if (!bekannt(funk, k.data[0])) { holen(); return; }
      return sb.from("betreiber_rueckfragen").select("id").is("beantwortet", null).order("id", { ascending: false }).limit(1).then(function (q) {
        if (!q || q.error || !q.data) return;
        if (!bekannt(fragen, q.data[0])) holen();
      });
    })["catch"](function () {});
  }
  function planen() {
    if (uhr) clearTimeout(uhr);
    uhr = setTimeout(function () {
      if (gebremst()) verpasst = true;
      else if (!document.hidden) { verpasst = false; holen(); }
      else if (Date.now() - verdecktZuletzt >= VERDECKT_TAKT || Date.now() < verdecktZuletzt) verdecktNachsehen();
      planen();
    }, istOffen() ? TAKT_OFFEN : TAKT);
  }

  function start() {
    holen();
    planen();
    /* FASSUNG 884 — geht die Tastatur auf oder zu, das Walkie-Feld neu ausrichten (tastaturLuft) */
    try { if (window.visualViewport) window.visualViewport.addEventListener("resize", function () { tastaturLuft(); }); } catch (e) {}
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && !gebremst()) holen();
    });
    /* Nachbesserung 3 — die Bremse ist frei (backend.js): gleich nachholen, nicht erst im nächsten Takt */
    window.addEventListener("dma-bremse-frei", function () {
      if (verpasst && !document.hidden && !gebremst()) { verpasst = false; holen(); }
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
    stand: function () { return fragen.slice(); },
    /* FASSUNG 884 — nur für die Sonde (Zeiten verkürzen, rate16k umschalten) */
    diktatStrom: STROM
  };
})();
