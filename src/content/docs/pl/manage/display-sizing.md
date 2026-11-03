---
title: Skalowanie wyświetlania
description: Dopasowanie rozmiaru pulpitu Home Assistant na panelu do jego wyglądu w przeglądarce na komputerze za pomocą gęstości i rozmiaru tekstu.
sourceCommit: 33ce23572aefb327319703efb255e5129b71ecbf
---

Pulpit Home Assistant zaprojektowany w przeglądarce na komputerze często wyświetla się w niewłaściwym rozmiarze na panelu ściennym z systemem Android: karty są za duże i mają przycięte krawędzie albo są za małe. Na telefonie wygląd zwykle pozostaje w przybliżeniu zgodny z tym na komputerze, ale na panelach często tak nie jest, ponieważ producenci dostarczają je z gęstością systemową i skalą czcionki słabo dopasowanymi do fizycznego wyświetlacza. Aplikacja panelu udostępnia ci dwa ustawienia, **Gęstość logiczna (dpi)** i **Rozmiar tekstu**, dostępne po przejściu do zakładki **Instalacja**, a następnie do karty **Rozmiar wyświetlacza**, aby ponownie dopasować układ i tekst do wyglądu na komputerze. Zwykle potrzebujesz obu.

:::caution[Funkcja eksperymentalna]
Te ustawienia działają, ale odpowiednie wartości dla poszczególnych paneli nie zostały jeszcze ustalone. Traktuj gęstość i rozmiar tekstu jako coś, z czym możesz eksperymentować, a nie jako gotową funkcję. Chętnie przyjmiemy informacje o wartościach, które dobrze sprawdzają się na danym panelu.
:::

## Jak korzystać

Karta **Rozmiar wyświetlacza** na zakładce **Instalacja** panelu ustawia niestandardową gęstość logiczną i rozmiar tekstu, stosuje je na bieżąco lub przywraca fabryczną gęstość bazową systemu Android. Oba ustawienia są zachowywane po ponownym uruchomieniu, ponieważ są ustawieniami systemu Android.

:::note
Wymaga to zatwierdzonego sposobu uzyskania dostępu z podwyższonymi uprawnieniami: zwykle jest to `su` dostawcy lub [narzędzie pomocnicze roota](https://github.com/panel-assistant/android/blob/main/helper/README.md). Zgodny panel bez roota, na którym zatwierdzono już opcjonalny rozszerzony dostęp, również może wprowadzić dokładnie te zmiany wyświetlania. Jeśli żaden obsługiwany sposób dostępu nie jest gotowy do użycia, karta pozostaje widoczna, ale zablokowana.
:::

Aby dopasować ustawienia, otwórz ten sam pulpit w przeglądarce na komputerze jako punkt odniesienia. Zmniejszaj gęstość, aż układ będzie taki sam (zmieści się więcej kart), a następnie delikatnie dostosuj rozmiar tekstu, aż tekst też będzie pasował. Odpowiednie wartości zależą zarówno od instalacji, jak i od modelu: od rozdzielczości panelu, odległości, w jakiej stoją ludzie, oraz sposobu zaprojektowania pulpitu.

Niektóre obsługiwane modele mają zalecaną gęstość, a większość z nich także zalecany rozmiar tekstu. Gdy Panel Assistant konfiguruje taki panel bez dostępu z podwyższonymi uprawnieniami, stosuje te wartości jednorazowo przez swoje połączenie ADB, a usunięcie aplikacji za pomocą Panel Assistant przywraca poprzednie wartości.

## Dwa ustawienia

| Ustawienie                 | Co zmienia                                                                                                                                                                                                                                           | Mechanizm                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Gęstość logiczna (dpi)** | Cały układ. Efektywny obszar widoku w dp wynosi `physical px ÷ (density / 160)`. Przy mniejszej gęstości mieści się więcej treści, a obszar widoku zbliża się do szerszego obszaru widoku na komputerze; przy większej gęstości elementy są większe. | `wm density <n>`                     |
| **Rozmiar tekstu**         | Tekst na pulpicie. Systemowa skala czcionki w systemie Android jest przeliczana na `textZoom` w WebView (`textZoom = scale × 100`).                                                                                                                  | `settings put system font_scale <f>` |

Wynik polecenia `wm density` w systemie Android określa fabryczną wartość bazową jako `Physical density`. Ta etykieta jest myląca: to gęstość, której Android używa do układu po usunięciu nadpisania, a nie pomiar liczby pikseli na cal wyświetlacza. Aplikacja na panelu podaje ją jako **fabryczną wartość bazową**, a fizyczne PPI pokazuje tylko dla profili sprzętowych, których wymiary ekranu zostały niezależnie sprawdzone.

Zmiana samej gęstości skaluje układ, ale tekst może nadal mieć niewłaściwy rozmiar w porównaniu z komputerem; skala czcionki koryguje rozmiar tekstu. Wspólne dostosowanie obu ustawień pozwala dopasować wygląd na panelu do przeglądarki, w której zaprojektowano pulpit.
