---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 控制与 Home Assistant 参考
description: 用于自动化面板的 Home Assistant 实体与服务、面板自身页面，以及 REST API 的弃用说明。
---

通过 Home Assistant 自动化和监控面板。Panel Assistant 将每个面板发布为包含实体与服务的设备，提供自动化或仪表盘所需的一切。本页列出这些实体、面板自身页面和端点，以及 REST API 的状态。

## Home Assistant 实体

支持的实体无需 YAML 即可出现在 Home Assistant 中。实体 ID 默认采用下列形式，其中 `<panel>` 是已配置的面板 ID。当前设备配置文件声明某项能力不存在时，将省略相关硬件实体；可选的设置和诊断实体可在设置页面逐一显示或隐藏。

| 实体                                                     | 行为                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `light.<panel>_screen`                                   | 使用 Home Assistant 的 JSON 灯光模式控制屏幕开关和亮度，亮度值为 `0` 到 `255`。关闭方式由当前配置文件决定：面板提供物理背光关闭时使用该方式；已验证 `keyevent` 途径时使用 Android 休眠；否则回退到安全的亮度调暗。Android 休眠途径会拒绝受 PIN、图案或密码保护的面板。 |
| `light.<panel>_led`                                      | 根据可用后端，提供 RGB 或仅亮度控制的面板 LED；支持的后端还会提供效果。                                                                                                                                                                                                |
| `light.<panel>_buttons`                                  | 当前配置文件声明支持时，提供可调亮度的按钮背光。                                                                                                                                                                                                                       |
| `light.<panel>_button_led1` 至 `button_led4`             | 当前配置文件声明支持时，提供可单独控制的按钮 LED。                                                                                                                                                                                                                     |
| `switch.<panel>_relay1` 至 `relay4`                      | 当前配置文件声明支持时，提供硬件继电器。                                                                                                                                                                                                                               |
| `text.<panel>_navigate`                                  | 将仪表盘路径发送给当前渲染器。内置渲染器在进程内导航；外部渲染器接收深层链接。                                                                                                                                                                                         |
| `text.<panel>_home_dashboard`                            | 配置返回仪表盘操作使用的路径。                                                                                                                                                                                                                                         |
| `number.<panel>_volume`                                  | 仅无扬声器的面板提供：Android 音乐音频流的播报音量，范围 `0` 到 `100` 百分比。有扬声器的面板通过媒体播放器设置音量。                                                                                                                                                   |
| `event.<panel>_button`                                   | 启用 Android 无障碍按键捕获，或当前配置文件声明已验证的按键途径时，发布硬件按钮事件。                                                                                                                                                                                  |
| `sensor.<panel>_illuminance`                             | 面板具有标准 Android 光传感器时，提供以 lux 为单位的环境照度。                                                                                                                                                                                                         |
| `sensor.<panel>_temperature` / `sensor.<panel>_humidity` | 当前配置文件声明支持时，提供面板上的温湿度读数。                                                                                                                                                                                                                       |
| `binary_sensor.<panel>_proximity`                        | 校准后的近/远占用状态。本地模型可信之前保持不可用。                                                                                                                                                                                                                    |
| `sensor.<panel>_proximity_level`                         | 归一化接近程度，从校准远距离基线的 `0` 到校准近距离参考值的 `100`。                                                                                                                                                                                                    |
| `sensor.<panel>_zigbee_gateway_health`                   | 支持 Zigbee 的面板提供有范围限制的网关健康信息和已脱敏的诊断属性。                                                                                                                                                                                                     |
| `sensor.<panel>_storage_health`                          | 存储和 SQLite 健康诊断，包括可用空间、数据库增长和有限的完整性属性。严重空间压力或数据库失败也会导致安装程序验证失败；ha-paneld 不会自动回收数据。                                                                                                                     |
| `camera.<panel>_camera`                                  | 通过 RTSP 流提供面板摄像头实时画面和静态图像。默认关闭。在任何安全模式下，通过 Home Assistant 实体开启都需要在面板上批准；关闭不需要。还需要 Android 摄像头权限和可正常工作的摄像头使用指示器。                                                                        |
| `button.<panel>_reload`                                  | 在进程内重新加载内置渲染器，或重启所选外部渲染器。                                                                                                                                                                                                                     |
| `button.<panel>_reboot`                                  | 通过可用的特权途径重启。                                                                                                                                                                                                                                               |
| `media_player.<panel>_media_player`                      | 面板扬声器：播放 URL 或媒体源、在播放内容上播报、暂停、继续、停止，以及设置音量或静音。                                                                                                                                                                                |
| `sensor.<panel>_status`                                  | 面板是否为 `online`、`connected`（保持会话但已保存地址不响应）、因 `update`、`settings`、`recovery` 或 `reboot` 正在重启，或已登录另一个 Home Assistant。其属性包括 `reachable`、`connected`、`build`、`config_hash` 和 `home_assistant_state`。                       |

