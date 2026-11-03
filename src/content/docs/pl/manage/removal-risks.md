---
title: Zanim usuniesz ha-paneld
description: Skutki usunięcia ha-paneld z panelu, panele i firmware mogące utracić drogę powrotu do ustawień Androida oraz co najpierw sprawdzić.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>Twój panel:</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant usuwa ha-paneld w jednym kroku opcją panelu **Usuń Panel Assistant z tego panelu**, w sekcji **Konfiguruj** w Home Assistant (Panel Assistant 0.9 nazywa ją Usuń ha-paneld z tego panelu). Na większości paneli to wszystko. Na niektórych usunięcie pozostawia panel bez drogi do Ustawień Androida lub debugowania sieciowego. Wtedy nic nie może ponownie zainstalować na nim aplikacji, także Panel Assistant, dopóki nie użyjesz własnej drogi powrotu producenta. W niektórych firmware wymaga ona zalogowania na konto producenta lub podłączenia komputera przez USB.

W niewydanej jeszcze wersji 1.0.0-rc2 ta opcja nosi nazwę **Remove from this panel**, a pomyślne usunięcie usuwa również panel z Home Assistant; nie ma opcji zachowania jego wpisu. Na stronie urządzenia panelu znajduje się też przycisk **Remove from this panel**. Jego naciśnięcie niczego nie usuwa: otwiera trwałe zgłoszenie naprawy **Remove Panel Assistant from &lt;panel&gt;** w sekcji **Settings → System → Repairs**. Przeczytaj zawarte w nim ostrzeżenie, zanim potwierdzisz usunięcie jednym naciśnięciem **Submit**. Jeśli przycisk został naciśnięty przez pomyłkę, zamknij okno dialogowe bez wysyłania i pozostaw zgłoszenie naprawy bez potwierdzenia.

Usunięcie wpisu panelu w Home Assistant pozostawia ha-paneld zainstalowane. Przed usunięciem wpisu użyj opisanej powyżej opcji usuwania, aby usunąć aplikację.

Jeśli wpis został już usunięty, dodaj panel ponownie w Home Assistant, a następnie użyj opisanej powyżej opcji usuwania.

Przed potwierdzeniem przeczytaj sekcję dla swojego panelu.

## Co robi usuwanie

1. ha-paneld oddaje ekran główny własnemu programowi uruchamiającemu panelu i ponownie włącza wyłączone przez siebie aplikacje producenta.
2. Panel Assistant sprawdza na panelu, czy inny program uruchamiający rzeczywiście obsługuje ekran główny. Jeśli nie, zatrzymuje się i niczego nie usuwa.
3. Panel Assistant odinstalowuje ha-paneld przez swoje połączenie zarządzania. Ustawienia ha-paneld na panelu są usuwane.
4. W 1.0.0-rc1, jeśli przed wysłaniem zaznaczono **Usuń też ten panel z Home Assistant**, Home Assistant także zapomina panel. Pozostaw tę opcję wyłączoną, aby zachować encje i historię. W niewydanej wersji 1.0.0-rc2 pomyślne usunięcie zawsze usuwa wpis.

Jeśli usuwanie zatrzyma się w trakcie, uruchom je ponownie: podejmie pracę w miejscu zatrzymania.

## Ponowna instalacja na tym panelu

