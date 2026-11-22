---
title: Echo Show 5 Gen 2 (LineageOS owner report)
description: What one owner reported on a 2021 Echo Show 5 with LineageOS 18.1, what remains unverified, and which panels to consider for Home Assistant.
---

:::caution
One contributor reported that ha-paneld ran well on their 2021 Echo Show 5 (2nd generation, `cronos`) with a community LineageOS 18.1 image. Panel Assistant has yet to confirm it on a device. Stock Fire OS is unsupported. We recommend choosing another panel if you are buying a Home Assistant dashboard. [Contributor report](https://github.com/panel-assistant/android/issues/28).
:::

## If you already own one

The report covers one unit already running LineageOS 18.1 (Android 11). The July 2026 reports show that ha-paneld ran with the Generic profile and that a later preliminary built-in profile recognised the device. They leave Home Assistant connection, dashboard and touch behaviour, dimming, sleep and wake, ambient-light readings and the current draft profile unverified. The report leaves other Echo Show models and the Kids edition unconfirmed. [First report](https://github.com/panel-assistant/android/issues/28), [follow-up diagnostic](https://github.com/panel-assistant/android/issues/28#issuecomment-4953127919), [raw observations](https://github.com/panel-assistant/android/issues/28#issuecomment-4983311989).

If your panel already runs LineageOS 18.1, you can try the [draft YAML](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml) using the [manual import procedure](/reference/profiles/community/). The draft requires both the `cronos` device codename and the model string `Amzn Echo Show 5 (2nd Generation)`. It declares Android brightness-based screen-off, Android ambient-light sensing and an Android-style `su` route. After restart, check the active profile, Home Assistant connection and each display feature you need before relying on it unattended. The app probes root on the running firmware.

The reported backlight node and values establish neither a supported brightness driver nor safe hardware limits.

On stock Fire OS, use the device as an Echo or choose another panel for Home Assistant. The project has no supported route from stock Fire OS to LineageOS, and community ROM maintenance and device recovery are outside the project's support scope.

## Amazon's platform

### Verified facts

Amazon lists security updates for the 2021 Echo Show 5 through at least 31 December 2029. It also lists the model for Matter smart-home control. The 5.5-inch display and 1 GB of RAM on the reported unit are worth weighing when you plan a dense dashboard. [Amazon security update list](https://digprjsurvey.amazon.com/csad/help/node/GMZQWNQRVENX4GTQ), [Amazon Matter compatibility](https://developer.amazon.com/docs/alexaplus/smarthome/matter-support), [device report](https://github.com/panel-assistant/android/issues/28).

Amazon sells sponsored placements on Echo Show home screens. Its help page says owners can turn off ad personalisation and that sponsored ads can still appear. [Amazon Ads announcement](https://advertising.amazon.com/en-gb/resources/whats-new/managed-service-ads-on-new-alexa-homescreen), [Amazon ad settings](https://digprjsurvey.amazon.com/csad/help/node/TqC5ruU7Qjys2SnYt8).

### Community views

Some Echo owners object to seeing paid placements on devices they already bought and describe that as ongoing monetisation. Some hobbyists describe restrictions on reusing Echo hardware as lock-in. [Echo owner discussion](https://www.reddit.com/r/alexa/comments/1rp7ple/echo_show_is_now_showing_interestbased_ads_on_my/), [hobbyist discussion](https://www.reddit.com/r/homelab/comments/1xyusbs/anyone_successfully_unlocking_echo_dot_4th_gen_or/).

### Panel Assistant's view

We favour devices that give owners a documented way to install and run their own software. We consider unilateral changes to terms after purchase and extensive collection of household data an overreach. For a Home Assistant dashboard, we give more weight to a documented installation route and confirmed behaviour on the firmware you can actually use.

## Better options for a Home Assistant dashboard

Start with the models marked **Full** in the [panel guide](/install/supported-panels/). Check the exact model and firmware before buying. The Echo is a tabletop display. Wall panels may need a suitable mounting box, mains wiring and an installer. Include those costs in your comparison.

These UK listings were checked on 22 November 2026. The used 2021 Echo Show 5 was **£44.98 delivered** in good condition. A **new** Echo Show 5 Gen 3 was **£69.99**, with standard delivery depending on postcode. The Gen 3 listing is a separate price reference and has no bearing on Gen 2 compatibility. Neither of the new wall panels priced below undercut the used Echo. [Used Gen 2 listing](https://www.cashconverters.co.uk/shop/music-tv--video/home-theatre-tvs--hifi-stereos/wired-speakers/smart-speaker/027700188681), [new Gen 3 listing](https://www.currys.co.uk/products/amazon-echo-show-5-3rd-gen-smart-display-with-alexa-charcoal-10251251.html).

| Panel                                                                                                                           | When to consider it                                                                                                                                                                             | Price checked                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Sonoff NSPanel Pro 86P](/hardware/panels/sonoff/nspanel-pro-86p/)                                                              | A compact wall panel for a few controls. Check firmware for debugging access and take the smaller screen into account. This is the original 86P.                                                | **£75 new**, standard delivery included in the listing. [SONOFF storefront](https://www.onbuy.com/gb/p/sonoff-nspanel-pro-smart-home-control-panel-86-type~p208961167/)             |
| [Shelly Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/)                                                            | A larger wall panel with a tested rootless route on specific firmware. Check first-time debugging access for the build you will receive. The X2i has its own evidence within the Shelly family. | **£159.99 new**, VAT included and eligible for free UK standard delivery under the seller's terms. [Shelly Store](https://shellystore.co.uk/product/shelly-wall-display-x2i-black/) |
| [Tuya TPA10](/hardware/panels/tuya/tpa10/)                                                                                      | A 10.1-inch wall panel for a larger dashboard. Check the rooted firmware and WebView requirements before ordering.                                                                              | No in-stock delivered UK price verified.                                                                                                                                            |
| [Sonoff NSPanel Pro 120P](/hardware/panels/sonoff/nspanel-pro-120p/) and [Electron WF1589T](/hardware/panels/electron/wf1589t/) | Two more Full entries. Compare their format and the firmware-specific installation route on each hardware page.                                                                                 | No quoted price.                                                                                                                                                                    |
