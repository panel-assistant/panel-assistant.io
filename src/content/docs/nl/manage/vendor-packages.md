---
title: Pakketten van de fabrikant
description: Voorkomen dat een opdringerige fabrieksapp bij het opstarten terugkomt en over je dashboard tekent, omkeerbaar en alleen voor de gekozen pakketten.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Een firmware-update kan een app van de fabrikant achterlaten die zichzelf bij het opstarten opnieuw start en een zwevende widget over je dashboard tekent. Op de Sonoff NSPanel Pro 120 liet een firmware-update bijvoorbeeld `com.eWeLinkControlPanel` bij het opstarten starten en een bedieningswidget over alles heen leggen wat het paneel toonde. De paneel-app kan zulke pakketten neutraliseren, maar alleen degene die je noemt.

## Wat het doet

Voor elk pakket dat je temt, voert de paneel-app drie omkeerbare, bevoorrechte handelingen uit, die bij elke start worden herhaald:

| Stap                                       | Mechanisme                                  | Effect                                                                                      |
| ------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Geforceerd stoppen                         | `am force-stop <pkg>`                       | Stopt de app nu, zodat de widget onmiddellijk verdwijnt.                                    |
| Opnieuw starten bij opstarten uitschakelen | `pm disable-user --user 0 <pkg>`            | Voorkomt dat de app bij de volgende start opnieuw begint. Omkeerbaar met `pm enable <pkg>`. |
| Overlays blokkeren                         | `appops set <pkg> SYSTEM_ALERT_WINDOW deny` | Trekt de toestemming in om een zwevend venster over het dashboard te tekenen.               |

Alle drie zijn bevoorrecht, dus de functie vereist **root of de [root-helper](https://github.com/panel-assistant/android/blob/main/helper/README.md)**. Dit werkt daardoor ook op panelen die root afschermen, zoals de [Tuya TPA10](/nl/hardware/panels/tuya/tpa10/), waar de handelingen via de helperopdrachten `STOP`, `DISABLE` en `OVERLAY` lopen.

## Gebruik

Je beheert dit **op de eigen webinterface van het paneel**, op het tabblad **Installeren**, niet vanuit Home Assistant. Je doet het eenmaal bij het instellen of na een firmware-update, niet dagelijks, dus het hoort niet op een dashboard.

Kies **Bezoeken** op de apparaatpagina van het paneel in Home Assistant, open **Installeren** en zoek de kaart **Pakketten van leveranciers** (bijvoorbeeld `http://<panel-ip>:8888/install` met de standaardpoort).

Druk op **Zoek een pakket…** om een lijst met mogelijk te beheren apps op het paneel te openen, gegroepeerd om de keuze te vergemakkelijken:

- **Aanbevolen voor dit paneel**: de opdringerige firmware-apps die bekend zijn voor je hardware, als veilige eerste keuzes. Op een paneel met een bekend hardwareprofiel, zoals de NSPanel Pro, staat hier `com.eWeLinkControlPanel`. Elke vermelding heeft **tags** (bijvoorbeeld `vendor` voor apps van de paneelfabrikant, `chipset` voor fabrieks- en testapps van de chipfabrikant, `overlay`, `boot`) en een korte **opmerking** van de profielauteur over wat het is en waarom het gemarkeerd is. Zo kun je een Sonoff-overlayapp onderscheiden van een onschuldige Rockchip-testapp die in het image is achtergebleven.
- **Andere apps**: apps op het paneel die geen onderdeel zijn van Android zelf. Op een paneel zonder bekend profiel zoek je hier naar apps met een launcher-vermelding, overlaytoestemming of een niet-platformhandtekening die op een toevoeging van de fabrikant lijken.
- **Hoogste CPU-gebruik**: wat op dat moment de meeste CPU gebruikt. Tem alleen iets dat je herkent.

Elke vermelding heeft een knop **Temmen**, en als je de pakketnaam kent, kun je die ook rechtstreeks in het vak typen. **Temmen** werkt direct, zonder apart opslaan, en wordt bij elke start opnieuw toegepast. Bij een getemd of al uitgeschakeld pakket verschijnt **Opnieuw inschakelen**, waarmee je dit terugdraait. De kaart zelf vermeldt alleen wat je hebt getemd, met de toestand: `active`, `disabled` of `not installed`.

Er wordt niets getemd totdat je op een knop Temmen drukt. Zonder root of de helper blijft de kaart zichtbaar maar vergrendeld, met uitleg over de ontbrekende toegang.

## Veiligheid

- **Omkeerbaar.** Uitschakelen wordt teruggedraaid met `pm enable <pkg>` of door een update van die app of de firmware. Niets hier is destructief: geen verwijdering en geen gegevenswissing.
- **Kritieke pakketten worden geweigerd.** De paneel-app zal nooit de systeeminterface, Instellingen, telefonie, het Android-framework of zichzelf stoppen of uitschakelen, ook niet als je die noemt. Zowel de app als de bevoorrechte helper dwingen dit af, zodat een typefout het paneel niet onbruikbaar kan maken.
- **Alleen geïnstalleerde pakketten die je noemt, worden aangepast.** Verwijder je een pakket dat de paneel-app beheert uit de gewenste lijst, dan wordt het weer ingeschakeld en krijgt het zijn opgeslagen overlaytoestemming terug. **Opnieuw inschakelen** draait het temmen ook terug.

:::caution
Je kiest pakketten om uit te schakelen, dus houd het bij software van de fabrikant die je herkent. Schakel je iets uit waarop het paneel vertrouwt, zoals een launcher die je werkelijk gebruikt of een invoermethode, dan kan navigeren lastig worden totdat je het via `adb` weer inschakelt. Laat het bij twijfel met rust.
:::
