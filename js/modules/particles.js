import { $, prefersReducedMotion } from "../utils/helpers.js";

export function initParticles() {
  const canvas = $("#fx");
  const context = canvas?.getContext("2d");
  if (!canvas || !context || prefersReducedMotion()) return () => {};

  let particles = [];
  let frameId;
  let width = 0;
  let height = 0;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const makeParticle = (x, y, burst = false) => ({
    x, y,
    speed: burst ? 1.1 + Math.random() * 2 : .2 + Math.random() * .35,
    size: burst ? 9 + Math.random() * 12 : 8 + Math.random() * 8,
    alpha: burst ? .9 : .17 + Math.random() * .2,
    drift: (Math.random() - .5) * (burst ? 1.6 : .25),
    life: burst ? 85 : Number.POSITIVE_INFINITY,
    color: Math.random() < .18 ? "#c9a25b" : "#b23a52",
  });

  const burst = (count = 16) => {
    for (let index = 0; index < count; index += 1) {
      particles.push(makeParticle(Math.random() * width, height + 12, true));
    }
    if (particles.length > 120) particles = particles.slice(-120);
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;
      if (Number.isFinite(particle.life)) particle.life -= 1;
      context.globalAlpha = Number.isFinite(particle.life)
        ? Math.max(0, Math.min(1, particle.life / 18) * particle.alpha)
        : particle.alpha;
      context.fillStyle = particle.color;
      context.font = `${particle.size}px serif`;
      context.fillText("♥", particle.x, particle.y);
      if (!Number.isFinite(particle.life) && particle.y < -20) {
        particle.y = height + 12;
        particle.x = Math.random() * width;
      }
    });
    particles = particles.filter((particle) => !Number.isFinite(particle.life) || (particle.life > 0 && particle.y > -30));
    context.globalAlpha = 1;
    frameId = window.requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  for (let index = 0; index < 12; index += 1) particles.push(makeParticle(Math.random() * width, Math.random() * height));
  draw();

  document.addEventListener("cantinho:entered", () => burst(22));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) window.cancelAnimationFrame(frameId);
    else draw();
  });

  return burst;
}
