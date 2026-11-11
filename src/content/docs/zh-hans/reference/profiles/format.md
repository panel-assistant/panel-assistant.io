---
title: 配置文件格式与兼容性
description: 模式 2 面板配置文件的带注释概览，涵盖面板应用强制执行的验证、匹配和兼容性规则。
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

运行时面板配置文件是采用封闭、版本化模式的 YAML 文档。支持配置文件的面板在配置文件页面提供机器可读的编写描述符和驱动目录；本页为带注释的概览。已安装构建的完整字段和驱动词汇请以配置文件页面为准。本页解释文档模型和兼容性规则，不能代替目标 ha-paneld 版本的验证。

## 文档模型

每个配置文件包含以下概念部分：

| 部分       | 用途                                                                         |
| ---------- | ---------------------------------------------------------------------------- |
| 模式       | 选择 ha-paneld 理解的配置文件文档语言。                                      |
| 标识       | 稳定配置文件 ID 和独立版本化的内容。                                         |
| 元数据     | 人类可读名称、作者、来源、仅显示链接、许可证、成熟度、已测试固件和已知限制。 |
| 要求       | 最低兼容 ha-paneld 核心，以及文档所需的已编译驱动/功能。                     |
| 匹配       | 针对面板指纹的有界规则。                                                     |
| 能力与驱动 | 硬件事实、已编译驱动选择和类型化参数。                                       |
| 命名策略   | 针对少量受支持、依赖固件/型号的值的可选核心规则。                            |
| 配置意图   | 访问指引、软件/显示建议、软件包期望状态及选定核心配方；绝非权限授予。        |

根字段包括 `schema`、`id`、`version`、`display_name`、`soc_class`、`soc`、`metadata`、`requires`、`match`、`platform`、`hardware`、`sensors`、`identity`、`input`、`cpu`、`display` 和 `provisioning`。字段名采用小写 `snake_case`；除非字段说明另有规定，值区分大小写。参见[最小社区示例](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml)。

精确的允许枚举值和驱动/制品词汇，由运行版本提供的模式和驱动目录定义。请使用将激活配置文件的同一发行版本进行验证。

## 封闭模式

未知字段会报错。这能发现拼写错误，避免悄然丢失安全属性或遗漏能力配置。模式 2 没有自由扩展区。作者、HTTPS 来源、SPDX 风格许可证、`draft`/`experimental`/`verified` 成熟度、已测试固件和限制应放入 `metadata`；这些值不能定义匹配、驱动、访问或运行时行为。

重复 YAML 键、别名和递归键会报错。仅允许一个 YAML 文档。YAML 标签不能构造应用或 Java 对象，配置文件不能包含正则表达式谓词。加载器最多接受 20 层嵌套、20,000 个解析事件、单个映射或列表 512 项、单个字符串 16,384 个字符。即使 YAML 编辑器支持更复杂语法，也应保持文档简单明确。

每个 YAML 修订版限制为 128 KiB。本地导入目录还限制为总计 128 个修订版、每个配置文件 ID 16 个修订版及 4 MiB YAML。保存更多之前，请导出并删除过时的非活动修订版；活动、待处理和最近已知良好修订版受保护。这些限制避免交换配置文件耗尽面板存储，或使启动时解析无界目录。

必填字段不能为 null。对于可选字段，当前读取器通常将 null 视为缺失，但作者应省略未知值以明确意图。空字符串、空列表/映射、零和 false 都是实际值，可能不同于省略或文档规定的默认值。

## 标识与版本

使用稳定且可区分的配置文件 ID：1 至 128 个小写 ASCII 字母或数字，点号和连字符只能出现在内部，不允许连续点号。通用型号名可能冲突时，建议加作者或组织前缀，例如 `org.example.wallpanel-x1`。若一个配置文件及其命名策略可覆盖整个硬件系列，不要将固件号放入 ID。

配置文件内容版本由作者管理，在知识或行为变化时更新。共享配置文件应采用语义化版本：

