import { $, formatTime } from "../utils/helpers.js";

export function initMusic(data) {
  const card = $("#music-card");
  const audio = $("#audio-player");
  const button = $("#music-play");
  const progress = $("#music-progress");
  const message = $("#music-message");
  if (!card || !audio || !button || !progress || !message) return;

  $("#song-title").textContent = data.music?.title || "[NOME DA MÚSICA]";
  $("#song-artist").textContent = data.music?.artist || "[ARTISTA]";
  const cover = $("#music-cover");
  if (data.music?.cover) cover.src = data.music.cover;
  cover?.addEventListener("error", () => { cover.hidden = true; }, { once: true });

  if (!data.music?.file) {
    button.addEventListener("click", () => {
      message.textContent = "Adicione o caminho do áudio em js/data/site-data.js para ativar a música.";
    });
  } else {
    audio.src = data.music.file;
    button.addEventListener("click", async () => {
      message.textContent = "";
      if (audio.paused) {
        try {
          await audio.play();
        } catch {
          message.textContent = "Não foi possível reproduzir o áudio. Confira o arquivo configurado.";
        }
      } else {
        audio.pause();
      }
    });
  }

  audio.addEventListener("play", () => {
    card.classList.add("is-playing");
    button.textContent = "Ⅱ Pausar";
  });
  audio.addEventListener("pause", () => {
    card.classList.remove("is-playing");
    button.textContent = "▶ Tocar";
  });
  audio.addEventListener("ended", () => {
    card.classList.remove("is-playing");
    button.textContent = "▶ Tocar";
    progress.value = "0";
  });
  audio.addEventListener("loadedmetadata", () => {
    $("#music-duration").textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    progress.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : "0";
    $("#music-current").textContent = formatTime(audio.currentTime);
  });
  audio.addEventListener("error", () => {
    message.textContent = "O arquivo de áudio não foi encontrado. Confira o caminho em site-data.js.";
  });
  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    }
  });
}
