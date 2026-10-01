-- FASSUNG 829 — XANDER (Funk 255): „bei den Tieren weiß ich nicht ob die beiden Superkraft haben weil ich habe beide
-- aktiviert aber es geht immer nur eine". Bisher war genau EINE Tier-Fähigkeit ausrüstbar (spiel_spieler.faehigkeit).
-- Jetzt zwei: faehigkeit und faehigkeit2, jede mit eigener Ruhepause (faehig_ab / faehig2_ab). Ältere Seiten rufen
-- spiel_tier_faehigkeit ohne p_art und nutzen damit wie bisher die erste.
alter table spiel_spieler add column if not exists faehigkeit2 text;
alter table spiel_spieler add column if not exists faehig2_ab timestamptz;

drop function if exists public.spiel_faehigkeit_setzen(text);
create or replace function public.spiel_faehigkeit_setzen(p_art text default null, p_ab boolean default false)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare uid uuid := auth.uid(); a spiel_spieler;
begin
  if uid is null then return jsonb_build_object('ok', false, 'grund', 'nicht angemeldet'); end if;
  select * into a from spiel_spieler where id = uid;
  if a.id is null then return jsonb_build_object('ok', false, 'grund', 'spielt nicht'); end if;
  if p_art is not null then
    if p_ab then
      -- ablegen
      if a.faehigkeit = p_art then a.faehigkeit := a.faehigkeit2; a.faehig_ab := a.faehig2_ab; a.faehigkeit2 := null; a.faehig2_ab := null;
      elsif a.faehigkeit2 = p_art then a.faehigkeit2 := null; a.faehig2_ab := null;
      end if;
    else
      if spiel_faehigkeit_regel(p_art) is null then return jsonb_build_object('ok', false, 'grund', 'dieses Tier hat keine Fähigkeit'); end if;
      if not (a.haustier = p_art or a.flugtier = p_art or coalesce(a.tiere, '{}'::jsonb) ? p_art) then
        return jsonb_build_object('ok', false, 'grund', 'das Tier gehört dir nicht');
      end if;
      if p_art is not distinct from a.faehigkeit or p_art is not distinct from a.faehigkeit2 then
        null;   -- schon ausgerüstet
      elsif a.faehigkeit is null then a.faehigkeit := p_art;
      elsif a.faehigkeit2 is null then a.faehigkeit2 := p_art;
      else
        -- beide belegt: die ältere geht, die neue kommt dazu
        a.faehigkeit := a.faehigkeit2; a.faehig_ab := a.faehig2_ab; a.faehigkeit2 := p_art; a.faehig2_ab := null;
      end if;
    end if;
    update spiel_spieler set faehigkeit = a.faehigkeit, faehig_ab = a.faehig_ab, faehigkeit2 = a.faehigkeit2, faehig2_ab = a.faehig2_ab where id = uid;
  end if;
  return jsonb_build_object('ok', true, 'faehigkeit', a.faehigkeit,
    'bereit_s', greatest(0, ceil(extract(epoch from (coalesce(a.faehig_ab, now()) - now()))))::int,
    'faehigkeit2', a.faehigkeit2,
    'bereit2_s', greatest(0, ceil(extract(epoch from (coalesce(a.faehig2_ab, now()) - now()))))::int);
end $function$;

drop function if exists public.spiel_tier_faehigkeit(uuid, text);
create or replace function public.spiel_tier_faehigkeit(p_ziel uuid default null, p_raum text default null, p_art text default null)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
#variable_conflict use_column
declare uid uuid := auth.uid(); a spiel_spieler; z spiel_spieler; r jsonb; art text; minute integer;
        kosten integer := 15; roh integer := 0; rest integer := 0; schild_weg integer := 0; ko boolean := false;
        heil integer := 0; klau integer := 0; lohn integer := 0; zielt boolean; d spiel_duelle; stunde integer;
        zwei boolean := false; ruht_bis timestamptz;
