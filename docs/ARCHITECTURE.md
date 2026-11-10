# 架构与维护者说明

[English](ARCHITECTURE.en.md) · 中文 · [用户指南](USER_GUIDE.zh-CN.md)

本文描述 2.0.0 的接口与行为；原生集成测试覆盖 DSH `0.1.7-rc.2`、`0.2.1-rc.2`、`0.2.1-rc.5` 和 `0.2.2-rc.1`。版本变更见[更新日志](../CHANGELOG.md)。运行时代码是接口与行为的依据；用户操作说明与本文应保持一致。

客户端通过能力探测复用公开 UI primitives。`HostModal` 为复杂业务内容使用官方无头 Modal，普通 `ConfirmDialog` 直接使用 Modal 的标题、说明及 footer；`ControlButton` 与 `ControlInput` 透传 ref、禁用状态和编辑事件。旧 Host 保留 HTML 兼容入口。原生按钮使用独立样式类，避免旧按钮 CSS 覆盖官方尺寸、颜色和悬停。菜单保留筛选定位与滚动约束，预览内容限制在外层弹窗边界内。原生弹窗拥有焦点层，旧文档级焦点陷阱仅在兼容模式注册。带插件归属标记的 portal 计入归档交互范围，避免设置保护被弹窗内点击提前解除。

## 产品边界与模块

插件补充已归档聊天管理页面，不替代 DSH 主会话区。浏览器仅通过 Host 路由读写数据；会话文件仍由 Host 持久层管理。

| 模块（均位于 `lib/`） | 职责 |
| --- | --- |
| `index.js` | Host 能力解析、路由、归档可见性、生命周期队列及物理删除 |
| `client.js` | 设置页、四个主视图、弹窗、原生归档提示与请求状态 |
| `about.js` | 本地插件信息、受限的公开版本查询与运行期缓存 |
| `persistence-compat.js` | 旧版 inspect 与新版只读句柄适配，独立标题读取 |
| `workspace-bulk-archive.js` | 工作区归档候选、短效确认、执行重检 |
| `deletion.js`、`deletion-tasks.js` | 永久删除调度、持久化任务与明确重试 |
| `export.js`、`import.js`、`restore.js` | ZIP 导出、有界导入验证、事务恢复 |
| `metadata.js`、`durable.js` | 标签备注、串行原子写入与持久化操作 |
| `search.js`、`stats.js` | 消息投影与搜索、会话目录测量 |
| `lineage.js` | 只读来源、分叉与子代理关系投影 |
| `fork-provenance.js` | 普通分支来源本地记录与官方入口兼容适配 |
| `session-graph.js` | 会话 ID 归一化、子代理后代解析 |

## Host 路由

```text
GET  /plugins/dsh-archived-chats/about
POST /plugins/dsh-archived-chats/about/check-updates
POST /plugins/dsh-archived-chats/about/install-update
GET  /plugins/dsh-archived-chats/state
GET  /plugins/dsh-archived-chats/stats
GET  /plugins/dsh-archived-chats/lineage
POST /plugins/dsh-archived-chats/unarchived/delete
GET  /plugins/dsh-archived-chats/workspace-archive/workspaces
POST /plugins/dsh-archived-chats/workspace-archive/preview
POST /plugins/dsh-archived-chats/workspace-archive/apply
POST /plugins/dsh-archived-chats/preview
POST /plugins/dsh-archived-chats/preview/image
POST /plugins/dsh-archived-chats/search
POST /plugins/dsh-archived-chats/export
POST /plugins/dsh-archived-chats/import/inspect
POST /plugins/dsh-archived-chats/import/restore
POST /plugins/dsh-archived-chats/metadata
GET  /plugins/dsh-archived-chats/deletion-tasks
POST /plugins/dsh-archived-chats/deletion-tasks/retry
POST /plugins/dsh-archived-chats/deletion/preview
POST /plugins/dsh-archived-chats/deletion/execute
POST /plugins/dsh-archived-chats/unarchive
POST /plugins/dsh-archived-chats/unarchive-all
POST /plugins/dsh-archived-chats/delete
POST /plugins/dsh-archived-chats/delete-all
GET  /plugins/dsh-archived-chats/unarchived
POST /plugins/dsh-archived-chats/unarchived/export
```

