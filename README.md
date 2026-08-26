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
     name text, message text, date timestamptz default now()
   );

   create table daily_ranking (
     name text, points int, date date default current_date
   );

   create table profiles (
     id uuid references auth.users primary key,
     name text, points int default 0, badges text[] default '{}',
     is_premium boolean default false, theme text default 'bastelheft', bio text default ''
   );

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
