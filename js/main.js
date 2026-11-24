import { SITE_DATA } from "./data/site-data.js";
import { $ } from "./utils/helpers.js";
import { initEntrance } from "./modules/entrance.js";
import { initTimeline } from "./modules/timeline.js";
import { initCounter } from "./modules/counter.js";
import { initReasons } from "./modules/reasons.js";
import { initGallery } from "./modules/gallery.js";
import { initLetter } from "./modules/letter.js";
import { initMusic } from "./modules/music.js";
import { initDreams } from "./modules/dreams.js";
import { initSurprises } from "./modules/surprises.js";
import { initAnimations } from "./modules/animations.js";
import { initParticles } from "./modules/particles.js";

function applyPersonalData() {
  const herName = SITE_DATA.couple?.herName || "[NOME DELA]";
  const myName = SITE_DATA.couple?.myName || "[SEU NOME]";
  $("#gate-greeting").textContent = SITE_DATA.introduction?.greeting || "Para alguém especial";
  $("#gate-name").textContent = herName;
  $("#gate-photo").src = SITE_DATA.introduction?.coverPhoto || "assets/images/cover-placeholder.svg";
  $("#final-photo").src = SITE_DATA.ending?.photo || "assets/images/final-placeholder.svg";
  $("#final-quote").textContent = `“${SITE_DATA.ending?.declaration || "[SUA DECLARAÇÃO]"}”`;
  $("#final-message").textContent = SITE_DATA.ending?.message || "[SUA MENSAGEM FINAL]";
  $("#final-signature").textContent = `— ${myName}`;
  document.title = `Nosso Cantinho · ${herName}`;

  [$("#gate-photo"), $("#final-photo")].forEach((image) => {
    image?.addEventListener("error", () => { image.src = "assets/images/cover-placeholder.svg"; }, { once: true });
  });
}

applyPersonalData();
initEntrance();
initTimeline(SITE_DATA);
initCounter(SITE_DATA);
initReasons(SITE_DATA);
initGallery(SITE_DATA);
initLetter(SITE_DATA);
initMusic(SITE_DATA);
const burst = initParticles();
initDreams(SITE_DATA, burst);
initSurprises(SITE_DATA, burst);
initAnimations();