- patch：不改变匹配或运行时行为的澄清或元数据；
- minor：新增能力信息、新的兼容固件版本或更安全的建议；
- major：改变匹配标识、驱动选择、特权需求或其他值得主动迁移的变更。

模式版本属于 ha-paneld。作者不得通过增加它来给自己的配置文件编号。

## 带注释的模式 2 字段概览

“必填”表示该键必须存在且符合所述类型。“可选；默认……”表示省略（或可选字段为 null）会产生该值。任何层级的未知键均报错。检查更窄字段范围之前，所有整数必须符合有符号 32 位范围；字段使用数值时，所有数值转换为 32 位浮点数后必须仍为有限值。

### 根字段

| 字段           | 是否必需        | 类型与验证                                                                                                                                          |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | 必填            | 整数；必须为 `2`。不接受模式 1。                                                                                                                    |
| `id`           | 必填            | 字符串，1 至 128 个字符；小写 ASCII 字母/数字，`.` 或 `-` 仅可位于内部；禁止 `..`。                                                                 |
| `version`      | 必填            | 配置文件内容版本：恰好三个点分部分，各为 `0` 或无前导零的 1 至 9 位数字；可选点分预发布标识，由 ASCII 字母、数字和 `-` 构成；不允许构建元数据后缀。 |
| `display_name` | 必填            | 非空白字符串，1 至 100 个字符。                                                                                                                     |
| `soc_class`    | 必填            | 非空白字符串，1 至 100 个字符。                                                                                                                     |
| `soc`          | 可选；默认缺失  | 有配置文件证据支持的结构化 SoC 事实；字段见下文。                                                                                                   |
| `metadata`     | 必填            | 映射；字段见下文。                                                                                                                                  |
| `requires`     | 必填            | 映射；字段见下文。                                                                                                                                  |
| `match`        | 必填            | 映射；字段见下文。                                                                                                                                  |
| `platform`     | 必填            | 映射；字段见下文。                                                                                                                                  |
| `hardware`     | 必填            | 映射；字段见下文。                                                                                                                                  |
| `sensors`      | 可选；默认 `{}` | 映射；字段见下文。                                                                                                                                  |
| `identity`     | 可选；默认 `{}` | 映射；字段见下文。                                                                                                                                  |
| `input`        | 可选；默认 `{}` | 映射；字段见下文。                                                                                                                                  |
| `cpu`          | 可选；默认 `{}` | 映射；字段见下文。                                                                                                                                  |
| `display`      | 可选；默认 `{}` | 物理显示屏事实；字段见下文。                                                                                                                        |
| `provisioning` | 必填            | 配置意图映射；字段见下文。                                                                                                                          |

### `metadata` 和 `requires`