除导出外，上述 POST 路由要求 `x-dsh-archived-chats: 1`。读取对话内容的预览、图片、搜索也使用受保护 POST。导出单独接受有界原生表单，不使用此 header 守卫，并检查所请求会话的当前归档可见性；其余路由按各自限定解析载荷。

`/delete` 接收 `sessionId`，`/delete-all` 接收 `sessionIds`。缺少 `permanent: true` 时返回 400 `permanent-confirmation-required`。旧删除入口也必须携带 `/deletion/preview` 返回的 `fingerprint`，缺失或范围变化时拒绝删除。结果为 `{ deleted, pending, failed, retryTargets }`。全部失败且没有删除成功项时为 HTTP 409，部分成功可返回 200，调用方须检查结果数组。


所有新增删除使用 `deletionService.preview/remove`，统一包含子智能体后代并保留普通分叉。`POST /deletion/preview` 接收 `{ source, sessions }`，会话选择携带 `sessionId`、`createdAt`，未归档选择还携带工作区身份。返回的计划含目标身份、所选数量、额外子智能体数量、总数和范围指纹。`POST /deletion/execute` 额外要求 `permanent: true` 与该指纹，在生命周期锁内重新校验。活动目标拒绝删除，范围变化返回 `deletion-scope-changed`。

新任务将 `confirmedScope` 和空闲检查要求持久保存。文件删除前再次核对完整范围，重试保护复用的 ID，并拒绝纳入新后代。旧 `purgeSelectedOnly` 任务保持原行为。旧删除路由作为兼容入口委托同一服务，结果继续提供 `{ deleted, pending, failed }`。

## 状态、所有权与持久化

插件状态根目录是 `$DSH_HOME/plugin-data/archived-chats/`：

| 路径 | 当前用途 |
| --- | --- |
| `metadata.json` | 版本化标签备注 |
| `deletion-tasks.json` | 任务身份、确认范围与待重试删除 |
| `pending-deletions.json` | 已进入物理删除阶段的持久意图 |
| `fork-provenance.json` | 普通分支来源补充记录 |

元数据与删除任务写入串行化，通过临时文件和原子 rename 发布。生命周期队列把归档、导入恢复和永久删除的关键重检与提交串行化。文件使用 `0600`，目录使用 `0700`；同步文件及父目录，不支持目录 fsync 的平台安全降级。Windows 上对瞬时 `EPERM`、`EACCES`、`EBUSY` 做有界重试，路径包含判断使用平台路径规则。

## 工作区批量归档

官方归档方法、提示计时与撤销操作由 Host 管理。插件通过官方 `workspace.toast` 插槽为归档提示追加「查看」入口，打开归档管理；归档操作仍调用 `workspaces.archiveSession`。插件内部归档成功复用可选的 UI primitives `Toast`，由原生组件负责计时与定位；旧 Host 缺少该组件时保留结果窗口。

客户端仅注册 `settings.section`，在 **Settings → Archive Management / 设置 → 归档管理** 内维护未归档会话列表，不依赖工作区菜单扩展；通过官方 `workspaces.list.subscribe` 同步归档与未归档列表。

1. 未归档列表读取所有已登记工作区及未分组会话，排除已归档、待删除及子代理行；批量归档共用这些排除规则，在生命周期锁内及异步检查后重新校验；冷分叉通过 `readSession` 读取，保留标签备注。
2. 单条归档用 `sessionIds` 限定 ID；工作区与全局操作覆盖完整工作区，范围不随搜索或筛选改变。失效的单条目标整体拒绝，不扩大范围。
3. 显示一次汇总确认；空准备返回刷新后的列表。
4. 执行 token/nonce 确认，在异步读取后重检工作区及运行状态。成功后刷新归档、未归档、侧栏及空间状态。

apply 只接受凭据，不接受调用方增补会话 ID。每条执行前在生命周期队列内检查工作区归属、归档状态、agent 状态及真实 `turn/start`。空白为 `session-empty`，内容无法确认则 `session-unavailable`；没有 agent 状态的旧 Host 会保守跳过已加载会话。候选内容检查最多并发 8 条。

