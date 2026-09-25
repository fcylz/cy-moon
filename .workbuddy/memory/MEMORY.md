# 幸逢cy-moon — 长期项目笔记

> 本文件已合并原 `.codebuddy/memory/MEMORY.md` 与 `.workbuddy/memory/MEMORY.md`。
> **此后只维护本文件。**

## 项目本体
- `d:\幸逢cy-moon` —— 静室（SilentChamber）单页 App：`index.html` + `app.js` + `style.css`
- 数据存 IndexedDB（`DB.transaction("kv")`），另有 localStorage 应急备份 `cy_moon_backup`
  （**只备份文本**，图片/贴纸/画作存占位 —— 这个"只同步文本"策略直接复用到云同步）
- 无构建步骤，直接开 `index.html` 即可
- **16 个键**：`cfg/imgs/texts/cards/chats/members/sounds/shieldedCats/foldedCats/
  anniversaries/carousel/surveys/surveyRecords/stickers/msgs/chatImgs`
  ⚠ 改数据结构时**五处**（`dbGetBatch` / init 赋值 / `saveAll` / `fullExport` / `onPickJson`）要同步
  （老笔记写"四处"漏了 init 赋值那一处，以五处为准）
- `chatImgs`（v1.15.0）= 聊天图片库 `{imgId: base64}`，**对象不是数组**；
  消息里只留 `imgId`（短 id），老数据内嵌的 `m.image` 由 `_migrateChatsExtractImages` 幂等搬过来

## 部署
- 线上：GitHub Pages `https://fcylz.github.io/cy-moon/`，仓库 **`fcylz/cy-moon` 是 public**；
  云同步数据放**私有**仓库 `fcylz/cy-moon-data`
- push 必须 `dangerouslyDisableSandbox: true`（需联网 + 读系统凭据 GCM）
- ⛔ **沙箱内外的 `.git` 视图不同**：沙箱外 push 成功后，沙箱内 `git status` 仍报 ahead、
  `git log origin/main` 仍是旧值。**判断是否推成功只能靠 `git ls-remote origin`**
- 提交需带身份（仓库未配）：`-c user.name="020819LJ" -c user.email="020819LJ@users.noreply.github.com"`
- ⚠ **仓库公开** → 笔记里不要写凭据、私有仓库细节
- 验证线上是否更新：抓 `https://fcylz.github.io/cy-moon/app.js` 看 `APP_VERSION`

## 📝 工作记忆约定
- **只在 `.workbuddy/memory/` 维护**（`YYYY-MM-DD.md` 日记 + `MEMORY.md` 长期笔记）。
  `.codebuddy/memory/` 是旧工具名留下的冗余副本，内容已于 2026-09-21 全部并入 `.workbuddy/`，
  **不要再往那边写、也不要从那边读**
- ⚠ **分叉会复发（2026-09-25 又发生一次）**：另一个会话（CodeBuddy 工具名）不知道这个约定，
  把 v1.15.2 的记录写进了 `.codebuddy/memory/`。**每次接手前先比对两边**，把新增内容并过来：
  ```
  比对手法：Node 读两个 MEMORY.md，按行做 Set 差集，看"只在 A 里"的行
  ```
  合并方向：`.workbuddy/` 是主线（更全），`.codebuddy/` 可能有**主线缺的新增节** → 按节并入
- `.gitignore` 只放行 `.workbuddy/memory/`；`.workbuddy/` 下其余（skills / 缓存 / 配置）不进仓库
  （本仓库 public）。原有关键规则：`github-pat-token.txt` / `*.code-workspace` / `ZY/` / `word-min.json`
- ⛔ **改已跟踪的文件前先 `git show HEAD:<file>` 看一眼**，别用 Write 盲写 ——
  曾因此覆盖掉 `.gitignore` 里 `github-pat-token.txt` 那条安全规则
- 日记是 append-only；发现旧结论被证伪时，**新写一节说明**并在旧节加一行指向修正，不改写历史
- 版本号在 `app.js`：`APP_VERSION` / `APP_BUILD` / `APP_CHANGELOG`，另维护 `CHANGELOG.md`
  规则：MINOR=功能，PATCH=修 bug；**数据结构变更必须写 migrate 函数并在 CHANGELOG 说明**