| 字段                        | 是否必需        | 类型与验证                                                                                                                                            |
| --------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.author`           | 必填            | 非空白字符串，1 至 100 个字符。                                                                                                                       |
| `metadata.source`           | 可选；默认缺失  | 绝对 HTTPS URL，最多 500 个字符，主机非空且无用户信息部分。                                                                                           |
| `metadata.links`            | 可选；默认 `[]` | 最多八个仅供显示的外部链接。ha-paneld 绝不抓取、预加载或将其用于配置。URL 和标签必须唯一，且链接不得重复 `metadata.source`。                          |
| `metadata.links[].label`    | 每项必填        | 非空白显示标签，1 至 48 个字符，不含控制或双向格式字符。配置文件界面还会以隔离文本段显示目标主机名。                                                  |
| `metadata.links[].url`      | 每项必填        | 绝对 HTTPS URL，遵循与 `metadata.source` 相同的 500 字符、主机及禁止用户信息规则。                                                                    |
| `metadata.license`          | 必填            | SPDX 风格字符串，由一个或多个符合 `[A-Za-z0-9][A-Za-z0-9.+-]*` 的 1 至 64 字符标识组成，仅以 `AND` 或 `OR` 分隔。不接受括号、`WITH` 或任意文字。      |
| `metadata.maturity`         | 必填            | `draft`、`experimental` 或 `verified`。                                                                                                               |
| `metadata.tested_firmware`  | 可选；默认 `[]` | 最多 32 个非空白字符串，各最多 120 个字符。                                                                                                           |
| `metadata.limitations`      | 可选；默认 `[]` | 最多 32 个非空白字符串，各最多 500 个字符。                                                                                                           |
| `requires.min_core_version` | 可选；默认缺失  | 点分发行版本，最多 64 个字符：1 至 4 个数值部分，各为 1 至 6 位数字，可带点分 ASCII 字母数字/`-` 预发布后缀。运行核心必须相等或更新，包括预发布顺序。 |
| `requires.drivers`          | 必填            | 核心驱动 ID 列表。未知 ID 报错；已填写能力所需的驱动必须列入。未使用的驱动产生警告。                                                                  |

### `soc`

`soc_class` 仍是必填的宽泛系列标签。可选结构块记录 Android 通常无法可靠识别的事实，例如标称四核面板使用 Cortex-A35 还是 Cortex-A55 核心。这些值显示在仪表盘和配置文件页面，但不包含于简短的公开 `/diag` 报告。仅添加有公开来源或硬件证据支持的事实；未知字段应省略，不要猜测。

| 字段                           | 是否必需          | 类型与验证                                                                 |
| ------------------------------ | ----------------- | -------------------------------------------------------------------------- |
| `soc.model`                    | 存在 `soc` 时必填 | 非空白型号名，1 至 100 个字符，不含 C0 或 DEL 控制字符。                   |
| `soc.introduced_year`          | 可选；默认缺失    | 1970 至 2100 的整数。使用 SoC 公开推出年份，而非面板上市年份。             |
| `soc.cpu_cores`                | 可选；默认 `[]`   | 最多八个架构簇，总计 256 个核心。空列表表示型号已知，但 CPU 拓扑证据不足。 |
| `soc.cpu_cores[].architecture` | 每项必填          | 非空白核心架构，1 至 64 个字符，不含控制字符；忽略大小写时架构必须唯一。   |
| `soc.cpu_cores[].count`        | 每项必填          | 1 至 128 的整数。                                                          |

### `match`

`match.any` 在组之间为 OR；一个组的 `all` 列表在谓词之间为 AND；一个谓词的 `values` 列表为 OR。比较区分大小写，所比较的构建事实已由 ha-paneld 转为小写。

| 字段                       | 是否必需 | 类型与验证                                                                            |
| -------------------------- | -------- | ------------------------------------------------------------------------------------- |
| `match.priority`           | 必填     | 0 至 1000 的整数；匹配组优先级之后用于决胜。                                          |
| `match.fallback`           | 必填     | 布尔值。仅 ID 为 `generic` 的内置配置文件可为 `true`；导入/社区配置文件不能作为回退。 |
| `match.any`                | 必填     | 最多 64 个组对象。非回退配置文件至少需要一组；内置通用配置可用空列表。                |
| `match.any[].priority`     | 必填     | 0 至 1000 的整数；分支具体程度优先于配置文件优先级。                                  |
| `match.any[].all`          | 必填     | 1 至 8 个谓词对象的列表。                                                             |
| `match.any[].all[].field`  | 必填     | `model`、`device` 或 `product_version`。                                              |
| `match.any[].all[].op`     | 必填     | `equals`、`starts_with` 或 `contains`。                                               |
| `match.any[].all[].values` | 必填     | 1 至 32 个非空白小写字符串；各最多 100 个字符，不得含 C0 或 DEL 控制字符。            |

### `platform` 和 `hardware`

| 字段                                     | 是否必需              | 类型与验证                                                                                                                                                                                                                                                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform.su_form`                       | 必填                  | `none`、`android` 或 `toolbox`。                                                                                                                                                                                                                                                 |
| `platform.app_can_su`                    | 必填                  | 布尔值。`su_form` 为 `none` 时必须为 `false`；受沙箱隔离的应用也可在 `android` 或 `toolbox` 形式下声明 `false`。                                                                                                                                                                 |
| `platform.has_recents`                   | 可选；默认 `true`     | 布尔值。                                                                                                                                                                                                                                                                         |
| `platform.has_native_navbar`             | 可选；默认缺失        | 省略则探测固件导航栏可见性。明确的 `true` 或 `false` 覆盖探测结果。                                                                                                                                                                                                              |
| `platform.launcher.vendor_home_packages` | 可选；默认空          | 最多 8 个不重复的 Android 包名。注册为 Android 主屏幕但不是应用抽屉的厂商应用，例如厂商控制应用。导航栏的启动器按钮跳过它们；无其他合格应用时打开面板启动器，其中仍将它们列为应用。                                                                                              |
| `hardware.led`                           | 必填                  | 包含下列 LED 字段的映射。                                                                                                                                                                                                                                                        |
| `hardware.led.mechanism`                 | 必填                  | `none`、`autodetect`、`rk3576-ioctl`、`rk3576-ioctl-daemon` 或 `sysfs-daemon`。`platform.app_can_su` 为 `true` 时拒绝仅守护进程机制。                                                                                                                                            |
| `hardware.led.transfer`                  | 可选；默认 `identity` | 选择已编译传递曲线。例如 `identity`、`rk3576-four-bit`、`perceptual`、`gamma` 和实测 `points`；参数以提供的模式为准。                                                                                                                                                            |
| `hardware.screen_off`                    | 必填                  | 选择已编译关屏驱动，如 `brightness-zero`、`su-blpower`、`daemon-blpower`、`keyevent`、`screen-timeout`、`device-admin` 或 `vendor-rpc`。权限和本地唤醒要求取决于所选途径；请使用提供的模式并在硬件上验证。                                                                       |
| `hardware.has_button_backlight`          | 可选；默认 `false`    | 布尔值；为 true 时选择有界、由辅助程序支持的按键背光能力。                                                                                                                                                                                                                       |
| `hardware.local_wake`                    | 可选；默认缺失        | 从 `touch`、`proximity` 和 `button` 中选取唯一值的列表：完全黑屏时可在面板本机唤醒的方式。`touch` 表示任意触摸唤醒，`proximity` 表示校准接近检测后挥手唤醒，`button` 表示实体按键唤醒。未知时省略；空列表声明仅 Home Assistant 可唤醒。Home Assistant 始终可唤醒，因此绝不列入。 |
| `hardware.zigbee_gateway_dir`            | 可选；默认缺失        | 允许列表中的精确路径 `/vendor/bin/siliconlabs_host`；不接受其他路径。                                                                                                                                                                                                            |
| `hardware.relay_base`                    | 可选；默认缺失        | 允许列表中的一个精确路径：`/sys/class/relay`、`/sys/class/st_relay` 或 `/sys/class/strelay`。                                                                                                                                                                                    |
| `hardware.relay_base_fallbacks`          | 可选；默认 `[]`       | 同一继电器允许列表中的最多三个路径。条目必须唯一，不得重复 `relay_base`。                                                                                                                                                                                                        |
| `hardware.button_led_gpio_base`          | 可选；默认缺失        | 0 至 4092 的整数，表示连续四个 GPIO 中的第一个。                                                                                                                                                                                                                                 |
| `hardware.camera`                        | 可选；默认缺失        | 三态布尔值：省略允许 Android 枚举，`true` 即使枚举失败也声明候选，`false` 禁用摄像头。采集始终要求附着于屏幕的指示器；显示屏关闭时还要求实时 LED 指示。没有关屏指示时，显示屏关闭即停止采集。                                                                                    |
| `hardware.microphone`                    | 可选；默认缺失        | `true` 声明已证实的麦克风，`false` 禁用，省略则先使用 Android 内置麦克风枚举，再在监听前检查采集。与摄像头是否存在无关。                                                                                                                                                         |
| `hardware.camera_lens_offset_px`         | 可选                  | 整数；从有效显示区顶部到摄像头镜头中心的屏幕像素数。摄像头使用指示灯绘制为以镜头为中心的弧线，因此此值决定其位置；这是边框测量值，因主板而异。未测量时省略，指示灯会使用默认值。                                                                                                 |
| `hardware.touch_click_gain`              | 可选；默认 `0.2`      | 0.05 至 1.0 的数值；用于调整系统默认触摸点击反馈过响或过轻的主板音量。                                                                                                                                                                                                           |

