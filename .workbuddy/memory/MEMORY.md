# 幸逢cy-moon — 长期项目笔记

> 本文件已合并原 `.codebuddy/memory/MEMORY.md` 与 `.workbuddy/memory/MEMORY.md`。
> **此后只维护本文件。**

## 项目本体
- `d:\幸逢cy-moon` —— 静室（SilentChamber）单页 App：`index.html` + `app.js` + `style.css`
- 数据存 IndexedDB（`DB.transaction("kv")`），另有 localStorage 应急备份 `cy_moon_backup`
  （**只备份文本**，图片/贴纸/画作存占位 —— 这个"只同步文本"策略直接复用到云同步）
- 无构建步骤，直接开 `index.html` 即可
- 15 个键：`cfg/imgs/texts/cards/chats/members/sounds/shieldedCats/foldedCats/
  anniversaries/carousel/surveys/surveyRecords/stickers/msgs`
  ⚠ 改数据结构时四处（`dbGetBatch`/`saveAll`/`fullExport`/`onPickJson`）要同步

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
- 聊天渲染是**窗口化**的：`INITIAL_RENDER=150` / `LOAD_BATCH=80` / `CHAT_MAX=2000`

## 云同步约定
- 浏览器直连 `api.github.com`（支持 CORS，无后端）+ 私有仓库 `fcylz/cy-moon-data`(main) + fine-grained PAT。
  设置 → 云同步面板；`syncRepo/syncBranch/syncToken/syncAuto/syncMedia`
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
- 两个覆盖出口对称：`forcePushSync()` 本机→云端 / `forcePullSync()` 云端→本机，都带二次确认。
  **409 时先判断哪边是最新**，别再让人无脑去拉取
- `_syncCfgOut()` 必须屏蔽 `syncToken` / `syncShas` / `syncLastPush` / `syncLastPull`
  （本机私有，外传 = sha 错乱与 409 的源头）
- ⚠ 多设备测试前**关掉「自动推送」**，否则测试数据持续污染云端
- ⛔ 令牌存 localStorage，**绝不写进代码**

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
