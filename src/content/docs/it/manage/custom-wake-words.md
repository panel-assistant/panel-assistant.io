---
title: Parole di attivazione personalizzate
description: Addestrare la tua parola di attivazione con microWakeWord, importarla su un pannello, distribuirla a più pannelli e regolarla.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Le quattro parole di attivazione incluse sono modelli [microWakeWord](https://github.com/kahrendt/microWakeWord), e l'[assistente vocale](/it/manage/voice-assistant/) di un pannello può importare qualsiasi modello addestrato nello stesso modo. Questa pagina tratta l'addestramento di un modello, il formato del suo manifesto, l'importazione sul pannello e i test dopo l'installazione.

## Addestrare un modello

microWakeWord è un progetto open source separato di Kevin Ahrendt con licenza Apache-2.0; il suo [notebook di addestramento](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb) descrive l'intero processo ed è il riferimento autorevole. In sintesi:

1. **Scegli una frase e genera campioni sintetici.** Imposti la frase desiderata e il notebook usa [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator) per sintetizzare migliaia di esempi pronunciati con voci diverse.
2. **Arricchisci i campioni.** Il notebook applica effetti all'audio sintetico (equalizzazione, distorsione, variazione dell'altezza, convoluzione con risposte all'impulso ambientali e aggiunta di rumore di fondo e musica da dataset audio pubblici), così il modello non impara a riconoscere soltanto una registrazione pulita.
3. **Addestra.** Il modello viene addestrato per un numero configurabile di passaggi, poi viene convertito da un modello non streaming alla forma streaming effettivamente eseguita dal pannello. Il notebook stesso indica che l'addestramento in Google Colab è fattibile ma sensibilmente più lento rispetto a una GPU locale.
4. **Esporta.** Il modello addestrato viene esportato come file TensorFlow Lite quantizzato e streaming. Questo è il file `.tflite` da importare.

Non ti serve nulla di tutto questo se un modello pronto copre già la tua frase: il repository [`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) (anch'esso Apache-2.0) pubblica modelli addestrati per nome file sotto `models/v2/`, e uno di questi si importa esattamente come un modello addestrato da te.

## Scrivere il manifesto

Ogni parola di attivazione necessita di un piccolo manifesto JSON insieme al proprio file `.tflite`, nel formato versione 2 di microWakeWord. È lo stesso formato usato dal componente `micro_wake_word` di ESPHome e dal repository `esphome/micro-wake-word-models`, quindi un manifesto da una qualsiasi delle due fonti funziona senza modifiche. Campi obbligatori:

- `"type"`: sempre `"micro"`.
- `"model"`: il nome del file `.tflite` (senza barre).
- `"micro"`: un oggetto con `probability_cutoff` (da 0 a 1), `feature_step_size` (un intero positivo; i modelli attuali usano `10`) e `sliding_window_size` (un intero positivo).

Campi facoltativi: `wake_word` (la frase mostrata nell'interfaccia; se omessa, viene usato l'ID della parola di attivazione), `author`, `website`, `trained_languages`, `version` e `micro.tensor_arena_size`.

Questo è il manifesto Hey Jarvis incluso, come esempio della struttura:

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

### Scegliere `probability_cutoff` e `sliding_window_size`

Entrambi bilanciano false attivazioni e attivazioni mancate, e nessuno dei due ha un unico valore corretto per ogni modello:

- **`probability_cutoff`** è la soglia di confidenza che il modello deve superare per segnalare un rilevamento. Aumentandola, il pannello si attiva meno spesso per suoni solo simili alla tua frase, ma diventa anche più probabile perdere una pronuncia reale più bassa o più informale. Abbassala per il compromesso opposto. I modelli inclusi si attestano intorno a `0.97`; il consiglio del notebook di addestramento è regolare la soglia dopo aver osservato le prestazioni effettive del modello addestrato, invece di presumere che un numero sia adatto.
- **`sliding_window_size`** controlla quante finestre di rilevamento consecutive vengono mediate prima che il pannello confermi un'attivazione. Una finestra più piccola reagisce più velocemente ma risente maggiormente di un singolo picco di rumore; una più grande lo attenua, al costo di un'attivazione leggermente più lenta.

Parti dai valori suggeriti dalla documentazione del modello o dall'esecuzione del notebook, importalo e poi regolalo usando il registro dei quasi rilevamenti del pannello descritto in [Test e regolazione](#test-e-regolazione).

## Importare il modello

### Dalla pagina Configura del pannello

Nella scheda **Voce**, il selettore delle parole di attivazione ha un controllo di **importazione**. Scegli il manifesto `.json` del modello e il suo file `.tflite`, poi premi **Importa parola di attivazione addestrata**. Il pannello convalida il modello con il proprio motore delle parole di attivazione prima di accettarlo; se rifiuta un modello non viene installato nulla, e se era già stato importato un modello con lo stesso nome, quello precedente rimane invariato. I manifesti sono limitati a 16 KB e i modelli a 2 MB.

L'ID della parola di attivazione deriva dal nome del file `.tflite`, convertito in minuscolo e ridotto a lettere, cifre e trattini bassi (deve iniziare con una lettera). Non può riutilizzare l'ID di una parola di attivazione inclusa, e importare un modello con un nome già usato sostituisce il modello precedente.

L'importazione rende disponibile la parola di attivazione; non la attiva. Per usarla su un pannello, selezionala sotto **Parole di attivazione** e scegli la sua pipeline sotto **Pipeline per parole di attivazione**. Da quel momento appare anche nel selettore delle parole di attivazione di Home Assistant per quel pannello.

### Su più pannelli

Il punto in cui apri Configura determina se l'importazione viene condivisa:

- **Direttamente nella pagina Configura del pannello:** il modello importato rimane su quel pannello. Non viene condiviso con altri pannelli.
- **All'interno della barra laterale Panel Assistant in Home Assistant:** una volta che il pannello selezionato ha convalidato e installato il modello, Panel Assistant ne conserva una copia condivisa e la installa su ogni altro pannello con microfono, inclusi quelli che si connettono in seguito.

Importare un modello più recente con lo stesso ID tramite la barra laterale sostituisce la copia condivisa e può aggiornare i pannelli che contengono una copia condivisa in precedenza. Un modello diverso importato indipendentemente con quell'ID su un altro pannello viene conservato; Panel Assistant crea una [Riparazione della parola di attivazione](/it/home-assistant/repairs/#parola-di-attivazione-conservata) invece di sovrascriverlo. Anche un pannello che rifiuta un modello condiviso riceve una [Riparazione con il motivo](/it/home-assistant/repairs/#parola-di-attivazione-rifiutata).

La condivisione rende il modello selezionabile su ogni pannello; scegli separatamente la parola di attivazione e la pipeline su ciascuno per attivarlo.

## Test e regolazione

Usa **Visita** nella pagina del dispositivo del pannello in Home Assistant e apri **Registri** (ad esempio, `http://<panel>:8888/logs` con la porta predefinita), poi pronuncia la parola di attivazione e osserva il registro. Una parola di attivazione sentita ma non sufficiente ad attivare il rilevamento appare come quasi rilevamento, in una riga come `wake word my_wake_word heard at 0.86, short of its cutoff`, con il punteggio massimo raggiunto da quel tentativo. Se quei punteggi sono appena sotto il tuo `probability_cutoff`, di solito basta abbassare leggermente la soglia o aumentare **Sensibilità di attivazione** nella scheda Voce; se la frase non appare mai nemmeno come quasi rilevamento, il modello stesso non la riconosce e il passo successivo più utile è riaddestrarlo con più campioni o campioni più vari.
