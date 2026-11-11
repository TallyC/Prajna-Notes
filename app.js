"use strict";

const topics = [
  { id:"origin", title:"緣起與空", notes:["N02","N04","N05"], card:1,
    summary:"前言：從眾生因緣和合，理解整體、相互交關與慈悲。\n緣起帶入兩條觀察脈絡：從無常看苦，連到四聖諦。從無常看無我，連到因緣有、自性空。兩條路徑是現場導讀，相關判教語境見查核。", sources:["S05","S07","S08"] },
  { id:"non-abiding", title:"前十六分 · 不執與無住生心", notes:["N07","N08"], card:3,
    summary:"現場引導：心累嗎？從人、事、自己，寫下此刻最卡住的一件事，覺察心住在哪裡，再讀「應無所住而生其心」。\n心有所住＝煩惱\n心無所住＝［留白，待現場補充］",
    reading:"經文對讀：第四分講無住布施，第十分提出「應無所住而生其心」，第十四分連到利益眾生。聖嚴法師《福慧自在》從生活中掛念人、事與得失來說明「住」，並以慈悲與智慧說明生心。", sources:["S09","S24","S16"] },
  { id:"giving", title:"布施、修福與伏心", notes:[],
    summary:"從第四分的無住布施，回看修福與調伏其心。", sources:["S09"] },
  { id:"practice", title:"後十六分 · 妙用與提起", notes:["N06","N12"], card:1,
    summary:"在空性中如何生起妙用？不執（放下）→ 妙用（提起）→ 回應緣起。\n前十六分偏重不執、後十六分偏重妙用，是本次講座的導讀方式。", sources:["S03","S04","S09"] },
  { id:"bodhi", title:"《金剛經》的組織脈絡 · 二道五菩提", notes:["N11","N13","N14","N15"], card:5,
    summary:"印順長老《般若經講記》用二道五菩提解說《金剛經》。明心菩提交接般若道與方便道。以下依原圖列出二道和三個交疊範圍。", sources:["S01","S02","S23"] },
  { id:"tools", title:"修行工具 · 經典與方法", notes:["N03","N06","N10","N16","N17"], card:2,
    summary:"經典裡有方法、步驟與工具。依當下的身心狀況和階段使用，時時調整。\n兩天四場的課程安排：看懂地圖 → 練習捨 → 見到真實 → 帶回家。", sources:["S07","S10","S21"] },
  { id:"illusion", title:"觀幻、解脫與當下", notes:[],
    summary:"從第三十二分「如夢幻泡影」與最後一堂原記，回看苦、幻與當下的用功。", sources:["S09"] },
  { id:"title", title:"經題、三種般若與受持", notes:["N09"], card:4,
    summary:"從經題讀金剛、般若、波羅蜜。現場記下文字般若 → 觀照般若 → 實相般若，以及對持、讀、誦的理解。原記與補充說明可分開對讀。", sources:["S01","S19","S20","S24"] },
];

const verseAsNoted = `真觀清淨觀，廣大智慧觀，悲觀及慈觀，常願常瞻仰。
無垢清淨光，慧日破諸暗，能伏災風火，普明照世間。
悲體戒雷震，慈意妙大雲，澎濞甘露法，滅除煩惱焰。
諍訟經官處，怖畏軍陣中，念彼觀音力，眾怨悉退散。
妙音觀世音，梵音海潮音，勝彼世間音，是故須常念。
念念勿生疑，觀世音淨聖，於苦惱死厄，能為作依怙。
具足一切功德，慈眼視眾生，福聚海無量，是故應頂禮。`;

const view = document.querySelector("[data-reading-page]").dataset.readingPage;
const searchIndex = document.createElement("div");
const byId = id => document.getElementById(id) ?? searchIndex.querySelector("#" + CSS.escape(id));
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function link(label, url) {
  const a = element("a", label);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}
function fold(label, ...children) {
  const d = element("details", null, "inner");
  d.append(element("summary", label), ...children);
  return d;
}
function sourceList(ids, sources) {
  const list = element("ul", null, "refs");
  for (const id of ids) {
    const source = sources.get(id);
    if (!source) continue;
    const item = element("li");
    item.append(link(source.title, source.url), document.createTextNode(" · " + source.locator));
    list.append(item);
  }
  return list;
}

