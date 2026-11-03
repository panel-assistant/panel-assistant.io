---
title: Як зрозуміти звіт для підтримки
description: Ознайомтеся з відомостями про збій встановлення або оновлення Panel Assistant і поділіться ними, коли звертатиметеся по допомогу.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Якщо встановлення через мережу або оновлення застосунку панелі завершується збоєм, відкрийте відповідний пункт у розділі **«Налаштування» → «Виправлення проблем»** у Home Assistant і виберіть **Звіт для підтримки**. Звіт зберігає точні назви та значення полів у текстовому блоці, який можна скопіювати. Він починається з `panel_assistant.version` і `panel_assistant.build`, за якими йдуть `home_assistant.version` та Repair ID у `repair.issue_id`. Збережені події наведено в `events[N]`, де `N` починається з 0.

Якщо [встановлення через USB](/uk/install/install-over-usb/) завершилося збоєм, натомість відкрийте відомості для підтримки в засобі встановлення.

Прочитайте звіт, перш ніж ділитися ним. Він може містити адресу панелі, ідентифікатори пристроїв, відомості про випуск і трасування винятку. Видаліть усе, що не хочете розміщувати в публічному повідомленні про проблему. За можливості збережіть причину збою та супутні відомості: вони допомагають пояснити, що сталося.

Щоб отримати допомогу зі збоєм встановлення або оновлення, [створіть повідомлення про проблему з інтеграцією Home Assistant](https://panel-assistant.io/go/report-issue) і вставте звіт у текст повідомлення. Додайте, що ви робили, чого очікували та що сталося на панелі. Якщо панель доступна, [завантажені з неї діагностичні дані](/uk/manage/troubleshooting/) можуть надати додатковий контекст.

## Як читати поля

- `events[N]` містить збережені події в послідовному порядку, починаючи з `events[0]`. Пізніша подія може описувати призупинення повторної спроби, а не початковий збій.
- `kind` указує, чи виникла подія під час спроби `install`, `update` або `retry_hold`. `at`, якщо це поле наявне, містить зафіксований час.
- `panel` — це відображуване ім’я або адреса панелі; `address` — мережева ціль, яку використовував Home Assistant. `entry_id` ідентифікує запис інтеграції Home Assistant. `job_id` ідентифікує спробу встановлення.
- `reason` — це збережений результат або повідомлення про помилку. Для встановлення `receipt.result_code` містить загальний підсумок, а `receipt.failure_stage` указує, який крок виконувався на момент збою. `receipt.result_subcode`, якщо це поле наявне, уточнює діагноз; його значення може змінюватися між випусками.
- `target_version` і `artifact.*` описують випуск, вибраний для оновлення. `receipt.*` містить квитанцію встановлення, зокрема відомості про ціль і кроки. `exception` — це технічне трасування; його останні рядки часто вказують на безпосередній збій.

Результат встановлення `authorization_failed` означає, що Home Assistant не зміг отримати дозвіл на роботу з панеллю. `preflight_rejected` означає, що панель не пройшла перевірки перед встановленням. `artifact_rejected` означає, що вибраний файл застосунку не було прийнято. `transport_failed` означає, що стався збій зв’язку з панеллю. `install_failed` і `launch_failed` позначають кроки встановлення та запуску застосунку. `health_check_failed` означає, що застосунок не пройшов перевірку після встановлення. `ambiguous_mutation` або `verification_required` означає, що Home Assistant не зміг достовірно підтвердити стан панелі; перевірте панель перед наступною спробою. Для оновлення або повторної спроби в `reason` натомість може відображатися описове повідомлення про помилку.

## Попросіть ШІ-асистента допомогти прочитати звіт

Скопіюйте цей запит, а потім вставте після нього переглянутий вами звіт. Асистент може пояснити наведені дані та запропонувати перевірки, але лише зі звіту він не може побачити поточний стан панелі.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
