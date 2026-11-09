"use strict";

(() => {
  const key = "prajnaDocumentOpen";
  if (history.state?.[key]) {
    const state = {...history.state};
    delete state[key];
    history.replaceState(state,"");
  }

  let viewer;
  let trigger;
  let closing = false;

  function createViewer() {
    const dialog = document.createElement("dialog");
    dialog.className = "document-viewer";
    dialog.setAttribute("aria-labelledby","document-viewer-title");
    dialog.innerHTML = `
      <div class="dialog-header">
        <h2 id="document-viewer-title"></h2>
        <button type="button" class="quiet" autofocus>返回頁面</button>
      </div>
      <div class="image-actions">
        <a data-open-pdf target="_blank" rel="noopener">在新分頁開啟 PDF ↗</a>
        <a data-save-pdf download>下載 PDF</a>
      </div>
      <div class="document-preview">
        <p>原站 PDF 會另開分頁。關閉該分頁即可回到這裡。</p>
        <iframe title="PDF 預覽" hidden></iframe>
      </div>`;
    dialog.querySelector("button").addEventListener("click",closeViewer);
    dialog.addEventListener("cancel",event => {
      event.preventDefault();
      closeViewer();
    });
    dialog.addEventListener("close",() => {
      dialog.querySelector("iframe").removeAttribute("src");
      trigger?.focus({preventScroll:true});
      trigger = null;
    });
    document.body.append(dialog);
    return dialog;
  }

  function closeViewer() {
    if (closing) return;
    if (!history.state?.[key]) {
      viewer.close();
      return;
    }
    closing = true;
    history.back();
  }

  document.addEventListener("click",event => {
    if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || link.closest(".document-viewer")) return;
    const url = new URL(link.href);
    if (!["https:","http:"].includes(url.protocol) || !/\.pdf$/i.test(url.pathname)) return;

    event.preventDefault();
    viewer ??= createViewer();
    trigger = link;
    const local = url.origin === location.origin;
    viewer.classList.toggle("external-document",!local);
    viewer.querySelector("h2").textContent = link.dataset.pdfTitle || link.textContent.trim();
    viewer.querySelector("[data-open-pdf]").href = url.href;
    const download = viewer.querySelector("[data-save-pdf]");
    download.hidden = !local;
    download.href = url.href;
    download.download = link.dataset.download || "";
    const iframe = viewer.querySelector("iframe");
    iframe.hidden = !local;
    viewer.querySelector(".document-preview p").hidden = local;
    if (local) iframe.src = url.href;

    history.pushState({...history.state,[key]:true},"");
    viewer.showModal();
  });

  window.addEventListener("popstate",() => {
    closing = false;
    if (viewer?.open && !history.state?.[key]) viewer.close();
  });
})();
