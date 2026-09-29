-- =====================================================================
-- FASSUNG 827 — DIE BREMSE FUER DEN TONSERVER (Cloudflare Realtime SFU)
-- ---------------------------------------------------------------------
-- XANDER: „Die App … haengt total erst recht. Wenn andere Leute mit
--  dazu kommen … das funktioniert auch bei HelloTalk … was muessen wir
--  denn machen damit das endlich leicht und stabil laeuft?"
--
-- Zugesagt: 1000 GB im Monat sind frei, danach kostet es 0,05 $ je GB.
-- Bei geschaetzt 1000 GB schaltet der Tonserver ab und alle reden
-- wieder direkt (Mesh). Es darf ihn nie etwas kosten.
--
-- Zwei Tabellen, beide mit Zeilenschutz AN und OHNE eine einzige Regel:
-- lesen und schreiben darf nur die Edge-Function „sfu" mit dem
-- Service-Key. Der Browser hat hier nichts zu suchen.
--
--   sfu_verbrauch  — je TAG die geschaetzten Gigabyte. Gerechnet wird
--                    ueber die letzten 31 Tage (nicht ueber den
--                    Kalendermonat): so liegt JEDER Abrechnungsmonat von
--                    Cloudflare, egal an welchem Tag er beginnt, ganz in
--                    einem gezaehlten Fenster. Strenger geht es nicht.
--   sfu_sitzungen  — jede Tonserver-Sitzung mit den Spuren, die sie
--                    GEHOERT (empfaengt). Nur das Empfangen kostet
--                    (Cloudflare rechnet nach Daten, die ZUM Geraet
--                    gehen); das Senden in den Server ist frei.
--
-- Mit dem Supabase-MCP als Migration „sfu_verbrauch_827" eingespielt.
-- =====================================================================

create table if not exists public.sfu_verbrauch (
  tag            date        primary key,
  geschaetzt_gb  numeric     not null default 0,
  spur_sekunden  bigint      not null default 0,
  aktualisiert   timestamptz not null default now()
);
alter table public.sfu_verbrauch enable row level security;

create table if not exists public.sfu_sitzungen (
  sitzung       text        primary key,
  user_id       uuid        not null references auth.users (id) on delete cascade,
  erstellt      timestamptz not null default now(),
  letzter_puls  timestamptz not null default now(),
  -- die mids der GEHOERTEN Spuren dieser Sitzung (Liste von Texten)
  empfang       jsonb       not null default '[]'::jsonb,
  geschlossen   boolean     not null default false
);
alter table public.sfu_sitzungen enable row level security;
create index if not exists sfu_sitzungen_offen on public.sfu_sitzungen (geschlossen, letzter_puls);
create index if not exists sfu_sitzungen_nutzer on public.sfu_sitzungen (user_id, erstellt);

revoke all on public.sfu_verbrauch  from anon, authenticated;
revoke all on public.sfu_sitzungen  from anon, authenticated;

-- ---------------------------------------------------------------------
-- DER PULS: bucht fuer EINE Sitzung die Zeit seit dem letzten Puls.
--   Sekunden  = seit letztem Puls, hoechstens 300 (eine Sitzung, die
--               laenger schweigt, wird von der Function zwangsweise
--               geschlossen — siehe „aufraeumen" dort)
--   Gigabyte  = gehoerte Spuren × Sekunden × kbit/s ÷ 8 ÷ 1024²
-- Alles unter einer Zeilensperre: zwei gleichzeitige Pulse buchen
-- dieselbe Zeit nicht doppelt, und keiner geht verloren.
-- Rueckgabe: die geschaetzten GB der letzten 31 Tage (nach der Buchung).
-- ---------------------------------------------------------------------
create or replace function public.sfu_puls_buchen(p_sitzung text, p_kbit integer)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alt     timestamptz;
  v_spuren  integer;
  v_sek     numeric;
  v_gb      numeric;
  v_summe   numeric;
begin
  select letzter_puls, jsonb_array_length(empfang)
    into v_alt, v_spuren
    from sfu_sitzungen where sitzung = p_sitzung for update;
  if found then
    v_sek := least(greatest(extract(epoch from (now() - v_alt)), 0), 300);
    update sfu_sitzungen set letzter_puls = now() where sitzung = p_sitzung;
    if v_spuren > 0 and v_sek > 0 then
      v_gb := v_spuren * v_sek * p_kbit / 8.0 / 1024.0 / 1024.0;
      insert into sfu_verbrauch (tag, geschaetzt_gb, spur_sekunden, aktualisiert)
        values ((now() at time zone 'utc')::date, v_gb, ceil(v_spuren * v_sek)::bigint, now())
      on conflict (tag) do update
        set geschaetzt_gb = sfu_verbrauch.geschaetzt_gb + excluded.geschaetzt_gb,
            spur_sekunden = sfu_verbrauch.spur_sekunden + excluded.spur_sekunden,
            aktualisiert  = now();
    end if;
  end if;
  select coalesce(sum(geschaetzt_gb), 0) into v_summe
    from sfu_verbrauch where tag > (now() at time zone 'utc')::date - 31;
  return v_summe;
end;
$$;

revoke execute on function public.sfu_puls_buchen(text, integer) from public, anon, authenticated;
grant execute on function public.sfu_puls_buchen(text, integer) to service_role;

-- Aufraeumen, wer will:
--   delete from public.sfu_sitzungen where erstellt < now() - interval '40 days';
--   delete from public.sfu_verbrauch where tag < current_date - 400;
