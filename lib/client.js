// dsh-archived-chats — browser half (client plugin bundle).
//
// Loaded by dsh-client-modules at /plugins/dsh-archived-chats/client.js and
// executed through the vendored cordis Loader's lazy-CJS module table
// (window.__ModuleLoader__.load). The factory body is plain CJS with require()
// resolved against the shell's module table — the same shape the shipped ui-*
// packages emit.
//
// Archive Management adds search, preview, deletion retries, and batch management in
// Settings. Official workspace feedback gains an Archive Management shortcut;
// plugin archive results reuse the Host Toast component when available.
// Durable changes still flow only through
// /plugins/dsh-archived-chats/* routes and the Host workspace registry.
window.__ModuleLoader__.load({
	id: "dsh-archived-chats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let jsx = require("react/jsx-runtime");
		let _react = require("react");
		function resolvePreviewPrimitives(requireFn) {
			let source = null;
			try { source = requireFn("@deepseek-ai/dsh-client-ui-primitives"); } catch { source = null; }
			const component = (value) => typeof value === "function" || (value && typeof value === "object"
				&& [Symbol.for("react.memo"), Symbol.for("react.forward_ref")].includes(value.$$typeof)) ? value : null;
			return Object.freeze({
                Button: component(source?.Button),
                Tooltip: component(source?.Tooltip),
                Menu: component(source?.Menu),
                IconEllipsis: component(source?.IconEllipsisOutlineRegular),
                Modal: component(source?.Modal),
                Input: component(source?.Input),
                MenuSurface: component(source?.MenuSurface),
                MenuItemButton: component(source?.MenuItemButton),
                IconClose: component(source?.IconCloseOutlineRegular),
                IconTrash: component(source?.IconTrashOutlineRegular),
                IconDots: component(source?.IconEllipsisOutlineRegular),
                IconClock: component(source?.IconClockOutlineRegular),
                IconCheck: component(source?.IconCheckOutlineRegular),
                IconChevron: component(source?.IconChevronDownOutlineRegular),
                IconArchive: component(source?.IconArchiveOutlineRegular),
                IconCopy: component(source?.IconCopyOutlineRegular),
                IconEdit: component(source?.IconEditOutlineRegular),
                IconCheckCircle: component(source?.IconCheckCircleOutlineRegular),
                IconFilter: component(source?.IconSlidersTwoOutlineRegular),
                IconExpand: component(source?.IconFullscreenOutlineRegular),
                IconBranch: component(source?.IconBranchOutlineRegular),
                IconDownload: component(source?.IconDownloadOutlineRegular),
                StateDot: component(source?.StateDot),
                IconRefresh: component(source?.IconRefreshOutlineRegular),
				MarkdownText: component(source?.MarkdownText),
				Toast: component(source?.Toast),
				DisclosureRow: component(source?.DisclosureRow),
				JsonBlock: component(source?.JsonBlock),
				IconThink: component(source?.IconThinkOutline14),
				IconPrompt: component(source?.IconBrowseOutline16),
				IconSearch: component(source?.IconSearchOutlineRegular),
				IconFolderOpen: component(source?.IconFolderOpenRegular),
				IconFolderClose: component(source?.IconFolderCloseRegular),
				IconTriangleRight: component(source?.IconTriangleRightFillRegular),
			});
		}
		const previewPrimitives = resolvePreviewPrimitives(require);
        const hasNativeMoreMenu = Boolean(previewPrimitives.Menu && previewPrimitives.Tooltip && previewPrimitives.Button);
        function HostButton({ className = "", variant, size, children, ...props }, ref) {
            const classes = className.split(/\s+/);
            const danger = classes.some(name => ["dac-btn-danger", "dac-danger", "dac-stop-archive"].includes(name));
            const iconOnly = classes.some(name => ["dac-iconbtn", "dac-lineage-copy", "dac-lineage-view-button"].includes(name));
            const cancel = classes.includes("dac-selection-cancel");
            const compact = iconOnly || classes.some(name => ["dac-action-trigger", "dac-unarchive", "dac-lineage-fold"].includes(name));
            if (!previewPrimitives.Button) return (0, jsx.jsx)("button", { ...props, ref, type: props.type ?? "button", className, children });
            const buttonVariant = variant ?? (classes.includes("dac-btn-danger") ? "primary" : danger ? "outline" : classes.includes("dac-btn-primary") ? "primary" : iconOnly || cancel ? "ghost" : "outline");
            const dangerClass = danger ? ` dac-native-danger${buttonVariant === "primary" ? "-primary" : ""}` : "";
            return (0, jsx.jsx)(previewPrimitives.Button, {
                ...props, ref, variant: buttonVariant,
                size: size ?? (compact ? "sm" : "md"),
                className: `dac-native-control${iconOnly ? " dac-native-iconbtn" : ""}${dangerClass}${classes.includes("dac-preview-more") ? " dac-preview-more" : ""}${classes.includes("dac-lineage-open-graph") ? " dac-lineage-open-graph" : ""}`,
                children,
            });
        }
        const ControlButton = typeof _react.forwardRef === "function" ? _react.forwardRef(HostButton) : function ControlButtonFallback(props) { return HostButton(props, props.ref); };

        function HostInput({ className = "", icon, ...props }, ref) {
            // The built-in plugin inventory uses this search layout instead of the generic Input.
            if (props.type === "search") return (0, jsx.jsxs)("label", {
                className: "dac-search", children: [icon, (0, jsx.jsx)("input", { ...props, ref })],
            });
            if (previewPrimitives.Input) return (0, jsx.jsx)(previewPrimitives.Input, {
                ...props, ref, icon, className: "dac-native-input",
            });
            const input = (0, jsx.jsx)("input", { ...props, ref, ...(className === "dac-search" ? {} : { className }) });
            return className === "dac-search" ? (0, jsx.jsxs)("div", { className, children: [icon, input] }) : input;
        }
        const ControlInput = typeof _react.forwardRef === "function" ? _react.forwardRef(HostInput) : function ControlInputFallback(props) { return HostInput(props, props.ref); };

        function HostModal({ title, className, onClick, children }) {
            if (!previewPrimitives.Modal) return (0, jsx.jsx)("div", { className, onClick, children });
            return (0, jsx.jsx)(previewPrimitives.Modal, {
                open: true, title, onClose: onClick, headless: true, shortcutModal: "dsh-archived-chats", className: "dac-native-modal", children,
            });
        }
        function HostMenuSurface({ className, children, ...props }) {
            if (!previewPrimitives.MenuSurface) return (0, jsx.jsx)("div", { ...props, className, children });
            return (0, jsx.jsx)(previewPrimitives.MenuSurface, { ...props,
                className: `dac-native-menu ${className.replace(/\bdac-menu\b/g, "").trim()}`, children });
        }
        function HostMenuItem({ className = "", onClick, disabled, children, ...props }) {
            if (!previewPrimitives.MenuItemButton) return (0, jsx.jsx)("button", { ...props, className, onClick, disabled, children });
            return (0, jsx.jsx)(previewPrimitives.MenuItemButton, { onSelect: onClick, disabled, disabledReason: props.title,
                danger: className.includes("dac-danger"), current: props["aria-pressed"] === true || props["aria-selected"] === true,
                children: (0, jsx.jsx)("span", { className: "dac-native-menu-content", children }) });
        }

		//#region constants
		const SETTINGS_NS = "settings.archived-chats";
		const API_BASE = "/plugins/dsh-archived-chats";
		const GUARD_HEADER = "x-dsh-archived-chats";
		const STYLE_ID = "dsh-archived-chats-css";
		const KEY_COLLAPSED = "dsh-archived-chats:collapsed";
		//#endregion

		//#region collapsed-group persistence (browser-local, like every visual preference)
		function readCollapsed() {
			try {
				const raw = window.localStorage.getItem(KEY_COLLAPSED);
				if (raw === null) return {};
				const parsed = JSON.parse(raw);
				return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
			} catch { return {}; }
		}
		function writeCollapsed(map) {
			try { window.localStorage.setItem(KEY_COLLAPSED, JSON.stringify(map)); } catch { /* quota — ignore */ }
		}
		//#endregion

		//#region locale
		const zh = {
			"locale.intl": "zh-CN",
			"nav": "归档管理",
				"page.title": "归档管理",
				"page.description": "查看、搜索和管理会话归档",
				"tab.archived": "已归档",
                "archive.viewArchived": "查看已归档",
                "chat.deletionUnverified": "暂时无法核对删除状态，请稍后重试。",
				"tab.lineage": "来源与分支",
				"tab.about": "关于",
				"about.updateAvailable": "有新版本可用",
				"help.label": "{label}说明",
			"archive.view": "查看",

				"lineage.origin.subagent": "子智能体",
                "lineage.origin.fork": "分支会话",
                "lineage.origin.root": "原始会话",
                "lineage.origin.unknown": "来源待确认",
				"lineage.copyId": "复制 ID",
				"lineage.copiedId": "已复制",
				"lineage.loading": "正在读取来源与分支…",
				"lineage.error": "来源与分支暂不可用",
				"lineage.scopeNote": "查看当前 Host 所有工作区的会话来源与分支，包含已归档和未归档会话。列表可按状态筛选，关系图保留完整关联；重复的来源参考不计入数量。",
				"lineage.search": "搜索会话标题、工作区和 ID",
				"lineage.projectFilter": "筛选项目",
				"lineage.statusFilter": "筛选状态",
				"lineage.statusAll": "全部状态",
                "lineage.relatedWorkspaces": "所有工作区",
                "lineage.noArchives": "暂无会话",
				"lineage.managedHeading": "会话关系",
				"lineage.managedCount": "个会话",
                "lineage.totalCount": "共 {count} 个会话",
                "lineage.resultCount": "当前结果：{count} 个会话",
				"lineage.expandAll": "全部展开",
				"lineage.collapseAll": "全部折叠",
				"lineage.searchFoldHint": "筛选期间保持匹配工作区展开",
				"lineage.empty": "暂无符合条件的会话",
                "lineage.workspaceEmpty": "暂无会话",
                "lineage.trackingUnavailable": "来源追踪暂不可用，部分新分支的来源可能未记录。",
                "lineage.deletionUnavailable": "暂时无法核对删除状态，请稍后重试。",
				"lineage.status.active": "未归档",
				"lineage.status.archived": "已归档",
				"lineage.status.missing": "来源不可用",
				"lineage.untitled": "未命名会话",
				"lineage.sourceUnavailable": "来源信息不可用",
				"lineage.sourceContext": "来源于",
				"lineage.contextOnly": "仅作为来源参考",
                "lineage.searchMatch": "匹配会话",
                "lineage.independent": "独立会话",
                "lineage.sourceUnrecorded": "未记录来源会话",
                "lineage.sourceUnrecordedHint": "此会话包含继承的历史，但没有记录来源会话，无法建立来源连线。会话内容仍可正常查看。",
                "lineage.view.open": "会话谱系",
                "lineage.view.title": "会话谱系图",
                "lineage.view.close": "关闭会话谱系图",
                "lineage.view.pan": "关系画布，可拖动背景或滚动浏览",
                "lineage.view.enlarge": "放大查看",
                "lineage.view.restore": "返回页面",
                "lineage.view.zoomIn": "放大",
                "lineage.view.zoomOut": "缩小",
                "lineage.view.zoom": "缩放比例",
                "lineage.view.fit": "适应窗口",
                "lineage.view.hint": "拖动画布 · Ctrl/⌘ + 滚轮缩放 · 点击标题预览",
                "lineage.view.nodes": "个节点",
                "lineage.view.connections": "条关系",

                "lineage.searchRelated": "相关分支",
				"lineage.start": "起始会话",
				"lineage.created": "创建于",
				"lineage.project": "项目",
				"lineage.delegation": "委派层级",
				"lineage.noBranches": "无分支",
				"lineage.crossWorkspace": "来源工作区",
				"lineage.sourceId": "来源 ID",
				"lineage.diagnostic.missing-parent": "父会话缺失",
				"lineage.diagnostic.missing-parent.detail": "无法读取父会话的来源信息",
				"lineage.diagnostic.self-parent": "会话指向自身",
				"lineage.diagnostic.cycle": "检测到循环",
				"lineage.diagnostic.delegation-depth-mismatch": "委派深度不一致",
					"action.import": "导入备份",
					"action.export": "全部导出",
				"import.title": "导入归档备份",
				"import.inspecting": "正在检查备份…",
				"import.preview": "恢复前请确认要导入的会话",
				"import.package": "备份信息",
				"import.confirm": "恢复选中项",
				"import.cancel": "取消",
				"import.close": "关闭",
				"import.selectAll": "全选可恢复项",
				"import.clear": "清除选择",
				"import.conflict": "ID 冲突，将跳过",
				"import.workspaceWarning": "项目不存在，将保持未分组",
				"import.cwdUnsupported": "工作目录与当前系统不兼容或有歧义，无法安全恢复。请保留原 ZIP 并核对来源目录；当前版本不提供目录映射。",
				"import.cwdInvalid": "备份的工作目录无效，无法恢复。请保留原 ZIP 并检查备份来源。",
				"import.attachmentWarning": "包含附件引用，但不会恢复附件文件",
				"import.restored": "已恢复",
				"import.skipped": "已跳过",
				"import.expired": "预览已过期，请重新选择备份",
				"import.done": "备份恢复完成",
				"import.unsupported": "当前宿主无法无损恢复此备份，请保留 ZIP 并检查宿主兼容性。",
				"import.rollbackFailed": "恢复未完成，部分写入无法安全回滚，已保留相关文件。请保留 ZIP，排查后再重试；不要直接删除冲突会话。",
				"import.conflictChanged": "所选会话已存在或仍在删除处理中，未覆盖已有内容。请重新选择备份核对。",
				"import.titlePublicationDegraded": "聊天已安全恢复，但标题可能需要打开聊天后才会出现在主列表。",
				"import.seededTitleLimitation": "聊天已安全恢复；当前宿主的冷启动列表无法发布分支标题，打开聊天后可正常显示。",
				"export.all": "全部导出",
				"menu.workspaceScope": "该工作区",
				"menu.allWorkspaces": "所有工作区",
				"export.selected": "导出选中",
				"menu.row": "更多聊天操作",
				"export.started": "已开始下载备份",
				"export.failed": "备份导出失败，应用仍保持打开，请刷新列表后重试",
				"export.tooLarge": "会话 {id} 超出备份限制，无法打包成可导入的备份。请取消选择它后重试。",
				"export.sourceInvalid": "导出源数据无效，无法打包成备份。",
				"export.timeout": "备份导出超时，未下载不完整文件，请稍后重试",
			"search.placeholder": "搜索会话标题、标签、备注和内容",
            "workspaceArchive.reason.session-ineligible": "会话已不符合归档条件，已跳过",
			"search.contentMatch": "聊天内容命中",
			"preview.open": "查看对话",
			"preview.close": "关闭预览",
			"preview.loading": "正在读取对话…",
			"preview.error": "对话预览加载失败",
			"preview.empty": "这个归档暂无可预览的消息",
			"preview.more": "加载更多",
			"preview.timeline": "对话轮次导航",
			"preview.user": "用户",
			"preview.assistant": "助手",
			"preview.tool": "工具",
			"preview.system": "系统提示词",
			"preview.context": "上下文注入",
			"preview.reasoning": "思考",
			"preview.toolCall": "工具调用",
			"preview.toolResult": "工具结果",
			"preview.toolArguments": "参数",
			"preview.json": "JSON",
			"preview.unknown": "未知内容",
			"preview.copy": "复制",
			"preview.copied": "已复制",
			"preview.copyError": "无法复制，请允许剪贴板访问后重试",
			"preview.imageUnavailable": "图片不可用",
			"preview.readOnly": "只读预览",
			"filter.allChats": "全部聊天",
			"filter.type": "类型",
			"filter.normal": "普通会话",
			"filter.subagent": "子代理会话",
			"filter.allProjects": "所有工作区",
            "filter.scheduled": "自动化任务",
            "filter.scheduleUnsupported": "当前宿主未启用自动化任务服务",
            "filter.scheduleUnavailable": "暂时无法读取自动化任务，请刷新重试",
			"sort.label": "排序方式",
			"sort.newest": "最近更新",
			"sort.oldest": "最早更新",
			"sort.title": "按标题",
			"group.noProject": "未分组",
            "group.defaultWorkspace": "默认工作区",
			"chat.untitled": "未命名会话",
			"chat.unarchive": "取消归档",
			"unarchive.cwdMissing": "此聊天没有工作目录，当前宿主无法将它放回主聊天列表。已归档副本仍保留，可继续预览或导出。",
			"unarchive.authorityUnavailable": "暂时无法确认此聊天能否回到主列表。已归档副本未更改，请稍后重试。",
			"unarchive.deletionPending": "此聊天仍在删除处理中，现在不能取消归档。已归档副本仍保留。",
			"unarchive.pendingUnavailable": "暂时无法核对删除状态，未取消归档。已归档副本仍保留，请稍后重试。",
			"chat.delete": "删除",
			"chat.deleteArchived": "删除已归档的聊天",
            "chat.deleteUnarchived": "删除未归档的聊天",
            "chat.deleteRunning": "请先停止会话，再删除",
			"menu.deleteAllPermanently": "全部删除",
			"menu.unarchiveAll": "全部取消归档",
			"action.deleteAll": "全部删除",
			"group.collapse": "折叠",
			"group.expand": "展开",
			"confirm.cancel": "取消",

			"chat.deleted": "已永久删除",
            "deletion.incomplete": "有未完成的删除，可重试继续。",
			"state.loading": "加载中…",
			"state.empty": "暂无已归档会话",
			"state.emptyFiltered": "未找到匹配的会话",
			"state.error": "加载失败",
			"state.retry": "重试",
			"notice.dismiss": "关闭",
			"tag.filter": "全部标签",
			"tag.edit": "编辑标签与备注",
			"tag.input": "标签",
			"tag.placeholder": "输入标签后按回车",
			"note.label": "备注",
			"note.placeholder": "添加备注（最多 2,000 字）",
			"meta.save": "保存",
			"meta.saved": "已保存标签与备注",
			"meta.unavailable": "元数据不可用，暂无法编辑标签与备注",
			"stats.loading": "正在统计存储…",
			"stats.error": "存储统计不可用",
			"workspaceArchive.action": "归档会话",
				"workspaceArchive.chooseTitle": "选择工作区",
				"workspaceArchive.chooseBody": "选择一个或多个需要归档会话的工作区。",
				"workspaceArchive.selectAll": "全选",
				"workspaceArchive.chooseConfirm": "确定",
				"workspaceArchive.eligibleCount": "{count} 个可归档会话",
				"workspaceArchive.liveCount": "{count} 个运行中会话",
				"workspaceArchive.noWorkspaces": "当前没有可归档的工作区。",
			"workspaceArchive.loadError": "无法载入工作区，请重试。",
			"workspaceArchive.close": "关闭项目归档",
			"workspaceArchive.loading": "正在准备归档…",
			"workspaceArchive.skipped": "跳过的聊天",
				"workspaceArchive.confirmTitle": "归档此工作区的全部会话？",
				"workspaceArchive.confirmBody": "这会将「{workspace}」中的会话归档。之后可在“已归档”中查看。",
				"workspaceArchive.confirmBodyMany": "这会将所选工作区中的会话归档。之后可在“已归档”中查看。",
			"workspaceArchive.skippedLive": "将跳过 {count} 个仍在运行或状态未确认的会话。",
			"workspaceArchive.apply": "确认归档",
			"workspaceArchive.applying": "正在归档…",
			"workspaceArchive.success": "归档成功，已归档 {count} 个会话",
			"workspaceArchive.result": "批量归档结果",
			"workspaceArchive.archived": "已归档",
			"workspaceArchive.failed": "失败",
			"workspaceArchive.done": "完成",
			"workspaceArchive.unsupported": "当前 DSH 版本不支持按项目批量归档。",
			"workspaceArchive.error": "无法完成按项目批量归档，请重试。",
			"workspaceArchive.reason.session-live": "仍在运行或状态未确认，已跳过",
			"workspaceArchive.reason.session-archived": "已归档，已跳过",
			"workspaceArchive.reason.session-empty": "空白新会话，已跳过",
			"workspaceArchive.reason.session-unavailable": "会话内容无法确认，已跳过",
			"workspaceArchive.reason.session-workspace-changed": "项目成员已变化，已跳过",
			"workspaceArchive.reason.archive-failed": "归档失败",
			"workspaceArchive.reason.archive-uncommitted": "归档未完成",
			"workspaceArchive.reason.lifecycle-failed": "操作未完成",
			"workspaceArchive.reason.stop-archive-unsupported": "当前 Host 不支持停止并归档，请先在官方界面停止任务。",
            "workspaceArchive.reason.unknown": "未完成",
			"workspaceArchive.retry": "重新准备",
			"tab.unarchived": "未归档",
			"unarchived.search": "搜索会话标题、ID 和内容",
			"unarchived.empty": "暂无未归档会话",
			"unarchived.error": "未归档会话暂不可用，请重试。",
			"unarchived.loading": "正在加载会话…",
			"unarchived.archiveAll": "全部归档",
			"unarchived.archive": "归档",
			"unarchived.busy": "正在运行",
			"action.refresh": "刷新",
			"ui.chatCount.one": "{count} 个聊天",
			"ui.chatCount.few": "{count} 个聊天",
			"ui.chatCount.many": "{count} 个聊天",
			"ui.chatCount.other": "{count} 个聊天",
			"ui.selectChatLabel": "选择 {title}",
			"ui.removeTagLabel": "移除标签 {tag}",
			"ui.previewJump": "转到第 {index} 条消息",
			"ui.lineageFrom": "分支自：{title}",
			"ui.branchCount.one": "{count} 个分支",
			"ui.branchCount.few": "{count} 个分支",
			"ui.branchCount.many": "{count} 个分支",
			"ui.branchCount.other": "{count} 个分支",
			"ui.tagsLimit": "标签 {count}/8，每个最多 24 个字符",
			"ui.noteLimit": "备注 {count}/2000",
			"scope.deletionDetails": "删除范围包括选中的 {selected} 个会话及关联的 {subagents} 个子智能体，共 {total} 个。未选中的普通分叉会话会保留。",
			"scope.workspaceArchivedTarget": "工作区“{title}”中的全部 {count} 个已归档聊天",
			"scope.workspaceUnarchivedTarget": "工作区“{title}”中的全部 {count} 个未归档聊天",
			"scope.allTarget": "全部 {workspaces} 个工作区中的 {count} 个已归档聊天",
			"scope.selectionTarget": "选中的 {count} 个已归档聊天",
			"scope.chatTarget": "聊天“{title}”",
			"scope.deleteArchivedWorkspace": "删除该工作区的全部已归档聊天？",
			"scope.deleteUnarchivedWorkspace": "删除该工作区的全部未归档聊天？",
			"scope.deleteAll": "删除所有已归档本地聊天？",
			"scope.deleteSelection": "删除选中的已归档聊天？",
			"scope.deleteArchivedOne": "删除已归档的聊天？",
			"scope.deleteUnarchivedOne": "删除未归档的聊天？",
			"scope.deleteBody": "这将永久删除{target}。此操作无法恢复。",
			"scope.deleteLocalBody": "这将永久删除本地{target}。此操作无法恢复。",
			"scope.unarchiveWorkspaceTarget": "「{title}」中的已归档会话",
			"scope.unarchiveAllTarget": "所有工作区中的已归档会话",
			"scope.unarchiveSelectionTarget": "选中的已归档会话",
			"scope.unarchiveWorkspace": "取消归档此工作区的全部会话？",
			"scope.unarchiveSelection": "取消归档选中的会话？",
			"scope.unarchiveAll": "取消归档全部会话？",
			"scope.unarchiveBody": "这会将{target}恢复到聊天列表。",
			"scope.exportWorkspace": "导出该工作区的全部已归档聊天？",
			"scope.exportSelection": "导出选中的聊天？",
			"scope.exportAll": "导出全部已归档聊天？",
			"scope.exportBody": "这将把{target}导出为 ZIP 备份，不会改变聊天的归档状态。备份可能包含敏感内容，请妥善保存。",
			"scope.stopArchiveAll": "停止并归档全部会话？",
			"scope.stopArchiveOne": "停止并归档此会话？",
			"scope.stopArchiveMany": "停止并归档这些会话？",
			"scope.archiveAll": "归档全部会话？",
			"scope.archiveOne": "归档此会话？",
			"scope.archiveSelectedWorkspaces": "归档所选工作区的会话？",
			"scope.archiveAllBody": "这会将所有工作区中的会话归档。之后可在“已归档”中查看。",
			"scope.archiveOneBody": "这会将此会话归档。之后可在“已归档”中查看。",
			"scope.stopArchiveBody": "归档会停止所选会话中正在进行的工作。之后可以取消归档。",
			"scope.stopArchiveAction": "停止并归档",
			"failure.purge-unsupported": "当前存储后端不支持永久删除。",
			"failure.restore-unsupported": "当前存储后端不支持恢复此会话。",
			"failure.session-live-purge-pending": "会话仍在使用中，请停止会话后重试。",
			"failure.unarchived-delete-running": "请先停止正在运行的聊天，再重试删除。",
			"failure.session-delete-running": "请先停止会话及其子智能体，再重试删除。",
			"failure.deletion-scope-changed": "删除范围已变化，请重新选择并确认。",
			"failure.unarchived-delete-changed": "会话或所属工作区已变化，请刷新后重试。",
			"failure.refreshRetry": "请刷新后重试。",
			"failure.operationOne": "{count} 个会话操作失败：{reason}",
			"failure.operationMany": "{count} 个会话操作失败：{reason}",
			"import.packageFormat": "格式 v{version}",
			"import.sessionCount.other": "{count} 个会话",
			"preview.footnotes": "脚注",
			"preview.process.toolCalls.other": "{count} 次工具调用",
			"preview.process.messages.other": "{count} 条消息",
			"preview.process.subagents.other": "{count} 个子代理",
			"preview.process.thought": "已思考",
			"preview.process.incomplete": "未正常完成",
			"preview.anchorMissing": "命中消息已变化或不在可预览范围内，已从开头显示。",
			"preview.earlier": "加载更早消息",
			"menu.workspaceActions": "更多工作区操作 · {title}",
			"unarchived.archiveUnavailable": "暂不可归档",
			"lineage.delegatedBy": "子智能体来源：{title}",
			"import.sessionCount.few": "{count} 个会话",
			"import.sessionCount.many": "{count} 个会话",
			"import.sessionCount.one": "{count} 个会话",
			"preview.process.messages.few": "{count} 条消息",
			"preview.process.messages.many": "{count} 条消息",
			"preview.process.messages.one": "{count} 条消息",
			"preview.process.subagents.few": "{count} 个子代理",
			"preview.process.subagents.many": "{count} 个子代理",
			"preview.process.subagents.one": "{count} 个子代理",
			"preview.process.toolCalls.few": "{count} 次工具调用",
			"preview.process.toolCalls.many": "{count} 次工具调用",
			"preview.process.toolCalls.one": "{count} 次工具调用",
			"chat.listChanged": "聊天列表已变化，请刷新后重新选择。",
			"search.progress": "{status}：已处理候选 {processed}/{total}，正文命中 {hits} 个聊天，当前显示 {displayed} 个聊天，失败 {failed} 个聊天",
			"search.status.loading": "正在搜索",
			"search.status.ready": "搜索完成",
			"search.status.partial": "搜索结束，存在未读取项",
			"search.status.stopped": "搜索已停止",
			"search.status.error": "搜索失败",
			"search.stop": "停止搜索",
			"search.retryUnfinished": "重试未完成项",
			"search.unreadable": "未读取详情",
			"update.restartNeeded": "等待重启",
			"update.view": "查看更新",
			"menu.moreArchiveActions": "更多归档操作",
			"selection.enter": "选择",
			"selection.selectResults": "全选当前结果",
			"selection.count": "已选 {count} 项",
			"selection.hiddenCount": "{count} 项不在当前结果中",
			"selection.moreActions": "更多选中项操作",
			"selection.deletePermanently": "永久删除选中会话",
			"aboutInfo.author": "作者",
			"aboutInfo.automaticChecks": "打开归档管理后自动检查，页面保持打开或重新联网时补查。成功结果缓存 12 小时，失败 15 分钟后重试；不会自动安装或重启。",
			"aboutInfo.changelog": "更新日志",
			"aboutInfo.checkUpdates": "检查更新",
			"aboutInfo.currentVersion": "当前版本",
			"aboutInfo.description": "搜索和整理 DeepSeek Harness 会话，管理归档、标签与备注，查看会话谱系，导入和导出会话备份。",
			"aboutInfo.feedback": "问题反馈",
			"aboutInfo.home": "项目主页",
			"aboutInfo.license": "许可证",
			"aboutInfo.loadFailed": "插件信息读取失败，请重新读取",
			"aboutInfo.loading": "正在读取插件信息…",
			"aboutInfo.localCurrent": "当前使用本地开发版",
			"aboutInfo.marketplace": "插件市场",
			"aboutInfo.reload": "重新读取",
			"aboutInfo.reloadInstructions": "请确认 DSH 连接正常。如果刚更新插件，请重新加载 DSH 后端后重试；仅刷新页面可能尚未启用新版接口。",
			"aboutInfo.starLink": "给项目一个 ⭐ Star",
			"aboutInfo.starPrompt": "如果它帮你找回了旧方案，欢迎{link}。",
			"aboutInfo.updateAvailable": "有新版本 v{version}",
			"aboutInfo.updateDetails": "打开更新详情，可查看当前环境、复制安装信息，或在宿主支持时安装更新。本地开发版不会被线上包覆盖。",
			"aboutInfo.userGuide": "使用指南",
			"aboutInfo.versionHeading": "版本与更新",
			"aboutInfo.versionLoading": "读取中…",
			"aboutInfo.versionUnavailable": "暂不可用",
			"updateUi.applied": "宿主已应用 v{version}，重新打开归档管理可确认运行版本。",
			"updateUi.available": "发现新版本 v{version}",
			"updateUi.bundledCommand": "命令使用当前桌面端自带的 dsh。",
			"updateUi.checkAgain": "重新检查",
			"updateUi.checking": "正在检查更新…",
			"updateUi.close": "关闭",
			"updateUi.copied": "复制成功",
			"updateUi.copyCommand": "复制更新命令",
			"updateUi.copyFailed": "复制失败，请选中文本手动复制。",
			"updateUi.copyLocalPath": "复制本地路径",
			"updateUi.copyPackage": "复制包名与版本",
			"updateUi.current": "当前已是最新版本",
			"updateUi.currentEnvironment": "当前环境",
			"updateUi.environmentCli": "当前 DSH 环境",
			"updateUi.environmentDesktop": "官方桌面端",
			"updateUi.environmentUnknown": "运行环境未识别",
			"updateUi.errorAlreadyApplied": "宿主已应用更新，请重新打开归档管理确认运行版本。",
			"updateUi.errorHostManaged": "当前宿主要求通过插件管理页面更新，请按下方指引操作。",
			"updateUi.errorLocalInstall": "当前已切换为本地开发版，已阻止线上覆盖。",
			"updateUi.errorRestoreFailed": "新版安装失败，旧版本也未能确认恢复。请到官方插件页检查并重新安装。",
			"updateUi.errorRestored": "新版安装失败，官方插件管理器已恢复旧版本。请重新打开归档管理确认。",
			"updateUi.errorUnverified": "未能确认更新完成。请重新打开本页核对状态；仍未完成时，通过宿主插件页面检查错误或使用下方命令。",
			"updateUi.errorVersionChanged": "版本信息已变化，请重新检查后再更新。",
			"updateUi.externalInstructions": "当前由外部来源安装，请按原来源更新。以下信息可用于在其他环境安装公开版本。",
			"updateUi.install": "安装更新",
			"updateUi.installInstructions": "点击「安装更新」由官方插件管理器检查兼容性并替换当前插件。更新期间本页可能关闭，完成后重新打开归档管理确认版本；需要重启时会明确提示。",
			"updateUi.installing": "正在安装…",
			"updateUi.installingThroughHost": "正在通过宿主安装更新…",
			"updateUi.lastChecked": "上次检查",
			"updateUi.localCheckout": "本地开发版",
			"updateUi.localCurrent": "本地开发版已连接，以下为公开版本信息。",
			"updateUi.localInstructions": "当前连接本地源码，不会被线上更新替换。修改后重启 DSH 即可加载；在另一端接入时，粘贴下面目录到「添加插件」。",
			"updateUi.manualInstructions": "请前往官方插件页，找到归档管理，在版本区域更新；旧宿主要求重新安装时，按页面提示操作。下方包名也可用于在其他环境添加插件。",
			"updateUi.previousPublicRelease": "v{version}（上次结果）",
			"updateUi.privacy": "自动检查只读取公开 npm 版本，不上传会话；不会自动安装或重启。",
			"updateUi.publicRelease": "公开版本",
			"updateUi.restartRequired": "v{version} 已安装，请重启 DSH 后确认运行版本。",
			"updateUi.runningVersion": "运行版本",
			"updateUi.terminalCommand": "终端更新命令",
			"updateUi.terminalDesktopInstructions": "也可在运行 DSH 的电脑完全退出桌面端后执行以下命令。",
			"updateUi.terminalHostInstructions": "也可在运行 DSH 的电脑退出当前 DSH 后执行以下命令。",
			"updateUi.title": "插件更新",
			"updateUi.unavailable": "检查更新失败，可稍后重试",
			"updateUi.unchecked": "尚未检查更新",
		};
		const en = {
			"locale.intl": "en-US",
			"nav": "Archive Management",
				"page.title": "Archive Management",
				"page.description": "View, search, and manage archived chats",
				"tab.archived": "Archived",
                "archive.viewArchived": "View Archived",
                "chat.deletionUnverified": "Deletion status is unavailable. Try again later.",
				"tab.lineage": "Origins & Branches",
				"tab.about": "About",
				"about.updateAvailable": "Update available",
				"help.label": "Help: {label}",
			"archive.view": "View",

				"lineage.origin.subagent": "Subagent",
                "lineage.origin.fork": "Fork",
                "lineage.origin.root": "Original chat",
                "lineage.origin.unknown": "Unknown origin",
				"lineage.copyId": "Copy ID",
				"lineage.copiedId": "Copied",
				"lineage.loading": "Loading origins and branches…",
				"lineage.error": "Origins and branches are unavailable",
				"lineage.scopeNote": "View chat origins and branches across all workspaces in this Host, including archived and unarchived chats. Status filters apply to the list; graphs retain the complete family. Duplicate source references are not counted.",
				"lineage.search": "Search chat titles, workspaces, and IDs",
				"lineage.projectFilter": "Filter by project",
				"lineage.statusFilter": "Filter status",
				"lineage.statusAll": "All statuses",
				"lineage.managedHeading": "Chat relationships",
                "lineage.relatedWorkspaces": "All workspaces",
                "lineage.noArchives": "No chats",
				"lineage.managedCount": "chats",
                "lineage.totalCount": "Total: {count} chats",
                "lineage.resultCount": "Current results: {count} chats",
				"lineage.expandAll": "Expand all",
				"lineage.collapseAll": "Collapse all",
				"lineage.searchFoldHint": "Matching workspaces stay expanded while filtering",
				"lineage.empty": "No matching chats",
                "lineage.workspaceEmpty": "No chats",
                "lineage.trackingUnavailable": "Source tracking is unavailable. Some new fork sources may not have been recorded.",
                "lineage.deletionUnavailable": "Deletion status is unavailable. Pending deletions could not be verified.",
				"lineage.status.active": "Unarchived",
				"lineage.status.archived": "Archived",
				"lineage.status.missing": "Source unavailable",
				"lineage.untitled": "Untitled chat",
				"lineage.sourceUnavailable": "Source information unavailable",
				"lineage.sourceContext": "Source",
				"lineage.contextOnly": "Source context only",
                "lineage.searchMatch": "Matching chat",
                "lineage.independent": "Independent chat",
                "lineage.sourceUnrecorded": "Source chat not recorded",
                "lineage.sourceUnrecordedHint": "This chat contains inherited history, but no source chat was recorded, so a source connection cannot be shown. Its content remains available.",
                "lineage.view.open": "Chat lineage",
                "lineage.view.title": "Conversation lineage graph",
                "lineage.view.close": "Close conversation lineage graph",
                "lineage.view.pan": "Relationship canvas. Drag the background or scroll to explore",
                "lineage.view.enlarge": "Expand view",
                "lineage.view.restore": "Return to page",
                "lineage.view.zoomIn": "Zoom in",
                "lineage.view.zoomOut": "Zoom out",
                "lineage.view.zoom": "Zoom level",
                "lineage.view.fit": "Fit view",
                "lineage.view.hint": "Drag to pan · Ctrl/⌘ + wheel to zoom · Click a title to preview",
                "lineage.view.nodes": "nodes",
                "lineage.view.connections": "connections",

                "lineage.searchRelated": "Related branch",
				"lineage.start": "Starting chat",
				"lineage.created": "Created",
				"lineage.project": "Project",
				"lineage.delegation": "Delegation level",
				"lineage.noBranches": "No branches",
				"lineage.crossWorkspace": "Source workspace",
				"lineage.sourceId": "Source ID",
				"lineage.diagnostic.missing-parent": "Missing parent",
				"lineage.diagnostic.missing-parent.detail": "Source information for the parent chat is unavailable",
				"lineage.diagnostic.self-parent": "Self-parent link",
				"lineage.diagnostic.cycle": "Cycle detected",
				"lineage.diagnostic.delegation-depth-mismatch": "Delegation depth mismatch",
					"action.import": "Import backup",
					"action.export": "Export all",
				"import.title": "Import archived backup",
				"import.inspecting": "Inspecting backup…",
				"import.preview": "Review the sessions before restoring",
				"import.package": "Backup details",
				"import.confirm": "Restore selected",
				"import.cancel": "Cancel",
				"import.close": "Close",
				"import.selectAll": "Select restorable",
				"import.clear": "Clear selection",
				"import.conflict": "ID conflict, will be skipped",
				"import.workspaceWarning": "Workspace is missing; will stay ungrouped",
				"import.cwdUnsupported": "The working directory is incompatible or ambiguous on this system. Keep the original ZIP and check its source directory; directory mapping is not supported.",
				"import.cwdInvalid": "The backup working directory is invalid and cannot be restored. Keep the original ZIP and check its source.",
				"import.attachmentWarning": "Attachment references found; attachment files are not restored",
				"import.restored": "Restored",
				"import.skipped": "Skipped",
				"import.expired": "The preview expired. Choose the backup again",
				"import.done": "Backup restore completed",
				"import.unsupported": "This Host cannot restore this backup losslessly. Keep the ZIP and check Host compatibility.",
				"import.rollbackFailed": "Restore was incomplete and some writes could not be safely rolled back. Related files were retained. Keep the ZIP and investigate before retrying; do not delete conflicting chats.",
				"import.conflictChanged": "Selected chats already exist or remain pending deletion. Existing data was not overwritten. Choose the backup again to review.",
				"import.titlePublicationDegraded": "The chat was restored safely, but its title may not appear in the main list until the chat is opened.",
				"import.seededTitleLimitation": "The chat was restored safely. This Host cannot publish a branched title in its cold-start list; opening the chat will display it normally.",
				"export.all": "Export all",
				"menu.workspaceScope": "This workspace",
				"menu.allWorkspaces": "All workspaces",
				"export.selected": "Export selected",
				"menu.row": "More chat actions",
				"export.started": "Backup download started",
				"export.failed": "Backup export failed. The app remains open; refresh the list and try again",
				"export.tooLarge": "Chat {id} exceeds the backup limit and cannot be packaged into an importable backup. Deselect it and try again.",
				"export.sourceInvalid": "The export source is invalid and cannot be packaged into a backup.",
				"export.timeout": "Backup export timed out. No incomplete file was downloaded; try again later",
			"search.placeholder": "Search titles, tags, notes, and conversation content",
            "workspaceArchive.reason.session-ineligible": "Chat is no longer eligible for archiving; skipped",
			"search.contentMatch": "Conversation match",
			"preview.open": "View conversation",
			"preview.close": "Close preview",
			"preview.loading": "Loading conversation…",
			"preview.error": "Conversation preview failed to load",
			"preview.empty": "This archive has no previewable messages",
			"preview.more": "Load more",
			"preview.timeline": "Conversation timeline",
			"preview.user": "User",
			"preview.assistant": "Assistant",
			"preview.tool": "Tool",
			"preview.system": "System prompt",
			"preview.context": "Injected context",
			"preview.reasoning": "Reasoning",
			"preview.toolCall": "Tool call",
			"preview.toolResult": "Tool result",
			"preview.toolArguments": "Arguments",
			"preview.json": "JSON",
			"preview.unknown": "Unknown content",
			"preview.copy": "Copy",
			"preview.copied": "Copied",
			"preview.copyError": "Could not copy. Allow clipboard access and try again",
			"preview.imageUnavailable": "Image unavailable",
			"preview.readOnly": "Read-only preview",
			"filter.allChats": "All chats",
			"filter.type": "Type",
			"filter.normal": "Regular chats",
			"filter.subagent": "Subagent chats",
			"filter.allProjects": "All workspaces",
            "filter.scheduled": "Automation tasks",
            "filter.scheduleUnsupported": "Automation tasks are not enabled on this Host",
            "filter.scheduleUnavailable": "Automation tasks are unavailable. Refresh to retry.",
			"sort.label": "Sort order",
			"sort.newest": "Recently updated",
			"sort.oldest": "Least recently updated",
			"sort.title": "Title",
			"group.noProject": "Ungrouped",
            "group.defaultWorkspace": "Default workspace",
			"chat.untitled": "Untitled chat",
			"chat.unarchive": "Unarchive",
			"unarchive.cwdMissing": "This chat has no working directory, so this Host cannot return it to the main chat list. Its archived copy is preserved for preview and export.",
			"unarchive.authorityUnavailable": "The Host cannot currently confirm that this chat can return to the main list. Its archived copy is unchanged; try again later.",
			"unarchive.deletionPending": "This chat is still in deletion processing and cannot be unarchived yet. Its archived copy is preserved.",
			"unarchive.pendingUnavailable": "The deletion state cannot be checked right now, so the chat was not unarchived. Its archived copy is preserved; try again later.",
			"chat.delete": "Delete",
			"chat.deleteArchived": "Delete archived chat",
            "chat.deleteUnarchived": "Delete unarchived chat",
            "chat.deleteRunning": "Stop this chat before deleting it",
			"menu.deleteAllPermanently": "Delete all",
			"menu.unarchiveAll": "Unarchive all",
			"action.deleteAll": "Delete all",
			"group.collapse": "Collapse",
			"group.expand": "Expand",
			"confirm.cancel": "Cancel",

			"chat.deleted": "Permanently deleted",
            "deletion.incomplete": "Some deletions did not finish. Retry to continue.",
			"state.loading": "Loading…",
			"state.empty": "No archived chats",
			"state.emptyFiltered": "No matching chats found",
			"state.error": "Failed to load",
			"state.retry": "Retry",
			"notice.dismiss": "Dismiss",
			"tag.filter": "All tags",
			"tag.edit": "Edit tags and note",
			"tag.input": "Tags",
			"tag.placeholder": "Type a tag and press Enter",
			"note.label": "Note",
			"note.placeholder": "Add a note (up to 2,000 characters)",
			"meta.save": "Save",
			"meta.saved": "Tags and note saved",
			"meta.unavailable": "Metadata unavailable, editing tags and notes is disabled",
			"stats.loading": "Measuring storage…",
			"stats.error": "Storage statistics unavailable",
			"workspaceArchive.action": "Archive chats",
				"workspaceArchive.chooseTitle": "Choose a workspace",
				"workspaceArchive.chooseBody": "Choose one or more workspaces whose chats you want to archive.",
				"workspaceArchive.selectAll": "Select all",
				"workspaceArchive.chooseConfirm": "Confirm",
				"workspaceArchive.eligibleCount": "{count} chats available",
				"workspaceArchive.liveCount": "{count} running chats",
				"workspaceArchive.noWorkspaces": "There are no workspaces with chats available to archive.",
			"workspaceArchive.loadError": "Could not load workspaces. Try again.",
			"workspaceArchive.close": "Close workspace archive",
			"workspaceArchive.loading": "Preparing archive…",
			"workspaceArchive.skipped": "Skipped chats",
				"workspaceArchive.confirmTitle": "Archive all chats in this workspace?",
				"workspaceArchive.confirmBody": "This will archive chats in \"{workspace}\". You can find them later under Archived in Archive Management.",
				"workspaceArchive.confirmBodyMany": "This will archive chats in the selected workspaces. You can find them later under Archived.",
			"workspaceArchive.skippedLive": "Skipping {count} running chats or chats with unconfirmed status.",
			"workspaceArchive.apply": "Confirm archive",
			"workspaceArchive.applying": "Archiving…",
			"workspaceArchive.success": "Archive complete: {count} chats archived",
			"workspaceArchive.result": "Workspace archive result",
			"workspaceArchive.archived": "Archived",
			"workspaceArchive.failed": "Failed",
			"workspaceArchive.done": "Done",
			"workspaceArchive.unsupported": "This DSH version does not support workspace bulk archive.",
			"workspaceArchive.error": "Could not complete workspace bulk archive. Try again.",
			"workspaceArchive.reason.session-live": "Running or status unconfirmed; skipped",
			"workspaceArchive.reason.session-archived": "Already archived; skipped",
			"workspaceArchive.reason.session-empty": "Blank new session; skipped",
			"workspaceArchive.reason.session-unavailable": "Conversation content could not be confirmed; skipped",
			"workspaceArchive.reason.session-workspace-changed": "Workspace membership changed; skipped",
			"workspaceArchive.reason.archive-failed": "Archive failed",
			"workspaceArchive.reason.archive-uncommitted": "Archive did not complete",
			"workspaceArchive.reason.lifecycle-failed": "Operation did not complete",
			"workspaceArchive.reason.stop-archive-unsupported": "This Host cannot stop and archive. Stop the task in the official UI first.",
            "workspaceArchive.reason.unknown": "Not completed",
			"workspaceArchive.retry": "Prepare again",
			"tab.unarchived": "Unarchived",
			"unarchived.search": "Search titles, IDs, and conversation content",
			"unarchived.empty": "No unarchived chats",
			"unarchived.error": "Unarchived chats are unavailable. Please retry.",
			"unarchived.loading": "Loading chats…",
			"unarchived.archiveAll": "Archive all",
			"unarchived.archive": "Archive",
			"unarchived.busy": "Running",
			"action.refresh": "Refresh",
			"ui.chatCount.one": "{count} chat",
			"ui.chatCount.few": "{count} chats",
			"ui.chatCount.many": "{count} chats",
			"ui.chatCount.other": "{count} chats",
			"ui.selectChatLabel": "Select {title}",
			"ui.removeTagLabel": "Remove tag {tag}",
			"ui.previewJump": "Go to message {index}",
			"ui.lineageFrom": "Branched from \"{title}\"",
			"ui.branchCount.one": "{count} branch",
			"ui.branchCount.few": "{count} branches",
			"ui.branchCount.many": "{count} branches",
			"ui.branchCount.other": "{count} branches",
			"ui.tagsLimit": "Tags {count}/8, up to 24 characters each",
			"ui.noteLimit": "Note {count}/2000",
			"scope.deletionDetails": "The scope includes {selected} selected chat(s) and {subagents} associated subagent chat(s), {total} in total. Unselected independent forks are preserved.",
			"scope.workspaceArchivedTarget": "all {count} archived chats in workspace “{title}”",
			"scope.workspaceUnarchivedTarget": "all {count} unarchived chats in workspace “{title}”",
			"scope.allTarget": "all {count} archived chats across {workspaces} workspaces",
			"scope.selectionTarget": "the {count} selected archived chats",
			"scope.chatTarget": "chat “{title}”",
			"scope.deleteArchivedWorkspace": "Delete all archived chats in this workspace?",
			"scope.deleteUnarchivedWorkspace": "Delete all unarchived chats in this workspace?",
			"scope.deleteAll": "Delete all archived local chats?",
			"scope.deleteSelection": "Delete selected archived chats?",
			"scope.deleteArchivedOne": "Delete archived chat?",
			"scope.deleteUnarchivedOne": "Delete unarchived chat?",
			"scope.deleteBody": "This permanently deletes {target}. This cannot be undone.",
			"scope.deleteLocalBody": "This permanently deletes {target}. This cannot be undone.",
			"scope.unarchiveWorkspaceTarget": "archived chats in workspace “{title}”",
			"scope.unarchiveAllTarget": "archived chats in all workspaces",
			"scope.unarchiveSelectionTarget": "the selected archived chats",
			"scope.unarchiveWorkspace": "Unarchive all chats in this workspace?",
			"scope.unarchiveSelection": "Unarchive selected chats?",
			"scope.unarchiveAll": "Unarchive all chats?",
			"scope.unarchiveBody": "This returns {target} to the chat list.",
			"scope.exportWorkspace": "Export all archived chats in this workspace?",
			"scope.exportSelection": "Export selected chats?",
			"scope.exportAll": "Export all archived chats?",
			"scope.exportBody": "This exports {target} as a ZIP backup without changing their archived state. Backups may contain sensitive content; store them securely.",
			"scope.stopArchiveAll": "Stop and archive all chats?",
			"scope.stopArchiveOne": "Stop and archive this chat?",
			"scope.stopArchiveMany": "Stop and archive these chats?",
			"scope.archiveAll": "Archive all chats?",
			"scope.archiveOne": "Archive this chat?",
			"scope.archiveSelectedWorkspaces": "Archive chats in the selected workspaces?",
			"scope.archiveAllBody": "This will archive chats in all workspaces. You can find them later under Archived.",
			"scope.archiveOneBody": "This will archive this chat. You can find it later under Archived.",
			"scope.stopArchiveBody": "Archiving will stop ongoing work in the selected chats. You can unarchive them later.",
			"scope.stopArchiveAction": "Stop and archive",
			"failure.purge-unsupported": "This storage backend does not support permanent deletion.",
			"failure.restore-unsupported": "This storage backend cannot restore this chat.",
			"failure.session-live-purge-pending": "The chat is still active. Stop it and try again.",
			"failure.unarchived-delete-running": "Stop the running chat before deleting it.",
			"failure.session-delete-running": "Stop the chat and its subagents before deleting.",
			"failure.deletion-scope-changed": "The deletion scope changed. Select and confirm again.",
			"failure.unarchived-delete-changed": "The chat or its workspace changed. Refresh and try again.",
			"failure.refreshRetry": "Refresh and try again.",
			"failure.operationOne": "Operation failed for {count} chat: {reason}",
			"failure.operationMany": "Operation failed for {count} chats: {reason}",
			"import.packageFormat": "format v{version}",
			"import.sessionCount.one": "{count} session",
			"import.sessionCount.other": "{count} sessions",
			"preview.footnotes": "Footnotes",
			"preview.process.toolCalls.one": "{count} tool call",
			"preview.process.toolCalls.other": "{count} tool calls",
			"preview.process.messages.one": "{count} message",
			"preview.process.messages.other": "{count} messages",
			"preview.process.subagents.one": "{count} subagent",
			"preview.process.subagents.other": "{count} subagents",
			"preview.process.thought": "Thought for a while",
			"preview.process.incomplete": "Not completed",
			"preview.anchorMissing": "The matched message changed or is outside the preview range. Showing the beginning.",
			"preview.earlier": "Load earlier messages",
			"menu.workspaceActions": "More workspace actions · {title}",
			"unarchived.archiveUnavailable": "Unavailable",
			"lineage.delegatedBy": "Delegated by \"{title}\"",
			"import.sessionCount.few": "{count} sessions",
			"import.sessionCount.many": "{count} sessions",
			"preview.process.messages.few": "{count} messages",
			"preview.process.messages.many": "{count} messages",
			"preview.process.subagents.few": "{count} subagents",
			"preview.process.subagents.many": "{count} subagents",
			"preview.process.toolCalls.few": "{count} tool calls",
			"preview.process.toolCalls.many": "{count} tool calls",
			"chat.listChanged": "The chat list changed. Refresh and select again.",
			"search.progress": "{status}: Candidates processed {processed}/{total}; Body-matched chats {hits}; Displayed chats {displayed}; Failed chats {failed}",
			"search.status.loading": "Searching",
			"search.status.ready": "Search complete",
			"search.status.partial": "Scan ended with unreadable chats",
			"search.status.stopped": "Search stopped",
			"search.status.error": "Search failed",
			"search.stop": "Stop search",
			"search.retryUnfinished": "Retry unfinished",
			"search.unreadable": "Unreadable chats",
			"update.restartNeeded": "Restart needed",
			"update.view": "View update",
			"menu.moreArchiveActions": "More archive actions",
			"selection.enter": "Select",
			"selection.selectResults": "Select all current results",
			"selection.count": "{count} selected",
			"selection.hiddenCount": "{count} outside current results",
			"selection.moreActions": "More selection actions",
			"selection.deletePermanently": "Permanently delete selected chats",
			"aboutInfo.author": "Author",
			"aboutInfo.automaticChecks": "Opening Archive Management checks automatically, with periodic and reconnection checks while the page stays open. Success is cached for 12 hours; failures retry after 15 minutes. No automatic installation or restart.",
			"aboutInfo.changelog": "Changelog",
			"aboutInfo.checkUpdates": "Check for updates",
			"aboutInfo.currentVersion": "Current version",
			"aboutInfo.description": "Search and organize DeepSeek Harness chats, manage archives, tags and notes, explore conversation lineage, and import or export chat backups.",
			"aboutInfo.feedback": "Report an issue",
			"aboutInfo.home": "Project home",
			"aboutInfo.license": "License",
			"aboutInfo.loadFailed": "Plugin information could not be loaded. Retry loading.",
			"aboutInfo.loading": "Loading plugin information…",
			"aboutInfo.localCurrent": "Using a local checkout",
			"aboutInfo.marketplace": "Plugin market",
			"aboutInfo.reload": "Reload information",
			"aboutInfo.reloadInstructions": "Check your DSH connection. If you just updated the plugin, reload the DSH backend and retry; refreshing the page alone may not activate the new endpoints.",
			"aboutInfo.starLink": "giving the project a ⭐ Star",
			"aboutInfo.starPrompt": "If this helped you find past work, consider {link}.",
			"aboutInfo.updateAvailable": "Version {version} is available",
			"aboutInfo.updateDetails": "Open update details to see the current host, copy installation information, or install an update when supported. Local checkouts are protected from registry replacement.",
			"aboutInfo.userGuide": "User guide",
			"aboutInfo.versionHeading": "Version and updates",
			"aboutInfo.versionLoading": "Loading…",
			"aboutInfo.versionUnavailable": "Unavailable",
			"updateUi.applied": "The host applied v{version}. Reopen Archive Management to verify the running version.",
			"updateUi.available": "Version {version} is available",
			"updateUi.bundledCommand": "This command uses the current Desktop’s bundled dsh.",
			"updateUi.checkAgain": "Check again",
			"updateUi.checking": "Checking for updates…",
			"updateUi.close": "Close",
			"updateUi.copied": "Copied",
			"updateUi.copyCommand": "Copy update command",
			"updateUi.copyFailed": "Copy failed. Select the text and copy it manually.",
			"updateUi.copyLocalPath": "Copy local path",
			"updateUi.copyPackage": "Copy package and version",
			"updateUi.current": "You’re up to date",
			"updateUi.currentEnvironment": "Current environment",
			"updateUi.environmentCli": "Current DSH host",
			"updateUi.environmentDesktop": "Official Desktop",
			"updateUi.environmentUnknown": "Unrecognized host",
			"updateUi.errorAlreadyApplied": "The host already applied the update. Reopen Archive Management to verify the running version.",
			"updateUi.errorHostManaged": "Use the host’s plugin manager to update. Follow the instructions below.",
			"updateUi.errorLocalInstall": "This is now a local checkout; registry replacement was blocked.",
			"updateUi.errorRestoreFailed": "The update failed and restoration could not be verified. Check the official Plugins page and reinstall.",
			"updateUi.errorRestored": "The update failed and the official plugin manager restored the previous version. Reopen Archive Management to verify.",
			"updateUi.errorUnverified": "Update completion could not be confirmed. Reopen this page to check its state, then use the host’s plugin page or the command below if needed.",
			"updateUi.errorVersionChanged": "Version information changed. Check again before updating.",
			"updateUi.externalInstructions": "This plugin uses an external source; update from that source. Use the information below to install a public release elsewhere.",
			"updateUi.install": "Install update",
			"updateUi.installInstructions": "Install update lets the official plugin manager check compatibility and replace this plugin. This page may close during replacement. Reopen Archive Management to verify the version. A required restart is reported explicitly.",
			"updateUi.installing": "Installing…",
			"updateUi.installingThroughHost": "Installing through the host…",
			"updateUi.lastChecked": "Last checked",
			"updateUi.localCheckout": "Local checkout",
			"updateUi.localCurrent": "Local checkout connected. Public release information is shown below.",
			"updateUi.localInstructions": "This local checkout is protected from registry replacement. Restart DSH after editing. To connect it in another host, paste this directory into Add plugin.",
			"updateUi.manualInstructions": "Find Archive Management on the official Plugins page and update from its Versions section. Follow reinstall instructions on older hosts. The package below can also be added in another host.",
			"updateUi.previousPublicRelease": "v{version} (previous check)",
			"updateUi.privacy": "Automatic checks read public npm metadata only, without sending chats. They never install or restart automatically.",
			"updateUi.publicRelease": "Public release",
			"updateUi.restartRequired": "v{version} installed. Restart DSH and verify the running version.",
			"updateUi.runningVersion": "Running version",
			"updateUi.terminalCommand": "Terminal update command",
			"updateUi.terminalDesktopInstructions": "Alternatively, quit this DSH host and run this command on the same computer.",
			"updateUi.terminalHostInstructions": "Alternatively, quit this DSH host and run this command on the same computer.",
			"updateUi.title": "Plugin update",
			"updateUi.unavailable": "Update check failed. Try again later.",
			"updateUi.unchecked": "Updates haven’t been checked yet",
		};

		const de = {
			"locale.intl": "de-DE",
			"nav": "Archivverwaltung",
			"page.title": "Archivverwaltung",
			"page.description": "Archivierte Chats ansehen, durchsuchen und verwalten",
			"tab.archived": "Archiviert",
			"archive.viewArchived": "Archivierte Chats anzeigen",
			"chat.deletionUnverified": "Der Löschstatus lässt sich derzeit nicht prüfen. Versuchen Sie es später erneut.",
			"tab.lineage": "Ursprünge und Zweige",
			"tab.about": "Über das Plugin",
			"about.updateAvailable": "Update verfügbar",
			"help.label": "Hilfe: {label}",
			"archive.view": "Ansehen",
			"lineage.origin.subagent": "Subagent",
			"lineage.origin.fork": "Abzweigung",
			"lineage.origin.root": "Ursprünglicher Chat",
			"lineage.origin.unknown": "Ursprung unbekannt",
			"lineage.copyId": "ID kopieren",
			"lineage.copiedId": "Kopiert",
			"lineage.loading": "Ursprünge und Zweige werden geladen …",
			"lineage.error": "Ursprünge und Zweige sind nicht verfügbar",
			"lineage.scopeNote": "Hier sehen Sie die Ursprünge und Zweige archivierter und nicht archivierter Chats aus allen Arbeitsbereichen dieses Hosts. Statusfilter gelten nur für die Liste. Das Diagramm zeigt weiterhin alle verwandten Chats. Doppelte Verweise auf Quellchats werden nicht mitgezählt.",
			"lineage.search": "Chattitel, Arbeitsbereiche und IDs durchsuchen",
			"lineage.projectFilter": "Nach Projekt filtern",
			"lineage.statusFilter": "Nach Status filtern",
			"lineage.statusAll": "Alle Status",
			"lineage.managedHeading": "Beziehungen zwischen Chats",
			"lineage.relatedWorkspaces": "Alle Arbeitsbereiche",
			"lineage.noArchives": "Keine Chats",
			"lineage.managedCount": "insgesamt",
			"lineage.totalCount": "Chats insgesamt: {count}",
			"lineage.resultCount": "Gefundene Chats: {count}",
			"lineage.expandAll": "Alle ausklappen",
			"lineage.collapseAll": "Alle einklappen",
			"lineage.searchFoldHint": "Arbeitsbereiche mit Treffern bleiben beim Filtern ausgeklappt",
			"lineage.empty": "Keine passenden Chats",
			"lineage.workspaceEmpty": "Keine Chats",
			"lineage.trackingUnavailable": "Die Herkunft lässt sich derzeit nicht nachverfolgen. Bei einigen neuen Zweigen wurde der Quellchat möglicherweise nicht erfasst.",
			"lineage.deletionUnavailable": "Der Löschstatus ist nicht verfügbar. Ausstehende Löschungen ließen sich nicht überprüfen.",
			"lineage.status.active": "Nicht archiviert",
			"lineage.status.archived": "Archiviert",
			"lineage.status.missing": "Quelle nicht verfügbar",
			"lineage.untitled": "Chat ohne Titel",
			"lineage.sourceUnavailable": "Keine Angaben zur Quelle verfügbar",
			"lineage.sourceContext": "Quelle",
			"lineage.contextOnly": "Nur als Quellenverweis",
			"lineage.searchMatch": "Passender Chat",
			"lineage.independent": "Eigenständiger Chat",
			"lineage.sourceUnrecorded": "Quellchat nicht erfasst",
			"lineage.sourceUnrecordedHint": "Dieser Chat enthält einen übernommenen Verlauf. Da kein Quellchat erfasst wurde, lässt sich die Verbindung zur Quelle nicht anzeigen. Der Chatinhalt ist weiterhin verfügbar.",
			"lineage.view.open": "Chat-Stammbaum",
			"lineage.view.title": "Stammbaum der Chats",
			"lineage.view.close": "Chat-Stammbaum schließen",
			"lineage.view.pan": "Beziehungsdiagramm. Zum Erkunden den Hintergrund ziehen oder scrollen.",
			"lineage.view.enlarge": "Ansicht erweitern",
			"lineage.view.restore": "Zurück zur Seite",
			"lineage.view.zoomIn": "Vergrößern",
			"lineage.view.zoomOut": "Verkleinern",
			"lineage.view.zoom": "Zoomstufe",
			"lineage.view.fit": "An Fenster anpassen",
			"lineage.view.hint": "Ziehen zum Verschieben · Strg/⌘ + Mausrad zum Zoomen · Titel anklicken für eine Vorschau",
			"lineage.view.nodes": "Knoten",
			"lineage.view.connections": "Verbinder",
			"lineage.searchRelated": "Verwandter Zweig",
			"lineage.start": "Ausgangschat",
			"lineage.created": "Erstellt",
			"lineage.project": "Projekt",
			"lineage.delegation": "Delegationsebene",
			"lineage.noBranches": "Keine Zweige",
			"lineage.crossWorkspace": "Quellarbeitsbereich",
			"lineage.sourceId": "Quell-ID",
			"lineage.diagnostic.missing-parent": "Übergeordneter Chat fehlt",
			"lineage.diagnostic.missing-parent.detail": "Zur Herkunft des übergeordneten Chats liegen keine Informationen vor",
			"lineage.diagnostic.self-parent": "Chat verweist auf sich selbst als übergeordneten Chat",
			"lineage.diagnostic.cycle": "Zirkelbezug erkannt",
			"lineage.diagnostic.delegation-depth-mismatch": "Delegationstiefe stimmt nicht überein",
			"action.import": "Sicherung importieren",
			"action.export": "Alle exportieren",
			"import.title": "Archivsicherung importieren",
			"import.inspecting": "Sicherung wird geprüft …",
			"import.preview": "Prüfen Sie die Sitzungen vor der Wiederherstellung.",
			"import.package": "Details zur Sicherung",
			"import.confirm": "Auswahl wiederherstellen",
			"import.cancel": "Abbrechen",
			"import.close": "Schließen",
			"import.selectAll": "Alle wiederherstellbaren Chats auswählen",
			"import.clear": "Auswahl aufheben",
			"import.conflict": "ID-Konflikt: Chat wird übersprungen",
			"import.workspaceWarning": "Der Arbeitsbereich fehlt. Der Chat bleibt ohne Gruppe.",
			"import.cwdUnsupported": "Das Arbeitsverzeichnis ist auf diesem System nicht kompatibel oder nicht eindeutig. Behalten Sie die ursprüngliche ZIP-Datei und prüfen Sie das Quellverzeichnis. Eine Zuordnung zu anderen Verzeichnissen wird nicht unterstützt.",
			"import.cwdInvalid": "Das Arbeitsverzeichnis in der Sicherung ist ungültig und kann nicht wiederhergestellt werden. Behalten Sie die ursprüngliche ZIP-Datei und prüfen Sie deren Herkunft.",
			"import.attachmentWarning": "Verweise auf Anhänge gefunden. Die zugehörigen Dateien werden nicht wiederhergestellt.",
			"import.restored": "Wiederhergestellt",
			"import.skipped": "Übersprungen",
			"import.expired": "Die Vorschau ist abgelaufen. Wählen Sie die Sicherung erneut aus.",
			"import.done": "Wiederherstellung aus der Sicherung abgeschlossen",
			"import.unsupported": "Dieser Host kann die Sicherung nicht verlustfrei wiederherstellen. Behalten Sie die ZIP-Datei und prüfen Sie die Kompatibilität des Hosts.",
			"import.rollbackFailed": "Die Wiederherstellung blieb unvollständig. Einige Schreibvorgänge ließen sich nicht sicher rückgängig machen. Die betroffenen Dateien blieben erhalten. Bewahren Sie die ZIP-Datei auf und klären Sie die Ursache, bevor Sie es erneut versuchen. Löschen Sie keine Chats mit Konflikten.",
			"import.conflictChanged": "Die ausgewählten Chats sind bereits vorhanden oder noch zur Löschung vorgemerkt. Vorhandene Daten wurden nicht überschrieben. Wählen Sie die Sicherung zur Prüfung erneut aus.",
			"import.titlePublicationDegraded": "Der Chat wurde sicher wiederhergestellt. Sein Titel erscheint in der Hauptliste möglicherweise erst, nachdem Sie den Chat geöffnet haben.",
			"import.seededTitleLimitation": "Der Chat wurde sicher wiederhergestellt. Beim Kaltstart kann dieser Host den Titel eines Chat-Zweigs nicht in der Liste anzeigen. Sobald Sie den Chat öffnen, wird der Titel wie gewohnt angezeigt.",
			"export.all": "Alle exportieren",
			"menu.workspaceScope": "Dieser Arbeitsbereich",
			"menu.allWorkspaces": "Alle Arbeitsbereiche",
			"export.selected": "Auswahl exportieren",
			"menu.row": "Weitere Chataktionen",
			"export.started": "Download der Sicherung gestartet",
			"export.failed": "Die Sicherung konnte nicht exportiert werden. Die App bleibt geöffnet. Aktualisieren Sie die Liste und versuchen Sie es erneut.",
			"export.tooLarge": "Chat {id} überschreitet die zulässige Größe und kann nicht in eine importierbare Sicherung aufgenommen werden. Heben Sie die Auswahl dieses Chats auf und versuchen Sie es erneut.",
			"export.sourceInvalid": "Die Quelldaten für den Export sind ungültig und können nicht in eine Sicherung aufgenommen werden.",
			"export.timeout": "Zeitüberschreitung beim Export der Sicherung. Es wurde keine unvollständige Datei heruntergeladen. Versuchen Sie es später erneut.",
			"search.placeholder": "Titel, Tags, Notizen und Chatinhalte durchsuchen",
			"workspaceArchive.reason.session-ineligible": "Der Chat kann nicht mehr archiviert werden und wurde übersprungen.",
			"search.contentMatch": "Treffer im Chatverlauf",
			"preview.open": "Chatverlauf ansehen",
			"preview.close": "Vorschau schließen",
			"preview.loading": "Chatverlauf wird geladen …",
			"preview.error": "Die Chatvorschau konnte nicht geladen werden.",
			"preview.empty": "Dieser archivierte Chat enthält keine Nachrichten, für die eine Vorschau verfügbar ist.",
			"preview.more": "Mehr laden",
			"preview.timeline": "Zeitleiste des Chats",
			"preview.user": "Benutzer",
			"preview.assistant": "Assistent",
			"preview.tool": "Werkzeug",
			"preview.system": "Systemprompt",
			"preview.context": "Eingefügter Kontext",
			"preview.reasoning": "Gedankengang",
			"preview.toolCall": "Werkzeugaufruf",
			"preview.toolResult": "Werkzeugergebnis",
			"preview.toolArguments": "Argumente",
			"preview.json": "JSON",
			"preview.unknown": "Unbekannter Inhalt",
			"preview.copy": "Kopieren",
			"preview.copied": "Kopiert",
			"preview.copyError": "Kopieren fehlgeschlagen. Erlauben Sie den Zugriff auf die Zwischenablage und versuchen Sie es erneut.",
			"preview.imageUnavailable": "Bild nicht verfügbar",
			"preview.readOnly": "Schreibgeschützte Vorschau",
			"filter.allChats": "Alle Chats",
			"filter.type": "Typ",
			"filter.normal": "Reguläre Chats",
			"filter.subagent": "Subagenten-Chats",
			"filter.allProjects": "Alle Arbeitsbereiche",
			"filter.scheduled": "Automatisierte Aufgaben",
			"filter.scheduleUnsupported": "Auf diesem Host sind automatisierte Aufgaben nicht aktiviert.",
			"filter.scheduleUnavailable": "Automatisierte Aufgaben sind nicht verfügbar. Aktualisieren Sie die Ansicht, um es erneut zu versuchen.",
			"sort.label": "Sortierung",
			"sort.newest": "Letzte Aktualisierung (neueste zuerst)",
			"sort.oldest": "Letzte Aktualisierung (älteste zuerst)",
			"sort.title": "Titel",
			"group.noProject": "Ohne Gruppe",
			"group.defaultWorkspace": "Standardarbeitsbereich",
			"chat.untitled": "Chat ohne Titel",
			"chat.unarchive": "Archivierung aufheben",
			"unarchive.cwdMissing": "Dieser Chat hat kein Arbeitsverzeichnis. Der Host kann ihn daher nicht wieder in die Hauptliste aufnehmen. Die archivierte Kopie bleibt für Vorschau und Export erhalten.",
			"unarchive.authorityUnavailable": "Der Host kann derzeit nicht bestätigen, dass sich dieser Chat wieder in die Hauptliste aufnehmen lässt. Die archivierte Kopie bleibt unverändert. Versuchen Sie es später erneut.",
			"unarchive.deletionPending": "Die Löschung dieses Chats wird noch bearbeitet. Die Archivierung lässt sich deshalb noch nicht aufheben. Die archivierte Kopie bleibt erhalten.",
			"unarchive.pendingUnavailable": "Der Löschstatus lässt sich derzeit nicht prüfen. Die Archivierung wurde deshalb nicht aufgehoben. Die archivierte Kopie bleibt erhalten. Versuchen Sie es später erneut.",
			"chat.delete": "Löschen",
			"chat.deleteArchived": "Archivierten Chat löschen",
			"chat.deleteUnarchived": "Nicht archivierten Chat löschen",
			"chat.deleteRunning": "Beenden Sie den Chat, bevor Sie ihn löschen.",
			"menu.deleteAllPermanently": "Alle endgültig löschen",
			"menu.unarchiveAll": "Archivierung für alle aufheben",
			"action.deleteAll": "Alle löschen",
			"group.collapse": "Einklappen",
			"group.expand": "Ausklappen",
			"confirm.cancel": "Abbrechen",
			"chat.deleted": "Endgültig gelöscht",
			"deletion.incomplete": "Einige Löschvorgänge wurden nicht abgeschlossen. Versuchen Sie es erneut, um sie fortzusetzen.",
			"state.loading": "Wird geladen …",
			"state.empty": "Keine archivierten Chats",
			"state.emptyFiltered": "Keine passenden Chats gefunden",
			"state.error": "Laden fehlgeschlagen",
			"state.retry": "Erneut versuchen",
			"notice.dismiss": "Schließen",
			"tag.filter": "Alle Tags",
			"tag.edit": "Tags und Notiz bearbeiten",
			"tag.input": "Tags",
			"tag.placeholder": "Tag eingeben und Eingabetaste drücken",
			"note.label": "Notiz",
			"note.placeholder": "Notiz hinzufügen (bis zu 2.000 Zeichen)",
			"meta.save": "Speichern",
			"meta.saved": "Tags und Notiz gespeichert",
			"meta.unavailable": "Metadaten sind nicht verfügbar. Tags und Notizen lassen sich derzeit nicht bearbeiten.",
			"stats.loading": "Speicherbelegung wird ermittelt …",
			"stats.error": "Speicherstatistik nicht verfügbar",
			"workspaceArchive.action": "Chats archivieren",
			"workspaceArchive.chooseTitle": "Arbeitsbereich auswählen",
			"workspaceArchive.chooseBody": "Wählen Sie einen oder mehrere Arbeitsbereiche aus, deren Chats Sie archivieren möchten.",
			"workspaceArchive.selectAll": "Alle auswählen",
			"workspaceArchive.chooseConfirm": "Bestätigen",
			"workspaceArchive.eligibleCount": "Archivierbare Chats: {count}",
			"workspaceArchive.liveCount": "Laufende Chats: {count}",
			"workspaceArchive.noWorkspaces": "Es gibt keine Arbeitsbereiche mit archivierbaren Chats.",
			"workspaceArchive.loadError": "Die Arbeitsbereiche konnten nicht geladen werden. Versuchen Sie es erneut.",
			"workspaceArchive.close": "Archivierungsdialog für Arbeitsbereiche schließen",
			"workspaceArchive.loading": "Archivierung wird vorbereitet …",
			"workspaceArchive.skipped": "Übersprungene Chats",
			"workspaceArchive.confirmTitle": "Alle Chats in diesem Arbeitsbereich archivieren?",
			"workspaceArchive.confirmBody": "Die Chats im Arbeitsbereich „{workspace}“ werden archiviert. Sie finden sie später in der Archivverwaltung unter „Archiviert“.",
			"workspaceArchive.confirmBodyMany": "Die Chats in den ausgewählten Arbeitsbereichen werden archiviert. Sie finden sie später unter „Archiviert“.",
			"workspaceArchive.skippedLive": "Noch laufende Chats und Chats mit unbestätigtem Status werden übersprungen. Betroffen: {count}.",
			"workspaceArchive.apply": "Archivierung bestätigen",
			"workspaceArchive.applying": "Chats werden archiviert …",
			"workspaceArchive.success": "Archivierung abgeschlossen. Archivierte Chats: {count}",
			"workspaceArchive.result": "Ergebnis der Archivierung nach Arbeitsbereich",
			"workspaceArchive.archived": "Archiviert",
			"workspaceArchive.failed": "Fehlgeschlagen",
			"workspaceArchive.done": "Fertig",
			"workspaceArchive.unsupported": "Diese DSH-Version unterstützt das gemeinsame Archivieren der Chats eines Arbeitsbereichs nicht.",
			"workspaceArchive.error": "Die Chats der Arbeitsbereiche konnten nicht vollständig archiviert werden. Versuchen Sie es erneut.",
			"workspaceArchive.reason.session-live": "Chat läuft noch oder Status unbestätigt – übersprungen",
			"workspaceArchive.reason.session-archived": "Bereits archiviert – übersprungen",
			"workspaceArchive.reason.session-empty": "Neue Sitzung ohne Inhalt – übersprungen",
			"workspaceArchive.reason.session-unavailable": "Chatinhalt ließ sich nicht bestätigen – übersprungen",
			"workspaceArchive.reason.session-workspace-changed": "Zuordnung zum Arbeitsbereich hat sich geändert – übersprungen",
			"workspaceArchive.reason.archive-failed": "Archivierung fehlgeschlagen",
			"workspaceArchive.reason.archive-uncommitted": "Archivierung nicht abgeschlossen",
			"workspaceArchive.reason.lifecycle-failed": "Vorgang nicht abgeschlossen",
			"workspaceArchive.reason.stop-archive-unsupported": "Dieser Host kann eine Aufgabe nicht in einem Schritt stoppen und archivieren. Stoppen Sie die Aufgabe zuerst in der offiziellen Benutzeroberfläche.",
			"workspaceArchive.reason.unknown": "Nicht abgeschlossen",
			"workspaceArchive.retry": "Erneut vorbereiten",
			"tab.unarchived": "Nicht archiviert",
			"unarchived.search": "Titel, IDs und Chatinhalte durchsuchen",
			"unarchived.empty": "Keine nicht archivierten Chats",
			"unarchived.error": "Nicht archivierte Chats sind derzeit nicht verfügbar. Versuchen Sie es erneut.",
			"unarchived.loading": "Chats werden geladen …",
			"unarchived.archiveAll": "Alle archivieren",
			"unarchived.archive": "Archivieren",
			"unarchived.busy": "Läuft",
			"action.refresh": "Aktualisieren",
			"ui.chatCount.one": "{count} Chat",
			"ui.chatCount.few": "{count} Chats",
			"ui.chatCount.many": "{count} Chats",
			"ui.chatCount.other": "{count} Chats",
			"ui.selectChatLabel": "{title} auswählen",
			"ui.removeTagLabel": "Tag {tag} entfernen",
			"ui.previewJump": "Zu Nachricht {index} springen",
			"ui.lineageFrom": "Abgezweigt von „{title}“",
			"ui.branchCount.one": "{count} Zweig",
			"ui.branchCount.few": "{count} Zweige",
			"ui.branchCount.many": "{count} Zweige",
			"ui.branchCount.other": "{count} Zweige",
			"ui.tagsLimit": "Tags {count}/8, je bis zu 24 Zeichen",
			"ui.noteLimit": "Notiz {count}/2000",
			"scope.deletionDetails": "Der Umfang umfasst {selected} ausgewählte Chats und {subagents} zugehörige Subagenten-Chats, insgesamt {total}. Nicht ausgewählte unabhängige Abzweigungen bleiben erhalten.",
			"scope.workspaceArchivedTarget": "alle {count} archivierten Chats im Arbeitsbereich „{title}“",
			"scope.workspaceUnarchivedTarget": "alle {count} nicht archivierten Chats im Arbeitsbereich „{title}“",
			"scope.allTarget": "alle {count} archivierten Chats in {workspaces} Arbeitsbereichen",
			"scope.selectionTarget": "die {count} ausgewählten archivierten Chats",
			"scope.chatTarget": "den Chat „{title}“",
			"scope.deleteArchivedWorkspace": "Alle archivierten Chats in diesem Arbeitsbereich löschen?",
			"scope.deleteUnarchivedWorkspace": "Alle nicht archivierten Chats in diesem Arbeitsbereich löschen?",
			"scope.deleteAll": "Alle lokalen archivierten Chats löschen?",
			"scope.deleteSelection": "Ausgewählte archivierte Chats löschen?",
			"scope.deleteArchivedOne": "Archivierten Chat löschen?",
			"scope.deleteUnarchivedOne": "Nicht archivierten Chat löschen?",
			"scope.deleteBody": "Dadurch werden {target} endgültig gelöscht. Dies kann nicht rückgängig gemacht werden.",
			"scope.deleteLocalBody": "Dadurch werden {target} lokal endgültig gelöscht. Dies kann nicht rückgängig gemacht werden.",
			"scope.unarchiveWorkspaceTarget": "archivierte Chats im Arbeitsbereich „{title}“",
			"scope.unarchiveAllTarget": "archivierte Chats in allen Arbeitsbereichen",
			"scope.unarchiveSelectionTarget": "die ausgewählten archivierten Chats",
			"scope.unarchiveWorkspace": "Alle Chats in diesem Arbeitsbereich aus dem Archiv holen?",
			"scope.unarchiveSelection": "Ausgewählte Chats aus dem Archiv holen?",
			"scope.unarchiveAll": "Alle Chats aus dem Archiv holen?",
			"scope.unarchiveBody": "Dadurch kehren {target} in die Chatliste zurück.",
			"scope.exportWorkspace": "Alle archivierten Chats in diesem Arbeitsbereich exportieren?",
			"scope.exportSelection": "Ausgewählte Chats exportieren?",
			"scope.exportAll": "Alle archivierten Chats exportieren?",
			"scope.exportBody": "Dadurch werden {target} als ZIP-Sicherung exportiert. Ihr Archivstatus ändert sich nicht. Backups können sensible Inhalte enthalten. Bewahre sie sicher auf.",
			"scope.stopArchiveAll": "Alle Chats stoppen und archivieren?",
			"scope.stopArchiveOne": "Diesen Chat stoppen und archivieren?",
			"scope.stopArchiveMany": "Diese Chats stoppen und archivieren?",
			"scope.archiveAll": "Alle Chats archivieren?",
			"scope.archiveOne": "Diesen Chat archivieren?",
			"scope.archiveSelectedWorkspaces": "Chats in den ausgewählten Arbeitsbereichen archivieren?",
			"scope.archiveAllBody": "Dadurch werden Chats in allen Arbeitsbereichen archiviert. Sie sind anschließend unter „Archiviert“ zu finden.",
			"scope.archiveOneBody": "Dieser Chat wird archiviert. Du findest ihn anschließend unter „Archiviert“.",
			"scope.stopArchiveBody": "Das Archivieren stoppt die laufende Arbeit in den ausgewählten Chats. Du kannst sie später aus dem Archiv holen.",
			"scope.stopArchiveAction": "Stoppen und archivieren",
			"failure.purge-unsupported": "Dieses Speichersystem unterstützt keine endgültige Löschung.",
			"failure.restore-unsupported": "Dieses Speichersystem kann den Chat nicht wiederherstellen.",
			"failure.session-live-purge-pending": "Der Chat ist noch aktiv. Stoppe ihn und versuche es erneut.",
			"failure.unarchived-delete-running": "Stoppe den laufenden Chat vor dem Löschen.",
			"failure.session-delete-running": "Stoppe den Chat und seine Subagenten vor dem Löschen.",
			"failure.deletion-scope-changed": "Der Löschumfang hat sich geändert. Wähle erneut aus und bestätige.",
			"failure.unarchived-delete-changed": "Der Chat oder sein Arbeitsbereich wurde geändert. Aktualisiere und versuche es erneut.",
			"failure.refreshRetry": "Aktualisiere und versuche es erneut.",
			"failure.operationOne": "Vorgang für {count} Chat fehlgeschlagen: {reason}",
			"failure.operationMany": "Vorgang für {count} Chats fehlgeschlagen: {reason}",
			"import.packageFormat": "Format v{version}",
			"import.sessionCount.one": "{count} Sitzung",
			"import.sessionCount.other": "{count} Sitzungen",
			"preview.footnotes": "Fußnoten",
			"preview.process.toolCalls.one": "{count} Werkzeugaufruf",
			"preview.process.toolCalls.other": "{count} Werkzeugaufrufe",
			"preview.process.messages.one": "{count} Nachricht",
			"preview.process.messages.other": "{count} Nachrichten",
			"preview.process.subagents.one": "{count} Subagent",
			"preview.process.subagents.other": "{count} Subagenten",
			"preview.process.thought": "Nachgedacht",
			"preview.process.incomplete": "Nicht abgeschlossen",
			"preview.anchorMissing": "Die gefundene Nachricht wurde geändert oder liegt außerhalb der Vorschau. Die Vorschau beginnt am Anfang.",
			"preview.earlier": "Frühere Nachrichten laden",
			"menu.workspaceActions": "Weitere Aktionen für den Arbeitsbereich · {title}",
			"unarchived.archiveUnavailable": "Archivierung nicht verfügbar",
			"lineage.delegatedBy": "Delegiert von „{title}“",
			"import.sessionCount.few": "{count} Sitzungen",
			"import.sessionCount.many": "{count} Sitzungen",
			"preview.process.messages.few": "{count} Nachrichten",
			"preview.process.messages.many": "{count} Nachrichten",
			"preview.process.subagents.few": "{count} Subagenten",
			"preview.process.subagents.many": "{count} Subagenten",
			"preview.process.toolCalls.few": "{count} Werkzeugaufrufe",
			"preview.process.toolCalls.many": "{count} Werkzeugaufrufe",
			"chat.listChanged": "Die Chatliste hat sich geändert. Aktualisieren Sie die Liste und wählen Sie erneut aus.",
			"search.progress": "{status}: Geprüfte Chats {processed}/{total}, Treffer im Chatverlauf {hits}, angezeigte Chats {displayed}, nicht lesbare Chats {failed}",
			"search.status.loading": "Suche läuft",
			"search.status.ready": "Suche abgeschlossen",
			"search.status.partial": "Suche mit nicht lesbaren Chats beendet",
			"search.status.stopped": "Suche gestoppt",
			"search.status.error": "Suche fehlgeschlagen",
			"search.stop": "Suche stoppen",
			"search.retryUnfinished": "Ausstehende Chats erneut durchsuchen",
			"search.unreadable": "Nicht lesbare Chats",
			"update.restartNeeded": "Neustart erforderlich",
			"update.view": "Update anzeigen",
			"menu.moreArchiveActions": "Weitere Archivaktionen",
			"selection.enter": "Auswählen",
			"selection.selectResults": "Alle aktuellen Ergebnisse auswählen",
			"selection.count": "{count} ausgewählt",
			"selection.hiddenCount": "{count} außerhalb der aktuellen Ergebnisse",
			"selection.moreActions": "Weitere Aktionen für die Auswahl",
			"selection.deletePermanently": "Ausgewählte Chats endgültig löschen",
			"aboutInfo.author": "Autor",
			"aboutInfo.automaticChecks": "Beim Öffnen der Archivverwaltung wird automatisch nach Updates gesucht. Solange die Seite geöffnet ist, wird regelmäßig und bei erneuter Netzwerkverbindung geprüft. Erfolgreiche Ergebnisse werden 12 Stunden zwischengespeichert. Fehlgeschlagene Prüfungen werden nach 15 Minuten wiederholt. Updates werden nicht automatisch installiert und DSH wird nicht automatisch neu gestartet.",
			"aboutInfo.changelog": "Änderungsprotokoll",
			"aboutInfo.checkUpdates": "Nach Updates suchen",
			"aboutInfo.currentVersion": "Aktuelle Version",
			"aboutInfo.description": "DeepSeek-Harness-Chats suchen und organisieren, Archive, Tags und Notizen verwalten, die Chat-Abstammung ansehen und Chat-Sicherungen importieren oder exportieren.",
			"aboutInfo.feedback": "Problem melden",
			"aboutInfo.home": "Projektseite",
			"aboutInfo.license": "Lizenz",
			"aboutInfo.loadFailed": "Die Plugin-Informationen konnten nicht geladen werden. Versuchen Sie es erneut.",
			"aboutInfo.loading": "Plugin-Informationen werden geladen …",
			"aboutInfo.localCurrent": "Lokale Entwicklungsversion in Verwendung",
			"aboutInfo.marketplace": "Plugin-Marktplatz",
			"aboutInfo.reload": "Informationen neu laden",
			"aboutInfo.reloadInstructions": "Prüfen Sie die Verbindung zu DSH. Wenn Sie das Plugin gerade aktualisiert haben, laden Sie das DSH-Backend neu und versuchen Sie es erneut. Das Neuladen der Seite allein aktiviert die neuen Schnittstellen möglicherweise nicht.",
			"aboutInfo.starLink": "dem Projekt einen ⭐ Stern zu geben",
			"aboutInfo.starPrompt": "Wenn Ihnen das Plugin geholfen hat, frühere Arbeit wiederzufinden, können Sie {link}.",
			"aboutInfo.updateAvailable": "Version {version} ist verfügbar",
			"aboutInfo.updateDetails": "In den Update-Details sehen Sie den aktuellen Host, können Installationsinformationen kopieren und bei entsprechender Unterstützung das Update installieren. Lokale Entwicklungsversionen werden nicht durch Pakete aus der Registry ersetzt.",
			"aboutInfo.userGuide": "Benutzerhandbuch",
			"aboutInfo.versionHeading": "Version und Updates",
			"aboutInfo.versionLoading": "Wird geladen …",
			"aboutInfo.versionUnavailable": "Nicht verfügbar",
			"updateUi.applied": "Der Host hat v{version} angewendet. Öffnen Sie die Archivverwaltung erneut, um die laufende Version zu überprüfen.",
			"updateUi.available": "Version {version} ist verfügbar",
			"updateUi.bundledCommand": "Dieser Befehl verwendet das mit der aktuellen Desktop-App ausgelieferte dsh.",
			"updateUi.checkAgain": "Erneut prüfen",
			"updateUi.checking": "Suche nach Updates …",
			"updateUi.close": "Schließen",
			"updateUi.copied": "Kopiert",
			"updateUi.copyCommand": "Update-Befehl kopieren",
			"updateUi.copyFailed": "Kopieren fehlgeschlagen. Wählen Sie den Text aus und kopieren Sie ihn manuell.",
			"updateUi.copyLocalPath": "Lokalen Pfad kopieren",
			"updateUi.copyPackage": "Paketname und Version kopieren",
			"updateUi.current": "Sie verwenden die neueste Version",
			"updateUi.currentEnvironment": "Aktuelle Umgebung",
			"updateUi.environmentCli": "Aktueller DSH-Host",
			"updateUi.environmentDesktop": "Offizielle Desktop-App",
			"updateUi.environmentUnknown": "Unbekannter Host",
			"updateUi.errorAlreadyApplied": "Der Host hat das Update bereits angewendet. Öffnen Sie die Archivverwaltung erneut, um die laufende Version zu überprüfen.",
			"updateUi.errorHostManaged": "Aktualisieren Sie das Plugin über die Plugin-Verwaltung des Hosts. Folgen Sie der Anleitung unten.",
			"updateUi.errorLocalInstall": "Das Plugin verwendet jetzt eine lokale Entwicklungsversion. Das Ersetzen durch ein Paket aus der Registry wurde verhindert.",
			"updateUi.errorRestoreFailed": "Das Update ist fehlgeschlagen. Die Wiederherstellung der vorherigen Version konnte nicht bestätigt werden. Prüfen Sie die offizielle Plugin-Seite und installieren Sie das Plugin erneut.",
			"updateUi.errorRestored": "Das Update ist fehlgeschlagen. Die offizielle Plugin-Verwaltung hat die vorherige Version wiederhergestellt. Öffnen Sie die Archivverwaltung erneut, um die Version zu prüfen.",
			"updateUi.errorUnverified": "Der Abschluss des Updates konnte nicht bestätigt werden. Öffnen Sie diese Seite erneut, um den Status zu prüfen. Prüfen Sie bei Bedarf die Plugin-Seite des Hosts oder verwenden Sie den Befehl unten.",
			"updateUi.errorVersionChanged": "Die Versionsinformationen haben sich geändert. Prüfen Sie sie vor dem Update erneut.",
			"updateUi.externalInstructions": "Dieses Plugin stammt aus einer externen Quelle. Aktualisieren Sie es über diese Quelle. Mit den folgenden Angaben können Sie die öffentliche Version in einer anderen Umgebung installieren.",
			"updateUi.install": "Update installieren",
			"updateUi.installInstructions": "Mit „Update installieren“ prüft die offizielle Plugin-Verwaltung die Kompatibilität und ersetzt das Plugin. Diese Seite kann sich währenddessen schließen. Öffnen Sie die Archivverwaltung erneut, um die Version zu prüfen. Falls ein Neustart notwendig ist, wird dies angezeigt.",
			"updateUi.installing": "Wird installiert …",
			"updateUi.installingThroughHost": "Update wird über den Host installiert …",
			"updateUi.lastChecked": "Letzte Prüfung",
			"updateUi.localCheckout": "Lokale Entwicklungsversion",
			"updateUi.localCurrent": "Die lokale Entwicklungsversion ist eingebunden. Unten stehen die Informationen zur öffentlichen Version.",
			"updateUi.localInstructions": "Diese lokale Entwicklungsversion wird nicht durch Pakete aus der Registry ersetzt. Starten Sie DSH nach Änderungen neu. Um sie in einem anderen Host einzubinden, fügen Sie den Verzeichnispfad unten unter „Plugin hinzufügen“ ein.",
			"updateUi.manualInstructions": "Suchen Sie auf der offiziellen Plugin-Seite nach „Archivverwaltung“ und aktualisieren Sie das Plugin im Abschnitt „Versionen“. Folgen Sie bei älteren Hosts den Hinweisen zur Neuinstallation. Sie können das unten genannte Paket auch in einem anderen Host hinzufügen.",
			"updateUi.previousPublicRelease": "v{version} (letzte Prüfung)",
			"updateUi.privacy": "Automatische Prüfungen lesen nur öffentliche npm-Metadaten und übertragen keine Chats. Dabei werden keine Updates installiert und DSH wird nicht neu gestartet.",
			"updateUi.publicRelease": "Öffentliche Version",
			"updateUi.restartRequired": "v{version} wurde installiert. Starten Sie DSH neu und prüfen Sie die laufende Version.",
			"updateUi.runningVersion": "Laufende Version",
			"updateUi.terminalCommand": "Update-Befehl für das Terminal",
			"updateUi.terminalDesktopInstructions": "Sie können auch die Desktop-App vollständig beenden und diesen Befehl auf demselben Computer ausführen.",
			"updateUi.terminalHostInstructions": "Sie können auch den aktuellen DSH-Host beenden und diesen Befehl auf demselben Computer ausführen.",
			"updateUi.title": "Plugin-Update",
			"updateUi.unavailable": "Die Update-Prüfung ist fehlgeschlagen. Versuchen Sie es später erneut.",
			"updateUi.unchecked": "Es wurde noch nicht nach Updates gesucht",
		};

		const es = {
			"locale.intl": "es-ES",
			"nav": "Gestión de chats archivados",
			"page.title": "Gestión de chats archivados",
			"page.description": "Consulta, busca y gestiona tus chats archivados",
			"tab.archived": "Archivados",
			"archive.viewArchived": "Ver chats archivados",
			"chat.deletionUnverified": "No se puede comprobar el estado de la eliminación. Inténtalo de nuevo más tarde.",
			"tab.lineage": "Orígenes y ramas",
			"tab.about": "Acerca de",
			"about.updateAvailable": "Actualización disponible",
			"help.label": "Ayuda: {label}",
			"archive.view": "Ver",
			"lineage.origin.subagent": "Subagente",
			"lineage.origin.fork": "Bifurcación",
			"lineage.origin.root": "Chat original",
			"lineage.origin.unknown": "Origen desconocido",
			"lineage.copyId": "Copiar ID",
			"lineage.copiedId": "ID copiado",
			"lineage.loading": "Cargando orígenes y ramas…",
			"lineage.error": "No se pueden consultar los orígenes ni las ramas",
			"lineage.scopeNote": "Consulta los orígenes y las ramas de los chats archivados y sin archivar de todos los espacios de trabajo de este Host. Los filtros de estado solo afectan a la lista; los gráficos siguen mostrando cada árbol completo. Las referencias duplicadas al mismo origen no se cuentan dos veces.",
			"lineage.search": "Buscar por título, espacio de trabajo o ID del chat",
			"lineage.projectFilter": "Filtrar por proyecto",
			"lineage.statusFilter": "Filtrar por estado",
			"lineage.statusAll": "Todos los estados",
			"lineage.managedHeading": "Relaciones entre chats",
			"lineage.relatedWorkspaces": "Todos los espacios de trabajo",
			"lineage.noArchives": "No hay chats",
			"lineage.managedCount": "chats",
			"lineage.totalCount": "Total de chats: {count}",
			"lineage.resultCount": "Chats que coinciden: {count}",
			"lineage.expandAll": "Expandir todo",
			"lineage.collapseAll": "Contraer todo",
			"lineage.searchFoldHint": "Los espacios de trabajo con coincidencias permanecen expandidos mientras filtras",
			"lineage.empty": "No hay chats que coincidan",
			"lineage.workspaceEmpty": "No hay chats",
			"lineage.trackingUnavailable": "El seguimiento del origen no está disponible. Es posible que no se haya registrado de qué chats proceden algunas bifurcaciones nuevas.",
			"lineage.deletionUnavailable": "No se puede consultar el estado de la eliminación. No se han podido verificar las eliminaciones pendientes.",
			"lineage.status.active": "Sin archivar",
			"lineage.status.archived": "Archivado",
			"lineage.status.missing": "Origen no disponible",
			"lineage.untitled": "Chat sin título",
			"lineage.sourceUnavailable": "No hay información sobre el origen",
			"lineage.sourceContext": "Origen",
			"lineage.contextOnly": "Solo como referencia de origen",
			"lineage.searchMatch": "Chat que coincide con la búsqueda",
			"lineage.independent": "Chat independiente",
			"lineage.sourceUnrecorded": "Chat de origen sin registrar",
			"lineage.sourceUnrecordedHint": "Este chat contiene un historial heredado, pero no se registró el chat de origen. Por eso no se puede mostrar el vínculo entre ambos. El contenido sigue disponible.",
			"lineage.view.open": "Árbol de chats",
			"lineage.view.title": "Árbol de conversaciones",
			"lineage.view.close": "Cerrar el árbol de conversaciones",
			"lineage.view.pan": "Gráfico de relaciones. Arrastra el fondo o desplázate para explorarlo",
			"lineage.view.enlarge": "Ampliar vista",
			"lineage.view.restore": "Volver a la página",
			"lineage.view.zoomIn": "Acercar",
			"lineage.view.zoomOut": "Alejar",
			"lineage.view.zoom": "Nivel de zoom",
			"lineage.view.fit": "Ajustar a la ventana",
			"lineage.view.hint": "Arrastra para desplazarte · Ctrl/⌘ + rueda para cambiar el zoom · Haz clic en un título para ver la conversación",
			"lineage.view.nodes": "nodos",
			"lineage.view.connections": "conexiones",
			"lineage.searchRelated": "Rama relacionada",
			"lineage.start": "Chat inicial",
			"lineage.created": "Creado",
			"lineage.project": "Proyecto",
			"lineage.delegation": "Nivel de delegación",
			"lineage.noBranches": "Sin ramas",
			"lineage.crossWorkspace": "Espacio de trabajo de origen",
			"lineage.sourceId": "ID de origen",
			"lineage.diagnostic.missing-parent": "Falta el chat padre",
			"lineage.diagnostic.missing-parent.detail": "No hay información sobre el origen del chat padre",
			"lineage.diagnostic.self-parent": "El chat figura como su propio padre",
			"lineage.diagnostic.cycle": "Se ha detectado un ciclo",
			"lineage.diagnostic.delegation-depth-mismatch": "El nivel de delegación no coincide con el esperado",
			"action.import": "Importar copia de seguridad",
			"action.export": "Exportar todos",
			"import.title": "Importar una copia de seguridad de chats archivados",
			"import.inspecting": "Comprobando la copia de seguridad…",
			"import.preview": "Revisa las sesiones antes de restaurarlas",
			"import.package": "Detalles de la copia de seguridad",
			"import.confirm": "Restaurar selección",
			"import.cancel": "Cancelar",
			"import.close": "Cerrar",
			"import.selectAll": "Seleccionar todo lo que se pueda restaurar",
			"import.clear": "Borrar selección",
			"import.conflict": "Conflicto de ID: se omitirá este chat",
			"import.workspaceWarning": "No se encuentra el espacio de trabajo; el chat seguirá sin agrupar",
			"import.cwdUnsupported": "El directorio de trabajo es incompatible con este sistema o no se puede determinar de forma inequívoca. Conserva el ZIP original y comprueba el directorio de origen. No se admite la reasignación de directorios.",
			"import.cwdInvalid": "El directorio de trabajo de la copia de seguridad no es válido y no se puede restaurar. Conserva el ZIP original y comprueba su procedencia.",
			"import.attachmentWarning": "Se han encontrado referencias a archivos adjuntos, pero los archivos en sí no se restaurarán.",
			"import.restored": "Restaurados",
			"import.skipped": "Omitidos",
			"import.expired": "La vista previa ha caducado. Vuelve a seleccionar la copia de seguridad.",
			"import.done": "Se ha completado la restauración de la copia de seguridad",
			"import.unsupported": "Este Host no puede restaurar la copia de seguridad sin pérdida de datos. Conserva el ZIP y comprueba la compatibilidad del Host.",
			"import.rollbackFailed": "La restauración no se ha completado y no se han podido revertir algunos cambios de forma segura. Se han conservado los archivos afectados. Conserva el ZIP y revisa el problema antes de volver a intentarlo. No elimines los chats en conflicto.",
			"import.conflictChanged": "Los chats seleccionados ya existen o siguen pendientes de eliminación. No se han sobrescrito los datos existentes. Vuelve a seleccionar la copia de seguridad para revisarla.",
			"import.titlePublicationDegraded": "El chat se ha restaurado de forma segura, pero es posible que su título no aparezca en la lista principal hasta que lo abras.",
			"import.seededTitleLimitation": "El chat se ha restaurado de forma segura. Al arrancar desde cero, este Host no puede mostrar el título de una rama en la lista inicial. El título se mostrará con normalidad cuando abras el chat.",
			"export.all": "Exportar todos",
			"menu.workspaceScope": "Este espacio de trabajo",
			"menu.allWorkspaces": "Todos los espacios de trabajo",
			"export.selected": "Exportar selección",
			"menu.row": "Más acciones del chat",
			"export.started": "Se ha iniciado la descarga de la copia de seguridad",
			"export.failed": "No se ha podido exportar la copia de seguridad. La aplicación sigue abierta. Actualiza la lista y vuelve a intentarlo.",
			"export.tooLarge": "El chat {id} supera el límite de tamaño para incluirlo en una copia de seguridad que se pueda importar. Desmárcalo y vuelve a intentarlo.",
			"export.sourceInvalid": "Los datos de origen de la exportación no son válidos y no se pueden incluir en una copia de seguridad.",
			"export.timeout": "Se ha agotado el tiempo de espera para exportar la copia de seguridad. No se ha descargado ningún archivo incompleto. Inténtalo de nuevo más tarde.",
			"search.placeholder": "Buscar en títulos, etiquetas, notas y contenido de las conversaciones",
			"workspaceArchive.reason.session-ineligible": "El chat ya no cumple los requisitos para archivarlo; se ha omitido",
			"search.contentMatch": "Coincidencia en la conversación",
			"preview.open": "Ver conversación",
			"preview.close": "Cerrar vista previa",
			"preview.loading": "Cargando conversación…",
			"preview.error": "No se ha podido cargar la vista previa de la conversación",
			"preview.empty": "Este chat archivado no tiene mensajes que se puedan previsualizar",
			"preview.more": "Cargar más",
			"preview.timeline": "Cronología de la conversación",
			"preview.user": "Usuario",
			"preview.assistant": "Asistente",
			"preview.tool": "Herramienta",
			"preview.system": "Instrucciones del sistema",
			"preview.context": "Contexto inyectado",
			"preview.reasoning": "Razonamiento",
			"preview.toolCall": "Llamada a una herramienta",
			"preview.toolResult": "Resultado de la herramienta",
			"preview.toolArguments": "Argumentos",
			"preview.json": "JSON",
			"preview.unknown": "Contenido desconocido",
			"preview.copy": "Copiar",
			"preview.copied": "Copiado",
			"preview.copyError": "No se ha podido copiar. Permite el acceso al portapapeles y vuelve a intentarlo.",
			"preview.imageUnavailable": "Imagen no disponible",
			"preview.readOnly": "Vista previa de solo lectura",
			"filter.allChats": "Todos los chats",
			"filter.type": "Tipo",
			"filter.normal": "Chats normales",
			"filter.subagent": "Chats de subagentes",
			"filter.allProjects": "Todos los espacios de trabajo",
			"filter.scheduled": "Tareas de automatización",
			"filter.scheduleUnsupported": "Las tareas de automatización no están habilitadas en este Host",
			"filter.scheduleUnavailable": "Las tareas de automatización no están disponibles. Actualiza la página para volver a intentarlo.",
			"sort.label": "Ordenar por",
			"sort.newest": "Actualización más reciente",
			"sort.oldest": "Actualización más antigua",
			"sort.title": "Título",
			"group.noProject": "Sin agrupar",
			"group.defaultWorkspace": "Espacio de trabajo predeterminado",
			"chat.untitled": "Chat sin título",
			"chat.unarchive": "Desarchivar",
			"unarchive.cwdMissing": "Este chat no tiene un directorio de trabajo, así que este Host no puede devolverlo a la lista principal. Se conserva la copia archivada para que puedas consultarla y exportarla.",
			"unarchive.authorityUnavailable": "Por el momento, el Host no puede confirmar que este chat pueda volver a la lista principal. La copia archivada no ha cambiado. Inténtalo de nuevo más tarde.",
			"unarchive.deletionPending": "La eliminación de este chat sigue en curso y aún no se puede desarchivar. Se conserva la copia archivada.",
			"unarchive.pendingUnavailable": "Ahora mismo no se puede comprobar el estado de la eliminación, así que el chat no se ha desarchivado. Se conserva la copia archivada. Inténtalo de nuevo más tarde.",
			"chat.delete": "Eliminar",
			"chat.deleteArchived": "Eliminar chat archivado",
			"chat.deleteUnarchived": "Eliminar chat sin archivar",
			"chat.deleteRunning": "Detén este chat antes de eliminarlo",
			"menu.deleteAllPermanently": "Eliminar todos los chats definitivamente",
			"menu.unarchiveAll": "Desarchivar todos",
			"action.deleteAll": "Eliminar todos",
			"group.collapse": "Contraer",
			"group.expand": "Expandir",
			"confirm.cancel": "Cancelar",
			"chat.deleted": "Eliminación definitiva completada",
			"deletion.incomplete": "No se han completado todas las eliminaciones. Vuelve a intentarlo para continuar.",
			"state.loading": "Cargando…",
			"state.empty": "No hay chats archivados",
			"state.emptyFiltered": "No se han encontrado chats que coincidan",
			"state.error": "No se han podido cargar los datos",
			"state.retry": "Reintentar",
			"notice.dismiss": "Cerrar aviso",
			"tag.filter": "Todas las etiquetas",
			"tag.edit": "Editar etiquetas y nota",
			"tag.input": "Etiquetas",
			"tag.placeholder": "Escribe una etiqueta y pulsa Intro",
			"note.label": "Nota",
			"note.placeholder": "Añade una nota (hasta 2000 caracteres)",
			"meta.save": "Guardar",
			"meta.saved": "Se han guardado las etiquetas y la nota",
			"meta.unavailable": "Los metadatos no están disponibles. No se pueden editar las etiquetas ni las notas.",
			"stats.loading": "Calculando el espacio ocupado…",
			"stats.error": "Las estadísticas de almacenamiento no están disponibles",
			"workspaceArchive.action": "Archivar chats",
			"workspaceArchive.chooseTitle": "Elegir un espacio de trabajo",
			"workspaceArchive.chooseBody": "Elige uno o varios espacios de trabajo cuyos chats quieras archivar.",
			"workspaceArchive.selectAll": "Seleccionar todos",
			"workspaceArchive.chooseConfirm": "Confirmar",
			"workspaceArchive.eligibleCount": "Chats disponibles para archivar: {count}",
			"workspaceArchive.liveCount": "Chats en ejecución: {count}",
			"workspaceArchive.noWorkspaces": "No hay espacios de trabajo con chats disponibles para archivar.",
			"workspaceArchive.loadError": "No se han podido cargar los espacios de trabajo. Vuelve a intentarlo.",
			"workspaceArchive.close": "Cerrar el diálogo de archivado del espacio de trabajo",
			"workspaceArchive.loading": "Preparando el archivado…",
			"workspaceArchive.skipped": "Chats omitidos",
			"workspaceArchive.confirmTitle": "¿Archivar todos los chats de este espacio de trabajo?",
			"workspaceArchive.confirmBody": "Se archivarán los chats de «{workspace}». Después podrás encontrarlos en «Archivados», dentro de «Gestión de chats archivados».",
			"workspaceArchive.confirmBodyMany": "Se archivarán los chats de los espacios de trabajo seleccionados. Después podrás encontrarlos en «Archivados».",
			"workspaceArchive.skippedLive": "Chats que se omitirán por estar en ejecución o tener un estado sin confirmar: {count}.",
			"workspaceArchive.apply": "Confirmar archivado",
			"workspaceArchive.applying": "Archivando…",
			"workspaceArchive.success": "Archivado completado. Chats archivados: {count}",
			"workspaceArchive.result": "Resultado del archivado del espacio de trabajo",
			"workspaceArchive.archived": "Archivados",
			"workspaceArchive.failed": "Con errores",
			"workspaceArchive.done": "Listo",
			"workspaceArchive.unsupported": "Esta versión de DSH no permite archivar chats en bloque por espacio de trabajo.",
			"workspaceArchive.error": "No se ha podido completar el archivado en bloque por espacio de trabajo. Vuelve a intentarlo.",
			"workspaceArchive.reason.session-live": "El chat está en ejecución o no se ha confirmado su estado; se ha omitido",
			"workspaceArchive.reason.session-archived": "El chat ya estaba archivado; se ha omitido",
			"workspaceArchive.reason.session-empty": "La sesión es nueva y está vacía; se ha omitido",
			"workspaceArchive.reason.session-unavailable": "No se ha podido verificar el contenido de la conversación; se ha omitido",
			"workspaceArchive.reason.session-workspace-changed": "El chat ha cambiado de espacio de trabajo; se ha omitido",
			"workspaceArchive.reason.archive-failed": "No se ha podido archivar el chat",
			"workspaceArchive.reason.archive-uncommitted": "El archivado no se ha completado",
			"workspaceArchive.reason.lifecycle-failed": "La operación no se ha completado",
			"workspaceArchive.reason.stop-archive-unsupported": "Este Host no permite detener y archivar en una sola operación. Detén primero la tarea desde la interfaz oficial.",
			"workspaceArchive.reason.unknown": "Sin completar",
			"workspaceArchive.retry": "Volver a preparar",
			"tab.unarchived": "Sin archivar",
			"unarchived.search": "Buscar por título, ID o contenido de la conversación",
			"unarchived.empty": "No hay chats sin archivar",
			"unarchived.error": "No se pueden cargar los chats sin archivar. Vuelve a intentarlo.",
			"unarchived.loading": "Cargando chats…",
			"unarchived.archiveAll": "Archivar todos",
			"unarchived.archive": "Archivar",
			"unarchived.busy": "En ejecución",
			"action.refresh": "Actualizar",
			"ui.chatCount.one": "{count} chat",
			"ui.chatCount.few": "{count} chats",
			"ui.chatCount.many": "{count} chats",
			"ui.chatCount.other": "{count} chats",
			"ui.selectChatLabel": "Seleccionar {title}",
			"ui.removeTagLabel": "Quitar la etiqueta {tag}",
			"ui.previewJump": "Ir al mensaje {index}",
			"ui.lineageFrom": "Deriva de «{title}»",
			"ui.branchCount.one": "{count} rama",
			"ui.branchCount.few": "{count} ramas",
			"ui.branchCount.many": "{count} ramas",
			"ui.branchCount.other": "{count} ramas",
			"ui.tagsLimit": "Etiquetas {count}/8, hasta 24 caracteres cada una",
			"ui.noteLimit": "Nota {count}/2000",
			"scope.deletionDetails": "El alcance incluye {selected} chats seleccionados y {subagents} chats de subagentes asociados, {total} en total. Las ramas independientes no seleccionadas se conservan.",
			"scope.workspaceArchivedTarget": "los {count} chats archivados del espacio «{title}»",
			"scope.workspaceUnarchivedTarget": "los {count} chats no archivados del espacio «{title}»",
			"scope.allTarget": "los {count} chats archivados de {workspaces} espacios",
			"scope.selectionTarget": "los {count} chats archivados seleccionados",
			"scope.chatTarget": "el chat «{title}»",
			"scope.deleteArchivedWorkspace": "¿Eliminar todos los chats archivados de este espacio?",
			"scope.deleteUnarchivedWorkspace": "¿Eliminar todos los chats no archivados de este espacio?",
			"scope.deleteAll": "¿Eliminar todos los chats locales archivados?",
			"scope.deleteSelection": "¿Eliminar los chats archivados seleccionados?",
			"scope.deleteArchivedOne": "¿Eliminar el chat archivado?",
			"scope.deleteUnarchivedOne": "¿Eliminar el chat no archivado?",
			"scope.deleteBody": "Se eliminarán permanentemente {target}. Esta acción no se puede deshacer.",
			"scope.deleteLocalBody": "Se eliminarán permanentemente {target}. Esta acción no se puede deshacer.",
			"scope.unarchiveWorkspaceTarget": "los chats archivados del espacio «{title}»",
			"scope.unarchiveAllTarget": "los chats archivados de todos los espacios",
			"scope.unarchiveSelectionTarget": "los chats archivados seleccionados",
			"scope.unarchiveWorkspace": "¿Desarchivar todos los chats de este espacio?",
			"scope.unarchiveSelection": "¿Desarchivar los chats seleccionados?",
			"scope.unarchiveAll": "¿Desarchivar todos los chats?",
			"scope.unarchiveBody": "Esto devuelve {target} a la lista de chats.",
			"scope.exportWorkspace": "¿Exportar todos los chats archivados de este espacio?",
			"scope.exportSelection": "¿Exportar los chats seleccionados?",
			"scope.exportAll": "¿Exportar todos los chats archivados?",
			"scope.exportBody": "Se exportarán {target} como copia ZIP sin cambiar su estado de archivo. Las copias pueden contener datos sensibles. Guárdalas de forma segura.",
			"scope.stopArchiveAll": "¿Detener y archivar todos los chats?",
			"scope.stopArchiveOne": "¿Detener y archivar este chat?",
			"scope.stopArchiveMany": "¿Detener y archivar estos chats?",
			"scope.archiveAll": "¿Archivar todos los chats?",
			"scope.archiveOne": "¿Archivar este chat?",
			"scope.archiveSelectedWorkspaces": "¿Archivar los chats de los espacios seleccionados?",
			"scope.archiveAllBody": "Se archivarán los chats de todos los espacios. Podrás consultarlos en «Archivados».",
			"scope.archiveOneBody": "Se archivará este chat. Podrás consultarlo en «Archivados».",
			"scope.stopArchiveBody": "El archivo detendrá las tareas activas en los chats seleccionados. Podrás desarchivarlos más adelante.",
			"scope.stopArchiveAction": "Detener y archivar",
			"failure.purge-unsupported": "Este sistema de almacenamiento no permite la eliminación permanente.",
			"failure.restore-unsupported": "Este sistema de almacenamiento no puede restaurar este chat.",
			"failure.session-live-purge-pending": "El chat sigue activo. Detenlo y vuelve a intentarlo.",
			"failure.unarchived-delete-running": "Detén el chat activo antes de eliminarlo.",
			"failure.session-delete-running": "Detén el chat y sus subagentes antes de eliminarlo.",
			"failure.deletion-scope-changed": "El alcance de la eliminación cambió. Selecciona y confirma de nuevo.",
			"failure.unarchived-delete-changed": "El chat o su espacio de trabajo cambió. Actualiza y vuelve a intentarlo.",
			"failure.refreshRetry": "Actualiza y vuelve a intentarlo.",
			"failure.operationOne": "Error en {count} chat: {reason}",
			"failure.operationMany": "Error en {count} chats: {reason}",
			"import.packageFormat": "formato v{version}",
			"import.sessionCount.one": "{count} sesión",
			"import.sessionCount.other": "{count} sesiones",
			"preview.footnotes": "Notas al pie",
			"preview.process.toolCalls.one": "{count} llamada a herramienta",
			"preview.process.toolCalls.other": "{count} llamadas a herramientas",
			"preview.process.messages.one": "{count} mensaje",
			"preview.process.messages.other": "{count} mensajes",
			"preview.process.subagents.one": "{count} subagente",
			"preview.process.subagents.other": "{count} subagentes",
			"preview.process.thought": "Reflexionó un momento",
			"preview.process.incomplete": "Sin completar",
			"preview.anchorMissing": "El mensaje encontrado ha cambiado o queda fuera de la vista previa. Se muestra el principio de la conversación.",
			"preview.earlier": "Cargar mensajes anteriores",
			"menu.workspaceActions": "Más acciones del espacio de trabajo · {title}",
			"unarchived.archiveUnavailable": "No se puede archivar",
			"lineage.delegatedBy": "Delegado por «{title}»",
			"import.sessionCount.few": "{count} sesiones",
			"import.sessionCount.many": "{count} sesiones",
			"preview.process.messages.few": "{count} mensajes",
			"preview.process.messages.many": "{count} mensajes",
			"preview.process.subagents.few": "{count} subagentes",
			"preview.process.subagents.many": "{count} subagentes",
			"preview.process.toolCalls.few": "{count} llamadas a herramientas",
			"preview.process.toolCalls.many": "{count} llamadas a herramientas",
			"chat.listChanged": "La lista de chats ha cambiado. Actualízala y vuelve a seleccionar.",
			"search.progress": "{status}: chats revisados {processed}/{total}, coincidencias en el contenido {hits}, chats visibles {displayed}, chats que no se pudieron leer {failed}",
			"search.status.loading": "Buscando",
			"search.status.ready": "Búsqueda completada",
			"search.status.partial": "Búsqueda completada con chats sin leer",
			"search.status.stopped": "Búsqueda detenida",
			"search.status.error": "Error en la búsqueda",
			"search.stop": "Detener búsqueda",
			"search.retryUnfinished": "Reintentar chats pendientes",
			"search.unreadable": "Chats que no se pudieron leer",
			"update.restartNeeded": "Reinicio necesario",
			"update.view": "Ver actualización",
			"menu.moreArchiveActions": "Más acciones del archivo",
			"selection.enter": "Seleccionar",
			"selection.selectResults": "Seleccionar todos los resultados actuales",
			"selection.count": "Selección: {count}",
			"selection.hiddenCount": "{count} fuera de los resultados actuales",
			"selection.moreActions": "Más acciones para la selección",
			"selection.deletePermanently": "Eliminar definitivamente los chats seleccionados",
			"aboutInfo.author": "Autor",
			"aboutInfo.automaticChecks": "La búsqueda de actualizaciones se realiza al abrir Gestión de chats archivados y se repite periódicamente y al restablecer la conexión mientras la página siga abierta. Los resultados correctos se guardan durante 12 horas. Si la comprobación falla, se vuelve a intentar a los 15 minutos. Las actualizaciones y los reinicios no son automáticos.",
			"aboutInfo.changelog": "Registro de cambios",
			"aboutInfo.checkUpdates": "Buscar actualizaciones",
			"aboutInfo.currentVersion": "Versión actual",
			"aboutInfo.description": "Busca y organiza los chats de DeepSeek Harness, gestiona archivos, etiquetas y notas, consulta el historial de ramificaciones e importa o exporta copias de seguridad de los chats.",
			"aboutInfo.feedback": "Informar de un problema",
			"aboutInfo.home": "Página del proyecto",
			"aboutInfo.license": "Licencia",
			"aboutInfo.loadFailed": "No se ha podido cargar la información del complemento. Inténtalo de nuevo.",
			"aboutInfo.loading": "Cargando información del complemento…",
			"aboutInfo.localCurrent": "Se está usando una copia local",
			"aboutInfo.marketplace": "Catálogo de complementos",
			"aboutInfo.reload": "Volver a cargar la información",
			"aboutInfo.reloadInstructions": "Comprueba la conexión con DSH. Si acabas de actualizar el complemento, vuelve a cargar el backend de DSH e inténtalo de nuevo. Puede que recargar solo la página no active los nuevos puntos de acceso.",
			"aboutInfo.starLink": "darle una ⭐ estrella al proyecto",
			"aboutInfo.starPrompt": "Si te ha ayudado a recuperar trabajos anteriores, puedes {link}.",
			"aboutInfo.updateAvailable": "La versión {version} está disponible",
			"aboutInfo.updateDetails": "Abre los detalles de la actualización para ver el entorno actual, copiar los datos de instalación o instalar la actualización si el entorno lo permite. Los paquetes del registro no pueden sustituir las copias locales.",
			"aboutInfo.userGuide": "Guía de uso",
			"aboutInfo.versionHeading": "Versión y actualizaciones",
			"aboutInfo.versionLoading": "Cargando…",
			"aboutInfo.versionUnavailable": "No disponible",
			"updateUi.applied": "El entorno de DSH ha aplicado la v{version}. Vuelve a abrir Gestión de chats archivados para comprobar qué versión se está ejecutando.",
			"updateUi.available": "La versión {version} está disponible",
			"updateUi.bundledCommand": "Este comando usa el ejecutable dsh incluido en la aplicación de escritorio actual.",
			"updateUi.checkAgain": "Comprobar de nuevo",
			"updateUi.checking": "Buscando actualizaciones…",
			"updateUi.close": "Cerrar",
			"updateUi.copied": "Copiado",
			"updateUi.copyCommand": "Copiar comando de actualización",
			"updateUi.copyFailed": "No se ha podido copiar. Selecciona el texto y cópialo manualmente.",
			"updateUi.copyLocalPath": "Copiar ruta local",
			"updateUi.copyPackage": "Copiar nombre de paquete y versión",
			"updateUi.current": "Ya tienes la última versión",
			"updateUi.currentEnvironment": "Entorno actual",
			"updateUi.environmentCli": "Entorno de DSH actual",
			"updateUi.environmentDesktop": "Aplicación oficial de escritorio",
			"updateUi.environmentUnknown": "Entorno desconocido",
			"updateUi.errorAlreadyApplied": "El entorno ya ha aplicado la actualización. Vuelve a abrir Gestión de chats archivados para comprobar qué versión se está ejecutando.",
			"updateUi.errorHostManaged": "Usa el gestor de complementos del entorno para actualizar. Sigue las instrucciones de abajo.",
			"updateUi.errorLocalInstall": "Ahora se usa una copia local. Se ha impedido que el paquete del registro la sustituya.",
			"updateUi.errorRestoreFailed": "La actualización ha fallado y no se ha podido confirmar la restauración de la versión anterior. Ve a la página oficial de complementos y vuelve a instalarlo.",
			"updateUi.errorRestored": "La actualización ha fallado y el gestor oficial de complementos ha restaurado la versión anterior. Vuelve a abrir Gestión de chats archivados para comprobarlo.",
			"updateUi.errorUnverified": "No se ha podido confirmar que la actualización haya finalizado. Vuelve a abrir esta página para comprobar el estado. Si hace falta, revisa la página de complementos del entorno o usa el comando de abajo.",
			"updateUi.errorVersionChanged": "La información de la versión ha cambiado. Compruébala de nuevo antes de actualizar.",
			"updateUi.externalInstructions": "El complemento se instaló desde una fuente externa. Actualízalo desde esa misma fuente. Usa la información de abajo para instalar una versión pública en otro entorno.",
			"updateUi.install": "Instalar actualización",
			"updateUi.installInstructions": "«Instalar actualización» permite al gestor oficial comprobar la compatibilidad y sustituir el complemento. Es posible que esta página se cierre durante el proceso. Vuelve a abrir Gestión de chats archivados para comprobar la versión. Si se necesita reiniciar, aparecerá un aviso.",
			"updateUi.installing": "Instalando…",
			"updateUi.installingThroughHost": "Instalando la actualización a través del entorno…",
			"updateUi.lastChecked": "Última comprobación",
			"updateUi.localCheckout": "Copia local",
			"updateUi.localCurrent": "La copia local está conectada. Los datos de la versión pública se muestran abajo.",
			"updateUi.localInstructions": "Los paquetes del registro no pueden sustituir esta copia local. Reinicia DSH tras hacer cambios. Para usarla en otro entorno, pega la ruta de abajo en «Añadir complemento».",
			"updateUi.manualInstructions": "Busca Gestión de chats archivados en la página oficial de complementos y actualízalo desde «Versiones». En entornos antiguos, sigue las instrucciones de reinstalación. También puedes añadir el paquete de abajo en otro entorno.",
			"updateUi.previousPublicRelease": "v{version} (última comprobación)",
			"updateUi.privacy": "Las comprobaciones automáticas solo consultan metadatos públicos de npm y no envían chats. No instalan actualizaciones ni reinician DSH.",
			"updateUi.publicRelease": "Versión pública",
			"updateUi.restartRequired": "Se ha instalado la v{version}. Reinicia DSH y comprueba qué versión se está ejecutando.",
			"updateUi.runningVersion": "Versión en ejecución",
			"updateUi.terminalCommand": "Comando de actualización en la terminal",
			"updateUi.terminalDesktopInstructions": "También puedes cerrar por completo la aplicación de escritorio de DSH y ejecutar este comando en el mismo equipo.",
			"updateUi.terminalHostInstructions": "También puedes cerrar el entorno de DSH actual y ejecutar este comando en el mismo equipo.",
			"updateUi.title": "Actualización del complemento",
			"updateUi.unavailable": "No se han podido comprobar las actualizaciones. Inténtalo de nuevo más tarde.",
			"updateUi.unchecked": "Aún no se han comprobado las actualizaciones",
		};

		const fr = {
			"locale.intl": "fr-FR",
			"nav": "Gestion des archives",
			"page.title": "Gestion des archives",
			"page.description": "Consultez, recherchez et gérez vos conversations archivées.",
			"tab.archived": "Archivées",
			"archive.viewArchived": "Voir les conversations archivées",
			"chat.deletionUnverified": "Impossible de vérifier l’état de la suppression. Réessayez plus tard.",
			"tab.lineage": "Origines et branches",
			"tab.about": "À propos",
			"about.updateAvailable": "Mise à jour disponible",
			"help.label": "Aide : {label}",
			"archive.view": "Consulter",
			"lineage.origin.subagent": "Sous-agent",
			"lineage.origin.fork": "Branche",
			"lineage.origin.root": "Conversation d’origine",
			"lineage.origin.unknown": "Origine inconnue",
			"lineage.copyId": "Copier l’identifiant",
			"lineage.copiedId": "Identifiant copié",
			"lineage.loading": "Chargement des origines et des branches…",
			"lineage.error": "Les origines et les branches sont indisponibles.",
			"lineage.scopeNote": "Explorez les origines et les branches des conversations, archivées ou non, dans tous les espaces de travail de cette instance de DSH Host. Les filtres d’état s’appliquent à la liste, mais les graphes montrent toujours la filiation complète. Les références à une même source ne sont comptées qu’une fois.",
			"lineage.search": "Rechercher par titre de conversation, espace de travail ou identifiant",
			"lineage.projectFilter": "Filtrer par projet",
			"lineage.statusFilter": "Filtrer par état",
			"lineage.statusAll": "Tous les états",
			"lineage.managedHeading": "Liens entre les conversations",
			"lineage.relatedWorkspaces": "Tous les espaces de travail",
			"lineage.noArchives": "Aucune conversation",
			"lineage.managedCount": "conv.",
			"lineage.totalCount": "Total des conversations : {count}",
			"lineage.resultCount": "Conversations correspondant aux critères : {count}",
			"lineage.expandAll": "Tout déplier",
			"lineage.collapseAll": "Tout replier",
			"lineage.searchFoldHint": "Pendant le filtrage, les espaces de travail correspondants restent dépliés.",
			"lineage.empty": "Aucune conversation ne correspond aux critères.",
			"lineage.workspaceEmpty": "Aucune conversation",
			"lineage.trackingUnavailable": "Le suivi des origines est indisponible. Il se peut que la source de certaines nouvelles branches n’ait pas été enregistrée.",
			"lineage.deletionUnavailable": "L’état des suppressions est indisponible. Les suppressions en attente n’ont pas pu être vérifiées.",
			"lineage.status.active": "Non archivée",
			"lineage.status.archived": "Archivée",
			"lineage.status.missing": "Source indisponible",
			"lineage.untitled": "Conversation sans titre",
			"lineage.sourceUnavailable": "Informations sur la source indisponibles",
			"lineage.sourceContext": "Source",
			"lineage.contextOnly": "Source affichée à titre indicatif",
			"lineage.searchMatch": "Conversation correspondant aux critères",
			"lineage.independent": "Conversation indépendante",
			"lineage.sourceUnrecorded": "Conversation source non enregistrée",
			"lineage.sourceUnrecordedHint": "Cette conversation a hérité d’un historique, mais aucune conversation source n’a été enregistrée. Le lien avec la source ne peut donc pas être affiché. Le contenu de la conversation reste accessible.",
			"lineage.view.open": "Filiation de la conversation",
			"lineage.view.title": "Graphe de filiation des conversations",
			"lineage.view.close": "Fermer le graphe de filiation des conversations",
			"lineage.view.pan": "Graphe des relations. Faites glisser l’arrière-plan ou faites défiler le graphe pour l’explorer.",
			"lineage.view.enlarge": "Agrandir la vue",
			"lineage.view.restore": "Revenir à la page",
			"lineage.view.zoomIn": "Zoom avant",
			"lineage.view.zoomOut": "Zoom arrière",
			"lineage.view.zoom": "Niveau de zoom",
			"lineage.view.fit": "Ajuster à la fenêtre",
			"lineage.view.hint": "Faites glisser pour vous déplacer · Ctrl/⌘ + molette pour zoomer · Cliquez sur un titre pour afficher un aperçu",
			"lineage.view.nodes": "nœud(s)",
			"lineage.view.connections": "lien(s)",
			"lineage.searchRelated": "Branche associée",
			"lineage.start": "Conversation de départ",
			"lineage.created": "Création",
			"lineage.project": "Projet",
			"lineage.delegation": "Niveau de délégation",
			"lineage.noBranches": "Aucune branche",
			"lineage.crossWorkspace": "Espace de travail source",
			"lineage.sourceId": "Identifiant de la source",
			"lineage.diagnostic.missing-parent": "Conversation parente introuvable",
			"lineage.diagnostic.missing-parent.detail": "Les informations sur la source de la conversation parente sont indisponibles.",
			"lineage.diagnostic.self-parent": "La conversation est son propre parent",
			"lineage.diagnostic.cycle": "Cycle détecté",
			"lineage.diagnostic.delegation-depth-mismatch": "Profondeur de délégation incohérente",
			"action.import": "Importer une sauvegarde",
			"action.export": "Tout exporter",
			"import.title": "Importer une sauvegarde de conversations archivées",
			"import.inspecting": "Vérification de la sauvegarde…",
			"import.preview": "Vérifiez les sessions avant de les restaurer.",
			"import.package": "Détails de la sauvegarde",
			"import.confirm": "Restaurer la sélection",
			"import.cancel": "Annuler",
			"import.close": "Fermer",
			"import.selectAll": "Sélectionner toutes les sessions pouvant être restaurées",
			"import.clear": "Tout désélectionner",
			"import.conflict": "Conflit d’identifiants : cette session sera ignorée.",
			"import.workspaceWarning": "L’espace de travail est introuvable : la session restera sans groupe.",
			"import.cwdUnsupported": "Le répertoire de travail est incompatible avec ce système ou son chemin est ambigu. Conservez le fichier ZIP d’origine et vérifiez son répertoire source. La mise en correspondance des répertoires n’est pas prise en charge.",
			"import.cwdInvalid": "Le répertoire de travail indiqué dans la sauvegarde n’est pas valide et ne peut pas être restauré. Conservez le fichier ZIP d’origine et vérifiez sa provenance.",
			"import.attachmentWarning": "La sauvegarde contient des références à des pièces jointes, mais les fichiers correspondants ne seront pas restaurés.",
			"import.restored": "Sessions restaurées",
			"import.skipped": "Sessions ignorées",
			"import.expired": "L’aperçu a expiré. Sélectionnez à nouveau la sauvegarde.",
			"import.done": "Restauration de la sauvegarde terminée",
			"import.unsupported": "DSH Host ne peut pas restaurer cette sauvegarde sans perte de données. Conservez le fichier ZIP et vérifiez la compatibilité de votre version de DSH Host.",
			"import.rollbackFailed": "La restauration est incomplète et certaines écritures n’ont pas pu être annulées en toute sécurité. Les fichiers concernés ont été conservés. Gardez le fichier ZIP et recherchez la cause du problème avant de réessayer. Ne supprimez pas les conversations en conflit.",
			"import.conflictChanged": "Les conversations sélectionnées existent déjà ou sont toujours en attente de suppression. Aucune donnée existante n’a été écrasée. Sélectionnez à nouveau la sauvegarde pour vérifier son contenu.",
			"import.titlePublicationDegraded": "La conversation a bien été restaurée, mais il faudra peut-être l’ouvrir pour que son titre apparaisse dans la liste principale.",
			"import.seededTitleLimitation": "La conversation a bien été restaurée. Lors d’un démarrage à froid, DSH Host ne peut pas afficher le titre d’une branche dans la liste initiale. Ouvrez la conversation pour que son titre s’affiche normalement.",
			"export.all": "Tout exporter",
			"menu.workspaceScope": "Cet espace de travail",
			"menu.allWorkspaces": "Tous les espaces de travail",
			"export.selected": "Exporter la sélection",
			"menu.row": "Autres actions sur la conversation",
			"export.started": "Téléchargement de la sauvegarde lancé",
			"export.failed": "L’exportation de la sauvegarde a échoué. L’application reste ouverte. Actualisez la liste, puis réessayez.",
			"export.tooLarge": "La conversation {id} dépasse la taille maximale autorisée et ne peut pas être incluse dans une sauvegarde importable. Désélectionnez-la, puis réessayez.",
			"export.sourceInvalid": "La source de l’exportation n’est pas valide et ne peut pas être incluse dans une sauvegarde.",
			"export.timeout": "Le délai d’exportation de la sauvegarde a expiré. Aucun fichier incomplet n’a été téléchargé. Réessayez plus tard.",
			"search.placeholder": "Rechercher dans les titres, les étiquettes, les notes et le contenu des conversations",
			"workspaceArchive.reason.session-ineligible": "Conversation ignorée : elle ne remplit plus les conditions d’archivage.",
			"search.contentMatch": "Résultat dans le contenu de la conversation",
			"preview.open": "Voir la conversation",
			"preview.close": "Fermer l’aperçu",
			"preview.loading": "Chargement de la conversation…",
			"preview.error": "Impossible de charger l’aperçu de la conversation.",
			"preview.empty": "Cette archive ne contient aucun message pouvant être affiché en aperçu.",
			"preview.more": "Charger la suite",
			"preview.timeline": "Chronologie de la conversation",
			"preview.user": "Utilisateur",
			"preview.assistant": "Assistant",
			"preview.tool": "Outil",
			"preview.system": "Instructions système",
			"preview.context": "Contexte injecté",
			"preview.reasoning": "Raisonnement",
			"preview.toolCall": "Appel d’outil",
			"preview.toolResult": "Résultat de l’outil",
			"preview.toolArguments": "Arguments",
			"preview.json": "JSON",
			"preview.unknown": "Contenu inconnu",
			"preview.copy": "Copier",
			"preview.copied": "Copié",
			"preview.copyError": "La copie a échoué. Autorisez l’accès au presse-papiers, puis réessayez.",
			"preview.imageUnavailable": "Image indisponible",
			"preview.readOnly": "Aperçu en lecture seule",
			"filter.allChats": "Toutes les conversations",
			"filter.type": "Type",
			"filter.normal": "Conversations ordinaires",
			"filter.subagent": "Conversations de sous-agents",
			"filter.allProjects": "Tous les espaces de travail",
			"filter.scheduled": "Tâches automatisées",
			"filter.scheduleUnsupported": "Les tâches automatisées ne sont pas activées sur cette instance de DSH Host.",
			"filter.scheduleUnavailable": "Les tâches automatisées sont indisponibles. Actualisez la liste pour réessayer.",
			"sort.label": "Ordre de tri",
			"sort.newest": "Mises à jour les plus récentes",
			"sort.oldest": "Mises à jour les plus anciennes",
			"sort.title": "Titre",
			"group.noProject": "Sans groupe",
			"group.defaultWorkspace": "Espace de travail par défaut",
			"chat.untitled": "Conversation sans titre",
			"chat.unarchive": "Désarchiver",
			"unarchive.cwdMissing": "Cette conversation n’a pas de répertoire de travail. DSH Host ne peut donc pas la remettre dans la liste principale. Sa copie archivée est conservée : vous pouvez toujours la consulter ou l’exporter.",
			"unarchive.authorityUnavailable": "DSH Host ne peut pas vérifier pour le moment si cette conversation peut réintégrer la liste principale. Sa copie archivée reste intacte. Réessayez plus tard.",
			"unarchive.deletionPending": "La suppression de cette conversation est toujours en cours. Elle ne peut pas encore être désarchivée. Sa copie archivée est conservée.",
			"unarchive.pendingUnavailable": "Impossible de vérifier l’état de la suppression pour le moment. La conversation n’a pas été désarchivée et sa copie archivée est conservée. Réessayez plus tard.",
			"chat.delete": "Supprimer",
			"chat.deleteArchived": "Supprimer la conversation archivée",
			"chat.deleteUnarchived": "Supprimer la conversation non archivée",
			"chat.deleteRunning": "Arrêtez cette conversation avant de la supprimer.",
			"menu.deleteAllPermanently": "Tout supprimer définitivement",
			"menu.unarchiveAll": "Tout désarchiver",
			"action.deleteAll": "Tout supprimer définitivement",
			"group.collapse": "Replier",
			"group.expand": "Déplier",
			"confirm.cancel": "Annuler",
			"chat.deleted": "Suppression définitive effectuée",
			"deletion.incomplete": "Certaines suppressions n’ont pas abouti. Réessayez pour les poursuivre.",
			"state.loading": "Chargement…",
			"state.empty": "Aucune conversation archivée",
			"state.emptyFiltered": "Aucune conversation ne correspond aux critères.",
			"state.error": "Échec du chargement",
			"state.retry": "Réessayer",
			"notice.dismiss": "Fermer",
			"tag.filter": "Toutes les étiquettes",
			"tag.edit": "Modifier les étiquettes et la note",
			"tag.input": "Étiquettes",
			"tag.placeholder": "Saisissez une étiquette, puis appuyez sur Entrée.",
			"note.label": "Note",
			"note.placeholder": "Ajouter une note (2 000 caractères maximum)",
			"meta.save": "Enregistrer",
			"meta.saved": "Les étiquettes et la note ont été enregistrées.",
			"meta.unavailable": "Les métadonnées sont indisponibles. La modification des étiquettes et des notes est désactivée.",
			"stats.loading": "Calcul de l’espace de stockage utilisé…",
			"stats.error": "Statistiques de stockage indisponibles",
			"workspaceArchive.action": "Archiver des conversations",
			"workspaceArchive.chooseTitle": "Choisir un espace de travail",
			"workspaceArchive.chooseBody": "Sélectionnez un ou plusieurs espaces de travail dont vous souhaitez archiver les conversations.",
			"workspaceArchive.selectAll": "Tout sélectionner",
			"workspaceArchive.chooseConfirm": "Confirmer",
			"workspaceArchive.eligibleCount": "Conversations pouvant être archivées : {count}",
			"workspaceArchive.liveCount": "Conversations en cours : {count}",
			"workspaceArchive.noWorkspaces": "Aucun espace de travail ne contient de conversation pouvant être archivée.",
			"workspaceArchive.loadError": "Impossible de charger les espaces de travail. Réessayez.",
			"workspaceArchive.close": "Fermer la fenêtre d’archivage des espaces de travail",
			"workspaceArchive.loading": "Préparation de l’archivage…",
			"workspaceArchive.skipped": "Conversations ignorées",
			"workspaceArchive.confirmTitle": "Archiver toutes les conversations de cet espace de travail ?",
			"workspaceArchive.confirmBody": "Les conversations de l’espace de travail « {workspace} » seront archivées. Vous les retrouverez dans l’onglet « Archivées » de la page « Gestion des archives ».",
			"workspaceArchive.confirmBodyMany": "Les conversations des espaces de travail sélectionnés seront archivées. Vous les retrouverez dans l’onglet « Archivées ».",
			"workspaceArchive.skippedLive": "Conversations qui seront ignorées (en cours ou d’état non confirmé) : {count}",
			"workspaceArchive.apply": "Confirmer l’archivage",
			"workspaceArchive.applying": "Archivage en cours…",
			"workspaceArchive.success": "Archivage terminé. Conversations archivées : {count}",
			"workspaceArchive.result": "Résultat de l’archivage par espace de travail",
			"workspaceArchive.archived": "Conversations archivées",
			"workspaceArchive.failed": "Échecs",
			"workspaceArchive.done": "Terminé",
			"workspaceArchive.unsupported": "Cette version de DSH ne permet pas d’archiver en bloc les conversations d’un espace de travail.",
			"workspaceArchive.error": "Impossible de terminer l’archivage groupé des conversations par espace de travail. Réessayez.",
			"workspaceArchive.reason.session-live": "Conversation ignorée : elle est en cours ou son état n’a pas pu être confirmé.",
			"workspaceArchive.reason.session-archived": "Conversation ignorée : elle est déjà archivée.",
			"workspaceArchive.reason.session-empty": "Session ignorée : elle vient d’être créée et ne contient aucun message.",
			"workspaceArchive.reason.session-unavailable": "Conversation ignorée : son contenu n’a pas pu être vérifié.",
			"workspaceArchive.reason.session-workspace-changed": "Conversation ignorée : elle a changé d’espace de travail.",
			"workspaceArchive.reason.archive-failed": "Échec de l’archivage",
			"workspaceArchive.reason.archive-uncommitted": "Archivage inachevé",
			"workspaceArchive.reason.lifecycle-failed": "Opération inachevée",
			"workspaceArchive.reason.stop-archive-unsupported": "DSH Host ne peut pas arrêter une tâche et l’archiver en une seule opération. Arrêtez d’abord la tâche dans l’interface officielle.",
			"workspaceArchive.reason.unknown": "Opération non terminée",
			"workspaceArchive.retry": "Relancer la préparation",
			"tab.unarchived": "Non archivées",
			"unarchived.search": "Rechercher par titre, identifiant ou contenu de conversation",
			"unarchived.empty": "Aucune conversation non archivée",
			"unarchived.error": "Les conversations non archivées sont indisponibles. Réessayez.",
			"unarchived.loading": "Chargement des conversations…",
			"unarchived.archiveAll": "Tout archiver",
			"unarchived.archive": "Archiver",
			"unarchived.busy": "En cours",
			"action.refresh": "Actualiser",
			"ui.chatCount.one": "{count} conversation",
			"ui.chatCount.few": "{count} conversations",
			"ui.chatCount.many": "{count} conversations",
			"ui.chatCount.other": "{count} conversations",
			"ui.selectChatLabel": "Sélectionner {title}",
			"ui.removeTagLabel": "Retirer l’étiquette {tag}",
			"ui.previewJump": "Aller au message {index}",
			"ui.lineageFrom": "Issu de « {title} »",
			"ui.branchCount.one": "{count} branche",
			"ui.branchCount.few": "{count} branches",
			"ui.branchCount.many": "{count} branches",
			"ui.branchCount.other": "{count} branches",
			"ui.tagsLimit": "Étiquettes {count}/8, 24 caractères maximum par étiquette",
			"ui.noteLimit": "Note {count}/2000",
			"scope.deletionDetails": "La suppression comprend {selected} conversations sélectionnées et {subagents} conversations de sous-agents associées, soit {total} au total. Les branches indépendantes non sélectionnées sont conservées.",
			"scope.workspaceArchivedTarget": "les {count} conversations archivées de l’espace « {title} »",
			"scope.workspaceUnarchivedTarget": "les {count} conversations non archivées de l’espace « {title} »",
			"scope.allTarget": "les {count} conversations archivées de {workspaces} espaces",
			"scope.selectionTarget": "les {count} conversations archivées sélectionnées",
			"scope.chatTarget": "la conversation « {title} »",
			"scope.deleteArchivedWorkspace": "Supprimer toutes les conversations archivées de cet espace ?",
			"scope.deleteUnarchivedWorkspace": "Supprimer toutes les conversations non archivées de cet espace ?",
			"scope.deleteAll": "Supprimer toutes les conversations locales archivées ?",
			"scope.deleteSelection": "Supprimer les conversations archivées sélectionnées ?",
			"scope.deleteArchivedOne": "Supprimer la conversation archivée ?",
			"scope.deleteUnarchivedOne": "Supprimer la conversation non archivée ?",
			"scope.deleteBody": "Cette action supprime définitivement {target}. Elle est irréversible.",
			"scope.deleteLocalBody": "Cette action supprime définitivement {target} du stockage local. Elle est irréversible.",
			"scope.unarchiveWorkspaceTarget": "les conversations archivées de l’espace « {title} »",
			"scope.unarchiveAllTarget": "les conversations archivées de tous les espaces",
			"scope.unarchiveSelectionTarget": "les conversations archivées sélectionnées",
			"scope.unarchiveWorkspace": "Désarchiver toutes les conversations de cet espace ?",
			"scope.unarchiveSelection": "Désarchiver les conversations sélectionnées ?",
			"scope.unarchiveAll": "Désarchiver toutes les conversations ?",
			"scope.unarchiveBody": "Cette action replace {target} dans la liste des conversations.",
			"scope.exportWorkspace": "Exporter toutes les conversations archivées de cet espace ?",
			"scope.exportSelection": "Exporter les conversations sélectionnées ?",
			"scope.exportAll": "Exporter toutes les conversations archivées ?",
			"scope.exportBody": "Cette action exporte {target} en sauvegarde ZIP sans modifier leur état d’archivage. Les sauvegardes peuvent contenir des données sensibles. Conservez-les en lieu sûr.",
			"scope.stopArchiveAll": "Arrêter et archiver toutes les conversations ?",
			"scope.stopArchiveOne": "Arrêter et archiver cette conversation ?",
			"scope.stopArchiveMany": "Arrêter et archiver ces conversations ?",
			"scope.archiveAll": "Archiver toutes les conversations ?",
			"scope.archiveOne": "Archiver cette conversation ?",
			"scope.archiveSelectedWorkspaces": "Archiver les conversations des espaces sélectionnés ?",
			"scope.archiveAllBody": "Les conversations de tous les espaces seront archivées. Vous les retrouverez dans « Archivées ».",
			"scope.archiveOneBody": "Cette conversation sera archivée. Vous la retrouverez dans « Archivées ».",
			"scope.stopArchiveBody": "L’archivage arrête les tâches en cours dans les conversations sélectionnées. Vous pourrez les désarchiver plus tard.",
			"scope.stopArchiveAction": "Arrêter et archiver",
			"failure.purge-unsupported": "Ce système de stockage ne prend pas en charge la suppression définitive.",
			"failure.restore-unsupported": "Ce système de stockage ne peut pas restaurer cette conversation.",
			"failure.session-live-purge-pending": "La conversation est encore active. Arrêtez-la et réessayez.",
			"failure.unarchived-delete-running": "Arrêtez la conversation en cours avant de la supprimer.",
			"failure.session-delete-running": "Arrêtez la conversation et ses sous-agents avant de la supprimer.",
			"failure.deletion-scope-changed": "Le périmètre de suppression a changé. Sélectionnez-le et confirmez de nouveau.",
			"failure.unarchived-delete-changed": "La conversation ou son espace a changé. Actualisez et réessayez.",
			"failure.refreshRetry": "Actualisez et réessayez.",
			"failure.operationOne": "Échec pour {count} conversation : {reason}",
			"failure.operationMany": "Échec pour {count} conversations : {reason}",
			"import.packageFormat": "format v{version}",
			"import.sessionCount.one": "{count} session",
			"import.sessionCount.other": "{count} sessions",
			"preview.footnotes": "Notes de bas de page",
			"preview.process.toolCalls.one": "{count} appel d’outil",
			"preview.process.toolCalls.other": "{count} appels d’outils",
			"preview.process.messages.one": "{count} message",
			"preview.process.messages.other": "{count} messages",
			"preview.process.subagents.one": "{count} sous-agent",
			"preview.process.subagents.other": "{count} sous-agents",
			"preview.process.thought": "A réfléchi un instant",
			"preview.process.incomplete": "Non terminé",
			"preview.anchorMissing": "Le message trouvé a changé ou se trouve hors de l’aperçu. Le début de la conversation est affiché.",
			"preview.earlier": "Charger les messages précédents",
			"menu.workspaceActions": "Autres actions sur l’espace de travail · {title}",
			"unarchived.archiveUnavailable": "Archivage indisponible",
			"lineage.delegatedBy": "Délégué par « {title} »",
			"import.sessionCount.few": "{count} sessions",
			"import.sessionCount.many": "{count} sessions",
			"preview.process.messages.few": "{count} messages",
			"preview.process.messages.many": "{count} messages",
			"preview.process.subagents.few": "{count} sous-agents",
			"preview.process.subagents.many": "{count} sous-agents",
			"preview.process.toolCalls.few": "{count} appels d’outils",
			"preview.process.toolCalls.many": "{count} appels d’outils",
			"chat.listChanged": "La liste des conversations a changé. Actualisez-la, puis refaites votre sélection.",
			"search.progress": "{status} : conversations examinées {processed}/{total}, correspondances dans le contenu {hits}, conversations affichées {displayed}, conversations illisibles {failed}",
			"search.status.loading": "Recherche en cours",
			"search.status.ready": "Recherche terminée",
			"search.status.partial": "Recherche terminée avec des conversations illisibles",
			"search.status.stopped": "Recherche arrêtée",
			"search.status.error": "Échec de la recherche",
			"search.stop": "Arrêter la recherche",
			"search.retryUnfinished": "Relancer la recherche dans les conversations restantes",
			"search.unreadable": "Conversations illisibles",
			"update.restartNeeded": "Redémarrage requis",
			"update.view": "Voir la mise à jour",
			"menu.moreArchiveActions": "Autres actions d’archivage",
			"selection.enter": "Sélectionner",
			"selection.selectResults": "Sélectionner tous les résultats actuels",
			"selection.count": "Sélection : {count}",
			"selection.hiddenCount": "{count} hors des résultats actuels",
			"selection.moreActions": "Autres actions pour la sélection",
			"selection.deletePermanently": "Supprimer définitivement les conversations sélectionnées",
			"aboutInfo.author": "Auteur",
			"aboutInfo.automaticChecks": "La recherche de mises à jour se lance à l’ouverture de la page Gestion des archives. Tant qu’elle reste ouverte, la recherche se répète périodiquement et après une reconnexion. Les résultats sont mis en cache pendant 12 heures en cas de succès. En cas d’échec, une nouvelle tentative a lieu après 15 minutes. Aucune installation ni aucun redémarrage automatique.",
			"aboutInfo.changelog": "Journal des modifications",
			"aboutInfo.checkUpdates": "Rechercher des mises à jour",
			"aboutInfo.currentVersion": "Version actuelle",
			"aboutInfo.description": "Recherchez et organisez les conversations DeepSeek Harness, gérez les archives, les étiquettes et les notes, explorez la filiation des conversations, puis importez ou exportez des sauvegardes.",
			"aboutInfo.feedback": "Signaler un problème",
			"aboutInfo.home": "Page du projet",
			"aboutInfo.license": "Licence",
			"aboutInfo.loadFailed": "Impossible de charger les informations du plugin. Réessayez.",
			"aboutInfo.loading": "Chargement des informations du plugin…",
			"aboutInfo.localCurrent": "Une copie locale est utilisée",
			"aboutInfo.marketplace": "Catalogue de plugins",
			"aboutInfo.reload": "Recharger les informations",
			"aboutInfo.reloadInstructions": "Vérifiez votre connexion à DSH. Si vous venez de mettre à jour le plugin, rechargez le serveur DSH et réessayez. Actualiser la page peut ne pas suffire à activer les nouveaux points d’accès.",
			"aboutInfo.starLink": "donner une ⭐ étoile au projet",
			"aboutInfo.starPrompt": "Si ce plugin vous a aidé à retrouver un travail passé, pensez à {link}.",
			"aboutInfo.updateAvailable": "La version {version} est disponible",
			"aboutInfo.updateDetails": "Ouvrez les détails de la mise à jour pour afficher l’environnement actuel, copier les informations d’installation ou installer une mise à jour si l’hôte le permet. Les paquets du registre ne remplacent jamais les copies locales.",
			"aboutInfo.userGuide": "Guide d’utilisation",
			"aboutInfo.versionHeading": "Version et mises à jour",
			"aboutInfo.versionLoading": "Chargement…",
			"aboutInfo.versionUnavailable": "Indisponible",
			"updateUi.applied": "L’hôte a appliqué la version v{version}. Rouvrez Gestion des archives pour vérifier la version en cours d’exécution.",
			"updateUi.available": "La version {version} est disponible",
			"updateUi.bundledCommand": "Cette commande utilise le binaire dsh fourni avec l’application de bureau actuelle.",
			"updateUi.checkAgain": "Vérifier à nouveau",
			"updateUi.checking": "Recherche de mises à jour…",
			"updateUi.close": "Fermer",
			"updateUi.copied": "Copié",
			"updateUi.copyCommand": "Copier la commande de mise à jour",
			"updateUi.copyFailed": "La copie a échoué. Sélectionnez le texte et copiez-le manuellement.",
			"updateUi.copyLocalPath": "Copier le chemin local",
			"updateUi.copyPackage": "Copier le nom et la version du paquet",
			"updateUi.current": "Vous utilisez la dernière version",
			"updateUi.currentEnvironment": "Environnement actuel",
			"updateUi.environmentCli": "Hôte DSH actuel",
			"updateUi.environmentDesktop": "Application de bureau officielle",
			"updateUi.environmentUnknown": "Hôte non reconnu",
			"updateUi.errorAlreadyApplied": "L’hôte a déjà appliqué la mise à jour. Rouvrez Gestion des archives pour vérifier la version en cours d’exécution.",
			"updateUi.errorHostManaged": "Utilisez le gestionnaire de plugins de l’hôte pour effectuer la mise à jour. Suivez les instructions ci-dessous.",
			"updateUi.errorLocalInstall": "Une copie locale est désormais utilisée. Son remplacement par un paquet du registre a été bloqué.",
			"updateUi.errorRestoreFailed": "La mise à jour a échoué et la restauration de la version précédente n’a pas pu être confirmée. Consultez la page officielle des plugins et réinstallez le plugin.",
			"updateUi.errorRestored": "La mise à jour a échoué et le gestionnaire de plugins officiel a restauré la version précédente. Rouvrez Gestion des archives pour le vérifier.",
			"updateUi.errorUnverified": "La fin de la mise à jour n’a pas pu être confirmée. Rouvrez cette page pour vérifier son état. Au besoin, consultez la page des plugins de l’hôte ou utilisez la commande ci-dessous.",
			"updateUi.errorVersionChanged": "Les informations de version ont changé. Relancez la vérification avant d’effectuer la mise à jour.",
			"updateUi.externalInstructions": "Ce plugin a été installé depuis une source externe. Mettez-le à jour à partir de cette source. Les informations ci-dessous permettent d’installer une version publique dans un autre environnement.",
			"updateUi.install": "Installer la mise à jour",
			"updateUi.installInstructions": "« Installer la mise à jour » permet au gestionnaire officiel de vérifier la compatibilité et de remplacer le plugin. Cette page peut se fermer pendant l’opération. Rouvrez Gestion des archives pour vérifier la version. Un message vous indiquera si un redémarrage est nécessaire.",
			"updateUi.installing": "Installation en cours…",
			"updateUi.installingThroughHost": "Installation de la mise à jour via l’hôte…",
			"updateUi.lastChecked": "Dernière vérification",
			"updateUi.localCheckout": "Copie locale",
			"updateUi.localCurrent": "La copie locale est connectée. Les informations sur la version publique figurent ci-dessous.",
			"updateUi.localInstructions": "Cette copie locale ne peut pas être remplacée par un paquet du registre. Redémarrez DSH après vos modifications. Pour l’utiliser dans un autre environnement, collez le chemin du dossier ci-dessous dans « Ajouter un plugin ».",
			"updateUi.manualInstructions": "Sur la page officielle des plugins, trouvez Gestion des archives et lancez la mise à jour depuis la section « Versions ». Suivez les instructions de réinstallation sur les hôtes plus anciens. Vous pouvez également ajouter le paquet ci-dessous dans un autre environnement.",
			"updateUi.previousPublicRelease": "v{version} (vérification précédente)",
			"updateUi.privacy": "Les recherches automatiques se limitent aux métadonnées publiques de npm et ne transmettent aucune conversation. Elles ne déclenchent ni installation ni redémarrage.",
			"updateUi.publicRelease": "Version publique",
			"updateUi.restartRequired": "La version v{version} a été installée. Redémarrez DSH et vérifiez la version en cours d’exécution.",
			"updateUi.runningVersion": "Version en cours d’exécution",
			"updateUi.terminalCommand": "Commande de mise à jour dans le terminal",
			"updateUi.terminalDesktopInstructions": "Vous pouvez aussi quitter complètement l’application de bureau DSH, puis exécuter cette commande sur le même ordinateur.",
			"updateUi.terminalHostInstructions": "Vous pouvez aussi quitter l’hôte DSH actuel, puis exécuter cette commande sur le même ordinateur.",
			"updateUi.title": "Mise à jour du plugin",
			"updateUi.unavailable": "La recherche de mises à jour a échoué. Réessayez plus tard.",
			"updateUi.unchecked": "Les mises à jour n’ont pas encore été recherchées",
		};

		const ja = {
			"locale.intl": "ja-JP",
			"nav": "アーカイブ管理",
			"page.title": "アーカイブ管理",
			"page.description": "アーカイブしたチャットを閲覧、検索、管理できます",
			"tab.archived": "アーカイブ済み",
			"archive.viewArchived": "アーカイブ済みのチャットを表示",
			"chat.deletionUnverified": "削除状況を確認できません。しばらくしてからもう一度お試しください。",
			"tab.lineage": "派生元と分岐",
			"tab.about": "このプラグインについて",
			"about.updateAvailable": "アップデートがあります",
			"help.label": "{label}のヘルプ",
			"archive.view": "表示",
			"lineage.origin.subagent": "サブエージェント",
			"lineage.origin.fork": "フォーク",
			"lineage.origin.root": "元のチャット",
			"lineage.origin.unknown": "派生元不明",
			"lineage.copyId": "ID をコピー",
			"lineage.copiedId": "コピーしました",
			"lineage.loading": "派生元と分岐を読み込み中…",
			"lineage.error": "派生元と分岐を表示できません",
			"lineage.scopeNote": "この Host のすべてのワークスペースで、アーカイブの有無を問わず、チャットの派生元と分岐を確認できます。状態で絞り込むと一覧だけが変わり、関係図には関連するチャットがすべて表示されます。同じ派生元への参照は重複して数えません。",
			"lineage.search": "チャットのタイトル、ワークスペース、ID で検索",
			"lineage.projectFilter": "プロジェクトで絞り込み",
			"lineage.statusFilter": "状態で絞り込み",
			"lineage.statusAll": "すべての状態",
			"lineage.managedHeading": "チャットの関係",
			"lineage.relatedWorkspaces": "すべてのワークスペース",
			"lineage.noArchives": "チャットはありません",
			"lineage.managedCount": "件のチャット",
			"lineage.totalCount": "チャット総数：{count}件",
			"lineage.resultCount": "該当するチャット：{count}件",
			"lineage.expandAll": "すべて展開",
			"lineage.collapseAll": "すべて折りたたむ",
			"lineage.searchFoldHint": "絞り込み中は、条件に一致するワークスペースが展開されたままになります",
			"lineage.empty": "条件に一致するチャットはありません",
			"lineage.workspaceEmpty": "チャットはありません",
			"lineage.trackingUnavailable": "派生元を追跡できません。新しくフォークしたチャットの一部で、派生元が記録されていない可能性があります。",
			"lineage.deletionUnavailable": "削除状況を取得できないため、保留中の削除を確認できませんでした。",
			"lineage.status.active": "未アーカイブ",
			"lineage.status.archived": "アーカイブ済み",
			"lineage.status.missing": "派生元を参照できません",
			"lineage.untitled": "無題のチャット",
			"lineage.sourceUnavailable": "派生元の情報を取得できません",
			"lineage.sourceContext": "派生元",
			"lineage.contextOnly": "派生元としてのみ表示",
			"lineage.searchMatch": "検索条件に一致するチャット",
			"lineage.independent": "独立したチャット",
			"lineage.sourceUnrecorded": "派生元のチャットは未記録です",
			"lineage.sourceUnrecordedHint": "このチャットには引き継いだ履歴がありますが、派生元のチャットが記録されていないため、派生元への接続線は表示できません。このチャットの内容は引き続き閲覧できます。",
			"lineage.view.open": "チャットの系譜",
			"lineage.view.title": "チャットの系譜図",
			"lineage.view.close": "チャットの系譜図を閉じる",
			"lineage.view.pan": "チャットの関係図。背景をドラッグするか、スクロールして移動できます",
			"lineage.view.enlarge": "表示領域を広げる",
			"lineage.view.restore": "ページに戻る",
			"lineage.view.zoomIn": "拡大",
			"lineage.view.zoomOut": "縮小",
			"lineage.view.zoom": "表示倍率",
			"lineage.view.fit": "全体を表示",
			"lineage.view.hint": "ドラッグで移動・Ctrl/⌘＋ホイールで拡大縮小・タイトルをクリックしてプレビュー",
			"lineage.view.nodes": "ノード",
			"lineage.view.connections": "本の接続線",
			"lineage.searchRelated": "関連する分岐",
			"lineage.start": "起点のチャット",
			"lineage.created": "作成日時",
			"lineage.project": "プロジェクト",
			"lineage.delegation": "委任の深さ",
			"lineage.noBranches": "分岐なし",
			"lineage.crossWorkspace": "派生元のワークスペース",
			"lineage.sourceId": "派生元の ID",
			"lineage.diagnostic.missing-parent": "親チャットが見つかりません",
			"lineage.diagnostic.missing-parent.detail": "親チャットの派生元情報を取得できません",
			"lineage.diagnostic.self-parent": "自分自身を親として参照しています",
			"lineage.diagnostic.cycle": "循環参照が見つかりました",
			"lineage.diagnostic.delegation-depth-mismatch": "委任の深さが一致しません",
			"action.import": "バックアップをインポート",
			"action.export": "すべてエクスポート",
			"import.title": "アーカイブのバックアップをインポート",
			"import.inspecting": "バックアップを確認中…",
			"import.preview": "復元するチャットを確認してください",
			"import.package": "バックアップの詳細",
			"import.confirm": "選択したチャットを復元",
			"import.cancel": "キャンセル",
			"import.close": "閉じる",
			"import.selectAll": "復元できるチャットをすべて選択",
			"import.clear": "選択を解除",
			"import.conflict": "ID が重複しているためスキップします",
			"import.workspaceWarning": "ワークスペースが見つからないため、グループに属さない状態で復元します",
			"import.cwdUnsupported": "作業ディレクトリがこのシステムに対応していないか、パスを一意に特定できません。元の ZIP ファイルを保管し、バックアップ元のディレクトリを確認してください。ディレクトリのマッピングには対応していません。",
			"import.cwdInvalid": "バックアップの作業ディレクトリが無効なため、復元できません。元の ZIP ファイルを保管し、バックアップ元を確認してください。",
			"import.attachmentWarning": "添付ファイルへの参照がありますが、ファイル自体は復元されません",
			"import.restored": "復元済み",
			"import.skipped": "スキップ",
			"import.expired": "プレビューの有効期限が切れました。バックアップを選び直してください。",
			"import.done": "バックアップからの復元が完了しました",
			"import.unsupported": "この Host ではデータを損なわずにこのバックアップを復元できません。ZIP ファイルを保管し、Host の互換性を確認してください。",
			"import.rollbackFailed": "復元は完了していません。書き込んだデータの一部を安全に元に戻せなかったため、関連ファイルは保持されています。ZIP ファイルを保管し、原因を確認してから再試行してください。競合しているチャットは削除しないでください。",
			"import.conflictChanged": "選択したチャットはすでに存在するか、まだ削除処理中です。既存のデータは上書きされていません。バックアップを選び直して確認してください。",
			"import.titlePublicationDegraded": "チャットは安全に復元されました。ただし、チャットを開くまでメインのチャット一覧にタイトルが表示されない場合があります。",
			"import.seededTitleLimitation": "チャットは安全に復元されました。この Host では起動直後の一覧に分岐したチャットのタイトルを表示できませんが、チャットを開くと正しく表示されます。",
			"export.all": "すべてエクスポート",
			"menu.workspaceScope": "このワークスペース",
			"menu.allWorkspaces": "すべてのワークスペース",
			"export.selected": "選択したチャットをエクスポート",
			"menu.row": "チャットのその他の操作",
			"export.started": "バックアップのダウンロードが始まりました",
			"export.failed": "バックアップをエクスポートできませんでした。アプリは開いたままです。一覧を更新してからもう一度お試しください。",
			"export.tooLarge": "チャット {id} はバックアップの上限を超えているため、インポート可能なバックアップに含めることができません。このチャットの選択を解除してからもう一度お試しください。",
			"export.sourceInvalid": "エクスポート元のデータが無効なため、バックアップを作成できません。",
			"export.timeout": "バックアップのエクスポートがタイムアウトしました。不完全なファイルはダウンロードされていません。しばらくしてからもう一度お試しください。",
			"search.placeholder": "タイトル、タグ、メモ、会話の内容を検索",
			"workspaceArchive.reason.session-ineligible": "アーカイブの対象外になったためスキップしました",
			"search.contentMatch": "会話の内容が一致",
			"preview.open": "会話を表示",
			"preview.close": "プレビューを閉じる",
			"preview.loading": "会話を読み込み中…",
			"preview.error": "会話のプレビューを読み込めませんでした",
			"preview.empty": "このアーカイブにはプレビューできるメッセージがありません",
			"preview.more": "さらに読み込む",
			"preview.timeline": "会話のタイムライン",
			"preview.user": "ユーザー",
			"preview.assistant": "アシスタント",
			"preview.tool": "ツール",
			"preview.system": "システムプロンプト",
			"preview.context": "追加されたコンテキスト",
			"preview.reasoning": "推論",
			"preview.toolCall": "ツール呼び出し",
			"preview.toolResult": "ツールの実行結果",
			"preview.toolArguments": "引数",
			"preview.json": "JSON",
			"preview.unknown": "不明なコンテンツ",
			"preview.copy": "コピー",
			"preview.copied": "コピーしました",
			"preview.copyError": "コピーできませんでした。クリップボードへのアクセスを許可してからもう一度お試しください。",
			"preview.imageUnavailable": "画像を表示できません",
			"preview.readOnly": "読み取り専用プレビュー",
			"filter.allChats": "すべてのチャット",
			"filter.type": "種類",
			"filter.normal": "通常のチャット",
			"filter.subagent": "サブエージェントのチャット",
			"filter.allProjects": "すべてのワークスペース",
			"filter.scheduled": "自動化タスク",
			"filter.scheduleUnsupported": "この Host では自動化タスクが有効になっていません",
			"filter.scheduleUnavailable": "自動化タスクを取得できません。一覧を更新してもう一度お試しください。",
			"sort.label": "並べ替え",
			"sort.newest": "更新日時が新しい順",
			"sort.oldest": "更新日時が古い順",
			"sort.title": "タイトル順",
			"group.noProject": "グループなし",
			"group.defaultWorkspace": "既定のワークスペース",
			"chat.untitled": "無題のチャット",
			"chat.unarchive": "アーカイブを解除",
			"unarchive.cwdMissing": "このチャットには作業ディレクトリがないため、この Host ではメインのチャット一覧に戻せません。アーカイブ済みのコピーは保持されており、引き続きプレビューやエクスポートができます。",
			"unarchive.authorityUnavailable": "現在、この Host ではチャットをメインの一覧に戻せるかどうか確認できません。アーカイブ済みのコピーは変更されていません。しばらくしてからもう一度お試しください。",
			"unarchive.deletionPending": "このチャットはまだ削除処理中のため、アーカイブを解除できません。アーカイブ済みのコピーは保持されています。",
			"unarchive.pendingUnavailable": "現在、削除状況を確認できないため、アーカイブは解除されていません。アーカイブ済みのコピーは保持されています。しばらくしてからもう一度お試しください。",
			"chat.delete": "削除",
			"chat.deleteArchived": "アーカイブ済みのチャットを削除",
			"chat.deleteUnarchived": "未アーカイブのチャットを削除",
			"chat.deleteRunning": "削除する前にこのチャットを停止してください",
			"menu.deleteAllPermanently": "すべて完全に削除",
			"menu.unarchiveAll": "すべてのチャットのアーカイブを解除",
			"action.deleteAll": "すべて完全に削除",
			"group.collapse": "折りたたむ",
			"group.expand": "展開",
			"confirm.cancel": "キャンセル",
			"chat.deleted": "完全に削除しました",
			"deletion.incomplete": "一部のチャットの削除が完了していません。再試行すると削除を続行できます。",
			"state.loading": "読み込み中…",
			"state.empty": "アーカイブ済みのチャットはありません",
			"state.emptyFiltered": "条件に一致するチャットはありません",
			"state.error": "読み込めませんでした",
			"state.retry": "再試行",
			"notice.dismiss": "閉じる",
			"tag.filter": "すべてのタグ",
			"tag.edit": "タグとメモを編集",
			"tag.input": "タグ",
			"tag.placeholder": "タグを入力して Enter キーを押す",
			"note.label": "メモ",
			"note.placeholder": "メモを追加（2,000文字まで）",
			"meta.save": "保存",
			"meta.saved": "タグとメモを保存しました",
			"meta.unavailable": "メタデータを取得できないため、タグとメモを編集できません",
			"stats.loading": "ストレージの使用量を計算中…",
			"stats.error": "ストレージの使用状況を取得できません",
			"workspaceArchive.action": "チャットをアーカイブ",
			"workspaceArchive.chooseTitle": "ワークスペースを選択",
			"workspaceArchive.chooseBody": "アーカイブしたいチャットがあるワークスペースを選んでください。複数選択できます。",
			"workspaceArchive.selectAll": "すべて選択",
			"workspaceArchive.chooseConfirm": "確定",
			"workspaceArchive.eligibleCount": "アーカイブ可能なチャット：{count}件",
			"workspaceArchive.liveCount": "実行中のチャット：{count}件",
			"workspaceArchive.noWorkspaces": "アーカイブ可能なチャットがあるワークスペースはありません。",
			"workspaceArchive.loadError": "ワークスペースを読み込めませんでした。もう一度お試しください。",
			"workspaceArchive.close": "ワークスペースのアーカイブ画面を閉じる",
			"workspaceArchive.loading": "アーカイブを準備中…",
			"workspaceArchive.skipped": "スキップしたチャット",
			"workspaceArchive.confirmTitle": "このワークスペースのすべてのチャットをアーカイブしますか？",
			"workspaceArchive.confirmBody": "「{workspace}」のチャットをアーカイブします。アーカイブしたチャットは「アーカイブ管理」の「アーカイブ済み」で確認できます。",
			"workspaceArchive.confirmBodyMany": "選択したワークスペースのチャットをアーカイブします。アーカイブしたチャットは「アーカイブ済み」で確認できます。",
			"workspaceArchive.skippedLive": "実行中または状態を確認できないチャット{count}件はスキップします。",
			"workspaceArchive.apply": "アーカイブする",
			"workspaceArchive.applying": "アーカイブ中…",
			"workspaceArchive.success": "{count}件のチャットをアーカイブしました",
			"workspaceArchive.result": "ワークスペースのアーカイブ結果",
			"workspaceArchive.archived": "アーカイブ済み",
			"workspaceArchive.failed": "失敗",
			"workspaceArchive.done": "完了",
			"workspaceArchive.unsupported": "このバージョンの DSH は、ワークスペース単位の一括アーカイブに対応していません。",
			"workspaceArchive.error": "ワークスペースの一括アーカイブを完了できませんでした。もう一度お試しください。",
			"workspaceArchive.reason.session-live": "実行中または状態を確認できないためスキップしました",
			"workspaceArchive.reason.session-archived": "すでにアーカイブ済みのためスキップしました",
			"workspaceArchive.reason.session-empty": "内容のない新規チャットのためスキップしました",
			"workspaceArchive.reason.session-unavailable": "会話の内容を確認できなかったためスキップしました",
			"workspaceArchive.reason.session-workspace-changed": "所属するワークスペースが変わったためスキップしました",
			"workspaceArchive.reason.archive-failed": "アーカイブに失敗しました",
			"workspaceArchive.reason.archive-uncommitted": "アーカイブは完了していません",
			"workspaceArchive.reason.lifecycle-failed": "操作は完了していません",
			"workspaceArchive.reason.stop-archive-unsupported": "この Host では、タスクを停止してそのままアーカイブすることはできません。先に公式 UI でタスクを停止してください。",
			"workspaceArchive.reason.unknown": "未完了",
			"workspaceArchive.retry": "もう一度準備する",
			"tab.unarchived": "未アーカイブ",
			"unarchived.search": "タイトル、ID、会話の内容を検索",
			"unarchived.empty": "未アーカイブのチャットはありません",
			"unarchived.error": "未アーカイブのチャットを表示できません。もう一度お試しください。",
			"unarchived.loading": "チャットを読み込み中…",
			"unarchived.archiveAll": "すべてアーカイブ",
			"unarchived.archive": "アーカイブ",
			"unarchived.busy": "実行中",
			"action.refresh": "更新",
			"ui.chatCount.one": "{count} 件のチャット",
			"ui.chatCount.few": "{count} 件のチャット",
			"ui.chatCount.many": "{count} 件のチャット",
			"ui.chatCount.other": "{count} 件のチャット",
			"ui.selectChatLabel": "「{title}」を選択",
			"ui.removeTagLabel": "タグ「{tag}」を削除",
			"ui.previewJump": "メッセージ {index} へ移動",
			"ui.lineageFrom": "分岐元：「{title}」",
			"ui.branchCount.one": "{count} 件の分岐",
			"ui.branchCount.few": "{count} 件の分岐",
			"ui.branchCount.many": "{count} 件の分岐",
			"ui.branchCount.other": "{count} 件の分岐",
			"ui.tagsLimit": "タグ {count}/8、各タグは最大24文字",
			"ui.noteLimit": "メモ {count}/2000",
			"scope.deletionDetails": "削除対象は選択した {selected} 件のチャットと関連するサブエージェントのチャット {subagents} 件、合計 {total} 件です。選択していない独立した分岐は保持されます。",
			"scope.workspaceArchivedTarget": "ワークスペース「{title}」のアーカイブ済みチャット全 {count} 件",
			"scope.workspaceUnarchivedTarget": "ワークスペース「{title}」の未アーカイブのチャット全 {count} 件",
			"scope.allTarget": "全 {workspaces} 個のワークスペースにあるアーカイブ済みチャット {count} 件",
			"scope.selectionTarget": "選択したアーカイブ済みチャット {count} 件",
			"scope.chatTarget": "チャット「{title}」",
			"scope.deleteArchivedWorkspace": "このワークスペースのアーカイブ済みチャットをすべて削除しますか？",
			"scope.deleteUnarchivedWorkspace": "このワークスペースの未アーカイブのチャットをすべて削除しますか？",
			"scope.deleteAll": "ローカルのアーカイブ済みチャットをすべて削除しますか？",
			"scope.deleteSelection": "選択したアーカイブ済みチャットを削除しますか？",
			"scope.deleteArchivedOne": "アーカイブ済みチャットを削除しますか？",
			"scope.deleteUnarchivedOne": "未アーカイブのチャットを削除しますか？",
			"scope.deleteBody": "{target}を完全に削除します。この操作は取り消せません。",
			"scope.deleteLocalBody": "ローカルの{target}を完全に削除します。この操作は取り消せません。",
			"scope.unarchiveWorkspaceTarget": "ワークスペース「{title}」のアーカイブ済みチャット",
			"scope.unarchiveAllTarget": "すべてのワークスペースのアーカイブ済みチャット",
			"scope.unarchiveSelectionTarget": "選択したアーカイブ済みチャット",
			"scope.unarchiveWorkspace": "このワークスペースのチャットをすべてアーカイブ解除しますか？",
			"scope.unarchiveSelection": "選択したチャットのアーカイブを解除しますか？",
			"scope.unarchiveAll": "すべてのチャットのアーカイブを解除しますか？",
			"scope.unarchiveBody": "{target}をチャット一覧に戻します。",
			"scope.exportWorkspace": "このワークスペースのアーカイブ済みチャットをすべてエクスポートしますか？",
			"scope.exportSelection": "選択したチャットをエクスポートしますか？",
			"scope.exportAll": "アーカイブ済みチャットをすべてエクスポートしますか？",
			"scope.exportBody": "{target}を ZIP バックアップとしてエクスポートします。アーカイブ状態は変わりません。バックアップには機密情報が含まれる可能性があるため、安全に保管してください。",
			"scope.stopArchiveAll": "すべてのチャットを停止してアーカイブしますか？",
			"scope.stopArchiveOne": "このチャットを停止してアーカイブしますか？",
			"scope.stopArchiveMany": "これらのチャットを停止してアーカイブしますか？",
			"scope.archiveAll": "すべてのチャットをアーカイブしますか？",
			"scope.archiveOne": "このチャットをアーカイブしますか？",
			"scope.archiveSelectedWorkspaces": "選択したワークスペースのチャットをアーカイブしますか？",
			"scope.archiveAllBody": "すべてのワークスペースのチャットをアーカイブします。後で「アーカイブ済み」で確認できます。",
			"scope.archiveOneBody": "このチャットをアーカイブします。後で「アーカイブ済み」で確認できます。",
			"scope.stopArchiveBody": "アーカイブすると、選択したチャットで進行中の処理が停止します。後でアーカイブを解除できます。",
			"scope.stopArchiveAction": "停止してアーカイブ",
			"failure.purge-unsupported": "このストレージでは完全削除を実行できません。",
			"failure.restore-unsupported": "このストレージではこのチャットを復元できません。",
			"failure.session-live-purge-pending": "チャットはまだ実行中です。停止してから再試行してください。",
			"failure.unarchived-delete-running": "削除する前に実行中のチャットを停止してください。",
			"failure.session-delete-running": "削除する前にチャットとサブエージェントを停止してください。",
			"failure.deletion-scope-changed": "削除対象が変わりました。もう一度選択して確認してください。",
			"failure.unarchived-delete-changed": "チャットまたはワークスペースが変更されました。更新して再試行してください。",
			"failure.refreshRetry": "更新して再試行してください。",
			"failure.operationOne": "{count} 件のチャットの操作に失敗しました：{reason}",
			"failure.operationMany": "{count} 件のチャットの操作に失敗しました：{reason}",
			"import.packageFormat": "形式 v{version}",
			"import.sessionCount.other": "{count} 件のセッション",
			"preview.footnotes": "脚注",
			"preview.process.toolCalls.other": "ツール呼び出し {count} 回",
			"preview.process.messages.other": "メッセージ {count} 件",
			"preview.process.subagents.other": "サブエージェント {count} 件",
			"preview.process.thought": "思考済み",
			"preview.process.incomplete": "未完了",
			"preview.anchorMissing": "検索に一致したメッセージが変更されたか、プレビューの範囲外です。会話の冒頭から表示します。",
			"preview.earlier": "以前のメッセージを読み込む",
			"menu.workspaceActions": "ワークスペースのその他の操作 · {title}",
			"unarchived.archiveUnavailable": "アーカイブできません",
			"lineage.delegatedBy": "委任元：「{title}」",
			"import.sessionCount.few": "{count} 件のセッション",
			"import.sessionCount.many": "{count} 件のセッション",
			"import.sessionCount.one": "{count} 件のセッション",
			"preview.process.messages.few": "メッセージ {count} 件",
			"preview.process.messages.many": "メッセージ {count} 件",
			"preview.process.messages.one": "メッセージ {count} 件",
			"preview.process.subagents.few": "サブエージェント {count} 件",
			"preview.process.subagents.many": "サブエージェント {count} 件",
			"preview.process.subagents.one": "サブエージェント {count} 件",
			"preview.process.toolCalls.few": "ツール呼び出し {count} 回",
			"preview.process.toolCalls.many": "ツール呼び出し {count} 回",
			"preview.process.toolCalls.one": "ツール呼び出し {count} 回",
			"chat.listChanged": "チャット一覧が変更されました。更新してから選択し直してください。",
			"search.progress": "{status}：確認したチャット {processed}/{total} 件、本文の一致 {hits} 件、表示中 {displayed} 件、読み取り失敗 {failed} 件",
			"search.status.loading": "検索中",
			"search.status.ready": "検索完了",
			"search.status.partial": "検索完了（一部のチャットを読み取れませんでした）",
			"search.status.stopped": "検索を停止しました",
			"search.status.error": "検索に失敗しました",
			"search.stop": "検索を停止",
			"search.retryUnfinished": "未完了のチャットを再検索",
			"search.unreadable": "読み取れなかったチャット",
			"update.restartNeeded": "再起動が必要",
			"update.view": "更新を表示",
			"menu.moreArchiveActions": "その他のアーカイブ操作",
			"selection.enter": "選択",
			"selection.selectResults": "現在の結果をすべて選択",
			"selection.count": "{count} 件選択中",
			"selection.hiddenCount": "現在の結果に含まれない項目 {count} 件",
			"selection.moreActions": "選択した項目のその他の操作",
			"selection.deletePermanently": "選択したチャットを完全に削除",
			"aboutInfo.author": "作者",
			"aboutInfo.automaticChecks": "アーカイブ管理を開くと、自動でアップデートを確認します。ページを開いている間は定期的に確認し、再接続時にも確認します。成功した結果は12時間キャッシュし、失敗した場合は15分後に再試行します。自動インストールや自動再起動は行いません。",
			"aboutInfo.changelog": "変更履歴",
			"aboutInfo.checkUpdates": "アップデートを確認",
			"aboutInfo.currentVersion": "現在のバージョン",
			"aboutInfo.description": "DeepSeek Harness のチャットの検索・整理、アーカイブ・タグ・メモの管理、チャットの系譜の表示、バックアップのインポートとエクスポートができます。",
			"aboutInfo.feedback": "問題を報告",
			"aboutInfo.home": "プロジェクトのホーム",
			"aboutInfo.license": "ライセンス",
			"aboutInfo.loadFailed": "プラグイン情報を読み込めませんでした。再読み込みしてください。",
			"aboutInfo.loading": "プラグイン情報を読み込み中…",
			"aboutInfo.localCurrent": "ローカル開発版を使用中",
			"aboutInfo.marketplace": "プラグインマーケット",
			"aboutInfo.reload": "情報を再読み込み",
			"aboutInfo.reloadInstructions": "DSH への接続を確認してください。プラグインを更新した直後は、DSH のバックエンドを再読み込みしてからもう一度お試しください。ページの再読み込みだけでは、新しいエンドポイントが有効にならない場合があります。",
			"aboutInfo.starLink": "プロジェクトに ⭐ を付けてください",
			"aboutInfo.starPrompt": "過去の作業を見つけるのに役立ったら、ぜひ{link}。",
			"aboutInfo.updateAvailable": "新しいバージョン v{version} が利用できます",
			"aboutInfo.updateDetails": "アップデートの詳細を開くと、現在の環境やインストール情報を確認できます。インストール情報はコピーでき、ホストが対応していればアップデートも適用できます。ローカル開発版がレジストリのパッケージで上書きされることはありません。",
			"aboutInfo.userGuide": "ユーザーガイド",
			"aboutInfo.versionHeading": "バージョンとアップデート",
			"aboutInfo.versionLoading": "読み込み中…",
			"aboutInfo.versionUnavailable": "取得できません",
			"updateUi.applied": "ホストが v{version} を適用しました。アーカイブ管理を開き直し、実行中のバージョンを確認してください。",
			"updateUi.available": "新しいバージョン v{version} が利用できます",
			"updateUi.bundledCommand": "このコマンドは、現在のデスクトップアプリに同梱されている dsh を使用します。",
			"updateUi.checkAgain": "再確認",
			"updateUi.checking": "アップデートを確認中…",
			"updateUi.close": "閉じる",
			"updateUi.copied": "コピーしました",
			"updateUi.copyCommand": "更新コマンドをコピー",
			"updateUi.copyFailed": "コピーできませんでした。テキストを選択して手動でコピーしてください。",
			"updateUi.copyLocalPath": "ローカルパスをコピー",
			"updateUi.copyPackage": "パッケージ名とバージョンをコピー",
			"updateUi.current": "最新バージョンを使用しています",
			"updateUi.currentEnvironment": "現在の環境",
			"updateUi.environmentCli": "現在の DSH ホスト",
			"updateUi.environmentDesktop": "公式デスクトップアプリ",
			"updateUi.environmentUnknown": "実行環境を特定できません",
			"updateUi.errorAlreadyApplied": "ホストはすでにアップデートを適用しました。アーカイブ管理を開き直し、実行中のバージョンを確認してください。",
			"updateUi.errorHostManaged": "ホストのプラグイン管理画面からアップデートしてください。下の手順に従ってください。",
			"updateUi.errorLocalInstall": "ローカル開発版に切り替わったため、レジストリのパッケージによる上書きを防止しました。",
			"updateUi.errorRestoreFailed": "アップデートに失敗し、以前のバージョンに戻せたか確認できませんでした。公式のプラグインページを確認し、再インストールしてください。",
			"updateUi.errorRestored": "アップデートに失敗し、公式のプラグインマネージャーが以前のバージョンを復元しました。アーカイブ管理を開き直して確認してください。",
			"updateUi.errorUnverified": "アップデートの完了を確認できませんでした。このページを開き直して状態を確認してください。完了していない場合は、ホストのプラグインページでエラーを確認するか、下のコマンドを実行してください。",
			"updateUi.errorVersionChanged": "バージョン情報が変わりました。もう一度確認してからアップデートしてください。",
			"updateUi.externalInstructions": "このプラグインは外部ソースからインストールされています。同じソースからアップデートしてください。別の環境に公開版をインストールする場合は、下の情報を使用してください。",
			"updateUi.install": "アップデートをインストール",
			"updateUi.installInstructions": "「アップデートをインストール」を選ぶと、公式のプラグインマネージャーが互換性を確認してプラグインを置き換えます。処理中にこのページが閉じる場合があります。完了後、アーカイブ管理を開き直してバージョンを確認してください。再起動が必要な場合は通知されます。",
			"updateUi.installing": "インストール中…",
			"updateUi.installingThroughHost": "ホスト経由でアップデートをインストール中…",
			"updateUi.lastChecked": "最終確認",
			"updateUi.localCheckout": "ローカル開発版",
			"updateUi.localCurrent": "ローカル開発版に接続しています。公開版の情報は以下のとおりです。",
			"updateUi.localInstructions": "このローカル開発版がレジストリのパッケージで置き換えられることはありません。変更後は DSH を再起動してください。別のホストに接続するには、下のディレクトリを「プラグインを追加」に貼り付けてください。",
			"updateUi.manualInstructions": "公式のプラグインページで「アーカイブ管理」を探し、「バージョン」セクションからアップデートしてください。古いホストで再インストールが必要な場合は、ページの案内に従ってください。別の環境に追加する場合は、下のパッケージ名も使用できます。",
			"updateUi.previousPublicRelease": "v{version}（前回の確認結果）",
			"updateUi.privacy": "自動確認では公開されている npm のメタデータのみを取得し、チャットは送信しません。自動でインストールや再起動することはありません。",
			"updateUi.publicRelease": "公開版",
			"updateUi.restartRequired": "v{version} をインストールしました。DSH を再起動して、実行中のバージョンを確認してください。",
			"updateUi.runningVersion": "実行中のバージョン",
			"updateUi.terminalCommand": "ターミナルで実行する更新コマンド",
			"updateUi.terminalDesktopInstructions": "デスクトップアプリを完全に終了してから、同じコンピューターで以下のコマンドを実行することもできます。",
			"updateUi.terminalHostInstructions": "現在の DSH ホストを終了してから、同じコンピューターで以下のコマンドを実行することもできます。",
			"updateUi.title": "プラグインのアップデート",
			"updateUi.unavailable": "アップデートを確認できませんでした。しばらくしてからもう一度お試しください。",
			"updateUi.unchecked": "アップデートはまだ確認していません",
		};

		const pt = {
			"locale.intl": "pt-BR",
			"nav": "Gerenciar arquivamento",
			"page.title": "Gerenciar arquivamento",
			"page.description": "Veja, pesquise e gerencie conversas arquivadas",
			"tab.archived": "Arquivadas",
			"archive.viewArchived": "Ver conversas arquivadas",
			"chat.deletionUnverified": "O status da exclusão não está disponível. Tente novamente mais tarde.",
			"tab.lineage": "Origens e ramificações",
			"tab.about": "Sobre",
			"about.updateAvailable": "Atualização disponível",
			"help.label": "Ajuda: {label}",
			"archive.view": "Ver",
			"lineage.origin.subagent": "Subagente",
			"lineage.origin.fork": "Ramificação",
			"lineage.origin.root": "Conversa original",
			"lineage.origin.unknown": "Origem desconhecida",
			"lineage.copyId": "Copiar ID",
			"lineage.copiedId": "ID copiado",
			"lineage.loading": "Carregando origens e ramificações…",
			"lineage.error": "Origens e ramificações indisponíveis",
			"lineage.scopeNote": "Veja as origens e ramificações das conversas de todos os espaços de trabalho deste Host, estejam elas arquivadas ou não. Os filtros de status se aplicam apenas à lista; os grafos mostram todas as conversas relacionadas. Referências repetidas à mesma origem não entram na contagem.",
			"lineage.search": "Pesquisar por título, espaço de trabalho ou ID da conversa",
			"lineage.projectFilter": "Filtrar por projeto",
			"lineage.statusFilter": "Filtrar por status",
			"lineage.statusAll": "Todos os status",
			"lineage.managedHeading": "Relações entre conversas",
			"lineage.relatedWorkspaces": "Todos os espaços de trabalho",
			"lineage.noArchives": "Nenhuma conversa",
			"lineage.managedCount": "conversa(s)",
			"lineage.totalCount": "Total de conversas: {count}",
			"lineage.resultCount": "Conversas nos resultados atuais: {count}",
			"lineage.expandAll": "Expandir tudo",
			"lineage.collapseAll": "Recolher tudo",
			"lineage.searchFoldHint": "Os espaços de trabalho que correspondem ao filtro permanecem expandidos",
			"lineage.empty": "Nenhuma conversa corresponde aos filtros",
			"lineage.workspaceEmpty": "Nenhuma conversa",
			"lineage.trackingUnavailable": "O rastreamento de origem não está disponível. A origem de algumas ramificações novas pode não ter sido registrada.",
			"lineage.deletionUnavailable": "O status da exclusão não está disponível. Não foi possível verificar as exclusões pendentes.",
			"lineage.status.active": "Não arquivada",
			"lineage.status.archived": "Arquivada",
			"lineage.status.missing": "Origem indisponível",
			"lineage.untitled": "Conversa sem título",
			"lineage.sourceUnavailable": "Informações de origem indisponíveis",
			"lineage.sourceContext": "Origem",
			"lineage.contextOnly": "Apenas para contextualizar a origem",
			"lineage.searchMatch": "Conversa correspondente à pesquisa",
			"lineage.independent": "Conversa independente",
			"lineage.sourceUnrecorded": "Conversa de origem não registrada",
			"lineage.sourceUnrecordedHint": "Esta conversa contém um histórico herdado, mas a conversa de origem não foi registrada. Por isso, não é possível mostrar a conexão entre elas. O conteúdo desta conversa continua disponível.",
			"lineage.view.open": "Linhagem da conversa",
			"lineage.view.title": "Grafo de linhagem das conversas",
			"lineage.view.close": "Fechar o grafo de linhagem das conversas",
			"lineage.view.pan": "Área do grafo de relações. Arraste o fundo ou use a rolagem para explorar",
			"lineage.view.enlarge": "Expandir visualização",
			"lineage.view.restore": "Voltar à página",
			"lineage.view.zoomIn": "Aumentar zoom",
			"lineage.view.zoomOut": "Diminuir zoom",
			"lineage.view.zoom": "Nível de zoom",
			"lineage.view.fit": "Ajustar à tela",
			"lineage.view.hint": "Arraste para mover o grafo · Use Ctrl/⌘ + roda do mouse para ajustar o zoom · Clique em um título para ver a prévia",
			"lineage.view.nodes": "nó(s)",
			"lineage.view.connections": "vínculo(s)",
			"lineage.searchRelated": "Ramificação relacionada",
			"lineage.start": "Conversa inicial",
			"lineage.created": "Criada em",
			"lineage.project": "Projeto",
			"lineage.delegation": "Nível de delegação",
			"lineage.noBranches": "Nenhuma ramificação",
			"lineage.crossWorkspace": "Espaço de trabalho de origem",
			"lineage.sourceId": "ID de origem",
			"lineage.diagnostic.missing-parent": "Conversa de origem não encontrada",
			"lineage.diagnostic.missing-parent.detail": "As informações sobre a conversa de origem não estão disponíveis",
			"lineage.diagnostic.self-parent": "A conversa aponta para si mesma como origem",
			"lineage.diagnostic.cycle": "Ciclo detectado",
			"lineage.diagnostic.delegation-depth-mismatch": "Níveis de delegação inconsistentes",
			"action.import": "Importar backup",
			"action.export": "Exportar todas",
			"import.title": "Importar backup de conversas arquivadas",
			"import.inspecting": "Verificando backup…",
			"import.preview": "Revise as sessões antes de restaurá-las",
			"import.package": "Detalhes do backup",
			"import.confirm": "Restaurar selecionadas",
			"import.cancel": "Cancelar",
			"import.close": "Fechar",
			"import.selectAll": "Selecionar todas as sessões que podem ser restauradas",
			"import.clear": "Limpar seleção",
			"import.conflict": "Conflito de ID. Esta conversa será ignorada.",
			"import.workspaceWarning": "Espaço de trabalho não encontrado. A conversa ficará sem grupo.",
			"import.cwdUnsupported": "O diretório de trabalho é incompatível ou ambíguo neste sistema. Mantenha o ZIP original e verifique o diretório de origem. Não há suporte ao mapeamento de diretórios.",
			"import.cwdInvalid": "O diretório de trabalho do backup é inválido e não pode ser restaurado. Mantenha o ZIP original e verifique a origem do backup.",
			"import.attachmentWarning": "Há referências a anexos, mas os arquivos dos anexos não serão restaurados.",
			"import.restored": "Restauradas",
			"import.skipped": "Ignoradas",
			"import.expired": "A prévia expirou. Selecione o backup novamente.",
			"import.done": "Restauração do backup concluída",
			"import.unsupported": "Este Host não pode restaurar o backup sem perda de dados. Mantenha o ZIP e verifique a compatibilidade do Host.",
			"import.rollbackFailed": "A restauração ficou incompleta e não foi possível desfazer com segurança algumas gravações. Os arquivos envolvidos foram preservados. Mantenha o ZIP e investigue o problema antes de tentar novamente. Não exclua as conversas com conflito.",
			"import.conflictChanged": "As conversas selecionadas já existem ou ainda aguardam exclusão. Os dados existentes não foram sobrescritos. Selecione o backup novamente para revisar as conversas.",
			"import.titlePublicationDegraded": "A conversa foi restaurada com segurança, mas talvez o título só apareça na lista principal depois que você abrir a conversa.",
			"import.seededTitleLimitation": "A conversa foi restaurada com segurança. Este Host não consegue exibir o título de uma ramificação na lista ao iniciar. O título será exibido normalmente quando você abrir a conversa.",
			"export.all": "Exportar todas",
			"menu.workspaceScope": "Este espaço de trabalho",
			"menu.allWorkspaces": "Todos os espaços de trabalho",
			"export.selected": "Exportar selecionadas",
			"menu.row": "Mais ações para esta conversa",
			"export.started": "Download do backup iniciado",
			"export.failed": "Não foi possível exportar o backup. O aplicativo continua aberto. Atualize a lista e tente novamente.",
			"export.tooLarge": "A conversa {id} excede o limite de tamanho para um backup que possa ser importado. Desmarque essa conversa e tente novamente.",
			"export.sourceInvalid": "A origem da exportação é inválida e não pode ser incluída em um backup.",
			"export.timeout": "O tempo para exportar o backup se esgotou. Nenhum arquivo incompleto foi baixado. Tente novamente mais tarde.",
			"search.placeholder": "Pesquisar em títulos, etiquetas, notas e no conteúdo das conversas",
			"workspaceArchive.reason.session-ineligible": "Conversa ignorada porque não pode mais ser arquivada",
			"search.contentMatch": "Correspondência no conteúdo da conversa",
			"preview.open": "Ver conversa",
			"preview.close": "Fechar prévia",
			"preview.loading": "Carregando conversa…",
			"preview.error": "Não foi possível carregar a prévia da conversa",
			"preview.empty": "Não há mensagens para visualizar nesta conversa arquivada",
			"preview.more": "Carregar mais",
			"preview.timeline": "Linha do tempo da conversa",
			"preview.user": "Usuário",
			"preview.assistant": "Assistente",
			"preview.tool": "Ferramenta",
			"preview.system": "Prompt do sistema",
			"preview.context": "Contexto injetado",
			"preview.reasoning": "Raciocínio",
			"preview.toolCall": "Chamada de ferramenta",
			"preview.toolResult": "Resultado da ferramenta",
			"preview.toolArguments": "Argumentos",
			"preview.json": "JSON",
			"preview.unknown": "Conteúdo desconhecido",
			"preview.copy": "Copiar",
			"preview.copied": "Copiado",
			"preview.copyError": "Não foi possível copiar. Permita o acesso à área de transferência e tente novamente.",
			"preview.imageUnavailable": "Imagem indisponível",
			"preview.readOnly": "Prévia somente para leitura",
			"filter.allChats": "Todas as conversas",
			"filter.type": "Tipo",
			"filter.normal": "Conversas comuns",
			"filter.subagent": "Conversas de subagentes",
			"filter.allProjects": "Todos os espaços de trabalho",
			"filter.scheduled": "Tarefas de automação",
			"filter.scheduleUnsupported": "As tarefas de automação não estão habilitadas neste Host",
			"filter.scheduleUnavailable": "As tarefas de automação não estão disponíveis. Atualize para tentar novamente.",
			"sort.label": "Ordenar por",
			"sort.newest": "Atualização mais recente",
			"sort.oldest": "Atualização mais antiga",
			"sort.title": "Título",
			"group.noProject": "Sem grupo",
			"group.defaultWorkspace": "Espaço de trabalho padrão",
			"chat.untitled": "Conversa sem título",
			"chat.unarchive": "Desarquivar",
			"unarchive.cwdMissing": "Esta conversa não tem um diretório de trabalho, por isso este Host não pode colocá-la de volta na lista principal. A cópia arquivada foi preservada e continua disponível para prévia e exportação.",
			"unarchive.authorityUnavailable": "No momento, o Host não consegue confirmar se esta conversa pode voltar à lista principal. A cópia arquivada não foi alterada. Tente novamente mais tarde.",
			"unarchive.deletionPending": "A exclusão desta conversa ainda está em andamento. Por enquanto, não é possível desarquivá-la. A cópia arquivada foi preservada.",
			"unarchive.pendingUnavailable": "Não foi possível verificar o status da exclusão agora, por isso a conversa não foi desarquivada. A cópia arquivada foi preservada. Tente novamente mais tarde.",
			"chat.delete": "Excluir",
			"chat.deleteArchived": "Excluir conversa arquivada",
			"chat.deleteUnarchived": "Excluir conversa não arquivada",
			"chat.deleteRunning": "Pare esta conversa antes de excluí-la",
			"menu.deleteAllPermanently": "Excluir todas permanentemente",
			"menu.unarchiveAll": "Desarquivar todas",
			"action.deleteAll": "Excluir todas permanentemente",
			"group.collapse": "Recolher",
			"group.expand": "Expandir",
			"confirm.cancel": "Cancelar",
			"chat.deleted": "Exclusão permanente concluída",
			"deletion.incomplete": "Algumas exclusões não foram concluídas. Tente novamente para continuar.",
			"state.loading": "Carregando…",
			"state.empty": "Nenhuma conversa arquivada",
			"state.emptyFiltered": "Nenhuma conversa corresponde aos filtros",
			"state.error": "Não foi possível carregar",
			"state.retry": "Tentar novamente",
			"notice.dismiss": "Fechar aviso",
			"tag.filter": "Todas as etiquetas",
			"tag.edit": "Editar etiquetas e nota",
			"tag.input": "Etiquetas",
			"tag.placeholder": "Digite uma etiqueta e pressione Enter",
			"note.label": "Nota",
			"note.placeholder": "Adicione uma nota (até 2.000 caracteres)",
			"meta.save": "Salvar",
			"meta.saved": "Etiquetas e nota salvas",
			"meta.unavailable": "Os metadados não estão disponíveis. A edição de etiquetas e notas está desativada.",
			"stats.loading": "Calculando o espaço utilizado…",
			"stats.error": "Estatísticas de armazenamento indisponíveis",
			"workspaceArchive.action": "Arquivar conversas",
			"workspaceArchive.chooseTitle": "Escolha um espaço de trabalho",
			"workspaceArchive.chooseBody": "Escolha um ou mais espaços de trabalho cujas conversas você quer arquivar.",
			"workspaceArchive.selectAll": "Selecionar todos",
			"workspaceArchive.chooseConfirm": "Confirmar",
			"workspaceArchive.eligibleCount": "Conversas disponíveis: {count}",
			"workspaceArchive.liveCount": "Conversas em execução: {count}",
			"workspaceArchive.noWorkspaces": "Nenhum espaço de trabalho tem conversas disponíveis para arquivamento.",
			"workspaceArchive.loadError": "Não foi possível carregar os espaços de trabalho. Tente novamente.",
			"workspaceArchive.close": "Fechar a janela de arquivamento do espaço de trabalho",
			"workspaceArchive.loading": "Preparando o arquivamento…",
			"workspaceArchive.skipped": "Conversas ignoradas",
			"workspaceArchive.confirmTitle": "Arquivar todas as conversas deste espaço de trabalho?",
			"workspaceArchive.confirmBody": "As conversas de “{workspace}” serão arquivadas. Depois, você poderá encontrá-las na aba “Arquivadas”, em “Gerenciar arquivamento”.",
			"workspaceArchive.confirmBodyMany": "As conversas dos espaços de trabalho selecionados serão arquivadas. Depois, você poderá encontrá-las na aba “Arquivadas”.",
			"workspaceArchive.skippedLive": "Conversas que serão ignoradas por estarem em execução ou com status não confirmado: {count}.",
			"workspaceArchive.apply": "Confirmar arquivamento",
			"workspaceArchive.applying": "Arquivando…",
			"workspaceArchive.success": "Arquivamento concluído. Total de conversas arquivadas: {count}",
			"workspaceArchive.result": "Resultado do arquivamento por espaço de trabalho",
			"workspaceArchive.archived": "Arquivadas",
			"workspaceArchive.failed": "Falhas",
			"workspaceArchive.done": "Concluir",
			"workspaceArchive.unsupported": "Esta versão do DSH não permite arquivar conversas em lote por espaço de trabalho.",
			"workspaceArchive.error": "Não foi possível concluir o arquivamento em lote por espaço de trabalho. Tente novamente.",
			"workspaceArchive.reason.session-live": "Conversa ignorada: em execução ou com status não confirmado",
			"workspaceArchive.reason.session-archived": "Conversa ignorada: já estava arquivada",
			"workspaceArchive.reason.session-empty": "Sessão ignorada: nova e sem conteúdo",
			"workspaceArchive.reason.session-unavailable": "Conversa ignorada: não foi possível verificar o conteúdo",
			"workspaceArchive.reason.session-workspace-changed": "Conversa ignorada: o espaço de trabalho associado mudou",
			"workspaceArchive.reason.archive-failed": "Falha no arquivamento",
			"workspaceArchive.reason.archive-uncommitted": "O arquivamento não foi concluído",
			"workspaceArchive.reason.lifecycle-failed": "A operação não foi concluída",
			"workspaceArchive.reason.stop-archive-unsupported": "Este Host não permite parar e arquivar a conversa em uma única operação. Primeiro, pare a tarefa na interface oficial.",
			"workspaceArchive.reason.unknown": "Operação não concluída",
			"workspaceArchive.retry": "Preparar novamente",
			"tab.unarchived": "Não arquivadas",
			"unarchived.search": "Pesquisar em títulos, IDs e no conteúdo das conversas",
			"unarchived.empty": "Nenhuma conversa fora do arquivo",
			"unarchived.error": "Não foi possível acessar as conversas não arquivadas. Tente novamente.",
			"unarchived.loading": "Carregando conversas…",
			"unarchived.archiveAll": "Arquivar todas",
			"unarchived.archive": "Arquivar",
			"unarchived.busy": "Em execução",
			"action.refresh": "Atualizar",
			"ui.chatCount.one": "{count} conversa",
			"ui.chatCount.few": "{count} conversas",
			"ui.chatCount.many": "{count} conversas",
			"ui.chatCount.other": "{count} conversas",
			"ui.selectChatLabel": "Selecionar {title}",
			"ui.removeTagLabel": "Remover a tag {tag}",
			"ui.previewJump": "Ir para a mensagem {index}",
			"ui.lineageFrom": "Ramificação de “{title}”",
			"ui.branchCount.one": "{count} ramificação",
			"ui.branchCount.few": "{count} ramificações",
			"ui.branchCount.many": "{count} ramificações",
			"ui.branchCount.other": "{count} ramificações",
			"ui.tagsLimit": "Tags {count}/8, até 24 caracteres cada",
			"ui.noteLimit": "Nota {count}/2000",
			"scope.deletionDetails": "O escopo inclui {selected} conversas selecionadas e {subagents} conversas de subagentes associadas, {total} no total. As ramificações independentes não selecionadas são preservadas.",
			"scope.workspaceArchivedTarget": "todas as {count} conversas arquivadas do espaço “{title}”",
			"scope.workspaceUnarchivedTarget": "todas as {count} conversas não arquivadas do espaço “{title}”",
			"scope.allTarget": "todas as {count} conversas arquivadas em {workspaces} espaços",
			"scope.selectionTarget": "as {count} conversas arquivadas selecionadas",
			"scope.chatTarget": "a conversa “{title}”",
			"scope.deleteArchivedWorkspace": "Excluir todas as conversas arquivadas deste espaço?",
			"scope.deleteUnarchivedWorkspace": "Excluir todas as conversas não arquivadas deste espaço?",
			"scope.deleteAll": "Excluir todas as conversas locais arquivadas?",
			"scope.deleteSelection": "Excluir as conversas arquivadas selecionadas?",
			"scope.deleteArchivedOne": "Excluir a conversa arquivada?",
			"scope.deleteUnarchivedOne": "Excluir a conversa não arquivada?",
			"scope.deleteBody": "Isso excluirá permanentemente {target}. Não é possível desfazer esta ação.",
			"scope.deleteLocalBody": "Isso excluirá permanentemente {target} do armazenamento local. Não é possível desfazer esta ação.",
			"scope.unarchiveWorkspaceTarget": "as conversas arquivadas do espaço “{title}”",
			"scope.unarchiveAllTarget": "as conversas arquivadas de todos os espaços",
			"scope.unarchiveSelectionTarget": "as conversas arquivadas selecionadas",
			"scope.unarchiveWorkspace": "Desarquivar todas as conversas deste espaço?",
			"scope.unarchiveSelection": "Desarquivar as conversas selecionadas?",
			"scope.unarchiveAll": "Desarquivar todas as conversas?",
			"scope.unarchiveBody": "Isso devolve {target} à lista de conversas.",
			"scope.exportWorkspace": "Exportar todas as conversas arquivadas deste espaço?",
			"scope.exportSelection": "Exportar as conversas selecionadas?",
			"scope.exportAll": "Exportar todas as conversas arquivadas?",
			"scope.exportBody": "Isso exporta {target} como backup ZIP sem alterar seu estado de arquivamento. Backups podem conter conteúdo sensível. Guarde-os com segurança.",
			"scope.stopArchiveAll": "Parar e arquivar todas as conversas?",
			"scope.stopArchiveOne": "Parar e arquivar esta conversa?",
			"scope.stopArchiveMany": "Parar e arquivar estas conversas?",
			"scope.archiveAll": "Arquivar todas as conversas?",
			"scope.archiveOne": "Arquivar esta conversa?",
			"scope.archiveSelectedWorkspaces": "Arquivar as conversas dos espaços selecionados?",
			"scope.archiveAllBody": "As conversas de todos os espaços serão arquivadas. Você poderá encontrá-las em “Arquivadas”.",
			"scope.archiveOneBody": "Esta conversa será arquivada. Você poderá encontrá-la em “Arquivadas”.",
			"scope.stopArchiveBody": "O arquivamento interrompe o trabalho em andamento nas conversas selecionadas. Você poderá desarquivá-las depois.",
			"scope.stopArchiveAction": "Parar e arquivar",
			"failure.purge-unsupported": "Este sistema de armazenamento não oferece suporte à exclusão permanente.",
			"failure.restore-unsupported": "Este sistema de armazenamento não pode restaurar esta conversa.",
			"failure.session-live-purge-pending": "A conversa ainda está ativa. Pare-a e tente novamente.",
			"failure.unarchived-delete-running": "Pare a conversa em execução antes de excluí-la.",
			"failure.session-delete-running": "Pare a conversa e seus subagentes antes da exclusão.",
			"failure.deletion-scope-changed": "O escopo da exclusão mudou. Selecione e confirme novamente.",
			"failure.unarchived-delete-changed": "A conversa ou seu espaço mudou. Atualize e tente novamente.",
			"failure.refreshRetry": "Atualize e tente novamente.",
			"failure.operationOne": "Falha na operação em {count} conversa: {reason}",
			"failure.operationMany": "Falha na operação em {count} conversas: {reason}",
			"import.packageFormat": "formato v{version}",
			"import.sessionCount.one": "{count} sessão",
			"import.sessionCount.other": "{count} sessões",
			"preview.footnotes": "Notas de rodapé",
			"preview.process.toolCalls.one": "{count} chamada de ferramenta",
			"preview.process.toolCalls.other": "{count} chamadas de ferramentas",
			"preview.process.messages.one": "{count} mensagem",
			"preview.process.messages.other": "{count} mensagens",
			"preview.process.subagents.one": "{count} subagente",
			"preview.process.subagents.other": "{count} subagentes",
			"preview.process.thought": "Refletiu por um momento",
			"preview.process.incomplete": "Não concluído",
			"preview.anchorMissing": "A mensagem encontrada foi alterada ou está fora do intervalo da prévia. O início da conversa será exibido.",
			"preview.earlier": "Carregar mensagens anteriores",
			"menu.workspaceActions": "Mais ações para o espaço de trabalho · {title}",
			"unarchived.archiveUnavailable": "Arquivamento indisponível",
			"lineage.delegatedBy": "Delegado por “{title}”",
			"import.sessionCount.few": "{count} sessões",
			"import.sessionCount.many": "{count} sessões",
			"preview.process.messages.few": "{count} mensagens",
			"preview.process.messages.many": "{count} mensagens",
			"preview.process.subagents.few": "{count} subagentes",
			"preview.process.subagents.many": "{count} subagentes",
			"preview.process.toolCalls.few": "{count} chamadas de ferramentas",
			"preview.process.toolCalls.many": "{count} chamadas de ferramentas",
			"chat.listChanged": "A lista de conversas mudou. Atualize a lista e selecione novamente.",
			"search.progress": "{status}: conversas verificadas {processed}/{total}, correspondências no conteúdo {hits}, conversas exibidas {displayed}, falhas de leitura {failed}",
			"search.status.loading": "Pesquisando",
			"search.status.ready": "Pesquisa concluída",
			"search.status.partial": "Pesquisa concluída com falhas de leitura",
			"search.status.stopped": "Pesquisa interrompida",
			"search.status.error": "Falha na pesquisa",
			"search.stop": "Interromper pesquisa",
			"search.retryUnfinished": "Pesquisar novamente nas conversas pendentes",
			"search.unreadable": "Conversas que não puderam ser lidas",
			"update.restartNeeded": "É necessário reiniciar",
			"update.view": "Ver atualização",
			"menu.moreArchiveActions": "Mais ações do arquivo",
			"selection.enter": "Selecionar",
			"selection.selectResults": "Selecionar todos os resultados atuais",
			"selection.count": "Seleção: {count}",
			"selection.hiddenCount": "{count} fora dos resultados atuais",
			"selection.moreActions": "Mais ações para a seleção",
			"selection.deletePermanently": "Excluir permanentemente as conversas selecionadas",
			"aboutInfo.author": "Autor",
			"aboutInfo.automaticChecks": "Ao abrir Gerenciar arquivamento, o plugin verifica se há atualizações. Enquanto a página estiver aberta, ele volta a verificar periodicamente e após uma reconexão. Resultados bem-sucedidos ficam em cache por 12 horas. Em caso de falha, a verificação é repetida após 15 minutos. Nenhuma instalação ou reinicialização é feita automaticamente.",
			"aboutInfo.changelog": "Histórico de alterações",
			"aboutInfo.checkUpdates": "Verificar atualizações",
			"aboutInfo.currentVersion": "Versão atual",
			"aboutInfo.description": "Pesquise e organize conversas do DeepSeek Harness, gerencie arquivos, etiquetas e notas, explore as ramificações das conversas e importe ou exporte backups.",
			"aboutInfo.feedback": "Relatar um problema",
			"aboutInfo.home": "Página do projeto",
			"aboutInfo.license": "Licença",
			"aboutInfo.loadFailed": "Não foi possível carregar as informações do plugin. Tente novamente.",
			"aboutInfo.loading": "Carregando informações do plugin…",
			"aboutInfo.localCurrent": "Usando uma cópia local",
			"aboutInfo.marketplace": "Catálogo de plugins",
			"aboutInfo.reload": "Recarregar informações",
			"aboutInfo.reloadInstructions": "Verifique sua conexão com o DSH. Se você acabou de atualizar o plugin, recarregue o backend do DSH e tente novamente. Atualizar apenas a página pode não ativar os novos endpoints.",
			"aboutInfo.starLink": "dar uma ⭐ estrela ao projeto",
			"aboutInfo.starPrompt": "Se o plugin ajudou você a reencontrar trabalhos anteriores, que tal {link}?",
			"aboutInfo.updateAvailable": "A versão {version} está disponível",
			"aboutInfo.updateDetails": "Abra os detalhes da atualização para ver o host atual, copiar os dados de instalação ou instalar a atualização se houver suporte. Os pacotes do registro não podem substituir cópias locais.",
			"aboutInfo.userGuide": "Guia do usuário",
			"aboutInfo.versionHeading": "Versão e atualizações",
			"aboutInfo.versionLoading": "Carregando…",
			"aboutInfo.versionUnavailable": "Indisponível",
			"updateUi.applied": "O host aplicou a v{version}. Reabra Gerenciar arquivamento para conferir a versão em execução.",
			"updateUi.available": "A versão {version} está disponível",
			"updateUi.bundledCommand": "Este comando usa o executável dsh incluído no aplicativo para desktop atual.",
			"updateUi.checkAgain": "Verificar novamente",
			"updateUi.checking": "Verificando atualizações…",
			"updateUi.close": "Fechar",
			"updateUi.copied": "Copiado",
			"updateUi.copyCommand": "Copiar comando de atualização",
			"updateUi.copyFailed": "Falha ao copiar. Selecione o texto e copie manualmente.",
			"updateUi.copyLocalPath": "Copiar caminho local",
			"updateUi.copyPackage": "Copiar nome do pacote e versão",
			"updateUi.current": "Você está usando a versão mais recente",
			"updateUi.currentEnvironment": "Ambiente atual",
			"updateUi.environmentCli": "Host DSH atual",
			"updateUi.environmentDesktop": "Aplicativo oficial para desktop",
			"updateUi.environmentUnknown": "Host não reconhecido",
			"updateUi.errorAlreadyApplied": "O host já aplicou a atualização. Reabra Gerenciar arquivamento para conferir a versão em execução.",
			"updateUi.errorHostManaged": "Use o gerenciador de plugins do host para atualizar. Siga as instruções abaixo.",
			"updateUi.errorLocalInstall": "Agora está em uso uma cópia local. A substituição pelo pacote do registro foi bloqueada.",
			"updateUi.errorRestoreFailed": "A atualização falhou e não foi possível confirmar a restauração da versão anterior. Confira a página oficial de plugins e reinstale o plugin.",
			"updateUi.errorRestored": "A atualização falhou e o gerenciador oficial de plugins restaurou a versão anterior. Reabra Gerenciar arquivamento para conferir.",
			"updateUi.errorUnverified": "Não foi possível confirmar a conclusão da atualização. Reabra esta página para verificar o estado. Se necessário, consulte a página de plugins do host ou use o comando abaixo.",
			"updateUi.errorVersionChanged": "As informações da versão mudaram. Verifique novamente antes de atualizar.",
			"updateUi.externalInstructions": "Este plugin foi instalado de uma fonte externa. Use a mesma fonte para atualizar. Use as informações abaixo para instalar uma versão pública em outro ambiente.",
			"updateUi.install": "Instalar atualização",
			"updateUi.installInstructions": "Em “Instalar atualização”, o gerenciador oficial de plugins verifica a compatibilidade e substitui o plugin. Esta página pode fechar durante o processo. Reabra Gerenciar arquivamento para conferir a versão. Se for preciso reiniciar, um aviso será exibido.",
			"updateUi.installing": "Instalando…",
			"updateUi.installingThroughHost": "Instalando a atualização pelo host…",
			"updateUi.lastChecked": "Última verificação",
			"updateUi.localCheckout": "Cópia local",
			"updateUi.localCurrent": "A cópia local está conectada. As informações da versão pública aparecem abaixo.",
			"updateUi.localInstructions": "Esta cópia local não pode ser substituída por pacotes do registro. Reinicie o DSH depois de editar. Para usá-la em outro host, cole o caminho abaixo em “Adicionar plugin”.",
			"updateUi.manualInstructions": "Encontre Gerenciar arquivamento na página oficial de plugins e atualize na seção “Versões”. Em hosts antigos, siga as instruções de reinstalação. Você também pode adicionar o pacote abaixo em outro host.",
			"updateUi.previousPublicRelease": "v{version} (verificação anterior)",
			"updateUi.privacy": "As verificações automáticas só consultam os metadados públicos do npm e não enviam conversas. Elas não instalam atualizações nem reiniciam o DSH.",
			"updateUi.publicRelease": "Versão pública",
			"updateUi.restartRequired": "A v{version} foi instalada. Reinicie o DSH e confira a versão em execução.",
			"updateUi.runningVersion": "Versão em execução",
			"updateUi.terminalCommand": "Comando de atualização no terminal",
			"updateUi.terminalDesktopInstructions": "Você também pode fechar completamente o aplicativo para desktop do DSH e executar este comando no mesmo computador.",
			"updateUi.terminalHostInstructions": "Você também pode encerrar o host atual do DSH e executar este comando no mesmo computador.",
			"updateUi.title": "Atualização do plugin",
			"updateUi.unavailable": "Falha ao verificar atualizações. Tente novamente mais tarde.",
			"updateUi.unchecked": "Ainda não foi feita uma verificação de atualizações",
		};

		const ru = {
			"locale.intl": "ru-RU",
			"nav": "Управление архивом",
			"page.title": "Управление архивом",
			"page.description": "Просмотр архивных чатов, поиск по ним и управление архивом",
			"tab.archived": "В архиве",
			"archive.viewArchived": "Открыть архив",
			"chat.deletionUnverified": "Не удалось проверить статус удаления. Попробуйте позже.",
			"tab.lineage": "Источники и ветви",
			"tab.about": "О плагине",
			"about.updateAvailable": "Доступно обновление",
			"help.label": "Справка: {label}",
			"archive.view": "Посмотреть",
			"lineage.origin.subagent": "Субагент",
			"lineage.origin.fork": "Ответвление",
			"lineage.origin.root": "Исходный чат",
			"lineage.origin.unknown": "Источник неизвестен",
			"lineage.copyId": "Скопировать ID",
			"lineage.copiedId": "Скопировано",
			"lineage.loading": "Загрузка источников и ветвей…",
			"lineage.error": "Не удалось загрузить источники и ветви",
			"lineage.scopeNote": "Здесь показаны источники и ветви чатов из всех рабочих пространств на этом Host — как в архиве, так и вне его. Фильтр по статусу действует только на список: на схеме всегда видны все связанные чаты. Повторные ссылки на один и тот же источник не учитываются.",
			"lineage.search": "Поиск по названиям чатов, рабочим пространствам и ID",
			"lineage.projectFilter": "Фильтр по проекту",
			"lineage.statusFilter": "Фильтр по статусу",
			"lineage.statusAll": "Все статусы",
			"lineage.managedHeading": "Связи между чатами",
			"lineage.relatedWorkspaces": "Все рабочие пространства",
			"lineage.noArchives": "Нет чатов",
			"lineage.managedCount": "в группе",
			"lineage.totalCount": "Всего чатов: {count}",
			"lineage.resultCount": "Найдено чатов: {count}",
			"lineage.expandAll": "Развернуть всё",
			"lineage.collapseAll": "Свернуть всё",
			"lineage.searchFoldHint": "При фильтрации рабочие пространства с подходящими чатами остаются развёрнутыми",
			"lineage.empty": "Нет подходящих чатов",
			"lineage.workspaceEmpty": "Нет чатов",
			"lineage.trackingUnavailable": "Отслеживание источников недоступно. Источники некоторых новых ветвей могли не сохраниться.",
			"lineage.deletionUnavailable": "Статус удаления недоступен. Не удалось проверить чаты, ожидающие удаления.",
			"lineage.status.active": "Вне архива",
			"lineage.status.archived": "В архиве",
			"lineage.status.missing": "Источник недоступен",
			"lineage.untitled": "Чат без названия",
			"lineage.sourceUnavailable": "Нет сведений об источнике",
			"lineage.sourceContext": "Источник",
			"lineage.contextOnly": "Показан только как источник",
			"lineage.searchMatch": "Соответствует запросу",
			"lineage.independent": "Независимый чат",
			"lineage.sourceUnrecorded": "Исходный чат не указан",
			"lineage.sourceUnrecordedHint": "Этот чат унаследовал историю другого чата, но сведений об исходном чате нет. Поэтому связь между ними не показана. Содержимое этого чата по-прежнему доступно.",
			"lineage.view.open": "Связи чата",
			"lineage.view.title": "Схема связей между чатами",
			"lineage.view.close": "Закрыть схему связей между чатами",
			"lineage.view.pan": "Схема связей. Перетаскивайте фон или прокручивайте схему для перемещения",
			"lineage.view.enlarge": "Развернуть схему",
			"lineage.view.restore": "Вернуться на страницу",
			"lineage.view.zoomIn": "Увеличить",
			"lineage.view.zoomOut": "Уменьшить",
			"lineage.view.zoom": "Масштаб",
			"lineage.view.fit": "Показать схему целиком",
			"lineage.view.hint": "Перетаскивайте фон для перемещения · Ctrl/⌘ + колесо мыши для изменения масштаба · Нажмите на название для просмотра",
			"lineage.view.nodes": "узл.",
			"lineage.view.connections": "связ.",
			"lineage.searchRelated": "Связанная ветвь",
			"lineage.start": "Начальный чат",
			"lineage.created": "Создан",
			"lineage.project": "Проект",
			"lineage.delegation": "Уровень делегирования",
			"lineage.noBranches": "Нет ветвей",
			"lineage.crossWorkspace": "Исходное рабочее пространство",
			"lineage.sourceId": "ID источника",
			"lineage.diagnostic.missing-parent": "Родительский чат не найден",
			"lineage.diagnostic.missing-parent.detail": "Сведения об источнике родительского чата недоступны",
			"lineage.diagnostic.self-parent": "Чат указан как собственный родитель",
			"lineage.diagnostic.cycle": "Обнаружена циклическая связь",
			"lineage.diagnostic.delegation-depth-mismatch": "Уровни делегирования не совпадают",
			"action.import": "Импортировать резервную копию",
			"action.export": "Экспортировать все чаты",
			"import.title": "Импорт резервной копии архивных чатов",
			"import.inspecting": "Проверка резервной копии…",
			"import.preview": "Проверьте список чатов перед восстановлением",
			"import.package": "Сведения о резервной копии",
			"import.confirm": "Восстановить выбранные чаты",
			"import.cancel": "Отмена",
			"import.close": "Закрыть",
			"import.selectAll": "Выбрать все доступные для восстановления",
			"import.clear": "Снять выделение",
			"import.conflict": "ID уже занят. Чат будет пропущен",
			"import.workspaceWarning": "Рабочее пространство не найдено. Чат останется без группы",
			"import.cwdUnsupported": "Путь к рабочей папке несовместим с этой системой или не определяется однозначно. Сохраните исходный ZIP-файл и проверьте, какая в нём указана папка. Сопоставление папок не поддерживается.",
			"import.cwdInvalid": "В резервной копии указан недопустимый путь к рабочей папке. Восстановление невозможно. Сохраните исходный ZIP-файл и проверьте его источник.",
			"import.attachmentWarning": "Найдены ссылки на вложения. Сами файлы не будут восстановлены",
			"import.restored": "Восстановлено",
			"import.skipped": "Пропущено",
			"import.expired": "Срок действия предпросмотра истёк. Выберите резервную копию ещё раз.",
			"import.done": "Восстановление из резервной копии завершено",
			"import.unsupported": "Эта версия Host не может восстановить резервную копию без потерь. Сохраните ZIP-файл и проверьте совместимость с Host.",
			"import.rollbackFailed": "Восстановление не завершено. Не все изменения удалось безопасно отменить. Затронутые файлы сохранены. Сохраните ZIP-файл и выясните причину сбоя, прежде чем повторять попытку. Не удаляйте чаты с конфликтующими ID.",
			"import.conflictChanged": "Выбранные чаты уже существуют или всё ещё ожидают удаления. Существующие данные не были перезаписаны. Выберите резервную копию ещё раз и проверьте список чатов.",
			"import.titlePublicationDegraded": "Чат восстановлен, его данные в сохранности. Название может не появиться в основном списке, пока вы не откроете чат.",
			"import.seededTitleLimitation": "Чат восстановлен, его данные в сохранности. При холодном запуске эта версия Host не может показать в списке название ответвлённого чата. Откройте чат, и название отобразится как обычно.",
			"export.all": "Экспортировать все чаты",
			"menu.workspaceScope": "Это рабочее пространство",
			"menu.allWorkspaces": "Все рабочие пространства",
			"export.selected": "Экспортировать выбранные чаты",
			"menu.row": "Другие действия с чатом",
			"export.started": "Началось скачивание резервной копии",
			"export.failed": "Не удалось экспортировать резервную копию. Приложение остаётся открытым. Обновите список и попробуйте ещё раз.",
			"export.tooLarge": "Чат {id} превышает допустимый размер, поэтому его нельзя включить в резервную копию, пригодную для импорта. Снимите выделение с этого чата и попробуйте ещё раз.",
			"export.sourceInvalid": "Не удалось создать резервную копию: источник данных для экспорта недействителен.",
			"export.timeout": "Время ожидания экспорта истекло. Неполный файл не был скачан. Попробуйте позже.",
			"search.placeholder": "Поиск по названиям, тегам, заметкам и содержимому чатов",
			"workspaceArchive.reason.session-ineligible": "Чат больше нельзя архивировать. Он пропущен",
			"search.contentMatch": "Совпадение в переписке",
			"preview.open": "Посмотреть переписку",
			"preview.close": "Закрыть предпросмотр",
			"preview.loading": "Загрузка переписки…",
			"preview.error": "Не удалось загрузить переписку для просмотра",
			"preview.empty": "В этом архивном чате нет сообщений, доступных для просмотра",
			"preview.more": "Загрузить ещё",
			"preview.timeline": "Хронология переписки",
			"preview.user": "Пользователь",
			"preview.assistant": "Ассистент",
			"preview.tool": "Инструмент",
			"preview.system": "Системная инструкция",
			"preview.context": "Добавленный контекст",
			"preview.reasoning": "Рассуждения",
			"preview.toolCall": "Вызов инструмента",
			"preview.toolResult": "Результат работы инструмента",
			"preview.toolArguments": "Аргументы",
			"preview.json": "JSON",
			"preview.unknown": "Неизвестное содержимое",
			"preview.copy": "Скопировать",
			"preview.copied": "Скопировано",
			"preview.copyError": "Не удалось скопировать. Разрешите доступ к буферу обмена и попробуйте ещё раз.",
			"preview.imageUnavailable": "Изображение недоступно",
			"preview.readOnly": "Просмотр без редактирования",
			"filter.allChats": "Все чаты",
			"filter.type": "Тип",
			"filter.normal": "Обычные чаты",
			"filter.subagent": "Чаты субагентов",
			"filter.allProjects": "Все рабочие пространства",
			"filter.scheduled": "Задачи автоматизации",
			"filter.scheduleUnsupported": "На этом Host задачи автоматизации не включены",
			"filter.scheduleUnavailable": "Задачи автоматизации недоступны. Обновите список, чтобы попробовать ещё раз.",
			"sort.label": "Порядок сортировки",
			"sort.newest": "Сначала недавно обновлённые",
			"sort.oldest": "Сначала давно не обновлявшиеся",
			"sort.title": "По названию",
			"group.noProject": "Без группы",
			"group.defaultWorkspace": "Рабочее пространство по умолчанию",
			"chat.untitled": "Чат без названия",
			"chat.unarchive": "Вернуть из архива",
			"unarchive.cwdMissing": "У чата нет рабочей папки, поэтому Host не может вернуть его в основной список. Архивная копия сохранена и доступна для просмотра и экспорта.",
			"unarchive.authorityUnavailable": "Сейчас Host не может подтвердить, что чат можно вернуть в основной список. Архивная копия не изменена. Попробуйте позже.",
			"unarchive.deletionPending": "Удаление этого чата ещё не завершено, поэтому вернуть его из архива пока нельзя. Архивная копия сохранена.",
			"unarchive.pendingUnavailable": "Сейчас не удаётся проверить статус удаления, поэтому чат остался в архиве. Архивная копия сохранена. Попробуйте позже.",
			"chat.delete": "Удалить",
			"chat.deleteArchived": "Удалить архивный чат",
			"chat.deleteUnarchived": "Удалить чат вне архива",
			"chat.deleteRunning": "Перед удалением остановите чат",
			"menu.deleteAllPermanently": "Удалить все чаты навсегда",
			"menu.unarchiveAll": "Вернуть все чаты из архива",
			"action.deleteAll": "Удалить все чаты навсегда",
			"group.collapse": "Свернуть",
			"group.expand": "Развернуть",
			"confirm.cancel": "Отмена",
			"chat.deleted": "Удалено навсегда",
			"deletion.incomplete": "Не все чаты удалось удалить. Чтобы продолжить удаление, повторите попытку.",
			"state.loading": "Загрузка…",
			"state.empty": "В архиве нет чатов",
			"state.emptyFiltered": "Подходящих чатов не найдено",
			"state.error": "Не удалось загрузить данные",
			"state.retry": "Повторить попытку",
			"notice.dismiss": "Скрыть уведомление",
			"tag.filter": "Все теги",
			"tag.edit": "Изменить теги и заметку",
			"tag.input": "Теги",
			"tag.placeholder": "Введите тег и нажмите Enter",
			"note.label": "Заметка",
			"note.placeholder": "Добавьте заметку (до 2 000 символов)",
			"meta.save": "Сохранить",
			"meta.saved": "Теги и заметка сохранены",
			"meta.unavailable": "Метаданные недоступны. Изменение тегов и заметок отключено.",
			"stats.loading": "Расчёт занятого места…",
			"stats.error": "Статистика использования места недоступна",
			"workspaceArchive.action": "Архивировать чаты",
			"workspaceArchive.chooseTitle": "Выбор рабочего пространства",
			"workspaceArchive.chooseBody": "Выберите одно или несколько рабочих пространств, чаты из которых нужно архивировать.",
			"workspaceArchive.selectAll": "Выбрать все",
			"workspaceArchive.chooseConfirm": "Подтвердить",
			"workspaceArchive.eligibleCount": "Чатов для архивации: {count}",
			"workspaceArchive.liveCount": "Запущено чатов: {count}",
			"workspaceArchive.noWorkspaces": "Нет рабочих пространств с чатами, доступными для архивации.",
			"workspaceArchive.loadError": "Не удалось загрузить рабочие пространства. Попробуйте ещё раз.",
			"workspaceArchive.close": "Закрыть окно архивации чатов рабочего пространства",
			"workspaceArchive.loading": "Подготовка к архивации…",
			"workspaceArchive.skipped": "Пропущенные чаты",
			"workspaceArchive.confirmTitle": "Архивировать все чаты в этом рабочем пространстве?",
			"workspaceArchive.confirmBody": "Чаты из рабочего пространства «{workspace}» будут перемещены в архив. Вы найдёте их на вкладке «В архиве» в разделе «Управление архивом».",
			"workspaceArchive.confirmBodyMany": "Чаты из выбранных рабочих пространств будут перемещены в архив. Вы найдёте их на вкладке «В архиве».",
			"workspaceArchive.skippedLive": "Запущенные чаты и чаты с неподтверждённым статусом будут пропущены. Всего таких чатов: {count}.",
			"workspaceArchive.apply": "Подтвердить архивацию",
			"workspaceArchive.applying": "Архивация…",
			"workspaceArchive.success": "Архивация завершена. Чатов перемещено в архив: {count}",
			"workspaceArchive.result": "Результат архивации чатов рабочего пространства",
			"workspaceArchive.archived": "В архиве",
			"workspaceArchive.failed": "Не удалось архивировать",
			"workspaceArchive.done": "Готово",
			"workspaceArchive.unsupported": "Эта версия DSH не поддерживает массовую архивацию чатов рабочего пространства.",
			"workspaceArchive.error": "Не удалось завершить массовую архивацию чатов рабочего пространства. Попробуйте ещё раз.",
			"workspaceArchive.reason.session-live": "Чат запущен или его статус не подтверждён. Чат пропущен",
			"workspaceArchive.reason.session-archived": "Чат уже в архиве. Он пропущен",
			"workspaceArchive.reason.session-empty": "В новом чате нет сообщений. Чат пропущен",
			"workspaceArchive.reason.session-unavailable": "Не удалось проверить содержимое чата. Чат пропущен",
			"workspaceArchive.reason.session-workspace-changed": "Чат больше не относится к этому рабочему пространству. Он пропущен",
			"workspaceArchive.reason.archive-failed": "Не удалось архивировать чат",
			"workspaceArchive.reason.archive-uncommitted": "Архивация не завершена",
			"workspaceArchive.reason.lifecycle-failed": "Операция не завершена",
			"workspaceArchive.reason.stop-archive-unsupported": "Этот Host не поддерживает архивацию с остановкой чата. Сначала остановите задачу в официальном интерфейсе.",
			"workspaceArchive.reason.unknown": "Не завершено",
			"workspaceArchive.retry": "Подготовить заново",
			"tab.unarchived": "Вне архива",
			"unarchived.search": "Поиск по названиям, ID и содержимому чатов",
			"unarchived.empty": "Нет чатов вне архива",
			"unarchived.error": "Чаты вне архива недоступны. Попробуйте ещё раз.",
			"unarchived.loading": "Загрузка чатов…",
			"unarchived.archiveAll": "Архивировать все чаты",
			"unarchived.archive": "Архивировать",
			"unarchived.busy": "Запущен",
			"action.refresh": "Обновить",
			"ui.chatCount.one": "{count} чат",
			"ui.chatCount.few": "{count} чата",
			"ui.chatCount.many": "{count} чатов",
			"ui.chatCount.other": "{count} чатов",
			"ui.selectChatLabel": "Выбрать «{title}»",
			"ui.removeTagLabel": "Удалить тег «{tag}»",
			"ui.previewJump": "Перейти к сообщению {index}",
			"ui.lineageFrom": "Ветка от «{title}»",
			"ui.branchCount.one": "{count} ветка",
			"ui.branchCount.few": "{count} ветки",
			"ui.branchCount.many": "{count} веток",
			"ui.branchCount.other": "{count} веток",
			"ui.tagsLimit": "Теги {count}/8, до 24 символов каждый",
			"ui.noteLimit": "Заметка {count}/2000",
			"scope.deletionDetails": "В область удаления входят выбранные чаты ({selected}) и связанные чаты субагентов ({subagents}), всего {total}. Независимые ветки вне выбора сохраняются.",
			"scope.workspaceArchivedTarget": "все архивные чаты ({count}) рабочего пространства «{title}»",
			"scope.workspaceUnarchivedTarget": "все неархивные чаты ({count}) рабочего пространства «{title}»",
			"scope.allTarget": "все архивные чаты ({count}) во всех рабочих пространствах ({workspaces})",
			"scope.selectionTarget": "выбранные архивные чаты ({count})",
			"scope.chatTarget": "чат «{title}»",
			"scope.deleteArchivedWorkspace": "Удалить все архивные чаты этого рабочего пространства?",
			"scope.deleteUnarchivedWorkspace": "Удалить все неархивные чаты этого рабочего пространства?",
			"scope.deleteAll": "Удалить все локальные архивные чаты?",
			"scope.deleteSelection": "Удалить выбранные архивные чаты?",
			"scope.deleteArchivedOne": "Удалить архивный чат?",
			"scope.deleteUnarchivedOne": "Удалить неархивный чат?",
			"scope.deleteBody": "Будут безвозвратно удалены {target}. Отменить это действие нельзя.",
			"scope.deleteLocalBody": "Будут безвозвратно удалены локальные {target}. Отменить это действие нельзя.",
			"scope.unarchiveWorkspaceTarget": "архивные чаты рабочего пространства «{title}»",
			"scope.unarchiveAllTarget": "архивные чаты всех рабочих пространств",
			"scope.unarchiveSelectionTarget": "выбранные архивные чаты",
			"scope.unarchiveWorkspace": "Разархивировать все чаты этого рабочего пространства?",
			"scope.unarchiveSelection": "Разархивировать выбранные чаты?",
			"scope.unarchiveAll": "Разархивировать все чаты?",
			"scope.unarchiveBody": "Будут возвращены в список чатов {target}.",
			"scope.exportWorkspace": "Экспортировать все архивные чаты этого рабочего пространства?",
			"scope.exportSelection": "Экспортировать выбранные чаты?",
			"scope.exportAll": "Экспортировать все архивные чаты?",
			"scope.exportBody": "Будет создана резервная копия ZIP для {target}. Статус архива не изменится. В копиях могут быть конфиденциальные данные. Храните их в безопасном месте.",
			"scope.stopArchiveAll": "Остановить и архивировать все чаты?",
			"scope.stopArchiveOne": "Остановить и архивировать этот чат?",
			"scope.stopArchiveMany": "Остановить и архивировать эти чаты?",
			"scope.archiveAll": "Архивировать все чаты?",
			"scope.archiveOne": "Архивировать этот чат?",
			"scope.archiveSelectedWorkspaces": "Архивировать чаты в выбранных рабочих пространствах?",
			"scope.archiveAllBody": "Чаты во всех рабочих пространствах будут архивированы. Их можно найти на вкладке «Архив».",
			"scope.archiveOneBody": "Этот чат будет архивирован. Его можно найти на вкладке «Архив».",
			"scope.stopArchiveBody": "Архивация остановит выполнение задач в выбранных чатах. Позднее чаты можно разархивировать.",
			"scope.stopArchiveAction": "Остановить и архивировать",
			"failure.purge-unsupported": "Это хранилище не поддерживает окончательное удаление.",
			"failure.restore-unsupported": "В этом хранилище нельзя восстановить этот чат.",
			"failure.session-live-purge-pending": "Чат активен. Остановите его и повторите попытку.",
			"failure.unarchived-delete-running": "Остановите выполняющийся чат перед удалением.",
			"failure.session-delete-running": "Остановите чат и его субагентов перед удалением.",
			"failure.deletion-scope-changed": "Область удаления изменилась. Повторите выбор и подтверждение.",
			"failure.unarchived-delete-changed": "Чат или рабочее пространство изменились. Обновите и повторите попытку.",
			"failure.refreshRetry": "Обновите и повторите попытку.",
			"failure.operationOne": "Не удалось обработать чаты ({count}): {reason}",
			"failure.operationMany": "Не удалось обработать чаты ({count}): {reason}",
			"import.packageFormat": "формат v{version}",
			"import.sessionCount.one": "{count} сеанс",
			"import.sessionCount.few": "{count} сеанса",
			"import.sessionCount.many": "{count} сеансов",
			"import.sessionCount.other": "{count} сеанса",
			"preview.footnotes": "Сноски",
			"preview.process.toolCalls.one": "{count} вызов инструмента",
			"preview.process.toolCalls.few": "{count} вызова инструментов",
			"preview.process.toolCalls.many": "{count} вызовов инструментов",
			"preview.process.toolCalls.other": "{count} вызова инструментов",
			"preview.process.messages.one": "{count} сообщение",
			"preview.process.messages.few": "{count} сообщения",
			"preview.process.messages.many": "{count} сообщений",
			"preview.process.messages.other": "{count} сообщения",
			"preview.process.subagents.one": "{count} субагент",
			"preview.process.subagents.few": "{count} субагента",
			"preview.process.subagents.many": "{count} субагентов",
			"preview.process.subagents.other": "{count} субагента",
			"preview.process.thought": "Обдумывание завершено",
			"preview.process.incomplete": "Не завершено",
			"preview.anchorMissing": "Найденное сообщение изменилось или находится за пределами предпросмотра. Показано начало чата.",
			"preview.earlier": "Загрузить более ранние сообщения",
			"menu.workspaceActions": "Другие действия с рабочим пространством · {title}",
			"unarchived.archiveUnavailable": "Архивация недоступна",
			"lineage.delegatedBy": "Делегировано чатом «{title}»",
			"chat.listChanged": "Список чатов изменился. Обновите его и повторите выбор.",
			"search.progress": "{status}: проверено чатов {processed}/{total}, найдено по содержимому {hits}, показано {displayed}, не удалось прочитать {failed}",
			"search.status.loading": "Идёт поиск",
			"search.status.ready": "Поиск завершён",
			"search.status.partial": "Поиск завершён, часть чатов не удалось прочитать",
			"search.status.stopped": "Поиск остановлен",
			"search.status.error": "Ошибка поиска",
			"search.stop": "Остановить поиск",
			"search.retryUnfinished": "Повторить поиск в оставшихся чатах",
			"search.unreadable": "Чаты, которые не удалось прочитать",
			"update.restartNeeded": "Требуется перезапуск",
			"update.view": "Посмотреть обновление",
			"menu.moreArchiveActions": "Другие действия с архивом",
			"selection.enter": "Выбрать",
			"selection.selectResults": "Выбрать все текущие результаты",
			"selection.count": "Выбрано: {count}",
			"selection.hiddenCount": "За пределами текущих результатов: {count}",
			"selection.moreActions": "Другие действия с выбранными чатами",
			"selection.deletePermanently": "Удалить выбранные чаты навсегда",
			"aboutInfo.author": "Автор",
			"aboutInfo.automaticChecks": "Проверка обновлений запускается при открытии раздела «Управление архивом». Пока страница открыта, проверка повторяется периодически и при восстановлении подключения. Результаты успешной проверки хранятся 12 часов. Если проверка завершилась ошибкой, она повторится через 15 минут. Установка и перезапуск автоматически не выполняются.",
			"aboutInfo.changelog": "Список изменений",
			"aboutInfo.checkUpdates": "Проверить обновления",
			"aboutInfo.currentVersion": "Текущая версия",
			"aboutInfo.description": "Ищите и упорядочивайте чаты DeepSeek Harness, управляйте архивами, метками и заметками, просматривайте связи между чатами и импортируйте или экспортируйте резервные копии.",
			"aboutInfo.feedback": "Сообщить о проблеме",
			"aboutInfo.home": "Страница проекта",
			"aboutInfo.license": "Лицензия",
			"aboutInfo.loadFailed": "Не удалось загрузить сведения о плагине. Попробуйте ещё раз.",
			"aboutInfo.loading": "Загрузка сведений о плагине…",
			"aboutInfo.localCurrent": "Используется локальная копия",
			"aboutInfo.marketplace": "Каталог плагинов",
			"aboutInfo.reload": "Загрузить сведения заново",
			"aboutInfo.reloadInstructions": "Проверьте подключение к DSH. Если вы только что обновили плагин, перезагрузите серверную часть DSH и попробуйте ещё раз. Простое обновление страницы может не активировать новые API-методы.",
			"aboutInfo.starLink": "поставьте проекту ⭐",
			"aboutInfo.starPrompt": "Если плагин помог вам найти прежние наработки, {link}.",
			"aboutInfo.updateAvailable": "Доступна версия {version}",
			"aboutInfo.updateDetails": "Откройте сведения об обновлении, чтобы узнать текущую среду, скопировать данные для установки или установить обновление, если среда это поддерживает. Локальные копии не заменяются пакетами из реестра.",
			"aboutInfo.userGuide": "Руководство пользователя",
			"aboutInfo.versionHeading": "Версия и обновления",
			"aboutInfo.versionLoading": "Загрузка…",
			"aboutInfo.versionUnavailable": "Недоступна",
			"updateUi.applied": "Среда DSH применила v{version}. Снова откройте раздел «Управление архивом», чтобы проверить запущенную версию.",
			"updateUi.available": "Доступна версия {version}",
			"updateUi.bundledCommand": "Команда использует dsh, встроенный в текущее настольное приложение.",
			"updateUi.checkAgain": "Проверить ещё раз",
			"updateUi.checking": "Проверка обновлений…",
			"updateUi.close": "Закрыть",
			"updateUi.copied": "Скопировано",
			"updateUi.copyCommand": "Копировать команду обновления",
			"updateUi.copyFailed": "Не удалось скопировать. Выделите текст и скопируйте его вручную.",
			"updateUi.copyLocalPath": "Копировать локальный путь",
			"updateUi.copyPackage": "Копировать имя и версию пакета",
			"updateUi.current": "Установлена последняя версия",
			"updateUi.currentEnvironment": "Текущая среда",
			"updateUi.environmentCli": "Текущая среда DSH",
			"updateUi.environmentDesktop": "Официальное настольное приложение",
			"updateUi.environmentUnknown": "Неизвестная среда",
			"updateUi.errorAlreadyApplied": "Среда DSH уже применила обновление. Снова откройте раздел «Управление архивом», чтобы проверить запущенную версию.",
			"updateUi.errorHostManaged": "Обновите плагин через менеджер плагинов DSH, следуя инструкциям ниже.",
			"updateUi.errorLocalInstall": "Теперь используется локальная копия. Замена пакетом из реестра заблокирована.",
			"updateUi.errorRestoreFailed": "Обновление не удалось, и подтвердить восстановление прежней версии не получилось. Проверьте состояние на официальной странице плагинов и переустановите плагин.",
			"updateUi.errorRestored": "Обновление не удалось, и официальный менеджер плагинов восстановил прежнюю версию. Снова откройте раздел «Управление архивом», чтобы проверить её.",
			"updateUi.errorUnverified": "Не удалось подтвердить, что обновление завершилось. Снова откройте эту страницу, чтобы проверить состояние. При необходимости проверьте ошибки на странице плагинов DSH или воспользуйтесь командой ниже.",
			"updateUi.errorVersionChanged": "Сведения о версии изменились. Проверьте их ещё раз перед обновлением.",
			"updateUi.externalInstructions": "Плагин установлен из внешнего источника. Обновите его из того же источника. Сведения ниже помогут установить публичную версию в другой среде.",
			"updateUi.install": "Установить обновление",
			"updateUi.installInstructions": "Кнопка «Установить обновление» запускает проверку совместимости и замену плагина через официальный менеджер плагинов. Страница может закрыться во время замены. Снова откройте раздел «Управление архивом», чтобы проверить версию. Если потребуется перезапуск, появится уведомление.",
			"updateUi.installing": "Установка…",
			"updateUi.installingThroughHost": "Установка обновления через DSH…",
			"updateUi.lastChecked": "Последняя проверка",
			"updateUi.localCheckout": "Локальная копия",
			"updateUi.localCurrent": "Локальная копия подключена. Ниже приведены сведения о публичной версии.",
			"updateUi.localInstructions": "Локальная копия защищена от замены пакетом из реестра. После изменений перезапустите DSH. Чтобы подключить её в другой среде, вставьте путь ниже в поле «Добавить плагин».",
			"updateUi.manualInstructions": "Найдите «Управление архивом» на официальной странице плагинов и обновите его в разделе «Версии». В старых выпусках DSH следуйте инструкциям по переустановке. Указанный ниже пакет также можно добавить в другой среде.",
			"updateUi.previousPublicRelease": "v{version} (предыдущая проверка)",
			"updateUi.privacy": "Автоматическая проверка читает только общедоступные метаданные npm и не отправляет чаты. Она не устанавливает обновления и не перезапускает DSH.",
			"updateUi.publicRelease": "Публичная версия",
			"updateUi.restartRequired": "Версия v{version} установлена. Перезапустите DSH и проверьте запущенную версию.",
			"updateUi.runningVersion": "Запущенная версия",
			"updateUi.terminalCommand": "Команда обновления в терминале",
			"updateUi.terminalDesktopInstructions": "Можно также полностью закрыть настольное приложение DSH и выполнить эту команду на том же компьютере.",
			"updateUi.terminalHostInstructions": "Можно также завершить работу текущей среды DSH и выполнить эту команду на том же компьютере.",
			"updateUi.title": "Обновление плагина",
			"updateUi.unavailable": "Не удалось проверить обновления. Попробуйте позже.",
			"updateUi.unchecked": "Обновления ещё не проверялись",
		};
		const dictionaries = { zh, en, de, es, fr, ja, pt, ru };
		//#endregion

		//#region localized compositors (interpolation stays in JS)
		const isZh = (t) => t("locale.intl").startsWith("zh");
		function countLabel(t, key, count) {
			let form;
			try {
				form = new Intl.PluralRules(t("locale.intl")).select(count);
			} catch {
				form = count === 1 ? "one" : "other";
			}
			const localized = `${key}.${form}`;
			const label = t(localized, { count });
			return label === localized ? t(`${key}.other`, { count }) : label;
		}
		const chatsCount = (t, count) => countLabel(t, "ui.chatCount", count);
        function deletionScopeText(t, plan) {
            return t("scope.deletionDetails", {
                selected: plan.selectedCount,
                subagents: plan.subagentCount,
                total: plan.total,
            });
        }
        async function previewDeletion(items, source = "archive", send = post) {
            const request = { source, sessions: items.map(row => ({ sessionId: row.id, createdAt: row.createdAt,
                ...(source === "unarchived" ? { workspaceId: row.workspaceId ?? null } : {}) })) };
            const { plan } = await send("/deletion/preview", request);
            if (!plan || typeof plan.fingerprint !== "string" || !Array.isArray(plan.targets)
                || plan.total !== plan.targets.length || plan.selectedCount !== items.length
                || !Number.isSafeInteger(plan.subagentCount) || plan.subagentCount < 0
                || plan.total !== plan.selectedCount + plan.subagentCount) throw new Error("Invalid deletion preview");
            return { request, plan };
        }
        const executeDeletion = (preview, send = post) => send("/deletion/execute", {
            ...preview.request, fingerprint: preview.plan.fingerprint, permanent: true,
        });
        function deletionFailureNotice(result, text, onRetry) {
            const targets = (Array.isArray(result?.retryTargets) ? result.retryTargets : [])
                .filter(row => typeof row?.sessionId === "string" && row.sessionId !== ""
                    && typeof row.taskId === "string" && row.taskId !== "")
                .map(row => ({ sessionId: row.sessionId, taskId: row.taskId }));
            return { kind: "error", source: "deletion", text,
                ...(targets.length > 0 ? { onRetry: () => onRetry(targets) } : {}) };
        }
		function archiveActionConfirmation(t, action, ids, sessions, scope = { kind: "chat" }) {
			const selected = sessions.filter((row) => ids.includes(row.id));
			const count = ids.length;
			const workspace = scope.kind === "workspace";
			const all = scope.kind === "all";
			const selection = scope.kind === "selection";
			const unarchived = scope.source === "unarchived";
			const workspaces = new Set(selected.map((row) => row.workspaceId ?? "ungrouped")).size;
			const target = workspace
				? t(unarchived ? "scope.workspaceUnarchivedTarget" : "scope.workspaceArchivedTarget", { title: scope.title, count })
				: all ? t("scope.allTarget", { count, workspaces })
				: selection ? t("scope.selectionTarget", { count })
				: t("scope.chatTarget", { title: selected[0]?.title || t("chat.untitled") });
			if (action === "permanent") {
				const titleKey = unarchived
					? (workspace ? "scope.deleteUnarchivedWorkspace" : "scope.deleteUnarchivedOne")
					: workspace ? "scope.deleteArchivedWorkspace"
					: all ? "scope.deleteAll"
					: selection ? "scope.deleteSelection" : "scope.deleteArchivedOne";
				return {
					title: t(titleKey),
					body: t(all ? "scope.deleteLocalBody" : "scope.deleteBody", { target }),
					label: t(workspace || all ? "action.deleteAll" : "chat.delete"),
					danger: true, deleteAll: workspace || all,
				};
			}
			if (action === "unarchive") {
				const unarchiveTarget = workspace ? t("scope.unarchiveWorkspaceTarget", { title: scope.title })
					: all ? t("scope.unarchiveAllTarget") : selection ? t("scope.unarchiveSelectionTarget") : target;
				return {
					title: t(workspace ? "scope.unarchiveWorkspace" : selection ? "scope.unarchiveSelection" : "scope.unarchiveAll"),
					body: t("scope.unarchiveBody", { target: unarchiveTarget }),
					label: t(selection ? "chat.unarchive" : "menu.unarchiveAll"), danger: false,
				};
			}
			return {
				title: t(workspace ? "scope.exportWorkspace" : selection ? "scope.exportSelection" : "scope.exportAll"),
				body: t("scope.exportBody", { target }),
				label: t(selection ? "export.selected" : "export.all"), danger: false,
			};
		}
		const selectChatLabel = (t, title) => t("ui.selectChatLabel", { title });
		const removeTagLabel = (t, tag) => t("ui.removeTagLabel", { tag });
		const previewOpenLabel = (t, title) => `${t("preview.open")}${isZh(t) ? " " : ": "}${title}`;
		const previewRoleLabel = (t, role) => t(`preview.${["user", "assistant", "tool", "system", "context"].includes(role) ? role : "system"}`);
		const previewSegmentLabel = (t, segment) => {
            if (segment?.kind === "reasoning") return t("preview.reasoning");
			if (segment?.kind === "tool-call") return `${t("preview.toolCall")}${segment.label ? `: ${segment.label}` : ""}`;
			if (segment?.kind === "tool-result") return `${t("preview.toolResult")}${segment.label ? `: ${segment.label}` : ""}`;
			if (segment?.kind === "json") return segment.label || t("preview.json");
			return segment?.label || t("preview.unknown");
		};
			const previewJumpLabel = (t, index) => t("ui.previewJump", { index: index + 1 });
			const compactSessionId = (id) => {
				const points = [...String(id ?? "")];
				return points.length <= 24 ? points.join("") : `${points.slice(0, 12).join("")}…${points.slice(-8).join("")}`;
			};
			const lineageNodeLabel = (t, node) => typeof node?.title === "string" && node.title.trim() !== ""
				? node.title.trim()
				: t(node?.status === "missing" ? "lineage.sourceUnavailable" : "lineage.untitled");
			const lineageDiagnosticText = (t, item) => item?.code === "missing-parent"
				? t("lineage.diagnostic.missing-parent.detail")
				: t(`lineage.diagnostic.${item?.code}`);
			const lineageContextText = (t, node) => `${t("lineage.sourceContext")}${isZh(t) ? "：" : ": "}${lineageNodeLabel(t, node)}`;
			const lineageRelationText = (t, parent) => parent === null
				? t("lineage.start")
				: t("ui.lineageFrom", { title: lineageNodeLabel(t, parent) });
			const workspaceDisplayTitle = (t, title) => title === "default-workspace" ? t("group.defaultWorkspace") : title;
			const lineageWorkspaceLabel = (t, node) => {
				const title = typeof node?.workspace?.title === "string" ? node.workspace.title.trim() : "";
				if (title !== "") return workspaceDisplayTitle(t, title);
				const id = typeof node?.workspace?.id === "string" ? node.workspace.id.trim() : "";
				return id !== "" ? id : t("group.noProject");
			};
			const lineageProjectText = (t, node) => `${t("lineage.project")}${isZh(t) ? "：" : ": "}${lineageWorkspaceLabel(t, node)}`;
			const lineageBranchText = (t, count) => count === 0
				? t("lineage.noBranches")
				: countLabel(t, "ui.branchCount", count);
		const failureText = (t, failed) => {
			const first = failed[0];
			const reasonKey = `failure.${first?.reason}`;
			const translated = t(reasonKey);
			const reason = translated === reasonKey
				? first?.message ?? first?.reason ?? t("failure.refreshRetry") : translated;
			const count = failed.length;
			return t(count === 1 ? "failure.operationOne" : "failure.operationMany", { count, reason });
		};
		const deletionErrorText = (t, error) => Array.isArray(error?.body?.failed) && error.body.failed.length > 0
			? failureText(t, error.body.failed) : error?.body?.error
                ? failureText(t, [{ reason: error.body.error, message: error.message }]) : String(error?.message ?? error);
		const unarchiveFailureText = (t, error) => {
			const code = error?.body?.error;
			if (code === "session-main-list-unreachable" && error?.body?.reason === "cwd-missing") return t("unarchive.cwdMissing");
			if (code === "session-reachability-unavailable") return t("unarchive.authorityUnavailable");
			if (code === "session-deletion-pending") return t("unarchive.deletionPending");
			if (code === "pending-store-unavailable") return t("unarchive.pendingUnavailable");
			return deletionErrorText(t, error);
		};
		// Pin the success toast just inside the settings dialog's top edge: the
		// toast is fixed-positioned (viewport coordinates), so measure where the
		// dialog actually starts instead of hardcoding an offset.
		const toastTop = () => {
			try {
				const top = document.querySelector('[role="dialog"]')?.getBoundingClientRect().top;
				return typeof top === "number" && top >= 0 ? Math.round(top) + 16 : 24;
			} catch { return 24; }
		};
		function formatDate(t, ms) {
			if (typeof ms !== "number" || !Number.isFinite(ms)) return "";
			try {
				return new Intl.DateTimeFormat(t("locale.intl"), {
					year: "numeric", month: "long", day: "numeric",
					hour: "2-digit", minute: "2-digit", hour12: false
				}).format(new Date(ms));
			} catch {
				return new Date(ms).toLocaleString();
			}
		}
		function isoTimestamp(ms) {
			if (typeof ms !== "number" || !Number.isFinite(ms)) return undefined;
			const date = new Date(ms);
			return Number.isFinite(date.valueOf()) ? date.toISOString() : undefined;
		}

		function formatBytes(value) {
			if (!Number.isFinite(value) || value < 0) return "—";
			if (value < 1024) return `${value} B`;
			const units = ["KB", "MB", "GB", "TB"];
			let amount = value;
			let unit = -1;
			do { amount /= 1024; unit += 1; } while (amount >= 1024 && unit < units.length - 1);
			return `${Number(amount.toFixed(amount >= 10 ? 0 : 1))} ${units[unit]}`;
		}

		// Summary strip size label: neutral ellipsis while idle/loading, a
		// localized failure label on error, otherwise the formatted total.
		function summarySizeText(t, stats) {
			if (stats?.status === "ready") return formatBytes(stats.summary?.totalBytes ?? 0);
			if (stats?.status === "error") return t("stats.error");
			if (stats?.status === "loading") return t("stats.loading");
			return "…";
		}

		// Per-row size label: ellipsis until statistics arrive, dash for rows
		// whose directory could not be measured, formatted size when ready.
		function rowSizeText(t, stats, id) {
			if (stats?.status !== "ready") return "…";
			const row = stats.sessions?.[id];
			if (row?.status !== "ready") return "—";
			return formatBytes(row.sizeBytes);
		}

		const tagsLimitLabel = (t, count) => t("ui.tagsLimit", { count });
		const noteLimitLabel = (t, count) => t("ui.noteLimit", { count });

		function matchesArchivedSession(session, query, locale) {
			const normalized = String(query ?? "").trim().toLocaleLowerCase(locale);
			if (normalized === "") return true;
			return [session.id, session.title, session.workspaceTitle, ...(Array.isArray(session.tags) ? session.tags : []), session.note]
				.some((value) => String(value ?? "").toLocaleLowerCase(locale).includes(normalized));
		}

		function filterByTag(session, tag, locale) {
			const normalized = String(tag ?? "").trim().toLocaleLowerCase("en-US");
			if (normalized === "") return true;
			return (Array.isArray(session.tags) ? session.tags : [])
				.some((value) => String(value).trim().toLocaleLowerCase("en-US") === normalized);
		}

		function foldTags(values) {
			const seen = new Set();
			const tags = [];
			for (const value of values ?? []) {
				const tag = String(value ?? "").trim();
				const key = tag.toLocaleLowerCase("en-US");
				if (tag !== "" && !seen.has(key)) { seen.add(key); tags.push(tag); }
			}
			return tags;
		}

		function sessionSortTime(session) {
			if (Number.isFinite(session?.updatedAt) && session.updatedAt >= 0) return session.updatedAt;
			return Number.isFinite(session?.createdAt) && session.createdAt >= 0 ? session.createdAt : null;
		}

		function sortArchivedSessions(items, mode, locale) {
			const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
			return items.map((item, index) => ({ item, index })).sort((left, right) => {
				const a = left.item;
				const b = right.item;
				if (mode === "title") {
					const aTitle = typeof a.title === "string" && a.title.trim() !== "" ? a.title.trim() : null;
					const bTitle = typeof b.title === "string" && b.title.trim() !== "" ? b.title.trim() : null;
					if ((aTitle === null) !== (bTitle === null)) return aTitle === null ? 1 : -1;
					if (aTitle !== null && bTitle !== null) {
						const compared = collator.compare(aTitle, bTitle);
						if (compared !== 0) return compared;
					}
				} else {
					const aDate = sessionSortTime(a);
					const bDate = sessionSortTime(b);
					if ((aDate === null) !== (bDate === null)) return aDate === null ? 1 : -1;
					if (aDate !== null && bDate !== null && aDate !== bDate) return mode === "oldest" ? aDate - bDate : bDate - aDate;
					if (a.id !== b.id) return a.id < b.id ? -1 : 1;
				}
				return left.index - right.index;
			}).map(({ item }) => item);
		}

		function setVisibleSelection(selected, visibleIds, checked) {
			const next = new Set(selected);
			for (const id of visibleIds) {
				if (checked) next.add(id);
				else next.delete(id);
			}
			return next;
		}

		function uniqueSessionIds(ids) {
			return [...new Set((Array.isArray(ids) ? ids : [])
				.filter((id) => typeof id === "string" && id !== ""))];
		}

		function filterLineageForest(roots, query, project = "all", status = "all") {
			const normalized = String(query ?? "").trim().toLocaleLowerCase("en-US");
			const projectKey = typeof project === "string" && project !== "" ? project : "all";
			const statusKey = ["active", "archived"].includes(status) ? status : "all";
			const sourceRoots = Array.isArray(roots) ? roots : [];
			const results = new Map();
			const stack = sourceRoots.map((node) => ({ node, visited: false }));
			while (stack.length > 0) {
				const current = stack.pop();
				if (!current.visited) {
					const workspace = current.node?.workspace;
                    const directMatch = normalized !== "" && [current.node?.id, current.node?.title, workspace?.id, workspace?.title]
                        .some(value => String(value ?? "").toLocaleLowerCase("en-US").includes(normalized));
                    const queryMatched = current.queryMatched || normalized === "" || directMatch;
                    stack.push({ node: current.node, visited: true, queryMatched, directMatch });
					const children = Array.isArray(current.node?.children) ? current.node.children : [];
					for (let index = children.length - 1; index >= 0; index -= 1) stack.push({ node: children[index], visited: false, queryMatched });
					continue;
				}
				const children = (Array.isArray(current.node?.children) ? current.node.children : []).map((child) => results.get(child)).filter(Boolean);
				const workspace = current.node?.workspace;
				const matchesProject = projectKey === "all" || lineageWorkspaceKey(current.node) === projectKey;
				const matchesQuery = current.queryMatched;
				const managed = !current.node.contextOnly && current.node?.status !== "missing";
				const matchesStatus = statusKey === "all" || current.node?.status === statusKey;
				const own = managed && matchesProject && matchesQuery && matchesStatus;
				results.set(current.node, own || children.length > 0 ? { ...current.node, contextOnly: current.node.contextOnly || !own,
                    searchMatch: normalized === "" ? undefined : current.node.contextOnly || !own ? "context" : current.directMatch ? "direct" : "related", children } : null);
			}
			return sourceRoots.map((node) => results.get(node)).filter(Boolean);
		}

		function lineageWorkspaceKey(node) {
			return typeof node?.workspace?.id === "string" && node.workspace.id !== ""
				? node.workspace.id
				: "ungrouped";
		}

		function lineageProjects(roots) {
			const projects = [];
			const seen = new Set();
			const stack = [...(Array.isArray(roots) ? roots : [])].reverse();
			while (stack.length > 0) {
				const node = stack.pop();
				const managed = node?.status !== "missing";
				const value = lineageWorkspaceKey(node);
				if (managed && !seen.has(value)) {
					seen.add(value);
					const title = typeof node?.workspace?.title === "string" && node.workspace.title.trim() !== ""
						? node.workspace.title.trim()
						: typeof node?.workspace?.id === "string" && node.workspace.id.trim() !== "" ? node.workspace.id.trim() : null;
					projects.push({ value, title });
				}
				const children = Array.isArray(node?.children) ? node.children : [];
				for (let index = children.length - 1; index >= 0; index -= 1) stack.push(children[index]);
			}
			return projects;
		}

        function readLineageListOrder(ctx) {
            const workspaces = ctx.get("workspaces")?.list?.getSnapshot?.();
            const summaries = ctx.get("sessions")?.list?.getSnapshot?.()?.byId ?? {};
            const browser = ctx.slots.entriesOfSlot?.("sidebar.workspaces")?.find(entry => entry.store);
            const handle = typeof browser?.store === "function" ? browser.store() : browser?.store;
            const view = handle?.create?.()?.getSnapshot?.() ?? {};
            return { workspaces: workspaces?.items ?? [], summaries, view,
                pinnedSessionIds: workspaces?.pinnedSessionIds ?? [], archivedSessionIds: workspaces?.archivedSessionIds ?? [] };
        }

        function orderLineageListGroups(groups, order = {}) {
            const workspaceRanks = new Map((order.workspaces ?? []).map((workspace, index) => [workspace.workspaceId, index]));
            const archived = new Set(order.archivedSessionIds ?? []);
            const rank = group => group.key === "ungrouped" ? Infinity : workspaceRanks.get(group.key) ?? workspaceRanks.size;
            return [...groups].sort((a, b) => rank(a) - rank(b)).map(group => {
                const nodes = flattenLineageNodes(group.roots).map(entry => entry.node).filter(node => !node.contextOnly && node.status !== "missing");
                const updatedAt = node => order.summaries?.[node.id]?.updatedAt ?? node.createdAt ?? 0;
                const recent = [...nodes].sort((a, b) => updatedAt(b) - updatedAt(a) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map(node => node.id);
                let sessionOrder = recent;
                if (order.view?.orderBy === "manual") {
                    const members = new Set(recent);
                    const saved = [...new Set(order.view.sessionOrderByAccount?.[group.key === "ungrouped" ? "" : group.key] ?? [])].filter(id => members.has(id));
                    const included = new Set(saved);
                    const pins = (order.pinnedSessionIds ?? []).filter(id => members.has(id) && !included.has(id) && !archived.has(id));
                    for (const id of pins) included.add(id);
                    const remaining = recent.filter(id => !included.has(id));
                    sessionOrder = [...pins, ...saved, ...remaining.filter(id => !archived.has(id)), ...remaining.filter(id => archived.has(id))];
                }
                return { ...group, sessionOrder };
            });
        }

        function groupLineageWorkspaces(roots, workspaces = []) {
            const groups = new Map(), parents = new Map();
            for (const workspace of workspaces) {
                if (typeof workspace?.id !== "string" || workspace.id === "") continue;
                groups.set(workspace.id, { key: workspace.id, workspace, count: 0, roots: [], copies: new Map() });
            }
            const stack = (Array.isArray(roots) ? roots : []).map(node => ({ node, parent: null })).reverse();
            const entries = [];
            while (stack.length) {
                const entry = stack.pop();
                entries.push(entry);
                parents.set(entry.node, entry.parent);
                for (const child of [...(entry.node.children ?? [])].reverse()) stack.push({ node: child, parent: entry.node });
            }
            for (const { node } of entries) {
                if (!["active", "archived"].includes(node.status)) continue;
                const key = lineageWorkspaceKey(node);
                if (!groups.has(key)) groups.set(key, { key, workspace: node.workspace, count: 0, roots: [], copies: new Map() });
                const group = groups.get(key);
                group.count += 1;
                const path = [];
                let current = node;
                while (current && !group.copies.has(current)) { path.push(current); current = parents.get(current); }
                let parentCopy = current ? group.copies.get(current) : null;
                for (const source of path.reverse()) {
                    const parent = parents.get(source);
                    const copy = { ...source,
                        contextOnly: !["active", "archived"].includes(source.status) || lineageWorkspaceKey(source) !== key,
                        sourceParent: parent ? { id: parent.id, title: parent.title, status: parent.status, workspace: parent.workspace } : null,
                        children: [] };
                    group.copies.set(source, copy);
                    if (parentCopy) parentCopy.children.push(copy); else group.roots.push(copy);
                    parentCopy = copy;
                }
            }
            return [...groups.values()].filter(group => group.count > 0).map(({ copies, ...group }) => group);
        }

		const KEY_LINEAGE_WORKSPACES = "dsh-archived-chats:lineage-workspaces";
		function readLineageWorkspaces() {
			try {
				const ids = JSON.parse(window.localStorage.getItem(KEY_LINEAGE_WORKSPACES));
				return new Set(Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : []);
			} catch { return new Set(); }
		}

		function countManagedLineageNodes(roots) {
			let count = 0;
			const stack = [...(Array.isArray(roots) ? roots : [])];
			while (stack.length > 0) {
				const node = stack.pop();
				if (!node.contextOnly && ["active", "archived"].includes(node?.status)) count += 1;
				for (const child of Array.isArray(node?.children) ? node.children : []) stack.push(child);
			}
			return count;
		}



		function markArchiveDialog(page) {
			let dialog = null;
			try { dialog = page?.closest?.('[role="dialog"]') ?? null; } catch { return () => {}; }
			if (dialog === null || typeof dialog.setAttribute !== "function") return () => {};
			const previous = typeof dialog.getAttribute === "function" ? dialog.getAttribute("data-dac-section-active") : null;
			dialog.setAttribute("data-dac-section-active", "1");
			return () => {
				try {
					if (previous === null) dialog.removeAttribute?.("data-dac-section-active");
					else dialog.setAttribute("data-dac-section-active", previous);
				} catch { /* host dialog already closed */ }
			};
		}
		//#endregion

		//#region styles
		const CSS = `
.dac-page{position:relative;display:flex;flex-direction:column;gap:12px;padding:0 0 24px;font-family:inherit;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary)}
.dac-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
.dac-heading{display:flex;align-items:baseline;gap:8px;min-width:0;flex-wrap:wrap}
.dac-version{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}
.dac-update-link{border:0;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;border-radius:6px;padding:3px 8px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-label-primary));color:var(--dsw-alias-label-primary-foreground,var(--dsw-alias-bg-layer-1));font-size:12px;line-height:18px;text-decoration:none;white-space:nowrap}
.dac-update-link:focus-visible,.dac-about a:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:3px}
.dac-about{display:flex;flex-direction:column;gap:12px;padding:0;font-size:14px;line-height:22px;color:var(--dsw-alias-label-secondary)}
.dac-about p{margin:0}.dac-about-meta{display:flex;gap:8px 24px;flex-wrap:wrap;margin-top:10px}
.dac-about-links{display:flex;flex-wrap:wrap;gap:10px 20px}.dac-about a:not(.dac-update-link){color:var(--dsw-alias-label-primary);text-underline-offset:3px}
.dac-about-update{display:flex;flex-direction:column;align-items:flex-start;gap:10px;border-top:1px solid var(--dsw-alias-border-l2);padding-top:16px}
.dac-action-confirm.dac-update-dialog{width:min(520px,calc(100vw - 48px))}.dac-update-content{display:flex;flex-direction:column;gap:14px}.dac-update-content p{margin:0}.dac-update-content a{color:var(--dsw-alias-label-primary);text-underline-offset:3px}.dac-update-terminal summary{cursor:pointer;color:var(--dsw-alias-label-secondary)}.dac-update-terminal[open] summary{margin-bottom:10px}.dac-update-meta{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:8px 16px;margin:0}.dac-update-meta dt{color:var(--dsw-alias-label-tertiary)}.dac-update-meta dd{margin:0;overflow-wrap:anywhere}.dac-update-command{display:flex;align-items:flex-start;gap:8px;padding:10px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);margin-top:8px}.dac-update-command code{flex:1;min-width:0;font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere;user-select:text}.dac-update-command button:not(.dac-native-control){flex:none}.dac-update-manual{border-top:1px solid var(--dsw-alias-border-l2);padding-top:14px;display:flex;flex-direction:column;gap:8px}.dac-update-error{color:var(--dsw-alias-state-error-primary)}.dac-update-privacy{font-size:12px;color:var(--dsw-alias-label-tertiary)}@media(max-width:480px){.dac-update-command{flex-direction:column}.dac-update-command button:not(.dac-native-control){align-self:flex-end}}
.dac-about-section-title{margin:0;font:inherit;font-weight:500;color:var(--dsw-alias-label-primary)}

.dac-about-status{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.dac-title{flex:none;white-space:nowrap;margin:0;color:var(--dsw-alias-label-primary);font-size:18px;font-weight:600;outline:none}
.dac-intro{color:var(--dsw-alias-label-tertiary);margin:0;font-size:13px}
.dac-head-actions{position:relative;display:flex;flex:0 1 auto;min-width:0;height:32px;box-sizing:border-box;align-items:center;justify-content:safe flex-end;gap:16px;flex-wrap:nowrap;overflow:visible}
.dac-toolbar-more{flex:none}.dac-toolbar-more>summary{list-style:none;gap:5px;border-radius:8px;padding:4px 10px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}.dac-toolbar-more>summary::-webkit-details-marker{display:none}.dac-toolbar-more>summary svg{flex:none}.dac-toolbar-more .dac-row-menu{min-width:180px;max-width:calc(100vw - 48px);z-index:20}.dac-menu-separator{height:1px;background:var(--dsw-alias-border-l2);margin:4px 10px}
.dac-toolbar-more>summary.dac-iconbtn,.dac-toolbar-more-trigger{box-sizing:border-box;width:22px;height:22px;padding:0;color:var(--dsw-alias-label-secondary)}
.dac-more-fallback{display:inline-flex;align-items:center;justify-content:center;flex:none;border:0;border-radius:var(--dsw-radius-md);background:transparent;cursor:pointer}
.dac-more-fallback:hover,.dac-more-fallback[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.dac-head-actions .dac-toolbar-more>summary.dac-iconbtn{border:0;border-radius:var(--dsw-radius-md);background:transparent}
.dac-toolbar-more-trigger[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.dac-toolbar-native-menu{min-width:180px;max-width:calc(100vw - 48px)}
.dac-head-actions>button:not(.dac-native-control),.dac-toolbar-button{flex:none;box-sizing:border-box;height:32px;border-radius:var(--dsw-radius-md);padding:0 12px;font-size:13px;line-height:20px;white-space:nowrap}
.dac-head-actions>button:not(.dac-native-control)>svg{flex:none;width:13px;height:13px}
.dac-toolbar-fallback{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-family:inherit;cursor:pointer}
.dac-toolbar-fallback[data-variant="primary"]{border-color:transparent;background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-1)}
.dac-toolbar-fallback:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}
.dac-toolbar-fallback[data-variant="primary"]:hover:not(:disabled){background:var(--dsw-alias-label-primary);opacity:.9}
.dac-toolbar-fallback:disabled{opacity:.45;cursor:default}
.dac-toolbar-more[open]>summary.dac-iconbtn,.dac-head-actions .dac-toolbar-more>summary.dac-iconbtn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dac-head-actions>.dac-action-trigger.dac-danger{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}
.dac-head-actions>button:not(.dac-native-control):focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}
.dac-tabs{display:flex;flex-wrap:wrap;gap:32px;min-width:0;min-height:25px;margin-top:2px;border-bottom:.5px solid var(--dsw-alias-border-l2)}
.dac-tab{--dsh-tab-hit-inline:10px;position:relative;box-sizing:border-box;min-height:35px;margin:-10px calc(-1 * var(--dsh-tab-hit-inline)) 0;padding:10px var(--dsh-tab-hit-inline) 9px;border:0;background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:13px;font-weight:500;line-height:16px;cursor:pointer}
.dac-tab:after{content:"";position:absolute;right:var(--dsh-tab-hit-inline);bottom:-1px;left:var(--dsh-tab-hit-inline);height:2px;border-radius:2px;background:transparent}
.dac-tab[aria-selected="true"]{color:var(--dsw-alias-label-primary)}
.dac-tab[aria-selected="true"]:after{background:var(--dsw-alias-label-primary)}
.dac-tab:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px;border-radius:2px}
.dac-tab-label{position:relative;display:inline-block}
.dac-intro-row{position:relative;z-index:2;container-type:inline-size;display:flex;align-items:center;justify-content:space-between;gap:6px 12px;flex-wrap:wrap}
/* Match the Host intro's text height while centering the taller controls. */
.dac-intro-row .dac-intro{flex:1;min-width:0;padding-right:196px}
.dac-intro-row[data-locale="en"] .dac-intro{padding-right:232px}
.dac-intro-row .dac-head-actions{position:absolute;right:0;top:50%;transform:translateY(-50%);width:184px;justify-content:flex-end}
.dac-intro-row .dac-head-actions:empty{display:none}
.dac-intro-row[data-locale="en"] .dac-head-actions{width:220px}
@container (max-width:376px){.dac-intro-row .dac-intro{flex-basis:100%;padding-right:0}.dac-intro-row .dac-head-actions{position:static;transform:none;margin-left:auto}}
@container (max-width:492px){.dac-intro-row[data-locale="en"] .dac-intro{flex-basis:100%;padding-right:0}.dac-intro-row[data-locale="en"] .dac-head-actions{position:static;transform:none;margin-left:auto}}
.dac-tabs+[role="tabpanel"]{padding-top:2px}
.dac-update-dot{position:absolute;right:-7px;top:0;width:6px;height:6px;border-radius:50%;background:#dc2626;pointer-events:none}
.dac-help-label{display:inline-flex;align-items:center;gap:5px}
.dac-help{display:inline-flex;align-items:center;font-weight:400}
.dac-help-button{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:4px;border:0;border-radius:50%;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dac-help-button:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dac-help-button:focus-visible,.dac-toast button:not(.dac-native-control):focus-visible{outline:2px solid var(--dsw-alias-label-primary);outline-offset:2px}
.dac-mode-panel{display:flex;flex-direction:column;gap:12px}
.dac-action-wrap{position:relative;display:inline-flex}
.dac-action-trigger{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);padding:5px 11px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;white-space:nowrap;cursor:pointer}
.dac-action-trigger:hover:not(:disabled),.dac-action-trigger[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dac-toolbar-more>summary.dac-iconbtn{width:22px;height:22px;padding:0}
.dac-action-trigger.dac-danger{color:var(--dsw-alias-state-error-primary)}
.dac-action-trigger:disabled{opacity:.45;cursor:default}
/* Shared radii follow Host settings cards (xl), inputs/controls (md), and menu surfaces (lg). */
.dac-search{box-sizing:border-box;position:relative;width:100%;display:flex;align-items:center;color:var(--dsw-alias-label-tertiary)}
.dac-search>svg{position:absolute;left:12px;pointer-events:none}
.dac-search input{box-sizing:border-box;width:100%;min-width:0;height:36px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;outline:none;padding:0 34px 0 12px}
.dac-search:has(>svg) input{padding-left:36px}
.dac-search input::placeholder{color:var(--dsw-alias-label-tertiary)}
.dac-search input:focus-visible{border-color:var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary)) 18%,transparent)}
@media (pointer:coarse){.dac-search input{font-size:16px}}
.dac-search-state{display:flex;align-items:center;flex-wrap:wrap;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;overflow-wrap:anywhere}.dac-search-state details{flex-basis:100%}.dac-search-state ul{padding-left:20px;margin:6px 0}
.dac-search-state.dac-error{color:var(--dsw-alias-state-error-primary)}
.dac-querybar-stacked{display:flex;flex-direction:column;gap:12px;min-width:0}
.dac-querybar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}
.dac-querybar>.dac-search{flex:1 1 180px;min-width:0}
.dac-querybar>.dac-filters{flex:0 1 auto;min-width:0;max-width:100%}
.dac-querybar .dac-select-wrap,.dac-querybar .dac-filter-menu{flex:1 1 120px;width:120px;min-width:90px;max-width:160px}
.dac-querybar .dac-select,.dac-querybar .dac-filter-menu>summary{box-sizing:border-box;min-height:36px}
.dac-filters{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dac-filters>.dac-select-wrap{flex:1 1 90px;min-width:90px;max-width:160px}.dac-filters .dac-select{border-radius:var(--dsw-radius-md);width:100%;min-width:0;text-overflow:ellipsis}
.dac-select-wrap{position:relative;display:inline-flex;align-items:center}
.dac-select{appearance:none;-webkit-appearance:none;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;padding:5px 28px 5px 14px;cursor:pointer;outline:none}
.dac-select-wrap-fill,.dac-select-fill{width:100%;min-width:0}
.dac-select:hover{border-color:var(--dsw-alias-border-l1,var(--dsw-alias-border-l2))}
.dac-chevron{position:absolute;right:10px;pointer-events:none;color:var(--dsw-alias-label-tertiary);display:inline-flex}
.dac-selectionbar{container:dac-selection / inline-size;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:7px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1)}
.dac-selection-info,.dac-selection-actions,.dac-selection-all{display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0}
.dac-selection-all{font-size:13px;cursor:pointer;white-space:nowrap}
.dac-selection-count{display:flex;flex-direction:column;gap:2px;font-size:13px;color:var(--dsw-alias-label-primary)}
.dac-selection-count small{font-size:12px;color:var(--dsw-alias-label-secondary)}
.dac-selection-actions{gap:6px}.dac-selection-actions .dac-danger{color:var(--dsw-alias-state-error-primary)}
.dac-selection-secondary{display:contents}.dac-selection-overflow{display:none}
@container dac-selection (max-width:500px){.dac-selection-secondary{display:none}.dac-selection-overflow{display:block}}
@container dac-selection (max-width:660px){.dac-selection-actions[data-language="en"] .dac-selection-secondary{display:none}.dac-selection-actions[data-language="en"] .dac-selection-overflow{display:block}}
.dac-selection-cancel{border-color:transparent;background:transparent;color:var(--dsw-alias-label-secondary)}
@media(max-width:640px){.dac-selection-actions{width:100%}.dac-selectionbar{gap:10px}.dac-selection-actions .dac-action-trigger{font-size:12px;padding:5px 8px}}
.dac-checkbox{appearance:auto;width:auto;height:auto;box-sizing:border-box;margin:0;accent-color:auto;cursor:pointer;flex:none}
.dac-checkbox:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.dac-checkbox:disabled{cursor:default;opacity:.5}
.dac-group{display:flex;flex-direction:column;gap:10px}
.dac-group-head{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px}
.dac-group-left{display:flex;align-items:center;gap:8px;min-width:0}
.dac-group-toggle{display:inline-flex;align-items:center;gap:7px;border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;padding:3px 6px;margin:-3px -6px;border-radius:7px}
.dac-group-toggle:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dac-archive-group>.dac-group-head{box-sizing:border-box;min-height:34px;padding:0 8px;border-radius:var(--dsw-radius-md);align-items:center;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dac-archive-group>.dac-group-head[data-menu-open="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.dac-archive-group>.dac-group-head .dac-group-toggle{width:100%;min-height:34px;padding:0;margin:0;background:transparent;gap:8px}
.dac-workspace-disclosure{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none;width:16px;height:20px;color:var(--dsw-alias-label-tertiary)}
.dac-workspace-folder,.dac-workspace-arrow{display:inline-flex;align-items:center;justify-content:center}
.dac-workspace-arrow{display:none;color:var(--dsw-alias-label-caption)}
.dac-workspace-arrow svg{transition:transform .15s var(--ds-ease-in-out,ease)}
.dac-workspace-disclosure[data-open="true"] .dac-workspace-arrow svg{transform:rotate(90deg)}
@media(hover:hover){.dac-archive-group>.dac-group-head:hover{background:var(--dsw-alias-interactive-bg-hover)}.dac-group-head:hover .dac-workspace-folder{display:none}.dac-group-head:hover .dac-workspace-arrow{display:inline-flex}}
@media(prefers-reduced-motion:reduce){.dac-workspace-arrow svg{transition:none}}
.dac-archive-group>.dac-group-head>.dac-group-left{flex:1}
.dac-archive-group>.dac-group-head>.dac-group-side{flex:none;white-space:nowrap}
.dac-archive-group>.dac-group-head .dac-count{color:inherit;font-weight:400}
.dac-archive-group>.dac-group-head .dac-iconbtn{color:inherit}
.dac-archive-group-toggle{min-width:0;max-width:100%;align-items:center;text-align:left;font-weight:400;color:inherit}
.dac-archive-group-toggle>svg{flex:none}
.dac-archive-group-toggle>span{min-width:0;white-space:normal;overflow-wrap:anywhere}
.dac-archive-group-toggle:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:3px}
.dac-chev{display:inline-flex;color:var(--dsw-alias-label-tertiary);transform:rotate(-90deg);transition:transform .15s}
.dac-chev.open{transform:rotate(0)}
.dac-group-name{display:flex;align-items:center;gap:7px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
.dac-group-side{display:flex;align-items:center;gap:4px}
.dac-count{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;margin-right:2px}
.dac-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:background .15s,color .15s;padding:0}
.dac-iconbtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary)}
.dac-iconbtn:disabled{opacity:.45;cursor:default}
.dac-iconbtn.dac-danger:hover:not(:disabled){color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger)}
.dac-menu{position:absolute;right:0;top:30px;z-index:40;min-width:150px;display:flex;flex-direction:column;gap:2px;padding:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv3)}
.dac-menu-heading{padding:6px 10px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-menu-item{border:none;border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;padding:7px 10px;cursor:pointer}
.dac-menu-item:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dac-menu-item:disabled{opacity:.45;cursor:default}
.dac-menu-item.dac-danger{color:var(--dsw-alias-state-error-primary)}
.dac-menu-item.dac-danger:disabled{color:var(--dsw-alias-label-primary)}
.dac-menu-item.dac-danger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger)}
.dac-list{display:flex;flex-direction:column;gap:8px}
.dac-group:not(.dac-archive-group)>.dac-list{gap:0;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-xl);padding:0 16px;background:var(--dsw-alias-bg-layer-1)}
.dac-group:not(.dac-archive-group)>.dac-list>.dac-row{border:0;border-bottom:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-xl);padding:14px 0;background:transparent}
.dac-group:not(.dac-archive-group)>.dac-list>.dac-row:last-child{border-bottom:0}
.dac-row-more{position:relative;flex:none}
.dac-row-more>summary{list-style:none}
.dac-row-more>summary::-webkit-details-marker{display:none}
.dac-row-more[open]{z-index:41}
.dac-row-menu{top:34px;min-width:180px;max-width:calc(100vw - 48px)}
.dac-row-menu .dac-menu-item{display:flex;align-items:center;gap:8px}
.dac-row{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-bg-layer-1);padding:12px 16px;transition:border-color .15s,background .15s}
.dac-row:hover{border-color:var(--dsw-alias-border-l1,var(--dsw-alias-border-l2))}
.dac-row-select{display:flex;align-items:center;gap:11px;min-width:0;flex:1}
.dac-row-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.dac-row-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:22px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dac-row-open{display:block;width:100%;border:0;padding:0;background:transparent;font-family:inherit;text-align:left;cursor:pointer}
.dac-row-open:hover:not(:disabled){text-decoration:underline;text-underline-offset:3px}
.dac-row-open:disabled{opacity:.45;cursor:default}
.dac-row-open:focus-visible{outline:2px solid var(--dsw-alias-border-l1);outline-offset:3px;border-radius:3px}
.dac-row-footer{display:flex;align-items:center;gap:10px;white-space:nowrap;min-width:0}.dac-row-footer .dac-row-date{min-width:0;overflow:hidden;text-overflow:ellipsis}.dac-row-footer .dac-row-size{flex-shrink:0}.dac-row-meta:empty{display:none}
.dac-row-note{min-width:0;position:relative;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;cursor:help;outline-offset:2px}.dac-row-note-summary{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dac-note-tooltip{position:fixed;z-index:10000;box-sizing:border-box;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary);box-shadow:0 6px 24px rgba(0,0,0,.16);font-size:13px;line-height:20px;cursor:text;user-select:text}
.dac-row-extras{min-width:0;flex-wrap:nowrap!important}.dac-row-extras .dac-chip{min-width:0;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}.dac-row-extras .dac-chip-more{flex-shrink:0}.dac-row-extras .dac-row-note{flex:1 1 100px}.dac-row-extras .dac-chip~.dac-row-note{border-left:1px solid var(--dsw-alias-border-l2);padding-left:8px}
.dac-row-date{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
/* All chat lists share the host plugin-inventory card tokens and spacing. */
.dac-archive-group>.dac-list{gap:10px}
.dac-archive-group>.dac-list>.dac-row{box-sizing:border-box;min-width:0;min-height:52px;border:.5px solid var(--dsw-alias-settings-card-stroke);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-settings-card-fill);padding:12px 14px;transition:none}
.dac-archive-group>.dac-list>.dac-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dac-archive-group .dac-row-main{gap:2px}
.dac-archive-group .dac-row-title{font-size:14px;font-weight:500;line-height:20px}
.dac-archive-group .dac-row-note{color:var(--dsw-alias-label-tertiary)}
.dac-row-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
.dac-row>.dac-row-actions:empty{display:none}
.dac-preview-head-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}

.dac-unarchived-row .dac-row-select{flex:none}
.dac-unarchived-row .dac-row-meta{display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-unarchived-row .dac-row-meta>span{min-width:0;overflow-wrap:anywhere}
.dac-row-id{font-family:var(--ds-font-family-code,ui-monospace);font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}
.dac-unarchive{border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;font-weight:400;line-height:18px;padding:4px 10px;cursor:pointer;transition:background .15s,border-color .15s}
.dac-row-actions>.dac-unarchive{display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}
.dac-row-actions>.dac-unarchive>svg{flex:none}
.dac-workspace-actions>button:not(.dac-native-control).dac-stop-archive{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger,rgba(239,68,68,.1));border-color:transparent}
.dac-unarchive:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dac-unarchive:disabled{opacity:.45;cursor:default}
.dac-unarchive.dac-archive-unarchive{border:0;border-radius:var(--dsw-radius-md);background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.08));font-size:13px;font-weight:500;line-height:20px;padding:4px 10px}
.dac-unarchive.dac-archive-unarchive:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-active,rgba(127,127,127,.16))}
.dac-unarchive.dac-danger{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}
.dac-unarchive.dac-danger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger)}
.dac-chat-status{display:inline-flex;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;padding:1px 8px}
.dac-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:56px 0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;text-align:center}
.dac-center{display:flex;align-items:center;justify-content:center;gap:8px;padding:48px 0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}
.dac-retry{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;padding:4px 12px;cursor:pointer}
.dac-notice{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--dsw-alias-state-error-primary);border-radius:10px;background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px;padding:8px 12px}
/* A success that must stay on screen: it succeeded, so it wears the success
   palette, but it is not a four-second toast because it reports an omission. */
.dac-notice-ok{border-color:var(--dsw-alias-state-success-secondary);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-state-success-primary)}
.dac-notice-ok>span{flex:1}
.dac-notice button:not(.dac-native-control){border:none;background:transparent;color:inherit;cursor:pointer;font:inherit;padding:0;display:inline-flex}
.dac-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1200;width:max-content;max-width:calc(100vw - 32px);box-sizing:border-box;display:flex;align-items:center;gap:8px;border:1px solid var(--dsw-alias-state-success-secondary);border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-success-primary);font-size:13px;font-weight:500;line-height:20px;padding:7px 12px 7px 14px;box-shadow:var(--dsw-elevation-prominent,var(--dsw-shadow-lv3));animation:dac-toast-in .28s cubic-bezier(.21,1.02,.55,1) both}
.dac-toast svg{flex:none}
.dac-toast button:not(.dac-native-control){border:none;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);opacity:1;cursor:pointer;font:inherit;padding:3px;margin-left:2px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px}
.dac-toast button:not(.dac-native-control).dac-notice-action{padding:3px 9px;white-space:nowrap}
.dac-toast button:not(.dac-native-control):hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
@keyframes dac-toast-in{from{opacity:0;transform:translateX(-50%) translateY(-10px) scale(.96)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
@media (prefers-reduced-motion:reduce){.dac-toast{animation:none}}
.dac-confirm-overlay{position:fixed;inset:0;z-index:1400;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.4));backdrop-filter:var(--dsw-mask-blur)}
.dac-confirm{box-sizing:border-box;width:min(380px,calc(100vw - 48px));display:flex;flex-direction:column;gap:16px;border:0;border-radius:var(--dsw-radius-panel,24px);background:var(--dsw-alias-bg-layer-2);box-shadow:var(--dsw-elevation-prominent,var(--dsw-shadow-lv3));padding:24px;outline:none}
.dac-confirm:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-state-business-primary),var(--dsw-shadow-lv3)}
.dac-confirm-title{color:var(--dsw-alias-label-primary);font-size:16px;font-weight:500;line-height:24px}
.dac-confirm-body{color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}
.dac-confirm-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}
.dac-confirm-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.dac-confirm-heading>.dac-iconbtn{flex:none}
.dac-btn{border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;padding:5px 14px;cursor:pointer}
.dac-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dac-btn-danger{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--dsw-alias-state-error-primary);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground);font:inherit;font-size:13px;line-height:20px;padding:5px 14px;cursor:pointer}
.dac-btn-danger:hover:not(:disabled){background:var(--dsw-alias-state-error-primary)}
.dac-btn-danger:disabled{opacity:.5;cursor:default}
.dac-spin{display:inline-block;width:14px;height:14px;border:2px solid var(--dsw-alias-label-tertiary);border-top-color:transparent;border-radius:50%;animation:dac-rotate .8s linear infinite}
@keyframes dac-rotate{to{transform:rotate(360deg)}}
.dac-summary{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;margin-top:-6px}
.dac-filter-menu{flex:1 1 90px;min-width:90px;max-width:160px}.dac-filter-menu>summary{box-sizing:border-box;width:100%;justify-content:space-between;border-radius:var(--dsw-radius-md)}.dac-filter-menu>summary>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dac-filter-menu .dac-row-menu{left:0;right:auto;top:calc(100% + 6px);min-width:220px;max-height:min(320px,50vh);overflow-y:auto;gap:0}.dac-filter-menu .dac-menu-item{padding:4px 8px;min-height:28px;box-sizing:border-box}.dac-filter-menu .dac-menu-separator{margin:3px 8px}.dac-filter-menu .dac-filter-label{gap:6px}.dac-filter-options{display:flex;flex-direction:column}.dac-filter-options+.dac-filter-options{margin-top:3px}.dac-filter-options+.dac-filter-options::before{content:"";height:1px;flex:none;background:var(--dsw-alias-border-l2);margin:0 8px 3px}.dac-filter-label{display:flex;align-items:center;gap:8px;min-width:0;flex:1}.dac-filter-label>svg{flex:none}.dac-filter-label>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dac-filter-menu>summary>svg{flex:none}.dac-filter-menu .dac-menu-item:disabled{opacity:.45;cursor:default}.dac-filter-menu .dac-workspace-heading{font-weight:500;color:var(--dsw-alias-label-secondary)}.dac-filter-heading{padding:4px 8px;color:var(--dsw-alias-label-tertiary);font-size:12px}.dac-filter-options .dac-menu-item{justify-content:space-between}
.dac-summary-sep{color:var(--dsw-alias-label-tertiary)}
.dac-summary-warn{color:var(--dsw-alias-state-error-primary)}
.dac-warn{display:flex;align-items:center;gap:8px;border:1px solid var(--dsw-alias-state-error-primary);border-radius:10px;background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px;padding:8px 12px}
.dac-row-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.dac-chip{display:inline-flex;align-items:center;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;padding:1px 8px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* A row the export writer refused: readable at a glance, no id matching. */
.dac-chip-warn{background:transparent;border:1px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}
.dac-chip-more{color:var(--dsw-alias-label-tertiary)}
.dac-row-size{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;flex:none}
.dac-row-snippet{background:none;border:0;padding:0;text-align:left;cursor:pointer;max-width:680px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.dac-row-snippet:focus-visible{outline:2px solid var(--dsw-alias-interactive-primary,var(--dsw-alias-label-primary));outline-offset:3px}
.dac-preview-node[data-preview-match="true"]{outline:2px solid var(--dsw-alias-interactive-primary,var(--dsw-alias-label-primary));outline-offset:4px;border-radius:8px}
.dac-row-snippet strong{color:var(--dsw-alias-interactive-primary,var(--dsw-alias-label-primary));font-weight:500;margin-right:6px}
.dac-meta-dialog{width:min(440px,calc(100vw - 64px))}
.dac-preview-dialog{width:min(1120px,calc(100vw - 32px));height:min(820px,calc(100vh - 32px));padding:0;gap:0;overflow:hidden}
.dac-preview-head{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--dsw-alias-border-l2);padding:14px 16px}
.dac-preview-heading{min-width:0;display:flex;flex-direction:column;gap:2px}
.dac-preview-heading strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-size:16px;line-height:24px;font-weight:500}
.dac-preview-heading span{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-preview-layout{min-height:0;flex:1;display:grid;grid-template-columns:74px minmax(0,1fr)}
.dac-preview-rail{display:flex;flex-direction:column;gap:5px;overflow:auto;border-right:1px solid var(--dsw-alias-border-l2);padding:10px 8px;background:var(--dsw-alias-bg-layer-1)}
.dac-preview-rail button:not(.dac-native-control){border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:12px;line-height:18px;padding:4px 6px;cursor:pointer}
.dac-preview-rail button:not(.dac-native-control):hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary)}
.dac-preview-rail button:not(.dac-native-control)[aria-current="true"]{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover-solid);border-color:var(--dsw-alias-border-l2)}
.dac-preview-feed{min-width:0;overflow:auto;padding:16px;background:var(--dsw-alias-bg-layer-2)}
.dac-preview-column{width:100%;max-width:var(--dsh-chat-content-width,760px);margin:0 auto;display:flex;flex-direction:column;gap:16px}
.dac-preview-node{min-width:0;display:flex;flex-direction:column;gap:8px}
.dac-preview-user{align-items:flex-end}
.dac-preview-user-bubble{max-width:min(525px,82%);border-radius:22px;background:var(--dsw-specific-bubble);color:var(--dsw-alias-label-primary);padding:10px 16px;font-size:16px;line-height:24px;white-space:pre-wrap;overflow-wrap:anywhere}
.dac-preview-images{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:8px;width:min(100%,560px);max-width:100%}
.dac-preview-images[data-align="end"]{align-self:flex-end}
.dac-preview-images[data-align="start"]{align-self:flex-start}
.dac-preview-images img{display:block;width:100%;max-width:100%;height:auto;max-height:420px;object-fit:contain;border-radius:12px}
.dac-preview-image-placeholder{display:block;max-width:100%;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-preview-assistant{align-items:stretch;color:var(--dsw-alias-label-primary);font-size:16px;line-height:28px}
.dac-preview-tool,.dac-preview-system,.dac-preview-context{align-items:stretch;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:24px}
.dac-preview-meta{display:flex;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-preview-plain{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
.dac-preview-disclosure{color:var(--dsw-alias-label-secondary)}
.dac-preview-process{color:var(--dsw-alias-label-secondary);font-size:14px;line-height:24px}.dac-preview-process>summary{display:flex;align-items:center;gap:6px;list-style:none;cursor:pointer;padding:2px 0 8px;border-bottom:1px solid var(--dsw-alias-border-l2)}.dac-preview-process>summary::-webkit-details-marker{display:none}.dac-preview-process>summary svg{transition:transform .12s}.dac-preview-process[open]>summary svg{transform:rotate(180deg)}.dac-preview-process-body{display:flex;flex-direction:column;gap:10px;padding-top:12px}.dac-preview-process-body .dac-preview-node{gap:8px}.dac-preview-process-body .dac-preview-assistant{font-size:14px;line-height:24px}
.dac-preview-fold-summary{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:13px}.dac-preview-fold-summary::before{content:"·";margin-right:8px}.dac-preview-fold>summary>span:not([class]){flex:none}.dac-preview-fold[open]>summary>.dac-preview-fold-summary{display:none}.dac-preview-detail-label{font-size:12px;color:var(--dsw-alias-label-tertiary)}
.dac-preview-process>summary:focus-visible,.dac-preview-fold>summary:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;border-radius:4px}
.dac-preview-fold>summary{display:flex;align-items:center;gap:8px;list-style:none;cursor:pointer;width:fit-content;max-width:100%;font-size:14px;line-height:24px}
.dac-preview-fold>summary::-webkit-details-marker{display:none}
.dac-preview-fold>summary:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:3px;border-radius:4px}
.dac-preview-fold-leading{display:inline-grid;width:16px;height:16px;flex:none;align-items:center;justify-items:center}
.dac-preview-fold-icon,.dac-preview-fold-chevron{grid-area:1/1;display:inline-flex}
.dac-preview-fold-chevron{visibility:hidden;transform:rotate(-90deg)}
.dac-preview-fold>summary:hover .dac-preview-fold-icon,.dac-preview-fold>summary:focus-visible .dac-preview-fold-icon,.dac-preview-fold[open]>summary .dac-preview-fold-icon{visibility:hidden}
.dac-preview-fold>summary:hover .dac-preview-fold-chevron,.dac-preview-fold>summary:focus-visible .dac-preview-fold-chevron,.dac-preview-fold[open]>summary .dac-preview-fold-chevron{visibility:visible}
.dac-preview-fold[open]>summary .dac-preview-fold-chevron{transform:rotate(0)}
.dac-preview-prompt-body{max-height:141px;overflow:auto;overscroll-behavior:contain;box-sizing:border-box;margin:4px 0 4px 22px;padding:10px 12px;border-radius:6px;background:var(--dsw-alias-markdown-code-block,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;line-height:20px;white-space:pre-wrap;overflow-wrap:anywhere}
.dac-preview-prompt-body>.dac-preview-plain{display:block}
.dac-preview-prompt-body>.dac-preview-plain+.dac-preview-plain{margin-top:8px}
.dac-preview-reasoning-body{color:var(--dsw-alias-label-tertiary);white-space:pre-wrap;word-break:break-word;padding:4px 0 4px 22px;font-size:14px;line-height:24px}
.dac-preview-code{border:1px solid var(--dsw-alias-border-l1,var(--dsw-alias-border-l2));background:var(--dsw-alias-markdown-code-block,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-label-primary);border-radius:12px;padding:12px 16px;white-space:pre-wrap;overflow-wrap:anywhere}
.dac-preview-tool-body{display:flex;flex-direction:column;gap:8px;padding:4px 0 4px 22px}
.dac-preview-tool-result{margin:0;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);padding:10px 12px;white-space:pre-wrap;overflow-wrap:anywhere}
.dac-preview-tool-result.dac-error{color:var(--dsw-alias-state-error-primary)}
.dac-preview-tool-body.dac-error,.dac-preview-disclosure.dac-error{color:var(--dsw-alias-state-error-primary)}
.dac-preview-actions{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;opacity:.58;transition:opacity .15s}
.dac-preview-actions button:not(.dac-native-control){border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;padding:2px 5px;cursor:pointer}
.dac-preview-actions button:not(.dac-native-control):hover,.dac-preview-actions button:not(.dac-native-control):focus-visible{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary)}
.dac-preview-node:hover .dac-preview-actions,.dac-preview-node:focus-within .dac-preview-actions{opacity:1}
.dac-preview-more{align-self:center;margin:4px 0 8px}
.dac-import-dialog{width:min(560px,calc(100vw - 48px));max-height:min(700px,calc(100vh - 48px));overflow:auto}
.dac-import-package{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.dac-import-package strong{grid-column:1/-1;color:var(--dsw-alias-label-primary);font-size:13px}
.dac-import-list{display:flex;flex-direction:column;gap:8px;max-height:360px;overflow:auto}
.dac-import-selection{display:flex;justify-content:flex-end;gap:6px;flex-wrap:wrap}
.dac-import-row{display:flex;align-items:flex-start;gap:9px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-xl);padding:8px 10px;cursor:pointer}
.dac-import-row.dac-import-conflict{opacity:.58;cursor:default}
.dac-import-main{display:flex;flex-direction:column;gap:2px;min-width:0;color:var(--dsw-alias-label-primary);font-size:13px;line-height:18px}
.dac-context-note{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;padding:9px 12px}
.dac-lineage-toolbar{display:flex;flex-direction:column;gap:12px;min-width:0}
.dac-lineage-toolbar-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:none}
.dac-lineage-fold-actions{display:inline-flex;align-items:center;gap:4px;margin-left:auto;flex:none}
.dac-lineage-fold{display:inline-flex;align-items:center;gap:0;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;padding:5px 8px;cursor:pointer}
.dac-lineage-fold:hover:not(:disabled),.dac-lineage-fold:focus-visible{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary)}
.dac-lineage-fold:disabled{opacity:.42;cursor:default}
.dac-lineage-fold .dac-chev{display:inline-flex;flex:none;min-width:0;width:0;height:13px;margin-left:0;opacity:0;overflow:hidden;transition:width .18s var(--ds-ease-in-out,ease),margin-left .18s var(--ds-ease-in-out,ease),opacity .18s var(--ds-ease-in-out,ease),transform .15s}
.dac-lineage-fold .dac-chev svg{flex:none}
@media(hover:hover){.dac-lineage-fold:hover:not(:disabled) .dac-chev{width:13px;margin-left:5px;opacity:1}}
@media(prefers-reduced-motion:reduce){.dac-lineage-fold .dac-chev{transition:none}}
.dac-chev.collapse{transform:rotate(180deg)}
.dac-lineage-list-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:nowrap;gap:8px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.dac-lineage-list-head>.dac-filters{flex:1;min-width:0;flex-wrap:nowrap}
.dac-lineage-list-head-copy{display:flex;align-items:center;gap:4px;flex:none;white-space:nowrap}.dac-lineage-list-head small{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-lineage-workspaces{display:flex;flex-direction:column;gap:14px;min-width:0}
.dac-lineage-workspace{display:flex;flex-direction:column;gap:10px;min-width:0}
.dac-lineage-workspace+.dac-lineage-workspace{border-top:.5px solid var(--dsw-alias-border-l2);padding-top:14px}
.dac-lineage-workspace h3{margin:0;font:inherit}
.dac-lineage-workspace-toggle{display:flex;width:100%}
.dac-lineage-workspace-title{flex:1;min-width:0}
.dac-lineage-workspace-toggle small{flex:none;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-lineage-workspace-toggle:disabled{cursor:default}
.dac-lineage-workspace-toggle>svg{flex:none}
.dac-lineage-tree{display:flex;flex-direction:column;gap:10px;min-width:0;padding:0}
.dac-import-main span{color:var(--dsw-alias-label-tertiary);font-size:11px}
.dac-import-main small{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px}


.dac-import-result{display:flex;flex-direction:column;gap:8px;color:var(--dsw-alias-state-success-primary);font-size:13px;line-height:20px}.dac-import-result-counts{display:flex;gap:14px;flex-wrap:wrap}.dac-import-warning{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.dac-import-error{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px}
.dac-field-label{display:block;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}
.dac-meta-input,.dac-meta-note{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:22px;padding:7px 8px;outline:none}
.dac-meta-input:focus,.dac-meta-note:focus{border-color:var(--dsw-alias-border-l1,var(--dsw-alias-border-l2))}
.dac-tag-editor{display:flex;align-items:center;flex-wrap:wrap;gap:6px;min-height:38px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1);padding:5px 7px;transition:border-color .15s}
.dac-tag-editor:focus-within{border-color:var(--dsw-alias-border-l1,var(--dsw-alias-border-l2))}
.dac-tag-editor .dac-meta-input{flex:1 1 140px;min-width:120px;width:auto;border:0;border-radius:0;background:transparent;padding:2px 3px}
.dac-tag-editor .dac-chip{gap:4px;border:0;cursor:pointer;font-family:inherit;padding:2px 7px}
.dac-tag-editor .dac-chip span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dac-tag-editor .dac-chip:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.18));color:var(--dsw-alias-label-primary)}
.dac-tag-editor .dac-chip svg{flex:none}
.dac-meta-input{height:32px;padding:0 8px}
.dac-meta-note{resize:vertical;min-height:72px}
.dac-meta-limits{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-btn-primary{border:1px solid var(--dsw-alias-label-primary,#171717);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-label-primary));color:var(--dsw-alias-label-primary-foreground,var(--dsw-alias-bg-layer-1));font:inherit;font-size:13px;line-height:20px;padding:5px 14px;cursor:pointer}
.dac-btn-primary:hover:not(:disabled){opacity:.9}
.dac-btn-primary:disabled{opacity:.5;cursor:default}
/* Match the Host Modal / Button contract, shared by every action confirmation.
   Keep our existing nested-dialog focus and pending-action guards. */
.dac-action-confirm-overlay{box-sizing:border-box;padding:max(24px,var(--dsh-frame-overlay-top,24px)) 24px;background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.4))}
.dac-action-confirm,.dac-workspace-dialog{box-sizing:border-box;width:min(380px,calc(100vw - 48px));max-height:calc(100vh - 48px);flex-shrink:0;overflow:auto;gap:0;border:0;border-radius:var(--dsw-radius-panel,24px);padding:0 0 24px;background:var(--dsw-alias-bg-layer-2);box-shadow:var(--dsw-elevation-prominent,var(--dsw-shadow-lv3))}
.dac-action-confirm .dac-confirm-heading,.dac-workspace-dialog .dac-preview-head{display:flex;align-items:center;justify-content:space-between;gap:8px;border:0;padding:22px 14px 12px 24px;flex-shrink:0}
.dac-action-confirm .dac-confirm-title,.dac-workspace-dialog .dac-preview-head strong{margin:0;color:var(--dsw-alias-label-primary);font-size:16px;line-height:24px;font-weight:500;overflow-wrap:anywhere}
.dac-action-confirm .dac-confirm-heading>.dac-iconbtn,.dac-workspace-dialog .dac-preview-head>.dac-iconbtn{flex:none;width:28px;height:28px;border-radius:var(--dsw-radius-sm,8px);color:var(--dsw-alias-label-secondary)}
.dac-action-confirm .dac-confirm-heading>.dac-iconbtn svg,.dac-workspace-dialog .dac-preview-head>.dac-iconbtn svg{width:14px;height:14px}
.dac-action-confirm .dac-confirm-body,.dac-workspace-copy{margin:0;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px;font-weight:400;overflow-wrap:anywhere;white-space:pre-wrap}
.dac-action-confirm .dac-confirm-body{padding:0 24px}
.dac-workspace-body{display:flex;flex-direction:column;gap:12px;padding:0 24px;color:var(--dsw-alias-label-primary)}
.dac-workspace-choices{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.dac-workspace-choice{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;text-align:left;padding:11px 13px;cursor:pointer}
.dac-workspace-choice:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dac-workspace-choice:focus-within{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.dac-workspace-choice-selected{border-color:var(--dsw-alias-state-business-primary)}
.dac-workspace-choice-all{grid-template-columns:auto minmax(0,1fr);border:0;background:transparent;padding-top:7px;padding-bottom:7px}
.dac-workspace-choice-all:hover{background:transparent}
.dac-workspace-choice-all:focus-within{outline:0}
.dac-workspace-choice-title{min-width:0;overflow-wrap:anywhere;font-weight:500}
.dac-workspace-choice-counts{display:flex;flex:none;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dac-workspace-skipped-live{margin:0;color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:22px}
.dac-action-confirm .dac-confirm-actions,.dac-workspace-actions{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:8px;margin:40px 0 0;padding:0 24px;flex-shrink:0}
.dac-action-confirm .dac-confirm-actions>button:not(.dac-native-control),.dac-workspace-actions>button:not(.dac-native-control){box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:4px;height:36px;min-width:0;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md,10px);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:22px;padding:0 14px;cursor:pointer}
.dac-action-confirm .dac-confirm-actions>.dac-btn-danger,.dac-workspace-actions>.dac-btn-danger{color:var(--dsw-alias-state-error-primary)}
.dac-action-confirm .dac-confirm-actions>button:not(.dac-native-control):hover:not(:disabled),.dac-workspace-actions>button:not(.dac-native-control):hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);opacity:1}
.dac-action-confirm .dac-confirm-actions>.dac-btn,.dac-workspace-actions>.dac-btn{border-color:transparent;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}
.dac-action-confirm .dac-confirm-actions>.dac-btn-primary,.dac-workspace-actions>.dac-btn-primary{border-color:transparent;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-label-primary));color:var(--dsw-alias-label-primary-foreground,var(--dsw-alias-bg-layer-1))}
.dac-action-confirm .dac-confirm-actions>.dac-btn-primary:hover:not(:disabled),.dac-workspace-actions>.dac-btn-primary:hover:not(:disabled){background:var(--dsw-alias-label-primary,#171717);opacity:.9}
.dac-action-confirm .dac-confirm-actions>button:not(.dac-native-control):disabled,.dac-workspace-actions>button:not(.dac-native-control):disabled{opacity:.4;cursor:not-allowed}
.dac-delete-all>svg{flex:none}
.dac-delete-control{display:inline-flex;flex:none}
.dac-delete-tooltip{position:fixed;z-index:10000;box-sizing:border-box;width:max-content;max-width:calc(100vw - 24px);padding:6px 12px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:var(--dsw-alias-tooltip-bg,#181b1c);color:var(--dsw-static-neutral-bluish-00,#fff);box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:13px;font-weight:500;line-height:18px;overflow-wrap:anywhere;pointer-events:none}
.dac-action-confirm button:not(.dac-native-control):focus-visible,.dac-workspace-actions>button:not(.dac-native-control):focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.dac-workspace-body ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
.dac-workspace-result-group{display:flex;flex-direction:column;gap:5px;border-top:1px solid var(--dsw-alias-border-l2);padding-top:10px}
@media (max-width:640px){[role="dialog"][data-dac-section-active="1"]>nav{display:none}[role="dialog"][data-dac-section-active="1"]>nav+div{width:100%;min-width:0}.dac-head{align-items:flex-start;flex-wrap:wrap}.dac-action-trigger{padding:5px 9px}.dac-row{align-items:flex-start;flex-wrap:wrap}.dac-row-actions{gap:4px;flex-wrap:wrap}.dac-unarchive{padding:4px 10px}.dac-summary{gap:6px}.dac-row-meta{gap:4px}.dac-preview-dialog{width:calc(100vw - 20px);height:calc(100vh - 20px)}.dac-preview-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}.dac-preview-feed{padding:10px}.dac-preview-rail{flex-direction:row;overflow-x:auto;border-right:none;border-bottom:1px solid var(--dsw-alias-border-l2);padding:8px 5px}.dac-preview-rail button:not(.dac-native-control){flex:none}}
@media (max-width:640px){.dac-lineage-card-head{gap:8px}.dac-lineage-workspace-toggle small{font-size:11px}}
.dac-lineage-canvas{position:relative;min-width:0;overflow:hidden;border:1px solid var(--dsw-alias-border-l2,#e4e5e8);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-bg-layer-1,#fff);--dac-lineage-accent:var(--dsw-alias-state-business-primary,#4b78e8)}
.dac-lineage-list-title{display:flex;align-items:center;gap:8px;min-width:0}
.dac-lineage-list-title .dac-row-open{width:auto;max-width:100%;min-width:0}
.dac-lineage-list-title .dac-chat-status{flex:none}
.dac-lineage-list-meta{min-width:0}
.dac-lineage-list-meta>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dac-lineage-list-footer{flex-wrap:wrap;white-space:normal;gap:2px 14px}
.dac-lineage-list-id{display:inline-flex;align-items:center;gap:4px;min-width:0}
.dac-lineage-modal-backdrop{position:fixed;inset:0;z-index:1299;background:rgba(0,0,0,.32)}
.dac-lineage-modal-backdrop .dac-lineage-canvas.enlarged{box-shadow:0 16px 64px rgba(0,0,0,.16)}
.dac-lineage-canvas.enlarged{position:fixed;inset:20px;z-index:900;display:flex;flex-direction:column;box-shadow:0 0 0 100vmax rgba(0,0,0,.35);outline:none;border-radius:var(--dsw-radius-panel)}
.dac-lineage-canvas-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 12px;flex-wrap:wrap;background:var(--dsw-alias-bg-layer-1,#fff);position:relative;z-index:1;flex:none}
.dac-lineage-legend{display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:11px;color:var(--dsw-alias-label-secondary)}
.dac-lineage-legend strong{font-size:13px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dac-lineage-legend span{display:inline-flex;align-items:center;gap:6px}.dac-lineage-legend span::before{content:"";width:20px;border-top:1.5px solid var(--dsw-alias-label-tertiary,#a5adba)}.dac-lineage-legend .dac-lineage-legend-agent::before{border-top-style:dashed}
.dac-lineage-view-button{border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;min-width:30px;min-height:30px;padding:4px 8px;border-radius:8px;cursor:pointer;white-space:nowrap}
.dac-lineage-view-button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.1));color:var(--dsw-alias-label-primary)}.dac-lineage-view-button:disabled{opacity:.4;cursor:default}
.dac-lineage-canvas-body{position:relative;height:clamp(260px,48vh,480px);min-height:240px}
.dac-lineage-canvas.enlarged .dac-lineage-canvas-body{flex:1;height:auto;min-height:0}
.dac-lineage-viewport{position:absolute;inset:0;overflow:clip;overscroll-behavior:contain;background:var(--dsw-alias-bg-module-platform,#f7f8fa);cursor:grab;touch-action:none;user-select:none;border-top:1px solid var(--dsw-alias-border-l2,#e4e5e8)}
.dac-lineage-viewport[data-dragging="true"]{cursor:grabbing}
.dac-lineage-stage{position:absolute;left:0;top:0;transform-origin:top left}
.dac-lineage-close{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;padding:6px;margin-left:auto}
.dac-lineage-edges{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}.dac-lineage-edge{fill:none;stroke:var(--dsw-alias-label-tertiary,#a5adba);stroke-width:1.5;opacity:.65}.dac-lineage-edge.delegated{stroke-dasharray:5 4}.dac-lineage-edge.highlighted{stroke:var(--dac-lineage-accent);stroke-width:2;opacity:1}
.dac-lineage-node{position:absolute;box-sizing:border-box;display:flex;min-width:0;cursor:default}
.dac-lineage-row{transition:border-color .15s,box-shadow .15s;display:flex;flex-direction:column;gap:8px;width:100%;height:100%;padding:14px;box-sizing:border-box;min-width:0;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e4e5e8);border-radius:var(--dsw-radius-xl);box-shadow:0 2px 5px rgba(0,0,0,.04);cursor:pointer}
.dac-lineage-node.highlighted .dac-lineage-row{border-color:var(--dac-lineage-accent);box-shadow:0 0 0 1px color-mix(in srgb,var(--dac-lineage-accent) 18%,transparent)}
.dac-lineage-row:hover{border-color:var(--dac-lineage-accent);box-shadow:var(--dsw-shadow-lv2,0 5px 16px rgba(0,0,0,.08))}
.dac-lineage-port{position:absolute;top:85px;box-sizing:border-box;width:10px;height:10px;border:2px solid var(--dsw-alias-label-tertiary);border-radius:50%;background:var(--dsw-alias-bg-layer-1,#fff);pointer-events:none}
.dac-lineage-port.incoming{left:-5px}.dac-lineage-port.outgoing{right:-5px}
.dac-lineage-node.highlighted .dac-lineage-port,.dac-lineage-row:hover .dac-lineage-port{border-color:var(--dac-lineage-accent)}
.dac-lineage-context-card{border-style:dashed;box-shadow:none}
.dac-lineage-card-head{display:flex;align-items:center;gap:8px;min-width:0;flex:none;height:32px}
.dac-lineage-card-head strong{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;line-height:20px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dac-lineage-kind-icon{display:flex;align-items:center;justify-content:center;width:28px;height:28px;flex:none;border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-module-platform,#f4f5f7)}
.dac-lineage-kind-icon.root{color:var(--dac-lineage-accent);background:color-mix(in srgb,var(--dac-lineage-accent) 12%,transparent)}
.dac-lineage-title{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dac-lineage-title:hover{text-decoration:underline;text-underline-offset:3px}
.dac-lineage-card-head>.dac-chat-status{flex:none;white-space:nowrap;font-size:10px;line-height:16px;padding:1px 6px;border:1px solid var(--dsw-alias-border-l2,#e4e5e8)}
.dac-lineage-archived,.dac-lineage-active,.dac-lineage-missing{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary)}
.dac-lineage-card-body{display:flex;flex-direction:column;gap:4px;flex:1;min-height:0;min-width:0;padding-top:2px}
.dac-lineage-meta,.dac-lineage-relation{display:flex;align-items:center;gap:6px;min-width:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}.dac-lineage-meta>svg,.dac-lineage-relation>svg{flex:none}.dac-lineage-meta>span,.dac-lineage-source{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dac-lineage-search-label,.dac-lineage-source-context{font-size:10px;line-height:14px;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dac-lineage-footer{display:flex;align-items:center;justify-content:space-between;gap:6px;min-width:0;flex:none;border-top:1px solid var(--dsw-alias-border-l2,#eceef1);padding-top:8px}
.dac-lineage-created{display:flex;align-items:center;gap:4px;font-size:10px;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}.dac-lineage-created svg{flex:none}
.dac-lineage-id-actions{display:flex;align-items:center;gap:3px;min-width:0}.dac-lineage-id{font-family:var(--ds-font-family-code,monospace);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}
.dac-lineage-copy{display:flex;align-items:center;justify-content:center;border:0;border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-secondary);width:24px;height:24px;padding:3px;flex:none;cursor:pointer}.dac-lineage-copy:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dac-lineage-match{background:color-mix(in srgb,var(--dac-lineage-accent) 15%,transparent);color:inherit;border-radius:2px}
.dac-lineage-title:focus-visible,.dac-lineage-copy:focus-visible,.dac-lineage-workspace-toggle:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4b78e8);outline-offset:-2px}
.dac-lineage-diagnostics{box-sizing:border-box;height:36px;flex:none;overflow:auto}.dac-lineage-diagnostic{display:block;color:var(--dsw-alias-state-error-primary);font-size:10px;line-height:16px}
.dac-lineage-overview{position:absolute;left:16px;bottom:16px;z-index:2;display:flex;flex-direction:column;gap:4px;max-width:calc(100% - 100px);padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:var(--dsw-shadow-lv2,0 2px 8px rgba(0,0,0,.06));pointer-events:none}
.dac-lineage-overview strong{font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary)}.dac-lineage-overview small{font-size:11px;color:var(--dsw-alias-label-tertiary)}
.dac-lineage-zoom{position:absolute;right:16px;bottom:16px;z-index:2;display:flex;flex-direction:column;align-items:center;gap:2px;width:44px;padding:4px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:var(--dsw-shadow-lv2,0 2px 8px rgba(0,0,0,.06))}
.dac-lineage-zoom .dac-lineage-view-button{display:flex;align-items:center;justify-content:center;width:34px;height:32px;padding:4px;font-size:20px}.dac-lineage-zoom .dac-lineage-view-button:last-child{border-radius:0 0 var(--dsw-radius-md) var(--dsw-radius-md);border-top:1px solid var(--dsw-alias-border-l2)}.dac-lineage-zoom output{font-size:10px;line-height:18px;text-align:center;color:var(--dsw-alias-label-secondary)}
.dac-lineage-view-button:focus-visible,.dac-lineage-viewport:focus-visible{outline:2px solid var(--dac-lineage-accent);outline-offset:-2px}
@media(prefers-reduced-motion:reduce){.dac-lineage-row{transition:none}}
@media(max-width:640px){.dac-lineage-canvas.enlarged{inset:8px}.dac-lineage-overview small{display:none}.dac-lineage-canvas-bar{gap:4px;padding:6px 8px}}

	@media (max-width:480px){.dac-row-select{width:100%;flex-basis:100%}.dac-row-actions{width:100%;justify-content:flex-end}}
	@media (max-width:480px){.dac-workspace-choice{grid-template-columns:auto minmax(0,1fr)}.dac-workspace-choice-counts{grid-column:2;flex-wrap:wrap}}

/* Native controls retain the Host's sizing, paint and interaction states. */
.dac-note-content{max-height:240px;overflow:auto;white-space:pre-wrap;user-select:text}
.dac-native-control{flex:none;white-space:nowrap}
.dac-native-iconbtn{width:28px;padding:0}
.dac-native-danger{color:var(--dsw-alias-state-error-primary);--dsh-button-outline-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 30%,transparent);--dsw-alias-interactive-bg-hover:color-mix(in srgb,var(--dsw-alias-state-error-primary) 8%,transparent)}
.dac-native-danger-primary{--dsw-alias-button-primary-fill:var(--dsw-alias-state-error-primary);--dsw-alias-button-primary-hover:var(--dsw-alias-state-error-primary)}
.dac-native-control[data-dac-delete],.dac-iconbtn[data-dac-delete]{color:var(--dsw-alias-label-tertiary)}
.dac-native-control[data-dac-delete]:hover:not(:disabled),.dac-iconbtn[data-dac-delete]:hover:not(:disabled){color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger)}
.dac-native-input{width:100%;min-width:0;box-sizing:border-box}
.dac-tag-editor>.dac-native-input{flex:1 1 140px;width:auto}
.dac-toolbar-fallback-menu{position:relative;display:inline-flex}
.dac-native-menu{position:absolute;right:0;top:calc(100% + 4px);max-width:calc(100vw - 48px);max-height:min(320px,50vh);overflow-y:auto;z-index:40;display:flex;flex-direction:column;gap:2px;min-width:180px;padding:6px;box-shadow:var(--dsw-elevation-prominent)}
.dac-native-menu-content{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-width:0}
.dac-native-menu-content>svg{flex:none}
.dac-filter-menu .dac-native-menu{min-width:min(220px,calc(100vw - 48px));max-width:calc(100vw - 48px)}
.dac-native-filter-trigger{box-sizing:border-box;width:100%;min-width:0;justify-content:space-between}
.dac-native-filter-trigger>.dac-filter-label{overflow:hidden}
.dac-native-filter-trigger>svg{flex:none}
.dac-native-filter-menu{min-width:200px}
.dac-native-standard-modal{max-height:calc(100vh - 48px)}
.dac-native-standard-content{min-height:0;overflow-y:auto;overscroll-behavior:contain}
.dac-native-standard-modal.dac-update-dialog{width:min(520px,calc(100vw - 48px))}
.dac-native-modal{width:auto;max-width:calc(100vw - 48px);max-height:calc(100vh - 48px);padding:0;gap:0;overflow:hidden}
.dac-native-modal>.dac-confirm{box-sizing:border-box;max-width:100%;max-height:calc(100vh - 48px);margin:0;border:0;border-radius:inherit;background:transparent;box-shadow:none}
`;

		function ensureStyle() {
			if (typeof document === "undefined") return;
			if (document.getElementById(STYLE_ID) !== null) return;
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.setAttribute("data-plugin-css", "dsh-archived-chats");
			style.textContent = CSS;
			document.head.appendChild(style);
		}
		//#endregion

		//#region settings-nav icon patch
		// The settings shell hardcodes nav icons by section id (models /
		// agent-presets / plugins, gear for everything else). A registrant cannot
		// supply its own glyph, so after the shell renders we rewrite OUR nav
		// button's icon in place — mutating the existing <svg> (never replacing
		// React-managed nodes) and re-marking through dataset, so locale
		// re-renders and dialog reopens simply get re-patched by the observer.
		const NAV_LABELS = Object.values(dictionaries).map((dict) => dict.nav);
		const ARCHIVE_ICON_INNER = '<rect x="3" y="4" width="18" height="5" rx="1"></rect><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"></path><path d="M10 13h4"></path>';

		function safeQueryAll(root, selector) {
			try {
				return typeof root?.querySelectorAll === "function" ? root.querySelectorAll(selector) : [];
			} catch {
				return [];
			}
		}

		function patchNavIcons() {
			if (typeof document === "undefined" || document.body === null) return;
			const dialogs = safeQueryAll(document, '[role="dialog"]');
			for (const dialog of dialogs) {
				const buttons = safeQueryAll(dialog, "nav button");
				for (const button of buttons) {
					const text = typeof button?.textContent === "string" ? button.textContent : "";
					if (!NAV_LABELS.some((label) => text.includes(label))) continue;
					let svg = null;
					try { svg = typeof button.querySelector === "function" ? button.querySelector("svg") : null; } catch { continue; }
					if (svg === null || svg.dataset === void 0 || svg.dataset.dacPatched === "1" || typeof svg.setAttribute !== "function") continue;
					try {
						svg.dataset.dacPatched = "1";
						svg.setAttribute("viewBox", "0 0 24 24");
						svg.setAttribute("fill", "none");
						svg.setAttribute("stroke", "currentColor");
						svg.setAttribute("stroke-width", "2");
						svg.setAttribute("stroke-linecap", "round");
						svg.setAttribute("stroke-linejoin", "round");
						svg.innerHTML = ARCHIVE_ICON_INNER;
					} catch { /* keep the host-provided fallback icon */ }
				}
			}
		}

		let navObserver = null;

		function startNavIconPatch() {
			patchNavIcons();
			let Observer;
			try { Observer = typeof window !== "undefined" ? window.MutationObserver : void 0; } catch { return; }
			if (Observer === void 0 || typeof document === "undefined" || document.body === null) return;
			if (navObserver !== null) return;
			let observer = null;
			try {
				observer = new Observer(() => patchNavIcons());
				observer.observe(document.body, { childList: true, subtree: true });
				navObserver = observer;
			} catch {
				try { observer?.disconnect?.(); } catch { /* best-effort decoration cleanup */ }
			}
		}

		function stopNavIconPatch() {
			try { navObserver?.disconnect?.(); } catch { /* best-effort decoration cleanup */ }
			navObserver = null;
		}
		//#endregion

		//#region api
		async function fetchState() {
			const res = await fetch(`${API_BASE}/state`, { cache: "no-store" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const body = await res.json();
			return {
				sessions: Array.isArray(body.sessions) ? body.sessions : [],
                scheduleStatus: body.scheduleStatus ?? "unsupported",
                retryTargets: Array.isArray(body.retryTargets) ? body.retryTargets : [],
				metadataStatus: body.metadataStatus === "unavailable" ? "unavailable" : "ready",
				// Unreadable deletion-task storage cannot be subtracted from this list, so
				// already-deleted chats can reappear here. Surface it instead of
				// silently showing them as ordinary archived chats.
				deletionStatus: body.deletionStatus === "unavailable" ? "unavailable" : "ready",
			};
		}

		async function fetchStats() {
			const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		}

		async function fetchLineage(signal) {
			const res = await fetch(`${API_BASE}/lineage`, { cache: "no-store", signal });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		}

		async function fetchArchivePreview(sessionId, offset = 0, limit = 50, signal, scope = "archive", seq) {
			const body = { sessionId, offset, limit, ...(seq === undefined ? {} : { seq }) };
			// Forward every non-default scope. Naming only "deletions" here silently
			// downgraded a newer scope to "archive", which the Host then answered
			// with a 404 because the session is not archived at all.
			if (scope !== "archive") body.scope = scope;
			return post("/preview", body, signal);
		}

		async function fetchArchiveImage(sessionId, attachmentId, signal, scope = "archive") {
			const body = { sessionId, attachmentId };
			if (scope !== "archive") body.scope = scope;
			const res = await fetch(`${API_BASE}/preview/image`, {
				method: "POST",
				headers: { "content-type": "application/json", [GUARD_HEADER]: "1" },
				body: JSON.stringify(body),
				signal,
			});
			if (!res.ok) {
				const parsed = await res.json().catch(() => ({}));
				const error = new Error(parsed.message || parsed.error || `HTTP ${res.status}`);
				error.body = parsed;
				throw error;
			}
			return res.blob();
		}

		async function fetchArchiveSearch(query, limit = 50, signal, sessionIds, scope = "archive") {
			return post("/search", { query, limit, ...(sessionIds === undefined ? {} : { sessionIds }), ...(scope === "archive" ? {} : { scope }) }, signal);
		}

        // One request at a time; the Host bounds each request's inspection concurrency.
        // Keep successful results across retry, but never reuse them across candidate scopes.
        async function runArchiveSearch({ query, ids, scope = "archive", previous, signal, onUpdate = () => {} }) {
            const candidates = uniqueSessionIds(ids);
            const allowed = new Set(candidates);
            const hits = new Map((previous?.hits ?? []).filter(hit => allowed.has(hit.sessionId)).map(hit => [hit.sessionId, hit]));
            const done = new Set((previous?.completedIds ?? []).filter(id => allowed.has(id)));
            const skipped = new Map((previous?.skipped ?? []).filter(item => allowed.has(item.sessionId)).map(item => [item.sessionId, item]));
            const pending = candidates.filter(id => !done.has(id));
            const snapshot = (status, error = null) => ({ status, query, hits: [...hits.values()], skipped: [...skipped.values()],
                completedIds: [...done], pendingIds: candidates.filter(id => !done.has(id) && !skipped.has(id)),
                processed: done.size + skipped.size, total: candidates.length, error });
            if (Array.from(query.trim()).length < 2) return snapshot("idle");
            if (signal?.aborted) return snapshot("stopped");
            onUpdate(snapshot("loading"));
            for (let offset = 0; offset < pending.length; offset += 20) {
                if (signal?.aborted) return snapshot("stopped");
                const batch = pending.slice(offset, offset + 20);
                try {
                    const result = await fetchArchiveSearch(query, 100, signal, batch, scope);
                    if (signal?.aborted) return snapshot("stopped");
                    const failures = new Map((result.skipped ?? []).map(item => [item.sessionId, item]));
                    for (const id of batch) {
                        if (failures.has(id)) { skipped.set(id, failures.get(id)); hits.delete(id); }
                        else { done.add(id); skipped.delete(id); }
                    }
                    for (const hit of result.hits ?? []) if (batch.includes(hit.sessionId) && done.has(hit.sessionId)) hits.set(hit.sessionId, hit);
                    onUpdate(snapshot("loading"));
                } catch (error) {
                    if (signal?.aborted) return snapshot("stopped");
                    const state = snapshot("error", String(error.message ?? error)); onUpdate(state); return state;
                }
            }
            const state = snapshot(skipped.size > 0 ? "partial" : "ready"); onUpdate(state); return state;
        }

        function matchesWorkspaceFilter(row, value) {
            return value === "all" || (value === "__dac_scheduled__"
                ? row.hasSchedule === true : (row.workspaceId ?? "ungrouped") === value);
        }

        function archiveSearchCandidates(sessions, project, type, tag, locale) {
            return (sessions ?? []).filter(row => matchesWorkspaceFilter(row, project)
                && (type !== "normal" || row.origin !== "subagent") && (type !== "subagent" || row.origin === "subagent")
                && (tag === "" || filterByTag(row, tag, locale))).map(row => row.id);
        }

		async function fetchWorkspaceArchiveWorkspaces() {
			const res = await fetch(`${API_BASE}/workspace-archive/workspaces`, { cache: "no-store" });
			const parsed = await res.json().catch(() => ({}));
			if (!res.ok) {
				const error = new Error(parsed.message || parsed.error || `HTTP ${res.status}`);
				error.body = parsed;
				throw error;
			}
			return parsed;
		}

		async function previewWorkspaceArchive(workspaceId, sessionIds, includeActive = false) {
			return post("/workspace-archive/preview", { workspaceId, ...(sessionIds === undefined ? {} : { sessionIds }), ...(includeActive ? { includeActive: true } : {}) });
		}

		async function applyWorkspaceArchive(token, nonce, stopActivity = false) {
			const res = await fetch(`${API_BASE}/workspace-archive/apply`, {
				method: "POST", headers: { "content-type": "application/json", [GUARD_HEADER]: "1" }, body: JSON.stringify({ token, nonce, ...(stopActivity ? { stopActivity: true } : {}) }),
			});
			const parsed = await res.json().catch(() => ({}));
			const complete = Array.isArray(parsed?.archived) && Array.isArray(parsed?.skipped)
				&& Array.isArray(parsed?.failed);
			if (res.status === 409 && complete) return { ...parsed, status: 409 };
			if (!res.ok) { const error = new Error(parsed.message || parsed.error || `HTTP ${res.status}`); error.body = parsed; throw error; }
			return parsed;
		}

			async function saveMetadata(sessionId, tags, note) {
				return post("/metadata", { sessionId, tags, note });
			}

			async function submitImportFile(file) {
				if (file === null || file === undefined) throw new Error("backup file is required");
				const body = new FormData();
				body.append("file", file, file.name || "backup.zip");
				const res = await fetch(`${API_BASE}/import/inspect`, {
					method: "POST",
					headers: { [GUARD_HEADER]: "1" },
					body,
				});
				const parsed = await res.json().catch(() => ({}));
				if (!res.ok) {
					const error = new Error(parsed.message || parsed.error || `HTTP ${res.status}`);
					error.body = parsed;
					throw error;
				}
				return parsed;
			}

			const EXPORT_DOWNLOAD_MAX_BYTES = 320 * 1024 * 1024;
			const EXPORT_DOWNLOAD_TIMEOUT_MS = 5 * 60 * 1000;
			function exportFilename(disposition) {
				const value = typeof disposition === "string" ? disposition : "";
				const encoded = value.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)?.[1];
				let filename = null;
				if (encoded) {
					try { filename = decodeURIComponent(encoded.trim()); } catch { filename = null; }
				}
				if (filename === null) filename = value.match(/filename\s*=\s*"([^"]+)"/i)?.[1]
					?? value.match(/filename\s*=\s*([^;]+)/i)?.[1]?.trim() ?? null;
				const safe = typeof filename === "string" ? filename.replace(/[\\/\u0000-\u001f\u007f]/g, "-").trim() : "";
				return safe === "" ? "dsh-archived-chats.zip" : safe;
			}

			async function readBoundedDownload(response, maxBytes) {
				const declared = Number(response.headers?.get?.("content-length"));
				if (Number.isFinite(declared) && declared > maxBytes) {
					await response.body?.cancel?.("export-download-too-large").catch(() => {});
					throw new Error("export-download-too-large");
				}
				const reader = response.body?.getReader?.();
				if (reader === undefined) {
					const bytes = new Uint8Array(await response.arrayBuffer());
					if (bytes.byteLength > maxBytes) throw new Error("export-download-too-large");
					return bytes;
				}
				const chunks = [];
				let total = 0;
				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						if (!(value instanceof Uint8Array)) throw new Error("export-stream-invalid");
						total += value.byteLength;
						if (total > maxBytes) {
							await reader.cancel("export-download-too-large").catch(() => {});
							throw new Error("export-download-too-large");
						}
						chunks.push(value);
					}
				} finally { reader.releaseLock?.(); }
				const bytes = new Uint8Array(total);
				let offset = 0;
				for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
				return bytes;
			}

			async function submitExport(sessionIds, signal, path = "/export") {
				if (typeof document === "undefined") return false;
				const ids = [...new Set((Array.isArray(sessionIds) ? sessionIds : [])
					.filter((id) => typeof id === "string" && id !== ""))];
				if (ids.length === 0) return false;
				const body = new URLSearchParams({ sessionIds: JSON.stringify(ids) });
				const response = await fetch(`${API_BASE}${path}`, {
					method: "POST",
					headers: { "content-type": "application/x-www-form-urlencoded" },
					body: body.toString(),
					signal,
				});
				const contentType = response.headers?.get?.("content-type")?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
				const disposition = response.headers?.get?.("content-disposition") ?? "";
				if (!response.ok || contentType !== "application/zip" || !/^attachment\s*;/i.test(disposition)) {
					let detail = `HTTP ${response.status}`;
					try {
						const bytes = await readBoundedDownload(response, 64 * 1024);
						const text = new TextDecoder().decode(bytes).trim();
						if (text !== "") detail = text;
					} catch { /* keep bounded status fallback */ }
					const error = new Error(detail);
					error.status = response.status;
					// The Host answers `code` or `code:subject`. Splitting it here lets
					// the caller act on the code and name the session it refers to,
					// rather than surfacing the raw token to the user.
					const separator = detail.indexOf(":");
					error.code = separator === -1 ? detail : detail.slice(0, separator);
					if (separator !== -1) {
						// `code:id,id` — the Host names every session the code applies to.
						const subjects = detail.slice(separator + 1).split(",")
							.map((id) => id.trim()).filter((id) => id !== "");
						if (subjects.length === 1) error.sessionId = subjects[0];
						if (subjects.length > 0) error.sessionIds = subjects;
					}
					throw error;
				}
				const bytes = await readBoundedDownload(response, EXPORT_DOWNLOAD_MAX_BYTES);
				const filename = exportFilename(disposition);
				const urlApi = window.URL;
				const url = urlApi.createObjectURL(new Blob([bytes], { type: "application/zip" }));
				const anchor = document.createElement("a");
				anchor.href = url;
				anchor.download = filename;
				anchor.hidden = true;
				document.body.appendChild(anchor);
				anchor.click();
				setTimeout(() => {
					try { urlApi.revokeObjectURL(url); } finally { anchor.remove(); }
				}, 0);
				return { filename, bytes: bytes.byteLength };
			}

		async function post(path, body, signal) {
			const res = await fetch(`${API_BASE}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json", [GUARD_HEADER]: "1" },
				body: JSON.stringify(body),
				signal
			});
			const parsed = await res.json().catch(() => ({}));
			if (!res.ok) {
				const error = new Error(parsed.message || `HTTP ${res.status}`);
				error.body = parsed;
				throw error;
			}
			return parsed;
		}
		//#endregion

		//#region icons (inline SVG, stroke = currentColor)
		function svgProps(size) {
			return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
		}
        function IconLineage({ root = false }) {
            if (!root && previewPrimitives.IconBranch) return (0, jsx.jsx)(previewPrimitives.IconBranch, { size: 16 });
            return (0, jsx.jsxs)("svg", { ...svgProps(16), children: root ? [
                (0, jsx.jsx)("path", { d: "M3 12h5m8 0h5" }), (0, jsx.jsx)("circle", { cx: 12, cy: 12, r: 4 }),
            ] : [
                (0, jsx.jsx)("path", { d: "M6 6v12m0-3c8 0 12-3 12-9" }),
                (0, jsx.jsx)("circle", { cx: 6, cy: 4, r: 2 }), (0, jsx.jsx)("circle", { cx: 6, cy: 20, r: 2 }), (0, jsx.jsx)("circle", { cx: 18, cy: 4, r: 2 }),
            ] });
        }
        function IconExpand({ size = 16 }) {
            if (previewPrimitives.IconExpand) return (0, jsx.jsx)(previewPrimitives.IconExpand, { size });
            return (0, jsx.jsx)("svg", { ...svgProps(size), children: (0, jsx.jsx)("path", {
                d: "M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5" }) });
        }
        function IconCopy({ size = 13 }) {
            if (previewPrimitives.IconCopy) return (0, jsx.jsx)(previewPrimitives.IconCopy, { size });
            return (0, jsx.jsxs)("svg", { ...svgProps(size), children: [
                (0, jsx.jsx)("rect", { x: 8, y: 8, width: 12, height: 12, rx: 2 }),
                (0, jsx.jsx)("path", { d: "M16 8V4H4v12h4" }),
            ] });
        }
        function ToolbarButton({ variant = "outline", icon, children, ...props }) {
            return (0, jsx.jsxs)(ControlButton, { ...props, variant, size: "sm", className: "dac-action-trigger", children: [icon, children] });
        }

        function IconRefresh({ size = 13, busy = false }) {
            if (busy && previewPrimitives.StateDot) return (0, jsx.jsx)(previewPrimitives.StateDot, { state: "ongoing", size });
            if (previewPrimitives.IconRefresh) return (0, jsx.jsx)(previewPrimitives.IconRefresh, { size });
            return (0, jsx.jsx)("svg", { ...svgProps(size), children: (0, jsx.jsx)("path", {
                d: "M20 7v5h-5M20 12a8 8 0 1 0-2.4 5.7M20 7l-3-3",
            }) });
        }
		function IconSearch({ size = 16 }) {
            if (previewPrimitives.IconSearch) return (0, jsx.jsx)(previewPrimitives.IconSearch, { size });
            // Match the official artwork on older Hosts without the public icon export.
			return (0, jsx.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", strokeWidth: 1, children: [
                (0, jsx.jsx)("path", { d: "M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z", stroke: "currentColor" }),
                (0, jsx.jsx)("path", { d: "M10.2991 10.3933L14.7783 14.8725", stroke: "currentColor" })
            ] });
		}
		function IconEye({ size = 16 }) {
			return (0, jsx.jsxs)("svg", { ...svgProps(size), children: [(0, jsx.jsx)("path", { d: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" }), (0, jsx.jsx)("circle", { cx: 12, cy: 12, r: 2.5 })] });
		}
		function IconFolder({ size = 16, open = false, strokeWidth = 1.6 }) {
            const Folder = open ? previewPrimitives.IconFolderOpen : previewPrimitives.IconFolderClose;
            if (Folder) return (0, jsx.jsx)(Folder, { size });
			return (0, jsx.jsx)("svg", { ...svgProps(size), strokeWidth, children: open
				? (0, jsx.jsxs)("g", { children: [
					(0, jsx.jsx)("path", { d: "M3 17V7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v2" }),
					(0, jsx.jsx)("path", { d: "M6 11h15l-3 9H3Z" }),
				] })
				: (0, jsx.jsx)("path", { d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" }) });
		}
        function WorkspaceDisclosureIcon({ open, primitives = previewPrimitives }) {
            const Folder = open ? primitives.IconFolderOpen : primitives.IconFolderClose;
            const Triangle = primitives.IconTriangleRight;
            return (0, jsx.jsxs)("span", { className: "dac-workspace-disclosure", "data-open": open, "aria-hidden": "true", children: [
                (0, jsx.jsx)("span", { className: "dac-workspace-folder", children: Folder
                    ? (0, jsx.jsx)(Folder, { size: 16 }) : (0, jsx.jsx)(IconFolder, { size: 16, open }) }),
                (0, jsx.jsx)("span", { className: "dac-workspace-arrow", children: Triangle
                    ? (0, jsx.jsx)(Triangle, { size: 16 }) : (0, jsx.jsx)("svg", { ...svgProps(16), fill: "currentColor", stroke: "none",
                        children: (0, jsx.jsx)("path", { d: "M9 5.5a.75.75 0 0 1 1.2-.6l7.4 6.5a.8.8 0 0 1 0 1.2l-7.4 6.5a.75.75 0 0 1-1.2-.6Z" }) }) }),
            ] });
        }
		function IconTrash({ size = 13, strokeWidth = 1.6 }) {
            if (previewPrimitives.IconTrash) return (0, jsx.jsx)(previewPrimitives.IconTrash, { size });
			return (0, jsx.jsxs)("svg", { ...svgProps(size), strokeWidth, children: [(0, jsx.jsx)("path", { d: "M4 7h16" }), (0, jsx.jsx)("path", { d: "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" }), (0, jsx.jsx)("path", { d: "M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" }), (0, jsx.jsx)("path", { d: "M10 11v6M14 11v6" })] });
		}
		function IconDots({ size = 16 }) {
            if (previewPrimitives.IconDots) return (0, jsx.jsx)(previewPrimitives.IconDots, { size });
			return (0, jsx.jsxs)("svg", { ...svgProps(size), fill: "currentColor", stroke: "none", children: [(0, jsx.jsx)("circle", { cx: 5, cy: 12, r: 1.6 }), (0, jsx.jsx)("circle", { cx: 12, cy: 12, r: 1.6 }), (0, jsx.jsx)("circle", { cx: 19, cy: 12, r: 1.6 })] });
		}
        // Older Hosts retain inline fallbacks when the shared artwork is unavailable.
        function IconFilter({ size = 16, useHostIcon = true }) {
            if (useHostIcon && previewPrimitives.IconFilter) return (0, jsx.jsx)(previewPrimitives.IconFilter, { size });
            return (0, jsx.jsx)("svg", { ...svgProps(size), children: (0, jsx.jsx)("path", { d: "M3 6h18M7 12h10M10 18h4" }) });
        }
        function IconClock({ size = 16 }) {
            if (previewPrimitives.IconClock) return (0, jsx.jsx)(previewPrimitives.IconClock, { size });
            return (0, jsx.jsxs)("svg", { ...svgProps(size), children: [(0, jsx.jsx)("circle", { cx: 12, cy: 12, r: 10 }), (0, jsx.jsx)("path", { d: "M12 6v6l4 2" })] });
        }
        function IconTag({ size = 16 }) {
            return (0, jsx.jsxs)("svg", { ...svgProps(size), children: [(0, jsx.jsx)("path", { d: "m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" }), (0, jsx.jsx)("path", { d: "M7 7h.01" })] });
        }
        function IconCheck({ size = 16 }) {
            if (previewPrimitives.IconCheck) return (0, jsx.jsx)(previewPrimitives.IconCheck, { size });
            return (0, jsx.jsx)("svg", { ...svgProps(size), children: (0, jsx.jsx)("path", { d: "m20 6-11 11-5-5" }) });
        }
		function IconChevron({ size = 13 }) {
            if (previewPrimitives.IconChevron) return (0, jsx.jsx)(previewPrimitives.IconChevron, { size });
			return (0, jsx.jsx)("svg", { ...svgProps(size), children: (0, jsx.jsx)("path", { d: "m6 9 6 6 6-6" }) });
		}
		function IconArchive({ size = 40, strokeWidth = 1.2 }) {
            if (previewPrimitives.IconArchive) return (0, jsx.jsx)(previewPrimitives.IconArchive, { size });
			return (0, jsx.jsxs)("svg", { ...svgProps(size), strokeWidth, children: [(0, jsx.jsx)("rect", { x: 3, y: 4, width: 18, height: 5, rx: 1 }), (0, jsx.jsx)("path", { d: "M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" }), (0, jsx.jsx)("path", { d: "M10 13h4" })] });
		}
		function IconChat({ size = 16, strokeWidth = 1.6 }) {
			return (0, jsx.jsx)("svg", { ...svgProps(size), strokeWidth, children: (0, jsx.jsx)("path", { d: "M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" }) });
		}
		function IconClose({ size = 14 }) {
            if (previewPrimitives.IconClose) return (0, jsx.jsx)(previewPrimitives.IconClose, { size });
			return (0, jsx.jsx)("svg", { ...svgProps(size), children: (0, jsx.jsx)("path", { d: "M6 6l12 12M18 6 6 18" }) });
		}
			function IconCheckCircle({ size = 14 }) {
            if (previewPrimitives.IconCheckCircle) return (0, jsx.jsx)(previewPrimitives.IconCheckCircle, { size });
				return (0, jsx.jsxs)("svg", { ...svgProps(size), children: [(0, jsx.jsx)("circle", { cx: 12, cy: 12, r: 9 }), (0, jsx.jsx)("path", { d: "m8.5 12.2 2.4 2.4 4.6-5" })] });
			}
			function IconDownload({ size = 14 }) {
                if (previewPrimitives.IconDownload) return (0, jsx.jsx)(previewPrimitives.IconDownload, { size });
				return (0, jsx.jsxs)("svg", { ...svgProps(size), children: [(0, jsx.jsx)("path", { d: "M12 3v12" }), (0, jsx.jsx)("path", { d: "m7 10 5 5 5-5" }), (0, jsx.jsx)("path", { d: "M5 20h14" })] });
			}
			function IconUpload({ size = 15 }) {
				return (0, jsx.jsxs)("svg", { ...svgProps(size), children: [(0, jsx.jsx)("path", { d: "M12 21V9" }), (0, jsx.jsx)("path", { d: "m7 14 5-5 5 5" }), (0, jsx.jsx)("path", { d: "M5 3h14" })] });
			}
        function IconInfo({ size = 16 }) {
            return (0, jsx.jsxs)("svg", { ...svgProps(size), strokeWidth: 1.8, children: [
                (0, jsx.jsx)("circle", { cx: 12, cy: 12, r: 9 }),
                (0, jsx.jsx)("path", { d: "M12 11v6M12 7v1" }),
            ] });
        }
		const EDIT_ICON_SPEC = {
			size: 16,
			viewBox: "0 0 1024 1024",
			fill: "currentColor",
			paths: [
				"M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640V512z",
				"m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.84-331.84a96 96 0 0 1 135.808 0z"
			]
		};
		function IconEdit({ size = EDIT_ICON_SPEC.size }) {
            if (previewPrimitives.IconEdit) return (0, jsx.jsx)(previewPrimitives.IconEdit, { size });
			return (0, jsx.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: EDIT_ICON_SPEC.viewBox,
				fill: EDIT_ICON_SPEC.fill,
				"aria-hidden": "true",
				children: EDIT_ICON_SPEC.paths.map((d) => (0, jsx.jsx)("path", { d }, d))
			});
		}
		//#endregion

		//#region components
		function EmptyState({ icon: Icon, children }) {
			return (0, jsx.jsxs)("div", {
				className: "dac-empty", role: "status",
				children: [(0, jsx.jsx)(Icon, { size: 40, strokeWidth: 1.2 }), (0, jsx.jsx)("span", { children })]
			});
		}

        function createArchiveViewNavigation() {
            let pending = false;
            const listeners = new Set();
            return {
                request() { pending = true; for (const listener of listeners) listener(); },
                consume() { const requested = pending; pending = false; return requested; },
                subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
            };
        }

        function archiveSettingsInstance(slots) {
            const entry = slots.entriesOfSlot?.("sidebar.settings").find(item => item.store);
            const handle = typeof entry?.store === "function" ? entry.store() : entry?.store;
            return handle?.create?.();
        }

        function archiveSettingsOpener(slots) {
            const instance = archiveSettingsInstance(slots);
            if (typeof instance?.actions?.openSection !== "function") return null;
            return () => instance.actions.openSection("archived-chats");
        }

        function preserveArchiveSettings(slots, { target = document, content,
            requestFrame = callback => window.requestAnimationFrame(callback),
            cancelFrame = id => window.cancelAnimationFrame(id) } = {}) {
            const shell = archiveSettingsInstance(slots);
            const inactive = { finish() {}, dispose() {} };
            if (typeof shell?.getSnapshot !== "function" || typeof shell.subscribe !== "function"
                || typeof shell.actions?.openSection !== "function") return inactive;
            const initial = shell.getSnapshot();
            if (!initial.open || initial.activeId !== "archived-chats") return inactive;
            let active = true, frame = null;
            let unsubscribe = () => {};
            const dispose = () => {
                if (!active) return;
                active = false;
                unsubscribe();
                target.removeEventListener?.("pointerdown", onInput, true);
                target.removeEventListener?.("click", onInput, true);
                target.removeEventListener?.("keydown", onInput, true);
                if (frame !== null) cancelFrame(frame);
            };
            const onInput = event => {
                const ownModal = '[data-shortcut-modal="dsh-archived-chats"]';
                const ownedPortal = event.target?.closest?.(ownModal)
                    || event.target?.closest?.('[role="presentation"]')?.querySelector?.(ownModal)
                    || event.target?.closest?.('.dac-native-menu,.dac-toolbar-native-menu');
                if ((!content?.contains?.(event.target) && !ownedPortal) || event.key === "Escape"
                    || (event.key === "," && (event.metaKey || event.ctrlKey))) dispose();
            };
            unsubscribe = shell.subscribe(() => {
                const current = shell.getSnapshot();
                if (!active) return;
                if (current.open && current.activeId !== "archived-chats") { dispose(); return; }
                // Archiving the main chat can activate Host onboarding, whose
                // effect closes settings. Restore the same shared shell state
                // before React unmounts the in-flight archive transaction.
                if (!current.open) shell.actions.openSection("archived-chats");
            });
            // Outside navigation and explicit dismissal belong to the user.
            // Repeated clicks within the archive page keep the transaction safe.
            target.addEventListener?.("pointerdown", onInput, true);
            target.addEventListener?.("click", onInput, true);
            target.addEventListener?.("keydown", onInput, true);
            return { dispose, finish() {
                if (!active || frame !== null) return;
                // Let the Host's navigation effects settle through the next paint.
                frame = requestFrame(() => { frame = requestFrame(dispose); });
            } };
        }

        // Extend the keyed official archive presentations, retaining their injected
        // business actions, store, renderer, timing and native Toast factory.
        function registerArchiveToastShortcut(ctx, t, navigation) {
            const slots = ctx.slots;
            if (!["entries", "entriesOfSlot", "subscribe"].every(name => typeof slots[name] === "function")) return;
            return slots.inject("workspace.toast", () => {
                const replacements = new Map();
                const wrappers = new WeakSet();
                let syncing = false;
                let disposed = false;
                const sync = () => {
                    if (syncing || disposed) return;
                    syncing = true;
                    try {
                        for (const key of ["archived", "stoppedAndArchived"]) {
                            const original = slots.entries("workspace.toast").find(entry => entry.options.key === key && !wrappers.has(entry.component));
                            const previous = replacements.get(key);
                            if (previous?.original === original) continue;
                            previous?.dispose();
                            replacements.delete(key);
                            if (!original || typeof original.component !== "function" || typeof original.inject !== "function" || original.children) continue;
                            const OfficialArchiveToast = original.component;
                            function ArchiveToastShortcut(props) {
                                const open = archiveSettingsOpener(slots);
                                if (!open || typeof props.display !== "function") return (0, jsx.jsx)(OfficialArchiveToast, { ...props });
                                return (0, jsx.jsx)(OfficialArchiveToast, { ...props, display: (...args) => {
                                    const fields = props.display(...args);
                                    return { ...fields, actions: [...fields.actions ?? [], {
                                        label: t("archive.view"),
                                        onClick: () => {
                                            const openCurrent = archiveSettingsOpener(slots);
                                            if (!openCurrent) return;
                                            openCurrent();
                                            navigation.request();
                                            props.dismissToast();
                                        },
                                    }] };
                                } });
                            }
                            wrappers.add(ArchiveToastShortcut);
                            const dispose = slots.register({
                                name: "workspace.toast", key, priority: (original.options.priority ?? 0) - 1,
                                store: original.store, locale: original.locale, inject: original.inject,
                            }, ArchiveToastShortcut);
                            replacements.set(key, { original, dispose });
                        }
                    } finally { syncing = false; }
                };
                const unsubscribe = slots.subscribe("workspace.toast", sync);
                const dispose = () => {
                    disposed = true;
                    unsubscribe();
                    for (const replacement of replacements.values()) replacement.dispose();
                };
                try { sync(); }
                catch (error) { dispose(); throw error; }
                return dispose;
            });
        }

		function NativeArchiveNotice({ notice, t, onViewArchived, onDismiss }) {
			const Toast = previewPrimitives.Toast;
			if (Toast === null) return null;
			return (0, jsx.jsx)(Toast, {
				key: notice.sequence,
				text: notice.text,
				tone: "success",
				holdMs: 6000,
				actions: [{ label: t("archive.viewArchived"), onClick: onViewArchived }],
				onDone: onDismiss,
			});
		}

        function FilterSelect({ t, value, onChange, options, ariaLabel, icon = IconFilter, optionIcons = true }) {
            const selected = options.find(option => option.value === value);
            return (0, jsx.jsx)(ChatActionMenu, {
                t, filter: true, title: selected?.label ?? ariaLabel, triggerLabel: ariaLabel,
                items: options.flatMap((option, index) => [
                    ...(index > 0 && (option.separator || options[index - 1].separatorAfter)
                        ? [{ type: "separator", id: `separator-${index}` }] : []),
                    { id: `option-${option.value}`, label: option.disabled && option.hint && previewPrimitives.Tooltip
                        ? (0, jsx.jsx)(previewPrimitives.Tooltip, { label: option.hint, portal: true,
                            children: (0, jsx.jsx)("span", { children: option.label }) }) : option.label,
                        disabled: option.disabled,
                        icon: optionIcons && option.showIcon !== false ? (0, jsx.jsx)(option.icon ?? icon, { size: 14 }) : undefined },
                ]),
                selectedIds: [`option-${value}`],
                onSelect: id => {
                    const option = options.find(option => `option-${option.value}` === id);
                    if (option && !option.disabled) onChange(option.value);
                },
                trigger: [(0, jsx.jsxs)("span", { className: "dac-filter-label", children: [
                    (0, jsx.jsx)(selected?.icon ?? icon, { size: 16 }),
                    (0, jsx.jsx)("span", { children: selected?.label ?? ariaLabel }),
                ] }), (0, jsx.jsx)(IconChevron, {})],
                children: options.flatMap((option, index) => [
                    ...(index > 0 && (option.separator || options[index - 1].separatorAfter) ? [(0, jsx.jsx)("div", { role: "separator", className: "dac-menu-separator" }, `${option.value}-separator`)] : []),
                    (0, jsx.jsxs)(HostMenuItem, {
                        type: "button", className: `dac-menu-item${option.heading ? " dac-workspace-heading" : ""}`, "aria-pressed": value === option.value,
                        "data-filter-value": option.value, "aria-label": option.label, disabled: option.disabled, title: option.hint ?? option.label,
                        onClick: () => onChange(option.value), children: [
                            (0, jsx.jsxs)("span", { className: "dac-filter-label", children: [
                                optionIcons && option.showIcon !== false && (0, jsx.jsx)(option.icon ?? icon, { size: 16 }), (0, jsx.jsx)("span", { children: option.label }),
                            ] }), value === option.value && (0, jsx.jsx)(IconCheck, {}),
                        ],
                    }, option.value),
                ]),
            });
        }

        function ChatTypeSortFilter({ t, typeFilter, onTypeChange, sortMode, onSortChange }) {
            return (0, jsx.jsxs)(ChatActionMenu, {
                t, filter: true, title: t(`sort.${sortMode}`), triggerLabel: t("filter.allChats"),
                items: [
                    { type: "label", id: "type", text: t("filter.type") },
                    ...[["all", "filter.allChats"], ["normal", "filter.normal"], ["subagent", "filter.subagent"]]
                        .map(([value, label]) => ({ id: `type:${value}`, label: t(label) })),
                    { type: "separator", id: "sort-separator" },
                    { type: "label", id: "sort", text: t("sort.label") },
                    ...[["newest", "sort.newest"], ["oldest", "sort.oldest"], ["title", "sort.title"]]
                        .map(([value, label]) => ({ id: `sort:${value}`, label: t(label) })),
                ],
                selectedIds: [`type:${typeFilter}`, `sort:${sortMode}`],
                onSelect: id => {
                    if (id.startsWith("type:")) onTypeChange(id.slice(5));
                    else onSortChange(id.slice(5));
                },
                trigger: [(0, jsx.jsxs)("span", { className: "dac-filter-label", children: [
                    (0, jsx.jsx)(IconFilter, { useHostIcon: false }),
                    (0, jsx.jsx)("span", { children: t(typeFilter === "all" ? "filter.allChats" : `filter.${typeFilter}`) }),
                ] }), (0, jsx.jsx)(IconChevron, {})],
                children: [
                    { label: t("filter.type"), value: typeFilter, onChange: onTypeChange, options: [["all", "filter.allChats"], ["normal", "filter.normal"], ["subagent", "filter.subagent"]] },
                    { label: t("sort.label"), value: sortMode, onChange: onSortChange, options: [["newest", "sort.newest"], ["oldest", "sort.oldest"], ["title", "sort.title"]] },
                ].map(section => (0, jsx.jsxs)("div", { role: "group", "aria-label": section.label, className: "dac-filter-options", children: [
                    (0, jsx.jsx)("div", { className: "dac-filter-heading", children: section.label }),
                    ...section.options.map(([value, label]) => (0, jsx.jsxs)(HostMenuItem, {
                        type: "button", className: "dac-menu-item", "aria-pressed": section.value === value, "data-filter-value": value,
                        onClick: () => section.onChange(value), children: [
                            (0, jsx.jsx)("span", { className: "dac-filter-label", children: (0, jsx.jsx)("span", { children: t(label) }) }),
                            section.value === value && (0, jsx.jsx)(IconCheck, {}),
                        ],
                    }, value)),
                ] }, section.label)),
            });
        }

        function WorkspaceFilter({ t, value, onChange, workspaces, scheduleStatus }) {
            return (0, jsx.jsx)(FilterSelect, {
                t, value, onChange, ariaLabel: t("filter.allProjects"), icon: IconFolder,
                options: [
                    { value: "all", label: t("filter.allProjects"), heading: true, showIcon: false, separatorAfter: true },
                    ...workspaces.filter(row => row.value !== "ungrouped").map(row => ({ value: row.value, label: workspaceDisplayTitle(t, row.title) || row.value })),
                    { value: "ungrouped", label: t("group.noProject"), icon: IconFolder, separator: true },
                    { value: "__dac_scheduled__", label: t("filter.scheduled"), icon: IconClock,
                        disabled: scheduleStatus !== "ready", hint: scheduleStatus === "ready" ? undefined : t(scheduleStatus === "unavailable" ? "filter.scheduleUnavailable" : "filter.scheduleUnsupported") },
                ],
            });
        }

		function Select({ value, onChange, options, ariaLabel, fill = false, disabled = false }) {
			return (0, jsx.jsxs)("span", {
				className: `dac-select-wrap${fill ? " dac-select-wrap-fill" : ""}`,
				children: [
					(0, jsx.jsx)("select", {
						className: `dac-select${fill ? " dac-select-fill" : ""}`,
						disabled, value,
						"aria-label": ariaLabel,
						onChange: (e) => onChange(e.target.value),
						children: options.map((o) => (0, jsx.jsx)("option", { value: o.value, children: o.label }, o.value))
					}),
					(0, jsx.jsx)("span", { className: "dac-chevron", children: (0, jsx.jsx)(IconChevron, {}) })
				]
			});
		}

			function SelectionCheckbox({ checked, indeterminate = false, disabled = false, ariaLabel, onChange, ...inputProps }) {
			const inputRef = _react.useRef(null);
			_react.useEffect(() => {
				if (inputRef.current !== null) inputRef.current.indeterminate = indeterminate;
			}, [indeterminate]);
			return (0, jsx.jsx)("input", {
				ref: inputRef,
				type: "checkbox",
				className: "dac-checkbox",
				checked,
				disabled,
					"aria-label": ariaLabel,
					"aria-checked": indeterminate ? "mixed" : checked,
					onChange: (event) => onChange(event.target.checked),
					...inputProps
				});
			}

			function WorkspaceArchiveChooserDialog({ t, onChoose, onClose }) {
				const [state, setState] = _react.useState({ status: "loading", workspaces: [] });
				const [selected, setSelected] = _react.useState(() => new Set());
				const dialogRef = _react.useRef(null);
			const cancelRef = _react.useRef(null);
			const mountedRef = _react.useRef(false);
			const load = _react.useCallback(async () => {
				setState({ status: "loading", workspaces: [] });
					try {
						const result = await fetchWorkspaceArchiveWorkspaces();
						if (!mountedRef.current) return;
						const workspaces = (Array.isArray(result?.workspaces) ? result.workspaces : [])
							.filter((workspace) => typeof workspace?.id === "string" && workspace.id !== "" && Number(workspace.eligibleCount) > 0);
						setSelected(new Set());
						setState({ status: "ready", workspaces });
				} catch {
					if (mountedRef.current) setState({ status: "error", workspaces: [] });
				}
			}, []);
			const containKey = (event) => {
				if (event.key === "Escape") {
					event.preventDefault?.(); event.stopPropagation?.(); event.nativeEvent?.stopImmediatePropagation?.(); onClose?.();
					return;
				}
				if (event.key !== "Tab") return;
				const dialog = dialogRef.current;
				if (dialog === null) return;
					const focusable = [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')];
				if (focusable.length === 0) { event.preventDefault?.(); dialog.focus?.(); return; }
				const first = focusable[0]; const last = focusable[focusable.length - 1]; const active = document.activeElement;
				const inside = typeof dialog.contains === "function" ? dialog.contains(active) : focusable.includes(active);
				if (event.shiftKey && (active === first || !inside)) { event.preventDefault?.(); last.focus?.(); }
				else if (!event.shiftKey && (active === last || !inside)) { event.preventDefault?.(); first.focus?.(); }
			};
			_react.useEffect(() => {
				mountedRef.current = true;
				void load();
				return () => { mountedRef.current = false; };
			}, [load]);
			_react.useEffect(() => {
				cancelRef.current?.focus?.();
				if (!previewPrimitives.Modal) document.addEventListener("keydown", containKey);
				return () => document.removeEventListener("keydown", containKey);
				}, [onClose]);
				const countText = (key, count) => t(key).replace("{count}", String(Number.isFinite(count) ? count : 0));
				const selectedCount = selected.size;
				const allSelected = state.workspaces.length > 0 && selectedCount === state.workspaces.length;
				const someSelected = selectedCount > 0 && !allSelected;
				const toggleWorkspace = (workspaceId, checked) => setSelected((current) => {
					const next = new Set(current);
					if (checked) next.add(workspaceId); else next.delete(workspaceId);
					return next;
				});
				const toggleAll = (checked) => setSelected(checked ? new Set(state.workspaces.map((workspace) => String(workspace.id))) : new Set());
				const confirmSelection = () => {
					if (selectedCount === 0) return;
					onChoose?.(state.workspaces
						.filter((workspace) => selected.has(String(workspace.id)))
						.map((workspace) => ({ id: String(workspace.id), title: typeof workspace.title === "string" ? workspace.title : null })));
				};
				return (0, jsx.jsx)(HostModal, { title: t("workspaceArchive.chooseTitle"), className: "dac-confirm-overlay dac-action-confirm-overlay", onClick: onClose, children: (0, jsx.jsxs)("div", {
				ref: dialogRef, className: "dac-confirm dac-workspace-dialog", role: previewPrimitives.Modal ? undefined : "dialog", "aria-modal": previewPrimitives.Modal ? undefined : "true", "aria-labelledby": "dac-workspace-chooser-title", tabIndex: -1,
				onClick: (event) => event.stopPropagation(), onKeyDown: containKey,
				children: [
					(0, jsx.jsxs)("div", { className: "dac-preview-head", children: [
						(0, jsx.jsx)("strong", { id: "dac-workspace-chooser-title", children: t("workspaceArchive.chooseTitle") }),
						(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-iconbtn", "aria-label": t("workspaceArchive.close"), onClick: onClose, children: (0, jsx.jsx)(IconClose, { size: 14 }) })
					] }),
					(0, jsx.jsxs)("div", { className: "dac-workspace-body", children: [
						(0, jsx.jsx)("p", { className: "dac-workspace-copy", children: t("workspaceArchive.chooseBody") }),
						state.status === "loading" && (0, jsx.jsx)("p", { role: "status", className: "dac-workspace-skipped-live", children: t("workspaceArchive.loading") }),
						state.status === "error" && (0, jsx.jsxs)("div", { className: "dac-error", role: "status", children: [
							(0, jsx.jsx)("span", { children: t("workspaceArchive.loadError") }),
							(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn", onClick: () => { void load(); }, children: t("workspaceArchive.retry") })
						] }),
						state.status === "ready" && state.workspaces.length === 0 && (0, jsx.jsx)("p", { role: "status", className: "dac-workspace-skipped-live", children: t("workspaceArchive.noWorkspaces") }),
							state.status === "ready" && state.workspaces.length > 0 && (0, jsx.jsxs)("ul", { className: "dac-workspace-choices", children: [
								(0, jsx.jsx)("li", { children: (0, jsx.jsxs)("label", { className: "dac-workspace-choice dac-workspace-choice-all", children: [
									(0, jsx.jsx)(SelectionCheckbox, {
										checked: allSelected, indeterminate: someSelected,
										ariaLabel: t("workspaceArchive.selectAll"),
										"data-workspace-archive-select-all": "1",
										onChange: toggleAll,
									}),
									(0, jsx.jsx)("span", { className: "dac-workspace-choice-title", children: t("workspaceArchive.selectAll") })
								] }) }, "all"),
								...state.workspaces.map((workspace) => {
									const workspaceId = String(workspace.id);
									const checked = selected.has(workspaceId);
									const title = typeof workspace.title === "string" && workspace.title !== "" ? workspaceDisplayTitle(t, workspace.title) : workspaceId === "__dac_ungrouped__" ? t("group.noProject") : workspaceId;
									return (0, jsx.jsx)("li", { children: (0, jsx.jsxs)("label", {
										className: `dac-workspace-choice${checked ? " dac-workspace-choice-selected" : ""}`,
										children: [
											(0, jsx.jsx)(SelectionCheckbox, {
												checked, ariaLabel: title,
												"data-workspace-archive-choice": workspaceId,
												onChange: (next) => toggleWorkspace(workspaceId, next),
											}),
											(0, jsx.jsx)("span", { className: "dac-workspace-choice-title", children: title }),
											(0, jsx.jsxs)("span", { className: "dac-workspace-choice-counts", children: [
												(0, jsx.jsx)("span", { children: countText("workspaceArchive.eligibleCount", workspace.eligibleCount) }),
												Number(workspace.liveCount) > 0 && (0, jsx.jsx)("span", { children: countText("workspaceArchive.liveCount", workspace.liveCount) })
											] })
										]
									}) }, workspaceId);
								})
							] }),
						] }),
						(0, jsx.jsxs)("div", { className: "dac-workspace-actions", children: [
							(0, jsx.jsx)(ControlButton, { ref: cancelRef, type: "button", className: "dac-btn", onClick: onClose, children: t("confirm.cancel") }),
							(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn-primary", disabled: state.status !== "ready" || selectedCount === 0, "data-workspace-archive-choose-confirm": "1", onClick: confirmSelection, children: t("workspaceArchive.chooseConfirm") })
						] })
					]
				}) });
			}

			function WorkspaceArchiveDialog({ t, workspaces, workspaceId, workspaceTitle, restoreFocus, onClose, onApplied, onEmpty, beginArchiveInteraction, includeActive = false, scope }) {
				const targets = _react.useMemo(() => {
					const source = Array.isArray(workspaces) ? workspaces : [{ id: workspaceId, title: workspaceTitle }];
					const seen = new Set();
					return source.flatMap((workspace) => {
						const id = typeof workspace?.id === "string" ? workspace.id : "";
						if (id === "" || seen.has(id)) return [];
						seen.add(id);
						return [{ id, title: typeof workspace?.title === "string" ? workspace.title : null, ...(Array.isArray(workspace.sessionIds) ? { sessionIds: workspace.sessionIds } : {}) }];
					});
				}, [workspaces, workspaceId, workspaceTitle]);
				const targetKey = JSON.stringify([includeActive, targets.map(({ id, sessionIds }) => [id, sessionIds])]);
				const [previews, setPreviews] = _react.useState([]);
				const [result, setResult] = _react.useState(null);
			const [stage, setStage] = _react.useState("preparing");
			const [busy, setBusy] = _react.useState(false);
			const [error, setError] = _react.useState(null);
			const dialogRef = _react.useRef(null);
			const cancelRef = _react.useRef(null);
			const busyRef = _react.useRef(false);
				const mountedRef = _react.useRef(false);
				const preparationRequestRef = _react.useRef(0);
					const applyRequestRef = _react.useRef(0);
					const targetRef = _react.useRef(targetKey);
					const onEmptyRef = _react.useRef(onEmpty);
					const returningToChooserRef = _react.useRef(false);
				targetRef.current = targetKey;
				onEmptyRef.current = onEmpty;
			busyRef.current = busy;
			const safeLabel = (item) => typeof item?.title === "string" && item.title.trim() !== "" ? item.title : String(item?.id ?? "");
			const safeReason = (reason, status) => {
				const key = typeof reason === "string" ? `workspaceArchive.reason.${reason}` : typeof status === "string" ? `workspaceArchive.status.${status}` : "workspaceArchive.reason.unknown";
				const value = t(key);
				return value === key ? t("workspaceArchive.reason.unknown") : value;
			};
			const errorText = error?.body?.error === "workspace-archive-unsupported" ? t("workspaceArchive.unsupported") : t("workspaceArchive.error");
			const directArchive = scope === "chat" && targets.length === 1 && targets[0].sessionIds?.length === 1;
            const requiresStop = previews.some(item => Array.isArray(item.stopSessionIds) && item.stopSessionIds.length > 0);
            const showDialog = !directArchive || stage === "error" || stage === "result" || (stage === "confirm" && requiresStop);
            const close = () => { if (!busyRef.current) onClose?.(); };
			const containKey = (event) => {
				if (event.key === "Escape") {
					event.preventDefault?.(); event.stopPropagation?.(); event.nativeEvent?.stopImmediatePropagation?.(); close();
					return;
				}
				if (event.key !== "Tab") return;
				const dialog = dialogRef.current;
				if (dialog === null) return;
				const focusable = [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')];
				if (focusable.length === 0) { event.preventDefault?.(); dialog.focus?.(); return; }
				const first = focusable[0]; const last = focusable[focusable.length - 1]; const active = document.activeElement;
				const inside = typeof dialog.contains === "function" ? dialog.contains(active) : focusable.includes(active);
				if (event.shiftKey && (active === first || !inside)) { event.preventDefault?.(); last.focus?.(); }
				else if (!event.shiftKey && (active === last || !inside)) { event.preventDefault?.(); first.focus?.(); }
			};
			_react.useEffect(() => {
				if (!showDialog) return;
				cancelRef.current?.focus?.();
				if (!previewPrimitives.Modal) document.addEventListener("keydown", containKey);
					return () => {
						if (!previewPrimitives.Modal) document.removeEventListener("keydown", containKey);
						if (!returningToChooserRef.current) restoreFocus?.();
				};
			}, [restoreFocus, showDialog]);
				const prepare = _react.useCallback(async () => {
					const request = ++preparationRequestRef.current;
					const requestKey = targetKey;
					setPreviews([]); setResult(null); setError(null); setStage("preparing");
					try {
						const prepared = await Promise.all(targets.map((workspace) => previewWorkspaceArchive(workspace.id, workspace.sessionIds, includeActive)));
						if (!mountedRef.current || preparationRequestRef.current !== request || targetRef.current !== requestKey) return;
							const available = prepared.filter((item) => Array.isArray(item?.sessions) && item.sessions.length > 0);
							if (available.length === 0) {
								returningToChooserRef.current = true;
								onEmptyRef.current?.();
							return;
						}
						setPreviews(available);
						setStage("confirm");
					} catch (reason) {
						if (mountedRef.current && preparationRequestRef.current === request && targetRef.current === requestKey) { setError(reason); setStage("error"); }
					}
				}, [targetKey, targets]);
			_react.useEffect(() => {
				mountedRef.current = true;
				void prepare();
				return () => {
					mountedRef.current = false;
					preparationRequestRef.current += 1;
					applyRequestRef.current += 1;
				};
				}, [prepare]);
				const apply = async () => {
					const validPreviews = previews.filter((item) => Array.isArray(item?.sessions) && item.sessions.length > 0
						&& typeof item?.token === "string" && typeof item?.nonce === "string");
					if (busyRef.current || stage !== "confirm" || validPreviews.length !== previews.length || validPreviews.length === 0) return;
					const request = ++applyRequestRef.current;
					busyRef.current = true; setBusy(true); setError(null);
					const combined = { workspace: null, archived: [], skipped: [], failed: [] };
					let interaction;
					try {
						interaction = beginArchiveInteraction?.();
						for (const prepared of validPreviews) {
							try {
								const applied = await applyWorkspaceArchive(prepared.token, prepared.nonce, Array.isArray(prepared.stopSessionIds) && prepared.stopSessionIds.length > 0);
								for (const key of ["archived", "skipped", "failed"]) {
									if (Array.isArray(applied?.[key])) combined[key].push(...applied[key]);
								}
							} catch (reason) {
								if (validPreviews.length === 1) throw reason;
								const failureReason = typeof reason?.body?.error === "string"
									? reason.body.error
									: typeof reason?.code === "string" ? reason.code : "unknown";
								for (const session of prepared.sessions) combined.failed.push({
									id: session.id,
									title: session.title,
									reason: failureReason,
								});
							}
						}
						if (!mountedRef.current || applyRequestRef.current !== request) return;
						const archived = combined.archived;
						const skipped = combined.skipped;
						const failed = combined.failed;
						const fullSuccess = archived.length > 0 && skipped.length === 0 && failed.length === 0;
						if (fullSuccess && (directArchive || previewPrimitives.Toast !== null)) {
							try { await onApplied?.(combined); } catch { /* refresh failure must not hold a completed dialog open */ }
							if (mountedRef.current && applyRequestRef.current === request) onClose?.();
							return;
						}
						setResult(combined); setStage("result");
						if (archived.length > 0) try { await onApplied?.(combined); } catch { /* the completed result remains readable */ }
					} catch (reason) {
						if (combined.archived.length > 0) try { await onApplied?.(combined); } catch { /* refresh best effort after partial completion */ }
						if (mountedRef.current && applyRequestRef.current === request) { setPreviews([]); setError(reason); setStage("error"); }
					} finally {
						interaction?.finish();
					if (mountedRef.current && applyRequestRef.current === request) { busyRef.current = false; setBusy(false); }
				}
			};
				// A single idle chat follows the Host's direct archive interaction.
                // The prepared response, not cached row state, decides whether stopping needs consent.
                _react.useEffect(() => {
                    if (directArchive && stage === "confirm" && !requiresStop) void apply();
                }, [directArchive, stage, previews, requiresStop]);
                const previewSessions = previews.flatMap((item) => Array.isArray(item?.sessions) ? item.sessions : []);
				const previewSkipped = previews.flatMap((item) => Array.isArray(item?.skipped) ? item.skipped : []);
				const count = previewSessions.length;
				const skippedLiveCount = previewSkipped.filter((item) => item?.reason === "session-live").length;
				const targetTitle = workspaceDisplayTitle(t, safeLabel(previews[0]?.workspace) || targets[0]?.title || targets[0]?.id || "");
                const globalScope = scope === "all";
                const singleSession = targets.length === 1 && targets[0].sessionIds?.length === 1;
                const multipleWorkspaces = targets.length > 1;
                const confirmTitle = t(requiresStop
                    ? (globalScope ? "scope.stopArchiveAll" : singleSession || count === 1 ? "scope.stopArchiveOne" : "scope.stopArchiveMany")
                    : globalScope ? "scope.archiveAll"
                    : singleSession ? "scope.archiveOne"
                    : multipleWorkspaces ? "scope.archiveSelectedWorkspaces" : "workspaceArchive.confirmTitle");
                const scopeBody = globalScope ? t("scope.archiveAllBody")
                    : singleSession ? t("scope.archiveOneBody")
                    : multipleWorkspaces ? t("workspaceArchive.confirmBodyMany") : t("workspaceArchive.confirmBody", { workspace: targetTitle });
                const confirmBody = requiresStop ? `${scopeBody} ${t("scope.stopArchiveBody")}` : scopeBody;
			const skippedLiveText = t("workspaceArchive.skippedLive").replace("{count}", String(skippedLiveCount));
			const skippedLiveNotice = skippedLiveCount > 0 && (0, jsx.jsx)("p", { className: "dac-workspace-skipped-live", "data-workspace-archive-skipped-live": "1", children: skippedLiveText });
			const resultRows = (label, rows) => {
				const visibleRows = Array.isArray(rows) ? rows : [];
				if (visibleRows.length === 0) return null;
				return (0, jsx.jsxs)("section", { className: "dac-workspace-result-group", children: [
					(0, jsx.jsx)("strong", { children: label }),
					(0, jsx.jsx)("ul", { children: visibleRows.map((item) => (0, jsx.jsx)("li", { children: typeof item === "string" ? item : `${safeLabel(item)} · ${safeReason(item?.reason, item?.status)}` }, typeof item === "string" ? item : `${item?.id}:${item?.reason ?? item?.status ?? ""}`)) })
				] });
			};
			if (!showDialog) return null;
			return (0, jsx.jsx)(HostModal, { title: stage === "confirm" ? confirmTitle : stage === "result" ? t("workspaceArchive.result") : t("workspaceArchive.action"), className: "dac-confirm-overlay dac-action-confirm-overlay", onClick: close, children: (0, jsx.jsxs)("div", {
				ref: dialogRef, className: "dac-confirm dac-workspace-dialog", role: previewPrimitives.Modal ? undefined : "dialog", "aria-modal": previewPrimitives.Modal ? undefined : "true", "aria-labelledby": "dac-workspace-archive-title", tabIndex: -1,
				onClick: (event) => event.stopPropagation(), onKeyDown: containKey,
				children: [
					(0, jsx.jsxs)("div", { className: "dac-preview-head", children: [
						(0, jsx.jsx)("strong", { id: "dac-workspace-archive-title", children: stage === "confirm" ? confirmTitle : stage === "result" ? t("workspaceArchive.result") : t("workspaceArchive.action") }),
						(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-iconbtn", disabled: busy, "aria-label": t("workspaceArchive.close"), onClick: close, children: (0, jsx.jsx)(IconClose, { size: 14 }) })
					] }),
					stage === "preparing" && (0, jsx.jsx)("div", { className: "dac-workspace-body", role: "status", children: (0, jsx.jsx)("p", { className: "dac-workspace-copy", children: t("workspaceArchive.loading") }) }),
					stage === "confirm" && (0, jsx.jsxs)("div", { className: "dac-workspace-body", children: [
						(0, jsx.jsx)("p", { className: "dac-workspace-copy", children: confirmBody }),
						skippedLiveNotice,
					] }),
					stage === "result" && (0, jsx.jsxs)("div", { className: "dac-workspace-body", "data-workspace-archive-result": "1", children: [
						resultRows(t("workspaceArchive.archived"), result?.archived),
						resultRows(t("workspaceArchive.skipped"), result?.skipped),
						resultRows(t("workspaceArchive.failed"), result?.failed),
						(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn-primary", onClick: close, children: t("workspaceArchive.done") })
					] }),
					stage === "error" && (0, jsx.jsxs)("div", { className: "dac-workspace-body dac-error", role: "status", children: [
						(0, jsx.jsx)("span", { children: errorText }),
						(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn", disabled: busy, "data-workspace-archive-retry": "1", onClick: () => { void prepare(); }, children: t("workspaceArchive.retry") })
					] }),
					stage !== "result" && (0, jsx.jsxs)("div", { className: "dac-workspace-actions", children: [
						(0, jsx.jsx)(ControlButton, { ref: cancelRef, type: "button", className: "dac-btn", disabled: busy, "data-workspace-archive-cancel": "1", onClick: close, children: t("confirm.cancel") }),
						(0, jsx.jsx)(ControlButton, { type: "button", className: requiresStop ? "dac-btn-primary dac-stop-archive" : "dac-btn-primary", disabled: busy || stage !== "confirm" || count === 0, "data-workspace-archive-apply": "1", onClick: apply, children: busy ? t("workspaceArchive.applying") : requiresStop ? t("scope.stopArchiveAction") : t("workspaceArchive.apply") })
					] })
				]
			}) });
		}

		function ConfirmDialog({ title, body, confirmLabel, cancelLabel, confirmClassName = "dac-btn-danger", deleteAll = false, hideConfirm = false, confirmDisabled = false, dialogClassName = "", busy, returnFocus, fallbackFocusRef, onConfirm, onCancel }) {
			const destructive = confirmClassName === "dac-btn-danger";
			const dialogRef = _react.useRef(null);
			const cancelRef = _react.useRef(null);
			const callbacksRef = _react.useRef({ busy, confirmDisabled, onCancel, onConfirm });
			callbacksRef.current = { busy, confirmDisabled, onCancel, onConfirm };
			const submittingRef = _react.useRef(false);
			const cancel = () => { if (!callbacksRef.current.busy && !submittingRef.current) callbacksRef.current.onCancel(); };
			const submit = async () => {
				if (callbacksRef.current.busy || callbacksRef.current.confirmDisabled || submittingRef.current) return;
				submittingRef.current = true;
				try { await callbacksRef.current.onConfirm(); } finally { submittingRef.current = false; }
			};
			const containEscape = (event) => {
				if (event.key !== "Escape") return;
				event.preventDefault?.();
				event.stopPropagation?.();
				event.nativeEvent?.stopImmediatePropagation?.();
				cancel();
			};
			_react.useEffect(() => {
				const previousFocus = returnFocus ?? document.activeElement;
				const dialog = dialogRef.current;
				(cancelRef.current ?? dialog)?.focus?.();
				const onKey = (e) => {
					if (e.key === "Escape") {
						e.preventDefault?.();
						e.stopPropagation?.();
						e.stopImmediatePropagation?.();
						cancel();
						return;
					}
					if (e.key !== "Tab" || dialog === null) return;
					const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
					if (focusable.length === 0) {
						e.preventDefault();
						dialog.focus?.();
						return;
					}
					const first = focusable[0];
					const last = focusable[focusable.length - 1];
					const active = document.activeElement;
					const focusIsInside = typeof dialog.contains === "function" ? dialog.contains(active) : focusable.includes(active);
					if (e.shiftKey && (active === first || !focusIsInside)) {
						e.preventDefault();
						last.focus();
					} else if (!e.shiftKey && (active === last || !focusIsInside)) {
						e.preventDefault();
						first.focus();
					}
				};
				if (!previewPrimitives.Modal) document.addEventListener("keydown", onKey);
				return () => {
					if (!previewPrimitives.Modal) document.removeEventListener("keydown", onKey);
					const previousIsUsable = previousFocus !== null
						&& previousFocus !== document.body
						&& typeof previousFocus?.focus === "function"
						&& (typeof document.contains !== "function" || document.contains(previousFocus));
					const target = previousIsUsable ? previousFocus : fallbackFocusRef?.current;
					target?.focus?.();
				};
			}, [returnFocus, fallbackFocusRef]);
            if (previewPrimitives.Modal) {
                const footer = (0, jsx.jsxs)(jsx.Fragment, { children: [
                    (0, jsx.jsx)(ControlButton, { ref: cancelRef, className: "dac-btn", disabled: busy,
                        "data-modal-autofocus": true, onClick: cancel, children: cancelLabel }),
                    !hideConfirm && (0, jsx.jsxs)(ControlButton, { className: confirmClassName,
                        disabled: busy || confirmDisabled, "aria-busy": busy === true, onClick: submit,
                        children: [deleteAll && (0, jsx.jsx)(IconTrash, {}), confirmLabel] }),
                ] });
                return (0, jsx.jsx)(previewPrimitives.Modal, { open: true, title, closeLabel: cancelLabel, shortcutModal: "dsh-archived-chats",
                    onClose: cancel, className: `dac-native-standard-modal ${dialogClassName}`,
                    contentClassName: "dac-native-standard-content", footer,
                    description: typeof body === "string" ? body : undefined,
                    children: typeof body === "string" ? undefined : body,
                });
            }

			return (0, jsx.jsx)(HostModal, { title: title,
				className: "dac-confirm-overlay dac-action-confirm-overlay",
				onClick: cancel,
				children: (0, jsx.jsxs)("div", {
					ref: dialogRef,
					className: `dac-confirm dac-action-confirm${destructive ? " dac-delete-confirm" : ""}${dialogClassName ? ` ${dialogClassName}` : ""}`,
					role: previewPrimitives.Modal ? undefined : "alertdialog",
					"aria-modal": previewPrimitives.Modal ? undefined : "true",
					"aria-labelledby": "dac-confirm-title",
					"aria-describedby": "dac-confirm-body",
					tabIndex: -1,
					onKeyDown: containEscape,
					onClick: (e) => e.stopPropagation(),
					children: [
						(0, jsx.jsxs)("div", { className: "dac-confirm-heading", children: [
							(0, jsx.jsx)("div", { id: "dac-confirm-title", className: "dac-confirm-title", children: title }),
							!destructive && (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-iconbtn", "aria-label": cancelLabel, disabled: busy, onClick: cancel, children: (0, jsx.jsx)(IconClose, { size: 14 }) }),
						] }),
						(0, jsx.jsx)("div", { id: "dac-confirm-body", className: "dac-confirm-body", children: body }),
						(0, jsx.jsxs)("div", {
							className: "dac-confirm-actions",
							children: [
								(0, jsx.jsx)(ControlButton, { ref: cancelRef, type: "button", className: "dac-btn", disabled: busy, onClick: cancel, children: cancelLabel }),
								!hideConfirm && (0, jsx.jsxs)(ControlButton, { type: "button", className: `${confirmClassName}${deleteAll ? " dac-delete-all" : ""}`, disabled: busy || confirmDisabled, "aria-busy": busy === true, onClick: submit, children: [deleteAll && (0, jsx.jsx)(IconTrash, {}), confirmLabel] })
							]
						})
					]
				})
			});
		}

		/** Accessible tags/note editor — same focus contract as ConfirmDialog. */
		function MetadataDialog({ session, t, busy, returnFocus, fallbackFocusRef, onSave, onCancel }) {
			const dialogRef = _react.useRef(null);
			const tagInputRef = _react.useRef(null);
			const keyHandlerRef = _react.useRef(null);
			const [tags, setTags] = _react.useState(() => foldTags(session.tags));
			const [tagDraft, setTagDraft] = _react.useState("");
			const [note, setNote] = _react.useState(typeof session.note === "string" ? session.note : "");
			const savedTags = foldTags([...tags, tagDraft]);
			const overTags = savedTags.length > 8 || savedTags.some((tag) => Array.from(tag).length > 24);
			const overNote = Array.from(note).length > 2000;
			const commitDraft = () => {
				if (tagDraft.trim() === "") return;
				setTags((current) => foldTags([...current, tagDraft]));
				setTagDraft("");
			};
			const onKeyDown = (e) => {
				const dialog = dialogRef.current;
				if (e.key === "Escape") {
					e.preventDefault?.();
					e.stopPropagation?.();
					e.stopImmediatePropagation?.();
					e.nativeEvent?.stopImmediatePropagation?.();
					if (!busy) onCancel();
					return;
				}
				if (e.key !== "Tab" || dialog === null) return;
				e.stopPropagation?.();
				const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
				if (focusable.length === 0) {
					e.preventDefault();
					dialog.focus?.();
					return;
				}
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				const active = document.activeElement;
				const focusIsInside = focusable.includes(active);
				if (e.shiftKey && (active === first || !focusIsInside)) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && (active === last || !focusIsInside)) {
					e.preventDefault();
					first.focus();
				}
			};
			keyHandlerRef.current = onKeyDown;
			_react.useEffect(() => {
				const previousFocus = returnFocus ?? document.activeElement;
				const dialog = dialogRef.current;
				(tagInputRef.current ?? dialog)?.focus?.();
				const onDocumentKeyDown = (event) => keyHandlerRef.current?.(event);
				if (!previewPrimitives.Modal) document.addEventListener("keydown", onDocumentKeyDown);
				return () => {
					if (!previewPrimitives.Modal) document.removeEventListener("keydown", onDocumentKeyDown);
					const previousIsUsable = previousFocus !== null
						&& previousFocus !== document.body
						&& typeof previousFocus?.focus === "function"
						&& (typeof document.contains !== "function" || document.contains(previousFocus));
					const target = previousIsUsable ? previousFocus : fallbackFocusRef?.current;
					target?.focus?.();
				};
			}, []);
			return (0, jsx.jsx)(HostModal, { title: t("tag.edit"),
				className: "dac-confirm-overlay",
				onClick: () => { if (!busy) onCancel(); },
				children: (0, jsx.jsxs)("div", {
					ref: (element) => {
						dialogRef.current = element;
						if (element !== null && busy) element.focus?.();
					},
					className: "dac-confirm dac-meta-dialog",
					role: previewPrimitives.Modal ? undefined : "dialog",
					"aria-modal": previewPrimitives.Modal ? undefined : "true",
					"aria-labelledby": "dac-meta-title",
					"aria-describedby": "dac-meta-limits",
					tabIndex: -1,
					onKeyDown,
					onClick: (e) => e.stopPropagation(),
					children: [
						(0, jsx.jsx)("div", { id: "dac-meta-title", className: "dac-confirm-title", children: t("tag.edit") }),
						(0, jsx.jsx)("label", { className: "dac-field-label", htmlFor: "dac-meta-tags", children: t("tag.input") }),
						(0, jsx.jsxs)("div", { className: "dac-tag-editor", children: [
						...tags.map((tag) => (0, jsx.jsxs)("button", { type: "button", className: "dac-chip", "aria-label": removeTagLabel(t, tag), disabled: busy, onClick: () => setTags((current) => current.filter((value) => value !== tag)), children: [(0, jsx.jsx)("span", { children: tag }), (0, jsx.jsx)(IconClose, { size: 10 })] }, tag)),
							(0, jsx.jsx)(ControlInput, {
								id: "dac-meta-tags",
								ref: tagInputRef,
								type: "text",
							className: "dac-meta-input",
							disabled: busy,
								value: tagDraft,
								placeholder: t("tag.placeholder"),
								"aria-invalid": overTags,
								onChange: (e) => setTagDraft(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.isComposing && !e.nativeEvent?.isComposing) { e.preventDefault(); commitDraft(); }
									if (e.key === "Backspace" && tagDraft === "") setTags((current) => current.slice(0, -1));
								}
							})
						]}),
						(0, jsx.jsx)("div", { id: "dac-meta-limits", className: "dac-meta-limits", children: tagsLimitLabel(t, savedTags.length) }),
						(0, jsx.jsx)("label", { className: "dac-field-label", htmlFor: "dac-meta-note", children: t("note.label") }),
						(0, jsx.jsx)("textarea", {
							id: "dac-meta-note",
						className: "dac-meta-note",
						disabled: busy,
							value: note,
							rows: 4,
							placeholder: t("note.placeholder"),
							"aria-invalid": overNote,
							onChange: (e) => setNote(e.target.value)
						}),
						(0, jsx.jsx)("div", { className: "dac-meta-limits", children: noteLimitLabel(t, Array.from(note).length) }),
						(0, jsx.jsxs)("div", {
							className: "dac-confirm-actions",
							children: [
							(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn", disabled: busy, onClick: () => { if (!busy) onCancel(); }, children: t("confirm.cancel") }),
								(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn-primary", disabled: busy || overTags || overNote, onClick: () => onSave(savedTags, note.trim()), children: t("meta.save") })
							]
						})
					]
				})
			});
		}

			function importWarningText(t, warning) {
				if ((warning?.reason ?? warning) === "restore-cwd-platform-unsupported") return t("import.cwdUnsupported");
				if ((warning?.reason ?? warning) === "restore-cwd-invalid") return t("import.cwdInvalid");
				if (warning?.reason === "title-publication-degraded") {
					return t(warning.detail === "seeded-cold-list-unsupported"
						? "import.seededTitleLimitation" : "import.titlePublicationDegraded");
				}
				if (warning === "workspace-unresolved") return t("import.workspaceWarning");
				if (warning === "attachment-references" || warning === "attachments-not-included") return t("import.attachmentWarning");
				return typeof warning === "string" ? warning : t("import.titlePublicationDegraded");
			}

			function importFailureText(t, error) {
				const key = {
					"import-token-invalid": "import.expired",
					"restore-unsupported": "import.unsupported",
					"restore-cwd-platform-unsupported": "import.cwdUnsupported",
					"restore-cwd-invalid": "import.cwdInvalid",
					"restore-rollback-failed": "import.rollbackFailed",
					"id-conflict": "import.conflictChanged",
					"nothing-to-restore": "import.conflictChanged",
				}[error?.body?.error];
				return key ? t(key) : String(error?.message ?? error);
			}

				function ImportDialog({ preview, t, busy, returnFocus, fallbackFocusRef, onToggle, onSelectAll, onClear, onConfirm, onCancel }) {
				const dialogRef = _react.useRef(null);
				const cancelRef = _react.useRef(null);
				const keyHandlerRef = _react.useRef(null);
				const sessions = Array.isArray(preview?.sessions) ? preview.sessions : [];
				const selected = new Set(preview?.selectedIds ?? []);
				const eligible = sessions.filter((session) => session.conflict !== true && !session.restoreBlocked);
				const allSelected = eligible.length > 0 && eligible.every((session) => selected.has(session.id));
				const onKeyDown = (event) => {
					const dialog = dialogRef.current;
					if (event.key === "Escape") {
						event.preventDefault?.();
						event.stopPropagation?.();
						event.stopImmediatePropagation?.();
						event.nativeEvent?.stopImmediatePropagation?.();
						if (!busy) onCancel();
						return;
					}
					if (event.key !== "Tab" || dialog === null) return;
					event.stopPropagation?.();
					const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
					if (focusable.length === 0) { event.preventDefault?.(); dialog.focus?.(); return; }
					const first = focusable[0];
					const last = focusable[focusable.length - 1];
					const active = document.activeElement;
					const inside = focusable.includes(active);
					if (event.shiftKey && (active === first || !inside)) { event.preventDefault?.(); last.focus?.(); }
					else if (!event.shiftKey && (active === last || !inside)) { event.preventDefault?.(); first.focus?.(); }
				};
				keyHandlerRef.current = onKeyDown;
				_react.useEffect(() => {
					const previousFocus = returnFocus ?? document.activeElement;
					(cancelRef.current ?? dialogRef.current)?.focus?.();
					const onDocumentKeyDown = (event) => keyHandlerRef.current?.(event);
					if (!previewPrimitives.Modal) document.addEventListener("keydown", onDocumentKeyDown);
					return () => {
						if (!previewPrimitives.Modal) document.removeEventListener("keydown", onDocumentKeyDown);
						const previousIsUsable = previousFocus !== null
							&& previousFocus !== document.body
							&& typeof previousFocus?.focus === "function"
							&& (typeof document.contains !== "function" || document.contains(previousFocus));
						(previousIsUsable ? previousFocus : fallbackFocusRef?.current)?.focus?.();
					};
				}, []);
				const result = preview?.result;
				const resultWarnings = Array.isArray(result?.warnings) ? result.warnings : [];
				const generator = preview?.package?.generator;
				const generatorName = typeof generator === "string" ? generator : generator?.name ?? "dsh-archived-chats";
				const generatorVersion = typeof generator === "object" ? generator?.version : undefined;
				const packageVersion = preview?.package?.version ?? "1";
				const sessionCount = preview?.package?.sessionCount ?? sessions.length;
				const packageLabel = generatorVersion
					? `${generatorName} v${generatorVersion} · ${t("import.packageFormat", { version: packageVersion })}`
					: `${generatorName} · v${packageVersion}`;
				return (0, jsx.jsx)(HostModal, { title: t("import.title"),
					className: "dac-confirm-overlay",
					onClick: () => { if (!busy) onCancel(); },
					children: (0, jsx.jsxs)("div", {
						ref: (element) => {
							dialogRef.current = element;
							if (element !== null && busy) element.focus?.();
						},
						className: "dac-confirm dac-import-dialog",
						role: previewPrimitives.Modal ? undefined : "dialog",
						"aria-modal": previewPrimitives.Modal ? undefined : "true",
						"aria-labelledby": "dac-import-title",
						"aria-describedby": "dac-import-description",
						"aria-busy": busy === true,
						tabIndex: -1,
						onKeyDown,
						onClick: (event) => event.stopPropagation(),
						children: [
							(0, jsx.jsx)("div", { id: "dac-import-title", className: "dac-confirm-title", children: t("import.title") }),
							(0, jsx.jsx)("div", { id: "dac-import-description", className: "dac-confirm-body", children: result ? t("import.done") : t("import.preview") }),
							!result && (0, jsx.jsxs)("div", { className: "dac-import-package", children: [
								(0, jsx.jsx)("strong", { children: t("import.package") }),
								(0, jsx.jsx)("span", { children: packageLabel }),
								(0, jsx.jsx)("span", { children: countLabel(t, "import.sessionCount", sessionCount) }),
							] }),
							result ? (0, jsx.jsxs)("div", { className: "dac-import-result", children: [
								(0, jsx.jsxs)("div", { className: "dac-import-result-counts", children: [
									(0, jsx.jsx)("span", { children: `${t("import.restored")}: ${(result.restored ?? []).length}` }),
									(0, jsx.jsx)("span", { children: `${t("import.skipped")}: ${(result.skipped ?? []).length}` }),
								] }),
								...resultWarnings.map((warning, index) => (0, jsx.jsx)("div", { className: "dac-import-warning", role: "status", children: importWarningText(t, warning) }, `${warning?.id ?? "warning"}-${warning?.detail ?? index}`)),
							] }) : (0, jsx.jsxs)("div", { className: "dac-import-list", children: [
								(0, jsx.jsxs)("div", { className: "dac-import-selection", children: [
									(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn", onClick: onSelectAll, disabled: allSelected || busy, children: t("import.selectAll") }),
									(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn", onClick: onClear, disabled: selected.size === 0 || busy, children: t("import.clear") }),
								] }),
								sessions.map((session) => {
									const warnings = Array.isArray(session.warnings) ? session.warnings : [];
									return (0, jsx.jsxs)("label", { className: session.conflict || session.restoreBlocked ? "dac-import-row dac-import-conflict" : "dac-import-row", children: [
										(0, jsx.jsx)("input", { type: "checkbox", className: "dac-checkbox", checked: selected.has(session.id), disabled: session.conflict === true || !!session.restoreBlocked || busy, onChange: (event) => onToggle(session.id, event.target.checked) }),
										(0, jsx.jsxs)("span", { className: "dac-import-main", children: [
											(0, jsx.jsx)("strong", { children: session.title || t("chat.untitled") }),
											(0, jsx.jsx)("span", { children: session.workspace?.title || t("group.noProject") }),
											...(session.conflict ? [(0, jsx.jsx)("small", { children: t("import.conflict") })] : []),
											...(session.restoreBlocked ? [(0, jsx.jsx)("small", { children: importWarningText(t, session.restoreBlocked) })] : []),
											...warnings.map((warning) => (0, jsx.jsx)("small", { children: importWarningText(t, warning) }, `${session.id}-${warning}`)),
										] }),
									] }, session.id);
								})
							] }),
							preview?.error && (0, jsx.jsx)("div", { className: "dac-import-error", role: "alert", children: preview.error }),
							(0, jsx.jsxs)("div", { className: "dac-confirm-actions", children: [
								(0, jsx.jsx)(ControlButton, { ref: (element) => {
									cancelRef.current = element;
									if (element !== null && result) element.focus?.();
								}, type: "button", className: "dac-btn", disabled: busy, onClick: () => { if (!busy) onCancel(); }, children: t(result ? "import.close" : "import.cancel") }),
								!result && (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn-primary", disabled: busy || selected.size === 0, onClick: onConfirm, children: busy ? t("import.inspecting") : t("import.confirm") }),
							] })
						]
					})
				});
				}

				function PreviewMarkdown({ text, t, primitives = previewPrimitives }) {
					const MarkdownText = primitives.MarkdownText;
					if (MarkdownText === null) return (0, jsx.jsx)("p", { className: "dac-preview-plain", children: text });
					return (0, jsx.jsx)(MarkdownText, {
						text,
						streaming: false,
						labels: { code: { copyLabel: t("preview.copy"), copiedLabel: t("preview.copied") }, footnotes: t("preview.footnotes") },
					});
				}

				function PreviewDisclosure({ title, summary, kind, children, primitives = previewPrimitives, defaultOpen = false }) {
					const DisclosureRow = primitives.DisclosureRow;
					const [open, setOpen] = _react.useState(defaultOpen);
                    _react.useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);
					const NativeIcon = kind === "reasoning" ? primitives.IconThink : kind === "tool" ? null : primitives.IconPrompt;
					const icon = NativeIcon != null ? (0, jsx.jsx)(NativeIcon, { size: 14 })
						: (0, jsx.jsx)("svg", { ...svgProps(14), children: (0, jsx.jsx)("path", { d: kind === "reasoning"
							? "M8 18h8M9 21h6M8 15a7 7 0 1 1 8 0v3H8Z"
							: kind === "tool" ? "M8 8l4 4-4 4m6 0h3M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
							: "M7 3h10a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3ZM8 8h8M8 12h5" }) });
					const collapsedContent = summary ? (0, jsx.jsx)("span", { className: "dac-preview-fold-summary", children: summary }) : null;
					if (DisclosureRow === null) return (0, jsx.jsxs)("details", {
						className: "dac-preview-disclosure dac-preview-fold", open, onToggle: event => setOpen(event.currentTarget.open),
						children: [(0, jsx.jsxs)("summary", { children: [
							(0, jsx.jsxs)("span", { className: "dac-preview-fold-leading", "aria-hidden": true, children: [
								(0, jsx.jsx)("span", { className: "dac-preview-fold-icon", children: icon }),
								(0, jsx.jsx)("span", { className: "dac-preview-fold-chevron", children: (0, jsx.jsx)(IconChevron, { size: 14 }) }),
							] }),
							(0, jsx.jsx)("span", { children: title }),
							collapsedContent,
						] }), children],
					});
					return (0, jsx.jsx)(DisclosureRow, {
						className: "dac-preview-disclosure",
						icon,
						title,
						collapsedContent,
						open,
						expandable: true,
						expandOnRowClick: true,
						onToggle: () => setOpen((value) => !value),
						children,
					});
				}

				function PreviewReasoning({ text, t, primitives = previewPrimitives }) {
					return (0, jsx.jsx)(PreviewDisclosure, { title: t("preview.reasoning"), kind: "reasoning", primitives,
						summary: String(text ?? "").replace(/\s+/gu, " ").slice(0, 180),
						children: (0, jsx.jsx)("div", { className: "dac-preview-reasoning-body", children: text }),
					});
				}

				function PreviewJson({ label, text, t }) {
					const JsonBlock = previewPrimitives.JsonBlock;
					let payload = text;
					try { payload = JSON.parse(text); } catch { /* escaped text fallback stays a string */ }
					if (JsonBlock !== null) return (0, jsx.jsx)(JsonBlock, { label: label || t("preview.json"), payload });
					return (0, jsx.jsx)("pre", { className: "dac-preview-code", children: text });
				}

				function previewJsonValue(text) {
					try { return JSON.parse(text); } catch { return text; }
				}

				function PreviewTool({ segment, t }) {
					const JsonBlock = previewPrimitives.JsonBlock;
					const argumentsText = typeof segment.argumentsText === "string" ? segment.argumentsText : segment.text || "";
					const args = previewJsonValue(argumentsText);
					const summary = [args?.description, args?.title, args?.command, args?.path].find((value) => typeof value === "string" && value.trim() !== "");
					const body = (0, jsx.jsxs)("div", { className: `dac-preview-tool-body${segment.result?.isError ? " dac-error" : ""}`, children: [
						JsonBlock !== null
							? (0, jsx.jsx)(JsonBlock, { label: t("preview.toolArguments"), payload: previewJsonValue(argumentsText) })
							: (0, jsx.jsxs)("div", { children: [(0, jsx.jsx)("span", { className: "dac-preview-detail-label", children: t("preview.toolArguments") }), (0, jsx.jsx)("pre", { className: "dac-preview-code", children: argumentsText })] }),
						segment.result !== undefined && (0, jsx.jsxs)("div", { children: [(0, jsx.jsx)("span", { className: "dac-preview-detail-label", children: t("preview.toolResult") }), (0, jsx.jsx)("pre", { className: `dac-preview-tool-result${segment.result.isError ? " dac-error" : ""}`, children: segment.result.text || "" })] }),
					] });
					return (0, jsx.jsx)(PreviewDisclosure, {
						title: segment.name === "bash" ? "Bash" : segment.name || segment.label || t("preview.toolCall"),
						kind: "tool", summary: summary?.replace(/\s+/gu, " ").slice(0, 180),
						children: body,
					});
				}

				function PreviewToolResult({ segment, t }) {
					const [open, setOpen] = _react.useState(false);
					const DisclosureRow = previewPrimitives.DisclosureRow;
					const body = (0, jsx.jsx)("div", { className: `dac-preview-tool-body${segment.isError ? " dac-error" : ""}`, children: (0, jsx.jsx)("pre", { className: `dac-preview-tool-result${segment.isError ? " dac-error" : ""}`, children: segment.text || "" }) });
					if (DisclosureRow === null) return (0, jsx.jsxs)("details", { className: `dac-preview-disclosure${segment.isError ? " dac-error" : ""}`, children: [
						(0, jsx.jsx)("summary", { children: previewSegmentLabel(t, segment) }),
						body,
					] });
					return (0, jsx.jsx)(DisclosureRow, {
						title: previewSegmentLabel(t, segment),
						open,
						expandable: true,
						expandOnRowClick: true,
						onToggle: () => setOpen((value) => !value),
						children: body,
					});
				}

				function PreviewImage({ sessionId, attachment, t, scope = "archive" }) {
					const rootRef = _react.useRef(null);
					const [state, setState] = _react.useState({ status: "idle", url: null });
					_react.useEffect(() => {
						if (typeof attachment?.attachmentId !== "string") return () => {};
						const controller = new AbortController();
						let objectUrl = null;
						let started = false;
						let disposed = false;
						let observer = null;
						const load = async () => {
							if (started) return;
							started = true;
							setState({ status: "loading", url: null });
							try {
								const blob = await fetchArchiveImage(sessionId, attachment.attachmentId, controller.signal, scope);
								if (disposed) return;
								objectUrl = (window.URL ?? URL).createObjectURL(blob);
								setState({ status: "ready", url: objectUrl });
							} catch (error) {
								if (!controller.signal.aborted) setState({ status: "error", url: null });
							}
						};
						const Observer = typeof window !== "undefined" ? window.IntersectionObserver : null;
						if (typeof Observer !== "function" || rootRef.current === null) void load();
						else {
							observer = new Observer((entries) => {
								if (entries.some((entry) => entry.isIntersecting)) {
									observer.disconnect();
									void load();
								}
							}, { rootMargin: "240px" });
							observer.observe(rootRef.current);
						}
						return () => {
							disposed = true;
							observer?.disconnect();
							controller.abort();
							if (objectUrl !== null) (window.URL ?? URL).revokeObjectURL(objectUrl);
						};
					}, [sessionId, attachment?.attachmentId, scope]);

					const descriptorParts = [];
					if (typeof attachment?.name === "string" && attachment.name !== "") descriptorParts.push(attachment.name);
					if (Number.isFinite(attachment?.width) && Number.isFinite(attachment?.height)) descriptorParts.push(`${attachment.width}×${attachment.height}`);
					const descriptor = descriptorParts.join(" · ");
					const alt = descriptor || t("preview.imageUnavailable");
					if (state.status === "ready") return (0, jsx.jsx)("img", { ref: rootRef, src: state.url, alt, loading: "lazy" });
					return (0, jsx.jsx)("span", { ref: rootRef, className: "dac-preview-image-placeholder", children: state.status === "error" && descriptor !== "" ? `${t("preview.imageUnavailable")} · ${descriptor}` : alt });
				}

				function groupPreviewSegments(segments) {
					const groups = [];
					for (let index = 0; index < (Array.isArray(segments) ? segments.length : 0); index += 1) {
						const segment = segments[index];
						if (segment?.kind !== "image") { groups.push({ kind: "segment", segment }); continue; }
						const images = [segment];
						while (segments[index + 1]?.kind === "image") images.push(segments[++index]);
						groups.push({ kind: "images", images });
					}
					return groups;
				}

				function PreviewSegment({ segment, role, t, matched = false }) {
                    // Matched structured content is expanded as escaped text, including
                    // correlated tool output; Host JSON widgets can independently fold.
                    const expandedText = [segment?.name, segment?.argumentsText ?? segment?.text, segment?.result?.text].filter(Boolean).join("\n\n");
                    if (matched && !["text", "image"].includes(segment?.kind)) return (0, jsx.jsxs)("div", { className: "dac-preview-match-content", children: [
                        (0, jsx.jsx)("span", { className: "dac-preview-detail-label", children: previewSegmentLabel(t, segment) }),
                        (0, jsx.jsx)("pre", { className: "dac-preview-code", children: expandedText })
                    ] });
					if (segment?.kind === "text") {
						return role === "assistant"
							? (0, jsx.jsx)(PreviewMarkdown, { text: segment.text, t })
							: (0, jsx.jsx)("span", { className: "dac-preview-plain", children: segment.text });
					}
					if (segment?.kind === "reasoning") return (0, jsx.jsx)(PreviewReasoning, { text: segment.text, t });
					if (segment?.kind === "json") return (0, jsx.jsx)(PreviewJson, { label: segment.label, text: segment.text, t });
					if (segment?.kind === "image") return (0, jsx.jsx)("span", { className: "dac-preview-image-placeholder", children: segment.text });
					if (segment?.kind === "tool-call") return (0, jsx.jsx)(PreviewTool, { segment, t });
					if (segment?.kind === "tool-result") return (0, jsx.jsx)(PreviewToolResult, { segment, t });
					return (0, jsx.jsxs)("details", { className: `dac-preview-disclosure${segment?.isError ? " dac-error" : ""}`, children: [
						(0, jsx.jsx)("summary", { children: previewSegmentLabel(t, segment) }),
						(0, jsx.jsx)("pre", { className: "dac-preview-code", children: segment?.text || "" }),
					] });
				}

				function previewProcessLabel(t, turn) {
					const labels = [];
					if (turn.toolCallCount > 0) labels.push(countLabel(t, "preview.process.toolCalls", turn.toolCallCount));
					if (turn.messageCount > 0) labels.push(countLabel(t, "preview.process.messages", turn.messageCount));
					if (turn.subagentCount > 0) labels.push(countLabel(t, "preview.process.subagents", turn.subagentCount));
					if (labels.length === 0) labels.push(t("preview.process.thought"));
					if (turn.endReason && turn.endReason !== "completed") labels.push(t("preview.process.incomplete"));
					return labels.join(" · ");
				}

				function PreviewMessage({ node, sessionId, t, bindNode, scope = "archive", compact = false, matchSeq }) {
                    const matchesNode = candidate => matchSeq !== undefined && (candidate.seq === matchSeq || candidate.segments?.some(segment => segment.resultSeq === matchSeq));
                    const matched = matchesNode(node);
                    const matchedProcess = node?.members?.some(matchesNode) === true;
					if (node?.kind === "process") return (0, jsx.jsx)("article", {
						ref: bindNode, id: `dac-preview-node-${node.key}`, "data-preview-key": node.key, "data-preview-role": "assistant", tabIndex: -1,
						className: "dac-preview-node dac-preview-assistant",
						children: (0, jsx.jsxs)("details", { className: "dac-preview-process", open: matchedProcess ? true : undefined, children: [
							(0, jsx.jsxs)("summary", { children: [(0, jsx.jsx)("span", { children: previewProcessLabel(t, node.turn) }), (0, jsx.jsx)(IconChevron, { size: 14 })] }),
							(0, jsx.jsx)("div", { className: "dac-preview-process-body", children: node.members.map((member) => (0, jsx.jsx)(PreviewMessage, { node: member, sessionId, t, scope, compact: true, matchSeq }, member.key)) }),
						] }),
					});
					const role = ["user", "assistant", "tool", "context"].includes(node?.role) ? node.role : "system";
					const segments = groupPreviewSegments(node?.segments).map((group, index) => group.kind === "images"
						? (0, jsx.jsx)("div", {
							className: "dac-preview-images",
							"data-align": role === "user" ? "end" : "start",
							children: group.images.map((segment, imageIndex) => (0, jsx.jsx)(PreviewImage, { sessionId, attachment: segment.attachment, t, scope }, `${node.key}:${index}:${imageIndex}`)),
						}, `${node.key}:images:${index}`)
						: (0, jsx.jsx)(PreviewSegment, { segment: group.segment, role, t, matched }, `${node.key}:${index}`));
					return (0, jsx.jsxs)("article", {
						ref: bindNode,
						id: `dac-preview-node-${node.key}`,
						"data-preview-key": node.key,
						"data-preview-role": role,
                        "data-preview-match": matched ? "true" : undefined,
						"aria-label": previewRoleLabel(t, role),
						tabIndex: -1,
						className: `dac-preview-node dac-preview-${role}`,
						children: [
							role === "user" ? (0, jsx.jsx)("div", { className: "dac-preview-user-bubble", children: segments })
								: ["system", "context"].includes(role) ? (0, jsx.jsx)(PreviewDisclosure, {
									title: previewRoleLabel(t, role), kind: role, summary: node.sourceLabel || undefined, defaultOpen: matched,
									children: (0, jsx.jsx)("div", { className: "dac-preview-prompt-body", tabIndex: 0, children: segments }),
								}) : segments,
							!compact && (["user", "assistant"].includes(role)
								? (0, jsx.jsx)(PreviewActions, { node, t })
								: (0, jsx.jsx)("div", { className: "dac-preview-meta", children: formatDate(t, node.time) })),
						],
					});
				}

				function buildPreviewNodes(messages, sessionId = "") {
					const results = new Map();
					const source = Array.isArray(messages) ? messages : [];
					for (let messageIndex = 0; messageIndex < source.length; messageIndex += 1) {
						const message = source[messageIndex];
						const sourceSegments = Array.isArray(message?.segments) ? message.segments : [];
						for (let segmentIndex = 0; segmentIndex < sourceSegments.length; segmentIndex += 1) {
							const segment = sourceSegments[segmentIndex];
							if (segment?.kind !== "tool-result" || typeof segment.toolCallId !== "string") continue;
							const queue = results.get(segment.toolCallId) ?? [];
							queue.push({ messageIndex, segmentIndex, segment, turnKey: message.turn?.key ?? null });
							results.set(segment.toolCallId, queue);
						}
					}
					const consumed = new Set();
					const nodes = [];
					for (let messageIndex = 0; messageIndex < source.length; messageIndex += 1) {
						const message = source[messageIndex];
						const segments = [];
						for (let index = 0; index < (Array.isArray(message?.segments) ? message.segments.length : 0); index += 1) {
							const segment = message.segments[index];
							const identity = `${messageIndex}:${index}`;
							if (segment?.kind === "tool-result" && consumed.has(identity)) continue;
							if (segment?.kind === "tool-call" && typeof segment.callId === "string") {
								const match = (results.get(segment.callId) ?? []).find((entry) => (entry.messageIndex > messageIndex
									|| (entry.messageIndex === messageIndex && entry.segmentIndex > index))
									&& entry.turnKey === (message.turn?.key ?? null)
									&& !consumed.has(`${entry.messageIndex}:${entry.segmentIndex}`));
								if (match !== undefined) {
									consumed.add(`${match.messageIndex}:${match.segmentIndex}`);
									segments.push({ ...segment, result: match.segment, resultSeq: source[match.messageIndex].seq });
									continue;
								}
							}
							segments.push(segment);
						}
						if (segments.length > 0) nodes.push({ ...message, key: `${sessionId ? `${encodeURIComponent(sessionId)}:` : ""}${message.seq}:${messageIndex}`, segments });
					}
					const turns = new Map();
					for (const row of source) {
						if (!row.turn?.key) continue;
						const entry = turns.get(row.turn.key) ?? { turn: row.turn, count: 0 };
						entry.count += 1; turns.set(row.turn.key, entry);
					}
					const processes = new Map();
					for (const { turn, count } of turns.values()) {
						if (!Number.isFinite(turn.endSeq) || !Number.isFinite(turn.answerSeq) || !Number.isFinite(turn.processStartSeq) || count !== turn.rowCount) continue;
						const answer = nodes.find((node) => node.turn?.key === turn.key && node.seq === turn.answerSeq && node.role === "assistant");
						if (!answer) continue;
						const members = nodes.filter((node) => node.turn?.key === turn.key && node.seq >= turn.processStartSeq && node.seq < turn.answerSeq && !["user", "system"].includes(node.role));
						const reasoning = answer.segments.filter((segment) => segment.kind === "reasoning");
						if (reasoning.length > 0) members.push({ ...answer, key: `${answer.key}:reasoning`, segments: reasoning });
						if (members.length === 0) continue;
						processes.set(turn.key, { role: "assistant", kind: "process", key: `${sessionId ? `${encodeURIComponent(sessionId)}:` : ""}${turn.key}:process`, seq: members[0].seq, anchorSeq: members[0].anchorSeq ?? members[0].seq, turn, members, segments: [] });
					}
					const output = [];
					const inserted = new Set();
					for (const node of nodes) {
						const process = processes.get(node.turn?.key);
						const isMember = process?.members.includes(node);
						const isAnswer = process && node.seq === process.turn.answerSeq;
						if (process && (isMember || isAnswer) && !inserted.has(process.key)) { output.push(process); inserted.add(process.key); }
						if (isMember) continue;
						output.push(isAnswer ? { ...node, segments: node.segments.filter((segment) => segment.kind !== "reasoning") } : node);
					}
					return output.sort((left, right) => (left.anchorSeq ?? left.seq) - (right.anchorSeq ?? right.seq));
				}

				function previewCopyText(node) {
					return (Array.isArray(node?.segments) ? node.segments : []).flatMap((segment) => {
						if (segment.kind === "tool-call") return [segment.name, segment.argumentsText, segment.result?.text];
						return [segment.text];
					}).filter((value) => typeof value === "string" && value !== "").join("\n\n");
				}

				function PreviewActions({ node, t }) {
					const [copied, setCopied] = _react.useState(false);
					const [copyFailed, setCopyFailed] = _react.useState(false);
					const copy = async () => {
						const text = previewCopyText(node);
						const clipboard = typeof navigator === "undefined" ? null : navigator.clipboard;
						if (text === "") return;
						setCopyFailed(false);
						try {
							if (typeof clipboard?.writeText !== "function") throw new Error("clipboard-unavailable");
							await clipboard.writeText(text);
							setCopied(true);
						} catch {
							setCopied(false);
							setCopyFailed(true);
						}
					};
					return (0, jsx.jsxs)("div", { className: "dac-preview-actions", children: [
						(0, jsx.jsx)("time", { dateTime: isoTimestamp(node.time), children: formatDate(t, node.time) }),
						(0, jsx.jsx)(ControlButton, { className: "dac-iconbtn", type: "button", onClick: copy, "aria-label": copied ? t("preview.copied") : t("preview.copy"), children: copied ? t("preview.copied") : t("preview.copy") }),
						copyFailed && (0, jsx.jsx)("span", { className: "dac-preview-copy-error", role: "alert", children: t("preview.copyError") }),
					] });
				}

				function usePreviewRail(nodes, feedRef) {
					const [activeKey, setActiveKey] = _react.useState(nodes[0]?.key ?? null);
					const elements = _react.useRef(new Map());
					_react.useEffect(() => {
						const Observer = typeof window !== "undefined" ? window.IntersectionObserver : null;
						if (typeof Observer !== "function" || feedRef.current === null) return () => {};
						const observer = new Observer((entries) => {
							const visible = entries.filter((entry) => entry.isIntersecting)
								.sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
							if (visible?.target?.dataset?.previewKey) setActiveKey(visible.target.dataset.previewKey);
						}, { root: feedRef.current, threshold: [0.25, 0.5, 0.75] });
						for (const element of elements.current.values()) observer.observe(element);
						return () => observer.disconnect();
					}, [nodes]);
					return {
						activeKey,
						bindNode: (key) => (element) => {
							if (element === null) elements.current.delete(key);
							else elements.current.set(key, element);
						},
					};
				}

				function jumpToPreviewNode(node, keyboard) {
					const target = document.getElementById(`dac-preview-node-${node.key}`);
					const reduced = typeof window !== "undefined"
						&& typeof window.matchMedia === "function"
						&& window.matchMedia("(prefers-reduced-motion: reduce)").matches;
					target?.scrollIntoView?.({ block: "start", behavior: reduced ? "auto" : "smooth" });
					if (keyboard) target?.focus?.({ preventScroll: true });
				}

				function previewFocusables(dialog) {
					return [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')].filter((element) => {
						if (element.tabIndex < 0 || element.matches?.(":disabled") || element.closest?.("[hidden],[inert]")) return false;
						// Closed details may still have layout boxes in some browsers.
						for (let details = element.closest?.("details:not([open])"); details; details = details.parentElement?.closest("details:not([open])")) {
							const summary = [...details.children].find((child) => child.tagName === "SUMMARY");
							if (!summary?.contains(element)) return false;
						}
						if (typeof element.checkVisibility === "function" && !element.checkVisibility({ checkVisibilityCSS: true })) return false;
						return typeof element.getClientRects !== "function" || element.getClientRects().length > 0;
					});
				}

				function PreviewDialog({ preview, t, busy, returnFocus, fallbackFocusRef, onLoadMore, onCancel, onEditMetadata, actionBusy = false, metadataUnavailable = false }) {
					const dialogRef = _react.useRef(null);
					const closeRef = _react.useRef(null);
					const messages = Array.isArray(preview?.messages) ? preview.messages : [];
					const nodes = _react.useMemo(() => buildPreviewNodes(messages, preview?.session?.id), [messages, preview?.session?.id]);
					const feedRef = _react.useRef(null);
					const { activeKey, bindNode } = usePreviewRail(nodes, feedRef);
					const previewSourceId = preview?.session?.id;
					_react.useEffect(() => {
						const previousFocus = returnFocus ?? document.activeElement;
						(closeRef.current ?? dialogRef.current)?.focus?.();
					const onKey = (event) => {
						if (event.key === "Escape") {
							event.preventDefault?.();
							event.stopPropagation?.();
							onCancel();
							return;
						}
						if (event.key !== "Tab" || dialogRef.current === null) return;
						const dialog = dialogRef.current;
						const focusable = previewFocusables(dialog);
						if (focusable.length === 0) {
							event.preventDefault?.();
							dialog.focus?.();
							return;
						}
						const first = focusable[0];
						const last = focusable[focusable.length - 1];
						const active = document.activeElement;
						const focusIsInside = typeof dialog.contains === "function" ? dialog.contains(active) : focusable.includes(active);
						if (event.shiftKey && (active === first || !focusIsInside)) {
							event.preventDefault?.();
							last.focus?.();
						} else if (!event.shiftKey && (active === last || !focusIsInside)) {
							event.preventDefault?.();
							first.focus?.();
						}
					};
						if (!previewPrimitives.Modal) document.addEventListener("keydown", onKey);
						return () => {
							if (!previewPrimitives.Modal) document.removeEventListener("keydown", onKey);
							const usable = previousFocus !== null
								&& previousFocus !== document.body
								&& typeof previousFocus?.focus === "function"
								&& (typeof document.contains !== "function" || document.contains(previousFocus));
							(usable ? previousFocus : fallbackFocusRef?.current)?.focus?.({ preventScroll: true });
						};
					}, [onCancel, returnFocus, fallbackFocusRef]);

                    _react.useEffect(() => {
                        if (preview?.anchor?.status !== "found" || preview.status !== "ready") return;
                        const target = dialogRef.current?.querySelector?.('[data-preview-match="true"]');
                        target?.scrollIntoView?.({ block: "center", behavior: "auto" });
                        target?.focus?.({ preventScroll: true });
                    }, [preview?.session?.id, preview?.anchor?.seq, preview?.anchor?.status, preview?.status]);

					return (0, jsx.jsx)(HostModal, { title: preview?.session?.title || t("chat.untitled"),
						className: "dac-confirm-overlay",
						onClick: onCancel,
						children: (0, jsx.jsxs)("div", {
							ref: dialogRef,
							className: "dac-confirm dac-preview-dialog",
							role: previewPrimitives.Modal ? undefined : "dialog",
							"aria-modal": previewPrimitives.Modal ? undefined : "true",
							"aria-labelledby": "dac-preview-title",
							tabIndex: -1,
							onClick: (event) => event.stopPropagation(),
							children: [
								(0, jsx.jsxs)("div", { className: "dac-preview-head", children: [
									(0, jsx.jsxs)("div", { className: "dac-preview-heading", children: [
										(0, jsx.jsx)("strong", { id: "dac-preview-title", children: preview?.session?.title || t("chat.untitled") }),
										(0, jsx.jsx)("span", { children: t("preview.readOnly") }),
									] }),
									(0, jsx.jsxs)("div", { className: "dac-preview-head-actions", children: [
                                        onEditMetadata && (0, jsx.jsx)(ControlButton, {
                                            type: "button", className: "dac-iconbtn", "aria-label": t("tag.edit"), title: t("tag.edit"),
                                            disabled: actionBusy || metadataUnavailable, onClick: onEditMetadata,
                                            children: (0, jsx.jsx)(IconEdit, {}),
                                        }),
										(0, jsx.jsx)(ControlButton, { ref: closeRef, type: "button", className: "dac-iconbtn", "aria-label": t("preview.close"), onClick: onCancel, children: (0, jsx.jsx)(IconClose, { size: 14 }) })
									] })
								] }),
								preview?.status === "loading" && (0, jsx.jsxs)("div", { className: "dac-center", children: [(0, jsx.jsx)("span", { className: "dac-spin" }), (0, jsx.jsx)("span", { children: t("preview.loading") })] }),
								preview?.status === "error" && (0, jsx.jsx)("div", { className: "dac-center", children: preview.error || t("preview.error") }),
								preview?.anchor?.status === "missing" && (0, jsx.jsx)("div", { className: "dac-warn", role: "status", children: t("preview.anchorMissing") }),
                                preview?.status === "ready" && messages.length === 0 && (0, jsx.jsx)("div", { className: "dac-center", children: t("preview.empty") }),
								preview?.status === "ready" && nodes.length > 0 && (0, jsx.jsxs)("div", { className: "dac-preview-layout", children: [
									(0, jsx.jsx)("nav", { className: "dac-preview-rail", "aria-label": t("preview.timeline"), children: nodes.map((node, index) => (0, jsx.jsx)("button", {
										type: "button",
										"aria-label": previewJumpLabel(t, index),
										"aria-current": activeKey === node.key ? "true" : undefined,
										onClick: (event) => jumpToPreviewNode(node, event.detail === 0),
										children: `#${index + 1}`
									}, node.key)) }),
									(0, jsx.jsxs)("div", { ref: feedRef, className: "dac-preview-feed", children: [
										(0, jsx.jsxs)("div", { className: "dac-preview-column", children: [
											preview.previousOffset != null && (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn dac-preview-more", disabled: busy, onClick: () => onLoadMore("previous"), children: t("preview.earlier") }),
                                            ...nodes.map((node) => (0, jsx.jsx)(PreviewMessage, { node, sessionId: previewSourceId, t, bindNode: bindNode(node.key), scope: preview?.scope ?? "archive", matchSeq: preview?.anchor?.status === "found" ? preview.anchor.seq : undefined }, node.key)),
										preview.nextOffset !== null && (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn dac-preview-more", disabled: busy, onClick: () => onLoadMore("next"), children: busy ? t("preview.loading") : t("preview.more") })
										] })
									] })
								] })
							]
						})
					});
				}

        function ToolbarMoreMenu({ t, triggerLabel, children, open: controlledOpen, onOpenChange, triggerProps = {}, iconSize = 13 }) {
            const [localOpen, setLocalOpen] = _react.useState(false);
            const open = controlledOpen ?? localOpen;
            const setOpen = next => {
                const value = typeof next === "function" ? next(open) : next;
                if (onOpenChange) onOpenChange(value);
                else setLocalOpen(value);
            };
            if (!hasNativeMoreMenu) {
                if (controlledOpen === undefined) return (0, jsx.jsx)(ChatActionMenu, { t, toolbar: true, triggerLabel, children });
                return (0, jsx.jsxs)("div", { className: "dac-toolbar-fallback-menu", children: [
                    (0, jsx.jsx)("button", { ...triggerProps, type: "button", className: "dac-toolbar-more-trigger dac-more-fallback", "aria-label": triggerLabel, title: triggerLabel,
                        "aria-haspopup": "menu", "aria-expanded": open, onClick: () => setOpen(!open), children: (0, jsx.jsx)(IconDots, { size: iconSize }) }),
                    open && (0, jsx.jsx)("div", { className: "dac-menu", role: "menu", "aria-label": triggerLabel, children }),
                ] });
            }
            return (0, jsx.jsx)(previewPrimitives.Menu, {
                open, onClose: () => setOpen(false), portal: true, autoFocus: true,
                className: "dac-toolbar-more", listClassName: "dac-toolbar-native-menu",
                anchor: (0, jsx.jsx)(previewPrimitives.Tooltip, {
                    label: triggerLabel, portal: true,
                    children: (0, jsx.jsx)(previewPrimitives.Button, {
                        ...triggerProps, type: "button", size: "sm", className: "dac-toolbar-more-trigger",
                        "aria-label": triggerLabel, "aria-haspopup": "menu", "aria-expanded": open,
                        onClick: () => setOpen(!open),
                        children: (0, jsx.jsx)(previewPrimitives.IconEllipsis ?? IconDots, { size: iconSize }),
                    }),
                }),
                children,
            });
        }

        function NativeFilterMenu({ title, items, selectedIds, onSelect, trigger, triggerLabel }) {
            const [open, setOpen] = _react.useState(false);
            return (0, jsx.jsx)(previewPrimitives.Menu, {
                open, onClose: () => setOpen(false), dense: true, portal: true, autoFocus: true,
                className: "dac-filter-menu", listClassName: "dac-native-filter-menu",
                items, selectedIds,
                onSelect: id => {
                    const item = items.find(item => item.id === id);
                    if (!item || item.disabled || item.type) return;
                    onSelect(id);
                    setOpen(false);
                },
                anchor: (0, jsx.jsx)("button", {
                    type: "button", className: "dac-action-trigger dac-native-filter-trigger",
                    "aria-label": triggerLabel, "aria-haspopup": "menu", "aria-expanded": open, title,
                    onClick: () => setOpen(!open), children: trigger,
                }),
            });
        }

		function ChatActionMenu({ t, title, children, items, selectedIds, onSelect, trigger, triggerLabel, filter = false, toolbar = false }) {
			if (filter && previewPrimitives.Menu) return (0, jsx.jsx)(NativeFilterMenu, { title, items, selectedIds, onSelect, trigger, triggerLabel });
			const menuRef = _react.useRef(null);
			_react.useEffect(() => {
				const closeOutside = (event) => {
					const menu = menuRef.current;
					if (menu?.open && !menu.contains(event.target)) menu.open = false;
				};
				document.addEventListener("pointerdown", closeOutside);
				document.addEventListener("focusin", closeOutside);
				return () => {
					document.removeEventListener("pointerdown", closeOutside);
					document.removeEventListener("focusin", closeOutside);
				};
			}, []);
			return (0, jsx.jsxs)("details", {
				ref: menuRef,
				className: filter ? "dac-row-more dac-filter-menu" : toolbar ? "dac-row-more dac-toolbar-more" : "dac-row-more",
				onKeyDown: (event) => {
                    if (filter && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                        const menu = menuRef.current;
                        if (!menu) return;
                        const options = [...menu.querySelectorAll("button:not(:disabled)")];
                        if (options.length === 0) return;
                        event.preventDefault();
                        event.stopPropagation();
                        menu.open = true;
                        const current = options.indexOf(document.activeElement);
                        const index = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
                            : current < 0 ? (event.key === "ArrowUp" ? options.length - 1 : 0)
                            : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
                        options[index].focus();
                        return;
                    }
					if (event.key === "Escape" && menuRef.current?.open) {
						event.preventDefault();
						event.stopPropagation();
						menuRef.current.open = false;
						menuRef.current.querySelector("summary")?.focus();
					}
				},
				children: [
					(0, jsx.jsx)("summary", { className: filter ? "dac-action-trigger" : "dac-iconbtn", "aria-label": triggerLabel ?? `${t("menu.row")}: ${title}`, title: filter ? title : toolbar ? triggerLabel : t("menu.row"), children: trigger ?? (0, jsx.jsx)(IconDots, { size: toolbar ? 13 : 16 }) }),
					(0, jsx.jsx)(HostMenuSurface, {
						className: "dac-menu dac-row-menu",
						onClickCapture: (event) => {
							const button = event.target.closest("button:not(:disabled)");
							if (button && button.getAttribute?.("aria-disabled") !== "true" && menuRef.current) {
								menuRef.current.open = false;
								menuRef.current.querySelector("summary")?.focus();
							}
						},
						children
					})
				]
			});
		}

		// Both pointer and keyboard interaction pause the remaining display time.
		function useSuccessNoticeTimer(value, enabled, onDismiss) {
			const [interaction, setInteraction] = _react.useState(null);
			const remaining = _react.useRef({ value: null, ms: 4000 });
			const paused = interaction?.value === value && (interaction.hover || interaction.focus);
			const latest = _react.useRef(null);
			latest.current = { value, enabled, paused };
			_react.useEffect(() => {
				if (remaining.current.value !== value) remaining.current = { value, ms: 4000 };
				if (!enabled || paused) return;
				const started = Date.now();
				let active = true;
				const timer = setTimeout(() => {
					if (active && latest.current.value === value && latest.current.enabled && !latest.current.paused) {
						active = false;
						onDismiss();
					}
				}, remaining.current.ms);
				return () => {
					active = false;
					clearTimeout(timer);
					remaining.current.ms = Math.max(0, remaining.current.ms - Math.max(0, Date.now() - started));
				};
			}, [value, enabled, paused]);
			const set = (key, next) => setInteraction((current) => ({
				...(current?.value === value ? current : { value, hover: false, focus: false }), [key]: next,
			}));
			return {
				onMouseEnter: () => set("hover", true), onMouseLeave: () => set("hover", false),
				onFocus: () => set("focus", true),
				onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) set("focus", false); },
			};
		}

		function HelpTooltip({ id, label, children }) {
			const [position, setPosition] = _react.useState(null);
			const wrapRef = _react.useRef(null);
			const hovered = _react.useRef(false);
			const focused = _react.useRef(false);
			const pinned = _react.useRef(false);
			const close = () => { pinned.current = false; setPosition(null); };
			const show = () => {
				const rect = wrapRef.current?.getBoundingClientRect();
				if (!rect) return;
				const viewportWidth = window.innerWidth || 1024;
				const viewportHeight = window.innerHeight || 768;
				const width = Math.min(360, viewportWidth - 24);
				const below = viewportHeight - rect.bottom - 12;
				const above = rect.top - 12;
				const placeBelow = below >= Math.min(200, above);
				setPosition({ width, boxSizing: "border-box", left: Math.max(12, Math.min(rect.left, viewportWidth - width - 12)),
					maxHeight: Math.max(40, Math.min(240, placeBelow ? below : above)),
					...(placeBelow ? { top: rect.bottom } : { bottom: viewportHeight - rect.top }) });
			};
			_react.useEffect(() => {
				if (position === null) return;
				const outside = (event) => { if (!wrapRef.current?.contains(event.target)) close(); };
				const escape = (event) => {
					if (event.key !== "Escape") return;
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation?.();
					close();
				};
				document.addEventListener("keydown", escape, true);
				document.addEventListener("pointerdown", outside);
				document.addEventListener("focusin", outside);
				window.addEventListener("scroll", outside, true);
				window.addEventListener("resize", close);
				return () => {
					document.removeEventListener("keydown", escape, true);
					document.removeEventListener("pointerdown", outside);
					document.removeEventListener("focusin", outside);
					window.removeEventListener("scroll", outside, true);
					window.removeEventListener("resize", close);
				};
			}, [position]);
            if (previewPrimitives.Tooltip) return (0, jsx.jsx)(previewPrimitives.Tooltip, {
                label: children, side: "bottom", portal: true, openOnClick: true, maxWidth: 400,
                children: (0, jsx.jsx)("button", { type: "button", className: "dac-help-button", "aria-label": label,
                    children: (0, jsx.jsx)(IconInfo, {}) }),
            });

			return (0, jsx.jsxs)("span", { className: "dac-help", ref: wrapRef,
				onMouseEnter: () => { hovered.current = true; show(); },
				onMouseLeave: () => { hovered.current = false; if (!focused.current && !pinned.current) close(); },
				onFocus: () => { focused.current = true; show(); },
				onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) { focused.current = false; if (!hovered.current) close(); } },
				onKeyDown: (event) => { if (event.key === "Escape" && position !== null) { event.preventDefault(); event.stopPropagation(); close(); } },
				children: [
					(0, jsx.jsx)("button", { type: "button", className: "dac-help-button", "aria-label": label,
						"aria-describedby": position !== null ? id : void 0,
						onClick: () => { if (pinned.current) close(); else { pinned.current = true; show(); } },
						children: (0, jsx.jsx)(IconInfo, {}) }),
					position !== null && (0, jsx.jsx)("span", { id, role: "tooltip", className: "dac-note-tooltip", style: position, children }),
				] });
		}

		function NotePreview({ note, sessionId, t }) {
			const [position, setPosition] = _react.useState(null);
			const wrapRef = _react.useRef(null);
			const hovered = _react.useRef(false);
			const focused = _react.useRef(false);
			const dismiss = () => {
				const wrap = wrapRef.current;
				if (document.activeElement !== wrap && wrap?.contains(document.activeElement)) wrap.focus({ preventScroll: true });
				setPosition(null);
			};
			const tooltipId = `dac-note-${encodeURIComponent(sessionId)}`;
			const show = () => {
				const summary = wrapRef.current?.querySelector(".dac-row-note-summary");
				if (!summary || summary.scrollWidth <= summary.clientWidth) { setPosition(null); return; }
				const rect = wrapRef.current?.getBoundingClientRect();
				if (!rect) return;
				const width = Math.min(420, (window.innerWidth || 1024) - 24);
				const viewportHeight = window.innerHeight || 768;
				const below = viewportHeight - rect.bottom - 12;
				const above = rect.top - 12;
				const placeBelow = below >= Math.min(240, above);
				setPosition({ width, left: Math.max(12, Math.min(rect.left, (window.innerWidth || 1024) - width - 12)),
					maxHeight: Math.max(40, Math.min(240, placeBelow ? below : above)),
					...(placeBelow ? { top: rect.bottom } : { bottom: viewportHeight - rect.top }) });
			};
			_react.useEffect(() => {
				if (position === null) return;
				const close = (event) => { if (!wrapRef.current?.contains(event.target)) setPosition(null); };
				window.addEventListener("scroll", close, true);
				window.addEventListener("resize", close);
				return () => { window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close); };
			}, [position]);
            if (previewPrimitives.Tooltip) return (0, jsx.jsx)(previewPrimitives.Tooltip, {
                label: (0, jsx.jsx)("div", { className: "dac-note-content", children: note }),
                side: "bottom", align: "start", portal: true, openOnClick: true, maxWidth: 400,
                children: (0, jsx.jsx)("span", { className: "dac-row-note", tabIndex: 0, "aria-label": t("note.label"),
                    children: (0, jsx.jsx)("span", { className: "dac-row-note-summary", children: note }) }),
            });

			return (0, jsx.jsxs)("div", {
				className: "dac-row-note", ref: wrapRef, tabIndex: 0, "aria-label": t("note.label"),
				"aria-describedby": position === null ? void 0 : tooltipId,
				onMouseEnter: () => { hovered.current = true; show(); },
				onMouseLeave: () => { hovered.current = false; if (!focused.current) setPosition(null); },
				onFocus: () => { focused.current = true; show(); },
				onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) { focused.current = false; if (!hovered.current) setPosition(null); } },
				onClick: (event) => { event.preventDefault(); event.stopPropagation(); show(); },
				onKeyDown: (event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); dismiss(); } },
				children: [
					(0, jsx.jsx)("span", { className: "dac-row-note-summary", children: note }),
					position !== null && (0, jsx.jsx)("div", { id: tooltipId, role: "tooltip", tabIndex: 0, className: "dac-note-tooltip", style: position, children: note })
				]
			});
		}

        function useActionTooltip(tooltipId, disabled) {
            const [anchor, setAnchor] = _react.useState(null);
            const tooltipRef = _react.useRef(null);
            const hide = () => setAnchor(null);
            const show = (event) => {
                if (disabled) return;
                const rect = event.currentTarget.getBoundingClientRect();
                setAnchor({ left: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom, ready: false });
            };
            _react.useEffect(() => {
                if (!anchor) return;
                if (disabled) { hide(); return; }
                if (!anchor.ready && tooltipRef.current) {
                    const rect = tooltipRef.current.getBoundingClientRect();
                    setAnchor({ ...anchor, ready: true,
                        left: Math.max(12, Math.min(anchor.left - rect.width / 2, window.innerWidth - rect.width - 12)),
                        top: anchor.top >= rect.height + 20 ? anchor.top - rect.height - 8 : anchor.bottom + 8,
                    });
                }
                const escape = (event) => {
                    if (event.key !== "Escape") return;
                    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.(); hide();
                };
                document.addEventListener("keydown", escape, true);
                window.addEventListener("scroll", hide, true);
                window.addEventListener("resize", hide);
                return () => {
                    document.removeEventListener("keydown", escape, true);
                    window.removeEventListener("scroll", hide, true);
                    window.removeEventListener("resize", hide);
                };
            }, [anchor, disabled]);
            return { anchor, tooltipRef, tooltipId, show, hide };
        }

        function PreviewTitleButton({ sessionId, title, label, disabled, onPreview }) {
            const { anchor, tooltipRef, tooltipId, show, hide } = useActionTooltip(`dac-preview-tip-${sessionId}`, disabled);
            if (previewPrimitives.Tooltip) return (0, jsx.jsx)(previewPrimitives.Tooltip, {
                label, disabled, side: "bottom", portal: true,
                children: (0, jsx.jsx)("button", { type: "button", className: "dac-row-title dac-row-open", disabled,
                    "aria-label": label, onClick: onPreview, children: title }),
            });
            return (0, jsx.jsxs)(jsx.Fragment, { children: [
                (0, jsx.jsx)("button", {
                    type: "button", className: "dac-row-title dac-row-open", disabled,
                    "aria-label": label, "aria-describedby": anchor ? tooltipId : undefined,
                    onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide,
                    onClick: () => { hide(); return onPreview(); }, children: title,
                }),
                anchor && (0, jsx.jsx)("span", { id: tooltipId, ref: tooltipRef, role: "tooltip", className: "dac-delete-tooltip",
                    style: { left: anchor.left, top: anchor.top, visibility: anchor.ready ? "visible" : "hidden" }, children: label,
                }),
            ] });
        }

        function ArchiveDeleteButton({ sessionId, label, disabled, onDelete }) {
            const { anchor, tooltipRef, tooltipId, show, hide } = useActionTooltip(`dac-delete-tip-${sessionId}`, disabled);
            if (previewPrimitives.Tooltip) return (0, jsx.jsx)(previewPrimitives.Tooltip, {
                label, disabled, side: "bottom", portal: true,
                children: (0, jsx.jsx)(ControlButton, { className: "dac-iconbtn", "data-dac-delete": true, disabled, "aria-label": label,
                    onClick: onDelete, children: (0, jsx.jsx)(IconTrash, {}) }),
            });
            return (0, jsx.jsxs)("span", { className: "dac-delete-control",
                onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide,
                children: [
                    (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-iconbtn", "data-dac-delete": true, disabled,
                        "aria-label": label, "aria-describedby": anchor ? tooltipId : undefined,
                        onClick: () => { hide(); return onDelete(); }, children: (0, jsx.jsx)(IconTrash, {}),
                    }),
                    anchor && (0, jsx.jsx)("span", { id: tooltipId, ref: tooltipRef, role: "tooltip", className: "dac-delete-tooltip",
                        style: { left: anchor.left, top: anchor.top, visibility: anchor.ready ? "visible" : "hidden" }, children: label,
                    }),
                ],
            });
        }

				function GroupSection({ group, t, collapsed, onToggleCollapsed, menuOpen, onToggleMenu, onUnarchive, onPermanentDelete, onExport, onPreview, contentHits, busy, stats, onArchive, selectionMode = false, selectedIds, onSelect }) {
			const wrapRef = _react.useRef(null);
			const closeMenu = () => {
				const trigger = wrapRef.current?.querySelector?.('[data-dac-workspace-menu]');
				trigger?.focus?.();
				onToggleMenu(null);
				return trigger;
			};
			_react.useEffect(() => {
				if (!menuOpen || hasNativeMoreMenu) return void 0;
				const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) onToggleMenu(null); };
				document.addEventListener("mousedown", onDown);
				return () => document.removeEventListener("mousedown", onDown);
			}, [menuOpen, onToggleMenu]);
			const ids = group.sessionIds;
			const groupBusy = ids.some((id) => busy[id] === true);
			return (0, jsx.jsxs)("div", {
				className: "dac-group dac-archive-group",
				children: [
					(0, jsx.jsxs)("div", {
						className: "dac-group-head",
                        "data-menu-open": menuOpen === true,
                        onClick: event => { if (!event.target.closest("button, a, input, [role=menu]")) onToggleCollapsed(group.key); },
						ref: wrapRef,
						children: [
							(0, jsx.jsxs)("div", {
								className: "dac-group-left",
								children: [
									(0, jsx.jsxs)("button", {
										type: "button",
										className: "dac-group-toggle dac-archive-group-toggle",
										"aria-expanded": collapsed !== true,
										"aria-label": `${collapsed === true ? t("group.expand") : t("group.collapse")}: ${group.title}`,
										title: `${collapsed === true ? t("group.expand") : t("group.collapse")}: ${group.title}`,
										onClick: () => onToggleCollapsed(group.key),
										children: [
											(0, jsx.jsx)(WorkspaceDisclosureIcon, { open: collapsed !== true }),
											(0, jsx.jsx)("span", { children: group.title })
										]
									})
								]
							}),
							(0, jsx.jsxs)("div", {
							className: "dac-group-side",
							children: [
								(0, jsx.jsx)("span", { className: "dac-count", children: chatsCount(t, group.items.length) }),
									!selectionMode && (0, jsx.jsxs)(ToolbarMoreMenu, {
                                    t, triggerLabel: t("menu.workspaceActions", { title: group.title }),
                                    open: menuOpen, onOpenChange: value => onToggleMenu(value ? group.key : null),
                                    triggerProps: { "data-dac-workspace-menu": true }, iconSize: 16,
                                    children: [
										(0, jsx.jsx)("div", { className: "dac-menu-heading", role: "presentation", children: t("menu.workspaceScope") }),
										...(onArchive ? [(0, jsx.jsx)(HostMenuItem, {
                                        type: "button", className: "dac-menu-item", role: "menuitem",
                                        disabled: group.archiveAvailable === false,
                                        onClick: () => { const trigger = closeMenu(); onArchive(group, { currentTarget: trigger }); },
                                        children: t("unarchived.archiveAll")
                                    }), (0, jsx.jsx)("div", { role: "separator", className: "dac-menu-separator" }),
                                    (0, jsx.jsx)(HostMenuItem, {
                                        type: "button", className: "dac-menu-item dac-danger", role: "menuitem", disabled: groupBusy,
                                        onClick: () => { closeMenu(); return onPermanentDelete(ids, { kind: "workspace", title: group.title }); },
                                        children: t("menu.deleteAllPermanently")
                                    })] : [
										(0, jsx.jsx)(HostMenuItem, {
										type: "button",
										className: "dac-menu-item",
										role: "menuitem",
										disabled: groupBusy,
										onClick: () => { closeMenu(); onUnarchive(ids, group.title); },
										children: t("menu.unarchiveAll")
									}),

									(0, jsx.jsx)(HostMenuItem, {
										type: "button",
										className: "dac-menu-item",
										role: "menuitem",
										disabled: groupBusy,
										onClick: () => { closeMenu(); onExport(ids, group.title); },
										children: t("export.all")
									}),
									(0, jsx.jsx)("div", { role: "separator", className: "dac-menu-separator" }),
									(0, jsx.jsx)(HostMenuItem, {
										type: "button",
										className: "dac-menu-item dac-danger",
										role: "menuitem",
										disabled: groupBusy,
										onClick: () => { closeMenu(); return onPermanentDelete(ids, { kind: "workspace", title: group.title }); },
										children: t("menu.deleteAllPermanently")
										})
								])
									]
                                })
								]
							}),
						]
					}),
					collapsed !== true && (0, jsx.jsx)("div", {
					className: "dac-list",
					children: group.items.map((session) => (0, jsx.jsxs)("div", {
						className: "dac-row",
							children: [
								(0, jsx.jsxs)("div", {
									className: "dac-row-select",
									children: [
										selectionMode && (0, jsx.jsx)(SelectionCheckbox, { checked: selectedIds.has(session.id), disabled: busy[session.id] === true, ariaLabel: selectChatLabel(t, session.title ?? t("chat.untitled")), "data-session-id": session.id, onChange: checked => onSelect(session.id, checked) }),
										(0, jsx.jsxs)("div", {
												className: "dac-row-main",
												children: [
													(0, jsx.jsx)(PreviewTitleButton, {
                                                        sessionId: session.id, title: session.title ?? t("chat.untitled"),
                                                        label: previewOpenLabel(t, session.title ?? t("chat.untitled")),
                                                        disabled: busy[session.id] === true,
                                                        onPreview: () => onPreview(session, onArchive ? "unarchived" : "archive")
                                                    }),
												(0, jsx.jsxs)("div", {
													className: "dac-row-meta dac-row-extras",
														children: [
															...(Array.isArray(session.tags) ? session.tags.slice(0, 3) : []).map((tag) => (0, jsx.jsx)("span", { className: "dac-chip", title: tag, children: tag }, tag)),
															Array.isArray(session.tags) && session.tags.length > 3 && (0, jsx.jsx)("span", { className: "dac-chip dac-chip-more", children: `+${session.tags.length - 3}` }),
														typeof session.note === "string" && session.note.trim() !== "" && (0, jsx.jsx)(NotePreview, { note: session.note, sessionId: session.id, t })
													]
												}),
												(contentHits?.get(session.id)?.matches ?? []).map(match => (0, jsx.jsxs)("button", { type: "button", className: "dac-row-snippet", "aria-label": `${previewOpenLabel(t, session.title || t("chat.untitled"))} #${match.seq}: ${match.excerpt}`, onClick: () => onPreview(session, onArchive ? "unarchived" : "archive", match.seq), children: [
                                                    (0, jsx.jsx)("span", { className: "dac-row-snippet-label", children: `${t("search.contentMatch")} · ` }),
                                                    (0, jsx.jsx)("span", { children: match.excerpt })
                                                ] }, match.seq)),
												(0, jsx.jsxs)("div", { className: "dac-row-footer", children: [
														(0, jsx.jsx)("span", { className: "dac-row-date", title: formatDate(t, session.createdAt), children: formatDate(t, session.createdAt) }),
													(0, jsx.jsx)("span", { className: "dac-row-size", children: onArchive ? (session.busy ? t("unarchived.busy") : session.archiveEligible === false ? t("unarchived.archiveUnavailable") : "") : rowSizeText(t, stats, session.id) })
												] })
											]
											})
										]
									}),
								(0, jsx.jsxs)("div", {
									className: "dac-row-actions",
									children: onArchive ? [
                                    (0, jsx.jsx)(ArchiveDeleteButton, {
                                        sessionId: session.id, label: t(session.busy ? "chat.deleteRunning" : "chat.deleteUnarchived"),
                                        disabled: busy[session.id] === true || session.busy === true || !Number.isSafeInteger(session.createdAt),
                                        onDelete: () => onPermanentDelete([session.id])
                                    }),
                                    (0, jsx.jsxs)(ControlButton, {
                                        type: "button", className: "dac-unarchive",
                                        disabled: session.archiveEligible === false || busy[session.id] === true,
                                        onClick: (event) => onArchive(group, event, session),
                                        children: [(0, jsx.jsx)(IconArchive, { size: 15, strokeWidth: 1.6 }), t("unarchived.archive")]
                                    })] : [
                                    !selectionMode && (0, jsx.jsx)(ArchiveDeleteButton, {
                                        sessionId: session.id, label: t("chat.deleteArchived"),
                                        disabled: busy[session.id] === true,
                                        onDelete: () => onPermanentDelete([session.id])
                                    }),
                                    !selectionMode && (0, jsx.jsxs)(ControlButton, {
                                        type: "button", className: "dac-unarchive dac-archive-unarchive",
                                        disabled: busy[session.id] === true,
                                        onClick: () => onUnarchive([session.id]), children: t("chat.unarchive")
                                    })
									]
								})
							]
						}, session.id))
					})
				]
			}, group.key);
		}

        function flattenLineageNodes(nodes) {
            const output = [];
            const roots = Array.isArray(nodes) ? nodes : [];
            const stack = roots.map(node => ({ node, level: 1, parent: node.sourceParent ?? null })).reverse();
            while (stack.length) {
                const current = stack.pop();
                output.push(current);
                const children = Array.isArray(current.node.children) ? current.node.children : [];
                for (let i = children.length - 1; i >= 0; i--) stack.push({ node: children[i], level: current.level + 1, parent: children[i].sourceParent ?? current.node });
            }
            return output;
        }

        // Layout uses the visible forest only. Subtree spans are measured bottom-up
        // without recursion, so independent roots and deep imported chains stay safe.
        function layoutLineage(nodes, diagnostics = []) {
            const flagged = new Set(diagnostics.map(item => item.sessionId));
            const items = flattenLineageNodes(nodes).map(entry => ({ ...entry,
                width: 320, height: 180
                    + (flagged.has(entry.node.id) ? 44 : 0), x: 0, y: 0, span: 0 }));
            const byId = new Map(items.map(item => [item.node.id, item]));
            const children = item => (item.node.children ?? []).map(node => byId.get(node.id)).filter(Boolean);
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                item.visibleChildren = children(item);
                item.childSpan = item.visibleChildren.reduce((sum, child) => sum + child.span, 0) + Math.max(0, item.visibleChildren.length - 1) * 28;
                item.span = Math.max(item.height, item.childSpan);
            }
            let top = 28;
            const pending = [];
            for (const item of items.filter(item => item.level === 1)) {
                pending.push({ item, top }); top += item.span + 44;
            }
            let width = 0, height = 0;
            while (pending.length) {
                const { item, top } = pending.pop();
                item.x = 28 + (item.level - 1) * 420;
                item.y = top + (item.span - item.height) / 2;
                width = Math.max(width, item.x + item.width + 28);
                height = Math.max(height, item.y + item.height + 28);
                let childTop = top + (item.span - item.childSpan) / 2;
                for (const child of item.visibleChildren) {
                    pending.push({ item: child, top: childTop }); childTop += child.span + 28;
                }
            }
            const edges = [];
            for (const item of items) {
                for (const child of item.visibleChildren) edges.push({ from: item, to: child, delegated: child.node.origin === "subagent" });
            }
            return { items, edges, width: Math.max(320, width), height: Math.max(188, height) };
        }

        function lineageEdgePath(edge) {
            const x1 = edge.from.x + edge.from.width, y1 = edge.from.y + 90;
            const x2 = edge.to.x, y2 = edge.to.y + 90;
            const middle = (x1 + x2) / 2;
            return `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2} ${y2}`;
        }

        function lineagePathIds(layout, selectedId) {
            const parents = new Map(layout.edges.map(edge => [edge.to.node.id, edge.from.node.id]));
            const ids = new Set(layout.items.filter(item => item.node.searchMatch === "direct" || item.node.id === selectedId).map(item => item.node.id));
            for (const id of [...ids]) {
                let parent = parents.get(id);
                while (parent !== undefined && !ids.has(parent)) { ids.add(parent); parent = parents.get(parent); }
            }
            return ids;
        }

        function lineageHighlightedTitle(title, query) {
            const needle = String(query ?? "").trim().toLocaleLowerCase("en-US");
            const index = needle === "" ? -1 : title.toLocaleLowerCase("en-US").indexOf(needle);
            return index < 0 ? title : [title.slice(0, index),
                (0, jsx.jsx)("mark", { className: "dac-lineage-match", children: title.slice(index, index + needle.length) }, "match"),
                title.slice(index + needle.length)];
        }

        function LineageTreeNodes({ nodes, diagnostics = [], onCopy, copiedId, searchQuery = "", onPreview, t,
            layout = layoutLineage(nodes, diagnostics), selectedId, onSelect }) {
            const highlighted = lineagePathIds(layout, selectedId);
            const diagnosticsBySession = new Map();
            for (const item of diagnostics) {
                const items = diagnosticsBySession.get(item.sessionId) ?? [];
                items.push(item); diagnosticsBySession.set(item.sessionId, items);
            }
            return (0, jsx.jsxs)(jsx.Fragment, { children: [
                (0, jsx.jsx)("svg", { className: "dac-lineage-edges", width: layout.width, height: layout.height, "aria-hidden": "true", children: layout.edges.map(edge =>
                    (0, jsx.jsx)("path", { d: lineageEdgePath(edge), "data-from": edge.from.node.id, "data-to": edge.to.node.id,
                        className: `dac-lineage-edge${edge.delegated ? " delegated" : ""}${highlighted.has(edge.from.node.id) && highlighted.has(edge.to.node.id) ? " highlighted" : ""}` }, `${edge.from.node.id}:${edge.to.node.id}`)) }),
                ...layout.items.map(({ node, level, parent, x, y, width, height }) => {
                    const contextOnly = node.contextOnly || node.status === "missing";
                    const title = lineageNodeLabel(t, node);
                    const kind = node.origin === "subagent" ? "subagent" : parent || node.parentSession || node.isSeeded === true ? "fork" : node.isSeeded === false ? "root" : "unknown";
                    const created = formatDate(t, node.createdAt);
                    const time = node.createdAt == null ? null : new Date(node.createdAt);
                    const shortDate = time && Number.isFinite(time.getTime()) ? new Intl.DateTimeFormat(t("locale.intl"), { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(time) : created;
                    const relation = parent ? node.origin === "subagent"
                        ? t("lineage.delegatedBy", { title: lineageNodeLabel(t, parent) })
                        : lineageRelationText(t, parent)
                        : kind === "root" ? t("lineage.start") : !node.parentSession && node.isSeeded === true ? t("lineage.sourceUnrecorded") : t("lineage.sourceUnavailable");
                    const crossWorkspace = parent && lineageWorkspaceKey(parent) !== lineageWorkspaceKey(node);
                    const sourceText = crossWorkspace ? `${relation} · ${t("lineage.crossWorkspace")}: ${lineageWorkspaceLabel(t, parent)}` : relation;
                    const nodeDiagnostics = diagnosticsBySession.get(node.id) ?? [];
                    const originText = [t(`lineage.origin.${kind}`), node.origin === "subagent" ? `${t("lineage.delegation")} ${node.delegationDepth ?? 0}` : null].filter(Boolean).join(" · ");
                    return (0, jsx.jsx)("div", { role: "listitem", "aria-level": level, "data-node-id": node.id,
                        className: `dac-lineage-node${highlighted.has(node.id) ? " highlighted" : ""}`, style: { left: x, top: y, width, height }, children:
                        (0, jsx.jsxs)("div", { className: `dac-lineage-row dac-lineage-row-${node.status}${contextOnly ? " dac-lineage-context-card" : ""}`,
                            onClick: event => { if (!event.target.closest("button, a, input, select, textarea")) onSelect?.(node.id); },
                            children: [
                                parent && (0, jsx.jsx)("span", { className: "dac-lineage-port incoming", "aria-hidden": "true" }),
                                node.children?.length > 0 && (0, jsx.jsx)("span", { className: "dac-lineage-port outgoing", "aria-hidden": "true" }),
                                (0, jsx.jsxs)("div", { className: "dac-lineage-card-head", children: [
                                    (0, jsx.jsx)("span", { className: `dac-lineage-kind-icon ${kind}`, title: originText, children: (0, jsx.jsx)(IconLineage, { root: kind === "root" }) }),
                                    (0, jsx.jsx)("strong", { title, children: node.status !== "missing" && onPreview
                                        ? (0, jsx.jsx)("button", { type: "button", className: "dac-lineage-title", "aria-label": previewOpenLabel(t, title),
                                            onFocus: () => onSelect?.(node.id),
                                            onClick: () => { onSelect?.(node.id); onPreview(node, "lineage"); },
                                            children: lineageHighlightedTitle(title, node.searchMatch === "direct" ? searchQuery : "") })
                                        : lineageHighlightedTitle(title, node.searchMatch === "direct" ? searchQuery : "") }),
                                    (0, jsx.jsx)("span", { className: `dac-chat-status dac-lineage-${node.status}`, children: t(`lineage.status.${node.status}`) }),
                                ] }),
                                (0, jsx.jsxs)("div", { className: "dac-lineage-card-body", children: [
                                    (0, jsx.jsxs)("div", { className: "dac-lineage-meta", title: lineageProjectText(t, node), children: [
                                        (0, jsx.jsx)(IconFolder, { size: 13 }), (0, jsx.jsx)("span", { children: lineageWorkspaceLabel(t, node) }),
                                    ] }),
                                    (0, jsx.jsxs)("div", { className: "dac-lineage-relation", title: `${originText} · ${sourceText}${parent ? ` · ${t("lineage.sourceId")}: ${parent.id}` : ""}`, children: [
                                        (0, jsx.jsx)(IconChat, { size: 13 }), (0, jsx.jsx)("span", { className: "dac-lineage-source", title: sourceText, children: parent || (!node.parentSession && node.isSeeded === true) ? sourceText : originText }),
                                    ] }),
                                    (0, jsx.jsx)("small", { className: contextOnly ? "dac-lineage-source-context" : "dac-lineage-search-label", children: contextOnly ? t("lineage.contextOnly")
                                        : node.searchMatch ? t(node.searchMatch === "direct" ? "lineage.searchMatch" : "lineage.searchRelated") : lineageBranchText(t, (node.children ?? []).length) }),
                                ] }),
                                (0, jsx.jsxs)("div", { className: "dac-lineage-footer", children: [
                                    (0, jsx.jsxs)("small", { className: "dac-lineage-created", title: `${t("lineage.created")}: ${created}`, children: [(0, jsx.jsx)(IconClock, { size: 12 }), shortDate] }),
                                    node.status !== "missing" && (0, jsx.jsxs)("div", { className: "dac-lineage-id-actions", children: [
                                        (0, jsx.jsx)("small", { className: "dac-lineage-id", title: node.id, children: compactSessionId(node.id) }),
                                        (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-lineage-copy", title: t(copiedId === node.id ? "lineage.copiedId" : "lineage.copyId"),
                                            "aria-label": `${t(copiedId === node.id ? "lineage.copiedId" : "lineage.copyId")} ${node.id}`, onClick: () => onCopy?.(node.id),
                                            children: (0, jsx.jsx)(copiedId === node.id ? IconCheck : IconCopy, { size: 13 }) }),
                                    ] }),
                                ] }),
                                nodeDiagnostics.length > 0 && (0, jsx.jsx)("div", { className: "dac-lineage-diagnostics", role: "status", children: nodeDiagnostics.map(item => (0, jsx.jsx)("span", { className: "dac-lineage-diagnostic", children: lineageDiagnosticText(t, item) }, `${item.code}:${item.relatedId ?? ""}`)) }),
                            ] }),
                    }, node.id);
                }),
            ] });
        }

        const clampLineageZoom = value => Math.max(0.05, Math.min(2, value));

        function LineageList({ nodes, diagnostics = [], t, searchQuery, onPreview, onGraph, families, onCopy, copiedId, sessionOrder }) {
            const diagnosticsById = new Map();
            for (const item of diagnostics) {
                const entries = diagnosticsById.get(item.sessionId) ?? [];
                entries.push(item); diagnosticsById.set(item.sessionId, entries);
            }
            const ranks = new Map((sessionOrder ?? []).map((id, index) => [id, index]));
            return (0, jsx.jsx)("div", { className: "dac-list", role: "list", children: flattenLineageNodes(nodes)
                .filter(({ node }) => !node.contextOnly && node.status !== "missing")
                .sort((a, b) => (ranks.get(a.node.id) ?? ranks.size) - (ranks.get(b.node.id) ?? ranks.size))
                .map(({ node, parent }) => {
                    const title = lineageNodeLabel(t, node);
                    const family = families.get(node.id);
                    const related = family && (family.root.id !== node.id || family.root.children?.length > 0);
                    const unrecorded = !parent && !node.parentSession && node.isSeeded === true;
                    const source = parent ? node.origin === "subagent"
                        ? t("lineage.delegatedBy", { title: lineageNodeLabel(t, parent) })
                        : lineageRelationText(t, parent)
                        : unrecorded ? t("lineage.sourceUnrecorded") : node.parentSession ? t("lineage.sourceUnavailable") : related ? t("lineage.start") : t("lineage.independent");
                    return (0, jsx.jsxs)("div", { role: "listitem", className: `dac-row dac-lineage-row-${node.status}`, children: [
                        (0, jsx.jsx)("div", { className: "dac-row-select", children: (0, jsx.jsxs)("div", { className: "dac-row-main", children: [
                            (0, jsx.jsxs)("div", { className: "dac-lineage-list-title", children: [
                                (0, jsx.jsx)(PreviewTitleButton, { sessionId: `lineage-${node.id}`,
                                    title: lineageHighlightedTitle(title, node.searchMatch === "direct" ? searchQuery : ""),
                                    label: previewOpenLabel(t, title), onPreview: () => onPreview?.(node, "lineage") }),
                                (0, jsx.jsx)("span", { className: `dac-chat-status dac-lineage-${node.status}`, children: t(`lineage.status.${node.status}`) }),
                            ] }),
                            (0, jsx.jsxs)("div", { className: "dac-row-meta dac-row-date dac-lineage-list-meta", children: [
                                (0, jsx.jsx)("span", { title: unrecorded ? t("lineage.sourceUnrecordedHint") : source, children: source }),
                                family?.node.children?.length > 0 && (0, jsx.jsx)("span", { children: lineageBranchText(t, family.node.children.length) }),
                                node.searchMatch && (0, jsx.jsx)("span", { children: t(node.searchMatch === "direct" ? "lineage.searchMatch" : "lineage.searchRelated") }),
                            ] }),
                            (0, jsx.jsxs)("div", { className: "dac-row-footer dac-lineage-list-footer", children: [
                                (0, jsx.jsx)("span", { className: "dac-row-date", title: `${t("lineage.created")}: ${formatDate(t, node.createdAt)}`,
                                    children: `${t("lineage.created")} ${formatDate(t, node.createdAt)}` }),
                                (0, jsx.jsxs)("span", { className: "dac-lineage-list-id", children: [
                                    (0, jsx.jsx)("span", { className: "dac-row-id", title: node.id, children: `ID: ${compactSessionId(node.id)}` }),
                                    (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-lineage-copy",
                                        title: t(copiedId === node.id ? "lineage.copiedId" : "lineage.copyId"),
                                        "aria-label": `${t(copiedId === node.id ? "lineage.copiedId" : "lineage.copyId")} ${node.id}`,
                                        onClick: () => onCopy?.(node.id), children: (0, jsx.jsx)(copiedId === node.id ? IconCheck : IconCopy, { size: 13 }) }),
                                ] }),
                            ] }),
                            (diagnosticsById.get(node.id) ?? []).map(item => (0, jsx.jsx)("small", { className: "dac-lineage-diagnostic", children: lineageDiagnosticText(t, item) }, `${item.code}:${item.relatedId ?? ""}`)),
                        ] }) }),
                        (0, jsx.jsx)("div", { className: "dac-row-actions", children: related && (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-unarchive dac-archive-unarchive dac-lineage-open-graph",
                            "aria-label": `${t("lineage.view.open")}: ${title}`, onClick: () => onGraph(node.id),
                            children: t("lineage.view.open") }) }),
                    ] }, node.id);
                }) });
        }

        function LineageCanvas(props) {
            const { nodes, diagnostics, searchQuery, t, label, onClose, focusId } = props;
            const layout = _react.useMemo(() => layoutLineage(nodes, diagnostics), [nodes, diagnostics]);
            const [view, setView] = _react.useState({ zoom: 1, x: 0, y: 0 });
            const [enlarged, setEnlarged] = _react.useState(Boolean(onClose));
            const [selectedId, setSelectedId] = _react.useState(focusId ?? null);
            const [dragging, setDragging] = _react.useState(false);
            const viewportRef = _react.useRef(null);
            const panelRef = _react.useRef(null);
            const enlargeRef = _react.useRef(null);
            const dragRef = _react.useRef(null);
            const pointerFocusRef = _react.useRef(false);
            const viewRef = _react.useRef(view);
            const initialFit = _react.useRef(false);
            const lastQuery = _react.useRef("");
            const updateView = next => { viewRef.current = next; setView(next); };
            const handleEscape = event => {
                if (!enlarged || event.key !== "Escape" || document.querySelector?.(".dac-preview-dialog")) return;
                event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.();
                event.nativeEvent?.stopImmediatePropagation?.();
                if (onClose) onClose(); else setEnlarged(false);
            };
            const fit = (initial = false) => {
                const viewport = viewportRef.current;
                if (!viewport?.clientWidth || !viewport.clientHeight) return;
                const padding = initial === true ? 0 : 24;
                const fitted = Math.min((viewport.clientWidth - padding * 2) / layout.width,
                    (viewport.clientHeight - padding * 2) / layout.height);
                const zoom = clampLineageZoom(initial === true ? Math.max(0.65, Math.min(1, fitted)) : fitted);
                let x = (viewport.clientWidth - layout.width * zoom) / 2;
                let y = (viewport.clientHeight - layout.height * zoom) / 2;
                if (initial === true && zoom > fitted) {
                    const selected = layout.items.find(item => item.node.id === focusId) ?? layout.items[0];
                    x = selected ? (viewport.clientWidth - selected.width * zoom) / 2 - selected.x * zoom : 24;
                    y = selected ? (viewport.clientHeight - selected.height * zoom) / 2 - selected.y * zoom : 24;
                }
                updateView({ zoom, x, y });
                initialFit.current = true;
            };
            const changeZoom = (factor, anchor) => {
                const viewport = viewportRef.current;
                if (!viewport || !Number.isFinite(factor) || factor <= 0) return;
                const current = viewRef.current;
                const zoom = clampLineageZoom(current.zoom * factor);
                if (zoom === current.zoom) return;
                const x = anchor?.x ?? viewport.clientWidth / 2;
                const y = anchor?.y ?? viewport.clientHeight / 2;
                updateView({ zoom,
                    x: x - (x - current.x) * zoom / current.zoom,
                    y: y - (y - current.y) * zoom / current.zoom });
            };
            _react.useEffect(() => { if (!initialFit.current) fit(true); }, [layout]);
            _react.useEffect(() => {
                const viewport = viewportRef.current;
                if (!viewport?.addEventListener) return;
                const onWheel = event => {
                    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
                    const dx = event.deltaX * unit, dy = event.deltaY * unit;
                    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const drag = dragRef.current;
                    if (drag) {
                        dragRef.current = null; setDragging(false);
                        if (viewport.hasPointerCapture?.(drag.pointerId)) viewport.releasePointerCapture(drag.pointerId);
                    }
                    if (event.ctrlKey || event.metaKey) {
                        const rect = viewport.getBoundingClientRect();
                        changeZoom(Math.exp(Math.max(-4, Math.min(4, -dy * 0.002))),
                            { x: event.clientX - rect.left, y: event.clientY - rect.top });
                    } else {
                        const current = viewRef.current;
                        updateView({ ...current, x: current.x - dx, y: current.y - dy });
                    }
                };
                // React delegates wheel events passively. A local native listener
                // lets the graph consume Ctrl/Command wheel without browser zoom.
                viewport.addEventListener("wheel", onWheel, { passive: false });
                return () => viewport.removeEventListener("wheel", onWheel);
            }, []);
            _react.useEffect(() => {
                const viewport = viewportRef.current;
                if (!viewport || typeof window.ResizeObserver !== "function") return;
                let width = viewport.clientWidth, height = viewport.clientHeight;
                const observer = new window.ResizeObserver(() => {
                    if (!initialFit.current) { fit(true); return; }
                    const current = viewRef.current;
                    updateView({ ...current, x: current.x + (viewport.clientWidth - width) / 2,
                        y: current.y + (viewport.clientHeight - height) / 2 });
                    width = viewport.clientWidth; height = viewport.clientHeight;
                });
                observer.observe(viewport);
                return () => observer.disconnect();
            }, [layout]);
            _react.useEffect(() => {
                const query = String(searchQuery ?? "").trim();
                if (query === lastQuery.current) return;
                lastQuery.current = query;
                if (!query || focusId) return;
                const hit = layout.items.find(item => item.node.searchMatch === "direct");
                const viewport = viewportRef.current;
                if (hit && viewport) updateView({ zoom: 1,
                    x: (viewport.clientWidth - hit.width) / 2 - hit.x,
                    y: (viewport.clientHeight - hit.height) / 2 - hit.y });
            }, [searchQuery, layout]);
            _react.useEffect(() => {
                if (!enlarged) return;
                const returnFocus = document.activeElement;
                const oldOverflow = document.body?.style?.overflow;
                if (document.body?.style) document.body.style.overflow = "hidden";
                panelRef.current?.focus?.({ preventScroll: true });
                const onKey = event => {
                    // The shared conversation preview owns focus while it is open.
                    if (document.querySelector?.(".dac-preview-dialog")) return;
                    if (event.key === "Escape") { handleEscape(event); return; }
                    if (event.key !== "Tab") return;
                    const items = previewFocusables(panelRef.current);
                    if (!items.length) { event.preventDefault(); panelRef.current?.focus?.(); return; }
                    const first = items[0], last = items[items.length - 1];
                    if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current || !panelRef.current?.contains?.(document.activeElement))) { event.preventDefault(); last.focus(); }
                    else if (!event.shiftKey && (document.activeElement === last || !panelRef.current?.contains?.(document.activeElement))) { event.preventDefault(); first.focus(); }
                };
                document.addEventListener("keydown", onKey);
                return () => {
                    document.removeEventListener("keydown", onKey);
                    if (document.body?.style) document.body.style.overflow = oldOverflow;
                    (onClose ? returnFocus : enlargeRef.current)?.focus?.({ preventScroll: true });
                };
            }, [enlarged]);
            const endDrag = event => {
                const drag = dragRef.current;
                if (drag && event.pointerId !== drag.pointerId) return;
                dragRef.current = null; setDragging(false);
                if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            };
            const control = (children, action, options = {}) => (0, jsx.jsx)(ControlButton, {
                type: "button", className: "dac-lineage-view-button", onClick: action, ...options, children });
            return (0, jsx.jsxs)("div", { ref: panelRef, className: `dac-lineage-canvas${enlarged ? " enlarged" : ""}`,
                role: enlarged ? "dialog" : "region", "aria-modal": enlarged ? "true" : undefined,
                "aria-label": label, tabIndex: enlarged ? -1 : undefined, onKeyDown: handleEscape,
                onPointerDownCapture: () => { pointerFocusRef.current = true; },
                onPointerUpCapture: () => { pointerFocusRef.current = false; },
                onPointerCancelCapture: () => { pointerFocusRef.current = false; }, children: [
                (0, jsx.jsxs)("div", { className: "dac-lineage-canvas-bar", children: [
                    (0, jsx.jsxs)("div", { className: "dac-lineage-legend", children: [
                        enlarged && (0, jsx.jsx)("strong", { children: label }),
                        (0, jsx.jsx)("span", { className: "dac-lineage-legend-fork", children: t("lineage.origin.fork") }),
                        (0, jsx.jsx)("span", { className: "dac-lineage-legend-agent", children: t("lineage.origin.subagent") }),
                    ] }),
                    onClose ? control((0, jsx.jsx)(IconClose, { size: 14 }), onClose, {
                        ref: enlargeRef, className: "dac-lineage-view-button dac-lineage-close", "aria-label": t("lineage.view.close"), title: t("lineage.view.close") })
                        : control(t(enlarged ? "lineage.view.restore" : "lineage.view.enlarge"), () => setEnlarged(value => !value), { ref: enlargeRef, "aria-expanded": enlarged }),
                ] }),
                (0, jsx.jsxs)("div", { className: "dac-lineage-canvas-body", children: [
                    (0, jsx.jsx)("div", { ref: viewportRef, className: "dac-lineage-viewport", "data-dragging": dragging,
                        tabIndex: 0, "aria-label": t("lineage.view.pan"),
                        onFocusCapture: event => {
                            if (pointerFocusRef.current) return;
                            const target = event.target.closest?.(".dac-lineage-node");
                            const item = layout.items.find(entry => entry.node.id === target?.dataset?.nodeId);
                            const viewport = viewportRef.current;
                            if (!item || !viewport) return;
                            const current = viewRef.current;
                            const left = item.x * current.zoom + current.x, top = item.y * current.zoom + current.y;
                            if (left >= 12 && top >= 12 && left + item.width * current.zoom <= viewport.clientWidth - 12
                                && top + item.height * current.zoom <= viewport.clientHeight - 12) return;
                            updateView({ ...current,
                                x: (viewport.clientWidth - item.width * current.zoom) / 2 - item.x * current.zoom,
                                y: (viewport.clientHeight - item.height * current.zoom) / 2 - item.y * current.zoom });
                        },
                        onKeyDown: event => {
                            if (event.target !== event.currentTarget) return;
                            const delta = { ArrowLeft: [48, 0], ArrowRight: [-48, 0], ArrowUp: [0, 48], ArrowDown: [0, -48] }[event.key];
                            if (!delta) return;
                            event.preventDefault(); event.stopPropagation();
                            const current = viewRef.current;
                            updateView({ ...current, x: current.x + delta[0], y: current.y + delta[1] });
                        },
                        onPointerDown: event => {
                            if (event.button !== 0 || dragRef.current || event.target.closest(".dac-lineage-node, button, a, input")) return;
                            dragRef.current = { pointerId: event.pointerId, pointerX: event.clientX, pointerY: event.clientY,
                                x: viewRef.current.x, y: viewRef.current.y };
                            event.currentTarget.setPointerCapture?.(event.pointerId);
                            setDragging(true); event.preventDefault();
                        },
                        onPointerMove: event => {
                            const drag = dragRef.current;
                            if (!drag || event.pointerId !== drag.pointerId) return;
                            updateView({ ...viewRef.current, x: drag.x + event.clientX - drag.pointerX,
                                y: drag.y + event.clientY - drag.pointerY });
                        }, onPointerUp: endDrag, onPointerCancel: endDrag, onLostPointerCapture: endDrag,
                        children: (0, jsx.jsx)("div", { className: "dac-lineage-stage", role: "list", "aria-label": label,
                            style: { width: layout.width, height: layout.height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` },
                            children: (0, jsx.jsx)(LineageTreeNodes, { ...props, layout, selectedId, onSelect: setSelectedId }) }),
                    }),
                    (0, jsx.jsxs)("div", { className: "dac-lineage-overview", children: [
                        (0, jsx.jsxs)("strong", { children: [`${layout.items.length} `, t("lineage.view.nodes"), " · ", `${layout.edges.length} `, t("lineage.view.connections")] }),
                        (0, jsx.jsx)("small", { children: t("lineage.view.hint") }),
                    ] }),
                    (0, jsx.jsxs)("div", { className: "dac-lineage-zoom", children: [
                        control("+", () => changeZoom(1.25), { "aria-label": t("lineage.view.zoomIn"), title: t("lineage.view.zoomIn"), disabled: view.zoom >= 2 }),
                        (0, jsx.jsx)("output", { "aria-label": t("lineage.view.zoom"), children: `${Math.round(view.zoom * 100)}%` }),
                        control("−", () => changeZoom(1 / 1.25), { "aria-label": t("lineage.view.zoomOut"), title: t("lineage.view.zoomOut"), disabled: view.zoom <= 0.05 }),
                        control((0, jsx.jsx)(IconExpand, { size: 16 }), () => fit(), { "aria-label": t("lineage.view.fit"), title: t("lineage.view.fit") }),
                    ] }),
                ] }),
            ] });
        }

		function ArchiveRelationshipsPanel({ t, onPreview, getLineageListOrder }) {
			const [state, setState] = _react.useState({ status: "loading", value: null });
			const [graphId, setGraphId] = _react.useState(null);
			const [query, setQuery] = _react.useState("");
			const [projectFilter, setProjectFilter] = _react.useState("all");
			const [statusFilter, setStatusFilter] = _react.useState("all");
			const [collapsedWorkspaces, setCollapsedWorkspaces] = _react.useState(readLineageWorkspaces);
			const updateWorkspaceFolds = (update) => setCollapsedWorkspaces((current) => {
				const updated = update(current);
				try { window.localStorage.setItem(KEY_LINEAGE_WORKSPACES, JSON.stringify([...updated])); } catch { /* Browser preferences are optional. */ }
				return updated;
			});
			const toggleWorkspace = (key) => updateWorkspaceFolds((current) => setVisibleSelection(current, [key], !current.has(key)));
			const [copiedId, setCopiedId] = _react.useState(null);
			const copyId = _react.useCallback(async (id) => {
				const clipboard = typeof navigator === "undefined" ? null : navigator.clipboard;
				if (typeof clipboard?.writeText !== "function") return;
				try { await clipboard.writeText(id); setCopiedId(id); } catch { /* Clipboard denial keeps the button retryable. */ }
			}, []);
			const load = _react.useCallback(async (signal) => {
				setState({ status: "loading", value: null });
				try {
					const value = await fetchLineage(signal);
					if (!signal?.aborted) {
						setState({ status: "ready", value });
					}
				}
				catch (error) { if (!signal?.aborted) setState({ status: "error", value: error }); }
			}, []);
			_react.useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load]);
				if (state.status === "loading") return (0, jsx.jsxs)("div", { className: "dac-center", children: [(0, jsx.jsx)("span", { className: "dac-spin" }), t("lineage.loading")] });
				if (state.status === "error") return (0, jsx.jsxs)("div", { className: "dac-center", children: [(0, jsx.jsx)("span", { children: t("lineage.error") }), (0, jsx.jsx)(ControlButton, { className: "dac-retry", onClick: () => load(), children: t("state.retry") })] });
				const sourceRoots = Array.isArray(state.value.roots) ? state.value.roots : [];
                const families = new Map();
                for (const root of sourceRoots) for (const { node } of flattenLineageNodes([root])) families.set(node.id, { root, node });
                const graph = families.get(graphId);
				const workspaceGroups = orderLineageListGroups(groupLineageWorkspaces(sourceRoots, state.value.workspaces ?? []), getLineageListOrder?.());
                const projects = workspaceGroups.map(group => ({ value: group.key, title: lineageWorkspaceLabel(t, { workspace: group.workspace }) }));
				const groups = workspaceGroups
					.filter((group) => projectFilter === "all" || group.key === projectFilter)
					.map((group) => ({ ...group, roots: filterLineageForest(group.roots, query, "all", statusFilter) }))
					.filter((group) => group.roots.length > 0 || (query.trim() === "" && statusFilter === "all"));
				const roots = groups.flatMap((group) => group.roots);
				const managedCount = countManagedLineageNodes(roots);
				const searchActive = query.trim() !== "";
                const managedCountText = t(searchActive || projectFilter !== "all" || statusFilter !== "all" ? "lineage.resultCount" : "lineage.totalCount")
                    .replace("{count}", String(managedCount));
				const canFold = groups.length > 0;
				const allExpanded = canFold && groups.every((group) => !collapsedWorkspaces.has(group.key));
				const toggleAll = () => {
					updateWorkspaceFolds((current) => setVisibleSelection(current, groups.map((group) => group.key), allExpanded));
				};
				return (0, jsx.jsxs)("div", { className: "dac-mode-panel", children: [
                    (0, jsx.jsxs)("div", { className: "dac-lineage-toolbar", children: [
                        (0, jsx.jsx)(ControlInput, { className: "dac-search", icon: (0, jsx.jsx)(IconSearch, {}), ...{ type: "search", value: query, placeholder: t("lineage.search"), onChange: (event) => setQuery(event.target.value) } }),
                        (0, jsx.jsxs)("div", { className: "dac-lineage-list-head", children: [
                            (0, jsx.jsxs)("div", { className: "dac-filters", children: [
                                (0, jsx.jsx)(FilterSelect, {
                                    t, icon: IconFolder,
									value: projectFilter,
									onChange: setProjectFilter,
									ariaLabel: t("lineage.projectFilter"),
									fill: true,
									options: [
										{ value: "all", label: t("lineage.relatedWorkspaces"), heading: true, showIcon: false, separatorAfter: true },
										...projects.map((project) => ({ value: project.value, label: project.title ?? t("group.noProject") }))
									]
								}),
                                (0, jsx.jsx)(FilterSelect, {
                                    t, icon: IconFilter, optionIcons: false, value: statusFilter, onChange: setStatusFilter,
                                    ariaLabel: t("lineage.statusFilter"), fill: true,
                                    options: [
                                        { value: "all", label: t("lineage.statusAll") },
                                        { value: "archived", label: t("lineage.status.archived") },
                                        { value: "active", label: t("lineage.status.active") },
                                    ],
                                }),
                                (0, jsx.jsxs)("span", { className: "dac-lineage-list-head-copy", children: [
                                    (0, jsx.jsx)("small", { children: managedCountText }),
                                    (0, jsx.jsx)(HelpTooltip, { id: "dac-lineage-help", label: t("help.label").replace("{label}", t("lineage.managedHeading")), children: t("lineage.scopeNote") }),
                                ] }),
                            ] }),
                            (0, jsx.jsx)("div", { className: "dac-lineage-fold-actions", children: (0, jsx.jsxs)(ControlButton, { type: "button", className: "dac-lineage-fold", disabled: searchActive || !canFold, title: searchActive ? t("lineage.searchFoldHint") : void 0, onClick: toggleAll, children: [
                                (0, jsx.jsx)("span", { children: t(allExpanded ? "lineage.collapseAll" : "lineage.expandAll") }),
                                (0, jsx.jsx)("span", { className: allExpanded ? "dac-chev collapse" : "dac-chev open", "aria-hidden": "true", children: (0, jsx.jsx)(IconChevron, {}) })
							] }) }),
                        ] }),
                    ] }),
                    (state.value.provenanceStatus === "unavailable" || state.value.forkTrackingStatus === "degraded") && (0, jsx.jsx)("div", { className: "dac-warn", role: "status", children: t("lineage.trackingUnavailable") }),
                    (state.value.deletionStatus === "unavailable") && (0, jsx.jsx)("div", { className: "dac-warn", role: "status", children: t("lineage.deletionUnavailable") }),
					groups.length === 0 ? (0, jsx.jsx)("div", { className: "dac-empty", children: t(sourceRoots.length === 0 ? "lineage.noArchives" : "lineage.empty") }) : (0, jsx.jsx)("div", { className: "dac-lineage-workspaces", children: groups.map((group) => {
						const open = searchActive || !collapsedWorkspaces.has(group.key);
						return (0, jsx.jsxs)("section", { className: "dac-group dac-archive-group dac-lineage-workspace", "aria-label": lineageWorkspaceLabel(t, { workspace: group.workspace }), children: [
							(0, jsx.jsx)("h3", { className: "dac-group-head", onClick: event => { if (!searchActive && !event.target.closest("button")) toggleWorkspace(group.key); }, children: (0, jsx.jsxs)("button", { type: "button", className: "dac-group-toggle dac-archive-group-toggle dac-lineage-workspace-toggle", "aria-expanded": open, disabled: searchActive, title: searchActive ? t("lineage.searchFoldHint") : void 0, onClick: () => toggleWorkspace(group.key), children: [
								(0, jsx.jsx)(WorkspaceDisclosureIcon, { open }),
								(0, jsx.jsx)("span", { className: "dac-lineage-workspace-title", children: lineageWorkspaceLabel(t, { workspace: group.workspace }) }),
								(0, jsx.jsx)("small", { children: `${countManagedLineageNodes(group.roots)} ${t("lineage.managedCount")}` })
							] }) }),
							open && group.roots.length === 0 && (0, jsx.jsx)("div", { className: "dac-empty", children: t("lineage.workspaceEmpty") }),
                            open && group.roots.length > 0 && (0, jsx.jsx)(LineageList, { nodes: group.roots, sessionOrder: group.sessionOrder, diagnostics: state.value.diagnostics, searchQuery: query, onPreview, t, families, onGraph: setGraphId, onCopy: copyId, copiedId })
						] }, group.key);
					}) }),
                    graph && (0, jsx.jsx)("div", { className: "dac-lineage-modal-backdrop", children: (0, jsx.jsx)(LineageCanvas, {
                        label: `${t("lineage.view.title")}: ${lineageNodeLabel(t, graph.node)}`, nodes: [graph.root], focusId: graphId,
                        diagnostics: state.value.diagnostics, copiedId, searchQuery: "", onPreview, t, onCopy: copyId, onClose: () => setGraphId(null),
                    }, graphId) }),
				] });
		}

		function safeAboutLink(value) {
			try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : null; }
			catch { return null; }
		}

		function validAbout(value) {
			return value?.name === "dsh-archived-chats" && typeof value.version === "string"
				&& typeof value.links === "object" && value.links !== null;
		}

        function watchPluginUpdates(check, { target = document, network = window, now = Date.now, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
            let stopped = false, lastWake = now(), timer;
            const wake = () => {
                if (stopped || target.visibilityState === "hidden" || network.navigator?.onLine === false || now() - lastWake < 30_000) return;
                lastWake = now();
                try { void Promise.resolve(check()).catch(() => {}); } catch { /* A later check can recover. */ }
            };
            const schedule = () => {
                timer = setTimer(() => { wake(); if (!stopped) schedule(); }, 15 * 60_000);
                timer?.unref?.();
            };
            schedule();
            target.addEventListener?.("visibilitychange", wake);
            network.addEventListener?.("online", wake);
            return () => { stopped = true; clearTimer(timer); target.removeEventListener?.("visibilitychange", wake); network.removeEventListener?.("online", wake); };
        }

        function updateEnvironment(info, t) {
            const label = info?.environment === "desktop" ? t("updateUi.environmentDesktop")
                : info?.environment === "web" ? "DSH Web" : info?.environment === "cli" ? t("updateUi.environmentCli")
                : t("updateUi.environmentUnknown");
            return `${label}${info?.profile ? ` · ${info.profile}` : ""}`;
        }

        function UpdateDialog({ t, about, checking, installing, error, onCheck, onInstall, onClose, returnFocus, fallbackFocusRef }) {
            const info = about?.installation, update = about?.update;
            const [copyResult, setCopyResult] = _react.useState(null);
            _react.useEffect(() => { setCopyResult(null); }, [info?.command, info?.packageSpec, info?.localPath]);
            const dismissCopy = () => setCopyResult(current => current === copyResult ? null : current);
            _react.useEffect(() => {
                if (copyResult?.status !== "success" || previewPrimitives.Toast) return;
                const timer = setTimeout(dismissCopy, 2000);
                return () => clearTimeout(timer);
            }, [copyResult]);
            const local = info?.source === "local", restart = about?.install?.status === "restart-required";
            const applied = about?.install?.status === "applied";
            const canInstall = info?.canInstall === true && update?.status === "available" && !local && !restart && !applied;
            const copy = async value => {
                try { if (!globalThis.navigator?.clipboard?.writeText) throw new Error("clipboard unavailable");
                    await globalThis.navigator.clipboard.writeText(value);
                    setCopyResult(previous => ({ status: "success", sequence: (previous?.sequence ?? 0) + 1 }));
                } catch { setCopyResult({ status: "failed" }); }
            };
            const status = restart ? t("updateUi.restartRequired", { version: about.install.version })
                : applied ? t("updateUi.applied", { version: about.install.version })
                : installing ? t("updateUi.installingThroughHost")
                : checking ? t("updateUi.checking")
                : update?.status === "available" ? t("updateUi.available", { version: update.latestVersion })
                : update?.status === "current" ? (local ? t("updateUi.localCurrent") : t("updateUi.current"))
                : update?.status === "unavailable" ? t("updateUi.unavailable")
                : t("updateUi.unchecked");
            const codeBlock = (value, label) => value ? (0, jsx.jsxs)("div", { className: "dac-update-command", children: [
                (0, jsx.jsx)("code", { children: value }),
                (0, jsx.jsxs)(ControlButton, { type: "button", className: "dac-action-trigger", disabled: installing, onClick: () => copy(value), children: [(0, jsx.jsx)(IconCopy, {}), label] }),
            ] }) : null;
            const body = (0, jsx.jsxs)("div", { className: "dac-update-content", children: [
                (0, jsx.jsx)("p", { role: "status", children: status }),
                (0, jsx.jsxs)("dl", { className: "dac-update-meta", children: [
                    (0, jsx.jsx)("dt", { children: t("updateUi.runningVersion") }), (0, jsx.jsx)("dd", { children: about ? `v${about.version}${local ? ` · ${t("updateUi.localCheckout")}` : ""}` : "—" }),
                    (0, jsx.jsx)("dt", { children: t("updateUi.publicRelease") }), (0, jsx.jsx)("dd", { children: update?.latestVersion ? update.status === "unavailable" ? t("updateUi.previousPublicRelease", { version: update.latestVersion }) : `v${update.latestVersion}` : "—" }),
                    (0, jsx.jsx)("dt", { children: t("updateUi.currentEnvironment") }), (0, jsx.jsx)("dd", { children: updateEnvironment(info, t) }),
                    (0, jsx.jsx)("dt", { children: t("updateUi.lastChecked") }), (0, jsx.jsx)("dd", { children: update?.checkedAt ? new Date(update.checkedAt).toLocaleString(t("locale.intl")) : "—" }),
                ] }),
                (0, jsx.jsxs)("div", { className: "dac-about-links", children: [
                    (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-action-trigger", disabled: checking || installing || restart || applied, onClick: onCheck, children: t("updateUi.checkAgain") }),
                    safeAboutLink(about?.links?.changelog) && (0, jsx.jsx)("a", { href: safeAboutLink(about.links.changelog), target: "_blank", rel: "noopener noreferrer", children: t("aboutInfo.changelog") }),
                ] }),
                local ? (0, jsx.jsxs)("section", { className: "dac-update-manual", children: [
                    (0, jsx.jsx)("p", { children: t("updateUi.localInstructions") }),
                    codeBlock(info.localPath, t("updateUi.copyLocalPath")),
                ] }) : (0, jsx.jsxs)("section", { className: "dac-update-manual", children: [
                    (0, jsx.jsx)("p", { children: info?.source === "external" ? t("updateUi.externalInstructions") : info?.canInstall ? t("updateUi.installInstructions") : t("updateUi.manualInstructions") }),
                    codeBlock(info?.packageSpec ?? "dsh-archived-chats@latest", t("updateUi.copyPackage")),
                    info?.command && (0, jsx.jsxs)("details", { className: "dac-update-terminal", children: [
                        (0, jsx.jsx)("summary", { children: t("updateUi.terminalCommand") }),
                        (0, jsx.jsx)("p", { children: t(info.environment === "desktop" ? "updateUi.terminalDesktopInstructions" : "updateUi.terminalHostInstructions") }),
                        codeBlock(info.command, t("updateUi.copyCommand")),
                        info.environment === "desktop" && (0, jsx.jsx)("p", { children: t("updateUi.bundledCommand") }),
                    ] }),
                ] }),
                copyResult?.status === "success" && (previewPrimitives.Toast
                    ? (0, jsx.jsx)(previewPrimitives.Toast, { text: t("updateUi.copied"), tone: "success", holdMs: 2000, onDone: dismissCopy }, copyResult.sequence)
                    : (0, jsx.jsx)("p", { role: "status", children: t("updateUi.copied") })),
                (error || copyResult?.status === "failed") && (0, jsx.jsx)("p", { role: "alert", className: "dac-update-error", children: error || t("updateUi.copyFailed") }),
                (0, jsx.jsx)("p", { className: "dac-update-privacy", children: t("updateUi.privacy") }),
            ] });
            return (0, jsx.jsx)(ConfirmDialog, { title: t("updateUi.title"), body, confirmLabel: t(installing ? "updateUi.installing" : "updateUi.install"), cancelLabel: t("updateUi.close"),
                confirmClassName: "dac-btn-primary", hideConfirm: !canInstall && !installing, confirmDisabled: checking,
                dialogClassName: "dac-update-dialog", busy: installing, returnFocus, fallbackFocusRef, onConfirm: onInstall, onCancel: onClose });
        }

			function AboutPanel({ t, about, loading, checking, onCheck, onReload }) {
			const update = about?.update;
			const status = loading ? t("aboutInfo.loading")
				: !about ? t("aboutInfo.loadFailed")
				: checking ? t("updateUi.checking")
				: update?.status === "available" ? t("aboutInfo.updateAvailable", { version: update.latestVersion })
				: update?.status === "current" ? (about?.installation?.source === "local" ? t("aboutInfo.localCurrent") : t("updateUi.current"))
				: update?.status === "unavailable" ? t("updateUi.unavailable")
				: t("updateUi.unchecked");
			const links = about?.links ?? {};
			const [beforeStarLink, afterStarLink] = t("aboutInfo.starPrompt").split("{link}");
			return (0, jsx.jsxs)("section", { className: "dac-about", "aria-label": t("tab.about"), children: [
				(0, jsx.jsxs)("div", { children: [
					(0, jsx.jsx)("p", { children: t("aboutInfo.description") }),
					(0, jsx.jsxs)("div", { className: "dac-about-meta", children: [
						(0, jsx.jsx)("span", { children: `${t("aboutInfo.currentVersion")} · ${about ? `v${about.version}` : loading ? t("aboutInfo.versionLoading") : t("aboutInfo.versionUnavailable")}` }),
						about && (0, jsx.jsx)("span", { children: `${t("aboutInfo.author")} · ${about.author}` }),
                        about?.installation && (0, jsx.jsx)("span", { children: about.installation.source === "local" ? t("updateUi.localCheckout") : updateEnvironment(about.installation, t) }),
						about && (0, jsx.jsx)("span", { children: `${t("aboutInfo.license")} · ${about.license}` }),
					] }),
				] }),
				(0, jsx.jsxs)("div", { className: "dac-about-links", children: [
					["home", t("aboutInfo.home")],
					[isZh(t) ? "guideZh" : "guideEn", t("aboutInfo.userGuide")],
					["changelog", t("aboutInfo.changelog")],
					["feedback", t("aboutInfo.feedback")],
					["marketplace", t("aboutInfo.marketplace")],
				].map(([key, label]) => {
					const href = safeAboutLink(links[key] ?? (key.startsWith("guide") ? links.guide : null));
					return href ? (0, jsx.jsx)("a", { href, target: "_blank", rel: "noopener noreferrer", children: label }, key) : null;
				}) }),
				safeAboutLink(links.home) && (0, jsx.jsxs)("p", { children: [
					beforeStarLink,
					(0, jsx.jsx)("a", { href: safeAboutLink(links.home), target: "_blank", rel: "noopener noreferrer", children: t("aboutInfo.starLink") }),
					afterStarLink,
				] }),
				(0, jsx.jsxs)("div", { className: "dac-about-update", children: [
                    (0, jsx.jsx)("h3", { className: "dac-about-section-title", children: t("aboutInfo.versionHeading") }),
					(0, jsx.jsxs)("div", { className: "dac-about-status", children: [
						(0, jsx.jsx)("span", { role: "status", children: status }),
						(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-action-trigger", disabled: checking || loading, onClick: about ? onCheck : onReload, children: t(about ? "aboutInfo.checkUpdates" : "aboutInfo.reload") }),
					] }),
					!about && !loading && (0, jsx.jsx)("p", { children: t("aboutInfo.reloadInstructions") }),
					(0, jsx.jsx)("p", { children: t("aboutInfo.updateDetails") }),
					(0, jsx.jsx)("p", { children: t("aboutInfo.automaticChecks") }),
				] }),

			] });
			}

			const ARCHIVE_TABS = [
				["archived", "tab.archived"],
				["unarchived", "tab.unarchived"],

				["lineage", "tab.lineage"],
				["about", "tab.about"],
			];
			function ArchiveTabs({ pageMode, onChange, t, updateStatus }) {
				const move = (event, index) => {
					let next = index;
					if (event.key === "ArrowRight") next = (index + 1) % ARCHIVE_TABS.length;
					else if (event.key === "ArrowLeft") next = (index - 1 + ARCHIVE_TABS.length) % ARCHIVE_TABS.length;
					else if (event.key === "Home") next = 0;
					else if (event.key === "End") next = ARCHIVE_TABS.length - 1;
					else return;
					event.preventDefault?.();
					const tabs = event.currentTarget?.parentElement?.querySelectorAll?.('[role="tab"]');
					tabs?.[next]?.focus?.();
					onChange(ARCHIVE_TABS[next][0]);
				};
				return (0, jsx.jsxs)("div", { className: "dac-tabs", role: "tablist", "aria-label": t("page.title"), children: ARCHIVE_TABS.map(([mode, label], index) => (0, jsx.jsx)("button", {
					type: "button",
					role: "tab",
					id: `dac-tab-${mode}`,
					className: "dac-tab",
					"aria-selected": pageMode === mode,
					"aria-controls": `dac-panel-${mode}`,
					"aria-label": mode === "about" && updateStatus === "available" ? `${t(label)} · ${t("about.updateAvailable")}` : void 0,
					tabIndex: pageMode === mode ? 0 : -1,
					onKeyDown: (event) => move(event, index),
					onClick: () => onChange(mode),
					children: (0, jsx.jsxs)("span", { className: "dac-tab-label", children: [t(label), mode === "about" && updateStatus === "available" && (0, jsx.jsx)("span", { className: "dac-update-dot", "aria-hidden": true })] }),
				}, mode)) });
			}

			/**
			 * The single success/error feedback surface.
			 *
			 * Only one tab panel is mounted at a time, so each panel renders its own
			 * copy — a notice set while a different tab is open would otherwise have
			 * nowhere to appear, and the action would look like it did nothing.
			 */
			function NoticeBanner({ t, notice, interaction, top, onDismiss, onViewArchived }) {
				// A new notice object restarts the Host Toast lifetime: the Host
				// Toast only restarts when remounted, so key it by a per-notice
				// sequence. (Render-phase ref update, the same pattern
				// `useSuccessNoticeTimer` uses for its latest values.)
				const noticeSequenceRef = _react.useRef(0);
				const lastNoticeRef = _react.useRef(null);
				if (lastNoticeRef.current !== notice) {
					lastNoticeRef.current = notice;
					noticeSequenceRef.current += 1;
				}
				if (notice === null) return null;
				if (notice.source === "archive") return (0, jsx.jsx)(NativeArchiveNotice, { notice, t, onViewArchived, onDismiss });
				const view = notice.action === "view-archived";
				const dismiss = (0, jsx.jsx)("button", { type: "button", "aria-label": t("notice.dismiss"), onClick: onDismiss, children: (0, jsx.jsx)(IconClose, {}) });
				if (notice.kind === "ok") {
					// Success feedback follows the Host Toast when the Host
					// provides it — its body portal keeps the banner clear of
					// clipping ancestors, and its positioning is the Host's.
					// Older Hosts keep the plugin's own fixed toast below.
					const Toast = previewPrimitives.Toast;
					if (Toast !== null) return (0, jsx.jsx)(Toast, {
						key: noticeSequenceRef.current,
						text: notice.text,
						tone: "success",
						holdMs: 4000,
						actions: view ? [{ label: t("archive.viewArchived"), onClick: onViewArchived }] : undefined,
						onDone: onDismiss,
					});
					return (0, jsx.jsxs)("div", {
						className: "dac-toast",
						...interaction,
						role: "status",
						style: { top: `${top}px` },
						children: [
							(0, jsx.jsx)(IconCheckCircle, {}),
							(0, jsx.jsx)("span", { children: notice.text }),
							view && (0, jsx.jsx)("button", { type: "button", className: "dac-notice-action", onClick: onViewArchived, children: t("archive.viewArchived") }),
							dismiss,
						]
					});
				}
				return (0, jsx.jsxs)("div", {
					className: notice.kind === "partial" ? "dac-notice dac-notice-ok" : "dac-notice",
					role: notice.kind === "partial" ? "status" : "alert",
					children: [
						// "partial" is a success that has to stay readable, so it keeps the
						// banner's persistence but not its error styling or its alarm role.
						notice.kind === "partial" && (0, jsx.jsx)(IconCheckCircle, {}),
						(0, jsx.jsx)("span", { children: notice.text }),
						view && (0, jsx.jsx)("button", { type: "button", className: "dac-notice-action", onClick: onViewArchived, children: t("archive.viewArchived") }),
						typeof notice.onRetry === "function" && (0, jsx.jsx)("button", { type: "button", className: "dac-notice-action", onClick: notice.onRetry, children: t("state.retry") }),
						dismiss,
					]
				});
			}

			function ArchivedChatsSection({ t, refreshSidebar, refreshWorkspaceArchiveConsumers, subscribeArchiveChanges, archiveNavigation, beginArchiveInteraction, getLineageListOrder }) {
			const [sessions, setSessions] = _react.useState(null);
			const [pageMode, setPageMode] = _react.useState("archived");


			const [loadError, setLoadError] = _react.useState(null);
			const [query, setQuery] = _react.useState("");
			const [typeFilter, setTypeFilter] = _react.useState("all");
			const [projectFilter, setProjectFilter] = _react.useState("all");
			const [sortMode, setSortMode] = _react.useState("newest");
			const [menuFor, setMenuFor] = _react.useState(null);
			const [confirm, setConfirm] = _react.useState(null);
			const [busy, setBusy] = _react.useState({});
			const [notice, setNotice] = _react.useState(null);
            const deletionRetryRef = _react.useRef(null);
			const archiveNoticeSequence = _react.useRef(0);
			const [collapsed, setCollapsed] = _react.useState(readCollapsed);
			const [tagFilter, setTagFilter] = _react.useState("");
			const [metadataStatus, setMetadataStatus] = _react.useState("ready");
			const [archiveDeletionStatus, setArchiveDeletionStatus] = _react.useState("ready");
			const [stats, setStats] = _react.useState({ status: "idle", summary: null, sessions: {} });
				const [metadataEdit, setMetadataEdit] = _react.useState(null);
				const [metaBusy, setMetaBusy] = _react.useState(false);
				const [importPreview, setImportPreview] = _react.useState(null);
				const [importBusy, setImportBusy] = _react.useState(false);

					const [contentSearch, setContentSearch] = _react.useState({ status: "idle", query: "", hits: [], skipped: [] });
					const [preview, setPreview] = _react.useState(null);
			const [previewBusy, setPreviewBusy] = _react.useState(false);
			const [workspaceArchive, setWorkspaceArchive] = _react.useState(null);
			const [workspaceArchiveRefresh, setWorkspaceArchiveRefresh] = _react.useState(0);
			const [confirmBusy, setConfirmBusy] = _react.useState(false);
			const [about, setAbout] = _react.useState(null);
			const [aboutLoading, setAboutLoading] = _react.useState(true);
			const [aboutChecking, setAboutChecking] = _react.useState(false);
            const [updateOpen, setUpdateOpen] = _react.useState(false);
            const [updateBusy, setUpdateBusy] = _react.useState(false);
            const [updateError, setUpdateError] = _react.useState(null);
            const updateReturnFocusRef = _react.useRef(null);
            const updateRequestRef = _react.useRef(null);
            const [unarchived, setUnarchived] = _react.useState({ status: "idle", sessions: [] });
            const [unarchivedQuery, setUnarchivedQuery] = _react.useState("");
            const [unarchivedWorkspace, setUnarchivedWorkspace] = _react.useState("all");
            const [unarchivedTypeFilter, setUnarchivedTypeFilter] = _react.useState("all");
            const [selectionMode, setSelectionMode] = _react.useState(false);
            const [selectedIds, setSelectedIds] = _react.useState(() => new Set());
            const [scheduleStatus, setScheduleStatus] = _react.useState("unsupported");
            const selectionEntryRef = _react.useRef(null);
            _react.useEffect(() => {
                if (sessions === null) return;
                const available = new Set(sessions.map(row => row.id));
                setSelectedIds(current => {
                    const next = new Set([...current].filter(id => available.has(id)));
                    return next.size === current.size ? current : next;
                });
            }, [sessions]);
            const toggleSelection = (id, checked) => setSelectedIds(current => {
                const next = new Set(current);
                if (checked) next.add(id); else next.delete(id);
                return next;
            });
            const cancelSelection = () => {
                setSelectionMode(false); setSelectedIds(new Set());
                setTimeout(() => selectionEntryRef.current?.focus?.(), 0);
            };
            const unarchivedRequestRef = _react.useRef(null);
            const archiveRequestRef = _react.useRef(0);
			const confirmActionRef = _react.useRef(false);
			const pageRef = _react.useRef(null);
			const pageHeadingRef = _react.useRef(null);
				const deleteReturnFocusRef = _react.useRef(null);

					const metaReturnFocusRef = _react.useRef(null);
					const importReturnFocusRef = _react.useRef(null);
						const importInputRef = _react.useRef(null);
					const searchRequestRef = _react.useRef({ sequence: 0, controller: null });
					const previewReturnFocusRef = _react.useRef(null);
						const previewRequestRef = _react.useRef({ sequence: 0, controller: null });
						const exportRequestRef = _react.useRef(null);
					const workspaceArchiveReturnFocusRef = _react.useRef(null);

			const metaActionRef = _react.useRef(false);
			const importActionRef = _react.useRef(false);
			const aboutRequestRef = _react.useRef(null);

			const checkUpdates = _react.useCallback(async (force = true) => {
				if (aboutRequestRef.current?.checking || aboutRequestRef.current?.loading || updateRequestRef.current) return;
				aboutRequestRef.current?.controller.abort();
				const request = { controller: new AbortController(), checking: true };
				aboutRequestRef.current = request;
				setAboutChecking(true);
				try {
					const result = await post("/about/check-updates", { force }, request.controller.signal);
					if (!validAbout(result)) throw new Error("invalid-about");
					if (aboutRequestRef.current === request) setAbout(result);
				} catch {
					if (aboutRequestRef.current === request) setAbout((current) => current ? { ...current, update: { ...current.update, status: "unavailable" } } : null);
				} finally {
					if (aboutRequestRef.current === request) {
						request.checking = false;
						setAboutChecking(false);
					}
				}
			}, []);

			const loadAbout = _react.useCallback(async () => {
				if (aboutRequestRef.current?.loading || aboutRequestRef.current?.checking || updateRequestRef.current) return;
				aboutRequestRef.current?.controller.abort();
				const request = { controller: new AbortController(), loading: true, checking: false };
				aboutRequestRef.current = request;
				setAboutLoading(true);
				try {
					const response = await fetch(`${API_BASE}/about`, { cache: "no-store", signal: request.controller.signal });
					if (!response.ok) throw new Error("about-unavailable");
					const result = await response.json();
					if (!validAbout(result)) throw new Error("invalid-about");
					if (aboutRequestRef.current !== request) return;
					setAbout(result);
					setAboutLoading(false);
					request.loading = false;
					await checkUpdates(false);
				} catch {
					// Local metadata failures are shown separately from registry checks.
				} finally {
					if (aboutRequestRef.current === request) {
						request.loading = false;
						setAboutLoading(false);
					}
				}
			}, [checkUpdates]);

			_react.useEffect(() => {
				void loadAbout();
				const stop = watchPluginUpdates(() => loadAbout());
                return () => { stop(); aboutRequestRef.current?.controller.abort(); aboutRequestRef.current = null; updateRequestRef.current?.abort(); };
			}, [loadAbout]);
            const openUpdate = event => {
                updateReturnFocusRef.current = event?.currentTarget ?? null;
                setUpdateError(null); setUpdateOpen(true);
                return checkUpdates(true);
            };
            const installUpdate = async () => {
                if (updateRequestRef.current || about?.installation?.canInstall !== true || about?.installation?.source === "local"
                    || about?.update?.status !== "available" || ["applied", "restart-required"].includes(about?.install?.status)) return;
                const request = new AbortController(); updateRequestRef.current = request;
                aboutRequestRef.current?.controller.abort(); aboutRequestRef.current = null;
                setAboutChecking(false); setUpdateBusy(true); setUpdateError(null);
                try {
                    const result = await post("/about/install-update", { version: about.update.latestVersion }, request.signal);
                    if (!validAbout(result) || !["applied", "restart-required"].includes(result.install?.status)) throw new Error("update-unverified");
                    if (!request.signal.aborted) setAbout(result);
                } catch (error) {
                    if (!request.signal.aborted) {
                        const code = error?.body?.error;
                        setUpdateError(t(code === "update-version-changed" ? "updateUi.errorVersionChanged"
                            : code === "update-local-install" ? "updateUi.errorLocalInstall"
                            : code === "update-host-managed" ? "updateUi.errorHostManaged"
                            : code === "update-already-applied" ? "updateUi.errorAlreadyApplied"
                            : code === "update-restored" ? "updateUi.errorRestored"
                            : code === "update-restore-failed" ? "updateUi.errorRestoreFailed"
                            : "updateUi.errorUnverified"));
                    }
                } finally {
                    if (updateRequestRef.current === request) { updateRequestRef.current = null; setUpdateBusy(false); }
                }
            };

					const openWorkspaceArchive = (event) => {
						workspaceArchiveReturnFocusRef.current = event?.currentTarget ?? null;
						setNotice(null);
						setWorkspaceArchive({ stage: "choose" });
					};
						const chooseWorkspaceArchive = (workspaces) => {
							const selected = (Array.isArray(workspaces) ? workspaces : [])
								.filter((workspace) => typeof workspace?.id === "string" && workspace.id !== "")
								.map((workspace) => ({ id: workspace.id, title: typeof workspace.title === "string" ? workspace.title : null }));
							if (selected.length === 0) return;
							setWorkspaceArchive({ stage: "confirm", workspaces: selected });
						};
						const returnToWorkspaceArchiveChoice = () => setWorkspaceArchive({ stage: "choose" });
					const closeWorkspaceArchive = () => setWorkspaceArchive(null);
					const cancelWorkspaceArchiveChoice = () => {
						setWorkspaceArchive(null);
						workspaceArchiveReturnFocusRef.current?.focus?.();
					};
					const restoreWorkspaceArchiveFocus = () => {
						workspaceArchiveReturnFocusRef.current?.focus?.();
						workspaceArchiveReturnFocusRef.current = null;
					};
					const workspaceArchiveApplied = async (result) => {
						try { await refreshWorkspaceArchiveConsumers?.(); }
						finally {
							setWorkspaceArchiveRefresh((revision) => revision + 1);
							const count = result?.archived?.length ?? 0;
							if (previewPrimitives.Toast !== null && count > 0 && result.skipped.length === 0 && result.failed.length === 0) {
								setNotice({ kind: "ok", source: "archive", sequence: ++archiveNoticeSequence.current, text: t("workspaceArchive.success").replace("{count}", String(count)), action: "view-archived" });
							}
						}
					};

					const beginPreviewRequest = () => {
						const current = previewRequestRef.current;
						current.controller?.abort();
						const request = { sequence: current.sequence + 1, controller: new AbortController() };
						previewRequestRef.current = request;
						return request;
					};

					const ownsPreviewRequest = (request) => previewRequestRef.current === request && !request.controller.signal.aborted;

					_react.useEffect(() => () => {
						previewRequestRef.current.controller?.abort();
						exportRequestRef.current?.abort();
					}, []);

			_react.useEffect(() => {
				if (sessions === null || loadError !== null) return undefined;
				return markArchiveDialog(pageRef.current);
			}, [sessions, loadError]);

			const noticeInteraction = useSuccessNoticeTimer(notice, notice?.kind === "ok" && notice.source !== "archive" && previewPrimitives.Toast === null, () => setNotice((current) => current === notice ? null : current));
			const changePageMode = (mode) => {
				if (mode !== pageMode) setNotice(null);
				if (mode !== "archived") { setSelectionMode(false); setSelectedIds(new Set()); }
				setPageMode(mode);
			};

			const toggleCollapsed = (key) => {
				setCollapsed((prev) => {
					const next = { ...prev };
					if (next[key] === true) delete next[key];
					else next[key] = true;
					writeCollapsed(next);
					return next;
				});
			};

			const refresh = _react.useCallback(async () => {
                const request = ++archiveRequestRef.current;
				setLoadError(null);
				try {
					const loaded = await fetchState();
                    if (request !== archiveRequestRef.current) return;
					setSessions(loaded.sessions);
					setMetadataStatus(loaded.metadataStatus);
					setArchiveDeletionStatus(loaded.deletionStatus);
                    if (loaded.retryTargets.length > 0) setNotice(current => current === null || current.source === "deletion"
                        ? deletionFailureNotice(loaded, current?.text ?? t("deletion.incomplete"), targets => deletionRetryRef.current?.(targets)) : current);
                    setScheduleStatus(loaded.scheduleStatus);
					setStats({ status: "idle", summary: null, sessions: {} });
				} catch (error) {
					if (request === archiveRequestRef.current) setLoadError(error);
				}
			}, []);
			_react.useEffect(() => { refresh(); }, [refresh]);
			_react.useEffect(() => { if (workspaceArchiveRefresh > 0) void refresh(); }, [workspaceArchiveRefresh, refresh]);



            const loadUnarchived = _react.useCallback(async () => {
                unarchivedRequestRef.current?.abort();
                const request = new AbortController();
                unarchivedRequestRef.current = request;
                setUnarchived(current => ({ ...current, status: current.status === "ready" || current.status === "refreshing" ? "refreshing" : "loading" }));
                try {
                    const res = await fetch(`${API_BASE}/unarchived`, { cache: "no-store", signal: request.signal });
                    if (!res.ok) throw new Error("unarchived-unavailable");
                    const body = await res.json();
                    if (request.signal.aborted) return;
                    const rows = Array.isArray(body.sessions) ? body.sessions : [];
                    setUnarchived({ status: "ready", sessions: rows, metadataStatus: body.metadataStatus, scheduleStatus: body.scheduleStatus ?? "unsupported" });
                } catch (error) {
                    if (!request.signal.aborted) setUnarchived({ status: "error", sessions: [] });
                }
            }, []);
            const needsUnarchived = pageMode === "unarchived";
            _react.useEffect(() => {
                if (needsUnarchived) void loadUnarchived();
                return () => unarchivedRequestRef.current?.abort();
            }, [needsUnarchived, workspaceArchiveRefresh, loadUnarchived]);
            _react.useEffect(() => {
                let timer;
                const changed = () => {
                    clearTimeout(timer);
                    timer = setTimeout(() => { void refresh(); if (needsUnarchived) void loadUnarchived(); }, 80);
                };
                const unsubscribe = subscribeArchiveChanges?.(changed);
                window.addEventListener?.("focus", changed);
                return () => { clearTimeout(timer); unsubscribe?.(); window.removeEventListener?.("focus", changed); };
            }, [subscribeArchiveChanges, needsUnarchived, refresh, loadUnarchived]);
            const unarchivedWorkspaces = [...new Map(unarchived.sessions.map(row => [row.workspaceId ?? "__dac_ungrouped__", { id: row.workspaceId ?? "__dac_ungrouped__", title: workspaceDisplayTitle(t, row.workspaceTitle) || row.workspaceId || t("group.noProject") }])).values()];
            const archiveUnarchived = (group, event, session) => {
                const workspaces = group ? [{ id: group.key, title: group.title, ...(session ? { sessionIds: [session.id] } : {}) }] : unarchivedWorkspaces;
                if (workspaceArchive !== null || workspaces.length === 0 || session?.archiveEligible === false) return;
                workspaceArchiveReturnFocusRef.current = event?.currentTarget ?? null;
                setNotice(null);
                setWorkspaceArchive({ stage: "confirm", workspaces, scope: group ? (session ? "chat" : "workspace") : "all", fromUnarchived: true });
            };

			// Statistics load independently after the archive list and never
			// replace session state. An empty archive reports zero bytes without
			// calling the statistics route; a failure keeps every archive action
			// usable and surfaces one dismissible warning.
			_react.useEffect(() => {
				if (sessions === null) return undefined;
				if (sessions.length === 0) {
					setStats({ status: "ready", summary: { sessionCount: 0, totalBytes: 0, unavailableCount: 0 }, sessions: {} });
					return undefined;
				}
				let cancelled = false;
				setStats((current) => ({ ...current, status: "loading" }));
				fetchStats().then((body) => {
					if (cancelled) return;
					setStats({
						status: "ready",
						summary: body?.summary ?? { sessionCount: sessions.length, totalBytes: 0, unavailableCount: 0 },
						sessions: body?.sessions ?? {},
					});
				}).catch(() => {
					if (cancelled) return;
					setStats({ status: "error", summary: null, sessions: {} });
					setNotice((current) => current === null ? { kind: "error", text: t("stats.error") } : current);
				});
				return () => { cancelled = true; };
				}, [sessions, t]);
            const searchKind = pageMode === "unarchived" ? "unarchived" : "archive";
            const searchRows = pageMode === "unarchived" ? unarchived.sessions : sessions;
            const searchReady = pageMode === "unarchived" ? unarchived.status === "ready" : sessions !== null;
            const searchQuery = pageMode === "unarchived" ? unarchivedQuery : query;
            const searchWorkspace = pageMode === "unarchived" ? unarchivedWorkspace : projectFilter;
            const candidateIds = _react.useMemo(() => archiveSearchCandidates(searchRows, searchWorkspace, pageMode === "unarchived" ? unarchivedTypeFilter : typeFilter, pageMode === "unarchived" ? "" : tagFilter, t("locale.intl")), [searchRows, searchWorkspace, pageMode, unarchivedTypeFilter, typeFilter, tagFilter, t]);
            const searchScope = _react.useMemo(() => ({ query: searchQuery.trim(), ids: candidateIds, pageMode, ready: searchReady }), [searchQuery, candidateIds, pageMode, searchReady]);
            const startContentSearch = (previous) => {
                searchRequestRef.current.controller?.abort();
                const request = { controller: new AbortController() };
                searchRequestRef.current = request;
                return runArchiveSearch({ query: searchScope.query, ids: candidateIds, scope: searchKind, previous, signal: request.controller.signal,
                    onUpdate: value => {
                        if (searchRequestRef.current === request && !request.controller.signal.aborted) setContentSearch({ ...value, scope: searchScope });
                    } });
            };
            _react.useEffect(() => {
                searchRequestRef.current.controller?.abort();
                setContentSearch({ status: "idle", query: searchScope.query, hits: [], skipped: [], scope: searchScope });
                if (!["archived", "unarchived"].includes(pageMode) || Array.from(searchScope.query).length < 2 || !searchReady) return;
                const timer = setTimeout(() => { void startContentSearch(); }, 300);
                return () => { clearTimeout(timer); searchRequestRef.current.controller?.abort(); };
            }, [searchScope]);
            const currentSearch = contentSearch.scope === searchScope ? contentSearch : { status: "idle", hits: [], skipped: [] };
            const stopContentSearch = () => {
                searchRequestRef.current.controller?.abort();
                setContentSearch(current => ({ ...current, status: "stopped" }));
            };

			const contentHits = _react.useMemo(() => {
				if (contentSearch.scope !== searchScope) return new Map();
				return new Map((contentSearch.hits ?? []).map((hit) => [hit.sessionId, hit]));
			}, [contentSearch, searchScope]);

            const visibleUnarchived = sortArchivedSessions(unarchived.sessions.filter(row =>
                matchesWorkspaceFilter(row, unarchivedWorkspace)
                && (unarchivedTypeFilter !== "normal" || row.origin !== "subagent")
                && (unarchivedTypeFilter !== "subagent" || row.origin === "subagent")
                && (unarchivedQuery.trim() === "" || matchesArchivedSession(row, unarchivedQuery, t("locale.intl")) || contentHits.has(row.id))), sortMode);
            const unarchivedGroups = [...visibleUnarchived.reduce((groups, row) => {
                const key = row.workspaceId ?? "__dac_ungrouped__";
                if (!groups.has(key)) groups.set(key, { key, title: workspaceDisplayTitle(t, row.workspaceTitle) || row.workspaceId || t("group.noProject"), archiveAvailable: unarchived.sessions.some(candidate => candidate.workspaceId === row.workspaceId && candidate.archiveEligible !== false), items: [], sessionIds: [] });
                const group = groups.get(key);
                group.items.push(row); group.sessionIds.push(row.id);
                return groups;
            }, new Map()).values()];

			const markBusy = (ids, value) => {
				setBusy((prev) => {
					const next = { ...prev };
					for (const id of ids) {
						if (value) next[id] = true;
						else delete next[id];
					}
					return next;
				});
			};

			const viewArchived = () => {
				setPageMode("archived");
				setQuery(""); setTypeFilter("all"); setProjectFilter("all"); setTagFilter("");
				setNotice(null);
			};

            _react.useEffect(() => {
                if (!archiveNavigation) return;
                const openArchived = () => {
                    if (!archiveNavigation.consume()) return;
                    viewArchived();
                    void refresh();
                };
                const unsubscribe = archiveNavigation.subscribe(openArchived);
                openArchived();
                return unsubscribe;
            }, [archiveNavigation, refresh]);



			const unarchive = async (ids) => {
				if (ids.length === 0) return;
				markBusy(ids, true);
				setNotice(null);
				try {
					await post("/unarchive-all", { sessionIds: ids });
                    archiveRequestRef.current += 1;
					setSessions((prev) => (prev ?? []).filter((s) => !ids.includes(s.id)));
				} catch (error) {
					await refresh();
                    setNotice({ kind: "error", text: unarchiveFailureText(t, error) });
				} finally {
					markBusy(ids, false);
                    await refreshWorkspaceArchiveConsumers?.();
				}
			};

			const runPermanentDelete = async (ids, preview) => {
				if (ids.length === 0) return;
				markBusy(ids, true);
				setNotice(null);
				try {
					const result = await executeDeletion(preview);
					const deleted = uniqueSessionIds(result.deleted);
					const removed = uniqueSessionIds([...deleted, ...uniqueSessionIds(result.pending)]);
					const failed = result.failed ?? [];
					if (removed.length > 0) {
						setSessions((prev) => (prev ?? []).filter((s) => !removed.includes(s.id)));

						refreshSidebar?.();
					}
					if (failed.length > 0) setNotice(deletionFailureNotice(result, failureText(t, failed), retryPermanentDeletion));
					else if (deleted.length > 0) setNotice({ kind: "ok", text: t("chat.deleted") });
				} catch (error) {
					const deleted = uniqueSessionIds(error.body?.deleted);
					const removed = uniqueSessionIds([...deleted, ...uniqueSessionIds(error.body?.pending)]);
					const failed = error.body?.failed ?? [];
					if (removed.length > 0) {
						setSessions((prev) => (prev ?? []).filter((s) => !removed.includes(s.id)));

						refreshSidebar?.();
					}
					setNotice(deletionFailureNotice(error.body, deletionErrorText(t, error), retryPermanentDeletion));
				} finally {
					markBusy(ids, false);
                    await loadUnarchived();
                    await refreshWorkspaceArchiveConsumers?.();
                    setWorkspaceArchiveRefresh(current => current + 1);
					setConfirm(null);
				}
			};

            async function retryPermanentDeletion(targets) {
                if (confirmActionRef.current) return;
                confirmActionRef.current = true;
                const ids = targets.map(row => row.sessionId);
                markBusy(ids, true);
                setNotice({ kind: "error", text: t("state.loading") });
                try {
                    const result = await post("/deletion-tasks/retry", { targets });
                    if (result.failed?.length > 0) setNotice(deletionFailureNotice(result, failureText(t, result.failed), retryPermanentDeletion));
                    else setNotice({ kind: "ok", text: t("chat.deleted") });
                } catch (error) {
                    const retryTargets = error.body?.error === "deletion-task-missing" ? [] : error.body?.retryTargets ?? targets;
                    setNotice(deletionFailureNotice({ retryTargets }, deletionErrorText(t, error), retryPermanentDeletion));
                } finally {
                    confirmActionRef.current = false;
                    markBusy(ids, false);
                    refreshSidebar?.();
                    await refresh();
                    await loadUnarchived();
                    await refreshWorkspaceArchiveConsumers?.();
                    setWorkspaceArchiveRefresh(current => current + 1);
                }
            }
            deletionRetryRef.current = retryPermanentDeletion;

			const askArchiveAction = async (action, ids, scope) => {
                const source = scope?.source === "unarchived" ? "unarchived" : "archive";
                const rows = source === "unarchived" ? unarchived.sessions : sessions ?? [];
                const workspaceDelete = source === "unarchived" && scope?.kind === "workspace";
                const requested = uniqueSessionIds(workspaceDelete
                    ? rows.filter(row => (row.workspaceId ?? null) === scope.workspaceId).map(row => row.id) : ids);
                if (requested.length === 0 || confirmActionRef.current || requested.some(id => busy[id] === true)) return;
                if (requested.some(id => !rows.some(row => row.id === id))) {
                    setNotice({ kind: "error", text: t("chat.listChanged") }); return;
                }
				deleteReturnFocusRef.current = document.activeElement;
                const pending = { ...archiveActionConfirmation(t, action, requested, rows, scope), ids: requested, action, source, loading: action === "permanent" };
                setConfirm(pending);
                if (action !== "permanent") return;
                try {
                    const preview = await previewDeletion(rows.filter(row => requested.includes(row.id)), source);
                    setConfirm(current => current === pending ? { ...pending, loading: false, preview,
                        body: `${pending.body} ${deletionScopeText(t, preview.plan)}` } : current);
                } catch (error) {
                    setConfirm(current => current === pending ? null : current);
                    setNotice({ kind: "error", text: deletionErrorText(t, error) });
                }
			};
			const askPermanentDelete = (ids, scope) => askArchiveAction("permanent", ids, scope);
			const confirmArchiveAction = async () => {
				if (!confirm || confirm.loading || confirmActionRef.current) return;
				confirmActionRef.current = true; setConfirmBusy(true);
				try {
					if (confirm.action === "export") await exportSessions(confirm.ids);
					else if (confirm.action === "unarchive") { await unarchive(confirm.ids); refreshSidebar?.(); }
					else if (confirm.action === "permanent") await runPermanentDelete(confirm.ids, confirm.preview);
				} catch (error) {
					setNotice({ kind: "error", text: String(error.message ?? error) });
				} finally {
					confirmActionRef.current = false; setConfirmBusy(false); setConfirm(null);
				}
			};

			const openMetadataEditor = (session) => {
				metaReturnFocusRef.current = document.activeElement;
				setMetadataEdit(session);
			};

			const openPreview = async (session, scope = "archive", seq) => {
				const request = beginPreviewRequest();
				previewReturnFocusRef.current = document.activeElement;
				setPreview({ status: "loading", session, scope, messages: [], total: 0, nextOffset: null });
				setPreviewBusy(true);
				try {
					const result = await fetchArchivePreview(session.id, 0, 50, request.controller.signal, scope, seq);
					if (!ownsPreviewRequest(request)) return;
					setPreview({ ...result, status: "ready", scope, session: result?.session ? { ...result.session, title: result.session.title ?? session.title } : session, messages: Array.isArray(result?.messages) ? result.messages : [] });
				} catch (error) {
					if (!ownsPreviewRequest(request)) return;
					setPreview({ status: "error", session, scope, messages: [], total: 0, nextOffset: null, error: String(error.message ?? error) });
				} finally {
					if (ownsPreviewRequest(request)) setPreviewBusy(false);
				}
			};

			const loadMorePreview = async (direction = "next") => {
				if (!preview?.session?.id || (direction === "previous" ? preview.previousOffset : preview.nextOffset) == null || previewBusy) return;
				const sessionId = preview.session.id;
				const previous = direction === "previous";
				const nextOffset = previous ? preview.previousOffset : preview.nextOffset;
				const request = beginPreviewRequest();
				setPreviewBusy(true);
				try {
					const result = await fetchArchivePreview(sessionId, nextOffset, previous ? preview.offset - nextOffset : 50, request.controller.signal, preview.scope ?? "archive");
					if (!ownsPreviewRequest(request)) return;
					setPreview((current) => current ? {
						...current,
						status: "ready",
						messages: previous ? [...(result?.messages ?? []), ...(current.messages ?? [])] : [...(current.messages ?? []), ...(result?.messages ?? [])],
                        offset: previous ? result.offset : current.offset,
                        previousOffset: previous ? (result.offset > 0 ? Math.max(0, result.offset - 50) : null) : current.previousOffset,
						total: result?.total ?? current.total,
						nextOffset: previous ? current.nextOffset : result?.nextOffset ?? null,
					} : current);
				} catch (error) {
					if (!ownsPreviewRequest(request)) return;
					setNotice({ kind: "error", text: String(error.message ?? error) });
				} finally {
					if (ownsPreviewRequest(request)) setPreviewBusy(false);
				}
			};
			const closePreview = _react.useCallback(() => {
				const current = previewRequestRef.current;
				current.controller?.abort();
				previewRequestRef.current = { sequence: current.sequence + 1, controller: null };
				setPreviewBusy(false);
				setPreview(null);
			}, []);

				const saveMetadataFor = async (sessionId, tags, note) => {
					if (metaActionRef.current) return;
					metaActionRef.current = true;
					setNotice(null);
					setMetaBusy(true);
				try {
					const result = await saveMetadata(sessionId, tags, note);
					const canonical = result?.metadata;
					setSessions((prev) => (prev ?? []).map((s) => s.id === sessionId ? {
						...s,
						tags: Array.isArray(canonical?.tags) ? canonical.tags : [],
						note: typeof canonical?.note === "string" ? canonical.note : "",
						metadataUpdatedAt: canonical?.updatedAt ?? null,
					} : s));
						setMetadataEdit((current) => current?.id === sessionId ? null : current);
						setNotice({ kind: "ok", text: t("meta.saved") });
				} catch (error) {
					setNotice({ kind: "error", text: String(error.message ?? error) });
					} finally {
						metaActionRef.current = false;
						setMetaBusy(false);
					}
					};

					// Returns `{ ok: true }` or `{ ok: false, code, sessionId, timedOut }`.
					// `deferNotice` lets a caller that can recover from a specific code
					// compose one message instead of flashing a generic failure first.
					const exportSessions = async (ids, path = "/export", options = {}) => {
						const controller = new AbortController();
						let timedOut = false;
						let completed = false;
						exportRequestRef.current?.abort();
						exportRequestRef.current = controller;
						const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, EXPORT_DOWNLOAD_TIMEOUT_MS);
						try {
							const result = await submitExport(ids, controller.signal, path);
							// A newer export replaced this one: staying quiet is correct.
							if (exportRequestRef.current !== controller) return { ok: false, code: "superseded" };
							if (result === false) {
								// The helper refused before issuing a request (no document,
								// empty set). Reporting nothing made that look like a no-op.
								if (options.deferNotice !== true) setNotice({ kind: "error", text: t("export.failed") });
								return { ok: false, code: "export-unavailable" };
							}
							completed = true;
							if (options.deferNotice !== true) setNotice({ kind: "ok", text: t("export.started") });
							return { ok: true };
						} catch (error) {
							if (exportRequestRef.current !== controller || (!timedOut && error?.name === "AbortError")) {
								return { ok: false, code: "superseded" };
							}
							const code = typeof error?.code === "string" && error.code !== "" ? error.code : "export-failed";
							const sessionId = typeof error.sessionId === "string" ? error.sessionId : null;
							const sessionIds = Array.isArray(error.sessionIds) ? error.sessionIds : (sessionId === null ? [] : [sessionId]);
							if (options.deferNotice !== true) {
								const base = timedOut ? t("export.timeout")
									: code === "export-limit-exceeded" && sessionId !== null
										? t("export.tooLarge").replace("{id}", sessionId)
										: code === "export-source-invalid" ? t("export.sourceInvalid")
											: t("export.failed");
								const detail = typeof error?.message === "string" ? error.message.trim() : "";
								setNotice({ kind: "error", text: detail === "" || base.includes(detail) ? base : `${base}: ${detail}` });
							}
							return { ok: false, code, sessionId, sessionIds, timedOut };
						} finally {
							clearTimeout(timeout);
							if (!completed) controller.abort();
							if (exportRequestRef.current === controller) exportRequestRef.current = null;
						}
					};

				const importFile = async (file) => {
					if (!file) return;
					setImportBusy(true);
					setNotice(null);
					try {
						const preview = await submitImportFile(file);
						const sessions = Array.isArray(preview.sessions) ? preview.sessions : [];
						setImportPreview({
							...preview,
							sessions,
							selectedIds: sessions.filter((session) => session.conflict !== true && !session.restoreBlocked).map((session) => session.id),
							result: null,
							error: null,
						});
					} catch (error) {
						setNotice({ kind: "error", text: importFailureText(t, error) });
					} finally {
						setImportBusy(false);
					}
				};
					const restoreImport = async () => {
						if (!importPreview || importPreview.selectedIds.length === 0 || importActionRef.current) return;
						const target = {
							token: importPreview.token,
							nonce: importPreview.nonce,
							selectedIds: [...importPreview.selectedIds],
						};
						importActionRef.current = true;
						setImportBusy(true);
						setImportPreview((current) => current?.token === target.token && current?.nonce === target.nonce
							? { ...current, error: null } : current);
						try {
							const result = await post("/import/restore", {
								token: target.token,
								nonce: target.nonce,
								sessionIds: target.selectedIds,
							});
							setImportPreview((current) => current?.token === target.token && current?.nonce === target.nonce
								? { ...current, result, error: null } : current);
							await refresh();
							refreshSidebar?.();
							setNotice({ kind: "ok", text: t("import.done") });
						} catch (error) {
							const text = importFailureText(t, error);
							setImportPreview((current) => current?.token === target.token && current?.nonce === target.nonce
								? { ...current, error: text } : current);
						} finally {
							importActionRef.current = false;
							setImportBusy(false);
					}
				};
				const toggleImportSelection = (id, checked) => {
					setImportPreview((current) => {
						if (!current) return current;
						const next = new Set(current.selectedIds ?? []);
						if (checked) next.add(id); else next.delete(id);
						return { ...current, selectedIds: [...next] };
					});
				};
				const selectAllImport = () => setImportPreview((current) => current ? { ...current, selectedIds: current.sessions.filter((session) => session.conflict !== true && !session.restoreBlocked).map((session) => session.id) } : current);
				const clearImport = () => setImportPreview((current) => current ? { ...current, selectedIds: [] } : current);

            const previewArchiveSession = preview?.scope === "archive"
                ? (sessions ?? []).find(session => session.id === preview.session?.id)
                : undefined;
            const leavePreviewFor = action => {
                closePreview();
                previewReturnFocusRef.current?.focus?.();
                action();
            };

			const projects = _react.useMemo(() => {
				const seen = new Map();
				for (const s of searchRows ?? []) {
					const key = s.workspaceId ?? "ungrouped";
					if (!seen.has(key)) seen.set(key, s.workspaceTitle ?? null);
				}
				return [...seen.entries()].map(([value, title]) => ({ value, title }));
			}, [searchRows]);

			const tagOptions = _react.useMemo(() => {
				const seen = new Set();
				const options = [];
				for (const session of sessions ?? []) {
					for (const tag of Array.isArray(session.tags) ? session.tags : []) {
						const key = String(tag).trim().toLocaleLowerCase("en-US");
						if (key !== "" && !seen.has(key)) { seen.add(key); options.push(tag); }
					}
				}
				const collator = new Intl.Collator(t("locale.intl"), { numeric: true, sensitivity: "base" });
				return options.sort(collator.compare);
			}, [sessions, t]);

			const groups = _react.useMemo(() => {
				const projectIds = new Map();
				for (const session of sessions ?? []) {
					const key = session.workspaceId ?? "ungrouped";
					if (!projectIds.has(key)) projectIds.set(key, []);
					projectIds.get(key).push(session.id);
				}
				const locale = t("locale.intl");
				const visible = (sessions ?? []).filter((s) => {
					if (!matchesWorkspaceFilter(s, projectFilter)) return false;
					if (typeFilter === "normal" && s.origin === "subagent") return false;
					if (typeFilter === "subagent" && s.origin !== "subagent") return false;
						if (tagFilter !== "" && !filterByTag(s, tagFilter, locale)) return false;
					if (query.trim() !== "" && !matchesArchivedSession(s, query, locale) && !contentHits.has(s.id)) return false;
					return true;
				});
				const byKey = new Map();
				for (const s of visible) {
					const key = s.workspaceId ?? "ungrouped";
					if (!byKey.has(key)) byKey.set(key, { key, title: workspaceDisplayTitle(t, s.workspaceTitle) ?? t("group.noProject"), items: [], sessionIds: projectIds.get(key) ?? [] });
					byKey.get(key).items.push(s);
				}
				const list = [...byKey.values()];
				for (const g of list) g.items = sortArchivedSessions(g.items, sortMode, t("locale.intl"));
				const groupCollator = new Intl.Collator(t("locale.intl"), { numeric: true, sensitivity: "base" });
				list.sort((a, b) => {
					if ((a.key === "ungrouped") !== (b.key === "ungrouped")) return a.key === "ungrouped" ? 1 : -1;
					if (sortMode === "title") return groupCollator.compare(a.title, b.title);
					const aDate = sessionSortTime(a.items[0]);
					const bDate = sessionSortTime(b.items[0]);
					if ((aDate === null) !== (bDate === null)) return aDate === null ? 1 : -1;
					if (aDate !== null && bDate !== null && aDate !== bDate) return sortMode === "oldest" ? aDate - bDate : bDate - aDate;
					return groupCollator.compare(a.title, b.title);
				});
				return list;
			}, [sessions, query, projectFilter, typeFilter, tagFilter, sortMode, contentHits, t]);

			if (sessions === null && loadError === null) {
				// jsxs is the runtime for a static children array; jsx would make React
				// treat it as a dynamic list and warn about missing keys on every open.
				return (0, jsx.jsxs)("div", { className: "dac-center", children: [(0, jsx.jsx)("span", { className: "dac-spin" }), (0, jsx.jsx)("span", { children: t("state.loading") })] });
			}
			if (loadError !== null && sessions === null) {
				return (0, jsx.jsxs)("div", {
					className: "dac-center",
					children: [
						(0, jsx.jsx)("span", { children: `${t("state.error")}: ${String(loadError.message ?? loadError)}` }),
						(0, jsx.jsx)(ControlButton, { type: "button", className: "dac-retry", onClick: refresh, children: t("state.retry") })
					]
				});
			}

			const allIds = (sessions ?? []).map((s) => s.id);
            const visibleIds = groups.flatMap(group => group.items.map(row => row.id));
            const selectableIds = visibleIds.filter(id => busy[id] !== true);
            const selected = allIds.filter(id => selectedIds.has(id));
            const visibleSelected = selectableIds.filter(id => selectedIds.has(id)).length;
            const hiddenSelected = selected.filter(id => !visibleIds.includes(id)).length;
            const selectionBusy = selected.length === 0 || selected.some(id => busy[id] === true) || confirmBusy;
            const selectCurrentResults = checked => setSelectedIds(current => {
                const next = new Set(current);
                for (const id of selectableIds) { if (checked) next.add(id); else next.delete(id); }
                return next;
            });
            const askSelectionAction = action => askArchiveAction(action, selected, { kind: "selection" });
				const allBusy = allIds.some((id) => busy[id] === true);
				const filtering = query.trim() !== "" || projectFilter !== "all" || typeFilter !== "all" || tagFilter !== "";



            const searchStatus = currentSearch.status !== "idle" && (0, jsx.jsxs)("div", { className: "dac-search-state", role: "status", children: [
                                (0, jsx.jsx)("span", { children: t("search.progress", {
                                    status: t(`search.status.${currentSearch.status}`),
                                    processed: currentSearch.processed ?? 0,
                                    total: currentSearch.total ?? 0,
                                    hits: contentHits.size,
                                    displayed: pageMode === "unarchived" ? visibleUnarchived.length : visibleIds.length,
                                    failed: currentSearch.skipped.length,
                                }) }),
                                currentSearch.error && (0, jsx.jsx)("span", { className: "dac-error", children: currentSearch.error }),
                                currentSearch.status === "loading" ? (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn", onClick: stopContentSearch, children: t("search.stop") })
                                    : ["error", "partial", "stopped"].includes(currentSearch.status) && (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-btn", onClick: () => startContentSearch(currentSearch), children: t("search.retryUnfinished") }),
                                currentSearch.skipped.length > 0 && (0, jsx.jsxs)("details", { children: [(0, jsx.jsx)("summary", { children: t("search.unreadable") }), (0, jsx.jsx)("ul", { children: currentSearch.skipped.map(item => (0, jsx.jsx)("li", { children: `${item.sessionId}: ${item.reason}` }, item.sessionId)) })] }),
                            ] });

			return (0, jsx.jsxs)("div", {
				ref: pageRef,
				className: "dac-page",
				children: [
					(0, jsx.jsxs)("div", {
						className: "dac-head",
						children: [
							(0, jsx.jsxs)("div", { className: "dac-heading", children: [
								(0, jsx.jsx)("h2", { ref: pageHeadingRef, tabIndex: -1, className: "dac-title", children: t("page.title") }),
								about && (0, jsx.jsx)("span", { className: "dac-version", children: `v${about.version}` }),
								(about?.update?.status === "available" || about?.install?.status === "restart-required") && (0, jsx.jsx)("button", { type: "button", className: "dac-update-link", onClick: openUpdate, children: t(about?.install?.status === "restart-required" ? "update.restartNeeded" : "update.view") }),
							] }),

						]
					}),
                    (0, jsx.jsxs)("div", { className: "dac-intro-row", "data-locale": isZh(t) ? "zh" : "en", children: [
                        (0, jsx.jsx)("p", { className: "dac-intro", children: t("page.description") }),
                            (0, jsx.jsxs)("div", {
								className: "dac-head-actions",
								children: [pageMode === "archived" && !selectionMode && (0, jsx.jsxs)(jsx.Fragment, { children: [
                                    (0, jsx.jsx)(ControlButton, { ref: selectionEntryRef, type: "button", className: "dac-action-trigger", disabled: allIds.length === 0, onClick: () => { setSelectedIds(new Set()); setMenuFor(null); setSelectionMode(true); }, children: t("selection.enter") }),
									(0, jsx.jsxs)(ToolbarMoreMenu, {
										t, triggerLabel: t("menu.moreArchiveActions"),
										children: [
                                        (0, jsx.jsx)("div", { className: "dac-menu-heading", role: "presentation", children: t("menu.allWorkspaces") }),
										(0, jsx.jsx)(HostMenuItem, { type: "button", className: "dac-menu-item", disabled: importBusy, onClick: () => { importReturnFocusRef.current = document.activeElement; importInputRef.current?.click?.(); }, children: t("action.import") }),
											(0, jsx.jsx)(HostMenuItem, { type: "button", className: "dac-menu-item", disabled: allIds.length === 0 || allBusy, onClick: () => askArchiveAction("export", allIds, { kind: "all" }), children: t("action.export") }),
											(0, jsx.jsx)(HostMenuItem, { type: "button", className: "dac-menu-item", disabled: allIds.length === 0 || allBusy, onClick: () => askArchiveAction("unarchive", allIds, { kind: "all" }), children: t("menu.unarchiveAll") }),
											(0, jsx.jsx)("div", { role: "separator", className: "dac-menu-separator" }),
											(0, jsx.jsx)(HostMenuItem, { type: "button", className: "dac-menu-item dac-danger", disabled: allIds.length === 0 || allBusy, onClick: () => askPermanentDelete(allIds, { kind: "all" }), children: t("menu.deleteAllPermanently") }),
										]
									}),
									(0, jsx.jsx)("input", {
										ref: importInputRef,
										type: "file",
										accept: ".zip,application/zip",
										hidden: true,
										onChange: (event) => { const file = event.target.files?.[0]; void importFile(file); event.target.value = ""; }
									})
								] }), pageMode === "unarchived" && (0, jsx.jsxs)(jsx.Fragment, { children: [
                                    (0, jsx.jsx)(ToolbarButton, {
                                        type: "button", "aria-label": t("action.refresh"),
                                        "aria-busy": unarchived.status === "loading" || unarchived.status === "refreshing",
                                        icon: (0, jsx.jsx)(IconRefresh, { busy: unarchived.status === "loading" || unarchived.status === "refreshing" }),
                                        disabled: unarchived.status === "loading" || unarchived.status === "refreshing",
                                        onClick: loadUnarchived, children: t("action.refresh")
                                    }),
                                    (0, jsx.jsx)(ToolbarButton, {
                                        type: "button", variant: "primary",
                                        icon: (0, jsx.jsx)(IconArchive, { size: 13, strokeWidth: 1.6 }),
                                        disabled: unarchived.status !== "ready" || !unarchived.sessions.some(row => row.archiveEligible !== false),
                                        onClick: (event) => archiveUnarchived(null, event),
                                        children: t("unarchived.archiveAll")
                                    })
                                ] }), null]
							})
                    ] }),
                    (0, jsx.jsx)(ArchiveTabs, { pageMode, onChange: changePageMode, t, updateStatus: about?.update?.status }),
					pageMode === "archived" && (0, jsx.jsxs)("div", { id: "dac-panel-archived", role: "tabpanel", "aria-labelledby": "dac-tab-archived", className: "dac-mode-panel", children: [
					metadataStatus === "unavailable" && (0, jsx.jsx)("div", {
						className: "dac-warn",
						role: "status",
						children: t("meta.unavailable")
					}),
					archiveDeletionStatus === "unavailable" && (0, jsx.jsx)("div", {
						className: "dac-warn",
						role: "status",
						children: t("chat.deletionUnverified")
					}),
					(0, jsx.jsxs)("div", { className: "dac-querybar-stacked", children: [
						(0, jsx.jsx)(ControlInput, { className: "dac-search", icon: (0, jsx.jsx)(IconSearch, {}), ...{
									type: "search",
	                                "aria-label": t("search.placeholder"),
									placeholder: t("search.placeholder"),
									value: query,
						onChange: (e) => setQuery(e.target.value)
								} }),
						(0, jsx.jsxs)("div", {
							className: "dac-filters",
							children: [
                                (0, jsx.jsx)(ChatTypeSortFilter, { t, typeFilter, onTypeChange: setTypeFilter, sortMode, onSortChange: setSortMode }),
								(0, jsx.jsx)(WorkspaceFilter, {
	                                t, value: projectFilter, onChange: setProjectFilter, workspaces: projects, scheduleStatus,
	                            }),
	                            (0, jsx.jsx)(FilterSelect, {
	                                t, icon: IconTag,
									value: tagFilter,
						onChange: setTagFilter,
									ariaLabel: t("tag.filter"),
									options: [
										{ value: "", label: t("tag.filter"), heading: true, showIcon: false, separatorAfter: true },
										...tagOptions.map((tag) => ({ value: tag, label: tag }))
									]
								}),
							]
						}),
					] }),
                    searchStatus,
					selectionMode && (0, jsx.jsxs)("div", { className: "dac-selectionbar", children: [
                        (0, jsx.jsxs)("div", { className: "dac-selection-info", children: [
                            (0, jsx.jsxs)("label", { className: "dac-selection-all", children: [
                                (0, jsx.jsx)(SelectionCheckbox, { checked: selectableIds.length > 0 && visibleSelected === selectableIds.length, indeterminate: visibleSelected > 0 && visibleSelected < selectableIds.length, disabled: selectableIds.length === 0 || confirmBusy, ariaLabel: t("selection.selectResults"), onChange: selectCurrentResults }),
                                (0, jsx.jsx)("span", { children: t("workspaceArchive.selectAll") })
                            ] }),
                            (0, jsx.jsxs)("span", { className: "dac-selection-count", role: "status", children: [
                                (0, jsx.jsx)("span", { children: t("selection.count", { count: selected.length }) }),
                                hiddenSelected > 0 && (0, jsx.jsx)("small", { children: t("selection.hiddenCount", { count: hiddenSelected }) })
                            ] })
                        ] }),
                        (0, jsx.jsxs)("div", { className: "dac-selection-actions", "data-language": isZh(t) ? "zh" : "en", children: [
                            (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-action-trigger", disabled: selectionBusy, onClick: () => askSelectionAction("unarchive"), children: t("chat.unarchive") }),
                            (0, jsx.jsxs)("span", { className: "dac-selection-secondary", children: [
                                (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-action-trigger", disabled: selectionBusy, onClick: () => askSelectionAction("export"), children: t("export.selected") }),
                            ] }),
                            (0, jsx.jsx)("span", { className: "dac-selection-overflow", children: (0, jsx.jsxs)(ToolbarMoreMenu, { t, triggerLabel: t("selection.moreActions"), children: [
                                (0, jsx.jsx)(HostMenuItem, { type: "button", className: "dac-menu-item", disabled: selectionBusy, onClick: () => askSelectionAction("export"), children: t("export.selected") }),
                            ] }) }),
                            (0, jsx.jsx)(ArchiveDeleteButton, { sessionId: "selection", label: t("selection.deletePermanently"), disabled: selectionBusy, onDelete: () => askSelectionAction("permanent") }),
                            (0, jsx.jsx)(ControlButton, { type: "button", className: "dac-action-trigger dac-selection-cancel", disabled: confirmBusy, onClick: cancelSelection, children: t("confirm.cancel") })
                        ] })
                    ] }),
                    (0, jsx.jsx)(NoticeBanner, {
						t, notice, interaction: noticeInteraction, top: toastTop(),
						onDismiss: () => setNotice(null),
						onViewArchived: viewArchived,
					}),
					projectFilter === "__dac_scheduled__" && scheduleStatus !== "ready" && (0, jsx.jsx)("div", { className: "dac-warn", role: "status", children: t(scheduleStatus === "unavailable" ? "filter.scheduleUnavailable" : "filter.scheduleUnsupported") }),
                    searchReady && (sessions ?? []).length === 0 && (0, jsx.jsx)(EmptyState, {
						icon: IconArchive, children: t("state.empty")
					}),
					searchReady && (sessions ?? []).length > 0 && groups.length === 0 && filtering && (0, jsx.jsx)(EmptyState, {
						icon: IconSearch, children: t("state.emptyFiltered")
					}),
					groups.map((group) => (0, jsx.jsx)(GroupSection, {
						group,
						t,
						collapsed: collapsed[group.key] === true,
						onToggleCollapsed: toggleCollapsed,
						menuOpen: menuFor === group.key,
						onToggleMenu: setMenuFor,
							onUnarchive: (ids, title) => title === undefined ? unarchive(ids) : askArchiveAction("unarchive", ids, { kind: "workspace", title }),
						onPermanentDelete: askPermanentDelete,
						onExport: (ids, title) => askArchiveAction("export", ids, { kind: "workspace", title }),
						onPreview: openPreview,
						contentHits,
						busy,
						stats,
						selectionMode, selectedIds, onSelect: toggleSelection
							}, group.key)),
					] }),
					null
,
					pageMode === "lineage" && (0, jsx.jsx)("div", { id: "dac-panel-lineage", role: "tabpanel", "aria-labelledby": "dac-tab-lineage", children: (0, jsx.jsx)(ArchiveRelationshipsPanel, { key: `lineage-${workspaceArchiveRefresh}`, t, getLineageListOrder, onPreview: openPreview }) }),
                    pageMode === "unarchived" && (0, jsx.jsxs)("div", { id: "dac-panel-unarchived", role: "tabpanel", "aria-labelledby": "dac-tab-unarchived", "aria-busy": unarchived.status === "loading" || unarchived.status === "refreshing", className: "dac-mode-panel", children: [
                        (0, jsx.jsxs)("div", { className: "dac-querybar-stacked", children: [
                            (0, jsx.jsx)(ControlInput, { className: "dac-search", icon: (0, jsx.jsx)(IconSearch, {}), ...{ type: "search", "aria-label": t("unarchived.search"), placeholder: t("unarchived.search"), value: unarchivedQuery, onChange: event => setUnarchivedQuery(event.target.value) } }),
                            (0, jsx.jsxs)("div", { className: "dac-filters", children: [
                                (0, jsx.jsx)(ChatTypeSortFilter, { t, typeFilter: unarchivedTypeFilter, onTypeChange: setUnarchivedTypeFilter, sortMode, onSortChange: setSortMode }),
                                (0, jsx.jsx)(WorkspaceFilter, { t, value: unarchivedWorkspace, onChange: setUnarchivedWorkspace, scheduleStatus: unarchived.scheduleStatus, workspaces: projects }),
                            ] }),
                        ] }),
                        searchStatus,
                        (0, jsx.jsx)(NoticeBanner, { t, notice, interaction: noticeInteraction, top: toastTop(), onDismiss: () => setNotice(null), onViewArchived: viewArchived }),
                        unarchivedWorkspace === "__dac_scheduled__" && unarchived.scheduleStatus !== "ready" && (0, jsx.jsx)("div", { className: "dac-warn", role: "status", children: t(unarchived.scheduleStatus === "unavailable" ? "filter.scheduleUnavailable" : "filter.scheduleUnsupported") }),
                        unarchived.metadataStatus === "unavailable" && (0, jsx.jsx)("div", { className: "dac-warn", role: "status", children: t("meta.unavailable") }),
                        unarchived.status === "loading" && (0, jsx.jsx)("div", { className: "dac-center", role: "status", children: t("unarchived.loading") }),
                        unarchived.status === "error" && (0, jsx.jsx)("div", { className: "dac-center", role: "alert", children: t("unarchived.error") }),
                        searchReady && visibleUnarchived.length === 0 && (0, jsx.jsx)(EmptyState, { icon: unarchived.sessions.length > 0 ? IconSearch : IconChat, children: t(unarchived.sessions.length > 0 ? "state.emptyFiltered" : "unarchived.empty") }),
                        (unarchived.status === "ready" || unarchived.status === "refreshing") && unarchivedGroups.map(group => (0, jsx.jsx)(GroupSection, {
                            group, t, contentHits, collapsed: collapsed[`unarchived:${group.key}`] === true,
                            onToggleCollapsed: key => toggleCollapsed(`unarchived:${key}`),
                            menuOpen: menuFor === `unarchived:${group.key}`,
                            onToggleMenu: key => setMenuFor(key === null ? null : `unarchived:${key}`),
                            onArchive: archiveUnarchived, onPreview: openPreview, busy,
                            onPermanentDelete: (ids, scope) => askArchiveAction("permanent", ids, { ...scope, source: "unarchived", workspaceId: group.items[0]?.workspaceId ?? null }),
                        }, group.key)),
                    ] }),
					pageMode === "about" && (0, jsx.jsx)("div", { id: "dac-panel-about", role: "tabpanel", "aria-labelledby": "dac-tab-about", children: (0, jsx.jsx)(AboutPanel, { t, about, loading: aboutLoading, checking: aboutChecking, onCheck: openUpdate, onReload: loadAbout }) }),
                    updateOpen && (0, jsx.jsx)(UpdateDialog, { t, about, checking: aboutChecking, installing: updateBusy, error: updateError, onCheck: () => { setUpdateError(null); return checkUpdates(true); }, onInstall: installUpdate, onClose: () => { if (!updateRequestRef.current) setUpdateOpen(false); }, returnFocus: updateReturnFocusRef.current, fallbackFocusRef: pageHeadingRef }),
						workspaceArchive?.stage === "choose" && (0, jsx.jsx)(WorkspaceArchiveChooserDialog, {
							t,
							onChoose: chooseWorkspaceArchive,
							onClose: cancelWorkspaceArchiveChoice,
						}),
							workspaceArchive?.stage === "confirm" && (0, jsx.jsx)(WorkspaceArchiveDialog, {
                                includeActive: true,
								t,
								workspaces: workspaceArchive.workspaces,
                                beginArchiveInteraction: () => beginArchiveInteraction?.(pageRef.current),
                                scope: workspaceArchive.scope,
								restoreFocus: restoreWorkspaceArchiveFocus,
								onClose: closeWorkspaceArchive,
								onEmpty: workspaceArchive.fromUnarchived ? () => { closeWorkspaceArchive(); restoreWorkspaceArchiveFocus(); void loadUnarchived(); setNotice({ kind: "error", text: t("workspaceArchive.reason.session-workspace-changed") }); } : returnToWorkspaceArchiveChoice,
								onApplied: workspaceArchiveApplied,
						}),
						preview !== null && (0, jsx.jsx)(PreviewDialog, {
							preview,
							t,
							busy: previewBusy,
							returnFocus: previewReturnFocusRef.current,
							fallbackFocusRef: pageHeadingRef,
                            onEditMetadata: previewArchiveSession ? () => leavePreviewFor(() => openMetadataEditor(previewArchiveSession)) : undefined,
                            actionBusy: previewArchiveSession ? busy[previewArchiveSession.id] === true : false,
                            metadataUnavailable: metadataStatus === "unavailable",
							onLoadMore: loadMorePreview,
							onCancel: closePreview,
						}),
						importPreview !== null && (0, jsx.jsx)(ImportDialog, {
							preview: importPreview,
							t,
							busy: importBusy,
							returnFocus: importReturnFocusRef.current,
							fallbackFocusRef: pageHeadingRef,
							onToggle: toggleImportSelection,
							onSelectAll: selectAllImport,
							onClear: clearImport,
							onConfirm: restoreImport,
							onCancel: () => { if (!importActionRef.current) setImportPreview(null); },
						}),
						metadataEdit !== null && (0, jsx.jsx)(MetadataDialog, {
						session: metadataEdit,
						t,
						busy: metaBusy,
						returnFocus: metaReturnFocusRef.current,
						fallbackFocusRef: pageHeadingRef,
						onSave: (tags, note) => saveMetadataFor(metadataEdit.id, tags, note),
							onCancel: () => { if (!metaActionRef.current) setMetadataEdit(null); }
					}),
					confirm !== null && (0, jsx.jsx)(ConfirmDialog, {
						title: confirm.title,
						body: confirm.body,
                        confirmDisabled: confirm.loading === true,
						confirmLabel: confirm.label,
                        deleteAll: confirm.deleteAll === true,
						confirmClassName: confirm.danger ? "dac-btn-danger" : "dac-btn-primary",
						cancelLabel: t("confirm.cancel"),
						busy: confirmBusy || confirm.ids.some((id) => busy[id] === true),
						returnFocus: deleteReturnFocusRef.current,
						fallbackFocusRef: pageHeadingRef,
						onConfirm: confirmArchiveAction,
						onCancel: () => { if (!confirmActionRef.current) setConfirm(null); }
					}),
					null,

				]
			});
		}
		//#endregion

		//#region plugin body
		const inject = ["slots", "locale"];

		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(SETTINGS_NS, dictionaries), "archived-chats: dictionaries");
			ensureStyle();
			ctx.effect(() => () => { document.getElementById(STYLE_ID)?.remove(); }, "archived-chats: css cleanup");
			startNavIconPatch();
			ctx.effect(() => () => { stopNavIconPatch(); }, "archived-chats: nav-icon observer cleanup");

			const t = ctx.locale.bind(SETTINGS_NS);
            const archiveNavigation = createArchiveViewNavigation();
            registerArchiveToastShortcut(ctx, t, archiveNavigation);
            let archiveInteraction;
            const beginArchiveInteraction = content => {
                archiveInteraction?.dispose();
                archiveInteraction = preserveArchiveSettings(ctx.slots, { content });
                return archiveInteraction;
            };
            ctx.effect(() => () => archiveInteraction?.dispose(), "archived-chats: settings archive interaction");
			// Sidebar convergence after deletes: the concrete client sessions
			// service re-pulls its session.list baseline on refresh(). Optional
			// on purpose — an older runtime without it still deletes correctly,
			// the main page just needs a reload to catch up.
			const refreshSidebar = () => {
				try { return ctx.get("sessions")?.refresh?.(); } catch { return undefined; /* sidebar converges on next reconnect */ }
			};
			const refreshWorkspaceArchiveConsumers = async () => {
				await Promise.allSettled([
					Promise.resolve().then(() => refreshSidebar()),
					Promise.resolve().then(() => ctx.get("workspaces")?.refresh?.()),
				]);
			};
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "archived-chats",
				order: 30,
				label: () => t("nav"),
				locale: SETTINGS_NS,
				inject: () => ({ refreshSidebar, refreshWorkspaceArchiveConsumers, archiveNavigation, beginArchiveInteraction, getLineageListOrder: () => readLineageListOrder(ctx), subscribeArchiveChanges: listener => {
                        const disposers = [];
                    try {
                        const dispose = ctx.remote?.$on?.("schedule/changed", listener);
                        if (typeof dispose === "function") disposers.push(dispose);
                    } catch { /* Schedule service is optional. */ }
                    try {
                        const dispose = ctx.get("workspaces")?.list?.subscribe?.(listener);
                        if (typeof dispose === "function") disposers.push(dispose);
                    } catch { /* Older hosts may not expose workspace subscriptions. */ }
                    try {
                        const source = ctx.get("sessions")?.list;
                        const snapshot = () => {
                            const rows = source?.getSnapshot?.()?.byId;
                            return rows ? new Map(Object.entries(rows).map(([id, row]) => [id,
                                JSON.stringify([row.title, row.displayTitle, row.blank, row.cwd, row.origin, row.running])
                            ])) : null;
                        };
                        let previous = snapshot();
                        const dispose = source?.subscribe?.(() => {
                            const next = snapshot();
                            // Ignore token/timestamp churn; refresh on list membership,
                            // title, visibility, workspace or running-state changes.
                            const changed = !previous || !next || previous.size !== next.size
                                || [...next].some(([id, value]) => previous.get(id) !== value);
                            previous = next;
                            if (changed) listener();
                        });
                        if (typeof dispose === "function") disposers.push(dispose);
                    } catch { /* Retain workspace/focus refresh on older hosts. */ }
                    return () => { for (const dispose of disposers) dispose(); };
                    } })
			}, ArchivedChatsSection));

		}
		//#endregion

		exports.SETTINGS_NS = SETTINGS_NS;
			exports.__test = { HostButton, HostInput, HostModal, HostMenuSurface, HostMenuItem, ConfirmDialog, previewDeletion, executeDeletion, preserveArchiveSettings, readLineageListOrder, orderLineageListGroups, createArchiveViewNavigation, archiveSettingsOpener, registerArchiveToastShortcut, watchPluginUpdates, UpdateDialog, runArchiveSearch, archiveSearchCandidates, NotePreview, formatBytes, matchesArchivedSession, filterByTag, sortArchivedSessions, setVisibleSelection, uniqueSessionIds, NativeArchiveNotice, WorkspaceArchiveChooserDialog, WorkspaceArchiveDialog, MetadataDialog, ImportDialog, ArchiveTabs, FilterSelect, WorkspaceDisclosureIcon, LineageCanvas, clampLineageZoom, layoutLineage, lineagePathIds, filterLineageForest, groupLineageWorkspaces, LineageTreeNodes, ArchiveRelationshipsPanel, markArchiveDialog, submitExport, submitImportFile, NoticeBanner, fetchLineage, fetchArchivePreview, fetchArchiveImage, fetchArchiveSearch, fetchWorkspaceArchiveWorkspaces, previewWorkspaceArchive, applyWorkspaceArchive, buildPreviewNodes, previewCopyText, groupPreviewSegments, resolvePreviewPrimitives, PreviewMarkdown, PreviewReasoning, PreviewDisclosure, PreviewMessage, PreviewActions, previewFocusables, PreviewImage, unarchiveFailureText, importWarningText, editIconSpec: EDIT_ICON_SPEC };
		exports.__test.importFailureText = importFailureText;
		exports.__test.useSuccessNoticeTimer = useSuccessNoticeTimer;
		exports.__test.HelpTooltip = HelpTooltip;
        exports.__test.ArchiveDeleteButton = ArchiveDeleteButton;
        exports.__test.PreviewTitleButton = PreviewTitleButton;
        exports.__test.ToolbarMoreMenu = ToolbarMoreMenu;
        exports.__test.NativeFilterMenu = NativeFilterMenu;
        exports.__test.deletionFailureNotice = deletionFailureNotice;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
