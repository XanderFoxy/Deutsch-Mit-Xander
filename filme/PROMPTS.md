# Die Prompt-Bibliothek

27 fertige Prompts für Grok Imagine. Jeder ist **ein ganzer Text zum
Herauskopieren** — nichts zusammenzusetzen.

---

## Erst die Einstellungen — kurz und verbindlich

| | Wert | warum |
|---|---|---|
| Format | **9:16 hochkant** | der Chat ist hochkant, alles andere verschenkt Fläche |
| Auflösung | **720p** | in deinem Abo enthalten; wir rechnen hier ohnehin auf 400 Punkte herunter, und aus 720p wird das sauberer als aus 480p |
| Länge | **10 Sekunden** bei freigestellten Geschenken, **12–15 s** bei Szenen | ein Geschenk legt sich über den Chat — nach zehn Sekunden will man weiterreden. Eine Szene darf erzählen. |
| Bildrate | 24 fps | Kinolook, und weniger Daten als 30 |

**Nicht** unter 720p gehen. Die Datei wird hier so oder so auf rund
zwei Megabyte gedrückt; was an der Quelle fehlt, holt keine
Komprimierung zurück.

---

## Zwei Sorten Film — und warum das wichtig ist

Du hast „mehr mit Umgebung" gewünscht: wackelnde Palmen, Kameraführung,
epische Ausmaße. Das geht mit einem Greenscreen **nicht** zusammen —
was man wegschneidet, ist genau die Umgebung. Deshalb gibt es ab jetzt
zwei Sorten:

**A — FREIGESTELLT** (grüner Hintergrund). Das Tier liegt durchsichtig
über dem Chat, man liest weiter mit. Umgebung geht trotzdem, solange
sie **am Motiv hängt**: aufgewirbelter Staub, Funken, Wassertropfen,
Blätter, die mitfliegen. Nur der Hintergrund muss flächig grün sein.
Aufruf hier: `bash werkzeug/film-freistellen.sh datei.mp4 name gruen`

**B — SZENE** (volles Bild, keine Freistellung). Eine ganze Welt, mit
Boden, Horizont, Licht und Kamerafahrt. Die Seite legt sie als
Kinobild über den Chat: dunkler Grund ringsum, weiche Kante, runde
Ecken. Aufruf: `bash werkzeug/film-freistellen.sh datei.mp4 name szene`

Beides bleibt in derselben Bibliothek, beides mit Ton, beides mit den
gezeichneten Effekten darüber. Die gezeichneten Animationen, die wir
haben, bleiben alle — hier kommt nur etwas dazu.

---

## Der feste Schluss — er macht den Look gleich

**Für Sorte A (freigestellt)** hängst du an JEDEN Prompt aus Teil 1
wörtlich diesen Absatz an:

> shot on a professional cinema camera, 50mm lens, dramatic key light
> from the front left, crisp detail in fur, scale and skin, subject
> fully in frame from head to feet, vertical 9:16 framing, the entire
> background is one flat uniform saturated chroma key green filling the
> whole frame behind and below the subject, no ground, no horizon, no
> shadow cast on the background, no props resting on the floor, no
> text, no logo, no vignette, no camera shake, 24 fps

**Für Sorte B (Szene)** hängst du statt dessen diesen an:

> cinematic film look, anamorphic lens flare, shallow depth of field,
> volumetric light rays, fine atmospheric haze and floating particles,
> rich contrast with deep blacks and clean highlights, colour graded
> like a modern blockbuster, vertical 9:16 framing, no text, no logo,
> no subtitles, no watermark, no human faces unless described, 24 fps

---

# TEIL 1 — FREIGESTELLT (über dem Chat)

## 1. T-Rex, der Jump-Scare

