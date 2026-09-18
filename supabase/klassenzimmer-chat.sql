-- =====================================================================
-- DER GEMEINSAME CHATVERLAUF IM KLASSENZIMMER
-- ---------------------------------------------------------------------
-- GEWUENSCHT: „Jemand, der komplett neu reinkommt, hat keinen Kontext.
--  Er sieht den Chat nicht, der schon gemacht wurde. Und wer sich vom
--  Handy ausloggt und auf dem Laptop mit demselben Profil einloggt,
--  sieht ihn auch nicht. Der Chat soll immer sichtbar sein fuer jeden,
--  der neu reinkommt, mit allen Bildern, und systemuebergreifend."
--
-- Bis hierher lag der Verlauf NUR im jeweiligen Geraet. Das konnte
-- genau das nicht: ein neues Geraet hat nichts, und ein neuer Gast
-- sieht einen leeren Raum. Dafuer braucht es eine Tabelle.
--
-- Einmal in der SQL-Konsole von Supabase ausfuehren.
-- =====================================================================

create table if not exists public.klassenzimmer_chat (
  id           bigserial primary key,
  raum         text        not null,
  autor        uuid        references auth.users (id) on delete set null,
  name         text        not null default 'Gast',
  bild         text        not null default '',   -- Profilbild der Person
  text         text        not null default '',
  bild_im_chat text        not null default '',   -- Foto (Datenadresse) oder GIF-Adresse
  art          text        not null default 'text',
  erstellt     timestamptz not null default now()
);

create index if not exists klassenzimmer_chat_raum_zeit
  on public.klassenzimmer_chat (raum, erstellt desc);

alter table public.klassenzimmer_chat enable row level security;

-- LESEN darf JEDE:R, auch ohne Anmeldung.
--
-- GEWUENSCHT: „Fuer jeden soll dieser Chat komplett sichtbar sein. Das
-- soll keine Local-Horst-Geschichte sein, sondern fuer jeden dasselbe
-- Erlebnis. Einer, der zum ersten Mal auf die Seite kommt, soll
-- trotzdem den heutigen kompletten Tagesverlauf sehen."
--
-- Vorher stand hier „to authenticated". Ein Gast sah deshalb gar
-- nichts vom gemeinsamen Verlauf — nur das, was zufaellig in seinem
-- eigenen Geraet lag. Das passt ausserdem zur schon bestehenden Regel
-- des Klassenzimmers: „Gaeste koennen zuschauen, wer angemeldet ist,
-- macht mit."
drop policy if exists "chat lesen" on public.klassenzimmer_chat;
create policy "chat lesen" on public.klassenzimmer_chat
  for select to anon, authenticated using (true);

-- SCHREIBEN nur im eigenen Namen. Ohne diese Bedingung koennte jede:r
-- Zeilen unter fremdem Namen einstellen.
drop policy if exists "chat schreiben" on public.klassenzimmer_chat;
create policy "chat schreiben" on public.klassenzimmer_chat
  for insert to authenticated with check (autor = auth.uid());

-- Die eigene Zeile darf man loeschen, fremde nicht.
drop policy if exists "eigenes loeschen" on public.klassenzimmer_chat;
create policy "eigenes loeschen" on public.klassenzimmer_chat
  for delete to authenticated using (autor = auth.uid());

-- Aufraeumen: aelter als 30 Tage braucht niemand mehr, und Fotos
-- belegen Platz. Gelegentlich von Hand ausfuehren oder als
-- pg_cron-Auftrag einrichten.
-- delete from public.klassenzimmer_chat where erstellt < now() - interval '30 days';

-- =====================================================================
-- NACHTRAG: DIE FARBE DES NAMENS
-- ---------------------------------------------------------------------
-- Jede:r kann sich im Klassenzimmer eine Namensfarbe geben. Sie besteht
-- aus zwei Dingen: dem Farbwert selbst und ihrem Namen („Waldgruen").
-- Der Farbwert kam frueh dazu, der Name nicht — und der Code hat ihn
-- trotzdem mitgeschickt, unter dem Namen „farbeName".
--
-- Das war der Fehler, an dem der gemeinsame Verlauf ZWEI Wochen lang
-- still gestorben ist: PostgREST weist eine Einfuegung mit einer
-- unbekannten Spalte komplett zurueck. Es wurde also gar nichts
-- gespeichert — die Tabelle war leer, und niemand konnte nach oben
-- scrollen, weil es nichts zu scrollen gab.
--
-- Beide Spalten stehen deshalb jetzt hier, wo sie hingehoeren. Die
-- Anweisungen sind gefahrlos: sie tun nichts, wenn die Spalte schon da
-- ist.
alter table public.klassenzimmer_chat
  add column if not exists farbe      text not null default '';
alter table public.klassenzimmer_chat
  add column if not exists farbe_name text not null default '';

-- =====================================================================
-- NACHTRAG: FLUESTERN FOLGT DER PERSON, NICHT DEM RAUM
-- ---------------------------------------------------------------------
-- GEWUENSCHT: „Wenn ich jemandem auf sein Fluestern antworte und
-- derjenige ist im selben Moment dabei zu gehen und kann die Nachricht
-- nicht mehr lesen — dann moechte ich, dass er sie spaeter trotzdem
-- sieht. Und dass das Fluestern generell ueberall steht, was an dieser
-- Person gemacht wurde: egal in welchem Raum sie ist, chronologisch,
-- unabhaengig vom Raum."
--
-- Ein Zuruf von Geraet zu Geraet kann das nicht — wer weg ist, ist weg.
-- Also bekommt eine gefluesterte Zeile eine ANSCHRIFT: an_id. Beim
-- Betreten holt sich jeder, was an ihn gerichtet war und was er selbst
-- gefluestert hat — aus allen Raeumen, chronologisch einsortiert.
--
-- quelle_id ist die Kennung, die der Zuruf schon hatte. Ohne sie
-- stuende dieselbe Zeile zweimal da: einmal live, einmal nachgereicht.
alter table public.klassenzimmer_chat
  add column if not exists an_id     uuid references auth.users (id) on delete cascade;
alter table public.klassenzimmer_chat
  add column if not exists an_name   text not null default '';
alter table public.klassenzimmer_chat
  add column if not exists quelle_id text not null default '';

create index if not exists klassenzimmer_chat_an_zeit
  on public.klassenzimmer_chat (an_id, erstellt desc);
create index if not exists klassenzimmer_chat_autor_zeit
  on public.klassenzimmer_chat (autor, erstellt desc);

-- UND DIE WICHTIGSTE ZEILE DIESER DATEI: gefluestert ist gefluestert.
-- Die offenen Raumzeilen (an_id ist leer) darf weiterhin jede:r lesen.
-- Eine Zeile MIT Anschrift bekommt nur heraus, wen sie angeht — der
-- Absender und der Empfaenger. Sonst waere „nur ihr beide seht es"
-- eine Luege, sobald jemand die Tabelle direkt abfragt.
drop policy if exists "chat lesen" on public.klassenzimmer_chat;
drop policy if exists "chat lesen gast" on public.klassenzimmer_chat;

drop policy if exists "chat lesen offen" on public.klassenzimmer_chat;
create policy "chat lesen offen" on public.klassenzimmer_chat
  for select to anon, authenticated using (an_id is null);

drop policy if exists "chat lesen gefluestert" on public.klassenzimmer_chat;
create policy "chat lesen gefluestert" on public.klassenzimmer_chat
  for select to authenticated using (an_id = auth.uid() or autor = auth.uid());