function renderAfternoon(segments, relatedNotes, notes, sources) {
  function renderEntry(segment) {
    const note = notes.get(segment.note);
    const article = element("article",null,"afternoon-segment");
    article.id = segment.id ?? ("afternoon-note-" + note.id);
    article.append(element("h4",segment.title));
    if (segment.excerpt) {
      article.append(
        element("p",segment.fullText ? "經文" : "經文節錄","eyebrow"),
        element("blockquote",segment.excerpt,"reading callout"));
      article.lastElementChild.dataset.sutra = "";
      if (segment.explanation) {
        article.append(element("h5",segment.explanationTitle),
          element("p",segment.explanation,"reading"));
      }
      if (note) article.append(fold("現場原記",element("p",note.verbatim,"reading")));
    } else {
      article.append(element("p",note.verbatim,"reading"));
    }
    if (segment.comparison) {
      article.append(element("h5","與下午筆記對讀"),
        element("p",segment.comparison,"reading"));
    }
    if (segment.sourceIds) {
      const references = sourceList(segment.sourceIds,sources);
      article.append(fold("對讀與查核",element("p",segment.reading,"reading"),references));
    }
    if (segment.target) {
      const jump = element("a",segment.targetLabel);
      jump.href = segment.target === "journal" ? "./journal.html#journal" : "#" + segment.target;
      const target = byId(segment.target);
      if (target instanceof HTMLDetailsElement) {
        jump.addEventListener("click",() => { target.open = true; });
      }
      article.append(jump);
    }
    return article;
  }
  byId("afternoon-reading").append(...segments.map(renderEntry));
  byId("afternoon-related").append(...relatedNotes.map(renderEntry));
}

function showImage({title,path}) {
  byId("card-title").textContent = title;
  const download = byId("image-download");
  download.href = path;
  download.download = title + ".png";
  const image = byId("card-image");
  image.src = path;
  image.alt = title;
  setCardZoom(false);
  if (!cardDialog.open) {
    history.pushState({...history.state,prajnaCardOpen:true},"");
    cardDialog.showModal();
  }
  cardScroll.scrollTop = 0;
  cardScroll.scrollLeft = 0;
}

const cardDialog = byId("card-view");
const cardScroll = byId("card-scroll");
const cardZoom = byId("card-zoom");
let cardClosing = false;
if (history.state?.prajnaCardOpen) {
  const {prajnaCardOpen,...pageState} = history.state;
  history.replaceState(pageState,"");
}
function setCardZoom(zoomed) {
  cardScroll.classList.toggle("zoomed",zoomed);
  cardZoom.textContent = zoomed ? "返回圖卡" : "放大原圖";
  cardZoom.setAttribute("aria-pressed",String(zoomed));
}
cardZoom?.addEventListener("click",() => setCardZoom(!cardScroll.classList.contains("zoomed")));
function closeCard() {
  if (cardClosing) return;
  if (!history.state?.prajnaCardOpen) {
    cardDialog.close();
    return;
  }
  cardClosing = true;
  history.back();
}
byId("card-close")?.addEventListener("click",closeCard);
cardDialog?.addEventListener("cancel",event => {
  event.preventDefault();
  closeCard();
});
cardDialog?.addEventListener("click",event => {
  if (event.target === cardDialog) closeCard();
});
window.addEventListener("popstate",event => {
  cardClosing = false;
  if (cardDialog?.open && !event.state?.prajnaCardOpen) cardDialog.close();
});

function renderGallery(id, items) {
  const gallery = byId(id);
  if (!gallery) return;
  const wallpaper = id === "wallpaper-gallery";
  for (const [index,item] of items.entries()) {
    const artwork = element("article",null,"artwork-entry");
    artwork.id = id + "-" + (index + 1);
    artwork.dataset.artworkPath = item.path;
    const button = element("button",null,"card-button");
    const image = element("img");
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    if (gallery.isConnected) image.src = item.preview || item.path;
    const title = element("span",item.title,"artwork-title");
    button.append(image,title);
    button.addEventListener("click",() => showImage(item));
    const transcript = artworkText(item,"artwork-transcript reading");
    if (wallpaper) {
      artwork.append(button,transcript);
    } else {
      const description = fold("圖卡文字",transcript);
      if (item.scriptureLink) description.append(scriptureCardLink(item.scriptureLink));
      artwork.append(button,description);
    }
    gallery.append(artwork);
  }
}

function artworkText({transcript,highlights},className) {
  const paragraph = element("p",null,className);
  if (!highlights?.length) {
    paragraph.textContent = transcript;
    return paragraph;
  }
  const pattern = new RegExp(highlights.join("|"),"g");
  let offset = 0;
  for (const {0:phrase,index} of transcript.matchAll(pattern)) {
    paragraph.append(transcript.slice(offset,index),element("mark",phrase,"quote-emphasis"));
    offset = index + phrase.length;
  }
  paragraph.append(transcript.slice(offset));
  return paragraph;
}

function scriptureCardLink(href) {
  const source = element("a","讀經文上下文");
  source.href = /^#/.test(href) ? "./lecture.html" + href : href;
  return source;
}

