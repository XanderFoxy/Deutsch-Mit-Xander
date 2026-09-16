# Deutsch mit Alex — Anleitung

Eine vollständige, spielbare Lern-App: 10 Übungskategorien mit Zufallsfragen,
Bonuspunkten, Auswertung mit Charakter-Typen & Abzeichen, Vokabeltrainer,
Memory, Kompass, Materialien, Profil/Login, Tagesranking, Gästebuch und ein
Premium-Bereich.

## 1. Welche Dateien brauche ich?

**Alle Dateien in diesem Ordner** — nichts weglassen, nichts umbenennen:

```
deutsch-mit-alex/
├─ index.html            ← die Seite selbst (Startpunkt)
├─ styles.css             ← Grunddesign (Header, Über mich)
├─ app-styles.css         ← Design für Übungen, Profil, Memory usw.
├─ core.js                ← kleine Helferfunktionen
├─ data-exercises.js      ← alle Fragen der 10 Übungskategorien
├─ data-vocab.js          ← Vokabeln, Kompass-Partikeln, Materialien, Links
├─ backend.js             ← Login/Ranking/Gästebuch-Logik
├─ supabase-config.js     ← hier trägst du später deine Supabase-Zugangsdaten ein
├─ quiz.js                ← die Spiel-Engine (Fragen, Punkte, Auswertung)
├─ app.js                 ← verbindet alles miteinander
└─ manifest.webmanifest   ← macht die Seite als App installierbar
```

Alle Dateien liegen **auf derselben Ebene**, keine Unterordner nötig.

## 2. Wie sehe ich mir die Seite an?

**Lokal testen** (empfohlen, da Wetter-Abruf eine echte Adresse braucht):
1. Terminal im Ordner öffnen
2. `npx serve .` eingeben (oder `python3 -m http.server 5500`)
3. Die angezeigte Adresse (z. B. `http://localhost:3000`) im Browser öffnen

**Direkt online stellen mit GitHub Pages** (wie deine bestehende Seite):
1. Alle Dateien aus diesem Ordner in dein GitHub-Repo hochladen (z. B. in
   `XanderFoxy/Deutsch`) — einfach per Drag & Drop auf github.com, Ordnerebene
   wie oben gezeigt.
2. Unter „Settings → Pages" GitHub Pages aktivieren (Branch `main`, Ordner `/`).
3. Nach 1–2 Minuten ist die Seite unter deiner `github.io`-Adresse live.

## 3. Was funktioniert sofort — ganz ohne Einrichtung?

Alles! Übungen, Vokabeltrainer, Memory, Kompass, Materialien — läuft direkt.
Login, Ranking, Gästebuch und Premium laufen im **Demo-Modus**: voll
funktionsfähig, aber die Daten leben nur, solange der Tab offen ist (kein
eigener Server nötig). Eine gelbe Hinweisbox im Profil-Bereich zeigt das an.

## 4. Dauerhafte Konten & Ranking mit Supabase (kostenlos, optional)