### `sensors` 和 `identity`

| 字段                            | 是否必需                  | 类型与验证                                                                                          |
| ------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| `sensors.proximity_technology`  | 可选；默认缺失            | 非空白字符串，1 至 100 个字符，不含 C0 或 DEL 控制字符。存在时声明使用 Android 接近传感器。         |
| `sensors.proximity_gpio`        | 可选；默认缺失            | 0 至 4095 的整数，用于受支持、依赖 root 的二值 GPIO 途径。                                          |
| `sensors.light_technology`      | 可选；默认缺失            | 非空白字符串，1 至 100 个字符，不含 C0 或 DEL 控制字符。存在时声明使用 Android 环境光传感器。       |
| `sensors.vi530x`                | 可选；默认 `false`        | 布尔值；提供由辅助程序通过 ioctl 启动、随后轮询的 VI530x 飞行时间测距来源。需要经过认证的辅助程序。 |
| `sensors.cht8305`               | 可选；默认 `false`        | 布尔值；通过已认证辅助程序途径启用核心精确支持、兼容 CHT8305 的室内温湿度输入。                     |
| `sensors.room_temp_offset_c`    | 可选；默认 `0.0`          | -30 至 30 °C 的有限数值。                                                                           |
| `identity.manufacturer`         | 可选；默认缺失            | 非空白字符串，1 至 100 个字符，不含 C0 或 DEL 控制字符；缺失表示运行时推断。                        |
| `identity.model`                | 可选；默认缺失            | 非空白字符串，1 至 100 个字符，不含 C0 或 DEL 控制字符；缺失表示运行时推断。                        |
| `identity.model_label_strategy` | 可选；默认 `display-name` | `display-name` 或 `nspanel-product-version`。                                                       |

