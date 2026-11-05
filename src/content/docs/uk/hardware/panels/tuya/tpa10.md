---
title: Tuya TPA10
description: 'Відомості про Tuya TPA10: панель Rockchip rk3566 із дисплеєм 10,1 дюйма, RGB-світлодіодом, п’ятьма кнопками, камерою та датчиками температури, вологості й наближення.'
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Повна
root: su присутній; допоміжний процес для світлодіода, клімату й п’ятої кнопки
webview: Chrome 83; заміна через root на LineageOS 150
released: '2023-08 (оцінка)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10 спереду, з бічною смугою кнопок
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10, вигляд спереду з бічною смугою кнопок і краєм рамки
photoCredit: 'Фото: Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Назва в каталозі Tuya'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: 'Назва в роздрібних пропозиціях і записі FCC'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Для цієї панелі не знайдено приміток виробника до випусків прошивки. Відомості про прошивку на цій сторінці — спостереження за дослідженим пристроєм.

Простора панель rk3566 **10.1 in 1920×1200** з одним переднім RGB-світлодіодом, одноколірним підсвічуванням кнопок, багатим набором датчиків (наближення за часом прольоту, температури й вологості, освітленості), камерою та п’ятьма фізичними кнопками. Не має Zigbee, NFC чи IR. Зворотне дослідження виконано на працюючому пристрої (Android 11, з root, `su` присутній).

