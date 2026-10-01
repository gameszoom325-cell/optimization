(function () {
  "use strict";

  const finePointer = window.matchMedia("(pointer: fine)");
  const wideLayout = window.matchMedia("(min-width: 1001px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || !wideLayout.matches) return;

  const cards = [...document.querySelectorAll(".project-card.tilt-card")];
  const cleanups = [];
  const resetTilts = () => {
    if (!window.gsap) return;
    cards.forEach((card) => {
      window.gsap.killTweensOf(card, "rotationX,rotationY,y");
      window.gsap.set(card, { rotationX: 0, rotationY: 0, y: 0 });
    });
  };

  const setCardSpot = (card, event) => {
    const bounds = card.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.setProperty("--spot-x", `${x * 100}%`);
    card.style.setProperty("--spot-y", `${y * 100}%`);
  };

  cards.forEach((card) => {
    if (!reducedMotion.matches && window.gsap) {
      const rotateX = window.gsap.quickTo(card, "rotationX", { duration: 0.3, ease: "power3.out" });
      const rotateY = window.gsap.quickTo(card, "rotationY", { duration: 0.3, ease: "power3.out" });
      const lift = window.gsap.quickTo(card, "y", { duration: 0.26, ease: "power3.out" });
      window.gsap.set(card, { transformPerspective: 1000, transformOrigin: "50% 50%", force3D: true });

      const onMove = (event) => {
        if (reducedMotion.matches || !wideLayout.matches || !finePointer.matches) {
          resetTilts();
          return;
        }
        const bounds = card.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        setCardSpot(card, event);
        rotateX((0.5 - y) * 4.5);
        rotateY((x - 0.5) * 5);
        lift(-3);
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
        lift(0);
      };

      card.addEventListener("pointermove", onMove, { passive: true });
      card.addEventListener("pointerleave", onLeave, { passive: true });
      cleanups.push(() => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      });
    } else {
      const onMove = (event) => setCardSpot(card, event);
      card.addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => card.removeEventListener("pointermove", onMove));
    }
  });

  const onMotionPreferenceChange = (event) => {
    if (event.matches) resetTilts();
  };
  reducedMotion.addEventListener("change", onMotionPreferenceChange);
  const onPointerOrLayoutChange = () => {
    if (!wideLayout.matches || !finePointer.matches) resetTilts();
  };
  wideLayout.addEventListener("change", onPointerOrLayoutChange);
  finePointer.addEventListener("change", onPointerOrLayoutChange);

  window.addEventListener("pagehide", () => {
    cleanups.forEach((cleanup) => cleanup());
    reducedMotion.removeEventListener("change", onMotionPreferenceChange);
    wideLayout.removeEventListener("change", onPointerOrLayoutChange);
    finePointer.removeEventListener("change", onPointerOrLayoutChange);
  }, { once: true });
})();
