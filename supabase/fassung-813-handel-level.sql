-- ANGEWENDET am 2026-09-28 auf rolcktiryrvjzbwuvobb als zwei Migrationen: fassung_813_handel_level_a (alles außer spiel_dorf_abholen) und fassung_813_handel_level_b_ernte (spiel_dorf_abholen). Nur zum Nachlesen.
-- FASSUNG 813 — HANDEL (EINKAUFEN) UND WAS KOMMT MIT DEM LEVEL
-- XANDER: „bei dem Handel stimmt auch was noch nicht weil ich kann immer nur noch verkaufen. Ich kann nirgendswo
-- irgendwelche Produkte einkaufen" und „dass man das vorher auch irgendwo lesen kann was einen erwartet … dass abhängig
-- von Levelstufen andere Sachen möglich sind im Ausbau und dass man dann vielleicht doch noch mehr anbauen kann …
-- erst ab Level 27 möglich, wie in anderen Spielen."

-- Höchste Ausbaustufe je Spielerlevel: 3 bis Level 14, 4 ab Level 15, 5 ab Level 25, 6 ab Level 35.
create or replace function spiel_dorf_max(p_level integer) returns integer language sql immutable as $$
  select case when p_level >= 35 then 6 when p_level >= 25 then 5 when p_level >= 15 then 4 else 3 end
$$;

-- Bauzeit: Stufe 1 zwei, 2 fünf, 3 zehn, 4 fünfzehn, 5 zwanzig, 6 dreißig Minuten.
create or replace function spiel_bau_dauer(p_stufe integer) returns integer language sql immutable as $$
  select case p_stufe when 1 then 120 when 2 then 300 when 3 then 600 when 4 then 900 when 5 then 1200 else 1800 end
$$;

-- Ab Stufe 4 braucht ein Ausbau auch Baustoffe (Holz, Erz, Gold) – die gibt es auch beim Händler.
create or replace function spiel_bau_stoffe(p_stufe integer) returns jsonb language sql immutable as $$
  select case when p_stufe >= 6 then '{"holz":30,"erz":20,"gold":3}'::jsonb
              when p_stufe = 5 then '{"holz":20,"erz":10,"gold":1}'::jsonb
              when p_stufe = 4 then '{"holz":10,"erz":5}'::jsonb
              else '{}'::jsonb end
$$;

create or replace function spiel_bauen(p_was text) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); s spiel_spieler; stufe integer; preis integer; erz integer; holz integer; ab integer; platz integer;
        lv integer; mx integer; stoffe jsonb; w text; n integer; dauer integer;