面板有麦克风时，Home Assistant 还会获得 `assist_satellite.<panel>` 实体：面板的[语音助手](/zh-hans/manage/voice-assistant/)。语音助手关闭时该实体不可用。

基于注册表的配置、性能和诊断实体仅在设置页面选择显示后才发布。可选诊断传感器包括上次启动时间、CPU 使用率、内存使用率、SoC 温度、IP 地址、Wi-Fi 网络、Wi-Fi 信号强度和 Wi-Fi 中断次数（24 小时）。

## 从 Home Assistant 自动化面板

使用面板实体和标准 Home Assistant 服务即可，无需直接调用面板。

- **播放音频或播报。** 对面板的媒体播放器实体调用 `media_player.play_media`，提供 URL 或媒体源。设置 `announce: true` 可在当前播放内容上播报。`media_player.media_pause`、`media_player.media_play`、`media_player.media_stop`、`media_player.volume_set` 和 `media_player.volume_mute` 与其他媒体播放器的用法相同。
- **设置音量。** 有扬声器的面板使用媒体播放器实体的 `media_player.volume_set`。无扬声器的面板则提供音量数值实体，使用 `number.set_value`。
- **控制屏幕和仪表盘。** 使用屏幕灯光、导航文本实体、主仪表盘文本实体和重新加载仪表盘按钮。
- **监控面板。** 观察状态传感器及其属性，以及上述诊断传感器。它们可替代脚本轮询健康状态行，Home Assistant 也会保留历史记录。

```yaml
action: media_player.play_media
target:
  entity_id: media_player.wall_panel_media_player
data:
  media_content_type: music
  media_content_id: https://example.com/doorbell.mp3
  announce: true
```

通过 HTTPS 获取音频时，使用 Android 平台信任存储和主机名验证。除非已在面板安装其 CA，否则会拒绝自签名证书；可信局域网来源仍可使用明文 HTTP。

## 面板自身页面与端点

在 Home Assistant 的面板设备页面选择**访问**，打开面板本地页面。每个面板在其 HTTP 端口提供一组固定且有限的路径，默认端口为 `8888`（例如 `http://<panel>:8888/`）。除此之外的路径没有文档，也不保证可用。

| 路径                          | 用途                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `/`                           | 面板状态、能力、诊断和当前仪表盘预览。这是 Home Assistant 设备的 `configuration_url`。 |
| `/setup`                      | 首次运行和重置后的引导流程，用于选择身份、连接、渲染器、主仪表盘和实体筛选。           |
| `/configure`                  | 渲染器和面板行为设置。                                                                 |
| `/profiles`                   | 设备配置文件选择、查看和 YAML 编写。                                                   |
| `/entities`                   | 内置渲染器的实体学习、策略和覆盖设置。                                                 |
| `/install`                    | 软件、备份、恢复和维护操作。                                                           |
| `/logs`                       | 已脱敏的实时应用日志。                                                                 |
| `/health` 和 `/api/v1/health` | 下文所述的单行健康报告。                                                               |
| `/diag` 和 `/api/v1/diag`     | 纯文本诊断报告。分享前请先检查。                                                       |
| `/ui`                         | 面板自身页面使用的套接字。它不是脚本接口，可能随版本变化。                             |

这些页面也从面板加载脚本、样式和图标。

### 健康状态行

健康状态行可包含 `ha=<state>`，状态为 `normal`、`shutting_down`、`starting`、`back_online` 或 `connection_lost`。Panel Assistant 发送原生生命周期通知；`connection_lost` 表示未收到关闭通知便断开连接，与主动关闭不同。

`ha_src=native` 表示通过 Panel Assistant 观察到的生命周期状态。本地推断的状态可省略此标记。不使用 MQTT 生命周期来源。

