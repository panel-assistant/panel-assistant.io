---
title: Shelly Wall Display X2
description: Відомості про обладнання Shelly Wall Display X2 — 6.9-дюймової панелі SC7731E з Android 8.1, кодова назва Pegasus.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 in, 1440 × 720
support: Не перевірено
root: Не встановлено для цієї моделі
webview: 'Не встановлено (гілка WallDisplay не містить OTA-пакета WebView для цієї моделі)'
released: '2025-01 (прибл.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, вигляд спереду
photoCredit: 'Фото: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
---

:::note
**Жодного пристрою цієї моделі не перевірено.** Panel Assistant зіставляє його з вбудованим профілем старих Shelly, який ще не запускався на жодному X2. На [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/) наведено джерела, механізм OTA-оновлень прошивки, модель доступу й примітки безпеки, спільні для всієї лінійки.
:::

Wall Display X2, кодова назва прошивки **Pegasus**, — це панель 6.9 in 1440×720 на Spreadtrum/UNISOC SC7731E (Cortex-A7), Android 8.1. Вона належить до старої гілки OTA **WallDisplay** (armeabi-v7a), разом з [оригінальною моделлю](/uk/hardware/panels/shelly/wall-display/).

## Початковий доступ до налагодження

**Мережевий ADB на TCP-порту 5555 без комп’ютера: не встановлено для цієї моделі.** Початкове налагодження через USB і розблокування меню виробника тут також не перевірені. [Процедуру X2i](/uk/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) підтверджено лише на X2i; спільна прошивка не доводить, що вона працює тут. Попросіть Shelly надати процедуру для вашої моделі та прошивки. Використовуйте [USB-інсталятор](/uk/install/install-over-usb/) лише після появи налагодження через USB і USB-з’єднання для даних. Сама збірка з можливістю root не вмикає налагодження.

## Також продається як

Shelly Wall Display X2, SAWD-2A1XX10EU1, кодова назва прошивки Pegasus, ID пристрою e500_7731e_32u_o.

|         |                                                                                                                                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC     | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                   |
| Екран   | **1440×720**, 6.9 in                                                                                                                                                                                                                       |
| Android | 8.1                                                                                                                                                                                                                                        |
| ABI     | armeabi-v7a                                                                                                                                                                                                                                |
| Датчики | Температура, вологість, навколишнє освітлення й наближення задокументовані; доступ через API Android не перевірений                                                                                                                        |
| Реле    | 1 вихід                                                                                                                                                                                                                                    |
| Root    | Не встановлено для цієї моделі; даних про тип OTA-збірки саме цієї моделі не встановлено                                                                                                                                                   |
| Випуск  | Приблизно січень 2025; анонсовано разом із серією Shelly Gen4 на CES 2025 ([власна прессторінка Shelly CES 2025](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

Повне пояснення моделі доступу, кінцеві точки OTA-оновлень (гілка `WallDisplay`) та історію версій прошивки див. на [сторінці сімейства Wall Display](/uk/hardware/panels/shelly/).

## Джерело

[База знань Shelly Wall Display X2](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
