---
title: Weergavegrootte
description: De grootte van een Home Assistant-dashboard op een paneel afstemmen op de weergave in een desktopbrowser, met dichtheid en tekstgrootte.
sourceCommit: 33ce23572aefb327319703efb255e5129b71ecbf
---

Een Home Assistant-dashboard dat in een desktopbrowser is ontworpen, wordt op een Android-wandpaneel vaak op de verkeerde grootte weergegeven: kaarten zijn te groot met afgesneden randen, of te klein. Op een telefoon komt de weergave meestal redelijk overeen met die op de desktop, maar op panelen vaak niet, omdat hun fabrikanten ze leveren met een systeemdichtheid en lettertypeschaal die slecht bij het fysieke scherm passen. De paneelapp biedt je twee instellingen, **Logische dichtheid (dpi)** en **Tekstgrootte**, onder **Installeren** en vervolgens **Weergavegrootte**, om de indeling en de tekst weer in lijn te brengen. Meestal heb je ze allebei nodig.

:::caution[Experimenteel]
De instellingen werken, maar de juiste waarden voor elk paneel staan nog niet vast. Beschouw dichtheid en tekstgrootte als iets om mee te experimenteren, niet als een afgeronde functie. Feedback over waarden die goed werken voor een bepaald paneel is welkom.
:::

## Gebruik

Met de kaart **Weergavegrootte** op het tabblad **Installeren** van het paneel stel je een aangepaste logische dichtheid en tekstgrootte in, pas je ze direct toe of herstel je de fabrieksbasisdichtheid van Android. Beide blijven na een herstart behouden, omdat het systeeminstellingen van Android zijn.

:::note
Hiervoor is een goedgekeurde toegangsmethode met verhoogde rechten nodig: doorgaans de `su` van de fabrikant of de [roothelper](https://github.com/panel-assistant/android/blob/main/helper/README.md). Een compatibel paneel zonder root waarop de optionele uitgebreide toegang al is goedgekeurd, kan ook precies deze weergavewijzigingen doorvoeren. Als er geen ondersteunde toegangsmethode gereed is, blijft de kaart zichtbaar maar vergrendeld.
:::

Open hetzelfde dashboard ter vergelijking in een desktopbrowser om de instellingen af te stemmen. Verlaag de dichtheid totdat de indeling overeenkomt (er passen meer kaarten op het scherm) en pas daarna de tekstgrootte in kleine stappen aan totdat de tekst overeenkomt. Goede waarden hangen zowel van de installatie als van het model af: de resolutie van het paneel, hoe ver mensen ervan af staan en hoe het dashboard is ontworpen.

Voor sommige ondersteunde modellen wordt een aanbevolen dichtheid meegeleverd, en voor de meeste daarvan ook een tekstgrootte. Wanneer Panel Assistant zo'n paneel instelt zonder toegangsmethode met verhoogde rechten, past het deze waarden eenmalig toe via zijn ADB-verbinding. Als je de app via Panel Assistant verwijdert, worden de vorige waarden hersteld.

## De twee instellingen

| Instelling                   | Wat deze verandert                                                                                                                                                                                                                          | Mechanisme                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Logische dichtheid (dpi)** | De volledige indeling. De effectieve viewport in dp is `physical px ÷ (density / 160)`. Bij een lagere dichtheid past er meer op het scherm, wat de bredere viewport van een desktop benadert; bij een hogere dichtheid wordt alles groter. | `wm density <n>`                     |
| **Tekstgrootte**             | Tekst in het dashboard. De systeemlettertypeschaal van Android wordt de `textZoom` van de WebView (`textZoom = scale × 100`).                                                                                                               | `settings put system font_scale <f>` |

De uitvoer van `wm density` in Android noemt de fabrieksbasiswaarde `Physical density`. Dat label is misleidend: het is de dichtheid die Android voor de indeling gebruikt zodra een aangepaste waarde is gereset, geen meting van het aantal pixels per inch van het scherm. De paneelapp geeft deze waarde weer als de **fabrieksbasis** en toont een fysieke PPI alleen voor hardwareprofielen waarvan de schermafmetingen onafhankelijk zijn gecontroleerd.

Alleen de dichtheid wijzigen schaalt de indeling, maar kan ervoor zorgen dat de tekst vergeleken met de desktop de verkeerde grootte houdt; de lettertypeschaal corrigeert de tekst. Door beide samen af te stemmen, laat je de weergave op een paneel overeenkomen met die in de browser waarin het dashboard is ontworpen.