1. Kostenloses Projekt auf [supabase.com](https://supabase.com) anlegen.
2. Unter „Project Settings → API" die **Project URL** und den **anon public
   key** kopieren.
3. In `supabase-config.js` eintragen:
   ```js
   window.SUPABASE_CONFIG = {
     url: "https://DEIN-PROJEKT.supabase.co",
     anonKey: "DEIN-ANON-KEY",
   };
   ```
4. Im SQL-Editor von Supabase folgende Tabellen anlegen:
   ```sql
   create table results (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users,
     categories text[], points int, bonus int, percent int,
     character text, played_at timestamptz default now()
   );

   create table guestbook (
     id uuid default gen_random_uuid() primary key,
     name text, message text, date timestamptz default now(), user_id uuid references auth.users
   );

   create table daily_ranking (
     name text, points int, date date default current_date, user_id uuid references auth.users
   );

   create table profiles (
     id uuid references auth.users primary key,
     name text, points int default 0, badges text[] default '{}', trophies text[] default '{}',
     is_premium boolean default false, theme text default 'bastelheft', bio text default '',
     birthday text default '', avatar_url text default '', avatar_emoji text default '',
     gallery text[] default '{}', hobbies text[] default '{}', origin text default '', is_admin boolean default false, is_owner boolean default false, is_moderator boolean default false, gifted_categories text[] default '{}', gifted_themes text[] default '{}',
     languages text[] default '{}', fav_movie text default '', fav_series text default '', fav_song text default '', fav_food text default '', poem text default '',
     last_active timestamptz, created_at timestamptz default now()
   );

   create table community_texts (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users, author_name text,
     title text, level text, body text, cover_url text,
     status text default 'pending', created_at timestamptz default now()
   );
   alter table community_texts add column if not exists cover_url text;
   create table community_text_likes (
     id uuid default gen_random_uuid() primary key,
     text_id uuid references community_texts, user_id uuid references auth.users,
     created_at timestamptz default now()
   );
   create table community_text_comments (
     id uuid default gen_random_uuid() primary key,
     text_id uuid references community_texts, user_id uuid references auth.users,
     author_name text, body text, created_at timestamptz default now()
   );
   alter table community_text_likes disable row level security;
   alter table community_text_comments disable row level security;

   create table friends (
     id uuid default gen_random_uuid() primary key,
     user_a uuid references auth.users, user_b uuid references auth.users,
     status text default 'pending', requested_by uuid references auth.users
   );

   create table challenges (
     id uuid default gen_random_uuid() primary key,
     from_user uuid references auth.users, to_user uuid references auth.users,
     categories text[], from_result jsonb, to_result jsonb,
     extra jsonb,
     status text default 'pending', winner uuid, created_at timestamptz default now()
   );

   create table activity (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users, text text, date timestamptz default now()
   );
   ```
5. Seite neu laden — die App erkennt die Konfiguration automatisch und
   nutzt ab dann echte Konten statt des Demo-Modus.

**Wichtig — E-Mail-Bestätigung:** Supabase verlangt standardmäßig, dass
neue Nutzer erst auf einen Bestätigungslink in ihrer E-Mail klicken,
bevor der Login funktioniert (sonst kommt "Invalid login credentials").
Das kann für Freunde/Tester verwirrend sein. Zwei Optionen:
- **So lassen:** Nutzer bekommen nach der Registrierung automatisch den
  Hinweis "Bitte E-Mail bestätigen" — sie müssen nur den Link anklicken.
- **Abschalten (schneller zum Testen):** Im Supabase-Dashboard →
  "Authentication" → "Providers" → "Email" → "Confirm email" auf **aus**
  stellen. Dann kann man sich sofort nach der Registrierung einloggen.

## 4b. Fotos hochladen (Profilbild) — einmalig einrichten

1. Supabase-Dashboard → **Storage** → „New bucket" → Name: `avatars` → **Public bucket** anhaken → erstellen.
2. Im **SQL-Editor** zusätzlich diese Regel ausführen (sonst darf niemand hochladen, nur ansehen):
   ```sql
   create policy "Authenticated uploads to avatars"
   on storage.objects for insert
   to authenticated
   with check (bucket_id = 'avatars');

   create policy "Authenticated updates to avatars"
   on storage.objects for update
   to authenticated
   using (bucket_id = 'avatars');
   ```
3. Fertig — die Seite lädt Fotos jetzt automatisch dorthin hoch, sobald jemand im Profil auf sein Bild tippt.

### Dateien am Profil (PDF, MP3) — einmalig freischalten

Seit dem Update kann man am Profil nicht nur Fotos, sondern auch **PDF- und
MP3-Dateien** ablegen, und beim Auswählen **mehrere Dateien auf einmal**.
Die Liste selbst wird in `profiles.extra_profile_data` gespeichert — dafür ist
**keine neue Spalte** nötig. Nur der Speicher-Bucket muss die neuen Dateitypen
erlauben. Im **SQL-Editor** ausführen:

```sql
-- Erlaubte Dateitypen und Maximalgröße (15 MB) für den avatars-Bucket setzen.
-- Ohne diese Zeile lehnt Supabase PDF- und MP3-Uploads mit einem "mime type"-Fehler ab.
update storage.buckets
set allowed_mime_types = array[
      'image/png','image/jpeg','image/jpg','image/gif','image/webp','image/svg+xml',
      'application/pdf','audio/mpeg','audio/mp3'
    ],
    file_size_limit = 15728640
where id = 'avatars';

-- Löschen der eigenen Dateien erlauben (nötig für den ✕-Knopf in der Dateiliste).
create policy "Authenticated deletes from avatars"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars');
```

Wenn `allowed_mime_types` vorher `null` war (also alles erlaubt), kann man die
erste Anweisung auch weglassen — dann funktionieren PDF und MP3 sofort.

## 4c. Community-Texte direkt in der App freischalten (Admin)

Wenn du (oder jemand, dem du Admin-Rechte gibst) im Profil auf "Bearbeiten"
gehst — nein, das läuft automatisch: Sobald dein Konto als Admin markiert
ist, siehst du direkt oben im Profil einen Bereich "🛠️ Verwaltung" mit allen
wartenden Texten samt "✅ Freischalten"/"✕ Ablehnen"-Buttons. Kein
Supabase-Zugriff mehr nötig für den laufenden Betrieb.

**Einmalig: dich selbst als Betreiber markieren.** Das muss einmal per SQL
passieren, da die App niemandem erlauben darf, sich selbst diese Rolle zu
geben. Der Betreiber-Status (👑) ist von normalen Admin-Rechten (🛡️) getrennt
und wird auf der ganzen Seite mit einer kleinen Krone angezeigt, überall wo
dein Name auftaucht. Im SQL-Editor:

```sql
update profiles set is_admin = true, is_owner = true where name = 'XanderFox';
```

(Namen anpassen, falls dein Profilname anders lautet.) Ab dann kannst du
über das Profil-Popup jeder anderen Person Admin-Rechte geben oder wieder
entziehen — komplett ohne SQL. Die Personen, denen du Admin-Rechte gibst,
bekommen automatisch ein sichtbares 🛡️-Abzeichen neben ihrem Namen (überall
auf der Seite), damit für alle erkennbar ist, wer Admin ist. Nur du bleibst
als 👑 Betreiber gekennzeichnet — das kann niemand über die App vergeben,
auch andere Admins nicht.

## 4d. Community-Texte per SQL freischalten (Alternative)

Geht weiterhin auch klassisch: Supabase → **Table Editor** →
`community_texts` → bei der gewünschten Zeile die Spalte `status` von
`pending` auf `approved` ändern.

## 4e. Nachrüst-SQL — einmal alles auf den neuesten Stand bringen

Wenn irgendwo Fehler wie „Profil konnte nicht geladen werden" oder
„Could not find table community_text_likes" auftauchen, fehlen meist einfach
neue Spalten oder Tabellen, die zu einem späteren Zeitpunkt dazugekommen
sind. Dieser komplette Block ist **gefahrlos mehrfach ausführbar** (nichts
wird überschrieben, nur ergänzt) — einfach alles auf einmal in den
Supabase SQL-Editor einfügen und ausführen:

```sql
-- Damit eine Herausforderung die Wortliste des Herausforderers mitnehmen
-- kann: beide spielen dann mit denselben Wörtern. Fehlt die Spalte, geht
-- die Herausforderung trotzdem raus — nur eben ohne die Wörter.
alter table challenges add column if not exists extra jsonb;

-- Ab Version 163 braucht es KEINE neue Spalte und KEINE neue Tabelle.
-- Der Italienischkurs, die Wörterbuch-Vorschläge und die Bilder der
-- Beiträge legen ihre Daten als gewöhnliche Zeilen in site_content ab:
--   it_kurs_zugang     wer den Italienischkurs öffnen darf
--   wortschatz_zusatz  die freigegebenen, nachgetragenen Wörter
--   beitrag_bilder     hochgeladene Bilder statt der Platzhalter-Kacheln
-- Der italienische Punktestand liegt in profiles.extra_profile_data
-- unter itPunkte, der Kursfortschritt unter itKurs. Wer site_content
-- schon hat, muss also nichts tun.

-- Neuere Profil-Spalten nachrüsten
alter table profiles add column if not exists is_admin boolean default false;
alter table profiles add column if not exists is_owner boolean default false;
alter table profiles add column if not exists gifted_categories text[] default '{}';
alter table profiles add column if not exists gifted_themes text[] default '{}';
alter table profiles add column if not exists is_moderator boolean default false;
alter table profiles add column if not exists languages text[] default '{}';
alter table profiles add column if not exists fav_movie text default '';
alter table profiles add column if not exists fav_series text default '';
alter table profiles add column if not exists fav_song text default '';
alter table profiles add column if not exists fav_food text default '';
alter table profiles add column if not exists poem text default '';
alter table profiles add column if not exists fav_drink text default '';
alter table profiles add column if not exists fav_country text default '';
alter table profiles add column if not exists fav_quote text default '';
-- Vorausschauend ergänzt für spätere Profil-Gestaltung (z. B. ein großes Titelbild-Foto, getrennt vom kleinen Profilbild):
alter table profiles add column if not exists profile_banner_url text default '';
-- Beta-Tester/Mitgestalter:innen/Unterstützer:innen-Rollen sowie dauerhaft freigeschaltete
-- Sammelfiguren (verhindert, dass eine Figur bei einer kurzzeitig fehlschlagenden Neuberechnung
-- der Freischalt-Bedingung erneut als "neu freigeschaltet" gemeldet wird):
alter table profiles add column if not exists is_beta_tester boolean default false;
alter table profiles add column if not exists is_contributor boolean default false;
alter table profiles add column if not exists is_supporter boolean default false;
alter table profiles add column if not exists collected_figures text[] default '{}';
-- Eindeutiger Constraint für daily_ranking — nötig, damit ein Tages-Gesamtstand pro Person und
-- Tag zuverlässig aktualisiert (statt dupliziert) werden kann, ohne die "Fuchs des Tages/der
-- Woche/..."-Berechnung durch mehrere Zeilen pro Tag zu verfälschen.
alter table daily_ranking add column if not exists user_id uuid references auth.users;
create unique index if not exists daily_ranking_user_date_idx on daily_ranking (user_id, date);
-- Flexibles Zusatzfeld: nimmt künftige kleine Profil-Angaben (weitere "Lieblings-..."-Felder,
-- kurze Textangaben) auf, OHNE dass dafür noch einmal SQL nötig wird — kommt ein neuer
-- kleiner Wunsch dazu, wird er einfach hier mit hineingepackt, kein Nachrüsten mehr nötig.
alter table profiles add column if not exists extra_profile_data jsonb default '{}';

create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users, message text,
  read boolean default false, created_at timestamptz default now()
);
alter table notifications disable row level security;

-- Likes & Kommentare für Community-Texte
create table if not exists community_text_likes (
  id uuid default gen_random_uuid() primary key,
  text_id uuid references community_texts, user_id uuid references auth.users,
  created_at timestamptz default now()
);
create table if not exists community_text_comments (
  id uuid default gen_random_uuid() primary key,
  text_id uuid references community_texts, user_id uuid references auth.users,
  author_name text, body text, created_at timestamptz default now()
);
alter table community_text_likes disable row level security;
alter table community_text_comments disable row level security;

-- Cover-Bild für eingereichte Beiträge (falls die Tabelle schon vor dieser Funktion angelegt wurde)
alter table community_texts add column if not exists cover_url text;
-- Dasselbe flexible Prinzip für Beiträge und Kommentare, für zukünftige kleine Ergänzungen:
alter table community_texts add column if not exists extra_data jsonb default '{}';
alter table community_text_comments add column if not exists extra_data jsonb default '{}';

-- Privates Postfach: Nachrichten zwischen Freunden + automatische System-Zusammenfassungen nach gespielten Runden
create table if not exists private_messages (
  id uuid default gen_random_uuid() primary key,
  from_user uuid references auth.users,
  to_user uuid references auth.users,
  author_name text, body text, is_system boolean default false,
  read boolean default false, created_at timestamptz default now()
);
-- Einzeln nachgerüstet statt nur in der obigen create-Anweisung: falls die Tabelle schon aus
-- einer früheren Sitzung existiert, tut "create table if not exists" alleine nichts mehr für
-- neue Spalten — deshalb hier zusätzlich einzeln, damit es garantiert nachgezogen wird:
alter table private_messages add column if not exists image_url text;
alter table private_messages add column if not exists deleted_by_sender boolean default false;
alter table private_messages add column if not exists deleted_by_recipient boolean default false;
alter table private_messages disable row level security;

-- Dich selbst als Betreiber markieren (Namen ggf. anpassen)
update profiles set is_admin = true, is_owner = true where name = 'XanderFox';
```

**Wichtig:** Das ist jetzt die einzige SQL-Stelle, die du brauchst — ab sofort
gebe ich dir bei jeder neuen Datenbank-Änderung immer diesen **kompletten**
Block erneut (nie mehr nur eine einzelne Zeile), damit du nie wieder raten
musst, was du schon hast und was noch fehlt. Einfach immer den ganzen Block
neu reinkopieren — er überschreibt nichts, ergänzt nur, was fehlt.

## 5. Neue Beispiele/Fragen hinzufügen

Jede Kategorie liegt als einfaches Array in `data-exercises.js`. Neue Zeile
im passenden Array ergänzen, z. B. bei „wenn/ob":
```js
["Ich frage mich, ___ das klappt.", "ob", "Kurze Erklärung."],
```
Wörter für den Vokabeltrainer trägst du in `data-vocab.js` unter `WORDS` ein.

## 6. Premium-Inhalte — wichtiger Hinweis

Die App zeigt einen Premium-Bereich mit PayPal-Unterstützer-Button und einem
Demo-Freischalt-Button zum Testen. Eine **echte** automatische Freischaltung
nach Zahlung braucht zusätzlich eine kleine Server-Funktion (z. B. eine
Supabase Edge Function, die auf einen PayPal-Webhook reagiert und
`is_premium` in der Datenbank setzt) — das ist mit reinem GitHub-Pages-Hosting
allein nicht möglich und wäre ein separater nächster Schritt.

## 7. Aktueller Stand ehrlich zusammengefasst

- **Fertig & spielbar:** alle 10 Kategorien, Schwierigkeitsgrade, Bonuspunkte,
  Auswertung mit Charakteren/Abzeichen, Vokabeltrainer, Memory, Kompass,
  Materialien, Links, Login/Profil, Ranking, Gästebuch, Premium-Ansicht.
- **Datenpools:** aktuell 25–90 Beispiele je Kategorie (insgesamt über 400
  Fragen) statt der ursprünglich gewünschten 100 pro Kategorie — jederzeit
  leicht erweiterbar nach dem Muster in Abschnitt 5.
- **Persistenz:** ohne Supabase-Verbindung nur pro Sitzung (Demo-Modus).

## 8. Nachrüst-SQL — Musik-Player (Playlist & Favoriten)

Für den Musik-Player (Admin-verwaltete Playlist mit Favoriten) fehlen noch zwei
Tabellen. Einmal im Supabase SQL-Editor ausführen:

```sql
create table if not exists playlist_songs (
  id uuid default gen_random_uuid() primary key,
  title text, url text,
  added_by uuid references auth.users,
  owner_id uuid references auth.users, -- leer = gemeinsame Playlist, sonst die eigene Playlist dieser Person
  recommended_by_name text, -- gesetzt, wenn der Song von einer anderen Person übernommen wurde
  created_at timestamptz default now()
);
alter table playlist_songs disable row level security;
-- Falls die Tabelle schon vor der Playlist-Funktion angelegt wurde, Spalten nachrüsten:
alter table playlist_songs add column if not exists owner_id uuid references auth.users;
alter table playlist_songs add column if not exists recommended_by_name text;
alter table playlist_songs add column if not exists cover_url text;
alter table playlist_songs add column if not exists hidden boolean default false;
alter table playlist_songs add column if not exists original_recommender_id uuid references auth.users;
alter table playlist_songs add column if not exists original_recommender_name text;

-- Sympathie-System: bewusst rein freundschaftliche Stufen, eigene Tabelle mit RLS, damit
-- die Angaben PRIVAT bleiben, bis beide Seiten sich gegenseitig markiert haben (Match).
create table if not exists friend_sympathy (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references auth.users not null,
  to_user_id uuid references auth.users not null,
  level text not null,
  created_at timestamptz default now(),
  unique(from_user_id, to_user_id)
);
alter table friend_sympathy enable row level security;
create policy "Eigene Sympathie-Angaben lesen" on friend_sympathy for select using (auth.uid() = from_user_id);
create policy "Sympathie-Angaben für andere über mich lesen (für Match-Check)" on friend_sympathy for select using (auth.uid() = to_user_id);
create policy "Eigene Sympathie-Angaben schreiben" on friend_sympathy for insert with check (auth.uid() = from_user_id);
create policy "Eigene Sympathie-Angaben aktualisieren" on friend_sympathy for update using (auth.uid() = from_user_id);

create table if not exists song_favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users, song_id uuid references playlist_songs,
  created_at timestamptz default now()
);
alter table song_favorites disable row level security;
```

## 9. Nachrüst-SQL — Seiteninhalte ("Über mich" direkt bearbeiten)

Für die Inline-Bearbeitung der "Über mich"-Sektion (als Admin direkt Text/Foto ändern können,
ohne Code anzufassen) einmal im Supabase SQL-Editor ausführen:

```sql
create table if not exists site_content (
  key text primary key,
  value jsonb
);
alter table site_content disable row level security;
```

## 10. Nachrüst-SQL — Fehlermeldungen (Bug-Reports)

Damit Nutzer bei jeder Übung einen Fehler melden können und du sie gesammelt im
Admin-Bereich siehst, einmal im Supabase SQL-Editor ausführen:

```sql
create table if not exists bug_reports (
  id uuid default gen_random_uuid() primary key,
  reporter_name text, context text, category text, description text,
  resolved boolean default false, created_at timestamptz default now()
);
alter table bug_reports disable row level security;
alter table bug_reports add column if not exists reporter_id uuid references auth.users;
```

## 11. Nachrüst-SQL — Sterne-Bewertung im Gästebuch

Damit Besucher optional eine 5-Sterne-Bewertung zu ihrem Gästebuch-Eintrag abgeben können,
einmal im Supabase SQL-Editor ausführen:

```sql
alter table guestbook add column if not exists rating integer;
```

## 12. Nachrüst-SQL — Profil-Besucher & Profil-Spuren

Für "wer hat mein Profil besucht" (nur für Admins/Moderatoren sichtbar) und die Möglichkeit,
kurze Grüße auf fremden Profilen zu hinterlassen, einmal im Supabase SQL-Editor ausführen:

```sql
create table if not exists profile_visits (
  id uuid default gen_random_uuid() primary key,
  visitor_id uuid references auth.users, visitor_name text,
  visited_id uuid references auth.users, visited_at timestamptz default now(),
  unique(visitor_id, visited_id)
);
alter table profile_visits disable row level security;

create table if not exists profile_notes (
  id uuid default gen_random_uuid() primary key,
  profile_owner_id uuid references auth.users,
  author_id uuid references auth.users, author_name text,
  message text, created_at timestamptz default now()
);
alter table profile_notes disable row level security;
```

## 13. Nachrüst-SQL — Links vorschlagen & Schwarmwissen teilen

Diese zwei Tabellen fehlten bisher komplett im Nachrüst-SQL, obwohl die Funktionen (Links
vorschlagen unter "Weiterführende Links", Tipps teilen unter "Schwarmwissen") im Code schon
länger fertig sind. Einmal im Supabase SQL-Editor ausführen:

```sql
create table if not exists user_links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users, author_name text,
  title text, url text, "desc" text,
  status text default 'pending', -- 'pending', 'approved'
  created_at timestamptz default now()
);
alter table user_links disable row level security;

create table if not exists community_tips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users, author_name text,
  text text, link text, image_url text,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table community_tips disable row level security;
```

## 14. Aussprache-Trainer — Kreiselanzeige und automatischer Ablauf

### Was sich geändert hat

**Die Note steht jetzt in einem Ring**, nicht mehr in einem Balken: eine Prozentzahl in
der Mitte, der Ring füllt sich von Rot über Bernstein nach Grün, und ein kleiner Strich
auf dem Ring zeigt die Schwelle, ab der es weitergeht. Ohne diese Marke wäre die
Prozentzahl eine Zahl ohne Ziel.

**Es läuft von selbst.** Das Wort wird vorgesprochen, das Mikrofon geht an, und sobald
jemand aufhört zu sprechen, wird ausgewertet — ohne Knopfdruck. Ab der eingestellten
Schwelle (60 / 70 / 80 / 90 %, voreingestellt 80) geht es zum nächsten Wort; darunter
kommt dasselbe Wort noch einmal. Nach drei erfolglosen Anläufen hört das Automatische
auf und überlässt die Entscheidung dem Menschen — an einem Wort hängenzubleiben bringt
niemandem etwas.

Das Automatische lässt sich jederzeit abschalten (der Knopf steht unter der Anzeige, und
die Einstellung wird gemerkt). Alle Knöpfe von früher funktionieren weiter.

**Die Laut-Anzeige ("Laut für Laut") ist zugeklappt**, nicht weg. Sie ist die einzige
Stelle, die wirklich sagt, WAS schiefging — aber sie soll nicht als Erstes ins Auge
springen. Der eine wichtige Satz („dein ö klang wie ein o") steht auch ohne Aufklappen
unter dem Ring.

### Der Fehler, der „0 % Aussprache" verursacht hat

Azure liefert die Noten je nach Fassung des Dienstes an zwei verschiedenen Stellen:

```
A)  NBest[0].PronunciationAssessment.PronScore     ← wurde gelesen
B)  NBest[0].PronScore                             ← wurde NICHT gelesen
```

Kam eine Antwort in Schreibweise B, war das gesuchte Unterobjekt leer. Es stand also
gar kein Wert da — in der Anzeige wurde daraus eine 0. Nicht Azure hat null gemeldet,
es fehlte nur die Stelle zum Nachsehen.

Jetzt wird an beiden Stellen nachgesehen, auf jeder Ebene (Gesamtnote, Wort, Silbe,
Laut). Fehlt die Gesamtnote trotzdem, wird sie aus den Wortnoten gemittelt. Und steht
wirklich nirgends eine Zahl, heißt das „keine Bewertung" — dann misst die App eine
Stufe tiefer weiter, statt eine Null zu erfinden.

**Einrichtung:** unverändert. Schlüssel und Region trägt der Betreiber weiterhin unter
Profil → Einstellungen ein (Tarif F0 ist kostenlos). Ohne Schlüssel läuft alles wie
bisher auf Stufe 2 oder 3.

**Kein SQL nötig.** Am Aussprache-Trainer ändert sich nichts an der Datenbank.

## 15. Live-Chat — acht runde Plätze mit Video und Chat

### Was es ist

Ein neuer Bereich unter **Wissen → 💬 Live-Chat**: acht runde Plätze (vier oben, vier
darunter, durchnummeriert), mit dem Gesicht darin. Ein Platz angetippt zeigt ihn groß in
einem runden Pop-up. Darunter ein ganz normaler Chat zum Schreiben. Ein Einladungslink
holt andere in denselben Raum.

Das **Klassenzimmer bleibt unverändert daneben bestehen.** Es geht einen anderen Weg
(Jitsi) und kommt dadurch auch durch Netze, in denen Direktverbindungen gesperrt sind.
Der Live-Chat ist der schöne Weg, das Klassenzimmer der sichere.

### Warum das nicht im Klassenzimmer eingebaut werden konnte

Das Klassenzimmer zeigt einen Jitsi-Rahmen — eine fremde Seite innerhalb unserer Seite.
Was darin gezeichnet wird, gehört nicht uns: man kann es nicht in Kreise schneiden, nicht
numerieren und keinen eigenen Chat daneben setzen. Der Browser lässt niemanden über diese
Grenze greifen, und das ist auch richtig so. Für runde, anklickbare, numerierte Plätze
müssen die Bilder in **eigenen** Videofeldern liegen — deshalb `livechat.js`.

### Einrichtung in Supabase

**Es ist nichts einzurichten.** Das ist keine Nachlässigkeit, sondern folgt aus dem
Aufbau:

* Ton und Bild gehen **direkt von Gerät zu Gerät** (WebRTC) und laufen überhaupt nicht
  über Supabase.
* Supabase überträgt nur den Zettelaustausch „so erreichst du mich" und die
  Chat-Nachrichten — über **Realtime Broadcast**. Broadcast braucht keine Tabelle, keine
  Spalte und keine RLS-Regel; es ist ein reiner Nachrichtenkanal über die schon
  bestehende WebSocket-Verbindung.
* Der Chat lebt deshalb, solange der Raum lebt. Wird er geschlossen, ist er weg. Das
  steht auch in der Oberfläche, damit niemand glaubt, dort stünde später noch etwas.

Voraussetzung ist nur, dass `supabase-config.js` ausgefüllt ist — das ist es bereits.
Fehlt sie oder kann der Browser kein WebRTC, sagt der Bereich das in einem Satz und
verweist aufs Klassenzimmer, statt leere Kreise zu zeigen.

Wer den Chat **dauerhaft** speichern möchte (Verlauf nach dem Schließen), braucht dafür
eine Tabelle. Das ist bewusst NICHT eingebaut — ein mitgeschriebenes Gespräch ist etwas
anderes als ein flüchtiger Chat, und das sollte eine bewusste Entscheidung sein, keine
Nebenwirkung. Falls gewünscht, wäre das der Ansatz:

```sql
-- NUR nötig, wenn der Chatverlauf dauerhaft gespeichert werden soll.
create table if not exists livechat_nachrichten (
  id uuid default gen_random_uuid() primary key,
  raum text not null,
  user_id uuid references auth.users,
  autor text,
  text text,
  created_at timestamptz default now()
);
create index if not exists livechat_raum_idx on livechat_nachrichten (raum, created_at);
alter table livechat_nachrichten enable row level security;

-- Lesen und schreiben darf jeder, der den Raumnamen kennt — genau wie beim Raum selbst.
create policy "livechat lesen"    on livechat_nachrichten for select using (true);
create policy "livechat schreiben" on livechat_nachrichten for insert with check (true);
```

### Grenzen, ehrlich

* **Acht Plätze sind die Obergrenze des Verfahrens, keine Zierde.** Bei „jeder mit
  jedem" hat jeder so viele Verbindungen, wie andere da sind — bei acht Leuten sieben
  pro Gerät. Das trägt ein normales Telefon; bei zwanzig wäre es vorbei. Wer als
  Neunter kommt, kann mitlesen und schreiben.
* **Hinter manchen Firmen- und Schulnetzen** kommt eine Direktverbindung nicht zustande
  (dafür bräuchte es einen sogenannten TURN-Server, und der kostet Geld). Dann bleibt
  das Klassenzimmer.
* **Nichts wird aufgezeichnet.** Weder Ton noch Bild noch Chat.

### Sicherungskopien

Vor dem Umbau wurden Kopien aller angefassten Dateien abgelegt — siehe `sicherung/`.
Dort steht auch, wie man den alten Stand zurückholt.

## 16. Der Azure-Schlüssel gilt jetzt für alle (Fassung 177)

### Das Problem

Der Schlüssel lag im `localStorage` des Browsers — also in **einem** Gerät. Auf jedem
anderen Telefon, auch auf einem zweiten eigenen, war er nicht da, und der
Aussprache-Trainer fiel stillschweigend auf Stufe 3 zurück. Im Umkehrschluss heißt das:
für **niemanden** außer auf dem einen Gerät lief die Laut-Bewertung.

Von Lernenden zu verlangen, sich selbst bei Azure ein Konto anzulegen, ist keine Lösung.

### Warum der Schlüssel nicht einfach in die Webseite kann

Ein Schlüssel, den die Webseite kennt, ist ein öffentlicher Schlüssel. Die Webseite läuft
im Browser jedes Besuchers — man kann ihn dort weder verstecken noch verschlüsseln: was
der Browser entschlüsseln kann, kann auch der Besucher entschlüsseln. Wer ihn findet,
kann ihn auf deine Rechnung benutzen.

Dasselbe gilt für eine normale Supabase-Tabelle: alles, was die Webseite mit dem
öffentlichen `anonKey` lesen darf, darf jeder lesen.

### Wie es jetzt aufgebaut ist

```
Browser                     Supabase (Server)              Azure
   │                              │                          │
   │ Aufnahme + Anmeldung         │                          │
   ├─────────────────────────────►│                          │
   │                              │ liest den Schlüssel      │
   │                              │ aus der gesperrten       │
   │                              │ Tabelle                  │
   │                              ├─────────────────────────►│
   │                              │◄─────────────────────────┤
   │◄─────────────────────────────┤   Noten, Laut für Laut   │
   │   Noten (kein Schlüssel)     │                          │
```

* **Edge-Function `aussprache`** (`supabase/functions/aussprache/index.ts`): der einzige
  Ort, der den Schlüssel kennt. Sie ist bereits im Projekt bereitgestellt.
* **Tabelle `betreiber_geheimnisse`**: RLS ist an und es gibt **absichtlich keine einzige
  Policy**. Damit kommt aus dem Browser niemand heran — auch der Betreiber nicht. Nur die
  Edge-Function liest sie, weil sie mit dem `service_role`-Schlüssel arbeitet.
* **Tabelle `azure_nutzung`**: zählt je Person und Tag mit. Bei 300 Bewertungen am Tag
  macht die Funktion zu, damit nicht ein Einzelner die kostenlose Monatsmenge für alle
  aufbraucht.
* Nur **angemeldete** Lernende kommen durch (`verify_jwt`, und die Funktion prüft es
  zusätzlich selbst). Den Schlüssel **eintragen** darf nur, wer in `profiles.is_owner`
  steht — geprüft an der Datenbank, nicht an etwas, das der Browser mitschickt.

### Was zu tun ist — einmal, in der App

1. Als Betreiber anmelden → **Profil → Einstellungen**
2. Kasten „🗣️ Laut-Bewertung & Vorlese-Stimme (Azure)"
3. Schlüssel und Region (`westeurope`) eintragen → **„Für alle eintragen"**
4. **„Stimme anhören"** — dann hörst du genau das, was deine Lernenden hören werden.

Die App prüft den Schlüssel bei Azure, **bevor** sie ihn speichert. Ein falscher
Schlüssel wird nicht angenommen — sonst fiele er erst dem nächsten Lernenden auf, und der
hielte es für seinen eigenen Fehler.

Danach hat **jede angemeldete Person** ohne eigenes Zutun:

* die Bewertung **Laut für Laut** (Stufe 1),
* und die **neuronale Vorlese-Stimme** von Azure (`de-DE-KatjaNeural`, italienisch
  `it-IT-ElsaNeural`) — dieselbe Technik, mit der Wörterbücher ihre Aussprachebeispiele
  erzeugen.

Der alte Weg (Schlüssel im eigenen Gerät) bleibt als Rückfallebene bestehen und wird nur
noch genommen, wenn der Server einmal nicht antwortet.

### Die Vorlese-Stimme

Vorgesprochen wird in dieser Reihenfolge:

1. die **vorproduzierte** Aufnahme, wenn es für das Wort eine gibt (kostet nichts),
2. die **neuronale Stimme von Azure**,
3. die Stimme des **Geräts** (klingt je nach Telefon sehr verschieden, ist aber immer da
   — auch ohne Netz).

Was einmal geholt wurde, bleibt für die Sitzung im Speicher. Ohne das kostete jedes
„noch einmal vorsprechen" eine neue Anfrage.

Nebeneffekt: weil jetzt für **jedes** Wort eine Aufnahme da ist, lassen sich die beiden
Wellenformen (Original und eigene) nebeneinanderlegen. Vorher ging das nur bei den
wenigen vorproduzierten Wörtern.

### Der Ablauf im Trainer

„Runde starten" drücken — und dann nichts mehr:

```
Wort wird vorgesprochen  →  Mikrofon geht an  →  du sprichst nach
                                                       │
                          Sprechpause wird erkannt  ◄──┘
                                   │
                               bewerten
                                   │
              ≥ Schwelle ──────────┴────────── < Schwelle
                  │                                 │
           nächstes Wort                    dasselbe Wort noch einmal
```

## 17. Die Geschlechtsteile im Einzelnen (Fassung 178)

### Das Problem

Im Bild „Die Geschlechtsorgane" gab es sechs anwählbare Flächen, und davon waren nur
zwei überhaupt Geschlechtsteile: „die männlichen Geschlechtsorgane" und „die weiblichen
Geschlechtsorgane" — zwei Klümpchen ohne ein einziges benanntes Einzelteil. Wer
„Schamlippe", „Eichel" oder „Vorhaut" lernen wollte, fand das Wort auf der ganzen Seite
nicht.

### Vier neue Tafeln, 38 Wörter

| Bild | Wörter |
|---|---|
| 🌸 Die äußeren weiblichen Geschlechtsteile | Schamhügel, Schamhaar, Klitorisvorhaut, Klitoris, Harnröhrenöffnung, Scheideneingang, äußere Schamlippen, innere Schamlippen, Jungfernhäutchen, Damm |
| 🔎 Der Penis und der Hodensack | Harnröhrenöffnung, Eichel, Kranzfurche, Vorhautbändchen, Vorhaut, Penisschaft, Schamhaar, Samenleiter, Hodensack, Hoden, Nebenhoden |
| 🔬 Innen: die weiblichen Geschlechtsorgane | Eierstock, Eileiter, Gebärmutter, Gebärmutterhals, Muttermund, Scheide |
| 🔬 Innen: die männlichen Geschlechtsorgane | Harnblase, Samenbläschen, Prostata, Samenleiter, Harnröhre, Nebenhoden, Hoden |

Sie stehen unter **Lernen → Bilderwelt → „Der Mensch von innen"** direkt als eigene
Kacheln — nicht versteckt hinter einer Lupenkette. Zusätzlich führt jede Fläche im
Übersichtsbild dorthin: „die Frau von vorn" → die äußeren Teile, „die weiblichen
Geschlechtsorgane" → innen, und ebenso beim Mann.

### Warum diese Bilder anders gebaut sind als alle anderen

In der Bilderwelt **ist** die Zeichnung eines Dings zugleich seine Schaltfläche. Im
Kinderzimmer geht das gut: der Teddy ist groß und liegt allein. Hier geht es nicht — die
inneren Schamlippen liegen unter den äußeren, die Klitoris ist wenige Millimeter groß,
die Harnröhrenöffnung noch kleiner. Zeichnung-als-Schaltfläche hieße hier:
übereinanderliegende Trefferflächen, von denen man auf dem Telefon keine sicher trifft.
Genau das war die Klage.

Darum sind diese vier Bilder wie im Biologiebuch aufgebaut:

* Die **Zeichnung ist Kulisse** — sie wird nicht angetippt.
* Jedes Teil bekommt einen eigenen **nummerierten Punkt am Bildrand**, mit einer
  gestrichelten Linie, die genau auf die Stelle zeigt.
* Der Punkt hat eine unsichtbare Trefferfläche von 34 × 34 und **überlappt mit keinem
  anderen**.

Zahlen und keine Wörter auf den Punkten, weil die Bilderwelt ein Suchspiel hat: stünde
das Wort in der Zeichnung, wäre das Spiel kaputt.

Die Linien liegen dabei **in der Kulisse, nicht im Teil**. Das ist kein Schönheitsdetail:
die App legt hinter jedes Teil eine unsichtbare Trefferfläche in Größe seiner
Bounding-Box. Steckte die lange Zeigerlinie im Teil, wäre diese Box hundert Pixel breit,
ihre Mitte läge im Leeren, und die Boxen benachbarter Punkte überlappten sich dort, wo
sich ihre Linien kreuzen — man träfe beim Danebentippen den Nachbarn.

Gebaut von `werkzeug/bau-geschlechtsteile.py`; dort steht der Bauplan mit der Begründung
für jede Entscheidung.

### Umgangssprache

Zu jedem Einzelteil steht auf der Wortkarte die zweite Form, wo es eine gibt — der
Umschalter „Wörterbuch ↔ Alltag" bedient sie bereits:

```
die äußeren Schamlippen  ↔  die großen Schamlippen
die inneren Schamlippen  ↔  die kleinen Schamlippen
die Klitoris             ↔  der Kitzler
der Schamhügel           ↔  der Venushügel
das Jungfernhäutchen     ↔  das Hymen
die Gebärmutter          ↔  der Uterus
der Hodensack            ↔  der Sack  (derb — beim Arzt sagt man das nicht)
```

### Ein Fehler, der dabei aufgefallen ist

Die App warf **alle** Einträge der Umgangssprache weg, deren Stilebene leer war. Gemeint
waren damit die Einträge „für dieses Wort gibt es keine zweite Form" (dort steht dasselbe
Wort zweimal). Mitgerissen wurden aber auch die **gleichwertigen Doppelformen**, die zu
Recht keine Stilebene haben, weil keine von beiden lockerer ist als die andere:

```
die Vagina / die Scheide        der Mutterkuchen / die Plazenta
der Krankenwagen / der Rettungswagen    die Kantine / die Mensa
der Schnupfen / die Erkältung
```

Sechzehn Wörter, bei denen die Seite etwas wusste und es für sich behielt. Das richtige
Merkmal ist nicht die Stilebene, sondern ob überhaupt ein **anderes** Wort dasteht — so
wird jetzt geprüft. Auf der Wortkarte heißt es bei diesen Paaren „Genauso gebräuchlich"
statt „Im Alltag sagt man", denn beide sagt man überall, auch beim Arzt.
