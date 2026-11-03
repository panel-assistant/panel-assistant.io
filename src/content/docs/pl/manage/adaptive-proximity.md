---
title: Adaptacyjne wykrywanie zbliżenia i wybudzanie machnięciem
description: Jak panel uczy się charakterystyki swojego czujnika zbliżeniowego, co zgłasza do Home Assistant i jak machnięcie wybudza ekran.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Czujniki zbliżeniowe w panelach ściennych z systemem Android nie mają jednej wspólnej, użytecznej skali. Niektóre zgłaszają odległość, inne tylko dwie wartości, biegunowość może być odwrócona, a odczyty w stanie bezczynności mogą wykazywać dryft zależny od egzemplarza i wersji oprogramowania układowego. Aplikacja panelu korzysta ze skalibrowanego modelu aktywnego profilu czujnika lub z modelu zapisanego przez ciebie podczas konfiguracji z przewodnikiem, aby interpretować poziom bazowy, wartość odniesienia dla bliskości i biegunowość czujnika.

![Konfiguracja czujnika zbliżeniowego panelu z przewodnikiem, w kroku 3 z 7, z prośbą o podejście do panelu w zwykły sposób podczas odliczania](/screenshots/proximity-setup-screen-480.gif)

## Konfiguracja z przewodnikiem

Otwórz **Konfiguracja**, a następnie **Obecność i wybudzanie**, aby sprawdzić, czy aktywny profil czujnika ma model nadający się do użycia. Jeśli konfiguracja jest dostępna, uruchom tam konfigurację czujnika zbliżeniowego z przewodnikiem i postępuj zgodnie z instrukcjami na ekranie samego panelu. Podczas konfiguracji mierzony jest sygnał przy braku obiektów w pobliżu oraz celowe ruchy dłoni; sprawdź wynik i zapisz go na panelu.

Opcja **Przywróć wartości domyślne profilu** zastępuje zapisaną przez ciebie kalibrację wartościami domyślnymi profilu czujnika, o ile są dostępne. Czujnik bez modelu nadającego się do użycia wymaga konfiguracji z przewodnikiem, zanim wybudzanie zbliżeniem będzie gotowe do działania. Wybudzanie dotykiem pozostaje dostępne na panelach ze zweryfikowaną ścieżką wybudzania dotykiem.

## Encje w Home Assistant

Gdy wyuczony model jest wiarygodny, a aktywny profil sprzętowy udostępnia źródło danych o zbliżeniu nadające się do użycia, urządzenie panelu w Home Assistant otrzymuje:

- `binary_sensor.<panel>_proximity`, wyuczony stan obecności blisko lub daleko; oraz
- `sensor.<panel>_proximity_level`, znormalizowaną wartość od 0 (daleko) do 100 (blisko), na tej samej skali dla każdego panelu.

Obie encje pozostają niedostępne, dopóki brakuje wystarczających danych lub czujnik nie działa prawidłowo. Panel nie zgłasza pozornie wiarygodnej wartości z modelu, któremu nie ufa. Czujnik zgłaszający tylko dwie wartości nadal może dostarczać informacje o obecności i obsługiwać gesty wybudzania, a poziom jest zgłaszany tylko wtedy, gdy sygnał rzeczywiście pozwala go określić.

## Wybudzanie machnięciem

**Wybudzanie machnięciem** wykorzystuje wzorzec zbliżenia dłoni lub machnięcia zweryfikowany przez profil czujnika albo podczas konfiguracji z przewodnikiem. Wzorzec z jedną dłonią wyzwala wybudzanie, gdy dłoń się zbliża; wzorzec podwójnego machnięcia sprawdza parę ruchów przed wybudzeniem. Konfiguracja i krótkotrwałe wahania sygnału w stanie bezczynności nie generują żądań wybudzenia.

Ta funkcja wymaga działającego źródła danych o zbliżeniu i wyuczonego modelu gotowego do działania. Źródłem może być zwykły czujnik systemu Android lub ścieżka wybrana przez profil sprzętowy. Interfejs internetowy panelu i diagnostyka pokazują faktycznie używaną ścieżkę oraz to, czy jest gotowa do działania; samo zadeklarowanie czujnika w profilu nie sprawia, że staje się on dostępny.