> A photorealistic Tyrannosaurus rex starts far away and small, walking
> slowly toward the camera, almost calm, its head low and curious. At
> the halfway point it suddenly breaks into a charge, closing the
> distance in three heavy strides, and on the last stride it lunges its
> open jaws straight into the lens and roars, filling the frame with
> teeth and breath vapour. Dust and cracked earth debris burst upward
> from each footfall and fly toward the camera. The skin is scarred and
> weathered, the eyes cold and yellow. Deep sub-bass footfalls, a low
> rumble, then the roar at full force.

## 2. Löwe, der Herrscher

> A magnificent male lion with a thick dark-golden mane stalks forward
> in slow motion, shoulders rolling, then gathers and leaps directly at
> the camera, forelegs extended and claws out, and roars mid-air with
> the mouth wide open. Individual hairs of the mane catch the warm rim
> light and float. A few embers and motes of dust drift upward around
> him. The audio starts with a low chest growl and swells into a full
> roar that cuts off hard as he reaches the lens.

## 3. King Kong, der von Wand zu Wand springt

> A colossal silverback gorilla enters from the lower left, leaps
> diagonally across the frame to the right with enormous force, grabs
> an unseen edge and swings upward, then climbs above the top of the
> frame so only his hanging arm is visible. He drops back down head
> first, hanging upside down, and pushes his open roaring mouth into
> the lens so his teeth and tongue fill the whole frame. Fur ripples
> with each impact, dust puffs burst where his fists land. Thunderous
> impacts, chest beats, and a deafening roar.

## 4. Weißer Hai aus dem Nichts

> A great white shark rises from the bottom of the frame in absolute
> silence, first only a grey shape, then the full body, water streaming
> off its skin and streaming bubbles trailing from its gills. It turns
> once, showing the eye rolling back to white, then explodes upward
> straight at the camera with its mouth open, rows of teeth spreading
> wide, and snaps shut a hand's width from the lens. Sheets of water
> and foam burst outward in the same direction. Muffled underwater
> rumble, then a hard percussive snap and a wall of water noise.

## 5. Adler im Sturzflug

> A bald eagle glides into frame from above, wings fully spread and
> almost motionless, then folds them and dives directly toward the
> camera, growing rapidly. At the last moment it flares the wings open
> to brake, talons extended forward, feathers rippling violently in the
> wind, and screams. Loose down feathers and a few dry leaves tumble in
> the air currents around it. Wind rushing, the snap of the wings
> opening, and a piercing eagle cry.

## 6. Dampflok, die dich überrollt

> A black and brass steam locomotive comes straight at the camera out
> of the far distance, headlamp burning, thick white steam pouring from
> the stack and rolling forward over the boiler. The connecting rods
> drive faster and faster, sparks fly from the wheels, and the
> cowcatcher fills the lower frame before the whole engine passes
> above and past the lens. Steam and sparks drift toward the camera the
> whole time. A distant whistle, then the rhythmic chuff building to a
> roar and a long horn blast at the closest point.

## 7. Dämonenfratze, die lacht

> A carved demonic face made of cracked obsidian and glowing molten
> veins fades in slowly, eyes closed, perfectly still. The eyes snap
> open, burning orange from within, and the mouth splits into a wide,
> unnatural grin. It throws its head back and laughs, and with every
> laugh a burst of embers and black smoke puffs out of the mouth and
> the cracks in the skin flare brighter. The face leans in until it
> fills the frame, still laughing. A deep distorted laugh layered with
> a low growl and crackling fire.

## 8. Katzenbaby, das kuscheln will

> A tiny fluffy kitten with huge round eyes tumbles playfully into
> frame, chases its own tail once, loses balance and rolls over. It
> notices the camera, perks its ears, and trots straight toward the
> lens with small clumsy steps. It rises on its hind legs, presses both
> front paws and then its whole face softly against the lens, and
> purrs, eyes half closing. A few bright dust motes drift in the warm
> light. Soft mews, tiny paw pats, and a warm continuous purr.

## 9. Entenfamilie, die vorbeiwatschelt

