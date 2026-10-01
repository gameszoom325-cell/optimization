(function () {
  "use strict";

  const pointerFine = window.matchMedia("(pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const targets = [...document.querySelectorAll(".magnetic, .nav-links a, .menu-toggle")];
  const handlers = new Map();

  const clearTarget = (target, handler) => {
    target.removeEventListener("pointermove", handler.onMove);
    target.removeEventListener("pointerleave", handler.onLeave);
    if (window.gsap) {
      window.gsap.killTweensOf(target, "x,y");
      window.gsap.set(target, { x: 0, y: 0 });
    } else {
      target.style.removeProperty("transform");
    }
    handlers.delete(target);
  };

  const bindTarget = (target) => {
    if (handlers.has(target)) return;

    const moveX = window.gsap
      ? window.gsap.quickTo(target, "x", { duration: 0.32, ease: "power3.out" })
      : null;
    const moveY = window.gsap
      ? window.gsap.quickTo(target, "y", { duration: 0.32, ease: "power3.out" })
      : null;

    const onMove = (event) => {
      if (reducedMotion.matches || !pointerFine.matches) return;
      const bounds = target.getBoundingClientRect();
      const offsetX = event.clientX - bounds.left - bounds.width / 2;
      const offsetY = event.clientY - bounds.top - bounds.height / 2;
      const x = offsetX * 0.09;
      const y = offsetY * 0.11;
      if (moveX && moveY) {
        moveX(x);
        moveY(y);
      } else {
        target.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const onLeave = () => {
      if (moveX && moveY) {
        moveX(0);
        moveY(0);
      } else {
        target.style.removeProperty("transform");
      }
    };

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave, { passive: true });
    handlers.set(target, { onMove, onLeave });
  };

  const sync = () => {
    if (pointerFine.matches && !reducedMotion.matches) {
      targets.forEach(bindTarget);
      return;
    }
    handlers.forEach((handler, target) => clearTarget(target, handler));
  };

  const onEnvironmentChange = () => sync();
  pointerFine.addEventListener("change", onEnvironmentChange);
  reducedMotion.addEventListener("change", onEnvironmentChange);
  sync();

  window.addEventListener("pagehide", () => {
    handlers.forEach((handler, target) => clearTarget(target, handler));
    pointerFine.removeEventListener("change", onEnvironmentChange);
    reducedMotion.removeEventListener("change", onEnvironmentChange);
  }, { once: true });
})();
