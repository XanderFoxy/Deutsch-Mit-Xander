# Das Relais (TURN) — was es ist, was schiefging, wie man es prüft

Dieses Blatt gehört Alex. Es steht hier, damit die Antwort auf
„funktioniert TURN jetzt?" nicht jedes Mal neu erraten werden muss,
sondern nachgelesen und **nachgemessen** werden kann.

## Wozu überhaupt ein Relais

Zwei Leute in verschiedenen Netzen (Deutschland ↔ Ägypten) bekommen
ihre Tonpakete oft nicht direkt zueinander: die Mobilfunknetze dort
arbeiten mit „symmetrischem NAT", und dahinter hilft nur ein Server in
der Mitte, der die Pakete weiterreicht. Das ist ein **TURN-Relais**.
Ohne eines hört man sich in einem Netz, über Netze hinweg nicht — und
genau so sah es aus: „Ich konnte Emmi hören, sie mich nicht."

Die öffentlichen Gratis-Relais, die als Reserve eingetragen sind,
sind überlastet und reichen dafür nicht.

## Wie es hier gebaut ist

* Die Cloudflare-Zugangsdaten liegen **in Supabase**, in der Tabelle
  `betreiber_geheimnisse` (`cf_turn_id`, `cf_turn_token`).
  Sie stehen **nirgends im Repository** und dürfen dort auch nie
  stehen.
* Die Edge-Function `klassenzimmer` gibt auf `{"aktion":"zugang"}`
  kurzlebige Zugangsdaten heraus (zwei Stunden gültig) — aber nur an
  Angemeldete (`auth.getUser`).
* Jede Ausgabe wird in `turn_nutzung` gezählt (eine Zeile je Person
  und Tag).
* Zwei Bremsen: **60 Ausgaben je Person und Tag**, und ein
  **Monatsbudget** in Gigabyte. Die Funktion rechnet je Ausgabe
  vorsichtshalber mit 72 MB.

## Was am 18. September wirklich passiert ist

Gemessen, nicht vermutet — in den Protokollen der Edge-Function:

| Antwort | Anzahl |
|---------|-------:|
| 200     | 278 |
| **429** | **134** |
| 503     | 28 |

Und in `turn_nutzung` standen **14 Ausgaben**.

Das Monatsbudget war nie gesetzt worden, also galt der eingebaute
Standardwert von **1 GB**. Die Rechnung der Funktion:

```
14 Ausgaben × 72 MB = 1008 MB
1008 MB + 72 MB     = 1080 MB   >   1024 MB
```

Ab der **15. Anfrage** hat die Funktion deshalb jedem mit
`429 budget-erschoepft` geantwortet — **auch einem angemeldeten
Konto**. Emmi war also nicht „Gast ohne Anmeldung", wie ich zuerst
vermutet hatte. Ihr Gerät hat gefragt, eine Absage bekommen und
**still** auf die öffentlichen Relais zurückgeschaltet. Die 28
Absagen mit 503 sind älter: sie stammen von vor 18:19 Uhr, als die
Schlüssel noch gar nicht eingetragen waren.

## Was daran geändert wurde

1. **`turn_budget_gb = 100`** steht jetzt in `betreiber_geheimnisse`.
   Das sind rechnerisch rund 1400 Ausgaben im Monat. Cloudflare gibt
   für TURN ein grosszügiges Freikontingent; 100 GB ist eine Bremse
   gegen einen Unfall, kein Alltagslimit.
2. **Die Absage ist nicht mehr still.** Wer ohne eigenes Relais im
   Raum sitzt, bekommt beim Betreten eine Zeile im Chat, die den
   Grund im Klartext nennt — und `/leitung` zeigt ihn ausführlich.
3. Der eingebaute Standardwert in der Edge-Function steht weiterhin
   auf 1 GB. **Das ist die eine Sache, die noch offen ist:** solange
   die Zeile `turn_budget_gb` existiert, spielt er keine Rolle; wird
   sie je gelöscht, ist die Falle wieder da. Der Wert sollte bei
   Gelegenheit in der Funktion selbst auf 25 hochgesetzt werden.

## Wie man nachsieht, ob es wirklich läuft

**Im Chat**, auf jedem Gerät einzeln:

```
/leitung
```

Dort steht für jede Person im Raum, ob sie auf dem eigenen Relais
sitzt („eigenes Relais ✔") oder nur auf den öffentlichen („nur die
oeffentlichen ⚠"). Nur wenn es bei **beiden** ✔ steht, ist die
Leitung wirklich abgesichert.

**In Supabase**, hinterher:

```sql
select tag, count(*) as geraete, sum(anfragen) as ausgaben
from turn_nutzung group by tag order by tag desc;
```

Nach einem Gespräch zu zweit müssen dort **zwei** Geräte an diesem
Tag stehen. Steht nur eines da, hat die andere Seite keine
Zugangsdaten bekommen — dann sagt `/leitung` auf ihrem Gerät, warum.

## Was ich nicht versprechen kann

Dass der Ton jetzt in jedem Fall ankommt, kann ich **nicht** messen:
dazu bräuchte ich zwei echte Geräte in zwei echten Netzen. Was ich
messen kann und gemessen habe, ist der Weg bis zu den Zugangsdaten —
und der war nachweislich verstopft. Der nächste ehrliche Prüfstein
ist die Tabelle oben: **zwei Geräte an einem Tag.**
