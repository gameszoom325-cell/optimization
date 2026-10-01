import { createContext, createElement, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollContext = createContext(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const wideScreen = window.matchMedia("(min-width: 901px)");
    let lenis;
    let ticker;

    const sync = () => {
      if (reducedMotion.matches || !finePointer.matches || !wideScreen.matches) {
        if (ticker) gsap.ticker.remove(ticker);
        ticker = undefined;
        lenis?.destroy();
        lenis = undefined;
        lenisRef.current = null;
        return;
      }
      if (lenis) return;

      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.85,
        touchMultiplier: 1,
        anchors: { offset: -84 }
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
    };

    reducedMotion.addEventListener("change", sync);
    finePointer.addEventListener("change", sync);
    wideScreen.addEventListener("change", sync);
    sync();

    return () => {
      if (ticker) gsap.ticker.remove(ticker);
      reducedMotion.removeEventListener("change", sync);
      finePointer.removeEventListener("change", sync);
      wideScreen.removeEventListener("change", sync);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value = useMemo(() => ({ lenisRef }), []);
  return createElement(SmoothScrollContext.Provider, { value }, children);
}

export function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0;
      const percent = Math.round(progress * 100);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
        barRef.current.setAttribute("aria-valuenow", String(percent));
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("load", scheduleUpdate, { once: true });
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return createElement("div", {
    ref: barRef,
    className: "scroll-progress",
    role: "progressbar",
    "aria-label": "Page scroll progress",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": "0"
  });
}
