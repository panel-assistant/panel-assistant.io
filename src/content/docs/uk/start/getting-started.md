---
title: Початок роботи
description: Від звичайної настінної панелі на Android до вашої інформаційної панелі Home Assistant за лічені хвилини, і Home Assistant проведе вас через кожен крок.
sourceCommit: 50fccda5c7e05cce0edbd2b4b37e006c473ca5df
---

Якщо ви вже колись налаштовували настінну панель або кіоск, то, мабуть, пам’ятаєте, як це було: ручне встановлення застосунків, пошуки браузерного рушія, здатного відобразити інформаційну панель, налаштування навмання і вічна невпевненість у наступному перезавантаженні. Налаштування панелі з Panel Assistant стане для вас приємним шоком. Ви впораєтеся за лічені хвилини, і навіть коли панель уже висить на стіні, вам не доведеться вставати з крісла. Ну, хіба що раз ;-)

Найважче в будь-якій панелі — перша година. Panel Assistant проходить цю годину за вас, прямо з Home Assistant. Якщо панель уже у вашій мережі, вкажіть інтеграції її адресу, і вона зробить решту. Якщо панель ще в коробці, підключіть її до ноутбука USB-кабелем і встановіть усе прямо з браузера, ще до того, як вона опиниться на стіні. У будь-якому разі вам треба лише підтвердити один запит на панелі й спостерігати за процесом.

## 1. Встановіть інтеграцію

Додайте Panel Assistant через HACS і перезапустіть Home Assistant. Це єдине, що ви встановлюєте вручну. Далі вас вестиме Home Assistant. Див. [Встановлення інтеграції](/uk/home-assistant/custom-integration/).

## 2. Увімкніть налагодження на панелі

Відкрийте на панелі параметри розробника й увімкніть бездротове налагодження або налагодження USB, якщо ви підключаєте панель кабелем. Саме це дає Home Assistant змогу виконати встановлення за вас. На [сторінках про обладнання](/uk/hardware/) показано, де цей перемикач на кожній моделі, а подробиці є на сторінці [Підготовка панелі](/uk/install/prepare-a-panel/).

## 3. Додайте панель

У Home Assistant перейдіть до **Налаштування**, **Пристрої та сервіси**, **Додати інтеграцію** і виберіть **Panel Assistant**. Потім виберіть, як підключено панель.

### Підключена до вашого комп’ютера

Нову панель можна налаштувати ще до того, як вона опиниться на стіні. Підключіть її до комп’ютера USB-кабелем і встановіть усе прямо з браузера. Для цього потрібен Chrome або Edge.

<div class="pa-steps" role="region" aria-label="Покрокова інструкція з встановлення через USB" tabindex="0">
<figure>
<figcaption><span>1</span> Виберіть «Встановити за допомогою USB»</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
</figure>
<figure>
<figcaption><span>2</span> Підключіть панель</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="USB-інсталятор просить підключити панель і натиснути Find my panel">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="USB-інсталятор просить підключити панель і натиснути Find my panel">
</figure>
<figure>
<figcaption><span>3</span> Натисніть «Дозволити» на панелі</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="USB-інсталятор чекає, поки ви натиснете «Дозволити» на екрані панелі">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="USB-інсталятор чекає, поки ви натиснете «Дозволити» на екрані панелі">
</figure>
<figure>
<figcaption><span>4</span> Натисніть Install</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="USB-інсталятор готовий до встановлення, з єдиною кнопкою Install">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="USB-інсталятор готовий до встановлення, з єдиною кнопкою Install">
</figure>
<figure>
<figcaption><span>5</span> Спостерігайте за встановленням</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="Індикатор перебігу USB-інсталятора під час встановлення застосунку">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="Індикатор перебігу USB-інсталятора під час встановлення застосунку">
</figure>
<figure>
<figcaption><span>6</span> Готово</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="USB-інсталятор підтверджує встановлення й відкриває налаштування панелі">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="USB-інсталятор підтверджує встановлення й відкриває налаштування панелі">
</figure>
</div>

### У вашій мережі