> A mother mallard duck waddles across the frame from left to right,
> unhurried, followed by seven fluffy ducklings in a wobbling line, the
> last one hurrying to catch up. One duckling stops, looks up at the
> camera, shakes itself so water droplets spray outward, and scurries
> after the others. Their feathers are individually detailed, droplets
> catch the light. Gentle quacking, tiny high-pitched peeps, and the
> soft patter of webbed feet.

## 10. Pinguine, die den Hang herunterrutschen

> A group of five emperor penguins waddles toward the camera in a comic
> single file, bumping into one another. The first one slips, drops onto
> its belly and slides directly at the lens, flippers spread, spraying
> a fan of powder snow. The others throw themselves down and follow,
> piling up just before the camera in a heap of flippers and snow.
> Loose snow crystals sparkle and drift in the air. Excited penguin
> squawks, sliding whoosh, and a soft thump at the end.

## 11. Der Zauberer und das Kaninchen

> A pair of white-gloved hands holds a black silk top hat toward the
> camera and taps its brim twice with a slender black wand. Golden
> sparks spiral up out of the hat. A white rabbit's ears rise first,
> then it hops out and lands facing the camera, nose twitching, and a
> shower of glitter and tiny stars bursts outward around it. The
> rabbit's fur is soft and individually detailed. A light musical
> shimmer, a soft pop, and a sparkle cascade.

## 12. Achtziger: der Synthesizer-Anfall

> A vintage analogue synthesizer floats in frame at a three-quarter
> angle, its keys playing by themselves in a fast arpeggio, patch
> cables swinging, VU meters bouncing. Neon magenta and cyan light
> pulses across the chrome in time with the music, and glowing
> wireframe grids and geometric shapes burst out of the keyboard toward
> the camera on the beat. The whole thing tilts and the last chord
> sends a shockwave of light rings outward. A driving synthwave riff
> with a fat bass line and gated reverb drums.

## 13. Die Hand Gottes

> An enormous human hand made of golden light descends slowly from the
> top of the frame, palm open and downward, fingers larger than the
> whole view. Rays of light pour between the fingers and dust motes
> spiral upward into it. The hand stops, then opens fully, and a
> radiant burst of warm white light expands outward from the palm and
> washes over the camera. The skin is translucent, veined with living
> light. A rising choral swell and a deep sustained bell tone.

## 14. Das große Schloss und die Tür, die zufällt

> A massive ancient iron padlock hangs in frame, turning slowly, the
> metal pitted and cold. A heavy oak door swings shut behind it with a
> crash, and the lock's shackle snaps closed with a violent metallic
> clack that sends sparks and rust flakes flying at the camera. The
> whole lock jolts, then hangs still, and a thin trail of dust settles.
> A groaning hinge, a heavy wooden slam, and a sharp metallic snap with
> a long reverberating tail.

---

# TEIL 2 — SZENEN (ganze Welten)

## 15. Jurassische Dämmerung

> A wide vertical shot of a prehistoric valley at golden hour. Hundred
> metre tall alien palms and tree ferns sway in a strong warm wind,
> their fronds whipping. The camera pushes forward low over the ground
> through the swaying stalks. A herd of long-necked dinosaurs drifts
> across the far background. Then the ground shakes, the camera trembles
> with each impact, water in a foreground puddle ripples in rings, and
> a Tyrannosaurus rex steps into frame from the right in silhouette
> against the sun and roars, scattering a flock of pterosaurs into the
> orange sky. Ash and pollen drift through the light rays.

## 16. Ägypten: die Kammer unter der Pyramide

> The camera glides down a torchlit corridor deep inside the Great
> Pyramid, hieroglyphs carved into the limestone walls sliding past on
> both sides, torch flames leaning in the draught. The corridor opens
> into a vast burial chamber. A single shaft of moonlight falls through
> a slot in the ceiling onto a golden sarcophagus in the centre. Dust
> hangs in the beam. The sarcophagus lid slides open by itself with a
> deep grinding sound, and golden light pours out, spilling across the
> floor and up the walls. Low ceremonial drums and a distant desert wind.

## 17. Die Nahrungskette — vier Schläge

