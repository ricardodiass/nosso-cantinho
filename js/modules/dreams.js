import { $, createElement, showToast } from "../utils/helpers.js";
import { loadDreams, saveDreams } from "../utils/storage.js";

export function initDreams(data, burst = () => {}) {
  const list = $("#dream-list");
  const form = $("#dream-form");
  const input = $("#new-dream");
  if (!list || !form || !input) return;

  let dreams = loadDreams(Array.isArray(data.dreams) ? data.dreams : []);

  const persist = () => {
    if (!saveDreams(dreams)) showToast("O navegador não permitiu salvar. Verifique o espaço disponível.");
  };

  const render = () => {
    list.replaceChildren();
    dreams.forEach((dream) => {
      const item = createElement("li", `dream-item${dream.done ? " is-done" : ""}`);
      const checkbox = createElement("input", "dream-item__check");
      checkbox.type = "checkbox";
      checkbox.checked = dream.done;
      checkbox.setAttribute("aria-label", `Marcar como ${dream.done ? "não realizado" : "realizado"}: ${dream.text}`);
      checkbox.addEventListener("change", () => {
        dream.done = checkbox.checked;
        persist();
        render();
        if (dream.done) {
          showToast("Mais um sonho para guardar na memória. ❤️");
          burst(12);
        }
      });

      const text = createElement("span", "dream-item__text", dream.text);
      const remove = createElement("button", "dream-item__remove", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remover sonho: ${dream.text}`);
      remove.addEventListener("click", () => {
        dreams = dreams.filter((entry) => entry.id !== dream.id);
        persist();
        render();
      });
      item.append(checkbox, text, remove);
      list.append(item);
    });
    if (dreams.length === 0) {
      list.append(createElement("li", "empty-state", "Adicione o primeiro sonho que vocês querem realizar."));
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    dreams.push({ id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, text: text.slice(0, 120), done: false });
    persist();
    render();
    input.value = "";
    input.focus();
  });

  render();
}
