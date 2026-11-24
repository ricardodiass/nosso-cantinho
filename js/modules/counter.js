import { $, createElement } from "../utils/helpers.js";

const UNITS = ["Anos", "Meses", "Dias", "Horas", "Minutos", "Segundos"];

function addMonthsClamped(date, months) {
  const result = new Date(date);
  const originalDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(originalDay, lastDay));
  return result;
}

function calculateParts(start, now) {
  let totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  let cursor = addMonthsClamped(start, totalMonths);
  if (cursor > now) {
    totalMonths -= 1;
    cursor = addMonthsClamped(start, totalMonths);
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  let remainder = Math.max(0, now.getTime() - cursor.getTime());
  const days = Math.floor(remainder / 86_400_000);
  remainder -= days * 86_400_000;
  const hours = Math.floor(remainder / 3_600_000);
  remainder -= hours * 3_600_000;
  const minutes = Math.floor(remainder / 60_000);
  remainder -= minutes * 60_000;
  const seconds = Math.floor(remainder / 1_000);
  return [years, months, days, hours, minutes, seconds];
}

export function initCounter(data) {
  const container = $("#counter-units");
  const note = $("#counter-note");
  const phrase = $("#counter-phrase");
  if (!container) return;

  phrase.textContent = data.counter?.phrase || "Cada momento ao seu lado é especial.";
  const values = UNITS.map((unit, index) => {
    const card = createElement("div", "counter-unit");
    const number = createElement("strong", "", "—");
    number.id = `counter-value-${index}`;
    const label = createElement("span", "", unit);
    card.append(number, label);
    container.append(card);
    return number;
  });

  const startValue = data.couple?.relationshipStart;
  const start = startValue ? new Date(startValue) : null;
  if (!start || Number.isNaN(start.getTime())) {
    note.textContent = "Configure a data de início do relacionamento em js/data/site-data.js.";
    return;
  }
  if (start > new Date()) {
    note.textContent = "A data configurada está no futuro. Confira o campo relationshipStart.";
    return;
  }

  note.textContent = "";
  const update = () => {
    const parts = calculateParts(start, new Date());
    values.forEach((element, index) => { element.textContent = String(parts[index]); });
  };
  update();
  window.setInterval(update, 1000);
}
