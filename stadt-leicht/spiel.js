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
        return rpc("spiel_stadt_leicht_holen", {}).then((d) => { SP.eigenes = d || null; return ich; }, () => ich);
      });
    }).catch((e) => { console.warn(e); return beispiel("offline"); });
  };
  /* Bauen und Helfen – dieselben Serverfunktionen wie im Spiel */
  SP.bauen = function (was) { if (SP.beispiel) return Promise.reject(new Error("Beispielstadt")); return rpc("spiel_bauen", { p_was: was }); };
  SP.helfen = function (was) { if (SP.beispiel) return Promise.reject(new Error("Beispielstadt")); return rpc("spiel_bau_helfen", { p_was: was }); };
  /* Speichern mit kurzer Verzögerung (mehrere Änderungen = eine Anfrage) */
  let uhr = 0;
  SP.eigenesSpeichern = function (daten) {
    if (SP.beispiel || !SP.angemeldet) return;
    clearTimeout(uhr);
    uhr = setTimeout(() => { rpc("spiel_stadt_leicht_speichern", { p_daten: daten }).catch((e) => console.warn(e)); }, 1200);
  };
  SP.neuLaden = function () { return SP.beispiel ? Promise.resolve(ST.leicht.ich) : rpc("spiel_ich", {}); };
})();
