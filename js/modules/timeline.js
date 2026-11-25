import { $, createElement, showToast } from "../utils/helpers.js";
import { loadTimelineEvents, saveTimelineEvents } from "../utils/storage.js";

function parseDate(date) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(date || ""));
  if (!match) return Number.MAX_SAFE_INTEGER;

  const [, day, month, year] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  return parsed.getTime();
}

export function initTimeline(data) {
  const container = $("#timeline");
  const form = $("#timeline-form");
  const toggle = $("#timeline-toggle");
  const cancel = $("#timeline-cancel");
  const titleInput = $("#timeline-title");
  const dateInput = $("#timeline-date");
  const descriptionInput = $("#timeline-description");
  const deleteDialog = $("#timeline-delete-dialog");
  const deleteDialogTitle = $("#timeline-delete-event-title");
  const deleteCancel = $("#timeline-delete-cancel");
  const deleteConfirm = $("#timeline-delete-confirm");

  if (
    !container ||
    !form ||
    !toggle ||
    !cancel ||
    !titleInput ||
    !dateInput ||
    !descriptionInput ||
    !deleteDialog ||
    !deleteDialogTitle ||
    !deleteCancel ||
    !deleteConfirm
  ) {
    return;
  }

  let userEvents = loadTimelineEvents();
  let pendingDeleteId = null;

  deleteCancel.addEventListener("click", () => deleteDialog.close());

  deleteDialog.addEventListener("click", (event) => {
    if (event.target === deleteDialog) deleteDialog.close();
  });

  deleteDialog.addEventListener("close", () => {
    pendingDeleteId = null;
  });

  deleteConfirm.addEventListener("click", () => {
    if (!pendingDeleteId) return;

    const updatedEvents = userEvents.filter(
      (entry) => entry.id !== pendingDeleteId,
    );

    if (updatedEvents.length === userEvents.length) {
      deleteDialog.close();
      return;
    }

    if (!saveTimelineEvents(updatedEvents)) {
      deleteDialog.close();
      showToast("Não foi possível remover o acontecimento salvo.");
      return;
    }

    userEvents = updatedEvents;
    deleteDialog.close();
    render();
    toggle.focus();
    showToast("Acontecimento removido da nossa história.");
  });

  function render() {
    container.replaceChildren();

    const originalEvents = Array.isArray(data.timeline)
      ? data.timeline.map((event) => ({ ...event, userAdded: false }))
      : [];

    const events = [...originalEvents, ...userEvents.map((event) => ({
      ...event,
      userAdded: true,
    }))];

    events.sort((a, b) => parseDate(a.date) - parseDate(b.date));

    if (events.length === 0) {
      container.append(
        createElement(
          "p",
          "empty-state",
          "Nossa história está só começando. Adicione o primeiro acontecimento especial.",
        ),
      );
      return;
    }

    events.forEach((event) => {
      const article = createElement("article", "timeline__item reveal");

      if (event.date) {
        const date = createElement("time", "timeline__date", event.date);
        article.append(date);
      }

      const heading = createElement("div", "timeline__heading");
      const title = createElement(
        "h3",
        "timeline__title",
        event.title || "Um capítulo especial",
      );

      if (event.placeholder) {
        title.append(createElement("span", "timeline__placeholder", "Personalizar"));
      }

      heading.append(title);

      if (event.userAdded) {
        const remove = createElement("button", "timeline__remove", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `Remover acontecimento: ${event.title}`);

        remove.addEventListener("click", () => {
          pendingDeleteId = event.id;
          deleteDialogTitle.textContent = event.title;
          deleteDialog.showModal();

          const updatedEvents = userEvents.filter((entry) => entry.id !== event.id);

          if (!saveTimelineEvents(updatedEvents)) {
            showToast("Não foi possível atualizar os acontecimentos salvos.");
            return;
          }

          userEvents = updatedEvents;
          render();
          showToast("Acontecimento removido.");
        });

        heading.append(remove);
      }

      article.append(heading);

      if (event.description) {
        article.append(createElement("p", "timeline__description", event.description));
      }

      if (event.photo) {
        const image = createElement("img", "timeline__photo");
        image.src = event.photo;
        image.alt = event.title
          ? `Fotografia: ${event.title}`
          : "Fotografia de um momento especial";
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => image.remove(), { once: true });
        article.append(image);
      }

      container.append(article);
      document.dispatchEvent(
        new CustomEvent("cantinho:reveal-added", { detail: { element: article } }),
      );
    });
  }

  toggle.addEventListener("click", () => {
    form.hidden = !form.hidden;
    toggle.setAttribute("aria-expanded", String(!form.hidden));

    if (!form.hidden) titleInput.focus();
  });

  cancel.addEventListener("click", () => {
    form.reset();
    form.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const submitButton = form.querySelector('[type="submit"]');
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Salvando...";

    try {
      const title = titleInput.value.trim();
      const dateValue = dateInput.value;
      const description = descriptionInput.value.trim();

      if (!title || !dateValue) {
        showToast("Preencha o título e a data do acontecimento.");
        return;
      }

      const date = dateValue.split("-").reverse().join("/");

      const newEvent = {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        date,
        title: title.slice(0, 100),
        description: description.slice(0, 700),
      };

      const updatedEvents = [...userEvents, newEvent];

      if (!saveTimelineEvents(updatedEvents)) {
        showToast("Não foi possível salvar. Remova uma foto antiga ou escolha uma imagem menor.");
        return;
      }

      userEvents = updatedEvents;
      render();

      form.reset();
      form.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();

      showToast("Mais um capítulo da nossa história foi guardado. ❤️");
    } catch (error) {
      showToast(error.message || "Não foi possível adicionar esse acontecimento.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });

  form.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
  render();
}