## 🌐 网络环境（实测）
- ⛔ **`raw.githubusercontent.com` 在本机不可达**；**`cdn.jsdelivr.net` 可用**
- ⛔ jsDelivr 对超限文件（>20MB）一律 403，加 Range 也没用（四个镜像 + statically.io 全一样）
  → **分段拉取不可行**。三个云端默认 URL 已全部改为 jsDelivr
  （`cloudCardIndexUrl` / `cloudMusicIndexUrl` / `cloudStickerIndexUrl`）；
  `_jsdelivr(url, fallback)` 会把老 cfg 里的 raw 地址自动转换。**新建云端资源一律用 jsDelivr**
- 🔧 **本机 Node 跑 fetch 必须加 `--use-system-ca`**（TLS 拦截代理，否则
  `UNABLE_TO_VERIFY_LEAF_SIGNATURE`）。浏览器不受影响
- 测试 app.js 片段用 `new Function` 提取，**数据变量要挂 `globalThis`** 才能观测赋值

## ⛔ 硬约束：壳子（运行环境）
- 用户通过**第三方打包的壳子**（Android WebView）运行，不是浏览器直接开
- 因此**无法修改 WebView 配置**、**没有诊断面板**、用户也无法创建
- **PWA 不是壳子的替代方案**：浏览器会定期清理源站存储，用户试过、数据被清掉，所以才套壳。
  → 任何"改用 PWA / 装到桌面"的建议都是错的方向，不要再提
- 推论：**所有优化只能落在网页侧**（app.js / style.css / index.html），不能要求壳子配合

## 性能约定
- `saveAll` 有增量跳过：`HEAVY_KEYS` 内的键用 `_cheapSig` 比较，签名一致则跳过写盘。
  **新增"大且少变"的键时记得加进 HEAVY_KEYS**
- ⚠ `msgs` 有意**不**进 HEAVY_KEYS：`checkBoardUnread` 会**原地**改 `p.read`，
  而长数组签名是采样的 → 会漏写"已读状态"
- 图片一律走 base64 存 IndexedDB；各键有 `IMG_SPEC` 压缩规格
  （`_compressAvatar` / `_squeezeDataUrl`；头像 240px / q0.72）
- 聊天消息**不存头像**（`_addChatMsg` 删 `msg.avatar`，`_stripChatMedia` / 备份同样剥掉）
- ⛔ **画作消息靠 `painterSeed` 现场重绘，不是 base64** —— 剥媒体时**绝不能删**
  `painter` / `painterSeed`（删了跨设备就退化成 `[画作]` 纯文本气泡，见 v1.14.1）
- 聊天渲染是**窗口化**的：`INITIAL_RENDER=150` / `LOAD_BATCH=80` / `CHAT_MAX=2000`
- ⛔ **「点一下卡」的头号嫌疑：视觉更新排在 `await saveAll()` 之后（v1.15.1）**
  全项目设置函数的老形状是 `cfg[k]=!cfg[k]; await saveAll(); syncUI();` ——
  UI 更新被压在等写盘后面，手机上几十~几百 ms 就是"点了没反应"。
  ✅ 正确形状 = **乐观更新**：先当帧翻转视觉（`setSw`），`syncUI()` 之后跑，
  落盘用 **`saveAllDebounced()`**（防抖，连点多个开关只写一次盘）。
  扫描手法：正则 `window\.\w+\s*=\s*async[^\n]*await saveAll` 一网打尽。
  ⚠ **例外：删除类操作保持 `await saveAll()`**（确保删掉再刷列表，且非高频）。
- ⛔ **改 async 函数为同步前，必须全仓确认没人 `await` 它 / 用它的返回值**
- ⚠ **开关的 DOM 元素别用 `"sw_"+key` 拼**：存在名不副实的 id ——
  `sw_showSeconds`↔`timeShowSeconds`、`sw_autoTTS_adv`↔`autoTTS`。
  一律**从点击事件取**（`event.currentTarget`），所有 `cfgToggle(...)` 调用点都要传 `event`
  （`index.html` 27 处 + `app.js` 动态生成 6 处）
- ⚠ `syncUI()` 很重（136 行）：**只对影响全局显示的开关跑它**。
  确认方法是查该开关 id 在不在 syncUI 体内 —— 云同步三开关（syncAuto/syncMedia/syncChatImgs）
  **不在**，跑它纯浪费（见 `SYNC_SW_NO_UI`）

