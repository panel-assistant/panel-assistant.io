---
title: Shelly Wall Display (оригінальний)
description: Відомості про обладнання оригінального Shelly Wall Display — 4-дюймової панелі MT6580 з Android 7, кодова назва Stargate.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Shelly
model: Wall Display (original)
soc: MT6580
android: '7.0'
screen: 4 in, 480 × 480
support: Дослідження
root: Не встановлено; базова збірка userdebug, не підтверджено
webview: 'com.google.android.webview 119.0.6045.194 через офіційний ZIP'
released: '2023-09 (прибл.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, оригінальна модель, з додатковим датчиком H&T
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display, вигляд ззаду з етикеткою моделі й монтажною коробкою
photoCredit: 'Фото: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display (оригінальний)
  order: 1
---

:::note
**Лише дослідження: жодного пристрою цієї моделі не перевірено.** На [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/) наведено джерела, механізм OTA-оновлень прошивки, модель доступу й примітки безпеки, спільні для всієї лінійки.
:::

:::caution
**Постачається з Android 7.0**, що нижче мінімальної версії Android, підтримуваної Panel Assistant.
:::

Оригінальний Wall Display, кодова назва прошивки **Stargate**, — початкова модель [сімейства Shelly Wall Display](/uk/hardware/panels/shelly/): панель 4 in 480×480 на MediaTek MT6580, Android 7. Вона належить до старої гілки OTA **WallDisplay** (armeabi-v7a), разом із [X2](/uk/hardware/panels/shelly/wall-display-x2/).

## Початковий доступ до налагодження

**Мережевий ADB на TCP-порту 5555 без комп’ютера: не встановлено для цієї моделі.** Початкове налагодження через USB і розблокування меню виробника тут також не перевірені. [Процедуру X2i](/uk/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) підтверджено лише на X2i; спільна прошивка не доводить, що вона працює тут. Попросіть Shelly надати процедуру для вашої моделі та прошивки. Використовуйте [USB-інсталятор](/uk/install/install-over-usb/) лише після появи налагодження через USB і USB-з’єднання для даних. Сама збірка з можливістю root не вмикає налагодження.

## Також продається як

Shelly Wall Display, SAWD-0A1XX10EU1, кодова назва прошивки Stargate, ID пристрою k400_mt6580_32_n.

|         |                                                                                                                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | MediaTek **MT6580**                                                                                                                                                                                                                                                          |
| Екран   | **480×480 квадратний**, 4 in                                                                                                                                                                                                                                                 |
| Android | 7.0                                                                                                                                                                                                                                                                          |
| ABI     | armeabi-v7a                                                                                                                                                                                                                                                                  |
| Датчики | Температура, вологість і навколишнє освітлення задокументовані; доступ через API Android не перевірений                                                                                                                                                                      |
| Реле    | 1 вихід                                                                                                                                                                                                                                                                      |
| WebView | Відсутній у стандартній OTA-прошивці; Shelly публікує окремий ZIP, що встановлює `com.google.android.webview` **119.0.6045.194**                                                                                                                                             |
| Root    | Не встановлено для цієї моделі. OTA оголошує базову збірку `userdebug` (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), тому `adb root` може працювати, **якщо** вдасться встановити з’єднання adb, хоча це не підтверджено на пристрої.                      |
| Випуск  | Приблизно вересень 2023; Shelly вперше показала Wall Display на IFA Berlin у вересні 2023 ([огляд лінійки Shelly на IFA Berlin 2023, Maison et Objet Domotique](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)) |

Повне пояснення моделі доступу, кінцеві точки OTA-оновлень (гілка `WallDisplay`) та історію версій прошивки див. на [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/).

## Джерело

[База знань Shelly Wall Display](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
