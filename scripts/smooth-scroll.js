(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const desktopLayout = window.matchMedia("(min-width: 900px)");
  let instance = null;
  let tickerCallback = null;
  let fallbackFrame = 0;
  let destroyed = false;

  const loadLenis = () => {
    if (window.Lenis) return Promise.resolve(window.Lenis);

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./assets/vendor/lenis-1.1.20.min.js";
      script.async = true;
      script.addEventListener("load", () => {
        if (window.Lenis) resolve(window.Lenis);
        else reject(new Error("Lenis loaded without exposing its constructor."));
      }, { once: true });
      script.addEventListener("error", () => reject(new Error("Lenis could not be loaded.")), { once: true });
      document.head.append(script);
    });
  };

  const stopFallback = () => {
    if (!fallbackFrame) return;
    cancelAnimationFrame(fallbackFrame);
    fallbackFrame = 0;
  };

  const startFallback = () => {
    if (destroyed || fallbackFrame || document.visibilityState !== "visible") return;
    const frame = (time) => {
      fallbackFrame = 0;
      if (destroyed || document.visibilityState !== "visible") return;
      instance.raf(time);
      fallbackFrame = requestAnimationFrame(frame);
    };
    fallbackFrame = requestAnimationFrame(frame);
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    stopFallback();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (tickerCallback && window.gsap) window.gsap.ticker.remove(tickerCallback);
    if (instance) instance.destroy();
    instance = null;
    window.KnoxLenis = null;
  };

  const onVisibilityChange = () => {
    if (!instance || window.gsap) return;
    if (document.visibilityState === "visible") startFallback();
    else stopFallback();
  };

  const init = async () => {
    if (destroyed || reducedMotion.matches || coarsePointer.matches || !desktopLayout.matches) return;

    try {
      const Lenis = await loadLenis();
      if (destroyed || reducedMotion.matches || coarsePointer.matches || !desktopLayout.matches) return;

      instance = new Lenis({
        autoRaf: false,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.86,
        touchMultiplier: 1,
        anchors: {
          offset: -76,
          onComplete: () => {
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          }
        }
      });

      if (window.gsap) {
        tickerCallback = (time) => instance && instance.raf(time * 1000);
        window.gsap.ticker.add(tickerCallback);
      } else {
        startFallback();
      }

      if (window.ScrollTrigger) {
        instance.on("scroll", window.ScrollTrigger.update);
      }
      document.addEventListener("visibilitychange", onVisibilityChange);
      window.KnoxLenis = instance;
    } catch (error) {
      console.warn("Smooth scrolling is unavailable; native scrolling remains active.", error);
    }
  };

  window.addEventListener("pagehide", destroy, { once: true });
  const onEnvironmentChange = () => {
    if (reducedMotion.matches || coarsePointer.matches || !desktopLayout.matches) destroy();
  };
  reducedMotion.addEventListener("change", onEnvironmentChange);
  coarsePointer.addEventListener("change", onEnvironmentChange);
  desktopLayout.addEventListener("change", onEnvironmentChange);

  init();
})();
