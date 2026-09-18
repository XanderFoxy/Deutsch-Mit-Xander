-- =====================================================================
-- DAS RELAIS FUER DEN LIVESTREAM
-- ---------------------------------------------------------------------
-- GEWUENSCHT: „Bereite schon alles vor fuer den Livestream. Ich soll
--  nur noch den API-Schluessel eintragen muessen, und das Framework
--  ist schon vorhanden und funktioniert, dass wir heute den
--  Livestream starten koennen."
--
-- Diese eine Tabelle zaehlt mit, wie oft sich jemand am Tag
-- Relais-Zugangsdaten geholt hat. Mehr braucht es nicht: die zwei
-- Cloudflare-Werte liegen in der schon vorhandenen Tabelle
-- „betreiber_geheimnisse", genau wie der Azure-Schluessel.
--
-- Einmal in der SQL-Konsole von Supabase ausfuehren.
-- =====================================================================

create table if not exists public.turn_nutzung (
  user_id   uuid        not null references auth.users (id) on delete cascade,
  tag       date        not null,
  anfragen  integer     not null default 0,
  primary key (user_id, tag)
);

-- Der Zeilenschutz bleibt AN und es gibt bewusst KEINE Regel, die
-- jemandem Zugriff gibt. Geschrieben wird hier nur von der
-- Edge-Function, und die arbeitet mit dem Service-Key, der am
-- Zeilenschutz vorbeigeht. Der Browser hat hier nichts zu suchen.
alter table public.turn_nutzung enable row level security;

-- Alte Zeilen braucht niemand. Wer aufraeumen will:
--   delete from public.turn_nutzung where tag < current_date - 30;
