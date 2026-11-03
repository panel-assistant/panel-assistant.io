---
title: Jasność adaptacyjna
description: Pozwól panelowi nauczyć się warunków oświetlenia w pomieszczeniu i samodzielnie ustawiać jasność ekranu, bez automatyzacji w Home Assistant.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Jasność adaptacyjna to opcjonalny regulator działający na panelu, który uczy się typowego wzorca oświetlenia otoczenia i dostosowuje jasność ekranu bez automatyzacji w Home Assistant. Domyślnie jest wyłączony, a zwykłe sterowanie jasnością ręcznie lub przez Home Assistant jest dostępne niezależnie od tego, czy regulator jest włączony, czy wyłączony.

![Zakładka Konfiguracja w interfejsie internetowym panelu, z kartą Wyświetlacz pokazującą Źródło światła otoczenia, Automatyczną jasność, Poziom minimalny, Czułość oraz wykres uczenia się dobowego wzorca oświetlenia otoczenia](/screenshots/ui-configure-dark.png)

## Wybierz źródło danych o oświetleniu

Otwórz **Konfiguracja**, następnie **Wyświetlacz** i wybierz **Źródło światła otoczenia**:

- Pozostaw to pole puste, aby używać własnego czujnika światła panelu, gdy zarówno aktywny profil sprzętowy, jak i bieżące sprawdzenie możliwości panelu udostępniają taki czujnik.
- Wybierz jedną encję natężenia oświetlenia z Home Assistant, gdy panel nie ma odpowiedniego własnego czujnika lub gdy czujnik w innym miejscu pomieszczenia lepiej odzwierciedla oświetlenie rzeczywiście widziane przez ludzi.

Dane ze źródła w Home Assistant są odczytywane przez pojedynczą subskrypcję tej jednej encji, a nie przez pełny strumień stanów. Jeśli żadne ze źródeł nie jest dostępne, aplikacja panelu pozostawia sterowanie adaptacyjne niedostępne, zamiast zgadywać na podstawie pory dnia.

Gdy źródłem jest encja natężenia oświetlenia z Home Assistant, panel może wstępnie zasilić wyuczony wzorzec istniejącą historią tej encji z maksymalnie siedmiu dni. Daje to automatycznej jasności przydatny punkt wyjścia, bez czekania na zgromadzenie nowych odczytów. Wymaga to zapisywania historii encji oraz dostępności usługi historii Home Assistant; jeśli nie zostanie zwrócona żadna użyteczna historia, uczenie rozpocznie się po prostu od nowych odczytów.

## Włącz i dostosuj

Włącz opcję **Automatyczna jasność** na tej samej karcie Wyświetlacz. Regulator przechowuje na panelu historię oświetlenia otoczenia z maksymalnie siedmiu dni i uczy się typowego wzorca dla każdej pory dnia. Krótkotrwały wzrost ponad ten wzorzec, na przykład po włączeniu światła w pomieszczeniu, może podnieść proponowany poziom powyżej poziomu bazowego.

**Poziom minimalny** określa najniższy poziom proponowany przez sterowanie automatyczne i przeskalowuje wyuczony zakres między wartościami **Poziom minimalny** i **Poziom maksymalny**. Można go ustawić od 4% do 99%. Dolna granica 4% odpowiada minimalnemu poziomowi samego podświetlenia (nigdy nie gaśnie), więc niższa wartość zmieniałaby tylko ustawienie, bez żadnej zmiany na ekranie. Nie ogranicza to jasności ustawianej ręcznie, którą nadal można ustawić niżej.

**Poziom maksymalny** wyznacza górną granicę automatycznej jasności w zakresie od 5% do 100%, powyżej wybranego minimum. Nie ogranicza jasności ustawianej ręcznie.

**Czułość** określa, w jakim stopniu różnica względem wyuczonego wzorca wpływa na jasność ekranu, gdy regulator uzna tę różnicę za rzeczywistą. Przy 0% ignoruje różnicę i korzysta wyłącznie z wyuczonego wzorca. Niższe wartości zapewniają stabilniejszą reakcję, a domyślne 50% pozostawia taki sam zakres regulacji w obu kierunkach. Nie jest to bezpośrednie sterowanie podążające za oświetleniem: krótkotrwałe rozjaśnienie wywołuje reakcję dopiero wtedy, gdy utrzymuje się wystarczająco długo lub jest wystarczająco gwałtowne, by zostać uwzględnione, a dopóki dobowy wzorzec jest jeszcze w trakcie uczenia, ekran podąża za zmierzonym oświetleniem niezależnie od wartości tego ustawienia.

Siedmiodniowy wykres pokazuje podgląd zaobserwowanego zakresu, wyuczonego poziomu bazowego i proponowanego poziomu przed uruchomieniem regulatora lub podczas jego działania. Niezapisane zmiany ustawień Poziom minimalny, Poziom maksymalny i Czułość są widoczne w podglądzie bez nadpisywania zapisanej historii.

Historia jest przypisana do wybranego źródła oraz ogólnego kontekstu pomieszczenia i czasu, określanego na podstawie lokalizacji i strefy czasowej w Home Assistant. Istotna zmiana lokalizacji, strefy czasowej lub źródła rozpoczyna osobną historię, zamiast po cichu stosować to, czego regulator nauczył się w innym kontekście.

## Ręczne zmiany i przywracanie

Ręczna zmiana jasności zapisuje tymczasową preferencję na cztery godziny, aby regulator nie zaczął od razu działać wbrew osobie, która dokonała zmiany. Automatyczne zmiany początkowo mają 20% wpływu i odzyskują pełną kontrolę w miarę płynnego wygaszania preferencji przez cztery godziny. Wybierz **Wróć do trybu automatycznego**, aby natychmiast zakończyć obowiązywanie preferencji, zamiast czekać na jej wygaśnięcie.

Wybierz **Wyczyść wyuczoną historię** po przeniesieniu panelu, zmianie jego źródła danych o oświetleniu lub gdy ostatni tydzień nie odzwierciedla już warunków w pomieszczeniu. Po potwierdzeniu usuwa to siedem dni historii oświetlenia otoczenia dla bieżącego źródła i kontekstu oraz rozpoczyna uczenie od nowa. Nie zmienia wybranego źródła ani ustawienia Automatyczna jasność.

Jasność adaptacyjna korzysta ze standardowego ustawienia jasności ekranu w systemie Android i nie wymaga uprawnień root. Odczyt czujnika światła danego panelu nadal może zależeć od sposobu dostępu do tego czujnika na danym sprzęcie; decydują o tym aktywny profil i bieżące sprawdzenie możliwości.

## Sterowanie przez Home Assistant

Jeśli panel udostępnia encję `switch.<panel>_auto_brightness`, włącza ona i wyłącza ten sam regulator. Jasność ekranu pozostaje obsługiwana przez `light.<panel>_screen`, więc zmiana jasności z Home Assistant tworzy taką samą tymczasową preferencję jak zmiana na panelu. Użyj **Wróć do trybu automatycznego** na stronie Konfiguracja, aby od razu wrócić do wyuczonego poziomu.