调用公开 `workspaceRegistry.archiveSession()` 时保留 receiver；预览允许包含活动聊天，其 ID 绑定确认 token，只有明确「停止并归档」确认才对这些 ID 传入 `{ stopActivity: true }`。活动状态通过官方 `workspace/session-activity` 查询，包含 Agent 和后台工作；确认后新开始运行的聊天被跳过。取消归档使用官方 `workspaceRegistry.unarchiveSession()` 及其操作队列，不直接替换状态。不移动工作区归属、不改目录、不抓取历史快照。缺少该能力返回 `workspace-archive-unsupported`。

## 持久层兼容与分叉标题

带原生 `inspect` 的持久层对象保持原样。新版 `list()` 快照与 `open(id, 'read')` 句柄适配为内部 `list`、`listSnapshots`、`inspect`、`readSession` 和 `readTitle`；句柄从偏移 0 读取，并在成功或失败后关闭。

`readTitle` 允许读取继承事件，但只返回最后一个非空白 `session/title` 字符串，不向备份调用者暴露事件载荷。归档列表优先调用它，解决分叉标题被严格检查阻断的问题。

严格的旧 `inspect` 仍拒绝正继承数；新版 ZIP 改用 `readSession` 和 v2 保存继承分界。

适配器将现代 `create` 显式暴露为 `createWriteHandle`，不伪装为旧 create/append。原持久层暴露 `locate` 时才透传并验证绝对路径。没有 locate 时，不支持会话目录统计、物理删除或现代 ZIP 回滚写入器；有 locate 的只读后端仍可能支持直接永久删除。

## 预览、搜索与客户端

归档事务通过官方 `sidebar.settings` 共享 store 临时保护当前归档管理页。主页当前会话被归档后，Host 引导流程触发的自动关闭会同步恢复原设置页；归档页外的新操作、关闭快捷键或设置分区切换立即释放保护；页内重复点击和普通输入保留保护。事务结束后等待两帧让导航 effect 完成，再清理订阅；插件卸载也会取消监听与帧回调。成功提示仍由服务端归档结果决定。

`/preview` 默认只接受当前可见归档 ID。搜索接受 `scope: "archive" | "unarchived"`，默认 `"archive"` 兼容旧调用；返回行标注所属范围，读取前后及返回命中前重检可见性。未归档预览及图片读取使用 `scope: "unarchived"`。聊天正文使用 Harness append-origin 投影，不重复索引 replacement 副本；系统提示词更新单独保留。`request/header` 在恢复或开启新请求系列时可引用日志中已知的有效系统提示词，尊重替换和清空，紧邻提示词卡片不重复展示。投影按日志顺序分页，客户端按 `anchorSeq` 将对应提示词放在当轮输入前；信息不完整时不推测提示词。

图片按顺序校验：请求 guard → 有界身份字段 → 当前可见性 → 规范投影中完全匹配的图片描述符 → 可选公开 `attachments.readImage`。异步读取后再次检查可见性，响应使用 `no-store`、`nosniff`，错误不回显路径。

搜索读取并发 4；已归档投影缓存为 30 秒 TTL、64 会话 LRU。未归档搜索和预览绕过缓存：已加载会话读取实时 `snapshotEvents()`，否则使用官方持久化读取。单段最多 256 Ki Unicode 码点，单消息 1 Mi 码点／1,000 段，单会话 10,000 条投影消息；未知结构化值在 stringify 前限制深度、节点和字符。超预算内容截断或不入缓存。

客户端识别公开 React 组件类型，包括经 `React.memo` 包装的 `MarkdownText`，优先使用宿主 `MarkdownText`、`DisclosureRow`、`JsonBlock`；缺少时降级为转义文本、原生 details 或 pre。工具结果只与更早且 ID 匹配的调用合并。图片使用 Blob URL，关闭／卸载时取消请求并释放 URL；请求序号屏蔽迟到响应。轮次导航在桌面位于左侧，宽度不超过 640px 时改为顶部横向滚动。

轮次投影保留日志中的边界及过程／最终回复位置。仅完整加载、已结束且最终回复已知的轮次组成默认收起的过程折叠项；不完整或缺少边界的内容保持事件顺序。过程摘要显示「已思考」或实际工具／消息／子代理数量，嵌套思考、上下文来源及工具参数／结果默认收起，最终回复位于过程之外。真实用户消息居右，全部 AI 过程居左。预览只读、无输入框，不编造用量或耗时，也不承诺完整原生功能或缺失日志内容。部署时必须重新加载实际 DSH 后端以替换投影代码，仅刷新浏览器不够。