function renderRelatedCards(cards) {
  for (const card of cards) {
    for (const [index, id] of (card.relatedSections ?? []).entries()) {
      const section = byId(id);
      if (!section) continue;
      const container = section.querySelector(":scope > .topic-content") ?? section;
      const transcript = artworkText(card,"reading");
      const openImage = element("button","查看圖卡","quiet");
      openImage.type = "button";
      openImage.addEventListener("click",() => showImage(card));
      const details = fold("圖卡文字 · " + card.title,transcript,openImage);
      if (card.scriptureLink) details.append(document.createTextNode("　"),scriptureCardLink(card.scriptureLink));
      details.dataset.relatedCard = card.path;
      if (index === 0) details.dataset.primaryCard = card.title;
      container.append(details);
    }
  }
}

let notebookData;
function loadData() {
  const revision = document.querySelector('meta[name="prajna-release"]').content;
  return notebookData ??= fetch("./data.json?v=" + revision).then(response => {
    if (!response.ok) throw new Error("Notebook data could not be loaded.");
    return response.json();
  }).catch(error => { notebookData = undefined; throw error; });
}

function renderNotebook(data) {
  const originalCards = data.cards.map((card,index) => ({
    title:card.title,transcript:card.transcript,relatedSections:card.relatedSections,path:"./cards/" + (index+1) + ".png?v=20261107",
  }));
  const sources = new Map(data.reference_sources.map(source => [source.id, source]));
  sources.set("S24", {
    title:"聖嚴法師《福慧自在：《金剛經》講記與《金剛經》生活》",
    locator:"法鼓文化書摘 · 應無所住而生其心",
    url:"https://www.ddc.com.tw/ec/event/2020/1/freedom/index.html",
  });
  const originalNotes = new Map(data.notes.map(note => [note.id,note]));
  if (byId("tree")) for (const [index, topic] of topics.entries()) {
    const section = element("details", null, "topic");
    section.id = topic.id;
    const heading = element("summary");
    heading.append(element("span", String(index+1).padStart(2,"0"), "ordinal"), element("span",topic.title));
    const body = element("div", null, "topic-content");
    body.append(element("p",topic.summary,"reading"));
    if (topic.reading) body.append(element("p",topic.reading,"reading callout"));
    const threads = element("ul",null,"refs");
    const sessions = ["11/7 上午｜第一場","11/7 下午｜第二場","11/8 上午｜第三場","11/8 下午｜第四場"];
    for (const [session, text, target] of data.session_threads?.[topic.id] ?? []) {
      const item = element("li");
      const jump = element("a",text);
      jump.href = "#" + target;
      item.append(element("strong",sessions[session - 1]),document.createTextNode("　"),jump);
      threads.append(item);
    }
    if (threads.childElementCount) body.append(fold("四場筆記對讀",threads));
    if (topic.id === "bodhi") {
      const {paths,overlapping_scopes,junction} = data.two_paths_five_bodhis;
      body.append(
        element("p","下午場重點｜懂得發心、伏心的重要。","callout"),
        element("h3","五菩提的五個階段"),
        element("p","凡夫位：發心菩提 → 伏心菩提。\n從明心菩提進入聖位，再經出到菩提，最後是究竟菩提（成佛）。","reading"),
        element("h3","般若道的修學重點"),
        element("p","現場補記以「求自度」說明般若道的著重點：學習空、無我的智慧，看破世間的虛幻，通達性空、離相。","reading")
      );
      for (const [label, group] of Object.entries(paths)) {
        body.append(element("h3",label),element("p",group.join(" → "), "reading"));
      }
      body.append(element("h3","發心、修行、證果的交疊範圍"));
      for (const [label, group] of Object.entries(overlapping_scopes)) {
        body.append(element("p",label + "｜" + group.join("、"), "reading"));
      }
      body.append(element("p",junction,"callout"));
      const stages = [
        ["發心菩提","立下求無上菩提的志願，開始走菩薩道。"],
        ["伏心菩提","在修行中調伏煩惱，學習行諸波羅蜜。"],
        ["明心菩提","以般若觀照諸法而契入實相，是般若道與方便道的交接。"],
        ["出到菩提","以般若發起方便，繼續修菩薩行，利益眾生。"],
        ["究竟菩提","菩薩道圓滿，成就佛果。"],
      ];
      const stageList = element("ol",null,"refs");
      for (const [name, explanation] of stages) {
        const stage = element("li");
        stage.append(element("strong",name),document.createTextNode(" · " + explanation));
        stageList.append(stage);
      }
      body.append(fold("對讀補充 · 五個階段各修什麼",
        element("p","依印順長老《般若經講記》〈示宗要〉整理。","intro"),
        stageList,sourceList(["S01"],sources)));
      body.append(fold("經文對讀 · 善財童子發心後求學",
        element("p","善財童子參訪善知識的故事見《華嚴經》〈入法界品〉，通常稱「善財童子五十三參」。他已發無上菩提心，接著請問如何學菩薩行、修菩薩道。","reading"),
        element("p","原記寫作「法華經」「52參」。參訪次數與菩薩階位是兩種不同的計數，現場所說的對應方式待核。","intro"),
        sourceList(["S25"],sources)));
    }
    if (topic.id === "tools") {
      body.append(fold("修行的二力與四弘誓願 · 現場補記",
        element("h3","修行需要二力"),
        element("p","自力：現場以《心經》、《金剛經》為例。\n他力：佛力。","reading"),
        element("h3","四弘誓願 · 現場記下的三願"),
        element("p","因為「眾生無邊誓願度」，所以要先認識自己的煩惱，發起「煩惱無邊誓願斷」。為了斷煩惱，再發起「法門無量誓願學」。","reading")));
      const pumen = element("p","讀〈普門品〉，學習觀世音菩薩聞聲救苦。");
      const verse = fold("偈頌原記 · 待逐字核對",element("p",verseAsNoted,"reading"),sourceList(["S18"],sources));
      const classes = data.resources[0];
      const lessons = element("ul",null,"refs");
      for (const v of classes.videos) {
        const li = element("li");
        li.append(link("第 " + v.lesson + " 堂 · " + v.date,v.url));
        lessons.append(li);
      }
      body.append(element("h3","《普門品》"),pumen,verse,
        element("h3","《阿彌陀經》與念佛"),
        element("p","現場以信、願、行說明念佛。經文對讀可看執持名號、一心不亂、善根福德因緣。"),sourceList(["S17"],sources),
        element("h3","《教觀綱宗》"),element("p","果慨法師推薦。可對讀聖嚴法師《天台心鑰》所收附錄。"),
        fold("齋明寺 · 果慨法師六堂導讀",link("課程總頁",classes.official_page),lessons),
        fold("十乘觀法 · 目標、起修、成就",
          element("p","現場提要：目標發心 → 次第起修 → 修證成就。","reading"),
          element("p","《教觀綱宗》確實依四教分列十乘觀，圓教十乘觀的第二項是「真正發菩提心」。上列三句保留為現場提要。","reading"),
          sourceList(["S26"],sources)));
    }
    const originals = topic.notes.map(id => {
      const note = originalNotes.get(id);
      return fold(note.title,element("p",note.verbatim,"reading"));
    });
    if (originals.length) body.append(fold("現場原記", ...originals));
    body.append(fold("經文與書籍對讀",sourceList(topic.sources,sources)));
    const actions = element("div", null, "actions");
    const card = originalCards[topic.card-1];
    const cardButton = element("button","看圖卡","quiet");
    cardButton.addEventListener("click",() => showImage(card));
    const write = element("button","記到這個主題","quiet");
    write.addEventListener("click",() => startRelatedNote(topic.id));
    if (card) actions.append(cardButton);
    actions.append(write);
    const personal = element("section",null,"inner topic-notes");
    personal.id = "personal-" + topic.id;
    personal.setAttribute("aria-label","這個主題的持行記錄");
    body.append(actions,personal);
    section.append(heading,body);
    byId("tree").append(section);
  }
  if (byId("afternoon-reading")) renderAfternoon(data.afternoon_segments,data.afternoon_related_notes,originalNotes,sources);
  if (byId("checks")) for (const check of data.verification) {
    byId("checks").append(fold(check.topic + " · " + check.status,
      element("p",check.aligned_statement,"reading"),element("p",check.limit,"reading"),sourceList(check.source_ids,sources)));
  }
  const {cards:extraCards,scriptureCards = [],wallpapers} = data.gallery_assets;
  const imageRevision = document.querySelector('meta[name="prajna-release"]').content;
  const chapter30Card = scriptureCards.find(card => card.title === "第 30 分 · 一合理相");
  if (chapter30Card) {
    chapter30Card.path = "./artwork/cards/verse-30-1-full.webp?v=" + imageRevision;
    chapter30Card.preview = "./artwork/cards/verse-30-1.webp?v=" + imageRevision;
  }
  const cards = [...extraCards,...originalCards];
  const relatedCards = new Map([...cards,...scriptureCards].map(card => [card.path,card]));
  renderRelatedCards(relatedCards.values());
  renderGallery("gallery",cards);
  renderGallery("scripture-gallery",scriptureCards);
  renderGallery("wallpaper-gallery",wallpapers);
}

