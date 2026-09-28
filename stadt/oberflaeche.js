/* =====================================================================
   BAUKASTEN-STADT — DIE BEDIENUNG
   ---------------------------------------------------------------------
   XANDER: „einmal können wir das dann als richtig große Bühne sehen …
   so drei Flächen oben, in der Mitte und drei darunter, so ein riesiges
   Quadrat, wo man das so absuchen kann … dass man diese kleine Map hat
   und dann dorthin springt."

   Aufbau (auch auf einem 360-px-Telefon ohne Überlappung):
     oben links   Name der Stadt
     oben rechts  Tageszeit · Jahreszeit · Karte drehen
     unten        Bauleiste: Reiter (Häuser, Weihnachten, Deko, Natur,
                  Boden) und Karten mit echten Vorschaubildern
     rechts unten Mini-Karte: 3 × 3 Bereiche, antippen = hinfliegen
   Platzieren: Karte antippen → das Gebäude hängt als Geist in der
   Mitte, mit dem Finger verschieben, drehen (jeder Winkel, 15°-Schritte
   oder frei mit dem Drehring), „Bauen". Antippen eines Gebäudes zeigt
   Drehen/Versetzen/Abreißen und den Baufortschritt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const K = ST.kamera, SZ = ST.szene, B = ST.boden;
  const O = (ST.oberflaeche = {});
  const wurzel = document.getElementById("stadtOberflaeche");

  /* ---------------- Gezeichnete Symbole (keine Emojis) ---------------- */
  const SYM = {
    sonne: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.6" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>',
    daemmerung: '<svg viewBox="0 0 24 24"><path d="M3 17h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 17a5.5 5.5 0 0 1 11 0z" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 6.5v2.2M4.8 10l1.6 1.4M19.2 10l-1.6 1.4"/></g><path d="M5 20.5h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".6"/></svg>',
    mond: '<svg viewBox="0 0 24 24"><path d="M15.5 3.2a8.8 8.8 0 1 0 5.3 13.4A7.2 7.2 0 0 1 15.5 3.2z" fill="currentColor"/><circle cx="18.5" cy="5" r=".9" fill="currentColor"/><circle cx="21" cy="9.5" r=".6" fill="currentColor"/></svg>',
    schnee: '<svg viewBox="0 0 24 24"><g stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.6 4.2 12 6.3l2.4-2.1M9.6 19.8 12 17.7l2.4 2.1M4.3 10.4l3.1-.6-1-3M19.7 13.6l-3.1.6 1 3M4.3 13.6l3.1.6-1 3M19.7 10.4l-3.1-.6 1-3"/></g></svg>',
    bluete: '<svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="12" cy="6.3" r="3.3"/><circle cx="17.4" cy="10.2" r="3.3"/><circle cx="15.4" cy="16.5" r="3.3"/><circle cx="8.6" cy="16.5" r="3.3"/><circle cx="6.6" cy="10.2" r="3.3"/></g><circle cx="12" cy="11.8" r="2.6" fill="#f3c33c"/></svg>',
    blatt: '<svg viewBox="0 0 24 24"><path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" fill="currentColor"/><path d="M5 19 14 10" stroke="#fff" stroke-width="1.3" opacity=".6"/></svg>',
    links: '<svg viewBox="0 0 24 24"><path d="M5.5 12a6.5 6.5 0 1 0 2-4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.2 3.8 7.6 7.6l-4.3.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rechts: '<svg viewBox="0 0 24 24"><path d="M18.5 12a6.5 6.5 0 1 1-2-4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.8 3.8 16.4 7.6l4.3.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    haken: '<svg viewBox="0 0 24 24"><path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kreuz: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    versetzen: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18"/><path d="m9 5.8 3-2.8 3 2.8M9 18.2l3 2.8 3-2.8M5.8 9 3 12l2.8 3M18.2 9 21 12l-2.8 3"/></g></svg>',
    abriss: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/></g></svg>',
    karte: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/></g></svg>',
    pinsel: '<svg viewBox="0 0 24 24"><path d="M14.5 4.5 19.5 9.5 11 18l-5-5z" fill="currentColor"/><path d="M6 13c-2.5 0-3 3-3 6 3 0 6-.5 6-3" fill="currentColor" opacity=".75"/></svg>',
    uhr: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 7v5l3.5 2.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>'
  };

  const ZEITEN = ["tag", "abend", "nacht"];
  const ZEIT_SYM = { tag: "sonne", abend: "daemmerung", nacht: "mond" };
  const JAHRE = ["winter", "fruehling", "sommer", "herbst"];
  const JAHR_NAME = { winter: "Winter", fruehling: "Frühling", sommer: "Sommer", herbst: "Herbst" };
  const JAHR_SYM = { winter: "schnee", fruehling: "bluete", sommer: "sonne", herbst: "blatt" };

  /* Bereiche der Stadt: 3 × 3 à 48 m */
  const BEREICHE = [
    ["Tannenwald", "Kirchberg", "Mühlbach"],
    ["Handwerkergasse", "Marktplatz", "Am Bach"],
    ["Obstwiesen", "Bahnhofstraße", "Seeufer"]
  ];
  O.BEREICHE = BEREICHE;
  const BG = 48;

  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function knopf(sym, titel, fn, cls) {
    const b = el("button", "st-knopf" + (cls ? " " + cls : ""), SYM[sym] || sym);
    b.type = "button"; b.title = titel; b.setAttribute("aria-label", titel);
    b.addEventListener("click", (e) => { e.stopPropagation(); fn(e); });
    return b;
  }

  /* ---------------- Zustand ---------------- */
  let modus = "schauen";         // schauen | platzieren | ausgewaehlt | malen
  let malArt = null, malGroesse = 1.4;
  let leiste, reiterZeile, kartenZeile, steuerung, minikarte, miniC, info, kopf;
  let reiterAktiv = null;

  /* ---------------- Aufbau ---------------- */
  O.start = function () {
    kopf = el("div", "st-kopf");
    const name = el("div", "st-name", "<b>" + (localStorage.getItem("stadt_name") || "Winterhausen") + "</b><span>Baukasten-Stadt</span>");
    name.addEventListener("click", () => {
      const n = prompt("Wie soll deine Stadt heißen?", localStorage.getItem("stadt_name") || "Winterhausen");
      if (n && n.trim()) { try { localStorage.setItem("stadt_name", n.trim().slice(0, 28)); } catch (e) {} name.querySelector("b").textContent = n.trim().slice(0, 28); }
    });
    kopf.appendChild(name);
    const rechts = el("div", "st-kopf-rechts");
    const zeitK = knopf(ZEIT_SYM[SZ.zeit], "Tageszeit", () => { SZ.zeit = ZEITEN[(ZEITEN.indexOf(SZ.zeit) + 1) % 3]; zeitK.innerHTML = SYM[ZEIT_SYM[SZ.zeit]]; ansage(ST.ZEITEN[SZ.zeit].name); speichernSpaeter(); vorschauenNeu(); });
    const jahrK = knopf(JAHR_SYM[SZ.jahr], "Jahreszeit", () => { SZ.jahr = JAHRE[(JAHRE.indexOf(SZ.jahr) + 1) % 4]; jahrK.innerHTML = SYM[JAHR_SYM[SZ.jahr]]; ansage(JAHR_NAME[SZ.jahr]); speichernSpaeter(); vorschauenNeu(); });
    const dl = knopf("links", "Karte nach links drehen", () => kameraDrehen(1));
    const dr = knopf("rechts", "Karte nach rechts drehen", () => kameraDrehen(-1));
    rechts.append(zeitK, jahrK, dl, dr);
    kopf.appendChild(rechts);
    wurzel.appendChild(kopf);

    /* Mini-Karte */
    minikarte = el("div", "st-mini");
    miniC = el("canvas"); minikarte.appendChild(miniC);
    const gitter = el("div", "st-mini-gitter");
    BEREICHE.forEach((zeile, j) => zeile.forEach((n, i) => {
      const f = el("button", "st-mini-feld", "<span>" + n + "</span>");
      f.type = "button";
      f.addEventListener("click", (e) => { e.stopPropagation(); ST.fliegeZu((i - 1) * BG, (j - 1) * BG, Math.max(K.s, 14 * K.dpr), 900); ansage(n); });
      gitter.appendChild(f);
    }));
    minikarte.appendChild(gitter);
    /* Klapp-Knopf ÜBER der Karte, nicht darauf – sonst verdeckt er ein Feld */
    const rahmen = el("div", "st-mini-rahmen");
    const miniZu = knopf("karte", "Karte ein- und ausklappen", () => { minikarte.classList.toggle("zu"); rahmen.classList.toggle("zu"); }, "st-mini-schalter");
    rahmen.append(miniZu, minikarte);
    wurzel.appendChild(rahmen);

    /* Bauleiste */
    leiste = el("div", "st-leiste");
    reiterZeile = el("div", "st-reiter");
    kartenZeile = el("div", "st-karten");
    leiste.append(reiterZeile, kartenZeile);
    wurzel.appendChild(leiste);
    reiterBauen();

    /* Steuerung beim Platzieren / Auswählen */
    steuerung = el("div", "st-steuer"); steuerung.hidden = true;
    wurzel.appendChild(steuerung);
    info = el("div", "st-ansage"); wurzel.appendChild(info);
  };

  function kameraDrehen(r) {
    /* um die Bildmitte drehen: die Mitte bleibt, wo sie ist */
    K.dreh = (K.dreh + r + 4) & 3;
    ansage("Blick nach " + ["Nordwesten", "Südwesten", "Südosten", "Nordosten"][K.dreh]);
  }

  let ansageZeit = 0;
  function ansage(t) { info.textContent = t; info.classList.add("an"); ansageZeit = performance.now(); }
  O.ansage = ansage;

  /* ---------------- Gruppen und Karten ---------------- */
  const GRUPPEN = [
    { id: "Häuser", name: "Häuser" },
    { id: "Weihnachten", name: "Weihnachten" },
    { id: "Deko", name: "Deko" },
    { id: "Natur", name: "Natur" },
    { id: "Wahrzeichen", name: "Wahrzeichen" },
    { id: "Boden", name: "Boden" }
  ];
  const BODEN_WERKZEUGE = [
    { art: 3, name: "Rasen", farbe: "#5f8d3a" },
    { art: 0, name: "Pflasterweg", farbe: "#9c948a" },
    { art: 1, name: "Bachlauf", farbe: "#3f7f94" },
    { art: 2, name: "Beet", farbe: "#5b4330" },
    { art: -1, name: "Radierer", farbe: "#d8d2c8" }
  ];

  function reiterBauen() {
    reiterZeile.innerHTML = "";
    const vorhanden = new Set(Object.values(ST.MODELLE).filter((d) => !d.versteckt).map((d) => d.gruppe));
    for (const gr of GRUPPEN) {
      if (gr.id !== "Boden" && !vorhanden.has(gr.id)) continue;
      const r = el("button", "st-reiter-k", gr.name);
      r.type = "button";
      r.addEventListener("click", (e) => { e.stopPropagation(); reiterWaehlen(gr.id); });
      r.dataset.gruppe = gr.id;
      reiterZeile.appendChild(r);
    }
  }
  function reiterWaehlen(id) {
    if (reiterAktiv === id) { reiterAktiv = null; kartenZeile.innerHTML = ""; leiste.classList.remove("offen"); wurzel.classList.remove("leiste-offen"); markieren(); return; }
    reiterAktiv = id; leiste.classList.add("offen"); wurzel.classList.add("leiste-offen"); markieren();
    kartenZeile.innerHTML = "";
    if (id === "Boden") {
      for (const w of BODEN_WERKZEUGE) {
        const k = el("button", "st-karte st-karte-boden", '<i style="background:' + w.farbe + '"></i><span>' + w.name + "</span>");
        k.type = "button";
        k.addEventListener("click", (e) => { e.stopPropagation(); malenStart(w, k); });
        kartenZeile.appendChild(k);
      }
      return;
    }
    const liste = Object.values(ST.MODELLE).filter((d) => d.gruppe === id && !d.versteckt);
    for (const d of liste) {
      const k = el("button", "st-karte", '<img alt=""><span>' + d.name + "</span>");
      k.type = "button";
      k.addEventListener("click", (e) => { e.stopPropagation(); platzierenStart(d.id); });
      kartenZeile.appendChild(k);
      vorschau(d.id).then((url) => { const im = k.querySelector("img"); if (im && url) im.src = url; });
    }
  }
  function markieren() { for (const r of reiterZeile.children) r.classList.toggle("an", r.dataset.gruppe === reiterAktiv); }

  /* Vorschaubild eines Modells: wirklich gemalt, wie es in der Stadt steht */
  const VORSCHAU = {};
  function vorschau(id) {
    const schl = id + "|" + SZ.jahr + "|" + SZ.zeit;
    if (VORSCHAU[schl]) return VORSCHAU[schl];
    VORSCHAU[schl] = new Promise((ok) => {
      setTimeout(() => {
        try {
          const d = ST.MODELLE[id];
          const gross = Math.max(d.grund[0], d.grund[1]) + (d.hoehe || 8) * 0.9;
          const s = Math.min(18, 150 / gross) * K.dpr;
          const sp = ST.spriteMalen(id, { jahr: SZ.jahr, bau: 1, saat: 7, schluessel: "v" }, 30, s, Object.assign({ name: SZ.zeit }, ST.ZEITEN[SZ.zeit === "nacht" ? "abend" : SZ.zeit]), 1);
          const c = document.createElement("canvas");
          const W = 160 * K.dpr, H = 120 * K.dpr; c.width = W; c.height = H;
          const g = c.getContext("2d");
          const k = Math.min(W / sp.W, H / sp.H, 1) * 0.95;
          g.drawImage(sp.bild, (W - sp.W * k) / 2, (H - sp.H * k) / 2, sp.W * k, sp.H * k);
          ok(c.toDataURL("image/png"));
        } catch (e) { console.error(e); ok(null); }
      }, 30);
    });
    return VORSCHAU[schl];
  }
  function vorschauenNeu() { if (reiterAktiv && reiterAktiv !== "Boden") { const a = reiterAktiv; reiterAktiv = null; reiterWaehlen(a); } }

  /* ---------------- Platzieren ---------------- */
  function platzierenStart(id) {
    abbrechen();
    const m = ST.aufBoden(K.W / 2, K.H * 0.55);
    const d = ST.MODELLE[id];
    SZ.geist = { id: -1, typ: id, x: runden(m[0]), y: runden(m[1]), gier: d.standardGier || 0, saat: (Math.random() * 1e9) | 0, bau: null, frei: true };
    SZ.auswahl = SZ.geist;
    modus = "platzieren";
    geistPruefen();
    steuerungZeigen();
    ansage(d.name + ": verschieben, drehen, dann bauen");
  }
  function runden(v) { return Math.round(v * 4) / 4; }
  function geistPruefen() { if (SZ.geist) SZ.geist.frei = SZ.passt(SZ.geist.typ, SZ.geist.x, SZ.geist.y, SZ.geist.gier, SZ.geist.verschiebt || null); }

  function bauen() {
    const g = SZ.geist; if (!g) return;
    geistPruefen();
    if (!g.frei) { ansage("Hier ist kein Platz"); return; }
    const d = ST.MODELLE[g.typ];
    if (g.verschiebt) {
      const o = g.verschiebt; o.x = g.x; o.y = g.y; o.gier = g.gier; o.versteckt = false;
      SZ.geist = null; SZ.auswahl = o; modus = "ausgewaehlt"; steuerungZeigen(); speichernSpaeter(); return;
    }
    const o = SZ.neu(g.typ, g.x, g.y, g.gier, { saat: g.saat });
    if (d.bauzeit && !sofort) o.bau = { start: performance.now(), dauer: d.bauzeit };
    SZ.geist = null; SZ.auswahl = o; modus = "ausgewaehlt";
    steuerungZeigen();
    ansage(d.bauzeit && !sofort ? d.name + ": Baustelle eingerichtet" : d.name + " steht");
    if (O.ton) O.ton(d.bauzeit && !sofort ? "hammerschlag" : "aufsetzen");
    speichernSpaeter();
  }
  let sofort = false;

  function abbrechen() {
    if (SZ.geist && SZ.geist.verschiebt) SZ.geist.verschiebt.versteckt = false;
    SZ.geist = null; if (modus !== "malen") SZ.auswahl = null;
    modus = "schauen"; malArt = null; steuerung.hidden = true; wurzel.classList.remove("steuer-offen");
    for (const k of kartenZeile.querySelectorAll(".an")) k.classList.remove("an");
  }

  /* Drehen: Knöpfe um 15°, Drehring frei */
  function drehen(obj, grad) {
    obj.gier = ((obj.gier + grad) % 360 + 360) % 360;
    if (obj === SZ.geist) geistPruefen(); else speichernSpaeter();
  }

  function steuerungZeigen() {
    steuerung.innerHTML = "";
    steuerung.hidden = false;
    wurzel.classList.add("steuer-offen");
    const o = SZ.auswahl;
    if (modus === "platzieren" && SZ.geist) {
      const d = ST.MODELLE[SZ.geist.typ];
      steuerung.append(
        el("div", "st-steuer-titel", d.name),
        knopf("links", "15° nach links drehen", () => drehen(SZ.geist, -15)),
        drehring(SZ.geist),
        knopf("rechts", "15° nach rechts drehen", () => drehen(SZ.geist, 15)),
        knopf("kreuz", "Abbrechen", abbrechen, "st-nein"),
        knopf("haken", SZ.geist.verschiebt ? "Hier hinstellen" : "Bauen", bauen, "st-ja")
      );
      if (d.bauzeit && !SZ.geist.verschiebt) {
        const sw = el("label", "st-sofort", '<input type="checkbox"' + (sofort ? " checked" : "") + '> sofort fertig');
        sw.querySelector("input").addEventListener("change", (e) => { sofort = e.target.checked; });
        steuerung.appendChild(sw);
      }
    } else if (modus === "ausgewaehlt" && o) {
      const d = ST.MODELLE[o.typ];
      const titel = el("div", "st-steuer-titel", d.name);
      steuerung.append(titel,
        knopf("links", "15° nach links drehen", () => drehen(o, -15)),
        drehring(o),
        knopf("rechts", "15° nach rechts drehen", () => drehen(o, 15)),
        knopf("versetzen", "Versetzen", () => { SZ.geist = { id: -1, typ: o.typ, x: o.x, y: o.y, gier: o.gier, saat: o.saat, bau: o.bau, verschiebt: o, frei: true }; SZ.auswahl = SZ.geist; modus = "platzieren"; o.versteckt = true; steuerungZeigen(); }),
        knopf("abriss", "Abreißen", () => { SZ.weg(o); abbrechen(); speichernSpaeter(); ansage(d.name + " abgerissen"); }, "st-nein"),
        knopf("haken", "Fertig", abbrechen, "st-ja")
      );
      if (o.bau) {
        const bz = el("div", "st-bau");
        bz.innerHTML = '<div class="st-bau-balken"><i></i></div><span></span><div class="st-raffer"></div>';
        for (const f of [1, 10, 60]) {
          const b = el("button", "st-raffer-k" + (SZ.zeitraffer === f ? " an" : ""), "×" + f);
          b.type = "button";
          b.addEventListener("click", (e) => { e.stopPropagation(); rafferSetzen(f); for (const x of bz.querySelectorAll(".st-raffer-k")) x.classList.toggle("an", x === b); });
          bz.querySelector(".st-raffer").appendChild(b);
        }
        steuerung.appendChild(bz);
      }
    } else if (modus === "malen") {
      steuerung.append(el("div", "st-steuer-titel", malArt.name + " – mit dem Finger malen"));
      const r = el("input"); r.type = "range"; r.min = "0.6"; r.max = "4"; r.step = "0.1"; r.value = malGroesse; r.className = "st-regler";
      r.addEventListener("input", () => { malGroesse = +r.value; });
      steuerung.append(el("span", "st-klein", "Pinsel"), r, knopf("haken", "Fertig", abbrechen, "st-ja"));
    } else { steuerung.hidden = true; wurzel.classList.remove("steuer-offen"); }
  }

  /* Zeitraffer umstellen, ohne dass Baustellen springen */
  function rafferSetzen(f) {
    const jetzt = performance.now();
    for (const o of SZ.objekte) if (o.bau && o.bau.fest == null) { o.bau.vorher = SZ.fortschritt(o, jetzt); o.bau.start = jetzt; }
    SZ.zeitraffer = f;
  }

  /* Drehring: kleiner Kreis, mit dem Finger drehen = jeder Winkel */
  function drehring(obj) {
    const r = el("div", "st-drehring", '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="2.4" opacity=".55"/><circle class="st-dr-punkt" cx="20" cy="5" r="4.2" fill="currentColor"/></svg><b></b>');
    r.title = "Drehen: am Ring ziehen";
    const zeig = () => { const p = r.querySelector(".st-dr-punkt"); const a = (obj.gier - 90) * Math.PI / 180; p.setAttribute("cx", 20 + Math.cos(a) * 15); p.setAttribute("cy", 20 + Math.sin(a) * 15); r.querySelector("b").textContent = Math.round(obj.gier) + "°"; };
    zeig();
    let aktiv = false;
    const winkel = (e) => { const b = r.getBoundingClientRect(); return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180 / Math.PI + 90; };
    r.addEventListener("pointerdown", (e) => { e.stopPropagation(); aktiv = true; r.setPointerCapture(e.pointerId); });
    r.addEventListener("pointermove", (e) => { if (!aktiv) return; let w = winkel(e); w = e.shiftKey ? Math.round(w / 15) * 15 : Math.round(w); obj.gier = (w + 360) % 360; if (obj === SZ.geist) geistPruefen(); zeig(); });
    r.addEventListener("pointerup", () => { aktiv = false; if (obj !== SZ.geist) speichernSpaeter(); });
    r._zeig = zeig;
    return r;
  }

  /* ---------------- Boden malen ---------------- */
  function malenStart(w, karte) {
    abbrechen();
    malArt = w; modus = "malen";
    karte.classList.add("an");
    steuerungZeigen();
    ansage(w.name + ": mit dem Finger über die Karte streichen");
  }
  let letzterMalPunkt = null;
  function malePunkt(px, py) {
    const p = ST.aufBoden(px, py);
    const pts = letzterMalPunkt ? [letzterMalPunkt, p] : [p, p];
    if (malArt.art < 0) { for (let a = 0; a < 4; a++) B.linie(pts, malGroesse, a, 0); }
    else B.linie(pts, malArt.art === 1 ? (i, k) => malGroesse * (0.85 + 0.3 * ST.rausch(p[0] * 0.3 + k, p[1] * 0.3, 4)) : malGroesse, malArt.art, 1);
    letzterMalPunkt = p;
  }

  /* ---------------- Zeiger (von start.js) ---------------- */
  let geistZiehen = null;
  O.zeigerRunter = function (e, p) {
    letzterMalPunkt = null;
    if (modus === "platzieren" && SZ.geist) {
      /* Tipp auf den Geist → ziehen; sonst Kamera */
      const g = ST.proj(SZ.geist.x, SZ.geist.y, 0);
      const d = ST.MODELLE[SZ.geist.typ];
      const r = Math.max(d.grund[0], d.grund[1]) * K.s * 0.8 + 30 * K.dpr;
      if (Math.hypot(p.x - g[0], p.y - (g[1] - (d.hoehe || 6) * 0.3 * K.s)) < r) geistZiehen = { dx: g[0] - p.x, dy: g[1] - p.y };
    }
    if (modus === "malen") malePunkt(p.x, p.y);
  };
  O.zeigerZiehen = function (e, neu) {
    if (modus === "malen") { malePunkt(neu.x, neu.y); return true; }
    if (geistZiehen && SZ.geist) {
      const w = ST.aufBoden(neu.x + geistZiehen.dx, neu.y + geistZiehen.dy);
      SZ.geist.x = runden(w[0]); SZ.geist.y = runden(w[1]);
      geistPruefen();
      return true;
    }
    return false;
  };
  O.zeigerHoch = function (e, gezogen) {
    if (modus === "malen" && letzterMalPunkt) speichernSpaeter();
    geistZiehen = null; letzterMalPunkt = null;
  };
  O.tippen = function (px, py) {
    if (modus === "malen") return;
    if (modus === "platzieren" && SZ.geist) {
      const w = ST.aufBoden(px, py);
      SZ.geist.x = runden(w[0]); SZ.geist.y = runden(w[1]); geistPruefen();
      return;
    }
    const o = SZ.treffer(px, py);
    if (o) { SZ.auswahl = o; modus = "ausgewaehlt"; steuerungZeigen(); if (O.ton) O.ton("holzklopf"); }
    else if (modus === "ausgewaehlt") abbrechen();
  };

  /* ---------------- Jedes Bild ---------------- */
  let miniZeit = 0;
  O.bild = function (jetzt) {
    if (!info) return;
    if (info.classList.contains("an") && jetzt - ansageZeit > 2200) info.classList.remove("an");
    /* versetztes Original verstecken */
    if (modus === "ausgewaehlt" && SZ.auswahl && SZ.auswahl.bau) {
      const p = SZ.fortschritt(SZ.auswahl, jetzt);
      const bz = steuerung.querySelector(".st-bau");
      if (bz) {
        bz.querySelector("i").style.width = (p * 100).toFixed(1) + "%";
        const rest = SZ.auswahl.bau.dauer * (1 - p) / SZ.zeitraffer;
        bz.querySelector("span").textContent = p >= 1 ? "Fertig gebaut" : bauPhase(p) + " · noch " + Math.floor(rest / 60) + ":" + String(Math.floor(rest % 60)).padStart(2, "0");
      }
    }
    for (const o of SZ.objekte) if (o.bau && o.bau.fest == null && SZ.fortschritt(o, jetzt) >= 1) { o.bau = null; if (O.ton) O.ton("jubel"); ansage(ST.MODELLE[o.typ].name + " ist fertig gebaut"); speichernSpaeter(); }
    if (jetzt - miniZeit > 400) { miniZeit = jetzt; miniMalen(); }
  };
  function bauPhase(p) {
    if (p < 0.12) return "Baugrube";
    if (p < 0.22) return "Fundament";
    if (p < 0.32) return "Sockel";
    if (p < 0.6) return "Fachwerk Erdgeschoss";
    if (p < 0.72) return "Obergeschoss";
    if (p < 0.8) return "Dachstuhl";
    if (p < 0.9) return "Dach decken";
    return "Fenster und Türen";
  }
  O.bauPhase = bauPhase;

  /* ---------------- Mini-Karte ---------------- */
  function miniMalen() {
    if (!miniC || minikarte.classList.contains("zu")) return;
    const bw = minikarte.clientWidth, bh = minikarte.clientHeight;
    if (!bw) return;
    const W = Math.round(bw * K.dpr), H = Math.round(bh * K.dpr);
    if (miniC.width !== W || miniC.height !== H) { miniC.width = W; miniC.height = H; }
    const g = miniC.getContext("2d");
    const G = B.GROESSE, k = W / G;
    /* Boden aus der Karte: 2 m je Punkt */
    const winter = SZ.jahr === "winter";
    g.fillStyle = winter ? "#e9eef4" : "#6f8f45"; g.fillRect(0, 0, W, H);
    const n = 72, zelle = G / n;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = -G / 2 + (i + 0.5) * zelle, y = -G / 2 + (j + 0.5) * zelle;
      const w = B.wert(x, y, 1), p = B.wert(x, y, 0), r = B.wert(x, y, 3), be = B.wert(x, y, 2);
      let f = null;
      if (w > 0.4) f = winter ? "#8fb3c8" : "#3c7a93";
      else if (p > 0.4) f = winter ? "#b9b4ad" : "#a59d92";
      else if (be > 0.4) f = "#6b5038";
      else if (r > 0.4) f = winter ? "#dfe8ee" : "#7fa653";
      if (f) { g.fillStyle = f; g.fillRect(i * zelle * k, j * zelle * k, zelle * k + 0.6, zelle * k + 0.6); }
    }
    /* Gebäude als kleine Dächer */
    for (const o of SZ.objekte) {
      const d = ST.MODELLE[o.typ]; if (!d || o.versteckt) continue;
      const a = o.gier * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      const b2 = d.grund[0] / 2, t2 = d.grund[1] / 2;
      g.beginPath();
      [[-b2, -t2], [b2, -t2], [b2, t2], [-b2, t2]].forEach(([x, y], i) => { const X = (o.x + x * c - y * s + G / 2) * k, Y = (o.y + x * s + y * c + G / 2) * k; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); });
      g.closePath();
      g.fillStyle = d.gruppe === "Natur" ? "#2f5a34" : o.bau ? "#c8a060" : "#8c3b2a";
      g.fill();
    }
    /* Blickfeld */
    const ecken = [[0, 0], [K.W, 0], [K.W, K.H], [0, K.H]].map(([x, y]) => ST.aufBoden(x, y));
    g.beginPath();
    ecken.forEach(([x, y], i) => { const X = (x + G / 2) * k, Y = (y + G / 2) * k; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); });
    g.closePath();
    g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 1.6 * K.dpr; g.stroke();
    g.strokeStyle = "rgba(20,30,60,0.6)"; g.lineWidth = 0.8 * K.dpr; g.stroke();
  }

  /* ---------------- Speichern ---------------- */
  let speicherUhr = null;
  function speichernSpaeter() {
    clearTimeout(speicherUhr);
    speicherUhr = setTimeout(() => { try { localStorage.setItem("stadt_stand", SZ.alsText()); } catch (e) { console.warn(e); } }, 600);
  }
  O.speichernSpaeter = speichernSpaeter;
})();