begin
  if uid is null then raise exception 'nicht angemeldet'; end if;
  perform spiel_bau_abschluss(uid);
  select * into s from spiel_spieler where id = uid for update;
  if s.id is null then return jsonb_build_object('ok', false, 'grund', 'spielt nicht'); end if;
  if p_was = 'reparatur' then
    erz := coalesce((s.vorraete->>'erz')::int, 0); holz := coalesce((s.vorraete->>'holz')::int, 0);
    if not exists (select 1 from jsonb_each(s.dorf) x(k, v) where (v->>'lp')::int < 20 * (v->>'stufe')::int) then
      return jsonb_build_object('ok', false, 'grund', 'alles heil – nichts zu reparieren');
    end if;
    if erz < 1 and holz < 2 then return jsonb_build_object('ok', false, 'grund', 'Reparieren kostet 1 Erz oder 2 Holz'); end if;
    update spiel_spieler set vorraete = case when erz >= 1 then spiel_vorrat_plus(vorraete, 'erz', -1) else spiel_vorrat_plus(vorraete, 'holz', -2) end,
      dorf = (select jsonb_object_agg(k, case when v ? 'stufe' then jsonb_set(v, '{lp}', to_jsonb(20 * (v->>'stufe')::int)) else v end) from jsonb_each(s.dorf) x(k, v))
     where id = uid;
    insert into spiel_protokoll (von, art, wert, waffe) values (uid, 'bauen', -1, case when erz >= 1 then 'reparatur' else 'reparatur:holz' end);
    return jsonb_build_object('ok', true, 'gebaut', 'reparatur', 'mit', case when erz >= 1 then 'erz' else 'holz' end) || spiel_ich(null);
  end if;
  -- Fassung 813: neue Gebäude für höhere Level (Holzfällerhütte, Marktstand, Schweinestall, Jagdhütte, Sternwarte).
  ab := case p_was when 'baeckerei' then 1 when 'schmiede' then 1 when 'huehnerstall' then 2 when 'muehle' then 3 when 'kuhstall' then 3
    when 'schule' then 4 when 'kaserne' then 4 when 'brauerei' then 5 when 'krankenhaus' then 5 when 'bibliothek' then 6 when 'bergwerk' then 7
    when 'rathaus' then 8 when 'labor' then 10 when 'gasthaus' then 6 when 'gefaengnis' then 7 when 'flickstube' then 6
    when 'holzhuette' then 12 when 'marktstand' then 15 when 'schweinestall' then 18 when 'jagdhuette' then 22 when 'sternwarte' then 30 end;
  if ab is null then return jsonb_build_object('ok', false, 'grund', 'gibt es nicht'); end if;
  lv := spiel_level(s.xp);
  if lv < ab then return jsonb_build_object('ok', false, 'grund', 'das gibt es ab Level ' || ab); end if;
  stufe := coalesce((s.dorf->p_was->>'stufe')::int, 0);
  -- Fassung 813: die höchste Stufe hängt am Level (3, ab Level 15: 4, ab 25: 5, ab 35: 6).
  mx := spiel_dorf_max(lv);
  if stufe >= 6 then return jsonb_build_object('ok', false, 'grund', 'schon Stufe 6 – höher geht es nicht'); end if;
  if stufe >= mx then
    return jsonb_build_object('ok', false, 'grund', 'Stufe ' || (stufe + 1) || ' gibt es ab Level ' || case stufe + 1 when 4 then 15 when 5 then 25 else 35 end);
  end if;
  preis := (case p_was when 'baeckerei' then 100 when 'schule' then 150 when 'brauerei' then 130 when 'bibliothek' then 160
    when 'rathaus' then 200 when 'muehle' then 90 when 'krankenhaus' then 140 when 'huehnerstall' then 60 when 'kuhstall' then 80
    when 'bergwerk' then 180 when 'labor' then 250 when 'kaserne' then 140 when 'gasthaus' then 150 when 'gefaengnis' then 170 when 'flickstube' then 110
    when 'holzhuette' then 160 when 'marktstand' then 220 when 'schweinestall' then 200 when 'jagdhuette' then 240 when 'sternwarte' then 350 else 120 end) * (stufe + 1);
  if s.punkte < preis then return jsonb_build_object('ok', false, 'grund', 'zu wenig Punkte (' || preis || ') – löse Deutschaufgaben'); end if;
  stoffe := spiel_bau_stoffe(stufe + 1);
  for w, n in select key, value::int from jsonb_each_text(stoffe) loop
    if coalesce((s.vorraete->>w)::int, 0) < n then
      return jsonb_build_object('ok', false, 'grund', 'für Stufe ' || (stufe + 1) || ' fehlen Baustoffe: ' || n || ' ' || spiel_warenname(w) || ' (du hast ' || coalesce((s.vorraete->>w)::int, 0) || ') – gibt es auch beim Händler');
    end if;
  end loop;
  -- Fassung 790 (Funk 202, Paket D1): eine Baustelle statt sofort. 1 Bau zugleich, ab Rathaus Stufe 3 zwei.
  if exists (select 1 from jsonb_array_elements(coalesce(s.volk->'baustellen', '[]'::jsonb)) x where x->>'was' = p_was) then
    return jsonb_build_object('ok', false, 'grund', 'hier wird schon gebaut');
  end if;
  platz := case when coalesce((s.dorf->'rathaus'->>'stufe')::int, 0) >= 3 then 2 else 1 end;
  if coalesce(jsonb_array_length(s.volk->'baustellen'), 0) >= platz then
    return jsonb_build_object('ok', false, 'grund', case when platz = 1 then 'es wird schon gebaut – warte, bis die Baustelle fertig ist (ab Rathaus Stufe 3 gehen zwei zugleich)' else 'es laufen schon zwei Baustellen' end);
  end if;
  for w, n in select key, value::int from jsonb_each_text(stoffe) loop
    s.vorraete := spiel_vorrat_plus(s.vorraete, w, -n);
  end loop;
  -- Carl Benz: Baustellen 25 % schneller; Konrad Zuse (Fassung 813): noch einmal 25 %.
  dauer := round(spiel_bau_dauer(stufe + 1) * case when spiel_erforscht(s.volk, 'benz') then 0.75 else 1 end * case when spiel_erforscht(s.volk, 'zuse') then 0.75 else 1 end)::int;
  update spiel_spieler set punkte = punkte - preis, vorraete = s.vorraete,
    volk = jsonb_set(coalesce(volk, '{}'::jsonb), '{baustellen}', coalesce(volk->'baustellen', '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
      'was', p_was, 'stufe', stufe + 1, 'start', now(), 'bis', now() + dauer * interval '1 second', 'dauer', dauer, 'geholfen', 0)))
   where id = uid;
  insert into spiel_protokoll (von, art, wert, waffe) values (uid, 'bauen', -preis, p_was);
  return jsonb_build_object('ok', true, 'baustelle', p_was, 'stufe', stufe + 1, 'preis', preis, 'stoffe', stoffe, 'dauer', dauer) || spiel_ich(null);
