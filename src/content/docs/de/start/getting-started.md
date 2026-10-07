---
title: Erste Schritte
description: In wenigen Minuten vom uneingerichteten Android-Wandpanel zum Home Assistant-Dashboard, mit Home Assistant als Begleiter bei jedem Schritt.
sourceCommit: a0f4f4fce9c24d9c344dbb001c39a8eef9bdd679
---

Wenn du schon einmal ein Wandpanel oder einen Kiosk eingerichtet hast, erinnerst du dich wahrscheinlich an den Ablauf: Apps manuell installieren, nach einer Browser-Engine suchen, die ein Dashboard darstellen kann, Einstellungen erraten und dem nächsten Neustart nie ganz trauen. Die Einrichtung mit Panel Assistant wird dich angenehm überraschen. Du kannst in wenigen Minuten fertig sein, und selbst wenn das Panel schon an der Wand hängt, musst du nicht von deinem Stuhl aufstehen. Na gut, vielleicht einmal ;-)

Die erste Stunde ist bei jedem Panel die schwierigste. Panel Assistant übernimmt sie für dich, direkt aus Home Assistant. Ist das Panel schon in deinem Netzwerk, gibst du der Integration seine Adresse, und sie erledigt den Rest. Ist es noch im Karton, schließt du es mit einem USB-Kabel an deinen Laptop an und installierst direkt aus dem Browser, bevor es an die Wand kommt. In beiden Fällen bestätigst du eine Abfrage auf dem Panel und verfolgst den Ablauf.

## 1. Die Integration installieren

Füge Panel Assistant über HACS hinzu und starte Home Assistant neu. Das ist das Einzige, was du von Hand installierst. Ab jetzt führt dich Home Assistant durch den Ablauf. Siehe [Die Integration installieren](/de/home-assistant/custom-integration/).

## 2. Debugging auf dem Panel einschalten

Öffne die Entwickleroptionen auf dem Panel und aktiviere drahtloses Debugging oder USB-Debugging, wenn du das Panel per Kabel anschließt. Dadurch kann Home Assistant die Installation für dich erledigen. Die [Hardware-Seiten](/de/hardware/) zeigen, wo der Schalter bei jedem Modell zu finden ist. [Das Panel vorbereiten](/de/install/prepare-a-panel/) erklärt die Details.

## 3. Das Panel hinzufügen

Gehe in Home Assistant zu **Einstellungen**, **Geräte & Dienste**, **Integration hinzufügen** und wähle **Panel Assistant**. Wähle dann aus, wie das Panel verbunden ist.

### An deinen Computer angeschlossen

Ein neues Panel kannst du einrichten, bevor es an die Wand kommt. Schließe es mit einem USB-Kabel an deinen Computer an und installiere direkt aus deinem Browser. Dafür brauchst du Chrome oder Edge.

<div class="pa-steps" role="region" aria-label="Über USB installieren, Schritt für Schritt" tabindex="0">
<figure>
<figcaption><span>1</span> Wähle Über USB installieren</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Der Schritt Panel einrichten in Home Assistant bietet Panel im Netzwerk hinzufügen oder Über USB an diesem Computer installieren an">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Der Schritt Panel einrichten in Home Assistant bietet Panel im Netzwerk hinzufügen oder Über USB an diesem Computer installieren an">
</figure>
<figure>
<figcaption><span>2</span> Schließe das Panel an</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="Das USB-Installationsprogramm fordert dich auf, das Panel anzuschließen und Mein Panel finden zu drücken">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="Das USB-Installationsprogramm fordert dich auf, das Panel anzuschließen und Mein Panel finden zu drücken">
</figure>
<figure>
<figcaption><span>3</span> Tippe auf dem Panel auf Zulassen</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="Das USB-Installationsprogramm wartet, während du auf dem Bildschirm des Panels auf Zulassen tippst">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="Das USB-Installationsprogramm wartet, während du auf dem Bildschirm des Panels auf Zulassen tippst">
</figure>
<figure>
<figcaption><span>4</span> Drücke Installieren</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="Das USB-Installationsprogramm ist bereit zur Installation und zeigt eine einzelne Schaltfläche Installieren">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="Das USB-Installationsprogramm ist bereit zur Installation und zeigt eine einzelne Schaltfläche Installieren">
</figure>
<figure>
<figcaption><span>5</span> Verfolge die Installation</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="Der Fortschrittsbalken des USB-Installationsprogramms während der Installation der App">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="Der Fortschrittsbalken des USB-Installationsprogramms während der Installation der App">
</figure>
<figure>
<figcaption><span>6</span> Fertig</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="Das USB-Installationsprogramm bestätigt die Installation und öffnet die Einrichtung des Panels">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="Das USB-Installationsprogramm bestätigt die Installation und öffnet die Einrichtung des Panels">
</figure>
</div>

### In deinem Netzwerk

Wenn das Panel schon an der Wand hängt, braucht Home Assistant nur seine Adresse.