## 同步时"剥媒体"的边界（踩过两次同一个坑）
判断某字段该不该剥，标准是**它是不是媒体本体**，不是"看起来像不像大字段"：
- ✅ 该剥：`avatar`（每份 330KB 的重复副本）
- ⛔ **不能剥**：`painterSeed`（70B 的种子，**种子即内容**）、`stickerId`（短引用锚点）、
  **`imgId`**（v1.15.0 起图片的短引用锚点）
- ⚠ `image` **已经不在这里了**：v1.15.0 起图片本体存 `chatImgs[imgId]`，
  消息里只有 `imgId`。`if(c.image) delete c.image` 现在只对**没迁移掉的老数据**生效。
→ **判据 = 剥了之后渲染层还认不认得出这条消息的类型**（`_msgKind` 依赖这些布尔标记）。
  删掉标记 = 类型信息丢失 = 退化成纯文本气泡。**删之前先想清楚渲染读什么。**

## 图片消息（v1.15.0 起）
- 图存 `chatImgs[imgId]`，消息只留 `imgId`；`_migrateChatsExtractImages` 幂等迁移老数据
- `resolveChatImg(id)` 查不到 → **返回 `PH_SVG` 占位图**（⛔ 不是文字气泡）
- 同步：**每张图一个文件** `chatimg-<id>.json`（`_syncParts` 只对数组分片，对象会撞 1MB 硬限）
- **`chatImgs` 永远并集，`force` 也不例外**（图是只增资源，覆盖 = 丢本机图，不可逆）
- 独立开关 `syncChatImgs`（默认关，**独立于 `syncMedia`**）；只传 `_referencedChatImgs()`（孤儿图不上云）
- ⚠ **`_chatViewSigNow` 必须计入 `Object.keys(chatImgs).length`** ——
  否则"图到了但 chats 数组没变"时切进聊天页会复用旧 DOM，图停在占位图
- ⚠ 应急备份（localStorage）**不含 chatImgs** → 恢复后图片显示占位图（刻意取舍，只保文字）；
  完整图用 `fullExport`（含 chatImgs）

## 云同步约定
- 浏览器直连 `api.github.com`（支持 CORS，无后端）+ 私有仓库 `fcylz/cy-moon-data`(main) + fine-grained PAT。
  设置 → 云同步面板；`syncRepo/syncBranch/syncToken/syncAuto/syncMedia/syncChatImgs`
- 默认**只同步文本**（图片/音效是 base64，易撞 1MB 上限 + 撑爆历史），`syncMedia` 可开
- ⛔ contents API 单文件必须 ≤1MB（超出分片）；用 `sha` 做乐观锁检测多设备冲突
- ⚠ 两个真实坑：①本地无 sha 而远端文件已存在 → PUT 需先 GET 取 sha，否则 422；
  ②`manifest.files[name]` 是数组，pull 别读成 `info.parts`
- **v1.14.0 起拉取默认合并**：列表类按唯一键取并集（**同键本机优先**），
  单条配置类 `texts`/`cfg`/`anniversaries` **按时戳裁决**（云端比 `syncLastPush` 新才用云端）
- 唯一键：`chats.mid` / `msgs.id` / `comments.id` / `cards.id` / `stickers.id` /
  `groupMembers.id` / `surveys.id` / `surveyRecords.id` / `carousel.id` / `sounds.id`
- ⚠ **合并只做加法，表达不出「删除」** —— 要彻底对齐某一边只能用覆盖按钮。
  新增同步数据类型时先想清楚它"能不能按唯一键并集"，不能就挂到配置类按时戳裁决
- ⛔ **同键跳过 ≠ 只要本机有就行（v1.14.2 的教训）**：`_mergeByKey` 同键无条件 `continue`，
  本意是防旧数据覆盖；副作用是**本机那条若是残缺版（媒体被剥过），云端完整版永远进不来**。
  所以"并集"这套机制**默认修不好任何本机已有的坏记录**。
  解法是给 `_mergeChats` 加**单向回填**：只补本机缺的媒体字段（`painter/painterSeed`、
  `image/imgId`、`sticker/stickerId`），**绝不碰 `text`/`ts`/`sender`/`name`**。
  ⛔ 回填只加在 `_mergeChats` 上 —— `_mergeByKey` 被 cards/members/surveys 共用，改它会波及全部列表类
- 两个覆盖出口对称：`forcePushSync()` 本机→云端 / `forcePullSync()` 云端→本机，都带二次确认。
  **409 时先判断哪边是最新**，别再让人无脑去拉取
