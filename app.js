"use strict";

window.DEFAULTS = {
  PH_SVG: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23c8cacd'/></svg>`),
  cfg: {
    layout:1, theme:"light", fontSize:13, chatFontSize:13,
    delayMin:2, delayMax:5, typingText:"", ignoreOn:false, quoteOn:true,
    sentenceJoin:true, activeSend:false, activeMin:5, activeMax:20, nextActiveAt:0,
    replyProb:60, // 用户发消息后彼自动回复的概率（0-100），默认60%
    popupOn:true, notifOn:false, soundOn:true, showAvatar:true, showName:true,
    showTime:true, showRead:true, showSelfRead:false, showSelfName:false,readText:"",
    customFont:"", customFontCss:"", customBubble:"", customChatCss:"",
    groupMode:false, chatStyle:1, inputPlaceholder:"", welcomeTitle:"",
    welcomeText:"", timeShowSeconds:false,
    oppTime:"", oppTimeDate:"", oppTimeSetAt:0, oppCustomTime:true,
    musicUrl:"", musicTitle:"", musicArtist:"", musicLrc:"",
    cloudMusicIndexUrl:"https://raw.githubusercontent.com/fcylz/cy-music/main/index.json",
    cloudCardIndexUrl:"https://raw.githubusercontent.com/fcylz/cy-chat/main/Word/word.json",
    cloudStickerIndexUrl:"https://raw.githubusercontent.com/fcylz/cy-chat/main/Meme/meme.json",
    cloudMusicLastSync:0, cloudCardLastSync:0, cloudStickerLastSync:0, activeSoundId:"__builtin_thud1__",
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

let cfg={}, imgs={}, texts={}, cards=[], chats=[], groupMembers=[], sounds=[], stickers=[];
let shieldedCats=[], selected=[], foldedCats=[], anniversaries=[], carousel=[];
let surveys=[], surveyRecords=[], surveyFill=null, editingSurvey=null, editingSurveyIsNew=false;
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
function fmtTime(d,withSec=false){ return withSec ? d.toTimeString().slice(0,8) : d.toTimeString().slice(0,5); }
function fmtDate(d){ return d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0"); }

// ─── Init ───
async function init() {
  try {
    await openDB();
    cfg           = Object.assign({}, window.DEFAULTS.cfg,          await dbGet("cfg",{}));
    imgs          = Object.assign({}, window.DEFAULTS.imgs,          await dbGet("imgs",{}));
    texts         = Object.assign({}, window.DEFAULTS.texts,         await dbGet("texts",{}));
    cards         = (await dbGet("cards",null))       || window.DEFAULTS.cards;
    chats         = (await dbGet("chats",[]))         || [];
    groupMembers  = (await dbGet("members",null))     || window.DEFAULTS.groupMembers;
    sounds        = (await dbGet("sounds",[]))        || [];
    shieldedCats  = (await dbGet("shieldedCats",[]))  || [];
    foldedCats    = (await dbGet("foldedCats",[]))    || [];
    anniversaries = (await dbGet("anniversaries",null))|| window.DEFAULTS.anniversaries;
    carousel      = (await dbGet("carousel",[]))      || [];
    surveys       = (await dbGet("surveys",null))     || window.DEFAULTS.surveys;
    surveyRecords = (await dbGet("surveyRecords",[])) || [];
    stickers      = (await dbGet("stickers",[]))      || [];
  } catch(e){ console.warn(e); }

  document.getElementById("dockL1").innerHTML = DOCK_HTML;
  document.getElementById("dockL2").innerHTML = DOCK_HTML;

  bindEditables();
  bindImageInteractions();
  bindFilePickers();
  bindChatScroll();
  bindMusicPlayer();
  _backgroundPreload();
  bindGlobalClose();
  bindPopup();
  bindMosaicLongPress();
  syncUI();
  initWelcomeParticles();
  renderChats();
  renderCarousel();
  renderMosaic();
  renderMembers();
  renderSoundList();
  scheduleActive(true);
  initAnniCard();
  initOppTime();

  matchMedia("(prefers-color-scheme:dark)").addEventListener("change", ()=>{ if(cfg.theme==="system") applyTheme(); });
}

async function saveAll() {
  if (!DB) return;
  return new Promise(res => {
    try {
      const t = DB.transaction("kv", "readwrite");
      const s = t.objectStore("kv");
      const data = {
        cfg, imgs, texts, cards, chats,
        members: groupMembers, sounds,
        shieldedCats, foldedCats, anniversaries, carousel,
        surveys, surveyRecords, stickers
      };
      for (const [k, v] of Object.entries(data)) s.put(v, k);
      t.oncomplete = () => res();
      t.onerror = () => res();
    } catch { res(); }
  });
}

// Debounced auto-save (300 ms) – avoids a DB write on every keypress
let _saveTimer = null;
function saveAllDebounced() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(saveAll, 300);
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
  document.querySelectorAll("[data-img]").forEach(el=>{
    const k=el.dataset.img;
    if(imgs[k]){ el.src=imgs[k]; el.removeAttribute("data-empty"); }
    else { el.src=window.DEFAULTS.PH_SVG; el.setAttribute("data-empty","1"); }
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
document.querySelectorAll(".slayout-opt[data-v]").forEach(el =>
  el.classList.toggle("active", +el.dataset.v === cfg.layout)
);
document.querySelectorAll(".stheme-opt[data-theme]").forEach(el =>
  el.classList.toggle("active", el.dataset.theme === cfg.theme)
);
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
  const muEl = document.getElementById("cfg_musicUrl");
  if(muEl) muEl.value = cfg.musicUrl || "";
  // sync active sound display
  if(document.getElementById("modalSndList")) renderModalSoundList();
  applyTheme(); applyFontSize(); applyCustomFont();
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
window.cfgToggle = async(k)=>{ cfg[k]=!cfg[k]; await saveAll(); syncUI(); if(k==="activeSend") scheduleActive(); if(document.getElementById("chatFlow")) renderChats(); };
window.setLayout = async(v)=>{ cfg.layout=+v; await saveAll(); syncUI(); document.querySelectorAll(".tab-switch .ts-opt[data-v]").forEach(el=>el.classList.toggle("active",+el.dataset.v===cfg.layout)); };
window.setTheme  = async(v)=>{ cfg.theme=v; await saveAll(); syncUI(); document.querySelectorAll(".tab-switch .ts-opt[data-theme]").forEach(el=>el.classList.toggle("active",el.dataset.theme===cfg.theme)); };
window.setUiFontSize  = async(v)=>{ cfg.fontSize=+v; await saveAll(); syncUI(); };
window.setChatFontSize= async(v)=>{ cfg.chatFontSize=+v; await saveAll(); syncUI(); };
window.setChatStyle = async v => {
  cfg.chatStyle = +v;
  await saveAll();
  syncUI();
  renderChats();
  document.querySelectorAll(".cs-card").forEach(el =>
    el.classList.toggle("active", +el.dataset.s === cfg.chatStyle)
  );
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
window.saveText = async(k,isCfg)=>{ const v=document.getElementById("m_text").value; if(isCfg) cfg[k]=v; else texts[k]=v; await saveAll(); syncUI(); closeModal(); };

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
window.clearImgKey = async k=>{ delete imgs[k]; await saveAll(); syncUI(); closeModal(); toast("已清除"); };

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

async function onPickImg(e){
  const f=e.target.files[0]; if(!f) return;
  const result = await _compressImg(f, 1200, 0.75);
  if(!result) return;
  const data = result.data;
  if(imgPickKey==="__memberAvatar__"&&memberPickIdx>-1){ groupMembers[memberPickIdx].avatar=data; await saveAll(); renderMembers(); return; }
  if(imgPickKey==="__carousel__"){
    if(carousel.length >= MAX_CAROUSEL){ toast(`轮播图已达上限 ${MAX_CAROUSEL} 张`,"warn"); return; }
    carousel.push({id:"car"+Date.now(),data}); await saveAll(); renderCarousel(); renderCarouselManage(); return;
  }
  if(imgPickKey==="__mosaic_new__"){ if(!imgs.mosaic) imgs.mosaic=[]; if(imgs.mosaic.length<4) imgs.mosaic.push(data); await saveAll(); renderMosaic(); return; }
  if(imgPickKey.startsWith("__mosaic_")){ const idx=parseInt(imgPickKey.split("_")[2]); if(imgs.mosaic?.[idx]!==undefined){ imgs.mosaic[idx]=data; await saveAll(); renderMosaic(); } return; }
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
    const c = new (window.AudioContext || window.webkitAudioContext)();
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = "sine"; o.frequency.setValueAtTime(120, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.28);
    o.start(); o.stop(c.currentTime + 0.28);
  } catch {}
}
function makeDullThud2() {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    const buf = c.createBuffer(1, c.sampleRate * 0.18, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4) * 0.22;
    }
    const src = c.createBufferSource(), g = c.createGain();
    const flt = c.createBiquadFilter(); flt.type = "lowpass"; flt.frequency.value = 200;
    src.buffer = buf; src.connect(flt); flt.connect(g); g.connect(c.destination);
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
      else new Audio(s.data).play().catch(()=>{});
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
function playSoundById(id) {
  if (id === "__builtin_thud1__") { makeDullThud1(); return; }
  if (id === "__builtin_thud2__") { makeDullThud2(); return; }
  const s = sounds.find(x => x.id === id);
  if (s) new Audio(s.data).play().catch(() => {});
  else makeDullThud1();
}
window.playSnd = i=>{ if(sounds[i]) new Audio(sounds[i].data).play().catch(()=>{}); };
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

function buildChatCtx(){
  return {
    showAv: cfg.showAvatar, showRead: cfg.showRead, showSelfRead: cfg.showSelfRead,
    selfName: cfg.showSelfName, showTime: cfg.showTime, withSec: cfg.timeShowSeconds,
    selfNm: texts.l1_name||texts.l2_name||"我",
    oppNm: texts.opp_name||"温语",
    readTxt: cfg.readText||"已阅",
    selfAv: imgs.selfAvatar||window.DEFAULTS.PH_SVG,
    oppAv: imgs.oppAvatar||window.DEFAULTS.PH_SVG,
  };
}

// Builds the DOM node(s) for chats[idx] (a date divider + the row, or just the row).
// Appends them into `frag` (a DocumentFragment or the live #chatFlow element).
function buildMsgInto(frag, m, idx, ctx, lastDateRef){
  if(m.date&&m.date!==lastDateRef.v){ const d=document.createElement("div"); d.className="dt-div"; d.innerHTML=`<span class="dt-text">${escapeHtml(m.date)}</span>`; frag.appendChild(d); lastDateRef.v=m.date; }
  if(m.lyric){
    const row=document.createElement("div"); row.className="row lyric"; row.id=`msg-row-${idx}`;
    row.innerHTML=`<div class="l-c"><div class="l-line">${escapeHtml(m.text)}</div>${m.translation?`<span class="l-tr">${escapeHtml(m.translation)}</span>`:""}</div>`;
    frag.appendChild(row); return;
  }
  const isSelf=m.sender==="self";
  const row=document.createElement("div"); row.className="row "+(isSelf?"self":"opp"); row.id=`msg-row-${idx}`;
  const av=isSelf?ctx.selfAv:(m.memberId ? ((groupMembers.find(g=>g.id===m.memberId)||{}).avatar||ctx.oppAv) : (m.avatar||ctx.oppAv));
  const nm=isSelf?ctx.selfNm:(m.name||ctx.oppNm);
  const showNm = isSelf ? ctx.selfName : cfg.showName;
  let timeStr="";
  if(ctx.showTime&&m.time&&(isSelf||!cfg.oppCustomTime)) timeStr=ctx.withSec&&m.timeWithSec?m.timeWithSec:m.time;
  const isAvStyle=cfg.chatStyle===2||cfg.chatStyle===4;
  const showOppTime=ctx.showTime&&!isSelf&&cfg.oppCustomTime&&!!cfg.oppTime;
  const oppTimeVal=showOppTime?getOppDisplayTime():"";
  const oppTimeSpan=showOppTime?`<span class="opp-time-val" onclick="event.stopPropagation();openOppTimeModal()">${oppTimeVal}</span>`:"";
  // av-meta items (shown below avatar in styles 2 & 4)
  const avItems=[];
  if(timeStr) avItems.push(timeStr);
  if(oppTimeSpan&&isAvStyle) avItems.push(oppTimeSpan);
  if(ctx.showRead&&isSelf) avItems.push(ctx.readTxt);
  if(ctx.showSelfRead&&!isSelf) avItems.push(ctx.readTxt);
  const avMetaHtml=avItems.length?`<div class="av-meta">${avItems.join("<br>")}</div>`:"";
  // row-meta items (shown below bubble in styles 1 & 3)
  const rowItems=[];
  if(timeStr) rowItems.push(timeStr);
  if(oppTimeSpan&&!isAvStyle) rowItems.push(oppTimeSpan);
  if(ctx.showRead&&isSelf) rowItems.push(ctx.readTxt);
  if(ctx.showSelfRead&&!isSelf) rowItems.push(ctx.readTxt);
  const stackMetaHtml=rowItems.length?`<div class="row-meta">${rowItems.join(" · ")}</div>`:"";
  const quoteHtml=m.quote?`<div class="quote-line" data-jump="${escapeHtml(m.quote)}"><div class="qarm"></div><div class="qtxt">${escapeHtml(m.quote)}</div></div>`:"";
  const transClass=openTrans.has(idx)?"show":"";
  const bodyHtml = m.sticker
    ? `<img class="sticker-msg" data-idx="${idx}" src="${resolveStickerSrc(m.stickerId)}" loading="lazy">`
    : `<div class="bubble message ${isSelf?"message-sent":"message-received"}" data-idx="${idx}">${escapeHtml(m.text).replace(/\n/g,"<br>")}</div>
      ${m.translation?`<div class="bubble-translation ${transClass}" id="trans-${idx}">${escapeHtml(m.translation)}</div>`:""}`;
  row.innerHTML=`
    ${ctx.showAv?`<div class="av-col"><img class="av" src="${av}">${avMetaHtml}</div>`:""}
    <div class="stack">
      ${showNm?`<div class="name-tag">${escapeHtml(nm)}</div>`:""}
      ${bodyHtml}
      ${quoteHtml}${stackMetaHtml}
    </div>`;
  if(m.sticker) bindStickerEvents(row,idx); else bindBubbleEvents(row,idx);
  const ql=row.querySelector(".quote-line");
  if(ql) ql.addEventListener("click",e=>{ e.stopPropagation(); jumpToMsg(ql.dataset.jump); });
  frag.appendChild(row);
}

// Full rebuild — used whenever messages were reordered/edited/removed/imported,
// or display settings that affect every row (avatar/time/name visibility) changed.
function renderChats(){
  const f=document.getElementById("chatFlow"); if(!f) return;
  const ctx=buildChatCtx();
  const frag=document.createDocumentFragment();
  const lastDateRef={v:""};
  chats.forEach((m,idx)=>buildMsgInto(frag,m,idx,ctx,lastDateRef));
  f.innerHTML="";
  f.appendChild(frag);
  f.scrollTop=f.scrollHeight;
  renderedMsgCount=chats.length; renderedLastDate=lastDateRef.v;
  unreadCount=0; updateScrollBot();
}

// Incremental append — used on ordinary new-message events (send / reply / sticker).
// Only builds DOM for the messages added since the last render, and only
// autoscrolls if the user was already at (or near) the bottom, so the view
// doesn't visibly jerk on every message the way a full rebuild does.
function appendNewChats(){
  const f=document.getElementById("chatFlow"); if(!f) return;
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
}

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
    pendingQuote=m.text; pendingQuoteFrom=m.sender==="self"?(texts.l1_name||"我"):(m.name||texts.opp_name||"对方");
    document.getElementById("qpFrom").innerText=pendingQuoteFrom; document.getElementById("qpText").innerText=pendingQuote;
    document.getElementById("quotePreview").classList.add("on"); hideCtxMenu(); getActiveInput()?.focus();
  });
  document.getElementById("ctxDel").addEventListener("click",async e=>{
    e.stopPropagation(); if(ctxTargetIdx<0) return;
    const idx=ctxTargetIdx; hideCtxMenu(); chats.splice(idx,1); openTrans=new Set(); await saveAll(); renderChats();
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
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
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

window.clearPendingQuote = ()=>{ pendingQuote=null; pendingQuoteFrom=""; document.getElementById("quotePreview").classList.remove("on"); };

function jumpToMsg(t){
  const idx=chats.findIndex(c=>c.text===t); if(idx===-1) return;
  const el=document.getElementById(`msg-row-${idx}`); if(!el) return;
  // 不用 el.scrollIntoView()：它会顺带滚动祖先容器（包括固定定位的外层 viewport），
  // 在部分移动端浏览器上表现为"整个界面往下挪一截"再弹回的抖动。
  // 改为只滚动 chatFlow 自身，且用当前 scrollTop 做相对计算，不影响外层布局。
  const f=document.getElementById("chatFlow"); if(!f) return;
  const targetTop = el.offsetTop - (f.clientHeight - el.clientHeight) / 2;
  f.scrollTo({top: Math.max(0, targetTop), behavior:"smooth"});
  el.classList.add("msg-flash"); setTimeout(()=>el.classList.remove("msg-flash"),900);
}

function bindChatScroll(){ document.getElementById("chatFlow").addEventListener("scroll",()=>{ const f=document.getElementById("chatFlow"); if(f.scrollHeight-f.scrollTop-f.clientHeight<60) unreadCount=0; updateScrollBot(); }); }
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
  chats.push(msgObj); document.querySelectorAll(".msg-in").forEach(el=>el.value=""); window.clearPendingQuote();
  if(cfg.soundOn) playSoundById(cfg.activeSoundId || "__builtin_thud1__");
  if(navigator.vibrate) navigator.vibrate(18);
  const _sb=document.querySelector('.input-style-1:not(.hidden) .in-btn.send,.input-style-2:not(.hidden) .i2-send,.input-style-3:not(.hidden) .i3-send:not(.alt),.input-style-4:not(.hidden) .i4-send:not(.alt)');
  if(_sb){_sb.classList.add('sent-flash');setTimeout(()=>_sb.classList.remove('sent-flash'),400);}
  /* ⭐ 原始代码：await saveAll(); appendNewChats(); getActiveInput()?.focus(); */
  await saveAll(); appendNewChats();
  /* ⭐ 发送后强制滚到底部，确保最新消息可见 */
  const cf=document.getElementById("chatFlow"); if(cf) cf.scrollTop=cf.scrollHeight;
  /* ⭐ 发送后让输入框失焦，收起键盘，使用户可以完整看到聊天内容 */
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

async function fireReply(){
  const now=new Date();
  if(cfg.stickerOn){
    const stickerPool=stickers.filter(s=>!s.shielded);
    if(stickerPool.length && Math.random()*100<STICKER_CHANCE){
      const stk=stickerPool[Math.floor(Math.random()*stickerPool.length)];
      let nameS=texts.opp_name||"温语", avatarS=imgs.oppAvatar||"", memberIdS="";
      if(cfg.groupMode&&groupMembers.length){ const ms=groupMembers[Math.floor(Math.random()*groupMembers.length)]; nameS=ms.name; avatarS=ms.avatar||window.DEFAULTS.PH_SVG; memberIdS=ms.id; }
      chats.push({sender:"opp",text:"[表情包]",sticker:true,stickerId:stk.id,time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime(),name:nameS,memberId:memberIdS});
      await saveAll();
      if(currentApp==="chatApp"){ const f=document.getElementById("chatFlow"); const near=f.scrollHeight-f.scrollTop-f.clientHeight<80; if(!near) unreadCount++; appendNewChats(); }
      else { if(cfg.popupOn) showPopup("[表情包]",nameS,avatarS); }
      notify("[表情包]",nameS,avatarS);
      return;
    }
  }
  const pool=cards.filter(c=>!c.shielded&&!shieldedCats.includes(c.cat));
  if(!pool.length) return;
  const lyrics=pool.filter(c=>c.cat==="歌词库");
  const norm=pool.filter(c=>c.cat!=="歌词库");
  let isLyric=false, text="", trans="", fragments=[];
  if(lyrics.length&&Math.random()<0.06){
    isLyric=true; const c=lyrics[Math.floor(Math.random()*lyrics.length)]; text=c.text; trans=c.translation||"";
  } else {
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
        chats.push({sender:"opp",text:arr[fi],translation:transArr[fi]||"",time:fmtTime(nt),timeWithSec:fmtTime(nt,true),date:fmtDate(nt),ts:nt.getTime(),lyric:false,quote:"",name:name2,memberId:memberId2,fragments:[arr[fi]]});
      }
      text=arr[arr.length-1]; trans=transArr[arr.length-1]||"";
    }
    else { text=arr[0]; if(transArr.length) trans=transArr[0]; }
  }
  let quote="";
  if(!isLyric&&cfg.quoteOn&&Math.random()<0.3){ const my=chats.filter(c=>c.sender==="self").slice(-10); if(my.length) quote=my[Math.floor(Math.random()*my.length)].text; }
  let name=texts.opp_name||"温语", avatar=imgs.oppAvatar||"", memberId="";
  if(cfg.groupMode&&groupMembers.length){ const m=groupMembers[Math.floor(Math.random()*groupMembers.length)]; name=m.name; avatar=m.avatar||window.DEFAULTS.PH_SVG; memberId=m.id; }
  chats.push({sender:"opp",text,translation:trans,time:fmtTime(now),timeWithSec:fmtTime(now,true),date:fmtDate(now),ts:now.getTime(),lyric:isLyric,quote,name,memberId,fragments});
  await saveAll();
  if(currentApp==="chatApp"){ const f=document.getElementById("chatFlow"); const near=f.scrollHeight-f.scrollTop-f.clientHeight<80; if(!near) unreadCount++; appendNewChats(); }
  else { if(cfg.popupOn) showPopup(text,name,avatar); }
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

window.clearAllChats = async()=>{ if(!confirm("确实要清空？")) return; chats=[]; openTrans=new Set(); await saveAll(); renderChats(); toast("已清空"); };
// ⭐ 存储上限（防无限膨胀）
const CHAT_MAX = 2000;
const MAX_STICKERS = 200;
const MAX_CARDS = 5000;
const MAX_SOUNDS = 50;
const MAX_CAROUSEL = 20;
function _addChatMsg(msg) {
  chats.push(msg);
  if (chats.length > CHAT_MAX + 500) {
    chats = chats.slice(-CHAT_MAX);
    saveAllDebounced();
  }
}
// ⭐ 存储用量估算
window.showStorageInfo = async () => {
  let html = '<div style="font-size:12px;line-height:1.8;padding:4px 0;">';
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
  chats = chats.slice(-CHAT_MAX); saveAll(); renderChats(); toast('已清理');
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
    d.addEventListener("click",()=>{ document.getElementById("searchPane").classList.remove("on"); jumpToMsg(x.c.text); });
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
window.addCardConfirm = async()=>{ const t=document.getElementById("m_t").value.trim(); const tr=document.getElementById("m_tr").value.trim(); const c=document.getElementById("m_c").value.trim()||"未命名"; if(!t) return; if(c==="歌词库"){const lines=t.split("\n").map(l=>l.trim()).filter(l=>l); if(cards.length+lines.length>MAX_CARDS){toast(`字卡已达上限 ${MAX_CARDS} 张`,"warn");return;} lines.forEach((line,i)=>cards.push({id:"c"+Date.now()+i,text:line,translation:tr,cat:c}));}else{if(cards.length>=MAX_CARDS){toast(`字卡已达上限 ${MAX_CARDS} 张`,"warn");return;}cards.push({id:"c"+Date.now(),text:t,translation:tr,cat:c});} await saveAll(); window.renderCards(); closeModal(); };
window.openBulkAdd = ()=>{ modal("批量导入",`<div class="fld-tip">【分组名】→ 内容，【翻译】分隔译文</div><textarea class="fld area" id="m_bulk" style="min-height:140px;"></textarea><button class="pill-btn" onclick="bulkAddDo()">导入</button>`); };
function parseTxtToCards(raw){ let cur="未命名",n=0,out=[]; raw.split("\n").forEach(line=>{ const t=line.trim(); if(!t) return; const mm=t.match(/^【(.+)】$/); if(mm){cur=mm[1].trim();return;} let txt=t,tr=""; if(t.includes("【翻译】")){const p=t.split("【翻译】");txt=p[0].trim();tr=p[1].trim();} out.push({id:"c"+Date.now()+(n++),text:txt,translation:tr,cat:cur}); }); return out; }
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
  if(tab==="stickers") window.renderStickers();
};
window.headerToggleBatch = ()=>{ if(cardsActiveTab==="stickers") window.toggleStickerBatchMode(); else window.toggleBatchMode(); };
window.headerAdd = ()=>{ if(cardsActiveTab==="stickers") window.openAddSticker(); else window.openAddCard(); };

// ─── 表情包库 ───
window.renderStickers = () => {
  const grid=document.getElementById("stickerGrid"); if(!grid) return;
  grid.innerHTML="";
  if(!stickers.length){ grid.innerHTML=`<div class="empty-tip" style="grid-column:1/-1;padding:40px;text-align:center;">表情包库此时空空如也</div>`; updateStickerBatch(); return; }
  stickers.forEach(s=>{
    const it=document.createElement("div");
    it.className="sticker-item"+(s.shielded?" shielded":"");
    const chkHtml=isStickerBatchSelecting?`<input type="checkbox" class="chk" ${stickerSelected.includes(s.id)?"checked":""} onchange="event.stopPropagation();stickerSelToggle('${s.id}',this.checked)">`:"";
    it.innerHTML=`
      <img src="${s.src}" loading="lazy">
      <span class="sti-op sti-shield" onclick="event.stopPropagation();toggleStickerShield('${s.id}')" title="${s.shielded?"恢复":"屏蔽"}">${s.shielded?STICKER_EYE_OFF_SVG:STICKER_EYE_SVG}</span>
      <span class="sti-op sti-del" onclick="event.stopPropagation();delSticker('${s.id}')" title="删除">${STICKER_X_SVG}</span>
      ${chkHtml}`;
    if(isStickerBatchSelecting){
      it.addEventListener("click", e=>{ if(e.target.closest(".chk")||e.target.closest(".sti-op")) return; const cb=it.querySelector(".chk"); if(!cb) return; cb.checked=!cb.checked; stickerSelToggle(s.id, cb.checked); });
    }
    grid.appendChild(it);
  });
  updateStickerBatch();
};
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
window.toggleStickerShield = async id => { const s=stickers.find(x=>x.id===id); if(!s) return; s.shielded=!s.shielded; await saveAll(); window.renderStickers(); };
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
  const existing=new Set(stickers.map(s=>s.src));
  let added=0, skipped=0;
  lines.forEach((url,i)=>{
    if(existing.has(url)){ skipped++; return; }
    stickers.push({id:"sk"+Date.now()+i, src:url, type:"url", shielded:false, addedAt:Date.now()});
    existing.add(url); added++;
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
function resolveStickerSrc(id){ const s=stickers.find(x=>x.id===id); return s?s.src:window.DEFAULTS.PH_SVG; }

// ─── 聊天内快捷发送表情包 ───
window.toggleStickerPicker = () => {
  const p=document.getElementById("stickerPicker"); if(!p) return;
  const opening=!p.classList.contains("on");
  p.classList.toggle("on");
  if(opening) renderStickerPickerGrid();
};
window.gotoStickerLibrary = () => {
  document.getElementById("stickerPicker")?.classList.remove("on");
  closeApp("chatApp");
  openApp("cardsApp"); switchCardsTab("stickers");
};
function renderStickerPickerGrid(){
  const g=document.getElementById("spGrid"); if(!g) return;
  if(!stickers.length){ g.innerHTML=`<div class="sp-empty">还没有表情包<span onclick="gotoStickerLibrary()">去添加</span></div>`; return; }
  g.innerHTML=stickers.map(s=>`<div class="sp-item" onclick="sendSticker('${s.id}')"><img src="${s.src}" loading="lazy"></div>`).join("");
}
window.sendSticker = async id => {
  const s=stickers.find(x=>x.id===id); if(!s) return;
  const now=new Date();
  chats.push({sender:"self", text:"[表情包]", sticker:true, stickerId:id, time:fmtTime(now), timeWithSec:fmtTime(now,true), date:fmtDate(now), ts:now.getTime()});
  window.clearPendingQuote();
  if(cfg.soundOn) playSoundById(cfg.activeSoundId || "__builtin_thud1__");
  if(navigator.vibrate) navigator.vibrate(18);
  await saveAll(); appendNewChats();
};

// ─── Members ───
window.renderMembers = ()=>{
  const d=document.getElementById("memberDeck"); if(!d) return; d.innerHTML="";
  groupMembers.forEach((m,i)=>{
    const c=document.createElement("div"); c.className="gm-card";
    c.innerHTML=`<img class="av ph" src="${m.avatar||window.DEFAULTS.PH_SVG}"><div class="nm"><input type="text" value="${escapeHtml(m.name)}"></div><span class="rm">剔除</span>`;
    c.querySelector("img").addEventListener("click",()=>{ memberPickIdx=i; imgPickKey="__memberAvatar__"; document.getElementById("fpImg").value=""; document.getElementById("fpImg").click(); });
    c.querySelector("input").addEventListener("change",async e=>{ groupMembers[i].name=e.target.value.trim()||"未命名"; await saveAll(); });
    c.querySelector(".rm").addEventListener("click",async()=>{ groupMembers.splice(i,1); await saveAll(); window.renderMembers(); });
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

  const selfMsgs  = chats.filter(c => c.sender === "self" && !c.lyric);
  const oppMsgs   = chats.filter(c => c.sender === "opp"  && !c.lyric);
  const lyricMsgs = chats.filter(c => c.lyric);
  const allReal   = chats.filter(c => !c.lyric);

  const selfChars = selfMsgs.reduce((s, m) => s + (m.text || "").length, 0);
  const oppChars  = oppMsgs.reduce((s, m)  => s + (m.text || "").length, 0);
  const avgLen    = allReal.length ? Math.round((selfChars + oppChars) / allReal.length) : 0;

  // ── 概览 ──
  const ovSec = document.createElement("div");
  ovSec.innerHTML = `<div class="stat-block-header"><span class="stat-block-title">概览</span></div>`;
  const ovGrid = document.createElement("div");
  ovGrid.className = "stat-overview-grid";

  const ovData = [
    { n: allReal.length,  l: "对话总计", sub: `歌词 ${lyricMsgs.length} 条`, full: true },
    { n: selfMsgs.length, l: "我",        sub: `落字 ${selfChars}` },
    { n: oppMsgs.length,  l: "彼",        sub: `落字 ${oppChars}` },
    { n: cards.length,    l: "字卡",       sub: `屏蔽 ${cards.filter(c=>c.shielded).length}` },
    { n: avgLen,          l: "均长",       sub: "字 / 条" }
  ];

  ovData.forEach((d, i) => {
    const card = document.createElement("div");
    card.className = "stat-ov-card" + (d.full ? " full" : "");
    card.innerHTML = `
      <div class="ov-n">${d.n}</div>
      <div class="ov-l">${d.l}</div>
      <div class="ov-sub">${d.sub}</div>
      <div class="ov-bar"></div>`;
    ovGrid.appendChild(card);
  });

  ovSec.appendChild(ovGrid);
  deck.appendChild(ovSec);

  // ── 昼夜分布 ──
  const hourSec = document.createElement("div");
  hourSec.innerHTML = `<div class="stat-block-header"><span class="stat-block-title">昼夜分布</span></div>`;

  const hours = new Array(24).fill(0);
  chats.forEach(c => { if (c.ts) hours[new Date(c.ts).getHours()]++; });
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
  const dateMap = {};
  chats.forEach(c => { if (c.date) dateMap[c.date] = (dateMap[c.date] || 0) + 1; });
  const dates = Object.keys(dateMap).sort();

  if (dates.length > 1) {
    const rateSec = document.createElement("div");
    rateSec.innerHTML = `
      <div class="stat-block-header">
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
        oppMsgs.forEach(m =>
          cfg.sentenceJoin && m.fragments?.length
            ? a.push(...m.fragments)
            : a.push(m.text)
        );
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
      tabPanels.querySelectorAll(".stat-tab-panel").forEach((p, pi) =>
        p.classList.toggle("active", pi === i)
      );
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
        item.innerHTML = `
          <div class="swi-top">
            <span class="swi-rank">${ri + 1}</span>
            <span class="swi-text">${escapeHtml(word)}</span>
            <span class="swi-cnt">${cnt}</span>
          </div>
          <div class="swi-track">
            <div class="swi-fill" style="width:${(cnt / maxVal * 100).toFixed(1)}%"></div>
          </div>`;
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

    const first   = allReal[0];
    const last    = allReal[allReal.length - 1];
    const longest = [...allReal].sort((a,b) => (b.text||"").length - (a.text||"").length)[0];

    const dGrid = document.createElement("div");
    dGrid.className = "stat-detail-grid";

    [
      { l: "首条",     v: first.date || "—" },
      { l: "最新",     v: last.date  || "—" },
      { l: "最长",     v: longest ? longest.text.slice(0,20) + (longest.text.length>20?"…":"") : "—" },
      { l: "最长字数", v: longest ? `${longest.text.length} 字` : "—" }
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
window.fullExport = ()=>{ const data={cfg,texts,cards,chats,members:groupMembers,shieldedCats,foldedCats,anniversaries,carousel,imgs,sounds}; const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"})); a.download=`SilentChamber_${Date.now()}.json`; a.click(); toast("备份完成"); closeModal(); };
function onPickJson(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=async ev=>{ try{ const d=JSON.parse(ev.target.result); if(d.cfg) cfg=Object.assign(cfg,d.cfg); if(d.texts) texts=d.texts; if(d.cards) cards=d.cards; if(d.chats) chats=d.chats; if(d.members) groupMembers=d.members; if(d.shieldedCats) shieldedCats=d.shieldedCats; if(d.foldedCats) foldedCats=d.foldedCats; if(d.anniversaries) anniversaries=d.anniversaries; if(d.carousel) carousel=d.carousel; if(d.imgs) imgs=d.imgs; if(d.sounds) sounds=d.sounds; await saveAll(); syncUI(); renderChats(); window.renderCards(); window.renderMembers(); renderCarousel(); renderMosaic();  toast("还原完毕"); }catch{ alert("数据损坏"); } };
  r.readAsText(f);
}
window.factoryReset = async()=>{ if(!confirm("确认销毁并重置？")) return; indexedDB.deleteDatabase(DB_NAME); setTimeout(()=>location.reload(),200); };

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
    renderChats(); unreadCount=0; showHomeTypingBar(false);
    if((replyTimer)&&!typingNode){
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

// ══ 问卷调查 (Survey) ══
// ════════════════════════════════════════════

window.switchStatsTab = function(tab) {
  document.querySelectorAll('#statsApp .stab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('#statsApp .stab-panel').forEach(p => p.classList.toggle('active', p.id === 'sstab-' + tab));
  if (tab === "survey") renderSurveys();
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
  const oppNm = texts.opp_name||"温语";
  const d = new Date(r.ts);
  let html = `<div class="fld-tip">${fmtDate(d)} ${fmtTime(d)}</div>`;
  r.answers.forEach(a=>{
    html += `<div class="qf-sum-item">
      <div class="qf-sum-q">${escapeHtml(a.q)}</div>
      <div class="qf-sum-row">我　　　${escapeHtml(a.self)}</div>
      <div class="qf-sum-row">${escapeHtml(oppNm)}　　　${escapeHtml(a.opp)}</div>`;
    if (a.oppComment !== undefined){
      html += `<div class="qf-sum-row">我的评论　${escapeHtml(a.selfComment || "（无）")}</div>
        <div class="qf-sum-row">${escapeHtml(oppNm)}的评论　${escapeHtml(a.oppComment)}</div>`;
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

/* 🌙 新增：支持 .txt 文本文件导入（原始仅支持 JSON） */
function onPickSurvey(e){
  const f = e.target.files[0]; if (!f) return;
  const isTxt = f.name.endsWith(".txt");
  const r = new FileReader();
  r.onload = async ev => {
    try {
      const text = ev.target.result;
      let importData;
      if (isTxt){
        importData = parseSurveyTxt(text);
      } else {
        importData = JSON.parse(text);
      }
      if (!importData.title || !Array.isArray(importData.questions)) { toast("文件格式不正确","warn"); return; }
      const qs = importData.questions.map(q=>({
        text: q.text || "",
        options: Array.isArray(q.options) ? q.options.filter(o=>o) : [],
        needComment: true  /* 导入问卷默认开启评论 */
      })).filter(q=>q.text && q.options.length>=2);
      if (!qs.length){ toast("没有有效题目","warn"); return; }
      surveys.push({
        id: "s"+Date.now(),
        title: importData.title,
        questions: qs
      });
      await saveAll();
      renderSurveys();
      toast("导入成功");
    } catch { toast("文件解析失败","warn"); }
    e.target.value = "";
  };
  r.readAsText(f);
}

/* 🌙 新增：解析 txt 格式问卷（第一行标题，--- 分隔题目，首行题目，后续行选项） */
function parseSurveyTxt(text){
  const lines = text.split(/\r?\n/);
  const title = (lines[0] || "").trim();
  const questions = [];
  let curQ = null;
  for (let i = 1; i < lines.length; i++){
    const line = lines[i].trim();
    if (!line) continue;
    if (line === "---"){
      if (curQ && curQ.text && curQ.options.length >= 2) questions.push({...curQ});
      curQ = { text: "", options: [], needComment: true };
    } else if (!curQ){
    } else if (!curQ.text){
      curQ.text = line;
    } else {
      curQ.options.push(line);
    }
  }
  if (curQ && curQ.text && curQ.options.length >= 2) questions.push(curQ);
  return { title, questions };
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
/* 🌙 关闭时额外清理 _oppTimer（对方独立选择计时器） */
window.closeSurveyFull = () => {
  clearTimeout(sfTimer); sfTimer = null;
  if (surveyFill && surveyFill._oppTimer){ clearTimeout(surveyFill._oppTimer); surveyFill._oppTimer = null; }
  surveyFill = null;
  document.getElementById("surveyFull").classList.remove("on");
};

/* 🌙 新增：对方独立自由选择，不等待用户先选答案 */
window.startSurveyFill = (id) => {
  const survey = surveys.find(s=>s.id===id);
  if (!survey || !survey.questions.length){ toast("问卷为空","warn"); return; }
  surveyFill = { surveyId:id, survey, qIndex:0, selfIdx:-1, oppIdx:-1, stage:"pick", reselectMsg:"", curAnswer:null, answers:[], _oppTimer:null };
  openSurveyFull();
  renderFillStep();
  _startOppSelection();
};

/* 🌙 用户选择时不再自动触发对方选择（对方由独立计时器控制） */
window.fillSelectSelf = (i) => {
  const sf = surveyFill; if (!sf || sf.stage!=="pick") return;
  sf.selfIdx = i;
  renderFillStep();
};

/* 🌙 新增：对方在5-20秒内独立随机选择 */
function _startOppSelection(){
  const sf = surveyFill; if (!sf) return;
  if (sf._oppTimer){ clearTimeout(sf._oppTimer); sf._oppTimer = null; }
  if (sf.oppIdx > -1) return;
  const delay = randInt(5, 20) * 1000;
  sf._oppTimer = setTimeout(() => {
    const sf2 = surveyFill;
    if (!sf2 || sf2.oppIdx > -1) return;
    const q = sf2.survey.questions[sf2.qIndex];
    sf2.oppIdx = randInt(0, q.options.length - 1);
    sf2._oppTimer = null;
    renderFillStep();
  }, delay);
}

/* 🌙 重选：5-20秒等待，50%接受/拒绝；拒绝后恢复原选项，不再重新等待 */
window.fillReselect = () => {
  const sf = surveyFill; if (!sf || sf.stage!=="pick" || sf.selfIdx===-1) return;
  /* 🌙 保存重选前的对方选项，拒绝时恢复 */
  const prevOppIdx = sf.oppIdx;
  sf.oppIdx = -1;
  if (sf._oppTimer){ clearTimeout(sf._oppTimer); sf._oppTimer = null; }
  sf.stage = "reselecting";
  sf.reselectMsg = "对方正在重新选择…";
  renderFillStep();
  sf._oppTimer = setTimeout(()=>{
    const sf2 = surveyFill; if (!sf2) return;
    if (Math.random() < 0.5){
      /* 🌙 拒绝重选 → 恢复原选项，回到 pick，不重新计时 */
      sf2.oppIdx = prevOppIdx;
      sf2.stage = "reselect-refused";
      sf2.reselectMsg = "对方拒绝了重选请求";
      sf2._oppTimer = null;
      renderFillStep();
      sf2._oppTimer = setTimeout(()=>{ sf2.stage="pick"; renderFillStep(); }, 1100);
    } else {
      const q = sf2.survey.questions[sf2.qIndex];
      sf2.oppIdx = randInt(0, q.options.length - 1);
      sf2.stage = "reselect-done";
      sf2.reselectMsg = "选择完毕";
      sf2._oppTimer = null;
      renderFillStep();
      sf2._oppTimer = setTimeout(()=>{ sf2.stage="pick"; renderFillStep(); }, 900);
    }
  }, randInt(5, 20) * 1000);
};

/* 🌙 双方都必须选择后，下一步才可用 */
window.fillNext = () => {
  const sf = surveyFill; if (!sf || sf.stage!=="pick" || sf.selfIdx===-1 || sf.oppIdx===-1) return;
  proceedAfterPick();
};

function proceedAfterPick(){
  const sf = surveyFill;
  const q = sf.survey.questions[sf.qIndex];
  sf.curAnswer = { q: q.text, self: q.options[sf.selfIdx], opp: q.options[sf.oppIdx] };
  console.log('📋 proceedAfterPick · needComment='+q.needComment+' · qIndex='+sf.qIndex+' · q='+q.text);
  if (q.needComment){
    sf.stage = "comment-wait";
    renderFillStep();
    clearTimeout(sfTimer);
    /* 🌙 评论等待5-30秒（原始3-10秒） */
    sfTimer = setTimeout(()=>{
      sf.curAnswer.oppComment = generateOppComment();
      sf.curAnswer.selfComment = "";
      sf.stage = "comment";
      renderFillStep();
    }, randInt(5,30)*1000);
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

/* 🌙 进入下一题时自动启动对方选择计时器 */
function nextQuestion(){
  const sf = surveyFill;
  sf.qIndex++;
  sf.selfIdx = -1; sf.oppIdx = -1; sf.stage = "pick"; sf.reselectMsg = ""; sf.curAnswer = null;
  if (sf._oppTimer){ clearTimeout(sf._oppTimer); sf._oppTimer = null; }
  if (sf.qIndex >= sf.survey.questions.length) renderFillSummary();
  else { renderFillStep(); _startOppSelection(); }
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

/* 🌙 重写渲染：对方独立计时选择，不依赖用户先选 */
function renderFillStep(){
  const sf = surveyFill;
  const q = sf.survey.questions[sf.qIndex];
  document.getElementById("sfFullTitle").innerText = sf.survey.title;
  document.getElementById("sfFullProgress").innerText = `${sf.qIndex+1} / ${sf.survey.questions.length}`;

  const oppNm = texts.opp_name||"温语";
  /* 🌙 题目旁显示是否为评论题 */
  const cmtHint = q.needComment ? ' <span class="qf-cmt-hint">含评论</span>' : '';
  let html = `<div class="qf-question">${escapeHtml(q.text)}${cmtHint}</div><div class="qf-options">`;
  q.options.forEach((opt,i)=>{
    /* 🌙 选择后双方昵称出现在对应选项后面，用户选项不高亮 */
    let badgeHtml = '';
    if (i===sf.selfIdx) badgeHtml += '<span class="qf-badge self">我</span>';
    if (i===sf.oppIdx) badgeHtml += `<span class="qf-badge opp">${escapeHtml(oppNm)}</span>`;
    html += `<div class="qf-opt" onclick="fillSelectSelf(${i})">${escapeHtml(opt)}${badgeHtml}</div>`;
  });
  html += `</div>`;

  if (sf.stage === "pick"){
    if (sf.oppIdx > -1){
      if (sf.selfIdx > -1){
        html += `<div class="qf-actions">
          <button class="pill-btn" onclick="fillReselect()">重选</button>
          <button class="pill-btn" onclick="fillNext()">下一步</button>
        </div>`;
      }
    } else {
      /* 🌙 等待对方选择中不显示高亮块，仅状态指示 */
      html += indicatorHtml("等待对方选择中…", true);
    }
  } else if (sf.stage === "reselecting"){
    html += indicatorHtml(sf.reselectMsg, true);
  } else if (sf.stage === "reselect-refused"){
    /* 🌙 拒绝后选项内联显示原选项，仅状态提示 */
    html += indicatorHtml(sf.reselectMsg, false);
  } else if (sf.stage === "reselect-done"){
    html += indicatorHtml(sf.reselectMsg, false);
  } else if (sf.stage === "comment-wait"){
    html += indicatorHtml("对方正在输入评论…", true);
  } else if (sf.stage === "comment"){
    html += `<div class="qf-comment"><div class="qf-comment-label">对方评论</div><div class="qf-comment-text">${escapeHtml(sf.curAnswer.oppComment)}</div></div>
      <textarea class="fld area" id="qfSelfComment" placeholder="写下你的评论…（可留空）"></textarea>
      <button class="pill-btn" onclick="fillNextFromComment()">下一步</button>`;
  }

  document.getElementById("sfFullBody").innerHTML = html;
}

function renderFillSummary(){
  const sf = surveyFill;
  const oppNm = texts.opp_name||"温语";
  document.getElementById("sfFullTitle").innerText = sf.survey.title;
  document.getElementById("sfFullProgress").innerText = "完成";
  let html = `<div class="qf-summary">`;
  sf.answers.forEach(a=>{
    html += `<div class="qf-sum-item">
      <div class="qf-sum-q">${escapeHtml(a.q)}</div>
      <div class="qf-sum-row">我　　　${escapeHtml(a.self)}</div>
      <div class="qf-sum-row">${escapeHtml(oppNm)}　　　${escapeHtml(a.opp)}</div>`;
    if (a.oppComment !== undefined){
      html += `<div class="qf-sum-row">我的评论　${escapeHtml(a.selfComment || "（无）")}</div>
        <div class="qf-sum-row">${escapeHtml(oppNm)}的评论　${escapeHtml(a.oppComment)}</div>`;
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
    const indexUrl = cfg.cloudMusicIndexUrl || "https://raw.githubusercontent.com/fcylz/cy-music/main/index.json";
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
async function _playNextRandom() {
  await _ensureShufflePool();
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
  // 切换当前播放
  if (musicAudio && !musicAudio.paused) {
    musicAudio.pause(); musicAudio = null;
    _shufflePool = [obj]; _shuffleIdx = -1;
    _playNextRandom();
  }
};

// ═══ 云端字卡库 ═══
const CLOUD_CARD_LF_KEY = "cy-card-index";

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
  const indexUrl = cfg.cloudCardIndexUrl || "https://raw.githubusercontent.com/fcylz/cy-chat/main/Word/word.json";

  if (!forceRefresh && cloudCardCache && cloudCardCache.length) return cloudCardCache;

  if (!forceRefresh && lf) {
    try {
      const cached = await lf.getItem(CLOUD_CARD_LF_KEY);
      if (cached && cached.cards && cached.cards.length) {
        cloudCardCache = cached.cards;
        updateCloudCardStatus(`已缓存 ${cached.cards.length} 组 · ${new Date(cached.at).toLocaleDateString()}`);
        return cached.cards;
      }
    } catch (e) {}
  }

  updateCloudCardStatus("正在连接…");
  try {
    const res = await fetch(indexUrl);
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
  await fetchCloudCards(true);
  toast("字卡库已刷新");
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
      <button class="pill-btn" onclick="closeModal()">关闭</button>
    </div>
  `;
  modal("云端字卡库", html);
  window._cclGroups = groups;
  window._cclSelected = new Set();
  renderCloudCardGroupList(groups);

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

  if (!groups.length) {
    el.innerHTML = '<div class="cml-empty">未找到匹配分组</div>';
    return;
  }

  el.innerHTML = groups.map((g, gi) => {
    const items = (g.items || []).filter(item => {
      const t = _cloudItemText(item);
      return t.length > 0;
    });
    if (!items.length) return "";
    const preview = items.slice(0, 3).map(item => {
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
        ${items.map((item, ii) => {
          const text = _cloudItemText(item);
          const translation = _cloudItemTranslation(item);
          const id = `${g.cat}::${ii}`;
          const checked = window._cclSelected?.has(id) || false;
          return `<label class="ccl-item-row">
            <input type="checkbox" class="ccl-item-cb" data-id="${escapeAttr(id)}" data-cat="${escapeAttr(g.cat)}" data-text="${escapeAttr(text)}" data-tr="${escapeAttr(translation)}" ${checked ? "checked" : ""} onchange="toggleCloudCardItem(this,'${escapeAttr(id)}')">
            <span class="ccl-item-text">${escapeHtml(text)}</span>
            ${translation ? `<span class="ccl-item-tr">${escapeHtml(translation)}</span>` : ""}
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
  window._cclSelected = new Set();
  all.forEach(g => {
    (g.items || []).forEach((line, ii) => {
      const id = `${g.cat}::${ii}`;
      window._cclSelected.add(id);
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

  const dupes = [];
  const fresh = [];
  selected.forEach(item => {
    if (cards.some(c => c.text === item.text && c.cat === item.cat)) {
      dupes.push(item);
    } else {
      fresh.push(item);
    }
  });

  let added = 0;
  fresh.forEach(item => {
    if (cards.length >= MAX_CARDS) return;
    cards.push({ id: "c" + Date.now() + (added++), text: item.text, translation: item.translation, cat: item.cat });
  });

  await saveAll();
  renderCards();
  closeModal();
  const msg = `已导入 ${added} 条`;
  if (dupes.length) toast(`${msg}（跳过 ${dupes.length} 条重复）`);
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
  const indexUrl = cfg.cloudStickerIndexUrl || "https://raw.githubusercontent.com/fcylz/cy-chat/main/Meme/meme.json";

  if (!forceRefresh && cloudStickerCache && cloudStickerCache.length) return cloudStickerCache;

  if (!forceRefresh && lf) {
    try {
      const cached = await lf.getItem(CLOUD_STICKER_LF_KEY);
      if (cached && cached.stickers && cached.stickers.length) {
        cloudStickerCache = cached.stickers;
        updateCloudStickerStatus(`已缓存 ${cached.stickers.length} 个 · ${new Date(cached.at).toLocaleDateString()}`);
        return cached.stickers;
      }
    } catch (e) {}
  }

  updateCloudStickerStatus("正在连接…");
  try {
    const res = await fetch(indexUrl);
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
  await fetchCloudStickers(true);
  toast("表情库已刷新");
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
      <button class="pill-btn" onclick="closeModal()">关闭</button>
    </div>
  `;
  modal("云端表情库", html);
  window._cskData = stks;
  window._cskSelected = new Set();
  renderCloudStickerGrid(stks);
  document.getElementById("cskGrid")?.addEventListener("change", updateCskImportBtn);
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
  const idx = cfg.cloudStickerIndexUrl || "https://raw.githubusercontent.com/fcylz/cy-chat/main/Meme/meme.json";
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

  el.innerHTML = stks.map((s, i) => {
    const src = _stickerSrc(s);
    const name = _stickerName(s);
    const cat = s.catLabel || "";
    const id = `csk_${i}`;
    const checked = window._cskSelected?.has(id) || false;
    return `<div class="csk-item">
      <div class="csk-img-wrap">
        <img src="${escapeHtml(src)}" loading="lazy" onerror="this.parentElement.classList.add('broken')">
        ${!src ? '<div class="csk-broken">无图</div>' : ""}
      </div>
      <div class="csk-name">${escapeHtml(name)}</div>
      ${cat ? `<div class="csk-cat">${escapeHtml(cat)}</div>` : ""}
      <label class="csk-check">
        <input type="checkbox" data-id="${escapeAttr(id)}" data-src="${escapeAttr(src)}" ${checked ? "checked" : ""} onchange="toggleCloudStickerItem(this,'${escapeAttr(id)}')">
        <span>${checked ? "已选" : "选择"}</span>
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
  window._cskSelected = new Set();
  (window._cskData || []).forEach((s, i) => window._cskSelected.add(`csk_${i}`));
  renderCloudStickerGrid(window._cskData || []);
};

window.importSelectedStickers = async () => {
  if (!window._cskSelected || window._cskSelected.size === 0) { toast("未选择表情"); return; }
  const data = window._cskData || [];
  const existing = new Set(stickers.map(s => s.src));
  let added = 0, skipped = 0;

  window._cskSelected.forEach(id => {
    const idx = parseInt(id.replace("csk_", ""));
    const s = data[idx];
    if (!s) return;
    const src = _stickerSrc(s);
    if (!src) return;
    if (existing.has(src)) { skipped++; return; }
    stickers.push({ id: "sk" + Date.now() + added, src, type: "url", shielded: false, addedAt: Date.now() });
    existing.add(src);
    added++;
  });

  await saveAll();
  renderStickers();
  closeModal();
  toast(skipped ? `已导入 ${added} 个（跳过 ${skipped} 个重复）` : `已导入 ${added} 个`);
};