导出下载使用受保护 fetch，验证状态、ZIP 内容类型和附件 disposition，缓冲完整响应后才创建 Blob URL。端到端超时为五分钟，已声明及流式响应上限为 320 MiB 字节。该上限不是峰值堆内存保证，因为分块、连续缓冲区和 Blob 可能同时存在；非流式 WebView 回退也没有更强的通用内存上限。完成文案表示已开始下载，不表示浏览器已保存到磁盘。

`/state` 与 `/unarchived` 返回独立的 `updatedAt` 排序字段。与 Host `ApiSessionList` 一致，活动会话读取 `sessionProjections.cachedSnapshot`，冷会话读取 `sessionProjectionCache.cachedSnapshot`；取创建时间与 `sessionListMetadata.lastPromptAt` 的较大值，缺失或读取失败时回退到创建时间。只读缓存，不重放事件、不更新投影文件；插件标签备注的 `metadataUpdatedAt` 不参与排序。前端「最近更新／最早更新」及工作区分组使用同一时间字段，时间相同时按会话 ID 确定顺序，缺失时间排最后；标题排序保持原行为。

选择模式在客户端保存已选 ID 集合。全选从筛选后的 `group.items` 获取范围；工作区批量操作仍使用完整 `group.sessionIds`。隐藏选择显示数量，切换页面或取消清空集合，列表更新后剔除已不存在的 ID。操作确认捕获 ID 快照并复用现有导出、取消归档和删除接口。选择模式隐藏行内修改及全局／工作区菜单，保留预览，更多提供导出选中。

所有插件确认、预览、导入和元数据弹窗共用不透明的 `--dsw-alias-bg-layer-2` 背景及宿主 prominent elevation，兼容旧版阴影。菜单和提示使用不透明主题层；遮罩与悬停状态保留各自的半透明用途，避免将磨砂菜单 token 直接用于弹窗主体。

## 关于与版本查询

`GET /about` 只返回已加载包的本地身份、受控链接和内存缓存，无网络副作用。受现有同源 guard 保护的 `POST /about/check-updates` 只接收 `{ force: boolean }`。固定请求 `https://registry.npmjs.org/dsh-archived-chats/latest`，不携带聊天、备份或客户端凭据；拒绝重定向、异常状态、错误包名和非法 SemVer，按 SemVer 判断新版，绝不建议降级。请求超时 5 秒，响应上限 64 KiB。

打开归档管理时先读取本地信息，再自动查询公开 npm 版本；页面保持打开时每 15 分钟进行缓存感知检查，重新显示或联网时也会补查。成功结果缓存 12 小时，失败结果缓存 15 分钟；手动检查使用 30 秒短限流，并发请求合并。只查询公开版本，不发送聊天或备份内容；失败不阻塞会话管理，也不显示「已是最新版」。关闭页面会清理定时器和事件监听。

`POST /about/install-update` 额外要求本机请求，拒绝跨来源写入，仅接受 `{ version }`。`createUpdateRuntime` 核对 profile 依赖与实际加载路径，本地、外部、未知或路径不一致的来源均拒绝安装。优先调用官方 `pluginManager.updateBundle`，包括 HMR 环境，替换与回滚均由宿主负责。适配器校验嵌套结果和磁盘包身份，分别报告已应用、待重启及旧版恢复结果。旧 Host 仅在无 HMR 时退回 `installBundle`，不自行启动包管理器。各 Host 独立保存操作状态，已加载版本与已安装版本分开表达。HMR 可能卸载当前设置页并中断其请求，用户可重新打开页面核对新加载的版本。

## 永久删除与崩溃恢复

永久删除由 `deletion.js` 调度，`deletion-tasks.js` 保存任务身份、会话身份及已确认的后代范围。执行前检查存储可读性、目录独占性及会话活动状态。原始会话日志移除后再清理工作区、归档索引、标签备注与来源记录。

失败结果和 `/state` 返回 `retryTargets`，界面在错误提示中提供「重试」，刷新或重开页面可恢复提示。`/deletion-tasks/retry` 接收 `sessionId` 和 `taskId`，校验任务身份并继续已保存的范围。读取列表与启动仅提供状态。重试仍要求目标空闲，并核对身份及后代范围。

