import { $, createElement } from "../utils/helpers.js";

export function initTimeline(data) {
  const container = $("#timeline");
  if (!container) return;

  if (!Array.isArray(data.timeline) || data.timeline.length === 0) {
    container.append(createElement("p", "empty-state", "Sua história começa aqui. Adicione os acontecimentos especiais em js/data/site-data.js."));
    return;
  }

  data.timeline.forEach((event) => {
    const article = createElement("article", "timeline__item reveal");
    if (event.date) {
      const date = createElement("time", "timeline__date", event.date);
      article.append(date);
    }
    const title = createElement("h3", "timeline__title", event.title || "Um capítulo especial");
    if (event.placeholder) title.append(createElement("span", "timeline__placeholder", "Personalizar"));
    article.append(title);
    if (event.description) article.append(createElement("p", "timeline__description", event.description));
    if (event.photo) {
      const image = createElement("img", "timeline__photo");
      image.src = event.photo;
      image.alt = event.title ? `Fotografia: ${event.title}` : "Fotografia de um momento especial";
      image.loading = "lazy";
      image.addEventListener("error", () => image.remove(), { once: true });
      article.append(image);
    }
    container.append(article);
    document.dispatchEvent(new CustomEvent("cantinho:reveal-added", { detail: { element: article } }));
  });
}
