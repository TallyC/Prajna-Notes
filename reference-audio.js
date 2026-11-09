"use strict";

(() => {
  const player = document.getElementById("podcast-player");
  const audio = document.getElementById("podcast-audio");
  const title = document.getElementById("podcast-now-playing");
  const status = document.getElementById("podcast-status");
  let current;

  function showError() {
    if (current) status.textContent = "這集暫時無法在站內播放，可用同一集旁的原站連結收聽。";
  }

  document.getElementById("podcasts").addEventListener("click",async event => {
    const episode = event.target.closest("[data-podcast-src]");
    if (!episode) return;
    current = episode;
    title.textContent = episode.dataset.podcastTitle;
    status.textContent = "";
    player.hidden = false;
    if (audio.src !== episode.dataset.podcastSrc) audio.src = episode.dataset.podcastSrc;
    if ("mediaSession" in navigator && "MediaMetadata" in window) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.dataset.podcastTitle,
        artist: "聖嚴法師",
        album: "聖嚴法師經典學院",
      });
    }
    try {
      await audio.play();
    } catch (error) {
      if (error.name !== "AbortError" && current === episode) showError();
    }
  });

  audio.addEventListener("error",showError);
  document.getElementById("podcast-stop").addEventListener("click",() => {
    const previous = current;
    current = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    player.hidden = true;
    if ("mediaSession" in navigator) navigator.mediaSession.metadata = null;
    previous?.focus({preventScroll:true});
  });
})();
