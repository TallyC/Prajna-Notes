"use strict";

(() => {
  const byId = id => document.getElementById(id);
  const cards = recitationCards;
  const divisions = [...new Set(cards.map(card => card.division))];
  const progressKey = "prajna-recitation-memorized";
  const positionKey = "prajna-recitation-position";
  const select = byId("division-select");
  const cardText = byId("card-text");
  const reveal = byId("reveal-card");
  const check = byId("card-memorized");
  const previous = byId("previous-card");
  const next = byId("next-card");
  const hideMode = byId("mode-hide");
  const clozeMode = byId("mode-cloze");
  const sync = byId("sync-dialog");
  const merge = byId("merge-dialog");
  let mode = "read";
  let pending = [];

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }

  function save(key,value) {
    try {
      localStorage.setItem(key,JSON.stringify(value));
    } catch {
      byId("recitation-feedback").textContent = "這個瀏覽環境無法儲存進度，可用同步碼備份。";
    }
  }

  function validId(id) {
    return Number.isInteger(id) && id >= 1 && id <= cards.length;
  }

  function parseCode(value) {
    const normalized = value.trim().replaceAll("，",",");
    if (!/^\d+(?:\s*,\s*\d+)*$/.test(normalized)) return [];
    const ids = normalized.split(",").map(Number);
    return ids.every(validId) ? [...new Set(ids)] : [];
  }

  const stored = read(progressKey);
  const memorized = new Set(Array.isArray(stored) ? stored.filter(validId) : []);
  const savedPosition = read(positionKey);
  const url = new URL(location.href);
  const incomingCard = Number(url.searchParams.get("card"));
  let index = validId(savedPosition) ? savedPosition - 1 : 0;
  if (validId(incomingCard)) {
    index = incomingCard - 1;
    save(positionKey,incomingCard);
  }
  if (url.searchParams.has("card")) {
    url.searchParams.delete("card");
    history.replaceState(history.state,"",url);
  }

  for (const division of divisions) {
    select.add(new Option(division,cards.findIndex(card => card.division === division)));
  }

  function renderProgress() {
    const percentage = Math.round(100 * memorized.size / cards.length);
    const bar = byId("recitation-progress");
    bar.max = cards.length;
    bar.value = memorized.size;
    byId("recitation-progress-text").textContent = "已背誦 " + memorized.size + "／" + cards.length + " 張（" + percentage + "%）";
  }

  function renderCloze(text) {
    const output = document.createDocumentFragment();
    let count = 0;
    let buffer = "";
    for (const character of text) {
      if (!/\p{Script=Han}/u.test(character) || ++count % 5 !== 0) {
        buffer += character;
        continue;
      }
      output.append(buffer);
      buffer = "";
      const blank = document.createElement("button");
      blank.type = "button";
      blank.className = "recitation-blank";
      blank.textContent = "□";
      blank.setAttribute("aria-label","顯示第 " + count / 5 + " 個空格");
      blank.addEventListener("click",() => {
        blank.textContent = character;
        blank.setAttribute("aria-label","已顯示 " + character);
      },{once:true});
      output.append(blank);
    }
    output.append(buffer);
    cardText.replaceChildren(output);
  }

  function renderCard() {
    const card = cards[index];
    const chapter = divisions.indexOf(card.division) + 1;
    const readUrl = "./kepan.html?card=" + card.id + "#chapter-" + chapter;
    byId("read-division").href = readUrl;
    byId("note-division").href = "./journal.html?chapter=" + chapter + "#journal";
    byId("card-division").textContent = card.division;
    byId("card-number").textContent = card.id + "／" + cards.length;
    byId("card-count").textContent = "本分 " + card.part + " · " + card.length + " 字";
    check.checked = memorized.has(card.id);
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    select.value = String(cards.findIndex(item => item.division === card.division));
    hideMode.setAttribute("aria-pressed",String(mode === "hide"));
    clozeMode.setAttribute("aria-pressed",String(mode === "cloze"));
    cardText.hidden = mode === "hide";
    reveal.hidden = mode !== "hide";
    if (mode === "cloze") renderCloze(card.text);
    else cardText.textContent = mode === "read" ? card.text : "";
  }

  function openCard(position) {
    if (position < 0 || position >= cards.length) return;
    index = position;
    save(positionKey,cards[index].id);
    renderCard();
  }

  function toggleMode(target) {
    mode = mode === target ? "read" : target;
    renderCard();
  }

  function setMemorized(value) {
    const id = cards[index].id;
    if (value) memorized.add(id);
    else memorized.delete(id);
    save(progressKey,[...memorized]);
    check.checked = value;
    renderProgress();
  }

  let qrScript;
  function loadQrScript() {
    return qrScript ??= new Promise((resolve,reject) => {
      const script = document.createElement("script");
      script.src = "./vendor/qrcode.js";
      function unavailable() {
        script.remove();
        reject(new Error("QR script unavailable"));
      }
      script.onload = () => {
        if (typeof qrcode === "function") resolve();
        else unavailable();
      };
      script.onerror = unavailable;
      document.head.append(script);
    }).catch(error => {
      qrScript = undefined;
      throw error;
    });
  }

  function updateExport() {
    const code = [...memorized].sort((a,b) => a - b).join(",");
    const url = new URL("./recitation.html",location.href);
    if (code) url.hash = "sync=" + code;
    byId("sync-link").value = url.href;
    byId("sync-code").value = code;
    byId("copy-code").disabled = !code;
    const holder = byId("sync-qr");
    holder.replaceChildren();
    if (!code) return;
    if (typeof qrcode !== "function") {
      loadQrScript().then(() => {
        if (sync.open) updateExport();
      }).catch(() => {
        if (sync.open) byId("sync-feedback").textContent = "QR 碼暫時無法顯示，仍可使用連結或同步碼。";
      });
      return;
    }
    const qr = qrcode(0,"M");
    qr.addData(url.href);
    qr.make();
    const image = document.createElement("img");
    image.alt = "掃描以開啟背誦進度轉移連結";
    image.src = qr.createDataURL(4,16);
    holder.append(image);
  }

  async function copy(field) {
    const input = byId(field);
    try {
      await navigator.clipboard.writeText(input.value);
      byId("sync-feedback").textContent = "已複製。";
    } catch {
      input.select();
      byId("sync-feedback").textContent = "請手動複製選取的文字。";
    }
  }

  function importProgress(ids) {
    for (const id of ids) memorized.add(id);
    save(progressKey,[...memorized]);
    renderProgress();
    check.checked = memorized.has(cards[index].id);
  }

  previous.addEventListener("click",() => openCard(index - 1));
  next.addEventListener("click",() => openCard(index + 1));
  select.addEventListener("change",() => openCard(Number(select.value)));
  check.addEventListener("change",() => setMemorized(check.checked));
  reveal.addEventListener("click",() => { toggleMode("hide"); hideMode.focus(); });
  hideMode.addEventListener("click",() => toggleMode("hide"));
  clozeMode.addEventListener("click",() => toggleMode("cloze"));
  byId("open-sync").addEventListener("click",() => {
    byId("sync-feedback").textContent = "";
    updateExport();
    sync.showModal();
  });
  byId("copy-link").addEventListener("click",() => copy("sync-link"));
  byId("copy-code").addEventListener("click",() => copy("sync-code"));
  byId("sync-import").addEventListener("submit",event => {
    event.preventDefault();
    const input = byId("import-code");
    const ids = parseCode(input.value);
    if (!ids.length) {
      byId("sync-feedback").textContent = "請輸入有效的卡號，並用逗號分隔。";
      return;
    }
    importProgress(ids);
    updateExport();
    input.value = "";
    byId("sync-feedback").textContent = "進度已合併。";
  });
  merge.addEventListener("close",() => {
    if (merge.returnValue === "merge") importProgress(pending);
    pending = [];
  });

  const shortcuts = {
    ArrowLeft:() => openCard(index - 1),
    ArrowRight:() => openCard(index + 1),
    " ":() => toggleMode("hide"),
    m:() => setMemorized(!check.checked),
    c:() => toggleMode("cloze"),
  };
  document.addEventListener("keydown",event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest("button,input,select,summary,a,[contenteditable]") || document.querySelector("dialog[open]")) return;
    const action = shortcuts[event.key] || shortcuts[event.key.toLowerCase()];
    if (!action) return;
    event.preventDefault();
    action();
  });

  renderCard();
  renderProgress();
  if (location.hash.startsWith("#sync=")) {
    pending = parseCode(location.hash.slice(6));
    history.replaceState(history.state,"",location.pathname + location.search);
    if (pending.length) {
      byId("merge-description").textContent = "偵測到 " + pending.length + " 張已背誦的卡片。是否合併到這台裝置？";
      merge.showModal();
    }
  }
})();
