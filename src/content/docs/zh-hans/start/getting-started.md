---
title: 入门
description: 只需几分钟，就能让尚未配置的 Android 墙面面板显示 Home Assistant 仪表盘，每一步都有 Home Assistant 引导。
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

如果你以前设置过墙面面板或自助终端，大概还记得那套过程：侧载应用、寻找能绘制仪表盘的浏览器引擎、猜测设置项的作用，还总担心下次重启会出问题。用 Panel Assistant 设置面板，会给你一个惊喜。几分钟就能完成，即使面板已经挂在墙上，你也不用离开椅子。好吧，也许需要一次 ;-)

任何面板最难的都是最初一小时的设置。Panel Assistant 在 Home Assistant 内替你完成这一步。如果面板已接入你的网络，只需向集成提供面板地址，剩下的交给它。如果面板还未拆箱安装，用 USB 线将它接到笔记本电脑，即可在上墙之前直接从浏览器安装。如果面板要求授权调试，请在面板屏幕上接受提示，然后等待安装完成。

## 1. 安装集成

通过 HACS 添加 Panel Assistant，然后重启 Home Assistant。这是唯一需要你手动安装的内容。从此以后，Home Assistant 会引导你完成操作。参见 [安装集成](/zh-hans/home-assistant/custom-integration/)。

:::note
Panel Assistant 1.0 is a release candidate. HACS offers 0.9.0 by default. To try the release candidate, enable and turn on the **Pre-release** switch on the Panel Assistant device under **Settings**, **Devices and services**, **HACS**; [Install the integration](/zh-hans/home-assistant/custom-integration/) walks through the disabled-entity step. A panel that runs the 1.0 app cannot go back to 0.9; [Upgrading to 1.0](/zh-hans/manage/upgrade-to-1-0/) explains what changes.
:::

## 2. 在面板上开启调试

打开面板的开发者选项：大多数面板可以依次打开**设置**、**关于**，然后连续点按**版本号**七次。如果通过线缆连接面板，则开启 **USB 调试**；如果通过网络安装，则开启 **TCP 端口 5555 上的网络 ADB**。并非所有面板都有网络 ADB 开关；各型号的 [硬件页面](/zh-hans/hardware/)会说明是否提供该开关及其位置。如果没有，请使用 USB 方式。[准备面板](/zh-hans/install/prepare-a-panel/)提供了详细步骤。

## 3. 添加面板

在 Home Assistant 中，依次打开**设置**、**设备与服务**、**添加集成**，然后选择 **Panel Assistant**。接下来选择面板的连接方式。

### 连接到你的计算机

全新面板可以在上墙之前完成设置。用 USB 线将它连接到计算机，直接从浏览器安装。此方式需要 Chrome 或 Edge。选择**在这台计算机上通过 USB 安装**后，选择**打开 USB 安装程序**，保留推荐版本并按下**继续**；安装程序会在新窗口中打开。面板仍需 Wi-Fi 才能完成设置，因此请在安装之前或之后，使用面板自身的设置应用将它连接到你的网络。

