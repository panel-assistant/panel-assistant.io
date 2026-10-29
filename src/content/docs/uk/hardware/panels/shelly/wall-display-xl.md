---
title: Shelly Wall Display XL
description: Відомості про обладнання Shelly Wall Display XL — 10.1-дюймової панелі RK3566 з Android 11, кодова назва Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 in
support: Не перевірено
root: Не встановлено для цієї моделі
webview: 'Не встановлено (гілка WallDisplayV2 не містить OTA-пакета WebView)'
released: '2025-09 (прибл.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, вигляд спереду
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, прямий вигляд екрана
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, вигляд збоку з глибиною кріплення
photoCredit: 'Фото: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Жодного пристрою цієї моделі не перевірено.** На [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/) наведено джерела, механізм OTA-оновлень прошивки, модель доступу й примітки безпеки, спільні для всієї лінійки.
:::

Wall Display XL, кодова назва прошивки **Blake**, — це панель 10.1 in на Rockchip RK3566 (Cortex-A55), Android 11 — найбільша й найпотужніша модель [сімейства Shelly Wall Display](/uk/hardware/panels/shelly/). Вона належить до сучасної гілки OTA **WallDisplayV2** (arm64-v8a), разом із [X1i](/uk/hardware/panels/shelly/wall-display-x1i/), [X2i](/uk/hardware/panels/shelly/wall-display-x2i/), Maverick і Dayna, та має доступ до вбудованого AppStore.

## Початковий доступ до налагодження

**Мережевий ADB на TCP-порту 5555 без комп’ютера: не встановлено для цієї моделі.** Початкове налагодження через USB і розблокування меню виробника тут також не перевірені. [Процедуру X2i](/uk/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) підтверджено лише на X2i; спільна прошивка не доводить, що вона працює тут. Попросіть Shelly надати процедуру для вашої моделі та прошивки. Використовуйте [USB-інсталятор](/uk/install/install-over-usb/) лише після появи налагодження через USB і USB-з’єднання для даних. Сама збірка з можливістю root не вмикає налагодження.

## Також продається як

Shelly Wall Display XL, кодова назва прошивки Blake.

|         |                                                                                                                                                                                                                                                                                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                                                                 |
| Екран   | 10.1 in                                                                                                                                                                                                                                                                                                                                                                         |
| Android | 11                                                                                                                                                                                                                                                                                                                                                                              |
| ABI     | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                       |
| Датчики | Навколишнє освітлення задокументоване; датчик руху (офіційно, точна технологія не перевірена); доступ через API Android не перевірений                                                                                                                                                                                                                                          |
| Реле    | 1 вихід                                                                                                                                                                                                                                                                                                                                                                         |
| Root    | Не встановлено для цієї моделі; сучасна OTA-прошивка не оголошує тип збірки. На [Wall Display X2i](/uk/hardware/panels/shelly/wall-display-x2i/), перевіреному із заводською прошивкою 2.5.4, параметри розробника й налагодження USB розблоковуються із застосунку «Налаштування», після чого adb підключається, усе ще без root; чи стосується це цієї моделі, не перевірено. |
| Випуск  | Приблизно вересень 2025; Shelly випустила XL у Європі близько 10 вересня 2025 ([висвітлення запуску, Notebookcheck, вересень 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                                                            |

:::caution
Вбудований браузер Home Assistant на XL мав проблеми відображення й компонування з інтерфейсом Home Assistant 2025.12 та попереднім випуском 2026.1 (відстежуються у [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) і `#28746`; сумісність ядра — у [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). Застосунок із системним WebView на тому самому пристрої відображав правильно, що вказує на проблему саме WebView вбудованого браузера, а не обладнання.
:::

Починаючи з Panel Assistant 1.0, XL використовує спільний профіль Shelly, який враховує виявлені на [X2i](/uk/hardware/panels/shelly/wall-display-x2i/) властивості цієї прошивки: повне вимкнення екрана без root, а також «Назад» і «Додому» без списку недавніх. Власні датчики перевіряються на панелі під час запуску Panel Assistant. Жодного XL ще не підтверджено, тому повідомлення власника вітається; див. [Що X2i означає для решти лінійки](/uk/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Повне пояснення моделі доступу, кінцеві точки OTA-оновлень (гілка `WallDisplayV2`) та історію версій прошивки див. на [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/).

## Джерело

[База знань Shelly Wall Display XL](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