end $$;

-- Forschung: fünf neue Entdeckungen, die es erst ab einem Level gibt („ab").
create or replace function spiel_forschung_def(p_was text) returns jsonb language sql immutable as $$ select case p_was
  when 'dreifelder'   then '{"name":"Dreifelderwirtschaft","kosten":20,"wiss":1,"quote":0}'::jsonb
  when 'sauerteig'    then '{"name":"Sauerteig","kosten":30,"wiss":1,"quote":0,"haus":"baeckerei"}'::jsonb
  when 'wassermuehle' then '{"name":"Wasserrad an der Mühle","kosten":40,"wiss":2,"quote":0,"haus":"muehle","stufe":2}'::jsonb
  when 'buchdruck'    then '{"name":"Buchdruck","kosten":60,"wiss":2,"quote":0,"haus":"bibliothek"}'::jsonb
  when 'duden'        then '{"name":"Der Duden","kosten":80,"wiss":3,"quote":85,"geheim":true}'::jsonb
  when 'dampf'        then '{"name":"Dampfmaschine","kosten":120,"wiss":5,"quote":90,"haus":"labor","geheim":true}'::jsonb
  when 'liebig'       then '{"name":"Kunstdünger (Justus von Liebig)","kosten":150,"wiss":6,"quote":60}'::jsonb
  when 'melkmaschine' then '{"name":"Melkmaschine","kosten":160,"wiss":6,"quote":0,"haus":"kuhstall"}'::jsonb
  when 'brutkasten'   then '{"name":"Brutkasten","kosten":160,"wiss":6,"quote":0,"haus":"huehnerstall"}'::jsonb
  when 'telegraf'     then '{"name":"Telegraf (Siemens & Halske)","kosten":200,"wiss":8,"quote":70}'::jsonb
  when 'roentgen'     then '{"name":"Röntgenstrahlen","kosten":400,"wiss":12,"quote":90,"haus":"krankenhaus","geheim":true}'::jsonb
  when 'benz'         then '{"name":"Automobil (Carl Benz)","kosten":500,"wiss":15,"quote":92,"haus":"rathaus","stufe":2,"geheim":true}'::jsonb
  when 'saegewerk'    then '{"name":"Sägewerk","kosten":180,"wiss":6,"quote":0,"haus":"holzhuette","ab":14}'::jsonb
  when 'kontor'       then '{"name":"Hanse-Kontor","kosten":250,"wiss":8,"quote":60,"haus":"marktstand","ab":20}'::jsonb
  when 'raeucherei'   then '{"name":"Räucherkammer","kosten":300,"wiss":10,"quote":70,"haus":"schweinestall","ab":24}'::jsonb
  when 'zeiss'        then '{"name":"Fernrohr (Carl Zeiss)","kosten":600,"wiss":16,"quote":85,"haus":"sternwarte","ab":32}'::jsonb
  when 'zuse'         then '{"name":"Rechenmaschine (Konrad Zuse)","kosten":900,"wiss":20,"quote":92,"haus":"labor","stufe":5,"ab":40,"geheim":true}'::jsonb
  else null end $$;

create or replace function spiel_erforschen(p_was text) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); s spiel_spieler; d jsonb; wiss integer; q integer; f integer;
begin
  if uid is null then return jsonb_build_object('ok', false, 'grund', 'nicht angemeldet'); end if;
  d := spiel_forschung_def(p_was);
  if d is null then return jsonb_build_object('ok', false, 'grund', 'diese Forschung gibt es nicht'); end if;
  select * into s from spiel_spieler where id = uid for update;
  if s.id is null then return jsonb_build_object('ok', false, 'grund', 'spielt nicht'); end if;
  if spiel_erforscht(s.volk, p_was) then return jsonb_build_object('ok', false, 'grund', 'schon erforscht'); end if;
  -- Fassung 813: manche Forschung gibt es erst ab einem Level.
  if d ? 'ab' and spiel_level(s.xp) < (d->>'ab')::int then return jsonb_build_object('ok', false, 'grund', 'das gibt es ab Level ' || (d->>'ab')); end if;
  wiss := spiel_beruf(s.volk, 'wissenschaftler'); q := spiel_deutsch_quote(uid);
  if wiss < (d->>'wiss')::int then return jsonb_build_object('ok', false, 'grund', 'dafür braucht es ' || (d->>'wiss') || ' Wissenschaftler (du hast ' || wiss || ')'); end if;
  if q < (d->>'quote')::int then return jsonb_build_object('ok', false, 'grund', 'deine Wissenschaftler sind noch nicht klug genug – Deutsch-Quote ' || (d->>'quote') || ' % nötig (du hast ' || q || ' %)'); end if;
  if d ? 'haus' and spiel_dorf_st(s.dorf, d->>'haus') < coalesce((d->>'stufe')::int, 1) then
    return jsonb_build_object('ok', false, 'grund', 'dafür fehlt das Gebäude');
  end if;
  f := coalesce((s.volk->>'forschung')::int, 0);
  if f < (d->>'kosten')::int then return jsonb_build_object('ok', false, 'grund', 'zu wenig Forschung (' || (d->>'kosten') || ' nötig, du hast ' || f || ')'); end if;
  update spiel_spieler set volk = coalesce(volk, '{}'::jsonb) || jsonb_build_object('forschung', f - (d->>'kosten')::int,
    'erforscht', coalesce(volk->'erforscht', '[]'::jsonb) || jsonb_build_array(p_was)) where id = uid;
  insert into spiel_protokoll (von, art, wert, waffe) values (uid, 'forschung', (d->>'kosten')::int, p_was);
  return jsonb_build_object('ok', true, 'erforscht', p_was, 'name', d->>'name') || spiel_ich(null);
