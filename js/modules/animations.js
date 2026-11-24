import { $, $$, prefersReducedMotion } from "../utils/helpers.js";

export function initAnimations() {
  const topButton = $("#back-to-top");
  const revealTargets = $$(".reveal");
  const reduced = prefersReducedMotion();

  if (reduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => observer.observe(element));

    document.addEventListener("cantinho:reveal-added", (event) => {
      if (event.detail?.element) observer.observe(event.detail.element);
    });
  }

  const updateTopButton = () => topButton?.classList.toggle("is-visible", window.scrollY > 650);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
}
