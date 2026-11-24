import { $, createElement, showToast } from "../utils/helpers.js";

export function initSurprises(data, burst = () => {}) {
  const button = $("#surprise-button");
  const message = $("#surprise-message");
  const secrets = Array.isArray(data.surprises) ? data.surprises.filter((item) => typeof item === "string" && item.trim()) : [];
  if (!button || !message) return;

  const reveal = () => {
    if (!secrets.length) {
      message.textContent = "Adicione mensagens especiais em js/data/site-data.js.";
      return;
    }
    message.textContent = secrets[Math.floor(Math.random() * secrets.length)];
    burst(26);
  };
  button.addEventListener("click", reveal);

  const sections = ["#historia", "#galeria", "#sonhos", "#final"];
  sections.forEach((selector, index) => {
    const section = $(selector);
    if (!section) return;
    const heart = createElement("button", "secret-heart", "♥");
    heart.type = "button";
    heart.style.right = `${4 + (index % 3) * 5}%`;
    heart.style.bottom = `${1 + (index % 2) * 2}rem`;
    heart.setAttribute("aria-label", "Revelar uma mensagem escondida");
    heart.addEventListener("click", () => {
      if (!secrets.length) return;
      const secret = secrets[Math.floor(Math.random() * secrets.length)];
      showToast(secret);
      heart.hidden = true;
      burst(10);
    });
    section.append(heart);
  });
}