已存储的模式 2 修订版可能包含 `proximity_near_below`、`proximity_near_raw`、`proximity_far_raw` 或 `proximity_graded_strategy`。加载器仅将这些退役键作为兼容占位接受：加载时忽略，序列化配置文件文档时省略。导出不可变的已存储修订版会保留原始字节。运行时使用已校准的传感器配置默认值或已保存的引导设置，并在报告归一化值前检查实时来源。

### `input`、`cpu` 和 `display`

| 字段                               | 是否必需           | 类型与验证                                                                                                            |
| ---------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `input.evdev_buttons`              | 可选；默认 `[]`    | 最多 32 个 evdev 映射对象。即使节点不同，也拒绝重复 `(sw, code)` 对。                                                 |
| `input.evdev_buttons[].node`       | 每项必填           | 匹配 `/dev/input/eventN` 的字符串，`N` 为 1 至 3 位十进制数字。不接受其他设备路径。                                   |
| `input.evdev_buttons[].code`       | 每项必填           | 1 至 767 的整数 Linux 输入/开关码。                                                                                   |
| `input.evdev_buttons[].grab`       | 每项必填           | 布尔值；true 请求独占 `EVIOCGRAB`。                                                                                   |
| `input.evdev_buttons[].event_type` | 每项必填           | 最多 64 个字符、匹配 `KEYCODE_[A-Z0-9_]+` 的字符串。                                                                  |
| `input.evdev_buttons[].sw`         | 可选；默认 `false` | 布尔值；false 选择 `EV_KEY`，true 选择 `EV_SW`。                                                                      |
| `cpu.governors`                    | 可选；默认缺失     | 映射，仅允许键 `Performance`、`Efficiency` 和 `Auto`。各值为 1 至 32 个字符、匹配 `[a-z][a-z0-9_-]*` 的调频策略名称。 |
| `display.physical_ppi`             | 可选；默认缺失     | 50 至 1000 的整数。                                                                                                   |

### `provisioning`

