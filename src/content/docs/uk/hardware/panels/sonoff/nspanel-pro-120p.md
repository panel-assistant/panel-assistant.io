---
title: Sonoff NSPanel Pro 120P
description: Відомості про обладнання Sonoff NSPanel Pro 120P — вертикальної панелі Rockchip RK3326-S 750×1334 із вбудованим радіомодулем Zigbee.
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 in, 750 × 1334, вертикально, доступно горизонтально
support: Повна
root: userdebug, без пароля adb; su для вимкнення підсвічування
webview: Chromium 107 на 3.5.1; ручне встановлення LineageOS 138
released: '2024-08 (прибл.)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: Sonoff NSPanel Pro 120P, білий і чорний, спереду, на стіні
photoCredit: 'Фото: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

**120P** — високий варіант лінійки [Sonoff NSPanel Pro](/uk/hardware/panels/sonoff/), названий на честь європейської монтажної коробки 120 mm. Ця сторінка містить лише власні характеристики й факти, що відрізняються від [86P](/uk/hardware/panels/sonoff/nspanel-pro-86p/); усе інше (отримання root, оновлення WebView, світлодіод, датчики, шлюз Zigbee, особливості прошивки) задокументовано один раз на [сторінці сімейства](/uk/hardware/panels/sonoff/), до якої ведуть посилання розділів цієї сторінки.

## Також продається як

NSPanel Pro 120, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, SN_3326S, nspanel-pro-ver120. Не плутати з NSPanel Pro Gen2 або платами Tuya S6E та T6E — це інше обладнання.

|             |                                                                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **RK3326-S** (те саме сімейство PX30/RK3326, що й 86P; `ro.board.platform=rk3326`, дерево пристроїв `rockchip,px30`)                                                                                        |
| CPU         | 4× **Cortex-A35** до **1.512 GHz** (у простої 408 MHz)                                                                                                                                                               |
| GPU         | **Mali-G31** (підтверджено на пристрої)                                                                                                                                                                              |
| Екран       | **750×1334** вертикально, **240 dpi** (перевизначення 250); доступна горизонтальна орієнтація; приблизно на 1 cm вужчий і довший за 86P                                                                              |
| RAM         | **2 GB** (доступно приблизно 1960 MB)                                                                                                                                                                                |
| Сховище     | eMMC; `/data` приблизно 3.5 GB                                                                                                                                                                                       |
| Android     | 8.1 (API 27)                                                                                                                                                                                                         |
| ABI         | arm64-v8a                                                                                                                                                                                                            |
| Радіомодулі | **Zigbee 3.0** (координатор Silicon Labs EFR32, див. [сторінку сімейства](/uk/hardware/panels/sonoff/#zigbee-gateway)), Wi-Fi, Bluetooth. Немає NFC, ІЧ, Ethernet або стільникового зв’язку.                         |
| Випуск      | Приблизно серпень 2024; продаж на сайті Sonoff розпочався близько 14 серпня 2024 ([висвітлення запуску, haade.fr, серпень 2024](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)) |

`ro.product.model` і `ro.product.device` обидва повідомляють `px30_evb` — спільну назву плати Rockchip, яка _не_ є надійним способом відрізнити 120P від 86P; `ro.product.version` повідомляє специфічну для 120P форму `NSPanel120P_x.y.z` (канал OTA `nspanel-pro-ver120`, повний ROM `SN_3326S_750X1334_…`). В іншому форма OTA відповідає 86P (див. [сторінку прошивки](/uk/hardware/firmware/nspanel-pro/)). Прошивка датчика наближення 120P **залишилася бінарною на 4.x** (86P відновив вимірювання відстані у 4.0.12; ядра розходяться за моделями); див. [Датчики](/uk/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) на сторінці сімейства. Перевірено наживо на 120P (прошивка `NSPanel120P_3.7.1`): `wm size` 750×1334, щільність 240, `ro.board.platform=rk3326`.

:::note
Cortex-A35 — енергоощадне ядро з помітно нижчою продуктивністю за такт, ніж A55 (TPA10) або A72 (WF1589T). З 2 GB RAM лінійка NSPanel Pro має **початковий рівень продуктивності** серед повністю підтримуваних панелей; див. [порівняння продуктивності](/uk/hardware/#performance-comparison).
:::

## Початковий доступ до налагодження

Мережевий ADB на TCP-порту 5555 без комп’ютера залежить від установленої прошивки; універсального перемикача не встановлено. Виконайте [початкові кроки ADB для NSPanel Pro](/uk/hardware/panels/sonoff/#gaining-adb-and-root-access), зокрема процедуру USB для конкретної прошивки, коли мережевий доступ недоступний. Подальші кроки root вимагають уже наявного з’єднання налагодження.