Najpierw przywróć debugowanie, korzystając z poniższej sekcji dotyczącej twojego panelu oraz instrukcji [Przygotuj panel](/pl/install/prepare-a-panel/#1-opcje-programisty-i-debugowanie-są-włączone). Następnie postępuj zgodnie z instrukcją [Dodaj panel](/pl/install/installing-ha-paneld/), aby ponownie zainstalować Panel Assistant. Usunięcie kasuje ustawienia aplikacji; ponowna instalacja ich nie przywraca.

## Dlaczego panel może utknąć

Jeśli utrwalanie sieciowego ADB jest włączone i obsługiwane, ha-paneld może przywrócić je po restarcie. Po usunięciu ta pomoc znika, a firmware producenta może wyłączyć debugowanie, także po restarcie.

Ma to znaczenie tylko wtedy, gdy własny ekran główny panelu nie pozwala wejść do Ustawień Androida, gdzie debugowanie włącza się ponownie. Kilka ekranów głównych producentów nie daje tej możliwości.

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

Ekran główny eWeLink nie pozwala wejść do Ustawień Androida, więc wersja firmware decyduje o trudności przywrócenia debugowania.

- **Firmware 4.0.0 i nowsze:** Sonoff dodał pozycję F-Droid do menu panelu, a zainstalowane z niego aplikacje otwierają się z tego menu. Przed usunięciem ha-paneld zainstaluj z F-Droid program uruchamiający aplikacje, który pokazuje Ustawienia Androida wśród aplikacji panelu, aby móc później ponownie włączyć debugowanie.
- **Firmware poniżej 4.0.0:** nie ma sklepu aplikacji ani dostępu do Ustawień Androida z panelu. Jeśli panel jest już powiązany z kontem eWeLink, debugowanie włącza się ponownie z aplikacji eWeLink w telefonie: dotykaj _Identyfikator urządzenia_ w ustawieniach urządzenia panelu aż pojawi się _Tryb programisty_, a następnie włącz tam ADB. Późniejsze powiązanie panelu z kontem może nie działać: na jednym panelu kod parowania pozostawał wyszarzony w oczekiwaniu. Bez powiązanego konta pozostaje uruchomienie odzyskiwania z komputerem podłączonym przez USB: zobacz [Uzyskiwanie dostępu adb i root](/pl/hardware/panels/sonoff/#uzyskiwanie-dostępu-adb-i-root). Jeśli panel jest powiązany z eWeLink, przed usunięciem ha-paneld zaktualizuj go tam do 4.0.0 lub nowszej.

Porównuj numer firmware pokazywany przez aplikację eWeLink i Panel Assistant, na przykład 4.0.12, a nie wewnętrzny `ro.product.version`. Zobacz [osobliwości firmware według wersji](/pl/hardware/panels/sonoff/#osobliwości-firmware-według-wersji).

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

Ekran główny Shelly nie pozwala wejść do Ustawień Androida. Na X2i opcje programisty odblokowuje się z aplikacji Ustawienia Shelly: zobacz [odblokowanie trybu programisty](/pl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode). Na pozostałych modelach Wall Display nie potwierdzono takiej drogi, więc traktuj usunięcie jako nieodwracalne, chyba że wiesz, jak ponownie włączyć debugowanie.

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

Opcje programisty otwierają się z aplikacji Ustawienia panelu (dotknij numeru wersji siedem razy), a debugowanie przez USB działa przez aplikację diagnostyczną: zobacz [Uzyskiwanie dostępu adb i root](/pl/hardware/panels/tuya/tpa10/#uzyskiwanie-dostępu-adb-i-root). Debugowanie sieciowe wymaga ponownego wykonania tego kroku USB, jeśli zostało wyłączone.

</div>

## Inne panele

<div class="removal-make" data-make="other">

Jeśli własny ekran główny panelu potrafi otworzyć Ustawienia Androida, usunięcie pozostawia go w stanie sprzed ha-paneld. Jeśli nie, przed usunięciem ha-paneld upewnij się, że masz inną drogę włączenia debugowania, na przykład program uruchamiający otwierający Ustawienia.

</div>

## Sprawdź przed usunięciem

- **Znajdź wersję firmware.** Panel Assistant pokazuje ją u góry tej strony, gdy kieruje tutaj linkiem. Użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, aby otworzyć stronę ha-paneld (na przykład `http://<panel>:8888` przy domyślnym porcie), która pokazuje ją jako _Firmware_.
- **Znaj drogę powrotu do debugowania** dla twojego panelu i firmware z powyższej sekcji.
- **Zachowaj program uruchamiający otwierający Ustawienia Androida**, jeśli ekran główny producenta nie ma tej możliwości.
- **Nie uruchamiaj ponownie panelu** między usunięciem ha-paneld a czynnościami, do których nadal potrzebujesz debugowania.

<script>
  // Panel Assistant links here with the panel's make, model and firmware
  // (make, model, fw). Each is optional; an unrecognised value is ignored.
  (() => {
    const query = new URLSearchParams(location.search);
    const clean = (value) =>
      value && /^[0-9A-Za-z][0-9A-Za-z ._+-]{0,79}$/.test(value) ? value : null;
    const make = clean(query.get('make'));
    const model = clean(query.get('model'));
    const fw = clean(query.get('fw'));
    const lower = (make || '').toLowerCase();
    const key = ['sonoff', 'shelly', 'tuya'].find((name) => lower.includes(name));
    if (!make && !fw) return;
    const box = document.getElementById('removal-this-panel');
    const name = [make, model].filter(Boolean).join(' ') || 'Nieznany panel';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}, firmware ${fw}` : name;
    let verdict = 'Zobacz poniżej sekcję dotyczącą twojego panelu.';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? 'To firmware ma F-Droid w menu: zainstaluj z niego program uruchamiający aplikacje, zanim usuniesz ha-paneld.'
          : 'To firmware nie pozwala wejść do Ustawień Androida z panelu. Przywrócenie debugowania wymaga aplikacji eWeLink w telefonie z panelem już powiązanym z kontem albo uruchomienia odzyskiwania z komputerem. Jeśli panel jest powiązany, najpierw zaktualizuj go do 4.0.0 lub nowszej.';
    }
    document.getElementById('removal-this-panel-verdict').textContent = verdict;
    box.hidden = false;
    const section = document.querySelector(`.removal-make[data-make="${key || 'other'}"]`);
    if (section) section.classList.add('removal-make-match');
  })();
</script>

<style>
  .removal-this-panel {
    border: 2px solid var(--sl-color-accent);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .removal-make-match {
    border-inline-start: 4px solid var(--sl-color-accent);
    padding-inline-start: 1rem;
  }
</style>