async function loadNotebook() {
  if (view === "journal") return;
  const data = await loadData();
  renderNotebook(data);
  if (byId("load-message")) byId("load-message").hidden = true;
  renderEntries();
  openLinkedNote(true);
}

loadNotebook().catch(() => {
  if (byId("load-message")) byId("load-message").textContent = "編者雜記暫時無法載入。";
}).finally(() => document.dispatchEvent(new Event("prajna:content-ready")));

const storageKey = "prajna-notes.journal.v1";
const topicSelect = byId("note-topic");
const textField = byId("note-text");
const noteCategories = new Map([
  ["reading","經文摘記"],["reflection","理解與反思"],["questions","疑問待查"],
  ["practice-journal","修行實踐"],["general","隨手記"],
]);
const lectureTopics = [["nov8","11/8 講座筆記"],["nov8-pm","11/8 下午場"],...topics.map(t => [t.id,t.title])];
const chapterTopics = Array.from({length:32},(_,i) => ["chapter-"+(i+1),"第 "+(i+1)+" 分"]);
const referenceNames = new Map([...chapterTopics,...lectureTopics]);
const referenceSelect = byId("note-reference");
const noteSource = byId("note-source");
const noteFilter = byId("note-filter");

function appendNoteOptions(select,items) {
  for (const [id,title] of items) {
    const option = element("option",title);
    option.value = id;
    select.append(option);
  }
}