只要面板因任何原因保持已认证的 Home Assistant 套接字连接（Home Assistant 环境光或存在实体来源，或注册表监视），健康状态行也会报告测得的 Home Assistant 连接状况。`ha_net=<healthy|warning|severe>` 是**网络路径**的五分钟滚动判定：窗口中超过 5% 的探测未获响应时为 warning，连续两次未获响应时为 severe。往返延迟不会提高此判定，因为它也包含 Home Assistant 自身响应时间和面板线程调度；有线面板实际路径延迟不足两毫秒时，读数也可能达数百毫秒。此数值单独归类为 `ha_resp=<healthy|warning|severe>`，超过 100 ms 为 warning，超过 1,000 ms 为 severe，仅属于性能观察。`ha_net_p95=<ms>` 是应用自身 WebSocket ping 探测往返时间的最近秩第 95 百分位数（尚无探测响应时为 `-1`），`ha_net_n=<count>` 是窗口内探测次数，`ha_net_miss=<count>` 是未获响应次数，`ha_net_age=<ms>` 是距上次响应的时间（从未响应时为 `-1`），可用于区分刚建立连接的套接字与已停止探测的数据流。应用启动后的前三分钟仅报告 `ha_net=settling`，不形成判定，因为启动负载使往返时间反映面板而非连接。单次丢失或峰值不会触发警报。Home Assistant 自身造成的失败，例如重启时关闭或拒绝连接、拒绝登录，会单独计数，绝不计为网络丢失。如果探测未获响应，但仍有其他帧到达，包括较早探测的迟到响应，则属于服务器繁忙而非路径丢失：它计为服务器失败，共用套接字保持连接。测量依附于已认证套接字，而非希望建立连接的意图，因此面板实际连接并登录前不会出现这些标记；连接停止后也会消失（无凭据、没有需要套接字的功能，或连接已放弃）。曾经在线的套接字正在重建时，标记会保留，因为必须在网络中断期间报告它所解释的故障。因此健康判定始终明确写出，而不以省略表示。`/diag` 报告将两项判定放在一行 `[ha-network]` 中，绝不包含 Home Assistant 地址、网络名称或单次样本。旁边还报告对同一路径的第二项独立测量：面板向 Home Assistant 套接字实际连接的地址发送一小组 ICMP 回显请求，`/diag` 以一行 `[ha-path-probe]` 报告结果。此探测是间歇性的，不会持续运行；路径持续得到验证时，间隔逐渐增长，一旦出现异常便立即回到最短间隔。平台不允许应用使用 ICMP 套接字时报告 `state=unsupported`；实际收到回显前报告 `state=unproven`，此前的无响应不会计为丢失，否则位于反向代理后或过滤 ICMP 的主机上的 Home Assistant 即使连接正常也会被误报为网络完全失败。回显探测仅报告结果，不会触发面板警告。两行诊断在所有状态（包括 `unsupported`）下都会标明**套接字实际连接的地址族**（`family=ipv4` 或 `family=ipv6`），因为没有其他第三层证据时，了解面板使用哪个地址族尤其重要。它不是地址、主机名或网络名称。

设置页面可启动 Home Assistant 的正常浏览器登录。返回的链接可打开或复制到隐私浏览窗口，避免在面板输入凭据。Home Assistant 重定向到面板本地回调；ha-paneld 自行交换一次性代码，绝不向浏览器返回访问令牌或刷新令牌。回调与面板其他 HTTP 服务一样，只在通过可信局域网和 Host 检查后可用；它绑定到启动流程的面板地址，十分钟后过期，并发送 `no-store`/`no-referrer` 响应。

此服务有意采用可信局域网模型，而非通用身份验证。路由前会拒绝非局域网对端、无效 Host 标头，以及 Origin 或 Referer 不匹配的浏览器请求。请将面板 HTTP 服务置于可信网络中，不要直接暴露到互联网。可选的[加固模式](/zh-hans/manage/security-mode/)要求对受保护的直接局域网请求现场接触面板；[安全参考](/zh-hans/reference/security/)说明了完整安全设计。

## REST API 已弃用

`/api/v1` 下的 REST API 已弃用，不再发布其 OpenAPI 参考。面板不再提供某路径时，会返回 `410` 和 `{"error": "gone"}`。Panel Assistant 不再需要 REST API 时，面板便停止响应它。请使用 Home Assistant 进行自动化和监控。

## 配对与发现

ha-paneld 通过 `_ha-paneld._tcp.local.` 广播版本、能力、途径和友好名称元数据。每个响应器独有的不透明探测令牌让面板能检查当前广播是否仍在局域网可见；多次未找到后，会在有限重试次数内重建响应器，恢复尝试耗尽时诊断会发出警告。
