---
title: Eigen activeringswoorden
description: Een eigen activeringswoord trainen met microWakeWord, op een paneel importeren, over meerdere panelen verspreiden en afstellen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

De vier meegeleverde activeringswoorden zijn [microWakeWord](https://github.com/kahrendt/microWakeWord)-modellen, en de [spraakassistent](/nl/manage/voice-assistant/) van een paneel kan elk op dezelfde manier getraind model importeren. Deze pagina behandelt het trainen, het manifestformaat, importeren op het paneel en testen na de installatie.

## Een model trainen

microWakeWord is een afzonderlijk opensourceproject van Kevin Ahrendt met een Apache-2.0-licentie. Het [trainingsnotebook](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb) doorloopt het hele proces en is de gezaghebbende referentie. In grote lijnen:

1. **Kies een zin en genereer synthetische voorbeelden.** Je stelt de doelzin in en het notebook gebruikt [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator) om duizenden uitgesproken voorbeelden met verschillende stemmen te synthetiseren.
2. **Breid de voorbeelden uit.** Het notebook voegt effecten aan de synthetische audio toe (equalisatie, vervorming, toonhoogteverschuiving, convolutie met ruimte-impulsresponsen en achtergrondgeluid en muziek uit openbare audiodatasets), zodat het model niet alleen één schone opname leert herkennen.
3. **Train.** Het model traint een instelbaar aantal stappen en wordt daarna van een niet-streamend model omgezet naar de streamende vorm die het paneel werkelijk uitvoert. Volgens het notebook is trainen in Google Colab bruikbaar, maar merkbaar trager dan met een lokale GPU.
4. **Exporteer.** Het getrainde model wordt geëxporteerd als een gekwantiseerd, streamend TensorFlow Lite-bestand. Dit is het `.tflite`-bestand dat je importeert.

Dit is niet nodig als er al een kant-en-klaar model voor je zin bestaat: de repository [`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) (ook Apache-2.0) publiceert getrainde modellen op bestandsnaam onder `models/v2/`. Die importeer je precies zoals een zelf getraind model.

## Het manifest schrijven

Elk activeringswoord heeft naast zijn `.tflite`-bestand een klein JSON-manifest nodig in het versie 2-formaat van microWakeWord. Dit is hetzelfde formaat als dat van de ESPHome-component `micro_wake_word` en de repository `esphome/micro-wake-word-models`, dus een manifest uit beide bronnen werkt ongewijzigd. Verplichte velden:

- `"type"`: altijd `"micro"`.
- `"model"`: de naam van het `.tflite`-bestand (zonder schuine strepen).
- `"micro"`: een object met `probability_cutoff` (0 tot 1), `feature_step_size` (een positief geheel getal; huidige modellen gebruiken `10`) en `sliding_window_size` (een positief geheel getal).

Optionele velden: `wake_word` (de zin die in de interface wordt getoond; standaard de id van het activeringswoord als het ontbreekt), `author`, `website`, `trained_languages`, `version` en `micro.tensor_arena_size`.

Dit is het meegeleverde Hey Jarvis-manifest als voorbeeld van de structuur:

```json
{
  "type": "micro",
  "wake_word": "Hey Jarvis",
  "author": "Kevin Ahrendt",
  "website": "https://www.kevinahrendt.com/",
  "model": "hey_jarvis.tflite",
  "trained_languages": ["en"],
  "version": 2,
  "micro": {
    "probability_cutoff": 0.97,
    "feature_step_size": 10,
    "sliding_window_size": 5,
    "tensor_arena_size": 22860,
    "minimum_esphome_version": "2024.7.0"
  }
}
```

### `probability_cutoff` en `sliding_window_size` kiezen

Beide wegen onterechte tegen gemiste activeringen af. Geen van beide heeft één juiste waarde voor elk model:

- **`probability_cutoff`** is de betrouwbaarheidsdrempel die het model moet overschrijden om een detectie te melden. Verhoog je die, dan reageert het paneel minder vaak op iets wat alleen op de zin lijkt, maar mist het ook eerder een echte, zachtere of losser uitgesproken versie. Verlagen geeft de omgekeerde afweging. De meegeleverde modellen zitten rond `0.97`; het trainingsnotebook adviseert de drempel aan te passen op basis van de werkelijke prestaties van je model, in plaats van te veronderstellen dat één getal past.
- **`sliding_window_size`** bepaalt hoeveel opeenvolgende detectievensters worden gemiddeld voordat het paneel beslist te reageren. Een kleiner venster reageert sneller maar is gevoeliger voor één ruispiek; een groter venster vlakt die af ten koste van een iets tragere reactie.

Begin met de waarden die de documentatie van je model of je notebookrun voorstelt, importeer het en stel het daarna af met het eigen logboek van bijna-treffers, zoals beschreven bij [Testen en afstellen](#testen-en-afstellen).

## Het model importeren

### Via de pagina Configureren van het paneel

Op de kaart **Spraak** heeft de kiezer voor activeringswoorden een knop **Importeren**. Kies het `.json`-manifest en het `.tflite`-bestand en druk op **Importeren**. Het paneel valideert het model met de eigen activeringswoordengine voordat het dit accepteert. Weigert het een model, dan wordt niets geïnstalleerd. Was al een model met dezelfde naam geïmporteerd, dan blijft dat eerdere model staan. Manifesten zijn beperkt tot 16 KB en modellen tot 2 MB.

De id van het activeringswoord wordt afgeleid van de `.tflite`-bestandsnaam, omgezet naar kleine letters en teruggebracht tot letters, cijfers en underscores (hij moet met een letter beginnen). De id mag niet die van een meegeleverd activeringswoord zijn. Een model importeren onder een al gebruikte naam vervangt het eerdere model.

Importeren maakt het activeringswoord beschikbaar; het activeert het niet. Vink het op een paneel onder **Activeringswoorden** aan en kies zijn pipeline onder **Pipelines voor activeringswoorden**. Vanaf dan verschijnt het ook in de eigen activeringswoordkiezer van Home Assistant voor dat paneel.

### Op meerdere panelen

Waar je Configureren opent, bepaalt of de import wordt gedeeld:

- **Rechtstreeks op de eigen pagina Configureren van het paneel:** het geïmporteerde model blijft op dat paneel en wordt niet met andere panelen gedeeld.
- **Binnen de Panel Assistant-zijbalk in Home Assistant:** zodra het gekozen paneel het model heeft gevalideerd en geïnstalleerd, bewaart Panel Assistant een gedeelde kopie en installeert het die op elk ander paneel met een microfoon, ook panelen die later verbinden.

Een nieuwer model met dezelfde id via de zijbalk importeren vervangt de gedeelde kopie en kan panelen met een eerder gedeelde kopie bijwerken. Een ander, zelfstandig onder die id geïmporteerd model op een ander paneel blijft behouden; Panel Assistant maakt een [activeringswoordreparatie](/nl/home-assistant/repairs/#wake-word-kept) aan in plaats van het te overschrijven. Een paneel dat een gedeeld model weigert, krijgt ook een [reparatie met de reden](/nl/home-assistant/repairs/#wake-word-refused).

Delen maakt het model op elk paneel selecteerbaar. Kies het activeringswoord en de pipeline afzonderlijk op elk paneel om het te activeren.

## Testen en afstellen

Kies **Bezoeken** op de apparaatpagina van het paneel in Home Assistant en open **Logs** (bijvoorbeeld `http://<panel>:8888/logs` met de standaardpoort). Spreek het activeringswoord uit en bekijk het logboek. Een gehoord woord dat net niet activeerde, verschijnt als een bijna-treffer, bijvoorbeeld `wake word my_wake_word heard at 0.86, short of its cutoff`, met de hoogste score van die poging. Liggen die scores net onder je `probability_cutoff`, dan is de drempel iets verlagen of **Activeringsgevoeligheid** op de kaart Spraak verhogen meestal voldoende. Verschijnt de zin helemaal niet als bijna-treffer, dan herkent het model hem zelf niet en is opnieuw trainen met meer of meer gevarieerde voorbeelden nuttiger.