成功删除与重试的响应在当前 Host 进程内缓存十分钟，最多保留 128 条。同一请求重发可取回原结果。缓存仅保存响应，进程重启或缓存过期后仍按现有身份校验处理。

旧 `trash.json` 中已确认的永久删除任务可转入新任务存储。旧恢复记录和保护快照留在磁盘，当前版本不再提供对应功能。

## 空间、策略与来源关系

`stats` 并发 4 测量会话目录、跳过符号链接，缓存 30 秒；失败只影响对应项。

`fork-provenance.js` 适配已验证的 `sessionController.fork(request)` 契约，成功后写入串行、原子替换的插件目录。调用接收者、参数、返回对象和官方异常保持原样。卸载时恢复方法描述符，后续包装保留本适配时转为透传。投影校验 ID 与创建时间。目录读取和追踪故障分别通过 `provenanceStatus`、`forkTrackingStatus` 返回。该目录属于当前 Host，未纳入现有 ZIP 备份格式。

独立未归档草稿候选以并发 8 检查当前内存或持久化事件，仅将可确认空白的候选排除出投影起点；日志不可读、有对话事件、含继承历史或存在关系的来源节点保留。来源预览仅检查目标家族及目标草稿候选。

客户端用迭代投影将每个受管理节点归入自身工作区一次；外层列表排除重复的来源参考，直接父来源由 `sourceParent` 保留。工作区折叠独立保存于浏览器 `dsh-archived-chats:lineage-workspaces`，不写回 Host。搜索临时展开匹配工作区，清空后恢复。

列表按钮按会话 ID 从未筛选的原始森林定位所属关系树，以弹窗展示完整家族和跨工作区来源。无关根节点不进入画布，独立会话不提供关系图入口。迭代子树布局计算 DOM 卡片与 SVG 连线的共享坐标，卡片与连线共同平移、缩放。指针捕获支持空白区域自由拖动，局部非被动滚轮监听处理平移及 Ctrl／⌘ 围绕鼠标位置缩放；节点不折叠。弹窗定位并高亮当前会话，限制键盘焦点并在关闭时恢复入口焦点。列表保持挂载以保留查询和位置。标题沿用共用只读预览，预览在画布上层并临时接管键盘焦点。

`/preview` 与 `/preview/image` 接受 `scope: "lineage"`，仅允许读取当前关系树中的未归档或已归档节点（含相关子智能体），读取后复查关联和删除任务状态；任务存储不可读时拒绝正文。

## ZIP 导出、导入与恢复

导出包含 manifest、每条 session.json 和 transcript.md，路径净化并处理重名。它仅检查每个选中来源一次，在返回顺序 ZIP 流之前暂存渲染后的条目。ZIP 由 `fflate` 同步分片压缩生成，每条目按 256 KiB 分片推送并在分片之间让出事件循环；写入器不再依赖 `zip-stream`，因此不会引入会请求带斜杠内置模块名的 `readable-stream@4`。共用完整语义验证器和全部导入预算先行执行，因此成功导出可被本插件导入，之后的无效来源不会把已成功响应变成不完整备份。现代读取产生 v2 manifest/session 记录，保存 `source.inheritedEventCount`；旧读取保留 v1。导入兼容两版的普通记录，要求包与记录版本一致，校验 v2 继承边界。边界不明的 seeded v1 来源会被拒绝，不会展平。两版均不打包附件二进制或自动递归加入后代会话。

共用限制为 2,000 条会话、4,001 个条目、4 MiB manifest、单会话 JSON 4 MiB、单条目／Markdown 8 MiB，以及解压总量 256 MiB。导入的压缩输入上限为 512 MiB。每个 JSON 文档限制深度 64、节点 100,000 个，所有字符串合计 4 Mi Unicode 码点。导入有界解压，验证声明／实际大小、路径、版本、生成器、JSON 预算及跨文件身份。它对齐本地条目、数据描述符和中央目录，包括大小与 CRC；拒绝截断、无效 UTF-8、重复项、加密、ZIP64、多磁盘及 Store／Deflate 之外的压缩方法。已有 ID 禁用；缺失工作区或附件引用给警告。确认凭据有效 10 分钟、单次使用，进程最多保留 8 份、总计 128 MiB。确认后的冲突检查和提交进入生命周期队列。