## Також продається як

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, панель Tuya rk3566, SmartOS Xinch (пакети виробника `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
Найважливіше: adb **захищений паролем**, тому використовуйте прихований доступ через діагностичний застосунок і USB. Світлодіоду й датчикам, що потребують root, потрібен **допоміжний root-демон `hapaneld-helper`**. Запис `custom_animation` переднього світлодіода може **перезавантажити панель** (див. попередження нижче). **Спочатку оновіть WebView**; див. [WebView: спочатку оновіть його](#webview-спочатку-оновіть-його).
:::

|                 |                                                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC             | Rockchip **rk3566**                                                                                                                                                                                                                  |
| Дисплей         | **1920×1200** (16:10, горизонтальний), приблизно 10.1 in, **приблизно 226 фізичних ppi**, 56 Гц. Заводська базова логічна щільність Android **240 dpi** (часто перевизначається для розміру інформаційної панелі; рекомендовано 212) |
| Android         | 11 (API 30)                                                                                                                                                                                                                          |
| ABI             | armeabi-v7a (32-бітний користувацький простір)                                                                                                                                                                                       |
| Радіоінтерфейси | Wi-Fi, Bluetooth і BLE, а також функція виробника `com.smartos.xinch.platform.ethernet` (дротова мережа, PoE). **Без Zigbee, NFC, IR і стільникового зв’язку.**                                                                      |
| Root            | `su` доступний; світлодіод і датчики sysfs мають `system:system`, тому **потрібен допоміжний root-демон** (нижче).                                                                                                                   |
| Випуск          | Приблизно серпень 2023 (оцінка); FCC ID 2A789-TPA10, записаний як «Control Panel MAX», схвалено близько 22 серпня 2023 ([запис схвалення FCC ID 2A789-TPA10](https://fccid.io/2A789-TPA10))                                          |

:::tip
Змінюєте прошивку на панелі без кнопок? Спочатку прочитайте [Резервне копіювання й відновлення прошивки](/uk/hardware/guides/firmware-backup-and-restore/). TPA10 (rk3566, Android 11, 7.28 ГБ eMMC `mmcblk2`) має перевірений програмний перехід у Loader через `adb reboot loader` і `rkdeveloptool`. Заглиблена [кнопка в отворі](#buttons) не є входом Linux; її поведінку заводського скидання чи Maskrom безпечно не підтверджено, тому не покладайтеся на неї як на спосіб відновлення.
:::

<a id="gaining-adb-and-root-access"></a>

## Отримання доступу adb і root

TPA10 постачається з adb, **захищеним паролем**, і вимкненим мережевим adb. Надійний спосіб першого доступу — прихований вхід через діагностичний застосунок і USB без обчислення пароля. `su` вже присутній, тому після отримання adb є й root. Узагальнено з [seaky/nspanel_pro_tools_apk, issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**Початковий спосіб.** Перевіреного способу ввімкнути мережевий ADB на TCP-порті 5555 без комп’ютера немає. Спочатку використовуйте USB за процедурою діагностичного застосунку нижче; подальші команди root роблять мережевий ADB постійним лише після цього першого з’єднання.

**1. Увімкніть параметри розробника.** Налаштування, _Про пристрій_, сім разів торкніться номера збірки чи версії.

**2. Перший доступ через прихований вхід діагностичного застосунку USB (рекомендовано).** Параметри розробника надають інженерний **діагностичний застосунок** Tuya лише з китайським інтерфейсом. Поки він відкритий, adb через порт **USB** дозволений _без_ пароля, а сеанс уже має root. Підключіть USB і виконайте:

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

Root через adb на TPA10 надійніший через USB, ніж через мережу.

**3. Зробіть adb постійним (root, без пароля, надійний спосіб).** Із діагностичним застосунком на передньому плані ви маєте сеанс adb із root (`su` присутній, а `adb root` також працює, бо це збірка `userdebug`). Використайте його для постійного adb, щоб більше не потребувати тестового застосунку чи пароля. Це переживає закриття діагностичного застосунку **й** повне перезавантаження, що перевірено на пристрої. Передайте й виконайте як root:

```bash
# persist-adb.sh — run via the diagnostics-app backdoor:
#   adb push persist-adb.sh /data/local/tmp/ && adb shell su 0 sh /data/local/tmp/persist-adb.sh
settings put global adb_enabled 1                   # USB debugging, persisted in /data
settings put global development_settings_enabled 1  # keep Developer options visible
setprop persist.adb.tcp.port 5555                   # network adb on :5555 — persist.* survives reboot

# Pre-authorise each controlling machine so NO on-screen "Allow USB debugging" is needed after reboot.
# Append the contents of every workstation's ~/.android/adbkey.pub (one key per line):
mkdir -p /data/misc/adb
cat >> /data/misc/adb/adb_keys <<'KEYS'
PASTE-EACH-adbkey.pub-LINE-HERE
KEYS
chmod 640 /data/misc/adb/adb_keys
chown system:shell /data/misc/adb/adb_keys 2>/dev/null
restorecon /data/misc/adb/adb_keys 2>/dev/null

setprop ctl.restart adbd                            # apply now (and it auto-starts every boot)
echo "adb persisted: adb_enabled=$(settings get global adb_enabled) tcp=$(getprop persist.adb.tcp.port)"
```

Для мережевого способу панель має бути підключена до Wi-Fi. Відтоді `adb connect <panel-ip>:5555` працює з будь-якого попередньо авторизованого комп’ютера після перезавантажень і з закритими застосунками виробника. Очищення `/data` чи заводське скидання прибирають `adb_keys` і `adb_enabled`, тому після них запустіть скрипт знову.

:::caution
**Пароль «Enable ADB» у параметрах розробника не є придатним способом, тому не намагайтеся його обчислити.** Рецепт спільноти в [issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) не відтворюється. Декомпіляція `checkDevPassword` у `com.smartos.xinch.setting` підтверджує його _форму_: `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))`, потім `takeLast(6)`, без урахування регістру (або `takeLast(ro.tuya.uuid,6)`, коли `deviceId` порожній). Але використаний `deviceId` не вдалося зіставити з жодним читабельним ідентифікатором: `ro.serialno`, `android_id` і `ro.tuya.key` відхилено на працюючому пристрої. Журнал застосунку — **не** logcat, тому очікуване значення також неможливо прочитати на пристрої. Приклад у тому обговоренні теж має помилку (`11a` плюс `xia` записано як `11xia`; має бути `11axia`). Використовуйте root-спосіб вище, який робить пароль непотрібним.
:::

:::danger
Вимикайте пакети виробника `com.smartos.xinch.*` лише **останнім кроком**, підтвердивши надійний adb _і_ наявність заміни апаратних кнопок. Вимкнення апаратного застосунку чи налаштувань до надійного adb може заблокувати доступ. Дистанційні дії навігації застосунку панелі («Назад», «Додому») та його сутності підсвічування кнопок і світлодіода замінюють функції застосунку виробника.
:::

:::note
Застосунки виробника на пристрої _не_ були корисним джерелом зворотного дослідження. `com.tuya.devicetest` має odex (немає dex в APK), а `com.smartos.xinch.hardware` містить **AVS (Alexa) SDK** Tuya (`libLibSampleApp.so`, 17 МБ) і зчитувач клавіш (`libjnimain.so`). Авторитетне джерело — власні самодокументовані вузли sysfs пристрою.
:::

## WebView: спочатку оновіть його

Заводський WebView — **Chrome 83**, надто старий для поточного інтерфейсу Home Assistant, тому інформаційна панель залишається порожньою чи несправною до заміни. Рекомендована збірка — **LineageOS System WebView 150** (`armeabi-v7a`), актуальний підтримуваний стандартний рушій Chromium. Віддавайте їй перевагу перед Cromite: Cromite змінює налаштування автоматичного відтворення Chromium на _блокування_, що заважає запуску потоків карток камер Home Assistant (WebRTC) без дотику. LineageOS залишає автоматичне відтворення дозволеним, тому камери починають працювати самі.

TPA10 має обмежений запас відеодекодування всередині WebView. Кілька видимих карток WebRTC 720p можуть пропускати кадри чи залишати один потік в очікуванні першого кадру, хоча один потік справний. У такому разі використовуйте додаткові потоки нижчої роздільної здатності, менше одночасних карток з автоматичним відтворенням або знімки з переходом до живого відео дотиком.

Завантажте з дзеркала (стабільний URL):

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### Чому звичайне встановлення не працює

WebView запаковано як `com.android.webview`, тому він має **замінити** системного постачальника; обидва очевидні способи не працюють на цій панелі Android 11:

- `adb install -r` відхиляється з `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`. Android дозволяє оновлювати `com.android.webview` лише APK, підписаним **тим самим ключем**, що й установлений; кожен виробник WebView використовує інший ключ. Із тієї самої причини **звичайне ручне встановлення не може виконати першу заміну**: воно використовує `pm install`, який панель блокує. Заміна нижче — **одноразовий** ручний крок. Коли LineageOS уже встановлений, подальші версії LineageOS можна встановлювати через `adb install -r`, бо вони мають спільного підписувача.
- Список дозволених постачальників ROM приймає лише `com.android.webview`, а не варіант `com.google.android.webview`, тому збірка Google встановлюється, але ніколи не вибирається.

### Робочий спосіб із root: заміна файла й очищення блокування підпису

Панель заблокована підписом, але дозволяє root: застосунок не може виконати `su`, а оболонка може (`adb shell su root <cmd>`). Спосіб поміщає новий APK у _системне_ місце WebView і видаляє його запис із бази пакетів, щоб PackageManager зареєстрував його **заново** після перезавантаження, прочитавши власний підпис нового APK без конфлікту.

```bash
IP=<panel-ip>:5555
adb connect $IP
adb -s $IP shell su root id                           # confirm it prints uid=0(root)

