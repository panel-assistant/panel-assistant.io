---
title: Panel security
description: Choose the Home Assistant account your panel uses and plan its network access.
---

## Which Home Assistant account does the panel use?

When you add a new panel from Panel Assistant, its browser sign-in normally uses the Home Assistant account already signed in on your computer. If that is your administrator account, the panel signs in as that administrator. Panel Assistant does not ask for your password or create another Home Assistant user. The panel keeps its own Home Assistant sign-in so it can load your dashboard and talk to Home Assistant as that user.

Using your usual account is fine, especially if your Home Assistant installation has only one user. A separate **existing** user is worthwhile if you want the panel's access to be distinct from your administrator account. Give that user access to the dashboards and controls the panel needs. A separate account is optional; Panel Assistant does not create one during setup.

### Change the panel's sign-in

In Home Assistant, open **Panel Assistant**, select the panel, then open its **Configure** tab. Under **Browser sign-in**, choose **Reconnect** and **Copy link**. Open that link in a private browser window, sign in to Home Assistant as the existing user you want the panel to use, and let the browser return to the panel. A private window helps when your usual browser is already signed in as the administrator. You can also open **Configure** directly on the panel and start browser sign-in there.

The browser must be able to reach both Home Assistant and the panel's local address to finish sign-in. The panel must be able to reach Home Assistant too. If you opened Configure remotely through Home Assistant but your browser cannot reach the panel's local address, complete sign-in while connected to the panel's network or directly on the panel.

## Put the panel on a separate network

A panel can use a VLAN without internet access if your firewall still lets the panel and Home Assistant reach each other, and a browser on your network can reach the panel when someone needs to sign in. The panel uses Home Assistant's local address for sign-in and its dashboard. Home Assistant also needs to reach the panel for management and updates.

Panel Assistant can fetch a verified panel-app update on the Home Assistant machine and send it to the panel over the local network. Home Assistant still needs access to the update source. The panel's own update checks use GitHub, and its automatic downloads for the separate Home Assistant app and Android System WebView also need internet access. Those panel-side checks and downloads will not work on a VLAN with no internet route, so plan how you will maintain those components if you use them.

Network separation limits which devices can reach the panel's web interface and API. It does not reduce the rights of a Home Assistant account already signed in on the panel. If the panel uses an administrator account, that sign-in remains an administrator sign-in even on an isolated VLAN. Choose the account and firewall rules to match what you trust on the wall and on the local network.

The panel's web interface and routine controls assume a trusted local network. Optional [Hardened mode](/manage/security-mode/) requires physical access to the panel for selected high-impact remote actions: someone must approve them on the panel's screen, and they cannot be approved remotely. It does not replace network separation or authenticate every API request.
