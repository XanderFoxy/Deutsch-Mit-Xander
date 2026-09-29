/* =====================================================================
   LEICHTE STADT — VERBINDUNG ZUM SPIEL (derselbe Spielstand)
   ---------------------------------------------------------------------
   XANDER: „dass alles, was sie schon gemacht haben in ihrer Stadt, dass
   das hier gleichzeitig läuft, nur die neuere Version ist."

   Die leichte Stadt liest denselben Spielstand wie das Dorf im Spiel
   (RPC spiel_ich) und baut über dieselben Serverfunktionen (spiel_bauen,
   spiel_bau_helfen). Die Anmeldung der Webseite gilt auch hier (gleiche
   Adresse, gleicher Speicher des Browsers). Ohne Anmeldung – oder mit
   ?demo=1 – zeigt sie eine Beispielstadt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const q = new URLSearchParams(location.search);
  const SP = (ST.spiel = { angemeldet: false, betreiber: false, beispiel: false, fehler: "" });
  let klient = null;

  function klientHolen() {
    if (klient) return Promise.resolve(klient);
    if (!window.supabase || !window.SUPABASE_CONFIG) return Promise.reject(new Error("keine Verbindung"));
    klient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
    return Promise.resolve(klient);
  }
  function rpc(name, args) {
    return klientHolen().then((k) => k.rpc(name, args || {})).then((r) => { if (r && r.error) throw r.error; return r ? r.data : null; });
  }
  SP.rpc = rpc;

  function beispiel(grund) {
    SP.beispiel = true; SP.fehler = grund || "";
    return ST.dorf.beispiel();
  }
  /* Spielstand holen: angemeldet → der echte, sonst die Beispielstadt */
  SP.stand = function () {
    if (q.get("demo") === "1") return Promise.resolve(beispiel("Vorschau"));
    return klientHolen().then((k) => k.auth.getSession()).then((a) => {
      const sitzung = a && a.data && a.data.session;
      if (!sitzung) return beispiel("nicht angemeldet");
      SP.angemeldet = true; SP.uid = sitzung.user.id;
      /* Betreiber? (profiles.is_owner – wie Backend.isOwner) */
      klient.from("profiles").select("is_owner").eq("id", SP.uid).maybeSingle().then((r) => { SP.betreiber = !!(r && r.data && r.data.is_owner); if (ST.oberflaeche && ST.oberflaeche.betreiberDa) ST.oberflaeche.betreiberDa(); }, () => {});
      return rpc("spiel_ich", {}).then((ich) => {
        SP.beispiel = false;
        /* eigener Schmuck und Drehungen liegen auf dem Server (gleich auf jedem Gerät) */
        return Promise.all([
          rpc("spiel_stadt_leicht_holen", {}).then((d) => { SP.eigenes = d || null; autosAusEigenem(d); }, () => {}),
          autosVomServer()
        ]).then(() => ich);
      });
    }).catch((e) => { console.warn(e); return beispiel("offline"); });
  };
  /* Bauen und Helfen – dieselben Serverfunktionen wie im Spiel */
  SP.bauen = function (was) { if (SP.beispiel) return Promise.reject(new Error("Beispielstadt")); return rpc("spiel_bauen", { p_was: was }); };
  SP.helfen = function (was) { if (SP.beispiel) return Promise.reject(new Error("Beispielstadt")); return rpc("spiel_bau_helfen", { p_was: was }); };
  /* FASSUNG 815 — XANDER: „mein neuen Dodge Viper und mein Batmobil habe ich immer noch nicht in der Map … Ich kann sie
     nicht dazu kaufen. Ich kann sie im Spiel überhaupt nicht ausprobieren." Die Autos (autos.js) kauft man mit den Punkten
     des Spiels über spiel_auto_kaufen (Migration supabase/spiel_815_autos_kaufen.sql, SECURITY DEFINER wie die anderen
     spiel_-Funktionen): der Server prüft die Punkte, zieht den Preis ab und merkt das Auto in spiel_spieler.autos;
     spiel_autos() liefert die Liste. Solange es diese Funktionen noch nicht gibt, wird der Besitz wie der eigene Schmuck
     gespeichert (stadt_leicht.autos, noch ohne Abbuchung) – nach der Migration übernimmt der Server diese Autos.
     Abgestellte Autos (als Schmuck) stehen in stadt_leicht.geparkt. */
  SP.autos = []; SP.autosGeparkt = []; SP.autosVorlaeufig = []; SP.autosServer = false;
  const vereinen = (a, b) => a.concat(b.filter((x) => a.indexOf(x) < 0));
  const nurNamen = (l) => (Array.isArray(l) ? l.filter((x) => typeof x === "string" && /^[a-z]{2,20}$/.test(x)) : []);
  function autosAusEigenem(d) {
    SP.autosVorlaeufig = nurNamen(d && d.autos);
    SP.autosGeparkt = nurNamen(d && d.geparkt);
    SP.autos = vereinen(SP.autos, SP.autosVorlaeufig);
  }
  const fehltFunktion = (e) => !!e && (e.code === "PGRST202" || e.code === "42883" || /Could not find the function|does not exist|schema cache/i.test(String(e.message || e)));
  function autosVomServer() {
    return SP.rpc("spiel_autos", {}).then((r) => {
      SP.autosServer = true;
      SP.autos = vereinen(nurNamen(r && (r.autos || r)), SP.autos);
    }, (e) => { SP.autosServer = !fehltFunktion(e) && SP.autosServer; });
  }
  /* Kaufen: gibt { ok, gekauft, punkte? , vorlaeufig? } zurück oder wirft mit dem Grund */
  SP.autoKaufen = function (id, preis) {
    if (SP.beispiel || !SP.angemeldet) return Promise.reject(new Error("In der Beispielstadt wird nicht gekauft – bitte anmelden (oder Probefahrt)"));
    return SP.rpc("spiel_auto_kaufen", { p_auto: id }).then((r) => {
      if (!r || r.ok === false) throw new Error((r && r.grund) || "Geht gerade nicht");
      SP.autosServer = true;
      SP.autos = vereinen(nurNamen(r.autos), vereinen(SP.autos, [id]));
      if (r.punkte != null && ST.leicht && ST.leicht.ich) ST.leicht.ich.punkte = r.punkte;
      return Object.assign({ gekauft: id }, r);
    }, (e) => {
      if (!fehltFunktion(e)) throw e;
      /* Server kennt den Autokauf noch nicht: vorläufig wie der eigene Schmuck merken */
      SP.autosVorlaeufig = vereinen(SP.autosVorlaeufig, [id]); SP.autos = vereinen(SP.autos, [id]);
      if (ST.leicht && ST.leicht.dekoSpeichern) ST.leicht.dekoSpeichern();
      return { ok: true, gekauft: id, preis: preis, vorlaeufig: true };
    });
  };
  /* Speichern mit kurzer Verzögerung (mehrere Änderungen = eine Anfrage) */
  let uhr = 0;
  SP.eigenesSpeichern = function (daten) {
    if (SP.beispiel || !SP.angemeldet) return;
    /* FASSUNG 815 — vorläufig gekaufte und abgestellte Autos gehen mit dem Schmuck mit */
    daten = Object.assign({}, daten, { autos: SP.autosVorlaeufig.slice(), geparkt: SP.autosGeparkt.slice() });
    clearTimeout(uhr);
    uhr = setTimeout(() => { SP.rpc("spiel_stadt_leicht_speichern", { p_daten: daten }).catch((e) => console.warn(e)); }, 1200);
  };
  SP.neuLaden = function () { return SP.beispiel ? Promise.resolve(ST.leicht.ich) : rpc("spiel_ich", {}); };
})();