<div class="pa-steps" role="region" aria-label="Ein Panel im Netzwerk hinzufügen, Schritt für Schritt" tabindex="0">
<figure>
<figcaption><span>1</span> Wähle Panel im Netzwerk hinzufügen</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Der Schritt Panel einrichten in Home Assistant bietet Panel im Netzwerk hinzufügen oder Über USB an diesem Computer installieren an">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Der Schritt Panel einrichten in Home Assistant bietet Panel im Netzwerk hinzufügen oder Über USB an diesem Computer installieren an">
</figure>
<figure>
<figcaption><span>2</span> Gib die Adresse des Panels an</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="Der Schritt Panel hinzufügen mit eingetragener IP-Adresse des Panels">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="Der Schritt Panel hinzufügen mit eingetragener IP-Adresse des Panels">
</figure>
<figure>
<figcaption><span>3</span> Wähle eine Version</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="Der Schritt Version wählen mit der empfohlenen Version oben in der Liste">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="Der Schritt Version wählen mit der empfohlenen Version oben in der Liste">
</figure>
<figure>
<figcaption><span>4</span> Tippe auf dem Panel auf Zulassen, dann wird es hinzugefügt</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="Der Schritt Erfolg bestätigt, dass das Panel zu Home Assistant hinzugefügt wurde">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="Der Schritt Erfolg bestätigt, dass das Panel zu Home Assistant hinzugefügt wurde">
</figure>
</div>

In beiden Fällen übernimmt der Assistent den komplizierten Teil. Er prüft, was bereits auf dem Panel vorhanden ist, installiert die aktuelle Version der Panel-App, startet sie und bestätigt, dass sie ordnungsgemäß läuft. Ein Panel, auf dem die App schon läuft, wird übernommen, ohne sie neu zu installieren. Das Panel erkennt sein Modell und lädt das passende Hardware-Profil. Bildschirm, Tasten, LEDs und Sensoren stehen dadurch in Home Assistant sofort bereit. Siehe [Ein Panel hinzufügen](/de/install/installing-ha-paneld/).

## 4. Im Einrichtungsassistenten des Panels abschließen

Home Assistant öffnet anschließend den Einrichtungsassistenten des Panels. Er stellt dir ein paar kurze Fragen, unter anderem nach einem Namen für das Panel und dem Dashboard für die Wand. Das Panel lädt nur die Entitäten, die dieses Dashboard anzeigt. So bleibt es schnell. Siehe [Ein Panel verbinden](/de/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="Der Einrichtungsassistent des Panels, Schritt für Schritt" tabindex="0">
<figure>
<figcaption><span>1</span> Gib dem Panel einen Namen</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="Der Einrichtungsassistent des Panels fragt nach Panel-ID und Anzeigename und zeigt eine Vorschau der Entitätsnamen, die Home Assistant verwenden wird">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="Der Einrichtungsassistent des Panels fragt nach Panel-ID und Anzeigename und zeigt eine Vorschau der Entitätsnamen, die Home Assistant verwenden wird">
</figure>
<figure>
<figcaption><span>2</span> Wähle Dashboard und Bereich</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="Der Assistent mit einem für das Panel ausgewählten Dashboard und einem Home Assistant-Bereich">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="Der Assistent mit einem für das Panel ausgewählten Dashboard und einem Home Assistant-Bereich">
</figure>
<figure>
<figcaption><span>3</span> Schalte den Entitätenfilter ein</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="Der Assistent empfiehlt den Entitätenfilter für dieses Panel und zeigt die Anzahl der Home Assistant-Entitäten">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="Der Assistent empfiehlt den Entitätenfilter für dieses Panel und zeigt die Anzahl der Home Assistant-Entitäten">
</figure>
<figure>
<figcaption><span>4</span> Fast geschafft</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="Der Assistent wartet, während das Panel seine gefilterte Entitätsauswahl zusammenstellt und das Dashboard lädt">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="Der Assistent wartet, während das Panel seine gefilterte Entitätsauswahl zusammenstellt und das Dashboard lädt">
</figure>
<figure>
<figcaption><span>5</span> Alles bereit</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="Der Assistent bestätigt, dass das Panel eingerichtet ist, und zeigt das Dashboard">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="Der Assistent bestätigt, dass das Panel eingerichtet ist, und zeigt das Dashboard">
</figure>
</div>

## Was du brauchst

- Home Assistant 2026.8.3 oder neuer, mit HACS.
- Ein Wandpanel mit Android 8.0 oder neuer. Die meisten Panels funktionieren mit dem generischen Hardware-Profil. [Ein Panel auswählen](/de/install/supported-panels/) listet die Modelle mit voller Hardware-Unterstützung auf.
- Für die USB-Option einen Chromium-basierten Browser wie Chrome oder Edge.

## Wo du die Details findest

Die Seiten unter **Im Alltag betreiben** erklären jede Funktion der Panel-App ausführlich. Der Referenzbereich dokumentiert die [API](/de/reference/api/), [Hardware-Profile](/de/reference/profiles/) und das [Sicherheitsmodell](/de/reference/security/). Die [Hardware-Seiten](/de/hardware/) behandeln jedes unterstützte Panel.
