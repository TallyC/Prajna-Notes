"use strict";

(() => {
  const revision = document.querySelector('meta[name="prajna-release"]').content;
  const status = document.getElementById("site-update-status");
  const updateParameter = "site-release";
  const snapshotKey = "prajna-update-position";
  let checking = false;
  let pending = "";
  let reloading = false;
  let ready = false;
  let lastCheck = -Infinity;

  function restorePosition() {
    let snapshot;
    try { snapshot = JSON.parse(sessionStorage.getItem(snapshotKey)); } catch {}
    if (!snapshot || snapshot.revision !== revision || snapshot.path !== location.pathname) return;
    try { sessionStorage.removeItem(snapshotKey); } catch {}
    const open = new Set(snapshot.open);
    for (const details of document.querySelectorAll("details[id]")) details.open = open.has(details.id);
    requestAnimationFrame(() => window.scrollTo(0,snapshot.y));
  }

  const current = new URL(location.href);
  if (current.searchParams.get(updateParameter) === revision) {
    current.searchParams.delete(updateParameter);
    history.replaceState(history.state,"",current);
    if (["journal","lecture","artwork","wallpapers"].includes(document.querySelector("[data-reading-page]")?.dataset.readingPage)) {
      document.addEventListener("prajna:content-ready",restorePosition,{once:true});
    } else {
      restorePosition();
    }
  }

  function applyPendingUpdate() {
    if (!pending || reloading || document.visibilityState === "hidden") return;
    const draft = document.getElementById("note-text");
    const cancelEdit = document.getElementById("cancel-edit");
    const audio = document.getElementById("podcast-audio");
    if (audio && !audio.paused && !audio.ended) return;
    if (draft?.value || (cancelEdit && !cancelEdit.hidden) || document.querySelector("dialog[open]")) return;

    const url = new URL(location.href);
    if (url.searchParams.get(updateParameter) === pending) return;
    url.searchParams.set(updateParameter,pending);
    try {
      sessionStorage.setItem(snapshotKey,JSON.stringify({
        revision:pending,
        path:location.pathname,
        y:window.scrollY,
        open:[...document.querySelectorAll("details[id][open]")].map(details => details.id),
      }));
    } catch {}
    reloading = true;
    if (status) status.textContent = "正在接收新版…";
    location.replace(url.href);
  }

  async function checkForUpdate(force = false) {
    if (!ready || checking || reloading || document.visibilityState === "hidden") return;
    const now = performance.now();
    if (!force && now - lastCheck < 10000) return;
    lastCheck = now;
    checking = true;
    try {
      const response = await fetch("./release.json",{cache:"no-store"});
      if (!response.ok) return;
      const {revision:available} = await response.json();
      if (!/^[a-f0-9]{20}$/.test(available)) return;
      pending = available === revision ? "" : available;
      applyPendingUpdate();
    } catch {
      // A later check can retry after a temporary connection failure.
    } finally {
      checking = false;
    }
  }

  function retryPending() {
    if (pending) setTimeout(applyPendingUpdate,0);
  }

  document.addEventListener("visibilitychange",() => checkForUpdate());
  window.addEventListener("focus",() => checkForUpdate());
  window.addEventListener("pageshow",event => {
    if (event.persisted) {
      checkForUpdate(true);
    } else {
      setTimeout(() => {
        ready = true;
        checkForUpdate();
      },500);
    }
  });
  window.addEventListener("online",() => checkForUpdate(true));
  document.getElementById("note-form")?.addEventListener("input",retryPending);
  document.getElementById("note-form")?.addEventListener("submit",retryPending);
  document.getElementById("cancel-edit")?.addEventListener("click",retryPending);
  document.addEventListener("close",event => {
    if (event.target instanceof HTMLDialogElement) retryPending();
  },true);
  document.getElementById("podcast-audio")?.addEventListener("pause",retryPending);
  document.getElementById("podcast-audio")?.addEventListener("ended",retryPending);
  setInterval(checkForUpdate,10000);
})();
