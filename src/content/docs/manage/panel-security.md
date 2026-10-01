---
title: Panel account and network security
description: Choose the Home Assistant account your panel uses and plan its network access.
---

## Which Home Assistant account does the panel use?

When you add a new panel from Panel Assistant, its browser sign-in normally uses the Home Assistant account already signed in on your computer. If that is your administrator account, the panel signs in as that administrator. Panel Assistant does not ask for your password or create another Home Assistant user. The panel keeps its own Home Assistant sign-in so it can load your dashboard and talk to Home Assistant as that user.

Using your usual account is fine, especially if your Home Assistant installation has only one user. A separate **existing** user is worthwhile if you want the panel's access to be distinct from your administrator account. A non-administrator user can use dashboards without access to Home Assistant settings. A separate account is optional; Panel Assistant does not create one during setup.

Home Assistant also saves a default dashboard and theme for each user. A panel user can have a wall dashboard and appearance without changing the choices on your phone or computer. The built-in renderer uses that default dashboard when **Home dashboard** is set to **Auto**; a dashboard selected in the panel settings takes priority. Its **Dashboard theme** setting can request light or dark mode, while an explicit Home Assistant theme choice still takes priority.

You can give the panel user its own sidebar items and order, language, time zone, and number, date and time formats in **Home Assistant → User profile → General**. Sidebar preferences matter when the sidebar is visible; the panel hides navigation by default. Hiding a sidebar item does not restrict access to it. See [Home Assistant's user profile guide](https://www.home-assistant.io/docs/configuration/user-configuration/) for these account settings.

### Change the panel's sign-in

In Home Assistant, open **Panel Assistant**, select the panel, then open its **Configure** tab. Under **Browser sign-in**, choose **Reconnect** and **Copy link**. Open that link in a private browser window, sign in to Home Assistant as the existing user you want the panel to use, and let the browser return to the panel. A private window helps when your usual browser is already signed in as the administrator. You can also open **Configure** directly on the panel and start browser sign-in there. If Home Assistant then reports a panel user mismatch under **Settings → Repairs**, confirm that the named new user is the one you chose.

The browser must be able to reach both Home Assistant and the panel's local address to finish sign-in. The panel must be able to reach Home Assistant too. If you opened Configure remotely through Home Assistant but your browser cannot reach the panel's local address, complete sign-in while connected to the panel's network or directly on the panel.

## Put the panel on a separate network

A panel can use a VLAN without internet access if your firewall still lets the panel and Home Assistant reach each other, and a browser on your network can reach the panel when someone needs to sign in. The panel uses Home Assistant's local address for sign-in and its dashboard. Home Assistant also needs to reach the panel for management and updates.

Panel Assistant can fetch a verified panel-app update on the Home Assistant machine and send it to the panel over the local network. Home Assistant still needs access to the update source. The panel's version checks and owner-started installations from its Install tab use GitHub and also need internet access. Those checks and downloads will not work on a VLAN with no internet route. Android System WebView is maintained separately through the Play Store, vendor firmware or a manual installation, so plan how you will maintain it too.

Network separation limits which devices can reach the panel's web interface and API. It does not reduce the rights of a Home Assistant account already signed in on the panel. If the panel uses an administrator account, that sign-in remains an administrator sign-in even on an isolated VLAN. Choose the account and firewall rules to match what you trust on the wall and on the local network.

The panel's web interface and routine controls assume a trusted local network. Optional [Hardened mode](/manage/security-mode/) requires physical access to the panel for selected high-impact remote actions: someone must approve them on the panel's screen, and they cannot be approved remotely. It does not replace network separation or authenticate every API request.