> Underwater, sunlight rippling down from above in god rays. A tiny
> silver fish darts across the frame and is swallowed by a larger fish
> that strikes from the left. That fish turns and is immediately taken
> by a barracuda from below. The barracuda accelerates upward to escape
> and breaks the surface in a burst of spray — and out of the sky an
> enormous sea eagle snatches it in mid-air and carries it out of the
> top of the frame. The camera follows each strike with a hard whip pan.
> Muffled underwater booms, then the surface break in full clarity and
> a raptor's cry.

## 18. Das Ungetüm in der Tiefe

> The camera sinks slowly through dark blue water, the surface light
> fading above until there is only blackness and a few drifting flecks
> of marine snow. Two faint bioluminescent lights appear far below and
> begin to rise. They grow apart — they are eyes, impossibly far apart.
> A creature that should not exist rises into view: ridged, scarred,
> ancient, wider than the frame, its mouth opening slowly to reveal
> rows of glowing teeth. The camera holds, then the jaw closes over the
> lens and everything goes black. Deep groaning whale-song bass, a slow
> heartbeat, and total silence at the end.

## 19. Der Weihnachtsschlitten über der Stadt

> A snow covered village at night seen from above, warm yellow windows
> and a frozen river reflecting the moon. Snow falls steadily. Santa's
> sleigh enters small in the distance, pulled by eight reindeer, and
> the camera flies with it as it banks into a long graceful curve over
> the rooftops, trailing a ribbon of golden sparkle behind the runners.
> The sleigh climbs toward the camera, passes close enough to see the
> gifts heaped in the back, then rises into the falling snow toward a
> full moon. Sleigh bells, a rush of wind, and a warm orchestral swell.

## 20. Raumschiff am Ringplaneten

> Deep space. A vast ringed gas giant fills the lower half of the
> frame, banded in amber and cream, its rings catching the light edge
> on. A sleek exploration starship drops out of light speed in a
> streaking flash directly in front of the camera, close enough to see
> panel lines and running lights, then turns with a low engine surge
> and accelerates along the ring plane, scattering ice particles in its
> wake. The camera rolls to follow. A deep engine hum rising to a
> thrum, and a distant orchestral theme.

## 21. Kreuzzug im Morgengrauen

> A misty medieval battlefield at dawn, banners hanging wet and heavy,
> frost on the grass. The camera rises slowly from ground level through
> a forest of spear shafts. Hundreds of armoured knights stand in
> silence, breath steaming. A single horn sounds, the front rank lowers
> its lances as one, and the whole line begins to move, the ground
> shaking, mud and frost thrown up by the hooves. The camera tracks
> backward ahead of the charge as it builds to a gallop. A low war
> horn, the roar of voices, and thundering hooves.

## 22. Hades und der Styx

> A black river of slow molten shadow flowing between cliffs of burnt
> obsidian, embers rising from the water like reversed rain. A hooded
> ferryman poles a narrow boat toward the camera through the murk. As
> the boat passes, the water behind it splits and a colossal
> three-headed hound rises from the depths, chains trailing from its
> necks, and all three heads bellow at once, blasting embers and ash
> toward the lens. The cliff walls glow red with the sound. A subsonic
> growl, rattling chains, and a triple-layered roar.

## 23. Das U-Boot und der Krake

> The camera drifts in deep green water beside a riveted brass and iron
> submarine, its portholes glowing warm yellow, bubbles streaming from
> its vents. Shafts of light cut down from a distant surface. Something
> moves at the edge of the light — an enormous tentacle, thicker than
> the hull, coils slowly out of the dark and wraps around the boat.
> More follow. The submarine's lights flicker, it lists hard to one
> side, and the whole mass is dragged down and out of the bottom of the
> frame. Groaning metal, muffled sonar pings, and a deep rushing pull.

## 24. Der Wasserfall der Wildvögel