导入预览把不兼容、有歧义或无效的 `cwd` 标记为不可恢复；选择与恢复适配器在暂存和持久化写入前重新检查整批记录。不转换、丢弃目录或改用进程目录，持久化和删除位置校验保持不变。POSIX 上不合法的 Windows 盘符／UNC 路径及 Windows 上的单斜杠根路径被拒绝。单斜杠根路径也可能原本是 Windows 当前盘符路径，备份缺少来源系统字段，因此此处有意保守拦截。有歧义的双斜杠路径保留本机 UNC／POSIX 路径语义。

原始导入提交后，可选公开冷标题发布会在共享有界截止时间内验证精确标题和最终事件水位。缓存缺失、失败、超时或旧版 Host 的 seeded 冷列表限制只返回稳定降级警告，不回滚持久化恢复数据。取消归档另外要求权威可读的持久化 header 包含 `cwd`；缺少 `cwd` 不等于缺少工作区，并会把已归档副本保留为可预览／导出。

## 验证与发布边界

`test/backup-roundtrip.test.mjs` 在 `DSH_NATIVE_MODULE_ROOT` 指向已安装 Host 的 node_modules 时，使用官方存储组件和临时目录验证 v1 恢复、分叉 v2 往返、预览／取消归档／重新打开、首次落盘失败、并发创建及待删除冲突。未配置时显式跳过这些原生集成测试，现代写入器单元测试仍照常执行。

测试覆盖实际保留模块：导出导入及回滚、删除任务状态、删除中断重启、分叉标题、完整读取和严格 ZIP 读取、统计、关系树、Host 路由、浏览器行为、类型和包内容。`test/archive-lifecycle.test.mjs` 覆盖分叉预览、继承分界保留及直接永久删除链路。测试使用隔离数据，不读取真实聊天。

```sh
npm test
npm ci --prefix test/fixtures/native-host --ignore-scripts --include=optional
node scripts/run-native-integration.mjs
npm ci --prefix test/fixtures/native-host-0.2.1 --ignore-scripts --include=optional
node scripts/run-native-integration.mjs --fixture-root test/fixtures/native-host-0.2.1
npm ci --prefix test/fixtures/native-host-0.2.1-rc.5 --ignore-scripts --include=optional
node scripts/run-native-integration.mjs --fixture-root test/fixtures/native-host-0.2.1-rc.5
npm install --prefix test/fixtures/native-host-0.2.2-rc.1 --ignore-scripts --include=optional --package-lock=true
node scripts/run-native-integration.mjs --fixture-root test/fixtures/native-host-0.2.2-rc.1
npm pack --dry-run --json
git diff --check
```

原生集成命令会分别安装锁定的 `@deepseek-ai/dsh-session@0.1.7-rc.2`、`0.2.1-rc.2`、`0.2.1-rc.5` 和 `0.2.2-rc.1` fixtures，每套都要求九个原生集成用例全部执行且不能跳过；这是 CI 强制原生 Host 集成门禁的本地等价检查。

声明的 DSH `>=0.1.0-rc.7 || 0.2.2-rc.1` 范围仍以 Host 公开能力为准。发布自动化在 Ubuntu 上测试 Node.js 18，并在 Ubuntu、macOS 和 Windows 上测试 Node.js 24；Node.js 24 矩阵在三个平台上分别强制运行基于官方 `@deepseek-ai/dsh-session@0.1.7-rc.2`、`0.2.1-rc.2`、`0.2.1-rc.5` 和 `0.2.2-rc.1` 的四套 Host 后端集成（每套 9/9）与打包检查，覆盖 v4 会话格式。[截图](../screenshots.json)使用虚构示例聊天展示当前界面。

永久删除在最终读取子代理关系前先取消并释放活动代理。完整后代集合以可选 `cascadeSessionIds` 保存到父会话的 `purge-pending` 记录；父目录消失后也保留该记录，直到所有子代理清理完成。用户明确重试时据此恢复级联，不跨越分叉或已有独立删除任务的子树。待重试记录清空前不要降级到不支持此字段的版本。
