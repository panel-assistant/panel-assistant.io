---
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
title: 移除 ha-paneld 之前
description: 从面板移除 ha-paneld 会发生什么、哪些面板和固件可能失去返回 Android 设置的途径，以及应先检查什么。
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>您的面板：</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant 可以通过 Home Assistant 的 **配置** 下，面板的 **从此面板移除 Panel Assistant** 选项一步移除 ha-paneld（Panel Assistant 0.9 中称为“从此面板移除 ha-paneld”）。大多数面板只需如此操作。但某些面板移除后将失去进入 Android 设置或网络调试的途径；在按照厂商自身的方式恢复之前，任何工具（包括 Panel Assistant）都无法再次安装应用。在某些固件上，这意味着登录厂商账号，或通过 USB 连接计算机。

在尚未发布的 1.0.0-rc2 版本中，此选项名为**从此面板移除**，移除成功后还会从 Home Assistant 中删除该面板；没有保留其条目的选项。面板的设备页面上也有一个**从此面板移除**按钮。按下它不会移除任何内容：它会在**设置 → 系统 → 修复**下打开一个持续保留的修复项，名为**从 &lt;panel&gt; 移除 Panel Assistant**。请先阅读其中的警告，再选择一次**提交**以确认移除。如果您误按了此按钮，请关闭对话框，不要提交，并让修复项保持未确认状态。

删除 Home Assistant 中的面板条目后，ha-paneld 仍会保持安装状态。删除条目之前，请先使用上述移除选项移除该应用。

如果您已经删除了该条目，请在 Home Assistant 中重新添加面板，然后使用上述移除选项。

确认之前，请阅读对应面板的章节。

## 移除过程

1. ha-paneld 将主屏幕交回面板自身的启动器，并重新启用此前关闭的厂商应用。
2. Panel Assistant 在面板上检查，确认另一个启动器确实已接管主屏幕。如果没有，则停止操作，不移除任何内容。
3. Panel Assistant 使用其管理连接卸载 ha-paneld。面板上的 ha-paneld 设置会被删除。
4. 在 1.0.0-rc1 中，如果提交前选择了 **同时从 Home Assistant 删除此面板**，Home Assistant 也会忘记该面板。保持关闭即可保留其实体和历史记录。在尚未发布的 1.0.0-rc2 中，成功移除后始终会删除条目。

如果移除中途停止，请再次运行：它会从停止的位置继续。

## 在此面板上重新安装