> A tropical waterfall seen from the plunge pool looking up, water
> thundering down through a cathedral of green, spray hanging in the
> sunbeams and making a rainbow. Giant leaves nod under the falling
> droplets. A flock of brilliantly coloured macaws bursts out from
> behind the water curtain, scatters across the frame in every
> direction and wheels upward through the light, leaving trails in the
> mist. The camera tilts up to follow them into the canopy. Roaring
> water, echoing bird calls, and dripping leaves.

## 25. Sandsturm über der Karawane

> A desert of enormous dunes under a bleached white sky. A camel
> caravan moves across the frame in the middle distance, tiny against
> the scale. The camera pushes low over the sand, grains streaming past
> the lens. On the horizon a wall of orange dust a kilometre high rolls
> forward, swallowing the dunes one ridge at a time. The caravan turns
> to run. The wall reaches the camera and everything vanishes into
> churning orange, then a single figure's silhouette passes through the
> haze. A rising howl of wind and a deep granular roar.

## 26. Der Vulkan bricht aus

> A volcanic island at night seen from across black water, its cone
> glowing dull red at the summit. The camera drifts slowly closer. The
> glow brightens, the mountain shudders, and the summit bursts upward
> in a column of fire and ash that climbs out of the top of the frame,
> throwing glowing bombs in long arcs that splash into the sea. A
> lightning storm crackles inside the ash column. A wave of heat haze
> distorts the air. The shockwave hits the camera a beat after the
> eruption. A colossal deep boom followed by continuous rumbling and
> hissing steam.

## 27. Der Ritter und das große Tor

> A colossal stone gate in a cliff face, twenty metres high, carved with
> weathered runes, torches burning on either side and snow drifting
> past. A single armoured figure walks toward it from the camera,
> small against its scale, cloak snapping in the wind. The figure
> raises a hand; the runes ignite one by one from the bottom upward.
> The gate's halves grind apart, spilling white light and warm air that
> melts the falling snow, and the camera pushes through the widening
> gap into the glare. Grinding stone, a low choral drone, and wind.

---

# TEIL 3 — MIT DIR IM BILD (Referenzbild)

Diese drei brauchen ein **Foto von dir** als Vorlage (in Grok Imagine
„image to video" bzw. „reference"). Ein Bild reicht: frontal,
gleichmässig ausgeleuchtet, Gesicht frei, Schultern mit drauf.

## 28. Du als Zauberer

> The man from the reference image stands centred, wearing a deep
> midnight blue magician's cloak and a black top hat, keeping his face
> exactly as in the reference. He holds the hat toward the camera,
> taps it twice with a wand, and a white rabbit hops out in a burst of
> golden glitter. He looks up at the camera and smiles. Same face,
> same hairline, same features as the reference image throughout.

## 29. Du auf dem Dinosaurier

> The man from the reference image rides on the shoulders of a walking
> Tyrannosaurus rex, one hand gripping a leather harness, the other
> raised in triumph, his coat and hair blown back by the wind. The
> dinosaur strides toward the camera and roars; he laughs. Keep his
> face identical to the reference image in every frame, correct
> proportions between rider and animal.

## 30. Du als Lehrer vor der Tafel

> The man from the reference image stands beside a large green
> chalkboard, chalk in hand, and writes a German word on it with a
> confident flourish, then turns to the camera and gestures toward the
> board with an encouraging smile. Warm classroom light from a window
> on the left. Keep his face identical to the reference image.

---

## Wie es hier weitergeht

Schick mir die fertigen Videos, wie bisher. Ich stelle frei
beziehungsweise setze sie als Szene auf, messe die Stösse für die
Effekte, mache sie klein und hänge sie in die Bibliothek. Pro Film
braucht das hier rund drei Minuten.

**Automatisch geht es nicht.** Es gibt hier keinen Grok-Anschluss, und
`api.x.ai` ist vom Netzfilter dieser Umgebung gesperrt (geprüft:
Antwort 000, keine Verbindung). Ein API-Schlüssel würde daran nichts
ändern. Du erzeugst, ich verarbeite — das ist der Weg.
