---
title: Reparaties
description: Wat elke Panel Assistant-reparatie betekent, waarom die verschijnt en hoe je die oplost.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Open **Instellingen → Systeem → Reparaties** in Home Assistant en kies het Panel Assistant-bericht. De eerste link opent de betreffende instelling of herstelstappen. Gebruik **Meer informatie** voor de onderstaande uitleg.

Bewaar het opgeslagen ondersteuningsrapport terwijl je een mislukte installatie of update onderzoekt. De actie **Fout wissen** verwijdert dat rapport; deze verandert niets aan het paneel.

Gebruik de beveiligde actie **Opnieuw proberen** van de bestaande reparatie pas nadat je het rapport en het paneel hebt gecontroleerd. Start geen nieuwe automatische installatie, verwijdering of reset zolang de geïnstalleerde toestand onbekend is. Zie [installatieherstel](/nl/manage/troubleshooting/#een-netwerkinstallatie-stopte-halverwege) en [ondersteuningsrapporten](/nl/home-assistant/support-report/).

## Zoek je reparatie

- [Panel Assistant van &lt;panel&gt; halen](#panel-assistant-van-panel-halen)
- [Paneelapp te oud](#panel-app-too-old)
- [Oude app heeft 0.9.0 nodig](#old-app-needs-090)
- [MQTT-paneel heeft 0.9.0 nodig](#mqtt-panel-needs-090)
- [Paneelmachtigingen](#panel-permissions)
- [Nabijheid van paneel instellen](#panel-proximity-setup)
- [Dashboard ongefilterd](#dashboard-unfiltered)
- [Spraakmicrofoon stil](#voice-microphone-silent)
- [Spraakmicrofoon zonder audio](#voice-microphone-no-audio)
- [Spraakmicrofoon zonder audio: details](#voice-microphone-no-audio-detail)
- [Activeringswoord behouden](#wake-word-kept)
- [Activeringswoord geweigerd](#wake-word-refused)
- [Volumegetal verwijderd](#volume-number-removed)
- [Herstart vereist](#restart-required)
- [Paneelgebruiker komt niet overeen](#panel-user-mismatch)
- [Geen updateroute](#no-update-route)
- [Samengevoegde paneelidentiteit](#merged-panel-identity)
- [Installatiefout](#installer-failure)
- [Installatiefout: autorisatie mislukt](#installer-failure-authorization-failed)
- [Installatiefout: voorafgaande controle afgewezen](#installer-failure-preflight-rejected)
- [Installatiefout: artefact afgewezen](#installer-failure-artifact-rejected)
- [Installatiefout: transport mislukt](#installer-failure-transport-failed)
- [Installatiefout: installatie mislukt](#installer-failure-install-failed)
- [Installatiefout: starten mislukt](#installer-failure-launch-failed)
- [Installatiefout: statuscontrole mislukt](#installer-failure-health-check-failed)
- [Installatiefout: onduidelijke wijziging](#installer-failure-ambiguous-mutation)
- [Installatiefout: verificatie vereist](#installer-failure-verification-required)
- [Installatiefout: update](#installer-failure-update)
- [Installatiefout: opnieuw proberen gepauzeerd](#installer-failure-retry-hold)
- [Paneeladres onbereikbaar](#panel-address-unreachable)
- [Paneeladres niet geverifieerd](#panel-address-unverified)
- [Paneelidentiteit komt niet overeen](#panel-identity-mismatch)
- [Paneelkoppeling gedeeld](#panel-link-shared)
- [Paneelidentiteit bevestigen](#panel-identity-confirmation)
- [Installatiefout: ADB-autorisatie](#installer-failure-adb-authorization)
- [ADB-updateautorisatie](#adb-update-authorization)
- [Een andere Home Assistant](#another-home-assistant)

## Panel Assistant van &lt;panel&gt; halen

**Wat het betekent:** Iemand heeft op de apparaatpagina van dit paneel op **Van dit paneel verwijderen** gedrukt. De knop verwijdert niets; de reparatie blijft beschikbaar totdat de verwijdering is voltooid.

**Waarom dit gebeurt:** Panel Assistant vraagt je om bevestiging voordat het het startscherm en de apps van de fabrikant herstelt, ha-paneld verwijdert en het paneel uit Home Assistant verwijdert.

**Hoe je dit oplost:** Lees [wat verwijderen doet en hoe je opnieuw installeert](/nl/manage/removal-risks/) voordat je **Verzenden** één keer selecteert om te bevestigen. Als dit een vergissing was, sluit je het dialoogvenster zonder te verzenden en laat je de reparatie onbevestigd.

<a id="panel-app-too-old"></a>

## Paneelapp te oud

**Wat het betekent:** Home Assistant kan het paneel niet zien of bedienen via het huidige verbindingsprotocol.

**Waarom dit gebeurt:** De paneelapp meldt geen ondersteund verbindingsprotocol, of zijn protocolbereik overlapt niet met het bereik dat deze Panel Assistant kan aanbieden.

**Hoe je dit oplost:** Open Updates in Home Assistant en installeer een compatibele app-update voor dit paneel als die wordt aangeboden. Wacht tot het opnieuw verbinding maakt. Als er geen wordt aangeboden, gebruik dan de handleiding voor updateherstel; downgrade niet blindelings.

<a id="old-app-needs-090"></a>

## Oude app heeft 0.9.0 nodig

**Wat het betekent:** Panel Assistant 1.0 kan dit paneel met de oude app niet installeren of bijwerken.

**Waarom dit gebeurt:** De overstap vanaf de oude ha-paneld-app is verwijderd in 1.0.

**Hoe je dit oplost:** Download Panel Assistant 0.9.0 niet opnieuw over een draaiende 1.0-installatie: een instelling die 1.0 heeft verwijderd kan ervoor zorgen dat 0.9.0 gemigreerde panelen terugzet naar MQTT. Alleen als nog geen enkel paneel de 1.0-app heeft, herstel je een Home Assistant-back-up van vóór de upgrade, voltooi je elke overstap in 0.9.0 en keer je daarna terug naar 1.0. Als een paneel de 1.0-app al heeft of er geen geschikte back-up is, vraag dan ondersteuning voordat je versies wijzigt. Zie de [handleiding voor herstel bij de 1.0-upgrade](/nl/manage/upgrade-to-1-0/).

<a id="mqtt-panel-needs-090"></a>

## MQTT-paneel heeft 0.9.0 nodig

**Wat het betekent:** Panel Assistant kan dit nog niet overgezette MQTT-paneel niet verbinden zonder zijn entiteiten en geschiedenis op te splitsen.

**Waarom dit gebeurt:** Panel Assistant 1.0 voert de MQTT-overstap niet meer uit.

**Hoe je dit oplost:** Download Panel Assistant 0.9.0 niet opnieuw over een draaiende 1.0-installatie: een instelling die 1.0 heeft verwijderd kan ervoor zorgen dat 0.9.0 gemigreerde panelen terugzet naar MQTT. Alleen als nog geen enkel paneel de 1.0-app heeft, herstel je een Home Assistant-back-up van vóór de upgrade, voltooi je elke overstap in 0.9.0 en keer je daarna terug naar 1.0. Als een paneel de 1.0-app al heeft of er geen geschikte back-up is, vraag dan ondersteuning voordat je versies wijzigt. Zie de [handleiding voor herstel bij de 1.0-upgrade](/nl/manage/upgrade-to-1-0/).

<a id="panel-permissions"></a>

## Paneelmachtigingen

**Wat het betekent:** Sommige paneelfuncties werken niet omdat Android hun machtigingen niet heeft verleend. Het dashboard blijft beschikbaar.

**Waarom dit gebeurt:** Door een oudere installatie of gewijzigde Android-machtiging kan een vereiste toestemming ontbreken. Cameratoestemming is relevant zolang de camera aan staat; microfoontoestemming zolang camera of spraak aan staat. Bij een onbekende functiestatus blijft de waarschuwing bestaan totdat die kan worden gecontroleerd.

**Hoe je dit oplost:** Open op het fysieke paneel Android Instellingen → Apps → Panel Assistant. Sta camera, microfoon en meldingen toe waar die worden vermeld. Sta onder Speciale app-toegang Systeeminstellingen wijzigen en Weergeven over andere apps toe en schakel daarna Panel Assistant in onder Toegankelijkheid. Als de navigatie op Veeg om te tonen of Altijd aan staat en de overlaytoestemming ontbreekt, veeg je vanaf de onderkant van het dashboard omhoog om Weergeven over andere apps te openen. Sta dit toe, keer terug en veeg opnieuw. Ga terug naar de reparatie en kies Verzenden. Home Assistant moet elke relevante toestemming opnieuw verifiëren; alleen een mislukte uitlezing of app-update kan de reparatie niet sluiten.

<a id="panel-proximity-setup"></a>

## Nabijheid van paneel instellen

**Wat het betekent:** Activeren met een handgebaar is niet beschikbaar omdat het paneel zijn nabijheidskalibratie niet heeft opgeslagen.

**Waarom dit gebeurt:** Het paneel meldt calibration_required. Kalibratie meet deze installatie en vereist iemand voor het paneel; alleen de configuratie starten bewijst niet dat die is voltooid.

**Hoe je dit oplost:** Open de pagina Configureren van dit paneel bij Aanwezigheid & wekken en kies Nabijheid instellen op paneel. Volg de fysieke instructies op het paneel; dit duurt ongeveer een minuut. Nadat het meldt dat de kalibratie is opgeslagen, ga je terug naar de reparatie en kies je Verzenden. Home Assistant leest een nieuwe status voordat het afrondt; als de configuratie nog loopt of het paneel niet kan worden uitgelezen, voltooi je de configuratie of herstel je de verbinding en verzend je opnieuw. De dashboardactie Nabijheidsinstelling openen is ook een startpunt op het paneel.

<a id="dashboard-unfiltered"></a>

## Dashboard ongefilterd

**Wat het betekent:** Het paneel toont zijn dashboard met alle entiteiten van Home Assistant in plaats van alleen de entiteiten die zijn dashboard gebruikt.

**Waarom dit gebeurt:** Terwijl het paneel leert welke entiteiten zijn dashboard gebruikt, wacht het achter een scherm dat uitlegt waarop het wacht. Duurt dit langer dan 90 seconden, dan toont het paneel het dashboard ongefilterd in plaats van je zonder dashboard te laten. Veelvoorkomende oorzaken zijn een scan waarop Home Assistant niet antwoordde, een geweigerde aanmelding, dashboardregels die jouw keuze vereisen en een browserengine die te oud is om te filteren. Het paneel blijft achter het dashboard proberen.

**Hoe je dit oplost:** Open dit paneel in de Panel Assistant-zijbalk en vervolgens Entiteiten om te zien waarop het wacht. Beantwoord daar een keuze over gemarkeerde regels, of meld je opnieuw aan via Configureren als Home Assistant de aanmelding heeft geweigerd. Installeer een nieuwere browserengine als Panel Assistant die voor het paneel aanbiedt. Het paneel keert vanzelf terug naar het gefilterde dashboard en de reparatie verdwijnt.

<a id="voice-microphone-silent"></a>

## Spraakmicrofoon stil

**Wat het betekent:** Het paneel luistert niet naar een activeringswoord omdat de microfoonopnamecontrole alleen stilte heeft opgenomen.

**Waarom dit gebeurt:** De controle vond alleen stilte of een stationaire audiobasis.

**Hoe je dit oplost:** Open dit paneel in de Panel Assistant-zijbalk en vervolgens Configureren → Spraakassistent. Zet die uit en weer aan om opnieuw te controleren. Als de controle nog steeds mislukt, wijzig dan Audiobron in dezelfde spraakkaart; de directe link toont de geavanceerde instelling. Een geslaagde controle wist de reparatie. Spraak uitschakelen trekt de reparatie ook in, omdat luisteren niet meer wordt gevraagd.

<a id="voice-microphone-no-audio"></a>

## Spraakmicrofoon zonder audio

**Wat het betekent:** Het paneel luistert niet naar een activeringswoord omdat de microfoonopnamecontrole geen audio ontving.

**Waarom dit gebeurt:** De Android-opname leverde geen audio, zonder specifiekere fout.

**Hoe je dit oplost:** Open dit paneel in de Panel Assistant-zijbalk en vervolgens Configureren → Spraakassistent. Zet die uit en weer aan om opnieuw te controleren. Als de controle nog steeds mislukt, wijzig dan Audiobron in dezelfde spraakkaart; de directe link toont de geavanceerde instelling. Een geslaagde controle wist de reparatie. Spraak uitschakelen trekt de reparatie ook in, omdat luisteren niet meer wordt gevraagd.

<a id="voice-microphone-no-audio-detail"></a>

## Spraakmicrofoon zonder audio: details

**Wat het betekent:** Het paneel luistert niet naar een activeringswoord omdat de microfoonopnamecontrole geen audio ontving.

**Waarom dit gebeurt:** De Android-opname gaf geen audio terug; het door het paneel gemelde detail verklaart de opnamefout.

**Hoe je dit oplost:** Open dit paneel in de Panel Assistant-zijbalk en vervolgens Configureren → Spraakassistent. Zet die uit en weer aan om opnieuw te controleren. Als de controle nog steeds mislukt, wijzig dan Audiobron in dezelfde spraakkaart; de directe link toont de geavanceerde instelling. Een geslaagde controle wist de reparatie. Spraak uitschakelen trekt de reparatie ook in, omdat luisteren niet meer wordt gevraagd.

<a id="wake-word-kept"></a>

## Activeringswoord behouden

**Wat het betekent:** Dit paneel behield zijn eigen model onder het gedeelde activeringswoord-ID en gebruikt dus niet het gedeelde model.

**Waarom dit gebeurt:** Het geïnstalleerde model heeft een andere SHA-256 dan het gedeelde model en is geen eerdere gedeelde kopie. Panel Assistant bewaart een afzonderlijk geïmporteerd model in plaats van het te overschrijven.

**Hoe je dit oplost:** Open dit paneel in Panel Assistant, Configureren, Activeringswoorden. Als je daar het gedeelde model wilt, importeer dan het bijbehorende .json-manifest en .tflite-model op dit paneel. Laat het huidige model staan als dat bewust zo was; automatisch delen vervangt het nooit. Importeren via de zijbalk maakt het geïmporteerde model ook de gedeelde kopie; delen activeert geen activeringswoorden.

Importeren via de zijbalk vervangt de gedeelde kopie en kan andere panelen bijwerken. Zie [eigen activeringswoorden](/nl/manage/custom-wake-words/).

<a id="wake-word-refused"></a>

## Activeringswoord geweigerd

**Wat het betekent:** Het gedeelde activeringswoord is niet op dit paneel geïnstalleerd; zijn andere geïnstalleerde activeringswoorden blijven beschikbaar.

**Waarom dit gebeurt:** Het paneel weigerde het geïmporteerde model en meldde een reden. Een model kan een ongeldig manifest hebben, limieten overschrijden, zakken voor de controle van de activeringswoordengine of niet kunnen worden opgeslagen. Een model dat het ene paneel accepteert, kan een ander weigeren.

**Hoe je dit oplost:** Open dit paneel in Panel Assistant, Configureren, Activeringswoorden. Gebruik de gemelde reden om het microWakeWord-model te corrigeren of opnieuw te trainen en importeer daar het bijbehorende .json-manifest en .tflite-bestand. De import toont het antwoord van het paneel en bewaart bij weigering het laatste goede model. Delen activeert het activeringswoord niet; selecteer het als je wilt dat het paneel ernaar luistert. Niet-ondersteunde opdrachten van oudere apps en verbindingstime-outs veroorzaken waarschuwingen in plaats van deze reparatie.

Importeren via de zijbalk vervangt de gedeelde kopie en kan andere panelen bijwerken. Zie [eigen activeringswoorden](/nl/manage/custom-wake-words/).

<a id="volume-number-removed"></a>

## Volumegetal verwijderd

**Wat het betekent:** Automatiseringen of scripts verwijzen nog naar een afzonderlijke volumegetalentiteit die is verwijderd van een paneel dat nu een mediaspeler heeft. Die acties moeten worden aangepast.

**Waarom dit gebeurt:** De mediaspeler van het paneel beheert nu het volume. Panel Assistant verwijdert alleen de vroegere volumegetalentiteit van dat paneel nadat Home Assistant is gestart en noemt de automatiseringen en scripts die er nog naar verwijzen.

**Hoe je dit oplost:** Open Automatiseringen of Scripts en zoek de items die de reparatie noemt. Vervang acties number.set_value voor de verwijderde getalentiteit door media_player.volume_set voor de mediaspeler van het paneel; stel volume_level in tussen 0 en 1, bijvoorbeeld 0.5 voor 50%. Pas andere verwijzingen aan op basis van hun doel. Sla op, controleer of de automatisering of het script werkt en negeer daarna de reparatie. Panel Assistant herschrijft ze niet automatisch.

<a id="restart-required"></a>

## Herstart vereist

**Wat het betekent:** Home Assistant voert nog de vorige Panel Assistant-versie uit.

**Waarom dit gebeurt:** De geïnstalleerde integratieversie/build verschilt van de code die al in Home Assistant is geladen.

**Hoe je dit oplost:** Open de reparatie, controleer de geïnstalleerde en actieve versies en kies Verzenden wanneer je klaar bent om Home Assistant te herstarten en de geïnstalleerde versie te laden.

<a id="panel-user-mismatch"></a>

## Paneelgebruiker komt niet overeen

**Wat het betekent:** Een paneelaccountverzoek wacht op je bevestiging.

**Waarom dit gebeurt:** Een aangemelde Home Assistant-gebruiker heeft gevraagd om als dit paneel te verbinden. Een eerste koppeling of wijziging ten opzichte van het opgeslagen account vereist jouw goedkeuring.

**Hoe je dit oplost:** Open de reparatie en vergelijk het genoemde paneel en de gebruiker met het account dat je bewust hebt ingesteld. Kies alleen Verzenden als je het verzoek herkent. Als het paneel al een ander account heeft, stopt bevestigen van de wijziging het accepteren van dat account. Sluit bij een onverwacht verzoek het dialoogvenster en negeer het probleem: elke aangemelde gebruiker kan een paneelverbinding aanvragen.

<a id="no-update-route"></a>

## Geen updateroute

**Wat het betekent:** Panel Assistant kan geen app-updates installeren; het paneel blijft op zijn huidige appversie terwijl de andere functies blijven werken.

**Waarom dit gebeurt:** Het paneel biedt geen bruikbare updateroute meer, wat kan volgen op firmwarewijzigingen of een reset.

**Hoe je dit oplost:** Volg [de handleiding voor een paneel dat niet kan worden bijgewerkt](/nl/manage/updates-and-recovery/#een-paneel-dat-niet-kan-worden-bijgewerkt). Herstel hangt af van model en firmware: herstel foutopsporingstoegang of verbind opnieuw via USB alleen wanneer de handleiding dat voorschrijft. De reparatie verdwijnt zodra Home Assistant een werkende updateroute heeft.

<a id="merged-panel-identity"></a>

## Samengevoegde paneelidentiteit

**Wat het betekent:** Meerdere vermeldingen claimen één identiteit, waardoor veilig native eigenaarschap niet mogelijk is.

**Waarom dit gebeurt:** Gekloonde of historisch gedeelde identificatoren maken een sessie ambigu; de integratie weigert een paneel te kiezen.

**Hoe je dit oplost:** Werk de app bij op elk betrokken fysiek paneel zodat elk zijn eigen identiteit meldt. Verwijder daarna het samengevoegde apparaat in Home Assistant en laat de panelen opnieuw registreren. Controleer entiteiten die een eerdere release heeft uitgeschakeld; ze worden niet automatisch hersteld.

<a id="installer-failure"></a>

## Installatiefout

**Wat het betekent:** De installatie of update is niet voltooid.

**Waarom dit gebeurt:** De fout kwam niet overeen met een specifiekere reparatiereden.

**Hoe je dit oplost:** Open het Ondersteuningsrapport om te zien wat er gebeurde en gebruik Opnieuw proberen nadat je de gemelde oorzaak hebt opgelost.

<a id="installer-failure-authorization-failed"></a>

## Installatiefout: autorisatie mislukt

**Wat het betekent:** De installatie kon geen verbinding maken met Android op het paneel.

**Waarom dit gebeurt:** Het paneel accepteerde de ADB-verbinding van Home Assistant niet.

**Hoe je dit oplost:** Controleer foutopsporing en de goedkeuringsvraag op het paneel met Paneel voorbereiden en gebruik daarna Opnieuw proberen in de reparatie.

<a id="installer-failure-preflight-rejected"></a>

## Installatiefout: voorafgaande controle afgewezen

**Wat het betekent:** De gevraagde app is niet geïnstalleerd.

**Waarom dit gebeurt:** De installatiecontroles wezen het paneel vóór installatie af.

**Hoe je dit oplost:** Open het Ondersteuningsrapport, corrigeer de gemelde controle en gebruik daarna Opnieuw proberen als het paneel en de geselecteerde release nog overeenkomen.

<a id="installer-failure-artifact-rejected"></a>

## Installatiefout: artefact afgewezen

**Wat het betekent:** De gevraagde app is niet geïnstalleerd.

**Waarom dit gebeurt:** De release kon niet worden geauthenticeerd of lokale stagingcontroles mislukten, waaronder een onveilig of bezet stagingpad.

**Hoe je dit oplost:** Open het Ondersteuningsrapport om de afgewezen release of stagingcontrole te vinden en probeer opnieuw via de reparatie nadat die oorzaak is opgelost.

<a id="installer-failure-transport-failed"></a>

## Installatiefout: transport mislukt

**Wat het betekent:** Home Assistant kon het overdragen of installeren van de app niet voltooien.

**Waarom dit gebeurt:** Een transportbewerking mislukte; dit kan een verbindingsprobleem of een geweigerde overdrachts- of installatiebewerking zijn.

**Hoe je dit oplost:** Herstel de verbinding van het paneel en gebruik daarna Opnieuw proberen in de reparatie, zodat Panel Assistant de huidige toestand controleert voordat het verdergaat.

<a id="installer-failure-install-failed"></a>

## Installatiefout: installatie mislukt

**Wat het betekent:** Android weigerde de gevraagde installatie.

**Waarom dit gebeurt:** De pakketinstallatie op het paneel mislukte; het Ondersteuningsrapport bevat het resultaat.

**Hoe je dit oplost:** Lees het Ondersteuningsrapport en los de gemelde Android-fout op. Gebruik daarna Opnieuw proberen in de reparatie.

<a id="installer-failure-launch-failed"></a>

## Installatiefout: starten mislukt

**Wat het betekent:** De app is geïnstalleerd maar startte niet.

**Waarom dit gebeurt:** Het installatieprogramma kon Panel Assistant na installatie niet starten.

**Hoe je dit oplost:** Open Panel Assistant vanuit de applijst van het paneel en gebruik daarna Opnieuw proberen in de reparatie om de poging te controleren en af te ronden. Als de app niet opent, gebruik dan het Ondersteuningsrapport voor hulp.

<a id="installer-failure-health-check-failed"></a>

## Installatiefout: statuscontrole mislukt

**Wat het betekent:** De app is gestart maar er is nog niet bevestigd dat die gezond is.

**Waarom dit gebeurt:** Het installatieprogramma ontving niet het vereiste gezonde antwoord.

**Hoe je dit oplost:** Controleer de app op het paneel en gebruik daarna Opnieuw proberen in de reparatie om de status te controleren. Als die ongezond blijft, gebruik dan het Ondersteuningsrapport voor hulp.

<a id="installer-failure-ambiguous-mutation"></a>

## Installatiefout: onduidelijke wijziging

**Wat het betekent:** Panel Assistant kan niet bepalen of de mislukte poging het paneel heeft gewijzigd.

**Waarom dit gebeurt:** Het installatieresultaat bewees de uiteindelijke pakkettoestand van het paneel niet.

**Hoe je dit oplost:** Controleer wat er op het fysieke paneel staat en open het Ondersteuningsrapport van de reparatie. Gebruik de beveiligde actie Opnieuw proberen pas nadat je de gemelde toestand hebt gecontroleerd; verwijder de app niet, wis geen appgegevens en reset het paneel niet om het bericht te wissen.

<a id="installer-failure-verification-required"></a>

## Installatiefout: verificatie vereist

**Wat het betekent:** Een volgende installatie wordt tegengehouden totdat het paneel kan worden gecontroleerd.

**Waarom dit gebeurt:** De vorige poging vereist verificatie vóór een volgende installatie.

**Hoe je dit oplost:** Controleer het paneel en zijn Ondersteuningsrapport en gebruik daarna Opnieuw proberen in de reparatie om de huidige toestand opnieuw te controleren. Verwijder de app niet, wis geen appgegevens en reset het paneel niet om het bericht te wissen.

<a id="installer-failure-update"></a>

## Installatiefout: update

**Wat het betekent:** Home Assistant kon niet bevestigen dat de update is voltooid. De paneelapp kan al geïnstalleerd zijn terwijl de update van zijn browserengine nog niet is afgerond.

**Waarom dit gebeurt:** De app-update of de browserengine-update mislukte of kon niet worden geverifieerd. De reparatie bewaart het rapport voor de volledige poging.

**Hoe je dit oplost:** Lees het Ondersteuningsrapport, herstel de gemelde verbindings- of installatievereiste en kies daarna **Opnieuw proberen**. De procedure gaat verder met alleen de browserengine-update, zonder de app opnieuw te installeren, als alleen die fase nog niet is afgerond en Panel Assistant bevestigt dat de gevraagde appversie is geïnstalleerd. Gebruik **Updates toestaan** eerst als dit wordt aangeboden om Home Assistant op het paneel goed te keuren. Zie de [WebView-handleiding](/nl/hardware/guides/update-the-webview/) als de browserengine niet kan worden bijgewerkt.

<a id="installer-failure-retry-hold"></a>

## Installatiefout: opnieuw proberen gepauzeerd

**Wat het betekent:** De nieuwe poging is gepauzeerd en heeft geen toestemming om door te gaan.

**Waarom dit gebeurt:** Een veiligheidscontrole of onverwachte fout bij opnieuw proberen heeft deze poging gestopt. Het opgeslagen rapport legt vast wat is waargenomen; een pauze geeft geen toestemming voor herinstallatie.

**Hoe je dit oplost:** Lees de gemelde fout bij opnieuw proberen en het Ondersteuningsrapport, controleer of het bedoelde paneel en de release nog overeenkomen en gebruik daarna Opnieuw proberen nadat de oorzaak is opgelost. De fout wissen verwijdert alleen de reparatie en het opgeslagen rapport.

<a id="panel-address-unreachable"></a>

## Paneeladres onbereikbaar

**Wat het betekent:** Bediening blijft beschikbaar via de liveverbinding, maar HTTP-bewerkingen hebben geen geverifieerd bereikbaar adres.

**Waarom dit gebeurt:** Het opgeslagen adres antwoordde niet meer; automatisch herstel had geen bruikbare kandidaat of kon er geen verifiëren.

**Hoe je dit oplost:** Herstel de netwerk-/HTTP-bereikbaarheid van het paneel of voeg hetzelfde paneel toe op zijn huidige adres; omzeil de identiteitscontrole niet.

<a id="panel-address-unverified"></a>

## Paneeladres niet geverifieerd

**Wat het betekent:** Bediening blijft beschikbaar via de liveverbinding, maar HTTP-bewerkingen hebben geen geverifieerd bereikbaar adres.

**Waarom dit gebeurt:** Het opgeslagen adres antwoordde niet meer; automatisch herstel had geen bruikbare kandidaat of kon er geen verifiëren.

**Hoe je dit oplost:** Herstel de netwerk-/HTTP-bereikbaarheid van het paneel of voeg hetzelfde paneel toe op zijn huidige adres; omzeil de identiteitscontrole niet.

<a id="panel-identity-mismatch"></a>

## Paneelidentiteit komt niet overeen

**Wat het betekent:** Paneelstatus en bediening worden geweigerd op een eindpunt met een andere identiteit.

**Waarom dit gebeurt:** Een adres antwoordt nu als een andere installatie, of opgeslagen identiteitsbewijs kan niet veilig worden verenigd.

**Hoe je dit oplost:** Controleer het fysieke paneel en het adres; voeg het huidige bekende paneel opnieuw toe als het is verplaatst. Keur nooit een andere identiteit goed alleen omdat die het oude adres gebruikt.

<a id="panel-link-shared"></a>

## Paneelkoppeling gedeeld

**Wat het betekent:** Een opnieuw geïnstalleerd paneel kan niet veilig aan één bestaande configuratie worden toegewezen.

**Waarom dit gebeurt:** Meerdere vermeldingen hebben dezelfde oude apparaatkoppeling vastgelegd; adresbereikbaarheid is op zichzelf niet de fout.

**Hoe je dit oplost:** Behoud actieve zusterpanelen; verwijder alleen ongebruikte vermeldingen of voeg het opnieuw geïnstalleerde paneel apart toe.

<a id="panel-identity-confirmation"></a>

## Paneelidentiteit bevestigen

**Wat het betekent:** Bestaande paneelconfiguraties wachten op je bevestiging nadat de panelen nieuwe apparaatidentiteiten melden.

**Waarom dit gebeurt:** Panel Assistant kon niet automatisch bewijzen dat elke nieuwe identiteit bij zijn vorige configuratie hoort.

**Hoe je dit oplost:** Controleer elke paneelnaam en elk adres in de lijst. Kies alleen Verzenden als elk vermeld paneel bij zijn bestaande configuratie hoort. Het dialoogvenster openen verandert niets.

<a id="installer-failure-adb-authorization"></a>

## Installatiefout: ADB-autorisatie

**Wat het betekent:** De mislukte update kan pas verder als dit paneel Home Assistant toestaat.

**Waarom dit gebeurt:** ADB-vertrouwensgoedkeuring is nog vereist; het rapport van de mislukte update blijft beschikbaar.

**Hoe je dit oplost:** Kies Updates toestaan in de reparatie en Verzenden, vink daarna Altijd toestaan vanaf deze computer aan en tik op Toestaan op het genoemde paneel. Ga terug naar de reparatie en gebruik Opnieuw proberen voor de mislukte update.

<a id="adb-update-authorization"></a>

## ADB-updateautorisatie

**Wat het betekent:** Home Assistant kan ADB niet gebruiken om dit paneel bij te werken totdat het paneel dit toestaat.

**Waarom dit gebeurt:** De updateroute vereist expliciete vertrouwensgoedkeuring op het paneel.

**Hoe je dit oplost:** Open de reparatie en kies Verzenden. Vink daarna op het genoemde paneel Altijd toestaan vanaf deze computer aan en tik op Toestaan. Android kan Home Assistant een computer noemen; de procedure gaat verder na goedkeuring.

<a id="another-home-assistant"></a>

## Een andere Home Assistant

**Wat het betekent:** Het paneel hier toevoegen verandert zijn opgeslagen server of account niet.

**Waarom dit gebeurt:** Het opgeslagen Home Assistant-adres van het paneel wijst naar een andere server dan deze.

**Hoe je dit oplost:** Als je wilt dat dit paneel hier verbinding maakt, volg dan zijn reparatielink naar Configureren, voer dit Home Assistant-adres in, sla op, verbind opnieuw en meld je aan met het account dat het paneel moet gebruiken. Als het bij de andere server hoort, laat dan de instellingen staan en negeer deze reparatie. Als de zijbalk het niet kan bereiken, open Configureren dan rechtstreeks op het netwerk van het paneel.
