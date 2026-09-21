# 长期记忆

## 项目
`d:\幸逢cy-moon` — 静室（SilentChamber）单页 App：`index.html` + `app.js`(5805行/282KB) + `style.css`。
数据存 IndexedDB，另有 localStorage 应急备份。无构建步骤，直接开 `index.html` 即可。

## 🌐 网络环境（重要，实测）
- **`raw.githubusercontent.com` 在本机不可达**（node fetch 直接 failed，web_fetch 也 500）
- **`cdn.jsdelivr.net` 可用**（HTTP 200）
- ⛔ **jsDelivr 对超限文件（>20MB）一律 403，加 Range 也没用**，四个镜像
  （cdn/fastly/gcore/testingcf）+ statically.io 全一样 → **分段拉取不可行**。
  （Range 本身是支持的：未超限文件能 206。）
- 三个云端默认 URL **原本全是 raw**（2026-09-21 已全部改为 jsDelivr）：
  `cloudCardIndexUrl` / `cloudMusicIndexUrl` / `cloudStickerIndexUrl`
  → 云端字卡/音乐/表情包此前很可能一直拉不到。**新建云端资源一律用 jsDelivr**；
  `_jsdelivr(url, fallback)` 会把老用户 cfg 里存的 raw 地址自动转换，不用改数据。

## 用户偏好
- **不打算再增加字卡** → 组字功能需要靠「云端字典」或内置语料养活，不能指望字卡库。
- 备份导出清单是 15 项，改数据结构时四处（`dbGetBatch`/`saveAll`/`fullExport`/`onPickJson`）要同步。

## 组字（genRecomb）要点
- 语料 = 字卡（排除歌词库/屏蔽卡/屏蔽分类）→ 运行时建 `bi`/`tri` 链，不落盘。
- 引擎有四个现成"接入槽"，外部语料灌进去即可，**不用改生成逻辑**：
  `frags`(2-4字→模板`{w}`填空) · `segs`(4-10字→长句拼段) · `chars`(起字池) · `bi/tri`(字级链)
- ⚠ `_getMarkov()` 的缓存签名 `sig = cards.length|totalChars|shieldedCats|shieldedCount`
  **不含外部语料** —— 加云端/内置字典时必须把字典规模并进 sig，否则字典变了索引不重建。
- 现有云端字卡库 `word.json`（1521 条）风格是**日常对话/怼人**（诗意意象词仅 3.7%，
  样例：我陪你/哈哈哈/你污蔑我/不要内耗），**不适合做组字语料**，需另建词典。
- **云端组字词典 `cloudDict`** 已实现（2026-09-21），源 = 用户自己的 **`fcylz/chinese-xinhua`**（分支 master）：
  `data/idiom.json`（30895 条成语）。⭕ 该仓库 `ci.json`(26万词语)/`word.json`(1.6万汉字) **都 403**
  （超 jsDelivr 20MB 上限，github.com/raw 也不通）→ 只有成语和歇后语能拉。
- 成语不能直接当组字语料：填空=堆砌、建链=切碎成半截。
  ✅ 正确用法 = 筛**写景成语** 638 条（≥2 意象字、无贬义字、字频 top1500 内）→ `frags` 当意象片段；
  **非写景成语不建链**（实测灌 6000 条更糟）。
- ⛔ 组字门槛必须在 **`genRecomb` 和 `_markovSentence` 两处**都算上词典 —— 只改一处会让
  字卡为空时 Markov 静默失效、生成全退化成模板句（表现：词藻堆砌）。
- 词典语料要**名词 + 谓词短语混合**：只有名词会导致模板 `{w}` 填出一堆名词（「我想钟玻璃」）。
- ⭕ **判断汉字生僻度别用笔画数、别用 ci.json 词频**（ci 是古汉语词典，词频全是古字）。
  ✅ 唯一可靠判据 = **成语字频排名**（成语是现代汉语活语料）：**≤3000 干净**，
  全量 4850 就会混进 祚/筲/洩/夤/缊/赭/鼗。起字池现用成语字频 top3000。
- 汉字表 `word-min.json`（349KB，字+拼音+笔画+部首）**对组字零增益**（过活字表后只剩 ~3000，
  等于成语字频本身）；价值在拼音/笔画/部首，留给将来玩法。
- ⛔ **扩大起字池 ≠ 往池里加字**：成语池 3000→4850，首字去重反而 102→98。
  池里 3000 字只有 ~110 个"能接得下去"，其余没有后续搭配 → 开局即断，仍落在 我/你/等/不。
  **多样性瓶颈是链覆盖，不是池子大小。**
- ✅ 扩池正解 = **歇后语 `xiehouyu.json` 只建链 + 扩池**（不进 frags/segs）：
  链 661→2484，起字池 3000→3691，首字去重 102→**143**。
  它的字是活口语字（妈/爷/催/晒/凳/柿/蛤），而成语低频段是死字（祚/筲/夤/缊/赭）。
  ✅ **已上传**（2026-09-21）：`fcylz/chinese-xinhua@master/data/word-min.json`，CDN 200 即时生效。
- **数据层**：全部走 IndexedDB（`DB.transaction("kv")`），键 = cfg/imgs/texts/cards/chats/members/sounds/
  shieldedCats/foldedCats/anniversaries/carousel/surveys/surveyRecords/stickers/msgs。
  另有 localStorage 降级备份 `cy_moon_backup`（**只备份文本**，图片/贴纸/画作替换为占位）—— 这个
  "只同步文本"策略可直接复用到云同步。
- ~~**云同步方案（2026-09-21 调研，未实现）**~~ ✅ **已实现（2026-09-21）**：
  浏览器直连 `api.github.com`（支持 CORS，无需后端）+ **私有仓库 `fcylz/cy-moon-data`**(分支 main)
  + fine-grained PAT。设置 → 云同步面板；`syncRepo/syncBranch/syncToken/syncAuto/syncMedia`。
  默认**只同步文本**（图片/音效是 base64，易撞 1MB 上限 + 撑爆历史），`syncMedia` 可开。
  `saveAll` 后延迟 30s 自动推送；启动时若云端更新只 confirm 询问，**绝不自动覆盖本地**。
  ⛔ 令牌存 localStorage，**绝不写进代码**；用户在对话里贴过 → 完工后应 revoke 重发。
  ⚠ 两个真实坑：①本地无 sha 而远端文件已存在 → PUT 需先 GET 取 sha，否则 422；
  ②manifest.files[name] 是数组，pull 别读成 `info.parts`。
  ⚠ contents API 单文件必须 ≤1MB（超出分片），用 `sha` 做乐观锁检测多设备冲突。
- 🔧 **本机 Node 跑 fetch 必须加 `--use-system-ca`**（有 TLS 拦截代理，否则 UNABLE_TO_VERIFY_LEAF_SIGNATURE）。
  浏览器不受影响。测试 app.js 片段用 `new Function` 提取，**数据变量要挂 globalThis** 才能观测赋值。
- **上传文件到 `fcylz/chinese-xinhua` 的可行路径**：git 协议通 → `git clone --filter=blob:none`
  + `git sparse-checkout set data` → 加文件 → `git -c user.name=... -c user.email=... commit` → push。
  ⚠ 分支是 **master**；HTTP/CDN 只能读，写必须走 git。
- 组字与抽卡是**概率共存**：`recombProb`（默认 15%）命中才造句，其余仍抽字卡，失败自动退回抽卡。
