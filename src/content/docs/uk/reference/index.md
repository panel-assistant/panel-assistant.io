---
title: Довідник
description: Технічний довідник застосунку панелі — сутності Home Assistant, профілі пристроїв, підхід до безпеки та збирання.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
sidebar:
  label: Огляд
  order: 0
---

Ці сторінки описують внутрішню роботу застосунку панелі: його інтерфейси, формат профілю кожної моделі панелі та рішення щодо безпеки, які лежать в основі обох. Для встановлення чи використання Panel Assistant вони не потрібні.

## Інтерфейси

- [Довідник керування та Home Assistant](/uk/reference/api/): сутності й сервіси для автоматизації панелі, а також її сторінки й кінцеві точки на HTTP-порту (типово 8888).
- [Підхід до безпеки](/uk/reference/security/): модель довіри, поверхня атаки та ухвалені рішення.

## Профілі пристроїв

- [Профілі панелей під час виконання](/uk/reference/profiles/): що таке профіль і як його написати, перевірити та активувати.
- [Формат профілю та сумісність](/uk/reference/profiles/format/): повний довідник полів schema-2.
- [Перевірка та усунення несправностей профілів](/uk/reference/profiles/testing/): поетапна перевірка обладнання та кроки відновлення.
- [Обмін профілями та внесок у проєкт](/uk/reference/profiles/sharing/): походження, безпечний обмін і вимоги до включення в застосунок.
- [Архітектура профілів пристроїв](/uk/reference/profiles/architecture/): як застосунок визначає, зіставляє та активує профілі.
- [Профілі панелей від спільноти](/uk/reference/profiles/community/): профілі панелей, які не постачаються із застосунком.
  - [Echo Show 5 Gen 2 (LineageOS)](/uk/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/uk/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/uk/reference/profiles/community/sunworld-yc-sm55p/)

## Код

- [Середовище розробки](/uk/reference/development-environment/): інструменти, скрипти збирання й відомості про підписування для форків.
- [Огляд коду на DeepWiki](https://deepwiki.com/panel-assistant/android): путівник вихідним кодом ha-paneld.
