const particleColors = [
  [249, 115, 22],
  [216, 70, 156],
  [155, 109, 255]
];

export function mountParticles(canvas) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => {};

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreen = window.matchMedia("(max-width: 700px)");
  let width = 0;
  let height = 0;
  let particles = [];
  let frame = 0;
  let resizeFrame = 0;
  let visible = false;
  let pageVisible = document.visibilityState === "visible";
  let lastTime = 0;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { rootMargin: "100px" });

  const resize = () => {
    resizeFrame = 0;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const density = smallScreen.matches ? 1 : 1.4;
    const ratio = Math.min(window.devicePixelRatio || 1, density) * 0.68;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(smallScreen.matches ? 32 : 72, Math.max(20, Math.floor(width * height / 24000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.1 + 0.35,
      alpha: Math.random() * 0.4 + 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.00016 + 0.00006,
      driftX: (Math.random() - 0.5) * 0.018,
      driftY: (Math.random() - 0.5) * 0.014,
      color: particleColors[Math.floor(Math.random() * particleColors.length)]
    }));
    draw(0, true);
    sync();
  };

  const draw = (time, staticFrame = false) => {
    frame = 0;
    if (!pageVisible || !width || !height || (!visible && !staticFrame)) return;
    if (!reducedMotion.matches && !staticFrame && time - lastTime < 30) {
      frame = requestAnimationFrame(draw);
      return;
    }
    const elapsed = lastTime ? Math.min(50, time - lastTime) : 30;
    lastTime = time;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      if (!reducedMotion.matches && !staticFrame) {
        particle.x = (particle.x + particle.driftX * elapsed + width) % width;
        particle.y = (particle.y + particle.driftY * elapsed + height) % height;
      }
      const pulse = reducedMotion.matches ? 1 : 0.76 + Math.sin(time * particle.speed + particle.phase) * 0.24;
      const [red, green, blue] = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${particle.alpha * pulse})`;
      context.fill();
    });

    if (!reducedMotion.matches && visible && pageVisible) frame = requestAnimationFrame(draw);
  };

  const sync = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (!reducedMotion.matches && visible && pageVisible) frame = requestAnimationFrame(draw);
    else if (visible && pageVisible) draw(0, true);
  };

  const onResize = () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(resize);
  };
  const onVisibility = () => {
    pageVisible = document.visibilityState === "visible";
    sync();
  };

  observer.observe(canvas);
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  reducedMotion.addEventListener("change", sync);
  smallScreen.addEventListener("change", onResize);
  resize();

  return () => {
    if (frame) cancelAnimationFrame(frame);
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    reducedMotion.removeEventListener("change", sync);
    smallScreen.removeEventListener("change", onResize);
  };
}
