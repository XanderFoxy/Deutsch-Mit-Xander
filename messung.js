/* =====================================================================
   FASSUNG 884 — MESSUNG BEI ECHTEN NUTZERN
   ---------------------------------------------------------------------
   XANDER (Funk 255): „… das auf beiden Seiten immer alles spielbar ist
   und niemals abstürzt und alles optimiert ist".
   ZUGESAGT (Funk 258, Punkt 5): „Echte Messung bei echten Nutzern
   (Ladezeit, Abbrüche) statt nur bei mir."

   Bisher gab es nur die Leitungs-Zeitleisten (spiel_diagnose „leitung"
   und „verbindung", ab 836/840). Wie lange die Seite bei Xanders Leuten
   bis „bereit" braucht, welche Fehler dort auftreten, ob eine Seite
   abstürzt und ob das Klassenzimmer ruckelt, wusste niemand. Jetzt:

     mess-start   einmal je Seite, 20 s nach dem Laden: Zeiten (ttfb,
                  erstes Bild, größtes Bild, bereit, load), Tipp →
                  Wissen/Klassenzimmer, Kilobyte und Dateien bis
                  „bereit", Langläufer beim Start, Netz und Gerät, was
                  mit der vorigen Seite war (vorher), Fehler bis dahin.
     mess-fehler  Fehler, die erst danach auftreten (gebündelt).
     mess-raum    je Aufenthalt im Klassenzimmer: Betreten bis drin,
                  Langläufer je 30 s (Summe, längster, Anzahl), die
                  längsten Bilder (LoAF) und Eingaben, Leute, Kamera.

   Mitgeschrieben wird von Anfang an in index.html (DMA_MESS: Fehler,
   Langläufer, Tipps, Raumwechsel). Diese Datei kommt erst 4 s nach dem
   Laden in einer Ruhepause und wertet aus. Der Start wird dadurch nicht
   langsamer; die Sonde pruefe-884-messung.js misst das nach.

   ABSTURZ-INDIZ: jede Seite führt ein kleines Laufbuch (localStorage
   „dma-mess-lauf"): wann zuletzt gesehen, sichtbar oder im Hintergrund,
   sauber geschlossen (pagehide) oder nicht. Findet die nächste Seite
   einen Eintrag, der nie geschlossen wurde und nicht mehr antwortet
   (BroadcastChannel), meldet sie ihn in „vorher": „weg" (war sichtbar –
   Absturz, Akku, Zwangsbeenden), „hinten" (im Hintergrund weggeräumt)
   oder „laden" (die Seite brach schon beim Laden ab). Das ist eine
   Schätzung, kein Beweis (siehe SPIELSYSTEM.md, Fassung 884).

   RAUMZEILE BEIM WEGGEHEN (nachgebessert nach der Prüfung): geht die
   Seite in den Hintergrund oder weg, geht die Raumzeile SOFORT raus –
   mit keepalive wie sfuAbschied in livechat.js, damit sie das Ende der
   Seite überlebt (eine Ruhepause kommt beim Entladen nie mehr). Bis der
   Server sie bestätigt, steht sie im Laufbuch („ru"); stirbt die Seite
   vorher, schickt die nächste sie nach – außer sie ging schon mit
   keepalive raus. Eine Folgezeile (nach einer Teilzeile) ohne
   Langläufer, LoAF und Eingabe geht nur raus, wenn seit der letzten
   Zeile mindestens ein ganzes Fenster (30 s) SICHTBAR lag – sonst
   entsteht sie gar nicht (Nachprüfung 884b: vorher reichten 2 s
   irgendeiner Zeit, auch im Hintergrund).
   SICHTBAR (884b): Langläufer zählen im Raum nur, wenn sie ganz in
   sichtbarer Zeit lagen; „anzahl" zählt nur sichtbare Fenster, „sicht"
   die sichtbaren Sekunden („dauer" bleibt die ganze Zeit).

   WAS BEWUSST NICHT GESENDET WIRD: Namen, Raumnamen, Chat-Inhalte,
   Kennungen, Adressen. Fehlertexte werden gereinigt (E-Mail, IDs, lange
   Zahlen, Adressen, Zitate und Ausschnitte aus JSON und Selektoren →
   Platzhalter, höchstens 140 Zeichen). Gäste senden nichts (der Server
   verlangt eine Anmeldung); ihre Zeilen warten in einer kleinen Kiste,
   bis sich jemand anmeldet, und tragen dann „gast: 1" (wem sie gehören,
   ist auf einem geteilten Gerät nicht sicher). Jede Zeile – auch eine,
   die die nächste Seite nachschickt – geht nur unter dem Konto raus,
   unter dem sie gemessen wurde (884b).

   SPARSAM: höchstens 8 Zeilen „mess-*" je Kalendertag und Gerät – aber
   nur 1, solange der Server sie noch mit den Leitungs-Zeilen zusammen-
   zählt (siehe TAG_ALT und supabase/fassung-884-messung.sql; seit
   13.10.2026 eingespielt, die Antwort trägt „mess": 12). Je Seite
   höchstens 1 Start-, 2 Fehler-, 3 Raumzeilen. Gezählt wird, wenn ein
   Aufruf wirklich losgeht; schlägt er fehl, wird zurückgezählt. Fehler
   beim Senden werden still geschluckt. Nie console.*.
   ===================================================================== */