end $$;

-- Mehr Fachleute durch die neuen Häuser: Holzfällerhütte (+2 Holzfäller je Stufe), Jagdhütte (+2 Jäger), Sternwarte (+2 Wissenschaftler).
create or replace function spiel_beruf_max(p_dorf jsonb, p_b text) returns integer language sql immutable as $$
 select case p_b when 'bauer' then 4 + 2 * spiel_dorf_st(p_dorf, 'muehle')
                   when 'mueller' then 2 * spiel_dorf_st(p_dorf, 'muehle')
                   when 'baecker' then 2 * spiel_dorf_st(p_dorf, 'baeckerei')
                   when 'schmied' then 2 * spiel_dorf_st(p_dorf, 'schmiede')
                   when 'wissenschaftler' then 2 * (spiel_dorf_st(p_dorf, 'schule') + spiel_dorf_st(p_dorf, 'bibliothek') + spiel_dorf_st(p_dorf, 'labor') + spiel_dorf_st(p_dorf, 'sternwarte'))
                   when 'fischer' then 4 when 'holzfaeller' then 4 + 2 * spiel_dorf_st(p_dorf, 'holzhuette') when 'jaeger' then 4 + 2 * spiel_dorf_st(p_dorf, 'jagdhuette')
                   when 'bergmann' then 2 * spiel_dorf_st(p_dorf, 'bergwerk')
                   when 'koch' then 2 * spiel_dorf_st(p_dorf, 'gasthaus')
                   else 0 end $$;

