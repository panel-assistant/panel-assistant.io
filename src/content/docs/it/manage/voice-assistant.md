---
title: Assistente vocale
description: Trasformare il microfono di un pannello in un satellite Home Assistant Assist, parole di attivazione, pipeline, annunci e risoluzione dei problemi.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un pannello con microfono può fungere da [satellite Assist](https://www.home-assistant.io/voice_control/) di Home Assistant. Ascolta una parola di attivazione, trasmette il tuo comando a Home Assistant e riproduce la risposta tramite l'altoparlante del pannello. Non c'è un dispositivo separato da aggiungere: il satellite è un'entità `assist_satellite.<panel>` sul dispositivo Home Assistant già esistente del pannello, e l'audio viaggia sulla stessa connessione già usata dal pannello.

:::note
La scheda Voce viene proposta quando il profilo del dispositivo dichiara un microfono, oppure quando Android segnala un microfono integrato su un pannello il cui profilo non lo specifica. Un microfono non verificato deve superare il controllo di acquisizione del pannello prima che inizi l'ascolto. Un profilo che dichiara esplicitamente l'assenza del microfono non propone Voce.
:::

## Attivazione

La voce è attiva per impostazione predefinita su una nuova installazione quando il profilo del dispositivo del pannello dichiara un microfono. Le impostazioni salvate esistenti vengono conservate. Sugli altri pannelli dove viene proposta la scheda Voce, attiva **Assistente vocale** per usarla. Disattivala se non vuoi che il pannello ascolti una parola di attivazione.

1. Usa **Visita** nella pagina del dispositivo del pannello in Home Assistant, poi apri **Configura** (ad esempio, `http://<panel>:8888/` con la porta predefinita).
2. Nella scheda **Voce**, attiva **Assistente vocale**.
3. Seleziona ogni parola di attivazione che vuoi far ascoltare al pannello sotto **Parole di attivazione**.
4. Sotto **Pipeline per parole di attivazione**, scegli quale pipeline Assist deve usare ogni parola selezionata.

Con l'assistente vocale disattivato, le sue assegnazioni del microfono vengono rilasciate e l'entità satellite risulta non disponibile in Home Assistant. Un'altra funzione attiva, come l'audio ambientale della fotocamera, può ancora usare il microfono.

## Parole di attivazione e pipeline

Il pannello include quattro parole di attivazione: **Okay Nabu**, **Hey Jarvis**, **Hey Mycroft** e **Alexa**. Puoi averne diverse attive contemporaneamente, e ciascuna può puntare a una pipeline Assist diversa: una parola di attivazione può quindi rispondere in una lingua diversa, o passare a un agente di conversazione diverso, rispetto a un'altra. Lasciare una parola di attivazione sul valore predefinito usa la pipeline che Home Assistant considera attualmente preferita. Se una pipeline assegnata viene successivamente eliminata, anche quella parola di attivazione ripiega sulla pipeline preferita.

Puoi cambiare le parole di attivazione attive anche da Home Assistant stesso: le impostazioni del satellite, sotto **Impostazioni > Assistenti vocali** o nella pagina del dispositivo del pannello, mostrano lo stesso elenco e riportano le modifiche al pannello. La pipeline usata da ogni parola di attivazione viene impostata nella pagina Configura del pannello.

Il rilevamento della parola di attivazione avviene sul pannello, non nel cloud o sul server Home Assistant. Il pannello inizia a inviare audio a Home Assistant solo quando sente una parola di attivazione, e solo finché il riconoscimento vocale sta ancora ricevendo il tuo comando; smette di inviare non appena Home Assistant segnala che il comando è terminato.

Vuoi una parola di attivazione che non è in questo elenco? Vedi [Parole di attivazione personalizzate](/it/manage/custom-wake-words/).

## Cosa mostra il pannello

Un breve suono e un'onda indicano il momento in cui il pannello sente una parola di attivazione. Mentre ascolta, elabora o risponde, i bordi dello schermo assumono una tenue tonalità che pulsa lentamente. Il colore identifica la pipeline che risponde: Panel Assistant assegna un colore a ogni pipeline la prima volta che un qualsiasi pannello la usa e conserva quell'abbinamento, così la stessa pipeline appare uguale su ogni pannello della casa. Non c'è nulla da configurare qui.

Se l'agente di conversazione della pipeline pone una domanda successiva, il pannello ricomincia ad ascoltare da solo, senza dover ripetere la parola di attivazione.

## Annunci e avvio di una conversazione

Una volta attivo l'assistente vocale, `assist_satellite.announce` pronuncia un messaggio sul pannello da qualsiasi automazione o script, facoltativamente preceduto da un breve suono. `assist_satellite.start_conversation` pronuncia una richiesta e poi ascolta la risposta; Home Assistant lo consente solo con un agente di conversazione che supporti l'avvio autonomo di una conversazione, cosa che l'agente integrato Home Assistant non supporta. Entrambi i servizi richiedono l'assistente vocale attivo; vedi [Sintesi vocale](/it/manage/text-to-speech/#riproduci-un-annuncio-con-lassistente-vocale-attivo) per l'alternativa REST più semplice sui pannelli senza microfono.

## Più assistenti nella stessa stanza

Se due satelliti sulla stessa istanza Home Assistant sentono la stessa frase di attivazione entro due secondi l'uno dall'altro, Home Assistant sopprime il duplicato affinché risponda uno solo. Questo si applica a ogni satellite su quell'istanza Home Assistant, non solo ai pannelli nella stessa area Home Assistant: copre quindi anche un pannello e un qualsiasi altro satellite che possiedi già. Se vuoi scegliere quale dispositivo risponde in una stanza condivisa, assegna loro parole di attivazione diverse.

## Impostazioni

La scheda Voce offre alcune opzioni di regolazione oltre all'elenco delle parole di attivazione:

- **Sensibilità di attivazione:** Bassa, Normale o Alta. Alta abbassa la soglia del modello della parola di attivazione: il pannello si attiva quindi più facilmente, ma è anche più probabile un'attivazione errata; Bassa richiede una corrispondenza più chiara prima dell'attivazione.
- **Guadagno del microfono (dB):** amplifica solo l'audio inviato a Home Assistant per la trascrizione, mai l'audio analizzato dal rilevatore della parola di attivazione stesso. Aumentalo se la parola di attivazione viene rilevata in modo affidabile ma i comandi pronunciati dall'altro lato della stanza vengono persi o capiti male.
- **Sorgente audio:** la sorgente audio Android usata per acquisire il microfono. Lasciala al valore predefinito (`voice_recognition`) salvo indicazioni diverse.

## Risoluzione dei problemi

**Il pannello non si attiva mai.** Verifica che **Assistente vocale** sia attivo e che la parola di attivazione che pronunci sia selezionata sotto **Parole di attivazione**. Prova **Sensibilità di attivazione: Alta** e parla dal punto in cui useresti normalmente il pannello, non vicino al microfono.

**Si attiva ma non capisce il comando.** Aumenta leggermente **Guadagno del microfono (dB)** e riprova; influisce solo sull'audio inviato per la trascrizione, quindi da solo non renderà più facile l'attivazione del pannello. Se stai addestrando la tua parola di attivazione, il registro del pannello registra anche i quasi rilevamenti con il punteggio raggiunto: è il modo più diretto per capire se una parola di attivazione mancata era vicina alla soglia oppure lontana. Vedi [Parole di attivazione personalizzate](/it/manage/custom-wake-words/#test-e-regolazione).

**L'entità satellite risulta non disponibile.** L'assistente vocale è disattivato, oppure il pannello non è connesso a Home Assistant tramite Panel Assistant. Attiva l'assistente vocale dalla pagina Configura del pannello; non può essere attivato da Home Assistant.
