---
title: Shelly Wall Display X1i
description: Відомості про обладнання Shelly Wall Display X1i — 4-дюймової панелі RK3326-S з Android 11, кодова назва Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 in, 720 × 720
support: Не перевірено
root: Не встановлено для цієї моделі
webview: 'Не встановлено (гілка WallDisplayV2 не містить OTA-пакета WebView)'
released: '2026-07 (прибл.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, вигляд спереду
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, сріблясте оздоблення, вигляд спереду
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, вигляд ззаду з етикеткою моделі SAWD-6A1XX10EU0
photoCredit: 'Фото: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display X1i
  order: 3
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Жодного пристрою цієї моделі не перевірено.** На [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/) наведено джерела, механізм OTA-оновлень прошивки, модель доступу й примітки безпеки, спільні для всієї лінійки.
:::

Wall Display X1i, кодова назва прошивки **Cally**, — це панель 4 in 720×720 на Rockchip RK3326-S (Cortex-A35), Android 11. Вона належить до сучасної гілки OTA **WallDisplayV2** (arm64-v8a), разом із [X2i](/uk/hardware/panels/shelly/wall-display-x2i/), [XL](/uk/hardware/panels/shelly/wall-display-xl/), Maverick і Dayna, та має доступ до вбудованого AppStore.

## Початковий доступ до налагодження

**Мережевий ADB на TCP-порту 5555 без комп’ютера: не встановлено для цієї моделі.** Початкове налагодження через USB і розблокування меню виробника тут також не перевірені. [Процедуру X2i](/uk/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) підтверджено лише на X2i; спільна прошивка не доводить, що вона працює тут. Попросіть Shelly надати процедуру для вашої моделі та прошивки. Використовуйте [USB-інсталятор](/uk/install/install-over-usb/) лише після появи налагодження через USB і USB-з’єднання для даних. Сама збірка з можливістю root не вмикає налагодження.

## Також продається як

Shelly Wall Display X1i, кодова назва прошивки Cally.

|         |                                                                                                                                                                                                                                                                                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                                                               |
| Екран   | **720×720 квадратний**, 4 in                                                                                                                                                                                                                                                                                                                                                    |
| Android | 11                                                                                                                                                                                                                                                                                                                                                                              |
| ABI     | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                       |
| Датчики | Навколишнє освітлення й наближення задокументовані; немає датчика температури або вологості; доступ через API Android не перевірений                                                                                                                                                                                                                                            |
| Реле    | Змінна основа: стандартно 1 вихід, додатково основа з 2 виходами                                                                                                                                                                                                                                                                                                                |
| Root    | Не встановлено для цієї моделі; сучасна OTA-прошивка не оголошує тип збірки. На [Wall Display X2i](/uk/hardware/panels/shelly/wall-display-x2i/), перевіреному із заводською прошивкою 2.5.4, параметри розробника й налагодження USB розблоковуються із застосунку «Налаштування», після чого adb підключається, усе ще без root; чи стосується це цієї моделі, не перевірено. |
| Випуск  | Приблизно липень 2026; Shelly анонсувала X1i 15 липня 2026 ([висвітлення запуску, TechBuzz Ireland, липень 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                                                      |

Починаючи з Panel Assistant 1.0, X1i використовує спільний профіль Shelly, який враховує виявлені на [X2i](/uk/hardware/panels/shelly/wall-display-x2i/) властивості цієї прошивки: повне вимкнення екрана без root, а також «Назад» і «Додому» без списку недавніх. Власні датчики перевіряються на панелі під час запуску Panel Assistant. Жодного X1i ще не підтверджено, тому повідомлення власника вітається; див. [Що X2i означає для решти лінійки](/uk/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Повне пояснення моделі доступу, кінцеві точки OTA-оновлень (гілка `WallDisplayV2`) та історію версій прошивки див. на [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/).

## Джерело

[База знань Shelly Wall Display X1i](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