-- Händler: der Kaufpreis bleibt Grundpreis × Tageslaune × 1,6 (spiel_haendler_preis, schwankt täglich wie der Markt) –
-- immer deutlich über dem, was der Markt zahlt (höchstens Grundpreis × Tageslaune × 1,15 × 1,18 × 1,05 ≈ 1,43), damit
-- Kaufen und gleich wieder Verkaufen nie Gewinn bringt.
-- Wie viel liefert der Händler heute? 60 Stück, je Marktstand-Stufe 20 mehr, mit dem Hanse-Kontor doppelt so viel.
create or replace function spiel_haendler_tag(p_uid uuid) returns integer language sql stable security definer set search_path = public as $$
  select ((60 + 20 * least(6, coalesce((select spiel_dorf_st(dorf, 'marktstand') from spiel_spieler where id = p_uid), 0)))
    * case when coalesce((select spiel_erforscht(volk, 'kontor') from spiel_spieler where id = p_uid), false) then 2 else 1 end)::int
$$;

create or replace function spiel_haendler_kaufen(p_ware text, p_menge integer) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); s spiel_spieler; preis integer; kosten integer; heute integer; tag integer; hat integer; lager integer := 999;
        heute_start timestamptz := (date_trunc('day', now() at time zone 'Europe/Berlin')) at time zone 'Europe/Berlin';
begin
  if uid is null then return jsonb_build_object('ok', false, 'grund', 'nicht angemeldet'); end if;
  select * into s from spiel_spieler where id = uid for update;
  if not found then return jsonb_build_object('ok', false, 'grund', 'spielt nicht'); end if;
  preis := (spiel_haendler_preis(p_ware)->>'preis')::int;
  if preis is null then return jsonb_build_object('ok', false, 'grund', 'das hat der Händler nicht'); end if;
  tag := spiel_haendler_tag(uid);
  select coalesce(sum(wert), 0) into heute from spiel_protokoll where von = uid and art = 'haendler_menge' and zeit >= heute_start;
  hat := coalesce((s.vorraete->>p_ware)::int, 0);
  if hat >= lager then return jsonb_build_object('ok', false, 'grund', 'dein Lager ist voll (' || lager || ' ' || spiel_warenname(p_ware) || ')'); end if;
  p_menge := least(greatest(coalesce(p_menge, 1), 1), 50, tag - heute, lager - hat);
  if p_menge < 1 then return jsonb_build_object('ok', false, 'grund', 'der Händler hat für heute nichts mehr – morgen wieder'); end if;
  kosten := preis * p_menge;
  if s.punkte < kosten then return jsonb_build_object('ok', false, 'grund', 'zu wenig Punkte (' || kosten || ' nötig)'); end if;
  update spiel_spieler set punkte = punkte - kosten, vorraete = spiel_vorrat_plus(vorraete, p_ware, p_menge) where id = uid;
  insert into spiel_protokoll (von, art, wert, waffe) values (uid, 'haendler', -kosten, p_ware), (uid, 'haendler_menge', p_menge, p_ware);
  return jsonb_build_object('ok', true, 'ware', p_ware, 'menge', p_menge, 'kosten', kosten, 'preis', preis, 'rest_heute', tag - heute - p_menge) || spiel_ich(null);
end $$;

-- Die Preisliste nennt jetzt auch den Kaufpreis beim Händler (für diesen Spieler), was er heute noch liefert und die Lagergrenze.
create or replace function spiel_markt_preise() returns jsonb language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid(); heute integer;
        heute_start timestamptz := (date_trunc('day', now() at time zone 'Europe/Berlin')) at time zone 'Europe/Berlin';
        waren text[] := array['getreide','mehl','brot','kuchen','duenger','torte','ei','milch','fisch','fleisch','holz','quarz','gold','oel','silizium','chip','erz'];
begin
  select coalesce(sum(wert), 0) into heute from spiel_protokoll where von = uid and art = 'haendler_menge' and zeit >= heute_start;
  return jsonb_build_object('ok', true,
    'preise', (select jsonb_object_agg(w, spiel_markt_preis(uid, w)) from unnest(waren) w),
    'kauf', (select jsonb_object_agg(w, (spiel_haendler_preis(w)->>'preis')::int) from unnest(waren) w),
    'kauf_rest', greatest(0, spiel_haendler_tag(uid) - heute), 'kauf_tag', spiel_haendler_tag(uid), 'lager_max', 999, 'duenger_kauf', 8);
