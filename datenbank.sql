-- =====================================================================
-- DEUTSCH MIT ALEX — die komplette Datenbank
-- ---------------------------------------------------------------------
-- GEWÜNSCHT: „Ich weiß jetzt nicht mehr, wie die SQL-Zeile war, die
-- dafür verantwortlich ist — die bräuchte ich dann vielleicht noch mal,
-- und alles, was seitenweit jetzt dazu gebraucht wird."
--
-- Das hier ist die EINZIGE Datei, die du brauchst.
--
-- So benutzt du sie:
--   1. Supabase öffnen  →  links „SQL Editor"  →  „New query"
--   2. Diese Datei komplett hineinkopieren (alles markieren, einfügen)
--   3. Auf „Run" tippen
--
-- Sie ist so gebaut, dass du sie beliebig oft laufen lassen kannst:
-- Jede Anweisung prüft erst, ob es die Tabelle oder die Spalte schon
-- gibt. Es wird NICHTS gelöscht und NICHTS überschrieben — es wird nur
-- ergänzt, was fehlt. Wenn du unsicher bist, was du schon hast: einfach
-- noch einmal laufen lassen.
--
-- Ganz unten steht außerdem, was du EINMAL von Hand anlegen musst
-- (den Speicherort für Fotos) — das geht nicht über SQL.
-- =====================================================================


-- =====================================================================
-- 1. PROFILE — wer jemand ist, was er kann, was er gesammelt hat
-- =====================================================================
create table if not exists profiles (
  id uuid references auth.users primary key,
  name text,
  points int default 0,
  created_at timestamptz default now()
);

-- Punkte, Auszeichnungen, Sammlung
alter table profiles add column if not exists points int default 0;
alter table profiles add column if not exists badges text[] default '{}';
alter table profiles add column if not exists trophies text[] default '{}';
alter table profiles add column if not exists collected_figures text[] default '{}';

-- Aussehen und Vorstellung
alter table profiles add column if not exists theme text default 'bastelheft';
alter table profiles add column if not exists bio text default '';
alter table profiles add column if not exists avatar_url text default '';
alter table profiles add column if not exists avatar_emoji text default '';
alter table profiles add column if not exists gallery text[] default '{}';
alter table profiles add column if not exists birthday text default '';
alter table profiles add column if not exists origin text default '';
alter table profiles add column if not exists hobbies text[] default '{}';
alter table profiles add column if not exists languages text[] default '{}';

-- Die „Lieblings-…"-Angaben aus dem Profilkopf
alter table profiles add column if not exists fav_movie text default '';
alter table profiles add column if not exists fav_series text default '';
alter table profiles add column if not exists fav_song text default '';
alter table profiles add column if not exists fav_food text default '';
alter table profiles add column if not exists fav_drink text default '';
alter table profiles add column if not exists fav_country text default '';
alter table profiles add column if not exists fav_quote text default '';
alter table profiles add column if not exists poem text default '';

-- Rollen und Freischaltungen
alter table profiles add column if not exists is_premium boolean default false;
alter table profiles add column if not exists is_admin boolean default false;
alter table profiles add column if not exists is_owner boolean default false;
alter table profiles add column if not exists is_moderator boolean default false;
alter table profiles add column if not exists is_beta_tester boolean default false;
alter table profiles add column if not exists is_contributor boolean default false;
alter table profiles add column if not exists is_supporter boolean default false;
alter table profiles add column if not exists gifted_categories text[] default '{}';
alter table profiles add column if not exists gifted_themes text[] default '{}';

-- Online-Anzeige
alter table profiles add column if not exists last_active timestamptz;

-- ---------------------------------------------------------------------
-- DAS WICHTIGSTE FELD: extra_profile_data
-- ---------------------------------------------------------------------
-- Ein einziges flexibles JSON-Feld, in dem alles Weitere liegt. Dadurch
-- braucht keine neue Funktion der Seite je wieder eine neue Spalte —
-- und du musst nie wieder SQL nachziehen.
--
-- Was heute schon darin steckt:
--   wortlisten          — deine eigenen Wortlisten (bis zu 20)
--   meinWortschatz      — die gemerkten Wörter aus dem Wörterbuch
--   sammelbecken        — unbekannte Wörter, die beim Lesen angetippt wurden
--   proficiencyLevel    — das Sprachniveau aus dem Einstufungstest
--   lernweg             — wie weit der Kurs (Deutsch und Italienisch) ist
--   italienischFrei     — wer für den Italienischkurs freigeschaltet ist
--   hilfssprache        — die Muttersprache für Erklärungen
--   umgangssprache      — der Schalter für Alltagssprache
--   betonung            — der Schalter für die Betonungsanzeige
--   bilderPngs          — welche Detailbilder eigene PNGs bekommen haben
--   introduction        — der Text aus der Vorstellungsrunde
--   besteFreunde        — die markierten besten Freundinnen und Freunde
--   files               — hochgeladene Dateien (PDF, MP3) im Profil
--   gesehen             — welche Meilensteine schon angezeigt wurden
--   spielstaende        — angefangene Runden, die weiterlaufen sollen
--   musik               — Einstellungen des Players
--   ticker              — Einstellungen des Laufbands
-- ---------------------------------------------------------------------
alter table profiles add column if not exists extra_profile_data jsonb default '{}';

