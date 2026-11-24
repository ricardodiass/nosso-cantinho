import { $, createElement } from "../utils/helpers.js";

export function initGallery(data) {
  const grid = $("#gallery-grid");
  const dialog = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const caption = $("#lightbox-caption");
  if (!grid || !dialog || !lightboxImage || !caption) return;

  const photos = [];
  (Array.isArray(data.gallery) ? data.gallery : []).forEach((item) => {
    if (item.quote) {
      grid.append(createElement("p", "gallery-quote reveal", item.quote));
      return;
    }
    if (!item.src) return;

    const figure = createElement("figure", "gallery-item reveal");
    const button = createElement("button", "gallery-item__button");
    button.type = "button";
    const image = createElement("img");
    image.src = item.src;
    image.alt = item.caption || "Fotografia de um momento especial";
    image.loading = "lazy";
    image.style.aspectRatio = item.ratio || "4 / 5";
    image.addEventListener("error", () => figure.remove(), { once: true });
    button.append(image);
    const text = [item.caption, item.date].filter(Boolean).join(" · ");
    const figcaption = createElement("figcaption", "", text);
    figure.append(button);
    if (text) figure.append(figcaption);
    const photoIndex = photos.push({ src: item.src, alt: image.alt, caption: text }) - 1;
    button.dataset.photoIndex = String(photoIndex);
    grid.append(figure);
    document.dispatchEvent(new CustomEvent("cantinho:reveal-added", { detail: { element: figure } }));
  });

  if (photos.length === 0) {
    grid.append(createElement("p", "empty-state", "Adicione suas fotografias em js/data/site-data.js e coloque os arquivos na pasta assets/images/gallery."));
  }

  let activeIndex = 0;
  const showPhoto = (index) => {
    if (!photos.length) return;
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    caption.textContent = photo.caption;
  };

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo-index]");
    if (!button) return;
    showPhoto(Number(button.dataset.photoIndex));
    dialog.showModal();
  });

  $("#lightbox-close")?.addEventListener("click", () => dialog.close());
  $("#lightbox-previous")?.addEventListener("click", () => showPhoto(activeIndex - 1));
  $("#lightbox-next")?.addEventListener("click", () => showPhoto(activeIndex + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });

  let touchStartX = 0;
  dialog.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });
  dialog.addEventListener("touchend", (event) => {
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    if (Math.abs(delta) > 45) showPhoto(activeIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });
}