end $$;

-- Markt: Marktstand zahlt 3 % je Stufe mehr, Hanse-Kontor 5 % (zusätzlich zum Telegrafen).
create or replace function spiel_markt(p_ware text, p_menge integer) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); s spiel_spieler; p jsonb; n integer; erloes integer; heute integer; rang integer;
        heute_start timestamptz := (date_trunc('day', now() at time zone 'Europe/Berlin')) at time zone 'Europe/Berlin';
begin
  select * into s from spiel_spieler where id = uid for update;
  if not found then return jsonb_build_object('ok', false, 'grund', 'spielt nicht'); end if;
  p := spiel_markt_preis(uid, p_ware);
  if p is null then return jsonb_build_object('ok', false, 'grund', 'das kauft der Markt nicht'); end if;
  n := coalesce((s.vorraete->>p_ware)::int, 0);
  if p_menge is null or p_menge < 1 then p_menge := n; end if;
  p_menge := least(p_menge, n, 50);
  if p_menge < 1 then return jsonb_build_object('ok', false, 'grund', 'davon hast du nichts'); end if;
  erloes := greatest(1, round((p->>'preis')::numeric * p_menge * case when spiel_erforscht(s.volk, 'telegraf') then 1.15 else 1 end
    * (1 + 0.03 * least(6, spiel_dorf_st(s.dorf, 'marktstand'))) * case when spiel_erforscht(s.volk, 'kontor') then 1.05 else 1 end)::int);
  select coalesce(sum(wert), 0) into heute from spiel_protokoll where von = uid and art = 'markt_rang' and zeit >= heute_start;
  rang := least(erloes, greatest(0, 40 - heute));
  update spiel_spieler set punkte = punkte + erloes, verdient = verdient + rang, vorraete = spiel_vorrat_plus(vorraete, p_ware, -p_menge) where id = uid;
  insert into spiel_protokoll (von, art, wert, waffe) values (uid, 'markt', erloes, p_ware), (uid, 'markt_menge', p_menge, p_ware);
  if rang > 0 then insert into spiel_protokoll (von, art, wert, waffe) values (uid, 'markt_rang', rang, p_ware); end if;
  return jsonb_build_object('ok', true, 'ware', p_ware, 'menge', p_menge, 'erloes', erloes, 'rang', rang, 'preis', p) || spiel_ich(null);
end $$;

-- Dorf-Ernte mit den neuen Häusern: Holzfällerhütte (+3 Holz je Stufe, Sägewerk doppelt), Schweinestall (+2 Bratwürste
-- und +1 Fleisch je Stufe), Jagdhütte (+2 Fleisch je Stufe; Räucherkammer: Fleisch × 1,5), Sternwarte (+3 Forschung je
-- Stufe; Fernrohr: Forschung × 1,5). Sonst unverändert (Fassung 702/703/767).
create or replace function spiel_dorf_abholen() returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); s spiel_spieler; b integer; sch integer; schu integer; br integer; bib integer; rat integer; bw integer;
        v_wurst integer := 0; v_erz integer := 0; v_xp integer := 0; v_mana integer := 0; v_punkte integer := 0;
        v_quarz integer := 0; v_gold integer := 0; v_oel integer := 0; ader boolean := false;
        v_getreide integer := 0; v_brot integer := 0; v_forschung integer := 0; hunger integer; weg text := null; weg_k text;
        arbeiter integer; ritter integer; bedarf integer; rest integer; satt integer := 0; w text; n integer; vr jsonb; berufe jsonb;
        lohn integer; bezahlt integer; quote integer; zufrieden integer; faktor numeric; takt jsonb; v_besucher integer := 0; v_kauf integer := 0; v_eintritt integer := 0;
        hf integer; sst integer; jh integer; stw integer; v_holz integer := 0; v_fleisch integer := 0;