if (topicSelect) {
appendNoteOptions(topicSelect,noteCategories);
appendNoteOptions(noteFilter,noteCategories);
for (const [label,items] of [["《金剛經》分次",chapterTopics],["編者雜記主題",lectureTopics]]) {
  const group = element("optgroup");
  group.label = label;
  appendNoteOptions(group,items);
  referenceSelect.append(group);
}
const noteParams = new URLSearchParams(location.search);
const linkedChapter = noteParams.get("chapter");
const isGivingPractice = noteParams.get("practice") === "giving" && ["4","14","28"].includes(linkedChapter);
topicSelect.value = isGivingPractice ? "practice-journal" : "reading";
if (isGivingPractice) {
  textField.placeholder = "我做了什麼？對方需要什麼？我察覺到什麼期待？";
}
if (/^(?:[1-9]|[12][0-9]|3[0-2])$/.test(linkedChapter)) {
  referenceSelect.value = "chapter-" + linkedChapter;
  noteSource.open = true;
}
const linkedTopic = new URLSearchParams(location.search).get("topic");
if (referenceNames.has(linkedTopic)) {
  referenceSelect.value = linkedTopic;
  noteSource.open = true;
}
}

let entries = [];
let editing = null;

function noteCategory(note) {
  return noteCategories.has(note.topic) ? note.topic : "general";
}
function noteReference(note) {
  return note.reference || (referenceNames.has(note.topic) ? note.topic : "");
}
function startRelatedNote(reference) {
  if (!textField) {
    location.href = "./journal.html?topic=" + encodeURIComponent(reference) + "#journal";
    return;
  }
  const switchingDraft = textField.value.trim() && referenceSelect.value !== reference;
  if (editing || switchingDraft) {
    if (!window.confirm("目前有尚未儲存的內容。要切換筆記嗎？")) return;
    resetEditor();
  }
  referenceSelect.value = reference;
  noteSource.open = true;
  textField.focus();
}
for (const topicId of ["nov8","nov8-pm"]) {
  byId("write-" + topicId)?.addEventListener("click",() => startRelatedNote(topicId));
}
function message(text, topicId) {
  const status = byId("note-message");
  status.textContent = text;
  if (!topicId || !lectureTopics.some(([id]) => id === topicId)) return;
  const jump = element("a","在主題中查看");
  jump.href = "./lecture.html#personal-" + topicId;
  jump.addEventListener("click",() => {
    const topic = byId(topicId);
    if (topic instanceof HTMLDetailsElement) topic.open = true;
  });
  status.append(document.createTextNode(" "),jump);
}

