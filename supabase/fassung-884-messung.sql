-- =====================================================================
-- FASSUNG 884 — MESSUNG BEI ECHTEN NUTZERN: eigener Tageszähler für „mess-*"
-- ---------------------------------------------------------------------
-- XANDER (Funk 255): „… niemals abstürzt und alles optimiert ist".
-- Zugesagt (Funk 258, Punkt 5): „Echte Messung bei echten Nutzern
-- (Ladezeit, Abbrüche) statt nur bei mir."
--
-- messung.js schreibt neue Zeilen in spiel_diagnose: art „mess-start",
-- „mess-fehler", „mess-raum" (Inhalt siehe SPIELSYSTEM.md, Fassung 884).
-- Die Tabelle hat keinen Constraint auf „art" – neue Werte gehen schon
-- heute durch. ABER: spiel_diagnose_senden zählt bisher 40 Zeilen je
-- Konto und 24 h über ALLE Arten zusammen, und das wurde schon erreicht
-- (02.10., 03.10., 25.09. je ein Konto mit 40). Ohne diese Änderung
-- würden Mess-Zeilen an starken Tagen Leitungs-Zeilen verdrängen.
--
-- Jetzt zählen „mess-*" und alles andere getrennt:
--   mess-*      höchstens 12 je Konto und 24 h (der Client sendet je
--               Gerät und Kalendertag höchstens 8)
--   alles andere wie bisher höchstens 40 je Konto und 24 h
-- Die Antwort trägt zusätzlich „mess": 12. Daran erkennt messung.js den
-- neuen Server und erlaubt sich 8 statt 3 Zeilen am Tag. Solange diese
-- Datei NICHT eingespielt ist, bleibt der Client von selbst bei 3.
--
-- Sonst unverändert: SECURITY DEFINER, fester search_path, Anmeldung
-- nötig (auth.uid()), > 6000 Zeichen → {"zu_lang": true}, RLS auf der
-- Tabelle bleibt ohne Policies (nur diese Funktion schreibt).
-- Einspielen: einmal im SQL-Editor (oder als Migration). Wiederholbar.
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
  mess boolean := left(coalesce(p_art, ''), 5) = 'mess-';
  n integer;
begin
  if uid is null then return jsonb_build_object('ok', false); end if;
  select count(*) into n from spiel_diagnose
    where spieler = uid and zeit > now() - interval '1 day'
      and (left(art, 5) = 'mess-') = mess;
  if n >= (case when mess then 12 else 40 end) then
    return jsonb_build_object('ok', false, 'grund', 'genug für heute');
  end if;
  insert into spiel_diagnose (spieler, art, daten)
    values (uid, a, case when length(p_daten::text) > 6000 then jsonb_build_object('zu_lang', true) else coalesce(p_daten, '{}'::jsonb) end);
  return jsonb_build_object('ok', true, 'mess', 12);
end $function$;

-- Rechte wie bisher (create or replace behält sie; hier nur zur Sicherheit ausgeschrieben)
revoke execute on function public.spiel_diagnose_senden(text, jsonb) from public, anon;
grant execute on function public.spiel_diagnose_senden(text, jsonb) to authenticated;

-- =====================================================================
-- AUSWERTEN (nur lesen) — die ersten Zahlen nach 2–3 Tagen
-- =====================================================================
-- Kommt überhaupt etwas an?
--   select art, count(*), count(distinct spieler) konten, max(zeit) from spiel_diagnose
--    where art like 'mess-%' group by art;
--
-- Start bis „bereit" und erstes Bild je Tag (ohne Seiten, die im Hintergrund luden):
--   select zeit::date tag, count(*) n,
--          percentile_cont(0.5) within group (order by (daten->'t'->>'bereit')::numeric) bereit_median,
--          percentile_cont(0.9) within group (order by (daten->'t'->>'bereit')::numeric) bereit_p90,
--          percentile_cont(0.5) within group (order by (daten->'t'->>'fcp')::numeric) fcp_median,
--          percentile_cont(0.5) within group (order by (daten->>'kb')::numeric) kb_median
--     from spiel_diagnose where art = 'mess-start' and daten->'hinten' = 'null'::jsonb
--    group by 1 order by 1 desc;
--
-- Tipp Wissen → Klassenzimmer (ms bis das Bild steht; -1 = Ansicht kam nicht):
--   select (t->>1)::int ms, (t->>2)::int vor_bereit from spiel_diagnose, jsonb_array_elements(daten->'tipp'->'kz') t
--    where art = 'mess-start' order by 1 desc;
--
-- Absturz-Indiz (weg = war sichtbar, hinten = im Hintergrund weggeräumt, laden = Abbruch beim Laden):
--   select v->>'ende' ende, count(*), round(avg((v->>'dauer')::numeric)) dauer_s, sum((v->>'kz')::int) im_raum
--     from spiel_diagnose, jsonb_array_elements(daten->'vorher') v where art = 'mess-start' group by 1;
--
-- Häufigste Fehler (Ort = Datei:Zeile:Spalte, bei min/ über „bau" dem min-Stand in git zuordnen):
--   select e->>1 art, e->>2 text, e->>3 ort, sum((e->>0)::int) n, count(distinct spieler) konten
--     from spiel_diagnose, jsonb_array_elements(daten->'fehler') e
--    where art in ('mess-start', 'mess-fehler') group by 1, 2, 3 order by n desc limit 30;
--
-- Klassenzimmer: wie oft zäh (Fenster mit ≥ 300 ms Langläufer oder einem ≥ 200 ms)?
--   select count(*) aufenthalte, sum((daten->>'zaeh')::int) zaehe_fenster, sum((daten->>'anzahl')::int) fenster,
--          max((daten->'ges'->>2)::int) laengster_ms, sum((daten->>'uhr')::int) nur_ersatzuhr
--     from spiel_diagnose where art = 'mess-raum';
