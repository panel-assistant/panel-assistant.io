---
title: Script di installazione (ritirato)
description: Il programma di installazione da riga di comando non installa né aggiorna più i pannelli. Cosa usare al suo posto e come rimuovere ha-paneld da un pannello.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Il programma di installazione da riga di comando è stato rimosso. Aggiungi e aggiorna i pannelli tramite Panel Assistant in Home Assistant.

Aggiungi e aggiorna i pannelli da [Home Assistant](/it/install/installing-ha-paneld/) con Panel Assistant. Un pannello installato con lo script continua a funzionare. Aggiungilo a Panel Assistant: viene connesso invece di essere reinstallato, e Panel Assistant ne propone poi gli aggiornamenti.

## Rendere ADB disponibile in rete

Su alcuni pannelli Tuya TPA10 e Smatek, ADB inizialmente funziona solo tramite USB. Collega il cavo USB e attiva ADB di rete prima di aggiungere il pannello in Home Assistant:

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## Rimuovere ha-paneld da un pannello

Scegli l'opzione **Rimuovi Panel Assistant da questo pannello** del pannello, sotto **Configura** in Home Assistant. In 1.0.0-rc1, scegli se Home Assistant debba dimenticare il pannello, poi seleziona **Invia**. Nella versione 1.0.0-rc2 non ancora rilasciata, l'opzione si chiama **Rimuovi da questo pannello** e una rimozione riuscita elimina sempre la relativa voce in Home Assistant. Panel Assistant restituisce al pannello la sua schermata iniziale originale e disinstalla l'app del pannello. Leggi prima [Prima di rimuovere ha-paneld](/it/manage/removal-risks/).

## Percorsi di accesso e modalità di sicurezza

Le raccomandazioni dei profili hardware sono solo informative. Scegliere un profilo non significa acconsentire a disabilitare pacchetti, rendere ADB persistente, installare software privilegiato o cambiare le impostazioni dello schermo. I pacchetti che hai già limitato nella scheda [Pacchetti del produttore](/it/manage/vendor-packages/) vengono ancora limitati a ogni avvio.

La [modalità di sicurezza Hardened](/it/manage/security-mode/) richiede che qualcuno al pannello approvi determinate azioni remote ad alto impatto. Può essere attivata solo dal pannello. Quando è attiva non è possibile usare ADB di rete: prima di installare o aggiornare tramite ADB, riporta quindi il pannello in modalità Relaxed dal pannello stesso.

## Compilarlo autonomamente

L'app è libera e open source; la pagina [Ambiente di sviluppo](/it/reference/development-environment/) ne descrive la compilazione.