function validEntry(note) {
  return note && typeof note.id === "string" && note.id.length > 0
    && (noteCategories.has(note.topic) || referenceNames.has(note.topic))
    && (note.reference === undefined || referenceNames.has(note.reference)) && typeof note.text === "string"
    && note.text.trim() && note.text.length <= 20000
    && typeof note.date === "string" && Number.isFinite(Date.parse(note.date));
}
function validEntries(notes) {
  return Array.isArray(notes) && notes.every(validEntry) && new Set(notes.map(n => n.id)).size === notes.length;
}
function persist(notes) {
  try {
    localStorage.setItem(storageKey,JSON.stringify(notes));
  } catch {
    message("瀏覽器目前無法儲存。請保留編輯內容，確認可使用網站儲存空間後再試。");
    return false;
  }
  entries = notes;
  renderEntries();
  updateSearch();
  return true;
}
function resetEditor() {
  editing = null;
  textField.value = "";
  referenceSelect.value = "";
  noteSource.open = false;
  byId("save-note").textContent = "新增筆記";
  byId("cancel-edit").hidden = true;
}
function renderEntries() {
  const list = byId("note-list");
  list?.replaceChildren();
  for (const [topicId] of lectureTopics) {
    const personal = byId("personal-" + topicId);
    if (!personal) continue;
    const notes = entries.filter(note => noteReference(note) === topicId);
    personal.replaceChildren();
    personal.hidden = notes.length === 0;
    if (notes.length) personal.append(element("h3","持行記錄"));
    for (const note of notes) {
      const entry = element("article",null,"note-entry");
      entry.append(element("p",new Date(note.date).toLocaleString("zh-TW"),"note-meta"),
        element("p",note.text,"reading"));
      personal.append(entry);
    }
  }
  if (!list) return;
  if (!entries.length) list.append(element("p","你的筆記會出現在這裡。","intro"));
  for (const note of entries) {
    const entry = element("article",null,"note-entry");
    const category = noteCategory(note);
    const reference = noteReference(note);
    entry.dataset.noteCategory = category;
    entry.append(element("h3",noteCategories.get(category)));
    const meta = element("p",new Date(note.date).toLocaleString("zh-TW"),"note-meta");
    if (reference) {
      const source = element("a",referenceNames.get(reference));
      source.href = reference.startsWith("chapter-") ? "./kepan.html#" + reference : "./lecture.html#" + reference;
      meta.append(" · ",source);
    }
    entry.append(meta,element("p",note.text,"reading"));
    const controls = element("div",null,"actions");
    const edit = element("button","編輯","quiet");
    edit.addEventListener("click",() => {
      if (textField.value.trim() && editing !== note.id && !window.confirm("目前有尚未儲存的內容。要切換筆記嗎？")) return;
      editing = note.id;
      topicSelect.value = category;
      referenceSelect.value = reference;
      noteSource.open = Boolean(reference);
      textField.value = note.text;
      byId("save-note").textContent = "儲存修改";
      byId("cancel-edit").hidden = false;
      textField.focus();
    });
    const remove = element("button","刪除","quiet");
    remove.addEventListener("click",() => {
      if (window.confirm("確定刪除這則筆記？") && persist(entries.filter(item => item.id !== note.id))) {
        if (editing === note.id) resetEditor();
        message("筆記已刪除。");
      }
    });
    controls.append(edit,remove);
    entry.append(controls);
    list.append(entry);
  }
  filterNotes();
}
function filterNotes() {
  const category = noteFilter.value;
  let visible = 0;
  for (const item of byId("note-list").querySelectorAll("[data-note-category]")) {
    item.hidden = Boolean(category && item.dataset.noteCategory !== category);
    if (!item.hidden) visible++;
  }
  byId("note-filter-empty").hidden = !category || visible > 0;
}
noteFilter?.addEventListener("change",filterNotes);
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (!validEntries(saved)) throw new Error("Invalid local notes");
  entries = saved;
} catch {
  if (byId("save-note")) {
    byId("save-note").disabled = true;
    message("目前無法讀取既有筆記，已暫停儲存以免覆蓋。");
  }
}
renderEntries();

byId("note-form")?.addEventListener("submit",event => {
  event.preventDefault();
  const text = textField.value.trim();
  if (!text) { message("請先輸入筆記內容。"); return; }
  const updated = {id:editing || crypto.randomUUID(),topic:topicSelect.value,text,date:new Date().toISOString()};
  if (referenceSelect.value) updated.reference = referenceSelect.value;
  const next = editing ? entries.map(note => note.id === editing ? updated : note) : [updated,...entries];
  if (persist(next)) {
    if (noteFilter.value && noteFilter.value !== updated.topic) {
      noteFilter.value = updated.topic;
      filterNotes();
    }
    resetEditor();
    message("筆記已儲存。",updated.reference);
  }
});
byId("cancel-edit")?.addEventListener("click",resetEditor);
byId("export")?.addEventListener("click",() => {
  const data = new Blob([JSON.stringify({version:1,entries},null,2)],{type:"application/json"});
  const url = URL.createObjectURL(data);
  const download = element("a");
  download.href = url;
  download.download = "prajna-notes-backup.json";
  download.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
});
byId("import")?.addEventListener("click",() => byId("import-file").click());
byId("import-file")?.addEventListener("change",async event => {
  const input = event.target;
  const file = input.files[0];
  input.value = "";
  if (!file || byId("save-note").disabled) return;
  try {
    const imported = JSON.parse(await file.text());
    if (imported.version !== 1 || !validEntries(imported.entries)) throw new Error("Invalid backup");
    const currentIds = new Set(entries.map(note => note.id));
    const added = imported.entries.filter(note => !currentIds.has(note.id));
    const merged = [...entries,...added].sort((a,b) => Date.parse(b.date)-Date.parse(a.date));
    if (persist(merged)) message("已匯入 " + added.length + " 則新筆記，已有的筆記已保留。");
  } catch {
    message("無法匯入。請選擇由本工具匯出的 JSON 備份。");
  }
});

