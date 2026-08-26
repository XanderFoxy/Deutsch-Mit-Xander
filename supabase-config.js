/* =========================================================
   SUPABASE-KONFIGURATION
   ---------------------------------------------------------
   1. Kostenloses Projekt auf https://supabase.com anlegen.
   2. Project URL + anon public key unter
      "Project Settings -> API" kopieren und unten eintragen.
   3. Tabellen anlegen (SQL-Editor in Supabase), siehe README.md
      Abschnitt "Supabase einrichten" für die fertigen CREATE-
      TABLE-Statements (results, guestbook, daily_ranking, profiles).
   4. Seite neu laden — die App erkennt die Konfiguration
      automatisch und schaltet vom Demo-Modus auf echte Konten,
      Ranking und Gästebuch um.

   Ohne Eintragung läuft die App im vollständig funktionsfähigen
   Demo-Modus (Daten nur für die aktuelle Sitzung).
   ========================================================= */

window.SUPABASE_CONFIG = {
  url: "", // z. B. "https://xxxxxxxxxxxx.supabase.co"
  anonKey: "", // z. B. "eyJhbGciOi..."
};
