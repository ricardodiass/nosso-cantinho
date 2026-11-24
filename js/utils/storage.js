const DREAMS_KEY = "nosso-cantinho:dreams:v1";

export function loadDreams(defaultDreams = []) {
  try {
    const saved = JSON.parse(localStorage.getItem(DREAMS_KEY));
    if (!Array.isArray(saved)) {
      return defaultDreams.map((text, index) => ({ id: `default-${index}`, text, done: false }));
    }

    return saved
      .filter((item) => item && typeof item.text === "string")
      .map((item, index) => ({
        id: typeof item.id === "string" ? item.id : `saved-${index}`,
        text: item.text.slice(0, 120),
        done: Boolean(item.done),
      }));
  } catch {
    return defaultDreams.map((text, index) => ({ id: `default-${index}`, text, done: false }));
  }
}

export function saveDreams(dreams) {
  try {
    localStorage.setItem(DREAMS_KEY, JSON.stringify(dreams));
    return true;
  } catch {
    return false;
  }
}
