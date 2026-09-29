-- =====================================================================
-- MIGRATION spiel_815_autos_kaufen — Dodge Viper und Batmobil kaufen
-- ---------------------------------------------------------------------
-- XANDER: „mein neuen Dodge Viper und mein Batmobil habe ich immer noch
-- nicht in der Map … Du sagst, sie sind fertig, aber ich seh sie noch
-- immer nicht. Ich kann sie nicht dazu kaufen. Ich kann sie im Spiel
-- überhaupt nicht ausprobieren."
--
-- Die leichte Stadt (stadt-leicht/autos.js, spiel.js) verkauft die beiden
-- Autos für Punkte des Spiels (wie spiel_bauen die Gebäude):
--   Dodge Viper  300 Punkte   (p_auto = 'viper')
--   Batmobil     450 Punkte   (p_auto = 'batmobil')
-- Gekauft fahren sie in der eigenen Stadt.
--
--   spiel_spieler.autos      jsonb, Liste der gekauften Autos (neu)
--   spiel_auto_kaufen(text)  prüft Anmeldung, Auto, Besitz, Punkte;
--                            zieht den Preis ab, merkt das Auto
--   spiel_autos()            die eigene Liste (leer ohne Anmeldung)
-- Beide SECURITY DEFINER mit festem search_path wie die anderen spiel_-
-- Funktionen. Keine Änderung an RLS oder Rechten.
--
-- Bis diese Migration läuft, merkt sich die Stadt gekaufte Autos
-- vorläufig in spiel_spieler.stadt_leicht->'autos' (ohne Abbuchung).
-- Diese werden hier einmal in die neue Spalte übernommen.
-- =====================================================================

alter table public.spiel_spieler add column if not exists autos jsonb not null default '[]'::jsonb;

-- vorläufig (vor dieser Migration) gekaufte Autos übernehmen
update public.spiel_spieler s
   set autos = (select coalesce(jsonb_agg(distinct x.a), '[]'::jsonb)
                  from jsonb_array_elements_text(s.stadt_leicht->'autos') as x(a)
                 where x.a in ('viper', 'batmobil'))
 where jsonb_typeof(s.stadt_leicht->'autos') = 'array'
   and jsonb_array_length(s.stadt_leicht->'autos') > 0
   and s.autos = '[]'::jsonb;

create or replace function public.spiel_auto_kaufen(p_auto text)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare uid uuid := auth.uid(); s spiel_spieler; preis integer;
begin
  if uid is null then raise exception 'nicht angemeldet'; end if;
  preis := case p_auto when 'viper' then 300 when 'batmobil' then 450 else null end;
  if preis is null then return jsonb_build_object('ok', false, 'grund', 'Dieses Auto gibt es nicht.'); end if;
  perform spiel_ich(null);
  select * into s from spiel_spieler where id = uid for update;
  if s.id is null then return jsonb_build_object('ok', false, 'grund', 'spielt nicht'); end if;
  if coalesce(s.autos, '[]'::jsonb) ? p_auto then
    return jsonb_build_object('ok', false, 'grund', 'Das Auto hast du schon.', 'autos', s.autos);
  end if;
  if s.punkte < preis then
    return jsonb_build_object('ok', false, 'grund', 'zu wenig Punkte (' || preis || ') – löse Deutschaufgaben');
  end if;
  update spiel_spieler
     set punkte = punkte - preis,
         autos = coalesce(autos, '[]'::jsonb) || to_jsonb(p_auto)
   where id = uid
  returning * into s;
  return jsonb_build_object('ok', true, 'gekauft', p_auto, 'preis', preis, 'autos', s.autos, 'punkte', s.punkte);
end $function$;

create or replace function public.spiel_autos()
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare uid uuid := auth.uid(); a jsonb;
begin
  if uid is null then return '[]'::jsonb; end if;
  select autos into a from spiel_spieler where id = uid;
  return coalesce(a, '[]'::jsonb);
end $function$;
