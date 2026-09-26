#!/usr/bin/env node
/* HOLT ECHTE GERAEUSCHE FUER DIE ANIMATIONEN — sparsam.

   GEWUENSCHT: „Koennen wir eigentlich was machen wegen den Sounds,
   dass wir den Orkan und so — dass wir da realistische Sounds dafuer
   bekommen? Wenn du das Opus Format nimmst, ist es klein."

   Die Toene in der Seite sind bisher Sinuswellen aus dem Browser:
   gratis, sofort da, aber eben synthetisch. Hier kommen echte
   Geraeusche dazu. Sie werden EINMAL erzeugt und liegen danach als
   Datei im Haus — jedes Abspielen ist gratis.

   SPARSAMKEIT, ausdruecklich gewuenscht („verbrenn keine Credits"):
     * jede Datei nur, wenn sie noch nicht da ist;
     * kurz (2 bis 4 Sekunden);
     * danach auf Opus mit 24 kbit/s heruntergerechnet — das ergibt
       etwa 8 bis 15 Kilobyte je Geraeusch.

   AUFRUF:
       ELEVEN_KEY=... node werkzeug/geraeusche-holen.js [nur-dieser-name]
   Der Schluessel steht NIE in einer Datei im Repo.
*/
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SCHLUESSEL = process.env.ELEVEN_KEY || "";
if (!SCHLUESSEL) { console.error("Kein ELEVEN_KEY gesetzt."); process.exit(1); }

const WURZEL = path.dirname(__dirname);
const ZIEL = path.join(WURZEL, "ton");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";