- `_syncCfgOut()` 必须屏蔽 `syncToken` / `syncShas` / `syncLastPush` / `syncLastPull`
  （本机私有，外传 = sha 错乱与 409 的源头）
- ⚠ 多设备测试前**关掉「自动推送」**，否则测试数据持续污染云端
- ⛔ 令牌存 localStorage，**绝不写进代码**

## ⭕ 云同步合并：id 判重不够，必须叠内容键（v1.15.2 教训）
- 云端导入的 id = `"c"/"sk" + Date.now()`，**跨设备必然不同** → `_mergeById` 会把两台设备
  各导入的同一批云端内容算成两条 → 同步一轮多一份（用户报"库里有重复"的真正原因）
- ✅ 现在 cards/stickers 用 `_mergeCards`/`_mergeStickers`：先 `_mergeByKey(id)` 并集，
  再 `_dedupeBy` 按内容键收一遍（字卡=`cat+正文`，表情=`/Meme/` 之后的路径）
- 表情 src 域名换过（raw→jsdelivr）→ 判重要**抹掉域名**，同图优先留非 raw
  （`_stickerRank`：raw 本机不可达 → 排后面）
- 判重标准必须在**合并层 + 导入层**用同一套键（`_cardKey`/`_stickerKey`），否则两边各判各的照样漏
- 历史重复靠 `window.dedupeLib(auto)` 清理，启动 1.5s 后自动跑一次，幂等
- ⚠ **副作用**：内容完全相同的两条**无法共存**了（本来可用于"提高某句抽中概率"）。
  这是刻意取舍——完全相同的条目只会让抽卡概率倾斜，没有功能价值

## ⭕ 云端库（字卡/表情/音乐）索引缓存
- ⛔ 缓存曾**无 TTL** 且刷新函数**没接进 UI** → 仓库里新增了内容，本机永远拉不到
- 现 `CLOUD_INDEX_TTL = 6h` + fetch 追加 `t=Date.now()` 绕过 CDN 缓存
  + 两个云端库弹窗加「刷新云端」按钮（刷新后**就地重渲染**列表）
- ⛔ `updateCloudStickerStatus` / `updateCloudCardStatus` 的目标元素**只在弹窗内存在**，
  而 fetch 先于 render → 必须在 render 之后**补调一次**，否则状态永远不显示

## 内容 / 语料
- **不打算再增加字卡** → 组字功能要靠「云端字典」或内置语料养活，不能指望字卡库
- 云端字卡库 `word.json`（1521 条）风格是**日常对话/怼人**，**不适合做组字语料**
- **云端组字词典 `cloudDict`** 源 = `fcylz/chinese-xinhua`（分支 **master**）：
  `data/idiom.json`（30895 条成语）可拉；⭕ `ci.json` / 原 `word.json` 都 403（超 20MB）
- 汉字表 `word-min.json`（349KB）**对组字零增益**，价值在拼音/笔画/部首，留给将来玩法
- ⛔ **扩大起字池 ≠ 往池里加字**：多样性瓶颈是**链覆盖**，不是池子大小。
  正解 = 歇后语 `xiehouyu.json` **只建链 + 扩池**（链 661→2484，首字去重 102→143）
- ⭕ **判断汉字生僻度别用笔画数、别用 ci.json 词频**（ci 是古汉语，词频全是古字）。
  ✅ 唯一可靠判据 = **成语字频排名**（成语是现代汉语活语料）
- 组字与抽卡是**概率共存**：`recombProb`（默认 15%）命中才造句，失败自动退回抽卡
- **上传文件到 `fcylz/chinese-xinhua`**：`git clone --filter=blob:none`
  + `git sparse-checkout set data` → 加文件 → commit → push（HTTP/CDN 只能读，写必须走 git）

## 组字（genRecomb）接口约定
- 引擎有四个现成"接入槽"，外部语料灌进去即可，**不用改生成逻辑**：
  `frags`(2-4字→模板`{w}`填空) · `segs`(4-10字→长句拼段) · `chars`(起字池) · `bi/tri`(字级链)
- ⚠ `_getMarkov()` 的缓存签名**不含外部语料** —— 加字典时必须把字典规模并进 sig，
  否则字典变了索引不重建
- ⛔ 组字门槛必须在 **`genRecomb` 和 `_markovSentence` 两处**都算上词典 ——
  只改一处会让字卡为空时 Markov 静默失效、生成全退化成模板句（表现：词藻堆砌）
