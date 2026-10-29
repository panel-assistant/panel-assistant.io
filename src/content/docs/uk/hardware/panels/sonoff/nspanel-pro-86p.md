---
title: Sonoff NSPanel Pro 86P
description: Відомості про обладнання Sonoff NSPanel Pro 86P — квадратної панелі Rockchip PX30 480×480 із вбудованим радіомодулем Zigbee.
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 in, 480 × 480, лише вертикально
support: Повна
root: userdebug, без пароля adb; su для вимкнення підсвічування
webview: Chromium 107 на 3.5.1; ручне встановлення LineageOS 138
released: '2022-09 (прибл.)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: Sonoff NSPanel Pro 86P, спереду, на стіні
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, чорний, під кутом із глибиною кріплення
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, білий, під кутом із глибиною кріплення
photoCredit: 'Фото: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

**86P** — квадратний варіант лінійки [Sonoff NSPanel Pro](/uk/hardware/panels/sonoff/), названий на честь європейської монтажної коробки 86 mm. Ця сторінка містить лише власні характеристики й факти, що відрізняються від [120P](/uk/hardware/panels/sonoff/nspanel-pro-120p/); усе інше (отримання root, оновлення WebView, світлодіод, датчики, шлюз Zigbee, особливості прошивки) задокументовано один раз на [сторінці сімейства](/uk/hardware/panels/sonoff/), до якої ведуть посилання розділів цієї сторінки.

## Також продається як

NSPanel Pro 86, NSPanel Pro 86P, NSPanel120P (оголошення 86P інколи повторно використовують цей рядок), NSPanel Pro Gen1, px30_evb, SN-RKPX30-NSP-01, nspanel-pro. Не плутати з NSPanel Pro Gen2 або платами Tuya S6E та T6E — це інше обладнання.

|             |                                                                                                                                                                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC         | Rockchip **PX30**                                                                                                                                                                                                                                                                                                  |
| CPU         | 4× **Cortex-A35** до **1.512 GHz** (у простої 408 MHz)                                                                                                                                                                                                                                                             |
| GPU         | **Mali-G31** (підтверджено на пристрої)                                                                                                                                                                                                                                                                            |
| Екран       | **480×480 квадратний** (1:1), приблизно 4 in, 160 dpi (mdpi, добре відповідає приблизно 170 фізичним ppi), 60 Hz, полотно **480×480 dp**                                                                                                                                                                           |
| RAM         | **2 GB** (доступно приблизно 1960 MB)                                                                                                                                                                                                                                                                              |
| Сховище     | eMMC; `/data` приблизно 3.5 GB                                                                                                                                                                                                                                                                                     |
| Android     | 8.1 (API 27)                                                                                                                                                                                                                                                                                                       |
| ABI         | arm64-v8a                                                                                                                                                                                                                                                                                                          |
| Радіомодулі | **Zigbee 3.0** (координатор Silicon Labs EFR32, див. [сторінку сімейства](/uk/hardware/panels/sonoff/#zigbee-gateway)), Wi-Fi, Bluetooth. Немає NFC, ІЧ, Ethernet або стільникового зв’язку.                                                                                                                       |
| Випуск      | Приблизно вересень 2022; попередні замовлення відкрили в серпні 2022 із запланованим відвантаженням від 20 вересня 2022 ([огляд попереднього замовлення, CNX Software, серпень 2022](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)) |

`ro.product.model` і `ro.product.device` обидва повідомляють `px30_evb` — спільну назву плати Rockchip, яка _не_ є надійним способом відрізнити 86P від 120P; `ro.product.version` повідомляє специфічну для 86P форму `NSPanel86P_x.y.z` або `s6_android_x.y.z` на деяких прошивках. OTA постачається як повний ROM до **4.0.12** включно; пізніші індексовані випуски постачаються як різницеві оновлення або лише оновлення застосунку (див. [сторінку прошивки](/uk/hardware/firmware/nspanel-pro/)). Прошивка датчика наближення 86P **відновила вимірювання відстані у 4.0.12** (120P залишився бінарним на 4.x); див. [Датчики](/uk/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) на сторінці сімейства.

:::note
Cortex-A35 — енергоощадне ядро з помітно нижчою продуктивністю за такт, ніж A55 (TPA10) або A72 (WF1589T). З 2 GB RAM лінійка NSPanel Pro має **початковий рівень продуктивності** серед повністю підтримуваних панелей; див. [порівняння продуктивності](/uk/hardware/#performance-comparison).
:::

## Початковий доступ до налагодження

Мережевий ADB на TCP-порту 5555 без комп’ютера залежить від установленої прошивки; універсального перемикача не встановлено. Виконайте [початкові кроки ADB для NSPanel Pro](/uk/hardware/panels/sonoff/#gaining-adb-and-root-access), зокрема процедуру USB для конкретної прошивки, коли мережевий доступ недоступний. Подальші кроки root вимагають уже наявного з’єднання налагодження.