/* Was gebraucht wird — der Name ist der Name der WIRKUNG in app.js. */
const GERAEUSCHE = [
  { name: "orkan",     dauer: 4, text: "Strong howling storm wind gusting through a narrow street, continuous, no music, no voices" },
  { name: "gewitter",  dauer: 4, text: "A single close thunderclap with a long rolling rumble afterwards, distant rain, no music" },
  { name: "regen",     dauer: 4, text: "Steady rain falling on a window and pavement, soft and continuous, no music, no voices" },
  { name: "feuerwerk", dauer: 3, text: "Two fireworks rockets launching and bursting overhead with crackling sparks, outdoors, no music" },
  { name: "glasbruch", dauer: 2, text: "A pane of glass shattering into many pieces on a hard floor, single impact, no music" },
  { name: "dino",      dauer: 3, text: "A huge dinosaur roar, deep and guttural, ending in a growl, no music" },
  { name: "pirat",     dauer: 4, text: "Wooden sailing ship creaking on ocean waves, rope rigging, one distant seagull, no music" },
  { name: "route66",   dauer: 3, text: "A V8 muscle car approaching at speed on an empty desert road and passing by, no music" },
  { name: "schuss",    dauer: 2, text: "Two gunshots in an open space with a short echo, no music, no voices" },
  { name: "prunk",     dauer: 3, text: "Magical sparkling chime rising, a soft whoosh and glittering bells, celebratory, no voices" },
  { name: "katze",     dauer: 2, text: "A small kitten meowing twice, close up, soft, no music" },
  { name: "enten",     dauer: 3, text: "A duck family quacking by a pond, small splashes of water, outdoors, no music" },
  /* ZWEITE RUNDE — ausdruecklich gewuenscht: „Mach bitte alle
     Geraeusche nach eigenem Ermessen: realistisches Rennauto, und wenn
     man eine Geschenkbox oeffnet, dass so ein Jubel kommt. Bei der
     Fratze ein fieses Lachen. Beim Stromausfall so ein Bratzeln, wie
     wenn die Gluehbirne durchbrennt, und dann der Schalter mit der
     Taschenlampe. Bei Weihnachten etwas Festliches." */
  { name: "rennauto",  dauer: 3, text: "A race car engine revving hard and accelerating past the listener, tyres on asphalt, no music" },
  { name: "kitt",      dauer: 3, text: "A powerful 1980s sports car idling then accelerating away, deep V8 rumble, no music" },
  { name: "jubel",     dauer: 3, text: "A small crowd cheering and applauding warmly, happy voices, short burst, no music" },
  { name: "geschenk",  dauer: 3, text: "Gift wrapping paper tearing open, a party popper, then a short cheerful cheer, no music" },
  { name: "konfetti",  dauer: 2, text: "A party popper bursting and confetti fluttering down, no music" },
  { name: "ballon",    dauer: 2, text: "Several balloons squeaking and rising, one gentle pop, no music" },
  { name: "fratze",    dauer: 3, text: "An evil demonic laugh, deep and distorted, echoing in a large empty hall, horror, no music" },
  { name: "halloween", dauer: 3, text: "Creepy horror ambience: a distant creaking door, whispering wind, a single low tone, no music" },
  { name: "schloss",   dauer: 4, text: "A huge heavy iron gate creaking open slowly, cold wind rushing through a stone hall, no music" },
  { name: "tore",      dauer: 3, text: "Two massive wooden doors slamming shut and a heavy iron bolt sliding into place, no music" },
  { name: "finsternis",dauer: 3, text: "An electrical short circuit crackling, a light bulb popping, silence, then a torch switch clicking on, no music" },
  { name: "erdbeben",  dauer: 4, text: "A deep earthquake rumble with objects rattling and creaking walls, no music" },
  { name: "vulkan",    dauer: 4, text: "A volcano erupting: deep explosive boom, rumbling ground, falling debris, no music" },
  { name: "armageddon",dauer: 4, text: "Apocalyptic impact: a huge distant explosion, rolling shockwave, debris raining down, no music" },
  { name: "weihnachten",dauer: 3, text: "Sleigh bells jingling merrily in the snow, festive and warm, no singing, no music bed" },
  { name: "lagerfeuer",dauer: 4, text: "A campfire crackling and popping quietly at night, occasional cricket, no music" },
  { name: "aquarium",  dauer: 4, text: "Underwater ambience with rising air bubbles, calm and muffled, no music" },
  { name: "handdurch", dauer: 2, text: "Wood splintering and tearing apart violently, a single sharp crack, no music" },
  { name: "jalousie",  dauer: 2, text: "Venetian window blinds rattling and being pulled up quickly, no music" },
  { name: "paintball", dauer: 2, text: "Three paintballs splattering wetly against a hard surface in quick succession, no music" },
  { name: "sternschnuppe", dauer: 2, text: "A soft magical whoosh of a shooting star passing, airy and sparkling, no music" },
  { name: "spinnen",   dauer: 3, text: "Creepy skittering of many small legs on a hard surface, eerie tension, horror, no music" },
  { name: "matrix",    dauer: 3, text: "Digital data stream: rapid electronic clicks and low synthetic hum, cyber, no melody" },
  { name: "sintflut",  dauer: 4, text: "Torrential rain and rushing water flooding, heavy downpour, no music" },
  /* DRITTE RUNDE — „Mach bitte alle Sounds fuer jede Animation und
     ausreichend Sound, passend zur Animation." Gemessen hatte ich
     vorher: 40 Effekte hatten einen Ton, sechs gar keinen, und ein
     halbes Dutzend teilte sich einen fremden. Das sind die
     fehlenden. Jeder ist bewusst 4 Sekunden lang und so
     geschnitten, dass er sich in Schleife legen laesst. */
  { name: "pacman",    dauer: 4, text: "Retro arcade game: a repeating wakka-wakka chomping sound with electronic bleeps, 8-bit, no music" },
  { name: "kassette",  dauer: 4, text: "A cassette tape rewinding in a tape deck, motor whirring and tape hiss, mechanical click at the end, no music" },
  { name: "disko",     dauer: 4, text: "A 1980s disco club room tone: muffled four-on-the-floor beat and a shimmering mirror ball ambience, no vocals" },
  { name: "vhs",       dauer: 4, text: "An old VHS video tape tracking error: electrical static hiss, warbling flutter and a mechanical whir, no music" },
  { name: "noten",     dauer: 4, text: "A soft ascending sequence of glockenspiel notes, gentle and bright, no rhythm, no voices" },
  { name: "wolken",    dauer: 4, text: "Very soft high-altitude wind, distant and airy, continuous, no gusts, no music, no voices" },
  { name: "voegel",    dauer: 4, text: "A flock of migrating birds calling in the sky while flying past, wing beats, outdoors, no music" },
  { name: "schmetterling", dauer: 4, text: "A quiet summer meadow: light breeze in grass, faint insect wings, distant birds, no music" },
  { name: "augen",     dauer: 4, text: "An eerie suspense ambience with a soft heartbeat and a single low creak, someone watching, no music" },
  { name: "keks",      dauer: 4, text: "Crunching and biting a crisp biscuit several times, close up, no music, no voices" },
  { name: "ostern",    dauer: 4, text: "A spring meadow with cheerful birdsong and a soft breeze, light and happy, no music" },
  { name: "bonbon",    dauer: 4, text: "Many small hard candies raining down onto a wooden table, continuous light clattering, no music" },
  { name: "geld",      dauer: 4, text: "Many coins raining down and bouncing on a hard floor, continuous metallic clatter, no music" },
  { name: "seifenblasen", dauer: 4, text: "Soap bubbles being blown and popping softly one after another, wet and light, no music" },
  { name: "herbst",    dauer: 4, text: "Dry autumn leaves rustling and swirling in a gusty wind, outdoors, no music, no voices" },
  { name: "pinguine",  dauer: 4, text: "A penguin colony on ice: several penguins braying and waddling, wind over snow, no music" },
  { name: "aegypten",  dauer: 4, text: "A desert sandstorm: dry wind carrying sand grains against stone, continuous, no music, no voices" },
  { name: "blut",      dauer: 4, text: "Thick liquid dripping and running down a surface, wet and slow, horror ambience, no music" },
  { name: "schnee",    dauer: 4, text: "Very soft snowfall ambience, muffled and quiet, faint wind over snow, no music, no voices" },
  /* VIERTE RUNDE — die letzten ohne Ton. Gemessen: 16 Effekte hatten
     keinen; die Aufkleber (Herz, Lachen, Fluestern) behalten ihren
     gebauten Ton, alles andere bekommt einen echten. */
  { name: "strudel",   dauer: 4, text: "A powerful water whirlpool sucking down, deep gurgling and rushing water, continuous, no music" },
  { name: "schwamm",   dauer: 4, text: "A wet sponge wiping across a blackboard in long strokes, squeaky and damp, no music" },
  { name: "falten",    dauer: 3, text: "A large sheet of stiff paper being folded and creased twice, close up, no music" },
  { name: "boxen",     dauer: 2, text: "Two boxing glove punches hitting a heavy bag, dull impacts, no music, no voices" },
  { name: "umarmen",   dauer: 3, text: "A warm soft whoosh with a gentle low chime, comforting, no voices, no music" },
  { name: "lecken",    dauer: 2, text: "A wet playful lick sound, short and silly, cartoon style, no music" },
  { name: "schlitten", dauer: 4, text: "Sleigh bells jingling rhythmically while a sleigh glides over snow, festive, no music" },

  /* FASSUNG 695 — XANDER: „Die Tiere sollen individuelle Sounds haben nicht
     immer wiederholt … das sagen sie gar nicht, sie sollen das in einer süßen
     Tierstimme machen … jedes Tier seinen eigenen Sound“.
     Je Tier vier Laute (Freude/Ruf, Frage, Schreck/Schmerz, Genuss), dazu
     Hunger (Magenknurren) und Müdigkeit (Gähnen). 20 Credits je Sekunde –
     deshalb kurz. Die Seite verstimmt jeden Laut beim Abspielen ein wenig,
     damit er nie zweimal gleich klingt. */
  /* FASSUNG 696 — XANDER: „bei den Ankunftsanimationen kannst du noch vier
     unterschiedliche Sachen machen … den Truck an den Colt Seavers … Kit …
     Pontiac Firebird … Lichtleiste … Dodge Viper … Liane … Transformers". */
  { name: "auftritt-colt", dauer: 3.5, text: "A lifted 1980s pickup truck with a big V8 engine roaring, jumping off a ramp, flying briefly and landing hard with a heavy suspension thud and rattling, no music, no voices" },
  { name: "auftritt-kitt", dauer: 3, text: "A futuristic black sports car gliding in: a pulsing electronic scanner whoosh sweeping left and right repeatedly over a smooth turbine engine hum, no music, no voices" },
  { name: "auftritt-viper", dauer: 3, text: "A V10 sports car engine roaring, revving hard and accelerating past, deep aggressive exhaust burble, no music, no voices" },
  { name: "auftritt-liane", dauer: 3, text: "Swinging on a jungle vine: a long whoosh through the air, rustling leaves, creaking vine, a few exotic bird calls, playful, no voices, no music" },
  { name: "auftritt-trafo", dauer: 3, text: "A giant robot transforming from a car: rapid mechanical clicks, whirring servos, metal plates sliding and locking into place, ending with a heavy clunk, no music, no voices" },
  { name: "tier-fellmonster-ruf", dauer: 1.2, text: "a cute small furry gremlin-like monster: happy bubbly gurgling giggle. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fellmonster-frage", dauer: 1.2, text: "a cute small furry gremlin-like monster: curious rising questioning grunt 'hrrm?'. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fellmonster-au", dauer: 1.2, text: "a cute small furry gremlin-like monster: short startled whimper yelp. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fellmonster-genuss", dauer: 1.2, text: "a cute small furry gremlin-like monster: contented low rumbling purr. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-chihuahua-ruf", dauer: 1.2, text: "a tiny chihuahua dog: two high excited happy yips. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-chihuahua-frage", dauer: 1.2, text: "a tiny chihuahua dog: confused whine rising at the end. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-chihuahua-au", dauer: 1.2, text: "a tiny chihuahua dog: sharp short yelp. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-chihuahua-genuss", dauer: 1.2, text: "a tiny chihuahua dog: contented little sigh with a soft whine. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-stachelmonster-ruf", dauer: 1.2, text: "a small hedgehog: happy squeaky chattering. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-stachelmonster-frage", dauer: 1.2, text: "a small hedgehog: curious sniffing snuffle and a small squeak. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-stachelmonster-au", dauer: 1.2, text: "a small hedgehog: startled huffing hiss. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-stachelmonster-genuss", dauer: 1.2, text: "a small hedgehog: contented snuffling grunts. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-drache-ruf", dauer: 1.2, text: "a cute baby dragon: happy chirpy little roar. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-drache-frage", dauer: 1.2, text: "a cute baby dragon: curious trilling chirp rising. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-drache-au", dauer: 1.2, text: "a cute baby dragon: hurt high squeal. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-drache-genuss", dauer: 1.2, text: "a cute baby dragon: contented purr with a tiny puff of smoke. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-eule-ruf", dauer: 1.2, text: "an owl: soft hooting hoo hoo. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-eule-frage", dauer: 1.2, text: "an owl: single curious rising hoot. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-eule-au", dauer: 1.2, text: "an owl: short startled screech. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-eule-genuss", dauer: 1.2, text: "an owl: soft contented cooing trill. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-schaeferhund-ruf", dauer: 1.2, text: "a German shepherd dog: single happy deep bark. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-schaeferhund-frage", dauer: 1.2, text: "a German shepherd dog: curious whine with a head tilt. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-schaeferhund-au", dauer: 1.2, text: "a German shepherd dog: short loud yelp. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-schaeferhund-genuss", dauer: 1.2, text: "a German shepherd dog: contented deep groan and sigh. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-babyfuchs-ruf", dauer: 1.2, text: "a tiny fox kit: playful high squeak. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-babyfuchs-frage", dauer: 1.2, text: "a tiny fox kit: curious little chirp. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-babyfuchs-au", dauer: 1.2, text: "a tiny fox kit: small whimper. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-babyfuchs-genuss", dauer: 1.2, text: "a tiny fox kit: sleepy contented squeak. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fuchs-ruf", dauer: 1.2, text: "a red fox: happy gekkering chatter. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fuchs-frage", dauer: 1.2, text: "a red fox: curious short 'wow' bark. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fuchs-au", dauer: 1.2, text: "a red fox: short yelping scream. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fuchs-genuss", dauer: 1.2, text: "a red fox: soft contented whine. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-einhorn-ruf", dauer: 1.2, text: "a magical unicorn: gentle whinny with a sparkling chime. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-einhorn-frage", dauer: 1.2, text: "a magical unicorn: curious soft nicker. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-einhorn-au", dauer: 1.2, text: "a magical unicorn: short high squeal. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-einhorn-genuss", dauer: 1.2, text: "a magical unicorn: contented snort and soft blow with a faint chime. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-phoenix-ruf", dauer: 1.2, text: "a phoenix fire bird: melodic bright trill with a soft fire whoosh. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-phoenix-frage", dauer: 1.2, text: "a phoenix fire bird: curious two-note chirp. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-phoenix-au", dauer: 1.2, text: "a phoenix fire bird: short sharp screech. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-phoenix-genuss", dauer: 1.2, text: "a phoenix fire bird: soft warm warbling. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fee-ruf", dauer: 1.2, text: "a tiny fairy creature: tiny tinkling giggle with little bells. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fee-frage", dauer: 1.2, text: "a tiny fairy creature: curious 'hmm?' with a glass chime. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fee-au", dauer: 1.2, text: "a tiny fairy creature: tiny surprised squeak. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-fee-genuss", dauer: 1.2, text: "a tiny fairy creature: soft humming with twinkles. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-feuerfuchs-ruf", dauer: 1.2, text: "a fire fox: fox chatter with crackling embers. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-feuerfuchs-frage", dauer: 1.2, text: "a fire fox: curious fox yip with a crackle. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-feuerfuchs-au", dauer: 1.2, text: "a fire fox: hurt fox yelp with a fizzle. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-feuerfuchs-genuss", dauer: 1.2, text: "a fire fox: soft fox whine with warm crackling. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-greif-ruf", dauer: 1.2, text: "a griffin, eagle head and lion body: eagle screech blending into a lion growl. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-greif-frage", dauer: 1.2, text: "a griffin, eagle head and lion body: curious eagle chirp. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-greif-au", dauer: 1.2, text: "a griffin, eagle head and lion body: piercing eagle scream. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-greif-genuss", dauer: 1.2, text: "a griffin, eagle head and lion body: deep big cat purr. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-regenbogendrache-ruf", dauer: 1.2, text: "a rainbow baby dragon: sparkling magical little roar with shimmering chimes. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-regenbogendrache-frage", dauer: 1.2, text: "a rainbow baby dragon: curious chirp with a rising glitter chime. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-regenbogendrache-au", dauer: 1.2, text: "a rainbow baby dragon: hurt squeal with a sad chime. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-regenbogendrache-genuss", dauer: 1.2, text: "a rainbow baby dragon: contented purr with soft harp glissando. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-dackel-ruf", dauer: 1.2, text: "a dachshund dog: two playful medium barks. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-dackel-frage", dauer: 1.2, text: "a dachshund dog: curious whining 'hmm'. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-dackel-au", dauer: 1.2, text: "a dachshund dog: small dog yelp. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-dackel-genuss", dauer: 1.2, text: "a dachshund dog: contented snort and sigh. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-storch-ruf", dauer: 1.2, text: "a white stork: loud bill clattering. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-storch-frage", dauer: 1.2, text: "a white stork: short hiss followed by a light clatter. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-storch-au", dauer: 1.2, text: "a white stork: hoarse squawk. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-storch-genuss", dauer: 1.2, text: "a white stork: soft slow bill clattering. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-wolpertinger-ruf", dauer: 1.2, text: "a cute mythical Bavarian creature, a rabbit with tiny antlers and small wings: playful squeaky yodel-like chirp 'hoo-lee'. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-wolpertinger-frage", dauer: 1.2, text: "a cute mythical Bavarian creature, a rabbit with tiny antlers and small wings: curious squeak with a quick wing flutter. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-wolpertinger-au", dauer: 1.2, text: "a cute mythical Bavarian creature, a rabbit with tiny antlers and small wings: short rabbit squeal. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-wolpertinger-genuss", dauer: 1.2, text: "a cute mythical Bavarian creature, a rabbit with tiny antlers and small wings: soft rabbit tooth purring. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-lindwurm-ruf", dauer: 1.2, text: "a giant serpent dragon: long hiss rising into a deep rumble. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-lindwurm-frage", dauer: 1.2, text: "a giant serpent dragon: curious rising snake hiss. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-lindwurm-au", dauer: 1.2, text: "a giant serpent dragon: shrieking hiss. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-lindwurm-genuss", dauer: 1.2, text: "a giant serpent dragon: deep contented rumbling purr. Short, cute, close microphone, no music, no background, no human voice" },
  { name: "tier-hunger-klein", dauer: 1.4, text: "A small animal belly growling loudly with hunger, gurgling stomach rumble, cartoon, close microphone, no music" },
  { name: "tier-hunger-gross", dauer: 1.6, text: "A big hungry stomach rumbling deeply and long, gurgling, close microphone, no music" },
  { name: "tier-muede-klein", dauer: 1.6, text: "A tiny cute animal doing a long sleepy yawn that ends in a squeak, close microphone, no music" },
  { name: "tier-muede-hund", dauer: 1.6, text: "A dog doing a long wide yawn with a soft squeaky whine at the end, close microphone, no music" },
  { name: "tier-muede-vogel", dauer: 1.4, text: "A sleepy bird fluffing its feathers with a soft drowsy chirp, close microphone, no music" },
  { name: "tier-muede-drache", dauer: 1.6, text: "A baby dragon yawning sleepily with a small puff of smoke, cute, close microphone, no music" },
  { name: "tier-schlecken", dauer: 1.4, text: "A small animal eagerly licking whipped cream with its tongue, wet lapping licks, cute, close microphone, no music" },
  { name: "tier-hops", dauer: 0.8, text: "A tiny cartoon bounce, soft springy boing of a small rabbit hopping, no music" },
];