<div class="pa-steps" role="region" aria-label="通过 USB 安装的详细步骤" tabindex="0">
<figure>
<figcaption><span>1</span> 选择“使用 USB 安装”</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
</figure>
<figure>
<figcaption><span>2</span> 连接面板，按下 查找我的面板，并从浏览器列表中选择面板</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-connect-dark.png" width="520" height="375" alt="USB 安装程序要求连接面板并按下 查找我的面板">
<img class="dark:sl-hidden" src="/screenshots/usb-connect-light.png" width="520" height="375" alt="USB 安装程序要求连接面板并按下 查找我的面板">
</figure>
<figure>
<figcaption><span>3</span> 如果面板询问，请在面板上允许调试</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-allow-dark.png" width="520" height="263" alt="USB 安装程序等待你在面板屏幕上点按“允许”">
<img class="dark:sl-hidden" src="/screenshots/usb-allow-light.png" width="520" height="263" alt="USB 安装程序等待你在面板屏幕上点按“允许”">
</figure>
<figure>
<figcaption><span>4</span> 按下“安装”</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-confirm-dark.png" width="520" height="323" alt="USB 安装程序已准备好安装，只有一个“安装”按钮">
<img class="dark:sl-hidden" src="/screenshots/usb-confirm-light.png" width="520" height="323" alt="USB 安装程序已准备好安装，只有一个“安装”按钮">
</figure>
<figure>
<figcaption><span>5</span> 等待安装完成</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-progress-dark.png" width="520" height="309" alt="应用安装过程中，USB 安装程序显示进度条">
<img class="dark:sl-hidden" src="/screenshots/usb-progress-light.png" width="520" height="309" alt="应用安装过程中，USB 安装程序显示进度条">
</figure>
<figure>
<figcaption><span>6</span> 完成</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-done-dark.png" width="520" height="308" alt="USB 安装程序确认安装完成，并打开面板设置">
<img class="dark:sl-hidden" src="/screenshots/usb-done-light.png" width="520" height="308" alt="USB 安装程序确认安装完成，并打开面板设置">
</figure>
</div>

### 在你的网络中

如果面板已经挂在墙上，Home Assistant 只需要它的地址。

<div class="pa-steps" role="region" aria-label="添加网络中的面板的详细步骤" tabindex="0">
<figure>
<figcaption><span>1</span> 选择“添加网络中的面板”</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
</figure>
<figure>
<figcaption><span>2</span> 输入面板地址</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-address-dark.png" width="580" height="377" alt="“添加面板”步骤，已输入面板的 IP 地址">
<img class="dark:sl-hidden" src="/screenshots/ha-address-light.png" width="580" height="377" alt="“添加面板”步骤，已输入面板的 IP 地址">
</figure>
<figure>
<figcaption><span>3</span> 选择版本</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-version-dark.png" width="580" height="304" alt="“选择版本”步骤，推荐版本位于列表顶部">
<img class="dark:sl-hidden" src="/screenshots/ha-version-light.png" width="580" height="304" alt="“选择版本”步骤，推荐版本位于列表顶部">
</figure>
<figure>
<figcaption><span>4</span> 如果面板询问，请在面板上允许调试</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-authorize-dark.png" width="580" height="354" alt="Home Assistant 等待你在面板上勾选“始终允许使用这台计算机进行调试”并点按“允许”；随后会自动继续">
<img class="dark:sl-hidden" src="/screenshots/ha-authorize-light.png" width="580" height="354" alt="Home Assistant 等待你在面板上勾选“始终允许使用这台计算机进行调试”并点按“允许”；随后会自动继续">
</figure>
<figure>
<figcaption><span>5</span> 打开面板的设置页面</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-done-dark.png" width="580" height="248" alt="Home Assistant 提供面板的设置页面，并要求完成设置后返回并选择“完成”">
<img class="dark:sl-hidden" src="/screenshots/ha-done-light.png" width="580" height="248" alt="Home Assistant 提供面板的设置页面，并要求完成设置后返回并选择“完成”">
</figure>
</div>

如果面板询问是否允许调试，请勾选**始终允许使用这台计算机进行调试**，并在面板上点按**允许**；Home Assistant 会自行继续。然后确认安装。

无论采用哪种方式，向导都会处理复杂的部分。它会检查面板上已有的内容，安装面板应用的当前版本，启动应用并确认运行正常。如果面板已经运行此应用，就直接接入，而不会重新安装。面板会识别自身型号并加载匹配的硬件配置文件，让屏幕、按钮、LED 和传感器在 Home Assistant 中即刻可用。参见 [添加面板](/zh-hans/install/installing-ha-paneld/)。

## 4. 在面板自身的向导中完成设置

