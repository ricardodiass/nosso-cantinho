import { $ } from "../utils/helpers.js";

export function initMusic(data) {
  const card = $("#music-card");
  const frame = $("#music-video");
  const title = $("#song-title");
  const artist = $("#song-artist");
  const link = $("#music-youtube-link");

  if (!card || !frame || !title || !artist || !link) return;

  const music = data.music || {};

  title.textContent = music.title || "Nossa música";
  artist.textContent = music.artist || "";

  const videoId = music.youtubeVideoId || "";

  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    card.classList.add("music-card--unavailable");
    link.hidden = true;
    return;
  }

  frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`;
  frame.title = `${music.title || "Nossa música"} — ${music.artist || ""}`;
  link.href = `https://www.youtube.com/watch?v=${videoId}`;
}
