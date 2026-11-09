"use strict";

// Ordered by the traditional thirty-two divisions. Line numbers come from
// the cited CBETA editions, not from the sutra's T0235 line numbers.
const commentaryLines = [
  ["0020a06","0281a07"], ["0026a06","0295a12"], ["0032a04","0302a16"], ["0039a02","0319a08"],
  ["0043a10","0334a06"], ["0046a08","0341a14"], ["0053a11","0363a10"], ["0056a07","0367a16"],
  ["0060a04","0375a10"], ["0065a10","0380a08"], ["0071a12","0393a08"], ["0072a07","0395a16"],
  ["0074a11","0402a03"], ["0082a05","0435a01"], ["0094a13","0532a11"], ["0100a06","0551a12"],
  ["0103a13","0570a01"], ["0113a04","0600a02"], ["0117a12","0620a01"], ["0118a10","0623a10"],
  ["0120a06","0631a12"], ["0123a02","0641a08"], ["0123a06","0643a10"], ["0125a05","0650a07"],
  ["0126a01","0652a05"], ["0127a06","0656a09"], ["0127a12","0662a15"], ["0129a13","0676a11"],
  ["0131a02","0683a16"], ["0132a01","0688a07"], ["0134a08","0695a15"], ["0137a04","0710a08"],
];

const shengYenSections = {
  "003": "《金剛經》的內容",
  "004": "信受演說《金剛經》的功德",
  "005": "《金剛經》講記・結論",
  "010": "《金剛經》生活・第二講 自我提昇",
  "011": "《金剛經》生活・第三講 淨化社會",
};

// Each entry records the verified source section and line, then a local reading cue.
const shengYenPassages = {
  1: ["010","124.10","如是我聞"],
  2: ["011","155.2","如來善護念諸菩薩"],
  3: ["003","50.3","若菩薩有我相"],
  4: ["003","50.12","不住聲香味觸法布施"],
  5: ["003","33.1","如來所說身相"],
  6: ["003","47.10","不應取非法"],
  7: ["003","53.8","無有定法"],
  8: ["004","65.10","若人滿三千大千世界七寶"],
  9: ["011","154.10","須陀洹","四果名相"],
  10: ["003","23.11","應無所住而生其心"],
  11: ["004","66.4","以七寶滿爾所恆河沙數"],
  13: ["003","35.10","是名三十二相"],
  14: ["003","55.3","應離一切相"],
  15: ["004","65.5","初日分以恆河沙等身布施"],
  16: ["004","67.9","先世罪業"],
  17: ["003","26.8","云何應住"],
  18: ["003","58.8","過去心不可得"],
  20: ["003","41.1","如來說具足色身"],
  21: ["003","42.1","無法可說"],
  22: ["003","60.2","乃至無有少法可得"],
  23: ["003","60.9","是法平等無有高下"],
  24: ["004","68.3","諸須彌山王"],
  25: ["003","43.11","如來說有我者"],
  26: ["003","61.9","若以色見我"],
  27: ["003","62.5","於法不說斷滅相"],
  28: ["004","69.5","知一切法無我"],
  29: ["003","44.8","無所從來"],
  30: ["003","45.5","若世界實有者"],
  31: ["003","62.10","不生法相"],
  32: ["005","70.2","云何為人演說"],
};

function createChapterToolHint(rows, linkText) {
  const help = document.createElement("div");
  help.className = "chapter-tool-hint";
  const list = document.createElement("dl");
  list.className = "tool-steps";
  for (const [label, content] of rows) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = content;
    row.append(term,description);
    list.append(row);
  }
  const link = document.createElement("a");
  link.href = "./guide.html#guide-reader";
  link.textContent = linkText;
  help.append(list,link);
  return help;
}

function createReadingGuides(number) {
  const panel = document.createElement("details");
  panel.className = "chapter-study reading-guides";
  const heading = document.createElement("summary");
  heading.textContent = "研讀經文";
  panel.append(heading);

  const [yinshun, jiang] = commentaryLines[number - 1];
  const volume = Math.ceil(number / 8) + 1;
  const entries = [
    ["印順長老", "《般若經講記》卷二 · Y01 " + yinshun,
      "https://tripitaka2.zensoul.org/Y/Y0001/2#lb-" + yinshun, "本分起首經文及解說"],
  ];

  const sheng = shengYenPassages[number];
  if (sheng) {
    const [section,line,phrase,scope] = sheng;
    const [page,row] = line.split(".");
    const source = new URL("https://ddc.shengyen.org/");
    source.search = new URLSearchParams({doc:"07-02-" + section,page});
    const cue = "本站對照經句「" + phrase + "」" + (scope ? "（" + scope + "）" : "");
    entries.push(["聖嚴法師","《福慧自在》 · " + shengYenSections[section] + " · 第 " + page + " 頁第 " + row + " 行",
      source.href,cue]);
  } else {
    entries.push(["聖嚴法師",null,null,"目前查核的《福慧自在》未找到可直接對應本分的解說。"]);
  }

  entries.push(["江味農居士", "《金剛般若波羅蜜經講義》卷 " + volume + " · B07 " + jiang,
      "https://tripitaka2.zensoul.org/B/B0023/" + volume + "#lb-" + jiang, "本分起首經文及解說"]);

  panel.addEventListener("toggle",function populate() {
    if (!panel.open) return;
    panel.removeEventListener("toggle",populate);
    panel.append(createChapterToolHint([
      ["有什麼", "印順長老、聖嚴法師與江味農居士的研讀來源。"],
      ["怎麼看", "讀對照提示，再按原文連結。看完關閉原書分頁即可回來。"],
      ["如何下手", "先點下方一位作者的姓名，展開本分資料。"],
      ["工具助益", "同一分可對照不同解說，也能回原書查前後文。"],
    ],"查看研讀與返回說明"));
    for (const [teacher, label, href, guide] of entries) {
      const choice = document.createElement("details");
      choice.className = "reading-guide-choice";
      choice.name = "reading-guide-" + number;
      const summary = document.createElement("summary");
      summary.textContent = teacher;
      const text = document.createElement("p");
      text.textContent = guide;
      choice.append(summary, text);
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = label + " ↗";
        link.setAttribute("aria-label",label + "（新分頁）");
        const sourceLine = document.createElement("p");
        sourceLine.append(link);
        choice.append(sourceLine);
      }
      panel.append(choice);
    }
  });
  return panel;
}