# 1. push the new WebView, and back up the current WebView + package database first:
adb -s $IP push lineageos-webview-150.0.7871.63-arm.apk /data/local/tmp/wv-new.apk
adb -s $IP shell su root sh -c 'cp /product/app/webview/webview.apk /data/local/tmp/webview.bak;
                                cp /data/system/packages.xml /data/local/tmp/packages.xml.bak'

# 2. replace the system WebView APK (remount /product read-write first — verity must already be off;
#    a never-modified panel needs a one-time `adb root && adb disable-verity && adb reboot` beforehand):
adb -s $IP shell su root sh -c 'mount -o rw,remount /product;
    cp /data/local/tmp/wv-new.apk /product/app/webview/webview.apk;
    chmod 644 /product/app/webview/webview.apk; chown root:root /product/app/webview/webview.apk;
    restorecon /product/app/webview/webview.apk'

# 3. remove the single <package name="com.android.webview" …>…</package> element from packages.xml.
#    Do NOT hand-edit it — pull it, let a parser remove exactly that element, then push it back:
adb -s $IP shell su root sh -c 'cp /data/system/packages.xml /data/local/tmp/pkgs.xml; chmod 644 /data/local/tmp/pkgs.xml'
adb -s $IP pull /data/local/tmp/pkgs.xml packages.xml
python3 - <<'PY'
import xml.etree.ElementTree as ET
d = open('packages.xml', encoding='utf-8').read()
m = '<package name="com.android.webview"'
assert d.count(m) == 1, 'expected exactly one com.android.webview package'
s  = d.find(m); ls = d.rfind('\n', 0, s) + 1                      # start of that line
e  = d.find('</package>', s) + len('</package>'); le = d.find('\n', e) + 1  # end of its closing line
new = d[:ls] + d[le:]
ET.fromstring(new)                                                # abort if the result isn't valid XML
open('packages.xml', 'w', encoding='utf-8').write(new)
print('removed com.android.webview; XML still valid')
PY
adb -s $IP push packages.xml /data/local/tmp/pkgs.new
adb -s $IP shell su root sh -c 'cp /data/local/tmp/pkgs.new /data/system/packages.xml;
    chown system:system /data/system/packages.xml; chmod 660 /data/system/packages.xml;
    restorecon /data/system/packages.xml'