const searchInput = byId("search-query");
const searchScope = byId("search-scope");
const searchResults = byId("search-results");
const searchStatus = byId("search-status");
const ignoredSearchCharacters = /[\s\p{P}\p{S}]/gu;
let sutraSearchItems = [];
let sutraSearchState = "idle";
let publicSearchState = "idle";

async function loadPublicSearch() {
  publicSearchState = "loading";
  try {
    const [data,lecture] = await Promise.all([loadData(),fetch("./lecture.html")]);
    if (!lecture.ok) throw new Error("Lecture unavailable");
    const lectureDoc = new DOMParser().parseFromString(await lecture.text(),"text/html");
    searchIndex.replaceChildren(lectureDoc.getElementById("lecture-reference"));
    for (const id of ["gallery","scripture-gallery","wallpaper-gallery"]) {
      const gallery = element("div");
      gallery.id = id;
      if (id === "wallpaper-gallery") {
        const wallpapers = element("section");
        wallpapers.id = "wallpapers";
        wallpapers.append(gallery);
        searchIndex.append(wallpapers);
      } else searchIndex.append(gallery);
    }
    renderNotebook(data);
    publicSearchState = "ready";
  } catch {
    searchIndex.replaceChildren();
    publicSearchState = "failed";
  }
  updateSearch();
}

function searchKey(text) {
  return text.normalize("NFKC").toLowerCase().replace(ignoredSearchCharacters, "");
}

function searchableNotes() {
  const nodes = searchIndex.querySelectorAll(
    ":is(#lecture,#nov8,#topics) :is(h2,h3,h4,h5,p,blockquote,summary,li,dt,dd)"
  );
  const result = [];
  for (const target of nodes) {
    if (target.closest(".note-entry,[data-related-card]") || target.matches(".eyebrow,[role=status]")) continue;
    const group = target.closest(".afternoon-segment,details,.session,section");
    const heading = group?.querySelector(":scope > :is(summary,h2,h3,h4)");
    const label = target.closest("#nov8-pm") ? "11/8 下午場"
      : target.closest("#nov8") ? "11/8 上午場"
      : target.closest("#lecture") ? "11/7 講座"
      : "主題索引";
    const title = [label, heading?.textContent.trim()].filter(Boolean).join(" · ");
    const scope = target.hasAttribute("data-sutra") ? "sutra" : "lecture";
    result.push({title,text:target.textContent.trim(),scope,href:"./lecture.html#" + target.closest("[id]").id});
  }
  const indexedCards = new Set();
  for (const details of searchIndex.querySelectorAll("[data-primary-card]")) {
    const target = details.querySelector("p");
    const section = details.parentElement.closest(".afternoon-segment,details,.session");
    const heading = section?.querySelector(":scope > :is(summary,h3,h4)");
    const context = heading?.textContent.trim();
    const title = [details.dataset.primaryCard,context].filter(Boolean).join(" · ");
    result.push({title,text:target.textContent.trim(),scope:"art",category:"圖卡",href:"./lecture.html#" + target.closest("[id]").id});
    indexedCards.add(details.dataset.relatedCard);
  }
  for (const target of searchIndex.querySelectorAll(".artwork-transcript")) {
    const artwork = target.closest(".artwork-entry");
    if (indexedCards.has(artwork.dataset.artworkPath)) continue;
    const title = artwork.querySelector(".artwork-title").textContent;
    const category = target.closest("#wallpapers") ? "桌布" : "圖卡";
    result.push({title,text:target.textContent.trim(),scope:"art",category,href:(category === "桌布" ? "./wallpapers.html#" : "./artwork.html#") + artwork.id});
  }
  for (const [index, note] of entries.entries()) {
    result.push({
      title:[noteCategories.get(noteCategory(note)),referenceNames.get(noteReference(note))].filter(Boolean).join(" · "),
      text:note.text,
      scope:"personal",
      target:byId("note-list").children[index],
    });
  }
  return result;
}