function schlafen(ms) { return new Promise((f) => setTimeout(f, ms)); }

async function holen(g) {
  const fertig = path.join(ZIEL, g.name + ".opus");
  const fertigAac = path.join(ZIEL, g.name + ".m4a");
  if (fs.existsSync(fertig) && fs.existsSync(fertigAac)) { console.log("  schon da:  " + g.name); return "da"; }
  const antwort = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: { "xi-api-key": SCHLUESSEL, "Content-Type": "application/json" },
    body: JSON.stringify({ text: g.text, duration_seconds: g.dauer, prompt_influence: 0.45 })
  });
  if (!antwort.ok) {
    console.log("  FEHLER " + antwort.status + ": " + g.name + "  " + (await antwort.text()).slice(0, 160));
    return "fehler";
  }
  const roh = Buffer.from(await antwort.arrayBuffer());
  const zwischen = path.join("/tmp", "geraeusch-" + g.name + ".mp3");
  fs.writeFileSync(zwischen, roh);
  /* Klein rechnen: mono, 24 kHz, Opus mit 24 kbit/s. Dazu die Lautheit
     angleichen, damit nicht ein Geraeusch brüllt und das naechste
     fluestert. */
  execFileSync(FFMPEG, ["-y", "-i", zwischen,
    "-af", (g.name.startsWith("tier-") ? "silenceremove=start_periods=1:start_threshold=-45dB," : "") + "loudnorm=I=-18:TP=-2:LRA=11",
    "-c:a", "libopus", "-b:a", "24k", "-ac", "1", "-ar", "24000",
    fertig], { stdio: "pipe" });
  /* ZWEITE FASSUNG IN AAC — und die ist kein Luxus: Safari auf dem
     iPhone spielt Opus je nach Fassung NICHT. Wer nur Opus ablegt,
     baut eine Datei, die ausgerechnet auf seinem Geraet stumm
     bleibt. Die Seite fragt den Browser und nimmt, was er kann. */
  execFileSync(FFMPEG, ["-y", "-i", zwischen,
    "-af", (g.name.startsWith("tier-") ? "silenceremove=start_periods=1:start_threshold=-45dB," : "") + "loudnorm=I=-18:TP=-2:LRA=11",
    "-c:a", "aac", "-b:a", "40k", "-ac", "1", "-ar", "24000",
    fertigAac], { stdio: "pipe" });
  fs.unlinkSync(zwischen);
  const kb = (fs.statSync(fertig).size / 1024).toFixed(1);
  const kbA = (fs.statSync(fertigAac).size / 1024).toFixed(1);
  console.log("  neu:       " + g.name + "  Opus " + kb + " kB / AAC " + kbA + " kB");
  return "neu";
}

