"use strict";

(() => {
  const cards = [
    ["留一點時間", "若有人想把話說完，先陪他聽一段。此刻能專心在場，也是一份給予。"],
    ["分享會做的事", "有人正好卡在你熟悉的地方，可以分享一個有用的步驟，讓他自己接著走。"],
    ["在需要的時候", "有人趕路、剛到陌生地方，或身體不舒服時，若你能幫上一點，就在此刻伸手。"],
    ["分享一份資源", "手邊若有合適的書、資訊或物品，可以先確認對方需要，再分享出去。"],
    ["放下人情帳", "幫忙之後，若心裡想起『他應該記得』，輕輕看見這個念頭，不必責怪自己。"],
    ["陪一段難處", "有人遇到困難時，不急著替他決定。先陪著釐清，再看看能幫上哪一步。"],
    ["說一句有用的好話", "若看見別人正為一件事發愁，給一句真誠又有幫助的話；不急著說教。"],
  ];
  const button = document.getElementById("giving-draw");
  const card = document.getElementById("giving-drawn-card");
  if (!button || !card) return;
  let previous = -1;

  button.addEventListener("click", () => {
    const offset = Math.floor(Math.random() * (cards.length - 1));
    const index = previous < 0 ? Math.floor(Math.random() * cards.length) :
      (previous + 1 + offset) % cards.length;
    previous = index;
    document.getElementById("giving-card-title").textContent = cards[index][0];
    document.getElementById("giving-card-text").textContent = cards[index][1];
    card.hidden = false;
    button.textContent = "再抽一張";
  });
})();
