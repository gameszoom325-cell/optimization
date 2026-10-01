(function () {
  "use strict";

  const pointerFine = window.matchMedia("(pointer: fine)");
  const wideLayout = window.matchMedia("(min-width: 721px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  if (!cursor || !ring || !pointerFine.matches || !wideLayout.matches || reducedMotion.matches) return;

  document.body.classList.add("has-custom-cursor");
  cursor.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");

  let moveToX = null;
  let moveToY = null;
  let pointerInside = false;

  if (window.gsap) {
    moveToX = window.gsap.quickTo(ring, "x", { duration: 0.22, ease: "power3.out" });
    moveToY = window.gsap.quickTo(ring, "y", { duration: 0.22, ease: "power3.out" });
  }

  const onPointerMove = (event) => {
    pointerInside = true;
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    if (moveToX && moveToY) {
      moveToX(event.clientX);
      moveToY(event.clientY);
    } else {
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
    }
    cursor.classList.add("is-visible");
    ring.classList.add("is-visible");
  };

  const onPointerLeave = () => {
    pointerInside = false;
    cursor.classList.remove("is-visible", "is-hover");
    ring.classList.remove("is-visible", "is-hover");
  };

  const onPointerOver = (event) => {
    const interactive = event.target.closest("a, button, [role='button'], .skill-module, .project-card");
    cursor.classList.toggle("is-hover", Boolean(interactive));
    ring.classList.toggle("is-hover", Boolean(interactive));
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  const onPointerOut = (event) => {
    if (event.relatedTarget === null) onPointerLeave();
  };
  const onVisibilityChange = () => {
    if (document.visibilityState !== "visible" && pointerInside) onPointerLeave();
  };
  const stopCursor = () => {
    onPointerLeave();
    document.body.classList.remove("has-custom-cursor");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerout", onPointerOut);
    document.removeEventListener("pointerover", onPointerOver);
    document.removeEventListener("pointerleave", onPointerLeave);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
  const onEligibilityChange = () => {
    if (!pointerFine.matches || !wideLayout.matches || reducedMotion.matches) stopCursor();
  };
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibilityChange);
  reducedMotion.addEventListener("change", onEligibilityChange);
  pointerFine.addEventListener("change", onEligibilityChange);
  wideLayout.addEventListener("change", onEligibilityChange);

  window.addEventListener("pagehide", () => {
    stopCursor();
    reducedMotion.removeEventListener("change", onEligibilityChange);
    pointerFine.removeEventListener("change", onEligibilityChange);
    wideLayout.removeEventListener("change", onEligibilityChange);
  }, { once: true });
})();
