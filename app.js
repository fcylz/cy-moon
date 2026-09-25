"use strict";

window.DEFAULTS = {
  PH_SVG: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23c8cacd'/></svg>`),
  cfg: {
    layout:1, theme:"light", fontSize:13, chatFontSize:13,
    delayMin:2, delayMax:5, typingText:"", ignoreOn:false, quoteOn:true,
    sentenceJoin:true, activeSend:false, activeMin:5, activeMax:20, nextActiveAt:0,
    replyProb:60, // 用户发消息后彼自动回复的概率（0-100），默认60%
    popupOn:true, notifOn:false, soundOn:true, sfxVolume:0.8, showAvatar:true, showName:true,
    showTime:true, showRead:true, showSelfRead:false, showSelfName:false,readText:"",
    customFont:"", customFontCss:"", customBubble:"", customChatCss:"",
    groupMode:false, chatStyle:1, inputPlaceholder:"", welcomeTitle:"",
    fitHome:true,   // ⭕ 首页「不滚动」：内容整体等比缩放塞进一屏；false = 恢复自然高度可滚动
    welcomeText:"", timeShowSeconds:false,
    oppTime:"", oppTimeDate:"", oppTimeSetAt:0, oppCustomTime:true,
    tradTransOn:true, // 彼的简体回复自动生成繁体译文（离线词典，不联网）
    transProb:50,     // 生成译文的概率（%），100=条条都译；0 等同于关闭
    tradPrimary:true, // 繁体为主：正文直接显示繁体，简体原文点击才展开（仅对自动生成的译文生效）
    // ⭕ 组字：Markov 生成(B) + 模板兜底(C)，失败退回原抽卡
    recombOn:true, recombProb:15, recombOrder:3,
    recombMin:3, recombMax:30, recombMaxRepeat:3, recombMaxSteps:300,
    musicUrl:"", musicTitle:"", musicArtist:"", musicLrc:"",
    /* ⭕ 一律用 jsDelivr —— 实测 raw.githubusercontent.com 在本机不可达（fetch 直接 failed），
       jsDelivr 是同一个 GitHub 仓库的 CDN 镜像，@main 指定分支。
       旧版本填过 raw 地址的，会在读取时自动换成 jsDelivr（见 _jsdelivr()）。 */
    cloudMusicIndexUrl:"https://cdn.jsdelivr.net/gh/fcylz/cy-music@main/index.json",
    cloudCardIndexUrl:"https://cdn.jsdelivr.net/gh/fcylz/cy-chat@main/Word/word.json",
    cloudStickerIndexUrl:"https://cdn.jsdelivr.net/gh/fcylz/cy-chat@main/Meme/meme.json",
    /* ⭕ 词典源 = chinese-xinhua 成语库（30895 条，3.2MB）。
       注意分支是 master 不是 main；同仓库的 ci.json(26万词语)/word.json(1.6万汉字) 都超过
       jsDelivr 的单文件上限，一律 403 拉不到，所以只有 idiom.json 可用。 */
    cloudDictUrl:"https://cdn.jsdelivr.net/gh/fcylz/chinese-xinhua@master/data/idiom.json",
    dictOn:true,    // ⭕ 云端词典并入组字语料
    /* ⭕ 云端汉字表（可选）：word.json 精简版，只留「字+拼音+笔画+部首」349KB。
       拉不到也没关系 —— 起字池会退回成语字频反推的那 1500 字，不影响其他功能。 */
    cloudCharUrl:"https://cdn.jsdelivr.net/gh/fcylz/chinese-xinhua@master/data/word-min.json",
    charOn:true,        // 汉字表并入起字池
    charMaxStroke:0,    // 笔画上限：0=不限（默认）。筛生僻字靠「活字表」而不是笔画 —— 笔画数不可靠（楍才 12 画）
    /* ⭕ 云端歇后语（可选）：只建链 + 扩起字池，绝不进 frags（太俗，不能当意象片段）。
       实测它是「扩起字池」唯一有效的来源 —— 民间口语字全是活字（妈/爷/催/晒/凳/柿/渣/蛤），
       不像成语低频段那样是死字（祚/筲/洩/夤/缊/赭）。起字池 3000→3792，链 661→2708，
       首字去重 113→145。⭕ 单纯把成语池放大是无效的：3000→4850 首字去重反而 106→98。 */
    cloudXhyUrl:"https://cdn.jsdelivr.net/gh/fcylz/chinese-xinhua@master/data/xiehouyu.json",
    xhyOn:true,         // 歇后语并入语料（建链 + 起字池）
    /* ⭕ 云同步：浏览器直连 GitHub REST API（api.github.com 支持 CORS，不需要后端），
       数据存在你自己的**私有仓库**里。⛔ contents API 单个文件必须 ≤1MB 才支持 JSON+sha 读写，
       所以数据按 key 分文件，超出自动分片（见 SYNC_CHUNK）。
       ⛔ syncToken 留空让用户自己在面板里填 —— 绝不硬编码进代码。 */
    syncRepo:"fcylz/cy-moon-data", syncBranch:"main", syncToken:"",
    syncAuto:true,      // 自动推送（数据变动后延迟 30s）
    syncMedia:false,    // 是否连图片/音效一起同步（体积大、易超限，默认关）
    /* ⭕ v1.15.0：聊天图片单独一路，**独立于 syncMedia**、默认关。
       开之前两台设备都该升到同一版本（旧版认不出 imgId 消息）。
       关着时对面的图片消息显示占位图 —— 文字与结构照常同步。 */
    syncChatImgs:false,
    syncLastPush:0, syncLastPull:0, syncShas:{},
    cloudMusicLastSync:0, cloudCardLastSync:0, cloudStickerLastSync:0, cloudDictLastSync:0, cloudCharLastSync:0, cloudXhyLastSync:0, activeSoundId:"__builtin_thud1__",
customHomeCss:"", customHomeJs:"", homeVisibility:{}, hideAesBg:false, hidePolarBg:false,minimaxKey: "", minimaxVoice: "male-qn-qingse", autoTTS: false,ttsUrl: "https://api.minimax.chat/v1/t2a_v2",
    ttsKey: "",
    ttsGroupId: "",
    ttsModel: "speech-01-turbo",
    ttsVoice: "male-qn-qingse",
    ttsSpeed: 1.0,
    ttsVol: 1.0,
    ttsPrompt: "",
    ttsPersist: false,
    sepPool: ["，","。","！","…","？","～"], sepNoneChance: 20,
    stickerOn: false,
    painterOn: false,      // ⭕ 随机画作功能总开关，默认关闭
    painterUrl: "https://fcylz.github.io/cy-painter/pages/index.html",  // ⭕ 直接指真实页面，不经过根目录跳转
    songRecOn: true,       // ⭕ 彼随机推荐曲库歌曲：位于表情包/画作之后，占剩余份额的 2%
    lyricFromCloud: true,  // ⭕ 歌词来源跟随曲库：当前播放 > 曲库随机 > 本地歌词库兜底
    avSize: "s",         // 聊天头像大小：s=小 32px, m=中 40px, l=大 48px
  },
  imgs: {
  selfAvatar: "", oppAvatar: "",
  timeline: [], mosaic: [], gallery: [],
  l1_p1: "", l1_p2: "",
  polar1: "", polar2: "", polar3: "", polar4: "",
  l2_cover: "", l2_duo: "",
  h4_avatar: "",
  music_cover: "",
  p1_img: "", p2_img: "", p3_img: "", p4_img: "",aes_main: "", aes_body_bg: ""
},
  texts: {
    l1_name:"", l1_loc:"", l1_stat1_n:"", l1_stat1_l:"", l1_stat2_n:"", l1_stat2_l:"",
    l1_song:"", l1_artist:"",anni_label:"",
    aes_name:"", aes_sub:"", aes_r_lbl:"", aes_tag:"", aes_title:"", aes_f1:"", aes_f2:"",
    opp_name:"", opp_bio:"", l2_name:"", l2_bio:"", l2_s1:"", l2_lbl1:"", l2_s2:"",
    l2_lbl2:"", l2_s3:"", l2_lbl3:"", l2_search:"", l2_bub1:"", l2_bub2:"",
    l2_p1_name:"", l2_p1_time:"", l2_p1_body:"", l2_p1_like:"", l2_p1_cmt:"",
    l2_p1_cmt2_name:"", l2_p1_cmt2_body:"", l2_p1_cmt2_role:"",
    style2_tag:"", style2_sub:"", style3_b1:"", style3_b2:"",
    style3_sub:"", style4_t1:"", style4_t2:"", style4_stamp:"", style4_title:"", style4_sub:"",aes_tags: "",

  },
  cards: [],
  groupMembers: [{id:"g1",name:"",avatar:""},{id:"g2",name:"",avatar:""}],
  anniversaries: [{id:"a1",title:"未定义",date:new Date().toISOString().slice(0,10),mode:"since"}],
  surveys: [{
    id: "builtin_tolerance",
    title: "对象和他人的关系你能忍到几级",
    builtin: true,
    questions: [
      "第1级：见面打招呼","第2级：有联系方式","第3级：偶尔的关心","第4级：经常约着打游戏",
      "第5级：记得对方生日，并且互送礼物","第6级：把ta挂在嘴边，动不动就提起","第7级：单独约吃饭看电影",
      "第8级：打个电话就会去赴约","第9级：频繁聊天发消息","第10级：喝醉了给ta打电话",
      "第11级：一起合租","第12级：单独一起旅行","第13级：一起开一间房",
      "第14级：在你的面前和ta有直接的亲密举动","第15级：孩子全都不是你的"
    ].map(t=>({ text:t, options:["接受","中立","拒绝"], needComment:true }))
  }],
  surveyRecords: []
};

const DB_NAME="SilentChamberDB", DB_VER=11;
let DB=null, tempTimelineImg="";
const SEP_POOL=["，","。","！","…","？","～"];
const STICKER_CHANCE=15; // 对方随机发送表情包的概率（%），不开放给用户调节

/* ─── 版本记录 ───
   规则：MAJOR.MINOR.PATCH —— 改功能走 MINOR，只修 bug 走 PATCH。
   用途有二：一是仓库根目录 CHANGELOG.md 与本表对应；二是**排查"手机壳子到底有没有加载到新构建"**：
   WebView 缓存很顽固，出问题时第一件事就是打开 数据 → 关于·版本 看这个号变没变。
   ⭕ 每次发版：改 APP_VERSION / APP_BUILD，并在 APP_CHANGELOG 顶部插一条。 */
const APP_VERSION = "1.15.4";
const APP_BUILD   = "2026-09-25";
const APP_CHANGELOG = [
  { v:"1.15.4", d:"2026-09-25", items:[
    "新增：**已存在的重复内容**怎么清 —— 设置 → 数据 → 存储管理 → 清理重复内容",
    "点它会先告诉你检测到多少条、判重标准是什么（字卡 = 分类+正文，表情 = 图片路径，raw/jsdelivr 算同一张），确认后才动数据",
    "自动清理（每次启动 1.5s 后）也一直在跑：没清掉东西时完全静默，连写盘都没有；清掉了才提示一句",
    "⛔ 只删内容键完全相同的冗余项，每种留一条；表情优先保留打得开的那条",
    "⭕ 清理**不会让聊天里的表情失效**：消息存的是 stickerId，合并掉那条后会把引用改指到保留的那条（同一张图）",
    "保留哪一条的优先级：打得开的（非 raw）> **有聊天在引用的** > 位置靠前的；引用块、留言板帖子/评论一并跟上",
    "映射另存 `cfg.stickerAlias` 兜底，`_findSticker`（发送 / 屏蔽 / 缩略图缓存）统一走别名回退",
  ]},
  { v:"1.15.3", d:"2026-09-25", items:[
    "修复：云端字卡库 / 表情库**刷新后再导入会叠加** —— 已导入的项标「已导入」并禁止勾选，「全选」只选本地还缺的那些",
    "两处导入收尾再跑一次内容去重兜底，任何漏网的键不一致都不会在库里留下重复",
    "修复：云端库的「选中项」拿**渲染下标当身份** —— 字卡那侧会导错行（潜在），表情那侧一用搜索就导错（活的）",
    "字卡下标改取未过滤原下标、表情下标改取 _cskData 的原始位置：筛选只影响显示，不影响身份",
    "说明：这批修复本被追加进 v1.15.2 段落，但 v1.15.2 已发布（1b43acc）—— 同号两份代码就没法靠版本号判断修复到没到，故另起一号",
  ]},
  { v:"1.15.2", d:"2026-09-25", items:[
    "修复：字卡库 / 表情包库出现重复内容（**是云同步造成的**）",
    "原因①：云端导入生成的 id 是 `c`/`sk` + Date.now()，两台设备各自导入同一批云端内容 → id 不同 → 合并时当成两条，同步一轮多一份",
    "现在 cards / stickers 合并改为**内容级去重**（字卡 = 分类+正文，表情 = 图片路径），并集之后再收一遍",
    "原因②：表情 src 的域名换过（raw.githubusercontent.com → cdn.jsdelivr.net），同一张图两个地址各占一条，src 判重失效",
    "表情去重键统一取 `/Meme/` 之后的路径，域名差异消失；同图时优先保留打得开的那条（raw 在本机不可达）",
    "导入云端字卡 / 云端表情 / 粘贴链接 三处判重同步改用同一套键，不再各判各的",
    "新增 `dedupeLib()`：把库里**已有的**重复项收掉，启动时自动跑一次（幂等，没清掉东西就不写盘，清掉了会提示）",
    "修复：云端新增的表情包拉不到 —— 索引缓存**永不过期**，而且刷新按钮根本没接进 UI",
    "云端索引缓存加 6 小时 TTL，过期自动重拉；拉取 URL 追加时间戳绕过浏览器/CDN 缓存",
    "云端字卡库、云端表情库弹窗新增「刷新云端」按钮，刷新后就地重渲染列表，并显示云端条数状态行",
  ]},
  { v:"1.15.1", d:"2026-09-21", items:[
    "修复：设置页开关（含云同步那三个）点下去反应迟钝 —— 要等 IndexedDB 写盘完成后才更新视觉",
    "原因：老的写法是 `cfg=…; await saveAll(); syncUI();`，把 UI 更新排在等写盘之后，手机上要等几十~几百 ms",
    "改为**乐观更新**：点下去立刻翻转开关（当帧生效），写盘改用防抖（连点多个开关只落一次盘）",
    "云同步的三个开关（自动推送/图片音效/聊天图片）本就**不在 syncUI 里**，跳过全量同步，反馈更快",
    "切布局 / 切主题 / 换字号 / 换气泡样式 / 换头像尺寸 同样受益（同一个根因，一并改）",
    "顺带修：`sw_showSeconds`（对应 timeShowSeconds）与 `sw_autoTTS_adv`（对应 autoTTS）"
      + "这两个开关 id 与配置名不同名，旧代码靠拼名字找不到元素；现在改从点击事件取元素",
  ]},
  { v:"1.15.0", d:"2026-09-21", items:[
    "新增：聊天图片可以跨设备同步了（云同步面板新增独立开关「同步聊天图片」，默认关）",
    "🏗 数据结构变更：新增 IndexedDB 键 chatImgs（{imgId: base64}）；消息新增 imgId 字段，图片从「内嵌」改为「按 id 独立寻址」",
    "🏗 迁移函数 _migrateChatsExtractImages（幂等）：自动把老消息里内嵌的 image 挪进 chatImgs，消息只留短 id",
    "云同步：每张图独立成文件 chatimg-<id>.json，绕开 GitHub 1MB 单文件硬限；只传被消息引用的图，孤儿图不上云",
    "合并拉取：chatImgs 永远取并集，连「强制拉取」也不例外 —— 避免覆盖时丢掉本机独有的图",
    "单张图片超过 900KB 会跳过并提示，不让整次推送失败",
    "渲染兼容：_msgKind / 引用预览 / 引用缩略图同时认 m.image（老数据）与 m.imgId（新数据）",
    "图片查不到时显示**占位图**（可点开）而不是退化成文字气泡",
    "⚠ 两台设备都要升到 1.15.0 之后再打开这个开关（旧版认不出 imgId 消息）",
    "⚠ 应急备份（localStorage）不包含 chatImgs，恢复后图片显示占位图 —— 完整图片请用「导出备份」",
  ]},
  { v:"1.14.2", d:"2026-09-21", items:[
    "修复：合并拉取时，若本机已有一条被剥过媒体的残缺消息，云端完整版永远进不来（画作/图片/表情在对面永久定格为占位符）",
    "原因：v1.14.0 的「同键本机优先」是无条件的——它挡住了旧数据覆盖，也顺手挡住了「云端来补齐本机缺的媒体」",
    "现在 _mergeChats 开了**单向回填**：只允许云端补齐本机缺的 painter/painterSeed、image/imgId、sticker/stickerId",
    "⛔ 绝不改写 text / ts / sender / name——本机的新内容与时间戳仍然优先，防旧数据覆盖的初衷不变",
    "顺带把 _msgKind 的图片判定放宽为 m.image || m.imgId，为 v1.15.0 的图片独立寻址铺路",
  ]},
  { v:"1.14.1", d:"2026-09-21", items:[
    "修复：画作消息云同步后变成「[画作]」纯文本气泡（跨设备看不到画）",
    "原因：同步前剥媒体时把 painter / painterSeed 一起删了——而画作没有 base64，种子即内容",
    "现在画作随同步原样带过去，另一台设备靠 seed 现场重绘出同一张画",
    "体积代价为零（seed 只是几十字节），所以不需要开关；本地应急备份同样保留",
  ]},
  { v:"1.14.0", d:"2026-09-21", items:[
    "云同步改为「合并式拉取」：按唯一 id 取并集，手机和电脑的新聊天/留言/卡片都保留，不再一边盖一边",
    "列表类按唯一键合并（聊天 mid / 消息 id / 评论 id / 卡片 id / 表情 id / 成员 id / 问卷 id / 分类字符串）",
    "单条配置类（话术、设置、纪念日）无法合并，改为按时戳裁决——云端比本机上次推送新才用云端",
    "留言板支持「同帖评论并集」：两端各回了一条也不会丢",
    "聊天合并后按时间排回序，并遵守 CHAT_MAX 上限（只留最近那批）",
    "新增「强制拉取」（云端→本机覆盖），与「强制推送」对称，供需要彻底对齐时使用",
    "同步出去的设置不再包含本机的 sha 表 / 上次推拉时间（本机私有，外传是 409 的另一个来源）",
  ]},
  { v:"1.13.1", d:"2026-09-21", items:[
    "云同步新增「强制推送」：忽略云端版本冲突，用本机数据覆盖云端（治误推后的单向死锁）",
    "修正 409 的误导提示：原文只说「请先拉取」，但拉取会反过来把云端数据盖到本机",
    "云同步面板补上「拉取 / 强制推送」两个方向的差异说明",
  ]},
  { v:"1.13.0", d:"2026-09-21", items:[
    "聊天记录 / 群成员也走增量写入（chats、members 进跳过名单）—— 治「越用越慢」",
    "长数组签名改采样（首4 / 1/4 / 中 / 3/4 / 尾4，共 20 点）：2000 条从 5.6ms 降到 0.08ms",
    "设置页的图片改成「指纹没变就不碰 src」—— 治「进设置页调设置卡」（此前每次改开关都全量重解码 base64）",
    "进聊天页加脏检查：DOM 还在且内容没变就复用，不再每次重建 150 条；翻过的历史位置也不会被打回",
    "留言板 msgs 有意不进跳过名单（它有「原地改已读」的操作，采样会漏写）",
  ]},
  { v:"1.12.1", d:"2026-09-21", items:[
    "头像 / 昵称一改，聊天与留言板立即同步（此前要退出重进才换）",
    "修正头像压缩规格的文档笔误（代码实为 240px / q0.72，注释与更新记录写的 160px 是错的）",
  ]},
  { v:"1.12.0", d:"2026-09-21", items:[
    "头像改走专项压缩（240px / q0.72），老头像一次性重压：单张 330KB → ~17KB",
    "轮播 / 马赛克按实际显示尺寸压（1200px → 1080 / 400），不再一律 1200px",
    "引用定位修复：表情包 / 图片引用不再丢锚点，点缩略图直接看原图，跳转不再跳错消息",
    "saveAll 改为增量写入：imgs / 轮播 / 音效 / 表情包没变就不落盘（治手机端写入放大）",
  ]},
  { v:"1.11.0", d:"2026-09-21", items:[
    "聊天消息不再内嵌头像 base64（chats 4MB → 36KB，实测降 99.1%）",
  ]},
  { v:"1.10.0", d:"2026-09-21", items:[
    "安全：备份导出不再写入云同步令牌，导入不再覆盖本机令牌",
    "留言板楼层顺序修复（统一 _cmtRealTs / _commentsOf 双时间轴）",
    "组字接入三套云端语料（成语词典 / 汉字表 / 歇后语）",
  ]},
  { v:"1.9.0", d:"2026-09-20", items:[
    "新增云同步：GitHub 私有仓库备份 / 恢复，默认只同步文本与元数据",
  ]},
  { v:"1.8.0", d:"2026-09-20", items:[
    "留言板重构为「帖子 + 评论」两层",
    "组字数字槽位与句首虚词；电脑端限宽布局；歌词元数据过滤修复",
  ]},
  { v:"1.7.0", d:"2026-08-10", items:[
    "画作 painter 页面接入与移除；样式与组件细化",
  ]},
  { v:"1.6.0", d:"2026-07-14", items:[
    "头像短按不再误触发上传；openApp 先关掉残留浮层",
    "切换聊天布局后同步单选、滚动并聚焦输入框",
  ]},
  { v:"1.5.0", d:"2026-07-12", items:[
    "响应式改造：安全区 + 多断点适配",
    "聊天分页 / 自动回复概率 / 表情包压缩 / 完整备份恢复",
    "跳转到指定消息 / 歌词显示增强 / 云曲库 / 云字卡库 / 云表情库 / 存储管理",
  ]},
  { v:"1.0.0", d:"2026-07-03", items:["初版发布（幸逢页面）"] },
];

/* ⭕ 引用相关可调常量 */
const QUOTE_CHANCE=0.30; // 彼回复时携带引用的概率
const QUOTE_RANGE=10;    // 引用候选范围：最近 N 条（用户消息 + 彼发过的歌词）

/* ⭕ 稳定消息 ID：不再依赖 chats 下标，删除/裁剪历史也不会让引用串位 */
let _midSeq=0;
function _genMid(){ _midSeq=(_midSeq+1)%1000000; return "m"+Date.now().toString(36)+"-"+_midSeq.toString(36); }
/** 一次性迁移：给没有 mid 的老聊天数据补上（幂等） */
function _migrateChatsMid(){
  let dirty=false;
  for(const m of chats){ if(m && !m.mid){ m.mid=_genMid(); dirty=true; } }
  return dirty;
}
/* ⭕ 清掉消息里内嵌的头像 base64。
   渲染早就改走 memberId 查 groupMembers 了（见 _buildMsgRow 的 av 取值），
   消息里那份 avatar 是**永不读取的死数据** —— 但实测 12 条群聊消息各带一份 330KB 头像，
   占 chats 总体积的 99.6%（193 条消息总共 4MB，其中 3960KB 是头像）。
   老数据没有 memberId 时先按 name 补一个再删，保住头像显示。
   幂等：消息里没有 avatar 就完全不动作。 */
function _migrateChatsDropAvatar(){
  let dirty=false;
  for(const m of chats){
    if(!m || !m.avatar) continue;
    if(!m.memberId && m.name && Array.isArray(groupMembers) && groupMembers.length){
      const g=groupMembers.find(x=>x && x.name===m.name);
      if(g && g.id) m.memberId=g.id;
    }
    delete m.avatar; dirty=true;
  }
  return dirty;
}
/* ⭕ v1.15.0 生成图片 id：时间戳（36 进制）+ 自增序号，同一毫秒也不会撞。
   不用纯随机是为了让 id 天然按时间有序，便于人工排查。 */
function _genImgId(){ _ciSeq=(_ciSeq+1)%1e6; return "ci"+Date.now().toString(36)+"-"+_ciSeq.toString(36); }
/* ⭕ v1.15.0 一次性迁移：把老消息里**内嵌的** image base64 挪进 chatImgs，消息只留 imgId。
   动机：v1.14.x 及以前图片死在 m.image 里，同步时只能整条 `delete c.image` → 跨设备变 [图片消息]。
   挪出来之后，图片成了"独立可寻址的资源"，才能按 imgId 单独同步、单独回填。
   幂等：**消息里没有 m.image 就完全不动作**（已迁过的、纯文本/画作/表情消息都不受影响）。
   不改 m.text / m.ts / m.mid —— 只搬运 image 字段本身。 */
function _migrateChatsExtractImages(){
  let dirty=false;
  for(const m of chats){
    if(!m || !m.image) continue;
    const id = m.imgId || _genImgId();
    chatImgs[id] = m.image;   /* 先存库再删，任何一步失败都不会把图弄丢 */
    m.imgId = id;
    delete m.image;
    dirty = true;
  }
  return dirty;
}
/* ─── 一次性图片体积治理（老数据）───
   老数据里所有图都是 _compressImg(f, 1200, 0.75) 的产物，实测：
   imgs 单键 2380KB，其中拍立得 polar1~4 就占 1516KB（64%）、头像 493KB（21%）。
   而它们在界面里最大也就渲染到 ~110px 宽 —— 1200px 的图 90% 的像素从来没被显示过。
   这里按 IMG_SPEC（= 真实显示尺寸）+ 轮播 / 马赛克规格逐个重压。
   背景图（chatBg / homeBg / aes_body_bg）**不动** —— 全屏铺底，压狠了会糊。
   用 cfg.imgSqueeze 做版本门槛：跑过一次就不再跑，不在每次启动反复压同一批图。
   _squeezeDataUrl 只在结果确实更小时才返回新值，所以不存在"越压越糊"。 */
const IMG_SQUEEZE_VER = 1;
async function _migrateSqueezeImages(){
  if(Number(cfg.imgSqueeze||0) >= IMG_SQUEEZE_VER) return false;
  const jobs=[];
  /* imgs 里规格表覆盖到的键 */
  for(const k of Object.keys(IMG_SPEC)){
    if(!imgs[k]) continue;
    const [mw,q]=IMG_SPEC[k];
    jobs.push(async()=>{ const o=await _squeezeDataUrl(imgs[k],mw,q); if(o) imgs[k]=o; return !!o; });
  }
  /* 群成员头像（不在 imgs 里，单独走） */
  (Array.isArray(groupMembers)?groupMembers:[]).forEach((m,i)=>{
    if(!m || !m.avatar) return;
    jobs.push(async()=>{ const o=await _squeezeDataUrl(m.avatar,AVATAR_MAX_W,AVATAR_Q); if(o) groupMembers[i].avatar=o; return !!o; });
  });
  /* 轮播 / 马赛克格子 */
  (Array.isArray(carousel)?carousel:[]).forEach((c,i)=>{
    if(!c || !c.data) return;
    jobs.push(async()=>{ const o=await _squeezeDataUrl(c.data,1080,0.72); if(o) carousel[i].data=o; return !!o; });
  });
  (Array.isArray(imgs.mosaic)?imgs.mosaic:[]).forEach((d,i)=>{
    if(!d) return;
    jobs.push(async()=>{ const o=await _squeezeDataUrl(d,400,0.65); if(o) imgs.mosaic[i]=o; return !!o; });
  });
  let changed=false;
  for(const j of jobs){ try{ if(await j()) changed=true; }catch(e){} }
  cfg.imgSqueeze = IMG_SQUEEZE_VER;   /* 标记跑过（无论有没有真的压到东西） */
  return true;                        /* 无论如何都落一次盘，把标记写进去 */
}
/** 消息类型识别：决定引用预览怎么渲染 */
function _msgKind(m){
  if(!m) return "text";
  if(m.sticker) return "sticker";
  if(m.painter) return "painter";
  if(m.song)    return "song";
  if(m.image || m.imgId) return "image";   /* ⭕ imgId 是 v1.15.0 的独立寻址（图存 chatImgs），老数据仍走 m.image */
  if(m.lyric)   return "lyric";
  return "text";
}
const QUOTE_LABEL={ text:"", image:"[图片]", sticker:"[表情包]", painter:"[画作]", song:"[歌曲]", lyric:"[歌词]" };
/** 兼容旧数据：老的 quote 是纯字符串 */
function getQuoteInfo(q){
  if(!q) return null;
  if(typeof q==="string") return { mid:"", from:"", text:q, kind:"text" };
  return { mid:q.mid||"", from:q.from||"", text:q.text||"", kind:q.kind||"text" };
}
/* ─── 简体 → 繁体（离线词典 s2t-dict.js，由 _ensureS2T 首次使用时建索引）───
   最大正向匹配：从最长 4 字的词开始试，命中即替换；未命中退回单字，都没有就原样保留。
   只做字形转换，不做地区用词转换。 */
let _s2tMap=null, _s2tMaxLen=1, _s2tReady=false;
/* ⭕ 人工校正：OpenCC 原表里少数条目在繁体日常书写中反而不自然或会造成歧义，这里强制覆盖。
   新增条目直接往这个数组里加即可（长度不超过 4 才会被最大匹配用上）。 */
const S2T_OVERRIDE=[
  ["吃","吃"],        // 原表把 吃→喫（于是「吃饭」变「喫飯」），日常繁体仍写作「吃」
  ["着","著"],        // 原表单字表不含 着→著，词组覆盖不到的地方会漏掉
  ["皇后","皇后"],    // 无分词时对「皇后的后」无法区分，专名固定不转
  ["太后","太后"],
  ["影后","影后"]
];
function _ensureS2T(){
  if(_s2tReady) return _s2tMap;
  _s2tReady=true;
  const raw = window.S2T_DICT;
  if(!raw){ console.warn("[s2t] 词典未加载"); return null; }
  _s2tMap=new Map(); _s2tMaxLen=1;
  for(const line of raw.split("\n")){
    if(!line) continue;
    const sp=line.indexOf(" ");
    if(sp<1) continue;
    const k=line.slice(0,sp), v=line.slice(sp+1);
    if(!k||!v) continue;
    if(!_s2tMap.has(k)){ _s2tMap.set(k,v); if(k.length>_s2tMaxLen) _s2tMaxLen=k.length; }
  }
  /* 校正层放最后：无条件覆盖，优先级高于词表本身 */
  for(const kv of S2T_OVERRIDE){
    const k=kv[0], v=kv[1];
    _s2tMap.set(k,v);
    if(k.length>_s2tMaxLen) _s2tMaxLen=k.length;
  }
  return _s2tMap;
}
function s2t(s){
  if(!s) return s;
  const M=_ensureS2T(); if(!M) return s;
  const n=s.length; let out="", i=0;
  while(i<n){
    let hit=null;
    for(let L=Math.min(_s2tMaxLen, n-i); L>=1; L--){
      const v=M.get(s.substr(i,L));
      if(v!==undefined){ hit=v; i+=L; break; }
    }
    if(hit!==null) out+=hit;
    else { out+=s[i]; i++; }
  }
  return out;
}

/** 由一条消息构造引用对象 */
function makeQuote(m){
  const kind=_msgKind(m);
  /* ⭕ 媒体类消息的 text 可能是空的（歌曲 / 画作一类）——兜一个类型标签，
     这样即使原消息被裁剪掉，引用行也有个能看懂的摘要，不至于变成空白行。 */
  return { mid:m.mid||"", from:m.sender==="self"?(texts.l1_name||"我"):(m.name||texts.opp_name||"对方"), text:(m.text||QUOTE_LABEL[kind]||""), kind };
}

let cfg={}, imgs={}, texts={}, cards=[], chats=[], groupMembers=[], sounds=[], stickers=[];
let shieldedCats=[], selected=[], foldedCats=[], anniversaries=[], carousel=[];
let surveys=[], surveyRecords=[], surveyFill=null, editingSurvey=null, editingSurveyIsNew=false;
/* ⭕ 留言板：{id, who:"self"|"opp", text, ts, quote:{id,who,text}|null, read:bool} */
let msgs=[];
/* ⭕ v1.15.0：聊天图片库 { imgId: "data:image/jpeg;base64,..." }。
   图片从"内嵌在消息里"改为"按 imgId 独立寻址" —— 这样才能在云同步时
   只传被引用的图（`_referencedChatImgs`），并让每张图独立成一个文件绕开 1MB 上限。 */
let chatImgs={};
let _ciSeq=0;   /* imgId 自增序号，避免同一毫秒内生成重复 id */
let activeTimer=null, replyTimer=null, typingNode=null, currentApp=null;
let openTrans=new Set(), pendingQuote=null, pendingQuoteFrom="";

// ─── Service Worker（系统通知必须经由 SW 派发，详见 notify()）───
let _swReg = null;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
    .then(reg => { _swReg = reg; })
    .catch(() => {});
}
let ctxTargetIdx=-1, musicAudio=null, unreadCount=0, popupTimer=null;
let imgPickKey="", memberPickIdx=-1, isBatchSelecting=false;
let cardsActiveTab="cards", isStickerBatchSelecting=false, stickerSelected=[];
let stickerPickerPage=0, stickerLibPage=0;
const STICKER_PICKER_PAGE_SIZE=10, STICKER_LIB_PAGE_SIZE=20;
let cloudSongCache=null, cloudCardCache=null, cloudStickerCache=null; // 云端数据内存缓存

const TEXT_GROUPS = [
  { h:"开屏", keys:[{k:"welcomeTitle",l:"标题"},{k:"welcomeText",l:"副文"}], isCfg:true },
  { h:"通用", keys:[{k:"inputPlaceholder",l:"输入占位"},{k:"typingText",l:"输入提示"},{k:"readText",l:"已读文案"}], isCfg:true },
  { h:"布局一", keys:[
    {k:"l1_name",l:"昵称"},{k:"l1_loc",l:"签名"},
    {k:"l1_stat1_n",l:"统计①数"},{k:"l1_stat1_l",l:"统计①标"},
    {k:"l1_stat2_n",l:"统计②数"},{k:"l1_stat2_l",l:"统计②标"},
    {k:"l1_song",l:"歌曲"},{k:"l1_artist",l:"歌词"},
    
    {k:"anni_label",l:"纪念词"}
  ]},
  { h:"布局一 · 美学卡片", keys:[
    {k:"aes_name",l:"昵称"},{k:"aes_sub",l:"副文"},{k:"aes_r_lbl",l:"右标签"},
    {k:"aes_tag",l:"小标签"},{k:"aes_title",l:"标题"},{k:"aes_tags",l:"文案"},
    {k:"aes_f1",l:"底部一"},{k:"aes_f2",l:"底部二"}
  ]},  
  { h:"布局二", keys:[
    {k:"l2_name",l:"昵称"},{k:"l2_bio",l:"签名"},
    {k:"l2_s1",l:"数据一"},{k:"l2_lbl1",l:"标签一"},
    {k:"l2_s2",l:"数据二"},{k:"l2_lbl2",l:"标签二"},
    {k:"l2_s3",l:"数据三"},{k:"l2_lbl3",l:"标签三"},
    {k:"l2_search",l:"搜索文案"},{k:"l2_bub1",l:"气泡一"},{k:"l2_bub2",l:"气泡二"},
    {k:"l2_p1_name",l:"博文署名"},{k:"l2_p1_time",l:"博文时间"},
    {k:"l2_p1_body",l:"博文正文"},{k:"l2_p1_like",l:"点赞数"},
    {k:"l2_p1_cmt",l:"评论数"},{k:"l2_p1_cmt2_name",l:"评论者"},{k:"l2_p1_cmt2_body",l:"评论内容"},{k:"l2_p1_cmt2_role",l:"评论角色"}
  ]},
  { h:"聊天 · 经典", keys:[{k:"opp_name",l:"对方名"},{k:"opp_bio",l:"状态"}] },
  { h:"聊天 · 胶囊", keys:[{k:"style2_tag",l:"顶部标签"},{k:"style2_sub",l:"副文"}] },
  { h:"聊天 · 双向", keys:[{k:"style3_b1",l:"左侧气泡"},{k:"style3_b2",l:"右侧气泡"},{k:"style3_sub",l:"分割文案"}] },
  { h:"聊天 · 日记", keys:[{k:"style4_t1",l:"标签A"},{k:"style4_t2",l:"标签B"},{k:"style4_stamp",l:"时间戳"},{k:"style4_title",l:"标题"},{k:"style4_sub",l:"副标题"}] }
];

const DOCK_HTML = `
<button class="dock-btn" data-app="chatApp" onclick="openApp('chatApp')">
  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
<button class="dock-btn" data-app="cardsApp" onclick="openApp('cardsApp')">
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></button>
<button class="dock-btn" data-app="statsApp" onclick="openApp('statsApp')">
  <svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></button>
<button class="dock-btn" data-app="settingsApp" onclick="openApp('settingsApp')">
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>`;

// ─── IndexedDB ───
// Batched save: all keys in one transaction
function openDB() {
  return new Promise((res,rej) => {
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = e => { const d=e.target.result; if(!d.objectStoreNames.contains("kv")) d.createObjectStore("kv"); };
    r.onsuccess = e => { DB=e.target.result; res(); };
    r.onerror = rej;
  });
}
function dbGet(k,d) {
  return new Promise(res => {
    try { const r=DB.transaction("kv","readonly").objectStore("kv").get(k); r.onsuccess=()=>res(r.result===undefined?d:r.result); r.onerror=()=>res(d); } catch{ res(d); }
  });
}
function dbSet(k,v) {
  return new Promise(res => {
    try { const t=DB.transaction("kv","readwrite"); t.objectStore("kv").put(v,k); t.oncomplete=()=>res(); } catch{ res(); }
  });
}
// ⭐ 单事务批量读取：替代 init() 中 14 次独立 dbGet（每次开闭一个 readonly 事务）
function dbGetBatch(specs) {
  return new Promise((res) => {
    try {
      const t = DB.transaction("kv", "readonly");
      const s = t.objectStore("kv");
      const result = {};
      let pending = specs.length;
      if (!pending) { res(result); return; }
      specs.forEach(([key, defVal]) => {
        const r = s.get(key);
        r.onsuccess = () => {
          result[key] = r.result === undefined ? defVal : r.result;
          if (--pending === 0) res(result);
        };
        r.onerror = () => {
          result[key] = defVal;
          if (--pending === 0) res(result);
        };
      });
    } catch { res({}); }
  });
}

// ─── Utils ───
function randomSep(){
  const pool = (cfg.sepPool && cfg.sepPool.length) ? cfg.sepPool : SEP_POOL;
  const noneChance = (cfg.sepNoneChance!=null) ? cfg.sepNoneChance : 20;
  if (Math.random()*100 < noneChance) return "";
  return pool[Math.floor(Math.random()*pool.length)];
}
function escapeHtml(s){ return String(s??"").replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">").replace(/'/g,"'"); }
function escapeAttr(s){ return String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,"\\n"); }
function randInt(a,b){ a=+a||0; b=+b||0; if(b<a)b=a; return Math.floor(Math.random()*(b-a+1))+a; }
/* ⭕ raw.githubusercontent.com 在本机不可达 → 统一走 jsDelivr 镜像。
   老用户 cfg 里存的可能还是 raw 地址，这里兜一层，不用手动改数据。 */
function _jsdelivr(url, fallback){
  const u=String(url||fallback||"").trim();
  if(!u) return "";
  const m=u.match(/^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/);
  return m ? `https://cdn.jsdelivr.net/gh/${m[1]}/${m[2]}@${m[3]}/${m[4]}` : u;
}
function fmtTime(d,withSec=false){ return withSec ? d.toTimeString().slice(0,8) : d.toTimeString().slice(0,5); }
function fmtDate(d){ return d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0"); }

// ─── Init ───
async function init() {
  try {
    await openDB();
    const b = await dbGetBatch([
      ["cfg",{}],["imgs",{}],["texts",{}],["cards",null],["chats",[]],
      ["members",null],["sounds",[]],["shieldedCats",[]],["foldedCats",[]],
      ["anniversaries",null],["carousel",[]],["surveys",null],["surveyRecords",[]],["stickers",[]],["msgs",[]],
      ["chatImgs",{}]   /* ⭕ v1.15.0：聊天图片独立寻址 { imgId: base64 }，消息里只留 imgId */
    ]);
    cfg           = Object.assign({}, window.DEFAULTS.cfg, b.cfg);
    imgs          = Object.assign({}, window.DEFAULTS.imgs, b.imgs);
    texts         = Object.assign({}, window.DEFAULTS.texts, b.texts);
    cards         = b.cards       || window.DEFAULTS.cards;
    chats         = b.chats       || [];
    groupMembers  = b.members     || window.DEFAULTS.groupMembers;
    sounds        = b.sounds      || [];
    shieldedCats  = b.shieldedCats || [];
    foldedCats    = b.foldedCats  || [];
    anniversaries = b.anniversaries || window.DEFAULTS.anniversaries;
    carousel      = b.carousel    || [];
    surveys       = b.surveys     || window.DEFAULTS.surveys;
    surveyRecords = b.surveyRecords || [];
    stickers      = b.stickers    || [];
    msgs          = b.msgs        || [];
    chatImgs      = b.chatImgs    || {};   /* ⭕ v1.15.0 */
    normalizeMsgs(); /* ⭕ 老数据（扁平留言）迁成「帖子 + 评论」两层 */
    /* ⭕ 老数据补 mid（只会在首次升级时写一次） */
    if(_migrateChatsMid()) saveAllDebounced();
    /* ⭕ 老数据里每条消息内嵌的头像 base64 只清一次 —— 首次升级后 chats 从几 MB 掉到几十 KB */
    if(_migrateChatsDropAvatar()) saveAllDebounced();
    /* ⭕ v1.15.0：把老消息里**内嵌的图片 base64** 挪进 chatImgs，消息只留 imgId。
       幂等：消息里没有 image 就完全不动作。必须排在下面所有渲染之前。 */
    if(_migrateChatsExtractImages()) saveAllDebounced();
  } catch(e){ console.warn(e); }

  document.getElementById("dockL1").innerHTML = DOCK_HTML;
  document.getElementById("dockL2").innerHTML = DOCK_HTML;

  bindEditables();
  bindImageInteractions();
  bindFilePickers();
  bindChatScroll();
  bindChatDelegation(); /* ⭐ 事件委托：替代每条气泡的独立事件监听 */
  bindMusicPlayer();
  _backgroundPreload();
  bindGlobalClose();
  bindPopup();
  bindMosaicLongPress();
  syncUI();
  /* ⭕ 版本号落进「数据 → 关于」那一行，顺便打一条日志：排查手机上"壳子有没有更新"看这里 */
  { const _vl=document.getElementById("verLabel"); if(_vl) _vl.innerText="v"+APP_VERSION; }
  console.log(`[幸逢] v${APP_VERSION} (${APP_BUILD}) · 数据 ${DB_VER} · 聊天 ${chats.length} 条`);
  initWelcomeParticles();
  renderChats();
  renderCarousel();
  renderMosaic();
  renderMembers();
  fitHomeToScreen(); fitHomeWatch(); /* ⭕ 首页贴合屏幕：不滚动 */
  renderSoundList();
  scheduleActive(true);
  initAnniCard();
  initOppTime();

  matchMedia("(prefers-color-scheme:dark)").addEventListener("change", ()=>{ if(cfg.theme==="system") applyTheme(); });

  /* ⭐ 降级备份检测：延迟到首帧渲染完成后再弹，避免阻塞启动 */
  setTimeout(tryRestoreBackup, 400);
  /* ⭕ 老数据图片体积治理：要解码一批老图，**不能挡开屏** —— 延到首帧之后再跑。
     受 cfg.imgSqueeze 版本门槛保护，一辈子只跑一次。 */
  setTimeout(()=>{ _migrateSqueezeImages().then(d=>{ if(d) saveAllDebounced(); }).catch(()=>{}); }, 1200);
  /* ⭕ 字卡/表情重复自检：把历史遗留的重复项收一遍（幂等，没清掉东西就不写盘） */
  setTimeout(()=>{ try{ window.dedupeLib(true); }catch(e){} }, 1500);
  /* ⭕ 留言板：开屏时若彼有新留言就提醒。
     4.2s 是刻意晚于欢迎页（3s 淡出 + .8s 收尾）—— 否则弹窗会被开屏动画盖住看不见 */
  setTimeout(checkBoardUnread, 4200);

  /* ⭕ 云端词典预热：后台拉，不阻塞启动。拉不到也不影响 —— 组字会退回字卡语料 */
  if(cfg.dictOn) fetchCloudDict();
  /* ⭕ 汉字表同理，且是可选增强：拉不到就退回成语字频反推的字 */
  if(cfg.charOn) fetchCloudChar();
  if(cfg.xhyOn) fetchCloudXhy();   // ⭕ 歇后语同理：可选增强，拉不到就只有成语那条链
  setTimeout(checkCloudBackup, 3000);   // ⭕ 云同步：云端有更新就提示（不自动覆盖）
}

/* ─── 增量写入：重型键没变就不写 ───
   原来 saveAll 每次都把 15 个键全量 put 一遍，其中 imgs / carousel / sounds / stickers
   是 base64 大对象（实测 imgs 单键就有 2.4MB），而它们**极少变化** ——
   结果每发一条消息（300ms 防抖）都要把这几 MB 重新落盘：这是手机端"越用越慢"的主因。
   下面的签名判断成本与**字节数无关**（只读 length + 首尾各 24 字符），
   所以判断本身几乎不花钱，省下的是整块写盘。

   ⭕ chats / members 也走这套（v1.13.0 加）：它们不是"大"而是"会越长越大" ——
      设置页每个开关都是 await saveAll(); syncUI();，聊天攒到 2000 条时，
      每次改设置都要把整个聊天记录重新序列化落盘，于是表现为"越用越慢"。
      安全性：全项目没有"编辑单条消息"的功能，改动必然落在 length 或首/中/尾采样点上。 */
const SIG_ARRAY_FULL = 64;   /* 数组不超过这么多就全量算签名（短数组信息量大、判断成本也低） */
function _cheapSig(v, depth){
  const d=depth||0; if(d>8) return "…";   /* 深度上限只用于兜住循环引用，不是用来省成本的 */
  if(v==null) return "n";
  /* ⭕ 采样三处（首 / 中 / 尾）：只取首尾的话，"等长且只在中间改了一小段"会撞签名。
     三处采样依然是 O(1)，但碰撞要求改动恰好避开首尾和正中 —— 对 base64 图片数据来说不可能。 */
  if(typeof v==="string"){
    const m=v.length>>1;
    return "s"+v.length+":"+v.slice(0,24)+"|"+v.slice(m-12,m+12)+"|"+v.slice(-24);
  }
  if(typeof v==="number"||typeof v==="boolean") return "p"+String(v);
  if(Array.isArray(v)){
    const n=v.length;
    if(n<=SIG_ARRAY_FULL) return "a"+n+"["+v.map(x=>_cheapSig(x,d+1)).join(",")+"]";
    /* ⭕ 长数组只采样 20 个点（首4 / 1/4 / 中 / 3/4 / 尾4）。
       本项目的数组只有三种变法：增删（length 变）、尾部追加（末尾变）、
       整体替换（首尾必变）—— 都不需要逐条遍历。
       而 chats 是唯一会长到 2000 条的数组，全量递归 = 每次保存都做一遍
       2000 次字符串拼接，纯粹是浪费。 */
    const q1=n>>2, h=n>>1, q3=(n*3)>>2;
    const idx=[0,1,2,3, q1-2,q1-1,q1,q1+1, h-2,h-1,h,h+1, q3-2,q3-1,q3,q3+1, n-4,n-3,n-2,n-1];
    return "a"+n+"["+idx.map(i=>_cheapSig(v[i],d+1)).join(",")+"]";
  }
  if(typeof v==="object"){ let s="{"; for(const k of Object.keys(v).sort()) s+=k+"="+_cheapSig(v[k],d+1)+";"; return s+"}"; }
  return "u";
}
/* 跳过名单分两类 ——
   ① "大且很少变"：imgs / carousel / sounds / stickers（base64 大对象，一次写盘就是几 MB）
   ② "会越用越大，但只会增删 / 整体替换"：chats / members

   ⚠ msgs（留言板）**故意不进名单**。它同样越长越大，但 checkBoardUnread 会**原地**
     把单条帖子的 read 改成 true —— 而长数组的签名是**采样**的（见 _cheapSig），
     改在非采样点上就抓不到，后果是"已读状态不落盘"。要收它得给原地修改加脏标记，
     那是另一件事，不混进这版。
   其余（cfg / texts / cards / surveys …）又小又常改，全量写。 */
const HEAVY_KEYS = ["imgs","carousel","sounds","stickers","chats","members","chatImgs"];
const _lastSig = {};   /* 进程内记住上次**实际落盘**的签名；刷新页面后为空 → 首存必全量写，安全 */

async function saveAll() {
  if (!DB) return;
  return new Promise(res => {
    try {
      const data = {
        cfg, imgs, texts, cards, chats,
        members: groupMembers, sounds,
        shieldedCats, foldedCats, anniversaries, carousel,
        surveys, surveyRecords, stickers, msgs, chatImgs
      };
      const writes = [];
      for (const [k, v] of Object.entries(data)) {
        if (HEAVY_KEYS.indexOf(k) >= 0) {
          const sig = _cheapSig(v);
          if (_lastSig[k] === sig) continue;   /* 一模一样 → 跳过整块写盘 */
          _lastSig[k] = sig;
        }
        writes.push([k, v]);
      }
      if (!writes.length) { res(); return; }   /* 没有任何变化：连事务都不用开 */
      const t = DB.transaction("kv", "readwrite");
      const s = t.objectStore("kv");
      for (const [k, v] of writes) s.put(v, k);
      t.oncomplete = () => { res(); backupDebounced(); _scheduleSyncPush(); };
      /* ⭕ 写失败时把签名表清空：否则这些键会被当成"已经写过"而永远跳过，
         等于静默丢数据。清空后下一次保存会全量重写。 */
      t.onerror = () => { try{ for(const k in _lastSig) delete _lastSig[k]; }catch(e){} res(); backupDebounced(); _scheduleSyncPush(); };
    } catch { try{ for(const k in _lastSig) delete _lastSig[k]; }catch(e2){} res(); }
  });
}

// Debounced auto-save (300 ms) – avoids a DB write on every keypress
let _saveTimer = null;
function saveAllDebounced() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(saveAll, 300);
}

// ─── localStorage 降级备份 ───
// IndexedDB 万一损坏/被清空时，用这里冗余的最近聊天记录恢复关键数据。
// 只备份文本内容（图片/贴纸/画作替换为占位文本），避免撑爆 localStorage。
const BACKUP_KEY = "cy_moon_backup";
const BACKUP_MSG_MAX   = 200;
const BACKUP_BOARD_MAX = 50;  // ⭕ 应急备份最多带 50 个帖子（各自回复原样带上）
let _backupTimer = null;

function _sanitizeMsgsForBackup(msgs){
  return msgs.slice(-BACKUP_MSG_MAX).map(m=>{
    const c = Object.assign({}, m);
    /* ⭕ v1.15.0：图片本体已挪到 chatImgs（消息里只有 imgId 这个短 id），所以这里
       不该再删任何东西 —— imgId 是**引用锚点**，跟 stickerId 同类。
       真要看图得靠 chatImgs，而应急备份**不备份 chatImgs**（base64 会撑爆 localStorage），
       恢复后图片显示占位图 —— 这是刻意的取舍：应急备份只保证"文字不丢"。
       兼容老数据：万一还有内嵌的 m.image，仍然剥掉（那是真的 base64）。 */
    if(c.image){ c.text = c.text || "[图片消息]"; delete c.image; }
    if(c.imgId){ c.text = c.text || "[图片]"; }
    /* ⭕ 保留 sticker / stickerId：它们只是引用锚点（布尔 + 短 id），不是媒体本体。
       删掉的话恢复出来的聊天里，表情消息会认不出类型、引用行也定位不到原表情。 */
    if(c.sticker){ c.text = c.text || "[表情包]"; }
    /* ⭕ 画作保留 painter/painterSeed：种子即内容（无 base64），几十字节，
       本地备份带上它，恢复后画作才能重绘（与 _stripChatMedia 同一策略）。 */
    if(c.painter){ c.text = c.text || "[画作]"; }
    /* ⭕ 头像同样是 base64（实测单条可达 330KB）—— localStorage 配额只有几 MB，
       不剥掉会把整个应急备份顶爆，连带 chats 一起赔进去 */
    if(c.avatar) delete c.avatar;
    return c;
  });
}

/* ⭕ 留言板也要进应急备份：只取最近若干个帖子，评论原样带上（都是纯文本） */
function _sanitizeBoardForBackup(list){
  return (Array.isArray(list)?list:[]).slice(-BACKUP_BOARD_MAX).map(p=>{
    if(!p || typeof p!=="object") return null;
    const c=Object.assign({}, p);
    if(!Array.isArray(c.comments)) c.comments=[];
    return c;
  }).filter(Boolean);
}

function backupCriticalData(){
  const base={
    ts: Date.now(),
    cfg, texts,
    chats: _sanitizeMsgsForBackup(chats),
    groupMembers, anniversaries, surveys, surveyRecords
  };
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(Object.assign({}, base, { msgs:_sanitizeBoardForBackup(msgs) })));
  } catch(e){
    /* ⭕ 带上留言板可能顶到 localStorage 配额 —— 那就去掉留言板再写一次，
       宁可丢留言板，也别把聊天这些核心数据一起赔进去 */
    try{ localStorage.setItem(BACKUP_KEY, JSON.stringify(base)); }
    catch(e2){
      /* ⭕ 还是超配额：群成员头像是 base64，是这份备份里最占地方的一块，去掉再试。
         宁可备份里没有头像，也别一条都存不下来。 */
      try{
        const lean = Object.assign({}, base, {
          groupMembers: (Array.isArray(groupMembers)?groupMembers:[]).map(m=>Object.assign({}, m, { avatar:"" }))
        });
        localStorage.setItem(BACKUP_KEY, JSON.stringify(lean));
      }catch(e3){}
    }
  }
}
function backupDebounced(){ clearTimeout(_backupTimer); _backupTimer = setTimeout(backupCriticalData, 1500); }
function clearBackup(){ try{ localStorage.removeItem(BACKUP_KEY); }catch(e){} }
function readBackup(){
  try{ const raw=localStorage.getItem(BACKUP_KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; }
}

/* 启动检测：IndexedDB 无聊天数据但存在备份时提示恢复（同一会话只提示一次） */
function tryRestoreBackup(){
  if(sessionStorage.getItem("skip_backup_restore")) return;
  const bk = readBackup();
  if(!bk || !Array.isArray(bk.chats) || !bk.chats.length) return;
  if(chats.length) return;
  const mins = Math.max(1, Math.round((Date.now()-(bk.ts||0))/60000));
  const when = mins<60 ? `${mins} 分钟前` : `${Math.round(mins/60)} 小时前`;
  if(!confirm(`检测到 ${when} 的本地备份（${bk.chats.length} 条聊天记录），而聊天数据为空，可能是 IndexedDB 数据丢失。\n是否恢复备份？`)) {
    sessionStorage.setItem("skip_backup_restore","1");
    return;
  }
  sessionStorage.removeItem("skip_backup_restore");
  if(bk.cfg) cfg = Object.assign(cfg, bk.cfg);
  if(bk.texts) texts = Object.assign(texts, bk.texts);
  if(bk.groupMembers) groupMembers = bk.groupMembers;
  if(bk.anniversaries) anniversaries = bk.anniversaries;
  if(bk.surveys) surveys = bk.surveys;
  if(bk.surveyRecords) surveyRecords = bk.surveyRecords;
  if(bk.msgs){ msgs = bk.msgs; normalizeMsgs(); }
  /* ⚠ v1.15.0 已知行为：应急备份**不含 chatImgs**（base64 会撑爆 localStorage），
     所以恢复出来的图片消息只有 imgId、没有图 → 聊天里显示**占位图**（不是文字气泡）。
     真要恢复完整图片请用「数据 → 导入备份」（fullExport 走的是完整导出）。这是刻意的取舍。 */
  if(Array.isArray(bk.chats)){ chats = bk.chats; markStatsDirty(); }
  syncUI(); renderChats(); renderBoard();
  saveAll().then(()=>toast("已从备份恢复"));
}

// ⭐ 缓存 [data-img] 元素列表，避免每次 syncUI 重新 querySelectorAll
let _dataImgCache = null;

/* ⭕ 首页「不滚动」：把 .l1/.l2 整体等比缩小，正好塞进一屏。
   手机上内容本来就是一屏 → k=1，什么都不做；
   窗口矮（1366×768 只剩 ~640px）或内容变长时才缩。
   缩到 FIT_HOME_MIN 还装不下，才放行滚动 —— 宁可滚，也不裁掉内容。 */
const FIT_HOME_MIN = 0.62;
function fitHomeToScreen(){
  const on = cfg.fitHome !== false;
  document.querySelectorAll(".home-scroll").forEach(box=>{
    const inner = box.firstElementChild;   // .l1 或 .l2
    if(!inner) return;
    inner.style.transform = "";            // 先复位，才量得到真实高度
    if(!on){ box.style.overflowY = ""; return; }
    const avail = box.clientHeight, need = inner.scrollHeight;
    if(!avail || !need) return;            // 没在显示的那一套布局是 display:none，量不到
    if(need <= avail){ box.style.overflowY = "hidden"; return; }
    let k = avail / need;
    if(k < FIT_HOME_MIN){ k = FIT_HOME_MIN; box.style.overflowY = "auto"; }
    else box.style.overflowY = "hidden";
    inner.style.transform = "scale(" + k.toFixed(4) + ")";
  });
}
/* 内容一变（改文案、换图、字号、窗口大小）就重新贴合。
   ResizeObserver 只看布局尺寸，transform 不改尺寸，所以不会自触发循环。 */
let _fitTimer = null, _fitRO = null;
function fitHomeWatch(){
  if(typeof ResizeObserver !== "undefined" && !_fitRO){
    _fitRO = new ResizeObserver(()=>fitHomeToScreen());
    document.querySelectorAll(".home-scroll > *").forEach(el=>_fitRO.observe(el));
  }
  window.addEventListener("resize", ()=>{
    clearTimeout(_fitTimer); _fitTimer = setTimeout(fitHomeToScreen, 120);
  });
}

// ─── syncUI ───
function syncUI() {
  document.getElementById("vp").setAttribute("data-layout", cfg.layout);
  document.getElementById("chatApp").setAttribute("data-chat-style", cfg.chatStyle);
  for(let i=1;i<=4;i++){
    document.querySelector(`.head-style-${i}`)?.classList.toggle("hidden", cfg.chatStyle!==i);
    document.querySelector(`.input-style-${i}`)?.classList.toggle("hidden", cfg.chatStyle!==i);
  }
  document.querySelectorAll(".msg-in").forEach(el=>el.placeholder=cfg.inputPlaceholder||"");
  if (!_dataImgCache) _dataImgCache = Array.from(document.querySelectorAll("[data-img]"));
  _dataImgCache.forEach(el=>{
    const k=el.dataset.img;
    const v = imgs[k] || window.DEFAULTS.PH_SVG;
    /* ⭕ 指纹一致就完全不碰 src。
       给 <img>.src 赋上同一个 base64 字符串，浏览器也会把整串重新解析、重新解码 ——
       而 syncUI() 最高频的触发者正是"改设置"（cfgToggle / setTheme / setLayout / 改字号），
       设置页又有几十个 [data-img]，于是每点一个开关就全量重解码一遍：
       这就是"进设置页调什么都不顺畅"的来源。指纹用 _cheapSig，O(1)，与图片字节数无关。 */
    const sig = _cheapSig(v);
    if(el._imgSig !== sig){ el._imgSig = sig; el.src = v; }
    const has = !!imgs[k];
    if(el._imgHas !== has){
      el._imgHas = has;
      if(has) el.removeAttribute("data-empty"); else el.setAttribute("data-empty","1");
    }
  });
  document.querySelectorAll(".editable").forEach(el=>{
    const k=el.dataset.key; if(!k) return;
    const isCfg=el.dataset.iscfg==="1";
    const src=isCfg?cfg:texts;
    const v=src[k];
    el.innerText=(v!==undefined&&v!=="") ? v : (el.dataset.placeholder||"未定义");
  });
  const _ttsUrl = document.getElementById("cfg_ttsUrl"); if(_ttsUrl) _ttsUrl.value = cfg.ttsUrl || "";
  const _ttsKey = document.getElementById("cfg_ttsKey"); if(_ttsKey) _ttsKey.value = cfg.ttsKey || "";
  const _ttsGroupId = document.getElementById("cfg_ttsGroupId"); if(_ttsGroupId) _ttsGroupId.value = cfg.ttsGroupId || "";
  const _ttsModel = document.getElementById("cfg_ttsModel"); if(_ttsModel) _ttsModel.value = cfg.ttsModel || "";
  const _ttsVoice = document.getElementById("cfg_ttsVoice"); if(_ttsVoice) _ttsVoice.value = cfg.ttsVoice || "";
  const _ttsSpeed = document.getElementById("cfg_ttsSpeed"); if(_ttsSpeed) _ttsSpeed.value = cfg.ttsSpeed || 1.0;
  const _ttsVol = document.getElementById("cfg_ttsVol"); if(_ttsVol) _ttsVol.value = cfg.ttsVol || 1.0;
  const _ttsPrompt = document.getElementById("cfg_ttsPrompt"); if(_ttsPrompt) _ttsPrompt.value = cfg.ttsPrompt || "";
  setSw("sw_ttsPersist", cfg.ttsPersist);
  setSw("sw_autoTTS", cfg.autoTTS);
  setSw("sw_autoTTS_adv", cfg.autoTTS);
  const wTitle=document.getElementById("wTitle");
  const wText=document.getElementById("wText");
  if(wTitle) wTitle.innerText=cfg.welcomeTitle||"";
  if(wText)  wText.innerText=cfg.welcomeText||"";
  setSw("sw_ignoreOn",    cfg.ignoreOn);
setSw("sw_quoteOn",     cfg.quoteOn);
setSw("sw_sentenceJoin",cfg.sentenceJoin);
setSw("sw_activeSend",  cfg.activeSend);
setSw("sw_popupOn",     cfg.popupOn);
setSw("sw_notifOn",     cfg.notifOn);
setSw("sw_soundOn",     cfg.soundOn);
  const _sfxVol = document.getElementById("cfg_sfxVolume"); if(_sfxVol) _sfxVol.value = Math.round((cfg.sfxVolume||0.8)*100);
  const _sfxVal = document.getElementById("sfxVolVal"); if(_sfxVal) _sfxVal.innerText = Math.round((cfg.sfxVolume||0.8)*100)+"%";
setSw("sw_showAvatar",  cfg.showAvatar);
setSw("sw_showName",    cfg.showName);
setSw("sw_showTime",    cfg.showTime);
setSw("sw_showSeconds", cfg.timeShowSeconds);
setSw("sw_oppCustomTime", cfg.oppCustomTime);
setSw("sw_showRead",    cfg.showRead);
setSw("sw_showSelfRead",cfg.showSelfRead);
setSw("sw_showSelfName", cfg.showSelfName);
setSw("sw_groupMode",   cfg.groupMode);
setSw("sw_stickerOn",   cfg.stickerOn);
setSw("sw_painterOn",  cfg.painterOn); // ⭕ 画作开关同步
setSw("sw_songRecOn",  cfg.songRecOn); // ⭕ 推荐歌曲开关同步
setSw("sw_lyricFromCloud", cfg.lyricFromCloud); // ⭕ 歌词取自曲库开关同步
setSw("sw_tradTransOn",  cfg.tradTransOn);      // ⭕ 自动繁体译文开关同步
setSw("sw_recombOn",    cfg.recombOn);          // ⭕ 组字开关同步
setSw("sw_dictOn",      cfg.dictOn);            // ⭕ 云端词典开关同步
setSw("sw_charOn",      cfg.charOn);            // ⭕ 云端汉字表开关同步
setSw("sw_xhyOn",       cfg.xhyOn);             // ⭕ 云端歇后语开关同步
setSw("sw_hideAesBg",  cfg.hideAesBg);
setSw("sw_hidePolarBg",cfg.hidePolarBg);
document.querySelectorAll(".aes-body").forEach(el => el.classList.toggle("hide-bg", !!cfg.hideAesBg));
document.querySelectorAll(".polaroid-strip").forEach(el => el.classList.toggle("hide-bg", !!cfg.hidePolarBg));
document.querySelectorAll(".cs-card").forEach(el =>
  el.classList.toggle("active", +el.dataset.s === cfg.chatStyle)
);
document.querySelectorAll(".tab-switch .ts-opt[data-v]").forEach(el =>
  el.classList.toggle("active", +el.dataset.v === cfg.layout)
);
document.querySelectorAll(".tab-switch .ts-opt[data-theme]").forEach(el =>
  el.classList.toggle("active", el.dataset.theme === cfg.theme)
);
document.querySelectorAll(".av-size-tab").forEach(el =>
  el.classList.toggle("active", el.dataset.v === (cfg.avSize||"s"))
);
document.querySelectorAll(".slayout-opt[data-v]").forEach(el =>
  el.classList.toggle("active", +el.dataset.v === cfg.layout)
);
document.querySelectorAll(".stheme-opt[data-theme]").forEach(el =>
  el.classList.toggle("active", el.dataset.theme === cfg.theme)
);
/* ⭕ 首页「不滚动」开关 */
document.getElementById("vp")?.setAttribute("data-fit", cfg.fitHome===false ? "0" : "1");
setSw("sw_fitHome", cfg.fitHome !== false);
fitHomeToScreen();
// 同步数字显示
  const fsD = document.getElementById("fsDisp");
  const cfD = document.getElementById("chatFsDisp");
  if (fsD) fsD.innerText = cfg.fontSize;
  if (cfD) cfD.innerText = cfg.chatFontSize;

  const dMinEl = document.getElementById("delayMin");
  const dMaxEl = document.getElementById("delayMax");
  const aMinEl = document.getElementById("activeMin");
  const aMaxEl = document.getElementById("activeMax");
  if (dMinEl) dMinEl.value = cfg.delayMin;
  if (dMaxEl) dMaxEl.value = cfg.delayMax;
  if (aMinEl) aMinEl.value = cfg.activeMin;
  if (aMaxEl) aMaxEl.value = cfg.activeMax;
  const rpEl = document.getElementById("replyProb");
  if (rpEl) rpEl.value = cfg.replyProb ?? 60;
  const rpVal = document.getElementById("replyProbVal");
  if (rpVal) rpVal.innerText = (cfg.replyProb ?? 60) + "%";
  const tpEl = document.getElementById("transProb");
  if (tpEl) tpEl.value = (typeof cfg.transProb==="number"?cfg.transProb:50);
  const tpVal = document.getElementById("transProbVal");
  if (tpVal) tpVal.innerText = (typeof cfg.transProb==="number"?cfg.transProb:50) + "%";
  setSw("sw_tradPrimary", cfg.tradPrimary!==false);
  const muEl = document.getElementById("cfg_musicUrl");
  if(muEl) muEl.value = cfg.musicUrl || "";
  // sync active sound display
  if(document.getElementById("modalSndList")) renderModalSoundList();
  applyTheme(); applyFontSize(); applyCustomFont(); applyAvSize();
  applyCustomBubble(); applyChatBg();applyCustomHomeStyles();applyHomeBg(); applyCustomChatCss(); applyAesBodyBg();
  const mmKeyEl = document.getElementById("cfg_minimaxKey");
  if(mmKeyEl) mmKeyEl.value = cfg.minimaxKey || "";
  const mmVoiceEl = document.getElementById("cfg_minimaxVoice");
  if(mmVoiceEl) mmVoiceEl.value = cfg.minimaxVoice || "";
  setSw("sw_autoTTS", cfg.autoTTS);
}

function setSw(id,v){ const el=document.getElementById(id); if(!el)return; v?el.classList.add("on"):el.classList.remove("on"); }

function applyTheme(){
  const isDark=cfg.theme==="dark"||(cfg.theme==="system"&&matchMedia("(prefers-color-scheme:dark)").matches);
  document.documentElement.setAttribute("data-theme",isDark?"dark":"light");
}
function applyAvSize(){
  const m={s:{av:32,col:40},m:{av:40,col:48},l:{av:48,col:56}};
  const v=m[cfg.avSize]||m.s;
  document.documentElement.style.setProperty("--av-size",v.av+"px");
  document.documentElement.style.setProperty("--av-col-w",v.col+"px");
}
function applyFontSize(){
  document.documentElement.style.setProperty("--fs",cfg.fontSize+"px");
  document.documentElement.style.setProperty("--chat-fs",cfg.chatFontSize+"px");
}
function applyCustomFont(){
  const el=document.getElementById("user-font");
  let css="";
  if(cfg.customFontCss){
    css=(cfg.customFontCss.trim().startsWith("@")||cfg.customFontCss.trim().startsWith("/*"))
      ? cfg.customFontCss
      : `@import url("${cfg.customFontCss}");`;
  }
  el.innerHTML=css;
  const fontVar=cfg.customFont ? `${cfg.customFont},"Songti SC","SimSun",serif` : `"Songti SC","SimSun","STSong",serif`;
  document.documentElement.style.setProperty("--font",fontVar);
}
function applyCustomBubble(){
  const raw=(cfg.customBubble||"").trim();
  const el=document.getElementById("user-bubble");
  if(!raw){ el.innerHTML=""; return; }
  // 若粘贴的是带 { } 的完整规则（如 .message-sent{...} / .message::after{...}），原样注入；
  // 否则视为纯属性声明（如 background:red;border-radius:8px;）。
  // 注意：旧版回退选择器只包了一层 ".bubble{}"，特异度低于内置的
  // ".row.self .bubble" / ".row.opp .bubble"（双类选择器），
  // 导致背景色、圆角等关键属性始终被内置规则盖掉——这正是
  // "明明设置了气泡却没有变化" 的根因。这里改用 #chatApp 前缀（ID 选择器）
  // 把特异度抬高到内置规则之上，无需用户自己写 !important 也能生效。
  el.innerHTML = raw.includes("{")
    ? raw
    : `#chatApp .row.self .bubble, #chatApp .row.opp .bubble, #chatApp .bubble { ${raw} }`;
}
function applyCustomChatCss(){ document.getElementById("user-chat-css").innerHTML=cfg.customChatCss||""; }
function applyChatBg(){
  const app=document.getElementById("chatApp");
  const layer=document.getElementById("chatBgLayer");
  if(imgs.chatBg){ layer.style.backgroundImage=`url(${imgs.chatBg})`; app.setAttribute("data-hasbg","1"); }
  else { layer.style.backgroundImage=""; app.setAttribute("data-hasbg","0"); }
}
function applyHomeBg() {
  const layer1 = document.getElementById("homeBgLayer");
  const layer2 = document.getElementById("homeBgLayerL2");
  const homeL1 = document.getElementById("homeL1");
  const homeL2 = document.getElementById("homeL2");

  if (imgs.homeBg) {
    const url = `url(${imgs.homeBg})`;
    if (layer1) layer1.style.backgroundImage = url;
    if (layer2) layer2.style.backgroundImage = url;
    homeL1?.setAttribute("data-hasbg", "1");
    homeL2?.setAttribute("data-hasbg", "1");
  } else {
    if (layer1) layer1.style.backgroundImage = "";
    if (layer2) layer2.style.backgroundImage = "";
    homeL1?.setAttribute("data-hasbg", "0");
    homeL2?.setAttribute("data-hasbg", "0");
  }
}

function applyAesBodyBg() {
  const body = document.querySelector(".aes-body");
  if (!body) return;
  if (imgs.aes_body_bg && !cfg.hideAesBg) {
    body.style.backgroundImage = `url(${imgs.aes_body_bg})`;
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
  } else {
    body.style.backgroundImage = "";
  }
}

// ─── Config setters ───
window.cfgSet    = async(k,v)=>{ cfg[k]=v; await saveAll(); syncUI(); };
/* ⭕ 开关点击的响应速度（v1.15.1 修）
   原来是 `cfg[k]=!cfg[k]; await saveAll(); syncUI();` —— 视觉更新排在
   **等 IndexedDB 写盘**之后，手机端写盘几十~几百 ms，于是"点了没反应，过一下才动"。
   现在改成**乐观更新**：先立刻翻转这个开关本体（O(1)，当帧可见），
   写盘与整体 UI 同步都挪到之后异步做。
   ⛔ 不能只翻转本体就完事 —— 有些开关会影响别处的显示（如 hideAesBg 隐藏背景），
      所以 syncUI() 仍然要跑，只是**不再挡在视觉反馈前面**。
   ⛔ 写盘改用 saveAllDebounced()：连点多个开关只会落一次盘，比原来的逐次 await 更快。

   ⚠ 翻转哪个元素：**从点击事件里取**，不要用 "sw_"+k 拼。
     因为 index.html 里存在两处 id 与 key 不同名的开关：
       id="sw_showSeconds"   ← cfgToggle('timeShowSeconds')
       id="sw_autoTTS_adv"   ← cfgToggle('autoTTS')
     按命名拼接这两个会找不到元素，表现为"点了不动"。
     取 event.target 是最稳的：它就是被点中的 .sw 本身（或里面的 .sw-indicator）。

   ⛔ 全量 syncUI() 的取舍：syncUI 有 136 行（遍历 [data-img]、几十个 setSw、多个 querySelectorAll）。
     云同步那三个开关（syncAuto / syncMedia / syncChatImgs）**压根不在 syncUI 里**，
     跑了也更新不到任何东西 —— 纯浪费一帧。所以把它们列进 SYNC_SW_NO_UI，跳过全量同步。
     ⚠ 其余开关一律照跑 syncUI（hideAesBg / fitHome / hidePolarBg 等确实影响别处显示）。
     ⚠ dictOn / charOn / xhyOn 在 syncUI 里**有**（见 setSw("sw_dictOn")），所以不能进这个名单。 */
const SYNC_SW_NO_UI = ["syncAuto","syncMedia","syncChatImgs"];
window.cfgToggle = (k, ev)=>{
  cfg[k]=!cfg[k];
  /* ① 立即翻转本开关的视觉（当帧生效，点下去就有反应） */
  try{
    let el = ev && ev.currentTarget;
    if(!el && ev && ev.target) el = ev.target.closest ? ev.target.closest(".sw") : null;
    if(!el) el = document.getElementById("sw_"+k);   /* 无事件对象时退回命名约定 */
    if(el) cfg[k] ? el.classList.add("on") : el.classList.remove("on");
  }catch(e){}
  /* ② 其余 UI 同步与落盘都异步做，不阻塞点击反馈。
       云同步那三个开关与全局 UI 无关 → 跳过全量 syncUI，点击反馈更快。 */
  if(SYNC_SW_NO_UI.indexOf(k) < 0) syncUI();
  saveAllDebounced();
  if(k==="activeSend") scheduleActive();
  /* ⭕ 云同步开关：只在面板上即时刷新那行状态文字，不碰别处 */
  if(SYNC_SW_NO_UI.indexOf(k) >= 0){
    const st=document.getElementById("syncStatus");
    if(st && k==="syncChatImgs") st.textContent = cfg.syncChatImgs
      ? "已开启聊天图片同步 · 下次推送会上传全部历史图片" : "聊天图片同步已关闭";
  }
  if(document.getElementById("chatFlow")){
    /* 仅聊天显示相关配置才需重建 DOM，避免非相关开关触发全部重绘 */
    const chatKeys=["showAvatar","showName","showSelfName","showTime","timeShowSeconds","oppCustomTime","showRead","showSelfRead","readText"];
    if(chatKeys.includes(k)) renderChats();
  }
};
/* ⭕ 设置项的统一提速（v1.15.1）——
   与 cfgToggle 同一个坑：`cfg=...; await saveAll(); syncUI();`
   把 UI 更新排在"等 IndexedDB 写盘"之后，手机上点一下要等几十~几百 ms。
   这批函数改成：**先同步做完视觉更新**（setAttr / class 高亮），写盘交给防抖。
   ⛔ 这几项都不会因写盘失败而需要回滚 UI，所以"乐观更新"是安全的。 */
window.setLayout = (v)=>{ cfg.layout=+v; syncUI(); document.querySelectorAll(".tab-switch .ts-opt[data-v]").forEach(el=>el.classList.toggle("active",+el.dataset.v===cfg.layout)); saveAllDebounced(); };
window.setTheme  = (v)=>{ cfg.theme=v; syncUI(); document.querySelectorAll(".tab-switch .ts-opt[data-theme]").forEach(el=>el.classList.toggle("active",el.dataset.theme===cfg.theme)); saveAllDebounced(); };
window.setUiFontSize  = (v)=>{ cfg.fontSize=+v; syncUI(); saveAllDebounced(); };
window.setChatFontSize= (v)=>{ cfg.chatFontSize=+v; syncUI(); saveAllDebounced(); };
window.setAvSize = (v)=>{
  cfg.avSize=v; syncUI();
  document.querySelectorAll(".av-size-tab").forEach(el=>el.classList.toggle("active", el.dataset.v===v));
  saveAllDebounced();
};
window.setChatStyle = v => {
  cfg.chatStyle = +v;
  syncUI();
  renderChats();
  document.querySelectorAll(".cs-card").forEach(el =>
    el.classList.toggle("active", +el.dataset.s === cfg.chatStyle)
  );
  saveAllDebounced();
};

window.toggleNotif    = async()=>{
  if(!cfg.notifOn){ if(!("Notification" in window)){toast("不支持通知");return;} const p=await Notification.requestPermission(); if(p!=="granted"){toast("未授权");return;} }
  cfg.notifOn=!cfg.notifOn; await saveAll(); syncUI();
};
window.resetBg = async()=>{ delete imgs.chatBg; await saveAll(); syncUI(); };

// ─── Editables ───
function bindEditables(){
  document.body.addEventListener("click", e=>{
    // aes-dots: open body bg upload
    if (e.target.closest(".aes-dots")) {
      e.stopPropagation();
      const hasImg = !!imgs.aes_body_bg;
      modal("卡片内背景", `<div class="pill-btn-group">
        <button class="pill-btn" onclick="triggerAesBodyBgPick()">上传背景</button>
        ${hasImg ? `<button class="pill-btn danger" onclick="clearAesBodyBg()">清除背景</button>` : ""}
      </div>`);
      return;
    }
    const el=e.target.closest(".editable"); if(!el) return;
    e.stopPropagation();
    const k=el.dataset.key; if(!k) return;
    const isCfg=el.dataset.iscfg==="1";
    const cur=isCfg?(cfg[k]||""):(texts[k]||"");
    modal("编辑",`<textarea class="fld area" id="m_text">${escapeHtml(cur)}</textarea><button class="pill-btn" onclick="saveText('${k}',${isCfg})">保存</button>`);
  });
}
window.saveText = async(k,isCfg)=>{ const v=document.getElementById("m_text").value; if(isCfg) cfg[k]=v; else texts[k]=v; await saveAll(); syncUI(); closeModal(); if(k==="readText"&&document.getElementById("chatFlow")) renderChats(); };

// ─── Image interactions ───
function bindImageInteractions(){
  let pressTimer=null, startX=0, startY=0, target=null, isLong=false;
  const handler={
    start(ev){ const el=ev.target.closest("[data-img]"); if(!el||el.closest(".row")) return; target=el; isLong=false; const t=ev.touches?ev.touches[0]:ev; startX=t.clientX; startY=t.clientY; pressTimer=setTimeout(()=>{ isLong=true; uploadImg(target.dataset.img); },420); },
    move(ev){ if(!pressTimer) return; const t=ev.touches?ev.touches[0]:ev; if(Math.abs(t.clientX-startX)>8||Math.abs(t.clientY-startY)>8){clearTimeout(pressTimer);pressTimer=null;} },
    end(){ if(pressTimer) clearTimeout(pressTimer); pressTimer=null; if(!isLong&&target) uploadImg(target.dataset.img); target=null; }
  };
  document.body.addEventListener("mousedown",handler.start);
  document.body.addEventListener("touchstart",handler.start,{passive:true});
  document.body.addEventListener("mousemove",handler.move);
  document.body.addEventListener("touchmove",handler.move,{passive:true});
  document.body.addEventListener("mouseup",handler.end);
  document.body.addEventListener("touchend",handler.end);
}


window.uploadImg = k=>{
  if(!k) return; imgPickKey=k; memberPickIdx=-1;
  const hasImg=!!imgs[k];
  modal("画片",`<div class="pill-btn-group"><button class="pill-btn" onclick="triggerImgPick()">更换</button>${hasImg?`<button class="pill-btn danger" onclick="clearImgKey('${k}')">清除</button>`:""}</div>`);
};
window.triggerImgPick = ()=>{ closeModal(); const i=document.getElementById("fpImg"); i.value=""; i.click(); };
window.clearImgKey = async k=>{ delete imgs[k]; await saveAll(); syncUI(); if(k==="selfAvatar"||k==="oppAvatar") refreshIdentityViews(); closeModal(); toast("已清除"); };

// ─── File pickers ───
function bindFilePickers(){
  document.getElementById("fpImg").addEventListener("change",  onPickImg);
  document.getElementById("fpSnd").addEventListener("change",  onPickSnd);
  document.getElementById("fpJson").addEventListener("change", onPickJson);
  document.getElementById("fpCard").addEventListener("change", onPickCardTxt);
  document.getElementById("fpSurvey").addEventListener("change", onPickSurvey);
  document.getElementById("fpSticker").addEventListener("change", onPickSticker);
}

// ⭐ 通用图片压缩：限制宽度+JPEG质量，大幅降低Base64体积
function _compressImg(file, maxW = 800, quality = 0.75) {
  return new Promise((resolve) => {
    if (file.size < 50000) {
      const r = new FileReader();
      r.onload = () => resolve({ data: r.result, origSize: file.size, newSize: r.result.length });
      r.onerror = () => resolve(null);
      r.readAsDataURL(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      if (w <= maxW && file.type !== 'image/png') {
        const r = new FileReader();
        r.onload = () => resolve({ data: r.result, origSize: file.size, newSize: r.result.length });
        r.onerror = () => resolve(null);
        r.readAsDataURL(file);
        return;
      }
      if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const data = canvas.toDataURL('image/jpeg', quality);
      resolve({ data, origSize: file.size, newSize: data.length });
    };
    img.onerror = () => { URL.revokeObjectURL(url); const r = new FileReader(); r.onload = () => resolve({ data: r.result, origSize: file.size, newSize: r.result.length }); r.onerror = () => resolve(null); r.readAsDataURL(file); };
    img.src = url;
  });
}
// ⭐ 表情包压缩：限制最大宽度400px+JPEG质量0.6
function _compressStickerImage(file) {
  return _compressImg(file, 400, 0.6).then(r => r ? r.data : null);
}

/* ─── 头像压缩（专项） ───
   头像在界面里最大只渲染到 ~56px（aes-av / h2-avatar 等），@3x 也就 168px。
   之前头像和背景图共用 _compressImg(f,1200,0.75) —— 1200px 的 JPEG 动辄 200–400KB，
   实测云端 12 条群聊消息里那份 330KB 头像就是从这里来的（占 chats 总体积 99.6%）。
   这里单独给 240px / q0.72 —— 对最大 56px 的渲染尺寸是 4 倍以上超采样，体积掉到 ~17KB。
   ⭕ 不走 _compressImg：那个函数对 <50KB 的文件直接原样透传（PNG 会保持几百 KB），
      而且 PNG 透明区转 JPEG 会变黑 —— 这里统一铺白底后重编码，并始终经过 canvas。 */
const AVATAR_MAX_W = 240, AVATAR_Q = 0.72;

/* ─── 各类图片的「实际显示尺寸」规格表 ───
   上传与老数据重压**共用这一份**，免得两边规格漂移。
   ⭕ 关键前提：`.viewport` 有 max-width:430px —— 整个界面在电脑上也被框在 430px 内，
      所以任何元素的实际渲染宽度都有上界，不会因为屏幕大就变大。据此估值（×3 DPR 上界）：
     · 头像：最大是 .l2-av 88px → 88×3 = 264，取 240（91%，肉眼无差）
     · 拍立得 .polaroid-card 宽 23%（430px 下约 91px）→ 360
     · 叠放照片 .sp-front 62% / .sp-back 72%（12 栅格半宽 ~199px）→ 520
     · .aes-main 100px / .m-cover → 360
   实测（真实备份）：imgs 2380KB → 374KB，降 84.3%。
   ⭕ 没列进来的键（l2_cover / l2_duo / 主题插画 / p1_img 等）沿用原来的 1200px 兜底，
      不在这一轮冒险改。 */
const IMG_SPEC = {
  selfAvatar:[AVATAR_MAX_W,AVATAR_Q], oppAvatar:[AVATAR_MAX_W,AVATAR_Q],
  polar1:[360,0.72], polar2:[360,0.72], polar3:[360,0.72], polar4:[360,0.72],
  l1_p1:[520,0.74], l1_p2:[520,0.74],
  aes_main:[360,0.72], music_cover:[360,0.72],
};
function _compressAvatar(file){
  return new Promise(resolve=>{
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{
      URL.revokeObjectURL(url);
      const out=_drawToJpeg(img, AVATAR_MAX_W, AVATAR_Q);
      resolve(out);
    };
    img.onerror=()=>{ URL.revokeObjectURL(url); resolve(null); };
    img.src=url;
  });
}
/* 把 <img> 按最大宽度等比缩放后编码成 JPEG（铺白底，避免 PNG 透明变黑）。
   任何一步失败都返回 null，由调用方决定退回原图还是报错。 */
function _drawToJpeg(img, maxW, q){
  try{
    let w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
    if(!w||!h) return null;
    if(w>maxW){ h=Math.max(1,Math.round(h*(maxW/w))); w=maxW; }
    const c=document.createElement("canvas"); c.width=w; c.height=h;
    const g=c.getContext("2d"); if(!g) return null;
    g.fillStyle="#ffffff"; g.fillRect(0,0,w,h);
    g.drawImage(img,0,0,w,h);
    return c.toDataURL("image/jpeg", q);
  }catch(e){ return null; }
}
/* 把已有的 dataURL 重新压到 maxW / q；只有确实变小了才返回新值，否则返回 null。
   供老数据一次性重压用（见 _migrateSqueezeImages）。 */
function _squeezeDataUrl(src, maxW, q){
  if(typeof src!=="string" || src.indexOf("data:image/")!==0) return Promise.resolve(null);
  return new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      const out=_drawToJpeg(img, maxW, q);
      resolve(out && out.length < src.length ? out : null);
    };
    img.onerror=()=>resolve(null);
    img.src=src;
  });
}

/* ⭕ 资料一换，已经渲染出来的地方要一起换。
   消息行（_buildMsgRow）和留言板里的头像/昵称是**直接写进 src / innerHTML 的**，
   没有 data-img 属性 —— 所以 syncUI() 那套"按 imgs 注入"的机制碰不到它们。
   不重渲染就会出现"换了新头像，聊天里还挂着旧头像"。
   受影响的来源三种都要管：群成员头像、自己的头像、对方头像。 */
function refreshIdentityViews(){
  /* ⭕ 聊天页不在前台就不重建：切过去时 openApp 会自己 renderChats()。
     这里重建只是白吃一次"最近 150 条消息 + 里面所有图片"的渲染开销，
     表现为在设置页里换一次头像卡一下。 */
  try{
    const app=document.getElementById("chatApp");
    if(app && app.classList.contains("active")) renderChats();
  }catch(e){}
  try{ if(typeof window.renderBoard==="function") window.renderBoard(); }catch(e){}
}

async function onPickImg(e){
  const f=e.target.files[0]; if(!f) return;
  /* ⭕ 用户发送图片消息：只做一次强压缩（显示小图 + 减轻存储），跳过 1200px 压缩 */
  if(imgPickKey==="__chat_image_send__"){
    imgPickKey="";
    const r = await _compressImg(f, 400, 0.65);
    if(!r) return;
    /* ⭕ v1.15.0：图先进 chatImgs 拿一个 imgId，消息里只留这个 id（不再内嵌 base64）。
       这样云同步可以按 imgId 单独传图、单独回填，而消息本身保持很小。 */
    const imgId = _genImgId();
    chatImgs[imgId] = r.data;
    const now=new Date();
    _addChatMsg({sender:"self",text:"[图片]",imgId,time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime(),...(pendingQuote?{quote:pendingQuote}:{})});
    window.clearPendingQuote();
    saveAllDebounced(); appendNewChats();
    const cf=document.getElementById("chatFlow"); if(cf) cf.scrollTop=cf.scrollHeight;
    if(cfg.soundOn) playSoundById(cfg.activeSoundId||"__builtin_thud1__");
    if(navigator.vibrate) navigator.vibrate(18);
    return;
  }

  /* ⭕ 头像单独走专项压缩（240px / q0.72）。
     之前头像和背景图共用 1200px/q0.75，一张就 200–400KB —— 云端那个 330KB 的"头像"就是它。
     头像在界面里最大渲染到 ~56px，240px 是 4 倍以上超采样，足够清晰，体积掉到 ~17KB。 */
  if(imgPickKey==="__memberAvatar__"||imgPickKey==="selfAvatar"||imgPickKey==="oppAvatar"){
    const key=imgPickKey, mi=memberPickIdx;
    imgPickKey=""; memberPickIdx=-1;
    const av=await _compressAvatar(f);
    if(!av){ toast("头像图片无法处理，请换一张","warn"); return; }
    if(key==="__memberAvatar__"){
      if(mi<0||!groupMembers[mi]) return;
      groupMembers[mi].avatar=av; await saveAll(); renderMembers(); refreshIdentityViews(); toast("已更新");
      return;
    }
    imgs[key]=av; await saveAll(); syncUI(); refreshIdentityViews(); toast("已更新");
    return;
  }

  /* ⭕ 轮播 / 马赛克格子按**实际显示尺寸**压，不再一律走 1200px —— 格子只渲染成小方块 */
  if(imgPickKey==="__carousel__"){
    const r=await _compressImg(f,1080,0.72); if(!r) return;
    if(carousel.length >= MAX_CAROUSEL){ toast(`轮播图已达上限 ${MAX_CAROUSEL} 张`,"warn"); return; }
    carousel.push({id:"car"+Date.now(),data:r.data}); await saveAll(); renderCarousel(); renderCarouselManage(); return;
  }
  if(imgPickKey==="__mosaic_new__"){
    const r=await _compressImg(f,400,0.65); if(!r) return;
    if(!imgs.mosaic) imgs.mosaic=[]; if(imgs.mosaic.length<4) imgs.mosaic.push(r.data); await saveAll(); renderMosaic(); return;
  }
  if(imgPickKey.startsWith("__mosaic_")){
    const r=await _compressImg(f,400,0.65); if(!r) return;
    const idx=parseInt(imgPickKey.split("_")[2]);
    if(imgs.mosaic?.[idx]!==undefined){ imgs.mosaic[idx]=r.data; await saveAll(); renderMosaic(); }
    return;
  }

  /* ⭕ 按这张图**实际显示多大**来压（IMG_SPEC 与老数据迁移共用一份规格）；
     表里没有的键沿用 1200px / q0.75 兜底。 */
  const spec = IMG_SPEC[imgPickKey] || [1200, 0.75];
  const result = await _compressImg(f, spec[0], spec[1]);
  if(!result) return;
  const data = result.data;
  /* ⭕ 用户发送图片消息：不污染 imgs 池（已在函数入口提前处理，此处为防御） */
  if(imgPickKey==="__chat_image_send__"){ return; }
  imgs[imgPickKey]=data; await saveAll();
  if(imgPickKey==="aes_body_bg") { applyAesBodyBg(); toast("已更新"); return; }
  syncUI(); toast("已更新");
}

function onPickSnd(e){
  const fs=Array.from(e.target.files); if(!fs.length) return;
  if(sounds.length + fs.length > MAX_SOUNDS){ toast(`音效已达上限 ${MAX_SOUNDS} 个`,"warn"); return; }
  let done=0;
  fs.forEach(f=>{
    const r=new FileReader();
    r.onload=async ev=>{
      sounds.push({id:"s"+Date.now()+done,name:f.name.replace(/\.[^.]+$/,""),data:ev.target.result});
      done++;
      if(done===fs.length){
        await saveAll();
        renderSoundList();
        toast(`已添加 ${fs.length} 个`);
        // Re-open modal if it's open
        if(document.getElementById("modalSndList")) renderModalSoundList();
      }
    };
    r.onerror=()=>{ done++; toast("格式不支持: "+f.name,"warn"); };
    r.readAsDataURL(f);
  });
}

// ─── Sound ───
function makeDullThud1() {
  try {
    const c = getAudioCtx(); /* ⭐ 复用全局 AudioContext，避免每次新建未 resume 的实例导致无声 */
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(getSfxGain());
    o.type = "sine"; o.frequency.setValueAtTime(120, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.28);
    o.start(); o.stop(c.currentTime + 0.28);
  } catch {}
}
function makeDullThud2() {
  try {
    const c = getAudioCtx(); /* ⭐ 同上 */
    const buf = c.createBuffer(1, c.sampleRate * 0.18, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4) * 0.22;
    }
    const src = c.createBufferSource(), g = c.createGain();
    const flt = c.createBiquadFilter(); flt.type = "lowpass"; flt.frequency.value = 200;
    src.buffer = buf; src.connect(flt); flt.connect(g); g.connect(getSfxGain());
    g.gain.setValueAtTime(1, c.currentTime);
    src.start();
  } catch {}
}

const BUILTIN_SOUNDS = [
  { id: "__builtin_thud1__", name: "闷响·低", builtin: true },
  { id: "__builtin_thud2__", name: "闷响·噪", builtin: true }
];

function renderSoundList(){
  const c=document.getElementById("sndList"); if(!c) return;
  c.innerHTML="";
  const all = [...BUILTIN_SOUNDS, ...sounds];
  if(all.length === BUILTIN_SOUNDS.length){
    const tip = document.createElement("div"); tip.className="empty-tip"; tip.innerText="使用内置音效";
    c.appendChild(tip);
  }
  all.forEach((s,i)=>{
    const li=document.createElement("div"); li.className="snd-li";
    const isBuiltin = !!s.builtin;
    const nameEl = document.createElement("span"); nameEl.className="nm";
    if(isBuiltin){
      nameEl.innerText = s.name;
    } else {
      const inp = document.createElement("input");
      inp.value = s.name || "未命名";
      inp.style.cssText = "border:none;background:transparent;font-size:inherit;color:var(--text-mute);width:100%;outline:none;";
      inp.addEventListener("change", async () => {
        sounds[i - BUILTIN_SOUNDS.length].name = inp.value.trim() || "未命名";
        await saveAll(); renderSoundList();
      });
      nameEl.appendChild(inp);
    }
    const ops = document.createElement("div"); ops.className="ops";
    const playBtn = document.createElement("span"); playBtn.innerText="试听";
    playBtn.onclick = () => {
      if(s.id==="__builtin_thud1__") makeDullThud1();
      else if(s.id==="__builtin_thud2__") makeDullThud2();
      else { const a=new Audio(s.data); a.volume=cfg.sfxVolume!==undefined?cfg.sfxVolume:0.8; a.onended=()=>{if(_playingUserAudio===a)_playingUserAudio=null;}; _playingUserAudio=a; a.play().catch(()=>{}); }
    };
    ops.appendChild(playBtn);
    if(!isBuiltin){
      const delBtn = document.createElement("span"); delBtn.className="danger"; delBtn.innerText="删除";
      delBtn.onclick = async() => { sounds.splice(i - BUILTIN_SOUNDS.length, 1); await saveAll(); renderSoundList(); };
      ops.appendChild(delBtn);
    }
    li.appendChild(nameEl); li.appendChild(ops);
    c.appendChild(li);
  });
}
let _playingUserAudio = null; /* 正在播放的用户上传音效 Audio 元素，用于音量同步 */
function playSoundById(id) {
  if (id === "__builtin_thud1__") { makeDullThud1(); return; }
  if (id === "__builtin_thud2__") { makeDullThud2(); return; }
  const s = sounds.find(x => x.id === id);
  if (s) {
    const a = new Audio(s.data);
    a.volume = cfg.sfxVolume !== undefined ? cfg.sfxVolume : 0.8;
    a.onended = ()=>{ if(_playingUserAudio===a) _playingUserAudio=null; };
    _playingUserAudio = a;
    a.play().catch(() => {});
  }
  else makeDullThud1();
}
window.playSnd = i=>{
  if(!sounds[i]) return;
  const a = new Audio(sounds[i].data);
  a.volume = cfg.sfxVolume !== undefined ? cfg.sfxVolume : 0.8;
  a.onended = ()=>{ if(_playingUserAudio===a) _playingUserAudio=null; };
  _playingUserAudio = a;
  a.play().catch(()=>{});
};
window.delSnd  = async i=>{ sounds.splice(i,1); await saveAll(); renderSoundList(); };
function chime(){ playSoundById(cfg.activeSoundId || "__builtin_thud1__"); }
window.testSound = ()=>{ playSoundById(cfg.activeSoundId || "__builtin_thud1__"); };
// ─── 标签页未读标记（document.hidden 时累计，回到前台自动清零）───
// 桌面端浏览器后台标签页通常仍会正常执行 JS（仅节流），
// 因此这是对移动端系统通知的有效补充：切走窗口也能在标签标题上看见未读数。
let _bgUnread = 0;
const _baseTitle = document.title;
function bumpBgUnread(){
  if(!document.hidden) return;
  _bgUnread++;
  document.title = `(${_bgUnread}) ${_baseTitle}`;
}
document.addEventListener("visibilitychange", () => {
  if(!document.hidden && _bgUnread > 0){ _bgUnread = 0; document.title = _baseTitle; }
});

async function notify(text,name,avatar){
  if(cfg.soundOn) window.testSound();
  bumpBgUnread();
  if(!(document.hidden&&cfg.notifOn&&Notification.permission==="granted")) return;
  const opts={body:text,icon:avatar||window.DEFAULTS.PH_SVG,silent:true};
  try{
    // 移动端浏览器（几乎全部）不支持 new Notification() 直接调用，
    // 会抛出 "Illegal constructor" 而被原来的 catch{} 静默吞掉——
    // 必须通过 Service Worker 派发才能在安卓 / 大多数移动端正常显示通知。
    const reg=_swReg||(navigator.serviceWorker&&await navigator.serviceWorker.getRegistration());
    if(reg&&reg.showNotification){ await reg.showNotification(name||"温语",opts); return; }
    new Notification(name||"温语",opts);
  }catch{}
}

// ─── Anniversary ───
function calcDays(date,mode){
  const t=new Date(date+"T00:00:00").getTime();
  const now=new Date(); now.setHours(0,0,0,0);
  return Math.max(0,Math.round((mode==="until"?t-now.getTime():now.getTime()-t)/86400000));
}
window.openAnniEdit = ()=>{
  const a=anniversaries[0]||{title:"未定义",date:new Date().toISOString().slice(0,10),mode:"since"};
  modal("纪念日",`<input class="fld" id="m_anni_title" value="${escapeHtml(a.title)}" placeholder="纪念词"><input class="fld" type="date" id="m_anni_date" value="${escapeHtml(a.date)}"><select class="fld" id="m_anni_mode"><option value="since" ${a.mode==="since"?"selected":""}>已经过了</option><option value="until" ${a.mode==="until"?"selected":""}>距离还有</option></select><button class="pill-btn" onclick="saveAnniEdit()">确认</button>`);
};
window.saveAnniEdit = async()=>{
  anniversaries[0]={id:"a1",title:document.getElementById("m_anni_title").value.trim(),date:document.getElementById("m_anni_date").value,mode:document.getElementById("m_anni_mode").value};
  await saveAll(); initAnniCard(); closeModal(); toast("已更新");
};
function initAnniCard(){
  const a=anniversaries[0]; if(!a) return;
  const days=calcDays(a.date,a.mode);
  const counter=document.getElementById("anniDaysMain"); if(counter) counter.innerText=days;
  const label=document.querySelector('[data-key="anni_label"]');
  if(label) label.innerText=(a.title&&a.title!=="")? a.title:"未定义";
}

// ─── Opp Time ───
function genOppTime(){
  const h=Math.floor(Math.random()*24), m=Math.floor(Math.random()*60);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}
function getOppDisplayTime(){
  if(!cfg.oppTime) return "";
  const [bh,bm]=cfg.oppTime.split(":").map(Number);
  const base=bh*3600+bm*60;
  const elapsed=cfg.oppTimeSetAt?Math.floor((Date.now()-cfg.oppTimeSetAt)/1000):0;
  const total=base+elapsed;
  const h=Math.floor(total/3600)%24, m=Math.floor((total%3600)/60), s=total%60;
  if(cfg.timeShowSeconds)
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}
let _oppTimeTicker=null;
function startOppTimeTicker(){
  if(_oppTimeTicker) return;
  _oppTimeTicker=setInterval(()=>{
    if(!cfg.showTime||!cfg.oppTime) return;
    const val=getOppDisplayTime();
    document.querySelectorAll(".opp-time-val").forEach(el=>{ el.textContent=val; });
  },1000);
}
function initOppTime(){
  const today=new Date().toISOString().slice(0,10);
  if(!cfg.oppTime||cfg.oppTimeDate!==today){
    cfg.oppTime=genOppTime(); cfg.oppTimeDate=today; cfg.oppTimeSetAt=Date.now(); saveAll();
  } else if(!cfg.oppTimeSetAt){
    cfg.oppTimeSetAt=Date.now(); saveAll();
  }
  startOppTimeTicker();
}
window.openOppTimeModal=()=>{
  const t=getOppDisplayTime();
  modal("时刻",`<div class="opp-time-modal"><div class="otm-clock">${escapeHtml(t)}</div><div id="otm-status" class="otm-status"></div><div class="otm-actions"><button class="pill-btn" onclick="rerollOppTime()">重新随机</button><button class="pill-btn ghost" id="otm-req-btn" onclick="requestOppTimeChange()">请求修改</button></div></div>`);
};
window.rerollOppTime=async()=>{
  cfg.oppTime=genOppTime(); cfg.oppTimeSetAt=Date.now(); await saveAll(); renderChats(); closeModal(); toast("时刻已更新");
};
window.requestOppTimeChange=()=>{
  const btn=document.getElementById("otm-req-btn");
  const status=document.getElementById("otm-status");
  if(btn){btn.disabled=true;btn.style.opacity=".35";}
  if(status)status.innerText="等待回应中…";
  setTimeout(async()=>{
    const ok=Math.random()>0.38;
    if(ok){
      cfg.oppTime=genOppTime(); cfg.oppTimeSetAt=Date.now(); await saveAll(); renderChats(); closeModal(); toast("对方同意了");
    }else{
      if(status)status.innerText="对方拒绝了";
      if(btn){btn.disabled=false;btn.style.opacity="";btn.innerText="再试一次";}
    }
  },1300+Math.random()*900);
};

// ─── Carousel ───
function renderCarousel(){
  const c=document.getElementById("l2Car"); if(!c) return;
  c.innerHTML="";
  const list=carousel.length?carousel:[{id:"def1",data:""}];
  list.forEach(it=>{ const img=document.createElement("img"); img.className="ci ph"; if(it.data){img.src=it.data;img.removeAttribute("data-empty");}else{img.src=window.DEFAULTS.PH_SVG;img.setAttribute("data-empty","1");} c.appendChild(img); });
}
window.addCarouselImg = ()=>{ imgPickKey="__carousel__"; memberPickIdx=-1; document.getElementById("fpImg").value=""; document.getElementById("fpImg").click(); };
function renderCarouselManage(){
  const c=document.getElementById("carManage"); if(!c) return; c.innerHTML="";
  if(!carousel.length){c.innerHTML=`<div class="empty-tip">暂无轮播图</div>`;return;}
  carousel.forEach((it,i)=>{ const d=document.createElement("div"); d.className="manage-row"; d.innerHTML=`<img src="${it.data}" class="manage-thumb"><span class="manage-label">画片 ${i+1}</span><span class="manage-del" onclick="delCarImg('${it.id}')">删除</span>`; c.appendChild(d); });
}
window.delCarImg = async id=>{ carousel=carousel.filter(x=>x.id!==id); await saveAll(); renderCarousel(); renderCarouselManage(); };

// ─── Mosaic ───
function renderMosaic(){
  const w=document.getElementById("mosaicWidget"); if(!w) return;
  const list=imgs.mosaic||[];
  w.setAttribute("data-count",Math.min(list.length,4)); w.innerHTML="";
  list.slice(0,4).forEach((src,i)=>{ const img=document.createElement("img"); img.className="mos-item ph"; img.src=src; img.onclick=()=>{ imgPickKey=`__mosaic_${i}__`; document.getElementById("fpImg").click(); }; w.appendChild(img); });
  if(list.length<4){ const add=document.createElement("div"); add.className="mos-add"; add.innerHTML=`<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`; add.onclick=()=>addMosaicImg(); w.appendChild(add); w.setAttribute("data-count",list.length+1); }
}
window.addMosaicImg = ()=>{ imgPickKey="__mosaic_new__"; document.getElementById("fpImg").value=""; document.getElementById("fpImg").click(); };
function bindMosaicLongPress(){ const w=document.getElementById("mosaicWidget"); if(!w) return; let timer=null; w.addEventListener("touchstart",e=>{ if(e.target.closest(".mos-add"))return; timer=setTimeout(()=>{w.classList.toggle("merged");w.classList.toggle("split");},600); },{passive:true}); w.addEventListener("touchend",()=>{if(timer)clearTimeout(timer);}); w.addEventListener("touchmove",()=>{if(timer)clearTimeout(timer);}); }

// ─── Chat rendering ───
// renderedMsgCount / renderedLastDate track what's already in the live DOM so that
// a normal new-message send/reply can just append the delta instead of tearing
// down and rebuilding every bubble each time (which was the cause of the visible
// "jump"/flash on every send, and needless work on long chats).
let renderedMsgCount=0, renderedLastDate="";
/* ⭐ 懒加载窗口：chats 全量在内存，DOM 只渲染 [renderStart, chats.length)，
   首屏渲染最近 INITIAL_RENDER 条，滚动到顶部时每次再补 LOAD_BATCH 条更早历史 */
let renderStart = 0;
const INITIAL_RENDER = 150;
const LOAD_BATCH = 80;
let _loadingOlder = false;
let _lastLoadOlder = 0;

// ⭐ 统计缓存：避免每次打开统计页都对 chats 做 6+ 次全量 filter/forEach
let _statsCache=null, _statsDirty=true;
function markStatsDirty(){ _statsDirty=true; }
function computeStatsCache(){
  if(!_statsDirty && _statsCache) return _statsCache;
  const selfMsgs=[], oppMsgs=[], lyricMsgs=[], allReal=[];
  let selfChars=0, oppChars=0;
  const hours=new Array(24).fill(0);
  const dateMap={};
  for(let i=0;i<chats.length;i++){
    const c=chats[i]; const tLen=(c.text||"").length; const isLyric=!!c.lyric;
    if(!isLyric){
      allReal.push(c);
      if(c.sender==="self"){ selfMsgs.push(c); selfChars+=tLen; }
      else if(c.sender==="opp"){ oppMsgs.push(c); oppChars+=tLen; }
    } else { lyricMsgs.push(c); }
    if(c.ts) hours[new Date(c.ts).getHours()]++;
    if(c.date) dateMap[c.date]=(dateMap[c.date]||0)+1;
  }
  const avgLen=allReal.length?Math.round((selfChars+oppChars)/allReal.length):0;
  const longestMsg=allReal.length?allReal.reduce((a,b)=>((b.text||"").length>(a.text||"").length?b:a),allReal[0]):null;
  _statsCache={selfMsgs,oppMsgs,lyricMsgs,allReal,selfChars,oppChars,avgLen,hours,dateMap,
    firstDate:allReal.length?allReal[0].date:null,
    lastDate:allReal.length?allReal[allReal.length-1].date:null,
    longestMsg,shieldedCards:cards.filter(c=>c.shielded).length};
  _statsDirty=false; return _statsCache;
}

function buildChatCtx(){
  return {
    showAv: cfg.showAvatar, showRead: cfg.showRead, showSelfRead: cfg.showSelfRead,
    selfName: cfg.showSelfName, showTime: cfg.showTime, withSec: cfg.timeShowSeconds,
    selfNm: texts.l1_name||texts.l2_name||"我",
    oppNm: texts.opp_name||"温语",
    readTxt: cfg.readText||"已阅",
    selfAv: imgs.selfAvatar||window.DEFAULTS.PH_SVG,
    oppAv: imgs.oppAvatar||window.DEFAULTS.PH_SVG,
    /* ⭐ 预建 Map 消除每条消息的 O(n) linear find */
    memMap: new Map(groupMembers.map(g=>[g.id,g])),
    stkMap: new Map(stickers.map(s=>[s.id,s])),
  };
}

// 只构建消息 DOM 行，不附加到父节点（由调用方决定插入方式）。
// 返回创建的 DOM 元素（普通消息为 div.row，歌词为 div.row.lyric）。
/* ─── 引用行渲染 ───
   quote 现在是 {mid, from, text, kind}；老数据是纯字符串，由 getQuoteInfo 降级处理。
   预览内容按被引用消息的真实类型生成：图片/表情包出缩略图，歌曲出 ♪ 歌名，其余出文本。
   被引用消息已被删除时降级为兜底文本并标注「（已删除）」。 */
function quoteLineHtml(q){
  const qi=getQuoteInfo(q); if(!qi) return "";
  const tgt = qi.mid ? chats.find(c=>c.mid===qi.mid) : null;
  const kind = tgt ? _msgKind(tgt) : (qi.kind||"text");
  let thumb="", txt="";
  if(tgt){
    /* ⭕ 缩略图带 data-view：点缩略图直接看原图（比"跳过去再看"少一步），
       点引用行其余区域才是跳到原消息 —— 见 bindChatDelegation 的 click 分支。 */
    if(kind==="image")       { thumb=`<img class="qthumb" data-view="1" src="${tgt.image?escapeHtml(tgt.image):resolveChatImg(tgt.imgId)}" alt="" title="点击查看原图" onerror="this.style.display='none'">`; txt="[图片]"; }
    else if(kind==="sticker"){ thumb=`<img class="qthumb round" data-view="1" src="${escapeHtml(resolveStickerSrc(tgt.stickerId))}" alt="" title="点击查看原图" onerror="this.style.display='none'">`; txt="[表情包]"; }
    else if(kind==="painter"){ txt="[画作]"; }
    else if(kind==="song")   { txt="♪ "+(tgt.songName||"未知曲目"); }
    else if(kind==="lyric")  { txt=tgt.text||"[歌词]"; }
    else                     { txt=tgt.text||""; }
  }else{
    /* 原消息不见了：用快照兜底 */
    txt = (kind==="song"&&qi.text) ? "♪ "+qi.text : (qi.text || QUOTE_LABEL[kind] || "");
    if(txt) txt += "（已删除）";
  }
  if(!txt && !thumb) return "";
  /* ⭕ 文本兜底只在"纯文本类"引用上用。
     图片/表情包消息的 text 是同一个占位串（"[图片]"/"[表情包]"），
     一旦 mid 失效（老数据 / 被裁剪），按 text 找会跳到**第一条**同类消息上 —— 指错人。
     这类引用宁可只靠 mid 定位，定位不到就什么都不跳，也不跳错。 */
  const jumpText = (kind==="text"||kind==="lyric") ? (qi.text||"") : "";
  return `<div class="quote-line" data-mid="${escapeHtml(qi.mid)}" data-kind="${escapeHtml(kind)}" data-jump="${escapeHtml(jumpText)}"><div class="qarm"></div>${thumb}<div class="qtxt">${escapeHtml(txt)}</div></div>`;
}

function _buildMsgRow(m, idx, ctx){
  if(m.lyric){
    const row=document.createElement("div"); row.className="row lyric"; row.id=`msg-row-${idx}`;
    /* ⭕ 分享提示：显示彼的昵称，群聊模式下则是当时的发言成员名 */
    const who=escapeHtml(m.name||texts.opp_name||"对方");
    row.innerHTML=`<div class="l-c"><div class="l-from">${who} 分享了歌词</div><div class="l-line">${escapeHtml(m.text)}</div>${m.translation?`<span class="l-tr">${escapeHtml(m.translation)}</span>`:""}</div>`;
    return row;
  }
  const isSelf=m.sender==="self";
  const row=document.createElement("div"); row.className="row "+(isSelf?"self":"opp"); row.id=`msg-row-${idx}`;
  const av=isSelf?ctx.selfAv:(m.memberId ? ((ctx.memMap.get(m.memberId)||{}).avatar||ctx.oppAv) : (m.avatar||ctx.oppAv));
  const nm=isSelf?ctx.selfNm:(m.name||ctx.oppNm);
  const showNm = isSelf ? ctx.selfName : cfg.showName;
  let timeStr="";
  if(ctx.showTime&&m.time&&(isSelf||!cfg.oppCustomTime)) timeStr=ctx.withSec&&m.timeWithSec?m.timeWithSec:m.time;
  const isAvStyle=cfg.chatStyle===2||cfg.chatStyle===4;
  const showOppTime=ctx.showTime&&!isSelf&&cfg.oppCustomTime&&!!cfg.oppTime;
  const oppTimeVal=showOppTime?getOppDisplayTime():"";
  const oppTimeSpan=showOppTime?`<span class="opp-time-val" onclick="event.stopPropagation();openOppTimeModal()">${oppTimeVal}</span>`:"";
  const avItems=[];
  if(timeStr) avItems.push(timeStr);
  if(oppTimeSpan&&isAvStyle) avItems.push(oppTimeSpan);
  if(ctx.showRead&&isSelf) avItems.push(ctx.readTxt);
  if(ctx.showSelfRead&&!isSelf) avItems.push(ctx.readTxt);
  const avMetaHtml=avItems.length?`<div class="av-meta">${avItems.join("<br>")}</div>`:"";
  const rowItems=[];
  if(timeStr) rowItems.push(timeStr);
  if(oppTimeSpan&&!isAvStyle) rowItems.push(oppTimeSpan);
  if(ctx.showRead&&isSelf) rowItems.push(ctx.readTxt);
  if(ctx.showSelfRead&&!isSelf) rowItems.push(ctx.readTxt);
  const stackMetaHtml=rowItems.length?`<div class="row-meta">${rowItems.join(" · ")}</div>`:"";
  const quoteHtml=quoteLineHtml(m.quote);
  /* ⭕ 繁体为主：这条消息的繁体是自动转换器生成的（tradAuto）时，正文直接显示繁体，
     简体原文退到点击才展开的那一行。只作用于自动生成的译文 —— 用户手写的译文（如英文）
     不能当正文，所以必须靠 tradAuto 标记区分开。歌词走 .l-tr，不受影响。 */
  const tradPrimary = !!(cfg.tradPrimary!==false && m.tradAuto && m.translation);
  const mainText = tradPrimary ? m.translation : m.text;
  const subText  = tradPrimary ? m.text : m.translation;
  const transClass=openTrans.has(idx)?"show":"";
  const bodyHtml = m.sticker
    ? `<img class="sticker-msg clickable-media" data-idx="${idx}" src="${resolveStickerSrc(m.stickerId)}" loading="lazy" onclick="window._openImageModal(this.src)" onerror="this.src='${window.DEFAULTS.PH_SVG}'">`
    /* ⭕ 图片消息：用户上传 / bot 随机发的独立图片消息类型。
       v1.15.0 起图存 chatImgs、消息只留 imgId；老数据仍可能是内嵌的 m.image —— 两种都认。
       查不到图（例如同步还没把图带过来）时 resolveChatImg 返回 PH_SVG 占位图，
       ⛔ 而不是退化成文字 —— 占位图能点开、能看出"这里本来有张图"，比灰字气泡有用。 */
    : (m.image || m.imgId)
    ? `<img class="image-msg clickable-media" data-idx="${idx}" src="${m.image?escapeHtml(m.image):resolveChatImg(m.imgId)}" loading="lazy" onclick="window._openImageModal(this.src)" onerror="this.parentElement.classList.add('img-broken')">`
    /* ⭕ painter 画作消息：iframe 嵌入远端 cy-painter，透传 seed/auto=1/embed=1/mode=chat */
    : m.painter
    /* ⭕ click 透传 seed → 弹窗复用同一个 iframe（同源 URL，无需额外请求/存储） */
    ? `<div class="painter-frame-wrap" data-painter-seed="${escapeHtml(m.painterSeed||'0')}" onclick="window._openPainterModal(this.dataset.painterSeed)"><iframe class="painter-frame" sandbox="allow-scripts allow-same-origin" src="${escapeHtml(cfg.painterUrl)}?seed=${escapeHtml(m.painterSeed||'0')}&auto=1&embed=1&mode=chat" loading="lazy"></iframe></div>`
    /* ⭕ 推荐歌曲卡片：封面音符 + 歌名/歌手 + 播放标记，点击立即播放这一首 */
    : m.song
    ? `<div class="song-card" data-idx="${idx}" onclick="window.playMsgSong(${idx})">
         <div class="song-cover"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
         <div class="song-info">
           <div class="song-title">${escapeHtml(m.songName||"未知曲目")}</div>
           <div class="song-artist">${escapeHtml(m.songArtist||"—")}</div>
         </div>
         <div class="song-badge">${m.songUrl?"立即播放":"无音源"}</div>
       </div>`
    : `<div class="bubble message ${isSelf?"message-sent":"message-received"}" data-idx="${idx}">${escapeHtml(mainText).replace(/\n/g,"<br>")}</div>
      ${subText?`<div class="bubble-translation ${transClass}" id="trans-${idx}">${escapeHtml(subText)}</div>`:""}`;
  row.innerHTML=`
    ${ctx.showAv?`<div class="av-col"><img class="av" src="${av}" loading="lazy" decoding="async">${avMetaHtml}</div>`:""}
    <div class="stack">
      ${showNm?`<div class="name-tag">${escapeHtml(nm)}</div>`:""}
      ${bodyHtml}
      ${quoteHtml}${stackMetaHtml}
    </div>`;
  return row;
}

// 完整构建：日期分割线 + 消息行，append 到 frag 末尾（供 appendNewChats 用）
function buildMsgInto(frag, m, idx, ctx, lastDateRef){
  if(m.date&&m.date!==lastDateRef.v){ const d=document.createElement("div"); d.className="dt-div"; d.innerHTML=`<span class="dt-text">${escapeHtml(m.date)}</span>`; frag.appendChild(d); lastDateRef.v=m.date; }
  frag.appendChild(_buildMsgRow(m, idx, ctx));
}

/* ⭕ 进聊天页的脏检查（v1.13.0）。
   closeApp 只是 classList.remove("active")，聊天 DOM 一条都没删；
   而 openApp("chatApp") 却每次都 renderChats() —— 先 innerHTML="" 再重建最近 150 条。
   DOM 明明还在却白删白建，这就是"点进聊天界面慢"的主因。

   _chatViewSig 记录「当前 DOM 反映的是哪个状态」。只放"会改变消息外观"的量，
   刻意**不含** renderStart / renderedMsgCount：那两个是窗口位置，用户翻过历史后会变，
   但那不该触发重建 —— 保留窗口位置正是这次改动的附带收益。

   ⚠ 方向要保守：宁可签名过时（多重建一次，等同旧行为），
     也不要在 DOM 其实没更新时刷新签名（那会显示陈旧内容）。 */
let _chatViewSig = null;
function _chatViewSigNow(){
  const n=chats.length, last=n?chats[n-1]:null;
  return [
    n,
    last?(last.mid||""):"",                  /* 新消息 / 整体替换：末条 id 必变 */
    last?(last.text?last.text.length:0):"",  /* 兜住"末条被改写但不改长度" */
    (imgs.selfAvatar||"").length,
    (imgs.oppAvatar||"").length,
    groupMembers.length,
    stickers.length,
    cfg.showAvatar?1:0, cfg.showName?1:0, cfg.showSelfName?1:0,
    cfg.showTime?1:0, cfg.timeShowSeconds?1:0, cfg.oppCustomTime?1:0,
    cfg.showRead?1:0, cfg.showSelfRead?1:0,
    cfg.chatStyle||0, cfg.groupMode?1:0,
    cfg.tradTransOn?1:0, cfg.painterOn?1:0,
    /* ⭕ v1.15.0：chatImgs 的**条目数**也要进签名。
       否则"图片到了但 chats 数组没变"（同步补图、或强拉补图）时签名相同 →
       切进聊天页会复用旧 DOM，图还停在占位图上，直到下次重建才出现。 */
    Object.keys(chatImgs).length,
    texts.readText||"",
  ].join("|");
}
/* 特征一致且 DOM 非空 → 可以复用，不必重建 */
function chatViewIsFresh(){
  const f=document.getElementById("chatFlow");
  return !!f && !!f.firstChild && _chatViewSig===_chatViewSigNow();
}

// 窗口化重建：只渲染最近 INITIAL_RENDER 条，从最新到最旧分块渲染，第一个 chunk 立刻显示最新消息
let _chatRenderInProgress=false;
function renderChats(){
  const f=document.getElementById("chatFlow"); if(!f) return;
  _chatRenderInProgress=true;
  const ctx=buildChatCtx();
  f.innerHTML="";
  const CHUNK=25, total=chats.length;
  const startTarget=Math.max(total-INITIAL_RENDER, 0);
  renderStart=startTarget;
  let cursor=total; /* 从尾部开始，最旧的最先 0，最新的在 N-1 */
  (function renderChunk(){
    const frag=document.createDocumentFragment();
    const start=Math.max(cursor-CHUNK, startTarget);
    /* 块内从最新→最旧遍历，prepend 到 frag 头部，维持 oldest-top / newest-bottom */
    for(let i=cursor-1;i>=start;i--){
      const m=chats[i];
      /* 日期分割线：当前消息日期 ≠ 前一条（i-1）日期时插入，同时窗口首条必显 */
      if(i===startTarget||m.date!==chats[i-1].date){
        const d=document.createElement("div"); d.className="dt-div";
        d.innerHTML=`<span class="dt-text">${escapeHtml(m.date)}</span>`;
        frag.insertBefore(d, frag.firstChild);
      }
      /* 行 prepend 到 frag 头部 */
      frag.insertBefore(_buildMsgRow(m,i,ctx), frag.firstChild);
    }
    /* 整个块 prepend 到 #chatFlow → 旧块在上，新块在下 */
    f.insertBefore(frag, f.firstChild);
    cursor=start;
    if(cursor>startTarget){ requestAnimationFrame(renderChunk); return; }
    _chatRenderInProgress=false;
    f.scrollTop=f.scrollHeight;
    renderedMsgCount=total; renderedLastDate=chats[total-1]&&chats[total-1].date||"";
    unreadCount=0; updateScrollBot();
    _flushPendingChatOps(f);
    _chatViewSig=_chatViewSigNow();   /* ⭕ DOM 已是最新 → 记下特征，下次进页面可直接复用 */
  })();
}

/* ⭐ 懒加载：滚动到顶部时向前补一批更早的消息，保持视口内容不跳动 */
function loadOlderChats(){
  if(_chatRenderInProgress||_loadingOlder||renderStart<=0) return;
  _loadingOlder=true;
  try{
    const f=document.getElementById("chatFlow"); if(!f) return;
    const ctx=buildChatCtx();
    const newStart=Math.max(renderStart-LOAD_BATCH, 0);
    const frag=document.createDocumentFragment();
    /* lastDateRef 以窗口首条日期为初值：只有日期不同于该值时块内才插入分割线 */
    let lastDateRef={v: chats[renderStart]&&chats[renderStart].date||""};
    for(let i=newStart;i<renderStart;i++) buildMsgInto(frag, chats[i], i, ctx, lastDateRef);
    /* 交界日期相同则移除旧首条分割线，避免重复 */
    const oldFirst=f.firstElementChild;
    if(oldFirst&&oldFirst.classList.contains("dt-div")&&chats[renderStart]&&chats[renderStart].date===chats[renderStart-1].date) oldFirst.remove();
    const prevH=f.scrollHeight;
    f.insertBefore(frag, f.firstChild);
    renderStart=newStart;
    f.scrollTop+=f.scrollHeight-prevH; /* 补偿新增高度，视口内容不跳动 */
  } finally { _loadingOlder=false; }
}

/* ⭐ 跳转前补渲染：确保目标消息（可能早于当前窗口）已进入 DOM */
function renderTo(targetIdx){
  const f=document.getElementById("chatFlow"); if(!f) return;
  if(targetIdx>=renderStart) return;
  const ctx=buildChatCtx();
  const newStart=Math.max(targetIdx,0);
  if(newStart>=renderStart) return;
  const frag=document.createDocumentFragment();
  let lastDateRef={v: chats[renderStart]&&chats[renderStart].date||""};
  for(let i=newStart;i<renderStart;i++) buildMsgInto(frag, chats[i], i, ctx, lastDateRef);
  const oldFirst=f.firstElementChild;
  if(oldFirst&&oldFirst.classList.contains("dt-div")&&chats[renderStart]&&chats[renderStart].date===chats[renderStart-1].date) oldFirst.remove();
  const prevH=f.scrollHeight;
  f.insertBefore(frag, f.firstChild);
  renderStart=newStart;
  f.scrollTop+=f.scrollHeight-prevH;
}
let _pendingChatOps=null;
function _flushPendingChatOps(f){
  if(!_pendingChatOps) return;
  _pendingChatOps(f); _pendingChatOps=null;
}

// Incremental append — used on ordinary new-message events (send / reply / sticker).
// Only builds DOM for the messages added since the last render, and only
// autoscrolls if the user was already at (or near) the bottom, so the view
// doesn't visibly jerk on every message the way a full rebuild does.
function appendNewChats(){
  const f=document.getElementById("chatFlow"); if(!f) return;
  /* 分帧渲染进行中——新消息已在 chats 中，当前 render 会自动拾取 */
  if(_chatRenderInProgress) return;
  if(renderedMsgCount===0||renderedMsgCount>chats.length){ renderChats(); return; }
  if(renderedMsgCount===chats.length) return;
  const wasNear = f.scrollHeight-f.scrollTop-f.clientHeight<80;
  const ctx=buildChatCtx();
  const frag=document.createDocumentFragment();
  const lastDateRef={v:renderedLastDate};
  for(let idx=renderedMsgCount; idx<chats.length; idx++) buildMsgInto(frag,chats[idx],idx,ctx,lastDateRef);
  f.appendChild(frag);
  renderedMsgCount=chats.length; renderedLastDate=lastDateRef.v;
  if(wasNear) f.scrollTop=f.scrollHeight;
  unreadCount=0; updateScrollBot();
  _chatViewSig=_chatViewSigNow();   /* ⭕ 增量追加后 DOM 也是最新的 */
}

/* ⭐ 以下两个函数改为事件委托（bindChatDelegation），不再逐气泡绑定事件
function bindBubbleEvents(row,idx){
  const b=row.querySelector(".bubble"); if(!b) return;
  let pressTimer=null, isLong=false, startX=0, startY=0;
  const start=ev=>{ isLong=false; const t=ev.touches?ev.touches[0]:ev; startX=t.clientX; startY=t.clientY; pressTimer=setTimeout(()=>{isLong=true;if(navigator.vibrate)navigator.vibrate(22);showCtxMenu(b,idx);},520); };
  const move=ev=>{ const t=ev.touches?ev.touches[0]:ev; if(Math.abs(t.clientX-startX)>8||Math.abs(t.clientY-startY)>8){if(pressTimer)clearTimeout(pressTimer);pressTimer=null;} };
  const end=ev=>{ if(pressTimer)clearTimeout(pressTimer); pressTimer=null; if(!isLong){ev.preventDefault();toggleTrans(idx);} };
  b.addEventListener("mousedown",start); b.addEventListener("mouseup",end); b.addEventListener("mousemove",move);
  b.addEventListener("touchstart",start,{passive:true}); b.addEventListener("touchend",end); b.addEventListener("touchmove",move,{passive:true});
  b.addEventListener("contextmenu",e=>{e.preventDefault();showCtxMenu(b,idx);});
}

function bindStickerEvents(row,idx){
  const b=row.querySelector(".sticker-msg"); if(!b) return;
  let pressTimer=null, isLong=false, startX=0, startY=0;
  const start=ev=>{ isLong=false; const t=ev.touches?ev.touches[0]:ev; startX=t.clientX; startY=t.clientY; pressTimer=setTimeout(()=>{isLong=true;if(navigator.vibrate)navigator.vibrate(22);showCtxMenu(b,idx);},520); };
  const move=ev=>{ const t=ev.touches?ev.touches[0]:ev; if(Math.abs(t.clientX-startX)>8||Math.abs(t.clientY-startY)>8){if(pressTimer)clearTimeout(pressTimer);pressTimer=null;} };
  const end=ev=>{ if(pressTimer)clearTimeout(pressTimer); pressTimer=null; };
  b.addEventListener("mousedown",start); b.addEventListener("mouseup",end); b.addEventListener("mousemove",move);
  b.addEventListener("touchstart",start,{passive:true}); b.addEventListener("touchend",end); b.addEventListener("touchmove",move,{passive:true});
  b.addEventListener("contextmenu",e=>{e.preventDefault();showCtxMenu(b,idx);});
}
*/

function toggleTrans(idx){ const el=document.getElementById(`trans-${idx}`); if(!el) return; if(openTrans.has(idx)){openTrans.delete(idx);el.classList.remove("show");}else{openTrans.add(idx);el.classList.add("show");} }

function showCtxMenu(bubble, idx){
  ctxTargetIdx = idx;
  const m = document.getElementById("ctxMenu");
  const isSelf = chats[idx]?.sender === "self";
  const isSticker = !!chats[idx]?.sticker;
  const addItem = document.getElementById("ctxAddCard");
  if (addItem) addItem.style.display = (isSelf && !isSticker) ? "" : "none";
  const ttsItem = document.getElementById("ctxTTS");
  if (ttsItem) ttsItem.style.display = isSticker ? "none" : "";

  const rect = bubble.getBoundingClientRect();
  const vp = document.getElementById("vp").getBoundingClientRect();
  m.classList.add("on");
  let top = rect.top - vp.top - m.offsetHeight - 4;
  if (top < 60) top = rect.bottom - vp.top + 6;
  let left = rect.left - vp.left;
  if (left + m.offsetWidth > vp.width - 10) left = vp.width - m.offsetWidth - 10;
  if (left < 10) left = 10;
  m.style.top = top + "px";
  m.style.left = left + "px";
}

function hideCtxMenu(){ document.getElementById("ctxMenu").classList.remove("on"); ctxTargetIdx=-1; }

function bindGlobalClose(){
  document.addEventListener("click",e=>{
    const m=document.getElementById("ctxMenu");
    if(m.classList.contains("on")&&!m.contains(e.target)&&!e.target.classList.contains("bubble")) hideCtxMenu();
    const sp=document.getElementById("searchPane");
    if(sp.classList.contains("on")&&!sp.contains(e.target)&&!e.target.closest(".chat-head-tools")&&!e.target.closest(".h2-tools")) sp.classList.remove("on");
    const stp=document.getElementById("stickerPicker");
    if(stp&&stp.classList.contains("on")&&!stp.contains(e.target)&&!e.target.closest(".in-btn.sticker, .i2-sticker-btn, .i3-send.sticker, .i4-send.sticker")) stp.classList.remove("on");
  });
  document.getElementById("ctxTTS").addEventListener("click", e => {
    e.stopPropagation();
    if (ctxTargetIdx < 0) return;
    const m = chats[ctxTargetIdx];
    hideCtxMenu();
    playMiniMaxTTS(m.text);
  });
  document.getElementById("ctxSearch").addEventListener("click", e => {
    e.stopPropagation();
    hideCtxMenu();
    const sp = document.getElementById("searchPane");
    sp.classList.add("on");
    document.getElementById("chatSearch").focus();
    doSearchChat();
  });  
  document.getElementById("ctxQuote").addEventListener("click",e=>{
    e.stopPropagation(); if(ctxTargetIdx<0) return;
    const m=chats[ctxTargetIdx];
    pendingQuote=makeQuote(m); pendingQuoteFrom=pendingQuote.from;
    applyPendingQuoteUI(); hideCtxMenu(); getActiveInput()?.focus();
  });
  document.getElementById("ctxDel").addEventListener("click",async e=>{
    e.stopPropagation(); if(ctxTargetIdx<0) return;
    const idx=ctxTargetIdx; hideCtxMenu(); chats.splice(idx,1); markStatsDirty(); openTrans=new Set();
    /* 直接从 DOM 移除该行，避免全量重建 */
    const row=document.getElementById(`msg-row-${idx}`);
    if(row){
      /* 检查是否需要移除上方孤立的日期分隔符 */
      const prev=row.previousElementSibling;
      if(prev&&prev.classList.contains("dt-div")){
        const next=row.nextElementSibling;
        if(!next||next.classList.contains("dt-div")) prev.remove();
      }
      row.remove();
      /* 更新后续行的 id / data-idx */
      const f=document.getElementById("chatFlow"); if(f){
        for(let i=idx+1;i<=renderedMsgCount;i++){
          const r=document.getElementById(`msg-row-${i}`);
          if(!r) continue;
          r.id=`msg-row-${i-1}`;
          const b=r.querySelector(".bubble, .sticker-msg");
          if(b) b.setAttribute("data-idx",i-1);
          const t=r.querySelector(".bubble-translation");
          if(t) t.id=`trans-${i-1}`;
        }
      }
      renderedMsgCount--;
      /* 若删除的是窗口首条（索引仍指向新首条），防越界 */
      if(renderStart>chats.length) renderStart=chats.length;
      /* 若删除的是最后一条消息，更新 renderedLastDate */
      if(idx>=renderedMsgCount) renderedLastDate=chats.length?chats[chats.length-1].date||"":"";
    }
    await saveAll();
  });
  document.getElementById("ctxAddCard").addEventListener("click", e => {
    e.stopPropagation();
    if (ctxTargetIdx < 0) return;
    const m = chats[ctxTargetIdx];
    hideCtxMenu();
    openAddCardFromMsg(m);
  });
} // end bindGlobalClose

// ─── AudioContext 解锁（首次用户交互时调用，解除自动播放限制）───
let _audioCtx = null;
let _sfxGain = null;          /* 音效主增益节点，统一控制内置音效 + 用户音效音量 */
function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    _sfxGain = _audioCtx.createGain();
    _sfxGain.gain.value = cfg.sfxVolume !== undefined ? cfg.sfxVolume : 0.8;
    _sfxGain.connect(_audioCtx.destination);
  }
  return _audioCtx;
}
function getSfxGain(){ getAudioCtx(); return _sfxGain; }
/** 设置音效音量，同时更新 WebAudio GainNode 和正在播放的用户 Audio 元素 */
function setSfxVolume(v) {
  cfg.sfxVolume = v;
  if (_sfxGain) _sfxGain.gain.value = v;
  /* 若当前有用户上传音效正在播放，同步调整其音量 */
  if (_playingUserAudio) _playingUserAudio.volume = v;
}
document.addEventListener("touchstart", () => { try { getAudioCtx().resume(); } catch(e){} }, { once: true, passive: true });
document.addEventListener("click",      () => { try { getAudioCtx().resume(); } catch(e){} }, { once: true, passive: true });

// ─── 音频缓存（session 内存 Map + 可选 localStorage 持久化）───
const _ttsMem = new Map(); // 内存缓存 ArrayBuffer
const _TTS_LS_PREFIX = "ttsCache_";

function _ttsCacheKey(text, voiceId, speed, prompt) {
  return `${voiceId}|${speed}|${(prompt||"").slice(0,40)}|${text}`;
}
function _ttsGet(key) {
  if (_ttsMem.has(key)) return _ttsMem.get(key);
  if (cfg.ttsPersist) {
    try {
      const b64 = localStorage.getItem(_TTS_LS_PREFIX + key);
      if (b64) {
        const bin = atob(b64);
        const buf = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
        _ttsMem.set(key, buf.buffer);
        return buf.buffer;
      }
    } catch(e) {}
  }
  return null;
}
function _ttsSet(key, buffer) {
  _ttsMem.set(key, buffer);
  if (cfg.ttsPersist) {
    try {
      const bytes = new Uint8Array(buffer);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      localStorage.setItem(_TTS_LS_PREFIX + key, btoa(bin));
    } catch(e) { /* 超出 quota 静默失败 */ }
  }
}

// ─── 当前播放源，用于打断重叠 ───
let _ttsSource = null;

// ─── 试听按钮绑定的函数 ───
window.testMiniMaxTTS = () => {
  const el = document.getElementById("cfg_ttsTestText");
  const text = el ? el.value.trim() : "";
  if (!text) { toast("请输入要试听的文案", "warn"); return; }
  playMiniMaxTTS(text);
};

// ─── 播放一段 ArrayBuffer（mp3）via AudioContext ───
async function _playBuffer(buffer) {
  const ctx = getAudioCtx();
  if (ctx.state === "suspended") await ctx.resume();
  const decoded = await ctx.decodeAudioData(buffer.slice(0));
  if (_ttsSource) { try { _ttsSource.stop(); } catch(e){} }
  const src = ctx.createBufferSource();
  src.buffer = decoded;
  src.connect(ctx.destination);
  src.start(0);
  _ttsSource = src;
}

// ─── 语音合成接口调用 ───
window.playMiniMaxTTS = async (text) => {
  const apiKey = cfg.ttsKey?.trim();
  if (!apiKey) { toast("请先填写 TTS API Key", "warn"); return; }

  const model   = (cfg.ttsModel  || "speech-01-turbo").trim();
  const voiceId = (cfg.ttsVoice  || "male-qn-qingse").trim();
  const speed   = parseFloat(cfg.ttsSpeed) || 1.0;
  const vol     = parseFloat(cfg.ttsVol)   || 1.0;
  const prompt  = (cfg.ttsPrompt || "").trim();
  const cleanText = text.replace(/<[^>]*>?/gm, "").trim();
  if (!cleanText) return;

  // 提示词映射到 emotion 枚举（MiniMax 支持的值）
  const EMOTION_MAP = {
    "开心":  "happy",   "高兴":  "happy",   "愉快": "happy",
    "悲伤":  "sad",     "难过":  "sad",
    "愤怒":  "angry",   "生气":  "angry",
    "恐惧":  "fearful", "害怕":  "fearful",
    "厌恶":  "disgusted",
    "惊讶":  "surprised",
    "平静":  "neutral", "温柔":  "neutral", "轻声细语": "neutral",
  };
  let emotion = undefined;
  for (const [kw, val] of Object.entries(EMOTION_MAP)) {
    if (prompt.includes(kw)) { emotion = val; break; }
  }

  const apiText = cleanText; // 文本里不加任何提示词

  const cacheKey = _ttsCacheKey(cleanText, voiceId, speed, prompt);
  const cached = _ttsGet(cacheKey);
  if (cached) {
    await _playBuffer(cached);
    toast("语音播放中");
    return;
  }

  let url = (cfg.ttsUrl || "https://api.minimax.chat/v1/t2a_v2").trim();
  const groupId = cfg.ttsGroupId?.trim();
  if (groupId && !url.includes("GroupId"))
    url += (url.includes("?") ? "&" : "?") + "GroupId=" + groupId;

  try {
    toast("正在合成语音…");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model, text: apiText, stream: false,
        voice_setting: { voice_id: voiceId, speed, vol, pitch: 0, ...(emotion ? { emotion } : {}) },
        audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3", channel: 1 }
      })
    });
    const resJson = await response.json();

    if (resJson.base_resp && resJson.base_resp.status_code !== 0) {
      toast("合成失败：" + resJson.base_resp.status_msg, "warn");
      return;
    }

    if (resJson.data && resJson.data.audio) {
      const hexStr = resJson.data.audio;
      const bytes  = new Uint8Array(hexStr.length / 2);
      for (let i = 0; i < bytes.length; i++)
        bytes[i] = parseInt(hexStr.substring(i * 2, i * 2 + 2), 16);
      const buffer = bytes.buffer;
      _ttsSet(cacheKey, buffer);
      await _playBuffer(buffer);
      toast("语音播放中");
    } else {
      toast("未返回音频数据，请检查参数", "warn");
    }
  } catch (err) {
    console.error("TTS Error:", err);
    toast("请求失败，请检查地址或网络", "warn");
  }
};
window.openAddCardFromMsg = (m) => {
  const cats = Array.from(new Set(cards.map(c => c.cat)));
  const opts = cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  modal("加入字卡", `
    <textarea class="fld area" id="acm_text" placeholder="内容">${escapeHtml(m.text || "")}</textarea>
    <textarea class="fld area" id="acm_tr" placeholder="译文 / 标签" style="min-height:48px;">${escapeHtml(m.translation || "")}</textarea>
    <select class="fld" id="acm_cat">
      <option value="">— 选择分组 —</option>
      ${opts}
    </select>
    <input class="fld" id="acm_new" placeholder="或新建分组">
    <button class="pill-btn" onclick="confirmAddCardFromMsg()">确认加入</button>
  `);
};

window.confirmAddCardFromMsg = async () => {
  const text = document.getElementById("acm_text").value.trim();
  const tr   = document.getElementById("acm_tr").value.trim();
  const cat  = (document.getElementById("acm_new").value.trim()
              || document.getElementById("acm_cat").value
              || "未命名");
  if (!text) { toast("内容为空"); return; }

  const dup = cards.find(c => c.text === text && c.cat === cat);
  if (dup) {
    if (!confirm("该字卡已存在，是否覆盖？")) { closeModal(); return; }
    dup.translation = tr;
    await saveAll();
    closeModal();
    toast("已覆盖");
    return;
  }
  cards.push({ id: "c" + Date.now(), text, translation: tr, cat });
  await saveAll();
  closeModal();
  toast("已加入字卡");
};

window.clearPendingQuote = ()=>{
  pendingQuote=null; pendingQuoteFrom="";
  document.getElementById("quotePreview").classList.remove("on");
  const tp=document.getElementById("qpThumb"); if(tp){ tp.classList.remove("on"); tp.removeAttribute("src"); }
};
/* ⭕ 输入框上方的待引用预览：按类型显示缩略图 + 摘要 */
function applyPendingQuoteUI(){
  const wrap=document.getElementById("quotePreview"); if(!wrap) return;
  const qi=getQuoteInfo(pendingQuote);
  if(!qi){ window.clearPendingQuote(); return; }
  const m = qi.mid ? chats.find(c=>c.mid===qi.mid) : null;
  const kind = m ? _msgKind(m) : (qi.kind||"text");
  const tp=document.getElementById("qpThumb");
  let src="", summary=qi.text||"";
  if(m){
    if(kind==="image")        { src=m.image || resolveChatImg(m.imgId); summary="[图片]"; }
    else if(kind==="sticker") { src=resolveStickerSrc(m.stickerId); summary="[表情包]"; }
    else if(kind==="painter") { summary="[画作]"; }
    else if(kind==="song")    { summary="♪ "+(m.songName||"未知曲目"); }
    else                      { summary=m.text||""; }
  }else{
    summary = (kind==="song"&&qi.text) ? "♪ "+qi.text : (qi.text || QUOTE_LABEL[kind] || "");
  }
  if(tp){ if(src){ tp.src=src; tp.classList.add("on"); } else { tp.classList.remove("on"); tp.removeAttribute("src"); } }
  document.getElementById("qpFrom").innerText=qi.from||"";
  document.getElementById("qpText").innerText=summary;
  wrap.classList.add("on");
}

/* ⭕ 按稳定 mid 定位；老数据 / 被裁剪时回退到文本匹配 */
function jumpToMsg(mid, fallbackText){
  let idx = mid ? chats.findIndex(c=>c.mid===mid) : -1;
  if(idx===-1 && fallbackText) idx=chats.findIndex(c=>c.text===fallbackText);
  if(idx===-1) return;
  if(idx<renderStart) renderTo(idx);
  const el=document.getElementById(`msg-row-${idx}`); if(!el) return;
  // 不用 el.scrollIntoView()：它会顺带滚动祖先容器（包括固定定位的外层 viewport），
  // 在部分移动端浏览器上表现为"整个界面往下挪一截"再弹回的抖动。
  // 改为只滚动 chatFlow 自身，且用当前 scrollTop 做相对计算，不影响外层布局。
  const f=document.getElementById("chatFlow"); if(!f) return;
  const targetTop = el.offsetTop - (f.clientHeight - el.clientHeight) / 2;
  f.scrollTo({top: Math.max(0, targetTop), behavior:"smooth"});
  el.classList.add("msg-flash"); setTimeout(()=>el.classList.remove("msg-flash"),900);
}

function bindChatScroll(){
  const f=document.getElementById("chatFlow");
  let raf=null;
  f.addEventListener("scroll",()=>{
    if(raf) return;
    raf=requestAnimationFrame(()=>{
      raf=null;
      /* 滚动到顶部：节流加载更早历史 */
      if(f.scrollTop<60 && Date.now()-_lastLoadOlder>200){ _lastLoadOlder=Date.now(); loadOlderChats(); }
      if(f.scrollHeight-f.scrollTop-f.clientHeight<60) unreadCount=0;
      updateScrollBot();
    });
  });
}

/* ⭐ 新增：事件委托 — 在 #chatFlow 上统一监听所有气泡交互
   替代原来每条气泡绑定 7 个事件监听器的做法（2000 条 = 14000 个监听器 → 只需 4 个） */
function bindChatDelegation(){
  const cf = document.getElementById("chatFlow"); if (!cf) return;
  let pressTimer = null, isLong = false, startX = 0, startY = 0, targetIdx = -1;

  const getBubbleTarget = (el) => {
    const bubble = el.closest(".bubble");
    if (bubble && bubble.dataset.idx !== undefined) return +bubble.dataset.idx;
    const sticker = el.closest(".sticker-msg");
    if (sticker && sticker.dataset.idx !== undefined) return +sticker.dataset.idx;
    return -1;
  };

  const clearPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } isLong = false; targetIdx = -1; };

  // ⭐ pointerdown — 同时处理鼠标和触摸（长按检测）
  cf.addEventListener("pointerdown", e => {
    const idx = getBubbleTarget(e.target);
    if (idx < 0) return;
    targetIdx = idx; isLong = false;
    startX = e.clientX; startY = e.clientY;
    pressTimer = setTimeout(() => {
      isLong = true;
      if (navigator.vibrate) navigator.vibrate(22);
      const row = document.getElementById(`msg-row-${targetIdx}`);
      showCtxMenu(row ? (row.querySelector(".bubble") || row.querySelector(".sticker-msg")) : e.target, targetIdx);
    }, 520);
  });

  cf.addEventListener("pointermove", e => {
    if (!pressTimer) return;
    if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) clearPress();
  });

  cf.addEventListener("pointerup", () => { clearPress(); });

  cf.addEventListener("pointercancel", () => { clearPress(); });

  // ⭐ click — 短按切换翻译 / 点击引用行跳转
  cf.addEventListener("click", e => {
    /* ⭕ 引用行的缩略图 → 直接看原图（图片 / 表情包）。
       必须排在"引用行跳转"之前：缩略图也是 .quote-line 的子元素，
       否则点它会先被下面的跳转分支吃掉。 */
    const qv = e.target.closest(".quote-line .qthumb[data-view]");
    if (qv && qv.src) { e.stopPropagation(); window._openImageModal(qv.src); return; }
    // 引用行跳转
    const ql = e.target.closest(".quote-line");
    if (ql && (ql.dataset.mid || ql.dataset.jump)) { e.stopPropagation(); jumpToMsg(ql.dataset.mid, ql.dataset.jump); return; }
    // 气泡短按 → 翻译切换（排除 sticker）
    if (e.target.closest(".sticker-msg")) return;
    const bubble = e.target.closest(".bubble");
    if (bubble && bubble.dataset.idx !== undefined) {
      toggleTrans(+bubble.dataset.idx);
    }
  });

  // ⭐ contextmenu — 右键菜单
  cf.addEventListener("contextmenu", e => {
    const idx = getBubbleTarget(e.target);
    if (idx < 0) return;
    e.preventDefault();
    const row = document.getElementById(`msg-row-${idx}`);
    showCtxMenu(row ? (row.querySelector(".bubble") || row.querySelector(".sticker-msg")) : e.target, idx);
  });
}
/* ⭐ 原始代码：
function updateScrollBot(){ const f=document.getElementById("chatFlow"); if(!f) return; const near=f.scrollHeight-f.scrollTop-f.clientHeight<60; document.getElementById("scrollBot").classList.toggle("on",!near&&chats.length>5); const ub=document.getElementById("unreadBadge"); if(unreadCount>0&&!near){ub.classList.remove("hidden");ub.innerText=unreadCount;}else ub.classList.add("hidden"); }
*/
/* ⭐ 标记用户是否在底部，用于键盘弹出时判断是否需要重新滚底 */
let _wasNearBottom = true;
function updateScrollBot(){ const f=document.getElementById("chatFlow"); if(!f) return; const near=f.scrollHeight-f.scrollTop-f.clientHeight<60; _wasNearBottom=near; document.getElementById("scrollBot").classList.toggle("on",!near&&chats.length>5); const ub=document.getElementById("unreadBadge"); if(unreadCount>0&&!near){ub.classList.remove("hidden");ub.innerText=unreadCount;}else ub.classList.add("hidden"); }
window.scrollChatBottom = ()=>{ const f=document.getElementById("chatFlow"); f.scrollTo({top:f.scrollHeight,behavior:"smooth"}); unreadCount=0; };
function getActiveInput(){ return document.querySelector(`.input-style-${cfg.chatStyle}:not(.hidden) .msg-in`); }

/* ⭐ 新增：键盘弹出时自动滚动聊天到最底部，确保最新消息可见 */
let _kbScrollTimer = null;
function _handleKeyboardScroll() {
  const f = document.getElementById("chatFlow");
  if (!f || !document.getElementById("chatApp").classList.contains("active")) return;
  // 如果用户之前在底部附近，键盘弹出后重新滚到底部
  if (_wasNearBottom) {
    // 使用 requestAnimationFrame 等待布局稳定后再滚动
    if (_kbScrollTimer) cancelAnimationFrame(_kbScrollTimer);
    _kbScrollTimer = requestAnimationFrame(() => {
      const f2 = document.getElementById("chatFlow");
      if (f2) f2.scrollTop = f2.scrollHeight;
    });
  }
}
/* ⭐ visualViewport：监听键盘弹出/收起导致的视口变化 */
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", _handleKeyboardScroll);
}
/* ⭐ 输入框获得焦点时（键盘弹出），延迟滚动到底部 */
document.addEventListener("focusin", (e) => {
  if (e.target.classList.contains("msg-in")) {
    // 键盘动画通常需要 200-350ms，延迟确保滚动在布局完成后执行
    setTimeout(() => {
      const f = document.getElementById("chatFlow");
      if (f && document.getElementById("chatApp").classList.contains("active")) {
        f.scrollTop = f.scrollHeight;
      }
    }, 300);
  }
});

// ─── Send ───
window.sendMsg = async()=>{
  const box=getActiveInput(); if(!box) return;
  const t=box.value.trim(); if(!t) return;
  const now=new Date(); let userText=t, userTrans="";
  if(t.includes("【翻译】")){ const p=t.split("【翻译】"); userText=p[0].trim(); userTrans=p[1].trim(); }
  const msgObj={sender:"self",text:userText,translation:userTrans,time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime()};
  if(pendingQuote) msgObj.quote=pendingQuote;
  _addChatMsg(msgObj); document.querySelectorAll(".msg-in").forEach(el=>el.value=""); window.clearPendingQuote();
  if(cfg.soundOn) playSoundById(cfg.activeSoundId || "__builtin_thud1__");
  if(navigator.vibrate) navigator.vibrate(18);
  const _sb=document.querySelector('.input-style-1:not(.hidden) .in-btn.send,.input-style-2:not(.hidden) .i2-send,.input-style-3:not(.hidden) .i3-send:not(.alt),.input-style-4:not(.hidden) .i4-send:not(.alt)');
  if(_sb){_sb.classList.add('sent-flash');setTimeout(()=>_sb.classList.remove('sent-flash'),400);}
  /* ⭐ 原始代码：await saveAll(); appendNewChats(); getActiveInput()?.focus(); */
  /* ⭐ 改用防抖写入，避免每条消息都触发完整 DB 序列化（消息多时 saveAll 会阻塞主线程） */
  saveAllDebounced(); appendNewChats();
  /* ⭐ 发送后强制滚到底部，确保最新消息可见 */
  const cf=document.getElementById("chatFlow"); if(cf) cf.scrollTop=cf.scrollHeight;
  /* ⭐ 发送后让输入框失焦，收起键盘，使用户可以完整看到聊天内容 */
  /* ⭐ 原始代码（上一轮修改）：发送后重新聚焦输入框并延迟滚底，导致键盘再次弹出 */
  /* getActiveInput()?.focus();
  setTimeout(() => {
    const cf2=document.getElementById("chatFlow");
    if(cf2) cf2.scrollTop=cf2.scrollHeight;
  }, 350); */
  getActiveInput()?.blur();
  // 用户发消息后，彼按概率自动回复（replyProb: 0-100，默认60%）
  if(!replyTimer && !typingNode && Math.random() * 100 < (cfg.replyProb ?? 60)){
    scheduleReply(/*isAuto=*/true);
  }
};

// ─── Reply ───
window.triggerSpeak = ()=>{ scheduleReply(); };
function showHomeTypingBar(on){
  const bar=document.getElementById("homeTypingBar");
  if(!bar) return;
  const txt=document.getElementById("homeTypingText");
  if(txt) txt.textContent=cfg.typingText||"正在输入";
  bar.classList.toggle("active",on);
}
function scheduleReply(){
  if(replyTimer||typingNode) return;
  if(cfg.ignoreOn && Math.random() < 0.5) {
    toast("未回复");
    return;}
  const sec=randInt(cfg.delayMin,cfg.delayMax);
  if(currentApp==="chatApp"){
    const f=document.getElementById("chatFlow");
    typingNode=document.createElement("div"); typingNode.className="row opp";
    const av=imgs.oppAvatar||window.DEFAULTS.PH_SVG;
    typingNode.innerHTML=`${cfg.showAvatar?`<div class="av-col"><img class="av" src="${av}"></div>`:""}
      <div class="typing-pure"><span class="t-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="tip-text">${escapeHtml(cfg.typingText||"正在输入")}</span></div>`;
    f.appendChild(typingNode); f.scrollTop=f.scrollHeight;
  } else {
    showHomeTypingBar(true);
  }
  document.querySelectorAll('.in-btn.speak,.i2-speak-btn,.i3-send.alt,.i4-send.alt').forEach(b=>b.classList.add('pending'));
  replyTimer=setTimeout(()=>{ if(typingNode){typingNode.remove();typingNode=null;} showHomeTypingBar(false); replyTimer=null; document.querySelectorAll('.in-btn.speak,.i2-speak-btn,.i3-send.alt,.i4-send.alt').forEach(b=>b.classList.remove('pending')); fireReply(); },sec*1000);
}

// ─── 曲库：取歌词与推荐歌曲（不触碰播放队列 _shufflePool）───

/* LRC 元数据行识别：作词/作曲/编曲/歌名 这类都带时间戳，会被 _parseLRC 当成歌词，
   不过滤彼就会发出「编曲：陈伟伦」「作词：xxx」这种句子。
   ⚠ 难点是别误杀正常歌词：「吉他」「后期」「专辑」这些词本身完全可能出现在歌词里，
   所以采取分层判定 —— 只有「行首职务名」或「带冒号 + 职务关键词」才判为元数据。 */
const LRC_META_HEAD=/^\s*(作词|作辭|作曲|編曲|编曲|製作人|制作人|製作|制作|混音|母帶|母带|後期|后期|監製|监制|出品|發行|发行|統籌|统筹|策劃|策划|企劃|企划|宣發|宣发|歌名|歌詞|歌词|曲目|專輯|专辑|演唱|歌手|原唱|翻唱|和聲|和声|合聲|合声|編寫|编写|版权|版权所有|OP|SP)\s*[:：\s]/i;
const LRC_META_KEYS=/作词|作辭|作曲|編曲|编曲|製作|制作|混音|錄音|录音|監製|监制|和聲|和声|合聲|合声|吉他|貝斯|贝斯|弦樂|弦乐|母帶|母带|後期|后期|出品|發行|发行|原唱|翻唱|統籌|统筹|推廣|推广|企劃|企划|策劃|策划|宣發|宣发|專輯|专辑|歌名|歌曲名|歌詞|歌词|曲目|演唱|歌手|鼓|鍵盤|键盘|版权|版權|OP|SP|ISRC|MV\b|Producer|Arrangement|Arranger|Composer|Lyricist|Recording|Mixing|Mastering|Guitar|Bass|Drum|Keyboard|Vocal|Backing|Chorus|Publisher|Studio|Album|Lyrics|Composed|Engineer/i;
/** 判断一行是不是元数据（而非歌词正文） */
function isLyricMetaLine(t){
  const s=(t||"").trim();
  if(s.length<2) return true;                                  // 太短，多半是残句/占位
  if(/^\[[^\]]*\]$/.test(s)) return true;                      // 只剩时间轴的残留行
  if(LRC_META_HEAD.test(s)) return true;                       // 行首职务/曲名：「作词 张三」「歌名：xxx」
  /* 单字职务名必须限定在行首：`词：` `曲：` `词曲：` `词 Lyricist:`。
     不能放进 LRC_META_KEYS —— 那会让「他说：曲终人散」这种歌词被误杀 */
  if(/^(词曲|词|曲)[词曲\s、,，/·&]{0,6}[^\u4e00-\u9fa5]{0,12}[:：]/.test(s)) return true;
  if(/[:：]/.test(s) && LRC_META_KEYS.test(s)) return true;    // 带冒号且含职务关键词
  if(/^(OP|SP|ISRC|MV|OA|OC)\b/i.test(s)) return true;         // 行首行业标记
  if(/^\s*[^\u4e00-\u9fa5A-Za-z0-9]+\s*$/.test(s)) return true;// 纯符号/空白
  if(/\bby\s*[:：]/i.test(s)) return true;                     // Music by:
  if(/(lrc|www\.|https?:|\.com|\.net)/i.test(s)) return true;  // 制作方网址水印
  return false;
}
function _cleanLyricLines(lines){
  return lines.filter(l=>!isLyricMetaLine(l.text||""));
}

/* 取某首歌清洗后的歌词行（复用 _lrcTextCache，不写回 song 对象）*/
async function _lrcLinesFor(song){
  if(!song || !song.lrc) return [];
  let txt = "";
  if(song.lrc.startsWith("http")){
    txt = _lrcTextCache.get(song.lrc);
    if(txt === undefined){
      txt = await _fetchRemoteLrc(song.lrc);
      if(txt) _lrcTextCache.set(song.lrc, txt);
    }
  } else {
    txt = song.lrc; // 兼容旧索引里已混入的歌词文本
  }
  return _cleanLyricLines(_parseLRC(txt));
}

/* 曲库快照：优先内存 → 网络/localforage 缓存。
   ⚠ 绝不能调用 _ensureShufflePool()：它会重新洗牌并覆盖播放队列 */
function _getSongPool(forceRefresh){
  if(!forceRefresh && cloudSongCache && cloudSongCache.length) return Promise.resolve(cloudSongCache);
  return fetchCloudIndex(forceRefresh);
}

/* 三级优先取一句歌词：① 当前正在播放 ② 曲库随机一首 ③ 交回调用方兜底本地歌词库 */
async function pickCloudLyric(){
  try{
    // ① 正在播放且未暂停
    if(musicAudio && !musicAudio.paused && musicAudio._currentSong){
      const ls = await _lrcLinesFor(musicAudio._currentSong);
      if(ls.length) return { text: ls[Math.floor(Math.random()*ls.length)].text, from:"now" };
    }
    // ② 曲库随机挑一首（最多试 3 首，避开无歌词的曲）
    const pool = await _getSongPool();
    if(pool && pool.length){
      for(let tries=0; tries<3; tries++){
        const s = pool[Math.floor(Math.random()*pool.length)];
        if(!s || !s.lrc) continue;
        const ls = await _lrcLinesFor(s);
        if(ls.length) return { text: ls[Math.floor(Math.random()*ls.length)].text, from:"cloud" };
      }
    }
  }catch(e){ /* 网络异常静默降级到本地歌词库 */ }
  return null;
}

/* ════════════════════════════════════════════
   ══ 组字 ══
   语料 = 非歌词的字卡原句。只在内存里建索引，不在卡片上写任何数据、不改任何字卡。
   三级降级：Markov 链生成(B) → 模板槽位兜底(C) → 调用方退回原抽卡逻辑
   ════════════════════════════════════════════ */
const RECOMB_MIN_SRC=3;    // 最少需要几张可用字卡
const RECOMB_MIN_CHARS=20; // 最少需要多少个不同的汉字，低于此视为语料太稀

/* C 兜底模板：{w} 会被语料里的真实片段（2-4 字）填充 */
const RECOMB_TEMPLATES=[
  "我想{w}{w}",
  "{w}是{w}的{w}",
  "听说{w}，就{w}",
  "如果{w}，那就{w}",
  "{w}的时候，{w}",
  "你说{w}，我说{w}",
  "不是{w}，只是{w}",
  "等{w}都{w}了",
  "所有的{w}都{w}",
  "你知道吗，{w}",
  "我不{w}，我只是{w}",
  "{w}以后，{w}",
  /* ⭕ 带数字槽位 {n} 的模板 */
  "等了{n}天，{w}",
  "第{n}次{w}",
  "{w}了{n}遍",
  "{n}年{w}",
  "还有{n}天就{w}",
  "{w}{n}次",
  "过了{n}年才{w}",
  /* ⭕ 带意象 {i} / 时间 {t} / 处所 {p} 槽位的模板 —— 给句子一个画面，
     这些词是内置的，不依赖字卡里有没有（字卡学的是搭配，意象学的是气质） */
  "{t}，我在{p}看见{i}",
  "{i}落下来的时候，{w}",
  "我把{i}留在{p}",
  "{p}的{i}，还是{w}",
  "{w}的时候，{i}还在",
  "{i}和{w}，{w}",
  "等到{i}都{w}",
  "{p}有过{i}，也有{w}"
];
const RECOMB_CJK=/[\u4e00-\u9fa5]/;

/* ⭕ 数字槽位 {n} 的取值池。
   刻意不让数字进 Markov 链 —— 链不分词性，把「3」当普通字丢进去只会出「我想2023你」。
   走模板槽位则天然有语境（等了{n}天 / 第{n}次），不会破坏汉字链的统计。 */
const RECOMB_NUM_POOL=[
  "一","二","三","四","五","六","七","八","九","十",
  "两","半","几",
  "1","2","3","4","5","6","7","8","9","10","12","24","100"
];

/* ⭕ 数字槽位 {n}……详见上方模板。模板不再是「Markov 失败才用的兜底」，
   而是有固定出场概率 —— 否则 B 路径几乎总是成功，{n} 永远轮不到。 */
const RECOMB_TEMPLATE_RATE=20;   // 组字里有多大比例直接走模板句

/* ⭕ 句首虚词：虚词链是孤岛 —— 虚词字既不在起字池、也不在实词语料里，
   Markov 游走根本走不进去（实测出现率 0%）。所以改成句首点缀：
   位置固定在句首，绝不会切在词中间，读起来就是「其实，我在月亮里想起你」。 */
const RECOMB_LEAD_RATE=30;       // 有多大比例给句子加个句首虚词
/* 只放能独立起句的连接/语气词。「一直」「从来」这类必须贴着谓语，
   放句首加逗号会读着别扭（「一直，我在…」），刻意不收。 */
const RECOMB_LEAD_WORDS=[
  "其实","不过","还是","也许","终于","忽然","大概","反正",
  "倒是","好像","说到底","后来","偏偏","总觉得","原来","终究","或许","偶尔"
];

/* 虚词搭配：只建 bi/tri 链 ——
     · 不进 chars（免得句子以「的」「了」开头）
     · 不进 frags/segs（免得模板填空填出一串虚词）
   字卡语料里本来就含这些字时能强化搭配；字卡没有则退化为纯装饰，
   真正的虚词补充靠上面的句首点缀。 */
const RECOMB_FUNC_SEGS=[
  "其实我一直","不过也就是","好像在哪里","却还是一样","终于还是不","从来都没有",
  "还是一样的","忽然之间就","也许这就是","我知道你的","你也不会再","只是不太想",
  "大概是因为","说不上来为","总归是要走","也只好这样","越是想不起","倒不如从来",
  "后来才明白","又何必再说","算是想通了","反反复复地","一点一点地","慢慢地也就"
];

/* ⭕ 意象 / 时间 / 处所：模板的 {i}{t}{p} 槽位。
   刻意不放进 Markov 链 —— 它们是「名词」，链学的是字的搭配，
   把一批固定名词灌进链只会让句子反复出现同一批词。
   走槽位则每次只出现一两个，像随手拈来的场景。 */
const RECOMB_IMAGES=[
  "月亮","海","风","雪","雨","星星","云","影子","站台","信",
  "窗","梦","路灯","晚风","远方","岸","潮汐","落叶","雾","光"
];
const RECOMB_TIMES=[
  "那年","深夜","凌晨","黄昏","后来","很久以前","从前","那年冬天",
  "某个傍晚","那天","年少时","这些年","刚刚","忽然之间"
];
const RECOMB_PLACES=[
  "窗前","车站","梦里","海边","路上","楼下","天台","房间里","雨里",
  "人群里","桥上","院子","门后","街角","山顶","水边"
];

/* ⭕ 句尾收束：Markov 走到目标长度就硬停，常常断在词中间（「我在月亮里想起」）。
   补个尾巴既遮住断口，也给句子一个语气。
   省略号/句号最安全 —— 断得再碎，「……」也接得住；语气词只放不会出错的「吧/啊/嘛」。 */
const RECOMB_TAIL_RATE=45;   // 有多大比例给句子补个尾巴
const RECOMB_TAILS=[
  "……","……","……",       // ⭕ 加权重：断在词中间时它最自然
  "。","吧。","啊。","嘛。","呢。","了。","～"
];

let _mkCache=null, _mkSig="";
/* ⭕ 云端组字词典（详见下方 fetchCloudDict）。声明在这里是因为 _buildMarkov 要用它。 */
let cloudDictCache=null, _dictLF=null;
let cloudCharCache=null, _charLF=null;
let cloudXhyCache=null, _xhyLF=null;
const CLOUD_DICT_LF_KEY="cy-dict-index";
const CLOUD_CHAR_LF_KEY="cy-char-index";
const CLOUD_XHY_LF_KEY="cy-xhy-index";
/** 当前生效的词典条数 —— 组字门槛与索引签名都以它为准 */
function _dictSize(){
  if(!cfg.dictOn || !cloudDictCache) return 0;
  const d=cloudDictCache;
  return (d.words?d.words.length:0)+(d.sents?d.sents.length:0)+(d.chars?d.chars.length:0)+(d.funcs?d.funcs.length:0);
}
/** ⭕ 汉字表只影响起字池（不建链、不算语料），所以**不计入组字门槛** ——
    否则光有汉字表没有词典也会启动组字，但 frags 是空的，照样生成不出来 */
function _charSig(){
  if(!cfg.charOn || !cloudCharCache) return "0";
  return (cloudCharCache.data?cloudCharCache.data.length:0)+":"+(cfg.charMaxStroke||0);
}
/** ⭕ 歇后语会改变链和起字池，所以也要进签名（同汉字表：不计入组字门槛，只是增强） */
function _xhySig(){
  if(!cfg.xhyOn || !cloudXhyCache) return "0";
  return String(cloudXhyCache.segs?cloudXhyCache.segs.length:0);
}
/** 语料索引按「卡数 + 屏蔽分类 + 屏蔽卡数 + 词典规模」做签名缓存，避免每次回复都重建 */
function _getMarkov(){
  let shieldedCount=0, totalChars=0;
  for(const c of cards){ if(c.shielded) shieldedCount++; totalChars+=(c&&c.text?String(c.text).length:0); }
  /* 总字数也进签名：编辑/替换一张卡（卡数不变）时同样能察觉到变化 */
  /* ⭕ 词典规模与开关必须进签名 —— 否则拉到词典后索引不会重建，白拉一场 */
  const sig=cards.length+"|"+totalChars+"|"+shieldedCats.join(",")+"|"+shieldedCount+"|"+_dictSize()+"|"+(cfg.dictOn?1:0)+"|"+_charSig()+"|"+_xhySig();
  if(_mkCache && _mkSig===sig) return _mkCache;
  _mkCache=_buildMarkov(); _mkSig=sig;
  return _mkCache;
}
function _buildMarkov(){
  const idx={ bi:new Map(), tri:new Map(), chars:[], frags:[], segs:[], src:0, bytes:0, dict:0 };
  const src=cards.filter(c=>!c.shielded && !shieldedCats.includes(c.cat) && c.cat!=="歌词库");
  idx.src=src.length;
  idx.dict=_dictSize();
  /* ⭕ 字卡一张都没有时，云端词典是唯一语料 —— 门槛要把词典算进去，
     否则「不加字卡」的用户组字永远启动不了 */
  if(src.length + idx.dict < RECOMB_MIN_SRC) return idx;
  const charSet=new Set(); let live=null;   // live = 活字表（成语字频 top3000），汉字表靠它过滤
  const add=(m,k,v)=>{ let a=m.get(k); if(!a){ a=[]; m.set(k,a); } a.push(v); };
  for(const card of src){
    const raw=String(card.text||"");
    /* 按非汉字切开，子句内部才建链 —— 否则会把两句的接缝当成合法搭配 */
    for(const seg of raw.split(/[^\u4e00-\u9fa5]+/)){
      if(seg.length<2) continue;
      for(const ch of seg){ if(RECOMB_CJK.test(ch)) charSet.add(ch); }
      idx.bytes+=seg.length;
      for(let i=0;i+1<seg.length;i++){
        add(idx.bi, seg[i], seg[i+1]);
        if(i+2<seg.length) add(idx.tri, seg[i]+seg[i+1], seg[i+2]);
      }
      /* 槽位片段池（2~4 字，给模板 C 用）与重组片段池（4~10 字的真实子句，给长句用）。
         都采用「每子句随机抽 1 段」而不是全量子串，避免内存爆炸。 */
      const want=Math.min(seg.length, 2+Math.floor(Math.random()*3));
      if(seg.length>=want) idx.frags.push(seg.substr(Math.floor(Math.random()*(seg.length-want+1)), want));
      if(seg.length>=4){
        const L=Math.min(seg.length, 4+Math.floor(Math.random()*7));
        idx.segs.push(seg.substr(Math.floor(Math.random()*(seg.length-L+1)), L));
      }
    }
  }
  /* ⭕ 云端词典：整条进池，不切随机子串 —— 所以不会出现「月亮里想」这种切碎的片段。
       words(2-4字) → frags 供模板填空；sents → segs 供长句拼段；chars → 起字池。
       三者都参与建链，让短句 Markov 也能学到这些搭配。 */
  if(cfg.dictOn && cloudDictCache){
    const d=cloudDictCache;
    const feed=(t)=>{
      if(!t || t.length<2) return;
      for(const ch of t) if(RECOMB_CJK.test(ch)) charSet.add(ch);
      for(let i=0;i+1<t.length;i++){
        add(idx.bi, t[i], t[i+1]);
        if(i+2<t.length) add(idx.tri, t[i]+t[i+1], t[i+2]);
      }
      idx.bytes+=t.length;
    };
    /* ⭕ 成语字频 top3000：既是起字池，也是判定「活字」的依据 —— 汉字表拿它过滤 */
    for(const t of d.chars||[]) for(const ch of String(t)) if(RECOMB_CJK.test(ch)) charSet.add(ch);
    if(d.chars && d.chars.length) live=new Set(d.chars);
    for(const t of d.words||[]){ feed(t); idx.frags.push(t); }
    for(const t of d.sents||[]){ feed(t); idx.segs.push(t); }
    /* ⭕ funcs 只建链：不做起字、不进任何池 —— 它负责让句子接得顺，不负责被填空 */
    for(const t of d.funcs||[]) feed(t);
  }
  /* ⭕ 汉字表只进起字池、不建链（单字之间没有搭配可学），且只收「活字」—— 必须先出现在成语字频表（d.chars）里。
     实测直接全收 16141 字会冒出 楍 杛 蓛 窚 蘾 邃 訚 氃 鷏 这类字典里有、
     但现代汉语根本不用的字（笔画数也筛不掉，楍才 12 画）。
     没有成语库时不接入 —— 那就没有判定活字的依据了。 */
  if(cfg.charOn && cloudCharCache && Array.isArray(cloudCharCache.data) && live){
    const maxS=+(cfg.charMaxStroke||0);
    for(const it of cloudCharCache.data){
      const w=it && it[0];
      if(!w) continue;
      if(!live.has(w)) continue;
      if(maxS && (+(it[2]||0))>maxS) continue;
      if(RECOMB_CJK.test(w)) charSet.add(w);
    }
  }
  /* ⭕ 云端歇后语：**建链 + 扩起字池**，但不进 frags/segs。
     它解决的是「起字池扩大」的真正瓶颈：池里 3000 字只有 ~110 个能接得下去，
     因为绝大多数字没有后续搭配。歇后语是民间口语，给大量常用字补上了搭配，
     链 661→2708，首字去重 113→145。字本身也大多是活字（妈/爷/催/晒/凳/柿）。 */
  if(cfg.xhyOn && cloudXhyCache){
    for(const t of cloudXhyCache.segs||[]){
      if(!t || t.length<2) continue;
      for(const ch of t) if(RECOMB_CJK.test(ch)) charSet.add(ch);
      for(let i=0;i+1<t.length;i++){
        add(idx.bi, t[i], t[i+1]);
        if(i+2<t.length) add(idx.tri, t[i]+t[i+1], t[i+2]);
      }
    }
  }
  /* ⭕ 虚词骨架只建链：不进 charSet（不做起字）、不进 frags/segs（不做填空片段） */
  for(const seg of RECOMB_FUNC_SEGS){
    for(let i=0;i+1<seg.length;i++){
      add(idx.bi, seg[i], seg[i+1]);
      if(i+2<seg.length) add(idx.tri, seg[i]+seg[i+1], seg[i+2]);
    }
  }
  idx.chars=[...charSet];
  return idx;
}
/** 从候选里挑一个不会让同一 n-gram 出现达到 maxRep 次的字；挑不到返回 null（调用方据此停止） */
function _pickRecombChar(cand, out, N, maxRep, used){
  const tries=Math.min(cand.length*3, 30);
  for(let t=0;t<tries;t++){
    const ch=cand[Math.floor(Math.random()*cand.length)];
    if(!ch) continue;
    const trial=out+ch;
    if(trial.length<N) return ch;
    const g=trial.slice(-N);
    if((used.get(g)||0)+1>=maxRep) continue; // ⭕ 同一 n-gram 达到上限则换一个候选
    return ch;
  }
  return null;
}
/* 一次 Markov 游走：走到链条断裂 / 达到单段上限 / 预算耗尽为止，返回这一段 */
function _markovWalk(M, order, maxRep, budget, segCap, used){
  let out = M.chars[Math.floor(Math.random()*M.chars.length)];
  while(true){
    if(budget.n<=0) return out;                  // ⭕ 时间复杂度硬上限（整句共享预算）
    budget.n--;
    if(out.length>=segCap) return out;
    let cand = (order===3 && out.length>=2) ? M.tri.get(out.slice(-2)) : null;
    if(!cand || !cand.length) cand = M.bi.get(out[out.length-1]); // 高阶无候选时降级到 bigram
    if(!cand || !cand.length) return out;
    const ch=_pickRecombChar(cand, out, order, maxRep, used);
    if(ch===null) return out;
    out+=ch;
    if(out.length>=order){ const g=out.slice(-order); used.set(g,(used.get(g)||0)+1); }
  }
}
/* B：Markov 生成。
   实测结论：硬把一条链走到长目标会明显崩坏，所以按目标长度分两条路 ——
     · 短目标：单段 Markov 游走，连贯度最高
     · 长目标：用「语料里真实存在的子句片段」重组，每段语法都成立，拼起来像摘句 */
const RECOMB_WALK_CAP=12;  // 超过这个长度就不再硬走单段链
const RECOMB_MAX_PIECES=4; // 长句最多拼几段
function _markovSentence(){
  const M=_getMarkov();
  /* ⭕ 门槛必须算上词典 —— 只改 genRecomb 不够，这里漏了的话字卡为 0 时
     Markov 永远返回空，生成会全部退化成模板句（表现为成语/词藻堆砌） */
  if(!M || (M.src + (M.dict||0)) < RECOMB_MIN_SRC || M.chars.length<RECOMB_MIN_CHARS) return "";
  const order = (cfg.recombOrder===2)?2:3;
  const minL = Math.max(1, +(cfg.recombMin||3));
  const maxL = Math.max(minL, +(cfg.recombMax||30));
  const maxRep = Math.max(2, +(cfg.recombMaxRepeat||3));
  const maxSteps = Math.max(20, +(cfg.recombMaxSteps||300));
  const target = randInt(minL, maxL);
  const used=new Map();      // ⭕ 重复抑制跨整句共享
  const budget={n:maxSteps};
  let out="";
  if(target<=RECOMB_WALK_CAP){
    out=_markovWalk(M, order, maxRep, budget, target, used);
  }else if(M.segs.length){
    const pieces=Math.min(RECOMB_MAX_PIECES, Math.max(2, Math.round(target/6)));
    for(let p=0;p<pieces;p++){
      if(budget.n<=0) break;
      budget.n--;
      let frag="";
      /* 挑一个不违反重复抑制、且不会把整句撑超 maxL 的真实片段 */
      for(let t=0;t<12;t++){
        const cand=M.segs[Math.floor(Math.random()*M.segs.length)];
        if(!cand) break;
        if(out && out.length+cand.length>maxL) continue;
        if((used.get(cand)||0)+1>=maxRep) continue;
        frag=cand; break;
      }
      if(!frag) break;
      out += (out ? (randomSep()||"") : "") + frag;
      used.set(frag,(used.get(frag)||0)+1);
      if(out.length>=target) break;
    }
  }
  return out.length>=minL ? out : "";
}
/** C：模板 + 真实片段填空。语料够用就能出句，几乎不会有语病 */
function _tmplSentence(){
  const M=_getMarkov();
  if(!M || !M.frags.length) return "";
  const tpl=RECOMB_TEMPLATES[Math.floor(Math.random()*RECOMB_TEMPLATES.length)];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  return tpl
    .replace(/\{w\}/g, ()=> M.frags[Math.floor(Math.random()*M.frags.length)])
    .replace(/\{n\}/g, ()=> pick(RECOMB_NUM_POOL))
    .replace(/\{i\}/g, ()=> pick(RECOMB_IMAGES))
    .replace(/\{t\}/g, ()=> pick(RECOMB_TIMES))
    .replace(/\{p\}/g, ()=> pick(RECOMB_PLACES));
}
/** 组字入口：B 失败降级 C，都失败返回 ""（调用方退回原抽卡逻辑） */
function genRecomb(){
  if(!cfg.recombOn) return "";
  let s="";
  /* ⭕ 数字只来自模板的 {n} 槽位。若等 Markov 失败才用模板，几乎永远轮不到 ——
     实测 B 路径成功率接近 100%，所以给模板一个固定的出场比例。 */
  if(Math.random()*100 < RECOMB_TEMPLATE_RATE){ try{ s=_tmplSentence(); }catch(e){ s=""; } }
  if(!s){ try{ s=_markovSentence(); }catch(e){ s=""; } }
  if(!s){ try{ s=_tmplSentence(); }catch(e){ s=""; } }
  if(!s) return "";
  /* ⭕ 句首虚词点缀（位置安全，不会切在词中间） */
  if(s.length>=5 && Math.random()*100 < RECOMB_LEAD_RATE){
    s = RECOMB_LEAD_WORDS[Math.floor(Math.random()*RECOMB_LEAD_WORDS.length)] + "，" + s;
  }
  /* 长句按概率在中部插入一个分隔符，读起来不至于一口气到底；已有标点就不再加 */
  if(s.length>=8 && !/[，。！…？～,.]/.test(s) && Math.random()<0.5){
    const pos=randInt(4, s.length-4);
    const sep=randomSep();
    if(sep) s=s.slice(0,pos)+sep+s.slice(pos);
  }
  /* ⭕ 句尾收束：只在结尾没有标点时才补 —— 硬切出来的句子往往正断在词中间 */
  if(!/[，。！…？～,.]$/.test(s) && Math.random()*100 < RECOMB_TAIL_RATE){
    s += RECOMB_TAILS[Math.floor(Math.random()*RECOMB_TAILS.length)];
  }
  return s;
}

/* ════════════════════════════════════════════
   ══ 云端组字词典 ══
   与云端字卡 / 音乐 / 表情包同一套模式：内存 → localforage → 网络，失败降级到缓存。
   拉来的内容只作组标语料：不进 cards、不污染字卡库、也不进备份导出（缓存性质，随时可重拉）。
   ════════════════════════════════════════════ */
const DICT_MAX_ITEMS=8000;   // 上限：防止超大文件把建索引拖垮

/* ⭕ chinese-xinhua 成语库专用：不是什么成语都能进组字。
   实测两种失败：① 3 万条直接填空 → 「我想一花独放迁思回虑」这种堆砌；
   ② 只建链 → 字级游走会把成语切碎成半截（「拔毛连茹毛饮」「车击舟连」）。
   所以分两路：写景成语（月白风清/山长水阔/风雨如晦…）进 frags 当意象片段，
   其余成语只建链提供汉字搭配，绝不进任何池。 */
const DICT_IMG_CHARS=new Set([..."月風风雲云雨雪山水海天星夜江河湖林霜露霞春秋光影梦舟柳雁花潮汐岸桥窗灯烟暮晓晴空野原香"]);
/* 人事 / 贬义 / 青楼用字：沾一个就排除 —— 否则会混进「花街柳巷」「酒地花天」 */
const DICT_BAD_CHARS=new Set([..."不无死杀兵刀血鬼魂忧愁恨怨争斗抢夺贪奸盗贼恶劣愚蠢病痛苦街巷市门户院酒买卖金残败枯妻夫妾妓娼宠迷偷淫浪营阵攀问寻觅采折"]);
function _fromXinhuaIdioms(arr){
  const all=[];
  for(const it of arr){
    const w=String((it&&(it.word||it.ci))??"").replace(/[^\u4e00-\u9fa5]/g,"");
    if(w.length>=3 && w.length<=4) all.push(w);
  }
  if(!all.length) return null;
  /* 字频：成语用字很偏，取高频的当「常用字」，用它剔掉阿党比周、通工易事这类。
     ⭕ 1500 → 3000：实测 3000 以内抽样仍是干净常用字（登嶙坐债责赞月有忧尤枣糟寓），
     超过 3000 就开始冒 祚 筲 洩 夤 缊 赭 鼗 这类「字典里有、现代汉语不用」的字。 */
  const freq=new Map();
  for(const w of all) for(const c of w) freq.set(c,(freq.get(c)||0)+1);
  const common=new Set([...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3000).map(x=>x[0]));
  const usable=all.filter(w=>[...w].every(c=>common.has(c)));
  /* 写景成语：至少两个意象字，且不沾人事贬义字 */
  const scenic=usable.filter(w=>{
    const cs=[...w];
    if(cs.some(c=>DICT_BAD_CHARS.has(c))) return false;
    return cs.filter(c=>DICT_IMG_CHARS.has(c)).length>=2;
  });
  return {
    words:[...new Set(scenic)].slice(0,DICT_MAX_ITEMS),      // → frags，意象片段
    sents:[],
    /* ⭕ 起字池 = 成语里的高频字（1500 个）。
       word.json（1.6 万字完整字典）超 jsDelivr 上限拉不到，但它的用途本来就只是
       「起字池 + 常用字过滤」—— 成语库自带的字足够顶上，不进池也会漏掉大半常用字。 */
    chars:[...common],
    /* ⭕ 其余成语**不建链**。实测把 6000 条生僻成语灌进链后，字级游走会走出
       「饭涂羹之让人」「猿鹤继凫短鹤」这种半截成语，比不灌更糟。
       链只来自写景成语 + 内置虚词骨架，句子最干净。 */
    funcs:[],
    total:all.length,                                        // 原始成语总数，仅用于展示
    at:Date.now()
  };
}
/** 云端内容不可信，先洗一遍：只留汉字、限长 */
function _cleanDictItem(s){
  const t=String(s??"").replace(/[^\u4e00-\u9fa5]/g,"");
  return (t.length>=1 && t.length<=20) ? t : "";
}
function _normaliseCloudDict(data){
  if(!data) return null;
  const words=[], sents=[], chars=[], funcs=[];
  const push=(arr,x)=>{ if(arr.length>=DICT_MAX_ITEMS) return; const t=_cleanDictItem(x); if(t) arr.push(t); };
  if(Array.isArray(data)){
    /* ⭕ 成语库（chinese-xinhua）格式：元素是 {word, pinyin, explanation, derivation} */
    if(data.length && data[0] && typeof data[0]==="object" && (data[0].word || data[0].ci)){
      const r=_fromXinhuaIdioms(data);
      if(r) return r;
    }
    /* 纯数组：按长度自动分流 —— 随便丢一个词表文件也能直接用 */
    for(const x of data){ const t=_cleanDictItem(x); if(t) (t.length<=4?words:sents).push(t); }
  }else{
    for(const x of (data.words||data.frags||[])) push(words,x);
    for(const x of (data.sents||data.segs||data.sentences||[])) push(sents,x);
    for(const x of (data.chars||[])) push(chars,x);
    /* ⭕ funcs = 功能词（其实/后来/一直…）：只建链，绝不进 frags，
       否则会被填进模板 {w} 变成「其实，过了9年才海」这种不通的句子 */
    for(const x of (data.funcs||data.func||[])) push(funcs,x);
  }
  const w=words.filter(Boolean), s=sents.filter(Boolean), c=chars.filter(Boolean), f=funcs.filter(Boolean);
  return (w.length||s.length||c.length||f.length) ? {words:w, sents:s, chars:c, funcs:f, at:Date.now()} : null;
}
function _ensureDictLF(){
  if(!_dictLF && typeof localforage!=="undefined") _dictLF=localforage.createInstance({name:"SilentChamberDictCache"});
  return _dictLF;
}
async function fetchCloudDict(forceRefresh){
  const lf=_ensureDictLF();
  const url=_jsdelivr(cfg.cloudDictUrl,"https://cdn.jsdelivr.net/gh/fcylz/chinese-xinhua@master/data/idiom.json");
  if(!url) return null;
  if(!forceRefresh && cloudDictCache) return cloudDictCache;
  if(!forceRefresh && lf){
    try{
      /* ⭕ 缓存要认来源：换了词典地址（比如从手写 dict.json 改成成语库）后，
         老缓存必须失效，否则用户以为换了源，看到的还是旧内容 */
      const c=await lf.getItem(CLOUD_DICT_LF_KEY);
      if(c && c.src===url && ((c.words&&c.words.length)||(c.sents&&c.sents.length))){ cloudDictCache=c; _mkCache=null; return c; }
    }catch(e){}
  }
  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    const d=_normaliseCloudDict(await res.json());
    if(!d) throw new Error("词典为空");
    d.src=url;
    cloudDictCache=d;
    if(lf){ try{ await lf.setItem(CLOUD_DICT_LF_KEY,d); }catch(e){} }
    cfg.cloudDictLastSync=Date.now(); saveAllDebounced();
    _mkCache=null;                                   // ⭕ 索引必须重建，否则词典不生效
    _dictStatus(`词典 ${d.words.length+d.sents.length} 条${d.total?`（源自 ${d.total} 条成语）`:""} · 已同步`);
    return d;
  }catch(e){
    if(cloudDictCache) return cloudDictCache;
    if(lf){
      try{
        const c=await lf.getItem(CLOUD_DICT_LF_KEY);
        if(c){ cloudDictCache=c; _mkCache=null; _dictStatus("词典离线缓存"); return c; }
      }catch(e2){}
    }
    _dictStatus("词典拉取失败");
    return null;
  }
}
function _dictStatus(msg){ const el=document.getElementById("dictStatus"); if(el){ el.style.display=""; el.textContent=msg; } }
window.refreshCloudDict=async()=>{
  const lf=_ensureDictLF(); if(lf){ try{ await lf.removeItem(CLOUD_DICT_LF_KEY); }catch(e){} }
  cloudDictCache=null; _mkCache=null;
  _dictStatus("正在拉取…");
  const d=await fetchCloudDict(true);
  toast(d?`词典已更新：${d.words.length+d.sents.length} 条`:"词典拉取失败","warn");
  if(typeof renderRecombSettings==="function") renderRecombSettings();
};

/* ⭕ 云端汉字表：与词典同一套缓存模式，但它是**可选增强** ——
   拉不到就退回成语字频反推的那 1500 字，绝不因为汉字表失败而影响组字。 */
function _normaliseCloudChar(data){
  if(!data || !Array.isArray(data.data)) return null;
  const out=[];
  for(const it of data.data){
    if(!it || !it[0]) continue;
    const w=String(it[0]);
    if(!/^[\u4e00-\u9fa5]$/.test(w)) continue;   // 只收单字
    out.push([w, String(it[1]||"").slice(0,12), +(it[2]||0), String(it[3]||"").slice(0,1)]);
  }
  return out.length ? {data:out, total:out.length, at:Date.now()} : null;
}
function _ensureCharLF(){
  if(!_charLF && typeof localforage!=="undefined") _charLF=localforage.createInstance({name:"SilentChamberCharCache"});
  return _charLF;
}
async function fetchCloudChar(forceRefresh){
  const lf=_ensureCharLF();
  const url=_jsdelivr(cfg.cloudCharUrl,"https://cdn.jsdelivr.net/gh/fcylz/chinese-xinhua@master/data/word-min.json");
  if(!url || !cfg.charOn) return null;
  if(!forceRefresh && cloudCharCache) return cloudCharCache;
  if(!forceRefresh && lf){
    try{
      const c=await lf.getItem(CLOUD_CHAR_LF_KEY);
      if(c && c.src===url && c.data){ cloudCharCache=c; _mkCache=null; return c; }
    }catch(e){}
  }
  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    const d=_normaliseCloudChar(await res.json());
    if(!d) throw new Error("汉字表为空");
    d.src=url;
    cloudCharCache=d;
    if(lf){ try{ await lf.setItem(CLOUD_CHAR_LF_KEY,d); }catch(e){} }
    cfg.cloudCharLastSync=Date.now(); saveAllDebounced();
    _mkCache=null;
    _charStatus(`${d.total} 字 · 已同步`);
    return d;
  }catch(e){
    if(cloudCharCache) return cloudCharCache;
    if(lf){
      try{
        const c=await lf.getItem(CLOUD_CHAR_LF_KEY);
        if(c){ cloudCharCache=c; _mkCache=null; _charStatus("汉字表离线缓存"); return c; }
      }catch(e2){}
    }
    _charStatus("未加载（可选，不影响组字）");
    return null;
  }
}
function _charStatus(msg){ const el=document.getElementById("charStatus"); if(el){ el.style.display=""; el.textContent=msg; } }
window.refreshCloudChar=async()=>{
  const lf=_ensureCharLF(); if(lf){ try{ await lf.removeItem(CLOUD_CHAR_LF_KEY); }catch(e){} }
  cloudCharCache=null; _mkCache=null;
  _charStatus("正在拉取…");
  const d=await fetchCloudChar(true);
  toast(d?`汉字表已更新：${d.total} 字`:"汉字表拉取失败（可选，不影响组字）","warn");
  if(typeof renderRecombSettings==="function") renderRecombSettings();
};

/* ⭕ 云端歇后语：与汉字表同一套缓存模式，同为可选增强。
   解析成「子句」而不是整条 —— 一条歇后语常带谐音和标点，整条灌进去会学到脏搭配。 */
function _normaliseCloudXhy(data){
  const arr=Array.isArray(data)?data:(data&&Array.isArray(data.data)?data.data:null);
  if(!arr || !arr.length) return null;
  const out=[];
  for(const it of arr){
    if(!it) continue;
    const s=String(it.riddle||it.谜面||"")+" "+String(it.answer||it.ans||it.谜底||"");
    for(const seg of s.split(/[^\u4e00-\u9fa5]+/)){
      if(seg.length>=2 && seg.length<=8) out.push(seg);   // 太长的多半是整句俗语，切碎了才好用
    }
  }
  if(!out.length) return null;
  return {segs:[...new Set(out)].slice(0,8000), total:arr.length, at:Date.now()};
}
function _ensureXhyLF(){
  if(!_xhyLF && typeof localforage!=="undefined") _xhyLF=localforage.createInstance({name:"SilentChamberXhyCache"});
  return _xhyLF;
}
async function fetchCloudXhy(forceRefresh){
  const lf=_ensureXhyLF();
  const url=_jsdelivr(cfg.cloudXhyUrl,"https://cdn.jsdelivr.net/gh/fcylz/chinese-xinhua@master/data/xiehouyu.json");
  if(!url || !cfg.xhyOn) return null;
  if(!forceRefresh && cloudXhyCache) return cloudXhyCache;
  if(!forceRefresh && lf){
    try{
      const c=await lf.getItem(CLOUD_XHY_LF_KEY);
      if(c && c.src===url && c.segs){ cloudXhyCache=c; _mkCache=null; return c; }
    }catch(e){}
  }
  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    const d=_normaliseCloudXhy(await res.json());
    if(!d) throw new Error("歇后语为空");
    d.src=url;
    cloudXhyCache=d;
    if(lf){ try{ await lf.setItem(CLOUD_XHY_LF_KEY,d); }catch(e){} }
    cfg.cloudXhyLastSync=Date.now(); saveAllDebounced();
    _mkCache=null;
    _xhyStatus(`${d.segs.length} 子句 · 已同步`);
    return d;
  }catch(e){
    if(cloudXhyCache) return cloudXhyCache;
    if(lf){
      try{
        const c=await lf.getItem(CLOUD_XHY_LF_KEY);
        if(c){ cloudXhyCache=c; _mkCache=null; _xhyStatus("歇后语离线缓存"); return c; }
      }catch(e2){}
    }
    _xhyStatus("未加载（可选，不影响组字）");
    return null;
  }
}
function _xhyStatus(msg){ const el=document.getElementById("xhyStatus"); if(el){ el.style.display=""; el.textContent=msg; } }
window.refreshCloudXhy=async()=>{
  const lf=_ensureXhyLF(); if(lf){ try{ await lf.removeItem(CLOUD_XHY_LF_KEY); }catch(e){} }
  cloudXhyCache=null; _mkCache=null;
  _xhyStatus("正在拉取…");
  const d=await fetchCloudXhy(true);
  toast(d?`歇后语已更新：${d.segs.length} 子句`:"歇后语拉取失败（可选，不影响组字）","warn");
  if(typeof renderRecombSettings==="function") renderRecombSettings();
};

/* ════════════════════════════════════════════
   ══ 云同步（GitHub 私有仓库）══
   ════════════════════════════════════════════
   浏览器直连 api.github.com —— REST contents API 支持 CORS，所以**不需要任何后端**。
     GET /repos/{repo}/contents/{path}?ref=main                → {content(base64), sha}
     PUT /repos/{repo}/contents/{path} {content,sha,branch}    → 更新；sha 过期返回 409（别处改过）
   ⛔ 单文件 ≤1MB 才支持这套 JSON+sha 读写（1–100MB 只剩 raw/object，PUT 不了）
      → 所以按 key 拆文件，超过 SYNC_CHUNK 自动分片。 */
const SYNC_API="https://api.github.com/repos/";
const SYNC_CHUNK=820*1024;      // 单片上限（字符数），留出 base64 膨胀 33% 的余量
const SYNC_DIR="_sync/";
let _syncBusy=false, _syncPushTimer=null, _syncSkipImgs=0;

/* btoa 直接吃中文会抛错 —— 先 UTF-8 编码成字节流再转 */
function _b64e(s){
  const b=new TextEncoder().encode(s); let bin="";
  for(let i=0;i<b.length;i++) bin+=String.fromCharCode(b[i]);
  return btoa(bin);
}
function _b64d(s){
  const bin=atob(s), b=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) b[i]=bin.charCodeAt(i);
  return new TextDecoder().decode(b);
}
/* ⭕ 写文件：本地没有 sha 时先查一次远端。
   场景：新设备 / 清了缓存后又用同一个仓库 —— 远端同名文件已存在，
   而 contents API 更新已存在的文件**必须**带 sha，否则 422「sha wasn't supplied」。 */
async function _ghPutFile(file, text, branch, shas){
  const key=SYNC_DIR+file;
  let sha=shas[key];
  if(!sha){
    try{ const cur=await _gh(key,"GET"); sha=cur&&cur.sha; }catch(e){ /* 404 = 还没创建过，直接 PUT */ }
  }
  const body={message:"sync "+new Date().toLocaleString(),content:_b64e(text),branch};
  if(sha) body.sha=sha;
  const r=await _gh(key,"PUT",body);
  if(r&&r.content) shas[key]=r.content.sha;
  return r;
}
async function _gh(path, method, body){
  const repo=String(cfg.syncRepo||"").replace(/^\/+|\/+$/g,"");
  if(!repo) throw new Error("未填仓库");
  if(!cfg.syncToken) throw new Error("未填令牌");
  const url=SYNC_API+repo+"/contents/"+path+(method==="GET"?"?ref="+encodeURIComponent(cfg.syncBranch||"main")+"&t="+Date.now():"");
  const headers={Accept:"application/vnd.github+json","User-Agent":"cy-moon",Authorization:"Bearer "+cfg.syncToken};
  if(body) headers["Content-Type"]="application/json";
  const res=await fetch(url,{method,headers,body:body?JSON.stringify(body):void 0});
  if(!res.ok){
    let msg=""; try{ const j=await res.json(); msg=(j&&j.message)||""; }catch(e){}
    throw new Error(method+" "+res.status+(msg?" · "+msg:""));
  }
  return res.status===204?null:await res.json();
}
/* ⭕ 待同步的数据包：默认只带文本/元数据。
   imgs / carousel / sounds 存的是 FileReader 出来的 base64，动辄几 MB，
   既撞 API 的 1MB 限制，也会把提交历史撑爆 —— 所以默认排除，由 syncMedia 开关控制。 */
function _syncBundles(includeMedia){
  const b={
    cfg:_syncCfgOut(), texts, cards, msgs, anniversaries,
    surveys:{surveys,surveyRecords},
    misc:{shieldedCats,foldedCats},
    chats:includeMedia?chats:_stripChatMedia(chats),
    members:includeMedia?groupMembers:groupMembers.map(m=>Object.assign({},m,{avatar:""})),
    stickers:includeMedia?stickers:stickers.filter(s=>s.type==="url")
  };
  if(includeMedia){ b.imgs=imgs; b.sounds=sounds; b.carousel=carousel; }
  /* ⭕ v1.15.0 聊天图片：**独立于 syncMedia** 的一路。
     只传「被消息真正引用到的」那部分 —— 用户删过消息留下的孤儿图不上云，控制体积、
     也避免孤儿图永久驻留。走单独的文件命名（chatimg-<id>.json），见 pushSync。 */
  if(cfg.syncChatImgs) b.chatImgs = _referencedChatImgs();
  return b;
}
/* ⭕ 只取「还被消息引用着的」聊天图片。
   chatImgs 是只增不减的库（删消息不会自动清图），全量上传既浪费又会让云端历史越滚越大。
   判据 = 消息里存在该 imgId。 */
function _referencedChatImgs(){
  const used = new Set();
  for(const m of (Array.isArray(chats)?chats:[])){ if(m && m.imgId) used.add(m.imgId); }
  const out = {};
  for(const id of used){ if(chatImgs[id]) out[id] = chatImgs[id]; }
  return out;
}
/* ⭕ 只把"用户设置"同步出去。令牌、以及本机的同步状态（sha 表 / 上次推拉时间）都是
   **本机私有**的 —— 同步出去等于让另一台设备的同步状态覆盖过来，
   那是 sha 错乱、以及推送莫名 409 的另一个来源。 */
function _syncCfgOut(){
  const c=Object.assign({},cfg);
  delete c.syncToken; delete c.syncShas;
  delete c.syncLastPush; delete c.syncLastPull;
  return c;
}
function _stripChatMedia(list){
  return (list||[]).map(m=>{
    const c=Object.assign({},m);
    /* ⭕ v1.15.0：图片本体已经不在这里了 —— 发送时就把 base64 存进 chatImgs，
       消息只留 `imgId`（短 id，**是引用锚点，必须保留**，同类于 stickerId）。
       所以下面这行只对"老数据里还没迁移掉的内嵌 image"生效。
       ⛔ 千万别顺手删 imgId：删了 _msgKind 认不出图片，整条退化成纯文本气泡，
          而且再也定位不到 chatImgs 里那张图 —— 正是 v1.14.x 那个坑的翻版。 */
    if(c.image){ c.text=c.text||"[图片消息]"; delete c.image; }
    if(c.imgId){ c.text=c.text||"[图片]"; }
    /* ⭕ 表情包消息**只留引用锚点**：sticker:true 是个布尔、stickerId 是个短 id，俩加起来几十字节。
       真正的 base64 在 stickers 数组里（上一行已按 type 过滤），跟消息无关。
       原来把这两个字段一起删掉是错的：_msgKind 认不出它是表情 → 引用行退化成纯文本，
       连"这条引用的是哪个表情"都定位不到。删了没省到空间，只砸了功能。 */
    if(c.sticker){ c.text=c.text||"[表情包]"; }
    /* ⭕ 画作**必须原样带过去** —— 它没有 base64，全部内容就是一个 painterSeed（7 位数字字符串）。
       渲染走 cfg.painterUrl + "?seed=" 现场重绘（见 _buildMsgRow），所以种子即内容：
       只要 seed 在，任何设备都能画出**同一张**图，是最不需要媒体同步的类型。
       原来把这俩字段一起删掉是错的 —— 跨设备后 _msgKind 认不出 painter，整条退化成 "[画作消息]" 纯文本气泡。
       删它省不到几十字节，只砸了功能（与上面 sticker 那条同一个错误，同一轮修）。 */
    if(c.painter){ c.text=c.text||"[画作]"; }
    if(c.avatar){ delete c.avatar; }   /* ⭕ 头像也是 base64，云端要它没用（渲染按 memberId 查） */
    return c;
  });
}
function _syncParts(name,val){
  const json=JSON.stringify(val==null?null:val);
  if(json.length<=SYNC_CHUNK) return [{file:name+".json",text:json}];
  if(Array.isArray(val)&&val.length){
    const n=Math.ceil(json.length/SYNC_CHUNK), per=Math.ceil(val.length/n), out=[];
    for(let i=0,p=1;i<val.length;i+=per,p++) out.push({file:name+"-p"+p+".json",text:JSON.stringify(val.slice(i,i+per))});
    return out;
  }
  return [{file:name+".json",text:json}];   // 非数组没法切，只能原样（超限会在推送时报错）
}
function _syncStatus(msg){ const el=document.getElementById("syncStatus"); if(el){ el.style.display=""; el.textContent=msg; } }
/* ─── 合并式拉取 ───
   原来的 _syncApply 是"整包覆盖"：云端有什么就用什么，本机那份直接丢掉。
   于是必然出现"手机盖电脑 / 电脑盖手机"，点错一次就毁数据
   （v1.13.1 修的那个 409 死锁，正是它的后果）。
   现在两条规则：
     ① 列表类：**按唯一键取并集**（同键以本机为准）→ 两边的新消息都能留下；
     ② 单条配置类（texts / cfg / anniversaries）：没法合并，**按时间选较新的一边**。
   唯一键已逐个核对：chats.mid / msgs.id / 评论.id / cards.id / stickers.id /
   members.id / surveys.id / surveyRecords.id / carousel.id / sounds.id —— 都稳定且两端一致。 */
function _mergeByKey(local, remote, keyFn){
  const out = Array.isArray(local) ? local.slice() : [];
  const seen = new Set();
  for(const it of out){ const k=keyFn(it); if(k!=null) seen.add(k); }
  for(const it of (Array.isArray(remote)?remote:[])){
    const k=keyFn(it);
    if(k!=null){ if(seen.has(k)) continue; seen.add(k); }
    out.push(it);
  }
  return out;
}
function _mergeStrings(local, remote){
  const out = Array.isArray(local) ? local.slice() : [];
  const seen = new Set(out);
  for(const s of (Array.isArray(remote)?remote:[])){ if(!seen.has(s)){ seen.add(s); out.push(s); } }
  return out;
}
/* 取唯一键；连该字段都没有的脏数据才退化为整条比较 */
function _keyBy(field){
  return it => (!it || typeof it!=="object") ? String(it)
             : (it[field]!=null ? field+"#"+it[field] : "raw#"+JSON.stringify(it));
}
const _byId = _keyBy("id");
const _mergeById = (l,r)=>_mergeByKey(l,r,_byId);

/* ─── 内容级去重 ───
   ⭕ id 判重对字卡/表情是**不够**的：云端导入生成的 id 是 "c"/"sk" + Date.now()，
   两台设备各自导入同一批云端内容 → id 必然不同 → _mergeById 当成两条，
   于是「每同步一次就多一份」，这就是库里出现重复内容的来源。
   所以并集之后还得按**内容**再收一遍：
     字卡 → 分类 + 正文；表情 → 图片路径（抹掉域名差异）。
   ⛔ 只判"内容完全相同"，不做模糊匹配 —— 宁可漏删，不可误删。 */
function _cardKey(c){
  if(!c || typeof c!=="object") return "";
  const t=String(c.text||"").trim();
  return t ? (String(c.cat||"")+"|"+t) : "";   // 空正文不参与判重
}
/* ⭕ 同一个表情的 src 可能是 raw.githubusercontent.com（旧默认值）也可能是
   cdn.jsdelivr.net（新默认值）—— 一张图两个域名 = 两条记录，导入层的 src 判重
   同样失效。统一取 /Meme/ 之后的路径做键，域名差异就消失了。 */
function _stickerKey(src){
  const s=String(src||"");
  if(!s) return "";
  if(/^data:/.test(s)) return s;               // 本地上传的 base64：整串比
  const m=s.match(/\/Meme\/(.+)$/);
  if(m) return m[1].toLowerCase();
  return s.replace(/^https?:\/\//,"").toLowerCase();
}
/* raw.githubusercontent.com 本机不可达 → 同图时优先留下打得开的那条 */
function _stickerRank(s){ return /raw\.githubusercontent\.com/.test(String((s&&s.src)||"")) ? 1 : 0; }
/* 按内容键收重，保留**更优**的一条（better(a,b)<0 → a 胜），其余保持原顺序 */
function _dedupeBy(list, keyFn, better){
  const out=[], pos=new Map();
  for(const it of (Array.isArray(list)?list:[])){
    const k=keyFn(it);
    if(!k){ out.push(it); continue; }          // 取不到内容键 = 无从判重，原样保留
    if(!pos.has(k)){ pos.set(k, out.length); out.push(it); continue; }
    const at=pos.get(k);
    if(better && better(it, out[at])<0) out[at]=it;
  }
  return out;
}
const _mergeCards    = (l,r)=>_dedupeBy(_mergeByKey(l,r,_byId), _cardKey);
const _mergeStickers = (l,r)=>_dedupeBy(_mergeByKey(l,r,_byId), s=>_stickerKey(s&&s.src),
                                        (a,b)=>_stickerRank(a)-_stickerRank(b));
/* 本地库的内容键集合 —— 云端库里"已经导入过"的项靠它认出来 */
function _localCardKeys(){ return new Set(cards.map(_cardKey)); }
function _localStickerKeys(){ return new Set(stickers.map(s=>_stickerKey(s&&s.src))); }

/* ⭕ 表情去重专用版：取舍规则同 _dedupeBy，但额外返回「被合并掉 → 保留下来」的 id 映射。
   聊天里存的是 `stickerId`（引用锚点，不是图片本体），直接把多余那条删掉 = 老消息再也
   找不到它 → 那批表情永久退化成占位图，正是 v1.14.x「顺手删了引用锚点」那个坑的翻版。
   保留哪一条的优先级：① 打得开的（非 raw）② **有聊天在引用的** ③ 位置靠前的。 */
function _dedupeStickersWithMap(list){
  const src = Array.isArray(list) ? list : [];
  const used = new Set();
  for(const m of (Array.isArray(chats)?chats:[])) if(m && m.stickerId) used.add(m.stickerId);

  const groups = new Map();
  for(const it of src){
    const k = _stickerKey(it && it.src);
    if(!k) continue;                       // 取不到键 = 无从判重，原样保留
    if(!groups.has(k)) groups.set(k, []);
    groups.get(k).push(it);
  }
  const keepOf = new Map(), map = new Map();
  for(const [k, arr] of groups){
    let keep = arr[0];
    for(const it of arr){
      if(_stickerRank(it) < _stickerRank(keep)) keep = it;
      else if(_stickerRank(it) === _stickerRank(keep) && !used.has(keep.id) && used.has(it.id)) keep = it;
    }
    keepOf.set(k, keep);
    for(const it of arr) if(it !== keep && it.id && keep.id && it.id !== keep.id) map.set(it.id, keep.id);
  }
  /* 按原顺序重建：每个内容键在**首次出现的位置**放保留下来的那条 */
  const out = [], seen = new Set();
  for(const it of src){
    const k = _stickerKey(it && it.src);
    if(!k){ out.push(it); continue; }
    if(seen.has(k)) continue;
    seen.add(k);
    out.push(keepOf.get(k));
  }
  return { list: out, map };
}
/* ⭕ 把聊天（含引用块）里指向「被合并掉那条」的 stickerId 改指到保留下来的那条。
   两者是同一张图，所以改完聊天里显示的表情**完全不变**，不会有任何一条退化成占位图。 */
function _remapStickerIds(map){
  if(!map || !map.size) return 0;
  let n = 0;
  const fix = o => {
    if(!o || typeof o !== "object") return;
    const id = o.stickerId;
    if(typeof id === "string" && map.has(id)){ o.stickerId = map.get(id); n++; }
  };
  for(const m of (Array.isArray(chats)?chats:[])){ fix(m); if(m && m.quote) fix(m.quote); }
  for(const p of (Array.isArray(msgs)?msgs:[])){ fix(p); for(const c of ((p && p.comments) || [])) fix(c); }
  return n;
}
/* 留言板：帖子按 id 并集，**同一条帖子的评论也要并集**（两端可能各回了一条） */
function _mergeMsgs(local, remote){
  const out = _mergeByKey(local, remote, _byId);
  const byId = new Map();
  for(const p of out){ if(p && p.id!=null) byId.set(p.id, p); }
  for(const rp of (Array.isArray(remote)?remote:[])){
    if(!rp || rp.id==null) continue;
    const lp = byId.get(rp.id);
    if(!lp || !Array.isArray(rp.comments) || !rp.comments.length) continue;
    lp.comments = _mergeByKey(lp.comments, rp.comments, _byId);
    if(typeof _cmtRealTs==="function") lp.comments.sort((a,b)=>_cmtRealTs(a)-_cmtRealTs(b));
  }
  return out;
}
/* 聊天记录：并集后按 ts 排回时间序，并遵守 CHAT_MAX 上限（只留最近那批）。
   ── 回填（v1.15.0 / 决策 3「尝试回填」）──
   _mergeByKey 是「同键以本机为准、无条件跳过云端」，这对防旧数据覆盖是对的，
   但它有个治不好的疤：某台设备先落了一条**被剥过媒体**的同一 mid 消息
   （典型来源：v1.14.1 之前的 `delete c.painter`，或图片消息的 `delete c.image`），
   之后云端那份**完整版**永远进不来 —— 于是「[画作]」灰字气泡在对面永久定格。
   所以这里开一个**单向**例外：只允许「云端补齐本机缺的媒体字段」。
   ⛔ 绝不碰 text / ts / sender / name —— 也就是说本机的新内容、时间戳、
   排序都不会被云端的旧版本改写，只是把缺失的画作/图片/表情锚点补回来。 */
function _mergeChats(local, remote){
  let out = _mergeByKey(local, remote, _keyBy("mid"));
  const byMid = new Map();
  for(const m of out){ if(m && m.mid!=null) byMid.set(m.mid, m); }
  for(const rm of (Array.isArray(remote)?remote:[])){
    if(!rm || rm.mid==null) continue;
    const lm = byMid.get(rm.mid);
    if(!lm || lm===rm) continue;
    /* ⭕ 画作：本机认不出是画作（painter 缺失）而云端有 seed → 采纳云端。
       种子即内容（无 base64），补回来就能重绘 —— 这是本轮回填的主要目标。 */
    if(!lm.painter && rm.painter){ lm.painter=true; if(rm.painterSeed!=null) lm.painterSeed=rm.painterSeed; }
    /* ⭕ 图片：本机两处都没有（既无 image 也无 imgId）而云端有 → 采纳。
       v1.15.0 之前图片内嵌在 m.image，之后挪进 chatImgs 用 m.imgId 寻址，两个都算。 */
    if(!lm.image && !lm.imgId && (rm.image || rm.imgId)){
      if(rm.image) lm.image=rm.image;
      if(rm.imgId) lm.imgId=rm.imgId;
    }
    /* ⭕ 表情包：本机缺引用锚点而云端有 → 采纳（与上面同一个错误、同一处顺手修） */
    if(!lm.sticker && rm.sticker){ lm.sticker=true; if(rm.stickerId!=null) lm.stickerId=rm.stickerId; }
  }
  out.sort((a,b)=>(Number(a&&a.ts)||0)-(Number(b&&b.ts)||0));
  const cap = (typeof CHAT_MAX==="number" && CHAT_MAX>0) ? CHAT_MAX : 2000;
  return out.length>cap ? out.slice(-cap) : out;
}

/* 把云端数据应用到本机。
   opt.force = 完全覆盖（「强制拉取」）；默认走合并。
   opt.ts    = 云端那份的时间戳（manifest.ts），用来裁决单条配置类听谁的。 */
function _syncApply(b, opt){
  const force = !!(opt && opt.force);
  const remoteTs = (opt && Number(opt.ts)) || 0;
  const localTs  = Number(cfg.syncLastPush) || 0;
  /* 单条配置类听谁的：云端比"本机上次推送时间"新 → 用云端，否则保留本机。 */
  const cloudNewer = force || remoteTs > localTs;
  const take = (local, remote, mergeFn) => (force || !mergeFn) ? remote : mergeFn(local, remote);

  if(b.cfg && cloudNewer) Object.assign(cfg, b.cfg, {
    /* ⭕ 这几项本机私有，任何情况下都不许被云端覆盖 */
    syncToken:cfg.syncToken, syncShas:cfg.syncShas,
    syncLastPush:cfg.syncLastPush, syncLastPull:cfg.syncLastPull,
  });
  if(b.texts && cloudNewer) texts = b.texts;
  if(b.anniversaries && cloudNewer) anniversaries = b.anniversaries;

  if(b.chats){ chats = take(chats, b.chats, _mergeChats); if(typeof markStatsDirty==="function") markStatsDirty(); }
  if(b.msgs){ msgs = take(msgs, b.msgs, _mergeMsgs); if(typeof normalizeMsgs==="function") normalizeMsgs(); }
  if(b.members) groupMembers = take(groupMembers, b.members, _mergeById);
  /* ⭕ 字卡/表情走内容级去重（_mergeCards / _mergeStickers）：光按 id 并集会让
     两台设备各自导入的同一批云端内容各算一条，同步一轮多一份。 */
  if(b.cards) cards = take(cards, b.cards, _mergeCards);
  if(b.stickers) stickers = take(stickers, b.stickers, _mergeStickers);
  if(b.surveys){
    if(b.surveys.surveys) surveys = take(surveys, b.surveys.surveys, _mergeById);
    if(b.surveys.surveyRecords) surveyRecords = take(surveyRecords, b.surveys.surveyRecords, _mergeById);
  }
  if(b.misc){
    if(b.misc.shieldedCats) shieldedCats = take(shieldedCats, b.misc.shieldedCats, _mergeStrings);
    if(b.misc.foldedCats)   foldedCats   = take(foldedCats, b.misc.foldedCats, _mergeStrings);
  }
  /* 媒体：默认不同步；真带了就并集 */
  if(b.imgs && cloudNewer) imgs = b.imgs;
  if(b.sounds) sounds = take(sounds, b.sounds, _mergeById);
  if(b.carousel) carousel = take(carousel, b.carousel, _mergeById);
  /* ⭕ v1.15.0 聊天图片：**永远并集，force 也不例外**。
     理由：图片是只增不减的资源（imgId 一旦生成就只被引用，不会被改写），
     并集不会产生冲突；而 force 覆盖会**丢掉本机独有的图** ——
     那正是"强制拉取后本机图片全变占位图"这种不可逆事故。
     语义上 force 是"对齐云端的文本/结构"，不是"删掉我的图"。 */
  if(b.chatImgs) chatImgs = Object.assign({}, chatImgs, b.chatImgs);
}
function _syncRefreshUI(){
  try{ syncUI(); }catch(e){}
  ["renderChats","renderMembers","renderCarousel","renderStickers","renderCards","renderMosaic","renderSurveys","renderBoard"].forEach(f=>{
    try{ if(typeof window[f]==="function") window[f](); }catch(e){}
  });
}
window.pushSync=async(auto)=>{
  if(_syncBusy) return false;
  _syncBusy=true;
  try{
    _syncStatus("正在推送…");
    const branch=cfg.syncBranch||"main", shas=cfg.syncShas||(cfg.syncShas={});
    const bundle=_syncBundles(!!cfg.syncMedia);
    const manifest={ts:Date.now(),files:{}};
    let count=0;
    /* ⭕ v1.15.0：聊天图片**一张一个文件**，不走 _syncParts。
       原因：_syncParts 只对**数组**分片，chatImgs 是对象 → 会挤进单个 chatImgs.json，
       几十张图 = 几 MB，必撞 GitHub contents API 的 1MB 硬限制，整次推送直接失败。
       改成 chatimg-<id>.json 后天然不撞限，且某张图失败也不牵连其他图。
       manifest.files.chatImgs 记的是文件名数组，拉取端按 chatimg- 前缀反解 id。 */
    const chatImgFiles=[];
    for(const [name,val] of Object.entries(bundle)){
      if(name==="chatImgs"){
        for(const [id,data] of Object.entries(val||{})){
          const text=JSON.stringify(data);
          /* ⭕ 单张图超 900KB 就跳过（**不让它失败整次推送**），并累计提示。
             压缩规格是 400px/q0.65（通常 30–80KB），正常永远碰不到这条。 */
          if(text.length > 900*1024){ _syncSkipImgs++; continue; }
          const file="chatimg-"+id+".json";
          await _ghPutFile(file,text,branch,shas);
          chatImgFiles.push(file); count++;
        }
        manifest.files.chatImgs=chatImgFiles;
        continue;
      }
      const parts=_syncParts(name,val);
      for(const p of parts){
        await _ghPutFile(p.file,p.text,branch,shas);
        count++;
      }
      manifest.files[name]=parts.map(p=>p.file);
    }
    const mr=await _ghPutFile("index.json",JSON.stringify(manifest),branch,shas);
    void mr;
    cfg.syncLastPush=Date.now(); await saveAll();
    if(_syncSkipImgs){ _syncStatus(`已推送 ${count} 个文件（${_syncSkipImgs} 张图片过大被跳过）`); if(!auto) toast(`${_syncSkipImgs} 张图片超过 900KB 已跳过`,"warn"); _syncSkipImgs=0; }
    else _syncStatus(`已推送 ${count} 个文件 · ${new Date().toLocaleTimeString()}`);
    if(!auto) toast("已推送到云端","ok");
    return true;
  }catch(e){
    /* ⭕ 409 = 远端被别的设备改过，本地记录的 sha 已过期 —— 不能静默覆盖，让用户先拉 */
    /* ⭕ 409 有两个方向，不能只让人去"拉取"：拉取会把云端那份盖到本机。
       本机才是最新的（例如别的设备误推了测试数据）→ 该用「强制推送」。 */
    const msg=/409/.test(String(e.message))
      ? "云端已被其他设备改过。本机数据若是最新，用「强制推送」覆盖云端；云端若是最新，才用「从云端拉取」。"
      : e.message;
    _syncStatus("推送失败："+msg);
    if(!auto) toast("推送失败："+msg,"warn");
    return false;
  }finally{ _syncBusy=false; }
};
/* ⭕ 强制推送：忽略云端版本冲突，直接用**本机数据**覆盖云端。
   背景：推送用的是本机缓存的分片 sha（_ghPutFile 只在没有缓存时才去 GET 最新 sha），
   所以一旦别的设备推过，本机再推必然 409。原来的提示是"请先「拉取」再推送"——
   但「拉取」会跑 _syncApply，把云端那份**直接盖到本机数据上**。
   当本机才是最新的（例如另一台设备误推了一份测试数据），照那句提示做 = 把自己的数据毁掉。
   这里把本机 sha 缓存清空，让 _ghPutFile 逐个重新 GET 最新 sha 再 PUT —— 覆盖因此是安全的。
   ⚠ 云端上其他设备推过的内容会被覆盖且无法恢复 → 必须二次确认。 */
window.forcePushSync=async()=>{
  if(_syncBusy) return false;
  if(!confirm("强制推送：忽略云端版本冲突，用【本机数据】覆盖云端。\n\n⚠ 云端上其他设备推过的内容会被覆盖，且无法恢复。\n\n确定要强制推送吗？")) return false;
  cfg.syncShas={};
  await saveAll();
  return window.pushSync();
};
/* 拉取分两种：
   · 默认 = **合并式**：列表类按唯一键取并集，两边新增的内容都保留（见 _syncApply 注释）；
   · force=true = 整包覆盖（「强制拉取」），云端那份直接替换本机 —— 会丢本机独有内容，必须二次确认。
   参数 auto 供启动检测/自动流程调用（不弹 toast）。 */
window.pullSync=async(auto, force)=>{
  if(_syncBusy) return false;
  _syncBusy=true;
  try{
    _syncStatus(force?"正在强制拉取…":"正在合并拉取…");
    const shas=cfg.syncShas||(cfg.syncShas={});
    const mf=await _gh(SYNC_DIR+"index.json","GET");
    const manifest=JSON.parse(_b64d(mf.content));
    shas[SYNC_DIR+"index.json"]=mf.sha;
    const bundle={};
    /* ⭕ v1.15.0：聊天图片是「一张一个文件」，要单独收拢回一个对象。
       文件名形如 chatimg-ci123-.json → 去掉前缀和 .json 就是 imgId。
       manifest.files.chatImgs 存的是这些文件名的数组。 */
    const chatImgsObj={};
    for(const [name,info] of Object.entries(manifest.files||{})){
      /* ⭕ manifest.files[name] 存的是分片文件名数组；也兼容 {parts:[...]} 写法 */
      const names=Array.isArray(info)?info:((info&&info.parts)||[]);
      if(name==="chatImgs"){
        for(const f of names){
          try{
            const r=await _gh(SYNC_DIR+f,"GET");
            const id=f.replace(/^chatimg-/,"").replace(/\.json$/,"");
            chatImgsObj[id]=JSON.parse(_b64d(r.content));
            shas[SYNC_DIR+f]=r.sha;
          }catch(e){ /* 单张图读失败不该拖垮整次拉取 —— 跳过，其余照常 */ }
        }
        continue;
      }
      const parts=[];
      for(const f of names){
        const r=await _gh(SYNC_DIR+f,"GET");
        parts.push(_b64d(r.content)); shas[SYNC_DIR+f]=r.sha;
      }
      bundle[name]=parts.length>1?parts.flatMap(t=>JSON.parse(t)):JSON.parse(parts[0]);
    }
    if(Object.keys(chatImgsObj).length) bundle.chatImgs=chatImgsObj;
    _syncApply(bundle, {force:!!force, ts:manifest.ts});
    cfg.syncLastPull=Date.now(); await saveAll();
    _syncRefreshUI();
    _syncStatus(`已${force?"强制":""}拉取 · ${new Date().toLocaleTimeString()}`);
    if(!auto) toast(force?"已用云端覆盖本机":"已合并云端数据","ok");
    return true;
  }catch(e){
    _syncStatus("拉取失败："+e.message);
    if(!auto) toast("拉取失败："+e.message,"warn");
    return false;
  }finally{ _syncBusy=false; }
};
/* ⭕ 强制拉取：不做合并，直接用**云端数据**覆盖本机。
   合并拉取（默认）永远安全，但也因此**没法删东西** —— 云端的删除操作、本机想丢弃的
   本地内容，合并都表达不出来。要"完全对齐云端"就用这个。
   ⚠ 本机独有的内容会被丢弃且无法恢复 → 二次确认。 */
window.forcePullSync=async()=>{
  if(_syncBusy) return false;
  if(!confirm("强制拉取：不做合并，直接用【云端数据】覆盖本机。\n\n⚠ 本机独有的内容会被丢弃，且无法恢复。\n\n确定要强制拉取吗？")) return false;
  return window.pullSync(false, true);
};
window.testSync=async()=>{
  if(!cfg.syncToken){ _syncStatus("请先填令牌"); toast("请先填令牌","warn"); return; }
  _syncStatus("测试中…");
  try{
    const mf=await _gh(SYNC_DIR+"index.json","GET");
    const m=JSON.parse(_b64d(mf.content));
    _syncStatus(`连接成功 · 云端备份 ${new Date(m.ts).toLocaleString()}`);
    toast("连接成功","ok");
  }catch(e){
    if(/404/.test(String(e.message))) _syncStatus("连接成功 · 云端还没有备份，点「推送」即可创建");
    else { _syncStatus("连接失败："+e.message); toast("连接失败："+e.message,"warn"); }
  }
};
function _scheduleSyncPush(){
  if(!cfg.syncAuto||!cfg.syncToken||!cfg.syncRepo||_syncBusy) return;
  clearTimeout(_syncPushTimer);
  _syncPushTimer=setTimeout(()=>window.pushSync(true),30000);   // ⭕ 攒一攒再推，避免每分钟一个 commit
}
/* 启动时检测：云端备份比本机最近一次推送还新，就问一句要不要拉 ——
   ⭕ 默认走**合并**，两边新增内容都保留；要完全对齐云端得手动点「强制拉取」。
   绝不自动覆盖，覆盖本地数据必须是用户明确确认的动作 */
async function checkCloudBackup(){
  if(!cfg.syncToken||!cfg.syncRepo) return;
  try{
    const mf=await _gh(SYNC_DIR+"index.json","GET");
    const m=JSON.parse(_b64d(mf.content));
    if(m.ts>(cfg.syncLastPush||0)+60000){
      if(confirm(`云端有一份 ${new Date(m.ts).toLocaleString()} 的备份，比你本机最近一次推送要新。\n\n是否把它合并到本机？（本机内容不会被删，两边的聊天/留言/卡片会合并）`)) window.pullSync(true);
    }
  }catch(e){}
}
window.openSyncSettings=()=>{
  const html=`
    <div style="font-size:calc(var(--fs)*.7);color:var(--text-mute);margin-bottom:8px;">
      数据存在你自己的私有仓库里，令牌只保存在本机，<b>不会被推送到云端</b>。
    </div>
    <div class="sinput-row" style="flex-direction:column;align-items:stretch;gap:6px;">
      <span class="sinput-label">仓库 <span style="opacity:.6;font-size:calc(var(--fs)*.66);">owner/repo</span></span>
      <input class="inp" value="${escapeHtml(cfg.syncRepo||"")}" placeholder="fcylz/cy-moon-data"
        oninput="cfg.syncRepo=this.value.trim();saveAllDebounced()">
    </div>
    <div class="sinput-row" style="flex-direction:column;align-items:stretch;gap:6px;margin-top:8px;">
      <span class="sinput-label">分支</span>
      <input class="inp" value="${escapeHtml(cfg.syncBranch||"main")}" placeholder="main"
        oninput="cfg.syncBranch=this.value.trim();saveAllDebounced()">
    </div>
    <div class="sinput-row" style="flex-direction:column;align-items:stretch;gap:6px;margin-top:8px;">
      <span class="sinput-label">访问令牌 <span style="opacity:.6;font-size:calc(var(--fs)*.66);">fine-grained · Contents 读写 · 只选这一个仓库</span></span>
      <input class="inp" type="password" value="${escapeHtml(cfg.syncToken||"")}" placeholder="github_pat_…"
        oninput="cfg.syncToken=this.value.trim();saveAllDebounced()">
    </div>
    <div class="stoggle-row" style="margin-top:10px;">
      <span>自动推送 <span style="opacity:.6;font-size:calc(var(--fs)*.66);">数据变动后延迟 30 秒</span></span>
      <div class="sw" id="sw_syncAuto" onclick="cfgToggle('syncAuto', event)"><div class="sw-indicator"></div></div>
    </div>
    <div class="stoggle-row">
      <span>连图片音效一起同步 <span style="opacity:.6;font-size:calc(var(--fs)*.66);">体积大、易超限</span></span>
      <div class="sw" id="sw_syncMedia" onclick="cfgToggle('syncMedia', event)"><div class="sw-indicator"></div></div>
    </div>
    <div class="stoggle-row">
      <span>同步聊天图片 <span style="opacity:.6;font-size:calc(var(--fs)*.66);">独立开关 · 首次开启会补齐历史图</span></span>
      <div class="sw" id="sw_syncChatImgs" onclick="cfgToggle('syncChatImgs', event)"><div class="sw-indicator"></div></div>
    </div>
    <div id="syncStatus" style="font-size:calc(var(--fs)*.7);color:var(--text-mute);margin:8px 0 6px;">${
      (cfg.syncLastPush||cfg.syncLastPull)
        ? `上次推送 ${cfg.syncLastPush?new Date(cfg.syncLastPush).toLocaleString():"从未"} · 上次拉取 ${cfg.syncLastPull?new Date(cfg.syncLastPull).toLocaleString():"从未"}`
        : "尚未同步过"}</div>
    <div class="pill-btn-group">
      <button class="pill-btn" onclick="window.testSync()">测试连接</button>
      <button class="pill-btn" onclick="window.pushSync()">推送到云端</button>
      <button class="pill-btn" onclick="window.pullSync()">合并云端数据</button>
    </div>
    <div class="pill-btn-group" style="margin-top:6px;">
      <button class="pill-btn" onclick="window.forcePushSync()">强制推送 · 本机→云端</button>
      <button class="pill-btn" onclick="window.forcePullSync()">强制拉取 · 云端→本机</button>
    </div>
    <div style="margin-top:8px;font-size:calc(var(--fs)*.68);color:var(--text-mute);">
      ✅ <b>「合并云端数据」最安全</b>：按消息/卡片的唯一 id 取并集，
      两边的聊天记录、留言、卡片都留下，同一条以本机为准，<b>不会删掉本机任何内容</b>。<br>
      ⚠ 也正因为它只做加法，<b>云端删掉的东西、或你想丢弃的本机内容，合并体现不出来</b>。<br>
      ⚠ 要"彻底对齐"某一边才用后两个覆盖按钮 —— 都会丢掉另一边独有的内容，点前想清楚。<br>
      推送报"云端已被其他设备改过"时：<b>本机是最新 → 强制推送；云端是最新 → 合并云端数据</b>。
    </div>
    <div style="margin-top:8px;font-size:calc(var(--fs)*.68);color:var(--text-mute);">
      ⚠ 单文件超过 1MB 会因 GitHub API 限制失败；图片/音效默认不同步。<br>
      🖼 <b>「同步聊天图片」是独立开关</b>：打开后聊天图片会随同步走（聊天里的图能看到）。
      <b>首次打开会一次性上传全部历史图片，可能产生一次较大的云端提交</b>，
      之后只传新增的那几张。单张超过 900KB 的会跳过并提示。<br>
      ⚠ 开关关闭时，对面的图片消息显示为占位图（不是文字）。
      <b>两台设备都升到同一版本之后再打开它</b> —— 旧版本拉到新格式的图片消息会认不出类型。
    </div>`;
  modal("云同步", html);
  setSw("sw_syncAuto", !!cfg.syncAuto);
  setSw("sw_syncMedia", !!cfg.syncMedia);
  setSw("sw_syncChatImgs", !!cfg.syncChatImgs);
};

async function fireReply(){
  const now=new Date();
  if(cfg.stickerOn){
    const stickerPool=stickers.filter(s=>!s.shielded);
    if(stickerPool.length && Math.random()*100<STICKER_CHANCE){
      const stk=stickerPool[Math.floor(Math.random()*stickerPool.length)];
      let nameS=texts.opp_name||"温语", avatarS=imgs.oppAvatar||"", memberIdS="";
      if(cfg.groupMode&&groupMembers.length){ const ms=groupMembers[Math.floor(Math.random()*groupMembers.length)]; nameS=ms.name; avatarS=ms.avatar||window.DEFAULTS.PH_SVG; memberIdS=ms.id; }
      _addChatMsg({sender:"opp",text:"[表情包]",sticker:true,stickerId:stk.id,time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime(),name:nameS,memberId:memberIdS});
      /* ⭐ 改用防抖写入，与文字回复路径一致 */
      saveAllDebounced();
      if(currentApp==="chatApp"){ const f=document.getElementById("chatFlow"); const near=f.scrollHeight-f.scrollTop-f.clientHeight<80; if(!near) unreadCount++; appendNewChats(); }
      else { if(cfg.popupOn) showPopup("[表情包]",nameS,avatarS); }
      notify("[表情包]",nameS,avatarS);
      return;
    }
  }
  /* ⭕ painter画作分支：3%~10% 概率，优先级在表情包之后、字卡之前 */
  if(cfg.painterOn){
    const randVal = Math.random();
    if(randVal >= 0.03 && randVal <= 0.10){
      const painterSeed = Math.floor(Math.random() * 9999999).toString();
      let nameP=texts.opp_name||"温语", avatarP=imgs.oppAvatar||"", memberIdP="";
      if(cfg.groupMode&&groupMembers.length){ const mp=groupMembers[Math.floor(Math.random()*groupMembers.length)]; nameP=mp.name; avatarP=mp.avatar||window.DEFAULTS.PH_SVG; memberIdP=mp.id; }
      _addChatMsg({sender:"opp",text:"[画作]",painter:true,painterSeed,time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime(),name:nameP,memberId:memberIdP});
      saveAllDebounced();
      if(currentApp==="chatApp"){ const f=document.getElementById("chatFlow"); const near=f.scrollHeight-f.scrollTop-f.clientHeight<80; if(!near) unreadCount++; appendNewChats(); }
      else { if(cfg.popupOn) showPopup("[画作]",nameP,avatarP); }
      notify("[画作]",nameP,avatarP);
      return;
    }
  }
  /* ⭕ 推荐歌曲分支：位于表情包/画作之后，占剩余份额的 2%。
     与是否正在播放无关 —— 只要曲库可用（init 后 3s 已后台预取）即可触发 */
  if(cfg.songRecOn && Math.random()<0.02){
    const sPool=await _getSongPool();
    if(sPool && sPool.length){
      const sg=sPool[Math.floor(Math.random()*sPool.length)];
      if(sg && (sg.mp3||sg.name)){
        const _sn=_parseCloudSongName(sg.name||"");
        let nameR=texts.opp_name||"温语", avatarR=imgs.oppAvatar||"", memberIdR="";
        if(cfg.groupMode&&groupMembers.length){ const mr=groupMembers[Math.floor(Math.random()*groupMembers.length)]; nameR=mr.name; avatarR=mr.avatar||window.DEFAULTS.PH_SVG; memberIdR=mr.id; }
        _addChatMsg({sender:"opp",text:"[歌曲]",song:true,songName:_sn.title||"未知曲目",songArtist:_sn.artist||"",songUrl:sg.mp3||"",songLrc:sg.lrc||"",time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime(),name:nameR,memberId:memberIdR});
        saveAllDebounced();
        const tip=`推荐歌曲：${_sn.title||"未知曲目"}`;
        if(currentApp==="chatApp"){ const f=document.getElementById("chatFlow"); const near=f.scrollHeight-f.scrollTop-f.clientHeight<80; if(!near) unreadCount++; appendNewChats(); }
        else { if(cfg.popupOn) showPopup(tip,nameR,avatarR); }
        notify(tip,nameR,avatarR);
        return;
      }
    }
  }
  const pool=cards.filter(c=>!c.shielded&&!shieldedCats.includes(c.cat));
  const lyrics=pool.filter(c=>c.cat==="歌词库");
  const norm=pool.filter(c=>c.cat!=="歌词库");
  let isLyric=false, text="", trans="", fragments=[], recombined=false;
  /* 歌词 6%：lyricFromCloud 开启时按「当前播放 > 曲库随机」取，都取不到才回退本地歌词库 */
  if(Math.random()<0.06){
    const picked = cfg.lyricFromCloud ? await pickCloudLyric() : null;
    if(picked){ isLyric=true; text=picked.text; trans=""; }
    else {
      /* 本地歌词库同样过一层元数据过滤，避免历史混进来的「作词：xxx」被发出去 */
      const clean=lyrics.filter(c=>!isLyricMetaLine(c.text||""));
      if(clean.length){ const c=clean[Math.floor(Math.random()*clean.length)]; isLyric=true; text=c.text; trans=c.translation||""; }
    }
  }
  if(!isLyric){
    if(!pool.length) return;
    /* ⭕ 组字：在文字分支内部按概率触发，命中且生成成功就跳过抽卡；失败则原样走抽卡 */
    if(cfg.recombOn && Math.random()*100 < (cfg.recombProb||0)){
      const gen=genRecomb();
      if(gen){ text=gen; trans=""; fragments=[gen]; recombined=true; }
    }
    if(recombined){ /* 组字成功，跳过下面整段抽卡逻辑 */ }
    else {
    const src=norm.length?norm:pool;
    const n=Math.min(randInt(1,3),src.length);
    const tmp=[...src], arr=[], transArr=[];
    for(let i=0;i<n;i++){ const pick=tmp.splice(Math.floor(Math.random()*tmp.length),1)[0]; arr.push(pick.text); if(pick.translation) transArr.push(pick.translation); }
    fragments=[...arr];
    if(cfg.sentenceJoin&&arr.length>1){ const usedSeps=new Set(); function pickUniqSep(){ let s,tries=0; do{s=randomSep();tries++;}while(usedSeps.has(s)&&tries<SEP_POOL.length); usedSeps.add(s); return s; } let joined=arr[0]; for(let si=1;si<arr.length;si++) joined+=pickUniqSep()+arr[si]; text=joined; if(transArr.length){ let tjoin=transArr[0]; for(let si=1;si<transArr.length;si++) tjoin+=pickUniqSep()+transArr[si]; trans=tjoin; } }
    else if(arr.length>1){
      // 连句关闭：每条单独推入 chats，最后一条走正常流程
      let name2=texts.opp_name||"温语", avatar2=imgs.oppAvatar||"", memberId2="";
      if(cfg.groupMode&&groupMembers.length){ const m2=groupMembers[Math.floor(Math.random()*groupMembers.length)]; name2=m2.name; avatar2=m2.avatar||window.DEFAULTS.PH_SVG; memberId2=m2.id; }
      for(let fi=0;fi<arr.length-1;fi++){
        const nt=new Date(now.getTime()+fi*500);
        _addChatMsg({sender:"opp",text:arr[fi],translation:transArr[fi]||"",time:fmtTime(nt),timeWithSec:fmtTime(nt,true),date:fmtDate(nt),ts:nt.getTime(),lyric:false,quote:"",name:name2,memberId:memberId2,fragments:[arr[fi]]});
      }
      text=arr[arr.length-1]; trans=transArr[arr.length-1]||"";
    }
    else { text=arr[0]; if(transArr.length) trans=transArr[0]; }
    }
  }
  /* ⭕ 引用：放开歌词限制，候选池 = 用户消息 + 彼发过的歌词（最近 QUOTE_RANGE 条），存稳定 mid */
  let quote="";
  if(cfg.quoteOn&&Math.random()<QUOTE_CHANCE){
    const cands=chats.filter(c=>c.sender==="self"||c.lyric).slice(-QUOTE_RANGE);
    if(cands.length) quote=makeQuote(cands[Math.floor(Math.random()*cands.length)]);
  }
  let name=texts.opp_name||"温语", avatar=imgs.oppAvatar||"", memberId="";
  if(cfg.groupMode&&groupMembers.length){ const m=groupMembers[Math.floor(Math.random()*groupMembers.length)]; name=m.name; avatar=m.avatar||window.DEFAULTS.PH_SVG; memberId=m.id; }
  _addChatMsg({sender:"opp",text,translation:trans,time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime(),lyric:isLyric,quote,name,memberId,fragments});
  /* ⭐ 改用防抖写入，避免每条消息都完整序列化写入 DB（最大性能瓶颈之一） */
  saveAllDebounced();
  if(currentApp==="chatApp"){ const f=document.getElementById("chatFlow"); const near=f.scrollHeight-f.scrollTop-f.clientHeight<80; if(!near) unreadCount++; appendNewChats(); }
  else {
    /* ⭕ 通知跟随「繁体为主」：正文都显示繁体了，弹窗没道理还是简体 */
    const _last=chats[chats.length-1];
    const _puText=(_last&&_last.tradAuto&&_last.tradPrimary&&cfg.tradPrimary!==false&&_last.translation)?_last.translation:text;
    if(cfg.popupOn) showPopup(_puText,name,avatar);
  }
  notify(text,name,avatar);
  if(cfg.autoTTS && text) playMiniMaxTTS(text);
}

// 主动发送的定时依赖 setTimeout，而手机后台/被系统挂起会直接冻结 JS——
// 标签页被丢弃后重新加载，原来内存里的 activeTimer 随之消失。
// 旧版每次 init() 都会重新随机抽一个等待时长，等于把进度清零，
// 在"频繁被系统回收"的真实使用场景下，主动发送几乎不会真正触发。
// 现在把"下一次该发送的时间点"存进 cfg 并落盘：
// reload 后若已经过了该时间点，立刻补发一条；若还没到，按剩余时间继续倒计时。
function scheduleActive(resume = false){
  if(activeTimer) clearTimeout(activeTimer);
  if(!cfg.activeSend) return;
  const now = Date.now();
  let wait;
  if(resume && cfg.nextActiveAt && cfg.nextActiveAt > now){
    wait = cfg.nextActiveAt - now;
  } else if(resume && cfg.nextActiveAt && cfg.nextActiveAt <= now){
    wait = 0; // 错过的发送时间，回到前台后立即补发，而不是悄悄重新抽签
  } else {
    const m = randInt(cfg.activeMin, cfg.activeMax);
    wait = m * 60 * 1000;
    cfg.nextActiveAt = now + wait;
    saveAllDebounced();
  }
  activeTimer = setTimeout(() => {
    if(!typingNode && !replyTimer) fireReply();
    scheduleActive(false);
  }, wait);
}

window.clearAllChats = async()=>{ if(!confirm("确实要清空？")) return; chats=[]; markStatsDirty(); openTrans=new Set(); renderStart=0; clearBackup(); await saveAll(); renderChats(); toast("已清空"); };
// ⭐ 存储上限（防无限膨胀）
const CHAT_MAX = 2000;
const MAX_STICKERS = 200;
const MAX_CARDS = 5000;
const MAX_SOUNDS = 50;
const MAX_CAROUSEL = 20;
function _addChatMsg(msg) {
  /* ⭕ 每条消息落地前必定有稳定 mid */
  if(!msg.mid) msg.mid=_genMid();
  /* ⭕ 自动繁体译文：只对彼的文字类消息生效，且不覆盖已有（用户手写的）译文。
     ⭕ 注意概率的语义：transProb 决定的是「这条消息是否以繁体为正文」，
        而不是「是否生成译文」—— 译文始终会生成并存档，所以简体为主的那些消息
        点击后照样能展开繁体。想彻底不要繁体，关掉 tradTransOn 总开关。 */
  if(msg.sender==="opp" && cfg.tradTransOn && msg.text && !msg.translation
     && !msg.sticker && !msg.image && !msg.imgId && !msg.painter && !msg.song){
    const t=s2t(msg.text);
    /* tradAuto：这条译文是自动转换来的（而非用户手写），渲染时才知道繁体能否提为正文 */
    if(t && t!==msg.text){
      msg.translation=t; msg.tradAuto=true;
      const _tp=(typeof cfg.transProb==="number")?cfg.transProb:50;
      if(_tp>0 && Math.random()*100<_tp) msg.tradPrimary=true;
    }
  }
  /* ⭕ 消息不落 avatar：头像改由 memberId 查 groupMembers（见 _buildMsgRow）。
     构造处的 avatar 只服务通知/弹窗，不进库 —— 一条消息一份 330KB base64 是纯浪费。 */
  delete msg.avatar;
  chats.push(msg); markStatsDirty();
  if (chats.length > CHAT_MAX + 500) {
    chats = chats.slice(-CHAT_MAX);
    /* ⭐ 裁剪后 DOM 索引偏移，重置渲染游标让 appendNewChats 自动走 renderChats 全量重建 */
    renderedMsgCount = 0; renderStart = 0;
    saveAllDebounced();
  }
}
/* ⭕ 版本与更新记录。
   手机上确认"壳子到底加载的是哪一版"就靠这个 —— WebView 缓存很顽固，
   出问题时第一件事是看版本号变没变，而不是怀疑代码。 */
window.showVersionInfo = () => {
  let html = '<div style="font-size:12px;line-height:1.7;padding:2px 0;">';
  html += `<div style="margin-bottom:10px;">当前版本：<b>v${APP_VERSION}</b><span style="opacity:.6"> · ${APP_BUILD}</span></div>`;
  html += '<div style="font-size:11px;opacity:.6;margin-bottom:6px;">更新记录（新 → 旧）</div>';
  for(const it of APP_CHANGELOG){
    html += '<div style="margin:0 0 10px;padding-left:8px;border-left:2px solid rgba(127,127,127,.25);">';
    html += `<div><b>v${it.v}</b><span style="opacity:.6"> · ${it.d}</span></div>`;
    html += (it.items||[]).map(x=>`<div style="opacity:.85;">· ${escapeHtml(x)}</div>`).join("");
    html += '</div>';
  }
  html += '<div style="font-size:11px;opacity:.6;margin-top:4px;">完整记录见仓库根目录 CHANGELOG.md</div>';
  html += '</div>';
  modal('版本', html);
};

// ⭐ 存储用量估算
window.showStorageInfo = async () => {
  let html = '<div style="font-size:12px;line-height:1.8;padding:4px 0;">';
  html += `<div>🏷 版本：<b>v${APP_VERSION}</b>（${APP_BUILD}）</div>`;
  try {
    const est = await navigator.storage.estimate();
    if (est.usage !== undefined) {
      html += `<div>📦 总用量：<b>${(est.usage/1024/1024).toFixed(2)} MB</b></div>`;
      if (est.quota) html += `<div>📊 配额：${(est.quota/1024/1024).toFixed(0)} MB（${(est.usage/est.quota*100).toFixed(1)}%）</div>`;
    }
  } catch(e) {}
  // 详细数据量统计
  const imgSize = JSON.stringify(imgs).length;
  const chatSize = JSON.stringify(chats).length;
  const stickerSize = JSON.stringify(stickers).length;
  const cardSize = JSON.stringify(cards).length;
  const soundSize = JSON.stringify(sounds).length;
  const ttsCount = (()=>{ let c=0; for(let i=0;i<localStorage.length;i++) if(localStorage.key(i).startsWith('ttsCache_')) c++; return c; })();
  const cfgSize = JSON.stringify(cfg).length + JSON.stringify(texts).length;
  html += `<div>━━━━━━━━━━━━━</div>`;
  html += `<div>🖼 图片：<b>${(imgSize/1024).toFixed(0)} KB</b></div>`;
  html += `<div>💬 聊天：<b>${chats.length} 条</b>（${(chatSize/1024).toFixed(0)} KB）</div>`;
  if(stickers.length) html += `<div>😊 表情：<b>${stickers.length} 个</b>（${(stickerSize/1024).toFixed(0)} KB）</div>`;
  html += `<div>📝 字卡：<b>${cards.length} 张</b>（${(cardSize/1024).toFixed(0)} KB）</div>`;
  html += `<div>⚙ 配置+文案：${(cfgSize/1024).toFixed(0)} KB</div>`;
  if(sounds.length) html += `<div>🔊 音效：<b>${sounds.length} 个</b>（${(soundSize/1024).toFixed(0)} KB）</div>`;
  html += `<div>🎵 TTS缓存：<b>${ttsCount} 条</b></div>`;
  const backupRaw = localStorage.getItem(BACKUP_KEY);
  if (backupRaw) {
    html += `<div>💾 本地备份：<b>${(new Blob([backupRaw]).size/1024).toFixed(1)} KB</b></div>`;
  } else {
    html += `<div>💾 本地备份：<b>无</b></div>`;
  }
  html += '</div>';
  modal('存储用量', html);
};
// ⭐ 清理TTS缓存
window.clearTTSCache = () => {
  if(!confirm('清除所有 TTS 语音缓存？（不影响其他数据）')) return;
  const keys = [];
  for(let i=0;i<localStorage.length;i++) {
    const k = localStorage.key(i);
    if(k.startsWith('ttsCache_')) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
  _ttsMem.clear();
  toast(`已清除 ${keys.length} 条 TTS 缓存`);
};
// ⭐ 清理旧聊天记录（手动）
window.trimOldChats = () => {
  if(!confirm(`保留最近 ${CHAT_MAX} 条，删除更早的 ${Math.max(0,chats.length-CHAT_MAX)} 条？`)) return;
  chats = chats.slice(-CHAT_MAX); markStatsDirty(); renderStart = 0; saveAll(); renderChats(); toast('已清理');
};

// ─── Popup ───
function bindPopup(){
  const p=document.getElementById("msgPopup"); let sy=0,cy=0,dragging=false;
  const ds=e=>{ const t=e.touches?e.touches[0]:e; sy=t.clientY; cy=0; dragging=true; p.style.transition="none"; };
  const dm=e=>{ if(!dragging) return; const t=e.touches?e.touches[0]:e; cy=t.clientY-sy; if(cy>0) cy=cy*.3; p.style.transform=`translateY(${cy}px)`; };
  const de=()=>{ if(!dragging) return; dragging=false; p.style.transition=""; if(cy<-30) hidePopup(); else p.style.transform=""; };
  p.addEventListener("mousedown",ds); p.addEventListener("touchstart",ds,{passive:true});
  document.addEventListener("mousemove",dm); document.addEventListener("touchmove",dm,{passive:true});
  document.addEventListener("mouseup",de); document.addEventListener("touchend",de);
  p.addEventListener("click",()=>{ if(Math.abs(cy)<5){openApp("chatApp");hidePopup();} });
}
function showPopup(text,name,avatar){
  document.getElementById("popAv").src=avatar||imgs.oppAvatar||window.DEFAULTS.PH_SVG;
  document.getElementById("popName").innerText=name||"对方";
  document.getElementById("popTime").innerText=fmtTime(new Date());
  document.getElementById("popMsg").innerText=text.length>60?text.slice(0,60)+"…":text;
  document.getElementById("msgPopup").classList.add("on");
  if(popupTimer) clearTimeout(popupTimer);
  popupTimer=setTimeout(hidePopup,6000);
}
function hidePopup(){ document.getElementById("msgPopup").classList.remove("on"); document.getElementById("msgPopup").style.transform=""; if(popupTimer){clearTimeout(popupTimer);popupTimer=null;} }

/* ⭕ 用户发送图片：复用 fpImg 选择器 + _compressImg 压缩，发送图片消息 */
window.triggerImageSend = ()=>{
  const i=document.getElementById("fpImg"); if(!i) return;
  i.value="";
  imgPickKey="__chat_image_send__";
  i.click();
};

/* ⭕ 统一放大弹窗：支持 painter 画作（iframe）和表情包/图片（img） */
window._openPainterModal = function(seed){
  const modal=document.getElementById("painterModal");
  const card=document.getElementById("painterModalCard");
  if(!modal||!card) return;
  const url=escapeHtml(cfg.painterUrl||"")+"?seed="+encodeURIComponent(seed||"0")+"&auto=1";
  card.innerHTML=`<iframe sandbox="allow-scripts allow-same-origin" src="${url}" loading="eager"></iframe>`;
  card.classList.remove("img");
  modal.classList.add("on");
};
window._openImageModal = function(src){
  const modal=document.getElementById("painterModal");
  const card=document.getElementById("painterModalCard");
  if(!modal||!card) return;
  card.innerHTML=`<img class="media-full" src="${escapeHtml(src)}" alt="">`;
  card.classList.add("img");
  modal.classList.add("on");
};
window._closeMediaModal = function(){
  const modal=document.getElementById("painterModal");
  if(!modal) return;
  modal.classList.remove("on");
  const card=document.getElementById("painterModalCard");
  if(card){ card.innerHTML=""; card.classList.remove("img"); }
};
/* ESC 键也能关闭弹窗 */
document.addEventListener("keydown",e=>{ if(e.key==="Escape") window._closeMediaModal(); });

// ─── Search ───
window.toggleSearch = ()=>{ const sp=document.getElementById("searchPane"); sp.classList.toggle("on"); if(sp.classList.contains("on")){document.getElementById("chatSearch").focus();doSearchChat();} };
window.doSearchChat = ()=>{
  const q=document.getElementById("chatSearch").value.trim().toLowerCase();
  const res=document.getElementById("searchRes"); res.innerHTML="";
  if(!q){res.innerHTML=`<div class="empty-tip">…</div>`;return;}
  const matches=chats.map((c,i)=>({c,i})).filter(x=>!x.c.lyric&&x.c.text.toLowerCase().includes(q));
  if(!matches.length){res.innerHTML=`<div class="empty-tip">无结果</div>`;return;}
  matches.slice(0,30).forEach(x=>{
    const d=document.createElement("div"); d.className="ri";
    const from=x.c.sender==="self"?(texts.l1_name||"我"):(x.c.name||texts.opp_name||"对方");
    const hl=escapeHtml(x.c.text).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),m=>`<mark>${m}</mark>`);
    d.innerHTML=`<div class="from">${escapeHtml(from)} · ${x.c.date||""} ${x.c.time||""}</div>${hl}`;
    d.addEventListener("click",()=>{ document.getElementById("searchPane").classList.remove("on"); jumpToMsg(x.c.mid, x.c.text); });
    res.appendChild(d);
  });
};

// ─── Cards ───
window.renderCards = ()=>{
  const q=(document.getElementById("cardSearch")?.value||"").trim().toLowerCase();
  const deck=document.getElementById("cardDeck"); if(!deck) return;
  deck.innerHTML="";
  const m={};
  cards.forEach(c=>{ (m[c.cat]=m[c.cat]||[]).push(c); });
  const catList=Object.keys(m);
  if(!catList.length){ deck.innerHTML=`<div class="empty-tip" style="padding:40px;text-align:center;">字卡库此时空空如也</div>`; updateBatch(); return; }
  catList.forEach(cat=>{
    const filtered=m[cat].filter(c=>!q||c.text.toLowerCase().includes(q)||(c.translation||"").toLowerCase().includes(q)||cat.toLowerCase().includes(q));
    if(!filtered.length) return;
    const isShield=shieldedCats.includes(cat); const isFold=foldedCats.includes(cat);
    const card=document.createElement("div"); card.className="cat-card";
    let h=`<div class="cat-h ${isShield?"shielded":""} ${isFold?"folded":""}" data-cat="${escapeHtml(cat)}">
      <div class="n"><span class="fold">▾</span>${escapeHtml(cat)}<span style="opacity:.4;font-weight:400;margin-left:4px;font-size:10px;">${filtered.length}</span></div>
      <div class="ops" onclick="event.stopPropagation()">
        <span onclick="toggleCatShield('${escapeAttr(cat)}')">${isShield?"解":"屏"}</span>
        <span onclick="editCat('${escapeAttr(cat)}')">改</span>
        <span class="danger" onclick="delCat('${escapeAttr(cat)}')">删</span>
      </div></div><div class="cat-body">`;
    filtered.forEach(c=>{
      const chkHtml=isBatchSelecting?`<input type="checkbox" class="chk" ${selected.includes(c.id)?"checked":""} onchange="selToggle('${c.id}',this.checked)">`:""
      h+=`<div class="card-item ${c.shielded?"shield":""}">
        ${chkHtml}
        <div class="text">${escapeHtml(c.text).replace(/\n/g,"<br>")}${c.translation?`<span class="tr-tag">${escapeHtml(c.translation)}</span>`:""}</div>
        <div class="ops">
          <span onclick="toggleCardShield('${c.id}')">${c.shielded?"恢":"屏"}</span>
          <span onclick="editCard('${c.id}')">改</span>
          <span class="danger" onclick="delCard('${c.id}')">删</span>
        </div></div>`;
    });
    h+=`</div>`;
    card.innerHTML=h; deck.appendChild(card);
    card.querySelector(".cat-h").addEventListener("click",async e=>{
      if(e.target.closest(".ops")) return;
      if(foldedCats.includes(cat)) foldedCats=foldedCats.filter(x=>x!==cat); else foldedCats.push(cat);
      await saveAll(); window.renderCards();
    });
  });
  updateBatch();
};

window.selToggle = (id,v)=>{ if(v){if(!selected.includes(id))selected.push(id);}else selected=selected.filter(x=>x!==id); updateBatch(); };
function updateBatch(){ const b=document.getElementById("batchBar"); if(!b) return; if(selected.length){b.classList.add("on");document.getElementById("batchCnt").innerText=`已选 ${selected.length}`;} else b.classList.remove("on"); }
window.toggleCatShield  = async c=>{ if(shieldedCats.includes(c)) shieldedCats=shieldedCats.filter(x=>x!==c); else shieldedCats.push(c); await saveAll(); window.renderCards(); };
window.toggleCardShield = async id=>{ const c=cards.find(x=>x.id===id); if(!c) return; c.shielded=!c.shielded; await saveAll(); window.renderCards(); };
window.delCard  = async id=>{ cards=cards.filter(c=>c.id!==id); selected=selected.filter(x=>x!==id); await saveAll(); window.renderCards(); };
window.delCat   = async c=>{ if(!confirm(`整组 [${c}] 将被抹去？`)) return; cards=cards.filter(x=>x.cat!==c); shieldedCats=shieldedCats.filter(x=>x!==c); await saveAll(); window.renderCards(); };
window.editCat  = c=>{ modal("改名",`<input class="fld" id="m_cn" value="${escapeHtml(c)}"><button class="pill-btn" onclick="saveCatName('${escapeAttr(c)}')">确认</button>`); };
window.saveCatName = async old=>{ const v=document.getElementById("m_cn").value.trim(); if(!v) return; cards.forEach(c=>{if(c.cat===old)c.cat=v;}); shieldedCats=shieldedCats.map(x=>x===old?v:x); await saveAll(); window.renderCards(); closeModal(); };
window.editCard = id => {
  const c = cards.find(x => x.id === id);
  if(!c) return;

  const existOpen = document.querySelector(".card-inline-edit.open");
  if(existOpen) {
    existOpen.classList.remove("open");
    setTimeout(() => existOpen.remove(), 350);
    if(existOpen.dataset.editId === id) return;
  }

  const row = document.querySelector(`.card-item [data-idx="${id}"]`)?.closest(".card-item")
    || [...document.querySelectorAll(".card-item")].find(el => {
      const ops = el.querySelector(".ops");
      return ops && ops.innerHTML.includes(`editCard('${id}')`);
    });

  if(!row) return;

  const wrap = document.createElement("div");
  wrap.className = "card-inline-edit";
  wrap.dataset.editId = id;
  wrap.innerHTML = `
    <div class="card-inline-inner">
      <textarea id="ile_t">${escapeHtml(c.text)}</textarea>
      <textarea id="ile_tr" placeholder="译文" style="min-height:40px;">${escapeHtml(c.translation||"")}</textarea>
      <input id="ile_c" value="${escapeHtml(c.cat)}">
      <div class="card-inline-actions">
        <button class="card-inline-btn" onclick="closeInlineEdit()">取消</button>
        <button class="card-inline-btn confirm" onclick="saveInlineEdit('${id}')">确认</button>
      </div>
    </div>`;

  row.after(wrap);
  requestAnimationFrame(() => wrap.classList.add("open"));
  wrap.querySelector("#ile_t").focus();
};

window.closeInlineEdit = () => {
  const el = document.querySelector(".card-inline-edit");
  if(!el) return;
  el.classList.remove("open");
  setTimeout(() => el.remove(), 350);
};

window.saveInlineEdit = async id => {
  const c = cards.find(x => x.id === id);
  if(!c) return;
  const t  = document.getElementById("ile_t")?.value.trim();
  const tr = document.getElementById("ile_tr")?.value.trim();
  const ct = document.getElementById("ile_c")?.value.trim();
  if(!t) return;
  c.text = t; c.translation = tr; c.cat = ct || "未命名";
  await saveAll();
  window.closeInlineEdit();
  window.renderCards();
};

window.saveCardEdit = async id=>{ const c=cards.find(x=>x.id===id); if(!c) return; c.text=document.getElementById("m_t").value.trim(); c.translation=document.getElementById("m_tr").value.trim(); c.cat=document.getElementById("m_c").value.trim()||"未命名"; await saveAll(); window.renderCards(); closeModal(); };
window.openAddCard = ()=>{
  const cats=[...new Set(cards.map(c=>c.cat).filter(Boolean))];
  const first=cats[0]||"未命名";
  const catHtml=cats.length
    ?`<div class="cat-dd" id="cat-dd"><button class="fld cat-dd-btn" type="button" onclick="toggleCatDd(event)"><span id="cat-dd-label">${escapeHtml(first)}</span><span class="cat-dd-arrow">›</span></button><div class="cat-dd-list" id="cat-dd-list">${cats.map(c=>`<div class="cat-dd-item" onclick="pickCat('${escapeHtml(c)}')">${escapeHtml(c)}</div>`).join("")}<div class="cat-dd-item cat-dd-new" onclick="pickCatNew()">＋ 新增分类</div></div></div><input class="fld" id="m_c" value="${escapeHtml(first)}" style="display:none">`
    :`<input class="fld" id="m_c" placeholder="分类名" value="未命名">`;
  modal("新增",`<textarea class="fld area" id="m_t" placeholder="…"></textarea><textarea class="fld area" id="m_tr" placeholder="译文" style="min-height:50px;"></textarea>${catHtml}<button class="pill-btn" onclick="addCardConfirm()">完成</button>`);
};
window.toggleCatDd=(e)=>{ e.stopPropagation(); const l=document.getElementById("cat-dd-list"); if(!l) return; const open=l.classList.toggle("open"); if(open) setTimeout(()=>document.addEventListener("click",closeCatDd,{once:true}),0); };
window.closeCatDd=()=>{ const l=document.getElementById("cat-dd-list"); if(l) l.classList.remove("open"); };
window.pickCat=(cat)=>{ const lbl=document.getElementById("cat-dd-label"); const inp=document.getElementById("m_c"); if(lbl) lbl.textContent=cat; if(inp){ inp.value=cat; inp.style.display="none"; } const dd=document.getElementById("cat-dd"); if(dd) dd.style.display=""; closeCatDd(); };
window.pickCatNew=()=>{ closeCatDd(); const dd=document.getElementById("cat-dd"); const inp=document.getElementById("m_c"); if(dd) dd.style.display="none"; if(inp){ inp.style.display=""; inp.value=""; inp.focus(); } };
window.selectAddCat=(el,cat)=>{ document.querySelectorAll(".cat-chip").forEach(c=>c.classList.remove("active")); el.classList.add("active"); const inp=document.getElementById("m_c"); if(inp) inp.value=cat; };
window.addCardConfirm = async()=>{ const t=document.getElementById("m_t").value.trim(); const tr=document.getElementById("m_tr").value.trim(); const c=document.getElementById("m_c").value.trim()||"未命名"; if(!t) return; if(c==="歌词库"){const lines=t.split("\n").map(l=>l.trim()).filter(l=>l&&!isLyricMetaLine(l)); if(cards.length+lines.length>MAX_CARDS){toast(`字卡已达上限 ${MAX_CARDS} 张`,"warn");return;} lines.forEach((line,i)=>cards.push({id:"c"+Date.now()+i,text:line,translation:tr,cat:c}));}else{if(cards.length>=MAX_CARDS){toast(`字卡已达上限 ${MAX_CARDS} 张`,"warn");return;}cards.push({id:"c"+Date.now(),text:t,translation:tr,cat:c});} await saveAll(); window.renderCards(); closeModal(); };
window.openBulkAdd = ()=>{ modal("批量导入",`<div class="fld-tip">【分组名】→ 内容，【翻译】分隔译文</div><textarea class="fld area" id="m_bulk" style="min-height:140px;"></textarea><button class="pill-btn" onclick="bulkAddDo()">导入</button>`); };
function parseTxtToCards(raw){ let cur="未命名",n=0,out=[]; raw.split("\n").forEach(line=>{ const t=line.trim(); if(!t) return; const mm=t.match(/^【(.+)】$/); if(mm){cur=mm[1].trim();return;} let txt=t,tr=""; if(t.includes("【翻译】")){const p=t.split("【翻译】");txt=p[0].trim();tr=p[1].trim();} if(cur==="歌词库"&&isLyricMetaLine(txt)) return; out.push({id:"c"+Date.now()+(n++),text:txt,translation:tr,cat:cur}); }); return out; }
async function importWithMergePrompt(newCards){ if(!newCards.length) return;
  modal("导入方式", `<div style="font-size:calc(var(--fs)*.88);color:var(--text-mute);margin-bottom:14px;">共 <b style="color:var(--text)">${newCards.length}</b> 条</div>
    <div class="pill-btn-group" style="flex-direction:column;gap:8px;">
      <button class="pill-btn" onclick="doImport('skip')">跳过重复，追加新增</button>
      <button class="pill-btn danger" onclick="doImport('replace')">清空原有，全部覆盖</button>
    </div>`);
  window._pendingImport = newCards;
}
window.doImport = async mode => {
  const newCards = window._pendingImport || []; window._pendingImport = null;
  if(mode==='replace'){
    if(newCards.length > MAX_CARDS){ toast(`导入数量超过上限 ${MAX_CARDS}，已截断`,"warn"); cards = newCards.slice(0, MAX_CARDS); }
    else cards = newCards;
  } else {
    newCards.forEach(nc=>{ if(cards.length>=MAX_CARDS) return; if(!cards.some(c=>c.text===nc.text&&c.cat===nc.cat)) cards.push(nc); });
  }
  await saveAll(); window.renderCards(); closeModal(); toast(`已导入 ${newCards.length} 条`);
};
window.bulkAddDo = async()=>{ const v=document.getElementById("m_bulk").value; if(!v.trim()) return; closeModal(); await importWithMergePrompt(parseTxtToCards(v)); };
window.batchDelete = async()=>{ if(!selected.length) return; cards=cards.filter(c=>!selected.includes(c.id)); selected=[]; await saveAll(); window.renderCards(); };
window.batchShield = async v=>{ if(!selected.length) return; cards.forEach(c=>{if(selected.includes(c.id))c.shielded=v;}); selected=[]; await saveAll(); window.renderCards(); };
window.batchMove = ()=>{ if(!selected.length) return; const cs=Array.from(new Set(cards.map(c=>c.cat))); const opts=cs.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join(""); modal("批量移组",`<select class="fld" id="m_tg">${opts}</select><input class="fld" id="m_new" placeholder="或新建分组"><button class="pill-btn" onclick="batchMoveDo()">移</button>`); };
window.batchMoveDo = async()=>{ const tg=document.getElementById("m_new").value.trim()||document.getElementById("m_tg").value; if(!tg) return; cards.forEach(c=>{if(selected.includes(c.id))c.cat=tg;}); selected=[]; await saveAll(); window.renderCards(); closeModal(); };
window.openTxtIO = ()=>{ modal("TXT",`<div class="pill-btn-group"><button class="pill-btn" onclick="exportCards()">导出</button><button class="pill-btn" onclick="document.getElementById('fpCard').click();closeModal();">导入</button></div>`); };
window.exportCards = ()=>{ const mm={}; cards.forEach(c=>{(mm[c.cat]=mm[c.cat]||[]).push(c.translation?(c.text+"【翻译】"+c.translation):c.text);}); let s=""; for(const k in mm) s+=`【${k}】\n`+mm[k].join("\n")+"\n\n"; const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([s],{type:"text/plain;charset=utf-8"})); a.download=`字卡_${Date.now()}.txt`; a.click(); closeModal(); };
function onPickCardTxt(e){ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=async ev=>{ await importWithMergePrompt(parseTxtToCards(ev.target.result)); }; r.readAsText(f); }
window.toggleBatchMode = ()=>{ isBatchSelecting=!isBatchSelecting; const btn=document.querySelector(".batch-toggle-btn"); if(btn) btn.style.opacity=isBatchSelecting?"1":".5"; if(!isBatchSelecting) selected=[]; window.renderCards(); };

// ─── 字卡库 Tab 切换（字卡 / 表情包共用同一个 App 头部按钮，按当前 Tab 分派）───
window.switchCardsTab = tab => {
  cardsActiveTab = tab;
  document.querySelectorAll("#cardsApp .stab").forEach(b=>b.classList.toggle("active", b.dataset.tab===tab));
  document.querySelectorAll("#cardsApp .stab-panel").forEach(p=>p.classList.toggle("active", p.id==="cstab-"+tab));
  document.getElementById("cardsBulkBtn")?.classList.toggle("hidden", tab!=="cards");
  document.getElementById("cardsTxtBtn")?.classList.toggle("hidden", tab!=="cards");
  document.getElementById("cardsCloudBtn")?.classList.toggle("hidden", tab!=="cards");
  document.getElementById("cardsCloudSkBtn")?.classList.toggle("hidden", tab==="cards");
  const btn=document.querySelector(".batch-toggle-btn");
  if(btn) btn.style.opacity=(tab==="stickers"?isStickerBatchSelecting:isBatchSelecting)?"1":".5";
  if(tab==="stickers"){ stickerLibPage=0; window.renderStickers(); }
};
window.headerToggleBatch = ()=>{ if(cardsActiveTab==="stickers") window.toggleStickerBatchMode(); else window.toggleBatchMode(); };
window.headerAdd = ()=>{ if(cardsActiveTab==="stickers") window.openAddSticker(); else window.openAddCard(); };

// ─── 表情包库 ───
window.renderStickers = () => {
  const grid=document.getElementById("stickerGrid"); if(!grid) return;
  grid.innerHTML="";
  if(!stickers.length){ grid.innerHTML=`<div class="empty-tip" style="grid-column:1/-1;padding:40px;text-align:center;">表情包库此时空空如也</div>`; updateStickerBatch(); return; }
  const totalPages=Math.ceil(stickers.length/STICKER_LIB_PAGE_SIZE);
  if(stickerLibPage>=totalPages) stickerLibPage=totalPages-1;
  if(stickerLibPage<0) stickerLibPage=0;
  const page=stickers.slice(stickerLibPage*STICKER_LIB_PAGE_SIZE,(stickerLibPage+1)*STICKER_LIB_PAGE_SIZE);
  page.forEach(s=>{
    const it=document.createElement("div");
    it.className="sticker-item"+(s.shielded?" shielded":"");
    const chkHtml=isStickerBatchSelecting?`<input type="checkbox" class="chk" ${stickerSelected.includes(s.id)?"checked":""} onchange="event.stopPropagation();stickerSelToggle('${s.id}',this.checked)">`:"";
    it.innerHTML=`
      <img src="${s.cachedSrc||s.src}" loading="lazy" onload="_cacheStickerThumbnailById('${s.id}')" onerror="this.parentElement.classList.add('broken')">
      <span class="sti-op sti-shield" onclick="event.stopPropagation();toggleStickerShield('${s.id}')" title="${s.shielded?"恢复":"屏蔽"}">${s.shielded?STICKER_EYE_OFF_SVG:STICKER_EYE_SVG}</span>
      <span class="sti-op sti-del" onclick="event.stopPropagation();delSticker('${s.id}')" title="删除">${STICKER_X_SVG}</span>
      ${chkHtml}`;
    if(isStickerBatchSelecting){
      it.addEventListener("click", e=>{ if(e.target.closest(".chk")||e.target.closest(".sti-op")) return; const cb=it.querySelector(".chk"); if(!cb) return; cb.checked=!cb.checked; stickerSelToggle(s.id, cb.checked); });
    }
    grid.appendChild(it);
  });
  if(totalPages>1){
    const pager=document.createElement("div");
    pager.className="sticker-pager";
    pager.innerHTML=`<button class="sp-pg-btn" onclick="stickerLibPrevPage()" ${stickerLibPage===0?'disabled':''}>◀</button><span class="sp-pg-num">${stickerLibPage+1}/${totalPages}</span><button class="sp-pg-btn" onclick="stickerLibNextPage()" ${stickerLibPage>=totalPages-1?'disabled':''}>▶</button>`;
    grid.appendChild(pager);
  }
  updateStickerBatch();
};
window.stickerLibPrevPage=()=>{if(stickerLibPage>0){stickerLibPage--;window.renderStickers();}};
window.stickerLibNextPage=()=>{const tp=Math.ceil(stickers.length/STICKER_LIB_PAGE_SIZE);if(stickerLibPage<tp-1){stickerLibPage++;window.renderStickers();}};
const STICKER_EYE_SVG=`<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
const STICKER_EYE_OFF_SVG=`<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 4.22-5.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
const STICKER_X_SVG=`<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

window.toggleStickerBatchMode = () => {
  isStickerBatchSelecting=!isStickerBatchSelecting;
  const btn=document.querySelector(".batch-toggle-btn");
  if(btn) btn.style.opacity=isStickerBatchSelecting?"1":".5";
  if(!isStickerBatchSelecting) stickerSelected=[];
  window.renderStickers();
};
window.stickerSelToggle = (id,v) => { if(v){ if(!stickerSelected.includes(id)) stickerSelected.push(id); } else stickerSelected=stickerSelected.filter(x=>x!==id); updateStickerBatch(); };
function updateStickerBatch(){ const b=document.getElementById("stickerBatchBar"); if(!b) return; if(stickerSelected.length){ b.classList.add("on"); document.getElementById("stickerBatchCnt").innerText=`已选 ${stickerSelected.length}`; } else b.classList.remove("on"); }
window.toggleStickerShield = async id => { const s=_findSticker(id); if(!s) return; s.shielded=!s.shielded; await saveAll(); window.renderStickers(); };
window.delSticker = async id => { stickers=stickers.filter(s=>s.id!==id); stickerSelected=stickerSelected.filter(x=>x!==id); await saveAll(); window.renderStickers(); };
window.batchShieldStickers = async v => { if(!stickerSelected.length) return; stickers.forEach(s=>{ if(stickerSelected.includes(s.id)) s.shielded=v; }); stickerSelected=[]; await saveAll(); window.renderStickers(); };
window.batchDeleteStickers = async () => { if(!stickerSelected.length) return; stickers=stickers.filter(s=>!stickerSelected.includes(s.id)); stickerSelected=[]; await saveAll(); window.renderStickers(); };

window.openAddSticker = () => {
  modal("添加表情包", `
    <div class="fld-tip" style="margin:-6px 0 0;">已有 ${stickers.length} 个 · 仅保存在本机，不计入导出备份</div>
    <div class="tab-switch" id="addSkTabs">
      <span class="ts-opt active" data-m="upload" onclick="switchAddStickerMode('upload')">本机上传</span>
      <span class="ts-opt" data-m="url" onclick="switchAddStickerMode('url')">链接导入</span>
    </div>
    <div class="add-sk-panel active" id="addSkPanel-upload">
      <div class="sk-upload-zone" onclick="triggerStickerPick()">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>点击选择图片 / GIF</span>
        <span class="sk-upload-sub">支持多选 · 从相册一次添加多个</span>
      </div>
    </div>
    <div class="add-sk-panel" id="addSkPanel-url">
      <textarea class="fld area" id="m_skUrls" placeholder="https://example.com/a.png&#10;https://example.com/b.gif&#10;每行一个链接" oninput="updateSkUrlCount()" style="min-height:120px;"></textarea>
      <div class="fld-tip" id="skUrlCount">尚未输入链接</div>
      <button class="pill-btn" onclick="addStickersFromUrls()">批量导入</button>
    </div>
  `);
};
window.switchAddStickerMode = mode => {
  document.querySelectorAll("#addSkTabs .ts-opt").forEach(el=>el.classList.toggle("active", el.dataset.m===mode));
  document.querySelectorAll(".add-sk-panel").forEach(el=>el.classList.toggle("active", el.id==="addSkPanel-"+mode));
};
window.updateSkUrlCount = () => {
  const el=document.getElementById("skUrlCount"); if(!el) return;
  const n=document.getElementById("m_skUrls").value.split("\n").map(s=>s.trim()).filter(Boolean).length;
  el.textContent = n ? `检测到 ${n} 条链接` : "尚未输入链接";
};
window.addStickersFromUrls = async () => {
  const ta=document.getElementById("m_skUrls"); if(!ta) return;
  const lines=ta.value.split("\n").map(s=>s.trim()).filter(Boolean);
  if(!lines.length){ toast("请先粘贴链接","warn"); return; }
  if(stickers.length + lines.length > MAX_STICKERS){ toast(`表情包已达上限 ${MAX_STICKERS} 个`,"warn"); return; }
  /* ⭕ 用 _stickerKey 而不是裸 src：同一张图的 raw / jsdelivr 两个域名算同一条 */
  const existing=new Set(stickers.map(s=>_stickerKey(s.src)));
  let added=0, skipped=0;
  lines.forEach((url,i)=>{
    const k=_stickerKey(url);
    if(k && existing.has(k)){ skipped++; return; }
    stickers.push({id:"sk"+Date.now()+i, src:url, type:"url", shielded:false, addedAt:Date.now()});
    existing.add(k); added++;
  });
  await saveAll(); window.renderStickers(); closeModal();
  toast(skipped?`已添加 ${added} 个（跳过 ${skipped} 个重复）`:`已添加 ${added} 个`);
};
window.triggerStickerPick = () => { closeModal(); const i=document.getElementById("fpSticker"); i.value=""; i.click(); };
function onPickSticker(e){
  const fs=Array.from(e.target.files); if(!fs.length) return;
  if(stickers.length + fs.length > MAX_STICKERS){ toast(`表情包已达上限 ${MAX_STICKERS} 个`,"warn"); return; }
  let done=0, added=0;
  fs.forEach((f,i)=>{
    _compressStickerImage(f).then(async data=>{
      if(data) { stickers.push({id:"sk"+Date.now()+added, src:data, type:"upload", shielded:false, addedAt:Date.now()}); added++; }
      done++;
      if(done===fs.length){ await saveAll(); window.renderStickers(); toast(`已添加 ${added} 个`); }
    });
  });
}
/* ⭕ 按 id 找表情；找不到再查去重留下的别名表（cfg.stickerAlias）—— 指向的还是同一张图。
   ⛔ 别在各处直接写 stickers.find(x=>x.id===id)：那样会漏掉"被合并掉的那条"，
      表现为聊天里某个表情突然变成占位图。 */
function _findSticker(id){
  let s = stickers.find(x=>x.id===id);
  if(!s && cfg.stickerAlias && cfg.stickerAlias[id]) s = stickers.find(x=>x.id===cfg.stickerAlias[id]);
  return s;
}
function resolveStickerSrc(id){ const s=_findSticker(id); return s ? (s.cachedSrc || s.src) : window.DEFAULTS.PH_SVG; }
/* ⭕ v1.15.0：按 imgId 取聊天图片。查不到（同步未带图 / 图被清）→ 返回 PH_SVG 占位图。
   ⛔ 必须返回一个**可用的 src**，不能返回 undefined/空串 —— 否则 <img> 会走 onerror，
   给容器挂上 img-broken，表现成"图裂"而不是"待同步"的中性占位。 */
function resolveChatImg(id){ const d=chatImgs[id]; return d || window.DEFAULTS.PH_SVG; }

/* 外部 URL 贴纸首次加载成功后，canvas 转 base64 缩略图缓存，后续不依赖外链 */
function _cacheStickerThumbnailById(id) {
  const s = _findSticker(id);
  if (!s || s.cachedSrc || s.type !== "url") return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const maxW = 200;
      const w = Math.min(img.naturalWidth, maxW);
      const h = img.naturalHeight * (w / img.naturalWidth);
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      s.cachedSrc = c.toDataURL("image/jpeg", 0.5);
      saveAllDebounced();
    } catch(_) { /* 跨域画布污染，放弃缓存 */ }
  };
  img.onerror = () => {}; /* 加载失败不处理，已在 onerror 里显示占位 */
  img.src = s.src;
}

// ─── 聊天内快捷发送表情包 ───
window.toggleStickerPicker = () => {
  const p=document.getElementById("stickerPicker"); if(!p) return;
  const opening=!p.classList.contains("on");
  p.classList.toggle("on");
  if(opening){ stickerPickerPage=0; renderStickerPickerGrid(); }
};
window.gotoStickerLibrary = () => {
  document.getElementById("stickerPicker")?.classList.remove("on");
  closeApp("chatApp");
  openApp("cardsApp"); switchCardsTab("stickers");
};
function renderStickerPickerGrid(){
  const g=document.getElementById("spGrid"); if(!g) return;
  if(!stickers.length){ g.innerHTML=`<div class="sp-empty">还没有表情包<span onclick="gotoStickerLibrary()">去添加</span></div>`; return; }
  const visible=stickers.filter(s=>!s.shielded);
  if(!visible.length){ g.innerHTML=`<div class="sp-empty">没有可用的表情包</div>`; return; }
  const totalPages=Math.ceil(visible.length/STICKER_PICKER_PAGE_SIZE);
  if(stickerPickerPage>=totalPages) stickerPickerPage=totalPages-1;
  if(stickerPickerPage<0) stickerPickerPage=0;
  const page=visible.slice(stickerPickerPage*STICKER_PICKER_PAGE_SIZE,(stickerPickerPage+1)*STICKER_PICKER_PAGE_SIZE);
  let html=page.map(s=>`<div class="sp-item" onclick="sendSticker('${s.id}')"><img src="${s.cachedSrc||s.src}" loading="lazy" onload="_cacheStickerThumbnailById('${s.id}')" onerror="this.parentElement.classList.add('broken')"></div>`).join("");
  if(totalPages>1){
    html+=`<div class="sp-pager">
      <button class="sp-pg-btn" onclick="event.stopPropagation();stickerPickerPrevPage()" ${stickerPickerPage===0?'disabled':''}>◀</button>
      <span class="sp-pg-num">${stickerPickerPage+1}/${totalPages}</span>
      <button class="sp-pg-btn" onclick="event.stopPropagation();stickerPickerNextPage()" ${stickerPickerPage>=totalPages-1?'disabled':''}>▶</button>
    </div>`;
  }
  g.innerHTML=html;
}
window.stickerPickerPrevPage=()=>{if(stickerPickerPage>0){stickerPickerPage--;renderStickerPickerGrid();}};
window.stickerPickerNextPage=()=>{const v=stickers.filter(s=>!s.shielded);const tp=Math.ceil(v.length/STICKER_PICKER_PAGE_SIZE);if(stickerPickerPage<tp-1){stickerPickerPage++;renderStickerPickerGrid();}};
window.sendSticker = async id => {
  const s=_findSticker(id); if(!s) return;
  const now=new Date();
  _addChatMsg({sender:"self", text:"[表情包]", sticker:true, stickerId:id, time:fmtTime(now), timeWithSec:fmtTime(now,true), date:fmtDate(now), ts:now.getTime(),...(pendingQuote?{quote:pendingQuote}:{})});
  window.clearPendingQuote();
  if(cfg.soundOn) playSoundById(cfg.activeSoundId || "__builtin_thud1__");
  if(navigator.vibrate) navigator.vibrate(18);
  document.getElementById("stickerPicker")?.classList.remove("on");
  await saveAll(); appendNewChats();
};

// ─── Members ───
window.renderMembers = ()=>{
  const d=document.getElementById("memberDeck"); if(!d) return; d.innerHTML="";
  groupMembers.forEach((m,i)=>{
    const c=document.createElement("div"); c.className="gm-card";
    c.innerHTML=`<img class="av ph" src="${m.avatar||window.DEFAULTS.PH_SVG}"><div class="nm"><input type="text" value="${escapeHtml(m.name)}"></div><span class="rm">剔除</span>`;
    c.querySelector("img").addEventListener("click",()=>{ memberPickIdx=i; imgPickKey="__memberAvatar__"; document.getElementById("fpImg").value=""; document.getElementById("fpImg").click(); });
    c.querySelector("input").addEventListener("change",async e=>{ groupMembers[i].name=e.target.value.trim()||"未命名"; await saveAll(); refreshIdentityViews(); });
    c.querySelector(".rm").addEventListener("click",async()=>{ groupMembers.splice(i,1); await saveAll(); window.renderMembers(); refreshIdentityViews(); });
    d.appendChild(c);
  });
  if(!groupMembers.length) d.innerHTML+=`<div class="empty-tip">群组暂无成员</div>`;
};
window.addMember = async()=>{ groupMembers.push({id:"g"+Date.now(),name:"新成员",avatar:""}); await saveAll(); window.renderMembers(); };

// ─── Texts ───
function renderTextsApp(){
  const deck=document.getElementById("textsDeck"); if(!deck) return; deck.innerHTML="";
  TEXT_GROUPS.forEach(g=>{
    const section=document.createElement("div"); section.className="text-section";
    const hdr=document.createElement("div"); hdr.className="text-section-header"; hdr.innerText=g.h; section.appendChild(hdr);
    const grid=document.createElement("div"); grid.className="text-grid";
    g.keys.forEach(it=>{
      const v=g.isCfg?(cfg[it.k]||""):(texts[it.k]||"");
      const cell=document.createElement("div"); cell.className="text-cell";
      cell.innerHTML=`<div class="text-cell-label">${it.l}</div><input class="text-cell-input" data-k="${it.k}" data-iscfg="${g.isCfg?1:0}" value="${escapeHtml(v)}" placeholder="未定义">`;
      grid.appendChild(cell);
    });
    section.appendChild(grid); deck.appendChild(section);
  });
  deck.querySelectorAll("input[data-k]").forEach(el=>{
    el.addEventListener("change",async()=>{ if(el.dataset.iscfg==="1") cfg[el.dataset.k]=el.value; else texts[el.dataset.k]=el.value; await saveAll(); syncUI(); });
  });
}

window.exportTexts = ()=>{
  const data={cfg_texts:{},texts};
  ["welcomeTitle","welcomeText","inputPlaceholder","typingText","readText"].forEach(k=>{data.cfg_texts[k]=cfg[k]||"";});
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"})); a.download=`文案_${Date.now()}.json`; a.click(); toast("文案已导出");
};

// ─── Stats ───
function renderStats() {
  const deck = document.getElementById("statsDeck");
  if (!deck) return;
  deck.innerHTML = "";

  // ⭐ 单次遍历聚合，消除 6+ 次全量 filter/forEach
  const S = computeStatsCache();
  const { selfMsgs, oppMsgs, lyricMsgs, allReal, selfChars, oppChars, avgLen,
          hours, dateMap, firstDate, lastDate, longestMsg, shieldedCards } = S;

  // ── 概览 ──
  const ovSec = document.createElement("div");
  ovSec.innerHTML = `<div class="stat-block-header"><span class="stat-block-title">概览</span></div>`;
  const ovGrid = document.createElement("div");
  ovGrid.className = "stat-overview-grid";

  const ovData = [
    { n: allReal.length,  l: "对话总计", sub: `歌词 ${lyricMsgs.length} 条`, full: true },
    { n: selfMsgs.length, l: "我",        sub: `落字 ${selfChars}` },
    { n: oppMsgs.length,  l: "彼",        sub: `落字 ${oppChars}` },
    { n: cards.length,    l: "字卡",       sub: `屏蔽 ${shieldedCards}` },
    { n: avgLen,          l: "均长",       sub: "字 / 条" }
  ];

  ovData.forEach((d) => {
    const card = document.createElement("div");
    card.className = "stat-ov-card" + (d.full ? " full" : "");
    card.innerHTML = `<div class="ov-n">${d.n}</div><div class="ov-l">${d.l}</div><div class="ov-sub">${d.sub}</div><div class="ov-bar"></div>`;
    ovGrid.appendChild(card);
  });

  ovSec.appendChild(ovGrid);
  deck.appendChild(ovSec);

  // ── 昼夜分布 ──
  const hourSec = document.createElement("div");
  hourSec.innerHTML = `<div class="stat-block-header"><span class="stat-block-title">昼夜分布</span></div>`;
  const maxH = Math.max(1, ...hours);

  const hourGrid = document.createElement("div");
  hourGrid.className = "stat-hour-grid";
  hours.forEach((h, i) => {
    const cell = document.createElement("div");
    cell.className = "stat-hour-cell";
    cell.style.opacity = h === 0 ? "0.06" : String(0.15 + (h / maxH) * 0.85);
    cell.title = `${String(i).padStart(2,"0")}:00 · ${h} 条`;
    hourGrid.appendChild(cell);
  });

  const hourLabels = document.createElement("div");
  hourLabels.className = "stat-hour-labels";
  ["0","6","12","18","23"].forEach(t => {
    const s = document.createElement("span"); s.innerText = t;
    hourLabels.appendChild(s);
  });

  hourSec.appendChild(hourGrid);
  hourSec.appendChild(hourLabels);
  deck.appendChild(hourSec);

  // ── 速率趋势 ──
  const dates = Object.keys(dateMap).sort();
  if (dates.length > 1) {
    const rateSec = document.createElement("div");
    rateSec.innerHTML = `<div class="stat-block-header">
        <span class="stat-block-title">速率</span>
        <span class="stat-block-meta">近 ${Math.min(dates.length, 30)} 天</span>
      </div>`;

    const rateWrap = document.createElement("div");
    rateWrap.className = "stat-rate-wrap";
    const recent = dates.slice(-30);
    const maxV = Math.max(1, ...recent.map(d => dateMap[d]));
    const chart = document.createElement("div");
    chart.className = "stat-rate-chart";

    recent.forEach(d => {
      const bar = document.createElement("div");
      bar.className = "stat-rate-bar";
      bar.style.height = `${Math.max(4, (dateMap[d] / maxV) * 100)}%`;
      bar.title = `${d} · ${dateMap[d]} 条`;
      chart.appendChild(bar);
    });

    const rl = document.createElement("div");
    rl.className = "stat-rate-labels";
    [recent[0], recent[Math.floor(recent.length/2)], recent[recent.length-1]].forEach(d => {
      const s = document.createElement("span"); s.innerText = d ? d.slice(5) : "";
      rl.appendChild(s);
    });

    rateWrap.appendChild(chart);
    rateWrap.appendChild(rl);
    rateSec.appendChild(rateWrap);
    deck.appendChild(rateSec);
  }

  // ── 高频词 ──
  const wordSec = document.createElement("div");
  wordSec.innerHTML = `<div class="stat-block-header"><span class="stat-block-title">高频词</span></div>`;
  const tabWrap = document.createElement("div");
  tabWrap.style.cssText = "display:flex;flex-direction:column;gap:8px;";

  const tabBtns   = document.createElement("div");
  tabBtns.className = "stat-tab-btns";
  const tabPanels = document.createElement("div");
  tabPanels.className = "stat-tab-panels";
  tabPanels.style.borderRadius = "16px";

  const tabData = [
    { l: "我", arr: selfMsgs.map(m => m.text) },
    {
      l: "彼",
      arr: (() => {
        const a = [];
        oppMsgs.forEach(m => cfg.sentenceJoin && m.fragments?.length ? a.push(...m.fragments) : a.push(m.text));
        return a;
      })()
    },
    { l: "歌", arr: lyricMsgs.map(m => m.text) }
  ];

  tabData.forEach((td, i) => {
    const btn = document.createElement("button");
    btn.className = "stat-tab-btn" + (i === 0 ? " active" : "");
    btn.innerText = td.l;
    btn.onclick = () => {
      tabBtns.querySelectorAll(".stat-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tabPanels.querySelectorAll(".stat-tab-panel").forEach((p, pi) => p.classList.toggle("active", pi === i));
    };
    tabBtns.appendChild(btn);

    const panel = document.createElement("div");
    panel.className = "stat-tab-panel" + (i === 0 ? " active" : "");
    const top = tally(td.arr);
    if (!top.length) {
      panel.innerHTML = `<div class="empty-tip">—</div>`;
    } else {
      const list = document.createElement("div");
      list.className = "stat-word-list";
      const maxVal = top[0][1];
      top.forEach(([word, cnt], ri) => {
        const item = document.createElement("div");
        item.className = "stat-word-item";
        item.innerHTML = `<div class="swi-top">
            <span class="swi-rank">${ri + 1}</span>
            <span class="swi-text">${escapeHtml(word)}</span>
            <span class="swi-cnt">${cnt}</span>
          </div>
          <div class="swi-track"><div class="swi-fill" style="width:${(cnt / maxVal * 100).toFixed(1)}%"></div></div>`;
        list.appendChild(item);
      });
      panel.appendChild(list);
    }
    tabPanels.appendChild(panel);
  });

  tabWrap.appendChild(tabBtns);
  tabWrap.appendChild(tabPanels);
  wordSec.appendChild(tabWrap);
  deck.appendChild(wordSec);

  // ── 细节 ──
  if (allReal.length) {
    const detailSec = document.createElement("div");
    detailSec.innerHTML = `<div class="stat-block-header"><span class="stat-block-title">细节</span></div>`;
    const dGrid = document.createElement("div");
    dGrid.className = "stat-detail-grid";
    [
      { l: "首条",     v: firstDate || "—" },
      { l: "最新",     v: lastDate  || "—" },
      { l: "最长",     v: longestMsg ? longestMsg.text.slice(0, 20) + (longestMsg.text.length > 20 ? "…" : "") : "—" },
      { l: "最长字数", v: longestMsg ? `${longestMsg.text.length} 字` : "—" }
    ].forEach(d => {
      const card = document.createElement("div");
      card.className = "stat-detail-card";
      card.innerHTML = `<div class="dc-label">${d.l}</div><div class="dc-value">${escapeHtml(d.v)}</div>`;
      dGrid.appendChild(card);
    });
    detailSec.appendChild(dGrid);
    deck.appendChild(detailSec);
  }
}

function tally(arr){ const m={}; arr.forEach(t=>{if(!t)return;m[t]=(m[t]||0)+1;}); return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,10); }

// ─── Backup ───
window.openBackup = ()=>{ modal("数据",`<div class="pill-btn-group"><button class="pill-btn" onclick="fullExport()">导出备份</button><button class="pill-btn" onclick="document.getElementById('fpJson').click();closeModal();">导入备份</button></div>`); };
window.fullExport = ()=>{ /* ⭕ 必须剔除本机令牌：备份文件一旦外发（发群/云盘/进仓库），syncToken 就泄露了 */ const data={cfg:_syncCfgOut(),texts,cards,chats,members:groupMembers,shieldedCats,foldedCats,anniversaries,carousel,imgs,sounds,surveys,surveyRecords,stickers,msgs,chatImgs}; const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"})); a.download=`SilentChamber_${Date.now()}.json`; a.click(); toast("备份完成"); closeModal(); };
function onPickJson(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=async ev=>{ try{ const d=JSON.parse(ev.target.result); /* ⭕ 令牌是本机设置，导入备份不得覆盖它（与 _syncApply 的保护逻辑保持一致） */ if(d.cfg) cfg=Object.assign(cfg,d.cfg,{syncToken:cfg.syncToken}); if(d.texts) texts=d.texts; if(d.cards) cards=d.cards; if(d.chats) {chats=d.chats; markStatsDirty();} if(d.members) groupMembers=d.members; if(d.shieldedCats) shieldedCats=d.shieldedCats; if(d.foldedCats) foldedCats=d.foldedCats; if(d.anniversaries) anniversaries=d.anniversaries; if(d.carousel) carousel=d.carousel; if(d.imgs) imgs=d.imgs; if(d.sounds) sounds=d.sounds; if(d.surveys) surveys=d.surveys; if(d.surveyRecords) surveyRecords=d.surveyRecords; if(d.stickers) stickers=d.stickers; if(d.msgs){ msgs=d.msgs; normalizeMsgs(); } if(d.chatImgs) chatImgs=d.chatImgs; /* ⭕ v1.15.0 导入完整备份（fullExport 产物）带 chatImgs，图直接可用 */ /* ⭕ 导入的若是**老备份**（图片还内嵌在 m.image 里），这里顺手搬运一次（幂等）。 新备份里消息只有 imgId，没有 image → 这个调用什么都不做。 */ try{ _migrateChatsExtractImages(); }catch(e){} await saveAll(); syncUI(); renderChats(); window.renderCards(); window.renderMembers(); window.renderStickers(); renderCarousel(); renderMosaic(); renderSurveys(); closeBoardPost(); renderBoard(); toast("还原完毕"); }catch{ alert("数据损坏"); } };
  r.readAsText(f);
}
window.factoryReset = async()=>{ if(!confirm("确认销毁并重置？")) return; clearBackup(); sessionStorage.removeItem("skip_backup_restore"); indexedDB.deleteDatabase(DB_NAME); setTimeout(()=>location.reload(),200); };

// ─── Modal / Toast ───
function modal(t,html){ document.getElementById("mTitle").innerText=t; document.getElementById("mBody").innerHTML=html; document.getElementById("modal").classList.add("on"); }
window.closeModal = ()=>{ document.getElementById("modal").classList.remove("on"); };
// 替换原有 toast 函数，支持类型参数
let toastTimer = null;

function toast(t, type = "default") {
  const el = document.getElementById("toast");
  el.innerText = t;
  el.className = "toast";            // 重置类名
  if (type === "warn") el.classList.add("warn");
  el.classList.add("on");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 2000);
}

// ─── App nav ───
function setDockActive(id){ document.querySelectorAll(".dock-btn").forEach(b=>b.classList.toggle("active",b.dataset.app===id)); }
window.openApp = id=>{
  const el=document.getElementById(id); if(!el) return;
  el.classList.add("active"); currentApp=id; setDockActive(id);
  if(id==="cardsApp")      { window.renderCards(); window.renderStickers(); }
  if(id==="groupApp")      window.renderMembers();
  if(id==="statsApp")      { renderStats(); renderSurveys(); }
  if(id==="textsApp")      renderTextsApp();
  if(id==="chatApp"){
    /* ⭕ 脏检查：聊天 DOM 一直在（closeApp 只是 remove class），特征没变就直接复用。
       原来每次进聊天页都 innerHTML="" 重建最近 150 条 —— 那是"点进聊天界面慢"的主因。
       特征对不上、或 DOM 是空的（首次进入 / 数据整体换过），就照旧重建。 */
    if(!chatViewIsFresh()) renderChats();
    unreadCount=0; showHomeTypingBar(false); updateScrollBot();
    if((replyTimer)&&!typingNode){
      /* 分帧渲染进行中——延迟到渲染完成后再插入 typing 节点 */
      if(_chatRenderInProgress){
        _pendingChatOps = (f) => {
          if(!f||!replyTimer||typingNode) return;
          typingNode=document.createElement("div"); typingNode.className="row opp";
          const av=imgs.oppAvatar||window.DEFAULTS.PH_SVG;
          typingNode.innerHTML=`${cfg.showAvatar?`<div class="av-col"><img class="av" src="${av}"></div>`:""}
            <div class="typing-pure"><span class="t-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="tip-text">${escapeHtml(cfg.typingText||"正在输入")}</span></div>`;
          f.appendChild(typingNode); f.scrollTop=f.scrollHeight;
        };
      } else {
        const f=document.getElementById("chatFlow");
        if(f){
          typingNode=document.createElement("div"); typingNode.className="row opp";
          const av=imgs.oppAvatar||window.DEFAULTS.PH_SVG;
          typingNode.innerHTML=`${cfg.showAvatar?`<div class="av-col"><img class="av" src="${av}"></div>`:""}
            <div class="typing-pure"><span class="t-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="tip-text">${escapeHtml(cfg.typingText||"正在输入")}</span></div>`;
          f.appendChild(typingNode); f.scrollTop=f.scrollHeight;
        }
      }
    }
  }
};
window.closeApp = id=>{ document.getElementById(id).classList.remove("active"); if(currentApp===id){currentApp=null;setDockActive(""); if(id==="chatApp"){ if(typingNode){typingNode.remove();typingNode=null;} if(replyTimer) showHomeTypingBar(true); }} };

// ─── Music ───
// ─── 主页播放按钮绑定 ───
function bindMusicPlayer() {
  const btn = document.getElementById("musicPlay"); if (!btn) return;
  btn.addEventListener("click", async e => {
    e.stopPropagation();
    if (musicAudio && !musicAudio.paused) {
      musicAudio.pause();
      return;
    }
    if (musicAudio && musicAudio.paused) {
      try { await musicAudio.play(); } catch(e) {
        if (e.name === "NotAllowedError") toast("请再点一次", "warn");
      }
      return;
    }
    // 首次播放：预加载曲库并随机开始
    _playNextRandom();
  });

  // 点击封面或歌名区打开歌词窗口（排除 editable 元素）
  const card = document.getElementById("musicCard");
  if (card) {
    card.addEventListener("click", e => {
      if (e.target.closest(".editable") || e.target.closest(".play-btn") || e.target.closest(".music-next-btn")) return;
      openMusicPlayer();
    });
  }
}

// 下一首
window.musicNext = () => {
  if (!_shufflePool.length) { _playNextRandom(); return; }
  if (musicAudio) { musicAudio.pause(); musicAudio = null; }
  _playNextRandom();
};

// 上一首（回退到 shuffle pool 前一首）
window.musicPrev = () => {
  if (_shufflePool.length && _shuffleIdx > 0) {
    _shuffleIdx = Math.max(0, _shuffleIdx - 2);
  }
  if (musicAudio) { musicAudio.pause(); musicAudio = null; }
  _playNextRandom();
};

function updatePlayIcon(playing) {
  const btn = document.getElementById("musicPlay"); if (!btn) return;
  btn.classList.toggle("on", playing);
  document.getElementById("playIcon").innerHTML = playing
    ? `<rect x="6" y="5" width="3" height="14" fill="currentColor"/><rect x="15" y="5" width="3" height="14" fill="currentColor"/>`
    : `<polygon points="5 4 21 12 5 20 5 4" fill="currentColor"/>`;
  document.getElementById("musicCard")?.classList.toggle("playing", playing);
  document.getElementById("musicEq")?.classList.toggle("on", playing);
  const pBtn = document.getElementById("mpPlay");
  if (pBtn) pBtn.innerHTML = playing
    ? `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="6" y="5" width="3" height="14"/><rect x="15" y="5" width="3" height="14"/></svg>`
    : `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="5 4 21 12 5 20 5 4"/></svg>`;
}

// ─── Welcome ───
let _welcomeRaf = null;
// ─── Welcome canvas particles + typographic animation ───
function initWelcomeParticles() {
  const canvas = document.getElementById("wCanvas");
  if (!canvas) return;
  const vp = document.getElementById("vp");
  canvas.width  = vp.offsetWidth  || 390;
  canvas.height = vp.offsetHeight || 844;
  const ctx = canvas.getContext("2d");
  const isDark = document.documentElement.getAttribute("data-theme") !== "light";
  const color = isDark ? "255,255,255" : "0,0,0";

  const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + .3,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    o: Math.random() * .5 + .2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.o})`;
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 80) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${color},${.10 * (1 - d/80)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    _welcomeRaf = requestAnimationFrame(draw);
  }
  draw();
  document.getElementById("welcome").addEventListener("click", () => {
    cancelAnimationFrame(_welcomeRaf);
    _welcomeRaf = null;
  }, { once: true });

  // ── 字符排版初始化 ──
  buildTypoWelcome();
}

function buildTypoWelcome() {
  const stage = document.getElementById("wTypoStage");
  if (!stage) return;
  stage.innerHTML = "";

  const vp = document.getElementById("vp");
  const vw = Math.min(vp?.offsetWidth || window.innerWidth, 430);
  // Scale factor relative to 390px design baseline
  const sf = Math.min(vw / 390, 1.08);
  function sc(n) { return Math.round(n * sf); }

  const isLight = document.documentElement.getAttribute("data-theme") === "light";

  // ── Helper: give the SVG's "primary" strokes (class="draw") a real
  //    stroke draw-in instead of a flat opacity fade — keeps the same
  //    motion language as the red curves below, while leaving the small
  //    dots/diagonals as quiet secondary fade-only decoration.
  function drawSvgStrokes(container, baseDelay) {
    setTimeout(() => {
      container.querySelectorAll(".draw").forEach((el, i) => {
        try {
          const finalOpacity = el.getAttribute("opacity") || "0.16";
          el.removeAttribute("opacity");
          el.style.opacity = "0";
          el.style.setProperty("--draw-final-opacity", finalOpacity);
          const len = Math.ceil(el.getTotalLength()) + 3;
          el.style.setProperty("--draw-len", len);
          el.style.strokeDasharray = len;
          el.style.strokeDashoffset = len;
          el.style.animation = `wDecoDraw 1.05s cubic-bezier(.22,.61,.36,1) ${baseDelay + i * 0.12}s forwards`;
        } catch (e) {
          el.style.animation = `wDecoFade .8s ease ${baseDelay}s both`;
        }
      });
    }, 30);
  }

  // ── Helper: create animated character span ──
  function makeChar(ch, {
    size, extraClass = "",
    ml = 0, mb = 0, mt = 0,
    delay = 0, dur = 1.0, rise = 18, finalOpacity = 0.9
  }) {
    const span = document.createElement("span");
    span.className = "w-char" + (extraClass ? " " + extraClass : "");
    span.textContent = ch;
    span.style.fontSize = Math.max(11, sc(size)) + "px";
    if (ml) span.style.marginLeft = sc(ml) + "px";
    if (mb) span.style.marginBottom = sc(mb) + "px";
    if (mt) span.style.marginTop = sc(mt) + "px";
    span.style.setProperty("--char-delay", delay + "s");
    span.style.setProperty("--char-dur", dur + "s");
    span.style.setProperty("--char-rise", rise + "px");
    span.style.setProperty("--char-opacity", finalOpacity + "");
    setTimeout(() => span.classList.add("revealed"), 10);
    return span;
  }

  // ── 1. Hairline (now the opening mark — center jewel dot via CSS) ──
  const hairline = document.createElement("div");
  hairline.className = "w-hairline";
  hairline.style.animationDelay = "0.08s";
  hairline.style.marginBottom = sc(10) + "px";
  stage.appendChild(hairline);

  // ── 2. Main title chars: 幸 逢 ──
  const mainRow = document.createElement("div");
  mainRow.className = "w-char-row";
  mainRow.style.marginBottom = sc(4) + "px";

  // 幸 — solid fill, sits lower (marginTop pushes it down in flex-end context)
  mainRow.appendChild(makeChar("幸", {
    size: 76, extraClass: "",
    ml: 0, mb: 0, mt: 12,
    delay: 0.24, dur: 1.1, rise: 28, finalOpacity: 0.95
  }));

  // 逢 — gradient fill, raised up (marginBottom lifts it), slight left overlap
  mainRow.appendChild(makeChar("逢", {
    size: 64, extraClass: "grad",
    ml: -6, mb: 20, mt: 0,
    delay: 0.46, dur: 1.14, rise: 22, finalOpacity: 0.95
  }));

  stage.appendChild(mainRow);

  // ── 3. Thin mid deco ──
  const midDeco = document.createElement("div");
  midDeco.className = "w-deco-lines";
  midDeco.style.cssText = `
    animation-delay:.78s;
    color:rgba(${isLight?"28,22,14":"255,255,255"},.45);
    height:${sc(18)}px;
    margin:${sc(2)}px 0;
  `;
  midDeco.innerHTML = `<svg viewBox="0 0 280 18" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <line x1="0" y1="9" x2="280" y2="9" stroke="currentColor" stroke-width=".38" stroke-dasharray="3 10" opacity=".1"/>
    <circle cx="56"  cy="9" r="2"   fill="none" stroke="currentColor" stroke-width=".42" opacity=".14"/>
    <circle cx="224" cy="9" r="2"   fill="none" stroke="currentColor" stroke-width=".42" opacity=".14"/>
    <line x1="116" y1="3" x2="164" y2="15" stroke="currentColor" stroke-width=".28" opacity=".07"/>
    <line x1="116" y1="15" x2="164" y2="3" stroke="currentColor" stroke-width=".28" opacity=".07"/>
    <circle class="draw" cx="140" cy="9" r="4.5" fill="none" stroke="currentColor" stroke-width=".45" opacity=".14"/>
    <circle cx="140" cy="9" r="1.4" style="fill:var(--accent)" opacity=".5"/>
  </svg>`;
  stage.appendChild(midDeco);
  drawSvgStrokes(midDeco, 0.92);

  // ── 4. Sub chars: 此 间 无 声 ──
  const subRow = document.createElement("div");
  subRow.className = "w-char-row";
  subRow.style.marginBottom = sc(4) + "px";

  // 此 — feather (bottom fade), small, raised
  subRow.appendChild(makeChar("此", {
    size: 20, extraClass: "feather",
    ml: 0, mb: 10, mt: 0,
    delay: 0.88, dur: 0.92, rise: 14, finalOpacity: 0.62
  }));
  // 间 — solid, largest sub-char, baseline anchor
  subRow.appendChild(makeChar("间", {
    size: 33, extraClass: "",
    ml: -3, mb: 0, mt: 0,
    delay: 1.02, dur: 0.98, rise: 16, finalOpacity: 0.88
  }));
  // 无 — blur only, smallest, tiny raise
  subRow.appendChild(makeChar("无", {
    size: 17, extraClass: "blurred",
    ml: -2, mb: 6, mt: 0,
    delay: 1.16, dur: 0.87, rise: 11, finalOpacity: 0.48
  }));
  // 声 — gradient, medium, slight raise + overlap
  subRow.appendChild(makeChar("声", {
    size: 27, extraClass: "grad",
    ml: -3, mb: 4, mt: 0,
    delay: 1.30, dur: 0.95, rise: 15, finalOpacity: 0.76
  }));

  stage.appendChild(subRow);

  // ── 5. Garnet winding curves（石榴红家族，呼应 --accent 品牌色）──
  const curvesWrap = document.createElement("div");
  curvesWrap.className = "w-red-curves";
  // Three paths: main wave, counter-wave, thin accent
  curvesWrap.innerHTML = `<svg viewBox="0 0 300 42" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="wRedGrad1" x1="0%" y1="0%" x2="100%" y2="60%">
        <stop offset="0%"  stop-color="#5c1c28"/>
        <stop offset="45%" stop-color="#b04c60"/>
        <stop offset="100%" stop-color="#6b2434"/>
      </linearGradient>
      <linearGradient id="wRedGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"  stop-color="#3a121b"/>
        <stop offset="50%" stop-color="#7a3344"/>
        <stop offset="100%" stop-color="#3a121b"/>
      </linearGradient>
    </defs>
    <path class="w-red-curve-path"
      d="M-6,21 C12,7 34,36 58,19 C82,3 100,32 130,16 C160,0 176,28 206,14 C236,0 254,26 280,13 C294,6 303,16 308,14"
      fill="none" stroke="url(#wRedGrad1)" stroke-width="1.15" stroke-linecap="round"
      style="--curve-final-opacity:0.74;--curve-delay:1.35s"/>
    <path class="w-red-curve-path"
      d="M-6,31 C18,43 42,19 72,33 C102,47 120,23 152,37 C184,51 206,27 236,39 C258,48 278,29 308,35"
      fill="none" stroke="url(#wRedGrad2)" stroke-width="0.62" stroke-linecap="round"
      style="--curve-final-opacity:0.46;--curve-delay:1.56s"/>
    <path class="w-red-curve-path thin"
      d="M16,11 C44,23 62,5 96,17 C130,29 148,9 180,21 C212,33 232,11 262,23 C280,30 296,15 308,19"
      fill="none" stroke="#b04c60" stroke-width="0.38" stroke-linecap="round"
      style="--curve-final-opacity:0.26;--curve-delay:1.78s"/>
  </svg>`;
  stage.appendChild(curvesWrap);

  // Measure real path lengths for precise draw-in animation
  setTimeout(() => {
    curvesWrap.querySelectorAll(".w-red-curve-path").forEach((path) => {
      try {
        const len = Math.ceil(path.getTotalLength()) + 5;
        const delay = path.style.getPropertyValue("--curve-delay") || "1.35s";
        path.style.setProperty("--curve-len", len);
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.style.animation = `wRedCurveDraw 2.2s cubic-bezier(.22,.61,.36,1) ${delay} forwards`;
      } catch(e) {
        // Fallback: simple fade
        path.style.animation = `wDecoFade 1.4s ease var(--curve-delay, 1.35s) both`;
        path.style.opacity = "";
      }
    });
  }, 60);

  // ── 6. Closing seal mark（收尾印记，替代原英文小字，与顶部发丝线宝石点首尾呼应）──
  const seal = document.createElement("div");
  seal.className = "w-seal";
  stage.appendChild(seal);
}
// 3秒后自动进入，无需点击
setTimeout(()=>{ const w=document.getElementById("welcome"); if(!w||w.classList.contains("gone"))return; w.classList.add("gone"); setTimeout(()=>w.style.display="none",800); if(_welcomeRaf){cancelAnimationFrame(_welcomeRaf);_welcomeRaf=null;} chime(); },3000);
document.getElementById("welcome").addEventListener("click",()=>{ const w=document.getElementById("welcome"); if(w.classList.contains("gone"))return; w.classList.add("gone"); setTimeout(()=>w.style.display="none",800); if(_welcomeRaf){cancelAnimationFrame(_welcomeRaf);_welcomeRaf=null;} chime(); });

document.addEventListener("DOMContentLoaded", init);
window.openFontModal = () => {
  modal("字体", `
    <div class="text-cell-label" style="margin-bottom:4px;font-size:11px;color:var(--text-mute)">字体族名</div>
    <input class="fld" id="m_fontName" value="${escapeHtml(cfg.customFont)}" placeholder="留空使用宋体">
    <div class="text-cell-label" style="margin:10px 0 4px;font-size:11px;color:var(--text-mute)">CSS / URL</div>
    <textarea class="fld area" id="m_fontCss" style="min-height:60px;">${escapeHtml(cfg.customFontCss)}</textarea>
    <button class="pill-btn" onclick="saveFont()">保存</button>
  `);
};
window.saveFont = async () => {
  cfg.customFont    = document.getElementById("m_fontName").value.trim();
  cfg.customFontCss = document.getElementById("m_fontCss").value.trim();
  await saveAll(); applyCustomFont(); closeModal(); toast("已更新");
};
// ─── Custom Home ───
const HOME_COMPONENTS = [
  { id:"l1-profile",   l:"个人卡片" },
  { id:"anni-wrap",    l:"纪念日" },
  { id:"stagger-photos", l:"交错图片" },
  { id:"music-card",   l:"音乐" },
  { id:"list-card",    l:"列表" },
  { id:"polaroid-strip", l:"拍立得" },
  { id:"aes-card",     l:"美学卡片" }   // ← 新增
];

window.openCustomHomeApp = () => {
  openApp("customHomeApp");
  const cssTa = document.getElementById("ch_css");
  const jsTa  = document.getElementById("ch_js");
  if (cssTa) cssTa.value = cfg.customHomeCss || "";
  if (jsTa)  jsTa.value  = cfg.customHomeJs  || "";
  renderHomeVisGrid();
};

function renderHomeVisGrid() {
  const grid = document.getElementById("chVisGrid");
  if (!grid) return;
  grid.innerHTML = "";
  HOME_COMPONENTS.forEach(comp => {
    const vis = cfg.homeVisibility?.[comp.id] !== false;
    const row = document.createElement("div");
    row.className = "cfg-row";
    row.innerHTML = `
      <span class="cfg-label">${comp.l}</span>
      <div class="sw ${vis?"on":""}" id="chvis_${comp.id}" onclick="toggleHomeVis('${comp.id}')">
        <div class="sw-indicator"></div>
      </div>`;
    grid.appendChild(row);
  });
}

window.toggleHomeVis = async id => {
  if (!cfg.homeVisibility) cfg.homeVisibility = {};
  cfg.homeVisibility[id] = cfg.homeVisibility[id] === false ? true : false;
  await saveAll();
  renderHomeVisGrid();
  applyCustomHomeStyles();
};

window.applyCustomHome = async () => {
  cfg.customHomeCss = document.getElementById("ch_css")?.value || "";
  cfg.customHomeJs  = document.getElementById("ch_js")?.value  || "";
  await saveAll();
  applyCustomHomeStyles();
  toast("已应用");
};

function applyCustomHomeStyles() {
  // CSS
  const styleEl = document.getElementById("user-home-css");
  let css = cfg.customHomeCss || "";

  // 组件可见性转 CSS
  if (cfg.homeVisibility) {
    HOME_COMPONENTS.forEach(comp => {
      if (cfg.homeVisibility[comp.id] === false) {
        css += `.${comp.id} { display: none !important; }`;
      }
    });
  }
  if (styleEl) styleEl.innerHTML = css;

  // JS（沙盒执行，报错不崩溃）
  if (cfg.customHomeJs) {
    try { new Function(cfg.customHomeJs)(); } catch(e) { toast("JS 错误：" + e.message); }
  }
}

window.applyHomePreset = async name => {
  const presets = {
    minimal: {
      css: ".l1-profile,.anni-wrap,.stagger-photos,.music-card,.list-card,.polaroid-strip{display:none!important}",
      js: ""
    },
    photo: {
      css: ".l1-profile,.anni-wrap,.list-card{display:none!important}.stagger-photos{grid-column:span 6;aspect-ratio:2}.polaroid-strip{grid-column:span 6}",
      js: ""
    },
    reset: { css: "", js: "" }
  };
  const p = presets[name];
  if (!p) return;
  cfg.customHomeCss = p.css;
  cfg.customHomeJs  = p.js;
  cfg.homeVisibility = {};
  await saveAll();
  applyCustomHomeStyles();
  const cssTa = document.getElementById("ch_css");
  const jsTa  = document.getElementById("ch_js");
  if (cssTa) cssTa.value = p.css;
  if (jsTa)  jsTa.value  = p.js;
  renderHomeVisGrid();
  toast("预设已载入");
};
window.openBgCssModal = () => {
  modal("背景 / CSS", `
    <div class="pill-btn-group">
      <button class="pill-btn" onclick="triggerBgPick()">上传聊天背景</button>
      <button class="pill-btn" onclick="resetBg()">重置背景</button>
    </div>
    <div class="text-cell-label" style="margin:12px 0 4px;font-size:11px;color:var(--text-mute)">气泡 CSS</div>
    <textarea class="fld area" id="m_bubbleCss" style="min-height:60px;">${escapeHtml(cfg.customBubble)}</textarea>
    <div class="text-cell-label" style="margin:10px 0 4px;font-size:11px;color:var(--text-mute)">聊天 CSS</div>
    <textarea class="fld area" id="m_chatCss" style="min-height:60px;">${escapeHtml(cfg.customChatCss)}</textarea>
    <button class="pill-btn" onclick="saveBgCss()">保存</button>
  `);
};
window.triggerBgPick = () => { imgPickKey = "chatBg"; closeModal(); document.getElementById("fpImg").value=""; document.getElementById("fpImg").click(); };
window.saveBgCss = async () => {
  cfg.customBubble  = document.getElementById("m_bubbleCss").value.trim();
  cfg.customChatCss = document.getElementById("m_chatCss").value.trim();
  await saveAll(); applyCustomBubble(); applyCustomChatCss(); closeModal(); toast("已更新");
};
window.triggerHomeBgPick = () => {
  imgPickKey = "homeBg";
  document.getElementById("fpImg").value = "";
  document.getElementById("fpImg").click();
};

window.triggerAesBodyBgPick = () => {
  imgPickKey = "aes_body_bg";
  closeModal();
  document.getElementById("fpImg").value = "";
  document.getElementById("fpImg").click();
};

window.clearAesBodyBg = async () => {
  delete imgs.aes_body_bg;
  await saveAll();
  applyAesBodyBg();
  closeModal();
  toast("已清除");
};

window.resetHomeBg = async () => {
  delete imgs.homeBg;
  await saveAll();
  applyHomeBg();
  toast("已重置");
};
window.openSoundModal = () => {
  modal("音效管理", `
    <div id="modalSndList"></div>
    <div class="pill-btn-group" style="margin-top:10px;">
      <button class="pill-btn" onclick="document.getElementById('fpSnd').click()">上传音效</button>
    </div>
  `);
  renderModalSoundList();
};

function renderModalSoundList() {
  const c = document.getElementById("modalSndList");
  if (!c) return;
  const all = [...BUILTIN_SOUNDS, ...sounds];
  c.innerHTML = "";

  // Header
  const hdr = document.createElement("div");
  hdr.style.cssText = "font-size:10px;color:var(--text-mute);letter-spacing:2px;padding:0 0 8px;";
  hdr.innerText = "选择发送音效";
  c.appendChild(hdr);

  all.forEach((s, i) => {
    const isBuiltin = !!s.builtin;
    const isActive = (cfg.activeSoundId || "__builtin_thud1__") === s.id;

    const li = document.createElement("div");
    li.className = "snd-li";
    li.style.cssText = "cursor:pointer;border-radius:10px;transition:background .15s;" + (isActive ? "background:var(--bg-soft);" : "");

    // Radio indicator
    const radio = document.createElement("div");
    radio.style.cssText = `width:14px;height:14px;border-radius:50%;border:1.5px solid ${isActive ? "var(--text)" : "var(--border)"};flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:.2s;`;
    if (isActive) {
      const dot = document.createElement("div");
      dot.style.cssText = "width:7px;height:7px;border-radius:50%;background:var(--text);";
      radio.appendChild(dot);
    }

    const nameEl = document.createElement("span");
    nameEl.className = "nm";
    nameEl.style.flex = "1";
    if (isBuiltin) {
      nameEl.innerText = s.name;
    } else {
      const inp = document.createElement("input");
      inp.value = s.name || "未命名";
      inp.style.cssText = "border:none;background:transparent;font-size:inherit;color:var(--text-mute);width:100%;outline:none;";
      inp.addEventListener("change", async () => {
        sounds[i - BUILTIN_SOUNDS.length].name = inp.value.trim() || "未命名";
        await saveAll();
      });
      inp.onclick = e => e.stopPropagation();
      nameEl.appendChild(inp);
    }

    const ops = document.createElement("div");
    ops.className = "ops";
    ops.style.opacity = "1";

    const playBtn = document.createElement("span"); playBtn.innerText = "试听";
    playBtn.onclick = e => {
      e.stopPropagation();
      playSoundById(s.id);
    };
    ops.appendChild(playBtn);

    if (!isBuiltin) {
      const delBtn = document.createElement("span"); delBtn.className = "danger"; delBtn.innerText = "删除";
      delBtn.onclick = async e => {
        e.stopPropagation();
        sounds.splice(i - BUILTIN_SOUNDS.length, 1);
        if (cfg.activeSoundId === s.id) cfg.activeSoundId = "__builtin_thud1__";
        await saveAll();
        renderModalSoundList();
      };
      ops.appendChild(delBtn);
    }

    li.appendChild(radio);
    li.appendChild(nameEl);
    li.appendChild(ops);

    li.addEventListener("click", async () => {
      cfg.activeSoundId = s.id;
      await saveAll();
      playSoundById(s.id);
      renderModalSoundList();
    });

    c.appendChild(li);
  });
}
// ─── 密码锁屏校验逻辑 ───
window.checkLock = () => {
  const val = document.getElementById("lockInput").value.trim();
  const err = document.getElementById("lockError");
  const lockScreen = document.getElementById("lockScreen");
  if (!val) return;

  // 将输入的字符串转化为异或字符比对（混淆密码机制，代码中绝不包含明文答案）
  const hashed = Array.from(val.toLowerCase()).map(c => String.fromCharCode(c.charCodeAt(0) ^ 42)).join("");
  
  // "RLISFP" 即为 "xfcylz" 经 XOR 42 加密后的哈希值
  if (hashed === "RLISFP") {
    localStorage.setItem("sc_authed", "true");
    document.documentElement.classList.add("is-authenticated");
    lockScreen.classList.add("gone");
    setTimeout(() => {
      lockScreen.style.display = "none";
    }, 500);
    // 解锁时播放开屏提示音
    if (typeof chime === "function") chime();
  } else {
    err.innerText = "密码错误，请尝试重新解析谜题。";
    err.classList.add("show");
    document.getElementById("lockInput").value = "";
    setTimeout(() => {
      err.classList.remove("show");
    }, 2000);
  }
};

// 页面加载时的状态同步
document.addEventListener("DOMContentLoaded", () => {
  const lockScreen = document.getElementById("lockScreen");
  if (localStorage.getItem("sc_authed") === "true") {
    if (lockScreen) lockScreen.style.display = "none";
  }
});
// (旧版 playMiniMaxTTS 已合并到高级 TTS 函数，此处已移除重复定义)
// ════════════════════════════════════════════
// ══ 连句符号设置 ══
// ════════════════════════════════════════════
window.openSepSettings = () => {
  renderSepSettings();
};

function renderSepSettings(){
  const pool = cfg.sepPool && cfg.sepPool.length ? cfg.sepPool : SEP_POOL;
  let html = `<div class="sep-list">`;
  pool.forEach((sym,i)=>{
    html += `<div class="sep-chip"><span class="sep-sym">${escapeHtml(sym)}</span><span class="sep-del" onclick="removeSepSymbol(${i})">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </span></div>`;
  });
  html += `<div class="sep-chip sep-add">
      <input id="sepNewSym" placeholder="+" maxlength="4">
    </div>
    </div>
    <button class="pill-btn" onclick="addSepSymbol()">添加符号</button>`;
  modal("连句符号", html);
}

window.addSepSymbol = async () => {
  const el = document.getElementById("sepNewSym");
  const v = el.value.trim();
  if (!v){ toast("请输入符号","warn"); return; }
  if (!cfg.sepPool) cfg.sepPool = [...SEP_POOL];
  cfg.sepPool.push(v);
  await saveAll();
  renderSepSettings();
};

window.removeSepSymbol = async (i) => {
  if (!cfg.sepPool) cfg.sepPool = [...SEP_POOL];
  if (cfg.sepPool.length <= 1){ toast("至少保留一个符号","warn"); return; }
  cfg.sepPool.splice(i,1);
  await saveAll();
  renderSepSettings();
};

// ════════════════════════════════════════════
// ══ 组字设置 ══
// ════════════════════════════════════════════
window.openRecombSettings = () => { renderRecombSettings(); };

function renderRecombSettings(){
  const row=(label,desc,inner)=>`<div class="sinput-row" style="margin-top:10px;flex-direction:column;align-items:stretch;gap:6px;">
      <span class="sinput-label">${label}${desc?` <span style="opacity:.6;font-size:calc(var(--fs)*.66);">${desc}</span>`:""}</span>
      ${inner}
    </div>`;
  const slide=(id,key,min,max,step,unit)=>`<div class="range-pair" style="align-items:center;">
        <input class="inp sm" type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${cfg[key]}"
          oninput="document.getElementById('${id}Val').innerText=this.value+'${unit}';cfgSet('${key}',+this.value)" style="width:100%;">
        <span id="${id}Val" style="min-width:36px;text-align:right;font-size:calc(var(--fs)*.75);color:var(--text-mute);">${cfg[key]}${unit}</span>
      </div>`;
  const stats = (()=>{ try{ const M=_getMarkov();
    const dictPart = M.dict ? ` · 词典 ${M.dict} 条` : "";
    if(!M.src && !M.dict) return `无可用语料（组字会直接退回抽卡）`;
    return `可用字卡 ${M.src} 张${dictPart} · 不同汉字 ${M.chars.length} 个 · 语料 ${M.bytes} 字`;
  }catch(e){ return "—"; } })();
  const dictInfo = (()=>{
    if(!cfg.dictOn) return "已关闭 —— 只用语卡组字";
    const d=cloudDictCache;
    if(!d) return "未加载 · 点下方按钮拉取";
    const when=cfg.cloudDictLastSync ? ` · ${new Date(cfg.cloudDictLastSync).toLocaleDateString()}` : "";
    /* ⭕ 成语库只把「写景」那部分当意象片段，其余只建链 —— 所以展示要分开说，
       否则看到的条数会比原库少一大截，像没拉全 */
    return d.total
      ? `写景 ${d.words.length} 条（筛选自 ${d.total} 条成语）${when}`
      : `${d.words.length+d.sents.length} 条（词 ${d.words.length} / 句 ${d.sents.length}）${when}`;
  })();
  const charInfo = (()=>{
    if(!cfg.charOn) return "已关闭 —— 起字只用成语字频那 3000 字";
    const c=cloudCharCache;
    if(!c) return "未加载 · 点下方按钮拉取（不影响组字）";
    const maxS=+(cfg.charMaxStroke||0);
    /* ⭕ 真正进池多少由 _buildMarkov 的活字过滤决定（16141 里通常只有 ~3000 合格），
       所以这里读已建好的索引，别报一个假数字 */
    const pool=(_mkCache&&_mkCache.chars)?_mkCache.chars.length:null;
    return `${c.total} 字${pool?` · 起字池 ${pool}`:""}${maxS?` · 笔画 ≤ ${maxS}`:""}`;
  })();
  const xhyInfo = (()=>{
    if(!cfg.xhyOn) return "已关闭 —— 起字池只有成语字频那 3000 字";
    const c=cloudXhyCache;
    if(!c) return "未加载 · 点下方按钮拉取（可选）";
    const pool=(_mkCache&&_mkCache.chars)?_mkCache.chars.length:null;
    return `${c.segs.length} 子句${pool?` · 起字池 ${pool}`:""}`;
  })();
  const html = `
    <div style="font-size:calc(var(--fs)*.72);color:var(--text-mute);margin-bottom:2px;">${stats}</div>
    <div style="margin-top:10px;font-size:calc(var(--fs)*.74);">云端词典</div>
    <div class="stoggle-row">
      <span>使用云端词典</span>
      <div class="sw" id="sw_dictOn" onclick="cfgToggle('dictOn', event)"><div class="sw-indicator"></div></div>
    </div>
    <div id="dictStatus" style="font-size:calc(var(--fs)*.7);color:var(--text-mute);margin:2px 0 6px;">${dictInfo}</div>
    <button class="pill-btn" onclick="window.refreshCloudDict()">拉取 / 刷新词典</button>
    <div style="margin-top:12px;font-size:calc(var(--fs)*.74);">云端汉字表 <span style="opacity:.6;font-size:calc(var(--fs)*.66);">扩充起字池，可选</span></div>
    <div class="stoggle-row">
      <span>使用云端汉字表</span>
      <div class="sw" id="sw_charOn" onclick="cfgToggle('charOn', event)"><div class="sw-indicator"></div></div>
    </div>
    <div id="charStatus" style="font-size:calc(var(--fs)*.7);color:var(--text-mute);margin:2px 0 6px;">${charInfo}</div>
    <button class="pill-btn" onclick="window.refreshCloudChar()">拉取 / 刷新汉字表</button>
    ${row("笔画上限","0 = 不限（推荐）。笔画数判不了生僻字，楍 才 12 画", slide("charStroke","charMaxStroke",0,25,1," 画",""))}
    <div style="margin-top:12px;font-size:calc(var(--fs)*.74);">云端歇后语 <span style="opacity:.6;font-size:calc(var(--fs)*.66);">扩起字池 + 补口语链</span></div>
    <div class="stoggle-row">
      <span>使用云端歇后语</span>
      <div class="sw" id="sw_xhyOn" onclick="cfgToggle('xhyOn', event)"><div class="sw-indicator"></div></div>
    </div>
    <div id="xhyStatus" style="font-size:calc(var(--fs)*.7);color:var(--text-mute);margin:2px 0 6px;">${xhyInfo}</div>
    <button class="pill-btn" onclick="window.refreshCloudXhy()">拉取 / 刷新歇后语</button>
    ${row("触发占比","文字回复里多大比例走组字", slide("rcProb","recombProb",0,100,5,"%",""))}
    ${row("链阶","2=更跳脱，3=更像原句", `
      <div class="tab-switch" id="rcOrderTab" style="margin:0;">
        <div class="ts-opt ${cfg.recombOrder===2?"active":""}" data-v="2" onclick="window.setRecombOrder(2)">2 阶</div>
        <div class="ts-opt ${cfg.recombOrder===3?"active":""}" data-v="3" onclick="window.setRecombOrder(3)">3 阶</div>
      </div>`)}
    ${row("句长下限","", slide("rcMin","recombMin",1,20,1," 字",""))}
    ${row("句长上限","", slide("rcMax","recombMax",5,60,1," 字",""))}
    ${row("重复上限","同一片段在句内出现到第 N 次即禁止", slide("rcRepeat","recombMaxRepeat",2,8,1," 次",""))}
    ${row("步数上限","造句的时间复杂度天花板，超了就降级", slide("rcSteps","recombMaxSteps",50,800,10," 步",""))}
    <div style="margin-top:12px;"><button class="pill-btn" onclick="window.previewRecomb()">试生成一句</button></div>
    <div id="rcPreview" style="margin-top:8px;font-size:calc(var(--chat-fs)*.9);color:var(--text);min-height:20px;"></div>
  `;
  modal("组字设置", html);
  /* ⭕ modal 是新建的 DOM，渲染完得自己同步开关状态 —— 之前漏了 charOn，
     打开设置时汉字表开关会显示成「关」，看着像没启用 */
  setSw("sw_dictOn", !!cfg.dictOn);
  setSw("sw_charOn", !!cfg.charOn);
  setSw("sw_xhyOn",  !!cfg.xhyOn);
}
window.setRecombOrder = async v => {
  cfg.recombOrder = +v;
  await saveAll();
  document.querySelectorAll("#rcOrderTab .ts-opt").forEach(el => el.classList.toggle("active", +el.dataset.v === v));
};
window.previewRecomb = async () => {
  const box = document.getElementById("rcPreview");
  if (!box) return;
  /* ⭕ 没词典就先拉一次，否则「试生成」看不出词典效果 */
  if (cfg.dictOn && !cloudDictCache) { box.innerText = "正在拉取词典…"; await fetchCloudDict(); }
  _mkCache = null; // 强制重建索引，让参数改动立刻生效
  const s = genRecomb();
  box.innerText = s || "生成失败（语料太稀或参数过严），已退回原抽卡逻辑";
};

// ════════════════════════════════════════════
// ══ 问卷调查 (Survey) ══
// ════════════════════════════════════════════

window.switchStatsTab = function(tab) {
  document.querySelectorAll('#statsApp .stab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('#statsApp .stab-panel').forEach(p => p.classList.toggle('active', p.id === 'sstab-' + tab));
  if (tab === "survey") renderSurveys();
  /* ⭕ 打开留言板只渲染、不清未读 —— 未读留给「点进帖子」时才消费，
     否则列表上的红点和开屏提醒就永远没机会出现 */
  if (tab === "board") renderBoard(); else closeBoardPost();
};

function renderSurveys(){
  const deck = document.getElementById("surveyDeck");
  if (!deck) return;
  deck.innerHTML = "";
  if (!surveys.length){
    deck.innerHTML = `<div class="empty-tip">暂无问卷<br>点击上方「新建问卷」或「导入」</div>`;
    return;
  }
  const grid = document.createElement("div");
  grid.className = "sf-grid";
  surveys.forEach(s=>{
    const recs = surveyRecords.filter(r=>r.surveyId===s.id);
    const card = document.createElement("div");
    card.className = "sf-card";
    card.onclick = ()=>openSurveyDetail(s.id);
    card.innerHTML = `
      <svg class="sf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5l9 5 9-5"/><rect x="3" y="4.5" width="18" height="15" rx="2.5"/></svg>
      <div class="sf-title">${escapeHtml(s.title)}</div>
      <div class="sf-meta">${s.questions.length} 题 · 已填 ${recs.length} 次${s.builtin ? " · 内置" : ""}</div>`;
    grid.appendChild(card);
  });
  deck.appendChild(grid);
}

// ── 详情 ──
window.openSurveyDetail = (id) => {
  const s = surveys.find(x=>x.id===id); if (!s) return;
  const recs = surveyRecords.filter(r=>r.surveyId===id).sort((a,b)=>b.ts-a.ts);
  let html = `<div class="fld-tip">共 ${s.questions.length} 道题目${s.builtin ? " · 内置问卷" : ""}</div>
    <div class="pill-btn-group">
      <button class="pill-btn" onclick="inviteSurvey('${s.id}')">邀请对方填写</button>
      <button class="pill-btn" onclick="editSurvey('${s.id}')">编辑问卷</button>
      <button class="pill-btn" onclick="exportSurvey('${s.id}')">导出问卷</button>
      <button class="pill-btn danger" onclick="deleteSurvey('${s.id}')">删除问卷</button>
    </div>`;
  if (recs.length){
    html += `<div class="stat-block-header"><span class="stat-block-title">填写记录</span></div><div class="snav-list">`;
    recs.forEach(r=>{
      const d = new Date(r.ts);
      html += `<div class="snav-item" onclick="openRecordSummary('${r.id}')">
        <span>${fmtDate(d)} ${fmtTime(d)}</span>
        <svg class="cfg-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`;
    });
    html += `</div>`;
  } else {
    html += `<div class="empty-tip">还没有填写记录</div>`;
  }
  modal(s.title, html);
};

window.openRecordSummary = (id) => {
  const r = surveyRecords.find(x=>x.id===id); if (!r) return;
  const d = new Date(r.ts);
  let html = `<div class="fld-tip">${fmtDate(d)} ${fmtTime(d)}</div>`;
  r.answers.forEach(a=>{
    html += `<div class="qf-sum-item">
      <div class="qf-sum-q">${escapeHtml(a.q)}</div>
      <div class="qf-sum-row">我　${escapeHtml(a.self)}</div>
      <div class="qf-sum-row">彼　${escapeHtml(a.opp)}</div>`;
    if (a.oppComment !== undefined){
      html += `<div class="qf-sum-row">我的评论　${escapeHtml(a.selfComment || "（无）")}</div>
        <div class="qf-sum-row">彼的评论　${escapeHtml(a.oppComment)}</div>`;
    }
    html += `</div>`;
  });
  html += `<button class="pill-btn danger" onclick="deleteRecord('${r.id}')">删除该记录</button>`;
  modal(r.title, html);
};

window.deleteRecord = async (id) => {
  surveyRecords = surveyRecords.filter(r=>r.id!==id);
  await saveAll();
  closeModal();
  renderSurveys();
  toast("已删除");
};

window.deleteSurvey = async (id) => {
  surveys = surveys.filter(s=>s.id!==id);
  surveyRecords = surveyRecords.filter(r=>r.surveyId!==id);
  await saveAll();
  closeModal();
  renderSurveys();
  toast("已删除");
};

// ── 导入 / 导出 ──
window.exportSurvey = (id) => {
  const s = surveys.find(x=>x.id===id); if (!s) return;
  const data = { title: s.title, questions: s.questions };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  a.download = `问卷_${s.title}_${Date.now()}.json`;
  a.click();
  toast("已导出");
};

// 解析 TXT 问卷：
//   第 1 行 = 问卷标题
//   --- 分隔每个题目块（末尾可省略，空行自动忽略）
//   每题块内：第 1 行是题目文本，后续每行是一个选项
//   每道题至少需要 2 个选项才会被导入；导入默认勾选附加评论
function parseTxtToSurvey(txt){
  const lines = String(txt).split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>0);
  const title = lines.shift() || "未命名问卷";
  const blocks = [];
  let cur = null;
  for (const line of lines){
    if (/^-{3,}$/.test(line)){ cur = null; continue; }   // --- 分隔符，结束当前题目块
    if (!cur){ cur = []; blocks.push(cur); }
    cur.push(line);
  }
  const questions = blocks.map(b=>{
    const [text, ...opts] = b;
    if (!text || opts.length < 2) return null;
    return { text, options: opts, needOptions: true, needComment: true };
  }).filter(Boolean);
  return { title, questions };
}

function onPickSurvey(e){
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = async ev => {
    try {
      const raw = ev.target.result;
      let title, questions;
      if (/\.txt$/i.test(f.name)){
        const d = parseTxtToSurvey(raw);
        if (!d.questions.length) { toast("未解析到题目","warn"); return; }
        title = d.title; questions = d.questions;
      } else {
        const d = JSON.parse(raw);
        if (!d.title || !Array.isArray(d.questions)) { toast("文件格式不正确","warn"); return; }
        title = d.title;
        questions = d.questions.map(q=>({
          text: q.text || "",
          options: Array.isArray(q.options) ? q.options.filter(o=>o) : [],
          needComment: !!q.needComment
        })).filter(q=>q.text && q.options.length>=2);
      }
      surveys.push({ id: "s"+Date.now(), title, questions });
      await saveAll();
      renderSurveys();
      toast("导入成功");
    } catch { toast("文件解析失败","warn"); }
    e.target.value = "";
  };
  r.readAsText(f);
}

// ── 新建 / 编辑 ──
window.openNewSurvey = () => {
  editingSurvey = { id: "s"+Date.now(), title: "", questions: [{text:"",options:[],needOptions:false,needComment:false}] };
  editingSurveyIsNew = true;
  renderSurveyEditForm();
};

window.editSurvey = (id) => {
  const s = surveys.find(x=>x.id===id); if (!s) return;
  editingSurvey = JSON.parse(JSON.stringify(s));
  // back-compat: if existing q has options, mark needOptions true
  editingSurvey.questions.forEach(q=>{ if (!("needOptions" in q)) q.needOptions = (q.options&&q.options.length>0); });
  editingSurveyIsNew = false;
  renderSurveyEditForm();
};

function renderSurveyEditForm(){
  const s = editingSurvey;
  let html = `<input class="fld" id="qe_title" placeholder="问卷标题" value="${escapeAttr(s.title)}">`;
  s.questions.forEach((q,qi)=>{
    const hasOpts = !!q.needOptions;
    html += `<div class="qedit-item">
      <div class="qedit-row"><span>题目 ${qi+1}</span><span class="qedit-del" onclick="removeEditQuestion(${qi})">删除</span></div>
      <input class="fld" id="qe_q_${qi}" placeholder="题目内容" value="${escapeAttr(q.text)}">
      <div class="qedit-toggles">
        <label class="qedit-chip-check"><input type="checkbox" id="qe_opts_on_${qi}" onchange="toggleQOpts(${qi})" ${hasOpts?"checked":""}><span>选项</span></label>
        <label class="qedit-chip-check"><input type="checkbox" id="qe_cmt_${qi}" ${q.needComment?"checked":""}><span>附加评论</span></label>
      </div>`;
    if (hasOpts){
      html += `<div class="qedit-opts" id="qe_opts_${qi}">`;
      (q.options||[]).forEach((opt,oi)=>{
        html += `<div class="qedit-opt-row">
          <input class="fld" id="qe_opt_${qi}_${oi}" placeholder="选项 ${oi+1}" value="${escapeAttr(opt)}">
          <span class="qedit-opt-del" onclick="removeEditOption(${qi},${oi})">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
        </div>`;
      });
      html += `</div><button class="qedit-add-opt" onclick="addEditOption(${qi})">+ 添加选项</button>`;
    }
    html += `</div>`;
  });
  html += `<button class="pill-btn" onclick="addEditQuestion()">+ 添加题目</button>
    <button class="pill-btn" onclick="saveSurveyEdit()">保存问卷</button>`;
  modal(editingSurveyIsNew ? "新建问卷" : "编辑问卷", html);
}

function syncEditFormToState(){
  const s = editingSurvey;
  const t = document.getElementById("qe_title"); if (t) s.title = t.value.trim();
  s.questions.forEach((q,qi)=>{
    const qEl = document.getElementById("qe_q_"+qi);
    const cEl = document.getElementById("qe_cmt_"+qi);
    const oOnEl = document.getElementById("qe_opts_on_"+qi);
    if (qEl) q.text = qEl.value.trim();
    if (cEl) q.needComment = cEl.checked;
    if (oOnEl) q.needOptions = oOnEl.checked;
    if (q.needOptions){
      q.options = (q.options||[]).map((opt,oi)=>{
        const oEl = document.getElementById(`qe_opt_${qi}_${oi}`);
        return oEl ? oEl.value.trim() : opt;
      });
    }
  });
}

window.toggleQOpts = (qi) => {
  syncEditFormToState();
  const q = editingSurvey.questions[qi];
  q.needOptions = document.getElementById("qe_opts_on_"+qi).checked;
  if (q.needOptions && (!q.options || !q.options.length)) q.options = ["",""];
  renderSurveyEditForm();
};

window.addEditQuestion = () => {
  syncEditFormToState();
  editingSurvey.questions.push({text:"",options:[],needOptions:false,needComment:false});
  renderSurveyEditForm();
};

window.removeEditQuestion = (i) => {
  syncEditFormToState();
  editingSurvey.questions.splice(i,1);
  if (!editingSurvey.questions.length) editingSurvey.questions.push({text:"",options:[],needOptions:false,needComment:false});
  renderSurveyEditForm();
};

window.addEditOption = (qi) => {
  syncEditFormToState();
  if (!editingSurvey.questions[qi].options) editingSurvey.questions[qi].options = [];
  editingSurvey.questions[qi].options.push("");
  renderSurveyEditForm();
};

window.removeEditOption = (qi,oi) => {
  syncEditFormToState();
  editingSurvey.questions[qi].options.splice(oi,1);
  renderSurveyEditForm();
};

window.saveSurveyEdit = async () => {
  syncEditFormToState();
  const s = editingSurvey;
  if (!s.title){ toast("请填写问卷标题","warn"); return; }
  for (const q of s.questions) q.options = (q.options||[]).filter(o=>o);
  const valid = s.questions.filter(q=>q.text);
  if (!valid.length){ toast("请至少填写一道题目","warn"); return; }
  s.questions = valid;
  if (editingSurveyIsNew){
    surveys.push(s);
  } else {
    const idx = surveys.findIndex(x=>x.id===s.id);
    if (idx>-1) surveys[idx]=s;
  }
  editingSurvey = null;
  await saveAll();
  closeModal();
  renderSurveys();
  toast("已保存");
};

// ── 邀请对方填写 ──
const INVITE_ICONS = {
  send:   `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>`,
  accept: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  decline:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};
let invitePopupTimer = null;

function showInvitePopup(type, title, sub){
  const el = document.getElementById("invitePopup");
  el.className = "invite-popup on" + (type !== "send" ? " "+type : "");
  document.getElementById("ipIcon").innerHTML = INVITE_ICONS[type] || INVITE_ICONS.send;
  document.getElementById("ipTitle").innerText = title;
  document.getElementById("ipSub").innerText = sub;
  if (invitePopupTimer) clearTimeout(invitePopupTimer);
}
function hideInvitePopup(){
  document.getElementById("invitePopup").classList.remove("on");
}

window.inviteSurvey = (id) => {
  const survey = surveys.find(s=>s.id===id); if (!survey) return;
  closeModal();
  showInvitePopup("send", `已发出邀请`, `《${survey.title}》· 等待对方回应…`);
  invitePopupTimer = setTimeout(()=>{
    const accepted = Math.random() < 0.5;
    if (accepted){
      showInvitePopup("accept", "对方接受了邀请", "正在打开问卷…");
      invitePopupTimer = setTimeout(()=>{ hideInvitePopup(); startSurveyFill(id); }, 1400);
    } else {
      showInvitePopup("decline", "对方拒绝了邀请", "或许可以再邀请一次");
      invitePopupTimer = setTimeout(hideInvitePopup, 1800);
    }
  }, 1300);
};

// ── 字卡评论生成 ──
function generateOppComment(){
  const pool = cards.filter(c=>!c.shielded && c.cat!=="歌词库" && !shieldedCats.includes(c.cat));
  if (!pool.length) return "（字卡库为空）";
  const n = Math.min(pool.length, randInt(2,4));
  const used = new Set(), picked = [];
  while (picked.length < n){
    const i = Math.floor(Math.random()*pool.length);
    if (used.has(i)) continue;
    used.add(i); picked.push(pool[i].text);
  }
  return picked.map((t,i)=> i===0 ? t : randomSep()+t).join("");
}

// ── 逐题填写流程（全屏） ──
let sfTimer = null;

function openSurveyFull(){
  document.getElementById("surveyFull").classList.add("on");
}
window.closeSurveyFull = () => {
  clearTimeout(sfTimer); sfTimer = null;
  surveyFill = null;
  document.getElementById("surveyFull").classList.remove("on");
};

// 对方独立思考：每题进入后 5~30 秒内随机做出选择，不受用户选择影响
function scheduleOppPick(){
  clearTimeout(sfTimer);
  sfTimer = setTimeout(()=>{
    const sf = surveyFill; if (!sf || sf.stage !== "pick") return;
    if (sf.oppIdx === -1){
      const q = sf.survey.questions[sf.qIndex];
      sf.oppIdx = randInt(0, q.options.length-1);
      sf.oppPicked = true;
      renderFillStep();
    }
  }, randInt(5,30)*1000);
}

window.startSurveyFill = (id) => {
  const survey = surveys.find(s=>s.id===id);
  if (!survey || !survey.questions.length){ toast("问卷为空","warn"); return; }
  surveyFill = { surveyId:id, survey, qIndex:0, selfIdx:-1, oppIdx:-1, oppPicked:false, stage:"pick", reselectMsg:"", curAnswer:null, answers:[] };
  openSurveyFull();
  renderFillStep();
  scheduleOppPick();
};

window.fillSelectSelf = (i) => {
  const sf = surveyFill; if (!sf || sf.stage!=="pick") return;
  sf.selfIdx = i;
  renderFillStep();
};

// "重选"：邀请对方重新选择，1~3秒缓冲，对方可能拒绝重选请求
window.fillReselect = () => {
  const sf = surveyFill; if (!sf || sf.stage!=="pick" || sf.selfIdx===-1) return;
  sf.stage = "reselecting";
  sf.reselectMsg = "对方正在重新选择…";
  renderFillStep();
  clearTimeout(sfTimer);
  sfTimer = setTimeout(()=>{
    if (Math.random() < 0.5){
      sf.stage = "reselect-refused";
      sf.reselectMsg = "对方拒绝了重选请求";
      renderFillStep();
      sfTimer = setTimeout(()=>{
        sf.stage="pick"; renderFillStep();
        if (sf.oppIdx === -1) scheduleOppPick();  // 对方仍未选择，继续独立思考计时
      }, 1100);
    } else {
      const q = sf.survey.questions[sf.qIndex];
      sf.oppIdx = randInt(0, q.options.length-1);
      sf.oppPicked = true;
      sf.stage = "reselect-done";
      sf.reselectMsg = "选择完毕";
      renderFillStep();
      sfTimer = setTimeout(()=>{ sf.stage="pick"; renderFillStep(); }, 900);
    }
  }, randInt(1,3)*1000);
};

window.fillNext = () => {
  const sf = surveyFill; if (!sf || sf.stage!=="pick" || sf.selfIdx===-1 || sf.oppIdx===-1) return;
  proceedAfterPick();
};

function proceedAfterPick(){
  const sf = surveyFill;
  const q = sf.survey.questions[sf.qIndex];
  sf.curAnswer = { q: q.text, self: q.options[sf.selfIdx], opp: q.options[sf.oppIdx] };
  if (q.needComment){
    sf.stage = "comment-wait";
    renderFillStep();
    clearTimeout(sfTimer);
    sfTimer = setTimeout(()=>{
      sf.curAnswer.oppComment = generateOppComment();
      sf.curAnswer.selfComment = "";
      sf.stage = "comment";
      renderFillStep();
    }, randInt(3,10)*1000);
  } else {
    sf.answers.push(sf.curAnswer);
    nextQuestion();
  }
}

window.fillNextFromComment = () => {
  const sf = surveyFill; if (!sf) return;
  const ta = document.getElementById("qfSelfComment");
  sf.curAnswer.selfComment = ta ? ta.value.trim() : "";
  sf.answers.push(sf.curAnswer);
  nextQuestion();
};

function nextQuestion(){
  const sf = surveyFill;
  sf.qIndex++;
  sf.selfIdx = -1; sf.oppIdx = -1; sf.oppPicked = false; sf.stage = "pick"; sf.reselectMsg = ""; sf.curAnswer = null;
  if (sf.qIndex >= sf.survey.questions.length) renderFillSummary();
  else { renderFillStep(); scheduleOppPick(); }
}

function oppBlock(q, sf, dim){
  return `<div class="qf-opp${dim?" dim":""}"><div class="qf-opp-label">对方选择</div><div class="qf-opp-value">${escapeHtml(q.options[sf.oppIdx])}</div></div>`;
}

function indicatorHtml(msg, spinning){
  const icon = spinning
    ? `<span class="qf-dots"><i></i><i></i><i></i></span>`
    : `<svg class="qf-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  return `<div class="qf-indicator">${icon}<span>${escapeHtml(msg)}</span></div>`;
}

function renderFillStep(){
  const sf = surveyFill;
  const q = sf.survey.questions[sf.qIndex];
  const selfNm = texts.l1_name || texts.l2_name || "我";
  const oppNm = texts.opp_name || "温语";
  document.getElementById("sfFullTitle").innerText = sf.survey.title;
  document.getElementById("sfFullProgress").innerText = `${sf.qIndex+1} / ${sf.survey.questions.length}`;

  let html = `<div class="qf-question">${escapeHtml(q.text)}</div><div class="qf-options">`;
  q.options.forEach((opt,i)=>{
    const tags = [];
    if (i === sf.selfIdx) tags.push(`<span class="qf-opt-name self">${escapeHtml(selfNm)}</span>`);
    if (i === sf.oppIdx) tags.push(`<span class="qf-opt-name opp">${escapeHtml(oppNm)}</span>`);
    html += `<div class="qf-opt" onclick="fillSelectSelf(${i})">
      <span class="qf-opt-txt">${escapeHtml(opt)}</span>
      ${tags.length?`<span class="qf-opt-tags">${tags.join("")}</span>`:""}
    </div>`;
  });
  html += `</div>`;

  const selfPicked = sf.selfIdx > -1;
  const oppPicked = sf.oppIdx > -1;

  if (sf.stage === "pick"){
    if (selfPicked && oppPicked){
      html += `<div class="qf-actions">
        <button class="pill-btn" onclick="fillReselect()">重选</button>
        <button class="pill-btn" onclick="fillNext()">下一步</button>
      </div>`;
    } else if (selfPicked){
      html += indicatorHtml("对方正在选择…", true)
        + `<div class="qf-actions"><button class="pill-btn" onclick="fillReselect()">重选</button></div>`;
    } else if (oppPicked){
      html += indicatorHtml(`对方选择了「${escapeHtml(q.options[sf.oppIdx])}」`, false);
    } else {
      html += indicatorHtml("对方正在查看题目…", true);
    }
  } else if (sf.stage === "reselecting"){
    html += (oppPicked ? oppBlock(q,sf,true) : "") + indicatorHtml(sf.reselectMsg, true);
  } else if (sf.stage === "reselect-refused" || sf.stage === "reselect-done"){
    html += (oppPicked ? oppBlock(q,sf) : "") + indicatorHtml(sf.reselectMsg, false);
  } else if (sf.stage === "comment-wait"){
    html += oppBlock(q,sf) + indicatorHtml("对方正在输入评论…", true);
  } else if (sf.stage === "comment"){
    html += oppBlock(q,sf)
      + `<div class="qf-comment"><div class="qf-comment-label">对方评论</div><div class="qf-comment-text">${escapeHtml(sf.curAnswer.oppComment)}</div></div>
      <textarea class="fld area" id="qfSelfComment" placeholder="写下你的评论…（可留空）"></textarea>
      <button class="pill-btn" onclick="fillNextFromComment()">下一步</button>`;
  }

  document.getElementById("sfFullBody").innerHTML = html;
}

function renderFillSummary(){
  const sf = surveyFill;
  document.getElementById("sfFullTitle").innerText = sf.survey.title;
  document.getElementById("sfFullProgress").innerText = "完成";
  let html = `<div class="qf-summary">`;
  sf.answers.forEach(a=>{
    html += `<div class="qf-sum-item">
      <div class="qf-sum-q">${escapeHtml(a.q)}</div>
      <div class="qf-sum-row">我　${escapeHtml(a.self)}</div>
      <div class="qf-sum-row">彼　${escapeHtml(a.opp)}</div>`;
    if (a.oppComment !== undefined){
      html += `<div class="qf-sum-row">我的评论　${escapeHtml(a.selfComment || "（无）")}</div>
        <div class="qf-sum-row">彼的评论　${escapeHtml(a.oppComment)}</div>`;
    }
    html += `</div>`;
  });
  html += `</div><button class="pill-btn" onclick="finishSurveyFill()">完成并保存</button>`;
  document.getElementById("sfFullBody").innerHTML = html;
}

window.finishSurveyFill = async () => {
  const sf = surveyFill; if (!sf) return;
  surveyRecords.push({ id:"rec"+Date.now(), surveyId: sf.surveyId, title: sf.survey.title, ts: Date.now(), answers: sf.answers });
  surveyFill = null;
  await saveAll();
  closeSurveyFull();
  renderSurveys();
  toast("问卷已完成");
};

// ═══════════════════════════════════════
//  🎵 云端音乐系统 · 轻量化缓存 + 随机播放 + 歌词同步
// ═══════════════════════════════════════

// ─── 播放器状态 ───
// musicAudio 已在行91声明，此处复用
let _shufflePool = [], _shuffleIdx = -1, _lrcLines = [], _lrcTimer = null;
let _lrcTextCache = new Map(); // Map<lrcUrl, lrcText> 不污染 song 对象
let _cloudPreloadDone = false;
let _progressTimer = null; // timeupdate 间隔定时器

// ─── 云端曲库 ───
const CLOUD_MUSIC_LF_KEY = "cy-music-idx";
const CLOUD_MUSIC_LF_META = "cy-music-meta";
const CLOUD_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h 过期

let _musicLF = null;
function _ensureMusicLF() {
  if (!_musicLF && typeof localforage !== "undefined") {
    _musicLF = localforage.createInstance({ name: "scMusic" });
  }
  return _musicLF;
}

/* 轻量化索引结构
   云端 index.json 格式: [{name:"歌名 - 歌手", mp3:"url", lrc:"url"}, …]
   lrc 是 .lrc 歌词文件 URL，需要 fetch 后才是 LRC 文本
   本地缓存只保留: {n, u, l} — name, url, lrcUrl 压缩字段名 */
function _packSong(s) { return { n: s.name, u: s.mp3, l: s.lrc || "" }; }
function _unpackSong(s) { return { name: s.n, mp3: s.u, lrc: s.l || "" }; }

// 从云端获取 index.json（三层轻量化缓存）
async function fetchCloudIndex(forceRefresh) {
  const lf = _ensureMusicLF();

  // ① 内存缓存
  if (!forceRefresh && cloudSongCache && cloudSongCache.length) return cloudSongCache;

  // ② localforage 缓存 + TTL 检查
  if (!forceRefresh && lf) {
    try {
      const meta = await lf.getItem(CLOUD_MUSIC_LF_META);
      if (meta && meta.at && (Date.now() - meta.at < CLOUD_CACHE_TTL)) {
        const packed = await lf.getItem(CLOUD_MUSIC_LF_KEY);
        if (packed && packed.length) {
          cloudSongCache = packed.map(_unpackSong);
          updateCloudStatus(`已缓存 ${packed.length} 首 · ${new Date(meta.at).toLocaleDateString()}`);
          return cloudSongCache;
        }
      }
    } catch (e) { /* fall through */ }
  }

  // ③ 网络获取
  updateCloudStatus("正在连接云端曲库…");
  try {
    const indexUrl = _jsdelivr(cfg.cloudMusicIndexUrl, "https://cdn.jsdelivr.net/gh/fcylz/cy-music@main/index.json");
    const res = await fetch(indexUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    if (!Array.isArray(raw) || !raw.length) throw new Error("索引为空");

    cloudSongCache = raw;

    // 轻量化写入 localforage
    if (lf) {
      const packed = raw.map(_packSong);
      try {
        await lf.setItem(CLOUD_MUSIC_LF_KEY, packed);
        await lf.setItem(CLOUD_MUSIC_LF_META, { at: Date.now(), count: packed.length });
      } catch (e) {}
    }

    cfg.cloudMusicLastSync = Date.now();
    saveAllDebounced();
    updateCloudStatus(`共 ${raw.length} 首 · 已同步`);
    return raw;
  } catch (e) {
    updateCloudStatus("连接失败，使用缓存");
    if (cloudSongCache) return cloudSongCache;
    if (lf) {
      try {
        const packed = await lf.getItem(CLOUD_MUSIC_LF_KEY);
        if (packed && packed.length) { cloudSongCache = packed.map(_unpackSong); updateCloudStatus(`离线 ${packed.length} 首`); return cloudSongCache; }
      } catch(e2) {}
    }
    toast("无法获取云端曲库", "warn");
    return [];
  }
}

function updateCloudStatus(msg) {
  const el = document.getElementById("cloudMusicStatus");
  if (el) { el.style.display = ""; el.textContent = msg; }
}

// ─── 后台预加载曲库（首页加载后 3s 空闲时触发）───
function _backgroundPreload() {
  if (_cloudPreloadDone) return;
  setTimeout(() => {
    if (cloudSongCache && cloudSongCache.length) { _cloudPreloadDone = true; return; }
    try { fetchCloudIndex().then(() => { _cloudPreloadDone = true; }).catch(() => {}); } catch(e) {}
  }, 3000);
}

// ─── 随机播放池 ───
async function _ensureShufflePool() {
  if (!cloudSongCache || !cloudSongCache.length) {
    await fetchCloudIndex();
  }
  if (cloudSongCache && cloudSongCache.length) {
    _shufflePool = [...cloudSongCache];
    // Fisher-Yates 洗牌
    for (let i = _shufflePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [_shufflePool[i], _shufflePool[j]] = [_shufflePool[j], _shufflePool[i]];
    }
    _shuffleIdx = -1;
  }
}

function _loadCurrentShuffleSong() {
  if (!_shufflePool.length || _shuffleIdx < 0 || _shuffleIdx >= _shufflePool.length) return null;
  return _shufflePool[_shuffleIdx];
}

// ─── LRC 歌词解析 ───
function _parseLRC(lrc) {
  const lines = [];
  if (!lrc) return lines;
  const parts = lrc.split(/\r?\n/);
  const regex = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/;
  for (const p of parts) {
    const m = p.match(regex);
    if (!m) continue;
    const min = parseInt(m[1], 10);
    const sec = parseInt(m[2], 10);
    const ms = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) : 0;
    const time = min * 60 + sec + ms / 1000;
    const text = p.replace(regex, "").trim();
    if (text) lines.push({ time, text });
  }
  lines.sort((a, b) => a.time - b.time);
  return lines;
}

// ─── 异步拉取远程 LRC 文件 ───
async function _fetchRemoteLrc(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    return await res.text();
  } catch (e) { return ""; }
}

function _syncLRC(currentTime) {
  // 找当前歌词行
  let activeIdx = -1;
  if (_lrcLines.length) {
    for (let i = _lrcLines.length - 1; i >= 0; i--) {
      if (currentTime >= _lrcLines[i].time) { activeIdx = i; break; }
    }
  }

  // ── 主页面音乐卡片歌词行（只在播放且有歌词时显示）──
  const elCard = document.getElementById("mCardLrcText");
  if (elCard && musicAudio && !musicAudio.paused) {
    if (activeIdx >= 0) {
      const txt = _lrcLines[activeIdx].text;
      if (elCard.textContent !== txt) {
        elCard.textContent = txt;
      }
    }
  }

  // ── 播放器窗口歌词同步 ──
  const el = document.getElementById("mpLrcBody");
  if (!el || !_lrcLines.length) return;
  const items = el.querySelectorAll(".mp-lrc-line");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === activeIdx);
    if (i === activeIdx && activeIdx >= 0) {
      item.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  });
}

// ─── 封面更新 ───
function _updateMusicCardUI(song) {
  if (!song) return;
  const { title, artist } = _parseCloudSongName(song.name);
  // 同步主页文字
  const elTitle = document.querySelector('.music-card .m-title');
  const elSub = document.querySelector('.music-card .m-sub');
  if (elTitle) elTitle.textContent = title;
  if (elSub) elSub.textContent = artist;
  // 重置歌词行
  const elLrcTxt = document.getElementById("mCardLrcText");
  if (elLrcTxt) elLrcTxt.textContent = "";
  document.getElementById("musicCard")?.classList.remove("has-lrc");
  // 同步播放器窗口
  const pTitle = document.getElementById("mpTitle");
  const pArtist = document.getElementById("mpArtist");
  if (pTitle) pTitle.textContent = title;
  if (pArtist) pArtist.textContent = artist;
  // 同步 cfg
  cfg.musicTitle = title;
  cfg.musicArtist = artist;
}

// ─── 播放核心：随机切歌 ───
// ⭕ forceSong：指定曲目时直接单曲成池，跳过 _ensureShufflePool（它会重新洗牌，
//    把外部设置的 _shufflePool 覆盖回全曲库 —— 旧版点播指定歌曲因此失效）
async function _playNextRandom(forceSong) {
  if (forceSong) { _shufflePool = [forceSong]; _shuffleIdx = -1; }
  else await _ensureShufflePool();
  if (!_shufflePool.length) { toast("曲库无数据", "warn"); return; }
  _shuffleIdx++;
  if (_shuffleIdx >= _shufflePool.length) {
    // 播完一轮，重新洗牌
    for (let i = _shufflePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [_shufflePool[i], _shufflePool[j]] = [_shufflePool[j], _shufflePool[i]];
    }
    _shuffleIdx = 0;
  }
  const song = _loadCurrentShuffleSong();
  if (!song) return;

  // 清理旧播放器
  if (musicAudio) { musicAudio.pause(); musicAudio.src = ""; musicAudio.load(); musicAudio = null; }
  clearInterval(_lrcTimer);

  // 更新 UI
  _updateMusicCardUI(song);
  // lrc 字段是 .lrc 文件 URL，通过独立 Map 缓存文本，不污染 song 对象
  let lrcText = "";
  if (song.lrc) {
    if (song.lrc.startsWith("http")) {
      lrcText = _lrcTextCache.get(song.lrc);
      if (lrcText === undefined) {
        lrcText = await _fetchRemoteLrc(song.lrc);
        if (lrcText) _lrcTextCache.set(song.lrc, lrcText);
      }
    } else {
      lrcText = song.lrc; // 兼容旧索引中已混入的文本
    }
  }
  _lrcLines = _parseLRC(lrcText);
  // 有歌词时展开卡片歌词列，无歌词时保持折叠
  document.getElementById("musicCard")?.classList.toggle("has-lrc", _lrcLines.length > 0);
  // 渲染播放器歌词
  _renderLrcBody();

  // 创建新 Audio
  updateCloudStatus("载入中…");
  musicAudio = new Audio(song.mp3);
  musicAudio._currentSong = song;
  musicAudio.addEventListener("play", () => {
    updatePlayIcon(true);
    updateCloudStatus("");
    _lrcTimer = setInterval(() => {
      if (musicAudio) _syncLRC(musicAudio.currentTime);
    }, 300);
    _startProgressTimer();
  });
  musicAudio.addEventListener("pause", () => {
    updatePlayIcon(false);
    clearInterval(_lrcTimer);
    clearInterval(_progressTimer);
    const elLrc = document.getElementById("mCardLrcText");
    if (elLrc) elLrc.textContent = "";
  });
  musicAudio.addEventListener("ended", () => { clearInterval(_progressTimer); _playNextRandom(); });
  musicAudio.addEventListener("error", () => {
    toast("加载失败，跳过当前曲目", "warn");
    updatePlayIcon(false);
    clearInterval(_lrcTimer);
    clearInterval(_progressTimer);
    const failedAudio = musicAudio;
    setTimeout(() => { if (musicAudio === failedAudio) _playNextRandom(); }, 1500);
  });
  musicAudio.addEventListener("canplaythrough", () => {
    updateCloudStatus("");
    // 设置总时长显示
    const dtEl = document.getElementById("mpDurTime");
    if (dtEl && isFinite(musicAudio.duration)) dtEl.textContent = _formatTime(musicAudio.duration);
    const pg = document.getElementById("mpProgress");
    if (pg && isFinite(musicAudio.duration)) pg.max = 100;
  }, { once: true });

  try { await musicAudio.play(); } catch(e) {
    if (e.name === "NotAllowedError") toast("浏览器拦截了自动播放，请再点一次", "warn");
  }
}

// ─── 音乐播放窗口（歌词面板）───
function _formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

window.openMusicPlayer = async () => {
  await _ensureShufflePool();
  const currentSong = musicAudio?._currentSong || null;
  const title = currentSong ? _parseCloudSongName(currentSong.name).title : (cfg.musicTitle || "未选择");
  const artist = currentSong ? _parseCloudSongName(currentSong.name).artist : (cfg.musicArtist || "—");

  _lrcLines = [];
  if (currentSong?.lrc) {
    let lrcText = currentSong.lrc;
    if (lrcText.startsWith("http")) {
      lrcText = _lrcTextCache.get(lrcText);
      if (lrcText === undefined) {
        lrcText = await _fetchRemoteLrc(currentSong.lrc);
        if (lrcText) _lrcTextCache.set(currentSong.lrc, lrcText);
      }
    }
    _lrcLines = _parseLRC(lrcText);
  } else if (cfg.musicLrc) {
    let lrcText = cfg.musicLrc;
    if (lrcText.startsWith("http")) lrcText = await _fetchRemoteLrc(lrcText);
    _lrcLines = _parseLRC(lrcText);
  }

  document.getElementById("mpTitle").textContent = title;
  document.getElementById("mpArtist").textContent = artist;
  document.getElementById("mpCount").textContent = _shufflePool.length ? `${_shufflePool.length} 首` : "";
  _renderLrcBody();
  // 同步进度条
  if (musicAudio && isFinite(musicAudio.duration)) {
    const pct = (musicAudio.currentTime / musicAudio.duration) * 100;
    const pg = document.getElementById("mpProgress");
    if (pg) pg.value = pct;
    const ctEl = document.getElementById("mpCurTime");
    const dtEl = document.getElementById("mpDurTime");
    if (ctEl) ctEl.textContent = _formatTime(musicAudio.currentTime);
    if (dtEl) dtEl.textContent = _formatTime(musicAudio.duration);
  }
  document.getElementById("musicPlayer").classList.add("on");
  // 同步播放按钮
  updatePlayIcon(musicAudio && !musicAudio.paused);
  if (musicAudio && !musicAudio.paused && _lrcLines.length) {
    _syncLRC(musicAudio.currentTime);
  }
};
window.closeMusicPlayer = () => {
  document.getElementById("musicPlayer").classList.remove("on");
  _lrcLines = [];
  clearInterval(_progressTimer);
};

// 进度条拖拽跳跃
window.mpSeek = (pct) => {
  if (!musicAudio || !isFinite(musicAudio.duration)) return;
  const t = (pct / 100) * musicAudio.duration;
  musicAudio.currentTime = t;
  // 立即刷新显示
  const ctEl = document.getElementById("mpCurTime");
  if (ctEl) ctEl.textContent = _formatTime(t);
};

function _startProgressTimer() {
  clearInterval(_progressTimer);
  _progressTimer = setInterval(() => {
    if (!musicAudio || !isFinite(musicAudio.duration)) return;
    const pct = (musicAudio.currentTime / musicAudio.duration) * 100;
    const pg = document.getElementById("mpProgress");
    if (pg) pg.value = pct;
    const ctEl = document.getElementById("mpCurTime");
    if (ctEl) ctEl.textContent = _formatTime(musicAudio.currentTime);
  }, 250);
}

function _renderLrcBody() {
  const el = document.getElementById("mpLrcBody");
  if (!el) return;
  if (!_lrcLines.length) {
    el.innerHTML = '<div class="mp-lrc-empty">暂无歌词</div>';
    return;
  }
  el.innerHTML = _lrcLines.map(l => `<div class="mp-lrc-line">${escapeHtml(l.text)}</div>`).join("");
}

// 播放面板：播放/暂停
window.mpTogglePlay = () => {
  if (musicAudio && !musicAudio.paused) { musicAudio.pause(); }
  else if (musicAudio && musicAudio.paused) { musicAudio.play().catch(() => {}); }
  else { _playNextRandom(); }
};

// ─── 云端曲库浏览弹窗 ───
window.refreshCloudIndex = async () => {
  const lf = _ensureMusicLF();
  if (lf) {
    try { await lf.removeItem(CLOUD_MUSIC_LF_KEY); } catch(e) {}
    try { await lf.removeItem(CLOUD_MUSIC_LF_META); } catch(e) {}
  }
  cloudSongCache = null;
  _shufflePool = []; _shuffleIdx = -1;
  await fetchCloudIndex(true);
  toast("曲库已刷新");
};

window.openCloudMusicLibrary = async () => {
  const songs = await fetchCloudIndex();
  if (!songs.length) { toast("曲库无数据", "warn"); return; }
  renderCloudModal(songs);
};

function _parseCloudSongName(name) {
  const idx = name.lastIndexOf("-");
  if (idx > 0) return { title: name.substring(0, idx).trim(), artist: name.substring(idx + 1).trim() };
  return { title: name, artist: "" };
}

function renderCloudModal(songs) {
  const html = `
    <div class="cml-search-wrap">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="cml-search" id="cmlSearch" placeholder="搜索歌曲 / 歌手…" oninput="filterCloudSongs()">
    </div>
    <div class="cml-status" id="cmlStatus">当前: <b>${escapeHtml(cfg.musicTitle || "未选择")}</b>${cfg.musicArtist ? " — " + escapeHtml(cfg.musicArtist) : ""}</div>
    <div class="cml-list" id="cmlList"></div>
  `;
  modal("云端曲库", html);
  window._cmlSongs = songs;
  renderCloudSongList(songs);
}

window.filterCloudSongs = () => {
  const q = (document.getElementById("cmlSearch")?.value || "").trim().toLowerCase();
  const all = window._cmlSongs || [];
  renderCloudSongList(q ? all.filter(s => s.name.toLowerCase().includes(q)) : all);
};

function renderCloudSongList(songs) {
  const el = document.getElementById("cmlList");
  if (!el) return;
  if (!songs.length) { el.innerHTML = '<div class="cml-empty">未找到匹配歌曲</div>'; return; }

  const currentUrl = cfg.musicUrl || "";
  el.innerHTML = songs.map((s, i) => {
    const { title, artist } = _parseCloudSongName(s.name);
    const isActive = currentUrl === s.mp3;
    return `
      <div class="cml-item${isActive ? " active" : ""}" onclick="selectCloudSong(${i})" data-idx="${i}">
        <div class="cml-item-left">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>
          <div class="cml-item-info">
            <div class="cml-item-title">${escapeHtml(title)}</div>
            <div class="cml-item-artist">${escapeHtml(artist)}</div>
          </div>
        </div>
        <div class="cml-item-check">${isActive ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' : ""}</div>
      </div>`;
  }).join("");
  window._cmlFiltered = songs;
}

window.selectCloudSong = async (filteredIdx) => {
  const obj = window._cmlFiltered ? window._cmlFiltered[filteredIdx] : undefined;
  if (!obj) return;
  const { title, artist } = _parseCloudSongName(obj.name);
  cfg.musicUrl = obj.mp3;
  cfg.musicTitle = title;
  cfg.musicArtist = artist;
  // 只存 URL，不存歌词文本（文本由 _lrcTextCache 管理）
  cfg.musicLrc = (obj.lrc && obj.lrc.startsWith("http")) ? obj.lrc : "";
  texts.l1_song = title;
  texts.l1_artist = artist;
  await saveAll();
  syncUI();
  if (window._cmlSongs) renderCloudSongList(window._cmlSongs);
  closeModal();
  toast(`已选择: ${title}`);
  // 切换当前播放（传曲目给 _playNextRandom，避免被 _ensureShufflePool 重新洗牌覆盖）
  if (musicAudio && !musicAudio.paused) {
    musicAudio.pause(); musicAudio = null;
    _playNextRandom(obj);
  }
};

/* ⭕ 聊天里的推荐歌曲卡片：点击即播这一首（单曲成池，不动原随机队列逻辑） */
window.playMsgSong = async (idx) => {
  const m = chats[idx];
  if (!m || !m.song) return;
  if (!m.songUrl) { toast("这条推荐没有可用音源", "warn"); return; }
  const obj = {
    name: m.songArtist ? `${m.songName||"未知曲目"} - ${m.songArtist}` : (m.songName||"未知曲目"),
    mp3: m.songUrl,
    lrc: m.songLrc || ""
  };
  if (musicAudio) { musicAudio.pause(); musicAudio = null; }
  await _playNextRandom(obj);
  toast("正在播放推荐歌曲");
};

// ═══ 云端字卡库 ═══
const CLOUD_CARD_LF_KEY = "cy-card-index";
/* ⭕ 云端索引的本地缓存有效期。
   原来是"只要缓存存在就永远用" —— 你在仓库里新增了表情/字卡，本机却永远停在
   第一次拉到的那份，看上去就是"云端加了但拉不到"。现在超过 TTL 就重新拉一次。 */
const CLOUD_INDEX_TTL = 6*3600*1000;
/* ⭕ 给索引 URL 追一个时间戳：绕过浏览器/CDN 缓存，保证拿到的是仓库里最新的那份 */
function _cloudIndexUrl(base){
  return base + (base.indexOf("?")>=0 ? "&" : "?") + "t=" + Date.now();
}

let _cardLF = null;
function _ensureCardLF() {
  if (!_cardLF && typeof localforage !== "undefined") {
    _cardLF = localforage.createInstance({ name: "SilentChamberCardCache" });
  }
  return _cardLF;
}

// 将 {categories:{key:{label,items}}} 转为扁平数组 [{cat:label,key,items}]]
function _normaliseCloudCards(data) {
  if (Array.isArray(data)) {
    // 旧格式直接数组: [{cat,items}] 或 [{cat,items:[{id,text}]}]
    return data;
  }
  if (data.cards && Array.isArray(data.cards)) {
    return data.cards; // {cards:[{cat,items}]} 包装
  }
  if (data.groups && Array.isArray(data.groups)) {
    return data.groups; // {groups:[{cat,items}]} 包装
  }
  if (data.categories && typeof data.categories === "object") {
    // 新格式: {categories:{key:{label,items:[{id,text,tags}]}}}
    const result = [];
    Object.entries(data.categories).forEach(([key, cat]) => {
      if (!cat.items || !cat.items.length) return;
      result.push({ cat: cat.label || key, key, items: cat.items });
    });
    return result;
  }
  return [];
}

function _flattenCloudCards(groups) {
  const all = [];
  groups.forEach(g => {
    (g.items || []).forEach(item => {
      const text = typeof item === "string" ? item : (item.text || "");
      const translation = typeof item === "string" ? "" : (item.translation || item.tr || "");
      if (text) all.push({ cat: g.cat, text, translation });
    });
  });
  return all;
}

async function fetchCloudCards(forceRefresh) {
  const lf = _ensureCardLF();
  const indexUrl = _jsdelivr(cfg.cloudCardIndexUrl, "https://cdn.jsdelivr.net/gh/fcylz/cy-chat@main/Word/word.json");

  if (!forceRefresh && cloudCardCache && cloudCardCache.length) return cloudCardCache;

  if (!forceRefresh && lf) {
    try {
      const cached = await lf.getItem(CLOUD_CARD_LF_KEY);
      /* ⭕ 缓存也要过期：否则云端新增的字卡永远进不来 */
      if (cached && cached.cards && cached.cards.length && Date.now()-cached.at < CLOUD_INDEX_TTL) {
        cloudCardCache = cached.cards;
        updateCloudCardStatus(`已缓存 ${cached.cards.length} 组 · ${new Date(cached.at).toLocaleDateString()}`);
        return cached.cards;
      }
    } catch (e) {}
  }

  updateCloudCardStatus("正在连接…");
  try {
    const res = await fetch(_cloudIndexUrl(indexUrl));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const cardsData = _normaliseCloudCards(data);
    if (!Array.isArray(cardsData) || !cardsData.length) throw new Error("索引为空");

    cloudCardCache = cardsData;
    if (lf) {
      try { await lf.setItem(CLOUD_CARD_LF_KEY, { cards: cardsData, at: Date.now() }); } catch (e) {}
    }
    cfg.cloudCardLastSync = Date.now();
    saveAllDebounced();
    const totalItems = cardsData.reduce((s, g) => s + (g.items ? g.items.length : 0), 0);
    updateCloudCardStatus(`共 ${cardsData.length} 组 · ${totalItems} 条 · 已同步`);
    return cardsData;
  } catch (e) {
    updateCloudCardStatus("连接失败，使用缓存数据");
    if (cloudCardCache) return cloudCardCache;
    if (lf) {
      try { const c = await lf.getItem(CLOUD_CARD_LF_KEY); if (c && c.cards) { cloudCardCache = c.cards; updateCloudCardStatus(`共 ${c.cards.length} 组 · 离线缓存`); return c.cards; } } catch(e2) {}
    }
    toast("无法获取云端字卡", "warn");
    return [];
  }
}

function updateCloudCardStatus(msg) {
  const el = document.getElementById("cloudCardStatus");
  if (el) { el.style.display = ""; el.textContent = msg; }
}

window.refreshCloudCards = async () => {
  const lf = _ensureCardLF();
  if (lf) { try { await lf.removeItem(CLOUD_CARD_LF_KEY); } catch(e) {} }
  cloudCardCache = null;
  const groups = await fetchCloudCards(true);
  /* ⭕ 弹窗还开着就就地重渲染 —— 否则刷新完了界面还是旧列表 */
  if (document.getElementById("cclList")) renderCloudCardModal(groups || []);
  toast(groups && groups.length ? `字卡库已刷新 · 共 ${groups.length} 组` : "字卡库刷新失败","ok");
  return groups;
};

window.openCloudCardLibrary = async () => {
  const groups = await fetchCloudCards();
  if (!groups.length) { toast("云端字卡无数据", "warn"); return; }
  renderCloudCardModal(groups);
};

// 分组数据结构: { cat:"显示名", key:"内部键", items:[{id,text,tags}]|["字符串"] }
function _cloudItemText(item) {
  return typeof item === "string" ? item.trim() : (item.text || "").trim();
}
function _cloudItemTranslation(item) {
  return typeof item === "string" ? "" : (item.translation || item.tr || "");
}

function renderCloudCardModal(groups) {
  const totalItems = groups.reduce((s, g) => s + (g.items ? g.items.length : 0), 0);
  let html = `
    <div class="cml-search-wrap">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="cml-search" id="cclSearch" placeholder="搜索分组 / 内容…" oninput="filterCloudCards()">
    </div>
    <div class="cml-status">本地: <b>${cards.length}</b> 条 · 云端: <b>${totalItems}</b> 条 · 点击分组预览内容，勾选导入</div>
    <div class="cml-list" id="cclList"></div>
    <div class="ccl-actions">
      <button class="pill-btn" onclick="importSelectedCards()" id="cclImportBtn" disabled>导入选中</button>
      <button class="pill-btn" onclick="selectAllCloudCards()">全选</button>
      <button class="pill-btn" onclick="window.refreshCloudCards()">刷新云端</button>
      <button class="pill-btn" onclick="closeModal()">关闭</button>
    </div>
    <div id="cloudCardStatus" style="font-size:calc(var(--fs)*.7);color:var(--text-mute);margin:6px 0 0;"></div>
  `;
  modal("云端字卡库", html);
  window._cclGroups = groups;
  window._cclSelected = new Set();
  renderCloudCardGroupList(groups);
  /* ⭕ 状态行是弹窗里的元素 —— 拉的时候它还不存在，所以渲染完补一次 */
  updateCloudCardStatus(`云端 ${groups.length} 组 · ${totalItems} 条`);

  // 监听复选框变化
  document.getElementById("cclList")?.addEventListener("change", updateCclImportBtn);
}

window.filterCloudCards = () => {
  const q = (document.getElementById("cclSearch")?.value || "").trim().toLowerCase();
  const all = window._cclGroups || [];
  if (!q) return renderCloudCardGroupList(all);
  const filtered = all.filter(g =>
    g.cat.toLowerCase().includes(q) ||
    (g.items || []).some(item => _cloudItemText(item).toLowerCase().includes(q))
  );
  renderCloudCardGroupList(filtered);
};

function _allCloudCardItems(groups) {
  return _flattenCloudCards(groups);
}

window._getAllCloudCardItems = () => _allCloudCardItems(window._cclGroups || []);

function renderCloudCardGroupList(groups) {
  const el = document.getElementById("cclList");
  if (!el) return;
  const have = _localCardKeys();   /* ⭕ 本地已有字卡的内容键，用来标「已导入」 */

  if (!groups.length) {
    el.innerHTML = '<div class="cml-empty">未找到匹配分组</div>';
    return;
  }

  el.innerHTML = groups.map((g, gi) => {
    /* ⛔ 下标必须留**原始位置**：下面会滤掉空正文项，若拿过滤后的位置当身份，
       `importSelectedCards` 按未过滤的 `g.items[idx]` 取 → 勾第 N 行、导入的是别的行。
       筛选只影响显示，不影响身份。 */
    const items = (g.items || [])
      .map((item, oi) => ({ item, oi }))
      .filter(x => _cloudItemText(x.item).length > 0);
    if (!items.length) return "";
    const preview = items.slice(0, 3).map(({ item }) => {
      const txt = _cloudItemText(item);
      return `<span class="ccl-preview-item">${escapeHtml(txt.length > 18 ? txt.slice(0, 18) + "…" : txt)}</span>`;
    }).join("");
    const tail = items.length > 3 ? `<span class="ccl-preview-more">+${items.length - 3}</span>` : "";

    return `
    <div class="ccl-group">
      <div class="ccl-group-head" onclick="this.parentElement.classList.toggle('open')">
        <span class="ccl-group-arrow">›</span>
        <label class="ccl-group-check" onclick="event.stopPropagation()">
          <input type="checkbox" class="ccl-group-cb" data-gidx="${gi}" onchange="toggleCloudCardGroup(this, '${escapeAttr(g.cat)}')">
        </label>
        <b class="ccl-group-name">${escapeHtml(g.cat)}</b>
        <span class="ccl-group-cnt">${items.length} 条</span>
      </div>
      <div class="ccl-group-body">
        ${items.map(({ item, oi }) => {
          const text = _cloudItemText(item);
          const translation = _cloudItemTranslation(item);
          const id = `${g.cat}::${oi}`;   /* ⛔ oi = g.items 里的原下标，不是过滤后的位置 */
          /* ⭕ 与表情库同一个道理：本地已有的标「已导入」并禁止再勾选 */
          const dup = !!(_cardKey({ text, cat: g.cat }) && have.has(_cardKey({ text, cat: g.cat })));
          const checked = !dup && (window._cclSelected?.has(id) || false);
          return `<label class="ccl-item-row"${dup ? ' style="opacity:.5"' : ""}>
            <input type="checkbox" class="ccl-item-cb" data-id="${escapeAttr(id)}" data-cat="${escapeAttr(g.cat)}" data-text="${escapeAttr(text)}" data-tr="${escapeAttr(translation)}" ${dup ? "disabled" : ""} ${checked ? "checked" : ""} onchange="toggleCloudCardItem(this,'${escapeAttr(id)}')">
            <span class="ccl-item-text">${escapeHtml(text)}</span>
            ${translation ? `<span class="ccl-item-tr">${escapeHtml(translation)}</span>` : ""}
            ${dup ? '<span class="ccl-item-tr">已导入</span>' : ""}
          </label>`;
        }).join("")}
      </div>
    </div>`;
  }).join("");

  updateCclImportBtn();
}

window.toggleCloudCardGroup = (cb, cat) => {
  const checked = cb.checked;
  const body = cb.closest(".ccl-group")?.querySelector(".ccl-group-body");
  if (body) {
    body.querySelectorAll(".ccl-item-cb").forEach(itemCb => {
      if (itemCb.disabled) return;        // ⭕ 已导入的不跟着全选/取消，避免再进一份
      itemCb.checked = checked;
      const id = itemCb.dataset.id;
      if (id) { if (checked) window._cclSelected.add(id); else window._cclSelected.delete(id); }
    });
  }
  updateCclImportBtn();
};

window.toggleCloudCardItem = (cb, id) => {
  if (cb.checked) window._cclSelected.add(id);
  else window._cclSelected.delete(id);
  updateCclImportBtn();
};

function updateCclImportBtn() {
  const btn = document.getElementById("cclImportBtn");
  if (!btn) return;
  const cnt = window._cclSelected?.size || 0;
  btn.textContent = `导入选中 (${cnt})`;
  btn.disabled = cnt === 0;
}

window.selectAllCloudCards = () => {
  const all = window._cclGroups || [];
  const have = _localCardKeys();      /* ⭕ 跳过已导入的 */
  window._cclSelected = new Set();
  all.forEach(g => {
    (g.items || []).forEach((item, ii) => {
      const t = _cloudItemText(item);
      const k = _cardKey({ text: t, cat: g.cat });
      if (k && have.has(k)) return;
      window._cclSelected.add(`${g.cat}::${ii}`);
    });
  });
  renderCloudCardGroupList(all);
};

window.importSelectedCards = async () => {
  if (!window._cclSelected || window._cclSelected.size === 0) { toast("未选择字卡"); return; }
  const all = _flattenCloudCards(window._cclGroups || []);
  const selected = [];
  window._cclSelected.forEach(id => {
    const [cat, idxStr] = id.split("::");
    const idx = parseInt(idxStr);
    // 通过 cat+idx 定位到原始分组中的项
    const groupFound = (window._cclGroups || []).find(g => g.cat === cat);
    if (!groupFound || !groupFound.items) return;
    const item = groupFound.items[idx];
    if (!item) return;
    const text = _cloudItemText(item);
    const translation = _cloudItemTranslation(item);
    if (text) selected.push({ cat, text, translation });
  });

  if (!selected.length) { toast("无有效内容"); return; }

  /* ⭕ 判重键与同步合并层统一（cat + 正文），避免两边标准不一致 */
  const have = new Set(cards.map(_cardKey));
  const dupes = [];
  const fresh = [];
  selected.forEach(item => {
    const k = _cardKey({ text: item.text, cat: item.cat });
    if (k && have.has(k)) {
      dupes.push(item);
    } else {
      if (k) have.add(k);
      fresh.push(item);
    }
  });

  let added = 0;
  fresh.forEach(item => {
    if (cards.length >= MAX_CARDS) return;
    cards.push({ id: "c" + Date.now() + (added++), text: item.text, translation: item.translation, cat: item.cat });
  });

  cards = _dedupeBy(cards, _cardKey);   /* ⭕ 兜底：按内容键再收一遍 */
  await saveAll();
  renderCards();
  closeModal();
  const msg = `已导入 ${added} 条`;
  if (dupes.length) toast(`${msg}（跳过 ${dupes.length} 条已导入）`);
  else toast(msg);
};

// ═══ 云端表情包库 ═══
const CLOUD_STICKER_LF_KEY = "cy-sticker-index";

let _stickerLF = null;
function _ensureStickerLF() {
  if (!_stickerLF && typeof localforage !== "undefined") {
    _stickerLF = localforage.createInstance({ name: "SilentChamberStickerCache" });
  }
  return _stickerLF;
}

// 将 {categories:{key:{label,items}}} 转为扁平数组 [{name,src,cat,catLabel,...}]
function _normaliseCloudStickers(data) {
  if (Array.isArray(data)) {
    return data;
  }
  if (data.stickers && Array.isArray(data.stickers)) {
    return data.stickers;
  }
  if (data.categories && typeof data.categories === "object") {
    const result = [];
    Object.entries(data.categories).forEach(([key, cat]) => {
      if (!cat.items || !cat.items.length) return;
      cat.items.forEach(item => {
        const obj = typeof item === "object" && item !== null ? item : {};
        result.push({ ...obj, catLabel: cat.label || key, catKey: key });
      });
    });
    return result;
  }
  return [];
}

async function fetchCloudStickers(forceRefresh) {
  const lf = _ensureStickerLF();
  const indexUrl = _jsdelivr(cfg.cloudStickerIndexUrl, "https://cdn.jsdelivr.net/gh/fcylz/cy-chat@main/Meme/meme.json");

  if (!forceRefresh && cloudStickerCache && cloudStickerCache.length) return cloudStickerCache;

  if (!forceRefresh && lf) {
    try {
      const cached = await lf.getItem(CLOUD_STICKER_LF_KEY);
      /* ⭕ 同上：缓存过期就重拉，云端新增的表情才拉得到 */
      if (cached && cached.stickers && cached.stickers.length && Date.now()-cached.at < CLOUD_INDEX_TTL) {
        cloudStickerCache = cached.stickers;
        updateCloudStickerStatus(`已缓存 ${cached.stickers.length} 个 · ${new Date(cached.at).toLocaleDateString()}`);
        return cached.stickers;
      }
    } catch (e) {}
  }

  updateCloudStickerStatus("正在连接…");
  try {
    const res = await fetch(_cloudIndexUrl(indexUrl));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const stkData = _normaliseCloudStickers(data);
    if (!Array.isArray(stkData) || !stkData.length) throw new Error("索引为空（暂无表情）");

    cloudStickerCache = stkData;
    if (lf) {
      try { await lf.setItem(CLOUD_STICKER_LF_KEY, { stickers: stkData, at: Date.now() }); } catch (e) {}
    }
    cfg.cloudStickerLastSync = Date.now();
    saveAllDebounced();
    updateCloudStickerStatus(`共 ${stkData.length} 个 · 已同步`);
    return stkData;
  } catch (e) {
    updateCloudStickerStatus("连接失败，使用缓存数据");
    if (cloudStickerCache) return cloudStickerCache;
    if (lf) {
      try { const c = await lf.getItem(CLOUD_STICKER_LF_KEY); if (c && c.stickers) { cloudStickerCache = c.stickers; updateCloudStickerStatus(`共 ${c.stickers.length} 个 · 离线缓存`); return c.stickers; } } catch(e2) {}
    }
    toast("无法获取云端表情包", "warn");
    return [];
  }
}

function updateCloudStickerStatus(msg) {
  const el = document.getElementById("cloudStickerStatus");
  if (el) { el.style.display = ""; el.textContent = msg; }
}

window.refreshCloudStickers = async () => {
  const lf = _ensureStickerLF();
  if (lf) { try { await lf.removeItem(CLOUD_STICKER_LF_KEY); } catch(e) {} }
  cloudStickerCache = null;
  const stks = await fetchCloudStickers(true);
  /* ⭕ 同上：弹窗开着就重渲染，否则刷新了也看不出来 */
  if (document.getElementById("cskGrid")) renderCloudStickerModal(stks || []);
  toast(stks && stks.length ? `表情库已刷新 · 共 ${stks.length} 个` : "表情库刷新失败","ok");
  return stks;
};

window.openCloudStickerLibrary = async () => {
  const stks = await fetchCloudStickers();
  if (!stks.length) { toast("云端表情无数据", "warn"); return; }
  renderCloudStickerModal(stks);
};

function renderCloudStickerModal(stks) {
  let html = `
    <div class="cml-search-wrap">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="cml-search" id="cskSearch" placeholder="搜索表情…" oninput="filterCloudStickers()">
    </div>
    <div class="cml-status">本地: <b>${stickers.length}</b> 个 · 云端: <b>${stks.length}</b> 个</div>
    <div class="csk-grid" id="cskGrid"></div>
    <div class="ccl-actions">
      <button class="pill-btn" onclick="importSelectedStickers()" id="cskImportBtn" disabled>导入选中</button>
      <button class="pill-btn" onclick="selectAllCloudStickers()">全选</button>
      <button class="pill-btn" onclick="window.refreshCloudStickers()">刷新云端</button>
      <button class="pill-btn" onclick="closeModal()">关闭</button>
    </div>
    <div id="cloudStickerStatus" style="font-size:calc(var(--fs)*.7);color:var(--text-mute);margin:6px 0 0;"></div>
  `;
  modal("云端表情库", html);
  window._cskData = stks;
  window._cskSelected = new Set();
  renderCloudStickerGrid(stks);
  document.getElementById("cskGrid")?.addEventListener("change", updateCskImportBtn);
  updateCloudStickerStatus(`云端 ${stks.length} 个`);   /* ⭕ 同上：渲染完补一次状态 */
}

window.filterCloudStickers = () => {
  const q = (document.getElementById("cskSearch")?.value || "").trim().toLowerCase();
  const all = window._cskData || [];
  if (!q) return renderCloudStickerGrid(all);
  renderCloudStickerGrid(all.filter(s =>
    (_stickerName(s) || "").toLowerCase().includes(q) ||
    (s.catLabel || "").toLowerCase().includes(q)
  ));
};

// 从云表情索引 URL 推导出图片资源的基础路径（仓库根目录）
// 例如 https://…/cy-chat/main/Meme/meme.json → https://…/cy-chat/main/
function _cloudStickerBase() {
  const idx = _jsdelivr(cfg.cloudStickerIndexUrl, "https://cdn.jsdelivr.net/gh/fcylz/cy-chat@main/Meme/meme.json");
  // meme.json 内的 url 字段是相对于仓库根的（如 Meme/images/xxx.jpg），所以取 /main/ 层级
  const m = idx.match(/^(.+\/[^\/]+\/)Meme\/meme\.json$/);
  if (m) return m[1];
  // 兜底：去掉 meme.json，再退两层目录
  return idx.replace(/Meme\/meme\.json$/, "");
}
function _stickerSrc(s) {
  const raw = s.src || s.url || "";
  if (!raw || /^https?:\/\//.test(raw)) return raw;
  // 相对路径：拼到 Meme/ 目录下
  return _cloudStickerBase() + raw;
}
function _stickerName(s) { return s.name || s.title || s.label || "未命名"; }

function renderCloudStickerGrid(stks) {
  const el = document.getElementById("cskGrid");
  if (!el) return;
  if (!stks.length) { el.innerHTML = '<div class="cml-empty">未找到表情</div>'; return; }

  /* ⭕ 本地已有的标成「已导入」并**禁止再勾选**：
     否则刷新一次云端列表、再全选导一遍，同一批表情就又进了一份 —— 这就是"重新拉取会叠加"。 */
  /* ⛔ 下标要回**原始全量数组**里取：stks 可能是搜索过滤后的子集，
     若拿子集下标当身份，搜索状态下勾选 → importSelectedStickers 按全量 _cskData[idx] 取
     → 导进来的是别的表情。筛选只影响显示，不影响身份。 */
  const full = window._cskData || stks;
  const have = _localStickerKeys();
  el.innerHTML = stks.map(s => {
    const oi = full.indexOf(s);
    if (oi < 0) return "";
    const src = _stickerSrc(s);
    const name = _stickerName(s);
    const cat = s.catLabel || "";
    const id = `csk_${oi}`;
    const dup = !!(_stickerKey(src) && have.has(_stickerKey(src)));
    const checked = !dup && (window._cskSelected?.has(id) || false);
    return `<div class="csk-item"${dup ? ' style="opacity:.5"' : ""}>
      <div class="csk-img-wrap">
        <img src="${escapeHtml(src)}" loading="lazy" onerror="this.parentElement.classList.add('broken')">
        ${!src ? '<div class="csk-broken">无图</div>' : ""}
      </div>
      <div class="csk-name">${escapeHtml(name)}</div>
      ${cat ? `<div class="csk-cat">${escapeHtml(cat)}</div>` : ""}
      <label class="csk-check">
        <input type="checkbox" data-id="${escapeAttr(id)}" data-src="${escapeAttr(src)}" ${dup ? "disabled" : ""} ${checked ? "checked" : ""} onchange="toggleCloudStickerItem(this,'${escapeAttr(id)}')">
        <span>${dup ? "已导入" : (checked ? "已选" : "选择")}</span>
      </label>
    </div>`;
  }).join("");
  updateCskImportBtn();
}

window.toggleCloudStickerItem = (cb, id) => {
  if (cb.checked) window._cskSelected.add(id);
  else window._cskSelected.delete(id);
  updateCskImportBtn();
};

function updateCskImportBtn() {
  const btn = document.getElementById("cskImportBtn");
  if (!btn) return;
  const cnt = window._cskSelected?.size || 0;
  btn.textContent = `导入选中 (${cnt})`;
  btn.disabled = cnt === 0;
}

window.selectAllCloudStickers = () => {
  /* ⭕ 跳过已导入的：全选只选本地还缺的那些 */
  const have = _localStickerKeys();
  window._cskSelected = new Set();
  (window._cskData || []).forEach((s, i) => {
    const k = _stickerKey(_stickerSrc(s));
    if (!(k && have.has(k))) window._cskSelected.add(`csk_${i}`);
  });
  renderCloudStickerGrid(window._cskData || []);
};

window.importSelectedStickers = async () => {
  if (!window._cskSelected || window._cskSelected.size === 0) { toast("未选择表情"); return; }
  const data = window._cskData || [];
  /* ⭕ 同上：按内容键判重，raw / jsdelivr 两种域名不会各进一份 */
  const existing = new Set(stickers.map(s => _stickerKey(s.src)));
  let added = 0, skipped = 0;

  window._cskSelected.forEach(id => {
    const idx = parseInt(id.replace("csk_", ""));
    const s = data[idx];
    if (!s) return;
    const src = _stickerSrc(s);
    if (!src) return;
    const k = _stickerKey(src);
    if (k && existing.has(k)) { skipped++; return; }
    stickers.push({ id: "sk" + Date.now() + added, src, type: "url", shielded: false, addedAt: Date.now() });
    existing.add(k);
    added++;
  });

  /* ⭕ 兜底：万一有漏网的键不一致，这里按内容键再收一遍，保证库里不留重复 */
  stickers = _dedupeBy(stickers, s=>_stickerKey(s&&s.src), (a,b)=>_stickerRank(a)-_stickerRank(b));
  await saveAll();
  renderStickers();
  closeModal();
  toast(skipped ? `已导入 ${added} 个（跳过 ${skipped} 个已导入）` : `已导入 ${added} 个`);
};

/* ═══ 库内重复清理 ═══
   历史遗留的两类重复：①两台设备各自导入过同一批云端内容（id 不同）；
   ②表情的 raw / jsdelivr 两种域名各占一条。合并层已经不会再产生新的，
   这里把**已经存在**的收掉：按内容键保留一条（表情优先留打得开的那条）。
   ⛔ 只删内容键完全相同的冗余项，幂等 —— 跑多少次结果都一样。
   auto=true = 启动自检：清掉了才提示，没清掉就完全静默。 */
window.dedupeLib = async (auto) => {
  const c0 = cards.length, s0 = stickers.length;
  cards = _dedupeBy(cards, _cardKey);
  /* ⭕ 表情走带 id 映射的版本：合并掉的那条不能就这么消失，
     聊天里的 stickerId 要改指到留下来的那条（同一张图）。 */
  const r = _dedupeStickersWithMap(stickers);
  stickers = r.list;
  const remap = _remapStickerIds(r.map);
  /* ⭕ 映射顺手存进 cfg.stickerAlias：万一将来有新的引用位置没被上面的遍历覆盖到，
     _findSticker 还能按这张表回溯到同一张图（兜底，见 _findSticker）。 */
  if(r.map.size) cfg.stickerAlias = Object.assign(cfg.stickerAlias || {}, Object.fromEntries(r.map));
  const dc = c0-cards.length, ds = s0-stickers.length;
  if(dc || ds){
    await saveAll();
    try{ window.renderCards(); window.renderStickers(); renderChats(); }catch(e){}
    toast(`${auto?"已自动清理重复内容":"已清理重复"}：字卡 ${dc} 条 · 表情 ${ds} 个`
      + (remap ? `（${remap} 条聊天已指向保留的那张）` : ""), "ok");
  } else if(!auto) toast("库里没有重复内容");
  return {cards:dc, stickers:ds, remapped:remap};
};
/* 只统计不动数据 —— 给「清理重复」入口用来先告诉你有多少 */
window.countDupes = () => {
  const cnt = (list, keyFn) => {
    const m = new Map(), n = { dup: 0 };
    for(const it of (Array.isArray(list)?list:[])){
      const k = keyFn(it);
      if(!k) continue;
      m.set(k, (m.get(k)||0)+1);
    }
    for(const v of m.values()) if(v>1) n.dup += v-1;
    return n.dup;
  };
  return { cards: cnt(cards, _cardKey), stickers: cnt(stickers, s=>_stickerKey(s&&s.src)) };
};
window.cleanDupes = async () => {
  const n = window.countDupes();
  if(!n.cards && !n.stickers){ toast("库里没有重复内容"); return; }
  const okDo = confirm(
    `检测到重复内容：字卡 ${n.cards} 条 · 表情 ${n.stickers} 个。\n\n` +
    `判重标准：字卡 = 分类 + 正文；表情 = 图片路径（raw / jsdelivr 两种域名算同一张）。\n` +
    `清理后每种只留一条，表情优先保留打得开的那条。\n\n确定清理吗？`
  );
  if(!okDo) return;
  await window.dedupeLib(false);
};

/* ════════════════════════════════════════════════════════
   ══ 留言板 (Message Board) ══
   用户留言的时间戳对标真实时间；彼的留言是「虚拟」的 ——
   以上一条留言为锚点往后推 1~5 天，并强制严格递增，
   所以时间线永远连贯，不是随机乱生成。
   ════════════════════════════════════════════════════════ */
const BOARD_REPLY_PROB    = 60;  // 用户发帖后，彼在这个帖子里「回复」的概率 %
const BOARD_REPLY_MIN     = 1;   // 回复条数下限
const BOARD_REPLY_MAX     = 10;  // 回复条数上限
const BOARD_OPP_POST_PROB = 30;  // 用户发帖后，彼自己也发一条新帖的概率 %
const BOARD_QUOTE_CHANCE  = 0.45;// 彼引用别人的话再补充的概率（可引帖子，也可引自己上一条回复）
const BOARD_FOLD_LEN      = 42;  // 列表页超过这个字数就截断，点进帖子才看全文
let boardOpenId = null;          // 当前打开的帖子 id（详情页用）
let boardQuote  = null;          // 用户正在引用的内容 {id, who, text}

/* ⭕ 老数据迁移：旧版留言是一条条平铺的，新版是「帖子 + 评论」两层。
   把旧数据里带 quote 的「彼的顶层回复」收进它上面那个帖子的 comments，
   其余保持为帖子 —— 这样升级后老留言不会错位。 */
function normalizeMsgs(){
  if(!Array.isArray(msgs)) msgs=[];
  const out=[];
  msgs.forEach(m=>{
    if(!m || typeof m!=="object") return;
    m.comments = Array.isArray(m.comments) ? m.comments : [];
    m.text = typeof m.text==="string" ? m.text : "";
    m.ts   = Number(m.ts) || Date.now();
    if(m.who==="opp" && m.quote && out.length){
      const host=out[out.length-1];
      host.comments.push({id:m.id||("bc"+m.ts), who:"opp", text:m.text, ts:m.ts,
                          quote:m.quote, read:!!m.read, arriveAt:m.arriveAt});
    } else out.push(m);
  });
  msgs=out;
}

/* ⭕ 彼的一天只分七个时段 —— 时刻是虚拟的，粗到这个粒度就够了，不再出现具体几点几分。
   边界按「起始小时」升序排列，24 点即收尾（晚上一直管到深夜）。 */
const BOARD_DAY_PARTS=[{h:0,n:"凌晨"},{h:5,n:"清晨"},{h:8,n:"早上"},{h:11,n:"中午"},{h:13,n:"下午"},{h:17,n:"傍晚"},{h:19,n:"晚上"}];
function boardDayPart(h){
  let n=BOARD_DAY_PARTS[0].n;
  for(const p of BOARD_DAY_PARTS) if(h>=p.h) n=p.n;
  return n;
}

/* ⭕ 时间戳：彼 → 「2026年09月22日 傍晚」；我 → 「2026年09月20日 21时32分」（真实时间） */
function fmtBoardTime(ts, who){
  const d=new Date(ts), p=n=>String(n).padStart(2,"0");
  const date=`${d.getFullYear()}年${p(d.getMonth()+1)}月${p(d.getDate())}日`;
  return who==="opp"
    ? `${date} ${boardDayPart(d.getHours())}`
    : `${date} ${p(d.getHours())}时${p(d.getMinutes())}分`;
}

/* ⭕ 彼的时间 = 真实的「日期」+ 随机的「时段」，两者互不干涉。
   —— 时刻刻意不去做任何对齐：不用晚于上一条、不用避开深夜、不管现在几点，
      六段里随便抽一段，落在 anchor 那一天就完事。
   —— 因为先后不由 ts 决定（看 _cmtRealTs 的 arriveAt），ts 只负责回答「大概什么时候」。 */
function _nextBoardTs(anchor){
  const d = new Date(anchor || Date.now());       // ⭕ 日期跟着真实时间轴走
  const pi = Math.floor(Math.random()*BOARD_DAY_PARTS.length);
  const end = (BOARD_DAY_PARTS[pi+1] || {h:24}).h;
  d.setHours(BOARD_DAY_PARTS[pi].h + Math.floor(Math.random()*Math.max(1, end-BOARD_DAY_PARTS[pi].h)),
             Math.floor(Math.random()*60), 0, 0); // ⭕ 时段与分钟纯随机
  return d.getTime();                              // ⭕ 不再往后追、不再跨天
}
/** ⭕ 一条回复的「真实先后」：彼的用到达时刻 arriveAt，我的用发送时刻 ts ——
    两者都在同一条真实时间轴上，可以直接比大小 */
function _cmtRealTs(c){ return Number(c&&c.arriveAt) || Number(c&&c.ts) || 0; }
/** ⭕ 渲染前统一按真实先后排序。
    之前只按数组插入顺序排：彼回复末尾排过一次（还是按虚拟 ts），我回复后却直接 push 到末尾，
    于是「我刚发的」反而排在彼那些虚拟未来时间之后，楼层号跟着错位。 */
function _commentsOf(post){
  return (post&&Array.isArray(post.comments) ? post.comments : [])
    .slice().sort((a,b)=>_cmtRealTs(a)-_cmtRealTs(b));
}
/** 帖子里的最后一条虚拟时间（给下一条彼回复当锚点）。
    ⭕ 取最大值而不是数组末元素 —— 我插在末尾的是真实时间，会把锚点拽回过去 */
function _lastTsIn(post){
  const cs = post.comments||[];
  return cs.length ? Math.max.apply(null, cs.map(c=>Number(c.ts)||0)) : post.ts;
}
/** 彼的内容带 arriveAt（真实时刻），没到点就不显示 —— 彼不会秒回 */
function _arrived(x, now){ return !x.arriveAt || x.arriveAt <= (now||Date.now()); }

function _boardName(who){ return who==="opp" ? (texts.opp_name||"对方") : (texts.l1_name||"我"); }
/* ⭕ 群聊模式同步到留言板：「彼」那一侧可能由某个群成员发言，
   所以名字和头像统一走这两个函数，不再写死 opp_name / oppAvatar */
function _boardWhoOf(x){
  if(!x) return texts.opp_name||"对方";
  if(x.name) return x.name;                       // 群成员名（老数据没有就往下走）
  return _boardName(x.who||"opp");
}
function _boardAvatar(x){
  if(x && x.memberId){
    const m=groupMembers.find(g=>g.id===x.memberId);
    if(m && m.avatar) return m.avatar;
  }
  const PH=window.DEFAULTS.PH_SVG;
  return x && x.who==="opp" ? (imgs.oppAvatar||PH) : (imgs.selfAvatar||PH);
}
/* ⭕ 群聊开着就随机挑一个成员当发言人，否则就是彼本人 */
function _pickBoardOpp(){
  if(cfg.groupMode && groupMembers.length){
    const m=groupMembers[Math.floor(Math.random()*groupMembers.length)];
    return {name:m.name||"", memberId:m.id||""};
  }
  return {name:texts.opp_name||"对方", memberId:""};
}

/** 彼的留言内容：优先组字，其次抽一张非歌词字卡 */
function _genBoardOppText(){
  if(cfg.recombOn && Math.random()*100 < (cfg.recombProb||0)){
    const g=genRecomb(); if(g) return g;
  }
  const pool=cards.filter(c=>!c.shielded&&!shieldedCats.includes(c.cat)&&c.cat!=="歌词库");
  if(pool.length) return pool[Math.floor(Math.random()*pool.length)].text;
  return "……";
}

/* ⭕ 列表页：一条留言 = 一条帖子。点卡片是「进帖子」，不是就地展开 ——
   全文和回复都在详情页里。 */
function renderBoard(){
  const list=document.getElementById("boardList"); if(!list) return;
  const now=Date.now();
  const vis=msgs.filter(p=>p.who==="self"||_arrived(p,now));
  if(!vis.length){ list.innerHTML=`<div class="board-empty">还没有人留言<br>写下第一句吧</div>`; return; }
  list.innerHTML=vis.map((p,i)=>{
    /* ⭕ 群聊模式下这条可能由某个成员发出，名字和头像都按发言人取 */
    const nm=_boardWhoOf(p), av=_boardAvatar(p), isOpp=p.who==="opp";
    const cs=_commentsOf(p).filter(c=>_arrived(c,now));
    const unread=cs.filter(c=>c.who==="opp"&&!c.read).length;
    const foldable = p.text.length>BOARD_FOLD_LEN || p.text.includes("\n");
    return `<div class="board-post${isOpp?" opp":""}${foldable?" foldable":""}" onclick="openBoardPost('${p.id}')">
      <div class="bp-head">
        <img class="bp-av" src="${escapeHtml(av)}" alt="">
        <div class="bp-meta">
          <div class="bp-name">${escapeHtml(nm)}</div>
          <div class="bp-time">${fmtBoardTime(p.ts, p.who)}</div>
        </div>
        <div class="bp-floor">${i+1}楼</div>
      </div>
      <div class="bp-body"><div class="bp-text">${escapeHtml(p.text).replace(/\n/g,"<br>")}</div></div>
      <div class="bp-foot">
        <span class="bp-cmt${unread?" hot":""}">${cs.length?cs.length+" 条回复":"还没有人回复"}</span>
        ${unread?`<span class="bp-dot"></span>`:""}
        ${foldable?`<span class="bp-more">看全文</span>`:""}
      </div>
    </div>`;
  }).join("");
}

/* ⭕ 进帖子：推上详情覆盖层，同时把这个帖子里的回复标记为已读 */
window.openBoardPost = id=>{
  boardOpenId=id; boardQuote=null;
  markPostRead(id);
  renderBoardDetail();
  const d=document.getElementById("boardDetail"); if(d) d.classList.add("open");
  renderBoard();
};
window.closeBoardPost = ()=>{
  boardOpenId=null; boardQuote=null;
  const d=document.getElementById("boardDetail"); if(d) d.classList.remove("open");
  renderBoard();
};

/* ⭕ 帖子详情：完整正文 + 楼中楼的回复 */
function renderBoardDetail(){
  const wrap=document.getElementById("boardDetail"); if(!wrap) return;
  const p=msgs.find(x=>x.id===boardOpenId);
  if(!p){ closeBoardPost(); return; }
  const now=Date.now();
  /* ⭕ 重绘会重建输入框，先把草稿捞回来 —— 否则一点「引用」输入到一半的话就没了 */
  const oldBox=document.getElementById("boardCmtInput"), draft=oldBox?oldBox.value:"";
  const cs=_commentsOf(p).filter(c=>_arrived(c,now));
  wrap.innerHTML=`
    <div class="bd-head">
      <button class="bd-back" onclick="closeBoardPost()">‹ 返回</button>
      <span class="bd-title">${cs.length?cs.length+" 条回复":"回复"}</span>
    </div>
    <div class="bd-scroll">
      <div class="bd-post">
        <div class="bp-head">
          <img class="bp-av" src="${escapeHtml(_boardAvatar(p))}" alt="">
          <div class="bp-meta">
            <div class="bp-name">${escapeHtml(_boardWhoOf(p))}</div>
            <div class="bp-time">${fmtBoardTime(p.ts, p.who)}</div>
          </div>
          <div class="bp-floor">楼主</div>
        </div>
        <div class="bd-text">${escapeHtml(p.text).replace(/\n/g,"<br>")}</div>
        <button class="bd-qbtn" onclick="setBoardQuote('${p.id}')">引用这条留言</button>
      </div>
      ${cs.length ? `<div class="bd-cmts">${cs.map((c,i)=>{
        const isOpp=c.who==="opp";
        const av=_boardAvatar(c);
        const q=c.quote?`<div class="bc-quote"><span class="bq-who">${escapeHtml(c.quote.who)}：</span>${escapeHtml(c.quote.text)}</div>`:"";
        return `<div class="bc-item">
          <img class="bc-av" src="${escapeHtml(av)}" alt="">
          <div class="bc-main">
            <div class="bc-top"><span class="bc-name">${escapeHtml(_boardWhoOf(c))}</span><span class="bc-floor">${i+1}楼</span></div>
            ${q}
            <div class="bc-text">${escapeHtml(c.text).replace(/\n/g,"<br>")}</div>
            <div class="bc-foot">
              <span class="bc-time">${fmtBoardTime(c.ts, c.who)}</span>
              <button class="bd-qbtn" onclick="setBoardQuote('${c.id}')">引用</button>
            </div>
          </div>
        </div>`;
      }).join("")}</div>` : `<div class="bd-cmt-empty">还没有人回复<br>说点什么吧</div>`}
    </div>
    ${boardQuote?`<div class="bd-qbar">
      <span class="bd-qbar-t">引用 ${escapeHtml(boardQuote.who)}：${escapeHtml(boardQuote.text)}</span>
      <button class="bd-qbar-x" onclick="clearBoardQuote()">×</button>
    </div>`:""}
    <div class="bd-input">
      <textarea id="boardCmtInput" rows="1" placeholder="${boardQuote?"接着这句说…":"回复这一条…"}"></textarea>
      <button class="board-send" onclick="sendBoardComment()">回复</button>
    </div>`;
  const box=document.getElementById("boardCmtInput");
  if(box){ box.value=draft; if(boardQuote) box.focus(); }
}
/* ⭕ 用户引用：帖子本身（留言）或某一条回复都行，点「引用」进入引用态 */
window.setBoardQuote = id=>{
  const p=msgs.find(x=>x.id===boardOpenId); if(!p) return;
  /* ⭕ 取完整对象，别只取 who/text —— 群聊下要带上发言成员的名字 */
  const src = (p.id===id) ? p : ((p.comments||[]).find(x=>x.id===id) || null);
  if(!src) return;
  boardQuote={id, who:_boardWhoOf(src), text:src.text};
  renderBoardDetail();
  const box=document.getElementById("boardCmtInput"); if(box) box.focus();
};
window.clearBoardQuote = ()=>{ boardQuote=null; renderBoardDetail(); };

/** 进帖子 = 把这个帖子里的未读回复消费掉（只消费「已到达」的） */
function markPostRead(id){
  const now=Date.now();
  const p=msgs.find(x=>x.id===id); if(!p) return;
  let changed=false;
  (p.comments||[]).forEach(c=>{ if(c.who==="opp"&&!c.read&&_arrived(c,now)){ c.read=true; changed=true; } });
  if(p.who==="opp"&&!p.read&&_arrived(p,now)){ p.read=true; changed=true; }
  if(changed) saveAllDebounced();
}
/** 全部标记已读（供「已读全部」类操作用；平时打开列表不清未读，否则红点就没了） */
function markBoardRead(){
  const now=Date.now();
  let changed=false;
  msgs.forEach(p=>{
    if(p.who==="opp"&&!p.read&&_arrived(p,now)){ p.read=true; changed=true; }
    (p.comments||[]).forEach(c=>{ if(c.who==="opp"&&!c.read&&_arrived(c,now)){ c.read=true; changed=true; } });
  });
  if(changed) saveAllDebounced();
}

/* ⭕ 发一条留言 = 发一个帖子（用户的帖子用真实时间） */
window.sendBoardMsg = ()=>{
  const box=document.getElementById("boardInput"); if(!box) return;
  const t=box.value.trim(); if(!t) return;
  const post={id:"bp"+Date.now()+Math.floor(Math.random()*1000), who:"self", text:t, ts:Date.now(), read:true, comments:[]};
  msgs.push(post);
  box.value="";
  renderBoard(); saveAllDebounced();
  if(Math.random()*100 < BOARD_REPLY_PROB)    scheduleBoardComments(post.id);
  if(Math.random()*100 < BOARD_OPP_POST_PROB) scheduleBoardOppPost();
};

/* ⭕ 在某个帖子里回复（真实时间） */
window.sendBoardComment = ()=>{
  const box=document.getElementById("boardCmtInput"); if(!box) return;
  const t=box.value.trim(); if(!t) return;
  const p=msgs.find(x=>x.id===boardOpenId); if(!p) return;
  p.comments=p.comments||[];
  p.comments.push({id:"bc"+Date.now()+Math.floor(Math.random()*1000), who:"self", text:t, ts:Date.now(), quote:boardQuote||null, read:true});
  /* ⭕ 按真实先后落位：不然这条会永远占着数组末尾，楼层号跟着乱 */
  p.comments.sort((a,b)=>_cmtRealTs(a)-_cmtRealTs(b));
  boardQuote=null;
  box.value="";
  renderBoardDetail(); renderBoard(); saveAllDebounced();
  /* 我回了之后，彼也可能接着补充 */
  if(Math.random()*100 < BOARD_REPLY_PROB) scheduleBoardComments(p.id);
};

/* ⭕ 彼在同一个帖子下回复 1~10 条。
   虚拟时间以「帖子里最后一条」为锚点；真实到达时刻 arriveAt 逐条拉开，
   所以彼不会秒回 —— 但回复本体已入库，关掉页面也不会丢。 */
function scheduleBoardComments(postId){
  const p=msgs.find(x=>x.id===postId); if(!p) return;
  const n=randInt(BOARD_REPLY_MIN, BOARD_REPLY_MAX);
  const now=Date.now();
  let arrive=now+randInt(15,45)*1000;
  for(let i=0;i<n;i++){
    const ts=_nextBoardTs(_lastTsIn(p));
    /* ⭕ 引用源 = 帖子本身 + 最近 3 条回复 —— 所以既可能回应我，
       也可能接着自己上一条继续补充 */
    const pool=[{id:p.id, who:_boardWhoOf(p), text:p.text}]
      .concat(_commentsOf(p).slice(-3).map(c=>({id:c.id, who:_boardWhoOf(c), text:c.text})));
    let quote=null;
    if(Math.random()<BOARD_QUOTE_CHANCE){
      const tgt=pool[Math.floor(Math.random()*pool.length)];
      quote={id:tgt.id, who:tgt.who, text:tgt.text};
    }
    p.comments=p.comments||[];
    p.comments.push({id:"bc"+ts+Math.floor(Math.random()*1000), who:"opp", text:_genBoardOppText(), ts, quote, read:false, arriveAt:arrive});
    /* 页面还开着就到点就地刷新；没开着也没关系，下次开屏由 checkBoardUnread 兜住 */
    setTimeout(()=>{ renderBoard(); if(boardOpenId===postId) renderBoardDetail(); saveAllDebounced(); }, arrive-now+300);
    arrive += randInt(20,90)*1000;
  }
  p.comments.sort((a,b)=>a.ts-b.ts);
  renderBoard(); if(boardOpenId===postId) renderBoardDetail(); saveAllDebounced();
}

/* ⭕ 彼自己也发一个新帖 */
function scheduleBoardOppPost(){
  const anchor = msgs.length ? msgs[msgs.length-1].ts : Date.now();
  const ts=_nextBoardTs(anchor);
  const now=Date.now();
  const arrive=now+randInt(30,120)*1000;
  const who=_pickBoardOpp(); /* ⭕ 群聊开着就由某个成员来发帖 */
  msgs.push({id:"bp"+ts+Math.floor(Math.random()*1000), who:"opp", text:_genBoardOppText(), ts, read:false, arriveAt:arrive, comments:[], name:who.name, memberId:who.memberId});
  setTimeout(()=>{ renderBoard(); saveAllDebounced(); }, arrive-now+300);
  renderBoard(); saveAllDebounced();
}

/** 开屏提醒：彼有新留言（新帖）或新回复（评论）时弹窗 */
function checkBoardUnread(){
  const now=Date.now();
  const unPosts=msgs.filter(p=>p.who==="opp"&&!p.read&&_arrived(p,now));
  const unCmts=[];
  msgs.forEach(p=>{
    (p.comments||[]).forEach(c=>{
      if(c.who==="opp"&&!c.read&&_arrived(c,now)) unCmts.push({post:p, c});
    });
  });
  if(!unPosts.length && !unCmts.length) return;
  const last = unCmts.length ? unCmts[unCmts.length-1].c : unPosts[unPosts.length-1];
  const nm=_boardWhoOf(last); /* ⭕ 群聊下是成员名，不是「对方」 */
  const desc=[ unPosts.length?`${unPosts.length} 条新留言`:"",
               unCmts.length?`${unCmts.length} 条新回复`:"" ].filter(Boolean).join(" · ");
  modal("留言板", `<div class="board-notify">
    <div class="bn-count">${escapeHtml(nm)} 留下了 ${desc}</div>
    <div class="bn-preview">${escapeHtml(last.text).slice(0,50)}${last.text.length>50?"…":""}</div>
    <div class="bn-time">${fmtBoardTime(last.ts,"opp")}</div>
    <div class="bn-actions">
      <button class="pill-btn" onclick="openBoardFromNotify()">去看看</button>
      <button class="pill-btn" onclick="closeModal()">稍后</button>
    </div>
  </div>`);
}
window.openBoardFromNotify = ()=>{
  closeModal(); openApp("statsApp"); switchStatsTab("board");
  /* 优先直接落到「有新回复」的那个帖子，省得用户再找 */
  const now=Date.now();
  const p=msgs.find(x=>(x.comments||[]).some(c=>c.who==="opp"&&!c.read&&_arrived(c,now)));
  if(p) openBoardPost(p.id);
};
