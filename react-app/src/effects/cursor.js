const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export function magneticOffset(pointerX, pointerY, bounds, strength = 0.12, limit = 14) {
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  return {
    x: clamp((pointerX - centerX) * strength, -limit, limit),
    y: clamp((pointerY - centerY) * strength, -limit, limit)
  };
}

export function createCursorController({ dot, ring }) {
  let pointerX = -100;
  let pointerY = -100;
  let ringX = pointerX;
  let ringY = pointerY;
  let frame = 0;
  let active = false;
  let enabled = true;

  const render = () => {
    frame = 0;
    if (!enabled) return;
    const dx = pointerX - ringX;
    const dy = pointerY - ringY;
    ringX += dx * 0.19;
    ringY += dy * 0.19;
    dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    if (Math.abs(dx) > 0.16 || Math.abs(dy) > 0.16) frame = requestAnimationFrame(render);
  };

  const schedule = () => {
    if (!frame && enabled) frame = requestAnimationFrame(render);
  };

  const onPointerMove = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!active) {
      active = true;
      ringX = pointerX;
      ringY = pointerY;
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    }
    schedule();
  };

  const onPointerOver = (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("a, button, [role='button'], [data-cursor-hover]")
      : null;
    ring.classList.toggle("is-hover", Boolean(target));
    dot.classList.toggle("is-hover", Boolean(target));
  };

  const onPointerLeave = () => {
    active = false;
    dot.classList.remove("is-visible", "is-hover");
    ring.classList.remove("is-visible", "is-hover");
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);

  return {
    setEnabled(nextEnabled) {
      enabled = nextEnabled;
      if (!enabled) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        onPointerLeave();
      }
    },
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      dot.classList.remove("is-visible", "is-hover");
      ring.classList.remove("is-visible", "is-hover");
    }
  };
}
