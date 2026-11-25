const DREAMS_KEY = "nosso-cantinho:dreams:v1";
const DREAMS_DEFAULTS_VERSION_KEY = "nosso-cantinho:dreams-defaults-version";
const CURRENT_DEFAULTS_VERSION = "2";

function createDefaultDreams(defaultDreams) {
  return defaultDreams.map((text, index) => ({
    id: `default-v2-${index}`,
    text,
    done: false,
  }));
}

function normalizeDream(text) {
  return text.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function loadDreams(defaultDreams = []) {
  try {
    const saved = JSON.parse(localStorage.getItem(DREAMS_KEY));

    let dreams = Array.isArray(saved)
      ? saved
          .filter((item) => item && typeof item.text === "string")
          .map((item, index) => ({
            id: typeof item.id === "string" ? item.id : `saved-${index}`,
            text: item.text.slice(0, 120),
            done: Boolean(item.done),
          }))
      : createDefaultDreams(defaultDreams);

    const defaultsVersion = localStorage.getItem(DREAMS_DEFAULTS_VERSION_KEY);

    if (defaultsVersion !== CURRENT_DEFAULTS_VERSION) {
      // Remove apenas exemplos antigos ainda não realizados.
      // Sonhos concluídos e sonhos adicionados pelo casal são preservados.
      if (Array.isArray(saved)) {
        dreams = dreams.filter(
          (dream) => !(/^default-\d+$/.test(dream.id) && !dream.done)
        );
      }

      const existing = new Set(dreams.map((dream) => normalizeDream(dream.text)));

      defaultDreams.forEach((text, index) => {
        const normalized = normalizeDream(text);

        if (!existing.has(normalized)) {
          dreams.push({
            id: `default-v2-${index}`,
            text,
            done: false,
          });
          existing.add(normalized);
        }
      });

      localStorage.setItem(DREAMS_KEY, JSON.stringify(dreams));
      localStorage.setItem(DREAMS_DEFAULTS_VERSION_KEY, CURRENT_DEFAULTS_VERSION);
    }

    return dreams;
  } catch {
    return createDefaultDreams(defaultDreams);
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


const TIMELINE_KEY = "nosso-cantinho:timeline:v1";
const TIMELINE_MAX_STORAGE_CHARS = 1_800_000;
const TIMELINE_MAX_IMAGE_CHARS = 480_000;

export function loadTimelineEvents() {
  try {
    const saved = JSON.parse(localStorage.getItem(TIMELINE_KEY));

    if (!Array.isArray(saved)) return [];

    return saved
      .filter((item) => (
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        item.title.trim() &&
        typeof item.date === "string" &&
        /^\d{2}\/\d{2}\/\d{4}$/.test(item.date)
      ))
      .map((item) => ({
        id: item.id.slice(0, 100),
        date: item.date,
        title: item.title.trim().slice(0, 100),
        description: typeof item.description === "string"
          ? item.description.slice(0, 700)
          : "",
        photo: (
          typeof item.photo === "string" &&
          item.photo.length <= TIMELINE_MAX_IMAGE_CHARS &&
          /^data:image\/(?:webp|jpeg);base64,/.test(item.photo)
        ) ? item.photo : null,
      }));
  } catch {
    return [];
  }
}

export function saveTimelineEvents(events) {
  try {
    if (!Array.isArray(events)) return false;

    const serialized = JSON.stringify(events);

    // Limite conservador para não ocupar todo o espaço do localStorage.
    if (serialized.length > TIMELINE_MAX_STORAGE_CHARS) return false;

    localStorage.setItem(TIMELINE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}
