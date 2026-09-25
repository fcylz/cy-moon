#!/usr/bin/env node
/* 记忆分叉比对器 —— 每次接手前先跑这个。
 *
 * 背景：总经理 2026-09-25 拍板选 **B：两个记忆目录并存**。
 *   `.workbuddy/memory/` 是主线（我维护，内容最全）；
 *   `.codebuddy/memory/` 是另一个会话（CodeBuddy 工具名）在写，它不知道这个约定。
 *   两边都会进 git，所以**可能各自长出对方没有的新内容** → 接手前比对。
 *
 * 用法：
 *   node .workbuddy/memory/_compare.js
 *
 * ⚠ 为什么不用逐行比对：
 *   两边对**同一件事**的措辞往往不同（`.codebuddy` 那份是重写前的旧版全文），
 *   逐行比对会把它们全判成"差异"，刷屏且全是假警报。
 *   所以改比**技术关键词** —— 反引号里的标识符 / 函数名 / 文件名 / 英文词。
 *   只有当 `.codebuddy` 提到了**主线完全没提过**的关键词时，才可能有真遗漏。
 *
 * 处置原则：
 *   ① `.workbuddy/` 是主线，**不删、不覆盖**；
 *   ② `.codebuddy/` 的新增内容按**节**并入 `.workbuddy/`（保留原文，别改写）；
 *   ③ 并入后两边内容一致，再提交 —— 无论哪个工具接手，信息都是全的。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const A_DIR = path.join(ROOT, ".workbuddy", "memory");   // 主线
const B_DIR = path.join(ROOT, ".codebuddy", "memory");   // 另一会话

/* 提取"技术关键词"：反引号内容 + 英文/下划线标识符。
   中文散文不参与比对 —— 措辞差异不是信息缺失。 */
const NOISE = new Set([
  "the","and","for","with","this","that","from","http","https","www","com","org",
  "true","false","null","undefined","default","const","let","var","function","return",
  "JSON","HTML","CSS","API","URL","ID","OK","npm","node","git","github.com",
]);
function keywords(text){
  const out = new Set();
  for(const m of text.matchAll(/`([^`\n]{2,80})`/g)){
    const s = m[1].trim();
    if(s) out.add(s);
  }
  for(const m of text.matchAll(/[A-Za-z_][A-Za-z0-9_.\-]{3,}/g)){
    const w = m[0];
    if(!NOISE.has(w)) out.add(w);
  }
  return out;
}

/* ⚠ 归一化后再比 —— 否则这些**同义不同写法**会全被当成差异（假警报）：
     `CLOUD_INDEX_TTL=6h`      vs `CLOUD_INDEX_TTL = 6h`      （空格）
     `bi` / `tri`              vs `bi/tri`                    （前后缀）
     `syncRepo/…/syncMedia`    vs `syncRepo/…/syncMedia/syncChatImgs` （主线更长）
   所以：去掉所有空白 + 转小写，然后做**双向子串包含**判断。 */
const norm = s => s.replace(/\s+/g, "").toLowerCase();
/* b 的某个关键词是否已被 a 覆盖（归一化后相等，或任一方包含另一方） */
function covered(k, aNorm){
  const nk = norm(k);
  if(aNorm.has(nk)) return true;
  for(const an of aNorm){
    if(an.includes(nk) || nk.includes(an)) return true;
  }
  return false;
}

function readSafe(p){ try { return fs.readFileSync(p, "utf8"); } catch(e) { return null; } }

/* 节标题（## / ### 开头的行）—— 结构比对，粗粒度兜底 */
function sections(text){
  return text.split("\n").map(s => s.trim()).filter(s => /^#{2,4}\s+\S/.test(s));
}

const results = [];

function compare(label, aPath, bPath){
  const a = readSafe(aPath), b = readSafe(bPath);
  const line = { label, status: "ok", onlyB: [], secOnlyB: [] };

  if(a === null && b === null) return line;
  if(a === null){ line.status = "missing-a"; results.push(line); return line; }
  if(b === null) return line;   // 只有主线有 = 正常

  const ka = keywords(a), kb = keywords(b);
  const aNorm = new Set([...ka].map(norm));
  line.onlyB = [...kb].filter(k => !covered(k, aNorm)).sort();
  line.secOnlyB = sections(b).filter(s => !a.includes(s));
  /* ⚠ 判据只看**关键词**。节标题的措辞差异（"网络环境（实测）" vs
     "网络环境（重要，实测）"）纯属噪声，只作为辅助信息显示，不参与判定。 */
  if(line.onlyB.length) line.status = "diff";

  const flag = line.status === "diff" ? "⚠" : "✅";
  console.log(`${flag} ${label.padEnd(22)} 主线 ${a.split("\n").length} 行 / 那边 ${b.split("\n").length} 行 · 那边独有关键词 ${line.onlyB.length} 个`);
  results.push(line);
  return line;
}

console.log("记忆分叉比对（约定 B：两目录并存，接手前先比对）\n");

compare("MEMORY.md",
  path.join(A_DIR, "MEMORY.md"), path.join(B_DIR, "MEMORY.md"));

const dateFiles = (dir) => {
  try { return fs.readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort(); }
  catch(e){ return []; }
};
const da = dateFiles(A_DIR), db = dateFiles(B_DIR);
for(const f of db) compare(f, path.join(A_DIR, f), path.join(B_DIR, f));

const onlyBd = db.filter(f => !da.includes(f));
const onlyAd = da.filter(f => !db.includes(f));
if(onlyBd.length) console.log(`⚠ 只有 .codebuddy 有的日记：${onlyBd.join(", ")}`);
if(onlyAd.length) console.log(`· 只有 .workbuddy 有的日记（正常）：${onlyAd.join(", ")}`);

/* ── 明细 ── */
const bad = results.filter(r => r.status === "diff" || r.status === "missing-a");
if(bad.length){
  console.log("\n" + "─".repeat(60));
  console.log("需要人工看一眼的内容");
  console.log("─".repeat(60));
  for(const r of bad){
    console.log(`\n【${r.label}】`);
    if(r.status === "missing-a"){ console.log("  ⚠ 主线完全没有这个文件 → 整份并入"); continue; }
    if(r.secOnlyB.length){
      console.log("  那边独有的节标题：");
      r.secOnlyB.forEach(s => console.log("    · " + s));
    }
    if(r.onlyB.length){
      console.log(`  那边独有的关键词（${r.onlyB.length} 个，前 40 个）：`);
      r.onlyB.slice(0, 40).forEach(k => console.log("    · " + k.slice(0, 110)));
    }
    console.log("  → 判断：若确属新信息，按节并入 .workbuddy/；若只是措辞/旧版残留，忽略。");
  }
}

console.log("\n" + "═".repeat(60));
console.log(bad.length
  ? `⚠ ${bad.length} 处需确认 → 见上方明细`
  : "✅ 无分叉：主线的关键词已覆盖另一边，可以直接开工");
console.log("═".repeat(60));