| 字段                                          | 是否必需           | 类型与验证                                                                                                                                    |
| --------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioning.access`                         | 可选；默认 `{}`    | 访问建议映射。                                                                                                                                |
| `provisioning.access.shizuku`                 | 退役兼容字段       | 接受并忽略旧值，不提供运行时访问途径。                                                                                                        |
| `provisioning.software`                       | 可选；默认 `{}`    | 核心管理的软件策略映射。                                                                                                                      |
| `provisioning.software.webview.artifact`      | 可选；默认缺失     | 核心管理的 ID：`lineageos-138-arm`、`lineageos-150-arm` 或 `lineageos-150-arm64`。配置文件不能提供 URL、版本或签名者哈希。                    |
| `provisioning.software.companion.max_version` | 可选；默认缺失     | 点分发行版本，语法和 64 字符限制与 `requires.min_core_version` 相同。                                                                         |
| `provisioning.display.density`                | 可选；默认缺失     | 80 至 640 dpi 的整数，或命名策略 `nspanel-variant`。                                                                                          |
| `provisioning.display.font_scale`             | 可选；默认缺失     | 0.5 至 1.5 的有限数值。                                                                                                                       |
| `provisioning.packages`                       | 可选；默认 `[]`    | 0 至 128 个软件包期望状态对象。                                                                                                               |
| `provisioning.packages[].package`             | 每项必填           | 唯一 Android 包名，匹配 `[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+`。                                                                           |
| `provisioning.packages[].desired_state`       | 每项必填           | `disabled`。描述目标状态，不代表执行许可。                                                                                                    |
| `provisioning.packages[].importance`          | 每项必填           | `recommended` 或 `optional`。重要性仅控制显示，绝不表示默认应用。                                                                             |
| `provisioning.packages[].tags`                | 可选；默认 `[]`    | 最多八个标签。各为 1 至 24 个字符，以小写 ASCII 字母开头，之后仅含小写字母、数字或 `-`。                                                      |
| `provisioning.packages[].note`                | 可选；默认空字符串 | 最多 500 个字符的字符串。备注是补充解释，不是操作流程。                                                                                       |
| `provisioning.recipes`                        | 可选；默认 `[]`    | 最多 32 个核心管理的配方选择。                                                                                                                |
| `provisioning.recipes[].id`                   | 每项必填           | 唯一注册 ID。模式 2 认识 `nspanel-pro.watchdog-e2big-repair` 和 `tpa10.vendor-stack-minimize`。配方条目不能包含参数、命令、URL 或工作流定义。 |

三个 WebView ID 解析为以下核心管理的构建和兼容性元数据：

| 制品 ID               | 核心管理的构建                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `lineageos-138-arm`   | LineageOS System WebView `138.0.7204.63`; ARM ABIs `armeabi-v7a` 和 `arm64-v8a`; Android 8–9.           |
| `lineageos-150-arm`   | LineageOS System WebView `150.0.7871.63`; ARM ABI `armeabi-v7a`; Android 10 或更新版本.                 |
| `lineageos-150-arm64` | LineageOS System WebView `150.0.7871.63`; ARM ABIs `armeabi-v7a` 和 `arm64-v8a`; Android 10 或更新版本. |

WebView 制品字段选择一个构建，其下载地址、校验和、软件包、版本和签名者均编译于核心中。从 Home Assistant 发起的面板应用更新也可安装兼容 WebView。若更新未完成，请使用其更新修复重试。导入或激活配置文件不会开始更新。参见[更新 WebView](/zh-hans/hardware/guides/update-the-webview/)。

### 条件驱动要求

所有由已填写字段选择的驱动都必须列入 `requires.drivers`。提供的驱动目录说明各驱动的权限要求；多种 Android 和厂商服务途径无需 root。

| 配置文件条件                                                      | 必需驱动                  |
| ----------------------------------------------------------------- | ------------------------- |
| `platform.su_form: android` 且 `platform.app_can_su: true`        | `access.android-su`       |
| `platform.su_form: toolbox` 且 `platform.app_can_su: true`        | `access.toolbox-su`       |
| `hardware.led.mechanism: autodetect`                              | `led.autodetect`          |
| `hardware.led.mechanism: rk3576-ioctl`                            | `led.rk3576-ioctl`        |
| `hardware.led.mechanism: rk3576-ioctl-daemon`                     | `led.rk3576-ioctl-daemon` |
| `hardware.led.mechanism: sysfs-daemon`                            | `led.sysfs-daemon`        |
| `hardware.screen_off: brightness-zero`                            | `screen.brightness-zero`  |
| `hardware.screen_off: su-blpower`                                 | `screen.su-blpower`       |
| `hardware.screen_off: daemon-blpower`                             | `screen.daemon-blpower`   |
| `hardware.screen_off: keyevent`                                   | `screen.keyevent`         |
| `hardware.zigbee_gateway_dir` 存在                                | `radio.siliconlabs-host`  |
| `hardware.relay_base` 存在, 或 `relay_base_fallbacks` 非空        | `relay.sysfs`             |
| `hardware.button_led_gpio_base` 存在                              | `relay.gpio-button-led`   |
| `hardware.has_button_backlight: true`                             | `input.button-backlight`  |
| `sensors.proximity_technology` 或 `sensors.light_technology` 存在 | `sensor.android`          |
| `sensors.proximity_gpio` 存在                                     | `sensor.gpio-proximity`   |
| `sensors.cht8305: true`                                           | `sensor.cht8305-daemon`   |
| `sensors.vi530x: true`                                            | `sensor.vi530x-daemon`    |
| `input.evdev_buttons` 非空                                        | `input.evdev`             |
| `provisioning.software.webview.artifact` 存在                     | `update.webview`          |

### 语法与存储配额

| 范围                 | 限制                                   |
| -------------------- | -------------------------------------- |
| 单个原始 YAML 修订版 | 128 KiB UTF-8 字节。                   |
| YAML 文档数量        | 恰好一个；空输入无效。                 |
| YAML 别名            | 零个。                                 |
| 嵌套                 | 最多 20 层集合。                       |
| 解析工作量           | 最多 20,000 个解析事件。               |
| 单个映射或列表       | 应用更窄字段限制前最多 512 项。        |
| 单个字符串           | 应用更窄字段限制前最多 16,384 个字符。 |
| 导入目录             | 最多接纳 128 个修订版。                |
| 单个导入配置文件 ID  | 最多接纳 16 个修订版。                 |
| 导入 YAML 存储       | 总计最多 4 MiB。                       |

## 要求

配置文件声明所需的最低核心行为和已编译驱动。要求不可用时，验证采取拒绝策略。要求不可用与实时探测失败不同：前者表示此 ha-paneld 构建不认识请求的机制；后者表示核心具有该机制，但在此面板上无法访问。

不要预先扩大要求。要求未使用的特权驱动只会使配置文件更难运行和审阅，不会增加能力。

## 匹配规则

匹配规则仅作用于 ha-paneld 提供的不可变 `model`、`device` 和 `product_version` 事实。`match.any` 列表为 OR；同一组 `all` 列表中的谓词为 AND。谓词对小写预期值支持 `equals`、`starts_with` 和 `contains`，绝不支持正则表达式。

每组有 0 至 1000 的分支 `priority`。匹配组优先级最高的匹配内置配置文件胜出；若仍并列，以配置文件级 `match.priority` 决胜；完全并列时安全回退到通用配置。精确产品标识应使用较高组优先级，宽泛兼容回退使用较低优先级。仅匹配 `px30`、`rk3326`、`rk3566`、`rk3576` 或类似复用参考名，不足以证明可使用硬件专属控制。

匹配只选择候选配置文件，并不证明能力。驱动仍执行实时可用性检查；证据与声明不一致时采用保守结果。

## 命名型号策略

模式没有通用表达式语言或任意条件补丁区。命名策略刻意保持少量并由核心管理：

- `identity.model_label_strategy: nspanel-product-version` 解码 NSPanel 型号变体和固件标签；
- `provisioning.display.density: nspanel-variant` 选择所记录的 86P/120P 密度；
- 默认 `display-name` 和固定整数值不进行这些变换。

`hardware.relay_base_fallbacks` 是针对已知受支持继电器类重命名的普通有界数据，不是表达式或任意路径搜索。

策略是模式中命名、经过编译的有界变换，不是来自配置文件的脚本。不能调用 I/O 或驱动。提供的模式描述受支持策略及其输入。

若没有命名策略能覆盖差异，或产品需要不同已编译驱动、权限层级、恢复预期或独立维护的证据，请建立独立配置文件。

## 能力与已编译驱动

能力声明包含硬件事实，必要时也包含带类型参数的驱动 ID。驱动 ID 指向编译于 ha-paneld 中的实现。驱动负责验证路径、范围、事件码、软件包名及其他安全敏感输入。特权路径从核心允许列表选择。保留的 `provisioning.software.webview.artifact` 元数据指向与核心一同编译和审计的 URL、版本、制品校验和及签名者哈希；配置文件不能重定义此信任根。由所有者发起的更新会在使用制品前检查已安装提供程序及其兼容性；配置文件不能提供其他下载地址或信任根。

配置文件不能提供：

- shell 命令或参数数组；
- 辅助守护进程命令名；
- 任意文件系统读写操作；
- 原生库、ioctl 编号或字节载荷；
- APK URL、签名者哈希或新更新制品；
- 可访问网络、文件系统、进程、反射或时钟的可执行表达式；
- 凭据、Home Assistant 令牌或 MQTT 配置。

声明的能力在驱动确认之前只是候选。界面和诊断应区分**已声明**、**可用**、**不可用**和**缺少权限**，不能将 YAML 当作证明。

## 兼容性行为

ha-paneld 将兼容性失败视为非活动配置文件问题，而非面板启动失败：

- 模式 `2` 是唯一接受的文档语言。已存储模式 1 修订版仍可列出、导出和删除，但不能激活；选中的不兼容修订版会回退到兼容的模式 2 最近已知良好版本、匹配的内置配置文件或内置 `generic.yaml`。
- 未知的必需驱动或变换阻止激活。
- 应用更新后重新验证已安装本地修订版。
- 验证和归一化后，原始 YAML 及其内容哈希仍可识别。
- 激活失败会返回最近已知良好修订版。
- 若没有面板专用配置文件可运行，ha-paneld 以保守的内置 `generic.yaml` 行为启动。若该内置回退缺失或损坏，空能力应急契约会保持本地管理界面可用，而不声称存在面板硬件。

内容哈希和另行发布的签名回答不同问题。ha-paneld 修订版哈希将保存和激活绑定至检查过的字节。外部签名可能帮助识别发布者，但不是配置文件加载器解释的权限信号。两者都不授予 root，也不允许绕过验证和确认。

## 匹配优先顺序

解析策略保护已知产品，避免社区文件被隐式激活：

1. 管理员明确且有效地选择，固定至确切内置或本地修订版；
2. 自动精确匹配内置配置文件；
3. 自动采用内置兼容回退；
4. 通用配置。

本地/社区匹配规则仅用于预览和比较，绝不参与自动选择，因此导入或保存文件不能覆盖内置检测。激活始终需要明确选择并固定版本。

## 作者兼容性检查清单

共享新修订版前，请确认：

- 模式 `2` 和每个字段均在文件声称支持的最旧核心版本上通过验证；
- 该版本具有所有必需驱动；
- 精确指纹样例覆盖每个声称支持的型号和固件系列；
- 近似但不匹配的样例不会匹配使用同一 SoC 的其他产品；
- 在适用时，命名策略边界已在转换点正下方、转换点和正上方测试；
- 每个精确匹配组的分支优先级均高于宽泛回退，并有跨配置文件冲突样例；
- 可选硬件不可用及缺少权限时，配置文件仍可工作且不阻止启动；
- 上一个活动修订版仍是可用回滚目标。