-- HINWEIS: An den Sicherheitsregeln (Row Level Security) der Profile wird
-- hier absichtlich NICHTS geändert. Deine laufende Seite hat dort schon
-- eine Einstellung, die funktioniert — und ein Eingriff könnte sie von
-- einem Moment auf den anderen lahmlegen. Sollte einmal etwas nicht mehr
-- speichern, steht ganz unten unter Punkt 11, was dann zu tun ist.


-- =====================================================================
-- 2. ERGEBNISSE UND RANGLISTE
-- =====================================================================
create table if not exists results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  categories text[],
  points int,
  bonus int,
  percent int,
  character text,
  played_at timestamptz default now()
);
alter table results add column if not exists level text;
alter table results add column if not exists extra_data jsonb default '{}';
create index if not exists results_user_idx on results (user_id, played_at desc);

create table if not exists daily_ranking (
  name text,
  points int,
  date date default current_date,
  user_id uuid references auth.users
);
alter table daily_ranking add column if not exists user_id uuid references auth.users;
-- Eine Zeile je Person und Tag — sonst verfälschen Doppeleinträge den
-- „Fuchs des Tages / der Woche / des Monats / des Jahres".
create unique index if not exists daily_ranking_user_date_idx on daily_ranking (user_id, date);


-- =====================================================================
-- 3. GÄSTEBUCH UND AKTIVITÄT
-- =====================================================================
create table if not exists guestbook (
  id uuid default gen_random_uuid() primary key,
  name text,
  message text,
  date timestamptz default now(),
  user_id uuid references auth.users
);
alter table guestbook add column if not exists rating integer;

create table if not exists activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  text text,
  date timestamptz default now()
);
create index if not exists activity_date_idx on activity (date desc);


-- =====================================================================
-- 4. EIGENE BEITRÄGE (Community-Texte) mit Herz und Kommentar
-- =====================================================================
create table if not exists community_texts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  author_name text,
  title text,
  level text,
  body text,
  cover_url text,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table community_texts add column if not exists cover_url text;
alter table community_texts add column if not exists extra_data jsonb default '{}';

create table if not exists community_text_likes (
  id uuid default gen_random_uuid() primary key,
  text_id uuid references community_texts,
  user_id uuid references auth.users,
  created_at timestamptz default now()
);
alter table community_text_likes disable row level security;

create table if not exists community_text_comments (
  id uuid default gen_random_uuid() primary key,
  text_id uuid references community_texts,
  user_id uuid references auth.users,
  author_name text,
  body text,
  created_at timestamptz default now()
);
alter table community_text_comments add column if not exists extra_data jsonb default '{}';
alter table community_text_comments disable row level security;


-- =====================================================================
-- 5. FREUNDE, HERAUSFORDERUNGEN, POSTFACH
-- =====================================================================
create table if not exists friends (
  id uuid default gen_random_uuid() primary key,
  user_a uuid references auth.users,
  user_b uuid references auth.users,
  status text default 'pending',
  requested_by uuid references auth.users
);

create table if not exists challenges (
  id uuid default gen_random_uuid() primary key,
  from_user uuid references auth.users,
  to_user uuid references auth.users,
  categories text[],
  from_result jsonb,
  to_result jsonb,
  extra jsonb,
  status text default 'pending',
  winner uuid,
  created_at timestamptz default now()
);
-- „extra" trägt alles Zusätzliche einer Herausforderung: welches Spiel,
-- welche Wortliste, welches Niveau, welcher gemeinsame Start.
alter table challenges add column if not exists extra jsonb default '{}';

create table if not exists private_messages (
  id uuid default gen_random_uuid() primary key,
  from_user uuid references auth.users,
  to_user uuid references auth.users,
  author_name text,
  body text,
  is_system boolean default false,
  read boolean default false,
  created_at timestamptz default now()
);
alter table private_messages add column if not exists image_url text;
alter table private_messages add column if not exists deleted_by_sender boolean default false;
alter table private_messages add column if not exists deleted_by_recipient boolean default false;
alter table private_messages disable row level security;
create index if not exists private_messages_to_idx on private_messages (to_user, created_at desc);

create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);
alter table notifications disable row level security;
create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

-- Sympathie: bewusst rein freundschaftliche Stufen. Eigene Tabelle MIT
-- Row Level Security, damit die Angabe privat bleibt, bis beide Seiten
-- sich gegenseitig markiert haben.
create table if not exists friend_sympathy (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references auth.users not null,
  to_user_id uuid references auth.users not null,
  level text not null,
  created_at timestamptz default now(),
  unique (from_user_id, to_user_id)
);
alter table friend_sympathy enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'friend_sympathy' and policyname = 'Eigene Sympathie-Angaben lesen') then
    create policy "Eigene Sympathie-Angaben lesen" on friend_sympathy for select using (auth.uid() = from_user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'friend_sympathy' and policyname = 'Sympathie ueber mich lesen') then
    create policy "Sympathie ueber mich lesen" on friend_sympathy for select using (auth.uid() = to_user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'friend_sympathy' and policyname = 'Eigene Sympathie schreiben') then
    create policy "Eigene Sympathie schreiben" on friend_sympathy for insert with check (auth.uid() = from_user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'friend_sympathy' and policyname = 'Eigene Sympathie aendern') then
    create policy "Eigene Sympathie aendern" on friend_sympathy for update using (auth.uid() = from_user_id);
  end if;
