-- =====================================================================
-- FASSUNG 884 — EIGENE TOPF-GRENZEN IN spiel_diagnose_senden
-- ---------------------------------------------------------------------
-- XANDER (Funk 310): „… sie fragt mich immer ob ich sie hören kann ich
-- höre sie immer aber sie hört mich dann nicht mehr“.
-- Die Empfangswache (livechat.js, Bericht „ton-weg“) meldet jeden Vorfall,
-- bei dem man das Gegenüber nicht mehr hört, und ob er sich selbst geheilt
-- hat. Diese Berichte bekommen einen eigenen Topf, damit sie in langen
-- Spielsitzungen nicht die Leitungs-Zeitleisten verdrängen (die 40er-Grenze
-- war z. B. am 06.10. bei Emy erreicht).
--
--   mess-*   12 je Konto und 24 h   (eingespielt mit Fassung 884, messung)
--   ton-*    20 je Konto und 24 h   (dieser Schritt)
--   Rest     40 je Konto und 24 h   (wie bisher)
--
-- Die Antwort trägt „mess": 12 und „ton": 20. Daran erkennen messung.js
-- und livechat.js den neuen Server (ton-weg: 6 statt 3 je Seitenaufruf).
-- Sonst unverändert: SECURITY DEFINER, fester search_path, Anmeldung
-- nötig, > 6000 Zeichen → {"zu_lang": true}, RLS ohne Policies.
-- Eingespielt am 13.10.2026 als Migration fassung_884_ton_eigener_tageszaehler.
-- =====================================================================

create or replace function public.spiel_diagnose_senden(p_art text, p_daten jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  uid uuid := auth.uid();
  a text := left(coalesce(p_art, ''), 40);
  topf text := case when left(coalesce(p_art, ''), 5) = 'mess-' then 'mess'
                    when left(coalesce(p_art, ''), 4) = 'ton-' then 'ton'
                    else 'rest' end;
  n integer;
begin
  if uid is null then return jsonb_build_object('ok', false); end if;
  select count(*) into n from spiel_diagnose
    where spieler = uid and zeit > now() - interval '1 day'
      and (case when left(art, 5) = 'mess-' then 'mess'
                when left(art, 4) = 'ton-' then 'ton'
                else 'rest' end) = topf;
  if n >= (case topf when 'mess' then 12 when 'ton' then 20 else 40 end) then
    return jsonb_build_object('ok', false, 'grund', 'genug für heute');
  end if;
  insert into spiel_diagnose (spieler, art, daten)
    values (uid, a, case when length(p_daten::text) > 6000 then jsonb_build_object('zu_lang', true) else coalesce(p_daten, '{}'::jsonb) end);
  return jsonb_build_object('ok', true, 'mess', 12, 'ton', 20);
end $function$;

revoke execute on function public.spiel_diagnose_senden(text, jsonb) from public, anon;
grant execute on function public.spiel_diagnose_senden(text, jsonb) to authenticated;

-- Auswerten (nur lesen):
--   select zeit, daten->>'befund', daten->>'stufe', daten->>'geheilt', daten->>'nachMs'
--     from spiel_diagnose where art = 'ton-weg' order by zeit desc limit 50;
--   select zeit from spiel_diagnose where art = 'leitung' and daten::text like '%tonGleicheKennung%' order by zeit desc;
