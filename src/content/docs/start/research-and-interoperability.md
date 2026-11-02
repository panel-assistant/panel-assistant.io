---
title: Research and interoperability
description: Panel Assistant exists to keep capable hardware in use securely, and to offer vendors a way out of building their own Home Assistant support.
---

Panel Assistant exists to keep capable hardware in use securely, and to offer vendors a way out of building their own Home Assistant support.

Many wall panels are sold for a single vendor's service and stranded when that service is discontinued or the product is abandoned. The hardware still works; without a way to repurpose it, it becomes landfill. Panel Assistant lets the owner of such a device run their own Home Assistant dashboard on it instead.

The longer goal is a universal path: a single, open integration that any vendor can adopt so their panel works with Home Assistant without the vendor writing or maintaining code of their own. The project uses simple text profiles to describe a device and give its owner reasonable access to the hardware they paid for. The code is open, the profiles are readable, and what a panel can do is visible to the person who owns it.

**Principles we work by:**

- **Owner's own hardware.** The work targets devices the operator owns or is explicitly authorised to modify. It is not a means to reach anyone else's device or account.
- **Respect the vendor's choices, up to the buyer's expectations.** We follow a vendor's security decisions, with one line drawn: where a policy removes capability that an end user paid for in good faith, and could reasonably expect to use, the owner should be able to recover that capability on hardware they own. The clearest case is a product the vendor has abandoned.
- **Security first.** This is a security-led project, not a feature-led one. A repurposed device should end up safer than it was, not less safe. Our intent is to exceed the protection that legacy firmware offers by staying current and open where that firmware is frozen: the app and integration are maintained and patched, and every sensor that could carry personal or sensitive information off the device is gated so a profile grants only what a dashboard needs. Microphones get that care first, as the most immediate exposure on a wall-mounted device, then cameras, and the same restraint applies to any sensor capable of exfiltrating identifiable or private data. The standard we hold ourselves to is to be better than the status quo, every release.
- **Documented in the open.** Methods, profiles, findings and limitations are published. There are no private techniques held back. Openness lets owners make an informed choice and lets vendors and the community review what we do.
- **Constructive use only.** The project is for lawful interoperability, repair, preservation and education. It is not for gaining unauthorised access, defeating protections on hardware you do not own, or distributing vendor keys or credentials.

Panel Assistant is open source under the Apache 2.0 licence. Contributions are welcome.