Якщо панель уже висить на стіні, Home Assistant потрібна лише її адреса.

<div class="pa-steps" role="region" aria-label="Додавання панелі у вашій мережі, крок за кроком" tabindex="0">
<figure>
<figcaption><span>1</span> Виберіть «Додати панель у вашій мережі»</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
</figure>
<figure>
<figcaption><span>2</span> Вкажіть адресу панелі</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="Крок «Додати панель» із введеною IP-адресою панелі">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="Крок «Додати панель» із введеною IP-адресою панелі">
</figure>
<figure>
<figcaption><span>3</span> Виберіть версію</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="Крок «Виберіть версію» з рекомендованим випуском угорі списку">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="Крок «Виберіть версію» з рекомендованим випуском угорі списку">
</figure>
<figure>
<figcaption><span>4</span> Натисніть «Дозволити» на панелі, і її буде додано</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="Крок «Успішно», що підтверджує додавання панелі до Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="Крок «Успішно», що підтверджує додавання панелі до Home Assistant">
</figure>
</div>

У будь-якому разі клопітку частину майстер бере на себе. Він перевіряє, що вже є на панелі, встановлює поточний випуск застосунку панелі, запускає його й перевіряє, що він працює справно. Панель, на якій застосунок уже працює, береться під керування, а не перевстановлюється. Панель розпізнає власну модель і завантажує відповідний профіль обладнання, тож її екран, кнопки, світлодіоди й датчики з’являються в Home Assistant готовими до використання. Див. [Додавання панелі](/uk/install/installing-ha-paneld/).

## 4. Завершіть у власному майстрі панелі

Потім Home Assistant відкриває власний майстер налаштування панелі, який поставить кілька коротких запитань, зокрема про назву панелі та інформаційну панель для стіни. Панель завантажує лише ті сутності, які показує ця інформаційна панель, і саме це робить її швидкою. Див. [Підключення панелі](/uk/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="Майстер налаштування панелі, крок за кроком" tabindex="0">
<figure>
<figcaption><span>1</span> Назвіть панель</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="Майстер налаштування панелі запитує ідентифікатор панелі та зрозумілу назву й показує, які імена сутностей використовуватиме Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="Майстер налаштування панелі запитує ідентифікатор панелі та зрозумілу назву й показує, які імена сутностей використовуватиме Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Виберіть інформаційну панель і приміщення</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="Майстер із вибраними для панелі інформаційною панеллю та приміщенням Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="Майстер із вибраними для панелі інформаційною панеллю та приміщенням Home Assistant">
</figure>
<figure>
<figcaption><span>3</span> Увімкніть фільтр сутностей</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="Майстер рекомендує фільтр сутностей для цієї панелі й показує кількість сутностей у Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="Майстер рекомендує фільтр сутностей для цієї панелі й показує кількість сутностей у Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Майже готово</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="Майстер чекає, поки панель сформує відфільтрований набір сутностей і завантажить інформаційну панель">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="Майстер чекає, поки панель сформує відфільтрований набір сутностей і завантажить інформаційну панель">
</figure>
<figure>
<figcaption><span>5</span> Все готово</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="Майстер підтверджує, що панель налаштовано, і показує інформаційну панель">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="Майстер підтверджує, що панель налаштовано, і показує інформаційну панель">
</figure>
</div>

## Що потрібно

- Home Assistant 2026.8.3 або новіший, з HACS.
- Настінна панель з Android 8.0 або новішим. Більшість панелей працюють із загальним профілем обладнання, а на сторінці [Вибір панелі](/uk/install/supported-panels/) перелічено моделі з повною підтримкою обладнання.
- Для варіанта з USB — браузер на основі Chromium, наприклад Chrome або Edge.

## Де шукати подробиці

Сторінки розділу **Стабільна робота** докладно описують кожну функцію застосунку панелі. Розділ «Довідка» документує [API](/uk/reference/api/), [профілі обладнання](/uk/reference/profiles/) і [модель безпеки](/uk/reference/security/), а [сторінки про обладнання](/uk/hardware/) описують кожну підтримувану панель.
