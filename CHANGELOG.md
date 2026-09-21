# 更新记录（CHANGELOG）

本文件跟 `app.js` 顶部的 `APP_VERSION` / `APP_CHANGELOG` 一一对应。
App 内也可以直接看：**数据 → 关于 · 版本**（手机上确认"壳子有没有加载到新构建"就靠它）。

## 版本号规则

`MAJOR.MINOR.PATCH`
- **MINOR**：加功能、改交互、改数据规格
- **PATCH**：只修 bug，不动数据结构

发版流程：改 `APP_VERSION` / `APP_BUILD` → 在 `APP_CHANGELOG` 顶部插一条 → 在本文件加一节 → commit。
**数据规格变更必须写明**（新增/删除字段、迁移函数名），否则另一台设备拉到旧数据会出错。

---

## v1.12.0 · 2026-09-21

**主题：手机端存储治理（头像压缩 / 引用定位 / 写入放大）**

### 头像专项压缩
- 头像不再和背景图共用 `_compressImg(f, 1200, 0.75)`（一张 200–400KB），
  改走新增的 `_compressAvatar`：**160px / q0.72**，并统一铺白底后重编码（PNG 透明区不会变黑）。
  头像在界面里最大只渲染到 ~56px（@3x = 168px），160px 足够清晰。
- 新增 `_migrateSqueezeImages()`：老数据一次性重压（幂等，受 `cfg.imgSqueeze` 版本门槛保护）。
  覆盖 `imgs.selfAvatar` / `imgs.oppAvatar` / `groupMembers[].avatar` / `carousel[].data` / `imgs.mosaic[]`。
  **背景图（`chatBg` / `homeBg` / `aes_body_bg`）不动** —— 全屏铺底，压狠了会糊。
  只在结果确实更小时才替换。
- 轮播 1200px → 1080px/q0.72；马赛克格子 1200px → 400px/q0.65（按实际显示尺寸给）。

### 引用定位（图片 / 表情包）
- `_stripChatMedia` / `_sanitizeMsgsForBackup` **不再删除 `sticker` / `stickerId`**。
  这两个字段只是引用锚点（布尔 + 短 id，几十字节），真正的 base64 在 `stickers` 数组里，与消息无关。
  删掉它们会让 `_msgKind` 认不出表情消息 → 引用行退化成纯文本，连"引用的是哪个表情"都定位不到。
- 引用行缩略图带 `data-view`：**点缩略图直接看原图**，点其余区域才跳到原消息。
- `quoteLineHtml` 的文本兜底（`data-jump`）只对纯文本 / 歌词类引用生效。
  图片、表情包消息的 `text` 都是同一个占位串（`[图片]` / `[表情包]`），
  一旦 `mid` 失效，按文本找会跳到**第一条**同类消息上 —— 宁可什么都不跳，也不跳错。
- `makeQuote` 在 `text` 为空时用 `QUOTE_LABEL[kind]` 兜底，原消息被裁剪后引用行不会变空白。

### 写入放大
- `saveAll` 改为**增量写入**：`imgs` / `carousel` / `sounds` / `stickers` 这 4 个"大且很少变"的键，
  签名没变就整块跳过。签名用新增的 `_cheapSig`，只读 `length` + 首尾各 24 字符，
  **成本与字节数无关**。原来每发一条消息（300ms 防抖）都会把 `imgs`（实测 2.4MB）重新落盘。
- 写失败时清空签名表，避免这些键被当成"已写过"而永久跳过（等于静默丢数据）。

### 其他
- `backupCriticalData`（localStorage 应急备份）多一层降级：超配额时再去掉群成员头像重试。
- 新增 `window.showVersionInfo()`：数据 → 关于 · 版本，显示当前版本与更新记录。
- 启动时 `console.log` 输出版本 / DB 版本 / 聊天条数，方便排查。

---

## v1.11.0 · 2026-09-21

- 聊天消息不再内嵌头像 base64。实测云端 chats 分片 4.0MB / 193 条，
  其中 **12 条群聊消息各带一份 330KB 头像，占 99.6%**；
  而渲染早就改成"有 `memberId` 就查 `groupMembers`"，消息里那份是永不读取的死数据。
- 新增 `_migrateChatsDropAvatar()`（老数据无 `memberId` 时先按 `name` 补齐再删，幂等）；
  `_addChatMsg` 落地前 `delete msg.avatar`（构造处的 avatar 保留，继续服务通知 / 弹窗）。
- 实测：3996KB → 36KB，**降 99.1%**；幂等复跑不变。

## v1.10.0 · 2026-09-21

- **安全**：`fullExport` 改用 `_syncCfgOut()`（原本直接把整个 `cfg` 写进备份文件，含明文 `syncToken`）；
  `onPickJson` 补上 `{syncToken: cfg.syncToken}`，导入不再覆盖本机令牌。
- 留言板楼层顺序错乱修复：统一双时间轴（`_cmtRealTs` / `_commentsOf`），
  `sendBoardComment` 入库前排序，`_lastTsIn` 改取 `Math.max(ts)`。
- 组字接入三套云端语料（成语词典 / 汉字表 / 歇后语）；`_markovSentence` 门槛同步算上词典
  （只改 `genRecomb` 会导致静默退化成模板句）。

## v1.9.0 · 2026-09-20

- 新增云同步：以 GitHub 私有仓库作后端（无服务器），支持推送 / 拉取 / 连通性测试。
  默认**只同步文本与元数据**：`imgs` / `sounds` / `carousel` 是 base64（几 MB），
  既撞 API 1MB 限制也会撑爆提交历史，由 `syncMedia` 开关控制；聊天里的图片走占位文本。
  令牌只存 `localStorage(cfg.syncToken)`，**绝不硬编码**。
- 409 冲突不静默覆盖；启动时云端更新只 `confirm` 提示，绝不自动覆盖本地。

## v1.8.0 · 2026-09-20

- 留言板重构为「帖子 + 评论」两层（新增 `normalizeMsgs` 迁移）。
- 组字数字槽位与句首虚词；模板槽位扩充。
- 电脑端限宽布局。
- 歌词元数据过滤修复（单字职务名 + 英文关键词）。
- 修复 `stickers` 备份链路。

## v1.7.0 · 2026-08-10

- 接入画作 `painter` 页面（`iframe` 嵌入远端 cy-painter，透传 seed）。
- 样式与组件细化。（此版本及更早的提交信息较粗，明细以 git 记录为准）

## v1.6.0 · 2026-07-14

- 头像短按不再误触发上传弹窗；`openApp` 会先关掉残留浮层。
- 切换聊天布局后同步单选、滚动并聚焦输入框。

## v1.5.0 · 2026-07-12

- 响应式改造：安全区 + 多断点设备适配 + 组件尺寸细化。
- 聊天分页、自动回复概率、表情包压缩、完整备份 / 恢复、虚拟时钟。
- 跳转到指定消息、歌词显示增强、云曲库浏览。
- 云字卡库、云表情库、字卡 JSON 导入导出。
- 存储管理、防抖搜索、Android PWA meta。

## v1.0.0 · 2026-07-03

- 初版发布（幸逢页面，GitHub Pages 经典部署）。
