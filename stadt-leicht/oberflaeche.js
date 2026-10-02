/* =====================================================================
   LEICHTE STADT — BEDIENUNG
   ---------------------------------------------------------------------
   XANDER: „mit dem selben Komfort des Bauens und der Ansichten der
   Fertigstellung, wenn ein Haus baut" – „praktisch so den Leuten die
   Möglichkeit geben, das Ganze zu upgraden".

   oben links   zurück zur Webseite · Name der Stadt
   oben rechts  Tageszeit · Jahreszeit · Farbstimmung · Karte drehen
   unten rechts Mini-Karte 3 × 3 (antippen = hinfliegen)
   unten links  „Schmücken": eigenen Schmuck setzen (Baukasten)
   Antippen eines Hauses: Name, Stufe, Baufortschritt, Helfen, Drehen.
   Antippen eines leeren Bauplatzes: welches Haus hierher gehört, Bauen.
   Alles ab 360 px Breite ohne Überlappung, Tippflächen ≥ 40 px.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder, D = ST.dorf;
  const O = (ST.oberflaeche = {});
  const L = () => ST.leicht;
  const wurzel = document.getElementById("lOber");

  const SYM = {
    sonne: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.6" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>',
    daemmerung: '<svg viewBox="0 0 24 24"><path d="M3 17h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 17a5.5 5.5 0 0 1 11 0z" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 6.5v2.2M4.8 10l1.6 1.4M19.2 10l-1.6 1.4"/></g></svg>',
    mond: '<svg viewBox="0 0 24 24"><path d="M15.5 3.2a8.8 8.8 0 1 0 5.3 13.4A7.2 7.2 0 0 1 15.5 3.2z" fill="currentColor"/></svg>',
    schnee: '<svg viewBox="0 0 24 24"><g stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.6 4.2 12 6.3l2.4-2.1M9.6 19.8 12 17.7l2.4 2.1"/></g></svg>',
    bluete: '<svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="12" cy="6.3" r="3.3"/><circle cx="17.4" cy="10.2" r="3.3"/><circle cx="15.4" cy="16.5" r="3.3"/><circle cx="8.6" cy="16.5" r="3.3"/><circle cx="6.6" cy="10.2" r="3.3"/></g><circle cx="12" cy="11.8" r="2.6" fill="#f3c33c"/></svg>',
    blatt: '<svg viewBox="0 0 24 24"><path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" fill="currentColor"/><path d="M5 19 14 10" stroke="#1b2440" stroke-width="1.3" opacity=".6"/></svg>',
    links: '<svg viewBox="0 0 24 24"><path d="M5.5 12a6.5 6.5 0 1 0 2-4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.2 3.8 7.6 7.6l-4.3.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rechts: '<svg viewBox="0 0 24 24"><path d="M18.5 12a6.5 6.5 0 1 1-2-4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.8 3.8 16.4 7.6l4.3.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    haken: '<svg viewBox="0 0 24 24"><path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kreuz: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    versetzen: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18"/><path d="m9 5.8 3-2.8 3 2.8M9 18.2l3 2.8 3-2.8M5.8 9 3 12l2.8 3M18.2 9 21 12l-2.8 3"/></g></svg>',
    abriss: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/></g></svg>',
    karte: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/></g></svg>',
    farbe: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 1.6-2.1-.5-1.2.3-2.4 1.6-2.4H17a4 4 0 0 0 4-4C21 7 17 3 12 3z" fill="currentColor"/><g fill="#1b2440"><circle cx="7.6" cy="11.2" r="1.5"/><circle cx="10.3" cy="7.2" r="1.5"/><circle cx="15" cy="7.4" r="1.5"/></g></svg>',
    zurueck: '<svg viewBox="0 0 24 24"><path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* FASSUNG 814 — Vorschau der Jahreszeiten (Betreiber): Kalender = automatisch, kahler Baum = Spätherbst, Wolke mit Flocken = Schneefall */
    kalender: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></g><path d="M9.2 17.6l2.8-6 2.8 6M10.2 15.6h3.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kahl: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M11 21v-9M11 15l-4-4M11 13l4-5M7 11l-2-3M7 11l-3 .5M15 8l.5-3.5M15 8l3-1.5"/></g><path d="M18.5 14.5c1.8 0 2.8 1.2 2.8 3-1.8 0-2.8-1.2-2.8-3z" fill="currentColor"/></svg>',
    schneefall: '<svg viewBox="0 0 24 24"><path d="M6.5 13a4 4 0 0 1 .6-8 5 5 0 0 1 9.4 1.6A3.3 3.3 0 0 1 16.8 13z" fill="currentColor"/><g fill="currentColor"><circle cx="7.5" cy="17" r="1.4"/><circle cx="12" cy="20" r="1.4"/><circle cx="16.5" cy="17" r="1.4"/></g></svg>',
    stern: '<svg viewBox="0 0 24 24"><path d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6-4.5-4.2 6.1-.7z" fill="currentColor"/></svg>',
    lupe: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></g></svg>',
    voll: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></g></svg>',
    /* FASSUNG 812 — Stecknadel („Ansicht festhalten") */
    pin: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5h6l-1 5.2 3.2 3.3H6.8L10 8.7z" fill="currentColor"/><path d="M12 12v8.5"/></g></svg>',
    /* FASSUNG 822 — Liste: die Karte/Station des Hauses im Spiel darunter öffnen */
    liste: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 7h11M9 12h11M9 17h11"/></g><g fill="currentColor"><circle cx="4.5" cy="7" r="1.5"/><circle cx="4.5" cy="12" r="1.5"/><circle cx="4.5" cy="17" r="1.5"/></g></svg>',
    hammer: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6.5 17.5 10M4 20l9-9"/><path d="M12.5 5l4-2 4.5 4.5-2 4-2-.5-3-3z" fill="currentColor"/></g></svg>'
  };
  const ZEITEN = ["tag", "abend", "nacht"], ZEIT_SYM = { tag: "sonne", abend: "daemmerung", nacht: "mond" };
  const JAHR_SYM = { winter: "schnee", fruehling: "bluete", sommer: "sonne", herbst: "blatt" };
  const JAHR_NAME = { winter: "Winter", fruehling: "Frühling", sommer: "Sommer", herbst: "Herbst" };
  /* FASSUNG 814 — XANDER: „als Betreiber alle Jahreszeiten vorschauen inkl. Schnee". Der Jahreszeit-Knopf (nur für den
     Betreiber) schaltet durch diese Stufen; „Automatisch" folgt wieder Datum und Wetter. */
  const MODUS_FOLGE = ["fruehling", "sommer", "fruehherbst", "spaetherbst", "winter", "schneefall", "auto"];
  const MODUS_SYM = { fruehling: "bluete", sommer: "sonne", fruehherbst: "blatt", spaetherbst: "kahl", winter: "schnee", schneefall: "schneefall", auto: "kalender", fest: "blatt" };
  function modusName() {
    const M = SZ.MODI[SZ.modus];
    if (M) return M.name;
    if (SZ.modus === "fest") return JAHR_NAME[SZ.jahr] || SZ.jahr;
    return "Automatisch: " + (JAHR_NAME[SZ.jahr] || SZ.jahr) + (SZ.jahr === "winter" && SZ.schneefall ? " mit Schneefall" : "");
  }
  /* Die Karte in 3 × 3 Bereiche à 48 m */
  /* FASSUNG 807 — die Viertel der Originalkarte (Welt x nach rechts, y nach vorn) */
  /* FASSUNG 808 — Viertel der Originalkarte (die Karte ist nach Welt-Achsen geteilt, im Bild also schräg) */
  const BEREICHE = ST.dorf && ST.dorf.VORLAGE === "altdorf" ? [["Bahn", "Gefängnis", "Krankenhaus"], ["Mühle", "Rathaus", "Schmiede"], ["Kuhstall", "Hühnerstall", "Seeufer"]]
    : [["Tannenwald", "Kirchplatz", "Obstwiese"], ["Domplatz", "Anger", "Mühlbach"], ["Gärten", "Bahnhof", "Seeufer"]];
  const BG = 48;

  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function knopf(sym, titel, fn, cls) {
    const b = el("button", "lk-knopf" + (cls ? " " + cls : ""), SYM[sym] || sym);
    b.type = "button"; b.title = titel; b.setAttribute("aria-label", titel);
    b.addEventListener("click", (e) => { e.stopPropagation(); fn(e); });
    return b;
  }
  let ansageUhr = 0;
  function ansage(t) {
    let a = wurzel.querySelector(".lk-ansage");
    if (!a) { a = el("div", "lk-ansage"); wurzel.appendChild(a); }
    a.textContent = t; a.classList.add("an");
    clearTimeout(ansageUhr); ansageUhr = setTimeout(() => a.classList.remove("an"), 1800);
  }
  O.ansage = ansage;

  /* ---------------- Farbstimmung (wie Winterhausen) ---------------- */
  const STIMMUNG = {
    tag: { satt: 0.30, kon: 0.10, sep: 0.18, warm: "rgba(255,196,120,.16)", vig: 0.30 },
    abend: { satt: 0.30, kon: 0.12, sep: 0.25, warm: "rgba(255,150,90,.22)", vig: 0.45 },
    nacht: { satt: 0.15, kon: 0.12, sep: 0.12, warm: "rgba(255,170,80,.10)", vig: 0.50 }
  };
  let stimmung = null, farbK = 1;
  /* FASSUNG 814 — XANDER: „Farbverhältnis und Kontrastverhältnis … Regler … generell kannst du den Leuten diese Möglichkeit
     auch einräumen" (das Bild ist manchmal zu dunkel oder zu intensiv). Jeder stellt für sich Helligkeit, Sättigung und
     Kontrast ein (in Prozent, 100 = wie gemalt), gemerkt im Browser; es wirkt auf Boden und Dinge gleichermaßen. */
  const REGLER = [
    { k: "farbe", name: "Farbstimmung", min: 0, max: 200, merk: "leicht_farbe" },
    { k: "hell", name: "Helligkeit", min: 50, max: 150, merk: "leicht_hell" },
    { k: "satt", name: "Sättigung", min: 0, max: 200, merk: "leicht_satt" },
    { k: "kontrast", name: "Kontrast", min: 50, max: 150, merk: "leicht_kontrast" }
  ];
  const BILD = { farbe: 100, hell: 100, satt: 100, kontrast: 100 };
  O.bildWerte = BILD;
  function stimmungSetzen() {
    /* FASSUNG 795 — nach der Uhr fließend zwischen Tag, Dämmerung und Nacht */
    let m = STIMMUNG[SZ.zeit] || STIMMUNG.tag;
    const Zd = SZ.zeitDaten();
    if (SZ.zeitAuto && Zd.grad != null) {
      const n = Zd.grad, A = n <= 0.75 ? STIMMUNG.tag : STIMMUNG.abend, B = n <= 0.75 ? STIMMUNG.abend : STIMMUNG.nacht, t = n <= 0.75 ? n / 0.75 : (n - 0.75) / 0.25;
      const mi = (x, y) => x + (y - x) * t, farbe = (x, y) => { const p = x.match(/[\d.]+/g).map(Number), q = y.match(/[\d.]+/g).map(Number); return "rgba(" + p.map((v, i) => i < 3 ? Math.round(mi(v, q[i])) : mi(v, q[i]).toFixed(3)).join(",") + ")"; };
      m = { satt: mi(A.satt, B.satt), kon: mi(A.kon, B.kon), sep: mi(A.sep, B.sep), vig: mi(A.vig, B.vig), warm: farbe(A.warm, B.warm) };
    }
    const k = farbK = BILD.farbe / 100;
    let f = k > 0 ? "sepia(" + (m.sep * k).toFixed(3) + ") saturate(" + (1 + m.satt * k).toFixed(3) + ") contrast(" + (1 + m.kon * k).toFixed(3) + ")" : "";
    /* FASSUNG 814 — die eigenen Regler kommen hinter die Stimmung (gleich für Boden und Dinge) */
    if (BILD.hell !== 100) f += " brightness(" + (BILD.hell / 100).toFixed(2) + ")";
    if (BILD.satt !== 100) f += " saturate(" + (BILD.satt / 100).toFixed(2) + ")";
    if (BILD.kontrast !== 100) f += " contrast(" + (BILD.kontrast / 100).toFixed(2) + ")";
    f = f.trim() || "none";
    ["lBoden", "lDinge"].forEach((id) => { document.getElementById(id).style.filter = f; });
    stimmung.style.opacity = Math.min(1, k).toFixed(2);
    stimmung.style.background = "linear-gradient(160deg," + m.warm + " 0%, rgba(0,0,0,0) 45%)";
    stimmung.firstChild.style.background = "radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(8,10,30," + (m.vig * Math.min(1.4, k)).toFixed(3) + ") 100%)";
  }

  let kopf, zeitK, jahrK, farbFeld, minirahmen, mini, miniC, karte, deckel, leiste, schmuckKnopf, bauKnopf, bauLeiste = null;
  O.start = function (q) {
    stimmung = el("div", "lk-stimmung", "<i></i>");
    document.getElementById("lStadt").insertBefore(stimmung, wurzel);
    /* FASSUNG 814 — gemerkte Werte (localStorage), zum Prüfen auch ?farbe= ?hell= ?satt= ?kontrast= */
    for (const r of REGLER) {
      let v = null;
      try { v = localStorage.getItem(r.merk); } catch (e) {}
      if (q.get(r.k) != null) v = q.get(r.k);
      if (v != null && v !== "" && isFinite(+v)) BILD[r.k] = Math.max(r.min, Math.min(r.max, Math.round(+v)));
    }
    farbK = BILD.farbe / 100;

    kopf = el("div", "lk-kopf");
    const links = el("div", "lk-kopf-links");
    /* FASSUNG 798: in der Seite eingebettet (Rahmen über dem Livestream) schließt „zurück“ den Rahmen. */
    const eingebettet = q.get("eingebettet") === "1" && window.parent !== window;
    links.appendChild(knopf("zurueck", eingebettet ? "Zurück" : "Zurück zur Webseite", () => { if (eingebettet) { try { window.parent.postMessage({ typ: "leicht-zu" }, location.origin); return; } catch (e) {} } if (history.length > 1 && document.referrer.indexOf(location.host) >= 0) history.back(); else location.href = "index.html"; }));
    /* FASSUNG 806 — XANDER: „wenn wir der Vollbildansicht sind, darf es nicht kaputtmachen oder man muss halt die Wahl
       bekommen in neuen Tab öffnen … dass man da kurz dort in Ruhe gucken kann oder das auf einem zweiten Gerät öffnet". */
    if (eingebettet) links.appendChild(knopf('<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5H5V6h5"/></g></svg>', "In neuem Tab öffnen", () => {
      try { window.parent.postMessage({ typ: "leicht-zu" }, location.origin); } catch (e) {}
      window.open("stadt-leicht.html", "_blank", "noopener");
    }, "lk-neuer-tab"));
    const name = el("div", "lk-name");
    links.appendChild(name);
    kopf.appendChild(links);
    const rechts = el("div", "lk-kopf-rechts");
    zeitK = knopf(ZEIT_SYM[SZ.zeit], "Tageszeit", () => { SZ.zeitAuto = false; SZ.zeit = ZEITEN[(ZEITEN.indexOf(SZ.zeit) + 1) % 3]; zeitK.innerHTML = SYM[ZEIT_SYM[SZ.zeit]]; ansage(ST.ZEITEN[SZ.zeit].name); stimmungSetzen(); L().unruhe = 2; });
    jahrK = knopf(MODUS_SYM[SZ.modus] || JAHR_SYM[SZ.jahr] || "blatt", "Jahreszeit", () => {
      /* FASSUNG 814 — Frühling → Sommer → Frühherbst → Spätherbst → Winter → Schneefall → Automatisch */
      const i = MODUS_FOLGE.indexOf(SZ.modus);
      SZ.modus = MODUS_FOLGE[(i + 1) % MODUS_FOLGE.length];
      SZ.jahrStellen(); D.jahrFiltern(); O.jahrAnzeigen(); ansage(modusName()); L().unruhe = 2;
    }, "lk-jahr");
    const farbKn = knopf("farbe", "Farbstimmung", () => { farbFeld.hidden = !farbFeld.hidden; }, "lk-farbknopf");
    farbKn.setAttribute("aria-label", "Farbe, Helligkeit und Kontrast einstellen");
    /* FASSUNG 808 — XANDER: „Tag und Nacht braucht man nicht wählen … soll realistisch nach Uhrzeit sein, vielleicht
       angepasst an die Zeitzone des Nutzers". Tageszeit und Jahreszeit laufen nach der Uhr und dem Datum des Geräts (also in
       dessen Zeitzone); die beiden Schalter sieht nur noch der Betreiber (Vorschau). */
    zeitK.hidden = jahrK.hidden = !(ST.spiel && ST.spiel.betreiber);
    rechts.append(zeitK, jahrK, farbKn, knopf("links", "Karte nach links drehen", () => drehen(1)), knopf("rechts", "Karte nach rechts drehen", () => drehen(-1)));
    kopf.appendChild(rechts);
    wurzel.appendChild(kopf);
    nameSetzen();
    O.jahrAnzeigen();

    /* FASSUNG 814 — XANDER: „Farbverhältnis und Kontrastverhältnis … Regler". Für alle: Farbstimmung, Helligkeit,
       Sättigung, Kontrast – je ein Regler, gemerkt im Browser, dazu „Zurücksetzen". */
    farbFeld = el("div", "lk-farbfeld");
    farbFeld.hidden = true;
    farbFeld.setAttribute("role", "group"); farbFeld.setAttribute("aria-label", "Bild einstellen");
    const reglerEl = {};
    const zeigeWert = (r) => { const e = reglerEl[r.k]; e.input.value = BILD[r.k]; e.zahl.textContent = BILD[r.k] + " %"; };
    for (const r of REGLER) {
      const zeile = el("div", "lk-regler lk-regler-" + r.k, '<label><span></span> <b></b></label><input type="range" step="5">');
      const input = zeile.querySelector("input"), id = "lkRegler_" + r.k;
      input.id = id; input.min = r.min; input.max = r.max; input.setAttribute("aria-label", r.name);
      zeile.querySelector("label").htmlFor = id; zeile.querySelector("span").textContent = r.name;
      reglerEl[r.k] = { input: input, zahl: zeile.querySelector("b") };
      zeigeWert(r);
      input.addEventListener("input", () => {
        BILD[r.k] = +input.value; zeigeWert(r); stimmungSetzen(); L().unruhe = 2;
        try { localStorage.setItem(r.merk, String(BILD[r.k])); } catch (e) {}
      });
      farbFeld.appendChild(zeile);
    }
    const zurueckK = el("button", "lk-regler-zurueck", "Zurücksetzen"); zurueckK.type = "button";
    zurueckK.addEventListener("click", (e) => {
      e.stopPropagation();
      for (const r of REGLER) { BILD[r.k] = 100; zeigeWert(r); try { localStorage.removeItem(r.merk); } catch (x) {} }
      stimmungSetzen(); ansage("Bild wie gemalt"); L().unruhe = 2;
    });
    farbFeld.appendChild(zurueckK);
    farbFeld.addEventListener("click", (e) => e.stopPropagation());
    /* FASSUNG 796 — Sparmodus zum Einschalten (schwache Verbindung) */
    const spar = el("label", "lk-spar", '<input type="checkbox"> Daten sparen (schwache Verbindung)');
    const sparK = spar.querySelector("input"); sparK.checked = !!LB.spar;
    sparK.addEventListener("change", () => { try { localStorage.setItem("leicht_spar", sparK.checked ? "1" : "0"); } catch (e) {} LB.spar = sparK.checked; ansage(sparK.checked ? "Sparmodus an" : "Sparmodus aus"); L().unruhe = 2; });
    farbFeld.appendChild(spar);
    wurzel.appendChild(farbFeld);
    stimmungSetzen();
    setInterval(() => { if (SZ.zeitAuto) { stimmungSetzen(); if (zeitK) zeitK.innerHTML = SYM[ZEIT_SYM[SZ.zeit]]; } }, 30000);

    /* Mini-Karte */
    minirahmen = el("div", "lk-mini-rahmen");
    mini = el("div", "lk-mini"); miniC = el("canvas"); mini.appendChild(miniC);
    const gitter = el("div", "lk-mini-gitter");
    BEREICHE.forEach((zeile, j) => zeile.forEach((n, i) => {
      const f = el("button", "lk-mini-feld", "<span>" + n + "</span>"); f.type = "button";
      f.addEventListener("click", (e) => { e.stopPropagation(); if (O.kachelHin && document.body.classList.contains("lk-mini-modus")) { O.kachelHin(i, j); return; } L().fliegeZu((i - 1) * BG, (j - 1) * BG, O.miniNah ? O.miniNah() : Math.max(K.s, 11 * K.dpr), 900); ansage(n); });
      gitter.appendChild(f);
    }));
    mini.appendChild(gitter);
    /* FASSUNG 817 — im kleinen Rahmen zeigt ein heller Rahmen in der Karte, welcher Teil gerade zu sehen ist */
    const blick = el("i", "lk-mini-blick"); blick.setAttribute("aria-hidden", "true"); mini.appendChild(blick);
    minirahmen.append(knopf("karte", "Karte ein- und ausklappen", () => { mini.classList.toggle("zu"); }, "lk-mini-schalter"), mini);
    wurzel.appendChild(minirahmen);

    /* unten links: Schmücken */
    schmuckKnopf = el("button", "lk-schmuck", SYM.stern + "<span>Schmücken</span>");
    schmuckKnopf.type = "button";
    schmuckKnopf.addEventListener("click", (e) => { e.stopPropagation(); if (bauLeiste) { bauLeisteZeigen(false); return; } leisteZeigen(!leiste || leiste.hidden); });
    wurzel.appendChild(schmuckKnopf);
    /* FASSUNG 795 — XANDER: „Ich sehe nirgendswo ne Möglichkeit Haus zu
       bauen." Bisher ging das nur über einen leeren Bauplatz. Jetzt ein
       eigener Knopf mit allen Gebäuden: gebaut (Stufe), im Bau, baubar. */
    bauKnopf = el("button", "lk-schmuck lk-bauen", SYM.hammer + "<span>Bauen</span>");
    bauKnopf.type = "button";
    bauKnopf.addEventListener("click", (e) => { e.stopPropagation(); bauLeisteZeigen(!bauLeiste || bauLeiste.hidden); });
    wurzel.appendChild(bauKnopf);

    karte = el("div", "lk-karte"); karte.hidden = true; wurzel.appendChild(karte);
    karte.addEventListener("click", (e) => e.stopPropagation());

    /* Laden-Vorhang, bis die ersten Bilder da sind */
    /* FASSUNG 844 — steht das Ladebild (stadt-leicht.html #lLade), übernimmt es die Aufgabe des Vorhangs */
    const ladeBild = document.getElementById("lLade");
    if (ladeBild) { const n = ladeBild.querySelector("#lLadeName"); if (n && (L().ich || {}).dorf_name && !(ST.spiel && ST.spiel.beispiel)) n.textContent = stadtName(); }
    deckel = el("div", "lk-vorhang", "<div><b></b><span>wird aufgebaut …</span><i><em></em></i></div>");
    deckel.querySelector("b").textContent = stadtName();
    wurzel.appendChild(deckel);
    /* FASSUNG 806 — XANDER: „damit wir keinen Ladebalken haben". Im kleinen Rahmen kein Vorhang: die Zwergbilder sind
       so klein, dass die Häuser fast sofort stehen. */
    /* FASSUNG 807 — XANDER: „dann könntest du in der Zeit wo man wartet … doch eher ein kleinen Ladebalken machen". Im kleinen
       Rahmen ein schmaler Balken unten über dem Bild (das Bild selbst bleibt sichtbar), bis die sichtbaren Häuser da sind. */
    if (q.get("still") === "1" || ladeBild) deckel.remove();
    else if (q.get("mini") === "1") deckel.classList.add("lk-vorhang-klein");

    /* FASSUNG 799 — XANDER: „so klein möchte ich es haben … in diesem kleinen Frame, wo das alte auch ist … wenn man in
       dieser kleinen Miniaturansicht reinzoomt, dann bleibt es ja trotzdem dieser Ausschnitt … die Zoomstärke, die wir in
       der alten Version schon haben". Im kleinen Dorfrahmen des Spiels (mini=1) zeigt die Stadt nur das Bild: ganz im
       Überblick, eine Lupe (doppelt so nah, wie beim alten Dorf), die kleine Karte zum Durchtippen der Viertel und ein
       Knopf fürs Vollbild. Im Vollbild ist alles wieder da. Das Spiel schaltet um (postMessage „leicht-modus"). */
    if (eingebettet) {
      /* FASSUNG 807 — XANDER: „die Stadt soll auch wie früher in der Klein Ansicht im selben Maßstab sein … jedes Gebäude
         sichtbar … so großzügig mit so viel Platz dazwischen … die Kirche … der Fernsehturm abgeschnitten". Die ganze Stadt
         (alle Häuser, Wahrzeichen, Bahnhof – samt Höhe) passt ins kleine Bild, unter der Kopfzeile, mit etwas Rand. */
      let ganz = null;
      const ganzeStadt = () => {
        if (ganz && ganz.W === K.W && ganz.H === K.H && ganz.dreh === K.dreh && ganz.n === SZ.objekte.length) return ganz;
        /* FASSUNG 846 — lädt der Rahmen versteckt (ohne Größe), gibt es noch keinen Überblick: nicht rechnen (sonst kam ein
           negativer Maßstab heraus und das Bild blieb leer bzw. die Nadel fiel auf eine schwächere Nähe zurück) */
        if (K.W < 40 || K.H < 40) return { s: K.s > 0 ? K.s : Math.max(1, K.min || 1), x: K.x, y: K.y, W: K.W, H: K.H, dreh: K.dreh, n: -1 };
        const alt = { x: K.x, y: K.y, s: K.s }, kopfH = 30 * K.dpr;
        K.x = 0; K.y = 0; K.s = 1;
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        /* FASSUNG 844 — das Bergwerk steht jetzt hinter der Bahn am Fuß der Alpen: sein Felsberg ragt in die Berge, er soll
           den Überblick nicht nach oben aufziehen (sonst würde die ganze Stadt im kleinen Bild kleiner) */
        const DH = ST.dorf, hinterH = (o) => K.dreh === 0 && DH && DH.HORIZONT != null && o.x + o.y < DH.HORIZONT + 8;
        const hY = DH && DH.HORIZONT != null ? ST.proj(DH.HORIZONT / 2, DH.HORIZONT / 2, 0)[1] - 17 : -1e9;
        for (const o of SZ.objekte) {
          if (!(o.art === "haus" || o.art === "wunder" || (o.art === "kulisse" && o.name && o.bild !== "d_bootshaus"))) continue;
          const r = Math.hypot(o.fuss[0], o.fuss[1]) / 2, P = ST.proj(o.x, o.y, 0), T = ST.proj(o.x, o.y, (o.hoehe || 8) * (o.stufe || 1));
          x0 = Math.min(x0, P[0] - r * 0.72); x1 = Math.max(x1, P[0] + r * 0.72); y0 = Math.min(y0, hinterH(o) ? Math.max(T[1] - 2, hY) : T[1] - 2); y1 = Math.max(y1, P[1] + r * 0.38);
        }
        /* FASSUNG 808 — wie im alten Bild: oben die Alpen über der Horizontlinie, unten gerade noch die Zunge des Sees
           (der Bootsverleih liegt weiter unten – „wenn man weiter runtergeht, dass der See sich eröffnet") */
        const DD = ST.dorf;
        if (DD && DD.HORIZONT != null && K.dreh === 0 && x1 > x0) {
          y0 = Math.min(y0, ST.proj(DD.HORIZONT / 2, DD.HORIZONT / 2, 0)[1] - 17);
          if (DD.SEE_VERSATZ) { const z = ST.proj(66 + DD.SEE_VERSATZ[0], 56 + DD.SEE_VERSATZ[1], 0); y1 = Math.max(y1, z[1] + 3); }
        }
        let erg = { s: Math.max(1, K.W / 150), x: 0, y: 4 };
        if (x1 > x0) {
          const sF = Math.min(K.W / (x1 - x0), (K.H - kopfH) / (y1 - y0)) * 0.93, m = ST.aufBoden((x0 + x1) / 2, (y0 + y1) / 2);
          K.s = sF; K.x = m[0]; K.y = m[1];
          const w2 = ST.aufBoden(K.W / 2, K.H / 2 - kopfH / 2);
          erg = { s: sF, x: w2[0], y: w2[1] };
        }
        K.x = alt.x; K.y = alt.y; K.s = alt.s;
        ganz = Object.assign(erg, { W: K.W, H: K.H, dreh: K.dreh, n: SZ.objekte.length });
        return ganz;
      };
      const ueberblick = () => ganzeStadt().s;
      /* Wie beim alten Dorf: die kleine Karte mit den Vierteln erscheint erst, wenn man mit der Lupe näher dran ist. */
      /* FASSUNG 817 — nach einem Kompass-/Doppeltipp-Flug fragt der Takt (700 ms) kurz nicht nach, ob man nah ist (sonst
         stellte er mitten im Flug den alten Stand wieder her) */
      let nahSperre = 0;
      const nahSetzen = (nah, fest) => {
        if (fest) nahSperre = performance.now() + 900; else if (performance.now() < nahSperre) return;
        /* FASSUNG 846 — XANDER (Walkie 315): „ich möchte das wie vorher auch stufenlos Zoomen das fühlt sich jetzt so an als
           wenn das mit der Lupe direkt aufspringt". Beim Kneifen schaltete die Anzeige mitten in der Geste auf „Kompass nah"
           um (die kleine Karte sprang auf, das Zeichen wechselte). Solange Finger auf dem Bild liegen, bleibt alles stehen;
           umgeschaltet wird erst nach dem Loslassen. */
        if (!fest && (O._finger || 0) > 0) return;
        lupeK.classList.toggle("an", nah); document.body.classList.toggle("lk-nah", nah);
        const i = lupeK.querySelector("i"); if (i && i.textContent !== (nah ? "−" : "+")) i.textContent = nah ? "−" : "+";
        lupeK.title = nah ? "Kompass: ganze Stadt" : "Kompass: näher ran"; lupeK.setAttribute("aria-label", lupeK.title);
      };
      /* FASSUNG 806 — XANDER: „die Lupe muss keine Lupe sein die kann wieder vorher Kompass sein … so ein kleiner Kreis …
         das Symbol oben links ruft das jedenfalls auf. Danach muss wieder die Uhrzeit stehen. In der Mitte … mein Spitzname".
         Oben links der Kompass des alten Dorfs (ganze Stadt ↔ näher ran, dann die kleine Karte und Verschieben mit dem
         Finger), daneben die Uhrzeit in Deutschland, in der Mitte das Ortsschild, rechts das Wetter (kommt vom Spiel). */
      SYM.kompass = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#f7f1e1" stroke="#6b4a22" stroke-width="2"/><circle cx="20" cy="20" r="14.5" fill="none" stroke="#c9b58a" stroke-width="1"/>'
        + '<g class="lk-nadel"><path d="M20 5.5l3.4 14.5h-6.8z" fill="#c8312b"/><path d="M20 34.5l-3.4-14.5h6.8z" fill="#3b3f4a"/></g><circle cx="20" cy="20" r="2" fill="#6b4a22"/>'
        + '<text x="20" y="4.6" font-size="5" font-weight="700" text-anchor="middle" fill="#6b4a22" font-family="system-ui,sans-serif">N</text></svg><i>+</i>';
      /* FASSUNG 817 — XANDER (Funk 207): „lasse gern noch diese zweite Zoomstufe zu dass man bisschen tiefer ins Geschehen
         gucken kann auch in der kleinen Miniaturansicht". Stufen im kleinen Rahmen: 0 = ganze Stadt, 1 = Kompass (2,8-fach),
         2 = noch näher (7-fach, erst dann kommen die großen Bilder, beim Herauszoomen werden sie wieder freigegeben). */
      const STUFE = [1, 2.8, 7];
      const stufeVon = (s) => s > ueberblick() * 4.5 ? 2 : s > ueberblick() * 1.4 ? 1 : 0;
      O.stufe = () => stufeVon(K.s);
      const kompass = () => {
        if (O.wahlZu) O.wahlZu(); if (O.dingZu) O.dingZu(); if (O.fokusVergessen) O.fokusVergessen();   // FASSUNG 844   // FASSUNG 822 — auch das kleine Menü am Ding
        const nah = K.s > ueberblick() * 1.4, g = ganzeStadt();
        /* FASSUNG 846 — XANDER (Walkie 315): „wenn einer Ansicht festgepinnt ist nicht nur vom Winkel sondern auch von der
           Zoomstärke in diese wieder zurückfallen … der PIN setzt alles fest die Zoomstärke und den Winkel". Steckt die Nadel
           und man steht woanders, führt der Kompass zurück in genau diese Ansicht (Lage, Nähe, Richtung); erst aus der
           festgesteckten Ansicht heraus geht er zur ganzen Stadt. */
        const pv = pinLesen();
        if (pv && !pinGleich(pv)) { O.zurStartAnsicht(true); return; }
        L().fliegeZu(nah ? g.x : K.x, nah ? g.y : K.y, nah ? g.s : g.s * 2.8, 600);
        nahSetzen(!nah, true);
      };
      const lupeK = knopf("kompass", "Kompass: näher ran", kompass, "lk-nur-mini lk-lupe");
      /* Doppeltipp auf die Wiese (wie im alten Dorf): mit dem Kompass zurück zur ganzen Stadt */
      /* FASSUNG 817 — XANDER (Walkie 305): „durch einen Double Tab in das Bild soll man auch … stärker reinkommen nicht nur
         durch den Kompass". Im Überblick holt der Doppeltipp genau die getippte Stelle heran (so nah wie der Kompass), nah
         dran führt er wie bisher zurück zur ganzen Stadt. */
      O.doppelTipp = (px, py) => {
        if (!document.body.classList.contains("lk-mini-modus")) return;
        if (O.wahlZu) O.wahlZu(); if (O.dingZu) O.dingZu(); if (O.fokusVergessen) O.fokusVergessen();   // FASSUNG 844
        /* Funk 207: Überblick → Kompass-Nähe → zweite Stufe → wieder die ganze Stadt, jeweils an die getippte Stelle */
        const st = stufeVon(K.s);
        if (st === 2 || px == null) { if (st) kompass(); return; }
        const a = ST.aufBoden(px, py), g = ganzeStadt(), s = g.s * STUFE[st + 1], z = O.klemmZiel(a[0], a[1], s);
        L().fliegeZu(z[0], z[1], s, 600);
        nahSetzen(true, true);
      };
      /* FASSUNG 817 — XANDER (Walkie 306): „die Kachel ist nicht kongruent mit dem eigentlichen Bildausschnitt … die Kachel
         oben rechts das ganze oben rechts anzeigen bis zur Grenze … oben links … unten links … unten rechts". Im kleinen
         Rahmen zeigt die kleine Karte jetzt genau das Überblicksbild (gleiche Lage, gleiche Drehung, 16:10) und ist in 3 × 3
         Kacheln geteilt; eine Kachel holt genau ihren Teil ins Bild – die Ecken reichen bis an den Rand des Überblicks. */
      const imUeberblick = (fn) => { const alt = { x: K.x, y: K.y, s: K.s }, g = ganzeStadt(); K.x = g.x; K.y = g.y; K.s = g.s; try { return fn(); } finally { K.x = alt.x; K.y = alt.y; K.s = alt.s; } };
      O.ueberblick = ganzeStadt; O.imUeberblick = imUeberblick;
      /* FASSUNG 826 — XANDER: „das mit dem Raster scheint jetzt übrigens zu gehen. Du hast es jetzt so rechteckig gemacht …
         nach unten hin könnte ein bisschen tiefer gehen … was ist, wenn wir da noch Häuser hin bauen dann ist das nach unten
         hin zu wenig … ich will noch den Kölner Dom rein bauen … Der Bootsverleih will ich mir richtig angucken können".
         Das Raster der kleinen Karte (3 × 3 Kacheln), die Grenze beim Verschieben und die kleine Karte selbst gelten jetzt
         für das FELD: der Überblick, nach unten erweitert um den ganzen See mit Bootsverleih und das Bauland unten links
         (dorf.js D.BAULAND, Platz für den Kölner Dom), in der Form des Bildes. Der Überblick selbst (Stufe 0, alle Häuser
         im selben Maßstab wie bisher) bleibt, wie er war. */
      let feldMerk = null;
      const feld = () => {
        const g = ganzeStadt();
        if (feldMerk && feldMerk.g === g) return feldMerk.f;
        const DD = ST.dorf; let f = g;
        if (DD && DD.BAULAND && DD.SEE_VERSATZ) {
          const b = DD.BAULAND[0], pts = [[b.u0, b.v0], [b.u1, b.v0], [b.u0, b.v1], [b.u1, b.v1]].map(([u, v]) => [(u + v) / 2, (v - u) / 2]);
          pts.push([84 + DD.SEE_VERSATZ[0], 66 + DD.SEE_VERSATZ[1]]);   // unterster Zipfel des Sees
          if (DD.BOOTSHAUS) pts.push([DD.BOOTSHAUS[0] + 3, DD.BOOTSHAUS[1] + 6]);
          const P = imUeberblick(() => pts.map((p) => ST.proj(p[0], p[1], 0)));
          let x0 = 0, x1 = K.W, y0 = 0, y1 = K.H;
          for (const q of P) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
          const a = K.W / K.H; let w = x1 - x0, h = y1 - y0;
          if (w / h < a) w = h * a; else h = w / a;
          const m = imUeberblick(() => ST.aufBoden((x0 + x1) / 2, (y0 + y1) / 2));
          f = { s: g.s * K.W / w, x: m[0], y: m[1] };
        }
        feldMerk = { g: g, f: f };
        return f;
      };
      const imFeld = (fn) => { const alt = { x: K.x, y: K.y, s: K.s }, g = feld(); K.x = g.x; K.y = g.y; K.s = g.s; try { return fn(); } finally { K.x = alt.x; K.y = alt.y; K.s = alt.s; } };
      O.feld = feld; O.imFeld = imFeld;
      O.kachelHin = (i, j) => {
        if (O.wahlZu) O.wahlZu(); if (O.dingZu) O.dingZu(); if (O.fokusVergessen) O.fokusVergessen();   // FASSUNG 844
        const g = feld(), a = imFeld(() => ST.aufBoden((i + 0.5) / 3 * K.W, (j + 0.5) / 3 * K.H));
        L().fliegeZu(a[0], a[1], g.s * 3, 800);
        nahSetzen(true, true);
        ansage(["oben", "Mitte", "unten"][j] + " " + ["links", "Mitte", "rechts"][i]);
      };
      /* FASSUNG 817 — Funk 207: „muss die Map an ihr äußerstes Ende gehen … und ich kann dann trotzdem noch weiter scrollen
         das macht keinen Sinn". Im kleinen Rahmen bleibt der Blick immer innerhalb des Überblicks: an den Rändern ist Schluss. */
      O.klemmZiel = (x, y, s) => {
        if (!document.body.classList.contains("lk-mini-modus")) return [x, y];
        /* FASSUNG 826 — Grenze ist das Feld (Überblick + See + Bauland unten) */
        const g = feld(), f = g.s / Math.max(1e-6, s), h = f / 2;
        const c = imFeld(() => { const P = ST.proj(x, y, 0); return [P[0] / K.W, P[1] / K.H]; });
        const cx = f >= 1 ? 0.5 : Math.max(h, Math.min(1 - h, c[0])), cy = f >= 1 ? 0.5 : Math.max(h, Math.min(1 - h, c[1]));
        if (Math.abs(cx - c[0]) < 1e-5 && Math.abs(cy - c[1]) < 1e-5) return [x, y];
        return imFeld(() => ST.aufBoden(cx * K.W, cy * K.H));
      };
      O.klemmen = () => { if (!document.body.classList.contains("lk-mini-modus")) return; const z = O.klemmZiel(K.x, K.y, K.s); K.x = z[0]; K.y = z[1]; };
      O.miniUeberblickMalen = (c0) => {
        const dpr = window.devicePixelRatio || 1, rb = c0.getBoundingClientRect(), pw = Math.max(8, Math.round((rb.width || 75) * dpr)), ph = Math.max(5, Math.round((rb.height || 47) * dpr));
        c0.width = pw; c0.height = ph;
        const c = c0.getContext("2d"), B = ST.boden, N = B.N, d = B.daten, gr = 144, r = B.RAND * B.AUFL, winter = SZ.jahr === "winter";
        const img = c.createImageData(pw, ph);
        const DD = ST.dorf;
        imFeld(() => {
          for (let j = 0; j < ph; j++) for (let i = 0; i < pw; i++) {
            const w = ST.aufBoden((i + 0.5) / pw * K.W, (j + 0.5) / ph * K.H), ki = Math.floor(r + (w[0] + gr / 2) * B.AUFL), kj = Math.floor(r + (w[1] + gr / 2) * B.AUFL), p = (j * pw + i) * 4;
            let col = winter ? [233, 238, 245] : [157, 187, 114];
            /* FASSUNG 826 — über der Horizontlinie Himmel, unter dem Plateau das Umland im Dunst */
            if (K.dreh === 0 && DD && DD.HORIZONT != null && w[0] + w[1] < DD.HORIZONT) col = [176, 204, 226];
            else if (DD && DD.hoehe && DD.hoehe(w[0], w[1]) < -1) col = winter ? [206, 214, 224] : [150, 168, 160];
            else if (ki < 0 || kj < 0 || ki >= N || kj >= N) col = [120, 132, 150];
            else { const o = (kj * N + ki) * 4; if (d[o + 1] > 90) col = [120, 162, 200]; else if (d[o] > 90) col = [176, 168, 156]; else if (d[o + 3] > 90) col = winter ? [220, 228, 238] : [134, 176, 96]; }
            img.data[p] = col[0]; img.data[p + 1] = col[1]; img.data[p + 2] = col[2]; img.data[p + 3] = 255;
          }
          c.putImageData(img, 0, 0);
          for (const o of SZ.objekte) {
            if (o.versteckt || o.art === "natur" || o.deko) continue;
            c.fillStyle = o.art === "haus" ? (o.bau ? "#e0a030" : "#a4432f") : "#6b5b52";
            c.beginPath(); SZ.ecken(o).forEach((q, n) => { const P = ST.proj(q[0], q[1], 0), x = P[0] / K.W * pw, y = P[1] / K.H * ph; if (n) c.lineTo(x, y); else c.moveTo(x, y); }); c.closePath(); c.fill();
          }
        });
      };
      /* Der helle Rahmen in der kleinen Karte: was gerade im Bild ist (in Teilen des Überblicks) */
      O.blickTeile = () => {
        const ecke = [[0, 0], [K.W, K.H]].map((p) => ST.aufBoden(p[0], p[1]));
        return imFeld(() => ecke.map((w) => { const P = ST.proj(w[0], w[1], 0); return [P[0] / K.W, P[1] / K.H]; }));
      };
      /* FASSUNG 807 — „ein bisschen die Karte auch rotieren": mit dem Kompass ein Knopf zum Drehen */
      /* FASSUNG 812 — XANDER: „erklär mir mal bitte wie dieser Händel unterm Kompass funktioniert … der springt immer
         irgendwo hin aber ich weiß gar nicht wohin er springt … Ich wollte eigentlich den Slider, der die Karte so hin
         dreht und zurückdreht". Statt des Knopfs (45° weiter, danach zurück auf die ganze Stadt) ein Schieber: den Griff
         nach links/rechts ziehen dreht die Karte stufenlos um die Bildmitte mit, loslassen rastet weich auf die nächste
         der acht Richtungen ein (drehen.js) und sagt sie an; ein Tipp auf die Pfeile links/rechts dreht um 45°. */
      const drehK = drehSchieber("lk-nur-mini lk-drehschieber");
      /* FASSUNG 812 — XANDER: „Wie kann ich das festnageln wenn ich ne Ansicht habe, in der ich bleiben möchte, kannst du
         mir deinen PIN reinmachen oder irgend sowas, der sich dann immer abspeichert mit, bis ich das umentschieden so
         lassen will". Nah dran (Kompass) steckt die Nadel die Ansicht fest: Lage, Nähe und Richtung bleiben gespeichert
         (auf diesem Gerät) und der kleine Rahmen öffnet beim nächsten Mal genau dort; noch ein Tipp löst die Nadel. */
      const PIN_SCHLUESSEL = "lk-pin-ansicht";
      const pinLesen = () => { try { const v = JSON.parse(localStorage.getItem(PIN_SCHLUESSEL) || "null"); return v && isFinite(v.x) && isFinite(v.y) && isFinite(v.s) ? v : null; } catch (e) { return null; } };
      /* FASSUNG 844 — XANDER (Walkie 313): „mit der pinnadel einen zoomausschnitt den ich mir selber gestalte oder wie ich es
         mir selber drehe anpinnen dann will ich wieder aus dem Menü rausgehen und diese Ansicht soll sich gemerkt werden dass
         man wenn man auf mein Dorf kommt immer mit dieser Ansicht präsentiert wird dafür soll die pinnadel sein für nichts
         anderes". Die Nadel steht jetzt immer im kleinen Bild (nicht erst nah dran). Ein Tipp steckt die Ansicht fest, die
         man gerade sieht (Lage, Nähe, Richtung); hat man sich danach anders hingestellt, steckt der nächste Tipp die NEUE
         Ansicht fest – gelöst wird die Nadel nur, wenn man genau in der festgehaltenen Ansicht steht. Kommt man zurück ins
         Dorf (der Rahmen war versteckt, O.wiederDa) oder aus dem Vollbild, steht wieder genau diese Ansicht. */
      const pinGleich = (v) => !!v && Math.abs(v.x - K.x) < 0.5 && Math.abs(v.y - K.y) < 0.5 && Math.abs(v.s * K.dpr - K.s) < K.s * 0.03 && Math.abs(ST.drehMod((v.dreh || 0) - K.dreh)) < 0.01;
      const pinK = knopf("pin", "Ansicht festhalten", () => {
        const alt = pinLesen();
        if (alt && pinGleich(alt)) { try { localStorage.removeItem(PIN_SCHLUESSEL); } catch (e) {} pinZeigen(); ansage("Nadel gelöst – das Dorf öffnet wieder ganz"); return; }
        const v = { x: +K.x.toFixed(2), y: +K.y.toFixed(2), s: +(K.s / K.dpr).toFixed(3), dreh: ST.drehMod(Math.round(K.dreh * 2) / 2) };
        try { localStorage.setItem(PIN_SCHLUESSEL, JSON.stringify(v)); } catch (e) {}
        pinZeigen(); ansage(alt ? "Neue Ansicht festgesteckt" : "Ansicht festgesteckt – so öffnet dein Dorf");
      }, "lk-nur-mini lk-pinknopf");
      O.pinLesen = pinLesen;
      const pinZeigen = () => {
        const an = !!pinLesen();
        pinK.classList.toggle("lk-an", an);
        document.body.classList.toggle("lk-gepinnt", an);
        pinK.title = an ? "Ansicht lösen" : "Ansicht festhalten"; pinK.setAttribute("aria-label", pinK.title);
        pinK.setAttribute("aria-pressed", an ? "true" : "false");
      };
      /* FASSUNG 846 — die Zoomgrenzen des kleinen Rahmens (vom Überblick bis zur zweiten Stufe) gelten auch nach einer
         Größenänderung: start.js setzte sie dabei auf die des Vollbilds zurück, und die Nadel wurde auf eine falsche Nähe
         beschnitten. Hat der Rahmen erst jetzt eine Größe (er lud versteckt), kommt die Startansicht (Nadel oder ganze Stadt). */
      let hatteGroesse = K.W >= 40 && K.H >= 40;
      O.miniGrenzen = () => {
        const gross = K.W >= 40 && K.H >= 40, neu = gross && !hatteGroesse; hatteGroesse = gross;
        if (!document.body.classList.contains("lk-mini-modus") || !gross) return;
        /* (der Überblick in Blickrichtung Norden: gedreht wäre er kleiner und die festgesteckte Nähe würde beschnitten) */
        const d = K.dreh; K.dreh = 0; const u = ueberblick(); K.dreh = d;
        K.min = Math.min(1.6 * K.dpr, u * 0.95); K.max = Math.max(K.min, u * (STUFE[2] + 0.5));
        if (neu || !(K.s > 0)) { O.zurStartAnsicht(false); return; }
        K.s = Math.min(K.max, Math.max(K.min, K.s));
      };
      /* die gespeicherte Ansicht anwenden (beim Laden und zurück aus dem Vollbild); false, wenn keine Nadel steckt */
      O.pinAnwenden = () => {
        const v = pinLesen(); if (!v) return false;
        if (ST.drehen && ST.drehen.setzen && isFinite(v.dreh)) ST.drehen.setzen(v.dreh);
        K.x = v.x; K.y = v.y; K.s = Math.min(K.max, Math.max(K.min, v.s * K.dpr)); L().unruhe = 2;
        nahSetzen(K.s > ueberblick() * 1.4 || K.dreh !== 0, true);
        return true;
      };
      /* FASSUNG 844 — die Ansicht, mit der das Dorf sich zeigt: die festgesteckte, sonst die ganze Stadt. sanft = hinfliegen. */
      O.zurStartAnsicht = (sanft) => {
        if (O.wahlZu) O.wahlZu(); if (O.dingZu) O.dingZu();
        const v = pinLesen();
        if (v && !sanft) { O.pinAnwenden(); return; }
        if (v) {
          if (ST.drehen && ST.drehen.setzen && isFinite(v.dreh) && Math.abs(ST.drehMod(v.dreh - K.dreh)) > 0.01) ST.drehen.setzen(v.dreh);
          const s2 = Math.min(K.max, Math.max(K.min, v.s * K.dpr));
          L().fliegeZu(v.x, v.y, s2, 650); nahSetzen(s2 > ueberblick() * 1.4 || K.dreh !== 0, true); return;
        }
        if (K.dreh !== 0 && ST.drehen && ST.drehen.setzen) ST.drehen.setzen(0);
        const g = ganzeStadt();
        if (sanft) L().fliegeZu(g.x, g.y, g.s, 650); else { K.x = g.x; K.y = g.y; K.s = g.s; L().unruhe = 2; }
        nahSetzen(false, true);
      };
      pinZeigen();
      /* FASSUNG 844 — XANDER (Walkie 313): „dass bei bei einem gewählten Haus dass der Zoom direkt auf dieses Haus springt dass
         man es näher sieht und wenn man die Aufgabe erledigt hat … dass es dann wieder auf das Gesamtbild der Stadt springt".
         O.fokus(o): hinfliegen (Kompass-Nähe, das Ding in der Mitte, mit seiner halben Höhe), gemerkt in fokus. Zurück zur
         Startansicht (festgesteckt oder ganze Stadt) geht es, sobald die Aufgabe erledigt ist: das Zeichen am Haus ändert
         sich (eingesammelt, Arbeit läuft), ein Symbol der kleinen Auswahl wurde getippt, das Spiel meldet „leicht-zurueck",
         oder man tippt daneben. */
      let fokus = null, fokusUhr = 0;
      O.fokus = (o) => {
        if (!o || !document.body.classList.contains("lk-mini-modus") || O.gestalten) return;
        clearTimeout(fokusUhr);
        const g = ganzeStadt(), s = Math.max(K.s, g.s * STUFE[1]), h = (o.hoehe || 8) * (o.stufe || 1);
        const alt = { x: K.x, y: K.y, s: K.s };
        K.x = o.x; K.y = o.y; K.s = s;
        const P = ST.proj(o.x, o.y, h * 0.45), mitte = ST.aufBoden(P[0], P[1] - 14 * K.dpr);   // (etwas Luft darüber für die kleine Auswahl)
        K.x = alt.x; K.y = alt.y; K.s = alt.s;
        const z = O.klemmZiel(mitte[0], mitte[1], s);
        L().fliegeZu(z[0], z[1], s, 550);
        nahSetzen(true, true);
        fokus = { g: o.spiel || "", o: o, sig: JSON.stringify((O.zeichenJetzt || {})[o.spiel || ""] || null), t: performance.now() };
      };
      O.fokusDa = () => !!fokus;
      O.fokusZurueck = (warte) => {
        if (!fokus) return;
        clearTimeout(fokusUhr);
        fokusUhr = setTimeout(() => { if (!fokus || geist || O.gestalten) return; fokus = null; O.zurStartAnsicht(true); }, warte == null ? 900 : warte);
      };
      O.fokusVergessen = () => { fokus = null; clearTimeout(fokusUhr); };
      /* das Zeichen am gewählten Haus hat sich geändert → die Aufgabe ist erledigt */
      O.fokusZeichen = (z) => {
        if (!fokus || !fokus.g || performance.now() - fokus.t < 250) return;
        const sig = JSON.stringify((z || {})[fokus.g] || null);
        if (sig === fokus.sig) return;
        const alt = fokus.sig ? JSON.parse(fokus.sig) : null, neu = (z || {})[fokus.g] || null;
        fokus.sig = sig;
        /* nur die laufende Uhr hat weitergezählt: noch nicht erledigt */
        if (alt && neu && alt[0] === neu[0] && alt[2] === neu[2] && alt[0] !== "fertig") return;
        O.fokusZurueck(1100);
      };
      window.addEventListener("message", (ev) => { if (ev.origin === location.origin && ev.source === window.parent && ev.data && ev.data.typ === "leicht-zurueck") O.fokusZurueck(500); });
      /* FASSUNG 844 — zurück ins Dorf (der Rahmen war versteckt, start.js): Menüs zu, die Startansicht */
      O.wiederDa = () => {
        if (geist || O.gestalten) return;
        if (O.wahlZu) O.wahlZu();
        auswahlWeg(); fokus = null; clearTimeout(fokusUhr);
        O.zurStartAnsicht(false);
      };
      setInterval(() => {
        if (!document.body.classList.contains("lk-mini-modus")) { LB.grossErlaubt = false; return; }
        if ((O._finger || 0) > 0) return;   // FASSUNG 846 — während der Geste nichts umschalten (Bilder, Kompass)
        nahSetzen(K.s > ueberblick() * 1.4);
        /* FASSUNG 826 — ändert sich der Überblick (ein großes Wahrzeichen kommt dazu oder fällt weg), passt das stehende
           Bild sich an, statt im alten Maßstab zu bleiben */
        if (!document.body.classList.contains("lk-nah") && !geist && !O.gestalten && K.W > 0 && K.H > 0 && !pinLesen()) {
          const g = ganzeStadt();
          const alt = O._gAlt; O._gAlt = g;
          if (alt && alt !== g && isFinite(g.s) && g.s > 0 && isFinite(g.x) && isFinite(g.y) && Math.abs(alt.s - g.s) > g.s * 0.02 && Math.abs(K.s - alt.s) < alt.s * 0.02) { K.x = g.x; K.y = g.y; K.s = g.s; L().unruhe = 2; miniMalen(); }
        }
        /* Funk 207: große Bilder nur in der zweiten Stufe; zurück im Überblick auch die kleinen wieder freigeben */
        const st = stufeVon(K.s);
        LB.grossErlaubt = st === 2;
        if (st === 2 && LB.vollLaden) LB.vollLaden().then(() => { L().unruhe = 2; });
        if (st < 2 && LB.freigeben) LB.freigeben(/_[gm]$/);   // FASSUNG 828 — auch die schärferen Baustellen (_m)
        /* FASSUNG 836 — (Funk 263, „Kölner Dom … verschwindet") die kleinen Bilder erst nach 20 s ununterbrochen im
           Überblick freigeben, und die der Wahrzeichen nie: Kompass, Lupe oder ein Tipp auf den Dom springen sofort in die
           Zoomstufe, in der er sein _k braucht – war es eben freigegeben, fehlte er dort, bis es neu geladen war. */
        if (st === 0) { O._ueberblickSeit = O._ueberblickSeit || Date.now(); if (Date.now() - O._ueberblickSeit > 20000 && LB.freigeben) LB.freigeben(/^(?!w_).*_k$/); }
        else O._ueberblickSeit = 0;
      }, 700);
      const vollK = knopf("voll", "Vollbild", () => { try { window.parent.postMessage({ typ: "leicht-voll" }, location.origin); } catch (e) {} }, "lk-nur-mini lk-vollknopf");
      /* FASSUNG 809 — XANDER: „Mir fehlen noch die items zum schmücken die finde ich hier in der kleinen Map noch gar nicht".
         Unter dem kleinen Bild (im Spiel) stehen „Schmücken" und „Bauen": das Spiel meldet vorher, welche Leiste nach dem
         Umschalten ins Vollbild aufgehen soll (im Bild selbst kein Knopf, der Häuser verdeckt). */
      let nachVoll = "";
      window.addEventListener("message", (ev) => { if (ev.origin === location.origin && ev.source === window.parent && ev.data && ev.data.typ === "leicht-nachvoll") nachVoll = String(ev.data.was || ""); });
      O.nachVollOeffnen = () => { const w = nachVoll; nachVoll = ""; if (w === "schmuck") leisteZeigen(true); else if (w === "bauen") bauLeisteZeigen(true); };
      /* FASSUNG 817 — XANDER (Funk 207): „wenn man irgendwas aufstellen will oder irgendwas schmücken will soll man dazu
         nicht ins landscape format gezwungen werden denn dazu reicht mein Speicher nicht und dann bricht wieder alles ab ich
         möchte es aus diesem kleinen Fenster heraus aufstellen können". „Schmücken"/„Bauen" unter dem kleinen Bild öffnen
         die Leiste jetzt IM kleinen Rahmen (kompakt, nur die kleinen Bilder); Setzen, Drehen, Versetzen und die Karte der
         Häuser gehen hier. „Fertig" oben rechts beendet das Gestalten. Das Vollbild bleibt nur noch eine Möglichkeit. */
      const fertigK = el("button", "lk-gestalten-fertig", SYM.haken + "<span>Fertig</span>");
      fertigK.type = "button"; fertigK.title = "Schmücken/Bauen beenden";
      fertigK.addEventListener("click", (e) => { e.stopPropagation(); O.gestaltenEnde(); });
      O.gestaltenEnde = () => {
        if (geist) geistFertig(false);
        if (leiste && !leiste.hidden) leisteZeigen(false);
        if (bauLeiste) bauLeisteZeigen(false);
        auswahlWeg(); karte.hidden = true;
        O.gestalten = false; document.body.classList.remove("lk-gestalten");
      };
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-gestalten") return;
        if (!document.body.classList.contains("lk-mini-modus")) { nachVoll = String(ev.data.was || ""); O.nachVollOeffnen(); return; }
        const was = String(ev.data.was || "");
        if (O.wahlZu) O.wahlZu();
        clearTimeout(O._tippUhr); O._tipp = null;
        /* derselbe Knopf noch einmal: die Leiste geht zu (Gestalten bleibt, bis „Fertig") */
        if (O.gestalten && ((was === "bauen" && bauLeiste) || (was !== "bauen" && leiste && !leiste.hidden))) { if (was === "bauen") bauLeisteZeigen(false); else leisteZeigen(false); return; }
        O.gestalten = true; document.body.classList.add("lk-gestalten");
        /* zum Aufstellen näher ran (Kompass-Nähe), wenn man noch die ganze Stadt sieht */
        if (stufeVon(K.s) === 0) { const g = ganzeStadt(); L().fliegeZu(g.x, g.y, g.s * STUFE[1], 500); nahSetzen(true, true); }
        if (was === "bauen") bauLeisteZeigen(true); else leisteZeigen(true);
      });
      wurzel.append(lupeK, vollK, drehK, pinK, fertigK);
      const kopfZ = el("div", "lk-kopfzeile", '<span class="lk-uhr" title="Uhrzeit in Deutschland"></span><span class="lk-ortsschild"><b></b></span><span class="lk-wetter" hidden></span>');
      wurzel.appendChild(kopfZ);
      const uhrStellen = () => {
        /* FASSUNG 825 — dieselbe deutsche Uhr wie Laternen und Rathausuhr (ST.uhr, kern.js; ?uhr= zum Prüfen) */
        const uz = ST.uhr(), t = ("0" + uz.h).slice(-2) + ":" + ("0" + uz.m).slice(-2);
        const u = kopfZ.querySelector(".lk-uhr"); if (u.textContent !== t) u.textContent = t;
        const n = kopfZ.querySelector(".lk-ortsschild b"), name = O.kopfName || stadtName(); if (n.textContent !== name) n.textContent = name;
      };
      uhrStellen(); setInterval(uhrStellen, 10000);
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-kopf") return;
        O.kopfName = String(ev.data.name || "").slice(0, 40); uhrStellen();
        /* FASSUNG 844 — für das Ladebild beim nächsten Öffnen */
        if (O.kopfName) { try { localStorage.setItem("leicht_stadtname", O.kopfName); } catch (e) {} const ln = document.getElementById("lLadeName"); if (ln) ln.textContent = O.kopfName; }
        /* FASSUNG 807 — „Symbole aus" und „Namen aus" wie im alten Dorf: ohne Symbole nur „fertig", ohne Namen keine Schilder */
        document.body.classList.toggle("lk-ohne-symbole", ev.data.symbole === false);
        document.body.classList.toggle("lk-ohne-namen", ev.data.namen === false);
        /* FASSUNG 817 — „Ein Tipp produziert direkt" (Einstellung im Spiel): dann steht auch im Überblick die kleine Uhr */
        document.body.classList.toggle("lk-direkt", ev.data.direkt === true);
        const w = kopfZ.querySelector(".lk-wetter"); w.innerHTML = String(ev.data.wetter || ""); w.hidden = !ev.data.wetter;
        /* FASSUNG 814 — XANDER: „Winter … (Wetter oder Datum)". Das Spiel schickt die Wetterart maschinenlesbar mit
           (wetterArt: klar, wolken, nebel, niesel, regen, schnee, gewitter); meldet es Schnee, liegt Schnee. */
        if ("wetterArt" in ev.data && SZ.wetterSetzen(/^[a-z]{2,12}$/.test(ev.data.wetterArt || "") ? ev.data.wetterArt : null)) { D.jahrFiltern(); O.jahrAnzeigen(); L().unruhe = 2; }
        /* FASSUNG 817 — XANDER: „genau die Buttons und genau die Funktionen sollen unter der neuen Version genauso stehen".
           „Saison: …“ unter dem Bild (Vorschau des Betreibers) stellt die Jahreszeit hier; nur wenn sie sich im Spiel ändert
           (der eigene Jahreszeit-Knopf im Vollbild bleibt sonst, wie er gewählt ist). Das Fest bringt Kürbisse. */
        const jm = String(ev.data.jahrModus || "");
        if (jm && jm !== O._jahrVomSpiel && (jm === "auto" || SZ.MODI[jm])) {
          O._jahrVomSpiel = jm; SZ.modus = jm; SZ.jahrStellen(); D.jahrFiltern(); O.jahrAnzeigen(); L().unruhe = 2;
        }
        const fest = /^[a-z]{0,12}$/.test(ev.data.fest || "") ? String(ev.data.fest || "") : "";
        if (fest !== O.fest) { O.fest = fest; L().unruhe = 2; }
      });
      /* FASSUNG 817 — Halloween (Datum oder „Saison: Halloween“): vor jedem Haus Kürbisse, nachts mit leuchtendem Gesicht –
         wie im alten Bild (gemalt, keine eigenen Bilddateien). */
      SZ.zuhoerer.push(function (g, t, Z) {
        if (O.fest !== "halloween") return;
        const vorn = ST.drehXY(1, 1, (4 - (K.dreh & 3)) & 3), nacht = Z && Z.nacht > 0.4;
        for (const o of SZ.objekte) {
          if (o.art !== "haus" || o.versteckt || o.bau) continue;
          const rr = Math.max(o.fuss ? o.fuss[0] : 4, o.fuss ? o.fuss[1] : 4) * 0.42;
          for (let n = 0; n < 2; n++) {
            const x = o.x + vorn[0] * rr + (n ? 1.3 : -0.4) * vorn[1] * 0.8, y = o.y + vorn[1] * rr - (n ? 1.3 : -0.4) * vorn[0] * 0.8;
            const P = ST.proj(x, y, 0), r = (n ? 0.45 : 0.62) * K.s * 0.9;
            if (P[0] < -r || P[1] < -r || P[0] > K.W + r || P[1] > K.H + r || r < 1.2) continue;
            g.fillStyle = "rgba(40,30,20,.3)"; g.beginPath(); g.ellipse(P[0], P[1], r * 1.2, r * .38, 0, 0, 7); g.fill();
            const kg = g.createRadialGradient(P[0] - r * .3, P[1] - r * 1.1, r * .1, P[0], P[1] - r * .7, r * 1.1);
            kg.addColorStop(0, "#ffb347"); kg.addColorStop(.6, "#e7771c"); kg.addColorStop(1, "#9a4410");
            g.fillStyle = kg; g.beginPath(); g.ellipse(P[0], P[1] - r * .7, r, r * .75, 0, 0, 7); g.fill();
            g.fillStyle = "#4d6b25"; g.fillRect(P[0] - r * .1, P[1] - r * 1.6, r * .2, r * .3);
            if (nacht) {
              g.fillStyle = "rgba(255,214,90,.95)";
              g.beginPath(); g.moveTo(P[0] - r * .45, P[1] - r * .95); g.lineTo(P[0] - r * .2, P[1] - r * .95); g.lineTo(P[0] - r * .32, P[1] - r * 1.2); g.fill();
              g.beginPath(); g.moveTo(P[0] + r * .45, P[1] - r * .95); g.lineTo(P[0] + r * .2, P[1] - r * .95); g.lineTo(P[0] + r * .32, P[1] - r * 1.2); g.fill();
              g.fillRect(P[0] - r * .4, P[1] - r * .6, r * .8, r * .14);
            }
          }
        }
      });
      /* Ein Viertel auf der kleinen Karte: im kleinen Rahmen mit der Lupen-Stärke, nicht mit der großen Nähe. */
      /* FASSUNG 846 — ganz nah (zweite Stufe) für den ersten Blick auf eine Quest-Person */
      O.miniGanzNah = () => { nahSetzen(true, true); return Math.min(K.max, ueberblick() * STUFE[2]); };
      O.miniNah = () => { if (!document.body.classList.contains("lk-mini-modus")) return Math.max(K.s, 11 * K.dpr); nahSetzen(true); return ueberblick() * 2.8; };
      /* Schlank wie das alte Dorf: im kleinen Rahmen nur die kleinen Bilder (bilder.js) und höchstens die Lupen-Nähe. */
      const maxVoll = K.max;
      const modus = (klein) => {
        document.body.classList.toggle("lk-mini-modus", klein);
        document.documentElement.classList.toggle("lk-mini-html", klein);
        LB.nurKlein = klein;
        if (!klein && LB.vollLaden) LB.vollLaden().then(() => { L().unruhe = 2; });
        /* FASSUNG 806 — XANDER: „wenn man in der Vollbildansicht ist dann bricht das Ganze immer ab … dass die kleinen Häuser nur
           so groß gezoomt werden können, wie sie innerhalb des Rahmens vorher waren". Eingebettet bleibt auch das Vollbild
           schlank (Sparmodus: nie die großen Bilder, 12 Leute) – die Nähe reicht bis zum 1,6-Fachen der kleinen Bilder. */
        if (klein) K.min = Math.min(K.min, ueberblick() * 0.95);
        K.max = klein ? Math.max(K.min, ueberblick() * (STUFE[2] + 0.5)) : LB.spar ? Math.min(maxVoll, 18 * 1.6) : maxVoll;
        if (K.s > K.max) K.s = K.max;
        if (klein && O.miniGrenzen) O.miniGrenzen();   // FASSUNG 846
        if (klein) { if (bauLeiste) bauLeisteZeigen(false); if (leiste && !leiste.hidden) leisteZeigen(false); karte.hidden = true; farbFeld.hidden = true; }
        O.gestalten = false; document.body.classList.remove("lk-gestalten");
        /* FASSUNG 817 — die kleine Karte hat im kleinen Rahmen die Lage des Überblicks, im Vollbild die der ganzen Karte */
        if (O.wahlZu) O.wahlZu(); if (O.dingZu) O.dingZu();
        miniMalen();
      };
      /* FASSUNG 809 — Walkie 304: „es stehen immer noch Schriften für die Namen der Häuser über den Häusern obwohl ich gar
         keine … eingeschaltet habe". Namen und Symbole sind aus, bis das Spiel sie einschaltet (wie im alten Dorf). */
      document.body.classList.add("lk-ohne-namen", "lk-ohne-symbole");
      const erstesMal = q.get("mini") === "1";
      modus(erstesMal);
      if (erstesMal && !(O.pinAnwenden && O.pinAnwenden())) { const g = ganzeStadt(); K.x = g.x; K.y = g.y; K.s = g.s; O._gAlt = g; L().unruhe = 2; }
      window.addEventListener("resize", () => { if (document.body.classList.contains("lk-mini-modus") && !document.body.classList.contains("lk-nah")) setTimeout(() => { if (!(O.pinAnwenden && O.pinAnwenden())) { const g = ganzeStadt(); K.x = g.x; K.y = g.y; K.s = g.s; } L().unruhe = 2; miniMalen(); }, 50); });
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-modus") return;
        modus(!ev.data.voll); L().unruhe = 2;
        if (!ev.data.voll && O.pinAnwenden) O.pinAnwenden();   // FASSUNG 812 — zurück im kleinen Rahmen: die festgehaltene Ansicht
        if (ev.data.voll && O.nachVollOeffnen) setTimeout(O.nachVollOeffnen, 60);
      });
      /* FASSUNG 807 — XANDER: „aus unserer ganz normalen kleinen Dorf … heraus kann man über den Bereich des Bildes scrollen
         und man kommt … unter das Bild, um weiter zu scrollen in die Einzeleinstellungen vom Dorf … jetzt … bewegt sich jetzt
         die komplette Webseite nach oben oder nach unten. Das soll so nicht sein." Im normalen (festen) Bild wird das Wischen
         ans Spiel geschickt, das damit das Dorf-Menü rund um das Bild scrollt – mit Schwung wie ein echtes Scrollen. */
      const scrollModus = () => document.body.classList.contains("lk-mini-modus") && !document.body.classList.contains("lk-nah") && !O.gestalten && !geist;
      const hoch = (d) => { try { window.parent.postMessage(Object.assign({ typ: "leicht-scroll" }, d), location.origin); } catch (x) {} };
      /* FASSUNG 809 — Walkie 304: „Das Scrollen ist sehr schwerfällig und hängt immer nach und schiebt sich zurück". Der
         Rahmen wandert beim Scrollen mit dem Menü mit – der Finger wurde relativ zum Rahmen gemessen (clientY), also hob
         sich die Bewegung auf und kam verspätet nach. Jetzt in Koordinaten der Spielseite (Finger + Lage des Rahmens). */
      const seitenY = (t) => { let o = 0; try { const f = window.frameElement; if (f) o = f.getBoundingClientRect().top; } catch (x) {} return t.clientY + o; };
      let wY = null, wT = 0, wV = 0;
      document.addEventListener("touchstart", (e) => { if (!scrollModus() || e.touches.length !== 1) { wY = null; return; } wY = seitenY(e.touches[0]); wT = performance.now(); wV = 0; hoch({ halt: 1 }); }, { passive: true });
      document.addEventListener("touchmove", (e) => {
        if (wY == null || !scrollModus() || e.touches.length !== 1) return;
        const y = seitenY(e.touches[0]), dy = wY - y, t = performance.now();
        wV = 0.7 * wV + 0.3 * dy / Math.max(1, t - wT); wY = y; wT = t;
        if (dy) hoch({ dy: dy });
      }, { passive: true });
      document.addEventListener("touchend", () => { if (wY == null) return; wY = null; if (performance.now() - wT < 90 && Math.abs(wV) > 0.08) hoch({ v: wV }); }, { passive: true });
      document.addEventListener("wheel", (e) => { if (scrollModus()) hoch({ dy: e.deltaY }); }, { passive: true });
      /* FASSUNG 806 — XANDER: „dass man in dieser neuen Map auch die Sachen anklicken kann … dass die Sachen verlinkt
         sind, dass ich schon in der Map jetzt schon einsammeln kann". Das Spiel schickt dieselben Zeichen wie im alten
         Dorfbild („4 Brot", „Bau 1:20", „kaputt", „Brot 2:10"); sie stehen über dem Haus. Ein Tipp darauf geht ans
         Spiel (wie ein Tipp aufs Haus): Fertiges wird sofort eingesammelt, eine Baustelle bekommt Hilfe. */
      /* ganz unten in der Bedienung: Lupe und Vollbild liegen immer darüber */
      const svgB = (inn) => '<svg class="lk-z-bild" viewBox="0 0 16 16" aria-hidden="true">' + inn + "</svg>";
      const WARE_BILD = {
        ei: svgB('<ellipse cx="6" cy="9" rx="3.6" ry="4.6" fill="#fbf3e2" stroke="#9c7a4c" stroke-width=".8"/><ellipse cx="10.6" cy="9.8" rx="3.2" ry="4.1" fill="#f1dcc0" stroke="#9c7a4c" stroke-width=".8"/><ellipse cx="5" cy="7.4" rx="1" ry="1.5" fill="#fff" opacity=".8"/>'),
        milch: svgB('<path d="M5.5 2h5v2l1.5 2.5V14H4V6.5L5.5 4z" fill="#fff" stroke="#5d6f87" stroke-width=".9"/><rect x="4" y="8" width="8" height="3" fill="#8fb7e3"/>'),
        getreide: svgB('<g stroke="#b8862b" stroke-width=".9" fill="#e7bf5a"><path d="M8 15V3" fill="none"/><ellipse cx="6.6" cy="5" rx="1.2" ry="2" transform="rotate(-25 6.6 5)"/><ellipse cx="9.4" cy="5" rx="1.2" ry="2" transform="rotate(25 9.4 5)"/><ellipse cx="6.6" cy="8.2" rx="1.2" ry="2" transform="rotate(-25 6.6 8.2)"/><ellipse cx="9.4" cy="8.2" rx="1.2" ry="2" transform="rotate(25 9.4 8.2)"/><ellipse cx="8" cy="2.6" rx="1.1" ry="1.8"/></g>'),
        mehl: svgB('<path d="M4 5c0-2 8-2 8 0l1 8c0 1.5-10 1.5-10 0z" fill="#f4efe4" stroke="#8a7a5c" stroke-width=".9"/><path d="M6 4l2-2 2 2" fill="none" stroke="#8a7a5c" stroke-width=".9"/><text x="8" y="11" font-size="4" text-anchor="middle" fill="#8a7a5c" font-family="system-ui" font-weight="700">M</text>'),
        brot: svgB('<path d="M2 10c0-4 3-6 6-6s6 2 6 6c0 2-12 2-12 0z" fill="#c78a3e" stroke="#7a4d1c" stroke-width=".9"/><path d="M5.5 6.5l1.2 2M8 5.8v2.4M10.5 6.5l-1.2 2" stroke="#f1d29a" stroke-width=".9"/>'),
        kuchen: svgB('<path d="M2 12V8l12-3v7z" fill="#f2d7a8" stroke="#8a5a2b" stroke-width=".9"/><path d="M2 8l12-3v2L2 10z" fill="#e79ab0"/><circle cx="10" cy="4" r="1.1" fill="#d23"/>'),
        torte: svgB('<rect x="2.5" y="7" width="11" height="6" rx="1" fill="#f6dcb0" stroke="#8a5a2b" stroke-width=".9"/><path d="M2.5 9h11" stroke="#e79ab0" stroke-width="1.6"/><path d="M8 3v3.5" stroke="#6b4a22"/><path d="M8 1.5c1 1 .6 1.8 0 2-.6-.2-1-1 0-2z" fill="#f5a623"/>'),
        fisch: svgB('<path d="M2 8c3-4 8-4 10 0-2 4-7 4-10 0z" fill="#9cc3dc" stroke="#3f6a86" stroke-width=".9"/><path d="M12 8l3-3v6z" fill="#9cc3dc" stroke="#3f6a86" stroke-width=".9"/><circle cx="5" cy="7.4" r=".8" fill="#223"/>'),
        holz: svgB('<rect x="1.5" y="9" width="13" height="4" rx="2" fill="#a0673a" stroke="#5e3a1c" stroke-width=".9"/><rect x="3" y="4.5" width="11" height="4" rx="2" fill="#b77a45" stroke="#5e3a1c" stroke-width=".9"/><circle cx="13" cy="6.5" r="1.4" fill="#e3c08a"/>'),
        erz: svgB('<path d="M3 12l2-6 4-2 4 3 1 5z" fill="#7d7f86" stroke="#3a3c42" stroke-width=".9"/><circle cx="7" cy="8" r="1" fill="#d9b44a"/><circle cx="10" cy="9.5" r=".8" fill="#d9b44a"/>'),
        bau: svgB('<path d="M3 14V6h10v8" fill="none" stroke="#7a4d1c" stroke-width="1.2"/><path d="M3 9h10M3 12h10M6 6v8M10 6v8" stroke="#b07a3c" stroke-width=".8"/><path d="M2 5l6-3 6 3" fill="none" stroke="#7a4d1c" stroke-width="1.2"/>'),
        korb: svgB('<path d="M2 7h12l-1.5 7h-9z" fill="#c9954f" stroke="#6b4a22" stroke-width=".9"/><path d="M4 7c0-4 8-4 8 0" fill="none" stroke="#6b4a22" stroke-width="1.1"/>')
      };
      /* FASSUNG 810 — Funk 207: „beim Wald müssen Holz und Fleisch zu sehen sein" – Keule für die Jäger */
      WARE_BILD.fleisch = svgB('<path d="M9.5 3.2c2.8-.9 5 1.6 4.2 4.3-.7 2.4-3.4 3.6-5.6 3l-3 3a1.3 1.3 0 1 1-1.8-1.8l3-3c-.8-2.3.5-4.8 3.2-5.5z" fill="#c8553d" stroke="#6e2a1c" stroke-width=".9"/><path d="M10 5c1.2-.3 2.2.4 2.3 1.4" fill="none" stroke="#f0b3a3" stroke-width=".9"/><circle cx="3.3" cy="12.9" r="1.3" fill="#f3ead6" stroke="#8a7a5c" stroke-width=".7"/>');
      WARE_BILD.eier = WARE_BILD.ei; WARE_BILD.gold = WARE_BILD.quarz = WARE_BILD.silizium = WARE_BILD.erz;
      /* FASSUNG 809 — Stationen ohne Haus: See (Zunge im Überblick) und Wald (dichteste Baumgruppe vorn), Jäger daneben */
      let waldMitte = null;
      const wald = () => {
        if (waldMitte && waldMitte.n === SZ.objekte.length) return waldMitte;
        const b = SZ.objekte.filter((o) => o.art === "natur" && !o.hinten && /^n_(tanne|laubbaum)/.test(o.bild || ""));
        let best = null, bn = -1;
        for (const o of b) { let n = 0; for (const q of b) if (Math.hypot(o.x - q.x, o.y - q.y) < 12) n++; if (n > bn) { bn = n; best = o; } }
        waldMitte = { n: SZ.objekte.length, x: best ? best.x : 0, y: best ? best.y : 0, h: 12 };
        return waldMitte;
      };
      /* FASSUNG 828 — die Äcker bekommen ihr Zeichen wie im alten Bild („Getreide reif" / „Getreide 2:30") */
      /* FASSUNG 844 — beim großen Acker in seiner Mitte (nur sichtbar, wenn der Acker im Bild ist, siehe zeichenLegen) */
      const feldOrt = (nr) => () => { const f = (D.FELD_ORTE || []).find((q) => q.nr === nr) || { x: 0, y: 0 }; if (f.u0 != null) { const u = (f.u0 + f.u1) / 2, v = f.v1 != null ? (f.v0 + f.v1) / 2 : f.v0 + 4; return { x: (u + v) / 2, y: (v - u) / 2, h: 1.5, u0: f.u0, u1: f.u1, v0: f.v0, v1: f.v1 != null ? f.v1 : f.v0 + 8 }; } return { x: f.x, y: f.y, h: 1.5 }; };
      const ORTE = {
        see: () => { const v = D.SEE_VERSATZ || [0, 0]; return { x: 66 + v[0], y: 56 + v[1] - 3, h: 2 }; },
        wald: wald,
        jagd: () => { const w = wald(); return { x: w.x + 7, y: w.y - 5, h: 10 }; },
        feld91: feldOrt(91), feld92: feldOrt(92)
      };
      const zeichenEbene = el("div", "lk-zeichen-ebene");
      wurzel.insertBefore(zeichenEbene, wurzel.firstChild);
      let zeichen = {};
      /* FASSUNG 828 — XANDER: „die kleinen Symbole zum einsammeln … manchmal schwebt das noch viel zu sehr und es reagiert
         nicht sofort" – „diese items für Holz und Fleisch die kann man kaum einsammeln, weil die immer von links nach
         rechts zu schweben … immer wenn man da draufgeht, kommt man auf das dahinter auf den Wald … das einsammeln muss
         ohne Latenz gehen direkt an und dann kriegt man auch ein Signal, dass das irgendwie so Haptik oder noch mal
         blinken … Man klickt da drauf und klick meistens zweimal drauf". Das Wandern kam vom Atmen (CSS „scale" wirkt vor
         „transform" und vergrößerte damit auch den Abstand vom linken Rand: rechts im Bild – Wald und Jagd – schwang das
         Zeichen um über 10 px hin und her). Jetzt steht es still. Der Tipp wirkt beim Loslassen des Fingers (nicht erst
         beim späten „click"), sofort mit Rückmeldung: kurzes Summen, die Ware fliegt mit „+4" hoch, das Zeichen verschwindet
         gleich. Es schluckt den zweiten Tipp (nichts geht zum Wald oder Haus dahinter durch). Das Spiel bekommt „zeichen: 1"
         und sammelt nur ein (Holz/Fleisch/Fisch der Trupps, Getreide der Äcker), statt die Station zu öffnen. */
      const flugEbene = el("div", "lk-zeichen-ebene lk-flug-ebene");
      wurzel.insertBefore(flugEbene, zeichenEbene.nextSibling);
      const zeichenFlug = (b, z) => {
        const r = b.getBoundingClientRect(), w = flugEbene.getBoundingClientRect();
        const n = /^(\d+)\s/.exec(z[1] || ""), f = el("span", "lk-sammel-flug", (WARE_BILD[z[2]] || WARE_BILD.korb) + "<b></b>");
        f.querySelector("b").textContent = n ? "+" + n[1] : "";
        f.style.left = (r.left + r.width / 2 - w.left).toFixed(1) + "px"; f.style.top = (r.top + r.height / 2 - w.top).toFixed(1) + "px";
        flugEbene.appendChild(f);
        setTimeout(() => f.remove(), 900);
      };
      const zeichenTun = (b, zeit) => {
        const g = b.dataset.g, z = zeichen[g] || [], jetzt = zeit || performance.now();   // Zeit des Fingers (auch wenn der Takt hängt)
        if ((b._sperre || 0) > jetzt) return;   // der zweite Tipp eines Doppeltipps: geschluckt
        clearTimeout(O._tippUhr); O._tipp = null;   // ein wartender Tipp auf das Bild darunter gilt nicht mehr
        /* FASSUNG 812 — genau ein Summen je Einsammeln: das Pling (Fassung 825, T.einsammeln) summt selbst; nur ohne
           Tonanlage summt es hier. Bei laufender Ware kein Summen („nichts bei Laufendem"), nur das Aufblitzen. */
        if (z[0] === "fertig") {
          let gesummt = false;
          try { if (ST.ton && typeof ST.ton.einsammeln === "function") { ST.ton.einsammeln(z[2] || ""); gesummt = true; } } catch (x) {}
          if (!gesummt) O.summen();
          zeichenFlug(b, z);
          b._weg = performance.now() + 2600; b._sperre = jetzt + 700; b.classList.add("lk-z-weg");
          /* nach 0,7 s schluckt das verborgene Zeichen keine Tipps mehr (dann gilt wieder das Haus darunter) */
          setTimeout(() => { if (b.isConnected && b.classList.contains("lk-z-weg")) b.classList.add("lk-z-durch"); }, 720);
          setTimeout(() => { if (b.isConnected && (b._weg || 0) <= performance.now() + 20) b.classList.remove("lk-z-weg", "lk-z-durch"); }, 2650);
        } else {
          b._sperre = jetzt + 450;
          b.classList.remove("lk-z-blitz"); void b.offsetWidth; b.classList.add("lk-z-blitz");
        }
        if (g === "see" || g === "feld91" || g === "feld92") O.stationTun(g, true);
        else nachOben({ typ: "leicht-haus", g: g, zeichen: 1 });
      };
      const zeichenKnopf = (g) => {
        const b = el("button"); b.type = "button"; b.dataset.g = g;
        b.addEventListener("pointerdown", (e) => { e.stopPropagation(); b._pd = { x: e.clientX, y: e.clientY }; });
        b.addEventListener("pointerup", (e) => {
          e.stopPropagation();
          const p = b._pd; b._pd = null;
          if (!p || Math.hypot(e.clientX - p.x, e.clientY - p.y) > 14) return;
          b._perFinger = e.timeStamp; zeichenTun(b, e.timeStamp);
        });
        b.addEventListener("pointercancel", () => { b._pd = null; });
        /* „click" nur noch für die Tastatur (Enter/Leertaste) – nach einem Finger ist schon alles getan */
        b.addEventListener("click", (e) => { e.stopPropagation(); e.preventDefault(); if (e.timeStamp - (b._perFinger || -1e9) < 800) return; zeichenTun(b, e.timeStamp); });
        b.addEventListener("contextmenu", (e) => e.preventDefault());
        return b;
      };
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-stand" || !ev.data.ich) return;
        L().ich = Object.assign({}, L().ich || {}, ev.data.ich);
        L().aufbauen();
      });
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-zeichen") return;
        zeichen = ev.data.z || {};
        O.zeichenJetzt = zeichen;   // FASSUNG 825 — für das Einsammel-„Pling" beim Tipp aufs Haus im kleinen Rahmen
        if (O.fokusZeichen) O.fokusZeichen(zeichen);   // FASSUNG 844 — Aufgabe erledigt? dann zurück zur ganzen Stadt
        /* FASSUNG 828 — die Fischer arbeiten („läuft" am See, nicht „Ruhe"): Angler am Ufer */
        O.anglerSetzen(!!(zeichen.see && zeichen.see[0] === "laeuft" && !/^Ruhe/.test(zeichen.see[1] || "")));
        const da = {};
        for (const b of Array.from(zeichenEbene.children)) { if (zeichen[b.dataset.g]) da[b.dataset.g] = b; else b.remove(); }
        for (const g in zeichen) {
          let b = da[g];
          if (!b) { b = zeichenKnopf(g); zeichenEbene.appendChild(b); }
          /* FASSUNG 828 — gerade eingesammelt: bleibt verborgen, bis das Spiel den neuen Stand schickt (höchstens 2,6 s) */
          const kl = "lk-zeichen lk-z-" + zeichen[g][0] + (ORTE[g] && !/^feld/.test(g) ? " lk-z-ort" : "") + (zeichen[g][0] === "fertig" && (b._weg || 0) > performance.now() ? " lk-z-weg" + ((b._sperre || 0) <= performance.now() ? " lk-z-durch" : "") : "");
          if (b.className !== kl) b.className = kl;
          /* FASSUNG 807 — XANDER: „kannst du da ein Ei selber reinmachen … oder Getreide, dass du dann Getreidehalme
             darstellst … wenn die Schilder, dass sie dann passend sind wie sie früher waren". Das Schild wie im alten Dorf
             (gelb = fertig), vorn ein kleines Bild der Ware. */
          const inhalt = (WARE_BILD[zeichen[g][2]] || (zeichen[g][0] === "fertig" ? WARE_BILD.korb : "")) + "<span></span>";
          if (b.dataset.i !== inhalt) { b.dataset.i = inhalt; b.innerHTML = inhalt; b._gr = null; }
          /* FASSUNG 809 — XANDER: „vielleicht einfach nur ne Kanne mit mal eins dran ohne großes Hintergrund". Fertig mit
             Bild der Ware: nur das Bild und „×4"; der ganze Text bleibt als Titel/Vorlesetext. */
          const voll = zeichen[g][1], n = /^(\d+)\s/.exec(voll || "");
          const text = zeichen[g][0] === "fertig" && n ? "×" + n[1] : voll;
          const sp = b.querySelector("span"); if (sp.textContent !== text) { sp.textContent = text; b._gr = null; }
          if (b.title !== voll) { b.title = voll; b.setAttribute("aria-label", voll); }
        }
        O.zeichenLegen();
      });
      /* FASSUNG 817 — XANDER (Walkie 305): „es sei denn … Brot, Kuchen oder Torte … kleine Einzelauswahl … wo man auf das
         Symbol klickt". Hat ein Haus mehrere Aufgaben, schickt das Spiel die Auswahl: über dem Haus eine kleine Leiste mit
         dem Bild jeder Ware (und wie viele gehen); ein Tipp darauf startet genau das. Rechts „Karte" öffnet die Station
         darunter. Ein Tipp daneben schließt die Leiste. */
      let wahlEl = null, wahlG = "";
      O.wahlZu = () => { if (!wahlEl) return false; wahlEl.remove(); wahlEl = null; wahlG = ""; return true; };
      const nachOben = (d) => { try { window.parent.postMessage(d, location.origin); } catch (e) {} };
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-wahl") return;
        O.wahlZu();
        /* FASSUNG 833 — auch im Vollbild („in der großen Ansicht … Aufgaben lösen") */
        if (typeof ev.data.g !== "string" || !Array.isArray(ev.data.wahl)) return;
        const g = ev.data.g, haus = SZ.objekte.find((o) => o.art === "haus" && o.spiel === g);
        /* FASSUNG 844 — die Symbole kommen als Antwort auf den Tipp aufs Haus (fokus: 1, spiel.js lsKleineWahl): jetzt zum Haus
           fliegen. (Die Auswahl, die ein älteres Spiel bei „Ein Tipp produziert" schickt, lässt die Stadt stehen.) */
        const fw = O._fokusWunsch; O._fokusWunsch = null;
        if (ev.data.fokus && fw && fw.g === g && haus && performance.now() - fw.t < 6000 && O.fokus && document.body.classList.contains("lk-mini-modus")) { SZ.auswahl = haus; O.fokus(haus); }
        /* FASSUNG 822 — die Auswahl des Spiels (Brot, Kuchen …) sitzt am Haus: das kleine Menü der Stadt weicht ihr */
        if (!O.gestalten && !geist && karte && !karte.hidden && karte.classList.contains("lk-am-ding")) auswahlWeg();
        wahlG = g; wahlEl = el("div", "lk-wahl");
        wahlEl.setAttribute("role", "group"); wahlEl.setAttribute("aria-label", (haus ? haus.name : "Haus") + ": was herstellen?");
        for (const w of ev.data.wahl.slice(0, 5)) {
          const n = Math.max(0, Math.floor(+w.n || 0)), name = String(w.name || w.w || "").slice(0, 24);
          /* FASSUNG 844 — das Spiel kann ein eigenes Bild (w.bild) und einen Text (w.text, z. B. „Bergleute") schicken */
          const b = el("button", "lk-wahl-knopf", (WARE_BILD[w.bild] || WARE_BILD[w.w] || WARE_BILD.korb) + "<span>" + (w.text ? String(w.text).slice(0, 14).replace(/[<>&]/g, "") : "×" + n) + "</span>");
          b.type = "button"; b.dataset.w = String(w.w || ""); b.disabled = !n;
          b.title = n ? name + " herstellen (" + n + ")" : name + " – es fehlen Zutaten"; b.setAttribute("aria-label", b.title);
          b.addEventListener("click", (e) => { e.stopPropagation(); O.wahlZu(); nachOben({ typ: "leicht-machen", g: g, w: b.dataset.w }); if (O.fokusZurueck) O.fokusZurueck(1000); });
          wahlEl.appendChild(b);
        }
        /* FASSUNG 844 — nichts zu tun (läuft schon, fehlt etwas): der kurze Grund vom Spiel steht in der Auswahl */
        if (ev.data.info) { const i = el("span", "lk-wahl-info"); i.textContent = String(ev.data.info).slice(0, 60); wahlEl.appendChild(i); }
        const k = el("button", "lk-wahl-knopf lk-wahl-karte", '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 7h11M9 12h11M9 17h11"/></g><g fill="currentColor"><circle cx="4.5" cy="7" r="1.5"/><circle cx="4.5" cy="12" r="1.5"/><circle cx="4.5" cy="17" r="1.5"/></g></svg>');
        k.type = "button"; k.title = "Karte öffnen"; k.setAttribute("aria-label", "Karte des Hauses öffnen");
        k.addEventListener("click", (e) => { e.stopPropagation(); O.wahlZu(); nachOben({ typ: "leicht-haus", g: g, karte: 1 }); });
        wahlEl.appendChild(k);
        wahlEl.addEventListener("click", (e) => e.stopPropagation());
        wurzel.appendChild(wahlEl);
        O.zeichenLegen();
      });
      const wahlLegen = (haeuser) => {
        if (!wahlEl) return;
        const o = haeuser[wahlG];
        if (!o) { O.wahlZu(); return; }
        const W = K.W / K.dpr, H = K.H / K.dpr, bw = wahlEl.offsetWidth, bh = wahlEl.offsetHeight, nah = document.body.classList.contains("lk-nah");
        const P = ST.proj(o.x, o.y, (o.hoehe || 10) * (o.stufe || 1) * 0.8), F = ST.proj(o.x, o.y, 0), x = P[0] / K.dpr, y = P[1] / K.dpr;
        /* frei von Kompass, Uhr, Ortsschild (oben), Vollbild (unten links), Drehknopf und kleiner Karte (nah) – und von
           den Schildern der anderen Häuser: erst über dem Haus, sonst darunter, sonst daneben */
        const weg = [];
        for (const s of [".lk-lupe", ".lk-uhr", ".lk-ortsschild", ".lk-wetter", ".lk-vollknopf", ".lk-drehschieber", ".lk-mini-rahmen", ".lk-pinknopf"]) { const e = wurzel.querySelector(s); if (e && getComputedStyle(e).display !== "none" && !e.hidden) weg.push(e.getBoundingClientRect()); }
        for (const z of zeichenEbene.children) if (z.dataset.g !== wahlG && z.style.display !== "none" && getComputedStyle(z).display !== "none") weg.push(z.getBoundingClientRect());
        const setzen = (lx, ly) => [Math.max(nah ? 36 : 4, Math.min(W - bw - 4, lx)), Math.max(34, Math.min(H - bh - (nah ? 56 : 42), ly))];
        const frei = (q) => !weg.some((r) => r.width > 0 && Math.min(r.right, q[0] + bw) - Math.max(r.left, q[0]) > 0.5 && Math.min(r.bottom, q[1] + bh) - Math.max(r.top, q[1]) > 0.5);
        const wahl = [setzen(x - bw / 2, y - bh - 2), setzen(x - bw / 2, F[1] / K.dpr + 4), setzen(x + 14, (y + F[1] / K.dpr) / 2 - bh / 2), setzen(x - bw - 14, (y + F[1] / K.dpr) / 2 - bh / 2)];
        /* die einmal gefundene Lage bleibt, solange sie frei ist (kein Springen, wenn ein Schild atmet) */
        if (!(wahlEl._i >= 0 && frei(wahl[wahlEl._i]))) { const i = wahl.findIndex(frei); wahlEl._i = i >= 0 ? i : 0; }
        const q = wahl[wahlEl._i];
        wahlEl.style.transform = "translate(" + q[0].toFixed(1) + "px," + q[1].toFixed(1) + "px)";
      };
      /* FASSUNG 806 — XANDER: „schau auch, dass du die Labels nach Möglichkeit wieder einbaust. Die Leute das auch aus dieser
         Ansicht sehen können, damit sie genau wissen, was was ist". Unter jedem Haus sein Name (wie „Namen" im alten Dorf). */
      const namenEbene = el("div", "lk-zeichen-ebene lk-namen-ebene");
      wurzel.insertBefore(namenEbene, zeichenEbene);
      const namenLegen = (haeuser) => {
        const da = {};
        for (const n of Array.from(namenEbene.children)) { if (haeuser[n.dataset.g]) da[n.dataset.g] = n; else n.remove(); }
        for (const g in haeuser) {
          const o = haeuser[g]; let n = da[g];
          if (!n) { n = el("span", "lk-name-schild"); n.dataset.g = g; namenEbene.appendChild(n); }
          const t = o.name + (o.stufenZahl > 1 ? " " + o.stufenZahl : ""); if (n.textContent !== t) n.textContent = t;
          const P = ST.proj(o.x, o.y, 0), x = P[0] / K.dpr, y = P[1] / K.dpr;
          const drin = x > -40 && y > -20 && x < K.W / K.dpr + 40 && y < K.H / K.dpr + 20;
          n.style.display = drin ? "" : "none";
          if (drin) n.style.transform = "translate(" + x.toFixed(1) + "px," + (y + 2).toFixed(1) + "px) translate(-50%,0)";
        }
      };
      O.zeichenLegen = () => {
        const haeuser = {};
        for (const o of SZ.objekte) if (o.art === "haus" && o.spiel) haeuser[o.spiel] = o;
        if (document.body.classList.contains("lk-mini-modus")) namenLegen(haeuser); else if (namenEbene.firstChild) namenEbene.textContent = "";
        wahlLegen(haeuser);
        /* FASSUNG 817 — der Rahmen in der kleinen Karte (nur nah dran sichtbar) */
        if (document.body.classList.contains("lk-nah") && O.blickTeile) {
          const t = O.blickTeile(), s = blick.style, f = (v) => (Math.max(-5, Math.min(105, v * 100))).toFixed(2) + "%";
          const l = f(t[0][0]), o2 = f(t[0][1]), w = (Math.min(1.05, t[1][0]) - Math.max(-0.05, t[0][0])) * 100, h = (Math.min(1.05, t[1][1]) - Math.max(-0.05, t[0][1])) * 100;
          if (s.left !== l) s.left = l; if (s.top !== o2) s.top = o2; s.width = Math.max(2, w).toFixed(2) + "%"; s.height = Math.max(2, h).toFixed(2) + "%";
        }
        if (!zeichenEbene.firstChild) return;
        const liste = [], sig = document.body.className, W = K.W / K.dpr;
        let hausKaesten = null;
        /* sichtbare Häuser als Kästen (Bildschirm-px, ein Zehntel am Rand abgezogen: dort ist das Bild meist leer) */
        const hausKastenListe = () => SZ.sichtbare.filter((e) => e.o.art === "haus").map((e) => {
          const m = e.meta, l = e.X - m.ax * e.k, o2 = e.Y - m.ay * e.k, w = m.w * e.k, h = m.h * e.k;
          return [(l + w * 0.1) / K.dpr, (o2 + h * 0.1) / K.dpr, (l + w * 0.9) / K.dpr, (o2 + h * 0.9) / K.dpr];
        });
        for (const b of zeichenEbene.children) {
          const ort = ORTE[b.dataset.g] && ORTE[b.dataset.g]();
          const o = haeuser[b.dataset.g] || (ort && Object.assign({ stufe: 1 }, ort, { hoehe: ort.h / 0.8 }));
          if (!o) { b.style.display = "none"; continue; }
          const P = ST.proj(o.x, o.y, (o.hoehe || 10) * (o.stufe || 1) * 0.8), x = P[0] / K.dpr, y = P[1] / K.dpr;
          /* FASSUNG 844 — ein Acker knapp neben dem Bild: sein Zeichen wurde an den Rand zurückgeschoben und lag dort über
             einem fremden Haus (Schule, Sonde 817). Feld-Zeichen stehen nur, wenn der Acker selbst im Bild ist. */
          const feldZ = /^feld/.test(b.dataset.g);
          const drin = feldZ ? x > 8 && x < W - 8 && y > 0 && y < K.H / K.dpr : x > -40 && y > -20 && x < W + 40 && y < K.H / K.dpr + 20;
          if (b.style.display !== (drin ? "" : "none")) b.style.display = drin ? "" : "none";
          if (!drin) continue;
          /* FASSUNG 828 — Größe nur messen, wenn sich Inhalt oder Schalter geändert haben */
          if (!b._gr || b._grSig !== sig) { b._gr = [b.offsetWidth, b.offsetHeight]; b._grSig = sig; }
          /* FASSUNG 829 — XANDER (Funk 255): der Acker liegt jetzt „zwischen der Bäckerei und der Mühle … hinter der
             Bäckerei". In seiner Mitte lag das Zeichen über Mühle und Bäckerei (die waren nicht mehr antippbar). Das
             Zeichen eines Ackers sucht sich darum einen freien Platz am Acker: Mitte, vorne darunter, links, rechts. */
          let fx = x, fy = y;
          if (feldZ && ort && ort.u0 != null) {
            if (!hausKaesten) hausKaesten = hausKastenListe();
            const w = b._gr[0], h = b._gr[1], um = (ort.u0 + ort.u1) / 2, vm = (ort.v0 + ort.v1) / 2;
            const S = (u, v) => { const p = ST.proj((u + v) / 2, (v - u) / 2, 0); return [p[0] / K.dpr, p[1] / K.dpr]; };
            const vo = S(um, ort.v1), hi = S(um, ort.v0), li = S(ort.u0, vm), re = S(ort.u1, vm), vl = S(ort.u0, ort.v1), vr = S(ort.u1, ort.v1);
            const wahl = [[x, y], [vo[0], vo[1] + h + 1], [li[0] - w / 2 - 1, li[1] + h / 2], [re[0] + w / 2 + 1, re[1] + h / 2],
              [vl[0], vl[1] + h + 1], [vr[0], vr[1] + h + 1], [hi[0], hi[1] - 1]];
            let best = null, bf = Infinity;
            /* 10 px Abstand zu jedem Haus: das Handy rückt einen Fingertipp neben einem Knopf auf den Knopf (so traf ein Tipp
               auf den Fuß der Bäckerei das Acker-Zeichen darunter) */
            const R = 10;
            for (const c of wahl) {
              const cy = Math.max(c[1], 62), l = c[0] - w / 2, r = c[0] + w / 2, o2 = cy - h;
              if (l < 2 || r > W - 2 || cy > K.H / K.dpr - 2) continue;
              let fl = 0;
              for (const k of hausKaesten) fl += Math.max(0, Math.min(r, k[2] + R) - Math.max(l, k[0] - R)) * Math.max(0, Math.min(cy, k[3] + R) - Math.max(o2, k[1] - R));
              if (fl < bf - 0.5) { bf = fl; best = c; }
              if (!fl) break;
            }
            if (best) { fx = best[0]; fy = best[1]; }
          }
          /* nicht unter die Kopfzeile (Kompass, Uhr, Ortsschild) rutschen */
          liste.push({ b: b, x: fx, y: Math.max(fy, 62), w: b._gr[0], h: b._gr[1] });
        }
        /* FASSUNG 828 — Zeichen, die sich überdecken (Holz und Fleisch am Wald liegen dicht beisammen), rücken
           nebeneinander: jede Tippfläche ganz frei, keins liegt halb unter dem anderen. Fester Platz, kein Schweben. */
        const sicht = liste.filter((q) => q.w > 0).sort((a, c) => a.x - c.x);
        const deckt = (a, c) => (a.w + c.w) / 2 - Math.abs(c.x - a.x) > 0 && Math.min(a.y, c.y) - Math.max(a.y - a.h, c.y - c.h) > 0;
        /* auch nicht unter den Knöpfen im Bild (Kompass oben links, Vollbild unten links): rechts daneben */
        for (const k of [lupeK, vollK, pinK]) {
          if (!k || !k.isConnected || getComputedStyle(k).display === "none") continue;
          const r = k.getBoundingClientRect(), kk = { x: (r.left + r.right) / 2, y: r.bottom, w: r.width + 4, h: r.height + 4 };
          for (const q of sicht) if (deckt(kk, q)) q.x = r.right + 3 + q.w / 2;
        }
        for (let i = 1; i < sicht.length; i++) for (let j = 0; j < i; j++) if (deckt(sicht[j], sicht[i])) sicht[i].x = sicht[j].x + (sicht[j].w + sicht[i].w) / 2 + 1;
        /* rechter Rand: zurück ins Bild, die Nachbarn weichen nach links (alle, die in derselben Höhe liegen) */
        for (let i = sicht.length - 1; i >= 0; i--) {
          const c = sicht[i];
          if (c.x + c.w / 2 > W - 2) c.x = W - 2 - c.w / 2;
          for (let j = i + 1; j < sicht.length; j++) if (deckt(c, sicht[j])) c.x = Math.min(c.x, sicht[j].x - (c.w + sicht[j].w) / 2 - 1);
        }
        /* die kleine Auswahl über einem Haus (Brot/Kuchen/Torte) liegt oben: was sie verdeckt, ruht so lange */
        const wr = wahlEl && wahlEl.getBoundingClientRect();
        for (const q of liste) {
          if (wr && q.b.dataset.g !== wahlG && Math.min(wr.right, q.x + q.w / 2) - Math.max(wr.left, q.x - q.w / 2) > 0 && Math.min(wr.bottom, q.y) - Math.max(wr.top, q.y - q.h) > 0) { q.b.style.display = "none"; continue; }
          const t = "translate(" + q.x.toFixed(1) + "px," + q.y.toFixed(1) + "px) translate(-50%,-100%)";
          if (q.b._t !== t) { q.b._t = t; q.b.style.transform = t; }
        }
      };
    }
    miniMalen();
  };
  function stadtName() {
    const ich = L().ich || {};
    /* FASSUNG 844 — der Name der eigenen Stadt wird fürs Ladebild gemerkt (nicht der der Beispielstadt) */
    if (ich.dorf_name && ST.spiel && !ST.spiel.beispiel) { try { if (localStorage.getItem("leicht_stadtname") !== ich.dorf_name) localStorage.setItem("leicht_stadtname", ich.dorf_name); } catch (e) {} }
    return ich.dorf_name || "Meine Stadt";
  }
  function nameSetzen() {
    const SP = ST.spiel, n = kopf.querySelector(".lk-name");
    n.innerHTML = "<b></b><span></span>";
    n.querySelector("b").textContent = stadtName();
    n.querySelector("span").textContent = SP.beispiel ? (SP.fehler === "nicht angemeldet" ? "Beispielstadt · bitte anmelden" : "Beispielstadt · Vorschau") : "Neue Stadt · Vorschau";
  }
  /* FASSUNG 822 — antwortet der Server schneller, als die Bedienung steht, gab es einen Fehler (kopf fehlte); O.start
     setzt Name und Schalter ohnehin selbst */
  O.betreiberDa = function () { if (!kopf) return; nameSetzen(); if (zeitK && jahrK) zeitK.hidden = jahrK.hidden = !(ST.spiel && ST.spiel.betreiber); };
  /* FASSUNG 814 — Knopf der Jahreszeit zeigt die gewählte Stufe (oder „automatisch") */
  O.jahrAnzeigen = function () {
    if (!jahrK) return;
    if (miniC) miniMalen();   // die kleine Karte färbt sich mit (Schnee oder Wiese)
    jahrK.innerHTML = SYM[MODUS_SYM[SZ.modus] || JAHR_SYM[SZ.jahr] || "blatt"];
    jahrK.setAttribute("aria-label", "Jahreszeit (Vorschau): " + modusName());
  };
  O.neuAufgebaut = function () { if (kopf) nameSetzen(); miniMalen(); if (karte) dingNeuVerknuepfen(); };

  /* FASSUNG 812 — Dreh-Schieber (siehe oben). XANDER (29.09.): „Vielleicht kannst du den Slider so machen, dass er an der
     Seite von oben nach unten geht. Das kann man besser bedienen, als wenn wir mit dem Finger das Bild verdecken. Ich
     glaube unter dem Kompass wär das besser". Senkrecht am linken Rand unter dem Kompass: den Griff nach oben/unten
     ziehen dreht stufenlos (60 px Weg = 90°), loslassen rastet ein; ein kurzer Tipp in die obere/untere Hälfte der Bahn
     dreht um 45°. */
  function drehSchieber(cls) {
    const w = el("div", "lk-schieber " + cls), bahn = el("div", "lk-schieber-bahn"), griff = el("div", "lk-schieber-griff");
    const pfeil = (r) => el("span", "lk-schieber-marke", r > 0 ? SYM.links : SYM.rechts);
    bahn.append(pfeil(1), griff, pfeil(-1)); w.append(bahn);
    w.title = "Karte drehen: Griff nach oben oder unten ziehen"; w.setAttribute("role", "slider"); w.setAttribute("aria-label", "Karte drehen");
    w.setAttribute("aria-orientation", "vertical");
    let zug = null;
    const PX = 60;
    bahn.addEventListener("pointerdown", (e) => {
      e.stopPropagation(); e.preventDefault();
      try { bahn.setPointerCapture(e.pointerId); } catch (x) {}
      /* FASSUNG 812 — „Entweder nehme ich den Slider der gilt dann für das Haus. Ansonsten gilt der Slider global":
         ist ein Haus gewählt oder angehoben, dreht der Schieber das Haus in Schritten, sonst die Karte */
      zug = { id: e.pointerId, y0: e.clientY, d0: K.dreh, weit: 0, ding: !!(O.schieberZiel && O.schieberZiel()), schritte: 0 };
      w.classList.add("lk-schieber-aktiv");
    });
    bahn.addEventListener("pointermove", (e) => {
      if (!zug || e.pointerId !== zug.id) return;
      const dy = e.clientY - zug.y0;
      zug.weit = Math.max(zug.weit, Math.abs(dy));
      if (zug.weit < 4) return;
      /* Griff folgt dem Finger (höchstens bis an die Enden der Bahn), die Karte dreht mit: nach unten ziehen = rechts herum */
      const halb = Math.max(1, (bahn.clientHeight - griff.offsetHeight) / 2 - 2);
      griff.style.transform = "translateY(" + Math.max(-halb, Math.min(halb, dy)).toFixed(1) + "px)";
      if (zug.ding) {
        const n = Math.round(dy / 36);
        while (zug.schritte !== n) { const r = n > zug.schritte ? -1 : 1; if (!O.schieberDrehen(r)) break; zug.schritte -= r; }
        return;
      }
      if (ST.drehen && ST.drehen.setzen) ST.drehen.setzen(zug.d0 - dy / PX);
    });
    const los = (e) => {
      if (!zug || e.pointerId !== zug.id) return;
      const z = zug; zug = null; w.classList.remove("lk-schieber-aktiv");
      griff.style.transform = "";
      if (z.weit < 4 && e.type === "pointerup") {
        /* kurzer Tipp: obere Hälfte links herum, untere rechts herum (je 45°) */
        const r = bahn.getBoundingClientRect();
        const rr = e.clientY < r.top + r.height / 2 ? 1 : -1;
        if (z.ding && O.schieberDrehen(rr)) return;
        drehen(rr);
        return;
      }
      if (z.ding) return;
      if (ST.drehen) ST.drehen.zu(Math.round(K.dreh * 2) / 2, {});
    };
    bahn.addEventListener("pointerup", los);
    bahn.addEventListener("pointercancel", los);
    return w;
  }
  O.drehSchieber = drehSchieber;

  function drehen(r, danach) {
    /* FASSUNG 820 — XANDER (Walkie 309): „Zwei-Finger-Drehen mit Einrasten in 8 Winkeln". Die Knöpfe drehen jetzt um
       45°, weich (drehen.js, um die Bildmitte); die Ansage nennt acht Richtungen. */
    ST.drehen.um(r, { danach: danach });
  }

  /* Mini-Karte: Wege, Wasser, Häuser, Bildausschnitt */
  function miniMalen() {
    if (!miniC) return;
    if (O.miniUeberblickMalen && document.body.classList.contains("lk-mini-modus")) { O.miniUeberblickMalen(miniC); return; }
    const g = 144, px = Math.round(120 * (window.devicePixelRatio || 1));
    miniC.width = miniC.height = px;
    const c = miniC.getContext("2d"), f = px / g;
    c.fillStyle = SZ.jahr === "winter" ? "#e9eef5" : "#9dbb72"; c.fillRect(0, 0, px, px);
    const B = ST.boden, N = B.N, r = B.RAND * B.AUFL, d = B.daten;
    const img = c.createImageData(px, px);
    for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
      const ki = Math.floor(r + i / px * g * B.AUFL), kj = Math.floor(r + j / px * g * B.AUFL), o = (kj * N + ki) * 4, p = (j * px + i) * 4;
      let col = SZ.jahr === "winter" ? [233, 238, 245] : [157, 187, 114];
      if (d[o + 1] > 90) col = [120, 162, 200]; else if (d[o] > 90) col = [176, 168, 156]; else if (d[o + 3] > 90) col = SZ.jahr === "winter" ? [220, 228, 238] : [134, 176, 96];
      img.data[p] = col[0]; img.data[p + 1] = col[1]; img.data[p + 2] = col[2]; img.data[p + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    for (const o of SZ.objekte) {
      if (o.versteckt || o.art === "natur" || o.deko) continue;
      c.fillStyle = o.art === "haus" ? (o.bau ? "#e0a030" : "#a4432f") : "#6b5b52";
      /* FASSUNG 808 — die Grundfläche gedreht (auch schräg) */
      c.beginPath(); SZ.ecken(o).forEach((p, i) => { const x = (p[0] + g / 2) * f, y = (p[1] + g / 2) * f; if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.closePath(); c.fill();
    }
  }

  /* ---------------- Schmuck-Leiste (Baukasten) ---------------- */
  const SCHMUCK = [
    ["Laterne", "d_laterne", [0.8, 0.8], 4.4], ["Bank", "d_bank", [1.9, 0.75], 0.9], ["Zaun", "d_zaun", [4, 0.3], 1.2], ["Brunnen", "d_brunnen", [4.6, 4.6], 5.4],
    ["Tanne", "n_tanne0", [3.5, 3.5], 13], ["Tanne", "n_tanne1", [3.5, 3.5], 13], ["Laubbaum", "n_laubbaum0", [4.5, 4.5], 13], ["Laubbaum", "n_laubbaum2", [4.5, 4.5], 13],
    ["Apfelbaum", "n_obstbaum0", [3, 3], 6], ["Apfelbaum", "n_obstbaum1", [3, 3], 6],
    ["Christbaum", "d_weihnachtsbaum", [7.4, 7.4], 21.8, 1], ["Marktbude", "d_marktbude", [4, 3.2], 4.2, 1], ["Schneemann", "d_schneemann", [1.3, 1.3], 1.9, 1],
    ["Pyramide", "d_pyramide", [9.2, 9.2], 13, 1], ["Krippe", "d_krippe", [7.2, 5.4], 5.2, 1],
    /* FASSUNG 829 — XANDER: „bei den Schmück-Sachen oder Bausachen eine Eisdiele machen, wo dann die Leute auch mal Eis
       essen gehen können". An Stelle 8 die Drehung beim Setzen: 3,5 = Theke zum Betrachter. */
    ["Eisdiele", "d_eisdiele", [7.4, 7.0], 5.2, 0, undefined, undefined, 3.5],
    /* FASSUNG 808 — neue Modelle aus stadt/modelle/ (gebacken, stadt-leicht/backplan.json); an Stelle 5 die Gruppe.
       Geladen wird ein Bild erst, wenn die Leiste offen ist oder das Ding in der Stadt steht. */
    ["Rathaus Döbeln", "w_rathaus_doebeln", [41, 33.1], 32.5, 0, "Wahrzeichen"],
    /* FASSUNG 829 — XANDER: „Guck mal, dass du noch ein realistisches Kolosseum baust … dass das dann von der
       Größenordnung zum Döbelner Rathaus passt". Modell in 1:2,14 wie das Rathaus im Dorf (88,2 × 72,8 m, 22,4 m hoch). */
    ["Kolosseum", "w_kolosseum", [88.2, 72.8], 22.4, 0, "Wahrzeichen", undefined, 3.5],
    /* FASSUNG 815 — an Stelle 7 der Name des Autos in autos.js: kaufen, fahren lassen, abstellen */
    ["Dodge Viper", "v_viper", [1.92, 4.45], 1.12, 0, "Fahrzeuge", "viper"], ["Batmobil", "v_batmobil", [2.1, 5.9], 1.12, 0, "Fahrzeuge", "batmobil"],
    ["Pferdebahn", "v_pferdebahn", [2.3, 9.6], 3, 0, "Fahrzeuge"], ["Kornwagen", "v_pferdewagen_korn", [2, 6.5], 2.6, 0, "Fahrzeuge"],
    ["Mehlwagen", "v_pferdewagen_mehl", [2, 6.5], 2.6, 0, "Fahrzeuge"], ["Leerer Wagen", "v_pferdewagen_leer", [2, 6.5], 2.6, 0, "Fahrzeuge"],
    ["Gleis", "d_gleis", [3, 4], 0.1, 0, "Gleise"], ["Gleisbogen", "d_gleis_kurve", [7.5, 7.5], 0.1, 0, "Gleise"]
  ];
  function leisteZeigen(an) {
    if (!leiste) {
      leiste = el("div", "lk-leiste");
      let gruppe = "";
      for (const s of SCHMUCK) {
        /* FASSUNG 808 — Überschrift, wenn eine neue Gruppe beginnt (Wahrzeichen, Fahrzeuge, Gleise) */
        if (s[5] && s[5] !== gruppe) { gruppe = s[5]; leiste.appendChild(el("div", "lk-gruppe", "<span>" + gruppe + "</span>")); }
        const b = el("button", "lk-karte-klein"); b.type = "button";
        /* FASSUNG 829 — Dinge, die mit der Front zum Betrachter gesetzt werden, zeigen auch im Bildchen ihre Front */
        const bild = s[1] + "_" + (s[4] ? "winter" : SZ.jahr === "winter" ? "winter" : "herbst") + "_tag_f_" + (s[7] != null ? (s[7] * 90) % 360 : 0) + "_k";
        b.innerHTML = '<img alt="" src="stadt-leicht/bilder/' + bild + '.webp' + (LB.version ? "?v=" + LB.version : "") + '"><span>' + s[0] + "</span>";
        if (s[6] && ST.autos) { b.classList.add("lk-auto-karte"); b.dataset.auto = s[6]; b.appendChild(el("small", "lk-auto-preis")); b.appendChild(el("b", "lk-kaufen")); }
        b.addEventListener("click", (e) => { e.stopPropagation(); if (s[6] && ST.autos) autoKarte(s); else setzenBeginnen(s); });
        leiste.appendChild(b);
      }
      wurzel.appendChild(leiste);
    }
    if (an) autoKartenText();
    leiste.hidden = !an;
    wurzel.classList.toggle("leiste-offen", an);
  }

  /* ---------------- FASSUNG 815 — Autos kaufen, fahren lassen, abstellen ----------------
     XANDER: „mein neuen Dodge Viper und mein Batmobil habe ich immer noch nicht in der Map … Ich kann sie nicht dazu
     kaufen. Ich kann sie im Spiel überhaupt nicht ausprobieren." In der Schmücken-Leiste stehen die Autos mit Preis und
     „Kaufen"; ein Tipp öffnet die Karte des Autos (Kaufen, Probefahrt – gekauft: Hinfahren, Abstellen, Losfahren). */
  function autoKartenText() {
    if (!leiste || !ST.autos) return;
    for (const b of leiste.querySelectorAll(".lk-auto-karte")) {
      const id = b.dataset.auto, A = ST.autos.ARTEN[id], hat = ST.autos.hat(id);
      b.querySelector(".lk-auto-preis").textContent = hat ? (ST.autos.geparkt(id) ? "abgestellt" : "fährt") : A.preis + " Punkte";
      b.querySelector(".lk-kaufen").textContent = hat ? "Dein Auto" : "Kaufen";
      b.classList.toggle("lk-gekauft", hat);
    }
  }
  /* FASSUNG 821 — XANDER: „wenn man bei Batmobil oder Viper klick dann muss ich die Möglichkeit geben sich das Auto schön
     anzugucken". Mit ziel malt autoKarte ihre Knöpfe unten in die Auto-Schau (autoschau.js) statt in die Karte; „weg"
     schließt dann die Schau. Ohne ziel gibt es in der Karte den Knopf „Anschauen". */
  function autoKarte(s, ziel) {
    const AU = ST.autos, id = s[6], A = AU.ARTEN[id];
    if (leiste && !leiste.hidden) leisteZeigen(false);
    if (bauLeiste) bauLeisteZeigen(false);
    SZ.auswahl = null;
    const kt = ziel || karte;
    if (ziel) { karte.hidden = true; kt.hidden = false; kt.innerHTML = ""; } else karteOeffnen(null);   // FASSUNG 822 — sonst die Karte am Ding
    karte._uhr = null;
    const titel = el("div", "lk-karte-titel"), zeile = el("div", "lk-karte-zeile"), knoepfe = el("div", "lk-karte-knoepfe");
    kt.append(titel, zeile, knoepfe);
    titel.textContent = A.name;
    const weg = () => { if (ziel && ST.autoschau) ST.autoschau.schliessen(); else karte.hidden = true; };
    const zu = knopf("kreuz", "Schließen", () => { karte.hidden = true; }, "lk-klein");
    const textKnopf = (html, fn, cls) => { const b = el("button", "lk-text-knopf" + (cls ? " " + cls : ""), html); b.type = "button"; b.addEventListener("click", (e) => { e.stopPropagation(); fn(b); }); return b; };
    const schau = !ziel && ST.autoschau ? textKnopf("<span>Anschauen</span>", () => { karte.hidden = true; autoSchau(s); }, "lk-anschauen-knopf") : null;
    if (schau && ST.autoschau.vorladen) ST.autoschau.vorladen().catch(() => {});   // FASSUNG 812 — die Schau schon holen, während die Karte offen ist
    const dazu = (...k) => knoepfe.append(...k.concat(schau ? [schau] : [], ziel ? [] : [zu]));
    const hin = () => { const a = AU.auto(id); if (!a) return; weg(); AU.folge = id; L().fliegeZu(a.x, a.y, Math.max(K.s, 16 * K.dpr), 700); karte.hidden = true; };
    if (!AU.hat(id)) {
      zeile.textContent = "Preis " + A.preis + " Punkte · danach fährt " + A.er + " durch deine Stadt";
      const kauf = textKnopf(SYM.stern + "<span>Kaufen · " + A.preis + " P.</span>", (b) => {
        b.disabled = true;
        AU.kaufen(id).then((r) => {
          ansage(A.name + " gekauft – " + A.er + " fährt los" + (r && r.vorlaeufig ? " (Preis wird später abgebucht)" : ""));
          if (r && r.punkte != null && L().ich) L().ich.punkte = r.punkte;
          autoKarte(s, ziel); autoKartenText(); L().unruhe = 2;
          if (ziel && ST.autoschau) ST.autoschau.auffrischen();
        }).catch((e) => { b.disabled = false; ansage((e && (e.message || e.hint)) || "Geht gerade nicht"); });
      }, "lk-kaufen-knopf");
      kauf.dataset.preis = A.preis;
      if (ST.spiel.beispiel || !ST.spiel.angemeldet) { kauf.disabled = true; kauf.title = "In der Beispielstadt wird nicht gekauft – bitte anmelden"; }
      const probe = textKnopf("<span>Probefahrt</span>", () => { AU.probefahrt(id); ansage("Probefahrt: " + A.name + " fährt 90 Sekunden"); setTimeout(hin, 400); }, "lk-probe-knopf");
      dazu(kauf, probe);
      return;
    }
    if (AU.geparkt(id)) {
      zeile.textContent = "Steht abgestellt – tippe es an, um loszufahren.";
      dazu(textKnopf("<span>Losfahren</span>", () => { weg(); losfahrenVonDeko(id); karte.hidden = true; }));
      return;
    }
    zeile.textContent = "Dein Auto fährt durch die Stadt.";
    dazu(textKnopf("<span>Hinfahren</span>", hin), textKnopf("<span>Abstellen</span>", () => { weg(); setzenBeginnen(s); geist.autoParken = id; }));
  }
  /* FASSUNG 821 — die Auto-Schau öffnen; unten stehen die Knöpfe der Karte */
  function autoSchau(s) {
    /* FASSUNG 812 — sonst: falls die nachgeladene Schau nicht kommt (kein Netz), die Karte des Autos */
    if (!ST.autoschau || !ST.autoschau.oeffnen(s[6], { knoepfe: (ziel) => autoKarte(s, ziel), sonst: () => autoKarte(s) })) autoKarte(s);
  }
  /* ein abgestelltes Auto (Schmuck) fährt wieder los – dort, wo es stand */
  function losfahrenVonDeko(id, dieses) {
    const A = ST.autos.ARTEN[id], o = dieses || SZ.objekte.find((x) => x.art === "eigen" && x.bild === A.bild && !x.geist);
    if (o) SZ.weg(o);
    ST.autos.parken(id, false, o ? { x: o.x, y: o.y } : null);
    L().dekoSpeichern(); SZ.geaendert(); miniMalen(); L().unruhe = 2;
    ansage(A.name + " fährt los");
  }

  /* ---------------- Bauen: alle Gebäude des Spiels ---------------- */
  function platzVon(k) { const plan = (L().ich && L().ich.dorf_plan && L().ich.dorf_plan.platz) || {}; return plan[k] || k; }
  function bauLeisteZeigen(an) {
    if (leiste) leisteZeigen(false);
    if (bauLeiste) { bauLeiste.remove(); bauLeiste = null; }
    wurzel.classList.toggle("leiste-offen", an);
    if (!an) return;
    bauLeiste = el("div", "lk-leiste lk-bauleiste");
    const dorf = (L().ich && L().ich.dorf) || {};
    for (const k in D.GEBAEUDE) {
      const G = D.GEBAEUDE[k], haus = SZ.objekte.find((o) => o.art === "haus" && o.spiel === k);
      const st = (dorf[k] && dorf[k].stufe) || 0;
      /* FASSUNG 822 — XANDER: „wenn ich … einen neuen [Kuhstall] bauen will, baut er gar keinen neuen, sondern er orientiert
         sich an meinem alten … es bringt im Prinzip gar nix am zweiten Kuhstall zu bauen". Im Spiel gibt es jedes Gebäude
         genau einmal (dorf[k].stufe; „zweiter Stall" steht in SPIELSYSTEM.md noch als offen). Der Eintrag sagt das jetzt
         klar: „hast du schon – versetzen?" – ein Tipp öffnet das kleine Menü am vorhandenen Haus mit „Versetzen". */
      const schon = !!(haus && (st || haus.bau));
      /* (im kleinen Rahmen ist die Karte nur 56 px breit: dort kurz „hast du", der ganze Satz steht im Titel und im Menü) */
      const eng = document.body.classList.contains("lk-mini-modus");
      const text = schon ? (haus.bau && !st ? (eng ? "im Bau" : "im Bau – versetzen?") : (eng ? "hast du" : "hast du schon – versetzen?")) : G[2] ? "ab Level " + G[2] : G[1] + " P.";
      const b = el("button", "lk-karte-klein" + (st || (haus && haus.bau) ? "" : " lk-frei") + (schon ? " lk-schon" : "")); b.type = "button";
      /* FASSUNG 829 — XANDER: „du hast das Bergwerk nicht mit der Öffnung zu uns gestellt". Im Dorf schauen alle Häuser
         zum Betrachter (dreh 3,5 → Bild _f_315); das Bildchen in der Bau-Leiste zeigt jetzt dieselbe Ansicht (vorher
         _f_0: das Mundloch des Bergwerks schaute schräg zur Seite). Ohne 315°-Bild bleibt es bei 0°. */
      const jz = (SZ.jahr === "winter" ? "winter" : "herbst") + "_tag_f_", vz = LB.vz || {};
      const bild = D.BILD[k][0] + "_" + jz + (vz[D.BILD[k][0] + "_" + jz + "315_k"] ? "315" : "0") + "_k";
      b.innerHTML = '<img alt="" src="stadt-leicht/bilder/' + bild + '.webp' + (LB.version ? "?v=" + LB.version : "") + '"><span>' + G[0] + (st ? " " + st : "") + "</span><small>" + text + "</small>";
      if (schon) { b.title = G[0] + (st ? " (Stufe " + st + ")" : " (im Bau)") + " hast du schon – ein zweiter geht im Spiel nicht. Antippen: versetzen oder ausbauen."; b.setAttribute("aria-label", b.title); }
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        bauLeisteZeigen(false);
        /* FASSUNG 833 — späte Häuser (Holzfällerhütte …): ihr Platz auf dem Bauland links */
        const pk = platzVon(k), pl = D.PLAETZE[pk] || (haus ? { x: haus.x, y: haus.y } : D.spaetPlatz && D.SPAET[k] ? D.spaetPlatz(k, SZ.objekte.filter((x) => x.art === "wunder" || (x.art === "haus" && x.spaet))) : null);
        /* FASSUNG 817 — im kleinen Rahmen höchstens bis zur Grenze des Rahmens (und innerhalb des Überblicks) */
        if (pl) { const s = Math.min(K.max, Math.max(K.s, 16 * K.dpr)), z = O.klemmZiel ? O.klemmZiel(pl.x, pl.y, s) : [pl.x, pl.y]; L().fliegeZu(z[0], z[1], s, 800); }
        if (haus) waehlen(haus, { schonDa: schon }); else karteZeigen("bauplatz", null, pk);
      });
      bauLeiste.appendChild(b);
    }
    wurzel.appendChild(bauLeiste);
  }

  /* ---------------- Setzen: Geist in der Bildmitte ---------------- */
  let geist = null, geistZiehen = false;
  /* FASSUNG 826 — gebaut wird auf dem Plateau (dorf.js D.BAURAUM): der Geist bleibt mit seiner ganzen Grundfläche darauf,
     nicht auf der Böschung oder im Umland */
  function imBauraum(o) {
    const R = ST.dorf && ST.dorf.BAURAUM; if (!R || !o) return;
    const f = o.fuss || [2, 2], m = (Math.hypot(f[0], f[1]) / 2 * (o.stufe || 1) + 6) * Math.SQRT2;
    const u = Math.max(R.u0 + m, Math.min(R.u1 - m, o.x - o.y)), v = Math.max(R.v0 + m, Math.min(R.v1 - m, o.x + o.y));
    o.x = (u + v) / 2; o.y = (v - u) / 2;
  }
  function setzenBeginnen(s) {
    leisteZeigen(false);
    auswahlWeg();
    const p = ST.aufBoden(K.W / 2, K.H * 0.46);
    geist = SZ.neu({ art: "eigen", bild: s[1], x: p[0], y: p[1], dreh: s[7] || 0, fuss: s[2], hoehe: s[3], nurWinter: s[4] ? 1 : undefined, geist: true }); imBauraum(geist);
    karteZeigen("setzen", geist);
  }
  O.haltAufbau = () => !!geist;
  /* FASSUNG 809 — ein gebautes Haus versetzen: es wird selbst zum Geist (gestrichelt), Abbrechen stellt es zurück */
  /* FASSUNG 822 — gilt auch für Bäume der Stadt (art „natur"): sie werden selbst zum Geist */
  function hausVersetzen(o) {
    if (geist) geistFertig(false);
    auswahlWeg();
    if (SZ.objekte.indexOf(o) < 0) o = gleichesDing(o);   // (nach einem Neuaufbau das neue Haus)
    if (!o) return;
    o._zurueck = { x: o.x, y: o.y, dreh: o.dreh };
    o.geist = true; geist = o;
    if (O.fokusVergessen) O.fokusVergessen();
    karteZeigen("setzen", geist); SZ.geaendert(); L().unruhe = 2;
    grossHeraus(o);   // FASSUNG 844
  }
  /* FASSUNG 844 — große Dinge setzen: prüfen, ob die Stelle frei ist (dorf.js D.freiFuerWunder), und frei suchen */
  function grossDing(o) { return !!o && (o.art === "wunder" || (o.fuss && Math.max(o.fuss[0], o.fuss[1]) * (o.art === "wunder" ? 1 : (o.stufe || 1)) > 16)); }
  function fussVon(o) { const f = o.fuss || [2, 2], m = o.art === "wunder" ? 1 : (o.stufe || 1); return [f[0] * m, f[1] * m]; }
  function andereGrosse(o) { return SZ.objekte.filter((x) => x !== o && !x.geist && (x.art === "wunder" || (x.art === "eigen" && grossDing(x)))).map((x) => ({ x: x.x, y: x.y, fussS: fussVon(x), dreh: x.dreh })); }
  let pruefZeit = 0;
  function platzPruefen(o, sofort) {
    if (!o || !D.freiFuerWunder) return;
    const jetzt = performance.now(); if (!sofort && jetzt - pruefZeit < 120) return; pruefZeit = jetzt;
    const q = D.freiFuerWunder({ fussS: fussVon(o), pruefDreh: o.dreh }, o.x, o.y, andereGrosse(o), true);
    o._frei = !!q && Math.abs(q[0] - o.x) < 0.06 && Math.abs(q[1] - o.y) < 0.06;
  }
  function freiSuchen(o) {
    if (!o || !D.freiFuerWunder) return;
    const q = D.freiFuerWunder({ fussS: fussVon(o), pruefDreh: o.dreh }, o.x, o.y, andereGrosse(o));
    if (!q) return;
    const frei = Math.abs(q[0] - o.x) < 0.06 && Math.abs(q[1] - o.y) < 0.06;
    o.x = q[0]; o.y = q[1]; imBauraum(o); platzPruefen(o, true); SZ.geaendert(); L().unruhe = 2;
    const P = ST.proj(o.x, o.y, 0);
    if (P[0] < 0 || P[1] < 0 || P[0] > K.W || P[1] > K.H) { const z = O.klemmZiel ? O.klemmZiel(o.x, o.y, K.s) : [o.x, o.y]; L().fliegeZu(z[0], z[1], K.s, 500); }
    ansage(o._frei ? (frei ? "Hier ist schon Platz" : "Freien Platz gefunden") : "Kein ganz freier Platz in der Nähe");
  }
  /* große Dinge beim Versetzen: weit genug heraus, dass sie samt Umgebung ins Bild passen */
  function grossHeraus(o) {
    if (!grossDing(o)) return;
    const f = fussVon(o), d = Math.hypot(f[0], f[1]), sZiel = Math.max(K.min, Math.min(K.s, 0.42 * K.W / Math.max(1, d)));
    if (sZiel < K.s * 0.97) { const z = O.klemmZiel ? O.klemmZiel(o.x, o.y, sZiel) : [o.x, o.y]; L().fliegeZu(z[0], z[1], sZiel, 600); }
  }
  function geistFertig(ok) {
    if (!geist) return;
    /* FASSUNG 815 — ein abgestelltes Auto fährt nicht mehr, bis man „Losfahren" tippt */
    const parkt = ok && geist.autoParken && ST.autos ? geist.autoParken : null;
    if (parkt) ST.autos.parken(parkt, true);
    if (ok && geist.art === "natur" && geist.nkey) { const N = L().natur || (L().natur = { weg: [], lage: {} }); N.lage[geist.nkey] = [+geist.x.toFixed(2), +geist.y.toFixed(2)]; geist.versetzt = 1; }
    /* FASSUNG 826 — ein versetztes Wahrzeichen oder großer Schmuck: Wege und Bäume neu (Aufbau nach dem Setzen) */
    const neuBauen = ok && (geist.art === "wunder" || (geist.art === "eigen" && geist.fuss && Math.max(geist.fuss[0], geist.fuss[1]) > 4));
    if (ok) { geist.geist = false; delete geist.autoParken; L().dekoSpeichern(); ansage(parkt ? "Abgestellt" : "Gesetzt"); }
    else if (geist._zurueck) { Object.assign(geist, geist._zurueck); geist.geist = false; delete geist._zurueck; }
    else SZ.weg(geist);
    if (geist) { delete geist._zurueck; delete geist._frei; }
    if (neuBauen) L().aufbauenSpaeter = true;
    geist = null; karte.hidden = true; SZ.geaendert(); miniMalen(); L().unruhe = 2;
    if (L().aufbauenSpaeter) L().aufbauen();
  }

  /* ---------------- Antippen ---------------- */
  let autoUnterFinger = null;
  /* FASSUNG 822 — XANDER: „wenn es jetzt angeklickt ist in dem Modus und ich würde das jetzt halten dann würde das kurz so
     ne Haptik geben … und ich sehe ich kann's jetzt bewegen dann kann ich es zur Seite ziehen und die Karte bleibt still
     dabei". Ist ein Haus, Schmuck oder Baum angetippt (sein Menü offen), dann Finger 0,45 s ruhig darauf: kurzes Brummen (navigator.vibrate), das Ding hebt sich
     an (halb durchsichtig, Rahmen, ein Stück höher) und folgt dem Finger – die Karte steht still. Loslassen setzt es und
     speichert (derselbe Weg wie „Versetzen“ → „Setzen“), danach steht das kleine Menü am Ding. Im Überblick des kleinen
     Rahmens nicht (dort scrollt der Finger die Seite). */
  let halten = null, gehoben = null;
  const HALTEN_MS = 450;
  function haltenAbbrechen() { if (halten) { clearTimeout(halten.uhr); halten = null; } }
  function haltenErlaubt() {
    if (geist) return false;
    const b = document.body.classList;
    return !(b.contains("lk-mini-modus") && !b.contains("lk-nah") && !O.gestalten);
  }
  function anheben(o) {
    halten = null;
    if (geist || SZ.objekte.indexOf(o) < 0) return;
    try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {}
    clearTimeout(O._tippUhr); O._tipp = null;
    if (O.wahlZu) O.wahlZu();
    if (leiste && !leiste.hidden) leisteZeigen(false);
    if (bauLeiste) bauLeisteZeigen(false);
    karte.hidden = true; karte._ding = null; SZ.auswahl = null;
    o._zurueck = { x: o.x, y: o.y, dreh: o.dreh };
    o.geist = true; o.heben = 7; geist = o; geistZiehen = true; gehoben = o;
    document.body.classList.add("lk-gehoben");
    ansage("Ziehen – loslassen setzt");
    SZ.geaendert(); L().unruhe = 2;
  }
  O.gehoben = () => gehoben;
  O.zeigerRunter = function (p) {
    geistZiehen = false; O._langStart = { x: p.x, y: p.y };
    /* FASSUNG 812 — ein fahrendes Auto zählt schon beim Aufsetzen des Fingers: sonst ist es (die Kamera folgt ihm nicht
       mehr) beim Loslassen schon ein Stück weitergefahren, und der Tipp „auf das Batmobil" ginge ins Leere */
    autoUnterFinger = ST.autos && !document.body.classList.contains("lk-mini-modus") ? ST.autos.treffer(p.x, p.y) || null : null;
    if (autoUnterFinger && ST.autoschau && ST.autoschau.vorladen) ST.autoschau.vorladen().catch(() => {});
    if (ST.autos) ST.autos.folge = null;   // FASSUNG 815 — wer selbst schiebt, folgt dem Auto nicht mehr
    /* FASSUNG 822 — ein zweiter Finger (Zoomen) bricht das Halten ab */
    /* FASSUNG 844 — ein zweiter Finger (Kneifen, Drehen) ist nie ein langes Drücken */
    O._lang = false; const zweiter = !!langUhr || (O._finger || 0) > 0; clearTimeout(langUhr); langUhr = 0; O._finger = (O._finger || 0) + 1;
    if (halten) { haltenAbbrechen(); return; }
    /* FASSUNG 844 — XANDER (Walkie 313): „wenn ich lange auf ein Haus gedrückt halte soll das Bearbeiten Menü kommen".
       Finger 0,5 s ruhig auf einem Haus, Wahrzeichen, Schmuck, Bahnhof/Bootsverleih oder Baum (nicht im Umland): kurzes
       Summen, das kleine Bearbeiten-Menü am Ding (Karte, Drehen, Versetzen, Ein Tipp produziert …) – überall, auch im
       Überblick des kleinen Rahmens (dort fliegt die Stadt dafür näher heran). Ist das Menü des Dings schon offen, hebt
       langes Halten es an wie bisher (Fassung 822). Der Finger danach ist kein Tipp. */
    const offen0 = karte && !karte.hidden && karte._ding;
    if (!geist && !zweiter) {
      const lo = SZ.treffer(p.x, p.y, (x) => x.art === "haus" || x.art === "wunder" || x.art === "eigen" || (x.art === "kulisse" && !!x.name) || (x.art === "natur" && istBaum(x) && !x.umland && !x.hinten));
      if (lo && !(offen0 === lo && haltenErlaubt())) langUhr = setTimeout(() => { langUhr = 0; if (geist || SZ.objekte.indexOf(lo) < 0) return; langMenue(lo); }, O.langMs || 500);
    }
    if (!geist && haltenErlaubt()) {
      /* nur das gewählte Ding („wenn es jetzt angeklickt ist … und ich würde das jetzt halten“) – wer über ein anderes Haus
         wischt, schiebt wie immer die Karte */
      const gew = karte && !karte.hidden && karte._ding;
      const o = gew && (gew.art === "haus" || gew.art === "eigen" || gew.art === "natur") ? SZ.treffer(p.x, p.y, (x) => x === gew) : null;
      /* (zweistufig: hing das Telefon kurz, kommen die liegengebliebenen Fingerbewegungen noch vor dem Anheben an – wer in
         Wahrheit schon schiebt, schiebt die Karte und hebt nichts an) */
      if (o) {
        const h = halten = { o: o, x: p.x, y: p.y, t0: performance.now() };
        h.uhr = setTimeout(function nachsehen() {
          if (halten !== h) return;
          if (performance.now() - h.t0 < HALTEN_MS) { h.uhr = setTimeout(nachsehen, HALTEN_MS - (performance.now() - h.t0)); return; }
          h.uhr = setTimeout(function heben() { if (halten !== h) return; if (h.zuletzt && performance.now() - h.zuletzt < 150) { h.uhr = setTimeout(heben, 80); return; } anheben(o); }, 40);
        }, HALTEN_MS - 40);
      }
    }
    if (geist) {
      /* auf dem Geist angesetzt? dann zieht der Finger den Geist */
      const t = SZ.treffer(p.x, p.y, (o) => o === geist);
      const G = ST.proj(geist.x, geist.y, 0);
      if (t || Math.hypot(p.x - G[0], p.y - G[1]) < 50 * K.dpr) geistZiehen = true;
    }
  };
  let langUhr = 0;
  function langMenue(o) {
    try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {}
    O._lang = true;
    clearTimeout(O._tippUhr); O._tipp = null;
    if (O.wahlZu) O.wahlZu();
    if (leiste && !leiste.hidden) leisteZeigen(false);
    if (bauLeiste) bauLeisteZeigen(false);
    const imRahmen = document.body.classList.contains("lk-mini-modus") && window.parent !== window;
    if (imRahmen && !document.body.classList.contains("lk-nah") && O.fokus) { O.fokus(o); if (O.fokusVergessen) O.fokusVergessen(); }
    SZ.auswahl = o; karteZeigen("haus", o, null, { still: true, bearbeiten: true }); L().unruhe = 2;
    /* das Menü kann unter dem Finger aufgehen: bis der Finger oben ist (und kurz danach), nimmt es keinen Tipp an – sonst
       schaltete das Loslassen gleich den Knopf darunter (etwa den Blitz) */
    karte.classList.add("lk-sperre"); O._langSperre = true;
    ansage("Bearbeiten: " + (o.name || (o.art === "natur" ? baumName(o) : (SCHMUCK.find((x) => x[1] === o.bild) || ["Schmuck"])[0])));
  }
  O.langMenue = langMenue;
  O.zeigerZiehen = function (neu, alt) {
    /* FASSUNG 844 — wer schiebt oder scrollt, will kein Menü */
    if (langUhr && (O._langStart ? Math.hypot(neu.x - O._langStart.x, neu.y - O._langStart.y) > 8 * K.dpr : true)) { clearTimeout(langUhr); langUhr = 0; }
    /* FASSUNG 822 — wer schiebt, hält nicht: mehr als 6 px vom Aufsetzpunkt, oder der Finger ist gerade in Bewegung */
    if (halten) { const w = Math.hypot(neu.x - halten.x, neu.y - halten.y); if (w > 6 * K.dpr) haltenAbbrechen(); else if (w > 2.5 * K.dpr) halten.zuletzt = performance.now(); }
    if (!geist || !geistZiehen) return false;
    const a = ST.aufBoden(neu.x, neu.y), b = ST.aufBoden(alt.x, alt.y);
    geist.x += a[0] - b[0]; geist.y += a[1] - b[1]; imBauraum(geist); SZ.geaendert();
    if (grossDing(geist)) platzPruefen(geist);   // FASSUNG 844 — grün/rot
    return true;
  };
  O.zeigerHoch = function () {
    geistZiehen = false; clearTimeout(langUhr); langUhr = 0; O._finger = Math.max(0, (O._finger || 0) - 1);
    if (O._langSperre) { O._langSperre = false; setTimeout(() => { if (karte) karte.classList.remove("lk-sperre"); }, 400); }
    haltenAbbrechen();
    /* FASSUNG 822 — losgelassen: das angehobene Ding steht, ist gespeichert, sein Menü sitzt daneben */
    if (gehoben) {
      const o = gehoben; gehoben = null; delete o.heben;
      document.body.classList.remove("lk-gehoben");
      if (geist === o) { geistFertig(true); if (SZ.objekte.indexOf(o) >= 0) waehlen(o, { still: true }); }
    }
  };
  /* FASSUNG 822 — Koordinator: „solange ein Objekt so gewählt ist, dreht der Dreh-Schieber das Objekt". Ziel des Schiebers:
     das angehobene/zu setzende Ding, sonst das Haus oder der Schmuck, dessen Menü offen ist; ohne Ziel dreht er die Karte.
     O.schieberDrehen(r): r = +1/−1 Schritt (45° bei Bildern mit acht Winkeln), gibt true zurück, wenn ein Ding gedreht wurde.
     O.schieberSetzen(grad): stellt die Blickrichtung des Dings auf den nächsten erlaubten Winkel. */
  O.schieberZiel = function () {
    if (geist) return geist;
    const d = karte && !karte.hidden && karte._ding;
    return d && (d.art === "haus" || d.art === "eigen") && SZ.objekte.indexOf(d) >= 0 ? d : null;
  };
  O.schieberDrehen = function (r) { const o = O.schieberZiel(); if (!o) return false; objDrehen(o, r, !geist); return true; };
  O.schieberSetzen = function (grad) {
    const o = O.schieberZiel(); if (!o) return false;
    const schritt = SZ.achtWinkel(o.bild) ? 0.5 : 1, d = SZ.drehNorm(Math.round((+grad || 0) / 90 / schritt) * schritt);
    if (d !== o.dreh) { o.dreh = d; SZ.geaendert(); miniMalen(); L().unruhe = 2; if (!geist) L().dekoSpeichern(); }
    return true;
  };
  O.tippen = function (px, py) {
    if (gehoben) return;   // FASSUNG 822 — das Loslassen nach dem Halten ist kein Tipp
    if (O._lang) { O._lang = false; return; }   // FASSUNG 844 — ebenso nach dem langen Drücken (Bearbeiten-Menü)
    farbFeld.hidden = true;
    /* FASSUNG 817 — im kleinen Rahmen des Spiels wartet ein Tipp einen Augenblick (0,36 s), ob ein zweiter folgt: der
       Doppeltipp zoomt nur („stärker reinkommen"), ohne dass der erste Tipp schon ein Haus bedient oder eine Aufgabe
       startet („beim einfachen klicken auf ein Haus … schon die Aufgabe anstellt"). */
    if (window.parent !== window && document.body.classList.contains("lk-mini-modus") && !geist) {
      if (O.wahlZu && O.wahlZu()) { O._tipp = null; if (O.fokusDa && O.fokusDa()) O.fokusZurueck(0); return; }
      const jetzt = performance.now();
      clearTimeout(O._tippUhr);
      if (O._tipp && jetzt - O._tipp.t < 360 && Math.hypot(O._tipp.x - px, O._tipp.y - py) < 40 * K.dpr) {
        O._tipp = null;
        if (O.doppelTipp) O.doppelTipp(px, py);
        try { window.parent.postMessage({ typ: "leicht-doppel" }, location.origin); } catch (e) {}
        return;
      }
      O._tipp = { t: jetzt, x: px, y: py };
      O._tippUhr = setTimeout(() => einzelTippen(px, py), 360);
      return;
    }
    if (window.parent !== window && !geist && O.wahlZu && O.wahlZu()) return;   // FASSUNG 833 — die Auswahl (Brot/Kuchen) geht zu
    einzelTippen(px, py);
  };
  function einzelTippen(px, py) {
    if (geist) { const a = ST.aufBoden(px, py); geist.x = a[0]; geist.y = a[1]; imBauraum(geist); if (grossDing(geist)) platzPruefen(geist, true); SZ.geaendert(); L().unruhe = 2; return; }
    if (leiste && !leiste.hidden) { leisteZeigen(false); return; }
    if (bauLeiste) { bauLeisteZeigen(false); return; }
    /* FASSUNG 815 — Tipp auf ein fahrendes Auto: seine Karte (im großen Bild) */
    /* FASSUNG 821 — XANDER: „wenn man bei Batmobil oder Viper klick dann muss ich die Möglichkeit geben sich das Auto
       schön anzugucken": der Tipp öffnet gleich die Auto-Schau (autoschau.js), unten mit den Knöpfen der Karte */
    const fa = ST.autos && !document.body.classList.contains("lk-mini-modus") && (autoUnterFinger || ST.autos.treffer(px, py));
    autoUnterFinger = null;
    if (fa) { const s = SCHMUCK.find((x) => x[6] === fa.id); if (s) { autoSchau(s); return; } }
    const o = SZ.treffer(px, py, (o) => o.art !== "natur" || o.rand !== 1);
    /* FASSUNG 828 — XANDER: „Theoretisch könnte ich überall auf die Bäume klicken und das könnte die Holzhacker
       losschicken … die Bäume sollen alle darauf reagieren jeder Art von Baum". Im Spiel (klein und Vollbild) schickt
       jeder Baum – Wald, Randwald, Obstbaum und im kleinen Rahmen auch ein selbst gesetzter – die Holzfäller los (sind
       sie schon unterwegs, hilft der Tipp mit; sind sie zurück, wird das Holz eingesammelt). Im Vollbild öffnet ein
       eigener Baum weiter seine Karte (Drehen, Versetzen) – dort steht dafür „Holzfäller". */
    const spielTipp = window.parent !== window && !O.gestalten, mini = document.body.classList.contains("lk-mini-modus");
    if (o && o.art === "eigen" && istBaum(o) && spielTipp && mini && !document.body.classList.contains("lk-nah")) { baumTun(o); auswahlWeg(); return; }
    /* FASSUNG 846 — eine Such-Quest wartet (quests.js): der Tipp aufs Haus ist die Antwort */
    if (o && ST.quests && ST.quests.tippAuf && ST.quests.tippAuf(o)) { auswahlWeg(); return; }
    if (o && (o.art === "haus" || o.art === "wunder" || o.art === "eigen" || o.name)) { waehlen(o); return; }
    /* FASSUNG 809 — XANDER: „Waldstück … wenn man auf die Bäume klickt … einen Effekt". Ein Baum raschelt: Blätter
       (im Winter Schnee) rieseln, zwei Vögel fliegen auf. */
    const baum = SZ.treffer(px, py, (x) => x.art === "natur" && istBaum(x));
    /* FASSUNG 822 — XANDER: „wenn ich was anklicke, dann muss er hier ein Menü sein, was ich damit machen will … Weil der
       Baum ist halt direkt noch vorm Rathaus kriegt den da nicht weg". Im Überblick des kleinen Rahmens bleibt es wie bisher
       (im Spiel: Holzfäller losschicken, Fassung 828; sonst Rascheln); nah dran (Kompass), beim Gestalten und im großen Bild
       öffnet der Baum sein kleines Menü: Versetzen, Entfernen (im kleinen Rahmen dazu „Wald" für die Station). */
    if (baum) {
      const imRahmen = window.parent !== window && document.body.classList.contains("lk-mini-modus");
      if (imRahmen && !document.body.classList.contains("lk-nah") && !O.gestalten) {
        if (spielTipp) baumTun(baum); else baumRascheln(baum);
        auswahlWeg(); return;
      }
      /* FASSUNG 812 — im Vollbild des Spiels beides: „die Bäume sollen alle darauf reagieren" (Holzfäller, 828) und das
         kleine Menü am Baum (Versetzen, Entfernen, 822). Nah dran im kleinen Rahmen nur das Menü.
         FASSUNG 826 — Bäume im Umland (hinter dem Plateau) haben kein Menü. */
      if (spielTipp && !imRahmen) baumTun(baum); else baumRascheln(baum);
      if (!baum.umland && !baum.hinten) { waehlen(baum); return; }
      auswahlWeg(); return;
    }
    /* leerer Bauplatz? */
    const a = ST.aufBoden(px, py);
    /* FASSUNG 807 — im Spiel eingebettet: ein Tipp auf den See angelt (wie im alten Dorf); Doppeltipp auf die Wiese
       führt mit dem Kompass zurück zur ganzen Stadt */
    /* FASSUNG 828 — XANDER: „immer noch keine Angler am See, wenn ich … den See anklicke und es gibt noch kein Getreide
       … da muss ich immer in die alte Ansicht zurück". See und Äcker jetzt auch im Vollbild; ein Tipp auf den Acker erntet
       (reif) oder hilft beim Wachsen. Knapp neben einem Baum (im Überblick sind sie winzig) zählt als Baum. */
    if (spielTipp) {
      if (ST.boden.wert(a[0], a[1], 1) > 0.4) { O.stationTun("see"); return; }
      /* FASSUNG 829 — XANDER (Funk 255): „das Feld auf der rechten Seite ist auch noch nicht in einer geeigneten Position wo
         ich locker drauf zugreifen kann". Gezählt hat nur der kleine Ladefleck des Kornwagens in der Mitte des Ackers; jetzt
         erntet ein Tipp irgendwo auf dem gemalten Feld (Häuser und Bäume davor gehen weiter vor, siehe oben). */
      { const f = feldBei(a[0], a[1]); if (f && (f.u0 != null || ST.boden.wert(a[0], a[1], 2) > 0.4)) { O.stationTun("feld" + f.nr); return; } }
      const nb = baumNahe(px, py);
      if (nb) { baumTun(nb); auswahlWeg(); return; }
      /* (FASSUNG 817: der Doppeltipp wird jetzt schon in O.tippen erkannt, für jede Stelle im Bild) */
    }
    for (const k in D.PLAETZE) {
      const pl = D.PLAETZE[k];
      if (Math.hypot(pl.x - a[0], pl.y - a[1]) > 6.5) continue;
      if (SZ.objekte.some((x) => x.art === "haus" && Math.hypot(x.x - pl.x, x.y - pl.y) < 1)) continue;
      auswahlWeg(); karteZeigen("bauplatz", null, k); return;
    }
    auswahlWeg();
  }
  /* FASSUNG 828 — Bäume, See und Äcker im Spiel (siehe einzelTippen) */
  function istBaum(x) { return /^n_(tanne|laubbaum|obstbaum|baum|birke|kiefer)/.test((x && x.bild) || ""); }
  function spielPost(d) { try { window.parent.postMessage(d, location.origin); } catch (e) {} }
  O.summen = function () { try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {} };
  function baumTun(b) { baumRascheln(b); O.summen(); spielPost({ typ: "leicht-baum" }); }
  /* der nächste Baum (Wald, Rand, eigener) höchstens 10 px neben dem Finger – im Überblick sind Bäume nur ein paar Punkte groß */
  function baumNahe(px, py) {
    const r = 10 * K.dpr; let best = null, bd = r;
    for (const e of SZ.sichtbare || []) {
      if (!istBaum(e.o) || !(e.o.art === "natur" || (e.o.art === "eigen" && document.body.classList.contains("lk-mini-modus")))) continue;
      const m = e.meta, x0 = e.X - m.ax * e.k, y0 = e.Y - m.ay * e.k, x1 = x0 + m.w * e.k, y1 = y0 + m.h * e.k;
      const d = Math.hypot(Math.max(x0 - px, 0, px - x1), Math.max(y0 - py, 0, py - y1));
      if (d < bd) { bd = d; best = e.o; }
    }
    return best;
  }
  function feldBei(x, y) {
    let best = null, bd = 1e9;
    for (const f of D.FELD_ORTE || []) {
      /* FASSUNG 844 — rechteckige Äcker: drinnen ist drinnen */
      if (f.u0 != null) { const u = x - y, v = x + y; if (u >= f.u0 && u <= f.u1 && v >= f.v0 && v <= f.v1) return f; }
      const d = Math.hypot(f.x - x, f.y - y) - f.r; if (d < bd) { bd = d; best = f; }
    }
    return best && bd < 6 ? best : null;
  }
  /* Angler am Ufer: wenn die Fischer des Spiels arbeiten (Zeichen „läuft" am See) und ein paar Sekunden nach dem eigenen Wurf */
  let anglerWurf = -1e9, anglerFischer = false, uferPlaetze = null, uferSchl = "";
  O.stationTun = function (g, vomZeichen) {
    if (!vomZeichen) O.summen();   // FASSUNG 812 — vom Zeichen aus hat das Einsammeln schon gesummt (genau einmal)
    if (g === "see") { anglerWurf = performance.now(); L().unruhe = 2; spielPost({ typ: "leicht-haus", g: "see" }); return; }
    const f = /^feld(9[12])$/.exec(g);
    if (f) { feldTipp = { nr: +f[1], t: performance.now() }; L().unruhe = 2; spielPost({ typ: "leicht-feld", nr: +f[1] }); }
  };
  O.anglerSetzen = function (an) { if (an !== anglerFischer) { anglerFischer = an; L().unruhe = 2; } };
  O.anglerDa = function () { return anglerFischer || performance.now() - anglerWurf < 9000; };
  O.uferPlaetze = function () { return ufer(); };
  let feldTipp = null;
  function ufer() {
    const v = D.SEE_VERSATZ || [0, 0], schl = v.join(",");
    if (uferPlaetze && uferSchl === schl) return uferPlaetze;
    uferSchl = schl; uferPlaetze = [];
    const cx = 66 + v[0], cy = 56 + v[1], B = ST.boden, nass = (x, y) => B.wert(x, y, 1) > 0.5;
    /* Uferpunkte rund um die Zunge des Sees: trockenes Land, 1,5 m weiter zur Mitte ist Wasser; vorn (zum Betrachter) zuerst */
    const kand = [];
    for (let r = 6; r <= 22; r += 1) for (let w = 0; w < 360; w += 6) {
      const a = w * Math.PI / 180, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (nass(x, y) || B.wert(x, y, 0) > 0.4) continue;
      const dx = cx - x, dy = cy - y, l = Math.hypot(dx, dy) || 1;
      if (!nass(x + dx / l * 1.5, y + dy / l * 1.5)) continue;
      if (SZ.objekte.some((o) => o.art !== "natur" && Math.abs(o.x - x) < (o.fuss ? o.fuss[0] : 2) / 2 + 1 && Math.abs(o.y - y) < (o.fuss ? o.fuss[1] : 2) / 2 + 1)) continue;
      kand.push({ x: x, y: y, dx: dx / l, dy: dy / l, vorn: x + y });
    }
    kand.sort((p, q) => q.vorn - p.vorn);
    for (const p of kand) { if (uferPlaetze.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > 4.5)) uferPlaetze.push(p); if (uferPlaetze.length >= 2) break; }
    return uferPlaetze;
  }
  SZ.zuhoerer.push(function (g, t) {
    const jetzt = performance.now();
    /* ein Tipp auf den Acker: ein paar Ähren fliegen auf */
    if (feldTipp && jetzt - feldTipp.t < 900) {
      const f = (D.FELD_ORTE || []).find((q) => q.nr === feldTipp.nr);
      if (f) {
        const d = (jetzt - feldTipp.t) / 900, P = ST.proj(f.x, f.y, 0.5 + d * 4), r = Math.max(2 * K.dpr, 0.25 * K.s);
        g.save(); g.globalAlpha = 1 - d; g.fillStyle = "#e7bf5a"; g.strokeStyle = "#9a7410"; g.lineWidth = Math.max(1, 0.05 * K.s);
        for (let i = 0; i < 7; i++) { const w = i * 0.9 + d * 3; g.beginPath(); g.ellipse(P[0] + Math.cos(w) * r * 3 * d, P[1] - Math.sin(i) * r * 2 * d, r, r * 0.55, w, 0, 7); g.fill(); g.stroke(); }
        g.restore(); L().unruhe = 2;
      }
    }
    if (!O.anglerDa || !O.anglerDa()) return;
    const wurf = (jetzt - anglerWurf) / 1000, plaetze = ufer();
    const k = Math.max(K.s, 3.2 * K.dpr);   // im Überblick etwas größer als maßstäblich, sonst sähe man sie nicht
    plaetze.forEach((p, i) => {
      const P = ST.proj(p.x, p.y, 0);
      if (P[0] < -60 || P[1] < -60 || P[0] > K.W + 60 || P[1] > K.H + 60) return;
      /* Blickrichtung zum Wasser im Bild */
      const Q = ST.proj(p.x + p.dx, p.y + p.dy, 0), ux = (Q[0] - P[0]) / (Math.hypot(Q[0] - P[0], Q[1] - P[1]) || 1);
      const s = k / K.s, hZ = (z) => z * s;   // Höhen in Metern, auf die Mindestgröße gestreckt
      const hand = ST.proj(p.x + p.dx * 0.25 * s, p.y + p.dy * 0.25 * s, hZ(1.15));
      /* Rute: hoch zum Wasser hin; nach dem eigenen Wurf schwingt sie eine Sekunde lang aus */
      const schwung = wurf < 1.2 && i === 0 ? Math.sin(Math.min(1, wurf / 1.2) * Math.PI) * 0.9 : 0;
      const spitze = ST.proj(p.x + p.dx * (2.2 - schwung) * s, p.y + p.dy * (2.2 - schwung) * s, hZ(2.6 + schwung * 1.4));
      const pose = ST.proj(p.x + p.dx * 3.6 * s, p.y + p.dy * 3.6 * s, 0);
      const wipp = Math.sin(t * 2.4 + i * 1.7) * 0.18 * k;
      g.save();
      g.fillStyle = "rgba(30,40,30,.28)"; g.beginPath(); g.ellipse(P[0], P[1], 0.45 * k, 0.18 * k, 0, 0, 7); g.fill();
      /* Beine, Jacke, Kopf mit Hut */
      g.lineCap = "round";
      g.strokeStyle = "#3b3a45"; g.lineWidth = Math.max(1.2, 0.2 * k);
      g.beginPath(); g.moveTo(P[0] - 0.12 * k, P[1]); g.lineTo(P[0] - 0.08 * k, P[1] - 0.8 * k); g.moveTo(P[0] + 0.12 * k, P[1]); g.lineTo(P[0] + 0.08 * k, P[1] - 0.8 * k); g.stroke();
      g.fillStyle = i ? "#2f6d8f" : "#b0452f";
      g.beginPath(); g.ellipse(P[0], P[1] - 1.12 * k, 0.26 * k, 0.4 * k, 0, 0, 7); g.fill();
      g.fillStyle = "#f0c9a0"; g.beginPath(); g.arc(P[0], P[1] - 1.66 * k, 0.16 * k, 0, 7); g.fill();
      g.fillStyle = "#6b5a2e"; g.beginPath(); g.ellipse(P[0], P[1] - 1.78 * k, 0.27 * k, 0.08 * k, 0, 0, 7); g.fill();
      /* Rute und Schnur bis zur roten Pose */
      g.strokeStyle = "#5a3b1c"; g.lineWidth = Math.max(1, 0.07 * k);
      g.beginPath(); g.moveTo(hand[0], hand[1]); g.lineTo(spitze[0], spitze[1]); g.stroke();
      g.strokeStyle = "rgba(240,240,240,.75)"; g.lineWidth = Math.max(0.7, 0.025 * k);
      g.beginPath(); g.moveTo(spitze[0], spitze[1]); g.quadraticCurveTo((spitze[0] + pose[0]) / 2 + ux * 0.2 * k, (spitze[1] + pose[1]) / 2, pose[0], pose[1] + wipp); g.stroke();
      g.fillStyle = "#d8261f"; g.beginPath(); g.arc(pose[0], pose[1] + wipp, Math.max(1.2, 0.12 * k), 0, 7); g.fill();
      g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = Math.max(0.6, 0.03 * k);
      g.beginPath(); g.ellipse(pose[0], pose[1] + 0.1 * k, 0.35 * k * (1 + (t % 1.5) / 1.5), 0.12 * k * (1 + (t % 1.5) / 1.5), 0, 0, 7); g.stroke();
      g.restore();
    });
    if (wurf < 1.6) L().unruhe = 2;
  });
  /* FASSUNG 844 — XANDER (Walkie 313): „ich möchte sichtbare Getreidefelder". Auf die Äcker (dorf.js D.FELD_ORTE, große
     Rechtecke in den Bildachsen) kommt flach auf den Boden ein Kornfeld: Reihen von Halmen, gelb-golden wenn das Spiel
     „fertig" meldet (reif), sonst grün mit gelbem Schimmer (wächst), im Winter Stoppeln mit Schnee. Nachts dunkler wie der
     Boden. Nah dran stehen einzelne Ähren in den Reihen. */
  /* FASSUNG 846 — XANDER (Walkie 315): „vorher waren das gelbe Felder“ – auch das wachsende Korn ist gelblich (nicht mehr grasgrün) */
  /* FASSUNG 835 — XANDER (Funk 263): „im Spiel lass die Getreidefelder mehr wie Getreidefelder aussehen nicht nur wie
     einfache Vierecke". Die Äcker malt jetzt stadt-leicht/korn.js (eigene Datei, wird nach dem ersten Bild nachgeladen:
     korn-laden.js vertritt sie in der Bündelung und malt bis dahin eine einfache Fläche). */
  const rascheln = [];
  function baumRascheln(o) {
    const t0 = performance.now(), jahr = SZ.jahr, h = (o.hoehe || 10) * (o.stufe || 1);
    const farben = jahr === "winter" ? ["#ffffff", "#e8f1fb"] : jahr === "herbst" ? ["#d9822b", "#c2561d", "#e8b23a"] : ["#5f9a3a", "#7cb34a", "#4c8330"];
    const teile = [];
    for (let i = 0; i < 14; i++) teile.push({ z: h * (0.45 + Math.random() * 0.45), dx: (Math.random() - 0.5) * 3.2, dy: (Math.random() - 0.5) * 3.2, v: 0.35 + Math.random() * 0.4, w: Math.random() * 6, f: farben[i % farben.length] });
    rascheln.push({ o: o, t0: t0, teile: teile, voegel: jahr === "winter" ? 1 : 2 });
    if (rascheln.length > 6) rascheln.shift();
    L().unruhe = 2;
  }
  SZ.zuhoerer.push(function (g) {
    const jetzt = performance.now();
    for (let i = rascheln.length - 1; i >= 0; i--) {
      const r = rascheln[i], d = (jetzt - r.t0) / 1000;
      if (d > 3.2) { rascheln.splice(i, 1); continue; }
      const kk = K.s * (r.o.stufe || 1);
      g.save();
      for (const p of r.teile) {
        const z = Math.max(0, p.z - d * p.v * 6), P = ST.proj(r.o.x + p.dx + Math.sin(d * 3 + p.w) * 0.6, r.o.y + p.dy, z);
        g.globalAlpha = Math.max(0, Math.min(1, 1.6 - d * 0.5)) * (z > 0 ? 1 : Math.max(0, 1 - (d - 2) * 2));
        g.fillStyle = p.f;
        g.beginPath(); g.ellipse(P[0], P[1], Math.max(1.2 * K.dpr, 0.18 * kk), Math.max(0.8 * K.dpr, 0.1 * kk), d * 4 + p.w, 0, Math.PI * 2); g.fill();
      }
      g.globalAlpha = Math.max(0, 1 - d / 3.2); g.strokeStyle = "#2b2a2e"; g.lineWidth = Math.max(1.2, 0.12 * kk);
      for (let v = 0; v < r.voegel; v++) {
        const P = ST.proj(r.o.x + (v ? 1 : -1) * d * 3, r.o.y - d * 2, (r.o.hoehe || 10) * (r.o.stufe || 1) * 0.9 + d * d * 5);
        const sp = Math.max(3 * K.dpr, 0.5 * kk), fl = Math.sin(d * 18 + v * 2) * sp * 0.5;
        g.beginPath(); g.moveTo(P[0] - sp, P[1] - fl); g.quadraticCurveTo(P[0] - sp * 0.4, P[1] - sp * 0.3, P[0], P[1]); g.quadraticCurveTo(P[0] + sp * 0.4, P[1] - sp * 0.3, P[0] + sp, P[1] - fl); g.stroke();
      }
      g.restore();
    }
  });
  /* FASSUNG 808 — XANDER: „du hast gesagt acht Winkel und hast sie nicht umgesetzt die möchte ich bitte". Was schräge
     Bilder hat (Spielgebäude, Bank, Zaun, Fahrzeuge …), dreht in Achtelschritten (45°), alles andere wie bisher in
     Vierteln. r = +1 links herum, −1 rechts herum. */
  function objDrehen(o, r, merken) {
    if (!o) return;
    const schritt = SZ.achtWinkel(o.bild) ? 0.5 : 1;
    o.dreh = SZ.drehNorm((o.dreh || 0) + r * schritt);
    if (o === geist && grossDing(o)) platzPruefen(o, true);   // FASSUNG 844
    SZ.geaendert(); miniMalen(); L().unruhe = 2;
    if (merken) L().dekoSpeichern();
    ansage("Gedreht: " + Math.round(o.dreh * 90) + "°");
  }
  O.objDrehen = objDrehen;
  function waehlen(o, opt) { SZ.auswahl = o; karteZeigen("haus", o, null, opt); L().unruhe = 2; }
  function auswahlWeg() { SZ.auswahl = null; if (!geist) { karte.hidden = true; karte._ding = null; } L().unruhe = 2; }
  /* FASSUNG 822 — Kompass, Doppeltipp, Kachel, Umschalten: das kleine Menü am Ding geht zu (wie die Auswahl des Spiels) */
  O.dingZu = () => { if (!geist && karte && !karte.hidden && karte.classList.contains("lk-am-ding")) auswahlWeg(); };
  /* FASSUNG 822 — nach einem Neuaufbau (Spielstand vom Spiel, Bau fertig …) sind alle Dinge neu: dasselbe Ding wiederfinden,
     sonst wirkten „Versetzen" und „Drehen" auf ein Haus, das gar nicht mehr in der Stadt steht (es „schnippte zurück"). */
  function gleichesDing(o) {
    if (!o) return null;
    if (SZ.objekte.indexOf(o) >= 0) return o;
    return SZ.objekte.find((n) => n.art === o.art && (o.spiel ? n.spiel === o.spiel : o.nkey ? n.nkey === o.nkey
      : n.bild === o.bild && Math.abs(n.x - o.x) < 0.05 && Math.abs(n.y - o.y) < 0.05)) || null;
  }
  function dingNeuVerknuepfen() {
    const alt = (karte && !karte.hidden && karte._ding) || SZ.auswahl;
    if (!alt || geist) return;
    const neu = gleichesDing(alt);
    if (neu === alt) return;
    if (SZ.auswahl === alt) SZ.auswahl = neu;
    if (karte && !karte.hidden && karte._ding === alt) { if (neu) karteZeigen("haus", neu, null, { still: true, schonDa: karte._schonDa }); else auswahlWeg(); }
  }
  /* FASSUNG 822 — XANDER: „dieses einfache Menü haben am Haus selber das ist direkt irgendwie". Die Karte eines Dings
     (Haus, Baum, Schmuck, Wahrzeichen) sitzt klein direkt am Ding statt unten quer über dem Bild. Sie sucht sich einen
     Platz über, unter oder neben dem Ding, der das Ding selbst und die Knöpfe (Kopf, kleine Karte, Kompass, Uhr, Leisten,
     die Zeichen der Häuser) möglichst nicht verdeckt, und bleibt ganz im Bild – auch im kleinen Rahmen (360 px). */
  function karteOeffnen(ding) {
    karte.hidden = false; karte.innerHTML = ""; karte._uhr = null; karte._ding = ding || null; karte._i = -1; karte._schonDa = false; karte.style.visibility = ""; karte._schl = "";
    karte.classList.toggle("lk-am-ding", !!ding);
    if (!ding) karte.style.transform = "";
  }
  /* FASSUNG 831 — dazu der Dreh-Schieber (.lk-drehschieber, seit 822 statt des Drehknopfs links im kleinen Rahmen) */
  const AUSWEICHEN = [".lk-kopf", ".lk-mini-rahmen", ".lk-schmuck", ".lk-leiste", ".lk-lupe", ".lk-uhr", ".lk-ortsschild", ".lk-wetter", ".lk-vollknopf", ".lk-drehknopf", ".lk-drehschieber", ".lk-gestalten-fertig", ".lk-wahl", ".lk-zeichen"];
  function amDingLegen() {
    if (!karte || karte.hidden || !karte.classList.contains("lk-am-ding")) return;
    const o = karte._ding;
    if (!o) return;
    /* nur rechnen, wenn sich Blick, Ding oder die Knöpfe ringsum geändert haben (sonst kostet es jedes Bild ein Layout) */
    const jetzt = performance.now(), schl = [K.x, K.y, K.s, K.dreh, K.W, K.H, o.x, o.y, o.dreh, o.stufe, karte.childElementCount, wurzel.classList.contains("leiste-offen"), document.body.className].join("|");
    if (schl === karte._schl && jetzt - (karte._schlT || 0) < 500) return;
    karte._schl = schl; karte._schlT = jetzt;
    /* FASSUNG 833 — ohne den Teil, den das Fenster des Spiels (Station, Bahnhof) im Vollbild verdeckt */
    const fr = !document.body.classList.contains("lk-mini-modus") && O.freiRaum ? O.freiRaum : { unten: 0, rechts: 0 };
    const W = K.W / K.dpr - fr.rechts, H = K.H / K.dpr - fr.unten, bw = karte.offsetWidth, bh = karte.offsetHeight;
    const h = (o.hoehe || 6) * (o.stufe || 1);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const q of SZ.ecken(o)) for (const z of [0, h]) { const P = ST.proj(q[0], q[1], z); x0 = Math.min(x0, P[0]); x1 = Math.max(x1, P[0]); y0 = Math.min(y0, P[1]); y1 = Math.max(y1, P[1]); }
    x0 /= K.dpr; x1 /= K.dpr; y0 /= K.dpr; y1 /= K.dpr;
    /* das Ding ist aus dem Bild geschoben: das Menü wartet unsichtbar (es soll nicht am Rand über fremden Häusern liegen) */
    const weg0 = x1 < 0 || y1 < 0 || x0 > W || y0 > H;
    if (karte.style.visibility !== (weg0 ? "hidden" : "")) karte.style.visibility = weg0 ? "hidden" : "";
    if (weg0) return;
    const ding = { left: x0, right: x1, top: y0, bottom: y1 }, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    const weg = [];
    for (const s of AUSWEICHEN) for (const e of wurzel.querySelectorAll(s)) { if (e === karte) continue; const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) weg.push(r); }
    const setzen = (lx, ly) => [Math.max(4, Math.min(W - bw - 4, lx)), Math.max(4, Math.min(H - bh - 4, ly))];
    const ueber = (q, r) => Math.max(0, Math.min(r.right, q[0] + bw) - Math.max(r.left, q[0])) * Math.max(0, Math.min(r.bottom, q[1] + bh) - Math.max(r.top, q[1]));
    const wert = (q) => weg.reduce((a, r) => a + ueber(q, r), 0) + ueber(q, ding) * 0.6;
    const wahl = [setzen(mx - bw / 2, y0 - bh - 6), setzen(mx - bw / 2, y1 + 6), setzen(x1 + 6, my - bh / 2), setzen(x0 - bw - 6, my - bh / 2)];
    const werte = wahl.map(wert);
    /* FASSUNG 831 — XANDER (822): „ich möchte im kleinen Menü einen Baum rausnehmen". Im kleinen Rahmen (360 × 225) ist das
       Menü 321 px breit: über dem Baum stieß es oben an Kompass und Ortsschild, daneben ist kein Platz – alle vier Lagen
       deckten etwas zu (Sonde 822: „ueber":2), und links lag der Dreh-Schieber über „Versetzen“. Deckt jede der vier Lagen
       etwas zu, werden auch die Lagen dicht neben den Knöpfen probiert (rechts/unter/über jedem Knopf, an den Rändern) –
       genommen wird die, die am wenigsten zudeckt und dem Ding am nächsten liegt. */
    if (Math.min(...werte) > 1) {
      const xs = [mx - bw / 2, 4, W - bw - 4], ys = [y0 - bh - 6, y1 + 6, my - bh / 2, 4, H - bh - 4];
      for (const r of weg) { xs.push(r.right + 4, r.left - bw - 4); ys.push(r.bottom + 4, r.top - bh - 4); }
      const naehe = (q) => Math.hypot(Math.max(0, x0 - (q[0] + bw), q[0] - x1), Math.max(0, y0 - (q[1] + bh), q[1] - y1));
      for (const x of xs) for (const y of ys) { const q = setzen(x, y); wahl.push(q); werte.push(wert(q) + naehe(q) * 0.2); }
    }
    let best = 0; for (let i = 1; i < wahl.length; i++) if (werte[i] < werte[best] - 1) best = i;
    /* die einmal gefundene Lage bleibt, solange sie (fast) so gut ist – kein Springen beim Schieben */
    if (!(karte._i >= 0 && werte[karte._i] <= werte[best] + 40)) karte._i = best;
    const q = wahl[karte._i], t = "translate(" + q[0].toFixed(1) + "px," + q[1].toFixed(1) + "px)";
    if (karte.style.transform !== t) karte.style.transform = t;
  }
  O.amDingLegen = amDingLegen;
  function baumName(o) { const b = o.bild || ""; return /tanne/.test(b) ? "Tanne" : /obstbaum/.test(b) ? "Apfelbaum" : /laubbaum/.test(b) ? "Laubbaum" : /birke/.test(b) ? "Birke" : /kiefer/.test(b) ? "Kiefer" : "Baum"; }
  function baumEntfernen(o) {
    const N = L().natur || (L().natur = { weg: [], lage: {} });
    if (o.nkey) { if (N.weg.indexOf(o.nkey) < 0) N.weg.push(o.nkey); delete N.lage[o.nkey]; }
    SZ.weg(o); karte.hidden = true; karte._ding = null; SZ.auswahl = null;
    L().dekoSpeichern(); miniMalen(); L().unruhe = 2;
    ansage(baumName(o) + " entfernt");
  }

  function zeitText(ms) { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  /* Welches Gebäude gehört auf diesen Platz? (Umsetzen im Spiel beachten) */
  function wasGehoertHin(platz) {
    const plan = (L().ich && L().ich.dorf_plan && L().ich.dorf_plan.platz) || {};
    for (const k in plan) if (plan[k] === platz) return k;
    return plan[platz] ? null : platz;
  }
  function karteZeigen(art, o, platz, opt) {
    opt = opt || {};
    /* FASSUNG 801 — XANDER: „in der ganz kleinen Miniaturansicht muss man dann auch nur auf Einsammeln klicken können und
       dann muss das funktionieren". Im kleinen Dorfrahmen des Spiels öffnet ein Tipp auf ein Gebäude (oder einen Bauplatz)
       die gewohnte Karte des Spiels UNTER dem Rahmen – dort sind Einsammeln, Ausbauen, Arbeiter. Wischen bleibt Ansehen. */
    /* FASSUNG 817 — beim Schmücken/Bauen im kleinen Rahmen (O.gestalten) bleibt die Karte der Stadt (Drehen, Versetzen …) */
    const imRahmen = document.body.classList.contains("lk-mini-modus") && window.parent !== window;
    /* FASSUNG 833 — XANDER (Funk 214): „Des Weiteren kann man in der großen Ansicht von der Stadt immer noch nichts
       einsammeln oder Aufgaben lösen oder jemanden losschicken das kann man nur in der kleinen Ansicht". Im Vollbild des
       Spiels (eingebettet, nicht lk-mini-modus) bediente ein Tipp aufs Haus nur die eigene Karte der Stadt (Stufe, Ausbauen,
       Drehen) – das Spiel erfuhr nichts: kein Einsammeln, keine Station, kein Losschicken. Jetzt wie im kleinen Rahmen: der
       Tipp geht ans Spiel (fertig → einsammeln, sonst öffnet es seine Station – im Vollbild als Fenster über der Stadt), und
       am Haus steht das kleine Menü (Karte, Drehen, Versetzen, Ein Tipp produziert). */
    const imVoll = !imRahmen && window.parent !== window && !O.gestalten && art === "haus" && o && o.art === "haus" && !!o.spiel && o.spiel !== "bahnhof";
    if (imVoll && !opt.still) {
      try { const z = O.zeichenJetzt && O.zeichenJetzt[o.spiel]; if (z && z[0] === "fertig" && ST.ton && ST.ton.einsammeln) ST.ton.einsammeln(z[2] || ""); } catch (e) {}
      /* FASSUNG 827 — XANDER (Funk 248): „die Mühle produziert nicht sofort die geht immer erst ins große Menü". Auch im
         Vollbild fragt der Tipp nach den kleinen Symbolen am Haus (klein: 1); das große Fenster nur, wenn es keine gibt. */
      try { window.parent.postMessage({ typ: "leicht-haus", g: o.spiel, voll: 1, klein: 1 }, location.origin); } catch (e) {}
    }
    if (imRahmen && !O.gestalten && (art === "haus" || art === "bauplatz")) {
      /* FASSUNG 817 — ein leerer Bauplatz meldet das Haus, das (nach dem Umbauen im Spiel) dorthin gehört */
      const g = art === "haus" ? o && o.spiel : (wasGehoertHin(platz) || platz);
      /* FASSUNG 825 — ist dort etwas fertig, sammelt der Tipp es ein: dasselbe „Pling" wie am Zeichen */
      const zj = g && O.zeichenJetzt && O.zeichenJetzt[g], fertig = !!zj && zj[0] === "fertig";
      if (!opt.bearbeiten) { try { if (fertig && ST.ton && ST.ton.einsammeln) ST.ton.einsammeln(zj[2] || ""); } catch (e) {} }
      /* FASSUNG 844 — XANDER (Walkie 313): „du wolltest eigentlich kleine links machen kleine Symbole am Haus … dass ich am
         Haus direkt auswählen kann … jetzt kriege ich trotzdem wieder das große Menü und dann springt manchmal die Seite hoch
         durch das große Menü". Der Tipp fragt das Spiel mit „klein: 1" nach den kleinen Symbolen am Haus (leicht-wahl:
         Brot, Kuchen, Bergleute … und „Karte" für das große Menü nur auf Wunsch); das Spiel öffnet dann nicht mehr die Station
         unter dem Bild (ältere Spielstände tun es noch). Dazu fliegt die Stadt zum Haus („dass der Zoom direkt auf dieses
         Haus springt") – nicht, wenn nur eingesammelt wird. Langes Halten öffnet stattdessen das Bearbeiten-Menü. */
      if (g && !opt.still && !opt.bearbeiten) { try { window.parent.postMessage({ typ: "leicht-haus", g: g, klein: 1 }, location.origin); } catch (e) {} }
      /* hingeflogen wird, sobald das Spiel die kleinen Symbole schickt (leicht-wahl): ein älteres Spiel, das stattdessen die
         Station unter dem Bild öffnet, lässt die Stadt stehen, wie sie ist */
      if (art === "haus" && o && !opt.still && !opt.bearbeiten && !fertig && g !== "bahnhof") O._fokusWunsch = { g: g, o: o, t: performance.now() };
      if (art === "haus" && o && !opt.bearbeiten && o.art === "haus") return;
      /* FASSUNG 822 — XANDER: „ich möchte im kleinen Menü einen Baum rausnehmen und bin jetzt ein gezoomt … Ich hab jetzt
         kein Menü". Nah dran (Kompass) bekommen Haus, Baum und Schmuck ihr kleines Menü am Ding – der Tipp aufs Haus
         bedient wie bisher das Spiel darunter (Einsammeln, Station), das Menü bietet dazu Karte, Drehen, Versetzen. */
      /* FASSUNG 833 — nah dran auch Wahrzeichen und Bootsverleih (dort steht „Verwalten") */
      /* FASSUNG 844 — Walkie 313: „viele Sachen sind gar nicht anwählbar". Im alten Dorf öffnete ein Tipp auf ein Wahrzeichen
         dessen Tafel; im Überblick der neuen Stadt geschah dort nichts (auch am Bootsverleih und am eigenen Schmuck). Jetzt
         bekommen Wahrzeichen, Bootsverleih und Schmuck auch im Überblick ihr kleines Menü (Verwalten, Info, Drehen …), und die
         Stadt fliegt zu ihnen. Langes Halten (opt.bearbeiten) öffnet das Menü für jedes Ding. */
      const vwK = art === "haus" && o && ST.verwalten && ST.verwalten.schluessel(o);
      if (art === "haus" && o && !opt.bearbeiten && !opt.still && (o.art === "wunder" || o.art === "eigen" || vwK) && !document.body.classList.contains("lk-nah") && O.fokus) O.fokus(o);
      if (!(art === "haus" && o && (opt.bearbeiten || o.art === "wunder" || o.art === "eigen" || vwK || (document.body.classList.contains("lk-nah") && o.art === "natur")))) return;
    }
    /* FASSUNG 823 — XANDER: „wenn ich auf eins klicke, dann muss ich noch mal auf dem Bahnhof …". Auch im Vollbild öffnet ein
       Tipp auf den Bahnhof das eine Bahnhof-Fenster des Spiels (Export, Import, Touristen) statt „Gehört zum Dorf". */
    if (window.parent !== window && !O.gestalten && art === "haus" && o && o.spiel === "bahnhof" && !imRahmen) {
      SZ.auswahl = null; karte.hidden = true;
      try { window.parent.postMessage({ typ: "leicht-haus", g: "bahnhof" }, location.origin); } catch (e) {}
      return;
    }
    karteOeffnen(art === "haus" && o ? o : null);
    karte._schonDa = !!opt.schonDa;
    const titel = el("div", "lk-karte-titel"), zeile = el("div", "lk-karte-zeile"), knoepfe = el("div", "lk-karte-knoepfe");
    karte.append(titel, zeile, knoepfe);
    const zu = knopf("kreuz", "Schließen", () => { if (geist) geistFertig(false); auswahlWeg(); karte.hidden = true; }, "lk-klein");
    if (art === "setzen") {
      titel.textContent = o && (o.art === "haus" || o.art === "wunder") ? o.name + " versetzen" : "Schmuck setzen";
      zeile.textContent = "Mit dem Finger verschieben oder auf die Wiese tippen.";
      knoepfe.append(knopf("links", "Drehen", () => objDrehen(geist, 1)), knopf("rechts", "Andersherum drehen", () => objDrehen(geist, -1)),
        knopf("haken", "Setzen", () => geistFertig(true), "lk-gut"), knopf("kreuz", "Abbrechen", () => geistFertig(false)));
      /* FASSUNG 844 — XANDER (Walkie 313): „ich möchte den Kölner Dom irgendwie besser setzen können und ich habe kaum Platz
         weil er so riesig ist". Große Dinge (Wahrzeichen, großer Schmuck): der Rahmen zeigt grün (passt) oder rot (stößt an
         ein Haus, ein Wahrzeichen, Wasser, Acker oder die Bahn), und „Freier Platz" schiebt es an die nächste Stelle, an der
         es ganz frei steht. Die Größe bleibt, wie sie ist. */
      if (o && grossDing(o)) {
        zeile.textContent = "Ziehen oder auf die Wiese tippen · grün = passt, rot = stößt an";
        const fp = el("button", "lk-text-knopf lk-freiplatz", SYM.versetzen + "<span>Freier Platz</span>"); fp.type = "button";
        fp.title = "An die nächste Stelle schieben, an der es ganz frei steht";
        fp.addEventListener("click", (e) => { e.stopPropagation(); freiSuchen(geist); });
        knoepfe.insertBefore(fp, knoepfe.firstChild);
        platzPruefen(o, true);
      }
      return;
    }
    if (art === "bauplatz") {
      const k = wasGehoertHin(platz), G = k && D.GEBAEUDE[k];
      titel.textContent = G ? "Bauplatz: " + G[0] : "Bauplatz";
      if (!G) { zeile.textContent = "Dieser Platz ist im Spiel einem anderen Haus zugeteilt."; knoepfe.append(zu); return; }
      /* FASSUNG 822 — das Haus dieses Platzes steht schon (nur versetzt): „Bauen" hätte im Spiel nur das alte ausgebaut.
         Stattdessen klar sagen und das Haus zurückholen oder hinfliegen. */
      const steht = SZ.objekte.find((x) => x.art === "haus" && x.spiel === k);
      if (steht) {
        zeile.textContent = "Dein " + G[0] + " steht schon – nur versetzt. Ein zweiter geht im Spiel nicht.";
        const zurueck = el("button", "lk-text-knopf", SYM.zurueck + "<span>Zurückholen</span>"); zurueck.type = "button";
        zurueck.addEventListener("click", (e) => { e.stopPropagation(); if (steht.platzX != null) { steht.x = steht.platzX; steht.y = steht.platzY; steht.dreh = steht.platzDreh; } SZ.geaendert(); miniMalen(); L().dekoSpeichern(); ansage(G[0] + " wieder auf dem Bauplatz"); waehlen(steht, { still: true }); });
        const hin = el("button", "lk-text-knopf", SYM.versetzen + "<span>Hinfliegen</span>"); hin.type = "button";
        hin.addEventListener("click", (e) => { e.stopPropagation(); const s2 = Math.min(K.max, Math.max(K.s, 16 * K.dpr)), z = O.klemmZiel ? O.klemmZiel(steht.x, steht.y, s2) : [steht.x, steht.y]; L().fliegeZu(z[0], z[1], s2, 700); waehlen(steht, { still: true }); });
        knoepfe.append(zurueck, hin, zu);
        return;
      }
      const preis = G[1], lv = G[2];
      zeile.textContent = "Preis " + preis + " Punkte" + (lv ? " · ab Level " + lv : "") + " · Bauzeit 2 min";
      const bau = el("button", "lk-text-knopf", SYM.hammer + "<span>Bauen</span>"); bau.type = "button";
      bau.addEventListener("click", (e) => { e.stopPropagation(); aktion(() => ST.spiel.bauen(k), G[0] + " wird gebaut", bau); });
      if (ST.spiel.beispiel) { bau.disabled = true; bau.title = "In der Beispielstadt wird nicht gebaut – bitte anmelden"; }
      knoepfe.append(bau, zu);
      return;
    }
    /* Haus, Wahrzeichen, Kulisse oder eigener Schmuck */
    titel.textContent = o.name || (SCHMUCK.find((s) => s[1] === o.bild) || [""])[0] || "Schmuck";
    /* FASSUNG 833 — Wahrzeichen und Bootsverleih: „Verwalten" (Eintritt, Besucher, Einnahmen, Zustand, Ausbau, Info) */
    const vwKey = ST.verwalten && ST.verwalten.schluessel(o);
    const vwKnopf = () => knopf(ST.verwalten.SYMBOL, "Verwalten: Eintritt, Einnahmen, Info", () => { auswahlWeg(); karte.hidden = true; ST.verwalten.oeffnen(vwKey); }, "lk-verwalten-knopf");
    /* FASSUNG 822 — im kleinen Rahmen (ohne Gestalten) bedient der Tipp das Spiel; das Menü am Haus: Karte, Drehen, Versetzen */
    /* FASSUNG 833 — ebenso im Vollbild des Spiels (imVoll) */
    if ((imRahmen || imVoll) && !O.gestalten && o.art === "haus") {
      zeile.textContent = o.bau ? (o.bau.stufe > 1 ? "Ausbau auf Stufe " + o.bau.stufe : "Im Bau") : "Stufe " + (o.stufenZahl || 1) + " von 3";
      const kk = knopf("liste", "Karte öffnen", () => { auswahlWeg(); try { window.parent.postMessage({ typ: "leicht-haus", g: o.spiel, karte: 1 }, location.origin); } catch (e) {} });
      kk.setAttribute("aria-label", "Karte des Hauses öffnen");
      knoepfe.append(kk, knopf("links", "Drehen", () => objDrehen(o, 1, true)), knopf("rechts", "Andersherum drehen", () => objDrehen(o, -1, true)),
        knopf("versetzen", "Versetzen", () => hausVersetzen(o)));
      /* FASSUNG 822 — XANDER: „durch den Tipp in den Einstellungen so festlegen kann, sobald ich eins antippe und es hat Arbeit
         frei dann fängt es sofort an weiter zu produzieren". Die Einstellung des Spiels („Ein Tipp produziert", Fassung 817)
         auch hier am Haus: ein Tipp schaltet sie (das Spiel merkt sie, dma_ls_direkt) – an = Blitz gelb. */
      /* FASSUNG 844 — XANDER (Walkie 313): „ich weiß allerdings nicht wofür der Blitz in bearbeiten Menü ist". Der Blitz ist
         jetzt eine eigene, beschriftete Zeile unter den Knöpfen: „Ein Tipp produziert sofort: an/aus" – an = ein Tipp aufs
         Haus startet gleich die Arbeit (die Mühle mahlt, die Bergleute gehen los), aus = ein Tipp zeigt erst die kleinen
         Symbole. Dieselbe Einstellung wie „Ein Tipp produziert" unter dem Bild. */
      const an = document.body.classList.contains("lk-direkt");
      const blitz = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2.5 5 13.5h6l-1.5 8 8.5-11h-6z" fill="currentColor"/></svg>';
      const dText = (x) => blitz + "<span>Ein Tipp produziert sofort: <b>" + (x ? "an" : "aus") + "</b></span>";
      const dk = el("button", "lk-direkt-zeile" + (an ? " lk-an" : ""), dText(an)); dk.type = "button";
      dk.title = "An: ein Tipp aufs Haus startet gleich die Arbeit. Aus: ein Tipp zeigt erst die kleinen Symbole am Haus.";
      dk.addEventListener("click", (e) => {
        e.stopPropagation();
        const neu = !document.body.classList.contains("lk-direkt");
        try { window.parent.postMessage({ typ: "leicht-direkt", an: neu }, location.origin); } catch (x) {}
        document.body.classList.toggle("lk-direkt", neu);
        dk.classList.toggle("lk-an", neu); dk.setAttribute("aria-pressed", String(neu)); dk.innerHTML = dText(neu);
      });
      dk.setAttribute("aria-pressed", String(an));
      if (o.platzX != null && (Math.abs(o.x - o.platzX) > 0.01 || Math.abs(o.y - o.platzY) > 0.01))
        knoepfe.append(knopf("zurueck", "Zurück auf den Bauplatz", () => { o.x = o.platzX; o.y = o.platzY; o.dreh = o.platzDreh; SZ.geaendert(); miniMalen(); L().dekoSpeichern(); ansage("Wieder auf dem Bauplatz"); karteZeigen("haus", o, null, { still: true }); }));
      if (vwKey) knoepfe.append(vwKnopf());   // FASSUNG 833 — das Rathaus (Döbeln) ist auch Sehenswürdigkeit
      knoepfe.append(zu);
      karte.appendChild(dk);   // FASSUNG 844 — die beschriftete Blitz-Zeile unter den Knöpfen
      amDingLegen();
      return;
    }
    /* FASSUNG 822 — ein Baum der Stadt: Versetzen, Entfernen (im kleinen Rahmen dazu die Wald-Station) */
    if (o.art === "natur") {
      titel.textContent = baumName(o);
      /* FASSUNG 812 — zusammen mit 826 (XANDER: „bestehende Bäume … fällen und Platz haben für Gebäude"): ein Menü für Bäume */
      /* FASSUNG 844 — im kleinen Rahmen kürzer: das Menü bleibt schmal genug, dass es Kompass, Uhr und Schieber nicht deckt */
      zeile.textContent = document.body.classList.contains("lk-mini-modus") ? "Entfernen schafft Platz" : (o.rand ? "Baum am Waldrand" : "Baum") + " · steht im Weg? Entfernen schafft Platz zum Bauen.";
      knoepfe.append(knopf("versetzen", "Versetzen", () => hausVersetzen(o)), knopf("abriss", "Entfernen", () => baumEntfernen(o)));
      /* FASSUNG 833 — die Wald-Station (Holzfäller und Jäger losschicken) auch im Vollbild des Spiels */
      if (window.parent !== window && !O.gestalten) knoepfe.append(knopf("liste", "Wald: Holzfäller und Jäger", () => { auswahlWeg(); try { window.parent.postMessage({ typ: "leicht-haus", g: "wald" }, location.origin); } catch (e) {} }));
      knoepfe.append(zu);
      amDingLegen();
      return;
    }
    if (o.art === "haus") {
      const aktualisieren = () => {
        if (karte.hidden || SZ.auswahl !== o) return false;
        if (o.bau && o.bau.bis) {
          const rest = o.bau.bis - Date.now();
          zeile.innerHTML = '<div class="lk-balken"><i style="width:' + Math.round(Math.max(0, Math.min(1, 1 - rest / o.bau.dauer)) * 100) + '%"></i></div><span>' + (o.bau.stufe > 1 ? "Ausbau auf Stufe " + o.bau.stufe : "Im Bau") + " · noch " + zeitText(rest) + "</span>";
        } else zeile.textContent = "Stufe " + (o.stufenZahl || 1) + " von 3";
        return true;
      };
      aktualisieren();
      karte._uhr = aktualisieren;
      /* FASSUNG 822 — aus „Bauen" für ein Haus, das es schon gibt: klar sagen, dass kein zweites entsteht, und Versetzen anbieten */
      if (opt.schonDa) {
        const hinweis = el("div", "lk-schon-hinweis");
        hinweis.textContent = "Hast du schon – ein zweites Gebäude „" + o.name + "“ geht im Spiel nicht. Versetzen?";
        karte.insertBefore(hinweis, knoepfe);
        const vs = el("button", "lk-text-knopf lk-versetzen-text", SYM.versetzen + "<span>Versetzen</span>"); vs.type = "button"; vs.title = "Versetzen";
        vs.addEventListener("click", (e) => { e.stopPropagation(); hausVersetzen(o); });
        knoepfe.append(vs);
      }
      if (o.bau) {
        const h = el("button", "lk-text-knopf", SYM.hammer + "<span>Helfen</span>"); h.type = "button";
        h.addEventListener("click", (e) => { e.stopPropagation(); aktion(() => ST.spiel.helfen(o.spiel), "Geholfen – 15 s schneller"); });
        if (ST.spiel.beispiel) h.disabled = true;
        knoepfe.append(h);
      } else if ((o.stufenZahl || 1) < 3) {
        /* FASSUNG 795 — Ausbau direkt am Haus (dieselbe Serverfunktion wie im Spiel) */
        const a = el("button", "lk-text-knopf", SYM.hammer + "<span>Ausbauen</span>"); a.type = "button";
        a.addEventListener("click", (e) => { e.stopPropagation(); aktion(() => ST.spiel.bauen(o.spiel), o.name + " wird ausgebaut", a); });
        if (ST.spiel.beispiel) { a.disabled = true; a.title = "In der Beispielstadt wird nicht gebaut – bitte anmelden"; }
        knoepfe.append(a);
      }
      knoepfe.append(knopf("links", "Drehen", () => objDrehen(o, 1, true)), knopf("rechts", "Andersherum drehen", () => objDrehen(o, -1, true)));
      if (!opt.schonDa) knoepfe.append(knopf("versetzen", "Versetzen", () => hausVersetzen(o)));
      if (o.platzX != null && (Math.abs(o.x - o.platzX) > 0.01 || Math.abs(o.y - o.platzY) > 0.01 || o.dreh !== o.platzDreh))
        knoepfe.append(knopf("zurueck", "Zurück auf den Bauplatz", () => { o.x = o.platzX; o.y = o.platzY; o.dreh = o.platzDreh; SZ.geaendert(); miniMalen(); L().dekoSpeichern(); ansage("Wieder auf dem Bauplatz"); karteZeigen("haus", o, null, { still: true }); }));
      if (vwKey) knoepfe.append(vwKnopf());   // FASSUNG 833
      knoepfe.append(zu);
      amDingLegen();
      return;
    }
    if (o.art === "eigen") {
      zeile.textContent = "Dein Schmuck";
      /* FASSUNG 815 — ein abgestelltes eigenes Auto kann wieder losfahren */
      const auto = SCHMUCK.find((x) => x[6] && x[1] === o.bild);
      if (auto && ST.autos && ST.autos.hat(auto[6])) {
        zeile.textContent = "Dein Auto – abgestellt";
        const los = el("button", "lk-text-knopf", "<span>Losfahren</span>"); los.type = "button";
        los.addEventListener("click", (e) => { e.stopPropagation(); SZ.auswahl = null; karte.hidden = true; losfahrenVonDeko(auto[6], o); });
        knoepfe.append(los);
      }
      knoepfe.append(knopf("links", "Drehen", () => objDrehen(o, 1, true)), knopf("rechts", "Andersherum drehen", () => objDrehen(o, -1, true)),
        knopf("versetzen", "Versetzen", () => { SZ.weg(o); geist = SZ.neu(Object.assign({}, o, { geist: true })); karteZeigen("setzen", geist); grossHeraus(geist); }),
        knopf("abriss", "Entfernen", () => { SZ.weg(o); L().dekoSpeichern(); karte.hidden = true; karte._ding = null; miniMalen(); L().unruhe = 2; }));
      /* FASSUNG 828 — ein eigener Baum schickt im Spiel auch aus seiner Karte die Holzfäller los */
      if (istBaum(o) && window.parent !== window) {
        const hf = el("button", "lk-text-knopf", "<span>Holzfäller</span>"); hf.type = "button"; hf.title = "Holzfäller in den Wald schicken";
        hf.addEventListener("click", (e) => { e.stopPropagation(); baumTun(o); });
        knoepfe.append(hf);
      }
      if (vwKey) knoepfe.append(vwKnopf());   // FASSUNG 833 — Rathaus Döbeln, Kolosseum als Schmuck
      knoepfe.append(zu);
      amDingLegen();
      return;
    }
    /* FASSUNG 826 — XANDER: „die sollen frei aufstellbar sein … Wir haben ja eine große Map". Wahrzeichen lassen sich
       drehen und versetzen wie die Häuser (gemerkt in L.lage mit Weltlage), „Zurück" stellt sie auf ihren Wahrzeichenplatz. */
    if (o.art === "wunder") {
      zeile.textContent = "Wahrzeichen – frei aufstellbar";
      knoepfe.append(knopf("links", "Drehen", () => objDrehen(o, 1, true)), knopf("rechts", "Andersherum drehen", () => objDrehen(o, -1, true)),
        knopf("versetzen", "Versetzen", () => hausVersetzen(o)));
      if (o.platzX != null && (Math.abs(o.x - o.platzX) > 0.01 || Math.abs(o.y - o.platzY) > 0.01 || o.dreh !== o.platzDreh))
        knoepfe.append(knopf("zurueck", "Zurück auf den Wahrzeichenplatz", () => { o.x = o.platzX; o.y = o.platzY; o.dreh = o.platzDreh; SZ.geaendert(); L().dekoSpeichern(); L().aufbauen(); ansage("Wieder auf dem Wahrzeichenplatz"); karte.hidden = true; }));
      if (vwKey) knoepfe.append(vwKnopf());   // FASSUNG 833
      knoepfe.append(zu);
      return;
    }
    zeile.textContent = vwKey === "bootsverleih" ? "Tretboote am See – für Gäste" : "Gehört zum Dorf";
    if (vwKey) knoepfe.append(vwKnopf());   // FASSUNG 833 — der Bootsverleih
    knoepfe.append(zu);
    amDingLegen();
  }
  /* FASSUNG 823 — das Bahnhof-Fenster des Spiels liegt im Vollbild über der Stadt (unten bzw. quer rechts). Das Spiel sagt,
     wie viel es verdeckt; liegt der Bahnhof dahinter, fährt die Stadt ihn in den freien Teil – er bleibt zu sehen. */
  window.addEventListener("message", (ev) => {
    if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-frei") return;
    /* FASSUNG 833 — auch die Station eines Hauses liegt im Vollbild als Fenster über der Stadt: das kleine Menü am Haus
       bleibt im freien Teil (amDingLegen), das Haus rückt dorthin */
    O.freiRaum = { unten: Math.max(0, +ev.data.unten || 0), rechts: Math.max(0, +ev.data.rechts || 0) };
    if (karte) karte._schl = "";
    if (!ev.data.g) return;
    const b = SZ.objekte.find((x) => x.spiel === ev.data.g) || SZ.objekte.find((x) => x.bild === "k_" + ev.data.g);
    if (!b) return;
    const dpr = K.dpr, W = K.W - Math.max(0, +ev.data.rechts || 0) * dpr, H = K.H - Math.max(0, +ev.data.unten || 0) * dpr, oben = 56 * dpr;
    const P = ST.proj(b.x, b.y, (b.hoehe || 10) * 0.4), rand = 30 * dpr;
    if (P[0] > rand && P[0] < W - rand && P[1] > oben + rand && P[1] < H - rand) return;
    const a = ST.aufBoden(P[0], P[1]), t = ST.aufBoden(W / 2, (oben + H) / 2);
    L().fliegeZu(K.x + a[0] - t[0], K.y + a[1] - t[1], K.s, 500);
  });
  /* FASSUNG 833 — XANDER (Funk 255): „wenn ich das anklicke dann habe ich niemals irgendwie so ein responsives Feedback
     oder irgend so ein haptisches Feedback wie ich das bei den anderen Sachen habe … manchmal drücke ich da fünfmal drauf
     und wenn mir gar nicht sicher ob ich das jetzt gekauft habe". Bisher kam die Ansage erst mit der Antwort des Servers,
     der Knopf blieb so lange drückbar. Jetzt sofort: Klopfen, kurzes Zittern, der Knopf zeigt „… läuft" mit Uhr und ist
     gesperrt; ein zweiter Tipp in der Zeit zittert nur. Danach zwei Hammerschläge und doppeltes Zittern – oder der Knopf
     ist wieder wie vorher, mit dem Grund. */
  let aktionLaeuft = false;
  function aktion(fn, text, knopf) {
    /* gesperrt wird nur Bauen/Ausbauen (mit Knopf); „Helfen" darf man schnell hintereinander tippen */
    if (knopf && aktionLaeuft) { O.summen(); return; }
    if (knopf) aktionLaeuft = true;
    O.summen();
    try { if (ST.ton && ST.ton.klopf) ST.ton.klopf(0.55, 0, 0); } catch (e) {}
    const vorher = knopf ? knopf.innerHTML : null;
    if (knopf) {
      knopf.disabled = true; knopf.classList.add("lk-laeuft");
      knopf.innerHTML = '<span class="lk-bau-uhr" aria-hidden="true"></span><span>' + (/ausgebaut$/.test(text) ? "wird ausgebaut …" : "wird gebaut …") + "</span>";
    }
    const frei = (gut) => {
      if (knopf) aktionLaeuft = false;
      if (knopf && knopf.isConnected) {
        knopf.classList.remove("lk-laeuft");
        if (gut) { knopf.classList.add("lk-fertig"); knopf.innerHTML = "<span>✓ " + text + "</span>"; }
        else { knopf.innerHTML = vorher; knopf.disabled = false; }
      }
    };
    fn().then((r) => {
      frei(true);
      try { if (navigator.vibrate) navigator.vibrate([20, 60, 30]); } catch (e) {}
      try { if (ST.ton && ST.ton.klopf) { ST.ton.klopf(0.7, 0, 0.05); ST.ton.klopf(0.7, 0, 0.32); } } catch (e) {}
      ansage(text);
      return ST.spiel.neuLaden().then((ich) => { if (ich) L().ich = ich; L().aufbauen(); });
    }).catch((e) => { frei(false); ansage((e && (e.message || e.hint)) || "Geht gerade nicht"); });
  }

  /* je Bild: Laden-Vorhang, Baufortschritt der Uhr nach */
  let naechsteBauPruefung = 0;
  O.vorBild = function (jetzt) {
    if (jetzt > naechsteBauPruefung) {
      naechsteBauPruefung = jetzt + 1000;
      let fertig = false;
      for (const o of SZ.objekte) if (o.bau && o.bau.bis) {
        o.bau.p = Math.max(o.stufenZahl ? 0.72 : 0, Math.min(1, 1 - (o.bau.bis - Date.now()) / o.bau.dauer));
        if (o.bau.p >= 1) fertig = true;
      }
      if (karte && !karte.hidden && karte._uhr) karte._uhr();
      /* fertig gebaut: Stand neu holen (der Server schließt den Bau ab) */
      /* FASSUNG 822 — höchstens alle 10 s nachfragen, solange der Server den Bau noch nicht abgeschlossen hat (sonst baute
         die Stadt jede Sekunde neu auf – und ein offenes Menü wirkte auf ein Haus von vorhin) */
      if (fertig && !O._holt && jetzt > (O._holtWieder || 0)) { O._holt = true; O._holtWieder = jetzt + 10000; ST.spiel.neuLaden().then((ich) => { if (ich) L().ich = ich; L().aufbauen(); O._holt = false; }, () => { O._holt = false; }); }
    }
  };
  O.bild = function () {
    if (O.zeichenLegen) O.zeichenLegen();
    /* FASSUNG 844 — das Ladebild geht, sobald die Häuser stehen (alle sichtbaren Bilder da, spätestens nach 4 s) */
    const lade = document.getElementById("lLade");
    if (lade && !lade.classList.contains("weg")) {
      if (!O._ladeSeit) O._ladeSeit = performance.now();
      const hs = SZ.sichtbare.filter((e) => e.o.art === "haus" || e.o.art === "wunder"), da = hs.filter((e) => LB.fertig(e.lagen[0][0])).length;
      if ((hs.length && da >= hs.length * 0.85) || performance.now() - O._ladeSeit > 5000) { lade.classList.add("weg"); setTimeout(() => lade.remove(), 500); }
    }
    amDingLegen();   // FASSUNG 822 — das kleine Menü folgt seinem Ding
    if (deckel && deckel.isConnected) {
      const offen = LB.offen();
      const bar = deckel.querySelector("em");
      if (bar) bar.style.width = Math.max(8, 100 - offen * 3) + "%";
      /* FASSUNG 796 — nicht auf ALLE Bilder warten: nach spätestens 2,5 s
         (oder wenn alles da ist) geht der Vorhang auf; der Rest lädt sichtbar nach. */
      if (!O._vorhangSeit) O._vorhangSeit = performance.now();
      if (SZ.sichtbare.length && (offen === 0 || performance.now() - O._vorhangSeit > 2500)) { deckel.classList.add("weg"); setTimeout(() => deckel.remove(), 500); }
    }
  };
})();
