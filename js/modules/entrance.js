import { $, $$ } from "../utils/helpers.js";

export function initEntrance() {
  const gate = $("#gate");
  const enterButton = $("#enter-button");
  const header = $("#site-header");
  const toggle = $("#nav-toggle");
  const nav = $("#site-nav");

  enterButton?.addEventListener("click", () => {
    gate?.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
    header?.classList.add("is-visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.dispatchEvent(new CustomEvent("cantinho:entered"));
  });

  const closeMenu = () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Abrir menu");
  };

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    nav?.classList.toggle("is-open", isOpen);
  });

  $$(".site-nav a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}
