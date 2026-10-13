-- =====================================================================
-- FASSUNG 884 — MESSUNG BEI ECHTEN NUTZERN: eigener Tageszähler für „mess-*"
-- ---------------------------------------------------------------------
-- !! EINGESPIELT (nachgelesen 13.10.2026). NICHT NOCH EINMAL EINSPIELEN !!
-- Live steht inzwischen eine NEUERE Fassung mit drei Töpfen („mess-" 12,
-- „ton-" 20, Rest 40; Antwort {ok, mess: 12, ton: 20}) – siehe
-- SPIELSYSTEM.md „Fassung 884 — Ton 310". Diese Datei kennt den „ton-"-Topf
-- nicht und würfe ihn zurück in die 40. Wer die Funktion ändert, geht von
-- der Live-Fassung aus (pg_get_functiondef). Die Datei bleibt als Beleg
-- und wegen der Auswerte-Abfragen unten.
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
-- neuen Server und erlaubt sich 8 statt 1 Zeile am Tag. Solange diese
-- Datei NICHT eingespielt ist, bleibt der Client von selbst bei 1 Zeile
-- je Gerät und Tag – und auch die kann an Tagen, an denen ein Konto die
-- 40 erreicht, eine Leitungs-Zeile verdrängen (lesend gezählt: 3 Konto-
-- Tage mit 40 in 30 Tagen, z. B. 03.10.: leitung 25 + verbindung 8 +
-- tonstand 7). Deshalb: VOR dem Ausliefern von Fassung 884 einspielen.
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
-- Felder, die beim Auswerten zählen: „mv" = Fassung des Zeilenformats (1);
-- „gast": 1 = ohne Anmeldung gesammelt und später unter dem nächsten
-- Konto gesendet (Konto unsicher); „alt" = Minuten in der Kiste.
-- mess-raum: „k" = Kennung der Zeile (wird sie von der nächsten Seite
-- nachgeschickt, behält sie „k" – Doppelte so herausfiltern), „folge" =
-- wie viele Zeilen desselben Aufenthalts schon vorher raus sind (nur
-- folge = 0 trägt ein gültiges „drin"), „grund" = aus | wechsel |
-- hidden (Teilzeile, teil = 1) | weg (pagehide, keepalive) | offen
-- (Zusammenfassung, von der nächsten Seite mit spaet = 1 nachgeschickt).
-- 884b: „dauer" = ganze Zeit (auch im Hintergrund), „sicht" = davon
-- sichtbare Sekunden, „anzahl" = 30-s-Fenster nur über die sichtbare
-- Zeit (kann 0 sein); fenster/ges/zaeh/loaf/inp zählen nur, was ganz in
-- sichtbarer Zeit lag. Eine Folgezeile (folge ≥ 1) ohne Langläufer, LoAF
-- und Eingabe kommt nur mit ≥ 30 s sichtbarer Zeit.
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
-- Klassenzimmer: wie oft zäh (Fenster mit ≥ 300 ms Langläufer oder einem ≥ 200 ms)? Doppelte (gleiches „k")
-- nur einmal; Aufenthalte = Zeilen mit folge = 0:
--   with r as (select distinct on (spieler, coalesce(daten->>'k', id::text)) daten from spiel_diagnose
--               where art = 'mess-raum' order by spieler, coalesce(daten->>'k', id::text), zeit)
--   select count(*) filter (where coalesce((daten->>'folge')::int, 0) = 0) aufenthalte, count(*) zeilen,
--          sum((daten->>'zaeh')::int) zaehe_fenster, sum((daten->>'anzahl')::int) sichtbare_fenster,
--          sum((daten->>'sicht')::int) sichtbar_s, sum((daten->>'dauer')::int) dauer_s,
--          max((daten->'ges'->>2)::int) laengster_ms, sum((daten->>'uhr')::int) nur_ersatzuhr,
--          percentile_cont(0.5) within group (order by (daten->>'drin')::numeric)
--            filter (where coalesce((daten->>'folge')::int, 0) = 0) betreten_bis_drin_median
--     from r;