async function loadSearchScripture() {
  sutraSearchState = "loading";
  try {
    const response = await fetch("./kepan.html", {cache:"no-cache"});
    if (!response.ok) throw new Error("Scripture unavailable");
    const outline = new DOMParser().parseFromString(await response.text(), "text/html");
    sutraSearchItems = Array.from(outline.querySelectorAll(".k-reading"), paragraph => {
      const chapter = paragraph.previousElementSibling.textContent.trim();
      const node = paragraph.closest(".k-node[id]");
      return {
        title:"金剛經 · " + chapter,
        text:paragraph.textContent.trim(),
        scope:"sutra",
        href:"./kepan.html#" + node.id,
      };
    });
    if (!sutraSearchItems.length) throw new Error("No scripture paragraphs");
    sutraSearchState = "ready";
  } catch {
    sutraSearchState = "failed";
  }
  updateSearch();
}

function searchExcerpt(text, term) {
  const cleaned = text.replace(/\s+/g, " ");
  const index = searchKey(cleaned).indexOf(term);
  let offset = 0;
  let position = 0;
  for (const char of cleaned) {
    if (position >= index) break;
    position += searchKey(char).length;
    offset += char.length;
  }
  const start = Math.max(0, offset - 18);
  const end = Math.min(cleaned.length, start + 105);
  return (start ? "…" : "") + cleaned.slice(start, end) + (end < cleaned.length ? "…" : "");
}

function openLinkedNote(scroll = false) {
  const target = document.getElementById(location.hash.slice(1));
  if (!target) return;
  openNoteDetails(target);
  if (scroll) target.scrollIntoView();
}
window.addEventListener("hashchange",() => openLinkedNote());

function openNoteDetails(target) {
  for (let parent = target; parent; parent = parent.parentElement) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
  }
}

function showSearchTarget(target) {
  if (target.hidden && target.dataset.noteCategory) {
    noteFilter.value = "";
    filterNotes();
  }
  openNoteDetails(target);
  target.tabIndex = -1;
  target.focus({preventScroll:true});
  target.scrollIntoView({block:"center"});
}

function updateSearch() {
  if (!searchInput) return;
  const terms = searchInput.value.trim().split(/\s+/).map(searchKey).filter(Boolean);
  searchResults.replaceChildren();
  searchStatus.textContent = "";
  if (!terms.length) return;
  const scope = searchScope.value;
  const includeScripture = scope === "all" || scope === "sutra";
  if (includeScripture && sutraSearchState === "idle") void loadSearchScripture();
  const includePublicNotes = scope !== "personal";
  if (includePublicNotes && publicSearchState === "idle") void loadPublicSearch();

  const matches = [];
  const items = [...sutraSearchItems, ...searchableNotes()];
  for (const item of items) {
    if (scope === "all" ? item.scope === "personal" : item.scope !== scope) continue;
    const body = searchKey(item.text);
    const title = searchKey(item.title);
    if (terms.every(term => body.includes(term) || title.includes(term))) {
      matches.push({item, term:terms.find(term => body.includes(term)) ?? terms[0]});
    }
  }
  const limit = 30;
  for (const {item,term} of matches.slice(0,limit)) {
    const control = element(item.href ? "a" : "button",null,"search-result");
    if (item.href) control.href = item.href;
    else {
      control.type = "button";
      control.addEventListener("click",() => showSearchTarget(item.target));
    }
    const categories = {sutra:"經文",lecture:"編者雜記",personal:"持行記錄"};
    control.append(element("strong",(item.category ?? categories[item.scope]) + "｜" + item.title),
      element("span",searchExcerpt(item.text,term)));
    const row = element("li");
    row.append(control);
    searchResults.append(row);
  }
  let status = matches.length ? `找到 ${matches.length} 筆結果。` : "目前沒有符合的結果。";
  if (matches.length > limit) status += `先顯示 ${limit} 筆，可縮小範圍或多輸入幾個字。`;
  if (includeScripture && sutraSearchState === "loading") status += " 正在載入金剛經全文…";
  if (includeScripture && sutraSearchState === "failed") status += " 金剛經全文暫時無法載入，可再按搜尋重試。";
  if (includePublicNotes && publicSearchState === "loading") status += " 正在載入編者雜記與圖卡…";
  if (includePublicNotes && publicSearchState === "failed") status += " 編者雜記與圖卡暫時無法載入，可再按搜尋重試。";
  searchStatus.textContent = status;
}

byId("search-form")?.addEventListener("submit",event => {
  event.preventDefault();
  if (sutraSearchState === "failed") sutraSearchState = "idle";
  if (publicSearchState === "failed") publicSearchState = "idle";
  updateSearch();
});
searchInput?.addEventListener("input",event => {
  if (!event.isComposing) updateSearch();
});
searchInput?.addEventListener("compositionend",updateSearch);
searchScope?.addEventListener("change",updateSearch);
byId("open-search")?.addEventListener("click",() => {
  searchInput.focus({preventScroll:true});
});

byId("search-personal-notes")?.addEventListener("click",() => {
  searchScope.value = "personal";
  updateSearch();
  searchInput.focus({preventScroll:true});
});
