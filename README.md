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
     gallery text[] default '{}', hobbies text[] default '{}', origin text default '', is_admin boolean default false, is_owner boolean default false, gifted_categories text[] default '{}',
     last_active timestamptz, created_at timestamptz default now()
   );

   create table community_texts (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users, author_name text,
     title text, level text, body text,
     status text default 'pending', created_at timestamptz default now()
   );
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
