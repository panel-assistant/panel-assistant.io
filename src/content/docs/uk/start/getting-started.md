---
title: Початок роботи
description: Від звичайної настінної панелі на Android до вашої інформаційної панелі Home Assistant за лічені хвилини, і Home Assistant проведе вас через кожен крок.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Якщо ви вже колись налаштовували настінну панель або кіоск, то, мабуть, пам’ятаєте, як це було: ручне встановлення застосунків, пошуки браузерного рушія, здатного відобразити інформаційну панель, налаштування навмання і вічна невпевненість у наступному перезавантаженні. Налаштування панелі з Panel Assistant стане для вас приємним шоком. Ви впораєтеся за лічені хвилини, і навіть коли панель уже висить на стіні, вам не доведеться вставати з крісла. Ну, хіба що раз ;-)

Найважче в будь-якій панелі — перша година. Panel Assistant проходить цю годину за вас, прямо з Home Assistant. Якщо панель уже у вашій мережі, вкажіть інтеграції її адресу, і вона зробить решту. Якщо панель ще в коробці, підключіть її до ноутбука USB-кабелем і встановіть усе прямо з браузера, ще до того, як вона опиниться на стіні. Якщо панель просить авторизувати налагодження, підтвердьте запит на її екрані, а потім спостерігайте за встановленням.

## 1. Встановіть інтеграцію

Додайте Panel Assistant через HACS і перезапустіть Home Assistant. Це єдине, що ви встановлюєте вручну. Далі вас вестиме Home Assistant. Див. [Встановлення інтеграції](/uk/home-assistant/custom-integration/).

:::note
Panel Assistant 1.0 доступний як публічна попередня версія. До його випуску HACS встановлює 0.9.0. Щоб натомість встановити попередню версію, відкрийте **Panel Assistant** у HACS, увімкніть **Show beta versions** (показувати бета-версії) і завантажте найновішу попередню версію 1.0. Панель із застосунком 1.0 не може повернутися до 0.9; [Оновлення до 1.0](/uk/manage/upgrade-to-1-0/) пояснює зміни.
:::

## 2. Увімкніть налагодження на панелі

Відкрийте на панелі параметри розробника: на більшості панелей відкрийте **Налаштування**, потім **Про пристрій** і торкніться **Номер збірки** сім разів. Потім увімкніть **Налагодження через USB**, якщо підключаєте панель кабелем, або **мережевий ADB на TCP-порту 5555** для мережевого шляху. Не кожна панель має перемикач мережевого ADB; кожна [сторінка обладнання](/uk/hardware/) вказує, чи він є і де розташований, а якщо немає — скористайтеся USB. Подробиці є на сторінці [Підготовка панелі](/uk/install/prepare-a-panel/).

## 3. Додайте панель

У Home Assistant перейдіть до **Налаштування**, **Пристрої та сервіси**, **Додати інтеграцію** і виберіть **Panel Assistant**. Потім виберіть, як підключено панель.

### Підключена до вашого комп’ютера

Нову панель можна налаштувати ще до того, як вона опиниться на стіні. Підключіть її до комп’ютера USB-кабелем і встановіть усе прямо з браузера. Для цього потрібен Chrome або Edge. Вибравши **Встановити за допомогою USB на цьому комп’ютері**, виберіть **Відкрити USB-інсталятор**, залиште рекомендовану версію й натисніть **Продовжити**; інсталятор відкриється в новому вікні. Панелі все одно потрібен Wi-Fi для завершення налаштування, тож підключіть її до своєї мережі у власному застосунку «Налаштування» до або після встановлення.

