---
title: 入门
description: 只需几分钟，就能让尚未配置的 Android 墙面面板显示 Home Assistant 仪表盘，每一步都有 Home Assistant 引导。
sourceCommit: a0f4f4fce9c24d9c344dbb001c39a8eef9bdd679
---

如果你以前设置过墙面面板或自助终端，大概还记得那套过程：侧载应用、寻找能绘制仪表盘的浏览器引擎、猜测设置项的作用，还总担心下次重启会出问题。用 Panel Assistant 设置面板，会给你一个惊喜。几分钟就能完成，即使面板已经挂在墙上，你也不用离开椅子。好吧，也许需要一次 ;-)

任何面板最难的都是最初那一小时。Panel Assistant 在 Home Assistant 内替你完成这部分工作。如果面板已经连上网络，向集成提供地址，剩下的交给它。如果面板还在盒子里，用 USB 线连接笔记本电脑，在上墙之前直接从浏览器安装。两种方式都只需在面板上批准一次提示，然后看着安装完成。

## 1. 安装集成

通过 HACS 添加 Panel Assistant，然后重启 Home Assistant。这是唯一需要你手动安装的内容。从此以后，Home Assistant 会引导你完成操作。参见 [安装集成](/zh-hans/home-assistant/custom-integration/)。

## 2. 在面板上开启调试

在面板上打开开发者选项，开启无线调试；如果通过线缆连接面板，则开启 USB 调试。这样 Home Assistant 才能替你安装。[硬件页面](/zh-hans/hardware/)会说明各型号的开关在哪里，[准备面板](/zh-hans/install/prepare-a-panel/)中有详细步骤。

## 3. 添加面板

在 Home Assistant 中，依次打开**设置**、**设备与服务**、**添加集成**，然后选择 **Panel Assistant**。接下来选择面板的连接方式。

### 连接到你的计算机

全新面板可以在上墙之前完成设置。用 USB 线将它连接到计算机，直接从浏览器安装。此方式需要 Chrome 或 Edge。

<div class="pa-steps" role="region" aria-label="通过 USB 安装的详细步骤" tabindex="0">
<figure>
<figcaption><span>1</span> 选择“使用 USB 安装”</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
</figure>
<figure>
<figcaption><span>2</span> 连接面板</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="USB 安装程序要求连接面板并按下 Find my panel">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="USB 安装程序要求连接面板并按下 Find my panel">
</figure>
<figure>
<figcaption><span>3</span> 在面板上点按“允许”</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="USB 安装程序等待你在面板屏幕上点按“允许”">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="USB 安装程序等待你在面板屏幕上点按“允许”">
</figure>
<figure>
<figcaption><span>4</span> 按下“安装”</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="USB 安装程序已准备好安装，只有一个“安装”按钮">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="USB 安装程序已准备好安装，只有一个“安装”按钮">
</figure>
<figure>
<figcaption><span>5</span> 等待安装完成</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="应用安装过程中，USB 安装程序显示进度条">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="应用安装过程中，USB 安装程序显示进度条">
</figure>
<figure>
<figcaption><span>6</span> 完成</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="USB 安装程序确认安装完成，并打开面板设置">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="USB 安装程序确认安装完成，并打开面板设置">
</figure>
</div>

### 在你的网络中

如果面板已经挂在墙上，Home Assistant 只需要它的地址。

<div class="pa-steps" role="region" aria-label="添加网络中的面板的详细步骤" tabindex="0">
<figure>
<figcaption><span>1</span> 选择“添加网络中的面板”</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Home Assistant 的“设置面板”步骤，可选择“添加网络中的面板”或“在这台计算机上通过 USB 安装”">
</figure>
<figure>
<figcaption><span>2</span> 输入面板地址</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="“添加面板”步骤，已输入面板的 IP 地址">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="“添加面板”步骤，已输入面板的 IP 地址">
</figure>
<figure>
<figcaption><span>3</span> 选择版本</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="“选择版本”步骤，推荐版本位于列表顶部">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="“选择版本”步骤，推荐版本位于列表顶部">
</figure>
<figure>
<figcaption><span>4</span> 在面板上点按“允许”，即可添加</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="“成功”步骤，确认面板已添加到 Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="“成功”步骤，确认面板已添加到 Home Assistant">
</figure>
</div>

无论采用哪种方式，向导都会处理复杂的部分。它会检查面板上已有的内容，安装面板应用的当前版本，启动应用并确认运行正常。如果面板已经运行此应用，就直接接入，而不会重新安装。面板会识别自身型号并加载匹配的硬件配置文件，让屏幕、按钮、LED 和传感器在 Home Assistant 中即刻可用。参见 [添加面板](/zh-hans/install/installing-ha-paneld/)。

## 4. 在面板自身的向导中完成设置

随后，Home Assistant 会打开面板自身的设置向导，询问几个简单问题，包括面板名称和要在墙上显示的仪表盘。面板只加载该仪表盘显示的实体，这正是它保持快速运行的原因。参见 [连接面板](/zh-hans/home-assistant/connect-a-panel/)。

<div class="pa-steps pa-steps--panel" role="region" aria-label="面板设置向导的详细步骤" tabindex="0">
<figure>
<figcaption><span>1</span> 为面板命名</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="面板设置向导要求输入面板 ID 和友好名称，并预览 Home Assistant 将使用的实体名称">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="面板设置向导要求输入面板 ID 和友好名称，并预览 Home Assistant 将使用的实体名称">
</figure>
<figure>
<figcaption><span>2</span> 选择仪表盘和区域</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="向导中已为面板选择仪表盘和 Home Assistant 区域">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="向导中已为面板选择仪表盘和 Home Assistant 区域">
</figure>
<figure>
<figcaption><span>3</span> 开启实体筛选器</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="向导推荐为此面板开启实体筛选器，并显示 Home Assistant 实体数量">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="向导推荐为此面板开启实体筛选器，并显示 Home Assistant 实体数量">
</figure>
<figure>
<figcaption><span>4</span> 即将完成</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="向导等待面板构建筛选后的实体集合并加载仪表盘">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="向导等待面板构建筛选后的实体集合并加载仪表盘">
</figure>
<figure>
<figcaption><span>5</span> 全部就绪</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="向导确认面板设置完成，并显示仪表盘">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="向导确认面板设置完成，并显示仪表盘">
</figure>
</div>

## 所需条件

- Home Assistant 2026.8.3 或更新版本，并安装 HACS。
- 运行 Android 8.0 或更新版本的墙面面板。大多数面板都能使用通用硬件配置文件，[选择面板](/zh-hans/install/supported-panels/)列出了具有完整硬件支持的型号。
- 使用 USB 方式时，需要基于 Chromium 的浏览器，例如 Chrome 或 Edge。

## 在哪里查看详细说明

**保持正常运行**中的页面详细介绍了面板应用的各项功能。参考部分说明了 [API](/zh-hans/reference/api/)、[硬件配置文件](/zh-hans/reference/profiles/)和 [安全模型](/zh-hans/reference/security/)，[硬件页面](/zh-hans/hardware/)则介绍了每款受支持的面板。
