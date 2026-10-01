(function () {
  "use strict";

  const finePointer = window.matchMedia("(pointer: fine)");
  const wideLayout = window.matchMedia("(min-width: 1001px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || !wideLayout.matches || reducedMotion.matches) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  canvas.className = "ambient-spotlight";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  let width = 0;
  let height = 0;
  let pointerX = -1000;
  let pointerY = -1000;
  let frame = 0;
  let resizeFrame = 0;
  let visible = true;
  let disabled = false;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);

  const resize = () => {
    resizeFrame = 0;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.round(width * pixelRatio * 0.55));
    canvas.height = Math.max(1, Math.round(height * pixelRatio * 0.55));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    draw();
  };

  const drawGlow = (x, y, radius, color, alpha) => {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
    gradient.addColorStop(0.48, `rgba(${color}, ${alpha * 0.34})`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  };

  function draw() {
    frame = 0;
    if (disabled || !visible || document.visibilityState !== "visible") return;

    context.clearRect(0, 0, width, height);
    if (pointerX >= 0 && pointerY >= 0) {
      drawGlow(pointerX, pointerY, Math.min(600, width * 0.56), "249, 115, 22", 0.12);
      drawGlow(pointerX, pointerY, Math.min(410, width * 0.4), "217, 70, 156", 0.055);
    }
  }

  const onPointerMove = (event) => {
    if (disabled) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${pointerY}px`);
    document.documentElement.style.setProperty("--glow-x", `${(pointerX / width) * 100}%`);
    document.documentElement.style.setProperty("--glow-y", `${(pointerY / height) * 100}%`);
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const onPointerLeave = () => {
    pointerX = -1000;
    pointerY = -1000;
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const onVisibilityChange = () => {
    visible = document.visibilityState === "visible";
    if (!visible && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (visible) {
      draw();
    }
  };

  const syncEligibility = () => {
    disabled = !finePointer.matches || !wideLayout.matches || reducedMotion.matches;
    canvas.style.display = disabled ? "none" : "block";
    if (disabled) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      context.clearRect(0, 0, width, height);
      return;
    }
    resize();
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerout", (event) => {
    if (event.relatedTarget === null) onPointerLeave();
  }, { passive: true });
  window.addEventListener("resize", () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(resize);
  }, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  reducedMotion.addEventListener("change", syncEligibility);
  finePointer.addEventListener("change", syncEligibility);
  wideLayout.addEventListener("change", syncEligibility);
  resize();

  window.addEventListener("pagehide", () => {
    if (frame) cancelAnimationFrame(frame);
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    reducedMotion.removeEventListener("change", syncEligibility);
    finePointer.removeEventListener("change", syncEligibility);
    wideLayout.removeEventListener("change", syncEligibility);
    canvas.remove();
  }, { once: true });
})();