begin
  if uid is null then return jsonb_build_object('ok', false, 'grund', 'nicht angemeldet'); end if;
  a := spiel_frisch(uid);
  if a.id is null then return jsonb_build_object('ok', false, 'grund', 'spielt nicht'); end if;
  art := coalesce(nullif(p_art, ''), a.faehigkeit);
  zwei := art is not null and art is not distinct from a.faehigkeit2 and art is distinct from a.faehigkeit;
  if art is distinct from a.faehigkeit and not zwei then art := null; end if;
  r := spiel_faehigkeit_regel(art);
  if r is null then return jsonb_build_object('ok', false, 'grund', 'rüste erst eine Tier-Fähigkeit aus (Menü → Tiere)'); end if;
  if not spiel_tier_hat(a, art) then return jsonb_build_object('ok', false, 'grund', 'dein Tier hat keine Kraft – erst füttern'); end if;
  if not a.mitspielen then return jsonb_build_object('ok', false, 'grund', 'schalte erst „Mitspielen" an'); end if;
  if a.kaputt then return jsonb_build_object('ok', false, 'grund', 'du bist kaputt – nimm ein Pflaster'); end if;
  if a.zwerg_bis > now() then return jsonb_build_object('ok', false, 'grund', 'du bist ein Gartenzwerg'); end if;
  ruht_bis := case when zwei then a.faehig2_ab else a.faehig_ab end;
  if ruht_bis > now() then
    return jsonb_build_object('ok', false, 'grund', 'dein Tier ruht sich noch aus', 'bereit_s', ceil(extract(epoch from (ruht_bis - now())))::int, 'art', art);
  end if;
  if a.mana < kosten then return jsonb_build_object('ok', false, 'grund', 'zu wenig Mana (15) – löse Deutschaufgaben'); end if;
  zielt := r->>'auf' = 'ziel';
  if zielt then
    if p_ziel is null or p_ziel = uid then return jsonb_build_object('ok', false, 'grund', 'wähle erst ein Ziel'); end if;
    z := spiel_frisch(p_ziel);
    if z.id is null or not z.mitspielen then return jsonb_build_object('ok', false, 'grund', 'spielt gerade nicht mit'); end if;
    if p_raum is not null and exists (select 1 from spiel_raum where raum = p_raum and waffenstillstand) then
      return jsonb_build_object('ok', false, 'grund', 'Waffenstillstand – die Tafel ist offen');
    end if;
    if z.geschuetzt_bis > now() then return jsonb_build_object('ok', false, 'grund', 'ist geschützt'); end if;
    if z.tarn_bis > now() then return jsonb_build_object('ok', false, 'grund', 'ist getarnt – nicht zu treffen'); end if;
    if z.kaputt then return jsonb_build_object('ok', false, 'grund', 'ist schon kaputt'); end if;
    select * into d from spiel_duelle where status = 'laeuft' and beginn > now() - interval '3 minutes'
       and (uid in (von, an) or p_ziel in (von, an)) order by id desc limit 1;
    if found and not (uid in (d.von, d.an) and p_ziel in (d.von, d.an)) then
      return jsonb_build_object('ok', false, 'grund', 'Duell läuft – Unbeteiligte sind außen vor');
    end if;
    select coalesce(sum(wert),0) into minute from spiel_protokoll where an = p_ziel and art = 'treffer' and zeit > now() - interval '1 minute';
    if coalesce((r->>'schaden')::int, 0) > 0 and minute >= 60 then return jsonb_build_object('ok', false, 'grund', 'hat für diese Minute genug abbekommen'); end if;
  end if;

  update spiel_spieler set mana = mana - kosten,
         faehig_ab = case when zwei then faehig_ab else now() + interval '90 seconds' end,
         faehig2_ab = case when zwei then now() + interval '90 seconds' else faehig2_ab end,
         geschuetzt_bis = case when zielt then least(geschuetzt_bis, now()) else geschuetzt_bis end,
         tarn_bis = case when zielt then least(tarn_bis, now()) else tarn_bis end,
         xp = xp + 1 where id = uid;

  if zielt then
    roh := round(coalesce((r->>'schaden')::int, 0) * spiel_fair(spiel_level(a.xp), spiel_level(z.xp))
                 * case when z.eisen_bis > now() then 0.5 else 1 end);
    roh := greatest(0, least(roh, 60 - minute));
    rest := roh;
    -- Der Schild fängt zuerst ab – außer der Greif stößt durch.
    if rest > 0 and not coalesce((r->>'durch')::boolean, false) and z.schild_bis > now() and z.schild_lp > 0 then
      schild_weg := least(rest, z.schild_lp); rest := rest - schild_weg;
    end if;
    if r ? 'klau' then klau := least(coalesce((r->>'klau')::int, 0), greatest(0, z.punkte)); end if;
    z.lp := greatest(0, z.lp - rest);
    ko := z.lp = 0 and rest > 0;
    update spiel_spieler set lp = z.lp, kaputt = ko or kaputt, schild_lp = greatest(0, schild_lp - schild_weg), punkte = punkte - klau,
           wackel_bis = case when r ? 'wackel' then now() + make_interval(secs => (r->>'wackel')::int) else wackel_bis end,
           hexe_bis   = case when r ? 'hexe'   then now() + make_interval(secs => (r->>'hexe')::int) else hexe_bis end,
           nebel_bis  = case when r ? 'nebel'  then now() + make_interval(secs => (r->>'nebel')::int) else nebel_bis end,
           brezel_bis = case when r ? 'brezel' then now() + make_interval(secs => (r->>'brezel')::int) else brezel_bis end,
           letzter_treffer = case when rest > 0 then now() else letzter_treffer end, lp_stand = now()
     where id = p_ziel;
    if roh > 0 then insert into spiel_protokoll (von, an, art, wert, waffe, zone) values (uid, p_ziel, 'treffer', roh, 'tier_' || art, 'koerper'); end if;
    if klau > 0 then update spiel_spieler set punkte = punkte + klau where id = uid; end if;
  end if;
  -- Was auf einen selbst wirkt (auch der Heil-Anteil des Regenbogenfeuers).
  heil := coalesce((r->>'heil')::int, 0);
  update spiel_spieler s2 set
         lp = case when heil > 0 and not s2.kaputt then least(spiel_lp_max_s(s2), s2.lp + heil) else s2.lp end,
         schild_lp = case when r ? 'schild' then greatest(case when s2.schild_bis > now() then s2.schild_lp else 0 end, 0) + (r->>'schild')::int else s2.schild_lp end,
         schild_bis = case when r ? 'schild' then greatest(coalesce(s2.schild_bis, now()), now() + interval '60 seconds') else s2.schild_bis end,
         eisen_bis = case when r ? 'eisen' then now() + make_interval(secs => (r->>'eisen')::int) else s2.eisen_bis end,
         ziel_bis = case when r ? 'zielen' then now() + make_interval(secs => (r->>'zielen')::int) else s2.ziel_bis end,
         tarn_bis = case when r ? 'tarn' then now() + make_interval(secs => (r->>'tarn')::int) else s2.tarn_bis end,
         geschuetzt_bis = case when r ? 'wache' then greatest(coalesce(s2.geschuetzt_bis, now()), now() + make_interval(secs => (r->>'wache')::int)) else s2.geschuetzt_bis end,
         mana = case when r ? 'mana' then least(100, s2.mana + (r->>'mana')::int) else s2.mana end,
         pflaster = s2.pflaster + coalesce((r->>'pflaster')::int, 0),
         haustier_leben = case when r ? 'tierheil' and s2.haustier is not null then least(spiel_tier_max(s2.haustier, s2.haustier_stufe), coalesce(s2.haustier_leben,0) + (r->>'tierheil')::int) else s2.haustier_leben end,
         flugtier_leben = case when r ? 'tierheil' and s2.flugtier is not null then least(spiel_tier_max(s2.flugtier, s2.flugtier_stufe), coalesce(s2.flugtier_leben,0) + (r->>'tierheil')::int) else s2.flugtier_leben end,
         lp_stand = now()
   where s2.id = uid;
  insert into spiel_protokoll (von, an, art, wert, waffe) values (uid, coalesce(p_ziel, uid), 'faehigkeit', kosten, art);
  if zielt and rest > 0 then
    select count(*) into stunde from spiel_protokoll where von = uid and art = 'lohn' and zeit > now() - interval '1 hour';
    if stunde < 20 then lohn := 1; end if;
    if ko then lohn := lohn + 3; end if;
    if d.id is not null and ko then update spiel_duelle set status = 'vorbei', sieger = uid where id = d.id; lohn := lohn + 5; end if;
    if lohn > 0 then
      update spiel_spieler set punkte = punkte + lohn where id = uid;
      insert into spiel_protokoll (von, an, art, wert) values (uid, p_ziel, 'lohn', lohn);
    end if;
  end if;
  if zielt then select * into z from spiel_spieler where id = p_ziel; end if;
  return jsonb_build_object('ok', true, 'art', art, 'zwei', zwei, 'name', r->>'name', 'auf', r->>'auf', 'schaden', rest, 'schild_weg', schild_weg,
    'klau', klau, 'heil', heil, 'kaputt', coalesce(z.kaputt, false), 'lohn', lohn, 'kosten', kosten, 'bereit_s', 90,
    'ziel', case when zielt then spiel_oeffentlich(z) end, 'ich_voll', spiel_ich(null));
end $function$;

-- dieselben Rechte wie vorher (die Funktionen prüfen selbst auth.uid())
grant execute on function public.spiel_faehigkeit_setzen(text, boolean) to anon, authenticated, service_role;
grant execute on function public.spiel_tier_faehigkeit(uuid, text, text) to anon, authenticated, service_role;
