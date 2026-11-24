import { $, prefersReducedMotion } from "../utils/helpers.js";

export function initLetter(data) {
  const button = $("#open-letter");
  const envelope = $("#envelope");
  const letter = $("#letter-content");
  const text = $("#letter-text");
  const signature = $("#letter-signature");
  if (!button || !letter || !text || !signature) return;

  let opened = false;
  button.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope?.classList.add("is-open");
    button.hidden = true;
    letter.hidden = false;
    signature.textContent = data.letter?.signature || "Com amor";

    const message = data.letter?.content || "[ESCREVA AQUI SUA CARTA DE AMOR]";
    if (prefersReducedMotion()) {
      text.textContent = message;
      return;
    }
    let index = 0;
    const typeNext = () => {
      index = Math.min(index + 2, message.length);
      text.textContent = message.slice(0, index);
      if (index < message.length) window.setTimeout(typeNext, 28);
    };
    window.setTimeout(typeNext, 650);
  });
}
