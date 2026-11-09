"use strict";

(() => {
  const options = {
    font: {label:"字體", values:{system:"系統字體",serif:"明體"}},
    size: {label:"字級", stepper:true, values:{small:"14 px",standard:"16 px",large:"19 px",larger:"23 px",largest:"26 px"}},
    spacing: {label:"段落間距", stepper:true, values:{compact:"緊湊",standard:"適中",relaxed:"寬鬆",wide:"最寬"}},
    theme: {label:"背景色", values:{blue:"英倫藍",gray:"簡約灰",ink:"典雅墨",paper:"古樸紙"}},
  };
  const defaults = {font:"system",size:"standard",spacing:"standard",theme:"paper"};
  const themeColors = {blue:"#e4ebf2",gray:"#e8e8e5",ink:"#252627",paper:"#e8dcc0"};
  const settingsKey = "prajna-reading-settings";
  const welcomeKey = "prajna-first-visit-seen";
  const panel = document.querySelector("[data-reading-settings]");
  const root = document.documentElement;

  function readStored(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function storePreference(key,value) {
    try { localStorage.setItem(key,value); } catch {}
  }
  function readSettings() {
    let stored;
    try { stored = JSON.parse(readStored(settingsKey)); } catch {}
    const preferences = {...defaults};
    if (stored?.theme === "night") stored.theme = "ink";
    if (stored?.theme === "white") stored.theme = "gray";
    if (stored?.theme === "sage") stored.theme = "blue";
    for (const [key,option] of Object.entries(options)) {
      if (Object.prototype.hasOwnProperty.call(option.values,stored?.[key])) preferences[key] = stored[key];
    }
    return preferences;
  }

  let preferences = readSettings();
  const fields = document.createElement("div");
  fields.className = "reading-fields";
  const updateControls = new Map();
  function changeSetting(key,value) {
    preferences[key] = value;
    applySettings();
    storePreference(settingsKey,JSON.stringify(preferences));
  }
  for (const [key,{label,values,stepper}] of Object.entries(options)) {
    if (stepper) {
      const field = document.createElement("div");
      field.className = "reading-step-field";
      const title = document.createElement("span");
      title.textContent = label;
      title.id = "reading-label-" + key;
      const group = document.createElement("div");
      group.className = "reading-stepper";
      group.setAttribute("role","group");
      group.setAttribute("aria-labelledby",title.id);
      const levels = Object.keys(values);
      const current = document.createElement("output");
      current.setAttribute("aria-label","目前" + label);
      const buttons = [-1,1].map(direction => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiet";
        button.textContent = direction < 0 ? "−" : "＋";
        button.setAttribute("aria-label",(direction < 0 ? "縮小" : "加大") + label);
        button.addEventListener("click",() => {
          const next = levels[levels.indexOf(preferences[key]) + direction];
          if (next) changeSetting(key,next);
        });
        return button;
      });
      const [decrease,increase] = buttons;
      group.append(decrease,current,increase);
      field.append(title,group);
      fields.append(field);
      updateControls.set(key,value => {
        current.value = values[value];
        decrease.disabled = value === levels[0];
        increase.disabled = value === levels.at(-1);
      });
      continue;
    }

    const field = document.createElement("label");
    field.textContent = label;
    const select = document.createElement("select");
    select.name = key;
    for (const [value,text] of Object.entries(values)) select.add(new Option(text,value));
    select.addEventListener("change",() => changeSetting(key,select.value));
    field.append(select);
    fields.append(field);
    updateControls.set(key,value => { select.value = value; });
  }
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "quiet";
  reset.textContent = "恢復預設";
  reset.addEventListener("click",() => {
    preferences = {...defaults};
    applySettings();
    storePreference(settingsKey,JSON.stringify(preferences));
  });
  const help = document.createElement("div");
  help.className = "reading-help";
  help.innerHTML = `<dl class="tool-steps">
    <div><dt>有什麼</dt><dd>字體、字級、段落間距、底色與經文預覽。</dd></div>
    <div><dt>怎麼用</dt><dd>調整後看下方預覽。選擇會自動儲存。</dd></div>
    <div><dt>如何下手</dt><dd>可先按一次「＋」放大字級，看看是否更好讀。</dd></div>
    <div><dt>工具助益</dt><dd>讓經文和使用說明都調成自己讀得清楚的樣子。</dd></div>
  </dl>`;
  const settingsGuide = document.createElement("a");
  settingsGuide.href = "./guide.html#guide-settings";
  settingsGuide.textContent = "查看設定的完整說明";
  help.append(settingsGuide);
  panel.querySelector("[data-reading-preview]").before(help,fields);
  panel.append(reset);

  function applySettings() {
    for (const [key,value] of Object.entries(preferences)) {
      root.setAttribute("data-reading-" + key,value);
      updateControls.get(key)(value);
    }
    document.querySelector('meta[name="theme-color"]').content = themeColors[preferences.theme];
  }
  applySettings();
  window.addEventListener("storage",event => {
    if (event.key === settingsKey) {
      preferences = readSettings();
      applySettings();
    }
  });
  function openSettings() {
    if (!panel.open) panel.showModal();
  }
  for (const trigger of document.querySelectorAll("[data-open-reading]")) {
    trigger.addEventListener("click",openSettings);
  }
  function openLinkedPanel() {
    if (location.hash === "#reading-settings") openSettings();
    const guide = document.getElementById(location.hash.slice(1));
    if (guide?.matches("details.guide-topic,#install-guide")) guide.open = true;
  }
  window.addEventListener("hashchange",openLinkedPanel);
  panel.addEventListener("close",() => {
    if (location.hash !== "#reading-settings") return;
    const url = new URL(location.href);
    url.hash = "";
    history.replaceState(history.state,"",url);
  });
  openLinkedPanel();

  const resumeReading = document.querySelector("[data-resume-reading]");
  const resumeReciting = document.querySelector("[data-resume-reciting]");
  const quickStart = document.querySelector("[data-home-start]");
  if (resumeReading && resumeReciting && quickStart) {
    const quickStartKey = "prajna-home-start-collapsed";

    function refreshHome() {
      const chapter = readStored("prajna-last-chapter");
      const hasChapter = /^(?:[1-9]|[12][0-9]|3[0-2])$/.test(chapter);
      resumeReading.href = hasChapter ? "./kepan.html#chapter-" + chapter : "./kepan.html";
      resumeReading.textContent = hasChapter ? "讀 · 第 " + chapter + " 分" : "讀 · 開始讀經";

      const card = readStored("prajna-recitation-position");
      const hasCard = /^[1-9][0-9]*$/.test(card) && Number.isSafeInteger(Number(card));
      resumeReciting.href = hasCard ? "./recitation.html?card=" + card + "#practice" : "./recitation.html#practice";
      resumeReciting.textContent = hasCard ? "誦 · 第 " + card + " 張" : "誦 · 開始背誦";
      quickStart.open = readStored(quickStartKey) !== "1";
    }

    refreshHome();
    window.addEventListener("pageshow", event => {
      if (event.persisted) refreshHome();
    });
    quickStart.addEventListener("toggle", () => storePreference(quickStartKey,quickStart.open ? "0" : "1"));
  }

  const welcome = document.querySelector("[data-first-visit]");
  const standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches;
  if (!welcome || readStored(welcomeKey) || standalone) return;
  welcome.className = "first-visit";
  const heading = document.createElement("h2");
  heading.textContent = "第一次使用？";
  const intro = document.createElement("p");
  intro.textContent = "可以直接用瀏覽器讀經，也可以把工具加入手機主畫面，下次從圖示開啟。";
  const actions = document.createElement("div");
  actions.className = "actions";
  const open = document.createElement("button");
  open.type = "button";
  open.textContent = "直接使用";
  open.addEventListener("click",() => {
    storePreference(welcomeKey,"1");
    welcome.hidden = true;
    (document.querySelector(".home-nav-primary") || document.getElementById("chapter-select")).focus({preventScroll:true});
  });
  const install = document.createElement("a");
  install.href = "./guide.html#install-guide";
  install.textContent = "怎麼加入手機主畫面";
  actions.append(open,install);
  welcome.append(heading,intro,actions);
})();