首先，按照下方适用于您的面板的章节以及[准备面板](/zh-hans/install/prepare-a-panel/#1-开启开发者选项和调试)中的说明恢复调试功能。然后按照[添加面板](/zh-hans/install/installing-ha-paneld/)中的说明重新安装 Panel Assistant。移除会删除应用的设置；重新安装不会恢复这些设置。

## 面板为何可能无法恢复访问

如果启用且支持网络 ADB 持久化，ha-paneld 可以在重启后恢复它。移除后将失去此支持，厂商固件可能关闭调试，包括在重启后关闭。

只有当面板自身的主屏幕没有进入 Android 设置的方式时，这才会成为问题，因为需要在 Android 设置中重新开启调试。有些厂商主屏幕确实没有此入口。

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

eWeLink 主屏幕没有进入 Android 设置的入口，因此重新开启调试的难度取决于固件版本。

- **固件 4.0.0 及以后：** Sonoff 在面板菜单中加入了 F-Droid 入口，从中安装的应用可以从该菜单打开。移除 ha-paneld 之前，请从 F-Droid 安装一个应用启动器，它会将 Android 设置列为面板应用之一，方便以后重新开启调试。
- **低于 4.0.0 的固件：** 面板没有应用商店，也无法从面板进入 Android 设置。如果面板已关联 eWeLink 账号，可从 eWeLink 手机应用重新开启调试：在面板的设备设置中点按 _Device ID_，直到出现 _Developer mode_，然后在那里开启 ADB。以后再将面板关联到账号可能失败：有一块面板的配对码始终灰显，停留在等待状态。如果没有关联账号，剩下的方式是通过 USB 连接计算机并以恢复模式启动：参阅[获取 adb 和 root 访问权限](/zh-hans/hardware/panels/sonoff/#获取-adb-和-root-访问权限)。如果面板已关联 eWeLink，请在移除 ha-paneld 之前，在那里将其更新到 4.0.0 或更高版本。

应比较 eWeLink 应用和 Panel Assistant 显示的固件版本号（例如 4.0.12），而不是内部的 `ro.product.version`。参阅[各固件版本的特殊情况](/zh-hans/hardware/panels/sonoff/#各固件版本的特殊行为)。

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

Shelly 主屏幕没有进入 Android 设置的入口。在 X2i 上，可以从 Shelly 设置应用解锁开发者选项：参阅[解锁开发者模式](/zh-hans/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode)。其他 Wall Display 型号尚未确认有此途径，因此除非您知道如何重新开启调试，否则请将移除视为单向操作。

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

可以从面板设置应用打开开发者选项（点按版本号七次），USB 调试通过诊断应用工作：参阅[获取 adb 和 root 访问权限](/zh-hans/hardware/panels/tuya/tpa10/#获取-adb-和-root-访问权限)。网络调试如果被关闭，需要重新执行该 USB 步骤。

</div>

## 其他面板

<div class="removal-make" data-make="other">

如果面板自身的主屏幕可以打开 Android 设置，移除后会恢复安装 ha-paneld 之前的状态。如果不能，请在移除 ha-paneld 之前确保有其他开启调试的途径，例如可以打开设置的启动器。

</div>

## 移除前检查

- **查明固件版本。** Panel Assistant 链接到本页时会将版本显示在顶部。在 Home Assistant 的面板设备页面选择 **访问**，打开 ha-paneld 自身的页面（使用默认端口时，例如 `http://<panel>:8888`），其中列为 _固件_。
- **根据上方章节，了解您的面板和固件重新开启调试的方式。**
- **如果厂商主屏幕没有入口，请保留一个能打开 Android 设置的启动器。**
- **移除 ha-paneld 后，在完成仍需要调试的操作之前，不要重启面板。**

<script>
  // Panel Assistant links here with the panel's make, model and firmware
  // (make, model, fw). Each is optional; an unrecognised value is ignored.
  (() => {
    const query = new URLSearchParams(location.search);
    const clean = (value) =>
      value && /^[0-9A-Za-z][0-9A-Za-z ._+-]{0,79}$/.test(value) ? value : null;
    const make = clean(query.get('make'));
    const model = clean(query.get('model'));
    const fw = clean(query.get('fw'));
    const lower = (make || '').toLowerCase();
    const key = ['sonoff', 'shelly', 'tuya'].find((name) => lower.includes(name));
    if (!make && !fw) return;
    const box = document.getElementById('removal-this-panel');
    const name = [make, model].filter(Boolean).join(' ') || '未知面板';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}，固件 ${fw}` : name;
    let verdict = '请参阅下方对应面板的章节。';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? '此固件的菜单中有 F-Droid：移除 ha-paneld 之前，请从中安装应用启动器。'
          : '此固件无法从面板进入 Android 设置。重新开启调试需要使用 eWeLink 手机应用且面板已关联账号，或者连接计算机进行恢复启动。如果已关联，请先更新至 4.0.0 或更高版本。';
    }
    document.getElementById('removal-this-panel-verdict').textContent = verdict;
    box.hidden = false;
    const section = document.querySelector(`.removal-make[data-make="${key || 'other'}"]`);
    if (section) section.classList.add('removal-make-match');
  })();
</script>

<style>
  .removal-this-panel {
    border: 2px solid var(--sl-color-accent);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .removal-make-match {
    border-inline-start: 4px solid var(--sl-color-accent);
    padding-inline-start: 1rem;
  }
</style>
