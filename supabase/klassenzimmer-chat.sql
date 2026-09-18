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
