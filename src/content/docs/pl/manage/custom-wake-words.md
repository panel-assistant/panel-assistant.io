---
title: Własne hasła wybudzania
description: Trenowanie własnego hasła w microWakeWord, importowanie na panelu, wdrażanie na kilku panelach i dostrajanie.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Cztery dołączone hasła wybudzania są modelami [microWakeWord](https://github.com/kahrendt/microWakeWord), a [asystent głosowy](/pl/manage/voice-assistant/) panelu może importować dowolny model trenowany w ten sam sposób. Ta strona opisuje trenowanie modelu, format manifestu, importowanie na panel i testowanie po instalacji.

## Trenowanie modelu

microWakeWord to osobny projekt open source Kevina Ahrendta na licencji Apache-2.0; jego [notatnik treningowy](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb) prowadzi przez cały proces i jest dokumentacją rozstrzygającą. W zarysie:

1. **Wybierz frazę i wygeneruj syntetyczne próbki.** Ustawiasz docelową frazę, a notatnik używa [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator) do syntezy tysięcy wypowiedzianych przykładów różnymi głosami.
2. **Wzbogać próbki.** Notatnik nakłada efekty na syntetyczny dźwięk (korekcję częstotliwości, zniekształcenia, zmianę wysokości, splot z odpowiedzią impulsową pomieszczenia i domieszanie szumu tła oraz muzyki z publicznych zbiorów dźwięku), aby model nie nauczył się rozpoznawać tylko jednego czystego nagrania.
3. **Trenuj.** Model trenuje się przez konfigurowalną liczbę kroków, a następnie jest przekształcany z modelu niestrumieniowego do postaci strumieniowej rzeczywiście uruchamianej na panelu. Sam notatnik podaje, że trening w Google Colab jest możliwy, ale zauważalnie wolniejszy niż na lokalnym GPU.
4. **Eksportuj.** Wytrenowany model jest eksportowany jako skwantowany, strumieniowy plik TensorFlow Lite. To plik `.tflite`, który zaimportujesz.

Nie potrzebujesz tego, jeśli gotowy model już obejmuje twoją frazę: repozytorium [`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) (także Apache-2.0) publikuje wytrenowane modele według nazw plików w `models/v2/`, a każdy z nich importuje się dokładnie tak jak model trenowany samodzielnie.

## Pisanie manifestu

Każde hasło wymaga małego manifestu JSON obok pliku `.tflite`, w formacie wersji 2 microWakeWord. Tego samego formatu używają komponent ESPHome `micro_wake_word` i repozytorium `esphome/micro-wake-word-models`, więc manifest z dowolnego z tych źródeł działa bez zmian. Wymagane pola:

- `"type"`: zawsze `"micro"`.
- `"model"`: nazwa pliku `.tflite` (bez ukośników).
- `"micro"`: obiekt z `probability_cutoff` (od 0 do 1), `feature_step_size` (dodatnia liczba całkowita; obecne modele używają `10`) i `sliding_window_size` (dodatnia liczba całkowita).

Pola opcjonalne: `wake_word` (fraza wyświetlana w interfejsie; przy pominięciu domyślnie identyfikator hasła), `author`, `website`, `trained_languages`, `version` i `micro.tensor_arena_size`.

Oto dołączony manifest Hey Jarvis jako przykład struktury:

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

### Wybór `probability_cutoff` i `sliding_window_size`

Oba ustawienia stanowią kompromis między fałszywymi a pominiętymi wybudzeniami i żadne nie ma jednej właściwej wartości dla każdego modelu:

- **`probability_cutoff`** to próg pewności, który model musi przekroczyć, aby zgłosić wykrycie. Podniesienie go zmniejsza liczbę wybudzeń po dźwiękach tylko podobnych do frazy, ale zwiększa ryzyko pominięcia rzeczywistego, cichszego lub swobodniejszego wypowiedzenia. Obniżenie daje odwrotny kompromis. Dołączone modele mają wartości około `0.97`; sam notatnik treningowy zaleca dostosowanie progu po sprawdzeniu rzeczywistego działania modelu zamiast zakładania, że jedna liczba będzie pasować.
- **`sliding_window_size`** określa, ile kolejnych okien wykrywania jest uśrednianych, zanim panel zdecyduje o wybudzeniu. Mniejsze okno reaguje szybciej, ale jest bardziej podatne na pojedynczy skok szumu; większe wygładza go kosztem nieco wolniejszego wybudzenia.

Zacznij od wartości sugerowanych przez dokumentację modelu lub przebieg notatnika, zaimportuj go i dostrajaj na podstawie dziennika prawie udanych wykryć panelu opisanego w [Testowaniu i dostrajaniu](#testowanie-i-dostrajanie).

## Importowanie modelu

### Ze strony Konfiguracja panelu

Na karcie **Głos** selektor haseł wybudzania ma kontrolkę **importu**. Wybierz manifest `.json` modelu i jego plik `.tflite`, a następnie naciśnij **Importuj**. Panel sprawdza model własnym silnikiem haseł przed zaakceptowaniem; jeśli go odrzuci, nic nie jest instalowane, a wcześniej zaimportowany model o tej samej nazwie pozostaje na miejscu. Limit manifestu to 16 KB, a modelu 2 MB.

Identyfikator hasła pochodzi od nazwy pliku `.tflite`, zamienionej na małe litery i ograniczonej do liter, cyfr i podkreśleń (musi zaczynać się literą). Nie może ponownie używać identyfikatora dołączonego hasła, a import modelu pod używaną już nazwą zastępuje wcześniejszy model.

Import udostępnia hasło, ale go nie aktywuje. Aby używać go na panelu, zaznacz je w **Słowa budzące** i wybierz potok w **Potoki słów budzących**. Od tej chwili pojawia się też we własnym selektorze haseł Home Assistant dla tego panelu.

### Na kilku panelach

Miejsce otwarcia Konfiguracja określa, czy import jest współdzielony:

- **Bezpośrednio na stronie Konfiguracja samego panelu:** zaimportowany model pozostaje na tym panelu. Nie jest udostępniany innym panelom.
- **W pasku bocznym Panel Assistant w Home Assistant:** po zweryfikowaniu i zainstalowaniu modelu przez wybrany panel Panel Assistant zachowuje wspólną kopię i instaluje ją na każdym innym panelu z mikrofonem, w tym na panelach łączących się później.

Import nowszego modelu z tym samym identyfikatorem przez pasek boczny zastępuje wspólną kopię i może zaktualizować panele mające poprzednio współdzieloną kopię. Inny model zaimportowany niezależnie pod tym identyfikatorem na innym panelu zostaje zachowany; Panel Assistant zgłasza [naprawę hasła wybudzania](/pl/home-assistant/repairs/#wake-word-kept) zamiast go nadpisywać. Panel odrzucający współdzielony model także otrzymuje [naprawę z przyczyną](/pl/home-assistant/repairs/#wake-word-refused).

Udostępnianie umożliwia wybranie modelu na każdym panelu; aby go aktywować, wybierz hasło i potok osobno na każdym z nich.

## Testowanie i dostrajanie

Użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant i otwórz **Logi** (na przykład `http://<panel>:8888/logs` przy domyślnym porcie), następnie wypowiedz hasło i obserwuj dziennik. Hasło usłyszane, ale niewystarczające do wyzwolenia, pojawia się tam jako prawie udane wykrycie, w wierszu takim jak `wake word my_wake_word heard at 0.86, short of its cutoff`, z najwyższym wynikiem osiągniętym w danej próbie. Jeśli wyniki te leżą tuż poniżej `probability_cutoff`, zwykle wystarczy nieco obniżyć próg lub zwiększyć **Czułość budzenia** na karcie Głos; jeśli fraza w ogóle nie pojawia się jako prawie udane wykrycie, sam model jej nie rozpoznaje i bardziej przydatnym następnym krokiem jest ponowny trening z większą liczbą lub bardziej zróżnicowanymi próbkami.