# 4. reboot — PackageManager registers the new WebView fresh:
adb -s $IP reboot
```

**Якщо щось піде не так**, поверніть резервні копії з кроку 1: скопіюйте `/data/local/tmp/webview.bak` назад поверх `/product/app/webview/webview.apk` і `/data/local/tmp/packages.xml.bak` поверх `/data/system/packages.xml` (із тими самими `chown`, `chmod` і `restorecon`), потім перезавантажте.

:::danger
**Після цього способу повідомлена версія WebView неправильна, тому не довіряйте їй.** «Налаштування», WebView і `adb shell dumpsys webviewupdate` досі показують **`83.0.4103.120`**, бо вручну встановлений SystemWebView **підставляє заводські OEM `versionName` і `versionCode`**, щоб пройти мінімальну межу версії панелі й бути вибраним. _Фактичний_ рушій — 150. Перевірте так:

- **User-Agent:** відкрийте будь-яку сторінку визначення user agent на панелі; UA містить `Chrome/150.0.7871.63`.
- **Застосунок панелі:** сторінка стану й `/diag` на повідомленому HTTP-порті (типово 8888) показують `engine Chromium 150.0.7871.63`, бо читають UA, а не підставлену версію пакета.

Звичайне ручне встановлення через adb **не** працює на цій панелі з блокуванням підпису. Cromite 147 залишається на дзеркалі як запасний варіант із тією самою процедурою й іншим APK.
:::

## Світлодіод

### RGB-світлодіод: драйвер `avsux` (допоміжний root-демон)

Передній RGB-світлодіод — **один** світлодіод (`avsux_info` повідомляє `led type:[single] nums:[1]`) на платформному драйвері `leds_pwm_avs` (пристрій `avsux`), доступний у `/sys/class/leds/avs-pwm-led/`.

:::danger
Спостерігали, що запис `custom_animation` до `avsux_select` **перезавантажує панель**. Для кольору використовуйте `avsux_animation`; вважайте `avsux_select` і `custom_animation` доступними лише для читання, окрім тестування.
:::

Для світлодіода **немає доступного застосунку вузла `/dev`** (порівняйте `/dev/ledjni` [WF1589T](/uk/hardware/panels/electron/wf1589t/)), а атрибути sysfs мають `system:system`, тому `untrusted_app` не може до них писати. Застосунок панелі використовує невеликий **допоміжний root-демон** (`/system/bin/hapaneld-helper`, що працює як root на сокеті Unix); `SocketLedController` — клієнт. Див. [документацію допоміжного процесу](https://github.com/panel-assistant/android/blob/main/helper/README.md).

#### Атрибути sysfs `avs-pwm-led`

| Атрибут           | Дозволи            | Використання                                              |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | загальний рівень від 0 до 255                             |
| `avsux_animation` | `system:system` rw | безпечний запис кольору чи анімації                       |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | перелік названих анімацій (`bootanime`, `idle`)           |
| `avsux_info`      | r                  | метадані (кількість і тип світлодіодів)                   |

### Підсвічування кнопок

`/sys/class/leds/button-backlight/brightness` — **одноколірний** вихід PWM від 0 до 255 (стандартний драйвер `leds_pwm`, пристрій `pwmleds`). Він має `system:system` 0664, тому керується тим самим демоном `hapaneld-helper`.

## Датчики

Наближення й освітленість доступні застосунку напряму через `SensorManager`. Температура й вологість потребують root (підсистема введення та I²C) і допоміжного демона.

:::tip
Завдяки CHT8305 цю панель можна використовувати як **датчик температури та вологості в приміщенні** для Home Assistant. Допоміжний демон зчитує його своєю командою `CHT8305`: це разове зчитування `EVIOCGABS` вхідної осі `ABS_THROTTLE` драйвера з визначенням пристроїв введення `temperature` і `humidity` за назвою. Застосунок панелі надає в Home Assistant датчики **Температура в кімнаті** та **Вологість у кімнаті**. Передавання показань увімкнено за замовчуванням; елементи керування розташовані в розділі «Налаштування», «Датчики», у поданні «Розширені». Розширений параметр **Зсув температури в приміщенні** або `sensors.room_temp_offset_c` у профілі компенсує вплив нагрівання самої панелі.
:::

Датчик часу прольоту TPA10 означає, що наближення справді засноване на відстані, але Android HAL квантує його. Покрокове налаштування наближення на панелі захоплює й зберігає далеку та близьку кінцеві точки й напрямок реального датчика; потім панель повідомляє ту саму нормалізовану шкалу, що й усі підтримувані панелі, замість фіксованого порога для конкретного пристрою.

### Мікросхеми датчиків і способи доступу

| Датчик                    | Мікросхема                                                                    | Доступ                                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Наближення (час прольоту) | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, опитування 30 мс)        | Android `SensorManager` `TYPE_PROXIMITY`, без root. Сира відстань у мм на вузлі I²C драйвера (`…/i2c-3/3-006c`) потребує root. |
| Температура й вологість   | **CHT8305** (`temperature_cht8305` на 3-0040, `humidity_cht8305` на 3-0040-1) | **Не** в `SensorManager`; повідомляє через **підсистему введення** на I²C, лише root.                                          |
| Освітленість              | **CG5256** (`light_cg5256`)                                                   | Датчик світла Android `SensorManager`, без root.                                                                               |

<a id="buttons"></a>

## Кнопки

TPA10 має **три класи** фізичних кнопок, підтверджені на пристрої через `getevent`:

- **Чотири бічні кнопки:** `adc-keys`, стандартні KeyEvents зіставлені з `F1`—`F4`, захоплюються фільтром клавіш спеціальних можливостей застосунку панелі без особливого способу.
- **П’ята (помаранчева) кнопка:** _перемикач_ `EV_SW`, а не клавіша; читається зчитувачем evdev допоміжного root-демона й надсилається до Home Assistant як подія.
- **Кнопка в отворі** (заглиблена, біля USB-C): не є входом Android, тому недоступна Home Assistant.

### Подробиці кнопок

**1. Чотири бічні кнопки — `adc-keys`, що надсилають стандартні KeyEvents.** Вони підключені до **SARADC** rk3566 (`fe720000.saradc`), пристрій `adc-keys1` (`/dev/input/event7`), скан-коди `59`—`62`. Заводський `Generic.kl` зіставляє їх із **`F1`—`F4`**, які стають Android `KEYCODE_F1`—`KEYCODE_F4`; застосунок панелі захоплює їх через фільтр клавіш спеціальних можливостей. На пристрої з `su` їх можна перепризначити редагуванням `/system/usr/keylayout/Generic.kl` (наприклад, на `BRIGHTNESS_*` чи `VOLUME_*`).

**2. П’ята (помаранчева) кнопка — перемикач, а не клавіша.** На `gpio-keys` (`/dev/input/event8`) вона повідомляє **`EV_SW` `SW_MUTE_DEVICE`** (код перемикача `14`) — подію _з фіксацією стану_, **не** `EV_KEY`. Тому для неї немає запису keylayout й спеціальні можливості Android її не бачать. Вона фізично вимикає мікрофони незалежно від доставляння клавіш спеціальних можливостей. Застосунок читає її через зчитувач evdev допоміжного root-демона (`WATCH /dev/input/event8`, `sw=true`) і надсилає подію Home Assistant (`KEYCODE_MUTE`) на кожне перемикання, що перевірено наскрізно. Це **заводська** поведінка, на час написання не документована деінде.

**3. Кнопка в отворі (заглиблена, біля USB-C) не є входом Android.** Її немає в `getevent`, `gpio-keys` і `dmesg`, тому Home Assistant не може її використовувати. Її електричну роль безпечно не підтверджено. Розташування й платформа rk3566 можуть вказувати на функцію скидання чи режиму завантаження, але немає перевіреної тривалості утримання, поведінки заводського скидання чи процедури входу Maskrom. Не натискайте й не утримуйте її, припускаючи, що вона надає відновлюваний спосіб перепрошивання. Використовуйте перевірений програмний перехід у Loader, поки Android завантажується, та дотримуйтеся меж у [Резервному копіюванні й відновленні прошивки](/uk/hardware/guides/firmware-backup-and-restore/).

## Камера

GalaxyCore **GC05A2 / GC5035**, сенсор 2592×1944. Android повідомляє одну камеру рівня `LIMITED`, лише `BACKWARD_COMPATIBLE`, `Facing: Back`, без спалаху й автофокуса, через постачальника `legacy/0` (`device@3.3`).

:::note
Власні прапорці можливостей прошивки помилкові: панель оголошує `android.hardware.camera.front`, а HAL повідомляє `Facing: Back`. Спирайтеся на профіль пристрою й фактичний перелік `CameraManager`, ніколи на `hasSystemFeature`.
:::

1280×720 доступне у всіх трьох форматах: `IMPLEMENTATION_DEFINED`, `YUV_420_888` і `BLOB`, тому є формати попереднього перегляду й фотознімків. HAL оголошує затримку на один кадр для знімка `BLOB` 720p за 30 fps. Цей показник виробника для фотознімка не вимірює вартість потоку H.264 застосунку панелі. `android.control.aeAvailableTargetFpsRanges` пропонує лише `[15 30]` і `[30 30]`: фіксованого режиму сенсора 15 fps немає, тому потік 15 fps отримується обмеженням темпу кодувальника, а не сенсора.

Єдиний апаратний кодувальник H.264 — `OMX.rk.video_encoder.avc`, який обслуговує OMX IL HAL (на панелі є процес `media.codec` і немає служби виробника Codec2). Він оголошує від `176x144` до `1920x1088` із вирівнюванням `16x8`, повідомлений діапазон бітрейту від 1 bps до 10 Mbps і чотири одночасні екземпляри. **Апаратного кодувальника HEVC немає**; єдиний запис HEVC — програмний `c2.android.hevc.encoder`, поставлений із `enabled="false"`.

:::caution
Вважайте показники `media_codecs_performance.xml` виробника шаблоном, а не вимірюванням: апаратний і програмний кодувальники AVC повідомляють однакові значення `measured-frame-rate` і для 720×480, і для 1280×720, що не може бути справжнім вимірюванням. Припускайте 720p, доки не виміряєте інше на власній панелі.
:::

Панель, що показує картки камер, не простоює. На виміряній інформаційній панелі застосунок утримував два активні екземпляри `OMX.rk.video_decoder.avc`, тому сеанс кодування конкурує з декодуванням на тому самому Rockchip VPU.

Застосунок панелі може надавати цю камеру як функцію, **типово вимкнену**. Перемикач **Камера** на картці камери в **Налаштування** вмикає її з типовими параметрами **Роздільна здатність**, **Частота кадрів** і **Бітрейт** (720p, 15 fps, 2000 kbps) та зміщенням **Експозиція**. Потік H.264 надається за `rtsp://<panel>:8554/live`, зі звуком кімнати, коли мікрофон доступний і дозвіл надано. Home Assistant отримує знімки з цього потоку через сутність камери панелі. Щоразу, коли камера відкрита, панель показує червоний індикатор, який вміст сторінки не може закрити. Сутність камери описано в [довіднику керування](/uk/reference/api/).

:::caution
Не розміщуйте картку камери Home Assistant **цієї** панелі на інформаційній панелі **цієї ж** панелі. Панель без користі декодуватиме власний закодований потік по колу на тому самому відеорушії.
:::

## Інші мікросхеми

Камера GalaxyCore **GC05A2 / GC5035**; аудіокодек **ES7202** (АЦП захоплення; мовлення поблизу панелі й Assist перевірено через захоплення Android після ввімкнення мікрофона помаранчевою апаратною кнопкою; захоплення здалеку й робота з фоновою музикою залишаються неперевіреними); сенсорний контролер Goodix; PMIC `rk808` і `rk860`.

## Підсумок моделі доступу

- **Світлодіод і підсвічування кнопок:** лише root (sysfs `system:system`), через `hapaneld-helper`.
- **Наближення й освітленість:** напряму з застосунку (`SensorManager`).
- **Температура, вологість:** лише root (підсистема введення та I²C), через допоміжний демон.
- **Кнопки:** чотири бічні доступні напряму (KeyEvents через спеціальні можливості); п’ята помаранчева — перемикач `EV_SW`, що читається спостереженням evdev `hapaneld-helper`; кнопка в отворі не є входом.