(function () {
  "use strict";
  var M = window.DMA_MESS;
  if (!M || M.da) return;
  M.da = 1;
  var P = window.performance, tInit = P.now();

  /* Prüfläufe (navigator.webdriver) senden nur, wenn die Sonde es will – alle anderen Sonden bleiben unberührt. */
  var PRUEF = navigator.webdriver ? "" : "x";
  if (navigator.webdriver) { try { PRUEF = localStorage.getItem("dma-mess-pruef") || ""; } catch (e) {} }
  var ZEIT = PRUEF === "schnell"
    ? { start: 500, fenster: 1000, herz: 500, tot: 3000, teil: 2000, ping: 300, fehler: 1000, fehler2: 3000, zeile: 2000, warte: [0, 300, 900] }
    : { start: 20000, fenster: 30000, herz: 30000, tot: 180000, teil: 120000, ping: 1000, fehler: 20000, fehler2: 300000, zeile: 600000, warte: [0, 30000, 90000] };
  /* Tagesdeckel je Gerät: 8, sobald der Server „mess-*" getrennt zählt (fassung-884-messung.sql antwortet mit „mess").
     Bis dahin 1: der alte Server zählt 40 Zeilen je Konto und 24 h über ALLE Arten, und an starken Tagen (lesend
     gezählt: 3 Konto-Tage mit 40 in 30 Tagen) verdrängt jede Mess-Zeile eine Leitungs-Zeile – genau die Diagnosen, die
     Vorrang haben. Die eine Zeile verrät zugleich, welcher Server antwortet. MV = Fassung des Zeilenformats. */
  var TAG = 8, TAG_ALT = 1, MV = 1;
  var JE_SEITE = { "mess-start": 1, "mess-fehler": 2, "mess-raum": 3 };

  function jetzt() { return P.now(); }
  function rund(x) { return x == null || isNaN(x) ? null : Math.round(x); }
  function lesen(k) { try { var s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function schreiben(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function zufall(n) { var s = ""; while (s.length < n) s += Math.random().toString(36).slice(2); return s.slice(0, n); }
  function heute() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function ruhig(f) { if (window.requestIdleCallback) requestIdleCallback(f, { timeout: 5000 }); else setTimeout(f, 0); }
  function sichtbar() { return document.visibilityState !== "hidden"; }
  function speicherMb() { try { var m = P.memory; return m && m.usedJSHeapSize ? Math.round(m.usedJSHeapSize / 1048576) : null; } catch (e) { return null; } }
  var FASSUNG = String(window.DMA_VERSION || "");

  /* =========================================================
     SENDEN — wie leitungSenden (livechat.js), nur angemeldet
     ========================================================= */
  var gesendet = [], jeSeite = {}, tagMerk = null, marke = "", markeBis = 0, markeUm = 0, markeWer = "", ende = false, KA = null;
  function konto() { try { return (typeof Backend !== "undefined" && Backend) || window.Backend || null; } catch (e) { return null; } }
  function zugang() {
    try {
      var be = konto(), k = be && be.zugang && be.zugang();
      return k && k.rpc && be.currentUser && be.currentUser() ? k : null;
    } catch (e) { return null; }
  }
  /* kurzer Fingerabdruck des angemeldeten Kontos – bleibt auf dem Gerät (Kiste), wird nie gesendet */
  function wer() {
    try {
      var u = konto().currentUser(), s = String((u && u.id) || ""), h = 5381;
      for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
      return s ? h.toString(36) : "";
    } catch (e) { return ""; }
  }
  function tagStand() {
    var t = lesen("dma-mess-tag") || tagMerk || {};
    if (t.tag !== heute()) t = { tag: heute(), n: 0, srv: t.srv || 0 };
    tagMerk = t;
    return t;
  }
  function tagSetzen(f) { var t = tagStand(); f(t); tagMerk = t; schreiben("dma-mess-tag", t); }
  function tagFrei() { var t = tagStand(); return t.n < (t.srv ? TAG : TAG_ALT); }
  function kisteLesen() {
    var k = lesen("dma-mess-kiste");
    return (k && k.filter ? k : []).filter(function (x) { return x && x.a && Date.now() - x.t < 3 * 864e5; });
  }
  /* u: unter welchem Konto die Zeile gemessen wurde (Fingerabdruck wie wer()); ohne Angabe das jetzige.
     FASSUNG 884 (Nachprüfung 884b) — die nächste Seite gibt beim Nachschicken das Konto der toten Seite mit: ist die
     Sitzung beim Nachschicken noch nicht wiederhergestellt, landete die Zeile sonst mit u = "" in der Kiste und ging
     später fälschlich mit „gast: 1" raus. */
  function kisteRein(art, d, u) {
    var k = kisteLesen();
    if (k.length >= 3) return;
    k.push({ a: art, d: d, t: Date.now(), u: u != null ? u : wer() });
    schreiben("dma-mess-kiste", k);
  }
  /* FASSUNG 884 (Nachprüfung 884b) — keepalive nur, wo der Browser es wirklich kann. Firefox vor 133 kennt die Option
     nicht und übergeht sie still: die Anfrage stirbt mit der Seite, die Zeile galt aber als zugestellt („ka") und wurde
     nie nachgeschickt. Ohne keepalive gibt es keine Marke – die Zeile bleibt im Laufbuch, die nächste Seite schickt sie. */
  function kaGeht() {
    if (KA == null) { try { KA = typeof Request === "function" && new Request(location.href, { keepalive: true }).keepalive === true; } catch (e) { KA = false; } }
    return KA;
  }
  /* Zugangsmarke für das Senden beim Weggehen (keepalive): nur im Speicher, geholt beim Betreten des Raums und danach
     höchstens alle 10 min, solange man drin ist – nie beim Start. supabase-js holt sie sonst erst asynchron, und beim
     Entladen der Seite läuft nichts Asynchrones mehr.
     FASSUNG 884 (Nachprüfung 884b) — die Marke gehört zu dem Konto, für das sie geholt wurde (markeWer). Abmelden und ein
     anderes Konto anmelden ohne Neuladen: die alte Marke gilt nicht mehr (sonst gingen die Raumzeilen bis zu 10 min unter
     dem vorigen Konto raus), und die nächste Runde holt sofort eine neue. */
  function markeHolen() {
    var k = zugang(), ich = wer();
    if (!PRUEF || !k || !k.auth || typeof k.auth.getSession !== "function" || !kaGeht()) return;
    if (ich !== markeWer) { marke = ""; markeUm = 0; }
    if (Date.now() - markeUm < 600000) return;
    markeUm = Date.now(); markeWer = ich;
    try {
      k.auth.getSession().then(function (a) {
        var s = a && a.data && a.data.session;
        if (s && s.access_token && wer() === ich) { marke = s.access_token; markeBis = s.expires_at ? s.expires_at * 1000 - 120000 : Date.now() + 3e6; }
      }, function () {});
    } catch (e) {}
  }
  function markeGut() { return Boolean(marke) && Date.now() < markeBis && markeWer === wer(); }
  function keepalive(art, d) {
    var cfg = window.SUPABASE_CONFIG || {};
    if (!markeGut() || !cfg.url || typeof fetch !== "function") return null;
    return fetch(String(cfg.url).replace(/\/+$/, "") + "/rest/v1/rpc/spiel_diagnose_senden", {
      method: "POST", keepalive: true,
      headers: { "Authorization": "Bearer " + marke, "apikey": cfg.anonKey || "", "Content-Type": "application/json" },
      body: JSON.stringify({ p_art: art, p_daten: d })
    }).then(function (r) {
      return r.json().then(function (j) { return r.ok ? { data: j } : { error: j || r.status }; },
                           function () { return r.ok ? { data: null } : { error: r.status }; });
    });
  }
  /* o.sofort: ohne Ruhepause (die Seite geht in den Hintergrund oder weg); o.weg: mit keepalive, falls eine Marke da
     ist (o.ka() meldet das); o.fertig(ok): die Antwort, solange die Seite lebt; o.frei: zählt nicht gegen die Höchstzahl
     je Seite (Kiste, Nachsenden); o.u: Konto, unter dem die Zeile gemessen wurde (Nachsenden, für die Kiste).
     Rückgabe: "raus" (unterwegs oder in der Ruhepause), "kiste" oder "" (verworfen). */
  function senden(art, d, o) {
    o = o || {};
    if (!PRUEF) return "";
    if (!o.frei) {
      if ((jeSeite[art] || 0) >= (JE_SEITE[art] || 1)) return "";
      jeSeite[art] = (jeSeite[art] || 0) + 1;
    }
    d.f = d.f || FASSUNG;
    d.mv = MV;
    var k = zugang();
    if (!k) { kisteRein(art, d, o.u); return "kiste"; }
    if (!tagFrei()) return "";
    function fertig(ok) { if (o.fertig) { try { o.fertig(ok); } catch (e) {} } }
    function zurueck() { tagSetzen(function (t) { if (t.n > 0 && t.n < 99) t.n--; }); kisteRein(art, d, o.u); fertig(false); }
    function antwort(a) {
      var r = a && a.data;
      if (!a || a.error) return zurueck();
      if (r && r.ok === false) {
        if (!r.grund) return zurueck();                          /* der Server sah keine Anmeldung */
        tagSetzen(function (t) { t.n = 99; });                   /* „genug für heute" */
        return fertig(false);
      }
      /* Der Server mit eigenem Zähler für „mess-*" (fassung-884-messung.sql) sagt es mit „mess" – erst dann 8 am Tag.
         FASSUNG 884 (Nachprüfung 884b, wie „sitz“ in livechat.js) — und wieder 1, sobald eine angenommene Antwort es
         nicht mehr sagt (die Funktion wurde ersetzt): sonst blieb ein Gerät, das „mess" einmal gesehen hatte, für immer
         bei 8 in den gemeinsamen 40. Nur bei einer echten Antwort (keepalive ohne lesbaren Inhalt ändert nichts). */
      var srv = r && r.mess ? 1 : 0;
      if (r && tagStand().srv !== srv) tagSetzen(function (t) { t.srv = srv; });
      fertig(true);
    }
    function los() {
      if (!tagFrei()) return fertig(false);
      tagSetzen(function (t) { t.n++; });
      gesendet.push(art);
      try {
        var w = o.weg ? keepalive(art, d) : null;
        if (w && o.ka) o.ka();
        /* Beim Entladen lehnt Chrome das Versprechen eines keepalive-Aufrufs ab, die Anfrage selbst läuft weiter (in der
           Sonde nachgestellt: sonst kam die Zeile ein zweites Mal aus der Kiste). Nach pagehide also nichts zurücknehmen. */
        if (w) w.then(antwort, function () { if (!ende) zurueck(); });
        else k.rpc("spiel_diagnose_senden", { p_art: art, p_daten: d }).then(antwort, zurueck);
      } catch (e) { zurueck(); }
    }
    if (o.sofort || o.weg) los(); else ruhig(los);
    return "raus";
  }
  function kisteLeeren() {
    var k = kisteLesen(), ich = wer();
    if (!k.length) return;
    schreiben("dma-mess-kiste", null);
    k.forEach(function (x) {
      if (x.u && x.u !== ich) return;          /* unter einem anderen Konto auf diesem Gerät gesammelt: verwerfen */
      x.d.alt = Math.round((Date.now() - x.t) / 60000);
      if (!x.u) x.d.gast = 1;                  /* ohne Anmeldung gesammelt: wem die Zeile gehört, ist nicht sicher */
      senden(x.a, x.d, { frei: true });
    });
  }

  /* =========================================================
     FEHLER — gezählt, gereinigt, gebündelt
     ========================================================= */
  var fehler = {}, fehlerZahl = 0, fehlerMehr = 0, fehlerGemeldet = {}, fehlerMehrGemeldet = 0;
  var startRaus = false, fehlerGeplant = false, fehlerZuletzt = 0;
  function datei(u) {
    var m = /\/((?:min\/)?[\w.-]+\.(?:js|css|json))(?:[?#][^:\s]*)?$/.exec(String(u || "").split(/[?#]/)[0]);
    if (m) return m[1];
    var s = String(u || "").split(/[?#]/)[0].split("/");
    return s[s.length - 1] || s[2] || "";
  }
  /* Chrome hängt bei JSON.parse und bei ungültigen Selektoren einen Ausschnitt der Eingabe an, Safari setzt sie in
     Anführungszeichen – darin können Namen oder Chat stehen. Bezeichner in einfachen Anführungszeichen ('foo') bleiben,
     sie sagen, was kaputt war. Das senkt das Risiko, schließt es aber nicht ganz aus (siehe SPIELSYSTEM.md).
     884b: die Werte in Postgres-Meldungen („Key (name)=(Zuzana) already exists") → ‹wert›; die Spalte bleibt. */
  function sauber(t) {
    t = String(t == null ? "" : t)
      .replace(/\)=\([^)]*\)/g, ")=(‹wert›)")
      .replace(/data:[^\s'"]+/g, "‹data›")
      .replace(/\b(?:https?|wss?|blob|file):\/\/[^\s'"<>()]+/g, function (u) { return "‹" + (datei(u) || "url") + "›"; })
      .replace(/(^|, )(?:\.\.\.)?"[\s\S]*(?= is not valid JSON)/, "$1‹json›")
      .replace(/(^|: )'[\s\S]*(?=' is not a valid selector)'/, "$1‹selektor›")
      .replace(/"[^"]*"/g, function (z) { return z.length > 3 ? "‹text›" : z; })
      .replace(/„[^“”"]*[“”"]/g, "‹text›")
      .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "‹mail›")
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "‹id›")
      .replace(/\d{5,}/g, "‹zahl›");
    return t.length > 140 ? t.slice(0, 139) + "…" : t;
  }
  function stapelOrt(st) {
    var re = /\/((?:min\/)?[\w.-]+\.js)(?:\?[^:\s]*)?:(\d+):(\d+)/, zeilen = String(st || "").split("\n"), m = null;
    for (var i = 0; i < zeilen.length && !m; i++) if (zeilen[i].indexOf(location.origin) >= 0) m = re.exec(zeilen[i]);
    if (!m) m = re.exec(String(st || ""));
    return m ? m[1] + ":" + m[2] + ":" + m[3] : "";
  }
  function zaehlen(a) {
    try {
      var art = a[0], text, ort;
      if (art === "js" && /ResizeObserver loop/.test(a[1])) return;
      if (art === "js" && /^Script error\.?$/.test(a[1])) art = "fremd";
      if (art === "laden") { text = a[1]; ort = sauber(datei(a[2])); }
      else if (art === "versprechen") { text = sauber(a[1]); ort = stapelOrt(a[2]); }
      else { text = sauber(a[1]); ort = a[2] ? sauber(datei(a[2])) + ":" + (a[3] || 0) + ":" + (a[4] || 0) : ""; }
      var schl = art + "|" + text + "|" + ort, e = fehler[schl];
      if (e) { e[0]++; return; }
      if (fehlerZahl >= 8) { fehlerMehr++; return; }
      fehler[schl] = [1, art, text, ort, rund(a[5])];
      fehlerZahl++;
      if (startRaus) fehlerPlanen();
    } catch (x) {}
  }
  function fehlerNeu() {
    return Object.keys(fehler).filter(function (s) { return !fehlerGemeldet[s]; });
  }
  function fehlerPlanen() {
    if (fehlerGeplant || (jeSeite["mess-fehler"] || 0) >= JE_SEITE["mess-fehler"]) return;
    fehlerGeplant = true;
    var warte = fehlerZuletzt ? Math.max(ZEIT.fehler, fehlerZuletzt + ZEIT.fehler2 - jetzt()) : ZEIT.fehler;
    setTimeout(function () {
      fehlerGeplant = false;
      var neu = fehlerNeu();
      if (!neu.length) return;
      var d = { fehler: neu.map(function (s) { fehlerGemeldet[s] = 1; return fehler[s]; }), fehlerMehr: fehlerMehr - fehlerMehrGemeldet };
      fehlerMehrGemeldet = fehlerMehr;
      fehlerZuletzt = jetzt();
      senden("mess-fehler", d);
    }, warte);
  }
  M.an = zaehlen;
  M.fe.splice(0).forEach(zaehlen);

  /* =========================================================
     KLASSENZIMMER — Langläufer je Fenster (30 s)
     ========================================================= */
  var nav = (P.getEntriesByType && P.getEntriesByType("navigation")[0]) || {};
  var bereitT = nav.domContentLoadedEventEnd || M.dcl || 0;
  var startLt = [0, 0, 0], raum = null, raumZuletzt = -1e12, drinAb = null, lueckeAnfang = M.lt.length >= 300;
  var TYPEN = (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes) || [];
  var mitLongtask = TYPEN.indexOf("longtask") >= 0, loafObs = null, evObs = null, uhr = null;
  /* FASSUNG 884 (Nachprüfung 884b) — SICHTBARE ZEIT. Die Prüfung fand: dauer und anzahl zählten die Zeit im Hintergrund
     mit; dort wird nicht gezeichnet, die Fenster sahen „glatt" aus und drückten den Anteil zäher Fenster (zaeh/anzahl)
     nach unten. Und eine Folgezeile nach einer Teilzeile, die nur Hintergrundzeit enthielt, ging als leere Zeile raus
     (Tagesplatz, Raumplatz, verdünnte Kernzahl). Jetzt: sichtVon = Beginn der jetzigen (bzw. letzten) sichtbaren Strecke,
     sichtBis = ihr Ende (null, solange sichtbar); raum.sicht sammelt die sichtbaren ms seit raum.seit. */
  var sichtVon = sichtbar() ? 0 : null, sichtBis = sichtbar() ? null : 0;
  function neuerRaum(t, haupt) {
    return { v: t, ab: null, seit: null, drin: null, haupt: haupt, f: {}, ges: [0, 0, 0], loaf: [], inp: [], leute: 0, bild: 0,
             uhr: mitLongtask ? 0 : 1, luecke: lueckeAnfang ? 1 : 0, folge: 0, sicht: 0 };
  }
  function sichtMs(r, t) {
    return r.sicht + (sichtBis == null && sichtVon != null ? Math.max(0, t - Math.max(sichtVon, r.seit)) : 0);
  }
  function sichtWechsel(t) {
    if (!sichtbar()) {
      if (sichtBis != null) return;
      if (raum && raum.seit != null) raum.sicht = sichtMs(raum, t);
      sichtBis = t;
    } else if (sichtBis != null) { sichtVon = t; sichtBis = null; }
  }
  /* Ein Langläufer zählt im Raum nur, wenn er ganz in sichtbarer Zeit lag. Das gilt auch für die Ersatzuhr (iPhone,
     Firefox): deren erster Takt nach der Rückkehr maß sonst die ganze Pause im Hintergrund (Zeitgeber ruhen dort) als
     einen Langläufer – bis zu Minuten, ein „zähes" Fenster bei jeder Rückkehr (884b beim Bauen gefunden). */
  function sichtbarGelaufen(s, d) { return sichtVon != null && s >= sichtVon && (sichtBis == null || s + d <= sichtBis); }
  function lang(s, d) {
    if (s < bereitT + 5000) { startLt[0]++; startLt[1] += d; if (d > startLt[2]) startLt[2] = d; }
    if (!raum || raum.seit == null || s < raum.seit || !sichtbarGelaufen(s, d)) return;
    var i = Math.floor((s - raum.ab) / ZEIT.fenster), w = raum.f[i] || (raum.f[i] = [0, 0, 0]);
    w[0] += d; if (d > w[1]) w[1] = d; w[2]++;
    raum.ges[0]++; raum.ges[1] += d; if (d > raum.ges[2]) raum.ges[2] = d;
  }
  function oben3(liste, e) {
    liste.push(e);
    liste.sort(function (a, b) { return b[0] - a[0]; });
    if (liste.length > 3) liste.length = 3;
  }
  function ziel(el) {
    try {
      if (!el || !el.tagName) return "";
      if (el.id) return "#" + String(el.id).slice(0, 40);
      var k = typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "";
      return el.tagName.toLowerCase() + (k ? "." + k.slice(0, 40) : "");
    } catch (e) { return ""; }
  }
  function beobachterAn() {
    try {
      if (TYPEN.indexOf("long-animation-frame") >= 0 && !loafObs) {
        loafObs = new PerformanceObserver(function (l) {
          if (!raum || raum.seit == null) return;
          l.getEntries().forEach(function (x) {
            if (x.startTime < raum.seit || x.duration < 50 || !sichtbarGelaufen(x.startTime, x.duration)) return;
            var sc = (x.scripts || []).slice().sort(function (a, b) { return b.duration - a.duration; })[0] || {};
            oben3(raum.loaf, [rund(x.duration), datei(sc.sourceURL || ""), sc.sourceCharPosition == null ? -1 : sc.sourceCharPosition, String(sc.invokerType || "")]);
          });
        });
        loafObs.observe({ type: "long-animation-frame", buffered: true });
      }
      if (TYPEN.indexOf("event") >= 0 && !evObs) {
        evObs = new PerformanceObserver(function (l) {
          if (!raum || raum.seit == null) return;
          l.getEntries().forEach(function (x) {
            if (x.startTime < raum.seit || !sichtbarGelaufen(x.startTime, x.duration)) return;
            oben3(raum.inp, [rund(x.duration), String(x.name || ""), ziel(x.target)]);
          });
        });
        evObs.observe({ type: "event", durationThreshold: 104, buffered: true });
      }
    } catch (e) {}
    /* Ohne longtask (iPhone, Firefox): grob über den Versatz eines 500-ms-Takts, nur im Raum und bei sichtbarer Seite. */
    if (!mitLongtask && !uhr) {
      var zuletzt = jetzt();
      uhr = setInterval(function () {
        var t = jetzt(), d = t - zuletzt - 500;
        zuletzt = t;
        if (sichtbar() && d > 50) lang(t - d, d);
      }, 500);
    }
  }
  function beobachterAus() {
    try { if (loafObs) loafObs.disconnect(); if (evObs) evObs.disconnect(); } catch (e) {}
    loafObs = evObs = null;
    if (uhr) { clearInterval(uhr); uhr = null; }
  }
  /* grund: aus | wechsel | hidden (Teilzeile im Hintergrund) | weg (pagehide) | offen (Zusammenfassung im Laufbuch).
     folge = wie viele Zeilen dieses Aufenthalts schon raus sind; eine Folgezeile ohne neue Daten gibt es nicht (null).
     FASSUNG 884 (Nachprüfung 884b) — „neue Daten" heißt: ein Langläufer, ein langes Bild oder eine langsame Eingabe,
     oder mindestens ein ganzes Fenster (30 s) sichtbare Zeit seit der letzten Zeile (glatte sichtbare Zeit ist auch eine
     Aussage). Vorher: „weniger als 2000 ms seit der letzten Zeile" – fest, nicht an ZEIT, und Hintergrundzeit zählte mit.
     Die Prüfung stellte nach: Teilzeile beim Tab-Wechsel, versteckt bleiben, nach > 2 s schließen → eine zweite Zeile
     {weg, folge 1, ges [0,0,0]} per keepalive bzw. ohne Marke {offen, spaet 1, …} von der nächsten Seite. */
  function raumBauen(grund) {
    var r = raum, t = jetzt(), fen = [], zaeh = 0, kz = null, sicht = sichtMs(r, t);
    if (r.folge && sicht < ZEIT.fenster && !r.ges[0] && !r.loaf.length && !r.inp.length) return null;
    Object.keys(r.f).forEach(function (i) {
      var w = r.f[i];
      fen.push([+i, rund(w[0]), rund(w[1]), w[2]]);
      if (w[0] >= 300 || w[1] >= 200) zaeh++;
    });
    if (fen.length > 60) fen = fen.sort(function (a, b) { return b[1] - a[1]; }).slice(0, 60);
    fen.sort(function (a, b) { return a[0] - b[0]; });
    (M.tipp.kz || []).forEach(function (x) { if (x[0] <= r.ab && x[0] >= (r.v != null ? r.v : r.ab) - 60000) kz = x; });
    return { k: zufall(6), grund: grund, folge: r.folge, teil: grund === "hidden" ? 1 : 0,
             haupt: r.haupt, dauer: rund((t - r.seit) / 1000), sicht: rund(sicht / 1000), drin: rund(r.drin), ab: rund(r.ab), kz: kz,
             fenster: fen, anzahl: Math.ceil(sicht / ZEIT.fenster), zaeh: zaeh,
             ges: [r.ges[0], rund(r.ges[1]), rund(r.ges[2])], uhr: r.uhr, luecke: r.luecke, loaf: r.loaf, inp: r.inp,
             mb: speicherMb(), leute: r.leute, bild: r.bild, f: FASSUNG };
  }
  /* Die Zeile steht als „unterwegs" im Laufbuch, BEVOR sie losgeht, und erst die Antwort des Servers streicht sie.
     Stirbt die Seite dazwischen, schickt die nächste sie nach (spaet) – außer sie ging mit keepalive raus (ka): die
     trägt der Browser über das Ende der Seite hinaus. */
  function raumSenden(grund) {
    if (!raum || raum.seit == null) return;
    var t = jetzt(), weg = grund === "hidden" || grund === "weg";
    if (grund === "hidden" && (t - raum.seit < ZEIT.teil || t - raumZuletzt < ZEIT.zeile)) return;
    /* Ohne Marke kommt die Zeile beim Entladen nicht sicher raus (supabase-js holt die Marke erst asynchron) – dann
       bleibt sie als offene Zusammenfassung im Laufbuch (pagehide schreibt sie), und die nächste Seite schickt sie
       genau einmal nach. Beim Entladen kommt pagehide VOR visibilitychange: „hidden" danach gilt genauso. */
    if (weg && ende && !markeGut()) return;
    var d = raumBauen(grund);
    if (!d) return;
    unterwegs(d, "rein");
    var s = senden("mess-raum", d, { sofort: weg, weg: weg, ka: function () { unterwegs(d, "ka"); }, fertig: function () { unterwegs(d, "raus"); } });
    if (s !== "raus") unterwegs(d, "raus");
    if (!s && weg) return;                    /* nicht gesendet (Tag voll): weiter sammeln, das Laufbuch behält sie */
    raumZuletzt = t;
    /* Nach einer Zeile zählt das nächste Mal nur die Zeit seitdem. */
    raum.folge++;
    raum.seit = t; raum.sicht = 0; raum.f = {}; raum.ges = [0, 0, 0]; raum.loaf = []; raum.inp = [];
    eigen({ ro: offenerRaum() });
  }
  function hoch(leute, bild) {
    if (!raum) return;
    if (leute > raum.leute) raum.leute = leute;
    if (bild > raum.bild) raum.bild = bild;
  }
  function lageWechsel(lage, t, leute, bild, haupt) {
    if (lage === "verbindet") {
      if (raum && raum.ab != null) raumSenden("wechsel");   /* Raumwechsel ohne „aus" dazwischen */
      raum = neuerRaum(t, haupt);
      return;
    }
    if (lage === "drin") {
      if (!raum) raum = neuerRaum(null, haupt);
      if (raum.ab == null) {
        raum.ab = raum.seit = t;
        raum.drin = raum.v != null ? t - raum.v : null;
        raum.haupt = haupt;
        if (drinAb == null) drinAb = rund(t);
        beobachterAn();
        markeHolen();
      }
      hoch(leute, bild);
      return;
    }
    if (lage === "aus" || lage === "fehler") {
      if (raum && raum.ab != null) raumSenden("aus");
      raum = null;
      beobachterAus();
      eigen({ ro: null });
    }
  }
  /* =========================================================
     LAUFBUCH — das Absturz-Indiz
     ========================================================= */
  var tab = "", pid = zufall(6), vorher = [], kanal = null, startT0 = Math.round(Date.now() - jetzt());
  try { tab = sessionStorage.getItem("dma-mess-tab") || ""; if (!tab) { tab = zufall(6); sessionStorage.setItem("dma-mess-tab", tab); } } catch (e) { tab = tab || zufall(6); }
  function buch(aendern) {
    var b = lesen("dma-mess-lauf");
    if (!b || typeof b !== "object") b = {};
    if (aendern) aendern(b);
    var ks = Object.keys(b);
    if (ks.length > 6) ks.sort(function (x, y) { return (b[x].z || 0) - (b[y].z || 0); }).slice(0, ks.length - 6).forEach(function (x) { delete b[x]; });
    if (aendern) schreiben("dma-mess-lauf", b);
    return b;
  }
  function eigen(felder, f) {
    buch(function (b) {
      var e = b[pid] || (b[pid] = { tab: tab, t0: startT0, f: FASSUNG, zu: 0, kz: 0 });
      for (var k in felder) if (Object.prototype.hasOwnProperty.call(felder, k)) e[k] = felder[k];
      if (f) f(e);
      e.z = Date.now();
      e.s = sichtbar() ? "v" : "h";
      e.mb = speicherMb();
      e.kz = raum && raum.ab != null ? 1 : 0;
      if (Object.prototype.hasOwnProperty.call(felder, "ro")) e.u = wer();   /* Konto zu „ro" (884b, bleibt auf dem Gerät) */
    });
  }
  /* „ru": Raumzeilen, die raus sind, aber noch nicht bestätigt (höchstens 2); ka = ging mit keepalive */
  function unterwegs(d, was) {
    eigen({}, function (e) {
      var ru = (e.ru || []).filter(function (x) { return x && x.d && (was !== "raus" || x.d.k !== d.k); });
      if (was === "rein") ru = ru.concat([{ d: d, u: wer() }]).slice(-2);
      if (was === "ka") ru.forEach(function (x) { if (x.d.k === d.k) x.ka = 1; });
      if (ru.length) e.ru = ru; else delete e.ru;
    });
  }
  function offenerRaum() { return raum && raum.seit != null ? raumBauen("offen") : null; }
  function einordnen() {
    var b = buch(), fremd = [], ab = Date.now();
    Object.keys(b).forEach(function (id) { if (id !== pid) fremd.push(id); });
    if (!fremd.length) return;
    var leben = {};
    try {
      if (kanal) {
        kanal.addEventListener("message", function (e) { if (e.data && e.data.lebt) leben[e.data.lebt] = 1; });
        kanal.postMessage({ frage: pid });
      }
    } catch (e) {}
    setTimeout(function () {
      var raus = [], spaet = [];
      /* was die tote oder geschlossene Seite nicht mehr loswurde: die offene Zusammenfassung und unbestätigte Zeilen */
      function nach(e) {
        if (e.ro) spaet.push({ d: e.ro, u: e.u || "" });
        (e.ru || []).forEach(function (x) { if (x && x.d && !x.ka) spaet.push({ d: x.d, u: x.u || "" }); });
      }
      buch(function (b2) {
        fremd.forEach(function (id) {
          var e = b2[id];
          if (!e || leben[id]) return;
          if (e.zu === 1) { nach(e); delete b2[id]; return; }
          var alt = ab - (e.z || 0), tot = e.tab === tab
            || (e.s === "v" && alt > ZEIT.tot)
            || (e.s === "h" && (kanal ? true : alt > 12 * 36e5));
          if (!tot) return;
          raus.push({ ende: e.s === "v" ? "weg" : "hinten", dauer: rund(((e.z || 0) - (e.t0 || 0)) / 1000), vor: rund(alt / 60000),
                      kz: e.kz || 0, mb: e.mb == null ? null : e.mb, f: e.f || "", eigen: e.tab === tab ? 1 : 0,
                      verworfen: e.tab === tab && document.wasDiscarded ? 1 : 0 });
          nach(e);
          delete b2[id];
        });
      });
      raus.forEach(function (x) { if (vorher.length < 3) vorher.push(x); });
      /* FASSUNG 884 (Nachprüfung 884b) — wie kisteLeeren: nie unter einem anderen Konto; ohne Anmeldung gemessen → „gast";
         ist die Sitzung noch nicht wiederhergestellt, wartet die Zeile mit ihrem Konto in der Kiste. */
      var ich = wer();
      spaet.slice(0, 3).forEach(function (x) {
        if (x.u && ich && x.u !== ich) return;
        x.d.spaet = 1;
        if (!x.u) x.d.gast = 1;
        senden("mess-raum", x.d, { frei: true, u: x.u });
      });
    }, ZEIT.ping);
  }
  try {
    if (window.BroadcastChannel) {
      kanal = new BroadcastChannel("dma-mess");
      kanal.addEventListener("message", function (e) { if (e.data && e.data.frage && e.data.frage !== pid) { try { kanal.postMessage({ lebt: pid }); } catch (x) {} } });
    }
  } catch (e) { kanal = null; }
  var abbruch = lesen("dma-mess-abbruch");
  if (abbruch) {
    schreiben("dma-mess-abbruch", null);
    vorher.push({ ende: "laden", ms: rund(abbruch.ms), bild: abbruch.bild ? 1 : 0, s: abbruch.s === "hidden" ? "h" : "v", f: String(abbruch.f || "") });
  }
  einordnen();
  eigen({});
  /* Erst jetzt (das Laufbuch steht) die gepufferten Langläufer und Raumwechsel aus index.html nachspielen – auch die
     Rückkehr in den Raum gleich nach dem Laden zählt so mit. */
  M.lang = lang;
  M.lt.splice(0).forEach(function (x) { lang(x[0], x[1]); });
  M.raumNeu = hoch;
  M.lage = lageWechsel;
  M.lg.splice(0).forEach(function (a) { lageWechsel.apply(null, a); });
  setInterval(function () {
    if (!sichtbar()) return;
    eigen({ ro: offenerRaum() });
    if (raum && raum.ab != null) markeHolen();
  }, ZEIT.herz);
  document.addEventListener("visibilitychange", function () {
    sichtWechsel(jetzt());                     /* zuerst: die Teilzeile trägt die sichtbare Zeit bis jetzt */
    if (!sichtbar()) raumSenden("hidden");
    eigen({ ro: offenerRaum() });
  });
  window.addEventListener("pagehide", function () { ende = true; raumSenden("weg"); eigen({ zu: 1, ro: offenerRaum() }); });
  window.addEventListener("pageshow", function (e) { if (e.persisted) { ende = false; eigen({ zu: 0 }); } });
  document.addEventListener("resume", function () { eigen({}); });

  /* =========================================================
     STARTZEILE
     ========================================================= */
  var lcp = null;
  try {
    if (TYPEN.indexOf("largest-contentful-paint") >= 0) {
      var lcpObs = new PerformanceObserver(function (l) { var e = l.getEntries(); if (e.length) lcp = e[e.length - 1].startTime; });
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
    }
  } catch (e) {}
  function startBauen() {
    var st = window.DMA_STEMPEL || {}, kb = 0, n = 0, cache = 0, eigenHost = location.origin;
    try {
      [nav].concat(P.getEntriesByType("resource")).forEach(function (r) {
        if (!r || !r.name || r.name.indexOf(eigenHost) !== 0 || (r.startTime || 0) >= bereitT) return;
        n++;
        kb += r.transferSize || 0;
        if (!r.transferSize && r.decodedBodySize > 0) cache++;
      });
    } catch (e) {}
    var neu = 0, c = navigator.connection, fcp = null, tipp = {};
    /* FASSUNG 885 (S1, Nachbesserung 1): „neu" = nur die ERSTE Seite nach dem Neuladen durch den Fassungs-Wächter
       (index.html?f=<diese Fassung>, Navigation „navigate"). Der Merker allein bleibt für jede weitere Seite im Tab stehen
       (Neuladen von Hand, Notweg, Rückkehr ins Klassenzimmer) – der Anteil im SQL des Logbuchs wäre sonst zu hoch. */
    try {
      neu = sessionStorage.getItem("dma-neu-geladen") === FASSUNG && nav.type === "navigate"
        && new URLSearchParams(location.search).get("f") === FASSUNG ? 1 : 0;
    } catch (e) {}
    try { fcp = (P.getEntriesByName("first-contentful-paint")[0] || {}).startTime; } catch (e) {}
    Object.keys(M.tipp).forEach(function (w) { tipp[w] = M.tipp[w].slice(0, 3); });
    var minQ = typeof DMA_Q === "function" && DMA_Q("app.js") !== "app.js";
    return {
      f: FASSUNG, bau: minQ ? (st["min/app.js"] || "?") : "quelle", ua: String(navigator.userAgent || "").slice(0, 120),
      /* FASSUNG 884 — Notweg (index.html dmaGanzLaden): 1 = diese Seite läuft mit der ganzen app.js, weil vorher ein Stück
         ausfiel. bau="quelle" allein unterscheidet das nicht von ?quelle oder dmaMinFehlt; die Teilfehler (teile[1]) stehen
         nur auf der Seite VOR dem Neuladen. Nur 0/1, kein Grundtext. */
      ganz: window.DMA_GANZ && window.DMA_GANZ["app.js"] ? 1 : 0,
      typ: nav.type || "", neu: neu, sw: navigator.serviceWorker && navigator.serviceWorker.controller ? 1 : 0, hinten: M.hinten,
      t: { ttfb: rund(nav.responseStart), fcp: rund(fcp), lcp: rund(lcp), bereit: rund(bereitT), load: rund(nav.loadEventEnd), drinAb: drinAb },
      tipp: tipp, kb: Math.round(kb / 1024), n: n, cache: cache,
      lt: [startLt[0], rund(startLt[1]), rund(startLt[2])],
      teile: [(window.DMA_TEIL_SOFORT || []).length, (window.DMA_TEIL_FEHLER || []).length],
      netz: c ? [c.effectiveType || "", c.rtt == null ? null : c.rtt, c.downlink == null ? null : c.downlink, c.saveData ? 1 : 0] : null,
      ger: [navigator.deviceMemory || null, navigator.hardwareConcurrency || null],
      vorher: vorher.slice(0, 3),
      fehler: fehlerNeu().map(function (s) { fehlerGemeldet[s] = 1; return fehler[s]; }), fehlerMehr: fehlerMehr,
      kosten: [M.kosten == null ? null : M.kosten, Math.round(kostenInit * 10) / 10]
    };
  }
  function startSenden() {
    var i = 0;
    (function versuch() {
      var los = zugang() || i >= ZEIT.warte.length - 1;
      if (!los) { i++; setTimeout(versuch, ZEIT.warte[i] - ZEIT.warte[i - 1]); return; }
      if (zugang()) kisteLeeren();
      fehlerMehrGemeldet = fehlerMehr;
      senden("mess-start", startBauen());
      startRaus = true;
      if (fehlerNeu().length) fehlerPlanen();
      try { if (lcpObs) lcpObs.disconnect(); } catch (e) {}
    })();
  }
  setTimeout(function () { ruhig(startSenden); }, ZEIT.start);

  /* Prüfhaken für die Sonde (pruefe-884-messung.js) */
  M.stand = function () {
    return { tab: tab, pid: pid, buch: buch(), fehler: fehler, fehlerMehr: fehlerMehr, raum: raum && raum.seit != null ? raumBauen("offen") : null, raumRoh: raum,
             gesendet: gesendet.slice(), kiste: kisteLesen(), tag: tagStand(), vorher: vorher.slice(), zeit: ZEIT, startRaus: startRaus,
             marke: markeGut(), sauber: sauber };
  };
  var kostenInit = jetzt() - tInit;
})();
