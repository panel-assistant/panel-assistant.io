---
title: Wyścig
description: Dwa identyczne panele ścienne, ten sam pulpit i te same dotknięcia w tej samej chwili. Jeden używa aplikacji Home Assistant Companion w fabrycznej konfiguracji panelu, drugi Panel Assistant. Pomiary, filmy i dlaczego opóźnienie liczy się bardziej niż stoper.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Dwa panele Sonoff NSPanel Pro 86 obok siebie na tym samym Home Assistant, każdy wyświetlający identyczną kopię tego samego pulpitu. Skrypt dotyka obu ekranów w tej samej chwili, strona po stronie, a zegar pod każdym panelem zatrzymuje się, gdy ekran odpowie. Lewy panel używa aplikacji Home Assistant Companion na silniku internetowym dostarczonym z firmware panelu. Prawy używa Panel Assistant na silniku, który instaluje dla siebie. Następnie panele zamieniają się rolami i wyścig jest powtarzany, aby własna szybkość żadnego panelu nie wypaczyła wyniku.

## Renderowanie: około dwa razy szybciej

![Film A: pierwszy panel z aplikacją Companion, drugi z Panel Assistant, ścigające się w tej samej chwili](/screenshots/drag-race-film-a.gif)

Siedem dotknięć: trzy zmiany strony, powrót do strony głównej i trzy dotknięcia karty światła. Po trzy przebiegi w każdą stronę; filmy pokazują przebieg medianowy, a między dwoma filmami panele zamieniają się rolami.

|                                             | Aplikacja Companion, silnik firmware | Panel Assistant, własny silnik |
| ------------------------------------------- | ------------------------------------ | ------------------------------ |
| Pierwszy układ, mediana trzech przebiegów   | 11.7 s                               | 6.4 s                          |
| Drugi układ, panele zamienione              | 14.3 s                               | 6.1 s                          |
| Procesor używany przez procesy rysujące     | 1.3 do 1.5 rdzenia                   | 0.4 do 0.6 rdzenia             |
| Liczba klatek strony pulpitu w bezczynności | 5 klatek na sekundę                  | 59 klatek na sekundę           |
| Encje śledzone przez stronę                 | 4,118                                | 54                             |

Strona pulpitu w Panel Assistant śledzi tylko wyświetlane encje. W aplikacji Companion odbiera każdą zmianę stanu w domu, tysiące encji, i spędza większość czasu na ich przetwarzaniu. Dlatego ta sama strona rysuje pięć klatek na sekundę na jednym panelu i sześćdziesiąt na drugim, a procesy rysujące zużywają dwa i pół raza więcej procesora.

![Film B: panele zamienione, drugi z aplikacją Companion, pierwszy z Panel Assistant](/screenshots/drag-race-film-b.gif)

## Opóźnienie: prawdziwy problem

Dwukrotnie szybszy wynik na stoperze to umiarkowana poprawa. Nie to zauważasz na ścianie. Zauważasz moment, w którym naciskasz przycisk i nic się nie dzieje.

Naciskasz. Oczekujesz zmiany. Po ponad pół sekundy bez reakcji uznajesz, że nie trafiłeś, i naciskasz ponownie. Teraz dochodzą oba naciśnięcia: światło włącza się i zaraz gaśnie albo żądana strona pojawia się i zostaje zastąpiona stroną z drugiego naciśnięcia. Wszystko zrobiłeś dobrze i otrzymałeś przeciwieństwo oczekiwań. Taki panel nie jest powolny; jest bezużyteczny i po tygodniu nikt w domu mu nie ufa.

![Podwójne naciśnięcie: to samo dotknięcie tego samego światła na obu panelach, z ludzką zasadą ponownego dotknięcia po sekundzie bez reakcji](/screenshots/drag-race-double-press.gif)

Te same dwa panele, ta sama karta światła, światło wyłączone na obu. Palec dotyka światła i stosuje regułę używaną przez każdego: jeśli po sekundzie nic się nie zmieniło, dotknij ponownie, maksymalnie trzy razy.

|                                                    | Aplikacja Companion, silnik firmware                                | Panel Assistant, własny silnik              |
| -------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| Światło widocznie włączone po pierwszym dotknięciu | 15.2 s, po trzech dotknięciach                                      | 0.3 s, po jednym dotknięciu                 |
| Dwa pozostałe ujęcia                               | 7 s po jednym dotknięciu; nadal ładuje stronę, trzy dotknięcia, nic | 0.3 s po jednym dotknięciu, za każdym razem |

Piętnaście sekund to nie powolny panel. To panel, z którego zrezygnowałeś i odszedłeś, a światło zapala się za tobą. Strona w aplikacji Companion nie była zepsuta: przetwarzała strumień stanów całego domu na czterordzeniowym panelu, a dotknięcie czekało w kolejce za tą pracą. Strona Panel Assistant miała do obsłużenia tylko własne encje, więc dotknięcie zostało obsłużone od razu.

## Jak to zmierzono

- Dwa panele Sonoff NSPanel Pro 86 (czterordzeniowy Rockchip PX30, ekrany 480 na 480) na jednym produkcyjnym Home Assistant z około 4,100 encjami i około 20 zmianami stanu na sekundę.
- Dwie kopie jednego pulpitu, identyczne poza światłem za jedną kartą, aby panele nigdy nie konkurowały o jedną encję.
- Aplikacja Companion 2026.6.5 na własnym silniku firmware, Chromium 107, którego nadal używa większość zainstalowanych paneli. Panel Assistant na Chromium 138, zgodnym silniku użytym w tych przebiegach.
- Dotknięcia wstrzykiwane jako surowe zdarzenia ekranu w tej samej chwili na obu panelach. Każdy krok rejestrowany przez sam panel; zegar biegnie od dotknięcia do chwili, gdy ekran przestanie się zmieniać. Krok nadal zmieniający się na końcu klipu unieważnia przebieg.
- Trzy przebiegi w każdą stronę, filmowany przebieg medianowy. Kartę muzyki pobierającą teksty z internetu usunięto z wyścigu, ponieważ żadna aplikacja panelu nie przyspieszy zewnętrznej usługi. Pominięto też stronę kamery na żywo, ponieważ jej czas to zestawianie strumienia, a nie praca pulpitu.

Te same liczby są dostępne na żywo na każdym panelu Panel Assistant w sekcji **Wydajność** jego interfejsu internetowego; [Wydajność](/pl/manage/performance/) wyjaśnia, jak je odczytywać na własnym sprzęcie.
