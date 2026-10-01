(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  const parallax = window.gsap.matchMedia();
  parallax.add("(min-width: 1001px) and (pointer: fine)", () => {
    const grid = document.querySelector(".hero-grid");
    const hero = document.querySelector(".hero");
    if (!grid || !hero) return;

    const tween = window.gsap.to(grid, {
      y: 12,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        invalidateOnRefresh: true
      }
    });
    return () => tween.scrollTrigger && tween.scrollTrigger.kill();
  });

  const onMotionPreferenceChange = (event) => {
    if (event.matches) parallax.revert();
  };
  reducedMotion.addEventListener("change", onMotionPreferenceChange);
  window.addEventListener("pagehide", () => {
    parallax.revert();
    reducedMotion.removeEventListener("change", onMotionPreferenceChange);
  }, { once: true });
})();