begin
  if uid is null then raise exception 'nicht angemeldet'; end if;
  -- Fassung 702: erst die Fuhrleute arbeiten lassen (Automatik), dann ernten.
  takt := spiel_dorf_takt_s(uid);
  select * into s from spiel_spieler where id = uid for update;
  if s.id is null or s.dorf = '{}'::jsonb then return jsonb_build_object('ok', false, 'grund', 'noch kein Dorf – bau zuerst etwas'); end if;
  if s.dorf_ab is not null and s.dorf_ab > now() - interval '4 hours' then
    return jsonb_build_object('ok', false, 'grund', 'noch nicht fertig', 'sek', ceil(extract(epoch from s.dorf_ab + interval '4 hours' - now()))::int);
  end if;
  b := spiel_dorf_st(s.dorf, 'baeckerei'); sch := spiel_dorf_st(s.dorf, 'schmiede'); schu := spiel_dorf_st(s.dorf, 'schule');
  br := spiel_dorf_st(s.dorf, 'brauerei'); bib := spiel_dorf_st(s.dorf, 'bibliothek'); rat := spiel_dorf_st(s.dorf, 'rathaus');
  bw := spiel_dorf_st(s.dorf, 'bergwerk');
  hf := spiel_dorf_st(s.dorf, 'holzhuette'); sst := spiel_dorf_st(s.dorf, 'schweinestall'); jh := spiel_dorf_st(s.dorf, 'jagdhuette'); stw := spiel_dorf_st(s.dorf, 'sternwarte');
  arbeiter := spiel_arbeiter(s.dorf); ritter := coalesce((s.volk->>'ritter')::int, 0);
  berufe := coalesce(s.volk->'berufe', '{}'::jsonb);
  -- Fassung 702: wer einen Beruf hat, isst mehr (je zwei Fachleute eine Portion mehr).
  bedarf := ceil(arbeiter / 4.0)::int + ritter + ceil(spiel_berufe_summe(s.volk) / 2.0)::int; rest := bedarf; vr := coalesce(s.vorraete, '{}'::jsonb);
  foreach w in array array['fisch', 'fleisch', 'brot', 'bratwurst', 'kuchen', 'torte'] loop
    exit when rest <= 0;
    n := least(rest, coalesce((vr->>w)::int, 0));
    if n > 0 then vr := spiel_vorrat_plus(vr, w, -n); rest := rest - n; satt := satt + n; end if;
  end loop;
  lohn := arbeiter + 3 * ritter; bezahlt := least(lohn, greatest(0, s.punkte));
  quote := spiel_deutsch_quote(uid);
  zufrieden := round(40.0 * case when bedarf = 0 then 1 else satt::numeric / bedarf end
                   + 20.0 * case when lohn = 0 then 1 else bezahlt::numeric / lohn end
                   + 40.0 * least(100, quote + case when spiel_erforscht(s.volk, 'duden') then 10 else 0 end) / 100.0)::int;
  -- Fassung 703: Sehenswürdigkeiten freuen das Volk.
  zufrieden := least(100, zufrieden + spiel_wunder_freude(s.volk) + spiel_ausflug_freude(s.volk));
  faktor := 0.5 + zufrieden / 100.0;
  v_wurst := round(2 * b * faktor) + round(2 * sst * faktor); v_erz := round((sch + 2 * bw) * faktor); v_xp := round((20 * schu + 30 * bib) * faktor);
  v_mana := round(15 * br * faktor); v_punkte := round(15 * rat * faktor);
  v_holz := round(3 * hf * faktor * case when spiel_erforscht(s.volk, 'saegewerk') then 2 else 1 end);
  v_fleisch := round((sst + 2 * jh) * faktor * case when spiel_erforscht(s.volk, 'raeucherei') then 1.5 else 1 end);
  if bw > 0 then
    v_quarz := round(2 * bw * faktor);
    if random() < 0.25 * bw then v_gold := 1; end if;
    if random() < 0.10 then v_gold := v_gold + 3; ader := true; end if;
    if random() < 0.08 * bw then v_oel := 1; end if;
  end if;
  -- Fassung 702: Bauern ernten Getreide, Bäcker backen nebenbei Brot, Wissenschaftler forschen – je klüger das Dorf (Deutsch-Quote), desto mehr.
  -- Fassung 767: die Bauern arbeiten jetzt laufend (spiel_dorf_takt_s, je 20 Minuten); hier kommt kein Getreide mehr dazu.
  v_getreide := 0;
  v_brot := case when b > 0 then round(spiel_beruf(s.volk, 'baecker') * faktor * case when spiel_erforscht(s.volk, 'sauerteig') then 2 else 1 end) else 0 end;
  v_forschung := round((spiel_beruf(s.volk, 'wissenschaftler') * quote / 100.0 * (1 + bib) * case when spiel_erforscht(s.volk, 'buchdruck') then 1.5 else 1 end + 3 * stw * faktor)
    * case when spiel_erforscht(s.volk, 'zeiss') then 1.5 else 1 end);
  -- Hunger: wer zweimal hintereinander nicht satt wird, dem ziehen Leute weg.
  hunger := case when satt < bedarf then coalesce((s.volk->>'hunger')::int, 0) + 1 else 0 end;
  if hunger >= 2 and spiel_berufe_summe(s.volk) > 0 then
    select key into weg_k from jsonb_each_text(berufe) where value::int > 0 order by value::int desc, key limit 1;
    berufe := berufe || jsonb_build_object(weg_k, (berufe->>weg_k)::int - 1);
    weg := weg_k;
  end if;
  vr := spiel_vorrat_plus(spiel_vorrat_plus(spiel_vorrat_plus(spiel_vorrat_plus(spiel_vorrat_plus(vr, 'bratwurst', v_wurst), 'erz', v_erz), 'quarz', v_quarz), 'gold', v_gold), 'oel', v_oel);
  vr := spiel_vorrat_plus(spiel_vorrat_plus(vr, 'getreide', v_getreide), 'brot', v_brot);
  if v_holz > 0 then vr := spiel_vorrat_plus(vr, 'holz', v_holz); end if;
  if v_fleisch > 0 then vr := spiel_vorrat_plus(vr, 'fleisch', v_fleisch); end if;
  -- Fassung 703: Besucher zahlen Eintritt (3 P) und kaufen, was das Volk übrig lässt (5 P je Stück).
  v_besucher := spiel_besucher(s.volk); v_eintritt := 3 * v_besucher; rest := v_besucher;
  foreach w in array array['brot', 'bratwurst', 'kuchen'] loop
    exit when rest <= 0;
    n := least(rest, coalesce((vr->>w)::int, 0));
    if n > 0 then vr := spiel_vorrat_plus(vr, w, -n); rest := rest - n; v_kauf := v_kauf + n; end if;
  end loop;
  v_punkte := v_punkte + v_eintritt + 5 * v_kauf;
  update spiel_spieler as sp set dorf_ab = now(), xp = sp.xp + v_xp, punkte = sp.punkte + v_punkte - bezahlt,
    mana = least(100, coalesce(sp.mana, 0) + v_mana), vorraete = vr,
    volk = coalesce(sp.volk, '{}'::jsonb) || jsonb_build_object('zufrieden', zufrieden, 'satt', satt, 'bedarf', bedarf, 'lohn', lohn, 'bezahlt', bezahlt, 'quote', quote, 'stand', now(),
      'berufe', berufe, 'hunger', hunger, 'forschung', coalesce((sp.volk->>'forschung')::int, 0) + v_forschung)
   where sp.id = uid;
  insert into spiel_protokoll (von, art, wert, waffe) values (uid, 'ernte', v_wurst + v_erz + v_xp + v_mana + v_punkte + v_quarz + v_gold + v_oel + v_getreide + v_brot + v_holz + v_fleisch, 'dorf');
  return jsonb_build_object('ok', true, 'bratwurst', v_wurst, 'erz', v_erz, 'xp', v_xp, 'mana', v_mana, 'punkte_plus', v_punkte,
    'quarz', v_quarz, 'gold', v_gold, 'oel', v_oel, 'goldader', ader, 'zufrieden', zufrieden, 'satt', satt, 'bedarf', bedarf,
    'lohn', lohn, 'bezahlt', bezahlt, 'quote', quote) || jsonb_build_object('getreide', v_getreide, 'brot', v_brot, 'forschung', v_forschung,
    'hunger', hunger, 'weggezogen', weg, 'automatik', takt, 'besucher', v_besucher, 'besucher_kauf', v_kauf, 'eintritt', v_eintritt,
    'holz', v_holz, 'fleisch', v_fleisch) || spiel_ich(null);
end $$;

-- Die Helfer mit fremder Spieler-Kennung sind nur für die Spielfunktionen selbst da.
revoke execute on function spiel_haendler_tag(uuid) from public, anon, authenticated;
