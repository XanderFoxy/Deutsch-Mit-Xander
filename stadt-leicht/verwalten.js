/* =====================================================================
   LEICHTE STADT — WAHRZEICHEN UND BOOTSVERLEIH VERWALTEN
   ---------------------------------------------------------------------
   FASSUNG 833 — XANDER (Funk 214): „Den Bootsverleih kann man offenbar
   nicht verwalten und du meintest dass man in Berliner Fernsehturm auch
   Eintritt verlangen könnte wie sieht es mit den anderen Sehenswürdig-
   keiten aus bis jetzt kann man da nicht in ein extra Menü" – und:
   „Infos zu den Wahrzeichen auf Deutsch".

   Jedes Wahrzeichen der Stadt (Holstentor, Brandenburger Tor, Kölner
   Dom, Neuschwanstein, Fernsehturm aus dem Spiel; Rathaus Döbeln und
   Kolosseum) und der Bootsverleih am See haben ein eigenes Menü
   „Verwalten":
     • Eintritt in Stufen (0 / 2 / 5 / 10 Taler; Bootsfahrt 0 / 2 / 4 /
       6 Taler). Fair: je höher der Preis, desto weniger Besucher –
       wie viele es noch sind, hängt vom Ausbau ab (gut ausgebaut
       schreckt ein hoher Preis weniger ab). Nachfrage = e^(−Preis /
       (6 + 4 · Stufe)); dazu der Zustand (gepflegt 100 %, abgenutzt
       bis 20 %: halb so viele) und beim Bootsverleih die Jahreszeit.
     • Besucher kommen während der Öffnungszeit (9–19 Uhr deutscher
       Zeit, Bootsverleih 10–18 Uhr) gleichmäßig über den Tag; „Besucher
       heute" zählt ab Mitternacht. Was sie zahlen, sammelt sich in der
       Kasse des Wahrzeichens, bis man es einsammelt (höchstens 48 h
       Abwesenheit werden nachgerechnet).
     • Eingesammeltes kommt in die Stadtkasse (Taler). Damit pflegt man
       (Zustand wieder 100 %) und baut aus (Stufe 1–3: mehr Besucher,
       ein hoher Eintritt schreckt weniger ab). Viele Besucher nutzen
       das Wahrzeichen ab (je voller Tag gut 2 %).
     • Der Bootsverleih: Stufe und Ausbau kommen aus dem Spiel (spiel_
       freizeit_bauen, Punkte); Boote = 2 + 2 · Stufe, je Boot höchstens
       10 Fahrten am Tag.
     • Eine kurze Info auf Deutsch (A2/B1): Ort, Baujahr, Höhe.
   Gespeichert wird im eigenen Stand der Stadt (spiel_stadt_leicht_
   speichern, Feld „verwalten" – dasselbe JSON wie Schmuck und Autos,
   keine neue Tabelle), dazu im Browser (leicht_verwalten_v1).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const V = (ST.verwalten = {});
  const L = () => ST.leicht || {};
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* ---------------- Die Orte ---------------- */
  const WZ = {
    holstentor: { name: "Holstentor", basis: 60, info: "Das Holstentor ist ein altes Stadttor in Lübeck. Es wurde von 1464 bis 1478 aus roten Backsteinen gebaut. Heute ist darin ein Museum zur Geschichte der Stadt." },
    brandenburger: { name: "Brandenburger Tor", basis: 110, info: "Das Brandenburger Tor steht in Berlin. Es wurde von 1788 bis 1791 gebaut und ist 26 Meter hoch; oben steht die Quadriga, ein Wagen mit vier Pferden. Heute ist es ein Zeichen für die deutsche Einheit." },
    koelner_dom: { name: "Kölner Dom", basis: 180, info: "Der Kölner Dom ist eine große Kirche in Köln. Der Bau begann 1248 und war erst 1880 fertig. Seine zwei Türme sind 157 Meter hoch." },
    neuschwanstein: { name: "Schloss Neuschwanstein", basis: 240, info: "Schloss Neuschwanstein steht in Bayern, bei Füssen im Allgäu. König Ludwig II. ließ es ab 1869 bauen. Jedes Jahr kommen über eine Million Besucher." },
    fernsehturm: { name: "Berliner Fernsehturm", basis: 300, info: "Der Berliner Fernsehturm steht am Alexanderplatz. Er wurde von 1965 bis 1969 gebaut und ist 368 Meter hoch – das höchste Bauwerk in Deutschland. In der Kugel gibt es eine Aussichtsetage und ein Restaurant." },
    rathaus_doebeln: { name: "Rathaus Döbeln", basis: 40, info: "Das Rathaus von Döbeln steht am Obermarkt, in Sachsen. Es wurde von 1910 bis 1912 gebaut und hat einen hohen Turm mit Uhr. Hier arbeitet die Stadtverwaltung." },
    kolosseum: { name: "Kolosseum", basis: 200, info: "Das Kolosseum steht in Rom, in Italien. Es wurde von 72 bis 80 nach Christus gebaut, ist 48 Meter hoch und hatte Platz für etwa 50.000 Zuschauer. Früher kämpften hier Gladiatoren." },
    bootsverleih: { name: "Bootsverleih", boot: true, info: "Im Bootsverleih am See mieten Gäste Tretboote, im Winter Schlittschuhe. Je mehr Boote es gibt, desto mehr Fahrten sind am Tag möglich. Im Sommer und bei schönem Wetter kommen mehr Gäste." }
  };
  V.ORTE = WZ;
  const PREISE = [0, 2, 5, 10], BOOT_PREISE = [0, 2, 4, 6];
  const AUSBAU = [150, 400, 900];          // Taler für Stufe 1, 2, 3
  const OFFEN = [9, 19], BOOT_OFFEN = [10, 18];
  V.preise = (k) => (WZ[k] && WZ[k].boot ? BOOT_PREISE : PREISE);

  /* Welches Ding gehört zu welchem Ort? */
  V.schluessel = function (o) {
    if (!o) return null;
    if (o.art === "wunder" && WZ[o.spiel]) return o.spiel;
    if (o.bild === "w_rathaus_doebeln") return "rathaus_doebeln";
    if (o.bild === "w_kolosseum") return "kolosseum";
    if (o.bild === "d_bootshaus" || (o.art === "kulisse" && o.name === "Bootsverleih")) return "bootsverleih";
    return null;
  };

  /* ---------------- Stand (gespeichert) ---------------- */
  const leer = () => ({ v: 1, kasse: 0, orte: {} });
  function norm(d) {
    const aus = leer();
    if (!d || typeof d !== "object") return aus;
    aus.kasse = Math.max(0, Math.min(1e7, Math.floor(+d.kasse || 0)));
    const o = d.orte && typeof d.orte === "object" ? d.orte : {};
    for (const k in WZ) {
      const s = o[k]; if (!s || typeof s !== "object") continue;
      aus.orte[k] = { preis: klemm(Math.round(+s.preis || 0), 0, 3), stufe: klemm(Math.round(+s.stufe || 0), 0, 3), zustand: klemm(+s.zustand || 0, 20, 100),
        t: isFinite(+s.t) ? +s.t : 0, tag: typeof s.tag === "string" ? s.tag.slice(0, 10) : "", besucher: Math.max(0, +s.besucher || 0), offen: Math.max(0, +s.offen || 0), gesamt: Math.max(0, Math.floor(+s.gesamt || 0)) };
    }
    return aus;
  }
  let D = null;
  function daten() {
    if (D) return D;
    const SP = ST.spiel || {};
    if (SP.eigenes && SP.eigenes.verwalten) D = norm(SP.eigenes.verwalten);
    else { try { D = norm(JSON.parse(localStorage.getItem("leicht_verwalten_v1") || "null")); } catch (e) { D = leer(); } }
    SP.verwalten = D;
    return D;
  }
  V.daten = daten;
  /* für Sonden und nach dem Laden vom Server */
  V.setzen = function (d) { D = norm(d); if (ST.spiel) ST.spiel.verwalten = D; return D; };
  function speichern() {
    const d = daten();
    try { localStorage.setItem("leicht_verwalten_v1", JSON.stringify(d)); } catch (e) {}
    if (ST.spiel) ST.spiel.verwalten = d;
    /* der ganze eigene Stand geht mit (Schmuck, Lage, Bäume, Autos) – der Server ersetzt ihn als Ganzes */
    if (L().dekoSpeichern) L().dekoSpeichern();
  }
  V.speichern = speichern;
  V.jetzt = () => Date.now();

  /* ---------------- Uhr: deutsche Zeit ---------------- */
  let offCache = { t: -1e15, off: 0 };
  function berlinVersatz(ms) {
    if (Math.abs(ms - offCache.t) < 600000) return offCache.off;
    let off = 3600000;
    try {
      const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
      const p = {}; for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
      off = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - Math.floor(ms / 1000) * 1000;
    } catch (e) {}
    offCache = { t: ms, off: off };
    return off;
  }
  const lokal = (ms) => new Date(ms + berlinVersatz(ms));
  const tagVon = (ms) => lokal(ms).toISOString().slice(0, 10);
  V.tagVon = tagVon;

  /* ---------------- Rechnen ---------------- */
  function stand(k) {
    const d = daten();
    if (!d.orte[k]) d.orte[k] = { preis: 1, stufe: 0, zustand: 100, t: V.jetzt(), tag: tagVon(V.jetzt()), besucher: 0, offen: 0, gesamt: 0 };
    return d.orte[k];
  }
  V.stand = stand;
  function bootStufe() {
    const ich = L().ich || {}, st = Math.min(3, Math.max(0, Math.floor(+(((ich.volk || {}).freizeit || {}).bootsverleih) || 0)));
    return ST.spiel && ST.spiel.beispiel ? Math.max(1, st) : st;
  }
  V.bootStufe = bootStufe;
  const boote = () => (bootStufe() ? 2 + 2 * bootStufe() : 0);
  function jahreszeit(ms) {
    const m = lokal(ms).getUTCMonth();
    return m >= 5 && m <= 7 ? 1.2 : m === 4 || m === 8 ? 1 : m === 3 || m === 9 ? 0.75 : m === 11 || m <= 1 ? 0.6 : 0.5;
  }
  /* Besucher an einem ganzen Tag bei diesem Preis (ohne Uhrzeit) */
  function nachfrage(k, preisNr, s, ms) {
    const W = WZ[k], p = V.preise(k)[preisNr] || 0;
    const lust = Math.exp(-p / (6 + 4 * s.stufe)) * (0.5 + 0.5 * s.zustand / 100);
    if (W.boot) { const st = bootStufe(); if (!st) return 0; return Math.min(boote() * 10, 24 * st * lust * jahreszeit(ms)); }
    return W.basis * (1 + 0.25 * s.stufe) * lust;
  }
  V.erwartet = function (k, preisNr) { const s = stand(k); return Math.round(nachfrage(k, preisNr == null ? s.preis : preisNr, s, V.jetzt())); };
  /* Stunden, in denen geöffnet war, zwischen a und b (ms) – in 10-Minuten-Stücken */
  function abrechnen(k) {
    const s = stand(k), jetzt = V.jetzt(), W = WZ[k], auf = W.boot ? BOOT_OFFEN : OFFEN, stunden = auf[1] - auf[0];
    let t = Math.max(s.t || jetzt, jetzt - 48 * 3600000);
    if (!(t < jetzt)) { s.t = jetzt; if (s.tag !== tagVon(jetzt)) { s.tag = tagVon(jetzt); s.besucher = 0; } return s; }
    const STUECK = 600000, preis = V.preise(k)[s.preis] || 0;
    while (t < jetzt) {
      const d = Math.min(STUECK, jetzt - t), mitte = lokal(t + d / 2), h = mitte.getUTCHours() + mitte.getUTCMinutes() / 60, tag = mitte.toISOString().slice(0, 10);
      if (tag !== s.tag) { s.tag = tag; s.besucher = 0; }
      if (h >= auf[0] && h < auf[1]) {
        const n = nachfrage(k, s.preis, s, t) * (d / 3600000) / stunden;
        s.besucher += n; s.offen += n * preis;
        if (!W.boot) s.zustand = Math.max(20, s.zustand - n / (W.basis * 4) * 10);
      }
      t += d;
    }
    s.t = jetzt;
    if (s.tag !== tagVon(jetzt)) { s.tag = tagVon(jetzt); s.besucher = 0; }
    return s;
  }
  V.abrechnen = abrechnen;
  V.preisSetzen = function (k, nr) {
    const s = abrechnen(k); nr = klemm(Math.round(nr), 0, 3);
    if (s.preis === nr) return s;
    s.preis = nr; speichern(); return s;
  };
  V.einsammeln = function (k) {
    const s = abrechnen(k), d = daten(), n = Math.floor(s.offen);
    if (n <= 0) return 0;
    s.offen -= n; s.gesamt += n; d.kasse += n; speichern();
    return n;
  };
  V.pflegeKosten = (k) => { const s = stand(k); return s.zustand >= 99.5 ? 0 : Math.max(5, Math.ceil((100 - s.zustand) * 0.8)); };
  V.pflegen = function (k) {
    const s = abrechnen(k), d = daten(), p = V.pflegeKosten(k);
    if (!p || d.kasse < p) return false;
    d.kasse -= p; s.zustand = 100; speichern(); return true;
  };
  V.ausbauKosten = (k) => { const s = stand(k); return s.stufe < 3 ? AUSBAU[s.stufe] : 0; };
  V.ausbauen = function (k) {
    const s = abrechnen(k), d = daten(), p = V.ausbauKosten(k);
    if (!p || d.kasse < p) return false;
    d.kasse -= p; s.stufe++; speichern(); return true;
  };

  /* ---------------- Das Menü ---------------- */
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const TALER = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#e8b53a" stroke="#8a5d12" stroke-width="1.6"/><circle cx="12" cy="12" r="5.6" fill="none" stroke="#8a5d12" stroke-width="1.1"/><path d="M12 8.6v6.8M9.6 10.4h4.8" stroke="#8a5d12" stroke-width="1.4" stroke-linecap="round"/></svg>';
  V.SYMBOL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5 12 4l9 5.5z" fill="currentColor"/><g fill="currentColor"><rect x="5" y="10.5" width="2.2" height="7"/><rect x="9.2" y="10.5" width="2.2" height="7"/><rect x="13.2" y="10.5" width="2.2" height="7"/><rect x="17.2" y="10.5" width="2.2" height="7"/><rect x="3.5" y="18.3" width="17" height="2.2" rx=".6"/></g></svg>';
  let fenster = null, fKey = "", fUhr = 0;
  V.offen = () => (fenster ? fKey : "");
  V.zu = function () { if (fenster) { fenster.remove(); fenster = null; fKey = ""; clearInterval(fUhr); } };
  const zahl = (n) => Math.floor(n).toLocaleString("de-DE");
  function ansage(t) { if (ST.oberflaeche && ST.oberflaeche.ansage) ST.oberflaeche.ansage(t); }
  function malen() {
    if (!fenster) return;
    const k = fKey, W = WZ[k], s = abrechnen(k), d = daten(), pr = V.preise(k), boot = !!W.boot, st = boot ? bootStufe() : s.stufe;
    const f = fenster; f.innerHTML = "";
    const kopf = el("div", "lk-vw-kopf");
    kopf.append(el("b", "lk-vw-titel", W.name + (boot ? (st ? " · Stufe " + st : " · geschlossen") : " · Stufe " + s.stufe)));
    const zu = el("button", "lk-vw-zu", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>');
    zu.type = "button"; zu.title = "Schließen"; zu.setAttribute("aria-label", "Schließen");
    zu.addEventListener("click", (e) => { e.stopPropagation(); V.zu(); });
    kopf.append(zu); f.append(kopf);
    f.append(el("p", "lk-vw-info", W.info));
    if (boot && !st) {
      f.append(el("p", "lk-vw-klein", "Noch geschlossen. Im Spiel eröffnest du den Bootsverleih (Bahnhof → Bootsverleih bauen, 150 Punkte)."));
      f.append(knopfText("Bootsverleih bauen · 150 P", "lk-vw-gut", () => bootBauen(), !!(ST.spiel && ST.spiel.beispiel)));
      return;
    }
    /* Eintritt / Preis je Fahrt */
    const reihe = el("div", "lk-vw-reihe"); reihe.append(el("span", "lk-vw-name", boot ? "Preis je Fahrt" : "Eintritt"));
    const stufen = el("div", "lk-vw-stufen"); stufen.setAttribute("role", "group"); stufen.setAttribute("aria-label", boot ? "Preis je Fahrt" : "Eintritt");
    pr.forEach((p, i) => {
      const b = el("button", "lk-vw-stufe" + (i === s.preis ? " an" : ""), p + " T"); b.type = "button"; b.dataset.nr = i;
      b.title = (boot ? "Preis je Fahrt " : "Eintritt ") + p + " Taler"; b.setAttribute("aria-pressed", String(i === s.preis));
      b.addEventListener("click", (e) => { e.stopPropagation(); V.preisSetzen(k, i); ansage((boot ? "Preis je Fahrt: " : "Eintritt: ") + p + " Taler"); malen(); });
      stufen.append(b);
    });
    reihe.append(stufen); f.append(reihe);
    const erw = V.erwartet(k);
    const zeilen = el("div", "lk-vw-zahlen");
    const zeile = (a, b, cls) => { const z = el("div", "lk-vw-zeile" + (cls ? " " + cls : "")); z.append(el("span", "", a), el("b", "", b)); zeilen.append(z); return z; };
    zeile(boot ? "Fahrten heute" : "Besucher heute", zahl(s.besucher), "lk-vw-heute");
    zeile(boot ? "Fahrten am Tag (bei diesem Preis)" : "Besucher am Tag (bei diesem Preis)", "≈ " + zahl(erw), "lk-vw-erwartet");
    if (boot) zeile("Boote", String(boote()));
    else zeile("Zustand", Math.round(s.zustand) + " %", "lk-vw-zustand");
    zeile("In der Kasse", zahl(s.offen) + " T", "lk-vw-kasse");
    zeile("Stadtkasse", zahl(d.kasse) + " T", "lk-vw-stadtkasse");
    f.append(zeilen);
    const knoepfe = el("div", "lk-vw-knoepfe");
    knoepfe.append(knopfText("Einnahmen einsammeln", "lk-vw-gut lk-vw-einsammeln", () => {
      const n = V.einsammeln(k);
      ansage(n ? "+" + zahl(n) + " Taler in die Stadtkasse" : "Noch nichts in der Kasse");
      try { if (n && ST.ton && ST.ton.einsammeln) ST.ton.einsammeln("muenze"); } catch (e) {}
      malen();
    }, Math.floor(s.offen) < 1));
    if (!boot) {
      const pk = V.pflegeKosten(k);
      knoepfe.append(knopfText(pk ? "Pflegen · " + pk + " T" : "Gepflegt", "lk-vw-pflegen", () => { if (V.pflegen(k)) ansage(W.name + " ist wieder wie neu"); malen(); }, !pk || d.kasse < pk));
      const ak = V.ausbauKosten(k);
      knoepfe.append(knopfText(ak ? "Ausbauen auf Stufe " + (s.stufe + 1) + " · " + ak + " T" : "Voll ausgebaut", "lk-vw-ausbauen", () => { if (V.ausbauen(k)) ansage(W.name + ": Stufe " + stand(k).stufe); malen(); }, !ak || d.kasse < ak));
    } else if (st < 3) {
      const bp = [150, 300, 500][st];
      knoepfe.append(knopfText("Ausbauen auf Stufe " + (st + 1) + " · " + bp + " P", "lk-vw-ausbauen", () => bootBauen(), !!(ST.spiel && ST.spiel.beispiel)));
    }
    f.append(knoepfe);
    f.append(el("p", "lk-vw-klein", boot
      ? "Höherer Preis: mehr Geld je Fahrt, aber weniger Gäste. Die Zug-Touristen am Bahnhof rechnet das Spiel weiter in Punkten ab."
      : "Höherer Eintritt: mehr Geld je Besucher, aber es kommen weniger. Gut ausgebaut schreckt ein hoher Preis weniger ab. Geöffnet 9–19 Uhr."));
  }
  V.malen = malen;
  function knopfText(text, cls, fn, aus) {
    const b = el("button", "lk-vw-knopf " + (cls || ""), TALER + "<span></span>"); b.type = "button";
    b.querySelector("span").textContent = text; b.disabled = !!aus;
    b.addEventListener("click", (e) => { e.stopPropagation(); if (!b.disabled) fn(); });
    return b;
  }
  function bootBauen() {
    if (window.parent !== window) { try { window.parent.postMessage({ typ: "leicht-freizeitbau", w: "bootsverleih" }, location.origin); } catch (e) {} ansage("Der Auftrag ist beim Spiel"); return; }
    const SP = ST.spiel;
    if (!SP || SP.beispiel || !SP.rpc) { ansage("In der Beispielstadt wird nicht gebaut – bitte anmelden"); return; }
    SP.rpc("spiel_freizeit_bauen", { p_was: "bootsverleih" }).then((r) => {
      if (r && r.ok === false) throw new Error(r.grund || "Geht gerade nicht");
      ansage("Der Bootsverleih ist jetzt Stufe " + ((r && r.stufe) || bootStufe() + 1));
      return SP.neuLaden().then((ich) => { if (ich) L().ich = ich; malen(); });
    }).catch((e) => ansage((e && (e.message || e.hint)) || "Geht gerade nicht"));
  }
  V.oeffnen = function (k) {
    if (!WZ[k]) return false;
    const wurzel = document.getElementById("lOber");
    if (!wurzel) return false;
    V.zu();
    fKey = k;
    fenster = el("div", "lk-verwalten");
    fenster.setAttribute("role", "dialog"); fenster.setAttribute("aria-label", WZ[k].name + " verwalten");
    for (const t of ["pointerdown", "pointerup", "click", "wheel", "touchstart"]) fenster.addEventListener(t, (e) => e.stopPropagation(), { passive: true });
    wurzel.appendChild(fenster);
    malen();
    fUhr = setInterval(() => { if (!fenster || !fenster.isConnected) { clearInterval(fUhr); return; } const h = fenster.querySelector(".lk-vw-heute b"), s = abrechnen(fKey); if (h) h.textContent = zahl(s.besucher); const ks = fenster.querySelector(".lk-vw-kasse b"); if (ks) ks.textContent = zahl(s.offen) + " T"; const ek = fenster.querySelector(".lk-vw-einsammeln"); if (ek) ek.disabled = Math.floor(s.offen) < 1; }, 2000);
    return true;
  };
  /* der Stand vom Server ist da (spiel.js lädt ihn): neu einlesen */
  V.neu = function () { D = null; daten(); if (fenster) malen(); };
})();
