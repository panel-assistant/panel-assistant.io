---
title: Panelkonto und Netzwerksicherheit
description: Wähle das Home Assistant-Konto, das dein Panel verwendet, und plane seinen Netzwerkzugriff.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

## Welches Home Assistant-Konto verwendet das Panel?

Wenn du über Panel Assistant ein neues Panel hinzufügst, verwendet seine Anmeldung über den Browser normalerweise das Home Assistant-Konto, das bereits auf deinem Computer angemeldet ist. Wenn das dein Administratorkonto ist, meldet sich das Panel als dieser Administrator an. Panel Assistant fragt nicht nach deinem Passwort und erstellt keinen weiteren Home Assistant-Benutzer. Das Panel behält seine eigene Anmeldung bei Home Assistant, damit es dein Dashboard laden und als dieser Benutzer mit Home Assistant kommunizieren kann.

Dein übliches Konto zu verwenden, ist in Ordnung, besonders wenn deine Home Assistant-Installation nur einen Benutzer hat. Ein separater **bestehender** Benutzer lohnt sich, wenn du den Zugriff des Panels von deinem Administratorkonto trennen möchtest. Ein Benutzer ohne Administratorrechte kann Dashboards nutzen, ohne Zugriff auf die Einstellungen von Home Assistant zu haben. Ein separates Konto ist optional. Panel Assistant erstellt bei der Einrichtung keines.

Home Assistant speichert außerdem für jeden Benutzer ein Standard-Dashboard und ein Design. Ein Panelbenutzer kann ein eigenes Wand-Dashboard und Erscheinungsbild haben, ohne die Auswahl auf deinem Smartphone oder Computer zu verändern. Der integrierte Renderer verwendet dieses Standard-Dashboard, wenn **Start-Dashboard** auf **Automatisch** eingestellt ist. Ein in den Paneleinstellungen ausgewähltes Dashboard hat Vorrang. Die Einstellung **Dashboard-Design** kann den hellen oder dunklen Modus anfordern, wobei eine ausdrücklich ausgewählte Home Assistant-Designoption weiterhin Vorrang hat.

Unter **Home Assistant → Benutzerprofil → Allgemein** kannst du dem Panelbenutzer eigene Seitenleisteneinträge und deren Reihenfolge, eine Sprache, Zeitzone sowie Zahlen-, Datums- und Zeitformate geben. Die Einstellungen der Seitenleiste wirken sich aus, wenn die Seitenleiste sichtbar ist. Das Panel blendet die Navigation standardmäßig aus. Einen Seitenleisteneintrag auszublenden, schränkt den Zugriff darauf nicht ein. Diese Kontoeinstellungen beschreibt die [Anleitung zum Benutzerprofil von Home Assistant](https://www.home-assistant.io/docs/configuration/user-configuration/).

### Die Anmeldung des Panels ändern

Öffne in Home Assistant **Panel Assistant**, wähle das Panel und öffne dann dessen Registerkarte **Konfigurieren**. Wähle unter **Browser-Anmeldung** die Optionen **Neu verbinden** und **Link kopieren**. Öffne diesen Link in einem privaten Browserfenster, melde dich bei Home Assistant als der bestehende Benutzer an, den das Panel verwenden soll, und lasse den Browser zum Panel zurückkehren. Ein privates Fenster hilft, wenn dein üblicher Browser bereits als Administrator angemeldet ist. Du kannst **Konfigurieren** auch direkt auf dem Panel öffnen und dort die Browser-Anmeldung starten. Wenn Home Assistant anschließend unter **Einstellungen → Reparaturen** meldet, dass der Panelbenutzer nicht übereinstimmt, bestätige, dass der genannte neue Benutzer der von dir gewählte ist.

Der Browser muss sowohl Home Assistant als auch die lokale Adresse des Panels erreichen können, um die Anmeldung abzuschließen. Auch das Panel muss Home Assistant erreichen können. Wenn du „Konfigurieren“ aus der Ferne über Home Assistant geöffnet hast, dein Browser die lokale Adresse des Panels aber nicht erreichen kann, schließe die Anmeldung ab, während du mit dem Netzwerk des Panels verbunden bist, oder direkt auf dem Panel.

## Das Panel in ein separates Netzwerk setzen

Ein Panel kann ein VLAN ohne Internetzugriff nutzen, wenn deine Firewall weiterhin Verbindungen zwischen Panel und Home Assistant in beide Richtungen zulässt und ein Browser in deinem Netzwerk das Panel erreichen kann, wenn sich jemand anmelden muss. Das Panel verwendet die lokale Adresse von Home Assistant für die Anmeldung und sein Dashboard. Home Assistant muss das Panel auch für die Verwaltung und für Updates erreichen können.

Panel Assistant kann ein verifiziertes Update der Panel-App auf dem Home Assistant-Rechner abrufen und über das lokale Netzwerk an das Panel senden. Home Assistant benötigt weiterhin Zugriff auf die Update-Quelle. Die Versionsprüfungen des Panels und die vom Eigentümer gestarteten Installationen auf seiner Registerkarte „Installieren“ verwenden GitHub und benötigen ebenfalls Internetzugriff. Diese Prüfungen und Downloads funktionieren in einem VLAN ohne Internetroute nicht. Android System WebView wird separat über den Play Store, die Herstellerfirmware oder eine manuelle Installation gepflegt. Plane daher auch, wie du diese aktuell halten wirst.

Die Trennung der Netzwerke begrenzt, welche Geräte die Weboberfläche und API des Panels erreichen können. Sie verringert nicht die Rechte eines Home Assistant-Kontos, das bereits auf dem Panel angemeldet ist. Wenn das Panel ein Administratorkonto verwendet, bleibt diese Anmeldung auch in einem isolierten VLAN eine Administratoranmeldung. Wähle das Konto und die Firewallregeln passend dazu, was du an der Wand und im lokalen Netzwerk für vertrauenswürdig hältst.

Die Weboberfläche und die gewöhnlichen Steuerelemente des Panels setzen ein vertrauenswürdiges lokales Netzwerk voraus. Der optionale [Gehärtete Modus](/de/manage/security-mode/) erfordert für ausgewählte direkte LAN-Anfragen mit weitreichenden Auswirkungen physischen Zugang. Einige gewöhnliche Verwaltungsaktionen können für einen Home Assistant-Administrator über die authentifizierte Panel Assistant-Seitenleiste ausgeführt werden. Andere geschützte Vorgänge benötigen weiterhin eine Genehmigung auf dem Bildschirm des Panels. Er ersetzt keine Netzwerktrennung und authentifiziert nicht jede API-Anfrage.