(async () => {
  fs.mkdirSync(ZIEL, { recursive: true });
  const nur = process.argv[2];
  let neu = 0, fehler = 0;
  for (const g of GERAEUSCHE) {
    /* Fassung 695: „tier-" holt alle, deren Name so anfängt. */
    if (nur && g.name !== nur && !(nur.endsWith("-") && g.name.startsWith(nur))) continue;
    const r = await holen(g);
    if (r === "neu") { neu++; await schlafen(900); }
    if (r === "fehler") fehler++;
  }
  console.log("\n" + neu + " neu erzeugt, " + fehler + " Fehler.");
  /* Die Liste fuer die Seite schreiben — wie bei den Aufnahmen. */
  const da = GERAEUSCHE.filter((g) => fs.existsSync(path.join(ZIEL, g.name + ".opus")))
    .map((g) => g.name);
  fs.writeFileSync(path.join(WURZEL, "data-geraeusche.js"),
    "/* =========================================================\n"
    + "   WELCHE ECHTEN GERAEUSCHE ES GIBT\n"
    + "   ---------------------------------------------------------\n"
    + "   Geschrieben von werkzeug/geraeusche-holen.js — nicht von\n"
    + "   Hand aendern. Steht ein Name hier, sucht die Seite\n"
    + "   ton/<name>.opus; steht er nicht da, klingt wie bisher der\n"
    + "   synthetische Ton aus dem Browser.\n"
    + "   ========================================================= */\n"
    + "window.DMA_GERAEUSCHE = \"" + da.join("|") + "\";\n");
  console.log(da.length + " Geraeusche stehen in data-geraeusche.js");
})();