接下来是面板自身的设置向导。它由面板提供，在计算机的浏览器中打开，而不是显示在面板屏幕上。网络安装完成后，Home Assistant 会显示**完成此面板的设置**：打开面板的设置页面，完成其中的步骤，然后返回 Home Assistant 并选择**完成**。USB 安装完成后，安装程序窗口会直接进入向导。由于向导由面板提供，只有与面板位于同一网络的浏览器才能加载它。

向导会要求为面板命名，让面板登录 Home Assistant，并询问要显示哪个仪表盘以及面板所在的区域。面板会以你登录时使用的 Home Assistant 账户连接，因此，如果浏览器已以你的身份登录，面板也可能以你的身份连接；如果希望面板使用独立账户，请改用该账户登录。启用实体筛选后，面板只加载该仪表盘使用的实体，从而保持快速响应。请参阅 [连接面板](/zh-hans/home-assistant/connect-a-panel/)。

<div class="pa-steps pa-steps--panel" role="region" aria-label="面板设置向导的详细步骤" tabindex="0">
<figure>
<figcaption><span>1</span> 为面板命名</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-name-dark.png" width="524" height="702" alt="面板设置向导要求输入面板 ID 和友好名称，并预览 Home Assistant 将使用的实体名称">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-name-light.png" width="524" height="702" alt="面板设置向导要求输入面板 ID 和友好名称，并预览 Home Assistant 将使用的实体名称">
</figure>
<figure>
<figcaption><span>2</span> 登录 Home Assistant</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-sign-in-dark.png" width="524" height="688" alt="向导提供从此浏览器或面板登录的选项，使用面板应以其身份连接的 Home Assistant 账户">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-sign-in-light.png" width="524" height="688" alt="向导提供从此浏览器或面板登录的选项，使用面板应以其身份连接的 Home Assistant 账户">
</figure>
<figure>
<figcaption><span>3</span> 选择仪表盘和区域</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-dashboard-dark.png" width="524" height="485" alt="向导中已为面板选择仪表盘和 Home Assistant 区域">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-dashboard-light.png" width="524" height="485" alt="向导中已为面板选择仪表盘和 Home Assistant 区域">
</figure>
<figure>
<figcaption><span>4</span> 如果向导询问，请开启实体筛选器</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-filter-dark.png" width="524" height="636" alt="向导推荐为此面板开启实体筛选器，并显示 Home Assistant 实体数量">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-filter-light.png" width="524" height="636" alt="向导推荐为此面板开启实体筛选器，并显示 Home Assistant 实体数量">
</figure>
<figure>
<figcaption><span>5</span> 即将完成</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-almost-there-dark.png" width="524" height="339" alt="向导等待面板构建筛选后的实体集合并加载仪表盘">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-almost-there-light.png" width="524" height="339" alt="向导等待面板构建筛选后的实体集合并加载仪表盘">
</figure>
<figure>
<figcaption><span>6</span> 全部就绪</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-done-dark.png" width="524" height="526" alt="向导确认面板设置完成，并显示仪表盘">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-done-light.png" width="524" height="526" alt="向导确认面板设置完成，并显示仪表盘">
</figure>
</div>

## 所需条件

- Home Assistant 2026.8.3 或更新版本，并安装 HACS。
- 一台运行 Android 8.0 或更新版本、可进行调试访问的 ARM 壁挂面板。大多数面板可使用通用硬件配置文件，[选择面板](/zh-hans/install/supported-panels/)列出了获得完整硬件支持的型号。
- 使用 USB 方式时，需要基于 Chromium 的浏览器，例如 Chrome 或 Edge。

## 在哪里查看详细说明

**保持正常运行**中的页面详细介绍了面板应用的各项功能。参考部分说明了 [API](/zh-hans/reference/api/)、[硬件配置文件](/zh-hans/reference/profiles/)和 [安全模型](/zh-hans/reference/security/)，[硬件页面](/zh-hans/hardware/)则介绍了每款受支持的面板。