<div class="pa-steps" role="region" aria-label="Покрокова інструкція з встановлення через USB" tabindex="0">
<figure>
<figcaption><span>1</span> Виберіть «Встановити за допомогою USB»</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
</figure>
<figure>
<figcaption><span>2</span> Підключіть панель, натисніть Знайти мою панель і виберіть панель зі списку браузера</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-connect-dark.png" width="520" height="375" alt="USB-інсталятор просить підключити панель і натиснути Знайти мою панель">
<img class="dark:sl-hidden" src="/screenshots/usb-connect-light.png" width="520" height="375" alt="USB-інсталятор просить підключити панель і натиснути Знайти мою панель">
</figure>
<figure>
<figcaption><span>3</span> Дозвольте налагодження на панелі, якщо з’явиться запит</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-allow-dark.png" width="520" height="263" alt="USB-інсталятор чекає, поки ви натиснете «Дозволити» на екрані панелі">
<img class="dark:sl-hidden" src="/screenshots/usb-allow-light.png" width="520" height="263" alt="USB-інсталятор чекає, поки ви натиснете «Дозволити» на екрані панелі">
</figure>
<figure>
<figcaption><span>4</span> Натисніть «Встановити»</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-confirm-dark.png" width="520" height="323" alt="USB-інсталятор готовий до встановлення, з єдиною кнопкою «Встановити»">
<img class="dark:sl-hidden" src="/screenshots/usb-confirm-light.png" width="520" height="323" alt="USB-інсталятор готовий до встановлення, з єдиною кнопкою «Встановити»">
</figure>
<figure>
<figcaption><span>5</span> Спостерігайте за встановленням</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-progress-dark.png" width="520" height="309" alt="Індикатор перебігу USB-інсталятора під час встановлення застосунку">
<img class="dark:sl-hidden" src="/screenshots/usb-progress-light.png" width="520" height="309" alt="Індикатор перебігу USB-інсталятора під час встановлення застосунку">
</figure>
<figure>
<figcaption><span>6</span> Готово</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-done-dark.png" width="520" height="308" alt="USB-інсталятор підтверджує встановлення й відкриває налаштування панелі">
<img class="dark:sl-hidden" src="/screenshots/usb-done-light.png" width="520" height="308" alt="USB-інсталятор підтверджує встановлення й відкриває налаштування панелі">
</figure>
</div>

### У вашій мережі

Якщо панель уже висить на стіні, Home Assistant потрібна лише її адреса.

<div class="pa-steps" role="region" aria-label="Додавання панелі у вашій мережі, крок за кроком" tabindex="0">
<figure>
<figcaption><span>1</span> Виберіть «Додати панель у вашій мережі»</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Крок «Налаштувати панель» у Home Assistant з варіантами «Додати панель у вашій мережі» або «Встановити за допомогою USB на цьому комп’ютері»">
</figure>
<figure>
<figcaption><span>2</span> Вкажіть адресу панелі</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-address-dark.png" width="580" height="377" alt="Крок «Додати панель» із введеною IP-адресою панелі">
<img class="dark:sl-hidden" src="/screenshots/ha-address-light.png" width="580" height="377" alt="Крок «Додати панель» із введеною IP-адресою панелі">
</figure>
<figure>
<figcaption><span>3</span> Виберіть версію</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-version-dark.png" width="580" height="304" alt="Крок «Виберіть версію» з рекомендованим випуском угорі списку">
<img class="dark:sl-hidden" src="/screenshots/ha-version-light.png" width="580" height="304" alt="Крок «Виберіть версію» з рекомендованим випуском угорі списку">
</figure>
<figure>
<figcaption><span>4</span> Дозвольте налагодження на панелі, якщо вона запитає</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-authorize-dark.png" width="580" height="354" alt="Home Assistant чекає, поки ви позначите «Завжди дозволяти з цього комп’ютера» й натиснете «Дозволити» на панелі; далі він продовжує автоматично">
<img class="dark:sl-hidden" src="/screenshots/ha-authorize-light.png" width="580" height="354" alt="Home Assistant чекає, поки ви позначите «Завжди дозволяти з цього комп’ютера» й натиснете «Дозволити» на панелі; далі він продовжує автоматично">
</figure>
<figure>
<figcaption><span>5</span> Відкрийте сторінку налаштування панелі</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-done-dark.png" width="580" height="248" alt="Home Assistant пропонує сторінку налаштування панелі й просить повернутися та вибрати «Готово» після її завершення">
<img class="dark:sl-hidden" src="/screenshots/ha-done-light.png" width="580" height="248" alt="Home Assistant пропонує сторінку налаштування панелі й просить повернутися та вибрати «Готово» після її завершення">
</figure>
</div>

Якщо панель запитує, чи дозволити налагодження, позначте **Завжди дозволяти з цього комп’ютера** й натисніть **Дозволити** на панелі; Home Assistant продовжить сам. Потім підтвердьте встановлення.

У будь-якому разі клопітку частину майстер бере на себе. Він перевіряє, що вже є на панелі, встановлює поточний випуск застосунку панелі, запускає його й перевіряє, що він працює справно. Панель, на якій застосунок уже працює, береться під керування, а не перевстановлюється. Панель розпізнає власну модель і завантажує відповідний профіль обладнання, тож її екран, кнопки, світлодіоди й датчики з’являються в Home Assistant готовими до використання. Див. [Додавання панелі](/uk/install/installing-ha-paneld/).

