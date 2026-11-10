"use strict";

(() => {
  const cards = document.querySelectorAll("[data-giving-day]");
  const dateLabel = document.getElementById("giving-date");
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  function showToday() {
    const parts = formatter.formatToParts(new Date());
    const { year, month, day, weekday } = Object.fromEntries(
      parts.map(({ type, value }) => [type, value]),
    );
    const date = `${year}-${month}-${day}`;
    if (dateLabel.dateTime === date) return;

    for (const card of cards) card.hidden = card.dataset.givingDay !== weekday;
    dateLabel.dateTime = date;
    dateLabel.textContent = `${year}/${month}/${day}`;
    dateLabel.hidden = false;
  }

  showToday();
  window.addEventListener("pageshow", showToday);
  document.addEventListener("visibilitychange", showToday);
  window.setInterval(showToday, 60_000);
})();