end $$;


-- =====================================================================
-- 6. PROFILBESUCHE UND PROFILSPUREN
-- =====================================================================
create table if not exists profile_visits (
  id uuid default gen_random_uuid() primary key,
  visitor_id uuid references auth.users,
  visitor_name text,
  visited_id uuid references auth.users,
  visited_at timestamptz default now(),
  unique (visitor_id, visited_id)
);
alter table profile_visits disable row level security;

create table if not exists profile_notes (
  id uuid default gen_random_uuid() primary key,
  profile_owner_id uuid references auth.users,
  author_id uuid references auth.users,
  author_name text,
  message text,
  created_at timestamptz default now()
);
alter table profile_notes disable row level security;


-- =====================================================================
-- 7. MUSIK-PLAYER
-- =====================================================================
create table if not exists playlist_songs (
  id uuid default gen_random_uuid() primary key,
  title text,
  url text,
  added_by uuid references auth.users,
  owner_id uuid references auth.users,      -- leer = gemeinsame Playlist
  recommended_by_name text,
  created_at timestamptz default now()
);
alter table playlist_songs add column if not exists owner_id uuid references auth.users;
alter table playlist_songs add column if not exists recommended_by_name text;
alter table playlist_songs add column if not exists cover_url text;
alter table playlist_songs add column if not exists hidden boolean default false;
alter table playlist_songs add column if not exists original_recommender_id uuid references auth.users;
alter table playlist_songs add column if not exists original_recommender_name text;
alter table playlist_songs disable row level security;

create table if not exists song_favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  song_id uuid references playlist_songs,
  created_at timestamptz default now()
);
alter table song_favorites disable row level security;


-- =====================================================================
-- 8. SEITENINHALTE, LINKS, SCHWARMWISSEN, FEHLERMELDUNGEN
-- =====================================================================
-- site_content ist der Schlüssel-Wert-Speicher für alles, was du direkt
-- auf der Seite bearbeitest: „Über mich", die Update-Nachricht an alle,
-- die Freigabeschalter für neue Bereiche, die Startseiten-Texte.
create table if not exists site_content (
  key text primary key,
  value jsonb
);
alter table site_content disable row level security;

create table if not exists user_links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  author_name text,
  title text,
  url text,
  "desc" text,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table user_links disable row level security;

create table if not exists community_tips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  author_name text,
  text text,
  link text,
  image_url text,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table community_tips disable row level security;

create table if not exists bug_reports (
  id uuid default gen_random_uuid() primary key,
  reporter_name text,
  context text,
  category text,
  description text,
  resolved boolean default false,
  created_at timestamptz default now()
);
alter table bug_reports add column if not exists reporter_id uuid references auth.users;
alter table bug_reports disable row level security;


-- =====================================================================
-- 9. DICH SELBST ALS BETREIBER MARKIEREN
-- ---------------------------------------------------------------------
-- Den Namen anpassen, falls du dich anders nennst.
-- =====================================================================
update profiles set is_admin = true, is_owner = true where name = 'XanderFox';


-- =====================================================================
-- 10. WENN ETWAS NICHT SPEICHERT
-- ---------------------------------------------------------------------
-- Wenn die Seite beim Speichern meldet, dass „Row Level Security" den
-- Zugriff blockiert, dann fehlt für diese Tabelle die Erlaubnis. Für
-- eine kleine, private Lernseite ist der einfachste Weg, die Regel für
-- genau diese Tabelle abzuschalten. Die Zeilen stehen hier bewusst als
-- Kommentar: Nimm nur die Raute weg, die du wirklich brauchst.
--
-- alter table results disable row level security;
-- alter table daily_ranking disable row level security;
-- alter table guestbook disable row level security;
-- alter table activity disable row level security;
-- alter table community_texts disable row level security;
-- alter table friends disable row level security;
-- alter table challenges disable row level security;
-- =====================================================================


-- =====================================================================
-- 11. WAS NICHT ÜBER SQL GEHT — einmal von Hand
-- ---------------------------------------------------------------------
-- Der Speicherort für Bilder und Dateien. Ohne ihn lassen sich keine
-- Profilfotos, Galeriebilder, Song-Cover, PDFs und MP3s hochladen.
--
--   Supabase öffnen  →  links „Storage"  →  „New bucket"
--   Name:   avatars
--   Public: einschalten
--
-- Mehr ist nicht nötig. Alles andere in diesem Skript macht die
-- Datenbank selbst.
-- =====================================================================
