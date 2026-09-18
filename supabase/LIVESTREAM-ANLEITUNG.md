# Livestream startklar machen — es fehlt nur noch dein Schlüssel

> „Ich soll nur noch den API-Schlüssel eintragen müssen, und das
> Framework ist schon vorhanden und funktioniert, dass wir heute den
> Livestream starten können."

Alles, was programmiert werden musste, ist fertig — **und die zwei
technischen Schritte sind schon erledigt.** Es fehlt nur noch der
Schlüssel, und den kannst nur du holen, weil er an deinem
Cloudflare-Konto hängt.

---

## ~~Schritt 1 — Die Tabelle anlegen~~ ✅ erledigt

Die Tabelle `turn_nutzung` liegt in deinem Supabase-Projekt
(`rolcktiryrvjzbwuvobb`). Sie zählt nur mit, wie oft sich jemand am
Tag Zugangsdaten holt; der Zeilenschutz ist an und es gibt bewusst
keine Regel, die jemandem Zugriff gibt — geschrieben wird nur von der
Edge-Function.

Das SQL steht trotzdem in `supabase/klassenzimmer-relais.sql`, falls
du das Projekt einmal neu aufsetzt.

## ~~Schritt 2 — Die Funktion hochladen~~ ✅ erledigt

Die Edge-Function **klassenzimmer** ist in deinem Projekt angelegt
und steht auf ACTIVE. Der Quelltext liegt zum Nachlesen unter
`supabase/functions/klassenzimmer/index.ts`.

Sie braucht **keine** zusätzlichen Secrets: `SUPABASE_URL` und
`SUPABASE_SERVICE_ROLE_KEY` gibt Supabase jeder Function von selbst
mit.

> Geprüft habe ich sie nur bis zum Deploy — aus meiner Umgebung ist
> deine Supabase-Adresse gesperrt, ich konnte sie also nicht selbst
> aufrufen. Der Knopf **🔍 Verbindung testen** in den Einstellungen
> macht genau das und sagt dir ehrlich, was zurückkommt.

## Schritt 3 — Den Schlüssel eintragen (1 Minute)

1. **dash.cloudflare.com** → links **Realtime** → **TURN** →
   **Create**.
2. Cloudflare zeigt dir **einmal** zwei Werte:
   *TURN Token ID* und *API Token*. Beide kopieren.
3. Auf der Seite: **Profil → Einstellungen → 🛰️ Livestream-Relais**.
   Beide Werte einsetzen, **Eintragen und prüfen**.

Die Seite schickt sie an die Funktion, die Funktion fragt bei
Cloudflare nach — erst wenn Cloudflare wirklich Zugangsdaten
herausgibt, wird gespeichert. Ein falscher Wert fällt also sofort
auf und nicht erst vor Publikum.

Danach **🔍 Verbindung testen** drücken. Der Test baut eine echte
Verbindung auf, die *nur* über das Relais laufen darf, und zählt die
Wege, die zurückkommen. Kommt mindestens einer, steht der Livestream
auch dort, wo er bisher stumm blieb.

---

## Was dabei wo liegt

| | wo | wer sieht es |
|---|---|---|
| TURN Token ID | Datenbank (`betreiber_geheimnisse`) | nur die Funktion |
| API Token | Datenbank (`betreiber_geheimnisse`) | nur die Funktion |
| kurzlebige Zugangsdaten | im Browser, 2 Stunden gültig | der jeweilige Teilnehmer |

Der API Token steht **nirgends** im Repository, nirgends in der
Webseite und in keiner Fehlermeldung. Was der Browser bekommt, gilt
zwei Stunden und reicht an nichts anderes heran.

## Was es kostet

Stand September 2026 bei Cloudflare Realtime: **1.000 GB im Monat
frei**, danach 0,05 $ je Gigabyte. Über das Relais läuft nur, was
nicht direkt durchkommt — im selben WLAN also gar nichts. Eine
Stunde Unterricht zu fünft, bei der *alle* über das Relais müssen,
liegt grob bei 1 GB.

Trägst du nichts ein, ändert sich nichts: dann laufen weiter die
öffentlichen Relais von Open Relay, so wie bisher.

## Wenn etwas klemmt

Im Klassenzimmer gibt es die Diagnose-Zeile („Relais eingetragen: …").
Sie sagt jetzt auch, **woher** die Server kommen:

* `(eigenes Relais, Cloudflare)` — alles richtig.
* `(öffentliche) — Grund: kein-relais` — Schritt 3 fehlt noch.
* `(öffentliche) — Grund: nicht-erreichbar` — Schritt 2 fehlt noch.
* `(öffentliche) — Grund: tagesgrenze` — 60 Abrufe am Tag sind
  aufgebraucht; morgen wieder frei.
