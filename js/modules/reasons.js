import { $, createElement, showToast } from "../utils/helpers.js";

export function initReasons(data) {
  const grid = $("#reasons-grid");
  const randomButton = $("#random-reason");
  const title = $("#reasons-title");
  if (!grid) return;

  title.textContent = data.reasonsTitle || "Coisas que amo em você";
  const reasons = Array.isArray(data.reasons) ? data.reasons.filter((item) => typeof item === "string" && item.trim()) : [];
  if (reasons.length === 0) {
    grid.append(createElement("p", "empty-state", "Adicione seus motivos em js/data/site-data.js para preencher este espaço."));
    if (randomButton) randomButton.hidden = true;
    return;
  }

  reasons.forEach((reason, index) => {
    const button = createElement("button", "reason-card", String(index + 1));
    button.type = "button";
    button.dataset.reason = reason;
    button.setAttribute("aria-label", `Revelar motivo ${index + 1}`);
    button.setAttribute("aria-expanded", "false");
    grid.append(button);
  });

  const reveal = (button) => {
    if (!button || button.classList.contains("is-open")) return;
    button.classList.add("is-open");
    button.textContent = button.dataset.reason;
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", button.dataset.reason);
  };

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".reason-card");
    if (button) reveal(button);
  });

  randomButton?.addEventListener("click", () => {
    const unopened = [...grid.querySelectorAll(".reason-card:not(.is-open)")];
    if (unopened.length === 0) {
      showToast("Você já revelou todos os motivos. ❤️");
      return;
    }
    const selected = unopened[Math.floor(Math.random() * unopened.length)];
    reveal(selected);
    selected.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