## 4. Завершіть у власному майстрі панелі

Далі йде власний майстер налаштування панелі. Його надає сама панель, і він відкривається у браузері на комп’ютері, а не на екрані панелі. Після мережевого встановлення Home Assistant показує **Завершіть налаштування цієї панелі**: відкрийте сторінку налаштування панелі, завершіть кроки там, а потім поверніться до Home Assistant і виберіть **Готово**. Після встановлення через USB вікно інсталятора одразу переходить до майстра. Оскільки його надає панель, він завантажується лише у браузері в тій самій мережі.

Майстер запитує назву панелі, виконує вхід панелі до Home Assistant і запитує, яку інформаційну панель показувати та в якому приміщенні розташована панель. Панель підключається з тим обліковим записом Home Assistant, з яким ви увійдете: якщо у браузері ви увійшли як ви самі, панель може підключитися з вашим обліковим записом; щоб панель працювала з окремим обліковим записом, увійдіть із ним. З увімкненою фільтрацією сутностей панель завантажує лише сутності, які використовує ця інформаційна панель, і саме це робить її швидкою. Див. [Підключення панелі](/uk/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="Майстер налаштування панелі, крок за кроком" tabindex="0">
<figure>
<figcaption><span>1</span> Назвіть панель</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-name-dark.png" width="524" height="702" alt="Майстер налаштування панелі запитує ідентифікатор панелі та зрозумілу назву й показує, які імена сутностей використовуватиме Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-name-light.png" width="524" height="702" alt="Майстер налаштування панелі запитує ідентифікатор панелі та зрозумілу назву й показує, які імена сутностей використовуватиме Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Увійдіть до Home Assistant</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-sign-in-dark.png" width="524" height="688" alt="Майстер пропонує увійти з цього браузера або на панелі, використовуючи обліковий запис Home Assistant, з яким має підключатися панель">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-sign-in-light.png" width="524" height="688" alt="Майстер пропонує увійти з цього браузера або на панелі, використовуючи обліковий запис Home Assistant, з яким має підключатися панель">
</figure>
<figure>
<figcaption><span>3</span> Виберіть інформаційну панель і приміщення</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-dashboard-dark.png" width="524" height="485" alt="Майстер із вибраними для панелі інформаційною панеллю та приміщенням Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-dashboard-light.png" width="524" height="485" alt="Майстер із вибраними для панелі інформаційною панеллю та приміщенням Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Увімкніть фільтр сутностей, якщо з’явиться запит</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-filter-dark.png" width="524" height="636" alt="Майстер рекомендує фільтр сутностей для цієї панелі й показує кількість сутностей у Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-filter-light.png" width="524" height="636" alt="Майстер рекомендує фільтр сутностей для цієї панелі й показує кількість сутностей у Home Assistant">
</figure>
<figure>
<figcaption><span>5</span> Майже готово</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-almost-there-dark.png" width="524" height="339" alt="Майстер чекає, поки панель сформує відфільтрований набір сутностей і завантажить інформаційну панель">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-almost-there-light.png" width="524" height="339" alt="Майстер чекає, поки панель сформує відфільтрований набір сутностей і завантажить інформаційну панель">
</figure>
<figure>
<figcaption><span>6</span> Все готово</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-done-dark.png" width="524" height="526" alt="Майстер підтверджує, що панель налаштовано, і показує інформаційну панель">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-done-light.png" width="524" height="526" alt="Майстер підтверджує, що панель налаштовано, і показує інформаційну панель">
</figure>
</div>

## Що потрібно

- Home Assistant 2026.8.3 або новіший, з HACS.
- Настінна панель з ARM, Android 8.0 або новішим і доступом до налагодження. Більшість панелей працюють із загальним профілем обладнання, а на сторінці [Вибір панелі](/uk/install/supported-panels/) перелічено моделі з повною підтримкою обладнання.
- Для варіанта з USB — браузер на основі Chromium, наприклад Chrome або Edge.

## Де шукати подробиці

Сторінки розділу **Стабільна робота** докладно описують кожну функцію застосунку панелі. Розділ «Довідка» документує [API](/uk/reference/api/), [профілі обладнання](/uk/reference/profiles/) і [модель безпеки](/uk/reference/security/), а [сторінки про обладнання](/uk/hardware/) описують кожну підтримувану панель.
